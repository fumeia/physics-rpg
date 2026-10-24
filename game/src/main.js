import { controlsChoice, setControlsChoice, themeChoice, setThemeChoice, isLight, landscapePref, setLandscapePref } from './theme.js'; // first: applies the theme before anything is drawn
import { World, SCALE } from './world.js';
import { Player } from './player.js';
import { TunnelSim } from './sim.js';
import { mount, finish as finishEncounter } from './encounters.js';
import { store, setXpHook, localDate } from './store.js';
import { M, prettyText } from './math.js';
import katex from '../vendor/katex/katex.mjs';
import { loadGlossary, setGlossaryCourse, whereHtml } from './glossary.js';
import { buildNexus, STYLE as NEXUS_STYLE } from './rooms/nexus.js';
import { mountExamHall } from './exam.js';
import { buildLabHolos } from './labholo.js';
import { mistakes, updateMistake, weakSpots } from './mistakes.js';
import { renderDrillTab, setDrillData, drillData } from './drills.js';
import { initTouch } from './touch.js';
import { configureFeedback, floatXp, pulse, sfx, watchAnswers } from './feedback.js';
import { headers as apiHeaders, initSync, listProfiles, switchProfile, sync, onSyncStatus, push as pushNow } from './sync.js';
import { ACH, context as achContext, unlockedNow } from './achievements.js';
import { buildMissions, examPlan, levelOf, todayStr, yesterdayStr, dayBeforeYesterdayStr, daysToExam, GOALS, GOAL_EXERCISES } from './missions.js';

const $ = (id) => document.getElementById(id);
const canvas = $('view');
const params = new URLSearchParams(location.search);
// touch mode (phones, tablets): the full 3D game with an on-screen stick, drag-to-look and an action button (auto on touch screens, or ?touch=1 / ?touch=0)
const touch = params.has('touch') ? params.get('touch') !== '0' : controlsChoice() === 'touch' ? true : controlsChoice() === 'desktop' ? false : matchMedia('(pointer: coarse)').matches;
function reloadWithout(...names) { const u = new URL(location.href); for (const n of names) u.searchParams.delete(n); location.href = u.toString(); }
// lite mode: no 3D rendering, a menu instead of walking. Opt-in for slow phones (menu button, or ?lite=1 / ?lite=0)
const storedLite = () => { try { return localStorage.getItem('physics-rpg-lite') === '1'; } catch { return false; } };
const lite = params.has('lite') ? params.get('lite') !== '0' : storedLite();
function setLitePref(on) {
  try { localStorage.setItem('physics-rpg-lite', on ? '1' : '0'); } catch { /* ignore */ }
  reloadWithout('lite');
}
let touchUI = null;
// ---- start screen: a progress bar while the game loads, ONE tap to enter (a tap during loading is remembered and starts the game when it is ready)
const startEl = $('start'), nextFrame = () => new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));
let startWanted = false, startReady = false, startEntered = false, startAction = null;
function progress(pct, text) {
  $('st-bar').classList.remove('indet'); const p = Math.max(4, Math.min(100, Math.round(pct))); $('st-fill').style.width = `${p}%`;
  if (startWanted || window.__want) $('st-status').textContent = `Starting... ${p} %`; else if (text) $('st-status').textContent = text;
}
function requestStart(action) { if (action) startAction = action; startWanted = true; if (startReady) enterGame(); else { const g = $('st-go'); g.disabled = true; g.textContent = 'Starting...'; } }
function enterGame() {
  if (startEntered || startEl.style.display === 'none') return; startEntered = true; startEl.classList.add('leaving'); setTimeout(() => { startEl.style.display = 'none'; }, 380);
  Promise.resolve((startAction || startPlay)()).catch((e) => console.warn('start failed', e));
}
function renderStartStats() {
  const lv = levelOf(store.xp), sn = streakNow(), d = daysToExam(), due = store.dueReviews().length, parts = [`Level ${lv.lv} ${lv.rank}`, `${store.xp} XP`];
  if (sn.count) parts.push(`${sn.count}-day streak`); if (due) parts.push(`${due} respawn${due === 1 ? '' : 's'} due`); if (d > 0 && d < 500) parts.push(`${d} days to the exam`);
  $('st-stats').innerHTML = parts.map((p) => `<span>${p}</span>`).join('');
}
const STEPS_PER_SECOND = 144; // QM simulation steps per second at speed 1x (one run takes about 10 s)

// Courses: content folder, optional 3D set piece module (null = the QM bridge exhibit of the world itself)
const COURSES = [
  { id: 'qm', dir: 'qm', name: 'Quantum Mechanics', bridge: true, module: './rooms/qm.js' },
  { id: 'solid-state', dir: 'solid-state', name: 'Solid State Physics', bridge: false, module: './rooms/solid-state.js' },
  { id: 'astrophysics', dir: 'astrophysics', name: 'Astrophysics', bridge: false, module: './rooms/astrophysics.js' },
];
// Console groups in a room, in study order
const GROUPS = [
  { key: 'lesson', label: 'LIBRARY', types: ['lesson'], blurb: 'Theory and intuition cards with check questions' },
  { key: 'lab', label: 'EXPERIMENTS', types: ['lab'], blurb: 'Interactive simulations: change something, remove a term, see what happens' },
  { key: 'quiz', label: 'QUIZ HALL', types: ['quiz'], blurb: 'Exam-style multiple choice (quick fights)' },
  { key: 'derive', label: 'DERIVATION DESK', types: ['derive'], blurb: 'Derivations on paper, step by step' },
  { key: 'station', label: 'STATIONS', types: ['predict-observe', 'sandbox'], blurb: 'Predict, watch the simulation, explain' },
  { key: 'fight', label: 'FIGHTS', types: ['calc'], blurb: 'Calculation fights: equations first, numbers last' },
  { key: 'boss', label: 'BOSS GATE', types: ['boss'], blurb: 'Old exam problems on paper under the timer' },
];

let bridgeOn = false; // is the QM bridge exhibit the 3D content of the current room?
let holos = null, world, player, course, room, set = null, current = null, unmountPanel = null, dueTarget = null, tut = null, overlay = null;
let catalog = [], encIndex = new Map(), codexByCourse = {}, groups = [], linksData = [], route = [], banks = {}, dayMissions = null, dayKey = '';
let inNexus = false, nexusFocusKey = null;
const modules = {};
const pb = { speed: 1, loop: false, paused: false };
let view = { variant: null, sim: null };
let runner = null;

// ================================================================ boot
async function boot() {
  setLandscapePref(false); // older versions stored a "lock sideways" choice and re-applied it on every visit: forget it
  if (params.get('orientation') === 'free') { try { screen.orientation.unlock(); } catch { /* ignore */ } }
  const fetchJson = async (u) => (await fetch(u)).json();
  progress(3, 'Loading the courses...');
  let labs = []; for (const f of ['labs', 'labs-qm', 'labs-solid-state', 'labs-astrophysics']) { try { labs = labs.concat((await fetchJson(`content/${f}.json`)).labs); } catch { /* optional file */ } }
  const idxs = await Promise.all(COURSES.map((c) => fetchJson(`content/${c.dir}/index.json`))), roomTotal = idxs.reduce((n, i) => n + i.rooms.length, 0); let roomsGot = 0;
  progress(6, 'Loading the courses...');
  for (const [ci, c] of COURSES.entries()) {
    const idx = idxs[ci];
    const rooms = (await Promise.all(idx.rooms.map(async (id) => { const r = await fetchJson(`content/${c.dir}/${id}.json`); progress(6 + 54 * (++roomsGot) / roomTotal); return r; }))).map((r, i) => ({ ...r, slug: idx.rooms[i] }));
    for (const l of labs) { const [lc, ls] = l.room.split('/'); if (lc !== c.id) continue; const r = rooms.find((x) => x.slug === ls); if (!r) continue; let at = 0; r.encounters.forEach((e, i) => { if (e.type === 'lesson') at = i + 1; }); r.encounters.splice(at, 0, l.enc); }
    catalog.push({ ...c, region: idx.region, rooms });
    try { banks[c.id] = await fetchJson(`content/${c.dir}/blitz.json`); } catch { /* optional question bank */ }
    if (idx.codex) codexByCourse[c.id] = await fetchJson(`content/${c.dir}/${idx.codex}`);
    for (const r of rooms) for (const enc of r.encounters) encIndex.set(enc.id, { course: c.id, roomId: r.slug, enc });
  }
  progress(62, 'Loading the glossary...'); await loadGlossary();
  progress(68, 'Loading your progress...'); await initSync(); renderStartStats();
  store.pruneReviews(new Set(encIndex.keys()));
  progress(74, 'Loading drills and connections...');
  try { const mf = await fetchJson('content/manifest.json'); for (const cid of mf.drills || []) { const c = catalog.find((x) => x.id === cid); if (c) setDrillData(cid, await fetchJson(`content/${c.dir}/drills.json`)); } if (mf.radar) drillData.radar = await fetchJson('content/radar.json'); } catch (e) { console.warn('drills not loaded', e.message); }
  try { linksData = (await fetchJson('content/links.json')).links; } catch { linksData = []; }
  for (const f of ['links-plain-1', 'links-plain-2']) { try { const pl = await fetchJson(`content/${f}.json`); for (const l of linksData) if (pl[l.id]) l.plain = pl[l.id]; } catch { /* optional */ } }
  for (const c of catalog) for (const f of ['hints', 'hints-2']) { try { const h = await fetchJson(`content/${c.dir}/${f}.json`); for (const r of c.rooms) for (const e of r.encounters) if (h[e.id]) e.hints = h[e.id]; } catch { /* optional */ } }
  try { route = (await fetchJson('content/path.json')).route; } catch { route = []; }
  progress(88, 'Building the 3D world...'); await nextFrame();
  world = new World(canvas);
  player = new Player(canvas, world);
  if (touch) document.body.classList.add('touch');
  watchPanels();
  applySettings();
  setXpHook(floatXp); watchAnswers([$('panel'), $('ov-body')]); window.addEventListener('encounter-done', () => setTimeout(checkGoal, 50));
  onSyncStatus(updateProfileChip);
  $('close').onclick = () => closePanel();
  const last0 = store.last, lastRoom = last0 && findRoom(last0.course, last0.room);
  if (lastRoom) { $('resume').style.display = ''; $('resume').textContent = `Continue in ${lastRoom.title}`; $('resume').onclick = (ev) => { ev.stopPropagation(); requestStart(async () => { player.enabled = true; await loadRoom(last0.course, last0.room, { silent: false }); if ($('tour-chip').style.display === 'none') player.lock(); }); }; }
  $('start-profile').textContent = `Profile: ${store.profile}`;
  $('st-profile').onclick = (ev) => { ev.stopPropagation(); requestStart(() => { player.enabled = true; openOverlay('profile'); }); };
  $('st-go').onclick = (ev) => { ev.stopPropagation(); requestStart(); };
  startEl.onclick = (ev) => { if (!ev.target.closest('#st-profile, #resume, #st-go')) requestStart(); };
  $('help').onclick = () => startTutorial(); $('btn-nexus').onclick = () => goNexus(); $('btn-profile').onclick = () => openOverlay('profile'); $('btn-help').onclick = () => openOverlay('help'); $('btn-missions').onclick = () => openOverlay('missions'); $('btn-exam').onclick = () => openOverlay('exam'); $('btn-pile').onclick = () => openOverlay('pile'); $('btn-conn').onclick = () => connectionsHere(); $('btn-guide').onclick = () => { store.setFlag('guide-off', guideOn()); refresh(); if (inNexus) goNexus(); };
  $('btn-map').onclick = () => openOverlay('map'); $('btn-codex').onclick = () => toggleCodex(); $('side-cx').onclick = () => toggleCodex(); $('cx-close').onclick = () => closeCodex();
  $('ov-close').onclick = () => closeOverlay();
  $('debug-due').onclick = () => { store.makeAllDue(); refresh(); };
  $('debug-reset').onclick = () => { store.reset(); refresh(); };
  wirePlaybackBar();
  window.addEventListener('keydown', onKey);
  canvas.addEventListener('click', () => { if (!blocking() && !player.locked && player.enabled) player.lock(); });
  document.addEventListener('pointerlockchange', () => $('hint').classList.toggle('dim', player.locked));
  if (params.has('debug')) document.body.classList.add('debug');
  const last = store.last, start = last && findRoom(last.course, last.room) ? last : { course: 'qm', room: params.has('test') ? 'tunneling-bridge' : 'wave-mechanics-basics' }; // tests rely on the bridge
  // the game opens in the Nexus (the browser tests open a room directly unless ?nexus is given)
  if (params.has('test') && !params.has('nexus')) await loadRoom(start.course, start.room, { silent: true });
  else await loadNexus({ silent: true });
  exposeTestApi();
  if (params.has('test')) { $('start').style.display = 'none'; player.enabled = true; if (params.has('tutorial')) startTutorial(); }
  $('btn-menu').onclick = () => openOverlay('menu');
  // the keyboard-and-mouse layout on a device that has a touch screen: always offer the way back
  if (!touch && !lite && (matchMedia('(pointer: coarse)').matches || (navigator.maxTouchPoints > 0 && innerWidth < 1000))) {
    const bt = $('back-to-touch'); bt.style.display = ''; bt.onclick = () => { setControlsChoice('touch'); reloadWithout('touch', 'controls'); };
  }
  if (lite) { document.body.classList.add('lite'); $('start').style.display = 'none'; player.enabled = true; if (!inNexus) await loadNexus({ silent: true }); setTimeout(() => openOverlay('menu'), 200); }
  else if (touch) {
    touchUI = initTouch({ player, canvas, act: () => { if (promptTarget && !blocking()) interact(promptTarget); }, fullscreen: toggleFullscreen });
    $('btn-map').textContent = 'Map'; $('btn-codex').textContent = 'Formulas'; $('btn-nexus').textContent = 'Nexus'; $('btn-conn').textContent = 'Connections';
    $('pb-replay').textContent = 'Replay';
    setupRotateHint();
  }
  // deep links (notifications): ?open=<exercise id> and/or ?room=<course>/<room>
  const deepOpen = params.get('open'), deepRoom = params.get('room');
  const spec = params.get('suggest');
  if (spec && !params.has('test')) { $('start').style.display = 'none'; player.enabled = true; setTimeout(() => showSuggest(spec), lite ? 450 : 50); }
  else if (params.has('quick') && !params.has('test') && !lite) { $('start').style.display = 'none'; player.enabled = true; startQuick(); }
  else if ((deepOpen || deepRoom) && !params.has('test') && !lite) {
    $('start').style.display = 'none'; player.enabled = true;
    try {
      if (deepRoom) { const [c, r] = deepRoom.split('/'); if (findRoom(c, r)) await loadRoom(c, r, { silent: false }); }
      if (deepOpen && encIndex.has(deepOpen)) await openById(deepOpen);
    } catch (e) { console.warn('deep link failed', e.message); }
  }
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {}); // makes the page installable as an app
  startReady = true; progress(100, ''); $('st-bar').classList.add('done'); $('st-status').textContent = '';
  if (startWanted || window.__want) enterGame();
  // The frame loop must never stop: the next frame is scheduled first, an error in one frame is logged and skipped, and a watchdog restarts the loop if frames stop
  // while the page is visible. While a maximized panel (or a hidden tab) covers the 3D view nothing is drawn, which spares the phone's graphics memory.
  let lastT = performance.now(), loopId = 0, lastFrameAt = performance.now(), frameErrors = 0;
  const covered = () => document.hidden || $('side').classList.contains('max') || $('cx').classList.contains('max');
  const startLoop = () => {
    const id = ++loopId;
    const tick = (now) => {
      if (id !== loopId) return; requestAnimationFrame(tick); lastFrameAt = performance.now();
      try {
        if (testHooks.failFrames > 0) { testHooks.failFrames--; throw new Error('test: frame error'); }
        const dt = Math.max(0, Math.min(0.05, (now - lastT) / 1000)); lastT = now;
        stepRunner(dt, now);
        touchUI?.update({ promptText: promptTarget && !blocking() ? $('prompt').textContent : null, flying: inNexus });
        tickStudy(dt); player.update(dt); world.update(dt); set?.update(dt, player.pos, world.camera); holos?.update(dt, player.pos); if (inNexus) updateNexusCard(); updatePrompt();
        if (!lite && !covered()) world.render(player.camera);
      } catch (e) { lastT = now; if (frameErrors++ < 5) console.error('frame error (skipped)', e); }
    };
    requestAnimationFrame(tick);
  };
  window.__frames = () => loopId;
  setInterval(() => { if (!document.hidden && performance.now() - lastFrameAt > 2500) { console.warn('frame loop restarted'); startLoop(); } }, 2000);
  startLoop();
  // the phone can take back the graphics memory (long exercise, screen off): three.js asks for the context back, and if it does not come back the player can reload
  let glLostAt = 0; const banner = $('gl-banner');
  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); glLostAt = performance.now(); });
  canvas.addEventListener('webglcontextrestored', () => { glLostAt = 0; banner.style.display = 'none'; world.resize(); });
  setInterval(() => { if (glLostAt && !document.hidden && performance.now() - glLostAt > 4000) banner.style.display = ''; }, 1000);
  $('gl-reload').onclick = () => location.reload();
  const releaseTouch = () => touchUI?.reset(); // a finger that vanished (system gesture, screen off) must not leave the stick or the look drag stuck
  document.addEventListener('visibilitychange', () => { releaseTouch(); if (!document.hidden && world.renderer.getContext().isContextLost()) glLostAt = glLostAt || performance.now() - 3000; });
  addEventListener('blur', releaseTouch); addEventListener('pagehide', releaseTouch);
}
const findCourse = (id) => catalog.find((c) => c.id === id);
const findRoom = (cid, rid) => findCourse(cid)?.rooms.find((r) => r.slug === rid);
const blocking = () => !!(current || overlay || tut);

function startPlay() { player.enabled = true; if (offerTour()) return; player.lock(); }
// The tour used to open by itself and block the screen for 5 taps. Now it is a small offer on the first visit of the Nexus and of each room.
function offerTour() {
  const chip = $('tour-chip'); clearTimeout(offerTour.t); chip.style.display = 'none';
  const key = `tutorial:${room.id}`; if (store.flag(key) || params.has('test') || lite || tut) return false;
  const hide = (seen) => { chip.style.display = 'none'; if (seen) store.setFlag(key); };
  $('tour-go').onclick = () => { hide(false); startTutorial(); }; $('tour-x').onclick = () => hide(true);
  chip.style.display = ''; offerTour.t = setTimeout(() => hide(false), 20000); return true;
}

// (rooms below)
// ================================================================ the Nexus (main hub)
const NEXUS_ROOM = {
  id: 'nexus', slug: 'hub', title: 'The Nexus', topics: [], encounters: [], sources: [],
  intro: 'The map of everything you study.',
  tutorial: [
    { title: 'The Nexus: a map of everything', look: { x: 0, z: -40, pitch: 0.1 }, html: '<p>Every <b>galaxy</b> is a course, every <b>star</b> a room. The ring around a star shows your progress (gold = cleared), a <span class="due">red pulse</span> means a respawn is due, a tall <b>light beam</b> marks the room recommended next.</p>' },
    { title: 'Flying', look: { x: -36, z: -8, pitch: 0.05 }, html: '<p><b>W A S D</b> fly in the direction you look, <b>Space</b> up, <b>C</b> down, <b>Shift</b> fast, mouse to look. Fly close to a star to read what is in the room and what it connects to; press <b>E</b> to fly in. <b>N</b> brings you back here from any room, <b>M</b> opens the list.</p>' },
    { title: 'Each galaxy has a living exhibit', look: { x: 36, z: -8, pitch: 0.0 }, html: '<p>In the cores: a <b>ripple tank</b> (two coherent sources interfere, $I\\propto|\\psi_1+\\psi_2|^2$), a <b>crystal with its Fermi sphere</b> ($k_F=(3\\pi^2n)^{1/3}$) and a <b>rotating galaxy</b> with a flat rotation curve ($\\omega=v/r$). They are the core ideas of the three courses.</p>' },
    { title: 'Beams connect the topics', look: { x: 0, z: -26, pitch: 0.12 }, html: '<p>Curved beams with travelling pulses connect topics <i>across</i> courses: tunnelling lets the Sun fuse hydrogen, the Fermi gas of a metal is the white dwarf, phonons are quantised oscillators, the 21 cm line is spin addition. Fly next to a white diamond on a beam to read why. The thin straight lines are the study order inside a course.</p>' },
    { title: 'Where to start', look: { x: -36, z: -8, pitch: 0.05 }, html: '<p><b>Guide mode</b> (button at the top, on by default) shows exactly one next step: follow the <b>gold beam</b> to the next room, and inside a room the pulsing console holds your next task. Learn there, then press <b>N</b> to come back and watch the map fill in. Cross-links are great revision: if you cannot say why a beam exists, revisit both rooms.</p>' },
  ],
};
const NEXUS_COURSE = { id: 'nexus', name: 'The Nexus', region: 'The Nexus', bridge: false, module: null, rooms: [NEXUS_ROOM] };
// ---- guided route: one recommended next step at a time (can be switched off with the Guide button)
const guideOn = () => !store.flag('guide-off');
const GUIDE_SKIP = ['sandbox', 'boss']; // never forced by the guide
function routeDone(r) { const es = r.encounters.filter((e) => !['sandbox', 'boss', 'lab'].includes(e.type)); return !es.length || es.filter(passed).length / es.length >= 0.75; }
function nextRouteStep() {
  for (const item of route) {
    const [c, slug] = item.key.split('/'), r = findRoom(c, slug); if (!r || routeDone(r)) continue;
    const enc = r.encounters.find((e) => !GUIDE_SKIP.includes(e.type) && !store.isSolved(e.id) && !isLocked(e)) || r.encounters.find((e) => e.type !== 'sandbox' && !store.isPassed(e.id) && !isLocked(e));
    return { course: c, slug, room: r, enc, why: item.why, key: item.key };
  }
  return null;
}
const groupOf = (enc) => GROUPS.find((g) => g.types.includes(enc?.type));
function roomKeysDue() { const s = new Set(); for (const id of store.dueReviews()) { const r = encIndex.get(id); if (r) s.add(`${r.course}/${r.roomId}`); } return s; }
function roomsRecommended() {
  const s = new Set();
  if (guideOn()) { const n = nextRouteStep(); if (n) s.add(n.key); return s; }
  for (const c of catalog) { let best = null, bf = 2; for (const r of c.rooms) { const p = roomProgress(r), f = p.total ? p.done / p.total : 1; if (f < 1 && f < bf) { bf = f; best = r; } } if (best) s.add(`${c.id}/${best.slug}`); }
  return s;
}
async function loadNexus({ silent = false } = {}) {
  closePanel(true); closeOverlay(true); closeCodex();
  runner = null; view = { variant: null, sim: null };
  disposeSet();
  inNexus = true; nexusFocusKey = null;
  course = NEXUS_COURSE; room = NEXUS_ROOM; groups = []; bridgeOn = false;
  world.clearTerminals(); world.setMode('hub'); world.setBridgeVisible(false);
  setGlossaryCourse('qm');
  set = buildNexus(world, { catalog, links: linksData, progress: (r) => { const p = roomProgress(r); return p.total ? p.done / p.total : 0; }, dueRooms: roomKeysDue(), recommended: roomsRecommended() });
  $('region').textContent = 'The Nexus'; $('room-title').textContent = 'overview of all topics';
  $('sources').textContent = ''; $('hint').textContent = 'WASD fly · mouse look · Space up · C down · Shift fast · E enter a star · M map · B formulas';
  player.flying = true; player.enabled = player.enabled || params.has('test');
  player.teleport(0, 22, 0, -0.04, 7);
  updateBar(); refresh();
  if (!silent && player.enabled) offerTour();
}
function goNexus() { warpTo(() => loadNexus({ silent: false })); }
function warpTo(fn) {
  const w = $('warp'); w.classList.add('on');
  setTimeout(async () => { await fn(); setTimeout(() => w.classList.remove('on'), 120); }, 280);
}
function updateNexusCard() {
  const f = set?.focus, card = $('nx-card');
  const key = f?.node ? f.node.key : f?.link ? `${f.link.a.key}|${f.link.b.key}` : null;
  if (key === nexusFocusKey) return;
  nexusFocusKey = key;
  if (!key || tut) { card.style.display = 'none'; document.body.classList.remove('nx-card-on'); return; }
  const course = (id) => (NEXUS_STYLE[id]?.name || id).toLowerCase();
  let html = '';
  const tex = (t) => { try { return katex.renderToString(t, { displayMode: true, throwOnError: false, strict: 'ignore' }); } catch { return ''; } };
  if (f.node) {
    const n = f.node, es = n.room.encounters.filter((e) => e.type !== 'sandbox'), done = es.filter((e) => store.isPassed(e.id)).length;
    const nb = set.neighbours(n);
    html = `<h3>${n.room.title}</h3><div class="src">${course(n.course)} · ${done} / ${es.length} done${n.due ? ' · <b class="due">respawn due</b>' : ''}${n.rec ? ' · <b style="color:var(--warn)">recommended next</b>' : ''}</div>
      <p>${(n.room.intro || '').replace(/<[^>]+>/g, '').slice(0, 230)}${(n.room.intro || '').length > 230 ? '…' : ''}</p>
      ${nb.length ? `<h4>Connections (${nb.length})</h4><ul>${nb.slice(0, 5).map(({ other, link }, i) => `<li><button class="link lkopen" data-lkopen="${i}"><b>${link.title}</b> with <i>${other.room.title}</i> (${course(other.course)})</button></li>`).join('')}</ul><button class="chip btn" data-allconn="${n.key}">Open all ${nb.length} in detail</button>` : ''}
      <div class="src">[E] to fly in</div>`;
  } else {
    const l = f.link;
    html = `${linkCardHtml(l, { compact: true })}<div class="src">${l.a.room.title} (${course(l.a.course)}) ↔ ${l.b.room.title} (${course(l.b.course)})</div><div class="src"><b>[E] read the full explanation: equations, dictionary, experiment</b></div>`;
  }
  card.innerHTML = M(html); card.style.display = ''; document.body.classList.add('nx-card-on');
  if (f.node) { const nbs = set.neighbours(f.node); card.querySelectorAll('[data-lkopen]').forEach((b) => (b.onclick = () => openLinkPanel(nbs[+b.dataset.lkopen].link))); card.querySelectorAll('[data-allconn]').forEach((b) => (b.onclick = () => openConnections(b.dataset.allconn))); }
}

// remove the current 3D set piece (nexus, course exhibit) from the scene completely
function disposeSet() {
  if (holos) { holos.dispose(); holos = null; }
  if (!set) return;
  if (set.dispose) set.dispose();
  else { world.scene.remove(set.group); set.group.traverse((o) => { o.geometry?.dispose?.(); const m = o.material; if (m && !Array.isArray(m)) m.dispose?.(); }); }
  set = null;
}
// ================================================================ rooms
async function loadRoom(courseId, roomId, { silent = false } = {}) {
  closePanel(true); closeOverlay(true);
  runner = null; view = { variant: null, sim: null };
  inNexus = false; nexusFocusKey = null; player.flying = false; world.setMode('room'); $('nx-card').style.display = 'none'; document.body.classList.remove('nx-card-on');
  course = findCourse(courseId); room = findRoom(courseId, roomId);
  store.setLast({ course: courseId, room: roomId });
  setGlossaryCourse(courseId);
  // 3D scene: QM bridge or this course's set piece
  disposeSet();
  world.resetEnvironment();
  // QM rooms show the tunnelling bridge only if the room says exhibit: "bridge"; any other room builds its own set piece
  bridgeOn = room.exhibit ? room.exhibit === 'bridge' : course.bridge && !course.module;
  world.setBridgeVisible(bridgeOn);
  if (bridgeOn) world.clearSim();
  else if (course.module) {
    try { modules[course.id] ??= await import(course.module); set = modules[course.id].buildRoom(world, room); }
    catch (err) { console.warn(`no 3D set piece for ${room.id}: ${err.message}`); set = null; }
  }
  try { holos = buildLabHolos(world, room); } catch (err) { console.warn('lab holograms failed', err.message); holos = null; }
  // consoles: one per group present in this room
  world.clearTerminals();
  groups = GROUPS.map((g) => ({ ...g, id: `${room.id}:${g.key}`, items: room.encounters.filter((e) => g.types.includes(e.type)) })).filter((g) => g.items.length);
  const n = groups.length;
  groups.forEach((g, i) => { g.terminal = world.addTerminal(g, (i - (n - 1) / 2) * 2.1, g.label); });
  $('region').textContent = course.region; $('room-title').textContent = room.title;
  $('sources').innerHTML = 'Sources: ' + (room.sources || []).map((s) => `${s.file.split('/').pop()} (${s.where})`).join('; ');
  if (codexOpen) buildCodex();
  $('hint').textContent = bridgeOn ? 'WASD move · E interact · Q quick session · M map · B formulas · Esc frees mouse / closes · Space pause, R replay, O loop, [ ] speed, L labels' : 'WASD move · E interact · Q quick session · M map · B formulas · Esc frees mouse / closes';
  const ci = course.rooms.indexOf(room), nextRoom = course.rooms[ci + 1];
  world.setDoorSign(['MAP / NEXT ROOM', nextRoom ? nextRoom.title : 'last room of this region']);
  updateBar(); refresh();
  if (silent) player.pos.y = 1.7;
  if (!silent) { player.teleport(0, 8.0, 0, 0); if (player.enabled) offerTour(); }
}

// ================================================================ state shown in the world and HUD
const isLocked = (enc) => !!enc.requires && !store.isPassed(enc.requires);
const passed = (enc) => store.isPassed(enc.id);
const roomProgress = (r) => { const es = r.encounters.filter((e) => e.type !== 'sandbox'); return { done: es.filter((e) => store.isPassed(e.id)).length, total: es.length }; };
function refresh() {
  $('xp').textContent = `XP ${store.xp}`;
  const due = store.dueReviews();
  $('reviews').textContent = `Respawns due: ${due.length}`;
  $('reviews').classList.toggle('review', due.length > 0);
  world.setPortalDue(due.length);
  dueTarget = due.find((id) => encIndex.has(id)) || null;
  for (const g of groups) {
    const es = g.items.filter((e) => e.type !== 'sandbox'), done = es.filter(passed).length;
    const hasReview = g.items.some((e) => store.hasReview(e.id));
    const status = hasReview ? 'review' : es.length && done === es.length ? 'done' : 'new';
    world.setTerminalStatus(g.terminal, status, false, es.length ? `${done} / ${es.length} done${hasReview ? ', respawn due' : ''}` : 'open');
  }
  const cleared = room.encounters.filter((e) => e.type !== 'sandbox').every(passed);
  world.setDoorOpen(cleared || room.encounters.some((e) => e.unlocks && passed(e)));
  const next = room.encounters.find((e) => e.type !== 'sandbox' && !store.isSolved(e.id) && !isLocked(e));
  const gs = guideOn() ? nextRouteStep() : null;
  updateProfileChip(); updatePileChip();
  $('btn-guide').textContent = `Guide: ${guideOn() ? 'on' : 'off'}`;
  { const s = missionStatus(), sk = streakNow(); $('btn-missions').textContent = `Missions ${s.done}/${s.total} · streak ${sk.count}`; $('btn-missions').classList.toggle('review', s.done < s.total); }
  for (const g of groups) g.terminal.guide = !!(gs && gs.slug === room.slug && gs.course === course.id && gs.enc && g.items.includes(gs.enc));
  $('objective').textContent = dueTarget ? 'A respawn is due: step into the review portal (west end).'
    : gs ? (gs.slug === room.slug && gs.course === course.id && gs.enc ? `Guide: ${groupOf(gs.enc)?.label} console (pulsing) → ${gs.enc.title}` : `Guide: next room is "${gs.room.title}": ${gs.why}. Press N for the Nexus and follow the gold beam, or M.`)
    : next ? `Next: ${next.title}` : 'Room cleared. Walk to the east door (or press M) to travel to the next room.';
  const p = roomProgress(room); $('room-progress').textContent = `${p.done} / ${p.total}`;
  if (inNexus && guideOn() && nextRouteStep()) { /* objective set below */ }
  if (inNexus) { const all = catalog.flatMap((c) => c.rooms), t = all.reduce((s, r) => s + roomProgress(r).total, 0), d = all.reduce((s, r) => s + roomProgress(r).done, 0); $('room-progress').textContent = `${d} / ${t} overall`; const gs2 = guideOn() ? nextRouteStep() : null; $('objective').textContent = dueTarget ? 'A respawn is due (red pulse). [E] on a star flies in.' : gs2 ? `Guide: fly to the gold beam: "${gs2.room.title}": ${gs2.why}. [E] flies in.` : 'Fly through the Nexus: every star is a room, beams connect the topics. [E] on a star enters it.'; }
}

// ================================================================ connections (what exactly is connected)
const LEVELS = { 'same-equation': 'same equation', analogy: 'analogy', application: 'application', prerequisite: 'prerequisite' };
const courseName = (id) => (NEXUS_STYLE[id]?.name || id).toLowerCase();
function linkCardHtml(link, { compact = false } = {}) {
  const d = link.data || link, A = link.a, B = link.b, an = A?.room?.title ?? '', bn = B?.room?.title ?? '';
  const tex = (t) => { try { return katex.renderToString(t, { displayMode: true, throwOnError: false, strict: 'ignore' }); } catch { return ''; } };
  if (compact || !d.sideA) return `<h3>${d.title || link.title}</h3>${link.tex || d.tex ? tex(link.tex || d.tex) : ''}<p>${d.intuition || d.why || link.why || ''}</p>`;
  const plain = d.plain ? `<div class="lk-plain"><div class="lk-plain-h">In plain words</div><p>${d.plain.story}</p>${d.plain.example ? `<p><b>A concrete picture.</b> ${d.plain.example}</p>` : ''}${d.plain.remember ? `<p class="lk-rem"><b>Remember:</b> ${d.plain.remember}</p>` : ''}</div>` : '';
  const side = (s, name) => `<div class="lk-side"><div class="lk-ctx"><b>${name}</b><br>${s.context || ''}</div>${s.tex ? tex(s.tex) : ''}</div>`;
  return `<h3>${d.title} <span class="tag">${LEVELS[d.level] || d.level || 'connection'}</span></h3>${plain}<details class="lk-tech"${d.plain ? '' : ' open'}><summary>${d.plain ? 'The equations side by side, when it holds, what you can measure' : 'Details'}</summary>
    <div class="lk-sides">${side(d.sideA, an)}<div class="lk-arrow">↔</div>${side(d.sideB, bn)}</div>
    ${d.map?.length ? `<table class="lk-map"><tr><th>${an}</th><th>${bn}</th></tr>${d.map.map(([x, y]) => `<tr><td>${x}</td><td>${y}</td></tr>`).join('')}</table>` : ''}
    ${d.regime ? `<p><b>When it holds.</b> ${d.regime}</p>` : ''}${d.experiment ? `<p><b>What you can see or measure.</b> ${d.experiment}</p>` : ''}${d.intuition ? `<p><b>The picture.</b> ${d.intuition}</p>` : ''}${d.exam ? `<p class="src"><b>In exams:</b> ${d.exam}</p>` : ''}</details>`;
}
function linkKey(l) { return `${l.a.key}|${l.b.key}`; }
function openLinkPanel(link) {
  store.setVal('stats', { ...(store.val('stats', {}) || {}), links: ((store.val('stats', {}) || {}).links || 0) + 1 }); runAchievements();
  closePanel(true); current = { link }; player.unlock(); $('side').classList.remove('hidden');
  $('panel').innerHTML = M(`${linkCardHtml(link)}<div class="row"><button class="go" data-go="${link.a.key}">Fly to ${link.a.room.title}</button><button class="go" data-go="${link.b.key}">Fly to ${link.b.room.title}</button></div>`);
  $('panel').querySelectorAll('[data-go]').forEach((b) => (b.onclick = () => { const [c, s] = b.dataset.go.split('/'); closePanel(true); warpTo(() => loadRoom(c, s, { silent: false })); }));
}
// the Connections panel of a room: every link touching this room, each as a full card
// Connections between topics. key = a room ('course/slug'): its connections; key = null: every connection of all topics (the Nexus overview).
const linkItem = (l) => { const [ac, as] = l.a.split('/'), [bc, bs] = l.b.split('/'), ra = findRoom(ac, as), rb = findRoom(bc, bs); return ra && rb ? { ...l, a: { key: l.a, course: ac, room: ra }, b: { key: l.b, course: bc, room: rb }, data: l } : null; };
function openConnections(key = null) {
  const here = key, items = linksData.filter((l) => !here || l.a === here || l.b === here).map(linkItem).filter(Boolean), lazy = !here && items.length > 6; // many cards: typeset a card when it is opened
  const title = here ? findRoom(...here.split('/'))?.title : null;
  closePanel(true); current = { connections: true }; player.unlock(); $('side').classList.remove('hidden');
  const sum = (l) => { const other = here ? (l.a.key === here ? l.b : l.a) : null; return here ? `<b>${l.title}</b> \u2194 ${other.room.title} <span class="src">(${courseName(other.course)})</span>` : `<b>${l.title}</b> <span class="src">${l.a.room.title} (${courseName(l.a.course)}) \u2194 ${l.b.room.title} (${courseName(l.b.course)})</span>`; };
  const go = (l) => (here ? `<button class="link" data-go="${(l.a.key === here ? l.b : l.a).key}">fly to ${(l.a.key === here ? l.b : l.a).room.title}</button>` : `<button class="link" data-go="${l.a.key}">fly to ${l.a.room.title}</button> <button class="link" data-go="${l.b.key}">fly to ${l.b.room.title}</button>`);
  $('panel').innerHTML = M(`<h2>${here ? `Connections of "${title}"` : 'All connections'}</h2><p class="src">${items.length} link${items.length === 1 ? '' : 's'} ${here ? 'to other topics' : 'between the topics of the three courses'}. Open one to see exactly which equations correspond, in which situation, and what it means for experiments and intuition.</p>` +
    (items.length ? items.map((l, i) => `<details class="deriv-d" data-lk="${i}" ${!lazy && i === 0 ? 'open' : ''}><summary>${sum(l)}</summary><div class="lk-body">${lazy ? '' : linkCardHtml(l)}</div>${go(l)}</details>`).join('') : '<p>No connections defined for this room yet.</p>'));
  if (lazy) $('panel').querySelectorAll('details[data-lk]').forEach((d) => d.addEventListener('toggle', () => { const body = d.querySelector('.lk-body'); if (d.open && !body.innerHTML) body.innerHTML = M(linkCardHtml(items[+d.dataset.lk])); }));
  $('panel').querySelectorAll('[data-go]').forEach((b) => (b.onclick = () => { const [c, s] = b.dataset.go.split('/'); closePanel(true); warpTo(() => loadRoom(c, s, { silent: false })); }));
}
// the connections the player is looking at: the room they are in, the star they face in the Nexus, or all of them
const connectionsHere = () => openConnections(inNexus ? set?.focus?.node?.key ?? null : `${course.id}/${room.slug}`);
// ================================================================ profile, settings, achievements, study time
function applySettings() {
  const s = { sens: 1, quality: 'high', sound: false, haptics: true, goal: 'normal', ...(store.val('settings', {}) || {}) };
  configureFeedback({ sound: !!s.sound, haptics: s.haptics !== false });
  player.sens = s.sens; world.renderer.setPixelRatio(s.quality === 'low' ? 1 : Math.min(window.devicePixelRatio || 1, 2));
}
function updateProfileChip() {
  const el = $('btn-profile'); if (!el) return; const ok = sync.available && /saved/.test(sync.status);
  el.textContent = `${store.profile} · ${sync.available ? (ok ? 'saved' : sync.status) : 'browser only'}`;
  el.classList.toggle('review', !sync.available || /error/.test(sync.status)); el.title = `Profile "${store.profile}": ${sync.status}`;
}
const studyToday = () => store.activeSecondsOn(todayStr());
// Active study time = time spent working on exercises, not time with the game open: an exercise is open (lesson, quiz, experiment, derivation, fight,
// station, boss, a mission quiz), or the exam hall, or a practice tab (drills, mixed practice, Feynman, calibration), AND you used the screen or keyboard
// in the last 5 minutes (20 for derivations, bosses and the exam hall: they are done on paper). Menus, maps, lists, formulas and reading connections do not count.
let studyAcc = 0, lastInput = performance.now();
const IDLE_MS = params.has('test') && params.get('idle') ? +params.get('idle') : 5 * 60e3, IDLE_PAPER_MS = params.has('test') && params.get('idle') ? +params.get('idle') : 20 * 60e3;
for (const ev of ['pointerdown', 'pointermove', 'keydown', 'wheel', 'touchstart', 'input']) addEventListener(ev, () => { lastInput = performance.now(); }, { capture: true, passive: true });
function activelyStudying() {
  if (document.hidden) return false;
  const paper = (current?.enc && ['derive', 'boss'].includes(current.enc.type)) || overlay === 'exam';
  if (performance.now() - lastInput > (paper ? IDLE_PAPER_MS : IDLE_MS)) return false;
  return !!current?.enc || overlay === 'exam' || (overlay === 'pile' && ['drills', 'mix', 'feynman', 'calib'].includes(studyTab));
}
let lastStudyAt = performance.now();
function tickStudy() { // real elapsed time, not the frame step: a slow frame rate must not shorten the count
  const now = performance.now(), dt = Math.min(2, (now - lastStudyAt) / 1000); lastStudyAt = now;
  if (!activelyStudying()) return;
  studyAcc += dt; if (studyAcc >= 15) { store.addActive(Math.round(studyAcc)); studyAcc = 0; checkGoal(); }
}
function runAchievements() {
  const have = { ...(store.val('ach', {}) || {}) }, ctx = achContext({ catalog, isPassed: isPassedEnc, store, level: levelOf(store.xp).lv, streak: store.streak.count });
  const fresh = unlockedNow(ctx, have); if (!fresh.length) return;
  for (const a of fresh) have[a.id] = todayStr(); store.setVal('ach', have);
  toast(`<b>Achievement unlocked:</b> ${fresh.map((a) => a.title).join(', ')}<br><span class="src">${fresh.map((a) => a.desc).join(' ')}</span>`);
}
window.addEventListener('encounter-done', () => setTimeout(runAchievements, 600));
const fmtMin = (s) => `${Math.floor(s / 3600) ? Math.floor(s / 3600) + ' h ' : ''}${Math.round((s % 3600) / 60)} min`;
function profileHtml() {
  const have = store.val('ach', {}) || {}, st = { sens: 1, quality: 'high', sound: false, haptics: true, goal: 'normal', ...(store.val('settings', {}) || {}) }, week = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return [todayStr(d), store.activeSecondsOn(todayStr(d))]; }), mx = Math.max(600, ...week.map((w) => w[1]));
  return `<div class="msn-head"><div><b>Profile: ${store.profile}</b><div class="src">${sync.available ? `Saved as <code>profiles/${store.profile}.json</code> next to the game (${sync.status}).` : 'No save server found: progress is kept in this browser only. Start the game with <code>python3 serve.py</code> to save it to a file.'}</div></div>
    <div><b>Time on exercises</b><div class="src">today ${fmtMin(studyToday())}; total ${fmtMin(store.activeTotal())}</div><div class="spark">${week.map(([d, s]) => `<i title="${d}: ${fmtMin(s)}" style="height:${Math.max(3, Math.round(34 * s / mx))}px"></i>`).join('')}</div></div>
    <div><b>Settings</b><label class="labrow">mouse sensitivity <input type="range" id="set-sens" min="0.3" max="2.5" step="0.1" value="${st.sens}"></label><label class="labrow">graphics <select id="set-q"><option value="high" ${st.quality === 'high' ? 'selected' : ''}>high quality</option><option value="low" ${st.quality === 'low' ? 'selected' : ''}>fast (lower resolution)</option></select></label>
      <label class="labrow">daily study goal <select id="set-goal">${Object.entries(GOALS).map(([k, v]) => `<option value="${k}" ${st.goal === k ? 'selected' : ''}>${k} (${v} min or ${GOAL_EXERCISES[k]} exercises)</option>`).join('')}</select></label>
      <label class="labrow"><span><input type="checkbox" id="set-sound" ${st.sound ? 'checked' : ''}> sounds for right answers</span></label>
      <label class="labrow"><span><input type="checkbox" id="set-haptics" ${st.haptics !== false ? 'checked' : ''}> vibration</span></label>
      <label class="labrow">theme <select id="set-theme">${[['dark', 'dark'], ['light', 'light (white room)'], ['auto', 'like the phone']].map(([v, t]) => `<option value="${v}" ${themeChoice() === v ? 'selected' : ''}>${t}</option>`).join('')}</select></label>
      <label class="labrow">controls <select id="set-ctl">${[['auto', 'automatic'], ['touch', 'touch (stick, drag to look)'], ['desktop', 'keyboard and mouse']].map(([v, t]) => `<option value="${v}" ${controlsChoice() === v ? 'selected' : ''}>${t}</option>`).join('')}</select></label></div></div>
    <h3>Profiles</h3><div class="row" id="prof-list"><span class="src">loading…</span></div>
    <div class="row"><input type="text" id="prof-new" placeholder="new profile name (letters, digits, - _)" maxlength="40"><button class="go" id="prof-create">Create and switch</button><button class="link" id="exp2">export progress file</button><label class="link">import <input id="imp2" type="file" accept="application/json" style="display:none"></label></div>
    <h3>Achievements (${Object.keys(have).length} / ${ACH.length})</h3><div class="achgrid">${ACH.map((a) => `<div class="ach${have[a.id] ? ' got' : ''}"><b>${a.title}</b><span class="src">${a.desc}${have[a.id] ? ` · ${have[a.id]}` : ''}</span></div>`).join('')}</div>`;
}
async function wireProfile() {
  const sens = $('set-sens'), q = $('set-q');
  const save = () => { store.setVal('settings', { ...(store.val('settings', {}) || {}), sens: +sens.value, quality: q.value, goal: $('set-goal').value, sound: $('set-sound').checked, haptics: $('set-haptics').checked }); applySettings(); refresh(); };
  sens.oninput = save; q.onchange = save; $('set-goal').onchange = save; $('set-sound').onchange = () => { save(); if ($('set-sound').checked) sfx.right(); }; $('set-haptics').onchange = () => { save(); if ($('set-haptics').checked) sfx.wrong(); };
  $('set-theme').onchange = (e) => { setThemeChoice(e.target.value); reloadWithout(); };
  $('set-ctl').onchange = (e) => { setControlsChoice(e.target.value); reloadWithout('touch'); };
  const ex = $('exp2'); ex.onclick = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([store.exportJson()], { type: 'application/json' })); a.download = `physics-rpg-${store.profile}.json`; a.click(); };
  const im = $('imp2'); im.onchange = async () => { const f = im.files[0]; if (f && store.importJson(await f.text())) { await pushNow(); refresh(); closeOverlay(); toast('Progress imported.'); } else alert('Not a valid progress file.'); };
  $('prof-create').onclick = () => { const n = $('prof-new').value.trim(); if (/^[A-Za-z0-9_-]{1,40}$/.test(n)) switchProfile(n); else alert('Use letters, digits, - and _ (max 40).'); };
  const list = await listProfiles(), names = new Set([store.profile, ...list.map((p) => p.name)]);
  const host = $('prof-list'); if (!host) return;
  host.innerHTML = [...names].map((n) => { const p = list.find((x) => x.name === n); return `<button class="chip btn${n === store.profile ? ' cur' : ''}" data-prof="${n}">${n}${p ? ` · ${p.xp} XP` : ''}</button>`; }).join('') || '<span class="src">no saved profiles yet</span>';
  host.querySelectorAll('[data-prof]').forEach((b) => (b.onclick = () => { if (b.dataset.prof !== store.profile) switchProfile(b.dataset.prof); }));
}
function helpHtml() {
  const t = touch ? `<h3>On the phone</h3><p><b>Left stick</b> walks (in the Nexus it flies where you look; the ▲ ▼ » buttons fly up, down and fast). <b>Drag</b> anywhere on the 3D view to look. The big <b>button at the bottom right</b> does what <b>E</b> does: it appears when you stand at a console, a star or an experiment.</p>
    <p><b>Menu</b> at the top has missions, study hub, exam hall and more. <b>Formulas</b> opens the formula drawer; with an exercise open too, both show side by side (phone held sideways) or one above the other (upright). The <b>⤢</b> button of a panel makes it fill the screen, tap it again to go back. Add the page to your home screen for full screen.</p>` : '';
  return `<div class="cols"><div>${t}<h3>Moving</h3><p><b>W A S D</b> walk (in the Nexus: fly; <b>Space</b> up, <b>C</b> down, <b>Shift</b> faster). Mouse looks around; with a panel open drag with the mouse. <b>E</b> interacts with the console or star you face. <b>Esc</b> frees the mouse or closes a panel.</p>
    <h3>Keys</h3><p><b>Q</b> quick session · <b>N</b> Nexus · <b>M</b> map and route · <b>T</b> daily missions · <b>X</b> exam hall · <b>V</b> my pile (exercises you keep) · <b>B</b> formulas · <b>K</b> connections of this room · <b>P</b> profile · <b>F1</b> this help · <b>L</b> labels · QM bridge: <b>Space</b> pause, <b>R</b> replay, <b>O</b> loop, <b>[ ]</b> speed.</p></div>
    <div><h3>The consoles of a room</h3><p><b>Library</b>: theory and intuition. <b>Experiments</b>: interactive simulations, change things and see what happens. <b>Quiz hall</b>: exam-style multiple choice. <b>Derivation desk</b>: show-that problems on paper. <b>Stations</b>: predict, watch, explain. <b>Fights</b>: calculations; afterwards a "What if?" explorer opens. <b>Boss gate</b>: a real old-exam problem on paper.</p>
    <h3>How to use it</h3><p>Follow the <b>Guide</b>. Do the daily missions (T): they mix question types like the exam. Wrong answers come back as <b>respawns</b> after 1, 3, 7, 16 days. Your progress is saved in your <b>profile</b> (P).</p></div></div>`;
}
// ================================================================ "look later again" pile (bookmarks, never timed)
const pile = () => store.val('pile', {}) || {};
const inPile = (id) => !!pile()[id];
function togglePile(id) {
  const p = { ...pile() }; if (p[id]) delete p[id]; else p[id] = { at: Date.now(), seen: Date.now() }; store.setVal('pile', p); updatePileChip(); return !!p[id];
}
function updatePileChip() { const el = $('btn-pile'); if (el) el.textContent = `Study (V) · pile ${Object.keys(pile()).length}`; }
let pileQueue = [];
function pileBar(enc) {
  const bar = document.createElement('div'); bar.className = 'pilebar';
  const render = () => {
    const on = inPile(enc.id), qi = pileQueue.indexOf(enc.id), p = pile()[enc.id];
    bar.innerHTML = `<button class="chip btn pilebtn${on ? ' on' : ''}" title="Keep this exercise in your personal pile, to look at again whenever you want (V opens the pile)">${on ? '★ In my pile' : '☆ Keep for later'}</button>${on ? `<input class="pilenote" maxlength="140" placeholder="why keep it? (optional note)" value="${(p.note || '').replace(/"/g, '&quot;')}">` : ''}${qi >= 0 ? `<span class="src">${queueLabel} ${qi + 1} / ${pileQueue.length}</span> ${qi + 1 < pileQueue.length ? '<button class="go pilenext">Next →</button>' : '<span class="src">last one</span>'}` : ''}`;
    bar.querySelector('.pilebtn').onclick = () => { togglePile(enc.id); render(); };
    const note = bar.querySelector('.pilenote'); if (note) { note.onkeydown = (e) => e.stopPropagation(); note.onchange = () => { const q = { ...pile() }; if (q[enc.id]) { q[enc.id] = { ...q[enc.id], note: note.value }; store.setVal('pile', q); } }; }
    const nx = bar.querySelector('.pilenext'); if (nx) nx.onclick = () => openFromPile(pileQueue[qi + 1], true);
  };
  render(); return bar;
}
function openFromPile(id, keepQueue) {
  const p = { ...pile() }; if (p[id]) { p[id] = { ...p[id], seen: Date.now() }; store.setVal('pile', p); }
  if (!keepQueue) pileQueue = [];
  closeOverlay(true); openById(id); player.enabled = true;
}
function pileHtml() {
  const p = pile(), rows = Object.entries(p).map(([id, v]) => ({ id, v, ref: encIndex.get(id) })).filter((x) => x.ref);
  rows.sort((a, b) => a.v.seen - b.v.seen);
  const days = (t) => Math.floor((Date.now() - t) / 86400000), ago = (t) => (days(t) <= 0 ? 'today' : `${days(t)} d ago`);
  if (!rows.length) return '<p>Your pile is empty. Open any exercise and press <b>☆ Keep for later</b> at the top of its panel. Exercises you keep stay here for good: no timer, no schedule. Look at them whenever you want (also in two months).</p>';
  const byCourse = catalog.map((c) => ({ c, items: rows.filter((r) => r.ref.course === c.id) })).filter((g) => g.items.length);
  return `<p class="src">${rows.length} exercise${rows.length > 1 ? 's' : ''} kept. Sorted by the one you looked at longest ago. Nothing here is timed.</p>
    <div class="row"><button class="go" id="pile-all">Review all in order</button>${byCourse.map((g) => `<button class="chip btn" data-pilec="${g.c.id}">only ${g.c.region} (${g.items.length})</button>`).join('')}</div>
    ${byCourse.map((g) => `<h3>${g.c.region}</h3><div class="maplist">${g.items.map((r) => `<div class="maprow pilerow"><button class="link" data-pileopen="${r.id}"><span class="mt">${r.ref.enc.title || r.id}</span></button><span class="mp">${r.ref.enc.type}</span><span class="md">${findRoom(r.ref.course, r.ref.roomId)?.title || ''} · kept ${ago(r.v.at)} · last looked ${ago(r.v.seen)}${r.v.note ? ` · <i>${r.v.note.replace(/</g, '&lt;')}</i>` : ''} <button class="link" data-pilerm="${r.id}">remove</button></span></div>`).join('')}</div>`).join('')}`;
}
function wirePile() {
  const ids = (cid) => Object.entries(pile()).map(([id, v]) => ({ id, v, ref: encIndex.get(id) })).filter((x) => x.ref && (!cid || x.ref.course === cid)).sort((a, b) => a.v.seen - b.v.seen).map((x) => x.id);
  const start = (cid) => { queueLabel = 'pile'; pileQueue = ids(cid); if (pileQueue.length) openFromPile(pileQueue[0], true); };
  const all = $('pile-all'); if (all) all.onclick = () => start();
  document.querySelectorAll('[data-pilec]').forEach((b) => (b.onclick = () => start(b.dataset.pilec)));
  document.querySelectorAll('[data-pileopen]').forEach((b) => (b.onclick = () => openFromPile(b.dataset.pileopen)));
  document.querySelectorAll('[data-pilerm]').forEach((b) => (b.onclick = () => { togglePile(b.dataset.pilerm); renderStudy('pile'); }));
}
// ---- Study hub: tabs for the pile, session planner, mistakes, weak spots and Feynman mode
let studyTab = 'today';
const TABS = [['today', 'Today'], ['week', 'This week'], ['plan', 'Session planner'], ['drills', 'Drills'], ['mix', 'Mixed practice'], ['pile', 'My pile'], ['mistakes', 'Mistakes'], ['weak', 'Weak spots'], ['radar', 'Exam radar'], ['feynman', 'Feynman'], ['calib', 'Calibration']];
function renderStudy(tab) {
  studyTab = tab || studyTab; const body = $('ov-body');
  const open = mistakes().filter((x) => x.open).length;
  body.innerHTML = `<div class="row studytabs">${TABS.map(([k, l]) => `<button class="chip btn${k === studyTab ? ' cur' : ''}" data-stab="${k}">${l}${k === 'mistakes' && open ? ` (${open})` : ''}</button>`).join('')}</div><div id="study-body"></div>`;
  body.querySelectorAll('[data-stab]').forEach((b) => (b.onclick = () => renderStudy(b.dataset.stab)));
  const host = $('study-body');
  if (studyTab === 'today') { host.innerHTML = M(todayHtml()); wireToday(host); }
  else if (studyTab === 'week') { host.innerHTML = weekHtml(); $('week-quick').onclick = () => startQuick(); $('week-plan').onclick = () => renderStudy('plan'); }
  else if (studyTab === 'pile') { host.innerHTML = pileHtml(); wirePile(); }
  else if (studyTab === 'mistakes') { host.innerHTML = M(mistakesHtml()); wireMistakes(host); }
  else if (studyTab === 'weak') { host.innerHTML = M(weakHtml()); wireGoto(host); }
  else if (studyTab === 'feynman') { renderFeynman(host); }
  else if (['drills', 'mix', 'radar', 'calib'].includes(studyTab)) renderDrillTab(studyTab, host, { catalog, findRoom, roomProgress, refresh, goto: (k) => { const [c, r] = k.split('/'); closeOverlay(true); loadRoom(c, r, { silent: false }); player.enabled = true; } });
  else renderPlan(host);
}
const ago = (t) => { const d = Math.floor((Date.now() - t) / 86400000); return d <= 0 ? 'today' : `${d} d ago`; };
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
function wireGoto(host) { host.querySelectorAll('[data-goto]').forEach((b) => (b.onclick = () => { const [c, r] = b.dataset.goto.split('/'); closeOverlay(true); loadRoom(c, r, { silent: false }); player.enabled = true; })); host.querySelectorAll('[data-open]').forEach((b) => (b.onclick = () => { closeOverlay(true); openById(b.dataset.open); player.enabled = true; })); }
function mistakesHtml() {
  const all = [...mistakes()].reverse(), open = all.filter((x) => x.open), done = all.filter((x) => !x.open).slice(0, 5);
  if (!all.length) return '<p>No mistakes logged yet. Wrong numeric answers in fights, bosses and the exam hall are collected here with the likely slip. Review them, write down in one line what you do differently, and mark them as understood. That is the habit.</p>';
  const card = (x) => { const ref = encIndex.get(x.encId); return `<div class="mcard${x.open ? '' : ' fixed'}"><div class="src">${ref ? findRoom(ref.course, ref.roomId)?.title : ''} · ${ago(x.t)}</div><div>${x.prompt}</div><div>You wrote <b>${esc(x.given)}</b>, expected <b>${esc(x.expected)}</b>.${x.diag ? ` <span class="diag">Likely slip: ${x.diag}</span>` : ''}</div><div class="row"><input class="mnote" data-mn="${x.id}" maxlength="160" placeholder="what will I do differently?" value="${esc(x.note)}"><button class="go" data-mfix="${x.id}">${x.open ? 'Understood' : 'Reopen'}</button>${ref ? `<button class="link" data-open="${x.encId}">retry the exercise</button>` : ''}</div></div>`; };
  return `<p class="src">${open.length} open. Write a one-line correction for each and mark it understood.</p>${open.map(card).join('') || '<p class="msg good">All mistakes understood.</p>'}${done.length ? `<h3>Recently understood</h3>${done.map(card).join('')}` : ''}`;
}
function wireMistakes(host) {
  host.querySelectorAll('[data-mn]').forEach((i) => { i.onkeydown = (e) => e.stopPropagation(); i.onchange = () => updateMistake(i.dataset.mn, { note: i.value }); });
  host.querySelectorAll('[data-mfix]').forEach((b) => (b.onclick = () => { const id = b.dataset.mfix, cur = mistakes().find((x) => x.id === id); const note = host.querySelector(`[data-mn="${id}"]`).value; updateMistake(id, { open: !cur.open, note }); renderStudy('mistakes'); }));
  wireGoto(host);
}
function weakHtml() {
  const ws = weakSpots(encIndex);
  if (!ws.length) return '<p>Nothing weak yet: no open mistakes, failed exercises or weak exam parts. Take a mock exam (X) to find the gaps.</p>';
  return `<p class="src">The rooms where you lose the most: open mistakes, failed exercises (respawns) and weak parts of recent mock exams.</p><div class="maplist">${ws.map((w) => { const [c, s] = w.key.split('/'), r = findRoom(c, s); return r ? `<button class="maprow" data-goto="${w.key}"><span class="mt">${r.title}</span><span class="mp">${Object.entries(w.why).map(([k, v]) => `${v} ${k}`).join(', ')}</span><span class="md">${findCourse(c).region}</span></button>` : ''; }).join('')}</div>`;
}
function renderFeynman(host) {
  const hist = store.val('feynman', {}) || {}, cs = catalog.map((c) => c.id);
  const pool = [...encIndex.values()].filter((r) => r.enc.type === 'derive' && r.enc.keyPoints?.length && r.enc.goal);
  const pick = (cid) => pool.filter((r) => !cid || r.course === cid).sort((a, b) => (hist[a.enc.id] || 0) - (hist[b.enc.id] || 0) || Math.random() - 0.5)[0];
  const show = (cid) => {
    const r = pick(cid); if (!r) { host.innerHTML = '<p>No suitable topics.</p>'; return; }
    const e = r.enc;
    host.innerHTML = M(`<p class="src">Feynman method: explain it in your own words as if to a friend who missed the lecture. Writing it yourself shows what you really understand.</p>
      <div class="row">${catalog.map((c) => `<button class="chip btn${c.id === cid ? ' cur' : ''}" data-fc="${c.id}">${c.region}</button>`).join('')}<button class="chip btn${cid ? '' : ' cur'}" data-fc="">any course</button></div>
      <h3>${e.title}</h3><p><b>Explain:</b> ${e.goal}</p><p class="src">${findRoom(r.course, r.roomId)?.title}. Three to six sentences, no formulas needed unless they help. What is the idea, why is it true, where is it used?</p>
      <textarea id="fy-text" rows="6" style="width:100%" placeholder="Your explanation..."></textarea>
      <div class="row"><button class="go" id="fy-cmp">Compare with the key points</button><button class="link" id="fy-skip">another topic</button></div><div id="fy-res"></div>`);
    const ta = host.querySelector('#fy-text'); ta.onkeydown = (ev) => ev.stopPropagation();
    host.querySelectorAll('[data-fc]').forEach((b) => (b.onclick = () => show(b.dataset.fc || null)));
    host.querySelector('#fy-skip').onclick = () => { hist[e.id] = Date.now(); store.setVal('feynman', hist); show(cid); };
    host.querySelector('#fy-cmp').onclick = () => {
      if (ta.value.trim().length < 40) { host.querySelector('#fy-res').innerHTML = '<p class="msg bad">Write a few sentences first (at least a line or two). That is the exercise.</p>'; return; }
      host.querySelector('#fy-res').innerHTML = M(`<h4>Tick every key point your explanation really contains</h4><ul class="key" style="list-style:none;padding:0">${e.keyPoints.map((k) => `<li><label><input type="checkbox" class="fyk"> ${k}</label></li>`).join('')}</ul><button class="go" id="fy-save">Save (+10 XP)</button><div id="fy-out"></div>`);
      host.querySelector('#fy-save').onclick = () => {
        const got = [...host.querySelectorAll('.fyk')].filter((c) => c.checked).length, n = e.keyPoints.length;
        hist[e.id] = Date.now(); store.setVal('feynman', hist); const log = store.val('feynman-log', []) || []; store.setVal('feynman-log', [...log, { t: Date.now(), id: e.id, got, n, text: ta.value.slice(0, 1200) }].slice(-100));
        store.addXp(10); refresh(); host.querySelector('#fy-save').disabled = true;
        host.querySelector('#fy-out').innerHTML = M(`<p class="msg ${got >= n * 0.7 ? 'good' : 'bad'}">${got} of ${n} key points. ${got >= n * 0.7 ? 'You can explain this.' : 'The missing points are exactly what to revisit: open the derivation again.'}</p><div class="row"><button class="go" id="fy-next">Next topic</button><button class="link" data-open="${e.id}">open the exercise</button></div>`);
        host.querySelector('#fy-next').onclick = () => show(cid); wireGoto(host);
      };
    };
  };
  show(null);
}
// session planner: builds a study session from what is due, what went wrong and what is weak
const EST = { lesson: 10, quiz: 8, derive: 15, calc: 15, lab: 12, 'predict-observe': 10, boss: 30, sandbox: 5 };
const typeName = { lesson: 'Lesson', quiz: 'Quiz', derive: 'Derivation', calc: 'Calculation fight', lab: 'Experiment', 'predict-observe': 'Station', boss: 'Exam problem' };
// new material in route order for one course: the next unfinished exercises of the first room that is not done
function newMaterial(courseId, budget, skip) {
  const out = []; let left = budget;
  for (const item of route) {
    const [c, slug] = item.key.split('/'); if (c !== courseId) continue; const r = findRoom(c, slug); if (!r || routeDone(r)) continue;
    for (const e of r.encounters) {
      if (['sandbox', 'boss'].includes(e.type) || store.isPassed(e.id) || isLocked(e) || skip.has(e.id)) continue;
      const min = EST[e.type] || 10; if (min > left) { if (left < 8) return out; continue; }
      out.push({ key: `new:${e.id}`, label: `[${findCourse(c).region.split(' ')[0]}] ${typeName[e.type] || e.type}: ${e.title || e.id}`, min, act: { open: e.id }, kind: 'new', room: r.title }); skip.add(e.id); left -= min;
    }
    if (out.length) return out; // finish one room at a time: that is the guided route
  }
  return out;
}
// which course gets the most time today: the one that is furthest behind (and has weak spots), rotating on ties
function courseOrder() {
  const day = Math.floor(Date.now() / 86400000), weak = new Set(weakSpots(encIndex, 6).map((w) => w.key.split('/')[0]));
  return catalog.map((c, i) => { const all = c.rooms.flatMap((r) => r.encounters.filter((e) => e.type !== 'sandbox')), done = all.filter((e) => store.isPassed(e.id)).length, behind = 1 - done / Math.max(1, all.length); return { id: c.id, score: behind + (weak.has(c.id) ? 0.15 : 0) + ((i + day) % 3) * 0.01 }; }).sort((a, b) => b.score - a.score).map((x) => x.id);
}
function planSteps(minutes) {
  const groups = { review: [], fresh: [], extra: [] }, seen = new Set();
  const add = (g, key, label, min, act, kind) => groups[g].push({ key, label, min, act, kind });
  const due = store.dueReviews().filter((id) => encIndex.has(id)).slice(0, 3);
  for (const id of due) { seen.add(id); add('review', `due:${id}`, `Respawn: ${encIndex.get(id).enc.title || id}`, 8, { open: id }, 'respawn'); }
  const open = [...new Map(mistakes().filter((x) => x.open && encIndex.has(x.encId)).reverse().map((x) => [x.encId, x])).values()].slice(0, 2);
  for (const x of open) if (!seen.has(x.encId)) { seen.add(x.encId); add('review', `mis:${x.encId}`, `Redo after a mistake: ${encIndex.get(x.encId).enc.title || x.encId}`, 6, { open: x.encId }, 'mistake'); }
  const pl = Object.entries(pile()).filter(([id]) => encIndex.has(id) && !seen.has(id)).sort((a, b) => a[1].seen - b[1].seen)[0];
  if (pl) { seen.add(pl[0]); add('review', `pile:${pl[0]}`, `From your pile: ${encIndex.get(pl[0]).enc.title || pl[0]}`, 8, { open: pl[0] }, 'pile'); }
  // review gets at most a third of the time; the rest goes to new material in the chosen courses
  let left = minutes; const out = []; const take = (list, cap) => { let used = 0; for (const s of list) if (s.min <= left && used + s.min <= cap) { out.push(s); left -= s.min; used += s.min; } };
  take(groups.review, Math.max(8, Math.round(minutes / 3)));
  const feyn = minutes >= 45 ? 8 : 0, boss = minutes >= 90 ? 30 : 0, newBudget = left - feyn - boss, order = courseOrder();
  const mainBudget = minutes >= 90 ? Math.round(newBudget * 0.6) : newBudget;
  const first = newMaterial(order[0], mainBudget, seen); for (const s of first) { out.push(s); left -= s.min; }
  if (minutes >= 90) { const second = newMaterial(order[1], newBudget - first.reduce((a, s) => a + s.min, 0), seen); for (const s of second) { out.push(s); left -= s.min; } }
  const ws = weakSpots(encIndex, 3);
  if (minutes >= 60) for (const w of ws.slice(0, 1)) { const [c, s] = w.key.split('/'), r = findRoom(c, s), lab = r?.encounters.find((e) => e.type === 'lab'), der = r?.encounters.find((e) => e.type === 'derive' && !passed(e)), pick = lab || der; if (pick && !seen.has(pick.id) && (EST[pick.type] || 12) <= left) { seen.add(pick.id); out.push({ key: `weak:${pick.id}`, label: `Weak spot, ${pick.type === 'lab' ? 'experiment' : 'derivation'}: ${pick.title || pick.id}`, min: EST[pick.type] || 12, act: { open: pick.id }, kind: 'weak' }); left -= EST[pick.type] || 12; } }
  if (feyn && left >= feyn) { out.push({ key: 'feynman', label: 'Feynman: explain one topic in your own words', min: feyn, act: { tab: 'feynman' }, kind: 'feynman' }); left -= feyn; }
  if (boss && left >= 25) { const bs = [...encIndex.values()].filter((r) => r.enc.type === 'boss' && r.course === order[0] && !seen.has(r.enc.id)).sort((a, b) => (store.isSolved(a.enc.id) ? 1 : 0) - (store.isSolved(b.enc.id) ? 1 : 0) || Math.random() - 0.5)[0]; if (bs) out.push({ key: `boss:${bs.enc.id}`, label: `Exam problem: ${bs.enc.title}`, min: Math.min(left, bs.enc.minutes), act: { open: bs.enc.id }, kind: 'boss' }); }
  if (minutes >= 30 && !out.some((s) => s.kind === 'new')) out.push({ key: 'drill', label: 'Drill: spot the error / limiting cases', min: 10, act: { tab: 'drills' }, kind: 'drill' });
  return out;
}
function renderPlan(host) {
  const ses = store.val('session', {}) || {}, today = todayStr(), done = ses.date === today ? ses.done || {} : {}, minutes = ses.date === today ? ses.minutes || 60 : 60;
  const steps = ses.date === today && ses.steps ? ses.steps : null;
  const draw = () => {
    const cur = store.val('session', {}) || {}, st = cur.date === today ? cur.steps : null, dn = cur.date === today ? cur.done || {} : {};
    host.innerHTML = M(`<p class="src">Tell me how much time you have. I pick the course that needs it most and the next exercises of its guided route, plus your due respawns, open mistakes, pile and weak spots. Nothing is forced: skip what you like.</p><div class="row">${[30, 60, 90, 120].map((x) => `<button class="${(cur.minutes || 60) === x && st ? 'go' : 'chip btn'}" data-pm="${x}">${x} min</button>`).join('')}</div>
      ${st ? `<h3>Today's session (${st.reduce((s, x) => s + x.min, 0)} min, ${st.filter((x) => dn[x.key]).length}/${st.length} done)</h3><p class="src">Review first (${st.filter((x) => ['respawn', 'mistake', 'pile'].includes(x.kind)).reduce((s, x) => s + x.min, 0)} min), then new material in the course that needs it most, then a weak spot, Feynman and an exam problem for long sessions.</p><div class="maplist">${st.map((x) => `<div class="maprow pilerow${dn[x.key] ? ' fixed' : ''}"><label class="mt"><input type="checkbox" data-pdone="${x.key}" ${dn[x.key] ? 'checked' : ''}> ${x.label}</label><span class="mp">${x.min} min</span><span class="md">${x.room ? x.room + ' · ' : ''}<button class="go" data-pstart="${x.key}">Start</button></span></div>`).join('')}</div>` : '<p>Choose a duration to get a session.</p>'}`);
    host.querySelectorAll('[data-pm]').forEach((b) => (b.onclick = () => { store.setVal('session', { date: today, minutes: +b.dataset.pm, steps: planSteps(+b.dataset.pm), done: {} }); draw(); }));
    host.querySelectorAll('[data-pdone]').forEach((c) => (c.onchange = () => { const s2 = store.val('session', {}); store.setVal('session', { ...s2, done: { ...(s2.done || {}), [c.dataset.pdone]: c.checked } }); draw(); }));
    host.querySelectorAll('[data-pstart]').forEach((b) => (b.onclick = () => { const x = (store.val('session', {}).steps || []).find((y) => y.key === b.dataset.pstart); if (!x) return; if (x.act.tab) { renderStudy(x.act.tab); return; } const s2 = store.val('session', {}); store.setVal('session', { ...s2, done: { ...(s2.done || {}), [x.key]: true } }); closeOverlay(true); openById(x.act.open); player.enabled = true; }));
  };
  void steps; void done; void minutes; draw();
}
// ---- phone menu (lite mode): everything without walking around
function menuHtml() {
  const s = missionStatus(), d = store.dueReviews().length, n = nextRouteStep();
  const tdn = todayItems().filter((x) => !x.mission && x.ok).length;
  return `<div class="menu"><button class="bigbtn" data-m="today"><b>Today: ${tdn} exercise${tdn === 1 ? '' : 's'}, ${goalInfo().min} min</b><span>what you did so far, with the exercises</span></button><button class="bigbtn" data-m="quick"><b>Quick session</b><span>${quickInfo()}: respawns first, then the next step</span></button>${n ? `<button class="bigbtn" data-m="goto:${n.key}"><b>Continue: ${n.room.title}</b><span>${n.why}</span></button>` : ''}
    <button class="bigbtn" data-m="missions"><b>Daily missions</b><span>${s.done} of ${s.total} done</span></button>
    <button class="bigbtn" data-m="study"><b>Study hub</b><span>session planner, drills, mixed practice, pile, mistakes, Feynman${d ? `, ${d} respawn${d > 1 ? 's' : ''} due` : ''}</span></button>
    <button class="bigbtn" data-m="exam"><b>Exam hall</b><span>mock exams with grade</span></button>
    <button class="bigbtn" data-m="map"><b>Rooms and route</b><span>pick a room, then an exercise</span></button>
    <button class="bigbtn" data-m="formulas"><b>Formulas</b><span>drawer for the current course</span></button>
    ${inNexus ? '' : '<button class="bigbtn" data-m="connections"><b>Connections of this room</b><span>how it links to topics in other rooms and courses</span></button>'}
    <button class="bigbtn" data-m="allconn"><b>All connections</b><span>every link between topics across the three courses</span></button>
    <button class="bigbtn" data-m="profile"><b>Profile</b><span>${store.profile} · ${sync.available ? sync.status : 'browser only'}</span></button>
    ${lite ? '' : '<button class="bigbtn" data-m="nexus"><b>Fly to the Nexus</b><span>the map of everything you study</span></button>'}
    <button class="bigbtn" data-m="help"><b>Controls and help</b><span>${touch ? 'stick, look, buttons, both panels' : 'keys and tips'}</span></button>
    ${lite ? '' : '<button class="bigbtn" data-m="tutorial"><b>Replay the tutorial</b><span>for the room you are in</span></button>'}
    <button class="bigbtn" data-m="theme"><b>Theme: ${isLight() ? 'light' : 'dark'}</b><span>${isLight() ? 'switch to the dark theme' : 'switch to the white room (light theme)'}</span></button>
    <button class="bigbtn" data-m="controls"><b>Controls: ${touch ? 'touch' : 'keyboard and mouse'}</b><span>${touch ? 'switch to the keyboard and mouse layout' : 'switch to the touch layout (stick, drag to look)'}</span></button>
    ${touch && !lite ? '<button class="bigbtn" data-m="landscape"><b>Play sideways</b><span>lock the screen to landscape (full screen, this visit only)</span></button><button class="bigbtn" data-m="unlock"><b>Let the screen rotate</b><span>unlock the rotation, back to normal</span></button>' : ''}
    <button class="bigbtn" data-m="litetoggle"><b>${lite ? 'Switch to the 3D game' : 'Switch to the simple menu (no 3D)'}</b><span>${lite ? 'walk around, experiments, both panels side by side' : 'for slow phones: no walking, only lists'}</span></button></div>`;
}
function roomMenuHtml() {
  if (!room) return '';
  return `<div class="menu"><p class="src">${room.intro || ''}</p>${groups.map((g, i) => `<button class="bigbtn" data-m="group:${i}"><b>${g.label}</b><span>${g.items.filter(passed).length} of ${g.items.length} done</span></button>`).join('')}<button class="bigbtn" data-m="conn"><b>Connections</b><span>how this room links to others</span></button><button class="bigbtn" data-m="menu"><b>Back to the menu</b></button></div>`;
}
function wireMenu() {
  document.querySelectorAll('[data-m]').forEach((b) => (b.onclick = async () => {
    const [k, arg] = b.dataset.m.split(':');
    if (k === 'missions') openOverlay('missions'); else if (k === 'study') openOverlay('pile'); else if (k === 'exam') openOverlay('exam'); else if (k === 'map') openOverlay('map'); else if (k === 'profile') openOverlay('profile'); else if (k === 'menu') openOverlay('menu');
    else if (k === 'formulas') { closeOverlay(true); openCodex(); }
    else if (k === 'goto') { const [c, r] = arg.split('/'); if (lite) { await loadRoom(c, r, { silent: true }); openOverlay('roomMenu'); } else { closeOverlay(true); await loadRoom(c, r, { silent: false }); player.enabled = true; } }
    else if (k === 'quick') { closeOverlay(true); startQuick(); }
    else if (k === 'today') { openOverlay('pile'); renderStudy('today'); }
    else if (k === 'help') openOverlay('help'); else if (k === 'tutorial') { closeOverlay(true); startTutorial(); }
    else if (k === 'theme') { setThemeChoice(isLight() ? 'dark' : 'light'); reloadWithout(); }
    else if (k === 'controls') { setControlsChoice(touch ? 'desktop' : 'touch'); reloadWithout('touch'); }
    else if (k === 'landscape') { closeOverlay(true); lockLandscape(); }
    else if (k === 'unlock') { closeOverlay(true); unlockOrientation(); }
    else if (k === 'nexus') { closeOverlay(true); goNexus(); } else if (k === 'litetoggle') setLitePref(!lite);
    else if (k === 'group') { closeOverlay(true); openGroup(groups[+arg]); }
    else if (k === 'conn') { closeOverlay(true); openConnections(`${course.id}/${room.slug}`); }
    else if (k === 'connections') { closeOverlay(true); connectionsHere(); } else if (k === 'allconn') { closeOverlay(true); openConnections(null); }
  }));
}
// ================================================================ "start now or remind me later" (opened by tapping a notification: ?suggest=quick | ?suggest=open:<exercise id>)
let suggestion = null;
function showSuggest(spec) {
  let title, detail, start;
  if (spec === 'quick') { title = 'Quick session'; detail = quickInfo(); start = () => startQuick(); }
  else if (spec.startsWith('open:') && encIndex.has(spec.slice(5))) {
    const ref = encIndex.get(spec.slice(5)), e = ref.enc; title = `${typeName[e.type] || e.type} \u201c${prettyText(e.title || e.id)}\u201d`; detail = `${findRoom(ref.course, ref.roomId)?.title || ''}, about ${EST[e.type] || 10} min`; start = () => openById(e.id);
  } else return false;
  const soon = new Date(Date.now() + 3600e3), hhmm = `${String(soon.getHours()).padStart(2, '0')}:${String(Math.ceil(soon.getMinutes() / 5) * 5 % 60).padStart(2, '0')}`;
  suggestion = { spec, what: `${title}: ${detail}`, start, html: `<p class="src">Suggested for now</p><h2>${title}</h2><p class="src">${detail}</p>
    <div class="row"><button class="go" id="sg-now">Start now</button></div>
    <h3>Not now? Remind me</h3>
    <div class="row">${[[5, '5 min'], [10, '10 min'], [30, '30 min'], [60, '1 hour']].map(([n, l]) => `<button class="chip btn sg-later" data-min="${n}">in ${l}</button>`).join('')}</div>
    <div class="row"><label>or at <input type="time" id="sg-time" value="${hhmm}"></label><button class="chip btn" id="sg-at">Remind me then</button></div>
    <div class="msg" id="sg-msg"></div>` };
  openOverlay('suggest'); return true;
}
function wireSuggest() {
  $('sg-now').onclick = () => { const go = suggestion.start; closeOverlay(true); player.enabled = true; go(); };
  const say = (t, cls = '') => { const el = $('sg-msg'); el.className = `msg ${cls}`; el.textContent = t; };
  const remind = async (body) => {
    say('One moment...', 'dim');
    try {
      const r = await fetch('/api/remind', { method: 'POST', headers: { 'Content-Type': 'application/json', ...apiHeaders() }, body: JSON.stringify({ spec: suggestion.spec, what: suggestion.what.replace(/<[^>]+>/g, ''), ...body }) });
      const j = await r.json().catch(() => ({}));
      if (r.ok && j.ok) { say(`Okay. I will remind you ${j.day === 'tomorrow' ? 'tomorrow ' : ''}at ${j.at}.`, 'good'); document.querySelectorAll('#ov-body .sg-later, #sg-at').forEach((b) => (b.disabled = true)); }
      else if (r.status === 503) say('Reminders are not switched on at the server yet. On the server run rpg-update once. If you never set up the notifications: sudo bash /opt/physics-rpg/deploy/notify-setup.sh', 'bad');
      else say(j.error || 'Could not set the reminder.', 'bad');
    } catch { say('Could not reach the server.', 'bad'); }
  };
  document.querySelectorAll('.sg-later').forEach((b) => (b.onclick = () => remind({ minutes: +b.dataset.min })));
  $('sg-at').onclick = () => { const v = $('sg-time').value; if (/^\d{1,2}:\d{2}$/.test(v)) remind({ at: v }); else say('Pick a time first.', 'bad'); };
}
// ================================================================ what I did today
function todayItems() {
  const date = todayStr(), log = store.activityOn(date), seen = new Set(log.map((x) => x.id)), items = log.map((x) => ({ ...x }));
  for (const [id, v] of Object.entries(store.snapshot.solved || {})) // finished earlier today, before the activity log existed: shown without XP
    if (!seen.has(id) && v.at && localDate(v.at) === date && encIndex.has(id)) { const e = encIndex.get(id).enc; items.push({ t: v.at, id, title: e.title || id, type: e.type, ok: !v.failed, xp: null, review: false }); }
  return items.sort((a, b) => a.t - b.t);
}
const hhmm = (t) => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
function todayHtml() {
  const date = todayStr(), all = todayItems(), items = all.filter((x) => !x.mission), ms = todays(), day = store.missionsOf(date), doneM = ms.filter((m) => day.done[m.id]), g = goalInfo();
  const okN = items.filter((x) => x.ok).length, failN = items.length - okN, cleared = items.filter((x) => x.ok && x.review).length, xp = store.xpOn(date);
  const row = (x) => { const ref = encIndex.get(x.id), room = ref ? findRoom(ref.course, ref.roomId) : null, course = ref ? findCourse(ref.course)?.region : '';
    return `<div class="maprow todayrow ${x.ok ? 'ok' : 'miss'}"><button class="link" data-todayopen="${x.id}"${ref ? '' : ' disabled'}><span class="mt">${x.ok ? '\u2713' : '\u2717'} ${typeName[x.type] || x.type} \u201c${prettyText(x.title)}\u201d</span></button><span class="mp">${x.xp ? `+${x.xp} XP` : x.xp === 0 ? 'no XP' : ''}</span><span class="md">${[course, room?.title, hhmm(x.t)].filter(Boolean).join(' \u00b7 ')}${x.review && x.ok ? ' \u00b7 respawn cleared' : ''}${!x.ok ? ' \u00b7 comes back as a respawn' : ''}</span></div>`; };
  return `<div class="msn-head"><div><b>${g.min} min</b> on exercises today<div class="src">${g.ex} finished. Goal: ${g.goal} min or ${g.exGoal} exercises${g.done ? ', reached' : ''}</div></div>
    <div><b>${okN} exercise${okN === 1 ? '' : 's'}</b> passed${cleared ? ` (${cleared} respawn${cleared === 1 ? '' : 's'} cleared)` : ''}<div class="src">${failN ? `${failN} to retry: they come back as respawns` : 'nothing failed so far'}</div></div>
    <div><b>${xp >= 0 ? '+' : '\u2212'}${Math.abs(xp)} XP</b> today<div class="src">${doneM.length} of ${ms.length} missions done, streak ${streakNow().count} day${streakNow().count === 1 ? '' : 's'}</div></div></div>
    ${items.length ? `<h3>Exercises (${items.length})</h3><div class="maplist">${items.map(row).join('')}</div>` : '<p>Nothing finished yet today. A quick session is the easiest start.</p>'}
    ${doneM.length ? `<h3>Missions done (${doneM.length})</h3><div class="maplist">${doneM.map((x) => `<div class="maprow msn done"><span class="mt"><span class="tag">${x.kind}</span> ${x.title}</span><span class="mp">done</span></div>`).join('')}</div>` : ''}
    <div class="row"><button class="go" id="today-quick">Quick session (${quickInfo()})</button></div>`;
}
function wireToday(host) {
  host.querySelectorAll('[data-todayopen]').forEach((b) => (b.onclick = () => openFromPile(b.dataset.todayopen)));
  const q = host.querySelector('#today-quick'); if (q) q.onclick = () => startQuick();
}
// ================================================================ daily goal, quick session, weekly summary
const goalMinutes = () => GOALS[(store.val('settings', {}) || {}).goal] || GOALS.normal;
const goalExercises = () => GOAL_EXERCISES[(store.val('settings', {}) || {}).goal] || GOAL_EXERCISES.normal;
const exercisesToday = () => new Set(todayItems().filter((x) => !x.mission).map((x) => x.id)).size; // finished today, passed or not
// the daily goal is reached by minutes of work on exercises OR by the number of exercises finished
function goalInfo() { const goal = goalMinutes(), min = Math.floor(studyToday() / 60), exGoal = goalExercises(), ex = exercisesToday(); return { goal, min, exGoal, ex, done: min >= goal || ex >= exGoal }; }
function checkGoal() {
  const date = todayStr(); if (store.flag(`goal:${date}`)) return;
  const g = goalInfo();
  if (g.done) { store.setFlag(`goal:${date}`); toast(`<b>Daily goal reached:</b> ${g.min >= g.goal ? `${g.goal} minutes on exercises` : `${g.ex} exercises finished`} today. Anything more is a bonus.`); sfx.goal(); pulse('right'); }
}
let queueLabel = 'pile';
// A short session: due respawns first (at most 2), then the next unfinished exercises of the recommended room, usually 10 to 20 minutes in all
function quickIds() {
  const out = [], push = (id) => { if (id && encIndex.has(id) && !out.includes(id)) out.push(id); }, mins = () => out.reduce((s, id) => s + (EST[encIndex.get(id).enc.type] || 10), 0);
  const rv = store.snapshot.reviews || {};
  store.dueReviews().filter((id) => encIndex.has(id)).sort((a, b) => (rv[a].due || 0) - (rv[b].due || 0)).slice(0, 2).forEach(push); // most overdue first
  const n = nextRouteStep();
  if (n) {
    push(n.enc?.id);
    for (const e of n.room.encounters) { if (mins() >= 10 || out.length >= 3) break; if (!['sandbox', 'boss'].includes(e.type) && !store.isPassed(e.id) && !isLocked(e) && (EST[e.type] || 10) + mins() <= 14) push(e.id); }
  }
  return out.slice(0, 3);
}
function quickInfo() { const ids = quickIds(); if (!ids.length) return 'nothing left'; const min = ids.reduce((s, id) => s + (EST[encIndex.get(id).enc.type] || 10), 0); return `${ids.length} exercise${ids.length > 1 ? 's' : ''}, about ${Math.max(5, Math.round(min / 5) * 5)} min`; }
function startQuick() {
  const ids = quickIds();
  if (!ids.length) { toast('Nothing to do right now: no respawns are due and the guided route is finished. Try the exam hall.'); return; }
  queueLabel = 'Quick session'; pileQueue = ids; openFromPile(ids[0], true);
}
function weekStats() {
  const day = 86400000, now = Date.now(), days = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return todayStr(d); });
  const minutes = days.map((d) => Math.round(store.activeSecondsOn(d) / 60));
  const solved = Object.entries(store.snapshot.solved || {}).filter(([id, v]) => encIndex.has(id) && v.at >= now - 7 * day && !v.failed);
  const courses = catalog.map((c) => { const all = c.rooms.flatMap((r) => r.encounters.filter((e) => e.type !== 'sandbox')), passedN = all.filter((e) => store.isPassed(e.id)).length; return { id: c.id, region: c.region, passed: passedN, total: all.length, week: solved.filter(([id]) => encIndex.get(id).course === c.id).length }; });
  return { days, minutes, studied: minutes.filter((x) => x > 0).length, total: minutes.reduce((a, b) => a + b, 0), exercises: solved.length, missions: days.reduce((n, d) => n + Object.keys(store.missionsOf(d).done).length, 0), courses, weak: weakSpots(encIndex, 2).map((w) => { const [c, s] = w.key.split('/'); return findRoom(c, s)?.title || w.key; }) };
}
function weekHtml() {
  const w = weekStats(), mx = Math.max(20, ...w.minutes), plan = examPlan(catalog, isPassedEnc), best = [...w.courses].sort((a, b) => b.passed / b.total - a.passed / a.total)[0], sn = streakNow();
  const dn = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  return `<div class="msn-head"><div><b>${w.total} min</b> on exercises<div class="src">on ${w.studied} of the last 7 days (goal ${goalMinutes()} min or ${goalExercises()} exercises a day)</div></div>
    <div><b>${w.exercises} exercises</b> passed<div class="src">${w.missions} mission${w.missions === 1 ? '' : 's'} done, streak ${sn.count} day${sn.count === 1 ? '' : 's'}</div></div>
    <div><b>${store.dueReviews().length} respawns</b> due<div class="src">exam in ${plan.days} days: ${plan.left} items to go ≈ ${plan.perDay} a day</div></div></div>
    <div class="spark week">${w.minutes.map((x, i) => `<span><i title="${w.days[i]}: ${x} min" style="height:${Math.max(3, Math.round(38 * x / mx))}px"></i><em>${dn[new Date(w.days[i] + 'T00:00:00').getDay()]}</em></span>`).join('')}</div>
    <h3>Progress per course</h3>${w.courses.map((c) => `<div class="goalrow"><b>${c.region}</b> <span class="src">${c.passed} / ${c.total} done${c.week ? `, ${c.week} new this week` : ''}</span><div class="bar"><i style="width:${Math.round(100 * c.passed / Math.max(1, c.total))}%"></i></div></div>`).join('')}
    <p><b>Strongest:</b> ${best.region}. ${w.weak.length ? `<b>Needs work:</b> ${w.weak.join(' and ')}.` : 'No weak spots recorded yet.'}</p>
    <div class="row"><button class="go" id="week-quick">Quick session</button><button class="chip btn" id="week-plan">Plan a longer session</button></div>`;
}
// ================================================================ daily missions
const isPassedEnc = (e) => store.isPassed(e.id);
function todays() {
  const k = todayStr();
  if (!dayMissions || dayKey !== k) { dayMissions = buildMissions({ catalog, banks, links: linksData, store, isPassed: isPassedEnc }); dayKey = k; }
  return dayMissions;
}
const streakNow = () => store.streakNow(todayStr(), yesterdayStr(), dayBeforeYesterdayStr());
const streakMult = () => 1 + 0.05 * Math.min(10, streakNow().count);
function missionStatus() { const day = store.missionsOf(todayStr()), ms = todays(); return { done: ms.filter((m) => day.done[m.id]).length, total: ms.length, day }; }
function toast(html) { const t = $('toast'); t.innerHTML = M(html); t.classList.add('on'); clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove('on'), 4200); }
function completeMission(m) {
  const date = todayStr(); if (!store.completeMission(date, m.id, m.xp, yesterdayStr(), dayBeforeYesterdayStr())) return;
  const gain = Math.round(m.xp * streakMult()); store.addXp(gain); store.setVal('stats', { ...(store.val('stats', {}) || {}), missions: ((store.val('stats', {}) || {}).missions || 0) + 1 });
  const st = missionStatus(); let extra = '';
  if (st.done === st.total) { store.addXp(50); extra = ' All missions of the day done: <b>+50 XP bonus</b>.'; }
  const frozen = store.freezeJustUsed === date ? ' <b>Your weekly streak freeze saved the streak.</b>' : '';
  toast(`<b>Mission complete:</b> ${m.title}<br>+${gain} XP (streak bonus ×${streakMult().toFixed(2)}).${extra}${frozen}`);
  sfx.goal(); pulse('right'); refresh(); flashWorld(true);
}
function flashWorld(ok) { if (world) (ok ? world.successEffect() : world.failEffect()); }
window.addEventListener('encounter-done', (ev) => {
  const { id, ok } = ev.detail; if (!ok) return;
  for (const m of todays()) if ((m.enc && m.enc.id === id) || m.encId === id) completeMission(m);
});
function missionsHtml() {
  const ms = todays(), day = store.missionsOf(todayStr()), lv = levelOf(store.xp), plan = examPlan(catalog, isPassedEnc), sn = streakNow(), active = sn.count, g = goalInfo();
  return `<div class="msn-head"><div><b>${lv.rank}</b> · level ${lv.lv}<div class="bar"><i style="width:${Math.round(100 * lv.into / lv.need)}%"></i></div><span class="src">${lv.into} / ${lv.need} XP to the next rank</span></div>
    <div><b>Streak: ${active} day${active === 1 ? '' : 's'}</b><div class="src">bonus ×${(1 + 0.05 * Math.min(10, active)).toFixed(2)} on mission XP</div><div class="src">${sn.saved ? '<b class="due">Do one mission today: only your weekly freeze is keeping the streak.</b>' : sn.alive && !sn.today ? 'Do one mission today to keep it.' : ''} ${store.freezeAvailable(todayStr()) ? 'Weekly freeze ready: it forgives one missed day.' : 'Freeze used this week, back on Monday.'}</div></div>
    <div><b>Exam in ${daysToExam()} days</b><div class="src">${plan.done} / ${plan.total} items done; ${plan.left} to go ≈ ${plan.perDay} per day</div></div></div>
    <div class="goalrow"><b>Daily goal: ${g.min} of ${g.goal} min on exercises, or ${g.ex} of ${g.exGoal} exercises</b><div class="bar${g.done ? ' full' : ''}"><i style="width:${Math.min(100, Math.round(100 * Math.max(g.min / g.goal, g.ex / g.exGoal)))}%"></i></div><span class="src">${g.done ? 'reached today. Everything extra is a bonus.' : `Either one counts: ${g.goal} minutes of working on exercises (menus, lists and the formulas do not count) or ${g.exGoal} finished exercises. Change the goal in Profile > settings.`}</span></div>
    <p class="src">Done today: ${todayItems().filter((x) => !x.mission && x.ok).length} exercises, ${store.xpOn(todayStr()) >= 0 ? '+' : '\u2212'}${Math.abs(store.xpOn(todayStr()))} XP. <button class="link" id="msn-today">See what you did today</button></p>
    <div class="row"><button class="go" id="quick-go">Quick session (${quickInfo()})</button></div>
    <h3>Today's missions (${ms.filter((m) => day.done[m.id]).length} / ${ms.length})</h3><div class="maplist">${ms.map((m) => `<div class="maprow msn${day.done[m.id] ? ' done' : ''}"><span class="mt"><span class="tag">${m.kind}</span> ${m.title}</span><span class="mp">${day.done[m.id] ? 'done' : '+' + Math.round(m.xp * streakMult()) + ' XP'}</span><span class="md">${m.desc}</span>${day.done[m.id] ? '' : `<button class="go" data-mission="${m.id}">Start</button>`}</div>`).join('')}</div>
    <p class="src">New missions every day, chosen by question type like the real exam (multiple choice, derivation, estimation, full problem). Rotating focus course: ${catalog.find((c, i) => i === Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000) % catalog.length)?.region}. Answer at least one mission per day to keep the streak.</p>`;
}
function wireMissions() {
  const qg = $('quick-go'); if (qg) qg.onclick = () => startQuick();
  const mt = $('msn-today'); if (mt) mt.onclick = () => { openOverlay('pile'); renderStudy('today'); };
  document.querySelectorAll('[data-mission]').forEach((b) => (b.onclick = async () => {
    const m = todays().find((x) => x.id === b.dataset.mission); if (!m) return;
    closeOverlay(true);
    if (m.qids) store.setVal('seen-q', [...(store.val('seen-q', []) || []), ...m.qids].slice(-500));
    if (m.enc) openEncounter(m.enc); else await openById(m.encId);
  }));
}
// ================================================================ interaction
let promptTarget = null;
function updatePrompt() {
  if (inNexus) {
    const f = set?.focus, el = $('prompt');
    if (!blocking() && f?.node) { el.style.display = ''; el.textContent = `[E] Fly into: ${f.node.room.title}`; promptTarget = { type: 'nexus', node: f.node }; }
    else if (!blocking() && f?.link) { el.style.display = ''; el.textContent = `[E] Read: ${(f.link.data?.title || f.link.title)}`; promptTarget = { type: 'nexuslink', link: f.link }; } else { el.style.display = 'none'; promptTarget = null; }
    return;
  }
  promptTarget = !blocking() && player.enabled ? player.target() : null;
  const el = $('prompt');
  if (!promptTarget) { el.style.display = 'none'; return; }
  el.style.display = '';
  const t = promptTarget;
  if (t.type === 'portal') el.textContent = dueTarget ? '[E] Enter the review portal' : 'Review portal: nothing is due. Exercises you got wrong come back here after 1, 3, 7 and 16 days (use the Pile (V) for ones you just want to keep)';
  else if (t.type === 'door') el.textContent = '[E] Open the map: travel to another room';
  else if (t.type === 'labholo') el.textContent = `[E] Experiment: ${String(t.enc.title).replace(/\$/g, '')}`;
  else el.textContent = `[E] ${t.spec.label}: ${t.spec.blurb}`;
}
function onKey(e) {
  if (e.code === 'Escape' && (overlay || codexOpen)) { codexOpen ? closeCodex() : closeOverlay(); return; } // also while typing in the codex search
  if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;
  if (e.code === 'Escape') {
    if (codexOpen) { closeCodex(); return; }
    if (overlay) { closeOverlay(); return; }
    if (current && !(runner && !runner.finished)) { closePanel(); return; }
  }
  if (e.code === 'KeyK' && !tut && !current) { connectionsHere(); return; }
  if (e.code === 'KeyP' && !tut && !current) { overlay === 'profile' ? closeOverlay() : openOverlay('profile'); return; }
  if (e.code === 'F1' && !tut) { e.preventDefault(); overlay === 'help' ? closeOverlay() : openOverlay('help'); return; }
  if (e.code === 'KeyV' && !tut && !current) { overlay === 'pile' ? closeOverlay() : openOverlay('pile'); return; }
  if (e.code === 'KeyX' && !tut && !current) { overlay === 'exam' ? closeOverlay() : openOverlay('exam'); return; }
  if (e.code === 'KeyT' && !tut && !current) { overlay === 'missions' ? closeOverlay() : openOverlay('missions'); return; }
  if (e.code === 'KeyM' && !tut && !current) { overlay === 'map' ? closeOverlay() : openOverlay('map'); return; }
  if (e.code === 'KeyB' && !tut) { toggleCodex(); return; }
  if (e.code === 'KeyE' && promptTarget && !blocking()) interact(promptTarget);
  if (e.code === 'KeyQ' && !tut && !current) { closeOverlay(true); startQuick(); return; }
  if (e.code === 'KeyN' && !tut && !current && !inNexus) goNexus();
  if (e.code === 'KeyL' && bridgeOn) world.setLabelsVisible(!world.labelsOn);
  if (e.code === 'Space' && view.variant) { e.preventDefault(); togglePause(); }
  if (e.code === 'KeyR' && view.variant) replay();
  if (e.code === 'KeyO' && view.variant) toggleLoop();
  if (e.code === 'BracketLeft') setSpeed(pb.speed / 2);
  if (e.code === 'BracketRight') setSpeed(pb.speed * 2);
}
async function interact(it) {
  if (it.type === 'nexuslink') { openLinkPanel(it.link); return; }
  if (it.type === 'nexus') { const n = it.node; warpTo(() => loadRoom(n.course, n.room.slug, { silent: false })); return; }
  if (it.type === 'portal') { if (dueTarget) await openById(dueTarget); return; }
  if (it.type === 'door') { openOverlay('map'); return; }
  if (it.type === 'labholo') { openEncounter(it.enc); return; }
  openGroup(it.spec);
}
async function openById(id) {
  const ref = encIndex.get(id); if (!ref) return;
  if (ref.roomId !== room.slug) await loadRoom(ref.course, ref.roomId, { silent: true });
  openEncounter(ref.enc);
}

// ================================================================ overlays: map and formula codex
function openOverlay(kind) {
  overlay = kind; player.unlock();
  $('overlay').style.display = '';
  $('ov-title').textContent = { missions: 'Daily missions', profile: 'Profile, settings and achievements', exam: 'Exam hall: pure exam training', pile: 'Study hub', menu: 'Menu', roomMenu: room?.title || 'Room', help: 'Controls and help', suggest: 'Ready?' }[kind] || 'Map: choose a room';
  if (stopExam) { stopExam(); stopExam = null; }
  if (kind === 'exam') { $('ov-body').innerHTML = ''; stopExam = mountExamHall($('ov-body'), { catalog, banks, store, onGoto: (k) => { const [c, r] = k.split('/'); closeOverlay(true); loadRoom(c, r, { silent: false }); player.enabled = true; } }); return; }
  if (kind === 'pile') { renderStudy(); return; }
  if (kind === 'suggest') { $('ov-body').innerHTML = M(suggestion.html); wireSuggest(); return; }
  if (kind === 'menu' || kind === 'roomMenu') { $('ov-body').innerHTML = kind === 'menu' ? menuHtml() : roomMenuHtml(); wireMenu(); return; }
  $('ov-body').innerHTML = kind === 'missions' ? missionsHtml() : kind === 'profile' ? profileHtml() : kind === 'help' ? helpHtml() : mapHtml();
  if (kind === 'missions') { wireMissions(); return; }
  if (kind === 'profile') { wireProfile(); return; }
  if (kind === 'help') return;
  const ex = $('exp'); if (ex) ex.onclick = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([store.exportJson()], { type: 'application/json' })); a.download = 'physics-rpg-progress.json'; a.click(); };
  const im = $('imp'); if (im) im.onchange = async () => { const f = im.files[0]; if (f && store.importJson(await f.text())) { refresh(); closeOverlay(); } else alert('Not a valid progress file.'); };
  document.querySelectorAll('[data-goto]').forEach((b) => (b.onclick = async () => { const [c, r] = b.dataset.goto.split('/'); if (lite) { await loadRoom(c, r, { silent: true }); openOverlay('roomMenu'); return; } loadRoom(c, r, { silent: false }); if (!player.enabled) player.enabled = true; }));
}
let stopExam = null;
function closeOverlay(silent) {
  if (stopExam) { stopExam(); stopExam = null; }
  overlay = null; $('overlay').style.display = 'none';
  if (!silent && player?.enabled && !current && !tut) player.lock();
}
function mapHtml() {
  const rows = route.map((it, i) => { const [c, s] = it.key.split('/'), r = findRoom(c, s); if (!r) return ''; const p = roomProgress(r), done = routeDone(r); return { i, it, r, c, s, p, done }; }).filter(Boolean);
  const firstOpen = rows.findIndex((x) => !x.done);
  const routeHtml = `<h3>Your route (recommended order)</h3><div class="maplist">${rows.slice(0, 40).map((x, k) => `<button class="maprow${k === firstOpen ? ' here' : ''}" data-goto="${x.c}/${x.s}"><span class="mt">${k + 1}. ${x.r.title}${k === firstOpen ? ' &nbsp;← next' : ''}</span><span class="mp">${x.done ? 'done' : `${x.p.done} / ${x.p.total}`}</span><span class="md">${x.it.why}</span></button>`).join('')}</div>
    <p class="src">Progress and respawns are saved in <b>this browser</b> (this address). <button class="link" id="exp">export progress</button> <label class="link">import <input id="imp" type="file" accept="application/json" style="display:none"></label></p><h3>All rooms by course</h3>`;
  return routeHtml + mapHtmlCourses();
}
function mapHtmlCourses() {
  return catalog.map((c) => {
    const rows = c.rooms.map((r) => {
      const p = roomProgress(r), here = r.slug === room.slug && c.id === course.id;
      const due = r.encounters.some((e) => store.hasReview(e.id));
      return `<button class="maprow${here ? ' here' : ''}" data-goto="${c.id}/${r.slug}"><span class="mt">${r.title}</span><span class="mp">${p.done} / ${p.total}${due ? ' <b class="due">respawn due</b>' : ''}</span><span class="md">${(r.topics || []).slice(0, 4).join(', ')}</span></button>`;
    }).join('');
    return `<h3>${c.region}</h3><div class="maplist">${rows}</div>`;
  }).join('');
}
// ---- formula drawer (left side, also while a problem is open) ----
let codexOpen = false, codexBuiltFor = null;
function codexEntries() {
  const cx = codexByCourse[course.id];
  if (cx) return cx.entries;
  // no hand-made codex: collect every displayed equation of the course's lessons
  const seen = new Set(), out = [];
  for (const r of course.rooms) for (const e of r.encounters) if (e.type === 'lesson') {
    const eqs = e.blocks.filter((b) => b.kind === 'eq' && !seen.has(b.tex)); let n = 0;
    for (const b of eqs) { seen.add(b.tex); n++; out.push({ group: r.title, title: eqs.length > 1 ? `${e.title} (${n})` : e.title, tex: b.tex, meaning: b.label || '', source: e.source?.[0]?.where || '' }); }
  }
  return out;
}
function buildCodex() {
  const entries = codexEntries(), by = {};
  for (const e of entries) (by[e.group] ??= []).push(e);
  const render = (tex) => { try { return katex.renderToString(tex, { displayMode: true, throwOnError: false, strict: 'ignore' }); } catch { return tex; } };
  $('cx-title').textContent = `Formulas: ${course.name}`;
  $('cx-body').innerHTML = `<input id="cx-search" type="text" class="wide" placeholder="search (name, meaning, symbol)" autocomplete="off">` +
    Object.entries(by).map(([g, es]) => `<h3 class="cxg">${M(prettyText(g))}</h3>` + es.map((e) => {
      const q = (e.title + ' ' + (e.meaning || '') + ' ' + e.tex + ' ' + (e.when || '')).toLowerCase().replace(/"/g, '');
      return `<div class="cxe" data-q="${q}"><div class="cxt">${M(prettyText(e.title))}</div>${render(e.tex)}${e.meaning ? `<div class="cxm">${M(prettyText(e.meaning))}</div>` : ''}${M(whereHtml(e.tex, e.group + ' ' + e.title))}${e.when ? `<div class="cxm"><i>When:</i> ${M(e.when)}</div>` : ''}${e.source ? `<div class="src">${e.source}</div>` : ''}</div>`;
    }).join('')).join('');
  const s = $('cx-search'); s.onkeydown = (ev) => { if (ev.key === 'Escape') { closeCodex(); return; } ev.stopPropagation(); }; s.oninput = () => filterCodex(s.value);
  codexBuiltFor = course.id;
}
function filterCodex(q) {
  q = q.trim().toLowerCase();
  document.querySelectorAll('.cxe').forEach((d) => (d.style.display = !q || d.dataset.q.includes(q) ? '' : 'none'));
  document.querySelectorAll('.cxg').forEach((h) => { let n = h.nextElementSibling, any = false; while (n && n.classList.contains('cxe')) { if (n.style.display !== 'none') any = true; n = n.nextElementSibling; } h.style.display = any ? '' : 'none'; });
}
function openCodex() {
  codexOpen = true; if (codexBuiltFor !== course.id) buildCodex();
  $('cx').classList.remove('hidden'); $('cx').scrollLeft = 0; player.unlock();
}
function closeCodex() {
  codexOpen = false; $('cx').classList.add('hidden');
  if (player.enabled && !current && !overlay && !tut) player.lock();
}
function toggleCodex() { codexOpen ? closeCodex() : openCodex(); }

// ================================================================ playback of the QM experiment
function setSpeed(s) { pb.speed = Math.max(0.25, Math.min(4, s)); updateBar(); }
function togglePause() { pb.paused = !pb.paused; updateBar(); }
function toggleLoop() { pb.loop = !pb.loop; updateBar(); }
function replay() {
  if (!view.variant) return;
  const sim = new TunnelSim(view.variant);
  runner = { sim, variant: view.variant, done: null, acc: 0, finished: false, finishedAt: 0 };
  view.sim = sim; world.setSim(sim); pb.paused = false;
  if (current && !tut) { $('side').classList.add('hidden'); if (player.enabled) player.lock(); }
  updateBar();
}
function stepRunner(dt, now) {
  if (!runner) return;
  const { sim } = runner;
  if (!sim.done && !pb.paused) {
    runner.acc += STEPS_PER_SECOND * pb.speed * dt;
    const n = Math.floor(runner.acc); runner.acc -= n;
    for (let i = 0; i < n && !sim.done; i++) sim.step();
    world.updateWave();
  }
  if (sim.done && !runner.finished) {
    runner.finished = true; runner.finishedAt = now;
    if (runner.done) { const cb = runner.done; runner.done = null; player.unlock(); $('side').classList.remove('hidden'); cb(sim); }
    updateBar();
  } else if (sim.done && pb.loop && now - runner.finishedAt > 600) replay();
  const t = $('pb-time'); if (t) t.textContent = `t = ${Math.min(sim.t, sim.tEnd).toFixed(0)} / ${sim.tEnd.toFixed(0)}`;
}
function wirePlaybackBar() {
  $('pb-play').onclick = togglePause; $('pb-replay').onclick = replay; $('pb-loop').onclick = toggleLoop;
  document.querySelectorAll('#pbar [data-sp]').forEach((b) => (b.onclick = () => setSpeed(+b.dataset.sp)));
  $('pb-panel').onclick = () => { if (current) { $('side').classList.remove('hidden'); player.unlock(); } };
}
function updateBar() {
  const bar = $('pbar'); bar.style.display = view.variant ? '' : 'none';
  $('pb-play').textContent = (pb.paused ? 'Play' : 'Pause') + (touch ? '' : ' (Space)');
  $('pb-loop').textContent = `Loop: ${pb.loop ? 'on' : 'off'}`; $('pb-loop').classList.toggle('on', pb.loop);
  document.querySelectorAll('#pbar [data-sp]').forEach((b) => b.classList.toggle('on', +b.dataset.sp === pb.speed));
  $('pb-panel').style.display = current ? '' : 'none';
}

// ================================================================ panel: group list and encounters
function statusOf(enc) { return isLocked(enc) ? 'locked' : store.hasReview(enc.id) ? 'respawn' : store.isPassed(enc.id) ? 'done' : store.isSolved(enc.id) ? 'retry' : 'new'; }
function openGroup(g) {
  closePanel(true); current = { group: g }; player.unlock();
  $('side').classList.remove('hidden');
  const rows = g.items.map((e) => {
    const st = statusOf(e);
    return `<button class="listrow ${st}" data-enc="${e.id}"${st === 'locked' ? ' disabled' : ''}><span class="lt">${e.title}</span><span class="ls">${st === 'locked' ? 'locked' : st}</span><span class="lx">${e.xp || ''}${e.xp ? ' XP' : ''}${e.fight === 'fermi' ? ' · quick' : ''}${e.minutes && e.type === 'boss' ? ` · ${e.minutes} min` : ''}</span></button>`;
  }).join('');
  $('panel').innerHTML = M(`<h2>${g.label}</h2><p class="src">${g.blurb}. Room: ${room.title}.</p>${g.items.some(isLocked) ? '<p class="src">Locked items need an earlier encounter first.</p>' : ''}<div class="list">${rows}</div>`);
  $('panel').querySelectorAll('[data-enc]').forEach((b) => (b.onclick = () => openEncounter(room.encounters.find((e) => e.id === b.dataset.enc), g)));
  updateBar();
}
function openEncounter(enc, fromGroup) {
  closePanel(true);
  const grp = enc.synthetic ? null : fromGroup || groups.find((g) => g.items.includes(enc));
  current = { enc, group: grp }; player.unlock();
  const idx = room.encounters.indexOf(enc);
  const nextEnc = idx < 0 ? null : room.encounters.slice(idx + 1).find((e) => !isLocked(e));
  const env = {
    hasNext: !!nextEnc,
    next: () => openEncounter(nextEnc),
    onChange: refresh,
    flash: (ok) => (ok ? world.successEffect() : world.failEffect()),
    preview: (variant) => {
      runner = null; pb.paused = false;
      const sim = new TunnelSim(variant); view = { variant, sim }; world.setSim(sim); updateBar(); return sim;
    },
    run: (variant, done) => {
      const sim = new TunnelSim(variant);
      view = { variant, sim }; world.setSim(sim);
      runner = { sim, variant, done, acc: 0, finished: false, finishedAt: 0 }; pb.paused = false;
      $('side').classList.add('hidden'); player.lock(); player.faceTarget(0, 0);
      updateBar();
    },
    previewSketch: (e) => {
      runner = null; view = { variant: null, sim: null };
      if (bridgeOn) {
        world.clearSim(); const v = e.vars || {};
        world.setBarrier({ L: v.L ?? 1, V: v.V ?? (v.phi ?? 2) * 2, E: v.E ?? v.phi ?? 1, widthMetres: 0.2 + (v.L ?? 0.3) * 2 });
      }
      updateBar();
    },
    previewBanner: () => { runner = null; view = { variant: null, sim: null }; if (bridgeOn) world.clearSim(); updateBar(); },
  };
  $('side').classList.remove('hidden');
  unmountPanel = mount(enc, $('panel'), env) || null;
  if (grp) {
    const back = document.createElement('button'); back.className = 'link back'; back.textContent = `← ${grp.label} list`;
    back.onclick = () => openGroup(grp); $('panel').prepend(back);
  }
  if (!enc.synthetic) $('panel').prepend(pileBar(enc));
  updateBar();
}
function closePanel(silent) {
  if (unmountPanel) { unmountPanel(); unmountPanel = null; }
  $('panel').innerHTML = ''; $('side').classList.add('hidden');
  if (runner && !runner.finished && !runner.done) { /* a replay keeps running */ }
  else if (runner && runner.done) runner = null; // a first run that was abandoned
  const had = !!current; current = null;
  if (had && !silent && player.enabled) player.lock();
  updateBar();
}

// ================================================================ tutorial (room's own, or a generic intro)
const GENERIC_TUTORIAL = (r) => [
  { title: r.title, look: { x: 0, z: -2 }, html: `<p>${r.intro || ''}</p><p class="src">Behind the gallery you see this room's exhibit: a physical picture of the topic that animates while you stand here.</p>` },
  { title: 'How a room works', look: { x: 0, z: 6.3, pitch: -0.35 }, html: '<p>The consoles in front of you group the room by what you do:</p><ul><li><b>Library</b>: theory and intuition cards, each with check questions (read first).</li><li><b>Quiz hall</b>: exam-style multiple choice, like the first part of the exam.</li><li><b>Derivation desk</b>: "show that" problems you do on paper, then compare step by step.</li><li><b>Fights</b>: calculations with units; hints cost XP.</li><li><b>Boss gate</b>: a real old-exam problem under the timer.</li></ul><p>Wrong or abandoned encounters respawn through the portal (west) after 1, 3, 7, 16 days. <b>M</b> opens the map, <b>B</b> the formula codex.</p>' },
];
function startTutorial() {
  const steps = room.tutorial || GENERIC_TUTORIAL(room);
  closePanel(true); closeOverlay(true);
  tut = { i: 0, steps, savedLoop: pb.loop, savedSpeed: pb.speed, bridge: bridgeOn };
  player.enabled = true; player.unlock(); player.teleport(0, 8.2, 0, 0);
  if (bridgeOn) {
    world.setLabelsVisible(true); pb.loop = true; pb.speed = 1;
    const first = room.encounters.find((e) => e.type === 'predict-observe');
    if (first) { view = { variant: first.variant, sim: null }; replay(); }
  }
  $('tut').style.display = ''; showTutorialStep();
}
function showTutorialStep() {
  const s = tut.steps[tut.i];
  $('tut-title').textContent = s.title; $('tut-body').innerHTML = M(s.html) + (touch ? '<p class="src">On the phone: left stick moves, drag on the view to look, the big button at the bottom right is E, the top buttons replace the keys.</p>' : '');
  $('tut-count').textContent = `${tut.i + 1} / ${tut.steps.length}`;
  $('tut-back').disabled = tut.i === 0; $('tut-next').textContent = tut.i === tut.steps.length - 1 ? 'Start playing' : 'Next';
  if (s.look) player.faceTarget(s.look.x, s.look.z, s.look.pitch ?? 0.02);
  if (tut.bridge) world.focusLabel(s.focus || null);
}
function endTutorial() {
  $('tut').style.display = 'none';
  if (tut.bridge) { world.focusLabel(null); pb.loop = tut.savedLoop; pb.speed = tut.savedSpeed; runner = null; view = { variant: null, sim: null }; world.clearSim(); }
  tut = null; updateBar();
  store.setFlag(`tutorial:${room.id}`); if (inNexus) player.teleport(0, 22, 0, -0.04, 7); else player.teleport(0, 8.0, 0, 0); player.lock();
}
document.addEventListener('click', (e) => {
  if (!tut) return;
  if (e.target.id === 'tut-next') { if (tut.i === tut.steps.length - 1) endTutorial(); else { tut.i++; showTutorialStep(); } }
  if (e.target.id === 'tut-back' && tut.i > 0) { tut.i--; showTutorialStep(); }
  if (e.target.id === 'tut-skip') endTutorial();
});

// ================================================================ landscape (phones): lock the screen sideways, hint in portrait
// The lock only lasts for this visit (it is dropped by a reload) and is never re-applied by itself, so the screen can not get stuck.
async function lockLandscape() {
  try {
    if (!document.fullscreenElement && !matchMedia('(display-mode: fullscreen)').matches) await document.documentElement.requestFullscreen({ navigationUI: 'hide' });
    await screen.orientation.lock('landscape'); toast('Screen locked to landscape. Menu > "Let the screen rotate" frees it again, a reload does too.');
  } catch { toast('This browser would not lock the screen. Turn the phone sideways and switch auto-rotate on.'); }
}
function unlockOrientation(quiet) {
  try { screen.orientation.unlock(); } catch { /* not locked or not supported */ }
  try { if (document.fullscreenElement) document.exitFullscreen(); } catch { /* ignore */ }
  if (!quiet) toast('The screen rotates freely again.');
}
function setupRotateHint() {
  const el = $('rotate-hint'), key = 'physics-rpg-rot-hidden';
  const hidden = () => { try { return sessionStorage.getItem(key) === '1'; } catch { return false; } };
  const update = () => { el.style.display = matchMedia('(orientation: portrait)').matches && !hidden() && !lite ? '' : 'none'; };
  $('rot-lock').onclick = () => { lockLandscape(); };
  $('rot-x').onclick = () => { try { sessionStorage.setItem(key, '1'); } catch { /* ignore */ } update(); };
  addEventListener('resize', update); update();
}
// ================================================================ touch layout helpers
// Both side panels can be open at once: formulas (left / top) and the exercise (right / bottom). CSS lays them out from these body classes.
function watchPanels() {
  const sync = () => {
    for (const [id, cls] of [['side', 'p-side'], ['cx', 'p-cx']]) {
      const el = $(id), open = !el.classList.contains('hidden');
      document.body.classList.toggle(cls, open); if (open) el.scrollLeft = 0;
      if (!open && el.classList.contains('max')) el.classList.remove('max'); // only when set: remove() on an absent class still re-fires the observer
    }
  };
  for (const id of ['cx', 'side', 'nx-card']) $(id).addEventListener('scroll', () => { const e = $(id); if (e.scrollLeft) e.scrollLeft = 0; }, { passive: true }); // no sideways drift of a whole panel
  const mo = new MutationObserver(sync); for (const id of ['side', 'cx']) mo.observe($(id), { attributes: true, attributeFilter: ['class'] });
  for (const [btn, id] of [['side-max', 'side'], ['cx-max', 'cx']]) $(btn).onclick = () => $(id).classList.toggle('max');
  sync();
}
function toggleFullscreen() {
  try { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen({ navigationUI: 'hide' }); } catch { /* ignore */ }
}

// ================================================================ test hooks (used by test/e2e.mjs)
const testHooks = { failFrames: 0 };
function exposeTestApi() {
  window.__game = {
    teleport: (x, z, yaw, pitch) => player.teleport(x, z, yaw, pitch),
    open: (id) => openById(id), openGroup: (key) => openGroup(groups.find((g) => g.key === key)),
    loadRoom: (c, r) => loadRoom(c, r), close: () => closePanel(),
    catalog: () => catalog.map((c) => ({ id: c.id, rooms: c.rooms.map((r) => ({ id: r.slug, encounters: r.encounters.map((e) => ({ id: e.id, type: e.type })) })) })),
    groups: () => groups.map((g) => ({ key: g.key, items: g.items.length })),
    nexusDebug: () => set.links.map((l) => ({ id: l.a.key + '>' + l.b.key, pts: l.curve.points.map((p) => p && [p.x, p.y, p.z]), pulses: l.pulses.map((p) => p.t) })),
    currentRoom: () => `${course.id}/${room.slug}`, enterNexus: () => loadNexus({ silent: true }), nexus: () => (inNexus && set ? { nodes: set.nodes.length, links: set.links.length, focus: set.focus ? (set.focus.node?.key || 'link') : null } : null), flyTo: (x, y, z, yaw = 0, pitch = 0) => player.teleport(x, z, yaw, pitch, y),
    interactNearest: () => { const t = player.target(); if (t) interact(t); return t ? t.id : null; },
    state: () => ({ codex: codexOpen, xp: store.xp, due: store.dueReviews(), running: !!(runner && !runner.finished), panelOpen: !!current, overlay, door: world.doorTarget, pos: player.pos.toArray(), yaw: player.yaw, pitch: player.pitch, prompt: $('prompt').textContent, pb: { ...pb }, tutorial: tut ? tut.i : null }),
    activeSeconds: () => studyToday() + Math.round(studyAcc),
    failFrames: (n) => { testHooks.failFrames = n; }, frames: () => world.renderer.info.render.frame,
    finish: (id, ok, xp) => { finishEncounter(encIndex.get(id).enc, ok, xp); refresh(); }, nextStep: () => { const n = nextRouteStep(); return n ? { key: n.key, enc: n.enc?.id || null } : null; }, quickIds: () => quickIds(), weekStats: () => weekStats(), goal: () => goalInfo(), streak: () => streakNow(),
    setSpeed: (s) => setSpeed(s), sim: () => view.sim, world: () => world, set: () => set, scale: SCALE,
  };
}

boot().catch((e) => { document.body.insertAdjacentHTML('afterbegin', `<pre style="color:#ff6b6b;padding:16px;position:fixed;z-index:9">Failed to start: ${e.stack || e.message}</pre>`); });
