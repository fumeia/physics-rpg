import { createServer } from 'node:http'; import { readFile } from 'node:fs/promises'; import { extname, join, normalize } from 'node:path';
import { chromium } from 'playwright-core';
const root=new URL('..',import.meta.url).pathname; const types={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.json':'application/json','.css':'text/css','.woff2':'font/woff2'};
const server=createServer(async(q,res)=>{try{const p=normalize(decodeURIComponent(new URL(q.url,'http://x').pathname));if(p==='/api/ping'){res.writeHead(200,{'content-type':'application/json'});return res.end('{"ok":false}')}const f=await readFile(join(root,p==='/'?'index.html':p));res.writeHead(200,{'content-type':types[extname(p)]||'application/octet-stream'});res.end(f)}catch{res.writeHead(404);res.end('nf')}}).listen(0);
const b=await chromium.launch({executablePath:process.env.CHROMIUM||'/tmp/chr-local/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const p=await b.newPage({viewport:{width:1280,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto(`http://127.0.0.1:${server.address().port}/index.html?test=1`);await p.evaluate(()=>localStorage.clear());await p.reload();await p.waitForFunction(()=>!!window.__game);
await p.evaluate(()=>{const t=document.getElementById('tut');if(t&&t.style.display!=='none')document.getElementById('tut-skip')?.click()});

const results=[];const ck=(n,c)=>{results.push(c);console.log(`${c?'PASS':'FAIL'} ${n}`)};
const mf=await p.evaluate(async()=>(await (await fetch('content/manifest.json')).json()));
// make rooms count as "worked in": pass one exercise in every room via the store flags
await p.evaluate(()=>{const cat=window.__game.catalog();const s=JSON.parse(localStorage.getItem('physics-rpg-v1')||'{"xp":0,"solved":{},"reviews":{},"flags":{}}');for(const c of cat)for(const r of c.rooms){const e=r.encounters.find(x=>x.type==='lesson'||x.type==='quiz');if(e)s.solved[e.id]={at:Date.now()}}localStorage.setItem('physics-rpg-v1',JSON.stringify(s))});
await p.reload();await p.waitForFunction(()=>!!window.__game);await p.waitForTimeout(600);
await p.keyboard.press('KeyV');await p.waitForTimeout(300);
for(const kind of ['spot','limits','sketch']){
  await p.click('[data-stab="drills"]');await p.waitForTimeout(250);await p.click(`[data-k="${kind}"]`);await p.waitForTimeout(300);
  ck(kind+': a card is shown',await p.evaluate(()=>!!document.querySelector('#dr-card')&&document.querySelector('#dr-card').innerText.length>40));
  ck(kind+': no KaTeX errors',await p.evaluate(()=>document.querySelectorAll('#dr-card .katex-error').length===0));
  if(kind==='sketch'){
    await p.evaluate(()=>{const cv=document.querySelector('.sketchcv');const r=cv.getBoundingClientRect();const ev=(t,x,y)=>cv.dispatchEvent(new PointerEvent(t,{clientX:r.left+x,clientY:r.top+y,pointerId:1,bubbles:true}));ev('pointerdown',50,200);ev('pointermove',150,100);ev('pointermove',250,150);ev('pointerup',250,150)});
    await p.click('#sk-show');await p.waitForTimeout(200);await p.evaluate(()=>document.querySelectorAll('.skf').forEach(c=>c.checked=true));await p.click('#sk-done');await p.waitForTimeout(200);
  } else {
    await p.click('.confchip[data-conf="sure"]');
    await p.evaluate((k)=>{const b=k==='spot'?document.querySelector('.stepbtn'):document.querySelector('#dr-card .opt');b.click()},kind);await p.waitForTimeout(300);
  }
  ck(kind+': can continue to the next card',await p.evaluate(()=>!!document.querySelector('#dr-n')));
}
await p.click('[data-stab="calib"]');await p.waitForTimeout(300);
ck('calibration shows the bets',await p.evaluate(()=>document.querySelector('#study-body').innerText.includes('sure')));
await p.click('[data-stab="mix"]');await p.waitForTimeout(300);
ck('mixed practice lists only worked rooms',await p.evaluate(()=>document.querySelectorAll('.mixrooms input').length>=1));
await p.click('#mx-go');await p.waitForTimeout(300);
ck('mix starts with a confidence bar',await p.evaluate(()=>!!document.querySelector('#mx-card .confbar')));
for(let i=0;i<3;i++){await p.click('#mx-card .confchip[data-conf="probably"]');await p.evaluate(()=>{const b=document.querySelector('#mx-card .stepbtn')||document.querySelector('#mx-card .opt');b.click()});await p.waitForTimeout(250);await p.click('#mx-n');await p.waitForTimeout(250)}
ck('mix proceeds',await p.evaluate(()=>document.querySelector('#study-body').innerText.includes('Question 4')));
if(mf.radar){await p.click('[data-stab="radar"]');await p.waitForTimeout(300);ck('radar rows',await p.evaluate(()=>document.querySelectorAll('.radrow').length>=5));}
await p.click('[data-stab="plan"]');await p.click('[data-pm="90"]');await p.waitForTimeout(300);
ck('90 min plan has new exercises from a course',await p.evaluate(()=>[...document.querySelectorAll('[data-pdone]')].filter(c=>/\[(QM|Solid|Astro)\]/.test(c.parentElement.innerText)).length>=2));
const bad=results.some(x=>!x)||errs.length;console.log(bad?'FAIL '+errs.slice(0,3):'ALL PASS drills');await b.close();server.close();process.exit(bad?1:0);
