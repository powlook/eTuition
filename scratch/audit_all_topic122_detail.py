import sqlite3
import json
import os

conn = sqlite3.connect('server/etuition.db')
c = conn.cursor()
c.execute("""
    SELECT q.id, q.question_title, q.question_text, q.image_url, q.options_json, q.correct_answer, q.working_steps_json, q.math_formula
    FROM questions q
    WHERE q.topic_id = 122 OR q.question_title LIKE '%T122%'
    ORDER BY q.id ASC
""")
rows = c.fetchall()

print(f"Total Topic 122 questions: {len(rows)}")

questions_detail = []
for r in rows:
    qid, title, text, img, opts, ans, steps, formula = r
    questions_detail.append({
        'id': qid,
        'title': title,
        'text': text,
        'img': img,
        'options': json.loads(opts) if opts else [],
        'answer': ans,
        'steps': json.loads(steps) if steps else [],
        'formula': formula
    })

with open('scratch/topic122_questions_detail.json', 'w', encoding='utf-8') as f:
    json.dump(questions_detail, f, indent=2, ensure_ascii=False)

print("Saved to scratch/topic122_questions_detail.json")
