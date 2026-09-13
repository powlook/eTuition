import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scratch/t156_full_audit.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

for idx, q in enumerate(questions, 1):
    print(f"[{idx:02d}] ID: {q['id']} | Title: {q['title']}")
    print(f"     Text: {q['question_text']}")
    print(f"     Formula: {q['math_formula']}")
    print(f"     Opts: {q['options']}")
    print(f"     Correct: {q['correct_answer']}")
    print("-" * 80)
