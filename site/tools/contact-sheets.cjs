const fs=require('fs'),path=require('path'),sharp=require('sharp');
const root=path.resolve(__dirname,'..'),out=path.resolve(root,'../../output/playwright/reference-catalog-review');
fs.mkdirSync(out,{recursive:true});
(async()=>{
const args=process.argv.slice(2),prefix=args.shift()||'final';
const ids=args.length?args:fs.readdirSync(path.join(root,'images')).filter(f=>f.endsWith('.webp')).map(f=>f.slice(0,-5)).sort();
for(let p=0;p<ids.length;p+=24){const chunk=ids.slice(p,p+24),layers=[];
for(let i=0;i<chunk.length;i++){const id=chunk[i],left=(i%4)*400,top=Math.floor(i/4)*280;
layers.push({input:await sharp(path.join(root,'images',id+'.webp')).resize(390,244).toBuffer(),left,top});
layers.push({input:Buffer.from(`<svg width="390" height="30"><rect width="390" height="30" fill="white"/><text x="10" y="22" font-family="sans-serif" font-size="21">${id}</text></svg>`),left,top:top+244});}
const f=path.join(out,`${prefix}-${p/24+1}.jpg`);await sharp({create:{width:1600,height:Math.ceil(chunk.length/4)*280,channels:3,background:'#ddd'}}).composite(layers).jpeg({quality:88}).toFile(f);console.log(f);}
})();
