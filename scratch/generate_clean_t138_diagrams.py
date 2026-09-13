import os
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

def generate_clean_t138_all():
    for q_num in range(1, 51):
        type_idx = (q_num - 1) % 10 + 1
        filename = f"g8_t138_q{q_num}"
        
        # --- SVG RENDERING ---
        if type_idx == 1:
            title = "Triangle Side Length Check"
            svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 320" width="420" height="320">
  <rect width="100%" height="100%" fill="#0f172a" rx="12"/>
  <rect x="20" y="16" width="380" height="36" fill="#1e293b" rx="8"/>
  <text x="210" y="40" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">{title}</text>
  
  <polygon points="100,240 320,240 180,100" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/>
  
  <text x="125" y="165" font-family="Inter, sans-serif" font-size="14" font-weight="600" fill="#f8fafc" text-anchor="end">a = 6 cm</text>
  <text x="210" y="268" font-family="Inter, sans-serif" font-size="14" font-weight="600" fill="#f8fafc" text-anchor="middle">b = 9 cm</text>
  <text x="260" y="165" font-family="Inter, sans-serif" font-size="14" font-weight="600" fill="#f8fafc" text-anchor="start">c = 17 cm</text>
</svg>"""

        elif type_idx == 2:
            title = "Third Side Length Range"
            svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 320" width="420" height="320">
  <rect width="100%" height="100%" fill="#0f172a" rx="12"/>
  <rect x="20" y="16" width="380" height="36" fill="#1e293b" rx="8"/>
  <text x="210" y="40" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">{title}</text>
  
  <polygon points="100,240 320,240 180,100" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/>
  
  <text x="125" y="165" font-family="Inter, sans-serif" font-size="14" font-weight="600" fill="#f8fafc" text-anchor="end">a = 8 cm</text>
  <text x="260" y="165" font-family="Inter, sans-serif" font-size="14" font-weight="600" fill="#f8fafc" text-anchor="start">b = 13 cm</text>
  <text x="210" y="270" font-family="Inter, sans-serif" font-size="15" font-weight="700" fill="#38bdf8" text-anchor="middle">Third side x = ?</text>
</svg>"""

        elif type_idx == 3:
            title = "Triangle ABC - Interior Angles"
            svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 320" width="420" height="320">
  <rect width="100%" height="100%" fill="#0f172a" rx="12"/>
  <rect x="20" y="16" width="380" height="36" fill="#1e293b" rx="8"/>
  <text x="210" y="40" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">{title}</text>
  
  <polygon points="100,240 320,240 180,90" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/>
  
  <text x="85" y="255" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="#94a3b8">A</text>
  <text x="330" y="255" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="#94a3b8">B</text>
  <text x="180" y="75" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="#94a3b8">C</text>
  
  <text x="130" y="225" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="#38bdf8">45°</text>
  <text x="285" y="225" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="#38bdf8">75°</text>
  <text x="180" y="125" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="#38bdf8">60°</text>

  <text x="125" y="160" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#f8fafc" text-anchor="end">b (AC)</text>
  <text x="260" y="160" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#f8fafc" text-anchor="start">a (BC)</text>
  <text x="210" y="265" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#f8fafc" text-anchor="middle">c (AB)</text>
</svg>"""

        elif type_idx == 4:
            title = "Triangle XYZ - Side Lengths"
            svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 320" width="420" height="320">
  <rect width="100%" height="100%" fill="#0f172a" rx="12"/>
  <rect x="20" y="16" width="380" height="36" fill="#1e293b" rx="8"/>
  <text x="210" y="40" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">{title}</text>
  
  <polygon points="100,240 320,240 180,90" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/>
  
  <text x="85" y="255" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="#94a3b8">X</text>
  <text x="330" y="255" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="#94a3b8">Y</text>
  <text x="180" y="75" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="#94a3b8">Z</text>
  
  <text x="125" y="160" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#f8fafc" text-anchor="end">XZ = 15 cm</text>
  <text x="260" y="160" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#f8fafc" text-anchor="start">YZ = 9 cm</text>
  <text x="210" y="265" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#f8fafc" text-anchor="middle">XY = 12 cm</text>
</svg>"""

        elif type_idx == 5:
            title = "Third Side Feasibility Check"
            svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 320" width="420" height="320">
  <rect width="100%" height="100%" fill="#0f172a" rx="12"/>
  <rect x="20" y="16" width="380" height="36" fill="#1e293b" rx="8"/>
  <text x="210" y="40" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">{title}</text>
  
  <polygon points="100,240 320,240 180,100" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/>
  
  <text x="125" y="165" font-family="Inter, sans-serif" font-size="14" font-weight="600" fill="#f8fafc" text-anchor="end">a = 15 cm</text>
  <text x="260" y="165" font-family="Inter, sans-serif" font-size="14" font-weight="600" fill="#f8fafc" text-anchor="start">b = 22 cm</text>
  <text x="210" y="270" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">Third side = 7 cm?</text>
</svg>"""

        elif type_idx == 6:
            title = "Triangle PQR - Integer Bounds"
            svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 320" width="420" height="320">
  <rect width="100%" height="100%" fill="#0f172a" rx="12"/>
  <rect x="20" y="16" width="380" height="36" fill="#1e293b" rx="8"/>
  <text x="210" y="40" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">{title}</text>
  
  <polygon points="100,240 320,240 180,100" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/>
  
  <text x="85" y="255" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="#94a3b8">P</text>
  <text x="330" y="255" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="#94a3b8">Q</text>
  <text x="180" y="85" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="#94a3b8">R</text>

  <text x="125" y="160" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#f8fafc" text-anchor="end">PR = ? (integer)</text>
  <text x="260" y="160" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#f8fafc" text-anchor="start">QR = 14 cm</text>
  <text x="210" y="265" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#f8fafc" text-anchor="middle">PQ = 8 cm</text>
</svg>"""

        elif type_idx == 7:
            title = "Exterior Angle Diagram"
            svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 320" width="420" height="320">
  <rect width="100%" height="100%" fill="#0f172a" rx="12"/>
  <rect x="20" y="16" width="380" height="36" fill="#1e293b" rx="8"/>
  <text x="210" y="40" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">{title}</text>
  
  <!-- Triangle -->
  <polygon points="100,220 260,220 160,90" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/>
  <!-- Extended Base Line -->
  <line x1="260" y1="220" x2="350" y2="220" stroke="#38bdf8" stroke-width="2" stroke-dasharray="5,4"/>
  
  <text x="120" y="210" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="#38bdf8">∠1</text>
  <text x="160" y="125" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="#38bdf8">∠2</text>
  <text x="275" y="210" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8">Ext ∠4</text>
  
  <text x="210" y="265" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#94a3b8" text-anchor="middle">Remote Interior Angles: ∠1 and ∠2</text>
</svg>"""

        elif type_idx == 8:
            title = "Hinge Theorem (SAS Inequality)"
            svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 320" width="420" height="320">
  <rect width="100%" height="100%" fill="#0f172a" rx="12"/>
  <rect x="20" y="16" width="380" height="36" fill="#1e293b" rx="8"/>
  <text x="210" y="40" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">{title}</text>
  
  <!-- Triangle ABC -->
  <polygon points="60,230 180,230 100,100" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
  <text x="50" y="245" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="#94a3b8">B</text>
  <text x="185" y="245" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="#94a3b8">C</text>
  <text x="95" y="88" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="#94a3b8">A</text>
  <text x="100" y="130" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="#38bdf8">65°</text>
  <text x="120" y="250" font-family="Inter, sans-serif" font-size="12" font-weight="600" fill="#f8fafc" text-anchor="middle">BC</text>

  <!-- Triangle DEF -->
  <polygon points="240,230 360,230 280,100" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
  <text x="230" y="245" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="#94a3b8">E</text>
  <text x="365" y="245" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="#94a3b8">F</text>
  <text x="275" y="88" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="#94a3b8">D</text>
  <text x="280" y="130" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="#38bdf8">48°</text>
  <text x="300" y="250" font-family="Inter, sans-serif" font-size="12" font-weight="600" fill="#f8fafc" text-anchor="middle">EF</text>

  <text x="210" y="285" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#f8fafc" text-anchor="middle">Given: AB = DE and AC = DF</text>
</svg>"""

        elif type_idx == 9:
            title = "Triangle KLM - Side Lengths"
            svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 320" width="420" height="320">
  <rect width="100%" height="100%" fill="#0f172a" rx="12"/>
  <rect x="20" y="16" width="380" height="36" fill="#1e293b" rx="8"/>
  <text x="210" y="40" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">{title}</text>
  
  <polygon points="100,240 320,240 210,100" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/>
  
  <text x="85" y="255" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="#94a3b8">K</text>
  <text x="330" y="255" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="#94a3b8">M</text>
  <text x="210" y="85" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="#94a3b8">L</text>

  <text x="145" y="160" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#f8fafc" text-anchor="end">KL = 7 cm</text>
  <text x="275" y="160" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#f8fafc" text-anchor="start">LM = 7 cm</text>
  <text x="210" y="265" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#f8fafc" text-anchor="middle">KM = 11 cm</text>
</svg>"""

        elif type_idx == 10:
            title = "Surveyor Triangular Circuit"
            svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 320" width="420" height="320">
  <rect width="100%" height="100%" fill="#0f172a" rx="12"/>
  <rect x="20" y="16" width="380" height="36" fill="#1e293b" rx="8"/>
  <text x="210" y="40" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">{title}</text>
  
  <polygon points="100,240 320,240 180,100" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/>
  
  <text x="125" y="165" font-family="Inter, sans-serif" font-size="14" font-weight="600" fill="#f8fafc" text-anchor="end">Path 1 = 3 km</text>
  <text x="260" y="165" font-family="Inter, sans-serif" font-size="14" font-weight="600" fill="#f8fafc" text-anchor="start">Path 2 = 5 km</text>
  <text x="210" y="270" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">Return Path = ?</text>
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

        if type_idx == 1:
            ax.plot([0.25, 0.78, 0.45, 0.25], [0.22, 0.22, 0.78, 0.22], color='#38bdf8', lw=2.5)
            ax.text(0.30, 0.5, "a = 6 cm", color='#f8fafc', weight='bold', fontsize=11, ha='right', va='center')
            ax.text(0.515, 0.14, "b = 9 cm", color='#f8fafc', weight='bold', fontsize=11, ha='center', va='top')
            ax.text(0.64, 0.5, "c = 17 cm", color='#f8fafc', weight='bold', fontsize=11, ha='left', va='center')

        elif type_idx == 2:
            ax.plot([0.25, 0.78, 0.45, 0.25], [0.22, 0.22, 0.78, 0.22], color='#38bdf8', lw=2.5)
            ax.text(0.30, 0.5, "a = 8 cm", color='#f8fafc', weight='bold', fontsize=11, ha='right', va='center')
            ax.text(0.515, 0.14, "Third side x = ?", color='#38bdf8', weight='bold', fontsize=12, ha='center', va='top')
            ax.text(0.64, 0.5, "b = 13 cm", color='#f8fafc', weight='bold', fontsize=11, ha='left', va='center')

        elif type_idx == 3:
            ax.plot([0.25, 0.78, 0.45, 0.25], [0.22, 0.22, 0.78, 0.22], color='#38bdf8', lw=2.5)
            ax.text(0.22, 0.18, "A", color='#94a3b8', weight='bold', fontsize=11)
            ax.text(0.80, 0.18, "B", color='#94a3b8', weight='bold', fontsize=11)
            ax.text(0.45, 0.82, "C", color='#94a3b8', weight='bold', fontsize=11)
            ax.text(0.33, 0.26, "45°", color='#38bdf8', weight='bold', fontsize=11)
            ax.text(0.70, 0.26, "75°", color='#38bdf8', weight='bold', fontsize=11)
            ax.text(0.45, 0.68, "60°", color='#38bdf8', weight='bold', fontsize=11)

        elif type_idx == 4:
            ax.plot([0.25, 0.78, 0.45, 0.25], [0.22, 0.22, 0.78, 0.22], color='#38bdf8', lw=2.5)
            ax.text(0.22, 0.18, "X", color='#94a3b8', weight='bold', fontsize=11)
            ax.text(0.80, 0.18, "Y", color='#94a3b8', weight='bold', fontsize=11)
            ax.text(0.45, 0.82, "Z", color='#94a3b8', weight='bold', fontsize=11)
            ax.text(0.30, 0.5, "XZ = 15 cm", color='#f8fafc', weight='bold', fontsize=11, ha='right')
            ax.text(0.64, 0.5, "YZ = 9 cm", color='#f8fafc', weight='bold', fontsize=11, ha='left')
            ax.text(0.515, 0.14, "XY = 12 cm", color='#f8fafc', weight='bold', fontsize=11, ha='center', va='top')

        elif type_idx == 5:
            ax.plot([0.25, 0.78, 0.45, 0.25], [0.22, 0.22, 0.78, 0.22], color='#38bdf8', lw=2.5)
            ax.text(0.30, 0.5, "a = 15 cm", color='#f8fafc', weight='bold', fontsize=11, ha='right')
            ax.text(0.64, 0.5, "b = 22 cm", color='#f8fafc', weight='bold', fontsize=11, ha='left')
            ax.text(0.515, 0.14, "Third side = 7 cm?", color='#38bdf8', weight='bold', fontsize=12, ha='center', va='top')

        elif type_idx == 6:
            ax.plot([0.25, 0.78, 0.45, 0.25], [0.22, 0.22, 0.78, 0.22], color='#38bdf8', lw=2.5)
            ax.text(0.22, 0.18, "P", color='#94a3b8', weight='bold', fontsize=11)
            ax.text(0.80, 0.18, "Q", color='#94a3b8', weight='bold', fontsize=11)
            ax.text(0.45, 0.82, "R", color='#94a3b8', weight='bold', fontsize=11)
            ax.text(0.30, 0.5, "PR = ? (integer)", color='#38bdf8', weight='bold', fontsize=11, ha='right')
            ax.text(0.64, 0.5, "QR = 14 cm", color='#f8fafc', weight='bold', fontsize=11, ha='left')
            ax.text(0.515, 0.14, "PQ = 8 cm", color='#f8fafc', weight='bold', fontsize=11, ha='center', va='top')

        elif type_idx == 7:
            ax.plot([0.25, 0.65, 0.40, 0.25], [0.25, 0.25, 0.75, 0.25], color='#38bdf8', lw=2.5)
            ax.plot([0.65, 0.88], [0.25, 0.25], color='#38bdf8', lw=2, ls='--')
            ax.text(0.30, 0.32, "∠1", color='#38bdf8', weight='bold', fontsize=12)
            ax.text(0.40, 0.62, "∠2", color='#38bdf8', weight='bold', fontsize=12)
            ax.text(0.70, 0.32, "Ext ∠4", color='#38bdf8', weight='bold', fontsize=12)

        elif type_idx == 8:
            # Tri ABC
            ax.plot([0.15, 0.42, 0.25, 0.15], [0.22, 0.22, 0.78, 0.22], color='#38bdf8', lw=2)
            ax.text(0.25, 0.62, "65°", color='#38bdf8', weight='bold', fontsize=11)
            ax.text(0.285, 0.14, "BC", color='#f8fafc', weight='bold', fontsize=11, ha='center', va='top')

            # Tri DEF
            ax.plot([0.58, 0.85, 0.68, 0.58], [0.22, 0.22, 0.78, 0.22], color='#38bdf8', lw=2)
            ax.text(0.68, 0.62, "48°", color='#38bdf8', weight='bold', fontsize=11)
            ax.text(0.715, 0.14, "EF", color='#f8fafc', weight='bold', fontsize=11, ha='center', va='top')
            
            ax.text(0.5, 0.05, "Given: AB = DE and AC = DF", color='#f8fafc', weight='bold', fontsize=10, ha='center')

        elif type_idx == 9:
            ax.plot([0.25, 0.78, 0.515, 0.25], [0.22, 0.22, 0.78, 0.22], color='#38bdf8', lw=2.5)
            ax.text(0.22, 0.18, "K", color='#94a3b8', weight='bold', fontsize=11)
            ax.text(0.80, 0.18, "M", color='#94a3b8', weight='bold', fontsize=11)
            ax.text(0.515, 0.82, "L", color='#94a3b8', weight='bold', fontsize=11)
            ax.text(0.34, 0.5, "KL = 7 cm", color='#f8fafc', weight='bold', fontsize=11, ha='right')
            ax.text(0.68, 0.5, "LM = 7 cm", color='#f8fafc', weight='bold', fontsize=11, ha='left')
            ax.text(0.515, 0.14, "KM = 11 cm", color='#f8fafc', weight='bold', fontsize=11, ha='center', va='top')

        elif type_idx == 10:
            ax.plot([0.25, 0.78, 0.45, 0.25], [0.22, 0.22, 0.78, 0.22], color='#38bdf8', lw=2.5)
            ax.text(0.30, 0.5, "Path 1 = 3 km", color='#f8fafc', weight='bold', fontsize=11, ha='right')
            ax.text(0.64, 0.5, "Path 2 = 5 km", color='#f8fafc', weight='bold', fontsize=11, ha='left')
            ax.text(0.515, 0.14, "Return Path = ?", color='#38bdf8', weight='bold', fontsize=12, ha='center', va='top')

        # Header Title
        ax.text(0.5, 0.93, title, color='#38bdf8', weight='bold', fontsize=12, ha='center', va='center',
                bbox=dict(boxstyle="round,pad=0.4", facecolor="#1e293b", edgecolor="none"))

        plt.subplots_adjust(left=0.02, right=0.98, top=0.98, bottom=0.02)

        for target_dir in TARGET_DIRS:
            png_path = os.path.join(target_dir, f"{filename}.png")
            plt.savefig(png_path, facecolor='#0f172a', edgecolor='none')
            
        plt.close()

    print("Generated clean SVGs and PNGs for all 50 questions in Topic 138!")

generate_clean_t138_all()
