import sqlite3
import json
import os
import re

conn = sqlite3.connect('server/etuition.db')
cursor = conn.cursor()

cursor.execute("SELECT id, question_title, question_text, options_json, correct_answer, working_steps_json, image_url FROM questions WHERE topic_id = 134 ORDER BY id")
rows = cursor.fetchall()

print(f"Auditing {len(rows)} questions for Topic 134...")

audit_report = []

for idx, r in enumerate(rows, 1):
    q_id, title, qtext, opts_raw, ans, steps_raw, img_url = r
    opts = json.loads(opts_raw) if opts_raw else []
    steps = json.loads(steps_raw) if steps_raw else []
    
    # SVG file path
    svg_rel = img_url.lstrip('/') if img_url else ''
    svg_path = os.path.join('public', svg_rel) if svg_rel else ''
    
    svg_exists = os.path.exists(svg_path)
    svg_texts = []
    if svg_exists:
        with open(svg_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            raw_texts = re.findall(r'<text[^>]*>(.*?)</text>', content, re.DOTALL)
            svg_texts = [re.sub(r'<[^>]+>', '', t).strip() for t in raw_texts]

    # Check if answer appears in SVG text
    ans_in_image = False
    ans_str = str(ans).strip()
    
    # Check if exact answer or key part of answer is in svg_texts
    # For example if answer is "(4, 2)" or "x = 3, y = 4" or "Burger: ₱45, Drink: ₱20"
    for t in svg_texts:
        if ans_str in t:
            ans_in_image = True
        elif "(4, 2)" in t or "(2, 1)" in t or "41 and 23" in t or "15 km/h" in t or "10 liters" in t:
            ans_in_image = True
        elif "Infinitely many solutions" in t or "Consistent-dependent" in t or "Inconsistent System" in t:
            ans_in_image = True

    audit_report.append({
        'num': idx,
        'id': q_id,
        'title': title,
        'text': qtext,
        'ans': ans,
        'opts': opts,
        'img': img_url,
        'svg_exists': svg_exists,
        'svg_texts': svg_texts,
        'ans_in_image': ans_in_image
    })

with open('scratch/t134_full_audit.json', 'w', encoding='utf-8') as f:
    json.dump(audit_report, f, indent=2)

print("Audit complete! Saved to scratch/t134_full_audit.json")
ans_count = sum(1 for a in audit_report if a['ans_in_image'])
print(f"Total questions with answer detected in image: {ans_count}")

