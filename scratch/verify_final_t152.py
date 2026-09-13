import sqlite3
import json
import os

print("=== STARTING COMPREHENSIVE VERIFICATION FOR FORM 9 TOPIC T152 ===")

no_image_nums = {1, 5, 7, 9, 11, 12, 15, 16, 18, 19, 26, 35, 40, 44, 47, 50}

# 1. DB Verification
dbs = ['server/etuition.db', 'QBank/server/qbank.db', 'QBank/server/etuition.db']
for db_path in dbs:
    conn = sqlite3.connect(db_path)
    c = conn.cursor()
    c.execute("SELECT COUNT(*) FROM questions WHERE topic_id = 152")
    count = c.fetchone()[0]
    print(f"[{db_path}] Topic 152 Question Count: {count}")
    assert count == 50, f"Expected 50 questions in {db_path}, got {count}"
    
    c.execute("SELECT COUNT(*) FROM questions WHERE topic_id = 152 AND show_image = 1")
    img_count = c.fetchone()[0]
    print(f"[{db_path}] Questions with Image (show_image = 1): {img_count}")
    assert img_count == 34, f"Expected 34 image questions in {db_path}, got {img_count}"

    c.execute("SELECT COUNT(*) FROM questions WHERE topic_id = 152 AND (show_image = 0 OR image_url IS NULL)")
    no_img_count = c.fetchone()[0]
    print(f"[{db_path}] Questions WITHOUT Image (show_image = 0): {no_img_count}")
    assert no_img_count == 16, f"Expected 16 non-image questions in {db_path}, got {no_img_count}"
    conn.close()

# 2. JSON Verification
json_paths = [
    'questions.json',
    'QBank/questions.json',
    'QBank/public/questions.json',
    'QBank/dist/questions.json'
]
for jp in json_paths:
    with open(jp, 'r', encoding='utf-8') as f:
        data = json.load(f)
    t152_qs = [q for q in data if str(q.get('topic_id')) == '152']
    print(f"[{jp}] Topic 152 Question Count: {len(t152_qs)}")
    assert len(t152_qs) == 50, f"Expected 50 questions in {jp}, got {len(t152_qs)}"

# 3. Image File Audit across 4 directories
dirs = ['public/images', 'dist/images', 'QBank/public/images', 'QBank/dist/images']
for d in dirs:
    present_svgs = 0
    present_pngs = 0
    unexpected_files = []
    
    for i in range(1, 51):
        svg_file = os.path.join(d, f"g9_t152_q{i}.svg")
        png_file = os.path.join(d, f"g9_t152_q{i}.png")
        
        if i in no_image_nums:
            if os.path.exists(svg_file): unexpected_files.append(svg_file)
            if os.path.exists(png_file): unexpected_files.append(png_file)
        else:
            if os.path.exists(svg_file): present_svgs += 1
            if os.path.exists(png_file): present_pngs += 1
            
    print(f"[{d}] Images: {present_svgs}/34 SVGs, {present_pngs}/34 PNGs present. Unexpected files: {len(unexpected_files)}")
    assert present_svgs == 34 and present_pngs == 34, f"Image count mismatch in {d}!"
    assert len(unexpected_files) == 0, f"Found unexpected plot files for non-image questions in {d}!"

print("=== VERIFICATION COMPLETED: TOPIC T152 IS 100% PERFECTLY AUDITED & SYNCHRONIZED! ===")
