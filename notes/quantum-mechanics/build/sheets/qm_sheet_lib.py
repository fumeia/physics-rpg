"""Registry for the QM exercise-sheet content (qm_sheets_*.py). The shared code lives in notes/build/sheetlib.py."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../../build'))
from sheetlib import SHEETS, ROMAN, Q, S, build  # noqa: F401
