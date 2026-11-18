// Offline play on two devices: the three-way merge keeps everything done on either side.
import { mergeSaves } from '../src/merge.js';
let bad = 0; const ck = (m, ok) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${m}`); if (!ok) bad++; };
const base = { xp: 100, updated: 1000, solved: { a: { at: 1 }, f: { at: 2, failed: true } }, reviews: { r1: { box: 0, due: 5 }, r2: { box: 1, due: 9 } }, xpLog: { d1: 100 },
  flags: { active: { d1: 600 }, activeBy: { d1: { 'qm|calc': 600 } }, activity: [{ t: 10, id: 'a' }], 'seen-q': ['q1'], settings: { theme: 'dark' }, run: { stops: ['x', 'y'] } }, streak: { last: 'd1', count: 3 }, missions: { d1: { done: { m1: true }, xp: 20 } } };
const local = JSON.parse(JSON.stringify(base)), remote = JSON.parse(JSON.stringify(base));
// phone, offline: solves b, passes f, earns 30 XP, studies 300 s, graduates review r1, sees q2, new day d2
Object.assign(local, { xp: 130, updated: 2000 }); local.solved.b = { at: 20 }; local.solved.f = { at: 21 }; local.xpLog.d1 = 130; local.flags.active.d1 = 900; local.flags.activeBy.d1['qm|calc'] = 900;
delete local.reviews.r1; local.flags.activity.push({ t: 20, id: 'b' }); local.flags['seen-q'].push('q2'); local.flags.activeBy.d2 = { 'astro|read': 60 }; local.flags.run = { stops: ['p'] };
// laptop, offline: solves c, earns 50 XP, studies 120 s, fails r2 again, changes the theme, streak to d2
Object.assign(remote, { xp: 150, updated: 3000 }); remote.solved.c = { at: 30 }; remote.xpLog.d1 = 150; remote.flags.active.d1 = 720; remote.flags.activeBy.d1['qm|calc'] = 720;
remote.reviews.r2 = { box: 0, due: 40, fails: 1 }; remote.flags.activity.push({ t: 30, id: 'c' }); remote.flags.settings.theme = 'light'; remote.streak = { last: 'd2', count: 4 }; remote.flags.activeBy.d2 = { 'astro|read': 30 };
remote.missions.d2 = { done: { m2: true }, xp: 10 };
const m = mergeSaves(base, local, remote);
ck('XP gains of both devices add up (100 + 30 + 50)', m.xp === 180 && m.xpLog.d1 === 180);
ck('study seconds add up', m.flags.active.d1 === 1020 && m.flags.activeBy.d1['qm|calc'] === 1020 && m.flags.activeBy.d2['astro|read'] === 90);
ck('everything solved on either side is kept', ['a', 'b', 'c'].every((k) => m.solved[k]) && !m.solved.f.failed);
ck('a review graduated on one side stays graduated', !m.reviews.r1);
ck('a review failed again on the other side is kept', m.reviews.r2.box === 0 && m.reviews.r2.fails === 1);
ck('activity logs are joined in time order', m.flags.activity.map((x) => x.id).join() === 'a,b,c');
ck('seen lists are joined', m.flags['seen-q'].join() === 'q1,q2');
ck('a setting changed on one side only wins', m.flags.settings.theme === 'light');
ck('streak: the later day wins', m.streak.last === 'd2' && m.streak.count === 4);
ck('missions of a new day are kept', m.missions.d2.done.m2 && m.missions.d1.xp === 20);
ck('a run changed only on one side wins', m.flags.run.stops.join() === 'p');
const n = mergeSaves(null, { xp: 50, solved: { a: { at: 1 } }, xpLog: { d: 50 }, updated: 1 }, { xp: 80, solved: { b: { at: 2 } }, xpLog: { d: 80 }, updated: 2 });
ck('without a base: counters take the larger value, nothing is dropped', n.xp === 80 && n.xpLog.d === 80 && n.solved.a && n.solved.b);
const del = mergeSaves({ a: { x: 1 }, updated: 1 }, { updated: 2 }, { a: { x: 2 }, updated: 3 });
ck('deleted on one side but changed on the other: the change is kept', del.a?.x === 2);
const eq = mergeSaves({ xp: 10, xpLog: { d: 10 }, updated: 1 }, { xp: 20, xpLog: { d: 10, e: 5 }, updated: 2 }, { xp: 20, xpLog: { d: 10, e: 5 }, updated: 3 });
ck('the same gain on both devices still counts twice (10 + 10 + 10), also on a new day (5 + 5)', eq.xp === 30 && eq.xpLog.e === 10);
console.log(bad ? `${bad} FAILED` : 'ALL OK'); process.exit(bad ? 1 : 0);
