// Catch-up campaign and daily run: the screen that answers "what do I do now?". One tile per lecture week and course
// (done, partly done, open, and where the lecture is), a daily run laid out as a path of stops, and the run summary.
// Logic lives in campaign.js; this file only renders and stores (flags: campaignKnown, campaignSetup, run, runLog).
import { buildWeeks, weekStatus, position, lectureWeek, taughtWeeks, buildRun, catchUpDate } from './campaign.js';
import { todayStr, daysToExam } from './missions.js';
import { fightsToday, enemyOf, spriteSvg } from './battle.js';
import { EST_MIN } from './campaign.js';

const ICON = { warmup: '↻', theory: '▤', sheet: '✎', boss: '⚔' };
const KIND = { warmup: 'Warm-up', theory: 'Theory', sheet: 'Exercise', boss: 'Finisher' };
const LENGTHS = [[20, 'Short'], [45, 'Normal'], [90, 'Long']];
const GHOST = '<svg viewBox="0 0 20 22" width="16" height="18" aria-hidden="true"><path d="M2 21V9a8 8 0 0 1 16 0v12l-3-2.5-2.5 2.5-2.5-2.5L7.5 21 5 18.5Z" fill="currentColor"/><circle cx="7.5" cy="9" r="1.6" fill="#0b0d12"/><circle cx="12.5" cy="9" r="1.6" fill="#0b0d12"/></svg>';
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
    // forks: up to two stops offer a riskier alternative from the same room (a calculation fight or an exam problem) for bonus XP
    let forks = 0;
    for (const s of r.stops) {
      if (forks >= 2 || s.kind === 'warmup' || s.why.startsWith('Due')) continue; // never swap away a respawn or the sheet that is due
      const ref = ctx.encIndex.get(s.id); if (!ref) continue;
      const room = ctx.catalog.find((c) => c.id === ref.course)?.rooms.find((x) => x.slug === ref.roomId); if (!room) continue;
      const want = s.kind === 'boss' ? ['boss'] : ['calc', 'boss'];
      const alt = room.encounters.find((e) => want.includes(e.type) && !e.sim && !e.book && !e.sheet && !passed(e.id) && !ctx.isLockedId(e.id) && !r.stops.some((x) => x.id === e.id || x.alt?.id === e.id));
      if (alt) { s.alt = { id: alt.id, min: EST_MIN[alt.type] || 15, kind: alt.type === 'boss' ? 'boss' : 'sheet', bonus: Math.round((alt.xp || 30) * 0.5) }; forks++; }
    }
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
    let bonus = 0; r.stops.forEach((s, i) => { if (s.risk && st[i] === 'done') bonus += s.bonus || 0; }); if (bonus) store.addXp(bonus); r.bonus = bonus;
    payBosses();
    r.summarized = true; r.xp1 = store.xp; r.behind1 = behindTotal(); r.finishedAt = Date.now(); store.setVal('run', r);
    const log = (store.val('runLog', []) || []).filter((x) => !(x.date === r.date && x.n === r.n)); log.push({ date: r.date, n: r.n, stops: r.stops.length, ok: st.filter((x) => x === 'done').length, xp: r.xp1 - r.xp0 }); store.setVal('runLog', log.slice(-120));
    return true;
  }
  const runsOn = (date) => (store.val('runLog', []) || []).filter((x) => x.date === date).length;
  // Honest streak: only a finished run counts. One missed day per calendar week is bridged by a freeze (nothing to buy or set).
  const weekKey = (d) => { const m = new Date(d); m.setDate(m.getDate() - ((m.getDay() + 6) % 7)); return todayStr(m); };
  function runStreak() {
    let n = 0; const d = new Date(), frozen = new Set(); if (!runsOn(todayStr(d))) d.setDate(d.getDate() - 1);
    for (let guard = 0; guard < 400; guard++) {
      if (runsOn(todayStr(d))) n++;
      else if (n > 0 && !frozen.has(weekKey(d))) { const prev = new Date(d); prev.setDate(prev.getDate() - 1); if (!runsOn(todayStr(prev))) break; frozen.add(weekKey(d)); }
      else break;
      d.setDate(d.getDate() - 1);
    }
    return n;
  }
  // The week (Monday to Sunday): a pip per day with a finished run, and a chest that grows with the number of run days.
  const CHEST = [[3, 'Bronze', 30], [5, 'Silver', 60], [7, 'Gold', 100]];
  function weekInfo() {
    const mon = new Date(weekKey(new Date()) + 'T12:00:00'), days = Array.from({ length: 7 }, (_, i) => { const x = new Date(mon); x.setDate(mon.getDate() + i); return todayStr(x); });
    const done = days.map((x) => runsOn(x) > 0), n = done.filter(Boolean).length, key = days[0], claimed = (store.val('chests', {}) || {})[key] || 0;
    const tier = CHEST.filter(([need]) => n >= need).length; // 0..3
    return { days, done, n, key, claimed, tier, next: CHEST[tier] || null, today: todayStr() };
  }
  function claimChest() { const w = weekInfo(); if (w.tier <= w.claimed) return 0; let xp = 0; for (let i = w.claimed; i < w.tier; i++) xp += CHEST[i][2]; store.addXp(xp); store.setVal('chests', { ...(store.val('chests', {}) || {}), [w.key]: w.tier }); return xp; }
  function weekHtmlRow() {
    const w = weekInfo(), names = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const pips = w.days.map((d, i) => `<span class="cp-pip${w.done[i] ? ' on' : ''}${d === w.today ? ' today' : ''}" title="${d}">${names[i]}</span>`).join('');
    const can = w.tier > w.claimed;
    return `<div class="cp-weekrow"><div class="cp-pips">${pips}</div><span class="src">${w.n} run day${w.n === 1 ? '' : 's'} this week · streak ${runStreak()} (one missed day a week is forgiven)</span>
      <button class="cp-chest${can ? ' ready' : ''}" id="cp-chest" ${can ? '' : 'disabled'} title="Weekly chest: 3 run days bronze, 5 silver, 7 gold">${can ? `Open the ${CHEST[w.tier - 1][1].toLowerCase()} chest` : w.next ? `${CHEST[Math.min(2, w.tier)][1]} chest at ${w.next[0]} run days` : 'Gold chest opened'}</button></div>`;
  }
  // The weekly boss: the sheet that is due next in each course. Its theory is its armour; its open questions are its HP.
  function bosses() {
    const out = [], now = Date.now();
    for (const [cid, sdata] of Object.entries(ctx.sheetsByCourse)) {
      const sh = sdata.sheets.find((x) => { const d = ctx.sheetDue(x); return d && d >= now - 43200000; }); if (!sh) continue;
      const due = ctx.sheetDue(sh), days = Math.ceil((due - now) / 86400000); if (days > 9) continue;
      const w = W()[cid]?.find((x) => x.sheet === sh.n), theory = w ? w.theory : [], qs = sh.questions.map((q) => q.enc.id);
      const paid = (store.val('bossPaid', {}) || {})[`${cid}/${sh.n}`];
      out.push({ cid, sh, due, days, theory, qs, armour: theory.filter((id) => !passed(id)).length, hp: qs.filter((id) => !passed(id)).length, paid, reward: 20 * qs.length });
    }
    return out.sort((a, b) => a.due - b.due);
  }
  function payBosses() { let xp = 0; const paid = { ...(store.val('bossPaid', {}) || {}) }; for (const b of bosses()) if (!b.hp && !b.paid && Date.now() <= +b.due) { paid[`${b.cid}/${b.sh.n}`] = true; xp += b.reward; } if (xp) { store.setVal('bossPaid', paid); store.addXp(xp); } return xp; }
  function bossHtml() {
    const bs = bosses(); if (!bs.length) return '';
    const card = (b) => { const ref = ctx.encIndex.get(b.qs[0]), foe = ref ? spriteSvg({ ...enemyOf(ref.enc, ref.course), elite: true, kind: 'boss' }, 46) : '';
      const when = b.days <= 0 ? 'arrives today' : b.days === 1 ? 'arrives tomorrow' : `arrives in ${b.days} days`;
      const state = !b.hp ? (b.paid ? `defeated before the deadline · +${b.reward} XP paid` : 'defeated') : b.armour ? `armoured: read ${b.armour} theory card${b.armour === 1 ? '' : 's'} to strip it` : 'armour gone: attack';
      return `<div class="cp-boss${!b.hp ? ' dead' : b.days <= 2 ? ' soon' : ''}">${foe}<div class="cp-bossinfo"><b>${ctx.courseName(b.cid)}: the Warden of Sheet ${b.sh.n}</b><span class="src">${when} (${b.due.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}) · ${state}</span>
        <div class="cp-bosshp">${b.qs.map((id) => `<i class="${passed(id) ? 'off' : ''}"></i>`).join('')}${b.theory.map((id) => `<u class="${passed(id) ? 'off' : ''}"></u>`).join('')}</div></div>
        <div class="cp-bossbtn">${b.hp && b.armour ? `<button class="chip btn" data-wopen="${b.theory.find((id) => !passed(id))}">Strip armour</button>` : ''}${b.hp ? `<button class="chip btn" data-wopen="${b.qs.find((id) => !passed(id))}">Attack · +${b.reward} XP if beaten in time</button>` : ''}</div></div>`; };
    return `<div class="cp-bosses"><h3>Weekly bosses</h3>${bs.map(card).join('')}</div>`;
  }


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
    const grades = Object.fromEntries(fightsToday().map((f) => [f.id, f.grade]));
    const foe = (id) => { const ref = ctx.encIndex.get(id); return ref ? spriteSvg(enemyOf(ref.enc, ref.course), 30) : ''; };
    const nodes = r.stops.map((s, i) => { const open = st[i] === 'open';
      const fork = open && s.alt && ctx.encIndex.has(s.alt.id) ? `<button class="cp-alt" data-alt="${i}" title="Swap this stop for ${s.alt.back ? 'the safe one' : 'a harder one from the same room'}"><span class="cp-altk">${s.alt.back ? 'or go back to the safe stop' : `or take the risk · +${s.alt.bonus} XP`}</span><span class="cp-altt">${foe(s.alt.id)} ${esc(title(s.alt.id))}</span></button>` : '';
      return `<div class="cp-stop"><button class="cp-node ${st[i]}${open && st.indexOf('open') === i ? ' next' : ''}${s.risk ? ' risk' : ''}" data-stop="${s.id}" title="${esc(s.why)}"><span class="cp-dot">${st[i] === 'done' ? (grades[s.id] || '✓') : st[i] === 'failed' ? '✗' : open ? foe(s.id) || ICON[s.kind] : ICON[s.kind]}</span><span class="cp-nk">${s.risk ? 'Risk · ' : ''}${KIND[s.kind]}${s.course ? ` · ${cfg.courses[s.course]?.short || ''}` : ''} · ${s.min} min</span><span class="cp-nt">${esc(title(s.id))}</span></button>${fork}</div>`; }).join('<span class="cp-link"></span>');
    const sum = complete && r.summarized ? `<p class="msg good">Run complete: ${st.filter((x) => x === 'done').length} of ${total} passed, ${r.xp1 - r.xp0 >= 0 ? '+' : '−'}${Math.abs(r.xp1 - r.xp0)} XP${r.bonus ? ` (risk bonus +${r.bonus})` : ''}${r.behind0 - r.behind1 > 0 ? `, ${(r.behind0 - r.behind1).toFixed(1)} weeks gained on the ghost` : ''}. ${st.includes('failed') ? 'The missed ones come back as respawns.' : ''}</p>` : '';
    return `<div class="cp-run"><div class="cp-runhead"><div><h3>Today’s run${r.n > 1 ? ` #${r.n}` : ''}</h3><span class="src">${total ? `${done} of ${total} stops · about ${r.est} min · run streak ${runStreak()} day${runStreak() === 1 ? '' : 's'}` : 'nothing open'}</span></div>
      <div class="row">${LENGTHS.map(([m, l]) => `<button class="chip btn${m === mins ? ' cur' : ''}" data-len="${m}" title="Plan a ${m}-minute run">${l} ${m}′</button>`).join('')}</div></div>
      ${weekHtmlRow()}
      ${total ? `<div class="cp-path">${nodes}</div>` : '<p>Every week is done and no respawn is due. Use the exam hall for a timed mock exam.</p>'}${sum}
      <div class="row">${total && !complete ? `<button class="go cp-go" id="cp-start">${r.startedAt ? 'Continue the run' : 'Start the run'} ▶</button>` : ''}${complete ? '<button class="go cp-go" id="cp-again">Plan another run</button>' : ''}</div></div>`;
  }
  function trackHtml(cid) {
    const ws = W()[cid], kn = known()[cid], p = pos(cid), t = taught(), lw = lectureWeek(cfg);
    const tiles = ws.map((w) => { const s = weekStatus(w, passed, kn), cls = s.known ? 'known' : s.done ? 'done' : s.passed ? 'part' : 'open';
      return `<button class="cp-tile ${cls}${w.n <= t && !s.done ? ' dark' : ''}${w.n === lw ? ' now' : ''}${w.n > t ? ' future' : ''}${openWeek === `${cid}/${w.n}` ? ' sel' : ''}${p.next?.n === w.n ? ' you' : ''}" data-week="${cid}/${w.n}" title="Week ${w.n}: ${esc(w.title)}"><i style="height:${Math.round(100 * s.frac)}%"></i><b>${w.n}</b>${w.n === lw ? `<span class="cp-ghost" title="The ghost studies exactly at lecture pace">${GHOST}</span>` : ''}</button>`; }).join('');
    const state = p.behind > 0 ? `<b class="cp-behind">ghost ${p.behind} weeks ahead</b>` : `<b class="cp-ok">level with the ghost</b>`;
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
    const head = `<div class="cp-head"><div><b>${d}</b><span>days to the exams</span></div><div><b>${b}</b><span>weeks behind the ghost (it studies at lecture pace)</span></div><div><b>${b <= 0 ? '✓' : cu.possible ? fmt(cu.date) : '—'}</b><span>${b <= 0 ? 'level with all lectures' : cu.possible ? `level with the lectures at one ${runMinutes()}′ run a day` : 'one short run a day is not enough: pick a longer run'}</span></div></div>`;
    payBosses();
    return `${head}${runHtml()}${bossHtml()}${courses().map(trackHtml).join('')}<p class="src">A week is done when its theory is read and checked and half of its exercises are passed, or when you mark it as done on paper. Tiles fill up with every exercise; dark tiles are weeks the lecture has passed and you have not cleared. The ghost stands on the lecture’s current week${cfg.courses.astrophysics ? '; the astrophysics schedule is an estimate along the textbook chapters' : ''}.</p>`;
  }
  function wire(host, rerender) {
    const re = () => { rerender(); ctx.onChange(); };
    host.querySelectorAll('[data-step]').forEach((b) => (b.onclick = () => { const [c, d] = b.dataset.step.split(':'), el = host.querySelector(`[data-setval="${c}"]`), v = Math.max(0, Math.min(cfg.weeks, +el.dataset.v + +d)); el.dataset.v = v; el.textContent = `week ${v}`; host.querySelector(`[data-setnote="${c}"]`).textContent = v >= taught() ? 'up to date' : `${taught() - v} week${taught() - v === 1 ? '' : 's'} behind`; }));
    host.querySelectorAll('[data-setval]').forEach((el) => { const v = +el.dataset.v; host.querySelector(`[data-setnote="${el.dataset.setval}"]`).textContent = v >= taught() ? 'up to date' : `${taught() - v} week${taught() - v === 1 ? '' : 's'} behind`; });
    const okb = host.querySelector('#cp-setup-ok'); if (okb) okb.onclick = () => { const k = {}; host.querySelectorAll('[data-setval]').forEach((el) => { k[el.dataset.setval] = Array.from({ length: +el.dataset.v }, (_, i) => i + 1); }); store.setVal('campaignKnown', k); store.setVal('campaignSetup', true); store.setVal('run', null); re(); };
    host.querySelectorAll('[data-len]').forEach((b) => (b.onclick = () => { newRun(+b.dataset.len); re(); }));
    const ch = host.querySelector('#cp-chest'); if (ch) ch.onclick = () => { const xp = claimChest(); if (xp) ctx.toast(`Weekly chest: +${xp} XP`); re(); };
    const st = host.querySelector('#cp-start'); if (st) st.onclick = () => startRun();
    const ag = host.querySelector('#cp-again'); if (ag) ag.onclick = () => { newRun(runMinutes()); re(); };
    host.querySelectorAll('[data-stop]').forEach((b) => (b.onclick = () => { const r = run(); if (!r.startedAt) { r.startedAt = Date.now(); r.xp0 = store.xp; r.behind0 = behindTotal(); store.setVal('run', r); } ctx.openQueue(r.stops.map((s) => s.id), 'Today’s run', b.dataset.stop); }));
    host.querySelectorAll('[data-alt]').forEach((b) => (b.onclick = () => { const r = run(), i = +b.dataset.alt, s = r.stops[i], a = s.alt; r.stops[i] = a.back ? { ...a.orig } : { ...s, id: a.id, kind: a.kind, min: a.min, bonus: a.bonus, risk: true, alt: { id: s.id, back: true, orig: { ...s } }, why: 'You took the risk: a harder problem from the same room, for bonus XP' }; r.est = r.stops.reduce((x, y) => x + y.min, 0); store.setVal('run', r); re(); }));
    host.querySelectorAll('[data-week]').forEach((b) => (b.onclick = () => { openWeek = openWeek === b.dataset.week ? null : b.dataset.week; rerender(); }));
    host.querySelectorAll('[data-wopen]').forEach((b) => (b.onclick = () => ctx.openQueue([b.dataset.wopen], '', b.dataset.wopen)));
    const setKnown = (cid, list) => { const k = { ...knownRaw(), [cid]: list }; store.setVal('campaignKnown', k); store.setVal('run', null); re(); };
    host.querySelectorAll('[data-known]').forEach((b) => (b.onclick = () => { const [cid, n] = b.dataset.known.split('/'), cur = new Set(knownRaw()[cid] || []); cur.has(+n) ? cur.delete(+n) : cur.add(+n); setKnown(cid, [...cur].sort((a, c) => a - c)); }));
    host.querySelectorAll('[data-knownto]').forEach((b) => (b.onclick = () => { const [cid, n] = b.dataset.knownto.split('/'); setKnown(cid, [...new Set([...(knownRaw()[cid] || []), ...Array.from({ length: +n }, (_, i) => i + 1)])].sort((a, c) => a - c)); }));
  }
  // Is this room part of a week the lecture has already passed and you have not cleared? (drives the room's "overrun" look)
  function roomOverdue(cid, slug) {
    const ws = W()[cid]; if (!ws) return false; const kn = known()[cid], t = taught();
    return ws.some((w) => w.n <= t && !weekStatus(w, passed, kn).done && [...w.theory, ...w.practice].some((id) => ctx.encIndex.get(id)?.roomId === slug));
  }
  return { html, wire, startRun, onProgress, roomOverdue, weekInfo, runStreak, bosses, payBosses, chipText, behindText, startLine, runInfo, behindTotal, isSetup, position: pos, weeks: W, reset: () => { weeks = null; } };
}
