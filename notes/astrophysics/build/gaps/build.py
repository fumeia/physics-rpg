"""Astro gap lessons, from the coverage map (notes/astrophysics/coverage.md): sections of Choudhuri that had no lesson or no
practice. Short theory cards with checks, plus one multiple-choice quiz in the style of the Refregier MC part.
Writes game/content/astrophysics/gaps.json (an extras file: {items: [{room, enc}]}).
Numbers were checked by hand / python (see the comments). Run: python3 build.py"""
import json, os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '../../../../game/content/astrophysics/gaps.json')
BOOK = 'materials/astrophysics/scripts/Choudhuri_Textbook.pdf'


def T(h): return {'kind': 'text', 'html': h}
def E(t, l=None): return {'kind': 'eq', 'tex': t, **({'label': l} if l else {})}
def B(kind, h): return {'kind': kind, 'html': h}
def K(q, opts, correct, explain): return {'q': q, 'options': opts, 'correct': correct, 'explain': explain}
def L(id, title, where, minutes, blocks, check):
    return {'type': 'lesson', 'id': id, 'title': title, 'tier': 'theory', 'minutes': minutes, 'xp': 15,
            'source': [{'file': BOOK, 'where': 'Choudhuri ' + where}], 'blocks': blocks, 'check': check}


items = []
def add(room, enc): items.append({'room': room, 'enc': enc})

add('photometry-radiation', L('astro-gap-coord', 'Celestial coordinates: where is a star in the sky?', '§1.3 (and §6.1.4 galactic coordinates)', 8, [
    T(r'The <b>equatorial system</b> projects Earth&#8217;s latitude and longitude onto the sky. <b>Declination</b> $\delta$ is the angle north (+) or south (−) of the celestial equator, $-90^\circ\le\delta\le90^\circ$. <b>Right ascension</b> $\alpha$ is measured eastward along the equator from the vernal equinox, in hours: $24^{\rm h}=360^\circ$, $1^{\rm h}=15^\circ$.'),
    E(r'H=\mathrm{LST}-\alpha,\qquad h_{\rm pole}=\varphi,\qquad h_{\max}=90^\circ-|\varphi-\delta|', 'hour angle; pole altitude = latitude; altitude at culmination'),
    T(r'A star is <b>circumpolar</b> (never sets) for an observer at northern latitude $\varphi$ if $\delta>90^\circ-\varphi$, and never rises if $\delta<-(90^\circ-\varphi)$.'),
    T(r'<b>Galactic coordinates</b> $(l,b)$: latitude $b$ from the Galactic plane, longitude $l$ from the direction of the Galactic centre (in Sagittarius). Extinction and star counts depend mainly on $|b|$: looking along the disk ($b\approx0$) passes through much more dust.'),
    B('intuition', r'Right ascension is a clock: a star with $\alpha=6^{\rm h}$ crosses your meridian 6 sidereal hours after the vernal equinox does. Declination is fixed for a star, so $h_{\max}$ only depends on where you stand.'),
    B('pitfall', r'1 hour of RA is $15^\circ$ of arc only on the equator; on the sky the arc between two RAs shrinks by $\cos\delta$.'),
    B('exam', r'MC style: which stars are visible from Zurich ($\varphi\approx47^\circ$), how high does a star culminate, why extinction grows towards $b=0$.')],
    [K(r'From $\varphi=47^\circ$N, which stars are circumpolar?', [r'$\delta>43^\circ$', r'$\delta>47^\circ$', r'$\delta>0^\circ$', r'$\delta<-43^\circ$'], 0, r'$\delta>90^\circ-\varphi=43^\circ$.'),
     K(r'Maximum altitude of a star with $\delta=-20^\circ$ seen from $\varphi=47^\circ$N?', [r'$23^\circ$', r'$43^\circ$', r'$67^\circ$', r'it never rises'], 0, r'$90^\circ-|47^\circ-(-20^\circ)|=23^\circ$.')]))

add('radiative-transfer', L('astro-gap-limb', 'Limb darkening and opacity laws', '§2.4 (grey atmosphere, Eddington-Barbier), §2.6 (opacity)', 10, [
    T(r'Looking at the solar disk at angle $\theta$ from the normal ($\mu=\cos\theta$), we see down to optical depth $\tau\approx\mu$ along the vertical: the <b>Eddington-Barbier</b> relation $I_\nu(0,\mu)\approx S_\nu(\tau_\nu=\mu)$, exact for a linear source function $S=a+b\tau$.'),
    E(r'T^4(\tau)=\tfrac34T_{\rm eff}^4\left(\tau+\tfrac23\right)\quad\Rightarrow\quad\frac{I(\mu)}{I(1)}=\frac{\mu+\frac23}{1+\frac23}=\frac{3\mu+2}{5}', 'grey atmosphere, Eddington approximation'),
    T(r'At the limb ($\mu\to0$) we only see shallow, cooler layers, so the limb is darker: $I(0)/I(1)=0.4$ in this model, close to the observed solar value in the visible. $T=T_{\rm eff}$ at $\tau=\frac23$: the &#8220;photosphere&#8221;.'),
    T(r'<b>Opacity laws.</b> Electron (Thomson) scattering is grey and independent of $\rho,T$; bound-free and free-free absorption follow Kramers&#8217; law; the H$^-$ ion dominates in the cool solar atmosphere.'),
    E(r'\kappa_{\rm es}=\frac{\sigma_T(1+X)}{2m_p}\approx0.2(1+X)\ {\rm cm^2\,g^{-1}},\qquad \kappa_{\rm Kr}\propto\rho\,T^{-7/2}', '$\\sigma_T=6.65\\times10^{-25}\\,{\\rm cm^2}$'),
    B('intuition', r'Kramers opacity falls steeply with $T$: hot, massive stars and the deep interior are dominated by electron scattering, which is why the Eddington luminosity uses $\kappa_{\rm es}$.'),
    B('pitfall', r'$n_e/\rho=(1+X)/(2m_p)$ for fully ionised H and He: each H gives one electron per $m_p$, each He two electrons per $4m_p$.'),
    B('exam', r'MC style: why is the solar limb darker; which opacity sets $L_{\rm Edd}$; units of $\kappa$.')],
    [K(r'In the Eddington grey atmosphere, $I(\mu=0)/I(\mu=1)$ is', [r'$0.4$', r'$0$', r'$2/3$', r'$1$'], 0, r'$(3\mu+2)/5$ at $\mu=0$.'),
     K(r'$\kappa_{\rm es}$ for $X=0.7$ is about', [r'$0.34\ {\rm cm^2/g}$', r'$0.2\ {\rm cm^2/g}$', r'$0.04\ {\rm cm^2/g}$', r'$3.4\ {\rm cm^2/g}$'], 0, r'$0.2\times1.7=0.34$.')]))

add('degenerate-matter', L('astro-gap-disk', 'Accretion disks and X-ray binaries', '§5.6', 10, [
    T(r'Matter falling from far away onto a compact object of mass $M$ and radius $R$ releases its potential energy. In a thin disk, half is radiated on the way in (virial: the other half is orbital kinetic energy), the rest at the surface (if there is one).'),
    E(r'L_{\rm acc}=\frac{GM\dot M}{R}=\eta\dot Mc^2,\qquad \eta=\frac{GM}{Rc^2}', 'accretion luminosity and efficiency'),
    T(r'Efficiency: neutron star ($1.4M_\odot$, 10 km) $\eta\approx0.2$, far above hydrogen burning ($0.007$); white dwarf ($R\sim10^4$ km) $\eta\sim10^{-4}$. A black hole has no surface; a thin disk reaches $\eta\approx0.06$-$0.4$ depending on spin.'),
    E(r'T(r)=\left[\frac{3GM\dot M}{8\pi\sigma r^3}\left(1-\sqrt{\frac{R_*}{r}}\right)\right]^{1/4}\ \propto\ r^{-3/4}\quad(r\gg R_*)', 'steady thin disk: local blackbody'),
    T(r'Each ring radiates nearly as a blackbody at $T(r)$; the sum is a stretched blackbody. For neutron stars and stellar black holes the inner disk reaches $\sim10^7$ K: X-ray binaries. The accretion rate is capped where $L_{\rm acc}=L_{\rm Edd}$.'),
    B('intuition', r'The deeper the potential well ($M/R$), the more energy per kilogram: compact objects turn infalling gas into the brightest X-ray sources in the Galaxy.'),
    B('pitfall', r'$T\propto r^{-3/4}$ comes from the dissipation rate $\propto GM\dot M/r^3$ per unit area; it is not the virial temperature of the gas.'),
    B('exam', r'Typical: accretion luminosity and efficiency of a neutron star, Eddington-limited $\dot M$, black-hole growth time (HS25 winter Q6).')],
    [K(r'$\eta=GM/(Rc^2)$ for $M=1.4M_\odot$, $R=10$ km is about', [r'$0.2$', r'$0.007$', r'$10^{-4}$', r'$1$'], 0, r'$6.67\times10^{-11}\cdot2.8\times10^{30}/(10^4\cdot9\times10^{16})\approx0.21$.'),
     K(r'Far from the inner edge, a steady thin disk has $T\propto$', [r'$r^{-3/4}$', r'$r^{-1/2}$', r'$r^{-1}$', r'$r^{-2}$'], 0, r'$\sigma T^4\propto GM\dot M/r^3$.')]))

add('galactic-dynamics', L('astro-gap-oort', 'Epicycles, the Oort limit and asymmetric drift', '§6.3.1, §7.6.1-7.6.2', 12, [
    T(r'A star on a nearly circular orbit oscillates radially around its guiding centre with the <b>epicycle frequency</b> $\kappa$. With $\Omega=v_c/R$ and the Oort constants $A=\frac12\left(\frac{v_c}R-\frac{dv_c}{dR}\right)$, $B=-\frac12\left(\frac{v_c}R+\frac{dv_c}{dR}\right)$:'),
    E(r'\kappa^2=R\frac{d\Omega^2}{dR}+4\Omega^2=-4B(A-B),\qquad \text{flat rotation curve: }\kappa=\sqrt2\,\Omega', 'epicycle frequency'),
    T(r'<b>Oort limit.</b> Vertical Jeans equation plus Poisson for a thin disk: tracer stars with density $n(z)$ and dispersion $\langle v_z^2\rangle$ measure the vertical force, and hence the total local mass density $\rho_0$.'),
    E(r'\frac{\partial}{\partial z}\left(n\langle v_z^2\rangle\right)=-n\frac{\partial\Phi}{\partial z},\qquad \frac{\partial^2\Phi}{\partial z^2}\approx4\pi G\rho', 'vertical Jeans equation, plane-parallel Poisson'),
    T(r'Comparing $\rho_0$ (about $0.1M_\odot\,{\rm pc^{-3}}$) with the stars and gas actually counted shows there is little room for dark matter <i>in the disk</i>; the dark halo is round and its local density small.'),
    T(r'<b>Asymmetric drift.</b> Populations with larger velocity dispersion are partly supported by &#8220;pressure&#8221; and rotate more slowly than the local circular speed. The radial Jeans equation gives $v_c^2-\bar v_\varphi^2\approx2v_cv_a\propto\sigma_R^2$: the lag $v_a$ grows with $\sigma_R^2$ (Strömberg).'),
    B('intuition', r'Old, hot populations (halo stars) lag far behind the Sun; young, cold ones (gas, OB stars) co-rotate. The Sun&#8217;s motion relative to the local standard of rest is found by extrapolating to $\sigma\to0$.'),
    B('pitfall', r'The Oort limit measures the <b>total</b> density (stars + gas + dark matter) near the Sun, not the visible part.'),
    B('exam', r'Recent exams test the Jeans equations through the Plummer sphere (HS25 winter Q4); know which equation gives what.')],
    [K(r'For a flat rotation curve, $\kappa/\Omega=$', [r'$\sqrt2$', r'$1$', r'$2$', r'$1/\sqrt2$'], 0, r'$d\Omega^2/dR=-2v_c^2/R^3$, so $\kappa^2=-2\Omega^2+4\Omega^2$.'),
     K(r'A stellar population with larger radial dispersion $\sigma_R$ rotates', [r'more slowly than $v_c$ (larger asymmetric drift)', r'faster than $v_c$', r'exactly at $v_c$', r'retrograde'], 0, r'$v_a\propto\sigma_R^2$.')]))

add('active-galaxies', L('astro-gap-beam', 'Relativistic beaming and superluminal motion', '§8.11, §9.4.2', 10, [
    T(r'A source moving with speed $\beta c$ at angle $\theta$ to our line of sight emits most of its radiation into a cone of half-angle $\sim1/\gamma$ around its velocity.'),
    E(r'\mathcal D=\frac1{\gamma(1-\beta\cos\theta)},\qquad \nu_{\rm obs}=\mathcal D\,\nu_{\rm em}', 'Doppler factor'),
    T(r'Observed flux is boosted by a high power of $\mathcal D$ (about $\mathcal D^{3+\alpha}$ for a moving blob with spectrum $F_\nu\propto\nu^{-\alpha}$): a jet pointing at us (blazar) outshines its counter-jet by orders of magnitude.'),
    E(r'\beta_{\rm app}=\frac{\beta\sin\theta}{1-\beta\cos\theta},\qquad \max_\theta\beta_{\rm app}=\gamma\beta\ \ \text{at}\ \cos\theta=\beta', 'apparent transverse speed'),
    T(r'With $\gamma\beta>1$, knots in quasar jets appear to move faster than light across the sky. Nothing moves faster than $c$: the source nearly catches up with its own light, so the arrival times are compressed.'),
    B('intuition', r'Beaming explains why one-sided jets are common and why the same AGN looks like a blazar, a quasar or a radio galaxy depending on viewing angle (unification).'),
    B('pitfall', r'$\beta_{\rm app}$ is maximal at $\cos\theta=\beta$, not at $\theta=0$: head-on motion has no transverse component.'),
    B('exam', r'MC style: why superluminal motion does not violate relativity; synchrotron as the emission mechanism of jets (HS24 summer, HS25 winter).')],
    [K(r'For $\gamma=10$, the largest apparent speed is about', [r'$10c$', r'$c$', r'$100c$', r'$\sqrt{10}\,c$'], 0, r'$\gamma\beta\approx10$.'),
     K(r'Superluminal motion requires', [r'$v$ close to $c$ and a small angle to the line of sight', r'$v>c$', r'a very distant source', r'gravitational lensing'], 0, r'Light-travel-time effect at $\cos\theta\approx\beta$.')]))

add('early-universe', L('astro-gap-dm', 'What dark matter can be, and the intergalactic medium', '§11.5, §11.8', 10, [
    T(r'Dark matter is classified by its speed when structures start to grow. <b>Hot</b> dark matter (light neutrinos) is relativistic at decoupling and free-streams out of small perturbations: only very large structures form first (top-down). <b>Cold</b> dark matter (e.g. WIMPs) is slow: small halos form first and merge (bottom-up, hierarchical), which matches observations.'),
    E(r'\Omega_\nu h^2=\frac{\sum m_\nu}{\approx94\ {\rm eV}}', 'relic neutrino density'),
    T(r'Neutrinos with $\sum m_\nu\lesssim1$ eV give $\Omega_\nu\ll\Omega_m$: real, but not the dominant dark matter. Baryons are limited by BBN to $\Omega_bh^2\approx0.022$, far below $\Omega_mh^2\approx0.14$: most dark matter is non-baryonic.'),
    T(r'<b>Intergalactic medium.</b> Hydrogen clouds between us and a quasar absorb Ly$\alpha$ ($121.6$ nm in the rest frame) at their own redshift, observed at $121.6(1+z_{\rm abs})$ nm: a <b>Lyman-$\alpha$ forest</b> blueward of the quasar&#8217;s emission line.'),
    T(r'<b>Gunn-Peterson test.</b> Even a tiny fraction of neutral H spread smoothly would absorb everything blueward of Ly$\alpha$. No such trough is seen below $z\approx6$, so the IGM is highly ionised; the trough appears at $z\gtrsim6$, the end of reionisation.'),
    B('intuition', r'A quasar is a flashlight shining through the whole history of the IGM; each absorption line is a cloud at a different distance.'),
    B('pitfall', r'The forest lies at wavelengths <i>shorter</i> than the quasar&#8217;s own Ly$\alpha$ line: absorbers are closer, so less redshifted.'),
    B('exam', r'MC style: hot vs cold dark matter, evidence for non-baryonic dark matter, what the Ly$\alpha$ forest is.')],
    [K(r'Cold dark matter gives structure formation that is', [r'bottom-up (small halos first)', r'top-down (superclusters first)', r'impossible', r'independent of dark matter'], 0, r'No free streaming on small scales.'),
     K(r'A cloud at $z=3$ absorbs Ly$\alpha$ at an observed wavelength of', [r'$486$ nm', r'$122$ nm', r'$365$ nm', r'$608$ nm'], 0, r'$121.6\times4=486$ nm.')]))

add('stellar-forge', L('astro-gap-binary', 'Binary evolution and the Algol paradox', '§4.5.1', 8, [
    T(r'In a close binary each star sits in its <b>Roche lobe</b>, the region where its own gravity dominates in the rotating frame. The lobes touch at the inner Lagrange point $L_1$.'),
    T(r'When a star expands after the main sequence and fills its Roche lobe, gas flows through $L_1$ onto the companion, directly or via an accretion disk. Mass transfer can reverse which star is the heavier one.'),
    T(r'<b>Algol paradox.</b> In Algol the less massive star is the more evolved (a subgiant), against single-star evolution. Resolution: it was originally the more massive, evolved first, and has transferred most of its mass to the companion.'),
    E(r't_{\rm MS}\propto\frac{M}{L}\propto M^{-2.5}\ \ (L\propto M^{3.5})', 'why the heavier star evolves first'),
    T(r'End states: a white dwarf accreting from a companion can give novae (surface hydrogen ignition) or, near the Chandrasekhar mass, a type Ia supernova; neutron stars and black holes accreting from companions are X-ray binaries.'),
    B('intuition', r'A binary is a stellar-evolution experiment with mass transfer as an extra knob: ages from single-star tracks fail for interacting pairs.'),
    B('pitfall', r'Type Ia supernovae come from white dwarfs in binaries (no hydrogen lines), not from the core collapse of massive stars.'),
    B('exam', r'MC style: Algol paradox, which binaries give SN Ia or X-ray sources.')],
    [K(r'The Algol paradox is resolved by', [r'mass transfer from the initially more massive star', r'different ages of the two stars', r'a third star', r'magnetic braking'], 0, r'The evolved star lost most of its mass.'),
     K(r'Mass flows from one star to the other through', [r'the inner Lagrange point $L_1$', r'the centre of mass', r'$L_4$', r'the poles'], 0, r'The saddle point between the Roche lobes.')]))

add('exam-hall', {'type': 'quiz', 'id': 'astro-gap-Q1', 'xp': 20, 'title': 'Mixed MC drill: the less examined corners',
    'source': {'file': BOOK, 'where': 'Choudhuri §1.3, 2.4, 2.6, 4.5.1, 5.6, 6.3, 7.6, 8.11, 9.4.2, 11.5, 11.8 (MC style of the Refregier exams)'},
    'questions': [
        {'q': r'Why is the solar limb darker than the disk centre?', 'options': [r'At the limb we see shallower, cooler layers', r'The limb is farther away', r'Dust in the solar corona', r'Doppler shift from rotation'], 'correct': 0, 'explain': r'Eddington-Barbier: $I(\mu)\approx S(\tau=\mu)$.'},
        {'q': r'Which opacity is used in the Eddington luminosity?', 'options': [r'Electron (Thomson) scattering', r'Kramers bound-free', r'H$^-$', r'Molecular'], 'correct': 0, 'explain': r'In the hot regions where $L_{\rm Edd}$ matters, $\kappa\approx\kappa_{\rm es}$.'},
        {'q': r'Accreting onto which object releases the most energy per kg?', 'options': [r'A neutron star', r'A white dwarf', r'The Sun', r'A brown dwarf'], 'correct': 0, 'explain': r'$\eta=GM/(Rc^2)$ is largest for the most compact object.'},
        {'q': r'The Oort limit measures', 'options': [r'the total mass density in the solar neighbourhood', r'the mass of the Galactic centre', r'the age of the disk', r'the Sun&#8217;s orbital period'], 'correct': 0, 'explain': r'From vertical kinematics via the Jeans equation and Poisson.'},
        {'q': r'Superluminal motion in quasar jets is evidence for', 'options': [r'bulk motion close to $c$ at a small angle to the line of sight', r'tachyons', r'cosmic expansion', r'gravitational redshift'], 'correct': 0, 'explain': r'$\beta_{\rm app}=\beta\sin\theta/(1-\beta\cos\theta)$.'},
        {'q': r'The absence of a Gunn-Peterson trough at $z<6$ shows that', 'options': [r'the IGM is highly ionised', r'there is no gas between galaxies', r'quasars are nearby', r'dark matter is cold'], 'correct': 0, 'explain': r'A small neutral fraction would absorb everything blueward of Ly$\alpha$.'},
        {'q': r'Light neutrinos are an example of', 'options': [r'hot dark matter', r'cold dark matter', r'baryonic dark matter', r'dark energy'], 'correct': 0, 'explain': r'Relativistic at decoupling; free streaming erases small structure.'},
        {'q': r'A star with $\delta=+60^\circ$ seen from latitude $47^\circ$N is', 'options': [r'circumpolar', r'never visible', r'visible only in summer', r'always on the horizon'], 'correct': 0, 'explain': r'$60^\circ>90^\circ-47^\circ=43^\circ$.'},
    ]})

with open(OUT, 'w') as f: json.dump({'about': 'Astro gap lessons from the coverage map; built by notes/astrophysics/build/gaps/build.py', 'items': items}, f, ensure_ascii=False, indent=1)
print(len(items), 'encounters ->', os.path.relpath(OUT))
