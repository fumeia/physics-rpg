// Streak freeze, week keys and the XP hook (pure logic, no browser). Usage: node test/store-check.mjs
import { store, weekKey, setXpHook } from '../src/store.js';
let fails = 0; const ck = (n, c) => { if (!c) fails++; console.log(`${c ? 'PASS' : 'FAIL'} ${n}`); };
const iso = (d) => d.toISOString().slice(0, 10), add = (s, n) => { const d = new Date(s + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return iso(d); };
ck('week key Monday 2026-10-19 is W43', weekKey('2026-10-19') === '2026-W43');
ck('week key Sunday 2026-10-25 is W43', weekKey('2026-10-25') === '2026-W43');
ck('week key Monday 2026-10-26 is W44', weekKey('2026-10-26') === '2026-W44');
ck('week key 2027-01-01 (Friday) belongs to 2026-W53', weekKey('2027-01-01') === '2026-W53');
ck('week key 2024-12-30 belongs to 2025-W01', weekKey('2024-12-30') === '2025-W01');

const done = (date, id) => store.completeMission(date, id, 10, add(date, -1), add(date, -2));
store.reset();
// Mon 19 .. : play Monday and Tuesday, skip Wednesday, play Thursday: the freeze saves the streak
done('2026-10-19', 'a'); done('2026-10-20', 'b');
ck('two days in a row: streak 2', store.streak.count === 2);
ck('freeze is available at the start of the week', store.freezeAvailable('2026-10-21'));
let now = store.streakNow('2026-10-21', '2026-10-20', '2026-10-19'); ck('the day after: alive, not saved', now.alive && !now.saved && now.count === 2);
now = store.streakNow('2026-10-22', '2026-10-21', '2026-10-20'); ck('one missed day: alive only thanks to the freeze', now.alive && now.saved && now.count === 2);
done('2026-10-22', 'c');
ck('after one missed day the streak continues (3)', store.streak.count === 3);
ck('the freeze is used up for this week', !store.freezeAvailable('2026-10-23') && store.freezeJustUsed === '2026-10-22');
// miss Friday again: no second freeze this week, Saturday restarts at 1
now = store.streakNow('2026-10-24', '2026-10-23', '2026-10-22'); ck('second missed day in the same week: streak is gone', !now.alive && now.count === 0);
done('2026-10-24', 'd'); ck('streak restarts at 1', store.streak.count === 1);
// next week the freeze is back
ck('freeze is back on Monday', store.freezeAvailable('2026-10-26'));
done('2026-10-26', 'e'); ck('Saturday to Monday (Sunday missed) uses the new week\'s freeze: streak 2', store.streak.count === 2 && store.freezeUsed.week === '2026-W44');
done('2026-10-28', 'f'); ck('a second miss in that week (Tuesday) breaks it: restarts at 1', store.streak.count === 1);
store.reset(); done('2026-11-09', 'g'); done('2026-11-11', 'h'); ck('Mon, skip Tue, Wed: forgiven, streak 2', store.streak.count === 2);
ck('same mission twice does not count twice', done('2026-11-11', 'h') === false);
// two missed days always break it
store.reset(); done('2026-11-02', 'a'); now = store.streakNow('2026-11-05', '2026-11-04', '2026-11-03'); ck('two missed days break the streak', !now.alive);
done('2026-11-05', 'b'); ck('and it restarts at 1', store.streak.count === 1);

let got = []; setXpHook((n) => got.push(n)); store.reset(); store.addXp(20); store.addXp(-5); store.addXp(0);
ck('xp hook gets every change (not zero)', got.join() === '20,-5');
console.log(fails ? `${fails} FAILED` : 'ALL PASSED'); process.exit(fails ? 1 : 0);
