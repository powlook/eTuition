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

with open('scratch/t152_50_built_questions.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

# List of question numbers that DO NOT NEED an image
no_image_nums = {1, 5, 7, 9, 11, 12, 15, 16, 18, 19, 26, 35, 40, 44, 47, 50}

# Remove existing SVG/PNG for no_image_nums across all dirs
for num in no_image_nums:
    for d in dirs:
        svg_f = os.path.join(d, f"g9_t152_q{num}.svg")
        png_f = os.path.join(d, f"g9_t152_q{num}.png")
        if os.path.exists(svg_f): os.remove(svg_f)
        if os.path.exists(png_f): os.remove(png_f)

print(f"Removed old image files for {len(no_image_nums)} non-image questions.")

def create_diagram(q):
    num = q['num']
    title = q['title']
    
    if num in no_image_nums:
        return # Skip generating images for pure text/statement questions

    fig, ax = plt.subplots(figsize=(6.5, 4.8), dpi=100)
    fig.patch.set_facecolor('#0f172a')
    ax.set_facecolor('#0f172a')
    
    ax.grid(True, color='#334155', linestyle='--', linewidth=0.7, alpha=0.6)
    for spine in ax.spines.values():
        spine.set_color('#475569')
        spine.set_linewidth(1.2)
    ax.tick_params(colors='#94a3b8', labelsize=9)
    
    # 1. Q2: Triangle construction test
    if num == 2:
        # Left valid (4,7,10), Right invalid (3,5,9)
        # Valid △ (0,0), (10,0), (2.5, 3.2)
        ax.plot([0, 10, 2.5, 0], [0, 0, 3.2, 0], 'o-', color='#38bdf8', linewidth=2.0, markerfacecolor='#fbbf24')
        ax.annotate('a) Sides: 4, 7, 10 (Valid: 4+7 > 10)', (5, -0.6), color='#38bdf8', fontsize=9, fontweight='bold', ha='center')
        
        # Invalid open sides (0, -4), (9, -4) with broken gap
        ax.plot([0, 9], [-4, -4], 'o-', color='#94a3b8', linewidth=2.0)
        ax.plot([0, 2.5], [-4, -2.5], 'o--', color='#f43f5e', linewidth=2.0, label='Side 3')
        ax.plot([9, 5.0], [-4, -2.5], 'o--', color='#f43f5e', linewidth=2.0, label='Side 5')
        ax.annotate('b) Sides: 3, 5, 9 (Invalid: 3+5 < 9)', (4.5, -4.6), color='#f43f5e', fontsize=9, fontweight='bold', ha='center')
        
        target_label = "Triangle Inequality Construction Test = ?"
        ax.set_xlim(-1, 11)
        ax.set_ylim(-5.5, 4.5)

    # 2. Q3: Triangle sides 9 cm and 15 cm
    elif num == 3:
        ax.plot([0, 6, 2, 0], [0, 0, 3.5, 0], 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
        ax.annotate('Side = 9 cm', (0.8, 1.9), color='#38bdf8', fontsize=10, fontweight='bold', rotation=60)
        ax.annotate('Side = 15 cm', (4.2, 1.9), color='#38bdf8', fontsize=10, fontweight='bold', rotation=-40)
        ax.annotate('Third Side x = ?', (3, -0.5), color='#f43f5e', fontsize=10, fontweight='bold', ha='center')
        target_label = "Range of Third Side x = ?"
        ax.set_xlim(-1, 7)
        ax.set_ylim(-1, 4.5)

    # 3. Q4: Triangle sides 3x, 4x, and 28
    elif num == 4:
        ax.plot([0, 6, 2, 0], [0, 0, 3.5, 0], 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
        ax.annotate('Side 3x', (0.8, 1.9), color='#38bdf8', fontsize=10, fontweight='bold', rotation=60)
        ax.annotate('Side 4x', (4.2, 1.9), color='#38bdf8', fontsize=10, fontweight='bold', rotation=-40)
        ax.annotate('Base = 28', (3, -0.5), color='#fbbf24', fontsize=10, fontweight='bold', ha='center')
        target_label = "Range of Variable x = ?"
        ax.set_xlim(-1, 7)
        ax.set_ylim(-1, 4.5)

    # 4. Q6: Triangle ABC with AB = 11 cm, BC = 8 cm, AC = 14 cm
    elif num == 6:
        # A(0,0), B(11,0), C(3.5, 6)
        ax.plot([0, 11, 3.5, 0], [0, 0, 6, 0], 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
        ax.annotate('A', (0, 0), textcoords="offset points", xytext=(-12, -12), color='#f8fafc', fontweight='bold')
        ax.annotate('B', (11, 0), textcoords="offset points", xytext=(8, -12), color='#f8fafc', fontweight='bold')
        ax.annotate('C', (3.5, 6), textcoords="offset points", xytext=(0, 8), color='#f8fafc', fontweight='bold', ha='center')
        ax.annotate('AB = 11 cm', (5.5, -0.6), color='#38bdf8', fontsize=10, fontweight='bold', ha='center')
        ax.annotate('BC = 8 cm', (7.5, 3.2), color='#38bdf8', fontsize=10, fontweight='bold')
        ax.annotate('AC = 14 cm', (1.5, 3.2), color='#38bdf8', fontsize=10, fontweight='bold')
        target_label = "Order of Interior Angles (A, B, C) = ?"
        ax.set_xlim(-1.5, 12.5)
        ax.set_ylim(-1.2, 7.5)

    # 5. Q8: Triangle PQR with P = 52°, Q = 68°, R = 60°
    elif num == 8:
        ax.plot([0, 7, 3, 0], [0, 0, 5, 0], 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
        ax.annotate('P (52°)', (0, 0), textcoords="offset points", xytext=(-12, -12), color='#f8fafc', fontweight='bold')
        ax.annotate('Q (68°)', (7, 0), textcoords="offset points", xytext=(8, -12), color='#f8fafc', fontweight='bold')
        ax.annotate('R (60°)', (3, 5), textcoords="offset points", xytext=(0, 8), color='#f8fafc', fontweight='bold', ha='center')
        target_label = "Order of Side Lengths (PQ, QR, PR) = ?"
        ax.set_xlim(-1.5, 8.5)
        ax.set_ylim(-1.2, 6.5)

    # 6. Q10: Triangle XYZ with exterior angle 110° at vertex Y, X = 45°
    elif num == 10:
        # X(0,0), Y(6,0), Z(2.5, 4), extension to (9,0)
        ax.plot([0, 6, 2.5, 0], [0, 0, 4, 0], 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
        ax.plot([6, 9], [0, 0], '--', color='#f43f5e', linewidth=2.0)
        ax.annotate('X (45°)', (0, 0), textcoords="offset points", xytext=(-12, -12), color='#f8fafc', fontweight='bold')
        ax.annotate('Y', (6, 0), textcoords="offset points", xytext=(0, -15), color='#f8fafc', fontweight='bold', ha='center')
        ax.annotate('Z', (2.5, 4), textcoords="offset points", xytext=(0, 8), color='#f8fafc', fontweight='bold', ha='center')
        ax.annotate('Ext Angle = 110°', (6.5, 0.4), color='#f43f5e', fontsize=10, fontweight='bold')
        target_label = "Compare Exterior Angle vs Remote Interior Angle"
        ax.set_xlim(-1.5, 10)
        ax.set_ylim(-1.2, 5.2)

    # 7. Q13: Hinge Theorem comparison of △ABC and △DEF
    elif num == 13:
        # △ABC (left) with angle 55°
        ax.plot([0, 5, 2.8, 0], [0, 0, 3.5, 0], 'o-', color='#38bdf8', linewidth=2.0, markerfacecolor='#fbbf24')
        ax.annotate('△ABC (m∠A = 55°)', (2.5, -0.6), color='#38bdf8', fontsize=9, fontweight='bold', ha='center')
        ax.annotate('8 cm', (1.2, 1.8), color='#38bdf8', fontsize=8)
        ax.annotate('11 cm', (3.9, 1.8), color='#38bdf8', fontsize=8)
        
        # △DEF (right) with angle 70° (wider base)
        ax.plot([7, 13, 9.2, 7], [0, 0, 4.2, 7], 'o-', color='#fbbf24', linewidth=2.0, markerfacecolor='#38bdf8')
        ax.annotate('△DEF (m∠D = 70°)', (10, -0.6), color='#fbbf24', fontsize=9, fontweight='bold', ha='center')
        ax.annotate('8 cm', (7.9, 2.1), color='#fbbf24', fontsize=8)
        ax.annotate('11 cm', (11.2, 2.1), color='#fbbf24', fontsize=8)
        
        target_label = "Compare Opposite Base Lengths: BC vs EF = ?"
        ax.set_xlim(-1, 14)
        ax.set_ylim(-1.2, 5.2)

    # 8. Q14: Converse Hinge Theorem comparison of △PQR and △STU
    elif num == 14:
        # △PQR (side 8)
        ax.plot([0, 4, 1.5, 0], [0, 0, 3.2, 0], 'o-', color='#38bdf8', linewidth=2.0, markerfacecolor='#fbbf24')
        ax.annotate('△PQR (QR = 8)', (2, -0.6), color='#38bdf8', fontsize=9, fontweight='bold', ha='center')
        ax.annotate('6', (0.6, 1.6), color='#38bdf8', fontsize=8)
        ax.annotate('9', (2.8, 1.6), color='#38bdf8', fontsize=8)
        
        # △STU (side 11)
        ax.plot([6, 11.5, 7.5, 6], [0, 0, 3.8, 0], 'o-', color='#fbbf24', linewidth=2.0, markerfacecolor='#38bdf8')
        ax.annotate('△STU (TU = 11)', (8.75, -0.6), color='#fbbf24', fontsize=9, fontweight='bold', ha='center')
        ax.annotate('6', (6.6, 1.9), color='#fbbf24', fontsize=8)
        ax.annotate('9', (9.6, 1.9), color='#fbbf24', fontsize=8)
        
        target_label = "Compare Enclosed Angles: m∠P vs m∠S = ?"
        ax.set_xlim(-1, 12.5)
        ax.set_ylim(-1.2, 4.8)

    # 9. Q17: Isosceles triangle with obtuse vertex angle
    elif num == 17:
        ax.plot([0, 8, 4, 0], [0, 0, 2.0, 0], 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
        ax.annotate('Leg s', (1.8, 1.2), color='#38bdf8', fontsize=10, fontweight='bold', rotation=25)
        ax.annotate('Leg s', (6.2, 1.2), color='#38bdf8', fontsize=10, fontweight='bold', rotation=-25)
        ax.annotate('Obtuse Vertex Angle θ > 90°', (4, 2.4), color='#f43f5e', fontsize=10, fontweight='bold', ha='center')
        ax.annotate('Base b = ?', (4, -0.5), color='#fbbf24', fontsize=10, fontweight='bold', ha='center')
        target_label = "Longest Side in Obtuse Isosceles Triangle = ?"
        ax.set_xlim(-1, 9)
        ax.set_ylim(-1, 3.5)

    # 10. Q20: Triangle ABC with midsegment DE
    elif num == 20:
        ax.plot([0, 8, 3, 0], [0, 0, 6, 0], 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
        ax.plot([1.5, 5.5], [3, 3], 'o--', color='#fbbf24', linewidth=2.0, markerfacecolor='#f43f5e')
        ax.annotate('A', (3, 6), textcoords="offset points", xytext=(0, 8), color='#f8fafc', fontweight='bold', ha='center')
        ax.annotate('B', (0, 0), textcoords="offset points", xytext=(-12, -12), color='#f8fafc', fontweight='bold')
        ax.annotate('C', (8, 0), textcoords="offset points", xytext=(8, -12), color='#f8fafc', fontweight='bold')
        ax.annotate('D', (1.5, 3), textcoords="offset points", xytext=(-12, 0), color='#f8fafc', fontweight='bold')
        ax.annotate('E', (5.5, 3), textcoords="offset points", xytext=(8, 0), color='#f8fafc', fontweight='bold')
        ax.annotate('DE = 3x - 2', (3.5, 3.3), color='#f43f5e', fontsize=10, fontweight='bold', ha='center')
        ax.annotate('BC = 4x + 6', (4.0, -0.6), color='#38bdf8', fontsize=10, fontweight='bold', ha='center')
        target_label = "Find x & Length of Midsegment DE = ?"
        ax.set_xlim(-1.5, 9.5)
        ax.set_ylim(-1.2, 7.2)

    # 11. Q21: Right-angled triangle ABC with hypotenuse AB
    elif num == 21:
        tx = [0, 6, 0, 0]
        ty = [0, 0, 4.5, 0]
        ax.plot(tx, ty, 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
        ax.plot([0, 0.4, 0.4, 0], [0.4, 0.4, 0, 0], color='#fbbf24', linewidth=1.2)
        ax.annotate('C (90°)', (0, 0), textcoords="offset points", xytext=(-15, -12), color='#f8fafc', fontweight='bold')
        ax.annotate('B', (6, 0), textcoords="offset points", xytext=(8, -12), color='#f8fafc', fontweight='bold')
        ax.annotate('A', (0, 4.5), textcoords="offset points", xytext=(-12, 8), color='#f8fafc', fontweight='bold')
        ax.annotate('Leg AC', (-0.8, 2.25), color='#38bdf8', fontsize=10, fontweight='bold', va='center', rotation=90)
        ax.annotate('Leg BC', (3.0, -0.5), color='#38bdf8', fontsize=10, fontweight='bold', ha='center')
        ax.annotate('Hypotenuse AB', (3.2, 2.5), color='#fbbf24', fontsize=10, fontweight='bold')
        target_label = "Prove Hypotenuse AB > AC and AB > BC"
        ax.set_xlim(-1.5, 7.2)
        ax.set_ylim(-1.2, 5.5)

    # 12. Q22: Triangle with sides 5 cm and 11 cm
    elif num == 22:
        ax.plot([0, 6, 2, 0], [0, 0, 3.5, 0], 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
        ax.annotate('Side = 5 cm', (0.8, 1.9), color='#38bdf8', fontsize=10, fontweight='bold', rotation=60)
        ax.annotate('Side = 11 cm', (4.2, 1.9), color='#38bdf8', fontsize=10, fontweight='bold', rotation=-40)
        ax.annotate('Integer Third Side x = ?', (3, -0.5), color='#f43f5e', fontsize=10, fontweight='bold', ha='center')
        target_label = "Minimum & Maximum Integer Side x = ?"
        ax.set_xlim(-1, 7)
        ax.set_ylim(-1, 4.5)

    # 13. Q23: Isosceles triangle with legs 10 cm
    elif num == 23:
        ax.plot([0, 5, 2.5, 0], [0, 0, 4.5, 0], 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
        ax.annotate('Leg = 10 cm', (1.0, 2.4), color='#38bdf8', fontsize=10, fontweight='bold', rotation=60)
        ax.annotate('Leg = 10 cm', (4.0, 2.4), color='#38bdf8', fontsize=10, fontweight='bold', rotation=-60)
        ax.annotate('Base b = ?', (2.5, -0.5), color='#f43f5e', fontsize=10, fontweight='bold', ha='center')
        target_label = "Range of Base Length b = ?"
        ax.set_xlim(-1, 6)
        ax.set_ylim(-1, 5.5)

    # 14. Q24: Triangle ABC with angle bisector AD
    elif num == 24:
        ax.plot([0, 7, 2.5, 0], [0, 0, 5, 0], 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
        ax.plot([2.5, 2.2], [5, 0], '--', color='#fbbf24', linewidth=2.0)
        ax.annotate('A', (2.5, 5), textcoords="offset points", xytext=(0, 8), color='#f8fafc', fontweight='bold', ha='center')
        ax.annotate('B', (0, 0), textcoords="offset points", xytext=(-12, -12), color='#f8fafc', fontweight='bold')
        ax.annotate('C', (7, 0), textcoords="offset points", xytext=(8, -12), color='#f8fafc', fontweight='bold')
        ax.annotate('D', (2.2, 0), textcoords="offset points", xytext=(0, -12), color='#f8fafc', fontweight='bold', ha='center')
        ax.annotate('AB = 10', (1.0, 2.5), color='#38bdf8', fontsize=10, fontweight='bold', rotation=60)
        ax.annotate('AC = 6', (5.0, 2.5), color='#38bdf8', fontsize=10, fontweight='bold', rotation=-45)
        target_label = "Compare Segment Lengths: BD vs DC = ?"
        ax.set_xlim(-1.2, 8.2)
        ax.set_ylim(-1.2, 6.2)

    # 15. Q25: Quadrilateral ABCD with diagonals
    elif num == 25:
        qx = [0, 6, 7, 1, 0]
        qy = [0, 0, 5, 4, 0]
        ax.plot(qx, qy, 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
        ax.plot([0, 7], [0, 5], '--', color='#f43f5e', linewidth=1.5, label='AC')
        ax.plot([6, 1], [0, 4], '--', color='#f43f5e', linewidth=1.5, label='BD')
        lbls = ['A', 'B', 'C', 'D']
        for idx in range(4):
            ax.annotate(lbls[idx], (qx[idx], qy[idx]), textcoords="offset points", xytext=(-5, -12 if qy[idx]==0 else 8),
                        color='#f8fafc', fontsize=11, fontweight='bold')
        target_label = "Prove AC + BD > 1/2 Perimeter"
        ax.set_xlim(-1, 8)
        ax.set_ylim(-1, 6)

    # 16. Q27: Triangle KLM with K=(3x+10)°, L=(2x+20)°, M=(4x-30)°
    elif num == 27:
        ax.plot([0, 7, 3, 0], [0, 0, 5, 0], 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
        ax.annotate('K (3x+10)°', (0, 0), textcoords="offset points", xytext=(-15, -12), color='#f8fafc', fontweight='bold')
        ax.annotate('L (2x+20)°', (7, 0), textcoords="offset points", xytext=(8, -12), color='#f8fafc', fontweight='bold')
        ax.annotate('M (4x-30)°', (3, 5), textcoords="offset points", xytext=(0, 8), color='#f8fafc', fontweight='bold', ha='center')
        target_label = "Solve x & Order Side Lengths = ?"
        ax.set_xlim(-2, 8.5)
        ax.set_ylim(-1.2, 6.2)

    # 17. Q28: Surveyor cell relay station equidistant from 3 towns
    elif num == 28:
        tx = [0, 8, 3, 0]
        ty = [0, 0, 6, 0]
        ax.plot(tx, ty, 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
        ax.annotate('Town A', (0, 0), textcoords="offset points", xytext=(-15, -12), color='#f8fafc', fontweight='bold')
        ax.annotate('Town B', (8, 0), textcoords="offset points", xytext=(8, -12), color='#f8fafc', fontweight='bold')
        ax.annotate('Town C', (3, 6), textcoords="offset points", xytext=(0, 8), color='#f8fafc', fontweight='bold', ha='center')
        # Circumcenter O
        ax.plot(4, 2.25, 's', color='#f43f5e', markersize=10)
        ax.annotate('Relay Station O', (4, 2.25), textcoords="offset points", xytext=(8, 5), color='#f43f5e', fontweight='bold')
        target_label = "Cell Relay Station Location = ?"
        ax.set_xlim(-2, 9.5)
        ax.set_ylim(-1.5, 7.2)

    # 18. Q29: Municipal water reservoir equidistant from 3 cities
    elif num == 29:
        tx = [0, 8, 3, 0]
        ty = [0, 0, 6, 0]
        ax.plot(tx, ty, 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
        ax.annotate('City 1', (0, 0), textcoords="offset points", xytext=(-15, -12), color='#f8fafc', fontweight='bold')
        ax.annotate('City 2', (8, 0), textcoords="offset points", xytext=(8, -12), color='#f8fafc', fontweight='bold')
        ax.annotate('City 3', (3, 6), textcoords="offset points", xytext=(0, 8), color='#f8fafc', fontweight='bold', ha='center')
        ax.plot(4, 2.25, 's', color='#f43f5e', markersize=10)
        ax.annotate('Reservoir O', (4, 2.25), textcoords="offset points", xytext=(8, 5), color='#f43f5e', fontweight='bold')
        target_label = "Central Water Reservoir Location = ?"
        ax.set_xlim(-2, 9.5)
        ax.set_ylim(-1.5, 7.2)

    # 19. Q30: Hinge Theorem Hikers Path
    elif num == 30:
        # Hiker A: (0,0) -> (4,0) -> turns 40 deg N of E
        ax.plot([0, 4, 7], [0, 0, 2.5], 'o-', color='#38bdf8', linewidth=2.5, label='Hiker A')
        # Hiker B: (0,0) -> (4,0) -> turns 60 deg N of E
        ax.plot([0, 4, 5.5], [0, 0, 3.5], 'o--', color='#f43f5e', linewidth=2.5, label='Hiker B')
        ax.annotate('Camp O', (0, 0), textcoords="offset points", xytext=(-15, -12), color='#f8fafc', fontweight='bold')
        ax.annotate('Turn Point', (4, 0), textcoords="offset points", xytext=(0, -15), color='#94a3b8', fontweight='bold')
        target_label = "Compare Final Distance from Camp O = ?"
        ax.set_xlim(-1, 8.5)
        ax.set_ylim(-1.2, 4.8)

    # 20. Q31: Interior point P in △ABC
    elif num == 31:
        ax.plot([0, 8, 3, 0], [0, 0, 6, 0], 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
        ax.plot(3.5, 2.2, 'o', color='#f43f5e', markersize=8)
        ax.plot([0, 3.5], [0, 2.2], ':', color='#f43f5e', linewidth=1.5)
        ax.plot([8, 3.5], [0, 2.2], ':', color='#f43f5e', linewidth=1.5)
        ax.plot([3, 3.5], [6, 2.2], ':', color='#f43f5e', linewidth=1.5)
        ax.annotate('P', (3.5, 2.2), textcoords="offset points", xytext=(8, 5), color='#f43f5e', fontweight='bold')
        target_label = "Prove PA + PB + PC > 1/2 Perimeter"
        ax.set_xlim(-1, 9)
        ax.set_ylim(-1, 7)

    # 21. Q32: Acute triangle altitudes vs sides
    elif num == 32:
        ax.plot([0, 7, 2.5, 0], [0, 0, 5, 0], 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
        ax.plot([2.5, 2.5], [5, 0], '--', color='#f43f5e', linewidth=1.5, label='h_a')
        target_label = "Sum of Altitudes > Perimeter Comparison"
        ax.set_xlim(-1, 8)
        ax.set_ylim(-1, 6)

    # 22. Q33: Triangular garden sides 12 m and 18 m
    elif num == 33:
        ax.plot([0, 6, 2, 0], [0, 0, 3.5, 0], 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
        ax.annotate('Side = 12 m', (0.8, 1.9), color='#38bdf8', fontsize=10, fontweight='bold', rotation=60)
        ax.annotate('Side = 18 m', (4.2, 1.9), color='#38bdf8', fontsize=10, fontweight='bold', rotation=-40)
        ax.annotate('Third Side x = ?', (3, -0.5), color='#f43f5e', fontsize=10, fontweight='bold', ha='center')
        target_label = "Maximum Third Side Fence Length = ?"
        ax.set_xlim(-1, 7)
        ax.set_ylim(-1, 4.5)

    # 23. Q34: Triangle perimeter vs sum of medians
    elif num == 34:
        ax.plot([0, 8, 3, 0], [0, 0, 6, 0], 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
        ax.plot([3, 4], [6, 0], '--', color='#f43f5e', linewidth=1.5, label='m_a')
        ax.plot([0, 5.5], [0, 3], '--', color='#f43f5e', linewidth=1.5, label='m_b')
        ax.plot([8, 1.5], [0, 3], '--', color='#f43f5e', linewidth=1.5, label='m_c')
        target_label = "Prove Perimeter > Sum of Medians"
        ax.set_xlim(-1, 9)
        ax.set_ylim(-1, 7)

    # 24. Q36: Third side integer values for sides 8 cm and 13 cm
    elif num == 36:
        ax.plot([0, 6, 2, 0], [0, 0, 3.5, 0], 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
        ax.annotate('Side = 8 cm', (0.8, 1.9), color='#38bdf8', fontsize=10, fontweight='bold', rotation=60)
        ax.annotate('Side = 13 cm', (4.2, 1.9), color='#38bdf8', fontsize=10, fontweight='bold', rotation=-40)
        ax.annotate('Third Side x = ?', (3, -0.5), color='#f43f5e', fontsize=10, fontweight='bold', ha='center')
        target_label = "Number of Possible Integer Values = ?"
        ax.set_xlim(-1, 7)
        ax.set_ylim(-1, 4.5)

    # 25. Q37: Triangle ABC with altitude AH
    elif num == 37:
        ax.plot([0, 8, 3, 0], [0, 0, 6, 0], 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
        ax.plot([3, 3], [6, 0], '--', color='#f43f5e', linewidth=2.0)
        ax.annotate('A', (3, 6), textcoords="offset points", xytext=(0, 8), color='#f8fafc', fontweight='bold', ha='center')
        ax.annotate('B', (0, 0), textcoords="offset points", xytext=(-12, -12), color='#f8fafc', fontweight='bold')
        ax.annotate('C', (8, 0), textcoords="offset points", xytext=(8, -12), color='#f8fafc', fontweight='bold')
        ax.annotate('H', (3, 0), textcoords="offset points", xytext=(0, -12), color='#f8fafc', fontweight='bold', ha='center')
        ax.annotate('Altitude AH', (3.3, 3), color='#f43f5e', fontsize=10, fontweight='bold')
        target_label = "Prove AB > AH and AC > AH"
        ax.set_xlim(-1.5, 9.5)
        ax.set_ylim(-1.2, 7.2)

    # 26. Q38: Triangle PQR with PQ > PR and altitude PS
    elif num == 38:
        ax.plot([0, 9, 3, 0], [0, 0, 5, 0], 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
        ax.plot([3, 3], [5, 0], '--', color='#f43f5e', linewidth=2.0)
        ax.annotate('P', (3, 5), textcoords="offset points", xytext=(0, 8), color='#f8fafc', fontweight='bold', ha='center')
        ax.annotate('Q', (0, 0), textcoords="offset points", xytext=(-12, -12), color='#f8fafc', fontweight='bold')
        ax.annotate('R', (9, 0), textcoords="offset points", xytext=(8, -12), color='#f8fafc', fontweight='bold')
        ax.annotate('S', (3, 0), textcoords="offset points", xytext=(0, -12), color='#f8fafc', fontweight='bold', ha='center')
        target_label = "Compare Segment Lengths: QS vs SR = ?"
        ax.set_xlim(-1.5, 10.5)
        ax.set_ylim(-1.2, 6.2)

    # 27. Q39: Triangle ABC with median AM
    elif num == 39:
        ax.plot([0, 8, 3, 0], [0, 0, 6, 0], 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
        ax.plot([3, 4], [6, 0], '--', color='#f43f5e', linewidth=2.0)
        ax.annotate('A', (3, 6), textcoords="offset points", xytext=(0, 8), color='#f8fafc', fontweight='bold', ha='center')
        ax.annotate('B', (0, 0), textcoords="offset points", xytext=(-12, -12), color='#f8fafc', fontweight='bold')
        ax.annotate('C', (8, 0), textcoords="offset points", xytext=(8, -12), color='#f8fafc', fontweight='bold')
        ax.annotate('M', (4, 0), textcoords="offset points", xytext=(0, -12), color='#f8fafc', fontweight='bold', ha='center')
        ax.annotate('Median AM', (3.7, 3), color='#f43f5e', fontsize=10, fontweight='bold')
        target_label = "Prove AM < 1/2(AB + AC)"
        ax.set_xlim(-1.5, 9.5)
        ax.set_ylim(-1.2, 7.2)

    # 28. Q41: Triangle ABC with mA > mB > mC and altitudes
    elif num == 41:
        ax.plot([0, 8, 2, 0], [0, 0, 5, 0], 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
        ax.annotate('A (Largest)', (2, 5), textcoords="offset points", xytext=(0, 8), color='#f8fafc', fontweight='bold', ha='center')
        ax.annotate('B', (8, 0), textcoords="offset points", xytext=(8, -12), color='#f8fafc', fontweight='bold')
        ax.annotate('C (Smallest)', (0, 0), textcoords="offset points", xytext=(-12, -12), color='#f8fafc', fontweight='bold')
        target_label = "Order of Altitudes (h_a, h_b, h_c) = ?"
        ax.set_xlim(-1.5, 9.5)
        ax.set_ylim(-1.2, 6.2)

    # 29. Q42: Mechanical robotic crane arms
    elif num == 42:
        # Arm 1 = 3m, Arm 2 = 2m
        ax.plot([0, 3, 5], [0, 0, 0], 'o-', color='#38bdf8', linewidth=3.0, markerfacecolor='#fbbf24', label='Extended (5m)')
        ax.plot([0, 3, 1], [0, 0, 0], 'o--', color='#f43f5e', linewidth=2.0, markerfacecolor='#f43f5e', label='Folded (1m)')
        ax.annotate('Base Joint', (0, 0), textcoords="offset points", xytext=(-10, -15), color='#f8fafc', fontweight='bold')
        ax.annotate('Arm 1 = 3 m', (1.5, 0.3), color='#38bdf8', fontsize=10, fontweight='bold', ha='center')
        ax.annotate('Arm 2 = 2 m', (4.0, 0.3), color='#fbbf24', fontsize=10, fontweight='bold', ha='center')
        target_label = "Min & Max Reach Range = ?"
        ax.set_xlim(-1, 6)
        ax.set_ylim(-1.5, 2.0)

    # 30. Q43: Triangle XYZ with sides 8, x+3, 2x-1
    elif num == 43:
        ax.plot([0, 6, 2, 0], [0, 0, 3.5, 0], 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
        ax.annotate('Side = 8', (3, -0.5), color='#38bdf8', fontsize=10, fontweight='bold', ha='center')
        ax.annotate('Side = x + 3', (0.8, 1.9), color='#38bdf8', fontsize=10, fontweight='bold', rotation=60)
        ax.annotate('Side = 2x - 1', (4.2, 1.9), color='#38bdf8', fontsize=10, fontweight='bold', rotation=-40)
        target_label = "Range of Variable x = ?"
        ax.set_xlim(-1, 7)
        ax.set_ylim(-1, 4.5)

    # 31. Q45: Point D on segment BC of △ABC
    elif num == 45:
        ax.plot([0, 8, 3, 0], [0, 0, 6, 0], 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
        ax.plot([3, 5], [6, 0], '--', color='#f43f5e', linewidth=2.0)
        ax.annotate('A', (3, 6), textcoords="offset points", xytext=(0, 8), color='#f8fafc', fontweight='bold', ha='center')
        ax.annotate('B', (0, 0), textcoords="offset points", xytext=(-12, -12), color='#f8fafc', fontweight='bold')
        ax.annotate('C', (8, 0), textcoords="offset points", xytext=(8, -12), color='#f8fafc', fontweight='bold')
        ax.annotate('D', (5, 0), textcoords="offset points", xytext=(0, -12), color='#f8fafc', fontweight='bold', ha='center')
        target_label = "Prove AD < max(AB, AC)"
        ax.set_xlim(-1.5, 9.5)
        ax.set_ylim(-1.2, 7.2)

    # 32. Q46: Isosceles triangle perimeter 30 cm
    elif num == 46:
        ax.plot([0, 5, 2.5, 0], [0, 0, 4.5, 0], 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
        ax.annotate('Leg x', (1.0, 2.4), color='#38bdf8', fontsize=10, fontweight='bold', rotation=60)
        ax.annotate('Leg x', (4.0, 2.4), color='#38bdf8', fontsize=10, fontweight='bold', rotation=-60)
        ax.annotate('Base y', (2.5, -0.5), color='#38bdf8', fontsize=10, fontweight='bold', ha='center')
        ax.annotate('Perimeter 2x + y = 30 cm', (2.5, 2.0), color='#f43f5e', fontsize=10, fontweight='bold', ha='center')
        target_label = "Integer Side Combinations (x, x, y) = ?"
        ax.set_xlim(-1, 6)
        ax.set_ylim(-1, 5.5)

    # 33. Q48: Exterior angles 4 : 5 : 6
    elif num == 48:
        # A(0,0), B(6,0), C(2, 4)
        ax.plot([0, 6, 2, 0], [0, 0, 4, 0], 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
        ax.plot([0, -2], [0, 0], '--', color='#f43f5e', linewidth=1.5)
        ax.plot([6, 8], [0, 0], '--', color='#f43f5e', linewidth=1.5)
        ax.annotate('Ext 4x', (-1.0, 0.3), color='#f43f5e', fontsize=9, fontweight='bold')
        ax.annotate('Ext 5x', (6.8, 0.3), color='#f43f5e', fontsize=9, fontweight='bold')
        ax.annotate('Ext 6x', (2.0, 4.8), color='#f43f5e', fontsize=9, fontweight='bold', ha='center')
        target_label = "Interior Angles of △ABC = ?"
        ax.set_xlim(-2.5, 8.5)
        ax.set_ylim(-1, 5.5)

    # 34. Q49: Quadrilateral ABCD
    elif num == 49:
        qx = [0, 5, 6, 1, 0]
        qy = [0, 0, 4, 3.5, 0]
        ax.plot(qx, qy, 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
        lbls = ['A', 'B', 'C', 'D']
        for idx in range(4):
            ax.annotate(lbls[idx], (qx[idx], qy[idx]), textcoords="offset points", xytext=(-5, -12 if qy[idx]==0 else 8),
                        color='#f8fafc', fontsize=11, fontweight='bold')
        target_label = "Prove AB + BC + CD > AD"
        ax.set_xlim(-1, 7)
        ax.set_ylim(-1, 5)

    # Adding Title and Target Label
    qid = q.get('id', f"Q{q['num']}")
    fig.suptitle(f"[{qid}] {title}", color='#f8fafc', fontsize=11, fontweight='bold', y=0.96)
    ax.set_title(f"Target: {target_label}", color='#f43f5e', fontsize=10, fontweight='bold', pad=10)
    
    plt.tight_layout()
    
    svg_filename = f"g9_t152_q{num}.svg"
    png_filename = f"g9_t152_q{num}.png"
    
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

print("Starting generation of custom clean plots for Topic 152...")
generated_count = 0
for q in questions:
    if q['num'] not in no_image_nums:
        create_diagram(q)
        generated_count += 1

print(f"Successfully generated {generated_count} clean custom plots for Topic 152!")
