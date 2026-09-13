import sqlite3
import json
import os

print("=== STARTING COMPREHENSIVE VERIFICATION FOR FORM 9 TOPIC 153 ===")

no_image_nums = {1, 2, 5, 6, 7, 8, 9, 10, 11, 12, 26, 27, 28, 29, 30, 39, 40, 41, 48, 49}

# 1. DB Verification
dbs = ['server/etuition.db', 'QBank/server/qbank.db', 'QBank/server/etuition.db']
for db_path in dbs:
    conn = sqlite3.connect(db_path)
    c = conn.cursor()
    c.execute("SELECT COUNT(*) FROM questions WHERE topic_id = 153")
    count = c.fetchone()[0]
    print(f"[{db_path}] Topic 153 Question Count: {count}")
    assert count == 50, f"Expected 50 questions in {db_path}, got {count}"
    
    c.execute("SELECT COUNT(*) FROM questions WHERE topic_id = 153 AND show_image = 1")
    img_count = c.fetchone()[0]
    print(f"[{db_path}] Questions with Image (show_image = 1): {img_count}")
    assert img_count == 30, f"Expected 30 image questions in {db_path}, got {img_count}"

    c.execute("SELECT COUNT(*) FROM questions WHERE topic_id = 153 AND (show_image = 0 OR image_url IS NULL)")
    no_img_count = c.fetchone()[0]
    print(f"[{db_path}] Questions WITHOUT Image (show_image = 0): {no_img_count}")
    assert no_img_count == 20, f"Expected 20 non-image questions in {db_path}, got {no_img_count}"
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
    t153_qs = [q for q in data if str(q.get('topic_id')) == '153']
    print(f"[{jp}] Topic 153 Question Count: {len(t153_qs)}")
    assert len(t153_qs) == 50, f"Expected 50 questions in {jp}, got {len(t153_qs)}"

# 3. Image File Audit across 4 directories
dirs = ['public/images', 'dist/images', 'QBank/public/images', 'QBank/dist/images']
for d in dirs:
    present_svgs = 0
    present_pngs = 0
    unexpected_files = []
    
    for i in range(1, 51):
        svg_file = os.path.join(d, f"g9_t153_q{i}.svg")
        png_file = os.path.join(d, f"g9_t153_q{i}.png")
        
        if i in no_image_nums:
            if os.path.exists(svg_file): unexpected_files.append(svg_file)
            if os.path.exists(png_file): unexpected_files.append(png_file)
        else:
            if os.path.exists(svg_file): present_svgs += 1
            if os.path.exists(png_file): present_pngs += 1
            
    print(f"[{d}] Images: {present_svgs}/30 SVGs, {present_pngs}/30 PNGs present. Unexpected files: {len(unexpected_files)}")
    assert present_svgs == 30 and present_pngs == 30, f"Image count mismatch in {d}!"
    assert len(unexpected_files) == 0, f"Found unexpected plot files for non-image questions in {d}!"

print("=== VERIFICATION COMPLETED: TOPIC 153 IS 100% PERFECTLY AUDITED & SYNCHRONIZED! ===")
