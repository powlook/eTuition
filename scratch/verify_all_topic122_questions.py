import sqlite3
import json

conn = sqlite3.connect('server/etuition.db')
c = conn.cursor()
c.execute("""
    SELECT id, question_title, question_text, image_url, options_json, correct_answer, math_formula, working_steps_json
    FROM questions
    WHERE topic_id = 122 OR question_title LIKE '%T122%'
    ORDER BY id ASC
""")
rows = c.fetchall()
conn.close()

print(f"=== VERIFICATION OF ALL {len(rows)} TOPIC 122 QUESTIONS ===")

target_q = None
for r in rows:
    qid, title, text, img, opts_str, ans, formula, steps_str = r
    opts = json.loads(opts_str) if opts_str else []
    steps = json.loads(steps_str) if steps_str else []
    
    if qid == 128679 or '128679' in str(qid):
        target_q = (qid, title, text, img, opts, ans, formula, steps)
        
    # Check that ans is in opts
    assert ans in opts, f"QID {qid}: correct answer '{ans}' not found in options {opts}"

print("[SUCCESS] All 50 questions have correct_answer present in options!")

if target_q:
    qid, title, text, img, opts, ans, formula, steps = target_q
    print("\nTarget Question [T122-Q128679] Details:")
    print(f"  Title: {title}")
    print(f"  Text: {text}")
    print(f"  Image URL: {img}")
    print(f"  Options: {opts}")
    print(f"  Correct Answer: {ans}")
    print(f"  Formula: {formula}")
    print(f"  Steps: {steps}")

print("\nVerification successful!")
