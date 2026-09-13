import sqlite3
import json

conn = sqlite3.connect('server/etuition.db')
cursor = conn.cursor()

cursor.execute('SELECT id, question_title, question_text, math_formula, options_json, correct_answer, image_url, show_image FROM questions WHERE topic_id = 159 ORDER BY id ASC')
rows = cursor.fetchall()

with open('scratch/t159_detailed_list.txt', 'w', encoding='utf-8') as f:
    f.write(f"Total T159 questions: {len(rows)}\n\n")
    for idx, r in enumerate(rows, 1):
        opts = json.loads(r[4]) if r[4] else []
        f.write(f"Q{idx} (ID {r[0]}):\n")
        f.write(f"  Title: {r[1]}\n")
        f.write(f"  Text: {r[2]}\n")
        f.write(f"  Formula: {r[3]}\n")
        f.write(f"  Options: {opts}\n")
        f.write(f"  Correct: {r[5]}\n")
        f.write(f"  Img: {r[6]} (show: {r[7]})\n")
        f.write("=" * 70 + "\n")

print("Wrote to scratch/t159_detailed_list.txt")
