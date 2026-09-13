import sqlite3
import json
import os

conn = sqlite3.connect('server/etuition.db')
c = conn.cursor()

# Get topic details
c.execute("SELECT * FROM topics WHERE id = 152")
t_row = c.fetchone()
print(f"Topic 152 Details: {t_row}")

# Get all questions for Topic 152
c.execute("SELECT id, question_title, question_text, math_formula, correct_answer, image_url, show_image FROM questions WHERE topic_id = 152 ORDER BY id")
rows = c.fetchall()
print(f"Total questions for Topic 152 in server/etuition.db: {len(rows)}")

for idx, r in enumerate(rows):
    t_safe = r[1].encode('ascii', 'ignore').decode('ascii') if r[1] else ''
    txt_safe = r[2][:70].encode('ascii', 'ignore').decode('ascii') if r[2] else ''
    print(f"[{idx+1}] ID={r[0]} | Title={t_safe} | Img={r[5]} | ShowImg={r[6]} | Text={txt_safe}...")

conn.close()
