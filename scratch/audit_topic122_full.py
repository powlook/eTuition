import json
import re

with open('scratch/topic122_questions_detail.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

for q in questions:
    qid = q['id']
    title = q['title']
    text = q['text']
    img = q['img']
    opts = q['options']
    ans = q['answer']
    steps = q['steps']
    formula = q['formula']
    
    print(f"=== QID {qid} ===")
    print(f"Title: {title}")
    print(f"Image: {img}")
    print(f"Text: {text}")
    print(f"Options: {opts}")
    print(f"Answer: {ans}")
    print(f"Formula: {formula}")
    print(f"Steps: {steps}")
    print("=" * 70)
