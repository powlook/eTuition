import sqlite3
import json
import os

# Load perfect T159 data
with open("scratch/t159_50_perfect_built.json", "r", encoding="utf-8") as f:
    t159_data = json.load(f)

print(f"Loaded {len(t159_data)} perfect questions for T159 sync.")

# 1. Update SQLite Databases
dbs = [
    "server/etuition.db",
    "QBank/server/qbank.db",
    "QBank/server/etuition.db"
]

for db_path in dbs:
    if not os.path.exists(db_path):
        print(f"Skipping missing DB: {db_path}")
        continue
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Get existing question IDs for topic_id = 159 sorted by id
    cursor.execute("SELECT id FROM questions WHERE topic_id = 159 ORDER BY id ASC")
    existing_rows = cursor.fetchall()
    
    if len(existing_rows) != 50:
        print(f"Warning: {db_path} has {len(existing_rows)} rows for topic 159 (expected 50)")
    
    for idx, q_info in enumerate(t159_data):
        if idx < len(existing_rows):
            q_id = existing_rows[idx][0]
            opts_json = json.dumps(q_info["options"], ensure_ascii=False)
            cursor.execute("""
                UPDATE questions 
                SET question_title = ?,
                    question_text = ?,
                    math_formula = ?,
                    options_json = ?,
                    correct_answer = ?,
                    show_image = ?,
                    image_url = ?
                WHERE id = ?
            """, (
                q_info["title"],
                q_info["text"],
                q_info["formula"],
                opts_json,
                q_info["correct"],
                q_info["show_image"],
                q_info["image_url"],
                q_id
            ))
    
    conn.commit()
    conn.close()
    print(f"Successfully updated SQLite DB: {db_path}")

# 2. Update JSON Datastores
json_paths = [
    "questions.json",
    "QBank/questions.json",
    "QBank/public/questions.json",
    "QBank/dist/questions.json"
]

for jpath in json_paths:
    if not os.path.exists(jpath):
        print(f"Skipping missing JSON: {jpath}")
        continue
    
    with open(jpath, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    # Handle list of dicts vs dict of topics
    if isinstance(data, list):
        # find items with topic_id == 159
        t159_items = [q for q in data if q.get("topic_id") == 159]
        t159_items.sort(key=lambda x: x.get("id", 0))
        
        for idx, q_info in enumerate(t159_data):
            if idx < len(t159_items):
                target = t159_items[idx]
                target["question_title"] = q_info["title"]
                target["question_text"] = q_info["text"]
                target["math_formula"] = q_info["formula"]
                target["options_json"] = json.dumps(q_info["options"], ensure_ascii=False)
                target["options"] = q_info["options"]
                target["correct_answer"] = q_info["correct"]
                target["correct_option"] = q_info["correct"]
                target["show_image"] = q_info["show_image"]
                target["image_url"] = q_info["image_url"]
    
    elif isinstance(data, dict):
        # If stored by topic key like "159" or in a questions array inside dict
        if "questions" in data and isinstance(data["questions"], list):
            t159_items = [q for q in data["questions"] if q.get("topic_id") == 159]
            t159_items.sort(key=lambda x: x.get("id", 0))
            for idx, q_info in enumerate(t159_data):
                if idx < len(t159_items):
                    target = t159_items[idx]
                    target["question_title"] = q_info["title"]
                    target["question_text"] = q_info["text"]
                    target["math_formula"] = q_info["formula"]
                    target["options_json"] = json.dumps(q_info["options"], ensure_ascii=False)
                    target["options"] = q_info["options"]
                    target["correct_answer"] = q_info["correct"]
                    target["correct_option"] = q_info["correct"]
                    target["show_image"] = q_info["show_image"]
                    target["image_url"] = q_info["image_url"]
    
    with open(jpath, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"Successfully updated JSON datastore: {jpath}")

# 3. Update Excel Bank (if openpyxl is available)
excel_path = "QBank/questions_bank.xlsx"
if os.path.exists(excel_path):
    try:
        import openpyxl
        wb = openpyxl.load_workbook(excel_path)
        sheet = wb.active
        
        # Find header columns
        headers = [cell.value for cell in sheet[1]]
        
        def get_col_idx(name):
            for i, h in enumerate(headers):
                if h and str(h).strip().lower() == name.lower():
                    return i + 1
            return None
        
        topic_col = get_col_idx("topic_id")
        qnum_col = get_col_idx("question_number") or get_col_idx("id")
        text_col = get_col_idx("question_text")
        title_col = get_col_idx("question_title")
        formula_col = get_col_idx("math_formula")
        opta_col = get_col_idx("option_a")
        optb_col = get_col_idx("option_b")
        optc_col = get_col_idx("option_c")
        optd_col = get_col_idx("option_d")
        correct_col = get_col_idx("correct_option") or get_col_idx("correct_answer")
        img_col = get_col_idx("image_url")
        show_col = get_col_idx("show_image")
        
        t159_rows = []
        for r in range(2, sheet.max_row + 1):
            val = sheet.cell(row=r, column=topic_col).value if topic_col else None
            if val == 159 or str(val) == "159":
                t159_rows.append(r)
        
        t159_rows.sort()
        for idx, q_info in enumerate(t159_data):
            if idx < len(t159_rows):
                r = t159_rows[idx]
                if title_col: sheet.cell(row=r, column=title_col, value=q_info["title"])
                if text_col: sheet.cell(row=r, column=text_col, value=q_info["text"])
                if formula_col: sheet.cell(row=r, column=formula_col, value=q_info["formula"])
                
                opts = q_info["options"]
                if opta_col: sheet.cell(row=r, column=opta_col, value=opts[0] if len(opts)>0 else "")
                if optb_col: sheet.cell(row=r, column=optb_col, value=opts[1] if len(opts)>1 else "")
                if optc_col: sheet.cell(row=r, column=optc_col, value=opts[2] if len(opts)>2 else "")
                if optd_col: sheet.cell(row=r, column=optd_col, value=opts[3] if len(opts)>3 else "")
                
                if correct_col: sheet.cell(row=r, column=correct_col, value=q_info["correct"])
                if show_col: sheet.cell(row=r, column=show_col, value=q_info["show_image"])
                if img_col: sheet.cell(row=r, column=img_col, value=q_info["image_url"])
        
        wb.save(excel_path)
        print(f"Successfully updated Excel question bank: {excel_path}")
    except Exception as e:
        print(f"Error updating Excel bank: {e}")

print("Synchronization complete!")
