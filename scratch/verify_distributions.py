import sqlite3
import json

conn = sqlite3.connect('server/etuition.db')
cursor = conn.cursor()

topics = [144, 148, 149, 150, 152, 159]
print("=== FINAL VERIFICATION OF OPTION DISTRIBUTION ===")

for t in topics:
    cursor.execute('SELECT options_json, correct_answer FROM questions WHERE topic_id = ? ORDER BY id ASC', (t,))
    rows = cursor.fetchall()
    counts = {'A': 0, 'B': 0, 'C': 0, 'D': 0, 'Unknown': 0}
    for r in rows:
        opts = json.loads(r[0]) if r[0] else []
        ans = r[1]
        if ans in opts:
            idx = opts.index(ans)
            counts[['A','B','C','D'][idx]] += 1
        else:
            counts['Unknown'] += 1
    print(f"Topic T{t} ({len(rows)} Qs): A = {counts['A']}, B = {counts['B']}, C = {counts['C']}, D = {counts['D']} (Unknown = {counts['Unknown']})")
