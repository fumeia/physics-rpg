// Catch-up campaign logic on the real content: weeks are built for all three courses, every id exists once, positions and
// "weeks behind" react to progress and to weeks marked as known, and the daily run is sensible. Usage: node test/campaign-check.mjs
import { readFileSync, existsSync } from 'node:fs';
import { buildWeeks, weekStatus, position, lectureWeek, taughtWeeks, buildRun, catchUpDate } from '../src/campaign.js';
let fails = 0, n = 0; const ok = (name, c, x = '') => { n++; if (!c) { fails++; console.log(`FAIL ${name} ${x}`); } };
const J = (p) => JSON.parse(readFileSync(new URL('../content/' + p, import.meta.url)));
const cfg = J('campaign.json'), catalog = [], sheets = {}, encOfMap = new Map();
for (const id of ['qm', 'solid-state', 'astrophysics']) {
  const idx = J(`${id}/index.json`), rooms = idx.rooms.map((slug) => ({ slug, ...J(`${id}/${slug}.json`) }));
  for (const f of idx.extras || []) { const x = J(`${id}/${f}`); for (const it of x.items || []) rooms.find((r) => r.slug === it.room).encounters.push(it.enc); if (x.sheets) { sheets[id] = x; for (const sh of x.sheets) for (const q of sh.questions) rooms.find((r) => r.slug === q.room).encounters.push(q.enc); } }
  catalog.push({ id, rooms }); for (const r of rooms) for (const e of r.encounters) encOfMap.set(e.id, e);
}
const weeks = buildWeeks(cfg, catalog, sheets), encOf = (id) => encOfMap.get(id);
for (const cid of Object.keys(cfg.courses)) {
  const ws = weeks[cid]; ok(`${cid}: 14 weeks`, ws?.length === 14);
  const all = ws.flatMap((w) => [...w.theory, ...w.practice]); ok(`${cid}: ids unique`, new Set(all).size === all.length); ok(`${cid}: ids exist`, all.every((id) => encOfMap.has(id)));
  ok(`${cid}: every week has a title`, ws.every((w) => w.title)); ok(`${cid}: has content`, all.length > 20, all.length);
  for (const sp of Object.values(cfg.courses[cid].rooms || {}).flat()) ok(`${cid}: room ${sp}`, catalog.find((c) => c.id === cid).rooms.some((r) => r.slug === sp.split(':')[0]));
  for (const id of Object.values(cfg.courses[cid].extra || {}).flat()) ok(`${cid}: extra ${id} exists`, encOfMap.has(id));
}
ok('solid state weeks 1-9 have their sheet', weeks['solid-state'].slice(0, 9).every((w) => w.sheet === w.n && w.practice.length >= 2));
ok('solid state weeks 1-7 and 9-14 have theory', weeks['solid-state'].filter((w) => w.n !== 8).every((w) => w.theory.length >= 1), weeks['solid-state'].filter((w) => !w.theory.length).map((w) => w.n).join());
ok('qm: all 14 sheets', weeks.qm.every((w) => w.sheet === w.n)); ok('qm: every lesson of a linked room appears', weeks.qm.flatMap((w) => w.theory).length >= 20, weeks.qm.flatMap((w) => w.theory).length);
// time
const t0 = Date.parse('2026-09-14T08:00:00'); ok('week 1 on the first day', lectureWeek(cfg, t0) === 1 && taughtWeeks(cfg, t0) === 0);
const nov16 = Date.parse('2026-11-16T12:00:00'); ok('16 Nov is lecture week 10, 9 weeks taught', lectureWeek(cfg, nov16) === 10 && taughtWeeks(cfg, nov16) === 9); ok('capped at 14', lectureWeek(cfg, Date.parse('2027-02-01')) === 14);
// positions
const none = () => false, ss = weeks['solid-state'];
ok('nothing done: 9 weeks behind', position(ss, none, new Set(), 9).behind === 9);
ok('weeks 1-3 known: 6 behind, next is week 4', position(ss, none, new Set([1, 2, 3]), 9).behind === 6 && position(ss, none, new Set([1, 2, 3]), 9).next.n === 4);
const w4 = ss[3], some = new Set([...w4.theory, w4.practice[0]]), p1 = position(ss, (id) => some.has(id), new Set([1, 2, 3]), 9);
ok('partial progress in week 4 lowers the number', p1.behind < 6 && p1.behind > 5, p1.behind);
const full = new Set([...w4.theory, ...w4.practice.slice(0, Math.ceil(w4.practice.length / 2))]); ok('theory + half the sheet completes the week', weekStatus(w4, (id) => full.has(id), new Set()).done && position(ss, (id) => full.has(id), new Set([1, 2, 3]), 9).next.n === 5);
ok('all known: not behind', position(ss, none, new Set(ss.map((w) => w.n)), 9).behind === 0);
// run
const known = { 'solid-state': new Set([1, 2, 3]), qm: new Set([1, 2, 3, 4, 5, 6, 7]), astrophysics: new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]) };
const run = buildRun({ weeks, isPassed: none, known, taught: 9, due: ['qm-wm-c1', 'ss-lat-c1', 'astro-light-c1'].filter((x) => encOfMap.has(x)), minutes: 45, encOf });
ok('run has 3-7 stops', run.stops.length >= 3 && run.stops.length <= 7, run.stops.length); ok('run fits the time', run.minutes <= 65, run.minutes);
ok('run starts with a warm-up when respawns are due', run.stops[0].kind === 'warmup');
const firstNew = run.stops.find((s) => s.kind !== 'warmup'); ok('first new stop is solid state week 4 (furthest behind)', firstNew.course === 'solid-state' && w4.theory.concat(w4.practice).includes(firstNew.id), JSON.stringify(firstNew));
console.log(run.stops.map((s) => s.kind + ':' + s.id + ':' + s.min).join(' ')); ok('theory comes before its sheet question', run.stops.findIndex((s) => s.kind === 'theory' && s.course === 'solid-state') < run.stops.findIndex((s) => s.kind === 'sheet' && s.course === 'solid-state'));
ok('run covers a second course', new Set(run.stops.map((s) => s.course).filter(Boolean)).size >= 2);
ok('run is deterministic', JSON.stringify(buildRun({ weeks, isPassed: none, known, taught: 9, due: [], minutes: 45, encOf })) === JSON.stringify(buildRun({ weeks, isPassed: none, known, taught: 9, due: [], minutes: 45, encOf })));
const short = buildRun({ weeks, isPassed: none, known, taught: 9, due: [], minutes: 20, encOf }); ok('short run is short', short.stops.length >= 1 && short.minutes <= 30, short.minutes);
const long = buildRun({ weeks, isPassed: none, known, taught: 9, due: [], minutes: 90, encOf }); ok('long run is longer and ends with a finisher', long.stops.length > run.stops.length && long.stops.at(-1).kind === 'boss', long.stops.map((s) => s.kind).join());
const allDone = buildRun({ weeks, isPassed: () => true, known, taught: 9, due: [], minutes: 45, encOf }); ok('everything passed: empty run', allDone.stops.length === 0);
const soon = buildRun({ weeks, isPassed: none, known, taught: 9, due: [], minutes: 45, encOf, dueSoon: { course: 'qm', ids: ['qm-sheet-s9q1'] } }); ok('a sheet due soon comes first', soon.stops[0].id === 'qm-sheet-s9q1');
// catch-up date
const cu = catchUpDate(8, 0.6, 1, nov16); ok('catch-up date is finite when you gain on the lecture', cu.possible && cu.days > 30 && cu.days < 400, cu.days); ok('no catch-up when too slow', !catchUpDate(8, 0.1, 1).possible); ok('level already', catchUpDate(0, 0.6).days === 0);
console.log(`${n} checks`); console.log(fails ? `${fails} FAILED` : 'ALL OK'); process.exit(fails ? 1 : 0);
