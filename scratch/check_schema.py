import sqlite3

conn = sqlite3.connect('server/etuition.db')
cursor = conn.cursor()

cursor.execute("PRAGMA table_info(topics)")
print("topics columns:", cursor.fetchall())

cursor.execute("PRAGMA table_info(questions)")
print("questions columns:", cursor.fetchall())

cursor.execute("SELECT * FROM topics")
print("topics rows:", cursor.fetchall())
