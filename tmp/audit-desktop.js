const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();
  
  const consoleMessages = [];
  page.on('console', msg => consoleMessages.push(msg.type() + ': ' + msg.text()));
  
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(4000);
  
  // Hero screenshot
  await page.screenshot({ path: 'C:/Users/aayan/Downloads/Portfolio/Portfolio v2/tmp/audit-desktop-hero.png', fullPage: false });
  
  // Full page screenshot
  await page.screenshot({ path: 'C:/Users/aayan/Downloads/Portfolio/Portfolio v2/tmp/audit-desktop-full.png', fullPage: true });
  
  // Check horizontal overflow
  const overflow = await page.evaluate(() => {
    return {
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      hasHorizontalScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth
    };
  });
  console.log('OVERFLOW:', JSON.stringify(overflow));
  
  // Check z-index collisions for fixed elements
  const fixedElements = await page.evaluate(() => {
    const all = document.querySelectorAll('*');
    const fixed = [];
    for (const el of all) {
      const style = getComputedStyle(el);
      if (style.position === 'fixed' && el.offsetHeight > 0) {
        const rect = el.getBoundingClientRect();
        fixed.push({
          tag: el.tagName,
          classes: el.className.substring(0, 120),
          zIndex: style.zIndex,
          top: Math.round(rect.top),
          left: Math.round(rect.left),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          text: el.textContent.substring(0, 60).trim()
        });
      }
    }
    return fixed;
  });
  console.log('FIXED_ELEMENTS:', JSON.stringify(fixedElements, null, 2));
  
  // Check nav visibility
  const nav = await page.evaluate(() => {
    const navEl = document.querySelector('nav');
    if (navEl) {
      const s = getComputedStyle(navEl);
      return { display: s.display, visibility: s.visibility, width: navEl.offsetWidth, height: navEl.offsetHeight };
    }
    return null;
  });
  console.log('NAV:', JSON.stringify(nav));
  
  // Check SYS.ONLINE HUD vs nav overlap
  const hudVsNav = await page.evaluate(() => {
    const header = document.querySelector('header');
    const hudParent = document.querySelector('.hidden.xl\\:block');
    if (!header || !hudParent) return { headerRect: null, hudRect: null };
    
    const headerRect = header.getBoundingClientRect();
    const hudRect = hudParent.getBoundingClientRect();
    
    return {
      header: { top: headerRect.top, left: headerRect.left, right: headerRect.right, width: headerRect.width, height: headerRect.height },
      hud: { top: hudRect.top, left: hudRect.left, right: hudRect.right, width: hudRect.width, height: hudRect.height },
      overlaps: hudRect.top < headerRect.bottom && hudRect.bottom > headerRect.top && hudRect.left < headerRect.right && hudRect.right > headerRect.left
    };
  });
  console.log('HUD_VS_NAV:', JSON.stringify(hudVsNav));
  
  // Check project card truncation
  const projectCards = await page.evaluate(() => {
    const cards = document.querySelectorAll('[class*="project"]');
    const results = [];
    for (const card of cards) {
      if (card.offsetWidth > 0) {
        const text = card.textContent.substring(0, 80).trim();
        if (text.length > 5) {
          results.push({ text, width: card.offsetWidth, height: card.offsetHeight });
        }
      }
    }
    return results.slice(0, 10);
  });
  console.log('PROJECT_CARDS:', JSON.stringify(projectCards));
  
  // Scroll to check fixed header overlap on content
  await page.evaluate(() => window.scrollTo(0, 1500));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'C:/Users/aayan/Downloads/Portfolio/Portfolio v2/tmp/audit-desktop-scrolled.png', fullPage: false });
  
  const scrollOverlap = await page.evaluate(() => {
    const header = document.querySelector('header');
    const headerRect = header ? header.getBoundingClientRect() : null;
    const sections = ['summary', 'experience', 'projects', 'skills', 'education'];
    const results = [];
    
    for (const id of sections) {
      const el = document.getElementById(id);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      results.push({
        id,
        top: Math.round(rect.top),
        bottom: Math.round(rect.bottom),
        hiddenByHeader: headerRect ? rect.top < headerRect.bottom : false
      });
    }
    return results;
  });
  console.log('SCROLL_OVERLAP_DESKTOP:', JSON.stringify(scrollOverlap));
  
  // Check bottom bar position
  const bottomBar = await page.evaluate(() => {
    const allFixed = document.querySelectorAll('.fixed');
    const results = [];
    for (const el of allFixed) {
      const rect = el.getBoundingClientRect();
      if (rect.top > 900 && el.offsetHeight > 0) {
        results.push({
          text: el.textContent.substring(0, 50).trim(),
          top: Math.round(rect.top),
          left: Math.round(rect.left),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          zIndex: getComputedStyle(el).zIndex
        });
      }
    }
    return results;
  });
  console.log('BOTTOM_BAR_DESKTOP:', JSON.stringify(bottomBar));
  
  // Console messages
  console.log('CONSOLE_MESSAGES:', JSON.stringify(consoleMessages.slice(0, 15)));
  
  await browser.close();
  console.log('DONE_DESKTOP');
})();
