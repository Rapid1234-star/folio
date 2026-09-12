const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({headless:false});
  const p = await b.newPage();
  await p.goto('http://localhost:3000/demo-01.html', {waitUntil:'networkidle'});

  // Get V2 section bounding box
  const v2Box = await p.evaluate(() => {
    const el = document.querySelector('.v2-scene');
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {top: r.top, height: r.height, display: getComputedStyle(el).display, overflow: getComputedStyle(el).overflow};
  });
  console.log('V2 scene box:', v2Box);

  // Get all v2-card info
  const cards = await p.evaluate(() => {
    const els = document.querySelectorAll('.v2-card');
    return Array.from(els).map((c, i) => {
      const r = c.getBoundingClientRect();
      const pc = c.querySelector('.pc');
      const img = c.querySelector('.card-image');
      const imgDiv = c.querySelector('.ph-grad');
      return {
        i, w: r.width, h: r.height, top: r.top, left: r.left,
        cardBg: getComputedStyle(c).backgroundColor,
        cardBorder: getComputedStyle(c).border,
        pcExists: !!pc,
        pcBg: pc ? getComputedStyle(pc).backgroundColor : 'n/a',
        pcBorder: pc ? getComputedStyle(pc).border : 'n/a',
        pcOverflow: pc ? getComputedStyle(pc).overflow : 'n/a',
        pcDisplay: pc ? getComputedStyle(pc).display : 'n/a',
        imgExists: !!img,
        imgH: img ? img.offsetHeight : 0,
        imgPosition: img ? getComputedStyle(img).position : 'n/a',
        imgBg: imgDiv ? getComputedStyle(imgDiv).background.substring(0,80) : 'n/a',
        opacity: getComputedStyle(c).opacity,
        filter: getComputedStyle(c).filter,
        children: c.innerHTML.substring(0, 200)
      };
    });
  });
  cards.forEach(c => console.log(JSON.stringify(c)));

  await b.close();
})();
