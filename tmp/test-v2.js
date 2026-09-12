const { chromium } = require('playwright');
const TARGET_URL = 'http://localhost:3000/demo-01.html';

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 80 });
  const page = await browser.newPage();
  const errors = [];
  page.on('console', m => { if(m.type()==='error') errors.push(m.text()); });

  await page.goto(TARGET_URL, { waitUntil: 'networkidle' });
  console.log('Page loaded');

  // Screenshot full page
  await page.screenshot({ path: 'C:/Users/aayan/Downloads/Portfolio/Portfolio v2/tmp/v2-full.png', fullPage: true });
  console.log('Full page screenshot saved');

  // Check V2 dock bars have labels
  const dockLabels = await page.$$eval('.v2-card .dock-label', els => els.map(e => e.textContent.trim()));
  console.log('Dock labels:', dockLabels);

  // Check V2 cards exist
  const v2Cards = await page.$$('.v2-card');
  console.log('V2 dock bars:', v2Cards.length);

  // Click the 3rd card to expand it
  if(v2Cards.length >= 3) {
    await v2Cards[2].click();
    await page.waitForTimeout(700);
    console.log('Clicked card 3');

    // Check if expanded
    const expandedCount = await page.$$eval('.v2-card.expanded', els => els.length);
    console.log('Expanded cards:', expandedCount);

    // Screenshot V2 section expanded
    const v2Section = await page.$('#VERSION_2');
    if(v2Section) {
      await v2Section.screenshot({ path: 'C:/Users/aayan/Downloads/Portfolio/Portfolio v2/tmp/v2-expanded.png' });
      console.log('V2 expanded screenshot saved');
    }

    // Check expanded card has full content visible
    const expandedCard = await page.$('.v2-card.expanded');
    if(expandedCard) {
      const bodyVisible = await expandedCard.$eval('.pc .card-body', el => {
        const s = getComputedStyle(el);
        return { display: s.display, opacity: s.opacity, height: el.offsetHeight };
      });
      console.log('Expanded card body:', bodyVisible);

      const titleVisible = await expandedCard.$eval('.pc .card-body h3', el => el.textContent);
      console.log('Expanded card title:', titleVisible);

      // Check tech stack is visible
      const techVisible = await expandedCard.$$eval('.pc .tech-stack span', pills => pills.map(p => p.textContent.trim()));
      console.log('Tech pills visible:', techVisible);

      // Check action buttons are visible
      const actions = await expandedCard.$$eval('.pc .card-actions a', links => links.map(l => l.textContent.trim()));
      console.log('Action buttons:', actions);
    }

    // Click outside to collapse
    await page.click('body', { position: { x: 50, y: 50 } });
    await page.waitForTimeout(600);
    const collapsedCount = await page.$$eval('.v2-card.expanded', els => els.length);
    console.log('After click-outside, expanded:', collapsedCount);

    // Screenshot after collapse
    if(v2Section) {
      await v2Section.screenshot({ path: 'C:/Users/aayan/Downloads/Portfolio/Portfolio v2/tmp/v2-collapsed.png' });
      console.log('V2 collapsed screenshot saved');
    }
  }

  console.log('Console errors:', errors.length ? errors : 'none');
  await browser.close();
})();
