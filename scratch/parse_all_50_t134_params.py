import json
import re

with open('scratch/t134_svg_analysis.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

print(f"Loaded {len(items)} questions for Topic 134.")

parsed_items = []

for idx, item in enumerate(items, 1):
    qtext = item['question_text']
    ans = item['answer']
    fname = item['fname']
    qid = item['qid']
    type_idx = (idx - 1) % 10 + 1
    
    param = {'idx': idx, 'fname': fname, 'qid': qid, 'type_idx': type_idx, 'qtext': qtext, 'ans': ans}
    
    # Extract equations from question text e.g. \{ 2x - y = 4 \,;\, 4x - 2y = 8 \}
    m = re.search(r'\\\{\s*(.+?)\s*\\;\\\s*(.+?)\s*\\\}', qtext)
    if m:
        param['eq1'] = m.group(1).replace('`','').strip()
        param['eq2'] = m.group(2).replace('`','').strip()
    else:
        # try word problem parsing
        if type_idx == 7:
            # sum and difference
            m_sum = re.search(r'sum.+?is\s*(\d+)', qtext)
            m_diff = re.search(r'difference.+?is\s*(\d+)', qtext)
            if m_sum and m_diff:
                param['eq1'] = f"x + y = {m_sum.group(1)}"
                param['eq2'] = f"x - y = {m_diff.group(1)}"
        elif type_idx == 8:
            m_b = re.findall(r'(\d+)\s*burgers?\s*and\s*(\d+)\s*juice drinks?\s*cost\s*₱?(\d+)', qtext)
            if len(m_b) >= 2:
                param['eq1'] = f"{m_b[0][0]}b + {m_b[0][1]}d = {m_b[0][2]}"
                param['eq2'] = f"{m_b[1][0]}b + {m_b[1][1]}d = {m_b[1][2]}"
        elif type_idx == 9:
            # boat
            m_d = re.findall(r'(\d+)\s*km', qtext)
            m_t = re.findall(r'(\d+)\s*hours?', qtext)
            if m_d and len(m_t) >= 2:
                d_val = int(m_d[0])
                t1, t2 = int(m_t[0]), int(m_t[1])
                rate1 = d_val // t1
                rate2 = d_val // t2
                param['eq1'] = f"b + c = {rate1}"
                param['eq2'] = f"b - c = {rate2}"
        elif type_idx == 10:
            # chemist
            m_p = re.findall(r'(\d+)%', qtext)
            m_tot = re.search(r'(\d+)\s*liters?', qtext)
            if len(m_p) >= 3 and m_tot:
                p1, p2, p3 = int(m_p[0]), int(m_p[1]), int(m_p[2])
                tot = int(m_tot.group(1))
                sol_tot = (p3 / 100.0) * tot
                param['eq1'] = f"x + y = {tot}"
                param['eq2'] = f"{p1/100:.1f}x + {p2/100:.1f}y = {sol_tot:g}"
                
    parsed_items.append(param)

with open('scratch/t134_parsed_params.json', 'w', encoding='utf-8') as f:
    json.dump(parsed_items, f, indent=2, ensure_ascii=False)

print(f"Successfully parsed parameters for {len(parsed_items)} questions!")
