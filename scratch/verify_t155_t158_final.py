import sqlite3
import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

def verify_all_topics():
    conn = sqlite3.connect('server/etuition.db')
    cursor = conn.cursor()
    
    print("=" * 80)
    print("FINAL VERIFICATION FOR TOPICS 155, 156, 157, 158")
    print("=" * 80)
    
    total_q = 0
    total_imaged = 0
    total_non_imaged = 0
    
    for top_id in [155, 156, 157, 158]:
        cursor.execute('''
            SELECT id, question_title, options_json, correct_answer, show_image, image_url
            FROM questions
            WHERE topic_id = ?
            ORDER BY CAST(id AS INTEGER) ASC
        ''', (top_id,))
        rows = cursor.fetchall()
        
        imaged = sum(1 for r in rows if r[4] == 1)
        non_imaged = sum(1 for r in rows if r[4] == 0)
        total_q += len(rows)
        total_imaged += imaged
        total_non_imaged += non_imaged
        
        # Check image files
        missing_images = 0
        for r in rows:
            q_id, title, opts_str, ans, show_img, img_url = r
            if show_img == 1 and img_url:
                local_path = os.path.join('public', img_url.lstrip('/'))
                if not os.path.exists(local_path):
                    missing_images += 1
                    
        print(f"Topic {top_id}:")
        print(f"  - Total Questions: {len(rows)}")
        print(f"  - Questions WITH Plots (show_image=1): {imaged}")
        print(f"  - Questions WITHOUT Plots (show_image=0): {non_imaged}")
        print(f"  - Missing Image Files: {missing_images}")
        print("-" * 60)

    print(f"SUMMARY ACROSS ALL 4 TOPICS:")
    print(f"- Total Questions Processed: {total_q}")
    print(f"- Total Imaged Questions: {total_imaged}")
    print(f"- Total Non-Imaged Questions: {total_non_imaged}")
    print("=" * 80)
    
    conn.close()

if __name__ == "__main__":
    verify_all_topics()
