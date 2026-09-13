import os
import glob
import re

svg_files = glob.glob('public/images/dp_t122_q*.svg')
print(f"Found {len(svg_files)} SVG files in public/images")

for fpath in sorted(svg_files):
    fname = os.path.basename(fpath)
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    # Extract text contents inside SVG
    texts = re.findall(r'<text[^>]*>(.*?)</text>', content, re.DOTALL)
    # clean tags if any
    clean_texts = [re.sub(r'<[^>]+>', '', t).strip() for t in texts if t.strip()]
    print(f"{fname}: {clean_texts[:10]}")
