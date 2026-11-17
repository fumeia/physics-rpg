r"""Coverage map for Astro I (Refregier, following Choudhuri, "Astrophysics for Physicists", ch. 1-11): every section
against the game's astro content (rooms, Choudhuri exercises, experiments), plus how many of the four Refregier exams
(HS24 summer + winter, HS25 practice + winter; the only ones that matter, see notes/syllabus.md) touch the topic.
Writes notes/astrophysics/coverage.md and game/content/astrophysics/coverage.json.
Run: python3 coverage.py. A mention is not a lesson: this finds gaps, it does not prove depth.
Exam hits come from the pdftotext extracts in notes/extracted (search only), so they are a rough signal."""
import json, os, re
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.join(HERE, '../../../..'); GAME = os.path.join(ROOT, 'game/content')
C = lambda *p: json.load(open(os.path.join(GAME, *p), encoding='utf-8'))
EXAMS = {'S24': 'Astro_I_2024_Summer_Session', 'W24': 'Astro_I_2024_Winter_Session', 'P25': 'Astro_I_2025_Practice_Exam', 'W25': 'Astro_I_2025_Winter_Session'}
EX = {k: open(os.path.join(ROOT, 'notes/extracted', f'astrophysics_old-exams_{v}.txt'), encoding='utf-8', errors='ignore').read().lower() for k, v in EXAMS.items()}

# (section, title, page, priority from notes/syllabus.md (A every recent exam, B occasional, C rare, - not examined), {concept: regex})
S = [
 ('1.1', 'Mass, length and time scales', 1, 'B', {'astronomical units: AU, parsec, solar mass/luminosity': r'parsec|\bpc\b|\bau\b|astronomical unit|m_\\odot|l_\\odot|solar (mass|luminosit)'}),
 ('1.3', 'Celestial coordinates', 6, 'A', {'equatorial coordinates (RA, dec)': r'right ascension|declination|celestial (sphere|coordinate)'}),
 ('1.4', 'Magnitude scale', 8, 'A', {'apparent and absolute magnitude': r'magnitude', 'distance modulus': r'distance modulus|m\s*-\s*m\s*=\s*5'}),
 ('1.7', 'Astronomy in different bands', 14, 'A', {'angular resolution, diffraction limit': r'angular resolution|diffraction limit|1\.22|resolving power', 'telescope collecting area': r'telescope|aperture|collecting area'}),
 ('2.2.1', 'Radiation field: specific intensity, flux', 23, 'A', {'specific intensity I_nu': r'specific intensity|i_\\nu|i_\{\\nu\}', 'flux and energy density from I': r'energy density|flux density|radiation pressure'}),
 ('2.2.2', 'Radiative transfer equation', 26, 'A', {'transfer equation with emission/absorption': r'transfer equation|dI_\\nu/ds|\\frac\{dI_\\nu\}\{ds\}|emission coefficient|absorption coefficient|j_\\nu'}),
 ('2.2.3', 'Optical depth, formal solution', 28, 'A', {'optical depth tau': r'optical depth|\\tau_\\nu|optically (thin|thick)', 'source function': r'source function|s_\\nu'}),
 ('2.2.4', 'Kirchhoff’s law', 30, 'A', {'Kirchhoff j = alpha B': r'kirchhoff'}),
 ('2.3', 'Thermodynamic equilibrium, LTE', 31, 'A', {'blackbody / Planck function': r'planck|blackbody|black.body|b_\\nu', 'local thermodynamic equilibrium': r'\blte\b|local thermodynamic', 'Wien / Stefan-Boltzmann': r'wien|stefan|\\sigma t\^4|sigma_\{?sb'}),
 ('2.4', 'Stellar atmospheres, grey atmosphere, lines', 35, 'B', {'plane-parallel / grey atmosphere': r'grey atmosphere|gray atmosphere|plane.parallel|eddington approximation', 'limb darkening': r'limb darkening', 'line formation (absorption lines)': r'absorption line|line formation|spectral line'}),
 ('2.5', 'Radiative transport in the interior', 46, 'A', {'radiative diffusion, Rosseland opacity': r'rosseland|radiative (diffusion|transport|transfer of energy)|diffusion approximation|dt/dr'}),
 ('2.6', 'Opacity: Thomson, Kramers, H-', 48, 'B', {'Thomson scattering': r'thomson', 'Kramers opacity / H minus': r'kramers|h\^-|h\^\{-\}|negative hydrogen'}),
 ('2.7', 'Analysis of spectral lines', 53, 'B', {'Boltzmann / Saha equation': r'saha|boltzmann (equation|factor|distribution)', 'line broadening, curve of growth': r'broadening|curve of growth|equivalent width|doppler width'}),
 ('2.8', 'Photon diffusion in the Sun', 55, 'B', {'random walk escape time': r'random walk|diffusion time|escape time|mean free path'}),
 ('3.2.1', 'Hydrostatic equilibrium', 62, 'A', {'dP/dr = -G M rho / r^2': r'hydrostatic'}),
 ('3.2.2', 'Virial theorem for stars', 64, 'A', {'2K + U = 0': r'virial'}),
 ('3.2.3', 'Energy transport', 66, 'A', {'luminosity equation dL/dr = 4 pi r^2 rho eps': r'dl/dr|dl_r|energy (generation|production) rate|\\epsilon|4\\pi r\^2\\rho'}),
 ('3.2.4', 'Convection', 67, 'B', {'Schwarzschild criterion, adiabatic gradient': r'convect|schwarzschild criterion|adiabatic (gradient|temperature)'}),
 ('3.3', 'Constructing stellar models; polytropes', 70, 'B', {'polytrope / Lane-Emden': r'polytrop|lane.emden'}),
 ('3.4', 'Relations amongst stellar quantities', 74, 'A', {'mass-luminosity relation, scaling': r'mass.luminosity|l\s*\\propto\s*m|l \\propto m\^|m\^3|m\^\{3', 'main-sequence lifetime': r'lifetime|main.sequence life'}),
 ('3.5', 'Determination of stellar parameters; HR diagram', 77, 'A', {'HR diagram': r'hertzsprung|\bhr diagram|h\\text\{r\}|hr-diagram|colour.magnitude|color.magnitude', 'spectral classes OBAFGKM': r'spectral (class|type)|obafgkm|o, b, a'}),
 ('3.6', 'Main sequence, red giants, white dwarfs', 82, 'A', {'red giants / evolution off the MS': r'red giant|turn.off|turnoff'}),
 ('3.6.1', 'Eddington luminosity', 85, 'A', {'Eddington limit': r'eddington lumin|eddington limit|l_\{?\\rm\s*edd|l_\{?edd'}),
 ('3.6.2', 'HR diagrams of clusters', 86, 'A', {'cluster age from turn-off': r'turn.off|cluster age|globular cluster|open cluster'}),
 ('4.1', 'Possibility of nuclear reactions', 91, 'B', {'Coulomb barrier, tunnelling, Gamow': r'coulomb barrier|gamow|tunnel'}),
 ('4.2', 'Nuclear reaction rates', 93, 'B', {'Gamow peak, rate temperature dependence': r'gamow peak|reaction rate|\\propto t\^'}),
 ('4.3', 'Nuclear reactions in stars', 97, 'B', {'pp chain / CNO cycle': r'pp.chain|proton.proton|\bcno\b', 'binding energy per nucleon': r'binding energy per nucleon|binding energy'}),
 ('4.4', 'Solar neutrinos, helioseismology', 101, 'B', {'solar neutrino problem / oscillations': r'neutrino', 'helioseismology': r'helioseismolog|p.mode|solar oscillation'}),
 ('4.5', 'Stellar evolution, binaries', 108, 'A', {'post-MS evolution, helium flash, AGB': r'helium (flash|burning)|triple.alpha|\bagb\b|horizontal branch|planetary nebula', 'binary evolution, mass transfer': r'roche|mass transfer|binary evolution'}),
 ('4.6', 'Mass loss, stellar winds', 112, 'C', {'stellar winds': r'stellar wind|solar wind|mass loss'}),
 ('4.7', 'Supernovae', 115, 'B', {'core collapse / type Ia': r'supernova|\bsn ?ia\b|type ia|core collapse'}),
 ('4.8', 'Stellar rotation, magnetic fields', 119, 'C', {'rotation, dynamo, magnetic braking': r'dynamo|magnetic braking|stellar rotation|solar cycle'}),
 ('4.9', 'Extrasolar planets', 123, 'B', {'radial velocity / transit method': r'exoplanet|extrasolar|transit|radial.velocity method'}),
 ('5.2', 'Degeneracy pressure of a Fermi gas', 128, 'B', {'Fermi momentum, degeneracy pressure P ~ n^(5/3), n^(4/3)': r'degenera|fermi (momentum|energy|gas)'}),
 ('5.3', 'White dwarfs, Chandrasekhar limit', 132, 'B', {'white dwarf mass-radius': r'white dwarf', 'Chandrasekhar mass': r'chandrasekhar'}),
 ('5.4', 'Neutron drip, neutron stars', 137, 'B', {'neutron stars': r'neutron star|neutron drip|inverse beta'}),
 ('5.5', 'Pulsars', 139, 'B', {'pulsar spin-down, magnetic dipole': r'pulsar|spin.down|magnetic dipole'}),
 ('5.6', 'X-ray binaries, accretion disks', 145, 'A', {'accretion luminosity G M Mdot / R': r'accretion (lumin|rate|disk|disc|efficien)|gm\\dot|\\dot m|\\dot\{m\}', 'accretion disk temperature': r'disk temperature|disc temperature|t\(r\)\s*\\propto r\^\{?-3/4'}),
 ('6.1', 'Shape and size of the Galaxy, star counts, extinction', 153, 'A', {'star counts N(>F) ~ F^(-3/2)': r'star count|-3/2|f\^\{-3/2\}', 'interstellar extinction and reddening': r'extinction|reddening|colour excess|color excess'}),
 ('6.2', 'Galactic rotation, Oort constants', 160, 'A', {'rotation curve': r'rotation curve|flat rotation', 'Oort constants': r'oort constant|oort\'?s? a'}),
 ('6.3', 'Nearly circular orbits, epicycles', 166, 'B', {'epicycle frequency': r'epicycl', 'solar motion, velocity ellipsoid': r'solar motion|velocity ellipsoid|lsr\b|local standard of rest'}),
 ('6.4', 'Stellar populations', 173, 'A', {'population I / II': r'population (i|ii|1|2)\b|pop(\.|ulation) ?ii|metallicit'}),
 ('6.5', 'Interstellar gas, 21 cm', 174, 'A', {'21 cm line': r'21.cm|21 \\rm\{cm|hyperfine'}),
 ('6.6', 'Phases of the ISM', 177, 'A', {'HII regions, Stromgren sphere': r'str(o|ö)mgren|hii region|h ii region|h\\,?ii|ionizing photon|ionising photon', 'molecular clouds': r'molecular cloud|\bco\b emission|h_2'}),
 ('6.7', 'Galactic magnetic field, cosmic rays', 187, 'C', {'cosmic rays, Faraday rotation': r'cosmic ray|faraday rotation'}),
 ('6.8', 'Thermal and dynamical considerations of the ISM', 191, 'C', {'ISM pressure balance, cooling': r'pressure (balance|equilibrium)|cooling function|two.phase|three.phase'}),
 ('7.2', 'Virial theorem in stellar dynamics', 199, 'A', {'virial for clusters / galaxies, velocity dispersion': r'velocity dispersion|virial (mass|theorem)'}),
 ('7.3', 'Collisional relaxation', 201, 'A', {'relaxation time t_relax ~ N/(8 ln N) t_cross': r'relaxation time|relaxation|crossing time'}),
 ('7.4', 'Thermodynamic equilibrium vs self-gravity', 204, 'B', {'negative heat capacity, isothermal sphere': r'negative (specific )?heat|isothermal sphere|gravothermal'}),
 ('7.5', 'Boltzmann equation for collisionless systems', 207, 'B', {'collisionless Boltzmann / distribution function': r'collisionless boltzmann|distribution function|vlasov'}),
 ('7.6', 'Jeans equations, Oort limit, asymmetric drift', 210, 'A', {'Jeans equations of stellar dynamics': r'jeans equation', 'Oort limit / asymmetric drift': r'oort limit|asymmetric drift', 'Plummer / isothermal models': r'plummer|isothermal'}),
 ('8.2', 'Equations of fluid mechanics', 220, 'B', {'continuity / Euler equation': r'euler equation|continuity equation|navier'}),
 ('8.3', 'Jeans instability', 223, 'A', {'Jeans length and mass': r'jeans (length|mass|instabil|criterion|wavelength)'}),
 ('8.4', 'Basic equations of MHD', 228, 'C', {'induction equation, magnetic Reynolds number': r'induction equation|magnetic reynolds|\bmhd\b|magnetohydro'}),
 ('8.5', 'Alfvén flux freezing', 230, 'C', {'flux freezing': r'flux freezing|frozen.in|alfv(e|é)n'}),
 ('8.6-8.9', 'Sunspots, buoyancy, Parker instability, reconnection', 234, 'C', {'sunspots / magnetic buoyancy / reconnection': r'sunspot|magnetic buoyancy|parker instab|reconnection'}),
 ('8.10', 'Particle acceleration', 243, 'C', {'Fermi acceleration, power-law spectrum': r'fermi acceleration|shock acceleration|power.law spectrum'}),
 ('8.11', 'Relativistic beaming, synchrotron', 248, 'B', {'synchrotron radiation': r'synchrotron', 'relativistic beaming': r'beaming|doppler boost|1/\\gamma'}),
 ('8.12', 'Bremsstrahlung', 253, 'B', {'thermal bremsstrahlung (X-ray clusters)': r'bremsstrahlung|free.free'}),
 ('8.13', 'Plasma oscillations, EM waves in plasma', 254, 'C', {'plasma frequency, dispersion measure': r'plasma frequency|dispersion measure|\\omega_p'}),
 ('9.2', 'Normal galaxies: morphology and kinematics', 261, 'A', {'Hubble sequence (spiral/elliptical)': r'hubble (sequence|tuning fork|classification)|elliptical|spiral galax', 'Tully-Fisher / Faber-Jackson, de Vaucouleurs': r'tully|faber|vaucouleurs|r\^\{?1/4|s(é|e)rsic'}),
 ('9.3', 'Expansion of the Universe', 271, 'A', {'Hubble law, redshift': r'hubble (law|constant|parameter)|redshift', 'distance ladder, Cepheids': r'cepheid|distance ladder|standard candle'}),
 ('9.4', 'Active galaxies, quasars, superluminal motion', 276, 'A', {'AGN / quasars, BH engine': r'quasar|\bagn\b|active galac|seyfert|blazar', 'variability size limit R < c dt': r'variabil|c\\,?\\delta t|c\\delta t|light.crossing', 'superluminal motion': r'superluminal'}),
 ('9.5', 'Clusters of galaxies, dark matter', 286, 'A', {'cluster mass from virial / X-ray, dark matter': r'cluster of galaxies|galaxy cluster|clusters of galaxies|intracluster|dark matter'}),
 ('9.6', 'Large-scale distribution of galaxies', 293, 'C', {'large-scale structure, correlation function': r'large.scale structure|correlation function|cosmic web|void'}),
 ('9.7', 'Gamma ray bursts', 295, 'C', {'GRBs': r'gamma.ray burst|\bgrb'}),
 ('10.3', 'Metric of the Universe (FRW)', 304, 'A', {'FRW metric, scale factor, comoving coordinates': r'robertson|\bfrw\b|flrw|scale factor|comoving'}),
 ('10.4', 'Friedmann equation', 308, 'A', {'Friedmann equation, critical density': r'friedmann|critical density|\\rho_c'}),
 ('10.5', 'Contents of the Universe, CMB', 313, 'A', {'density parameters Omega': r'\\omega_\{?[mr\\]|density parameter|omega_m|omega_\\lambda', 'cosmic microwave background': r'microwave background|\bcmb'}),
 ('10.6', 'Matter-dominated Universe, closed/open, age', 317, 'A', {'closed / open solutions, cycloid': r'closed (universe|solution)|open (universe|solution)|cycloid|big crunch', 'age of the Universe': r'age of the universe|hubble time|t_0'}),
 ('10.7', 'Radiation-dominated Universe', 322, 'A', {'a ~ t^(1/2), T ~ 1/a': r'radiation.dominated|radiation era|t\^\{?1/2|t \\propto a\^\{?-1|t\\propto 1/a'}),
 ('11.2', 'Thermodynamic equilibrium in the early Universe', 327, 'A', {'relativistic species, g_*, T(t)': r'g_\*|g_\{\\ast|degrees of freedom|relativistic species|thermal equilibrium'}),
 ('11.3', 'Primordial nucleosynthesis', 331, 'A', {'BBN, n/p freeze-out, helium fraction': r'nucleosynthesis|\bbbn\b|freeze.out|helium (abundance|fraction|mass fraction)|n/p'}),
 ('11.4', 'Cosmic neutrino background', 334, 'B', {'neutrino temperature (4/11)^(1/3)': r'4/11|neutrino background|neutrino decoupling'}),
 ('11.5', 'Nature of dark matter', 336, 'A', {'hot vs cold dark matter, WIMPs': r'cold dark matter|hot dark matter|\bwimp|\bcdm'}),
 ('11.6', 'Horizon problem, inflation, baryogenesis', 339, 'C', {'horizon problem and inflation': r'inflation|horizon problem|flatness problem', 'baryogenesis': r'baryogenesis|sakharov|baryon asymmetry'}),
 ('11.7', 'Recombination, last scattering, CMB anisotropies, SZ', 341, 'A', {'recombination / last scattering': r'recombination|last scattering|decoupling', 'CMB anisotropies / SZ effect': r'anisotrop|sunyaev|\bsz\b'}),
 ('11.8', 'Evolution at z ~ 1-6, IGM', 344, 'B', {'Lyman-alpha forest, Gunn-Peterson': r'lyman.alpha|ly\\alpha|gunn|intergalactic medium|reionization'}),
 ('11.9', 'Structure formation', 349, 'A', {'growth of perturbations, Jeans in expanding universe': r'structure formation|density (perturbation|contrast)|\\delta\s*\\propto|growth of (perturbations|structure)'}),
]

idx = C('astrophysics', 'index.json'); encs = []
for r in idx['rooms']:
    for e in C('astrophysics', r + '.json')['encounters']: encs.append((r, e))
for f in idx.get('extras', []):
    x = C('astrophysics', f)
    for it in x.get('items', []): encs.append((it['room'], it['enc']))
for l in C('labs-astrophysics.json')['labs']: encs.append((l['room'].split('/')[1], l['enc']))
def text(o): return ' '.join(text(v) for v in o.values()) if isinstance(o, dict) else ' '.join(text(v) for v in o) if isinstance(o, list) else o if isinstance(o, str) else ''
def kind(r, e): return 'theory' if e['type'] == 'lesson' else 'quiz' if e['type'] == 'quiz' else 'exam' if r == 'exam-hall' or e['type'] == 'boss' else 'exercise'
items = [(r, e, kind(r, e), text(e).lower()) for r, e in encs]
rows = []
for sec, title, page, prio, concepts in S:
    cs = []
    for name, pat in concepts.items():
        rx = re.compile(pat, re.I); hit = {'theory': [], 'quiz': [], 'exercise': [], 'exam': []}
        for r, e, k, t in items:
            if rx.search(t): hit[k].append(e['id'])
        ex = [k for k, t in EX.items() if rx.search(t)]
        cs.append({'concept': name, **{k: len(v) for k, v in hit.items()}, 'exams': ex, 'ids': {k: v[:6] for k, v in hit.items()}})
    th = all(c['theory'] for c in cs); pr = all(c['exercise'] + c['exam'] + c['quiz'] for c in cs); some = any(c['theory'] + c['exercise'] + c['exam'] + c['quiz'] for c in cs)
    exams = sorted({x for c in cs for x in c['exams']})
    rows.append({'section': sec, 'title': title, 'page': page, 'priority': prio, 'exams': exams,
                 'status': 'covered' if th and pr else 'thin' if some else 'missing', 'concepts': cs})
json.dump({'about': 'Choudhuri ch. 1-11 against the game content and the four Refregier exams; generated by notes/astrophysics/build/coverage/coverage.py', 'rows': rows},
          open(os.path.join(GAME, 'astrophysics', 'coverage.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
mark = {'covered': '✅', 'thin': '🟡', 'missing': '❌'}; n = {k: sum(r['status'] == k for r in rows) for k in mark}
md = ['# Astro: coverage map (Choudhuri ch. 1–11)', '',
      'Generated by `notes/astrophysics/build/coverage/coverage.py`. Sections of Choudhuri (which Refregier follows) against the game',
      'content (rooms, Choudhuri exercises, experiments, exam hall). **Exams** = which of the four Refregier exams mention the topic',
      '(S24, W24 = 2024 summer/winter, P25 = 2025 practice, W25 = 2025 winter; searched in text extracts, so a rough signal).',
      '**Prio** from notes/syllabus.md: A every recent exam, B occasional, C rare.',
      '✅ every concept has a lesson **and** practice · 🟡 some concept lacks a lesson or practice · ❌ nothing in the game.', '',
      f"**{n['covered']} covered, {n['thin']} thin, {n['missing']} missing** of {len(rows)} sections.", '',
      '| § | Topic | p. | Prio | Exams | | Concept | Lessons | Quizzes | Exercises | Exam hall/bosses |', '|---|---|---|---|---|---|---|---|---|---|---|']
for r in rows:
    for i, c in enumerate(r['concepts']):
        first = i == 0
        md.append(f"| {r['section'] if first else ''} | {r['title'] if first else ''} | {r['page'] if first else ''} | {r['priority'] if first else ''} | {' '.join(c['exams']) or '–'} | {mark[r['status']] if first else ''} | {c['concept']} | {c['theory'] or '–'} | {c['quiz'] or '–'} | {c['exercise'] or '–'} | {c['exam'] or '–'} |")
gaps = [r for r in rows if r['status'] != 'covered']
gaps.sort(key=lambda r: ('ABC-'.index(r['priority']), -len(r['exams'])))
md += ['', '## Gaps by priority', '']
for r in gaps:
    miss = [c['concept'] + ': ' + ', '.join(x for x, ok in (('no lesson', c['theory']), ('no practice', c['exercise'] + c['exam'] + c['quiz'])) if not ok) for c in r['concepts'] if not c['theory'] or not (c['exercise'] + c['exam'] + c['quiz'])]
    md.append(f"- {mark[r['status']]} **{r['section']} {r['title']}** (prio {r['priority']}, exams: {' '.join(r['exams']) or 'none'}): " + '; '.join(miss))
open(os.path.join(HERE, '../../coverage.md'), 'w', encoding='utf-8').write('\n'.join(md) + '\n')
print(n)
for r in gaps: print(f"{mark[r['status']]} {r['priority']} {r['section']:7} {r['title'][:42]:42} ex:{' '.join(r['exams']) or '-':12} | " + '; '.join(c['concept'][:40] + (' L' if not c['theory'] else '') + (' P' if not (c['exercise'] + c['exam'] + c['quiz']) else '') for c in r['concepts'] if not c['theory'] or not (c['exercise'] + c['exam'] + c['quiz'])))
