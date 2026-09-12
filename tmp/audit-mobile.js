const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 320, height: 568 } });
  const page = context.pages()[0] || await context.newPage();
  
  const consoleMessages = [];
  page.on('console', msg => consoleMessages.push(msg.type() + ': ' + msg.text()));
  
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(4000);
  
  // Hero screenshot
  await page.screenshot({ path: 'C:/Users/aayan/Downloads/Portfolio/Portfolio v2/tmp/audit-mobile-hero.png', fullPage: false });
  
  // Full page
  await page.screenshot({ path: 'C:/Users/aayan/Downloads/Portfolio/Portfolio v2/tmp/audit-mobile-full.png', fullPage: true });
  
  // Overflow check
  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    hasHorizontalScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth
  }));
  console.log('OVERFLOW_MOBILE:', JSON.stringify(overflow));
  
  // Bottom bar collision check
  const bottomBarCollision = await page.evaluate(() => {
    const reboot = document.querySelector('[aria-label="Reboot System"]');
    const allFixed = Array.from(document.querySelectorAll('.fixed'));
    const audioTerminal = allFixed.find(el => el.textContent.includes('SYS_AUDIO') && el.textContent.includes('TERMINAL'));
    
    if (!reboot || !audioTerminal) return { found: false };
    
    const rebootRect = reboot.getBoundingClientRect();
    const audioRect = audioTerminal.getBoundingClientRect();
    
    return {
      found: true,
      reboot: { top: Math.round(rebootRect.top), left: Math.round(rebootRect.left), width: Math.round(rebootRect.width), height: Math.round(rebootRect.height), display: getComputedStyle(reboot).display },
      audioTerminal: { top: Math.round(audioRect.top), left: Math.round(audioRect.left), width: Math.round(audioRect.width), height: Math.round(audioRect.height) },
      totalWidthNeeded: Math.round(rebootRect.width + audioRect.width + 24),
      viewportWidth: window.innerWidth,
      collision: rebootRect.left < audioRect.right && rebootRect.right > audioRect.left,
      overflow: audioRect.right > window.innerWidth || rebootRect.left < 0
    };
  });
  console.log('BOTTOM_BAR_COLLISION_MOBILE:', JSON.stringify(bottomBarCollision));
  
  // Check all fixed elements at bottom
  const allBottomFixed = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.fixed')).filter(el => {
      const rect = el.getBoundingClientRect();
      return rect.top > 400 && el.offsetHeight > 0;
    }).map(el => {
      const rect = el.getBoundingClientRect();
      return {
        text: el.textContent.substring(0, 60).trim(),
        top: Math.round(rect.top),
        left: Math.round(rect.left),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        display: getComputedStyle(el).display
      };
    });
  });
  console.log('ALL_BOTTOM_FIXED_MOBILE:', JSON.stringify(allBottomFixed));
  
  // Check TRACE_0 vs Password collision
  const headerCollision = await page.evaluate(() => {
    const trace0 = Array.from(document.querySelectorAll('*')).find(el => el.textContent.includes('TRACE_0') && el.offsetHeight > 0 && el.offsetWidth > 0);
    const password = Array.from(document.querySelectorAll('*')).find(el => el.textContent.includes('Password:') && el.offsetHeight > 0 && el.offsetWidth > 0);
    
    if (!trace0 || !password) return { found: false };
    
    const traceRect = trace0.getBoundingClientRect();
    const passRect = password.getBoundingClientRect();
    
    return {
      found: true,
      trace0: { top: Math.round(traceRect.top), left: Math.round(traceRect.left), width: Math.round(traceRect.width), height: Math.round(traceRect.height) },
      password: { top: Math.round(passRect.top), left: Math.round(passRect.left), width: Math.round(passRect.width), height: Math.round(passRect.height) },
      verticalOverlap: traceRect.top < passRect.bottom && traceRect.bottom > passRect.top,
      horizontalOverlap: traceRect.left < passRect.right && traceRect.right > passRect.left
    };
  });
  console.log('HEADER_COLLISION_MOBILE:', JSON.stringify(headerCollision));
  
  // Check skills truncation
  const skillsTruncation = await page.evaluate(() => {
    const skillCards = Array.from(document.querySelectorAll('[class*="skill"], [class*="Skill"]'));
    const results = [];
    
    // Also try finding by section
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
      const cards = skillsSection.querySelectorAll('div');
      for (const card of cards) {
        if (card.children.length === 0 || card.textContent.length < 30) {
          const text = card.textContent.trim();
          if (text.length > 0 && text.length < 30) {
            const isTruncated = card.scrollWidth > card.clientWidth;
            results.push({ text, truncated: isTruncated, width: card.offsetWidth, scrollWidth: card.scrollWidth });
          }
        }
      }
    }
    
    return results.slice(0, 15);
  });
  console.log('SKILLS_TRUNCATION_MOBILE:', JSON.stringify(skillsTruncation));
  
  // Check nav visibility
  const navMobile = await page.evaluate(() => {
    const navEl = document.querySelector('nav');
    if (!navEl) return null;
    const s = getComputedStyle(navEl);
    return { display: s.display, visibility: s.visibility, width: navEl.offsetWidth, height: navEl.offsetHeight };
  });
  console.log('NAV_MOBILE:', JSON.stringify(navMobile));
  
  // Check bottom controls covering content on scroll
  await page.evaluate(() => window.scrollTo(0, 600));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'C:/Users/aayan/Downloads/Portfolio/Portfolio v2/tmp/audit-mobile-scrolled-about.png', fullPage: false });
  
  const coveredContent = await page.evaluate(() => {
    const allFixed = Array.from(document.querySelectorAll('.fixed'));
    const bottomControls = allFixed.filter(el => {
      const rect = el.getBoundingClientRect();
      return rect.top > 400 && el.offsetHeight > 0 && getComputedStyle(el).display !== 'none';
    });
    
    const controlRects = bottomControls.map(el => el.getBoundingClientRect());
    
    // Find text content that overlaps with any bottom control
    const allText = Array.from(document.querySelectorAll('p, span, h1, h2, h3, h4, div'));
    const covered = [];
    
    for (const el of allText) {
      const rect = el.getBoundingClientRect();
      if (rect.height === 0 || el.textContent.trim().length < 5) continue;
      
      for (const controlRect of controlRects) {
        if (rect.top < controlRect.bottom && rect.bottom > controlRect.top && rect.left < controlRect.right && rect.right > controlRect.left) {
          covered.push({
            text: el.textContent.substring(0, 80).trim(),
            elementTop: Math.round(rect.top),
            controlTop: Math.round(controlRect.top)
          });
          break;
        }
      }
    }
    
    return covered.slice(0, 15);
  });
  console.log('COVERED_CONTENT_MOBILE:', JSON.stringify(coveredContent));
  
  // Scroll to skills and check truncation visually
  await page.evaluate(() => {
    const skills = document.getElementById('skills');
    if (skills) skills.scrollIntoView();
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'C:/Users/aayan/Downloads/Portfolio/Portfolio v2/tmp/audit-mobile-skills.png', fullPage: false });
  
  // Scroll to projects
  await page.evaluate(() => {
    const projects = document.getElementById('projects');
    if (projects) projects.scrollIntoView();
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'C:/Users/aayan/Downloads/Portfolio/Portfolio v2/tmp/audit-mobile-projects.png', fullPage: false });
  
  // Check project dock titles
  const projectTitles = await page.evaluate(() => {
    const projectsSection = document.getElementById('projects');
    if (!projectsSection) return [];
    
    const titles = Array.from(projectsSection.querySelectorAll('*')).filter(el => {
      const text = el.textContent.trim();
      return text.length > 5 && text.length < 60 && el.offsetWidth > 0 && el.children.length === 0;
    });
    
    return titles.map(el => ({
      text: el.textContent.trim(),
      width: Math.round(el.offsetWidth),
      truncated: el.scrollWidth > el.clientWidth,
      rotation: getComputedStyle(el).transform
    })).slice(0, 10);
  });
  console.log('PROJECT_TITLES_MOBILE:', JSON.stringify(projectTitles));
  
  // Check modal behavior - try clicking a project
  const modalTest = await page.evaluate(() => {
    const projectCards = document.querySelectorAll('[class*="project"]');
    if (projectCards.length > 0) {
      return { cardCount: projectCards.length, firstCard: projectCards[0].textContent.substring(0, 50) };
    }
    return { cardCount: 0 };
  });
  console.log('MODAL_TEST_INFO:', JSON.stringify(modalTest));
  
  // Try to open a project modal
  try {
    const projectBtn = await page.$('#projects button, #projects [role="button"], #projects [tabindex]');
    if (projectBtn) {
      await projectBtn.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'C:/Users/aayan/Downloads/Portfolio/Portfolio v2/tmp/audit-mobile-modal.png', fullPage: false });
      
      // Check if modal is open
      const modalState = await page.evaluate(() => {
        const modal = document.querySelector('[role="dialog"], .modal, [class*="modal"]');
        if (modal) {
          const rect = modal.getBoundingClientRect();
          return {
            open: true,
            top: Math.round(rect.top),
            height: Math.round(rect.height),
            coversFullViewport: rect.height >= window.innerHeight * 0.8
          };
        }
        
        // Check for any overlay
        const overlays = Array.from(document.querySelectorAll('.fixed, .absolute')).filter(el => {
          const s = getComputedStyle(el);
          return s.zIndex > 100 && el.offsetHeight > 200;
        });
        
        return { open: false, overlayCount: overlays.length };
      });
      console.log('MODAL_STATE_MOBILE:', JSON.stringify(modalState));
      
      // Check scroll lock
      const scrollLock = await page.evaluate(() => {
        return {
          bodyOverflow: document.body.style.overflow,
          htmlOverflow: document.documentElement.style.overflow,
          bodyOverflowY: document.body.style.overflowY
        };
      });
      console.log('SCROLL_LOCK_MOBILE:', JSON.stringify(scrollLock));
      
      // Try scrolling while modal is open
      await page.evaluate(() => window.scrollTo(0, 1000));
      await page.waitForTimeout(300);
      const scrollPos = await page.evaluate(() => window.scrollY);
      console.log('SCROLL_WHILE_MODAL:', JSON.stringify({ scrollY: scrollPos, didScroll: scrollPos > 0 }));
      
      // Close modal with Escape
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
    }
  } catch (e) {
    console.log('MODAL_ERROR:', e.message);
  }
  
  // Terminal mode test
  try {
    const terminalBtn = await page.$('button:has-text("TERMINAL")');
    if (terminalBtn) {
      await terminalBtn.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'C:/Users/aayan/Downloads/Portfolio/Portfolio v2/tmp/audit-mobile-terminal.png', fullPage: false });
      
      // Check terminal mode issues
      const terminalIssues = await page.evaluate(() => {
        const terminalBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('VISUAL'));
        const sysLogs = document.querySelector('[class*="SYS_TRACE"], [class*="SystemLogs"]');
        const matrixRain = document.querySelector('[class*="MatrixRain"], canvas');
        
        // Check if SYS_LOGS drawer is clipped
        const allFixed = Array.from(document.querySelectorAll('.fixed'));
        const sysLogDrawer = allFixed.find(el => el.textContent.includes('SYS_TRACE_LOG'));
        
        let drawerClipped = false;
        if (sysLogDrawer) {
          const rect = sysLogDrawer.getBoundingClientRect();
          drawerClipped = rect.right > window.innerWidth;
        }
        
        return {
          terminalBtnVisible: terminalBtn ? terminalBtn.offsetWidth > 0 : false,
          terminalBtnText: terminalBtn ? terminalBtn.textContent : '',
          drawerClipped,
          viewportWidth: window.innerWidth
        };
      });
      console.log('TERMINAL_ISSUES_MOBILE:', JSON.stringify(terminalIssues));
      
      // Switch back to visual
      const visualBtn = await page.$('button:has-text("VISUAL")');
      if (visualBtn) await visualBtn.click();
      await page.waitForTimeout(500);
    }
  } catch (e) {
    console.log('TERMINAL_ERROR:', e.message);
  }
  
  console.log('CONSOLE_MOBILE:', JSON.stringify(consoleMessages.slice(0, 15)));
  
  await browser.close();
  console.log('DONE_MOBILE');
})();
