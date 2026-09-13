import os
import glob
import sqlite3
import json
import openpyxl

img_dirs = [
    'public/images',
    'dist/images',
    'QBank/public/images',
    'QBank/dist/images'
]

print("=== Checking Image Files across 4 directories ===")
missing_files = []
for i in range(1, 51):
    svg_name = f"g8_t134_q{i}.svg"
    png_name = f"g8_t134_q{i}.png"
    for d in img_dirs:
        svg_p = os.path.join(d, svg_name)
        png_p = os.path.join(d, png_name)
        if not os.path.exists(svg_p):
            missing_files.append(svg_p)
        if not os.path.exists(png_p):
            missing_files.append(png_p)

print(f"Missing image files count: {len(missing_files)}")
if missing_files:
    print("Missing files sample:", missing_files[:10])

# Check databases sync for topic_id = 134
dbs = [
    'server/etuition.db',
    'QBank/server/qbank.db',
    'QBank/server/etuition.db'
]

print("\n=== Checking Databases ===")
db_counts = {}
for db in dbs:
    if os.path.exists(db):
        conn = sqlite3.connect(db)
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM questions WHERE topic_id = 134")
        cnt = cursor.fetchone()[0]
        db_counts[db] = cnt
        print(f"  {db}: {cnt} questions")

# Check JSON files
json_paths = [
    'questions.json',
    'QBank/questions.json',
    'QBank/public/questions.json',
    'QBank/dist/questions.json'
]

print("\n=== Checking JSON Files ===")
for jp in json_paths:
    if os.path.exists(jp):
        with open(jp, 'r', encoding='utf-8') as f:
            data = json.load(f)
            t134_qs = [q for q in data if str(q.get('topic_id')) == '134']
            print(f"  {jp}: {len(t134_qs)} questions")

# Check Excel
print("\n=== Checking Excel File ===")
if os.path.exists('QBank/questions_bank.xlsx'):
    wb = openpyxl.load_workbook('QBank/questions_bank.xlsx', data_only=True)
    sheet = wb.active
    headers = [cell.value for cell in sheet[1]]
    t134_excel = []
    for r in sheet.iter_rows(min_row=2, values_only=True):
        row_dict = dict(zip(headers, r))
        if str(row_dict.get('Topic ID')) == '134':
            t134_excel.append(row_dict)
    print(f"  QBank/questions_bank.xlsx: {len(t134_excel)} questions")

