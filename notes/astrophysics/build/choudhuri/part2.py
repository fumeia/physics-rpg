# Choudhuri exercises, Ch. 5-8 (see part1.py for the format).
EX = []
def ex(num, room, title, goal, given, steps, keys, xp=25, note=None):
    EX.append(dict(num=num, room=room, title=title, goal=goal, given=given, steps=steps, keys=keys, xp=xp, note=note))

# ------------------------------------------------------------------ Chapter 5
ex('5.1', 'degenerate-matter', r'Kinetic-theory pressure (5.1)',
   r'Derive $P=\frac13\displaystyle\int vp\,f(p)\,4\pi p^2dp$ (5.1) by counting the particles that hit a unit area of the wall per unit time and the momentum they transfer in elastic collisions. Then find $f(p)$ for a Maxwellian (2.27) and show $P=n\kappa_BT$.',
   [r'$4\pi f(p)p^2dp$ = number of particles per volume with momentum in $[p,p+dp]$, isotropic'],
   [(r'Particles with momentum $p$ moving at angle $\theta$ to the wall normal: how many hit unit area per unit time?',
     r'The fraction moving into $d\theta$ is $\frac12\sin\theta\,d\theta$; their flux onto the wall is $v\cos\theta$ times their density: $4\pi f p^2dp\cdot v\cos\theta\cdot\frac12\sin\theta\,d\theta$.'),
    (r'Momentum transferred per hit.', r'Elastic reflection reverses the normal component: $2p\cos\theta$.'),
    (r'Integrate over the hemisphere $0\le\theta\le\pi/2$.',
     r'$P=\displaystyle\int vp\,f\,4\pi p^2dp\int_0^{\pi/2}\cos^2\theta\sin\theta\,d\theta=\frac13\int vp\,f\,4\pi p^2dp$ (5.1). It holds for any $v(p)$, also relativistic.'),
    (r'Maxwellian.',
     r'$f(p)=n(2\pi m\kappa_BT)^{-3/2}e^{-p^2/2m\kappa_BT}$, $v=p/m$: $P=\dfrac{1}{3m}\displaystyle\int p^2f\,4\pi p^2dp=\dfrac{n\langle p^2\rangle}{3m}=\dfrac{n\cdot3m\kappa_BT}{3m}=n\kappa_BT$.')],
   [r'flux $\propto v\cos\theta$ and momentum $2p\cos\theta$', r'$\int_0^1\mu^2d\mu=\frac13$', r'Maxwellian $\langle p^2\rangle=3m\kappa_BT$ gives $n\kappa_BT$'], xp=25)

ex('5.2', 'degenerate-matter', r'Exact pressure of a degenerate electron gas',
   r'Evaluate (5.5), $P=\dfrac{8\pi}{3h^3}\displaystyle\int_0^{p_F}\dfrac{p^4c^2\,dp}{\sqrt{p^2c^2+m_e^2c^4}}$, with $p=m_ec\sinh\theta$ and show $P=\dfrac{\pi m_e^4c^5}{3h^3}f(x)$, $f(x)=x(2x^2-3)\sqrt{x^2+1}+3\sinh^{-1}x$, $x=p_F/m_ec$. Plot $\log P$ against $\log\rho$ and mark the regions of the limits (5.9) and (5.11).',
   [r'$n_e=\dfrac{8\pi}{3h^3}p_F^3$, $\rho=\mu_em_Hn_e$'],
   [(r'Substitute.',
     r'$dp=m_ec\cosh\theta\,d\theta$, $\sqrt{p^2c^2+m_e^2c^4}=m_ec^2\cosh\theta$, so the integrand becomes $m_e^4c^5\sinh^4\theta\,d\theta$ and $P=\dfrac{8\pi m_e^4c^5}{3h^3}\displaystyle\int_0^{\theta_F}\sinh^4\theta\,d\theta$.'),
    (r'Integrate $\sinh^4$.',
     r'$\sinh^4\theta=\frac18(\cosh4\theta-4\cosh2\theta+3)$, so $\int_0^{\theta_F}=\frac{\sinh4\theta_F}{32}-\frac{\sinh2\theta_F}{4}+\frac{3\theta_F}{8}$. With $x=\sinh\theta_F$: $\sinh2\theta=2x\sqrt{1+x^2}$, $\sinh4\theta=4x\sqrt{1+x^2}(1+2x^2)$, which gives $\frac18f(x)$. Hence $P=\dfrac{\pi m_e^4c^5}{3h^3}f(x)$.'),
    (r'Limits.',
     r'$x\ll1$: $f\approx\frac85x^5$, $P\propto p_F^5\propto\rho^{5/3}$ (5.9). $x\gg1$: $f\approx2x^4$, $P\propto\rho^{4/3}$ (5.11).'),
    (r'Where is the crossover?',
     r'$x=1$ when $n_e=\frac{8\pi}{3}(m_ec/h)^3=<<5.2.ne>>\ \mathrm{m^{-3}}$, i.e. $\rho\approx<<5.2.rho>>\ \mathrm{kg\,m^{-3}}$ for $\mu_e=2$. On the $\log P$–$\log\rho$ plot the slope bends from $5/3$ to $4/3$ around there.')],
   [r'sinh substitution', r'$\int\sinh^4$ and the identities giving $f(x)$', r'both limits with slopes $5/3$ and $4/3$', r'crossover near $\rho\sim2\times10^9\ \mathrm{kg\,m^{-3}}$'], xp=35)

ex('5.3', 'degenerate-matter', r'The polytropic constants $K_1$, $K_2$ and Fig. 5.1',
   r'Carry out all the algebra and numbers to obtain (5.9)–(5.12). Then produce Fig. 5.1 (the $T$–$\rho$ plane divided into regions where the ideal gas, non-relativistic and relativistic degenerate equations of state hold) and justify the procedure.',
   [r'$p_F=h\left(\dfrac{3n_e}{8\pi}\right)^{1/3}$, $n_e=\rho/\mu_em_H$', r'non-rel.: $P=\dfrac{8\pi}{15h^3m_e}p_F^5$; rel.: $P=\dfrac{2\pi c}{3h^3}p_F^4$'],
   [(r'Non-relativistic.',
     r'$P=\dfrac{8\pi}{15h^3m_e}h^5\left(\dfrac{3n_e}{8\pi}\right)^{5/3}=\dfrac15\left(\dfrac3{8\pi}\right)^{2/3}\dfrac{h^2}{m_e}n_e^{5/3}$, i.e. $K_1=\dfrac{3^{2/3}h^2}{20\pi^{2/3}m_em_H^{5/3}\mu_e^{5/3}}=\dfrac{1.00\times10^7}{\mu_e^{5/3}}$ SI ($<<5.3.K1>>$ for $\mu_e=2$).'),
    (r'Relativistic.',
     r'$P=\dfrac{2\pi c}{3h^3}h^4\left(\dfrac{3n_e}{8\pi}\right)^{4/3}$, i.e. $K_2=\dfrac{3^{1/3}hc}{8\pi^{1/3}m_H^{4/3}\mu_e^{4/3}}=\dfrac{1.24\times10^{10}}{\mu_e^{4/3}}$ SI ($<<5.3.K2>>$ for $\mu_e=2$).'),
    (r'Boundaries in the $T$–$\rho$ plane: set the competing pressures equal.',
     r'Ideal gas = non-rel. degenerate: $T=\dfrac{\mu m_HK_1}{\kappa_B}\rho^{2/3}\approx<<5.3.cid>>\,\rho^{2/3}$ K. Non-rel. = rel.: $\rho=(K_2/K_1)^3\approx<<5.3.rho12>>\ \mathrm{kg\,m^{-3}}$. Ideal = rel. degenerate: $T\approx<<5.3.cir>>\,\rho^{1/3}$ K. Radiation = gas: $T=\left(\dfrac{3\kappa_B\rho}{a_B\mu m_H}\right)^{1/3}\approx<<5.3.crad>>\,\rho^{1/3}$ K ($\mu=0.6$, $\mu_e=2$, SI).'),
    (r'Why is this the right procedure?',
     r'In each region the largest of the candidate pressures is the physical one (the others are small corrections), so the boundary is where two candidates are equal. Example: the solar centre ($\rho=1.5\times10^5$, $T=1.6\times10^7$) lies far above the degeneracy line $T\approx6\times10^5$ K: ideal gas.')],
   [r'$p_F(n_e)$ inserted correctly', r'$K_1$ and $K_2$ with their $\mu_e$ powers', r'boundary lines with slopes $2/3$, vertical, $1/3$', r'justification: equal pressures on a boundary'], xp=35)

ex('5.4', 'degenerate-matter', r'Lane–Emden solutions for $n=0$ and $n=1$',
   r'Solve $\dfrac1{\xi^2}\dfrac{d}{d\xi}\left(\xi^2\dfrac{d\theta}{d\xi}\right)=-\theta^n$ with $\theta=1$, $\theta\'=0$ at $\xi=0$, analytically for $n=0$ and $n=1$ (hint for $n=1$: $\theta=\chi/\xi$ gives $\chi\'\'=-\chi^n/\xi^{n-1}$).',
   [r'$\theta^n\propto\rho$, the surface is the first zero $\xi_1$'],
   [(r'$n=0$ (constant density).',
     r'$\dfrac{d}{d\xi}(\xi^2\theta\')=-\xi^2\Rightarrow\theta\'=-\dfrac\xi3$ (the constant vanishes since $\theta\'(0)=0$), $\theta=1-\dfrac{\xi^2}{6}$, $\xi_1=\sqrt6$.'),
    (r'The substitution $\theta=\chi/\xi$.',
     r'$\xi^2\theta\'=\xi\chi\'-\chi$, so $\dfrac{d}{d\xi}(\xi^2\theta\')=\xi\chi\'\'$ and the equation becomes $\xi\chi\'\'=-\xi^2(\chi/\xi)^n$, i.e. $\chi\'\'=-\chi^n/\xi^{n-1}$.'),
    (r'$n=1$.',
     r'$\chi\'\'=-\chi\Rightarrow\chi=A\sin\xi+B\cos\xi$; $\theta$ finite at 0 needs $B=0$, $\theta(0)=1$ gives $A=1$: $\theta=\dfrac{\sin\xi}{\xi}$, $\xi_1=\pi$.'),
    (r'Check.', r'Both have $\theta\approx1-\xi^2/6$ near the centre, as every Lane–Emden solution must (expand the equation at small $\xi$).')],
   [r'$n=0$: $1-\xi^2/6$, $\xi_1=\sqrt6$', r'$\chi=\xi\theta$ transformation', r'$n=1$: $\sin\xi/\xi$, $\xi_1=\pi$', r'boundary conditions used'], xp=25)

ex('5.5', 'stellar-forge', r'Eddington\'s standard model: $\beta$ against mass',
   r'If the gas pressure is a constant fraction $\beta$ of the total everywhere, show $P_{\rm tot}=\left(\dfrac{3\kappa_B^4}{a_B\mu^4m_H^4}\dfrac{1-\beta}{\beta^4}\right)^{1/3}\rho^{4/3}$. For stars of the same $\mu$, show $\dfrac{1-\beta}{\beta^4}=CM^2$, find $C$, and show that radiation pressure matters more in massive stars.',
   [r'$P_{\rm gas}=\dfrac{\kappa_B}{\mu m_H}\rho T=\beta P$, $P_{\rm rad}=\frac13a_BT^4=(1-\beta)P$', r'polytrope $n=3$: $M=4\pi\left(\dfrac{K}{\pi G}\right)^{3/2}\xi_1^2|\theta\'(\xi_1)|$, $\xi_1^2|\theta\'|=2.018$'],
   [(r'Eliminate $T$.',
     r'From the gas law $T=\dfrac{\beta P\mu m_H}{\kappa_B\rho}$; put it into $P=\dfrac{a_BT^4}{3(1-\beta)}$: $P^3=\dfrac{3\kappa_B^4}{a_B\mu^4m_H^4}\dfrac{1-\beta}{\beta^4}\rho^4$. That is $P=K\rho^{4/3}$: a polytrope of index 3.'),
    (r'Use the mass of an $n=3$ polytrope (it does not depend on $\rho_c$).',
     r'$K^3=\dfrac{\pi^3G^3M^2}{(4\pi\times2.018)^2}$, so $\dfrac{1-\beta}{\beta^4}=CM^2$ with $C=\dfrac{\pi G^3a_B(\mu m_H)^4}{48\times2.018^2\,\kappa_B^4}$.'),
    (r'Numbers ($\mu=0.6$).',
     r'$CM_\odot^2\approx<<5.5.CMsun>>$. Solving the quartic: $\beta\approx<<5.5.b1>>$ ($1M_\odot$), $<<5.5.b10>>$ ($10M_\odot$), $<<5.5.b100>>$ ($100M_\odot$).'),
    (r'Conclusion.', r'$(1-\beta)/\beta^4$ grows as $M^2$: $\beta$ falls with mass, radiation pressure takes over in the most massive stars, which links to the Eddington limit (Exercise 3.5).')],
   [r'$P\propto\rho^{4/3}$ with the given $K(\beta)$', r'$n=3$ mass independent of $\rho_c$', r'$C$ and $1-\beta\approx4\times10^{-4}$ for the Sun', r'$\beta$ decreases with $M$'], xp=35)

ex('5.6', 'degenerate-matter', r'Chandrasekhar\'s mass–radius relation (numerical)',
   r'Use the exact equation of state of Exercise 5.2 to solve the structure equation (5.13) for different central densities $\rho_c$. Plot $R(M)$ and show that $R\to0$ at the Chandrasekhar mass.',
   [r'(5.13): $\dfrac1{r^2}\dfrac{d}{dr}\left(\dfrac{r^2}{\rho}\dfrac{dP}{dr}\right)=-4\pi G\rho$', r'$P(\rho)=\dfrac{\pi m_e^4c^5}{3h^3}f(x)$, $x\propto\rho^{1/3}$'],
   [(r'Turn (5.13) into two first-order equations.',
     r'$\dfrac{dM_r}{dr}=4\pi r^2\rho$, $\dfrac{dP}{dr}=-\dfrac{GM_r\rho}{r^2}$, and $\dfrac{d\rho}{dr}=\dfrac{dP/dr}{dP/d\rho}$ with $dP/d\rho$ from $f(x)$.'),
    (r'Integrate.',
     r'Start at small $r$ with $\rho=\rho_c$, $M_r=\frac43\pi r^3\rho_c$, integrate outward until $\rho=0$: that gives $R$ and $M=M_r(R)$. Repeat for $\rho_c$ from $10^8$ to $10^{14}\ \mathrm{kg\,m^{-3}}$.'),
    (r'Result.',
     r'Low $\rho_c$: $R\propto M^{-1/3}$ (the $n=3/2$ polytrope). As $\rho_c\to\infty$ the electrons are relativistic everywhere, the star becomes an $n=3$ polytrope whose mass is fixed: $M_{\rm Ch}=4\pi\times2.018\,(K_2/\pi G)^{3/2}\approx<<5.6.MCh>>M_\odot$ for $\mu_e=2$, reached as $R\to0$ (Fig. 5.2).')],
   [r'first-order system with $dP/d\rho$ from the exact EOS', r'shooting from the centre to $\rho=0$', r'$M\to M_{\rm Ch}\approx1.44M_\odot$ as $R\to0$'], xp=30)

ex('5.7', 'degenerate-matter', r'Spin-up of the collapsing Sun',
   r'The Sun rotates in about $27$ days. If it collapsed to a white dwarf conserving angular momentum, what would the rotation period be? And for a neutron star?',
   [r'$L=I\Omega$, $I\propto MR^2$ (same structure assumed)', r'$R_{\rm WD}\approx6.4\times10^6$ m (Earth size), $R_{\rm NS}\approx10$ km'],
   [(r'Scaling.', r'$I\Omega=$ const and $I\propto R^2$ give $P\propto R^2$: $P=P_\odot(R/R_\odot)^2$.'),
    (r'White dwarf.', r'$P\approx27\ \mathrm d\times(6.4\times10^6/6.96\times10^8)^2\approx<<5.7.Pwd>>$ s, a few minutes.'),
    (r'Neutron star.', r'$P\approx<<5.7.Pns>>$ s, i.e. half a millisecond, near the break-up limit; real pulsars are born slower because most angular momentum is lost on the way (winds, magnetic braking, mass loss).')],
   [r'$P\propto R^2$', r'WD minutes', r'NS sub-millisecond, as a hint why pulsars spin fast'], xp=15)

ex('5.8', 'degenerate-matter', r'Spin-down power and magnetic field of the Crab pulsar',
   r'The Crab pulsar has $P=0.033$ s and $P/\dot P=2.5\times10^3$ yr. Estimate its energy loss rate and, using (5.35), its magnetic field.',
   [r'(5.35): $I\Omega\dot\Omega=-\dfrac{2\pi B_p^2R^6\Omega^4\sin^2\alpha}{3\mu_0c^3}$', r'$I=\frac25MR^2$, $M=1.4M_\odot$, $R=10$ km'],
   [(r'Spin-down rate.', r'$\dot P=P/(2.5\times10^3\ \mathrm{yr})=<<5.8.Pdot>>$; $I=<<5.8.I>>\ \mathrm{kg\,m^2}$.'),
    (r'Energy loss.', r'$|\dot E|=I\Omega|\dot\Omega|=\dfrac{4\pi^2I\dot P}{P^3}\approx<<5.8.Edot>>$ W, about $10^5L_\odot$: enough to power the Crab nebula.'),
    (r'Field.', r'$B_p=\left(\dfrac{3\mu_0c^3I|\dot\Omega|}{2\pi R^6\Omega^3}\right)^{1/2}\approx<<5.8.B>>$ T with $\sin\alpha=1$: about $10^8$–$10^9$ T, typical of young pulsars.')],
   [r'$\dot E=4\pi^2I\dot P/P^3$', r'$\sim5\times10^{31}$ W', r'$B\sim10^8$–$10^9$ T from magnetic dipole braking'], xp=25)

ex('5.9', 'degenerate-matter', r'White-dwarf radius constant and the hottest brown dwarf',
   r'Find the proportionality constant in $R\propto M^{-1/3}$ (5.25) using $\xi_1=3.65$, $\xi_1^2|\theta\'(\xi_1)|=2.71$ for $n=3/2$. For the limiting brown dwarf ($0.08M_\odot$) held up by electron degeneracy, estimate its radius, the thermal energy gained in its formation and its (uniform) temperature. Nuclear burning needs $T>10^7$ K.',
   [r'polytrope: $R=\xi_1\alpha$, $\alpha^2=\dfrac{(n+1)K\rho_c^{1/n-1}}{4\pi G}$, $M=4\pi\alpha^3\rho_c\,\xi_1^2|\theta\'|$', r'$E_G=-\dfrac{3}{5-n}\dfrac{GM^2}{R}$'],
   [(r'Eliminate $\rho_c$ for $n=3/2$, $K=K_1$.',
     r'$\alpha=\dfrac{2.5K_1}{4\pi G}(4\pi\times2.71)^{1/3}M^{-1/3}$, so $R=3.65\,\alpha\approx<<5.9.cR>>\ \mathrm m\,(M/M_\odot)^{-1/3}$ for $\mu_e=2$: an Earth-sized white dwarf.'),
    (r'Brown dwarf: hydrogen-rich, $\mu_e=2/(1+X)\approx<<5.9.mue>>$.',
     r'Then $R\approx<<5.9.R>>$ m $\approx<<5.9.Rj>>R_J$ (Jupiter size, as observed for brown dwarfs).'),
    (r'Energy gained on contraction.',
     r'$|E_G|=\frac67GM^2/R\approx<<5.9.EG>>$ J; by the virial theorem half of it stays as heat: $E_{\rm th}\approx<<5.9.Eth>>$ J.'),
    (r'Temperature.',
     r'$E_{\rm th}=\frac32\dfrac{M}{\mu m_H}\kappa_BT$ with $\mu\approx0.6$: $T\approx<<5.9.T>>$ K, below $10^7$ K: the contraction is halted by degeneracy before hydrogen can ignite. That is why $\approx0.08M_\odot$ is the dividing line between stars and brown dwarfs.')],
   [r'$R=\xi_1\alpha$ with $\rho_c$ eliminated, $R\approx9\times10^6$ m $(M/M_\odot)^{-1/3}$', r'brown dwarf $R\sim R_J$', r'$E_{\rm th}=|E_G|/2$', r'$T\sim5\times10^6$ K $<10^7$ K'], xp=35)

# ------------------------------------------------------------------ Chapter 6
ex('6.1', 'interstellar-medium', r'Star counts with a luminosity function and extinction',
   r'A fraction $\Phi(M)dM$ of stars has absolute magnitude in $[M,M+dM]$, absorption adds $a(r)$ magnitudes at distance $r$, and $D(r)$ is the number density. Show that the number of stars per unit apparent magnitude in solid angle $\omega$ is $A(m)=\omega\displaystyle\int_0^\infty\Phi[m+5-5\log_{10}r-a(r)]\,D(r)\,r^2dr$, and that it reduces to (6.3), $A\propto10^{0.6m}$, for equal stars, no absorption and uniform density.',
   [r'$m=M+5\log_{10}r-5+a(r)$ with $r$ in pc'],
   [(r'Stars in a shell.', r'In $[r,r+dr]$ inside $\omega$ there are $\omega r^2D(r)\,dr$ stars.'),
    (r'Which of them have apparent magnitude in $[m,m+dm]$?',
     r'Those with $M=m+5-5\log_{10}r-a(r)$; at fixed $r$, $dM=dm$, so the fraction is $\Phi(m+5-5\log_{10}r-a)\,dm$. Summing over shells gives the formula.'),
    (r'Special case $\Phi=\delta(M-M_0)$, $a=0$, $D=$ const.',
     r'$\delta(g(r))$ with $g=m+5-5\log_{10}r-M_0$ picks $r_0=10^{(m-M_0+5)/5}$ with weight $1/|g\'(r_0)|=r_0\ln10/5$: $A(m)=\dfrac{\omega D\ln10}{5}r_0^3\propto10^{0.6m}$, which is (6.3).'),
    (r'Use.', r'Deviations from $10^{0.6m}$ tell us about $D(r)$ (the structure of the Galaxy) or $a(r)$ (extinction), the basis of statistical astronomy (Kapteyn).')],
   [r'shell count $\omega r^2Ddr$', r'magnitude condition gives $\Phi(\ldots)dm$', r'delta function reduces to $10^{0.6m}$'], xp=25)

ex('6.2', 'interstellar-medium', r'Extinction as an exponential',
   r'The interstellar medium dims stars in the disk by about $1.5$ magnitudes per kpc. Show that brightness then falls as $e^{-\alpha r}/r^2$ and find $\alpha$.',
   [r'$m_1-m_2=-2.5\log_{10}(F_1/F_2)$'],
   [(r'Flux reduction factor from $\Delta m=1.5\,r$ (r in kpc).', r'$F/F_0=10^{-0.4\times1.5r}=e^{-0.6\ln10\,r}$, times the geometric $1/r^2$.'),
    (r'Value.', r'$\alpha=0.6\ln10\approx<<6.2.alpha>>\ \mathrm{kpc^{-1}}=<<6.2.alpha_m>>\ \mathrm{m^{-1}}$.'),
    (r'Meaning.', r'The optical depth is $\tau=\alpha r\approx1.4$ per kpc: the galactic centre ($8$ kpc, $\tau\approx11$, about 30 magnitudes) is invisible in visible light.')],
   [r'magnitudes to flux', r'$\alpha=0.6\ln10\approx1.4\ \mathrm{kpc^{-1}}$', r'galactic centre hidden'], xp=15)

ex('6.3', 'galactic-dynamics', r'Oort constants in a Keplerian region',
   r'If the gravitational field falls as $r^{-2}$, find the Oort constants $A$ and $B$ (6.21), (6.22). Show that the epicyclic frequency equals the angular velocity and explain its significance.',
   [r'$A=-\frac12R_0\left(\dfrac{d\omega}{dR}\right)_{R_0}$, $B=A-\omega_0$', r'epicyclic frequency $\kappa^2=-4B(A-B)=-4B\omega_0$'],
   [(r'Rotation law.', r'$\dfrac{\Theta^2}{R}=\dfrac{GM}{R^2}\Rightarrow\omega\propto R^{-3/2}$, $\dfrac{d\omega}{dR}=-\dfrac32\dfrac\omega R$.'),
    (r'Oort constants.', r'$A=\frac34\omega_0$, $B=A-\omega_0=-\frac14\omega_0$.'),
    (r'Epicyclic frequency.', r'$\kappa^2=-4B\omega_0=\omega_0^2$, so $\kappa=\omega_0$.'),
    (r'Significance.', r'The radial oscillation has the same period as the orbit: the perturbed orbit closes after one revolution. It is a Kepler ellipse, as it must be for an inverse-square force. In the flat-rotation-curve Galaxy $\kappa=\sqrt2\,\omega$ and orbits are rosettes.')],
   [r'$\omega\propto R^{-3/2}$', r'$A=\frac34\omega_0$, $B=-\frac14\omega_0$', r'$\kappa=\omega_0$: closed (Kepler) orbits'], xp=25)

ex('6.4', 'galactic-dynamics', r'Vertical oscillations through the galactic disk',
   r'Model the disk as an infinite slab of constant density. Show that a star displaced vertically oscillates harmonically about the mid-plane. For a mid-plane density of $5\times10^6$ hydrogen atoms per $\mathrm{m^3}$ estimate the period and compare with the orbital period near the Sun.',
   [r'Poisson: $\dfrac{d^2\Phi}{dz^2}=4\pi G\rho$ for a slab'],
   [(r'Field inside the slab.', r'$g_z=-\dfrac{d\Phi}{dz}=-4\pi G\rho z$ (Gauss\'s law with a pillbox, symmetric about $z=0$).'),
    (r'Equation of motion.', r'$\ddot z=-4\pi G\rho z$: simple harmonic with $\omega_z^2=4\pi G\rho$.'),
    (r'Numbers.', r'$\rho=<<6.4.rho>>\ \mathrm{kg\,m^{-3}}$: $P_z=2\pi/\sqrt{4\pi G\rho}\approx<<6.4.P>>$ yr; the orbit takes $2\pi\times8\ \mathrm{kpc}/220\ \mathrm{km\,s^{-1}}\approx<<6.4.Porb>>$ yr.'),
    (r'Consequence.', r'A star crosses the disk a few times per orbit; the Sun is now about $20$ pc above the plane, moving up.')],
   [r'$g_z=-4\pi G\rho z$', r'$\omega_z^2=4\pi G\rho$', r'$P_z\sim10^8$ yr, a few per orbit'], xp=20)

ex('6.5', 'interstellar-medium', r'Oscillator strength and the Einstein $B$ coefficient',
   r'The oscillator strength of §2.7 satisfies $\dfrac{e^2}{4\epsilon_0m_e}f=h\nu_0B_{lu}$. Show that this makes the discussions of §2.7 and §6.6 consistent.',
   [r'§2.7: $\alpha_\nu=\dfrac{e^2}{4\epsilon_0m_ec}nf\phi(\nu)$', r'§6.6 (6.65): $\alpha_\nu=\dfrac{h\nu_0}{c}n_lB_{lu}\left[1-e^{-h\nu_0/\kappa_BT}\right]\phi(\nu)$'],
   [(r'Which limit did §2.7 use?', r'Visible lines through cold gas: $h\nu_0\gg\kappa_BT$, so stimulated emission is negligible and the bracket is 1; also $n_l\approx n$.'),
    (r'Compare the two absorption coefficients.', r'$\dfrac{h\nu_0}{c}nB_{lu}\phi=\dfrac{e^2}{4\epsilon_0m_ec}nf\phi$ exactly when $\dfrac{e^2}{4\epsilon_0m_e}f=h\nu_0B_{lu}$.'),
    (r'Meaning.', r'$f$ (classical oscillator language) and $B_{lu}$ (quantum transition rate) are the same physics; the radio case (21 cm, $h\nu_0\ll\kappa_BT$) needs the full bracket of (6.65).')],
   [r'cold-gas limit removes stimulated emission', r'equate the two $\alpha_\nu$', r'relation follows'], xp=20)

ex('6.6', 'interstellar-medium', r'Three-level atom and population inversion',
   r'An atom has levels 1, 2, 3 and no transitions between 2 and 3. Using balance equations like (6.59) and neglecting radiative excitation, show $\dfrac{n_3}{n_2}=\dfrac{g_3(1+A_{21}/n_e\gamma_{21})}{g_2(1+A_{31}/n_e\gamma_{31})}e^{-E_{23}/\kappa_BT}$. Discuss when the populations are inverted.',
   [r'detailed balance of collisions: $\gamma_{lu}=\gamma_{ul}\dfrac{g_u}{g_l}e^{-E_{lu}/\kappa_BT}$'],
   [(r'Balance for each upper level separately (they only talk to level 1).',
     r'$n_2(A_{21}+\gamma_{21}n_e)=n_1\gamma_{12}n_e$, $n_3(A_{31}+\gamma_{31}n_e)=n_1\gamma_{13}n_e$.'),
    (r'Divide and use detailed balance.',
     r'$\dfrac{n_3}{n_2}=\dfrac{\gamma_{13}(A_{21}+\gamma_{21}n_e)}{\gamma_{12}(A_{31}+\gamma_{31}n_e)}=\dfrac{g_3}{g_2}e^{-E_{23}/\kappa_BT}\dfrac{1+A_{21}/n_e\gamma_{21}}{1+A_{31}/n_e\gamma_{31}}$.'),
    (r'High density.', r'$n_e\gamma\gg A$: the fractions $\to1$ and we recover Boltzmann.'),
    (r'Inversion ($n_3/g_3>n_2/g_2$).',
     r'Needs $\dfrac{1+A_{21}/n_e\gamma_{21}}{1+A_{31}/n_e\gamma_{31}}>e^{E_{23}/\kappa_BT}$: level 2 must drain radiatively much faster than level 3 ($A_{21}/\gamma_{21}\gg A_{31}/\gamma_{31}$) at a density where $A_{21}\gtrsim n_e\gamma_{21}$. Collisions pump both levels, but 2 empties quickly: that is the principle behind interstellar masers.')],
   [r'separate balance equations for 2 and 3', r'detailed balance relation between $\gamma_{lu}$ and $\gamma_{ul}$', r'Boltzmann limit at high $n_e$', r'inversion condition'], xp=30)

ex('6.7', 'interstellar-medium', r'Rotational lines of CO',
   r'CO emits at integer multiples of $115$ GHz. With $I$ the moment of inertia about an axis perpendicular to the molecule, show $E_J=\dfrac{\hbar^2}{2I}J(J+1)$ and that the selection rule $\Delta J=-1$ gives the observed spectrum. Estimate the C–O distance.',
   [r'$\vec L^2$ eigenvalues $\hbar^2J(J+1)$, $E=L^2/2I$'],
   [(r'Energy levels.', r'A rigid rotor has $E=L^2/2I$ and $L^2=\hbar^2J(J+1)$: $E_J=\dfrac{\hbar^2}{2I}J(J+1)$.'),
    (r'Lines.', r'$E_J-E_{J-1}=\dfrac{\hbar^2}{I}J$, so $\nu_J=\dfrac{\hbar}{2\pi I}J$: equally spaced, $J\times115$ GHz.'),
    (r'Moment of inertia and bond length.',
     r'$I=\dfrac{\hbar}{2\pi\times115\ \mathrm{GHz}}=<<6.7.I>>\ \mathrm{kg\,m^2}$; with the reduced mass $m=\frac{12\times16}{28}u=<<6.7.mred>>$ kg, $r=\sqrt{I/m}\approx<<6.7.r>>$ m $\approx1.1$ Å.')],
   [r'rigid-rotor levels', r'$\nu=J\hbar/2\pi I$', r'$I=mr^2$ with reduced mass, $r\approx1.1$ Å'], xp=20)

# ------------------------------------------------------------------ Chapter 7
ex('7.1', 'galactic-dynamics', r'Jeans theorem',
   r'If $K(\mathbf x,\mathbf v)$ is a constant of motion (energy, angular momentum), show that $f(K)$ is a time-independent solution of the collisionless Boltzmann equation.',
   [r'collisionless Boltzmann: $\dfrac{\partial f}{\partial t}+\mathbf v\cdot\nabla f-\nabla\Phi\cdot\dfrac{\partial f}{\partial\mathbf v}=0$, i.e. $df/dt=0$ along orbits'],
   [(r'Insert $f=f(K)$.', r'$\partial f/\partial t=0$ and $\mathbf v\cdot\nabla f-\nabla\Phi\cdot\partial_{\mathbf v}f=f\'(K)\left(\mathbf v\cdot\nabla K-\nabla\Phi\cdot\partial_{\mathbf v}K\right)$.'),
    (r'Recognise the bracket.', r'It is $dK/dt$ along an orbit ($\dot{\mathbf x}=\mathbf v$, $\dot{\mathbf v}=-\nabla\Phi$), which vanishes for a constant of motion.'),
    (r'Meaning.', r'Any function of integrals of motion is a steady state; e.g. $f(E)$ gives isotropic spherical systems, $f(E,L_z)$ axisymmetric ones (the converse statement is the strong Jeans theorem).')],
   [r'CBE as $df/dt=0$ along orbits', r'chain rule $f\'(K)\,dK/dt$', r'examples $f(E)$, $f(E,L_z)$'], xp=20)

ex('7.2', 'galactic-dynamics', r'Continuity equation from the CBE in cylindrical coordinates',
   r'Write the collisionless Boltzmann equation in cylindrical coordinates and, with no assumptions, integrate over velocity space to show $\dfrac{\partial n}{\partial t}+\dfrac{\partial}{\partial r}(n\langle\Pi\rangle)+\dfrac1r\dfrac{\partial}{\partial\theta}(n\langle\Theta\rangle)+\dfrac{\partial}{\partial z}(n\langle Z\rangle)+\dfrac{n\langle\Pi\rangle}{r}=0$.',
   [r'velocities $\Pi=\dot r$, $\Theta=r\dot\theta$, $Z=\dot z$'],
   [(r'The CBE in these variables.',
     r'$\partial_tf+\Pi\partial_rf+\dfrac\Theta r\partial_\theta f+Z\partial_zf+\left(\dfrac{\Theta^2}{r}-\partial_r\Phi\right)\partial_\Pi f-\left(\dfrac{\Pi\Theta}{r}+\dfrac1r\partial_\theta\Phi\right)\partial_\Theta f-\partial_z\Phi\,\partial_Zf=0$; the $\Theta^2/r$ and $\Pi\Theta/r$ terms are the centrifugal and Coriolis terms of $\dot\Pi$ and $\dot\Theta$.'),
    (r'Integrate the streaming terms over $d\Pi\,d\Theta\,dZ$.', r'They give $\partial_tn+\partial_r(n\langle\Pi\rangle)+\frac1r\partial_\theta(n\langle\Theta\rangle)+\partial_z(n\langle Z\rangle)$.'),
    (r'Integrate the acceleration terms by parts ($f\to0$ at large speed).',
     r'Potential terms and $\frac{\Theta^2}{r}\partial_\Pi f$ integrate to zero (coefficient independent of $\Pi$). But $-\displaystyle\int\frac{\Pi\Theta}{r}\partial_\Theta f\,d^3v=+\frac1r\int\Pi f\,d^3v=\frac{n\langle\Pi\rangle}{r}$.'),
    (r'Check.', r'It is the continuity equation $\partial_tn+\nabla\cdot(n\langle\mathbf v\rangle)=0$ written in cylindrical coordinates: $\frac1r\partial_r(rn\langle\Pi\rangle)=\partial_r(n\langle\Pi\rangle)+\frac{n\langle\Pi\rangle}r$.')],
   [r'centrifugal and Coriolis terms in the CBE', r'integration by parts', r'the extra $n\langle\Pi\rangle/r$ term', r'equivalence with $\nabla\cdot(n\langle\mathbf v\rangle)$'], xp=30)

ex('7.3', 'galactic-dynamics', r'Moments of the CBE: fluid equations for stars',
   r'From $\partial_tf+v_i\partial_{x_i}f+\dfrac{F_i}m\partial_{v_i}f=0$ show (2) $\partial_t(nm)+\partial_{x_i}(nm\langle v_i\rangle)=0$; multiplying by $mv_j$, (3) $\partial_t(nm\langle v_j\rangle)+\partial_{x_i}(nm\langle v_iv_j\rangle)-nF_j=0$; with $P_{ij}=nm\langle(v_i-\langle v_i\rangle)(v_j-\langle v_j\rangle)\rangle$ show (5) $nm\left(\partial_t\langle v_j\rangle+\langle v_i\rangle\partial_{x_i}\langle v_j\rangle\right)=-\partial_{x_i}P_{ji}+nF_j$. Do (2) and (5) look like fluid equations?',
   [r'$\int\partial_{v_i}f\,d^3v=0$, $\int v_j\partial_{v_i}f\,d^3v=-\delta_{ij}n$'],
   [(r'Zeroth moment.', r'$\int d^3v$ of the equation: the force term vanishes, giving (2).'),
    (r'First moment.', r'Multiply by $mv_j$ and integrate: $\int mv_jF_i/m\,\partial_{v_i}f=-F_jn$, giving (3).'),
    (r'Split the second moment.', r'$\langle v_iv_j\rangle=\langle v_i\rangle\langle v_j\rangle+P_{ij}/nm$. Expand (3) and subtract $\langle v_j\rangle\times$(2): the terms $\langle v_j\rangle[\partial_t(nm)+\partial_i(nm\langle v_i\rangle)]$ cancel, leaving (5).'),
    (r'Interpretation.', r'(2) is the continuity equation, (5) the Euler equation with an anisotropic pressure tensor $P_{ij}$ from velocity dispersion: the stellar "Jeans equations". Unlike a gas, nothing closes them (no equation of state), because stars do not collide.')],
   [r'zeroth and first velocity moments', r'integration by parts of the force term', r'pressure tensor from the dispersion', r'continuity + Euler analogy and the closure problem'], xp=30)

ex('7.4', 'galactic-dynamics', r'The King model',
   r'Take $f=A\left[e^{-\beta E}-1\right]$ for $E<0$ and $f=0$ for $E>0$, $E=\frac12v^2+\Phi$, $\Phi\to0$ at infinity. Find $\rho(r)$ (it involves the error function), write the equation replacing (7.19), solve it for $-\beta\Phi(0)=12,9,6,3$ and show that $\rho$ vanishes at a finite radius.',
   [r'$\rho=\displaystyle\int_0^{v_e}4\pi v^2f\,dv$, $v_e=\sqrt{-2\Phi}$', r'Poisson: $\dfrac1{r^2}\dfrac{d}{dr}\left(r^2\dfrac{d\Phi}{dr}\right)=4\pi G\rho$'],
   [(r'Density with $W=-\beta\Phi$.',
     r'$\displaystyle\int_0^{v_e}4\pi v^2e^{-\beta v^2/2}dv=\left(\frac{2\pi}\beta\right)^{3/2}\left[\mathrm{erf}\sqrt W-\sqrt{\frac{4W}\pi}e^{-W}\right]$ and $\int_0^{v_e}4\pi v^2dv=\frac{4\pi}3v_e^3$, so $\rho=A\left(\dfrac{2\pi}\beta\right)^{3/2}\left[e^W\mathrm{erf}\sqrt W-\sqrt{\dfrac{4W}\pi}\left(1+\dfrac{2W}3\right)\right]$.'),
    (r'Equation replacing (7.19).', r'$\dfrac1{r^2}\dfrac{d}{dr}\left(r^2\dfrac{dW}{dr}\right)=-4\pi G\beta\rho(W)$, with $W(0)=W_0$, $W\'(0)=0$. In units of $r_0=\sqrt{9/(4\pi G\beta\rho_c)}$ the right side is $-9\rho(W)/\rho(W_0)$.'),
    (r'Numerical result.', r'Integrating outward, $W$ (and $\rho$) reach zero at the tidal radius $r_t/r_0\approx<<7.4.r3>>$, $<<7.4.r6>>$, $<<7.4.r9>>$, $<<7.4.r12>>$ for $W_0=3,6,9,12$.'),
    (r'Meaning.', r'Subtracting the constant removes the stars with $E\ge0$ (they escape), so the mass is finite, unlike the isothermal sphere (7.16) with $\rho\propto r^{-2}$ forever. Larger $W_0$ means a more concentrated cluster: King models fit globular clusters well.')],
   [r'density integral with erf', r'Poisson equation in $W$', r'finite radius, growing with $W_0$', r'finite mass versus isothermal sphere'], xp=35)

# ------------------------------------------------------------------ Chapter 8
ex('8.1', 'interstellar-medium', r'Bernoulli\'s principle',
   r'For a steady flow, start from the Euler equation and show that $\frac12v^2+\displaystyle\int\frac{dp}{\rho}+\Phi=$ constant along a line of flow.',
   [r'Euler: $\partial_t\mathbf v+(\mathbf v\cdot\nabla)\mathbf v=-\dfrac1\rho\nabla p-\nabla\Phi$', r'$(\mathbf v\cdot\nabla)\mathbf v=\nabla\left(\tfrac12v^2\right)-\mathbf v\times(\nabla\times\mathbf v)$'],
   [(r'Steady flow and the vector identity.', r'$\nabla\left(\tfrac12v^2\right)-\mathbf v\times(\nabla\times\mathbf v)=-\dfrac{\nabla p}\rho-\nabla\Phi$.'),
    (r'Project on the flow direction ($\cdot\,\mathbf v$).', r'$\mathbf v\cdot(\mathbf v\times\boldsymbol\omega)=0$, and for a barotropic gas $\nabla p/\rho=\nabla\int dp/\rho$: $\mathbf v\cdot\nabla\left(\tfrac12v^2+\int\tfrac{dp}{\rho}+\Phi\right)=0$.'),
    (r'Conclusion.', r'The bracket is constant along each streamline (everywhere, if the flow is also irrotational). Faster flow means lower pressure.')],
   [r'steady Euler with the vector identity', r'dot with $\mathbf v$ kills the vorticity term', r'barotropic $\int dp/\rho$'], xp=20)

ex('8.2', 'interstellar-medium', r'Shearing a frozen-in field',
   r'A uniform field $\mathbf B=B_0\hat e_y$ sits in a perfectly conducting plasma. At $t=0$ the flow $\mathbf v=v_0e^{-y^2}\hat e_x$ is switched on. Find $\mathbf B(t)$ and sketch the field lines.',
   [r'ideal induction equation $\partial_t\mathbf B=\nabla\times(\mathbf v\times\mathbf B)$'],
   [(r'Compute $\mathbf v\times\mathbf B$.', r'$v_x\hat e_x\times(B_x\hat e_x+B_0\hat e_y)=v_0e^{-y^2}B_0\hat e_z$ ($B_x$ adds nothing since $\mathbf v\parallel\hat e_x$).'),
    (r'Take the curl.', r'$\nabla\times(F(y)\hat e_z)=F\'(y)\hat e_x$: $\partial_tB_x=-2yv_0B_0e^{-y^2}$, $\partial_tB_y=0$.'),
    (r'Solution.', r'$\mathbf B=B_0\hat e_y-2v_0B_0t\,ye^{-y^2}\hat e_x$: $B_x$ grows linearly in time.'),
    (r'Field lines.', r'$dx/dy=B_x/B_y=-2v_0t\,ye^{-y^2}$, i.e. $x=x_0+v_0te^{-y^2}$: each line is the initial straight line displaced by the fluid, a bump that moves to $+x$ around $y=0$ and grows. Flux freezing: the lines move with the plasma.')],
   [r'$\mathbf v\times\mathbf B$ and its curl', r'$B_x\propto t\,ye^{-y^2}$', r'field lines advected: $x=x_0+v_0te^{-y^2}$'], xp=25)

ex('8.3', 'interstellar-medium', r'Pressure in a current-carrying plasma column',
   r'A cylindrical plasma column carries a uniform current density $j\hat e_z$. Find $B_\theta(r)$; from (8.29) show the static equilibrium $\dfrac{d}{dr}\left(P+\dfrac{B_\theta^2}{2\mu_0}\right)+\dfrac{B_\theta^2}{\mu_0r}=0$, and find $P(r)$.',
   [r'Ampère: $\oint\mathbf B\cdot d\mathbf l=\mu_0I$', r'static (8.29): $0=-\nabla P+\dfrac1{\mu_0}(\nabla\times\mathbf B)\times\mathbf B$'],
   [(r'Field.', r'$2\pi rB_\theta=\mu_0j\pi r^2\Rightarrow B_\theta=\dfrac{\mu_0jr}2$ inside.'),
    (r'Force balance.', r'$\dfrac1{\mu_0}(\nabla\times\mathbf B)\times\mathbf B=-\nabla\dfrac{B^2}{2\mu_0}+\dfrac{(\mathbf B\cdot\nabla)\mathbf B}{\mu_0}$ and $(\mathbf B\cdot\nabla)\mathbf B=-\dfrac{B_\theta^2}r\hat e_r$ (curvature of circular field lines): the stated equation.'),
    (r'Integrate.', r'$\dfrac{d}{dr}\dfrac{B_\theta^2}{2\mu_0}=\dfrac{\mu_0j^2r}4$ and $\dfrac{B_\theta^2}{\mu_0r}=\dfrac{\mu_0j^2r}4$, so $\dfrac{dP}{dr}=-\dfrac{\mu_0j^2r}2$, $P=\dfrac{\mu_0j^2}4(a^2-r^2)$ with $P(a)=0$.'),
    (r'Meaning.', r'Magnetic pressure plus tension squeeze the column (the pinch), balanced by the gas pressure; this equilibrium is violently unstable (sausage and kink modes).')],
   [r'$B_\theta=\mu_0jr/2$', r'magnetic pressure and tension terms', r'$P=\frac{\mu_0j^2}{4}(a^2-r^2)$'], xp=25)

ex('8.4', 'interstellar-medium', r'Alfvén waves',
   r'Perturb a uniform field $B_0$ in an ideal plasma, neglecting pressure and gravity: $\rho\dfrac{d\mathbf v}{dt}=\dfrac{(\nabla\times\mathbf B)\times\mathbf B}{\mu_0}$. Show that the perturbations travel along $\mathbf B_0$ at $v_A=B_0/\sqrt{\mu_0\rho}$.',
   [r'$\partial_t\mathbf B=\nabla\times(\mathbf v\times\mathbf B)$'],
   [(r'Linearise with $\mathbf B=B_0\hat e_z+\mathbf b$, transverse $\mathbf v=v_x(z,t)\hat e_x$, $\mathbf b=b_x(z,t)\hat e_x$.',
     r'Induction: $\partial_tb_x=B_0\partial_zv_x$. Momentum: $(\nabla\times\mathbf b)\times B_0\hat e_z=B_0\partial_zb_x\hat e_x$, so $\rho\partial_tv_x=\dfrac{B_0}{\mu_0}\partial_zb_x$.'),
    (r'Combine.', r'$\partial_t^2v_x=\dfrac{B_0^2}{\mu_0\rho}\partial_z^2v_x$: a wave along $\mathbf B_0$ with speed $v_A=\dfrac{B_0}{\sqrt{\mu_0\rho}}$.'),
    (r'Picture.', r'Field lines behave like strings under tension $B^2/\mu_0$ loaded with the plasma mass: plucked strings. In the ISM ($B\sim10^{-10}$ T, $n\sim10^6\ \mathrm{m^{-3}}$) $v_A\sim2\ \mathrm{km\,s^{-1}}$.')],
   [r'linearised induction and momentum equations', r'wave equation', r'$v_A=B_0/\sqrt{\mu_0\rho}$ and the string analogy'], xp=25)

ex('8.5', 'interstellar-medium', r'Rise speed of a buoyant flux tube',
   r'A horizontal flux tube (field $B$, radius $a$) lies in an isothermal atmosphere with constant $g$ and scale height $\Lambda=P/\rho g$. The drag per unit length is $\frac12C_D\rho v^2a$. Show that it rises at the asymptotic speed $v_A\left(\dfrac{\pi a}{\Lambda C_D}\right)^{1/2}$, $v_A=B/\sqrt{\mu_0\rho}$.',
   [r'pressure balance: $P_e=P_i+B^2/2\mu_0$', r'same temperature inside and outside'],
   [(r'Density deficit.', r'Same $T$ means $\rho\propto P$: $\dfrac{\Delta\rho}{\rho}=\dfrac{P_e-P_i}{P_e}=\dfrac{B^2}{2\mu_0P}$.'),
    (r'Buoyant force per unit length.', r'$\Delta\rho\,g\pi a^2=\dfrac{\rho gB^2}{2\mu_0P}\pi a^2=\dfrac{\pi a^2B^2}{2\mu_0\Lambda}$.'),
    (r'Terminal velocity: buoyancy = drag.', r'$\dfrac{\pi a^2B^2}{2\mu_0\Lambda}=\dfrac12C_D\rho v^2a\Rightarrow v^2=\dfrac{B^2}{\mu_0\rho}\dfrac{\pi a}{\Lambda C_D}$, the stated result.'),
    (r'Use.', r'Magnetic buoyancy brings tubes generated by the solar dynamo to the surface, where they form sunspots.')],
   [r'$\Delta\rho/\rho=B^2/2\mu_0P$', r'buoyancy per length $\pi a^2B^2/2\mu_0\Lambda$', r'balance with drag gives $v\propto v_A\sqrt{a/\Lambda}$'], xp=25)

ex('8.6', 'active-galaxies', r'Relativistic Fermi acceleration',
   r'(Special relativity.) A relativistic particle moving in one dimension is reflected by reflectors moving with speeds $\pm U$. Show that the average energy gain per collision is (8.44), $\Delta E_{\rm ave}=4\left(\dfrac Uc\right)^2E$.',
   [r'Lorentz transformation of energy for $v\approx c$: $E\'=\gamma E(1\pm\beta)$, $\beta=U/c$'],
   [(r'Head-on collision (reflector approaching).', r'Transform into the reflector frame, reverse the momentum, transform back: $E_+=\gamma^2(1+\beta)^2E=\dfrac{1+\beta}{1-\beta}E$.'),
    (r'Overtaking collision (reflector receding).', r'$E_-=\dfrac{1-\beta}{1+\beta}E$.'),
    (r'Collision rates.', r'Head-on collisions are more frequent: rates $\propto c+U$ and $c-U$, probabilities $\frac{1\pm\beta}2$.'),
    (r'Average.', r'$\Delta E_{\rm ave}=\dfrac{1+\beta}2\dfrac{2\beta}{1-\beta}E-\dfrac{1-\beta}2\dfrac{2\beta}{1+\beta}E=\dfrac{4\beta^2}{1-\beta^2}E=4\gamma^2\beta^2E\approx4\left(\dfrac Uc\right)^2E$: second-order Fermi acceleration.')],
   [r'energy after head-on and overtaking reflections', r'collision probabilities $\propto c\pm U$', r'$4\beta^2\gamma^2E$, second order in $U/c$'], xp=30)

ex('8.7', 'interstellar-medium', r'Plasma oscillations with moving ions',
   r'Include the ions (charge $Ze$, mass $m_i$) in the plasma oscillation of §8.13. Show $\omega=\omega_p\sqrt{1+\dfrac{Zm_e}{m_i}}$.',
   [r'$\omega_p^2=\dfrac{n_ee^2}{\epsilon_0m_e}$ (8.77)', r'neutrality: $n_i=n_e/Z$'],
   [(r'Linearised equations for each fluid.', r'$m_e\dot v_e=-eE$, $m_i\dot v_i=ZeE$; continuity: $\dot n_e\'=-n_e\nabla\cdot\mathbf v_e$, $\dot n_i\'=-n_i\nabla\cdot\mathbf v_i$; Gauss: $\nabla\cdot\mathbf E=e(Zn_i\'-n_e\')/\epsilon_0$.'),
    (r'Differentiate Gauss in time twice.', r'$\ddot{(\nabla\cdot\mathbf E)}=\dfrac e{\epsilon_0}\left(-Zn_i\nabla\cdot\dot{\mathbf v}_i+n_e\nabla\cdot\dot{\mathbf v}_e\right)=-\left(\dfrac{n_ee^2}{\epsilon_0m_e}+\dfrac{n_iZ^2e^2}{\epsilon_0m_i}\right)\nabla\cdot\mathbf E$.'),
    (r'Frequency.', r'$\omega^2=\omega_p^2\left(1+\dfrac{n_iZ^2m_e}{n_em_i}\right)=\omega_p^2\left(1+\dfrac{Zm_e}{m_i}\right)$: the ions add a tiny correction ($\sim1/1836$ for hydrogen).')],
   [r'two-fluid linearised equations', r'restoring forces add', r'$\omega^2=\omega_p^2(1+Zm_e/m_i)$'], xp=25)

ex('8.8', 'interstellar-medium', r'Pulsar dispersion from the plasma dispersion relation',
   r'From $\omega^2=\omega_p^2+k^2c^2$ (8.82) show $v_{gr}=c\sqrt{1-\omega_p^2/\omega^2}$. With $T_a=\displaystyle\int_0^L\frac{ds}{v_{gr}}$ and $\omega_p\ll\omega$, show that signals of different frequency are dispersed as in (6.68), $\dfrac{dT_a}{d\omega}=-\dfrac{e^2}{\epsilon_0m_ec\,\omega^3}\displaystyle\int n_e\,ds$.',
   [r'$v_{gr}=d\omega/dk$'],
   [(r'Group velocity.', r'$2\omega\,d\omega=2c^2k\,dk\Rightarrow v_{gr}=\dfrac{c^2k}\omega=c\sqrt{1-\omega_p^2/\omega^2}$ (always $<c$).'),
    (r'Arrival time, expanded.', r'$T_a=\displaystyle\int\frac{ds}{c}\left(1-\frac{\omega_p^2}{\omega^2}\right)^{-1/2}\approx\frac Lc+\frac{1}{2c\omega^2}\int\omega_p^2ds=\frac Lc+\frac{e^2}{2\epsilon_0m_ec\,\omega^2}\int n_e\,ds$.'),
    (r'Dispersion.', r'$\dfrac{dT_a}{d\omega}=-\dfrac{e^2}{\epsilon_0m_ec\,\omega^3}\displaystyle\int n_e\,ds$ (6.68): low frequencies arrive later; measuring the delay gives the dispersion measure $\int n_e\,ds$, hence pulsar distances.')],
   [r'$v_{gr}=c\sqrt{1-\omega_p^2/\omega^2}$', r'binomial expansion of $1/v_{gr}$', r'$dT_a/d\omega\propto-\omega^{-3}\int n_eds$'], xp=25)
