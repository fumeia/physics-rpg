"""Plain-words explanations of the reference steps of the QM sheets: EXPLAIN[(sheet, question)] = [html per part].
Shown under each revealed step as "Explain this step": the *why* (where a step comes from, what each symbol means, the algebra
in between). Notation as in Prof. Gaberdiel's sheets (on some sheets k denotes the momentum, as in e^{ikx/hbar})."""
EXPLAIN = {}

# ---------------------------------------------------------------- sheet 1
EXPLAIN[(1, 1)] = [
    r"""<p><b>Why the field is just $\cos\omega t$.</b> The electron moves very little compared with the wavelength, so in $\cos(kx-\omega t)$
    we can set $x\approx0$: the electron feels a uniform field oscillating in time. Then $\ddot{\vec x}=-\frac{eE_0}{m}\vec\varepsilon\cos\omega t$;
    integrate twice with $\vec x(0)=\dot{\vec x}(0)=0$.</p>
    <p><b>The physics:</b> a charge shaken at $\omega$ radiates at $\omega$. Classical light is re-emitted at the same colour, whatever the angle.</p>""",
    r"""<p><b>Strategy:</b> two conservation laws (energy, momentum), and we do not care about the electron afterwards, so eliminate it.
    Momentum: $\vec p=\vec p_1-\vec p_2$, square it (law of cosines): $p^2=p_1^2+p_2^2-2p_1p_2\cos\theta$. Energy:
    $cp_1+mc^2=cp_2+\sqrt{m^2c^4+p^2c^2}$; isolate the root and square: $(p_1-p_2+mc)^2=m^2c^2+p^2$.</p>
    <p><b>Combine:</b> expanding the left side, $p_1^2$, $p_2^2$ and $m^2c^2$ cancel against the right side, leaving
    $2mc(p_1-p_2)=2p_1p_2(1-\cos\theta)$. Divide by $p_1p_2\,mc$: $\frac1{p_2}-\frac1{p_1}=\frac{1-\cos\theta}{mc}$, and $\lambda=h/p$ turns this
    into the shift.</p>""",
    r"""<p><b>Compare scales.</b> The shift is at most $2\lambda_C\approx5\times10^{-12}$ m whatever the light. Relative to visible light
    ($\sim5\times10^{-7}$ m) that is $10^{-5}$: invisible, and the photon picture reduces to the classical one. Only when $\lambda$ is itself
    of order picometres (X-rays, gamma rays) is the change noticeable.</p>""",
]
EXPLAIN[(1, 2)] = [
    r"""<p>Insert de Broglie $\lambda=h/(mv_n)$ and divide by $r_n$: the denominator is $mv_nr_n$, which Bohr's rule sets to $n\hbar$. With $h=2\pi\hbar$:
    $\lambda=2\pi r_n/n$, i.e. the circumference holds exactly $n$ wavelengths. Bohr's mysterious rule is a standing-wave condition.</p>""",
    r"""<p>From $mv_nr_n=n\hbar$: $v_n=n\hbar/(mr_n)$; insert $r_n$: $v_n=e^2/(n\hbar)$. The largest is $n=1$, and $e^2/\hbar=\alpha c$ with
    $\alpha\approx1/137$: under 1% of the speed of light, so non-relativistic QM is fine for hydrogen.</p>""",
    r"""<p>The shortest emitted wavelength belongs to the largest energy jump, $n=\infty\to1$, i.e. $13.6$ eV: $\lambda=hc/13.6\,\mathrm{eV}\approx91$ nm.
    That is a thousand times the atom's size. So the light's field is practically uniform across the atom; this is why the dipole
    approximation works.</p>""",
]
EXPLAIN[(1, 3)] = [
    r"""<p><b>What is being checked:</b> moving with velocity $u$ (a Galilean boost) must map solutions to solutions. Physically a boosted
    particle is shifted by $ut$ and has extra momentum $mu$; the phase $e^{imux/\hbar}$ supplies that momentum.</p>
    <p><b>The time derivative</b> hits three places: $\Psi$ through its first argument $x-ut$ (gives $-u\partial_x\Psi$), through its second
    argument $t$, and the phase (gives $-\frac{imu^2}{2\hbar}$). Multiply by $i\hbar$.</p>""",
    r"""<p><b>Two $x$-derivatives</b> of a product (product rule twice): $\partial_x^2\Psi$, a cross term $2\cdot\frac{imu}{\hbar}\partial_x\Psi$ and
    $\left(\frac{imu}{\hbar}\right)^2\Psi$. Multiplying by $-\frac{\hbar^2}{2m}$ gives exactly the same three terms as the time side; the
    $\partial_x^2\Psi$ and $i\hbar\partial_t\Psi$ terms match because $\Psi$ itself solves the equation.</p>""",
]
# ---------------------------------------------------------------- sheet 2
EXPLAIN[(2, 1)] = [
    r"""<p><b>Where it comes from.</b> $\frac{d}{dt}\langle x\rangle=\int x\,\partial_t|\Psi|^2dx$, and the Schrödinger equation turns $\partial_t|\Psi|^2$
    into $-\partial_xj$ (probability flows). One integration by parts moves the derivative off the current onto $x$ ($\partial_xx=1$);
    the boundary terms vanish for a normalisable $\Psi$. What remains, $\int j\,dx$, is $\langle p\rangle/m$.</p>""",
    r"""<p><b>Differentiate again:</b> $\frac{d}{dt}\langle p\rangle$ with $\partial_t\Psi=\frac{1}{i\hbar}H\Psi$. The kinetic part of $H$ gives terms like
    $\Psi''^*\Psi'$, which integrate to zero by parts (they are total derivatives). The potential part gives
    $\int(\Psi^*V\Psi'+\Psi'^*V\Psi)=\int V\,\partial_x|\Psi|^2$; by parts this is $-\int V'|\Psi|^2$.</p>""",
    r"""<p><b>Reading the result:</b> mass times the acceleration of the <i>centre</i> of the wave packet equals the <i>average</i> force. It is
    Newton's law for $\langle x\rangle$ only if $\langle V'(x)\rangle=V'(\langle x\rangle)$, which holds when $V'$ is linear, i.e. for free particles,
    constant forces and the harmonic oscillator.</p>""",
]
EXPLAIN[(2, 2)] = [
    r"""<p><b>Take the complex conjugate</b> of $\langle H\rangle=\int\Psi^*H\Psi$: $\Psi^*\leftrightarrow\Psi$ swap, and $V$ is real so $\langle V\rangle$ is
    unchanged. Only the kinetic term could differ: $\int\Psi^*\Psi''$ versus $\int\Psi^{*\prime\prime}\Psi$.</p>""",
    r"""<p><b>Integrate by parts once in each:</b> both become $-\int\Psi^{*\prime}\Psi'$ (boundary terms vanish because $\Psi\to0$). Equal, so the
    difference is zero and $\langle H\rangle$ is real. This is the statement "$H$ is hermitian", and it is why energies are real.</p>""",
]
EXPLAIN[(2, 3)] = [
    r"""<p>Here $k$ is a momentum (it is divided by $\hbar$). Check one plane wave: $\partial_x^2$ brings down $-k^2/\hbar^2$, so
    $-\frac{\hbar^2}{2m}\partial_x^2\to\frac{k^2}{2m}$; $i\hbar\partial_t$ brings down $E_k$. Equal by definition of $E_k$. Both waves have the same $E_k$
    (it depends on $k^2$), so their sum, with one common time factor, still solves the linear equation.</p>""",
    r"""<p><b>Insert into $j$:</b> $\partial_x\Psi$ multiplies $A$ by $\frac{ik}\hbar$ and $B$ by $-\frac{ik}\hbar$. In $\Psi^*\partial_x\Psi-\Psi\partial_x\Psi^*$ the mixed
    terms $AB^*$ and $A^*B$ appear twice with opposite signs and cancel; the pure terms give $\frac{2ik}{\hbar}(|A|^2-|B|^2)$. So the current is
    (velocity $k/m$) × (right-moving density minus left-moving density).</p>""",
]
# ---------------------------------------------------------------- sheet 3
EXPLAIN[(3, 1)] = [
    r"""<p>Use the Gaussian integral $\int e^{-\lambda x^2}dx=\sqrt{\pi/\lambda}$ (worth knowing by heart). Setting $|A|^2\sqrt{\pi/\lambda}=1$ fixes $|A|$;
    the phase of $A$ is free because it is unobservable.</p>""",
    r"""<p><b>Run the Schrödinger equation backwards:</b> differentiate $\Psi$ twice, $\Psi''=(\lambda^2x^2-\lambda)\Psi$, insert into
    $-\frac{\hbar^2}{2m}\Psi''+V\Psi=E\Psi$ and divide by $\Psi$. The $x^2$ part must be $V$, the constant part $E$ (with $V(0)=0$). A Gaussian is the
    ground state of a parabola, with $\lambda=m\omega/\hbar$.</p>""",
    r"""<p><b>Symmetry</b> gives $\langle x\rangle=0$ (even $|\Psi|^2$ times odd $x$) and $\langle p\rangle=0$ (real $\Psi$).</p>
    <p><b>The trick for $\langle x^2\rangle$:</b> $\int x^2e^{-\lambda x^2}dx=-\frac{d}{d\lambda}\int e^{-\lambda x^2}dx$, which gives $\frac{1}{2\lambda}$ after
    normalising. <b>$\langle p^2\rangle$</b>$=\hbar^2\int|\Psi'|^2dx=\hbar^2\lambda^2\langle x^2\rangle$. The product $\frac{\hbar}{2}$ is the smallest Heisenberg allows:
    Gaussians are the minimum-uncertainty states.</p>""",
    r"""<p>$\Delta x=1/\sqrt{2\lambda}$ shrinks as $\lambda$ grows, but $\Delta p\propto\sqrt\lambda$ and $E\propto\lambda$ grow. Squeezing a particle into a point
    needs an infinitely steep trap and infinite energy: localisation always costs kinetic energy.</p>""",
]
EXPLAIN[(3, 2)] = [
    r"""<p><b>Measurement rule:</b> expand the state in energy eigenstates; the probability of $E_n$ is $|c_n|^2$ with $c_n=\langle\psi_n|\Psi\rangle$. The
    integral of $\sin\frac{n\pi x}{a}$ over the box is $\frac{a}{n\pi}(1-\cos n\pi)=\frac{a}{n\pi}(1-(-1)^n)$: zero for even $n$ (the sine is
    antisymmetric about the middle, the constant state symmetric).</p>""",
    r"""<p><b>Probabilities sum to 1.</b> $\sum_{n\ \rm odd}\frac{8}{n^2\pi^2}=1$ gives the odd sum. For all $n$: split $\zeta(2)$ into even terms
    $\sum\frac1{(2m)^2}=\frac14\zeta(2)$ and odd terms $\frac{\pi^2}8$, and solve. Physics producing a famous maths identity.</p>""",
]
EXPLAIN[(3, 3)] = [
    r"""<p>$|\psi_n|^2=\frac2a\sin^2\frac{n\pi x}a=\frac1a\left(1-\cos\frac{2n\pi x}a\right)$ (double-angle formula). The constant part alone gives $a/2$; the
    cosine part integrates to zero against $x$ (by parts, or by symmetry about $a/2$). The probability density is symmetric about the
    middle, so the mean is the middle.</p>""",
    r"""<p>$\langle x^2\rangle$: the constant part gives $a^2/3$; the cosine part needs two integrations by parts and gives $-\frac{a^2}{2\pi^2n^2}$.
    Then $(\Delta x)^2=\langle x^2\rangle-\langle x\rangle^2$.</p>""",
    r"""<p><b>Classical comparison:</b> a ball bouncing between walls spends equal time everywhere, so its position is uniformly distributed:
    mean $a/2$, variance $a^2/12$ (the variance of a uniform distribution). The quantum correction $\propto1/n^2$ disappears for highly excited
    states: correspondence principle.</p>""",
]
EXPLAIN[(3, 4)] = [
    r"""<p><b>Sudden change:</b> the wave function has no time to change, only the Hamiltonian does. So expand the <i>old</i> state in the
    eigenfunctions of the <i>new</i> box ($\frac1{\sqrt a}\sin\frac{n\pi x}{2a}$ on $[0,2a]$), integrating only over $[0,a]$ where the old state lives.</p>
    <p><b>The integral:</b> $\sin A\sin B=\frac12[\cos(A-B)-\cos(A+B)]$ turns it into cosine integrals. For $n=2$ the two sines are the same function:
    $c_2=\frac{\sqrt2}{a}\cdot\frac a2$. For even $n>2$ both terms contain $\sin(\text{integer}\cdot\pi)=0$.</p>""",
    r"""<p>Each new eigenstate evolves with its own phase $e^{-iE_nt/\hbar}$. The new $n=2$ level has $E_2=\frac{4\pi^2\hbar^2}{8ma^2}$, exactly the old ground
    energy (twice the box, twice the wavelength fits as the second harmonic). So "energy unchanged" means "found in $n=2$", probability
    $|c_2|^2=\frac12$.</p>""",
    r"""<p><b>Classically</b> nothing touches the particle when the wall jumps away, so its energy cannot change. Quantum mechanically the
    <i>average</i> energy is unchanged too (same state, and $H$ inside $[0,a]$ is the same), but a single measurement can give other levels.</p>""",
]
# ---------------------------------------------------------------- sheet 4
EXPLAIN[(4, 1)] = [
    r"""<p><b>Why integrate across the delta.</b> At $x=0$ the potential is infinite, so $\psi''$ has a delta there too, i.e. $\psi'$ jumps. Integrate the
    Schrödinger equation from $-\epsilon$ to $\epsilon$: $\int\psi''=\psi'(0^+)-\psi'(0^-)$, $\int E\psi\to0$, $\int V\delta\psi=V\psi(0)$. $\psi$ itself stays
    continuous (a jump in $\psi$ would need a $\delta'$).</p>""",
    r"""<p><b>Two conditions, two unknowns.</b> Continuity: $1+R=T$. Jump: with $\psi'=\frac{ik}\hbar(\dots)$ on both sides,
    $\frac{\hbar^2}{2m}\frac{ik}{\hbar}(T-1+R)=VT$. Insert $T=1+R$ and solve for $R$; then $T=1+R$.</p>""",
    r"""<p>$|R|^2=\frac{m^2V^2}{\hbar^2k^2+m^2V^2}$, $|T|^2=\frac{\hbar^2k^2}{\hbar^2k^2+m^2V^2}$: they add to 1 (particles are neither created nor lost, sheet 4 Q3).
    Fast particles ($k$ large) barely notice the spike. $V$ enters only as $V^2$: a delta wall and a delta well reflect equally.</p>""",
]
EXPLAIN[(4, 2)] = [
    r"""<p><b>Ground state is even</b> (no node), so inside take $\cos kx$ and outside the decaying exponential. Match $\psi$ and $\psi'$ at
    $x=a$ (the other side follows by symmetry).</p>""",
    r"""<p><b>The limit.</b> Divide the two matching equations: $\kappa=k\tan ka$. As $V_0\to\infty$ with $V_0a$ fixed, $k\approx\sqrt{2mV_0}/\hbar$ grows
    like $\sqrt{V_0}$ but $a$ shrinks like $1/V_0$, so $ka\to0$ and $\tan ka\approx ka$: $\kappa=k^2a=\frac{2mV_0a}{\hbar^2}$, finite. The
    energy $-\hbar^2\kappa^2/2m$ is finite and negative.</p>""",
    r"""<p><b>Why this is a delta.</b> A deep narrow well with fixed area $\int V\,dx=-2V_0a$ is what a delta function is. Using the jump
    condition of Q1 with strength $-2V_0a$ gives the same $\kappa$ in one line. One bound state, as for every attractive delta.</p>""",
]
EXPLAIN[(4, 3)] = [
    r"""<p><b>Continuity equation:</b> $\partial_t|\psi|^2+\partial_xj=0$. A stationary state has $|\psi|^2$ independent of time, so $\partial_xj=0$: the
    current is the same everywhere. Evaluate it far left (incoming minus reflected, sheet 2 Q3) and far right (transmitted) and set them
    equal: reflection plus transmission probability is 1.</p>""",
    r"""<p><b>Kinetic energy is positive:</b> $\langle T\rangle=-\frac{\hbar^2}{2m}\int\psi^*\psi''$, and one integration by parts gives $\frac{\hbar^2}{2m}\int|\psi'|^2\ge0$;
    zero only for a constant, which is not normalisable. Since $\langle V\rangle\ge V_{\min}$, every state, the ground state included, has energy
    strictly above the bottom of the well: the particle can never just sit at the minimum.</p>""",
]
EXPLAIN[(4, 4)] = [
    r"""<p><b>Why $\chi=r\psi$.</b> For a spherically symmetric $\psi(r)$, $\nabla^2\psi=\frac1r\frac{d^2}{dr^2}(r\psi)$. So with $\chi=r\psi$ the 3D equation
    becomes the 1D Schrödinger equation for $\chi$ on $r>0$. And $\psi$ must stay finite at the origin, so $\chi(0)=0$: like a 1D well with a
    hard wall at the centre, i.e. only the odd 1D solutions survive.</p>""",
    r"""<p>Inside: $\chi=\sin kr$ (vanishes at 0). Outside: $e^{-\kappa r}$. Matching $\chi'/\chi$ at $r=a$: $k\cot ka=-\kappa$. In dimensionless form
    $\eta=-\xi\cot\xi$, and $\xi^2+\eta^2$ is fixed by the depth ($k^2+\kappa^2=2mV/\hbar^2$): a circle in the $(\xi,\eta)$ plane.</p>""",
    r"""<p><b>Graphical solution:</b> we need $\eta>0$, but $-\xi\cot\xi$ is negative until $\xi=\pi/2$. So the circle must have radius $>\pi/2$:
    a minimum depth. In 1D an even ground state exists for any depth; in 3D the wall at $r=0$ (the odd condition) removes it. The deuteron
    is just above this threshold, so it has a single, weakly bound state.</p>""",
]
# ---------------------------------------------------------------- sheet 5
EXPLAIN[(5, 1)] = [
    r"""<p><b>Idea of transfer matrices:</b> in each region with constant $V$ the solution is $Ae^{ikx}+Be^{-ikx}$, i.e. just two numbers. At a step,
    continuity of $\psi$ and $\psi'$ gives two linear equations linking the left pair $(A_L,B_L)$ to the right pair $(A_R,B_R)$: a $2\times2$ matrix.
    Add and subtract the two equations to solve for $A_L$ and $B_L$.</p>""",
    r"""<p><b>Propagation:</b> moving the reference point by $\ell$ multiplies $e^{\pm ikx}$ by $e^{\pm ik\ell}$: a diagonal matrix. Any potential built
    from steps is then a product of step and propagation matrices, read from right to left, like optics with lenses.</p>""",
    r"""<p><b>Resonance:</b> if $q\ell$ is a multiple of $2\pi$, the wave inside comes out with the same phase it went in, $N=I$, and the two step
    matrices cancel ($M^{-1}M=I$): the well becomes invisible, transmission is perfect. Same physics as a Fabry–Pérot interferometer or the
    Ramsauer effect.</p>""",
    r"""<p><b>Below the barrier</b> the inside wave number is imaginary, $q=i\kappa$, and $e^{\pm iq x}$ become growing and decaying exponentials;
    cosh and sinh appear instead of cos and sin. Square $|A_R|$ to get $T$. For a thick barrier $\sinh\kappa\ell\approx\frac12e^{\kappa\ell}$, so
    $T\propto e^{-2\kappa\ell}$: tunnelling.</p>""",
]
EXPLAIN[(5, 2)] = [
    r"""<p><b>Every probability formula is homogeneous:</b> numerator and denominator both contain $|\mu|^2$. So $\mu|\Psi\rangle$ predicts exactly the same
    as $|\Psi\rangle$: a physical state is a whole line (ray) of vectors, not one vector.</p>""",
    r"""<p><b>Choosing a representative:</b> if $a\ne0$, divide by $a$: every ray with $a\ne0$ contains exactly one vector of the form $|1\rangle+z|2\rangle$, and
    $z=b/a$ labels it uniquely. The only ray missed has $a=0$: $|2\rangle$, reached as $z\to\infty$.</p>""",
    r"""<p>The complex plane plus one point at infinity is a sphere (stereographic projection). So the states of any two-level system form a
    sphere: the Bloch sphere, with $|1\rangle$ and $|2\rangle$ at the poles.</p>""",
]
EXPLAIN[(5, 3)] = [
    r"""<p><b>Adjoint of a product:</b> move operators to the other side of the scalar product one by one, reversing the order; the $i$ becomes $-i$.
    For the commutator, $(i[A,B])^\dagger=-i(B^\dagger A^\dagger-A^\dagger B^\dagger)=-i(BA-AB)=i[A,B]$: hermitian. That is why $[x,p]=i\hbar$ needs the $i$.</p>""",
    r"""<p><b>Move $x$ through powers of $p$:</b> $[p,x]=-i\hbar$, so each time $x$ passes one $p$ it leaves $-i\hbar$ behind; for $p^n$ that happens $n$ times.
    In the exponential series this produces $x\,e^{iap/\hbar}+a\,e^{iap/\hbar}$. So $e^{iap/\hbar}$ shifts $x$ by $a$: momentum generates translations.</p>""",
    r"""<p><b>Conjugation respects products:</b> $Ux^2U^{-1}=(UxU^{-1})(UxU^{-1})$. So every power and every power series in $x$ is shifted:
    $f(x)\to f(x+a)$. Taking $f=e^{ibx/\hbar}$ gives an extra phase $e^{iba/\hbar}$ when the two exponentials are swapped: Weyl's form of $[x,p]=i\hbar$.</p>""",
]
# ---------------------------------------------------------------- sheet 6
EXPLAIN[(6, 1)] = [
    r"""<p>Same as sheet 4 Q1/Q2: away from 0 the solution decays like $e^{-\kappa|x|}$; the jump in $\psi'$ is $-2\kappa\psi(0)$, and the delta
    demands $-\frac{2m\alpha}{\hbar^2}\psi(0)$. So $\kappa=m\alpha/\hbar^2$ and one bound state.</p>""",
    r"""<p><b>Fourier transforming the equation:</b> $p^2/2m$ becomes multiplication, and a product $V(x)\psi(x)$ becomes a convolution of the
    transforms. A delta in $x$ has a constant transform, so the convolution is just a constant times $\int\tilde\psi\,dp=C$. Then the equation is
    algebraic: $(p^2/2m-E)\tilde\psi=$ const, solved by division.</p>""",
    r"""<p><b>Self-consistency:</b> $C$ is defined as $\int\tilde\psi\,dp$, and $\tilde\psi$ contains $C$. Integrate the solution over $p$
    ($\int\frac{dp}{p^2+2m|E|}=\frac{\pi}{\sqrt{2m|E|}}$): $C$ cancels and an equation for $E$ remains, the same $E$ as in position space. The
    shape $\frac1{p^2+\hbar^2\kappa^2}$ (a Lorentzian) is indeed the Fourier transform of $e^{-\kappa|x|}$.</p>""",
    r"""<p>For $E>0$ the denominator $p^2/2m-E$ vanishes at real $p$ and the integral diverges: scattering states are not normalisable, so there
    is no bound state there. For a repulsive delta the condition would need $\sqrt{-2mE}<0$, which is impossible: a barrier binds nothing.</p>""",
]
EXPLAIN[(6, 2)] = [
    r"""<p>$\langle p\rangle=-i\hbar\int\psi\psi'$: the integrand $\sin\cos$ is antisymmetric about the middle, so 0 (a real stationary state does
    not move). $\langle p^2\rangle=2m\langle T\rangle=2mE_n$ since inside the box $V=0$: $\left(\frac{n\pi\hbar}{a}\right)^2$.</p>""",
    r"""<p>Multiply $\Delta x$ from sheet 3 Q3 with $\Delta p$: $\frac\hbar2\sqrt{\frac{n^2\pi^2}{3}-2}$. Already for $n=1$ the root is $1.13>1$, so Heisenberg
    holds but is not saturated (the box state is not a Gaussian).</p>""",
]
EXPLAIN[(6, 3)] = [
    r"""<p><b>Rewrite with variances:</b> $\langle p^2\rangle=(\Delta p)^2+\langle p\rangle^2$ (definition of variance), the same for $x$. Dropping the squares
    of the means can only lower the value, hence "$\ge$".</p>""",
    r"""<p><b>AM–GM inequality</b> $u+v\ge2\sqrt{uv}$ with $u=\frac{(\Delta p)^2}{2m}$, $v=\frac k2(\Delta x)^2$: $\ge\sqrt{k/m}\,\Delta x\Delta p$, then Heisenberg.
    Small $\Delta x$ forces large $\Delta p$ and vice versa; the best compromise costs $\frac12\hbar\omega$. The oscillator ground state
    saturates every step, so this bound is the exact ground energy.</p>""",
]
# ---------------------------------------------------------------- sheet 7
EXPLAIN[(7, 1)] = [
    r"""<p><b>Why it separates:</b> $H$ is a sum of an $x$ part and a $y$ part, each a 1D oscillator. So build ladder operators for each separately;
    operators for different coordinates commute.</p>
    <p><b>Check $a^\dagger a$:</b> $\frac12(x-\partial_x)(x+\partial_x)=\frac12(x^2+x\partial_x-\partial_xx-\partial_x^2)$, and $\partial_x x-x\partial_x=1$ (product rule), so
    $a^\dagger a=\frac12(x^2-\partial_x^2-1)$. Adding both coordinates: $H=\hbar\omega(a^\dagger a+\frac12+b^\dagger b+\frac12)$.</p>""",
    r"""<p><b>Eigenstates</b> are products: $m$ quanta in $x$ and $n$ in $y$. The energy depends only on $m+n=N$, and there are $N+1$ ways to
    split $N$: degeneracy $N+1$. The vacuum is killed by $a$ and $b$, two first-order equations whose solution is the Gaussian.</p>""",
    r"""<p><b>Invariance:</b> $H$ contains $a^\dagger a+b^\dagger b$, the "length squared" of the vector $(a,b)$. A rotation (real orthogonal, $R^TR=I$) keeps
    length. Since $x\propto a+a^\dagger$ and $y\propto b+b^\dagger$, rotating $(a,b)$ rotates $(x,y)$ by the same angle: the symmetry is ordinary
    rotation of the plane.</p>""",
    r"""<p><b>Generator</b> = the derivative of the transformation at $\varphi=0$: $a\to a-\varphi b$, $b\to b+\varphi a$. We need an operator whose
    commutators reproduce this. Try $J=a^\dagger b-b^\dagger a$ and use $[a^\dagger,a]=-1$: $[J,a]=-b$, $[J,b]=a$. Up to $i\hbar$ it is $L_z$.</p>""",
    r"""<p><b>$[H,J]=0$:</b> $a^\dagger b$ removes a quantum from $y$ and adds one to $x$, so it does not change $N$, hence not $E$. A conserved
    operator can be diagonalised inside each energy level. On the level $N=1$ ($|1,0\rangle,|0,1\rangle$) $J$ is a $2\times2$ antisymmetric matrix
    with eigenvalues $\pm i$: the combinations $|1,0\rangle\pm i|0,1\rangle$, which are $x\pm iy$ states, i.e. angular momentum $\pm\hbar$.</p>""",
]
EXPLAIN[(7, 2)] = [
    r"""<p><b>Expand in number states</b> $|\alpha\rangle=\sum c_n|n\rangle$. $a$ lowers: $a|n\rangle=\sqrt n|n-1\rangle$. Comparing coefficients of $|n\rangle$ in
    $a|\alpha\rangle=\alpha|\alpha\rangle$ gives $c_{n+1}\sqrt{n+1}=\alpha c_n$, so $c_n=\frac{\alpha^n}{\sqrt{n!}}c_0$. And $\frac{\alpha^n}{\sqrt{n!}}|n\rangle=\frac{(\alpha a^\dagger)^n}{n!}|0\rangle$: the sum is
    an exponential. Normalisation: $\sum\frac{|\alpha|^{2n}}{n!}=e^{|\alpha|^2}$.</p>""",
    r"""<p>Each $|n\rangle$ picks up $e^{-i\omega(n+\frac12)t}$. The $n$-dependent part combines with $\alpha^n$ into $(\alpha e^{-i\omega t})^n$; the $\frac12$ is a common
    phase. So a coherent state stays coherent, with $\alpha$ turning in the complex plane at frequency $\omega$.</p>""",
    r"""<p>Write $x,p$ with $a,a^\dagger$; then $\langle a\rangle=\alpha(t)$ and $\langle a^\dagger\rangle=\bar\alpha(t)$, so $\langle x\rangle\propto\mathrm{Re}\,\alpha(t)$, $\langle p\rangle\propto\mathrm{Im}\,\alpha(t)$:
    a point going round a circle, which is exactly the classical oscillator. Ehrenfest (sheet 2) is exact here because the force is
    linear.</p>""",
    r"""<p>For $\langle x^2\rangle$ expand $(a+a^\dagger)^2$ and bring every $a$ to the right ($aa^\dagger=a^\dagger a+1$); then $a$ acts on the right ket
    and $a^\dagger$ on the left bra as $\alpha$, $\bar\alpha$. The only $\alpha$-independent leftover is the 1: $(\Delta x)^2=\frac{\hbar}{2m\omega}$, the
    ground-state value. Coherent states are shifted ground states: minimal uncertainty forever.</p>""",
    r"""<p><b>Polar coordinates in the complex plane:</b> the angular integral of $e^{i(n-m)\theta}$ is $2\pi\delta_{nm}$, so only diagonal terms
    $|n\rangle\langle n|$ survive; the radial integral is a Gamma function equal to $n!$, which cancels the $1/n!$. What is left is
    $\sum_n|n\rangle\langle n|=I$. (Coherent states are overcomplete: not orthogonal, but they still resolve the identity.)</p>""",
    r"""<p>In position space $a$ is the differential operator $\sqrt{\frac{m\omega}{2\hbar}}x+\sqrt{\frac{\hbar}{2m\omega}}\frac{d}{dx}$. The eigenvalue equation is
    first order, $\psi'=(\text{linear in }x)\psi$, so $\psi$ is the exponential of a quadratic: the ground-state Gaussian shifted to the
    centre $\sqrt{2\hbar/m\omega}\,\alpha$.</p>""",
]
EXPLAIN[(7, 3)] = [
    r"""<p><b>Multiplying out</b> a product of $k$ series gives every term $s^{n_1}\cdots s^{n_k}=s^{n_1+\dots+n_k}$ once. Collecting all terms with the
    same total $n$, their number is by definition $D_n^k$. This is a generating function: counting turned into algebra.</p>""",
    r"""<p>Each factor is a geometric series $\frac1{1-s}$, so $F^k=(1-s)^{-k}$. Its Taylor coefficients follow from the binomial series (or from
    differentiating $\frac1{1-s}$ $k-1$ times): $\binom{n+k-1}{n}$, the "stars and bars" count.</p>""",
    r"""<p>A $k$-dimensional isotropic oscillator has energy $\hbar\omega(n_1+\dots+n_k+\frac k2)$: the degeneracy of level $N$ is the number of ways
    to distribute $N$ quanta over $k$ directions, $D_N^k$. For $k=2$: $N+1$; for $k=3$: $\frac{(N+1)(N+2)}{2}$.</p>""",
]
# ---------------------------------------------------------------- sheet 8
EXPLAIN[(8, 1)] = [
    r"""<p><b>Strategy:</b> write both $L$'s with $\varepsilon$ and use $[AB,CD]$-rules: the only non-zero basic commutator is $[r_k,p_n]=i\hbar\delta_{kn}$,
    so $[r_kp_l,r_mp_n]=r_k[p_l,r_m]p_n+r_m[r_k,p_n]p_l$, each term giving one Kronecker delta. Then contract two $\varepsilon$'s with
    $\varepsilon_{ikl}\varepsilon_{imn}=\delta_{km}\delta_{ln}-\delta_{kn}\delta_{lm}$ and recognise $r_ip_j-r_jp_i=\varepsilon_{ijk}L_k$.</p>""",
    r"""<p><b>Product rule for commutators:</b> $[A,BC]=[A,B]C+B[A,C]$. Apply it to $L_1^2$ and $L_2^2$ and insert $[L_3,L_1]=i\hbar L_2$,
    $[L_3,L_2]=-i\hbar L_1$: the four terms cancel in pairs. ($[L_3,L_3^2]=0$ trivially.) So $\vec L^2$ and $L_3$ can be diagonalised together.</p>""",
    r"""<p><b>The hint in one line:</b> $\langle\psi|AB|\psi\rangle=a\langle\psi|B|\psi\rangle$ (A acts to the left on the bra, allowed because $A$ is self-adjoint and
    $a$ real) and $\langle\psi|BA|\psi\rangle=a\langle\psi|B|\psi\rangle$ (A acts to the right). The difference vanishes.</p>""",
    r"""<p><b>Use the hint with $A=L_3$:</b> the commutator $[L_3,L_1L_2+L_2L_1]$ works out to $2i\hbar(L_2^2-L_1^2)$, and its expectation in an $L_3$
    eigenstate is zero. So $\langle L_1^2\rangle=\langle L_2^2\rangle$. Their sum is $\langle\vec L^2-L_3^2\rangle=\hbar^2[l(l+1)-m^2]$; each gets half. Even with
    $m=l$ this is not zero: the angular momentum can never point exactly along $z$.</p>""",
]
EXPLAIN[(8, 2)] = [
    r"""<p><b>Lie algebra = velocities at the identity.</b> Differentiate $\gamma(t)^T\gamma(t)=I$ at $t=0$ (where $\gamma=I$): $\dot\gamma^T+\dot\gamma=0$, so the
    tangent vectors are antisymmetric. Conversely every antisymmetric $M$ gives the path $e^{tM}$ in SO(4). A $4\times4$ antisymmetric
    matrix has $\binom42=6$ free entries: one rotation per plane of coordinates.</p>""",
    r"""<p><b>Split the 6 planes:</b> three planes inside the first three coordinates (ordinary rotations $A_i$, which satisfy the so(3) relations)
    and three planes mixing coordinate $i$ with the fourth ($B_i$). Compute the matrix commutators explicitly for a few pairs; the others
    follow by relabelling 1→2→3.</p>""",
    r"""<p><b>Decouple:</b> the combinations $X=\frac12(A+B)$ and $Y=\frac12(A-B)$ each close on themselves and commute with each other: two
    independent copies of su(2). In hydrogen $\vec L$ and the Runge–Lenz vector play the roles of $A$ and $B$, so the symmetry is two
    commuting "spins", and that is what produces the $n^2$ degeneracy (sheet 11).</p>""",
]
EXPLAIN[(8, 3)] = [
    r"""<p><b>Tools:</b> $[a,a^\dagger]=1$, $[b,b^\dagger]=1$, everything with $a$ commutes with everything with $b$. Each $J$ is quadratic, so each
    commutator reduces to one use of $[a,a^\dagger]=1$ or $[b,b^\dagger]=1$. For $[J_+,J_-]$: $a^\dagger bb^\dagger a-b^\dagger aa^\dagger b$; use $bb^\dagger=1+b^\dagger b$ and
    $aa^\dagger=1+a^\dagger a$; the quartic terms cancel, leaving $a^\dagger a-b^\dagger b=2J_3$.</p>""",
    r"""<p>$\vec J^2=J_3^2+\frac12(J_+J_-+J_-J_+)$. Express everything with number operators $N_a=a^\dagger a$, $N_b=b^\dagger b$ (again using
    $aa^\dagger=N_a+1$); it simplifies to $\frac N2(\frac N2+1)$, i.e. $j(j+1)$ with $j=N/2$.</p>""",
    r"""<p><b>Action on number states:</b> $J_+=a^\dagger b$ moves one quantum from $b$ to $a$ with the usual square-root factors. Relabel
    $n_a=j+m$, $n_b=j-m$: the factor $\sqrt{n_b(n_a+1)}=\sqrt{(j-m)(j+m+1)}=\sqrt{j(j+1)-m(m+1)}$, the standard spin formula. Two oscillators
    "are" a spin: Schwinger's trick.</p>""",
    r"""<p>$J_+$ moves a quantum but does not create or destroy one, so $N=N_a+N_b$ is unchanged: the $J$'s commute with $N$, hence with $H$. Each
    energy level $N$ is the spin-$N/2$ multiplet, dimension $N+1$, which explains the degeneracy found in sheet 7.</p>""",
]
# ---------------------------------------------------------------- sheet 9
EXPLAIN[(9, 1)] = [
    r"""<p>$\mathrm{sech}^2x=1/\cosh^2x$ is a bell: 1 at $x=0$, decaying like $4e^{-2|x|}$. So $V$ is a smooth well of depth $\hbar^2/m$. A ground state
    is even, without nodes, and decays outside.</p>""",
    r"""<p><b>Factorisation method:</b> write $H$ (up to a constant) as $A^\dagger A$. Compute $(-\partial_x+\tanh)(\partial_x+\tanh)\psi=-\psi''-\tanh'\psi+\tanh^2\psi$
    (the cross terms $\pm\tanh\,\psi'$ cancel). With $\tanh'=\mathrm{sech}^2$ and $\tanh^2=1-\mathrm{sech}^2$: $-\psi''+(1-2\mathrm{sech}^2x)\psi$, which is
    $\frac{2m}{\hbar^2}H\psi+\psi$.</p>""",
    r"""<p><b>Why $A^\dagger A\ge0$:</b> $\langle\chi|A^\dagger A|\chi\rangle=\langle A\chi|A\chi\rangle=\|A\chi\|^2$. So $\epsilon+1\ge0$ for every eigenvalue, with equality
    exactly when $A\psi=0$, a first-order equation: $\psi'=-\tanh x\,\psi$, solved by $1/\cosh x$. This is the same trick as $a|0\rangle=0$ for the
    oscillator.</p>""",
]
EXPLAIN[(9, 2)] = [
    r"""<p><b>Idea:</b> $Z=\sum_ne^{-\beta E_n}$ for discrete levels. A continuous part of the spectrum contributes an integral over states that
    are not normalisable, and each of them comes with an infinite weight ($\langle p|p\rangle=\delta(0)$). So a finite $Z$ rules out continuous
    spectrum.</p>""",
    r"""<p>Golden–Thompson lets us split $e^{-\beta(T+V)}$ into $e^{-\beta T}e^{-\beta V}$ inside the trace. Take the trace in position states: $e^{-\beta V}$ is
    just a number there; for $e^{-\beta T}$ insert momentum states ($T$ is diagonal there) with $|\langle q|p\rangle|^2=(2\pi\hbar)^{-d}$. The result is
    the classical partition function: quantum $Z$ is bounded by classical $Z$.</p>""",
    r"""<p>The $p$ integral is always a finite Gaussian, so everything hinges on $\int e^{-\beta V}d^dq<\infty$: the potential must grow fast enough at
    infinity. For $\|q\|^\alpha$ use spherical coordinates; the radial integral is a Gamma function, finite for any $\alpha>0$.</p>""",
]
EXPLAIN[(9, 3)] = [
    r"""<p>Check the products on the explicit matrices: $\sigma_j^2=I$, $\sigma_1\sigma_2=i\sigma_3$ and cyclic, and different $\sigma$'s anticommute. The
    combined formula $(\vec x\cdot\vec\sigma)(\vec y\cdot\vec\sigma)=\vec x\cdot\vec y+i(\vec x\times\vec y)\cdot\vec\sigma$ follows by summing over components; for $\vec x=\vec y=\vec n$
    (unit vector) the cross product vanishes: $(\vec n\cdot\vec\sigma)^2=I$.</p>""",
    r"""<p>Because $(\vec n\cdot\vec\sigma)^2=I$, even powers in the exponential series are $I$ and odd powers are $\vec n\cdot\vec\sigma$. The even part sums to
    $\cos\frac\omega2$, the odd part to $\sin\frac\omega2$, exactly like $e^{i\phi}=\cos\phi+i\sin\phi$. The half angle means a $2\pi$ rotation gives $-I$.</p>""",
    r"""<p>Multiply out $U\tilde xU^\dagger$ with the form from (ii) and use (i) to turn products of $\sigma$'s back into single $\sigma$'s. The half-angle
    products combine with double-angle formulas into $\cos\omega$ and $\sin\omega$. The coefficients are exactly Rodrigues' formula for a rotation
    by $\omega$ about $\vec n$: SU(2) acts on 3-vectors as rotations, two-to-one ($U$ and $-U$ give the same rotation).</p>""",
]
EXPLAIN[(9, 4)] = [
    r"""<p>$a_i^\dagger a_j$ moves one quantum from direction $j$ to direction $i$: the total number, hence the energy, is unchanged, so it commutes with
    $H$. Its commutators reproduce those of the matrix units $E_{ij}$ (one use of $[a_j,a_k^\dagger]=\delta_{jk}$): the 9 operators form u(3).</p>""",
    r"""<p><b>Roots:</b> the $h$'s are diagonal, so each $e$ is an eigenvector of "commutator with $h$"; the pair of eigenvalues is its root. E.g.
    $[E_{11}-E_{22},E_{12}]=2E_{12}$. Each root vector, its partner $f$ and their commutator form a copy of su(2), like $J_+,J_-,2J_3$.</p>""",
    r"""<p><b>Highest weight:</b> raising operators $e$ increase the weight; in a finite-dimensional representation that must stop, so there is a vector
    killed by all $e$'s. Applying lowering operators to it generates the whole irrep. Inside each su(2) copy the weight must be a non-negative
    integer (spin-$j$ representations), which restricts the possible highest weights.</p>""",
    r"""<p>Level $N$ holds all ways to distribute $N$ quanta in 3 directions, $\frac{(N+1)(N+2)}{2}$ states (sheet 7 Q3). The $J$'s map this level to itself.
    The state with all quanta in direction 1 cannot be raised further (there is nowhere "higher" to move a quantum): it is the highest weight,
    $(N,0)$. Its irrep has exactly that dimension, so the whole level is one su(3) irrep: su(3) explains the full degeneracy.</p>""",
]
# ---------------------------------------------------------------- sheet 10
EXPLAIN[(10, 1)] = [
    r"""<p>In Cartesian coordinates the 3D oscillator is three independent 1D oscillators: $E=\hbar\omega(n_x+n_y+n_z+\frac32)$, and the degeneracy is the
    number of ways to split $N$ into three, $\frac{(N+1)(N+2)}{2}$ (sheet 7 Q3). This is the answer the spherical calculation must reproduce.</p>""",
    r"""<p><b>Asymptotic analysis:</b> near $r=0$ the centrifugal term $\ell(\ell+1)/r^2$ dominates everything else, so solve only
    $u''=\frac{\ell(\ell+1)}{r^2}u$: powers $r^{\ell+1}$ and $r^{-\ell}$; only the first is acceptable. For $r\to\infty$ the $r^2$ term dominates; try $u=e^S$:
    $S'^2\approx\alpha^2r^2$ gives a Gaussian. A confining potential that grows forever has no scattering states.</p>""",
    r"""<p><b>Peel off the known behaviour</b> ($u=e^{-\alpha r^2/2}f$) and expand the rest in powers of $r$. Inserting and collecting the coefficient of each
    power gives a two-step recursion: $c_{k+2}$ from $c_k$. Starting at $c_{\ell+1}$ only every second power appears, so one free constant.</p>""",
    r"""<p><b>The series must stop.</b> For large $k$ the ratio $c_{k+2}/c_k\approx2\alpha/k$ is that of $e^{\alpha r^2}$, which would overwhelm the Gaussian
    and make $u$ blow up. It stops only if the numerator vanishes at some $k_{\max}$: $\varepsilon=\alpha(2k_{\max}+1)$, which is the quantisation of $E$.
    Writing $k_{\max}=\ell+1+2n_r$ ($n_r$ = number of radial nodes) gives $E=\hbar\omega(2n_r+\ell+\frac32)$.</p>""",
    r"""<p>At $N=2n_r+\ell$ the allowed $\ell$ are $N,N-2,\dots$; each $\ell$ has $2\ell+1$ values of $m$. Summing $(2\ell+1)$ over these $\ell$ gives back
    $\frac{(N+1)(N+2)}{2}$. Different $\ell$ having the same energy is not explained by rotations alone: it is the hidden su(3) of sheet 9 Q4.</p>""",
]
EXPLAIN[(10, 2)] = [
    r"""<p><b>What to check:</b> for every pair $(a,b)$ multiply the two matrices and compare with $\gamma(ab)$; the sign that appears is $c_2(a,b)$.
    Products with the identity are trivial. The interesting fact: $\gamma(g)\gamma(h)=-\gamma(h)\gamma(g)$, the matrices anticommute although $g$ and $h$
    commute in the group, so one order must carry a $-1$.</p>""",
    r"""<p><b>Why no rephasing helps:</b> look at the ratio $c_2(g,h)/c_2(h,g)$. Rephasing $\gamma(a)\to c_1(a)\gamma(a)$ changes $c_2(g,h)$ and $c_2(h,g)$ by the
    same factor (because $gh=hg$), so the ratio is invariant, and it equals $-1$. Matrices that anticommute stay anticommuting after
    multiplying them by numbers; an honest representation of an abelian group would need commuting matrices.</p>""",
    r"""<p><b>The fix:</b> make the sign part of the group element. Pairs (sign, group element) with the product rule twisted by $c_2$ form a bigger
    group $E$ of 8 elements, and $\pm\gamma(a)$ represent it honestly. Associativity of $E$ is inherited from associativity of matrix
    multiplication (the cocycle condition). The 8 matrices are the symmetries of a square: $D_4$.</p>""",
    r"""<p>The same construction works for any group: collect all phases that appear into an abelian group $U$, and let the pairs $(u,g)$ multiply
    with the twist. This is how spin $\frac12$ works: SO(3) has only a projective representation on spinors (a $2\pi$ rotation gives $-1$),
    and the "bigger group" is SU(2), the double cover.</p>""",
]
# ---------------------------------------------------------------- sheet 11
EXPLAIN[(11, 1)] = [
    r"""<p>$S$ and $D$ are combinations of $L$ and $J$, so "killed by $S_+$ and $D_+$" is equivalent to "killed by $L_+$ and $J_+$" (add and subtract).
    A state killed by $L_+$ has the maximal $m=l$ in each angular-momentum component, so it is a sum of states $|n,l,l\rangle$.</p>""",
    r"""<p><b>$J$ is a vector operator:</b> $[L_j,J_k]=i\hbar\varepsilon_{jkl}J_l$, so $J_+$ behaves like a "raising" vector: it adds $\hbar$ to $L_3$ and commutes with
    $L_+$. Applied to $|n,l,l\rangle$ it therefore gives a state with $m=l+1$ still killed by $L_+$, i.e. $\propto|n,l+1,l+1\rangle$. If $J_+$ must kill the
    whole sum, each term must be killed, which only happens at the top value $l=n-1$ (there is no $l=n$).</p>""",
    r"""<p><b>Explicit check:</b> the state with $l=n-1$, $m=n-1$ has no radial nodes and the angular part $\sin^{n-1}\theta\,e^{i(n-1)\varphi}$ (the top spherical
    harmonic). Acting with the explicit $J_+$ operator, the terms cancel. This confirms the algebraic argument.</p>""",
    r"""<p><b>Counting:</b> $|\psi\rangle$ is the top state of two spins, each with $j=\frac{n-1}{2}$. Lowering independently with $S_-$ and $D_-$ gives
    $(2j+1)\times(2j+1)=n^2$ states: the full degeneracy of the hydrogen level $n$, explained by symmetry.</p>""",
]
EXPLAIN[(11, 2)] = [
    r"""<p><b>A spin-½ state "points" somewhere:</b> the state with $\langle\vec\sigma\rangle=\vec e$ is the $+1$ eigenvector of $\vec e\cdot\vec\sigma$ (spin up along $\vec e$). Solving the
    $2\times2$ eigenproblem with $\vec e$ in spherical angles gives $(\cos\frac\theta2,e^{i\varphi}\sin\frac\theta2)$. Half angles again: the Bloch sphere
    angle $\theta$ is twice the "mixing angle" in Hilbert space.</p>""",
    r"""<p>$P(\uparrow_z)=|\langle\uparrow|\chi\rangle|^2=\cos^2\frac\theta2=\frac{1+\cos\theta}{2}$. Checks: along $+z$ certainty, along $-z$ zero, in the equator 50/50.</p>""",
]
EXPLAIN[(11, 3)] = [
    r"""<p><b>Counting method:</b> list the possible total $m=m_1+m_2$ with their multiplicities. The largest, $\frac32$, occurs once and must start a
    $j=\frac32$ multiplet (4 states). Remove those; what remains has top $m=\frac12$, so a $j=\frac12$ multiplet. $4+2=6$ states, all accounted for.
    General rule: $j$ runs from $|j_1-j_2|$ to $j_1+j_2$ in steps of 1.</p>""",
]
# ---------------------------------------------------------------- sheet 12
EXPLAIN[(12, 1)] = [
    r"""<p><b>What the magnet measures:</b> the deflection is proportional to the total $m$ of the molecule. Two spins ½ combine into a triplet
    ($m=1,0,-1$) and a singlet ($m=0$). Unpolarised: each of the 4 product states is equally likely; $m=0$ occurs twice ($\uparrow\downarrow,\downarrow\uparrow$),
    so the middle spot gets twice the intensity.</p>""",
    r"""<p>Three spins: count the $2^3=8$ product states by $m$: $m=\frac32$ once, $\frac12$ three times, $-\frac12$ three times, $-\frac32$ once. Four spots
    with $1:3:3:1$ (binomial coefficients).</p>""",
]
EXPLAIN[(12, 2)] = [
    r"""<p>The generators of rotations of 3-vectors are $3\times3$ matrices with entries $\pm1$ from $\varepsilon$. Computing $\vec M^2$ gives $2\cdot I=1(1+1)$, and $M_3$
    has eigenvalues $-1,0,1$: by definition this is spin 1. "A vector is spin 1."</p>""",
    r"""<p><b>Vector operator</b> means: commuting with $L_j$ rotates its components exactly like a vector, $[L_j,V_k]=i\hbar\varepsilon_{jkl}V_l$. For $\vec x$ and $\vec p$
    this follows from $[x,p]=i\hbar$ and $\vec L=\vec x\times\vec p$.</p>""",
    r"""<p>The spherical components $V_{\pm1}=\mp\frac{1}{\sqrt2}(V_1\pm iV_2)$, $V_0=V_3$ are the analogue of $|1,\pm1\rangle$, $|1,0\rangle$. $V_{+1}$ is "highest": raising it
    further gives zero.</p>""",
    r"""<p><b>Dimension count:</b> symmetric products of two 3-vectors: $3\cdot4/2=6$ components. A scalar (the dot product, 1 component) can always be
    split off; the rest is a symmetric traceless tensor with 5 components, i.e. spin 2. So $6=5+1$. (The antisymmetric part, the cross
    product, would be the remaining spin 1.)</p>""",
]
EXPLAIN[(12, 3)] = [
    r"""<p><b>Start at the top</b>, where there is only one way: $|j=l+\frac12,m=l+\frac12\rangle=|l,\uparrow\rangle$. Apply $J_-=L_-+S_-$ to both sides: the left
    gives the next $|j,m\rangle$ with a known factor, the right gives a combination of $|l-1,\uparrow\rangle$ and $|l,\downarrow\rangle$ with known factors.
    Repeating gives a recursion between neighbouring coefficients; the ratios telescope (multiply out) to the closed formula.</p>""",
    r"""<p>For $l=1$ just apply the formula with $m=\frac12$ and $m=-\frac12$, or lower once from the top by hand. The $j=\frac12$ states are the orthogonal
    combinations of the same two basis states.</p>""",
]
# ---------------------------------------------------------------- sheet 13
EXPLAIN[(13, 1)] = [
    r"""<p><b>Expand both sides to second order in $t$.</b> Left: the exponential $e^{-iHt/\hbar}$ to second order, sandwiched in $|\psi\rangle$, gives
    $1-\frac{it}{\hbar}\langle H\rangle-\frac{t^2}{2\hbar^2}\langle H^2\rangle$. Right: expand the claimed exponential; its $t^2$ term has
    $(\Delta H)^2+\langle H\rangle^2=\langle H^2\rangle$. Same to order $t^2$.</p>""",
    r"""<p>The probability is the modulus squared: the first term is a pure phase and drops out, the Gaussian factor squares. So the state starts to
    change on the time scale $\hbar/\Delta H$: a large energy spread means fast change. An energy eigenstate has $\Delta H=0$ and never changes
    (apart from a phase).</p>""",
]
EXPLAIN[(13, 2)] = [
    r"""<p>Between measurements the state evolves with $U$; each measurement projects back onto $|\phi\rangle$. In $PUP=|\phi\rangle\langle\phi|U|\phi\rangle\langle\phi|$ the middle is just a
    number. A chain of $n$ such blocks is that number to the power $n$, times $P$.</p>""",
    r"""<p><b>Why the limit freezes the state.</b> By Q1 the survival amplitude over a short time $\tau$ deviates from a phase only at order $\tau^2$.
    With $\tau=t/n$, $n$ factors of $(1-O(t^2/n^2))$ give $1-O(t^2/n)\to1$. The loss per step is quadratic, but the number of steps only linear,
    so frequent enough measurement stops the evolution: the quantum Zeno effect.</p>""",
]
EXPLAIN[(13, 3)] = [
    r"""<p>Express $|+\rangle$ and $|-\rangle$ for Alice through $|\pm\hat n\rangle$: $|\pm\rangle=\frac1{\sqrt2}(|+\hat n\rangle\pm|-\hat n\rangle)$. Insert, collect the terms with $|+\hat n\rangle$ and
    with $|-\hat n\rangle$. Writing a state "in the basis of the measurement" shows directly what the other side is left with after each result.</p>""",
    r"""<p>Read off from the different ways of writing $|\psi\rangle$: after each specified result of one side, the other side is left in a definite state, so its
    result is certain. E.g. $a_0=+1$: only the $|++\rangle$ term has Alice $+$, so Bob's $b_0$ is $+1$. These certain correlations are the three
    "zeros".</p>""",
    r"""<p><b>The paradox:</b> if all four values existed simultaneously, the three certainties would chain together and forbid $a_0=+1$, $b_1=-1$.
    Quantum mechanically: $a_0=+1$ with probability $\frac13$, then Bob has $|+\rangle$, and $|\langle-\hat m|+\rangle|^2=\frac15$. So the "impossible"
    event happens with probability $\frac1{15}$: the values of incompatible observables do not exist before measurement.</p>""",
]
# ---------------------------------------------------------------- sheet 14
EXPLAIN[(14, 1)] = [
    r"""<p>Express $x$ with ladder operators, $x=x_0\frac{a+a^\dagger}{\sqrt2}$; then $(x/x_0)^4=\frac14(a+a^\dagger)^4$. Everything is now in the language
    where matrix elements are easy.</p>""",
    r"""<p><b>Which elements survive:</b> $(a+a^\dagger)^4$ is a sum of 16 products of four ladder operators, each changing $n$ by $\pm1$, so the net change is
    $0,\pm2,\pm4$. First order needs only the diagonal one: count the products with two $a$ and two $a^\dagger$ and evaluate them on $|n\rangle$; they
    add up to $6n^2+6n+3$.</p>""",
    r"""<p><b>Second order formula</b> $E^{(2)}_n=\sum_{k\ne n}\frac{|\langle k|H_a|n\rangle|^2}{E_n-E_k}$: here $k=n\pm2,n\pm4$ with denominators $\mp2\hbar\omega,\mp4\hbar\omega$. The
    ground state has only $k=2,4$ (no levels below), both making the energy lower: second order always lowers the ground state.</p>""",
    r"""<p><b>Small compared to what?</b> The correction must be small compared with the level spacing $\hbar\omega$. But $E^{(1)}_n$ grows like $n^2$: for large $n$
    the particle swings far out where $x^4$ beats $x^2$, and the "perturbation" dominates. Perturbation theory is a small-amplitude expansion.</p>""",
]
EXPLAIN[(14, 2)] = [
    r"""<p><b>Before computing, use symmetry.</b> $z$ is odd under parity, so it connects only states of opposite parity ($\ell$ even ↔ odd), and it does not
    change $m$ (it commutes with $L_z$). In the $n=2$ space ($2s$; $2p$ with $m=-1,0,1$) the only pair with opposite parity and equal $m$ is
    $2s\leftrightarrow2p_{m=0}$.</p>""",
    r"""<p>The angular integral of $\cos\theta$ between the $\ell=0$ and $\ell=1,m=0$ harmonics gives $1/\sqrt3$; the radial integral of $r\cdot R_{20}R_{21}r^2$ gives the rest.
    Together $-3a_0$: the size of the effect is set by the Bohr radius.</p>""",
    r"""<p><b>Degenerate perturbation theory:</b> inside a degenerate level, diagonalise the perturbation matrix. A $2\times2$ block with zeros on the
    diagonal has eigenvalues $\pm$(off-diagonal), with eigenvectors $(1,\pm1)/\sqrt2$. The mixed $s$–$p$ states have a permanent dipole
    moment, hence a shift linear in $E$; this only happens because $2s$ and $2p$ have the same energy in hydrogen.</p>""",
]
EXPLAIN[(14, 3)] = [
    r"""<p><b>Strong field:</b> the Zeeman term is the big one, and it is diagonal in $|n\ell mm_s\rangle$. Treat spin-orbit as the perturbation: first order needs
    its diagonal elements. $\vec L\cdot\vec S=L_zS_z+\frac12(L_+S_-+L_-S_+)$ and the $\pm$ terms change $m$ and $m_s$, so only $L_zS_z$ survives on the diagonal:
    $\hbar^2mm_s$. Valid when the Zeeman splitting exceeds the fine structure.</p>""",
    r"""<p><b>Which states mix:</b> $\Delta H$ commutes with $\vec L^2$ and with $J_z=L_z+S_z$, so it only mixes states with the same $\ell$ and the same $m_j$. For given
    $m_j$ there are at most two: $|m_j-\frac12,\uparrow\rangle$ and $|m_j+\frac12,\downarrow\rangle$. Diagonalise each $2\times2$ block exactly; this covers all field
    strengths at once.</p>""",
    r"""<p><b>Weak field:</b> start from spin-orbit eigenstates $|j,m_j\rangle$, where $\vec L\cdot\vec S=\frac12(\vec J^2-\vec L^2-\vec S^2)$ is diagonal. Zeeman at first
    order needs $\langle L_z+2S_z\rangle=\langle J_z+S_z\rangle$; by the projection theorem $\vec S$ averages to its component along $\vec J$. This gives the Landé factor:
    each $j$ level splits into $2j+1$ equally spaced lines.</p>""",
]
