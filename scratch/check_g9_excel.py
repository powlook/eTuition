import openpyxl
import os

excel_files = [
    'QBank/resources/Grade_9_Math_50_Unique_Questions.xlsx',
    'QBank/resources/Grade_9_Math_50_Questions.xlsx',
    'QBank/resources/Grade_9_Math_Questions.xlsx',
    'QBank/questions_bank.xlsx'
]

for ef in excel_files:
    if os.path.exists(ef):
        print(f"=== File: {ef} ===")
        wb = openpyxl.load_workbook(ef, read_only=True)
        print("  Sheet names:", wb.sheetnames)
        for sname in wb.sheetnames:
            sheet = wb[sname]
            # search first 100 rows for T146 or Parallelism or quadrilateral
            rows = list(sheet.iter_rows(values_only=True))
            t146_matches = []
            for r_idx, r in enumerate(rows):
                r_str = " ".join([str(c) for c in r if c is not None])
                if '146' in r_str or 'Parallelism' in r_str or 'A(1, 2)' in r_str or 'quadrilateral' in r_str.lower():
                    t146_matches.append((r_idx+1, r_str[:100]))
            print(f"  Sheet '{sname}' ({len(rows)} rows): {len(t146_matches)} matching rows found")
            if t146_matches:
                for idx, (rnum, sample) in enumerate(t146_matches[:5]):
                    print(f"    Line {rnum}: {sample}")

