import os
import json
import re
import matplotlib.pyplot as plt
import matplotlib.patches as patches

TARGET_DIRS = [
    'public/images',
    'QBank/public/images',
    'dist/images',
    'QBank/dist/images'
]

for d in TARGET_DIRS:
    os.makedirs(d, exist_ok=True)

with open('scratch/topic134_questions.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

print(f"Generating clean SVG & PNG diagrams for {len(questions)} Topic 134 questions...")

def generate_t134_single(idx, q):
    filename = f"g8_t134_q{idx}"
    qtext = q['text']
    type_idx = (idx - 1) % 10 + 1
    
    eq1, eq2 = "Line 1", "Line 2"
    m = re.search(r'\\\{\s*(.+?)\s*\\?;\\?\s*(.+?)\s*\\\}', qtext)
    if m:
        eq1 = m.group(1).replace('\\,', '').replace('\\', '').strip()
        eq2 = m.group(2).replace('\\,', '').replace('\\', '').lstrip(', ').strip()
    elif type_idx == 7:
        m_sum = re.search(r'sum.+?is\s*(\d+)', qtext)
        m_diff = re.search(r'difference.+?is\s*(\d+)', qtext)
        if m_sum and m_diff:
            eq1 = f"x + y = {m_sum.group(1)}"
            eq2 = f"x - y = {m_diff.group(1)}"
    elif type_idx == 8:
        m_b = re.findall(r'(\d+)\s*burgers?\s*and\s*(\d+)\s*juice drinks?\s*cost\s*\$?₱?(\d+)', qtext)
        if len(m_b) >= 2:
            eq1 = f"{m_b[0][0]}b + {m_b[0][1]}d = {m_b[0][2]}"
            eq2 = f"{m_b[1][0]}b + {m_b[1][1]}d = {m_b[1][2]}"
    elif type_idx == 9:
        m_d = re.findall(r'(\d+)\s*km', qtext)
        m_t = re.findall(r'(\d+)\s*hours?', qtext)
        if m_d and len(m_t) >= 2:
            d_val = int(m_d[0])
            t1, t2 = int(m_t[0]), int(m_t[1])
            eq1 = f"b + c = {d_val // t1}"
            eq2 = f"b - c = {d_val // t2}"
    elif type_idx == 10:
        m_p = re.findall(r'(\d+)%', qtext)
        m_tot = re.search(r'(\d+)\s*liters?', qtext)
        if len(m_p) >= 3 and m_tot:
            p1, p2, p3 = int(m_p[0]), int(m_p[1]), int(m_p[2])
            tot = int(m_tot.group(1))
            sol_tot = int((p3 / 100.0) * tot)
            eq1 = f"x + y = {tot}"
            eq2 = f"{p1/100:g}x + {p2/100:g}y = {sol_tot}"
            
    if type_idx == 1:
        title = "System of Linear Equations"
        svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 320" width="420" height="320">
  <rect width="100%" height="100%" fill="#0f172a" rx="12"/>
  <rect x="20" y="16" width="380" height="36" fill="#1e293b" rx="8"/>
  <text x="210" y="40" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">{title}</text>
  
  <line x1="60" y1="165" x2="360" y2="165" stroke="#475569" stroke-width="1.5"/>
  <line x1="210" y1="70" x2="210" y2="260" stroke="#475569" stroke-width="1.5"/>
  
  <line x1="90" y1="230" x2="330" y2="90" stroke="#38bdf8" stroke-width="3.5"/>
  <line x1="90" y1="230" x2="330" y2="90" stroke="#f43f5e" stroke-width="2" stroke-dasharray="8,6"/>
  
  <text x="335" y="85" font-family="Inter, sans-serif" font-size="12" font-weight="600" fill="#38bdf8">L1: {eq1}</text>
  <text x="335" y="105" font-family="Inter, sans-serif" font-size="12" font-weight="600" fill="#f43f5e">L2: {eq2}</text>
</svg>"""

    elif type_idx in (2, 3, 4, 5, 7, 8, 9, 10):
        if type_idx == 7:
            title = "System: Number Word Problem"
            target_label = "Solution (x, y) = ?"
        elif type_idx == 8:
            title = "Cafeteria Pricing System"
            target_label = "Price (b, d) = ?"
        elif type_idx == 9:
            title = "Boat &amp; Current Motion System"
            target_label = "Speed (b, c) = ?"
        elif type_idx == 10:
            title = "Acid Mixture System"
            target_label = "Volume (x, y) = ?"
        else:
            title = "System of Linear Equations"
            target_label = "Intersection = ?"

        svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 320" width="420" height="320">
  <rect width="100%" height="100%" fill="#0f172a" rx="12"/>
  <rect x="20" y="16" width="380" height="36" fill="#1e293b" rx="8"/>
  <text x="210" y="40" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">{title}</text>
  
  <line x1="60" y1="180" x2="360" y2="180" stroke="#475569" stroke-width="1.5"/>
  <line x1="210" y1="70" x2="210" y2="260" stroke="#475569" stroke-width="1.5"/>
  
  <line x1="90" y1="230" x2="330" y2="100" stroke="#38bdf8" stroke-width="2.5"/>
  <line x1="90" y1="90" x2="330" y2="240" stroke="#f43f5e" stroke-width="2.5"/>
  
  <circle cx="225" cy="157" r="6" fill="#0284c7" stroke="#ffffff" stroke-width="1.5"/>
  
  <text x="335" y="95" font-family="Inter, sans-serif" font-size="12" font-weight="600" fill="#38bdf8">L1: {eq1}</text>
  <text x="335" y="245" font-family="Inter, sans-serif" font-size="12" font-weight="600" fill="#f43f5e">L2: {eq2}</text>
  
  <rect x="140" y="180" width="170" height="28" fill="#1e293b" rx="4" stroke="#38bdf8" stroke-width="1"/>
  <text x="225" y="199" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="#38bdf8" text-anchor="middle">{target_label}</text>
</svg>"""

    elif type_idx == 6:
        title = "System of Linear Equations"
        svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 320" width="420" height="320">
  <rect width="100%" height="100%" fill="#0f172a" rx="12"/>
  <rect x="20" y="16" width="380" height="36" fill="#1e293b" rx="8"/>
  <text x="210" y="40" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">{title}</text>
  
  <line x1="60" y1="180" x2="360" y2="180" stroke="#475569" stroke-width="1.5"/>
  <line x1="210" y1="70" x2="210" y2="260" stroke="#475569" stroke-width="1.5"/>
  
  <line x1="90" y1="190" x2="330" y2="90" stroke="#38bdf8" stroke-width="2.5"/>
  <line x1="90" y1="230" x2="330" y2="130" stroke="#f43f5e" stroke-width="2.5"/>
  
  <text x="335" y="85" font-family="Inter, sans-serif" font-size="12" font-weight="600" fill="#38bdf8">L1: {eq1}</text>
  <text x="335" y="125" font-family="Inter, sans-serif" font-size="12" font-weight="600" fill="#f43f5e">L2: {eq2}</text>
</svg>"""

    # Write SVG files
    for target_dir in TARGET_DIRS:
        svg_path = os.path.join(target_dir, f"{filename}.svg")
        with open(svg_path, 'w', encoding='utf-8') as f:
            f.write(svg_content)

    # --- MATPLOTLIB PNG RENDERING ---
    plt.figure(figsize=(4.8, 3.6), dpi=100, facecolor='#0f172a')
    ax = plt.subplot(111)
    ax.set_facecolor('#0f172a')
    ax.axis('off')
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)

    title_clean = title.replace('&amp;', '&')

    if type_idx == 1:
        ax.plot([0.15, 0.85], [0.5, 0.5], color='#475569', lw=1.5)
        ax.plot([0.5, 0.5], [0.15, 0.85], color='#475569', lw=1.5)
        ax.plot([0.2, 0.75], [0.3, 0.7], color='#38bdf8', lw=4)
        ax.plot([0.2, 0.75], [0.3, 0.7], color='#f43f5e', lw=2, ls='--')
        ax.text(0.77, 0.72, f"L1: {eq1}\nL2: {eq2}", color='#38bdf8', weight='bold', fontsize=10, ha='left')

    elif type_idx in (2, 3, 4, 5, 7, 8, 9, 10):
        ax.plot([0.15, 0.85], [0.45, 0.45], color='#475569', lw=1.5)
        ax.plot([0.5, 0.5], [0.15, 0.85], color='#475569', lw=1.5)
        ax.plot([0.2, 0.75], [0.3, 0.7], color='#38bdf8', lw=2.5)
        ax.plot([0.2, 0.75], [0.7, 0.3], color='#f43f5e', lw=2.5)
        ax.plot(0.475, 0.5, 'o', color='#0284c7', ms=7, mec='#ffffff', mew=1.5)
        
        ax.text(0.77, 0.72, f"L1: {eq1}", color='#38bdf8', weight='bold', fontsize=10, ha='left')
        ax.text(0.77, 0.28, f"L2: {eq2}", color='#f43f5e', weight='bold', fontsize=10, ha='left')
        
        if type_idx == 7:
            t_lbl = "Solution (x, y) = ?"
        elif type_idx == 8:
            t_lbl = "Price (b, d) = ?"
        elif type_idx == 9:
            t_lbl = "Speed (b, c) = ?"
        elif type_idx == 10:
            t_lbl = "Volume (x, y) = ?"
        else:
            t_lbl = "Intersection = ?"
            
        ax.text(0.475, 0.35, t_lbl, color='#38bdf8', weight='bold', fontsize=11, ha='center', va='center',
                bbox=dict(boxstyle="round,pad=0.3", facecolor="#1e293b", edgecolor="#38bdf8", lw=1))

    elif type_idx == 6:
        ax.plot([0.15, 0.85], [0.45, 0.45], color='#475569', lw=1.5)
        ax.plot([0.5, 0.5], [0.15, 0.85], color='#475569', lw=1.5)
        ax.plot([0.2, 0.75], [0.4, 0.7], color='#38bdf8', lw=2.5)
        ax.plot([0.2, 0.75], [0.25, 0.55], color='#f43f5e', lw=2.5)
        ax.text(0.77, 0.72, f"L1: {eq1}", color='#38bdf8', weight='bold', fontsize=10, ha='left')
        ax.text(0.77, 0.57, f"L2: {eq2}", color='#f43f5e', weight='bold', fontsize=10, ha='left')

    ax.text(0.5, 0.93, title_clean, color='#38bdf8', weight='bold', fontsize=12, ha='center', va='center',
            bbox=dict(boxstyle="round,pad=0.4", facecolor="#1e293b", edgecolor="none"))

    plt.subplots_adjust(left=0.02, right=0.98, top=0.98, bottom=0.02)

    for target_dir in TARGET_DIRS:
        png_path = os.path.join(target_dir, f"{filename}.png")
        plt.savefig(png_path, facecolor='#0f172a', edgecolor='none')
        
    plt.close()

for idx, q in enumerate(questions, 1):
    generate_t134_single(idx, q)

print("Generated clean SVGs and PNGs for all 50 questions in Topic 134!")
