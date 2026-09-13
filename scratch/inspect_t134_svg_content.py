import glob
import os
import re
import json

with open('scratch/topic134_questions.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

svg_files = glob.glob('public/images/g8_t134_q*.svg') + glob.glob('public/images/dp_t134_q*.svg')
print(f"Found {len(svg_files)} SVG files for Topic 134 in public/images")

results = []

for q in questions:
    img_url = q['img']
    if not img_url:
        continue
    fname = os.path.basename(img_url)
    fpath = os.path.join('public/images', fname)
    clean_texts = []
    if os.path.exists(fpath):
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()
        raw_texts = re.findall(r'<text[^>]*>(.*?)</text>', content, re.DOTALL)
        clean_texts = [re.sub(r'<[^>]+>', '', t).strip() for t in raw_texts if t.strip()]
    
    results.append({
        'fname': fname,
        'qid': q['id'],
        'question_text': q['text'],
        'answer': q['answer'],
        'svg_texts': clean_texts
    })

with open('scratch/t134_svg_analysis.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

with open('scratch/t138_10_types_out.txt', 'w', encoding='utf-8') as out:
    for i in range(min(10, len(results))):
        r = results[i]
        out.write(f"=== Type {i+1}: {r['fname']} (QID {r['qid']}) ===\n")
        out.write(f"Question: {r['question_text']}\n")
        out.write(f"Answer: {r['answer']}\n")
        out.write(f"Current SVG Texts: {r['svg_texts']}\n")
        out.write("=" * 70 + "\n")

print("Saved scratch/t134_svg_analysis.json")
