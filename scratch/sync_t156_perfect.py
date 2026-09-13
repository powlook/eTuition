import sqlite3
import json
import os
import pandas as pd

def sync_t156_perfect():
    with open('scratch/t156_50_perfect_built.json', 'r', encoding='utf-8') as f:
        t156_questions = json.load(f)
        
    print(f"Loaded {len(t156_questions)} questions from scratch/t156_50_perfect_built.json")

    # 1. Update SQLite DBs
    db_paths = [
        'server/etuition.db',
        'QBank/server/qbank.db',
        'QBank/server/etuition.db'
    ]
    
    for db_path in db_paths:
        if not os.path.exists(db_path):
            print(f"Skipping non-existent DB: {db_path}")
            continue
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        for q in t156_questions:
            q_id = q["id"]
            opts_list = [q["optA"], q["optB"], q["optC"], q["optD"]]
            opts_json = json.dumps(opts_list, ensure_ascii=False)
            show_img = q["show_image"]
            img_url = q["image_url"] if show_img else ""
            
            cursor.execute('''
                UPDATE questions
                SET question_title = ?,
                    question_text = ?,
                    math_formula = ?,
                    options_json = ?,
                    correct_answer = ?,
                    show_image = ?,
                    image_url = ?
                WHERE id = ? OR question_title LIKE ?
            ''', (
                q["title"],
                q["question_text"],
                q["math_formula"],
                opts_json,
                q["correct_answer"],
                show_img,
                img_url,
                q_id,
                f"%{q_id}%"
            ))
            
        conn.commit()
        conn.close()
        print(f"Updated SQLite database: {db_path}")

    # 2. Update JSON datastores
    json_paths = [
        'questions.json',
        'QBank/questions.json',
        'QBank/public/questions.json',
        'QBank/dist/questions.json'
    ]
    
    q_map = {q["id"]: q for q in t156_questions}
    
    for jpath in json_paths:
        if not os.path.exists(jpath):
            print(f"Skipping non-existent JSON: {jpath}")
            continue
        with open(jpath, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        updated_count = 0
        if isinstance(data, list):
            for item in data:
                item_id = str(item.get("id", ""))
                title = str(item.get("question_title", ""))
                matched_id = None
                if item_id in q_map:
                    matched_id = item_id
                else:
                    for k in q_map:
                        if k in title or k in item_id:
                            matched_id = k
                            break
                            
                if matched_id:
                    q = q_map[matched_id]
                    item["question_title"] = q["title"]
                    item["question_text"] = q["question_text"]
                    item["math_formula"] = q["math_formula"]
                    opts = [q["optA"], q["optB"], q["optC"], q["optD"]]
                    item["options"] = opts
                    item["options_json"] = json.dumps(opts, ensure_ascii=False)
                    item["correct_answer"] = q["correct_answer"]
                    item["show_image"] = q["show_image"]
                    item["image_url"] = q["image_url"] if q["show_image"] else ""
                    updated_count += 1
                    
        with open(jpath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"Updated JSON datastore ({updated_count} items): {jpath}")

    # 3. Update Excel datastore
    excel_path = 'QBank/questions_bank.xlsx'
    if os.path.exists(excel_path):
        df = pd.read_excel(excel_path)
        excel_updated = 0
        for idx, row in df.iterrows():
            row_id = str(row.get('Question ID'))
            if row_id in q_map:
                q = q_map[row_id]
                df.at[idx, 'Question Title'] = q["title"]
                df.at[idx, 'Question Text'] = q["question_text"]
                df.at[idx, 'LaTeX Formula Expression'] = q["math_formula"]
                df.at[idx, 'Option A'] = q["optA"]
                df.at[idx, 'Option B'] = q["optB"]
                df.at[idx, 'Option C'] = q["optC"]
                df.at[idx, 'Option D'] = q["optD"]
                df.at[idx, 'Correct Answer'] = q["correct_answer"]
                df.at[idx, 'Image URL'] = q["image_url"] if q["show_image"] else ""
                excel_updated += 1
                
        df.to_excel(excel_path, index=False)
        print(f"Updated Excel datastore ({excel_updated} rows): {excel_path}")

if __name__ == "__main__":
    sync_t156_perfect()
