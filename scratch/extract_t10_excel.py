import openpyxl

wb = openpyxl.load_workbook('QBank/resources/Grade_8_Math_50_Unique_Questions.xlsx', data_only=True)
sheet = wb['Number and Algebra (NA)']

# Find row where headers are
rows = list(sheet.iter_rows(values_only=True))
header_row_idx = 3 # 0-indexed row 3 is line 4
headers = rows[header_row_idx]
print("Headers:", [str(h) for h in headers if h is not None])

t10_qs = []
for r in rows[header_row_idx+1:]:
    if not any(r): continue
    t_code = str(r[0] if len(r)>0 else '')
    if t_code.startswith('T10-'):
        t10_qs.append(r)

print(f"Total T10 questions in Grade_8_Math_50_Unique_Questions.xlsx: {len(t10_qs)}")
with open('scratch/t10_excel_questions.txt', 'w', encoding='utf-8') as f:
    for idx, r in enumerate(t10_qs, 1):
        item_id = r[0]
        topic_name = r[1]
        comp = r[3]
        qtext = r[4]
        latex = r[5] if len(r)>5 else ''
        qtype = r[6] if len(r)>6 else ''
        op_a = r[7] if len(r)>7 else ''
        op_b = r[8] if len(r)>8 else ''
        op_c = r[9] if len(r)>9 else ''
        op_d = r[10] if len(r)>10 else ''
        ans = r[11] if len(r)>11 else ''
        f.write(f"Q{idx:02d} ({item_id}): {qtext}\n")
        f.write(f"  LaTeX: {latex}\n")
        f.write(f"  Opts: A: {op_a} | B: {op_b} | C: {op_c} | D: {op_d}\n")
        f.write(f"  Ans: {ans}\n\n")

print("Saved scratch/t10_excel_questions.txt")

