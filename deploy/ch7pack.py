#!/usr/bin/env python3
"""Install the lecturer's chapter 7 reading pack (ch7_page.zip, QM I HS26) on the server.

The pack holds the lecture notes of chapter 7 verbatim plus 28 explainers. It is the lecturer's material, so it is NOT
committed to this public repository. This script only rebuilds it into a clean, linked folder that the game server serves
behind its password (Caddy basic auth):

    python3 deploy/ch7pack.py ~/ch7_page.zip            # -> game/private/ch7/  (git-ignored)

Why a rebuild: the zip was saved with "Save page as", so the files carry their page titles as names while their links
point to the original site layout (chapter07.html, concepts/<slug>.html, assets/style.css), and assets/ is missing.
This script renames every page to the name its links expect and writes a small assets/ (style + MathJax macros).
Standard library only. The game shows its "Lecturer's explainer" links only once game/private/ch7/index.html exists.
"""
import os, re, sys, zipfile, html

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DST = os.path.join(ROOT, 'game', 'private', 'ch7')

# saved page title -> path the pack's own links use
TITLES = {
    'Quantum mechanics I — reading edition': 'index.html',
    '7 Symmetries in Quantum Mechanics': 'chapter07.html',
    'Further reading': 'references.html',
    'Explainers — Chapter 7': 'concepts/index.html',
    'Commuting operators and common eigenvectors': 'concepts/commuting-observables.html',
    'Compact groups and complete reducibility': 'concepts/compact-groups.html',
    'Equivalent ("isomorphic") representations': 'concepts/equivalent-representations.html',
    'From a group representation to a Lie algebra representation': 'concepts/lie-algebra-representation.html',
    'Generators of rotations = angular momentum': 'concepts/generators-angular-momentum.html',
    'Group homomorphisms': 'concepts/group-homomorphism.html',
    'Lie groups and Lie algebras': 'concepts/lie-groups-and-algebras.html',
    'Projective representations': 'concepts/projective-representations.html',
    'Raising and lowering operators': 'concepts/ladder-operators.html',
    'Reducible and irreducible representations': 'concepts/reducible-irreducible.html',
    'SO(3) versus SU(2)': 'concepts/so3-vs-su2.html',
    'Spherical harmonics': 'concepts/spherical-harmonics.html',
    'The Casimir operator': 'concepts/casimir-operator.html',
    'The Lie algebra su(2)': 'concepts/su2-lie-algebra.html',
    'The Lie bracket and the Jacobi identity': 'concepts/lie-bracket.html',
    'The Pauli matrices': 'concepts/pauli-matrices.html',
    'The exponential map and the BCH formula': 'concepts/exponential-map.html',
    'The fundamental and the adjoint representation': 'concepts/fundamental-and-adjoint.html',
    'The parity operator': 'concepts/parity.html',
    'The rotation group SO(3)': 'concepts/rotation-group-so3.html',
    'The spin of the electron': 'concepts/spin-of-electron.html',
    'The word "isomorphic", four times': 'concepts/isomorphism.html',
    'Time reversal': 'concepts/time-reversal.html',
    'Unitary representations': 'concepts/unitary-representations.html',
    'What a representation is': 'concepts/what-is-a-representation.html',
    'Why infinitesimal rotations form a vector space': 'concepts/infinitesimal-rotations.html',
    'Why j labels the irreducible representations': 'concepts/why-j-labels-representations.html',
    "Wigner's theorem and Weyl's lemma": 'concepts/wigner-theorem.html',
}

MATHJAX = r"""window.MathJax = {
  tex: {
    inlineMath: [['\\(', '\\)'], ['$', '$']], displayMath: [['\\[', '\\]'], ['$$', '$$']],
    tags: 'ams', tagFormat: { number: (n) => '7.' + n },
    macros: {
      R: '\\mathbb{R}', C: '\\mathbb{C}', N: '\\mathbb{N}', Rop: '\\mathbb{R}', Cop: '\\mathbb{C}', Zop: '\\mathbb{Z}',
      H: '\\mathcal{H}', K: '\\mathcal{K}', D: '\\mathcal{D}', one: '\\mathbb{1}',
      om: '\\omega', Om: '\\Omega', e: '\\vec{e}', x: '\\vec{x}', half: '\\tfrac12', ra: '\\rightarrow',
      so: '\\mathfrak{so}', SU: '\\mathrm{SU}', SO: '\\mathrm{SO}', nn: '\\nonumber', no: '\\nonumber'
    }
  },
  options: { skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'] }
};
// glosses of underlined terms: show them as the native tooltip (hover on desktop, long-press on phones)
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-gloss]').forEach((a) => { if (!a.title) a.title = a.dataset.gloss; });
});
"""

STYLE = """:root{--bg:#fbfaf7;--fg:#1d1d1f;--mut:#666;--acc:#2b5fa8;--box:#eef3fb;--line:#d9d6cf}
@media (prefers-color-scheme:dark){:root{--bg:#15171c;--fg:#e8e6e1;--mut:#9a9a9a;--acc:#8cb4ff;--box:#1f2633;--line:#333}}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--fg);font:18px/1.6 'Source Serif 4',Georgia,serif}
a{color:var(--acc)}
.site-head{display:flex;flex-wrap:wrap;gap:.4em 1.2em;align-items:baseline;justify-content:space-between;padding:.7em 16px;border-bottom:1px solid var(--line);position:sticky;top:0;background:var(--bg);z-index:5}
.site-head nav{display:flex;gap:1em;flex-wrap:wrap;font-size:.9em}.brand{font-weight:600;text-decoration:none;color:var(--fg)}.brand span{color:var(--mut);font-weight:400;font-size:.85em;margin-left:.4em}
.chapter-layout{display:grid;grid-template-columns:240px minmax(0,46em);gap:2.5em;justify-content:center;padding:0 16px}
.rail{position:sticky;top:3.5em;align-self:start;font-size:.85em;max-height:85vh;overflow:auto;padding-top:1.5em}.rail ol{padding-left:1em}.toc-title{font-weight:600}
main.notes,main.explainer,main{max-width:46em;margin:0 auto;padding:1em 16px 4em;overflow-wrap:break-word}
.chapter-layout main.notes{padding:1em 0 4em;margin:0}
.crumbs{color:var(--mut);font-size:.85em;margin-bottom:0}.num{color:var(--mut);margin-right:.4em}.lede{font-size:1.08em;color:var(--mut)}
a.concept{color:inherit;text-decoration:underline dotted var(--acc);text-underline-offset:3px;text-decoration-thickness:2px}
.asked,.from-notes,.howto{background:var(--box);border-left:3px solid var(--acc);padding:.5em 1em;margin:1em 0;font-size:.9em;border-radius:4px}
.asked-title,.from-notes-title{font-weight:600;margin:.2em 0}.asked ul,.from-notes ul{margin:.3em 0;padding-left:1.2em}
mjx-container[display=true]{overflow-x:auto;overflow-y:hidden;max-width:100%}
.site-foot{border-top:1px solid var(--line);color:var(--mut);font-size:.8em;padding:1em 16px;text-align:center}
@media (max-width:900px){.chapter-layout{grid-template-columns:minmax(0,1fr)}.rail{position:static;max-height:none}}
"""


def main():
    if len(sys.argv) < 2: sys.exit(__doc__)
    z = zipfile.ZipFile(sys.argv[1])
    os.makedirs(os.path.join(DST, 'concepts'), exist_ok=True); os.makedirs(os.path.join(DST, 'assets'), exist_ok=True)
    seen = set()
    for info in z.infolist():
        if not info.filename.endswith('.html'): continue
        s = z.read(info).decode('utf-8')
        m = re.search(r'<title>(.*?)</title>', s, re.S)
        t = html.unescape(m.group(1)).strip() if m else ''
        t = re.sub(r'\s+—\s+explainer$', '', t)
        rel = TITLES.get(t)
        if not rel: print('skipped (unknown page):', info.filename); continue
        out = os.path.join(DST, rel)
        with open(out, 'w', encoding='utf-8') as f: f.write(s)
        seen.add(rel)
    with open(os.path.join(DST, 'assets', 'mathjax-config.js'), 'w') as f: f.write(MATHJAX)
    with open(os.path.join(DST, 'assets', 'style.css'), 'w') as f: f.write(STYLE)
    missing = sorted(set(TITLES.values()) - seen)
    print(f'{len(seen)} pages -> {DST}' + (f'; missing: {missing}' if missing else ''))


if __name__ == '__main__':
    main()
