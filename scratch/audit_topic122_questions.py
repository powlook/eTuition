import sqlite3
import json
import os

db_paths = ['server/etuition.db', 'QBank/server/qbank.db', 'QBank/server/etuition.db']

for db_path in db_paths:
    if not os.path.exists(db_path):
        continue
    print(f"=== DB: {db_path} ===")
    conn = sqlite3.connect(db_path)
    c = conn.cursor()
    c.execute("""
        SELECT q.id, q.question_title, q.question_text, q.image_url, q.options_json, q.correct_answer
        FROM questions q
        WHERE q.id = 128679 OR q.topic_id = 122 OR q.question_title LIKE '%T122%'
    """)
    rows = c.fetchall()
    print(f"Found {len(rows)} questions for Topic 122 in {db_path}")
    for r in rows:
        qid, title, text, img, opts, ans = r
        if qid == 128679 or '128679' in str(qid):
            print(f"\nTarget QID {qid}:")
            print(f"Title: {title}")
            print(f"Text: {text}")
            print(f"Image: {img}")
            print(f"Options: {opts}")
            print(f"Answer: {ans}")
    conn.close()
