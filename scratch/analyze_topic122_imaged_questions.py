import json

with open('scratch/topic122_questions_detail.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

imaged = [q for q in questions if q['img'] and q['img'].strip()]
print(f"Total imaged questions in Topic 122: {len(imaged)}")
for q in imaged:
    print(f"QID {q['id']}: Img: {q['img']} | Title: {q['title']}")
    print(f"  Text: {q['text'][:120]}...")
    print(f"  Ans: {q['answer']}")
    print("-" * 50)
