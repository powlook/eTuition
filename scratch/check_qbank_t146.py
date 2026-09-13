import openpyxl

wb = openpyxl.load_workbook('QBank/questions_bank.xlsx', data_only=True)
sheet = wb.active

headers = [cell.value for cell in sheet[1]]

t146_rows = []
for idx, r in enumerate(sheet.iter_rows(min_row=2, values_only=True), 2):
    r_dict = dict(zip(headers, r))
    topic_id = str(r_dict.get('Topic ID') or '')
    if topic_id == '146':
        t146_rows.append((idx, r_dict))

with open('scratch/t146_excel_full.txt', 'w', encoding='utf-8') as out:
    out.write(f"Total T146 rows in QBank/questions_bank.xlsx: {len(t146_rows)}\n\n")
    for rnum, rdict in t146_rows:
        out.write(f"Row {rnum} (ID {rdict.get('Question ID')}):\n")
        out.write(f"  Title:   {rdict.get('Question Title')}\n")
        out.write(f"  Text:    {rdict.get('Question Text')}\n")
        out.write(f"  Formula: {rdict.get('LaTeX Formula Expression')}\n")
        out.write(f"  Opts:    A: {rdict.get('Option A')} | B: {rdict.get('Option B')} | C: {rdict.get('Option C')} | D: {rdict.get('Option D')}\n")
        out.write(f"  Ans:     {rdict.get('Correct Answer')}\n")
        out.write(f"  Hint:    {rdict.get('Hint')}\n")
        out.write(f"  Steps:   {rdict.get('Working Steps')}\n")
        out.write(f"  Img:     {rdict.get('Image URL')}\n")
        out.write("-" * 60 + "\n")

print("Saved scratch/t146_excel_full.txt")
