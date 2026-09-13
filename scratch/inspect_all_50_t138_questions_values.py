import json
import re

with open('scratch/t138_svg_analysis.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

print(f"Loaded {len(items)} questions for Topic 138.")

with open('scratch/t138_all_50_values.txt', 'w', encoding='utf-8') as out:
    for item in items:
        idx = int(re.search(r'q(\d+)', item['fname']).group(1))
        qtext = item['question_text']
        ans = item['answer']
        out.write(f"Q{idx:02d} (QID {item['qid']}): {qtext[:100]}...\n")
        out.write(f"     Ans: {ans}\n")

print("Wrote scratch/t138_all_50_values.txt")
