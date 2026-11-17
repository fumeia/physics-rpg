"""Registry for the solid-state exercise sheets (ss_sheets_*.py). The shared code lives in notes/build/sheetlib.py."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../../build'))
from sheetlib import SHEETS, Q, S, build  # noqa: F401


def F(name, alt, width=None):
    """A figure cropped from the sheet or its solution (game/content/solid-state/fig/<name>.png, made by figures.py)."""
    w = f' style="max-width:{width}px"' if width else ''
    return f'<img class="fig" src="content/solid-state/fig/{name}.png" alt="{alt}"{w}>'
