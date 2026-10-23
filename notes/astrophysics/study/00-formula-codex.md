# Formula codex (astrophysics)

Every formula used in the rooms, with what it means and when to use it. This is a draft for your 4-page exam sheet.

## Distances and angles

**Parallax and parsec**  
$$d[\mathrm{pc}]=1/p[''],\ 1\,\mathrm{pc}=206265\,\mathrm{AU}=3.086\times10^{16}\,\mathrm m$$
Distance from the yearly parallax angle. *(Choudhuri §1.3)*

**Diffraction limit**  
$$\theta\simeq1.22\,\lambda/D$$
Smallest resolvable angle of a circular aperture. *Use when:* telescope resolution questions *(HS25 practice Q1)*

## Photometry

**Magnitudes**  
$$m_1-m_2=-2.5\log_{10}(F_1/F_2)$$
5 mag = factor 100; larger m = fainter. *(Choudhuri §1.4)*

**Distance modulus**  
$$m-M=5\log_{10}(d/10\,\mathrm{pc})+A_\lambda$$
M = magnitude at 10 pc; A = extinction in mag. *(Choudhuri §1.4)*

**Extinction as a flux ratio**  
$$F_{\rm ext}/F_0=10^{-A/2.5}$$
Dimming by dust. *(HS24 summer Q4)*

**Flux from luminosity**  
$$F=\frac{L}{4\pi d^2}$$
Inverse-square law (no extinction, no cosmology).

## Radiation

**Planck function**  
$$B_\nu=\frac{2h\nu^3}{c^2}\frac{1}{e^{h\nu/k_BT}-1}$$
Specific intensity of a blackbody. *(Choudhuri (2.6))*

**Temperature derivative of Planck**  
$$\frac{\partial B_\nu}{\partial T}=\frac{2h\nu^3}{c^2T}\frac{xe^x}{(e^x-1)^2},\ x=\frac{h\nu}{k_BT}$$
Converts intensity fluctuations to temperature fluctuations; always > 0. *(HS24 summer Q2c)*

**Rayleigh–Jeans limit**  
$$B_\nu\simeq2k_BT\nu^2/c^2\quad(h\nu\ll k_BT)$$
Classical limit, linear in T. CMB: valid below 57 GHz. *(HS24 summer Q2a)*

**Wien displacement**  
$$\lambda_{\max}T=2.898\times10^{-3}\,\mathrm{m\,K}$$
Peak wavelength of B_λ. *(HS25 winter Q3)*

**Stefan–Boltzmann**  
$$u=a_BT^4,\ F=\sigma_{SB}T^4=\tfrac{c}{4}a_BT^4,\ L=4\pi R^2\sigma_{SB}T_{\rm eff}^4$$
Energy density, emergent flux, stellar luminosity (defines T_eff). *(Choudhuri §2.2)*

## Radiative transfer

**Moments of the intensity**  
$$F_\nu=\oint I_\nu\cos\theta\,d\Omega,\ U_\nu=\tfrac1c\oint I_\nu d\Omega,\ P_\nu=\tfrac1c\oint I_\nu\cos^2\theta\,d\Omega$$
Isotropic: F = 0, P = U/3. *(Choudhuri (2.3)-(2.9))*

**Transfer equation and solution**  
$$\frac{dI_\nu}{d\tau_\nu}=S_\nu-I_\nu,\ I=I_0e^{-\tau}+S(1-e^{-\tau})$$
dτ = α ds, S = j/α. Thick: I → S; thin: I ≈ I0 + Sτ. *(Choudhuri (2.12)-(2.19))*

**Kirchhoff (LTE)**  
$$S_\nu=j_\nu/\alpha_\nu=B_\nu(T)$$
Valid when the mean free path is much smaller than the scale of gradients; not for scattering. *(Choudhuri (2.26))*

**Grey atmosphere (Eddington)**  
$$T^4=\tfrac34T_{\rm eff}^4(\tau+\tfrac23),\ \frac{I(0,\mu)}{I(0,1)}=\tfrac35(\mu+\tfrac23)$$
T = T_eff at τ = 2/3; limb at 40 % of centre. *(Choudhuri (2.69)-(2.70))*

**Opacities**  
$$\alpha=\chi\rho,\ \chi_T=\sigma_T/m_H=0.04\,\mathrm{m^2/kg},\ \chi_{\rm Kramers}\propto\rho T^{-3.5}$$
Thomson scattering (hot, ionised); bound-free/free-free (Kramers). *(Choudhuri (2.79), (2.85))*

**Random walk**  
$$L=\sqrt N\,l,\ t_{\rm diff}\sim R^2/(lc)$$
Photon diffusion time out of a star (~10⁴ yr for the Sun). *(Choudhuri §2.8)*

## Stellar structure

**Radiative temperature gradient**  
$$\frac{dT}{dr}=-\frac{3\chi\rho}{4a_BcT^3}\frac{L_r}{4\pi r^2}$$
Energy transport by photon diffusion. *(HS25 practice Q2c)*

**Schwarzschild criterion**  
$$\left|\tfrac{dT}{dr}\right|<\left(1-\tfrac1\gamma\right)\tfrac TP\left|\tfrac{dP}{dr}\right|$$
Stable against convection when true. *(HS25 practice MC4)*

**Structure equations**  
$$\frac{dM_r}{dr}=4\pi r^2\rho,\ \frac{dP}{dr}=-\frac{GM_r\rho}{r^2},\ \frac{dL_r}{dr}=4\pi r^2\rho\varepsilon$$
Mass continuity, hydrostatic equilibrium, energy generation; plus the radiative gradient. *(Choudhuri (3.25)-(3.28))*

**Ideal gas**  
$$P=\frac{\rho k_BT}{\mu m_H},\ \mu=(2X+\tfrac34Y+\tfrac12Z)^{-1}$$
μ = 1/2 for ionised hydrogen. *(Choudhuri (3.23)-(3.24))*

**Virial theorem**  
$$2E_T+E_G=0,\ E=\tfrac12E_G$$
Stars heat up when they lose energy. *(Choudhuri (3.10)-(3.12))*

**Kelvin–Helmholtz time**  
$$\tau_{KH}\approx\frac{GM^2}{2RL}\approx10^7\,\mathrm{yr}\ (\odot)$$
Shining by contraction alone. *(Choudhuri (3.13))*

**Main-sequence scalings**  
$$P\propto\frac{M^2}{R^4},\ T\propto\frac MR,\ L\propto M^3,\ L\propto T_{\rm eff}^6,\ \tau\propto M^{-2}$$
Homology-type estimates with constant opacity. *(Choudhuri (3.33)-(3.41))*

**Eddington luminosity**  
$$L_{Edd}=\frac{4\pi cGM}{\chi}=\frac{4\pi GMm_pc}{\sigma_T}\approx3.3\times10^4L_\odot\frac{M}{M_\odot}$$
Radiation pressure balances gravity. *(HS24 summer Q3)*

**Nuclear timescale**  
$$\tau_{\rm nuc}\approx\frac{0.007\cdot0.1\,Mc^2}{L}\approx10^{10}\,\mathrm{yr}\ (\odot)$$
0.7 % mass defect of H → He, 10 % of the mass burns.

## Nuclear astrophysics

**Binding energy**  
$$E_B=[Zm_p+(A-Z)m_n-m_{\rm nuc}]c^2$$
Peak of E_B/A ≈ 8.8 MeV at Fe; He-4: 7.1 MeV. *(Choudhuri (4.1))*

**Hydrogen burning**  
$$4\,{}^1\mathrm H\to{}^4\mathrm{He}+2e^++2\nu_e+26.7\,\mathrm{MeV}$$
0.7 % of rest mass; pp chain (Sun) or CNO (M > 1.3 M_sun). *(Choudhuri §4.3)*

**Gamow factor and peak**  
$$P\simeq e^{-\sqrt{E_G/E}},\ E_G=2mc^2(\pi\alpha Z_1Z_2)^2,\ E_0=(\tfrac12\sqrt{E_G}k_BT)^{2/3}$$
Tunnelling through the Coulomb barrier; p+p: E_G = 493 keV, E_0 ≈ 6 keV. *(Choudhuri (4.7)-(4.14))*

**Temperature sensitivity**  
$$\varepsilon_{pp}\propto T^4,\ \varepsilon_{CNO}\propto T^{16\text{–}20}$$
(τ−2)/3 with τ = 3E_0/k_BT.

**Exoplanet signals**  
$$\frac{\Delta F}{F}=\left(\frac{R_p}{R_\star}\right)^2,\quad v_\star=\frac{m_p}{M_\star}v_p$$
Transit depth and radial-velocity wobble. *(Choudhuri §4.9)*

## Compact objects

**Fermi momentum**  
$$n_e=\frac{8\pi p_F^3}{3h^3},\ n_e=\frac{\rho}{\mu_em_H},\ \mu_e=\frac{2}{1+X}$$
Pauli filling of phase space; μe = 2 for He/C/O. *(Choudhuri (5.2)-(5.8))*

**Degeneracy pressure**  
$$P=K_1\rho^{5/3}\ (\text{non-rel.}),\ P=K_2\rho^{4/3}\ (\text{rel.})$$
K1 = 1.00e7/μe^{5/3}, K2 = 1.24e10/μe^{4/3} SI. Relativistic above ~2e9 kg/m³. *(Choudhuri (5.9)-(5.12))*

**White dwarf mass–radius and Chandrasekhar**  
$$R\propto M^{-1/3},\ M_{Ch}=1.46\,(2/\mu_e)^2M_\odot$$
More massive WDs are smaller; no WD above ~1.4 M_sun. *(Choudhuri (5.25), (5.28))*

**Breakup period**  
$$P_{\min}=2\pi\sqrt{R^3/GM}$$
WD ~10 s, NS ~0.5 ms: only neutron stars can be ms pulsars.

**Pulsar spin-down**  
$$L=4\pi^2I\dot P/P^3,\ \tau_c=P/(2\dot P)$$
Rotational energy loss; characteristic age.

**Accretion luminosity**  
$$L=\frac{GM\dot M}{R}=\eta\dot Mc^2,\ \eta=\frac{GM}{Rc^2}$$
NS: η ≈ 0.2; BH: η ≈ 0.1 (exam value). *(Choudhuri §5.6, HS25 winter Q6)*

## Interstellar medium

**Extinction and reddening**  
$$A_\lambda=1.086\,\tau_\lambda,\ E(B-V)=A_B-A_V,\ A_V\approx3.1E(B-V)$$
Dust dims (adds magnitudes) and reddens. *(Choudhuri §6.1)*

**Euclidean star counts**  
$$N(F>F_0)\propto F_0^{-3/2},\ \log N(<m)=0.6m+\mathrm{const}$$
Uniform transparent distribution; deviations mean edges or extinction. *(HS24 winter Q3)*

**Strömgren radius**  
$$R_s=\left(\frac{3N_\gamma}{4\pi\alpha n_pn_e}\right)^{1/3}$$
Size of an HII region; ∝ n^{-2/3}. *(HS25 practice Q4)*

**21 cm line**  
$$\nu=1420.4\,\mathrm{MHz},\ \Delta E=5.9\,\mu\mathrm{eV}$$
Hyperfine spin flip of neutral H; maps HI and Galactic rotation. *(HS25 winter MC7)*

**Jeans criterion**  
$$\omega^2=c_s^2(k^2-k_J^2),\ k_J^2=\frac{4\pi G\rho_0}{c_s^2},\ M_J=\frac43\pi^{5/2}\left(\frac{k_BT}{Gm}\right)^{3/2}\rho_0^{-1/2}$$
λ > λ_J (M > M_J) collapses; smaller scales oscillate. *(Choudhuri (8.20)-(8.23))*

**Flux freezing**  
$$R_M=VL/\eta\gg1\Rightarrow B\ \text{moves with the plasma}$$
Collapse amplifies B ∝ R^{-2}. *(Choudhuri (8.27), (8.31))*

## Galaxies and dynamics

**Circular velocity**  
$$v_c^2=\frac{GM_r}{r}$$
Flat curve: M ∝ r, ρ ∝ r^{-2}. *(HS25 winter MC12)*

**Oort constants**  
$$v_R=Ad\sin2l,\ v_T=Ad\cos2l+Bd,\ v_c(R_0)=(A-B)R_0$$
A = 14.8, B = −12.4 km/s/kpc. *(Choudhuri (6.19)-(6.24))*

**Escape velocity, truncated flat halo**  
$$v_{esc}^2=2v_c^2(1+\ln(R/r))$$
Bound fastest star gives a lower limit on the halo size. *(HS25 practice Q6)*

**Relaxation time**  
$$T_{\rm rel}\approx\frac{v^3}{\pi nG^2m^2}\approx10^{10}\,\mathrm{yr}\frac{v_{\rm km/s}^3}{n_{\rm pc^{-3}}},\ \frac{T_{\rm rel}}{T_{\rm cross}}\approx N$$
Galaxies: 10^17 yr (collisionless). *(Choudhuri (7.11)-(7.14))*

**Collisionless Boltzmann**  
$$\partial_tf+\mathbf v\cdot\nabla f-\nabla\Phi\cdot\partial_{\mathbf v}f=0,\ \rho=m\int f\,d^3v$$
Jeans theorem: f(E, L) is a steady solution. *(Choudhuri (7.25))*

**Singular isothermal sphere**  
$$\rho=\frac{\sigma^2}{2\pi Gr^2},\ v_c^2=2\sigma^2$$
Flat rotation curve; ⟨v²⟩ independent of r. *(HS25 practice MC12)*

**Plummer sphere**  
$$\Phi=-\frac{GM}{\sqrt{r^2+a^2}},\ \rho=\frac{3M}{4\pi a^3}\left(1+\frac{r^2}{a^2}\right)^{-5/2}$$
From f ∝ (−E)^{7/2}. *(HS25 winter Q4)*

**Tidal disruption**  
$$a_{\rm tid}\simeq\frac{2GMr}{d^3},\ d_{\rm lim}=\left(\frac{2M}{m}\right)^{1/3}r$$
Satellite torn apart inside d_lim. *(HS24 summer Q6)*

**Virial velocity dispersion**  
$$\sigma_v^2=\frac{GM}{2r_H},\ \langle v^2\rangle=\frac{GM}{2\langle R\rangle}$$
Weighing clusters and galaxies. *(HS24 summer Q5, HS25 practice Q5)*

**Faber–Jackson and Tully–Fisher**  
$$\sigma\approx220(L/L_*)^{1/4}\,\mathrm{km/s},\ v_c\approx220(L/L_*)^{0.22}\,\mathrm{km/s}$$
Velocity → luminosity → distance. *(Choudhuri (9.4), (9.8))*

**Surface-brightness profiles**  
$$I=I_e\exp\{-7.67[(r/r_e)^{1/4}-1]\},\ I=I_0e^{-r/r_d}$$
Ellipticals (de Vaucouleurs) vs spiral disks. *(Choudhuri (9.2)-(9.3))*

## Radiation processes

**Synchrotron**  
$$\nu\sim\gamma^2\frac{eB}{2\pi m_e},\ N\propto E^{-p}\Rightarrow f\propto\nu^{-(p-1)/2}$$
Power law, polarised. *(Choudhuri (8.69))*

**Thermal bremsstrahlung**  
$$\epsilon_\nu\propto n_en_iT^{-1/2}e^{-h\nu/k_BT},\ \epsilon=1.4\times10^{-40}\sqrt Tn_en_iZ^2g$$
∝ n², cut-off at hν ~ kT. *(Choudhuri (8.70)-(8.71))*

**Cluster scaling**  
$$L_X\propto\int\rho_g^2T^{1/2}dV,\ T\propto M^{2/3},\ L_X\propto M^{4/3}$$
Virial + bremsstrahlung, M ∝ R³. *(HS25 winter Q5)*

**Variability size limit**  
$$R\lesssim c\Delta t,\ M\lesssim\frac{Rc^2}{2G}$$
Upper limit on the size and black-hole mass. *(HS24 winter Q6)*

**Superluminal motion**  
$$v_\perp=\frac{v\sin\theta}{1-\beta\cos\theta},\ v_{\perp,\max}=\gamma v$$
Light-travel-time effect. *(Choudhuri (9.21))*

## Cosmology

**Hubble law and redshift**  
$$v=H_0d,\ 1+z=\frac{a_0}{a}=\frac{\lambda_{\rm obs}}{\lambda_{\rm em}},\ \frac{1}{H_0}=\frac{977.8}{H_0[\mathrm{km/s/Mpc}]}\,\mathrm{Gyr}$$
v ≈ cz only for z ≪ 1. *(Choudhuri (10.22)-(10.24))*

**Friedmann equation**  
$$\left(\frac{\dot a}{a}\right)^2=\frac{8\pi G}{3}\rho-\frac{kc^2}{a^2}$$
Newtonian shell energy with 2E = −kc². *(Choudhuri (10.27))*

**Critical density, Ω, curvature**  
$$\rho_c=\frac{3H^2}{8\pi G}=1.88\times10^{-26}h^2\,\mathrm{kg\,m^{-3}},\ \frac{kc^2}{a^2H^2}=\Omega-1$$
Ω > 1 closed, = 1 flat, < 1 open. *(Choudhuri (10.29)-(10.31))*

**Equation of state**  
$$P=w\rho c^2\Rightarrow\rho\propto a^{-3(1+w)}$$
Matter w = 0 (a^{-3}), radiation 1/3 (a^{-4}), Λ −1 (const). *(Choudhuri (10.36)-(10.40))*

**Flat solutions**  
$$a\propto t^{2/(3(1+w))},\ \text{matter }t^{2/3},\ \text{rad. }t^{1/2},\ \Lambda:\ e^{Ht}$$
Age = α/H for a power law. *(HS24 summer Q7, HS25 practice Q7)*

**Closed matter universe**  
$$\frac{a}{a_0}=\frac{\Omega_0(1-\cos\eta)}{2(\Omega_0-1)},\ H_0t=\frac{\Omega_0(\eta-\sin\eta)}{2(\Omega_0-1)^{3/2}}$$
Turnaround η = π, crunch η = 2π; lifetime πΩ/(H0(Ω−1)^{3/2}). *(HS24 winter Q7)*

**Matter–radiation equality**  
$$1+z_{eq}=\frac{\rho_{M,0}}{\rho_{R,0}}\approx2.3\times10^4\Omega_Mh^2$$
ρ_R = 1.68 ρ_γ (photons + neutrinos). *(Choudhuri (10.47)-(10.52))*

## Early Universe

**Temperature–time relation**  
$$T\approx\frac{1.5\times10^{10}\,\mathrm K}{\sqrt{t/\mathrm s}},\ k_BT\approx\frac{1.3\,\mathrm{MeV}}{\sqrt{t/\mathrm s}},\ 1\,\mathrm{eV}=1.16\times10^4\,\mathrm K$$
Radiation era, photons only. *(Choudhuri (10.67)-(10.69))*

**Photon density and η**  
$$n_\gamma=\frac{2\zeta(3)}{\pi^2}\left(\frac{k_BT}{\hbar c}\right)^3=4.1\times10^8\,\mathrm{m^{-3}},\ \eta=\frac{n_B}{n_\gamma}\approx6\times10^{-10}$$
Constant ratio; sets when bound states survive. *(Choudhuri (11.9)-(11.19))*

**n/p freeze-out and helium**  
$$\frac{n_n}{n_p}=e^{-1.29/0.8}\approx0.2\to\tfrac17,\ Y=\frac{2(n/p)}{1+n/p}\approx0.25$$
Freeze-out at 0.8 MeV, neutron decay until ~3 min. *(Choudhuri (11.20)-(11.23))*

**Neutrino background**  
$$T_\nu=(4/11)^{1/3}T_\gamma=1.95\,\mathrm K,\ \rho_R=1.68\rho_\gamma$$
e± annihilation heats only photons. *(Choudhuri §11.4, (10.47))*

**Recombination**  
$$T_{\rm rec}\approx3000\,\mathrm K,\ z\approx1100,\ t\approx3.8\times10^5\,\mathrm{yr}$$
Last scattering; CMB δT/T ~ 1e-5. *(Choudhuri §11.7)*

**Flatness problem**  
$$|\Omega-1|=\frac{c^2}{\dot a^2}\propto t\ (\text{rad.}),\ \propto t^{2/3}\ (\text{matter})$$
Ω = 1 is unstable: inflation. *(Choudhuri (10.70))*

**Linear growth**  
$$\delta\propto a\ \text{(matter era)}$$
Baryons alone: 1e-5 × 1100 ≈ 0.01 today; needs dark matter. *(Choudhuri §11.9)*
