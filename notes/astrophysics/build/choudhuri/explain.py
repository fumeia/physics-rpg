"""Plain-words explanations of the worked solutions of the Choudhuri exercises: EXPLAIN['<chapter>.<n>'] = [html per step].
Shown under each revealed step as "Explain this step": why the step is taken, where the formula comes from (with the book's
section), what each symbol means and the arithmetic in between. The numbers themselves are those of calc.py."""
EXPLAIN = {}

# ---------------------------------------------------------------- Ch. 1
EXPLAIN['1.1'] = [
    r"""<p><b>Circular orbit = gravity supplies the centripetal force.</b> For a spherical mass distribution only the mass <i>inside</i> the
    orbit pulls (shell theorem: the shells outside cancel). So the Sun's orbit "weighs" the Galaxy inside $8$ kpc, exactly like a planet's
    orbit weighs the Sun.</p>""",
    r"""<p>Multiply $\frac{v^2}{R}=\frac{GM}{R^2}$ by $R^2/G$. Units: convert kpc to m ($8\times3.09\times10^{19}$ m) and km/s to m/s ($2.2\times10^5$). Divide by
    $M_\odot$ to get solar masses.</p>""",
    r"""<p>The method only sees mass inside the orbit. Stars and gas further out orbit just as fast (flat rotation curve), so even more mass
    must be hidden further out: the dark matter halo.</p>""",
]
EXPLAIN['1.2'] = [
    r"""<p><b>Distance modulus:</b> flux falls like $1/d^2$, and magnitudes are $-2.5\log_{10}$ of flux, so moving a star from $d$ to $10$ pc changes its
    magnitude by $5\log_{10}(d/10\,\mathrm{pc})$. $\log_{10}0.4=-0.398$, times $-5$ gives $+1.99$.</p>""",
    r"""<p><b>Magnitudes are logarithmic and reversed:</b> 5 magnitudes = factor 100, so 1 magnitude = $100^{1/5}=10^{0.4}\approx2.51$; a smaller
    magnitude means brighter. The star is one magnitude brighter than the Sun's $M=5$: $10^{0.4}\approx2.5$ times the luminosity.</p>""",
    r"""<p>Multiply the ratio by $L_\odot$. (Absolute magnitudes compare luminosities directly because both stars are imagined at the same
    10 pc.)</p>""",
]
EXPLAIN['1.3'] = [
    r"""<p><b>Why the baseline counts.</b> Resolution comes from comparing the phase of a wave at two points: the farther apart, the smaller the
    angle at which the phase difference changes by a full cycle. An array of antennas therefore resolves like one dish as big as its widest
    spacing (aperture synthesis).</p>""",
    r"""<p>$\theta\approx\lambda/D$ in radians; to convert, $1\,\mathrm{rad}=206265''$. So $10^{-4}$ rad $\approx20''$.</p>""",
    r"""<p>Same formula backwards with $\lambda=500$ nm: a millimetre-sized lens would already match. Radio waves are a million times longer, so
    radio telescopes must be a million times larger for the same sharpness.</p>""",
]
# ---------------------------------------------------------------- Ch. 2
EXPLAIN['2.1'] = [
    r"""<p><b>The standard trick for Planck integrals:</b> substitute $x=h\nu/\kappa_BT$. Then $\nu=\frac{\kappa_BT}{h}x$ and $\nu^3d\nu=\left(\frac{\kappa_BT}{h}\right)^4x^3dx$:
    all the temperature dependence comes out as $T^4$, and what is left is a pure number, $\int\frac{x^3}{e^x-1}dx=\frac{\pi^4}{15}$.</p>""",
    r"""<p><b>From energy density to flux.</b> Isotropic radiation has intensity $I=\frac{c}{4\pi}U$ in every direction. Through a surface only the
    perpendicular component counts ($\cos\theta$), and only outgoing directions (a hemisphere). With $\mu=\cos\theta$, $d\Omega=d\phi\,d\mu$:
    $\int_0^{2\pi}d\phi\int_0^1\mu\,d\mu=\pi$. Hence $F=\pi I=\frac c4U$: the famous factor $\frac14$.</p>""",
    r"""<p><b>Maximum:</b> differentiate $\frac{x^3}{e^x-1}$, set to zero: $3x^2(e^x-1)=x^3e^x$, i.e. $3(1-e^{-x})=x$. Solve numerically (iterate
    $x=3(1-e^{-x})$ starting from 3): $x\approx2.82$. Then $\nu_{\max}=2.82\,\kappa_BT/h$.</p>""",
    r"""<p><b>Per Hz versus per metre.</b> $U_\nu$ is energy per frequency interval, $U_\lambda$ per wavelength interval, and $|d\nu|=\frac{c}{\lambda^2}d\lambda$
    stretches the axis unevenly. A peak is not invariant under such a change of variable, so the two peaks sit at different places.</p>""",
]
EXPLAIN['2.2'] = [
    r"""<p><b>Flux from intensity</b> needs the solid angle of the source as seen from the receiver. The hole is a small area $\frac{\pi d^2}{4}$ at
    distance $r$; its solid angle is area$/r^2$, reduced by $\cos\theta$ because we look at it obliquely. From the film patch at angle $\theta$
    off-axis the distance is $L/\cos\theta$.</p>""",
    r"""<p>$dF=I\cos\theta\,d\Omega$: one more $\cos\theta$ because the light arrives obliquely on the film. Insert $d\Omega$: three factors of $\cos\theta$ from
    $d\Omega$ ($\cos\theta$ and $1/r^2=\cos^2\theta/L^2$), one from the projection.</p>""",
    r"""<p>Collect: $\cos^4\theta$ and $(d/L)^2=1/f^2$. Because intensity is constant along rays, the image samples $I_\nu$ of the sky directly;
    this is why exposure times scale with $f^2$ ("f-number").</p>""",
]
EXPLAIN['2.3'] = [
    r"""<p><b>Saha</b> is a chemical equilibrium $\mathrm H\rightleftharpoons p+e$: the ratio $n_en_p/n_H$ depends only on $T$ (a Boltzmann factor $e^{-\chi/kT}$
    times the phase space available to a free electron). With fixed density $n$ write all three densities through $x$; the left side becomes
    $\frac{x^2n}{1-x}$.</p>""",
    r"""<p><b>Solve the quadratic</b> $nx^2+K(T)x-K(T)=0$ with $K(T)$ the right-hand side: $x=\frac{-K+\sqrt{K^2+4nK}}{2n}$. When $K\ll n$, $x\approx\sqrt{K/n}$, tiny.
    The exponential $e^{-\chi/kT}$ with $\chi/k=158000$ K makes $K$ rise steeply with $T$.</p>""",
    r"""<p><b>Why so high a temperature:</b> at high density recombination is efficient, so you need a bigger Boltzmann factor to keep atoms
    ionised. In thin stellar atmospheres the same competition gives ionisation already near $10^4$ K, even though $kT$ is then only about
    1 eV, far below 13.6 eV: there are so many free-electron states that entropy wins.</p>""",
]
EXPLAIN['2.4'] = [
    r"""<p><b>Formal solution</b> (2.65): the intensity going up at depth $\tau$ is the emission $S$ of all layers below, each attenuated by
    $e^{-(t-\tau)/\mu}$ on the slanted way up. Shifting the variable to $s=t-\tau$ (distance below the current depth) makes the integrals
    standard.</p>""",
    r"""<p>$\int_0^\infty e^{-s/\mu}ds=\mu$ and $\int_0^\infty se^{-s/\mu}ds=\mu^2$; dividing by $\mu$ gives 1 and $\mu$. The source function is linear in depth,
    and a linear function averaged with that exponential weight is simply evaluated one "$\mu$" deeper: $S(\tau+\mu)$.</p>""",
    r"""<p><b>Limb darkening:</b> at the disk centre ($\mu=1$) we see down to $\tau\approx1$, at the limb ($\mu\to0$) only the shallow, cooler layers.
    Deep inside, the $\mu$ term is a small anisotropy, just enough to carry the constant outward flux.</p>""",
]
EXPLAIN['2.5'] = [
    r"""<p><b>Optically thin</b> means every emitting atom is seen: brightness = emissivity × path length. A line of sight at distance $b$ from the
    centre crosses the sphere along a chord $2\sqrt{R^2-b^2}$ (Pythagoras), longest through the centre.</p>""",
    r"""<p><b>Effective temperature</b> is <i>defined</i> by $L=4\pi R^2\sigma T_{\rm eff}^4$. A thin cloud emits from its whole volume, $4\alpha\sigma T^4$ per unit
    volume (Kirchhoff: emission = absorption × Planck). Equate: $T_{\rm eff}^4\propto\tau_c T^4$, much less than $T^4$ because a thin cloud emits far
    less than a blackbody would.</p>""",
    r"""<p><b>Optically thick:</b> every line of sight ends in the cloud, and we see only down to $\tau\approx1$; with uniform $T$ every such layer has the
    same $B_\nu(T)$. So it looks like a uniform disk and radiates like a blackbody at $T$.</p>""",
]
EXPLAIN['2.6'] = [
    r"""<p>The formal solution at the top with $\mu=1$: add up the Planck emission of each layer, weighted by $e^{-\tau}$ (the fraction that gets
    out). In a grey atmosphere $\tau$ is the same for all frequencies, and $T(\tau)$ comes from the Eddington solution (2.69).</p>""",
    r"""<p><b>Numerics:</b> discretise $\tau$, compute $T$ at each point, evaluate $B_\nu$ and sum with weights $e^{-\tau}\Delta\tau$; contributions beyond $\tau\approx10$
    are negligible ($e^{-10}$). The result is dominated by $\tau\approx\frac23$, where $T=T_{\rm eff}$.</p>""",
    r"""<p><b>The key idea:</b> at each frequency we see down to $\tau_\nu\approx1$. Low opacity: deep and hot, so more light; high opacity: shallow and
    cool, so less light (absorption lines). Comparing a real spectrum with the grey one therefore tells you where $\alpha_\nu$ is above or below
    average.</p>""",
]
EXPLAIN['2.7'] = [
    r"""<p>Fully ionised hydrogen: one free electron per proton, and the mass is almost all protons, so $n_e=\rho/m_H$.</p>""",
    r"""<p>Attenuation $e^{-n_e\sigma_Ts}$: $n_e\sigma_T$ is the inverse mean free path. Set the factor to $\frac12$, take the logarithm: $s=\ln2\cdot$ mean free path.</p>""",
    r"""<p>Free electrons scatter light very efficiently; bound electrons in neutral hydrogen hardly scatter visible light. So the early Universe was
    opaque until the electrons recombined into atoms, and then suddenly transparent: that moment is the CMB we see.</p>""",
]
# ---------------------------------------------------------------- Ch. 3
EXPLAIN['3.1'] = [
    r"""<p><b>Mean molecular weight $\mu$:</b> the average mass per free particle in units of $m_H$. Ionised gas has electrons too, so many particles per
    unit mass: for mostly hydrogen, $\mu\approx0.6$. $N=M/(\mu m_H)$.</p>""",
    r"""<p>Each particle has $\frac32\kappa_BT$ of kinetic energy (equipartition, three directions). Multiply by $N$.</p>""",
    r"""<p><b>Why they must match:</b> gravity tries to compress the star, pressure (thermal motion) resists. In equilibrium the virial theorem
    $2E_{\rm th}+E_G=0$ fixes the internal temperature from mass and radius alone, which is how we know the Sun's centre is $\sim10^7$ K without
    seeing it.</p>""",
]
EXPLAIN['3.2'] = [
    r"""<p><b>Virial bookkeeping:</b> when a star contracts, gravity releases $\Delta|E_G|$; by $2E_{\rm th}=-E_G$ half of it goes into heating the gas and only
    half can be radiated. Differentiate $|E_G|=GM^2/R$ in time: $\frac{d}{dt}\frac1R=-\frac{\dot R}{R^2}$.</p>""",
    r"""<p>Solve for $|\dot R|$ and convert: one year is $3.15\times10^7$ s. The prefactor ($1$ or $\frac35$ for a uniform sphere) changes the number but not
    the order.</p>""",
    r"""<p><b>The real argument</b> is the time scale: the total energy available divided by the luminosity, $\sim10^7$ yr. Geology and fossils need
    billions of years, so contraction cannot be the Sun's power source: nuclear fusion is.</p>""",
]
EXPLAIN['3.3'] = [
    r"""<p>Radiation pressure of blackbody radiation is a third of its energy density, $\frac13a_BT^4$. Use $a_B=7.56\times10^{-16}$ SI and $T^4$ at the centre.</p>""",
    r"""<p>Ideal gas: $P=nkT$ with $n=\rho/(\mu m_H)$ particles per volume.</p>""",
    r"""<p>Ratio $\propto T^4/(\rho T)=T^3/\rho$: hot, thin matter is radiation dominated. In more massive stars the centre is hotter and less dense,
    so radiation pressure becomes important (and eventually limits the mass, Ex. 3.5).</p>""",
]
EXPLAIN['3.4'] = [
    r"""<p>(3.22) is the adiabatic temperature gradient: a convection zone is so well mixed that it follows an adiabat. $\frac{dT}{T}=\frac25\frac{dP}{P}$ integrates to
    $T\propto P^{2/5}$, i.e. $P\propto T^{5/2}$; with $P\propto\rho T$, $\rho\propto T^{3/2}$.</p>""",
    r"""<p>Insert hydrostatic equilibrium for $dP/dr$ and the ideal gas for $\rho/P$: $\frac{T\rho}{P}=\frac{\mu m_H}{\kappa_B}$, so $T$, $P$ and $\rho$ all drop out and the
    gradient depends only on gravity.</p>""",
    r"""<p>$\frac{dT}{dr}\propto-\frac1{r^2}$ integrates to $\frac1r$ plus a constant; choose the constant so that $T\approx0$ at the surface (the surface is very cool
    compared with the interior). Then the adiabat relations give $\rho$ and $P$.</p>""",
    r"""<p>Put numbers in: $\frac{GM_\odot\mu m_H}{\kappa_BR_\odot}\approx1.4\times10^7$ K for $\mu=0.6$, times $\frac25$ and $(\frac1{0.7}-1)=0.43$. A simple model already gets the
    base temperature of the convection zone right.</p>""",
]
EXPLAIN['3.5'] = [
    r"""<p><b>Radiation pushes too:</b> photons carry momentum $E/c$. A gas element with opacity $\chi$ (cross-section per mass) absorbs or scatters a
    fraction of the flux $F=L/4\pi r^2$ and receives a force $\chi F/c$ per unit mass. Gravity per unit mass is $GM/r^2$. Both fall like $1/r^2$, so
    the comparison does not depend on $r$.</p>""",
    r"""<p>$\chi=\sigma_T/m_H$: one electron per proton mass. Then $\frac{4\pi cG}{\chi}$ in W/kg; compare with the Sun's $L/M$.</p>""",
    r"""<p>With the mass–luminosity law $L\propto M^3$, $L/M\propto M^2$ grows with mass, so above some mass a star would exceed the Eddington limit and
    blow its outer layers away. Scale from the Sun: $(M_{\max}/M_\odot)^2$ = ratio of the two $L/M$.</p>""",
]
EXPLAIN['3.6'] = [
    r"""<p><b>Standard candle principle:</b> a feature of the HR diagram with known absolute magnitude, found in the cluster at some apparent magnitude,
    gives the distance modulus $m-M$ for the whole cluster (all stars at the same distance).</p>""",
    r"""<p>$m-M=15.6-0.6=15.0$; invert $m-M=5\log_{10}(d/10\,\mathrm{pc})$: $d=10^{(m-M+5)/5}$ pc $=10^4$ pc.</p>""",
    r"""<p>Magnitudes are logarithmic: an error $\delta m$ gives a relative distance error $\approx0.46\,\delta m$. Dust dims stars (making them look farther),
    and metal-poor stars have a slightly different main sequence.</p>""",
]
EXPLAIN['3.7'] = [
    r"""<p>On the main sequence mass decides everything, so read $T_{\rm eff}$ off the HR diagram at the corresponding spectral type.</p>""",
    r"""<p>Wien: $\lambda_{\max}=2.9\times10^{-3}\,\mathrm{m\,K}/T$. Hot stars peak in the UV (blue-white), cool dwarfs in the infrared (red).</p>""",
    r"""<p>$L=4\pi R^2\sigma T^4$, so $T\propto(L/R^2)^{1/4}$. Crude power laws for $L(M)$ and $R(M)$ give poor $T$ at the extremes; the observed HR diagram
    is more reliable.</p>""",
]
# ---------------------------------------------------------------- Ch. 4
EXPLAIN['4.1'] = [
    r"""<p><b>Tunnelling through the Coulomb barrier.</b> WKB: inside a forbidden region the wave decays with local rate $\kappa(r)$, and the probability
    to get through is $e^{-2\int\kappa\,dr}$. The forbidden region runs from the nuclear surface $r_0$ to the classical turning point $r_1$,
    defined by $V(r_1)=E$. Writing $V=E\,r_1/r$ makes the integrand $\sqrt{r_1/r-1}$.</p>""",
    r"""<p><b>Why $r=r_1\cos^2\theta$:</b> it removes the square root, since $\frac{r_1}{r}-1=\frac1{\cos^2\theta}-1=\tan^2\theta$. With $dr=-2r_1\cos\theta\sin\theta\,d\theta$ the integrand
    becomes $\tan\theta\cdot2r_1\cos\theta\sin\theta=2r_1\sin^2\theta$, and $\int\sin^2=\frac12(\theta-\sin\theta\cos\theta)$.</p>""",
    r"""<p>$r_0\ll r_1$: the lower limit $r=r_0$ means $\cos\theta_0\approx0$, i.e. $\theta_0\to\pi/2$, and $\sin\theta_0\cos\theta_0\to0$. The integral is $\frac\pi2r_1$: the
    barrier is essentially the whole Coulomb tail.</p>""",
    r"""<p>Insert $r_1=\frac{Z_1Z_2e^2}{4\pi\epsilon_0E}$: the $E$'s combine to $1/\sqrt E$. The probability rises steeply with energy, which is why only the fastest
    nuclei fuse.</p>""",
]
EXPLAIN['4.2'] = [
    r"""<p><b>Gamow peak:</b> the rate is (number of nuclei with energy $E$) × (tunnelling probability): $e^{-E/kT}$ falls, $e^{-\sqrt{E_G/E}}$ rises. Their
    product has a sharp maximum. Set the derivative of the exponent to zero, find $E_0$, and insert it back: the exponent at the peak is
    $-3(E_G/4kT)^{1/3}$.</p>""",
    r"""<p>For two protons $Z_1=Z_2=1$ and the reduced mass is $m_p/2$. Collect all constants into a temperature $T_G$; its size ($10^9$ K) shows how
    much the Coulomb barrier suppresses fusion at solar temperatures ($10^7$ K).</p>""",
    r"""<p>Writing $T$ in units of $10^6$ K just pulls the number $3(T_G/10^6\,\mathrm K)^{1/3}=33.8$ out in front.</p>""",
]
EXPLAIN['4.3'] = [
    r"""<p>Compute the temperature factors once: $(10^6/T)^{1/3}$ and its square. The exponentials are where everything happens: the CNO exponent is
    4.5 times bigger (carbon and nitrogen have charge 6–7, a much higher barrier).</p>""",
    r"""<p>Insert into the two rate formulas. The CNO prefactor is enormous ($10^{20}$) because once nuclei get through, the reaction is fast; the
    barrier factor kills most of it at solar temperatures.</p>""",
    r"""<p>Rates are per kilogram; multiply by the density to get per cubic metre. The tiny power density shows the Sun is not a violent
    reactor; it is just very large and very well insulated.</p>""",
    r"""<p><b>Sensitivity</b> = logarithmic derivative of $\varepsilon$ with respect to $T$. Differentiating $e^{-a(10^6/T)^{1/3}}$ gives $\frac a3(10^6/T)^{1/3}$. A larger barrier
    means a steeper temperature dependence: CNO $\propto T^{20}$ wins as soon as the core is a bit hotter.</p>""",
]
EXPLAIN['4.4'] = [
    r"""<p>Sound speed in an ideal gas is like the thermal speed: $c_s=\sqrt{\gamma kT/\mu m_H}$. Inside the Sun $T$ ranges from $10^7$ K to a few thousand,
    so pick representative values.</p>""",
    r"""<p>Distance over speed. Using a mean sound speed of a few hundred km/s across $2R_\odot=1.4\times10^9$ m gives about an hour.</p>""",
    r"""<p>Sound waves trapped in the Sun ring at well-defined frequencies; their frequencies depend on $c_s(r)$ along their path. Measuring
    thousands of such modes maps the interior (helioseismology).</p>""",
]
EXPLAIN['4.5'] = [
    r"""<p><b>Mass flux through a sphere:</b> density × speed × area. Density = proton number density × proton mass ($10$ per cm$^3$ = $10^7$ per m$^3$), area
    $4\pi(1\,\mathrm{AU})^2$. In a steady wind the same flux passes every sphere, so measuring at the Earth suffices.</p>""",
    r"""<p>Multiply by the age in seconds ($4.5\times10^9\times3.15\times10^7$ s) and divide by $M_\odot$.</p>""",
    r"""<p>Radiation also carries mass: $\dot M=L/c^2$ (Einstein). Both are tiny fractions of the Sun's mass over its whole life.</p>""",
]
EXPLAIN['4.6'] = [
    r"""<p>A massive particle is slower than light; for $E\gg mc^2$ expand $v/c$: $1-v/c\approx\frac{m^2c^4}{2E^2}$. Travel time $d/v$ exceeds $d/c$ by
    $\frac dc(\frac cv-1)\approx\frac dc\frac{m^2c^4}{2E^2}$: low-energy neutrinos lag more.</p>""",
    r"""<p>The most delayed (6 MeV) minus the least delayed (39 MeV). If all neutrinos left together, this difference must fit inside the
    observed 12 s spread.</p>""",
    r"""<p>Solve for $mc^2$, keeping energies in MeV and converting to eV at the end. Because the burst itself lasts seconds, the bound is a
    rough upper limit, of order 10–20 eV.</p>""",
]
# ---------------------------------------------------------------- Ch. 5
EXPLAIN['5.1'] = [
    r"""<p><b>Pressure = momentum delivered to a wall per area per time.</b> Count the particles that hit: those moving towards the wall at angle
    $\theta$ arrive at the rate (density) × (normal speed $v\cos\theta$). Isotropy means the directions are spread evenly over the sphere: the
    fraction in $d\theta$ is the area of that ring of the unit sphere over $4\pi$, i.e. $\frac12\sin\theta\,d\theta$.</p>""",
    r"""<p>An elastic bounce flips the normal component of the momentum, $p\cos\theta\to-p\cos\theta$: the wall receives $2p\cos\theta$.</p>""",
    r"""<p>Multiply rate × momentum per hit and integrate over the incoming hemisphere: $\int_0^{\pi/2}\cos^2\theta\sin\theta\,d\theta=\frac13$; together with the factors
    $\frac12$ and $2$ this is the $\frac13$ of (5.1). No assumption about $v(p)$ was used, so it holds for photons and relativistic electrons
    too.</p>""",
    r"""<p>For a Maxwellian $v=p/m$, so $vp=p^2/m$ and the integral is $n\langle p^2\rangle/3m$. Equipartition $\langle p^2\rangle/2m=\frac32kT$ gives $P=nkT$: the ideal
    gas law from counting collisions.</p>""",
]
EXPLAIN['5.2'] = [
    r"""<p><b>Why $\sinh$:</b> the relativistic energy $\sqrt{p^2c^2+m^2c^4}$ becomes $mc^2\cosh\theta$ (because $\cosh^2-\sinh^2=1$), removing the square root,
    and $dp$ brings another $\cosh$, which cancels it. What is left is a power of $\sinh$.</p>""",
    r"""<p><b>Reduce powers to multiple angles</b> (like $\sin^2=\frac12(1-\cos2x)$): $\sinh^4\theta=\frac18(\cosh4\theta-4\cosh2\theta+3)$, then integrate term by term
    and express $\sinh2\theta$, $\sinh4\theta$ through $x=\sinh\theta_F$ with double-angle formulas.</p>""",
    r"""<p><b>Limits:</b> $x=p_F/m_ec$ small means non-relativistic electrons, large means ultra-relativistic. Expanding $f$ gives $x^5$ or $x^4$; with
    $p_F\propto n_e^{1/3}\propto\rho^{1/3}$ that is $\rho^{5/3}$ or $\rho^{4/3}$. The softer $\frac43$ law is what makes white dwarfs above a certain mass
    unstable.</p>""",
    r"""<p>Electrons become relativistic when $p_F\approx m_ec$, i.e. $x=1$; convert to $n_e$ with the given formula and to $\rho$ with two nucleons per
    electron ($\mu_e=2$).</p>""",
]
EXPLAIN['5.3'] = [
    r"""<p>Insert $p_F$ in terms of $n_e$, and $n_e=\rho/(\mu_em_H)$, into the non-relativistic pressure: all constants together form $K_1$ in $P=K_1\rho^{5/3}$.
    The $\mu_e^{-5/3}$ shows that pressure depends on electrons per mass.</p>""",
    r"""<p>Same with the relativistic formula ($p_F^4$, hence $\rho^{4/3}$). Note $K_2$ contains $c$ but not $m_e$: ultra-relativistic electrons do not care
    about their mass.</p>""",
    r"""<p><b>Each boundary</b> is where two pressure formulas give the same value: e.g. ideal gas $\frac{\rho kT}{\mu m_H}=K_1\rho^{5/3}$ gives $T\propto\rho^{2/3}$. Plotting
    these lines in the $\log T$–$\log\rho$ plane divides it into regions.</p>""",
    r"""<p>Pressures from different effects add, so whichever is largest dominates; equal values mark the crossover. Placing a known object (the
    solar centre) on the diagram is a good sanity check.</p>""",
]
EXPLAIN['5.4'] = [
    r"""<p>$n=0$ means $\theta^0=1$: integrate $\frac{d}{d\xi}(\xi^2\theta')=-\xi^2$ once, $\xi^2\theta'=-\xi^3/3+C$, with $C=0$ for a regular centre. Integrate again.
    The surface is where $\theta=0$.</p>""",
    r"""<p><b>Why this substitution:</b> $\frac1{\xi^2}\frac{d}{d\xi}\xi^2\frac{d}{d\xi}$ is the radial part of the 3D Laplacian, and for any function
    $\frac{1}{\xi}\frac{d^2}{d\xi^2}(\xi\theta)$ equals it. So $\chi=\xi\theta$ turns it into a 1D second derivative (same trick as $u=r\psi$ for the hydrogen atom).</p>""",
    r"""<p>For $n=1$ that is the harmonic oscillator equation $\chi''=-\chi$. $\cos\xi/\xi$ blows up at the centre, so only $\sin\xi/\xi$ survives. First zero
    at $\pi$.</p>""",
    r"""<p>Near the centre expand $\theta=1+a\xi^2$: the left side gives $6a$, the right side $-1$, so $a=-\frac16$ for every $n$. A quick check of any
    solution.</p>""",
]
EXPLAIN['5.5'] = [
    r"""<p>Two expressions for the same pressure: gas ($\beta P$) and radiation ($(1-\beta)P$). Solve the gas one for $T$ and insert it into the radiation
    one: $P^3\propto\rho^4$ with constant $\beta$. A polytrope with $n=3$ ($P\propto\rho^{1+1/n}$).</p>""",
    r"""<p>For $n=3$ the polytrope mass formula has no $\rho_c$ left: $M$ is fixed by $K$ alone. Invert to get $K$ as a function of $M$; equating with
    the $K(\beta)$ from step 1 links $\beta$ to $M$.</p>""",
    r"""<p>Solve $\frac{1-\beta}{\beta^4}=CM^2$ numerically for each mass (it is a quartic in $\beta$; iterate or bisect between 0 and 1).</p>""",
    r"""<p>The left side grows as $\beta$ falls. More mass, larger right side, smaller $\beta$: radiation takes over the support of massive stars,
    consistent with the Eddington limit.</p>""",
]
EXPLAIN['5.6'] = [
    r"""<p>A second-order equation is solved numerically as a system of first-order ones: mass inside $r$ and pressure. The equation of state
    links $P$ and $\rho$, so $d\rho/dr=(dP/dr)/(dP/d\rho)$.</p>""",
    r"""<p><b>Shooting outward:</b> start just off the centre (where $M_r\approx\frac43\pi r^3\rho_c$, avoiding the $1/r^2$ singularity), step outward, and stop where
    the density reaches zero: that is the surface. Each $\rho_c$ gives one star, i.e. one point $(M,R)$.</p>""",
    r"""<p>Denser white dwarfs are smaller <i>and</i> heavier. As the electrons become relativistic the equation of state softens to $\rho^{4/3}$,
    and an $n=3$ polytrope can only have one mass: the curve approaches $M_{\rm Ch}$ as $R\to0$. Above it no equilibrium exists.</p>""",
]
EXPLAIN['5.7'] = [
    r"""<p>Angular momentum $I\Omega$ is conserved; with the same internal structure $I\propto MR^2$ and $M$ fixed, $\Omega\propto R^{-2}$, and the period
    $P=2\pi/\Omega\propto R^2$. Shrinking the radius 100 times speeds up the spin $10^4$ times, like a pirouetting skater.</p>""",
    r"""<p>$(R_{\rm WD}/R_\odot)^2\approx8.5\times10^{-5}$; $27$ days is $2.3\times10^6$ s.</p>""",
    r"""<p>$(10\,\mathrm{km}/R_\odot)^2\approx2\times10^{-10}$: sub-millisecond. That is about the fastest a neutron star can spin before the equator would fly
    apart, which shows angular momentum must be lost during collapse.</p>""",
]
EXPLAIN['5.8'] = [
    r"""<p>$P/\dot P$ is the characteristic age; convert years to seconds to get the dimensionless $\dot P$. $I=\frac25MR^2$ assumes a uniform sphere.</p>""",
    r"""<p>Rotational energy $\frac12I\Omega^2$ with $\Omega=2\pi/P$: $\dot E=I\Omega\dot\Omega$ and $\dot\Omega=-2\pi\dot P/P^2$, so $|\dot E|=4\pi^2I\dot P/P^3$. The nebula's
    total emission matches this: the pulsar powers it.</p>""",
    r"""<p>A rotating magnetic dipole radiates $\propto B^2\Omega^4$ (5.35). Equate to the measured spin-down loss and solve for $B$: about $10^8$ T,
    a trillion times the Earth's field (flux conservation during collapse amplifies it).</p>""",
]
EXPLAIN['5.9'] = [
    r"""<p>The polytrope formulas contain $\rho_c$ twice (in $\alpha$ and in $M$); eliminate it between them. For $n=\frac32$ what remains is $R\propto M^{-1/3}$:
    heavier white dwarfs are smaller.</p>""",
    r"""<p>A brown dwarf is mostly hydrogen, so more electrons per nucleon: $\mu_e=2/(1+X)$ instead of 2. Since $K_1\propto\mu_e^{-5/3}$ and $R\propto K_1M^{-1/3}$,
    it is larger for its mass than a white dwarf.</p>""",
    r"""<p>Polytrope binding energy $\frac{3}{5-n}\frac{GM^2}{R}$ ($\frac67$ for $n=\frac32$); the virial theorem keeps half of it as internal energy.</p>""",
    r"""<p>Share that heat among $M/(\mu m_H)$ particles with $\frac32kT$ each. The answer stays below the $10^7$ K needed for hydrogen fusion: electron
    degeneracy stops the contraction first, so such an object never becomes a star.</p>""",
]
# ---------------------------------------------------------------- Ch. 6
EXPLAIN['6.1'] = [
    r"""<p>A shell of radius $r$ and thickness $dr$ inside solid angle $\omega$ has volume $\omega r^2dr$; times the number density.</p>""",
    r"""<p>A star at distance $r$ appears with magnitude $m$ only if its absolute magnitude is $M=m-5\log_{10}r+5-a(r)$; the luminosity function gives the
    fraction of stars with that $M$. Add up all shells.</p>""",
    r"""<p><b>Delta functions of a function:</b> $\delta(g(r))=\delta(r-r_0)/|g'(r_0)|$. Here $g'=-\frac{5}{r\ln10}$. Then $A\propto r_0^3$ and $r_0\propto10^{m/5}$, so
    $A\propto10^{3m/5}=10^{0.6m}$. Each step fainter by one magnitude reaches $10^{0.2}$ times farther, i.e. $10^{0.6}$ times more volume.</p>""",
    r"""<p>If counts grow more slowly than $10^{0.6m}$, either the density falls off with distance or dust dims the distant stars: counts probe the
    structure of the Galaxy.</p>""",
]
EXPLAIN['6.2'] = [
    r"""<p>Magnitudes to flux: $F/F_0=10^{-0.4\Delta m}$, and $10^y=e^{y\ln10}$. With $\Delta m=1.5r$ that is $e^{-0.6\ln10\,r}$. Multiply by the usual $1/r^2$.</p>""",
    r"""<p>$\alpha=0.6\ln10=1.38$ per kpc; convert kpc to m.</p>""",
    r"""<p>$\alpha r$ is the optical depth. Toward the Galactic centre it is ~11: a factor $e^{-11}$, so the centre is only seen in infrared and radio,
    where dust absorbs much less.</p>""",
]
EXPLAIN['6.3'] = [
    r"""<p>Kepler region: all mass inside, so $\Theta^2/R=GM/R^2$, $\Theta\propto R^{-1/2}$ and $\omega=\Theta/R\propto R^{-3/2}$. Differentiating a power law:
    $\frac{d\omega}{dR}=-\frac32\frac\omega R$.</p>""",
    r"""<p>Insert into the definitions: $A=-\frac12R(-\frac32\frac\omega R)=\frac34\omega$, $B=A-\omega$.</p>""",
    r"""<p>Plug into $\kappa^2=-4B\omega_0$ ($A-B=\omega_0$).</p>""",
    r"""<p><b>Closed orbits:</b> a star slightly off a circular orbit oscillates in radius with $\kappa$ while circling with $\omega$. If they are equal, the
    oscillation repeats exactly each orbit: an ellipse. In a flat rotation curve $\kappa\ne\omega$, so the ellipse precesses and the orbit is a rosette.</p>""",
]
EXPLAIN['6.4'] = [
    r"""<p><b>Gauss's law for a slab:</b> a box (pillbox) from $-z$ to $z$ encloses mass $\rho\cdot2z$ per area; by symmetry the field points to the mid-plane
    and has the same size on both faces. So $2g\,A=4\pi G\rho\cdot2zA$: $g=4\pi G\rho z$, growing linearly like a spring.</p>""",
    r"""<p>A restoring force proportional to the displacement is a harmonic oscillator: $\omega_z^2=4\pi G\rho$, the "spring constant per mass".</p>""",
    r"""<p>Convert atoms per m$^3$ to kg/m$^3$ ($\times1.67\times10^{-27}$). $P=2\pi/\omega_z$; for the orbit: circumference over speed.</p>""",
    r"""<p>The vertical period is shorter than the orbital one, so stars bob up and down through the disk a few times per orbit.</p>""",
]
EXPLAIN['6.5'] = [
    r"""<p>The two formulas describe the same absorption in two languages. §2.7 ignored stimulated emission: fine when $h\nu\gg kT$ because the
    Boltzmann factor $e^{-h\nu/kT}$ is tiny and almost all atoms are in the lower level.</p>""",
    r"""<p>Set the two expressions for $\alpha_\nu$ equal; $n$, $\phi$ and $c$ cancel, leaving the stated relation.</p>""",
    r"""<p>For radio lines ($h\nu\ll kT$) the bracket $1-e^{-h\nu/kT}\approx h\nu/kT$ is small: stimulated emission nearly cancels absorption, and the full
    formula is needed.</p>""",
]
EXPLAIN['6.6'] = [
    r"""<p><b>Statistical equilibrium:</b> for each level, the rate in = the rate out. Level 2 is filled only by collisions from level 1 and empties by
    spontaneous decay and collisions back to 1. The same for level 3, separately, because 2 and 3 do not connect.</p>""",
    r"""<p>Divide the two balances: $n_1$ and $n_e$ cancel. Detailed balance turns the upward collision rates into downward ones times
    $\frac{g_u}{g_l}e^{-E/kT}$, which brings in the Boltzmann factor between 2 and 3.</p>""",
    r"""<p>At high density collisions dominate over spontaneous emission, the $A$ terms drop out, and the ratio is the Boltzmann one: the gas is in
    LTE.</p>""",
    r"""<p>Inversion needs the correction factor to beat the Boltzmann factor: level 2 must empty much faster (large $A_{21}$) than level 3, so atoms
    pile up in 3. With more atoms (per state) in 3 than in 2, radiation at the 3→2 frequency is amplified instead of absorbed: a maser.</p>""",
]
EXPLAIN['6.7'] = [
    r"""<p>A rigid rotor has only rotational kinetic energy $L^2/2I$; quantising $L^2=\hbar^2J(J+1)$ gives the levels.</p>""",
    r"""<p>Energy difference of neighbours: $J(J+1)-(J-1)J=2J$, so $\Delta E=\frac{\hbar^2}{I}J$ and $\nu=\Delta E/h=\frac{\hbar J}{2\pi I}$. Lines at $J$ times a basic
    frequency: the 115 GHz spacing gives $I$.</p>""",
    r"""<p>For two masses, $I=m_{\rm red}r^2$ with the reduced mass $\frac{m_1m_2}{m_1+m_2}$; solve for $r$. About 1 Å, a typical chemical bond.</p>""",
]
# ---------------------------------------------------------------- Ch. 7
EXPLAIN['7.1'] = [
    r"""<p>If $f$ depends on $\mathbf x$ and $\mathbf v$ only through $K$, the chain rule gives $\nabla f=f'(K)\nabla K$ and $\partial_{\mathbf v}f=f'(K)\partial_{\mathbf v}K$. Factor out
    $f'(K)$.</p>""",
    r"""<p>Along an orbit $\dot{\mathbf x}=\mathbf v$ and $\dot{\mathbf v}=-\nabla\Phi$, so the bracket is exactly $\frac{dK}{dt}=\dot{\mathbf x}\cdot\nabla K+\dot{\mathbf v}\cdot\partial_{\mathbf v}K$. A constant of
    motion has $dK/dt=0$.</p>""",
    r"""<p>So building equilibrium galaxy or cluster models reduces to choosing a function of $E$ (and $L$). Which integrals you use decides the
    symmetry of the model.</p>""",
]
EXPLAIN['7.2'] = [
    r"""<p>In cylindrical coordinates the velocity components change along an orbit even without forces, because the basis vectors rotate. These
    "fictitious" accelerations are $\dot\Pi\ni\Theta^2/r$ (centrifugal) and $\dot\Theta\ni-\Pi\Theta/r$ (Coriolis); they appear as coefficients of the velocity
    derivatives.</p>""",
    r"""<p>Integrating $f$ over velocities gives $n$; integrating $\Pi f$ gives $n\langle\Pi\rangle$. Space and time derivatives can be pulled out of the velocity
    integral.</p>""",
    r"""<p><b>By parts in velocity space:</b> $\int g\,\partial_\Pi f\,d\Pi=-\int f\,\partial_\Pi g\,d\Pi$ (no boundary term, $f\to0$). If $g$ does not depend on $\Pi$, the result is 0.
    The Coriolis coefficient $\Pi\Theta/r$ depends on $\Theta$, and $\partial_\Theta(\Pi\Theta/r)=\Pi/r$ leaves the extra term $n\langle\Pi\rangle/r$.</p>""",
    r"""<p>In cylindrical coordinates the divergence has $\frac1r\partial_r(r\,\cdot)$, which by the product rule contains exactly that extra $\frac{n\langle\Pi\rangle}{r}$: it is
    just the continuity equation.</p>""",
]
EXPLAIN['7.3'] = [
    r"""<p><b>Moments:</b> integrate the equation over all velocities. The force term is a total derivative in $v$, which integrates to zero; what is
    left is mass conservation.</p>""",
    r"""<p>Multiply by $mv_j$ first. Now by parts the force term gives $-F_j\int f=-nF_j$ (the derivative hits $v_j$). This is momentum balance.</p>""",
    r"""<p>Split velocities into mean + random: $\langle v_iv_j\rangle=\langle v_i\rangle\langle v_j\rangle+$ dispersion. The dispersion part is the pressure tensor. Subtracting
    $\langle v_j\rangle$ times the continuity equation removes the time derivative of the density, leaving "mass × acceleration = forces".</p>""",
    r"""<p>For a gas, collisions make $P_{ij}$ isotropic and an equation of state closes the system. Stars never collide, so the dispersion can be
    different in different directions and there is no equation of state: one more moment always appears (the closure problem).</p>""",
]
EXPLAIN['7.4'] = [
    r"""<p>Only stars with $E<0$ are bound, so integrate up to the escape speed $v_e$. The $e^{-\beta v^2/2}$ part is a truncated Gaussian integral
    (that is where erf comes from), the $-1$ part is just the volume of a velocity sphere.</p>""",
    r"""<p>Poisson's equation with the density as a function of the potential gives one ordinary differential equation for $W(r)$. Choosing units
    built from the central density makes it dimensionless, with $W_0$ the only parameter.</p>""",
    r"""<p>Integrate outward from the centre (regular start $W'=0$); where $W$ hits 0 the density is zero: the edge of the cluster (tidal radius).</p>""",
    r"""<p>The isothermal sphere has stars of all energies and falls off only like $r^{-2}$ (infinite mass). Removing the unbound stars gives a
    finite cluster, which is what tidal fields of the Galaxy do to real globular clusters.</p>""",
]
# ---------------------------------------------------------------- Ch. 8
EXPLAIN['8.1'] = [
    r"""<p>Steady: $\partial_t\mathbf v=0$. The vector identity rewrites the advective term as the gradient of the kinetic energy per mass plus a term with the
    vorticity $\boldsymbol\omega=\nabla\times\mathbf v$.</p>""",
    r"""<p>Dot with $\mathbf v$: $\mathbf v\times\boldsymbol\omega$ is perpendicular to $\mathbf v$ and drops out. Barotropic ($p$ a function of $\rho$ only) lets $\frac{\nabla p}{\rho}$ be written as the
    gradient of a function. Everything is now $\mathbf v\cdot\nabla(\dots)=0$: the derivative along the flow vanishes.</p>""",
    r"""<p>So the quantity is conserved along each streamline. It is energy conservation per unit mass: kinetic + enthalpy-like pressure term +
    potential.</p>""",
]
EXPLAIN['8.2'] = [
    r"""<p>Cross product with $\hat e_x\times\hat e_x=0$ and $\hat e_x\times\hat e_y=\hat e_z$.</p>""",
    r"""<p>The curl of $F(y)\hat e_z$ has only an $x$ component, $\partial_yF$. Here $F=v_0B_0e^{-y^2}$, so $F'=-2yv_0B_0e^{-y^2}$.</p>""",
    r"""<p>The right side does not depend on time (it involves only $B_y$, which stays $B_0$), so integrate trivially: $B_x$ grows linearly in $t$.</p>""",
    r"""<p>A field line follows $\frac{dx}{dy}=\frac{B_x}{B_y}$; integrating gives the displacement $v_0te^{-y^2}$, exactly how far the fluid at height $y$ has moved.
    The field lines are carried with the flow (frozen in), and stretching them builds up $B_x$: the basic dynamo ingredient.</p>""",
]
EXPLAIN['8.3'] = [
    r"""<p><b>Ampère with a circle</b> of radius $r$ inside the column: by symmetry $B_\theta$ is the same all around, so the left side is $2\pi rB_\theta$, and
    the enclosed current is $j\pi r^2$. The field grows linearly inside (like $g$ inside a uniform planet).</p>""",
    r"""<p><b>The Lorentz force in two parts:</b> a magnetic pressure gradient $-\nabla(B^2/2\mu_0)$ and a magnetic tension $(\mathbf B\cdot\nabla)\mathbf B/\mu_0$. For circular field
    lines the tension points inward with size $B^2/(\mu_0r)$, like a rubber band around a bundle. Balance with $-\nabla P$ gives the equation.</p>""",
    r"""<p>Insert $B_\theta=\mu_0jr/2$: both magnetic terms equal $\mu_0j^2r/4$, so $dP/dr=-\mu_0j^2r/2$. Integrate from the surface ($P=0$) inward.</p>""",
    r"""<p>The current's own field squeezes the plasma; the pressure peaks on the axis. This is the "pinch" used in fusion experiments, and its
    instabilities are why tokamaks need an extra axial field.</p>""",
]
EXPLAIN['8.4'] = [
    r"""<p><b>Linearise:</b> keep only terms first order in the small $\mathbf v$ and $\mathbf b$. In the induction equation $\mathbf v\times B_0\hat e_z$ has a $y$ component
    $-v_xB_0$, and its curl gives $\partial_tb_x=B_0\partial_zv_x$. In the force, only $\nabla\times\mathbf b$ crossed with the background $B_0$ survives.</p>""",
    r"""<p>Differentiate the momentum equation in time and insert the induction equation for $\partial_tb_x$: a wave equation $\partial_t^2v=v_A^2\partial_z^2v$. Speed$^2$ =
    tension/(mass density), like a string.</p>""",
    r"""<p>Plug in numbers: $v_A=B/\sqrt{\mu_0\rho}$ with $\rho=nm_H$. Alfvén waves carry energy along field lines (e.g. heating the solar corona).</p>""",
]
EXPLAIN['8.5'] = [
    r"""<p>The tube is in pressure balance with its surroundings, but part of its inside pressure is magnetic, so the gas pressure inside is lower.
    At the same temperature lower gas pressure means lower density: the tube is lighter than its surroundings.</p>""",
    r"""<p>Archimedes: buoyant force = (density deficit) × $g$ × volume ($\pi a^2$ per unit length). Use $\rho g/P=1/\Lambda$.</p>""",
    r"""<p>Terminal velocity: it accelerates until drag equals buoyancy. Solve for $v$; $B^2/\mu_0\rho$ is $v_A^2$.</p>""",
    r"""<p>Strong fields produced deep inside rise to the surface within months, which is how sunspots appear.</p>""",
]
EXPLAIN['8.6'] = [
    r"""<p><b>Reflection is simple in the reflector's frame:</b> energy unchanged, momentum reversed. So transform into that frame (gain a Doppler
    factor $\gamma(1+\beta)$), reflect, transform back (another $\gamma(1+\beta)$). With $\gamma^2(1-\beta^2)=1$ the product is $\frac{1+\beta}{1-\beta}$.</p>""",
    r"""<p>Same with $\beta\to-\beta$: a loss.</p>""",
    r"""<p>A particle meets approaching reflectors more often: relative speed $c+U$ versus $c-U$. So gains are slightly more frequent than losses.</p>""",
    r"""<p>Average the relative changes weighted by these probabilities: first-order terms in $\beta$ cancel, a $\beta^2$ remains. A slow, net energy
    gain: second-order Fermi acceleration of cosmic rays.</p>""",
]
EXPLAIN['8.7'] = [
    r"""<p>Two fluids, each pushed by the same electric field (opposite charge signs), each obeying continuity; Gauss's law ties the field to the net
    charge disturbance. Linearised: products of small quantities dropped.</p>""",
    r"""<p>Two time derivatives of Gauss's law turn density changes into velocity divergences (continuity), and those into the field (momentum
    equations). Everything ends up proportional to $\nabla\cdot\mathbf E$ itself: an oscillator equation.</p>""",
    r"""<p>The ion term has $1/m_i$ instead of $1/m_e$: heavy ions barely move, so they change the frequency by a factor $\sqrt{1+Zm_e/m_i}$, a 0.03%
    correction for hydrogen.</p>""",
]
EXPLAIN['8.8'] = [
    r"""<p>Differentiate the dispersion relation: $2\omega\,d\omega=2c^2k\,dk$, so $d\omega/dk=c^2k/\omega$; express $k$ through $\omega$ with the same relation. Below
    $\omega_p$ there is no real $k$: radio waves below the plasma frequency cannot propagate.</p>""",
    r"""<p>Expand $(1-\epsilon)^{-1/2}\approx1+\frac\epsilon2$ for small $\epsilon=\omega_p^2/\omega^2$, and write $\omega_p^2\propto n_e$.</p>""",
    r"""<p>Differentiate with respect to $\omega$: $\frac{d}{d\omega}\omega^{-2}=-2\omega^{-3}$. Low frequencies arrive later. Measuring the sweep of a pulse across
    frequencies gives $\int n_e\,ds$, and with a model of the Galaxy's electron density, the distance.</p>""",
]
# ---------------------------------------------------------------- Ch. 9
EXPLAIN['9.1'] = [
    r"""<p><b>Total light</b> of a round galaxy = surface brightness integrated over rings of area $2\pi r\,dr$. The awkward $r^{1/4}$ suggests $u=(r/r_e)^{1/4}$:
    $r=r_eu^4$, and $r\,dr=4r_e^2u^7du$.</p>""",
    r"""<p>$\int_0^\infty u^7e^{-bu}du=7!/b^8$ (a Gamma function). The rest is arithmetic: $8e^{7.67}\cdot5040/7.67^8\approx7.2$.</p>""",
    r"""<p>Up to $r_e$ means $u\le1$: the same integral cut off at 1 (an incomplete Gamma function). The constant 7.67 was chosen precisely so that
    this is half: $r_e$ is the half-light radius by construction.</p>""",
]
EXPLAIN['9.2'] = [
    r"""<p>A power law $\sigma\propto L^\alpha$ becomes $\log\sigma=\alpha\log L+$ const: a straight line on a log–log plot. Magnitudes are already
    logarithmic: $\log L=-0.4M+$ const.</p>""",
    r"""<p>Slope = change in $\log\sigma$ over change in $\log L$; reading two well separated points on the band is enough.</p>""",
    r"""<p>Virial: $\sigma^2\sim GM/R$. If $M\propto L$ and all ellipticals have the same surface brightness, $L\propto R^2$, then $\sigma^4\propto M^2/R^2\propto L$.</p>""",
]
EXPLAIN['9.3'] = [
    r"""<p>Differentiate the quotient: numerator of the derivative $\cos\theta(1-\beta\cos\theta)-\sin\theta\cdot\beta\sin\theta=\cos\theta-\beta$; zero at $\cos\theta=\beta$.</p>""",
    r"""<p>Insert: $\sin\theta=\sqrt{1-\beta^2}=1/\gamma$ and $1-\beta^2=1/\gamma^2$, so $v_{\rm app}=v\frac{1/\gamma}{1/\gamma^2}=\beta\gamma c$.</p>""",
    r"""<p>The blob moves almost toward us, so light emitted later has a shorter way to travel. The time between two observed positions is
    compressed, and the apparent speed (sideways distance / observed time) can exceed $c$.</p>""",
]
EXPLAIN['9.4'] = [
    r"""<p>An electron spirals around the field at the gyrofrequency; relativistic beaming concentrates its emission at $\sim\gamma^2$ times that. Invert
    for $\gamma$ at radio frequencies.</p>""",
    r"""<p>Cooling time = energy / power lost. Synchrotron power grows with $\gamma^2$, energy with $\gamma$, so faster electrons cool faster.</p>""",
    r"""<p>Distance / speed, in years.</p>""",
    r"""<p>Compare the two times. Inverse Compton scattering off CMB photons acts like an extra magnetic field with energy density $U_{\rm CMB}$ and
    must be added to the losses.</p>""",
]
EXPLAIN['9.5'] = [
    r"""<p>Crossing time = size / typical speed; convert Mpc and km/s to s, then to years.</p>""",
    r"""<p>Relaxation (exchange of energy by individual encounters) takes about $N$ crossings (more precisely $N/(8\ln N)$, still enormous).</p>""",
    r"""<p><b>Relaxed vs virialised:</b> relaxed means individual galaxies have exchanged energy (thermalised); virialised only means the system as a whole
    is in a steady state, where the virial theorem $2K+U=0$ holds. Steady state needs only a few crossing times (violent relaxation).</p>""",
]
# ---------------------------------------------------------------- Ch. 10
EXPLAIN['10.1'] = [
    r"""<p>Track every quantity: what is measured directly (angles, redshifts, velocity dispersions) carries no $h$; anything turned into a distance via
    Hubble's law, $d=cz/H_0$, carries $h^{-1}$.</p>""",
    r"""<p>Mass density = number per volume × mass each: $h^3\cdot h^{-1}=h^2$.</p>""",
    r"""<p>The critical density also scales as $H_0^2\propto h^2$, so the ratio does not depend on $h$.</p>""",
]
EXPLAIN['10.2'] = [
    r"""<p>For matter only and flat space, $\dot a^2\propto1/a$, so $a\propto t^{2/3}$. Then $t\propto a^{3/2}=(1+z)^{-3/2}$ relative to today.</p>""",
    r"""<p>Non-flat cases: no simple power law, so evaluate the integral numerically (or with the parametric cycloid solutions). Compare the
    fraction with the flat case.</p>""",
    r"""<p>Same for the closed model.</p>""",
    r"""<p>The ratio $t/t_0$ is insensitive to $\Omega$ because the early Universe is matter dominated in all cases; curvature only matters late.</p>""",
]
EXPLAIN['10.3'] = [
    r"""<p>Friedmann: $H^2=H_0^2(\Omega_{M,0}a^{-3}+\Omega_{k,0}a^{-2})$ with $\Omega_{k,0}=1-\Omega_{M,0}$. Multiply by $a^2$ for $\dot a^2$, take the root; time = $\int da/\dot a$.</p>""",
    r"""<p>Numerical integration for each $\Omega$; check the flat case $\int_0^1\sqrt a\,da=\frac23$.</p>""",
    r"""<p>Multiply by the Hubble time $1/H_0$. A denser Universe decelerated more, so it reached today's expansion rate in less time: it is younger.</p>""",
]
EXPLAIN['10.4'] = [
    r"""<p>Radiation density $\propto a^{-4}$ (number $\propto a^{-3}$, each photon's energy redshifts $\propto a^{-1}$). Multiplying $\dot a^2=C/a^2-kc^2$ by $a^2$ gives
    $(a\dot a)^2$, and $a\dot a=\frac12\frac{d}{dt}a^2$: hence $u=a^2$.</p>""",
    r"""<p>$\dot u=2\sqrt C$: linear growth, $a\propto\sqrt t$.</p>""",
    r"""<p>Separate variables: $\frac{du}{2\sqrt{C-kc^2u}}=dt$ integrates to a square root, which you then square. Closed: grows, stops, recollapses. Open:
    eventually $a\approx ct$.</p>""",
    r"""<p>Near $t=0$ the radiation term $C/a^2$ dominates the constant curvature term: all models look the same early on.</p>""",
]
EXPLAIN['10.5'] = [
    r"""<p>Expansion stretches every length by $a$, so volumes grow like $a^3$ and $\frac{\dot V}{V}=3\frac{\dot a}{a}=3H$. Keeping the density constant requires new
    particles at that rate.</p>""",
    r"""<p>Density from $\Omega$ and $h$, divided by the hydrogen mass gives atoms per m$^3$; multiply by $3H_0$, by $10^9$ m$^3$ and by one year in
    seconds.</p>""",
    r"""<p>An undetectably small rate, so the idea could not be ruled out directly; the CMB did it.</p>""",
]
# ---------------------------------------------------------------- Ch. 11
EXPLAIN['11.1'] = [
    r"""<p><b>Expand the Bose factor</b> as a geometric series in $e^{-x}$; each term integrates to a Gamma function, $\int x^ne^{-kx}dx=n!/k^{n+1}$, and the sum
    over $k$ is a zeta function.</p>""",
    r"""<p>Substitute $x=pc/kT$ in (11.7) and (11.8) to pull out $T^3$ and $T^4$, then insert the integrals.</p>""",
    r"""<p>Algebra with common denominators: $\frac{1}{e^x-1}-\frac{1}{e^x+1}=\frac{2}{e^{2x}-1}$. Substituting $y=2x$ in the last integral gives $2^{-(n+1)}$ times the
    Bose integral.</p>""",
    r"""<p>Fermions: $I^+=I^--2^{-n}I^-$. Pauli exclusion makes fermions slightly less numerous and energetic than bosons at the same $T$: the
    famous $\frac34$ and $\frac78$.</p>""",
]
EXPLAIN['11.2'] = [
    r"""<p>In equilibrium neutrons and protons follow Boltzmann with their mass difference; when the reactions stop, the ratio is frozen at the
    value at that temperature. A lower freeze-out temperature leaves fewer neutrons.</p>""",
    r"""<p>All surviving neutrons end up in helium (2 n + 2 p): the helium mass fraction is twice the neutron fraction.</p>""",
    r"""<p>The ratio depends exponentially on $T_{\rm freeze}$, and $T_{\rm freeze}$ depends on how fast the Universe expanded (more neutrino species = faster
    expansion = earlier freeze-out = more helium).</p>""",
]
EXPLAIN['11.3'] = [
    r"""<p>A chemical potential shifts the occupation numbers; with $\mu=0$ particles and antiparticles have identical distributions. Reactions in
    equilibrium conserve $\sum\mu$: photons have $\mu=0$, so $\mu_++\mu_-=0$.</p>""",
    r"""<p>The universe is electrically neutral: the excess of electrons must equal the number of protons, which is $\eta$ times the photon number.</p>""",
    r"""<p>For tiny $\mu$ keep only the linear term, then solve for $\mu/kT$. Both sides scale as $T^3$, so $\mu/kT$ stays constant as the Universe cools
    (while the electrons are relativistic).</p>""",
]
EXPLAIN['11.4'] = [
    r"""<p>Scale today's baryon density by $(1+z)^3$ and today's CMB temperature by $(1+z)$, then ideal gas law.</p>""",
    r"""<p>Saha at fixed density (as in Ex. 2.3), now with a much lower density, so ionisation persists to lower temperature only because of the
    huge number of photons per atom.</p>""",
    r"""<p>Even at $kT\approx0.3$ eV, far below 13.6 eV, the rare high-energy photons in the Wien tail ($10^9$ photons per baryon) keep hydrogen ionised.
    Recombination happens only when even that tail is too weak.</p>""",
]
EXPLAIN['11.5'] = [
    r"""<p>The SZ optical depth gives $n_e$ times the size; solve for $n_e$ and insert into the X-ray emissivity ($\propto n_e^2$).</p>""",
    r"""<p>Volume of a sphere times emissivity, spread over $4\pi D^2$.</p>""",
    r"""<p>The physical radius is the angular radius times the distance. One factor of $D$ remains: solve for it.</p>""",
    r"""<p>Two observables with different dependence on density ($n_e$ vs $n_e^2$) let you solve for both the density and the size; size plus angle
    gives distance directly.</p>""",
]
EXPLAIN['11.6'] = [
    r"""<p>A shell at radius $a$ feels only the mass $M$ inside it (Newton's shell theorem works for a uniform expanding ball). Displace it slightly to
    $a+l$ and Taylor-expand $1/(a+l)^2\approx\frac1{a^2}(1-\frac{2l}{a})$; the zeroth order is the background equation and cancels. Then $M=\frac43\pi\rho a^3$.</p>""",
    r"""<p>A shell pushed out by $l$ dilutes the density inside by $\delta=-3l/a$ (volume $\propto$ radius cubed). Express $l$ through $\delta$ and differentiate the
    product twice (product rule gives three terms); use the background equation $\ddot a=-\frac{4\pi G}{3}\rho a$ to replace $\ddot a$.</p>""",
    r"""<p>For the critical (flat, matter-only) background $a\propto t^{2/3}$, so $\dot a/a=\frac{2}{3t}$ and the Friedmann equation fixes $\rho$ in terms of $t$.</p>""",
    r"""<p><b>Power-law ansatz</b> $\delta=t^s$ turns the equation into a quadratic for $s$. The growing solution $t^{2/3}$ is proportional to $a$: perturbations grow only as
    fast as the Universe expands, a slow growth that baryons alone cannot achieve from the tiny CMB fluctuations; dark matter starts earlier.</p>""",
]
# ---------------------------------------------------------------- Ch. 12
EXPLAIN['12.1'] = [
    r"""<p><b>Recipe:</b> read $g_{ik}$ off $ds^2$, compute Christoffels from derivatives of $g$, then curvature. For the plane in polar coordinates the
    Christoffels are not zero (the coordinate lines curve), but the curvature comes out zero: curved coordinates on a flat space.</p>""",
    r"""<p>Only $g_{\phi\phi}=a^2\sin^2\theta$ depends on a coordinate, so only Christoffels involving $\partial_\theta g_{\phi\phi}$ survive. In 2D there is just one independent
    curvature component; the result $R=2/a^2$ is the same at every point, as a sphere must be.</p>""",
    r"""<p>Replace $\sin\to\sinh$: derivatives differ by a sign ($\sinh''=+\sinh$ while $\sin''=-\sin$), which flips the sign of the curvature.</p>""",
    r"""<p>Gaussian curvature $K=R/2$: positive (sphere, triangles add to more than $180^\circ$), zero (plane), negative (saddle). These are the 2D
    versions of closed, flat and open universes.</p>""",
]
EXPLAIN['12.2'] = [
    r"""<p>$A^i{}_{;l}$ is a tensor with one upper and one lower index, so the second covariant derivative needs the formula for such a tensor: one $+\Gamma$
    for the upper index, one $-\Gamma$ for the lower one.</p>""",
    r"""<p><b>Antisymmetrise:</b> anything symmetric in $k$ and $l$ cancels in the difference: ordinary second derivatives commute, and $\Gamma^n_{lk}$ is
    symmetric. The terms with $\partial A$ cancel between the two orders. Only terms with $A$ itself (no derivative) survive.</p>""",
    r"""<p>Compare the leftover coefficient with the book's definition of the Riemann tensor; it matches up to a sign. Interpretation: transporting a
    vector around a small loop changes it exactly when space is curved.</p>""",
]
EXPLAIN['12.3'] = [
    r"""<p>Lowering the index of $\partial\Gamma$ produces a correction from $\partial g$; this is where the $\Gamma\Gamma$ terms get reshuffled. The second derivatives of $g$
    come from differentiating the definition of the lowered Christoffel symbol.</p>""",
    r"""<p><b>Easiest in a locally flat (geodesic) frame</b> where all $\Gamma=0$ at the point: only the four $\partial\partial g$ terms remain, and the symmetries can be read off
    by swapping indices. Since they are tensor equations, they hold in every frame.</p>""",
    r"""<p>Use the symmetries to move the contracted indices into the position where the contraction defines the Ricci tensor, then use $R_{lk}=R_{kl}$.</p>""",
]
EXPLAIN['12.4'] = [
    r"""<p>Write the geodesic equation for both curves and subtract; keep only terms linear in $\delta x$. The Christoffel at the shifted point is
    Taylor-expanded: $\Gamma(x+\delta x)\approx\Gamma(x)+\partial_m\Gamma\,\delta x^m$.</p>""",
    r"""<p>$\delta\ddot x$ is not a tensor; the covariant derivative along the curve is. Express $\delta\ddot x$ through $D^2\delta x/Ds^2$ plus correction terms.</p>""",
    r"""<p>After cancellations the coefficient of $\delta x\,\dot x\dot x$ is the Riemann tensor. Meaning: neighbouring free particles accelerate relative to each
    other only if spacetime is curved; this relative acceleration is the tidal force.</p>""",
]
EXPLAIN['12.5'] = [
    r"""<p>The $\theta$-component of the geodesic equation with the sphere's Christoffels.</p>""",
    r"""<p>A latitude circle has $\theta$ constant, so $\ddot\theta=0$, and the equation then demands $\sin\theta_0\cos\theta_0=0$: only the equator.</p>""",
    r"""<p>The $\phi$ equation is fine for any constant $\theta$; it is the $\theta$ equation that fails. Away from the equator, following a circle of
    latitude requires constant steering.</p>""",
]
EXPLAIN['12.6'] = [
    r"""<p>Invert the rotation to get $x,y$ in terms of $x',y'$, then differentiate, remembering that $t$ appears in the angles: $\frac{d}{dt}\cos\Omega t=-\Omega\sin\Omega t$
    produces the $dt$ terms.</p>""",
    r"""<p>Insert into the flat metric and collect coefficients of $dt^2$, $dt\,dx'$, $dt\,dy'$, …: these are the metric components. Rotation produces
    off-diagonal $dt\,dx$ terms.</p>""",
    r"""<p>For the inverse, verify by multiplication ($g^{ik}g_{km}=\delta^i_m$) rather than inverting a $4\times4$ matrix from scratch.</p>""",
    r"""<p>At $\varrho=c/\Omega$ a point fixed in the rotating frame would move at $c$: the frame cannot be realised by observers beyond that. The
    spacetime is still Minkowski, just in rotating coordinates.</p>""",
]
EXPLAIN['12.7'] = [
    r"""<p>For a small perturbation of flat spacetime the Ricci tensor is linear in second derivatives of $h$. Static field: time derivatives vanish, and
    only $h_{00}$ is non-zero here.</p>""",
    r"""<p>$G_{xx}=R_{xx}-\frac12g_{xx}R$ with $g_{xx}=1$.</p>""",
    r"""<p>Dust at rest has no pressure, so $T_{xx}\approx0$; but $G_{xx}$ is not zero where $\nabla^2\Phi\neq0$.</p>""",
    r"""<p>The ansatz was too simple: at the same order in $\Phi/c^2$ the spatial metric must change too. Slow particles barely feel $g_{ij}$, so Newtonian motion
    came out right, but light moves through space as fast as through time and feels both: hence twice the Newtonian bending.</p>""",
]
# ---------------------------------------------------------------- Ch. 13
EXPLAIN['13.1'] = [
    r"""<p>On a sphere $r=R$, $t=$ const, only $d\theta$ and $d\phi$ vary; the area element is $\sqrt{g_{\theta\theta}g_{\phi\phi}}\,d\theta\,d\phi$. Since those components are $r^2$ and
    $r^2\sin^2\theta$, the area is the flat one: this is how $r$ is defined.</p>""",
    r"""<p>Radial proper length integrates $\sqrt{g_{rr}}\,dr$. With $g_{rr}=(1-Ar^2)^{-1}$ the integral is an arcsine (substitute $r=\sin u/\sqrt A$). Volumes use
    $\sqrt{g_{rr}}r^2$; the 4-volume uses $\sqrt{-g}$, where $g_{tt}g_{rr}=-1$ simplifies.</p>""",
    r"""<p>Same integrals with $\sqrt{1-Ar^2}$ in the numerator; the volume is a standard integral as well.</p>""",
    r"""<p>Setting $A=0$ is the flat check; all results should reduce to Euclidean geometry.</p>""",
]
EXPLAIN['13.2'] = [
    r"""<p>Write the general static spherical metric with two unknown functions; its Christoffels follow from derivatives of $e^{2\alpha}$, $e^{2\beta}$ and $r^2$.</p>""",
    r"""<p>Ricci components from the Christoffels (long but mechanical). Vacuum means all must vanish.</p>""",
    r"""<p><b>The clever combination:</b> adding the $tt$ and $rr$ equations with the right weights cancels the second derivatives and leaves $\alpha'+\beta'=0$. Then
    the $\theta\theta$ equation becomes a first-order equation for $e^{2\alpha}$, solved by $1-\frac{2GM}{c^2r}$, with $M$ the integration constant (matched to Newton far
    away).</p>""",
]
EXPLAIN['13.3'] = [
    r"""<p>Without the GR term this is the Newtonian orbit equation. Try the conic section $u=\frac1p(1+\epsilon\cos\phi)$ and differentiate.</p>""",
    r"""<p>The equation must hold for every $\phi$, so coefficients of $\cos\phi$, $\cos^2\phi$ and constants must match separately ($\sin^2=1-\cos^2$). That gives $p$ and
    $\epsilon$.</p>""",
    r"""<p>An ellipse has $\epsilon<1$; its closest and farthest distances $p/(1\pm\epsilon)$ average to the semi-major axis.</p>""",
    r"""<p>$e$ is the energy per rest energy; for slow orbits $e\approx1+E/mc^2$, so $\frac{e^2-1}{2}\approx E/mc^2$, the Newtonian energy: Kepler's $-GM/2a$ recovered.</p>""",
]
EXPLAIN['13.4'] = [
    r"""<p>Insert $GM_\odot=1.33\times10^{20}$ m$^3$/s$^2$, $c^2$, $a$ in m and the eccentricity factor.</p>""",
    r"""<p>Orbits per century: $36525/88$. Convert radians to arcseconds ($\times206265$).</p>""",
    r"""<p>Grazing ray: $R=R_\odot$. Twice the Newtonian value because space is curved too (see Ex. 12.7).</p>""",
]
EXPLAIN['13.5'] = [
    r"""<p>A local observer measures angles with proper distances, not coordinate ones. Near a black hole radial proper distance is stretched by
    $1/\sqrt{1-2M/r}$, so the measured angle differs from the coordinate one.</p>""",
    r"""<p>Express $dr/d\phi$ via the photon orbit equation in terms of the impact parameter $b$; then $\sin\alpha$ simplifies neatly.</p>""",
    r"""<p>Inside $3M$ the effective potential for light has a maximum at $3M$; an outgoing photon escapes only if its "energy" $1/b^2$ exceeds that maximum
    $1/27M^2$. Translate into a condition on $\alpha$.</p>""",
    r"""<p>At the horizon the factor $1-2M/r$ is 0: the escape cone shrinks to a line. Just inside, nothing escapes.</p>""",
]
EXPLAIN['13.6'] = [
    r"""<p>Far away Schwarzschild is weak; expanded to first order in $M/r$ (in isotropic coordinates) all diagonal components get $\frac{2GM}{c^2r}$. This is
    the Newtonian potential in GR clothing.</p>""",
    r"""<p>A TT wave only has spatial, transverse, traceless parts and oscillates as it propagates.</p>""",
    r"""<p><b>Gauge-invariant test:</b> the Riemann tensor does not change under coordinate changes. Compute it for the static field: it is not
    transverse and not oscillating, so no choice of gauge can make the field look like a wave.</p>""",
]
EXPLAIN['13.7'] = [
    r"""<p>In TT gauge the relevant Christoffel $\Gamma^i_{tt}$ vanishes, so particles at rest stay at constant coordinates; the coordinates themselves "ride" the
    wave.</p>""",
    r"""<p>Physical distance uses the metric: $\sqrt{(\delta_{ij}+h_{ij})dx^idx^j}\approx L_0(1+\frac12h_{ij}n^in^j)$. That is what a detector measures.</p>""",
    r"""<p>Once the wave has passed, $h=0$ again, so the distance returns to $L_0$ and its rate of change to zero.</p>""",
]
# ---------------------------------------------------------------- Ch. 14
EXPLAIN['14.1'] = [
    r"""<p>The 3-sphere metric in hyperspherical angles: only $\sin^2\chi$ and $\sin^2\theta$ depend on coordinates, giving these Christoffels.</p>""",
    r"""<p>Contract the Riemann tensor to Ricci. The result is proportional to the metric: maximally symmetric space, the same in every direction.</p>""",
    r"""<p>Trace with $g^{ij}$ (3 dimensions): $R=3\cdot\frac{2}{a^2}$. $\sinh$ flips the sign.</p>""",
    r"""<p>The spatial slices of the closed and open Robertson–Walker universes are exactly these spaces.</p>""",
]
EXPLAIN['14.2'] = [
    r"""<p>Time appears only through $a(t)$ in the spatial part, so the new Christoffels all contain $\dot a$.</p>""",
    r"""<p>Use the Ricci formula with these Christoffels. $\frac{d}{dt}\frac{\dot a}{a}=\frac{\ddot a}{a}-\frac{\dot a^2}{a^2}$; the $\dot a^2$ terms cancel.</p>""",
    r"""<p>Spatial components: time-derivative pieces plus the curvature of the spatial slices themselves (Ex. 14.1).</p>""",
    r"""<p>Inserting into Einstein's equations with a perfect fluid gives the two Friedmann equations.</p>""",
]
EXPLAIN['14.3'] = [
    r"""<p>Static: $\ddot a=0$, so the attraction of matter balances the repulsion of $\Lambda$.</p>""",
    r"""<p>Linearise around $a_0$: $\rho a$ scales like $a^{-2}$, so its derivative brings a factor $-2$. Collect the terms proportional to $a_1$ and use the static
    condition.</p>""",
    r"""<p>A positive coefficient means exponential growth or decay: an unstable equilibrium, like a ball on a hilltop.</p>""",
]
EXPLAIN['14.4'] = [
    r"""<p>The action does not depend on $\chi$ (homogeneity), so the conjugate momentum is conserved: $a^2d\chi/d\tau$. Physical momentum is $a\,d\chi/d\tau\propto1/a$: it
    redshifts like a photon's.</p>""",
    r"""<p>All momenta shrink by the same factor, so the shape of the distribution is preserved; only the parameter $T$ scales as $1/a$.</p>""",
    r"""<p>A temperature describes equilibrium in energy. Once the particles are non-relativistic and no longer interact, the distribution is not an
    equilibrium distribution in energy any more.</p>""",
    r"""<p>Use number conservation: density = mass × number density, with the number fixed at decoupling and diluted as $a^{-3}$.</p>""",
]
EXPLAIN['14.5'] = [
    r"""<p>A light ray: $ds=0$ radially, so $\frac{a\,dr}{\sqrt{1+r^2}}=c\,dt$ for $k=-1$. Change variable from $t$ to $z$ with $dt=-\frac{dz}{(1+z)H}$.</p>""",
    r"""<p>The $z$ integral is elementary with the substitution suggested; then take $\sinh$ of both sides to isolate $r$.</p>""",
    r"""<p>The $k=+1$ calculation has $\sin$ where this one has $\sinh$; with the corresponding relation between $a_0H_0$ and $\Omega$ both give the same formula.</p>""",
]
EXPLAIN['14.6'] = [
    r"""<p>Number = density × comoving volume of the shell between $z$ and $z+dz$; the volume element follows from the Robertson–Walker metric.</p>""",
    r"""<p>The light-ray relation links $dr$ to $dz$ via the Hubble rate at that redshift.</p>""",
    r"""<p>Insert the matter-only expressions. At small $z$ the shell volume grows as $z^2$; at large $z$ the expansion history makes it shrink again.</p>""",
]
EXPLAIN['14.7'] = [
    r"""<p>$\kappa=1-\Omega_M-\Omega_\Lambda=0$ for all three, and $S(x)/\sqrt{|\kappa|}\to x$ as $\kappa\to0$.</p>""",
    r"""<p>Numerical integration of $1/E(z)$; the closed forms check the program.</p>""",
    r"""<p>Brightness $\propto1/d_L^2$. A larger $d_L$ at the same $z$ means fainter; the $\Lambda$ model has the largest distances because expansion was
    slower in the past. $2.5\log_{10}(1.44)\approx0.4$ mag.</p>""",
]
EXPLAIN['14.8'] = [
    r"""<p><b>Orthogonality of Legendre polynomials</b> works exactly like orthogonality of $\cos(nx)$ in Fourier series: multiply both sides by $P_{l'}$, integrate,
    and only the $l=l'$ term survives.</p>""",
    r"""<p>Use $x=\cos\theta$ and the recurrence to generate $P_l$ stably; the Gaussian is negligible beyond a few $\theta_0$.</p>""",
    r"""<p>For a narrow Gaussian $P_l(\cos\theta)\approx J_0(l\theta)$ and the integral is again Gaussian in $l$. Multiplying by $l(l+1)$ shifts the peak to $l\sim2/\theta_0$.</p>""",
    r"""<p>An angular scale $\theta$ corresponds to multipole $l\sim\pi/\theta$, like wavelength and wave number. The CMB peak at $l\approx200$ is the $1^\circ$ sound horizon.</p>""",
]
