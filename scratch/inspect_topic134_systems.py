import sqlite3
import json
import os
import glob
import re

conn = sqlite3.connect('server/etuition.db')
c = conn.cursor()
c.execute("""
    SELECT q.id, q.question_title, q.question_text, q.image_url, q.options_json, q.correct_answer, q.working_steps_json, q.math_formula
    FROM questions q
    WHERE q.topic_id = 134 OR q.question_title LIKE '%T134%'
    ORDER BY q.id ASC
""")
rows = c.fetchall()
conn.close()

print(f"Total questions in Topic 134: {len(rows)}")

questions = []
for r in rows:
    qid, title, text, img, opts_str, ans, steps_str, formula = r
    opts = json.loads(opts_str) if opts_str else []
    steps = json.loads(steps_str) if steps_str else []
    questions.append({
        'id': qid,
        'title': title,
        'text': text,
        'img': img,
        'options': opts,
        'answer': ans,
        'steps': steps,
        'formula': formula
    })

with open('scratch/topic134_questions.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, indent=2, ensure_ascii=False)

with open('scratch/topic134_summary.txt', 'w', encoding='utf-8') as out:
    for q in questions:
        out.write(f"QID {q['id']}: {q['title']}\n")
        out.write(f"  Img: {q['img']}\n")
        out.write(f"  Text: {q['text']}\n")
        out.write(f"  Ans: {q['answer']}\n")
        out.write("-" * 50 + "\n")

print("Saved scratch/topic134_summary.txt")
