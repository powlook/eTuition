import openpyxl

wb = openpyxl.load_workbook('QBank/questions_bank.xlsx', data_only=True)
sheet = wb.active

headers = [cell.value for cell in sheet[1]]
print("Headers in questions_bank.xlsx:", headers)

t134_rows = []
for row in sheet.iter_rows(min_row=2, values_only=True):
    row_dict = dict(zip(headers, row))
    topic_val = str(row_dict.get('Topic ID') or row_dict.get('topic_id') or row_dict.get('Topic') or '')
    code_val = str(row_dict.get('Matatag Code') or row_dict.get('matatag_code') or row_dict.get('Code') or '')
    if '134' in topic_val or '134' in code_val or 'Systems' in str(row_dict.get('Topic Title','')):
        t134_rows.append(row_dict)

print(f"Found {len(t134_rows)} rows for Topic 134 in QBank/questions_bank.xlsx")
if t134_rows:
    for idx, r in enumerate(t134_rows[:5], 1):
        print(f"Row {idx}: {r.get('Question Title') or r.get('question_title')} | {r.get('Question Text') or r.get('question_text')}")
