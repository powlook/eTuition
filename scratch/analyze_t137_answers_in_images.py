import json
import re

with open('scratch/t137_svg_analysis.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Loaded {len(data)} items for Topic 137 analysis.")

flagged_items = []

for item in data:
    fname = item['fname']
    qid = item['qid']
    qtext = item['question_text']
    ans = item['answer']
    svg_texts = item['svg_texts']
    
    # Extract numerical digits from answer
    ans_nums = re.findall(r'\d+(?:\.\d+)?', ans)
    
    # Check if any answer number appears in SVG texts
    found_in_svg = []
    for txt in svg_texts:
        for num in ans_nums:
            if num in txt:
                found_in_svg.append((num, txt))
                
    if found_in_svg:
        flagged_items.append({
            'fname': fname,
            'qid': qid,
            'qtext': qtext,
            'ans': ans,
            'svg_texts': svg_texts,
            'found_ans_in_svg': found_in_svg
        })

print(f"Found {len(flagged_items)} SVG files containing the answer text/numbers!")

with open('scratch/flagged_t137_images.json', 'w', encoding='utf-8') as f:
    json.dump(flagged_items, f, indent=2, ensure_ascii=False)

with open('scratch/t137_flagged.txt', 'w', encoding='utf-8') as out:
    out.write(f"Found {len(flagged_items)} SVG files containing the answer text/numbers!\n\n")
    for item in flagged_items:
        out.write(f"File: {item['fname']} | QID: {item['qid']}\n")
        out.write(f"  Question: {item['qtext'][:120]}\n")
        out.write(f"  Answer: {item['ans']}\n")
        out.write(f"  Matches in SVG: {item['found_ans_in_svg']}\n")
        out.write(f"  All SVG Texts: {item['svg_texts']}\n")
        out.write("-" * 60 + "\n")

print("Wrote scratch/t137_flagged.txt")

