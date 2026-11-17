"""Build game/content/qm/sheets.json from qm_sheets_*.py: every question of the QM I exercise sheets as an encounter
(derive type, flag sheet) in its room, with the related encounters of the game for the two-way links.
Run: python3 build.py"""
import os, glob, importlib, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from qm_sheet_lib import ROMAN, build
from qm_primers import PRIMERS
try: from qm_hints import HINTS
except ImportError: HINTS = {}
for f in sorted(glob.glob(os.path.join(HERE, 'qm_sheets_*.py'))):
    importlib.import_module(os.path.basename(f)[:-3])
build(os.path.join(HERE, '../../../../game/content/qm/sheets.json'), prefix='qm', title='QM I exercise sheets',
      note='The HS25 sheets of Prof. Gaberdiel, used again this year. Due dates are last year\'s shifted by one year (same weekday); each question opens with links to the lessons and exercises of the game that belong to it.',
      source=lambda s, q: {'file': f"materials/quantum-mechanics/exercises/Exercises {s['n']}.pdf", 'where': f"Exercise sheet {ROMAN[s['n']]}, Question {q['q']}; official solution: Solutions {s['n']}.pdf"},
      primers=PRIMERS, hints=HINTS)
