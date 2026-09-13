import openpyxl

wb = openpyxl.load_workbook('QBank/resources/Grade_8_Math_50_Unique_Questions.xlsx', data_only=True)
sheet = wb['Number and Algebra (NA)']

headers = [cell.value for cell in sheet[1]]
print("Headers in Grade_8_Math_50_Unique_Questions.xlsx:", headers[:10])

t134_rows = []
for row in sheet.iter_rows(min_row=2, values_only=True):
    if not any(row): continue
    row_dict = dict(zip(headers, row))
    topic_val = str(row_dict.get('Topic ID') or row_dict.get('topic_id') or row_dict.get('Topic') or '')
    code_val = str(row_dict.get('Matatag Code') or row_dict.get('matatag_code') or row_dict.get('Code') or '')
    title_val = str(row_dict.get('Topic Title') or row_dict.get('Topic Name') or row_dict.get('Topic') or '')
    if '134' in topic_val or '134' in code_val or 'System' in title_val or '134' in str(row_dict.get('Question ID','')):
        t134_rows.append(row_dict)

print(f"Found {len(t134_rows)} rows for Topic 134 in Grade_8_Math_50_Unique_Questions.xlsx")
for idx, r in enumerate(t134_rows[:15], 1):
    qtitle = r.get('Question Title') or r.get('question_title') or r.get('Title')
    qtext = r.get('Question Text') or r.get('question_text') or r.get('Text')
    print(f"Row {idx}: {qtitle} | {str(qtext)[:60]}")

