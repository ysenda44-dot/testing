#!/usr/bin/env node
// Read public reference pages and keep provenance alongside every local image.
// Requires playwright and sharp (NODE_PATH or normal local dependencies).
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const sharp = require('sharp');
const root = path.resolve(__dirname, '..');
const evidence = path.resolve(root, '../../output/playwright/reference-catalog');
const plan = JSON.parse(fs.readFileSync(path.join(root, 'data/capture-plan.json')));
const args = process.argv.slice(2);
const wanted = args.filter(x => !x.startsWith('--'));
const force = args.includes('--force');
fs.mkdirSync(path.join(root, 'images'), { recursive: true });
fs.mkdirSync(evidence, { recursive: true });
const wait = ms => new Promise(r => setTimeout(r, ms));
const errorTitle = /^(access denied|just a moment|attention required|403|404|page not found|not found|pardon our interruption|robot or human|security check|verify you are human)/i;
async function inspect(page) {
  return page.evaluate(() => ({
    title: document.title,
    text: (document.body?.innerText || '').slice(0, 42000),
    og: document.querySelector('meta[property="og:image"]')?.content || document.querySelector('meta[name="twitter:image"]')?.content,
    images: [...document.images].map(i => ({ src: i.getAttribute('data-src') || i.getAttribute('data-original') || i.currentSrc || i.src, alt: i.alt, width: i.naturalWidth, height: i.naturalHeight, top: i.getBoundingClientRect().top + window.scrollY, displayWidth: i.getBoundingClientRect().width })).filter(i=>i.src && !i.src.startsWith('data:')).slice(0,150),
    videos: [...document.querySelectorAll('video')].map(v => ({poster:v.poster,src:v.currentSrc})),
    backgrounds: [...document.querySelectorAll('main *,article *,[class*="hero"],[class*="case"]')].map(el=>getComputedStyle(el).backgroundImage).filter(s=>s&&s!=='none').slice(0,50),
    frames: [...document.querySelectorAll('iframe')].map(i=>i.src),
    links: [...document.querySelectorAll('a[href]')].map(a => ({text:a.innerText.trim().slice(0,160),url:a.href})).filter(a=>/^https?:/.test(a.url)).slice(0,600),
    buttons: [...document.querySelectorAll('button')].map(b=>b.innerText.trim()).filter(Boolean).slice(0,100)
  }));
}
async function dismissConsent(page) {
  for (const name of ['Accept only necessary','Close newsletter','Close popup','Close modal']) {
    const b=page.getByRole('button',{name,exact:true}).first();
    if(await b.isVisible().catch(()=>false)) await b.click({timeout:1500}).catch(()=>{});
  }
  const labels = await page.locator('button').allTextContents().catch(()=>[]);
  for (const re of [/^reject all$/i,/^decline all$/i,/^reject optional cookies$/i,/^necessary only$/i,/^accept necessary$/i,/^alle ablehnen$/i,/^ablehnen$/i,/^allow selection$/i,/^decline$/i,/^×$/,/^deny$/i,/^同意しない$/,/^すべて拒否$/,/^閉じる$/,/^close(?:\s*×)?$/i,/^accept all cookies$/i,/^accept all$/i,/^すべて同意する$/,/^すべてのcookieを受け入れる$/i]) {
    const label = labels.find(x=>re.test(x.trim()));
    if (!label) continue;
    const b = page.getByRole('button',{name:label.trim(),exact:true}).first();
    if (await b.isVisible().catch(()=>false)) { await b.click({timeout:2000}).catch(()=>{}); await wait(400); break; }
  }
}
async function capture(browser, item) {
  const log = { id:item.id, name:item.name, captured_at:new Date().toISOString(), viewport:{width:1600,height:1000}, attempts:[], status:'unavailable' };
  const ctx = await browser.newContext({ viewport:{width:1600,height:1000},deviceScaleFactor:1,locale:item.locale||'en-US',colorScheme:'light' });
  const page = await ctx.newPage();
  page.setDefaultTimeout(5000);
  try {
    for (const target of item.targets) {
      const attempt = {url:target.url,kind:target.kind};
      log.attempts.push(attempt);
      try {
        let response;
        try { response = await page.goto(target.url,{waitUntil:'domcontentloaded',timeout:25000}); }
        catch(e) { if (!/Timeout/.test(e.message)) throw e; }
        attempt.http_status = response?.status();
        await wait(2800);
        await dismissConsent(page);
        if (item.dismiss) for (const name of item.dismiss) { const b=page.getByText(name,{exact:true}).first(); if(await b.isVisible().catch(()=>false)) await b.click({timeout:1500}).catch(()=>{}); }
        if (item.wait_ms) await wait(item.wait_ms);
        if (item.dismiss) for (const name of item.dismiss) { const b=page.getByText(name,{exact:true}).first(); if(await b.isVisible().catch(()=>false)) await b.click({timeout:1500}).catch(()=>{}); }
        let info = await inspect(page);
        attempt.final_url = page.url(); attempt.title = info.title;
        attempt.evidence = info;
        if ((/security check|サイトメンテナンス|something went wrong|一時停止について/i.test(info.text.slice(0,1800)) && info.text.length<6000) || (attempt.http_status||0)>=400 || errorTitle.test(info.title) || (/access denied|verify (that )?you are human|checking your browser/i.test(info.text.slice(0,1000)) && info.text.length<2500)) throw new Error('HTTP error or access challenge; no image used');
        let bytes, assetURL;
        let kind=target.kind;
        if (kind==='site' || kind==='case_page') {
          await page.evaluate(()=>window.scrollTo(0,350)); await wait(600); await page.evaluate(()=>window.scrollTo(0,0)); await wait(1500);
          bytes=await page.screenshot({timeout:15000,animations:'disabled'});
          fs.writeFileSync(path.join(evidence,item.id+'.png'),bytes);
        } else {
          await page.evaluate(()=>window.scrollTo(0,850)); await wait(800);
          info=await inspect(page); attempt.evidence=info;
          const candidates=[target.image_url,info.og,...info.videos.map(v=>v.poster),...info.images.filter(i=>i.width>=600||i.displayWidth>=600).map(i=>i.src),...(info.backgrounds||[]).map(s=>s.match(/url\(["']?([^"')]+)/)?.[1])].filter(Boolean);
          for (const url of [...new Set(candidates)]) {
            if (/avatar|logo|placeholder|default[-_]og|ogp_default|noimage|no-image|\/images\/social\.jpg/i.test(url)) continue;
            try {
              const res=await ctx.request.get(new URL(url,page.url()).href,{timeout:18000});
              if (!res.ok() || !/image\//.test(res.headers()['content-type']||'')) continue;
              const buf=await res.body(), m=await sharp(buf).metadata();
              if(m.width<500||m.height<200) continue;
              bytes=buf; assetURL=url; break;
            } catch(e){}
          }
          if(!bytes) throw new Error('No suitable source image');
        }
        const output=path.join(root,'images',item.id+'.webp');
        let quality=80;
        let image=await sharp(bytes).rotate().resize(1600,1000,{fit:kind==='site'?'fill':'contain',background:'#f0eeeb'}).webp({quality}).toBuffer();
        while(image.length>205000&&quality>45){quality-=8;image=await sharp(bytes).rotate().resize(1600,1000,{fit:kind==='site'?'fill':'contain',background:'#f0eeeb'}).webp({quality}).toBuffer();}
        fs.writeFileSync(output,image);
        Object.assign(log,{status:'pending_review',kind,source_url:page.url(),asset_url:assetURL||null,image:'images/'+item.id+'.webp',bytes:image.length,title:info.title,note:target.note||'',reviewed:false});
        break;
      } catch(e){attempt.error=e.message.split('\n')[0];}
    }
  } finally { await ctx.close(); }
  const logPath=path.join(evidence,item.id+'.json');
  if(fs.existsSync(logPath)){const old=JSON.parse(fs.readFileSync(logPath));log.previous_attempts=[...(old.previous_attempts||[]),...(old.attempts||[])];}
  fs.writeFileSync(logPath,JSON.stringify(log,null,2));
  console.log(JSON.stringify({id:log.id,status:log.status,kind:log.kind,url:log.source_url,errors:log.attempts.filter(a=>a.error).map(a=>a.error)}));
}
(async()=>{
  const browser=await chromium.launch({channel:'chrome',headless:true,args:args.includes('--http1')?['--disable-http2']:[]});
  const queue=plan.filter(x=>(!wanted.length||wanted.includes(x.id))&&(force||!fs.existsSync(path.join(evidence,x.id+'.json'))));
  // Small parallel browser pool; never interact with a user's logged-in profile.
  await Promise.all(Array.from({length:5},async()=>{while(queue.length){const item=queue.shift();await capture(browser,item);}}));
  await browser.close();
})();
