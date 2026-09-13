import json
import re

with open('scratch/topic137_questions.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

print(f"Total Topic 137 questions: {len(questions)}")

with open('scratch/t137_all_questions_detail.txt', 'w', encoding='utf-8') as out:
    for i, q in enumerate(questions, 1):
        qid = q['id']
        title = q['title']
        text = q['text']
        img = q['img']
        ans = q['answer']
        opts = q['options']
        
        out.write(f"[{i}/50] QID {qid}: {title}\n")
        out.write(f"  Image: {img}\n")
        out.write(f"  Text: {text}\n")
        out.write(f"  Answer: {ans}\n")
        out.write(f"  Options: {opts}\n")
        out.write("-" * 60 + "\n")

print("Wrote scratch/t137_all_questions_detail.txt")
