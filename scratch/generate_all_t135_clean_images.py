import os
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

def create_plot(q_num):
    base_type = ((q_num - 1) % 10) + 1
    
    fig, ax = plt.subplots(figsize=(6, 4.5), dpi=100)
    fig.patch.set_facecolor('#0f172a')
    ax.set_facecolor('#0f172a')
    
    # Common grid and styling
    ax.grid(True, color='#334155', linestyle='--', linewidth=0.7, alpha=0.7)
    for spine in ax.spines.values():
        spine.set_color('#475569')
        spine.set_linewidth(1.2)
    ax.tick_params(colors='#94a3b8', labelsize=9)
    
    if base_type in [1, 11, 21, 31, 41]: # Test points for 3x - 2y <= 6
        x = np.linspace(-6, 6, 200)
        y = (3*x - 6) / 2
        ax.plot(x, y, color='#38bdf8', linewidth=2.5, label='L: 3x - 2y = 6')
        
        pts = [(0, 0), (2, -3), (-1, 5)]
        for px, py in pts:
            ax.plot(px, py, 'o', color='#fbbf24', markersize=8, markeredgecolor='#ffffff', markeredgewidth=1.5)
            ax.annotate(f'({px}, {py})', (px, py), textcoords="offset points", xytext=(8, 5),
                        color='#f8fafc', fontsize=10, fontweight='bold')
            
        ax.set_xlim(-5, 5)
        ax.set_ylim(-6, 6)
        ax.set_title(f"Q{q_num}: Boundary Line & Test Points", color='#38bdf8', fontsize=12, fontweight='bold', pad=12)
        ax.set_xlabel("X", color='#94a3b8', fontsize=9)
        ax.set_ylabel("Y", color='#94a3b8', fontsize=9)
        ax.legend(loc='upper left', facecolor='#1e293b', edgecolor='#38bdf8', labelcolor='#38bdf8')
        
        # Question target label box
        fig.text(0.5, 0.03, "Satisfies 3x - 2y ≤ 6? = ?", ha='center', va='center',
                 color='#38bdf8', fontsize=11, fontweight='bold',
                 bbox=dict(boxstyle='round,pad=0.5', facecolor='#1e293b', edgecolor='#38bdf8', linewidth=1.5))

    elif base_type in [2, 12, 22, 32, 42]: # Strict inequality 2x + y > 4
        x = np.linspace(-3, 6, 200)
        y = 4 - 2*x
        ax.plot(x, y, color='#f43f5e', linewidth=2.5, linestyle='--', label='L: 2x + y = 4 (Dashed)')
        
        pts = [(3, 3), (0, 0)]
        for px, py in pts:
            ax.plot(px, py, 'o', color='#38bdf8', markersize=7, markeredgecolor='#ffffff')
            ax.annotate(f'({px}, {py})', (px, py), textcoords="offset points", xytext=(8, 5),
                        color='#f8fafc', fontsize=9, fontweight='bold')
            
        ax.set_xlim(-2, 5)
        ax.set_ylim(-3, 6)
        ax.set_title(f"Q{q_num}: Linear Inequality Graphing", color='#38bdf8', fontsize=12, fontweight='bold', pad=12)
        ax.legend(loc='upper right', facecolor='#1e293b', edgecolor='#f43f5e', labelcolor='#f43f5e')
        
        fig.text(0.5, 0.03, "Shaded Region & Line Style = ?", ha='center', va='center',
                 color='#38bdf8', fontsize=11, fontweight='bold',
                 bbox=dict(boxstyle='round,pad=0.5', facecolor='#1e293b', edgecolor='#38bdf8', linewidth=1.5))

    elif base_type in [3, 13, 23, 33, 43]: # Non-strict 3x - 4y <= 12
        x = np.linspace(-4, 7, 200)
        y = (3*x - 12) / 4
        ax.plot(x, y, color='#38bdf8', linewidth=2.5, linestyle='-', label='L: 3x - 4y = 12 (Solid)')
        ax.plot(0, 0, 'o', color='#fbbf24', markersize=8, markeredgecolor='#ffffff')
        ax.annotate('(0, 0)', (0, 0), textcoords="offset points", xytext=(8, 5), color='#f8fafc', fontsize=10, fontweight='bold')
        
        ax.set_xlim(-3, 6)
        ax.set_ylim(-5, 4)
        ax.set_title(f"Q{q_num}: Linear Inequality Graphing", color='#38bdf8', fontsize=12, fontweight='bold', pad=12)
        ax.legend(loc='lower right', facecolor='#1e293b', edgecolor='#38bdf8', labelcolor='#38bdf8')
        
        fig.text(0.5, 0.03, "Shaded Half-Plane = ?", ha='center', va='center',
                 color='#38bdf8', fontsize=11, fontweight='bold',
                 bbox=dict(boxstyle='round,pad=0.5', facecolor='#1e293b', edgecolor='#38bdf8', linewidth=1.5))

    elif base_type in [4, 14, 24, 34, 44]: # Identify inequality from graph (solid line 2x - y = -3)
        x = np.linspace(-4, 4, 200)
        y = 2*x + 3
        ax.plot(x, y, color='#38bdf8', linewidth=2.5, label='Boundary Line L')
        # Shade region containing origin (y <= 2x + 3 => 2x - y >= -3)
        ax.fill_between(x, y, -10, color='#0284c7', alpha=0.35, label='Shaded Region')
        ax.plot(0, 0, 'o', color='#fbbf24', markersize=8, markeredgecolor='#ffffff')
        ax.annotate('(0, 0)', (0, 0), textcoords="offset points", xytext=(8, -15), color='#f8fafc', fontsize=10, fontweight='bold')
        
        ax.set_xlim(-3, 4)
        ax.set_ylim(-3, 8)
        ax.set_title(f"Q{q_num}: Identify Linear Inequality", color='#38bdf8', fontsize=12, fontweight='bold', pad=12)
        ax.legend(loc='upper left', facecolor='#1e293b', edgecolor='#38bdf8', labelcolor='#38bdf8')
        
        fig.text(0.5, 0.03, "Inequality Expression = ?", ha='center', va='center',
                 color='#38bdf8', fontsize=11, fontweight='bold',
                 bbox=dict(boxstyle='round,pad=0.5', facecolor='#1e293b', edgecolor='#38bdf8', linewidth=1.5))

    elif base_type in [5, 15, 25, 35, 45]: # System x + y <= 5, y > x - 2
        x = np.linspace(-2, 7, 200)
        y1 = 5 - x
        y2 = x - 2
        ax.plot(x, y1, color='#38bdf8', linewidth=2.5, linestyle='-', label='L1: x + y = 5')
        ax.plot(x, y2, color='#f43f5e', linewidth=2.5, linestyle='--', label='L2: y = x - 2')
        
        ax.set_xlim(-1, 6)
        ax.set_ylim(-3, 6)
        ax.set_title(f"Q{q_num}: System of Linear Inequalities", color='#38bdf8', fontsize=12, fontweight='bold', pad=12)
        ax.legend(loc='upper right', facecolor='#1e293b', edgecolor='#38bdf8', labelcolor='#38bdf8')
        
        fig.text(0.5, 0.03, "Solution Set Region = ?", ha='center', va='center',
                 color='#38bdf8', fontsize=11, fontweight='bold',
                 bbox=dict(boxstyle='round,pad=0.5', facecolor='#1e293b', edgecolor='#38bdf8', linewidth=1.5))

    elif base_type in [6, 16, 26, 36, 46]: # System point verification 2x - y >= 1, x + 2y < 6
        x = np.linspace(-3, 6, 200)
        y1 = 2*x - 1
        y2 = (6 - x) / 2
        ax.plot(x, y1, color='#38bdf8', linewidth=2.5, linestyle='-', label='L1: 2x - y = 1')
        ax.plot(x, y2, color='#f43f5e', linewidth=2.5, linestyle='--', label='L2: x + 2y = 6')
        
        pts = [(4, 3), (2, 1), (0, 5), (-2, 4)]
        for px, py in pts:
            ax.plot(px, py, 'o', color='#fbbf24', markersize=7, markeredgecolor='#ffffff')
            ax.annotate(f'({px}, {py})', (px, py), textcoords="offset points", xytext=(6, 5), color='#f8fafc', fontsize=9, fontweight='bold')
            
        ax.set_xlim(-3, 5)
        ax.set_ylim(-2, 6)
        ax.set_title(f"Q{q_num}: System Solution Verification", color='#38bdf8', fontsize=12, fontweight='bold', pad=12)
        ax.legend(loc='upper left', facecolor='#1e293b', edgecolor='#38bdf8', labelcolor='#38bdf8')
        
        fig.text(0.5, 0.03, "Valid Solution Point = ?", ha='center', va='center',
                 color='#38bdf8', fontsize=11, fontweight='bold',
                 bbox=dict(boxstyle='round,pad=0.5', facecolor='#1e293b', edgecolor='#38bdf8', linewidth=1.5))

    elif base_type in [7, 17, 27, 37, 47]: # Baker earnings inequality 15x + 10y >= 1200
        x = np.linspace(0, 100, 200)
        y = (1200 - 15*x) / 10
        ax.plot(x, y, color='#38bdf8', linewidth=2.5, label='15x + 10y = 1200')
        
        ax.set_xlim(0, 90)
        ax.set_ylim(0, 130)
        ax.set_xlabel("Cupcakes (x)", color='#94a3b8', fontsize=10)
        ax.set_ylabel("Cookies (y)", color='#94a3b8', fontsize=10)
        ax.set_title(f"Q{q_num}: Baker Earnings Constraint", color='#38bdf8', fontsize=12, fontweight='bold', pad=12)
        ax.legend(loc='upper right', facecolor='#1e293b', edgecolor='#38bdf8', labelcolor='#38bdf8')
        
        fig.text(0.5, 0.03, "Inequality Model = ?", ha='center', va='center',
                 color='#38bdf8', fontsize=11, fontweight='bold',
                 bbox=dict(boxstyle='round,pad=0.5', facecolor='#1e293b', edgecolor='#38bdf8', linewidth=1.5))

    elif base_type in [8, 18, 28, 38, 48]: # Baker goal evaluation (40, 50)
        x = np.linspace(0, 100, 200)
        y = (1200 - 15*x) / 10
        ax.plot(x, y, color='#38bdf8', linewidth=2.5, label='Goal Line: 15x + 10y = 1200')
        ax.plot(40, 50, 'o', color='#fbbf24', markersize=9, markeredgecolor='#ffffff')
        ax.annotate('(40, 50)', (40, 50), textcoords="offset points", xytext=(8, 8), color='#f8fafc', fontsize=10, fontweight='bold')
        
        ax.set_xlim(0, 90)
        ax.set_ylim(0, 130)
        ax.set_xlabel("Cupcakes (x)", color='#94a3b8', fontsize=10)
        ax.set_ylabel("Cookies (y)", color='#94a3b8', fontsize=10)
        ax.set_title(f"Q{q_num}: Goal Evaluation: (40, 50)", color='#38bdf8', fontsize=12, fontweight='bold', pad=12)
        ax.legend(loc='upper right', facecolor='#1e293b', edgecolor='#38bdf8', labelcolor='#38bdf8')
        
        fig.text(0.5, 0.03, "Meets Goal (₱1,200)? = ?", ha='center', va='center',
                 color='#38bdf8', fontsize=11, fontweight='bold',
                 bbox=dict(boxstyle='round,pad=0.5', facecolor='#1e293b', edgecolor='#38bdf8', linewidth=1.5))

    elif base_type in [9, 19, 29, 39, 49]: # Land allocation x + y <= 60, x >= 15
        x = np.linspace(0, 70, 200)
        y = 60 - x
        ax.plot(x, y, color='#38bdf8', linewidth=2.5, label='L1: x + y = 60')
        ax.axvline(15, color='#f43f5e', linewidth=2.5, label='L2: x = 15')
        
        ax.set_xlim(0, 70)
        ax.set_ylim(0, 70)
        ax.set_xlabel("Corn Hectares (x)", color='#94a3b8', fontsize=10)
        ax.set_ylabel("Soybean Hectares (y)", color='#94a3b8', fontsize=10)
        ax.set_title(f"Q{q_num}: Land Allocation Constraints", color='#38bdf8', fontsize=12, fontweight='bold', pad=12)
        ax.legend(loc='upper right', facecolor='#1e293b', edgecolor='#38bdf8', labelcolor='#38bdf8')
        
        fig.text(0.5, 0.03, "System of Inequalities = ?", ha='center', va='center',
                 color='#38bdf8', fontsize=11, fontweight='bold',
                 bbox=dict(boxstyle='round,pad=0.5', facecolor='#1e293b', edgecolor='#38bdf8', linewidth=1.5))

    elif base_type in [10, 20, 30, 40, 50]: # Work schedule x + y <= 20, 80x + 60y >= 1400
        x = np.linspace(0, 25, 200)
        y1 = 20 - x
        y2 = (1400 - 80*x) / 60
        ax.plot(x, y1, color='#38bdf8', linewidth=2.5, label='L1: x + y = 20')
        ax.plot(x, y2, color='#f43f5e', linewidth=2.5, label='L2: 80x + 60y = 1400')
        
        ax.set_xlim(0, 22)
        ax.set_ylim(0, 25)
        ax.set_xlabel("Tutoring Hours (x)", color='#94a3b8', fontsize=10)
        ax.set_ylabel("Cashier Hours (y)", color='#94a3b8', fontsize=10)
        ax.set_title(f"Q{q_num}: Work Schedule Constraints", color='#38bdf8', fontsize=12, fontweight='bold', pad=12)
        ax.legend(loc='upper right', facecolor='#1e293b', edgecolor='#38bdf8', labelcolor='#38bdf8')
        
        fig.text(0.5, 0.03, "System Model = ?", ha='center', va='center',
                 color='#38bdf8', fontsize=11, fontweight='bold',
                 bbox=dict(boxstyle='round,pad=0.5', facecolor='#1e293b', edgecolor='#38bdf8', linewidth=1.5))

    plt.subplots_adjust(left=0.12, right=0.92, top=0.88, bottom=0.18)
    
    # Save SVG & PNG to all target directories
    svg_filename = f"g8_t135_q{q_num}.svg"
    png_filename = f"g8_t135_q{q_num}.png"
    
    # Save primary in public/images
    primary_svg = os.path.join('public/images', svg_filename)
    primary_png = os.path.join('public/images', png_filename)
    
    fig.savefig(primary_svg, format='svg', facecolor=fig.get_facecolor(), edgecolor='none')
    fig.savefig(primary_png, format='png', facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close(fig)
    
    # Copy to all target directories
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

print("Starting generation of 50 clean plots for Topic 135...")
for i in range(1, 51):
    create_plot(i)
    if i % 10 == 0:
        print(f"Generated Q1 to Q{i} clean plots.")

print("All 50 clean plots generated successfully!")
