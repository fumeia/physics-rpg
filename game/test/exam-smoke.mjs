import { createServer } from 'node:http'; import { readFile } from 'node:fs/promises'; import { extname, join, normalize } from 'node:path';
import { chromium } from 'playwright-core';
const root=new URL('..',import.meta.url).pathname; const types={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.json':'application/json','.css':'text/css','.woff2':'font/woff2'};
const server=createServer(async(q,res)=>{try{const p=normalize(decodeURIComponent(new URL(q.url,'http://x').pathname));if(p==='/api/ping'){res.writeHead(200,{'content-type':'application/json'});return res.end('{"ok":false}')}const f=await readFile(join(root,p==='/'?'index.html':p));res.writeHead(200,{'content-type':types[extname(p)]||'application/octet-stream'});res.end(f)}catch{res.writeHead(404);res.end('nf')}}).listen(0);
const b=await chromium.launch({executablePath:process.env.CHROMIUM||'/tmp/chr-local/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const p=await b.newPage({viewport:{width:1280,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto(`http://127.0.0.1:${server.address().port}/index.html?test=1`);await p.evaluate(()=>localStorage.clear());await p.reload();await p.waitForFunction(()=>!!window.__game);
await p.evaluate(()=>{const t=document.getElementById('tut');if(t&&t.style.display!=='none')document.getElementById('tut-skip')?.click()});
for (const course of ['qm','solid-state','astrophysics']) {
  await p.keyboard.press('KeyX'); await p.waitForTimeout(400);
  await p.click(`[data-c="${course}"]`); await p.waitForTimeout(200);
  await p.selectOption('#ex-min','120'); await p.click('[data-mode="full"]'); await p.waitForTimeout(500);
  const info=await p.evaluate(()=>({parts:document.querySelectorAll('.expart').length,mc:document.querySelectorAll('.exq').length,inputs:document.querySelectorAll('[data-fa]').length,top:document.querySelector('.examtop .src').textContent,err:document.querySelectorAll('.katex-error').length}));
  console.log(course,JSON.stringify(info));
  // answer all MC correctly? we click the first option; leave problems empty but tick half the key points
  await p.evaluate(()=>{document.querySelectorAll('.exq').forEach((q,i)=>{if(i%2===0)q.querySelector('.opt').click()})});
  await p.click('#ex-submit'); await p.waitForTimeout(400);
  await p.evaluate(()=>{document.querySelectorAll('.kp').forEach((c,i)=>{if(i%2===0)c.checked=true})});
  await p.click('#ex-final'); await p.waitForTimeout(500);
  console.log(' result:',(await p.evaluate(()=>document.querySelector('.examres').innerText)).replace(/\n/g,' | ').slice(0,220));
  await p.keyboard.press('Escape'); await p.waitForTimeout(200);
}
console.log('history entries:',await p.evaluate(()=>JSON.parse(localStorage.getItem('physics-rpg-v1')).flags?.['exam-hist']?.length ?? Object.keys(JSON.parse(localStorage.getItem('physics-rpg-v1')))));
const bad=errs.length||0;console.log(bad?'FAIL errors '+errs.slice(0,4):'ALL PASS exam hall (3 courses, mock exam, grading, history)');await b.close();server.close();process.exit(bad?1:0);
