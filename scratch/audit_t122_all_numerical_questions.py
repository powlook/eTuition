import json
import re
import math

with open('scratch/t122_all_50.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

for i, q in enumerate(questions, 1):
    qid = q['id']
    text = q['text']
    opts = q['options']
    ans = q['answer']
    title = q['title']
    img = q['img']
    
    # 1. Pie Chart Sector Angle
    if "pie chart" in text.lower() and ("sector angle" in text.lower() or "central angle" in text.lower() or "central sector angle" in text.lower()):
        # Find numbers
        m = re.search(r'(\d+)\s*students,\s*(\d+)\s*students selected (\w+)', text)
        if m:
            tot = int(m.group(1))
            part = int(m.group(2))
            subj = m.group(3)
            calc_angle = (part / tot) * 360.0
            print(f"[{i}] QID {qid} ({title}): {part}/{tot} for {subj} -> Calc = {calc_angle}° | DB Ans = {ans}")
            
    # 2. Class Width
    if "class width" in text.lower() or "class intervals" in text.lower():
        m = re.search(r'minimum score is\s*\$?(\d+)\$?\s*and the maximum score is\s*\$?(\d+)\$?.+?(\d+)\s*equal class intervals', text, re.DOTALL)
        if m:
            min_v = int(m.group(1))
            max_v = int(m.group(2))
            k_v = int(m.group(3))
            calc_w = math.ceil((max_v - min_v) / k_v)
            print(f"[{i}] QID {qid} ({title}): Min={min_v}, Max={max_v}, k={k_v} -> Range={max_v-min_v}, Calc w={calc_w} | DB Ans = {ans}")

    # 3. Relative Frequency
    if "relative frequency" in text.lower():
        m = re.search(r'frequencies\s*\$?(\d+)\$?,\s*\$?(\d+)\$?,\s*\$?(\d+)\$?,\s*and\s*\$?(\d+)\$?.+?percentage of the\s*(1st|2nd|3rd|4th)\s*class', text, re.DOTALL)
        if m:
            f1, f2, f3, f4 = int(m.group(1)), int(m.group(2)), int(m.group(3)), int(m.group(4))
            ord_map = {'1st': 0, '2nd': 1, '3rd': 2, '4th': 3}
            idx = ord_map[m.group(5)]
            freqs = [f1, f2, f3, f4]
            tot = sum(freqs)
            tf = freqs[idx]
            calc_pct = (tf / tot) * 100.0
            print(f"[{i}] QID {qid} ({title}): Freqs={freqs}, target {m.group(5)} ({tf}/{tot}) -> Calc = {calc_pct:.1f}% | DB Ans = {ans}")
