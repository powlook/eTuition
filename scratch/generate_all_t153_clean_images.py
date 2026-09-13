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

with open('scratch/t153_50_built_questions.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

# List of question numbers that DO NOT NEED an image
no_image_nums = {1, 2, 5, 6, 7, 8, 9, 10, 11, 12, 26, 27, 28, 29, 30, 39, 40, 41, 48, 49}

# Remove existing SVG/PNG for no_image_nums across all dirs
for num in no_image_nums:
    for d in dirs:
        svg_f = os.path.join(d, f"g9_t153_q{num}.svg")
        png_f = os.path.join(d, f"g9_t153_q{num}.png")
        if os.path.exists(svg_f): os.remove(svg_f)
        if os.path.exists(png_f): os.remove(png_f)

print(f"Removed old image files for {len(no_image_nums)} non-image questions.")

def create_diagram(q):
    num = q['num']
    title = q['title']
    
    if num in no_image_nums:
        return

    fig, ax = plt.subplots(figsize=(6.5, 4.8), dpi=100)
    fig.patch.set_facecolor('#0f172a')
    ax.set_facecolor('#0f172a')
    
    ax.grid(True, color='#334155', linestyle='--', linewidth=0.7, alpha=0.6)
    for spine in ax.spines.values():
        spine.set_color('#475569')
        spine.set_linewidth(1.2)
    ax.tick_params(colors='#94a3b8', labelsize=9)
    
    # 1. Q3: Right △ABC (a=3, b=4, c=5)
    if num == 3:
        tx = [0, 4, 0, 0]
        ty = [0, 0, 3, 0]
        ax.plot(tx, ty, 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
        ax.plot([0, 0.4, 0.4, 0], [0.4, 0.4, 0, 0], color='#fbbf24', linewidth=1.2)
        ax.annotate('C (90°)', (0, 0), textcoords="offset points", xytext=(-15, -12), color='#f8fafc', fontweight='bold')
        ax.annotate('B', (4, 0), textcoords="offset points", xytext=(8, -12), color='#f8fafc', fontweight='bold')
        ax.annotate('A', (0, 3), textcoords="offset points", xytext=(-12, 8), color='#f8fafc', fontweight='bold')
        ax.annotate('Leg a = 3', (-0.8, 1.5), color='#38bdf8', fontsize=10, fontweight='bold', va='center', rotation=90)
        ax.annotate('Leg b = 4', (2.0, -0.5), color='#38bdf8', fontsize=10, fontweight='bold', ha='center')
        ax.annotate('Hypotenuse c = 5', (2.2, 1.8), color='#fbbf24', fontsize=10, fontweight='bold')
        target_label = "sin A, cos A, tan A = ?"
        ax.set_xlim(-1.5, 5.2)
        ax.set_ylim(-1.2, 4.2)

    # 2. Q4: Right △XYZ (XY=5 cm, XZ=13 cm)
    elif num == 4:
        tx = [0, 12, 0, 0]
        ty = [0, 0, 5, 0]
        ax.plot(tx, ty, 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
        ax.plot([0, 0.4, 0.4, 0], [0.4, 0.4, 0, 0], color='#fbbf24', linewidth=1.2)
        ax.annotate('Y (90°)', (0, 0), textcoords="offset points", xytext=(-15, -12), color='#f8fafc', fontweight='bold')
        ax.annotate('Z', (12, 0), textcoords="offset points", xytext=(8, -12), color='#f8fafc', fontweight='bold')
        ax.annotate('X', (0, 5), textcoords="offset points", xytext=(-12, 8), color='#f8fafc', fontweight='bold')
        ax.annotate('XY = 5 cm', (-0.8, 2.5), color='#38bdf8', fontsize=10, fontweight='bold', va='center', rotation=90)
        ax.annotate('Leg YZ = ?', (6.0, -0.5), color='#fbbf24', fontsize=10, fontweight='bold', ha='center')
        ax.annotate('XZ = 13 cm', (6.2, 2.8), color='#38bdf8', fontsize=10, fontweight='bold')
        target_label = "Leg YZ & Trig Ratios = ?"
        ax.set_xlim(-1.8, 13.5)
        ax.set_ylim(-1.2, 6.2)

    # 3. Q13: Angle of Elevation Diagram
    elif num == 13:
        ax.plot([0, 6], [0, 0], '-', color='#94a3b8', linewidth=2.0)
        ax.plot([0, 6], [0, 3.5], 'o--', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
        ax.plot([6, 6], [0, 3.5], ':', color='#f43f5e', linewidth=1.5)
        ax.annotate('Observer Eye', (0, 0), textcoords="offset points", xytext=(-15, -15), color='#f8fafc', fontweight='bold')
        ax.annotate('Target Object', (6, 3.5), textcoords="offset points", xytext=(8, 5), color='#f8fafc', fontweight='bold')
        ax.annotate('Horizontal Line of Sight', (3, -0.5), color='#94a3b8', fontsize=9, ha='center')
        ax.annotate('Line of Sight', (2.8, 2.0), color='#38bdf8', fontsize=10, fontweight='bold', rotation=30)
        ax.annotate('Angle of Elevation θ', (1.5, 0.4), color='#f43f5e', fontsize=10, fontweight='bold')
        target_label = "Angle of Elevation Definition & Sketch"
        ax.set_xlim(-1, 8.0)
        ax.set_ylim(-1, 4.5)

    # 4. Q14: Angle of Depression Diagram
    elif num == 14:
        # Observer at top (0, 4), horizontal line to (6, 4)
        ax.plot([0, 6], [4, 4], '--', color='#94a3b8', linewidth=2.0)
        ax.plot([0, 6], [0, 0], '-', color='#94a3b8', linewidth=1.5)
        ax.plot([0, 6], [4, 0], 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
        ax.annotate('Observer Eye (Top)', (0, 4), textcoords="offset points", xytext=(-15, 8), color='#f8fafc', fontweight='bold')
        ax.annotate('Target (Bottom)', (6, 0), textcoords="offset points", xytext=(8, -12), color='#f8fafc', fontweight='bold')
        ax.annotate('Horizontal Line', (3, 4.3), color='#94a3b8', fontsize=9, ha='center')
        ax.annotate('Angle of Depression θ', (1.5, 3.5), color='#f43f5e', fontsize=10, fontweight='bold')
        ax.annotate('Angle of Elevation θ', (4.5, 0.4), color='#f43f5e', fontsize=10, fontweight='bold')
        target_label = "Angle of Depression θ = Angle of Elevation θ"
        ax.set_xlim(-1, 8)
        ax.set_ylim(-1, 5.2)

    # 5. Q15: Cell tower height (distance 25m, angle 48 deg)
    elif num == 15:
        ax.plot([0, 5], [0, 0], '-', color='#94a3b8', linewidth=2.0)
        ax.plot([5, 5], [0, 5.55], '-', color='#38bdf8', linewidth=3.0)
        ax.plot([0, 5], [0, 5.55], 'o--', color='#fbbf24', linewidth=2.0)
        ax.annotate('Distance = 25 m', (2.5, -0.5), color='#38bdf8', fontsize=10, fontweight='bold', ha='center')
        ax.annotate('Tower Height h = ?', (5.3, 2.7), color='#f43f5e', fontsize=10, fontweight='bold', va='center')
        ax.annotate('48°', (1.0, 0.3), color='#f43f5e', fontsize=10, fontweight='bold')
        target_label = "Tower Height h = 25 × tan(48°) = ?"
        ax.set_xlim(-1, 7.5)
        ax.set_ylim(-1, 6.8)

    # 6. Q16: Lighthouse cliff (height 40m, depression 22 deg)
    elif num == 16:
        ax.plot([0, 0], [0, 4], '-', color='#94a3b8', linewidth=3.0) # Cliff
        ax.plot([0, 8], [0, 0], '-', color='#38bdf8', linewidth=2.0) # Water
        ax.plot([0, 8], [4, 4], '--', color='#94a3b8', linewidth=1.2)
        ax.plot([0, 8], [4, 0], 'o--', color='#fbbf24', linewidth=2.0, markerfacecolor='#f43f5e')
        ax.annotate('Cliff = 40 m', (-0.6, 2.0), color='#38bdf8', fontsize=10, fontweight='bold', va='center', rotation=90)
        ax.annotate('Boat', (8, 0), textcoords="offset points", xytext=(5, -12), color='#f8fafc', fontweight='bold')
        ax.annotate('22°', (1.5, 3.6), color='#f43f5e', fontsize=10, fontweight='bold')
        ax.annotate('Boat Distance d = ?', (4, -0.6), color='#f43f5e', fontsize=10, fontweight='bold', ha='center')
        target_label = "Boat Distance d = 40 / tan(22°) = ?"
        ax.set_xlim(-1.5, 9.5)
        ax.set_ylim(-1.2, 5.2)

    # 7. Q17: Ladder 6m at 72 deg
    elif num == 17:
        ax.plot([0, 4], [0, 0], '-', color='#94a3b8', linewidth=2.0)
        ax.plot([0, 0], [0, 5], '-', color='#94a3b8', linewidth=2.0)
        ax.plot([2, 0], [0, 4.7], 'o-', color='#38bdf8', linewidth=3.0, markerfacecolor='#fbbf24')
        ax.annotate('Ladder = 6 m', (1.3, 2.5), color='#fbbf24', fontsize=10, fontweight='bold', rotation=-65)
        ax.annotate('72°', (1.4, 0.3), color='#f43f5e', fontsize=10, fontweight='bold')
        ax.annotate('Height h = ?', (-0.8, 2.3), color='#f43f5e', fontsize=10, fontweight='bold', va='center', rotation=90)
        target_label = "Height up wall h = 6 × sin(72°) = ?"
        ax.set_xlim(-1.5, 5)
        ax.set_ylim(-1, 6)

    # 8. Q18: Kite string 80m at 52 deg
    elif num == 18:
        ax.plot([0, 5], [0, 0], '-', color='#94a3b8', linewidth=2.0)
        ax.plot([0, 4.5], [0, 5.76], 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
        ax.plot([4.5, 4.5], [0, 5.76], '--', color='#f43f5e', linewidth=1.5)
        ax.annotate('String = 80 m', (2.0, 3.0), color='#38bdf8', fontsize=10, fontweight='bold', rotation=52)
        ax.annotate('52°', (1.0, 0.3), color='#f43f5e', fontsize=10, fontweight='bold')
        ax.annotate('Altitude h = ?', (4.7, 2.8), color='#f43f5e', fontsize=10, fontweight='bold', va='center')
        target_label = "Kite Altitude h = 80 × sin(52°) = ?"
        ax.set_xlim(-1, 6.5)
        ax.set_ylim(-1, 7.0)

    # 9. Q19: Airplane climb 12 deg for 5 km
    elif num == 19:
        ax.plot([0, 6], [0, 0], '-', color='#94a3b8', linewidth=2.0)
        ax.plot([0, 5.87], [0, 1.25], 'o-', color='#38bdf8', linewidth=3.0, markerfacecolor='#fbbf24')
        ax.plot([5.87, 5.87], [0, 1.25], '--', color='#f43f5e', linewidth=1.5)
        ax.annotate('Flight Path = 5 km', (2.8, 0.9), color='#38bdf8', fontsize=10, fontweight='bold', rotation=12)
        ax.annotate('12°', (1.0, 0.2), color='#f43f5e', fontsize=10, fontweight='bold')
        ax.annotate('Ground Distance = ?', (2.9, -0.5), color='#fbbf24', fontsize=10, fontweight='bold', ha='center')
        target_label = "Ground Distance d = 5 × cos(12°) = ?"
        ax.set_xlim(-1, 7)
        ax.set_ylim(-1, 3)

    # 10. Q20: Solve right △ABC (C=90°, A=36°, c=15 cm)
    elif num == 20:
        tx = [0, 5, 0, 0]
        ty = [0, 0, 3.63, 0]
        ax.plot(tx, ty, 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
        ax.plot([0, 0.4, 0.4, 0], [0.4, 0.4, 0, 0], color='#fbbf24', linewidth=1.2)
        ax.annotate('C (90°)', (0, 0), textcoords="offset points", xytext=(-15, -12), color='#f8fafc', fontweight='bold')
        ax.annotate('B', (5, 0), textcoords="offset points", xytext=(8, -12), color='#f8fafc', fontweight='bold')
        ax.annotate('A (36°)', (0, 3.63), textcoords="offset points", xytext=(-12, 8), color='#f8fafc', fontweight='bold')
        ax.annotate('Hypotenuse c = 15 cm', (2.8, 2.0), color='#38bdf8', fontsize=10, fontweight='bold', rotation=-36)
        target_label = "Find Legs a, b & Angle B = ?"
        ax.set_xlim(-1.5, 6.2)
        ax.set_ylim(-1.2, 4.8)

    # 11. Q21: Solve right △ABC (C=90°, a=8 cm, b=15 cm)
    elif num == 21:
        tx = [0, 5, 0, 0]
        ty = [0, 0, 2.66, 0]
        ax.plot(tx, ty, 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
        ax.plot([0, 0.4, 0.4, 0], [0.4, 0.4, 0, 0], color='#fbbf24', linewidth=1.2)
        ax.annotate('Leg a = 8 cm', (-0.8, 1.33), color='#38bdf8', fontsize=10, fontweight='bold', va='center', rotation=90)
        ax.annotate('Leg b = 15 cm', (2.5, -0.5), color='#38bdf8', fontsize=10, fontweight='bold', ha='center')
        ax.annotate('Hypotenuse c = ?', (2.8, 1.5), color='#fbbf24', fontsize=10, fontweight='bold')
        target_label = "Hypotenuse c & Angles A, B = ?"
        ax.set_xlim(-1.5, 6.2)
        ax.set_ylim(-1.2, 4.0)

    # 12. Q22: Tower 80m, angles of depression 28 deg & 42 deg
    elif num == 22:
        ax.plot([0, 0], [0, 4], '-', color='#94a3b8', linewidth=3.0) # Tower
        ax.plot([0, 8], [0, 0], '-', color='#94a3b8', linewidth=2.0) # Ground
        ax.plot([0, 4.44], [4, 0], 'o--', color='#38bdf8', linewidth=2.0, label='Car 2 (42°)')
        ax.plot([0, 7.52], [4, 0], 'o--', color='#f43f5e', linewidth=2.0, label='Car 1 (28°)')
        ax.annotate('Tower = 80 m', (-0.6, 2.0), color='#38bdf8', fontsize=10, fontweight='bold', va='center', rotation=90)
        ax.annotate('Car 2', (4.44, 0), textcoords="offset points", xytext=(0, -12), color='#f8fafc', fontweight='bold', ha='center')
        ax.annotate('Car 1', (7.52, 0), textcoords="offset points", xytext=(0, -12), color='#f8fafc', fontweight='bold', ha='center')
        ax.annotate('Distance d = ?', (6.0, 0.4), color='#f43f5e', fontsize=10, fontweight='bold')
        target_label = "Distance between Cars d = ?"
        ax.set_xlim(-1.5, 9.0)
        ax.set_ylim(-1.2, 5.2)

    # 13. Q23: Surveyor distance d, angle 35 deg
    elif num == 23:
        ax.plot([0, 5], [0, 0], '-', color='#94a3b8', linewidth=2.0)
        ax.plot([5, 5], [0, 3.5], '-', color='#38bdf8', linewidth=3.0)
        ax.plot([0, 5], [0, 3.5], 'o--', color='#fbbf24', linewidth=2.0)
        ax.annotate('Surveyor Distance d', (2.5, -0.5), color='#38bdf8', fontsize=10, fontweight='bold', ha='center')
        ax.annotate('Building Height h', (5.3, 1.75), color='#f43f5e', fontsize=10, fontweight='bold', va='center', rotation=-90)
        ax.annotate('35°', (1.0, 0.3), color='#f43f5e', fontsize=10, fontweight='bold')
        target_label = "Building Height h = d × tan(35°) = ?"
        ax.set_xlim(-1, 7)
        ax.set_ylim(-1, 4.5)

    # 14. Q24: Wheelchair ramp incline 4.8 deg, rise 1.2m
    elif num == 24:
        ax.plot([0, 6], [0, 0], '-', color='#94a3b8', linewidth=2.0)
        ax.plot([6, 6], [0, 1.8], '-', color='#94a3b8', linewidth=2.0)
        ax.plot([0, 6], [0, 1.8], 'o-', color='#38bdf8', linewidth=3.0, markerfacecolor='#fbbf24')
        ax.annotate('Rise = 1.2 m', (6.2, 0.9), color='#38bdf8', fontsize=10, fontweight='bold', va='center')
        ax.annotate('4.8°', (1.0, 0.2), color='#f43f5e', fontsize=10, fontweight='bold')
        ax.annotate('Ramp Surface Length L = ?', (3.0, 1.2), color='#fbbf24', fontsize=10, fontweight='bold', rotation=16)
        target_label = "Ramp Length L = 1.2 / sin(4.8°) = ?"
        ax.set_xlim(-1, 8)
        ax.set_ylim(-1, 3.2)

    # 15. Q25: Tourist viewing 45m monument, eye level 1.6m, angle 28 deg
    elif num == 25:
        ax.plot([0, 6], [0, 0], '-', color='#94a3b8', linewidth=2.0)
        ax.plot([0, 0], [0, 1.0], '-', color='#f8fafc', linewidth=2.0) # Tourist
        ax.plot([6, 6], [0, 4.5], '-', color='#38bdf8', linewidth=3.0) # Monument
        ax.plot([0, 6], [1.0, 1.0], '--', color='#94a3b8', linewidth=1.2)
        ax.plot([0, 6], [1.0, 4.5], 'o--', color='#fbbf24', linewidth=2.0)
        ax.annotate('Eye 1.6m', (-0.6, 1.0), color='#f8fafc', fontsize=9)
        ax.annotate('Monument = 45 m', (6.2, 2.25), color='#38bdf8', fontsize=10, fontweight='bold', va='center', rotation=-90)
        ax.annotate('28°', (1.2, 1.3), color='#f43f5e', fontsize=10, fontweight='bold')
        ax.annotate('Distance d = ?', (3.0, -0.5), color='#f43f5e', fontsize=10, fontweight='bold', ha='center')
        target_label = "Distance d = (45 - 1.6) / tan(28°) = ?"
        ax.set_xlim(-1.5, 8.5)
        ax.set_ylim(-1, 5.5)

    # 16. Q31: Ship bearing 140 deg for 50 nmi
    elif num == 31:
        ax.plot([0, 0], [-5, 2], '--', color='#94a3b8', linewidth=1.2) # N-S
        ax.plot([-2, 5], [0, 0], '--', color='#94a3b8', linewidth=1.2) # E-W
        # 140 deg from N -> 50 deg below E axis => (50*cos(50), -50*sin(50)) = (3.21, -3.83)
        ax.plot([0, 3.21], [0, -3.83], 'o-', color='#38bdf8', linewidth=3.0, markerfacecolor='#fbbf24')
        ax.plot([3.21, 3.21], [0, -3.83], ':', color='#f43f5e', linewidth=1.5)
        ax.annotate('N', (0, 2.2), color='#94a3b8', fontsize=10, fontweight='bold', ha='center')
        ax.annotate('S', (0, -5.4), color='#94a3b8', fontsize=10, fontweight='bold', ha='center')
        ax.annotate('E', (5.2, 0), color='#94a3b8', fontsize=10, fontweight='bold', va='center')
        ax.annotate('50 nmi', (1.8, -1.8), color='#fbbf24', fontsize=10, fontweight='bold', rotation=-50)
        ax.annotate('140° Bearing', (0.3, 0.5), color='#f43f5e', fontsize=10, fontweight='bold')
        target_label = "South & East Distance Components = ?"
        ax.set_xlim(-3, 6)
        ax.set_ylim(-6, 3)

    # 17. Q32: Zip-line cable between trees (24m and 10m, distance 35m)
    elif num == 32:
        ax.plot([0, 6], [0, 0], '-', color='#94a3b8', linewidth=2.0)
        ax.plot([0, 0], [0, 4.8], '-', color='#38bdf8', linewidth=3.5, label='Tree A 24m')
        ax.plot([6, 6], [0, 2.0], '-', color='#38bdf8', linewidth=2.5, label='Tree B 10m')
        ax.plot([0, 6], [4.8, 2.0], 'o-', color='#fbbf24', linewidth=3.0, markerfacecolor='#f43f5e')
        ax.plot([0, 6], [2.0, 2.0], '--', color='#94a3b8', linewidth=1.2)
        ax.annotate('Tree A = 24m', (-0.6, 2.4), color='#38bdf8', fontsize=9, va='center', rotation=90)
        ax.annotate('Tree B = 10m', (6.2, 1.0), color='#38bdf8', fontsize=9, va='center', rotation=-90)
        ax.annotate('Distance = 35 m', (3, -0.5), color='#38bdf8', fontsize=10, fontweight='bold', ha='center')
        ax.annotate('Cable Length & Slope Angle = ?', (3, 3.7), color='#f43f5e', fontsize=10, fontweight='bold', ha='center')
        target_label = "Cable Length L & Slope Angle θ = ?"
        ax.set_xlim(-1.5, 7.5)
        ax.set_ylim(-1, 5.8)

    # 18. Q33: Tracking stations for hot air balloon (angles 38 deg & 54 deg)
    elif num == 33:
        ax.plot([0, 7], [0, 0], '-', color='#94a3b8', linewidth=2.0)
        ax.plot([0, 4], [0, 4.5], 'o--', color='#38bdf8', linewidth=2.0)
        ax.plot([7, 4], [0, 4.5], 'o--', color='#fbbf24', linewidth=2.0)
        ax.plot([4, 4], [0, 4.5], ':', color='#f43f5e', linewidth=2.0)
        ax.annotate('Station 1', (0, 0), textcoords="offset points", xytext=(-15, -12), color='#f8fafc', fontweight='bold')
        ax.annotate('Station 2', (7, 0), textcoords="offset points", xytext=(8, -12), color='#f8fafc', fontweight='bold')
        ax.annotate('Balloon', (4, 4.5), textcoords="offset points", xytext=(0, 8), color='#f8fafc', fontweight='bold', ha='center')
        ax.annotate('Altitude h = ?', (4.2, 2.25), color='#f43f5e', fontsize=10, fontweight='bold')
        target_label = "Hot Air Balloon Altitude h = ?"
        ax.set_xlim(-1.5, 8.5)
        ax.set_ylim(-1.2, 5.8)

    # 19. Q34: 12m Flagpole on top of building
    elif num == 34:
        ax.plot([0, 6], [0, 0], '-', color='#94a3b8', linewidth=2.0)
        ax.plot([6, 6], [0, 3.5], '-', color='#38bdf8', linewidth=4.0, label='Building')
        ax.plot([6, 6], [3.5, 5.0], '-', color='#fbbf24', linewidth=2.5, label='Flagpole 12m')
        ax.plot([0, 6], [0, 3.5], '--', color='#38bdf8', linewidth=1.5)
        ax.plot([0, 6], [0, 5.0], '--', color='#fbbf24', linewidth=1.5)
        ax.annotate('Building h = ?', (6.2, 1.75), color='#38bdf8', fontsize=10, fontweight='bold', va='center')
        ax.annotate('Flagpole 12m', (6.2, 4.25), color='#fbbf24', fontsize=10, fontweight='bold', va='center')
        target_label = "Building Height h = ?"
        ax.set_xlim(-1, 8.5)
        ax.set_ylim(-1, 6.0)

    # 20. Q35: Isosceles triangle base 16 cm, base angles 50 deg
    elif num == 35:
        ax.plot([0, 6, 3, 0], [0, 0, 3*np.tan(np.radians(50)), 0], 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
        ax.annotate('Base = 16 cm', (3, -0.5), color='#38bdf8', fontsize=10, fontweight='bold', ha='center')
        ax.annotate('50°', (0.6, 0.3), color='#f43f5e', fontsize=10, fontweight='bold')
        ax.annotate('50°', (4.8, 0.3), color='#f43f5e', fontsize=10, fontweight='bold')
        ax.annotate('Leg s = ?', (1.2, 2.0), color='#fbbf24', fontsize=10, fontweight='bold', rotation=50)
        target_label = "Perimeter of Isosceles Triangle = ?"
        ax.set_xlim(-1, 7)
        ax.set_ylim(-1, 4.5)

    # 21. Q36: Isosceles triangle legs 12 cm, vertex angle 40 deg
    elif num == 36:
        ax.plot([0, 4, 2, 0], [0, 0, 5.0, 0], 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
        ax.annotate('Leg = 12 cm', (0.8, 2.5), color='#38bdf8', fontsize=10, fontweight='bold', rotation=68)
        ax.annotate('Leg = 12 cm', (3.2, 2.5), color='#38bdf8', fontsize=10, fontweight='bold', rotation=-68)
        ax.annotate('Vertex Angle 40°', (2.0, 5.3), color='#f43f5e', fontsize=10, fontweight='bold', ha='center')
        target_label = "Isosceles Triangle Area = ?"
        ax.set_xlim(-1, 5)
        ax.set_ylim(-1, 6.2)

    # 22. Q37: Regular pentagon inscribed in circle radius 10 cm
    elif num == 37:
        angles = np.linspace(np.pi/2, 2.5*np.pi, 6)
        r = 4.0
        px = r * np.cos(angles)
        py = r * np.sin(angles)
        circle_angles = np.linspace(0, 2*np.pi, 100)
        ax.plot(r*np.cos(circle_angles), r*np.sin(circle_angles), ':', color='#94a3b8', linewidth=1.5)
        ax.plot(px, py, 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
        ax.plot([0, px[0]], [0, py[0]], '--', color='#f43f5e', linewidth=1.5)
        ax.annotate('Radius R = 10 cm', (0.2, 2.0), color='#f43f5e', fontsize=10, fontweight='bold')
        target_label = "Pentagon Side Length & Perimeter = ?"
        ax.set_xlim(-5, 5)
        ax.set_ylim(-5, 5)
        ax.set_aspect('equal')

    # 23. Q38: Camera tripod height 1.5m, distance 12m, stage banner 3.5m
    elif num == 38:
        ax.plot([0, 6], [0, 0], '-', color='#94a3b8', linewidth=2.0)
        ax.plot([0, 0], [0, 1.2], '-', color='#f8fafc', linewidth=2.0, label='Camera Tripod 1.5m')
        ax.plot([6, 6], [0, 2.8], '-', color='#38bdf8', linewidth=4.0, label='Stage Banner 3.5m')
        ax.plot([0, 6], [1.2, 1.2], '--', color='#94a3b8', linewidth=1.2)
        ax.plot([0, 6], [1.2, 2.8], 'o--', color='#fbbf24', linewidth=2.0)
        ax.annotate('Tripod 1.5m', (-0.6, 0.6), color='#f8fafc', fontsize=9, va='center', rotation=90)
        ax.annotate('Banner 3.5m', (6.2, 1.4), color='#38bdf8', fontsize=10, fontweight='bold', va='center', rotation=-90)
        ax.annotate('Distance = 12 m', (3, -0.5), color='#38bdf8', fontsize=10, fontweight='bold', ha='center')
        target_label = "Camera Tilt Angles to Top/Bottom of Banner = ?"
        ax.set_xlim(-1.5, 8.5)
        ax.set_ylim(-1, 4.0)

    # 24. Q42: Submarine dives at 15 deg for 10 km
    elif num == 42:
        ax.plot([0, 7], [0, 0], '-', color='#38bdf8', linewidth=2.0) # Ocean Surface
        ax.plot([0, 6.75], [0, -1.81], 'o-', color='#fbbf24', linewidth=3.0, markerfacecolor='#f43f5e')
        ax.plot([6.75, 6.75], [0, -1.81], '--', color='#f43f5e', linewidth=1.5)
        ax.annotate('Ocean Surface', (3.5, 0.3), color='#38bdf8', fontsize=9, ha='center')
        ax.annotate('Dive Path = 10 km', (3.3, -1.2), color='#fbbf24', fontsize=10, fontweight='bold', rotation=-15)
        ax.annotate('15°', (1.2, -0.3), color='#f43f5e', fontsize=10, fontweight='bold')
        ax.annotate('Vertical Depth d = ?', (7.0, -0.9), color='#f43f5e', fontsize=10, fontweight='bold', va='center')
        target_label = "Vertical Depth d = 10 × sin(15°) = ?"
        ax.set_xlim(-1, 8.5)
        ax.set_ylim(-3, 1.5)

    # 25. Q43: Forest ranger 35m watchtower, depression angle 6 deg
    elif num == 43:
        ax.plot([0, 0], [0, 4], '-', color='#94a3b8', linewidth=3.0) # Tower
        ax.plot([0, 8], [0, 0], '-', color='#94a3b8', linewidth=2.0) # Ground
        ax.plot([0, 8], [4, 4], '--', color='#94a3b8', linewidth=1.2)
        ax.plot([0, 8], [4, 0], 'o--', color='#fbbf24', linewidth=2.0, markerfacecolor='#f43f5e')
        ax.annotate('Tower = 35 m', (-0.6, 2.0), color='#38bdf8', fontsize=10, fontweight='bold', va='center', rotation=90)
        ax.annotate('Smoke Column', (8, 0), textcoords="offset points", xytext=(5, -12), color='#f8fafc', fontweight='bold')
        ax.annotate('6°', (1.5, 3.6), color='#f43f5e', fontsize=10, fontweight='bold')
        ax.annotate('Ground Distance d = ?', (4, -0.6), color='#f43f5e', fontsize=10, fontweight='bold', ha='center')
        target_label = "Ground Distance d = 35 / tan(6°) = ?"
        ax.set_xlim(-1.5, 9.5)
        ax.set_ylim(-1.2, 5.2)

    # 26. Q44: Highway ascends 150m over 2500m pavement
    elif num == 44:
        ax.plot([0, 6], [0, 0], '-', color='#94a3b8', linewidth=2.0)
        ax.plot([0, 6], [0, 1.5], 'o-', color='#38bdf8', linewidth=3.5, markerfacecolor='#fbbf24')
        ax.plot([6, 6], [0, 1.5], '--', color='#f43f5e', linewidth=1.5)
        ax.annotate('Pavement = 2500 m', (3, 1.0), color='#38bdf8', fontsize=10, fontweight='bold', rotation=14)
        ax.annotate('Rise = 150 m', (6.2, 0.75), color='#f43f5e', fontsize=10, fontweight='bold', va='center')
        ax.annotate('Incline Angle θ = ?', (1.2, 0.2), color='#f43f5e', fontsize=10, fontweight='bold')
        target_label = "Incline Angle θ = arcsin(150 / 2500) = ?"
        ax.set_xlim(-1, 8)
        ax.set_ylim(-1, 3)

    # 27. Q45: Right △ABC (C=90°, tan A = 3)
    elif num == 45:
        tx = [0, 1.8, 0, 0]
        ty = [0, 0, 5.4, 0]
        ax.plot(tx, ty, 'o-', color='#38bdf8', linewidth=2.5, markerfacecolor='#fbbf24')
        ax.plot([0, 0.3, 0.3, 0], [0.3, 0.3, 0, 0], color='#fbbf24', linewidth=1.2)
        ax.annotate('C (90°)', (0, 0), textcoords="offset points", xytext=(-15, -12), color='#f8fafc', fontweight='bold')
        ax.annotate('B', (1.8, 0), textcoords="offset points", xytext=(8, -12), color='#f8fafc', fontweight='bold')
        ax.annotate('A', (0, 5.4), textcoords="offset points", xytext=(-12, 8), color='#f8fafc', fontweight='bold')
        ax.annotate('Opposite a = 3k', (1.0, -0.5), color='#38bdf8', fontsize=10, fontweight='bold', ha='center')
        ax.annotate('Adjacent b = 1k', (-0.8, 2.7), color='#38bdf8', fontsize=10, fontweight='bold', va='center', rotation=90)
        target_label = "Angles A, B & sin A, cos A = ?"
        ax.set_xlim(-1.2, 3.2)
        ax.set_ylim(-1.2, 6.5)

    # 28. Q46: Satellite tracking rocket at 64 deg elevation, range 120 km
    elif num == 46:
        ax.plot([0, 5], [0, 0], '-', color='#94a3b8', linewidth=2.0)
        ax.plot([0, 2.63], [0, 5.39], 'o-', color='#38bdf8', linewidth=3.0, markerfacecolor='#fbbf24')
        ax.plot([2.63, 2.63], [0, 5.39], '--', color='#f43f5e', linewidth=1.5)
        ax.annotate('Slant Range = 120 km', (1.1, 3.0), color='#38bdf8', fontsize=10, fontweight='bold', rotation=64)
        ax.annotate('64°', (0.8, 0.4), color='#f43f5e', fontsize=10, fontweight='bold')
        ax.annotate('Rocket Altitude h = ?', (2.8, 2.7), color='#f43f5e', fontsize=10, fontweight='bold', va='center')
        target_label = "Rocket Altitude h = 120 × sin(64°) = ?"
        ax.set_xlim(-1, 5.5)
        ax.set_ylim(-1, 6.5)

    # 29. Q47: Pedestrian overpass stairs at 32 deg slope, rise 6m
    elif num == 47:
        ax.plot([0, 6], [0, 0], '-', color='#94a3b8', linewidth=2.0)
        ax.plot([6, 6], [0, 3.75], '-', color='#94a3b8', linewidth=2.0)
        ax.plot([0, 6], [0, 3.75], 'o-', color='#38bdf8', linewidth=3.0, markerfacecolor='#fbbf24')
        ax.annotate('Rise = 6 m', (6.2, 1.87), color='#38bdf8', fontsize=10, fontweight='bold', va='center')
        ax.annotate('32°', (1.0, 0.3), color='#f43f5e', fontsize=10, fontweight='bold')
        ax.annotate('Staircase Length L = ?', (3.0, 2.2), color='#fbbf24', fontsize=10, fontweight='bold', rotation=32)
        target_label = "Staircase Length L = 6 / sin(32°) = ?"
        ax.set_xlim(-1, 8)
        ax.set_ylim(-1, 4.8)

    # 30. Q50: Suspension bridge cable between 75m towers spaced 300m
    elif num == 50:
        # Towers at x = -4, x = 4, height 4, cable dipping to (0, 0.8)
        cx = np.linspace(-4, 4, 100)
        cy = 0.2*cx**2 + 0.8
        ax.plot([-4, -4], [0, 4], '-', color='#38bdf8', linewidth=3.5, label='Tower A 75m')
        ax.plot([4, 4], [0, 4], '-', color='#38bdf8', linewidth=3.5, label='Tower B 75m')
        ax.plot([-5, 5], [0, 0], '-', color='#94a3b8', linewidth=2.0, label='Roadway')
        ax.plot(cx, cy, '-', color='#fbbf24', linewidth=2.5)
        ax.annotate('Tower A (75m)', (-4, 4.2), color='#38bdf8', fontsize=9, fontweight='bold', ha='center')
        ax.annotate('Tower B (75m)', (4, 4.2), color='#38bdf8', fontsize=9, fontweight='bold', ha='center')
        ax.annotate('Span = 300 m', (0, -0.5), color='#94a3b8', fontsize=10, fontweight='bold', ha='center')
        target_label = "Bridge Cable Angle at Tower & Total Length = ?"
        ax.set_xlim(-6, 6)
        ax.set_ylim(-1, 5.2)

    # Adding Title and Target Label
    qid = q.get('id', f"Q{q['num']}")
    fig.suptitle(f"[{qid}] {title}", color='#f8fafc', fontsize=11, fontweight='bold', y=0.96)
    ax.set_title(f"Target: {target_label}", color='#f43f5e', fontsize=10, fontweight='bold', pad=10)
    
    plt.tight_layout()
    
    svg_filename = f"g9_t153_q{num}.svg"
    png_filename = f"g9_t153_q{num}.png"
    
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

print("Starting generation of custom clean plots for Topic 153...")
generated_count = 0
for q in questions:
    if q['num'] not in no_image_nums:
        create_diagram(q)
        generated_count += 1

print(f"Successfully generated {generated_count} clean custom plots for Topic 153!")
