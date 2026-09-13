import os
import json
import matplotlib.pyplot as plt
import numpy as np

dirs = [
    'public/images',
    'dist/images',
    'QBank/public/images',
    'QBank/dist/images'
]

for d in dirs:
    os.makedirs(d, exist_ok=True)

plt.style.use('dark_background')

with open('scratch/t147_50_built_questions.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

print(f"Loaded {len(questions)} built questions for Topic 147.")

def create_diagram(q):
    num = q['num']
    title = q['title']
    itype = q['img_type']
    
    fig, ax = plt.subplots(figsize=(6, 4.5), dpi=100)
    fig.patch.set_facecolor('#0f172a')
    ax.set_facecolor('#0f172a')
    
    ax.grid(True, color='#334155', linestyle='--', linewidth=0.7, alpha=0.7)
    for spine in ax.spines.values():
        spine.set_color('#475569')
        spine.set_linewidth(1.2)
    ax.tick_params(colors='#94a3b8', labelsize=9)
    
    # 1. Parallelogram Diagrams (Q4-Q8, Q33, Q34, Q40)
    if 'parallelogram' in itype or num in [4, 5, 6, 7, 8]:
        px = [0, 5, 7, 2, 0]
        py = [0, 0, 4, 4, 0]
        ax.plot(px, py, 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24', label='Parallelogram')
        lbls = ['P', 'Q', 'R', 'S'] if num in [5, 6] else ['A', 'B', 'C', 'D']
        for idx in range(4):
            ax.annotate(lbls[idx], (px[idx], py[idx]), textcoords="offset points", xytext=(-5, -12 if py[idx]==0 else 8),
                        color='#f8fafc', fontsize=11, fontweight='bold')
            
        if num == 5: # Q5: PQRS PQ = 3x - 4, QR = 2x + 1, P = 44
            ax.annotate('PQ = 3x - 4', (2.5, -0.6), color='#f43f5e', fontsize=10, fontweight='bold')
            ax.annotate('QR = 2x + 1', (6.2, 2.0), color='#f43f5e', fontsize=10, fontweight='bold')
            target_label = "Perimeter = 44 cm | Four Side Lengths = ?"
        elif num == 6: # Q6: PQRS PQ = 3x - 5, QR = 2x + 3, P = 56
            ax.annotate('PQ = 3x - 5', (2.5, -0.6), color='#f43f5e', fontsize=10, fontweight='bold')
            ax.annotate('QR = 2x + 3', (6.2, 2.0), color='#f43f5e', fontsize=10, fontweight='bold')
            target_label = "Perimeter = 56 cm | Four Side Lengths = ?"
        elif num == 7: # Q7: Diagonals
            ax.plot([0, 7], [0, 4], '--', color='#fbbf24', linewidth=1.5)
            ax.plot([5, 2], [0, 4], '--', color='#fbbf24', linewidth=1.5)
            ax.plot(3.5, 2, 'o', color='#f43f5e', markersize=6)
            ax.annotate('E', (3.5, 2), textcoords="offset points", xytext=(5, 5), color='#f8fafc', fontweight='bold')
            target_label = "x, y, AC, BD = ?"
        elif num == 8: # Q8: Heights
            ax.plot([2, 2], [4, 0], ':', color='#f43f5e', linewidth=2, label='h1 = 8 cm')
            ax.annotate('h1 = 8 cm', (2.1, 2.0), color='#f43f5e', fontsize=9, fontweight='bold')
            target_label = "Base AB = 15, AD = 10 | Area & h2 = ?"
        else:
            target_label = "Parallelogram Properties = ?"

        ax.set_xlim(-1, 8)
        ax.set_ylim(-1, 5)

    # 2. Rectangle Diagrams (Q9-Q12)
    elif 'rectangle' in itype or num in [9, 10, 11, 12]:
        px = [0, 6, 6, 0, 0]
        py = [0, 0, 4, 4, 0]
        ax.plot(px, py, 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24', label='Rectangle ABCD')
        lbls = ['P', 'Q', 'R', 'S'] if num in [11] else ['A', 'B', 'C', 'D']
        for idx in range(4):
            ax.annotate(lbls[idx], (px[idx], py[idx]), textcoords="offset points", xytext=(-5, -12 if py[idx]==0 else 8),
                        color='#f8fafc', fontsize=11, fontweight='bold')
            
        if num == 10:
            ax.plot([0, 6], [0, 4], '--', color='#fbbf24', linewidth=1.5, label='AC = 5x - 8')
            ax.plot([6, 0], [0, 4], '--', color='#f43f5e', linewidth=1.5, label='BD = 2x + 13')
            target_label = "x & Diagonal Length BD = ?"
        elif num == 11:
            ax.plot([0, 6], [0, 4], '--', color='#fbbf24', linewidth=2)
            ax.annotate('28°', (1.2, 0.3), color='#f43f5e', fontsize=10, fontweight='bold')
            target_label = "∠RPS & Diagonal Angle = ?"
        elif num == 12:
            target_label = "Field 105m x 68m | Diagonal Distance = ?"
        else:
            ax.plot([0, 6], [0, 4], '--', color='#fbbf24', linewidth=1.5)
            ax.plot([6, 0], [0, 4], '--', color='#fbbf24', linewidth=1.5)
            target_label = "Diagonals AC = BD = ?"

        ax.set_xlim(-1, 7)
        ax.set_ylim(-1, 5)

    # 3. Rhombus Diagrams (Q13-Q16, Q50)
    elif 'rhombus' in itype or num in [13, 14, 15, 16, 50]:
        px = [0, 4, 0, -4, 0]
        py = [-3, 0, 3, 0, -3]
        ax.plot(px, py, 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24', label='Rhombus ABCD')
        ax.plot([-4, 4], [0, 0], '--', color='#fbbf24', linewidth=1.5)
        ax.plot([0, 0], [-3, 3], '--', color='#fbbf24', linewidth=1.5)
        lbls = ['D', 'C', 'B', 'A']
        for idx in range(4):
            ax.annotate(lbls[idx], (px[idx], py[idx]), textcoords="offset points", xytext=(8, 5),
                        color='#f8fafc', fontsize=11, fontweight='bold')
            
        if num == 14:
            ax.annotate('d1 = 16 cm', (1.0, 1.8), color='#f43f5e', fontsize=9, fontweight='bold')
            ax.annotate('d2 = 12 cm', (-2.5, -1.8), color='#f43f5e', fontsize=9, fontweight='bold')
            target_label = "Side s, Perimeter, Area = ?"
        elif num == 15:
            ax.annotate('124°', (2.5, 0), color='#f43f5e', fontsize=10, fontweight='bold')
            target_label = "∠JKM, ∠MLK, ∠JML = ?"
        elif num == 16:
            ax.annotate('s = 60 cm', (2.2, 1.8), color='#f43f5e', fontsize=10, fontweight='bold')
            target_label = "Diagonals d1 and d2 = ?"
        elif num == 50:
            target_label = "Perimeter = 40 cm, d1:d2 = 3:4 | Area = ?"
        else:
            target_label = "Diagonals d1 ⊥ d2 = ?"

        ax.set_xlim(-5, 5)
        ax.set_ylim(-4, 4)

    # 4. Square Diagrams (Q17-Q19)
    elif 'square' in itype or num in [17, 18, 19]:
        px = [0, 4, 4, 0, 0]
        py = [0, 0, 4, 4, 0]
        ax.plot(px, py, 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24', label='Square ABCD')
        ax.plot([0, 4], [0, 4], '--', color='#fbbf24', linewidth=2)
        lbls = ['A', 'B', 'C', 'D']
        for idx in range(4):
            ax.annotate(lbls[idx], (px[idx], py[idx]), textcoords="offset points", xytext=(-5, -12 if py[idx]==0 else 8),
                        color='#f8fafc', fontsize=11, fontweight='bold')
            
        if num == 18:
            ax.annotate('d = 28 m', (1.5, 2.2), color='#f43f5e', fontsize=10, fontweight='bold')
            target_label = "Side s, Perimeter, Area = ?"
        elif num == 19:
            ax.plot(2.82, 2.82, 'o', color='#f43f5e', markersize=7)
            ax.annotate('P (AP = AB)', (2.82, 2.82), textcoords="offset points", xytext=(8, -5), color='#f8fafc', fontweight='bold')
            target_label = "Side AB = 10 cm | Segment PC = ?"
        else:
            ax.annotate('s', (2.0, -0.6), color='#f43f5e', fontsize=10, fontweight='bold')
            ax.annotate('d = s√2', (1.5, 2.2), color='#f43f5e', fontsize=10, fontweight='bold')
            target_label = "Ratio s : d = ?"

        ax.set_xlim(-1, 5)
        ax.set_ylim(-1, 5)

    # 5. Trapezoid Diagrams (Q20-Q26, Q49)
    elif 'trapezoid' in itype or num in [20, 21, 22, 23, 24, 25, 26, 49]:
        if num == 49: # Right trapezoid
            px = [0, 6, 14, 0, 0]
            py = [0, 0, 6, 6, 0]
            ax.plot(px, py, 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24', label='Right Trapezoid ABCD')
            ax.annotate('AB = 6', (3, 6.3), color='#f43f5e', fontsize=10, fontweight='bold')
            ax.annotate('CD = 14', (7, -0.6), color='#f43f5e', fontsize=10, fontweight='bold')
            ax.annotate('AD = 6', (-0.8, 3), color='#f43f5e', fontsize=10, fontweight='bold')
            target_label = "Slant Leg BC = ?"
        else: # Isosceles trapezoid
            px = [0, 8, 6, 2, 0]
            py = [0, 0, 4, 4, 0]
            ax.plot(px, py, 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24', label='Trapezoid ABCD')
            lbls = ['P', 'Q', 'R', 'S'] if num in [23] else ['A', 'B', 'C', 'D']
            for idx in range(4):
                ax.annotate(lbls[idx], (px[idx], py[idx]), textcoords="offset points", xytext=(-5, -12 if py[idx]==0 else 8),
                            color='#f8fafc', fontsize=11, fontweight='bold')
                
            if num == 22:
                ax.annotate('Base AB = 12 cm', (3, 4.3), color='#f43f5e', fontsize=9, fontweight='bold')
                ax.annotate('Base CD = 24 cm', (3, -0.6), color='#f43f5e', fontsize=9, fontweight='bold')
                ax.annotate('Leg AD = 10 cm', (0.2, 2.0), color='#f43f5e', fontsize=9, fontweight='bold')
                target_label = "Height h & Area = ?"
            elif num == 23:
                ax.annotate('(3x + 20)°', (0.5, 0.4), color='#f43f5e', fontsize=10, fontweight='bold')
                ax.annotate('(2x + 10)°', (1.8, 3.4), color='#f43f5e', fontsize=10, fontweight='bold')
                target_label = "Four Interior Angles = ?"
            elif num in [24, 25, 26]:
                # Midsegment line
                ax.plot([1, 7], [2, 2], '--', color='#fbbf24', linewidth=2, label='Midsegment MN')
                ax.plot(1, 2, 'o', color='#fbbf24', markersize=6)
                ax.plot(7, 2, 'o', color='#fbbf24', markersize=6)
                ax.annotate('M', (1, 2), textcoords="offset points", xytext=(-12, -3), color='#f8fafc', fontweight='bold')
                ax.annotate('N', (7, 2), textcoords="offset points", xytext=(8, -3), color='#f8fafc', fontweight='bold')
                if num == 25:
                    target_label = "MN = 22 cm | Base Lengths AB & CD = ?"
                elif num == 26:
                    target_label = "EF = 21, WX = 3x+1, YZ = 5x-7 | Base Lengths = ?"
                else:
                    target_label = "Midsegment m = (a + b) / 2 = ?"
            else:
                target_label = "Isosceles Trapezoid Properties = ?"

        ax.set_xlim(-1, 9)
        ax.set_ylim(-1, 5)

    # 6. Kite Diagrams (Q27-Q31)
    elif 'kite' in itype or num in [27, 28, 29, 30, 31]:
        px = [0, 3, 0, -3, 0]
        py = [-5, 0, 2, 0, -5]
        ax.plot(px, py, 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24', label='Kite ABCD')
        ax.plot([-3, 3], [0, 0], '--', color='#fbbf24', linewidth=1.5)
        ax.plot([0, 0], [-5, 2], '--', color='#fbbf24', linewidth=1.5)
        lbls = ['D', 'C', 'B', 'A']
        for idx in range(4):
            ax.annotate(lbls[idx], (px[idx], py[idx]), textcoords="offset points", xytext=(8, 5),
                        color='#f8fafc', fontsize=11, fontweight='bold')
            
        if num == 29:
            ax.annotate('d1 = 35 cm', (0.5, 0.5), color='#f43f5e', fontsize=10, fontweight='bold')
            ax.annotate('d2 = 48 cm', (-2.5, -2.5), color='#f43f5e', fontsize=10, fontweight='bold')
            target_label = "Fabric Area = ?"
        elif num == 30:
            target_label = "AE = 6, EC = 15, BE = 8 | Side Lengths & P = ?"
        elif num == 31:
            ax.annotate('112°', (1.5, 0), color='#f43f5e', fontsize=10, fontweight='bold')
            ax.annotate('64°', (0, 1.2), color='#f43f5e', fontsize=10, fontweight='bold')
            target_label = "∠PSR & ∠QRS = ?"
        else:
            target_label = "Kite Area = 1/2 d1 d2 = ?"

        ax.set_xlim(-4, 4)
        ax.set_ylim(-6, 3)

    # 7. Default / Proof / Application Diagrams (Q1-Q3, Q32, Q35-Q39, Q41-Q48)
    else:
        px = [0, 5, 4, 1, 0]
        py = [0, 0, 3, 3, 0]
        ax.plot(px, py, 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24', label='Quadrilateral')
        ax.set_title(f"Q{num}: {title}", color='#38bdf8', fontsize=11, fontweight='bold', pad=12)
        target_label = f"{title} = ?"
        ax.set_xlim(-1, 6)
        ax.set_ylim(-1, 4)

    ax.set_title(f"Q{num}: {title}", color='#38bdf8', fontsize=11, fontweight='bold', pad=12)
    ax.legend(loc='upper left', facecolor='#1e293b', edgecolor='#38bdf8', labelcolor='#38bdf8', fontsize=8)
    
    fig.text(0.5, 0.03, target_label, ha='center', va='center',
             color='#38bdf8', fontsize=11, fontweight='bold',
             bbox=dict(boxstyle='round,pad=0.5', facecolor='#1e293b', edgecolor='#38bdf8', linewidth=1.5))

    plt.subplots_adjust(left=0.12, right=0.92, top=0.88, bottom=0.18)
    
    svg_filename = f"g9_t147_q{num}.svg"
    png_filename = f"g9_t147_q{num}.png"
    
    primary_svg = os.path.join('public/images', svg_filename)
    primary_png = os.path.join('public/images', png_filename)
    
    fig.savefig(primary_svg, format='svg', facecolor=fig.get_facecolor(), edgecolor='none')
    fig.savefig(primary_png, format='png', facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close(fig)
    
    with open(primary_svg, 'rb') as sf:
        svg_data = sf.read()
    with open(primary_png, 'rb') as pf:
        png_data = pf.read()
        
    for d in dirs:
        target_svg = os.path.join(d, svg_filename)
        target_png = os.path.join(d, png_filename)
        with open(target_svg, 'wb') as sf_out:
            sf_out.write(svg_data)
        with open(target_png, 'wb') as pf_out:
            pf_out.write(png_data)

print("Starting generation of 50 clean custom plots for Topic 147...")
for q in questions:
    create_diagram(q)
    if q['num'] % 10 == 0:
        print(f"Generated Q1 to Q{q['num']} clean plots for Topic 147.")

print("All 50 custom clean plots generated successfully for Topic 147!")
