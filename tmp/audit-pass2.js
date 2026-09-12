const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  
  // === PASS 2: Targeted verification ===
  
  // TEST 1: Desktop terminal mode z-index (Antigravity #4)
  console.log('=== TEST 1: TERMINAL MODE Z-INDEX ===');
  const ctx1 = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const p1 = await ctx1.newPage();
  await p1.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 30000 });
  await p1.waitForTimeout(3000);
  
  // Enable terminal mode
  const termBtn = await p1.$('button:has-text("TERMINAL")');
  if (termBtn) {
    await termBtn.click();
    await p1.waitForTimeout(1500);
    
    // Check section indicators z-index vs terminal drawer
    const termZIndex = await p1.evaluate(() => {
      const navDots = document.querySelector('.fixed.right-6.top-1\\/2');
      const sysLogs = Array.from(document.querySelectorAll('.fixed')).find(el => el.textContent.includes('SYS_TRACE_LOG'));
      
      if (!navDots || !sysLogs) return { found: false };
      
      return {
        navDots: {
          zIndex: getComputedStyle(navDots).zIndex,
          rect: navDots.getBoundingClientRect(),
          visible: navDots.offsetWidth > 0
        },
        sysLogs: {
          zIndex: getComputedStyle(sysLogs).zIndex,
          rect: sysLogs.getBoundingClientRect(),
          visible: sysLogs.offsetWidth > 0
        },
        navDotsOverlapsDrawer: navDots.getBoundingClientRect().left < sysLogs.getBoundingClientRect().right
      };
    });
    console.log('TERMINAL_ZINDEX:', JSON.stringify(termZIndex));
    await p1.screenshot({ path: 'C:/Users/aayan/Downloads/Portfolio/Portfolio v2/tmp/audit-desktop-terminal.png', fullPage: false });
    
    // Switch back
    const visBtn = await p1.$('button:has-text("VISUAL")');
    if (visBtn) await visBtn.click();
    await p1.waitForTimeout(500);
  }
  await ctx1.close();
  
  // TEST 2: Laptop 1366x768 (popular viewport)
  console.log('=== TEST 2: LAPTOP 1366x768 ===');
  const ctx2 = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  const p2 = await ctx2.newPage();
  await p2.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 30000 });
  await p2.waitForTimeout(3000);
  
  await p2.screenshot({ path: 'C:/Users/aayan/Downloads/Portfolio/Portfolio v2/tmp/audit-1366-hero.png', fullPage: false });
  
  const laptop1366 = await p2.evaluate(() => {
    const overflow = document.documentElement.scrollWidth > document.documentElement.clientWidth;
    const nav = document.querySelector('nav');
    const navDisplay = nav ? getComputedStyle(nav).display : 'none';
    
    // Check HUD visibility
    const hud = document.querySelector('.hidden.xl\\:block');
    const hudVisible = hud ? hud.offsetWidth > 0 : false;
    
    // Check bottom bar
    const reboot = document.querySelector('[aria-label="Reboot System"]');
    const rebootVisible = reboot ? getComputedStyle(reboot).display !== 'none' : false;
    
    // Check nav dots
    const navDots = document.querySelector('.hidden.xl\\:flex');
    const navDotsVisible = navDots ? navDots.offsetWidth > 0 : false;
    
    return {
      overflow,
      navDisplay,
      hudVisible,
      rebootVisible,
      navDotsVisible,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight
    };
  });
  console.log('LAPTOP_1366:', JSON.stringify(laptop1366));
  await ctx2.close();
  
  // TEST 3: iPhone 14 (390x844)
  console.log('=== TEST 3: IPHONE 14 390x844 ===');
  const ctx3 = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const p3 = await ctx3.newPage();
  await p3.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 30000 });
  await p3.waitForTimeout(3000);
  
  await p3.screenshot({ path: 'C:/Users/aayan/Downloads/Portfolio/Portfolio v2/tmp/audit-390-hero.png', fullPage: false });
  
  const iphone14 = await p3.evaluate(() => {
    // Bottom bar collision
    const reboot = document.querySelector('[aria-label="Reboot System"]');
    const allFixed = Array.from(document.querySelectorAll('.fixed'));
    const audioTerminal = allFixed.find(el => el.textContent.includes('SYS_AUDIO') && el.textContent.includes('TERMINAL'));
    
    let collision = null;
    if (reboot && audioTerminal) {
      const rRect = reboot.getBoundingClientRect();
      const aRect = audioTerminal.getBoundingClientRect();
      collision = {
        rebootLeft: Math.round(rRect.left),
        rebootRight: Math.round(rRect.right),
        audioLeft: Math.round(aRect.left),
        audioRight: Math.round(aRect.right),
        overlaps: rRect.left < aRect.right && rRect.right > aRect.left,
        totalNeeded: Math.round(rRect.width + aRect.width + 24),
        viewport: window.innerWidth
      };
    }
    
    // TRACE_0 vs hero text
    const trace0 = document.querySelector('button[aria-label="Back to top"]');
    const heroSubtitle = Array.from(document.querySelectorAll('*')).find(el => 
      el.textContent.includes('Password:') && el.offsetHeight > 0 && el.children.length < 3
    );
    
    let headerCollision = null;
    if (trace0 && heroSubtitle) {
      const tRect = trace0.getBoundingClientRect();
      const hRect = heroSubtitle.getBoundingClientRect();
      headerCollision = {
        trace0: { top: Math.round(tRect.top), left: Math.round(tRect.left), width: Math.round(tRect.width), height: Math.round(tRect.height) },
        hero: { top: Math.round(hRect.top), left: Math.round(hRect.left), width: Math.round(hRect.width), height: Math.round(hRect.height) },
        verticalOverlap: tRect.top < hRect.bottom && tRect.bottom > hRect.top,
        horizontalOverlap: tRect.left < hRect.right && tRect.right > hRect.left
      };
    }
    
    return { collision, headerCollision };
  });
  console.log('IPHONE_14:', JSON.stringify(iphone14));
  await ctx3.close();
  
  // TEST 4: Pixel 412x915
  console.log('=== TEST 4: PIXEL 412x915 ===');
  const ctx4 = await browser.newContext({ viewport: { width: 412, height: 915 } });
  const p4 = await ctx4.newPage();
  await p4.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 30000 });
  await p4.waitForTimeout(3000);
  
  await p4.screenshot({ path: 'C:/Users/aayan/Downloads/Portfolio/Portfolio v2/tmp/audit-412-hero.png', fullPage: false });
  
  const pixel = await p4.evaluate(() => {
    const reboot = document.querySelector('[aria-label="Reboot System"]');
    const allFixed = Array.from(document.querySelectorAll('.fixed'));
    const audioTerminal = allFixed.find(el => el.textContent.includes('SYS_AUDIO') && el.textContent.includes('TERMINAL'));
    
    let collision = null;
    if (reboot && audioTerminal) {
      const rRect = reboot.getBoundingClientRect();
      const aRect = audioTerminal.getBoundingClientRect();
      collision = {
        rebootLeft: Math.round(rRect.left),
        rebootRight: Math.round(rRect.right),
        audioLeft: Math.round(aRect.left),
        audioRight: Math.round(aRect.right),
        overlaps: rRect.left < aRect.right && rRect.right > aRect.left,
        totalNeeded: Math.round(rRect.width + aRect.width + 24),
        viewport: window.innerWidth
      };
    }
    
    // Skills truncation
    const skillsSection = document.getElementById('skills');
    let skillTruncation = [];
    if (skillsSection) {
      const cards = skillsSection.querySelectorAll('div');
      for (const card of cards) {
        const text = card.textContent.trim();
        if (text.length > 3 && text.length < 40 && card.children.length <= 2) {
          const isTruncated = card.scrollWidth > card.clientWidth;
          if (isTruncated) {
            skillTruncation.push({ text: text.substring(0, 30), truncated: true, width: card.offsetWidth, scrollWidth: card.scrollWidth });
          }
        }
      }
    }
    
    return { collision, skillTruncation: skillTruncation.slice(0, 10) };
  });
  console.log('PIXEL_412:', JSON.stringify(pixel));
  await ctx4.close();
  
  // TEST 5: Tablet landscape 1024x768
  console.log('=== TEST 5: TABLET LANDSCAPE 1024x768 ===');
  const ctx5 = await browser.newContext({ viewport: { width: 1024, height: 768 } });
  const p5 = await ctx5.newPage();
  await p5.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 30000 });
  await p5.waitForTimeout(3000);
  
  await p5.screenshot({ path: 'C:/Users/aayan/Downloads/Portfolio/Portfolio v2/tmp/audit-1024-hero.png', fullPage: false });
  
  const tablet1024 = await p5.evaluate(() => {
    const nav = document.querySelector('nav');
    const navDisplay = nav ? getComputedStyle(nav).display : 'none';
    const reboot = document.querySelector('[aria-label="Reboot System"]');
    const rebootVisible = reboot ? getComputedStyle(reboot).display !== 'none' : false;
    const hud = document.querySelector('.hidden.xl\\:block');
    const hudVisible = hud ? hud.offsetWidth > 0 : false;
    
    return {
      navDisplay,
      rebootVisible,
      hudVisible,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight
    };
  });
  console.log('TABLET_1024:', JSON.stringify(tablet1024));
  await ctx5.close();
  
  // TEST 6: 1440x900
  console.log('=== TEST 6: 1440x900 ===');
  const ctx6 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p6 = await ctx6.newPage();
  await p6.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 30000 });
  await p6.waitForTimeout(3000);
  
  await p6.screenshot({ path: 'C:/Users/aayan/Downloads/Portfolio/Portfolio v2/tmp/audit-1440-hero.png', fullPage: false });
  
  const laptop1440 = await p6.evaluate(() => {
    const nav = document.querySelector('nav');
    const navDisplay = nav ? getComputedStyle(nav).display : 'none';
    const hud = document.querySelector('.hidden.xl\\:block');
    const hudVisible = hud ? hud.offsetWidth > 0 : false;
    const navDots = document.querySelector('.hidden.xl\\:flex');
    const navDotsVisible = navDots ? navDots.offsetWidth > 0 : false;
    
    // Check overlap of HUD vs header
    const header = document.querySelector('header');
    const headerRect = header ? header.getBoundingClientRect() : null;
    let hudOverlap = null;
    if (hud && headerRect) {
      const hudRect = hud.getBoundingClientRect();
      hudOverlap = {
        hudRight: Math.round(hudRect.right),
        headerRight: Math.round(headerRect.right),
        hudTop: Math.round(hudRect.top),
        headerBottom: Math.round(headerRect.bottom),
        overlaps: hudRect.top < headerRect.bottom && hudRect.bottom > headerRect.top
      };
    }
    
    return { navDisplay, hudVisible, navDotsVisible, hudOverlap, viewportWidth: window.innerWidth };
  });
  console.log('LAPTOP_1440:', JSON.stringify(laptop1440));
  await ctx6.close();
  
  // TEST 7: Deep modal scroll-lock test on tablet
  console.log('=== TEST 7: MODAL SCROLL LOCK TABLET ===');
  const ctx7 = await browser.newContext({ viewport: { width: 768, height: 1024 } });
  const p7 = await ctx7.newPage();
  await p7.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 30000 });
  await p7.waitForTimeout(3000);
  
  // Scroll to projects and try to open a modal
  await p7.evaluate(() => {
    const projects = document.getElementById('projects');
    if (projects) projects.scrollIntoView();
  });
  await p7.waitForTimeout(500);
  
  // Try clicking a project card
  try {
    const projectCard = await p7.$('#projects button, #projects [role="button"], #projects [tabindex="0"]');
    if (projectCard) {
      await projectCard.click();
      await p7.waitForTimeout(1000);
      
      const modalCheck = await p7.evaluate(() => {
        // Check for any high-z-index overlay
        const overlays = Array.from(document.querySelectorAll('*')).filter(el => {
          const s = getComputedStyle(el);
          return parseInt(s.zIndex) > 100 && el.offsetHeight > 200 && s.position !== 'static';
        });
        
        const bodyOverflow = document.body.style.overflow;
        const htmlOverflow = document.documentElement.style.overflow;
        
        // Try to scroll
        window.scrollTo(0, 500);
        
        return {
          overlayCount: overlays.length,
          bodyOverflow,
          htmlOverflow,
          scrollY: window.scrollY,
          didScroll: window.scrollY > 0
        };
      });
      console.log('MODAL_SCROLL_LOCK_TABLET:', JSON.stringify(modalCheck));
      await p7.screenshot({ path: 'C:/Users/aayan/Downloads/Portfolio/Portfolio v2/tmp/audit-tablet-modal.png', fullPage: false });
    }
  } catch (e) {
    console.log('MODAL_TABLET_ERROR:', e.message);
  }
  await ctx7.close();
  
  // TEST 8: Rapid resize test
  console.log('=== TEST 8: RAPID RESIZE ===');
  const ctx8 = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const p8 = await ctx8.newPage();
  await p8.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 30000 });
  await p8.waitForTimeout(2000);
  
  // Rapid resize sequence
  const sizes = [[768, 1024], [320, 568], [1920, 1080], [390, 844], [1440, 900]];
  for (const [w, h] of sizes) {
    await p8.setViewportSize({ width: w, height: h });
    await p8.waitForTimeout(300);
  }
  
  await p8.waitForTimeout(1000);
  const afterResize = await p8.evaluate(() => ({
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    bodyClasses: document.body.className,
    rootClasses: document.querySelector('#root > div') ? document.querySelector('#root > div').className.substring(0, 100) : 'N/A'
  }));
  console.log('AFTER_RAPID_RESIZE:', JSON.stringify(afterResize));
  await p8.screenshot({ path: 'C:/Users/aayan/Downloads/Portfolio/Portfolio v2/tmp/audit-after-resize.png', fullPage: false });
  await ctx8.close();
  
  await browser.close();
  console.log('DONE_PASS2');
})();
