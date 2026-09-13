import sqlite3
import json

conn = sqlite3.connect('server/etuition.db')
cursor = conn.cursor()

cursor.execute("SELECT id, question_title, question_text, options_json, correct_answer, working_steps_json, image_url FROM questions WHERE topic_id = 134 ORDER BY id")
rows = cursor.fetchall()

with open('scratch/t134_all_questions.txt', 'w', encoding='utf-8') as f:
    f.write(f"Total questions in server/etuition.db for topic 134: {len(rows)}\n\n")
    for idx, r in enumerate(rows, 1):
        q_id, title, qtext, opts_raw, ans, steps_raw, img = r
        opts = json.loads(opts_raw) if opts_raw else []
        f.write(f"Q{idx} (ID {q_id}):\n")
        f.write(f"  Title: {title}\n")
        f.write(f"  Text: {qtext}\n")
        f.write(f"  Img: {img}\n")
        f.write(f"  Ans: {ans}\n")
        f.write(f"  Opts: {opts}\n")
        f.write("-" * 50 + "\n")

print("Wrote 50 questions to scratch/t134_all_questions.txt")
