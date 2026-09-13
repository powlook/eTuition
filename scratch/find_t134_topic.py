import sqlite3

conn = sqlite3.connect('server/etuition.db')
cursor = conn.cursor()

cursor.execute("PRAGMA table_info(topics)")
cols = [c[1] for c in cursor.fetchall()]
print("topics columns:", cols)

cursor.execute("SELECT * FROM topics")
rows = cursor.fetchall()
for r in rows:
    # print topic if form == 8 or title has linear or system
    t_id = r[0]
    title = str(r[3])
    code = str(r[6]) if len(r) > 6 else ''
    if 'System' in title or 'linear' in title.lower() or '134' in code or '134' in str(t_id):
        print(r)
