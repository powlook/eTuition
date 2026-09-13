import sqlite3
import json
import os

def dump_topics():
    conn = sqlite3.connect('server/etuition.db')
    cursor = conn.cursor()
    
    for top_id in [155, 156, 157, 158]:
        cursor.execute('''
            SELECT id, question_title, question_text, math_formula, options_json, correct_answer, image_url, show_image
            FROM questions
            WHERE topic_id = ?
            ORDER BY CAST(id AS INTEGER) ASC
        ''', (top_id,))
        rows = cursor.fetchall()
        
        q_list = []
        for r in rows:
            q_id, title, qtext, formula, opts_json, ans, img_url, show_img = r
            try:
                opts = json.loads(opts_json)
            except Exception:
                opts = opts_json
            q_list.append({
                "id": str(q_id),
                "title": title,
                "question_text": qtext,
                "math_formula": formula,
                "options": opts,
                "correct_answer": ans,
                "image_url": img_url,
                "show_image": show_img
            })
            
        with open(f'scratch/t{top_id}_dump.json', 'w', encoding='utf-8') as f:
            json.dump(q_list, f, indent=2, ensure_ascii=False)
            
        print(f"Dumped {len(q_list)} questions for Topic {top_id} to scratch/t{top_id}_dump.json")
        
    conn.close()

if __name__ == "__main__":
    dump_topics()
