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
const seeded = { updated: now + 6 * 3600e3, xp: 200, solved: { 'qm-wm-L1': { at: now - 20e3 }, 'qm-wm-Q1': { at: now - 2 * 86400e3 } }, reviews: { 'qm-wm-Q1': { box: 0, due: now - 1000, fails: 1 }, 'qm-tunnel-L1': { box: 1, due: now - 5000, fails: 1 } }, flags: { study: { [day(0)]: 600, [day(-1)]: 1500 }, settings: { goal: 'normal' } }, streak: { last: day(-1), count: 4 }, missions: { [day(-1)]: { done: { x: true }, xp: 10 } } };

// ---- Nexus card scrolls with a finger (phone, sideways and upright)
for (const [name, opts] of [['sideways', phone], ['upright', upright]]) {
  const p = await open(opts); await p.evaluate(() => window.__game.enterNexus()); await p.waitForTimeout(900);
  // find a star whose card has more text than fits (the long descriptions are the ones that need scrolling)
  let info = null;
  const count = await p.evaluate(() => window.__game.set().nodes.length);
  for (let i = 0; i < Math.min(count, 40) && !(info && info.sh > info.ch + 80); i++) { // a card with real overflow (the swipe can only scroll as far as there is more text)
    const spot = await p.evaluate((k) => { const n = window.__game.set().nodes[k], q = n.pos || n.mesh?.position || n.group?.position; return { x: q.x, y: q.y, z: q.z }; }, i);
    await p.evaluate((s) => window.__game.flyTo(s.x, s.y, s.z + 9, 0, 0), spot); await p.waitForTimeout(450);
    info = await p.evaluate(() => { const c = document.getElementById('nx-card'); return { shown: getComputedStyle(c).display !== 'none', sh: c.scrollHeight, ch: c.clientHeight, focus: window.__game.nexus()?.focus }; });
  }
  ck(`${name}: the room card shows when flying up to a star (${info.focus})`, info.shown);
  ck(`${name}: this card has more text than fits (${info.sh} > ${info.ch})`, info.sh > info.ch + 80);
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

// ---- the room card must never sit on top of a control: "Fly into", the fly buttons and the stick stay reachable, in every phone size
const boxes = (p, sels) => p.evaluate((ss) => ss.map((s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(), cs = getComputedStyle(e); return cs.display === 'none' || e.hidden || !r.width ? null : { s, l: r.left, t: r.top, r: r.right, b: r.bottom }; }), sels);
const hit = (a, b) => a && b && a.l < b.r && a.r > b.l && a.t < b.b && a.b > b.t;
for (const [w, h] of [[844, 390], [740, 360], [667, 375], [390, 780], [360, 640]]) {
  const p = await open({ viewport: { width: w, height: h }, hasTouch: true, isMobile: true }); await p.evaluate(() => window.__game.enterNexus()); await p.waitForTimeout(900);
  let shown = false, count = await p.evaluate(() => window.__game.set().nodes.length), room0 = await p.evaluate(() => window.__game.currentRoom());
  for (let i = 0; i < Math.min(count, 12) && !shown; i++) {
    const spot = await p.evaluate((k) => { const n = window.__game.set().nodes[k], q = n.pos || n.mesh?.position || n.group?.position; return { x: q.x, y: q.y, z: q.z }; }, i);
    await p.evaluate((s) => window.__game.flyTo(s.x, s.y, s.z + 9, 0, 0), spot); await p.waitForTimeout(450);
    shown = (await boxes(p, ['#nx-card', '#t-act']))?.every(Boolean);
  }
  const [card, act, up, down, fast, joy, tl] = await boxes(p, ['#nx-card', '#t-act', '#t-up', '#t-down', '#t-fast', '#joy', '#hud .tl']);
  ck(`${w}x${h}: the card and the "Fly into" button show together`, !!card && !!act);
  ck(`${w}x${h}: the card covers none of: Fly into, ▲ ▼ », the stick`, ![act, up, down, fast, joy].some((x) => hit(card, x)), JSON.stringify({ card, act }));
  ck(`${w}x${h}: everything stays on the screen`, [card, act, joy].every((x) => x && x.l >= 0 && x.t >= 0 && x.r <= w + 0.5 && x.b <= h + 0.5), JSON.stringify({ card, act, joy }));
  const top = await p.evaluate(([x, y]) => { const e = document.elementFromPoint(x, y); return e && (e.id || e.closest('#t-act')?.id); }, [(act.l + act.r) / 2, (act.t + act.b) / 2]);
  ck(`${w}x${h}: a finger on "Fly into" reaches the button (not the card)`, top === 't-act', top);
  await p.touchscreen.tap((act.l + act.r) / 2, (act.t + act.b) / 2); await p.waitForTimeout(1600);
  ck(`${w}x${h}: tapping it flies into the room`, (await p.evaluate(() => window.__game.currentRoom())) !== room0 && !(await p.evaluate(() => !!window.__game.nexus())));
  await p.context().close();
}

// ---- formulas on a phone: the panel never drifts sideways; a wide equation scrolls inside its own box and can be scrolled back
for (const [name, opts] of [['upright', upright], ['sideways', phone]]) {
  const p = await open(opts); await p.evaluate(() => window.__game.loadRoom('qm', 'tunneling-bridge')); await p.waitForTimeout(800); await p.evaluate(() => document.getElementById('tut')?.style.display !== 'none' && document.getElementById('tut-skip')?.click());
  await p.evaluate(() => document.getElementById('btn-codex').click()); await p.waitForTimeout(700);
  const w = await p.evaluate(() => ({ sw: document.getElementById('cx').scrollWidth, cw: document.getElementById('cx').clientWidth }));
  ck(`${name}: the formula panel has no sideways overflow (${w.sw} <= ${w.cw})`, w.sw <= w.cw + 1);
  const cdp = await p.context().newCDPSession(p);
  const target = await p.evaluate(() => { const e = [...document.querySelectorAll('#cx .cxe, #cx .katex-display')].find((x) => x.scrollWidth > x.clientWidth + 40); if (!e) return null; e.setAttribute('data-wide', '1'); e.scrollIntoView({ block: 'center' }); const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, w: r.width }; });
  ck(`${name}: there is a formula wider than the panel`, !!target);
  if (target) {
    await p.waitForTimeout(200); const t2 = await p.evaluate(() => { const r = document.querySelector('[data-wide]').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + Math.min(r.height / 2, 30) }; });
    const swipe = async (dx) => { await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: t2.x - dx / 2, y: t2.y, id: 1 }] }); for (let i = 1; i <= 12; i++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: t2.x - dx / 2 + (dx * i) / 12, y: t2.y, id: 1 }] }); await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await p.waitForTimeout(350); };
    const sl = () => p.evaluate(() => ({ eq: document.querySelector('[data-wide]').scrollLeft, panel: document.getElementById('cx').scrollLeft }));
    await swipe(-160); const right = await sl(); ck(`${name}: swiping the wide formula to the left scrolls it (${right.eq}px), the panel stays put`, right.eq > 30 && right.panel === 0);
    await swipe(300); const back = await sl(); ck(`${name}: swiping back scrolls it to the start again (${back.eq}px)`, back.eq < right.eq - 20 && back.panel === 0);
  }
  // even if something pushes the panel sideways (focus, selection), it snaps back, and a reopened panel starts at the left
  await p.evaluate(() => { document.getElementById('cx').scrollLeft = 150; }); await p.waitForTimeout(250);
  ck(`${name}: a panel pushed sideways snaps back`, await p.evaluate(() => document.getElementById('cx').scrollLeft === 0));
  await p.evaluate(() => { const c = document.getElementById('cx'); c.style.scrollBehavior = 'auto'; c.scrollLeft = 150; document.getElementById('btn-codex').click(); }); await p.waitForTimeout(250); await p.evaluate(() => document.getElementById('btn-codex').click()); await p.waitForTimeout(300);
  ck(`${name}: closed and reopened, the formulas start at the left`, await p.evaluate(() => document.getElementById('cx').scrollLeft === 0));
  await p.context().close();
}

// ---- connections: the button is on the phone toolbar, in rooms and in the Nexus (all topics, or the star you face), also from the menu and the Nexus card
for (const [name, opts] of [['sideways', phone], ['upright', upright]]) {
  const p = await open(opts); await p.evaluate(() => window.__game.loadRoom('qm', 'tunneling-bridge')); await p.waitForTimeout(800); await p.evaluate(() => document.getElementById('tut')?.style.display !== 'none' && document.getElementById('tut-skip')?.click());
  const vis = (s) => p.evaluate((q) => { const e = document.querySelector(q); return !!e && getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().width > 30; }, s);
  ck(`${name}: the Connections button is on the toolbar`, await vis('#btn-conn'));
  await p.touchscreen.tap(...(await centre(p, '#btn-conn'))); await p.waitForTimeout(600);
  const room = await p.evaluate(() => ({ open: window.__game.state().panelOpen, text: document.getElementById('panel').innerText.slice(0, 160), n: document.querySelectorAll('#panel details[data-lk]').length }));
  ck(`${name}: in a room it lists that room's connections (${room.n})`, room.open && room.text.includes('Connections of') && room.n >= 2);
  await p.evaluate(() => window.__game.close()); await p.click('#btn-menu'); await p.waitForTimeout(300);
  ck(`${name}: the menu offers both connection views`, await p.evaluate(() => { const t = document.getElementById('ov-body').innerText; return t.includes('Connections of this room') && t.includes('All connections'); }));
  await p.evaluate(() => document.querySelector('[data-m="allconn"]').click()); await p.waitForTimeout(700);
  const all = await p.evaluate(() => ({ head: document.getElementById('panel').innerText.slice(0, 60), n: document.querySelectorAll('#panel details[data-lk]').length, empty: document.querySelector('#panel .lk-body').innerHTML === '' }));
  ck(`${name}: "All connections" lists every link of all topics (${all.n}), cards typeset when opened`, all.head.includes('All connections') && all.n >= 40 && all.empty);
  await p.evaluate(() => { const d = document.querySelector('#panel details[data-lk]'); d.open = true; }); await p.waitForTimeout(600);
  ck(`${name}: opening one shows the equations and the dictionary`, await p.evaluate(() => document.querySelector('#panel .lk-body').innerHTML.length > 200));
  // in the Nexus
  await p.evaluate(() => window.__game.close()); await p.evaluate(() => window.__game.enterNexus()); await p.waitForTimeout(900);
  await p.touchscreen.tap(...(await centre(p, '#btn-conn'))); await p.waitForTimeout(700);
  ck(`${name}: in the Nexus the button opens the overview of all topics`, await p.evaluate(() => document.getElementById('panel').innerText.includes('All connections') && document.querySelectorAll('#panel details[data-lk]').length >= 40));
  await p.evaluate(() => window.__game.close()); await p.waitForTimeout(300);
  // facing a star: the card's connections are buttons, and "Open all" lists that star's connections
  let n = 0; const count = await p.evaluate(() => window.__game.set().nodes.length);
  for (let i = 0; i < Math.min(count, 12) && !n; i++) {
    const spot = await p.evaluate((k) => { const s = window.__game.set().nodes[k], q = s.pos || s.mesh?.position || s.group?.position; return { x: q.x, y: q.y, z: q.z }; }, i);
    await p.evaluate((s) => window.__game.flyTo(s.x, s.y, s.z + 9, 0, 0), spot); await p.waitForTimeout(450);
    n = await p.evaluate(() => document.querySelectorAll('#nx-card [data-lkopen]').length);
  }
  ck(`${name}: the star card lists its connections as buttons (${n})`, n >= 1);
  const total = await p.evaluate(() => +(document.querySelector('#nx-card h4')?.textContent.match(/\d+/) || [0])[0]);
  await p.evaluate(() => document.querySelector('#nx-card [data-allconn]').click()); await p.waitForTimeout(600);
  ck(`${name}: "Open all in detail" shows that star's ${total} connections`, await p.evaluate((t) => document.getElementById('panel').innerText.includes('Connections of') && document.querySelectorAll('#panel details[data-lk]').length === t, total));
  await p.evaluate(() => window.__game.close()); await p.waitForTimeout(300);
  await p.evaluate(() => document.querySelector('#nx-card [data-lkopen]').click()); await p.waitForTimeout(600);
  ck(`${name}: tapping one connection on the card opens its full explanation`, await p.evaluate(() => window.__game.state().panelOpen && document.getElementById('panel').innerText.includes('Fly to')));
  await p.context().close();
}

// ---- the screen is never locked by itself; the menu can lock and unlock it (a recorded fake of the orientation API)
{
  const ctx = await b.newContext({ viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true });
  await ctx.addInitScript(() => { window.__rot = []; try { Object.defineProperty(screen.orientation, 'lock', { value: async (t) => { window.__rot.push('lock ' + t); } }); Object.defineProperty(screen.orientation, 'unlock', { value: () => { window.__rot.push('unlock'); } }); } catch (e) {} Element.prototype.requestFullscreen = async () => {}; });
  const p = await ctx.newPage(); p.on('pageerror', (e) => errs.push(e.message)); await p.goto(url); await p.evaluate(() => localStorage.setItem('physics-rpg-landscape', '1')); await p.reload(); await p.waitForFunction(() => !!window.__game); await p.waitForTimeout(800);
  await p.touchscreen.tap(400, 200); await p.waitForTimeout(300); await p.touchscreen.tap(300, 250); await p.waitForTimeout(300);
  ck('a stored "lock sideways" choice from the old version does nothing and is forgotten', await p.evaluate(() => window.__rot.length === 0 && localStorage.getItem('physics-rpg-landscape') === '0'));
  await p.click('#btn-menu'); await p.waitForTimeout(300);
  ck('menu has both: Play sideways and Let the screen rotate', await p.evaluate(() => { const t = document.getElementById('ov-body').innerText; return t.includes('Play sideways') && t.includes('Let the screen rotate'); }));
  await p.evaluate(() => document.querySelector('[data-m="landscape"]').click()); await p.waitForTimeout(400);
  ck('Play sideways locks to landscape', await p.evaluate(() => window.__rot.join() === 'lock landscape'));
  await p.click('#btn-menu'); await p.waitForTimeout(300); await p.evaluate(() => document.querySelector('[data-m="unlock"]').click()); await p.waitForTimeout(300);
  ck('Let the screen rotate unlocks it', await p.evaluate(() => window.__rot.join() === 'lock landscape,unlock'));
  await p.reload(); await p.waitForFunction(() => !!window.__game); await p.waitForTimeout(600); await p.touchscreen.tap(400, 200);
  ck('after a reload nothing locks again by itself', await p.evaluate(() => window.__rot.length === 0));
  await ctx.close();
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
