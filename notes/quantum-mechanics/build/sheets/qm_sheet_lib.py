"""Tiny registry for the QM exercise-sheet content (qm_sheets_*.py) and the builder (build.py)."""
SHEETS = []
ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV']

def Q(q, title, room, related, statement, parts, keys, xp=None, hints=None):
    return dict(q=q, title=title, room=room, related=related, statement=statement, parts=parts, keys=keys, xp=xp, hints=hints or [])

def S(n, title, due, questions):
    SHEETS.append(dict(n=n, title=title, due=due, questions=questions))
