"""QM gap lessons from the coverage map (notes/quantum-mechanics/coverage.md): script sections without a lesson or practice.
Notation as in the QM25 script (Gaberdiel): H = H_0 + H'(t), Dirac picture Psi_D, U_D, omega_if; Gaussian units in 9.6
(M = qL/2mc, mu_B = e hbar / 2 m_e c). Read from notes/extracted (script text) and checked against the equations there.
The teleportation table (10.3) was verified numerically (numpy, all four outcomes). Writes game/content/qm/script-gaps.json.
Run: python3 build.py"""
import json, os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '../../../../game/content/qm/script-gaps.json')
SCRIPT = 'materials/quantum-mechanics/scripts/QM25.Kap1+2+3+4+5+6+7+8+9+10+11.pdf'


def T(h): return {'kind': 'text', 'html': h}
def E(t, l=None): return {'kind': 'eq', 'tex': t, **({'label': l} if l else {})}
def B(kind, h): return {'kind': kind, 'html': h}
def K(q, opts, correct, explain): return {'q': q, 'options': opts, 'correct': correct, 'explain': explain}
def ST(p, r): return {'prompt': p, 'reveal': r}
def L(id, title, where, blocks, check, minutes=12):
    return {'type': 'lesson', 'tier': 'theory', 'minutes': minutes, 'xp': 20, 'id': id, 'title': title,
            'source': [{'file': SCRIPT, 'where': where}], 'blocks': blocks, 'check': check}
def D(id, title, where, goal, given, steps, keys, xp=30):
    return {'type': 'derive', 'xp': xp, 'id': id, 'title': title, 'source': {'file': SCRIPT, 'where': where},
            'goal': goal, 'given': given, 'steps': steps, 'keyPoints': keys}


items = []
def add(room, enc): items.append({'room': room, 'enc': enc})

add('perturbation-forge', L('qm-gap-L1', 'The interaction (Dirac) picture', 'Ch. 11.3.3, eqs. (11.88)-(11.95)', [
    T(r'For $H=H_0+H^\prime(t)$ with an exactly solvable $H_0$, move the trivial time evolution of $H_0$ from the states onto the operators. Both states and observables then depend on time: a compromise between the Schrödinger and the Heisenberg picture.'),
    E(r'\Psi_D(t)=U_0(t_0,t)\,\Psi(t),\qquad A_D(t)=U_0(t_0,t)\,A\,U_0(t,t_0),\qquad U_0(t,t_0)=e^{-iH_0(t-t_0)/\hbar}', 'script (11.89), (11.90)'),
    T(r'The state then evolves only under the perturbation, written in the Dirac picture:'),
    E(r'i\hbar\,\partial_tU_D=H^\prime_D(t)\,U_D,\qquad H^\prime_D(t)=e^{iH_0(t-t_0)/\hbar}H^\prime(t)\,e^{-iH_0(t-t_0)/\hbar}', 'script (11.93), (11.94)'),
    E(r'U_D(t,t_0)=T\exp\left(-\frac i\hbar\int_{t_0}^tdt^\prime\,H^\prime_D(t^\prime)\right)\approx\mathbb 1-\frac i\hbar\int_{t_0}^tdt^\prime H^\prime_D(t^\prime)+\dots', 'Dyson / Neumann series (11.95)'),
    B('intuition', r'Sit in a frame that rotates with $H_0$: if there were no perturbation, $\Psi_D$ would stand still. All motion you see is caused by $H^\prime$, which is why the expansion in powers of $H^\prime$ is natural.'),
    B('pitfall', r'Time ordering $T$ matters because $H^\prime_D(t)$ at different times need not commute. Only to first order can it be dropped.'),
    B('exam', r'The derivation of the first-order transition amplitude (next lesson) starts here: know (11.94) and the first-order term of (11.95).')],
    [K(r'In the Dirac picture, the state $\Psi_D$ evolves under', [r'$H^\prime_D(t)$ only', r'$H_0$ only', r'$H_0+H^\prime$', r'nothing: it is constant'], 0, r'$i\hbar\partial_tU_D=H^\prime_DU_D$; with $H^\prime=0$, $\Psi_D$ is constant.'),
     K(r'$H^\prime_D(t)=$', [r'$e^{iH_0t/\hbar}H^\prime(t)e^{-iH_0t/\hbar}$ (with $t_0=0$)', r'$e^{-iH_0t/\hbar}H^\prime e^{iH_0t/\hbar}$', r'$H^\prime(t)$', r'$H_0+H^\prime$'], 0, r'Operators carry the $H_0$ evolution like in the Heisenberg picture.')]))

add('perturbation-forge', L('qm-gap-L2', "First-order time-dependent perturbation theory and Fermi's golden rule", 'Ch. 11.3.4, eqs. (11.96)-(11.106), Abb. 22-23', [
    T(r'Start in an eigenstate $|i\rangle$ of $H_0$ at $t_0$, ask for the probability to be found in $|f\rangle\perp|i\rangle$ later. To first order in $H^\prime$:'),
    E(r'P_{i\to f}=\frac1{\hbar^2}\left|\int_{t_0}^tdt^\prime\,e^{i\omega_{if}t^\prime}\langle f|H^\prime(t^\prime)|i\rangle\right|^2,\qquad \omega_{if}=\frac{E_f-E_i}\hbar', 'script (11.98)'),
    T(r'Sudden switch-on $H^\prime=V\theta(t)$:'),
    E(r'P_{i\to f}=\left(\frac{\sin(\omega_{if}t/2)}{\hbar\omega_{if}/2}\right)^2|\langle f|V|i\rangle|^2', 'script (11.100)'),
    T(r'Peak at $\omega_{if}=0$ of height $t^2/\hbar^2$ and width $\sim2\pi/t$: its area grows $\propto t$. Energy is conserved only up to $\Delta\omega_{if}\,t\sim2\pi$. Summing over a dense group of final states with density $\rho(E_f)$, $\sin^2(\omega t)/(\pi t\omega^2)\to\delta(\omega)$ gives a constant <b>rate</b>:'),
    E(r'\Gamma=\frac{2\pi}\hbar\,|\langle f|V|i\rangle|^2\rho(E_f),\qquad \frac{2\pi\hbar}{\Delta E_f}<t\ll\frac{2\pi\hbar}{\delta\varepsilon}', "Fermi's golden rule (11.106)"),
    B('intuition', r'Short times: every final state is reachable (energy is fuzzy). Long times: only energy-conserving transitions accumulate, linearly in $t$, so the probability per unit time is constant.'),
    B('pitfall', r'Validity window: $t$ long enough that the peak $2\pi\hbar/t$ is narrower than the band $\Delta E_f$ over which $\langle f|V|i\rangle$ is constant, but short enough that many states $\delta\varepsilon$ lie under the peak (and $P\ll1$ so first order holds).'),
    B('exam', r'Older exams (HS14, HS16) ask for the golden rule directly: derive (11.100), explain the $t^2$ peak and its width, state $\Gamma$ with the conditions.')],
    [K(r'For $H^\prime=V\theta(t)$, at $\omega_{if}=0$ the first-order $P_{i\to f}$ grows like', [r'$t^2$', r'$t$', r'$e^{-\Gamma t}$', r'it is constant'], 0, r'$\sin^2(x)/x^2\to1$: $P=|V_{fi}|^2t^2/\hbar^2$. The <i>area</i> of the peak grows like $t$.'),
     K(r"Fermi's golden rule gives a transition rate proportional to", [r'$|\langle f|V|i\rangle|^2\rho(E_f)$', r'$|\langle f|V|i\rangle|$', r'$\rho(E_f)/|\langle f|V|i\rangle|^2$', r'$t^2$'], 0, r'$\Gamma=\frac{2\pi}\hbar|V_{fi}|^2\rho(E_f)$.')], minutes=15))

add('perturbation-forge', D('qm-gap-D1', "Derive Fermi's golden rule from the Dirac picture", 'Ch. 11.3.3-11.3.4, eqs. (11.96)-(11.106)',
    r"Starting from $\Psi_D(t)=U_D(t,t_0)|i\rangle$, derive (11.98), evaluate it for $H^\prime=V\theta(t)$ and obtain $\Gamma=\frac{2\pi}\hbar|\langle f|V|i\rangle|^2\rho(E_f)$.",
    [r'$U_D\approx\mathbb 1-\frac i\hbar\int_{t_0}^tH^\prime_D$', r'$\int_{-\infty}^\infty\frac{\sin^2u}{u^2}du=\pi$', r'$\sum_f\to\int dE_f\,\rho(E_f)$'],
    [ST(r'First-order amplitude $\langle f|\Psi_D(t)\rangle$.', r'$\langle f|\mathbb 1|i\rangle=0$, so $\langle f|\Psi_D\rangle=-\frac i\hbar\int_{t_0}^tdt^\prime\langle f|e^{iH_0(t^\prime-t_0)/\hbar}H^\prime(t^\prime)e^{-iH_0(t^\prime-t_0)/\hbar}|i\rangle=-\frac i\hbar\int dt^\prime e^{i\omega_{if}(t^\prime-t_0)}\langle f|H^\prime(t^\prime)|i\rangle$; square: (11.98).'),
     ST(r'Evaluate for $H^\prime=V\theta(t)$, $t_0=0$.', r'$\int_0^te^{i\omega t^\prime}dt^\prime=\frac{e^{i\omega t}-1}{i\omega}=e^{i\omega t/2}\frac{2\sin(\omega t/2)}{\omega}$, so $P=\frac{|V_{fi}|^2}{\hbar^2}\frac{4\sin^2(\omega_{if}t/2)}{\omega_{if}^2}=\left(\frac{\sin(\omega_{if}t/2)}{\hbar\omega_{if}/2}\right)^2|V_{fi}|^2$.'),
     ST(r'Describe the peak: height, zeros, area.', r'Height $t^2/\hbar^2\cdot|V_{fi}|^2$ at $\omega_{if}=0$, zeros at $\omega_{if}t=2n\pi$, width $\sim2\pi/t$; area $\propto t^2\cdot\frac{2\pi}t\propto t$ (substitute $u=\omega t/2$).'),
     ST(r'Sum over a dense group of final states.', r'$\sum_fP=\int dE_f\rho(E_f)|V_{fi}|^2\frac{\sin^2(\omega t/2)}{(\hbar\omega/2)^2}$ with $dE_f=\hbar d\omega$. For large $t$, $\frac{\sin^2(\omega t/2)}{(\omega/2)^2}\to2\pi t\,\delta(\omega)$, giving $\frac{2\pi}\hbar t\,\rho(E_f)|V_{fi}|^2$ at $E_f=E_i$.'),
     ST(r'Rate and conditions.', r'$\Gamma=\frac{d}{dt}\sum_fP=\frac{2\pi}\hbar|V_{fi}|^2\rho(E_f)$, valid for $2\pi\hbar/\Delta E_f<t\ll2\pi\hbar/\delta\varepsilon$ (and $\Gamma t\ll1$).')],
    [r'first-order amplitude with $e^{i\omega_{if}t^\prime}$', r'$\frac{\sin^2(\omega t/2)}{(\hbar\omega/2)^2}$ for a sudden switch-on', r'peak height $\propto t^2$, width $\propto1/t$, area $\propto t$', r'$\delta$-function limit and $\rho(E_f)$', r'validity window for $t$'], xp=35))

add('hydrogen-lamp', L('qm-gap-L3', 'Magnetic moment, Bohr magneton and the normal Zeeman effect', 'Ch. 9.6.1, eqs. (9.37)-(9.51); 9.7 (9.52)', [
    T(r'A charge $q$ in a field with potentials $\Phi,\vec A$ has (Gaussian units, as in the script) $H=\frac1{2m}\left(\vec p-\frac qc\vec A\right)^2+q\Phi$. For a constant field, $\vec A=-\frac12\vec x\wedge\vec B$ (Coulomb gauge), and the term linear in $\vec A$ becomes'),
    E(r'H_Z=-\vec M\cdot\vec B,\qquad \vec M=\frac q{2mc}\vec L', 'script (9.45)-(9.47): orbital magnetic moment'),
    T(r'The $\vec A^2$ term gives diamagnetism and is negligible for hydrogen in lab fields. For the electron ($q=-e$) the levels $(n,l,m)$ stay eigenstates, but the $m$-degeneracy is lifted:'),
    E(r'\Delta E_Z=\mu_BB_z\,m,\qquad \mu_B=\frac{e\hbar}{2m_ec}\ \ \left(\text{SI: }\frac{e\hbar}{2m_e}=5.79\times10^{-5}\ {\rm eV/T}\right)', 'script (9.50), (9.51)'),
    E(r'\vec M_{\rm el}=-g\frac e{2m_ec}\vec S,\qquad g=2+\frac\alpha\pi+\dots', 'spin magnetic moment (9.52)'),
    B('intuition', r'A circulating charge is a current loop: magnetic moment $\propto$ angular momentum. $g\approx2$ for spin compensates the half-integer $s_z$: orbit and spin give the same splitting steps (script Abb. 18: a p level splits into a quintuplet).'),
    B('pitfall', r'Gaussian vs SI: the script writes $q/2mc$; in SI drop the $c$. And $\vec M$ is antiparallel to $\vec L$ for the electron because $q=-e$.'),
    B('exam', r'Typical: count the Zeeman lines of a level, derive $H_Z$ from minimal coupling, compare normal and anomalous Zeeman effect (FS26 Q4, sheet 14).')],
    [K(r'An $l=1$ level (ignoring spin) in a field $B_z$ splits into', [r'3 levels spaced by $\mu_BB_z$', r'2 levels', r'5 levels', r'it does not split'], 0, r'$m=-1,0,1$, $\Delta E=\mu_BB_zm$.'),
     K(r'$\mu_B$ in SI units is about', [r'$5.8\times10^{-5}$ eV/T', r'$5.8\times10^{-2}$ eV/T', r'$1.6\times10^{-19}$ eV/T', r'$13.6$ eV/T'], 0, r'$e\hbar/2m_e=9.27\times10^{-24}$ J/T.')]))

add('hydrogen-lamp', D('qm-gap-D2', r'Minimal coupling gives $-\vec M\cdot\vec B$', 'Ch. 9.6.1, eqs. (9.39)-(9.47)',
    r'From $H=\frac1{2m}(\vec p-\frac qc\vec A)^2+q\Phi$ with $\vec p\to-i\hbar\nabla$, Coulomb gauge and $\vec A=-\frac12\vec x\wedge\vec B$, show that the term linear in $\vec B$ is $-\frac q{2mc}\vec L\cdot\vec B$.',
    [r'$\vec L=-i\hbar\,\vec x\wedge\nabla$', r'$\nabla\cdot\vec A=0$'],
    [ST(r'Expand the square with $\vec p=-i\hbar\nabla$.', r'$H=-\frac{\hbar^2}{2m}\Delta+\frac{i\hbar q}{2mc}(\nabla\cdot\vec A+\vec A\cdot\nabla)+\frac{q^2}{2mc^2}\vec A^2+q\Phi$ (9.41).'),
     ST(r'Use the Coulomb gauge.', r'$\nabla\cdot(\vec A\psi)=(\nabla\cdot\vec A)\psi+\vec A\cdot\nabla\psi=\vec A\cdot\nabla\psi$, so the linear term is $\frac{i\hbar q}{mc}\vec A\cdot\nabla$ (9.43).'),
     ST(r'Check that $\vec A=-\frac12\vec x\wedge\vec B$ gives $\nabla\wedge\vec A=\vec B$.', r'$(\nabla\wedge\vec A)_i=\varepsilon_{ijk}\partial_j(-\frac12\varepsilon_{klm}x_lB_m)=-\frac12(\delta_{il}\delta_{jm}-\delta_{im}\delta_{jl})\delta_{jl}B_m=-\frac12(B_i-3B_i)=B_i$.'),
     ST(r'Insert and use the triple product.', r'$\vec A\cdot\nabla=-\frac12(\vec x\wedge\vec B)\cdot\nabla=-\frac12(\nabla\wedge\vec x)\cdot\vec B$, rearranged as $-\frac12\vec B\cdot(\vec x\wedge\nabla)$. So $\frac{i\hbar q}{mc}\vec A\cdot\nabla=-\frac{i\hbar q}{2mc}(\vec x\wedge\nabla)\cdot\vec B=-\frac q{2mc}\vec L\cdot\vec B$.'),
     ST(r'Name the pieces.', r'$H_Z=-\vec M\cdot\vec B$ with $\vec M=\frac q{2mc}\vec L$ (normal Zeeman term); $\frac{q^2}{2mc^2}\vec A^2$ is the diamagnetic term.')],
    [r'$\vec p\to-i\hbar\nabla$ and expansion of the square', r'Coulomb gauge removes $\nabla\cdot\vec A$', r'$\vec A=-\frac12\vec x\wedge\vec B$ has curl $\vec B$', r'$\vec A\cdot\nabla\to\vec L\cdot\vec B$', r'$\vec M=\frac q{2mc}\vec L$']))

add('entanglement-lab', L('qm-gap-L4', 'Quantum teleportation', 'Ch. 10.3, eqs. (10.13)-(10.15) and the table', [
    T(r'Alice and Bob share the singlet $|\psi\rangle=\frac1{\sqrt2}(|\uparrow\downarrow\rangle-|\downarrow\uparrow\rangle)$ (particles 1, 2). Alice holds an unknown $|\varphi\rangle$ (particle 0) and may send only classical bits.'),
    T(r'Alice measures particles 0 and 1 in the Bell basis:'),
    E(r'|\chi_{1,2}\rangle=\tfrac1{\sqrt2}(|\uparrow\downarrow\rangle\mp|\downarrow\uparrow\rangle),\qquad |\chi_{3,4}\rangle=\tfrac1{\sqrt2}(|\uparrow\uparrow\rangle\mp|\downarrow\downarrow\rangle)', 'script, below (10.15)'),
    T(r'Rewriting $|\varphi\rangle\otimes|\psi\rangle$ in this basis, each outcome $i$ (probability $\frac14$) leaves Bob&#8217;s particle in a fixed unitary image of $|\varphi\rangle$. Alice sends $i$ (2 bits), Bob applies:'),
    E(r'i=1:\ \mathbb 1\to-|\varphi\rangle,\quad i=2:\ \sigma_3\to-|\varphi\rangle,\quad i=3:\ \sigma_1\to|\varphi\rangle,\quad i=4:\ \sigma_2\to-i|\varphi\rangle', 'table in 10.3 (checked numerically)'),
    B('intuition', r'The entanglement carries the &#8220;continuous&#8221; information, the two bits only tell Bob which of four rotations to undo. Nothing travels faster than light: without the bits Bob&#8217;s particle is maximally mixed.'),
    B('pitfall', r'No cloning: Alice&#8217;s measurement destroys $|\varphi\rangle$ on her side. And Alice never learns $|\varphi\rangle$.'),
    B('exam', r'Know the protocol, why 2 classical bits are needed, and why it does not allow superluminal signalling.')],
    [K(r'How many classical bits must Alice send?', [r'2', r'1', r'infinitely many (to describe $|\varphi\rangle$)', r'none'], 0, r'Four equally likely outcomes.'),
     K(r'Before Bob receives Alice&#8217;s message, his particle is', [r'maximally mixed: he learns nothing about $|\varphi\rangle$', r'already in $|\varphi\rangle$', r'in $|\uparrow\rangle$', r'destroyed'], 0, r'Averaging over the four outcomes gives $\frac12\mathbb 1$: no signalling.')]))

add('formalism-and-uncertainty', L('qm-gap-L5', 'Continuous spectra: the spectrum, the spectral theorem and probabilities', 'Ch. 4.6, eqs. (4.37)-(4.48)', [
    T(r'In infinite dimensions an observable need not have eigenvectors (a plane wave is not normalisable). The right generalisation is the <b>spectrum</b>:'),
    E(r'\lambda\in\sigma(A)\iff\forall\varepsilon>0\ \exists\psi,\ \langle\psi|\psi\rangle=1:\ \|(A-\lambda)\psi\|\le\varepsilon', 'script (4.37)'),
    T(r'Eigenvalues belong to $\sigma(A)$; for self-adjoint $A$ the spectrum is real, and it is the set of possible measurement results. Examples:'),
    E(r'\text{free: }\sigma(x)=\sigma(p)=\mathbb R,\ \sigma(H)=\mathbb R_+;\quad \text{well: }\sigma(H)=\{E_1,\dots,E_N\}\cup\mathbb R_+;\quad \text{HO: }\{\hbar\omega(n+\tfrac12)\}', 'script (4.39)-(4.41)'),
    T(r'<b>Spectral theorem:</b> there is a unique map $f\mapsto f(A)$ with $f(A)=\sum_af(a)P_a$ in the discrete case. For an interval $I$, $P_I(A)$ (characteristic function) is an orthogonal projector, and $W_\psi(I)=\langle\psi|P_I(A)|\psi\rangle$ is the probability to measure a value in $I$, with $\langle A\rangle_\psi=\langle\psi|A|\psi\rangle$.'),
    B('intuition', r'For a continuous spectrum you never get a sharp value with a normalisable state, only probabilities for intervals; $\|(A-\lambda)\psi\|\le\varepsilon$ says &#8220;almost eigenvectors&#8221; exist, e.g. very long wave packets for $p$.'),
    B('pitfall', r'$\delta$-normalised states like $|p\rangle$ are not elements of $\mathcal H$; they are a bookkeeping device ($\langle p|p^\prime\rangle=\delta(p-p^\prime)$).'),
    B('exam', r'Short questions: what is the spectrum of $H$ for a finite well, a free particle, the oscillator; why plane waves are not states.')],
    [K(r'The spectrum of $H$ for a finite square well is', [r'finitely many bound energies plus $\mathbb R_+$', r'purely discrete', r'purely continuous', r'all of $\mathbb R$'], 0, r'(4.40).'),
     K(r'$\langle\psi|P_I(A)|\psi\rangle$ is', [r'the probability to measure $A$ in $I$', r'the expectation value of $A$', r'always 0 or 1', r'the variance'], 0, r'$W_\psi(I)$, a probability measure.')]))

add('wave-mechanics-basics', L('qm-gap-L6', 'Old quantum theory: Planck and Bohr-Sommerfeld', 'Ch. 1.1 (Planck), 1.3 (Bohr-Sommerfeld, (1.18)-(1.19))', [
    T(r'<b>Planck (1900).</b> Classically each mode of cavity radiation carries $k_BT$ (Rayleigh-Jeans), and the energy density diverges at high frequency. Planck: a mode of frequency $\nu$ exchanges energy only in quanta $h\nu$. The mean energy per mode is then $\frac{h\nu}{e^{h\nu/k_BT}-1}$:'),
    E(r'u(\nu,T)=\frac{8\pi h\nu^3}{c^3}\frac1{e^{h\nu/k_BT}-1}\ \xrightarrow{h\nu\ll k_BT}\ \frac{8\pi\nu^2}{c^3}k_BT', 'Planck law and Rayleigh-Jeans limit'),
    T(r'<b>Bohr-Sommerfeld (1915).</b> Allowed classical orbits of a bound one-dimensional system are those with quantised action:'),
    E(r'\oint p\,dq=2\pi n\hbar=nh', 'script (1.18)'),
    T(r'Oscillator: the orbit $\frac{p^2}{2m}+\frac12m\omega_0^2q^2=E$ is an ellipse with semi-axes $\sqrt{2mE}$ and $\sqrt{2E/m\omega_0^2}$, area $\pi\sqrt{2mE}\sqrt{2E/m}/\omega_0=2\pi E/\omega_0$, so $E_n=n\hbar\omega_0$ (1.19), matching Planck. The exact result $\hbar\omega_0(n+\frac12)$ needs the full theory (WKB adds the $\frac12$).'),
    B('intuition', r'Phase space comes in cells of area $h$: the old quantum theory picks the orbits that enclose an integer number of cells.'),
    B('pitfall', r'Bohr-Sommerfeld misses the zero-point energy and fails for systems that are not separable; it is a semiclassical rule, not quantum mechanics.'),
    B('exam', r'Older short questions: derive $E_n$ of the oscillator or the Bohr radius from quantisation conditions; Rayleigh-Jeans as the $h\to0$ limit.')],
    [K(r'Bohr-Sommerfeld for the harmonic oscillator gives', [r'$E_n=n\hbar\omega_0$', r'$E_n=\hbar\omega_0(n+\frac12)$', r'$E_n\propto n^2$', r'$E_n\propto1/n^2$'], 0, r'Area of the ellipse $2\pi E/\omega_0=2\pi n\hbar$.'),
     K(r'For $h\nu\ll k_BT$, Planck&#8217;s law reduces to', [r'Rayleigh-Jeans, $u\propto\nu^2T$', r'Wien, $u\propto\nu^3e^{-h\nu/k_BT}$', r'zero', r'Stefan-Boltzmann'], 0, r'$e^x-1\approx x$.')], minutes=10))

add('perturbation-forge', {'type': 'quiz', 'id': 'qm-gap-Q1', 'xp': 20, 'title': 'Check: time-dependent PT, Zeeman, teleportation, spectra',
    'source': {'file': SCRIPT, 'where': 'Ch. 1.1, 1.3, 4.6, 9.6, 10.3, 11.3'},
    'questions': [
        {'q': r'The width of the energy-conservation peak after time $t$ is about', 'options': [r'$\Delta E\sim2\pi\hbar/t$', r'$\Delta E\sim t/\hbar$', r'$\Delta E=0$', r'$\Delta E\sim\hbar t$'], 'correct': 0, 'explain': r'(11.101): $\Delta\omega_{if}t\sim2\pi$.'},
        {'q': r'The golden rule needs a', 'options': [r'dense group (continuum) of final states', r'single isolated final state', r'degenerate initial state', r'strong perturbation'], 'correct': 0, 'explain': r'Many states under the peak, $\delta\varepsilon\ll2\pi\hbar/t$.'},
        {'q': r'In the Dirac picture, if $H^\prime=0$ then $\Psi_D(t)$', 'options': [r'is constant', r'rotates with $e^{-iH_0t/\hbar}$', r'decays', r'is undefined'], 'correct': 0, 'explain': r'All $H_0$ evolution was moved to the operators.'},
        {'q': r'The normal Zeeman shift of $(n,l,m)$ is', 'options': [r'$\mu_BB_zm$', r'$\mu_BB_zl$', r'$\mu_BB_zn$', r'$2\mu_BB_zm$'], 'correct': 0, 'explain': r'(9.50).'},
        {'q': r'Teleportation transmits $|\varphi\rangle$ using', 'options': [r'a shared entangled pair plus 2 classical bits', r'only classical bits', r'only the entangled pair', r'cloning'], 'correct': 0, 'explain': r'Bell measurement, 4 outcomes, Bob corrects with $\mathbb 1,\sigma_3,\sigma_1,\sigma_2$.'},
        {'q': r'$\sigma(p)$ for a free particle is', 'options': [r'$\mathbb R$', r'$\mathbb R_+$', r'$\{0\}$', r'$\hbar\mathbb Z$'], 'correct': 0, 'explain': r'(4.39).'},
    ]})

with open(OUT, 'w') as f: json.dump({'about': 'QM script gaps from the coverage map; built by notes/quantum-mechanics/build/gaps/build.py', 'items': items}, f, ensure_ascii=False, indent=1)
print(len(items), 'encounters ->', os.path.relpath(OUT))
