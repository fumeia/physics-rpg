// The Forge (QM: no aids in the exam, so formulas must be in your head) and My summary (solid state and astrophysics: five
// pages are allowed). Forge: write a formula from a blank prompt, reveal, self-check; each formula has its own memory strength
// (memory.js), so weak ones come back sooner. Rebuild: the chain from one anchor to the formula. Blank page: ten minutes, one
// chapter, everything you know, then tick it off. My summary: pin the formulas you earned to five pages and print them.
import { store } from './store.js';
import { retention, notePass } from './memory.js';
import { deck } from './cards.js';

const esc = (s) => String(s).replace(/</g, '&lt;');
const fmem = () => store.val('forge', {}) || {};
const strength = (id, now = Date.now()) => retention(fmem()[id], now);
// the formulas of the forge that are due: never written, or probably forgotten (below 70 %), weakest first
export function forgeDue(items, now = Date.now()) { return items.map((it) => ({ it, r: strength(it.id, now), seen: !!fmem()[it.id] })).filter((x) => x.r < 0.7).sort((a, b) => a.seen - b.seen || a.r - b.r).map((x) => x.it); }
export const forgeStats = (items) => ({ total: items.length, solid: items.filter((it) => strength(it.id) >= 0.7).length, due: forgeDue(items).length });
function grade(id, had) { const m = fmem(); store.setVal('forge', had ? notePass(m, id) : { ...m, [id]: { n: 1, t: Date.now() - 5 * 86400000 } }); } // a miss: back soon

// ---- summary: pinned formulas per course on five pages, plus a free note per page
const PAGES = 5, LINES = 34; // formulas per page that stay readable in two columns
export const summaryOf = (cid) => { const s = (store.val('summary', {}) || {})[cid] || {}; return { pins: s.pins || {}, notes: s.notes || {} }; }; // pins: {cardKey: page 1..5}
function saveSummary(cid, s) { store.setVal('summary', { ...(store.val('summary', {}) || {}), [cid]: s }); }
export function pinned(cid, catalog, isPassed) { const s = summaryOf(cid); return deck(catalog, isPassed).filter((c) => c.course === cid && s.pins[c.key]).map((c) => ({ ...c, page: s.pins[c.key] })); }
export function pin(cid, key, page) { const s = summaryOf(cid); if (page) s.pins[key] = page; else delete s.pins[key]; saveSummary(cid, s); }

export function renderForge(host, ctx) {
  // ctx: { items (content/qm/forge.json), rooms: QM rooms [{slug, title, encounters}], M, onChange }
  const { items, M } = ctx; let mode = 'recall', queue = [], cur = null, shown = false, step = 0, page = null;
  const st = () => forgeStats(items);
  const head = () => { const s = st(); return `<div class="fg-head"><div><b>${s.solid} / ${s.total}</b><span>formulas you can probably still write</span></div><div><b>${s.due}</b><span>due now</span></div><div class="row">${[['recall', 'Write from memory'], ['rebuild', 'Rebuild it'], ['blank', 'Blank page'], ['all', 'All formulas']].map(([k, l]) => `<button class="chip btn${mode === k ? ' cur' : ''}" data-fm="${k}">${l}</button>`).join('')}</div></div>`; };
  const next = () => { if (!queue.length) queue = forgeDue(items).slice(0, 5); cur = queue.shift() || null; shown = false; step = 0; };
  function body() {
    if (mode === 'all') return `<div class="maplist">${items.map((it) => `<div class="fg-row"><span class="fg-bar"><i style="width:${Math.round(100 * strength(it.id))}%"></i></span><b>${esc(it.name)}</b><details><summary>show</summary>${M(`$$${it.tex}$$`)}</details></div>`).join('')}</div>`;
    if (mode === 'blank') return blankHtml();
    if (!cur) return `<p class="msg good">Nothing is due: every formula is above 70%. Come back tomorrow, or use “All formulas”.</p>`;
    if (mode === 'rebuild') return `<div class="fg-card"><div class="src">Rebuild it: do not recall the result, regenerate it</div><h3>${esc(cur.name)}</h3><p>${M(cur.anchor)}</p><ol>${cur.steps.slice(0, step).map((s) => `<li>${M(s)}</li>`).join('')}</ol>
      ${step < cur.steps.length ? `<p class="src">Write the next step yourself, then compare.</p><button class="go" data-fstep>Show step ${step + 1} of ${cur.steps.length}</button>` : `<div class="fg-tex">${M(`$$${cur.tex}$$`)}</div><div class="row"><button class="go" data-had="1">I could rebuild it</button><button class="chip btn" data-had="0">I got stuck</button></div>`}</div>`;
    return `<div class="fg-card"><div class="src">Write it on paper from memory. No peeking.</div><h3>${esc(cur.name)}</h3>
      ${shown ? `<div class="fg-tex">${M(`$$${cur.tex}$$`)}</div><p class="src">Compare every symbol, sign and factor.</p><div class="row"><button class="go" data-had="1">I had it exactly</button><button class="chip btn" data-had="0">Not quite</button><button class="chip btn" data-fm="rebuild">Show me how to rebuild it</button></div>` : '<button class="go" data-freveal>I wrote it: show the formula</button>'}</div>`;
  }
  // blank page: one QM room, a timer, then a checklist made of that room's lesson equations
  function blankHtml() {
    if (!page) return `<p>One empty page, ten minutes, one chapter: write down everything you know (definitions, formulas, the standard derivations). Then tick it against the list. This is the exam condition for QM.</p><div class="row wrap">${ctx.rooms.map((r) => `<button class="chip btn" data-fpage="${r.slug}">${esc(r.title)}</button>`).join('')}</div>${(store.val('blankLog', []) || []).slice(-5).reverse().map((x) => `<div class="src">${x.date}: ${esc(x.title)} — ${x.got} of ${x.of}</div>`).join('')}`;
    const r = ctx.rooms.find((x) => x.slug === page.slug), eqs = r.encounters.filter((e) => e.type === 'lesson').flatMap((e) => (e.blocks || []).filter((b) => b.kind === 'eq' && b.tex).map((b) => ({ lesson: e.title, tex: b.tex })));
    if (!page.done) { const left = Math.max(0, 600 - Math.floor((Date.now() - page.t0) / 1000)); return `<div class="fg-card"><h3>Blank page: ${esc(r.title)}</h3><p class="fg-timer" data-ftimer>${String(Math.floor(left / 60)).padStart(2, '0')}:${String(left % 60).padStart(2, '0')}</p><p class="src">Write on paper. Nothing is shown until you stop.</p><button class="go" data-fstop>I am done: show the checklist</button></div>`; }
    return `<div class="fg-card"><h3>Checklist: ${esc(r.title)}</h3><p class="src">Tick what was on your page, correct in every symbol.</p>${eqs.map((q, i) => `<label class="fg-check"><input type="checkbox" data-fck="${i}"> <span><span class="src">${esc(q.lesson)}</span>${M(`$$${q.tex}$$`)}</span></label>`).join('')}<button class="go" data-fgrade="${eqs.length}">Finish</button></div>`;
  }
  let timer = 0;
  function draw() {
    clearInterval(timer); host.innerHTML = head() + body();
    host.querySelectorAll('[data-fm]').forEach((b) => (b.onclick = () => { mode = b.dataset.fm; if (mode === 'recall' || mode === 'rebuild') { if (!cur) next(); shown = false; step = 0; } draw(); }));
    const rv = host.querySelector('[data-freveal]'); if (rv) rv.onclick = () => { shown = true; draw(); };
    const stp = host.querySelector('[data-fstep]'); if (stp) stp.onclick = () => { step++; draw(); };
    host.querySelectorAll('[data-had]').forEach((b) => (b.onclick = () => { grade(cur.id, b.dataset.had === '1'); if (b.dataset.had === '1') store.addXp(3); next(); ctx.onChange?.(); draw(); }));
    host.querySelectorAll('[data-fpage]').forEach((b) => (b.onclick = () => { page = { slug: b.dataset.fpage, t0: Date.now(), done: false }; draw(); }));
    const sp = host.querySelector('[data-fstop]'); if (sp) sp.onclick = () => { page.done = true; draw(); };
    const tm = host.querySelector('[data-ftimer]'); if (tm) timer = setInterval(() => { if (!tm.isConnected) { clearInterval(timer); return; } const left = Math.max(0, 600 - Math.floor((Date.now() - page.t0) / 1000)); tm.textContent = `${String(Math.floor(left / 60)).padStart(2, '0')}:${String(left % 60).padStart(2, '0')}`; if (!left) { page.done = true; draw(); } }, 1000);
    const gr = host.querySelector('[data-fgrade]'); if (gr) gr.onclick = () => { const got = host.querySelectorAll('[data-fck]:checked').length, of = +gr.dataset.fgrade, r = ctx.rooms.find((x) => x.slug === page.slug); const d = new Date(); store.setVal('blankLog', [...(store.val('blankLog', []) || []), { date: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`, slug: page.slug, title: r.title, got, of }].slice(-60)); store.addXp(Math.round(30 * got / Math.max(1, of))); page = null; ctx.onChange?.(); draw(); };
  }
  next(); draw();
}

export function renderSummary(host, ctx) {
  // ctx: { catalog, isPassed, courses: [{id, name}] (the courses that allow a summary), M }
  const { M } = ctx; let cid = ctx.courses[0].id;
  function draw() {
    const s = summaryOf(cid), cards = deck(ctx.catalog, ctx.isPassed).filter((c) => c.course === cid), per = Array.from({ length: PAGES }, (_, i) => cards.filter((c) => s.pins[c.key] === i + 1));
    const byRoom = {}; for (const c of cards) (byRoom[c.roomTitle] ||= []).push(c);
    host.innerHTML = `<div class="row">${ctx.courses.map((c) => `<button class="chip btn${c.id === cid ? ' cur' : ''}" data-sc="${c.id}">${esc(c.name)}</button>`).join('')}<button class="go" data-sprint style="margin-left:auto">Print / save as PDF</button></div>
      <p class="src">Your five-page summary for the exam. Pin the formulas you earned (passing a lesson drops them as cards) to a page. In fights of this course you may look only at what is pinned here, so the sheet is tested before the exam.</p>
      <div class="sm-pages">${per.map((p, i) => `<div class="sm-page${p.length > LINES ? ' full' : ''}"><b>Page ${i + 1}</b><span class="src">${p.length} / ${LINES} formulas</span><span class="fg-bar"><i style="width:${Math.min(100, Math.round(100 * p.length / LINES))}%"></i></span><textarea data-snote="${i + 1}" placeholder="your own notes for this page (constants, sketches to draw, typical traps)">${esc(s.notes[i + 1] || '')}</textarea></div>`).join('')}</div>
      ${cards.length ? Object.entries(byRoom).map(([room, list]) => `<h3>${esc(room)}</h3>${list.map((c) => `<div class="sm-row${s.pins[c.key] ? ' on' : ''}"><div class="sm-tex">${M(`$$${c.tex}$$`)}<span class="src">${esc(c.lesson)}</span></div><div class="sm-pick">${[1, 2, 3, 4, 5].map((n) => `<button class="chip btn${s.pins[c.key] === n ? ' cur' : ''}" data-spin="${c.key}" data-pg="${n}">${n}</button>`).join('')}</div></div>`).join('')}`).join('') : '<p>No formula cards for this course yet. Pass a lesson and its formulas appear here.</p>'}`;
    host.querySelectorAll('[data-sc]').forEach((b) => (b.onclick = () => { cid = b.dataset.sc; draw(); }));
    host.querySelectorAll('[data-spin]').forEach((b) => (b.onclick = () => { const cur = summaryOf(cid).pins[b.dataset.spin]; pin(cid, b.dataset.spin, cur === +b.dataset.pg ? 0 : +b.dataset.pg); const y = host.parentElement?.scrollTop; draw(); if (host.parentElement) host.parentElement.scrollTop = y; }));
    host.querySelectorAll('[data-snote]').forEach((t) => { t.onkeydown = (e) => e.stopPropagation(); t.onchange = () => { const x = summaryOf(cid); x.notes[t.dataset.snote] = t.value.slice(0, 4000); saveSummary(cid, x); }; });
    host.querySelector('[data-sprint]').onclick = () => {
      const name = ctx.courses.find((c) => c.id === cid).name, css = [...document.querySelectorAll('link[rel=stylesheet]')].map((l) => `<link rel="stylesheet" href="${l.href}">`).join('');
      const html = per.map((p, i) => `<section><h2>${esc(name)} — page ${i + 1}</h2>${s.notes[i + 1] ? `<pre>${esc(s.notes[i + 1])}</pre>` : ''}<div class="cols">${p.map((c) => `<div class="f">${M(`$$${c.tex}$$`)}<small>${esc(c.lesson)}</small></div>`).join('')}</div></section>`).join('');
      const w = window.open('', '_blank'); if (!w) return;
      w.document.write(`<!doctype html><title>${esc(name)}: summary</title>${css}<style>body{background:#fff;color:#000;font:11px/1.3 sans-serif;margin:10mm}section{page-break-after:always}h2{font-size:13px;margin:0 0 6px}.cols{column-count:2;column-gap:8mm}.f{break-inside:avoid;border-bottom:1px solid #ccc;padding:2px 0}.f small{color:#555}.katex-display{margin:2px 0}pre{white-space:pre-wrap;font:inherit;border:1px solid #999;padding:4px}</style>${html}`); w.document.close(); setTimeout(() => w.print(), 600);
    };
  }
  draw();
}

// ---- Units duel: the unit of the result is given, one of four expressions can be right by dimensions alone. One question at
// a time with a clock (seconds from the content file); the options are shuffled; the explanation shows after every answer.
export function renderUnits(host, ctx) {
  const { items, seconds = 75, M } = ctx; let order = items.map((_, i) => i).sort(() => Math.random() - 0.5), i = 0, right = 0, streak = 0, t0 = 0, timer = 0, answered = false, perm = [];
  const log = () => store.val('unitsLog', { right: 0, total: 0, best: 0 }) || { right: 0, total: 0, best: 0 };
  function show() {
    clearInterval(timer); const it = items[order[i % order.length]]; perm = it.options.map((_, k) => k).sort(() => Math.random() - 0.5); answered = false; t0 = Date.now(); const L = log();
    host.innerHTML = `<div class="fg-head"><div><b>${right}</b><span>right this round</span></div><div><b>${streak}</b><span>in a row (best ${L.best})</span></div><div><b data-ut>${seconds}</b><span>seconds</span></div><div><span>all time: ${L.right} of ${L.total}</span></div></div>
      <div class="fg-card"><div class="src">${esc(ctx.courseName(it.course))} \u00b7 which expression can be right? Decide by the units alone.</div><h3>${M(it.q)} <span class="ud-unit">${M(`$[\\mathrm{${it.unit}}]$`)}</span></h3>
      <div class="ud-opts">${perm.map((k) => `<button class="opt ud-opt" data-uk="${k}">${M(`$${it.options[k]}$`)}</button>`).join('')}</div><div data-uwhy></div></div>`;
    const done = (k) => { if (answered) return; answered = true; clearInterval(timer); const ok = k === it.correct, L2 = log(); streak = ok ? streak + 1 : 0; if (ok) { right++; store.addXp(2); }
      store.setVal('unitsLog', { right: L2.right + (ok ? 1 : 0), total: L2.total + 1, best: Math.max(L2.best, streak) });
      host.querySelectorAll('[data-uk]').forEach((b) => { b.disabled = true; if (+b.dataset.uk === it.correct) b.classList.add('right'); else if (+b.dataset.uk === k) b.classList.add('wrong'); });
      host.querySelector('[data-uwhy]').innerHTML = `<p class="msg ${ok ? 'good' : 'bad'}">${ok ? 'Right.' : k === -1 ? 'Time is up.' : 'Not this one.'} ${M(it.why)}</p><button class="go" data-unext>Next</button>`;
      host.querySelector('[data-unext]').onclick = () => { i++; show(); }; ctx.onChange?.(); };
    host.querySelectorAll('[data-uk]').forEach((b) => (b.onclick = () => done(+b.dataset.uk)));
    const ut = host.querySelector('[data-ut]'); timer = setInterval(() => { if (!ut.isConnected) { clearInterval(timer); return; } const left = Math.max(0, seconds - Math.floor((Date.now() - t0) / 1000)); ut.textContent = left; if (!left) done(-1); }, 500);
  }
  show();
}
