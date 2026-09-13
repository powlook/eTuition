import sqlite3
import json
import os
import openpyxl

conn = sqlite3.connect('server/etuition.db')
cursor = conn.cursor()

cursor.execute("SELECT id, form_level, strand, unit, title, description FROM topics WHERE id = 147 OR title LIKE '%quadrilateral%'")
topics = cursor.fetchall()
print("Topics found for T147:", topics)

cursor.execute("SELECT id, topic_id, question_title, question_text, math_formula, options_json, correct_answer, working_steps_json, image_url FROM questions WHERE topic_id = 147 ORDER BY id")
rows = cursor.fetchall()
print(f"Total questions for Topic 147 in server/etuition.db: {len(rows)}")

with open('scratch/t147_all_qs.txt', 'w', encoding='utf-8') as f:
    f.write(f"Total questions for Topic 147: {len(rows)}\n\n")
    for idx, r in enumerate(rows, 1):
        q_id, t_id, title, qtext, formula, opts_raw, ans, steps_raw, img_url = r
        opts = json.loads(opts_raw) if opts_raw else []
        f.write(f"Q{idx:02d} (ID {q_id}): {title}\n")
        f.write(f"  Text:    {qtext}\n")
        f.write(f"  Formula: {formula}\n")
        f.write(f"  Img:     {img_url}\n")
        f.write(f"  Ans:     {ans}\n")
        f.write(f"  Opts:    {opts}\n")
        f.write("-" * 60 + "\n")

print("Saved scratch/t147_all_qs.txt")

# Now check Grade_9_Math_50_Unique_Questions.xlsx for T04
excel_path = 'QBank/resources/Grade_9_Math_50_Unique_Questions.xlsx'
if os.path.exists(excel_path):
    wb = openpyxl.load_workbook(excel_path, data_only=True)
    sheet = wb['Measurement & Geometry (MG)']
    r_list = list(sheet.iter_rows(values_only=True))
    t04_items = [r for r in r_list[4:] if r and str(r[0]).startswith('T04-')]
    print(f"Found {len(t04_items)} unique T04 questions in {excel_path}")
    with open('scratch/t04_excel_qs.txt', 'w', encoding='utf-8') as out:
        for idx, r in enumerate(t04_items, 1):
            out.write(f"Q{idx:02d} ({r[0]}): {r[4]}\n")
    print("Saved scratch/t04_excel_qs.txt")

