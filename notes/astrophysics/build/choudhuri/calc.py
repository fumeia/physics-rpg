"""Numbers for the worked solutions of the Choudhuri end-of-chapter exercises.
Constants: Choudhuri Appendix A (c = 3.00e8, G = 6.67e-11, ...); a few extra ones (sigma_T, a_B, eps0) are standard values.
Every number that appears in a solution is computed here and inserted into the text by build.py."""
from math import *
from scipy.integrate import quad, solve_ivp
from scipy.optimize import brentq
from scipy.special import gammainc, eval_legendre

c=3.00e8; G=6.67e-11; h=6.63e-34; hbar=h/(2*pi); kB=1.38e-23; mu0=1.26e-6; eps0=8.85e-12; e=1.60e-19; me=9.11e-31; mH=1.67e-27; mp=1.67e-27
sigSB=5.67e-8; eV=1.60e-19; AU=1.50e11; pc=3.09e16; yr=3.16e7; Msun=1.99e30; Rsun=6.96e8; Lsun=3.84e26; Rearth=6.37e6
sigT=6.65e-29; aB=4*sigSB/c; MeV=1e6*eV; kpc=1e3*pc; Mpc=1e6*pc
N={}
# ---- Ch 1
v=220e3; R=8*kpc; M=v**2*R/G; N['1.1']=dict(M=M, Msun=M/Msun)
Mabs=2-5*log10(4/10); L=Lsun*10**(0.4*(5-Mabs)); N['1.2']=dict(Mabs=Mabs, L=L, ratio=L/Lsun)
th=1.0/10e3; N['1.3']=dict(th=th, arcsec=th*206265, th21=0.21/10e3*206265, D=5e-7/th)
# ---- Ch 2
I3=pi**4/15; N['2.1']=dict(aB=8*pi*kB**4/(c**3*h**3)*I3, sigma=c*8*pi*kB**4/(c**3*h**3)*I3/4)
x=brentq(lambda x: 3*(1-exp(-x))-x, 1, 5); N['2.1']['x']=x; N['2.1']['numax']=x*kB/h
def saha_x(T, P): 
    K=(2*pi*me)**1.5*(kB*T)**2.5/h**3/P*exp(-13.6*eV/(kB*T)); return sqrt(K/(1+K))
def saha_rho(T, rho):  # constant density: P = (1+x) n kT, solve self-consistently
    n=rho/mH; return brentq(lambda x: x**2/(1-x) - (2*pi*me*kB*T)**1.5/h**3/n*exp(-13.6*eV/(kB*T)), 1e-300 if False else 0.0, 1-1e-15)
Ts=[5000,8000,10000,12000,15000,20000,30000]
N['2.3']=dict(table=[(T, saha_rho(T,1.29)) for T in Ts], Thalf=brentq(lambda T: saha_rho(T,1.29)-0.5, 5000, 50000))
ne=1.29/mH; N['2.7']=dict(ne=ne, l=log(2)/(ne*sigT))
# ---- Ch 3
Nn=Msun/(0.6*mH); Eth=1.5*Nn*kB*1e7; EG=G*Msun**2/Rsun; N['3.1']=dict(N=Nn, Eth=Eth, EG=EG)
dR=2*Lsun*Rsun**2/(G*Msun**2); N['3.2']=dict(ms=dR, myr=dR*yr, myr35=dR*yr*5/3)
Tc=1.56e7; rhoc=1.48e5; mu=0.62; Prad=aB*Tc**4/3; Pgas=rhoc*kB*Tc/(mu*mH); N['3.3']=dict(Prad=Prad, Pgas=Pgas, ratio=Prad/Pgas)
T07=0.4*G*Msun*0.6*mH/(kB*Rsun)*(1/0.7-1); N['3.4']=dict(T07=T07, scale=G*Msun*0.6*mH/(kB*Rsun))
chi=sigT/mH; LM=4*pi*c*G/chi; N['3.5']=dict(chi=chi, LM=LM, LMsun=Lsun/Msun, ratio=LM/(Lsun/Msun), Mmax=sqrt(LM/(Lsun/Msun)))
N['3.6']=dict(m_hb=15.65, M_hb=0.6, d=10**((15.65-0.6+5)/5))
N['3.7']=dict(T9=2.2e4, l9=2.90e-3/2.2e4, T025=3.4e3, l025=2.90e-3/3.4e3, Tsc9=5780*9**0.25)
# ---- Ch 4
m=mp/2; N['4.2']=dict(TG=e**4*m/(32*eps0**2*hbar**2*kB), coef=3*(e**4*m/(32*eps0**2*hbar**2*kB)/1e6)**(1/3))
T6=1e6/1.56e7; X=0.64; rho=1.48e5
epp=0.24*rho*X**2*T6**(2/3)*exp(-33.8*T6**(1/3)); ecno=8.7e20*rho*0.015*X*T6**(2/3)*exp(-152.3*T6**(1/3))
N['4.3']=dict(epp=epp, ecno=ecno, Upp=epp*rho, Ucno=ecno*rho)
cs=lambda T: sqrt(5/3*kB*T/(0.62*mH)); N['4.4']=dict(csc=cs(1.56e7), csm=cs(5e6), t=2*Rsun/cs(5e6))
Mdot=4*pi*AU**2*1e7*mp*4e5; N['4.5']=dict(Mdot=Mdot, lost=Mdot*4.5e9*yr, frac=Mdot*4.5e9*yr/Msun)
d=55*kpc; m2=2*12/(d/c)/(1/6**2-1/39**2); N['4.6']=dict(dc=d/c, m=sqrt(m2)*1e6)
# ---- Ch 5
P0=27*86400; N['5.7']=dict(Pwd=P0*(6.4e6/Rsun)**2, Pns=P0*(1e4/Rsun)**2)
P=0.033; Pdot=P/(2.5e3*yr); I=0.4*1.4*Msun*1e4**2; Om=2*pi/P; Omd=2*pi*Pdot/P**2
Edot=I*Om*Omd; B=sqrt(3*mu0*c**3*I*Omd/(2*pi*1e4**6*Om**3)); N['5.8']=dict(Pdot=Pdot, I=I, Edot=Edot, B=B)
K1=lambda mue: 3**(2/3)*h**2/(20*pi**(2/3)*me*mH**(5/3)*mue**(5/3))
def Rpoly(M,K): alpha=2.5*K/(4*pi*G)*(4*pi*2.71)**(1/3)*M**(-1/3); return 3.65*alpha
mue=2/(1+0.7); Mbd=0.08*Msun; Rbd=Rpoly(Mbd,K1(mue)); EGbd=6/7*G*Mbd**2/Rbd; Ebd=EGbd/2; Tbd=Ebd/(1.5*Mbd/(0.6*mH)*kB)
N['5.9']=dict(K1=K1(1), cR=Rpoly(Msun,K1(2)), mue=mue, R=Rbd, Rj=Rbd/7.0e7, EG=EGbd, Eth=Ebd, T=Tbd)
# Eddington standard model: (1-b)/b^4 = C M^2,  C = pi G^3 aB (mu mH)^4 / (48 * 2.018^2 kB^4)
Cedd=pi*G**3*aB*(0.6*mH)**4/(48*2.018**2*kB**4); N['5.5']=dict(C=Cedd, CMsun=Cedd*Msun**2)
for Mm in (1,10,100): N['5.5'][f'b{Mm}']=brentq(lambda b:(1-b)/b**4-Cedd*(Mm*Msun)**2,1e-6,1)
# ---- Ch 6
N['6.2']=dict(alpha=0.4*1.5*log(10), alpha_m=0.4*1.5*log(10)/kpc)
rho=5e6*mH; w=sqrt(4*pi*G*rho); N['6.4']=dict(rho=rho, P=2*pi/w/yr, Porb=2*pi*8*kpc/220e3/yr)
I=hbar/(2*pi*115e9); mred=12*16/28*1.66e-27; N['6.7']=dict(I=I, mred=mred, r=sqrt(I/mred))
# ---- Ch 7: King model, W = -beta*Phi; rho(W) = rho1[e^W erf(sqrt W) - sqrt(4W/pi)(1+2W/3)]; r in units r0 = sqrt(9 s^2/(4 pi G rho_c))
from scipy.special import erf
rk=lambda W: exp(W)*erf(sqrt(W))-sqrt(4*W/pi)*(1+2*W/3) if W>0 else 0.0
def king(W0):
    f=lambda r,y: [y[1], -2*y[1]/r - 9*rk(y[0])/rk(W0)] if r>0 else [0,0]
    ev=lambda r,y: y[0]; ev.terminal=True
    s=solve_ivp(f,[1e-6,1e4],[W0,0],events=ev,rtol=1e-9,atol=1e-12,max_step=0.05); return s.t_events[0][0]
N['7.4']={f'r{W0}': king(W0) for W0 in (3,6,9,12)}
# ---- Ch 9
tot=quad(lambda r: exp(-7.67*(r**0.25-1))*2*pi*r,0,inf,limit=400)[0]/pi; half=quad(lambda r: exp(-7.67*(r**0.25-1))*2*pi*r,0,1)[0]/pi
N['9.1']=dict(tot=tot, frac=half/tot)
b=0.98; g=1/sqrt(1-b*b); N['9.3']=dict(th=degrees(acos(b)), g=g, vapp=b*g)
B=1e-10; nug=e*B/(2*pi*me); gam=sqrt(1e9/nug); UB=B**2/(2*mu0); tc=me*c/(4/3*sigT*gam*UB); tt=Mpc/(0.1*c)
UCMB=aB*2.725**4; tIC=me*c/(4/3*sigT*gam*(UB+UCMB))
N['9.4']=dict(nug=nug, gam=gam, UB=UB, tc=tc/yr, tt=tt/yr, UCMB=UCMB, tIC=tIC/yr)
tcr=Mpc/1e6; N['9.5']=dict(tcr=tcr/yr, trel=1000*tcr/yr)
# ---- Ch 10
def age(Om, z=0):  # matter + curvature only, H0 t
    return quad(lambda a: 1/sqrt(Om/a+(1-Om)), 0, 1/(1+z))[0]
N['10.2']={(Om,z): age(Om,z)/age(Om) for Om in (0.5,1.0,1.5) for z in (1,4)}
N['10.3']={Om: age(Om) for Om in (0.1,0.3,0.5,1.0,2.0)}
H0=70e3/Mpc; n=1.88e-26*0.3*0.7**2/mH; rate=3*H0*n*1e9*yr; nc=1.88e-26*0.7**2/mH
N['10.5']=dict(H0=H0, n=n, rate=rate, rate1=3*H0*nc*1e9*yr)
# ---- Ch 11
r=exp(-1.29/0.4); N['11.2']=dict(r=r, Y=2*r/(1+r))
nb=1.88e-26*0.022/mH*1101**3; T=2.725*1101; P=nb*kB*T
N['11.4']=dict(T=T, n=nb, P=P, Thalf=brentq(lambda T: saha_x(T,P)-0.5, 2000, 10000), table=[(T, saha_x(T,P)) for T in (3000,3500,3800,4000,4500,5000)])
# ---- Ch 13
GM=G*Msun; dphi=6*pi*GM/(c**2*5.79e10*(1-0.206**2)); N['13.4']=dict(dphi=dphi, orbits=36525/88.0, arcsec=dphi*36525/88.0*206265, defl=4*GM/(c**2*Rsun)*206265)
# ---- Ch 14
def dL(Om, OL, z):
    k=1-Om-OL; f=lambda zz: 1/sqrt(Om*(1+zz)**3+OL+k*(1+zz)**2); I=quad(f,0,z)[0]
    if abs(k)<1e-9: return (1+z)*I
    return (1+z)/sqrt(abs(k))*(sinh if k>0 else sin)(sqrt(abs(k))*I)
N['14.7']={m: [(z, dL(*m, z)) for z in (0.1,0.5,1.0,2.0)] for m in ((1.0,0.0),(0.0,1.0),(0.3,0.7))}
def Cl(l, th0): return 2*pi*quad(lambda t: exp(-(t/th0)**2)*eval_legendre(l,cos(t))*sin(t), 0, min(pi, 8*th0), limit=400)[0]
res={}
for deg in (1,5,10):
    t0=radians(deg); ls=range(0, int(8/t0)); cl=[Cl(l,t0) for l in ls]; ll=[l*(l+1)*c_ for l,c_ in zip(ls,cl)]
    res[deg]=dict(argmax_C=max(ls,key=lambda l: cl[l]), argmax_llC=max(ls,key=lambda l: ll[l]), pred=2/t0)
N['14.8']=res
if __name__=='__main__':
    import pprint; pprint.pprint(N, width=150)
# ---- Ch 5 extras: equation-of-state boundaries (Fig. 5.1) and the Chandrasekhar mass
K1_2=K1(2); K2=lambda mue: 3**(1/3)*h*c/(8*pi**(1/3)*mH**(4/3)*mue**(4/3)); K2_2=K2(2)
ne_x1=8*pi/3*(me*c/h)**3
N['5.2']=dict(ne=ne_x1, rho=2*mH*ne_x1)
N['5.3']=dict(K1=K1_2, K2=K2_2, rho12=(K2_2/K1_2)**3, cid=0.6*mH*K1_2/kB, cir=0.6*mH*K2_2/kB, crad=(3*kB/(aB*0.6*mH))**(1/3))
N['5.6']=dict(MCh=4*pi*2.018*(K2_2/(pi*G))**1.5/Msun)
if __name__=='__main__': print(N['5.2'], N['5.3'], N['5.6'])
# ---- named keys for the text (Ch. 10, 11, 14)
a=N['10.2']; N['10.2']=dict(f1=a[(1.0,1)], f4=a[(1.0,4)], l1=a[(0.5,1)], l4=a[(0.5,4)], h1=a[(1.5,1)], h4=a[(1.5,4)])
for k in ('l1','l4','h1','h4'): N['10.2']['e'+k]=100*(N['10.2'][k]/N['10.2']['f'+k[1]]-1)
a=N['10.3']; N['10.3']={'o'+str(k).replace('.',''): v for k,v in a.items()}
for k,v in list(N['10.3'].items()): N['10.3']['t'+k[1:]]=v*9.78/0.7   # Gyr for h = 0.7
def saha_n(T, P):   # x^2/(1-x) = (2 pi me)^1.5 (kT)^2.5/(h^3 P) e^{-chi/kT}, P = n kT of all H nuclei (as in Ex. 2.3)
    K=(2*pi*me)**1.5*(kB*T)**2.5/h**3/P*exp(-13.6*eV/(kB*T)); return (-K+sqrt(K*K+4*K))/2
P=N['11.4']['P']; N['11.4']['Thalf']=brentq(lambda T: saha_n(T,P)-0.5, 2000, 10000); N['11.4']['table']=[(T, saha_n(T,P)) for T in (3000,3400,3600,3800,4000,4500)]
a=N['14.7']; N['14.7']={}
for (Om,OL),nm in (((1.0,0.0),'m'),((0.0,1.0),'l'),((0.3,0.7),'c')):
    for z,d in a[(Om,OL)]: N['14.7'][nm+str(z).replace('.','')]=d
a=N['14.8']; N['14.8']={f'l{d}': a[d]['argmax_llC'] for d in a}; N['14.8'].update({f'p{d}': a[d]['pred'] for d in a})
