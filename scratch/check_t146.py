import sqlite3
import json
import os
import glob
import re

conn = sqlite3.connect('server/etuition.db')
cursor = conn.cursor()

# Find Topic 146 info
cursor.execute("SELECT id, form_level, strand, unit, title, description FROM topics WHERE id = 146 OR title LIKE '%parallel%'")
topics = cursor.fetchall()
print("Topics found for T146:", topics)

cursor.execute("SELECT id, topic_id, question_title, question_text, math_formula, options_json, correct_answer, working_steps_json, image_url FROM questions WHERE topic_id = 146 ORDER BY id")
rows = cursor.fetchall()
print(f"Total questions for Topic 146 in server/etuition.db: {len(rows)}")

svg_files = sorted(glob.glob("public/images/*146*.svg"))
png_files = sorted(glob.glob("public/images/*146*.png"))
print(f"SVG files matching *146*.svg in public/images: {len(svg_files)}")
print(f"PNG files matching *146*.png in public/images: {len(png_files)}")

# Write all questions of Topic 146 to scratch/t146_all_qs.txt
with open('scratch/t146_all_qs.txt', 'w', encoding='utf-8') as f:
    f.write(f"Total questions for Topic 146: {len(rows)}\n\n")
    for idx, r in enumerate(rows, 1):
        q_id, t_id, title, qtext, formula, opts_raw, ans, steps_raw, img_url = r
        opts = json.loads(opts_raw) if opts_raw else []
        f.write(f"Q{idx:02d} (ID {q_id}): {title}\n")
        f.write(f"  Text:    {qtext}\n")
        f.write(f"  Formula: {formula}\n")
        f.write(f"  Img:     {img_url}\n")
        f.write(f"  Ans:     {ans}\n")
        f.write(f"  Opts:    {opts}\n")
        f.write("-" * 60 + "\n")

print("Saved scratch/t146_all_qs.txt")

