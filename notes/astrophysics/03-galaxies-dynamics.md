# Astro 03: galaxy dynamics (Choudhuri 6, 7, 9.5, 8.11)
Sources: HS25 winter Q4, Q5, MC 9, 12; HS24 summer Q4, MC 13.

- Flat rotation curve $v_c=$ const: $M_r=v_c^2r/G\propto r$, $\rho=v_c^2/(4\pi Gr^2)\propto r^{-2}$ (isothermal sphere). At 8 kpc, 220 km/s: $9.0\times10^{10}M_\odot$, $\rho=0.014M_\odot/\mathrm{pc}^3$.
- Collisionless: relaxation time ~$10^{15}$ yr for $N=10^{11}$, much longer than the age of the Universe (MC 9).
- Plummer sphere with $f=f_0(-\mathcal E)^{7/2}$: $\rho=4\pi m\int f\,v^2dv\propto(-\Phi)^5$ using $\int_0^1x^{1/2}(1-x)^{7/2}dx=7\pi/256$ (checked numerically). $\Phi=-GM/\sqrt{r^2+a^2}$ gives $v_c=\sqrt{GM}\,r/(r^2+a^2)^{3/4}$ and $\rho=\frac{3M}{4\pi a^3}(1+r^2/a^2)^{-5/2}$. $v_c$ peaks at $r=a/\sqrt2$.
- Bremsstrahlung cluster: $L_X\propto\int\rho_g^2T^{1/2}dV$; virial $T\propto M/R$; $M\propto R^3$ gives $T\propto M^{2/3}$ and $L_X\propto M^{4/3}$. (Careful: $\int_0^\infty e^{-h\nu/k_BT}d\nu=k_BT/h$ cancels the $T^{-1/2}$ down to $T^{1/2}$.)
- Extinction towards the bulge: $r(s)=\sqrt{d^2+s^2-2ds\cos b}$; Gaussian integral gives $A_V(b)=30\exp[(d^2/r_0^2)(\cos^2b-1)]$. At $b=15^\circ$, $r_0=1.2$ kpc: $A_V=1.53$, flux ratio 0.24.

## Official-key error: HS25 practice Q6(c)
The key gives $R>18$ kpc (correct: $8\,e^{(440/230)^2/2-1}=18.3$ kpc) and $M_{8\,\rm kpc}=9.8\times10^{10}M_\odot$ (correct), but then
prints $M>9.8\times10^{10}M_\odot\cdot\frac{18}{8}=9.8\times10^{11}M_\odot$. The product is $2.2\times10^{11}M_\odot$. The game uses $2.2\times10^{11}$.

## Other checks (game/test/content-check-astrophysics.mjs)
- HS24 winter Q4c: $k=v^2/G-M_0/r=2.81\times10^6-2\times10^6=8.1\times10^5\,M_\odot$/pc (key: $8.2\times10^5$, rounding).
- Oort: $v_c=(A-B)R_0=217.6$ km/s at 8 kpc, period 226 Myr, $dv_c/dR=-(A+B)=-2.4$ km/s/kpc.
- Relaxation (7.11) with $m=M_\odot$: galaxy ($v=100$, $n=0.1$) $1.7\times10^{17}$ yr; globular cluster ($v=10$, $n=10^3$) 17 Gyr.
