"""Guided reading for Astro I: Choudhuri, "Astrophysics for Physicists" (Refregier follows it; no lecture script).
One card per section group, placed in the campaign week of the room that covers it (campaign.json astro rooms per week).
Pages are the book's page numbers (table of contents in notes/extracted). Chapters 12-13 (GR) and MHD 8.4-8.10 are left out
(not examined in the Refregier exams, notes/syllabus.md). Re-check against Refregier's slides once they exist.
Writes game/content/astrophysics/reading.json. Run: python3 build.py"""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '../../../build'))
from readinglib import card as _card, write

BOOK = 'materials/astrophysics/scripts/Choudhuri_Textbook.pdf'
def card(*a, **k): return _card(*a, source_file=BOOK, book='Choudhuri', **k)

C = []
# ---------------------------------------------------------------- week 1: ch. 1
C.append(card('astro-read-01a', 1, 'photometry-radiation', '1.1–1.4', '1–11', 'scales, coordinates and magnitudes',
  ['Which units make astronomical numbers manageable, and how big is each?', 'Why is the magnitude scale logarithmic and &#8220;backwards&#8221;?'],
  'Look for: AU, parsec, light year, solar mass and luminosity; equatorial coordinates; apparent and absolute magnitude, the distance modulus.',
  [(r'Define the parsec from parallax.', r'The distance at which 1 AU subtends 1 arcsec: $d[\mathrm{pc}]=1/p[^{\prime\prime}]$, $1\,\mathrm{pc}=206265\,\mathrm{AU}=3.09\times10^{16}$ m.'),
   (r'Two stars differ by 5 magnitudes. Flux ratio? And the distance modulus?', r'$m_1-m_2=-2.5\log_{10}(F_1/F_2)$: 5 mag = factor 100. $m-M=5\log_{10}(d/10\,\mathrm{pc})$ (without extinction).')],
  [(r'A star at 100 pc has $m-M=$', [r'$5$', r'$10$', r'$2$', r'$0$'], r'$5\log_{10}(10)$.'),
   (r'A brighter star has a', [r'smaller magnitude', r'larger magnitude', r'magnitude independent of brightness', r'negative distance'], r'Inverted logarithmic scale.')], minutes=25))
C.append(card('astro-read-01b', 1, 'photometry-radiation', '1.5–1.8', '11–22', 'physics in astronomy; observing bands',
  ['What limits the sharpness of a telescope image?', 'Which wavelengths reach the ground, and why do we need space telescopes?'],
  'Look for: the diffraction limit $\\theta\\approx1.22\\lambda/D$, seeing, atmospheric windows (optical and radio), X-ray and gamma-ray astronomy from space, new messengers.',
  [(r'Resolution of a 10 m telescope at 500 nm vs the human eye (pupil 5 mm)?', r'$1.22\lambda/D=6\times10^{-8}$ rad $=0.013^{\prime\prime}$ for 10 m (in practice seeing $\sim1^{\prime\prime}$ unless adaptive optics); eye $\approx1.2\times10^{-4}$ rad $\approx25^{\prime\prime}$ (HS25 winter Q1).'),
   (r'Why do radio interferometers reach better resolution than optical telescopes?', r'Resolution $\sim\lambda/B$ with the baseline $B$: intercontinental baselines (thousands of km) beat the long wavelength.')],
  [(r'Angular resolution scales as', [r'$\lambda/D$', r'$D/\lambda$', r'$\lambda D$', r'$1/\lambda$'], r'Diffraction.'),
   (r'X-ray astronomy needs', [r'satellites (the atmosphere absorbs X-rays)', r'large ground dishes', r'only dark nights', r'radio receivers'], r'Atmospheric windows.')], minutes=20))
# ---------------------------------------------------------------- weeks 2-3: ch. 2
C.append(card('astro-read-02a', 2, 'radiative-transfer', '2.1–2.2', '23–31', 'radiation field and the transfer equation',
  ['What is the difference between specific intensity and flux?', 'Why is $I_\\nu$ constant along a ray in empty space?'],
  'Look for: $I_\\nu$ and its units, flux and energy density as moments of $I_\\nu$, radiation pressure, $dI_\\nu/ds=j_\\nu-\\alpha_\\nu I_\\nu$, optical depth $\\tau_\\nu$, source function $S_\\nu=j_\\nu/\\alpha_\\nu$, the formal solution, Kirchhoff&#8217;s law.',
  [(r'Write the formal solution for a slab with constant $S_\nu$.', r'$I_\nu(\tau)=I_\nu(0)e^{-\tau}+S_\nu(1-e^{-\tau})$. Optically thick: $I\to S$; thin: $I\approx I(0)+S\tau$.'),
   (r'Why is $I_\nu$ independent of distance while the flux falls as $1/r^2$?', r'$I_\nu$ is energy per area, time, frequency and solid angle; the source&#8217;s solid angle shrinks as $1/r^2$ exactly as the received flux. Surface brightness is conserved.')],
  [(r'Units of $I_\nu$', [r'W m$^{-2}$ Hz$^{-1}$ sr$^{-1}$', r'W m$^{-2}$', r'W', r'W m$^{-2}$ Hz$^{-1}$'], r'MC favourite in every exam.'),
   (r'Kirchhoff&#8217;s law in thermal equilibrium', [r'$j_\nu/\alpha_\nu=B_\nu(T)$', r'$j_\nu=\alpha_\nu$', r'$S_\nu=0$', r'$I_\nu=0$'], r'Choudhuri 2.2.4.')], minutes=30))
C.append(card('astro-read-02b', 2, 'radiative-transfer', '2.3', '31–35', 'thermodynamic equilibrium and LTE',
  ['Which laws follow from the Planck function?', 'Why can a star be treated as in local thermodynamic equilibrium although it radiates?'],
  'Look for: $B_\\nu(T)$, Wien&#8217;s displacement law, Stefan-Boltzmann, the Rayleigh-Jeans limit, the conditions for LTE (mean free path vs temperature scale height).',
  [(r'Derive the Rayleigh-Jeans limit and say when it applies.', r'$h\nu\ll k_BT$: $e^{h\nu/k_BT}-1\approx h\nu/k_BT$, $B_\nu\approx\frac{2\nu^2k_BT}{c^2}$. Radio astronomy and the CMB at low frequency (HS24 summer, HS25 winter).'),
   (r'Wien: peak of the Sun ($T\approx5800$ K) in wavelength?', r'$\lambda_{\max}T=2.9\times10^{-3}$ m K: $\lambda\approx500$ nm.')],
  [(r'Total flux from a blackbody surface', [r'$\sigma T^4$', r'$\sigma T^2$', r'$k_BT$', r'$B_\nu$'], r'Stefan-Boltzmann.'),
   (r'LTE means', [r'local $T$ defines $S_\nu=B_\nu(T)$ although the radiation field is not isotropic', r'no radiation leaves the star', r'the star is isothermal', r'no absorption'], r'Choudhuri 2.3.2.')], minutes=20))
C.append(card('astro-read-03a', 3, 'radiative-transfer', '2.4', '35–46', 'stellar atmospheres and spectral lines',
  ['Why does the photosphere sit at $\\tau\\approx2/3$?', 'Why do absorption lines form?'],
  'Look for: plane-parallel atmosphere, the grey atmosphere and Eddington approximation $T^4=\\frac34T_{\\rm eff}^4(\\tau+\\frac23)$, limb darkening, line formation from $S_\\nu$ decreasing outward.',
  [(r'Why do absorption lines appear dark?', r'At line frequencies the opacity is high, so we see shallower, cooler layers: lower $S_\nu=B_\nu(T)$ there than in the continuum.'),
   (r'Limb darkening in the grey Eddington model?', r'$I(\mu)/I(1)=(3\mu+2)/5$, so $0.4$ at the limb.')],
  [(r'In the grey atmosphere $T=T_{\rm eff}$ at', [r'$\tau=\frac23$', r'$\tau=0$', r'$\tau=1$', r'$\tau=\infty$'], r'Eddington approximation.'),
   (r'Absorption lines form because', [r'temperature decreases outward', r'temperature increases outward', r'of interstellar dust', r'of the Doppler effect alone'], r'Choudhuri 2.4.3.')], minutes=30))
C.append(card('astro-read-03b', 3, 'radiative-transfer', '2.5–2.8', '46–60', 'radiative transport inside stars; opacity; photon diffusion',
  ['How long does a photon need to get out of the Sun?', 'Which processes make stellar matter opaque?'],
  'Look for: the diffusion approximation and Rosseland mean, $F\\propto-\\frac{1}{\\kappa\\rho}\\frac{d(T^4)}{dr}$, Thomson scattering, Kramers law $\\kappa\\propto\\rho T^{-7/2}$, H$^-$, the Saha equation in line analysis, the random walk out of the Sun.',
  [(r'Random-walk escape time from the Sun with mean free path $\ell\sim1$ cm?', r'$N=(R/\ell)^2$ steps, $t=N\ell/c=R^2/(\ell c)\approx(7\times10^{10}\,{\rm cm})^2/(1\,{\rm cm}\cdot3\times10^{10}\,{\rm cm/s})\approx1.6\times10^{11}$ s $\approx5000$ yr (order $10^4$ yr).'),
   (r'Electron-scattering opacity of ionised matter?', r'$\kappa_{\rm es}=\sigma_T(1+X)/2m_p\approx0.2(1+X)$ cm$^2$/g.')],
  [(r'Kramers opacity scales as', [r'$\rho T^{-7/2}$', r'$\rho^2T$', r'constant', r'$T^4$'], r'Choudhuri 2.6.'),
   (r'Photons leave the Sun&#8217;s core by', [r'a random walk taking $\sim10^4$ yr', r'flying straight in 2 s', r'convection only', r'neutrinos'], r'Choudhuri 2.8.')], minutes=40))
# ---------------------------------------------------------------- week 4: ch. 3
C.append(card('astro-read-04a', 4, 'stellar-forge', '3.1–3.2', '61–69', 'equations of stellar structure',
  ['Which four equations describe a star?', 'Why does the virial theorem say a contracting star heats up?'],
  'Look for: hydrostatic equilibrium, mass continuity, energy generation $dL/dr$, radiative and convective transport, the virial theorem $2K+E_G=0$, the Schwarzschild criterion.',
  [(r'Estimate the central pressure of the Sun from hydrostatic equilibrium.', r'$P_c\sim\frac{GM^2}{R^4}\approx\frac{6.7\times10^{-11}(2\times10^{30})^2}{(7\times10^8)^4}\approx10^{15}$ Pa (detailed models: $2\times10^{16}$ Pa).'),
   (r'Virial: total energy and thermal energy of a star.', r'$2K=-E_G$ so $E=K+E_G=-K<0$. Losing energy (radiating) makes $E$ more negative, $K$ grows: the star contracts and heats (negative heat capacity).')],
  [(r'Hydrostatic equilibrium', [r'$\frac{dP}{dr}=-\frac{Gm(r)\rho}{r^2}$', r'$\frac{dP}{dr}=0$', r'$\frac{dP}{dr}=\rho g^2$', r'$P=\rho c^2$'], r'Every exam (open questions).'),
   (r'Convection sets in when', [r'the radiative temperature gradient exceeds the adiabatic one', r'the opacity is low', r'the star is small', r'never in stars'], r'Schwarzschild criterion.')], minutes=30))
C.append(card('astro-read-04b', 4, 'stellar-forge', '3.3–3.6', '70–90', 'models, scaling relations, HR diagram, Eddington limit',
  ['Where does $L\\propto M^3$ come from without solving anything?', 'What sets the upper end of the main sequence?'],
  'Look for: homology and order-of-magnitude relations, $L\\propto M^3$ (radiative, constant opacity), main-sequence lifetime $\\propto M/L$, the HR diagram and spectral classes, cluster HR diagrams, $L_{\\rm Edd}=4\\pi GMc/\\kappa$.',
  [(r'Derive $L\propto M^3$ by scaling.', r'$T\propto M/R$ (virial), $L\propto\frac{R^2T^4}{\kappa\rho R}\cdot R\propto\frac{R^4T^4}{\kappa M}\propto\frac{M^3}\kappa$ (radiative diffusion with $\rho\propto M/R^3$).'),
   (r'Derive the Eddington luminosity.', r'Radiation force on electrons $\frac{\kappa L}{4\pi r^2c}$ per unit mass equals gravity $\frac{GM}{r^2}$: $L_{\rm Edd}=\frac{4\pi GMc}\kappa\approx1.3\times10^{31}(M/M_\odot)$ W for $\kappa_{\rm es}$ of hydrogen.')],
  [(r'Main-sequence lifetime scales roughly as', [r'$M^{-2}$ (with $L\propto M^3$)', r'$M^2$', r'$M$', r'independent of $M$'], r'$t\propto M/L$.'),
   (r'The age of a star cluster comes from', [r'the main-sequence turn-off', r'its total mass', r'its distance', r'its colour only'], r'Choudhuri 3.6.2.')], minutes=40))
# ---------------------------------------------------------------- week 5: ch. 4
C.append(card('astro-read-05a', 5, 'nuclear-furnace', '4.1–4.4', '91–107', 'nuclear reactions and the solar neutrinos',
  ['How can protons fuse at $T\\sim10^7$ K when the Coulomb barrier needs $10^{10}$ K?', 'What did the solar neutrino problem teach us?'],
  'Look for: tunnelling and the Gamow factor, the Gamow peak, reaction rates and their steep $T$ dependence, pp chain and CNO cycle, the binding energy per nucleon, helioseismology, solar neutrino experiments and oscillations.',
  [(r'Why is the reaction rate a narrow peak in energy?', r'Maxwell-Boltzmann tail $e^{-E/k_BT}$ times tunnelling probability $e^{-\sqrt{E_G/E}}$: the product peaks at the Gamow energy, well above $k_BT$.'),
   (r'Why does the CNO cycle dominate in massive stars?', r'Its rate rises much faster with temperature ($\sim T^{16}$-$T^{20}$ vs $T^4$ for pp) because of the higher Coulomb barriers of C, N, O; hotter cores of massive stars favour it.')],
  [(r'Fusion in the Sun is possible thanks to', [r'quantum tunnelling', r'the high pressure alone', r'gravity of the nuclei', r'magnetic fields'], r'Choudhuri 4.1.'),
   (r'The solar neutrino deficit was explained by', [r'neutrino oscillations', r'a cooler Sun', r'wrong cross sections', r'dark matter'], r'Choudhuri 4.4.2; MC.')], minutes=40))
C.append(card('astro-read-05b', 5, 'nuclear-furnace', '4.5–4.9', '108–126', 'stellar evolution, binaries, supernovae, exoplanets',
  ['What happens when hydrogen runs out in the core?', 'Which stars end as supernovae, and what is special about type Ia?'],
  'Look for: post-main-sequence evolution (red giants, helium burning), binary evolution and mass transfer, mass loss, core-collapse and type Ia supernovae, rotation and magnetic fields, exoplanet detection.',
  [(r'Why do stars become red giants?', r'The inert He core contracts and heats; H burns in a shell at higher rate, the envelope expands and cools: large radius, low $T_{\rm eff}$.'),
   (r'Why are type Ia supernovae standard candles?', r'A carbon-oxygen white dwarf near the Chandrasekhar mass ignites: similar mass, similar peak luminosity (calibrated by the decline rate).')],
  [(r'A type Ia supernova comes from', [r'a white dwarf in a binary', r'core collapse of a massive star', r'a neutron star merger only', r'a red giant'], r'No hydrogen lines.'),
   (r'Radial-velocity searches detect planets through', [r'the star&#8217;s Doppler wobble', r'the planet&#8217;s own light', r'gravitational lensing only', r'X-rays'], r'Choudhuri 4.9.')], minutes=40))
# ---------------------------------------------------------------- week 6: ch. 5
C.append(card('astro-read-06a', 6, 'degenerate-matter', '5.1–5.3', '127–136', 'degeneracy pressure, white dwarfs, Chandrasekhar',
  ['Why does a white dwarf not collapse although it does not burn anything?', 'Why is there a maximum mass?'],
  'Look for: Fermi momentum $p_F=\\hbar(3\\pi^2n)^{1/3}$, $P\\propto n^{5/3}$ (non-relativistic) and $P\\propto n^{4/3}$ (relativistic), the mass-radius relation $R\\propto M^{-1/3}$, the Chandrasekhar mass $\\approx1.4M_\\odot$.',
  [(r'Show that a relativistic degenerate star has no stable radius.', r'Degeneracy energy per electron $\sim p_Fc\propto N^{1/3}/R$, gravitational energy per nucleon $\sim-GMm_p/R$: both $\propto1/R$. Equilibrium only at one mass (Chandrasekhar); above it gravity wins at every $R$.'),
   (r'Why does a heavier white dwarf have a smaller radius?', r'Non-relativistic: $P\propto\rho^{5/3}$ balanced against $GM^2/R^4$ gives $R\propto M^{-1/3}$.')],
  [(r'The Chandrasekhar mass is about', [r'$1.4M_\odot$', r'$0.08M_\odot$', r'$3M_\odot$', r'$10M_\odot$'], r'Choudhuri 5.3.'),
   (r'Relativistic degeneracy pressure scales as', [r'$n^{4/3}$', r'$n^{5/3}$', r'$n^2$', r'$n$'], r'$p_Fc$ per particle.')], minutes=30))
C.append(card('astro-read-06b', 6, 'degenerate-matter', '5.4–5.6', '137–152', 'neutron stars, pulsars, accretion',
  ['How do neutron stars form, and how big are they?', 'Why are accreting compact objects so bright?'],
  'Look for: neutron drip and inverse beta decay, neutron-star radius $\\sim10$ km, pulsars as rotating magnetised neutron stars, spin-down, the binary pulsar, X-ray binaries and accretion disks.',
  [(r'Estimate the spin-down luminosity of a pulsar.', r'$L=-\frac d{dt}\frac12I\Omega^2=I\Omega|\dot\Omega|$; for the Crab $I\sim10^{38}$ kg m$^2$, $\Omega=190$ s$^{-1}$, $\dot\Omega\sim-2.4\times10^{-9}$ s$^{-2}$: $L\sim5\times10^{31}$ W, enough to power the nebula.'),
   (r'Accretion efficiency onto a neutron star?', r'$\eta=GM/Rc^2\approx0.2$, far above fusion (0.007).')],
  [(r'A neutron star has a radius of about', [r'10 km', r'1000 km', r'1 km', r'$R_\odot$'], r'Choudhuri 5.4.'),
   (r'Pulsars slow down because', [r'they radiate rotational energy', r'they accrete', r'of nuclear burning', r'they do not'], r'Choudhuri 5.5.')], minutes=35))
# ---------------------------------------------------------------- weeks 7-8: ch. 6
C.append(card('astro-read-07a', 7, 'interstellar-medium', '6.1–6.2', '153–165', 'shape of the Galaxy; rotation',
  ['How did Shapley find that the Sun is not at the centre?', 'What does a flat rotation curve imply?'],
  'Look for: star counts and $N(>F)\\propto F^{-3/2}$, extinction and reddening, galactic coordinates, differential rotation and the Oort constants, the rotation curve.',
  [(r'Derive $N(>F)\propto F^{-3/2}$.', r'Uniform stars of luminosity $L$: those brighter than $F$ lie within $r=\sqrt{L/4\pi F}$, number $\propto r^3\propto F^{-3/2}$ (HS24 winter Q3). Deviations reveal extinction or a non-uniform distribution.'),
   (r'Flat rotation curve $v(r)=v_0$: enclosed mass?', r'$M(r)=v_0^2r/G$ grows linearly with $r$, far beyond the light: dark matter halo with $\rho\propto r^{-2}$.')],
  [(r'Extinction makes stars appear', [r'fainter and redder', r'brighter', r'bluer', r'closer'], r'Dust scatters blue light more.'),
   (r'For a flat rotation curve $M(r)\propto$', [r'$r$', r'$r^3$', r'constant', r'$r^{-1}$'], r'$v^2=GM/r$.')], minutes=35))
C.append(card('astro-read-07b', 7, 'galactic-dynamics', '6.3–6.4', '166–174', 'nearly circular orbits; stellar populations',
  ['How does a star move if it is slightly off a circular orbit?', 'What distinguishes population I and II?'],
  'Look for: epicycle frequency $\\kappa$, solar motion and the local standard of rest, the velocity ellipsoid, populations (age, metallicity, kinematics).',
  [(r'Epicycle frequency for a flat rotation curve?', r'$\kappa^2=R\frac{d\Omega^2}{dR}+4\Omega^2$; with $\Omega=v_0/R$: $\kappa=\sqrt2\Omega$.'),
   (r'Population II stars: where and why?', r'Halo and globular clusters: old, metal-poor (formed before the ISM was enriched), with large random velocities and slow rotation.')],
  [(r'Population I stars are', [r'young, metal-rich, in the disk', r'old, metal-poor, in the halo', r'only in the bulge', r'white dwarfs'], r'Choudhuri 6.4; MC.'),
   (r'For a flat rotation curve, $\kappa/\Omega=$', [r'$\sqrt2$', r'$1$', r'$2$', r'$0$'], r'Choudhuri 6.3.1.')], minutes=30))
C.append(card('astro-read-08a', 8, 'interstellar-medium', '6.5–6.6', '174–187', 'the interstellar gas and its phases',
  ['How do we see cold hydrogen at all?', 'Why is the ISM in several phases at roughly equal pressure?'],
  'Look for: the 21 cm line, HI clouds, warm intercloud medium, molecular clouds and CO, HII regions and the Strömgren sphere, hot coronal gas.',
  [(r'Strömgren radius of an O star emitting $Q$ ionising photons per second in gas of density $n$?', r'Ionisations balance recombinations: $Q=\frac43\pi R_S^3n^2\alpha_B$, so $R_S=\left(\frac{3Q}{4\pi n^2\alpha_B}\right)^{1/3}$ (HS25 practice Q4).'),
   (r'Why is the 21 cm line so useful despite its tiny transition probability?', r'The Galaxy holds so much HI that the line is bright; radio waves pass dust, and Doppler shifts give the rotation curve.')],
  [(r'The 21 cm line comes from', [r'the hyperfine spin flip of hydrogen', r'the Lyman series', r'molecular hydrogen', r'free electrons'], r'Choudhuri 6.5.'),
   (r'Molecular clouds are traced mainly by', [r'CO emission', r'21 cm', r'X-rays', r'H$\alpha$'], r'H$_2$ hardly radiates.')], minutes=35))
C.append(card('astro-read-08b', 8, 'interstellar-medium', '6.7–6.8', '187–196', 'magnetic field, cosmic rays, thermal balance of the ISM',
  ['How is the galactic magnetic field measured?', 'What heats and cools the ISM?'],
  'Look for: Faraday rotation and Zeeman splitting, cosmic rays and their spectrum, heating by UV and cosmic rays, cooling functions, pressure equilibrium of the phases.',
  [(r'How does Faraday rotation measure $B$?', r'The polarisation angle rotates as $\lambda^2\cdot$RM with $\mathrm{RM}\propto\int n_eB_\parallel ds$; combined with the dispersion measure $\int n_eds$ of pulsars gives $\langle B_\parallel\rangle\sim$ few $\mu$G.')],
  [(r'The galactic magnetic field is of order', [r'a few $\mu$G', r'1 G', r'1 T', r'zero'], r'Choudhuri 6.7.'),
   (r'Faraday rotation is proportional to', [r'$\lambda^2$', r'$\lambda$', r'$1/\lambda$', r'independent of $\lambda$'], r'Choudhuri 6.7.')], minutes=25))
# ---------------------------------------------------------------- week 9: ch. 7 and 8.2-8.3
C.append(card('astro-read-09a', 9, 'galactic-dynamics', '7.1–7.4', '197–206', 'virial theorem, relaxation, self-gravity',
  ['When do star-star encounters matter in a galaxy?', 'Why can a self-gravitating system never reach thermal equilibrium?'],
  'Look for: the virial theorem for stellar systems, two-body relaxation time $t_{\\rm relax}\\approx\\frac N{8\\ln N}t_{\\rm cross}$, negative heat capacity, the isothermal sphere&#8217;s infinite mass.',
  [(r'Relaxation time of a galaxy with $N=10^{11}$, $t_{\rm cross}=10^8$ yr?', r'$\frac{10^{11}}{8\cdot25}\cdot10^8\approx5\times10^{16}$ yr $\gg$ the age of the Universe: galaxies are collisionless; globular clusters ($N\sim10^5$) are not.'),
   (r'Virial mass of a cluster with velocity dispersion $\sigma$ and radius $R$?', r'$M\sim\frac{\sigma^2R}G$ (factor of order unity from the profile): the classic evidence for dark matter in clusters (HS25 practice Q5).')],
  [(r'For galaxies, two-body relaxation is', [r'negligible (collisionless)', r'dominant', r'the source of spiral arms', r'faster than a crossing time'], r'Choudhuri 7.3.'),
   (r'A self-gravitating system that loses energy', [r'heats up (negative heat capacity)', r'cools down', r'keeps its temperature', r'expands and cools'], r'Choudhuri 7.4.')], minutes=30))
C.append(card('astro-read-09b', 9, 'galactic-dynamics', '7.5–7.7', '207–218', 'collisionless Boltzmann and Jeans equations',
  ['How do you describe $10^{11}$ stars without following each one?', 'What do the Jeans equations let you measure?'],
  'Look for: the distribution function and the collisionless Boltzmann equation, velocity moments giving the Jeans equations, the Oort limit, asymmetric drift, the two subsystems of solar-neighbourhood stars.',
  [(r'What is the stellar-dynamics analogue of hydrostatic equilibrium?', r'The spherical Jeans equation $\frac{d(\nu\sigma_r^2)}{dr}+\frac{2\beta\nu\sigma_r^2}r=-\nu\frac{GM(r)}{r^2}$: pressure $\to\nu\sigma^2$, with anisotropy $\beta$. For isotropic $\sigma$ it is the gas equation.'),
   (r'Plummer sphere: what is given, what do you compute?', r'Density/potential $\Phi=-GM/\sqrt{r^2+b^2}$; the Jeans equation gives $\sigma^2(r)$, and the virial theorem checks the total energy (HS25 winter Q4).')],
  [(r'The Oort limit measures', [r'the total local mass density from vertical kinematics', r'the age of the disk', r'the Sun&#8217;s orbit', r'the Hubble constant'], r'Choudhuri 7.6.1.'),
   (r'The Jeans equations are', [r'velocity moments of the collisionless Boltzmann equation', r'the Navier-Stokes equations', r'Maxwell&#8217;s equations', r'Friedmann equations'], r'Choudhuri 7.6.')], minutes=30))
C.append(card('astro-read-09c', 9, 'interstellar-medium', '8.2–8.3', '220–227', 'fluid equations and the Jeans instability',
  ['When does a gas cloud collapse under its own weight?', 'What competes with gravity?'],
  'Look for: continuity and Euler equations, linear perturbations, the dispersion relation $\\omega^2=c_s^2k^2-4\\pi G\\rho_0$, the Jeans length and mass.',
  [(r'Derive the Jeans length from the dispersion relation.', r'Instability for $\omega^2<0$: $k<k_J=\sqrt{4\pi G\rho_0}/c_s$, so $\lambda_J=c_s\sqrt{\pi/(G\rho_0)}$ and $M_J\sim\rho_0\lambda_J^3$.'),
   (r'Why do cold, dense molecular clouds form stars?', r'$M_J\propto T^{3/2}\rho^{-1/2}$: low $T$ and high $\rho$ make the Jeans mass small, so ordinary clouds exceed it.')],
  [(r'Perturbations are Jeans-unstable when their wavelength', [r'exceeds $\lambda_J$', r'is shorter than $\lambda_J$', r'equals the sound wavelength', r'is zero'], r'Choudhuri 8.3.'),
   (r'Raising the temperature makes the Jeans mass', [r'larger', r'smaller', r'unchanged', r'zero'], r'$c_s^3$ dependence.')], minutes=25))
# ---------------------------------------------------------------- week 10: ch. 9 (galaxies, AGN, clusters) and 8.11-8.12
C.append(card('astro-read-10a', 10, 'active-galaxies', '9.1–9.2', '261–270', 'normal galaxies',
  ['How are galaxies classified, and does the classification mean evolution?', 'What do Tully-Fisher and Faber-Jackson relate?'],
  'Look for: the Hubble sequence (ellipticals, spirals, irregulars), surface-brightness profiles (de Vaucouleurs, exponential disks), rotation curves, Tully-Fisher $L\\propto v^4$, Faber-Jackson $L\\propto\\sigma^4$, open questions.',
  [(r'Why can Tully-Fisher be used as a distance indicator?', r'Measure $v_{\max}$ (21 cm line width), infer $L\propto v^4$, compare with the flux: distance.'),
   (r'Spiral vs elliptical: list three physical differences.', r'Spirals: rotation-supported disk, gas and young stars, blue. Ellipticals: dispersion-supported, little cold gas, old red stars (HS24 winter Q5).')],
  [(r'Elliptical galaxies are supported mainly by', [r'random stellar motions', r'rotation', r'gas pressure', r'magnetic fields'], r'Choudhuri 9.2.'),
   (r'Tully-Fisher relates luminosity to', [r'rotation velocity', r'colour', r'distance', r'metallicity'], r'Choudhuri 9.2.2.')], minutes=30))
C.append(card('astro-read-10b', 10, 'active-galaxies', '9.4', '276–285', 'active galactic nuclei',
  ['What powers a quasar, and how do we know the engine is small?', 'Why do AGN types differ if the engine is the same?'],
  'Look for: the AGN zoo, variability and the size limit $R\\lesssim c\\Delta t$, superluminal motion, black-hole accretion as the engine (Eddington), unification by viewing angle.',
  [(r'A quasar varies in 1 day. Size limit and black-hole bound?', r'$R\lesssim c\Delta t\approx2.6\times10^{13}$ m $\approx170$ AU; with $R\gtrsim R_S=2GM/c^2$: $M\lesssim\frac{c^3\Delta t}{2G}\approx10^{10}M_\odot$ (HS24 winter Q6).'),
   (r'Minimum black-hole mass for $L=10^{40}$ W at the Eddington limit?', r'$M\ge L/(1.3\times10^{31}\,{\rm W}/M_\odot)\approx8\times10^8M_\odot$.')],
  [(r'Variability on time $\Delta t$ limits the source size to', [r'$\lesssim c\Delta t$', r'$\gtrsim c\Delta t$', r'$c/\Delta t$', r'nothing'], r'Light-travel argument.'),
   (r'AGN unification explains differences by', [r'viewing angle (and obscuring torus)', r'different engines', r'distance only', r'age only'], r'Choudhuri 9.4.4.')], minutes=35))
C.append(card('astro-read-10c', 10, 'active-galaxies', '9.5–9.7', '286–296', 'clusters, large-scale structure, gamma-ray bursts',
  ['Which three ways to weigh a cluster agree that most of its mass is dark?', 'How is the hot gas in clusters seen?'],
  'Look for: virial masses, X-ray gas and hydrostatic masses, gravitational lensing, the large-scale distribution of galaxies, gamma-ray bursts.',
  [(r'Cluster X-ray luminosity from bremsstrahlung: scaling?', r'$L_X\propto n_e^2T^{1/2}V$; with the virial temperature $k_BT\sim GMm_p/R$, $L_X$ grows steeply with mass (HS25 winter Q5).')],
  [(r'Hot intracluster gas emits mostly', [r'X-ray bremsstrahlung', r'21 cm', r'optical lines', r'radio synchrotron only'], r'$T\sim10^7$-$10^8$ K.'),
   (r'The mass of galaxy clusters is dominated by', [r'dark matter', r'stars', r'hot gas', r'black holes'], r'Choudhuri 9.5.')], minutes=30))
C.append(card('astro-read-10d', 10, 'active-galaxies', '8.11–8.12', '248–254', 'synchrotron radiation and bremsstrahlung',
  ['How do you tell non-thermal from thermal emission by the spectrum?', 'Why is synchrotron light polarised?'],
  'Look for: relativistic beaming into a cone $1/\\gamma$, the synchrotron spectrum from a power-law electron distribution $F_\\nu\\propto\\nu^{-(p-1)/2}$, thermal bremsstrahlung emissivity $\\propto n^2T^{1/2}e^{-h\\nu/k_BT}$.',
  [(r'Electrons with $N(E)\propto E^{-p}$, $p=2.5$: spectral index?', r'$F_\nu\propto\nu^{-(p-1)/2}=\nu^{-0.75}$: a power law, unlike a blackbody or thermal bremsstrahlung (flat then exponential cutoff).')],
  [(r'Thermal bremsstrahlung emissivity scales with density as', [r'$n^2$', r'$n$', r'$n^{1/2}$', r'independent'], r'Two-body process.'),
   (r'Synchrotron radiation needs', [r'relativistic electrons in magnetic fields', r'hot gas in equilibrium', r'atomic transitions', r'dust'], r'Choudhuri 8.11.')], minutes=20))
# ---------------------------------------------------------------- weeks 11-13: ch. 9.3, 10, 11
C.append(card('astro-read-11a', 11, 'expanding-universe', '9.3', '271–275', 'the expansion of the Universe',
  ['How do you measure distances to galaxies, and what did Hubble find?', 'Why is redshift not a Doppler velocity at large distance?'],
  'Look for: the distance ladder (parallax, Cepheids, standard candles), redshift $z$, Hubble&#8217;s law $v=H_0d$, the Hubble time.',
  [(r'Hubble time for $H_0=70$ km/s/Mpc?', r'$1/H_0=\frac{3.09\times10^{19}\,{\rm km}}{70\,{\rm km/s}}=4.4\times10^{17}$ s $\approx14$ Gyr.')],
  [(r'Hubble&#8217;s law', [r'$v=H_0d$ for nearby galaxies', r'$v=H_0/d$', r'$d=H_0v^2$', r'$z=H_0$'], r'Choudhuri 9.3.'),
   (r'Cepheids are useful because', [r'their period gives their luminosity', r'they are the brightest stars', r'they do not vary', r'they emit X-rays'], r'Period-luminosity relation.')], minutes=20))
C.append(card('astro-read-11b', 11, 'expanding-universe', '10.1–10.4', '297–312', 'metric of the Universe and the Friedmann equation',
  ['What does homogeneity and isotropy fix about the metric?', 'Which quantities enter the Friedmann equation?'],
  'Look for: basic GR ideas, the Robertson-Walker metric with $a(t)$ and $k$, comoving coordinates and redshift $1+z=a_0/a$, the Friedmann equation $\\dot a^2/a^2=\\frac{8\\pi G}3\\rho-\\frac{kc^2}{a^2}$ (with $\\Lambda$), critical density.',
  [(r'Critical density today for $H_0=70$ km/s/Mpc?', r'$\rho_c=\frac{3H_0^2}{8\pi G}\approx9.2\times10^{-27}$ kg/m$^3$, about 5 protons per m$^3$.'),
   (r'Derive the Newtonian Friedmann equation.', r'Shell of radius $R=ar$ around mass $M=\frac43\pi R^3\rho$: energy $\frac12\dot R^2-\frac{GM}R=$ const. Divide by $R^2/2$: $\frac{\dot a^2}{a^2}=\frac{8\pi G\rho}3-\frac{kc^2}{a^2}$.')],
  [(r'$1+z=$', [r'$a(t_0)/a(t_{\rm emit})$', r'$v/c$ always', r'$a(t_{\rm emit})/a(t_0)$', r'$H_0t$'], r'Choudhuri 10.3.'),
   (r'A flat universe has density', [r'equal to the critical density', r'zero', r'twice the critical', r'infinite'], r'$k=0$.')], minutes=40))
C.append(card('astro-read-12a', 12, 'expanding-universe', '10.5–10.7', '313–324', 'contents, CMB, matter and radiation eras',
  ['How does each component dilute as the Universe expands?', 'Why was the early Universe radiation dominated?'],
  'Look for: $\\rho_m\\propto a^{-3}$, $\\rho_r\\propto a^{-4}$, $T\\propto1/a$, the CMB blackbody at 2.7 K, closed and open matter solutions, the age, $a\\propto t^{2/3}$ (matter) and $a\\propto t^{1/2}$ (radiation).',
  [(r'Solve the flat matter-dominated Friedmann equation.', r'$\dot a^2\propto a^{-1}$: $a^{1/2}da\propto dt$, $a\propto t^{2/3}$, $H=\frac2{3t}$, age $t_0=\frac2{3H_0}$.'),
   (r'Generalise: $\rho\propto a^{-3(1+w)}$ in a flat universe.', r'$a\propto t^{2/(3(1+w))}$: $w=0$ gives $\frac23$, $w=\frac13$ gives $\frac12$ (HS24 summer Q7).')],
  [(r'Radiation energy density scales as', [r'$a^{-4}$', r'$a^{-3}$', r'$a^{-2}$', r'constant'], r'Dilution plus redshift.'),
   (r'In a flat matter-dominated universe $a\propto$', [r'$t^{2/3}$', r'$t^{1/2}$', r'$e^{Ht}$', r'$t$'], r'Choudhuri 10.6.')], minutes=35))
C.append(card('astro-read-13a', 13, 'early-universe', '11.1–11.4', '325–335', 'the hot early Universe and nucleosynthesis',
  ['How do you get $T(t)$ in the radiation era?', 'Why is about a quarter of the baryonic mass helium?'],
  'Look for: the time table, $T\\propto t^{-1/2}$, thermal equilibrium and relativistic degrees of freedom, neutron-proton freeze-out, BBN and the helium mass fraction, the neutrino background $T_\\nu=(4/11)^{1/3}T_\\gamma$.',
  [(r'Helium fraction from $n/p\approx1/7$ at nucleosynthesis?', r'All neutrons end in $^4$He: $Y=\frac{2(n/p)}{1+n/p}=\frac{2/7}{8/7}=0.25$.'),
   (r'Why is the neutrino background colder than the CMB?', r'Neutrinos decouple before $e^+e^-$ annihilation, which heats only the photons: $T_\nu/T_\gamma=(4/11)^{1/3}\approx0.71$, $T_\nu\approx1.95$ K.')],
  [(r'In the radiation era $T\propto$', [r'$t^{-1/2}$', r'$t^{-2/3}$', r'$t$', r'$e^{-t}$'], r'$a\propto t^{1/2}$, $T\propto1/a$.'),
   (r'The primordial helium mass fraction is about', [r'$0.25$', r'$0.01$', r'$0.75$', r'$0.5$'], r'Choudhuri 11.3.')], minutes=35))
C.append(card('astro-read-13b', 13, 'early-universe', '11.5–11.9', '336–356', 'dark matter, inflation, recombination, structure formation',
  ['What is the CMB a picture of, and when?', 'How did small fluctuations grow into galaxies?'],
  'Look for: hot vs cold dark matter, the horizon problem and inflation, baryogenesis, recombination and last scattering at $z\\approx1100$, CMB anisotropies, the SZ effect, the Ly$\\alpha$ forest, growth of perturbations.',
  [(r'Why does recombination happen at $T\approx3000$ K and not at 13.6 eV $\approx1.6\times10^5$ K?', r'There are $\sim10^9$ photons per baryon: even at $k_BT\ll13.6$ eV the Wien tail holds enough ionising photons until $T\approx3000$ K ($z\approx1100$).'),
   (r'Why must most dark matter be cold?', r'Hot (relativistic) dark matter free-streams and erases small-scale structure (top-down); observed hierarchical (bottom-up) formation needs cold dark matter.')],
  [(r'The CMB was released at', [r'recombination, $z\approx1100$', r'BBN, $t\approx3$ min', r'today', r'$z\approx6$'], r'Choudhuri 11.7.'),
   (r'Inflation solves', [r'the horizon and flatness problems', r'the solar neutrino problem', r'the Chandrasekhar limit', r'the Algol paradox'], r'Choudhuri 11.6.1.')], minutes=45))

write(os.path.join(HERE, '../../../../game/content/astrophysics/reading.json'), C, 'Guided reading of Choudhuri for Astro I; built by notes/astrophysics/build/reading/build.py')
