import json
import sqlite3
import os

# Load dumped questions from server/etuition.db or QBank excel
conn = sqlite3.connect('server/etuition.db')
c = conn.cursor()
c.execute("SELECT id, question_title, question_text, math_formula, options_json, correct_answer, hint, working_steps_json FROM questions WHERE topic_id = 152 ORDER BY id")
rows = c.fetchall()
conn.close()

# List of question numbers that DO NOT NEED an image (verbal statements, simple conceptual/numerical checks)
no_image_nums = {1, 5, 7, 9, 11, 12, 15, 16, 18, 19, 26, 35, 40, 44, 47, 50}

built_qs = []
for idx, r in enumerate(rows):
    num = idx + 1
    qid = r[0]
    title = r[1]
    text = r[2]
    formula = r[3]
    opts = json.loads(r[4]) if r[4] else []
    ans = r[5]
    hint = r[6]
    steps = json.loads(r[7]) if r[7] else []
    
    needs_img = num not in no_image_nums
    img_url = f"/images/g9_t152_q{num}.svg" if needs_img else None
    
    built_qs.append({
        'num': num,
        'id': qid,
        'title': title,
        'text': text,
        'formula': formula,
        'options': opts,
        'answer': ans,
        'hint': hint,
        'steps': steps,
        'needs_img': needs_img,
        'img_url': img_url
    })

print(f"Prepared {len(built_qs)} questions for Topic 152.")
print(f"Questions WITH images: {sum(1 for q in built_qs if q['needs_img'])} / 50")
print(f"Questions WITHOUT images: {sum(1 for q in built_qs if not q['needs_img'])} / 50")

with open('scratch/t152_50_built_questions.json', 'w', encoding='utf-8') as f:
    json.dump(built_qs, f, indent=2, ensure_ascii=False)
