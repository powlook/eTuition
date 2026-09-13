import sqlite3
import json

conn = sqlite3.connect('server/etuition.db')
c = conn.cursor()
c.execute("""
    SELECT id, question_title, question_text, image_url, options_json, correct_answer, working_steps_json, math_formula
    FROM questions
    WHERE topic_id = 122 OR question_title LIKE '%T122%'
    ORDER BY id ASC
""")
rows = c.fetchall()

print(f"Total Topic 122 questions: {len(rows)}")

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

with open('scratch/t122_all_50.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, indent=2, ensure_ascii=False)

for q in questions:
    qid = q['id']
    text = q['text']
    img = q['img']
    ans = q['answer']
    print(f"QID {qid}: Img={img} | Ans={ans}")
    print(f"  Text: {text[:100]}...")
