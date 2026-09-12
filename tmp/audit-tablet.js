const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 768, height: 1024 } });
  const page = context.pages()[0] || await context.newPage();
  
  const consoleMessages = [];
  page.on('console', msg => consoleMessages.push(msg.type() + ': ' + msg.text()));
  
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(4000);
  
  // Hero screenshot
  await page.screenshot({ path: 'C:/Users/aayan/Downloads/Portfolio/Portfolio v2/tmp/audit-tablet-hero.png', fullPage: false });
  
  // Full page
  await page.screenshot({ path: 'C:/Users/aayan/Downloads/Portfolio/Portfolio v2/tmp/audit-tablet-full.png', fullPage: true });
  
  // Overflow check
  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    hasHorizontalScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth
  }));
  console.log('OVERFLOW_TABLET:', JSON.stringify(overflow));
  
  // Nav visibility
  const nav = await page.evaluate(() => {
    const navEl = document.querySelector('nav');
    if (!navEl) return null;
    const s = getComputedStyle(navEl);
    return { display: s.display, visibility: s.visibility, width: navEl.offsetWidth, height: navEl.offsetHeight, opacity: s.opacity };
  });
  console.log('NAV_TABLET:', JSON.stringify(nav));
  
  // Hamburger check
  const hamburger = await page.evaluate(() => {
    const allBtns = Array.from(document.querySelectorAll('button'));
    const menuLike = allBtns.filter(b => {
      const t = b.textContent.toLowerCase();
      const a = (b.getAttribute('aria-label') || '').toLowerCase();
      return t.includes('menu') || t.includes('☰') || a.includes('menu') || a.includes('toggle');
    });
    return menuLike.map(b => ({ text: b.textContent.trim(), visible: b.offsetWidth > 0, ariaLabel: b.getAttribute('aria-label') }));
  });
  console.log('HAMBURGER_TABLET:', JSON.stringify(hamburger));
  
  // Bottom bar elements
  const bottomBar = await page.evaluate(() => {
    const allFixed = Array.from(document.querySelectorAll('.fixed'));
    return allFixed.filter(el => {
      const rect = el.getBoundingClientRect();
      return rect.top > 800 && el.offsetHeight > 0;
    }).map(el => {
      const rect = el.getBoundingClientRect();
      return {
        text: el.textContent.substring(0, 60).trim(),
        top: Math.round(rect.top),
        left: Math.round(rect.left),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        zIndex: getComputedStyle(el).zIndex,
        display: getComputedStyle(el).display
      };
    });
  });
  console.log('BOTTOM_BAR_TABLET:', JSON.stringify(bottomBar));
  
  // Check SCROLL TO EXPLORE vs SYS_AUDIO collision
  const scrollExplore = await page.evaluate(() => {
    const allEls = Array.from(document.querySelectorAll('*'));
    const scrollEl = allEls.find(e => e.textContent.includes('SCROLL TO EXPLORE') && e.offsetHeight > 0);
    const audioEl = allEls.find(e => e.textContent.includes('SYS_AUDIO') && e.offsetHeight > 0 && e.classList.contains('fixed'));
    
    if (!scrollEl || !audioEl) return { found: false };
    
    const scrollRect = scrollEl.getBoundingClientRect();
    const audioRect = audioEl.getBoundingClientRect();
    
    return {
      found: true,
      scrollExplore: { top: Math.round(scrollRect.top), bottom: Math.round(scrollRect.bottom), left: Math.round(scrollRect.left), right: Math.round(scrollRect.right) },
      sysAudio: { top: Math.round(audioRect.top), bottom: Math.round(audioRect.bottom), left: Math.round(audioRect.left), right: Math.round(audioRect.right) },
      verticalOverlap: scrollRect.top < audioRect.bottom && scrollRect.bottom > audioRect.top,
      horizontalOverlap: scrollRect.left < audioRect.right && scrollRect.right > audioRect.left
    };
  });
  console.log('SCROLL_EXPLORE_VS_AUDIO:', JSON.stringify(scrollExplore));
  
  // Check bottom controls covering content
  const contentCovered = await page.evaluate(() => {
    const bottomRight = document.querySelector('.fixed.bottom-6.right-6');
    if (!bottomRight) return null;
    const rect = bottomRight.getBoundingClientRect();
    
    // What content is at this Y range?
    const allText = Array.from(document.querySelectorAll('p, h1, h2, h3, span, div'));
    const covered = allText.filter(el => {
      const r = el.getBoundingClientRect();
      return r.top >= rect.top - 50 && r.top <= rect.bottom + 20 && el.textContent.trim().length > 5 && el.offsetWidth > 0;
    }).map(el => ({
      tag: el.tagName,
      text: el.textContent.substring(0, 80).trim(),
      top: Math.round(el.getBoundingClientRect().top)
    }));
    
    return {
      controlRect: { top: Math.round(rect.top), left: Math.round(rect.left), width: Math.round(rect.width), height: Math.round(rect.height) },
      coveredContent: covered.slice(0, 10)
    };
  });
  console.log('CONTENT_COVERED_TABLET:', JSON.stringify(contentCovered));
  
  // Scroll and check header overlap
  await page.evaluate(() => window.scrollTo(0, 800));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'C:/Users/aayan/Downloads/Portfolio/Portfolio v2/tmp/audit-tablet-scrolled.png', fullPage: false });
  
  const headerOverlap = await page.evaluate(() => {
    const header = document.querySelector('header');
    if (!header) return null;
    const headerRect = header.getBoundingClientRect();
    
    const sections = ['summary', 'experience', 'projects', 'skills', 'education'];
    return sections.map(id => {
      const el = document.getElementById(id);
      if (!el) return { id, found: false };
      const rect = el.getBoundingClientRect();
      return {
        id,
        top: Math.round(rect.top),
        hiddenByHeader: rect.top < headerRect.bottom,
        headerBottom: Math.round(headerRect.bottom)
      };
    });
  });
  console.log('HEADER_OVERLAP_TABLET:', JSON.stringify(headerOverlap));
  
  // Touch target sizes
  const touchTargets = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button, a, [role="button"]'));
    return btns.filter(b => b.offsetWidth > 0).map(b => {
      const rect = b.getBoundingClientRect();
      return {
        text: b.textContent.substring(0, 30).trim(),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        tooSmall: rect.width < 44 || rect.height < 44
      };
    }).filter(b => b.tooSmall);
  });
  console.log('TOO_SMALL_TOUCH_TARGETS:', JSON.stringify(touchTargets));
  
  console.log('CONSOLE_TABLET:', JSON.stringify(consoleMessages.slice(0, 10)));
  
  await browser.close();
  console.log('DONE_TABLET');
})();
