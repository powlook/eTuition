import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scratch/t154_all_questions_dump.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

for idx, q in enumerate(questions, 1):
    print(f"=== Q{idx} [ID: {q['id']}] {q['title']} ===")
    print(f"Text: {q['question_text']}")
    print(f"Formula: {q['math_formula']}")
    print(f"Current Options: {q['options']}")
    print(f"Current Correct: {q['correct_answer']}")
    print()
