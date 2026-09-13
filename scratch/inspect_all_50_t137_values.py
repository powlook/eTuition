import json
import re

with open('scratch/t137_svg_analysis.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

print(f"Loaded {len(items)} questions.")

with open('scratch/all_50_values.txt', 'w', encoding='utf-8') as out:
    for item in items:
        idx = int(re.search(r'q(\d+)', item['fname']).group(1))
        qtext = item['question_text']
        ans = item['answer']
        out.write(f"Q{idx:02d} (QID {item['qid']}): {qtext[:100]}...\n")
        out.write(f"     Ans: {ans}\n")

print("Wrote scratch/all_50_values.txt")

