import json

with open('scratch/flagged_t137_images.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

with open('scratch/samples_out.txt', 'w', encoding='utf-8') as out:
    for item in items[:15]:
        out.write(f"=== File: {item['fname']} | QID: {item['qid']} ===\n")
        out.write(f"Question: {item['qtext']}\n")
        out.write(f"Answer: {item['ans']}\n")
        out.write(f"SVG Texts: {item['svg_texts']}\n")
        out.write("-" * 60 + "\n")

print("Saved scratch/samples_out.txt")

