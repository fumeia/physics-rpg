# "As asked in the exam": for each derivation, the old-exam sub-questions (verbatim from the boss encounters of the game,
# which hold the exam statements) that require it, with the exam's points and a time budget of 2 minutes per point
# (QM exams: about 80 points in 3 hours). Executed at the end of build.py; adds d['asked'] = [{exam, boss, parts, points, minutes}].
import glob as _glob, re as _re
_BOSS = {}
for _f in _glob.glob(os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../../../game/content/qm/*.json')):
    _x = json.load(open(_f, encoding='utf-8'))
    if isinstance(_x, dict):
        for _e in _x.get('encounters', []):
            if _e['type'] == 'boss': _BOSS[_e['id']] = _e
ASKED = {  # derivation id -> [(boss id, statement indices: context lines first, then the sub-questions)]
    'ho-spectrum': [('qm-ho-b1', [0, 1, 2, 3])],
    'am-spectrum': [('qm-am-b2', [0, 1, 2, 3]), ('qm-ent-b1', [0, 1, 2])],
    'coherent': [('qm-ho-b2', [0, 4])],
    'box': [('qm-wm-b1', [0, 1]), ('qm-wm-b2', [0, 1])],
    'pt-nondeg': [('qm-pf-b1', [0, 1]), ('qm-pf-b3', [0, 1])],
    'spin-dot': [('qm-sa-b1', [0, 1, 2])],
    'heisenberg-ho': [('qm-ho-b2', [0, 3]), ('qm-fu-b2', [0, 1, 2])],
    'cg-1-half': [('qm-sa-b3', [1, 2])],
    'robertson': [('qm-fu-b1', [0, 1, 2])],
    'ehrenfest': [('qm-ho-b3', [0, 1])],
    'continuity': [('qm-wm-b3', [0, 1])],
}
def _pts(s):
    m = _re.search(r'\[(\d+)\s*(?:pt|points?|Punkte)\]|\[(\d+)p\]', s)
    return int(m.group(1) or m.group(2)) if m else 0
def _exam(b):
    m = _re.search(r'\(([^()]*\d\d[^()]*)\)\s*$', b['title'])
    return _re.sub(r',\s*\d+\s*pt$', '', m.group(1)) if m else b['title']
for d in DERIVS:
    out = []
    for bid, idx in ASKED.get(d['id'], []):
        b = _BOSS[bid]; parts = [b['statement'][i] for i in idx]; pts = sum(_pts(p) for p in parts)
        out.append({'exam': _exam(b), 'boss': bid, 'parts': parts, 'points': pts, 'minutes': max(6, 2 * pts) if pts else 10})
    if out: d['asked'] = out
