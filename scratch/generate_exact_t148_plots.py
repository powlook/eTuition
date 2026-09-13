import os
import json
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np

os.makedirs('public/images', exist_ok=True)
os.makedirs('QBank/public/images', exist_ok=True)

with open('scratch/t148_50_perfect_built.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

# Dark theme colors matching eTuition aesthetic
BG_COLOR = '#0F172A'
TEXT_COLOR = '#F8FAFC'
LINE_COLOR1 = '#38BDF8' # Sky blue
LINE_COLOR2 = '#34D399' # Emerald green
LINE_COLOR3 = '#F59E0B' # Amber
LINE_COLOR4 = '#F43F5E' # Rose

def save_fig(fig, filename_base):
    for dir_path in ['public/images', 'QBank/public/images']:
        png_path = os.path.join(dir_path, f"{filename_base}.png")
        svg_path = os.path.join(dir_path, f"{filename_base}.svg")
        fig.savefig(png_path, format='png', bbox_inches='tight', facecolor=BG_COLOR, dpi=150)
        fig.savefig(svg_path, format='svg', bbox_inches='tight', facecolor=BG_COLOR)
    plt.close(fig)

for idx, q in enumerate(questions, 1):
    if q.get('show_image') == 0:
        continue

    fig, ax = plt.subplots(figsize=(6, 4), facecolor=BG_COLOR)
    ax.set_facecolor(BG_COLOR)
    ax.axis('off')

    title_text = f"Congruence of Triangles • #{idx}"
    ax.text(0.5, 0.92, title_text, color='#94A3B8', fontsize=10, ha='center', va='center', fontweight='bold')

    # Draw specific diagram based on question index
    if idx == 1:
        # Define Congruent Triangles: Two identical triangles ABC and DEF
        ax.plot([0.1, 0.4, 0.25, 0.1], [0.2, 0.2, 0.7, 0.2], color=LINE_COLOR1, lw=2.5)
        ax.text(0.1, 0.14, 'A', color=TEXT_COLOR, fontsize=11, ha='right')
        ax.text(0.4, 0.14, 'B', color=TEXT_COLOR, fontsize=11, ha='left')
        ax.text(0.25, 0.75, 'C', color=TEXT_COLOR, fontsize=11, ha='center')

        ax.plot([0.6, 0.9, 0.75, 0.6], [0.2, 0.2, 0.7, 0.2], color=LINE_COLOR2, lw=2.5)
        ax.text(0.6, 0.14, 'D', color=TEXT_COLOR, fontsize=11, ha='right')
        ax.text(0.9, 0.14, 'E', color=TEXT_COLOR, fontsize=11, ha='left')
        ax.text(0.75, 0.75, 'F', color=TEXT_COLOR, fontsize=11, ha='center')

        ax.text(0.5, 0.45, '≅', color=LINE_COLOR3, fontsize=24, ha='center', va='center')
        ax.text(0.5, 0.08, '△ABC ≅ △DEF', color=LINE_COLOR3, fontsize=11, ha='center', fontweight='bold')

    elif idx == 2:
        # CPCTC diagram
        ax.plot([0.1, 0.4, 0.25, 0.1], [0.2, 0.2, 0.7, 0.2], color=LINE_COLOR1, lw=2.5)
        ax.plot([0.6, 0.9, 0.75, 0.6], [0.2, 0.2, 0.7, 0.2], color=LINE_COLOR2, lw=2.5)
        ax.text(0.5, 0.45, '≅', color=LINE_COLOR3, fontsize=24, ha='center', va='center')
        ax.text(0.5, 0.08, 'CPCTC: Corresponding Parts are Congruent', color=LINE_COLOR3, fontsize=10, ha='center', fontweight='bold')

    elif idx == 3:
        # SSS Congruence
        ax.plot([0.1, 0.4, 0.25, 0.1], [0.2, 0.2, 0.7, 0.2], color=LINE_COLOR1, lw=2.5)
        ax.plot([0.6, 0.9, 0.75, 0.6], [0.2, 0.2, 0.7, 0.2], color=LINE_COLOR2, lw=2.5)
        ax.text(0.25, 0.13, '|', color=LINE_COLOR3, fontsize=12, ha='center')
        ax.text(0.75, 0.13, '|', color=LINE_COLOR3, fontsize=12, ha='center')
        ax.text(0.16, 0.45, '||', color=LINE_COLOR3, fontsize=12, ha='center')
        ax.text(0.66, 0.45, '||', color=LINE_COLOR3, fontsize=12, ha='center')
        ax.text(0.34, 0.45, '|||', color=LINE_COLOR3, fontsize=12, ha='center')
        ax.text(0.84, 0.45, '|||', color=LINE_COLOR3, fontsize=12, ha='center')
        ax.text(0.5, 0.08, 'SSS Congruence Postulate', color=LINE_COLOR3, fontsize=11, ha='center', fontweight='bold')

    elif idx == 4:
        # SAS Congruence
        ax.plot([0.1, 0.4, 0.25, 0.1], [0.2, 0.2, 0.7, 0.2], color=LINE_COLOR1, lw=2.5)
        ax.plot([0.6, 0.9, 0.75, 0.6], [0.2, 0.2, 0.7, 0.2], color=LINE_COLOR2, lw=2.5)
        ax.text(0.25, 0.13, '|', color=LINE_COLOR3, fontsize=12, ha='center')
        ax.text(0.75, 0.13, '|', color=LINE_COLOR3, fontsize=12, ha='center')
        ax.text(0.16, 0.45, '||', color=LINE_COLOR3, fontsize=12, ha='center')
        ax.text(0.66, 0.45, '||', color=LINE_COLOR3, fontsize=12, ha='center')
        ax.text(0.14, 0.24, '⌒', color=LINE_COLOR4, fontsize=14, ha='center')
        ax.text(0.64, 0.24, '⌒', color=LINE_COLOR4, fontsize=14, ha='center')
        ax.text(0.5, 0.08, 'SAS Congruence Postulate', color=LINE_COLOR3, fontsize=11, ha='center', fontweight='bold')

    elif idx in [5, 6, 7, 8]:
        # ASA / AAS / HL / Right Triangle Congruence
        ax.plot([0.1, 0.4, 0.1, 0.1], [0.2, 0.2, 0.7, 0.2], color=LINE_COLOR1, lw=2.5)
        ax.plot([0.6, 0.9, 0.6, 0.6], [0.2, 0.2, 0.7, 0.2], color=LINE_COLOR2, lw=2.5)
        # Right angle box
        ax.plot([0.1, 0.14, 0.14], [0.25, 0.25, 0.2], color=LINE_COLOR3, lw=1.5)
        ax.plot([0.6, 0.64, 0.64], [0.25, 0.25, 0.2], color=LINE_COLOR3, lw=1.5)
        labels = {5: 'ASA Postulate', 6: 'AAS Theorem', 7: 'HL Theorem (Right Triangles)', 8: 'Right Triangle Congruence (LL, LA, HA)'}
        ax.text(0.5, 0.08, labels[idx], color=LINE_COLOR3, fontsize=11, ha='center', fontweight='bold')

    elif idx == 9:
        # Algebra Q9: △ABC ≅ △DEF
        ax.plot([0.1, 0.4, 0.25, 0.1], [0.2, 0.2, 0.7, 0.2], color=LINE_COLOR1, lw=2.5)
        ax.plot([0.6, 0.9, 0.75, 0.6], [0.2, 0.2, 0.7, 0.2], color=LINE_COLOR2, lw=2.5)
        ax.text(0.25, 0.12, 'AB = 2x + 3', color=TEXT_COLOR, fontsize=10, ha='center')
        ax.text(0.75, 0.12, 'DE = 15', color=TEXT_COLOR, fontsize=10, ha='center')
        ax.text(0.25, 0.75, '∠C = (4y - 8)°', color=TEXT_COLOR, fontsize=10, ha='center')
        ax.text(0.75, 0.75, '∠F = 52°', color=TEXT_COLOR, fontsize=10, ha='center')
        ax.text(0.5, 0.08, '△ABC ≅ △DEF', color=LINE_COLOR3, fontsize=11, ha='center', fontweight='bold')

    elif idx == 10:
        # AAA Counterexample (similar triangles of different sizes)
        ax.plot([0.1, 0.3, 0.2, 0.1], [0.2, 0.2, 0.5, 0.2], color=LINE_COLOR1, lw=2.5)
        ax.plot([0.5, 0.9, 0.7, 0.5], [0.2, 0.2, 0.8, 0.2], color=LINE_COLOR2, lw=2.5)
        ax.text(0.2, 0.08, 'Equilateral (2 cm)', color=LINE_COLOR1, fontsize=9, ha='center')
        ax.text(0.7, 0.08, 'Equilateral (5 cm)', color=LINE_COLOR2, fontsize=9, ha='center')
        ax.text(0.5, 0.88, 'AAA: Same Shape, Different Size (Not Congruent)', color=LINE_COLOR4, fontsize=10, ha='center', fontweight='bold')

    elif idx == 11:
        # SSA Ambiguous Case
        ax.plot([0.1, 0.8, 0.35, 0.1], [0.2, 0.2, 0.7, 0.2], color=LINE_COLOR1, lw=2.5)
        ax.plot([0.35, 0.6], [0.7, 0.2], color=LINE_COLOR4, lw=2, linestyle='--')
        ax.text(0.5, 0.88, 'SSA Ambiguous Case (2 Possible Triangles)', color=LINE_COLOR4, fontsize=10, ha='center', fontweight='bold')

    elif idx in [12, 13, 14]:
        # Isosceles / Angle triangle diagrams
        ax.plot([0.2, 0.8, 0.5, 0.2], [0.2, 0.2, 0.75, 0.2], color=LINE_COLOR1, lw=2.5)
        ax.text(0.2, 0.14, 'B', color=TEXT_COLOR, fontsize=11, ha='right')
        ax.text(0.8, 0.14, 'C', color=TEXT_COLOR, fontsize=11, ha='left')
        ax.text(0.5, 0.8, 'A', color=TEXT_COLOR, fontsize=11, ha='center')
        if idx == 14:
            ax.text(0.5, 0.65, '44°', color=LINE_COLOR3, fontsize=11, ha='center')
        ax.text(0.5, 0.08, 'Isosceles Triangle (AB = AC)', color=LINE_COLOR3, fontsize=11, ha='center', fontweight='bold')

    elif idx == 16:
        # Equilateral Triangle
        ax.plot([0.2, 0.8, 0.5, 0.2], [0.2, 0.2, 0.75, 0.2], color=LINE_COLOR2, lw=2.5)
        ax.text(0.3, 0.25, '60°', color=LINE_COLOR3, fontsize=10)
        ax.text(0.65, 0.25, '60°', color=LINE_COLOR3, fontsize=10)
        ax.text(0.48, 0.6, '60°', color=LINE_COLOR3, fontsize=10)
        ax.text(0.5, 0.08, 'Equilateral Triangle (60° - 60° - 60°)', color=LINE_COLOR3, fontsize=11, ha='center', fontweight='bold')

    elif idx in [17, 18, 19]:
        # Midline Theorem / Medial Triangle
        ax.plot([0.1, 0.9, 0.4, 0.1], [0.2, 0.2, 0.8, 0.2], color=LINE_COLOR1, lw=2.5)
        # Midpoints D (on AB) and E (on AC)
        # A=(0.4, 0.8), B=(0.1, 0.2), C=(0.9, 0.2)
        # D = midpoint of AB = (0.25, 0.5)
        # E = midpoint of AC = (0.65, 0.5)
        ax.plot([0.25, 0.65], [0.5, 0.5], color=LINE_COLOR3, lw=2.5, linestyle='-')
        ax.text(0.23, 0.53, 'D', color=TEXT_COLOR, fontsize=11, ha='right')
        ax.text(0.67, 0.53, 'E', color=TEXT_COLOR, fontsize=11, ha='left')
        ax.text(0.4, 0.84, 'A', color=TEXT_COLOR, fontsize=11, ha='center')
        ax.text(0.08, 0.16, 'B', color=TEXT_COLOR, fontsize=11, ha='right')
        ax.text(0.92, 0.16, 'C', color=TEXT_COLOR, fontsize=11, ha='left')
        if idx == 19:
            # F = midpoint of BC = (0.5, 0.2)
            ax.plot([0.25, 0.5, 0.65], [0.5, 0.2, 0.5], color=LINE_COLOR2, lw=2)
        ax.text(0.5, 0.08, 'Triangle Midline Theorem', color=LINE_COLOR3, fontsize=11, ha='center', fontweight='bold')

    elif idx in [20, 21]:
        # Perpendicular Bisector
        ax.plot([0.15, 0.85], [0.2, 0.2], color=LINE_COLOR1, lw=2.5)
        ax.plot([0.5, 0.5], [0.1, 0.8], color=LINE_COLOR3, lw=2, linestyle='--')
        ax.plot([0.15, 0.5, 0.85], [0.2, 0.65, 0.2], color=LINE_COLOR2, lw=2)
        ax.text(0.12, 0.16, 'A', color=TEXT_COLOR, fontsize=11)
        ax.text(0.88, 0.16, 'B', color=TEXT_COLOR, fontsize=11)
        ax.text(0.5, 0.7, 'P', color=TEXT_COLOR, fontsize=11, ha='left')
        ax.text(0.5, 0.08, 'Perpendicular Bisector Theorem (PA = PB)', color=LINE_COLOR3, fontsize=11, ha='center', fontweight='bold')

    elif idx == 22:
        # Angle Bisector Theorem
        ax.plot([0.1, 0.85], [0.2, 0.2], color=LINE_COLOR1, lw=2.5)
        ax.plot([0.1, 0.7], [0.2, 0.7], color=LINE_COLOR1, lw=2.5)
        ax.plot([0.1, 0.8], [0.2, 0.45], color=LINE_COLOR3, lw=2, linestyle='--')
        ax.text(0.5, 0.08, 'Angle Bisector Theorem', color=LINE_COLOR3, fontsize=11, ha='center', fontweight='bold')

    elif idx in [23, 24, 25, 26, 27, 28]:
        # Triangle Centers (Circumcenter, Incenter, Centroid)
        ax.plot([0.15, 0.85, 0.45, 0.15], [0.2, 0.2, 0.8, 0.2], color=LINE_COLOR1, lw=2.5)
        # Medians to Centroid G
        ax.plot([0.15, 0.65], [0.2, 0.5], color=LINE_COLOR3, lw=1.5, linestyle='--')
        ax.plot([0.85, 0.3], [0.2, 0.5], color=LINE_COLOR3, lw=1.5, linestyle='--')
        ax.plot([0.45, 0.5], [0.8, 0.2], color=LINE_COLOR3, lw=1.5, linestyle='--')
        ax.scatter([0.48], [0.4], color=LINE_COLOR4, s=50, zorder=5)
        ax.text(0.52, 0.42, 'G', color=TEXT_COLOR, fontsize=12, fontweight='bold')
        labels = {23: 'Four Centers of a Triangle', 24: 'Circumcenter (Perpendicular Bisectors)', 25: 'Incenter (Angle Bisectors)', 26: 'Centroid G (Medians 2:1 Ratio)', 27: 'Centroid G (2:1 Ratio)', 28: 'Centroid G (2:1 Ratio)'}
        ax.text(0.5, 0.08, labels[idx], color=LINE_COLOR3, fontsize=11, ha='center', fontweight='bold')

    elif idx in [29, 30]:
        # Orthocenter & Altitude
        ax.plot([0.15, 0.85, 0.45, 0.15], [0.2, 0.2, 0.8, 0.2], color=LINE_COLOR1, lw=2.5)
        ax.plot([0.45, 0.45], [0.8, 0.2], color=LINE_COLOR3, lw=2, linestyle='--')
        ax.plot([0.45, 0.49, 0.49], [0.24, 0.24, 0.2], color=LINE_COLOR3, lw=1.5)
        ax.text(0.5, 0.08, 'Altitude AD ⊥ BC', color=LINE_COLOR3, fontsize=11, ha='center', fontweight='bold')

    elif idx == 31:
        # Shared Base Triangles
        ax.plot([0.2, 0.8], [0.2, 0.2], color=LINE_COLOR1, lw=3)
        ax.plot([0.2, 0.35, 0.8], [0.2, 0.75, 0.2], color=LINE_COLOR1, lw=2)
        ax.plot([0.2, 0.65, 0.8], [0.2, 0.75, 0.2], color=LINE_COLOR2, lw=2)
        ax.text(0.2, 0.14, 'B', color=TEXT_COLOR, fontsize=11)
        ax.text(0.8, 0.14, 'C', color=TEXT_COLOR, fontsize=11)
        ax.text(0.35, 0.8, 'A', color=TEXT_COLOR, fontsize=11)
        ax.text(0.65, 0.8, 'D', color=TEXT_COLOR, fontsize=11)
        ax.text(0.5, 0.08, 'Shared Base BC (△ABC ≅ △DCB by SSS)', color=LINE_COLOR3, fontsize=10, ha='center', fontweight='bold')

    elif idx == 32:
        # Kite ABCD
        ax.plot([0.5, 0.2, 0.5, 0.8, 0.5], [0.85, 0.5, 0.15, 0.5, 0.85], color=LINE_COLOR1, lw=2.5)
        ax.plot([0.5, 0.5], [0.85, 0.15], color=LINE_COLOR3, lw=2, linestyle='--')
        ax.text(0.5, 0.89, 'A', color=TEXT_COLOR, fontsize=11, ha='center')
        ax.text(0.16, 0.5, 'B', color=TEXT_COLOR, fontsize=11, ha='right')
        ax.text(0.5, 0.09, 'C', color=TEXT_COLOR, fontsize=11, ha='center')
        ax.text(0.84, 0.5, 'D', color=TEXT_COLOR, fontsize=11, ha='left')
        ax.text(0.5, 0.03, 'Kite ABCD (Diagonal AC Bisects Angles)', color=LINE_COLOR3, fontsize=10, ha='center', fontweight='bold')

    elif idx == 33:
        # Rectangle with Congruent Diagonals
        ax.plot([0.15, 0.85, 0.85, 0.15, 0.15], [0.25, 0.25, 0.75, 0.75, 0.25], color=LINE_COLOR1, lw=2.5)
        ax.plot([0.15, 0.85], [0.25, 0.75], color=LINE_COLOR3, lw=2, linestyle='--')
        ax.plot([0.15, 0.85], [0.75, 0.25], color=LINE_COLOR2, lw=2, linestyle='--')
        ax.text(0.5, 0.08, 'Parallelogram with AC = BD (Rectangle)', color=LINE_COLOR3, fontsize=10, ha='center', fontweight='bold')

    elif idx == 34:
        # Surveyor River Measurement
        ax.plot([0.1, 0.9], [0.55, 0.55], color='#1E3A8A', lw=15, alpha=0.5) # River
        ax.text(0.5, 0.53, '~ ~ ~ RIVER ~ ~ ~', color='#60A5FA', fontsize=10, ha='center')
        ax.plot([0.3, 0.3], [0.7, 0.2], color=LINE_COLOR1, lw=2.5)
        ax.plot([0.3, 0.7, 0.7], [0.2, 0.2, 0.7], color=LINE_COLOR2, lw=2, linestyle='--')
        ax.text(0.5, 0.08, 'Indirect River Measurement via Congruent △s', color=LINE_COLOR3, fontsize=10, ha='center', fontweight='bold')

    elif idx in [35, 36]:
        # Congruent Right / SAS Triangles
        ax.plot([0.1, 0.4, 0.1, 0.1], [0.2, 0.2, 0.7, 0.2], color=LINE_COLOR1, lw=2.5)
        ax.plot([0.6, 0.9, 0.6, 0.6], [0.2, 0.2, 0.7, 0.2], color=LINE_COLOR2, lw=2.5)
        ax.text(0.5, 0.08, 'Congruent Triangles Application', color=LINE_COLOR3, fontsize=11, ha='center', fontweight='bold')

    elif idx in [37, 38]:
        # Compass Construction
        ax.plot([0.15, 0.85], [0.2, 0.2], color=LINE_COLOR1, lw=2.5)
        ax.plot([0.15, 0.5, 0.85], [0.2, 0.75, 0.2], color=LINE_COLOR2, lw=2.5)
        # Arc
        arc = patches.Arc((0.15, 0.2), 1.2, 1.2, angle=0, theta1=0, theta2=70, color=LINE_COLOR3, lw=2, linestyle='--')
        ax.add_patch(arc)
        arc2 = patches.Arc((0.85, 0.2), 1.2, 1.2, angle=0, theta1=110, theta2=180, color=LINE_COLOR3, lw=2, linestyle='--')
        ax.add_patch(arc2)
        ax.text(0.5, 0.08, 'Compass & Straightedge Construction', color=LINE_COLOR3, fontsize=11, ha='center', fontweight='bold')

    elif idx in [39, 40, 41, 42, 43]:
        # Isosceles / Altitude / Roof Truss
        ax.plot([0.15, 0.85, 0.5, 0.15], [0.2, 0.2, 0.8, 0.2], color=LINE_COLOR1, lw=2.5)
        ax.plot([0.5, 0.5], [0.8, 0.2], color=LINE_COLOR3, lw=2.5, linestyle='--')
        labels = {39: 'Angle Bisector in Isosceles △', 40: 'Perpendicular Median (Isosceles Proof)', 41: 'Roof Truss King Post Design', 42: 'Perpendicular Bisector Equidistance', 43: 'Angle Bisector as Altitude'}
        ax.text(0.5, 0.08, labels[idx], color=LINE_COLOR3, fontsize=10, ha='center', fontweight='bold')

    elif idx in [45, 46, 48, 49, 50]:
        # Overlapping / Quadrilateral / Circumscribed Circle
        ax.plot([0.15, 0.85, 0.5, 0.15], [0.2, 0.2, 0.8, 0.2], color=LINE_COLOR1, lw=2.5)
        if idx == 50:
            circle = plt.Circle((0.5, 0.42), 0.43, color=LINE_COLOR3, fill=False, lw=2, linestyle='--')
            ax.add_patch(circle)
        labels = {45: 'Congruent Medians Proof', 46: 'Overlapping Triangles Strategy', 48: 'Quadrilateral Diagonal Proof', 49: 'Isosceles Subsegment Proof', 50: 'Circumscribed Circle of Triangle'}
        ax.text(0.5, 0.08, labels[idx], color=LINE_COLOR3, fontsize=10, ha='center', fontweight='bold')

    else:
        # Fallback for any other imaged question
        ax.plot([0.15, 0.85, 0.5, 0.15], [0.2, 0.2, 0.8, 0.2], color=LINE_COLOR1, lw=2.5)
        ax.text(0.5, 0.08, f"Topic T148 • Diagram #{idx}", color=LINE_COLOR3, fontsize=11, ha='center', fontweight='bold')

    filename = f"g9_t148_q{idx}"
    save_fig(fig, filename)
    print(f"Generated plot for Q{idx} ({filename})")

print("All Topic T148 plots generated successfully!")
