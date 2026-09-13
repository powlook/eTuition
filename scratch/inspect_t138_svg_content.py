import glob
import os
import re
import json

svg_files = glob.glob('public/images/g8_t138_q*.svg')
print(f"Found {len(svg_files)} SVG files for Topic 138 in public/images")

with open('scratch/topic138_questions.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

q_by_img = {}
for q in questions:
    if q['img']:
        img_name = os.path.basename(q['img'])
        q_by_img[img_name] = q

results = []

for fpath in sorted(svg_files, key=lambda x: int(re.search(r'q(\d+)', x).group(1)) if re.search(r'q(\d+)', x) else 0):
    fname = os.path.basename(fpath)
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    raw_texts = re.findall(r'<text[^>]*>(.*?)</text>', content, re.DOTALL)
    clean_texts = [re.sub(r'<[^>]+>', '', t).strip() for t in raw_texts if t.strip()]
    
    q_info = q_by_img.get(fname, {})
    q_id = q_info.get('id', 'N/A')
    q_text = q_info.get('text', '')
    q_ans = q_info.get('answer', '')
    
    results.append({
        'fname': fname,
        'qid': q_id,
        'question_text': q_text,
        'answer': q_ans,
        'svg_texts': clean_texts
    })

with open('scratch/t138_svg_analysis.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

with open('scratch/t138_svg_summary.txt', 'w', encoding='utf-8') as out:
    for r in results:
        out.write(f"File: {r['fname']} | QID: {r['qid']}\n")
        out.write(f"  Question: {r['question_text'][:120]}...\n")
        out.write(f"  Answer: {r['answer']}\n")
        out.write(f"  SVG Texts: {r['svg_texts']}\n")
        out.write("=" * 60 + "\n")

print("Saved scratch/t138_svg_summary.txt")
