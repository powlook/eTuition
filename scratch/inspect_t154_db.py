import sqlite3
import json

def inspect_t154():
    conn = sqlite3.connect('server/etuition.db')
    cursor = conn.cursor()
    cursor.execute('''
        SELECT q.id, q.question_title, q.question_text, q.options_json, q.correct_answer, q.image_url, q.show_image
        FROM questions q
        JOIN topics t ON q.topic_id = t.id
        WHERE t.id = 154 OR q.question_title LIKE '%T154%' OR q.id LIKE '%T154%'
    ''')
    rows = cursor.fetchall()
    print(f"Total T154 questions in server/etuition.db: {len(rows)}")
    for r in rows:
        print(f"ID: {r[0]} | Title: {r[1]} | ShowImg: {r[6]} | ImgUrl: {r[5]}")
        print(f"  QText: {r[2][:120]}...")
        print(f"  Correct: {r[4]}")
        print("-" * 60)
    conn.close()

if __name__ == "__main__":
    inspect_t154()
