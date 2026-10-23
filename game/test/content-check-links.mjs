// Validates game/content/links.json (schema, rooms, KaTeX, quoted numbers).
// Usage: node game/test/content-check-links.mjs [path-to-links.json]
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import katex from '../vendor/katex/katex.mjs';
const here=path.dirname(fileURLToPath(import.meta.url));
const content=path.join(here,'..','content');
const file=process.argv[2]||path.join(content,'links.json');
const links=JSON.parse(fs.readFileSync(file,'utf8')).links;
let fails=0;const bad=(id,m)=>{fails++;console.log('FAIL',id,m)};
const rooms=new Set();
for(const c of ['qm','solid-state','astrophysics'])for(const r of JSON.parse(fs.readFileSync(path.join(content,c,'index.json'))).rooms)rooms.add(c+'/'+r);
const LEVELS=['same-equation','analogy','application','prerequisite'];
const ne=s=>typeof s==='string'&&s.trim().length>0;
const ids=new Set(),pairs=new Set();
const texts=new Map();
function strings(x,acc=[]){if(typeof x==='string')acc.push(x);else if(Array.isArray(x))x.forEach(y=>strings(y,acc));else if(x&&typeof x==='object')Object.values(x).forEach(y=>strings(y,acc));return acc}
function renderMath(id,s,where){
  const parts=s.split(/(\$\$[\s\S]+?\$\$|\$[^$]+\$)/);
  if(parts.filter((_,i)=>i%2===0).join('').includes('$'))bad(id,where+': unbalanced $');
  for(let i=1;i<parts.length;i+=2){const p=parts[i];const dd=p.startsWith('$$');const tex=p.slice(dd?2:1,dd?-2:-1);
    try{katex.renderToString(tex,{throwOnError:true,displayMode:dd})}catch(e){bad(id,where+': KaTeX '+e.message.slice(0,90)+' in '+tex.slice(0,60))}}
}
for(const l of links){
  const id=l.id;
  if(!ne(id)){bad('?','missing id');continue}
  if(ids.has(id))bad(id,'duplicate id');ids.add(id);
  for(const k of ['a','b','title','level','regime','experiment','intuition','why','tex'])if(!ne(l[k]))bad(id,'missing '+k);
  if(!LEVELS.includes(l.level))bad(id,'bad level '+l.level);
  for(const s of ['sideA','sideB']){if(!l[s]||!ne(l[s].context)||!ne(l[s].tex))bad(id,'bad '+s);}
  if(!Array.isArray(l.map)||l.map.length<2||l.map.length>5)bad(id,'map needs 2-5 rows');
  else for(const r of l.map)if(!Array.isArray(r)||r.length!==2||!ne(r[0])||!ne(r[1]))bad(id,'bad map row');
  if('exam' in l&&!ne(l.exam))bad(id,'empty exam');
  for(const side of ['a','b']){if(!/^(qm|solid-state|astrophysics)\/[a-z0-9-]+$/.test(l[side]||''))bad(id,'bad room ref '+l[side]);
    else if(!rooms.has(l[side])&&l.planned!==true)bad(id,'room '+l[side]+' missing and not planned');}
  if(l.planned===true&&rooms.has(l.a)&&rooms.has(l.b))bad(id,'planned but both rooms exist');
  if(l.a===l.b)bad(id,'a==b');
  const pk=[l.a,l.b].sort().join('|');if(pairs.has(pk))bad(id,'duplicate pair');pairs.add(pk);
  if(id!==l.a.split('/')[1]+'~'+l.b.split('/')[1])bad(id,'id should be roomA~roomB');
  // KaTeX
  for(const s of ['sideA','sideB'])try{katex.renderToString(l[s].tex,{throwOnError:true,displayMode:true})}catch(e){bad(id,s+'.tex KaTeX '+e.message.slice(0,90))}
  try{katex.renderToString(l.tex,{throwOnError:true})}catch(e){bad(id,'tex KaTeX '+e.message.slice(0,90))}
  for(const s of ['title','regime','experiment','intuition','why','exam'])if(l[s])renderMath(id,l[s],s);
  renderMath(id,l.sideA.context,'sideA.context');renderMath(id,l.sideB.context,'sideB.context');
  l.map.forEach((r,i)=>r.forEach((c,j)=>renderMath(id,c,'map'+i+'.'+j)));
  texts.set(id,strings(l).join(' | '));
}
if(links.length<40||links.length>50)bad('all','expected 40-50 links, got '+links.length);
// ---------- numbers ----------
const hbar=1.054571817e-34,h=6.62607015e-34,c=2.99792458e8,e=1.602176634e-19,me=9.1093837e-31,mp=1.67262192e-27,mu=1.66053907e-27,kB=1.380649e-23,G=6.6743e-11,eps0=8.8541878e-12,Ms=1.989e30,Rs=6.957e8,al=1/137.035999,a0=5.29177e-11,pc=3.0857e16,Ry=13.6057;
const eV=x=>x*e;
const nCu=8.49e28,kF=Math.cbrt(3*Math.PI**2*nCu),EF=hbar**2*kF**2/2/me,TF=EF/kB;
const MWD=0.6*Ms,RWD=0.0125*Rs,nWD=MWD/(2*mu)/(4/3*Math.PI*RWD**3),EFwd=hbar**2*Math.cbrt(3*Math.PI**2*nWD)**2/2/me;
const EGpp=2*(mp/2)*c*c/e*(Math.PI*al)**2,kT15=kB*1.5e7/e,E0=Math.cbrt(EGpp*(kT15/2)**2);
const EGcno=2*(14/15*931.494e6)*(Math.PI*al*7)**2,tauOf=EG=>3*Math.cbrt(EG/(4*kT15));
const ncoreHe=1e9/(2*mu),EFhe=hbar**2*Math.cbrt(3*Math.PI**2*ncoreHe)**2/2/me;
const a_rad=4*5.670374e-8/c,LE=4*Math.PI*G*Ms*mp*c/6.6524587e-29;
const phi=eV(4.5),kap=Math.sqrt(2*me*phi)/hbar;
const nu0=0.75*Ry*e/hbar/2/Math.PI,AL=(2*Math.PI*nu0)**3*e*e*(128*Math.SQRT2/243*a0)**2/(3*Math.PI*eps0*hbar*c**3);
const Hh=70e3/(1e6*pc),rhoc=3*Hh**2/(8*Math.PI*G);
const lamth=m=>h/Math.sqrt(2*Math.PI*m*kB*300);
const zener=F=>4/3*Math.sqrt(2*0.2*me)*(eV(1.12))**1.5/(e*hbar*F);
const DMc=e*e/(8*Math.PI**2*eps0*me*c)*pc*1e-4*1e6*1e0; // s Hz^2 per (pc cm^-3)
const dmDelay=(DM,nuHz)=>e*e/(8*Math.PI**2*eps0*me*c)*DM*pc*1e6/nuHz**2; // DM in pc/cm3 -> pc/m3 = pc*1e6
const checks=[ // [id-prefix, needle (verbatim substring, first number is checked), expected, rel.tol]
['tunneling-bridge~nuclear','approx 493$ keV',EGpp/1e3,.01],['tunneling-bridge~nuclear','approx 5.9$ keV',E0/1e3,.01],['tunneling-bridge~nuclear','e^{-9.1}',Math.sqrt(EGpp/E0),.01],['tunneling-bridge~nuclear','1.3$ keV',kT15/1e3,.01],
['tunneling-bridge~fermi','kappa\\approx1.09',kap*1e-10,.01],['tunneling-bridge~fermi','e^{-2.17}',2*kap*1e-10,.01],['tunneling-bridge~fermi','\\approx0.11',Math.exp(-2*kap*1e-10),.05],
['wave-mechanics-basics~fermi','k_F=1.36\\times10^{10}',kF,.01],['wave-mechanics-basics~fermi','E_F=7.0$ eV',EF/e,.01],['wave-mechanics-basics~fermi','T_F=8.2\\times10^4',TF,.01],
['fermi-sea~degenerate-core','k_BT/E_F=3.7\\times10^{-3}',kB*300/EF,.02],['fermi-sea~degenerate-core','n_e\\approx1.3\\times10^{35}',nWD,.02],['fermi-sea~degenerate-core','E_F\\approx 94$ keV',EFwd/e/1e3,.02],['fermi-sea~degenerate-core','\\approx10^{-5}',kB*1e4/EFwd,.2],
['degenerate-core~degenerate-matter','=1.46',5.83/4,.01],
['formalism-and-uncertainty~degenerate','\\approx6\\times10^6',hbar**2/(G*me*mp**2*Math.cbrt(Ms/mp)),.05],['formalism-and-uncertainty~degenerate','1.2\\times10^{57}',Ms/mp,.02],
['phonon-halls~harmonic','hbar\\omega\\approx6.6$ meV',hbar*1e13/e*1e3,.01],['phonon-halls~harmonic','76$ K',hbar*1e13/kB,.01],
['phonon-halls~photometry','5.8\\times10^{-3}',12*Math.PI**4/5*(10/343)**3,.01],['phonon-halls~photometry','a=7.566\\times10^{-16}',a_rad,.001],['phonon-halls~photometry','sigma=5.67',5.670374,.001],
['magnet-vault~spin','mu_{\\rm eff}=7.94',2*Math.sqrt(3.5*4.5),.005],['magnet-vault~spin','3.58\\,\\mu_B',0.8*Math.sqrt(20),.005],
['magnet-vault~angular','0.67$ K',9.2740100783e-24/kB,.01],['magnet-vault~angular','tanh(2.2\\times10^{-3})',9.2740100783e-24/kB/300,.02],['magnet-vault~angular','28$ GHz per T',2*9.2740100783e-24/h/1e9,.01],
['lattice-gate~wave','lambda=1.67',h/Math.sqrt(2*me*54*e)*1e10,.01],['lattice-gate~wave','0.766=1.65',Math.sin(50*Math.PI/180),.001],['lattice-gate~wave','=1.65$',2.15*Math.sin(50*Math.PI/180),.01],['lattice-gate~wave','have 1.8',h/Math.sqrt(2*1.67492749804e-27*0.025*e)*1e10,.02],['lattice-gate~wave','have 1.5',12.3984/8,.04],
['fermi-sea~perturbation','0.06$ meV',9.2740100783e-24/e*1e3,.05],['fermi-sea~perturbation','chi_P\\approx8.3\\times10^{-6}',4e-7*Math.PI*3*2.65e28*(9.2740100783e-24)**2/(2*3.24*e),.01],
['semiconductor-forge~hydrogen','=5.5',Ry*0.067/12.9**2*1e3,.01],['semiconductor-forge~hydrogen','approx100',0.529177*12.9/0.067,.03],['semiconductor-forge~hydrogen','64$ K',Ry*0.067/12.9**2/8.617333e-5,.01],['semiconductor-forge~hydrogen','the 26 meV',Ry*0.26/11.7**2*1e3,.02],
['drift-corridor~radiative','ell\\approx39$ nm',hbar*kF/me*2.5e-14*1e9,.02],['drift-corridor~radiative','sigma\\approx6\\times10^7',nCu*e*e*2.5e-14/me,.01],['drift-corridor~radiative','v_F=1.57\\times10^6',hbar*kF/me,.01],['drift-corridor~radiative','0.07$ mm',1/(0.1*1.5e5)*1e3,.06],['drift-corridor~radiative','8\\times10^5$ yr',Rs**2/((1/(0.1*1.5e5))*c)/3.156e7,.06],['drift-corridor~radiative','5\\times10^3$ yr',Rs**2/(0.01*c)/3.156e7,.05],
['interstellar-medium~spin','nu=1420.4',1420.405751,.0001],['interstellar-medium~spin','21.1\\text{ cm}',c/1420.405751e6*100,.001],['interstellar-medium~spin','5.87\\ \\mu',h*1420.405751e6/e*1e6,.001],['interstellar-medium~spin','0.068$ K',h*1420.405751e6/kB,.01],['interstellar-medium~spin','1.1\\times10^7$ yr',1/2.8688e-15/3.156e7,.02],['interstellar-medium~spin','2.9\\times10^{-15}',2.8688e-15,.02],
['radiative-transfer~hydrogen','lambda=656.5',1e9/(1.0967758e7*5/36),.001],['radiative-transfer~hydrogen','e^{-11.8}',10.2/(kB*1e4/e),.01],['radiative-transfer~hydrogen','0.86$ eV',kB*1e4/e,.01],['radiative-transfer~hydrogen','3\\times10^{-5}',4*Math.exp(-10.2/(kB*1e4/e)),.05],
['photometry-radiation~wave','502$ nm',2.8978e-3/5772*1e9,.002],
['photometry-radiation~early','approx1100',3000/2.7255,.01],['photometry-radiation~early','1.06$ mm',2.8978e-3/2.7255*1e3,.01],['photometry-radiation~early','411$ cm',2*1.2020569/Math.PI**2*(kB*2.7255/(hbar*c))**3*1e-6,.01],['photometry-radiation~early','$160$ GHz',5.8789e10*2.7255/1e9,.01],
['stellar-forge~galactic','2.8\\times10^6',G*Ms*0.6*mp/(5*kB*Rs),.02],['stellar-forge~galactic','10^{15}',5*1e12*1.5e6*pc/G/Ms,1.0],
['stellar-forge~active','3.3\\times10^4',LE/3.828e26,.02],['stellar-forge~active','1.26\\times10^{31}',LE,.01],['stellar-forge~active','1.26\\times10^{39}',LE*1e8,.01],['stellar-forge~active','2.2\\,M_\\odot',LE*1e8/(0.1*c*c)*3.156e7/Ms,.15],
['nuclear-furnace~early','1.293',1.29333,.001],['nuclear-furnace~early','n/p\\approx0.2',Math.exp(-1.293/0.8),.05],['nuclear-furnace~early','gives $0.25$',2*(1/7)/(1+1/7),.01],
['galactic-dynamics~expanding','9.2\\times10^{-27}',rhoc,.01],['galactic-dynamics~expanding','5.5 protons',rhoc/mp,.01],['galactic-dynamics~expanding','9\\times10^{10}',(220e3)**2*8e3*pc/G/Ms,.01],
['angular-momentum-spin~hydrogen','0.020$ nm',(656.3e-9)**2*9.2740100783e-24/(h*c)*1e9,.01],['angular-momentum-spin~hydrogen','58\\ \\mu',9.2740100783e-24/e*1e6,.01],['angular-momentum-spin~hydrogen','4.5\\times10^{-5}',al**2/4*(Ry/4),.01],['angular-momentum-spin~hydrogen','0.8$ T',45e-6/(9.2740100783e-24/e),.05],
['spin-addition-stern-gerlach~entanglement','=2.83',2*Math.SQRT2,.002],
['hydrogen-lamp~perturbation','4.5\\times10^{-5}',al**2/4*(Ry/4),.01],['hydrogen-lamp~perturbation','10.9$ GHz',al**2/4*(Ry/4)*e/h/1e9,.01],
['fermi-sea~degenerate-matter','=0.018',Math.PI**2/2*300/TF,.02],['fermi-sea~degenerate-matter','0.6\\%',Math.PI**2/2*300/TF/3*100,.1],['fermi-sea~degenerate-matter','0.05$ at',Math.PI**2/2*1e7/(EFwd/kB),.12],
['bonding-grotto~tunneling','23.79$ GHz',23.787,.001],['bonding-grotto~tunneling','=98$',h*23.787e9/e*1e6,.01],
['bonding-grotto~hydrogen','S\\approx0.46',Math.exp(-2.5)*(1+2.5+2.5**2/3),.01],['bonding-grotto~hydrogen','exact $2.79$ eV',0.1026*27.2114,.002],
['semiconductor-forge~fermi','3.9\\times10^{-10}',Math.exp(-1.12/(2*0.025852)),.01],['semiconductor-forge~fermi','25.9$ meV',kB*300/e*1e3,.01],
['lattice-gate~formalism','0.87$ Å',Math.PI/3.61,.01],['lattice-gate~formalism','2.9$ eV',hbar**2/2/me/e*1e20*(Math.PI/3.61)**2,.01],
['phonon-halls~radiative','1.2\\times10^7$ J',4*a_rad*(1.57e7)**3,.03],
['degenerate-core~stellar','=3.0\\times10^{35}',ncoreHe,.01],['degenerate-core~stellar','E_F\\approx0.16$ MeV',EFhe/e/1e6,.03],['degenerate-core~stellar','T_F\\approx1.9\\times10^9',EFhe/kB,.03],['degenerate-core~stellar','0.05$ at',1e8/(EFhe/kB),.07],
['fermi-sea~early','=112\\ ',0.75*4/11*2*1.2020569/Math.PI**2*(kB*2.7255/(hbar*c))**3*1e-6,.01],['fermi-sea~early','=1.95\\text{ K}',2.7255*Math.cbrt(4/11),.01],
['magnet-vault~interstellar','1.40\\ \\text{MHz/G}',9.2740100783e-24/h*1e-4/1e6,.005],['magnet-vault~interstellar','14$ Hz',2*1.4*5,.01],['magnet-vault~interstellar','5$ kHz',1420.405751e6/3e5/1e3*1,.1],
['semiconductor-forge~photometry','1.107\\ \\mu',1.23984/1.12,.001],['semiconductor-forge~photometry','0.873',1.23984/1.42,.001],['semiconductor-forge~photometry','1.88',1.23984/0.66,.001],
['drift-corridor~interstellar','10.8$ eV',hbar*Math.sqrt(nCu*e*e/(eps0*me))/e,.01],['drift-corridor~interstellar','1.6$ kHz',Math.sqrt(3e4*e*e/(eps0*me))/2/Math.PI/1e3,.04],['drift-corridor~interstellar','4.15\\text{ ms}',dmDelay(1,1e9)*1e3,.002],['drift-corridor~interstellar','1.3$ s',dmDelay(50,4e8),.02],
['harmonic-oscillator-elevator~photometry','0.58',1/(Math.E-1),.005],
['tunneling-bridge~semiconductor','$36$ at',zener(1e8),.02],['tunneling-bridge~semiconductor','$12$ at',zener(3e8),.02],['tunneling-bridge~semiconductor','6\\times10^{-6}',Math.exp(-zener(3e8)),.1],
['angular-momentum-spin~degenerate','1.68\\ \\text{fm}',Math.cbrt(3*Math.PI**2*0.16),.005],['angular-momentum-spin~degenerate','approx58\\text{ MeV}',197.327**2*Math.cbrt(3*Math.PI**2*0.16)**2/2/939.565,.02],['angular-momentum-spin~degenerate','1.33$ fm',Math.cbrt(6*Math.PI**2*0.16/4),.005],
['perturbation-forge~radiative','0.745\\,a_0',128*Math.SQRT2/243,.001],['perturbation-forge~radiative','6.27\\times10^{8}',AL,.005],['perturbation-forge~radiative','1.6$ ns',1e9/AL,.02],['perturbation-forge~radiative','1.55\\times10^{16}',2*Math.PI*nu0,.005],['perturbation-forge~radiative','121$ nm',c/nu0*1e9,.01],
['formalism-and-uncertainty~radiative','100$ MHz',AL/2/Math.PI/1e6,.01],['formalism-and-uncertainty~radiative','106$ GHz',nu0*Math.sqrt(2*kB*1e4/mp)/c/1e9,.01],
['wave-mechanics-basics~degenerate-core','4.3$ nm',lamth(me)*1e9,.01],['wave-mechanics-basics~degenerate-core','6.7\\times10^3',nCu*lamth(me)**3,.02],['wave-mechanics-basics~degenerate-core','0.019$ nm',lamth(28*mu)*1e9,.01],['wave-mechanics-basics~degenerate-core','1.7\\times10^{-7}',2.5e25*lamth(28*mu)**3,.03],['wave-mechanics-basics~degenerate-core','1.7\\times10^3',nWD*(h/Math.sqrt(2*Math.PI*me*kB*1e7))**3,.05],
['phonon-halls~fermi','4.8\\times10^{-5}',1944/343**3,.01],['phonon-halls~fermi','1944',12*Math.PI**4/5*8.314462,.001],['phonon-halls~fermi','0.50$ mJ',Math.PI**2/2*8.314462/TF*1e3,.02],['phonon-halls~fermi','3.8$ K',Math.sqrt(0.695e-3/(1944/343**3)),.01],['phonon-halls~fermi','m^*/m=1.4',0.695e-3/(Math.PI**2/2*8.314462/TF),.03],
['nuclear-furnace~stellar','tau=13.7',tauOf(EGpp),.01],['nuclear-furnace~stellar','nu=3.9',(tauOf(EGpp)-2)/3,.01],['nuclear-furnace~stellar','44.8$ MeV',EGcno/1e6,.01],['nuclear-furnace~stellar','tau=61.6',tauOf(EGcno),.01],['nuclear-furnace~stellar','nu=19.9',(tauOf(EGcno)-2)/3,.01],['nuclear-furnace~stellar','493$ keV',EGpp/1e3,.01],
];
function firstNum(s){const p=s.match(/^\D*10\^\{?(-?\d+)\}?/);if(p)return 10**parseInt(p[1]);const m=s.match(/(\d+(?:\.\d+)?)(?:\\times10\^\{?(-?\d+)\}?)?/);if(!m)return NaN;let v=parseFloat(m[1]);if(m[2]!==undefined)v*=10**parseInt(m[2]);return v}
for(const [pre,needle,exp,tol] of checks){
  const hits=[...texts].filter(([id])=>id.startsWith(pre));
  if(!hits.length){bad(pre,'no link for numeric check '+needle);continue}
  let seen=false;
  for(const [id,t] of hits){if(!t.includes(needle))continue;seen=true;
        const v=firstNum(needle);const rel=Math.abs(v-exp)/Math.abs(exp);
    if(!(rel<=tol))bad(id,`number "${needle}": quoted ${v}, computed ${exp.toPrecision(5)} (rel ${rel.toFixed(3)})`);}
  if(!seen)bad(pre,'needle not found: '+needle);
}
// ladder-operator algebra check: <n|x^4|n> = 3 (hbar/2mw)^2 (2n^2+2n+1)
{const N=40,a=Array.from({length:N},(_,i)=>Array.from({length:N},(_,j)=>j===i+1?Math.sqrt(j):0));
 const x=a.map((r,i)=>r.map((_,j)=>a[i][j]+a[j][i]));
 const mul=(A,B)=>A.map((r,i)=>B[0].map((_,j)=>r.reduce((s,_,k)=>s+A[i][k]*B[k][j],0)));
 const x2=mul(x,x),x4=mul(x2,x2);
 for(let n=0;n<4;n++){const ex=3*(2*n*n+2*n+1)/4;if(Math.abs(x4[n][n]/4-ex)>1e-9)bad('harmonic-oscillator-elevator~perturbation','x^4 matrix element n='+n);}}
// fine structure: j=3/2 minus j=1/2 shift for n=2 is |E_2| alpha^2/4
{const f=(n,j)=>-Ry/n**2*al**2/n**2*(n/(j+.5)-.75);const d=f(2,1.5)-f(2,.5);if(Math.abs(d-Ry/4*al**2/4)>1e-9)bad('hydrogen-lamp~perturbation','fine structure formula');}
console.log(fails?`${fails} failure(s) in ${links.length} links`:`OK: ${links.length} links (${links.filter(l=>l.planned).length} planned), ${checks.length} numeric checks`);
process.exit(fails?1:0);
