import glob
import os
import re

svg_files = sorted(glob.glob("public/images/*135*.svg"))
print(f"Auditing {len(svg_files)} SVG files for Topic 135...")

with open('scratch/t135_svg_texts.txt', 'w', encoding='utf-8') as out:
    for svg_path in svg_files:
        with open(svg_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            texts = re.findall(r'<text[^>]*>(.*?)</text>', content, re.DOTALL)
            clean_texts = [re.sub(r'<[^>]+>', '', t).strip() for t in texts]
            out.write(f"--- {os.path.basename(svg_path)} ---\n")
            for t in clean_texts:
                out.write(f"   {repr(t)}\n")

print("Saved scratch/t135_svg_texts.txt")

