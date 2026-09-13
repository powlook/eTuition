import sqlite3
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

def dump_topic_144():
    conn = sqlite3.connect('server/etuition.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT id, question_title, question_text, math_formula, options_json, correct_answer, image_url, show_image
        FROM questions
        WHERE topic_id = 144
        ORDER BY CAST(id AS INTEGER) ASC
    ''')
    rows = cursor.fetchall()
    print(f"Total Topic 144 questions in server/etuition.db: {len(rows)}")
    
    q_data = []
    for r in rows:
        q_id, title, qtext, formula, opts_json, ans, img_url, show_img = r
        opts = json.loads(opts_json) if isinstance(opts_json, str) else opts_json
        q_data.append({
            "id": str(q_id),
            "title": title,
            "question_text": qtext,
            "math_formula": formula,
            "options": opts,
            "correct_answer": ans,
            "show_image": show_img,
            "image_url": img_url
        })
        
    with open('scratch/t144_exact_dump.json', 'w', encoding='utf-8') as f:
        json.dump(q_data, f, indent=2, ensure_ascii=False)
        
    print("Exported scratch/t144_exact_dump.json")
    conn.close()

if __name__ == "__main__":
    dump_topic_144()
