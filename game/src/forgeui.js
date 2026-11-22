// The Forge (QM: no aids in the exam, so formulas must be in your head) and My summary (solid state and astrophysics: five
// pages are allowed). Forge: write a formula from a blank prompt, reveal, self-check; each formula has its own memory strength
// (memory.js), so weak ones come back sooner. Rebuild: the chain from one anchor to the formula. Blank page: ten minutes, one
// chapter, everything you know, then tick it off. My summary: pin the formulas you earned to five pages and print them.
import { store } from './store.js';
import { ic } from './icons.js';
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
const LINES = 34; // formulas per page that stay readable in two columns
// allowed summary pages per course: solid state 10 handwritten A4 pages (cover of the ISSP test exam HS26), astro 5 (as told)
const PAGES_OF = { 'solid-state': 10, astrophysics: 5 }, pagesOf = (cid) => PAGES_OF[cid] || 5;
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
  // what the formula says, and where it is in the script (with the guided reading); explanations per step are in rebuild mode
  const meaningHtml = (it) => (it.meaning ? `<div class="fg-meaning"><b>What it says:</b> ${M(it.meaning)}</div>` : '');
  const whereHtml = (it) => { const w = it.where; if (!w) return ''; return `<div class="dv-where"><b>In the script (German):</b> \u00a7${esc(w.sec)}, pp. ${esc(w.pages)}.${w.read ? ` <button class="chip btn" data-fread="${w.read}">${ic('book')} Read this part first</button>` : ''}</div>`; };
  function body() {
    if (mode === 'all') return `<div class="maplist">${items.map((it) => `<div class="fg-row"><span class="fg-bar"><i style="width:${Math.round(100 * strength(it.id))}%"></i></span><b>${esc(it.name)}</b><details><summary>show</summary>${M(`$$${it.tex}$$`)}${meaningHtml(it)}${whereHtml(it)}</details></div>`).join('')}</div>`;
    if (mode === 'blank') return blankHtml();
    if (!cur) return `<p class="msg good">Nothing is due: every formula is above 70%. Come back tomorrow, or use “All formulas”.</p>`;
    if (mode === 'rebuild') return `<div class="fg-card"><div class="src">Rebuild it: do not recall the result, regenerate it</div><h3>${esc(cur.name)}</h3>${meaningHtml(cur)}<p>${M(cur.anchor)}</p><ol class="fg-steps">${cur.steps.slice(0, step).map((s, i) => `<li>${M(s)}${cur.explain?.[i] ? `<details class="fg-why"${step === cur.steps.length ? '' : ' open'}><summary>Why?</summary>${M(cur.explain[i])}</details>` : ''}</li>`).join('')}</ol>
      ${step < cur.steps.length ? `<p class="src">Write the next step yourself, then compare.</p><button class="go" data-fstep>Show step ${step + 1} of ${cur.steps.length}</button>` : `<div class="fg-tex">${M(`$$${cur.tex}$$`)}</div><div class="row"><button class="go" data-had="1">I could rebuild it</button><button class="chip btn" data-had="0">I got stuck</button></div>`}${whereHtml(cur)}</div>`;
    return `<div class="fg-card"><div class="src">Write it on paper from memory. No peeking.</div><h3>${esc(cur.name)}</h3>
      ${shown ? `<div class="fg-tex">${M(`$$${cur.tex}$$`)}</div><p class="src">Compare every symbol, sign and factor.</p><div class="row"><button class="go" data-had="1">I had it exactly</button><button class="chip btn" data-had="0">Not quite</button><button class="chip btn" data-fm="rebuild">Show me how to rebuild it</button></div>${meaningHtml(cur)}${whereHtml(cur)}` : '<button class="go" data-freveal>I wrote it: show the formula</button>'}</div>`;
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
    host.querySelectorAll('[data-fread]').forEach((b) => (b.onclick = () => ctx.openEnc?.(b.dataset.fread)));
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

// Concept and experiment lines for the sheet: the "Intuition" (what it means, how the experiment works) and "Pitfall" callouts of the
// course's lessons, already checked against the script. Pinned like formulas; they only go on the printed sheet (fights use formulas).
const CONCEPT_KINDS = { intuition: 'Concept', pitfall: 'Trap' };
function conceptCards(catalog, cid, isPassed) {
  const out = [], c = catalog.find((x) => x.id === cid); if (!c) return out;
  for (const r of c.rooms || []) for (const e of r.encounters || []) (e.blocks || []).forEach((b, i) => {
    if (!CONCEPT_KINDS[b.kind] || !b.html) return;
    out.push({ key: `${e.id}#k${i}`, concept: true, kind: CONCEPT_KINDS[b.kind], label: String(e.title || '').replace(/\$[^$]*\$/g, (m) => m), html: b.html, roomTitle: r.title, lesson: e.title, earned: isPassed(e.id) });
  });
  return out;
}
export function renderSummary(host, ctx) {
  // ctx: { catalog, isPassed, courses: [{id, name}] (the courses that allow a summary), M }
  const { M } = ctx; let cid = ctx.courses.some((c) => c.id === ctx.start) ? ctx.start : ctx.courses[0].id; // start: the course a run stop asks for
  function draw() {
    const s = summaryOf(cid), cards = [...deck(ctx.catalog, () => true).filter((c) => c.course === cid).map((c) => ({ ...c, earned: ctx.isPassed(c.key.split('#')[0]) })), ...conceptCards(ctx.catalog, cid, ctx.isPassed)], PAGES = pagesOf(cid), per = Array.from({ length: PAGES }, (_, i) => cards.filter((c) => s.pins[c.key] === i + 1));
    const byRoom = {}; for (const c of cards) (byRoom[c.roomTitle] ||= []).push(c);
    const weight = (p) => p.reduce((a, c) => a + (c.concept ? 2 : 1), 0);
    host.innerHTML = `<div class="row">${ctx.courses.map((c) => `<button class="chip btn${c.id === cid ? ' cur' : ''}" data-sc="${c.id}">${esc(c.name)}</button>`).join('')}<button class="go" data-sprint style="margin-left:auto">Print / save as PDF</button></div>
      <p class="src">Your ${PAGES}-page summary for the exam (${cid === 'solid-state' ? '10 handwritten A4 pages are allowed: cover of the test exam HS26' : '5 pages'}). Every formula of the course is listed, and the lessons' concept lines (what it means, how the experiment works) and traps; pin the ones you want to a page. Formulas marked \u25cb are not looted yet (pass their lesson); you can pin them anyway. In fights of this course you may look only at pinned formulas you have looted, so the sheet is tested before the exam.</p>
      <div class="sm-pages">${per.map((p, i) => `<div class="sm-page${weight(p) > LINES ? ' full' : ''}"><b>Page ${i + 1}</b><span class="src">${p.filter((c) => !c.concept).length} formulas${p.some((c) => c.concept) ? `, ${p.filter((c) => c.concept).length} concept lines` : ''}</span><span class="fg-bar"><i style="width:${Math.min(100, Math.round(100 * weight(p) / LINES))}%"></i></span><textarea data-snote="${i + 1}" placeholder="your own notes for this page (constants, sketches to draw, typical traps)">${esc(s.notes[i + 1] || '')}</textarea></div>`).join('')}</div>
      ${cards.length ? Object.entries(byRoom).map(([room, list]) => `<h3>${esc(room)}</h3>${list.map((c) => `<div class="sm-row${s.pins[c.key] ? ' on' : ''}${c.concept ? ' sm-concept' : ''}"><div class="sm-tex"><b>${c.earned ? '' : '<span title="not looted yet: pass its lesson">\u25cb </span>'}${c.concept ? `<span class="sm-kind">${c.kind}</span> ` : ''}${c.concept ? M(esc(c.label)) : esc(c.label)}</b>${c.concept ? `<div class="sm-ctext">${M(c.html)}</div>` : M(`$$${c.tex}$$`)}<span class="src">${c.concept ? '' : esc(c.lesson)}${c.ref ? ` \u00b7 ${esc(String(c.ref).replace(/\$[^$]*\$/g, '').trim().slice(0, 50))}` : ''}</span></div><div class="sm-pick">${Array.from({ length: PAGES }, (_, k) => k + 1).map((n) => `<button class="chip btn${s.pins[c.key] === n ? ' cur' : ''}" data-spin="${c.key}" data-pg="${n}">${n}</button>`).join('')}</div></div>`).join('')}`).join('') : '<p>No formula cards for this course yet. Pass a lesson and its formulas appear here.</p>'}`;
    host.querySelectorAll('[data-sc]').forEach((b) => (b.onclick = () => { cid = b.dataset.sc; draw(); }));
    host.querySelectorAll('[data-spin]').forEach((b) => (b.onclick = () => { const cur = summaryOf(cid).pins[b.dataset.spin]; pin(cid, b.dataset.spin, cur === +b.dataset.pg ? 0 : +b.dataset.pg); const y = host.parentElement?.scrollTop; draw(); if (host.parentElement) host.parentElement.scrollTop = y; }));
    host.querySelectorAll('[data-snote]').forEach((t) => { t.onkeydown = (e) => e.stopPropagation(); t.onchange = () => { const x = summaryOf(cid); x.notes[t.dataset.snote] = t.value.slice(0, 4000); saveSummary(cid, x); }; });
    host.querySelector('[data-sprint]').onclick = () => {
      const name = ctx.courses.find((c) => c.id === cid).name, css = [...document.querySelectorAll('link[rel=stylesheet]')].map((l) => `<link rel="stylesheet" href="${l.href}">`).join('');
      const html = per.map((p, i) => (!p.length && !s.notes[i + 1] ? '' : `<section><h2>${esc(name)} — page ${i + 1}</h2>${s.notes[i + 1] ? `<pre>${esc(s.notes[i + 1])}</pre>` : ''}<div class="cols">${p.map((c) => (c.concept ? `<div class="f c"><b>${c.kind}: ${M(esc(c.label))}</b><div class="ct">${M(c.html)}</div></div>` : `<div class="f"><b>${esc(c.label)}</b>${texParts(c.tex).map((t) => M(`$$${t}$$`)).join('')}</div>`)).join('')}</div></section>`)).join('') || '<p>No formulas pinned to a page yet.</p>';
      const doc = `<!doctype html><title>${esc(name)}: summary</title>${css}<style>html{background:#fff!important}@page{size:A4;margin:7mm}body{background:#fff;color:#000;font:8.5px/1.2 sans-serif;margin:0;width:196mm}section{display:block!important;break-after:page;page-break-after:always}section:last-child{break-after:auto;page-break-after:auto}h2{font-size:9.5px;margin:0 0 3px;padding-bottom:1px;border-bottom:1.5px solid #000}.cols{display:block!important;gap:0!important;column-count:3;column-gap:4mm;column-rule:0.5px solid #ccc}.f{break-inside:avoid;padding:1.5px 0 2px;border-bottom:0.5px solid #ddd;overflow:hidden}.f>b{display:block;font-size:7.5px;font-weight:700;color:#333;margin-bottom:0.5px}.katex{font-size:1.02em}.katex-display{margin:0!important;padding:1px 0;text-align:left;overflow:hidden}.katex-display>.katex{text-align:left}pre{white-space:pre-wrap;font:inherit;border:0.5px solid #999;padding:2px 3px;margin:0 0 3px}.f.c .ct{font-size:7.5px;line-height:1.25}.f.c .ct .katex{font-size:1em}.f.c>b{color:#000}.f .ct b{font-weight:700}</style>${html}<script>(document.fonts?document.fonts.ready:Promise.resolve()).then(function(){document.querySelectorAll('.katex-display').forEach(function(d){var h=d.querySelector('.katex-html');if(!h)return;var r=document.createRange();r.selectNodeContents(h);var need=r.getBoundingClientRect().width,w=d.parentNode.clientWidth-2;if(need>w){d.style.fontSize=Math.max(60,Math.floor(100*w/need))+'%';}});});</script>`;
      printDoc(doc, `${name} summary`, ctx.toast);
    };
  }
  draw();
}

// A long formula line with several equations ("a = b,\quad c = d") split at its top-level \quad / \qquad gaps, one equation per line:
// a narrow column then holds it without shrinking it to unreadable size
function texParts(tex) {
  const out = []; let depth = 0, cur = '';
  for (let i = 0; i < tex.length; i++) {
    const ch = tex[i];
    if (ch === '{') depth++; else if (ch === '}') depth--;
    else if (/^\\(left\b|begin\{)/.test(tex.slice(i, i + 7))) depth++; else if (/^\\(right\b|end\{)/.test(tex.slice(i, i + 6))) depth--;
    const m = depth === 0 && tex.slice(i).match(/^,?\s*\\q?quad\b\s*/);
    if (m) { if (cur.trim()) out.push(cur.trim().replace(/,$/, '')); cur = ''; i += m[0].length - 1; continue; }
    cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out.length ? out : [tex];
}
// Print or save a page as PDF: in the desktop app through its own PDF saver (a pop-up with window.print() does not work there),
// elsewhere through a hidden frame and the browser's print dialog (choose "Save as PDF" there).
export function printDoc(doc, name, toast = null) {
  if (window.rpgDesktop?.savePdf) {
    toast?.('Preparing the PDF…');
    window.rpgDesktop.savePdf(doc, name).then((r) => { if (r?.ok) toast?.(`Saved as PDF: ${r.path}`); else if (!r?.canceled) toast?.(`Could not make the PDF: ${r?.error || 'unknown error'}`); });
    return;
  }
  const f = document.createElement('iframe'); f.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden'; document.body.appendChild(f);
  const d = f.contentWindow.document; d.open(); d.write(doc); d.close();
  const go = () => { try { f.contentWindow.focus(); f.contentWindow.print(); } catch { /* ignore */ } setTimeout(() => f.remove(), 60000); };
  (f.contentWindow.document.fonts?.ready || Promise.resolve()).then(() => setTimeout(go, 400));
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
      ${it.meaning ? `<details class="ud-hint"><summary>Hint: what is this quantity?</summary>${M(it.meaning)}${it.ref ? `<div class="src">Read: ${esc(it.ref)}</div>` : ''}</details>` : ''}
      <div class="ud-opts">${perm.map((k) => `<button class="opt ud-opt" data-uk="${k}">${M(`$${it.options[k]}$`)}</button>`).join('')}</div><div data-uwhy></div></div>`;
    const done = (k) => { if (answered) return; answered = true; clearInterval(timer); const ok = k === it.correct, L2 = log(); streak = ok ? streak + 1 : 0; if (ok) { right++; store.addXp(2); }
      store.setVal('unitsLog', { right: L2.right + (ok ? 1 : 0), total: L2.total + 1, best: Math.max(L2.best, streak) });
      host.querySelectorAll('[data-uk]').forEach((b) => { b.disabled = true; if (+b.dataset.uk === it.correct) b.classList.add('right'); else if (+b.dataset.uk === k) b.classList.add('wrong'); });
      const syms = (it.sym || []).map((key) => ctx.symbols?.[key]).filter(Boolean);
      const table = syms.length ? `<div class="ud-syms"><div class="src">Units of the pieces (SI):</div>${syms.map(([t, u, note]) => `<span class="ud-sym">${M(`$${t}$`)}<b>${M(`$[\\mathrm{${u}}]$`)}</b><small>${esc(note)}</small></span>`).join('')}</div>` : '';
      host.querySelector('[data-uwhy]').innerHTML = `<p class="msg ${ok ? 'good' : 'bad'}">${ok ? 'Right.' : k === -1 ? 'Time is up.' : 'Not this one.'} ${M(it.why)}</p>${table}<button class="go" data-unext>Next</button>`;
      host.querySelector('[data-unext]').onclick = () => { i++; show(); }; ctx.onChange?.(); };
    host.querySelectorAll('[data-uk]').forEach((b) => (b.onclick = () => done(+b.dataset.uk)));
    const ut = host.querySelector('[data-ut]'); timer = setInterval(() => { if (!ut.isConnected) { clearInterval(timer); return; } const left = Math.max(0, seconds - Math.floor((Date.now() - t0) / 1000)); ut.textContent = left; if (!left) done(-1); }, 500);
  }
  show();
}
