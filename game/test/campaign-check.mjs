// Catch-up campaign logic on the real content: weeks are built for all three courses, every id exists once, positions and
// "weeks behind" react to progress and to weeks marked as known, and the daily run is sensible. Usage: node test/campaign-check.mjs
import { readFileSync, existsSync } from 'node:fs';
import { buildWeeks, weekStatus, position, lectureWeek, taughtWeeks, buildRun, catchUpDate } from '../src/campaign.js';
let fails = 0, n = 0; const ok = (name, c, x = '') => { n++; if (!c) { fails++; console.log(`FAIL ${name} ${x}`); } };
const J = (p) => JSON.parse(readFileSync(new URL('../content/' + p, import.meta.url)));
const cfg = J('campaign.json'), catalog = [], sheets = {}, encOfMap = new Map();
for (const id of ['qm', 'solid-state', 'astrophysics']) {
  const idx = J(`${id}/index.json`), rooms = idx.rooms.map((slug) => ({ slug, ...J(`${id}/${slug}.json`) }));
  for (const f of idx.extras || []) { const x = J(`${id}/${f}`); for (const it of x.items || []) rooms.find((r) => r.slug === it.room).encounters.push(it.enc); if (x.sheets) { sheets[id] = x; for (const sh of x.sheets) for (const q of sh.questions.filter((q) => q.enc)) rooms.find((r) => r.slug === q.room).encounters.push(q.enc); } }
  catalog.push({ id, rooms }); for (const r of rooms) for (const e of r.encounters) encOfMap.set(e.id, e);
  for (const sh of sheets[id]?.sheets || []) for (const q of sh.questions) if (!q.enc) { q.enc = encOfMap.get(q.ref); q.enc.sheet = true; } // ref: an existing exercise (astro plan)
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
const run = buildRun({ weeks, isPassed: none, known, taught: 9, due: ['qm-wm-c1', 'ss-lat-c1', 'astro-light-c1'].filter((x) => encOfMap.has(x)), minutes: 45, encOf, mixDay: 1 }); // a day without the mixed-in exam problem (those alternate on normal runs)
ok('run has 3-7 stops', run.stops.length >= 3 && run.stops.length <= 7, run.stops.length); ok('run fits the time', run.minutes <= 65, run.minutes);
ok('progress first: due respawns come after the catch-up, at the end', run.stops[0].kind !== 'warmup' && (!run.stops.some((x) => x.kind === 'warmup') || run.stops.findIndex((x) => x.kind === 'warmup') > run.stops.findIndex((x) => ['read', 'theory', 'sheet'].includes(x.kind))), run.stops.map((x) => x.kind).join());
const firstNew = run.stops.find((s) => s.kind !== 'warmup' && s.kind !== 'defend'); ok('first new stop is solid state week 4 (furthest behind), its script reading first', firstNew.course === 'solid-state' && (w4.reading || []).concat(w4.theory, w4.practice).includes(firstNew.id) && (!w4.reading?.length || firstNew.kind === 'read'), JSON.stringify(firstNew));
ok('reading cards never decide whether a week is done', !ss.some((w) => w.theory.concat(w.practice).some((id) => encOf(id)?.reading)));
console.log(run.stops.map((s) => s.kind + ':' + s.id + ':' + s.min).join(' ')); { const iT = run.stops.findIndex((s) => ['read', 'theory'].includes(s.kind) && s.course === 'solid-state'), iS = run.stops.findIndex((s) => s.kind === 'sheet' && s.course === 'solid-state'); ok('reading/theory comes before its sheet question (if the run has one)', iT >= 0 && (iS < 0 || iT < iS)); }
{ const rr = buildRun({ weeks, isPassed: none, known, taught: 9, minutes: 45, encOf, reread: [{ id: 'ss-read-01', course: 'solid-state', label: 'week 1' }] });
  ok('second pass: the chosen card of an earlier week is in the run', rr.stops.some((s) => s.kind === 'reread' && s.id === 'ss-read-01'), rr.stops.map((s) => s.kind + ':' + s.id).join(' ')); }

ok('run is deterministic', JSON.stringify(buildRun({ weeks, isPassed: none, known, taught: 9, due: [], minutes: 45, encOf })) === JSON.stringify(buildRun({ weeks, isPassed: none, known, taught: 9, due: [], minutes: 45, encOf })));
const short = buildRun({ weeks, isPassed: none, known, taught: 9, due: [], minutes: 20, encOf }); ok('short run is short', short.stops.length >= 1 && short.minutes <= 30, short.minutes + ' ' + short.stops.map((s) => s.kind + ':' + s.min).join() + ' ' + JSON.stringify(short.share));
const long = buildRun({ weeks, isPassed: none, known, taught: 9, due: [], minutes: 90, encOf }); ok('a long run covers a second course', new Set(long.stops.map((s) => s.course).filter(Boolean)).size >= 2, long.stops.map((s) => s.course).join());
{ const lr = buildRun({ weeks, isPassed: none, known, taught: 9, due: ['qm-wm-c1', 'ss-lat-c1'].filter((x) => encOfMap.has(x)), minutes: 90, encOf }); const iR = lr.stops.findIndex((x) => x.kind === 'warmup'); ok('long run: reviews come at the end, after all catch-up stops', iR > 0 && lr.stops.slice(iR).every((x) => ['warmup', 'defend', 'boss'].includes(x.kind)), lr.stops.map((x) => x.kind).join()); } ok('long run is longer and has exam practice (a mixed-in old-exam problem or the finisher)', long.minutes > run.minutes && long.stops.some((s) => ['exam', 'boss'].includes(s.kind)), long.stops.map((s) => s.kind).join());
{ // every card of the game sits in exactly one week; old-exam problems are mixed into runs before a course is caught up
  for (const [cid, ws] of Object.entries(weeks)) { const all = ws.flatMap((w) => [...w.theory, ...w.practice, ...(w.reading || []), ...w.extra, ...w.exam]); ok(`${cid}: every card in one week`, new Set(all).size === all.length);
    const core = catalog.find((c) => c.id === cid).rooms.flatMap((r) => r.encounters).filter((e) => e.type !== 'sandbox' && !e.sim && !e.synthetic && !(e.book && !e.sheet)); ok(`${cid}: no card left without a week (${core.length - core.filter((e) => all.includes(e.id)).length} missing)`, core.every((e) => all.includes(e.id))); }
  const lr2 = buildRun({ weeks, isPassed: none, known, taught: 9, minutes: 90, encOf });
  ok('a long run mixes in an old-exam problem while the course is still behind', lr2.stops.some((s) => s.kind === 'exam'), lr2.stops.map((s) => s.kind).join());
  const r45 = [0, 1].map((d) => buildRun({ weeks, isPassed: none, known, taught: 9, minutes: 45, encOf, mixDay: d }).stops.map((s) => s.kind));
  ok('normal runs alternate: an old-exam problem every other day, another card in between', r45.some((k) => k.includes('exam')) && r45.some((k) => k.includes('extra')), JSON.stringify(r45));
}
const allDone = buildRun({ weeks, isPassed: () => true, known, taught: 9, due: [], minutes: 45, encOf }); ok('everything passed: empty run', allDone.stops.length === 0);
const soon = buildRun({ weeks, isPassed: none, known, taught: 9, due: [], minutes: 45, encOf, dueSoon: { course: 'qm', ids: ['qm-sheet-s9q1'] } }); ok('a sheet due soon comes first', soon.stops[0].id === 'qm-sheet-s9q1');
const near = buildRun({ weeks, isPassed: none, known: { 'solid-state': new Set([1, 2, 3, 4, 5, 6, 7]), qm: new Set([1, 2, 3, 4, 5, 6, 7]), astrophysics: new Set([1, 2, 3, 4, 5, 6, 7]) }, taught: 9, due: [], minutes: 45, encOf, examDays: { qm: 60, 'solid-state': 20, astrophysics: 60 } });
ok('equal backlog: the course with the first exam comes first', near.stops.find((s) => s.course)?.course === 'solid-state', near.stops.map((s) => s.course).join());
const near2 = buildRun({ weeks, isPassed: none, known: { 'solid-state': new Set([1, 2, 3, 4, 5, 6, 7]), qm: new Set([1, 2, 3, 4, 5, 6, 7]), astrophysics: new Set([1, 2, 3, 4, 5, 6, 7]) }, taught: 9, due: [], minutes: 45, encOf, examDays: { qm: 15, 'solid-state': 60, astrophysics: 60 } });
ok('and it flips with the dates', near2.stops.find((s) => s.course)?.course === 'qm', near2.stops.map((s) => s.course).join());
// catch-up date
const cu = catchUpDate(8, 0.6, 1, nov16); ok('catch-up date is finite when you gain on the lecture', cu.possible && cu.days > 30 && cu.days < 400, cu.days); ok('no catch-up when too slow', !catchUpDate(8, 0.1, 1).possible); ok('level already', catchUpDate(0, 0.6).days === 0);
console.log(`${n} checks`); console.log(fails ? `${fails} FAILED` : 'ALL OK'); process.exit(fails ? 1 : 0);
