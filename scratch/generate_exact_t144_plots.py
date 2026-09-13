import os
import matplotlib.pyplot as plt
import numpy as np
import json

plt.style.use('dark_background')

target_dirs = [
    'public/images',
    'QBank/public/images',
    'QBank/dist/images'
]

for d in target_dirs:
    os.makedirs(d, exist_ok=True)

def save_fig(fig, filename_base):
    for d in target_dirs:
        # Save both png and svg formats
        png_path = os.path.join(d, filename_base + '.png')
        svg_path = os.path.join(d, filename_base + '.svg')
        fig.savefig(png_path, dpi=160, bbox_inches='tight', facecolor=fig.get_facecolor(), edgecolor='none')
        fig.savefig(svg_path, bbox_inches='tight', facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close(fig)
    print(f"Saved {filename_base}.png and {filename_base}.svg")

bg_color = '#0b132b'
card_color = '#1e293b'
text_color = '#f8fafc'
accent_blue = '#38bdf8'
accent_gold = '#f59e0b'
accent_green = '#10b981'
accent_red = '#ef4444'

def create_base_diagram(title_text=""):
    fig, ax = plt.subplots(figsize=(6.5, 4.5), facecolor=bg_color)
    ax.set_facecolor(card_color)
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 7)
    ax.axis('off')
    if title_text:
        ax.set_title(title_text, color=accent_gold, fontsize=12, fontweight='bold', pad=12)
    return fig, ax

def generate_t144_exact_images():
    with open('scratch/t144_50_perfect_built.json', 'r', encoding='utf-8') as f:
        t144_questions = json.load(f)
        
    for q in t144_questions:
        if q["show_image"] == 1 and q["image_url"]:
            fname_base = os.path.splitext(os.path.basename(q["image_url"]))[0]
            qid = q["id"]
            
            # Custom exact diagram for each specific question
            if qid == "134083": # Q1: Point, Line, Plane
                fig, ax = create_base_diagram("Undefined Terms: Point, Line, Plane")
                ax.plot(2, 4, 'o', color=accent_gold, ms=10)
                ax.text(2, 4.6, "Point P (0D)", color=accent_gold, fontsize=11, fontweight='bold', ha='center')
                
                ax.plot([4, 8], [5, 5], color=accent_blue, lw=2.5)
                ax.annotate("", xy=(8.3, 5), xytext=(3.7, 5), arrowprops=dict(arrowstyle="<->", color=accent_blue, lw=2, mutation_scale=15))
                ax.text(6, 5.6, "Line l (1D)", color=accent_blue, fontsize=11, fontweight='bold', ha='center')
                
                from matplotlib.patches import Polygon
                p = Polygon([[3, 1], [8, 1], [9.5, 3], [4.5, 3]], fc='#0f172a', ec=accent_green, lw=2)
                ax.add_patch(p)
                ax.text(6.25, 2, "Plane M (2D)", color=accent_green, fontsize=11, fontweight='bold', ha='center')
                save_fig(fig, fname_base)
                
            elif qid == "134084": # Q2: Notation for Line, Segment, Ray
                fig, ax = create_base_diagram("Geometric Notations")
                # Line
                ax.plot([1, 4], [5.5, 5.5], color=accent_blue, lw=2)
                ax.plot([1.5, 3.5], [5.5, 5.5], 'o', color=accent_gold, ms=6)
                ax.text(1.5, 5.9, "A", color=text_color, fontsize=10, fontweight='bold', ha='center')
                ax.text(3.5, 5.9, "B", color=text_color, fontsize=10, fontweight='bold', ha='center')
                ax.annotate("", xy=(4.2, 5.5), xytext=(0.8, 5.5), arrowprops=dict(arrowstyle="<->", color=accent_blue, lw=2, mutation_scale=12))
                ax.text(5.5, 5.5, "Line AB", color=accent_blue, fontsize=11, fontweight='bold')
                
                # Segment
                ax.plot([1.5, 3.5], [3.5, 3.5], color=accent_green, lw=2.5)
                ax.plot([1.5, 3.5], [3.5, 3.5], 'o', color=accent_gold, ms=7)
                ax.text(1.5, 3.9, "A", color=text_color, fontsize=10, fontweight='bold', ha='center')
                ax.text(3.5, 3.9, "B", color=text_color, fontsize=10, fontweight='bold', ha='center')
                ax.text(5.5, 3.5, "Segment AB", color=accent_green, fontsize=11, fontweight='bold')
                
                # Ray
                ax.plot([1.5, 4], [1.5, 1.5], color=accent_gold, lw=2)
                ax.plot([1.5, 3.5], [1.5, 1.5], 'o', color=accent_gold, ms=6)
                ax.text(1.5, 1.9, "A", color=text_color, fontsize=10, fontweight='bold', ha='center')
                ax.text(3.5, 1.9, "B", color=text_color, fontsize=10, fontweight='bold', ha='center')
                ax.annotate("", xy=(4.2, 1.5), xytext=(1.5, 1.5), arrowprops=dict(arrowstyle="->", color=accent_gold, lw=2, mutation_scale=12))
                ax.text(5.5, 1.5, "Ray AB", color=accent_gold, fontsize=11, fontweight='bold')
                save_fig(fig, fname_base)
                
            elif qid in ["134085", "134089"]: # Q3 & Q7: Segment Addition A-B-C
                fig, ax = create_base_diagram("Segment Addition: AB + BC = AC")
                ax.plot([1.5, 8.5], [3.5, 3.5], color=accent_blue, lw=3)
                ax.plot([1.5, 4.5, 8.5], [3.5, 3.5, 3.5], 'o', color=accent_gold, ms=9)
                ax.text(1.5, 4.1, "A", color=accent_gold, fontsize=12, fontweight='bold', ha='center')
                ax.text(4.5, 4.1, "B", color=accent_gold, fontsize=12, fontweight='bold', ha='center')
                ax.text(8.5, 4.1, "C", color=accent_gold, fontsize=12, fontweight='bold', ha='center')
                
                if qid == "134089":
                    ax.text(3.0, 2.7, "AB = 3x - 5", color=accent_blue, fontsize=11, fontweight='bold', ha='center')
                    ax.text(6.5, 2.7, "BC = 2x + 1", color=accent_green, fontsize=11, fontweight='bold', ha='center')
                    ax.text(5.0, 1.7, "Total AC = 26", color=accent_gold, fontsize=11, fontweight='bold', ha='center')
                else:
                    ax.text(3.0, 2.7, "AB", color=accent_blue, fontsize=11, fontweight='bold', ha='center')
                    ax.text(6.5, 2.7, "BC", color=accent_green, fontsize=11, fontweight='bold', ha='center')
                    ax.text(5.0, 1.7, "AC = AB + BC", color=accent_gold, fontsize=11, fontweight='bold', ha='center')
                save_fig(fig, fname_base)
                
            elif qid in ["134086", "134091", "134130"]: # Q4, Q9, Q48: Angle Addition
                fig, ax = create_base_diagram("Angle Addition / Naming")
                ax.plot([2, 8], [2, 2], color=accent_blue, lw=2.5) # Ray BC
                ax.plot([2, 7], [2, 6], color=accent_green, lw=2.5) # Ray BD
                ax.plot([2, 3], [2, 6], color=accent_gold, lw=2.5) # Ray BA
                
                ax.plot(2, 2, 'o', color=accent_gold, ms=9)
                ax.text(1.7, 1.6, "B (Vertex)", color=accent_gold, fontsize=11, fontweight='bold')
                
                if qid == "134130":
                    ax.text(4.5, 2.5, "2x + 10", color=accent_blue, fontsize=10, fontweight='bold')
                    ax.text(3.8, 4.2, "4x - 6", color=accent_green, fontsize=10, fontweight='bold')
                    ax.text(5.5, 4.5, "Total = 94°", color=accent_gold, fontsize=11, fontweight='bold')
                elif qid == "134091":
                    ax.plot([2, 7], [2, 5], color=accent_blue, lw=2.5)
                    ax.text(7.2, 5.0, "C", color=text_color, fontsize=11, fontweight='bold')
                    ax.text(3.2, 5.8, "A", color=text_color, fontsize=11, fontweight='bold')
                    ax.text(4.5, 3.2, "Angle with vertex B", color=accent_gold, fontsize=11, fontweight='bold')
                else:
                    ax.text(4.5, 2.5, "∠1", color=accent_blue, fontsize=11, fontweight='bold')
                    ax.text(3.8, 4.2, "∠2", color=accent_green, fontsize=11, fontweight='bold')
                save_fig(fig, fname_base)
                
            elif qid in ["134087", "134088"]: # Q5 & Q8: Midpoint
                fig, ax = create_base_diagram("Midpoint and Segment Bisector")
                ax.plot([1.5, 8.5], [3.5, 3.5], color=accent_blue, lw=3)
                ax.plot([1.5, 5.0, 8.5], [3.5, 3.5, 3.5], 'o', color=accent_gold, ms=9)
                ax.plot([5.0, 5.0], [1.5, 5.5], color=accent_green, ls='--', lw=2)
                
                ax.text(1.5, 4.0, "P", color=text_color, fontsize=11, fontweight='bold', ha='center')
                ax.text(5.0, 4.0, "M (Midpoint)", color=accent_gold, fontsize=11, fontweight='bold', ha='center')
                ax.text(8.5, 4.0, "Q", color=text_color, fontsize=11, fontweight='bold', ha='center')
                
                if qid == "134088":
                    ax.text(3.25, 2.7, "PM = 4x - 3", color=accent_blue, fontsize=10, fontweight='bold', ha='center')
                    ax.text(6.75, 2.7, "MQ = 2x + 9", color=accent_green, fontsize=10, fontweight='bold', ha='center')
                else:
                    ax.text(3.25, 2.7, "PM ≅ MQ", color=accent_blue, fontsize=11, fontweight='bold', ha='center')
                    ax.text(6.75, 2.7, "PM ≅ MQ", color=accent_green, fontsize=11, fontweight='bold', ha='center')
                save_fig(fig, fname_base)
                
            elif qid in ["134092", "134096", "134124"]: # Q10, Q14, Q42: Complementary Angles
                fig, ax = create_base_diagram("Complementary Angles (Sum = 90°)")
                ax.plot([2, 8], [2, 2], color=accent_blue, lw=2.5)
                ax.plot([2, 2], [2, 6], color=accent_blue, lw=2.5)
                ax.plot([2, 6.5], [2, 5.5], color=accent_gold, lw=2.5)
                
                # Right angle box
                from matplotlib.patches import Rectangle
                r = Rectangle((2, 2), 0.6, 0.6, fc='none', ec=accent_red, lw=1.5)
                ax.add_patch(r)
                
                if qid == "134096":
                    ax.text(3.8, 2.6, "x", color=accent_blue, fontsize=11, fontweight='bold')
                    ax.text(2.8, 4.2, "2x + 18°", color=accent_gold, fontsize=11, fontweight='bold')
                else:
                    ax.text(3.8, 2.6, "∠1", color=accent_blue, fontsize=11, fontweight='bold')
                    ax.text(2.8, 4.2, "∠2", color=accent_gold, fontsize=11, fontweight='bold')
                ax.text(5.5, 5.5, "∠1 + ∠2 = 90°", color=accent_green, fontsize=12, fontweight='bold')
                save_fig(fig, fname_base)
                
            elif qid in ["134093", "134098"]: # Q11 & Q16: Vertical Angles
                fig, ax = create_base_diagram("Vertical Angles (Equal)")
                ax.plot([1.5, 8.5], [1.5, 5.5], color=accent_blue, lw=2.5)
                ax.plot([1.5, 8.5], [5.5, 1.5], color=accent_green, lw=2.5)
                
                ax.text(5.0, 4.3, "∠1", color=accent_gold, fontsize=12, fontweight='bold', ha='center')
                ax.text(5.0, 2.3, "∠3", color=accent_gold, fontsize=12, fontweight='bold', ha='center')
                ax.text(3.5, 3.5, "∠2", color=text_color, fontsize=11, ha='center')
                ax.text(6.5, 3.5, "∠4", color=text_color, fontsize=11, ha='center')
                
                if qid == "134098":
                    ax.text(5.0, 4.8, "7x - 12°", color=accent_gold, fontsize=10, fontweight='bold', ha='center')
                    ax.text(5.0, 1.8, "4x + 18°", color=accent_gold, fontsize=10, fontweight='bold', ha='center')
                else:
                    ax.text(5.0, 5.8, "∠1 = ∠3 (Vertical Angles)", color=accent_gold, fontsize=11, fontweight='bold', ha='center')
                save_fig(fig, fname_base)
                
            elif qid in ["134094", "134097"]: # Q12 & Q15: Linear Pair
                fig, ax = create_base_diagram("Linear Pair (Supplementary, Sum = 180°)")
                ax.plot([1, 9], [2.5, 2.5], color=accent_blue, lw=2.5)
                ax.plot([5, 7.5], [2.5, 6], color=accent_gold, lw=2.5)
                ax.plot(5, 2.5, 'o', color=accent_red, ms=7)
                
                if qid == "134097":
                    ax.text(6.5, 3.3, "3x + 25°", color=accent_gold, fontsize=10, fontweight='bold')
                    ax.text(3.5, 3.3, "5x + 15°", color=accent_blue, fontsize=10, fontweight='bold')
                else:
                    ax.text(6.5, 3.3, "∠2", color=accent_gold, fontsize=11, fontweight='bold')
                    ax.text(3.5, 3.3, "∠1", color=accent_blue, fontsize=11, fontweight='bold')
                ax.text(5.0, 5.2, "∠1 + ∠2 = 180°", color=accent_green, fontsize=12, fontweight='bold', ha='center')
                save_fig(fig, fname_base)
                
            elif qid == "134099": # Q17: Parallel vs Skew Lines
                fig, ax = create_base_diagram("Parallel Lines vs Skew Lines")
                # Parallel lines
                ax.plot([1, 4.5], [5, 5], color=accent_blue, lw=2.5)
                ax.plot([1, 4.5], [3.5, 3.5], color=accent_blue, lw=2.5)
                ax.text(2.75, 5.8, "Parallel Lines (Coplanar)", color=accent_blue, fontsize=10, fontweight='bold', ha='center')
                
                # Skew lines on cube
                from matplotlib.patches import Rectangle
                ax.plot([6, 9], [4, 4], color=accent_green, lw=2.5)
                ax.plot([7.5, 7.5], [1.5, 4.5], color=accent_red, lw=2.5)
                ax.text(7.5, 5.8, "Skew Lines (Non-coplanar)", color=accent_gold, fontsize=10, fontweight='bold', ha='center')
                save_fig(fig, fname_base)
                
            elif qid in ["134100", "134105"]: # Q18 & Q23: Perpendicular Lines
                fig, ax = create_base_diagram("Perpendicular Lines (l1 ⊥ l2)")
                ax.plot([1.5, 8.5], [3.5, 3.5], color=accent_blue, lw=2.5)
                ax.plot([5, 5], [1, 6], color=accent_green, lw=2.5)
                
                from matplotlib.patches import Rectangle
                r = Rectangle((5, 3.5), 0.6, 0.6, fc='none', ec=accent_red, lw=1.5)
                ax.add_patch(r)
                ax.text(5.8, 4.3, "90° Right Angle", color=accent_red, fontsize=11, fontweight='bold')
                save_fig(fig, fname_base)
                
            elif qid in ["134101", "134106"]: # Q19 & Q24: Collinear vs Coplanar
                fig, ax = create_base_diagram("Collinear vs Coplanar Points")
                ax.plot([1, 4.5], [4, 4], color=accent_blue, lw=2)
                ax.plot([1.5, 3.0, 4.0], [4, 4, 4], 'o', color=accent_gold, ms=7)
                ax.text(2.75, 4.7, "Collinear (Same Line)", color=accent_blue, fontsize=10, fontweight='bold', ha='center')
                
                from matplotlib.patches import Polygon
                p = Polygon([[6, 1.5], [9.5, 1.5], [10, 5], [6.5, 5]], fc='#0f172a', ec=accent_green, lw=2)
                ax.add_patch(p)
                ax.plot([7.2, 8.5, 8.0], [2.5, 3.0, 4.2], 'o', color=accent_gold, ms=7)
                ax.text(8.0, 5.4, "3 Non-Collinear Points (Unique Plane)", color=accent_green, fontsize=10, fontweight='bold', ha='center')
                save_fig(fig, fname_base)
                
            elif qid == "134107": # Q25: Ruler Postulate
                fig, ax = create_base_diagram("Ruler Postulate: Distance = |x2 - x1|")
                ax.plot([1, 9], [3.5, 3.5], color=accent_blue, lw=2.5)
                ax.plot([2.5, 7.5], [3.5, 3.5], 'o', color=accent_gold, ms=8)
                ax.text(2.5, 4.1, "Point A (x1 = -3)", color=text_color, fontsize=10, fontweight='bold', ha='center')
                ax.text(7.5, 4.1, "Point B (x2 = 5)", color=text_color, fontsize=10, fontweight='bold', ha='center')
                ax.text(5.0, 2.3, "Distance AB = |5 - (-3)| = 8", color=accent_gold, fontsize=11, fontweight='bold', ha='center')
                save_fig(fig, fname_base)
                
            elif qid == "134108": # Q26: Protractor Postulate
                fig, ax = create_base_diagram("Protractor Postulate")
                theta = np.linspace(0, np.pi, 100)
                ax.plot(5 + 3.5*np.cos(theta), 2 + 3.5*np.sin(theta), color=accent_blue, lw=2)
                ax.plot([1.5, 8.5], [2, 2], color=accent_blue, lw=2)
                ax.plot([5, 7.5], [2, 4.5], color=accent_gold, lw=2.5)
                ax.plot([5, 3.5], [2, 5.0], color=accent_green, lw=2.5)
                ax.plot(5, 2, 'o', color=accent_red, ms=7)
                ax.text(5, 1.4, "Vertex O (0° - 180° protractor scale)", color=accent_gold, fontsize=10, fontweight='bold', ha='center')
                save_fig(fig, fname_base)
                
            elif qid == "134109": # Q27: Collinear Points in Multiple Planes
                fig, ax = create_base_diagram("Collinear Points: Infinitely Many Planes")
                ax.plot([3, 7], [3.5, 3.5], color=accent_gold, lw=3)
                ax.plot([3.5, 5.0, 6.5], [3.5, 3.5, 3.5], 'o', color=accent_red, ms=8)
                ax.text(5.0, 4.1, "Collinear Points on Line l", color=accent_gold, fontsize=11, fontweight='bold', ha='center')
                ax.text(5.0, 2.0, "Infinitely many planes pivot around line l", color=accent_blue, fontsize=11, fontweight='bold', ha='center')
                save_fig(fig, fname_base)
                
            elif qid == "134110": # Q28: Intersecting Planes
                fig, ax = create_base_diagram("Intersection of Two Planes")
                ax.text(5.0, 5.5, "Plane M ∩ Plane N = Line l", color=accent_gold, fontsize=12, fontweight='bold', ha='center')
                ax.plot([2, 8], [3.5, 3.5], color=accent_red, lw=3)
                ax.text(5.0, 2.5, "Intersection is a straight line", color=accent_blue, fontsize=11, fontweight='bold', ha='center')
                save_fig(fig, fname_base)
                
            elif qid == "134111": # Q29: Intersecting Lines
                fig, ax = create_base_diagram("Intersection of Two Lines")
                ax.plot([2, 8], [2, 5], color=accent_blue, lw=2.5)
                ax.plot([2, 8], [5, 2], color=accent_green, lw=2.5)
                ax.plot(5, 3.5, 'o', color=accent_gold, ms=9)
                ax.text(5.0, 4.3, "Point of Intersection P", color=accent_gold, fontsize=11, fontweight='bold', ha='center')
                save_fig(fig, fname_base)
                
            elif qid == "134112": # Q30: Line Piercing Plane
                fig, ax = create_base_diagram("Line Piercing a Plane")
                from matplotlib.patches import Polygon
                p = Polygon([[2, 1.5], [8, 1.5], [9, 4.5], [3, 4.5]], fc='#0f172a', ec=accent_blue, lw=2)
                ax.add_patch(p)
                ax.plot([5.5, 5.5], [0.5, 6], color=accent_gold, lw=2.5)
                ax.plot(5.5, 3.0, 'o', color=accent_red, ms=8)
                ax.text(5.5, 3.6, "Intersection Point K", color=accent_red, fontsize=10, fontweight='bold', ha='center')
                save_fig(fig, fname_base)
                
            elif qid == "134113": # Q31: Rays from Collinear Points X, Y, Z
                fig, ax = create_base_diagram("Rays from Collinear Points X, Y, Z")
                ax.plot([1.5, 8.5], [3.5, 3.5], color=accent_blue, lw=2.5)
                ax.plot([2.5, 5.0, 7.5], [3.5, 3.5, 3.5], 'o', color=accent_gold, ms=8)
                ax.text(2.5, 4.1, "X", color=text_color, fontsize=11, fontweight='bold', ha='center')
                ax.text(5.0, 4.1, "Y", color=text_color, fontsize=11, fontweight='bold', ha='center')
                ax.text(7.5, 4.1, "Z", color=text_color, fontsize=11, fontweight='bold', ha='center')
                ax.text(5.0, 2.0, "Rays: XY, YX, YZ, ZY", color=accent_gold, fontsize=11, fontweight='bold', ha='center')
                save_fig(fig, fname_base)
                
            elif qid == "134114": # Q32: Types of Angles
                fig, ax = create_base_diagram("Classification of Angles")
                ax.text(2.5, 5.2, "Acute: 0° < θ < 90°", color=accent_blue, fontsize=10, fontweight='bold', ha='center')
                ax.text(7.5, 5.2, "Obtuse: 90° < θ < 180°", color=accent_green, fontsize=10, fontweight='bold', ha='center')
                ax.text(2.5, 2.0, "Straight: θ = 180°", color=accent_gold, fontsize=10, fontweight='bold', ha='center')
                ax.text(7.5, 2.0, "Reflex: 180° < θ < 360°", color=accent_red, fontsize=10, fontweight='bold', ha='center')
                save_fig(fig, fname_base)
                
            elif qid == "134115": # Q33: Proof angles 1, 2, 3
                fig, ax = create_base_diagram("Proof: Vertical & Supplementary Angles")
                ax.plot([1.5, 8.5], [2, 5], color=accent_blue, lw=2.5)
                ax.plot([1.5, 8.5], [5, 2], color=accent_green, lw=2.5)
                ax.text(5.0, 4.3, "∠1", color=accent_gold, fontsize=11, fontweight='bold', ha='center')
                ax.text(5.0, 2.3, "∠2", color=accent_gold, fontsize=11, fontweight='bold', ha='center')
                ax.text(3.2, 3.5, "∠3", color=accent_blue, fontsize=11, fontweight='bold', ha='center')
                ax.text(5.0, 6.0, "∠1 = ∠2 (Vertical) & ∠2 + ∠3 = 180° ⇒ ∠1 + ∠3 = 180°", color=accent_gold, fontsize=10, fontweight='bold', ha='center')
                save_fig(fig, fname_base)
                
            elif qid == "134116": # Q34: Angle ratio 2:3
                fig, ax = create_base_diagram("Angle Division in Ratio 2 : 3")
                ax.plot([2, 8], [2, 2], color=accent_blue, lw=2.5) # QR
                ax.plot([2, 6], [2, 5.5], color=accent_green, lw=2.5) # QS
                ax.plot([2, 3], [2, 6], color=accent_gold, lw=2.5) # QP
                ax.plot(2, 2, 'o', color=accent_gold, ms=8)
                ax.text(1.7, 1.6, "Q", color=accent_gold, fontsize=11, fontweight='bold')
                ax.text(4.5, 2.5, "2 parts (48°)", color=accent_blue, fontsize=10, fontweight='bold')
                ax.text(3.5, 4.2, "3 parts (72°)", color=accent_green, fontsize=10, fontweight='bold')
                ax.text(5.0, 6.2, "Total m∠PQR = 120°", color=accent_gold, fontsize=11, fontweight='bold', ha='center')
                save_fig(fig, fname_base)
                
            elif qid == "134118": # Q36: Opposite Rays
                fig, ax = create_base_diagram("Opposite Rays Form Straight Angle")
                ax.plot([1.5, 8.5], [3.5, 3.5], color=accent_blue, lw=2.5)
                ax.plot(5.0, 3.5, 'o', color=accent_gold, ms=9)
                ax.annotate("", xy=(1.2, 3.5), xytext=(5.0, 3.5), arrowprops=dict(arrowstyle="->", color=accent_blue, lw=2.5, mutation_scale=15))
                ax.annotate("", xy=(8.8, 3.5), xytext=(5.0, 3.5), arrowprops=dict(arrowstyle="->", color=accent_green, lw=2.5, mutation_scale=15))
                ax.text(5.0, 4.2, "Endpoint B (180° Straight Angle)", color=accent_gold, fontsize=11, fontweight='bold', ha='center')
                save_fig(fig, fname_base)
                
            elif qid == "134119": # Q37: Two cases of AC length
                fig, ax = create_base_diagram("Segment AC: Two Possible Cases")
                ax.text(5.0, 5.5, "Case 1: B between A & C ⇒ AC = 8 + 14 = 22", color=accent_blue, fontsize=10, fontweight='bold', ha='center')
                ax.text(5.0, 2.5, "Case 2: A between B & C ⇒ AC = 14 - 8 = 6", color=accent_green, fontsize=10, fontweight='bold', ha='center')
                save_fig(fig, fname_base)
                
            elif qid in ["134120", "134121"]: # Q38 & Q39: Convex vs Concave Polygon
                fig, ax = create_base_diagram("Convex vs Concave Polygons")
                from matplotlib.patches import Polygon
                # Convex
                p1 = Polygon([[1.5, 2], [4, 1.5], [4.5, 5], [2, 5.5]], fc='#0f172a', ec=accent_blue, lw=2.5)
                ax.add_patch(p1)
                ax.text(3.0, 6.0, "Convex Polygon", color=accent_blue, fontsize=11, fontweight='bold', ha='center')
                
                # Concave
                p2 = Polygon([[6, 1.5], [9, 1.5], [9, 5.5], [7.5, 3.5], [6, 5.5]], fc='#0f172a', ec=accent_red, lw=2.5)
                ax.add_patch(p2)
                ax.text(7.5, 6.0, "Concave Polygon (Cave-in)", color=accent_red, fontsize=11, fontweight='bold', ha='center')
                save_fig(fig, fname_base)
                
            elif qid == "134122": # Q40: Ray bisecting straight angle
                fig, ax = create_base_diagram("Ray Bisecting Straight Angle ROS")
                ax.plot([1.5, 8.5], [2.5, 2.5], color=accent_blue, lw=2.5)
                ax.plot([5, 5], [2.5, 6], color=accent_gold, lw=2.5)
                ax.plot(5, 2.5, 'o', color=accent_red, ms=8)
                ax.text(5, 1.8, "O", color=text_color, fontsize=11, fontweight='bold', ha='center')
                ax.text(3.2, 4.0, "90° (Right)", color=accent_blue, fontsize=11, fontweight='bold', ha='center')
                ax.text(6.8, 4.0, "90° (Right)", color=accent_green, fontsize=11, fontweight='bold', ha='center')
                save_fig(fig, fname_base)
                
            elif qid == "134123": # Q41: Midpoint on 1D Axis -9 and 15
                fig, ax = create_base_diagram("1D Midpoint Coordinate")
                ax.plot([1, 9], [3.5, 3.5], color=accent_blue, lw=2.5)
                ax.plot([2, 5, 8], [3.5, 3.5, 3.5], 'o', color=accent_gold, ms=8)
                ax.text(2, 4.1, "-9", color=text_color, fontsize=11, fontweight='bold', ha='center')
                ax.text(5, 4.1, "3 (Midpoint)", color=accent_gold, fontsize=11, fontweight='bold', ha='center')
                ax.text(8, 4.1, "15", color=text_color, fontsize=11, fontweight='bold', ha='center')
                ax.text(5, 2.0, "Midpoint = (-9 + 15) / 2 = 3", color=accent_green, fontsize=11, fontweight='bold', ha='center')
                save_fig(fig, fname_base)
                
            elif qid == "134130": # Q48: Interior Angle Addition
                fig, ax = create_base_diagram("Interior Angle Addition: m∠JLM = 94°")
                ax.plot([2, 8], [2, 2], color=accent_blue, lw=2.5) # LM
                ax.plot([2, 6.5], [2, 5.5], color=accent_green, lw=2.5) # LK
                ax.plot([2, 3], [2, 6], color=accent_gold, lw=2.5) # LJ
                ax.plot(2, 2, 'o', color=accent_gold, ms=8)
                ax.text(1.6, 1.6, "L", color=accent_gold, fontsize=11, fontweight='bold')
                ax.text(4.5, 2.5, "4x - 6", color=accent_blue, fontsize=10, fontweight='bold')
                ax.text(3.5, 4.2, "2x + 10", color=accent_green, fontsize=10, fontweight='bold')
                ax.text(5.0, 6.2, "Total m∠JLM = 94°", color=accent_gold, fontsize=11, fontweight='bold', ha='center')
                save_fig(fig, fname_base)
                
            elif qid == "134132": # Q50: Skew Lines 3D Cube Model
                fig, ax = create_base_diagram("Skew Lines in 3D Cube Model")
                # Front face
                ax.plot([2, 5, 5, 2, 2], [1.5, 1.5, 4.5, 4.5, 1.5], color='#475569', lw=1.5)
                # Back face
                ax.plot([3.5, 6.5, 6.5, 3.5, 3.5], [3.0, 3.0, 6.0, 6.0, 3.0], color='#475569', lw=1.5)
                # Connectors
                ax.plot([2, 3.5], [1.5, 3.0], color='#475569', lw=1.5)
                ax.plot([5, 6.5], [1.5, 3.0], color='#475569', lw=1.5)
                ax.plot([5, 6.5], [4.5, 6.0], color='#475569', lw=1.5)
                ax.plot([2, 3.5], [4.5, 6.0], color='#475569', lw=1.5)
                
                # Skew lines highlighted
                ax.plot([2, 5], [1.5, 1.5], color=accent_blue, lw=3, label="Line 1 (Front bottom)")
                ax.plot([6.5, 6.5], [3.0, 6.0], color=accent_red, lw=3, label="Line 2 (Back right edge)")
                ax.legend(loc="upper left", facecolor='#0f172a', edgecolor='#475569', labelcolor=text_color, fontsize=9)
                save_fig(fig, fname_base)
                
            else:
                fig, ax = create_base_diagram(f"Diagram for {q['title']}")
                ax.plot([2, 8], [3.5, 3.5], color=accent_blue, lw=2.5)
                ax.plot([5, 5], [1.5, 5.5], color=accent_green, lw=2.5)
                save_fig(fig, fname_base)

if __name__ == "__main__":
    generate_t144_exact_images()
    print("All Topic T144 exact plots generated successfully!")
