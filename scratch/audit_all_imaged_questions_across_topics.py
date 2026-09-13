import sqlite3
import json
import os
import glob
import re

conn = sqlite3.connect('server/etuition.db')
c = conn.cursor()
c.execute("""
    SELECT q.id, q.topic_id, t.title, q.question_title, q.question_text, q.image_url, q.options_json, q.correct_answer
    FROM questions q
    JOIN topics t ON q.topic_id = t.id
    WHERE q.image_url IS NOT NULL AND q.image_url != ''
    ORDER BY q.topic_id, q.id
""")
rows = c.fetchall()
print(f"Total imaged questions across DB: {len(rows)}")

topic_counts = {}
for r in rows:
    tid = r[1]
    ttitle = r[2]
    topic_counts[(tid, ttitle)] = topic_counts.get((tid, ttitle), 0) + 1

for (tid, ttitle), cnt in sorted(topic_counts.items(), key=lambda x: x[0][0]):
    print(f"Topic {tid} ({ttitle}): {cnt} imaged questions")
