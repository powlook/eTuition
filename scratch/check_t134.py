import sqlite3
import json
import os

db_paths = [
    'server/etuition.db',
    'QBank/server/qbank.db',
    'QBank/server/etuition.db'
]

for db_path in db_paths:
    if os.path.exists(db_path):
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT id, code, title, grade FROM topics WHERE code = 'T134' OR code LIKE '%134%' OR title LIKE '%System%'")
        topics = cursor.fetchall()
        print(f"=== DB: {db_path} ===")
        print("Topics:", topics)
        for t in topics:
            cursor.execute("SELECT id, topic_id, question_text, image_url, answer, solution FROM questions WHERE topic_id = ?", (t[0],))
            qs = cursor.fetchall()
            print(f"Topic {t[0]} ({t[1]} - {t[2]}): {len(qs)} questions")
            for q in qs[:5]:
                print(f"  ID: {q[0]} | Img: {q[3]}")

json_paths = [
    'questions.json',
    'QBank/questions.json',
    'QBank/public/questions.json',
    'QBank/dist/questions.json'
]

for jp in json_paths:
    if os.path.exists(jp):
        with open(jp, 'r', encoding='utf-8') as f:
            data = json.load(f)
            t134_qs = [q for q in data if str(q.get('topic_id')) == '134' or str(q.get('topic_code')) == 'T134' or 'T134' in str(q.get('id',''))]
            print(f"=== JSON: {jp} === Count: {len(t134_qs)}")

