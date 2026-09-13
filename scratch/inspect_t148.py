import sqlite3
import json

conn = sqlite3.connect('server/etuition.db')
c = conn.cursor()
c.execute("SELECT id, question_title, question_text, options_json, correct_answer, math_formula, show_image, image_url FROM questions WHERE topic_id = 'T148' OR topic_id = '148' ORDER BY id ASC")
rows = c.fetchall()

print(f"Total questions in T148: {len(rows)}")
for r in rows:
    qid, title, qtxt, opts_str, ans, formula, simg, imgurl = r
    opts = json.loads(opts_str) if opts_str else []
    print(f"--- QID {qid} | Title: {title} ---")
    print(f"Text: {qtxt}")
    print(f"Formula: {formula}")
    print(f"Options: {opts}")
    print(f"Correct Ans: {ans}")
    print(f"Show Img: {simg} | URL: {imgurl}")
    print()

conn.close()
