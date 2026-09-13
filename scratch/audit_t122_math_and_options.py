import json
import re
import math

with open('scratch/t122_all_50.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

print(f"Auditing {len(questions)} questions in Topic 122...")

for i, q in enumerate(questions, 1):
    qid = q['id']
    text = q['text']
    img = q['img']
    opts = q['options']
    ans = q['answer']
    
    # 1. Stem-and-leaf median questions
    if "stem-and-leaf plot representing quiz scores of 8 students" in text:
        # Extract stems:
        # e.g. Stem 4 | 2, 5; Stem 5 | 1, 3, 8; Stem 6 | 0, 4, 7
        stems = re.findall(r'Stem\s*(\d+)\s*\|\s*([0-9,\s]+)', text)
        values = []
        for s, leaves_str in stems:
            stem_val = int(s)
            leaves = [int(l.strip()) for l in leaves_str.replace('\n','').split(',') if l.strip()]
            for l in leaves:
                values.append(stem_val * 10 + l)
        values.sort()
        if len(values) == 8:
            v4, v5 = values[3], values[4]
            calc_med = (v4 + v5) / 2.0
            calc_med_str = f"Median score = {calc_med:g}"
            print(f"[{i}] QID {qid} (Stem-and-Leaf Median):")
            print(f"  Values: {values}")
            print(f"  Middle values: 4th={v4}, 5th={v5} -> Calc Median = {calc_med}")
            print(f"  DB Answer: {ans}")
            if ans != calc_med_str:
                print(f"  *** MISMATCH DETECTED! DB Ans '{ans}' != Calc '{calc_med_str}' ***")
            print("-" * 50)
            
    # 2. Pie Chart Central Angle questions
    elif "pie chart (circle graph), what is the central sector angle" in text:
        m = re.search(r'survey of \$?(\d+)\$? students, \$?(\d+)\$? students selected (\w+)', text)
        if m:
            total, part, subject = int(m.group(1)), int(m.group(2)), m.group(3)
            calc_angle = (part / total) * 360.0
            calc_angle_str = f"Central angle = {calc_angle:g}°"
            print(f"[{i}] QID {qid} (Pie Chart Sector Angle):")
            print(f"  Survey: {part} out of {total} for {subject}")
            print(f"  Calc Angle = {part}/{total} * 360° = {calc_angle}°")
            print(f"  DB Answer: {ans}")
            if f"{calc_angle:g}" not in ans:
                print(f"  *** MISMATCH DETECTED! DB Ans '{ans}' != Calc '{calc_angle_str}' ***")
            print("-" * 50)

    # 3. Frequency Distribution Table Class Width questions
    elif "class intervals" in text.lower() and "minimum score" in text.lower():
        m = re.search(r'minimum score is \$?(\d+)\$? and the maximum score is \$?(\d+)\$?.+?(\d+) equal class intervals', text)
        if m:
            min_v, max_v, k_v = int(m.group(1)), int(m.group(2)), int(m.group(3))
            calc_w = math.ceil((max_v - min_v) / k_v)
            calc_w_str = f"Class width w = {calc_w}"
            print(f"[{i}] QID {qid} (Class Width):")
            print(f"  Min={min_v}, Max={max_v}, k={k_v} -> Range={max_v-min_v}, w=ceil({(max_v-min_v)/k_v:.2f})={calc_w}")
            print(f"  DB Answer: {ans}")
            if str(calc_w) not in ans:
                print(f"  *** MISMATCH DETECTED! DB Ans '{ans}' != Calc '{calc_w_str}' ***")
            print("-" * 50)

    # 4. Relative Frequency Percentage questions
    elif "relative frequency percentage" in text.lower():
        m = re.search(r'frequencies \$?(\d+)\$?, \$?(\d+)\$?, \$?(\d+)\$?, and \$?(\d+)\$?.+?percentage of the (1st|2nd|3rd|4th) class', text)
        if m:
            f1, f2, f3, f4 = int(m.group(1)), int(m.group(2)), int(m.group(3)), int(m.group(4))
            ord_map = {'1st': 0, '2nd': 1, '3rd': 2, '4th': 3}
            idx = ord_map[m.group(5)]
            freqs = [f1, f2, f3, f4]
            tot = sum(freqs)
            tf = freqs[idx]
            calc_pct = (tf / tot) * 100.0
            print(f"[{i}] QID {qid} (Relative Frequency):")
            print(f"  Freqs={freqs}, target {m.group(5)} class ({tf}/{tot}) -> {calc_pct:.1f}%")
            print(f"  DB Answer: {ans}")
            if f"{calc_pct:g}" not in ans:
                print(f"  *** MISMATCH DETECTED! DB Ans '{ans}' != Calc '{calc_pct}%' ***")
            print("-" * 50)
