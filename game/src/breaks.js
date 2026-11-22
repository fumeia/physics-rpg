// Breaks: about every 35 minutes of active study a small card offers a break of 5, 10 or 15 minutes (or "later": asks again after 10 more
// minutes of study). A break runs on the wall clock (flags.breakNow = {s, end, m}), so it keeps counting down while the game or the laptop
// is closed; when the game opens again it shows the rest, or books the break if it is over. Every break taken is logged in
// flags.breakLog [{s, e, m}] (start, end in ms, planned minutes): a log, so the sync merges it from several devices without losing one.
// Break time is its own statistic: the heatmap day and the stats show it, and deploy/questboard_sync.py sends each break to Questboard as a
// session of kind "break" (Questboard keeps breaks out of focus and goal time).
import { store } from './store.js';

const EVERY = 35 * 60, SNOOZE = 10 * 60, CHOICES = [5, 10, 15];
let ctx = null, nextAt = 0, tick = 0;
const $ = (id) => document.getElementById(id);
const fmt = (ms) => { const s = Math.max(0, Math.ceil(ms / 1000)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
const dayOf = (ms) => { const d = new Date(ms); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };

export const onBreak = () => { const b = store.val('breakNow', null); return !!(b && b.end > Date.now()); };
export const breakLog = () => store.val('breakLog', []) || [];
// seconds of break on a day (YYYY-MM-DD, local time), counting a running break up to now
export function breakSecondsOn(day) {
  let ms = breakLog().filter((x) => dayOf(x.s) === day).reduce((a, x) => a + Math.max(0, x.e - x.s), 0);
  const b = store.val('breakNow', null); if (b && dayOf(b.s) === day) ms += Math.max(0, Math.min(Date.now(), b.end) - b.s);
  return Math.round(ms / 1000);
}
export const breaksOn = (day) => breakLog().filter((x) => dayOf(x.s) === day).length;

function ensureDom() {
  if ($('brk-offer')) return;
  const o = document.createElement('div'); o.id = 'brk-offer'; o.setAttribute('role', 'dialog');
  o.innerHTML = `<div class="brk-t"><b>Time for a break?</b><span id="brk-why"></span></div><div class="brk-row">${CHOICES.map((m) => `<button class="chip btn" data-brk="${m}">${m} min</button>`).join('')}<button class="chip btn brk-later" data-brk="later">Later</button></div>`;
  document.body.append(o);
  const v = document.createElement('div'); v.id = 'brk-view';
  v.innerHTML = `<div class="brk-card"><div class="brk-h">Break</div><div class="brk-clock" id="brk-clock">0:00</div><p id="brk-tip"></p><p class="src">The clock keeps running if you close the game or the laptop.</p><div class="brk-row"><button class="chip btn" id="brk-more">+5 min</button><button class="go" id="brk-end">End break</button></div></div>`;
  document.body.append(v);
  // while the break runs, game keys do nothing (the break view is in front of the game)
  document.addEventListener('keydown', (e) => { if (v.classList.contains('on')) { e.stopPropagation(); if (e.code === 'Space' || e.code.startsWith('Arrow')) e.preventDefault(); } }, true);
  o.querySelectorAll('[data-brk]').forEach((b) => (b.onclick = () => { const k = b.dataset.brk; hideOffer(); if (k === 'later') nextAt = ctx.studySeconds() + SNOOZE; else start(+k); }));
  $('brk-end').onclick = () => finish(Date.now());
  $('brk-more').onclick = () => { const b = store.val('breakNow', null); if (b) { store.setVal('breakNow', { ...b, end: b.end + 5 * 60e3, m: b.m + 5 }); render(); } };
}
const TIPS = ['Stand up, stretch, look out of the window: far focus relaxes the eyes.', 'Drink a glass of water.', 'Walk a few steps. No phone, let the brain file what you just did.',
  'Breathe slowly: 4 in, 6 out, a few times.', 'Shoulders down, neck loose. Then a short walk.'];
function showOffer() {
  ensureDom(); const min = Math.round((ctx.studySeconds() - (store.val('breakAfter', 0) || 0)) / 60);
  $('brk-why').textContent = ` ${Math.max(35, min)} minutes of focused work. A short break keeps the next block sharp.`;
  $('brk-offer').classList.add('on'); try { document.exitPointerLock?.(); } catch { /* ignore */ }
}
const hideOffer = () => $('brk-offer')?.classList.remove('on');

function start(m) {
  const now = Date.now(); store.setVal('breakNow', { s: now, end: now + m * 60e3, m });
  $('brk-tip').textContent = TIPS[Math.floor(Math.random() * TIPS.length)];
  ctx.onStart?.(); render();
}
// book the break that ran from b.s to `at` (never past its planned end) and close the view
function finish(at) {
  const b = store.val('breakNow', null); if (!b) return;
  const e = Math.max(b.s, Math.min(at, b.end));
  store.setVal('breakLog', [...breakLog(), { s: b.s, e, m: b.m }].slice(-1000));
  store.setVal('breakNow', null); store.setVal('breakAfter', ctx.studySeconds());
  nextAt = ctx.studySeconds() + EVERY; $('brk-view')?.classList.remove('on');
  ctx.onEnd?.(Math.round((e - b.s) / 60e3), at >= b.end);
}
function render() {
  const b = store.val('breakNow', null); if (!b) { $('brk-view')?.classList.remove('on'); return; }
  ensureDom(); $('brk-view').classList.add('on'); hideOffer();
  if (!$('brk-tip').textContent) $('brk-tip').textContent = TIPS[0];
  const left = b.end - Date.now();
  if (left <= 0) { finish(b.end); return; }
  $('brk-clock').textContent = fmt(left);
}

// ctx: { studySeconds(): active study seconds today, onStart(), onEnd(minutes, full) }
export function initBreaks(c) {
  ctx = c; ensureDom();
  const after = store.val('breakAfter', 0) || 0, s = ctx.studySeconds();
  nextAt = (after && after <= s ? after : s) + EVERY; // a new day starts at 0 study seconds
  render(); // a break that ran while the game was closed: the rest, or booked if over
  clearInterval(tick); tick = setInterval(() => { if (store.val('breakNow', null)) render(); }, 500);
  window.addEventListener('store-replaced', render);
}
// called often while studying (main.js): offer a break once enough focused time has passed since the last one
export function checkBreak() {
  if (!ctx || onBreak() || $('brk-offer')?.classList.contains('on')) return;
  const s = ctx.studySeconds(); if (s < nextAt - EVERY) nextAt = s + EVERY; // new day: the count restarts
  if (s >= nextAt) { nextAt = s + SNOOZE; showOffer(); }
}
