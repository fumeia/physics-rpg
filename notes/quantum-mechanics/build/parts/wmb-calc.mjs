import { src, choice, sym, order, num, calc } from '../lib.mjs';
const r = String.raw;

export const calcs = [
  calc({
    id: 'qm-wm-c1', title: r`Compton shift of an X-ray photon (sheet I Q1)`, xp: 50,
    problem: r`An X-ray photon scatters off a free electron at rest and emerges at angle $\theta$ to its original direction. Find the wavelength shift and evaluate it at $\theta=90^\circ$. Source: sheet I Q1; numbers are an adaptation chosen for the game.`,
    symbols: [[r`$h$`, r`Planck constant`], [r`$m$`, r`electron mass`], [r`$c$`, r`speed of light`], [r`$\theta$`, r`scattering angle of the photon`], [r`$\lambda_C$`, r`Compton wavelength $h/mc$`]],
    vars: { h: 6.62607015e-34, m: 9.1093837e-31, c: 2.99792458e8, th: 1.5707963267948966 },
    derivation: [{ title: 'Method', html: r`<p>Energy and momentum conservation with relativistic electron energy; square the electron momentum to remove the electron angle.</p>` }],
    steps: [
      choice('s1', r`Why can the shift not be explained by classical (Thomson) scattering?`, r`the classical electron radiates at the driving frequency, so $\lambda_2=\lambda_1$; the shift needs photon momentum $\hbar k$`, [[r`because the electron is too heavy`, r`The shift is $\propto1/m$, but the classical wave picture gives exactly zero for any $m$.`], [r`because X-rays are not waves`, r`Wave properties are used in diffraction; the failing piece is the energy-momentum transfer to a single electron.`], [r`because the shift depends on the intensity`, r`The shift depends only on the angle, not on intensity.`]]),
      order('s2', r`Order the derivation.`, [
        { text: r`Write energy and momentum conservation`, note: r`$\hbar k_1c+mc^2=\hbar k_2c+E_e$`, why: r`Starting point, nothing to eliminate yet.` },
        { text: r`Square the momentum law to get $p_e^2$ without the electron angle`, note: r`$p_e^2=\hbar^2(k_1^2+k_2^2-2k_1k_2\cos\theta)$`, why: r`Only the photon angle $\theta$ should survive.` },
        { text: r`Insert $E_e=\hbar c(k_1-k_2)+mc^2$ into $E_e^2=p_e^2c^2+m^2c^4$`, note: r`squares of $k$ cancel`, why: r`Needs $p_e^2$ from the previous step.` },
        { text: r`Divide by $k_1k_2$ and convert $k=2\pi/\lambda$`, note: r`$\lambda_2-\lambda_1=\frac h{mc}(1-\cos\theta)$`, why: r`Final simplification.` },
      ], r`conservation, eliminate the electron angle, equate energies, convert to wavelengths.`),
      sym('s3', r`Type the shift $\lambda_2-\lambda_1$ (symbols <code>h</code>, <code>m</code>, <code>c</code>, <code>th</code>).`, 'h/(m*c)*(1-cos(th))', { h: [0.5, 2], m: [0.5, 2], c: [0.5, 2], th: [0.2, 3] }, 'length', ['length', 'dimensionless', 'time', 'energy'], r`\lambda_2-\lambda_1=\frac h{mc}(1-\cos\theta)`, r`$\lambda_C=h/mc$ is a length; the angular factor $1-\cos\theta$ runs from $0$ (forward) to $2$ (backward).`, { wrong: ['h/(m*c)*(1+cos(th))', 'h/(m*c)*sin(th)', 'h/(m*c**2)*(1-cos(th))'] }),
      num('s4', r`Bonus: the shift at $\theta=90^\circ$ in pm (use <code>h</code>, <code>m</code>, <code>c</code> in SI and multiply by $10^{12}$).`, '1e12*h/(m*c)*(1-cos(th))', 'pm', ['pm', 'nm', 'm'], 0.01, r`$h/mc=2.426\times10^{-12}$ m, and $1-\cos90^\circ=1$, so the shift is $2.43$ pm.`, { bonus: true }),
    ],
  }),
  calc({
    id: 'qm-wm-c2', title: r`How fast does a localised electron spread? (sheet III Q1, free evolution)`, xp: 60,
    problem: r`An electron is prepared in the Gaussian $\Psi(x,0)=(\lambda/\pi)^{1/4}e^{-\lambda x^2/2}$ with initial width $\Delta x_0=1$ Angstrom and then moves freely. Find $\Delta x(t)$ and the time after which the width has grown by the factor $\sqrt2$. Source: sheet III Q1 extended by free evolution (adaptation).`,
    symbols: [[r`$\lambda$`, r`Gaussian parameter, $\Delta x_0^2=1/2\lambda$`], [r`$\hbar$`, r`reduced Planck constant`], [r`$m$`, r`electron mass`], [r`$t$`, r`time`], [r`$\Delta x_0$`, r`initial width`]],
    vars: { hbar: 1.054571817e-34, m: 9.1093837e-31, dx: 1e-10 },
    derivation: [{ title: 'Method', html: r`<p>$\Delta p$ is constant, the position width grows ballistically: $\Delta x^2=\Delta x_0^2+(\Delta p\,t/m)^2$ with $\Delta p=\hbar/(2\Delta x_0)$.</p>` }],
    steps: [
      choice('s1', r`Which statement about $\Delta p$ is true during free evolution?`, r`$\Delta p=\hbar\sqrt{\lambda/2}$ stays constant because $[H,p]=0$`, [[r`$\Delta p$ grows like $\Delta x$`, r`$|\tilde\Psi(p,t)|^2$ is time independent; only the phases of momentum components change.`], [r`$\Delta p$ shrinks, since the packet becomes more classical`, r`The uncertainty product grows, but $\Delta p$ itself is conserved.`], [r`$\Delta p=0$ for a free particle`, r`A localised packet needs a spread of momenta.`]]),
      order('s2', r`Order the argument.`, [
        { text: r`Compute $\Delta x_0^2=1/2\lambda$ and $\Delta p^2=\hbar^2\lambda/2$ at $t=0$`, note: r`$\Delta x_0\Delta p=\hbar/2$`, why: r`Initial data come first.` },
        { text: r`Evolve each momentum component with $e^{-ip^2t/2m\hbar}$`, note: r`momentum distribution unchanged`, why: r`Free evolution is diagonal in momentum space.` },
        { text: r`Do the Gaussian integral back to position space`, note: r`complex width $\lambda\to\lambda/(1+i\hbar\lambda t/m)$`, why: r`Needs the evolved momentum amplitudes.` },
        { text: r`Read off $\Delta x(t)^2=\frac1{2\lambda}[1+(\hbar\lambda t/m)^2]$`, note: r`from $|\Psi|^2$`, why: r`Last: the width follows from the modulus squared.` },
      ], r`initial data, phases, integral, width.`),
      sym('s3', r`Type $\Delta x(t)^2$ (symbols <code>lam</code>, <code>hbar</code>, <code>m</code>, <code>t</code>).`, '(1+(hbar*lam*t/m)**2)/(2*lam)', { lam: [0.5, 2], hbar: [0.5, 2], m: [0.5, 2], t: [0.2, 3] }, 'length^2', ['length^2', 'length', 'dimensionless', 'time'], r`\Delta x(t)^2=\frac1{2\lambda}\Big[1+\Big(\frac{\hbar\lambda t}m\Big)^2\Big]`, r`Equivalent: $\Delta x_0^2+(\Delta p\,t/m)^2$ with $\Delta p^2=\hbar^2\lambda/2$.`, { wrong: ['(1+(hbar*lam*t/m))/(2*lam)', '(1+(hbar*t/(m*lam))**2)/(2*lam)', '(1+(hbar*lam*t/m)**2)/lam'] }),
      num('s4', r`Bonus: the time (in attoseconds) when $\Delta x=\sqrt2\,\Delta x_0$ for $\Delta x_0=10^{-10}$ m (<code>dx</code>).`, '1e18*2*m*dx**2/hbar', 'as', ['as', 'fs', 's'], 0.02, r`$\hbar\lambda t/m=1$ with $\lambda=1/2\Delta x_0^2$ gives $t=2m\Delta x_0^2/\hbar=1.73\times10^{-16}$ s $=173$ as.`, { bonus: true }),
    ],
  }),
  calc({
    id: 'qm-wm-c3', title: r`The suddenly moved wall (sheet III Q4)`, xp: 60,
    problem: r`A particle is in the ground state of a box $[0,a]$. The right wall is suddenly moved to $2a$. Find the probability $P_n$ to measure the new energy $E_n=\frac{n^2\pi^2\hbar^2}{8ma^2}$ and evaluate $P_1$. Source: sheet III Q4.`,
    symbols: [[r`$a$`, r`original box width`], [r`$n$`, r`quantum number in the new box (odd)`], [r`$c_n$`, r`overlap $\langle\phi_n|\psi_1\rangle$`], [r`$P_n$`, r`probability $|c_n|^2$`]],
    vars: { n: 1 },
    derivation: [{ title: 'Method', html: r`<p>Sudden approximation: the wave function stays $\psi_1$ (zero for $x>a$). Expand it in $\phi_n=\frac1{\sqrt a}\sin\frac{n\pi x}{2a}$.</p>` }],
    steps: [
      choice('s1', r`Which wave function is expanded right after the move?`, r`the old $\psi_1$, extended by zero on $[a,2a]$`, [[r`$\sqrt{1/a}\sin(\pi x/2a)$, the new ground state`, r`The new ground state is the result of a slow (adiabatic) expansion, not of a sudden one.`], [r`$\psi_1$ stretched to $[0,2a]$`, r`Stretching would be adiabatic; suddenly the function has no time to change.`], [r`$\psi_1\,e^{-iEt/\hbar}$ with the new $E$`, r`The wave function is continuous in time; the energy is not a property of it before the measurement.`]]),
      order('s2', r`Order the calculation.`, [
        { text: r`Write $c_n=\frac{\sqrt2}a\int_0^a\sin\frac{\pi x}a\sin\frac{n\pi x}{2a}dx$`, note: r`integration only up to $a$`, why: r`Define the overlap before evaluating.` },
        { text: r`Treat $n=2$ separately: $c_2=\frac{\sqrt2}a\cdot\frac a2$`, note: r`$P_2=\frac12$`, why: r`The two sines coincide, the general formula has a $0/0$.` },
        { text: r`For $n\ne2$ use product-to-sum; even $n$ gives $0$, odd $n$ gives $\frac{4\sqrt2\sin(n\pi/2)}{\pi(4-n^2)}$`, note: r`$\sin(n\pi/2)=\pm1$`, why: r`Needs the setup for $c_n$.` },
        { text: r`Square: $P_n=\frac{32}{\pi^2(n^2-4)^2}$ and check $\sum P_n=1$`, note: r`$\frac12+\sum_{\text{odd}}=1$`, why: r`The check closes the calculation.` },
      ], r`overlap, $n=2$, general $n$, square and check.`),
      sym('s3', r`Type $P_n$ for odd $n$ (symbol <code>n</code>).`, '32/(pi**2*(n**2-4)**2)', { n: [3, 9] }, 'dimensionless', ['dimensionless', 'energy', 'length', 'energy*length'], r`P_n=\frac{32}{\pi^2(n^2-4)^2}`, r`$c_n=\frac{4\sqrt2\sin(n\pi/2)}{\pi(4-n^2)}$ for odd $n$; the sign drops out when squaring.`, { wrong: ['32/(pi**2*(n**2-4))', '16/(pi**2*(n**2-4)**2)', '32/(pi*(n**2-4)**2)'] }),
      num('s4', r`Bonus: evaluate $P_1$ (use <code>n</code>).`, '32/(pi**2*(n**2-4)**2)', 'dimensionless', ['dimensionless', 'percent', 'eV'], 0.01, r`$P_1=\frac{32}{9\pi^2}=0.360$; with $P_2=\frac12$ and $P_3=0.130$ the first three terms give $0.99$.`, { bonus: true }),
    ],
  }),
];
