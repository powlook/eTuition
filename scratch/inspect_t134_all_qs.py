import sqlite3
import json
import os
import openpyxl

# Load questions from server/etuition.db for topic_id = 134
conn = sqlite3.connect('server/etuition.db')
cursor = conn.cursor()

cursor.execute("SELECT id, question_title, question_text, options_json, correct_answer, working_steps_json, image_url FROM questions WHERE topic_id = 134 ORDER BY id")
rows = cursor.fetchall()
print(f"Total questions in server/etuition.db for topic 134: {len(rows)}")

for idx, r in enumerate(rows, 1):
    q_id, title, qtext, opts_raw, ans, steps_raw, img = r
    opts = json.loads(opts_raw) if opts_raw else []
    print(f"Q{idx} (ID {q_id}):")
    print(f"  Title: {title}")
    print(f"  Text: {qtext}")
    print(f"  Img: {img}")
    print(f"  Ans: {ans}")
    print(f"  Opts: {opts}")
    print("-" * 50)

