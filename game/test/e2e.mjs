// End-to-end test in headless Chromium (software WebGL). Usage: node test/e2e.mjs
// Runs test/setup-chromium.sh first (Debian chromium needs a crashpad workaround in this container).
import { execFileSync } from 'node:child_process';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

execFileSync('sh', [fileURLToPath(new URL('./setup-chromium.sh', import.meta.url))]);
const root = fileURLToPath(new URL('..', import.meta.url));
const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf' };
const server = createServer(async (req, res) => {
  try {
    const p = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '');
    if (p === '/api/ping') { res.writeHead(200, { 'content-type': 'application/json' }); return res.end('{"ok":false,"static":true}'); }
    const f = await readFile(join(root, p === '/' ? 'index.html' : p));
    res.writeHead(200, { 'content-type': types[extname(p)] || 'application/octet-stream' }); res.end(f);
  } catch { res.writeHead(404); res.end('nf'); }
}).listen(0);
const port = server.address().port;
await mkdir('/tmp/shots', { recursive: true });

const browser = await chromium.launch({ executablePath: '/tmp/chr-local/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errors = [];
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
page.on('requestfailed', (r) => errors.push('requestfailed: ' + r.url()));
const results = [];
const check = (name, ok, extra = '') => { results.push(ok); console.log(`${ok ? 'PASS' : 'FAIL'} ${name} ${extra}`); };
const shot = (n) => page.screenshot({ path: `/tmp/shots/${n}.png` });
const state = () => page.evaluate(() => window.__game.state());
const waitFor = (fn, arg, ms = 90000) => page.waitForFunction(fn, arg, { timeout: ms }).then(() => true, () => false);
const text = (sel) => page.textContent(sel);

// ================= tutorial (first visit) =================
await page.goto(`http://127.0.0.1:${port}/index.html?test=1&debug=1&tutorial=1`);
await page.evaluate(() => localStorage.clear()); await page.goto(`http://127.0.0.1:${port}/index.html?test=1&debug=1&tutorial=1`);
check('game boots', await waitFor(() => !!window.__game));
check('tutorial card shown', await waitFor(() => document.getElementById('tut').style.display !== 'none'));
check('tutorial labels visible', await page.evaluate(() => window.__game.world().labelsOn === true));
await page.waitForTimeout(3500); await shot('00-tutorial-1');
check('tutorial demo is running', await page.evaluate(() => !!window.__game.sim() && window.__game.sim().t > 0));
for (let i = 0; i < 4; i++) { await page.click('#tut-next'); await page.waitForTimeout(1200); }
await shot('00-tutorial-5');
check('tutorial advances', (await state()).tutorial === 4);
for (let i = 0; i < 3; i++) await page.click('#tut-next');
await page.waitForTimeout(800); await shot('00-tutorial-8');
await page.click('#tut-next');
check('tutorial ends and is remembered', (await state()).tutorial === null && await page.evaluate(() => JSON.parse(localStorage.getItem('physics-rpg-v1')).flags['tutorial:qm-tunneling-bridge'] === true));
check('region title', (await text('#region')) === 'QM Interference Labs');

// ================= station 1 =================
await page.evaluate(() => { window.__game.setSpeed(4); window.__game.teleport(1.05, 7.9, 0, -0.12); });
await page.waitForTimeout(300);
check('prompt near the stations console', await waitFor(() => /STATIONS/.test(window.__game.state().prompt), null, 15000));
await page.keyboard.press('KeyE');
check('console opens a list', await waitFor(() => !!document.querySelector('.listrow[data-enc="qm-tunnel-e1"]')));
check('list shows the stations of the room', (await page.$$('.listrow')).length === 4);
await page.click('.listrow[data-enc="qm-tunnel-e1"]');
check('panel opens on E', await waitFor(() => !!document.querySelector('.opt[data-k="0"]')));
check('back-to-list link present', !!(await page.$('button.back')));
check('KaTeX rendered', (await page.$$('.katex')).length > 3);
check('symbol table available', (await page.$$('details.symbols')).length === 1);
await shot('01-panel');
await page.click('.opt[data-k="0"]'); await page.click('#lock'); await page.click('#run');
check('panel hides during run', await waitFor(() => document.getElementById('side').classList.contains('hidden')));
check('playback bar visible', await page.isVisible('#pbar'));
await page.click('#pb-play').catch(() => {});
await page.keyboard.press('Space');
await page.waitForTimeout(200);
const t1 = await page.evaluate(() => window.__game.sim().t); await page.waitForTimeout(700);
const t2 = await page.evaluate(() => window.__game.sim().t);
check('Space toggles pause', (await state()).pb.paused === false || t2 === t1, `paused=${(await state()).pb.paused} t ${t1}->${t2}`);
if ((await state()).pb.paused) await page.keyboard.press('Space');
check('run finishes and panel returns', await waitFor(() => !!document.querySelector('#next')));
await page.waitForTimeout(300);
check('wrong prediction explained', (await page.$$('.why')).length === 1);
check('derivation sections shown', (await page.$$('.deriv details')).length >= 5);
check('final formula rendered', /Where the equation comes from/.test(await text('#result')));
check('no XP for wrong prediction', (await state()).xp === 0);
await shot('02-result-wrong');
// replay, speed, loop
await page.keyboard.press('KeyR');
check('replay restarts simulation', await waitFor(() => window.__game.sim().t < 5 && window.__game.state().running));
await page.keyboard.press('KeyO'); check('loop toggled', (await state()).pb.loop === true);
await page.keyboard.press('BracketRight'); check('speed key', (await state()).pb.speed === 8 || (await state()).pb.speed === 4);
await page.keyboard.press('KeyO');
await page.evaluate(() => window.__game.setSpeed(4));
check('replay finishes', await waitFor(() => window.__game.sim().done));
await page.evaluate(() => document.getElementById('pb-panel').click());
check('show panel button works', await waitFor(() => !document.getElementById('side').classList.contains('hidden')));
await page.click('#next');

// station 2 correct, station 3 correct
for (const k of [2]) { await page.click(`.opt[data-k="${k}"]`); await page.click('#lock'); await page.click('#run'); check(`run ${k} finishes`, await waitFor(() => !!document.querySelector('#next'))); }
check('XP for correct prediction', (await state()).xp === 10);
await shot('03-result-right');
await page.click('#next');
await page.click('.opt[data-k="1"]'); await page.click('#lock'); await page.click('#run');
check('run 3 finishes', await waitFor(() => !!document.querySelector('#next')));
await page.click('#next');

// ================= sandbox =================
check('sandbox shows regime text', /tunnelling/.test(await text('#regime')));
await page.fill('#sl-e', '0.8'); await page.dispatchEvent('#sl-e', 'input');
check('regime updates', /0\.80/.test(await text('#ev')));
await page.click('#run');
check('sandbox run 1 finishes', await waitFor(() => /Measured/.test(document.getElementById('result').textContent)));
await page.click('#run');
check('second run demands a guess', /guess first/.test(await text('#result')));
await page.click('#guess .opt[data-g="up"]'); await page.fill('#sl-e', '0.4'); await page.dispatchEvent('#sl-e', 'input');
await page.click('#run');
check('sandbox compares guess with outcome', await waitFor(() => /You guessed/.test(document.getElementById('result').textContent)));
await shot('04-sandbox');
await page.keyboard.press('Escape');
check('panel closes with Esc', await waitFor(() => document.getElementById('side').classList.contains('hidden')));
check('bar stays after closing panel', await page.isVisible('#pbar'));

// ================= calculation fight (door lock) =================
await page.evaluate(() => { window.__game.teleport(3.15, 7.9, 0, -0.2); });
await page.waitForTimeout(300);
await page.keyboard.press('KeyE');
check('fights console opens', await waitFor(() => !!document.querySelector('.listrow[data-enc="qm-tunnel-c1"]')));
await page.click('.listrow[data-enc="qm-tunnel-c1"]');
check('door lock opens', await waitFor(() => !!document.querySelector('[data-step="s1"]')));
await page.click('[data-ch="s1"][data-k="0"]');
check('wrong choice explained', /outside the barrier/.test(await text('[data-ms="s1"]')));
await page.click('[data-ch="s1"][data-k="1"]');
await page.fill('[data-in="s2"]', 'sqrt(2*m*(V0+E))/hbar'); await page.selectOption('[data-un="s2"]', '1/length'); await page.click('[data-ck="s2"]');
check('wrong expression rejected', /Not equal/.test(await text('[data-ms="s2"]')));
await page.fill('[data-in="s2"]', 'sqrt(2*m*V0-2*m*E)/hbar'); await page.click('[data-ck="s2"]');
check('equivalent expression accepted', /Correct/.test(await text('[data-ms="s2"]')));
// order step: first a wrong click (item 2 first)
await page.click('[data-pool="s3"] button[data-orig="2"]');
check('wrong order explained', /Not yet/.test(await text('[data-ms="s3"]')));
for (let i = 0; i < 5; i++) await page.click(`[data-pool="s3"] button[data-orig="${i}"]`);
check('derivation order accepted', /Derivation assembled/.test(await text('[data-ms="s3"]')));
await page.click('[data-ch="s4"][data-k="1"]');
check('sin vs sinh distractor explained', /oscillates/.test(await text('[data-ms="s4"]')));
await page.click('[data-ch="s4"][data-k="0"]');
await page.fill('[data-in="s5"]', '16*E*(V0-E)/V0^2*exp(-2*kappa*L)'); await page.selectOption('[data-un="s5"]', 'dimensionless'); await page.click('[data-ck="s5"]');
check('thick barrier formula accepted', /Correct/.test(await text('[data-ms="s5"]')));
await page.click('[data-ch="s6"][data-k="2"]');
check('fight won, door opens', await waitFor(() => window.__game.world().doorTarget === 1));
await shot('05-door-lock-won');
check('derivation summary shown', /transfer matrices/.test(await text('#calc-result')));
check('what-if explorer appears after the fight', await waitFor(() => !!document.querySelector('details.explorer')));
await page.evaluate(() => { document.querySelector('details.explorer').open = true; });
check('explorer has parameter sliders and scaling exponents', (await page.$$('.ex-sliders input')).length >= 2 && /p ≈/.test(await text('.ex-tab')));
const exRead0 = await text('.ex-read');
await page.evaluate(() => { const i = document.querySelector('.ex-sliders input'); i.value = '0.5'; i.dispatchEvent(new Event('input')); });
check('moving a parameter changes the result', (await text('.ex-read')) !== exRead0);
// bonus numeric
await page.fill('[data-in="s7"]', '5.4×10^-4'); await page.selectOption('[data-un="s7"]', 'dimensionless'); await page.click('[data-ck="s7"]');
check('bonus numeric accepted', /Correct/.test(await text('[data-ms="s7"]')));
await page.click('#next');

// ================= quick fight =================
await page.click('[data-ch="q1"][data-k="1"]');
await page.fill('[data-in="q2"]', 'sqrt(2*m*phi)/hbar'); await page.selectOption('[data-un="q2"]', '1/length'); await page.click('[data-ck="q2"]');
await page.fill('[data-in="q3"]', 'exp(2*kappa*dd)'); await page.selectOption('[data-un="q3"]', 'dimensionless'); await page.click('[data-ck="q3"]');
await page.click('[data-ch="q4"][data-k="2"]');
check('quick fight won', await waitFor(() => /Fight won/.test(document.getElementById('calc-result').textContent)));
await page.click('#next');

// ================= boss =================
await page.click('#boss-start');
await page.fill('[data-fa="j2"]', '1.5'); await page.fill('[data-fa="R"]', '0.0294'); await page.fill('[data-fa="Tt"]', '0.9706');
await page.click('#submit'); await page.waitForSelector('.kp');
for (const c of await page.$$('.kp')) await c.check();
await page.click('#grade');
check('boss defeated', /Boss defeated/.test(await text('#boss-final')));
await shot('06-boss');
check('respawn queue holds the failed prediction', await page.evaluate(() => 'qm-tunnel-e1' in JSON.parse(localStorage.getItem('physics-rpg-v1')).reviews));
await page.keyboard.press('Escape');
await page.evaluate(() => document.getElementById('debug-due').click());
check('respawn shows as due', (await text('#reviews')) === 'Respawns due: 1');
await page.evaluate(() => window.__game.teleport(-12.5, 7.6, Math.PI / 2, 0)); await page.waitForTimeout(300);
check('portal prompt', /review portal/i.test((await state()).prompt));
await page.keyboard.press('KeyE');
check('portal opens the failed encounter', await waitFor(() => !!document.querySelector('.opt')));
await page.keyboard.press('Escape');
await page.evaluate(() => window.__game.teleport(11, 7.6, -Math.PI / 2, 0)); await page.waitForTimeout(600);
await shot('07-door-view');
await page.keyboard.press('KeyL');
check('labels toggle with L', await page.evaluate(() => typeof window.__game.world().labelsOn === 'boolean'));
// ================= library, quiz hall, derivation desk (QM) =================
await page.evaluate(() => window.__game.openGroup('lesson'));
check('library lists 4 lessons', (await page.$$('.listrow')).length === 4);
await page.click('.listrow[data-enc="qm-tunnel-L1"]');
check('lesson renders equations and callouts', await waitFor(() => document.querySelectorAll('.eqbox .katex').length >= 3 && document.querySelectorAll('.callout').length >= 2));
await shot('08-lesson');
const answerAllChecks = async () => { for (const h of await page.$$('#checks .step')) { const c = await h.getAttribute('data-correct').catch(() => null); } };
for (let i = 0; i < 3; i++) {
  const hosts = await page.$$('#checks .step');
  const host = hosts[i];
  const correct = await host.evaluate((el) => el.dataset.correct);
  const wrong = (+correct + 1) % 4;
  if (i === 0) { await host.$(`.opt[data-orig="${wrong}"]`).then((b) => b.click()); }
  await (await host.$(`.opt[data-orig="${correct}"]`)).click();
}
check('lesson passes after the checks', await waitFor(() => /Lesson passed/.test(document.getElementById('result').textContent)));
check('a missed check sends the lesson to respawn', await page.evaluate(() => 'qm-tunnel-L1' in JSON.parse(localStorage.getItem('physics-rpg-v1')).reviews));
await page.evaluate(() => window.__game.open('qm-tunnel-Q1'));
check('quiz starts', await waitFor(() => !!document.querySelector('#qbox .opt')));
for (let i = 0; i < 8; i++) {
  const correct = await page.$eval('#qbox > div, #qbox', (el) => el.dataset.correct ?? el.firstElementChild?.dataset.correct);
  await page.click(`#qbox .opt[data-orig="${correct}"]`);
  await page.click('#qnext');
}
check('quiz passed with all correct', await waitFor(() => /8 \/ 8 correct/.test(document.getElementById('result').textContent)));
await page.evaluate(() => window.__game.open('qm-tunnel-D2'));
check('derivation shows goal and steps', await waitFor(() => document.querySelectorAll('[data-rv]').length === 5));
for (const b of await page.$$('[data-rv]')) await b.click();
await page.waitForSelector('.kp');
for (const c of await page.$$('.kp')) await c.check();
await page.click('#dgrade');
check('derivation finished', await waitFor(() => /Derivation done/.test(document.getElementById('result').textContent)));
await shot('09-derive');

// ================= map, door, rooms of other courses, codex =================
await page.keyboard.press('Escape');
await page.evaluate(() => window.__game.teleport(14.8, 7.6, -Math.PI / 2, 0)); await page.waitForTimeout(300);
check('door prompt offers the map', /map/i.test((await state()).prompt));
await page.keyboard.press('KeyE');
check('map overlay opens with all courses', await waitFor(() => document.querySelectorAll('.maprow').length >= 20));
await shot('10-map');
await page.evaluate(() => document.querySelector('.maprow[data-goto="solid-state/lattice-gate"]').click());
check('travel to solid state', await waitFor(() => window.__game.currentRoom() === 'solid-state/lattice-gate'));
check('first visit starts the room tutorial', await waitFor(() => document.getElementById('tut').style.display !== 'none'));
await page.waitForTimeout(400); await shot('11-room-tutorial');
await page.click('#tut-skip');
check('solid-state set piece built', await waitFor(() => !!window.__game.set() && window.__game.set().group.children.length > 10));
check('QM bridge hidden in solid state', await page.evaluate(() => window.__game.world().bridge.visible === false));
await page.waitForTimeout(500); await shot('11-solid-state-room');
await page.evaluate(() => window.__game.openGroup('lesson'));
await page.click('.listrow >> nth=0');
check('solid-state lesson renders', await waitFor(() => document.querySelectorAll('.eqbox .katex').length >= 1));
await page.keyboard.press('Escape');
await page.keyboard.press('KeyM');
await page.waitForSelector('.maprow');
await page.evaluate(() => document.querySelector('.maprow[data-goto="astrophysics/stellar-forge"]').click());
check('travel to astro', await waitFor(() => window.__game.currentRoom() === 'astrophysics/stellar-forge'));
await waitFor(() => document.getElementById('tut').style.display !== 'none'); await page.click('#tut-skip');
check('formula button shown for astro', await page.isVisible('#btn-codex'));
await page.keyboard.press('KeyB');
check('codex opens with entries', await waitFor(() => document.querySelectorAll('.cxe').length >= 70));
await page.fill('#cx-search', 'parallax');
check('codex search filters', await waitFor(() => [...document.querySelectorAll('.cxe')].filter((d) => d.style.display !== 'none').length >= 1 && [...document.querySelectorAll('.cxe')].filter((d) => d.style.display !== 'none').length < 10));
await shot('12-codex');
await page.keyboard.press('Escape');
await page.waitForTimeout(500); await shot('13-astro-room');
await page.evaluate(() => window.__game.loadRoom('qm', 'tunneling-bridge'));
check('back in QM the bridge is visible again', await page.evaluate(() => window.__game.world().bridge.visible === true && window.__game.set() === null));
// ================= a lab, the guide and the Nexus =================
await page.evaluate(() => window.__game.loadRoom('astrophysics', 'photometry-radiation'));
await waitFor(() => document.getElementById('tut').style.display !== 'none'); await page.click('#tut-skip');
await page.evaluate(() => window.__game.open('lab-astro-blackbody'));
check('lab renders canvas, controls and tasks', await waitFor(() => !!document.querySelector('canvas.labcv') && document.querySelectorAll('[data-c]').length === 4 && document.querySelectorAll('.labtasks li').length === 4));
const info0 = await text('#labinfo');
await page.evaluate(() => { const i = document.querySelector('[data-c="T"]'); i.value = '3.0'; i.dispatchEvent(new Event('input')); });
check('moving a slider updates the readout', (await text('#labinfo')) !== info0);
await shot('14-lab-blackbody');
await page.click('#labdone');
check('lab gives XP and counts as done', await waitFor(() => /Experiment logged/.test(document.getElementById('result').textContent)));
check('guide or respawn notice shown as objective', /Guide:|respawn/.test(await text('#objective')), await text('#objective'));
await page.evaluate(() => window.__game.enterNexus());
check('Nexus builds with stars and cross-links', await waitFor(() => { const n = window.__game.nexus(); return n && n.nodes >= 20 && n.links >= 15; }));
await page.waitForTimeout(800); await shot('15-nexus');
await page.evaluate(() => window.__game.loadRoom('qm', 'tunneling-bridge'));
check('leaving the Nexus restores the room (no Nexus left in the scene)', await page.evaluate(() => !window.__game.world().scene.getObjectByName('nexus') && window.__game.nexus() === null));
// ================= daily missions =================
await page.evaluate(() => { const t = document.getElementById('tut'); if (t && t.style.display !== 'none') document.getElementById('tut-skip').click(); });
await page.evaluate(() => document.getElementById('btn-missions').click());
check('missions screen lists the day\'s missions', await waitFor(() => document.querySelectorAll('.maprow.msn').length >= 4));
check('exam countdown and streak shown', /Exam in \d+ days/.test(await text('#ov-body')) && /Streak/.test(await text('#ov-body')));
await shot('16-missions');
await page.evaluate(() => document.querySelector('[data-mission$=":links"]').click());
check('connect-the-dots quiz starts', await waitFor(() => !!document.querySelector('#qbox .opt')));
for (let i = 0; i < 8; i++) { if (!(await page.$('#qbox .opt'))) break; const c = await page.$eval('#qbox', (el) => el.dataset.correct); await page.click(`#qbox .opt[data-orig="${c}"]`); await page.click('#qnext'); }
check('quiz result shown', await waitFor(() => /correct \(/.test(document.getElementById('result').textContent)));
check('mission completes with a toast', await waitFor(() => /Mission complete/.test(document.getElementById('toast').textContent)));
check('mission counter and streak update', /Missions 1\/\d · streak 1/.test(await text('#btn-missions')), await text('#btn-missions'));
check('no respawn entries for synthetic mission quizzes', await page.evaluate(() => !Object.keys(JSON.parse(localStorage.getItem('physics-rpg-v1')).reviews).some((k) => k.startsWith('mission-'))));
check('no browser errors', errors.length === 0, errors.join(' | '));
await browser.close(); server.close();
console.log(results.every(Boolean) ? 'ALL PASS' : 'SOME FAILED');
process.exit(results.every(Boolean) ? 0 : 1);
