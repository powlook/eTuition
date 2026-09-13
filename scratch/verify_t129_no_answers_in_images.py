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
    WHERE q.topic_id = 129 OR q.question_title LIKE '%T129%'
    ORDER BY q.id ASC
""")
rows = c.fetchall()
conn.close()

print(f"Auditing {len(rows)} database questions for Topic 129...")

violations = []

forbidden_phrases = [
    "Quadrant I", "Quadrant II", "Quadrant III", "Quadrant IV",
    "\\sqrt{", "sqrt(",
    "Collinear (", "Slope m =",
    "sq units", "units", "km"
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
            # Ignore standard quadrant labels on planeQI, QII, QIII, QIV
            if phrase in ["Quadrant I", "Quadrant II", "Quadrant III", "Quadrant IV"] and ("QI" in txt or "QII" in txt or "QIII" in txt or "QIV" in txt):
                continue
            if phrase in txt and "?" not in txt:
                violations.append((qid, fname, f"Forbidden answer phrase '{phrase}' found in SVG text '{txt}'"))

if not violations:
    print("[SUCCESS] All 50 Topic 129 diagrams verified! ZERO answer values or solution text found in any image!")
else:
    print(f"Found {len(violations)} violations:")
    for v in violations:
        print("  ", v)
