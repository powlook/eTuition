import sqlite3
import json
import os
import glob
import re

conn = sqlite3.connect('server/etuition.db')
c = conn.cursor()
c.execute("""
    SELECT q.id, q.topic_id, t.title, q.question_title, q.question_text, q.image_url
    FROM questions q
    JOIN topics t ON q.topic_id = t.id
    WHERE q.image_url IS NOT NULL AND q.image_url != ''
    ORDER BY q.topic_id, q.id
""")
rows = c.fetchall()

print(f"Total questions with image_url across DB: {len(rows)}")

missing_files = []
generic_files = []

for r in rows:
    qid, tid, ttitle, qtitle, text, img = r
    # clean img path
    clean_img = img.lstrip('/')
    possible_paths = [
        clean_img,
        os.path.join('public', clean_img),
        os.path.join('QBank/public', clean_img),
        os.path.join('dist', clean_img),
        os.path.join('QBank/dist', clean_img)
    ]
    found = any(os.path.exists(p) for p in possible_paths)
    if not found:
        missing_files.append((qid, tid, img))

print(f"Missing image files: {len(missing_files)}")
for mf in missing_files[:20]:
    print("  Missing:", mf)
