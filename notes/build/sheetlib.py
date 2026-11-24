"""Shared builder for the weekly exercise sheets of every course (game/content/<course>/sheets.json).

A course keeps its sheet text in notes/<course>/build/sheets/*_sheets_*.py, which call S(...) and Q(...) from here, and a
small build.py that calls build(...). Optional extras per question, keyed by (sheet, question):
  primers[(n, q)] = HTML "Theory first" text
  hints[(n, q)]   = [[hint, hint, hint], ...]  one list of graded hints (nudge, method, key step) per part, in part order
  explain[(n, q)] = [html or None, ...]  per part: the reference step explained in plain words (why this step, what each
                    symbol means, the algebra in between); shown under the revealed step as "Explain this step"
Format of the output and of the encounters: docs/CONTENT.md, "Exercise sheets"."""
import json, os

SHEETS = []
ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV']


def Q(q, title, room, related, statement, parts, keys, xp=None, hints=None, source=None, figure=None, num=None):
    """One question. parts = [(prompt, reference solution)], keys = key points of a full-marks solution.
    hints here is the list of "Given" lines printed under the goal (kept under its old name for the QM files).
    num: the number printed on this year's sheet when it differs from q (q stays the stable id, so progress is kept)."""
    return dict(q=q, title=title, room=room, related=related, statement=statement, parts=parts, keys=keys, xp=xp,
                hints=hints or [], source=source, figure=figure, num=num)


def S(n, title, due, questions):
    SHEETS.append(dict(n=n, title=title, due=due, questions=questions))


def build(dst, *, prefix, title, note, source, primers=None, hints=None, explain=None, due_shift_days=None, sheets=None):
    """Write sheets.json. source(sheet, question) -> {'file':..., 'where':...}; a question's own source= wins.
    due_shift_days: days added to every due date in the game (omit for the game default of 364: last year's sheets)."""
    primers, hints, explain = primers or {}, hints or {}, explain or {}
    sheets = sorted(SHEETS if sheets is None else sheets, key=lambda s: s['n'])
    out = {'title': title, 'note': note, 'sheets': []}
    if due_shift_days is not None: out['dueShiftDays'] = due_shift_days
    for s in sheets:
        qs = []
        for q in s['questions']:
            n = len(q['parts']); xp = q['xp'] or min(60, 15 + 8 * n); key = (s['n'], q['q'])
            steps = [{'prompt': p, 'reveal': r} for p, r in q['parts']]
            if key in hints:
                assert len(hints[key]) == n, f'{prefix} sheet {key}: {len(hints[key])} hint lists for {n} parts'
                for st, h in zip(steps, hints[key]): st['hints'] = list(h)
            if key in explain:
                assert len(explain[key]) == n, f'{prefix} sheet {key}: {len(explain[key])} explanations for {n} parts'
                for st, x in zip(steps, explain[key]):
                    if x: st['explain'] = x
            enc = {'type': 'derive', 'sheet': True, 'id': f"{prefix}-sheet-s{s['n']}q{q['q']}", 'title': f"Sheet {s['n']} Q{q.get('num') or q['q']}: {q['title']}", 'xp': xp,
                   'source': q['source'] or source(s, q), 'goal': q['statement'], 'given': q['hints'], 'steps': steps, 'keyPoints': q['keys']}
            if q['figure']: enc['figure'] = q['figure']
            if key in primers: enc['primer'] = primers[key]
            qs.append({'q': q.get('num') or q['q'], 'title': q['title'], 'room': q['room'], 'related': q['related'], 'enc': enc})
        out['sheets'].append({'n': s['n'], 'title': s['title'], 'due': s['due'], 'questions': qs})
    with open(dst, 'w') as fh: json.dump(out, fh, ensure_ascii=False, indent=1)
    print(sum(len(s['questions']) for s in out['sheets']), 'questions in', len(out['sheets']), 'sheets ->', os.path.normpath(dst))
    return out
