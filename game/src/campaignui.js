// Catch-up campaign and daily run: the screen that answers "what do I do now?". One tile per lecture week and course
// (done, partly done, open, and where the lecture is), a daily run laid out as a path of stops, and the run summary.
// Logic lives in campaign.js; this file only renders and stores (flags: campaignKnown, campaignSetup, run, runLog).
import { buildWeeks, weekStatus, position, lectureWeek, taughtWeeks, buildRun, catchUpDate } from './campaign.js';
import { todayStr, daysToExam } from './missions.js';
import { fightsToday, enemyOf, spriteSvg, gradeBook } from './battle.js';
import { EST_MIN } from './campaign.js';
import { meanRetention, fading, forecast } from './memory.js';

const ACT_ICON = { hunt: '\u2620', explain: '\u275d', blitz: '\u26a1' };
const ICON = { forge: '\u2692', scout: '\u2609', hunt: '\u2620', explain: '\u275d', blitz: '\u26a1', warmup: '\u21bb', theory: '\u25a4', sheet: '\u270e', boss: '\u2694', defend: '\u26e8' };
const KIND = { forge: 'Forge', scout: 'Scout', hunt: 'Mistake hunt', explain: 'Explain it', blitz: 'Blitz', warmup: 'Warm-up', theory: 'Theory', sheet: 'Exercise', boss: 'Finisher', defend: 'Defend' };
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
  const skim = () => Object.fromEntries(Object.entries(store.val('campaignSkim', {}) || {}).map(([k, v]) => [k, new Set(v)]));
  const mem = () => store.val('mem', {}) || {};
  // exam weight of a week, 0..1: how often its rooms' topics came up in old exams (content/radar.json)
  function weekWeight(cid, w) {
    const rooms = new Set([...w.theory, ...w.practice].map((id) => ctx.encIndex.get(id)?.roomId).filter(Boolean)); let best = 0, any = false;
    for (const t of ctx.radar()) if (t.course === cid && (t.rooms || []).some((r) => rooms.has(r))) { any = true; best = Math.max(best, t.of ? t.count / t.of : 0); }
    return any ? best : 0.5; // no data: treat as average
  }
  const weekMemory = (w) => meanRetention([...w.theory, ...w.practice].filter(passed), mem(), store.snapshot.solved);
  // rematch ladder: fights you won with help (grade B or C) come back after a week to be won clean
  const rematchIds = () => Object.entries(gradeBook()).filter(([id, v]) => ['B', 'C'].includes(v.g) && Date.now() - v.t > 7 * 86400000 && ctx.encIndex.has(id) && passed(id)).sort((a, b) => a[1].t - b[1].t).map(([id]) => id);
  function fadingIds() { const ids = [...rematchIds()]; if (ids.length) return ids.concat(fadingOnly()).filter((x, i, a) => a.indexOf(x) === i); return fadingOnly(); }
  function fadingOnly() { const ids = []; for (const cid of courses()) for (const w of W()[cid]) ids.push(...w.theory, ...w.practice); return fading(ids.filter((id) => passed(id) && !ctx.isLockedId(id)), mem(), store.snapshot.solved).map((x) => x.id); }
  function grades() {
    return courses().map((cid) => { const c = ctx.catalog.find((x) => x.id === cid), bossIds = c.rooms.flatMap((r) => r.encounters.filter((e) => e.type === 'boss').map((e) => e.id));
      const f = forecast({ weeks: W()[cid].map((w) => ({ ids: [...w.theory, ...w.practice], weight: 0.4 + weekWeight(cid, w), credit: known()[cid]?.has(w.n) ? 0.6 : 0 })), isPassed: passed, mem: mem(), solved: store.snapshot.solved, bossIds }); return { cid, ...f }; });
  }
  const taught = () => taughtWeeks(cfg);
  const courses = () => Object.keys(W());
  const pos = (cid) => position(W()[cid], passed, known()[cid], taught(), skim()[cid]);
  const behindTotal = () => +courses().reduce((s, c) => s + pos(c).behind, 0).toFixed(1);
  const isSetup = () => !!store.val('campaignSetup', false);
  const runMinutes = () => store.val('runMinutes', 45);
  const title = (id) => { const e = ctx.encIndex.get(id)?.enc; return e ? String(e.title || id).replace(/<[^>]+>/g, '') : id; };

  // ---- the run of today (kept for the day so that reopening shows the same path and its progress)
  // Hand-ins first, per course: on means the sheet that is due within three days jumps the queue of the run. The default is on
  // unless you are more than three weeks behind in that course (then the theory for the new sheet is missing anyway).
  const handIn = (cid) => { const v = (store.val('handIn', {}) || {})[cid]; return v === undefined ? pos(cid).behind <= 3 : !!v; };
  function dueSoon() { // the sheet with the nearest due date within 3 days, if it still has open questions
    let best = null; const now = Date.now();
    for (const [cid, s] of Object.entries(ctx.sheetsByCourse)) for (const sh of (handIn(cid) ? s.sheets : [])) { const d = ctx.sheetDue(sh); if (!d || d < now - 43200000 || d - now > 3 * 86400000) continue; const ids = sh.questions.map((q) => q.enc.id).filter((id) => !passed(id)); if (ids.length && (!best || d < best.d)) best = { d, course: cid, ids }; }
    return best;
  }
  function freshRun(minutes = runMinutes()) {
    const rv = store.snapshot.reviews || {}, due = store.dueReviews().filter((id) => ctx.encIndex.has(id)).sort((a, b) => (rv[a].due || 0) - (rv[b].due || 0));
    const r = buildRun({ weeks: W(), isPassed: passed, known: known(), taught: taught(), due, minutes, encOf: (id) => ctx.encIndex.get(id)?.enc, isLocked: ctx.isLockedId, dueSoon: dueSoon(), skim: skim(), defend: fadingIds() });
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
    // scouting: for a course where you are (nearly) level, preview the first lesson of the coming lecture week, so the lecture is revision
    for (const cid of courses()) { const p = pos(cid), w = W()[cid].find((x) => x.n === taught() + 1); if (!w || p.behind > 1 || r.minutes + 10 > minutes + 5) continue;
      const id = w.theory.find((x) => !passed(x) && !ctx.isLockedId(x) && ctx.encIndex.get(x)?.enc.type === 'lesson' && !r.stops.some((s) => s.id === x)); if (id) { r.stops.push({ id, kind: 'scout', course: cid, min: 10, why: `Scouting week ${w.n}: a first look before the lecture, so the lecture becomes revision` }); r.minutes += 10; break; } }
    // guided practice (the study hub inside the run): a blitz to warm up when nothing is due, a mistake hunt, an explain-it round
    const act = (id, kind, action, why, at) => r.stops.splice(at, 0, { id, kind, action, min: 5, why });
    if (!r.stops.some((s) => s.kind === 'warmup' || s.kind === 'defend') && r.stops.length) act('@blitz', 'blitz', 'drills', 'Nothing is due: one minute of quick recall to warm up', 0);
    const openM = ctx.mistakes().filter((m) => m.open).length; if (openM && minutes >= 40) act('@hunt', 'hunt', 'mistakes', `${openM} open mistake${openM === 1 ? '' : 's'} in your log: look at one and say what went wrong`, Math.min(1, r.stops.length));
    const fd = ctx.forgeDue(); if (fd) act('@forge', 'forge', 'forge', `QM by heart: ${fd} formula${fd === 1 ? '' : 's'} due in the Forge (write from memory, two minutes)`, Math.min(1, r.stops.length));
    const ti = r.stops.findIndex((s) => s.kind === 'theory'); if (ti >= 0 && minutes >= 40) act('@explain', 'explain', 'feynman', 'Explain what you just read in your own words, without looking', ti + 1);
    r.minutes = r.stops.reduce((a, s) => a + s.min, 0);
    return { date: todayStr(), minutes, stops: r.stops, est: r.minutes, startedAt: 0, xp0: store.xp, behind0: behindTotal(), n: (() => { const pr = store.val('run', null); return pr?.date === todayStr() ? (pr.n || 1) + (pr.summarized ? 1 : 0) : 1; })() };
  }
  function run() { let r = store.val('run', null); if (!r || r.date !== todayStr()) { r = freshRun(); r.n = 1; store.setVal('run', r); } return r; }
  function stopState(r, s) { // done / failed today since the run started, else open
    if (s.action) return r.acted?.[s.id] ? 'done' : 'open'; // practice stops count once you opened them
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
    const nx = r.stops[st.indexOf('open')]; if (nx.action) { doAction(nx); return; }
    ctx.openQueue(r.stops.filter((s) => !s.action).map((s) => s.id), `Today\u2019s run`, nx.id);
  }
  function doAction(s) { const r = run(); if (!r.startedAt) { r.startedAt = Date.now(); r.xp0 = store.xp; r.behind0 = behindTotal(); } r.acted = { ...(r.acted || {}), [s.id]: Date.now() }; store.setVal('run', r); ctx.openTab(s.action); ctx.toast(`${KIND[s.kind]}: ${s.why}. Press G to go on with the run.`); onProgress(); ctx.onChange(); }
  function newRun(minutes) { store.setVal('runMinutes', minutes); const r = freshRun(minutes); store.setVal('run', r); }
  // called after every finished exercise: when the last stop of the run is finished, log it and show the summary once
  function onProgress() {
    settleDungeon();
    const r = store.val('run', null); if (!r || r.date !== todayStr() || !r.startedAt || r.summarized) return false;
    const st = r.stops.map((s) => stopState(r, s)); if (!st.every((x) => x !== 'open')) return false;
    let bonus = 0; r.stops.forEach((s, i) => { if (s.risk && st[i] === 'done') bonus += s.bonus || 0; }); if (bonus) store.addXp(bonus); r.bonus = bonus;
    payBosses(); settleDungeon();
    // resonance: two stops of this run sit in rooms that a cross-course connection links
    const roomsDone = new Set(r.stops.filter((s, i) => !s.action && st[i] === 'done').map((s) => { const ref = ctx.encIndex.get(s.id); return ref ? `${ref.course}/${ref.roomId}` : ''; }));
    const res = ctx.links().find((l) => roomsDone.has(l.a) && roomsDone.has(l.b)); if (res) { r.resonance = { title: res.title, a: res.a, b: res.b }; store.addXp(15); }
    r.summarized = true; r.xp1 = store.xp; r.behind1 = behindTotal(); r.finishedAt = Date.now(); store.setVal('run', r);
    const log = (store.val('runLog', []) || []).filter((x) => !(x.date === r.date && x.n === r.n)); log.push({ date: r.date, n: r.n, stops: r.stops.length, ok: st.filter((x) => x === 'done').length, xp: r.xp1 - r.xp0, gain: +(r.behind0 - r.behind1).toFixed(2) }); store.setVal('runLog', log.slice(-120));
    return true;
  }
  // Your measured pace: weeks gained on the ghost per day with a run, from the last runs (needs three finished runs).
  function pace() {
    const log = (store.val('runLog', []) || []).filter((x) => typeof x.gain === 'number'); if (log.length < 3) return null;
    const byDay = {}; for (const x of log) byDay[x.date] = (byDay[x.date] || 0) + x.gain;
    const days = Object.keys(byDay).sort().slice(-7); return { perDay: days.reduce((a, d) => a + byDay[d], 0) / days.length, runs: log.length };
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
    const ms = ctx.missions(), msDone = ms.filter((m) => m.done).length;
    const gains = (store.val('runLog', []) || []).filter((x) => w.days.includes(x.date) && typeof x.gain === 'number').reduce((a, x) => a + x.gain, 0), dayNo = w.days.indexOf(w.today) + 1;
    const goals = ms.length ? `<div class="cp-goals"><span class="src">Bonus goals today (${msDone}/${ms.length}):</span>${ms.map((m) => `<button class="chip btn${m.done ? ' ok' : ''}" data-goal>${m.done ? '\u2713 ' : ''}${esc(m.title)}</button>`).join('')}</div><div class="src">This week the ghost moved ${(dayNo * 3 / 7).toFixed(1)} weeks, you gained ${gains.toFixed(1)}.</div>` : '';
    return `${goals}<div class="cp-weekrow"><div class="cp-pips">${pips}</div><span class="src">${w.n} run day${w.n === 1 ? '' : 's'} this week · streak ${runStreak()} (one missed day a week is forgiven)</span>
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
  function behindText() { if (!isSetup()) return 'set it up first'; const b = behindTotal(); return b > 0 ? `${b} weeks behind` : 'level with the lectures'; }
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
      return `<div class="cp-stop"><button class="cp-node ${s.kind} ${st[i]}${open && st.indexOf('open') === i ? ' next' : ''}${s.risk ? ' risk' : ''}" data-stop="${s.id}" title="${esc(s.why)}"><span class="cp-dot">${st[i] === 'done' ? (grades[s.id] || '✓') : st[i] === 'failed' ? '✗' : open && !s.action ? foe(s.id) || ICON[s.kind] : ICON[s.kind]}</span><span class="cp-nk">${s.risk ? 'Risk · ' : ''}${KIND[s.kind]}${s.course ? ` · ${cfg.courses[s.course]?.short || ''}` : ''} · ${s.min} min</span><span class="cp-nt">${s.action ? esc(s.why) : esc(title(s.id))}</span></button>${fork}</div>`; }).join('<span class="cp-link"></span>');
    const sum = complete && r.summarized ? `<p class="msg good">Run complete: ${st.filter((x) => x === 'done').length} of ${total} passed, ${r.xp1 - r.xp0 >= 0 ? '+' : '−'}${Math.abs(r.xp1 - r.xp0)} XP${r.bonus ? ` (risk bonus +${r.bonus})` : ''}${r.behind0 - r.behind1 > 0 ? `, ${(r.behind0 - r.behind1).toFixed(1)} weeks gained on the ghost` : ''}. ${st.includes('failed') ? 'The missed ones come back as respawns.' : ''}</p>${r.resonance ? `<p class="msg good">Resonance (+15 XP): <b>${esc(r.resonance.title)}</b> \u2014 two stops of this run are the same physics in two courses. <button class="link" data-reso="${r.resonance.a}">show the connection</button></p>` : ''}` : '';
    return `<div class="cp-run"><div class="cp-runhead"><div><h3>Today’s run${r.n > 1 ? ` #${r.n}` : ''}</h3><span class="src">${total ? `${done} of ${total} stops · about ${r.est} min · run streak ${runStreak()} day${runStreak() === 1 ? '' : 's'}` : 'nothing open'}</span></div>
      <div class="row">${LENGTHS.map(([m, l]) => `<button class="chip btn${m === mins ? ' cur' : ''}" data-len="${m}" title="Plan a ${m}-minute run">${l} ${m}′</button>`).join('')}</div></div>
      ${weekHtmlRow()}
      ${total ? `<div class="cp-path">${nodes}</div>` : '<p>Every week is done and no respawn is due. Use the exam hall for a timed mock exam.</p>'}${sum}
      <div class="row">${total && !complete ? `<button class="go cp-go" id="cp-start">${r.startedAt ? 'Continue the run' : 'Start the run'} ▶</button>` : ''}${complete ? '<button class="go cp-go" id="cp-again">Plan another run</button>' : ''}</div></div>`;
  }
  function trackHtml(cid) {
    const ws = W()[cid], kn = known()[cid], p = pos(cid), t = taught(), lw = lectureWeek(cfg);
    const tiles = ws.map((w) => { const s = weekStatus(w, passed, kn, skim()[cid]), wm = weekMemory(w), fade = s.done && !s.known && wm !== null && wm < 0.6, wt = weekWeight(cid, w), cls = (s.known ? 'known' : s.done ? 'done' : s.passed ? 'part' : 'open') + (fade ? ' fade' : '') + (s.skim ? ' skim' : '') + (wt >= 0.6 ? ' hot' : '');
      return `<button class="cp-tile ${cls}${w.n <= t && !s.done ? ' dark' : ''}${w.n === lw ? ' now' : ''}${w.n > t ? ' future' : ''}${openWeek === `${cid}/${w.n}` ? ' sel' : ''}${p.next?.n === w.n ? ' you' : ''}" data-week="${cid}/${w.n}" title="Week ${w.n}: ${esc(w.title)}${fade ? ` \u00b7 fading: about ${Math.round(100 * wm)}% remembered` : ''}${wt >= 0.6 ? ' \u00b7 often in old exams' : wt < 0.25 ? ' \u00b7 rare in old exams' : ''}"><i style="height:${Math.round(100 * s.frac)}%"></i><b>${w.n}</b>${w.n === lw ? `<span class="cp-ghost" title="The ghost studies exactly at lecture pace">${GHOST}</span>` : ''}</button>`; }).join('');
    const state = p.behind > 0 ? `<b class="cp-behind">ghost ${p.behind} weeks ahead</b>` : `<b class="cp-ok">level with the ghost</b>`;
    return `<div class="cp-course"><div class="cp-chead"><h3>${ctx.courseName(cid)}</h3><span>${state} · you: ${p.next ? `in week ${p.next.n}` : 'all 14 weeks done'} · lecture: week ${lw}</span>${ctx.sheetsByCourse[cid] ? `<button class="chip btn cp-hand${handIn(cid) ? ' cur' : ''}" data-hand="${cid}" title="On: the sheet due within three days comes first in the run. Off: strict catch-up, oldest open week first; the due sheet stays visible as the weekly boss.">Hand-ins first: ${handIn(cid) ? 'on' : 'off'}</button>` : ''}</div><div class="cp-track">${tiles}</div>${openWeek?.startsWith(cid + '/') ? weekHtml(cid, +openWeek.split('/')[1]) : ''}</div>`;
  }
  function weekHtml(cid, n) {
    const w = W()[cid].find((x) => x.n === n), s = weekStatus(w, passed, known()[cid], skim()[cid]), wt = weekWeight(cid, w), wm = weekMemory(w);
    const exam = wt >= 0.6 ? 'often in old exams: do it properly' : wt < 0.25 ? 'rare in old exams: a good week to skim if time is short' : 'sometimes in old exams';
    const row = (id) => { const e = ctx.encIndex.get(id)?.enc; return `<div class="maprow"><button class="link" data-wopen="${id}"><span class="mt">${passed(id) ? '✓' : store.hasReview(id) ? '↻' : '○'} ${esc(title(id))}</span></button><span class="src">${e?.sheet ? 'sheet question' : e?.type || ''}</span></div>`; };
    return `<div class="cp-week"><div class="cp-whead"><b>Week ${n}: ${esc(w.title)}</b><span class="src">${exam}${wm !== null ? ` \u00b7 about ${Math.round(100 * wm)}% remembered` : ''} \u00b7 ${s.known ? 'marked as done on paper' : s.skim ? 'skim: done when the theory is read' : s.done ? 'done' : `${s.passed} of ${s.total} passed · done when the theory and half of the exercises are passed`}</span></div>
      ${w.theory.length ? `<div class="src">Read and check</div>${w.theory.map(row).join('')}` : ''}${w.practice.length ? `<div class="src">${w.sheet ? `Sheet ${w.sheet}` : 'Exercises'}</div>${w.practice.map(row).join('')}` : ''}${s.empty ? '<p class="src">Nothing in the game for this week yet.</p>' : ''}
      <div class="row"><button class="chip btn" data-known="${cid}/${n}">${s.known ? 'Not done after all: unmark this week' : 'I did this week on paper: mark as done'}</button>${s.known ? '' : `<button class="chip btn" data-knownto="${cid}/${n}">Mark weeks 1\u2013${n} as done</button>`}${s.known ? '' : `<button class="chip btn${s.skim ? ' cur' : ''}" data-skim="${cid}/${n}" title="Triage: the week counts as done once its theory is read; its exercises are left out of the run">${s.skim ? 'Skimming this week: undo' : 'Only skim this week (theory, no exercises)'}</button>`}</div></div>`;
  }
  function html() {
    if (!isSetup()) return setupHtml();
    const b = behindTotal(), pc = pace(), d = daysToExam(), net = pc ? pc.perDay - 3 / 7 : 0; // the ghost moves 3 course-weeks per 7 days
    const cu = { possible: !!pc && net > 0, date: pc && net > 0 ? new Date(Date.now() + Math.ceil(b / net) * 86400000) : null };
    const fmt = (x) => x.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
    const gr = grades(), short = (c) => cfg.courses[c]?.short || c;
    const head = `<div class="cp-head cp-head4"><div><b>${d}</b><span>days to the exams</span></div><div title="A rough forecast on the scale 1 to 6 (4 passes): how much of the exam-weighted material you have passed, how much of it you probably still remember, and old-exam problems passed. It falls when you stop."><b class="cp-grades">${gr.map((g) => `<span class="${g.grade >= 4 ? 'ok' : ''}">${g.grade.toFixed(2).replace(/0$/, '')}</span>`).join(' ')}</b><span>grade forecast: ${gr.map((g) => short(g.cid)).join(' \u00b7 ')}</span></div><div><b>${b}</b><span>weeks behind the ghost (it studies at lecture pace)</span></div><div><b>${b <= 0 ? '✓' : cu.possible ? fmt(cu.date) : '—'}</b><span>${b <= 0 ? 'level with all lectures' : !pc ? 'catch-up date: shown after three finished runs, from your real pace' : cu.possible ? `level with the lectures at your pace of the last runs (${pc.perDay.toFixed(2)} weeks gained per run day)` : `at your pace of the last runs (${pc.perDay.toFixed(2)} weeks per run day) the ghost pulls away: longer runs or two a day`}</span></div></div>`;
    payBosses();
    settleDungeon();
    return `${head}${runHtml()}${bossHtml()}${courses().map(trackHtml).join('')}${dungeonHtml()}<p class="src">A week is done when its theory is read and checked and half of its exercises are passed, or when you mark it as done on paper. Tiles fill up with every exercise; dark tiles are weeks the lecture has passed and you have not cleared. The ghost stands on the lecture’s current week${cfg.courses.astrophysics ? '; the astrophysics schedule is an estimate along the textbook chapters' : ''}.</p>`;
  }
  function wire(host, rerender) {
    const re = () => { rerender(); ctx.onChange(); };
    host.querySelectorAll('[data-step]').forEach((b) => (b.onclick = () => { const [c, d] = b.dataset.step.split(':'), el = host.querySelector(`[data-setval="${c}"]`), v = Math.max(0, Math.min(cfg.weeks, +el.dataset.v + +d)); el.dataset.v = v; el.textContent = `week ${v}`; host.querySelector(`[data-setnote="${c}"]`).textContent = v >= taught() ? 'up to date' : `${taught() - v} week${taught() - v === 1 ? '' : 's'} behind`; }));
    host.querySelectorAll('[data-setval]').forEach((el) => { const v = +el.dataset.v; host.querySelector(`[data-setnote="${el.dataset.setval}"]`).textContent = v >= taught() ? 'up to date' : `${taught() - v} week${taught() - v === 1 ? '' : 's'} behind`; });
    const okb = host.querySelector('#cp-setup-ok'); if (okb) okb.onclick = () => { const k = {}; host.querySelectorAll('[data-setval]').forEach((el) => { k[el.dataset.setval] = Array.from({ length: +el.dataset.v }, (_, i) => i + 1); }); store.setVal('campaignKnown', k); store.setVal('campaignSetup', true); store.setVal('run', null); re(); };
    host.querySelectorAll('[data-len]').forEach((b) => (b.onclick = () => { newRun(+b.dataset.len); re(); }));
    host.querySelectorAll('[data-goal]').forEach((b) => (b.onclick = () => ctx.openMissions()));
    const ch = host.querySelector('#cp-chest'); if (ch) ch.onclick = () => { const xp = claimChest(); if (xp) ctx.toast(`Weekly chest: +${xp} XP`); re(); };
    const st = host.querySelector('#cp-start'); if (st) st.onclick = () => startRun();
    const ag = host.querySelector('#cp-again'); if (ag) ag.onclick = () => { newRun(runMinutes()); re(); };
    host.querySelectorAll('[data-reso]').forEach((b) => (b.onclick = () => ctx.openConnection(b.dataset.reso)));
    host.querySelectorAll('[data-stop]').forEach((b) => (b.onclick = () => { const r = run(); const as = r.stops.find((s) => s.id === b.dataset.stop && s.action); if (as) { doAction(as); return; } if (!r.startedAt) { r.startedAt = Date.now(); r.xp0 = store.xp; r.behind0 = behindTotal(); store.setVal('run', r); } ctx.openQueue(r.stops.filter((s) => !s.action).map((s) => s.id), 'Today\u2019s run', b.dataset.stop); }));
    host.querySelectorAll('[data-alt]').forEach((b) => (b.onclick = () => { const r = run(), i = +b.dataset.alt, s = r.stops[i], a = s.alt; r.stops[i] = a.back ? { ...a.orig } : { ...s, id: a.id, kind: a.kind, min: a.min, bonus: a.bonus, risk: true, alt: { id: s.id, back: true, orig: { ...s } }, why: 'You took the risk: a harder problem from the same room, for bonus XP' }; r.est = r.stops.reduce((x, y) => x + y.min, 0); store.setVal('run', r); re(); }));
    host.querySelectorAll('[data-dungeon]').forEach((b) => (b.onclick = () => enterDungeon(b.dataset.dungeon)));
    const dl = host.querySelector('#cp-dleave'); if (dl) dl.onclick = () => { leaveDungeon(); re(); };
    host.querySelectorAll('[data-skim]').forEach((b) => (b.onclick = () => { const [cid, n] = b.dataset.skim.split('/'), raw = store.val('campaignSkim', {}) || {}, cur = new Set(raw[cid] || []); cur.has(+n) ? cur.delete(+n) : cur.add(+n); store.setVal('campaignSkim', { ...raw, [cid]: [...cur] }); const pr = store.val('run', null); if (!pr?.startedAt) store.setVal('run', null); re(); }));
    host.querySelectorAll('[data-hand]').forEach((b) => (b.onclick = () => { const c = b.dataset.hand; store.setVal('handIn', { ...(store.val('handIn', {}) || {}), [c]: !handIn(c) }); const pr = store.val('run', null); if (!pr?.startedAt) store.setVal('run', null); re(); }));
    host.querySelectorAll('[data-week]').forEach((b) => (b.onclick = () => { openWeek = openWeek === b.dataset.week ? null : b.dataset.week; rerender(); }));
    host.querySelectorAll('[data-wopen]').forEach((b) => (b.onclick = () => ctx.openQueue([b.dataset.wopen], '', b.dataset.wopen)));
    const setKnown = (cid, list) => { const k = { ...knownRaw(), [cid]: list }; store.setVal('campaignKnown', k); store.setVal('run', null); re(); };
    host.querySelectorAll('[data-known]').forEach((b) => (b.onclick = () => { const [cid, n] = b.dataset.known.split('/'), cur = new Set(knownRaw()[cid] || []); cur.has(+n) ? cur.delete(+n) : cur.add(+n); setKnown(cid, [...cur].sort((a, c) => a - c)); }));
    host.querySelectorAll('[data-knownto]').forEach((b) => (b.onclick = () => { const [cid, n] = b.dataset.knownto.split('/'); setKnown(cid, [...new Set([...(knownRaw()[cid] || []), ...Array.from({ length: +n }, (_, i) => i + 1)])].sort((a, c) => a - c)); }));
  }
  // ---- exam dungeon: your armour per exam topic (holes = no practice or forgotten), and a gauntlet of old-exam problems
  const coreOf = (cid, slugs) => (ctx.catalog.find((c) => c.id === cid)?.rooms || []).filter((r) => slugs.includes(r.slug)).flatMap((r) => r.encounters.filter((e) => !e.book && !e.sim && !e.sheet && e.type !== 'sandbox'));
  function armour(cid) {
    return ctx.radar().filter((t) => t.course === cid).sort((a, b) => b.count / (b.of || 1) - a.count / (a.of || 1)).map((t) => {
      const es = coreOf(cid, t.rooms || []), p = es.filter((e) => passed(e.id)), kept = meanRetention(p.map((e) => e.id), mem(), store.snapshot.solved) ?? 0;
      const exam = es.filter((e) => e.type === 'boss'), examP = exam.filter((e) => passed(e.id)).length;
      return { label: t.label, freq: t.of ? t.count / t.of : 0, count: t.count, of: t.of, total: es.length, strength: es.length ? (p.length / es.length) * kept : 0, exam: exam.length, examP, none: !es.length, rooms: t.rooms || [] };
    });
  }
  const dungeon = () => store.val('dungeon', null);
  function dungeonState() { const d = dungeon(); if (!d) return null; const log = ((store.snapshot.flags || {}).activity || []).filter((x) => x.t >= d.startedAt - 1000); const st = d.ids.map((id) => { const h = log.filter((x) => x.id === id).pop(); return h ? (h.ok ? 'done' : 'failed') : 'open'; }); return { d, st, over: st.every((x) => x !== 'open'), left: Math.max(0, d.minutes * 60000 - (Date.now() - d.startedAt)) }; }
  function enterDungeon(cid) {
    const bosses = coreOf(cid, (ctx.catalog.find((c) => c.id === cid)?.rooms || []).map((r) => r.slug)).filter((e) => e.type === 'boss' && !ctx.isLockedId(e.id));
    const wt = (e) => { const room = ctx.encIndex.get(e.id)?.roomId; return Math.max(0, ...ctx.radar().filter((t) => t.course === cid && (t.rooms || []).includes(room)).map((t) => (t.of ? t.count / t.of : 0))); };
    const pick = bosses.sort((a, b) => (passed(a.id) - passed(b.id)) || (wt(b) - wt(a))).slice(0, 3); if (!pick.length) { ctx.toast('No exam problems available for this course yet.'); return; }
    store.setVal('dungeon', { cid, ids: pick.map((e) => e.id), startedAt: Date.now(), minutes: pick.reduce((a, e) => a + (+e.minutes || 30), 0), paid: false }); ctx.setDungeon(true);
    ctx.openQueue(pick.map((e) => e.id), 'Exam dungeon', pick[0].id);
  }
  function settleDungeon() { const s = dungeonState(); if (!s || !s.over || s.d.paid) return; const won = s.st.filter((x) => x === 'done').length; store.setVal('dungeon', { ...s.d, paid: true, finishedAt: Date.now() }); if (won) store.addXp(40 * won); ctx.setDungeon(false); }
  function leaveDungeon() { store.setVal('dungeon', null); ctx.setDungeon(false); }
  function dungeonHtml() {
    const s = dungeonState(), dec = new Date(new Date().getFullYear(), 11, 15), early = Date.now() < +dec && new Date().getMonth() >= 8;
    const active = s && !s.d.paid ? `<div class="cp-boss soon"><div class="cp-bossinfo"><b>In the dungeon: ${ctx.courseName(s.d.cid)}</b><span class="src">${s.st.filter((x) => x === 'done').length} of ${s.d.ids.length} cleared \u00b7 ${Math.ceil(s.left / 60000)} min left of ${s.d.minutes} \u00b7 no hints, no cards</span></div><div class="cp-bossbtn">${s.st.includes('open') ? `<button class="chip btn" data-wopen="${s.d.ids[s.st.indexOf('open')]}">Continue</button>` : ''}<button class="chip btn" id="cp-dleave">Leave the dungeon</button></div></div>` : '';
    const last = s && s.d.paid ? `<p class="msg ${s.st.filter((x) => x === 'done').length >= 2 ? 'good' : 'bad'}">Last dungeon (${ctx.courseName(s.d.cid)}): ${s.st.filter((x) => x === 'done').length} of ${s.d.ids.length} exam problems cleared in ${Math.round(((s.d.finishedAt || Date.now()) - s.d.startedAt) / 60000)} of ${s.d.minutes} min.</p>` : '';
    const col = (cid) => { const a = armour(cid); if (!a.length) return '';
      return `<div class="cp-arm"><div class="cp-armhead"><b>${ctx.courseName(cid)}</b><button class="chip btn" data-dungeon="${cid}">Enter: 3 exam problems, timed, no hints</button></div>${a.slice(0, 8).map((t) => `<div class="cp-armrow${t.none ? ' none' : t.strength < 0.3 ? ' hole' : ''}" title="${esc(t.label)}: in ${t.count} of ${t.of} old exams \u00b7 ${t.none ? 'no practice in the game yet' : `${Math.round(100 * t.strength)}% armour (passed and still remembered) \u00b7 exam problems ${t.examP}/${t.exam}`}"><span class="cp-armlabel">${esc(t.label)}</span><span class="cp-armfreq">${t.count}/${t.of}</span><span class="cp-armbar"><i style="width:${Math.round(100 * t.strength)}%"></i></span><span class="cp-armx">${t.none ? 'no practice' : t.strength < 0.3 ? 'hole' : ''}</span></div>`).join('')}</div>`; };
    return `<div class="cp-dungeon"><h3>Exam dungeon and armour</h3><p class="src">Your armour per exam topic: how much of it you passed and still remember. The number is how many old exams had the topic. Holes are where the exam would hit you.${early ? ' The dungeon is meant for the weeks from 15 December; you can enter early.' : ''}</p>${active}${last}<div class="cp-arms">${courses().map(col).join('')}</div></div>`;
  }
  // What the notifier on the server needs (deploy/notify.py reads flags.campaignStat): no logic is duplicated there.
  function stat() {
    if (!isSetup()) return { setup: false };
    const { r, st, done, total, complete } = runInfo(), b = bosses()[0], w = weekInfo();
    const per = Object.fromEntries(courses().map((c) => [c, pos(c).behind]));
    return { setup: true, date: todayStr(), behind: per, total: behindTotal(), fading: fadingOnly().length,
      run: { stops: total, done, min: r.stops.filter((s, i) => st[i] === 'open').reduce((a, s) => a + s.min, 0), complete, started: !!r.startedAt },
      runDays: w.n, runStreak: runStreak(), chestAt: w.next ? w.next[0] : null,
      boss: b ? { course: b.cid, n: b.sh.n, due: todayStr(b.due), hp: b.hp, armour: b.armour, reward: b.reward } : null,
      grades: Object.fromEntries(grades().map((g) => [g.cid, g.grade])) };
  }
  // Is this room part of a week the lecture has already passed and you have not cleared? (drives the room's "overrun" look)
  function roomOverdue(cid, slug) {
    const ws = W()[cid]; if (!ws) return false; const kn = known()[cid], t = taught();
    return ws.some((w) => w.n <= t && !weekStatus(w, passed, kn, skim()[cid]).done && [...w.theory, ...w.practice].some((id) => ctx.encIndex.get(id)?.roomId === slug));
  }
  return { html, wire, startRun, onProgress, roomOverdue, stat, armour, dungeonState, settleDungeon, pace, handIn, grades, fadingIds, weekInfo, runStreak, bosses, payBosses, chipText, behindText, startLine, runInfo, behindTotal, isSetup, position: pos, weeks: W, reset: () => { weeks = null; } };
}
