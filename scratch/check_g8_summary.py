import openpyxl

wb = openpyxl.load_workbook('QBank/resources/Grade_8_Math_50_Unique_Questions.xlsx', data_only=True)
sheet = wb['Summary & Curriculum Matrix']

for row in list(sheet.iter_rows(min_row=5, values_only=True)):
    if any(row):
        print([str(c) for c in row if c is not None])

