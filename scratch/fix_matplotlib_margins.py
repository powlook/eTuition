import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches

TARGET_DIRS = [
    'public/images',
    'QBank/public/images',
    'dist/images',
    'QBank/dist/images'
]

def generate_perfect_pngs():
    for q_num in range(1, 51):
        type_idx = (q_num - 1) % 10 + 1
        filename = f"g8_t137_q{q_num}"
        
        plt.figure(figsize=(4.8, 3.6), dpi=100, facecolor='#0f172a')
        ax = plt.subplot(111)
        ax.set_facecolor('#0f172a')
        ax.axis('off')
        ax.set_xlim(0, 1)
        ax.set_ylim(0, 1)
        
        if type_idx == 1:
            title = "Right Triangle ABC"
            ax.plot([0.3, 0.8, 0.3, 0.3], [0.22, 0.22, 0.78, 0.22], color='#38bdf8', lw=2.5)
            # Right angle symbol
            ax.plot([0.3, 0.35, 0.35], [0.26, 0.26, 0.22], color='#38bdf8', lw=1.5)
            ax.text(0.25, 0.5, "a = 9 cm", color='#f8fafc', weight='bold', fontsize=11, ha='right', va='center')
            ax.text(0.55, 0.14, "b = 12 cm", color='#f8fafc', weight='bold', fontsize=11, ha='center', va='top')
            ax.text(0.58, 0.55, "c = ?", color='#38bdf8', weight='bold', fontsize=13, ha='left', va='center')
            ax.text(0.28, 0.82, "A", color='#94a3b8', weight='bold', fontsize=11)
            ax.text(0.82, 0.20, "B", color='#94a3b8', weight='bold', fontsize=11)
            ax.text(0.27, 0.18, "C", color='#94a3b8', weight='bold', fontsize=11)

        elif type_idx == 2:
            title = "Right Triangle - Missing Leg"
            ax.plot([0.3, 0.8, 0.3, 0.3], [0.22, 0.22, 0.78, 0.22], color='#38bdf8', lw=2.5)
            ax.plot([0.3, 0.35, 0.35], [0.26, 0.26, 0.22], color='#38bdf8', lw=1.5)
            ax.text(0.25, 0.5, "a = ?", color='#38bdf8', weight='bold', fontsize=13, ha='right', va='center')
            ax.text(0.55, 0.14, "b = 7 cm", color='#f8fafc', weight='bold', fontsize=11, ha='center', va='top')
            ax.text(0.58, 0.55, "c = 25 cm", color='#f8fafc', weight='bold', fontsize=11, ha='left', va='center')

        elif type_idx == 3:
            title = "Triangle Side Lengths"
            ax.plot([0.3, 0.8, 0.3, 0.3], [0.22, 0.22, 0.78, 0.22], color='#38bdf8', lw=2.5)
            ax.text(0.25, 0.5, "a = 8 cm", color='#f8fafc', weight='bold', fontsize=11, ha='right', va='center')
            ax.text(0.55, 0.14, "b = 15 cm", color='#f8fafc', weight='bold', fontsize=11, ha='center', va='top')
            ax.text(0.58, 0.55, "c = 17 cm", color='#f8fafc', weight='bold', fontsize=11, ha='left', va='center')

        elif type_idx == 4:
            title = "Triangle Side Lengths"
            ax.plot([0.25, 0.8, 0.4, 0.25], [0.22, 0.22, 0.78, 0.22], color='#38bdf8', lw=2.5)
            ax.text(0.30, 0.5, "a = 7 cm", color='#f8fafc', weight='bold', fontsize=11, ha='right', va='center')
            ax.text(0.525, 0.14, "b = 10 cm", color='#f8fafc', weight='bold', fontsize=11, ha='center', va='top')
            ax.text(0.62, 0.5, "c = 12 cm", color='#f8fafc', weight='bold', fontsize=11, ha='left', va='center')

        elif type_idx == 5:
            title = "Rescue Ladder Scenario"
            ax.plot([0.28, 0.28], [0.22, 0.82], color='#64748b', lw=5)
            ax.plot([0.18, 0.85], [0.22, 0.22], color='#475569', lw=3)
            ax.plot([0.75, 0.28], [0.22, 0.78], color='#38bdf8', lw=2.5, ls='--')
            ax.text(0.24, 0.5, "Wall = 12 m", color='#f8fafc', weight='bold', fontsize=11, ha='right', va='center')
            ax.text(0.515, 0.14, "Ground Distance = ?", color='#38bdf8', weight='bold', fontsize=12, ha='center', va='top')
            ax.text(0.54, 0.52, "Ladder = 15 m", color='#f8fafc', weight='bold', fontsize=11, ha='left', va='center')

        elif type_idx == 6:
            title = "TV Screen Dimensions"
            rect = patches.Rectangle((0.26, 0.26), 0.52, 0.48, facecolor="#1e293b", edgecolor="#64748b", lw=3)
            ax.add_patch(rect)
            ax.plot([0.26, 0.78], [0.26, 0.74], color='#38bdf8', lw=2.5, ls='--')
            ax.text(0.52, 0.16, 'Width = 40"', color='#f8fafc', weight='bold', fontsize=11, ha='center', va='top')
            ax.text(0.22, 0.5, 'Height = 30"', color='#f8fafc', weight='bold', fontsize=11, ha='right', va='center')
            ax.text(0.52, 0.52, "Diagonal = ?", color='#38bdf8', weight='bold', fontsize=13, ha='center', va='center')

        elif type_idx == 7:
            title = "Rectangle Dimensions"
            rect = patches.Rectangle((0.26, 0.26), 0.52, 0.48, facecolor="#1e293b", edgecolor="#38bdf8", lw=2.5)
            ax.add_patch(rect)
            ax.plot([0.26, 0.78], [0.26, 0.74], color='#38bdf8', lw=2.5, ls='--')
            ax.text(0.52, 0.16, "Width = 16 cm", color='#f8fafc', weight='bold', fontsize=11, ha='center', va='top')
            ax.text(0.22, 0.5, "Height = 12 cm", color='#f8fafc', weight='bold', fontsize=11, ha='right', va='center')
            ax.text(0.52, 0.52, "Diagonal = ?", color='#38bdf8', weight='bold', fontsize=13, ha='center', va='center')

        elif type_idx == 8:
            title = "Compass Displacement Path"
            ax.plot([0.3, 0.3, 0.75], [0.22, 0.75, 0.75], color='#38bdf8', lw=2.5)
            ax.plot([0.3, 0.75], [0.22, 0.75], color='#0284c7', lw=2.5, ls='--')
            ax.plot(0.3, 0.22, 'o', color='#38bdf8', ms=6)
            ax.plot(0.75, 0.75, 'o', color='#38bdf8', ms=6)
            ax.text(0.25, 0.48, "North = 6 km", color='#f8fafc', weight='bold', fontsize=11, ha='right', va='center')
            ax.text(0.525, 0.82, "East = 8 km", color='#f8fafc', weight='bold', fontsize=11, ha='center', va='bottom')
            ax.text(0.55, 0.45, "Direct Distance = ?", color='#38bdf8', weight='bold', fontsize=12, ha='center', va='center')
            ax.text(0.3, 0.16, "Point A", color='#94a3b8', weight='bold', fontsize=10, ha='center', va='top')
            ax.text(0.78, 0.78, "Point B", color='#94a3b8', weight='bold', fontsize=10, ha='left', va='bottom')

        elif type_idx == 9:
            title = "Equilateral Triangle"
            ax.plot([0.25, 0.75, 0.5, 0.25], [0.22, 0.22, 0.78, 0.22], color='#38bdf8', lw=2.5)
            ax.plot([0.5, 0.5], [0.78, 0.22], color='#38bdf8', lw=2, ls='--')
            ax.text(0.34, 0.5, "s = 10 cm", color='#f8fafc', weight='bold', fontsize=11, ha='right', va='center')
            ax.text(0.66, 0.5, "s = 10 cm", color='#f8fafc', weight='bold', fontsize=11, ha='left', va='center')
            ax.text(0.5, 0.14, "s = 10 cm", color='#f8fafc', weight='bold', fontsize=11, ha='center', va='top')
            ax.text(0.52, 0.5, "Altitude h = ?", color='#38bdf8', weight='bold', fontsize=12, ha='left', va='center')

        elif type_idx == 10:
            title = "Tower & Guy Wire"
            ax.plot([0.28, 0.28], [0.22, 0.82], color='#64748b', lw=5)
            ax.plot([0.18, 0.85], [0.22, 0.22], color='#475569', lw=3)
            ax.plot([0.75, 0.28], [0.22, 0.82], color='#38bdf8', lw=2.5, ls='--')
            ax.text(0.24, 0.5, "Tower = 24 m", color='#f8fafc', weight='bold', fontsize=11, ha='right', va='center')
            ax.text(0.515, 0.14, "Anchor = 10 m", color='#f8fafc', weight='bold', fontsize=11, ha='center', va='top')
            ax.text(0.54, 0.52, "Guy Wire = ?", color='#38bdf8', weight='bold', fontsize=13, ha='left', va='center')

        # Header Title
        ax.text(0.5, 0.93, title, color='#38bdf8', weight='bold', fontsize=12, ha='center', va='center',
                bbox=dict(boxstyle="round,pad=0.4", facecolor="#1e293b", edgecolor="none"))

        plt.subplots_adjust(left=0.02, right=0.98, top=0.98, bottom=0.02)

        for target_dir in TARGET_DIRS:
            png_path = os.path.join(target_dir, f"{filename}.png")
            plt.savefig(png_path, facecolor='#0f172a', edgecolor='none')
            
        plt.close()

    print("Generated perfectly padded PNGs for all 50 questions!")

generate_perfect_pngs()
