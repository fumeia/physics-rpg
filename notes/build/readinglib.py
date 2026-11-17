"""Shared helper for guided-reading cards (see notes/solid-state/build/reading/build.py for the format and the rules).
card(...) returns {room, enc}; the encounter is a lesson with tier 'reading', reading: True and week (the campaign week whose
first run stop it becomes). pages is 'lo–hi' (en dash) in the script; source_file is the script or textbook."""


def card(id, week, room, sec, pages, title, before, look, think, checks, slips=(), minutes=None, source_file='', book='Script'):
    blocks = [{'kind': 'before', 'html': '<ul>' + ''.join(f'<li>{q}</li>' for q in before) + '</ul>'},
              {'kind': 'read', 'html': f'<b>{book} {sec}, pp. {pages}.</b> ' + look}]
    for q, a in think:
        blocks.append({'kind': 'think', 'html': f'{q}<details><summary>Show the answer</summary>{a}</details>'})
    for s in slips: blocks.append({'kind': 'slip', 'html': s})
    lo, hi = (int(x) for x in pages.split('–'))
    enc = {'type': 'lesson', 'tier': 'reading', 'reading': True, 'week': week, 'id': id, 'title': f'Read {sec}: {title}',
           'minutes': minutes or max(15, min(45, 4 * (hi - lo + 1))), 'xp': 15, 'pages': pages,
           'source': [{'file': source_file, 'where': f'{sec}, pp. {pages}'}], 'blocks': blocks,
           'check': [{'q': q, 'options': o, 'correct': 0, 'explain': e} for q, o, e in checks]}
    return {'room': room, 'enc': enc}


def write(path, items, about):
    import json, os
    weeks = {}
    for it in items: weeks.setdefault(str(it['enc']['week']), []).append(it['enc']['id'])
    ids = [it['enc']['id'] for it in items]; assert len(ids) == len(set(ids)), 'duplicate card id'
    with open(path, 'w') as f: json.dump({'about': about, 'items': items, 'weeks': weeks}, f, ensure_ascii=False, indent=1)
    print(len(items), 'reading cards ->', os.path.relpath(path), {k: len(v) for k, v in sorted(weeks.items(), key=lambda kv: int(kv[0]))})
