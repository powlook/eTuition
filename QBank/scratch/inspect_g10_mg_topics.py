import openpyxl
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Read matatag_topics.json
with open('matatag_topics.json', 'r', encoding='utf-8') as f:
    topics = json.load(f)

g10_mg_topics = [t for t in topics if t.get('form_level') == 10 and 'Measurement' in str(t.get('strand'))]
print(f"matatag_topics.json Form 10 MG topics ({len(g10_mg_topics)}):")
for t in g10_mg_topics:
    print(f"  Topic ID {t['id']}: {t['title']} | Unit: {t['unit']} | Comp: {t['competencies']}")

# Read Grade_10_Math_Questions.xlsx sheet
wb_g10 = openpyxl.load_workbook('resources/Grade_10_Math_Questions.xlsx', read_only=True)
sheet_g10 = wb_g10['Measurement & Geometry (MG)']

g10_topics_excel = {}
for r in sheet_g10.iter_rows(min_row=5, values_only=True):
    if r[1]:
        tcode = r[1]
        if tcode not in g10_topics_excel:
            g10_topics_excel[tcode] = []
        g10_topics_excel[tcode].append(r[4])

print(f"\nGrade_10_Math_Questions.xlsx sheet 'Measurement & Geometry (MG)' topics ({len(g10_topics_excel)}):")
for tcode, qlist in g10_topics_excel.items():
    print(f"  {tcode} -> {len(qlist)} questions")
