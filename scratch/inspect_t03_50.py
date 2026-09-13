import openpyxl

wb = openpyxl.load_workbook('QBank/resources/Grade_9_Math_50_Unique_Questions.xlsx', data_only=True)
sheet = wb['Measurement & Geometry (MG)']

rows = list(sheet.iter_rows(values_only=True))

header = rows[3]
print("Header columns:", [str(h) for h in header if h is not None])

t03_items = []
for r in rows[4:]:
    if not any(r): continue
    item_id = str(r[0] if len(r)>0 else '')
    if item_id.startswith('T03-'):
        t03_items.append(r)

print(f"Total T03 unique questions in Grade_9_Math_50_Unique_Questions.xlsx: {len(t03_items)}")

with open('scratch/t03_50_unique_detail.txt', 'w', encoding='utf-8') as f:
    for idx, r in enumerate(t03_items, 1):
        item_id = r[0]
        comp = r[3]
        qtext = r[4]
        f.write(f"Q{idx:02d} ({item_id}):\n")
        f.write(f"  Text: {qtext}\n")
        f.write(f"  Comp: {comp}\n\n")

print("Saved scratch/t03_50_unique_detail.txt")

