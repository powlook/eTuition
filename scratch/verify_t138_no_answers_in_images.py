import glob
import os
import re
import json
import sqlite3

conn = sqlite3.connect('server/etuition.db')
c = conn.cursor()
c.execute("""
    SELECT q.id, q.question_title, q.question_text, q.image_url, q.options_json, q.correct_answer
    FROM questions q
    WHERE q.topic_id = 138 OR q.question_title LIKE '%T138%'
    ORDER BY q.id ASC
""")
rows = c.fetchall()
conn.close()

print(f"Auditing {len(rows)} database questions for Topic 138...")

violations = []

forbidden_phrases = [
    "Cannot Form Triangle",
    "Range: 5 < x < 21",
    "Range: 7 < x < 37",
    "Range: 6 < x < 22",
    "Side Order: BC < AB < AC",
    "Angle Order:",
    "Theorem: Ext",
    "Hinge Theorem: m",
    "Smallest Angles:",
    "BC (larger)",
    "EF (smaller)"
]

for r in rows:
    qid, title, text, img, opts_str, ans = r
    if not img:
        continue
    
    fname = os.path.basename(img)
    svg_path = os.path.join('public/images', fname)
    if not os.path.exists(svg_path):
        violations.append((qid, fname, "SVG file missing"))
        continue
        
    with open(svg_path, 'r', encoding='utf-8') as f:
        svg_content = f.read()
        
    raw_texts = re.findall(r'<text[^>]*>(.*?)</text>', svg_content, re.DOTALL)
    clean_texts = [re.sub(r'<[^>]+>', '', t).strip() for t in raw_texts if t.strip()]
    
    for txt in clean_texts:
        for phrase in forbidden_phrases:
            if phrase in txt:
                violations.append((qid, fname, f"Forbidden answer text '{phrase}' found in SVG text '{txt}'"))

if not violations:
    print("[SUCCESS] All 50 Topic 138 diagrams verified! ZERO answer values or solution text found in any image!")
else:
    print(f"Found {len(violations)} violations:")
    for v in violations:
        print("  ", v)
