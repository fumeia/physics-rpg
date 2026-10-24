// Nexus card scrolling on a phone, quick session, week view, missions overlay (goal bar, streak freeze), answer feedback.
// Usage: node test/features-smoke.mjs   (CHROMIUM=/path/to/chromium if needed)
import { spawn } from 'node:child_process'; import { mkdtempSync, existsSync } from 'node:fs'; import { tmpdir } from 'node:os';
import { chromium } from 'playwright-core';
const root = new URL('..', import.meta.url).pathname, port = 19200 + Math.floor(Math.random() * 500);
const srv = spawn('python3', [root + 'serve.py', '--port', String(port)], { env: { ...process.env, PHYSICS_RPG_PROFILES: mkdtempSync(tmpdir() + '/rpg-') }, stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 700));
const exe = process.env.CHROMIUM || ['/opt/pw-browsers/chromium', '/tmp/chr-local/chromium'].find(existsSync);
const b = await chromium.launch({ executablePath: exe, headless: true, args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
let fails = 0; const ck = (n, c) => { if (!c) fails++; console.log(`${c ? 'PASS' : 'FAIL'} ${n}`); }; const errs = [];
const url = `http://127.0.0.1:${port}/index.html?test=1`;
const day = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
async function open(opts, state) {
  const ctx = await b.newContext(opts), p = await ctx.newPage(); p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  await p.goto(url); if (state) await p.evaluate((s) => localStorage.setItem('physics-rpg-v1', JSON.stringify(s)), state); await p.reload();
  await p.waitForFunction(() => !!window.__game); await p.waitForTimeout(800);
  await p.evaluate(() => document.getElementById('tut')?.style.display !== 'none' && document.getElementById('tut-skip')?.click()); return p;
}
const phone = { viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true }, upright = { viewport: { width: 390, height: 780 }, hasTouch: true, isMobile: true }, desk = { viewport: { width: 1200, height: 750 } };
const centre = async (p, sel) => p.evaluate((s) => { const r = document.querySelector(s).getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }, sel);
const now = Date.now();
const seeded = { updated: now + 60000, xp: 200, solved: { 'qm-wm-L1': { at: now - 20e3 }, 'qm-wm-Q1': { at: now - 2 * 86400e3 } }, reviews: { 'qm-wm-Q1': { box: 0, due: now - 1000, fails: 1 }, 'qm-tunnel-L1': { box: 1, due: now - 5000, fails: 1 } }, flags: { study: { [day(0)]: 600, [day(-1)]: 1500 }, settings: { goal: 'normal' } }, streak: { last: day(-1), count: 4 }, missions: { [day(-1)]: { done: { x: true }, xp: 10 } } };

// ---- Nexus card scrolls with a finger (phone, sideways and upright)
for (const [name, opts] of [['sideways', phone], ['upright', upright]]) {
  const p = await open(opts); await p.evaluate(() => window.__game.enterNexus()); await p.waitForTimeout(900);
  // find a star whose card has more text than fits (the long descriptions are the ones that need scrolling)
  let info = null;
  const count = await p.evaluate(() => window.__game.set().nodes.length);
  for (let i = 0; i < Math.min(count, 40) && !(info && info.sh > info.ch + 5); i++) {
    const spot = await p.evaluate((k) => { const n = window.__game.set().nodes[k], q = n.pos || n.mesh?.position || n.group?.position; return { x: q.x, y: q.y, z: q.z }; }, i);
    await p.evaluate((s) => window.__game.flyTo(s.x, s.y, s.z + 9, 0, 0), spot); await p.waitForTimeout(450);
    info = await p.evaluate(() => { const c = document.getElementById('nx-card'); return { shown: getComputedStyle(c).display !== 'none', sh: c.scrollHeight, ch: c.clientHeight, focus: window.__game.nexus()?.focus }; });
  }
  ck(`${name}: the room card shows when flying up to a star (${info.focus})`, info.shown);
  ck(`${name}: this card has more text than fits (${info.sh} > ${info.ch})`, info.sh > info.ch + 5);
  const yaw0 = (await p.evaluate(() => window.__game.state().yaw)), [cx, cy] = await centre(p, '#nx-card'), cdp = await p.context().newCDPSession(p);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: cx, y: cy + 40, id: 1 }] });
  for (let i = 1; i <= 10; i++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: cx, y: cy + 40 - i * 12, id: 1 }] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await p.waitForTimeout(400);
  const after = await p.evaluate(() => ({ top: document.getElementById('nx-card').scrollTop, yaw: window.__game.state().yaw, shown: getComputedStyle(document.getElementById('nx-card')).display !== 'none' }));
  ck(`${name}: swiping the card scrolls it (scrollTop ${after.top})`, after.top > 20);
  ck(`${name}: and does not turn the view`, Math.abs(after.yaw - yaw0) < 0.02);
  if (name === 'sideways') { const j = await p.evaluate(() => { const c = document.getElementById('nx-card').getBoundingClientRect(), s = document.getElementById('joy').getBoundingClientRect(); return !(c.left < s.right && c.right > s.left && c.top < s.bottom && c.bottom > s.top); }); ck('sideways: the card does not cover the stick', j); await p.screenshot({ path: '/tmp/shots/nx-card-sideways.png' }); }
  else await p.screenshot({ path: '/tmp/shots/nx-card-upright.png' });
  await p.context().close();
}

// ---- seeded profile on a desktop: quick session, week, missions
let p = await open(desk, seeded);
const ids = await p.evaluate(() => window.__game.quickIds()); ck(`quick session starts with the due respawns, most overdue first (${ids})`, ids[0] === 'qm-tunnel-L1' && ids[1] === 'qm-wm-Q1' && ids.length <= 3);
await p.keyboard.press('KeyT'); await p.waitForTimeout(400);
const mis = await p.evaluate(() => document.getElementById('ov-body').innerText);
ck('missions: streak 4 and freeze ready', mis.includes('Streak: 4 days') && mis.includes('Weekly freeze ready'));
ck('missions: daily goal bar (10 of 20 min)', mis.includes('Daily goal: 10 of 20 min'));
ck('missions: quick session button', await p.evaluate(() => !!document.getElementById('quick-go')));
await p.click('#quick-go'); await p.waitForTimeout(900);
const q1 = await p.evaluate(() => ({ open: window.__game.state().panelOpen, bar: document.querySelector('.pilebar')?.innerText || '' }));
ck(`quick session opens the first exercise (${q1.bar.replace(/\n/g, ' ')})`, q1.open && /Quick session 1 \/ \d/.test(q1.bar));
ck('and offers the next one', await p.evaluate(() => !!document.querySelector('.pilenext')));
await p.evaluate(() => document.querySelector('.pilenext').click()); await p.waitForTimeout(700);
ck('next goes to exercise 2', await p.evaluate(() => /Quick session 2 \/ \d/.test(document.querySelector('.pilebar')?.innerText || '')));
await p.evaluate(() => window.__game.close()); await p.keyboard.press('KeyV'); await p.waitForTimeout(400);
await p.evaluate(() => document.querySelector('[data-stab="week"]').click()); await p.waitForTimeout(300);
const wk = await p.evaluate(() => document.getElementById('ov-body').innerText);
ck('week view: minutes, exercises, courses', /35 min/.test(wk) && wk.includes('exercises passed') && wk.includes('Progress per course') && wk.includes('Strongest'));
ck('week view: shows 2 respawns due', wk.includes('2 respawns'));
await p.screenshot({ path: '/tmp/shots/week.png' });
await p.context().close();

// ---- what I did today: the Today view (logged entries, earlier finished ones, XP, missions) and live updates through finish()
p = await open(desk, { ...seeded, xpLog: { [day(0)]: 35 }, flags: { ...seeded.flags, activity: [{ t: now - 600e3, id: 'qm-tunnel-L1', title: 'Stationary states', type: 'lesson', ok: true, xp: 20, review: true }, { t: now - 300e3, id: 'qm-wm-Q1', title: 'Wave mechanics quiz', type: 'quiz', ok: false, xp: 0, review: false }] }, missions: { [day(0)]: { done: {}, xp: 0 } } });
await p.keyboard.press('KeyV'); await p.waitForTimeout(500);
const td = await p.evaluate(() => ({ text: document.getElementById('ov-body').innerText, tab: document.querySelector('.studytabs .cur')?.textContent, rows: document.querySelectorAll('.todayrow').length }));
ck(`Today is the first tab of the Study hub and opens by default (${td.tab})`, td.tab === 'Today');
ck('Today: 10 min studied, 35 XP, two passed (one logged, one finished earlier today), one to retry', td.text.includes('10 min studied') && td.text.includes('+35 XP') && td.text.includes('2 exercises') && td.text.includes('1 to retry'));
ck('Today: lists the exercises with result, XP and the respawn note', td.rows === 3 && td.text.includes('Stationary states') && td.text.includes('+20 XP') && td.text.includes('respawn cleared') && td.text.includes('comes back as a respawn'));
await p.evaluate(() => window.__game.finish('qm-wm-L2', true, 15)); await p.evaluate(() => window.__game.finish('qm-wm-L3', false, 0)); await p.waitForTimeout(300);
await p.evaluate(() => document.querySelector('[data-stab="today"]').click()); await p.waitForTimeout(300);
const td2 = await p.evaluate(() => document.getElementById('ov-body').innerText);
ck('Today: an exercise finished a moment ago shows up (passed, +15 XP), a failed one too', td2.includes('+15 XP') && td2.includes('+50 XP') && /3 exercises/.test(td2) && /2 to retry/.test(td2));
ck('Today: clicking an exercise opens it', await (async () => { await p.evaluate(() => document.querySelector('[data-todayopen="qm-wm-L2"]').click()); await p.waitForTimeout(700); return p.evaluate(() => window.__game.state().panelOpen); })());
await p.evaluate(() => window.__game.close()); await p.keyboard.press('KeyT'); await p.waitForTimeout(400);
ck('Missions screen links to it with the numbers', await p.evaluate(() => { const t = document.getElementById('ov-body').innerText; return t.includes('Done today: 3 exercises') && !!document.getElementById('msn-today'); }));
await p.context().close();

// ---- streak saved only by the freeze (last mission two days ago)
p = await open(desk, { ...seeded, streak: { last: day(-2), count: 6 }, missions: {} });
await p.keyboard.press('KeyT'); await p.waitForTimeout(400);
const fz = await p.evaluate(() => document.getElementById('ov-body').innerText);
ck('missed day: streak 6 still alive, with a warning that only the freeze keeps it', fz.includes('Streak: 6 days') && fz.includes('only your weekly freeze'));
await p.context().close();
p = await open(desk, { ...seeded, streak: { last: day(-3), count: 6 }, missions: {} });
await p.keyboard.press('KeyT'); await p.waitForTimeout(400);
ck('two missed days: streak is gone', (await p.evaluate(() => document.getElementById('ov-body').innerText)).includes('Streak: 0 days'));
await p.context().close();

// ---- feedback on a right answer, floating XP
p = await open(desk, seeded);
await p.evaluate(() => window.__game.loadRoom('qm', 'wave-mechanics-basics')); await p.waitForTimeout(700); await p.evaluate(() => document.getElementById('tut')?.style.display !== 'none' && document.getElementById('tut-skip')?.click());
await p.evaluate(() => window.__game.open('qm-wm-Q1')); await p.waitForTimeout(600);
// the quiz shuffles its options: click them one by one; every click must be followed by the pulse that matches the result
let sawRight = false, sawWrong = false, matched = true;
for (let i = 0; i < 4 && !(sawRight && sawWrong); i++) {
  const btn = (await p.$$('.opt:not([disabled])'))[0]; if (!btn) { await p.evaluate(() => window.__game.close()); await p.evaluate(() => window.__game.open('qm-wm-Q1')); await p.waitForTimeout(500); continue; }
  await btn.evaluate((e) => e.click()); await p.waitForTimeout(260);
  const r = await p.evaluate(() => ({ right: !!document.querySelector('.opt.right') && !document.querySelector('.opt.wrong'), pulseRight: !!document.querySelector('.pulse.right'), pulseWrong: !!document.querySelector('.pulse.wrong') }));
  if (r.right) { sawRight = true; matched = matched && r.pulseRight && !r.pulseWrong; } else { sawWrong = true; matched = matched && r.pulseWrong && !r.pulseRight; }
  await p.waitForTimeout(700);
}
ck(`answers: the pulse always matches the result (right ${sawRight}, wrong ${sawWrong})`, matched && (sawRight || sawWrong));
await p.evaluate(() => window.__game.close()); await p.waitForTimeout(300);
await p.keyboard.press('KeyP'); await p.waitForTimeout(500);
await p.check('#set-sound'); await p.selectOption('#set-goal', 'intense'); await p.waitForTimeout(300);
ck('settings: sound and goal are saved', await p.evaluate(() => { const s = JSON.parse(localStorage.getItem('physics-rpg-v1')).flags.settings; return s.sound === true && s.goal === 'intense'; }));
await p.context().close();

ck('no page errors', errs.length === 0); if (errs.length) console.log([...new Set(errs)].slice(0, 5));
await b.close(); srv.kill(); console.log(fails ? `${fails} FAILED` : 'ALL PASSED'); process.exit(fails ? 1 : 0);
