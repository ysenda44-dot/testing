const fs=require('fs'),path=require('path'),sharp=require('sharp');
const root=path.resolve(__dirname,'..'),evidence=path.resolve(root,'../../output/playwright/reference-catalog');
const ids=process.argv.slice(2);
const repairs=JSON.parse(fs.readFileSync(path.join(root,'data/asset-repairs.json'))).filter(x=>!ids.length||ids.includes(x.id));
(async()=>{for(const item of repairs){try{
  const old=JSON.parse(fs.readFileSync(path.join(evidence,item.id+'.json')));
  const response=await fetch(item.asset_url,{signal:AbortSignal.timeout(20000)});
  if(!response.ok||!response.headers.get('content-type')?.startsWith('image/'))throw new Error('Not an image: '+response.status);
  const bytes=Buffer.from(await response.arrayBuffer());
  let quality=80,buf;
  do {buf=await sharp(bytes).rotate().resize(1600,1000,{fit:'contain',background:'#f0eeeb'}).webp({quality}).toBuffer();quality-=8;}while(buf.length>205000&&quality>45);
  fs.writeFileSync(path.join(root,'images',item.id+'.webp'),buf);
  Object.assign(old,{status:'pending_review',kind:'published_image',image:'images/'+item.id+'.webp',asset_url:item.asset_url,bytes:buf.length,note:item.note||'掲載ページ内で該当する画像を選択。',captured_at:new Date().toISOString(),reviewed:false});
  if(item.source_url)old.source_url=item.source_url;
  fs.writeFileSync(path.join(evidence,item.id+'.json'),JSON.stringify(old,null,2));
  console.log(item.id+' replaced');
}catch(e){console.log(item.id+' ERROR '+e.message);}}})();
