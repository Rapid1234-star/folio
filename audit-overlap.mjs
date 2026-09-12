import { pathToFileURL } from "node:url";

const { chromium } = await import(
  pathToFileURL(
    "C:/Users/aayan/AppData/Roaming/npm/node_modules/@playwright/mcp/node_modules/playwright/index.mjs",
  ).href
);

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(3000);

const result = await page.evaluate(() => {
  const sections = [
    "hero",
    "summary",
    "experience",
    "projects",
    "skills",
    "education",
  ];
  const data = {};

  for (const s of sections) {
    const el = document.getElementById(s);
    if (el) {
      const r = el.getBoundingClientRect();
      data[s] = {
        top: Math.round(r.top),
        bottom: Math.round(r.bottom),
        left: Math.round(r.left),
        right: Math.round(r.right),
        height: Math.round(r.height),
        width: Math.round(r.width),
      };
    }
  }

  const header = document.querySelector('header[role="banner"]');
  if (header) {
    const r = header.getBoundingClientRect();
    data["nav"] = {
      top: Math.round(r.top),
      bottom: Math.round(r.bottom),
      left: Math.round(r.left),
      right: Math.round(r.right),
      height: Math.round(r.height),
      width: Math.round(r.width),
    };
  }

  const footer = document.querySelector('footer[role="contentinfo"]');
  if (footer) {
    const r = footer.getBoundingClientRect();
    data["footer"] = {
      top: Math.round(r.top),
      bottom: Math.round(r.bottom),
      left: Math.round(r.left),
      right: Math.round(r.right),
      height: Math.round(r.height),
      width: Math.round(r.width),
    };
  }

  // Security banners
  const bannerLabels = [
    "summary",
    "experience",
    "project archives",
    "system capabilities",
    "training and certs",
  ];
  const banners = [];
  bannerLabels.forEach((label) => {
    const el = document.querySelector(`[aria-label="${label}"]`);
    if (el) {
      const r = el.getBoundingClientRect();
      banners.push({
        label,
        top: Math.round(r.top),
        bottom: Math.round(r.bottom),
        left: Math.round(r.left),
        right: Math.round(r.right),
        height: Math.round(r.height),
        width: Math.round(r.width),
      });
    }
  });
  data["banners"] = banners;

  // All h2 headers
  const headers = [];
  document.querySelectorAll("h2").forEach((h) => {
    const r = h.getBoundingClientRect();
    headers.push({
      text: (h.textContent || "").substring(0, 50),
      top: Math.round(r.top),
      bottom: Math.round(r.bottom),
      left: Math.round(r.left),
      right: Math.round(r.right),
    });
  });
  data["h2_headers"] = headers;

  // Progress bar
  const pb = document.getElementById("progress-bar-fill");
  if (pb && pb.parentElement) {
    const r = pb.parentElement.getBoundingClientRect();
    data["progressBar"] = {
      top: Math.round(r.top),
      bottom: Math.round(r.bottom),
      height: Math.round(r.height),
      width: Math.round(r.width),
    };
  }

  // Main content
  const main = document.getElementById("main-content");
  if (main) {
    const r = main.getBoundingClientRect();
    data["main"] = {
      top: Math.round(r.top),
      bottom: Math.round(r.bottom),
      left: Math.round(r.left),
      right: Math.round(r.right),
      height: Math.round(r.height),
      width: Math.round(r.width),
    };
  }

  // Cyber-border cards
  const cards = [];
  document.querySelectorAll(".cyber-border").forEach((c) => {
    const r = c.getBoundingClientRect();
    cards.push({
      top: Math.round(r.top),
      bottom: Math.round(r.bottom),
      left: Math.round(r.left),
      right: Math.round(r.right),
      height: Math.round(r.height),
    });
  });
  data["cyberCards"] = cards;

  // Dock scene
  const dock = document.querySelector(".dock-scene");
  if (dock) {
    const r = dock.getBoundingClientRect();
    data["dockScene"] = {
      top: Math.round(r.top),
      bottom: Math.round(r.bottom),
      left: Math.round(r.left),
      right: Math.round(r.right),
      height: Math.round(r.height),
    };
  }

  // Dock bars
  const bars = [];
  document.querySelectorAll(".dock-bar").forEach((b) => {
    const r = b.getBoundingClientRect();
    bars.push({
      top: Math.round(r.top),
      bottom: Math.round(r.bottom),
      left: Math.round(r.left),
      right: Math.round(r.right),
      width: Math.round(r.width),
      height: Math.round(r.height),
    });
  });
  data["dockBars"] = bars;

  // SectionHeader elements
  const sectionHeaders = [];
  document
    .querySelectorAll('[class*="max-w-5xl"][class*="mx-auto"][class*="mb-6"]')
    .forEach((sh) => {
      const r = sh.getBoundingClientRect();
      sectionHeaders.push({
        top: Math.round(r.top),
        bottom: Math.round(r.bottom),
        left: Math.round(r.left),
        right: Math.round(r.right),
        height: Math.round(r.height),
      });
    });
  data["sectionHeaders"] = sectionHeaders;

  data["scrollHeight"] = document.documentElement.scrollHeight;
  data["viewportHeight"] = window.innerHeight;
  data["viewportWidth"] = window.innerWidth;

  return data;
});

console.log(JSON.stringify(result, null, 2));
await browser.close();
