# Choudhuri exercises, Ch. 9-14 (see part1.py for the format). Ch. 12-13 go to the Relativity Annex room.
EX = []
def ex(num, room, title, goal, given, steps, keys, xp=25, note=None):
    EX.append(dict(num=num, room=room, title=title, goal=goal, given=given, steps=steps, keys=keys, xp=xp, note=note))
GR = 'relativity-annex'

# ------------------------------------------------------------------ Chapter 9
ex('9.1', 'active-galaxies', r'Total light of a de Vaucouleurs galaxy',
   r'An elliptical galaxy appears circular with the de Vaucouleurs profile $I(r)=I_e\exp\left\{-7.67\left[(r/r_e)^{1/4}-1\right]\right\}$ (9.2). Show that the total light $\int_0^\infty I\,2\pi r\,dr=7.22\pi r_e^2I_e$, and that exactly half comes from within $r_e$.',
   [r'$\displaystyle\int_0^\infty u^7e^{-bu}du=\frac{7!}{b^8}$; incomplete gamma function $\gamma(8,b)$'],
   [(r'Substitute $u=(r/r_e)^{1/4}$.', r'$r=r_eu^4$, $dr=4r_eu^3du$: $L=2\pi r_e^2I_ee^{b}\displaystyle\int_0^\infty4u^7e^{-bu}du$ with $b=7.67$.'),
    (r'Total.', r'$L=8\pi r_e^2I_e\dfrac{e^b\,7!}{b^8}=<<9.1.tot>>\,\pi r_e^2I_e$, i.e. $7.22\pi r_e^2I_e$.'),
    (r'Light within $r_e$ ($u\le1$).', r'Fraction $=\gamma(8,b)/7!=<<9.1.frac>>$: one half. That is why $b=7.67$: it is chosen so that $r_e$ is the half-light (effective) radius.')],
   [r'substitution $u=(r/r_e)^{1/4}$', r'gamma integral $7!/b^8$', r'half-light property defines $b$'], xp=25)

ex('9.2', 'active-galaxies', r'Faber–Jackson slope from Fig. 9.5',
   r'From Figure 9.5 argue that $\sigma\propto L^\alpha$ and estimate $\alpha$.',
   [r'on a log–log plot a power law is a straight line with slope $\alpha$'],
   [(r'Read the figure.', r'Plot (or read) $\log\sigma$ against $\log L$ (or absolute magnitude, $\log L=-0.4M+$ const): the ellipticals lie along a straight band.'),
    (r'Slope.', r'Over a factor $\sim100$ in $L$ (5 magnitudes) $\sigma$ grows by a factor $\sim3$: $\alpha\approx\log3/\log100\approx0.25$, i.e. $L\propto\sigma^4$ (Faber–Jackson).'),
    (r'Why roughly 4?', r'Virial theorem $\sigma^2\propto M/R$ with a constant mass-to-light ratio and constant surface brightness ($L\propto R^2$) gives $L\propto\sigma^4$.')],
   [r'log–log straight line', r'$\alpha\approx1/4$', r'virial argument for $L\propto\sigma^4$'], xp=15,
   note=r'Read the actual points in Fig. 9.5 of the book; the slope there should come out near $1/4$.')

ex('9.3', 'active-galaxies', r'Maximum superluminal motion',
   r'A jet blob moves at $0.98c$. At what angle to the line of sight is the apparent superluminal motion largest, and what is the maximum apparent transverse velocity?',
   [r'$v_{\rm app}=\dfrac{v\sin\theta}{1-\beta\cos\theta}$'],
   [(r'Maximise.', r'$\dfrac{d}{d\theta}\dfrac{\sin\theta}{1-\beta\cos\theta}=0\Rightarrow\cos\theta=\beta$.'),
    (r'Numbers.', r'$\theta=\arccos0.98\approx<<9.3.th>>^\circ$; $v_{\rm app,max}=\beta\gamma c=0.98\times<<9.3.g>>\,c\approx<<9.3.vapp>>c$.'),
    (r'Why faster than light?', r'The blob almost catches up with its own light: emission times are compressed by $1-\beta\cos\theta$, so the projected motion looks faster than $c$ though nothing moves faster than light.')],
   [r'apparent velocity formula', r'$\cos\theta=\beta$', r'$v_{\max}=\beta\gamma c\approx4.9c$'], xp=20)

ex('9.4', 'active-galaxies', r'Synchrotron electrons in a radio jet',
   r'With $B\sim10^{-10}$ T in jets, estimate $\gamma$ of electrons emitting synchrotron radio waves and their cooling time from (8.59). Compare with the travel time over a $1$ Mpc jet at $0.1c$. Must the electrons be re-accelerated in the jet?',
   [r'$\nu\approx\gamma^2\nu_g$, $\nu_g=\dfrac{eB}{2\pi m_e}$', r'(8.59): $P=\frac43\sigma_Tc\gamma^2U_B$, $U_B=B^2/2\mu_0$'],
   [(r'Lorentz factor for $\nu\approx1$ GHz.', r'$\nu_g=<<9.4.nug>>$ Hz, so $\gamma\approx\sqrt{10^9/\nu_g}\approx<<9.4.gam>>$.'),
    (r'Cooling time.', r'$t=\dfrac{\gamma m_ec^2}{P}=\dfrac{m_ec}{\frac43\sigma_T\gamma U_B}\approx<<9.4.tc>>$ yr, with $U_B=<<9.4.UB>>\ \mathrm{J\,m^{-3}}$.'),
    (r'Travel time.', r'$1\ \mathrm{Mpc}/0.1c\approx<<9.4.tt>>$ yr: shorter than the synchrotron cooling time.'),
    (r'Verdict and caveat.', r'Synchrotron losses alone would let nucleus-accelerated electrons reach the lobes. But inverse Compton scattering on the CMB acts like a field with $U_{\rm CMB}=<<9.4.UCMB>>\ \mathrm{J\,m^{-3}}$ (10 times $U_B$), cutting the lifetime to $\approx<<9.4.tIC>>$ yr; with stronger fields in the lobes and adiabatic losses, in-situ acceleration (shocks, hot spots) is in fact needed.')],
   [r'$\gamma\sim10^4$ from $\nu\sim\gamma^2\nu_g$', r'$t_{\rm cool}=m_ec/(\frac43\sigma_T\gamma U_B)$', r'compare with $L/v$', r'inverse Compton caveat'], xp=30)

ex('9.5', 'active-galaxies', r'Are galaxy clusters virialized?',
   r'Estimate the time a galaxy takes to cross a cluster of galaxies and the relaxation time. A cluster is clearly not relaxed, but the virial theorem only needs it to be virialized. Are typical clusters virialized?',
   [r'cluster: $R\sim1$ Mpc, $v\sim10^3\ \mathrm{km\,s^{-1}}$, $N\sim10^3$ galaxies', r'(7.14): $T_{\rm rel}\approx N\,T_{\rm cross}$'],
   [(r'Crossing time.', r'$T_{\rm cross}=R/v\approx<<9.5.tcr>>$ yr, about $10^9$ yr.'),
    (r'Relaxation time.', r'$T_{\rm rel}\approx NT_{\rm cross}\approx<<9.5.trel>>$ yr, far longer than the age of the Universe: two-body encounters have not relaxed the cluster.'),
    (r'Virialized?', r'The age ($\sim10^{10}$ yr) is about ten crossing times: enough for violent relaxation to bring the system into a steady state, so rich clusters are roughly virialized (supported by their smooth X-ray gas). Young, irregular clusters with substructure are not, and the virial mass there is uncertain.')],
   [r'$T_{\rm cross}\sim10^9$ yr', r'$T_{\rm rel}\sim N T_{\rm cross}\gg$ age', r'virial equilibrium needs only a few crossing times'], xp=20)

# ------------------------------------------------------------------ Chapter 10
ex('10.1', 'expanding-universe', r'Density parameter independent of $h$',
   r'Distances from Hubble\'s law scale as $h^{-1}$. If the mean density comes from virial masses of galaxy clusters, show that the density parameter is independent of the uncertainty in $H_0$.',
   [r'$\rho_c=\dfrac{3H_0^2}{8\pi G}\propto h^2$', r'virial mass $M\approx\sigma^2R/G$'],
   [(r'How each ingredient scales with $h$.', r'$\sigma$ is measured (redshifts): no $h$. $R=\theta d\propto h^{-1}$, so $M\propto h^{-1}$. The number of clusters per unit volume $\propto d^{-3}\propto h^3$.'),
    (r'Density.', r'$\rho=n_{\rm cl}M\propto h^3h^{-1}=h^2$ (equivalently, $M/L\propto h$ and the luminosity density $\propto h$).'),
    (r'Density parameter.', r'$\Omega=\rho/\rho_c\propto h^2/h^2$: independent of $h$. That is why $\Omega_{M,0}\approx0.3$ was robust while $H_0$ was still disputed.')],
   [r'$R\propto h^{-1}$, $M\propto h^{-1}$', r'$n\propto h^3$, $\rho\propto h^2$', r'$\Omega\propto h^0$'], xp=20)

ex('10.2', 'expanding-universe', r'Age of the Universe when quasar light left',
   r'For quasars at $z=1$ and $z=4$, find the age of the Universe (as a fraction of today\'s) when the light left, for $\Omega_{M,0}=1$. Estimate the errors if instead $\Omega_{M,0}=0.5$ or $1.5$ (matter only).',
   [r'$H^2=H_0^2\left[\Omega_{M,0}a^{-3}+(1-\Omega_{M,0})a^{-2}\right]$, $a=1/(1+z)$', r'$t(a)=\displaystyle\int_0^a\frac{da\'}{a\'H(a\')}$'],
   [(r'Einstein–de Sitter.', r'$a\propto t^{2/3}$, so $t/t_0=(1+z)^{-3/2}$: $<<10.2.f1>>$ at $z=1$, $<<10.2.f4>>$ at $z=4$.'),
    (r'$\Omega_{M,0}=0.5$ (open).', r'Integrating numerically: $t/t_0=<<10.2.l1>>$ and $<<10.2.l4>>$, i.e. $<<10.2.el1>>\%$ and $<<10.2.el4>>\%$ larger than the EdS estimate.'),
    (r'$\Omega_{M,0}=1.5$ (closed).', r'$t/t_0=<<10.2.h1>>$ and $<<10.2.h4>>$: $<<10.2.eh1>>\%$ and $<<10.2.eh4>>\%$.'),
    (r'Lesson.', r'The fraction depends only weakly on $\Omega$; the error grows with $z$ because the curvature term changes the early expansion history relative to today.')],
   [r'$(1+z)^{-3/2}$ for EdS', r'numerical integral for $\Omega\neq1$', r'errors of order 10 % growing with $z$'], xp=25)

ex('10.3', 'expanding-universe', r'Age against $\Omega_{M,0}$ (Fig. 10.6)',
   r'Assuming a matter-dominated Universe, calculate numerically the age for different $\Omega_{M,0}$ and reproduce Figure 10.6.',
   [r'$H_0t_0=\displaystyle\int_0^1\frac{da}{\sqrt{\Omega_{M,0}/a+1-\Omega_{M,0}}}$'],
   [(r'Derive the integral.', r'Friedmann with $\rho\propto a^{-3}$ and curvature fixed by $\Omega_{M,0}$: $\dot a=H_0\sqrt{\Omega_{M,0}/a+1-\Omega_{M,0}}$, and $t_0=\int_0^1da/\dot a$.'),
    (r'Values of $H_0t_0$.', r'$\Omega=0.1$: $<<10.3.o01>>$; $0.3$: $<<10.3.o03>>$; $0.5$: $<<10.3.o05>>$; $1$: $<<10.3.o10>>$ (exactly $2/3$); $2$: $<<10.3.o20>>$ (exactly $\pi/2-1$).'),
    (r'In years ($h=0.7$, $1/H_0=13.97$ Gyr).', r'From $<<10.3.t01>>$ Gyr ($\Omega=0.1$) down to $<<10.3.t10>>$ Gyr ($\Omega=1$): younger than the oldest globular clusters for $\Omega=1$, the old "age problem" solved by $\Omega_\Lambda$.')],
   [r'age integral', r'$2/3$ for $\Omega=1$, larger for open models', r'age problem'], xp=25)

ex('10.4', 'expanding-universe', r'Radiation-only universes',
   r'Suppose the Universe had only radiation. Solve the Friedmann equation for $k=0,+1,-1$ and sketch $a(t)$.',
   [r'$\dot a^2=\dfrac{8\pi G}3\rho a^2-kc^2$, $\rho\propto a^{-4}$: $\dot a^2=\dfrac{C}{a^2}-kc^2$, $C=\dfrac{8\pi G}{3}\rho_0a_0^4$'],
   [(r'Use $u=a^2$.', r'$a\dot a=\sqrt{C-kc^2a^2}\Rightarrow\dot u=2\sqrt{C-kc^2u}$.'),
    (r'$k=0$.', r'$u=2\sqrt Ct$: $a=(2\sqrt C\,t)^{1/2}\propto t^{1/2}$.'),
    (r'$k=\pm1$.', r'$k=+1$: $\sqrt{C-c^2u}=\sqrt C-c^2t$, so $a=\sqrt{2\sqrt Ct-c^2t^2}$: a half circle, maximum at $t=\sqrt C/c^2$, crunch at $2\sqrt C/c^2$. $k=-1$: $a=\sqrt{2\sqrt Ct+c^2t^2}$, approaching $a\approx ct$ (coasting).'),
    (r'Sketch.', r'All three start as $t^{1/2}$ at small $t$ (curvature is irrelevant early); they separate when $kc^2a^2\sim C$.')],
   [r'$a\dot a=\sqrt{C-kc^2a^2}$', r'three closed-form solutions', r'same $t^{1/2}$ start'], xp=25)

ex('10.5', 'expanding-universe', r'Creation rate in the steady-state theory',
   r'In the steady-state theory the density stays constant through continuous creation of matter. Using (9.17) and (10.43), estimate how many hydrogen atoms must be created per year in $1\ \mathrm{km^3}$.',
   [r'(10.43): $\rho_{M,0}=1.88\times10^{-26}\,\Omega_{M,0}h^2\ \mathrm{kg\,m^{-3}}$', r'$\dot n=3Hn$ keeps $n$ constant while volumes grow as $a^3$'],
   [(r'Why $3H$?', r'A comoving volume grows as $a^3$: $\dot V/V=3H$. To keep $n=N/V$ constant, $\dot N=3HN$ per volume.'),
    (r'Numbers ($\Omega_{M,0}=0.3$, $h=0.7$).', r'$n=\rho/m_H\approx<<10.5.n>>\ \mathrm{m^{-3}}$, $H_0=<<10.5.H0>>\ \mathrm{s^{-1}}$; $3H_0n\times10^9\ \mathrm{m^3}\times1$ yr gives $\approx<<10.5.rate>>$ atoms per $\mathrm{km^3}$ per year (about $<<10.5.rate1>>$ for the critical density).'),
    (r'Comment.', r'About one atom per cubic kilometre per year: far too little to test in a laboratory. The theory failed on other grounds (CMB, evolution of radio sources).')],
   [r'$\dot n=3Hn$', r'$\sim1$ atom per $\mathrm{km^3}$ per year', r'untestable locally, ruled out by the CMB'], xp=20)

# ------------------------------------------------------------------ Chapter 11
ex('11.1', 'early-universe', r'Number and energy densities of relativistic bosons and fermions',
   r'(a) Using $\zeta(n)=\sum k^{-n}$ and $\dfrac1{e^x-1}=\sum_{k\ge1}e^{-kx}$, derive (11.9) for bosons from (11.7), and (11.10) from (11.8) using $\zeta(4)=\pi^4/90$. (b) With $I_n^\pm=\displaystyle\int_0^\infty\frac{x^ndx}{e^x\pm1}$ show $I_n^--I_n^+=2^{-n}I_n^-$ and derive the fermion results.',
   [r'(11.7): $n=\dfrac{g}{2\pi^2\hbar^3}\displaystyle\int\frac{p^2dp}{e^{pc/\kappa_BT}\pm1}$, (11.8): $\rho=\dfrac{g}{2\pi^2\hbar^3c^2}\displaystyle\int\frac{p^3c\,dp}{e^{pc/\kappa_BT}\pm1}$'],
   [(r'Boson integrals.', r'$I_n^-=\sum_k\displaystyle\int x^ne^{-kx}dx=\sum_k\frac{n!}{k^{n+1}}=n!\,\zeta(n+1)$: $I_2^-=2\zeta(3)$, $I_3^-=6\zeta(4)=\pi^4/15$.'),
    (r'Boson results.', r'$n=\dfrac{g}{2\pi^2}\left(\dfrac{\kappa_BT}{\hbar c}\right)^32\zeta(3)=\dfrac{\zeta(3)}{\pi^2}g\left(\dfrac{\kappa_BT}{\hbar c}\right)^3$ (11.9); $\rho c^2=\dfrac{g}{2\pi^2}\dfrac{(\kappa_BT)^4}{(\hbar c)^3}\dfrac{\pi^4}{15}=\dfrac g2a_BT^4$ (11.10).'),
    (r'(b) The difference of the two integrals.', r'$\dfrac1{e^x-1}-\dfrac1{e^x+1}=\dfrac2{e^{2x}-1}$, so $I_n^--I_n^+=2\displaystyle\int\frac{x^ndx}{e^{2x}-1}=\frac{2}{2^{n+1}}I_n^-=2^{-n}I_n^-$.'),
    (r'Fermions.', r'$I_n^+=(1-2^{-n})I_n^-$: factor $\frac34$ for $n$ ($n=2$) and $\frac78$ for $\rho$ ($n=3$): $n_F=\frac34\dfrac{\zeta(3)}{\pi^2}g\left(\dfrac{\kappa_BT}{\hbar c}\right)^3$, $\rho_Fc^2=\frac78\dfrac g2a_BT^4$.')],
   [r'geometric series and $n!\zeta(n+1)$', r'boson $n$ and $\rho$', r'$I^--I^+=2^{-n}I^-$', r'fermion factors $3/4$ and $7/8$'], xp=30)

ex('11.2', 'early-universe', r'Helium if neutrons froze out at 0.4 MeV',
   r'If $n+\nu_e\leftrightarrow p+e^-$ had dropped below the expansion rate only at $T\approx0.4$ MeV, what would the helium abundance be?',
   [r'(11.21): $n_n/n_p=e^{-(m_n-m_p)c^2/\kappa_BT}$, $(m_n-m_p)c^2=1.29$ MeV', r'(11.23): $Y=\dfrac{2(n_n/n_p)}{1+n_n/n_p}$'],
   [(r'Frozen ratio.', r'$n_n/n_p=e^{-1.29/0.4}\approx<<11.2.r>>$ (instead of 0.20 at 0.8 MeV).'),
    (r'Helium mass fraction.', r'$Y\approx\dfrac{2\times<<11.2.r>>}{1+<<11.2.r>>}\approx<<11.2.Y>>$, an upper bound; neutron decay before nucleosynthesis lowers it further.'),
    (r'Lesson.', r'$Y$ is exponentially sensitive to the freeze-out temperature, which is set by the weak rate versus $H$. The observed $Y\approx0.25$ therefore tests the weak interaction and the expansion rate (e.g. the number of neutrino species).')],
   [r'Boltzmann factor at 0.4 MeV', r'$Y\approx0.08$', r'sensitivity to freeze-out'], xp=20)

ex('11.3', 'early-universe', r'Chemical potentials of electrons and positrons',
   r'Before $e^+e^-$ annihilation there were slightly more electrons than positrons. Show that their chemical potentials must then be non-zero, and explain how to calculate them.',
   [r'equilibrium $e^-+e^+\leftrightarrow2\gamma$ gives $\mu_-+\mu_+=0$', r'relativistic fermions: $n_--n_+=\dfrac{g}{6\pi^2}\left(\dfrac{\kappa_BT}{\hbar c}\right)^3\left[\pi^2\dfrac{\mu}{\kappa_BT}+\left(\dfrac{\mu}{\kappa_BT}\right)^3\right]$'],
   [(r'Why $\mu\ne0$.', r'With $\mu=0$ the Fermi–Dirac distributions of $e^-$ and $e^+$ are identical, so $n_-=n_+$. An excess needs $\mu_->0$; the pair equilibrium with photons ($\mu_\gamma=0$) forces $\mu_+=-\mu_-$.'),
    (r'Condition that fixes $\mu$.', r'Charge neutrality: $n_--n_+=n_p\approx\eta n_\gamma$ with $\eta\sim6\times10^{-10}$.'),
    (r'Solve.', r'For $\mu\ll\kappa_BT$ the bracket is linear: $\dfrac{g}{6}\left(\dfrac{\kappa_BT}{\hbar c}\right)^3\dfrac{\mu}{\kappa_BT}=\eta\dfrac{2\zeta(3)}{\pi^2}\left(\dfrac{\kappa_BT}{\hbar c}\right)^3$, so with $g=2$: $\dfrac{\mu}{\kappa_BT}=\dfrac{6\zeta(3)}{\pi^2}\eta\approx0.7\eta\sim10^{-9}$, tiny but non-zero, and constant while the gas stays relativistic.')],
   [r'$\mu_++\mu_-=0$ from pair equilibrium', r'neutrality fixes the excess', r'$\mu/\kappa_BT\sim\eta$'], xp=25)

ex('11.4', 'early-universe', r'Recombination temperature from the Saha equation',
   r'Estimate the gas pressure at $z\approx1100$, take hydrogen at that pressure, and use the Saha equation (2.29) to compute $x(T)$. At what temperature does $x$ change from near 0 to near 1?',
   [r'$n_b=n_{b,0}(1+z)^3$, $n_{b,0}=\rho_{B,0}/m_H$ with $\Omega_{B,0}h^2\approx0.022$', r'$T=T_0(1+z)$, $T_0=2.725$ K'],
   [(r'Conditions at $z=1100$.', r'$T\approx<<11.4.T>>$ K, $n\approx<<11.4.n>>\ \mathrm{m^{-3}}$, $P=n\kappa_BT\approx<<11.4.P>>$ Pa: an excellent laboratory vacuum.'),
    (r'Saha at that pressure (as in Exercise 2.3).', r'Results: <<11.4.table>>.'),
    (r'Transition.', r'$x=1/2$ at $T\approx<<11.4.Thalf>>$ K, and the change from 0.1 to 0.9 happens within a few hundred K. Hydrogen recombines at $\sim3500$ K, not at $\chi/\kappa_B=1.6\times10^5$ K, because there are $\sim10^9$ photons per baryon: the Wien tail keeps ionizing until $\kappa_BT\approx\chi/40$.')],
   [r'$n$, $T$, $P$ at $z=1100$', r'Saha solved for $x(T)$', r'transition near $3500$–$4000$ K', r'why $\kappa_BT\ll\chi$ (photon-to-baryon ratio)'], xp=30)

ex('11.5', 'early-universe', r'Cluster distance from SZ effect plus X-rays',
   r'From the Sunyaev–Zeldovich effect we know the optical depth $\tau=2\sigma_TR_cn_e$ through the cluster centre; the X-ray flux is $f_\nu=\dfrac{\frac43\pi R_c^3\epsilon_\nu}{4\pi D^2}$ with $\epsilon_\nu=\dfrac{An_e^2}{\sqrt T}e^{-h\nu/\kappa_BT}$. With the angular size $\theta=2R_c/D$ show $D=\dfrac{A\theta}{24\sigma_T^2\sqrt T}e^{-h\nu/\kappa_BT}\dfrac{\tau^2}{f_\nu}$.',
   [r'$T$ from the X-ray spectrum'],
   [(r'Eliminate $n_e$.', r'$n_e=\dfrac{\tau}{2\sigma_TR_c}$, so $\epsilon_\nu=\dfrac{A\tau^2}{4\sigma_T^2R_c^2\sqrt T}e^{-h\nu/\kappa_BT}$.'),
    (r'Insert in $f_\nu$.', r'$f_\nu=\dfrac{R_c^3\epsilon_\nu}{3D^2}=\dfrac{R_cA\tau^2}{12\sigma_T^2\sqrt TD^2}e^{-h\nu/\kappa_BT}$.'),
    (r'Use $R_c=\theta D/2$.', r'$f_\nu=\dfrac{\theta A\tau^2}{24\sigma_T^2\sqrt T\,D}e^{-h\nu/\kappa_BT}$, which gives the stated $D$.'),
    (r'Why it works.', r'The SZ decrement is linear in $n_e$, the X-ray emission quadratic: their combination fixes the physical size $R_c$, and with $\theta$ the distance, independent of the distance ladder (hence $H_0$).')],
   [r'$n_e$ from $\tau$', r'flux with $R_c^3/3D^2$', r'$R_c=\theta D/2$', r'linear versus quadratic in $n_e$'], xp=25)

ex('11.6', 'early-universe', r'Growth of a density perturbation, $\delta\propto t^{2/3}$',
   r'A spherical shell at $a(t)$ is perturbed to $a+l$. Show $\ddot l=\dfrac{2GM}{a^3}l=\dfrac{8\pi G}3\rho l$. With $\delta=\delta\rho/\rho=-3l/a$ and a marginally critical background, derive $\ddot\delta+\dfrac4{3t}\dot\delta-\dfrac2{3t^2}\delta=0$ and show that $\delta\propto t^{2/3}$ solves it.',
   [r'$\ddot a=-GM/a^2$; critical: $a\propto t^{2/3}$, $\dfrac{8\pi G}3\rho=\dfrac{\dot a^2}{a^2}=\dfrac4{9t^2}$'],
   [(r'Linearise.', r'$\ddot a+\ddot l=-\dfrac{GM}{(a+l)^2}\approx-\dfrac{GM}{a^2}+\dfrac{2GM}{a^3}l$, so $\ddot l=\dfrac{2GM}{a^3}l=\dfrac{8\pi G}{3}\rho\,l$.'),
    (r'Change to $\delta=-3l/a$.', r'$l=-a\delta/3$: $\ddot l=-\frac13(\ddot a\delta+2\dot a\dot\delta+a\ddot\delta)$. With $\ddot a/a=-\frac{4\pi G}3\rho$: $\ddot\delta+2\dfrac{\dot a}a\dot\delta-4\pi G\rho\,\delta=0$.'),
    (r'Insert the critical background.', r'$\dot a/a=\dfrac2{3t}$, $4\pi G\rho=\dfrac2{3t^2}$: $\ddot\delta+\dfrac4{3t}\dot\delta-\dfrac2{3t^2}\delta=0$.'),
    (r'Power laws.', r'$\delta=t^s$: $s(s-1)+\frac43s-\frac23=0\Rightarrow s=\frac23$ or $s=-1$. The growing mode $\delta\propto t^{2/3}\propto a$: perturbations grow only like the scale factor, so from $\delta\sim10^{-5}$ at $z=1100$ they reach $\sim10^{-2}$ today without dark matter (structure-formation argument for dark matter).')],
   [r'linearised shell equation', r'$\ddot\delta+2H\dot\delta-4\pi G\rho\delta=0$', r'$s=2/3$ and $s=-1$', r'$\delta\propto a$'], xp=30)

# ------------------------------------------------------------------ Chapter 12 (Relativity Annex)
ex('12.1', GR, r'Curvature of three 2D metrics',
   r'Work out the Christoffel symbols, Riemann and Ricci tensors and the scalar curvature for $ds^2=dr^2+r^2d\theta^2$, $ds^2=a^2(d\theta^2+\sin^2\theta\,d\phi^2)$ and $ds^2=a^2(d\chi^2+\sinh^2\chi\,d\eta^2)$.',
   [r'$\Gamma^i_{kl}=\frac12g^{im}(\partial_kg_{ml}+\partial_lg_{mk}-\partial_mg_{kl})$', r'in 2D: $R_{ik}=\frac R2g_{ik}$, one independent component $R_{1212}$'],
   [(r'Plane (polar coordinates).', r'$\Gamma^r_{\theta\theta}=-r$, $\Gamma^\theta_{r\theta}=1/r$; $R^r{}_{\theta r\theta}=\partial_r\Gamma^r_{\theta\theta}-\Gamma^r_{\theta\theta}\Gamma^\theta_{\theta r}\ldots=-1+1=0$: flat, $R=0$ (only the coordinates are curved).'),
    (r'Sphere.', r'$\Gamma^\theta_{\phi\phi}=-\sin\theta\cos\theta$, $\Gamma^\phi_{\theta\phi}=\cot\theta$; $R_{\theta\phi\theta\phi}=a^2\sin^2\theta$, $R_{\theta\theta}=1$, $R_{\phi\phi}=\sin^2\theta$, $R=\dfrac2{a^2}$.'),
    (r'Pseudosphere.', r'Same with $\sin\to\sinh$: $\Gamma^\chi_{\eta\eta}=-\sinh\chi\cosh\chi$, $\Gamma^\eta_{\chi\eta}=\coth\chi$; $R_{\chi\chi}=-1$, $R_{\eta\eta}=-\sinh^2\chi$, $R=-\dfrac2{a^2}$.'),
    (r'Pattern.', r'Constant curvature $K=R/2=+1/a^2,0,-1/a^2$: the 2D analogues of closed, flat and open Robertson–Walker spaces (the sign convention of the book fixes the sign of $R$).')],
   [r'correct Christoffel symbols', r'flat plane has $R=0$', r'$R=\pm2/a^2$', r'link to $k=+1,0,-1$'], xp=35)

ex('12.2', GR, r'Covariant derivatives do not commute',
   r'Show that two covariant derivatives in general do not commute, and for a contravariant vector $\left(\dfrac{D}{Dx^k}\dfrac{D}{Dx^l}-\dfrac{D}{Dx^l}\dfrac{D}{Dx^k}\right)A^i=-R^i{}_{mlk}A^m$ (book sign convention).',
   [r'$A^i{}_{;l}=\partial_lA^i+\Gamma^i_{ml}A^m$', r'$T^i{}_{l;k}=\partial_kT^i{}_l+\Gamma^i_{mk}T^m{}_l-\Gamma^m_{lk}T^i{}_m$'],
   [(r'Second derivative.', r'$A^i{}_{;l;k}=\partial_k(\partial_lA^i+\Gamma^i_{ml}A^m)+\Gamma^i_{nk}(\partial_lA^n+\Gamma^n_{ml}A^m)-\Gamma^n_{lk}A^i{}_{;n}$.'),
    (r'Antisymmetrise in $k,l$.', r'$\partial_k\partial_lA^i$ and $\Gamma^n_{lk}A^i{}_{;n}$ are symmetric and cancel; the terms $\Gamma\,\partial A$ cancel crosswise. What is left multiplies $A^m$: $\left(\partial_k\Gamma^i_{ml}-\partial_l\Gamma^i_{mk}+\Gamma^i_{nk}\Gamma^n_{ml}-\Gamma^i_{nl}\Gamma^n_{mk}\right)A^m$.'),
    (r'Identify.', r'With the book\'s definition (12.37), $R^i{}_{mlk}=\partial_l\Gamma^i_{mk}-\partial_k\Gamma^i_{ml}+\Gamma^n_{mk}\Gamma^i_{nl}-\Gamma^n_{ml}\Gamma^i_{nk}$, the bracket is exactly $-R^i{}_{mlk}$. Since $\frac{D}{Dx^k}\frac{D}{Dx^l}A^i=A^i{}_{;l;k}$, this is the stated result. Derivatives commute only where the curvature vanishes.')],
   [r'covariant derivative of a mixed tensor', r'symmetric pieces cancel', r'Riemann tensor emerges, sign by convention'], xp=30)

ex('12.3', GR, r'Symmetries of $R_{iklm}$ and the contracted Bianchi step',
   r'From (12.37) build $R_{iklm}=g_{in}R^n{}_{klm}$, show $R_{iklm}=\frac12(\partial_k\partial_lg_{im}+\partial_i\partial_mg_{kl}-\partial_k\partial_mg_{il}-\partial_i\partial_lg_{km})+g_{np}(\Gamma^n_{kl}\Gamma^p_{im}-\Gamma^n_{km}\Gamma^p_{il})$, deduce $R_{iklm}=-R_{kilm}=-R_{ikml}=R_{lmik}$, and prove $g^{im}R^n{}_{ilm}=R^n{}_l$ (needed for $\nabla_kG^{ik}=0$).',
   [r'lower $\Gamma$ with $g$: $\Gamma_{n,kl}=g_{nm}\Gamma^m_{kl}$, and $\partial_kg_{nm}=\Gamma_{n,mk}+\Gamma_{m,nk}$'],
   [(r'Lower the index.', r'$g_{in}\partial_k\Gamma^n_{lm}=\partial_k\Gamma_{i,lm}-\Gamma^n_{lm}\partial_kg_{in}$; the second derivatives of $g$ come from $\partial\Gamma_{i,lm}=\frac12\partial(\partial g+\partial g-\partial g)$, the rest combine into the quadratic $\Gamma\Gamma$ terms.'),
    (r'Symmetries.', r'Read them off: swapping $i\leftrightarrow k$ or $l\leftrightarrow m$ flips the sign of both the derivative and $\Gamma\Gamma$ parts; swapping the pairs $(ik)\leftrightarrow(lm)$ leaves them unchanged (check in a locally geodesic frame where $\Gamma=0$).'),
    (r'The contraction.', r'$g^{im}R^n{}_{ilm}=g^{im}g^{nk}R_{kilm}$. Pair symmetry and then both antisymmetries: $R_{kilm}=R_{lmki}=-R_{mlki}=R_{mlik}$. Contracting the first and third index with $g^{im}$ gives $g^{im}R_{mlik}=R^i{}_{lik}=R_{lk}$ by (12.41), and $R_{lk}=R_{kl}$. Hence $g^{im}R^n{}_{ilm}=g^{nk}R_{kl}=R^n{}_l$.')],
   [r'lowering the index of the Riemann tensor', r'three symmetry properties', r'contraction gives the Ricci tensor'], xp=35)

ex('12.4', GR, r'Geodesic deviation',
   r'For two neighbouring geodesics $x^i(s)$ and $x^i(s)+\delta x^i(s)$ show $\dfrac{D^2}{Ds^2}\delta x^i=-R^i{}_{klm}\delta x^l\dfrac{dx^k}{ds}\dfrac{dx^m}{ds}$ (book sign convention).',
   [r'geodesic: $\ddot x^i+\Gamma^i_{kl}\dot x^k\dot x^l=0$', r'Exercise 12.2'],
   [(r'Subtract the geodesic equations to first order.', r'$\delta\ddot x^i+\partial_m\Gamma^i_{kl}\delta x^m\dot x^k\dot x^l+2\Gamma^i_{kl}\dot x^k\delta\dot x^l=0$.'),
    (r'Rewrite with covariant derivatives along the curve.', r'$\dfrac{D\delta x^i}{Ds}=\delta\dot x^i+\Gamma^i_{kl}\dot x^k\delta x^l$; differentiate again and use the geodesic equation to remove $\ddot x$.'),
    (r'Collect.', r'All terms combine into $\left(\partial_l\Gamma^i_{km}-\partial_m\Gamma^i_{kl}+\Gamma\Gamma-\Gamma\Gamma\right)\dot x^k\dot x^m\delta x^l$, the Riemann tensor: the stated equation. Physics: tidal acceleration between free particles; in Newtonian terms $\ddot{\delta x}_i=-\partial_i\partial_j\Phi\,\delta x_j$.')],
   [r'linearise the geodesic equation', r'covariant derivative along the curve', r'Riemann tensor as tidal tensor'], xp=35)

ex('12.5', GR, r'Great circles are geodesics, other latitude circles are not',
   r'Prove that the equator of a sphere is a geodesic, but any other circle of constant latitude is not.',
   [r'on $ds^2=a^2(d\theta^2+\sin^2\theta\,d\phi^2)$: $\Gamma^\theta_{\phi\phi}=-\sin\theta\cos\theta$, $\Gamma^\phi_{\theta\phi}=\cot\theta$'],
   [(r'Geodesic equation for $\theta$.', r'$\ddot\theta-\sin\theta\cos\theta\,\dot\phi^2=0$.'),
    (r'Try $\theta=\theta_0$, $\phi=s/(a\sin\theta_0)$.', r'Then $\ddot\theta=0$, so we need $\sin\theta_0\cos\theta_0\dot\phi^2=0$: only $\theta_0=\pi/2$ works (the poles are trivial).'),
    (r'The $\phi$ equation.', r'$\ddot\phi+2\cot\theta\dot\theta\dot\phi=0$ holds for constant $\theta$ and constant $\dot\phi$. So the equator is a geodesic; a latitude circle needs a force pulling towards the pole axis: an airplane flying "due east" at $60^\circ$ N is constantly turning.')],
   [r'the $\theta$ geodesic equation', r'condition $\sin\theta_0\cos\theta_0=0$', r'interpretation'], xp=20)

ex('12.6', GR, r'Metric of a rotating frame',
   r'With $ds^2=-c^2dt^2+dx^2+dy^2+dz^2$ and the rotating coordinates $t\'=t$, $z\'=z$, $x\'=x\cos\Omega t+y\sin\Omega t$, $y\'=-x\sin\Omega t+y\cos\Omega t$, find $g_{ik}$ and $g^{ik}$ in the rotating frame and verify $g^{ik}g_{km}=\delta^i_m$.',
   [r'invert: $x=x\'\cos\Omega t-y\'\sin\Omega t$, $y=x\'\sin\Omega t+y\'\cos\Omega t$'],
   [(r'Differentials.', r'$dx=\cos\Omega t\,dx\'-\sin\Omega t\,dy\'-\Omega y\,dt$, $dy=\sin\Omega t\,dx\'+\cos\Omega t\,dy\'+\Omega x\,dt$ ($x,y$ expressed through $x\',y\'$). Then $dx^2+dy^2=dx\'^2+dy\'^2+2\Omega(x\'dy\'-y\'dx\')dt+\Omega^2(x\'^2+y\'^2)dt^2$.'),
    (r'Metric.', r'$ds^2=-\left(c^2-\Omega^2(x\'^2+y\'^2)\right)dt^2+2\Omega x\'dy\'dt-2\Omega y\'dx\'dt+dx\'^2+dy\'^2+dz\'^2$: $g_{tt}=-(c^2-\Omega^2\varrho^2)$, $g_{tx}=-\Omega y\'$, $g_{ty}=\Omega x\'$, $g_{xx}=g_{yy}=g_{zz}=1$.'),
    (r'Inverse.', r'$g^{tt}=-1/c^2$, $g^{tx}=-\Omega y\'/c^2$, $g^{ty}=\Omega x\'/c^2$, $g^{xx}=1-\Omega^2y\'^2/c^2$, $g^{yy}=1-\Omega^2x\'^2/c^2$, $g^{xy}=\Omega^2x\'y\'/c^2$, $g^{zz}=1$. Multiplying out $g^{ik}g_{km}$ gives $\delta^i_m$ (e.g. $g^{tt}g_{tt}+g^{tx}g_{xt}+g^{ty}g_{yt}=\frac{c^2-\Omega^2\varrho^2}{c^2}+\frac{\Omega^2y^2}{c^2}+\frac{\Omega^2x^2}{c^2}=1$).'),
    (r'Physics.', r'$g_{tt}$ vanishes at $\varrho=c/\Omega$ (light cylinder); the off-diagonal $g_{ti}$ produce the Coriolis force. The space is still flat (all Riemann components zero).')],
   [r'transformed differentials', r'all $g_{ik}$', r'inverse metric and check', r'light cylinder and Coriolis terms'], xp=30)

ex('12.7', GR, r'Einstein tensor of the weak-field metric',
   r'For $ds^2=-\left(1+\dfrac{2\Phi}{c^2}\right)c^2dt^2+dx^2+dy^2+dz^2$ (non-relativistic particle in a weak field), calculate $G_{xx}$ and check the $xx$ component of Einstein\'s equation. If it fails, how do you account for it?',
   [r'to first order in $\Phi$; static field', r'$T_{ik}$ of dust: only $T_{tt}=\rho c^2$ (in these units)'],
   [(r'Ricci tensor to first order.', r'With $x^0=ct$ and $h_{00}=-2\Phi/c^2$ the linearised Ricci tensor gives $R_{00}=\nabla^2\Phi/c^2$, $R_{ij}=-\partial_i\partial_j\Phi/c^2$, so $R=-R_{00}+R_{ii}=-2\nabla^2\Phi/c^2$ (signature $-+++$).'),
    (r'$G_{xx}$.', r'$G_{xx}=R_{xx}-\frac12R=\dfrac{1}{c^2}\left(\nabla^2\Phi-\partial_x^2\Phi\right)=\dfrac{1}{c^2}(\partial_y^2+\partial_z^2)\Phi\neq0$ inside matter.'),
    (r'Einstein\'s equation.', r'$T_{xx}=P\approx0$ for slow matter, but $G_{xx}\ne0$: the equation fails.'),
    (r'Resolution.', r'The metric is incomplete: at the same order the spatial part also changes, $g_{ij}=(1-2\Phi/c^2)\delta_{ij}$. With it $G_{ij}=0$ and only the $tt$ equation survives, giving $\nabla^2\Phi=4\pi G\rho$. The given metric reproduces particle motion (only $g_{tt}$ matters for slow particles), but not light bending, which needs the spatial part too (factor 2 in the deflection).')],
   [r'linear Ricci tensor', r'$G_{xx}\propto(\partial_y^2+\partial_z^2)\Phi\ne0$', r'missing spatial part of the metric', r'consequence for light deflection'], xp=35)

# ------------------------------------------------------------------ Chapter 13 (Relativity Annex)
ex('13.1', GR, r'Lengths, areas and volumes in a curved static metric',
   r'For $ds^2=-(1-Ar^2)dt^2+(1-Ar^2)^{\pm1}dr^2+r^2(d\theta^2+\sin^2\theta d\phi^2)$ calculate (a) the proper radial distance from $r=0$ to $r=R$, (b) the area of the sphere $r=R$, (c) the 3-volume inside it, (d) the 4-volume of the tube between two $t=$ const surfaces separated by $T$.',
   [r'proper length $\int\sqrt{g_{rr}}dr$, area $\int\sqrt{g_{\theta\theta}g_{\phi\phi}}$, volume $\int\sqrt{g_{rr}g_{\theta\theta}g_{\phi\phi}}$, 4-volume $\int\sqrt{-g}\,d^4x$'],
   [(r'(b) Area.', r'$\sqrt{g_{\theta\theta}g_{\phi\phi}}=r^2\sin\theta$: $4\pi R^2$ in both cases ($r$ is defined by the area).'),
    (r'$g_{rr}=(1-Ar^2)^{-1}$ (de Sitter-like, usual form).', r'(a) $\displaystyle\int_0^R\frac{dr}{\sqrt{1-Ar^2}}=\frac{\arcsin(\sqrt AR)}{\sqrt A}$ ($>R$). (c) $4\pi\displaystyle\int_0^R\frac{r^2dr}{\sqrt{1-Ar^2}}=\frac{2\pi}{A^{3/2}}\left[\arcsin(\sqrt AR)-\sqrt AR\sqrt{1-AR^2}\right]$. (d) $\sqrt{-g}=r^2\sin\theta$: $\frac43\pi R^3T$.'),
    (r'$g_{rr}=1-Ar^2$ (as printed in our copy).', r'(a) $\frac12\left[R\sqrt{1-AR^2}+\frac{\arcsin(\sqrt AR)}{\sqrt A}\right]$ ($<R$). (c) $4\pi\int_0^Rr^2\sqrt{1-Ar^2}dr$. (d) $\sqrt{-g}=(1-Ar^2)r^2\sin\theta$: $4\pi T\left(\frac{R^3}3-\frac{AR^5}5\right)$.'),
    (r'Check the limit $A\to0$.', r'All reduce to the flat results $R$, $4\pi R^2$, $\frac43\pi R^3$, $\frac43\pi R^3T$.')],
   [r'the right $\sqrt{g}$ for each measure', r'area is $4\pi R^2$ by definition of $r$', r'arcsin integrals', r'flat limit'], xp=30,
   note=r'Our text copy shows $g_{rr}=1-Ar^2$; the superscript $-1$ may have been lost. Both versions are solved: use the one printed in your book.')

ex('13.2', GR, r'Schwarzschild solves the vacuum equations',
   r'Show that the Schwarzschild metric (13.13) satisfies all components of Einstein\'s vacuum equation for $r\neq0$.',
   [r'general static spherical metric $ds^2=-e^{2\alpha(r)}c^2dt^2+e^{2\beta(r)}dr^2+r^2d\Omega^2$', r'vacuum: $R_{ik}=0$'],
   [(r'Non-zero Christoffel symbols.', r'$\Gamma^t_{tr}=\alpha\'$, $\Gamma^r_{tt}=c^2\alpha\'e^{2(\alpha-\beta)}$, $\Gamma^r_{rr}=\beta\'$, $\Gamma^r_{\theta\theta}=-re^{-2\beta}$, $\Gamma^r_{\phi\phi}=-re^{-2\beta}\sin^2\theta$, $\Gamma^\theta_{r\theta}=\Gamma^\phi_{r\phi}=1/r$, $\Gamma^\theta_{\phi\phi}=-\sin\theta\cos\theta$, $\Gamma^\phi_{\theta\phi}=\cot\theta$.'),
    (r'Ricci components.', r'$R_{tt}\propto\alpha\'\'+\alpha\'^2-\alpha\'\beta\'+\frac2r\alpha\'$, $R_{rr}=-\alpha\'\'-\alpha\'^2+\alpha\'\beta\'+\frac2r\beta\'$, $R_{\theta\theta}=1-e^{-2\beta}\left[1+r(\alpha\'-\beta\')\right]$, $R_{\phi\phi}=\sin^2\theta R_{\theta\theta}$.'),
    (r'Solve.', r'$e^{2(\beta-\alpha)}R_{tt}/c^2+R_{rr}=\frac2r(\alpha\'+\beta\')=0\Rightarrow\alpha=-\beta$ (with flat infinity). Then $R_{\theta\theta}=0$ gives $(re^{2\alpha})\'=1$, $e^{2\alpha}=1-\dfrac{2GM}{c^2r}$: exactly (13.13); with it $R_{tt}=R_{rr}=0$ too.')],
   [r'Christoffel symbols of the static spherical metric', r'Ricci components', r'$\alpha=-\beta$ and $(re^{2\alpha})\'=1$'], xp=35)

ex('13.3', GR, r'Newtonian orbits from the Schwarzschild orbit equation',
   r'Neglecting the relativistic term, substitute $u_0=\frac1p(1+\epsilon\cos\phi)$ (13.32) into (13.28), $l^2\left(\frac{du}{d\phi}\right)^2=e^2-1-2V_{\rm eff}(u)$, to show $\epsilon=\sqrt{1+\dfrac{(e^2-1)l^2}{M^2}}$, the condition for an ellipse, $a=\dfrac{l^2}{M(1-\epsilon^2)}$ and $\dfrac{e^2-1}2=-\dfrac M{2a}$ ($G=c=1$). Meaning of the last result?',
   [r'without the GR term: $V_{\rm eff}=-Mu+\frac12l^2u^2$'],
   [(r'Insert $u_0$.', r'$\dfrac{du}{d\phi}=-\dfrac\epsilon p\sin\phi$: $\dfrac{l^2\epsilon^2}{p^2}\sin^2\phi=e^2-1+\dfrac{2M}p(1+\epsilon\cos\phi)-\dfrac{l^2}{p^2}(1+\epsilon\cos\phi)^2$.'),
    (r'Match coefficients.', r'$\cos\phi$ terms: $\dfrac{2M\epsilon}p=\dfrac{2l^2\epsilon}{p^2}\Rightarrow p=\dfrac{l^2}M$. Constant terms: $\dfrac{l^2\epsilon^2}{p^2}=e^2-1+\dfrac{2M}p-\dfrac{l^2}{p^2}\Rightarrow\epsilon^2=1+\dfrac{(e^2-1)l^2}{M^2}$.'),
    (r'Ellipse.', r'$\epsilon<1\Leftrightarrow e^2<1$ (bound). Then $r_{\min,\max}=p/(1\pm\epsilon)$, $a=\dfrac{p}{1-\epsilon^2}=\dfrac{l^2}{M(1-\epsilon^2)}$, and $\dfrac{e^2-1}{2}=\dfrac{M^2(\epsilon^2-1)}{2l^2}=-\dfrac M{2a}$.'),
    (r'Meaning.', r'$e$ is the conserved energy per unit rest energy, so $\frac{e^2-1}2\approx e-1$ is the Newtonian energy per unit mass: $E=-\dfrac{GM}{2a}$, the Kepler result that the energy depends only on the semimajor axis.')],
   [r'coefficient matching gives $p=l^2/M$', r'$\epsilon$ formula and bound condition $e<1$', r'$a$ and $E=-GM/2a$'], xp=30)

ex('13.4', GR, r'Perihelion of Mercury and light bending by the Sun',
   r'(a) Calculate the perihelion precession of Mercury in arcseconds per century ($a=5.79\times10^7$ km, $\epsilon=0.206$, $P=88.0$ d). (b) Evaluate the maximum deflection of light by the Sun.',
   [r'$\Delta\phi=\dfrac{6\pi GM}{c^2a(1-\epsilon^2)}$ per orbit', r'$\delta=\dfrac{4GM}{c^2R}$ for a ray grazing at $R$'],
   [(r'Per orbit.', r'$\Delta\phi=\dfrac{6\pi\times1.33\times10^{20}}{9\times10^{16}\times5.79\times10^{10}\times(1-0.206^2)}\approx<<13.4.dphi>>$ rad.'),
    (r'Per century.', r'$<<13.4.orbits>>$ orbits per century: $\approx<<13.4.arcsec>>^{\prime\prime}$, the famous $43^{\prime\prime}$ unexplained by Newtonian perturbations.'),
    (r'Light deflection at the solar limb.', r'$\delta=\dfrac{4GM_\odot}{c^2R_\odot}\approx<<13.4.defl>>^{\prime\prime}$, twice the "Newtonian" value; confirmed in the 1919 eclipse.')],
   [r'precession formula', r'$\approx43^{\prime\prime}$ per century', r'$1.75^{\prime\prime}$ at the limb'], xp=25)

ex('13.5', GR, r'Escape cone of light near a black hole',
   r'Light is emitted at $r_i$ with $2M<r_i<3M$ ($G=c=1$) at angle $\alpha$ to the radial direction. Show it escapes only if $\sin\alpha<\dfrac{3\sqrt3M}{r_i}\left(1-\dfrac{2M}{r_i}\right)^{1/2}$, so at $r=2M$ only radial light escapes.',
   [r'(13.38): $\left(1-\frac{2M}r\right)dt^2-\dfrac{dr^2}{1-2M/r}-r^2d\phi^2=0$', r'photon orbit: $\left(\dfrac{du}{d\phi}\right)^2=\dfrac1{b^2}-u^2(1-2Mu)$, maximum of $u^2(1-2Mu)$ at $r=3M$ equals $\dfrac1{27M^2}$'],
   [(r'Angle measured by a static observer.', r'Proper radial and tangential distances: $d\ell_r=\dfrac{dr}{\sqrt{1-2M/r}}$, $d\ell_\phi=r\,d\phi$, so $\tan\alpha=\left(1-\dfrac{2M}{r_i}\right)^{1/2}r_i\left(\dfrac{d\phi}{dr}\right)_i$ (the hint).'),
    (r'Relate to $b=l/e$.', r'The photon orbit gives $\left(\dfrac{dr}{d\phi}\right)^2=r^4\left[\dfrac1{b^2}-\dfrac1{r^2}\left(1-\dfrac{2M}r\right)\right]$. Then $\tan^2\alpha=\dfrac{1-2M/r_i}{r_i^2/b^2-(1-2M/r_i)}$ and $\sin^2\alpha=\dfrac{\tan^2\alpha}{1+\tan^2\alpha}=\dfrac{b^2}{r_i^2}\left(1-\dfrac{2M}{r_i}\right)$, i.e. $\dfrac1{b^2}=\dfrac{1-2M/r_i}{r_i^2\sin^2\alpha}$.'),
    (r'Escape condition.', r'Emitted inside the photon sphere ($r_i<3M$) moving outward, the photon escapes only if it passes over the barrier: $\dfrac1{b^2}>\dfrac1{27M^2}$, i.e. $\sin^2\alpha<\dfrac{27M^2}{r_i^2}\left(1-\dfrac{2M}{r_i}\right)$: the stated cone.'),
    (r'Horizon limit.', r'At $r_i\to2M$ the right side $\to0$: only exactly radial light escapes; the escape cone closes.')],
   [r'local angle with proper lengths', r'$1/b^2=(1-2M/r_i)/(r_i^2\sin^2\alpha)$', r'barrier $1/27M^2$', r'cone closes at $2M$'], xp=35)

ex('13.6', GR, r'Static weak field is not a transverse-traceless wave',
   r'Far from a spherical star the field is weak. (a) Find $h_{ik}$ in a suitable gauge. (b) Show that no gauge transformation brings it to the transverse-traceless form (13.84).',
   [r'gauge freedom $h_{ik}\to h_{ik}-\partial_i\xi_k-\partial_k\xi_i$; Riemann tensor is gauge invariant'],
   [(r'(a) Harmonic (isotropic) gauge.', r'$h_{tt}=\dfrac{2GM}{c^2r}$, $h_{ij}=\dfrac{2GM}{c^2r}\delta_{ij}$, $h_{ti}=0$ (from linearising Schwarzschild in isotropic coordinates); trace-reversed $\bar h_{tt}=4GM/c^2r$, others zero.'),
    (r'(b) What TT form would imply.', r'A TT field has only $h_{xx}=-h_{yy}$, $h_{xy}$, depending on $ct-x^3$: it has no $tt$ component and its Riemann tensor $R_{titj}$ is transverse and traceless.'),
    (r'Gauge invariant test.', r'The static field has $R_{titj}=\partial_i\partial_j\Phi/c^2$ with $\Phi=-GM/r$, whose trace $\nabla^2\Phi/c^2$ vanishes outside the star but which is not transverse (it has components along the radial direction) and does not oscillate. Since the Riemann tensor cannot be changed by gauge, no gauge makes $h$ TT: TT form is only possible for radiation, which obeys the vacuum wave equation with $\omega\neq0$.')],
   [r'linearised Schwarzschild $h_{ik}$', r'TT form properties', r'gauge-invariant Riemann argument'], xp=30)

ex('13.7', GR, r'No memory to linear order',
   r'A gravitational wave source emits for a finite time. A distant observer watches two free particles initially at rest. Show that after the wave has passed they are back at their original positions and at rest relative to each other (to linear order).',
   [r'in TT gauge free particles stay at fixed coordinates; proper separation $L(t)=L_0\left(1+\frac12h_{ij}n^in^j\right)$'],
   [(r'Coordinates of free particles in TT gauge.', r'The geodesic equation gives $\ddot x^i=-\Gamma^i_{tt}c^2=0$ in TT gauge (no $h_{tt}$, $h_{ti}$): they stay at fixed coordinates.'),
    (r'Proper distance.', r'$L(t)=L_0+\frac12h_{ij}(t)n^in^jL_0$: it oscillates while the wave passes.'),
    (r'After the wave.', r'For a finite wave train $h_{ij}\to0$ again (linear theory, no static part), so $L\to L_0$ and $\dot L=\frac12\dot h_{ij}n^in^jL_0\to0$: same positions, relative rest. (A permanent offset, the nonlinear "memory effect", appears only at higher order.)')],
   [r'free particles at fixed TT coordinates', r'$L=L_0(1+\frac12hnn)$', r'$h\to0$ after the passage'], xp=25)

# ------------------------------------------------------------------ Chapter 14
ex('14.1', 'expanding-universe', r'Scalar curvature of the 3-sphere and 3-hyperboloid',
   r'Find the scalar curvature of $ds^2=a^2[d\chi^2+\sin^2\chi(d\theta^2+\sin^2\theta\,d\phi^2)]$ and of the same metric with $\sinh\chi$.',
   [r'maximally symmetric 3-space: $R_{ijkl}=K(g_{ik}g_{jl}-g_{il}g_{jk})$, $R=6K$'],
   [(r'Christoffel symbols (sphere).', r'$\Gamma^\chi_{\theta\theta}=-\sin\chi\cos\chi$, $\Gamma^\chi_{\phi\phi}=-\sin\chi\cos\chi\sin^2\theta$, $\Gamma^\theta_{\chi\theta}=\Gamma^\phi_{\chi\phi}=\cot\chi$, $\Gamma^\theta_{\phi\phi}=-\sin\theta\cos\theta$, $\Gamma^\phi_{\theta\phi}=\cot\theta$.'),
    (r'Ricci tensor.', r'$R_{\chi\chi}=2$, $R_{\theta\theta}=2\sin^2\chi$, $R_{\phi\phi}=2\sin^2\chi\sin^2\theta$, i.e. $R_{ij}=\dfrac2{a^2}g_{ij}$.'),
    (r'Scalar curvature.', r'$R=g^{ij}R_{ij}=\dfrac{6}{a^2}$ for the 3-sphere, $-\dfrac6{a^2}$ for the hyperbolic space ($\sin\to\sinh$ flips the sign of $K$).'),
    (r'Use.', r'These are the spatial sections of the closed and open Robertson–Walker metrics with curvature $k/a^2$.')],
   [r'Christoffel symbols', r'$R_{ij}=\pm\frac{2}{a^2}g_{ij}$', r'$R=\pm6/a^2$'], xp=30)

ex('14.2', 'expanding-universe', r'Ricci tensor of the Robertson–Walker metric',
   r'Calculate all components of $R_{ik}$ for the Robertson–Walker metric and verify (14.2): $R_{tt}=-3\dfrac{\ddot a}a$, $R_{\alpha\beta}=\left(\dfrac{\ddot a}a+2\dfrac{\dot a^2}{a^2}+2\dfrac{kc^2}{a^2}\right)\dfrac{g_{\alpha\beta}}{c^2}$.',
   [r'$ds^2=-c^2dt^2+a^2(t)\gamma_{\alpha\beta}dx^\alpha dx^\beta$, $\gamma$ of constant curvature $k$'],
   [(r'Christoffel symbols with time.', r'$\Gamma^t_{\alpha\beta}=\dfrac{a\dot a}{c^2}\gamma_{\alpha\beta}$, $\Gamma^\alpha_{t\beta}=\dfrac{\dot a}a\delta^\alpha_\beta$, plus the purely spatial $\Gamma^\alpha_{\beta\gamma}$ of $\gamma$.'),
    (r'$R_{tt}$.', r'$R_{tt}=-\partial_t\Gamma^\alpha_{t\alpha}-\Gamma^\alpha_{t\beta}\Gamma^\beta_{t\alpha}=-3\dfrac{d}{dt}\dfrac{\dot a}a-3\dfrac{\dot a^2}{a^2}=-3\dfrac{\ddot a}a$.'),
    (r'$R_{\alpha\beta}$.', r'Time-derivative terms give $\dfrac{1}{c^2}(a\ddot a+2\dot a^2)\gamma_{\alpha\beta}$, the spatial curvature adds $2k\gamma_{\alpha\beta}$ (from Exercise 14.1); with $g_{\alpha\beta}=a^2\gamma_{\alpha\beta}$ that is (14.2).'),
    (r'Next step.', r'With $T_{ik}$ of a perfect fluid, the $tt$ and $\alpha\beta$ components of Einstein\'s equation give the Friedmann and acceleration equations.')],
   [r'time-dependent Christoffel symbols', r'$R_{tt}=-3\ddot a/a$', r'spatial part with $2kc^2/a^2$'], xp=35)

ex('14.3', 'expanding-universe', r'Instability of Einstein\'s static universe',
   r'With a cosmological constant and $P=0$, let $a_0$ be the static solution. If $a$ is suddenly changed to $a_0+a_1$, show that $a_1$ grows exponentially.',
   [r'$\ddot a=-\dfrac{4\pi G}3\rho a+\dfrac{\Lambda c^2}3a$, $\rho a^3=$ const'],
   [(r'Static solution.', r'$\ddot a=0\Rightarrow\Lambda c^2=4\pi G\rho_0$.'),
    (r'Linearise.', r'Write $\rho a=\rho_0a_0^3/a^2$: $\ddot a_1=\left[\dfrac{8\pi G}{3}\rho_0+\dfrac{\Lambda c^2}{3}\right]a_1=4\pi G\rho_0\,a_1$.'),
    (r'Solution.', r'$a_1\propto e^{\pm\sqrt{4\pi G\rho_0}\,t}$: the growing mode wins. A slight expansion lowers the density, gravity weakens, $\Lambda$ wins and expansion accelerates (and vice versa): the static universe is unstable, which is why Einstein\'s model could not describe the real Universe even before Hubble.')],
   [r'static condition $\Lambda c^2=4\pi G\rho_0$', r'linearised equation', r'exponential growth'], xp=25)

ex('14.4', 'expanding-universe', r'Free particles slow down as $1/a$; decoupled relics',
   r'(a) For a free particle in the Robertson–Walker metric moving in $\chi$ only, show from the extremum of $\int ds$ that $a^2d\chi/d\tau$ is a constant, so the peculiar velocity decays as $a^{-1}$. (b) Particles in equilibrium while relativistic decouple and later become non-relativistic. Show that (11.7) keeps holding with $T\propto a^{-1}$. Is that $T$ a true temperature? Does (11.8) still hold? How do you find their density?',
   [r'$ds^2=-c^2dt^2+a^2(t)\left[d\chi^2+S_k^2(\chi)d\Omega^2\right]$'],
   [(r'(a) $\chi$ is cyclic.', r'The Lagrangian $\sqrt{c^2\dot t^2-a^2\dot\chi^2}$ does not contain $\chi$, so $a^2\,d\chi/d\tau$ is conserved. Peculiar velocity $v=a\,d\chi/dt$ with $\gamma v=a\,d\chi/d\tau\propto1/a$: momentum $\propto a^{-1}$, and for slow particles $v\propto a^{-1}$.'),
    (r'(b) Momenta redshift.', r'Every particle\'s momentum scales as $p\propto1/a$ and the number in a comoving volume is fixed. The occupation number $f(p)=1/(e^{pc/\kappa_BT}\pm1)$ is conserved along the flow, so it keeps its form with $T\propto1/a$: (11.7) still holds.'),
    (r'Is $T$ a temperature?', r'It is only a parameter of the momentum distribution: the particles no longer interact, and once non-relativistic their energy is not $pc$, so the distribution is not Bose–Einstein or Fermi–Dirac in energy.'),
    (r'Density.', r'(11.8) fails because $E\neq pc$. Use $\rho=mn$ with $n\propto a^{-3}$ fixed at decoupling: e.g. relic neutrinos with $n\approx113\ \mathrm{cm^{-3}}$ per species give $\Omega_\nu h^2=\sum m_\nu/94$ eV.')],
   [r'conserved $a^2\dot\chi$', r'$p\propto1/a$', r'distribution form preserved, $T$ only a parameter', r'$\rho=mn$ for non-relativistic relics'], xp=30)

ex('14.5', 'expanding-universe', r'Coordinate distance against redshift for $k=-1$',
   r'For $k=-1$ and $\Lambda=0$, derive the relation between coordinate distance $r$ and redshift $z$, and show it is the same as (14.32) for $k=+1$.',
   [r'$\displaystyle\int_0^r\frac{dr\'}{\sqrt{1+r\'^2}}=\int_{t}^{t_0}\frac{c\,dt}{a}$', r'$a_0H_0\sqrt{1-\Omega_{M,0}}=c$ for $k=-1$'],
   [(r'Left side.', r'$\sinh^{-1}r$; right side: $\displaystyle\int_0^z\frac{c\,dz}{a_0H_0\sqrt{\Omega_{M,0}(1+z)^3+(1-\Omega_{M,0})(1+z)^2}}$.'),
    (r'Integrate.', r'With $\Omega\equiv\Omega_{M,0}<1$ the integral is elementary (substitute $1+z=1/x$); taking $\sinh$ of the result gives (Mattig) $r=\dfrac{c}{a_0H_0}\dfrac{2\left[\Omega z+(2-\Omega)\left(1-\sqrt{1+\Omega z}\right)\right]}{\Omega^2(1+z)}$.'),
    (r'Compare with (14.32).', r'This is the same expression as for $k=+1$ (where $\sin^{-1}$ and $\sin$ appear instead): the curvature sign only enters through $a_0H_0$. Hence one formula holds for all $\Omega$, and it reduces to $r\,a_0H_0/c=2\left(1-1/\sqrt{1+z}\right)$ for $\Omega=1$.')],
   [r'$\sinh^{-1}$ on the coordinate side', r'Mattig form', r'same as $k=+1$'], xp=30)

ex('14.6', 'expanding-universe', r'Galaxy counts per redshift interval',
   r'If there are $n$ galaxies per unit comoving volume, find the number within solid angle $d\Omega$ with redshifts in $[z,z+dz]$.',
   [r'comoving volume element $dV=\dfrac{a_0^3r^2dr\,d\Omega}{\sqrt{1-kr^2}}$', r'$r(z)$ from the Mattig relation (Exercise 14.5)'],
   [(r'General form.', r'$dN=n\dfrac{a_0^3r^2}{\sqrt{1-kr^2}}\dfrac{dr}{dz}dz\,d\Omega$.'),
    (r'Use the light-ray equation.', r'$\dfrac{dr}{\sqrt{1-kr^2}}=\dfrac{c\,dz}{a_0H(z)}$, so $dN=n\dfrac{c\,a_0^2r^2(z)}{H(z)}dz\,d\Omega$.'),
    (r'Example $\Omega_{M,0}=1$.', r'$a_0r=\dfrac{2c}{H_0}\left(1-\dfrac1{\sqrt{1+z}}\right)$, $H=H_0(1+z)^{3/2}$: $dN=n\left(\dfrac c{H_0}\right)^3\dfrac{4\left(1-(1+z)^{-1/2}\right)^2}{(1+z)^{3/2}}dz\,d\Omega$. The counts grow as $z^2$ at small $z$ and then turn over: number counts test the geometry (if galaxies did not evolve).')],
   [r'comoving volume element', r'$dr/\sqrt{1-kr^2}=c\,dz/a_0H$', r'explicit EdS result'], xp=25)

ex('14.7', 'expanding-universe', r'Standard candles: luminosity distance for three cosmologies',
   r'Using (14.51), numerically evaluate and plot the apparent luminosity of standard candles against $z$ for (i) $\Omega_M=1,\Omega_\Lambda=0$, (ii) $\Omega_M=0,\Omega_\Lambda=1$, (iii) $\Omega_M=0.3,\Omega_\Lambda=0.7$.',
   [r'(14.51): $d_L=\dfrac{(1+z)c}{H_0\sqrt{|\kappa|}}S\left(\sqrt{|\kappa|}\displaystyle\int_0^z\frac{dz\'}{\sqrt{\Omega_M(1+z\')^3+\Omega_\Lambda+\kappa(1+z\')^2}}\right)$, $\kappa=1-\Omega_M-\Omega_\Lambda$', r'apparent luminosity $l=L/4\pi d_L^2$'],
   [(r'All three are flat, so $S(x)\to x$.', r'$d_L=(1+z)\dfrac c{H_0}\displaystyle\int_0^z\frac{dz\'}{E(z\')}$.'),
    (r'$H_0d_L/c$ at $z=0.1,0.5,1,2$.', r'(i) $<<14.7.m01>>$, $<<14.7.m05>>$, $<<14.7.m10>>$, $<<14.7.m20>>$; (ii) $<<14.7.l01>>$, $<<14.7.l05>>$, $<<14.7.l10>>$, $<<14.7.l20>>$; (iii) $<<14.7.c01>>$, $<<14.7.c05>>$, $<<14.7.c10>>$, $<<14.7.c20>>$. Closed forms: (i) $2(1+z-\sqrt{1+z})$, (ii) $z(1+z)$.'),
    (r'Plot and meaning.', r'$l\propto d_L^{-2}$: at a given $z$ candles are faintest in the $\Lambda$-dominated model. At $z=0.5$, model (iii) is $(0.661/0.551)^2\approx1.44$ times fainter than EdS, i.e. 0.4 mag: what the 1998 supernova observations found (accelerating Universe).')],
   [r'flat case of (14.51)', r'the three tables of $H_0d_L/c$', r'$\Lambda$ makes distant candles fainter (SN Ia)'], xp=30)

ex('14.8', 'early-universe', r'Legendre coefficients of a Gaussian correlation function',
   r'For $C(\theta)=e^{-(\theta/\theta_0)^2}$ expanded as $C=\sum\frac{2l+1}{4\pi}C_lP_l(\cos\theta)$ (14.53), show $C_l=2\pi\displaystyle\int_{-1}^{+1}C(\theta)P_l(\cos\theta)\,d(\cos\theta)$. Write a code for the $C_l$, run it for a few $\theta_0$ and find the $l$ where $C_l$ is maximum.',
   [r'orthogonality: $\displaystyle\int_{-1}^1P_lP_{l\'}\,dx=\frac{2}{2l+1}\delta_{ll\'}$'],
   [(r'Project on $P_l$.', r'Multiply (14.53) by $P_{l\'}(\cos\theta)$ and integrate over $x=\cos\theta$: $\int CP_{l\'}dx=\frac{2l\'+1}{4\pi}C_{l\'}\frac2{2l\'+1}=\frac{C_{l\'}}{2\pi}$, so $C_l=2\pi\int_{-1}^1CP_l\,dx$.'),
    (r'Code.', r'Integrate $2\pi\int_0^\pi e^{-(\theta/\theta_0)^2}P_l(\cos\theta)\sin\theta\,d\theta$ (only $\theta\lesssim5\theta_0$ matters), with $P_l$ from the recurrence $(l+1)P_{l+1}=(2l+1)xP_l-lP_{l-1}$, for $l=0\ldots10/\theta_0$.'),
    (r'Result.', r'For small $\theta_0$, $C_l\approx\pi\theta_0^2e^{-l(l+1)\theta_0^2/4}$: $C_l$ itself is largest at $l=0$ and decreases. The quantity plotted for the CMB, $l(l+1)C_l$, peaks at $l\approx2/\theta_0$: computed $l=<<14.8.l1>>$, $<<14.8.l5>>$, $<<14.8.l10>>$ for $\theta_0=1^\circ,5^\circ,10^\circ$ (prediction $<<14.8.p1>>$, $<<14.8.p5>>$, $<<14.8.p10>>$).'),
    (r'Meaning.', r'Structure of angular size $\theta$ shows up at $l\sim\pi/\theta$: the first acoustic peak at $l\approx200$ corresponds to $\approx1^\circ$, the sound horizon at recombination seen in a flat Universe.')],
   [r'orthogonality gives the $C_l$ formula', r'working numerical code', r'$C_l$ max at $l=0$, $l(l+1)C_l$ peaks at $l\approx2/\theta_0$', r'angle-multipole correspondence'], xp=30,
   note=r'Our text copy asks for the maximum of $C_l$; for a Gaussian that is $l=0$, so the useful statement is the peak of $l(l+1)C_l$, as plotted for the CMB.')
