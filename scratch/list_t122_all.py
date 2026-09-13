import json

with open('scratch/t122_all_50.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

for i, q in enumerate(questions, 1):
    print(f"[{i}] QID {q['id']}: {q['title']}")
    print(f"  Img: {q['img']}")
    print(f"  Text: {q['text']}")
    print(f"  Opts: {q['options']}")
    print(f"  Ans: {q['answer']}")
    print("=" * 60)
