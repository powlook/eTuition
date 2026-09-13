import sqlite3
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

def inspect_t144():
    conn = sqlite3.connect('server/etuition.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT id, question_title, question_text, math_formula, options_json, correct_answer, show_image, image_url
        FROM questions
        WHERE topic_id = 144 OR topic_id = '144' OR question_title LIKE '%T144%' OR id LIKE '%1340%'
        ORDER BY CAST(id AS INTEGER) ASC
    ''')
    rows = cursor.fetchall()
    print(f"Total T144 questions found in server/etuition.db: {len(rows)}")
    
    q_list = []
    for r in rows:
        q_id, title, qtext, formula, opts_json, ans, show_img, img_url = r
        opts = json.loads(opts_json) if isinstance(opts_json, str) else opts_json
        q_list.append({
            "id": str(q_id),
            "title": title,
            "question_text": qtext,
            "math_formula": formula,
            "options": opts,
            "correct_answer": ans,
            "show_image": show_img,
            "image_url": img_url
        })
        
    with open('scratch/t144_full_dump.json', 'w', encoding='utf-8') as f:
        json.dump(q_list, f, indent=2, ensure_ascii=False)
        
    print("Exported scratch/t144_full_dump.json")
    conn.close()

if __name__ == "__main__":
    inspect_t144()
