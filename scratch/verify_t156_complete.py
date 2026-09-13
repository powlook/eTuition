import sqlite3
import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

def verify_t156_complete():
    conn = sqlite3.connect('server/etuition.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT id, question_title, question_text, options_json, correct_answer, show_image, image_url
        FROM questions
        WHERE topic_id = 156 OR question_title LIKE '%T156%'
        ORDER BY CAST(id AS INTEGER) ASC
    ''')
    rows = cursor.fetchall()
    print(f"Total T156 questions verified in server/etuition.db: {len(rows)}")
    
    generic_count = 0
    missing_images = 0
    
    for r in rows:
        q_id, title, qtext, opts_str, ans, show_img, img_url = r
        opts = json.loads(opts_str) if isinstance(opts_str, str) else opts_str
        
        # Check generic option repetition
        for opt in opts:
            opt_txt = opt.get("option_text", "") if isinstance(opt, dict) else str(opt)
            if "graph is a circle" in opt_txt and "Define a quadratic function" not in title and "effect of coefficient a" not in title:
                generic_count += 1
                print(f"GENERIC OPTION FOUND in [{q_id}] {title}: {opt_txt}")
                
        if show_img == 1 and img_url:
            local_path = os.path.join('public', img_url.lstrip('/'))
            if not os.path.exists(local_path):
                missing_images += 1
                print(f"MISSING IMAGE for [{q_id}]: {img_url}")
                
    print("\n--- SAMPLE CHECK Q134695 ---")
    cursor.execute("SELECT question_title, question_text, options_json, correct_answer, image_url FROM questions WHERE id=134695")
    q134695 = cursor.fetchone()
    if q134695:
        print("Title:", q134695[0])
        print("Text:", q134695[1])
        print("Options:", json.dumps(json.loads(q134695[2]), indent=2))
        print("Correct Answer:", q134695[3])
        print("Image URL:", q134695[4])
        
    print(f"\nFinal Verification Results for Topic T156:")
    print(f"- Total Questions: {len(rows)}")
    print(f"- Generic Fallback Options Remaining: {generic_count}")
    print(f"- Missing Image Files: {missing_images}")
    
    conn.close()

if __name__ == "__main__":
    verify_t156_complete()
