import sqlite3
import os
import glob
import re

db_path = 'server/etuition.db'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

cursor.execute("SELECT id, topic_id, question_title, question_text, image_url, options_json, correct_answer, working_steps_json FROM questions WHERE topic_id = 134")
qs = cursor.fetchall()
print(f"Total questions for Topic 134 in server/etuition.db: {len(qs)}")

svg_files = sorted(glob.glob("public/images/*134*.svg"))
png_files = sorted(glob.glob("public/images/*134*.png"))
print(f"SVG files in public/images matching *134*.svg: {len(svg_files)}")
print(f"PNG files in public/images matching *134*.png: {len(png_files)}")

# Check SVG text content for all 50 SVGs
for svg_path in svg_files:
    with open(svg_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
        texts = re.findall(r'<text[^>]*>(.*?)</text>', content, re.DOTALL)
        print(f"--- {os.path.basename(svg_path)} ---")
        for t in texts:
            # strip xml tags if nested inside text
            clean_t = re.sub(r'<[^>]+>', '', t).strip()
            print("  ", repr(clean_t))

