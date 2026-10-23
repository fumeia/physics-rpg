# Astro 02: stars, Eddington, virial theorem (Choudhuri 3.2-3.6, 7.2)
Sources: HS24 summer Q3, Q5, Q6, MC 5; HS25 winter MC 5, 6, 10.

- Hydrostatic equilibrium: $dP/dr=-GM_r\rho/r^2$ (slab argument: $-dP\,dA-\frac{GM_r\rho}{r^2}dA\,dr=0$).
- Radiation: $F=-\frac{c}{\alpha}\frac{dP}{dr}$, $\alpha=\chi\rho$. At the surface $L/(4\pi R^2)\cdot\chi\rho/c=GM\rho/R^2$ so $L_{Edd}=4\pi cGM/\chi$ (the exam has $\chi$ as opacity per mass; for electron scattering $\chi=\sigma_T/m_p=0.04$ m$^2$/kg). $\rho$ and $R$ cancel. $L_{Edd}\approx3.3\times10^4L_\odot(M/M_\odot)$. With $L\propto M^3$ this gives $M\lesssim180\,M_\odot$ (MC 6: upper mass limit is radiation pressure).
- Virial for $N$ equal masses: $K=\frac12M\sigma_v^2$, $V=-\frac{N(N-1)}{2}Gm^2\langle r^{-1}\rangle\simeq-GM^2/(2r_H)$ with $r_H^{-1}=\frac{2}{N(N-1)}\sum_{i>j}r_{ij}^{-1}$; $2K+V=0\Rightarrow\sigma_v^2=GM/(2r_H)$, so $\langle v^2\rangle\propto Nm/\langle R\rangle$ (MC 10, note the first printed option layout is garbled in the text extract: the correct answer is the one proportional to $Nm/R$).
- Tidal disruption: $a_{tid}=GM/d^2-GM/(d+r)^2\simeq2GMr/d^3$, set equal to $Gm/r^2$: $d=(2M/m)^{1/3}r$. MW ($10^{12}M_\odot$, 10 kpc) vs cD ($10^{14}$): $58.5$ kpc.
- Lifetime: 4x mass difference gives 16x lifetime (MC 5).

Checks: globular cluster $M=10^5M_\odot$, $r_H=5$ pc: $\sigma_v=6.56$ km/s, crossing time 0.75 Myr. $L_{Edd}(20M_\odot,\chi=0.04)=2.5\times10^{32}$ W.
