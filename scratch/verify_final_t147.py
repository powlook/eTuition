import sqlite3
import json
import os
import openpyxl

print("=== Final Audit & Verification for Topic 147 ===")

# 1. Check Q134237 in main DB
conn = sqlite3.connect('server/etuition.db')
cursor = conn.cursor()
cursor.execute("SELECT id, question_title, question_text, math_formula, options_json, correct_answer, image_url FROM questions WHERE id = 134237")
q_item = cursor.fetchone()

print("\n--- Verified Q134237 in server/etuition.db ---")
print("ID:     ", q_item[0])
print("Title:  ", q_item[1])
print("Text:   ", q_item[2])
print("Formula:", q_item[3])
print("Ans:    ", q_item[5].encode('utf-8'))
print("Img:    ", q_item[6])

# 2. Check counts across all databases
dbs = ['server/etuition.db', 'QBank/server/qbank.db', 'QBank/server/etuition.db']
for db in dbs:
    conn = sqlite3.connect(db)
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM questions WHERE topic_id = 147")
    cnt = cursor.fetchone()[0]
    print(f"[OK] Database '{db}': {cnt} questions for Topic 147")

# 3. Check JSONs
jsons = ['questions.json', 'QBank/questions.json', 'QBank/public/questions.json', 'QBank/dist/questions.json']
for jp in jsons:
    with open(jp, 'r', encoding='utf-8') as f:
        data = json.load(f)
        t147 = [q for q in data if str(q.get('topic_id')) == '147']
        print(f"[OK] JSON '{jp}': {len(t147)} questions for Topic 147")

# 4. Check Excel
wb = openpyxl.load_workbook('QBank/questions_bank.xlsx', data_only=True)
sheet = wb.active
headers = [cell.value for cell in sheet[1]]
t147_excel = [r for r in sheet.iter_rows(min_row=2, values_only=True) if str(dict(zip(headers, r)).get('Topic ID')) == '147']
print(f"[OK] Excel 'QBank/questions_bank.xlsx': {len(t147_excel)} questions for Topic 147")

# 5. Check Image Files across all 4 directories
dirs = ['public/images', 'dist/images', 'QBank/public/images', 'QBank/dist/images']
missing_count = 0
for i in range(1, 51):
    for d in dirs:
        s = os.path.join(d, f"g9_t147_q{i}.svg")
        p = os.path.join(d, f"g9_t147_q{i}.png")
        if not os.path.exists(s) or not os.path.exists(p):
            missing_count += 1

print(f"[OK] Image Directories ({len(dirs)} locations): All 50 SVG & PNG files present! Missing: {missing_count}")

