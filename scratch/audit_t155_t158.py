import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

def audit_topic(top_id):
    with open(f'scratch/t{top_id}_dump.json', 'r', encoding='utf-8') as f:
        questions = json.load(f)
    print(f"=================== TOPIC {top_id} (Total {len(questions)}) ===================")
    for idx, q in enumerate(questions, 1):
        print(f"[{top_id}-Q{idx:02d}] ID: {q['id']} | Title: {q['title']}")
        print(f"  Text: {q['question_text']}")
        print(f"  Formula: {q['math_formula']}")
        print(f"  Opts: {q['options']}")
        print(f"  Correct: {q['correct_answer']}")
        print("-" * 60)

if __name__ == "__main__":
    for t in [155, 156, 157, 158]:
        audit_topic(t)
