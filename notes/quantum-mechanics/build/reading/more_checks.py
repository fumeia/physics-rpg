"""More check questions for the QM reading cards (4 per card). MORE[id] = [(q, [correct first, ...], explanation)]."""

MORE = {
 'qm-read-01a': [
  (r'Planck&#8217;s hypothesis: an oscillator of frequency $\nu$ exchanges energy in units of', [r'$h\nu$', r'$k_BT$', r'$h/\nu$', r'$\frac12h\nu$'], r'Script 1.1.'),
  (r'Photoeffect: the maximal kinetic energy of the electrons depends on', [r'the frequency of the light (not its intensity)', r'the intensity only', r'the exposure time', r'neither'], r'$E_{\max}=h\nu-W$.'),
  (r'Compton shift for scattering by $90^\circ$', [r'$h/(m_ec)\approx2.4$ pm', r'zero', r'$2h/(m_ec)$', r'$\lambda/2$'], r'$\Delta\lambda=\frac h{m_ec}(1-\cos\theta)$.'),
  (r'Bohr&#8217;s energy levels of hydrogen scale as', [r'$-1/n^2$', r'$n^2$', r'$-1/n$', r'$n$'], r'$E_n=-\frac{me^4}{2\hbar^2n^2}$.')],
 'qm-read-02a': [
  (r'The energy operator in the Schrödinger equation is', [r'$i\hbar\partial_t$', r'$-i\hbar\partial_t$', r'$\hbar\partial_t$', r'$\partial_t^2$'], r'From $e^{-i\omega t}$.'),
  (r'Normalisation means', [r'$\int|\Psi|^2d^3x=1$', r'$\int\Psi\,d^3x=1$', r'$|\Psi|=1$ everywhere', r'$\Psi(0)=1$'], r'Total probability 1.'),
  (r'The Schrödinger equation is first order in time, so', [r'$\Psi(0)$ alone determines $\Psi(t)$', r'you also need $\dot\Psi(0)$', r'it has no solutions', r'it is non-linear'], r'Unlike the wave equation.'),
  (r'A global phase $e^{i\alpha}\Psi$', [r'changes no measurable quantity', r'changes $|\Psi|^2$', r'changes the energy', r'is forbidden'], r'States are rays.')],
 'qm-read-02b': [
  (r'The continuity equation expresses', [r'local conservation of probability', r'energy conservation', r'momentum conservation', r'Pauli exclusion'], r'Script 2.2.'),
  (r'Ehrenfest: $\frac{d}{dt}\langle x\rangle=$', [r'$\langle p\rangle/m$', r'$\langle p\rangle$', r'0', r'$-\langle V^\prime\rangle$'], r'Script 2.3.'),
  (r'For a real stationary $\psi$ the current $j$ is', [r'zero', r'maximal', r'$\hbar/m$', r'undefined'], r'Needs a complex phase.'),
  (r'A hermitian $A$ satisfies', [r'$\langle\phi|A\psi\rangle=\langle A\phi|\psi\rangle$', r'$A^2=1$', r'$A=-A^\dagger$', r'$[A,H]=0$'], r'Script 2.4.')],
 'qm-read-02c': [
  (r'A stationary state has a time dependence', [r'$e^{-iEt/\hbar}$', r'$\cos(Et)$', r'none at all', r'$e^{-Et/\hbar}$'], r'Separation of variables.'),
  (r'Eigenfunctions of $H$ for different energies are', [r'orthogonal', r'equal', r'parallel', r'complex conjugates'], r'Hermiticity.'),
  (r'$\sum_n|c_n|^2=$', [r'1', r'0', r'$\langle H\rangle$', r'$n$'], r'Normalisation.'),
  (r'A measurement of $E$ in $\Psi=\frac1{\sqrt2}(\psi_1+\psi_2)$ gives $E_2$ with probability', [r'$\frac12$', r'1', r'$\frac14$', r'0'], r'$|c_2|^2$.')],
 'qm-read-03a': [
  (r'The box eigenfunctions alternate in parity about the centre:', [r'$n$ odd even, $n$ even odd', r'all even', r'all odd', r'none have parity'], r'$\sin(n\pi x/L)$ about $L/2$.'),
  (r'Halving the box width multiplies $E_1$ by', [r'4', r'2', r'1/2', r'1'], r'$E\propto1/L^2$.'),
  (r'$\langle x\rangle$ in any box eigenstate is', [r'$L/2$', r'0', r'$L$', r'$L/n$'], r'Symmetric $|\psi|^2$.'),
  (r'The infinite well has', [r'only bound states', r'only scattering states', r'both', r'no states'], r'Infinite walls.')],
 'qm-read-03d': [
  (r'A Gaussian packet of width $\Delta x_0$ has momentum spread', [r'$\hbar/(2\Delta x_0)$', r'$\hbar\Delta x_0$', r'0', r'$m/\Delta x_0$'], r'Minimal uncertainty.'),
  (r'The phase velocity of a free matter wave is', [r'half the group velocity', r'equal to the group velocity', r'$c$', r'zero'], r'$\omega=\hbar k^2/2m$.'),
  (r'Plane waves $e^{ikx}$ are', [r'not normalisable', r'normalisable', r'zero', r'bound states'], r'$\int|e^{ikx}|^2=\infty$.'),
  (r'Spreading time scale of a packet of width $\Delta x_0$', [r'$\sim m\Delta x_0^2/\hbar$', r'$\sim\hbar/m$', r'infinite', r'$\sim\Delta x_0/c$'], r'From $\Delta x(t)$.')],
 'qm-read-03b': [
  (r'Outside a finite well the bound-state wave function', [r'decays exponentially', r'oscillates', r'vanishes exactly', r'grows'], r'$E<0$.'),
  (r'Number of bound states of a finite well grows with', [r'$V_0a^2$', r'only $a$', r'only $V_0$ inversely', r'nothing; always one'], r'Radius of the circle $\propto\sqrt{V_0}a$.'),
  (r'At a step with $E<V_0$ the transmission coefficient is', [r'0', r'1', r'1/2', r'$e^{-2\kappa a}$'], r'Infinite barrier width.'),
  (r'In the symmetric well, bound states are', [r'even or odd', r'neither', r'all even', r'complex'], r'$V(-x)=V(x)$, non-degenerate.')],
 'qm-read-03c': [
  (r'Over a well, scattering states with $E>0$ show', [r'transmission resonances', r'total reflection', r'no reflection ever', r'bound states'], r'Script 3.5.2.'),
  (r'Thicker barrier, same height: transmission', [r'drops exponentially', r'drops linearly', r'rises', r'unchanged'], r'$e^{-2\kappa a}$.'),
  (r'$\kappa$ under a barrier', [r'$\sqrt{2m(V_0-E)}/\hbar$', r'$\sqrt{2mE}/\hbar$', r'$V_0/\hbar$', r'$2mV_0$'], r'Decay constant.'),
  (r'$R+T=$', [r'1', r'0', r'2', r'depends on $E$'], r'Current conservation.')],
 'qm-read-04a': [
  (r'Two vectors are orthogonal if', [r'$\langle\phi|\psi\rangle=0$', r'$\|\phi\|=\|\psi\|$', r'$\phi=-\psi$', r'$\langle\phi|\psi\rangle=1$'], r'Inner product.'),
  (r'Cauchy-Schwarz', [r'$|\langle\phi|\psi\rangle|\le\|\phi\|\|\psi\|$', r'$\langle\phi|\psi\rangle\ge\|\phi\|$', r'$\|\phi+\psi\|=\|\phi\|+\|\psi\|$', r'$\langle\phi|\phi\rangle<0$'], r'Used for the uncertainty relation.'),
  (r'A separable Hilbert space has', [r'a countable orthonormal basis', r'no basis', r'a finite basis only', r'only one vector'], r'Script 4.3.'),
  (r'Completeness means', [r'Cauchy sequences converge in the space', r'the space is finite', r'all vectors are normalised', r'there is a zero vector'], r'Script 4.1.')],
 'qm-read-04b': [
  (r'Eigenvectors of a self-adjoint operator to different eigenvalues are', [r'orthogonal', r'equal', r'linearly dependent', r'complex conjugate'], r'Script 4.4.'),
  (r'The probability to find $a$ in $|\psi\rangle$', [r'$\langle\psi|P_a|\psi\rangle$', r'$\langle\psi|A|\psi\rangle$', r'$a^2$', r'$|\psi|$'], r'Projector on the eigenspace.'),
  (r'A projector satisfies', [r'$P^2=P=P^\dagger$', r'$P^2=1$', r'$P=-P^\dagger$', r'$P^2=0$'], r'Script 4.5.'),
  (r'$\langle A\rangle=\langle\psi|A|\psi\rangle$ for a normalised state equals', [r'$\sum_aa\,P(a)$', r'$\max a$', r'$\sum a$', r'$|a|^2$'], r'Average of the outcomes.')],
 'qm-read-04c': [
  (r'The free-particle Hamiltonian has spectrum', [r'$[0,\infty)$', r'$\mathbb R$', r'$\{0\}$', r'discrete'], r'(4.39).'),
  (r'Momentum eigenfunctions in position space', [r'$e^{ipx/\hbar}$ (not normalisable)', r'$\delta(x)$', r'Gaussians', r'$\sin(px)$ normalised'], r'Script 4.6-4.7.'),
  (r'$P_I(A)$ for an interval $I$ is', [r'an orthogonal projector', r'a number', r'unitary', r'zero'], r'Spectral theorem.'),
  (r'In momentum space, $x$ acts as', [r'$i\hbar\partial_p$', r'$-i\hbar\partial_p$', r'$p$', r'multiplication by $x$'], r'Fourier transform.')],
 'qm-read-05a': [
  (r'If $[A,B]=0$, then', [r'both can be sharp in a common eigenstate', r'neither can be sharp', r'$A=B$', r'$\Delta A\Delta B\ge\hbar/2$'], r'Script 5.1.'),
  (r'$(\Delta A)^2=$', [r'$\langle A^2\rangle-\langle A\rangle^2$', r'$\langle A\rangle^2$', r'$\langle A^2\rangle$', r'$\langle A\rangle-\langle A^2\rangle$'], r'Script 5.2.'),
  (r'In an eigenstate of $A$, $\Delta A=$', [r'0', r'$\hbar$', r'$\langle A\rangle$', r'infinite'], r'Sharp value.'),
  (r'Lower bound on $\Delta L_xL_y$-type products comes from', [r'$\frac12|\langle[L_x,L_y]\rangle|=\frac\hbar2|\langle L_z\rangle|$', r'$\hbar/2$ always', r'0 always', r'$\hbar^2$'], r'Robertson; can be zero.')],
 'qm-read-06a': [
  (r'$a|n\rangle=$', [r'$\sqrt n\,|n-1\rangle$', r'$\sqrt{n+1}\,|n-1\rangle$', r'$n|n-1\rangle$', r'$|n+1\rangle$'], r'Script 6.1.2.'),
  (r'The number operator is', [r'$a^\dagger a$', r'$aa^\dagger$', r'$a+a^\dagger$', r'$a^2$'], r'$aa^\dagger=a^\dagger a+1$.'),
  (r'$\psi_0(x)\propto$', [r'$e^{-m\omega x^2/2\hbar}$', r'$e^{-x}$', r'$\sin(kx)$', r'$x$'], r'From $a\psi_0=0$.'),
  (r'The oscillator eigenfunctions in the conventional solution contain', [r'Hermite polynomials', r'Legendre polynomials', r'Bessel functions', r'Laguerre polynomials'], r'Script 6.1.1.')],
 'qm-read-06b': [
  (r'A coherent state has', [r'minimal uncertainty that stays constant in time', r'growing uncertainty', r'a sharp energy', r'zero $\langle x\rangle$'], r'Script 6.2.'),
  (r'$\langle x\rangle(t)$ in a coherent state oscillates with', [r'$\omega$', r'$2\omega$', r'$\omega/2$', r'it does not'], r'Classical motion.'),
  (r'The photon number distribution of a coherent state is', [r'Poisson', r'Gaussian always', r'uniform', r'a single $n$'], r'$|\langle n|\alpha\rangle|^2=e^{-|\alpha|^2}|\alpha|^{2n}/n!$.'),
  (r'For large $n$, the probability density $|\psi_n|^2$ approaches', [r'the classical time-averaged density (peaked at the turning points)', r'a Gaussian at 0', r'uniform', r'zero'], r'Correspondence.')],
 'qm-read-07a': [
  (r'Rotations about different axes', [r'do not commute', r'commute', r'are not a group', r'are unitary in $\mathbb R^3$ only for small angles'], r'Non-abelian SO(3).'),
  (r'The Lie algebra so(3) is spanned by', [r'three generators', r'one generator', r'nine generators', r'no generators'], r'Three axes.'),
  (r'$U(R(\vec e,\omega))=$', [r'$e^{-i\omega\vec e\cdot\vec L/\hbar}$', r'$e^{\omega\vec e\cdot\vec L}$', r'$\vec e\cdot\vec L$', r'$1+\omega$'], r'Script 7.2.'),
  (r'An observable commutes with all $L_j$ iff it is', [r'rotationally invariant', r'zero', r'a vector operator', r'the parity'], r'Symmetry $\Leftrightarrow$ commutation.')],
 'qm-read-07b': [
  (r'Allowed values of $j$', [r'$0,\frac12,1,\frac32,\dots$', r'only integers', r'any real number', r'only $\frac12$'], r'$2j\in\mathbb N$.'),
  (r'$\vec M^2$ on $\mathcal D_j$', [r'is $j(j+1)\mathbb 1$', r'depends on $m$', r'is zero', r'is $j^2$'], r'Casimir.'),
  (r'An invariant subspace $K$ of a unitary representation has', [r'an invariant orthogonal complement', r'no complement', r'dimension 1', r'to be the whole space'], r'Complete reducibility.'),
  (r'$M_+$ on the top state $|j,j\rangle$', [r'gives 0', r'gives $|j,j+1\rangle$', r'gives $|j,j\rangle$', r'is undefined'], r'Ladder stops.')],
 'qm-read-07c': [
  (r'$\det\tilde x$ for $\tilde x=x^j\sigma_j$', [r'$-\vec x\cdot\vec x$', r'$\vec x\cdot\vec x$', r'0', r'1'], r'Script 7.5.'),
  (r'Spin $\frac12$ returns to itself after a rotation by', [r'$4\pi$', r'$2\pi$', r'$\pi$', r'never'], r'$2\pi$ gives $-1$.'),
  (r'The cocycle condition follows from', [r'associativity of operator products', r'unitarity', r'hermiticity', r'commutativity'], r'Script 7.6.'),
  (r'The electron&#8217;s state space is', [r'$L^2(\mathbb R^3)\otimes\mathbb C^2$', r'$L^2(\mathbb R^3)$', r'$\mathbb C^2$', r'$\mathbb C^3$'], r'Script 7.7.')],
 'qm-read-07d': [
  (r'Wigner&#8217;s theorem assumes the symmetry preserves', [r'transition probabilities between rays', r'energies only', r'positions', r'the Hamiltonian'], r'Script 7.8.'),
  (r'An anti-unitary operator is', [r'anti-linear', r'linear', r'hermitian', r'a projector'], r'$U(\alpha\psi)=\bar\alpha U\psi$.'),
  (r'The square of an anti-unitary operator is', [r'unitary (linear)', r'anti-unitary', r'zero', r'hermitian'], r'Two conjugations cancel.'),
  (r'Why can time reversal not give a conservation law?', [r'it is anti-unitary: no hermitian generator', r'it is not a symmetry', r'it is unitary', r'it commutes with nothing'], r'No $e^{-i\theta T}$.')],
 'qm-read-08a': [
  (r'The reduced mass is', [r'$\frac{m_1m_2}{m_1+m_2}$', r'$m_1+m_2$', r'$\sqrt{m_1m_2}$', r'$m_1-m_2$'], r'Script 8.1.'),
  (r'Degeneracy of the hydrogen level $n$ (without spin)', [r'$n^2$', r'$2n+1$', r'$n$', r'$2n^2$'], r'$\sum(2l+1)$.'),
  (r'For $l\ge1$ the radial function $u(r)$ near 0 behaves as', [r'$r^{l+1}$', r'$r^{-l}$', r'constant', r'$e^{-r}$'], r'Script 8.2.1.'),
  (r'The centrifugal barrier', [r'$\frac{\hbar^2l(l+1)}{2mr^2}$', r'$\frac{l}{r}$', r'$-\frac{e^2}r$', r'$\hbar^2l^2r^2$'], r'Effective potential.')],
 'qm-read-08b': [
  (r'The Pauli-Lenz vector commutes with', [r'$H$', r'$\vec L$ componentwise', r'$\vec x$', r'nothing'], r'Conserved.'),
  (r'On fixed $E<0$, $\vec S$ and $\vec D$ generate', [r'two commuting su(2)', r'one su(2)', r'su(3)', r'nothing'], r'so(4) = su(2) $\oplus$ su(2).'),
  (r'The highest weight of the level $n$ is', [r'$|n,n-1,n-1\rangle$', r'$|n,0,0\rangle$', r'$|n,n,n\rangle$', r'$|1,0,0\rangle$'], r'Sheet 11 Q1.'),
  (r'The $l$-degeneracy of hydrogen is lifted by', [r'perturbations that break the so(4) (e.g. relativistic $p^4$)', r'rotations', r'parity', r'nothing ever'], r'FS26 Q4.')],
 'qm-read-09a': [
  (r'The total generator on $\mathcal H_1\otimes\mathcal H_2$', [r'$\vec J^{(1)}\otimes\mathbb 1+\mathbb 1\otimes\vec J^{(2)}$', r'$\vec J^{(1)}\otimes\vec J^{(2)}$', r'$\vec J^{(1)}\vec J^{(2)}$', r'$\vec J^{(1)}-\vec J^{(2)}$'], r'Script 9.1-9.2.'),
  (r'Two spins $\frac12$: $\vec S_1\cdot\vec S_2$ on the triplet', [r'$\frac{\hbar^2}4$', r'$-\frac34\hbar^2$', r'0', r'$\hbar^2$'], r'$\frac12(2-\frac32)\hbar^2$.'),
  (r'$m$ of a product state $|m_1\rangle|m_2\rangle$', [r'$m_1+m_2$', r'$m_1m_2$', r'$|m_1-m_2|$', r'$\max(m_1,m_2)$'], r'$J_3$ additive.'),
  (r'Dimension of $\mathcal D_{j_1}\otimes\mathcal D_{j_2}$', [r'$(2j_1+1)(2j_2+1)$', r'$2(j_1+j_2)+1$', r'$j_1j_2$', r'$2j_1+2j_2$'], r'Product of dimensions.')],
 'qm-read-09b': [
  (r'Largest total $j$ in $\mathcal D_{j_1}\otimes\mathcal D_{j_2}$', [r'$j_1+j_2$', r'$|j_1-j_2|$', r'$j_1j_2$', r'$\max(j_1,j_2)$'], r'Top state.'),
  (r'The top state of $j_1+j_2$ is', [r'$|j_1\rangle|j_2\rangle$ (both maximal)', r'an entangled sum', r'$|-j_1\rangle|j_2\rangle$', r'the singlet'], r'Highest weight.'),
  (r'Clebsch-Gordan coefficients form', [r'a unitary change of basis', r'a projector', r'a scalar', r'a non-invertible matrix'], r'Both bases orthonormal.'),
  (r'How many times does $\mathcal D_1$ appear in $\mathcal D_1\otimes\mathcal D_1$?', [r'once', r'twice', r'never', r'three times'], r'$2\oplus1\oplus0$.')],
 'qm-read-09c': [
  (r'The orbital magnetic moment of the electron (Gaussian)', [r'$-\frac e{2mc}\vec L$', r'$\frac e{2mc}\vec L$', r'$-\frac e{mc}\vec S$ only', r'0'], r'$q=-e$ in (9.46).'),
  (r'$g$ of the electron spin', [r'$\approx2$ ($2+\alpha/\pi+\dots$)', r'1', r'5.59', r'0'], r'(9.53).'),
  (r'The normal Zeeman shift (9.50)', [r'$\mu_BB_zm$', r'$\mu_BB_zl$', r'$2\mu_BB_zm_s$ only', r'$\mu_B^2B$'], r'Orbital only.'),
  (r'$\vec L\cdot\vec S$ commutes with', [r'$\vec J^2$ and $J_z$', r'$L_z$ and $S_z$ separately', r'nothing', r'$x$'], r'Use the coupled basis.')],
 'qm-read-10a': [
  (r'Local hidden variables imply the CHSH combination is bounded by', [r'2', r'$2\sqrt2$', r'1', r'4'], r'(10.4).'),
  (r'Quantum mechanics can reach', [r'$2\sqrt2$', r'only 2', r'4', r'0'], r'Violation.'),
  (r'For the singlet, $\langle\psi|\vec\sigma^{(1)}\cdot\vec v|\psi\rangle=$', [r'0', r'1', r'$|\vec v|$', r'$-1$'], r'(10.10).'),
  (r'Locality in (10.3) means', [r'space-like separated measurements factorise on hidden variables', r'particles never interact', r'the state is a product', r'measurements are instantaneous'], r'$(AB)(\omega)=A(\omega)B(\omega)$.')],
 'qm-read-10b': [
  (r'Alice&#8217;s measurement in teleportation is a measurement in', [r'the Bell basis of particles 0 and 1', r'the $z$ basis of particle 2', r'position', r'energy'], r'(10.15).'),
  (r'Each of Alice&#8217;s four outcomes occurs with probability', [r'$\frac14$', r'$\frac12$', r'1', r'depends on $|\varphi\rangle$'], r'Independent of the state.'),
  (r'For outcome 1 Bob applies', [r'nothing ($\mathbb 1$)', r'$\sigma_1$', r'$\sigma_2$', r'$\sigma_3$'], r'Table in 10.3.'),
  (r'Teleportation was realised experimentally with', [r'photons (Zeilinger et al. 1997)', r'electrons in 1920', r'neutrons only', r'never'], r'Script 10.3.')],
 'qm-read-11a': [
  (r'The usual normalisation convention for corrections', [r'$\langle\psi_n|\psi^{(s)}\rangle=0$ for $s\ge1$', r'$\psi^{(1)}=\psi_n$', r'$\|\psi^{(1)}\|=1$', r'none'], r'Fixes the phase/normalisation.'),
  (r'$\psi^{(1)}$ is a sum over', [r'other states $m\ne n$ weighted by $\frac{\langle m|H^\prime|n\rangle}{E_n-E_m}$', r'only $\psi_n$', r'continuum states only', r'nothing'], r'Script 11.1.'),
  (r'Second-order energy uses', [r'squared matrix elements over energy differences', r'only diagonal elements', r'the exact energies', r'the commutator'], r'$E^{(2)}=\sum\frac{|H^\prime_{mn}|^2}{E_n-E_m}$.'),
  (r'Two-level system: exact vs PT', [r'PT is the expansion of the square root for small coupling', r'PT is exact', r'they disagree at first order', r'there is no exact solution'], r'$\frac12\sqrt{\Delta^2+4V^2}$.')],
 'qm-read-11b': [
  (r'Within a degenerate level, the &#8220;good&#8221; basis', [r'diagonalises $H^\prime$ in that subspace', r'is arbitrary', r'is the position basis', r'diagonalises $H_0$ only'], r'Script 11.2.'),
  (r'A symmetry $A$ with $[H^\prime,A]=0$ helps because', [r'$H^\prime$ has no matrix elements between different eigenvalues of $A$', r'it makes $H^\prime=0$', r'it removes the degeneracy of $H_0$', r'it does not'], r'Selection rules.'),
  (r'Linear Stark effect of $n=2$: levels shift by', [r'$\pm3|e|Ea$ and two stay', r'all by $3eEa$', r'quadratically', r'not at all'], r'Script 11.2.4.'),
  (r'The perturbation $-eEz$ connects', [r'$l$ and $l\pm1$ with the same $m$', r'equal $l$', r'different $m$', r'nothing'], r'Parity odd, $[L_z,z]=0$.')],
 'qm-read-11c': [
  (r'In the Heisenberg picture', [r'operators evolve, states are fixed', r'states evolve, operators fixed', r'both fixed', r'both evolve under $H^\prime$ only'], r'Script 11.3.2.'),
  (r'The first-order transition amplitude contains', [r'$e^{i\omega_{if}t^\prime}\langle f|H^\prime(t^\prime)|i\rangle$', r'$E_f-E_i$ only', r'$|V|^2$', r'the propagator of $H^\prime$'], r'(11.97).'),
  (r'The energy-conservation window after time $t$ has width', [r'$\Delta\omega_{if}\sim2\pi/t$', r'zero', r'$\hbar t$', r'$t/2\pi$'], r'(11.101).'),
  (r'The golden rule needs', [r'a dense set of final states', r'a single final state', r'strong coupling', r'$t\to0$'], r'Script 11.3.4, Abb. 23.')],
}
