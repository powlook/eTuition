import openpyxl

wb = openpyxl.load_workbook('QBank/resources/Grade_9_Math_50_Unique_Questions.xlsx', data_only=True)
sheet = wb['Measurement & Geometry (MG)']

rows = list(sheet.iter_rows(values_only=True))
header = rows[3]
print("All Header columns:")
for idx, h in enumerate(header):
    if h is not None:
        print(f"  Col {idx}: {h}")

print("\nSample row for T03-Q001:")
for r in rows[4:]:
    if r and str(r[0]).startswith('T03-Q001'):
        for idx, val in enumerate(r):
            if val is not None:
                print(f"  Col {idx} ({header[idx] if idx<len(header) else ''}): {str(val)[:80]}")
        break

