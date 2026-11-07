"""Build game/content/qm/sheets.json from qm_sheets_*.py: every question of the QM I exercise sheets as an encounter
(derive type, flag sheet) in its room, with the related encounters of the game for the two-way links.
Run: python3 build.py"""
import json, os, glob, importlib, sys
sys.path.insert(0, os.path.dirname(__file__))
from qm_sheet_lib import SHEETS, ROMAN
for f in sorted(glob.glob(os.path.join(os.path.dirname(__file__), 'qm_sheets_*.py'))):
    importlib.import_module(os.path.basename(f)[:-3])
SHEETS.sort(key=lambda s: s['n'])
out = {'title': 'QM I exercise sheets', 'note': 'The HS25 sheets of Prof. Gaberdiel, used again this year. Due dates are last year\'s shifted by one year (same weekday); each question opens with links to the lessons and exercises of the game that belong to it.', 'sheets': []}
for s in SHEETS:
    qs = []
    for q in s['questions']:
        n = len(q['parts']); xp = q['xp'] or min(60, 15 + 8 * n)
        enc = {'type': 'derive', 'sheet': True, 'id': f"qm-sheet-s{s['n']}q{q['q']}", 'title': f"Sheet {s['n']} Q{q['q']}: {q['title']}", 'xp': xp,
               'source': {'file': f"materials/quantum-mechanics/exercises/Exercises {s['n']}.pdf", 'where': f"Exercise sheet {ROMAN[s['n']]}, Question {q['q']}; official solution: Solutions {s['n']}.pdf"},
               'goal': q['statement'], 'given': q['hints'], 'steps': [{'prompt': p, 'reveal': r} for p, r in q['parts']], 'keyPoints': q['keys']}
        qs.append({'q': q['q'], 'title': q['title'], 'room': q['room'], 'related': q['related'], 'enc': enc})
    out['sheets'].append({'n': s['n'], 'title': s['title'], 'due': s['due'], 'questions': qs})
dst = os.path.join(os.path.dirname(__file__), '../../../../game/content/qm/sheets.json')
with open(dst, 'w') as fh: json.dump(out, fh, ensure_ascii=False, indent=1)
print(sum(len(s['questions']) for s in out['sheets']), 'questions in', len(out['sheets']), 'sheets ->', os.path.normpath(dst))
