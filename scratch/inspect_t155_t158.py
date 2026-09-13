import sqlite3
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

def inspect_topics_155_158():
    conn = sqlite3.connect('server/etuition.db')
    cursor = conn.cursor()
    
    cursor.execute("SELECT id, title, strand, unit FROM topics WHERE id IN (155, 156, 157, 158)")
    topics = cursor.fetchall()
    print("Topics Info:")
    for t in topics:
        print(f"  Topic ID: {t[0]} | Title: {t[1]} | Strand: {t[2]} | Unit: {t[3]}")
    print("=" * 80)
    
    for top_id in [155, 156, 157, 158]:
        cursor.execute('''
            SELECT id, question_title, question_text, options_json, correct_answer, show_image, image_url
            FROM questions
            WHERE topic_id = ?
            ORDER BY CAST(id AS INTEGER) ASC
        ''', (top_id,))
        rows = cursor.fetchall()
        print(f"Topic {top_id}: Total questions = {len(rows)}")
        imaged_count = sum(1 for r in rows if r[5] == 1)
        non_imaged_count = sum(1 for r in rows if r[5] == 0)
        print(f"  Imaged: {imaged_count} | Non-imaged: {non_imaged_count}")
        if rows:
            print(f"  Sample Q [{rows[0][0]}]: {rows[0][1]}")
            print(f"    Text: {rows[0][2][:100]}...")
            print(f"    Options: {rows[0][3][:120]}...")
        print("-" * 80)
        
    conn.close()

if __name__ == "__main__":
    inspect_topics_155_158()
