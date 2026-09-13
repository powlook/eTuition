import sqlite3
import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

def verify_final_t154():
    conn = sqlite3.connect('server/etuition.db')
    cursor = conn.cursor()
    cursor.execute('''
        SELECT id, question_title, options_json, correct_answer, show_image, image_url
        FROM questions
        WHERE topic_id = 154 OR question_title LIKE '%T154%'
    ''')
    rows = cursor.fetchall()
    print(f"Verified {len(rows)} T154 questions in server/etuition.db")
    
    imaged_count = 0
    non_imaged_count = 0
    corrupted_count = 0
    
    for r in rows:
        q_id, title, opts_str, ans, show_img, img_url = r
        opts = json.loads(opts_str)
        
        # Check if option contains generic placeholder
        for opt in opts:
            opt_txt = opt.get("option_text", "") if isinstance(opt, dict) else str(opt)
            if "Ordered pairs, Table of values" in opt_txt and "Define a relation" not in title and "four different ways" not in title:
                corrupted_count += 1
                print(f"CORRUPTED OPTION in [{q_id}] {title}: {opt_txt}")
                
        if show_img == 1:
            imaged_count += 1
            # Check file existence
            if img_url:
                local_path = img_url.lstrip('/')
                if not os.path.exists(os.path.join('public', local_path.replace('images/', 'images/'))):
                    print(f"MISSING IMAGE FILE for [{q_id}]: {img_url}")
        else:
            non_imaged_count += 1
            if img_url:
                print(f"WARNING: Non-imaged question [{q_id}] has non-empty image_url: {img_url}")
                
    print(f"\nFinal T154 Verification Results:")
    print(f"- Total Questions: {len(rows)}")
    print(f"- Questions WITH Plots (show_image=1): {imaged_count}")
    print(f"- Questions WITHOUT Plots (show_image=0): {non_imaged_count}")
    print(f"- Corrupted Placeholder Options Found: {corrupted_count}")
    
    conn.close()

if __name__ == "__main__":
    verify_final_t154()
