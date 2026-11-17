// Memory model (pure logic): what you passed fades. Each exercise has a strength that grows every time you pass it again;
// the chance that you still know it falls off exponentially with the days since. Used for: rooms that get overrun again,
// "defend" stops in the run (retrieval of things you passed, not only of things you failed), fading week tiles, and the
// grade forecast. It is an estimate in the spirit of spaced-repetition schedulers, not a measurement.
const DAY = 86400000;
export const stabilityDays = (n) => 6 * 2.2 ** (Math.max(1, n) - 1); // 6, 13, 29, 64, 140 days
export function retention(entry, now = Date.now()) { if (!entry) return 0; const dt = Math.max(0, (now - entry.t) / DAY); return Math.exp(-dt / stabilityDays(entry.n)); }
// mem: {id: {n: passes, t: last pass}}; solved: store.snapshot.solved (fallback for things passed before the model existed)
export function entryOf(id, mem, solved) { const m = mem?.[id]; if (m) return m; const s = solved?.[id]; return s && !s.failed && s.at ? { n: 1, t: s.at } : null; }
export function notePass(mem, id, now = Date.now()) { const m = mem?.[id]; const sameDay = m && now - m.t < 0.5 * DAY; return { ...(mem || {}), [id]: { n: sameDay ? m.n : (m?.n || 0) + 1, t: now } }; } // cramming twice in one day counts once
export function noteFail(mem, id, now = Date.now()) { const m = mem?.[id]; return m ? { ...mem, [id]: { n: Math.max(1, m.n - 1), t: m.t } } : mem || {}; }
// mean retention of the passed ids in a list (null when nothing is passed)
export function meanRetention(ids, mem, solved, now = Date.now()) { const rs = ids.map((id) => entryOf(id, mem, solved)).filter(Boolean).map((e) => retention(e, now)); return rs.length ? rs.reduce((a, b) => a + b, 0) / rs.length : null; }
// the passed ids that are fading (retention below the threshold), weakest first
export function fading(ids, mem, solved, now = Date.now(), below = 0.6) { return ids.map((id) => ({ id, r: retention(entryOf(id, mem, solved), now), has: !!entryOf(id, mem, solved) })).filter((x) => x.has && x.r < below).sort((a, b) => a.r - b.r); }

// Grade forecast for one course on the Swiss scale 1 to 6 (4 passes). score in [0, 1]: how much of the exam-weighted material
// you have passed, discounted by how much of it you probably still know, with a bonus for old-exam problems passed.
//   weeks: [{ids: [...], weight}], isPassed(id), bossIds: old-exam problems of the course
export function forecast({ weeks, isPassed, mem, solved, bossIds = [], now = Date.now() }) {
  let wsum = 0, got = 0;
  for (const w of weeks) { if (!w.ids.length) continue; const wt = w.weight ?? 1; wsum += wt; if (w.credit) { got += wt * w.credit; continue; } // a week done on paper: fixed credit
    const p = w.ids.filter(isPassed); if (!p.length) continue; got += wt * (p.length / w.ids.length) * (meanRetention(p, mem, solved, now) ?? 0); }
  const cover = wsum ? got / wsum : 0, boss = bossIds.length ? bossIds.filter(isPassed).length / bossIds.length : 0;
  const score = Math.min(1, 0.8 * cover + 0.2 * boss), grade = 1 + 5 * score ** 0.75;
  return { score, cover, boss, grade: Math.round(grade * 4) / 4 };
}
