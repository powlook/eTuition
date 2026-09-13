import sqlite3
import json

dbs = ['server/etuition.db', 'QBank/server/qbank.db', 'QBank/server/etuition.db']
jsons = ['questions.json', 'QBank/questions.json', 'QBank/public/questions.json', 'QBank/dist/questions.json']

report = []

for db_path in dbs:
    conn = sqlite3.connect(db_path)
    c = conn.cursor()
    c.execute("SELECT id, question_text, options_json, correct_answer, show_image, image_url FROM questions WHERE topic_id = 'T150' OR topic_id = '150'")
    rows = c.fetchall()
    report.append(f"DB {db_path}: {len(rows)} questions found")
    generic_count = 0
    for qid, qtxt, opts_str, ans, simg, imgurl in rows:
        opts = json.loads(opts_str)
        if 'Perimeters are equal but areas differ' in opts or 'Corresponding angles sum to 360°' in opts:
            generic_count += 1
    report.append(f"  Generic placeholder options count in {db_path}: {generic_count}")
    conn.close()

for jpath in jsons:
    with open(jpath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    t150 = [q for q in data if q.get('topic_id') == 'T150' or q.get('topic_id') == 150]
    report.append(f"JSON {jpath}: {len(t150)} questions found")
    generic_count = sum(1 for q in t150 if 'Perimeters are equal but areas differ' in (q.get('options') or []) or 'Corresponding angles sum to 360°' in (q.get('options') or []))
    report.append(f"  Generic placeholder options count in {jpath}: {generic_count}")

# Check specific questions Q134386 and Q134402
conn = sqlite3.connect('server/etuition.db')
c = conn.cursor()
for check_id in [134386, 134402]:
    c.execute("SELECT id, question_text, options_json, correct_answer, show_image, image_url, math_formula FROM questions WHERE id = ?", (check_id,))
    row = c.fetchone()
    report.append(f"\n--- Question ID {check_id} ([T150-Q{check_id}]) ---")
    report.append(f"Text: {row[1]}")
    report.append(f"Options: {json.loads(row[2])}")
    report.append(f"Correct Answer: {row[3]}")
    report.append(f"Math Formula: {row[6]}")
    report.append(f"Show Image: {row[4]}, Image URL: {row[5]}")
conn.close()

output_text = "\n".join(report)
with open("scratch/t150_final_report.txt", "w", encoding="utf-8") as f:
    f.write(output_text)

print("Saved scratch/t150_final_report.txt successfully")
