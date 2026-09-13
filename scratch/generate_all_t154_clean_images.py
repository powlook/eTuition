import os
import matplotlib.pyplot as plt
import numpy as np

# Set dark theme style for matplotlib
plt.style.use('dark_background')

target_dirs = [
    'public/images',
    'QBank/public/images',
    'QBank/dist/images'
]

for d in target_dirs:
    os.makedirs(d, exist_ok=True)

def save_fig(fig, filename):
    for d in target_dirs:
        path = os.path.join(d, filename)
        fig.savefig(path, dpi=160, bbox_inches='tight', facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close(fig)
    print(f"Saved {filename}")

bg_color = '#0b132b'
card_color = '#1e293b'
text_color = '#f8fafc'
accent_blue = '#38bdf8'
accent_gold = '#f59e0b'
accent_green = '#10b981'
accent_red = '#ef4444'

def create_base_plot(title_text="", xlabel="x", ylabel="y", xlim=None, ylim=None):
    fig, ax = plt.subplots(figsize=(6.5, 4.5), facecolor=bg_color)
    ax.set_facecolor(card_color)
    ax.grid(True, color='#334155', linestyle='--', linewidth=0.8, alpha=0.6)
    for spine in ax.spines.values():
        spine.set_color('#475569')
        spine.set_linewidth(1.2)
    ax.tick_params(colors='#94a3b8', labelsize=10)
    ax.set_xlabel(xlabel, color=text_color, fontsize=11, labelpad=8)
    ax.set_ylabel(ylabel, color=text_color, fontsize=11, labelpad=8)
    if title_text:
        ax.set_title(title_text, color=accent_gold, fontsize=12, fontweight='bold', pad=12)
    if xlim:
        ax.set_xlim(xlim)
    if ylim:
        ax.set_ylim(ylim)
    ax.axhline(0, color='#64748b', linewidth=1.2)
    ax.axvline(0, color='#64748b', linewidth=1.2)
    return fig, ax

def draw_mapping_diagram(left_title, right_title, left_nodes, right_nodes, edges, main_title, filename):
    fig, ax = plt.subplots(figsize=(6.5, 4.5), facecolor=bg_color)
    ax.set_facecolor(card_color)
    ax.set_xlim(-0.5, 3.5)
    ax.set_ylim(-0.5, max(len(left_nodes), len(right_nodes)) + 0.5)
    ax.axis('off')
    
    ax.set_title(main_title, color=accent_gold, fontsize=12, fontweight='bold', pad=12)
    
    # Draw Ovals
    from matplotlib.patches import Ellipse
    h_l = len(left_nodes)
    h_r = len(right_nodes)
    
    oval1 = Ellipse((0.5, h_l / 2), 1.0, h_l + 0.6, color='#1e293b', ec=accent_blue, lw=2)
    oval2 = Ellipse((2.5, h_r / 2), 1.0, h_r + 0.6, color='#1e293b', ec=accent_green, lw=2)
    ax.add_patch(oval1)
    ax.add_patch(oval2)
    
    ax.text(0.5, h_l + 0.5, left_title, color=accent_blue, fontsize=12, fontweight='bold', ha='center')
    ax.text(2.5, h_r + 0.5, right_title, color=accent_green, fontsize=12, fontweight='bold', ha='center')
    
    # Nodes Y coords
    left_y = {val: h_l - idx for idx, val in enumerate(left_nodes)}
    right_y = {val: h_r - idx for idx, val in enumerate(right_nodes)}
    
    for val, y in left_y.items():
        ax.text(0.5, y, str(val), color=text_color, fontsize=12, fontweight='bold', ha='center', va='center')
        
    for val, y in right_y.items():
        ax.text(2.5, y, str(val), color=text_color, fontsize=12, fontweight='bold', ha='center', va='center')
        
    # Draw Arrows
    for src, dst in edges:
        y1 = left_y[src]
        y2 = right_y[dst]
        ax.annotate("", xy=(2.0, y2), xytext=(1.0, y1),
                    arrowprops=dict(arrowstyle="->", color=accent_gold, lw=2, mutation_scale=15))
                    
    save_fig(fig, filename)

# Q2: 4 Representations Overview
def gen_q2():
    fig, ax = plt.subplots(figsize=(6.5, 4.5), facecolor=bg_color)
    ax.set_facecolor(card_color)
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 10)
    ax.axis('off')
    ax.set_title("Representations of Relations", color=accent_gold, fontsize=13, fontweight='bold')
    
    boxes = [
        (0.5, 5.2, 4.2, 4.0, "1. Ordered Pairs", "{(1, 2), (2, 4), (3, 6)}", accent_blue),
        (5.3, 5.2, 4.2, 4.0, "2. Table of Values", "x | 1  2  3\ny | 2  4  6", accent_green),
        (0.5, 0.5, 4.2, 4.0, "3. Mapping Diagram", "Domain {1,2,3}\n  → Range {2,4,6}", accent_gold),
        (5.3, 0.5, 4.2, 4.0, "4. Graph", "Cartesian Plot\nof Points (x, y)", '#a855f7')
    ]
    from matplotlib.patches import FancyBboxPatch
    for x, y, w, h, t, txt, col in boxes:
        p = FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.2", fc='#0f172a', ec=col, lw=2)
        ax.add_patch(p)
        ax.text(x + w/2, y + h - 0.8, t, color=col, fontsize=11, fontweight='bold', ha='center')
        ax.text(x + w/2, y + h/2 - 0.4, txt, color=text_color, fontsize=10, ha='center', va='center')
        
    save_fig(fig, "g9_t154_q2.png")

# Q3: Mapping Diagram non-function
def gen_q3():
    draw_mapping_diagram("Domain (X)", "Range (Y)", [1, 2, 3, 4], [3, 5, 7, 8, 9],
                         [(1, 3), (2, 5), (2, 8), (3, 7), (4, 9)],
                         "Mapping Diagram: {(1,3), (2,5), (3,7), (4,9), (2,8)}", "g9_t154_q3.png")

# Q4: Mapping Diagram constant function
def gen_q4():
    draw_mapping_diagram("Domain (X)", "Range (Y)", [3, 5, 7, 9], [4],
                         [(3, 4), (5, 4), (7, 4), (9, 4)],
                         "Mapping Diagram: {(3,4), (5,4), (7,4), (9,4)}", "g9_t154_q4.png")

# Q5: Domain and Range Block Diagram
def gen_q5():
    fig, ax = plt.subplots(figsize=(6.5, 4.5), facecolor=bg_color)
    ax.set_facecolor(card_color)
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 5)
    ax.axis('off')
    ax.set_title("Concept of Domain and Range", color=accent_gold, fontsize=13, fontweight='bold')
    
    from matplotlib.patches import FancyBboxPatch
    # Domain Box
    p1 = FancyBboxPatch((0.8, 1.5), 2.5, 2.0, boxstyle="round,pad=0.2", fc='#0f172a', ec=accent_blue, lw=2)
    ax.add_patch(p1)
    ax.text(2.05, 2.7, "DOMAIN", color=accent_blue, fontsize=12, fontweight='bold', ha='center')
    ax.text(2.05, 2.0, "Set of Inputs\n(x-values)", color=text_color, fontsize=10, ha='center')
    
    # Relation Box
    p2 = FancyBboxPatch((4.0, 1.5), 2.0, 2.0, boxstyle="round,pad=0.2", fc='#0f172a', ec=accent_gold, lw=2)
    ax.add_patch(p2)
    ax.text(5.0, 2.7, "RELATION /", color=accent_gold, fontsize=10, fontweight='bold', ha='center')
    ax.text(5.0, 2.3, "FUNCTION", color=accent_gold, fontsize=10, fontweight='bold', ha='center')
    ax.text(5.0, 1.8, "Rule f(x)", color=text_color, fontsize=9, ha='center')
    
    # Range Box
    p3 = FancyBboxPatch((6.7, 1.5), 2.5, 2.0, boxstyle="round,pad=0.2", fc='#0f172a', ec=accent_green, lw=2)
    ax.add_patch(p3)
    ax.text(7.95, 2.7, "RANGE", color=accent_green, fontsize=12, fontweight='bold', ha='center')
    ax.text(7.95, 2.0, "Set of Outputs\n(y-values)", color=text_color, fontsize=10, ha='center')
    
    # Arrows
    ax.annotate("", xy=(3.9, 2.5), xytext=(3.4, 2.5), arrowprops=dict(arrowstyle="->", color=accent_gold, lw=2, mutation_scale=15))
    ax.annotate("", xy=(6.6, 2.5), xytext=(6.1, 2.5), arrowprops=dict(arrowstyle="->", color=accent_gold, lw=2, mutation_scale=15))
    
    save_fig(fig, "g9_t154_q5.png")

# Q6: Plot discrete points
def gen_q6():
    fig, ax = create_base_plot("Relation Points: {(-3,2), (-1,5), (0,-4), (2,7), (4,1)}",
                               xlim=(-5, 5), ylim=(-6, 9))
    pts = [(-3, 2), (-1, 5), (0, -4), (2, 7), (4, 1)]
    for x, y in pts:
        ax.plot(x, y, 'o', color=accent_blue, markersize=8, markeredgecolor='white', markeredgewidth=1.5)
        ax.text(x + 0.2, y + 0.3, f"({x}, {y})", color=text_color, fontsize=9, fontweight='bold')
    save_fig(fig, "g9_t154_q6.png")

# Q7: Vertical Line Test Curve
def gen_q7():
    fig, ax = create_base_plot("Vertical Line Test Demonstration", xlim=(-3, 3), ylim=(-4, 4))
    x = np.linspace(-2.5, 2.5, 200)
    y = x**3 - 3*x
    ax.plot(x, y, color=accent_blue, linewidth=2.5, label="y = x³ - 3x")
    
    # Vertical test lines
    ax.axvline(1.5, color=accent_gold, linestyle='--', linewidth=1.5, label="Vertical Line (1 intersection)")
    ax.plot(1.5, 1.5**3 - 3*1.5, 'o', color=accent_red, markersize=8)
    
    ax.axvline(-1.2, color=accent_green, linestyle='--', linewidth=1.5, label="Vertical Line (1 intersection)")
    ax.plot(-1.2, (-1.2)**3 - 3*(-1.2), 'o', color=accent_red, markersize=8)
    
    ax.legend(loc="upper left", facecolor='#0f172a', edgecolor='#475569', labelcolor=text_color, fontsize=9)
    save_fig(fig, "g9_t154_q7.png")

# Q8: Circle Vertical Line Test
def gen_q8():
    fig, ax = create_base_plot("Vertical Line Test on Circle: x² + y² = 25", xlim=(-7, 7), ylim=(-7, 7))
    theta = np.linspace(0, 2*np.pi, 200)
    ax.plot(5*np.cos(theta), 5*np.sin(theta), color=accent_blue, linewidth=2.5, label="x² + y² = 25")
    
    # Vertical line at x = 3
    ax.axvline(3, color=accent_red, linestyle='--', linewidth=1.8, label="Vertical Line x = 3")
    ax.plot(3, 4, 'o', color=accent_gold, markersize=9, label="Point (3, 4)")
    ax.plot(3, -4, 'o', color=accent_gold, markersize=9, label="Point (3, -4)")
    ax.text(3.3, 4, "(3, 4)", color=accent_gold, fontsize=10, fontweight='bold')
    ax.text(3.3, -4, "(3, -4)", color=accent_gold, fontsize=10, fontweight='bold')
    
    ax.legend(loc="upper left", facecolor='#0f172a', edgecolor='#475569', labelcolor=text_color, fontsize=9)
    save_fig(fig, "g9_t154_q8.png")

# Q9: Linear function y = 2x - 5
def gen_q9():
    fig, ax = create_base_plot("Graph of Function: y = 2x - 5", xlim=(-3, 6), ylim=(-8, 8))
    x = np.linspace(-3, 6, 200)
    y = 2*x - 5
    ax.plot(x, y, color=accent_blue, linewidth=2.5, label="y = 2x - 5")
    ax.plot(0, -5, 'o', color=accent_gold, markersize=7)
    ax.text(0.2, -5, "(0, -5)", color=accent_gold, fontsize=9, fontweight='bold')
    ax.plot(2.5, 0, 'o', color=accent_green, markersize=7)
    ax.text(2.6, 0.4, "(2.5, 0)", color=accent_green, fontsize=9, fontweight='bold')
    ax.legend(loc="upper left", facecolor='#0f172a', edgecolor='#475569', labelcolor=text_color, fontsize=9)
    save_fig(fig, "g9_t154_q9.png")

# Q10: Square Root curve f(x) = sqrt(x - 3)
def gen_q10():
    fig, ax = create_base_plot("Graph of Function: f(x) = √(x - 3)", xlim=(-1, 12), ylim=(-1, 5))
    x = np.linspace(3, 12, 200)
    y = np.sqrt(x - 3)
    ax.plot(x, y, color=accent_blue, linewidth=2.5, label="f(x) = √(x - 3)")
    ax.plot(3, 0, 'o', color=accent_gold, markersize=8)
    ax.text(3.2, 0.3, "Starting point (3, 0)", color=accent_gold, fontsize=9, fontweight='bold')
    ax.legend(loc="upper left", facecolor='#0f172a', edgecolor='#475569', labelcolor=text_color, fontsize=9)
    save_fig(fig, "g9_t154_q10.png")

# Q18: Step Graph for Tricycle Fare
def gen_q18():
    fig, ax = create_base_plot("Tricycle Fare Model F(d)", xlabel="Distance d (km)", ylabel="Fare F(d) (₱)",
                               xlim=(0, 5), ylim=(0, 30))
    # Steps: (0, 1] -> 15, (1, 2] -> 18, (2, 3] -> 21, (3, 4] -> 24
    steps = [(0, 1, 15), (1, 2, 18), (2, 3, 21), (3, 4, 24)]
    for x1, x2, y in steps:
        ax.plot([x1, x2], [y, y], color=accent_blue, linewidth=2.5)
        ax.plot(x1, y, 'o', color=card_color, markeredgecolor=accent_blue, markeredgewidth=1.5, markersize=6)
        ax.plot(x2, y, 'o', color=accent_blue, markersize=6)
    save_fig(fig, "g9_t154_q18.png")

# Q19: One-to-one mapping
def gen_q19():
    draw_mapping_diagram("Set X", "Set Y", ['A', 'B', 'C', 'D'], [1, 2, 3, 4],
                         [('A', 1), ('B', 2), ('C', 3), ('D', 4)],
                         "One-to-One Correspondence (Function)", "g9_t154_q19.png")

# Q20: One-to-many mapping
def gen_q20():
    draw_mapping_diagram("Set X", "Set Y", [1, 2, 3], [10, 20, 30],
                         [(1, 10), (1, 20), (2, 30), (3, 30)],
                         "One-to-Many Correspondence (NOT a Function)", "g9_t154_q20.png")

# Q21: Discrete domain parabola points
def gen_q21():
    fig, ax = create_base_plot("Function f(x) = x² - 4 for D = {-3, -1, 0, 2, 5}", xlim=(-4, 6), ylim=(-6, 25))
    x_curve = np.linspace(-3.5, 5.5, 200)
    ax.plot(x_curve, x_curve**2 - 4, color='#334155', linestyle=':', linewidth=1.5, label="y = x² - 4 curve")
    
    pts = [(-3, 5), (-1, -3), (0, -4), (2, 0), (5, 21)]
    for x, y in pts:
        ax.plot(x, y, 'o', color=accent_gold, markersize=8, markeredgecolor='white', markeredgewidth=1.5)
        ax.text(x + 0.2, y + 0.5, f"({x}, {y})", color=text_color, fontsize=9, fontweight='bold')
        
    ax.legend(loc="upper left", facecolor='#0f172a', edgecolor='#475569', labelcolor=text_color, fontsize=9)
    save_fig(fig, "g9_t154_q21.png")

# Q23: Line segment graph
def gen_q23():
    fig, ax = create_base_plot("Line Segment Function Graph", xlim=(-6, 8), ylim=(-4, 7))
    ax.plot([-4, 6], [-2, 5], color=accent_blue, linewidth=3, label="Segment f(x)")
    ax.plot(-4, -2, 'o', color=accent_gold, markersize=9, label="Endpoint (-4, -2)")
    ax.plot(6, 5, 'o', color=accent_gold, markersize=9, label="Endpoint (6, 5)")
    ax.text(-4, -3, "(-4, -2)", color=accent_gold, fontsize=10, fontweight='bold', ha='center')
    ax.text(6, 5.5, "(6, 5)", color=accent_gold, fontsize=10, fontweight='bold', ha='center')
    ax.legend(loc="upper left", facecolor='#0f172a', edgecolor='#475569', labelcolor=text_color, fontsize=9)
    save_fig(fig, "g9_t154_q23.png")

# Q24: Absolute value function f(x) = |x - 2| + 3
def gen_q24():
    fig, ax = create_base_plot("Graph of f(x) = |x - 2| + 3", xlim=(-3, 7), ylim=(0, 9))
    x = np.linspace(-2, 6, 200)
    y = np.abs(x - 2) + 3
    ax.plot(x, y, color=accent_blue, linewidth=2.5, label="f(x) = |x - 2| + 3")
    ax.plot(2, 3, 'o', color=accent_gold, markersize=9)
    ax.text(2, 2.3, "Vertex (2, 3)", color=accent_gold, fontsize=10, fontweight='bold', ha='center')
    ax.legend(loc="upper left", facecolor='#0f172a', edgecolor='#475569', labelcolor=text_color, fontsize=9)
    save_fig(fig, "g9_t154_q24.png")

# Q26: Sideways parabola x = y^2
def gen_q26():
    fig, ax = create_base_plot("Relation Graph: x = y²", xlim=(-2, 8), ylim=(-4, 4))
    y = np.linspace(-3.5, 3.5, 200)
    x = y**2
    ax.plot(x, y, color=accent_blue, linewidth=2.5, label="x = y²")
    
    # Vertical line x = 4
    ax.axvline(4, color=accent_red, linestyle='--', linewidth=1.8, label="Vertical Line x = 4")
    ax.plot(4, 2, 'o', color=accent_gold, markersize=8)
    ax.plot(4, -2, 'o', color=accent_gold, markersize=8)
    ax.text(4.3, 2, "(4, 2)", color=accent_gold, fontsize=9, fontweight='bold')
    ax.text(4.3, -2, "(4, -2)", color=accent_gold, fontsize=9, fontweight='bold')
    
    ax.legend(loc="upper left", facecolor='#0f172a', edgecolor='#475569', labelcolor=text_color, fontsize=9)
    save_fig(fig, "g9_t154_q26.png")

# Q28: Water tank linear graph
def gen_q28():
    fig, ax = create_base_plot("Water Tank Volume V(t) = 1200 - 25t", xlabel="Time t (minutes)", ylabel="Volume V (Liters)",
                               xlim=(-2, 55), ylim=(-50, 1350))
    t = np.linspace(0, 48, 200)
    V = 1200 - 25*t
    ax.plot(t, V, color=accent_blue, linewidth=2.5, label="V(t) = 1200 - 25t")
    ax.plot(0, 1200, 'o', color=accent_gold, markersize=8)
    ax.text(2, 1200, "(0, 1200)", color=accent_gold, fontsize=9, fontweight='bold')
    ax.plot(48, 0, 'o', color=accent_green, markersize=8)
    ax.text(48, 50, "(48, 0)", color=accent_green, fontsize=9, fontweight='bold', ha='right')
    ax.legend(loc="upper right", facecolor='#0f172a', edgecolor='#475569', labelcolor=text_color, fontsize=9)
    save_fig(fig, "g9_t154_q28.png")

# Q31: Parking fee step graph
def gen_q31():
    fig, ax = create_base_plot("Parking Fee Piecewise Function P(t)", xlabel="Hours t", ylabel="Fee P(t) (₱)",
                               xlim=(0, 6), ylim=(0, 80))
    # Steps: (0, 2] -> 30, (2, 3] -> 45, (3, 4] -> 60, (4, 5] -> 75
    steps = [(0, 2, 30), (2, 3, 45), (3, 4, 60), (4, 5, 75)]
    for x1, x2, y in steps:
        ax.plot([x1, x2], [y, y], color=accent_blue, linewidth=2.5)
        ax.plot(x1, y, 'o', color=card_color, markeredgecolor=accent_blue, markeredgewidth=1.5, markersize=6)
        ax.plot(x2, y, 'o', color=accent_blue, markersize=6)
    save_fig(fig, "g9_t154_q31.png")

# Q32: Table of values first difference
def gen_q32():
    fig, ax = plt.subplots(figsize=(6.5, 4.5), facecolor=bg_color)
    ax.set_facecolor(card_color)
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 6)
    ax.axis('off')
    ax.set_title("Table of Values: Testing First Differences", color=accent_gold, fontsize=13, fontweight='bold')
    
    xs = [1, 2, 3, 4, 5]
    ys = [7, 11, 15, 19, 23]
    
    # Table headers
    ax.text(1, 4.5, "x", color=accent_blue, fontsize=14, fontweight='bold', ha='center')
    ax.text(1, 3.2, "y", color=accent_green, fontsize=14, fontweight='bold', ha='center')
    ax.text(1, 1.8, "Δy", color=accent_gold, fontsize=14, fontweight='bold', ha='center')
    
    ax.axhline(4.0, color='#475569', linewidth=1.5)
    ax.axhline(2.7, color='#475569', linewidth=1.5)
    
    for idx in range(5):
        cx = 2.5 + idx * 1.4
        ax.text(cx, 4.5, str(xs[idx]), color=text_color, fontsize=12, fontweight='bold', ha='center')
        ax.text(cx, 3.2, str(ys[idx]), color=text_color, fontsize=12, fontweight='bold', ha='center')
        if idx < 4:
            ax.text(cx + 0.7, 1.8, "+4", color=accent_gold, fontsize=12, fontweight='bold', ha='center')
            
    save_fig(fig, "g9_t154_q32.png")

# Q33: Zeros of f(x) = 5x - 35
def gen_q33():
    fig, ax = create_base_plot("Graph of f(x) = 5x - 35", xlim=(2, 10), ylim=(-20, 20))
    x = np.linspace(3, 9, 200)
    y = 5*x - 35
    ax.plot(x, y, color=accent_blue, linewidth=2.5, label="f(x) = 5x - 35")
    ax.plot(7, 0, 'o', color=accent_gold, markersize=9)
    ax.text(7, 2, "Zero: x = 7", color=accent_gold, fontsize=10, fontweight='bold', ha='center')
    ax.legend(loc="upper left", facecolor='#0f172a', edgecolor='#475569', labelcolor=text_color, fontsize=9)
    save_fig(fig, "g9_t154_q33.png")

# Q34: Zeros of parabola g(x) = x^2 - 7x + 12
def gen_q34():
    fig, ax = create_base_plot("Zeros of Quadratic Function: g(x) = x² - 7x + 12", xlim=(1, 6), ylim=(-2, 6))
    x = np.linspace(1.5, 5.5, 200)
    y = x**2 - 7*x + 12
    ax.plot(x, y, color=accent_blue, linewidth=2.5, label="g(x) = x² - 7x + 12")
    ax.plot(3, 0, 'o', color=accent_gold, markersize=9)
    ax.plot(4, 0, 'o', color=accent_gold, markersize=9)
    ax.text(3, -0.6, "x = 3", color=accent_gold, fontsize=10, fontweight='bold', ha='center')
    ax.text(4, -0.6, "x = 4", color=accent_gold, fontsize=10, fontweight='bold', ha='center')
    ax.legend(loc="upper left", facecolor='#0f172a', edgecolor='#475569', labelcolor=text_color, fontsize=9)
    save_fig(fig, "g9_t154_q34.png")

# Q35: Independent vs Dependent block diagram
def gen_q35():
    fig, ax = plt.subplots(figsize=(6.5, 4.5), facecolor=bg_color)
    ax.set_facecolor(card_color)
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 5)
    ax.axis('off')
    ax.set_title("Function Machine: Independent vs Dependent Variables", color=accent_gold, fontsize=12, fontweight='bold')
    
    from matplotlib.patches import FancyBboxPatch
    # Input Box
    p1 = FancyBboxPatch((0.5, 1.5), 2.6, 2.0, boxstyle="round,pad=0.2", fc='#0f172a', ec=accent_blue, lw=2)
    ax.add_patch(p1)
    ax.text(1.8, 2.7, "INPUT (x)", color=accent_blue, fontsize=11, fontweight='bold', ha='center')
    ax.text(1.8, 2.0, "Independent\nVariable", color=text_color, fontsize=9, ha='center')
    
    # Machine Box
    p2 = FancyBboxPatch((3.8, 1.3), 2.4, 2.4, boxstyle="round,pad=0.2", fc='#0f172a', ec=accent_gold, lw=2)
    ax.add_patch(p2)
    ax.text(5.0, 2.7, "FUNCTION", color=accent_gold, fontsize=11, fontweight='bold', ha='center')
    ax.text(5.0, 2.2, "Rule f(x)", color=accent_gold, fontsize=10, ha='center')
    ax.text(5.0, 1.7, "Process", color=text_color, fontsize=9, ha='center')
    
    # Output Box
    p3 = FancyBboxPatch((6.9, 1.5), 2.6, 2.0, boxstyle="round,pad=0.2", fc='#0f172a', ec=accent_green, lw=2)
    ax.add_patch(p3)
    ax.text(8.2, 2.7, "OUTPUT (y)", color=accent_green, fontsize=11, fontweight='bold', ha='center')
    ax.text(8.2, 2.0, "Dependent\nVariable", color=text_color, fontsize=9, ha='center')
    
    # Arrows
    ax.annotate("", xy=(3.7, 2.5), xytext=(3.2, 2.5), arrowprops=dict(arrowstyle="->", color=accent_gold, lw=2, mutation_scale=15))
    ax.annotate("", xy=(6.8, 2.5), xytext=(6.3, 2.5), arrowprops=dict(arrowstyle="->", color=accent_gold, lw=2, mutation_scale=15))
    
    save_fig(fig, "g9_t154_q35.png")

# Q36: Plant growth line
def gen_q36():
    fig, ax = create_base_plot("Bean Plant Growth: h(d) = 1.5d + 2", xlabel="Days d", ylabel="Height h (cm)",
                               xlim=(-1, 10), ylim=(0, 18))
    d = np.linspace(0, 9, 200)
    h = 1.5*d + 2
    ax.plot(d, h, color=accent_blue, linewidth=2.5, label="h(d) = 1.5d + 2")
    ax.plot(0, 2, 'o', color=accent_gold, markersize=8)
    ax.text(0.3, 2, "y-intercept = 2 cm (Initial height)", color=accent_gold, fontsize=9, fontweight='bold')
    ax.legend(loc="upper left", facecolor='#0f172a', edgecolor='#475569', labelcolor=text_color, fontsize=9)
    save_fig(fig, "g9_t154_q36.png")

# Q38: Graph f(x) = -2x + 4
def gen_q38():
    fig, ax = create_base_plot("Graph of Function: f(x) = -2x + 4", xlim=(-2, 5), ylim=(-4, 8))
    x = np.linspace(-1.5, 4.5, 200)
    y = -2*x + 4
    ax.plot(x, y, color=accent_blue, linewidth=2.5, label="f(x) = -2x + 4")
    ax.plot(0, 4, 'o', color=accent_gold, markersize=8)
    ax.plot(2, 0, 'o', color=accent_green, markersize=8)
    ax.text(0.2, 4, "y-intercept (0, 4)", color=accent_gold, fontsize=9, fontweight='bold')
    ax.text(2.1, 0.4, "x-intercept (2, 0)", color=accent_green, fontsize=9, fontweight='bold')
    ax.legend(loc="upper right", facecolor='#0f172a', edgecolor='#475569', labelcolor=text_color, fontsize=9)
    save_fig(fig, "g9_t154_q38.png")

# Q39: Intercepts of f(x) = (3/4)x - 6
def gen_q39():
    fig, ax = create_base_plot("Interpreting Intercepts: f(x) = (3/4)x - 6", xlim=(-2, 11), ylim=(-9, 4))
    x = np.linspace(-1, 10, 200)
    y = 0.75*x - 6
    ax.plot(x, y, color=accent_blue, linewidth=2.5, label="f(x) = (3/4)x - 6")
    ax.plot(8, 0, 'o', color=accent_green, markersize=8)
    ax.plot(0, -6, 'o', color=accent_gold, markersize=8)
    ax.text(8, 0.6, "x-intercept (8, 0)", color=accent_green, fontsize=9, fontweight='bold', ha='center')
    ax.text(0.3, -6, "y-intercept (0, -6)", color=accent_gold, fontsize=9, fontweight='bold')
    ax.legend(loc="upper left", facecolor='#0f172a', edgecolor='#475569', labelcolor=text_color, fontsize=9)
    save_fig(fig, "g9_t154_q39.png")

# Q40: Printing company piecewise cost
def gen_q40():
    fig, ax = create_base_plot("Printing Company Piecewise Cost P(n)", xlabel="Pages n", ylabel="Cost P(n) (₱)",
                               xlim=(-10, 220), ylim=(-20, 500))
    n1 = np.linspace(0, 100, 100)
    p1 = 2.50 * n1
    n2 = np.linspace(100, 200, 100)
    p2 = 250 + 1.80 * (n2 - 100)
    
    ax.plot(n1, p1, color=accent_blue, linewidth=2.5, label="Rate: ₱2.50/page (n ≤ 100)")
    ax.plot(n2, p2, color=accent_green, linewidth=2.5, label="Rate: ₱1.80/page (n > 100)")
    ax.plot(100, 250, 'o', color=accent_gold, markersize=8)
    ax.text(100, 270, "Transition point (100, ₱250)", color=accent_gold, fontsize=9, fontweight='bold', ha='center')
    ax.legend(loc="upper left", facecolor='#0f172a', edgecolor='#475569', labelcolor=text_color, fontsize=9)
    save_fig(fig, "g9_t154_q40.png")

# Q42: Upper semicircle y = sqrt(25 - x^2)
def gen_q42():
    fig, ax = create_base_plot("Upper Semicircle Function: y = √(25 - x²)", xlim=(-7, 7), ylim=(-1, 7))
    x = np.linspace(-5, 5, 200)
    y = np.sqrt(25 - x**2)
    ax.plot(x, y, color=accent_blue, linewidth=2.5, label="y = √(25 - x²)")
    ax.plot(-5, 0, 'o', color=accent_gold, markersize=7)
    ax.plot(5, 0, 'o', color=accent_gold, markersize=7)
    ax.plot(0, 5, 'o', color=accent_green, markersize=7)
    ax.text(0, 5.4, "Peak (0, 5)", color=accent_green, fontsize=9, fontweight='bold', ha='center')
    ax.legend(loc="upper right", facecolor='#0f172a', edgecolor='#475569', labelcolor=text_color, fontsize=9)
    save_fig(fig, "g9_t154_q42.png")

# Q43: Vertical line x = c
def gen_q43():
    fig, ax = create_base_plot("Vertical Line Graph: x = 3 (NOT a function)", xlim=(-2, 7), ylim=(-5, 5))
    ax.axvline(3, color=accent_red, linewidth=2.5, label="Vertical Line x = 3")
    y_pts = [-3, -1, 1, 3]
    for y in y_pts:
        ax.plot(3, y, 'o', color=accent_gold, markersize=7)
    ax.text(3.3, 0, "Infinitely many outputs y\nfor single input x = 3", color=accent_gold, fontsize=9, fontweight='bold')
    ax.legend(loc="upper left", facecolor='#0f172a', edgecolor='#475569', labelcolor=text_color, fontsize=9)
    save_fig(fig, "g9_t154_q43.png")

# Q44: Horizontal line y = k
def gen_q44():
    fig, ax = create_base_plot("Horizontal Line Graph: y = 4 (IS a function)", xlim=(-6, 6), ylim=(-1, 7))
    ax.axhline(4, color=accent_blue, linewidth=2.5, label="Horizontal Line y = 4")
    
    # Vertical line test passing
    ax.axvline(2, color=accent_green, linestyle='--', linewidth=1.5, label="Vertical Line (1 intersection)")
    ax.plot(2, 4, 'o', color=accent_gold, markersize=8)
    
    ax.axvline(-3, color=accent_green, linestyle='--', linewidth=1.5)
    ax.plot(-3, 4, 'o', color=accent_gold, markersize=8)
    
    ax.legend(loc="lower right", facecolor='#0f172a', edgecolor='#475569', labelcolor=text_color, fontsize=9)
    save_fig(fig, "g9_t154_q44.png")

# Q46: Floor step function
def gen_q46():
    fig, ax = create_base_plot("Greatest Integer Function f(x) = ⌊x⌋", xlim=(-3, 5), ylim=(-4, 5))
    for k in range(-3, 5):
        ax.plot([k, k+1], [k, k], color=accent_blue, linewidth=2.5)
        ax.plot(k, k, 'o', color=accent_blue, markersize=6)
        ax.plot(k+1, k, 'o', color=card_color, markeredgecolor=accent_blue, markeredgewidth=1.5, markersize=6)
    save_fig(fig, "g9_t154_q46.png")

# Q47: Overtime worker pay
def gen_q47():
    fig, ax = create_base_plot("Weekly Pay Function W(h)", xlabel="Hours Worked h", ylabel="Pay W(h) (₱)",
                               xlim=(-5, 65), ylim=(-200, 6000))
    h1 = np.linspace(0, 40, 100)
    w1 = 75 * h1
    h2 = np.linspace(40, 60, 100)
    w2 = 3000 + 112.50 * (h2 - 40)
    
    ax.plot(h1, w1, color=accent_blue, linewidth=2.5, label="Regular Rate: ₱75/hr (h ≤ 40)")
    ax.plot(h2, w2, color=accent_green, linewidth=2.5, label="Overtime Rate: ₱112.50/hr (h > 40)")
    ax.plot(40, 3000, 'o', color=accent_gold, markersize=8)
    ax.text(40, 3300, "Base 40 hrs = ₱3,000", color=accent_gold, fontsize=9, fontweight='bold', ha='center')
    ax.legend(loc="upper left", facecolor='#0f172a', edgecolor='#475569', labelcolor=text_color, fontsize=9)
    save_fig(fig, "g9_t154_q47.png")

# Q50: Parabola f(x) = -x^2 + 6x - 5
def gen_q50():
    fig, ax = create_base_plot("Graph of Quadratic Function: f(x) = -x² + 6x - 5", xlim=(-1, 7), ylim=(-6, 6))
    x = np.linspace(-0.5, 6.5, 200)
    y = -x**2 + 6*x - 5
    ax.plot(x, y, color=accent_blue, linewidth=2.5, label="f(x) = -x² + 6x - 5")
    ax.plot(3, 4, 'o', color=accent_gold, markersize=9)
    ax.plot(1, 0, 'o', color=accent_green, markersize=7)
    ax.plot(5, 0, 'o', color=accent_green, markersize=7)
    ax.text(3, 4.5, "Vertex (3, 4)", color=accent_gold, fontsize=10, fontweight='bold', ha='center')
    ax.text(1, -0.8, "(1, 0)", color=accent_green, fontsize=9, fontweight='bold', ha='center')
    ax.text(5, -0.8, "(5, 0)", color=accent_green, fontsize=9, fontweight='bold', ha='center')
    ax.legend(loc="upper left", facecolor='#0f172a', edgecolor='#475569', labelcolor=text_color, fontsize=9)
    save_fig(fig, "g9_t154_q50.png")

def main():
    gen_q2()
    gen_q3()
    gen_q4()
    gen_q5()
    gen_q6()
    gen_q7()
    gen_q8()
    gen_q9()
    gen_q10()
    gen_q18()
    gen_q19()
    gen_q20()
    gen_q21()
    gen_q23()
    gen_q24()
    gen_q26()
    gen_q28()
    gen_q31()
    gen_q32()
    gen_q33()
    gen_q34()
    gen_q35()
    gen_q36()
    gen_q38()
    gen_q39()
    gen_q40()
    gen_q42()
    gen_q43()
    gen_q44()
    gen_q46()
    gen_q47()
    gen_q50()
    print("All 32 T154 images generated successfully!")

if __name__ == '__main__':
    main()
