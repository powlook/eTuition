import os
import json
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np

os.makedirs('public/images', exist_ok=True)
os.makedirs('QBank/public/images', exist_ok=True)

with open('scratch/t149_50_perfect_built.json', 'r', encoding='utf-8') as f:
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

    title_text = f"Geometric Proofs & Logic • #{idx}"
    ax.text(0.5, 0.92, title_text, color='#94A3B8', fontsize=10, ha='center', va='center', fontweight='bold')

    if idx == 6:
        # Two-Column Proof Structure Diagram
        ax.plot([0.1, 0.9], [0.75, 0.75], color=LINE_COLOR1, lw=2)
        ax.plot([0.5, 0.5], [0.15, 0.75], color=LINE_COLOR1, lw=2)
        ax.text(0.3, 0.82, 'Statements', color=LINE_COLOR2, fontsize=12, ha='center', fontweight='bold')
        ax.text(0.7, 0.82, 'Reasons', color=LINE_COLOR3, fontsize=12, ha='center', fontweight='bold')
        ax.text(0.3, 0.6, '1. AB ≅ CD\n2. AC ≅ CA\n3. △ABC ≅ △CDA', color=TEXT_COLOR, fontsize=10, ha='center')
        ax.text(0.7, 0.6, '1. Given\n2. Reflexive Property\n3. SSS Postulate', color=TEXT_COLOR, fontsize=10, ha='center')
        ax.text(0.5, 0.08, 'Two-Column Proof Table Structure', color=LINE_COLOR1, fontsize=11, ha='center', fontweight='bold')

    elif idx in [8, 11, 14]:
        # Quadrilateral ABCD with Diagonal AC (Overlapping Triangles)
        ax.plot([0.15, 0.85, 0.7, 0.3, 0.15], [0.3, 0.3, 0.8, 0.8, 0.3], color=LINE_COLOR1, lw=2.5)
        ax.plot([0.15, 0.7], [0.3, 0.8], color=LINE_COLOR3, lw=2, linestyle='--')
        ax.text(0.12, 0.26, 'A', color=TEXT_COLOR, fontsize=11)
        ax.text(0.88, 0.26, 'B', color=TEXT_COLOR, fontsize=11)
        ax.text(0.72, 0.84, 'C', color=TEXT_COLOR, fontsize=11)
        ax.text(0.26, 0.84, 'D', color=TEXT_COLOR, fontsize=11)
        ax.text(0.5, 0.08, 'Quadrilateral ABCD with Diagonal AC', color=LINE_COLOR3, fontsize=11, ha='center', fontweight='bold')

    elif idx == 12:
        # Segment Bisectors at E (Vertical Angles)
        ax.plot([0.15, 0.85], [0.25, 0.75], color=LINE_COLOR1, lw=2.5) # AB
        ax.plot([0.15, 0.85], [0.75, 0.25], color=LINE_COLOR2, lw=2.5) # CD
        ax.scatter([0.5], [0.5], color=LINE_COLOR3, s=40, zorder=5)
        ax.text(0.5, 0.56, 'E', color=TEXT_COLOR, fontsize=11, fontweight='bold')
        ax.text(0.12, 0.22, 'A', color=TEXT_COLOR, fontsize=11)
        ax.text(0.88, 0.78, 'B', color=TEXT_COLOR, fontsize=11)
        ax.text(0.12, 0.78, 'C', color=TEXT_COLOR, fontsize=11)
        ax.text(0.88, 0.22, 'D', color=TEXT_COLOR, fontsize=11)
        ax.text(0.5, 0.08, 'Bisecting Segments (AE = BE, DE = CE)', color=LINE_COLOR3, fontsize=10, ha='center', fontweight='bold')

    elif idx in [13, 15, 26, 47]:
        # Triangle with Perpendicular Bisector / Altitude / Median
        ax.plot([0.15, 0.85, 0.5, 0.15], [0.2, 0.2, 0.8, 0.2], color=LINE_COLOR1, lw=2.5)
        ax.plot([0.5, 0.5], [0.8, 0.2], color=LINE_COLOR3, lw=2.5, linestyle='--')
        ax.plot([0.5, 0.54, 0.54], [0.24, 0.24, 0.2], color=LINE_COLOR3, lw=1.5)
        ax.text(0.5, 0.84, 'A', color=TEXT_COLOR, fontsize=11, ha='center')
        ax.text(0.12, 0.16, 'B', color=TEXT_COLOR, fontsize=11)
        ax.text(0.88, 0.16, 'C', color=TEXT_COLOR, fontsize=11)
        ax.text(0.5, 0.14, 'D', color=TEXT_COLOR, fontsize=11, ha='center')
        ax.text(0.5, 0.08, 'Triangle with Altitude / Perpendicular Bisector AD', color=LINE_COLOR3, fontsize=10, ha='center', fontweight='bold')

    elif idx in [16, 28]:
        # Right Triangles Configuration
        ax.plot([0.15, 0.85, 0.15, 0.15], [0.2, 0.2, 0.75, 0.2], color=LINE_COLOR1, lw=2.5)
        ax.plot([0.15, 0.19, 0.19], [0.24, 0.24, 0.2], color=LINE_COLOR3, lw=1.5)
        ax.text(0.5, 0.08, 'Right Triangle Congruence (HL Theorem)', color=LINE_COLOR3, fontsize=11, ha='center', fontweight='bold')

    elif idx in [17, 48]:
        # Circle with radii / Thales' Theorem
        circle = plt.Circle((0.5, 0.45), 0.35, color=LINE_COLOR1, fill=False, lw=2.5)
        ax.add_patch(circle)
        ax.plot([0.15, 0.85], [0.45, 0.45], color=LINE_COLOR3, lw=2) # Diameter AB
        ax.plot([0.15, 0.5, 0.85], [0.45, 0.8, 0.45], color=LINE_COLOR2, lw=2)
        ax.scatter([0.5], [0.45], color=TEXT_COLOR, s=30)
        ax.text(0.5, 0.39, 'O', color=TEXT_COLOR, fontsize=10, ha='center')
        ax.text(0.1, 0.45, 'A', color=TEXT_COLOR, fontsize=11)
        ax.text(0.9, 0.45, 'B', color=TEXT_COLOR, fontsize=11)
        ax.text(0.5, 0.84, 'C', color=TEXT_COLOR, fontsize=11, ha='center')
        labels = {17: 'Circle Radii OA, OB and Chords AC, BC', 48: 'Thales\' Theorem: Angle in Semicircle ∠ACB = 90°'}
        ax.text(0.5, 0.04, labels[idx], color=LINE_COLOR3, fontsize=10, ha='center', fontweight='bold')

    elif idx in [18, 19, 20, 21, 31, 32, 50]:
        # Parallelogram / Rectangle / Rhombus / Square ABCD with Diagonals
        ax.plot([0.2, 0.8, 0.8, 0.2, 0.2], [0.25, 0.25, 0.75, 0.75, 0.25], color=LINE_COLOR1, lw=2.5)
        ax.plot([0.2, 0.8], [0.25, 0.75], color=LINE_COLOR3, lw=2, linestyle='--')
        ax.plot([0.2, 0.8], [0.75, 0.25], color=LINE_COLOR2, lw=2, linestyle='--')
        ax.text(0.16, 0.2, 'A', color=TEXT_COLOR, fontsize=11)
        ax.text(0.84, 0.2, 'B', color=TEXT_COLOR, fontsize=11)
        ax.text(0.84, 0.78, 'C', color=TEXT_COLOR, fontsize=11)
        ax.text(0.16, 0.78, 'D', color=TEXT_COLOR, fontsize=11)
        ax.scatter([0.5], [0.5], color=LINE_COLOR4, s=40, zorder=5)
        ax.text(0.5, 0.56, 'E', color=TEXT_COLOR, fontsize=11, fontweight='bold')
        labels = {18: 'Parallelogram Opposite Angles Proof', 19: 'Parallelogram Diagonals Bisecting at E', 20: 'Rectangle Diagonals AC = BD', 21: 'Rhombus Diagonals AC ⊥ BD', 31: 'Parallelogram ABCD Proof', 32: 'Rhombus ABCD (4 Equal Sides)', 50: 'Square ABCD Corner Triangles'}
        ax.text(0.5, 0.08, labels[idx], color=LINE_COLOR3, fontsize=10, ha='center', fontweight='bold')

    elif idx == 22:
        # Isosceles Trapezoid with Perpendicular Heights
        ax.plot([0.15, 0.85, 0.7, 0.3, 0.15], [0.25, 0.25, 0.75, 0.75, 0.25], color=LINE_COLOR1, lw=2.5)
        ax.plot([0.3, 0.3], [0.75, 0.25], color=LINE_COLOR3, lw=2, linestyle='--')
        ax.plot([0.7, 0.7], [0.75, 0.25], color=LINE_COLOR3, lw=2, linestyle='--')
        ax.text(0.5, 0.08, 'Isosceles Trapezoid with Perpendicular Heights', color=LINE_COLOR3, fontsize=10, ha='center', fontweight='bold')

    elif idx in [25, 42, 43]:
        # Parallel Lines & Transversal
        ax.plot([0.1, 0.9], [0.65, 0.65], color=LINE_COLOR1, lw=2.5) # line l
        ax.plot([0.1, 0.9], [0.35, 0.35], color=LINE_COLOR1, lw=2.5) # line m
        ax.plot([0.25, 0.75], [0.15, 0.85], color=LINE_COLOR2, lw=2.5) # transversal t
        ax.text(0.92, 0.65, 'l', color=LINE_COLOR1, fontsize=12, fontweight='bold')
        ax.text(0.92, 0.35, 'm', color=LINE_COLOR1, fontsize=12, fontweight='bold')
        ax.text(0.77, 0.85, 't', color=LINE_COLOR2, fontsize=12, fontweight='bold')
        labels = {25: 'Transversal & Alternate Interior Angles', 42: 'Parallel Lines: Consecutive Interior Angles Supplementary', 43: 'Converse: Supplementary Angles ⟹ Parallel Lines'}
        ax.text(0.5, 0.04, labels[idx], color=LINE_COLOR3, fontsize=10, ha='center', fontweight='bold')

    elif idx in [27, 29]:
        # Triangle Congruence AAS / SSA Ambiguity
        ax.plot([0.1, 0.4, 0.25, 0.1], [0.2, 0.2, 0.7, 0.2], color=LINE_COLOR1, lw=2.5)
        ax.plot([0.6, 0.9, 0.75, 0.6], [0.2, 0.2, 0.7, 0.2], color=LINE_COLOR2, lw=2.5)
        ax.text(0.5, 0.08, 'Triangle Congruence Comparison', color=LINE_COLOR3, fontsize=11, ha='center', fontweight='bold')

    elif idx in [30, 46]:
        # Angle Bisector Equidistance / Perpendicular Lines
        ax.plot([0.1, 0.85], [0.2, 0.2], color=LINE_COLOR1, lw=2.5)
        ax.plot([0.1, 0.7], [0.2, 0.7], color=LINE_COLOR1, lw=2.5)
        ax.plot([0.1, 0.8], [0.2, 0.45], color=LINE_COLOR3, lw=2, linestyle='--')
        ax.text(0.5, 0.08, 'Angle Bisector & Perpendicular Distance', color=LINE_COLOR3, fontsize=10, ha='center', fontweight='bold')

    elif idx in [33, 34]:
        # Isosceles Triangle Subsegments / Altitudes
        ax.plot([0.15, 0.85, 0.5, 0.15], [0.2, 0.2, 0.8, 0.2], color=LINE_COLOR1, lw=2.5)
        ax.plot([0.15, 0.65], [0.2, 0.5], color=LINE_COLOR3, lw=2, linestyle='--')
        ax.plot([0.85, 0.35], [0.2, 0.5], color=LINE_COLOR2, lw=2, linestyle='--')
        ax.text(0.5, 0.08, 'Isosceles Triangle Altitudes / Subsegments', color=LINE_COLOR3, fontsize=10, ha='center', fontweight='bold')

    elif idx in [35, 36]:
        # Auxiliary Parallel Line Proof of Triangle Sum
        ax.plot([0.15, 0.85, 0.5, 0.15], [0.2, 0.2, 0.7, 0.2], color=LINE_COLOR1, lw=2.5)
        ax.plot([0.05, 0.95], [0.7, 0.7], color=LINE_COLOR3, lw=2, linestyle='--') # Auxiliary line l || BC
        ax.text(0.96, 0.7, 'l || BC', color=LINE_COLOR3, fontsize=10)
        ax.text(0.5, 0.08, 'Auxiliary Parallel Line l || BC', color=LINE_COLOR3, fontsize=11, ha='center', fontweight='bold')

    elif idx == 37:
        # Exterior Angle Theorem Diagram
        ax.plot([0.15, 0.65, 0.4, 0.15], [0.2, 0.2, 0.75, 0.2], color=LINE_COLOR1, lw=2.5)
        ax.plot([0.65, 0.95], [0.2, 0.2], color=LINE_COLOR3, lw=2.5, linestyle='--') # Extended base
        ax.text(0.72, 0.25, '∠4 (Ext)', color=LINE_COLOR4, fontsize=11, fontweight='bold')
        ax.text(0.5, 0.08, 'Exterior Angle Theorem: ∠4 = ∠1 + ∠2', color=LINE_COLOR3, fontsize=10, ha='center', fontweight='bold')

    elif idx == 39:
        # Vertical Angles Theorem
        ax.plot([0.15, 0.85], [0.25, 0.75], color=LINE_COLOR1, lw=2.5)
        ax.plot([0.15, 0.85], [0.75, 0.25], color=LINE_COLOR2, lw=2.5)
        ax.text(0.35, 0.5, '∠1', color=LINE_COLOR3, fontsize=11, ha='center')
        ax.text(0.65, 0.5, '∠3', color=LINE_COLOR3, fontsize=11, ha='center')
        ax.text(0.5, 0.08, 'Vertical Angles Theorem (∠1 ≅ ∠3)', color=LINE_COLOR3, fontsize=11, ha='center', fontweight='bold')

    elif idx == 41:
        # Kite ABCD Diagonals Perpendicular
        ax.plot([0.5, 0.2, 0.5, 0.8, 0.5], [0.85, 0.5, 0.15, 0.5, 0.85], color=LINE_COLOR1, lw=2.5)
        ax.plot([0.5, 0.5], [0.85, 0.15], color=LINE_COLOR3, lw=2, linestyle='--')
        ax.plot([0.2, 0.8], [0.5, 0.5], color=LINE_COLOR2, lw=2, linestyle='--')
        ax.text(0.5, 0.05, 'Kite ABCD Diagonals (AC ⊥ BD)', color=LINE_COLOR3, fontsize=11, ha='center', fontweight='bold')

    elif idx == 44:
        # Triangle Midline Theorem DE || BC
        ax.plot([0.1, 0.9, 0.45, 0.1], [0.2, 0.2, 0.8, 0.2], color=LINE_COLOR1, lw=2.5)
        ax.plot([0.275, 0.675], [0.5, 0.5], color=LINE_COLOR3, lw=2.5) # Midline DE
        ax.text(0.25, 0.52, 'D', color=TEXT_COLOR, fontsize=11, ha='right')
        ax.text(0.7, 0.52, 'E', color=TEXT_COLOR, fontsize=11, ha='left')
        ax.text(0.5, 0.08, 'Triangle Midline Theorem (DE || BC, DE = 1/2 BC)', color=LINE_COLOR3, fontsize=10, ha='center', fontweight='bold')

    else:
        # Fallback
        ax.plot([0.15, 0.85, 0.5, 0.15], [0.2, 0.2, 0.8, 0.2], color=LINE_COLOR1, lw=2.5)
        ax.text(0.5, 0.08, f"Topic T149 • Proof Diagram #{idx}", color=LINE_COLOR3, fontsize=11, ha='center', fontweight='bold')

    filename = f"g9_t149_q{idx}"
    save_fig(fig, filename)
    print(f"Generated plot for Q{idx} ({filename})")

print("All Topic T149 plots generated successfully!")
