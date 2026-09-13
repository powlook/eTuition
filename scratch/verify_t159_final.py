import sqlite3
import json
import os

print("=== VERIFYING FORM 9 TOPIC T159 ===")

db_path = "server/etuition.db"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

cursor.execute("SELECT id, question_title, question_text, math_formula, options_json, correct_answer, image_url, show_image FROM questions WHERE topic_id = 159 ORDER BY id ASC")
rows = cursor.fetchall()

print(f"Total questions in T159 in {db_path}: {len(rows)}")

generic_patterns = [
    "Re-plot the graph starting the vertical y-axis at zero",
    "Convert the graph to a 3D pie chart",
    "Change the bar colors to grey",
    "Remove the y-axis labels completely"
]

errors = []
imaged_count = 0
text_count = 0

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

    # Check 3: Generic option leakage
    for opt in opts:
        for gen in generic_patterns:
            if gen in opt and opts.count(opt) > 1:
                errors.append(f"Q{idx} (ID {q_id}) contains repeated generic option: {opt}")

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
print(f"  Errors found: {len(errors)}")

if errors:
    for e in errors[:10]:
        print(f"  - ERROR: {e}")
else:
    print("SUCCESS: 0 errors found! Form 9 Topic T159 is 100% verified and defect-free.")
