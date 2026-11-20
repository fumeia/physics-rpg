"""Plain-words explanations of the reference steps of the solid-state sheets: EXPLAIN[(sheet, question)] = [html per part].
Shown under each revealed step as "Explain this step". They add the *why* (where a step comes from, what each symbol means,
the algebra in between) to the terse official solution; the results themselves are those of the official solution sets."""
EXPLAIN = {}

EXPLAIN[(4, 1)] = [
    # (a)
    """<p><b>Where the equation comes from.</b> Newton's second law for one atom of plane $n$: mass times acceleration equals the
    total spring force. The plane $s$ steps to the right pulls with $C_s(u_{n+s}-u_n)$ (it only pulls if the two planes are displaced
    <i>differently</i>), the one $s$ steps to the left with $C_s(u_{n-s}-u_n)$. So $M\\ddot u_n=\\sum_sC_s(u_{n+s}+u_{n-s}-2u_n)$.</p>
    <p><b>Why the ansatz $u_n=Ae^{i(nka-\\omega t)}$.</b> Every plane is identical, so the chain looks the same after a shift by $a$.
    For such a system the solutions are plane waves, exactly like $e^{i(kx-\\omega t)}$ for a string; the only difference is that the
    wave is only "looked at" at the positions $x_n=na$ of the planes.</p>
    <p><b>The algebra.</b> Insert it: $\\ddot u_n=-\\omega^2u_n$ and $u_{n\\pm s}=e^{\\pm iska}\\,u_n$ (moving $s$ planes along multiplies by
    the phase $e^{\\pm iska}$). Every term is proportional to $u_n$; divide by it:
    $$-M\\omega^2=\\sum_sC_s\\left(e^{iska}+e^{-iska}-2\\right)=\\sum_sC_s\\,(2\\cos ska-2).$$
    The plane index $n$ dropped out: that is why the ansatz works for all planes at once. Finally $1-\\cos\\theta=2\\sin^2(\\theta/2)$
    gives the $\\sin^2$ form.</p>""",
    # (b)
    """<p><b>Nearest neighbours only</b> means keep $s=1$: $\\omega^2=\\frac{4C}{M}\\sin^2\\frac{ka}2$.</p>
    <p><b>Small $k$.</b> $\\sin x\\approx x$, so $\\omega\\approx\\sqrt{C/M}\\,a|k|$: a straight line. A straight line $\\omega=ck$ is an
    ordinary sound wave, and its slope $c=d\\omega/dk$ is the speed of sound.</p>
    <p><b>Zone boundary $k=\\pi/a$.</b> Then $e^{in\\pi}=(-1)^n$: neighbouring planes move exactly opposite. The slope
    $d\\omega/dk=a\\sqrt{C/M}\\cos(ka/2)$ is zero there, so the group velocity is zero: no energy moves, it is a standing wave (in Bragg
    language: the wave is reflected back and forth by the lattice).</p>
    <p><b>Allowed $k$.</b> $u_0=u_N$ means $e^{iNka}=1$, i.e. $Nka=2\\pi p$ with integer $p$.</p>
    <p><b>Why nothing new above $\\pi/a$.</b> Only the positions $x_n=na$ exist. For $k'=k+2\\pi/a$:
    $e^{ink'a}=e^{inka}\\,e^{i2\\pi n}=e^{inka}$, because $n$ is an integer. The atoms do exactly the same thing, so $k$ and $k'$ are the
    same vibration (like a wagon wheel in a film that seems to turn slowly backwards). All different motions are already in
    $-\\pi/a<k\\le\\pi/a$.</p>
    <p><b>Counting.</b> In that range $p$ takes exactly $N$ values: $N$ modes for $N$ planes, one per degree of freedom, as it must be.
    For the sketch: the same sine curve, but only $N$ dots on it.</p>""",
    # (c)
    """<p><b>The idea.</b> Look at the result of (a) with $x=ka$:
    $$\\omega^2(k)=\\sum_s\\frac{2C_s}{M}-\\sum_s\\frac{2C_s}{M}\\cos(s\\,ka).$$
    This <i>is</i> a Fourier series in the variable $ka$: a constant plus $\\cos(ka)$, $\\cos(2ka)$, … , and the coefficient of
    $\\cos(s\\,ka)$ is $-2C_s/M$. So if you measure $\\omega(k)$ (e.g. by neutron scattering), the force constants are simply its
    Fourier coefficients. The rest is the usual recipe for picking out one coefficient.</p>
    <p><b>It is your $e^{-inx}$ recipe.</b> You know: $f(x)=\\sum_nc_ne^{inx}$ with $c_n=\\frac1{2\\pi}\\int_{-\\pi}^{\\pi}f(x)e^{-inx}dx$.
    Here $x=ka$, so $dx=a\\,dk$ and $x\\in[-\\pi,\\pi]$ is $k$ in the first Brillouin zone $[-\\pi/a,\\pi/a]$. Now write
    $e^{-inka}=\\cos(nka)-i\\sin(nka)$. The function $\\omega^2(k)$ is <i>even</i> ($\\omega^2(-k)=\\omega^2(k)$: a wave to the left has the
    same frequency as one to the right), and $\\sin(nka)$ is odd, so their product is odd and integrates to zero over the symmetric
    zone. Multiplying by $e^{-inka}$ and multiplying by $\\cos(nka)$ therefore give the <i>same</i> integral: the cosine is the familiar
    recipe with the part that vanishes anyway left out. Nothing comes "out of the blue".</p>
    <p><b>The integral.</b> For $n,s\\ge1$ the cosines are orthogonal on the zone:
    $\\int_{-\\pi/a}^{\\pi/a}\\cos(ska)\\cos(nka)\\,dk=\\frac{\\pi}{a}\\delta_{sn}$, and $\\int_{-\\pi/a}^{\\pi/a}\\cos(nka)\\,dk=0$ (so the constant
    term drops out). Hence
    $$\\int_{-\\pi/a}^{\\pi/a}\\omega^2(k)\\cos(nka)\\,dk=-\\sum_s\\frac{2C_s}{M}\\frac{\\pi}{a}\\delta_{sn}=-\\frac{2\\pi C_n}{Ma}
    \\quad\\Rightarrow\\quad C_n=-\\frac{Ma}{2\\pi}\\int_{-\\pi/a}^{\\pi/a}\\omega^2(k)\\cos(nka)\\,dk .$$</p>
    <p><b>Check with exponentials.</b> Write $\\cos(ska)=\\frac12(e^{iska}+e^{-iska})$: the coefficient of $e^{inka}$ in $\\omega^2$ is
    $c_n=-C_n/M$, and $c_n=\\frac{a}{2\\pi}\\int\\omega^2e^{-inka}dk$ gives the same $C_n$.</p>""",
    # (d)
    """<p><b>Long wavelength</b> means the wave changes little from one plane to the next: $ka\\ll1$ (also for the further neighbours,
    $ska\\ll1$). Then the Taylor expansion $\\cos y\\approx1-y^2/2$ is enough, and (a) gives
    $\\omega^2=\\sum_s\\frac{2C_s}M\\cdot\\frac{(ska)^2}{2}=k^2\\,\\frac{a^2}{M}\\sum_sC_ss^2$. So $\\omega=ck$: frequency proportional to $k$, no
    dispersion.</p>
    <p><b>Why that is the wave equation.</b> Put a plane wave into $\\frac1{c^2}\\partial_t^2u=\\partial_x^2u$: the left side gives
    $-\\frac{\\omega^2}{c^2}u$, the right side $-k^2u$. They are equal exactly when $\\omega=ck$. The lattice behaves like a continuous
    elastic medium as soon as the wavelength is much longer than the plane spacing.</p>
    <p><b>The same thing directly.</b> Think of $u_n$ as a smooth field $u(x)$ at $x=na$. Taylor: $u_{n+s}+u_{n-s}-2u_n\\approx(sa)^2\\partial_x^2u$
    (the first-derivative terms cancel between $+s$ and $-s$). So $M\\partial_t^2u=\\left(a^2\\sum_sC_ss^2\\right)\\partial_x^2u$.</p>
    <p><b>Elastic modulus.</b> A continuous rod obeys $\\rho\\,\\partial_t^2u=E\\,\\partial_x^2u$, so $c^2=E/\\rho$ and $E=\\rho c^2$: the stiffness
    of the material is fixed by the springs between the planes.</p>""",
    # (e)
    """<p><b>Formula.</b> Nearest neighbours only: $c^2=\\frac{a^2C_1}{M}$ from (d), so $C_1=\\frac{Mc^2}{a^2}$.</p>
    <p><b>Which $a$ and which $M$.</b> The model needs identical planes repeating with spacing $a$. Along [100] in zincblende the
    atomic layers alternate Ga, As, Ga, As at $d/4$; the pattern repeats after a Ga layer plus an As layer, i.e. after $d/2$. So one
    "plane" of the model is a Ga+As pair: $a=d/2=2.825$ Å and $M=m_{\\rm Ga}+m_{\\rm As}=(69.72+74.92)\\,u=144.6\\,u=2.40\\times10^{-25}$ kg.</p>
    <p><b>Units.</b> $c=4.73\\times10^5$ cm/s $=4730$ m/s. Then $C_1=\\frac{2.40\\times10^{-25}\\,\\mathrm{kg}\\cdot(4730\\,\\mathrm{m/s})^2}{(2.825\\times10^{-10}\\,\\mathrm{m})^2}\\approx67$ N/m,
    a typical bond stiffness (tens of N/m).</p>""",
]

# ---------------------------------------------------------------- sheet 1
EXPLAIN[(1, 1)] = [
    r"""<p><b>Why this construction.</b> A rotation axis through one lattice point is an axis through <i>every</i> lattice point (all
    points are equivalent). So we may rotate about $A$ and also about $B$, and every rotated lattice point must again be a lattice point.</p>
    <p><b>Coordinates.</b> Put $A$ at the origin, $B=(a,0)$. Rotating $B$ about $A$ by $\phi$ gives $D=(a\cos\phi,a\sin\phi)$; rotating
    $A$ about $B$ by $-\phi$ gives $C=(a-a\cos\phi,a\sin\phi)$. Both have the same height $a\sin\phi$, so $\vec{DC}$ is horizontal,
    parallel to $\vec{AB}$, with length $x_C-x_D=a-2a\cos\phi$.</p>""",
    r"""<p><b>The key argument.</b> $C$ and $D$ are lattice points on a line parallel to $\vec{AB}$. Along that direction the lattice repeats
    with period $a$ (we chose $a$ as the shortest distance), so two lattice points on such a line are an <i>integer</i> number of periods
    apart: $(1-2\cos\phi)a=ma$.</p>
    <p><b>Solve for $\cos\phi$:</b> $\cos\phi=\frac{1-m}{2}$. Since $-1\le\cos\phi\le1$, only $m=-1,0,1,2,3$ are possible, giving
    $\cos\phi=1,\frac12,0,-\frac12,-1$.</p>""",
    r"""<p>$\cos\phi=1,\frac12,0,-\frac12,-1$ means $\phi=360^\circ,60^\circ,90^\circ,120^\circ,180^\circ$, i.e. $n=2\pi/\phi=1,6,4,3,2$. A
    5-fold axis would need $\cos72^\circ=0.309$, which is not of the form $\frac{1-m}{2}$: a pentagon pattern cannot tile the plane
    periodically.</p>""",
]
EXPLAIN[(1, 2)] = [
    r"""<p><b>What "primitive" means.</b> The lattice is the set of translations that map the whole crystal onto itself. Here a filled
    circle must land on a filled one, so the lattice is the square grid of filled circles (spacing $a$). A primitive cell contains
    exactly one lattice point; since every lattice point carries one filled and one empty atom (the basis), each primitive cell holds
    one of each. Many shapes do this; the Wigner–Seitz cell is the special one built from all points closer to one lattice point than
    to any other.</p>""",
    r"""<p><b>Area.</b> All primitive cells of a lattice have the same area: one square of side $a$, $A=a^2$.</p>
    <p><b>Identical atoms.</b> Now the shift to the square centre (length $a/\sqrt2$, diagonal direction) also maps the crystal onto itself:
    there are more lattice translations, the lattice is denser, and its cell is smaller. The new lattice is a square lattice of spacing
    $a/\sqrt2$, rotated by $45^\circ$: area $a^2/2$, one atom per cell.</p>""",
    r"""<p><b>Lattice vectors</b> are the two shortest independent translations of the lattice; the <b>basis</b> lists the atoms in one cell in
    fractions of them. Different kinds: $a\hat x$, $a\hat y$, basis = filled atom at $(0,0)$, empty one at $(\frac12,\frac12)$. Identical: the
    diagonal half-steps are now lattice vectors, so the cell contains a single atom.</p>""",
    r"""<p><b>3D, different atoms.</b> The translation by $(\frac12,\frac12,\frac12)a$ would carry a corner atom onto the centre atom, which is a
    different kind: not a symmetry. Only the cube edges are lattice translations, so the lattice is simple cubic with a two-atom basis
    (like CsCl).</p>
    <p><b>3D, identical atoms.</b> Now that half-diagonal shift is a symmetry, and adding it to the simple cubic translations gives the BCC
    lattice with one atom per lattice point. Rule to remember: the lattice is decided by which shifts map the crystal onto itself, not by
    where the atoms happen to sit.</p>""",
]
EXPLAIN[(1, 3)] = [
    r"""<p><b>How $\vec g_1$ is built.</b> $\vec a_2\times\vec a_3$ is perpendicular to both $\vec a_2$ and $\vec a_3$, so $\vec g_1\cdot\vec a_2=\vec g_1\cdot\vec a_3=0$
    automatically. The denominator $\vec a_1\cdot(\vec a_2\times\vec a_3)$ (the cell volume) is chosen so that $\vec g_1\cdot\vec a_1=2\pi$
    exactly. That is all $\vec g_i\cdot\vec a_l=2\pi\delta_{il}$ says.</p>
    <p><b>The $\epsilon$ notation</b> is just a compact way to write the three cyclic formulas at once; the vanishing for $i\ne l$ is the
    statement "a triple product with a repeated vector is zero".</p>""",
    r"""<p><b>Why $e^{i\vec G\cdot\vec R}=1$ is the definition.</b> With $\vec R=n_i\vec a_i$, $\vec G=m_i\vec g_i$ and (a):
    $\vec G\cdot\vec R=2\pi\sum_in_im_i$, an integer times $2\pi$. The reciprocal lattice is exactly the set of wave vectors whose plane
    waves look the same at every lattice point.</p>
    <p><b>The argument.</b> Apply the same definition again, starting from the $\vec G$'s. Every $\vec R$ works (the condition is symmetric in
    $\vec R$ and $\vec G$). And nothing else works: for a point with a non-integer coordinate $x_i$, the test vector $\vec g_i$ gives
    the phase $2\pi x_i$, not a multiple of $2\pi$. So we get back exactly the original lattice.</p>""",
    r"""<p><b>The trick.</b> Write $\vec g_1$ out: $\vec g_1\cdot(\vec g_2\times\vec g_3)=\frac{2\pi}{V}(\vec a_2\times\vec a_3)\cdot(\vec g_2\times\vec g_3)$.
    A dot product of two cross products is evaluated with the Lagrange identity, and every $\vec a\cdot\vec g$ in it is either $2\pi$ or
    $0$: $(\vec a_2\cdot\vec g_2)(\vec a_3\cdot\vec g_3)-(\vec a_3\cdot\vec g_2)(\vec a_2\cdot\vec g_3)=(2\pi)^2$. Together: $(2\pi)^3/V$.</p>
    <p><b>Meaning.</b> Big real-space cell, small reciprocal cell: the same "large in $x$, small in $k$" as for Fourier transforms.</p>""",
]
# ---------------------------------------------------------------- sheet 2
EXPLAIN[(2, 1)] = [
    r"""<p><b>Why these vectors.</b> In BCC every corner and every body centre is a lattice point. The vectors from a corner to the centres of
    three neighbouring cubes, $\frac a2(\pm1,\pm1,\pm1)$ with one sign flipped, are three short independent lattice vectors, and every
    lattice point (corners included: $\mathbf a_2+\mathbf a_3=a\hat x$) is an integer combination of them.</p>
    <p><b>Volume check without computing.</b> The cube $a^3$ contains $8\cdot\frac18+1=2$ lattice points, so one primitive cell (one point)
    has $a^3/2$.</p>""",
    r"""<p><b>The calculation.</b> $\mathbf a_2\times\mathbf a_3=\frac{a^2}{4}(1,-1,1)\times(1,1,-1)=\frac{a^2}{4}(0,2,2)=\frac{a^2}{2}(0,1,1)$. Divide by the
    volume $a^3/2$ and multiply by $2\pi$: $\mathbf b_1=\frac{2\pi}{a}(0,1,1)$. The others follow by cycling. The check $\mathbf a_i\cdot\mathbf b_j=2\pi\delta_{ij}$
    is the quickest way to catch a sign error.</p>""",
    r"""<p><b>Recognise the shape.</b> $(0,1,1)$, $(1,0,1)$, $(1,1,0)$ in units of $2\pi/a$ point from a cube corner to face centres of a cube
    of edge $2\cdot\frac{2\pi}{a}=\frac{4\pi}{a}$. "Corner to face centres" are exactly the primitive vectors of FCC. So the reciprocal of BCC
    is FCC, conventional cube $(4\pi/a)^3$.</p>""",
    r"""<p><b>Brillouin zone = Wigner–Seitz cell in $k$-space:</b> the region closer to $\mathbf k=0$ than to any other reciprocal lattice point.
    Its faces are the perpendicular bisector planes to the nearest neighbours. In FCC each point has 12 nearest neighbours, so 12
    faces: the rhombic dodecahedron. Its volume is that of a primitive cell, $(2\pi)^3/V_{\rm real}=(2\pi)^3/(a^3/2)$ (sheet 1 Q3).</p>""",
    r"""<p><b>No new calculation needed.</b> If the reciprocal of BCC is FCC, then the reciprocal of that FCC is BCC again (reciprocal of the
    reciprocal = original). So FCC (edge $a$) ↔ BCC (edge $4\pi/a$). Its zone: the BCC point has 8 nearest neighbours (hexagonal faces) and 6
    next-nearest ones close enough to cut the corners (square faces): the truncated octahedron.</p>""",
]
EXPLAIN[(2, 2)] = [
    r"""<p><b>Miller indices in one sentence:</b> the plane $(hkl)$ cuts the three axes at $\mathbf a_1/h$, $\mathbf a_2/k$, $\mathbf a_3/l$.
    Differences of these intercepts lie in the plane, which gives two in-plane vectors. A direction is perpendicular to the plane exactly
    when it is perpendicular to both.</p>
    <p><b>The dot product.</b> $(h\mathbf a_1+k\mathbf a_2+l\mathbf a_3)\cdot(\mathbf a_1/h-\mathbf a_2/k)=|\mathbf a_1|^2-|\mathbf a_2|^2$ for orthogonal axes:
    zero only if the axes are equally long, which is the cubic case.</p>""",
    r"""<p>Same computation, but now $|\mathbf a_1|\ne|\mathbf a_2|$: the dot product does not vanish. The general rule uses the reciprocal
    vectors instead (sheet 8 Q1): they are built to be perpendicular to planes, and only for cubic axes do they point along the same
    $[hkl]$.</p>""",
    r"""<p><b>Distance between parallel planes</b> = component of any vector connecting them along the unit normal. The plane through the
    origin and the neighbouring plane through the intercept $a\hat x/h$: project that point on $\hat n$ (which in the cubic case is
    $[hkl]$ normalised): $\frac{a}{h}\cdot\frac{h}{\sqrt{h^2+k^2+l^2}}$.</p>""",
]
EXPLAIN[(2, 3)] = [
    r"""<p><b>Reciprocal of a rectangle.</b> For orthogonal axes the formula simply gives $\mathbf b_i=\frac{2\pi}{d_i}\hat e_i$. Long in real space,
    short in $k$-space: the long side $d_1$ becomes the short spacing $13.4$ nm$^{-1}$.</p>""",
    r"""<p><b>Elastic</b> scattering: the X-ray loses no energy, $\hbar ck=\hbar ck'$, so $|\mathbf k|=|\mathbf k'|=2\pi/\lambda$. With $\lambda=0.166$ nm:
    $2\pi/0.166=37.9$ nm$^{-1}$. Only the direction changes.</p>""",
    r"""<p><b>Laue condition</b> $\mathbf k'-\mathbf k=\mathbf G$: the change of wave vector must be a reciprocal lattice vector (then the waves
    scattered from all lattice points are in phase). Two sides of equal length $|\mathbf k|=|\mathbf k'|$ and the third side $\mathbf G$: an
    isosceles triangle. For the (210) plane: intercepts at $\mathbf a_1/2$ and $\mathbf a_2/1$, and $\mathbf G_{210}=2\mathbf b_1+\mathbf b_2$ is perpendicular to
    it, as reciprocal vectors always are to their planes.</p>""",
    r"""<p><b>From the triangle to Bragg.</b> In the isosceles triangle with apex angle $2\theta$: $|\mathbf G|=2k\sin\theta$. With $|\mathbf G|=2\pi/d$
    and $k=2\pi/\lambda$ this is $2d\sin\theta=\lambda$. Small $|\mathbf G|$ means small angle, so the peaks come in order of increasing
    $|\mathbf G|$.</p>
    <p><b>Missing peaks</b> come from the basis (atoms in the cell scattering in antiphase). With one atom per cell nothing cancels: every
    $\mathbf G$ gives a peak.</p>""",
]
# ---------------------------------------------------------------- sheet 3
EXPLAIN[(3, 1)] = [
    r"""<p><b>What $F$ is.</b> Each atom in the cell sends out a wave with phase $e^{i\mathbf q\cdot\mathbf r_j}$; $F$ adds them up. The peaks sit at
    $\mathbf q$ in the reciprocal lattice of the cube we chose, $\mathbf q=\frac{2\pi}{a}(h,k,l)$.</p>
    <p><b>The phase of the centre atom:</b> $\mathbf q\cdot\mathbf r_1=\frac{2\pi}{a}\frac a2(h+k+l)=\pi(h+k+l)$, so $F=f\,(1+e^{i\pi(h+k+l)})=f\,(1+(-1)^{h+k+l})$.</p>""",
    r"""<p>$(-1)^{h+k+l}=+1$ or $-1$: the two waves add ($F=2f$) or cancel ($F=0$).</p>
    <p><b>Why some cancel.</b> We described BCC with a cube that is twice too big (two lattice points). Its "reciprocal lattice" has too many
    points; the structure factor removes the fake ones. Picture: for odd $h+k+l$ the body-centre atoms form planes exactly halfway between
    the corner-atom planes and scatter with a half-wavelength path difference.</p>""",
    r"""<p>With two different form factors the cancellation is incomplete: $f_1+f_2$ or $f_1-f_2$. The "forbidden" peaks come back, weak,
    because now the cube really is the primitive cell (simple cubic with a two-atom basis, CsCl).</p>""",
    r"""<p><b>Indexing a powder pattern.</b> Bragg + cubic spacing: $\sin^2\theta=\frac{\lambda^2}{4a^2}(h^2+k^2+l^2)$, so the peaks are ordered by
    $h^2+k^2+l^2$. Simple cubic allows 1, 2, 3, 4, 5, …; BCC only even $h+k+l$: 2, 4, 6, 8, 10, … i.e. (110), (200), (211), (220), (310).
    The ratios 1:2:3:4:5 are the same for both, so the ratio test cannot tell them apart; knowing the structure does.</p>""",
    r"""<p><b>Read off one peak, use Bragg.</b> $2\theta\approx64^\circ$ is the (200) peak (second BCC peak), so $\theta=32^\circ$ and
    $d_{200}=\lambda/(2\sin\theta)=1.45$ Å. For a cube $d_{hkl}=a/\sqrt{h^2+k^2+l^2}$ (sheet 2 Q2), so $a=2d_{200}=2.9$ Å.</p>""",
]
EXPLAIN[(3, 2)] = [
    r"""<p><b>Reading the formula.</b> The $r^{-12}$ term (Pauli repulsion of overlapping shells) wins at small $r$, the $-r^{-6}$ term (van
    der Waals attraction) at large $r$. $U(\sigma)=0$ because the bracket is $1-1$. The force is $F=-dU/dr$: where $U$ decreases with $r$ the
    force pushes outward (repulsive), where $U$ increases it pulls inward.</p>""",
    r"""<p><b>Minimum: set $dU/dr=0$.</b> $\frac{d}{dr}(\sigma/r)^{12}=-\frac{12}{r}(\sigma/r)^{12}$ and similarly for the 6. Dividing by
    $\frac{6}{r_0}(\sigma/r_0)^6$ leaves $-2(\sigma/r_0)^6+1=0$. Insert $(\sigma/r_0)^6=\frac12$ and $(\sigma/r_0)^{12}=\frac14$ into $U$:
    $4\epsilon(\frac14-\frac12)=-\epsilon$. So $\epsilon$ is the bond energy and $\sigma$ sets the size.</p>""",
    r"""<p><b>Why a Taylor expansion.</b> Near any minimum a potential looks like a parabola: $U(r_0)+U'(r_0)(r-r_0)+\frac12U''(r_0)(r-r_0)^2$,
    and $U'(r_0)=0$. A parabola is a spring, with spring constant $\kappa=U''(r_0)$.</p>
    <p><b>The second derivative:</b> $\frac{d^2}{dr^2}r^{-12}=156\,r^{-14}$, $\frac{d^2}{dr^2}r^{-6}=42\,r^{-8}$. At $r_0$: $156\cdot\frac14=39$ and
    $42\cdot\frac12=21$, so $\kappa=\frac{4\epsilon}{r_0^2}\cdot18=\frac{72\epsilon}{r_0^2}$ with $r_0^2=2^{1/3}\sigma^2$.</p>""",
]
EXPLAIN[(3, 3)] = [
    r"""<p><b>Away from the delta</b> the potential is zero, and a bound state has $E<0$: $\psi''=\kappa^2\psi$, solutions $e^{\pm\kappa x}$. Keeping
    the ones that decay on each side gives $e^{-\kappa|x-x_1|}$.</p>
    <p><b>At the delta</b> integrate the Schrödinger equation over a tiny interval around $x_1$: $\int\psi''=\psi'(x_1^+)-\psi'(x_1^-)$, $\int E\psi\to0$,
    and the delta gives $-V_0\psi(x_1)$. So the slope jumps: $-2\kappa\psi(x_1)=-\frac{2mV_0}{\hbar^2}\psi(x_1)$, i.e. $\kappa=mV_0/\hbar^2$, and
    $E=-\hbar^2\kappa^2/2m$. Normalisation: $\int e^{-2\kappa|x|}dx=1/\kappa$, hence the $\sqrt\kappa$.</p>""",
    r"""<p><b>Split $\hat H$ cleverly.</b> $\hat H=\hat K+\hat V_1+\hat V_2=\hat H_1+\hat V_2$, and $\hat H_1|1\rangle=\epsilon_0|1\rangle$. So
    $\langle1|\hat H|1\rangle=\epsilon_0+\langle1|\hat V_2|1\rangle$: the atomic energy plus the pull of the <i>other</i> well on orbital 1.
    A delta potential just samples the wave function: $\langle1|\hat V_2|1\rangle=-V_0\psi_1(x_2)^2=-V_0\kappa e^{-2\kappa|x_2-x_1|}$.</p>
    <p><b>Hopping</b> the same way with $\hat H=\hat H_2+\hat V_1$ acting on $|2\rangle$: $\epsilon_0\langle1|2\rangle$ (zero by assumption) plus
    $\langle1|\hat V_1|2\rangle=-V_0\psi_1(x_1)\psi_2(x_1)$. It shrinks like $e^{-\kappa\cdot\text{distance}}$: the overlap of the two tails.</p>""",
    r"""<p><b>A 2×2 matrix with equal diagonal $A$ and off-diagonal $B$</b> always has eigenvalues $A\pm B$ with eigenvectors $(1,\pm1)/\sqrt2$.
    Here $A=-V_0\kappa(\frac12+\alpha^2)$, $B=-V_0\kappa\alpha$.</p>
    <p><b>Which is bonding?</b> $B<0$, so $A+B$ is the lower energy: the symmetric combination (no node between the atoms, electron density
    piled up between them) is bonding; the antisymmetric one is antibonding. Their splitting is $2|B|=2t$: the more the orbitals overlap,
    the stronger the bond.</p>""",
]
# ---------------------------------------------------------------- sheet 4 (Q2, Q3)
EXPLAIN[(4, 2)] = [
    r"""<p><b>Counting oscillators.</b> $N$ cells with one atom each, 3 directions: $3N$ modes, all at $\omega_E$ in this model (that is what
    $Z(\omega)=3N\delta(\omega-\omega_E)$ says). Each is a quantum oscillator with energy $\hbar\omega(n+\frac12)$, and at temperature $T$ its
    mean occupation is the Bose–Einstein number $n=1/(e^{\hbar\omega/kT}-1)$. Multiply: $3N$ times the mean energy of one.</p>""",
    r"""<p><b>The derivative.</b> Only the occupation depends on $T$. With $x=\hbar\omega_E/kT$: $\frac{d}{dT}\frac1{e^x-1}=\frac{e^x}{(e^x-1)^2}\cdot\frac{x}{T}$
    (chain rule, $dx/dT=-x/T$). Multiplying by $3N\hbar\omega_E=3NkTx$ gives $3Nk\,\frac{x^2e^x}{(e^x-1)^2}$.</p>""",
    r"""<p><b>High $T$</b> ($x\to0$): $e^x-1\approx x$, so the fraction $\to1$ and each mode gives $k$: the classical equipartition value
    (Dulong–Petit, $3k$ per atom).</p>
    <p><b>Low $T$</b> ($x\gg1$): the fraction $\approx x^2e^{-x}$. To excite an oscillator you need the whole quantum $\hbar\omega_E$, and the
    Boltzmann factor for that is $e^{-\hbar\omega_E/kT}$: exponentially rare. Real crystals fall off only like $T^3$ because acoustic phonons
    have arbitrarily small energies (Debye).</p>""",
]
EXPLAIN[(4, 3)] = [
    r"""<p>Each atom sits in a harmonic well of the same stiffness $k$, so it oscillates at $\omega=\sqrt{k/m}$: the lighter isotope is faster.
    The ratio $\sqrt{7/6}$ does not need $k$.</p>""",
    r"""<p><b>Same logic as Q2</b>, done separately for the two populations: each atom is three oscillators (x, y, z), each with mean
    energy $\hbar\omega(n+\frac12)$. The total is the number of $^6$Li atoms times their energy plus the same for $^7$Li ($7.5\%$ and $92.5\%$
    of $N$).</p>""",
    r"""<p><b>Heat capacity</b> is the sum of two Einstein curves weighted by abundance. Each freezes out below its own Einstein temperature
    $\hbar\omega/k_B$. The higher frequency ($^6$Li) freezes first on cooling; only when you are also below the lower one ($^7$Li) are nearly
    all atoms in the ground state.</p>""",
]
# ---------------------------------------------------------------- sheet 5
EXPLAIN[(5, 1)] = [
    r"""<p><b>Debye's simplification:</b> take the straight-line start of the acoustic branches, $\omega=v_s k$, and pretend it holds for every
    $k$ up to a cutoff. It is exact at low $k$ (sound waves), which is all that matters at low temperature.</p>""",
    r"""<p><b>Periodic boundary conditions</b> $e^{ikL}=1$ allow $k=2\pi m/L$: allowed points spaced $2\pi/L$. One point per $2\pi/L$ in each
    direction gives densities $(L/2\pi)^d$ in $d$ dimensions.</p>""",
    r"""<p><b>Counting states = volume in $k$-space × density of points.</b> All states with $\omega<\omega_0$ lie within $|k|<k_0$: in 1D the
    two intervals $\pm k$ (length $2k_0$), in 2D a disc (rings of area $2\pi k\,dk$), in 3D a ball (shells $4\pi k^2dk$). Multiply by the
    number of polarisations $p_d$.</p>""",
    r"""<p><b>Density of states</b> $g(\omega)$ is "states per frequency interval": write the integrand in terms of $\omega$ with
    $k=\omega/v_s$, $dk=d\omega/v_s$, and read off what multiplies $d\omega$. Ring/shell area grows like $k^{d-1}$, hence $g\propto\omega^{d-1}$.</p>""",
]
EXPLAIN[(5, 2)] = [
    r"""<p><b>Recipe for any thermal energy:</b> sum over modes of (energy of a quantum) × (mean occupation + ½). In 2D the modes in a ring
    of radius $k$ number $p_2\frac{L^2}{(2\pi)^2}2\pi k\,dk$, each with energy $\hbar vk$.</p>
    <p><b>Why substitute $x=\beta\hbar vk$:</b> it makes the integrand dimensionless and moves all the $T$ dependence into the prefactor
    ($k=x/\beta\hbar v$, so $k^2dk\propto T^3$) and into the upper limit $x_D$.</p>""",
    r"""<p><b>High $T$:</b> every mode is classical, $n\approx k_BT/\hbar\omega$, so each mode carries $k_BT$ whatever its frequency. Energy
    = (number of modes)·$k_BT$ and $C$ = (number of modes)·$k_B$. In 2D there are 2 polarisations per atom, hence $2k_B$ per atom.</p>""",
    r"""<p><b>Low $T$:</b> modes with $\hbar\omega\gg k_BT$ are empty, so it does not matter where the cutoff is: send $x_D\to\infty$ and the
    integral becomes a pure number. Then $E-E_0\propto T^3$ (from the prefactor) and $C=dE/dT\propto T^2$. General rule: $C\propto T^d$.</p>""",
]
EXPLAIN[(5, 3)] = [
    r"""<p>Same recipe as Q2 but the frequency depends on the direction, so we cannot use spherical shells directly: write the sum over all
    $k$-points as $(L/2\pi)^3\int d^3k$.</p>""",
    r"""<p><b>The substitution stretches $k$-space</b> so that the surfaces of equal $\omega$ (ellipsoids) become spheres: with $\kappa_i=v_ik_i$,
    $\omega=|\boldsymbol\kappa|$. Changing variables multiplies the volume element by the Jacobian $1/(v_xv_yv_z)$. After that it is the isotropic
    integral with shells $4\pi\kappa^2d\kappa$.</p>""",
    r"""<p><b>Low $T$:</b> send the cutoff to infinity as before; the integral is the pure number $\pi^4/15$ and $E\propto T^4$, $C\propto T^3$.
    The anisotropy only changes the prefactor: $1/v^3$ is replaced by the geometric mean $1/(v_xv_yv_z)$.</p>""",
]
EXPLAIN[(5, 4)] = [
    r"""<p><b>Why an average.</b> The X-ray sees each atom at a slightly shifted position $\vec r_i+\vec u$; over the measurement $\vec u$ jiggles,
    so we average the phase factor.</p>
    <p><b>The expansion.</b> $e^{iy}\approx1+iy-\frac{y^2}{2}$ with $y=\vec G\cdot\vec u$. The linear term averages to zero (the atom is equally often
    displaced forwards and backwards). For the square, $\vec G\cdot\vec u=|\vec G||\vec u|\cos\Theta$ and the direction of $\vec u$ is random,
    so we average $\cos^2\Theta$ over a sphere: $\frac13$ (in 3D each of $x,y,z$ gets a third of $u^2$). Then $1-\frac16G^2\overline{u^2}\approx e^{-G^2\overline{u^2}/6}$,
    and the intensity is the square: $e^{-G^2\overline{u^2}/3}$.</p>""",
    r"""<p><b>Plug in.</b> BCC nearest neighbours are along the body diagonal at $\frac{\sqrt3}{2}a$; Lindemann says the RMS amplitude at
    melting is 20% of that. $|\vec G|^2=(2\pi/a)^2(1^2+1^2)$. The $a$'s cancel, so the answer $D\approx0.45$ holds for every BCC metal at its
    melting point: thermal motion halves the (110) peak but does not blur it.</p>""",
]
# ---------------------------------------------------------------- sheet 6
EXPLAIN[(6, 1)] = [
    r"""<p><b>The general recipe for a density of states:</b> (1) count all states below energy $E$, $N(E)$ = (area of the region in $k$-space with
    energy $<E$) × (density of $k$-points $A/(2\pi)^2$) × 2 for spin; (2) differentiate, $D=\frac1A\frac{dN}{dE}$.</p>
    <p><b>2D:</b> the region is a disc of radius $k(E)=\sqrt{2mE}/\hbar$, area $\pi k^2=\pi\cdot2mE/\hbar^2$, linear in $E$. So $N\propto E$ and its
    derivative is a constant.</p>""",
    r"""<p><b>1D:</b> the "region" is the interval $[-k,k]$ of length $2k\propto\sqrt E$, so $N\propto\sqrt E$ and $D\propto1/\sqrt E$: many states
    at the band bottom, where the dispersion is flat.</p>
    <p><b>0D:</b> no free direction left, no $k$ at all: just discrete levels, each holding 2 electrons (spin), hence the delta peaks. The
    sequence 0D spike, 1D $E^{-1/2}$, 2D constant, 3D $E^{1/2}$ comes from the $k$-space volume growing like $k^d\propto E^{d/2}$.</p>""",
    r"""<p><b>At $T=0$ all states up to $E_F$ are filled,</b> so the density equals the number of states below $E_F$ per area or length:
    $n=N(E_F)/A$. Write $E_F=\hbar^2k_F^2/2m$ and solve for $k_F$. In 2D: disc area $\pi k_F^2$ × density $1/(2\pi)^2$ × 2 spins
    $=k_F^2/2\pi$.</p>""",
]
EXPLAIN[(6, 2)] = [
    r"""<p>$\epsilon=\pm c|\mathbf k|$ in two dimensions is a cone pointing up (conduction) and one pointing down (valence), meeting at a point.
    Any dispersion that is linear in $|k|$ looks like this; light and sound are the familiar examples, which is why the counting below copies
    the Debye phonon calculation.</p>""",
    r"""<p><b>Counting as in sheet 5 Q1:</b> states with energy below $\epsilon$ fill a disc of radius $k=\epsilon/c$. Number $=4\cdot\frac{L^2}{(2\pi)^2}\pi k^2$
    (4 = 2 spins × 2 valleys) $=\frac{L^2\epsilon^2}{\pi c^2}$; derivative: $g=\frac{2L^2}{\pi c^2}\epsilon$. Linear in $|\epsilon|$, and zero exactly at the
    Fermi level: graphene has very few states to excite.</p>""",
    r"""<p><b>Why a triangle.</b> Thermal excitation only affects states within about $k_BT$ of $\epsilon_F$. The number of states there is the
    area under $g$ between $-k_BT$ and 0; since $g$ is a straight line through zero, that area is a triangle, $\frac12\cdot$base·height.
    Each excited electron gains about $k_BT$, so $\Delta E\approx n_{ex}k_BT\propto T^3$.</p>""",
    r"""<p>$C=d(\Delta E)/dT\propto T^2$. Compare: an ordinary metal has a finite $g(\epsilon_F)$, so $n_{ex}\propto T$, $\Delta E\propto T^2$,
    $C\propto T$. The power changes because graphene's density of states vanishes at the Fermi level.</p>""",
]
EXPLAIN[(6, 3)] = [
    r"""<p><b>Where the special points are.</b> The zone of a square lattice is the square $|k_x|,|k_y|\le\pi/a$. The middle of a side is at
    distance $\pi/a$ from the centre, the corner at $\sqrt2\pi/a$ (Pythagoras). Free-electron energy $\propto k^2$, so the factor
    $(\sqrt2)^2=2$.</p>""",
    r"""<p>Same in 3D: face centre at $\pi/a$, corner at $\sqrt{3}\pi/a$ (space diagonal), energy ratio $3$. This spread of energies along the zone
    surface is why the band gaps at the zone faces do not automatically make a divalent metal an insulator: the corners are so much
    higher that electrons rather start filling the second zone.</p>""",
]
# ---------------------------------------------------------------- sheet 7
EXPLAIN[(7, 1)] = [
    r"""<p><b>Electron density:</b> 3 electrons per atom, one atom per cell of area $a_1a_2$.</p>
    <p><b>$k_F$:</b> at $T=0$ the electrons fill a disc in $k$-space. Number of electrons = disc area $\pi k_F^2$ × density of $k$-points
    $A/(2\pi)^2$ × 2 spins. Solving gives $k_F=\sqrt{2\pi n_e}$ (the same as sheet 6 Q1).</p>""",
    r"""<p><b>Reciprocal lattice of a rectangle:</b> $b_i=2\pi/a_i$; the first zone is the rectangle halfway to the neighbours. It contains as many
    $k$-points as there are cells, so with spin it holds exactly 2 electrons per atom. Three electrons per atom therefore need 1.5 zones of
    area, and the Fermi circle must stick out of the first zone.</p>
    <p><b>Where it sticks out:</b> compare $k_F=0.98$ with the distances to the zone edges: $0.5$ (crossed), $1.0$ (not reached) and the corner
    $1.12$ (not reached).</p>""",
    r"""<p><b>Reduced zone scheme:</b> every $k$ outside the first zone is equivalent to one inside, shifted by a reciprocal lattice vector
    (sheet 4 Q1). So the parts of the circle beyond $k_1=\pm0.5$ are moved by $\mp b_1$ back into the first zone, where they become a second
    band. Band 1: everything inside the circle and the zone, i.e. full except the corners. Band 2: the two moved caps. Two bands partly
    filled, so there are states right at $E_F$: a metal.</p>""",
]
EXPLAIN[(7, 2)] = [
    r"""<p><b>Largest phonon wave vector</b> = farthest you can go before folding back = the zone boundary. BCC has an FCC reciprocal lattice of
    edge $4\pi/a$; along a cube axis the boundary point H is half of that, $2\pi/a$.</p>
    <p><b>Energy:</b> with the Debye straight line $\omega=vk$ at $k=2\pi/a$: $\hbar\omega\approx10$ meV, small because sound is slow (1000 m/s).</p>""",
    r"""<p><b>Electron:</b> the largest occupied wave vector is $k_F$, from the free-electron formula $k_F=(3\pi^2n)^{1/3}$ with $n$ = electrons per
    volume (2 atoms per BCC cube, 1 electron each). $E_F=\hbar^2k_F^2/2m\approx3$ eV. Comparable wave vector to the phonon, but three hundred
    times more energy, because electrons move about a thousand times faster than sound.</p>""",
    r"""<p><b>The comparison decides it.</b> A transition needs both the right $\Delta\mathbf k$ and the right $\Delta E$. A phonon supplies plenty of
    $\Delta\mathbf k$ but only ~10 meV; the gap here is ~0.9 Ry ≈ 12 eV. A photon is the opposite: plenty of energy, almost no wave vector
    ($k=E/\hbar c$ is tiny). So an indirect transition needs both: the photon pays the energy, a phonon the momentum.</p>""",
]
EXPLAIN[(7, 3)] = [
    r"""<p><b>Hopping = overlap of the tails.</b> The matrix element samples the neighbour's orbital at the delta, where it has decayed by
    $e^{-a/d}$ for the nearest neighbour and $e^{-2a/d}$ for the next-nearest. Their ratio $e^{-a/d}$ is small when the orbitals are much
    smaller than the spacing.</p>""",
    r"""<p><b>Getting equations for the amplitudes:</b> insert $|\Psi\rangle=\sum_m\phi_m|m\rangle$ into $\hat H|\Psi\rangle=E|\Psi\rangle$ and take the overlap
    with $\langle n|$. Orthonormality leaves $E\phi_n$ on the left; on the right only the matrix elements that are not zero survive:
    on-site $E_0$, nearest $-t$, next-nearest $-t'$. This is the discrete version of the Schrödinger equation.</p>""",
    r"""<p><b>Plane-wave ansatz again</b> (every site is equivalent, as in sheet 4 Q1): $\phi_{n\pm1}=e^{\pm ika}\phi_n$, $\phi_{n\pm2}=e^{\pm2ika}\phi_n$.
    Divide by $\phi_n$: $E=E_0-t(e^{ika}+e^{-ika})-t'(e^{2ika}+e^{-2ika})=E_0-2t\cos ka-2t'\cos2ka$.</p>""",
    r"""<p><b>Effective mass</b> measures the curvature of the band: near a minimum $E\approx E_{\min}+\frac{\hbar^2(k-k_0)^2}{2m^*}$, so
    $\frac{\hbar^2}{m^*}=\frac{d^2E}{dk^2}$. Differentiate twice: $(\cos ka)''=-a^2\cos ka$, $(\cos2ka)''=-4a^2\cos2ka$. At the band top
    ($k=\pi/a$) the curvature is negative, so $m^*<0$: electrons there respond to a force like positive charges (holes).</p>""",
]
# ---------------------------------------------------------------- sheet 8
EXPLAIN[(8, 1)] = [
    r"""<p><b>Same idea as sheet 2 Q2</b> (two in-plane vectors from the intercepts), but with reciprocal vectors the dot products are clean
    for every lattice: $\mathbf a^*\cdot\mathbf a=2\pi$ and $\mathbf a^*\cdot\mathbf b=\mathbf a^*\cdot\mathbf c=0$ by construction. So $\mathbf G\cdot(\mathbf a/h-\mathbf b/k)=2\pi-2\pi=0$:
    no need for equal axes.</p>""",
    r"""<p><b>Spacing = projection on the unit normal</b> of a vector from one plane to the next (one through the origin, the next through
    $\mathbf a/h$). With $\hat n=\mathbf G/|\mathbf G|$: $\mathbf G\cdot\mathbf a/h=2\pi$, so $d=2\pi/|\mathbf G|$. The shortest $\mathbf G$ in that direction gives the
    actual neighbouring planes (a longer multiple would count every second plane only).</p>""",
    r"""<p><b>Why $\rho=d/V$.</b> Each primitive cell holds one lattice point; slicing space into planes of spacing $d$, each plane of area $A$
    contains $A\,d/V$ points. So the areal density of points in the plane is $d/V$: dense planes are widely spaced planes, i.e. the shortest
    $\mathbf G$. For BCC the shortest reciprocal vectors are the primitive ones, all of length $\frac{2\pi}{a}\sqrt2$, so $d=a/\sqrt2$.</p>""",
    r"""<p><b>Translate back to cube language:</b> $\mathbf a^*\propto(0,1,1)$ is the normal of the cube's $(011)$ plane, the diagonal plane through two
    opposite edges; it contains the body centre too. The count $4\cdot\frac14+1=2$ points on a $a\times\sqrt2a$ rectangle reproduces
    $\rho=\sqrt2/a^2$.</p>""",
]
EXPLAIN[(8, 2)] = [
    r"""<p>In FCC the nearest neighbour of a corner atom is the centre of an adjacent face: half a face diagonal, $\frac{\sqrt2a}{2}=a/\sqrt2$.</p>""",
    r"""<p><b>Assumption:</b> each bond sits at the minimum of the pair potential (only nearest neighbours count). Same derivative as sheet 3
    Q2: the minimum is at $r_0=2^{1/6}\sigma$, so $\sigma=r_0/2^{1/6}$.</p>""",
    r"""<p><b>Counting bonds.</b> Each atom has 12 nearest neighbours, but each bond is shared by two atoms; per atom: 6 bonds, each worth
    $\phi(r)$. That is where $12\cdot\frac12$ comes from.</p>""",
    r"""<p><b>Why rewrite in $\Omega$.</b> The bulk modulus is the curvature of energy against volume, so express $u$ through the volume per
    atom: an FCC cube holds 4 atoms and has edge $\sqrt2r$, so $\Omega=(\sqrt2r)^3/4=r^3/\sqrt2$, i.e. $r^6=2\Omega^2$.</p>
    <p><b>Then</b> differentiate twice in $\Omega$ ($\Omega^{-4}\to20\Omega^{-6}$, $\Omega^{-2}\to6\Omega^{-4}$) and use the equilibrium condition
    $\sigma^6=\Omega_0^2$ to simplify. $K=48U_0/\Omega_0$: stiffness = bond energy per volume, a few GPa for a van der Waals solid (steel:
    ~160 GPa).</p>""",
]
EXPLAIN[(8, 3)] = [
    r"""<p><b>Photons are counted like phonons</b> (sheet 5 Q1): states with $|k|<k$ fill a ball, $\frac{V}{(2\pi)^3}\frac43\pi k^3$, times 2
    polarisations. With $k=E/\hbar c$ and a derivative in $E$: $\nu(E)\propto E^2$.</p>""",
    r"""<p><b>Energy</b> = sum over states of $E$ × mean number of photons $1/(e^{E/k_BT}-1)$ (no ½: the zero-point energy is a constant and
    is dropped). With $y=E/k_BT$ the integral is a pure number and the prefactor carries $T^4$: the Stefan–Boltzmann law.</p>
    <p><b>Why no cutoff:</b> photon modes exist up to arbitrarily high $k$ (no lattice), unlike phonons which stop at the zone boundary.</p>""",
    r"""<p>$U\propto T^4$ gives $c_V\propto T^3$ at every temperature. Phonons follow the same $T^3$ only while $T\ll\Theta_D$, where the cutoff
    does not matter yet.</p>""",
]
# ---------------------------------------------------------------- sheet 9
EXPLAIN[(9, 1)] = [
    r"""<p><b>Electron density</b> = atoms per volume (one free electron each): mass density / molar mass × Avogadro.</p>
    <p><b>Drude</b> gives $\sigma=ne^2\tau/m$: the field accelerates each electron for a time $\tau$ between collisions. Solve for $\tau$; a
    few times $10^{-14}$ s is typical for metals at room temperature.</p>""",
    r"""<p>Mean free path = speed × time between collisions. With the classical thermal speed you get ~3 nm. With the speed the conduction
    electrons really have ($v_F$, the speed at the Fermi surface) it is ~40 nm, ten times more.</p>""",
    r"""<p><b>Drude's chain of reasoning:</b> if the path length $\lambda$ is fixed, the time between collisions is $\lambda/v$, and $v\propto\sqrt T$
    for a classical gas. So $\tau\propto T^{-1/2}$ and $\rho\propto1/\tau\propto\sqrt T$.</p>""",
    r"""<p><b>Why this is wrong in reality.</b> (1) The current is carried by electrons at the Fermi surface, whose speed $v_F$ does not depend on
    $T$. (2) The collisions are with phonons, and their number grows with $T$: at high $T$ the phonon occupation is $\approx k_BT/\hbar\omega$, so
    the collision rate $\propto T$ and $\rho\propto T$. At low $T$ fewer phonons ($\propto T^3$) and each only deflects by a small angle, which
    adds another $T^2$: $\rho\propto T^5$ plus a constant from defects.</p>""",
]
EXPLAIN[(9, 2)] = [
    r"""<p>Current = charge × density × velocity, summed over carriers: electrons carry $-e$, holes $+e$.</p>""",
    r"""<p><b>Drude with a magnetic field:</b> $m\dot{\mathbf v}=q(\mathbf E+\mathbf v\times\mathbf B)-m\mathbf v/\tau$ (force minus friction from collisions). In a
    steady current nothing accelerates, $\dot{\mathbf v}=0$, so $m\mathbf v/\tau=q(\mathbf E+\mathbf v\times\mathbf B)$. Dividing by $m/\tau$ gives the stated forms; the
    mobility $\mu=e\tau/m$ is "drift speed per field".</p>""",
    r"""<p><b>The $x$ component</b> of $\mathbf v\times\mathbf B$ with $\mathbf B=B_z\hat z$ is $v_yB_z$. The assumption $E_x\gg v_yB_z$ drops it, leaving $v_x=\mp\mu E_x$.
    Electrons drift against the field, holes along it; both currents point along $+x$ because the charges have opposite signs. So the
    conductivities simply add.</p>""",
    r"""<p><b>The $y$ component</b> of $\mathbf v\times\mathbf B$ is $-v_xB_z$. Insert $v_x$ from (c): the magnetic force on electrons and on holes points the same
    way (both kinds are pushed to the same edge), which is why their contributions to $J_y$ come with opposite signs in charge but add up
    with $\mu^2$.</p>
    <p><b>Boundary condition:</b> the sample has edges, no current can leave in $y$, so in steady state $J_y=0$. A transverse field $E_y$ (the
    Hall field) builds up until it cancels the magnetic push.</p>""",
    r"""<p><b>Algebra:</b> set $J_y=0$ in (d), solve for $E_y$, and replace $E_x$ by $J_x/\sigma$ from (c). $R_H=E_y/(J_xB_z)$.</p>
    <p><b>Sign:</b> each carrier type contributes with weight $n\mu^2$: electrons negative, holes positive. One type only gives the familiar
    $\mp1/(ne)$. With both, a small number of very mobile carriers can decide the sign, so the sign of $R_H$ alone does not tell you which
    carriers are in the majority.</p>""",
]
