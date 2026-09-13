import json

with open('scratch/t138_svg_analysis.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

with open('scratch/t138_10_types_out.txt', 'w', encoding='utf-8') as out:
    for i in range(10):
        item = items[i]
        out.write(f"=== Type {i+1}: {item['fname']} (QID {item['qid']}) ===\n")
        out.write(f"Question: {item['question_text']}\n")
        out.write(f"Answer: {item['answer']}\n")
        out.write(f"Current SVG Texts: {item['svg_texts']}\n")
        out.write("=" * 70 + "\n")

print("Saved scratch/t138_10_types_out.txt")
