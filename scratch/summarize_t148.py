import json

with open("scratch/t148_raw_dump.json", "r", encoding="utf-8") as f:
    qs = json.load(f)

lines = []
for i, q in enumerate(qs, 1):
    lines.append(f"=== Question #{i} | ID: {q['id']} | Title: {q['title']} ===")
    lines.append(f"Text: {q['question_text']}")
    lines.append(f"Formula: {q['math_formula']}")
    lines.append(f"Options: {q['options']}")
    lines.append(f"Correct Ans: {q['correct_answer']}")
    lines.append(f"Show Img: {q['show_image']} | URL: {q['image_url']}")
    lines.append("")

with open("scratch/t148_audit_summary.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(lines))

print("Saved scratch/t148_audit_summary.txt")
