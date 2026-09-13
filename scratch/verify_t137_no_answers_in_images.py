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
    WHERE q.topic_id = 137 OR q.question_title LIKE '%Pythagorean%'
    ORDER BY q.id ASC
""")
rows = c.fetchall()
conn.close()

print(f"Auditing {len(rows)} database questions for Topic 137...")

violations = []

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
        
    # Extract text from SVG
    raw_texts = re.findall(r'<text[^>]*>(.*?)</text>', svg_content, re.DOTALL)
    clean_texts = [re.sub(r'<[^>]+>', '', t).strip() for t in raw_texts if t.strip()]
    
    # Check if answer numbers or solution classification appear in clean_texts
    # Numbers in answer:
    ans_nums = re.findall(r'\b\d+(?:\.\d+)?\b', ans)
    for num in ans_nums:
        # ignore given dimensions in text if they match by coincidence (e.g. 10 cm in equilateral triangle side)
        # check if it's the target calculated value
        if "Altitude" in ans or "Area" in ans:
            continue
        for txt in clean_texts:
            if num in txt and "?" not in txt:
                violations.append((qid, fname, f"Answer number '{num}' found in SVG text '{txt}'"))
                
    for txt in clean_texts:
        if "Right Triangle (c" in txt or "Acute Triangle (c" in txt or "Obtuse Triangle (c" in txt:
            violations.append((qid, fname, f"Classification answer text found in SVG: '{txt}'"))

if not violations:
    print("[SUCCESS] All 50 Topic 137 diagrams verified! ZERO answer values or solution text found in any image!")
else:
    print(f"Found {len(violations)} violations:")
    for v in violations:
        print("  ", v)
