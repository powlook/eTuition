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

with open('scratch/t151_50_built_questions.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

print(f"Loaded {len(questions)} built questions for Topic 151.")

def create_diagram(q):
    num = q['num']
    title = q['title']
    
    fig, ax = plt.subplots(figsize=(6.5, 4.8), dpi=100)
    fig.patch.set_facecolor('#0f172a')
    ax.set_facecolor('#0f172a')
    
    ax.grid(True, color='#334155', linestyle='--', linewidth=0.7, alpha=0.6)
    for spine in ax.spines.values():
        spine.set_color('#475569')
        spine.set_linewidth(1.2)
    ax.tick_params(colors='#94a3b8', labelsize=9)
    
    # 1. Ratio 45-45-90 & Formulas (Q1, Q3)
    if num in [1, 3]:
        tx = [0, 4, 0, 0]
        ty = [0, 0, 4, 0]
        ax.plot(tx, ty, 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
        ax.annotate('A', (0, 0), textcoords="offset points", xytext=(-12, -12), color='#f8fafc', fontweight='bold')
        ax.annotate('B', (4, 0), textcoords="offset points", xytext=(8, -12), color='#f8fafc', fontweight='bold')
        ax.annotate('C', (0, 4), textcoords="offset points", xytext=(-12, 8), color='#f8fafc', fontweight='bold')
        
        ax.plot([0, 0.4, 0.4, 0], [0.4, 0.4, 0, 0], color='#fbbf24', linewidth=1.2)
        ax.annotate('45°', (2.8, 0.3), color='#f43f5e', fontsize=10, fontweight='bold')
        ax.annotate('45°', (0.3, 2.8), color='#f43f5e', fontsize=10, fontweight='bold')
        
        ax.annotate('Leg s', (2.0, -0.5), color='#38bdf8', fontsize=10, fontweight='bold', ha='center')
        ax.annotate('Leg s', (-0.6, 2.0), color='#38bdf8', fontsize=10, fontweight='bold', va='center')
        ax.annotate('Hypotenuse h', (2.2, 2.2), color='#fbbf24', fontsize=10, fontweight='bold')
        target_label = "Ratio (Leg : Leg : Hypotenuse) = ?" if num == 1 else "Formulas: h = s√2, s = ?"
        ax.set_xlim(-1.2, 5.2)
        ax.set_ylim(-1.2, 5.2)

    # 2. Ratio 30-60-90 & Formulas (Q2, Q4)
    elif num in [2, 4]:
        tx = [0, 3*np.sqrt(3), 0, 0]
        ty = [0, 0, 3, 0]
        ax.plot(tx, ty, 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
        ax.annotate('A', (0, 0), textcoords="offset points", xytext=(-12, -12), color='#f8fafc', fontweight='bold')
        ax.annotate('B', (3*np.sqrt(3), 0), textcoords="offset points", xytext=(8, -12), color='#f8fafc', fontweight='bold')
        ax.annotate('C', (0, 3), textcoords="offset points", xytext=(-12, 8), color='#f8fafc', fontweight='bold')
        
        ax.plot([0, 0.4, 0.4, 0], [0.4, 0.4, 0, 0], color='#fbbf24', linewidth=1.2)
        ax.annotate('30°', (3*np.sqrt(3)-1.2, 0.3), color='#f43f5e', fontsize=10, fontweight='bold')
        ax.annotate('60°', (0.3, 2.2), color='#f43f5e', fontsize=10, fontweight='bold')
        
        ax.annotate('Shorter Leg x', (-0.8, 1.5), color='#38bdf8', fontsize=10, fontweight='bold', va='center', rotation=90)
        ax.annotate('Longer Leg y', (1.5*np.sqrt(3), -0.5), color='#38bdf8', fontsize=10, fontweight='bold', ha='center')
        ax.annotate('Hypotenuse h', (1.6*np.sqrt(3), 1.8), color='#fbbf24', fontsize=10, fontweight='bold')
        target_label = "Ratio (Shorter : Longer : Hypotenuse) = ?" if num == 2 else "Formulas: h = 2x, y = x√3, x = ?"
        ax.set_xlim(-1.5, 6.2)
        ax.set_ylim(-1.2, 4.2)

    # 3. 45-45-90 Calculations (Q5, Q6, Q9)
    elif num in [5, 6, 9]:
        tx = [0, 4, 0, 0]
        ty = [0, 0, 4, 0]
        ax.plot(tx, ty, 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
        ax.plot([0, 0.4, 0.4, 0], [0.4, 0.4, 0, 0], color='#fbbf24', linewidth=1.2)
        ax.annotate('45°', (2.8, 0.3), color='#f43f5e', fontsize=10, fontweight='bold')
        ax.annotate('45°', (0.3, 2.8), color='#f43f5e', fontsize=10, fontweight='bold')
        
        if num == 5:
            ax.annotate('9 cm', (2.0, -0.5), color='#38bdf8', fontsize=10, fontweight='bold', ha='center')
            ax.annotate('9 cm', (-0.6, 2.0), color='#38bdf8', fontsize=10, fontweight='bold', va='center')
            ax.annotate('h = ?', (2.2, 2.2), color='#fbbf24', fontsize=11, fontweight='bold')
            target_label = "Hypotenuse h = ?"
        elif num == 6:
            ax.annotate('s = ?', (2.0, -0.5), color='#38bdf8', fontsize=11, fontweight='bold', ha='center')
            ax.annotate('s = ?', (-0.6, 2.0), color='#38bdf8', fontsize=11, fontweight='bold', va='center')
            ax.annotate('h = 16 cm', (2.2, 2.2), color='#fbbf24', fontsize=10, fontweight='bold')
            target_label = "Leg s = ?"
        else: # Q9
            ax.annotate('Leg s', (2.0, -0.5), color='#38bdf8', fontsize=10, fontweight='bold', ha='center')
            ax.annotate('Leg s', (-0.6, 2.0), color='#38bdf8', fontsize=10, fontweight='bold', va='center')
            ax.annotate('Hypotenuse h', (2.2, 2.2), color='#fbbf24', fontsize=10, fontweight='bold')
            target_label = "Perimeter = (12 + 12√2) cm | Hypotenuse & Area = ?"

        ax.set_xlim(-1.2, 5.2)
        ax.set_ylim(-1.2, 5.2)

    # 4. Square & Baseball Diamond (Q7, Q8)
    elif num in [7, 8]:
        if num == 7: # Square bedroom
            sx = [0, 4, 4, 0, 0]
            sy = [0, 0, 4, 4, 0]
            ax.plot(sx, sy, 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
            ax.plot([0, 4], [0, 4], '--', color='#fbbf24', linewidth=2.0)
            ax.annotate('Diagonal = 14 m', (1.5, 2.2), color='#fbbf24', fontsize=10, fontweight='bold', rotation=45)
            target_label = "Perimeter & Area = ?"
            ax.set_xlim(-1, 5)
            ax.set_ylim(-1, 5)
        else: # Q8 Baseball diamond
            bx = [0, 3, 0, -3, 0]
            by = [0, 3, 6, 3, 0]
            ax.plot(bx, by, 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
            ax.plot([0, 0], [0, 6], '--', color='#fbbf24', linewidth=2.0)
            ax.annotate('Home Plate', (0, -0.5), color='#f8fafc', fontsize=10, fontweight='bold', ha='center')
            ax.annotate('1st Base', (3.3, 3), color='#f8fafc', fontsize=9, fontweight='bold')
            ax.annotate('2nd Base', (0, 6.3), color='#f8fafc', fontsize=10, fontweight='bold', ha='center')
            ax.annotate('3rd Base', (-3.3, 3), color='#f8fafc', fontsize=9, fontweight='bold', ha='right')
            ax.annotate('Base = 90 ft', (1.8, 1.2), color='#38bdf8', fontsize=9, fontweight='bold')
            target_label = "Throwing Distance (Home to 2nd Base) d = ?"
            ax.set_xlim(-4.2, 4.2)
            ax.set_ylim(-1.2, 7.2)

    # 5. 30-60-90 Calculations (Q10, Q11, Q12)
    elif num in [10, 11, 12]:
        tx = [0, 4*np.sqrt(3), 0, 0]
        ty = [0, 0, 4, 0]
        ax.plot(tx, ty, 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
        ax.plot([0, 0.4, 0.4, 0], [0.4, 0.4, 0, 0], color='#fbbf24', linewidth=1.2)
        ax.annotate('30°', (4*np.sqrt(3)-1.2, 0.3), color='#f43f5e', fontsize=10, fontweight='bold')
        ax.annotate('60°', (0.3, 3.2), color='#f43f5e', fontsize=10, fontweight='bold')
        
        if num == 10:
            ax.annotate('Shorter leg = 7 cm', (-0.8, 2.0), color='#38bdf8', fontsize=10, fontweight='bold', va='center', rotation=90)
            ax.annotate('Longer leg = ?', (2*np.sqrt(3), -0.5), color='#fbbf24', fontsize=10, fontweight='bold', ha='center')
            ax.annotate('Hypotenuse = ?', (2.2*np.sqrt(3), 2.2), color='#fbbf24', fontsize=10, fontweight='bold')
            target_label = "Longer leg & Hypotenuse = ?"
        elif num == 11:
            ax.annotate('Shorter leg = ?', (-0.8, 2.0), color='#fbbf24', fontsize=10, fontweight='bold', va='center', rotation=90)
            ax.annotate('Longer leg = ?', (2*np.sqrt(3), -0.5), color='#fbbf24', fontsize=10, fontweight='bold', ha='center')
            ax.annotate('Hypotenuse = 22 cm', (2.2*np.sqrt(3), 2.2), color='#38bdf8', fontsize=10, fontweight='bold')
            target_label = "Shorter leg & Longer leg = ?"
        else: # Q12
            ax.annotate('Shorter leg = ?', (-0.8, 2.0), color='#fbbf24', fontsize=10, fontweight='bold', va='center', rotation=90)
            ax.annotate('Longer leg = 15 cm', (2*np.sqrt(3), -0.5), color='#38bdf8', fontsize=10, fontweight='bold', ha='center')
            ax.annotate('Hypotenuse = ?', (2.2*np.sqrt(3), 2.2), color='#fbbf24', fontsize=10, fontweight='bold')
            target_label = "Shorter leg & Hypotenuse = ?"

        ax.set_xlim(-1.5, 8.0)
        ax.set_ylim(-1.2, 5.2)

    # 6. Equilateral Triangles (Q13, Q14, Q15)
    elif num in [13, 14, 15]:
        ex = [0, 6, 3, 0]
        ey = [0, 0, 3*np.sqrt(3), 0]
        ax.plot(ex, ey, 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
        ax.plot([3, 3], [0, 3*np.sqrt(3)], '--', color='#fbbf24', linewidth=2.0)
        ax.plot([3, 3.3, 3.3, 3], [0.3, 0.3, 0, 0], color='#fbbf24', linewidth=1.0)
        
        if num == 13:
            ax.annotate('Side = 16 cm', (3, -0.5), color='#38bdf8', fontsize=10, fontweight='bold', ha='center')
            ax.annotate('Altitude h = ?', (3.2, 2.5), color='#fbbf24', fontsize=10, fontweight='bold')
            target_label = "Altitude & Area = ?"
        elif num == 14:
            ax.annotate('Altitude h = 9√3 cm', (3.2, 2.5), color='#38bdf8', fontsize=10, fontweight='bold')
            ax.annotate('Side s = ?', (3, -0.5), color='#fbbf24', fontsize=10, fontweight='bold', ha='center')
            target_label = "Perimeter & Area = ?"
        else: # Q15
            ax.annotate('Area = 36√3 cm²', (3, 1.8), color='#f43f5e', fontsize=10, fontweight='bold', ha='center')
            ax.annotate('Side s = ?', (3, -0.5), color='#fbbf24', fontsize=10, fontweight='bold', ha='center')
            target_label = "Side, Perimeter & Altitude = ?"

        ax.set_xlim(-1, 7)
        ax.set_ylim(-1.2, 6.0)

    # 7. Composite Triangles (Q16, Q17)
    elif num in [16, 17]:
        if num == 16:
            ax.plot([0, 8*np.sqrt(3)+8, 8*np.sqrt(3), 0], [0, 0, 8, 0], 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
            ax.plot([8*np.sqrt(3), 8*np.sqrt(3)], [0, 8], '--', color='#fbbf24', linewidth=2.0)
            ax.annotate('A (30°)', (0, 0), textcoords="offset points", xytext=(-15, -12), color='#f8fafc', fontweight='bold')
            ax.annotate('B (45°)', (8*np.sqrt(3)+8, 0), textcoords="offset points", xytext=(8, -12), color='#f8fafc', fontweight='bold')
            ax.annotate('C', (8*np.sqrt(3), 8), textcoords="offset points", xytext=(0, 8), color='#f8fafc', fontweight='bold', ha='center')
            ax.annotate('D', (8*np.sqrt(3), 0), textcoords="offset points", xytext=(0, -12), color='#f8fafc', fontweight='bold', ha='center')
            ax.annotate('Altitude CD = 8 cm', (8*np.sqrt(3)+0.3, 4), color='#f43f5e', fontsize=10, fontweight='bold')
            target_label = "AC, BC, AB = ?"
            ax.set_xlim(-2, 24)
            ax.set_ylim(-2, 10)
        else: # Q17
            ax.plot([0, 12, 7.61, 0], [0, 0, 7.61, 0], 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
            ax.plot([7.61, 7.61], [0, 7.61], '--', color='#fbbf24', linewidth=2.0)
            ax.annotate('P (45°)', (0, 0), textcoords="offset points", xytext=(-15, -12), color='#f8fafc', fontweight='bold')
            ax.annotate('Q (60°)', (12, 0), textcoords="offset points", xytext=(8, -12), color='#f8fafc', fontweight='bold')
            ax.annotate('R', (7.61, 7.61), textcoords="offset points", xytext=(0, 8), color='#f8fafc', fontweight='bold', ha='center')
            ax.annotate('PQ = 12 cm', (6, -0.6), color='#38bdf8', fontsize=10, fontweight='bold', ha='center')
            ax.annotate('Altitude h = ?', (7.8, 3.8), color='#fbbf24', fontsize=10, fontweight='bold')
            target_label = "Altitude h = ?"
            ax.set_xlim(-2, 14)
            ax.set_ylim(-2, 9.5)

    # 8. Trapezoids (Q18, Q19, Q20)
    elif num in [18, 19, 20]:
        if num == 18:
            trx = [0, 14, 11.5, 3.5, 0]
            try_ = [0, 0, 6, 6, 0]
            ax.plot(trx, try_, 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
            ax.plot([3.5, 3.5], [0, 6], '--', color='#fbbf24', linewidth=1.5)
            ax.plot([11.5, 11.5], [0, 6], '--', color='#fbbf24', linewidth=1.5)
            ax.annotate('60°', (0.5, 0.4), color='#f43f5e', fontsize=10, fontweight='bold')
            ax.annotate('30°', (12.5, 0.4), color='#f43f5e', fontsize=10, fontweight='bold')
            ax.annotate('Top Base = 8 cm', (7.5, 6.3), color='#38bdf8', fontsize=10, fontweight='bold', ha='center')
            ax.annotate('Height h = 6 cm', (3.7, 3), color='#fbbf24', fontsize=10, fontweight='bold')
            target_label = "Lower base & Legs = ?"
            ax.set_xlim(-1, 15)
            ax.set_ylim(-1, 8)
        elif num == 19: # Isosceles 45°
            trx = [0, 15.66, 11.66, 4, 0]
            try_ = [0, 0, 5.66, 5.66, 0]
            ax.plot(trx, try_, 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
            ax.plot([4, 4], [0, 5.66], '--', color='#fbbf24', linewidth=1.5)
            ax.plot([11.66, 11.66], [0, 5.66], '--', color='#fbbf24', linewidth=1.5)
            ax.annotate('45°', (0.8, 0.4), color='#f43f5e', fontsize=10, fontweight='bold')
            ax.annotate('45°', (14.0, 0.4), color='#f43f5e', fontsize=10, fontweight='bold')
            ax.annotate('Top Base = 10 cm', (7.83, 6.0), color='#38bdf8', fontsize=10, fontweight='bold', ha='center')
            ax.annotate('Leg = 8 cm', (1.5, 3.2), color='#38bdf8', fontsize=10, fontweight='bold', rotation=45)
            target_label = "Height, Bottom base, Area = ?"
            ax.set_xlim(-1, 17)
            ax.set_ylim(-1, 7.5)
        else: # Q20 Isosceles 60°
            trx = [0, 16, 11, 5, 0]
            try_ = [0, 0, 8.66, 8.66, 0]
            ax.plot(trx, try_, 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
            ax.plot([5, 5], [0, 8.66], '--', color='#fbbf24', linewidth=1.5)
            ax.plot([11, 11], [0, 8.66], '--', color='#fbbf24', linewidth=1.5)
            ax.annotate('60°', (1.0, 0.5), color='#f43f5e', fontsize=10, fontweight='bold')
            ax.annotate('60°', (14.0, 0.5), color='#f43f5e', fontsize=10, fontweight='bold')
            ax.annotate('Top Base = 6 cm', (8, 9.1), color='#38bdf8', fontsize=10, fontweight='bold', ha='center')
            ax.annotate('Leg = 10 cm', (2.0, 4.8), color='#38bdf8', fontsize=10, fontweight='bold', rotation=60)
            target_label = "Bottom base & Area = ?"
            ax.set_xlim(-1, 17)
            ax.set_ylim(-1, 10.5)

    # 9. Hexagons (Q21, Q22)
    elif num in [21, 22]:
        angles = np.linspace(0, 2*np.pi, 7)
        r = 4.0
        hx = r * np.cos(angles)
        hy = r * np.sin(angles)
        
        if num == 21: # Inscribed in circle of radius 10 cm
            circle_angles = np.linspace(0, 2*np.pi, 100)
            ax.plot(r*np.cos(circle_angles), r*np.sin(circle_angles), ':', color='#94a3b8', linewidth=1.5, label='Circle R = 10 cm')
            ax.plot(hx, hy, 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
            for i in range(6):
                ax.plot([0, hx[i]], [0, hy[i]], '--', color='#fbbf24', linewidth=1.2)
            ax.annotate('Radius r = 10 cm', (1.5, 0.8), color='#f43f5e', fontsize=10, fontweight='bold', rotation=30)
            target_label = "Perimeter & Exact Area = ?"
        else: # Q22 Apothem 6√3 cm
            ax.plot(hx, hy, 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
            ax.plot([0, 0], [0, -r*np.sin(np.pi/3)], '--', color='#f43f5e', linewidth=2.0)
            ax.annotate('Apothem a = 6√3 cm', (0.2, -1.8), color='#f43f5e', fontsize=10, fontweight='bold')
            target_label = "Side, Perimeter & Area = ?"

        ax.set_xlim(-5, 5)
        ax.set_ylim(-5, 5)
        ax.set_aspect('equal')

    # 10. Octagon Cut Corners (Q23)
    elif num == 23:
        sx = [0, 6, 6, 0, 0]
        sy = [0, 0, 6, 6, 0]
        ax.plot(sx, sy, ':', color='#94a3b8', linewidth=1.5, label='Square 20 cm')
        ox = [1.75, 4.25, 6, 6, 4.25, 1.75, 0, 0, 1.75]
        oy = [0, 0, 1.75, 4.25, 6, 6, 4.25, 1.75, 0]
        ax.plot(ox, oy, 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
        ax.annotate('Cut Corner x', (0.8, -0.4), color='#f43f5e', fontsize=10, fontweight='bold', ha='center')
        ax.annotate('x', (-0.4, 0.8), color='#f43f5e', fontsize=10, fontweight='bold', va='center')
        ax.annotate('Square Side = 20 cm', (3, 6.3), color='#38bdf8', fontsize=10, fontweight='bold', ha='center')
        target_label = "Corner Leg Length x = ?"
        ax.set_xlim(-1, 7)
        ax.set_ylim(-1, 7.2)

    # 11. Real-World Applications (Q24 - Q31)
    elif num in range(24, 32):
        if num == 24: # Extension ladder 12m at 60 deg
            ax.plot([0, 6], [0, 0], '-', color='#94a3b8', linewidth=2)
            ax.plot([0, 0], [0, 6], '-', color='#94a3b8', linewidth=2)
            ax.plot([3, 0], [0, 3*np.sqrt(3)], 'o-', color='#38bdf8', linewidth=3.0, markerfacecolor='#fbbf24')
            ax.annotate('Ground', (1.5, -0.4), color='#94a3b8', fontsize=9)
            ax.annotate('Wall', (-0.6, 2.5), color='#94a3b8', fontsize=9, rotation=90)
            ax.annotate('Ladder = 12 m', (1.8, 2.8), color='#fbbf24', fontsize=10, fontweight='bold', rotation=-60)
            ax.annotate('60°', (2.2, 0.3), color='#f43f5e', fontsize=10, fontweight='bold')
            target_label = "Height up wall & Foot distance = ?"
            ax.set_xlim(-1, 5)
            ax.set_ylim(-1, 6)
        elif num == 25: # Wheelchair ramp 30 deg 6m
            ax.plot([0, 5], [0, 0], '-', color='#94a3b8', linewidth=2)
            ax.plot([5, 5], [0, 2.5], '-', color='#94a3b8', linewidth=2)
            ax.plot([0, 5], [0, 2.5], 'o-', color='#38bdf8', linewidth=3.0, markerfacecolor='#fbbf24')
            ax.annotate('30°', (1.0, 0.2), color='#f43f5e', fontsize=10, fontweight='bold')
            ax.annotate('Ramp = 6 m', (2.5, 1.5), color='#fbbf24', fontsize=10, fontweight='bold', rotation=25)
            ax.annotate('Vertical Rise = ?', (5.2, 1.2), color='#38bdf8', fontsize=10, fontweight='bold', va='center')
            target_label = "Vertical Rise = ?"
            ax.set_xlim(-1, 7)
            ax.set_ylim(-1, 4)
        elif num == 26: # Roof truss 45 deg span 14m
            ax.plot([0, 6, 3, 0], [0, 0, 3, 0], 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
            ax.plot([3, 3], [0, 3], '--', color='#fbbf24', linewidth=1.5)
            ax.annotate('45°', (0.6, 0.3), color='#f43f5e', fontsize=10, fontweight='bold')
            ax.annotate('45°', (4.8, 0.3), color='#f43f5e', fontsize=10, fontweight='bold')
            ax.annotate('Span = 14 m', (3, -0.5), color='#38bdf8', fontsize=10, fontweight='bold', ha='center')
            ax.annotate('Peak Height = ?', (3.2, 1.5), color='#fbbf24', fontsize=10, fontweight='bold')
            target_label = "Peak Height & Rafter Length = ?"
            ax.set_xlim(-1, 7)
            ax.set_ylim(-1, 4.5)
        elif num == 27: # Guy wire mast 30m at 45 deg
            ax.plot([0, 0], [0, 5], 'o-', color='#38bdf8', linewidth=3.0, markerfacecolor='#fbbf24')
            ax.plot([0, 5], [0, 0], '-', color='#94a3b8', linewidth=2.0)
            ax.plot([0, 5], [5, 0], 'o--', color='#fbbf24', linewidth=2.5)
            ax.annotate('Mast = 30 m', (-0.6, 2.5), color='#38bdf8', fontsize=10, fontweight='bold', va='center', rotation=90)
            ax.annotate('45°', (4.0, 0.4), color='#f43f5e', fontsize=10, fontweight='bold')
            ax.annotate('Guy Wire = ?', (2.8, 2.8), color='#fbbf24', fontsize=10, fontweight='bold', rotation=-45)
            target_label = "Wire Length & Anchor Distance = ?"
            ax.set_xlim(-1.5, 6.5)
            ax.set_ylim(-1, 6.5)
        elif num == 28: # Solar panel tilt 30 deg 2.5m
            ax.plot([0, 5], [0, 0], '-', color='#94a3b8', linewidth=2)
            ax.plot([0, 4.33], [0, 2.5], 'o-', color='#38bdf8', linewidth=3.5, markerfacecolor='#fbbf24')
            ax.plot([4.33, 4.33], [0, 2.5], '--', color='#fbbf24', linewidth=1.5)
            ax.annotate('30°', (1.0, 0.3), color='#f43f5e', fontsize=10, fontweight='bold')
            ax.annotate('Panel Length = 2.5 m', (2.1, 1.5), color='#38bdf8', fontsize=10, fontweight='bold', rotation=30)
            target_label = "Vertical Elevation & Footprint = ?"
            ax.set_xlim(-1, 6)
            ax.set_ylim(-1, 4)
        elif num == 29: # Ship bearing N 30 E 80 nmi
            ax.plot([0, 0], [-1, 5], '--', color='#94a3b8', linewidth=1.2)
            ax.plot([-1, 5], [0, 0], '--', color='#94a3b8', linewidth=1.2)
            ax.plot([0, 2], [0, 3.46], 'o-', color='#38bdf8', linewidth=3.0, markerfacecolor='#fbbf24')
            ax.plot([2, 2], [0, 3.46], ':', color='#f43f5e', linewidth=1.5)
            ax.annotate('N', (0, 5.2), color='#94a3b8', fontsize=11, fontweight='bold', ha='center')
            ax.annotate('E', (5.2, 0), color='#94a3b8', fontsize=11, fontweight='bold', va='center')
            ax.annotate('30°', (0.3, 1.5), color='#f43f5e', fontsize=10, fontweight='bold')
            ax.annotate('80 nmi', (1.2, 1.8), color='#fbbf24', fontsize=10, fontweight='bold', rotation=60)
            target_label = "North & East Distances = ?"
            ax.set_xlim(-1.5, 6)
            ax.set_ylim(-1.5, 6)
        elif num == 30: # Airplane climb 30 deg 100km
            ax.plot([0, 6], [0, 0], '-', color='#94a3b8', linewidth=2)
            ax.plot([0, 5.2], [0, 3], 'o-', color='#38bdf8', linewidth=3.0, markerfacecolor='#fbbf24')
            ax.plot([5.2, 5.2], [0, 3], '--', color='#fbbf24', linewidth=1.5)
            ax.annotate('30°', (1.0, 0.3), color='#f43f5e', fontsize=10, fontweight='bold')
            ax.annotate('Flight Path = 100 km', (2.5, 1.8), color='#38bdf8', fontsize=10, fontweight='bold', rotation=30)
            target_label = "Altitude & Ground Distance = ?"
            ax.set_xlim(-1, 7)
            ax.set_ylim(-1, 4.5)
        else: # Q31 Traffic light cable tension
            ax.plot([-3, 0], [2, 0], 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
            ax.plot([3, 0], [2, 0], 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
            ax.plot([-3, 3], [2, 2], '--', color='#94a3b8', linewidth=1.2)
            ax.plot([0, 0], [0, -1.8], '-', color='#f43f5e', linewidth=2.5)
            ax.plot(0, -1.8, 's', color='#f43f5e', markersize=12, label='Traffic Light 500 N')
            ax.annotate('30°', (-2.2, 1.7), color='#f43f5e', fontsize=10, fontweight='bold')
            ax.annotate('30°', (1.8, 1.7), color='#f43f5e', fontsize=10, fontweight='bold')
            ax.annotate('Tension T = ?', (-1.8, 0.7), color='#fbbf24', fontsize=10, fontweight='bold', rotation=-30)
            target_label = "Cable Tension T = ?"
            ax.set_xlim(-4, 4)
            ax.set_ylim(-2.5, 3)

    # 12. 3D Shapes & Special Triangles (Q32, Q33, Q34)
    elif num in [32, 33, 34]:
        if num == 32: # Cube space diagonal
            fx = [0, 3, 3, 0, 0]
            fy = [0, 0, 3, 3, 0]
            bx = [1.2, 4.2, 4.2, 1.2, 1.2]
            by = [1.2, 1.2, 4.2, 4.2, 1.2]
            ax.plot(fx, fy, '-', color='#38bdf8', linewidth=2.0)
            ax.plot(bx, by, ':', color='#94a3b8', linewidth=1.5)
            for idx in range(4):
                ax.plot([fx[idx], bx[idx]], [fy[idx], by[idx]], '-', color='#38bdf8', linewidth=1.5)
            ax.plot([0, 4.2], [0, 4.2], 'o--', color='#f43f5e', linewidth=2.5, markerfacecolor='#fbbf24')
            ax.annotate('Edge = 10 cm', (1.5, -0.4), color='#38bdf8', fontsize=10, fontweight='bold', ha='center')
            ax.annotate('Space Diagonal d = ?', (2.2, 2.5), color='#f43f5e', fontsize=10, fontweight='bold', rotation=45)
            target_label = "Space Diagonal Length = ?"
            ax.set_xlim(-1, 5.5)
            ax.set_ylim(-1, 5.5)
        elif num == 33: # Square pyramid
            px = [0, 4, 5.2, 1.2, 0]
            py = [0, 0, 1.5, 1.5, 0]
            ax.plot(px, py, '-', color='#38bdf8', linewidth=2.0)
            top_x, top_y = 2.6, 4.5
            for idx in range(4):
                ax.plot([px[idx], top_x], [py[idx], top_y], '-', color='#38bdf8', linewidth=2.0)
            ax.plot([2.6, 2.6], [0.75, 4.5], '--', color='#f43f5e', linewidth=2.0)
            ax.annotate('Base = 12 cm', (2, -0.4), color='#38bdf8', fontsize=10, fontweight='bold', ha='center')
            ax.annotate('Lateral Edge = 12 cm', (3.8, 3.0), color='#fbbf24', fontsize=10, fontweight='bold', rotation=60)
            ax.annotate('Height h = ?', (2.8, 2.5), color='#f43f5e', fontsize=10, fontweight='bold')
            target_label = "Pyramid Height & Slant Height = ?"
            ax.set_xlim(-1, 6.5)
            ax.set_ylim(-1, 5.5)
        else: # Q34 Tetrahedron
            tx = [0, 4, 2, 0]
            ty = [0, 0, 1.2, 0]
            ax.plot(tx, ty, '-', color='#38bdf8', linewidth=2.0)
            top_x, top_y = 2.0, 4.2
            for idx in range(3):
                ax.plot([tx[idx], top_x], [ty[idx], top_y], '-', color='#38bdf8', linewidth=2.0)
            ax.plot([2.0, 2.0], [0.4, 4.2], '--', color='#f43f5e', linewidth=2.0)
            ax.annotate('Edge = 6 cm', (2, -0.4), color='#38bdf8', fontsize=10, fontweight='bold', ha='center')
            ax.annotate('Altitude h = ?', (2.2, 2.2), color='#f43f5e', fontsize=10, fontweight='bold')
            target_label = "Tetrahedron Altitude h = ?"
            ax.set_xlim(-1, 5.5)
            ax.set_ylim(-1, 5.2)

    # 13. Trigonometry & Expressions (Q35 - Q39)
    elif num in range(35, 40):
        if num == 35: # Trig 45
            tx = [0, 3.5, 0, 0]
            ty = [0, 0, 3.5, 0]
            ax.plot(tx, ty, 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
            ax.plot([0, 0.4, 0.4, 0], [0.4, 0.4, 0, 0], color='#fbbf24', linewidth=1.2)
            ax.annotate('1', (1.75, -0.5), color='#38bdf8', fontsize=11, fontweight='bold', ha='center')
            ax.annotate('1', (-0.5, 1.75), color='#38bdf8', fontsize=11, fontweight='bold', va='center')
            ax.annotate('√2', (2.0, 2.0), color='#fbbf24', fontsize=11, fontweight='bold')
            target_label = "sin 45°, cos 45°, tan 45° = ?"
            ax.set_xlim(-1, 4.8)
            ax.set_ylim(-1, 4.8)
        elif num == 36: # Trig 30 and 60
            tx = [0, 3.5*np.sqrt(3), 0, 0]
            ty = [0, 0, 3.5, 0]
            ax.plot(tx, ty, 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
            ax.plot([0, 0.4, 0.4, 0], [0.4, 0.4, 0, 0], color='#fbbf24', linewidth=1.2)
            ax.annotate('30°', (3.5*np.sqrt(3)-1.2, 0.3), color='#f43f5e', fontsize=10, fontweight='bold')
            ax.annotate('60°', (0.3, 2.6), color='#f43f5e', fontsize=10, fontweight='bold')
            ax.annotate('1', (-0.5, 1.75), color='#38bdf8', fontsize=11, fontweight='bold', va='center')
            ax.annotate('√3', (1.75*np.sqrt(3), -0.5), color='#38bdf8', fontsize=11, fontweight='bold', ha='center')
            ax.annotate('2', (2.0*np.sqrt(3), 2.0), color='#fbbf24', fontsize=11, fontweight='bold')
            target_label = "sin 30°, cos 30°, sin 60°, cos 60° = ?"
            ax.set_xlim(-1.2, 7.0)
            ax.set_ylim(-1.0, 4.8)
        else: # Q37, Q38, Q39 Trig Expressions
            ax.text(0.5, 0.65, "Special Triangle Trig Evaluation", transform=ax.transAxes, color='#fbbf24', fontsize=13, fontweight='bold', ha='center')
            if num == 37:
                expr_str = r"$(\sin 30^\circ \cdot \cos 45^\circ) + (\cos 30^\circ \cdot \sin 45^\circ) = ?"
            elif num == 38:
                expr_str = r"$\frac{\tan^2 60^\circ - 2 \sin^2 45^\circ}{\cos^2 30^\circ + \sin^2 30^\circ} = ?"
            else:
                expr_str = r"$\sin 60^\circ \cos 30^\circ - \cos 60^\circ \sin 30^\circ = ?"
            ax.text(0.5, 0.4, expr_str, transform=ax.transAxes, color='#38bdf8', fontsize=14, fontweight='bold', ha='center')
            target_label = "Exact Value = ?"
            ax.set_axis_off()

    # 14. Algebraic Equations & Misconceptions (Q40 - Q44)
    elif num in [40, 41, 42, 43, 44]:
        if num == 40: # 30-60-90 (Hyp 4x - 6, Short leg x + 5)
            tx = [0, 4*np.sqrt(3), 0, 0]
            ty = [0, 0, 4, 0]
            ax.plot(tx, ty, 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
            ax.plot([0, 0.4, 0.4, 0], [0.4, 0.4, 0, 0], color='#fbbf24', linewidth=1.2)
            ax.annotate('30°', (4*np.sqrt(3)-1.2, 0.3), color='#f43f5e', fontsize=10, fontweight='bold')
            ax.annotate('Shorter leg = x + 5', (-0.8, 2.0), color='#38bdf8', fontsize=10, fontweight='bold', va='center', rotation=90)
            ax.annotate('Hypotenuse = 4x - 6', (2.2*np.sqrt(3), 2.2), color='#fbbf24', fontsize=10, fontweight='bold')
            target_label = "Solve x & Find Longer Leg = ?"
            ax.set_xlim(-1.5, 8.0)
            ax.set_ylim(-1.2, 5.2)
        elif num == 41: # 45-45-90 (Hyp 2x + 4, Leg (x+2)√2)
            tx = [0, 4, 0, 0]
            ty = [0, 0, 4, 0]
            ax.plot(tx, ty, 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
            ax.plot([0, 0.4, 0.4, 0], [0.4, 0.4, 0, 0], color='#fbbf24', linewidth=1.2)
            ax.annotate('Leg = (x + 2)√2', (2.0, -0.5), color='#38bdf8', fontsize=10, fontweight='bold', ha='center')
            ax.annotate('Hypotenuse = 2x + 4', (2.2, 2.2), color='#fbbf24', fontsize=10, fontweight='bold')
            target_label = "Prove Leg × √2 = Hypotenuse"
            ax.set_xlim(-1.2, 5.5)
            ax.set_ylim(-1.2, 5.2)
        elif num == 42: # Sum of Shorter Leg + Hypotenuse = 36 cm
            tx = [0, 4*np.sqrt(3), 0, 0]
            ty = [0, 0, 4, 0]
            ax.plot(tx, ty, 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
            ax.annotate('30°', (4*np.sqrt(3)-1.2, 0.3), color='#f43f5e', fontsize=10, fontweight='bold')
            ax.annotate('Shorter leg x', (-0.8, 2.0), color='#38bdf8', fontsize=10, fontweight='bold', va='center', rotation=90)
            ax.annotate('Hypotenuse 2x', (2.2*np.sqrt(3), 2.2), color='#fbbf24', fontsize=10, fontweight='bold')
            ax.annotate('x + 2x = 36 cm', (2.0*np.sqrt(3), -0.6), color='#f43f5e', fontsize=10, fontweight='bold', ha='center')
            target_label = "Longer Leg y = ?"
            ax.set_xlim(-1.5, 8.0)
            ax.set_ylim(-1.2, 5.2)
        elif num == 43: # Student misconception 30-60-90 hyp = 10
            tx = [0, 4*np.sqrt(3), 0, 0]
            ty = [0, 0, 4, 0]
            ax.plot(tx, ty, 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
            ax.annotate('30°', (4*np.sqrt(3)-1.2, 0.3), color='#f43f5e', fontsize=10, fontweight='bold')
            ax.annotate('60°', (0.3, 3.2), color='#f43f5e', fontsize=10, fontweight='bold')
            ax.annotate('Hypotenuse = 10 cm', (2.2*np.sqrt(3), 2.2), color='#38bdf8', fontsize=10, fontweight='bold')
            ax.annotate('Shorter leg (opposite 30°) = ?', (-0.8, 2.0), color='#fbbf24', fontsize=10, fontweight='bold', va='center', rotation=90)
            ax.annotate('Longer leg (opposite 60°) = ?', (2*np.sqrt(3), -0.5), color='#fbbf24', fontsize=10, fontweight='bold', ha='center')
            target_label = "Correct Leg Lengths = ?"
            ax.set_xlim(-1.5, 8.0)
            ax.set_ylim(-1.2, 5.2)
        else: # Q44 Student misconception 45-45-90 leg from hyp 10
            tx = [0, 4, 0, 0]
            ty = [0, 0, 4, 0]
            ax.plot(tx, ty, 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
            ax.annotate('45°', (2.8, 0.3), color='#f43f5e', fontsize=10, fontweight='bold')
            ax.annotate('Hypotenuse h = 10', (2.2, 2.2), color='#38bdf8', fontsize=10, fontweight='bold')
            ax.annotate('Leg s = 10 / √2 = 5√2', (2.0, -0.5), color='#fbbf24', fontsize=10, fontweight='bold', ha='center')
            target_label = "Correct Leg Length s = ?"
            ax.set_xlim(-1.2, 5.5)
            ax.set_ylim(-1.2, 5.2)

    # 15. Advanced Real-World & Geometry (Q45 - Q50)
    else:
        if num == 45: # Folding stepladder (legs 2.4 m, angle 60 deg)
            ax.plot([0, 3, 6], [0, 3*np.sqrt(3), 0], 'o-', color='#38bdf8', linewidth=3.0, markerfacecolor='#fbbf24')
            ax.plot([3, 3], [0, 3*np.sqrt(3)], '--', color='#fbbf24', linewidth=1.5)
            ax.annotate('Leg = 2.4 m', (1.2, 2.8), color='#38bdf8', fontsize=10, fontweight='bold', rotation=60)
            ax.annotate('Leg = 2.4 m', (4.8, 2.8), color='#38bdf8', fontsize=10, fontweight='bold', rotation=-60)
            ax.annotate('60°', (3.0, 4.2), color='#f43f5e', fontsize=10, fontweight='bold', ha='center')
            ax.annotate('Peak Height h = ?', (3.2, 2.2), color='#fbbf24', fontsize=10, fontweight='bold')
            ax.annotate('Floor Spread = ?', (3.0, -0.5), color='#fbbf24', fontsize=10, fontweight='bold', ha='center')
            target_label = "Peak Height & Floor Spread = ?"
            ax.set_xlim(-1, 7)
            ax.set_ylim(-1, 6)
        elif num == 46: # Origami folding (square 20x20 folded along diagonal & altitude)
            # Square 20x20 folded into 45-45-90 right isosceles triangle with altitude
            tx = [0, 5, 0, 0]
            ty = [0, 0, 5, 0]
            ax.plot(tx, ty, 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
            ax.plot([0, 2.5], [0, 2.5], '--', color='#fbbf24', linewidth=2.0)
            ax.annotate('Folded Square Side = 20 cm', (2.5, -0.5), color='#38bdf8', fontsize=10, fontweight='bold', ha='center')
            ax.annotate('Altitude Fold', (1.4, 1.4), color='#f43f5e', fontsize=10, fontweight='bold', rotation=45)
            target_label = "Perimeter & Area of Smaller Triangle = ?"
            ax.set_xlim(-1, 6)
            ax.set_ylim(-1, 6)
        elif num == 47: # Diamond Kite Composite Special Triangles (Upper 45-45-90 hyp 30cm, lower 30-60-90)
            # Kite vertices: Top (0,3), Left (-3,0), Right (3,0), Bottom (0, -3*sqrt(3))
            kx = [0, 3, 0, -3, 0]
            ky = [3, 0, -3*np.sqrt(3), 0, 3]
            ax.plot(kx, ky, 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
            ax.plot([-3, 3], [0, 0], '--', color='#fbbf24', linewidth=1.5)
            ax.plot([0, 0], [3, -3*np.sqrt(3)], '--', color='#fbbf24', linewidth=1.5)
            ax.annotate('Upper Hypotenuse = 30 cm', (0, 0.4), color='#f43f5e', fontsize=10, fontweight='bold', ha='center')
            ax.annotate('Upper 45°-45°-90°', (1.5, 1.8), color='#38bdf8', fontsize=9, fontweight='bold')
            ax.annotate('Lower 30°-60°-90°', (1.5, -2.5), color='#38bdf8', fontsize=9, fontweight='bold')
            target_label = "Total Surface Area = ?"
            ax.set_xlim(-4.5, 4.5)
            ax.set_ylim(-6.0, 4.5)
        elif num == 48: # Clock Face Minute Hand Distance (radius 15 cm, 12:00 to 12:20, 120 deg angle)
            angles = np.linspace(0, 2*np.pi, 100)
            r = 3.5
            ax.plot(r*np.cos(angles), r*np.sin(angles), '-', color='#94a3b8', linewidth=2.0)
            # 12:00 -> top (0, r) = 90 deg
            # 12:20 -> 4 oclock (30 deg below positive x axis) = -30 deg or 330 deg => 120 deg central angle
            p1 = (0, r)
            p2 = (r*np.cos(-np.pi/6), r*np.sin(-np.pi/6))
            ax.plot([0, p1[0]], [0, p1[1]], 'o-', color='#38bdf8', linewidth=3.0, label='12:00 (15 cm)')
            ax.plot([0, p2[0]], [0, p2[1]], 'o-', color='#fbbf24', linewidth=3.0, label='12:20 (15 cm)')
            ax.plot([p1[0], p2[0]], [p1[1], p2[1]], 'o--', color='#f43f5e', linewidth=2.5, markerfacecolor='#f43f5e')
            ax.annotate('120°', (0.5, 0.8), color='#f43f5e', fontsize=10, fontweight='bold')
            ax.annotate('Radius = 15 cm', (-1.8, 1.8), color='#38bdf8', fontsize=9, fontweight='bold')
            ax.annotate('Straight-Line Distance d = ?', (1.8, 1.2), color='#f43f5e', fontsize=10, fontweight='bold')
            target_label = "Straight-Line Tip Distance = ?"
            ax.set_xlim(-4.5, 4.5)
            ax.set_ylim(-4.5, 4.5)
            ax.set_aspect('equal')
        elif num == 49: # CNC Milled Equilateral Pocket Coordinates (side 18 mm, top vertex on y-axis)
            # Centered at origin, top vertex at (0, R), R = s/sqrt(3) = 18/sqrt(3) = 6*sqrt(3)
            # bottom vertices at (-9, -3*sqrt(3)) and (9, -3*sqrt(3))
            R_top = 6 * np.sqrt(3)
            r_bot = 3 * np.sqrt(3)
            cx = [0, 9, -9, 0]
            cy = [R_top, -r_bot, -r_bot, R_top]
            ax.plot(cx, cy, 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
            ax.plot([0, 0], [-12, 12], '--', color='#94a3b8', linewidth=1.0)
            ax.plot([-12, 12], [0, 0], '--', color='#94a3b8', linewidth=1.0)
            ax.annotate('Side = 18 mm', (4.5, 3.5), color='#38bdf8', fontsize=10, fontweight='bold')
            ax.annotate('(0, 0)', (0.5, 0.5), color='#94a3b8', fontsize=9)
            target_label = "Vertex Coordinates = ?"
            ax.set_xlim(-13, 13)
            ax.set_ylim(-13, 13)
            ax.set_aspect('equal')
        else: # Q50 Triangular Park Central Path Length (equilateral perimeter 180 m => side 60 m)
            ex = [0, 6, 3, 0]
            ey = [0, 0, 3*np.sqrt(3), 0]
            ax.plot(ex, ey, 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
            ax.plot([3, 3], [0, 3*np.sqrt(3)], '--', color='#f43f5e', linewidth=2.5)
            ax.plot([3, 3.3, 3.3, 3], [0.3, 0.3, 0, 0], color='#fbbf24', linewidth=1.0)
            ax.annotate('Perimeter = 180 m (Side = 60 m)', (3, -0.6), color='#38bdf8', fontsize=10, fontweight='bold', ha='center')
            ax.annotate('Central Walking Path h = ?', (3.3, 2.5), color='#f43f5e', fontsize=10, fontweight='bold')
            target_label = "Central Path Length h = ?"
            ax.set_xlim(-1, 7)
            ax.set_ylim(-1.2, 6.0)

    # Adding Title and Target Label to every figure
    qid = q.get('id', f"Q{q['num']}")
    fig.suptitle(f"[{qid}] {title}", color='#f8fafc', fontsize=11, fontweight='bold', y=0.96)
    ax.set_title(f"Target: {target_label}", color='#f43f5e', fontsize=10, fontweight='bold', pad=10)
    
    plt.tight_layout()
    
    svg_filename = f"g9_t151_q{num}.svg"
    png_filename = f"g9_t151_q{num}.png"
    
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

print("Starting generation of 50 perfectly matched custom plots for Topic 151...")
for q in questions:
    create_diagram(q)
    if q['num'] % 10 == 0:
        print(f"Generated Q1 to Q{q['num']} clean plots for Topic 151.")

print("All 50 custom clean plots generated successfully for Topic 151!")
