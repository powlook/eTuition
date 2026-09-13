import json

with open('scratch/t134_full_audit.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

with open('scratch/t134_audit_summary.txt', 'w', encoding='utf-8') as out:
    for item in items:
        out.write(f"Q{item['num']:02d} (ID {item['id']}): {item['title']}\n")
        out.write(f"   Text: {item['text']}\n")
        out.write(f"   Ans:  {item['ans']}\n")
        out.write(f"   Opts: {item['opts']}\n")
        out.write(f"   Img:  {item['img']}\n")
        out.write(f"   SVG Texts: {item['svg_texts']}\n")
        out.write("-" * 60 + "\n")

print("Wrote t134_audit_summary.txt")
