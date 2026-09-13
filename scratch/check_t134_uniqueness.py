import sqlite3

conn = sqlite3.connect('server/etuition.db')
cursor = conn.cursor()

cursor.execute("SELECT id, question_title, question_text, image_url, correct_answer FROM questions WHERE topic_id = 134 ORDER BY id")
qs = cursor.fetchall()

with open('scratch/t134_summary.txt', 'w', encoding='utf-8') as f:
    f.write(f"Total questions: {len(qs)}\n")
    for idx, q in enumerate(qs, 1):
        q_id, title, qtext, img, ans = q
        f.write(f"Q{idx:02d} (ID {q_id}): Title: '{title}' | Ans: '{ans}' | Img: '{img}' | QText: '{qtext[:60]}...'\n")

print("Done writing t134_summary.txt")
