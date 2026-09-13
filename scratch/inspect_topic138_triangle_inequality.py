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
    WHERE q.topic_id = 138 OR q.question_title LIKE '%T138%'
    ORDER BY q.id ASC
""")
rows = c.fetchall()
conn.close()

print(f"Total questions in Topic 138 (Triangle Inequality Theorems): {len(rows)}")

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

with open('scratch/topic138_questions.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, indent=2, ensure_ascii=False)

for q in questions[:15]:
    print(f"QID {q['id']}: {q['title']}")
    print(f"  Img: {q['img']}")
    print(f"  Text: {q['text'][:120]}...")
    print(f"  Ans: {q['answer']}")
    print("-" * 50)
