// Every experiment, in every slider/toggle extreme: its explanation must be fully typeset (no stray $ or raw LaTeX left over). Usage: node test/labs-text-smoke.mjs
import { spawn } from 'node:child_process'; import { mkdtempSync } from 'node:fs'; import { tmpdir } from 'node:os';
import { chromium } from 'playwright-core';
const port=19800+Math.floor(Math.random()*90), srv=spawn('python3',[new URL('../serve.py', import.meta.url).pathname,'--port',String(port)],{env:{...process.env,PHYSICS_RPG_PROFILES:mkdtempSync(tmpdir()+'/rpg-')},stdio:'ignore'}); await new Promise(r=>setTimeout(r,800));
const b=await chromium.launch({executablePath:process.env.CHROMIUM||'/opt/pw-browsers/chromium',args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const p=await b.newPage({viewport:{width:1100,height:700}});
await p.goto(`http://127.0.0.1:${port}/index.html?test=1&nexus=1`); await p.waitForFunction(()=>!!window.__game);
const labs=[]; for(const f of ['labs','labs-qm','labs-solid-state','labs-astrophysics']){const j=await (await fetch(`http://127.0.0.1:${port}/content/${f}.json`)).json(); labs.push(...j.labs.map(l=>l.enc.id));}
let bad=0; for(const id of labs){ await p.evaluate(id=>window.__game.open(id),id); await p.waitForTimeout(600);
 // toggle every checkbox and move sliders to extremes: the info text must stay typeset in each state
 const states=await p.evaluate(()=>{const out=[];const inputs=[...document.querySelectorAll('#side [data-c]')];const chk=()=>{const t=document.querySelector('#side').innerText; out.push(/\$|\^\{|\\\\[a-z]+|m\^\*/.test(t)? t.slice(0,0)+'RAW:'+(t.match(/.{0,40}(\$|\^\{|\\\\[a-z]+|m\^\*).{0,40}/)||[''])[0]:'ok')};chk();
  for(const i of inputs){ if(i.type==='checkbox'){i.checked=!i.checked;i.dispatchEvent(new Event('input',{bubbles:true}));chk();i.checked=!i.checked;i.dispatchEvent(new Event('input',{bubbles:true}));} else {for(const v of [i.min,i.max]){i.value=v;i.dispatchEvent(new Event('input',{bubbles:true}));chk();} } } return out;});
 const raw=states.filter(s=>s!=='ok'); if(raw.length){bad++; console.log('RAW in',id,raw[0]);} await p.evaluate(()=>window.__game.close()); }
console.log(bad?'FAIL':'PASS','labs',labs.length,'with raw text',bad); await b.close(); srv.kill(); process.exit(bad?1:0);
