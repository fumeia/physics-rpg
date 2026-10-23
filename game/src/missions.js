// Daily missions: deterministic per calendar day, by question TYPE (exam-style MC, cross-course links, derivation,
// estimation, experiment, exam boss), with streaks, ranks and an exam countdown. Pure logic: main.js wires it to the UI.
export const EXAM_DATE = '2027-01-15'; // "mid-January 2027" (exact dates unknown)
export const RANKS = ['Freshman', 'Student', 'Adept', 'Scholar', 'Researcher', 'Postdoc', 'Professor', 'Nobel candidate'];

export const todayStr = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const yesterdayStr = (d = new Date()) => { const y = new Date(d); y.setDate(y.getDate() - 1); return todayStr(y); };
export const daysToExam = (d = new Date()) => Math.max(0, Math.ceil((new Date(EXAM_DATE + 'T00:00:00') - new Date(todayStr(d) + 'T00:00:00')) / 86400000));
export const levelOf = (xp) => { const lv = Math.floor(Math.sqrt(xp / 60)) + 1, lo = 60 * (lv - 1) ** 2, hi = 60 * lv ** 2; return { lv, rank: RANKS[Math.min(RANKS.length - 1, lv - 1)], into: xp - lo, need: hi - lo }; };

function hash(s) { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
export function rngFor(seed) { let s = hash(seed) || 1; return () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296; }
const pick = (arr, r) => arr[Math.floor(r() * arr.length)];
const shuffle = (arr, r) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const asSource = (course, s) => (s ? { file: `question bank (${course})`, where: s } : null);

/** Question pool: blitz banks (content/<course>/blitz.json) plus the questions of every room quiz (kind 'exam'). */
export function buildPool(catalog, banks) {
  const pool = [];
  for (const [course, b] of Object.entries(banks)) for (const q of b.questions || []) pool.push({ ...q, course, kind: q.kind || 'concept' });
  for (const c of catalog) for (const r of c.rooms) for (const e of r.encounters) if (e.type === 'quiz') e.questions.forEach((q, i) => pool.push({ id: `${e.id}#${i}`, course: c.id, room: r.slug, kind: 'exam', q: q.q, options: q.options, correct: q.correct, explain: q.explain, source: q.source?.where || (Array.isArray(e.source) ? e.source[0]?.where : '') }));
  return pool;
}

/** Questions from the cross-course links: "Which idea connects room A with room B?" */
export function linkQuestions(links, catalog, n, r) {
  const title = (key) => { const [c, s] = key.split('/'); return catalog.find((x) => x.id === c)?.rooms.find((x) => x.slug === s)?.title; };
  const ok = links.filter((l) => title(l.a) && title(l.b));
  const out = [];
  for (const l of shuffle(ok, r).slice(0, n)) {
    const others = shuffle(ok.filter((o) => o.title !== l.title), r).slice(0, 3);
    if (others.length < 3) continue;
    const options = shuffle([l, ...others], r);
    out.push({ id: `link:${l.id}`, q: `Which idea connects <b>${title(l.a)}</b> with <b>${title(l.b)}</b>?`, options: options.map((o) => o.title), correct: options.indexOf(l), explain: l.why + (l.tex ? ` $${l.tex}$` : ''), source: 'Nexus cross-link' });
  }
  return out;
}

function quizFrom(id, title, qs, xp, passMark, course = 'mixed') {
  return { type: 'quiz', synthetic: true, id, title, xp, passMark, source: [], questions: qs.map((q) => ({ q: q.q, options: q.options, correct: q.correct, explain: q.explain, source: asSource(q.course || course, q.source) })) };
}

/**
 * Build today's missions. ctx: { catalog, banks, links, store, now }.
 * A mission: { id, type, kind (question type label), title, desc, xp, enc (synthetic encounter) | encId }
 */
export function buildMissions({ catalog, banks, links, store, now = new Date(), isPassed }) {
  const date = todayStr(now), r = rngFor(date), dow = now.getDay(), doy = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
  const courses = catalog.map((c) => c.id), focus = courses[doy % courses.length];
  const pool = buildPool(catalog, banks), seen = new Set(store.val('seen-q', []) || []);
  const take = (kind, n, course) => {
    let c = pool.filter((q) => q.kind === kind && (!course || q.course === course)); c = c.length >= n ? c : pool.filter((q) => q.kind === kind);
    const fresh = shuffle(c.filter((q) => !seen.has(q.id)), r), rest = shuffle(c.filter((q) => seen.has(q.id)), r);
    return [...fresh, ...rest].slice(0, n);
  };
  const missions = [];
  // 1. exam-style blitz, mixed question types, focused on today's course
  let picked = [...take('exam', 4, focus), ...take('whatif', 2, focus), ...take('concept', 2, focus), ...take('estimate', 2, focus)];
  if (picked.length < 10) { const have = new Set(picked.map((q) => q.id)); picked = [...picked, ...take('exam', 14, focus).filter((q) => !have.has(q.id))].slice(0, 10); } // question bank missing: fall back to room quizzes
  const blitzQs = shuffle(picked, r);
  if (blitzQs.length >= 6) missions.push({ id: `${date}:blitz`, type: 'blitz', kind: 'exam-style multiple choice', title: `Blitz: ${blitzQs.length} mixed questions`, desc: `Exam-style, what-if and estimation questions, focus on ${catalog.find((c) => c.id === focus)?.region}. Pass mark 70 %.`, xp: 40, enc: quizFrom(`mission-${date}-blitz`, `Daily blitz (${date})`, blitzQs, 40, 0.7, focus), qids: blitzQs.map((q) => q.id) });
  // 2. connect the dots across courses
  const lq = linkQuestions(links, catalog, 6, r); if (lq.length >= 4) missions.push({ id: `${date}:links`, type: 'links', kind: 'concept links across courses', title: `Connect the dots: ${lq.length} links between topics`, desc: 'Which idea ties two rooms of different fields together? This is what turns three courses into one picture.', xp: 25, enc: quizFrom(`mission-${date}-links`, `Connect the dots (${date})`, lq, 25, 0.66) });
  // 3. derivation sprint (even days) or estimation sprint (odd days) in the focus course, preferring unfinished items
  const encs = (course, test) => catalog.filter((c) => !course || c.id === course).flatMap((c) => c.rooms.flatMap((rm) => rm.encounters.filter(test).map((e) => ({ e, room: rm, course: c.id }))));
  const prefer = (list) => { const open = list.filter((x) => !isPassed(x.e)); return pick(open.length ? open : list, r); };
  const second = doy % 2 === 0 ? { t: 'derive', k: 'derivation on paper', test: (e) => e.type === 'derive', xp: 30, label: 'Derivation of the day' } : { t: 'fermi', k: 'estimation / quick fight', test: (e) => e.type === 'calc' && e.fight === 'fermi', xp: 30, label: 'Estimation sprint' };
  let cand = encs(focus, second.test); if (!cand.length) cand = encs(null, second.test);
  if (cand.length) { const x = prefer(cand); missions.push({ id: `${date}:${second.t}`, type: second.t, kind: second.k, title: `${second.label}: ${x.e.title}`, desc: `${catalog.find((c) => c.id === x.course)?.region}, room "${x.room.title}". ${second.t === 'derive' ? 'Write it on paper first, then compare step by step.' : 'Think in orders of magnitude before computing.'}`, xp: second.xp, encId: x.e.id }); }
  // 4. an experiment (even) or a theory lesson (odd) from a different course than the focus
  const third = doy % 2 === 0 ? { t: 'lab', k: 'interactive experiment', test: (e) => e.type === 'lab', xp: 20, label: 'Experiment' } : { t: 'lesson', k: 'theory lesson', test: (e) => e.type === 'lesson', xp: 20, label: 'Read a lesson' };
  const other = courses.filter((c) => c !== focus); let c3 = encs(pick(other, r), third.test); if (!c3.length) c3 = encs(null, third.test);
  if (c3.length) { const x = prefer(c3); missions.push({ id: `${date}:${third.t}`, type: third.t, kind: third.k, title: `${third.label}: ${x.e.title}`, desc: `${catalog.find((c) => c.id === x.course)?.region}, room "${x.room.title}".`, xp: third.xp, encId: x.e.id }); }
  // 5. exam boss (full old-exam problem on paper)
  const bosses = encs(null, (e) => e.type === 'boss'); if (bosses.length) { const x = prefer(shuffle(bosses, r).slice(0, 6)); missions.push({ id: `${date}:boss`, type: 'boss', kind: 'full exam problem', title: `Exam sprint: ${x.e.title}`, desc: `A real old-exam problem (${x.e.minutes} min on paper). The best preparation there is.`, xp: 60, encId: x.e.id }); }
  // weekly mock exam (Sunday): 15 exam-style questions
  if (dow === 0) { const m = take('exam', 15); if (m.length >= 10) missions.push({ id: `${date}:mock`, type: 'mock', kind: 'mock exam (multiple-choice part)', title: `Sunday mock exam: ${m.length} questions`, desc: 'Like the first part of the exam: mixed topics, no hints. Try to do it in 22 minutes.', xp: 80, enc: quizFrom(`mission-${date}-mock`, `Mock exam (${date})`, m, 80, 0.7) }); }
  return missions;
}

export function examPlan(catalog, isPassed, now = new Date()) {
  let total = 0, done = 0; for (const c of catalog) for (const rm of c.rooms) for (const e of rm.encounters) if (e.type !== 'sandbox') { total++; if (isPassed(e)) done++; }
  const days = daysToExam(now), left = total - done;
  return { days, total, done, left, perDay: days > 0 ? Math.ceil(left / days) : left };
}
