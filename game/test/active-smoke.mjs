// "Study time" is time spent working on exercises: menus, lists and idle time do not count; an open exercise with you using the screen does.
// Usage: node test/active-smoke.mjs   (CHROMIUM=/path/to/chromium if needed). The idle limit is shortened to 3 s through ?idle=3000 (test mode only).
import { spawn } from 'node:child_process'; import { mkdtempSync, existsSync } from 'node:fs'; import { tmpdir } from 'node:os';
import { chromium } from 'playwright-core';
const root = new URL('..', import.meta.url).pathname, port = 19600 + Math.floor(Math.random() * 300);
const srv = spawn('python3', [root + 'serve.py', '--port', String(port)], { env: { ...process.env, PHYSICS_RPG_PROFILES: mkdtempSync(tmpdir() + '/rpg-') }, stdio: 'ignore' }); await new Promise((r) => setTimeout(r, 800));
const exe = process.env.CHROMIUM || ['/opt/pw-browsers/chromium', '/tmp/chr-local/chromium'].find(existsSync);
const b = await chromium.launch({ executablePath: exe, headless: true, args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
let fails = 0; const ck = (n, c, extra = '') => { if (!c) fails++; console.log(`${c ? 'PASS' : 'FAIL'} ${n}${c ? '' : '  ' + extra}`); }; const errs = [];
const p = await (await b.newContext({ viewport: { width: 1100, height: 700 } })).newPage(); p.on('pageerror', (e) => errs.push(e.message));
await p.goto(`http://127.0.0.1:${port}/index.html?test=1&idle=3000`); await p.waitForFunction(() => !!window.__game); await p.waitForTimeout(900);
await p.evaluate(() => document.getElementById('tut')?.style.display !== 'none' && document.getElementById('tut-skip')?.click());
const secs = () => p.evaluate(() => window.__game.activeSeconds());
const busy = async (ms) => { const t0 = Date.now(); let i = 0; while (Date.now() - t0 < ms) { await p.mouse.move(300 + (i++ % 50), 300); await p.waitForTimeout(400); } };

// 1. menus, maps, the formula drawer, lists: nothing counts, even with constant activity
await p.keyboard.press('KeyM'); await busy(6000); await p.keyboard.press('Escape'); await p.keyboard.press('KeyB'); await busy(5000); await p.keyboard.press('KeyB');
await p.keyboard.press('KeyT'); await busy(4000); await p.keyboard.press('Escape');
const menus = await secs(); ck(`15 s in the map, the formulas and the missions list count for nothing (${menus} s)`, menus === 0);
// 2. an exercise is open and you use the screen: counts
await p.evaluate(() => window.__game.loadRoom('qm', 'wave-mechanics-basics')); await p.waitForTimeout(700); await p.evaluate(() => document.getElementById('tut')?.style.display !== 'none' && document.getElementById('tut-skip')?.click());
await p.evaluate(() => window.__game.open('qm-wm-L1')); await p.waitForTimeout(500); const before = await secs(); await busy(10000); const working = (await secs()) - before;
ck(`10 s working on an exercise count (${working} s)`, working >= 8 && working <= 12);
// 3. the exercise stays open but nobody touches anything: only the grace period counts
const b2 = await secs(); await p.waitForTimeout(9000); const idle = (await secs()) - b2;
ck(`9 s without touching the screen count only for the 3 s grace period (${idle} s)`, idle <= 4);
// 4. coming back counts again
const b3 = await secs(); await busy(6000); const back = (await secs()) - b3; ck(`and counting resumes when you are back (${back} s)`, back >= 5);
// 5. the exercise list (a console) is not an exercise
await p.evaluate(() => window.__game.close()); await p.evaluate(() => window.__game.openGroup('lesson')); await p.waitForTimeout(400); const b4 = await secs(); await busy(5000);
ck(`a list of exercises is not an exercise (${(await secs()) - b4} s)`, (await secs()) - b4 === 0);
// 6. the exam hall counts, the Today view does not
await p.evaluate(() => window.__game.close()); await p.keyboard.press('KeyX'); await p.waitForTimeout(500); const b5 = await secs(); await busy(6000); const exam = (await secs()) - b5; await p.keyboard.press('Escape');
ck(`working in the exam hall counts (${exam} s)`, exam >= 5);
await p.keyboard.press('KeyV'); await p.waitForTimeout(400); const b6 = await secs(); await busy(5000); ck('reading the Today view does not count', (await secs()) - b6 === 0); await p.keyboard.press('Escape');
// 7. the goal can be reached by finishing exercises without any minutes
await p.evaluate(() => { window.__game.finish('qm-wm-L2', true, 5); window.__game.finish('qm-wm-L3', false, 0); window.__game.finish('qm-wm-D2', true, 5); }); await p.waitForTimeout(300);
let g = await p.evaluate(() => window.__game.goal()); ck(`3 of 4 exercises: goal not reached yet (min ${g.min}, ex ${g.ex}/${g.exGoal})`, g.ex === 3 && !g.done);
await p.evaluate(() => window.__game.finish('qm-wm-b1', true, 5)); await p.waitForTimeout(500); g = await p.evaluate(() => window.__game.goal());
ck('the 4th finished exercise reaches the daily goal without enough minutes', g.ex === 4 && g.min < g.goal && g.done);
ck('and the game records that the goal was reached today', await p.evaluate(() => Object.keys(JSON.parse(localStorage.getItem('physics-rpg-v1')).flags).some((k) => k.startsWith('goal:'))));
await p.keyboard.press('KeyT'); await p.waitForTimeout(400);
ck('the missions screen shows both measures', await p.evaluate(() => document.getElementById('ov-body').innerText.includes('Daily goal:') && document.getElementById('ov-body').innerText.includes('4 of 4 exercises')));
ck('no page errors', errs.length === 0); if (errs.length) console.log(errs.slice(0, 4));
await b.close(); srv.kill(); console.log(fails ? `${fails} FAILED` : 'ALL PASSED'); process.exit(fails ? 1 : 0);
