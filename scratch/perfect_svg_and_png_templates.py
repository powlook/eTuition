import os
import glob
import re
import matplotlib.pyplot as plt
import matplotlib.patches as patches

TARGET_DIRS = [
    'public/images',
    'QBank/public/images',
    'dist/images',
    'QBank/dist/images'
]

for d in TARGET_DIRS:
    os.makedirs(d, exist_ok=True)

def generate_perfect_all():
    for q_num in range(1, 51):
        type_idx = (q_num - 1) % 10 + 1
        filename = f"g8_t137_q{q_num}"
        
        # --- SVG RENDERING ---
        if type_idx == 1:
            title = "Right Triangle ABC"
            svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 320" width="420" height="320">
  <rect width="100%" height="100%" fill="#0f172a" rx="12"/>
  <rect x="20" y="16" width="380" height="36" fill="#1e293b" rx="8"/>
  <text x="210" y="40" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">{title}</text>
  
  <polygon points="120,240 330,240 120,90" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/>
  <path d="M 120 222 L 138 222 L 138 240" fill="none" stroke="#38bdf8" stroke-width="1.8"/>
  
  <text x="95" y="170" font-family="Inter, sans-serif" font-size="14" font-weight="600" fill="#f8fafc" text-anchor="end">a = 9 cm</text>
  <text x="225" y="268" font-family="Inter, sans-serif" font-size="14" font-weight="600" fill="#f8fafc" text-anchor="middle">b = 12 cm</text>
  <text x="245" y="155" font-family="Inter, sans-serif" font-size="15" font-weight="700" fill="#38bdf8" text-anchor="start">c = ?</text>
  
  <text x="110" y="85" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="#94a3b8">A</text>
  <text x="340" y="250" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="#94a3b8">B</text>
  <text x="105" y="255" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="#94a3b8">C</text>
</svg>"""

        elif type_idx == 2:
            title = "Right Triangle - Missing Leg"
            svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 320" width="420" height="320">
  <rect width="100%" height="100%" fill="#0f172a" rx="12"/>
  <rect x="20" y="16" width="380" height="36" fill="#1e293b" rx="8"/>
  <text x="210" y="40" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">{title}</text>
  
  <polygon points="120,240 330,240 120,90" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/>
  <path d="M 120 222 L 138 222 L 138 240" fill="none" stroke="#38bdf8" stroke-width="1.8"/>
  
  <text x="95" y="170" font-family="Inter, sans-serif" font-size="15" font-weight="700" fill="#38bdf8" text-anchor="end">a = ?</text>
  <text x="225" y="268" font-family="Inter, sans-serif" font-size="14" font-weight="600" fill="#f8fafc" text-anchor="middle">b = 7 cm</text>
  <text x="245" y="155" font-family="Inter, sans-serif" font-size="14" font-weight="600" fill="#f8fafc" text-anchor="start">c = 25 cm</text>
</svg>"""

        elif type_idx == 3:
            title = "Triangle Side Lengths"
            svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 320" width="420" height="320">
  <rect width="100%" height="100%" fill="#0f172a" rx="12"/>
  <rect x="20" y="16" width="380" height="36" fill="#1e293b" rx="8"/>
  <text x="210" y="40" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">{title}</text>
  
  <polygon points="110,240 320,240 110,100" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/>
  
  <text x="90" y="175" font-family="Inter, sans-serif" font-size="14" font-weight="600" fill="#f8fafc" text-anchor="end">a = 8 cm</text>
  <text x="215" y="268" font-family="Inter, sans-serif" font-size="14" font-weight="600" fill="#f8fafc" text-anchor="middle">b = 15 cm</text>
  <text x="230" y="160" font-family="Inter, sans-serif" font-size="14" font-weight="600" fill="#f8fafc" text-anchor="start">c = 17 cm</text>
</svg>"""

        elif type_idx == 4:
            title = "Triangle Side Lengths"
            svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 320" width="420" height="320">
  <rect width="100%" height="100%" fill="#0f172a" rx="12"/>
  <rect x="20" y="16" width="380" height="36" fill="#1e293b" rx="8"/>
  <text x="210" y="40" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">{title}</text>
  
  <polygon points="110,240 320,240 160,100" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/>
  
  <text x="120" y="170" font-family="Inter, sans-serif" font-size="14" font-weight="600" fill="#f8fafc" text-anchor="end">a = 7 cm</text>
  <text x="215" y="268" font-family="Inter, sans-serif" font-size="14" font-weight="600" fill="#f8fafc" text-anchor="middle">b = 10 cm</text>
  <text x="250" y="170" font-family="Inter, sans-serif" font-size="14" font-weight="600" fill="#f8fafc" text-anchor="start">c = 12 cm</text>
</svg>"""

        elif type_idx == 5:
            title = "Rescue Ladder Scenario"
            svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 320" width="420" height="320">
  <rect width="100%" height="100%" fill="#0f172a" rx="12"/>
  <rect x="20" y="16" width="380" height="36" fill="#1e293b" rx="8"/>
  <text x="210" y="40" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">{title}</text>
  
  <line x1="110" y1="80" x2="110" y2="250" stroke="#64748b" stroke-width="6"/>
  <line x1="80" y1="250" x2="340" y2="250" stroke="#475569" stroke-width="3"/>
  <line x1="300" y1="250" x2="110" y2="100" stroke="#38bdf8" stroke-width="3.5" stroke-dasharray="6,4"/>
  
  <text x="95" y="165" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#f8fafc" text-anchor="end">Wall = 12 m</text>
  <text x="220" y="165" font-family="Inter, sans-serif" font-size="14" font-weight="600" fill="#f8fafc" text-anchor="start">Ladder = 15 m</text>
  <text x="205" y="278" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">Ground Distance = ?</text>
</svg>"""

        elif type_idx == 6:
            title = "TV Screen Dimensions"
            svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 320" width="420" height="320">
  <rect width="100%" height="100%" fill="#0f172a" rx="12"/>
  <rect x="20" y="16" width="380" height="36" fill="#1e293b" rx="8"/>
  <text x="210" y="40" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">{title}</text>
  
  <rect x="110" y="80" width="220" height="150" fill="#1e293b" stroke="#64748b" stroke-width="3" rx="6"/>
  <line x1="110" y1="230" x2="330" y2="80" stroke="#38bdf8" stroke-width="2.5" stroke-dasharray="6,4"/>
  
  <text x="220" y="255" font-family="Inter, sans-serif" font-size="14" font-weight="600" fill="#f8fafc" text-anchor="middle">Width = 40&quot;</text>
  <text x="95" y="160" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#f8fafc" text-anchor="end">Height = 30&quot;</text>
  
  <rect x="160" y="138" width="120" height="28" fill="#1e293b" rx="4" stroke="#38bdf8" stroke-width="1"/>
  <text x="220" y="157" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">Diagonal = ?</text>
</svg>"""

        elif type_idx == 7:
            title = "Rectangle Dimensions"
            svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 320" width="420" height="320">
  <rect width="100%" height="100%" fill="#0f172a" rx="12"/>
  <rect x="20" y="16" width="380" height="36" fill="#1e293b" rx="8"/>
  <text x="210" y="40" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">{title}</text>
  
  <rect x="110" y="80" width="220" height="150" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5" rx="4"/>
  <line x1="110" y1="230" x2="330" y2="80" stroke="#38bdf8" stroke-width="2" stroke-dasharray="6,4"/>
  
  <text x="220" y="255" font-family="Inter, sans-serif" font-size="14" font-weight="600" fill="#f8fafc" text-anchor="middle">Width = 16 cm</text>
  <text x="95" y="160" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#f8fafc" text-anchor="end">Height = 12 cm</text>
  
  <rect x="160" y="138" width="120" height="28" fill="#1e293b" rx="4" stroke="#38bdf8" stroke-width="1"/>
  <text x="220" y="157" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">Diagonal = ?</text>
</svg>"""

        elif type_idx == 8:
            title = "Compass Displacement Path"
            svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 320" width="420" height="320">
  <rect width="100%" height="100%" fill="#0f172a" rx="12"/>
  <rect x="20" y="16" width="380" height="36" fill="#1e293b" rx="8"/>
  <text x="210" y="40" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">{title}</text>
  
  <line x1="130" y1="240" x2="130" y2="100" stroke="#38bdf8" stroke-width="2.5"/>
  <line x1="130" y1="100" x2="310" y2="100" stroke="#38bdf8" stroke-width="2.5"/>
  <line x1="130" y1="240" x2="310" y2="100" stroke="#0284c7" stroke-width="2.5" stroke-dasharray="6,4"/>
  
  <circle cx="130" cy="240" r="5" fill="#38bdf8"/>
  <circle cx="310" cy="100" r="5" fill="#38bdf8"/>
  
  <text x="120" y="255" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="#94a3b8">Point A</text>
  <text x="320" y="95" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="#94a3b8">Point B</text>

  <text x="115" y="170" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#f8fafc" text-anchor="end">North = 6 km</text>
  <text x="220" y="85" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#f8fafc" text-anchor="middle">East = 8 km</text>
  <text x="235" y="185" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">Direct Distance = ?</text>
</svg>"""

        elif type_idx == 9:
            title = "Equilateral Triangle"
            svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 320" width="420" height="320">
  <rect width="100%" height="100%" fill="#0f172a" rx="12"/>
  <rect x="20" y="16" width="380" height="36" fill="#1e293b" rx="8"/>
  <text x="210" y="40" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">{title}</text>
  
  <polygon points="110,240 310,240 210,80" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/>
  <line x1="210" y1="80" x2="210" y2="240" stroke="#38bdf8" stroke-width="2" stroke-dasharray="5,4"/>
  <path d="M 210 225 L 225 225 L 225 240" fill="none" stroke="#38bdf8" stroke-width="1.5"/>
  
  <text x="145" y="150" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#f8fafc" text-anchor="end">s = 10 cm</text>
  <text x="275" y="150" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#f8fafc" text-anchor="start">s = 10 cm</text>
  <text x="210" y="265" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#f8fafc" text-anchor="middle">s = 10 cm</text>
  <text x="220" y="160" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="start">Altitude h = ?</text>
</svg>"""

        elif type_idx == 10:
            title = "Tower &amp; Guy Wire"
            svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 320" width="420" height="320">
  <rect width="100%" height="100%" fill="#0f172a" rx="12"/>
  <rect x="20" y="16" width="380" height="36" fill="#1e293b" rx="8"/>
  <text x="210" y="40" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">Tower &amp; Guy Wire</text>
  
  <line x1="110" y1="80" x2="110" y2="250" stroke="#64748b" stroke-width="6"/>
  <line x1="80" y1="250" x2="340" y2="250" stroke="#475569" stroke-width="3"/>
  <line x1="300" y1="250" x2="110" y2="80" stroke="#38bdf8" stroke-width="3" stroke-dasharray="6,4"/>
  
  <text x="95" y="165" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#f8fafc" text-anchor="end">Tower = 24 m</text>
  <text x="205" y="275" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#f8fafc" text-anchor="middle">Anchor = 10 m</text>
  <text x="215" y="155" font-family="Inter, sans-serif" font-size="15" font-weight="700" fill="#38bdf8" text-anchor="start">Guy Wire = ?</text>
</svg>"""

        # Write SVGs
        for target_dir in TARGET_DIRS:
            svg_path = os.path.join(target_dir, f"{filename}.svg")
            with open(svg_path, 'w', encoding='utf-8') as f:
                f.write(svg_content)

        # --- MATPLOTLIB PNG RENDERING ---
        plt.figure(figsize=(4.8, 3.6), dpi=100, facecolor='#0f172a')
        ax = plt.subplot(111)
        ax.set_facecolor('#0f172a')
        ax.axis('off')
        ax.set_xlim(0, 1)
        ax.set_ylim(0, 1)

        title_display = title.replace('&amp;', '&')

        if type_idx == 1:
            ax.plot([0.3, 0.8, 0.3, 0.3], [0.22, 0.22, 0.78, 0.22], color='#38bdf8', lw=2.5)
            ax.plot([0.3, 0.35, 0.35], [0.26, 0.26, 0.22], color='#38bdf8', lw=1.5)
            ax.text(0.25, 0.5, "a = 9 cm", color='#f8fafc', weight='bold', fontsize=11, ha='right', va='center')
            ax.text(0.55, 0.14, "b = 12 cm", color='#f8fafc', weight='bold', fontsize=11, ha='center', va='top')
            ax.text(0.58, 0.55, "c = ?", color='#38bdf8', weight='bold', fontsize=13, ha='left', va='center')
            ax.text(0.28, 0.82, "A", color='#94a3b8', weight='bold', fontsize=11)
            ax.text(0.82, 0.20, "B", color='#94a3b8', weight='bold', fontsize=11)
            ax.text(0.27, 0.18, "C", color='#94a3b8', weight='bold', fontsize=11)

        elif type_idx == 2:
            ax.plot([0.3, 0.8, 0.3, 0.3], [0.22, 0.22, 0.78, 0.22], color='#38bdf8', lw=2.5)
            ax.plot([0.3, 0.35, 0.35], [0.26, 0.26, 0.22], color='#38bdf8', lw=1.5)
            ax.text(0.25, 0.5, "a = ?", color='#38bdf8', weight='bold', fontsize=13, ha='right', va='center')
            ax.text(0.55, 0.14, "b = 7 cm", color='#f8fafc', weight='bold', fontsize=11, ha='center', va='top')
            ax.text(0.58, 0.55, "c = 25 cm", color='#f8fafc', weight='bold', fontsize=11, ha='left', va='center')

        elif type_idx == 3:
            ax.plot([0.3, 0.8, 0.3, 0.3], [0.22, 0.22, 0.78, 0.22], color='#38bdf8', lw=2.5)
            ax.text(0.25, 0.5, "a = 8 cm", color='#f8fafc', weight='bold', fontsize=11, ha='right', va='center')
            ax.text(0.55, 0.14, "b = 15 cm", color='#f8fafc', weight='bold', fontsize=11, ha='center', va='top')
            ax.text(0.58, 0.55, "c = 17 cm", color='#f8fafc', weight='bold', fontsize=11, ha='left', va='center')

        elif type_idx == 4:
            ax.plot([0.25, 0.8, 0.4, 0.25], [0.22, 0.22, 0.78, 0.22], color='#38bdf8', lw=2.5)
            ax.text(0.30, 0.5, "a = 7 cm", color='#f8fafc', weight='bold', fontsize=11, ha='right', va='center')
            ax.text(0.525, 0.14, "b = 10 cm", color='#f8fafc', weight='bold', fontsize=11, ha='center', va='top')
            ax.text(0.62, 0.5, "c = 12 cm", color='#f8fafc', weight='bold', fontsize=11, ha='left', va='center')

        elif type_idx == 5:
            ax.plot([0.28, 0.28], [0.22, 0.82], color='#64748b', lw=5)
            ax.plot([0.18, 0.85], [0.22, 0.22], color='#475569', lw=3)
            ax.plot([0.75, 0.28], [0.22, 0.78], color='#38bdf8', lw=2.5, ls='--')
            ax.text(0.24, 0.5, "Wall = 12 m", color='#f8fafc', weight='bold', fontsize=11, ha='right', va='center')
            ax.text(0.515, 0.14, "Ground Distance = ?", color='#38bdf8', weight='bold', fontsize=12, ha='center', va='top')
            ax.text(0.54, 0.52, "Ladder = 15 m", color='#f8fafc', weight='bold', fontsize=11, ha='left', va='center')

        elif type_idx == 6:
            rect = patches.Rectangle((0.26, 0.26), 0.52, 0.48, facecolor="#1e293b", edgecolor="#64748b", lw=3)
            ax.add_patch(rect)
            ax.plot([0.26, 0.78], [0.26, 0.74], color='#38bdf8', lw=2.5, ls='--')
            ax.text(0.52, 0.16, 'Width = 40"', color='#f8fafc', weight='bold', fontsize=11, ha='center', va='top')
            ax.text(0.22, 0.5, 'Height = 30"', color='#f8fafc', weight='bold', fontsize=11, ha='right', va='center')
            ax.text(0.52, 0.52, "Diagonal = ?", color='#38bdf8', weight='bold', fontsize=12, ha='center', va='center',
                    bbox=dict(boxstyle="round,pad=0.3", facecolor="#1e293b", edgecolor="#38bdf8", lw=1))

        elif type_idx == 7:
            rect = patches.Rectangle((0.26, 0.26), 0.52, 0.48, facecolor="#1e293b", edgecolor="#38bdf8", lw=2.5)
            ax.add_patch(rect)
            ax.plot([0.26, 0.78], [0.26, 0.74], color='#38bdf8', lw=2.5, ls='--')
            ax.text(0.52, 0.16, "Width = 16 cm", color='#f8fafc', weight='bold', fontsize=11, ha='center', va='top')
            ax.text(0.22, 0.5, "Height = 12 cm", color='#f8fafc', weight='bold', fontsize=11, ha='right', va='center')
            ax.text(0.52, 0.52, "Diagonal = ?", color='#38bdf8', weight='bold', fontsize=12, ha='center', va='center',
                    bbox=dict(boxstyle="round,pad=0.3", facecolor="#1e293b", edgecolor="#38bdf8", lw=1))

        elif type_idx == 8:
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
            ax.plot([0.25, 0.75, 0.5, 0.25], [0.22, 0.22, 0.78, 0.22], color='#38bdf8', lw=2.5)
            ax.plot([0.5, 0.5], [0.78, 0.22], color='#38bdf8', lw=2, ls='--')
            ax.text(0.34, 0.5, "s = 10 cm", color='#f8fafc', weight='bold', fontsize=11, ha='right', va='center')
            ax.text(0.66, 0.5, "s = 10 cm", color='#f8fafc', weight='bold', fontsize=11, ha='left', va='center')
            ax.text(0.5, 0.14, "s = 10 cm", color='#f8fafc', weight='bold', fontsize=11, ha='center', va='top')
            ax.text(0.52, 0.5, "Altitude h = ?", color='#38bdf8', weight='bold', fontsize=12, ha='left', va='center')

        elif type_idx == 10:
            ax.plot([0.28, 0.28], [0.22, 0.82], color='#64748b', lw=5)
            ax.plot([0.18, 0.85], [0.22, 0.22], color='#475569', lw=3)
            ax.plot([0.75, 0.28], [0.22, 0.82], color='#38bdf8', lw=2.5, ls='--')
            ax.text(0.24, 0.5, "Tower = 24 m", color='#f8fafc', weight='bold', fontsize=11, ha='right', va='center')
            ax.text(0.515, 0.14, "Anchor = 10 m", color='#f8fafc', weight='bold', fontsize=11, ha='center', va='top')
            ax.text(0.54, 0.52, "Guy Wire = ?", color='#38bdf8', weight='bold', fontsize=13, ha='left', va='center')

        ax.text(0.5, 0.93, title_display, color='#38bdf8', weight='bold', fontsize=12, ha='center', va='center',
                bbox=dict(boxstyle="round,pad=0.4", facecolor="#1e293b", edgecolor="none"))

        plt.subplots_adjust(left=0.02, right=0.98, top=0.98, bottom=0.02)

        for target_dir in TARGET_DIRS:
            png_path = os.path.join(target_dir, f"{filename}.png")
            plt.savefig(png_path, facecolor='#0f172a', edgecolor='none')
            
        plt.close()

    print("Generated perfect SVGs and PNGs for all 50 questions in Topic 137!")

generate_perfect_all()
