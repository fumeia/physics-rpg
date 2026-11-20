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
