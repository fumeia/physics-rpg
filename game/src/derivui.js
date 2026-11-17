// Derivations (QM exams ask them and allow no aids). One screen with:
//   Map        the derivations old exams ask, sorted by how often, with your rung and how well you still remember it
//   Ladder     four rungs, one per visit: put the lines in order, fill the gaps, write it from the moves, write it from a blank page
//   Moves      recall only the two to four key moves (what lets you regenerate the lines in the exam)
//   Why?       "why is this step allowed?" on the steps that are usually copied without understanding
//   Variant    the same derivation with one assumption changed
//   Backwards  from the result, what must the line before be?
//   Outline    two minutes: start, moves, result
// Content: content/qm/derivations.json (notes/quantum-mechanics/build/derivations/build.py). Progress: flags.derivs {id: {lv, n, t}}.
import { store } from './store.js';
import { retention, notePass } from './memory.js';

const RUNGS = ['Put the lines in order', 'Fill the gaps', 'Write it from the moves', 'Write it from a blank page'];
const esc = (s) => String(s).replace(/</g, '&lt;');
const prog = () => store.val('derivs', {}) || {};
const lvOf = (id) => prog()[id]?.lv || 0;
const keep = (id) => { const p = prog()[id]; return p?.t ? retention(p) : 0; };
function save(id, { up = false } = {}) { const p = prog(), cur = p[id] || { lv: 0 }, m = notePass({ [id]: cur.t ? { n: cur.n || 1, t: cur.t } : undefined }, id); store.setVal('derivs', { ...p, [id]: { lv: Math.min(4, cur.lv + (up ? 1 : 0)), n: m[id].n, t: m[id].t } }); }
const shuffle = (n, seed) => { const a = [...Array(n).keys()]; let s = seed >>> 0 || 1; for (let i = n - 1; i > 0; i--) { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; const j = s % (i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
// the next derivation to climb: most exam-relevant first, among the ones not yet mastered (or mastered but fading)
// What the run should do today with a derivation: climb the ladder while it is not mastered; once mastered, rotate through the
// other modes (why, change one assumption, backwards, two minutes) so it stays alive and flexible.
export function runDeriv(items, day = new Date().getDate()) {
  const x = nextDeriv(items); if (!x) return null; const lv = lvOf(x.id);
  const mode = lv < 4 ? (lv >= 2 && day % 3 === 0 ? 'variant' : 'ladder') : ['why', 'variant', 'back', 'outline'][day % 4];
  const label = { ladder: `rung ${lv + 1} of the ladder`, variant: 'change one assumption', why: 'why is this step allowed?', back: 'backwards', outline: 'two-minute outline' }[mode];
  return { id: x.id, title: x.title, mode, label };
}
export function nextDeriv(items) { return items.filter((d) => lvOf(d.id) < 4 || keep(d.id) < 0.6).sort((a, b) => b.exam.count - a.exam.count || lvOf(a.id) - lvOf(b.id))[0] || null; }

export function renderDerivs(host, ctx) {
  const { items, M } = ctx; let view = null, mode = 'ladder', st = {}, timer = 0;
  const d = () => items.find((x) => x.id === view);
  const selfCheck = (label = 'I had it') => `<div class="row"><button class="go" data-ok="1">${label}</button><button class="chip btn" data-ok="0">Not quite</button></div>`;
  function mapHtml() {
    const nx = nextDeriv(items);
    return `<p class="src">The derivations old QM exams ask most often (number of the last ${items[0]?.exam.of || 14} exams with the topic). Climb each ladder one rung per visit; a derivation is mastered on the top rung and comes back when it fades. Write on paper; the game only checks you.</p>
      <div class="row">${nx ? `<button class="go" data-open="${nx.id}">Next: ${esc(nx.title)} (rung ${Math.min(4, lvOf(nx.id) + 1)})</button>` : ''}<button class="chip btn" data-outline>Two-minute outlines: three in a row</button></div>
      <div class="dv-map">${items.map((x) => { const lv = lvOf(x.id), k = keep(x.id); return `<button class="dv-row" data-open="${x.id}"><span class="dv-t">${M(x.title)}</span><span class="dv-ex" title="${esc(x.exam.label)}">${x.exam.count}/${x.exam.of}</span><span class="dv-rungs">${[0, 1, 2, 3].map((i) => `<i class="${i < lv ? 'on' : ''}"></i>`).join('')}</span><span class="fg-bar" title="how well you probably still remember it"><i style="width:${Math.round(100 * k)}%"></i></span></button>`; }).join('')}</div>`;
  }
  function detailHtml() {
    const x = d(), lv = lvOf(x.id), tabs = [['ladder', `Ladder (rung ${Math.min(4, lv + 1)})`], ['moves', 'Moves'], ['why', 'Why?'], ['variant', 'Change one assumption'], ['back', 'Backwards'], ['outline', 'Two minutes']];
    return `<div class="row"><button class="chip btn" data-map>\u2190 All derivations</button><span class="src">${esc(x.exam.label)}: in ${x.exam.count} of ${x.exam.of} old exams</span></div>
      <h3 class="dv-title">${M(x.title)}</h3><div class="row studytabs">${tabs.map(([k, l]) => `<button class="chip btn${mode === k ? ' cur' : ''}" data-mode="${k}">${l}</button>`).join('')}</div>
      <div class="fg-card"><div class="callout exam"><div class="ctitle">Goal</div>${M(x.goal)}</div>${body(x, lv)}</div>`;
  }
  const lineList = (x, idx, cls = '') => `<ol class="dv-lines ${cls}">${idx.map((i) => `<li value="${i + 1}">${M(x.lines[i])}</li>`).join('')}</ol>`;
  function body(x, lv) {
    if (mode === 'ladder') {
      const rung = Math.min(3, lv), head = `<p class="src">Rung ${rung + 1} of 4: <b>${RUNGS[rung]}</b>${lv >= 4 ? ' \u00b7 mastered: keep it alive on the top rung' : ''}</p>`;
      if (rung === 0) { st.order ||= shuffle(x.lines.length, Date.now()); st.placed ||= []; st.err ||= 0; const done = st.placed.length === x.lines.length;
        return head + `<p class="src">Click the lines in the right order. ${st.err} mistake${st.err === 1 ? '' : 's'} so far (at most one to pass).</p>${lineList(x, st.placed)}${done ? (st.err <= 1 ? '<p class="msg good">In order. Next visit: fill the gaps.</p><button class="go" data-pass>Climb to rung 2</button>' : '<p class="msg bad">Too many mistakes for this rung.</p><button class="go" data-retry>Again, reshuffled</button>') : `<div class="dv-pool">${st.order.filter((i) => !st.placed.includes(i)).map((i) => `<button class="opt dv-pick" data-pick="${i}">${M(x.lines[i])}</button>`).join('')}</div>`}`; }
      if (rung === 1) { const gaps = new Set([...x.whys.map((w) => w.at), Math.floor(x.lines.length / 2)]);
        return head + `<p class="src">Write the missing lines on paper, then reveal.</p><ol class="dv-lines">${x.lines.map((l, i) => `<li>${gaps.has(i) && !st.shown ? '<span class="dv-gap">write this line</span>' : M(l)}</li>`).join('')}</ol>${st.shown ? selfCheck('I had every gap') : '<button class="go" data-show>Reveal the gaps</button>'}`; }
      if (rung === 2) return head + `<p class="src">The moves are your only help. Write the whole derivation, then compare.</p><ul class="dv-moves">${x.moves.map((m) => `<li>${M(m)}</li>`).join('')}</ul>${st.shown ? lineList(x, x.lines.map((_, i) => i)) + selfCheck('Mine was complete and correct') : '<button class="go" data-show>Show the reference</button>'}`;
      return head + `<p class="src">Only the goal. Write it all, then compare.</p>${st.shown ? lineList(x, x.lines.map((_, i) => i)) + selfCheck('Mine was complete and correct') : '<button class="go" data-show>Show the reference</button>'}`;
    }
    if (mode === 'moves') return `<p class="src">Write the two to four key moves as short phrases (not the lines). If you know the moves, you can regenerate the lines.</p>${st.shown ? `<ul class="dv-moves">${x.moves.map((m) => `<li>${M(m)}</li>`).join('')}</ul>${selfCheck('I had the moves')}` : '<button class="go" data-show>Show the moves</button>'}`;
    if (mode === 'why') { st.wi ||= 0; const w = x.whys[st.wi % x.whys.length]; st.perm ||= shuffle(w.options.length, Date.now());
      return `<p class="src">Step ${w.at + 1} of the derivation:</p><div class="dv-step">${M(x.lines[w.at])}</div><h4>${M(w.q)}</h4><div class="dv-pool">${st.perm.map((k) => `<button class="opt${st.ans !== undefined ? (k === w.correct ? ' right' : k === st.ans ? ' wrong' : '') : ''}" data-ans="${k}" ${st.ans !== undefined ? 'disabled' : ''}>${M(w.options[k])}</button>`).join('')}</div>${st.ans !== undefined ? `<p class="msg ${st.ans === w.correct ? 'good' : 'bad'}">${M(w.explain)}</p>${x.whys.length > 1 ? '<button class="go" data-wnext>Next step</button>' : ''}` : ''}`; }
    if (mode === 'variant') { const v = x.variant;
      return `<div class="callout pitfall"><div class="ctitle">Changed</div>${M(v.change)}</div><p><b>${M(v.task)}</b></p><p class="src">Redo the derivation with the change. Which move breaks, which survive?</p>${st.step >= 1 ? `<div class="callout intuition"><div class="ctitle">What changes</div>${M(v.changed)}</div>` : '<button class="go" data-vstep>Show what changes</button>'}${st.step >= 2 ? `<div class="callout exam"><div class="ctitle">Result</div>${M(v.result)}</div>${selfCheck('I got it')}` : st.step >= 1 ? '<button class="go" data-vstep>Show the result</button>' : ''}`; }
    if (mode === 'back') { const n = x.lines.length; st.k ??= n - 1;
      return `<p class="src">Start from the end. What must the line before be? Write it, then reveal.</p>${lineList(x, x.lines.map((_, i) => i).filter((i) => i >= st.k), 'dv-back')}${st.k > 0 ? `<button class="go" data-prev>Reveal line ${st.k}</button>` : `<p class="msg good">Back at the start.</p>${selfCheck('I found most lines before revealing them')}`}`; }
    // outline
    const left = Math.max(0, 120 - Math.floor((Date.now() - (st.t0 ||= Date.now())) / 1000));
    return `<p class="src">Two minutes: write only the skeleton (where you start, the moves, the result).</p>${st.shown ? `<ul class="dv-moves">${x.moves.map((m) => `<li>${M(m)}</li>`).join('')}</ul><div class="dv-step">${M(x.lines[x.lines.length - 1])}</div>${selfCheck('My skeleton had all of it')}` : `<p class="fg-timer" data-dt>${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}</p><button class="go" data-show>Stop and compare</button>`}`;
  }
  function draw() {
    clearInterval(timer); host.innerHTML = view ? detailHtml() : mapHtml();
    const q = (s) => host.querySelectorAll(s);
    q('[data-open]').forEach((b) => (b.onclick = () => { view = b.dataset.open; mode = 'ladder'; st = {}; draw(); }));
    q('[data-map]').forEach((b) => (b.onclick = () => { view = null; draw(); }));
    q('[data-outline]').forEach((b) => (b.onclick = () => { const three = [...items].sort((a, c) => keep(a.id) - keep(c.id)).slice(0, 3).map((x) => x.id); st = { queue: three.slice(1) }; view = three[0]; mode = 'outline'; draw(); }));
    q('[data-mode]').forEach((b) => (b.onclick = () => { mode = b.dataset.mode; st = {}; draw(); }));
    q('[data-pick]').forEach((b) => (b.onclick = () => { const i = +b.dataset.pick; if (i === st.placed.length) st.placed.push(i); else { st.err++; b.classList.add('wrong'); setTimeout(() => b.classList.remove('wrong'), 500); return; } draw(); }));
    q('[data-retry]').forEach((b) => (b.onclick = () => { st = {}; draw(); }));
    q('[data-pass]').forEach((b) => (b.onclick = () => { save(view, { up: true }); store.addXp(10); ctx.onChange?.(); st = {}; draw(); }));
    q('[data-show]').forEach((b) => (b.onclick = () => { st.shown = true; draw(); }));
    q('[data-vstep]').forEach((b) => (b.onclick = () => { st.step = (st.step || 0) + 1; draw(); }));
    q('[data-prev]').forEach((b) => (b.onclick = () => { st.k--; draw(); }));
    q('[data-ans]').forEach((b) => (b.onclick = () => { st.ans = +b.dataset.ans; const w = d().whys[st.wi % d().whys.length]; if (st.ans === w.correct) store.addXp(2); draw(); }));
    q('[data-wnext]').forEach((b) => (b.onclick = () => { st = { wi: (st.wi || 0) + 1 }; draw(); }));
    q('[data-ok]').forEach((b) => (b.onclick = () => {
      const good = b.dataset.ok === '1', climbing = mode === 'ladder' && lvOf(view) < 4;
      if (good) { save(view, { up: climbing }); store.addXp(climbing ? 10 : 3); }
      ctx.onChange?.();
      if (mode === 'outline' && st.queue?.length) { view = st.queue[0]; st = { queue: st.queue.slice(1) }; draw(); return; }
      st = {}; if (good && mode === 'ladder') view = null; draw();
    }));
    const tm = host.querySelector('[data-dt]'); if (tm) timer = setInterval(() => { if (!tm.isConnected) { clearInterval(timer); return; } const left = Math.max(0, 120 - Math.floor((Date.now() - st.t0) / 1000)); tm.textContent = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`; if (!left) { st.shown = true; draw(); } }, 500);
  }
  if (ctx.start) { view = ctx.start; if (ctx.startMode) mode = ctx.startMode; } draw();
}
