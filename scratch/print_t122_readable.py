import json

with open('scratch/t122_all_50.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

with open('scratch/t122_all_50_readable.txt', 'w', encoding='utf-8') as out:
    for i, q in enumerate(questions, 1):
        out.write(f"[{i}] QID {q['id']}: {q['title']}\n")
        out.write(f"  Image: {q['img']}\n")
        out.write(f"  Text: {q['text']}\n")
        out.write(f"  Opts: {q['options']}\n")
        out.write(f"  Ans: {q['answer']}\n")
        out.write("-" * 60 + "\n")

print("Wrote scratch/t122_all_50_readable.txt")
