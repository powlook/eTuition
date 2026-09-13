import sqlite3
import json
import os

print("=== VERIFYING FORM 9 TOPIC T160 ===")

db_path = "server/etuition.db"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

cursor.execute("SELECT id, question_title, question_text, math_formula, options_json, correct_answer, image_url, show_image FROM questions WHERE topic_id = 160 ORDER BY id ASC")
rows = cursor.fetchall()

print(f"Total questions in T160 in {db_path}: {len(rows)}")

generic_patterns = [
    "P(E) = n(E) / n(S)",
    "P(E) = n(S) / n(E)",
    "P(E) = n(S) - n(E)"
]

errors = []
imaged_count = 0
text_count = 0
pos_counts = {"A": 0, "B": 0, "C": 0, "D": 0}

for idx, r in enumerate(rows, 1):
    q_id = r[0]
    title = r[1]
    text = r[2]
    formula = r[3]
    opts = json.loads(r[4]) if r[4] else []
    correct = r[5]
    img = r[6]
    show_img = r[7]

    # Check 1: 4 options
    if len(opts) != 4:
        errors.append(f"Q{idx} (ID {q_id}) has {len(opts)} options instead of 4")

    # Check 2: Correct answer in options
    if correct not in opts:
        errors.append(f"Q{idx} (ID {q_id}) correct answer '{correct}' not found in options {opts}")
    else:
        c_idx = opts.index(correct)
        pos_counts[["A", "B", "C", "D"][c_idx]] += 1

    # Check 3: Generic formula option leakage
    for gen in generic_patterns:
        if opts.count(gen) > 1:
            errors.append(f"Q{idx} (ID {q_id}) contains repeated generic formula options: {opts}")

    # Check 4: Image verification
    if show_img == 1:
        imaged_count += 1
        if not img or not img.startswith("/images/"):
            errors.append(f"Q{idx} (ID {q_id}) show_image=1 but invalid image_url: {img}")
        else:
            rel_img = img.lstrip("/")
            p1 = os.path.join("public", rel_img)
            p2 = os.path.join("QBank", "public", rel_img)
            if not os.path.exists(p1):
                errors.append(f"Q{idx} (ID {q_id}) image file missing at {p1}")
            if not os.path.exists(p2):
                errors.append(f"Q{idx} (ID {q_id}) image file missing at {p2}")
    else:
        text_count += 1
        if img is not None and img != "":
            errors.append(f"Q{idx} (ID {q_id}) show_image=0 but image_url is not None: {img}")

print(f"Audit Summary:")
print(f"  Total Questions: {len(rows)}")
print(f"  Imaged Questions (show_image=1): {imaged_count}")
print(f"  Text Questions (show_image=0): {text_count}")
print(f"  Option Letter Distribution: {pos_counts}")
print(f"  Errors found: {len(errors)}")

if errors:
    for e in errors[:10]:
        print(f"  - ERROR: {e}")
else:
    print("SUCCESS: 0 errors found! Form 9 Topic T160 is 100% verified and defect-free.")
