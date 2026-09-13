import sqlite3
import json
import os
import random
import openpyxl

topics = [144, 148, 149, 150, 152, 159]

dbs = [
    "server/etuition.db",
    "QBank/server/qbank.db",
    "QBank/server/etuition.db"
]

json_paths = [
    "questions.json",
    "QBank/questions.json",
    "QBank/public/questions.json",
    "QBank/dist/questions.json"
]

excel_path = "QBank/questions_bank.xlsx"

print("=== SHUFFLING OPTIONS FOR TOPICS 144, 148, 149, 150, 152, 159 ===")

for t in topics:
    # Use topic ID as seed base
    random.seed(t * 100 + 42)
    
    built_json_path = f"scratch/t{t}_50_perfect_built.json"
    
    pos_counts = {"A": 0, "B": 0, "C": 0, "D": 0}
    t_qdata = []
    
    if os.path.exists(built_json_path):
        with open(built_json_path, "r", encoding="utf-8") as f:
            questions = json.load(f)
        
        for q in questions:
            correct_text = q.get("correct") or q.get("correct_answer")
            if "options" in q:
                opts = list(q["options"])
            else:
                opts = [q["optA"], q["optB"], q["optC"], q["optD"]]
            
            random.shuffle(opts)
            q["options"] = opts
            q["correct"] = correct_text
            q["correct_answer"] = correct_text
            
            if correct_text in opts:
                idx = opts.index(correct_text)
                pos_counts[["A", "B", "C", "D"][idx]] += 1
            
            t_qdata.append({
                "id": q.get("id"),
                "title": q.get("title"),
                "text": q.get("text") or q.get("question_text"),
                "formula": q.get("formula") or q.get("math_formula"),
                "options": opts,
                "correct": correct_text,
                "show_image": q.get("show_image"),
                "image_url": q.get("image_url")
            })
            
        with open(built_json_path, "w", encoding="utf-8") as f:
            json.dump(questions, f, indent=2, ensure_ascii=False)
            
        print(f"Topic {t}: Shuffled JSON. New correct option distribution: {pos_counts}")

    # Update DBs
    for dbp in dbs:
        if not os.path.exists(dbp): continue
        c = sqlite3.connect(dbp)
        cur = c.cursor()
        cur.execute("SELECT id FROM questions WHERE topic_id = ? ORDER BY id ASC", (t,))
        ids = [row[0] for row in cur.fetchall()]
        for i, item in enumerate(t_qdata):
            if i < len(ids):
                qid = ids[i]
                cur.execute("UPDATE questions SET options_json = ?, correct_answer = ? WHERE id = ?", (
                    json.dumps(item["options"], ensure_ascii=False),
                    item["correct"],
                    qid
                ))
        c.commit()
        c.close()
    
    # Update JSON files
    for jpath in json_paths:
        if not os.path.exists(jpath): continue
        with open(jpath, "r", encoding="utf-8") as f:
            jdata = json.load(f)
        
        items_to_update = []
        if isinstance(jdata, list):
            items_to_update = [q for q in jdata if q.get("topic_id") == t]
        elif isinstance(jdata, dict) and "questions" in jdata:
            items_to_update = [q for q in jdata["questions"] if q.get("topic_id") == t]
        
        items_to_update.sort(key=lambda x: x.get("id", 0))
        for i, item in enumerate(t_qdata):
            if i < len(items_to_update):
                t_item = items_to_update[i]
                t_item["options"] = item["options"]
                t_item["options_json"] = json.dumps(item["options"], ensure_ascii=False)
                t_item["correct_answer"] = item["correct"]
                t_item["correct_option"] = item["correct"]
                
        with open(jpath, "w", encoding="utf-8") as f:
            json.dump(jdata, f, indent=2, ensure_ascii=False)

    # Update Excel Bank
    if os.path.exists(excel_path):
        try:
            wb = openpyxl.load_workbook(excel_path)
            sheet = wb.active
            headers = [cell.value for cell in sheet[1]]
            
            def get_col(name):
                for col_i, h in enumerate(headers):
                    if h and str(h).strip().lower() == name.lower():
                        return col_i + 1
                return None
            
            t_col = get_col("topic_id")
            opta_c = get_col("option_a")
            optb_c = get_col("option_b")
            optc_c = get_col("option_c")
            optd_c = get_col("option_d")
            corr_c = get_col("correct_option") or get_col("correct_answer")
            
            rows = []
            for r in range(2, sheet.max_row + 1):
                if sheet.cell(row=r, column=t_col).value in [t, str(t)]:
                    rows.append(r)
            rows.sort()
            
            for i, item in enumerate(t_qdata):
                if i < len(rows):
                    row_num = rows[i]
                    opts = item["options"]
                    if opta_c: sheet.cell(row=row_num, column=opta_c, value=opts[0] if len(opts)>0 else "")
                    if optb_c: sheet.cell(row=row_num, column=optb_c, value=opts[1] if len(opts)>1 else "")
                    if optc_c: sheet.cell(row=row_num, column=optc_c, value=opts[2] if len(opts)>2 else "")
                    if optd_c: sheet.cell(row=row_num, column=optd_c, value=opts[3] if len(opts)>3 else "")
                    if corr_c: sheet.cell(row=row_num, column=corr_c, value=item["correct"])
            wb.save(excel_path)
        except Exception as e:
            print(f"Excel shuffle error for Topic {t}: {e}")

print("\nAll topics successfully shuffled and synchronized across all DBs, JSONs, and Excel bank!")
