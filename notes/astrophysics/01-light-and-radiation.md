# Astro 01: light and radiation (Refregier, Choudhuri 1.3-1.4, 2.2-2.3)
Sources: HS25 winter Q1-Q3, MC 1-4, 11, 14; HS24 summer Q1-Q2, MC 4, 6. Constants table in every exam (SI): G, kB, h, c, mp, Msun, Rsun, pc, Jy, sigma_T.

## Formulas to have on the 4-page sheet
- Magnitudes: $m_1-m_2=-2.5\log_{10}(F_1/F_2)$, so $\Delta m=4\Rightarrow F_1/F_2=10^{1.6}\approx40$. Distance modulus $m-M=5\log_{10}(d/10\,\mathrm{pc})$. Parallax $d[\mathrm{pc}]=1/p['']$.
- Extinction: $A_V=m_{ext}-m_0$, flux ratio $F_{ext}/F_0=10^{-A_V/2.5}$.
- Specific intensity $I_\nu$ [W m$^{-2}$Hz$^{-1}$sr$^{-1}$] is conserved along a ray in vacuum (flux and solid angle both fall as $d^{-2}$). Flux density $F_\nu$ is W m$^{-2}$Hz$^{-1}$ (HS24 MC4 trap: the unit WITHOUT Hz is the bolometric flux). Optical depth $\tau=\int\alpha\,ds$, $\alpha=\chi\rho$: two clouds with $\rho D$ equal have equal $\tau$ (HS24 MC3).
- Planck: $B_\nu=\frac{2h\nu^3}{c^2}\frac{1}{e^{h\nu/k_BT}-1}$; $\partial B_\nu/\partial T=\frac{2h\nu^3}{c^2T}\frac{xe^x}{(e^x-1)^2}$, $x=h\nu/k_BT$; always positive. RJ for $x\ll1$: $B_\nu=2k_BT\nu^2/c^2$, valid for CMB below $k_BT/h=56.8$ GHz. Wien $\lambda_{max}T=2.898\times10^{-3}$ m K ($\nu_{max}\propto T$ is a different constant). Energy density $u=a_BT^4$.
- Main sequence (Refregier): $L\propto M^3$, $L\propto T_{eff}^6\Rightarrow T_{eff}\propto M^{1/2}$, lifetime $\tau\propto M/L\propto M^{-2}$.

## Checks done (game/test/content-check-astro.mjs)
- 1 arcmin: $d=2R_\odot/\theta=32$ AU; visible out to $d=1\,\mathrm{AU}\,10^{(7+26.8)/5}=5.8\times10^6$ AU $=28$ pc.
- 10 Msun: $T=5770\sqrt{10}=18246$ K, $\lambda_{max}=159$ nm vs 502 nm (Sun), bluer.
- SN Ia in M31: $m=5.12$, 225 times brighter than Proxima.
- CMB K-band bolometer: official key prints **2.5 pW**, but the key's own prefactor $3.83\times10^{-43}$ J s$^{-2}$ times $(27^3-18^3)\times10^{27}/3=4.62\times10^{30}$ gives **1.77 pW** (check: $\frac{2k_BT}{c^2}=8.37\times10^{-40}$, times $A\Omega=3\times1.523\times10^{-4}$ sr m$^2$). In the exam use your own correct arithmetic.
- 100 GHz, 0.05 MJy/sr: $x=1.76$, $(e^x-1)^2/(xe^x)=2.27$, $\delta T=210\,\mu$K (matches key).
- Dust vs CMB fluctuation at 100 GHz: ratio $1.77\times10^6\approx1.8\times10^6$; greybody needs $\tau_{353}<4.2\times10^{-6}$.
