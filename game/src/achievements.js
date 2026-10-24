// Achievements: small goals that make progress visible. Pure functions over the catalog and the store.
export const ACH = [
  { id: 'first-lesson', title: 'First page', desc: 'Finish a lesson.', test: (c) => c.n.lesson >= 1 },
  { id: 'first-quiz', title: 'Quick fingers', desc: 'Pass a quiz.', test: (c) => c.n.quiz >= 1 },
  { id: 'first-derive', title: 'Pen and paper', desc: 'Finish a derivation.', test: (c) => c.n.derive >= 1 },
  { id: 'first-fight', title: 'First calculation', desc: 'Win a calculation fight.', test: (c) => c.n.calc >= 1 },
  { id: 'first-lab', title: 'Hands on', desc: 'Complete an experiment.', test: (c) => c.n.lab >= 1 },
  { id: 'first-boss', title: 'Boss slayer', desc: 'Defeat an old-exam boss.', test: (c) => c.n.boss >= 1 },
  { id: 'ten', title: 'Ten down', desc: 'Pass 10 encounters.', test: (c) => c.total >= 10 },
  { id: 'fifty', title: 'Half a hundred', desc: 'Pass 50 encounters.', test: (c) => c.total >= 50 },
  { id: 'hundred', title: 'Centurion', desc: 'Pass 100 encounters.', test: (c) => c.total >= 100 },
  { id: 'three-fields', title: 'Three fields', desc: 'Pass something in QM, solid state and astrophysics.', test: (c) => c.courses >= 3 },
  { id: 'room-cleared', title: 'Room cleared', desc: 'Clear every lesson, quiz, derivation and fight of one room.', test: (c) => c.clearedRooms >= 1 },
  { id: 'streak3', title: 'Three days running', desc: 'A 3-day streak.', test: (c) => c.streak >= 3 },
  { id: 'streak7', title: 'A whole week', desc: 'A 7-day streak.', test: (c) => c.streak >= 7 },
  { id: 'streak21', title: 'Habit', desc: 'A 21-day streak.', test: (c) => c.streak >= 21 },
  { id: 'xp1000', title: 'Thousand XP', desc: 'Earn 1000 XP.', test: (c) => c.xp >= 1000 },
  { id: 'rank5', title: 'Researcher', desc: 'Reach rank level 5.', test: (c) => c.level >= 5 },
  { id: 'links5', title: 'Connector', desc: 'Read 5 connection cards.', test: (c) => c.stats.links >= 5 },
  { id: 'missions10', title: 'Mission regular', desc: 'Complete 10 daily missions.', test: (c) => c.stats.missions >= 10 },
  { id: 'hour', title: 'One focused hour', desc: 'Study for an hour in total.', test: (c) => c.studySeconds >= 3600 },
  { id: 'tenhours', title: 'Ten hours', desc: 'Study for ten hours in total.', test: (c) => c.studySeconds >= 36000 },
];
export function context({ catalog, isPassed, store, level, streak }) {
  const n = {}; let total = 0, clearedRooms = 0; const courses = new Set();
  for (const course of catalog) for (const room of course.rooms) {
    const core = room.encounters.filter((e) => !['sandbox', 'boss', 'lab'].includes(e.type)); let coreDone = 0;
    for (const e of room.encounters) if (e.type !== 'sandbox' && isPassed(e)) { n[e.type] = (n[e.type] || 0) + 1; total++; courses.add(course.id); if (core.includes(e)) coreDone++; }
    if (core.length && coreDone === core.length) clearedRooms++;
  }
  return { n: new Proxy(n, { get: (t, k) => t[k] || 0 }), total, courses: courses.size, clearedRooms, streak, xp: store.xp, level, stats: { links: 0, missions: 0, ...(store.val('stats', {}) || {}) }, studySeconds: store.activeTotal() };
}
export const unlockedNow = (ctx, have) => ACH.filter((a) => !have[a.id] && a.test(ctx));
