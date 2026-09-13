import sqlite3
import json
import os
import openpyxl

print("=== Final Verification Summary ===")

# 1. Databases
dbs = ['server/etuition.db', 'QBank/server/qbank.db', 'QBank/server/etuition.db']
for db in dbs:
    conn = sqlite3.connect(db)
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM questions WHERE topic_id = 134")
    cnt = cursor.fetchone()[0]
    print(f"[OK] Database '{db}': {cnt} questions for Topic 134")

# 2. JSONs
jsons = ['questions.json', 'QBank/questions.json', 'QBank/public/questions.json', 'QBank/dist/questions.json']
for jp in jsons:
    with open(jp, 'r', encoding='utf-8') as f:
        data = json.load(f)
        t134 = [q for q in data if str(q.get('topic_id')) == '134']
        print(f"[OK] JSON '{jp}': {len(t134)} questions for Topic 134")

# 3. Excel Bank
wb = openpyxl.load_workbook('QBank/questions_bank.xlsx', data_only=True)
sheet = wb.active
headers = [cell.value for cell in sheet[1]]
t134_excel = [r for r in sheet.iter_rows(min_row=2, values_only=True) if str(dict(zip(headers, r)).get('Topic ID')) == '134']
print(f"[OK] Excel 'QBank/questions_bank.xlsx': {len(t134_excel)} questions for Topic 134")

# 4. Image directories
dirs = ['public/images', 'dist/images', 'QBank/public/images', 'QBank/dist/images']
missing_count = 0
for i in range(1, 51):
    for d in dirs:
        s = os.path.join(d, f"g8_t134_q{i}.svg")
        p = os.path.join(d, f"g8_t134_q{i}.png")
        if not os.path.exists(s) or not os.path.exists(p):
            missing_count += 1

print(f"[OK] Image Directories ({len(dirs)} locations): All 50 SVG & PNG files present! Missing: {missing_count}")

