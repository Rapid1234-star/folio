const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({headless:false});
  const p = await b.newPage();
  await p.goto('http://localhost:3000/demo-01.html', {waitUntil:'networkidle'});

  // Screenshot the V2 section
  const s = await p.locator('[id="VERSION_2"]').first();
  await s.screenshot({path:'C:/Users/aayan/Downloads/Portfolio/Portfolio v2/tmp/v2-debug.png'});
  console.log('V2 screenshot saved');

  // Check V2 card background and image rendering
  const info = await p.$$eval('.v2-card', cards => cards.map(c => {
    const pc = c.querySelector('.pc');
    const img = c.querySelector('.card-image');
    return {
      cardBg: getComputedStyle(c).backgroundColor,
      cardW: c.offsetWidth,
      cardH: c.offsetHeight,
      pcBg: pc ? getComputedStyle(pc).backgroundColor : 'none',
      imgH: img ? img.offsetHeight : 0,
      opacity: getComputedStyle(c).opacity
    };
  }));
  console.log('V2 card info:', JSON.stringify(info, null, 2));

  await b.close();
})();
