import json
import os
import re
import sqlite3

conn = sqlite3.connect('server/etuition.db')
cursor = conn.cursor()

cursor.execute("SELECT id, topic_id, question_title, question_text, image_url, options_json, correct_answer, working_steps_json FROM questions WHERE topic_id = 135 ORDER BY id")
rows = cursor.fetchall()

print(f"Total T135 questions in server/etuition.db: {len(rows)}")

audit_results = []
for idx, r in enumerate(rows, 1):
    q_id, t_id, title, qtext, img_url, opts_raw, ans, steps_raw = r
    
    svg_rel = img_url.lstrip('/') if img_url else f"images/g8_t135_q{idx}.svg"
    svg_path = os.path.join('public', svg_rel)
    
    svg_texts = []
    if os.path.exists(svg_path):
        with open(svg_path, 'r', encoding='utf-8', errors='ignore') as f:
            c = f.read()
            raw_texts = re.findall(r'<text[^>]*>(.*?)</text>', c, re.DOTALL)
            svg_texts = [re.sub(r'<[^>]+>', '', t).strip() for t in raw_texts]
            
    # Check for answer leakages like checkmarks (✓, ✕, Yes, No, satisfy/does not satisfy, answer formula, shaded region answer, etc.)
    leakage = []
    for t in svg_texts:
        if '✓' in t or '✕' in t or '&#10003;' in t or '&#10007;' in t:
            leakage.append(f"Checkmark/cross: {t}")
        elif 'satisfies' in t.lower() or 'satisfy' in t.lower() or 'does not' in t.lower():
            leakage.append(f"Solution text: {t}")
        elif any(ans_word in t for ans_word in ['Shaded Region', 'Feasible Region', 'Solution Set']) and '?' not in t:
            leakage.append(f"Solution label: {t}")

    audit_results.append({
        'num': idx,
        'id': q_id,
        'title': title,
        'text': qtext,
        'ans': ans,
        'img': img_url,
        'svg_path': svg_path,
        'svg_texts': svg_texts,
        'leakage': leakage
    })

with open('scratch/t135_leakage_report.txt', 'w', encoding='utf-8') as out:
    out.write(f"Topic 135 Leakage Report ({len(audit_results)} items)\n\n")
    for a in audit_results:
        out.write(f"Q{a['num']:02d} (ID {a['id']}): {a['title']}\n")
        out.write(f"  QText: {a['text']}\n")
        out.write(f"  Ans:   {a['ans']}\n")
        out.write(f"  Img:   {a['img']}\n")
        if a['leakage']:
            out.write(f"  LEAKAGE DETECTED: {a['leakage']}\n")
        else:
            out.write(f"  Leakage: NONE DETECTED\n")
        out.write("  SVG Texts: " + ", ".join([repr(t) for t in a['svg_texts'] if len(t) > 1 and not t.lstrip('-').isdigit()]) + "\n")
        out.write("-" * 60 + "\n")

print("Saved scratch/t135_leakage_report.txt")
leaks_cnt = sum(1 for a in audit_results if a['leakage'])
print(f"Total questions with explicit text leakage detected: {leaks_cnt}")

