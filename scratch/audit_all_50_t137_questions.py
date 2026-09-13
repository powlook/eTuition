import json
import re

with open('scratch/t137_svg_analysis.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

print(f"Total items analyzed: {len(items)}")

with open('scratch/all_50_audit_out.txt', 'w', encoding='utf-8') as out:
    for item in items:
        fname = item['fname']
        qid = item['qid']
        qtext = item['question_text']
        ans = item['answer']
        texts = item['svg_texts']
        out.write(f"[{fname}] QID {qid}\n")
        out.write(f"  QText: {qtext}\n")
        out.write(f"  Ans: {ans}\n")
        out.write(f"  Texts: {texts}\n")
        out.write("-" * 50 + "\n")

print("Wrote scratch/all_50_audit_out.txt")

