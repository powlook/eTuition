import json
import sqlite3
import os

conn = sqlite3.connect('server/etuition.db')
c = conn.cursor()
c.execute("SELECT id, question_title, question_text, math_formula, options_json, correct_answer, hint, working_steps_json FROM questions WHERE topic_id = 153 ORDER BY id")
rows = c.fetchall()
conn.close()

# List of question numbers that DO NOT NEED an image (theorem definitions, mnemonics, table values, identities, verbal explanations)
no_image_nums = {1, 2, 5, 6, 7, 8, 9, 10, 11, 12, 26, 27, 28, 29, 30, 39, 40, 41, 48, 49}

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
    img_url = f"/images/g9_t153_q{num}.svg" if needs_img else None
    
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

print(f"Prepared {len(built_qs)} questions for Topic 153.")
print(f"Questions WITH images: {sum(1 for q in built_qs if q['needs_img'])} / 50")
print(f"Questions WITHOUT images: {sum(1 for q in built_qs if not q['needs_img'])} / 50")

with open('scratch/t153_50_built_questions.json', 'w', encoding='utf-8') as f:
    json.dump(built_qs, f, indent=2, ensure_ascii=False)
