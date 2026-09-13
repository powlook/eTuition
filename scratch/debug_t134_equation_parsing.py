import json

with open('scratch/topic134_questions.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

with open('scratch/debug_out.txt', 'w', encoding='utf-8') as out:
    for q in questions[:10]:
        out.write(f"QID {q['id']}: {q['title']}\n")
        out.write(f"  Text: {q['text']}\n")
        out.write("-" * 50 + "\n")

print("Saved scratch/debug_out.txt")

