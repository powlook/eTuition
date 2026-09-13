import sqlite3
import json

conn = sqlite3.connect('server/etuition.db')
cursor = conn.cursor()

cursor.execute("SELECT id, title, strand, unit FROM topics WHERE id=144 OR title LIKE '%geometric%' OR title LIKE '%notation%'")
print("Topics:", cursor.fetchall())

cursor.execute("SELECT id, question_title, question_text, topic_id FROM questions WHERE id IN ('Q134089', 'Q134091', 'Q134096') OR question_title LIKE '%134089%' OR question_title LIKE '%T144%' OR id = 134089")
print("Sample questions:")
for row in cursor.fetchall():
    print("  ", row[0], "|", row[1], "| topic_id:", row[3])
    print("    Text:", row[2])

conn.close()
