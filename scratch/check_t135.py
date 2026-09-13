import sqlite3
import json
import os
import glob
import re

conn = sqlite3.connect('server/etuition.db')
cursor = conn.cursor()

cursor.execute("SELECT id, form_level, strand, unit, title, description FROM topics WHERE id = 135 OR title LIKE '%inequalities%'")
topics = cursor.fetchall()
print("Topics found for T135:", topics)

cursor.execute("SELECT id, topic_id, question_title, question_text, image_url, options_json, correct_answer, working_steps_json FROM questions WHERE topic_id = 135 ORDER BY id")
rows = cursor.fetchall()
print(f"Total questions for Topic 135 in server/etuition.db: {len(rows)}")

svg_files = sorted(glob.glob("public/images/*135*.svg"))
png_files = sorted(glob.glob("public/images/*135*.png"))
print(f"SVG files matching *135*.svg in public/images: {len(svg_files)}")
print(f"PNG files matching *135*.png in public/images: {len(png_files)}")

# Dump questions to scratch/t135_all_qs.txt for inspection
with open('scratch/t135_all_qs.txt', 'w', encoding='utf-8') as f:
    f.write(f"Total questions for Topic 135: {len(rows)}\n\n")
    for idx, r in enumerate(rows, 1):
        q_id, t_id, title, qtext, img_url, opts_raw, ans, steps_raw = r
        opts = json.loads(opts_raw) if opts_raw else []
        f.write(f"Q{idx:02d} (ID {q_id}): {title}\n")
        f.write(f"  Text: {qtext}\n")
        f.write(f"  Img:  {img_url}\n")
        f.write(f"  Ans:  {ans}\n")
        f.write(f"  Opts: {opts}\n")
        f.write("-" * 50 + "\n")

print("Saved scratch/t135_all_qs.txt")

