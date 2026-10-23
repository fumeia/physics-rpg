# Exam fidelity review (2026-10-14)

Method: exam PDFs read visually (QM FS26, FS22, HS25, HS23, FS19; solid state HS23 (1) and HS20) or via pdftotext for the
astro exams with solutions; each boss compared for statement wording, point values, all subparts and final numbers (recomputed
by hand against the printed solutions where one exists). Status: FIXED = changed in content/source; OK = verified, no change; OPEN = needs action.

## 1. QM bosses (not edited: another session owns the QM build)
| Item | File / id | Finding | Fix | Status |
|---|---|---|---|---|
| FS26 Q1 | angular-momentum-spin.json qm-am-b1 | Statement, points (5+3+3+4+5=20) and all four final answers match (P(L3=0)=1/2, <L2^2>=1/2, dL2=1/sqrt2, product 1/2). | none | OK |
| FS22 Q2 | qm-am-b2 | Points 2+2+3+5+3=15 match; answers c=2, product (l(l+1)-m^2)/2 = 4 for l=3,m=2, bound 1 verified. | none | OK |
| FS26 Q3 | qm-am-b3 | Points 5+4+5+5=19 match; E=5/2 hbar omega, L3 eigenvalues +-1,0 correct. | none | OK |
| HS25 Q3 | harmonic-oscillator-elevator.json qm-ho-b1 | Points 3+6+4+2+4=19 match; (v) coefficients -sqrt((n+1)(n+2))/2, +sqrt(n(n-1))/2 and E2=-(2n+1) hbar omega re-derived: correct. | none | OK |
| HS23 Q4 | qm-ho-b2 | Points 2+3+8+6+3+12=34 match (German original); <X_H>=r cos(wt), shift lambda/2, M=sqrt(m+1) correct. | none | OK |
| FS19 Q2 | qm-ho-b3 | Points 5+2+9+3+5=24 match; psi2(0)=-1/(sqrt2 pi^(1/4)), amplitude 2AB/sqrt2, E2=5/2 correct. | Cosmetic: the prompt of final answer `psi2` is wordy ("units of (m w/pi hbar)^(1/4) ... including pi^-1/4"); rewrite as "psi_2(xi=0) with xi=sqrt(m w/hbar) x, in units of (m w/hbar)^(1/4)", value -0.531 | FIXED (prompt reworded in build/parts/ho2.mjs) |
| QM blitz 'exam' (12) | qm/blitz.json 37-48 | HS22 part A and HS16 Aufgabe 1 are free-form short questions, NOT multiple choice. The blitz items are MC adaptations in that style (hermiticity, [x,p^2], [Lz,Lx], S_x eigenvalue, <H>, degeneracy ...). Physics of all 12 re-checked: correct. Sources "HS22 A style" / "HS16 short" are honest. | none | OK |
| Ideas | - | HS22 part A real items worth adding as boss-lite/blitz: A2 (find f with [x,f]=i hbar f, [p,f]=-i hbar f; answer f ~ exp-type, no solution file), A3 (psi=A x exp(-alpha x^2): alpha=m omega/2hbar, E=3/2 hbar omega), A7 (spin counting with 15/4 hbar^2: l=3/2 ... degeneracy (2j+1)^N-type). | add via QM build later | OPEN |

## 2. Astrophysics (edited via notes/astrophysics/build: no change was needed)
| Item | File / id | Finding | Fix | Status |
|---|---|---|---|---|
| 16 bosses | astro-agn-b1, exam-b1..b6, cosmo-b1/b2, dyn-b1/b2, ism-b1, nuc-b1, light-b1, forge-b1/b2 | Compared with HS24 winter (Q1,2,3,4,6,7), HS24 summer (Q3-6), HS25 winter (Q2,4,5,6,7), HS25 practice (Q6): statement wording, point values and numbers match (D=2.5e-3 pc, M<2.6e10 Msun, d_limit=58.5 kpc, A_V(15 deg)=1.53, flux 0.24, tS=5.0e7 yr, tdbl 3.5e7 yr, t_BBN=225 s, r/R=0.66, ratio 1.8e6). | none | OK |
| HS25 practice Q6(c) | astro-exam-b6 | The PRINTED SOLUTION has an arithmetic slip: it states M > 9.8e11 Msun but 9.8e10 x (18/8) = 2.2e11 Msun. The game answer (2.26e11) is correct. | already consistent; keep. Tell the student so they do not "correct" themselves to the key. | OK |
| Astro blitz 'exam' (12) | astrophysics/blitz.json 37-48 | The real MC (HS24 winter 15 q, HS25 winter ~15 q, 3 pt each) are different questions (e.g. real Q1 is m1=9, m2=13, F1/F2 ~ 40; ours m=3,8 -> 100). Ours are topic-adapted with changed numbers; all 10 sampled are physically correct (flux ratio 10^2, 1-e^-2=0.86, z=0.5, rho_r/rho_m ~ 1/a, R=10 Rsun ...). Source tags "Refregier MC" were misleading. | Source tag changed to "Refregier MC style (adapted, not verbatim)" | FIXED |
| Real MC topics not yet covered | - | HS25 winter: barnard star parallax 547 mas = 1.8 pc; lifetime ~ M^-2 (factor 16 for mass ratio 4); synchrotron f ~ nu^(-1/2) for N(E) ~ E^-2; z=0.024 with H0=72 -> 100 Mpc. HS24 winter: curve of growth, solar neutrino deficit 1/3, ICM bremsstrahlung ~ rho^2. | add as blitz items later | OPEN |

## 3. Solid state (source: notes/solid-state/build/*.py, rebuilt with build.py)
| Item | File / id | Finding | Fix | Status |
|---|---|---|---|---|
| HS23 Problem 2a/2b | ss-dri-b1 | Statement and answers match the key (E_F ratio 1.23, nu ratio 1/0.9, rho ratio 1, v ratio 1.39, Theta_D 154 K, rho_A/rho_B=1.54). BUT per-part marks "[1 pt]" for (a)-(d) were invented: the cover sheet gives 3 pt for the whole of 2a and 3 pt for 2b. | Removed the "[1 pt]" tags and added the real marking to the statement (r4.py) | FIXED |
| HS23 Problem 3 | ss-sem-b1 | m*_cb=hbar^2/(2 t a^2), m*_vb=hbar^2/(4 t a^2), n_e, n_h, tau_e/tau_h = sqrt2 exp((E_G-2mu)/kT) all match the key (indirect gap). | none | OK |
| HS23 Problem 4 | ss-mag-b1 | T_W matches the key. Hsat: key prints 16 J2 S/(g muB mu0), game gives 8 J2 S (factor 2). The game's own explanation already documents that the key counts bonds twice (energy per spin) but once in T_W; the two-spin singlet-triplet check supports the factor 8. | none; student should write own convention in the exam | OK (documented) |
| HS20 Task 2 BaTiO3 | ss-lat-b1 | Points 2+2+2+2+4+2=14 match; S(110)=8 fO, S(200)=12 fO, ratio 2.25. | none | OK |
| HS20 Task 5 | ss-fer-b1 | Points 3+3+2+4+1=13 match; E+- = hbar^2 pi^2/(m a^2) +- U0, gap 2 U0. | none | OK |
| Bosses without exam source | ss-bon-b1, ss-deg-b1, ss-pho-b1 | Declared "constructed" in the source field (no verbatim exam); fine, but they are not exam-fidelity items. | none | OK |
| HS23 Problem 1 (2D crystals, 3 pt, incl. neutron peaks I(2,1)/I(1,1)=4) | - | Not in the game at all although it is a full problem (basis, Wigner-Seitz area 10 vs 20 A^2, BZ area 3.95 / 1.97 A^-2, theta=39.5 / 22.2 deg). | add a boss to the lattice-gate room | OPEN |
| Solid-state blitz 'exam' (12) | solid-state/blitz.json 37-48 | Tagged "HS20 MC" but they were NOT the HS20 multiple-choice questions (which are 20 items a-t, 1.5 pt each, mostly figure-based). Physics of all 12 correct. | Source relabelled "HS20 MC topic, adapted (not verbatim)"; added 5 real HS20 MC items (c, d, l, m, q) with the printed options and the key (i and j dropped as duplicates of existing questions): new ids 49-53 | FIXED |
| HS20 MC items not added | - | (a),(e),(f),(g),(o),(t) need figures; (n) options garbled in text extraction, (r) key marker ambiguous in text extraction. | read visually and add | OPEN |

## 4. Blitz explanations
43 single-sentence explanations in the three banks (QM 17, astro 10, solid state 16) got one extra line with a check, an example or the reason.
Validation: content-check-blitz, content-check-astrophysics, content-check-solid-state pass.
