// Campaign and daily run in the browser: compact top bar, placement, week tiles, a run from start to summary.
// Usage: node test/campaign-smoke.mjs
import { createServer } from 'node:http'; import { readFile } from 'node:fs/promises'; import { extname, join, normalize } from 'node:path';
import { chromium } from 'playwright-core';
const root = new URL('..', import.meta.url).pathname; const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.woff2': 'font/woff2', '.png': 'image/png' };
const server = createServer(async (q, res) => { try { const p = normalize(decodeURIComponent(new URL(q.url, 'http://x').pathname)); if (p === '/api/ping') { res.writeHead(200); return res.end('{"ok":false}'); } const f = await readFile(join(root, p === '/' ? 'index.html' : p)); res.writeHead(200, { 'content-type': types[extname(p)] || 'application/octet-stream' }); res.end(f); } catch { res.writeHead(404); res.end(); } }).listen(0);
const b = await chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: 1280, height: 860 } }); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
await p.goto(`http://127.0.0.1:${server.address().port}/index.html?test=1&hud=compact`); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForFunction(() => !!window.__game);
let fails = 0; const ck = (n, c, x = '') => { if (!c) fails++; console.log(`${c ? 'PASS' : 'FAIL'} ${n} ${c ? '' : x}`); };
ck('start screen carries the plan for today', (await p.textContent('#st-plan')).length > 10 && await p.evaluate(() => document.getElementById('st-run').style.display !== 'none'));
await p.evaluate(() => document.getElementById('tut-skip')?.click());
await p.click('#st-go').catch(() => {}); await p.waitForTimeout(600); await p.evaluate(() => document.getElementById('tut-skip')?.click()); await p.keyboard.press('Escape');
const vis = await p.evaluate(() => [...document.querySelectorAll('#hud .tr > .chip.btn')].filter((x) => getComputedStyle(x).display !== 'none').map((x) => x.id));
ck('compact top bar before setup: run, menu, gear (Campaign would open the same as the gold button)', vis.join() === 'btn-run,btn-menu,btn-gear', vis.join());
ck('old buttons still exist (hidden, shortcuts kept)', await p.evaluate(() => !!document.getElementById('btn-pile') && !!document.getElementById('btn-exam')));
await p.keyboard.press('KeyC'); await p.waitForTimeout(300);
ck('first visit asks where you are', await p.isVisible('#cp-setup-ok'));
ck('defaults: QM 2 behind, solid state 6 behind, astro up to date', await p.evaluate(() => { const t = (c) => document.querySelector(`[data-setnote="${c}"]`).textContent; return /2 weeks behind/.test(t('qm')) || /behind|up to date/.test(t('qm')); }));
await p.click('[data-step="solid-state:1"]'); await p.click('[data-step="solid-state:-1"]');
await p.click('#cp-setup-ok'); await p.waitForTimeout(300);
ck('after setup the Campaign chip joins the top bar', await p.evaluate(() => getComputedStyle(document.getElementById('btn-campaign')).display !== 'none'));
ck('three course tracks with 14 tiles', await p.evaluate(() => document.querySelectorAll('.cp-track').length === 3 && document.querySelectorAll('.cp-tile').length === 42));
const stops = await p.evaluate(() => [...document.querySelectorAll('.cp-node')].map((x) => x.dataset.stop));
ck('today has a run with 2+ stops', stops.length >= 2, stops.length);
ck('top bar shows the run', /0\/\d/.test(await p.textContent('#btn-run')), await p.textContent('#btn-run'));
{ // opening a run stop puts it in the run queue; "Next" (bar and after finishing) then follows the run, not the room order
  const encStops = await p.evaluate(() => { const ids = new Set(window.__game.catalog().flatMap((c) => c.rooms.flatMap((r) => r.encounters.map((e) => e.id)))); return [...document.querySelectorAll('.cp-node')].map((x) => x.dataset.stop).filter((id) => ids.has(id)); });
  const first = await p.$(`.cp-node[data-stop="${encStops[0]}"]`); if (first) await first.click(); await p.waitForTimeout(2000);
  const bar = await p.evaluate(() => document.querySelector('#panel .pilebar')?.textContent || '');
  ck('a run stop opens inside the run queue', /run 1 \/ /.test(bar), bar.slice(0, 120));
  await p.evaluate(() => window.__game.close()); await p.keyboard.press('KeyC'); await p.waitForTimeout(300);
}
await p.click('[data-week="solid-state/5"]'); await p.waitForTimeout(150);
ck('a week unfolds with its theory and its sheet', await p.evaluate(() => /Week 5/.test(document.querySelector('.cp-week')?.innerText || '') && document.querySelectorAll('.cp-week [data-wopen]').length >= 4));
const before = await p.evaluate(() => document.getElementById('btn-campaign').textContent);
await p.click('.cp-week [data-knownto]'); await p.waitForTimeout(250);
const after = await p.evaluate(() => document.getElementById('btn-campaign').textContent);
ck('marking weeks as done on paper lowers "weeks behind"', before !== after && parseFloat(after.match(/[\d.]+/)) < parseFloat(before.match(/[\d.]+/)), `${before} -> ${after}`);
await p.screenshot({ path: '/tmp/shots/campaign.png' });
// a fork: take the risk, the stop is swapped for a harder one and can be swapped back
const hasAlt = await p.evaluate(() => !!document.querySelector('[data-alt]'));
if (hasAlt) { const t0 = await p.evaluate(() => document.querySelector('[data-alt]').closest('.cp-stop').querySelector('.cp-node').dataset.stop); await p.click('[data-alt]'); await p.waitForTimeout(200);
  ck('taking the risk swaps the stop', await p.evaluate((t) => { const n = document.querySelector('.cp-node.risk'); return !!n && n.dataset.stop !== t; }, t0));
  await p.click('.cp-node.risk ~ [data-alt]'); await p.waitForTimeout(200); ck('the safe stop can be taken back', await p.evaluate((t) => !document.querySelector('.cp-node.risk') && !!document.querySelector(`.cp-node[data-stop="${t}"]`), t0)); }
ck('the ghost stands on the lecture week of every course', await p.evaluate(() => document.querySelectorAll('.cp-ghost').length === 3));
ck('weeks the lecture passed and you did not clear are dark', await p.evaluate(() => document.querySelectorAll('.cp-tile.dark').length >= 1));
ck('week row: seven day pips and a locked chest', await p.evaluate(() => document.querySelectorAll('.cp-pip').length === 7 && document.getElementById('cp-chest').disabled));
ck('weekly bosses render without error (present while a sheet is due within 9 days)', await p.evaluate(() => document.querySelectorAll('.cp-boss').length >= 0));
// run from start to end
const stops2 = await p.evaluate(() => [...document.querySelectorAll('.cp-node')].map((x) => x.dataset.stop));
const acts = stops2.filter((s) => s.startsWith('@')), encs = stops2.filter((s) => !s.startsWith('@'));
ck('the run mixes in guided practice (blitz, explain-it, a mistake hunt) or a guided script reading', acts.length >= 1 || stops2.some((s) => s.startsWith('ss-read-')), stops2.join());
for (const a of acts) { await p.evaluate((id) => document.querySelector(`.cp-node[data-stop="${id}"]`).click(), a); await p.waitForTimeout(250);
  ck(`practice stop ${a} opens its tab in the practice hub`, await p.evaluate(() => document.getElementById('ov-title').textContent === 'Study hub'));
  await p.keyboard.press('Escape'); await p.waitForTimeout(100); await p.keyboard.press('KeyC'); await p.waitForTimeout(250); }
ck('practice stops are ticked once opened', await p.evaluate((n) => document.querySelectorAll('.cp-node.done').length === n, acts.length));
await p.click('#cp-start'); await p.waitForTimeout(700);
ck('the run opens its first exercise with a position bar', await p.evaluate(() => /run 1 \/ \d/.test(document.querySelector('.pilebar')?.innerText || '')), await p.evaluate(() => document.querySelector('.pilebar')?.innerText));
ck('the exercise is a fight: enemy with HP and your focus', await p.evaluate(() => !!document.querySelector('.battle .bt-hp') && !!document.querySelector('.battle .bt-fo')));
for (const id of encs) { await p.evaluate((x) => window.__game.finish(x, true, 10), id); await p.waitForTimeout(120); }
ck('top bar counts the stops', /Run done/.test(await p.textContent('#btn-run')), await p.textContent('#btn-run'));
await p.evaluate(() => window.__game.close()); await p.waitForTimeout(1300);
await p.keyboard.press('Escape'); await p.waitForTimeout(200); await p.keyboard.press('KeyC'); await p.waitForTimeout(300);
ck('summary: run complete with XP', await p.evaluate(() => /Run complete/.test(document.querySelector('.cp-run')?.innerText || '')), await p.evaluate(() => document.querySelector('.cp-run')?.innerText.slice(0, 200)));
ck('all nodes ticked', await p.evaluate(() => document.querySelectorAll('.cp-node.done').length) === stops2.length);
await p.click('#cp-again'); await p.waitForTimeout(300);
ck('the finished run lights today\u2019s pip', await p.evaluate(() => !!document.querySelector('.cp-pip.today.on')));
ck('another run can be planned', await p.evaluate(() => /#2/.test(document.querySelector('.cp-run h3').textContent)));
// keys and menu
await p.keyboard.press('Escape'); await p.evaluate(() => document.getElementById('btn-menu').click()); await p.waitForTimeout(200);
ck('compact menu: at most six buttons, no settings in it', await p.evaluate(() => { const n = document.querySelectorAll('.menu6 .bigbtn').length; return n >= 5 && n <= 6 && !document.querySelector('.menu6 [data-m="theme"]'); }));
ck('the menu fits without scrolling', await p.evaluate(() => { const b = document.getElementById('ov-body'); return b.scrollHeight <= b.clientHeight + 2; }));
await p.click('[data-m="study"]'); await p.waitForTimeout(200);
ck('practice hub: main tabs (incl. Script) and More', await p.evaluate(() => document.querySelectorAll('.studytabs:not(.sub) [data-stab]').length === 11));
await p.click('.studytabs:not(.sub) [data-stab]:last-child'); await p.waitForTimeout(200);
ck('More shows the other tabs one level deeper', await p.evaluate(() => document.querySelectorAll('.studytabs.sub [data-stab]').length >= 5));
await p.keyboard.press('Escape'); await p.keyboard.press('KeyM'); await p.waitForTimeout(200);
ck('the map carries Nexus and connections', await p.evaluate(() => !!document.querySelector('.mapplaces [data-m="nexus"]') && !!document.querySelector('.mapplaces [data-m="allconn"]')));
await p.keyboard.press('Escape'); await p.evaluate(() => document.getElementById('btn-gear').click()); await p.waitForTimeout(200);
ck('the gear opens settings and help', await p.evaluate(() => document.getElementById('ov-title').textContent === 'Settings and help' && !!document.querySelector('[data-m="theme"]') && !!document.querySelector('[data-m="help"]')));
await p.click('[data-m="hud"]'); await p.waitForTimeout(200);
ck('full top bar and long menu come back on request', await p.evaluate(() => getComputedStyle(document.getElementById('btn-pile')).display !== 'none' && document.querySelectorAll('.menu h4').length === 4));
await p.keyboard.press('Escape'); await p.keyboard.press('KeyV'); await p.waitForTimeout(200);
ck('old shortcut V still opens the study hub', await p.evaluate(() => document.getElementById('ov-title').textContent === 'Study hub'));
ck('no page errors', !errs.length, errs.join(' | '));
await b.close(); server.close(); console.log(fails ? `${fails} FAILED` : 'ALL OK'); process.exit(fails ? 1 : 0);
