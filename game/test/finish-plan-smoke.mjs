// Finish plan: work left until the target date, minutes per day, Auto run length, skim suggestion when it does not fit.
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
const txt = () => p.evaluate(() => document.querySelector('.cp-finish')?.textContent.replace(/\s+/g, ' ') || '');
const perDay = async () => +((await txt()).match(/(\d+) min a day/) || [])[1];
ck('the finish plan shows, target 15 Jan', await p.evaluate(() => document.getElementById('cp-finish-date')?.value) === '2027-01-15');
const d0 = await perDay(); console.log('   ', (await txt()).slice(0, 220));
ck(`it gives minutes per day (${d0})`, d0 > 0);
await p.evaluate(() => document.querySelector('[data-len="auto"]').click()); await p.waitForTimeout(500);
ck('Auto run length is selected', await p.evaluate(() => document.querySelector('[data-len="auto"]').classList.contains('cur')));
const est = await p.evaluate(() => +(document.querySelector('.cp-runhead .src').textContent.match(/about (\d+) min/) || [])[1]);
const togo = +((await txt()).match(/(\d+) planned min to go/) || [])[1];
ck(`the Auto run is sized from what is left today (about ${est} min, ${togo} min to go)`, est >= 0.75 * togo && est <= 1.3 * togo + 10, (await txt()).slice(0, 300));
const lens = await p.evaluate(() => [...document.querySelectorAll('[data-len]')].map((b) => b.textContent));
console.log('   ', lens.join(' | '));
const mm = lens.map((t) => +(t.match(/(\d+)′/) || [])[1]);
ck('Short, Normal and Long are half, all and 1.5 times the daily target', mm[1] < mm[2] && mm[2] < mm[3] && Math.abs(mm[3] / mm[2] - 1.5) < 0.1, lens.join());
await p.evaluate(() => { const i = document.getElementById('cp-finish-date'); i.value = '2026-12-05'; i.dispatchEvent(new Event('change')); }); await p.waitForTimeout(500);
const d1 = await perDay();
ck(`an earlier target raises the daily load (${d0} -> ${d1})`, d1 > d0);
ck('when it does not fit, skimming low-weight weeks is suggested', await p.locator('#cp-triage').count() === 1, await txt());
await p.evaluate(() => document.getElementById('cp-triage').click()); await p.waitForTimeout(600);
const d2 = await perDay();
ck(`skimming lowers the daily load (${d1} -> ${d2})`, d2 < d1);
// an hour on the clock spent on one card does not use up the day: only the card's planned minutes count
await p.evaluate(() => { const k = 'physics-rpg-v1', st = JSON.parse(localStorage.getItem(k)), d = new Date(), day = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  st.flags.active = { ...(st.flags.active || {}), [day]: 3600 }; st.flags['active-since'] = day; st.flags.activity = [{ t: Date.now(), id: 'qm-wm-L1', title: 'x', type: 'lesson', ok: true }]; localStorage.setItem(k, JSON.stringify(st)); });
await p.reload(); await p.waitForFunction(() => !!window.__game); await p.evaluate(() => document.getElementById('tut-skip')?.click()); await p.keyboard.press('KeyC'); await p.waitForTimeout(600);
const slow = await txt(), pd = +(slow.match(/(\d+) min a day/) || [])[1], left = +(slow.match(/(\d+) planned min to go/) || [])[1];
ck(`60 clock minutes on one lesson count as that lesson's 10 planned minutes (${pd} a day, ${left} to go)`, left === pd - 10 && /your clock today: 60 min/.test(slow), slow.slice(0, 400));
// exam dates per course: each course has its own deadline (exam minus the buffer)
await p.evaluate(() => { const k = 'physics-rpg-v1', st = JSON.parse(localStorage.getItem(k)); st.flags.examDates = { qm: '2027-02-02', 'solid-state': '2027-01-26', astrophysics: '2027-02-09' }; localStorage.setItem(k, JSON.stringify(st)); });
await p.reload(); await p.waitForFunction(() => !!window.__game); await p.evaluate(() => document.getElementById('tut-skip')?.click()); await p.keyboard.press('KeyC'); await p.waitForTimeout(600);
const ex1 = await txt(); console.log('   ', ex1.slice(0, 260));
ck('with exam dates each course gets exam minus 14 days (QM by 19 Jan, Solid by 12 Jan, Astro by 26 Jan)', /QM: [^·]* by (19 Jan|Jan 19)/.test(ex1) && /Solid: [^·]* by (12 Jan|Jan 12)/.test(ex1) && /Astro: [^·]* by (26 Jan|Jan 26)/.test(ex1), ex1);
await p.evaluate(() => { const i = document.getElementById('cp-buffer'); i.value = '7'; i.dispatchEvent(new Event('change')); }); await p.waitForTimeout(500);
ck('a shorter buffer moves the deadlines (QM by 26 Jan)', /QM: [^·]* by (26 Jan|Jan 26)/.test(await txt()));
await b.close(); server.close(); console.log(fails ? `${fails} FAILED` : 'ALL OK'); process.exit(fails ? 1 : 0);
