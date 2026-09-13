import sqlite3

conn = sqlite3.connect('server/etuition.db')
cursor = conn.cursor()

cursor.execute("SELECT id, form, strand, title, matatag_code FROM topics WHERE id = 134 OR matatag_code LIKE '%134%' OR title LIKE '%System%'")
print("Matching topics:", cursor.fetchall())

cursor.execute("SELECT id, topic_id, question_text, image_url, options, answer, solution FROM questions WHERE topic_id = 134")
qs = cursor.fetchall()
print(f"Questions for topic 134 count: {len(qs)}")
for q in qs[:5]:
    print("Q ID:", q[0])
    print("  Text:", q[2])
    print("  Img:", q[3])
    print("  Ans:", q[5])
    print("  Sol:", q[6])
