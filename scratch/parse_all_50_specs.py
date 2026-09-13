import json
import re

with open('scratch/t137_svg_analysis.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

parsed_specs = []

for idx, item in enumerate(items, 1):
    fname = item['fname']
    qid = item['qid']
    qtext = item['question_text']
    ans = item['answer']
    
    # Identify type by title or index modulo 10
    type_idx = (idx - 1) % 10 + 1
    
    spec = {
        'index': idx,
        'fname': fname,
        'qid': qid,
        'type_idx': type_idx,
        'question_text': qtext,
        'answer': ans,
    }
    
    # Extract numbers from question text
    nums = re.findall(r'\b\d+(?:\.\d+)?\b', qtext)
    spec['numbers_in_text'] = nums
    parsed_specs.append(spec)

with open('scratch/parsed_t137_specs.json', 'w', encoding='utf-8') as f:
    json.dump(parsed_specs, f, indent=2, ensure_ascii=False)

print(f"Parsed specs for {len(parsed_specs)} questions.")
