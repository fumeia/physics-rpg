// Logic checks of the daily missions (node): determinism, structure, streak/level maths.
import { readFileSync, existsSync } from 'node:fs';
import { buildMissions, levelOf, todayStr, yesterdayStr, daysToExam, examPlan, linkQuestions, rngFor } from '../src/missions.js';
let fails = 0; const ok = (n, c, x = '') => { console.log(`${c ? 'PASS' : 'FAIL'} ${n} ${x}`); if (!c) fails++; };
const J = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), 'utf8'));
const catalog = [], banks = {};
for (const [id, dir] of [['qm', 'qm'], ['solid-state', 'solid-state'], ['astrophysics', 'astrophysics']]) {
  const idx = J(`../content/${dir}/index.json`); catalog.push({ id, region: idx.region, rooms: idx.rooms.map((s) => ({ ...J(`../content/${dir}/${s}.json`), slug: s })) });
  if (existsSync(new URL(`../content/${dir}/blitz.json`, import.meta.url))) banks[id] = J(`../content/${dir}/blitz.json`);
}
const links = J('../content/links.json').links;
const store = { val: () => [], flag: () => false };
for (const day of ['2026-10-14', '2026-10-15', '2026-10-18', '2026-12-31']) {
  const now = new Date(day + 'T12:00:00'), a = buildMissions({ catalog, banks, links, store, now, isPassed: () => false }), b = buildMissions({ catalog, banks, links, store, now, isPassed: () => false });
  ok(`${day}: deterministic`, JSON.stringify(a.map((m) => m.id)) === JSON.stringify(b.map((m) => m.id)) && a.every((m, i) => m.encId === b[i].encId));
  ok(`${day}: 4-6 missions of different types`, a.length >= 4 && new Set(a.map((m) => m.type)).size === a.length, a.map((m) => m.type).join(','));
  for (const m of a) {
    if (m.enc) ok(`${day} ${m.type}: synthetic quiz well-formed`, m.enc.synthetic && m.enc.questions.length >= 4 && m.enc.questions.every((q) => q.options.length === 4 && q.correct >= 0 && q.correct < 4 && q.explain));
    else ok(`${day} ${m.type}: refers to an existing encounter`, catalog.some((c) => c.rooms.some((r) => r.encounters.some((e) => e.id === m.encId))), m.encId);
  }
  if (new Date(day + 'T12:00:00').getDay() === 0) ok('Sunday has the mock exam', a.some((m) => m.type === 'mock'));
}
const lq = linkQuestions(links, catalog, 6, rngFor('x')); ok('link questions: 4 distinct options, correct title present', lq.length >= 5 && lq.every((q) => new Set(q.options).size === 4 && q.correct >= 0 && q.explain));
ok('levels grow with XP', levelOf(0).lv === 1 && levelOf(60).lv === 2 && levelOf(10000).lv > 8 && levelOf(10000).rank === 'Nobel candidate');
ok('date helpers', todayStr(new Date('2026-03-05T12:00:00')) === '2026-03-05' && yesterdayStr(new Date('2026-03-01T12:00:00')) === '2026-02-28');
ok('exam countdown', daysToExam(new Date('2027-01-14T12:00:00')) === 1 && daysToExam(new Date('2027-02-01T12:00:00')) === 0);
const plan = examPlan(catalog, () => false, new Date('2026-10-15T12:00:00')); ok('pace plan', plan.days > 80 && plan.perDay === Math.ceil(plan.left / plan.days), JSON.stringify(plan));
console.log(fails ? `${fails} FAILED` : 'ALL PASS'); process.exit(fails ? 1 : 0);
