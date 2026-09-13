import sqlite3
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

def verify_t153():
    conn = sqlite3.connect('server/etuition.db')
    cursor = conn.cursor()
    cursor.execute("SELECT id, title FROM topics WHERE id=153 OR title LIKE '%Trigonometric%'")
    topics = cursor.fetchall()
    print("Topics:", topics)
    
    cursor.execute("SELECT id, question_title, options_json, correct_answer FROM questions WHERE topic_id=153 OR topic_id='153' OR topic_id='T153'")
    rows = cursor.fetchall()
    print(f"Total T153 questions found in server/etuition.db: {len(rows)}")
    
    generic_count = 0
    for qid, title, opt_str, ans in rows:
        opts = json.loads(opt_str)
        if isinstance(opts, list):
            for idx, opt in enumerate(opts):
                v = opt.get("option_text", "") if isinstance(opt, dict) else str(opt)
                k = opt.get("option_key", chr(65+idx)) if isinstance(opt, dict) else chr(65+idx)
                if "Opp/Hyp" in v or "Adj/Hyp" in v or "Opp/Adj" in v:
                    generic_count += 1
                    print(f"FOUND GENERIC IN {title} ({qid}): {k} -> {v}")
        elif isinstance(opts, dict):
            for k, v in opts.items():
                if "Opp/Hyp" in v or "Adj/Hyp" in v or "Opp/Adj" in v:
                    generic_count += 1
                    print(f"FOUND GENERIC IN {title} ({qid}): {k} -> {v}")
    
    print(f"Total generic formula fallback options found: {generic_count}")
    
    cursor.execute("SELECT id, question_title, options_json, correct_answer FROM questions WHERE id=134535 OR question_title LIKE '%134535%'")
    sample = cursor.fetchone()
    if sample:
        print("\n--- Sample Q134535 ---")
        print("ID:", sample[0])
        print("Title:", sample[1])
        print("Options:", json.dumps(json.loads(sample[2]), indent=2))
        print("Correct Answer:", sample[3])

    conn.close()

if __name__ == "__main__":
    verify_t153()
