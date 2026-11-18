// Three-way merge of two saves of the same profile (this device and the server), so that playing offline on several devices
// loses nothing. base is the save both sides started from (the last one this device synced), or null when unknown.
//   - a value changed on one side only: that side wins (a deletion on one side counts as a change, e.g. a review that graduated)
//   - changed on both sides:
//       counters (XP, XP per day, study seconds, mission XP): both gains are added  (base + Δlocal + Δremote); without a base: the larger
//       solved: a pass beats a fail, otherwise the earlier one stays
//       streak: the later day, then the longer streak
//       logs (arrays of entries with a time t / s / at): the union, sorted by time, without duplicates
//       lists of plain values (seen question ids, …): the union
//       anything else: the side that was saved last
//   - deleted on one side but changed on the other: the changed value is kept (nothing done is ever thrown away)
// Pure and synchronous: tested in test/merge-check.mjs.

const isObj = (x) => x !== null && typeof x === 'object' && !Array.isArray(x);
const same = (a, b) => a === b || JSON.stringify(a) === JSON.stringify(b);
const COUNTERS = [/^xp$/, /^xpLog\.[^.]+$/, /^flags\.active\.[^.]+$/, /^flags\.study\.[^.]+$/, /^flags\.activeBy\.[^.]+\.[^.]+$/, /^missions\.[^.]+\.xp$/];
const isCounter = (p) => COUNTERS.some((r) => r.test(p));
const timeOf = (e) => (isObj(e) ? e.t ?? e.s ?? e.at ?? null : null);

function mergeArrays(l, r, newerLocal) {
  const all = [...l, ...r];
  if (all.length && all.every((e) => typeof timeOf(e) === 'number')) { // a log: union by content, in time order
    const seen = new Set(), out = [];
    for (const e of all) { const k = JSON.stringify(e); if (!seen.has(k)) { seen.add(k); out.push(e); } }
    return out.sort((a, b) => timeOf(a) - timeOf(b));
  }
  if (all.every((e) => e === null || typeof e !== 'object')) { const out = [...l]; for (const e of r) if (!out.includes(e)) out.push(e); return out; }
  return newerLocal ? l : r;
}

function both(path, b, l, r, newerLocal, hasBase) {
  if (typeof l === 'number' && typeof r === 'number' && isCounter(path)) return hasBase ? (typeof b === 'number' ? b : 0) + (l - (typeof b === 'number' ? b : 0)) + (r - (typeof b === 'number' ? b : 0)) : Math.max(l, r);
  if (/^solved\.[^.]+$/.test(path) && isObj(l) && isObj(r)) { if (!!l.failed !== !!r.failed) return l.failed ? r : l; return (l.at || 0) <= (r.at || 0) ? l : r; }
  if (path === 'streak' && isObj(l) && isObj(r)) { const a = String(l.last || ''), c = String(r.last || ''); return a !== c ? (a > c ? l : r) : (l.count || 0) >= (r.count || 0) ? l : r; }
  if (Array.isArray(l) && Array.isArray(r)) return mergeArrays(l, r, newerLocal);
  if (isObj(l) && isObj(r)) return mergeObj(path, isObj(b) ? b : undefined, l, r, newerLocal, hasBase);
  return newerLocal ? l : r;
}

function mergeObj(path, b, l, r, newerLocal, hasBase) {
  if (hasBase && !b) b = {}; // with a known base, a part missing from it was created later on both sides
  const out = {}, keys = new Set([...Object.keys(l), ...Object.keys(r), ...(b ? Object.keys(b) : [])]);
  for (const k of keys) {
    const p = path ? `${path}.${k}` : k, bv = b?.[k], inL = k in l, inR = k in r, lv = l[k], rv = r[k];
    if (inL && inR) { const kb = hasBase && k in b;
      // counters that grew by the same amount on both devices are still two separate gains
      if (kb && typeof lv === 'number' && typeof rv === 'number' && typeof bv === 'number' && lv !== bv && rv !== bv && isCounter(p)) { out[k] = bv + (lv - bv) + (rv - bv); continue; }
      if (hasBase && !kb && typeof lv === 'number' && typeof rv === 'number' && isCounter(p)) { out[k] = lv + rv; continue; }
      const v = !(isObj(lv) && isObj(rv)) && same(lv, rv) ? lv : kb && same(bv, lv) ? rv : kb && same(bv, rv) ? lv : both(p, bv, lv, rv, newerLocal, hasBase); out[k] = v; continue; }
    const v = inL ? lv : rv, inBase = hasBase && k in b;
    if (!inBase) { out[k] = v; continue; } // new on one side
    if (same(bv, v)) continue; // the other side deleted it and this side did not touch it: the deletion stands
    out[k] = v; // deleted on one side, changed on the other: keep the change
  }
  return out;
}

export function mergeSaves(base, local, remote) {
  const lu = local?.updated || 0, ru = remote?.updated || 0, hasBase = isObj(base);
  const m = mergeObj('', hasBase ? base : undefined, local || {}, remote || {}, lu >= ru, hasBase);
  m.updated = Math.max(lu, ru, Date.now());
  return m;
}
