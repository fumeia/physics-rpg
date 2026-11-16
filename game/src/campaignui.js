// Catch-up campaign and daily run: the screen that answers "what do I do now?". One tile per lecture week and course
// (done, partly done, open, and where the lecture is), a daily run laid out as a path of stops, and the run summary.
// Logic lives in campaign.js; this file only renders and stores (flags: campaignKnown, campaignSetup, run, runLog).
import { buildWeeks, weekStatus, position, lectureWeek, taughtWeeks, buildRun, catchUpDate } from './campaign.js';
import { todayStr, daysToExam } from './missions.js';

const ICON = { warmup: '↻', theory: '▤', sheet: '✎', boss: '⚔' };
const KIND = { warmup: 'Warm-up', theory: 'Theory', sheet: 'Exercise', boss: 'Finisher' };
const LENGTHS = [[20, 'Short'], [45, 'Normal'], [90, 'Long']];
const esc = (s) => String(s).replace(/</g, '&lt;');

export function createCampaign(ctx) {
  // ctx: { cfg, store, catalog, sheetsByCourse, encIndex, isLockedId, openQueue(ids, label, startId), toast, courseName(id),
  //        sheetDue(sheet) -> Date|null, M(html) -> html, onChange() }
  const { cfg, store } = ctx;
  let weeks = null, openWeek = null; // openWeek: 'course/n' whose detail is unfolded
  const W = () => (weeks ||= buildWeeks(cfg, ctx.catalog, ctx.sheetsByCourse));
  const passed = (id) => store.isPassed(id);
  const knownRaw = () => store.val('campaignKnown', {}) || {};
  const known = () => Object.fromEntries(Object.entries(knownRaw()).map(([k, v]) => [k, new Set(v)]));
  const taught = () => taughtWeeks(cfg);
  const courses = () => Object.keys(W());
  const pos = (cid) => position(W()[cid], passed, known()[cid], taught());
  const behindTotal = () => +courses().reduce((s, c) => s + pos(c).behind, 0).toFixed(1);
  const isSetup = () => !!store.val('campaignSetup', false);
  const runMinutes = () => store.val('runMinutes', 45);
  const title = (id) => { const e = ctx.encIndex.get(id)?.enc; return e ? String(e.title || id).replace(/<[^>]+>/g, '') : id; };

  // ---- the run of today (kept for the day so that reopening shows the same path and its progress)
  function dueSoon() { // the sheet with the nearest due date within 3 days, if it still has open questions
    let best = null; const now = Date.now();
    for (const [cid, s] of Object.entries(ctx.sheetsByCourse)) for (const sh of s.sheets) { const d = ctx.sheetDue(sh); if (!d || d < now - 43200000 || d - now > 3 * 86400000) continue; const ids = sh.questions.map((q) => q.enc.id).filter((id) => !passed(id)); if (ids.length && (!best || d < best.d)) best = { d, course: cid, ids }; }
    return best;
  }
  function freshRun(minutes = runMinutes()) {
    const rv = store.snapshot.reviews || {}, due = store.dueReviews().filter((id) => ctx.encIndex.has(id)).sort((a, b) => (rv[a].due || 0) - (rv[b].due || 0));
    const r = buildRun({ weeks: W(), isPassed: passed, known: known(), taught: taught(), due, minutes, encOf: (id) => ctx.encIndex.get(id)?.enc, isLocked: ctx.isLockedId, dueSoon: dueSoon() });
    return { date: todayStr(), minutes, stops: r.stops, est: r.minutes, startedAt: 0, xp0: store.xp, behind0: behindTotal(), n: (store.val('run', null)?.date === todayStr() ? (store.val('run').n || 1) : 0) + 1 };
  }
  function run() { let r = store.val('run', null); if (!r || r.date !== todayStr()) { r = freshRun(); r.n = 1; store.setVal('run', r); } return r; }
  function stopState(r, s) { // done / failed today since the run started, else open
    if (!r.startedAt) return 'open';
    const hit = store.activityOn(todayStr()).filter((x) => x.id === s.id && x.t >= r.startedAt - 1000).pop();
    return hit ? (hit.ok ? 'done' : 'failed') : 'open';
  }
  const runInfo = () => { const r = run(), st = r.stops.map((s) => stopState(r, s)); return { r, st, done: st.filter((x) => x !== 'open').length, total: r.stops.length, complete: r.stops.length > 0 && st.every((x) => x !== 'open') }; };
  function startRun() {
    if (!isSetup()) { ctx.openCampaign(); return; }
    const { r, st, complete } = runInfo();
    if (!r.stops.length) { ctx.toast('Nothing open for today: every week is done and no respawn is due. Try the exam hall.'); return; }
    if (complete) { ctx.openCampaign(); return; }
    if (!r.startedAt) { r.startedAt = Date.now(); r.xp0 = store.xp; r.behind0 = behindTotal(); store.setVal('run', r); }
    const ids = r.stops.map((s) => s.id), first = r.stops[st.indexOf('open')].id;
    ctx.openQueue(ids, `Today’s run`, first);
  }
  function newRun(minutes) { store.setVal('runMinutes', minutes); const r = freshRun(minutes); store.setVal('run', r); }
  // called after every finished exercise: when the last stop of the run is finished, log it and show the summary once
  function onProgress() {
    const r = store.val('run', null); if (!r || r.date !== todayStr() || !r.startedAt || r.summarized) return false;
    const st = r.stops.map((s) => stopState(r, s)); if (!st.every((x) => x !== 'open')) return false;
    r.summarized = true; r.xp1 = store.xp; r.behind1 = behindTotal(); r.finishedAt = Date.now(); store.setVal('run', r);
    const log = (store.val('runLog', []) || []).filter((x) => !(x.date === r.date && x.n === r.n)); log.push({ date: r.date, n: r.n, stops: r.stops.length, ok: st.filter((x) => x === 'done').length, xp: r.xp1 - r.xp0 }); store.setVal('runLog', log.slice(-120));
    return true;
  }
  const runsOn = (date) => (store.val('runLog', []) || []).filter((x) => x.date === date).length;
  function runStreak() { let n = 0; const d = new Date(); if (!runsOn(todayStr(d))) d.setDate(d.getDate() - 1); while (runsOn(todayStr(d))) { n++; d.setDate(d.getDate() - 1); } return n; }

  // ---- text for the HUD chips and the start screen
  function chipText() { const { done, total, complete } = runInfo(); return !isSetup() ? '▶ Set up your campaign' : complete ? `✓ Run done · again?` : total ? `▶ Today’s run ${done}/${total}` : '✓ Nothing due'; }
  function behindText() { const b = behindTotal(); return b > 0 ? `${b} weeks behind` : 'level with the lectures'; }
  function startLine() {
    if (!isSetup()) return 'First step: tell the game where you are in each course (one tap).';
    const { r, done, total, complete } = runInfo();
    const worst = courses().map((c) => ({ c, p: pos(c) })).sort((a, b) => b.p.behind - a.p.behind)[0];
    return `${complete ? 'Today’s run is done.' : total ? `Today’s run: ${total - done} stop${total - done === 1 ? '' : 's'} left, about ${Math.max(5, r.stops.filter((s, i) => stopState(r, s) === 'open').reduce((a, s) => a + s.min, 0))} min.` : 'Nothing due today.'} ${worst.p.behind > 0 ? `${ctx.courseName(worst.c)}: ${worst.p.behind} weeks behind.` : 'You are level with the lectures.'}`;
  }

  // ---- rendering
  function setupHtml() {
    const t = taught();
    return `<div class="cp-setup callout"><div class="ctitle">Where are you really?</div><p>The lectures have covered <b>${t} weeks</b>. For each course, set the last week you have already worked through (on paper or in the game). The game then starts you right after it and never makes you redo those weeks. You can change this later by clicking a week.</p>
      ${courses().map((c) => { const def = Math.max(0, t - (cfg.courses[c].defaultBehind ?? 0)); return `<div class="cp-setrow"><b>${ctx.courseName(c)}</b><button class="chip btn" data-step="${c}:-1">−</button><span class="cp-setval" data-setval="${c}" data-v="${def}">week ${def}</span><button class="chip btn" data-step="${c}:1">+</button><span class="src" data-setnote="${c}"></span></div>`; }).join('')}
      <div class="row"><button class="go" id="cp-setup-ok">Start my campaign</button></div></div>`;
  }
  function runHtml() {
    const { r, st, done, total, complete } = runInfo(), mins = runMinutes();
    const nodes = r.stops.map((s, i) => `<button class="cp-node ${st[i]}${st[i] === 'open' && st.indexOf('open') === i ? ' next' : ''}" data-stop="${s.id}" title="${esc(s.why)}"><span class="cp-dot">${st[i] === 'done' ? '✓' : st[i] === 'failed' ? '✗' : ICON[s.kind]}</span><span class="cp-nk">${KIND[s.kind]}${s.course ? ` · ${cfg.courses[s.course]?.short || ''}` : ''} · ${s.min} min</span><span class="cp-nt">${esc(title(s.id))}</span></button>`).join('<span class="cp-link"></span>');
    const sum = complete && r.summarized ? `<p class="msg good">Run complete: ${st.filter((x) => x === 'done').length} of ${total} passed, ${r.xp1 - r.xp0 >= 0 ? '+' : '−'}${Math.abs(r.xp1 - r.xp0)} XP${r.behind0 - r.behind1 > 0 ? `, ${(r.behind0 - r.behind1).toFixed(1)} weeks caught up` : ''}. ${st.includes('failed') ? 'The missed ones come back as respawns.' : ''}</p>` : '';
    return `<div class="cp-run"><div class="cp-runhead"><div><h3>Today’s run${r.n > 1 ? ` #${r.n}` : ''}</h3><span class="src">${total ? `${done} of ${total} stops · about ${r.est} min · run streak ${runStreak()} day${runStreak() === 1 ? '' : 's'}` : 'nothing open'}</span></div>
      <div class="row">${LENGTHS.map(([m, l]) => `<button class="chip btn${m === mins ? ' cur' : ''}" data-len="${m}" title="Plan a ${m}-minute run">${l} ${m}′</button>`).join('')}</div></div>
      ${total ? `<div class="cp-path">${nodes}</div>` : '<p>Every week is done and no respawn is due. Use the exam hall for a timed mock exam.</p>'}${sum}
      <div class="row">${total && !complete ? `<button class="go cp-go" id="cp-start">${r.startedAt ? 'Continue the run' : 'Start the run'} ▶</button>` : ''}${complete ? '<button class="go cp-go" id="cp-again">Plan another run</button>' : ''}</div></div>`;
  }
  function trackHtml(cid) {
    const ws = W()[cid], kn = known()[cid], p = pos(cid), t = taught(), lw = lectureWeek(cfg);
    const tiles = ws.map((w) => { const s = weekStatus(w, passed, kn), cls = s.known ? 'known' : s.done ? 'done' : s.passed ? 'part' : 'open';
      return `<button class="cp-tile ${cls}${w.n === lw ? ' now' : ''}${w.n > t ? ' future' : ''}${openWeek === `${cid}/${w.n}` ? ' sel' : ''}${p.next?.n === w.n ? ' you' : ''}" data-week="${cid}/${w.n}" title="Week ${w.n}: ${esc(w.title)}"><i style="height:${Math.round(100 * s.frac)}%"></i><b>${w.n}</b></button>`; }).join('');
    const state = p.behind > 0 ? `<b class="cp-behind">${p.behind} weeks behind</b>` : `<b class="cp-ok">level with the lecture</b>`;
    return `<div class="cp-course"><div class="cp-chead"><h3>${ctx.courseName(cid)}</h3><span>${state} · you: ${p.next ? `in week ${p.next.n}` : 'all 14 weeks done'} · lecture: week ${lw}</span></div><div class="cp-track">${tiles}</div>${openWeek?.startsWith(cid + '/') ? weekHtml(cid, +openWeek.split('/')[1]) : ''}</div>`;
  }
  function weekHtml(cid, n) {
    const w = W()[cid].find((x) => x.n === n), s = weekStatus(w, passed, known()[cid]);
    const row = (id) => { const e = ctx.encIndex.get(id)?.enc; return `<div class="maprow"><button class="link" data-wopen="${id}"><span class="mt">${passed(id) ? '✓' : store.hasReview(id) ? '↻' : '○'} ${esc(title(id))}</span></button><span class="src">${e?.sheet ? 'sheet question' : e?.type || ''}</span></div>`; };
    return `<div class="cp-week"><div class="cp-whead"><b>Week ${n}: ${esc(w.title)}</b><span class="src">${s.known ? 'marked as done on paper' : s.done ? 'done' : `${s.passed} of ${s.total} passed · done when the theory and half of the exercises are passed`}</span></div>
      ${w.theory.length ? `<div class="src">Read and check</div>${w.theory.map(row).join('')}` : ''}${w.practice.length ? `<div class="src">${w.sheet ? `Sheet ${w.sheet}` : 'Exercises'}</div>${w.practice.map(row).join('')}` : ''}${s.empty ? '<p class="src">Nothing in the game for this week yet.</p>' : ''}
      <div class="row"><button class="chip btn" data-known="${cid}/${n}">${s.known ? 'Not done after all: unmark this week' : 'I did this week on paper: mark as done'}</button>${s.known ? '' : `<button class="chip btn" data-knownto="${cid}/${n}">Mark weeks 1–${n} as done</button>`}</div></div>`;
  }
  function html() {
    if (!isSetup()) return setupHtml();
    const b = behindTotal(), r = run(), newStops = Math.max(1, r.stops.filter((s) => s.kind === 'theory' || s.kind === 'sheet').length), cu = catchUpDate(b, newStops / 4.5, 1), d = daysToExam();
    const fmt = (x) => x.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
    const head = `<div class="cp-head"><div><b>${d}</b><span>days to the exams</span></div><div><b>${b}</b><span>weeks behind in total</span></div><div><b>${b <= 0 ? '✓' : cu.possible ? fmt(cu.date) : '—'}</b><span>${b <= 0 ? 'level with all lectures' : cu.possible ? `level with the lectures at one ${runMinutes()}′ run a day` : 'one short run a day is not enough: pick a longer run'}</span></div></div>`;
    return `${head}${runHtml()}${courses().map(trackHtml).join('')}<p class="src">A week is done when its theory is read and checked and half of its exercises are passed, or when you mark it as done on paper. Tiles fill up with every exercise. The frame marks the lecture’s current week${cfg.courses.astrophysics ? '; the astrophysics schedule is an estimate along the textbook chapters' : ''}.</p>`;
  }
  function wire(host, rerender) {
    const re = () => { rerender(); ctx.onChange(); };
    host.querySelectorAll('[data-step]').forEach((b) => (b.onclick = () => { const [c, d] = b.dataset.step.split(':'), el = host.querySelector(`[data-setval="${c}"]`), v = Math.max(0, Math.min(cfg.weeks, +el.dataset.v + +d)); el.dataset.v = v; el.textContent = `week ${v}`; host.querySelector(`[data-setnote="${c}"]`).textContent = v >= taught() ? 'up to date' : `${taught() - v} week${taught() - v === 1 ? '' : 's'} behind`; }));
    host.querySelectorAll('[data-setval]').forEach((el) => { const v = +el.dataset.v; host.querySelector(`[data-setnote="${el.dataset.setval}"]`).textContent = v >= taught() ? 'up to date' : `${taught() - v} week${taught() - v === 1 ? '' : 's'} behind`; });
    const okb = host.querySelector('#cp-setup-ok'); if (okb) okb.onclick = () => { const k = {}; host.querySelectorAll('[data-setval]').forEach((el) => { k[el.dataset.setval] = Array.from({ length: +el.dataset.v }, (_, i) => i + 1); }); store.setVal('campaignKnown', k); store.setVal('campaignSetup', true); store.setVal('run', null); re(); };
    host.querySelectorAll('[data-len]').forEach((b) => (b.onclick = () => { newRun(+b.dataset.len); re(); }));
    const st = host.querySelector('#cp-start'); if (st) st.onclick = () => startRun();
    const ag = host.querySelector('#cp-again'); if (ag) ag.onclick = () => { newRun(runMinutes()); re(); };
    host.querySelectorAll('[data-stop]').forEach((b) => (b.onclick = () => { const r = run(); if (!r.startedAt) { r.startedAt = Date.now(); r.xp0 = store.xp; r.behind0 = behindTotal(); store.setVal('run', r); } ctx.openQueue(r.stops.map((s) => s.id), 'Today’s run', b.dataset.stop); }));
    host.querySelectorAll('[data-week]').forEach((b) => (b.onclick = () => { openWeek = openWeek === b.dataset.week ? null : b.dataset.week; rerender(); }));
    host.querySelectorAll('[data-wopen]').forEach((b) => (b.onclick = () => ctx.openQueue([b.dataset.wopen], '', b.dataset.wopen)));
    const setKnown = (cid, list) => { const k = { ...knownRaw(), [cid]: list }; store.setVal('campaignKnown', k); store.setVal('run', null); re(); };
    host.querySelectorAll('[data-known]').forEach((b) => (b.onclick = () => { const [cid, n] = b.dataset.known.split('/'), cur = new Set(knownRaw()[cid] || []); cur.has(+n) ? cur.delete(+n) : cur.add(+n); setKnown(cid, [...cur].sort((a, c) => a - c)); }));
    host.querySelectorAll('[data-knownto]').forEach((b) => (b.onclick = () => { const [cid, n] = b.dataset.knownto.split('/'); setKnown(cid, [...new Set([...(knownRaw()[cid] || []), ...Array.from({ length: +n }, (_, i) => i + 1)])].sort((a, c) => a - c)); }));
  }
  return { html, wire, startRun, onProgress, chipText, behindText, startLine, runInfo, behindTotal, isSetup, position: pos, weeks: W, reset: () => { weeks = null; } };
}
