import sqlite3
import json

conn = sqlite3.connect('server/etuition.db')
c = conn.cursor()
c.execute("SELECT id, question_title, question_text, math_formula, options_json, correct_answer, show_image, image_url FROM questions WHERE topic_id = 'T149' OR topic_id = '149' ORDER BY id ASC")
rows = c.fetchall()

questions = []
for r in rows:
    qid, title, qtxt, formula, opts_str, ans, simg, imgurl = r
    opts = json.loads(opts_str) if opts_str else []
    questions.append({
        "id": str(qid),
        "title": title,
        "question_text": qtxt,
        "math_formula": formula,
        "options": opts,
        "correct_answer": ans,
        "show_image": simg,
        "image_url": imgurl
    })

with open("scratch/t149_raw_dump.json", "w", encoding="utf-8") as f:
    json.dump(questions, f, indent=2, ensure_ascii=False)

print(f"Dumped {len(questions)} questions for T149 to scratch/t149_raw_dump.json")
conn.close()
