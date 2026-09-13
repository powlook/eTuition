import sqlite3
import json

conn = sqlite3.connect('server/etuition.db')
cursor = conn.cursor()

cursor.execute('SELECT id, question_title, question_text, math_formula, options_json, correct_answer, image_url, show_image FROM questions WHERE topic_id = 159 ORDER BY id ASC')
rows = cursor.fetchall()

with open('scratch/t159_raw_dump.txt', 'w', encoding='utf-8') as f:
    f.write(f"Total questions in T159: {len(rows)}\n\n")
    for idx, r in enumerate(rows, 1):
        opts = json.loads(r[4]) if r[4] else []
        f.write(f"Q{idx} (ID {r[0]})\n")
        f.write(f"Title: {r[1]}\n")
        f.write(f"Text: {r[2]}\n")
        f.write(f"Formula: {r[3]}\n")
        f.write(f"Opts: {opts}\n")
        f.write(f"Ans: {r[5]}\n")
        f.write(f"Img: {r[6]} (show_image: {r[7]})\n")
        f.write("-" * 60 + "\n")

print(f"Dumped {len(rows)} questions to scratch/t159_raw_dump.txt")
