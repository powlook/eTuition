import os
import json
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np

os.makedirs('public/images', exist_ok=True)
os.makedirs('QBank/public/images', exist_ok=True)

with open('scratch/t150_50_perfect_built.json', 'r', encoding='utf-8') as f:
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

    title_text = f"Similarity of Triangles & Polygons • #{idx}"
    ax.text(0.5, 0.92, title_text, color='#94A3B8', fontsize=10, ha='center', va='center', fontweight='bold')

    if idx in [1, 2, 4]:
        # Two Similar Polygons / Rectangles
        ax.plot([0.1, 0.35, 0.35, 0.1, 0.1], [0.2, 0.2, 0.6, 0.6, 0.2], color=LINE_COLOR1, lw=2.5)
        ax.plot([0.5, 0.9, 0.9, 0.5, 0.5], [0.2, 0.2, 0.85, 0.85, 0.2], color=LINE_COLOR2, lw=2.5)
        ax.text(0.22, 0.12, 'Smaller (Scale 3)', color=LINE_COLOR1, fontsize=9, ha='center')
        ax.text(0.7, 0.12, 'Larger (Scale 5)', color=LINE_COLOR2, fontsize=9, ha='center')
        ax.text(0.42, 0.45, '~', color=LINE_COLOR3, fontsize=24, ha='center', va='center')
        ax.text(0.5, 0.04, 'Similar Rectangles (Scale Factor 3 : 5)', color=LINE_COLOR3, fontsize=10, ha='center', fontweight='bold')

    elif idx in [6, 7, 8, 9, 10, 31]:
        # Similar Triangles AA / SAS / SSS
        ax.plot([0.1, 0.35, 0.22, 0.1], [0.2, 0.2, 0.6, 0.2], color=LINE_COLOR1, lw=2.5)
        ax.plot([0.5, 0.9, 0.7, 0.5], [0.2, 0.2, 0.8, 0.2], color=LINE_COLOR2, lw=2.5)
        ax.text(0.42, 0.45, '~', color=LINE_COLOR3, fontsize=24, ha='center', va='center')
        labels = {6: 'AA Similarity Postulate', 7: 'SAS Similarity Theorem', 8: 'SSS Similarity Theorem', 9: 'AA Similarity Verification', 10: 'SSS Similarity (Ratio 3 : 4)', 31: 'SAS Similarity Proportion'}
        ax.text(0.5, 0.04, labels[idx], color=LINE_COLOR3, fontsize=10, ha='center', fontweight='bold')

    elif idx in [11, 12, 13, 27, 28, 44]:
        # Triangle Proportionality DE || BC
        ax.plot([0.1, 0.9, 0.45, 0.1], [0.2, 0.2, 0.8, 0.2], color=LINE_COLOR1, lw=2.5)
        ax.plot([0.275, 0.675], [0.5, 0.5], color=LINE_COLOR3, lw=2.5)
        ax.text(0.45, 0.84, 'A', color=TEXT_COLOR, fontsize=11, ha='center')
        ax.text(0.25, 0.52, 'D', color=TEXT_COLOR, fontsize=11, ha='right')
        ax.text(0.7, 0.52, 'E', color=TEXT_COLOR, fontsize=11, ha='left')
        ax.text(0.08, 0.16, 'B', color=TEXT_COLOR, fontsize=11, ha='right')
        ax.text(0.92, 0.16, 'C', color=TEXT_COLOR, fontsize=11, ha='left')
        ax.text(0.5, 0.04, 'Triangle Proportionality Theorem (DE || BC)', color=LINE_COLOR3, fontsize=10, ha='center', fontweight='bold')

    elif idx in [14, 15]:
        # Angle Bisector PS in △PQR
        ax.plot([0.15, 0.85, 0.4, 0.15], [0.2, 0.2, 0.8, 0.2], color=LINE_COLOR1, lw=2.5)
        ax.plot([0.4, 0.55], [0.8, 0.2], color=LINE_COLOR3, lw=2.5, linestyle='--')
        ax.text(0.4, 0.84, 'P', color=TEXT_COLOR, fontsize=11, ha='center')
        ax.text(0.12, 0.16, 'Q', color=TEXT_COLOR, fontsize=11)
        ax.text(0.88, 0.16, 'R', color=TEXT_COLOR, fontsize=11)
        ax.text(0.55, 0.14, 'S', color=TEXT_COLOR, fontsize=11, ha='center')
        ax.text(0.5, 0.04, 'Angle Bisector Theorem (PQ/PR = QS/SR)', color=LINE_COLOR3, fontsize=10, ha='center', fontweight='bold')

    elif idx in [16, 17, 30]:
        # Shadow / Light Source Indirect Measurement
        ax.plot([0.1, 0.9], [0.2, 0.2], color=TEXT_COLOR, lw=1.5) # Ground
        # Person / Stick
        ax.plot([0.3, 0.3], [0.2, 0.45], color=LINE_COLOR1, lw=3)
        # Flagpole / Tree
        ax.plot([0.7, 0.7], [0.2, 0.8], color=LINE_COLOR2, lw=3.5)
        # Sun ray
        ax.plot([0.1, 0.85], [0.6, 0.2], color=LINE_COLOR3, lw=1.5, linestyle='--')
        ax.plot([0.4, 0.95], [0.95, 0.2], color=LINE_COLOR3, lw=1.5, linestyle='--')
        ax.text(0.5, 0.04, 'Indirect Measurement via Similar Triangles', color=LINE_COLOR3, fontsize=10, ha='center', fontweight='bold')

    elif idx == 18:
        # Cliff Ground Mirror Diagram
        ax.plot([0.1, 0.9], [0.2, 0.2], color=TEXT_COLOR, lw=1.5) # Ground
        ax.scatter([0.4], [0.2], color=LINE_COLOR3, s=60, zorder=5) # Mirror
        ax.text(0.4, 0.13, 'Mirror', color=LINE_COLOR3, fontsize=9, ha='center')
        ax.plot([0.2, 0.2], [0.2, 0.45], color=LINE_COLOR1, lw=2.5) # Surveyor
        ax.plot([0.8, 0.8], [0.2, 0.85], color=LINE_COLOR2, lw=3) # Cliff
        # Light reflection rays
        ax.plot([0.2, 0.4, 0.8], [0.45, 0.2, 0.85], color=LINE_COLOR4, lw=1.5, linestyle='--')
        ax.text(0.5, 0.04, 'Ground Mirror Cliff Measurement', color=LINE_COLOR3, fontsize=10, ha='center', fontweight='bold')

    elif idx in [19, 20, 21, 22, 41]:
        # Right Triangle Altitude to Hypotenuse CD ⊥ AB
        ax.plot([0.15, 0.85, 0.15, 0.15], [0.2, 0.2, 0.75, 0.2], color=LINE_COLOR1, lw=2.5)
        # Altitude CD perpendicular to hypotenuse
        ax.plot([0.15, 0.45], [0.75, 0.2], color=LINE_COLOR3, lw=2.5, linestyle='--')
        ax.plot([0.15, 0.19, 0.19], [0.24, 0.24, 0.2], color=LINE_COLOR3, lw=1.5)
        ax.text(0.5, 0.04, 'Right Triangle Altitude Geometric Mean (h² = p·q)', color=LINE_COLOR3, fontsize=10, ha='center', fontweight='bold')

    elif idx in [23, 24, 26, 36]:
        # Blueprint / Photo / Scale Map Grid
        ax.plot([0.2, 0.8, 0.8, 0.2, 0.2], [0.25, 0.25, 0.75, 0.75, 0.25], color=LINE_COLOR1, lw=2.5)
        ax.plot([0.2, 0.8], [0.5, 0.5], color='#475569', lw=1, linestyle=':')
        ax.plot([0.5, 0.5], [0.25, 0.75], color='#475569', lw=1, linestyle=':')
        ax.text(0.5, 0.04, 'Proportional Scale Measurement', color=LINE_COLOR3, fontsize=10, ha='center', fontweight='bold')

    elif idx in [32, 34, 35]:
        # Trapezoid Diagonals Intersecting at E
        ax.plot([0.15, 0.85, 0.7, 0.3, 0.15], [0.25, 0.25, 0.75, 0.75, 0.25], color=LINE_COLOR1, lw=2.5)
        ax.plot([0.15, 0.7], [0.25, 0.75], color=LINE_COLOR3, lw=2, linestyle='--')
        ax.plot([0.85, 0.3], [0.25, 0.75], color=LINE_COLOR2, lw=2, linestyle='--')
        ax.scatter([0.46], [0.5], color=LINE_COLOR4, s=40, zorder=5)
        ax.text(0.46, 0.56, 'E', color=TEXT_COLOR, fontsize=11, fontweight='bold')
        ax.text(0.5, 0.04, 'Trapezoid Diagonals (△ABE ~ △CDE)', color=LINE_COLOR3, fontsize=10, ha='center', fontweight='bold')

    elif idx == 37:
        # Inverted Similar Triangle PST ~ PRQ
        ax.plot([0.15, 0.85, 0.5, 0.15], [0.2, 0.2, 0.8, 0.2], color=LINE_COLOR1, lw=2.5)
        ax.plot([0.3, 0.75], [0.46, 0.32], color=LINE_COLOR3, lw=2.5)
        ax.text(0.5, 0.84, 'P', color=TEXT_COLOR, fontsize=11, ha='center')
        ax.text(0.12, 0.16, 'Q', color=TEXT_COLOR, fontsize=11)
        ax.text(0.88, 0.16, 'R', color=TEXT_COLOR, fontsize=11)
        ax.text(0.26, 0.48, 'S', color=TEXT_COLOR, fontsize=11)
        ax.text(0.78, 0.34, 'T', color=TEXT_COLOR, fontsize=11)
        ax.text(0.5, 0.04, 'Inverted Similar Triangles (△PST ~ △PRQ)', color=LINE_COLOR3, fontsize=10, ha='center', fontweight='bold')

    elif idx == 40:
        # Intersecting Chords Theorem Circle
        circle = plt.Circle((0.5, 0.45), 0.35, color=LINE_COLOR1, fill=False, lw=2.5)
        ax.add_patch(circle)
        ax.plot([0.2, 0.8], [0.3, 0.6], color=LINE_COLOR2, lw=2) # AB
        ax.plot([0.25, 0.7], [0.65, 0.2], color=LINE_COLOR3, lw=2) # CD
        ax.scatter([0.47], [0.43], color=LINE_COLOR4, s=40, zorder=5)
        ax.text(0.47, 0.49, 'E', color=TEXT_COLOR, fontsize=11, fontweight='bold')
        ax.text(0.5, 0.04, 'Intersecting Chords Theorem (AE·EB = CE·ED)', color=LINE_COLOR3, fontsize=10, ha='center', fontweight='bold')

    elif idx in [42, 46]:
        # Ramp / Ladder Wall Triangle
        ax.plot([0.15, 0.85, 0.85, 0.15], [0.2, 0.2, 0.75, 0.2], color=LINE_COLOR1, lw=2.5)
        ax.plot([0.5, 0.5], [0.2, 0.435], color=LINE_COLOR3, lw=2.5, linestyle='--')
        ax.text(0.5, 0.04, 'Ramp / Ladder Wall Similar Triangles', color=LINE_COLOR3, fontsize=10, ha='center', fontweight='bold')

    elif idx in [43, 48, 49]:
        # Three Parallel Lines / Perimeter & Area Ratios
        ax.plot([0.1, 0.9], [0.75, 0.75], color=LINE_COLOR1, lw=2)
        ax.plot([0.1, 0.9], [0.5, 0.5], color=LINE_COLOR1, lw=2)
        ax.plot([0.1, 0.9], [0.25, 0.25], color=LINE_COLOR1, lw=2)
        ax.plot([0.25, 0.75], [0.15, 0.85], color=LINE_COLOR2, lw=2)
        ax.plot([0.4, 0.85], [0.15, 0.85], color=LINE_COLOR3, lw=2)
        ax.text(0.5, 0.04, 'Transversal & Proportion Ratios', color=LINE_COLOR3, fontsize=10, ha='center', fontweight='bold')

    elif idx == 50:
        # Pinhole Camera Inverted Real Image
        ax.plot([0.1, 0.3], [0.2, 0.7], color=LINE_COLOR1, lw=3) # Object
        ax.plot([0.5, 0.5], [0.1, 0.8], color=TEXT_COLOR, lw=3) # Pinhole wall
        ax.scatter([0.5], [0.45], color=BG_COLOR, s=50, zorder=6)
        ax.plot([0.7, 0.7], [0.35, 0.55], color=LINE_COLOR2, lw=2.5) # Inverted image
        ax.plot([0.3, 0.5, 0.7], [0.7, 0.45, 0.35], color=LINE_COLOR3, lw=1.5, linestyle='--')
        ax.plot([0.1, 0.5, 0.7], [0.2, 0.45, 0.55], color=LINE_COLOR3, lw=1.5, linestyle='--')
        ax.text(0.5, 0.04, 'Pinhole Camera Inverted Image Geometry', color=LINE_COLOR3, fontsize=10, ha='center', fontweight='bold')

    else:
        ax.plot([0.15, 0.85, 0.5, 0.15], [0.2, 0.2, 0.8, 0.2], color=LINE_COLOR1, lw=2.5)
        ax.text(0.5, 0.04, f"Topic T150 • Similarity Diagram #{idx}", color=LINE_COLOR3, fontsize=11, ha='center', fontweight='bold')

    filename = f"g9_t150_q{idx}"
    save_fig(fig, filename)
    print(f"Generated plot for Q{idx} ({filename})")

print("All Topic T150 plots generated successfully!")
