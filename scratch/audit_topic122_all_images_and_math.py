import json
import re
import os

with open('scratch/topic122_questions_detail.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

print(f"Loaded {len(questions)} questions for Topic 122.")

mismatches = []
all_imaged_questions = []

for q in questions:
    qid = q['id']
    title = q['title']
    text = q['text']
    img = q['img']
    opts = q['options']
    ans = q['answer']
    steps = q['steps']
    formula = q['formula']
    
    is_imaged = bool(img and img.strip())
    if is_imaged:
        all_imaged_questions.append(q)
    
    # Check Stem-and-Leaf plot questions
    if "stem-and-leaf" in text.lower():
        # extract stem values from text if present
        stems_in_text = re.findall(r'Stem\s*(\d+)\s*\|\s*([0-9,\s]+)', text)
        key_in_text = re.search(r'Key:\s*\$?(\d+)\s*\\mid\s*(\d+)\s*=\s*(\d+)\$?', text)
        print(f"QID {qid}: Stem-and-Leaf question. Img: '{img}'")
        print(f"  Text stems: {stems_in_text}")
        if key_in_text:
            print(f"  Key: {key_in_text.group(0)}")
        print(f"  Opts: {opts}")
        print(f"  Ans: {ans}")

