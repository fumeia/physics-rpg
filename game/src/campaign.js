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
export function buildRun({ weeks, isPassed, known, taught, due = [], minutes = 45, encOf, isLocked = () => false, dueSoon = null, skim = null, defend = [], examDays = null, reread = [] }) {
  const stops = [], seen = new Set(); let used = 0;
  const est = (id) => { const e = encOf(id); return e?.reading ? Math.min(40, e.minutes || 20) : EST_MIN[e?.type] || 10; };
  const add = (id, kind, why, course) => { if (!id || seen.has(id) || !encOf(id)) return false; if (stops.length && used + est(id) > minutes + (minutes < 60 ? 5 : 0)) return false; seen.add(id); stops.push({ id, kind, why, course, min: est(id) }); used += est(id); return true; };
  for (const id of due) { if (used > minutes * 0.25 || stops.length >= 2) break; add(id, 'warmup', 'A respawn that is due: recall it before anything new'); } // warm-up stays a quarter of the run
  for (const id of defend) { if (used > minutes * 0.3 || stops.filter((s) => s.kind === 'defend').length >= (minutes >= 60 ? 2 : 1)) break; add(id, 'defend', 'You passed this a while ago and it is fading: defend it'); }
  // priority = (weeks behind + 0.5) x urgency, urgency = (first exam + 7 days) / (this exam + 7 days): 1 for the first exam, less for later ones
  const firstDays = examDays ? Math.min(...Object.values(examDays)) : 0, urgency = (cid) => (examDays && Number.isFinite(examDays[cid]) ? (firstDays + 7) / (examDays[cid] + 7) : 1);
  const order = Object.keys(weeks).map((cid) => { const p = position(weeks[cid], isPassed, known?.[cid], taught, skim?.[cid]); return { cid, p, prio: (p.behind + 0.5) * urgency(cid) }; }).sort((a, b) => b.prio - a.prio);
  const open = (cid, bucket) => { const w = order.find((o) => o.cid === cid).p.next; if (w && bucket === 'practice' && skim?.[cid]?.has(w.n)) return []; return w ? w[bucket].filter((id) => !isPassed(id) && !isLocked(id) && !seen.has(id)) : []; };
  const label = (cid) => { const o = order.find((x) => x.cid === cid); return (o.p.next ? `week ${o.p.next.n}` : 'all weeks done') + (examDays && Number.isFinite(examDays[cid]) ? `, exam in ${examDays[cid]} days` : ''); };
  // second pass through the script (only courses where you switched it on): one card per run, two on long runs
  for (const r of reread.slice(0, minutes >= 60 ? 2 : 1)) add(r.id, 'reread', `Second pass through the script, ${r.label}`, r.course);
  // a sheet that is due within three days jumps the queue (dueSoon: {course, ids})
  if (dueSoon) for (const id of dueSoon.ids.filter((x) => !isPassed(x)).slice(0, 1)) add(id, 'sheet', 'Due this week: the sheet you have to hand in', dueSoon.course);
  const budget = minutes >= 60 ? minutes - 15 : minutes; // long runs keep room for the finisher
  let round = 0;
  while (used < budget && round < 6) {
    let any = false;
    for (const { cid, p } of order) {
      if (used >= budget) break;
      if (!p.next) continue;
      if (round > 0 && p.behind <= 0 && used >= minutes * 0.6) continue; // courses that are on track get one slot
      const rd = (p.next.reading || []).find((id) => !isPassed(id) && !isLocked(id) && !seen.has(id));
      if (rd) any = add(rd, 'read', `Catch-up, ${label(cid)}: read this part of the script first`, cid) || any;
      const th = open(cid, 'theory')[0], pr = open(cid, 'practice')[0];
      if (th) any = add(th, 'theory', `Catch-up, ${label(cid)}: read this first`, cid) || any;
      if (pr && used < budget) any = add(pr, 'sheet', `Catch-up, ${label(cid)}: ${th ? 'then the exercise that uses it' : 'next open exercise'}`, cid) || any;
    }
    if (!any) break; round++;
  }
  // finisher: something exam-like from a finished week of the course you are best in (kept short on short runs)
  if (minutes >= 40) {
    outer: for (const { cid } of [...order].reverse()) for (const w of weeks[cid]) {
      if (!weekStatus(w, isPassed, known?.[cid], skim?.[cid]).done) break;
      const id = w.practice.find((x) => !isPassed(x) && !seen.has(x) && !isLocked(x) && ['calc', 'boss', 'derive'].includes(encOf(x)?.type));
      if (id) { if (used + est(id) <= minutes + 5) { seen.add(id); stops.push({ id, kind: 'boss', why: 'Finisher from a week you already cleared: exam fitness', course: cid, min: est(id) }); used += est(id); } break outer; }
    }
  }
  return { stops, minutes: used };
}
