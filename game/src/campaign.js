// Catch-up campaign and daily run (pure logic, no DOM): which lecture week the semester is in, which weeks of each course
// are done, how far behind you are, and what today's run should contain. Tested by test/campaign-check.mjs.
//
// A week of a course has `theory` (lessons, quizzes, derivations: read and check) and `practice` (sheet questions, or book
// exercises and calculation fights where a course has no sheets). A week counts as done when it was marked "known" (done on
// paper, outside the game) or when all its theory and at least half of its practice are passed.
const DAY = 86400000;
export const EST_MIN = { lesson: 10, quiz: 8, derive: 15, calc: 15, lab: 12, 'predict-observe': 10, boss: 30, sandbox: 5 };
const THEORY = new Set(['lesson', 'quiz']);

// The lecture week the semester is in (1-based), and the number of weeks whose material has been fully taught.
export function lectureWeek(cfg, now = Date.now()) { return Math.max(1, Math.min(cfg.weeks, Math.floor((now - Date.parse(cfg.start + 'T00:00:00')) / (7 * DAY)) + 1)); }
export function taughtWeeks(cfg, now = Date.now()) { return Math.max(0, Math.min(cfg.weeks, Math.floor((now - Date.parse(cfg.start + 'T00:00:00')) / (7 * DAY)))); }

// Build the weeks of every course. catalog: [{id, rooms: [{slug, encounters}]}], sheetsByCourse: {id: {sheets}}.
export function buildWeeks(cfg, catalog, sheetsByCourse) {
  const out = {};
  for (const c of catalog) {
    const cc = cfg.courses[c.id]; if (!cc) continue;
    const byId = new Map(); for (const r of c.rooms) for (const e of r.encounters) byId.set(e.id, { enc: e, room: r.slug });
    const used = new Set(), weeks = [];
    const take = (id, w, bucket) => { const ref = byId.get(id); if (!ref || used.has(id) || ref.enc.reading) return; used.add(id); w[bucket].push(id); };
    // guided-reading cards (enc.reading, enc.week): their own bucket, so they never decide whether a week is done
    const readingOf = (n) => [...byId.values()].filter((r) => r.enc.reading && r.enc.week === n).map((r) => r.enc.id).sort();
    const pinned = new Set(Object.values(cc.pin || {}).flat());
    for (let n = 1; n <= cfg.weeks; n++) {
      const w = { n, title: cc.titles?.[n] || '', theory: [], practice: [], sheet: null, reading: readingOf(n) };
      const sh = cc.sheets ? sheetsByCourse[c.id]?.sheets.find((s) => s.n === n) : null;
      for (const id of cc.pin?.[n] || []) take(id, w, 'theory');
      if (sh) {
        w.sheet = n; if (!w.title) w.title = sh.title;
        for (const q of sh.questions) for (const id of q.related || []) { const t = byId.get(id)?.enc.type; if (THEORY.has(t) && !pinned.has(id)) take(id, w, 'theory'); }
        for (const q of sh.questions) take(q.enc.id, w, 'practice');
      }
      for (const id of cc.extra?.[n] || []) take(id, w, THEORY.has(byId.get(id)?.enc.type) ? 'theory' : 'practice');
      for (const spec of cc.rooms?.[n] || []) {
        const [slug, half] = spec.split(':'), room = c.rooms.find((r) => r.slug === slug); if (!room) continue;
        const pick = (list) => (half ? (half === 'a' ? list.slice(0, Math.ceil(list.length / 2)) : list.slice(Math.ceil(list.length / 2))) : list);
        if (!w.title) w.title = room.title + (half ? (half === 'a' ? ' (part 1)' : ' (part 2)') : '');
        for (const e of pick(room.encounters.filter((x) => THEORY.has(x.type)))) take(e.id, w, 'theory');
        for (const e of pick(room.encounters.filter((x) => x.type === 'derive' && !x.sim && !x.book))) take(e.id, w, 'practice');
        for (const e of pick(room.encounters.filter((x) => x.type === 'calc' && !x.sim))) take(e.id, w, 'practice');
      }
      if (!w.title) w.title = `Week ${n}`;
      weeks.push(w);
    }
    // every other card of the course gets a week too, so nothing is missed: the week its room first appears in (a room that no
    // week names follows the room before it). Old-exam problems (boss) go to w.exam, the rest to w.extra. Neither decides
    // whether a week is done; the runs mix them in and the finish plan counts them.
    const roomWeek = new Map();
    for (const w of weeks) for (const id of [...w.theory, ...w.practice]) { const r = byId.get(id)?.room; if (r && !roomWeek.has(r)) roomWeek.set(r, w.n); }
    for (const w of weeks) { w.extra = []; w.exam = []; }
    let last = 1;
    for (const r of c.rooms) {
      if (roomWeek.has(r.slug)) last = roomWeek.get(r.slug);
      const w = weeks[(roomWeek.get(r.slug) ?? last) - 1]; if (!w) continue;
      for (const e of r.encounters) {
        if (used.has(e.id) || e.reading || e.type === 'sandbox' || e.sim || e.sheet || (e.book && !e.sheet) || e.synthetic) continue;
        used.add(e.id); (e.type === 'boss' ? w.exam : w.extra).push(e.id);
      }
    }
    out[c.id] = weeks;
  }
  return out;
}

// Status of one week. isPassed(id) -> bool, known: Set of week numbers marked as done outside the game.
// skim: Set of week numbers you decided to only skim (triage): such a week is done when its theory is passed, without exercises.
export function weekStatus(w, isPassed, known, skim) {
  const th = w.theory.filter(isPassed).length, pr = w.practice.filter(isPassed).length, total = w.theory.length + w.practice.length;
  const empty = total === 0, isKnown = !!known?.has(w.n), isSkim = !!skim?.has(w.n);
  const done = isKnown || (!empty && th === w.theory.length && (isSkim ? w.theory.length > 0 : pr >= Math.ceil(w.practice.length / 2)));
  return { th, pr, total, passed: th + pr, empty, known: isKnown, skim: isSkim, done, frac: isKnown ? 1 : empty ? 0 : (th + pr) / total };
}

// Where you are in a course: the number of leading weeks that are done (empty weeks do not block), and how far behind the
// lecture that is. Partial progress in the first open week counts as a fraction, so every exercise moves the number.
export function position(weeks, isPassed, known, taught, skim) {
  let pos = 0, frac = 0, next = null;
  for (const w of weeks) { const s = weekStatus(w, isPassed, known, skim); if (s.done || s.empty) { pos = w.n; continue; } next = w; frac = Math.min(0.95, s.frac); break; }
  const you = (next ? next.n - 1 : weeks.length) + (next ? frac : 0);
  return { week: next ? next.n - 1 : weeks.length, next, you, behind: Math.max(0, +(taught - you).toFixed(1)), ahead: you > taught };
}

// Runs per day needed, and the date you are level with the lecture at `perDay` week-units per day while the lecture moves on.
export function catchUpDate(behindTotal, weeksPerRun, runsPerDay = 1, now = Date.now()) {
  const gainPerDay = weeksPerRun * runsPerDay - 3 / 7; // three courses advance one week each per 7 days
  if (behindTotal <= 0) return { days: 0, date: new Date(now), possible: true };
  if (gainPerDay <= 0) return { days: Infinity, date: null, possible: false };
  const days = Math.ceil(behindTotal / gainPerDay); return { days, date: new Date(now + days * DAY), possible: true };
}

// Today's run: an ordered list of stops {id, kind, why}. Deterministic for a given state (no randomness: reopening shows the same run).
//   warm-up   up to 2 due respawns (oldest first): retrieval before new material
//   theory    the next unread lesson/quiz of the course you are furthest behind in
//   sheet     the next open question of that week's sheet (the thing you owe), then the same for the other courses
//   boss      one calculation or exam problem from a week you already finished (interleaving, exam fitness)
//   defend    something you passed that is fading from memory (memory.js): retrieval keeps the room from being overrun again
//   examDays  {course: days to its exam}: the course whose exam comes first is favoured (weeks behind count more the sooner the exam)
//   read      guided reading of the script section of the week (before its lessons); reread: the optional second pass
export function buildRun({ weeks, isPassed, known, taught, due = [], minutes = 45, encOf, isLocked = () => false, dueSoon = null, skim = null, defend = [], examDays = null, reread = [], day = Math.floor(Date.now() / 86400000) }) {
  // A run is a slice of everything that is left, in proportion: catch-up (script readings, theory, sheet questions of the weeks
  // not done yet), old-exam problems (w.exam), the other cards of the game (w.extra) and reviews each get the share of the run's
  // minutes that they have of the remaining work. Whole cards are added until a share is used (a card goes in if at least half of
  // it fits); nothing is cut afterwards, so a run can be a few minutes off its nominal length. Kinds with long cards that get only a
  // small share (an exam problem of 30 min in a share of 12) rotate over the days, so over a week each kind gets its proportion.
  const stops = [], seen = new Set(); let used = 0;
  const est = (id) => { const e = encOf(id); return e?.reading ? Math.min(40, e.minutes || 20) : EST_MIN[e?.type] || 10; };
  const add = (id, kind, why, course) => { if (!id || seen.has(id) || !encOf(id)) return false; seen.add(id); stops.push({ id, kind, why, course, min: est(id) }); used += est(id); return true; };
  // priority = (weeks behind + 0.5) x urgency, urgency = (first exam + 7 days) / (this exam + 7 days): 1 for the first exam, less for later ones
  const firstDays = examDays ? Math.min(...Object.values(examDays)) : 0, urgency = (cid) => (examDays && Number.isFinite(examDays[cid]) ? (firstDays + 7) / (examDays[cid] + 7) : 1);
  const order = Object.keys(weeks).map((cid) => { const p = position(weeks[cid], isPassed, known?.[cid], taught, skim?.[cid]); return { cid, p, prio: (p.behind + 0.5) * urgency(cid) }; }).sort((a, b) => b.prio - a.prio);
  const open = (cid, bucket) => { const w = order.find((o) => o.cid === cid).p.next; if (w && bucket === 'practice' && skim?.[cid]?.has(w.n)) return []; return w ? w[bucket].filter((id) => !isPassed(id) && !isLocked(id) && !seen.has(id)) : []; };
  const label = (cid) => { const o = order.find((x) => x.cid === cid); return (o.p.next ? `week ${o.p.next.n}` : 'all weeks done') + (examDays && Number.isFinite(examDays[cid]) ? `, exam in ${examDays[cid]} days` : ''); };
  // ---- the shares: minutes of work left per kind
  const left = (ids) => ids.filter((id) => !isPassed(id) && !isLocked(id)).reduce((a, id) => a + est(id), 0);
  let catchMin = 0, examMin = 0, extraMin = 0;
  for (const [cid, ws] of Object.entries(weeks)) for (const w of ws) {
    examMin += left(w.exam || []);
    if (known?.[cid]?.has(w.n)) continue;
    catchMin += left([...w.theory, ...(w.reading || []), ...(skim?.[cid]?.has(w.n) ? [] : w.practice)]); extraMin += left(w.extra || []);
  }
  const reviewMin = due.length * 6 + Math.min(defend.length, 3) * 6, all = Math.max(1, catchMin + examMin + extraMin + reviewMin);
  const share = { catch: minutes * catchMin / all, exam: minutes * examMin / all, extra: minutes * extraMin / all, review: minutes * reviewMin / all };
  // how many cards of a kind go into today's run: the share in minutes over the typical card length, spread over the days
  const quota = (mins, typical) => Math.floor(day * mins / typical) - Math.floor((day - 1) * mins / typical);
  // ---- catch-up: second pass, sheets due soon, then the next reading, theory and sheet question of the courses by priority
  let cu = 0; const cAdd = (id, kind, why, course) => { const ok = add(id, kind, why, course); if (ok) cu += est(id); return ok; };
  const fits = (id) => cu === 0 || cu + est(id) / 2 <= share.catch;
  for (const r of reread.slice(0, 2)) if (fits(r.id)) cAdd(r.id, 'reread', `Second pass through the script, ${r.label}`, r.course);
  // a sheet due within three days jumps the queue: one question per course (the self-made astro plan: as many as its pace needs)
  for (const ds of dueSoon ? [].concat(dueSoon) : []) for (const id of ds.ids.filter((x) => !isPassed(x)).slice(0, ds.take || 1)) cAdd(id, 'sheet', ds.take ? 'Your Choudhuri plan: due in the next days' : 'Due this week: the sheet you have to hand in', ds.course);
  for (let round = 0; round < 8; round++) {
    let any = false;
    for (const { cid, p } of order) {
      if (!p.next) continue;
      const rd = (p.next.reading || []).find((id) => !isPassed(id) && !isLocked(id) && !seen.has(id));
      if (rd) { if (!fits(rd)) continue; any = cAdd(rd, 'read', `Catch-up, ${label(cid)}: read this part of the script first`, cid) || any; } // the reading first; if it does not fit, the theory waits
      const th = open(cid, 'theory')[0], pr = open(cid, 'practice')[0];
      if (th && fits(th)) any = cAdd(th, 'theory', `Catch-up, ${label(cid)}: read this first`, cid) || any;
      if (pr && fits(pr)) any = cAdd(pr, 'sheet', `Catch-up, ${label(cid)}: ${th ? 'then the exercise that uses it' : 'next open exercise'}`, cid) || any;
    }
    if (!any || cu >= share.catch) break;
  }
  // ---- mixed in: old-exam problems and the other cards, from the weeks you are working on now (current week first, then the
  // ones before), so exam practice starts long before a course is caught up
  const pool = (bucket) => { const out = []; for (const { cid, p } of order) { const upto = p.next ? p.next.n : weeks[cid].length; const ws = weeks[cid].filter((w) => w.n <= upto).sort((a, b) => b.n - a.n);
    for (const w of ws) for (const id of w[bucket] || []) if (!isPassed(id) && !isLocked(id) && !seen.has(id)) out.push({ id, cid, n: w.n }); } return out; };
  const exams = pool('exam'), extras = pool('extra');
  for (const x of exams.slice(0, est(exams[0]?.id) <= minutes ? quota(share.exam, EST_MIN.boss) : 0)) add( // (a card longer than the whole run waits for a longer run)
    x.id, 'exam', `Old-exam problem on week ${x.n}, which you are working on: exam practice from the start`, x.cid);
  const nx = quota(share.extra, 12); let k = 0;
  for (const x of extras) { if (k >= nx) break; if (stops.some((s) => s.kind === 'extra' && s.course === x.cid) && extras.some((y) => y.cid !== x.cid && !seen.has(y.id))) continue; if (add(x.id, 'extra', `More from week ${x.n}: a card no sheet links to, so you do not miss it`, x.cid)) k++; }
  // ---- reviews at the end: due respawns (spaced 3, 7, 16, 35 days), then something fading; at least the oldest due respawn
  let rv = 0;
  for (const id of due) { if (rv > 0 && rv + 3 > share.review) break; if (add(id, 'warmup', 'Review: a respawn that is due (spaced repetition)')) rv += est(id); }
  for (const id of defend) { if (rv + 3 > share.review) break; if (add(id, 'defend', 'You passed this a while ago and it is fading: defend it')) rv += est(id); }
  return { stops, minutes: used, share: Object.fromEntries(Object.entries(share).map(([kk, v]) => [kk, Math.round(v)])) };
}
