const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({headless:false});
  const p = await b.newPage();
  await p.goto('http://localhost:3000/demo-01.html', {waitUntil:'networkidle'});
  
  // Scroll to V2 section and screenshot it
  await p.evaluate(() => {
    document.querySelector('.v2-scene').scrollIntoView({block:'center'});
  });
  await p.waitForTimeout(500);
  await p.screenshot({path:'C:/Users/aayan/Downloads/Portfolio/Portfolio v2/tmp/v2-focused.png'});
  console.log('done');
  await b.close();
})();
