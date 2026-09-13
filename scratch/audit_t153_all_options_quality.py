import sqlite3
import json

conn = sqlite3.connect('server/etuition.db')
c = conn.cursor()
c.execute("SELECT id, question_title, question_text, math_formula, options_json, correct_answer FROM questions WHERE topic_id = 153 ORDER BY id")
rows = c.fetchall()

print(f"Auditing options quality for {len(rows)} questions in Topic 153...")

for idx, r in enumerate(rows):
    num = idx + 1
    qid = r[0]
    title = r[1].encode('ascii', 'ignore').decode('ascii') if r[1] else ''
    text = r[2].encode('ascii', 'ignore').decode('ascii') if r[2] else ''
    formula = r[3].encode('ascii', 'ignore').decode('ascii') if r[3] else ''
    opts = json.loads(r[4]) if r[4] else []
    ans = r[5].encode('ascii', 'ignore').decode('ascii') if r[5] else ''
    
    print(f"=== Q{num} [ID {qid}] ===")
    print(f"Title: {title}")
    print(f"Text: {text}")
    print(f"Formula: {formula}")
    opts_safe = [str(o).encode('ascii', 'ignore').decode('ascii') for o in opts]
    print(f"Options: {opts_safe}")
    print(f"Answer: {ans}\n")

conn.close()
