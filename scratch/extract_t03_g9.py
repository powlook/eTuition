import openpyxl

wb = openpyxl.load_workbook('QBank/resources/Grade_9_Math_50_Unique_Questions.xlsx', data_only=True)
sheet = wb['Measurement & Geometry (MG)']

rows = list(sheet.iter_rows(values_only=True))

# Header row is at row index 3 (line 4)
header = rows[3]
print("Headers:", [str(h) for h in header if h is not None])

t03_qs = []
for r in rows[4:]:
    if not any(r): continue
    item_id = str(r[0] if len(r)>0 else '')
    if item_id.startswith('T03-'):
        t03_qs.append(r)

print(f"Total T03 questions found in Grade_9_Math_50_Unique_Questions.xlsx: {len(t03_qs)}")

with open('scratch/t03_g9_excel_questions.txt', 'w', encoding='utf-8') as f:
    for idx, r in enumerate(t03_qs, 1):
        item_id = r[0]
        topic_info = r[1]
        domain = r[2]
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
        f.write(f"  LaTeX/Formula: {latex}\n")
        f.write(f"  Opts: A: {op_a} | B: {op_b} | C: {op_c} | D: {op_d}\n")
        f.write(f"  Ans:  {ans}\n\n")

print("Saved scratch/t03_g9_excel_questions.txt")

