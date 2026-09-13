import json
import re

with open('scratch/topic134_questions.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

for idx, q in enumerate(questions, 1):
    qtext = q['text']
    type_idx = (idx - 1) % 10 + 1
    
    eq1, eq2 = None, None
    # match \{ eq1 \; eq2 \}
    m = re.search(r'\\\{\s*(.+?)\s*\\?;\\?\s*(.+?)\s*\\\}', qtext)
    if m:
        eq1 = m.group(1).replace('\\,', '').replace('\\', '').strip()
        eq2 = m.group(2).replace('\\,', '').replace('\\', '').strip()
    elif type_idx == 7:
        m_sum = re.search(r'sum.+?is\s*(\d+)', qtext)
        m_diff = re.search(r'difference.+?is\s*(\d+)', qtext)
        if m_sum and m_diff:
            eq1 = f"x + y = {m_sum.group(1)}"
            eq2 = f"x - y = {m_diff.group(1)}"
    elif type_idx == 8:
        m_b = re.findall(r'(\d+)\s*burgers?\s*and\s*(\d+)\s*juice drinks?\s*cost\s*\$?₱?(\d+)', qtext)
        if len(m_b) >= 2:
            eq1 = f"{m_b[0][0]}b + {m_b[0][1]}d = {m_b[0][2]}"
            eq2 = f"{m_b[1][0]}b + {m_b[1][1]}d = {m_b[1][2]}"
    elif type_idx == 9:
        m_d = re.findall(r'(\d+)\s*km', qtext)
        m_t = re.findall(r'(\d+)\s*hours?', qtext)
        if m_d and len(m_t) >= 2:
            d_val = int(m_d[0])
            t1, t2 = int(m_t[0]), int(m_t[1])
            eq1 = f"b + c = {d_val // t1}"
            eq2 = f"b - c = {d_val // t2}"
    elif type_idx == 10:
        m_p = re.findall(r'(\d+)%', qtext)
        m_tot = re.search(r'(\d+)\s*liters?', qtext)
        if len(m_p) >= 3 and m_tot:
            p1, p2, p3 = int(m_p[0]), int(m_p[1]), int(m_p[2])
            tot = int(m_tot.group(1))
            sol_tot = int((p3 / 100.0) * tot)
            eq1 = f"x + y = {tot}"
            eq2 = f"{p1/100:g}x + {p2/100:g}y = {sol_tot}"
            
    print(f"[{idx:02d}] QID {q['id']} (Type {type_idx}): eq1='{eq1}', eq2='{eq2}'")
