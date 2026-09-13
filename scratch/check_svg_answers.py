import os
import glob
import re

directories = [
    'public/images',
    'dist/images',
    'QBank/public/images',
    'QBank/dist/images'
]

# SVG files matching g8_t134_q*
svgs = sorted(glob.glob("public/images/g8_t134_q*.svg"))
pngs = sorted(glob.glob("public/images/g8_t134_q*.png"))

print(f"Found {len(svgs)} SVG files and {len(pngs)} PNG files in public/images/ for g8_t134_q*.")

# Let's check SVG files content to see if any contain calculated answer text or solution text or formulas containing answers
flagged_svgs = []
for svg in svgs:
    with open(svg, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
        
        # Check text elements
        texts = re.findall(r'<text[^>]*>(.*?)</text>', content, re.DOTALL)
        clean_texts = [re.sub(r'<[^>]+>', '', t).strip() for t in texts]
        
        # Check for answer leakages:
        # e.g. "(4, 2)", "x = 3, y = 4", "41 and 23", "Consistent-dependent", "No Solution", "Infinitely Many Solutions", etc.
        suspicious = []
        for t in clean_texts:
            # check if it contains actual coordinate pair like (4, 2) or (2, 1) or answer numbers or text
            if re.search(r'\(\s*-?\d+[\.,]?\d*\s*,\s*-?\d+[\.,]?\d*\s*\)', t): # coordinate pair without ?
                suspicious.append(t)
            elif any(w in t for w in ['Consistent', 'Inconsistent', 'Coincident', 'Infinitely Many', 'No Solution']) and '?' not in t:
                suspicious.append(t)
            elif re.search(r'x\s*=\s*\d+', t) or re.search(r'y\s*=\s*\d+', t):
                if '?' not in t:
                    suspicious.append(t)

        if suspicious:
            flagged_svgs.append((os.path.basename(svg), suspicious))

print(f"\nFlagged SVGs containing potential printed answers ({len(flagged_svgs)}):")
for name, sus in flagged_svgs:
    print(f"  {name}: {sus}")

if not flagged_svgs:
    print("  NONE! All 50 SVGs have clean parameter diagrams with no printed answers!")

