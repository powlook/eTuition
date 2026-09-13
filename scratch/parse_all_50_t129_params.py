import json
import re

with open('scratch/t129_svg_analysis.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

print(f"Loaded {len(items)} items for Topic 129.")

parsed_items = []

for idx, item in enumerate(items, 1):
    qtext = item['question_text']
    ans = item['answer']
    fname = item['fname']
    qid = item['qid']
    type_idx = (idx - 1) % 10 + 1
    
    param = {'idx': idx, 'fname': fname, 'qid': qid, 'type_idx': type_idx, 'qtext': qtext, 'ans': ans}
    
    if type_idx == 1:
        # Point P(x, y)
        m = re.search(r'P\((-?\d+),\s*(-?\d+)\)', qtext)
        if m:
            param['px'], param['py'] = int(m.group(1)), int(m.group(2))
    elif type_idx == 2:
        # A(x1, y1) and B(x2, y2)
        m = re.search(r'A\((-?\d+),\s*(-?\d+)\).+?B\((-?\d+),\s*(-?\d+)\)', qtext)
        if m:
            param['ax'], param['ay'], param['bx'], param['by'] = int(m.group(1)), int(m.group(2)), int(m.group(3)), int(m.group(4))
    elif type_idx == 3:
        # Midpoint AB joining A(x1, y1) and B(x2, y2)
        m = re.search(r'A\((-?\d+),\s*(-?\d+)\).+?B\((-?\d+),\s*(-?\d+)\)', qtext)
        if m:
            param['ax'], param['ay'], param['bx'], param['by'] = int(m.group(1)), int(m.group(2)), int(m.group(3)), int(m.group(4))
    elif type_idx == 4:
        # Midpoint M(mx, my), P(px, py), find Q
        m = re.search(r'M\((-?\d+),\s*(-?\d+)\).+?P\((-?\d+),\s*(-?\d+)\)', qtext)
        if m:
            param['mx'], param['my'], param['px'], param['py'] = int(m.group(1)), int(m.group(2)), int(m.group(3)), int(m.group(4))
    elif type_idx == 5:
        # Triangle A(0,0), B(b, 0), C(0, c)
        m = re.search(r'A\(0,\s*0\).+?B\((\d+),\s*0\).+?C\(0,\s*(\d+)\)', qtext)
        if m:
            param['bx'], param['cy'] = int(m.group(1)), int(m.group(2))
    elif type_idx == 6:
        # Collinear A(x1, y1), B(x2, y2), C(x3, y3)
        m = re.search(r'A\((-?\d+),\s*(-?\d+)\).+?B\((-?\d+),\s*(-?\d+)\).+?C\((-?\d+),\s*(-?\d+)\)', qtext)
        if m:
            param['ax'], param['ay'], param['bx'], param['by'], param['cx'], param['cy'] = [int(x) for x in m.groups()]
    elif type_idx == 7:
        # Rectangle opposite vertices (x1, y1) and (x2, y2)
        m = re.search(r'\((-?\d+),\s*(-?\d+)\).+?\((-?\d+),\s*(-?\d+)\)', qtext)
        if m:
            param['x1'], param['y1'], param['x2'], param['y2'] = int(m.group(1)), int(m.group(2)), int(m.group(3)), int(m.group(4))
    elif type_idx == 8:
        # Horizontal points P(x1, y1) and Q(x2, y2)
        m = re.search(r'P\((-?\d+),\s*(-?\d+)\).+?Q\((-?\d+),\s*(-?\d+)\)', qtext)
        if m:
            param['px'], param['py'], param['qx'], param['qy'] = int(m.group(1)), int(m.group(2)), int(m.group(3)), int(m.group(4))
    elif type_idx == 9:
        # House (x1, y1) and School (x2, y2)
        m = re.search(r'\((-?\d+),\s*(-?\d+)\).+?\((-?\d+),\s*(-?\d+)\)', qtext)
        if m:
            param['hx'], param['hy'], param['sx'], param['sy'] = int(m.group(1)), int(m.group(2)), int(m.group(3)), int(m.group(4))
    elif type_idx == 10:
        # Diameter A(x1, y1) and B(x2, y2)
        m = re.search(r'A\((-?\d+),\s*(-?\d+)\).+?B\((-?\d+),\s*(-?\d+)\)', qtext)
        if m:
            param['ax'], param['ay'], param['bx'], param['by'] = int(m.group(1)), int(m.group(2)), int(m.group(3)), int(m.group(4))
            
    parsed_items.append(param)

with open('scratch/t129_parsed_params.json', 'w', encoding='utf-8') as f:
    json.dump(parsed_items, f, indent=2, ensure_ascii=False)

print(f"Successfully parsed parameters for {len(parsed_items)} questions!")
