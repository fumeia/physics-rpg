# Choudhuri, Astrophysics for Physicists: worked solutions of the end-of-chapter exercises, Ch. 1-4.
# Text uses <<name>> placeholders that build.py fills with numbers computed in calc.py.
EX = []
def ex(num, room, title, goal, given, steps, keys, xp=25, note=None):
    EX.append(dict(num=num, room=room, title=title, goal=goal, given=given, steps=steps, keys=keys, xp=xp, note=note))

# ------------------------------------------------------------------ Chapter 1
ex('1.1', 'galactic-dynamics', r'Mass of the Galaxy from the Sun\'s orbit',
   r'The Sun is about $8$ kpc from the galactic centre and moves on a nearly circular orbit at about $220\ \mathrm{km\,s^{-1}}$. Make a rough estimate of the mass of the Galaxy.',
   [r'$1\ \mathrm{pc}=3.09\times10^{16}$ m, $G=6.67\times10^{-11}$ SI, $M_\odot=1.99\times10^{30}$ kg'],
   [(r'Which force provides the centripetal acceleration, and which mass counts?',
     r'Gravity of the mass $M$ inside the orbit (for a roughly spherical distribution the outer mass exerts no net force): $\dfrac{v^2}{R}=\dfrac{GM}{R^2}$.'),
    (r'Solve for $M$ and put in the numbers.',
     r'$M=\dfrac{v^2R}{G}=\dfrac{(2.2\times10^5)^2\,(8\times3.09\times10^{19})}{6.67\times10^{-11}}\approx <<1.1.M>>\ \mathrm{kg}\approx <<1.1.Msun>>\,M_\odot$.'),
    (r'What does this number mean?',
     r'It is the mass inside the solar circle only, about $10^{11}M_\odot$. The flat rotation curve further out (Ch. 6.3) shows that the total mass, dark halo included, is several times larger.')],
   [r'$v^2/R=GM(<R)/R^2$', r'$M\approx10^{41}$ kg $\approx10^{11}M_\odot$', r'only the mass inside $R$ is measured'], xp=15)

ex('1.2', 'photometry-radiation', r'Absolute magnitude and luminosity of a nearby star',
   r'A star at a distance of $4$ pc has apparent magnitude $m=2$. Find its absolute magnitude. The Sun has $L_\odot=3.9\times10^{26}$ W and absolute magnitude about $5$: find the luminosity of the star.',
   [r'$M=m-5\log_{10}(d/10\ \mathrm{pc})$', r'$M_1-M_2=-2.5\log_{10}(L_1/L_2)$'],
   [(r'Absolute magnitude: the magnitude the star would have at $10$ pc.',
     r'$M=2-5\log_{10}(0.4)=2+1.99\approx <<1.2.Mabs>>$. The star is closer than 10 pc, so it would look fainter there ($M>m$).'),
    (r'Compare with the Sun using the magnitude scale.',
     r'$\dfrac{L}{L_\odot}=10^{0.4(M_\odot-M)}=10^{0.4(5-4.0)}\approx <<1.2.ratio>>$.'),
    (r'Luminosity.', r'$L\approx <<1.2.ratio>>\times3.9\times10^{26}\ \mathrm{W}\approx <<1.2.L>>$ W, about $2.5L_\odot$.')],
   [r'distance modulus with the right sign', r'$M\approx4.0$', r'$L/L_\odot=10^{0.4\Delta M}\approx2.5$'], xp=15)

ex('1.3', 'photometry-radiation', r'Resolution of the GMRT',
   r'The Giant Metrewave Radio Telescope has antennas spread over about $10$ km. Estimate its resolution in arcseconds. How large would an optical telescope have to be for the same resolution in visible light?',
   [r'diffraction limit $\theta\approx\lambda/D$', r'GMRT works at metre wavelengths (50 MHz to 1.4 GHz, i.e. $\lambda\approx0.2$ to $6$ m)'],
   [(r'Which baseline and wavelength?',
     r'An interferometer resolves like a single dish of the size of its longest baseline, $D\approx10^4$ m. Take a typical "metrewave" $\lambda\approx1$ m.'),
    (r'Resolution.',
     r'$\theta\approx\lambda/D=10^{-4}$ rad $\approx <<1.3.arcsec>>^{\prime\prime}$. At the 21 cm line it would be $\approx <<1.3.th21>>^{\prime\prime}$.'),
    (r'Optical telescope with the same $\theta$.',
     r'$D=\lambda/\theta=5\times10^{-7}\ \mathrm{m}/10^{-4}=<<1.3.D>>$ m: a 5 mm lens. Radio astronomy needs huge apertures because $\lambda$ is $10^6$ times longer (and the atmosphere, not diffraction, limits big optical telescopes to about $1^{\prime\prime}$).')],
   [r'$\theta\approx\lambda/D$ with $D$ = baseline', r'$\theta\sim20^{\prime\prime}$ at $\lambda\approx1$ m', r'optical equivalent $\sim$ mm'], xp=15)

# ------------------------------------------------------------------ Chapter 2
ex('2.1', 'photometry-radiation', r'Stefan–Boltzmann and Wien from Planck',
   r'From Planck\'s law $U_\nu\,d\nu=\dfrac{8\pi h}{c^3}\dfrac{\nu^3d\nu}{e^{h\nu/\kappa_BT}-1}$ show (a) $U=a_BT^4$ with $a_B=\dfrac{8\pi\kappa_B^4}{c^3h^3}\int_0^\infty\dfrac{x^3dx}{e^x-1}$ $\left(=\dfrac{\pi^4}{15}\right)$; (b) the flux from unit area of a blackbody is $\sigma T^4$ with $\sigma=ca_B/4$; (c) $U_\nu$ peaks at $\nu_{\max}/T=5.88\times10^{10}\ \mathrm{Hz\,K^{-1}}$.',
   [r'isotropic radiation: $I_\nu=\dfrac{c}{4\pi}U_\nu$', r'flux through a surface: $F=\int I\cos\theta\,d\Omega$'],
   [(r'(a) Integrate over $\nu$ with $x=h\nu/\kappa_BT$.',
     r'$U=\dfrac{8\pi h}{c^3}\left(\dfrac{\kappa_BT}{h}\right)^4\int_0^\infty\dfrac{x^3dx}{e^x-1}=\dfrac{8\pi\kappa_B^4}{c^3h^3}\dfrac{\pi^4}{15}T^4$, so $a_B=<<2.1.aB>>\ \mathrm{J\,m^{-3}K^{-4}}$.'),
    (r'(b) Flux leaving the surface: integrate $I\cos\theta$ over the outward hemisphere.',
     r'$F=I\int_0^{2\pi}\!d\phi\int_0^{1}\mu\,d\mu=\pi I=\pi\dfrac{c}{4\pi}U=\dfrac{c}{4}a_BT^4$, so $\sigma=ca_B/4=<<2.1.sigma>>$ SI.'),
    (r'(c) Maximise $\nu^3/(e^{h\nu/\kappa_BT}-1)$.',
     r'$\dfrac{d}{dx}\dfrac{x^3}{e^x-1}=0\Rightarrow 3(1-e^{-x})=x$, root $x=<<2.1.x>>$. Hence $\nu_{\max}/T=x\kappa_B/h=<<2.1.numax>>\ \mathrm{Hz\,K^{-1}}$.'),
    (r'Why is this not $c/\lambda_{\max}$ of Wien\'s law $\lambda_{\max}T=2.9\times10^{-3}$ m K?',
     r'$U_\lambda$ and $U_\nu$ peak at different places because $d\nu=c\,d\lambda/\lambda^2$ (the root is $x=4.965$ for $U_\lambda$). $\nu_{\max}\lambda_{\max}\approx0.57c$, not $c$.')],
   [r'substitution $x=h\nu/\kappa_BT$ and the $\pi^4/15$ integral', r'$F=\pi I$ from the hemisphere integral, $\sigma=ca_B/4$', r'transcendental equation $3(1-e^{-x})=x$, $x\approx2.82$', r'peak in $\nu$ $\ne$ peak in $\lambda$'], xp=30)

ex('2.2', 'radiative-transfer', r'Flux in a pinhole camera',
   r'A pinhole camera has a small circular hole of diameter $d$ and a film plane at distance $L$ behind it (Fig. 2.10). Show that the flux at the film plane is $F_\nu=\dfrac{\pi\cos^4\theta}{4f^2}I_\nu(\theta,\phi)$, with focal ratio $f=L/d$.',
   [r'$dF_\nu=I_\nu\cos\theta\,d\Omega$ for radiation arriving at angle $\theta$ to the normal of the receiving area', r'intensity is constant along a ray in vacuum'],
   [(r'Which rays reach a small patch of film at angle $\theta$ from the axis?',
     r'Only rays through the hole. Seen from the patch, the hole subtends the solid angle $d\Omega=\dfrac{A_{\rm hole}\cos\theta}{r^2}$, with $A_{\rm hole}=\pi d^2/4$, distance $r=L/\cos\theta$, and $\cos\theta$ because the hole is seen obliquely.'),
    (r'Write the flux on the patch.',
     r'$F_\nu=I_\nu\cos\theta\,d\Omega=I_\nu\cos\theta\cdot\dfrac{\pi d^2}{4}\dfrac{\cos\theta\cos^2\theta}{L^2}$.'),
    (r'Simplify.',
     r'$F_\nu=\dfrac{\pi}{4}\left(\dfrac{d}{L}\right)^2\cos^4\theta\,I_\nu=\dfrac{\pi\cos^4\theta}{4f^2}I_\nu(\theta,\phi)$. The image brightness reproduces $I_\nu$ of the sky in direction $(\theta,\phi)$, dimmed by the $\cos^4\theta$ vignetting towards the edge and by $1/f^2$.')],
   [r'solid angle of the hole $=A\cos\theta/r^2$', r'three cosines from geometry plus one from projection', r'$f=L/d$ gives the $1/f^2$'], xp=25)

def _t23():
    return r'Results: <<2.3.table>>'
ex('2.3', 'radiative-transfer', r'Saha equation for air-density hydrogen',
   r'Hydrogen gas has the density of air at normal conditions, $\rho=1.29\ \mathrm{kg\,m^{-3}}$. With $\chi=13.6$ eV, use the Saha equation (2.29) to calculate the ionization fraction $x$ at different temperatures and plot $x(T)$.',
   [r'(2.29): $\dfrac{x^2}{1-x}=\dfrac{(2\pi m_e)^{3/2}(\kappa_BT)^{5/2}}{h^3P}e^{-\chi/\kappa_BT}$', r'$P=(n_p+n_e+n_H)\kappa_BT=(1+x)n\kappa_BT$, $n=\rho/m_H$'],
   [(r'The density is fixed, the pressure is not. Use the density form of the Saha law.',
     r'With $n_e=n_p=xn$, $n_H=(1-x)n$ and $n=\rho/m_H=<<2.7.ne>>\ \mathrm{m^{-3}}$: $\dfrac{n_en_p}{n_H}=\dfrac{x^2n}{1-x}=\left(\dfrac{2\pi m_e\kappa_BT}{h^2}\right)^{3/2}e^{-\chi/\kappa_BT}$. This is (2.29) with the pressure written as $P=n\kappa_BT$; the pressure form at fixed $P$ would describe a different gas.'),
    (r'Solve for $x$ at a few temperatures (a quadratic in $x$).',
     _t23()),
    (r'Read off the plot.',
     r'$x$ stays tiny up to $\sim10^4$ K and reaches $1/2$ only near $T\approx<<2.3.Thalf>>$ K. Ionisation is held back by the high density (recombination is fast); in stellar atmospheres ($n$ much lower) hydrogen ionises near $10^4$ K.')],
   [r'use constant $n$, not constant $P$', r'quadratic solution for $x$', r'$x(T)$ rises steeply; $x=1/2$ at a few $10^4$ K', r'the exponential $e^{-\chi/\kappa_BT}$ dominates'], xp=30,
   note=r'Book Fig. and equation numbers refer to Choudhuri; the table was computed with the book constants.')

ex('2.4', 'radiative-transfer', r'Specific intensity inside a grey atmosphere',
   r'Find the specific intensity $I(\tau,\mu>0)$ at an arbitrary optical depth $\tau$ inside a plane-parallel grey atmosphere in the Eddington approximation, with constant flux $F$.',
   [r'(2.68): $S=\dfrac{3F}{4\pi}\left(\tau+\dfrac23\right)$', r'(2.65): $I(\tau,\mu\ge0)=\displaystyle\int_\tau^\infty S(t)\,e^{-(t-\tau)/\mu}\dfrac{dt}{\mu}$'],
   [(r'Substitute the source function into the formal solution.',
     r'$I=\dfrac{3F}{4\pi}\displaystyle\int_\tau^\infty\left(t+\tfrac23\right)e^{-(t-\tau)/\mu}\frac{dt}{\mu}$; put $s=t-\tau$.'),
    (r'Do the two integrals.',
     r'$\int_0^\infty e^{-s/\mu}ds/\mu=1$ and $\int_0^\infty s\,e^{-s/\mu}ds/\mu=\mu$, so $I(\tau,\mu)=\dfrac{3F}{4\pi}\left(\tau+\mu+\dfrac23\right)$.'),
    (r'Checks.',
     r'At $\tau=0$ this is (2.66) with $q=2/3$. Limb darkening: $I(0,\mu)/I(0,1)=\frac35(\mu+\frac23)$, the centre is brighter than the limb. Deep inside, $I\to S+\frac{3F}{4\pi}\mu$: nearly isotropic with a small outward excess that carries the flux.')],
   [r'formal solution with the Eddington source function', r'$I=\frac{3F}{4\pi}(\tau+\mu+\frac23)$', r'limits: surface (limb darkening) and depth (isotropy)'], xp=25)

ex('2.5', 'radiative-transfer', r'Brightness of a spherical isothermal cloud',
   r'A spherical gas cloud of radius $R$ and uniform temperature $T$ is far from the observer. (a) If it is optically thin, how does the brightness vary with the distance $b$ from the cloud centre (on the sky)? (b) What is the effective temperature of the cloud surface? (c) How do (a) and (b) change if the cloud is optically thick?',
   [r'formal solution with no background: $I_\nu=S_\nu(1-e^{-\tau_\nu})$, LTE: $S_\nu=B_\nu(T)$', r'$\tau_\nu=\alpha_\nu\times$ path length'],
   [(r'(a) Path length through the sphere at impact parameter $b$.',
     r'$\ell(b)=2\sqrt{R^2-b^2}$. Thin: $I_\nu(b)\approx B_\nu(T)\tau_\nu=2\alpha_\nu B_\nu(T)\sqrt{R^2-b^2}$: brightest at the centre, falling to zero at the edge (limb darkening of a thin cloud, opposite of "limb brightening" of a thin shell).'),
    (r'(b) Total power of a thin cloud and the definition of $T_{\rm eff}$.',
     r'Every volume element radiates $4\pi j=4\pi\alpha B$; with a grey (Planck-mean) $\alpha$: $L=\frac43\pi R^3\cdot4\alpha\sigma T^4$. Setting $L=4\pi R^2\sigma T_{\rm eff}^4$: $T_{\rm eff}^4=\frac43\alpha R\,T^4=\frac23\tau_cT^4$ with $\tau_c=2\alpha R$, so $T_{\rm eff}=(2\tau_c/3)^{1/4}T\ll T$.'),
    (r'(c) Optically thick.',
     r'$I_\nu=B_\nu(T)$ for every line of sight that hits the cloud: a uniformly bright disk (no limb darkening, since $T$ is uniform), and $T_{\rm eff}=T$: it radiates like a blackbody of temperature $T$.')],
   [r'path length $2\sqrt{R^2-b^2}$', r'thin: $I\propto\tau(b)$; thick: $I=B(T)$', r'$T_{\rm eff}\propto\tau^{1/4}T$ when thin, $=T$ when thick'], xp=25)

ex('2.6', 'radiative-transfer', r'Spectrum of a grey atmosphere',
   r'How do you calculate the spectrum emerging from a grey atmosphere in the Eddington approximation? (Optionally compute $I_\nu(0,1)$ numerically.) If G is the grey spectrum and R a real one (Fig. 2.11), what can you say about how $\alpha_\nu$ varies with frequency?',
   [r'(2.69): $T^4=\frac34T_{\rm eff}^4\left(\tau+\frac23\right)$', r'LTE: $S_\nu=B_\nu(T)$'],
   [(r'Formal solution at the surface, along the normal ($\mu=1$).',
     r'$I_\nu(0,1)=\displaystyle\int_0^\infty B_\nu\big(T(\tau)\big)e^{-\tau}d\tau$ with $T(\tau)$ from (2.69): a weighted sum of Planck curves of the layers down to $\tau\approx1$.'),
    (r'Numerical recipe.',
     r'For each $\nu$: integrate on a grid in $\tau$ (up to $\tau\approx10$), using $T(\tau)$. The result is close to a Planck curve of $T(\tau\approx2/3)=T_{\rm eff}$, a bit broader because hotter deeper layers add blue light.'),
    (r'Reading a real spectrum against the grey one.',
     r'Where R lies above G, $\alpha_\nu$ is smaller than the mean: we see deeper, hotter layers. Where R lies below G (absorption lines, edges such as the Balmer jump), $\alpha_\nu$ is larger: $\tau_\nu=1$ is reached in the cooler, higher layers. A real atmosphere is non-grey, and the spectrum maps $\alpha_\nu$ onto the depth $T(\tau_\nu=1)$.')],
   [r'$I_\nu(0,1)=\int B_\nu(T(\tau))e^{-\tau}d\tau$', r'grey spectrum $\approx$ Planck at $T_{\rm eff}$', r'excess $\leftrightarrow$ low $\alpha_\nu$ (deep, hot); deficit $\leftrightarrow$ high $\alpha_\nu$'], xp=25,
   note=r'Fig. 2.11 is only described in our text copy: check the shape of R against G in the book figure.')

ex('2.7', 'radiative-transfer', r'Thomson scattering in an ionized "atmosphere"',
   r'Fully ionized hydrogen has the density of the Earth\'s atmosphere. Using Thomson scattering by free electrons, find the path length after which a light beam is reduced to half its intensity. (Why did matter-radiation decoupling only happen after recombination, §11.7?)',
   [r'$\sigma_T=6.65\times10^{-29}\ \mathrm{m^2}$', r'$I=I_0e^{-n_e\sigma_Ts}$'],
   [(r'Electron density.', r'One electron per proton: $n_e=\rho/m_H=1.29/1.67\times10^{-27}=<<2.7.ne>>\ \mathrm{m^{-3}}$.'),
    (r'Half-intensity length.', r'$e^{-n_e\sigma_Ts}=\frac12\Rightarrow s=\dfrac{\ln2}{n_e\sigma_T}=<<2.7.l>>$ m.'),
    (r'Meaning.',
     r'A fully ionized gas of air density is opaque after a few tens of metres. Before recombination the Universe was such a fog: photons scattered constantly. Only when the electrons were bound into atoms ($z\approx1100$) did the mean free path become larger than the horizon, and the CMB photons travel freely.')],
   [r'$n_e=\rho/m_H$', r'$s=\ln2/(n_e\sigma_T)\approx13$ m', r'link to recombination/decoupling'], xp=20)

# ------------------------------------------------------------------ Chapter 3
ex('3.1', 'stellar-forge', r'Thermal versus gravitational energy of the Sun',
   r'Estimate the total thermal energy of the Sun from the fact that its internal temperature is of order $10^7$ K. Show that it is of the same order as the rough estimate of the gravitational potential energy.',
   [r'$E_{\rm th}=\frac32N\kappa_BT$, $N\approx M_\odot/(\mu m_H)$, $\mu\approx0.6$', r'$|E_G|\approx GM_\odot^2/R_\odot$'],
   [(r'Number of particles.', r'Ionized gas, $\mu\approx0.6$: $N=M_\odot/(0.6m_H)\approx<<3.1.N>>$.'),
    (r'Thermal energy.', r'$E_{\rm th}\approx\frac32N\kappa_B(10^7\ \mathrm K)\approx<<3.1.Eth>>$ J.'),
    (r'Gravitational energy and comparison.',
     r'$|E_G|\approx GM_\odot^2/R_\odot=<<3.1.EG>>$ J: the same order. This is the virial theorem (§3.2.2): $2E_{\rm th}+E_G=0$, i.e. a self-gravitating gas ball in equilibrium must have $\kappa_BT\sim GMm_H/R$.')],
   [r'particle number with $\mu$', r'both $\sim4\times10^{41}$ J', r'virial theorem as the reason'], xp=20)

ex('3.2', 'stellar-forge', r'Kelvin–Helmholtz contraction rate',
   r'If the Sun produced its energy by slow contraction (Helmholtz and Kelvin), by how much would its radius have to decrease every year to supply the observed luminosity?',
   [r'virial theorem: half of the released gravitational energy is radiated', r'$E_G\approx-GM^2/R$'],
   [(r'Energy budget.', r'$L=\frac12\dfrac{d|E_G|}{dt}=\frac12\dfrac{GM^2}{R^2}\left|\dfrac{dR}{dt}\right|$ (the other half heats the star).'),
    (r'Solve.', r'$\left|\dfrac{dR}{dt}\right|=\dfrac{2LR^2}{GM^2}=<<3.2.ms>>\ \mathrm{m\,s^{-1}}\approx<<3.2.myr>>$ m per year (with $E_G=-\frac35GM^2/R$ for a uniform sphere: $\approx<<3.2.myr35>>$ m/yr).'),
    (r'Is that observable, and why is the hypothesis wrong?',
     r'Tens of metres per year is far below what we can measure. The objection is the time scale: $\tau_{KH}\approx|E_G|/2L\approx10^7$ yr, far shorter than the geological age of the Earth.')],
   [r'$L=\frac12\,d|E_G|/dt$', r'$|\dot R|=2LR^2/GM^2\approx40$ to $70$ m/yr', r'Kelvin–Helmholtz time $\sim10^7$ yr is too short'], xp=20)

ex('3.3', 'stellar-forge', r'Radiation versus gas pressure in the solar centre',
   r'Show that the radiation pressure at the centre of the Sun is negligible compared to the gas pressure, by estimating their ratio.',
   [r'$P_{\rm rad}=\frac13a_BT^4$, $P_{\rm gas}=\dfrac{\kappa_B}{\mu m_H}\rho T$ (3.23)', r'centre: $T_c\approx1.56\times10^7$ K, $\rho_c\approx1.48\times10^5\ \mathrm{kg\,m^{-3}}$, $\mu\approx0.62$'],
   [(r'Radiation pressure.', r'$P_{\rm rad}=\frac13a_BT_c^4\approx<<3.3.Prad>>$ Pa.'),
    (r'Gas pressure.', r'$P_{\rm gas}=\dfrac{\rho_c\kappa_BT_c}{\mu m_H}\approx<<3.3.Pgas>>$ Pa.'),
    (r'Ratio and scaling.',
     r'$P_{\rm rad}/P_{\rm gas}\approx<<3.3.ratio>>$. The ratio $\propto T^3/\rho$; for stars on the main sequence it grows with mass (Exercise 5.5), so radiation pressure matters only for massive stars.')],
   [r'both formulas with the right $\mu$', r'ratio $\sim5\times10^{-4}$', r'ratio $\propto T^3/\rho$'], xp=20)

ex('3.4', 'stellar-forge', r'Structure of the solar convection zone',
   r'The Sun has a convection zone from $0.7R_\odot$ to the surface. Find how $\rho$, $P$ and $T$ vary in it, assuming (i) (3.22) holds exactly and (ii) the zone contains so little mass that $g=GM_\odot/r^2$.',
   [r'(3.22): $\dfrac{dT}{dr}=\left(1-\dfrac1\gamma\right)\dfrac TP\dfrac{dP}{dr}$, $\gamma=5/3$', r'hydrostatic: $\dfrac{dP}{dr}=-\dfrac{GM\rho}{r^2}$, $P=\dfrac{\kappa_B}{\mu m_H}\rho T$'],
   [(r'What does (3.22) say about $P$ and $T$?',
     r'$\dfrac{d\ln T}{d\ln P}=1-\dfrac1\gamma=\dfrac25$: $P\propto T^{5/2}$ and with the ideal gas $\rho\propto T^{3/2}$ (an adiabat, polytrope $n=3/2$).'),
    (r'Temperature gradient.',
     r'Insert hydrostatic equilibrium: $\dfrac{dT}{dr}=-\dfrac25\dfrac{T}{P}\dfrac{GM\rho}{r^2}=-\dfrac25\dfrac{GM\mu m_H}{\kappa_Br^2}$: a constant times $1/r^2$.'),
    (r'Integrate with $T\approx0$ at the surface.',
     r'$T(r)=\dfrac25\dfrac{GM\mu m_H}{\kappa_B}\left(\dfrac1r-\dfrac1R\right)$, then $\rho=\rho_b\,(T/T_b)^{3/2}$, $P=P_b\,(T/T_b)^{5/2}$.'),
    (r'Numbers at the base $r=0.7R_\odot$ ($\mu=0.6$).',
     r'$T_b=\frac25\times<<3.4.scale>>\ \mathrm K\times(1/0.7-1)\approx<<3.4.T07>>$ K, close to the $2\times10^6$ K of solar models.')],
   [r'adiabat: $P\propto T^{5/2}$, $\rho\propto T^{3/2}$', r'linear-in-$1/r$ temperature profile', r'$T_b\approx2\times10^6$ K'], xp=30)

ex('3.5', 'stellar-forge', r'Eddington limit and maximum stellar mass',
   r'In very hot stars the opacity is Thomson scattering. Show that $L/M$ must be below a critical value and find it; compare with $L_\odot/M_\odot$. Use (3.45) to estimate the maximum mass for which the outer layers are not blown off.',
   [r'Eddington: $L<\dfrac{4\pi cGM}{\chi}$, $\chi=\sigma_T/m_H$ for ionized hydrogen', r'(3.45): $\lambda M_{\max}^2=4\pi cG/\chi$ with $L=\lambda M^3$'],
   [(r'Balance radiation force and gravity on a gas element.',
     r'Radiative force per unit mass $\chi F/c=\chi L/(4\pi r^2c)$ must be below $GM/r^2$: $\dfrac LM<\dfrac{4\pi cG}{\chi}$. $R$ cancels.'),
    (r'Number.', r'$\chi=\sigma_T/m_H=<<3.5.chi>>\ \mathrm{m^2kg^{-1}}$, so $(L/M)_{\max}=<<3.5.LM>>\ \mathrm{W\,kg^{-1}}$; the Sun has $L_\odot/M_\odot=<<3.5.LMsun>>$, about $<<3.5.ratio>>$ times less.'),
    (r'Maximum mass with $L\propto M^3$.',
     r'$\lambda=L_\odot/M_\odot^3$, so $\left(\dfrac{M_{\max}}{M_\odot}\right)^2=\dfrac{(L/M)_{\max}}{L_\odot/M_\odot}\Rightarrow M_{\max}\approx<<3.5.Mmax>>M_\odot$. Real upper masses are $\sim100M_\odot$: the order is right.')],
   [r'radiative force $\chi L/4\pi r^2c$ versus gravity', r'$(L/M)_{\max}\approx6\ \mathrm{W/kg}$', r'$M_{\max}\sim10^2M_\odot$ from $L\propto M^3$'], xp=30)

ex('3.6', 'stellar-forge', r'Distance of the globular cluster M3',
   r'From Figures 3.5 and 3.8, estimate the distance of the globular cluster M3.',
   [r'distance modulus $m-M=5\log_{10}(d/10\ \mathrm{pc})$', r'a feature of known absolute magnitude in the cluster\'s HR diagram'],
   [(r'Idea.',
     r'Fig. 3.8 is the colour–magnitude diagram of M3 in apparent magnitude. Pick a feature whose absolute magnitude you know from Fig. 3.5 (the HR diagram of nearby stars): the horizontal branch ($M_V\approx+0.6$) or the main sequence at the same colour (main-sequence fitting).'),
    (r'Read and compute.',
     r'The horizontal branch of M3 lies at $V\approx15.6$: $m-M\approx15.0$, $d=10^{(m-M+5)/5}$ pc $\approx<<3.6.d>>$ pc, i.e. about $10$ kpc.'),
    (r'Sources of error.',
     r'Reading the figures ($\pm0.3$ mag gives $\pm15\%$ in $d$), metallicity differences between cluster and field stars, and interstellar extinction (small for M3, high galactic latitude).')],
   [r'shift between apparent and absolute sequence = distance modulus', r'$d\approx10$ kpc', r'extinction and metallicity as caveats'], xp=20,
   note=r'The magnitudes are typical literature values for M3; check them against Figs. 3.5 and 3.8 of the book.')

ex('3.7', 'stellar-forge', r'Peak wavelengths of a $9M_\odot$ and a $0.25M_\odot$ star',
   r'Make a very rough estimate of the wavelengths at which a star of $9M_\odot$ and a star of $0.25M_\odot$ emit maximum radiation.',
   [r'Wien: $\lambda_{\max}T=2.90\times10^{-3}$ m K', r'main-sequence $T_{\rm eff}$ from the HR diagram (Fig. 3.5) or scaling laws'],
   [(r'Main-sequence effective temperatures.',
     r'From the HR diagram: a $9M_\odot$ star is an early B star, $T_{\rm eff}\approx<<3.7.T9>>$ K; a $0.25M_\odot$ star is an M dwarf, $T_{\rm eff}\approx<<3.7.T025>>$ K.'),
    (r'Wien\'s law.',
     r'$\lambda_{\max}\approx<<3.7.l9>>$ m (ultraviolet) and $\approx<<3.7.l025>>$ m (near infrared).'),
    (r'Why a pure scaling estimate is poor here.',
     r'$L\propto M^3$ with $R\propto M$ gives $T\propto M^{1/4}$, i.e. only $<<3.7.Tsc9>>$ K for $9M_\odot$: the radius grows more slowly than $M$ and $L$ faster than $M^3$ for massive stars. Reading the HR diagram is the better rough estimate.')],
   [r'$T_{\rm eff}$ from mass via the main sequence', r'UV for the massive star, near IR for the M dwarf', r'Wien applied correctly'], xp=15)

# ------------------------------------------------------------------ Chapter 4
ex('4.1', 'nuclear-furnace', r'Gamow factor from WKB',
   r'Nuclei of charges $Z_1e$, $Z_2e$ approach with relative energy $E$; classically they cannot come closer than $r_1$, $E=\dfrac{Z_1Z_2e^2}{4\pi\epsilon_0r_1}$. With WKB show $P\propto\exp\left[-2\displaystyle\int_{r_0}^{r_1}\sqrt{\frac{2m}{\hbar^2}\left(\frac{Z_1Z_2e^2}{4\pi\epsilon_0r}-E\right)}dr\right]$ ($m$ reduced mass, $r_0$ nuclear radius). Evaluate the integral with $r=r_1\cos^2\theta$ for $r_1\gg r_0$ and obtain (4.7).',
   [r'WKB transmission $P\approx e^{-2\int\kappa\,dr}$, $\hbar\kappa=\sqrt{2m(V-E)}$', r'(4.7): $P\propto\exp\left[-\dfrac{1}{2\epsilon_0\hbar}\left(\dfrac m2\right)^{1/2}\dfrac{Z_1Z_2e^2}{\sqrt E}\right]$'],
   [(r'Write the integrand with $r_1$.',
     r'$\dfrac{Z_1Z_2e^2}{4\pi\epsilon_0r}-E=E\left(\dfrac{r_1}{r}-1\right)$, so the exponent is $-2\sqrt{\dfrac{2mE}{\hbar^2}}\displaystyle\int_{r_0}^{r_1}\sqrt{\frac{r_1}{r}-1}\,dr$.'),
    (r'Substitute $r=r_1\cos^2\theta$.',
     r'$dr=-2r_1\cos\theta\sin\theta\,d\theta$ and $\sqrt{r_1/r-1}=\tan\theta$: $\displaystyle\int=2r_1\int_0^{\theta_0}\sin^2\theta\,d\theta=r_1\left[\theta_0-\sin\theta_0\cos\theta_0\right]$, with $\cos^2\theta_0=r_0/r_1$.'),
    (r'Limit $r_1\gg r_0$.',
     r'$\theta_0\to\pi/2$: the integral $\to\pi r_1/2$ (correction $-2\sqrt{r_0r_1}$, the small "nuclear radius" term).'),
    (r'Assemble.',
     r'Exponent $=-2\sqrt{\dfrac{2mE}{\hbar^2}}\dfrac{\pi}{2}\dfrac{Z_1Z_2e^2}{4\pi\epsilon_0E}=-\dfrac{Z_1Z_2e^2}{4\epsilon_0\hbar}\sqrt{\dfrac{2m}{E}}=-\dfrac{1}{2\epsilon_0\hbar}\left(\dfrac m2\right)^{1/2}\dfrac{Z_1Z_2e^2}{\sqrt E}$, which is (4.7). Equivalently $P\propto e^{-\sqrt{E_G/E}}$, $E_G=2mc^2(\pi\alpha Z_1Z_2)^2$.')],
   [r'WKB exponent with $V-E=E(r_1/r-1)$', r'substitution gives $\theta_0-\sin\theta_0\cos\theta_0$', r'$r_1\gg r_0$: integral $=\pi r_1/2$', r'final form (4.7) / Gamow energy'], xp=35)

ex('4.2', 'nuclear-furnace', r'The pp-chain exponent',
   r'For two protons, show that the argument of the exponential in the energy generation rate (4.19) becomes the one in (4.25), $-33.8\,(10^6/T)^{1/3}$.',
   [r'(4.19): $\varepsilon\propto\exp\left[-3\left(\dfrac{e^4mZ_1^2Z_2^2}{32\epsilon_0^2\hbar^2\kappa_BT}\right)^{1/3}\right]$', r'$m=m_p/2$, $Z_1=Z_2=1$'],
   [(r'Where does the 3 and the cube root come from?',
     r'Maximising $e^{-E/\kappa_BT-\sqrt{E_G/E}}$ (Gamow peak) gives $E_0=(E_G(\kappa_BT)^2/4)^{1/3}$ and exponent $-3(E_G/4\kappa_BT)^{1/3}$; $E_G/4=e^4mZ_1^2Z_2^2/(32\epsilon_0^2\hbar^2)$.'),
    (r'Evaluate the temperature scale for two protons.',
     r'$T_G=\dfrac{e^4(m_p/2)}{32\epsilon_0^2\hbar^2\kappa_B}=<<4.2.TG>>$ K.'),
    (r'Write in units of $10^6$ K.',
     r'$3\left(\dfrac{T_G}{T}\right)^{1/3}=3\left(\dfrac{T_G}{10^6\ \mathrm K}\right)^{1/3}\left(\dfrac{10^6}{T}\right)^{1/3}=<<4.2.coef>>\left(\dfrac{10^6}{T}\right)^{1/3}$, i.e. the 33.8 of (4.25).')],
   [r'Gamow peak: exponent $3(E_G/4\kappa_BT)^{1/3}$', r'reduced mass $m_p/2$', r'$\approx33.8\,(10^6/T)^{1/3}$'], xp=25)

ex('4.3', 'nuclear-furnace', r'Energy generation at the centre of the Sun',
   r'The solar centre has $T=1.56\times10^7$ K, $\rho=1.48\times10^5\ \mathrm{kg\,m^{-3}}$, $X_H=0.64$, $X_{He}=0.34$, $X_{CNO}=0.015$. Estimate the energy generated per unit volume by the pp chain and the CNO cycle.',
   [r'(4.25): $\varepsilon_{pp}=0.24\,\rho X^2\left(\dfrac{10^6}{T}\right)^{2/3}e^{-33.8(10^6/T)^{1/3}}\ \mathrm{W\,kg^{-1}}$', r'(4.27): $\varepsilon_{CNO}=8.7\times10^{20}\rho X_{CNO}X\left(\dfrac{10^6}{T}\right)^{2/3}e^{-152.3(10^6/T)^{1/3}}\ \mathrm{W\,kg^{-1}}$'],
   [(r'Evaluate $(10^6/T)^{1/3}$ and the exponentials.',
     r'$10^6/T=0.0641$, $(\ldots)^{1/3}=0.400$, $(\ldots)^{2/3}=0.160$; $e^{-33.8\times0.400}=1.3\times10^{-6}$, $e^{-152.3\times0.400}=3.5\times10^{-27}$.'),
    (r'Per unit mass.', r'$\varepsilon_{pp}\approx<<4.3.epp>>\ \mathrm{W\,kg^{-1}}$, $\varepsilon_{CNO}\approx<<4.3.ecno>>\ \mathrm{W\,kg^{-1}}$.'),
    (r'Per unit volume (multiply by $\rho$).',
     r'$\approx<<4.3.Upp>>\ \mathrm{W\,m^{-3}}$ (pp) and $\approx<<4.3.Ucno>>\ \mathrm{W\,m^{-3}}$ (CNO): the pp chain dominates in the Sun. Only a few hundred watts per cubic metre, less than a compost heap; the Sun is bright because it is huge.'),
    (r'Temperature sensitivity.',
     r'$d\ln\varepsilon/d\ln T=-\frac23+\frac{33.8}{3}(10^6/T)^{1/3}\approx4$ for pp and $\approx20$ for CNO: CNO wins in hotter (more massive) stars.')],
   [r'correct powers of $10^6/T$', r'$\varepsilon_{pp}\approx3\times10^{-3}$ W/kg', r'pp dominates the solar centre', r'temperature exponents $\sim4$ and $\sim20$'], xp=30)

ex('4.4', 'nuclear-furnace', r'Sound crossing time of the Sun',
   r'Make a very rough estimate of the time an acoustic wave travelling radially inward would take to go from one end of the Sun to the other.',
   [r'$c_s=\sqrt{\gamma P/\rho}=\sqrt{\gamma\kappa_BT/\mu m_H}$'],
   [(r'Sound speed at representative temperatures.',
     r'Centre ($1.6\times10^7$ K): $c_s\approx<<4.4.csc>>\ \mathrm{m\,s^{-1}}$; a typical interior temperature $5\times10^6$ K: $c_s\approx<<4.4.csm>>\ \mathrm{m\,s^{-1}}$; near the surface only $\sim10\ \mathrm{km\,s^{-1}}$.'),
    (r'Crossing time.', r'$t\approx2R_\odot/\langle c_s\rangle\approx<<4.4.t>>$ s, about an hour.'),
    (r'Why this matters.',
     r'Acoustic modes of the Sun (5-minute oscillations) have periods much shorter than this crossing time; their frequencies probe $c_s(r)$ and thus $T(r)$: helioseismology (§4.4).')],
   [r'$c_s$ from the ideal gas', r'$t\sim1$ hour', r'link to helioseismology'], xp=15)

ex('4.5', 'nuclear-furnace', r'Mass lost in the solar wind',
   r'Near the Earth the solar wind has $v\approx400\ \mathrm{km\,s^{-1}}$ and about $10$ protons per $\mathrm{cm^3}$. If it always had these values during $4.5\times10^9$ yr, what fraction of its mass has the Sun lost?',
   [r'$\dot M=4\pi r^2nm_pv$ through a sphere of radius 1 AU'],
   [(r'Mass flux.', r'$\dot M=4\pi(1.5\times10^{11})^2\times10^7\times1.67\times10^{-27}\times4\times10^5\approx<<4.5.Mdot>>\ \mathrm{kg\,s^{-1}}$.'),
    (r'Over the solar lifetime.', r'$\Delta M=\dot M\times4.5\times10^9\ \mathrm{yr}\approx<<4.5.lost>>$ kg, a fraction $<<4.5.frac>>$ of $M_\odot$.'),
    (r'Compare with nuclear burning.', r'$L_\odot/c^2\approx4\times10^9\ \mathrm{kg\,s^{-1}}$: the Sun loses about twice as much mass to radiation as to the wind, both negligible for its evolution.')],
   [r'$\dot M=4\pi r^2\rho v$', r'$\sim2\times10^9$ kg/s', r'fraction $\sim10^{-4}$'], xp=15)

ex('4.6', 'nuclear-furnace', r'Neutrino mass from SN 1987A',
   r'Neutrinos from SN 1987A travelled $55$ kpc and had energies of $6$–$39$ MeV. If the $12$ s spread in arrival times came from different speeds, show that the neutrino mass cannot be much more than about $20$ eV.',
   [r'for $E\gg mc^2$: $\dfrac vc\approx1-\dfrac{m^2c^4}{2E^2}$'],
   [(r'Delay relative to light.', r'$\Delta t(E)=\dfrac dc\left(\dfrac cv-1\right)\approx\dfrac dc\dfrac{m^2c^4}{2E^2}$.'),
    (r'Difference between the slowest and fastest neutrinos.',
     r'$\Delta t_{6}-\Delta t_{39}=\dfrac dc\dfrac{m^2c^4}{2}\left(\dfrac1{E_1^2}-\dfrac1{E_2^2}\right)\le12$ s, with $d/c=<<4.6.dc>>$ s.'),
    (r'Solve.',
     r'$mc^2\le\sqrt{\dfrac{2\times12}{(d/c)(1/36-1/1521)\ \mathrm{MeV^{-2}}}}\approx<<4.6.m>>$ eV. The emission itself lasts seconds, so the bound is "not much more than" $\sim10$–$20$ eV.')],
   [r'$1-v/c\approx m^2c^4/2E^2$', r'delay $\propto E^{-2}$, use the two extreme energies', r'$m\lesssim$ a few tens of eV'], xp=25)
