// Extras around the runs: simulations, mock exam, mixed practice; mock exams and summary stops inside the runs.
// Usage: node test/campaign-smoke.mjs
import { createServer } from 'node:http'; import { readFile } from 'node:fs/promises'; import { extname, join, normalize } from 'node:path';
import { chromium } from 'playwright-core';
const root = new URL('..', import.meta.url).pathname; const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.woff2': 'font/woff2', '.png': 'image/png' };
const server = createServer(async (q, res) => { try { const p = normalize(decodeURIComponent(new URL(q.url, 'http://x').pathname)); if (p === '/api/ping') { res.writeHead(200); return res.end('{"ok":false}'); } const f = await readFile(join(root, p === '/' ? 'index.html' : p)); res.writeHead(200, { 'content-type': types[extname(p)] || 'application/octet-stream' }); res.end(f); } catch { res.writeHead(404); res.end(); } }).listen(0);
const b = await chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: 1280, height: 860 } }); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
await p.goto(`http://127.0.0.1:${server.address().port}/index.html?test=1&hud=compact`); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForFunction(() => !!window.__game);
let fails = 0; const ck = (n, c, x = '') => { if (!c) fails++; console.log(`${c ? 'PASS' : 'FAIL'} ${n} ${c ? '' : x}`); };
p.on('pageerror', (e) => { fails++; console.log('pageerror', e.message); });
await p.evaluate(() => document.getElementById('tut-skip')?.click());
await p.click('#st-go').catch(() => {}); await p.waitForTimeout(600); await p.evaluate(() => document.getElementById('tut-skip')?.click()); await p.keyboard.press('Escape');
await p.keyboard.press('KeyC'); await p.waitForTimeout(500); await p.evaluate(() => document.getElementById('cp-setup-ok').click()); await p.waitForTimeout(600);
const ex = await p.evaluate(() => ({ html: document.querySelector('.cp-extras')?.innerText || '', sims: document.querySelectorAll('.cp-extras [data-wopen]').length }));
ck(`the campaign has an Extras section with simulations (${ex.sims})`, ex.sims >= 5 && /Mock exam/.test(ex.html) && /Mixed practice/.test(ex.html), ex.html.slice(0, 200));
ck('setup marks early solid-state weeks as done, so a My summary stop comes into the run', await p.evaluate(() => window.__game.runStops().some((s) => s.kind === 'summary')), JSON.stringify(await p.evaluate(() => window.__game.runStops())));
await p.evaluate(() => document.getElementById('cp-x-mock').click()); await p.waitForTimeout(600);
ck('Mock exam opens the exam hall', await p.evaluate(() => /Exam hall/.test(document.getElementById('ov-body')?.innerText || '')));
await p.keyboard.press('Escape'); await p.keyboard.press('KeyC'); await p.waitForTimeout(400);
await p.evaluate(() => document.getElementById('cp-x-mix').click()); await p.waitForTimeout(600);
console.log('   tab:', await p.evaluate(() => [...document.querySelectorAll('.studytabs .cur, [data-stab].cur')].map((x) => x.textContent + '|' + x.dataset.stab).join(',')));
ck('Mixed practice opens its tab', await p.evaluate(() => !!document.querySelector('[data-stab="mix"].cur') || /Interleaved practice|Mixed topics/.test(document.getElementById('ov-body')?.innerText || '')));
await p.keyboard.press('Escape'); await p.keyboard.press('KeyC'); await p.waitForTimeout(400);
// final phase: a target 7 days away puts a mock exam into the run and into the finish plan
await p.evaluate(() => { const d = new Date(Date.now() + 7 * 86400000); const i = document.getElementById('cp-finish-date'); i.value = d.toISOString().slice(0, 10); i.dispatchEvent(new Event('change')); }); await p.waitForTimeout(500);
await p.evaluate(() => [...document.querySelectorAll('[data-len]')].find((b) => b.classList.contains('cur'))?.click()); await p.waitForTimeout(500);
ck('in the last 14 days a timed mock exam is a run stop', await p.evaluate(() => window.__game.runStops().some((s) => s.kind === 'mock')), JSON.stringify(await p.evaluate(() => window.__game.runStops())));
ck('the finish plan counts the mock exams', /timed mock exam/.test(await p.evaluate(() => document.querySelector('.cp-finish').innerText)));
await b.close(); server.close(); console.log(fails ? `${fails} FAILED` : 'ALL OK'); process.exit(fails ? 1 : 0);
