import openpyxl
import sys

sys.stdout.reconfigure(encoding='utf-8')

wb_qb = openpyxl.load_workbook('questions_bank.xlsx', read_only=True)
sheet_qb = wb_qb['DepEd Question Bank']

qb_by_topic = {}
for row in sheet_qb.iter_rows(min_row=2, values_only=True):
    tid = row[4]
    if tid in list(range(173, 177)):
        if tid not in qb_by_topic:
            qb_by_topic[tid] = []
        qb_by_topic[tid].append(row)

for tid in range(173, 177):
    qlist = qb_by_topic.get(tid, [])
    print(f"questions_bank.xlsx Topic ID {tid}: count = {len(qlist)}")
    if qlist:
        print(f"  First: QID {qlist[0][0]}, Text: {qlist[0][8][:70]}...")
