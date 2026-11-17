"""Build game/content/solid-state/sheets.json from ss_sheets_*.py: every question of the weekly problem sets of
"Introduction to Solid State Physics" (Degen, HS26) as a sheet encounter in its room. Run: python3 build.py
The figures are cropped from the sheet PDFs by figures.py (needs the PDFs, which are not in the repository)."""
import os, glob, importlib, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from ss_sheet_lib import build
try: from ss_primers import PRIMERS
except ImportError: PRIMERS = {}
try: from ss_hints import HINTS
except ImportError: HINTS = {}
for f in sorted(glob.glob(os.path.join(HERE, 'ss_sheets_*.py'))):
    importlib.import_module(os.path.basename(f)[:-3])
build(os.path.join(HERE, '../../../../game/content/solid-state/sheets.json'), prefix='ss', title='Solid state weekly problem sets',
      note='The HS26 problem sets of Prof. Degen (this semester). Due dates are estimated as the Friday of the week after the sheet’s lecture week: tell Claude the real weekday if it differs. Sheets 1 and 2 are reconstructed from their official solutions; the solution of sheet 9 is our own until the official one is released.',
      source=lambda s, q: {'file': f"Exercises/Weekly Problem Set {s['n']}.pdf", 'where': f"Weekly Problem Set {s['n']}, Exercise {q['q']}"},
      primers=PRIMERS, hints=HINTS, due_shift_days=0)
