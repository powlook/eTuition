import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scratch/t155_dump.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

for idx in range(1, 26):
    q = questions[idx - 1]
    print(f"[{idx:02d}] ID: {q['id']} | Title: {q['title']}")
    print(f"     Text: {q['text'] if 'text' in q else q['question_text']}")
    print(f"     Formula: {q['math_formula']}")
    print("-" * 70)
