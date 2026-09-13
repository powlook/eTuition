import sqlite3
import json

conn = sqlite3.connect('server/etuition.db')
c = conn.cursor()
c.execute("SELECT id, question_title, question_text, math_formula, correct_answer, image_url, show_image FROM questions WHERE topic_id = 152 ORDER BY id")
rows = c.fetchall()

t152_qs = []
for idx, r in enumerate(rows):
    num = idx + 1
    qid = r[0]
    title = r[1]
    text = r[2]
    formula = r[3]
    answer = r[4]
    img_url = r[5]
    show_img = r[6]
    
    t152_qs.append({
        'num': num,
        'id': qid,
        'title': title,
        'text': text,
        'formula': formula,
        'answer': answer,
        'img_url': img_url,
        'show_img': show_img
    })

with open('scratch/t152_50_questions_dump.json', 'w', encoding='utf-8') as f:
    json.dump(t152_qs, f, indent=2, ensure_ascii=False)

for q in t152_qs:
    t_safe = q['title'].encode('ascii', 'ignore').decode('ascii')
    txt_safe = q['text'][:90].encode('ascii', 'ignore').decode('ascii')
    print(f"Q{q['num']} [ID {q['id']}]: Title='{t_safe}'\n   Text: '{txt_safe}'\n")

conn.close()
