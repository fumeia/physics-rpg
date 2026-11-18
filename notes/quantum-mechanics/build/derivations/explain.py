# Plain-language explanation of every line of every derivation (what the line does and why it is allowed), shown under the
# line in the Derivations screen ("Walk me through it"). Executed by build.py; adds d['explain'] (same length as d['lines']).
EXPLAIN = {
 'ho-spectrum': [
  r'Insert the definition of $\hat a$ and its adjoint (the adjoint flips $+i\hat p$ to $-i\hat p$). In the commutator only the mixed terms survive, because $[\hat x,\hat x]=[\hat p,\hat p]=0$; then use $[\hat x,\hat p]=i\hbar$: $-\frac{i}{m\omega}\cdot i\hbar\cdot2=\frac{2\hbar}{m\omega}$.',
  r'Multiply out $(\hat x-\frac{i\hat p}{m\omega})(\hat x+\frac{i\hat p}{m\omega})$ keeping the order of $\hat x$ and $\hat p$. The squares give $\frac{\hat H}{\hbar\omega}$ after the prefactor; the cross terms give $\frac{i}{2\hbar}[\hat x,\hat p]=-\frac12$.',
  r'Rearranging the last line. The two commutators follow from $[\hat a,\hat a^\dagger]=1$: $[\hat a^\dagger\hat a,\hat a]=[\hat a^\dagger,\hat a]\hat a=-\hat a$, and similarly for $\hat a^\dagger$.',
  r'Apply $\hat N$ to $\hat a|\nu\rangle$ and use $\hat N\hat a=\hat a\hat N-\hat a$ (the commutator): you get $\hat a(\nu-1)|\nu\rangle$. So $\hat a$ lowers the eigenvalue by one and $\hat a^\dagger$ raises it.',
  r'Sandwich $\hat N$ in its own eigenstate. $\langle\nu|\hat a^\dagger\hat a|\nu\rangle$ is the squared length of the vector $\hat a|\nu\rangle$, so it cannot be negative.',
  r'Keep lowering: $\nu,\nu-1,\nu-2,\dots$ would eventually go negative, which the previous line forbids. The only escape is that some lowering gives the zero vector, $\hat a|\nu\rangle=0$, which needs $\nu=0$. So the ladder starts at 0 and the eigenvalues are the integers.',
  r'Insert $\nu=n$ into $\hat H=\hbar\omega(\hat N+\frac12)$. The ground state energy $\frac12\hbar\omega$ is not zero: zero-point energy.'],
 'am-spectrum': [
  r'Compute with the commutators: $[J_z,J_x]=i\hbar J_y$ and $[J_z,J_y]=-i\hbar J_x$ combine to $\pm\hbar J_\pm$. $\hat{\mathbf J}^2$ commutes with every component (rotation invariant), hence with $J_\pm$.',
  r'Because $\hat{\mathbf J}^2$ and $J_z$ commute they have common eigenstates. From $J_zJ_\pm=J_\pm(J_z\pm\hbar)$, $J_\pm$ raises or lowers the $J_z$ eigenvalue by $\hbar$; since $J_\pm$ commutes with $\hat{\mathbf J}^2$, $\lambda$ does not change.',
  r'Multiply out $(J_x\mp iJ_y)(J_x\pm iJ_y)=J_x^2+J_y^2\pm i[J_x,J_y]$ and use $J_x^2+J_y^2=\hat{\mathbf J}^2-J_z^2$. The squared length of a vector is never negative, which gives the inequality.',
  r'The inequality allows only finitely many $m$ for fixed $\lambda$, so raising must stop at some top $m=j$ with $J_+|\lambda,j\rangle=0$: then the length formula gives $\lambda=j(j+1)$. The same at the bottom gives $\lambda=j^\prime(j^\prime-1)$; both equalities hold only for $j^\prime=-j$.',
  r'You get from the bottom $-j$ to the top $j$ in whole steps, so $j-(-j)=2j$ is a non-negative integer: integers and half-integers. This is all derived from the commutator, nothing else.'],
 'coherent': [
  r'Every state can be expanded in the oscillator basis. Apply $\hat a$ term by term and compare the coefficient of each $|n\rangle$ on both sides of $\hat a|\alpha\rangle=\alpha|\alpha\rangle$.',
  r'Iterate the recursion: each step multiplies by $\alpha/\sqrt{n}$, which builds $\alpha^n/\sqrt{n!}$.',
  r'Total probability 1. The sum is the exponential series $\sum x^n/n!=e^x$ with $x=|\alpha|^2$.',
  r'$|c_n|^2$ is the probability to find $n$ quanta: exactly the Poisson formula with mean $|\alpha|^2$ (counting statistics of a laser).',
  r'Each $|n\rangle$ evolves with its own phase $e^{-iE_nt/\hbar}$. Pull out $e^{-i\omega t/2}$; the rest turns $\alpha^n$ into $(\alpha e^{-i\omega t})^n$: the same kind of state with a rotating label. Its averages move like a classical oscillator.'],
 'box': [
  r'Inside the well the potential is zero, so the Schrödinger equation is the equation of a free wave. Outside the potential is infinite: the particle cannot be there.',
  r'The wave function cannot jump, and it is zero outside, so it is zero at the wall. Of $\sin kx$ and $\cos kx$ only the sine vanishes at 0.',
  r'The second wall: $\sin ka=0$ requires $ka$ to be a multiple of $\pi$. This condition is where quantisation comes from.',
  r'Insert $k=n\pi/a$ into $E=\hbar^2k^2/2m$. Then fix $A$ so that the total probability is 1 (the average of $\sin^2$ is $\frac12$).'],
 'finite-well': [
  r'Inside, the kinetic energy $E+V_0$ is positive: oscillating solutions. Outside, $E<0$ is below the potential: exponentials, and only the decaying ones are normalisable.',
  r'If $V(-x)=V(x)$, then $\psi(-x)$ is a solution too; for a non-degenerate bound state it must be $\pm\psi(x)$. The even solution inside is the cosine.',
  r'Both $\psi$ and $\psi^\prime$ must be continuous at the edge, so their ratio too: inside $\psi^\prime/\psi=-k\tan(ka/2)$, outside $-\kappa$.',
  r'Introduce dimensionless variables. $k^2+\kappa^2$ does not depend on $E$ (it is $2mV_0/\hbar^2$), which lets you eliminate $\kappa$.',
  r'Draw both sides against $z$: $\tan z$ starts at 0 and rises, the root falls from infinity to zero. Two such curves must cross: there is always a solution, however shallow the well (only in one dimension).'],
 'pt-nondeg': [
  r'If the perturbation is small, energies and states change smoothly with $\lambda$: write them as power series. The choice $\langle n|n^{(1)}\rangle=0$ fixes the normalisation and phase.',
  r'Insert the series into $(\hat H_0+\lambda\hat V)|n(\lambda)\rangle=E_n|n(\lambda)\rangle$ and collect everything multiplying $\lambda^1$.',
  r'$\langle n|(\hat H_0-E_n^{(0)})=0$ because $\langle n|$ is an eigen-bra of $\hat H_0$; what remains is $E_n^{(1)}\langle n|n\rangle-\langle n|\hat V|n\rangle=0$.',
  r'Take $\langle m|$ instead: the left side becomes $(E_m^{(0)}-E_n^{(0)})\langle m|n^{(1)}\rangle$ and the right side $-\langle m|\hat V|n\rangle$ ($\langle m|n\rangle=0$). Divide (allowed only if the energies differ: non-degenerate).',
  r'Collect $\lambda^2$ and project on $\langle n|$ the same way; insert the coefficients of the previous line. Every term is $|\dots|^2$ over an energy difference.'],
 'spin-dot': [
  r'Square the total spin. The two spins act on different particles, so they commute and the cross term is $2\hat{\mathbf S}_1\cdot\hat{\mathbf S}_2$.',
  r'Solve for the dot product. Each spin has $\hat{\mathbf S}_i^2=\hbar^2\frac12\cdot\frac32=\frac34\hbar^2$, so $\frac34+\frac34=\frac32$.',
  r'Addition of angular momenta: two spins $\frac12$ give total spin 1 or 0. The dimensions must add up: $4=3+1$.',
  r'The state with both spins up has the largest $m=1$, so it is the top of $S=1$. Lowering acts on both spins (product rule) and gives the symmetric combination.',
  r'The remaining $m=0$ direction is orthogonal to $|1,0\rangle$; it is killed by $\hat S_+$, so it has $S=0$. Insert $S=0$ into line 1: $\frac{\hbar^2}2(0-\frac32)$.'],
 'virial': [
  r'In an eigenstate, $\langle[\hat H,\hat A]\rangle=E\langle\hat A\rangle-E\langle\hat A\rangle=0$ (let $\hat H$ act left and right). Choosing $\hat A=\hat x\hat p$ is the trick that produces kinetic and potential energy.',
  r'$\hat p^2$ commutes with $\hat p$, so $[\hat p^2,\hat x\hat p]=[\hat p^2,\hat x]\,\hat p$. And $[\hat p^2,\hat x]=\hat p[\hat p,\hat x]+[\hat p,\hat x]\hat p=-2i\hbar\hat p$. Together with the $\frac1{2m}$: $-\frac{i\hbar}m\hat p^2$.',
  r'$V(\hat x)$ commutes with $\hat x$, so $[V,\hat x\hat p]=\hat x[V,\hat p]$. On a test function: $[V,\hat p]\psi=V(-i\hbar\psi^\prime)+i\hbar(V\psi)^\prime=i\hbar V^\prime\psi$.',
  r'Add the two pieces and set the average to zero. Dividing by $i\hbar$ and using $\hat T=\hat p^2/2m$ gives the virial theorem.',
  r'For a power law $V=c|x|^s$, $xV^\prime=sV$. Oscillator $s=2$: equal kinetic and potential energy. Coulomb $s=-1$ (in 3D): $2\langle T\rangle=-\langle V\rangle$.'],
 'heisenberg-ho': [
  r'In the Heisenberg picture the operators carry the time dependence. Differentiate $e^{i\hat Ht/\hbar}\hat Ae^{-i\hat Ht/\hbar}$: the derivative of each exponential brings down $\pm\frac i\hbar\hat H$, giving the commutator.',
  r'Compute both commutators with $[\hat x,\hat p]=i\hbar$: $[\hat p^2,\hat x]=-2i\hbar\hat p$ and $[\hat x^2,\hat p]=2i\hbar\hat x$.',
  r'Insert into the equation of motion: the operators obey exactly Hamilton&#8217;s classical equations for the oscillator.',
  r'Solve like the classical oscillator: $\ddot{\hat x}_H=-\omega^2\hat x_H$ with the initial values $\hat x_H(0)=\hat x$ and $\dot{\hat x}_H(0)=\hat p/m$.',
  r'$[\hat H,\hat a]=\hbar\omega[\hat N,\hat a]=-\hbar\omega\hat a$; the equation $\dot{\hat a}_H=-i\omega\hat a_H$ is solved by a rotating phase.'],
 'cg-1-half': [
  r'Addition rule: $j$ runs from $|l-s|=\frac12$ to $l+s=\frac32$. Check the count: $3\times2=6=4+2$.',
  r'$m=m_l+m_s$; $\frac32$ needs $m_l=1$ and $m_s=\frac12$. Only one state has it, so it must be the top of $j=\frac32$.',
  r'Apply $\hat J_-$ in two ways: on the coupled state with the ladder formula ($\sqrt{j(j+1)-m(m-1)}=\sqrt3$), and on the product state with $\hat L_-+\hat S_-$ acting on each factor ($\sqrt2$ for $l=1$, 1 for spin $\frac12$).',
  r'Divide by $\hbar\sqrt3$. Check: $\frac23+\frac13=1$.',
  r'The $m=\frac12$ space is two-dimensional; one direction belongs to $j=\frac32$, the orthogonal one to $j=\frac12$. Swap the coefficients and flip one sign to get orthogonality.'],
 'delta': [
  r'Away from $x=0$ the potential vanishes, so the solutions are exponentials; a bound state has $E<0$.',
  r'$e^{+\kappa x}$ blows up for $x\to+\infty$ and $e^{-\kappa x}$ for $x\to-\infty$, so each side keeps the decaying one; continuity at 0 makes the two amplitudes equal.',
  r'The $\delta$ function makes $\psi^{\prime\prime}$ infinite at 0, so $\psi^\prime$ jumps. Integrating over a tiny interval: $\int\psi^{\prime\prime}=\psi^\prime(0^+)-\psi^\prime(0^-)$, $\int E\psi\to0$, and $\int\delta\psi=\psi(0)$.',
  r'Slopes of $e^{-\kappa|x|}$: $-\kappa A$ on the right, $+\kappa A$ on the left. Insert into the jump condition and solve for $\kappa$.',
  r'$E$ from $\kappa$; $A$ from $\int|A|^2e^{-2\kappa|x|}dx=|A|^2/\kappa=1$. Exactly one bound state.'],
 'radial': [
  r'The Laplacian in spherical coordinates splits into a radial part and an angular part, and the angular part is $-\hat{\mathbf L}^2/\hbar^2r^2$ (angular momentum is the angular derivative).',
  r'$V(r)$ is rotation invariant, so $\hat H$ commutes with $\hat{\mathbf L}^2$ and $\hat L_z$: common eigenfunctions, the angle part is a spherical harmonic, and $\hat{\mathbf L}^2$ becomes a number.',
  r'Insert and set $R=u/r$: the first-derivative terms cancel and the equation looks like a 1D problem with an extra repulsive centrifugal potential.',
  r'$R=u/r$ finite at the origin needs $u(0)=0$; the normalisation $\int|\psi|^2r^2drd\Omega$ becomes $\int|u|^2dr$.',
  r'$m$ does not appear in the radial equation, so all $2l+1$ values of $m$ have the same energy (rotation symmetry).'],
 'robertson': [
  r'Subtracting numbers does not change commutators; the variance is the average of the squared deviation, which is the squared length of $\hat a\psi$ ($\hat a$ hermitian).',
  r'Cauchy-Schwarz: the overlap of two vectors is at most the product of their lengths. $\langle\hat a\psi|\hat b\psi\rangle=\langle\psi|\hat a\hat b|\psi\rangle$ because $\hat a$ is hermitian.',
  r'A complex number is at least as big as its imaginary part. Since $(\hat a\hat b)^\dagger=\hat b\hat a$, $\langle\hat b\hat a\rangle$ is the conjugate of $\langle\hat a\hat b\rangle$, and $z-\bar z=2i\,\mathrm{Im}z$.',
  r'Combine and take the square root. With $[\hat x,\hat p]=i\hbar$: $\Delta x\Delta p\ge\frac\hbar2$.'],
 'ehrenfest': [
  r'Product rule on $\langle\psi|\hat A|\psi\rangle$; the time derivatives of ket and bra come from the Schrödinger equation and its adjoint and combine to the commutator.',
  r'$\hat x$ commutes with $V(\hat x)$; for $\hat p^2$ use the product rule for commutators, $[AB,C]=A[B,C]+[A,C]B$, with $[\hat p,\hat x]=-i\hbar$.',
  r'Insert into line 0: $\frac i\hbar\cdot(-\frac{i\hbar}m)=\frac1m$.',
  r'$\hat p$ commutes with $\hat p^2$, so only $[V(\hat x),\hat p]$ is left. On a test function $\psi$: $V(-i\hbar\psi^\prime)+i\hbar(V\psi)^\prime=i\hbar V^\prime\psi$.',
  r'Insert into line 0. Together: Newton&#8217;s laws for the averages (exact only if $\langle V^\prime(x)\rangle=V^\prime(\langle x\rangle)$).'],
 'continuity': [
  r'Product rule on $\rho=\psi^*\psi$.',
  r'The Schrödinger equation divided by $i\hbar$ ($\frac1i=-i$), and its complex conjugate (every $i$ becomes $-i$; $V$ is real).',
  r'Multiply the first by $\psi^*$ and the second by $\psi$: the potential terms are equal with opposite signs.',
  r'What is left is a derivative of something: check $\partial_x(\psi^*\psi^\prime-\psi\psi^{*\prime})=\psi^*\psi^{\prime\prime}-\psi\psi^{*\prime\prime}$ (the $\psi^{*\prime}\psi^\prime$ terms cancel).',
  r'$z-\bar z=2i\,\mathrm{Im}z$ with $z=\psi^*\psi^\prime$. Then $\frac{i\hbar}{2m}\cdot2i=-\frac\hbar m$: the continuity equation with the current $j$.'],
 'spin-precession': [
  r'$\hat S_z$ has eigenvalues $\pm\frac\hbar2$ on up and down, so $\hat H=\omega\hat S_z$ has energies $\pm\frac{\hbar\omega}2$.',
  r'The spin along $+x$ is the equal superposition (eigenvector of $\sigma_x$). Each energy eigenstate picks up its phase $e^{-iEt/\hbar}$.',
  r'Multiply by $e^{i\omega t/2}$ (a global phase changes nothing). The relative phase $e^{i\omega t}$ between up and down is the azimuthal angle of the spin direction.',
  r'Compute $\langle\psi|\hat S_x|\psi\rangle$ etc. with the Pauli matrices: the spin direction turns around the $z$ axis (the field) with angular frequency $\omega$ (Larmor precession).'],
 'golden-rule': [
  r'First-order perturbation theory in the interaction picture: the amplitude to be in $|f\rangle$ is the integral of the perturbation matrix element with the phase $e^{i\omega_{fi}t^\prime}$ from the free evolution.',
  r'For constant $\hat V$ the integral is elementary: $\int_0^te^{i\omega t^\prime}dt^\prime=(e^{i\omega t}-1)/(i\omega)$.',
  r'$|e^{i\omega t}-1|^2=4\sin^2(\omega t/2)$.',
  r'The function is a peak at $\omega=0$ of height $t^2$ and width $\sim1/t$; its area is $2\pi t$. For large $t$ it acts like $2\pi t\,\delta(\omega)$, and $\delta(\omega)=\hbar\,\delta(E)$.',
  r'A probability growing linearly in $t$ is a constant rate. Summing over many final states turns the $\delta$ into the density of states $\rho$ at the initial energy.'],
 'variational': [
  r'Any state is a combination of energy eigenstates; $\langle\hat H\rangle$ is the average of the $E_n$ with weights $|c_n|^2$, and an average is never below the smallest value.',
  r'Gaussian integrals: the width of $|\psi_b|^2$ gives $\langle x^2\rangle$; $\langle p^2\rangle=\hbar^2\int|\psi_b^\prime|^2$. Insert into $\langle\hat H\rangle=\frac{\langle p^2\rangle}{2m}+\frac12m\omega^2\langle x^2\rangle$.',
  r'The best bound in the family is at the minimum of $E(b)$: set the derivative to zero.',
  r'Insert $b$: kinetic and potential parts are equal. The Gaussian with this $b$ is the exact ground state, so the bound is reached.'],
}
for d in DERIVS:
    e = EXPLAIN.get(d['id'])
    if e:
        assert len(e) == len(d['lines']), (d['id'], len(e), len(d['lines']))
        d['explain'] = e
