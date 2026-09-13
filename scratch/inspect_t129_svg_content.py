import glob
import os
import re
import json

with open('scratch/topic129_questions.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

svg_files = glob.glob('public/images/g8_t129_q*.svg') + glob.glob('public/images/dp_t129_q*.svg')
print(f"Found {len(svg_files)} SVG files for Topic 129 in public/images")

q_by_img = {}
for q in questions:
    if q['img']:
        img_name = os.path.basename(q['img'])
        q_by_img[img_name] = q

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

with open('scratch/t129_svg_analysis.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

with open('scratch/t129_svg_summary.txt', 'w', encoding='utf-8') as out:
    for r in results:
        out.write(f"File: {r['fname']} | QID: {r['qid']}\n")
        out.write(f"  Question: {r['question_text'][:120]}...\n")
        out.write(f"  Answer: {r['answer']}\n")
        out.write(f"  SVG Texts: {r['svg_texts']}\n")
        out.write("=" * 60 + "\n")

print("Saved scratch/t129_svg_summary.txt")
