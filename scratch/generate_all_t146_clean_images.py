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

with open('scratch/t146_50_built_questions.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

print(f"Loaded {len(questions)} built questions for Topic 146.")

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
    
    # 1. Transversal diagrams (Q1 to Q8, Q37 to Q40)
    if itype.startswith('transversal'):
        # Draw two horizontal-ish lines L1 and L2
        x = np.linspace(-5, 5, 100)
        ax.plot(x, np.zeros_like(x) + 2, color='#38bdf8', linewidth=2.5, label='Line L1')
        ax.plot(x, np.zeros_like(x) - 2, color='#38bdf8', linewidth=2.5, label='Line L2')
        # Transversal T
        tx = np.linspace(-3, 3, 100)
        ty = 1.5 * tx
        ax.plot(tx, ty, color='#fbbf24', linewidth=2.5, label='Transversal T')
        
        # Labels depending on question
        if 'algebra' in itype or num in [5, 6, 7, 8]:
            if num == 5:
                ax.annotate('(5x - 14)°', (0.5, 1.5), color='#f43f5e', fontsize=11, fontweight='bold')
                ax.annotate('(3x + 22)°', (-0.8, -1.5), color='#f43f5e', fontsize=11, fontweight='bold')
                target_label = "x = ?"
            elif num == 6:
                ax.annotate('(7x + 16)°', (0.5, 1.5), color='#f43f5e', fontsize=11, fontweight='bold')
                ax.annotate('(4x + 32)°', (0.5, -1.5), color='#f43f5e', fontsize=11, fontweight='bold')
                target_label = "x = ?"
            elif num == 7:
                ax.annotate('(2x² - 15)°', (1.2, 2.3), color='#f43f5e', fontsize=11, fontweight='bold')
                ax.annotate('(x² + 10)°', (1.2, -1.7), color='#f43f5e', fontsize=11, fontweight='bold')
                target_label = "x = ?"
            else:
                ax.annotate('(6x + 20)°', (1.5, 2.3), color='#f43f5e', fontsize=11, fontweight='bold')
                ax.annotate('(4x - 10)°', (1.5, -2.3), color='#f43f5e', fontsize=11, fontweight='bold')
                target_label = "x = ?"
        else:
            # Concept questions (Q1 to Q4)
            ax.annotate('∠1', (1.2, 2.3), color='#f43f5e', fontsize=11, fontweight='bold')
            ax.annotate('∠5', (1.2, -1.7), color='#f43f5e', fontsize=11, fontweight='bold')
            target_label = "Parallel Condition = ?"
            
        ax.set_xlim(-4, 4)
        ax.set_ylim(-3.5, 3.5)
        ax.set_title(f"Q{num}: {title}", color='#38bdf8', fontsize=11, fontweight='bold', pad=12)
        ax.legend(loc='upper left', facecolor='#1e293b', edgecolor='#38bdf8', labelcolor='#38bdf8', fontsize=8)
        
        fig.text(0.5, 0.03, target_label, ha='center', va='center',
                 color='#38bdf8', fontsize=11, fontweight='bold',
                 bbox=dict(boxstyle='round,pad=0.5', facecolor='#1e293b', edgecolor='#38bdf8', linewidth=1.5))

    # 2. Quadrilateral coordinate diagrams (Q21, Q22)
    elif 'quadrilateral' in itype:
        if num == 21:
            pts = [(1, 2), (5, 4), (4, 7), (0, 5), (1, 2)]
            lbls = ['A(1, 2)', 'B(5, 4)', 'C(4, 7)', 'D(0, 5)']
            ax.set_title("Q21: Quadrilateral ABCD in Coordinate Plane", color='#38bdf8', fontsize=11, fontweight='bold', pad=12)
            target_label = "Opposite Sides Parallel & Perp? = ?"
        else:
            pts = [(0, 0), (4, 2), (3, 5), (-1, 3), (0, 0)]
            lbls = ['A(0, 0)', 'B(4, 2)', 'C(3, 5)', 'D(-1, 3)']
            ax.set_title("Q22: Quadrilateral ABCD Classification", color='#38bdf8', fontsize=11, fontweight='bold', pad=12)
            target_label = "Quadrilateral Type = ?"
            
        px, py = zip(*pts)
        ax.plot(px, py, 'o-', color='#38bdf8', linewidth=2.5, markersize=8, markerfacecolor='#fbbf24', label='Quadrilateral ABCD')
        for idx in range(4):
            ax.annotate(lbls[idx], (px[idx], py[idx]), textcoords="offset points", xytext=(8, 5),
                        color='#f8fafc', fontsize=10, fontweight='bold')
            
        ax.set_xlim(-2, 6)
        ax.set_ylim(-1, 8)
        ax.legend(loc='upper left', facecolor='#1e293b', edgecolor='#38bdf8', labelcolor='#38bdf8', fontsize=8)
        
        fig.text(0.5, 0.03, target_label, ha='center', va='center',
                 color='#38bdf8', fontsize=11, fontweight='bold',
                 bbox=dict(boxstyle='round,pad=0.5', facecolor='#1e293b', edgecolor='#38bdf8', linewidth=1.5))

    # 3. Two lines through points (Q11, Q12, Q23, Q24)
    elif 'two_lines' in itype or 'unknown_k' in itype:
        if num == 11:
            # L1: (-3, 5) to (1, -3); L2: (2, 7) to (6, -1)
            ax.plot([-3, 1], [5, -3], 'o-', color='#38bdf8', linewidth=2.5, label='L1: (-3,5) to (1,-3)')
            ax.plot([2, 6], [7, -1], 'o-', color='#f43f5e', linewidth=2.5, label='L2: (2,7) to (6,-1)')
            target_label = "Relationship (Parallel / Perp / Neither) = ?"
        elif num == 12:
            # L1: (-2, -1) to (4, 3); L2: (1, 6) to (5, 0)
            ax.plot([-2, 4], [-1, 3], 'o-', color='#38bdf8', linewidth=2.5, label='L1: (-2,-1) to (4,3)')
            ax.plot([1, 5], [6, 0], 'o-', color='#f43f5e', linewidth=2.5, label='L2: (1,6) to (5,0)')
            target_label = "Relationship = ?"
        elif num == 23:
            ax.plot([2, 5], [-2, 4], 'o-', color='#38bdf8', linewidth=2.5, label='L1: (k,4) to (2,-2)')
            ax.plot([-2, 1], [-1, 5], 'o-', color='#f43f5e', linewidth=2.5, label='L2: (1,5) to (-2,-1)')
            target_label = "Value of k (L1 || L2) = ?"
        else:
            x = np.linspace(-3, 4, 100)
            ax.plot(x, (4*x - 8)/5.33, color='#38bdf8', linewidth=2.5, label='L1: 4x - ky = 8')
            ax.plot([-1, 2], [3, -1], 'o-', color='#f43f5e', linewidth=2.5, label='L2: (-1,3) to (2,-1)')
            target_label = "Value of k (L1 ⊥ L2) = ?"
            
        ax.set_title(f"Q{num}: {title}", color='#38bdf8', fontsize=11, fontweight='bold', pad=12)
        ax.legend(loc='upper left', facecolor='#1e293b', edgecolor='#38bdf8', labelcolor='#38bdf8', fontsize=8)
        
        fig.text(0.5, 0.03, target_label, ha='center', va='center',
                 color='#38bdf8', fontsize=11, fontweight='bold',
                 bbox=dict(boxstyle='round,pad=0.5', facecolor='#1e293b', edgecolor='#38bdf8', linewidth=1.5))

    # 4. Triangle / Special Coordinate Diagrams (Q19, Q20, Q46, Q47, Q49, Q50)
    elif any(k in itype for k in ['triangle', 'orthocenter', 'circumcenter', 'laser', 'perp_bisector', 'intersection']):
        if num == 19: # Perp bisector AB
            ax.plot([-4, 6], [2, 10], 'o-', color='#38bdf8', linewidth=2.5, label='Segment AB')
            ax.plot(1, 6, 'o', color='#fbbf24', markersize=8)
            ax.annotate('Midpoint M(1, 6)', (1, 6), textcoords="offset points", xytext=(8, 5), color='#f8fafc', fontweight='bold')
            target_label = "Perpendicular Bisector Equation = ?"
        elif num == 20: # Triangle altitude from C
            tx = [1, 7, 3, 1]
            ty = [1, 3, 7, 1]
            ax.plot(tx, ty, 'o-', color='#38bdf8', linewidth=2.5, label='Triangle ABC')
            ax.plot([3, 4], [7, 2], '--', color='#f43f5e', linewidth=2, label='Altitude from C')
            target_label = "Altitude Line Equation = ?"
        elif num == 46: # Orthocenter
            tx = [0, 6, 2, 0]
            ty = [0, 0, 4, 0]
            ax.plot(tx, ty, 'o-', color='#38bdf8', linewidth=2.5, label='Triangle ABC')
            ax.plot(2, 2, 'o', color='#fbbf24', markersize=8, label='Orthocenter H')
            target_label = "Orthocenter H Coordinates = ?"
        elif num == 47: # Circumcenter
            tx = [0, 8, 0, 0]
            ty = [0, 0, 6, 0]
            ax.plot(tx, ty, 'o-', color='#38bdf8', linewidth=2.5, label='Right Triangle ABC')
            ax.plot(4, 3, 'o', color='#fbbf24', markersize=8, label='Circumcenter O')
            target_label = "Circumcenter O Coordinates = ?"
        elif num == 50: # Laser reflection
            x = np.linspace(0, 6, 100)
            ax.plot(x, 2*x - 1, color='#38bdf8', linewidth=2.5, label='Mirror Line: y = 2x - 1')
            ax.plot(2, 8, 'o', color='#fbbf24', markersize=8, label='Laser P(2, 8)')
            ax.plot([2, 4], [8, 7], '--', color='#f43f5e', linewidth=2, label='Perpendicular Ray')
            target_label = "Reflection Point = ?"
        else: # Q49
            x = np.linspace(-1, 3, 100)
            ax.plot(x, (5 - 2*x)/3, color='#38bdf8', linewidth=2.5, label='2x + 3y = 5')
            ax.plot(x, x, color='#f43f5e', linewidth=2.5, label='x - y = 0')
            ax.plot(1, 1, 'o', color='#fbbf24', markersize=8, label='Intersection P(1, 1)')
            target_label = "Perpendicular Line Equation = ?"

        ax.set_title(f"Q{num}: {title}", color='#38bdf8', fontsize=11, fontweight='bold', pad=12)
        ax.legend(loc='upper left', facecolor='#1e293b', edgecolor='#38bdf8', labelcolor='#38bdf8', fontsize=8)
        
        fig.text(0.5, 0.03, target_label, ha='center', va='center',
                 color='#38bdf8', fontsize=11, fontweight='bold',
                 bbox=dict(boxstyle='round,pad=0.5', facecolor='#1e293b', edgecolor='#38bdf8', linewidth=1.5))

    # 5. Default / Linear Equation Diagrams (Q9, Q10, Q13-Q18, Q25-Q29, Q33-Q36, Q41-Q45, Q48)
    else:
        x = np.linspace(-5, 5, 100)
        ax.plot(x, 0.8*x + 1, color='#38bdf8', linewidth=2.5, label='Line 1')
        if 'perpendicular' in title.lower() or 'perp' in itype or num in [10, 14, 16, 18, 25, 34, 35, 42, 44]:
            ax.plot(x, -1.25*x + 1, color='#f43f5e', linewidth=2.5, linestyle='--', label='Line 2 (Perpendicular)')
            target_label = "Perpendicular Relationship / Slope = ?"
        else:
            ax.plot(x, 0.8*x - 2, color='#38bdf8', linewidth=2.5, linestyle='--', label='Line 2 (Parallel)')
            target_label = "Parallel Relationship / Slope = ?"

        ax.set_title(f"Q{num}: {title}", color='#38bdf8', fontsize=11, fontweight='bold', pad=12)
        ax.legend(loc='upper left', facecolor='#1e293b', edgecolor='#38bdf8', labelcolor='#38bdf8', fontsize=8)
        
        fig.text(0.5, 0.03, target_label, ha='center', va='center',
                 color='#38bdf8', fontsize=11, fontweight='bold',
                 bbox=dict(boxstyle='round,pad=0.5', facecolor='#1e293b', edgecolor='#38bdf8', linewidth=1.5))

    plt.subplots_adjust(left=0.12, right=0.92, top=0.88, bottom=0.18)
    
    svg_filename = f"g9_t146_q{num}.svg"
    png_filename = f"g9_t146_q{num}.png"
    
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

print("Starting generation of 50 clean custom plots for Topic 146...")
for q in questions:
    create_diagram(q)
    if q['num'] % 10 == 0:
        print(f"Generated Q1 to Q{q['num']} clean plots for Topic 146.")

print("All 50 custom clean plots generated successfully for Topic 146!")
