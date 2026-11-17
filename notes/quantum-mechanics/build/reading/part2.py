"""QM reading cards, chapters 1-6 (second batch). Imported by build.py: CARDS_1_6(card) -> list of {room, enc}."""


def CARDS_1_6(card):
    C = []
    # ------------------------------------------------------------ chapter 1-2
    C.append(card('qm-read-01a', 1, 'wave-mechanics-basics', '1.1–1.5', '5–13', 'the historical beginnings',
      ['Which experiment forced each new idea: quantised energy, quantised orbits, photons, matter waves?', 'What survives of the old quantum theory in today&#8217;s QM, and what does not?'],
      'Look for: Planck&#8217;s quanta $h\\nu$ and the radiation law, Bohr&#8217;s postulates, Bohr-Sommerfeld $\\oint p\\,dq=nh$ (1.18) and the oscillator $E_n=n\\hbar\\omega_0$ (1.19), photoeffect and Compton shift, de Broglie $\\lambda=h/p$.',
      [(r'Compton: why does the shift $\Delta\lambda=\frac h{mc}(1-\cos\theta)$ prove that light carries momentum?', r'It follows from energy and momentum conservation for a photon with $E=pc=h\nu$ hitting a free electron; a classical wave (Thomson) would scatter without a wavelength shift.'),
       (r'Bohr: from $L=n\hbar$ and the Coulomb force, derive the radius $r_n$.', r'$\frac{mv^2}r=\frac{e^2}{r^2}$ and $mvr=n\hbar$ give $r_n=\frac{n^2\hbar^2}{me^2}=n^2a$ and $E_n=-\frac{me^4}{2\hbar^2n^2}$ (Gaussian units).')],
      [(r'Bohr-Sommerfeld quantises', [r'the action $\oint p\,dq$', r'the energy directly', r'the position', r'the momentum $p$'], r'(1.18).'),
       (r'The de Broglie wavelength is', [r'$h/p$', r'$hc/E$ for every particle', r'$\hbar/mc$', r'$p/h$'], r'Script 1.5.')], minutes=30))
    C.append(card('qm-read-02a', 1, 'wave-mechanics-basics', '2.1', '14–15', 'the Schrödinger equation',
      ['How do you guess a wave equation from $E=\\hbar\\omega$ and $p=\\hbar k$?', 'Why must the equation be first order in time and linear?'],
      'Look for: plane waves $e^{i(kx-\\omega t)}$, the replacements $E\\to i\\hbar\\partial_t$, $p\\to-i\\hbar\\nabla$, the free equation and the potential term, the probability interpretation of $|\\Psi|^2$.',
      [(r'Which free-particle dispersion does $i\hbar\partial_t\Psi=-\frac{\hbar^2}{2m}\nabla^2\Psi$ encode?', r'Inserting $e^{i(\mathbf k\cdot\mathbf x-\omega t)}$: $\hbar\omega=\frac{\hbar^2k^2}{2m}$, i.e. $E=\frac{p^2}{2m}$.'),
       (r'Why linear?', r'Superposition: interference of matter waves (double slit) needs $\alpha\Psi_1+\beta\Psi_2$ to be a solution too.')],
      [(r'The momentum operator in position space is', [r'$-i\hbar\nabla$', r'$i\hbar\nabla$', r'$\hbar\nabla$', r'$m\dot x$'], r'Script 2.1.'),
       (r'$|\Psi(\mathbf x,t)|^2$ is', [r'a probability density', r'the charge of the particle', r'the energy density', r'always 1'], r'Born.')], minutes=15))
    C.append(card('qm-read-02b', 2, 'wave-mechanics-basics', '2.2–2.4', '16–19', 'current, Ehrenfest, real observables',
      ['Why must probability be conserved, and what is the current that carries it?', 'In what sense does classical mechanics come back?'],
      'Look for: the continuity equation $\\partial_t\\rho+\\nabla\\cdot\\mathbf j=0$ with $\\mathbf j=\\frac\\hbar{2mi}(\\Psi^*\\nabla\\Psi-\\Psi\\nabla\\Psi^*)$, Ehrenfest&#8217;s theorem, hermiticity and real expectation values.',
      [(r'Derive the continuity equation.', r'$\partial_t|\Psi|^2=\Psi^*\dot\Psi+\Psi\dot\Psi^*$; insert the Schrödinger equation and its conjugate: the real potential cancels, the kinetic terms give $-\nabla\cdot\mathbf j$.'),
       (r'Ehrenfest: is $\frac d{dt}\langle p\rangle=-\langle V^\prime(x)\rangle$ the same as Newton for $\langle x\rangle$?', r'Only if $\langle V^\prime(x)\rangle=V^\prime(\langle x\rangle)$, true for at most quadratic potentials (free particle, oscillator) or very narrow wave packets.')],
      [(r'The probability current of $e^{ikx}$ is', [r'$\frac{\hbar k}m$ (times $|A|^2$)', r'$0$', r'$\hbar k$', r'$\frac{k}{m}$'], r'Sheet 2.'),
       (r'Expectation values of hermitian operators are', [r'real', r'imaginary', r'zero', r'complex in general'], r'Script 2.4.')], minutes=15))
    C.append(card('qm-read-02c', 2, 'wave-mechanics-basics', '2.5–2.7', '19–25', 'stationary states and energy measurement',
      ['Why does separation of variables give the time-independent equation?', 'What is the probability to measure $E_n$?'],
      'Look for: $\\Psi=\\psi(x)e^{-iEt/\\hbar}$, the eigenvalue problem $H\\psi=E\\psi$, completeness and orthogonality of eigenstates, $\\Psi=\\sum c_n\\psi_ne^{-iE_nt/\\hbar}$, $P(E_n)=|c_n|^2$, collapse.',
      [(r'Why is $|\Psi(x,t)|^2$ of a single eigenstate time independent but that of a superposition not?', r'The phase $e^{-iE_nt/\hbar}$ cancels in $|\cdot|^2$ for one state; for two, cross terms oscillate with $\cos((E_1-E_2)t/\hbar)$.'),
       (r'How do you compute $c_n$?', r'$c_n=\langle\psi_n|\Psi(0)\rangle=\int\psi_n^*\Psi(x,0)\,dx$, using orthonormality; $\sum|c_n|^2=1$.')],
      [(r'After measuring $E_n$ the state is', [r'$\psi_n$ (collapse)', r'unchanged', r'$\sum c_n\psi_n$', r'zero'], r'Script 2.7.'),
       (r'$\langle H\rangle=$', [r'$\sum|c_n|^2E_n$', r'$\sum c_nE_n$', r'$E_1$', r'$\max E_n$'], r'Weighted by the probabilities.')], minutes=25))
    # ------------------------------------------------------------ chapter 3
    C.append(card('qm-read-03a', 3, 'wave-mechanics-basics', '3.1', '26–27', 'the particle in the box',
      ['Which boundary conditions, and why do they quantise the energy?'],
      'Look for: $\\psi(0)=\\psi(L)=0$, $\\psi_n=\\sqrt{2/L}\\sin(n\\pi x/L)$, $E_n=\\frac{\\hbar^2\\pi^2n^2}{2mL^2}$, nodes and parity about the centre.',
      [(r'Why is there no $n=0$ state?', r'$\sin0=0$ everywhere: not normalisable. The ground state has $E_1>0$, consistent with $\Delta x\Delta p\ge\hbar/2$.'),
       (r'How does $E_n$ scale with $L$, and what does it mean physically?', r'$E_n\propto1/L^2$: confining a particle costs kinetic energy (the basis of quantum dots and of degeneracy pressure).')],
      [(r'$E_n$ of the infinite well of width $L$ is', [r'$\frac{\hbar^2\pi^2n^2}{2mL^2}$', r'$\frac{\hbar^2n^2}{2mL^2}$', r'$n\hbar\omega$', r'$\frac{\hbar^2\pi^2n}{2mL}$'], r'Script 3.1.'),
       (r'The $n$-th eigenfunction has', [r'$n-1$ nodes inside the box', r'$n$ nodes', r'no nodes', r'$2n$ nodes'], r'Node theorem.')], minutes=15))
    C.append(card('qm-read-03d', 3, 'wave-mechanics-basics', '3.4', '33–35', 'normalisation and wave packets',
      ['Plane waves are not normalisable. How do real particles look then?', 'Why does a free wave packet spread?'],
      'Look for: superpositions $\\int\\phi(k)e^{i(kx-\\omega(k)t)}dk$, group velocity $d\\omega/dk$, the Gaussian packet and its width $\\Delta x(t)$.',
      [(r'Group vs phase velocity for $\omega=\hbar k^2/2m$?', r'$v_g=\frac{d\omega}{dk}=\frac{\hbar k}m=\frac pm$ (the classical velocity), $v_{ph}=\frac\omega k=\frac{v_g}2$.'),
       (r'Width of a free Gaussian packet in time?', r'$\Delta x(t)=\Delta x_0\sqrt{1+\left(\frac{\hbar t}{2m\Delta x_0^2}\right)^2}$: the momentum spread $\Delta p=\hbar/2\Delta x_0$ makes it spread, faster for narrower packets.')],
      [(r'A wave packet moves with', [r'the group velocity', r'the phase velocity', r'the speed of light', r'zero velocity'], r'Script 3.4.'),
       (r'A narrower Gaussian packet spreads', [r'faster', r'slower', r'not at all', r'only in 3D'], r'Larger $\Delta p$.')], minutes=15))
    C.append(card('qm-read-03b', 4, 'tunneling-bridge', '3.2–3.3', '28–32', 'the finite well and the step',
      ['Why is a bound state in a finite well always possible in 1D?', 'What happens at a step with $E<V_0$ and with $E>V_0$?'],
      'Look for: matching $\\psi$ and $\\psi^\\prime$ at the walls, even and odd solutions, the graphical solution with $\\xi^2+\\eta^2=$ const, the step: reflection and transmission, evanescent wave.',
      [(r'Why is there always at least one even bound state?', r'In the graphical solution the even condition $\eta=\xi\tan\xi$ starts at the origin, and the circle $\xi^2+\eta^2=R^2$ (any $R>0$) always crosses it once.'),
       (r'Step with $E<V_0$: what is $R$, and what is the wave inside?', r'$R=1$ (total reflection), $\psi\propto e^{-\kappa x}$ with $\kappa=\sqrt{2m(V_0-E)}/\hbar$; the current vanishes inside.')],
      [(r'A step with $E>V_0$ reflects', [r'partly, even though classically nothing would', r'everything', r'nothing', r'only for $V_0<0$'], r'Wave reflection at a change of $k$.'),
       (r'At a finite step, $\psi$ and $\psi^\prime$ are', [r'both continuous', r'both discontinuous', r'only $\psi$ continuous', r'only $\psi^\prime$ continuous'], r'Only a $\delta$ potential makes $\psi^\prime$ jump.')], minutes=20))
    C.append(card('qm-read-03c', 5, 'tunneling-bridge', '3.5', '36–40', 'positive energies: tunnelling and resonances',
      ['Why can a particle pass a barrier higher than its energy?', 'When is a barrier or well completely transparent?'],
      'Look for: scattering states over the well, transmission through a barrier, $T\\approx e^{-2\\kappa a}$ for thick barriers (3.5.1), resonances $T=1$ when the well fits half-wavelengths (3.5.2).',
      [(r'Estimate $T$ for an electron, barrier 1 eV above $E$, width 1 nm.', r'$\kappa=\sqrt{2m\cdot1\,{\rm eV}}/\hbar=5.1$ nm$^{-1}$, $T\sim e^{-2\kappa a}=e^{-10.2}\approx4\times10^{-5}$ (prefactor of order 1).'),
       (r'Resonance condition over a well of width $2a$?', r'$T=1$ when $\sin(2qa)=0$, $q=\sqrt{2m(E+V_0)}/\hbar$: an integer number of half wavelengths fits; reflections from both edges cancel (as in a Fabry-Pérot).')],
      [(r'Tunnelling probability depends on the barrier width roughly as', [r'$e^{-2\kappa a}$', r'$1/a$', r'$a^2$', r'not at all'], r'Script 3.5.1.'),
       (r'At a transmission resonance', [r'$T=1$', r'$T=0$', r'$R=1$', r'the particle is bound'], r'Script 3.5.2.')], minutes=20))
    # ------------------------------------------------------------ chapter 4-5
    C.append(card('qm-read-04a', 5, 'formalism-and-uncertainty', '4.1–4.3', '41–44', 'Hilbert space',
      ['What structure does a space of states need, and why complete?', 'Why are states rays rather than vectors?'],
      'Look for: inner product and norm, completeness, $L^2$ with $\\int|\\psi|^2<\\infty$, separable spaces with a countable orthonormal basis.',
      [(r'Why is $L^2$ the right space for wave functions?', r'The probability interpretation needs $\int|\psi|^2=1$, so only square-integrable functions are states; $L^2$ is complete (limits of Cauchy sequences stay inside).'),
       (r'Why do $\psi$ and $e^{i\alpha}\psi$ describe the same state?', r'All probabilities $|\langle\phi|\psi\rangle|^2$ are unchanged by a global phase.')],
      [(r'A Hilbert space is', [r'a complete inner-product space', r'any vector space', r'a set of functions without norm', r'always finite dimensional'], r'Script 4.1.'),
       (r'$L^2(\mathbb R)$ contains', [r'square-integrable functions', r'all continuous functions', r'plane waves', r'only polynomials'], r'Script 4.2.')], minutes=15))
    C.append(card('qm-read-04b', 6, 'formalism-and-uncertainty', '4.4–4.5', '44–47', 'operators, measurement, Dirac notation',
      ['What makes an operator an observable?', 'What exactly does a measurement postulate say?'],
      'Look for: linear and self-adjoint operators, real eigenvalues and orthogonal eigenvectors, measurement results = eigenvalues, probabilities $|\\langle a|\\psi\\rangle|^2$, projectors, bras and kets.',
      [(r'Prove that eigenvalues of a self-adjoint operator are real and eigenvectors to different eigenvalues orthogonal.', r'$a\langle a|a\rangle=\langle a|A|a\rangle=\overline{\langle a|A|a\rangle}=\bar a\langle a|a\rangle$; and $(a-b)\langle b|a\rangle=\langle b|A|a\rangle-\langle b|A|a\rangle=0$.'),
       (r'Write $A$ through its projectors.', r'$A=\sum_aa\,P_a$, $P_a=\sum|a,i\rangle\langle a,i|$ over a degenerate eigenspace; $\langle A\rangle=\sum a\langle\psi|P_a|\psi\rangle$.')],
      [(r'The possible results of measuring $A$ are', [r'its eigenvalues (spectrum)', r'its matrix elements', r'any real number', r'$\langle A\rangle$ only'], r'Script 4.5.'),
       (r'$|\psi\rangle\langle\psi|$ for a normalised $\psi$ is', [r'a projector', r'a number', r'zero', r'unitary'], r'Squares to itself.')], minutes=20))
    C.append(card('qm-read-04c', 6, 'formalism-and-uncertainty', '4.6–4.7', '48–51', 'continuous spectra; other representations',
      ['What replaces eigenvalues when no normalisable eigenvectors exist?', 'How does the momentum representation relate to the position one?'],
      'Look for: the spectrum (4.37), examples (4.39)-(4.41), the spectral theorem and $W_\\psi(I)=\\langle\\psi|P_I(A)|\\psi\\rangle$ (4.42)-(4.48); 4.7: Fourier transform to momentum space.',
      [(r'Why is $\lambda$ in the spectrum of $p$ although $e^{i\lambda x/\hbar}$ is not in $L^2$?', r'Long wave packets $\psi_L$ around $\lambda$ make $\|(p-\lambda)\psi_L\|$ arbitrarily small: (4.37) holds.'),
       (r'What is $\tilde\psi(p)$ and its meaning?', r'$\tilde\psi(p)=\frac1{\sqrt{2\pi\hbar}}\int e^{-ipx/\hbar}\psi(x)dx$; $|\tilde\psi(p)|^2$ is the momentum distribution (sheet 6: the $\delta$ well in momentum space).')],
      [(r'The spectrum of $H$ for the oscillator is', [r'purely discrete', r'purely continuous', r'both', r'empty'], r'(4.41).'),
       (r'Momentum and position wave functions are related by', [r'a Fourier transform', r'complex conjugation', r'differentiation', r'nothing'], r'Script 4.7.')], minutes=20))
    C.append(card('qm-read-05a', 6, 'formalism-and-uncertainty', '5.1–5.3', '52–58', 'non-commuting observables and the uncertainty relation',
      ['When can two observables have sharp values at the same time?', 'Where does the $\\frac12|\\langle[A,B]\\rangle|$ come from?'],
      'Look for: common eigenbases of commuting operators, the variance $(\\Delta A)^2=\\langle(A-\\langle A\\rangle)^2\\rangle$, the Cauchy-Schwarz proof, $\\Delta x\\Delta p\\ge\\hbar/2$ and its saturation by Gaussians.',
      [(r'Sketch the proof of $\Delta A\Delta B\ge\frac12|\langle[A,B]\rangle|$.', r'With $\hat A=A-\langle A\rangle$: Cauchy-Schwarz $\|\hat A\psi\|^2\|\hat B\psi\|^2\ge|\langle\hat A\psi|\hat B\psi\rangle|^2\ge(\mathrm{Im}\langle\hat A\hat B\rangle)^2=\frac14|\langle[A,B]\rangle|^2$.'),
       (r'Which states saturate $\Delta x\Delta p=\hbar/2$?', r'Gaussians (with any centre and mean momentum): $\hat p\psi\propto i\hat x\psi$ gives a Gaussian. The oscillator ground state and coherent states are examples.')],
      [(r'$[x,p]=$', [r'$i\hbar$', r'$0$', r'$\hbar$', r'$-i$'], r'Script 5.1.'),
       (r'Commuting observables', [r'have a common eigenbasis', r'never have one', r'always anticommute', r'cannot both be measured'], r'Script 5.1.')], minutes=25))
    # ------------------------------------------------------------ chapter 6
    C.append(card('qm-read-06a', 7, 'harmonic-oscillator-elevator', '6.1', '59–63', 'the oscillator, conventional and elegant',
      ['Why does the oscillator matter far beyond springs?', 'What do $a$ and $a^\\dagger$ do, and why does the ladder stop?'],
      'Look for: the dimensionless equation and Hermite polynomials (6.1.1); $a=\\sqrt{\\frac{m\\omega}{2\\hbar}}(x+\\frac{ip}{m\\omega})$, $[a,a^\\dagger]=1$, $H=\\hbar\\omega(a^\\dagger a+\\frac12)$, $a|0\\rangle=0$ (6.1.2).',
      [(r'Show $[H,a^\dagger]=\hbar\omega a^\dagger$ and conclude.', r'$[a^\dagger a,a^\dagger]=a^\dagger[a,a^\dagger]=a^\dagger$. So $Ha^\dagger|E\rangle=(E+\hbar\omega)a^\dagger|E\rangle$: $a^\dagger$ raises by $\hbar\omega$, $a$ lowers.'),
       (r'Why must there be a state with $a|0\rangle=0$?', r'$\langle H\rangle\ge\frac12\hbar\omega$ since $\langle a^\dagger a\rangle=\|a\psi\|^2\ge0$; lowering cannot go on forever, so the chain ends with $a|0\rangle=0$, giving $E_0=\frac12\hbar\omega$ and the Gaussian $\psi_0$.')],
      [(r'$a^\dagger|n\rangle=$', [r'$\sqrt{n+1}\,|n+1\rangle$', r'$\sqrt n\,|n+1\rangle$', r'$(n+1)|n+1\rangle$', r'$|n+1\rangle$'], r'Script 6.1.2.'),
       (r'$E_n=$', [r'$\hbar\omega(n+\frac12)$', r'$n\hbar\omega$', r'$\hbar\omega n^2$', r'$\frac{\hbar\omega}{n}$'], r'Script 6.1.')], minutes=25))
    C.append(card('qm-read-06b', 7, 'harmonic-oscillator-elevator', '6.2', '64–65', 'the classical limit',
      ['Energy eigenstates do not move. How does a classical swinging oscillator emerge?'],
      'Look for: superpositions of many $|n\\rangle$, coherent states (eigenstates of $a$), $\\langle x\\rangle(t)$ oscillating with $\\omega$, the correspondence for large $n$.',
      [(r'Show that $\langle x\rangle(t)$ of a coherent state $a|\alpha\rangle=\alpha|\alpha\rangle$ oscillates classically.', r'In the Heisenberg picture $a(t)=ae^{-i\omega t}$, so $\langle x\rangle(t)=\sqrt{\frac{2\hbar}{m\omega}}\mathrm{Re}(\alpha e^{-i\omega t})$, with constant width (minimal uncertainty).'),
       (r'Why is $\langle x\rangle=0$ in any $|n\rangle$?', r'$x\propto a+a^\dagger$ changes $n$ by $\pm1$; $\langle n|n\pm1\rangle=0$.')],
      [(r'A coherent state is an eigenstate of', [r'$a$', r'$a^\dagger$', r'$H$', r'$x$'], r'Script 6.2; sheet 7.'),
       (r'In an energy eigenstate, $\langle x\rangle(t)$ is', [r'constant (zero for the oscillator)', r'oscillating', r'growing', r'random'], r'Stationary states.')], minutes=15))
    return C
