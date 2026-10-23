S = "materials/solid-state/scripts/Script-2026_2026-09-01.pdf"
HS20 = "materials/solid-state/old-exams/HS20.pdf"
JAN = "materials/solid-state/old-exams/HS23.pdf"
AUG = "materials/solid-state/old-exams/HS23 (1).pdf"
CH = "materials/astrophysics/scripts/Choudhuri_Textbook.pdf"
def src(file, where): return dict(file=file, where=where)
def T(html): return dict(kind='text', html=html)
def I(html): return dict(kind='intuition', html=html)
def P(html): return dict(kind='pitfall', html=html)
def F(html): return dict(kind='figure', html=html)
def X(html): return dict(kind='exam', html=html)
def EQ(tex, label=None):
    d = dict(kind='eq', tex=tex)
    if label: d['label'] = label
    return d
def Q(q, options, correct, explain, source=None):
    d = dict(q=q, options=options, correct=correct, explain=explain)
    if source: d['source'] = source
    return d
def lesson(id, title, tier, minutes, xp, source, blocks, check):
    return dict(type='lesson', id=id, title=title, tier=tier, minutes=minutes, xp=xp, source=source, blocks=blocks, check=check)
def quiz(id, title, xp, source, questions, passMark=0.75):
    return dict(type='quiz', id=id, title=title, xp=xp, passMark=passMark, source=source, questions=questions)
def derive(id, title, xp, source, goal, given, steps, keyPoints):
    return dict(type='derive', id=id, title=title, xp=xp, source=source, goal=goal, given=given,
                steps=[dict(prompt=p, reveal=r) for p, r in steps], keyPoints=keyPoints)
