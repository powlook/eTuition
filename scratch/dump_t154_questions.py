import sqlite3
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

def inspect_all_t154():
    conn = sqlite3.connect('server/etuition.db')
    cursor = conn.cursor()
    
    cursor.execute("SELECT id, title, strand, unit FROM topics WHERE id=154")
    topic_info = cursor.fetchone()
    print("Topic Info:", topic_info)
    print("=" * 80)
    
    cursor.execute('''
        SELECT id, question_title, question_text, math_formula, options_json, correct_answer, image_url, show_image, show_formula, difficulty
        FROM questions
        WHERE topic_id = 154
        ORDER BY CAST(id AS INTEGER) ASC
    ''')
    rows = cursor.fetchall()
    print(f"Total T154 questions count: {len(rows)}\n")
    
    questions_data = []
    for r in rows:
        q_id, title, qtext, formula, opts_json, ans, img_url, show_img, show_form, diff = r
        try:
            opts = json.loads(opts_json)
        except Exception:
            opts = opts_json
            
        q_item = {
            "id": q_id,
            "title": title,
            "question_text": qtext,
            "math_formula": formula,
            "options": opts,
            "correct_answer": ans,
            "image_url": img_url,
            "show_image": show_img,
            "show_formula": show_form,
            "difficulty": diff
        }
        questions_data.append(q_item)
        
        print(f"[{q_id}] {title}")
        print(f"  QText: {qtext}")
        print(f"  Formula: {formula}")
        print(f"  ShowImg: {show_img} | ImgUrl: {img_url} | ShowFormula: {show_form}")
        print(f"  Options: {opts}")
        print(f"  Correct: {ans}")
        print("-" * 80)

    with open('scratch/t154_all_questions_dump.json', 'w', encoding='utf-8') as f:
        json.dump(questions_data, f, indent=2, ensure_ascii=False)
        
    conn.close()

if __name__ == "__main__":
    inspect_all_t154()
