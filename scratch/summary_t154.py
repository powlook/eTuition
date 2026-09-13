import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scratch/t154_excel_dump.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

for idx, q in enumerate(questions, 1):
    print(f"[{idx:02d}] ID: {q['id']} | Title: {q['title']}")
    print(f"     Text: {q['text']}")
    print("-" * 80)
