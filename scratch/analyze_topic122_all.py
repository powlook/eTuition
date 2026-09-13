import json
import re

with open('scratch/topic122_questions_detail.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

for i, q in enumerate(questions, 1):
    qid = q['id']
    title = q['title']
    text = q['text']
    img = q['img']
    opts = q['options']
    ans = q['answer']
    print(f"[{i}/50] QID: {qid} | Title: {title}")
    print(f"  Image: {img}")
    print(f"  Text: {text}")
    print(f"  Options: {opts}")
    print(f"  Answer: {ans}")
    print("-" * 60)
