import os
import json
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np

os.makedirs('public/images', exist_ok=True)
os.makedirs('QBank/public/images', exist_ok=True)

with open('scratch/t152_50_perfect_built.json', 'r', encoding='utf-8') as f:
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

    title_text = f"Triangle Inequalities & Theorems • #{idx}"
    ax.text(0.5, 0.92, title_text, color='#94A3B8', fontsize=10, ha='center', va='center', fontweight='bold')

    if idx in [2, 3, 4, 36]:
        # Triangle Existence & Side Range
        ax.plot([0.1, 0.9, 0.35, 0.1], [0.2, 0.2, 0.75, 0.2], color=LINE_COLOR1, lw=2.5)
        ax.text(0.5, 0.14, 'Side c', color=LINE_COLOR2, fontsize=10, ha='center')
        ax.text(0.2, 0.5, 'Side a', color=LINE_COLOR1, fontsize=10, ha='right')
        ax.text(0.65, 0.5, 'Side b', color=LINE_COLOR3, fontsize=10, ha='left')
        ax.text(0.5, 0.04, 'Triangle Inequality Theorem (a + b > c)', color=LINE_COLOR3, fontsize=10, ha='center', fontweight='bold')

    elif idx in [6, 8, 27, 48]:
        # Angle-Side Ordering Diagram
        ax.plot([0.15, 0.85, 0.45, 0.15], [0.2, 0.2, 0.8, 0.2], color=LINE_COLOR1, lw=2.5)
        ax.text(0.12, 0.16, 'A', color=TEXT_COLOR, fontsize=11)
        ax.text(0.88, 0.16, 'B', color=TEXT_COLOR, fontsize=11)
        ax.text(0.45, 0.84, 'C', color=TEXT_COLOR, fontsize=11, ha='center')
        ax.text(0.5, 0.04, 'Longer Side Opposite Larger Angle', color=LINE_COLOR3, fontsize=10, ha='center', fontweight='bold')

    elif idx == 10:
        # Exterior Angle Inequality
        ax.plot([0.15, 0.65, 0.4, 0.15], [0.2, 0.2, 0.75, 0.2], color=LINE_COLOR1, lw=2.5)
        ax.plot([0.65, 0.95], [0.2, 0.2], color=LINE_COLOR3, lw=2.5, linestyle='--')
        ax.text(0.72, 0.25, '110° (Ext)', color=LINE_COLOR4, fontsize=11, fontweight='bold')
        ax.text(0.22, 0.25, '45°', color=LINE_COLOR1, fontsize=10)
        ax.text(0.5, 0.04, 'Exterior Angle > Remote Interior Angle', color=LINE_COLOR3, fontsize=10, ha='center', fontweight='bold')

    elif idx in [13, 14, 30, 33]:
        # Hinge Theorem Comparison (Two Triangles with Hinge Angle)
        ax.plot([0.08, 0.42, 0.2, 0.08], [0.2, 0.2, 0.65, 0.2], color=LINE_COLOR1, lw=2.5) # Smaller angle
        ax.plot([0.58, 0.92, 0.85, 0.58], [0.2, 0.2, 0.75, 0.2], color=LINE_COLOR2, lw=2.5) # Larger angle
        ax.text(0.25, 0.12, 'Smaller Included Angle', color=LINE_COLOR1, fontsize=9, ha='center')
        ax.text(0.75, 0.12, 'Larger Included Angle', color=LINE_COLOR2, fontsize=9, ha='center')
        labels = {13: 'Hinge Theorem: BC < EF', 14: 'Converse Hinge: m∠P < m∠S', 30: 'Hiker Trail Hinge Theorem', 33: 'Included Angle Change Effect'}
        ax.text(0.5, 0.04, labels[idx], color=LINE_COLOR3, fontsize=10, ha='center', fontweight='bold')

    elif idx in [17, 23, 46]:
        # Isosceles Triangle Base & Legs
        ax.plot([0.15, 0.85, 0.5, 0.15], [0.2, 0.2, 0.8, 0.2], color=LINE_COLOR1, lw=2.5)
        ax.text(0.5, 0.84, 'Vertex Angle', color=LINE_COLOR3, fontsize=10, ha='center')
        ax.text(0.3, 0.5, 'Leg L', color=LINE_COLOR1, fontsize=10, ha='right')
        ax.text(0.7, 0.5, 'Leg L', color=LINE_COLOR1, fontsize=10, ha='left')
        ax.text(0.5, 0.14, 'Base B', color=LINE_COLOR2, fontsize=10, ha='center')
        ax.text(0.5, 0.04, 'Isosceles Triangle Base & Legs', color=LINE_COLOR3, fontsize=10, ha='center', fontweight='bold')

    elif idx in [20, 34]:
        # Triangle Midline / Medians
        ax.plot([0.1, 0.9, 0.45, 0.1], [0.2, 0.2, 0.8, 0.2], color=LINE_COLOR1, lw=2.5)
        ax.plot([0.275, 0.675], [0.5, 0.5], color=LINE_COLOR3, lw=2.5)
        ax.text(0.25, 0.52, 'D', color=TEXT_COLOR, fontsize=11, ha='right')
        ax.text(0.7, 0.52, 'E', color=TEXT_COLOR, fontsize=11, ha='left')
        ax.text(0.5, 0.04, 'Midline DE = 1/2 BC (DE || BC)', color=LINE_COLOR3, fontsize=10, ha='center', fontweight='bold')

    elif idx in [21, 37, 38]:
        # Right Triangle / Altitude AH ⊥ BC
        ax.plot([0.15, 0.85, 0.45, 0.15], [0.2, 0.2, 0.8, 0.2], color=LINE_COLOR1, lw=2.5)
        ax.plot([0.45, 0.45], [0.8, 0.2], color=LINE_COLOR3, lw=2.5, linestyle='--')
        ax.plot([0.45, 0.49, 0.49], [0.24, 0.24, 0.2], color=LINE_COLOR3, lw=1.5)
        ax.text(0.45, 0.84, 'A', color=TEXT_COLOR, fontsize=11, ha='center')
        ax.text(0.12, 0.16, 'B', color=TEXT_COLOR, fontsize=11)
        ax.text(0.88, 0.16, 'C', color=TEXT_COLOR, fontsize=11)
        ax.text(0.45, 0.14, 'H', color=TEXT_COLOR, fontsize=11, ha='center')
        ax.text(0.5, 0.04, 'Altitude AH ⊥ BC (Shortest Distance)', color=LINE_COLOR3, fontsize=10, ha='center', fontweight='bold')

    elif idx in [22, 24, 39, 43, 45]:
        # Segment / Angle Bisector / Median AM
        ax.plot([0.15, 0.85, 0.5, 0.15], [0.2, 0.2, 0.8, 0.2], color=LINE_COLOR1, lw=2.5)
        ax.plot([0.5, 0.5], [0.8, 0.2], color=LINE_COLOR3, lw=2, linestyle='--')
        ax.text(0.5, 0.84, 'A', color=TEXT_COLOR, fontsize=11, ha='center')
        ax.text(0.5, 0.14, 'M / D', color=TEXT_COLOR, fontsize=11, ha='center')
        labels = {22: 'Integer Triangle Range', 24: 'Angle Bisector Subsegments', 39: 'Median AM Upper Bound', 43: 'Variable Range 2 < x < 12', 45: 'Segment AD < max(AB, AC)'}
        ax.text(0.5, 0.04, labels[idx], color=LINE_COLOR3, fontsize=10, ha='center', fontweight='bold')

    elif idx in [25, 31, 49]:
        # Quadrilateral Diagonals / Interior Point P
        ax.plot([0.15, 0.85, 0.7, 0.3, 0.15], [0.25, 0.25, 0.75, 0.75, 0.25], color=LINE_COLOR1, lw=2.5)
        ax.plot([0.15, 0.7], [0.25, 0.75], color=LINE_COLOR3, lw=2, linestyle='--')
        ax.plot([0.85, 0.3], [0.25, 0.75], color=LINE_COLOR2, lw=2, linestyle='--')
        ax.scatter([0.46], [0.5], color=LINE_COLOR4, s=40, zorder=5)
        ax.text(0.46, 0.56, 'P', color=TEXT_COLOR, fontsize=11, fontweight='bold')
        labels = {25: 'Quadrilateral Diagonals vs Perimeter', 31: 'Interior Point P Inequality', 49: 'Quadrilateral 3-Side Sum > 4th Side'}
        ax.text(0.5, 0.04, labels[idx], color=LINE_COLOR3, fontsize=10, ha='center', fontweight='bold')

    elif idx in [28, 29]:
        # Circumcenter / Incenter Towns Engineering
        ax.plot([0.15, 0.85, 0.5, 0.15], [0.2, 0.2, 0.8, 0.2], color=LINE_COLOR1, lw=2.5)
        ax.scatter([0.5], [0.42], color=LINE_COLOR4, s=60, zorder=5)
        ax.text(0.5, 0.48, 'Station / Reservoir', color=LINE_COLOR4, fontsize=9, ha='center', fontweight='bold')
        labels = {28: 'Circumcenter (Equidistant from Towns A, B, C)', 29: 'Incenter (Equidistant from Pipelines)'}
        ax.text(0.5, 0.04, labels[idx], color=LINE_COLOR3, fontsize=10, ha='center', fontweight='bold')

    elif idx == 32:
        # Sum of Altitudes Acute Triangle
        ax.plot([0.15, 0.85, 0.45, 0.15], [0.2, 0.2, 0.8, 0.2], color=LINE_COLOR1, lw=2.5)
        ax.plot([0.45, 0.45], [0.8, 0.2], color=LINE_COLOR3, lw=1.5, linestyle='--')
        ax.plot([0.15, 0.65], [0.2, 0.5], color=LINE_COLOR2, lw=1.5, linestyle='--')
        ax.text(0.5, 0.04, 'Sum of Altitudes Inequality (h_a + h_b > h_c)', color=LINE_COLOR3, fontsize=10, ha='center', fontweight='bold')

    elif idx == 41:
        # Altitudes Order Inversion
        ax.plot([0.15, 0.85, 0.35, 0.15], [0.2, 0.2, 0.8, 0.2], color=LINE_COLOR1, lw=2.5)
        ax.text(0.5, 0.04, 'Inverted Order of Altitudes vs Side Lengths', color=LINE_COLOR3, fontsize=10, ha='center', fontweight='bold')

    elif idx == 42:
        # Crane Robotic Arm Annular Boundary
        circle1 = plt.Circle((0.5, 0.5), 0.35, color=LINE_COLOR1, fill=False, lw=2.5)
        circle2 = plt.Circle((0.5, 0.5), 0.1, color=LINE_COLOR4, fill=False, lw=2, linestyle='--')
        ax.add_patch(circle1)
        ax.add_patch(circle2)
        ax.scatter([0.5], [0.5], color=TEXT_COLOR, s=30)
        ax.text(0.5, 0.04, 'Robotic Crane Annular Region (1 m ≤ r ≤ 5 m)', color=LINE_COLOR3, fontsize=10, ha='center', fontweight='bold')

    else:
        ax.plot([0.15, 0.85, 0.5, 0.15], [0.2, 0.2, 0.8, 0.2], color=LINE_COLOR1, lw=2.5)
        ax.text(0.5, 0.04, f"Topic T152 • Inequality Diagram #{idx}", color=LINE_COLOR3, fontsize=11, ha='center', fontweight='bold')

    filename = f"g9_t152_q{idx}"
    save_fig(fig, filename)
    print(f"Generated plot for Q{idx} ({filename})")

print("All Topic T152 plots generated successfully!")
