// Exam hall logic without DOM: Swiss grades, point weights, building a mock exam, readiness from the history.
export const DEFAULT_SCALE = { pass: 50, full: 82.5 }; // percent of the points for 4.0 and for 6.0 (the user's university)

/** Swiss mark: linear 1.0 (0 %) -> 4.0 (pass) -> 6.0 (full); rounded to quarter marks like the official transcript. */
export function swissGrade(pct, { pass, full } = DEFAULT_SCALE) {
  const g = pct < pass ? 1 + 3 * pct / pass : 4 + 2 * (pct - pass) / (full - pass);
  const exact = Math.min(6, Math.max(1, g));
  return { exact, rounded: Math.round(exact * 4) / 4 };
}
/** Points needed (out of max) to reach a given exact grade. */
export const pointsForGrade = (grade, max, { pass, full } = DEFAULT_SCALE) => max * (grade <= 4 ? (pass * (grade - 1)) / 3 : pass + ((grade - 4) * (full - pass)) / 2) / 100;
export const gradeWord = (g) => (g >= 5.5 ? 'excellent' : g >= 5 ? 'very good' : g >= 4.5 ? 'good' : g >= 4 ? 'passed' : g >= 3.5 ? 'just failed' : 'failed');

/** Points of an old-exam problem: set in the data, otherwise 1 point per 2 minutes (the pace of the real exams). */
export const bossPoints = (enc) => enc.points ?? Math.max(2, Math.round(enc.minutes / 2));
export const MC_MINUTES = 1.5;

function rng(seed) { let s = (seed >>> 0) || 1; return () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296; }
const shuffle = (a, r) => { const x = [...a]; for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; } return x; };

/**
 * mode: 'full' (MC part + problems), 'problems', 'mc', 'single'. bosses: [{enc, room}], mcPool: questions with options/correct.
 * seen: ids used in recent mocks (avoided first so repeated mocks vary).
 */
export function buildExam({ mode, minutes, bosses, mcPool, seen = [], seed = Date.now(), pick = null }) {
  const r = rng(seed), isSeen = new Set(seen), fresh = (a, id) => [...shuffle(a.filter((x) => !isSeen.has(id(x))), r), ...shuffle(a.filter((x) => isSeen.has(id(x))), r)];
  const parts = [];
  if (mode === 'single') { const b = bosses.find((x) => x.enc.id === pick); if (b) parts.push({ kind: 'boss', ...b, points: bossPoints(b.enc), minutes: b.enc.minutes }); }
  else {
    let left = minutes;
    if (mode === 'mc' || mode === 'full') {
      const n = Math.min(mcPool.length, mode === 'mc' ? Math.round(minutes / MC_MINUTES) : Math.max(6, Math.round(0.2 * minutes / MC_MINUTES)));
      const qs = fresh(mcPool, (q) => q.id).slice(0, n);
      if (qs.length) { parts.push({ kind: 'mc', questions: qs, points: qs.length, minutes: qs.length * MC_MINUTES }); left -= qs.length * MC_MINUTES; }
    }
    if (mode === 'problems' || mode === 'full') {
      for (const b of fresh(bosses, (x) => x.enc.id)) { if (b.enc.minutes <= left + 0.04 * minutes) { parts.push({ kind: 'boss', ...b, points: bossPoints(b.enc), minutes: b.enc.minutes }); left -= b.enc.minutes; } if (left < 8) break; }
    }
  }
  const max = parts.reduce((s, p) => s + p.points, 0), mins = Math.round(parts.reduce((s, p) => s + p.minutes, 0));
  return { mode, parts, max, minutes: mins };
}

/** Score of one problem from its numeric answers and its self-graded key points (same 50/50 rule as the boss fight). */
export const problemFraction = (right, nAnswers, kp, nKey) => 0.5 * (nAnswers ? right / nAnswers : 0) + 0.5 * (nKey ? kp / nKey : 0);

/** Readiness from the history of one course: average of the last three attempts that contain problems (not MC-only). */
export function readiness(history, course, scale = DEFAULT_SCALE) {
  const h = history.filter((x) => x.course === course && x.mode !== 'single').sort((a, b) => a.t - b.t), last = h.slice(-3);
  if (!last.length) return null;
  const pct = last.reduce((s, x) => s + x.pct, 0) / last.length, g = swissGrade(pct, scale);
  const trend = h.length >= 4 ? (h.slice(-2).reduce((s, x) => s + x.pct, 0) / 2) - (h.slice(-4, -2).reduce((s, x) => s + x.pct, 0) / 2) : null;
  return { pct, grade: g, n: h.length, trend };
}
