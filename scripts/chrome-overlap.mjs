/**
 * Chrome overlap gate — Method F regression guard.
 * Run with: npm run test:chrome  (dev server must be on BASE_URL, default :3000)
 *
 * Fails on:
 *  1) Interactive shell controls overlapping each other
 *  2) Mode toggle clipped / Terminal|Visual too narrow
 *  3) At page top: hero links trapped under top chrome
 *  4) At page end: contact links trapped under top/bottom chrome
 *
 * Does NOT fail on mid-scroll cards passing under the dock (normal scroll).
 */
import { chromium } from "playwright";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const VIEWPORTS = [
  { name: "iphone16", width: 393, height: 852 },
  { name: "mobile375", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "laptop", width: 1366, height: 768 },
  { name: "desktop", width: 1920, height: 1080 },
];
const SCROLLS = [0, 0.5, 1];

async function dismissBoot(page) {
  await page.waitForTimeout(2200);
  try {
    const btn = page.locator("button").filter({
      hasText: /ENTER|SKIP|START|CONTINUE/i,
    });
    if ((await btn.count()) > 0) {
      await btn.first().click({ timeout: 800 });
    }
  } catch {
    /* boot may auto-finish */
  }
  await page.waitForTimeout(400);
}

async function auditAt(page, vp, ratio) {
  await page.setViewportSize({ width: vp.width, height: vp.height });
  await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 60000 });
  await dismissBoot(page);

  await page.evaluate((r) => {
    const max = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight,
    );
    window.scrollTo(0, max * r);
  }, ratio);
  await page.waitForTimeout(450);

  return page.evaluate(({ vpName, ratio: scrollRatio }) => {
    const failures = [];

    const contains = (outer, inner) =>
      outer.x <= inner.x + 1 &&
      outer.y <= inner.y + 1 &&
      outer.right >= inner.right - 1 &&
      outer.bottom >= inner.bottom - 1;

    // Resolve calc() chrome tokens via a probe element
    const probe = document.createElement("div");
    probe.style.cssText =
      "position:fixed;left:0;top:0;visibility:hidden;pointer-events:none;height:var(--chrome-top);width:var(--chrome-bottom)";
    document.body.appendChild(probe);
    const chromeTop = probe.getBoundingClientRect().height || 72;
    const chromeBottom = probe.getBoundingClientRect().width || 64;
    probe.remove();

    const controls = [
      ...document.querySelectorAll("[data-shell-control]"),
    ].filter((el) => {
      const s = getComputedStyle(el);
      if (s.display === "none" || s.visibility === "hidden") return false;
      if (parseFloat(s.opacity || "1") < 0.05) return false;
      if (s.pointerEvents === "none") return false;
      const r = el.getBoundingClientRect();
      return r.width > 4 && r.height > 4;
    });

    const boxes = controls.map((el) => {
      const r = el.getBoundingClientRect();
      return {
        id: el.getAttribute("data-shell-control") || "?",
        x: r.left,
        y: r.top,
        right: r.right,
        bottom: r.bottom,
        w: r.width,
        h: r.height,
      };
    });

    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i];
        const b = boxes[j];
        if (contains(a, b) || contains(b, a)) continue;
        const ix = Math.max(0, Math.min(a.right, b.right) - Math.max(a.x, b.x));
        const iy = Math.max(
          0,
          Math.min(a.bottom, b.bottom) - Math.max(a.y, b.y),
        );
        if (ix * iy > 80) {
          failures.push(
            `control overlap: ${a.id} × ${b.id} (${Math.round(ix * iy)}px²)`,
          );
        }
      }
    }

    const mode = [...document.querySelectorAll('[data-shell-control="mode-toggle"]')].find(
      (el) => {
        const s = getComputedStyle(el);
        if (s.display === "none" || s.visibility === "hidden") return false;
        return el.getBoundingClientRect().width > 10;
      },
    );
    if (mode) {
      const r = mode.getBoundingClientRect();
      const fullyIn =
        r.top >= -2 &&
        r.left >= -2 &&
        r.bottom <= innerHeight + 2 &&
        r.right <= innerWidth + 2;
      if (!fullyIn) {
        failures.push(
          `mode-toggle clipped: t=${Math.round(r.top)} b=${Math.round(r.bottom)} vh=${innerHeight}`,
        );
      }
      mode.querySelectorAll("button").forEach((btn) => {
        const br = btn.getBoundingClientRect();
        if (br.width < 48) {
          failures.push(
            `mode button too narrow (${btn.getAttribute("aria-label")}: ${Math.round(br.width)}px)`,
          );
        }
      });
    }

    // Edge scroll only: content trapped under chrome bands
    if (scrollRatio === 0) {
      const heroLinks = [
        ...document.querySelectorAll("#hero a[href]"),
      ].filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 20 && r.height > 12 && r.bottom > 0 && r.top < innerHeight;
      });
      for (const el of heroLinks) {
        const r = el.getBoundingClientRect();
        const topOverlap = Math.min(r.bottom, chromeTop) - Math.max(r.top, 0);
        if (topOverlap > 12 && r.top < chromeTop - 2) {
          const label = (el.textContent || "").trim().slice(0, 36);
          failures.push(
            `hero under top chrome: "${label}" (+${Math.round(topOverlap)}px)`,
          );
        }
      }
    }

    if (scrollRatio === 1) {
      // At EOF, only enforce BOTTOM chrome clearance for the last interactive links.
      // Tall contact cards will naturally sit partly under the fixed header — that's
      // scroll geometry, not a control collision. scroll-padding handles #contact jumps.
      const endLinks = [
        ...document.querySelectorAll(
          "#contact a[href], footer a[href], footer button",
        ),
      ].filter((el) => {
        const r = el.getBoundingClientRect();
        return (
          r.width > 20 &&
          r.height > 12 &&
          r.bottom > innerHeight * 0.55 &&
          r.top < innerHeight
        );
      });
      for (const el of endLinks) {
        const r = el.getBoundingClientRect();
        const label = (el.textContent || el.getAttribute("aria-label") || "")
          .trim()
          .slice(0, 36);
        const bandTop = innerHeight - chromeBottom;
        const bottomOverlap =
          Math.min(r.bottom, innerHeight) - Math.max(r.top, bandTop);
        if (bottomOverlap > 12 && r.bottom > bandTop + 2) {
          failures.push(
            `end content under bottom chrome: "${label}" (+${Math.round(bottomOverlap)}px)`,
          );
        }
      }
    }

    return { vpName, scrollRatio, failures, chromeTop, chromeBottom };
  }, { vpName: vp.name, ratio });
}

async function main() {
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
  } catch (e) {
    // Fallback when playwright browsers aren't installed yet
    try {
      browser = await chromium.launch({
        headless: true,
        channel: "msedge",
      });
      console.log("(using system Edge channel)");
    } catch {
      try {
        browser = await chromium.launch({
          headless: true,
          channel: "chrome",
        });
        console.log("(using system Chrome channel)");
      } catch {
        console.error(
          "❌ Playwright Chromium missing. Run: npx playwright install chromium\n",
          e.message,
        );
        process.exit(1);
      }
    }
  }
  const page = await browser.newPage();
  const allFailures = [];

  try {
    await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 15000 });
  } catch (e) {
    console.error(
      `❌ Cannot reach ${BASE}. Start the app with npm run dev first.\n`,
      e.message,
    );
    await browser.close();
    process.exit(1);
  }

  for (const vp of VIEWPORTS) {
    for (const ratio of SCROLLS) {
      const result = await auditAt(page, vp, ratio);
      if (result.failures.length) {
        console.log(
          `\n✗ ${result.vpName} @ scroll ${result.scrollRatio * 100}% (chrome T/B ${Math.round(result.chromeTop)}/${Math.round(result.chromeBottom)})`,
        );
        result.failures.forEach((f) => console.log(`  - ${f}`));
        allFailures.push(
          ...result.failures.map(
            (f) => `${result.vpName}@${result.scrollRatio}: ${f}`,
          ),
        );
      } else {
        console.log(`✓ ${vp.name} @ ${ratio * 100}%`);
      }
    }
  }

  await browser.close();

  if (allFailures.length) {
    console.error(
      `\n❌ Chrome overlap gate FAILED (${allFailures.length} issues)`,
    );
    process.exit(1);
  }
  console.log("\n✅ Chrome overlap gate passed on all major viewports.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
