const fs=require('fs'),path=require('path'),assert=require('assert/strict'),sharp=require('sharp');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),out=path.resolve(root,'../../output/playwright/reference-catalog-review');
(async()=>{
 const images=JSON.parse(fs.readFileSync(path.join(root,'data/images.json')));
 const checks={cards:229,images:Object.keys(images).length,unavailable:229-Object.keys(images).length,dimensions:true,errors:[],checks:[]};
 for(const [id,f] of Object.entries(images)){const m=await sharp(path.join(root,f)).metadata();assert.equal(m.width,1600,id);assert.equal(m.height,1000,id);assert.equal(m.format,'webp',id);}
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const page=await browser.newPage({viewport:{width:1600,height:1100},colorScheme:'light'});
 page.on('pageerror',e=>checks.errors.push(e.message));
 await page.goto('http://127.0.0.1:8767/',{waitUntil:'networkidle'});
 assert.equal(await page.locator('.card').count(),229);
 assert.equal(await page.locator('#count-n').innerText(),'229');
 await page.screenshot({path:path.join(out,'desktop-top.png')});
 await page.locator('#t-image').check();
 assert.equal(await page.locator('#count-n').innerText(),String(checks.images));
 await page.locator('#results').scrollIntoViewIfNeeded();await page.waitForTimeout(400);
 await page.screenshot({path:path.join(out,'desktop-catalog.png')});
 await page.locator('#ch-4').check();
 const editorialCount=Object.keys(images).filter(x=>x.startsWith('E')).length;
 assert.equal(await page.locator('#count-n').innerText(),String(editorialCount));
 await page.locator('#f-reset').click();
 await page.locator('#q').fill('B35');
 assert.equal(await page.locator('#count-n').innerText(),'1');
 await page.locator('[data-open="B35"]').last().click();
 await page.locator('#detail[open]').waitFor();
 await page.waitForTimeout(300);
 assert.match(await page.locator('#detail').innerText(),/Studio Regale/);
 assert.match(await page.locator('#detail').innerText(),/出典/);
 await page.screenshot({path:path.join(out,'desktop-detail.png')});
 await page.keyboard.press('Escape');
 assert.equal(await page.locator('#detail[open]').count(),0);
 await page.locator('#q').fill('E01');
 await page.locator('[data-open="E01"]').last().click();
 assert.match(await page.locator('#detail').innerText(),/確保できません|収録していません/);
 await page.locator('#dlg-close').click();
 await page.locator('#f-reset').click();
 const assetChecks=await page.evaluate(async paths=>{
  const failures=[];let index=0;
  await Promise.all(Array.from({length:6},async()=>{while(index<paths.length){const p=paths[index++];const r=await fetch(p);if(!r.ok||(await r.arrayBuffer()).byteLength<500)failures.push(p);}}));return failures;
 },Object.values(images));
 assert.deepEqual(assetChecks,[]);
 checks.checks.push('229 cards; image filter; chapter + image filter; keyword search; source and correction in detail; missing-image reason; Escape; all image HTTP responses');
 for(const scheme of ['light','dark']){
  await page.setViewportSize({width:390,height:844});await page.emulateMedia({colorScheme:scheme});
  await page.goto('http://127.0.0.1:8767/',{waitUntil:'networkidle'});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'mobile overflow');
  await page.screenshot({path:path.join(out,'mobile-'+scheme+'-top.png')});
  await page.locator('#filters').scrollIntoViewIfNeeded();await page.locator('#f-toggle').click();
  await page.locator('#t-image').check();assert.equal(await page.locator('#count-n').innerText(),String(checks.images));
  await page.locator('#f-toggle').click();await page.locator('#results').scrollIntoViewIfNeeded();
  await page.screenshot({path:path.join(out,'mobile-'+scheme+'-catalog.png')});
 }
 assert.deepEqual(checks.errors,[]);
 checks.checks.push('390px mobile light/dark; no horizontal overflow; mobile image filter; no JavaScript errors');
 checks.checked_at=new Date().toISOString();
 fs.writeFileSync(path.join(out,'qa.json'),JSON.stringify(checks,null,2));
 console.log(JSON.stringify(checks));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
