import openpyxl
import sqlite3
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Read matatag_topics.json
with open('matatag_topics.json', 'r', encoding='utf-8') as f:
    topics = json.load(f)

g10_dp_topics = [t for t in topics if t.get('form_level') == 10 and ('Data' in str(t.get('strand')) or 'Probability' in str(t.get('strand')))]
print(f"matatag_topics.json Form 10 DP topics ({len(g10_dp_topics)}):")
for t in g10_dp_topics:
    print(f"  Topic ID {t['id']}: {t['title']} | Comp: {t['competencies']}")

# Read SQLite DB topics
db_path = 'server/qbank.db'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()
cursor.execute("SELECT id, form_level, strand, title, competencies FROM topics WHERE form_level = 10 AND (strand LIKE '%Data%' OR strand LIKE '%Probability%') ORDER BY id ASC")
db_topics = cursor.fetchall()
print(f"\nSQLite DB Form 10 DP topics ({len(db_topics)}):")
for t in db_topics:
    print(f"  Topic ID {t[0]}: {t[3]} | Comp: {t[4]}")
