import math, json
# physical constants (SI, CODATA 2018); expr.js already provides me, hbar, eV, pi
K = dict(kB=1.380649e-23, h=6.62607015e-34, e=1.602176634e-19, c=299792458, u=1.66053906660e-27,
         mn=1.67492749804e-27, mH=1.6735575e-27, mu0=1.25663706212e-6, muB=9.2740100783e-24,
         G=6.6743e-11, Msun=1.9884e30, eps0=8.8541878128e-12, a0=5.29177210903e-11, Ry=13.605693122994)
def V(*names, **extra):
    d = {n: K[n] for n in names}; d.update(extra); return d

class _Math:  # JS Math, for evaluating answers in python
    asin = staticmethod(math.asin); acos = staticmethod(math.acos); atan = staticmethod(math.atan)
    atan2 = staticmethod(math.atan2); PI = math.pi
def ev(expr, scope):
    base = dict(me=9.1093837015e-31, hbar=1.054571817e-34, eV=1.602176634e-19, pi=math.pi,
                sqrt=math.sqrt, exp=math.exp, log=math.log, log10=math.log10, sinh=math.sinh, cosh=math.cosh,
                sin=math.sin, cos=math.cos, tan=math.tan, abs=abs, Math=_Math)
    base.update(scope)
    return eval(expr, {"__builtins__": {}}, base)

def step(id, prompt, answer, unit, units, tol, hint, tolType=None, bonus=False):
    s = dict(id=id, prompt=prompt, answer=answer, unit=unit, units=units, tol=tol, hint=hint)
    if tolType: s['tolType'] = tolType
    if bonus: s['bonus'] = True
    assert unit in units, (id, unit)
    return s
def calc(id, title, fight, problem, vars, steps, xp, unlocks=None):
    d = dict(type='calc', id=id, title=title, fight=fight, problem=problem, vars=vars, steps=steps, xp=xp)
    if unlocks: d['unlocks'] = unlocks
    return d
def boss(id, title, source, minutes, instructions, statement, finalAnswers, keyPoints, xp, requires=None):
    d = dict(type='boss', id=id, title=title, source=source, minutes=minutes, instructions=instructions,
             statement=statement, finalAnswers=finalAnswers, keyPoints=keyPoints, xp=xp)
    if requires: d['requires'] = requires
    return d
def fa(id, prompt, answer, vars, tol, tolType=None):
    d = dict(id=id, prompt=prompt, answer=answer, vars=vars, tol=tol)
    if tolType: d['tolType'] = tolType
    return d

def check_room(room, report=True):
    """evaluate every answer in python (sanity pass), print values"""
    out = {}
    for enc in room['encounters']:
        if enc['type'] == 'calc':
            sc = dict(enc['vars'])
            for s in enc['steps']:
                v = ev(s['answer'], sc); sc[s['id']] = v; out[f"{enc['id']}.{s['id']}"] = v
        elif enc['type'] == 'boss':
            for f in enc['finalAnswers']:
                out[f"{enc['id']}.{f['id']}"] = ev(f['answer'], f['vars'])
    if report:
        for k, v in out.items(): print(f"  {room['id']}/{k:14s} {v:.6g}")
    return out

def write(room, outdir):
    import os
    os.makedirs(outdir, exist_ok=True)
    with open(f"{outdir}/{room['file']}.json", 'w') as f:
        r = {k: v for k, v in room.items() if k != 'file'}
        json.dump(r, f, ensure_ascii=False, indent=2); f.write('\n')
