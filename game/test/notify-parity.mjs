// The notifier (deploy/notify.py) re-implements parts of the game logic in Python. This test seeds many progress states, asks the game in the
// browser and the script what is next / due / the streak / the goal, and demands the same answers.  Usage: node test/notify-parity.mjs
import { spawn, spawnSync } from 'node:child_process'; import { mkdtempSync, writeFileSync, readFileSync, existsSync } from 'node:fs'; import { tmpdir } from 'node:os'; import { join } from 'node:path';
import { chromium } from 'playwright-core';
const root = new URL('..', import.meta.url).pathname, port = 19800 + Math.floor(Math.random() * 100), tmp = mkdtempSync(join(tmpdir(), 'par-'));
const srv = spawn('python3', [root + 'serve.py', '--port', String(port)], { env: { ...process.env, PHYSICS_RPG_PROFILES: join(tmp, 'profiles') }, stdio: 'ignore' }); await new Promise((r) => setTimeout(r, 700));
const exe = process.env.CHROMIUM || ['/opt/pw-browsers/chromium', '/tmp/chr-local/chromium'].find(existsSync);
const b = await chromium.launch({ executablePath: exe, headless: true, args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const ctx = await b.newContext({ viewport: { width: 1000, height: 700 }, timezoneId: 'Europe/Zurich' }), p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
let fails = 0; const ck = (n, c, extra = '') => { if (!c) fails++; console.log(`${c ? 'PASS' : 'FAIL'} ${n}${c ? '' : '  ' + extra}`); };
const dayStr = (n) => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Zurich' }).format(new Date(Date.now() + n * 86400000));
const wk = (d) => { const [y, m, dd] = d.split('-').map(Number), t = new Date(Date.UTC(y, m - 1, dd)), dow = (t.getUTCDay() + 6) % 7; t.setUTCDate(t.getUTCDate() - dow + 3); const f = new Date(Date.UTC(t.getUTCFullYear(), 0, 4)); return `${t.getUTCFullYear()}-W${String(1 + Math.round(((t - f) / 86400000 - 3 + ((f.getUTCDay() + 6) % 7)) / 7)).padStart(2, '0')}`; };

await p.goto(`http://127.0.0.1:${port}/index.html?test=1`); await p.waitForFunction(() => !!window.__game); await p.waitForTimeout(800);
const catalog = await p.evaluate(() => window.__game.catalog()), path = JSON.parse(readFileSync(root + 'content/path.json', 'utf8')).route;
const routeIds = []; for (const it of path) { const [c, r] = it.key.split('/'); const room = catalog.find((x) => x.id === c)?.rooms.find((x) => x.id === r); for (const e of room?.encounters || []) if (e.type !== 'sandbox') routeIds.push(e.id); }
const all = catalog.flatMap((c) => c.rooms.flatMap((r) => r.encounters.map((e) => e.id)));
const now = Date.now(), solvedFirst = (n, failedEvery = 0) => Object.fromEntries(routeIds.slice(0, n).map((id, i) => [id, failedEvery && i % failedEvery === 0 ? { at: now - 3 * 86400e3, failed: true } : { at: now - (1 + (i % 12)) * 86400e3 }]));
const act = (n) => Array.from({ length: n }, (_, i) => ({ t: Date.now() - 4000 * (i + 1), id: routeIds[i], title: 'x', type: 'lesson', ok: i % 3 !== 0, xp: 5, review: false, mission: false }));
const due = (ids) => Object.fromEntries(ids.map((id, i) => [id, { box: i % 3, due: now - 1000 * (i + 1), fails: 1 + (i % 2) }]));
const cases = [
  ['fresh profile', {}],
  ['40 exercises done', { solved: solvedFirst(40) }],
  ['120 done, some failed, 3 respawns due', { solved: solvedFirst(120, 7), reviews: due([routeIds[7], routeIds[14], routeIds[21]]) }],
  ['300 done, goal intense, 25 min today', { solved: solvedFirst(300), flags: { settings: { goal: 'intense' }, study: { [dayStr(0)]: 1500, [dayStr(-2)]: 3000 } } }],
  ['streak alive, studied yesterday', { solved: solvedFirst(60), streak: { last: dayStr(-1), count: 5 }, missions: { [dayStr(-1)]: { done: { a: 1 }, xp: 5 } } }],
  ['streak done today', { solved: solvedFirst(60), streak: { last: dayStr(0), count: 8 }, missions: { [dayStr(0)]: { done: { a: 1, b: 1 }, xp: 5 } } }],
  ['missed one day, freeze available', { solved: solvedFirst(60), streak: { last: dayStr(-2), count: 7 } }],
  ['missed one day, freeze already used this week', { solved: solvedFirst(60), streak: { last: dayStr(-2), count: 7 }, freeze: { week: wk(dayStr(0)) } }],
  ['missed three days', { solved: solvedFirst(60), streak: { last: dayStr(-4), count: 7 } }],
  ['active exercise time beats the old "panel open" number', { solved: solvedFirst(30), flags: { study: { [dayStr(0)]: 3000 }, active: { [dayStr(0)]: 200 }, 'active-since': dayStr(-1) } }],
  ['two exercises finished today, hardly any active minutes', { solved: solvedFirst(10), flags: { activity: act(2), active: { [dayStr(0)]: 30 }, 'active-since': dayStr(0) } }],
  ['four finished today: the goal is reached by the number of exercises', { solved: solvedFirst(10), flags: { activity: act(4), 'active-since': dayStr(0) } }],
  ['light goal, a mission quiz in the log', { solved: solvedFirst(10), flags: { settings: { goal: 'light' }, activity: [...act(1), { t: Date.now() - 1000, id: dayStr(0) + ':blitz', title: 'Blitz', type: 'quiz', ok: true, xp: 10, mission: true }] } }],
  ['exercises solved earlier today count too', { solved: Object.fromEntries(routeIds.slice(0, 3).map((id, i) => [id, { at: Date.now() - 9000 * (i + 1) }])) }],
  ['everything done', { solved: Object.fromEntries(all.map((id) => [id, { at: now - 86400e3 }])) }],
];
let i = 0;
for (const [name, st] of cases) {
  const state = { updated: now + 3600e3 + (i++) * 1000, xp: 100, solved: {}, reviews: {}, flags: {}, ...st };
  await p.evaluate((s) => localStorage.setItem('physics-rpg-v1', JSON.stringify(s)), state); await p.reload(); await p.waitForFunction(() => !!window.__game); await p.waitForTimeout(600);
  const js = await p.evaluate(() => ({ next: window.__game.nextStep(), quick: window.__game.quickIds(), streak: window.__game.streak(), due: window.__game.state().due, goal: window.__game.goal(), week: (() => { const w = window.__game.weekStats(); return { exercises: w.exercises, minutes: w.total, missions: w.missions }; })() }));
  const f = join(tmp, `s${i}.json`); writeFileSync(f, JSON.stringify({ state }));
  const r = spawnSync('python3', [root + '../deploy/notify.py', '--json', '--profile-file', f], { env: { ...process.env, NOTIFY_TZ: 'Europe/Zurich' }, encoding: 'utf8' });
  if (r.status !== 0) { ck(`${name}: python ran`, false, r.stderr); continue; }
  const py = JSON.parse(r.stdout);
  const same = (a, b2) => JSON.stringify(a) === JSON.stringify(b2);
  ck(`${name}: next step`, same(py.next, js.next), `py ${JSON.stringify(py.next)} js ${JSON.stringify(js.next)}`);
  ck(`${name}: quick session`, same(py.quick, js.quick), `py ${py.quick} js ${js.quick}`);
  ck(`${name}: streak`, py.streak.count === js.streak.count && py.streak.alive === js.streak.alive && py.streak.saved === js.streak.saved, `py ${JSON.stringify(py.streak)} js ${JSON.stringify(js.streak)}`);
  ck(`${name}: due respawns`, same([...py.due].sort(), [...js.due].sort()), `py ${py.due} js ${js.due}`);
  ck(`${name}: daily goal (minutes, exercises, reached)`, py.goal === js.goal.goal && py.minutesToday === js.goal.min && py.exercisesToday === js.goal.ex && py.goalExercises === js.goal.exGoal && py.goalReached === js.goal.done, `py ${py.goal} ${py.minutesToday} ${py.exercisesToday} ${py.goalExercises} ${py.goalReached} js ${JSON.stringify(js.goal)}`);
  ck(`${name}: week numbers`, py.week.exercises === js.week.exercises && py.week.minutes === js.week.minutes && py.week.missions === js.week.missions, `py ${py.goal} ${JSON.stringify(py.week)} js ${js.goal} ${JSON.stringify(js.week)}`);
}
ck('no page errors', errs.length === 0); if (errs.length) console.log(errs.slice(0, 3));
await b.close(); srv.kill(); console.log(fails ? `${fails} FAILED` : 'ALL PASSED'); process.exit(fails ? 1 : 0);
