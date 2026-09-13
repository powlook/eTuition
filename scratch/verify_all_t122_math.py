import json
import re
import math

with open('scratch/t122_all_50.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

for q in questions:
    qid = q['id']
    text = q['text']
    ans = q['answer']
    opts = q['options']
    
    # Class width questions
    if "Class width" in ans or "class width" in text.lower():
        # extract min and max score
        nums = re.findall(r'\$?(\d+)\$?', text)
        # e.g. min score 35 max score 87, 5 class intervals
        m = re.search(r'minimum score is \$?(\d+)\$? and the maximum score is \$?(\d+)\$?.+?(\d+) equal class intervals', text)
        if m:
            min_v, max_v, k_v = int(m.group(1)), int(m.group(2)), int(m.group(3))
            calc_w = math.ceil((max_v - min_v) / k_v) if 'math' in globals() else int((max_v - min_v) / k_v)
            print(f"QID {qid}: Min={min_v}, Max={max_v}, k={k_v} -> range={max_v-min_v}, (range)/k = {(max_v-min_v)/k_v} | DB Ans: {ans}")
            
    # Relative frequency questions
    if "Relative frequency" in ans or "relative frequency" in text.lower():
        m = re.search(r'frequencies \$?(\d+)\$?, \$?(\d+)\$?, \$?(\d+)\$?, and \$?(\d+)\$?.+?percentage of the (1st|2nd|3rd|4th) class', text)
        if m:
            f1, f2, f3, f4 = int(m.group(1)), int(m.group(2)), int(m.group(3)), int(m.group(4))
            ord_map = {'1st': 0, '2nd': 1, '3rd': 2, '4th': 3}
            target_idx = ord_map[m.group(5)]
            freqs = [f1, f2, f3, f4]
            total = sum(freqs)
            target_f = freqs[target_idx]
            rel_pct = (target_f / total) * 100
            print(f"QID {qid}: Freqs={freqs}, target {m.group(5)} ({target_f}/{total}) -> {rel_pct:.1f}% | DB Ans: {ans}")
