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

def generate_svg_and_png(q_num, type_idx):
    filename = f"g8_t137_q{q_num}"
    
    if type_idx == 1:
        # Right Triangle Hypotenuse (a=9 cm, b=12 cm, c=?)
        title = "Right Triangle ABC"
        labels = {"leg_a": "a = 9 cm", "leg_b": "b = 12 cm", "hyp": "c = ?"}
        
        svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 320" width="420" height="320">
  <rect width="100%" height="100%" fill="#0f172a" rx="12"/>
  <rect x="20" y="16" width="380" height="36" fill="#1e293b" rx="8"/>
  <text x="210" y="40" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">{title}</text>
  
  <!-- Right Triangle Path -->
  <polygon points="100,250 320,250 100,90" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/>
  <!-- Right Angle Symbol at (100,250) -->
  <path d="M 100 232 L 118 232 L 118 250" fill="none" stroke="#38bdf8" stroke-width="1.8"/>
  
  <!-- Labels -->
  <text x="75" y="175" font-family="Inter, sans-serif" font-size="14" font-weight="600" fill="#f8fafc" text-anchor="end">{labels['leg_a']}</text>
  <text x="210" y="278" font-family="Inter, sans-serif" font-size="14" font-weight="600" fill="#f8fafc" text-anchor="middle">{labels['leg_b']}</text>
  <text x="225" y="160" font-family="Inter, sans-serif" font-size="15" font-weight="700" fill="#38bdf8" text-anchor="start">{labels['hyp']}</text>
  
  <!-- Vertices -->
  <text x="90" y="85" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="#94a3b8">A</text>
  <text x="330" y="260" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="#94a3b8">B</text>
  <text x="85" y="265" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="#94a3b8">C</text>
</svg>"""

    elif type_idx == 2:
        # Missing Leg Calculation (c=25 cm, b=7 cm, a=?)
        title = "Right Triangle - Missing Leg"
        labels = {"leg_a": "a = ?", "leg_b": "b = 7 cm", "hyp": "c = 25 cm"}
        
        svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 320" width="420" height="320">
  <rect width="100%" height="100%" fill="#0f172a" rx="12"/>
  <rect x="20" y="16" width="380" height="36" fill="#1e293b" rx="8"/>
  <text x="210" y="40" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">{title}</text>
  
  <polygon points="100,250 320,250 100,90" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/>
  <path d="M 100 232 L 118 232 L 118 250" fill="none" stroke="#38bdf8" stroke-width="1.8"/>
  
  <text x="75" y="175" font-family="Inter, sans-serif" font-size="15" font-weight="700" fill="#38bdf8" text-anchor="end">{labels['leg_a']}</text>
  <text x="210" y="278" font-family="Inter, sans-serif" font-size="14" font-weight="600" fill="#f8fafc" text-anchor="middle">{labels['leg_b']}</text>
  <text x="225" y="160" font-family="Inter, sans-serif" font-size="14" font-weight="600" fill="#f8fafc" text-anchor="start">{labels['hyp']}</text>
</svg>"""

    elif type_idx == 3:
        # Triangle Classification (8, 15, 17)
        title = "Triangle Side Lengths"
        labels = {"a": "a = 8 cm", "b": "b = 15 cm", "c": "c = 17 cm"}
        
        svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 320" width="420" height="320">
  <rect width="100%" height="100%" fill="#0f172a" rx="12"/>
  <rect x="20" y="16" width="380" height="36" fill="#1e293b" rx="8"/>
  <text x="210" y="40" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">{title}</text>
  
  <polygon points="100,240 310,240 100,100" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/>
  
  <text x="80" y="175" font-family="Inter, sans-serif" font-size="14" font-weight="600" fill="#f8fafc" text-anchor="end">{labels['a']}</text>
  <text x="205" y="268" font-family="Inter, sans-serif" font-size="14" font-weight="600" fill="#f8fafc" text-anchor="middle">{labels['b']}</text>
  <text x="220" y="160" font-family="Inter, sans-serif" font-size="14" font-weight="600" fill="#f8fafc" text-anchor="start">{labels['c']}</text>
</svg>"""

    elif type_idx == 4:
        # Triangle Classification (7, 10, 12)
        title = "Triangle Side Lengths"
        labels = {"a": "a = 7 cm", "b": "b = 10 cm", "c": "c = 12 cm"}
        
        svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 320" width="420" height="320">
  <rect width="100%" height="100%" fill="#0f172a" rx="12"/>
  <rect x="20" y="16" width="380" height="36" fill="#1e293b" rx="8"/>
  <text x="210" y="40" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">{title}</text>
  
  <polygon points="110,240 310,240 150,100" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/>
  
  <text x="115" y="170" font-family="Inter, sans-serif" font-size="14" font-weight="600" fill="#f8fafc" text-anchor="end">{labels['a']}</text>
  <text x="210" y="268" font-family="Inter, sans-serif" font-size="14" font-weight="600" fill="#f8fafc" text-anchor="middle">{labels['b']}</text>
  <text x="245" y="170" font-family="Inter, sans-serif" font-size="14" font-weight="600" fill="#f8fafc" text-anchor="start">{labels['c']}</text>
</svg>"""

    elif type_idx == 5:
        # Rescue Ladder Distance
        title = "Rescue Ladder Scenario"
        labels = {"wall": "Wall = 12 m", "ladder": "Ladder = 15 m", "ground": "Ground Distance = ?"}
        
        svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 320" width="420" height="320">
  <rect width="100%" height="100%" fill="#0f172a" rx="12"/>
  <rect x="20" y="16" width="380" height="36" fill="#1e293b" rx="8"/>
  <text x="210" y="40" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">{title}</text>
  
  <!-- Wall -->
  <line x1="100" y1="80" x2="100" y2="250" stroke="#64748b" stroke-width="6"/>
  <!-- Ground -->
  <line x1="80" y1="250" x2="340" y2="250" stroke="#475569" stroke-width="3"/>
  <!-- Ladder -->
  <line x1="300" y1="250" x2="100" y2="100" stroke="#38bdf8" stroke-width="3.5" stroke-dasharray="6,4"/>
  
  <text x="85" y="165" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#f8fafc" text-anchor="end">{labels['wall']}</text>
  <text x="215" y="165" font-family="Inter, sans-serif" font-size="14" font-weight="600" fill="#f8fafc" text-anchor="start">{labels['ladder']}</text>
  <text x="200" y="278" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">{labels['ground']}</text>
</svg>"""

    elif type_idx == 6:
        # TV Screen Diagonal
        title = "TV Screen Dimensions"
        labels = {"w": 'Width = 40"', "h": 'Height = 30"', "d": "Diagonal = ?"}
        
        svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 320" width="420" height="320">
  <rect width="100%" height="100%" fill="#0f172a" rx="12"/>
  <rect x="20" y="16" width="380" height="36" fill="#1e293b" rx="8"/>
  <text x="210" y="40" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">{title}</text>
  
  <!-- TV Frame -->
  <rect x="90" y="80" width="240" height="160" fill="#1e293b" stroke="#64748b" stroke-width="3" rx="6"/>
  <!-- Diagonal -->
  <line x1="90" y1="240" x2="330" y2="80" stroke="#38bdf8" stroke-width="2.5" stroke-dasharray="6,4"/>
  
  <text x="210" y="265" font-family="Inter, sans-serif" font-size="14" font-weight="600" fill="#f8fafc" text-anchor="middle">{labels['w']}</text>
  <text x="75" y="165" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#f8fafc" text-anchor="end">{labels['h']}</text>
  <text x="220" y="150" font-family="Inter, sans-serif" font-size="15" font-weight="700" fill="#38bdf8" text-anchor="middle">{labels['d']}</text>
</svg>"""

    elif type_idx == 7:
        # Rectangle Diagonal
        title = "Rectangle Dimensions"
        labels = {"w": "Width = 16 cm", "h": "Height = 12 cm", "d": "Diagonal = ?"}
        
        svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 320" width="420" height="320">
  <rect width="100%" height="100%" fill="#0f172a" rx="12"/>
  <rect x="20" y="16" width="380" height="36" fill="#1e293b" rx="8"/>
  <text x="210" y="40" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">{title}</text>
  
  <rect x="90" y="80" width="240" height="160" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5" rx="4"/>
  <line x1="90" y1="240" x2="330" y2="80" stroke="#38bdf8" stroke-width="2" stroke-dasharray="6,4"/>
  
  <text x="210" y="265" font-family="Inter, sans-serif" font-size="14" font-weight="600" fill="#f8fafc" text-anchor="middle">{labels['w']}</text>
  <text x="75" y="165" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#f8fafc" text-anchor="end">{labels['h']}</text>
  <text x="220" y="150" font-family="Inter, sans-serif" font-size="15" font-weight="700" fill="#38bdf8" text-anchor="middle">{labels['d']}</text>
</svg>"""

    elif type_idx == 8:
        # Compass Displacement Path
        title = "Compass Displacement Path"
        labels = {"north": "North = 6 km", "east": "East = 8 km", "dist": "Direct Distance = ?"}
        
        svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 320" width="420" height="320">
  <rect width="100%" height="100%" fill="#0f172a" rx="12"/>
  <rect x="20" y="16" width="380" height="36" fill="#1e293b" rx="8"/>
  <text x="210" y="40" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">{title}</text>
  
  <!-- Path A -> North -> East -> B -->
  <line x1="120" y1="240" x2="120" y2="100" stroke="#38bdf8" stroke-width="2.5"/>
  <line x1="120" y1="100" x2="300" y2="100" stroke="#38bdf8" stroke-width="2.5"/>
  <line x1="120" y1="240" x2="300" y2="100" stroke="#0284c7" stroke-width="2.5" stroke-dasharray="6,4"/>
  
  <circle cx="120" cy="240" r="5" fill="#38bdf8"/>
  <circle cx="300" cy="100" r="5" fill="#38bdf8"/>
  
  <text x="110" y="255" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="#94a3b8">Point A</text>
  <text x="310" y="95" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="#94a3b8">Point B</text>

  <text x="105" y="170" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#f8fafc" text-anchor="end">{labels['north']}</text>
  <text x="210" y="85" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#f8fafc" text-anchor="middle">{labels['east']}</text>
  <text x="225" y="185" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">{labels['dist']}</text>
</svg>"""

    elif type_idx == 9:
        # Equilateral Triangle Altitude
        title = "Equilateral Triangle"
        labels = {"side": "Side s = 10 cm", "alt": "Altitude h = ?"}
        
        svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 320" width="420" height="320">
  <rect width="100%" height="100%" fill="#0f172a" rx="12"/>
  <rect x="20" y="16" width="380" height="36" fill="#1e293b" rx="8"/>
  <text x="210" y="40" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">{title}</text>
  
  <polygon points="100,240 320,240 210,80" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/>
  <line x1="210" y1="80" x2="210" y2="240" stroke="#38bdf8" stroke-width="2" stroke-dasharray="5,4"/>
  <path d="M 210 225 L 225 225 L 225 240" fill="none" stroke="#38bdf8" stroke-width="1.5"/>
  
  <text x="140" y="150" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#f8fafc" text-anchor="end">{labels['side']}</text>
  <text x="280" y="150" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#f8fafc" text-anchor="start">{labels['side']}</text>
  <text x="210" y="265" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#f8fafc" text-anchor="middle">{labels['side']}</text>
  <text x="220" y="160" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="start">{labels['alt']}</text>
</svg>"""

    elif type_idx == 10:
        # Tower Guy Wire Length
        title = "Tower & Guy Wire"
        labels = {"tower": "Tower = 24 m", "anchor": "Anchor = 10 m", "wire": "Guy Wire = ?"}
        
        svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 320" width="420" height="320">
  <rect width="100%" height="100%" fill="#0f172a" rx="12"/>
  <rect x="20" y="16" width="380" height="36" fill="#1e293b" rx="8"/>
  <text x="210" y="40" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">{title}</text>
  
  <!-- Tower -->
  <line x1="100" y1="80" x2="100" y2="250" stroke="#64748b" stroke-width="6"/>
  <!-- Ground -->
  <line x1="80" y1="250" x2="340" y2="250" stroke="#475569" stroke-width="3"/>
  <!-- Guy Wire -->
  <line x1="300" y1="250" x2="100" y2="80" stroke="#38bdf8" stroke-width="3" stroke-dasharray="6,4"/>
  
  <text x="85" y="165" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#f8fafc" text-anchor="end">{labels['tower']}</text>
  <text x="200" y="275" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#f8fafc" text-anchor="middle">{labels['anchor']}</text>
  <text x="215" y="155" font-family="Inter, sans-serif" font-size="15" font-weight="700" fill="#38bdf8" text-anchor="start">{labels['wire']}</text>
</svg>"""

    # Write SVG and PNG to all target directories
    for target_dir in TARGET_DIRS:
        svg_path = os.path.join(target_dir, f"{filename}.svg")
        with open(svg_path, 'w', encoding='utf-8') as f:
            f.write(svg_content)
            
        # Also render PNG
        plt.figure(figsize=(4.2, 3.2), dpi=100, facecolor='#0f172a')
        ax = plt.subplot(111)
        ax.set_facecolor('#0f172a')
        ax.axis('off')
        
        # Simple clean render on matplotlib
        ax.text(0.5, 0.92, title, color='#38bdf8', weight='bold', fontsize=12, ha='center', va='center',
                bbox=dict(boxstyle="round,pad=0.4", facecolor="#1e293b", edgecolor="none"))
        
        if type_idx == 1:
            ax.plot([0.2, 0.8, 0.2, 0.2], [0.2, 0.2, 0.8, 0.2], color='#38bdf8', lw=2.5)
            ax.text(0.12, 0.5, "a = 9 cm", color='#f8fafc', weight='bold', fontsize=11, ha='right')
            ax.text(0.5, 0.12, "b = 12 cm", color='#f8fafc', weight='bold', fontsize=11, ha='center')
            ax.text(0.55, 0.55, "c = ?", color='#38bdf8', weight='bold', fontsize=13, ha='left')
        elif type_idx == 2:
            ax.plot([0.2, 0.8, 0.2, 0.2], [0.2, 0.2, 0.8, 0.2], color='#38bdf8', lw=2.5)
            ax.text(0.12, 0.5, "a = ?", color='#38bdf8', weight='bold', fontsize=13, ha='right')
            ax.text(0.5, 0.12, "b = 7 cm", color='#f8fafc', weight='bold', fontsize=11, ha='center')
            ax.text(0.55, 0.55, "c = 25 cm", color='#f8fafc', weight='bold', fontsize=11, ha='left')
        elif type_idx == 3:
            ax.plot([0.2, 0.8, 0.2, 0.2], [0.2, 0.2, 0.8, 0.2], color='#38bdf8', lw=2.5)
            ax.text(0.12, 0.5, "a = 8 cm", color='#f8fafc', weight='bold', fontsize=11, ha='right')
            ax.text(0.5, 0.12, "b = 15 cm", color='#f8fafc', weight='bold', fontsize=11, ha='center')
            ax.text(0.55, 0.55, "c = 17 cm", color='#f8fafc', weight='bold', fontsize=11, ha='left')
        elif type_idx == 4:
            ax.plot([0.2, 0.8, 0.35, 0.2], [0.2, 0.2, 0.8, 0.2], color='#38bdf8', lw=2.5)
            ax.text(0.22, 0.5, "a = 7 cm", color='#f8fafc', weight='bold', fontsize=11, ha='right')
            ax.text(0.5, 0.12, "b = 10 cm", color='#f8fafc', weight='bold', fontsize=11, ha='center')
            ax.text(0.60, 0.5, "c = 12 cm", color='#f8fafc', weight='bold', fontsize=11, ha='left')
        elif type_idx == 5:
            ax.plot([0.2, 0.2], [0.2, 0.8], color='#64748b', lw=5)
            ax.plot([0.1, 0.85], [0.2, 0.2], color='#475569', lw=3)
            ax.plot([0.75, 0.2], [0.2, 0.75], color='#38bdf8', lw=2.5, ls='--')
            ax.text(0.14, 0.5, "Wall = 12 m", color='#f8fafc', weight='bold', fontsize=11, ha='right')
            ax.text(0.5, 0.12, "Ground Distance = ?", color='#38bdf8', weight='bold', fontsize=12, ha='center')
            ax.text(0.52, 0.52, "Ladder = 15 m", color='#f8fafc', weight='bold', fontsize=11, ha='left')
        elif type_idx == 6:
            rect = patches.Rectangle((0.2, 0.25), 0.6, 0.5, facecolor="#1e293b", edgecolor="#64748b", lw=3)
            ax.add_patch(rect)
            ax.plot([0.2, 0.8], [0.25, 0.75], color='#38bdf8', lw=2.5, ls='--')
            ax.text(0.5, 0.15, 'Width = 40"', color='#f8fafc', weight='bold', fontsize=11, ha='center')
            ax.text(0.15, 0.5, 'Height = 30"', color='#f8fafc', weight='bold', fontsize=11, ha='right')
            ax.text(0.5, 0.5, "Diagonal = ?", color='#38bdf8', weight='bold', fontsize=13, ha='center')
        elif type_idx == 7:
            rect = patches.Rectangle((0.2, 0.25), 0.6, 0.5, facecolor="#1e293b", edgecolor="#38bdf8", lw=2.5)
            ax.add_patch(rect)
            ax.plot([0.2, 0.8], [0.25, 0.75], color='#38bdf8', lw=2.5, ls='--')
            ax.text(0.5, 0.15, "Width = 16 cm", color='#f8fafc', weight='bold', fontsize=11, ha='center')
            ax.text(0.15, 0.5, "Height = 12 cm", color='#f8fafc', weight='bold', fontsize=11, ha='right')
            ax.text(0.5, 0.5, "Diagonal = ?", color='#38bdf8', weight='bold', fontsize=13, ha='center')
        elif type_idx == 8:
            ax.plot([0.25, 0.25, 0.75], [0.2, 0.75, 0.75], color='#38bdf8', lw=2.5)
            ax.plot([0.25, 0.75], [0.2, 0.75], color='#0284c7', lw=2.5, ls='--')
            ax.text(0.2, 0.45, "North = 6 km", color='#f8fafc', weight='bold', fontsize=11, ha='right')
            ax.text(0.5, 0.82, "East = 8 km", color='#f8fafc', weight='bold', fontsize=11, ha='center')
            ax.text(0.55, 0.45, "Direct Distance = ?", color='#38bdf8', weight='bold', fontsize=12, ha='center')
        elif type_idx == 9:
            ax.plot([0.2, 0.8, 0.5, 0.2], [0.2, 0.2, 0.8, 0.2], color='#38bdf8', lw=2.5)
            ax.plot([0.5, 0.5], [0.8, 0.2], color='#38bdf8', lw=2, ls='--')
            ax.text(0.3, 0.5, "s = 10 cm", color='#f8fafc', weight='bold', fontsize=11, ha='right')
            ax.text(0.7, 0.5, "s = 10 cm", color='#f8fafc', weight='bold', fontsize=11, ha='left')
            ax.text(0.5, 0.12, "s = 10 cm", color='#f8fafc', weight='bold', fontsize=11, ha='center')
            ax.text(0.53, 0.5, "Altitude h = ?", color='#38bdf8', weight='bold', fontsize=12, ha='left')
        elif type_idx == 10:
            ax.plot([0.2, 0.2], [0.2, 0.8], color='#64748b', lw=5)
            ax.plot([0.1, 0.85], [0.2, 0.2], color='#475569', lw=3)
            ax.plot([0.75, 0.2], [0.2, 0.8], color='#38bdf8', lw=2.5, ls='--')
            ax.text(0.14, 0.5, "Tower = 24 m", color='#f8fafc', weight='bold', fontsize=11, ha='right')
            ax.text(0.5, 0.12, "Anchor = 10 m", color='#f8fafc', weight='bold', fontsize=11, ha='center')
            ax.text(0.52, 0.52, "Guy Wire = ?", color='#38bdf8', weight='bold', fontsize=13, ha='left')

        png_path = os.path.join(target_dir, f"{filename}.png")
        plt.tight_layout()
        plt.savefig(png_path, facecolor='#0f172a', edgecolor='none')
        plt.close()

# Generate clean SVG and PNG files for all 50 questions
for q_num in range(1, 51):
    type_idx = (q_num - 1) % 10 + 1
    generate_svg_and_png(q_num, type_idx)

print("Generated clean diagrams for all 50 questions in Topic 137!")
