# "As asked in the exam": for each derivation, the old-exam sub-questions (verbatim from the boss encounters of the game,
# which hold the exam statements) that require it, with the exam's points and a time budget of 2 minutes per point
# (QM exams: about 80 points in 3 hours). Executed at the end of build.py; adds d['asked'] = [{exam, boss, parts, points, minutes}].
import glob as _glob, re as _re
_BOSS = {}
for _f in _glob.glob(os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../../../game/content/qm/*.json')):
    _x = json.load(open(_f, encoding='utf-8'))
    if isinstance(_x, dict):
        for _e in _x.get('encounters', []):
            if _e['type'] == 'boss': _BOSS[_e['id']] = _e
ASKED = {  # derivation id -> [(boss id, statement indices: context lines first, then the sub-questions)]
    'ho-spectrum': [('qm-ho-b1', [0, 1, 2, 3])],
    'am-spectrum': [('qm-am-b2', [0, 1, 2, 3]), ('qm-ent-b1', [0, 1, 2])],
    'coherent': [('qm-ho-b2', [0, 4])],
    'box': [('qm-wm-b1', [0, 1]), ('qm-wm-b2', [0, 1])],
    'pt-nondeg': [('qm-pf-b1', [0, 1]), ('qm-pf-b3', [0, 1])],
    'spin-dot': [('qm-sa-b1', [0, 1, 2])],
    'heisenberg-ho': [('qm-ho-b2', [0, 3]), ('qm-fu-b2', [0, 1, 2])],
    'cg-1-half': [('qm-sa-b3', [1, 2])],
    'robertson': [('qm-fu-b1', [0, 1, 2])],
    'ehrenfest': [('qm-ho-b3', [0, 1])],
    'continuity': [('qm-wm-b3', [0, 1])],
}
# Old-exam questions that no boss holds: transcribed from the exams (German ones translated faithfully), with the exam's points.
# minutes: our estimate of the paper time. A 'note' marks anything that is not the exam's own wording.
TEXT = {
    'finite-well': [{'exam': 'FS24 Q2 (translated)', 'points': 25, 'minutes': 45, 'parts': [
        r'A point particle of mass $m$ in the symmetric well $V(x)=-V_0$ for $-a<x<a$, $0$ otherwise ($0<V_0<\infty$). Bound states have $E<0$ and can be written $\psi=Ae^{\eta x/a}$ ($x<-a$), $B\sin\frac{\xi}ax+C\cos\frac{\xi}ax$ ($|x|\le a$), $De^{-\eta x/a}$ ($x>a$), with $\xi,\eta>0$.',
        r'(a) Express $\eta$ and $\xi$ through $E$, $V_0$ and $a$. [3]',
        r'(b) Show that $\xi^2+\eta^2=\frac{2mV_0a^2}{\hbar^2}$. [2] (Continuity then gives $\eta=-\xi\frac{B\cos\xi-C\sin\xi}{B\sin\xi+C\cos\xi}$, which may be used.)',
        r'(c) Show from the Schrödinger equation that $\psi$ is necessarily even or odd (use $V(-x)=V(x)$ and that bound states are non-degenerate). [8]',
        r'(d) Show graphically that at least one bound state always exists. [8]',
        r'(e) Find the condition on $V_0$ for exactly one bound state. Which parity does it have? [4]']}],
    'delta': [{'exam': 'HS16 Aufgabe 4 (translated)', 'points': 5, 'minutes': 15, 'parts': [
        r'A particle in the one-dimensional potential $V(x)=V_1\Theta(x)-V_0\delta(x)$ with $V_{0,1}>0$ ($\Theta$ the Heaviside step).',
        r'a) The potential has at most one bound state. Find it and its energy, and show that it exists only if $\frac{2mV_0}{\hbar^2}>\frac{V_1}{V_0}$. [4 P]',
        r'b) Compute the energy correction of the bound state of the pure $\delta$ potential to the first non-vanishing order, treating the step as a perturbation with $V_1\ll V_0$. [1 P]']}],
    'radial': [{'exam': 'HS16 (3D oscillator in spherical coordinates, translated)', 'points': 4.5, 'minutes': 15, 'parts': [
        r'$H=-\frac{\hbar^2}{2m}\Delta+\frac{m\omega^2}2r^2$.',
        r'(b) Write $H$ in spherical coordinates. With $\Psi(r,\theta,\varphi)=R(r)Y_{lm}(\theta,\varphi)$ derive the differential equation for $R(r)$. What motivates this separation ansatz? [1.5 P]',
        r'With $R=u/r$: $\left(-\frac{\hbar^2}{2m}\frac{d^2}{dr^2}+V_{\rm eff}\right)u=Eu$, $V_{\rm eff}=\frac{\hbar^2l(l+1)}{2mr^2}+\frac{m\omega^2}2r^2$; $u(0)=0$ may be used. (c) Sketch $V_{\rm eff}$: what about bound and unbound states? [0.5 P]',
        r'(d) The equation for $r\to0$ and its solution (ansatz $u\sim r^\alpha$). [1 P] (e) The equation for $r\to\infty$: which known problem is it, and how does $u$ behave? [1.5 P]']}],
    'spin-precession': [
        {'exam': 'FS16 D.2 (translated)', 'points': 3, 'minutes': 8, 'parts': [
            r'D.2 [3] A spin-polarised state $|\psi\rangle=(|\uparrow\rangle-i|\downarrow\rangle)/\sqrt2$ is exposed to a magnetic field in the $z$ direction. Compute the time evolution of $\mathbf S=\langle\psi(t)|\hat{\mathbf S}|\psi(t)\rangle$.']},
        {'exam': 'HS16 Aufgabe 2 a) (translated)', 'points': 3, 'minutes': 10, 'parts': [
            r'A particle of charge $q$ and spin 1 (spin is its only degree of freedom) has $H=-\boldsymbol\mu\cdot\mathbf B=\frac qm\mathbf S\cdot\mathbf B$; in the $S_3$ basis $S_1=\frac\hbar{\sqrt2}\begin{pmatrix}0&1&0\\1&0&1\\0&1&0\end{pmatrix}$, $S_3=\hbar\,\mathrm{diag}(1,0,-1)$.',
            r'a) For a constant homogeneous field along $x_3$, compute $|\psi(t)\rangle$ for the state that at $t=0$ is the eigenstate of $S_1$ with eigenvalue $+\hbar$ (check: $(\frac12,\frac1{\sqrt2},\frac12)^T$). [3 P]']}],
    'golden-rule': [
        {'exam': 'HS14 D.3-D.4 (translated)', 'points': 4, 'minutes': 12, 'parts': [
            r'D.3 [1] State Fermi&#8217;s golden rule and explain its meaning.',
            r'D.4 [3] A particle in a box of volume $L^3$ with normalised wave functions $\psi_{\mathbf k}=e^{i\mathbf k\cdot\mathbf r}/\sqrt{L^3}$. Compute the decay rate of a state $|\mathbf k\rangle$ in the presence of a delta potential $V(\mathbf r)=V_0\delta(\mathbf r)$.']},
        {'exam': 'FS16 C.7, last part (translated)', 'points': 2, 'minutes': 8, 'parts': [
            r'A particle in the ground state of a deep one-dimensional well of width $d$. Compute the transition rate from the ground state into the continuum (box regularisation $L$ for the density of states $\rho(k)$) due to the time-dependent perturbation $\bar H=\bar V\delta(x)\cos(\omega t)$. (Points of this part estimated; C.7 has 5 in total.)']}],
    'variational': [{'exam': 'HS14 D.5 (translated)', 'points': 5, 'minutes': 12, 'parts': [
        r'D.5 [5] Find the normalised ground-state wave function of the harmonic oscillator (1D) with the variational ansatz $\psi(x)=A\exp[-x^2/2\sigma^2]$.']}],
    'virial': [{'exam': 'exam style (no old exam or sheet asks it verbatim)', 'points': 8, 'minutes': 16, 'note': True, 'parts': [
        r'$H=\frac{p^2}{2m}+V(x)$ and a normalised stationary state $\psi$, $H\psi=E\psi$.',
        r'(i) Show that $\langle\psi|[H,A]|\psi\rangle=0$ for every operator $A$. [2]',
        r'(ii) Use $A=xp$ to derive the virial theorem $2\langle T\rangle=\langle xV^\prime(x)\rangle$. [4]',
        r'(iii) Apply it to the harmonic oscillator and to $V\propto|x|^n$: how are $\langle T\rangle$, $\langle V\rangle$ and $E$ related? [2]']}],
}
def _pts(s):
    m = _re.search(r'\[(\d+)\s*(?:pt|points?|Punkte)\]|\[(\d+)p\]', s)
    return int(m.group(1) or m.group(2)) if m else 0
def _exam(b):
    m = _re.search(r'\(([^()]*\d\d[^()]*)\)\s*$', b['title'])
    return _re.sub(r',\s*\d+\s*pt$', '', m.group(1)) if m else b['title']
for d in DERIVS:
    out = []
    for bid, idx in ASKED.get(d['id'], []):
        b = _BOSS[bid]; parts = [b['statement'][i] for i in idx]; pts = sum(_pts(p) for p in parts)
        out.append({'exam': _exam(b), 'boss': bid, 'parts': parts, 'points': pts, 'minutes': max(6, 2 * pts) if pts else 10})
    out += [dict(x) for x in TEXT.get(d['id'], [])]
    if out: d['asked'] = out
