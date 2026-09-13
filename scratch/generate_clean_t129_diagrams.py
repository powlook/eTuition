import os
import json
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

with open('scratch/t129_parsed_params.json', 'r', encoding='utf-8') as f:
    parsed_items = json.load(f)

print(f"Generating clean SVG & PNG diagrams for {len(parsed_items)} Topic 129 questions...")

def generate_t129_single(item):
    idx = item['idx']
    type_idx = item['type_idx']
    filename = f"g8_t129_q{idx}"
    
    if type_idx == 1:
        px, py = item.get('px', -9), item.get('py', -9)
        title = "Cartesian Coordinate Plane"
        
        svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 320" width="420" height="320">
  <rect width="100%" height="100%" fill="#0f172a" rx="12"/>
  <rect x="20" y="16" width="380" height="36" fill="#1e293b" rx="8"/>
  <text x="210" y="40" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">{title}</text>
  
  <!-- Axes -->
  <line x1="60" y1="165" x2="360" y2="165" stroke="#64748b" stroke-width="2"/>
  <line x1="210" y1="70" x2="210" y2="260" stroke="#64748b" stroke-width="2"/>
  
  <text x="365" y="170" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="#94a3b8">X</text>
  <text x="210" y="62" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="#94a3b8" text-anchor="middle">Y</text>

  <!-- Quadrant Labels -->
  <text x="280" y="110" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="#475569">QI</text>
  <text x="140" y="110" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="#475569">QII</text>
  <text x="140" y="220" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="#475569">QIII</text>
  <text x="280" y="220" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="#475569">QIV</text>

  <!-- Point P -->
  <circle cx="{120 if px < 0 else 300}" cy="{215 if py < 0 else 115}" r="6" fill="#38bdf8"/>
  <text x="{120 if px < 0 else 300}" y="{235 if py < 0 else 100}" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">P({px}, {py})</text>
</svg>"""

    elif type_idx == 2:
        ax_v, ay_v = item.get('ax', -3), item.get('ay', 5)
        bx_v, by_v = item.get('bx', 3), item.get('by', 11)
        title = "Distance Between Points A &amp; B"
        
        svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 320" width="420" height="320">
  <rect width="100%" height="100%" fill="#0f172a" rx="12"/>
  <rect x="20" y="16" width="380" height="36" fill="#1e293b" rx="8"/>
  <text x="210" y="40" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">Distance Between Points A &amp; B</text>
  
  <line x1="60" y1="180" x2="360" y2="180" stroke="#475569" stroke-width="1.5"/>
  <line x1="210" y1="70" x2="210" y2="260" stroke="#475569" stroke-width="1.5"/>
  
  <line x1="140" y1="210" x2="280" y2="110" stroke="#38bdf8" stroke-width="2.5"/>
  <circle cx="140" cy="210" r="5" fill="#38bdf8"/>
  <circle cx="280" cy="110" r="5" fill="#38bdf8"/>
  
  <text x="130" y="230" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#f8fafc" text-anchor="end">A({ax_v}, {ay_v})</text>
  <text x="290" y="105" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#f8fafc" text-anchor="start">B({bx_v}, {by_v})</text>
  
  <rect x="180" y="145" width="60" height="26" fill="#1e293b" rx="4" stroke="#38bdf8" stroke-width="1"/>
  <text x="210" y="163" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">d = ?</text>
</svg>"""

    elif type_idx == 3:
        ax_v, ay_v = item.get('ax', -7), item.get('ay', -5)
        bx_v, by_v = item.get('bx', 2), item.get('by', -6)
        title = "Line Segment AB &amp; Midpoint"
        
        svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 320" width="420" height="320">
  <rect width="100%" height="100%" fill="#0f172a" rx="12"/>
  <rect x="20" y="16" width="380" height="36" fill="#1e293b" rx="8"/>
  <text x="210" y="40" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">Line Segment AB &amp; Midpoint</text>
  
  <line x1="60" y1="140" x2="360" y2="140" stroke="#475569" stroke-width="1.5"/>
  <line x1="210" y1="70" x2="210" y2="260" stroke="#475569" stroke-width="1.5"/>
  
  <line x1="110" y1="190" x2="310" y2="210" stroke="#38bdf8" stroke-width="2.5"/>
  <circle cx="110" cy="190" r="5" fill="#38bdf8"/>
  <circle cx="310" cy="210" r="5" fill="#38bdf8"/>
  <circle cx="210" cy="200" r="6" fill="#0284c7" stroke="#ffffff" stroke-width="1.5"/>
  
  <text x="100" y="185" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#f8fafc" text-anchor="end">A({ax_v}, {ay_v})</text>
  <text x="320" y="215" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#f8fafc" text-anchor="start">B({bx_v}, {by_v})</text>
  <text x="210" y="235" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">Midpoint M = ?</text>
</svg>"""

    elif type_idx == 4:
        mx_v, my_v = item.get('mx', 4), item.get('my', -4)
        px_v, py_v = item.get('px', -4), item.get('py', -5)
        title = "Line Segment PQ &amp; Endpoint Q"
        
        svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 320" width="420" height="320">
  <rect width="100%" height="100%" fill="#0f172a" rx="12"/>
  <rect x="20" y="16" width="380" height="36" fill="#1e293b" rx="8"/>
  <text x="210" y="40" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">Line Segment PQ &amp; Endpoint Q</text>
  
  <line x1="60" y1="140" x2="360" y2="140" stroke="#475569" stroke-width="1.5"/>
  <line x1="210" y1="70" x2="210" y2="260" stroke="#475569" stroke-width="1.5"/>
  
  <line x1="100" y1="210" x2="320" y2="190" stroke="#38bdf8" stroke-width="2.5"/>
  <circle cx="100" cy="210" r="5" fill="#38bdf8"/>
  <circle cx="210" cy="200" r="5" fill="#0284c7"/>
  <circle cx="320" cy="190" r="6" fill="#38bdf8" stroke="#ffffff" stroke-width="1.5"/>
  
  <text x="90" y="225" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#f8fafc" text-anchor="end">P({px_v}, {py_v})</text>
  <text x="210" y="225" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#f8fafc" text-anchor="middle">M({mx_v}, {my_v})</text>
  <text x="330" y="185" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="start">Endpoint Q = ?</text>
</svg>"""

    elif type_idx == 5:
        bx_v, cy_v = item.get('bx', 15), item.get('cy', 20)
        title = "Triangle ABC on Cartesian Plane"
        
        svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 320" width="420" height="320">
  <rect width="100%" height="100%" fill="#0f172a" rx="12"/>
  <rect x="20" y="16" width="380" height="36" fill="#1e293b" rx="8"/>
  <text x="210" y="40" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">{title}</text>
  
  <polygon points="120,240 320,240 120,100" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/>
  <path d="M 120 225 L 135 225 L 135 240" fill="none" stroke="#38bdf8" stroke-width="1.5"/>
  
  <text x="105" y="255" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#f8fafc">A(0,0)</text>
  <text x="325" y="255" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#f8fafc">B({bx_v}, 0)</text>
  <text x="105" y="95" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#f8fafc" text-anchor="end">C(0, {cy_v})</text>
  
  <text x="210" y="278" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">Perimeter = ?</text>
</svg>"""

    elif type_idx == 6:
        ax_v, ay_v = item.get('ax', 1), item.get('ay', 6)
        bx_v, by_v = item.get('bx', 3), item.get('by', 10)
        cx_v, cy_v = item.get('cx', 6), item.get('cy', 16)
        title = "Points A, B, C on Coordinate Plane"
        
        svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 320" width="420" height="320">
  <rect width="100%" height="100%" fill="#0f172a" rx="12"/>
  <rect x="20" y="16" width="380" height="36" fill="#1e293b" rx="8"/>
  <text x="210" y="40" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">{title}</text>
  
  <line x1="60" y1="230" x2="360" y2="230" stroke="#475569" stroke-width="1.5"/>
  <line x1="100" y1="70" x2="100" y2="260" stroke="#475569" stroke-width="1.5"/>
  
  <line x1="120" y1="210" x2="320" y2="90" stroke="#38bdf8" stroke-width="2"/>
  <circle cx="120" cy="210" r="5" fill="#38bdf8"/>
  <circle cx="180" cy="174" r="5" fill="#38bdf8"/>
  <circle cx="320" cy="90" r="5" fill="#38bdf8"/>
  
  <text x="110" y="225" font-family="Inter, sans-serif" font-size="12" font-weight="600" fill="#f8fafc">A({ax_v}, {ay_v})</text>
  <text x="170" y="160" font-family="Inter, sans-serif" font-size="12" font-weight="600" fill="#f8fafc">B({bx_v}, {by_v})</text>
  <text x="330" y="85" font-family="Inter, sans-serif" font-size="12" font-weight="600" fill="#f8fafc">C({cx_v}, {cy_v})</text>
</svg>"""

    elif type_idx == 7:
        x1_v, y1_v = item.get('x1', -2), item.get('y1', 4)
        x2_v, y2_v = item.get('x2', 7), item.get('y2', 8)
        title = "Rectangle on Coordinate Plane"
        
        svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 320" width="420" height="320">
  <rect width="100%" height="100%" fill="#0f172a" rx="12"/>
  <rect x="20" y="16" width="380" height="36" fill="#1e293b" rx="8"/>
  <text x="210" y="40" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">{title}</text>
  
  <rect x="110" y="100" width="200" height="130" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5" rx="4"/>
  <circle cx="110" cy="230" r="5" fill="#38bdf8"/>
  <circle cx="310" cy="100" r="5" fill="#38bdf8"/>
  
  <text x="95" y="245" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#f8fafc">({x1_v}, {y1_v})</text>
  <text x="320" y="95" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#f8fafc">({x2_v}, {y2_v})</text>
  
  <rect x="150" y="150" width="120" height="30" fill="#0f172a" rx="4" stroke="#38bdf8" stroke-width="1"/>
  <text x="210" y="170" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">Area = ?</text>
</svg>"""

    elif type_idx == 8:
        px_v, py_v = item.get('px', -5), item.get('py', 0)
        qx_v, qy_v = item.get('qx', 7), item.get('qy', 0)
        title = "Horizontal Segment PQ"
        
        svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 320" width="420" height="320">
  <rect width="100%" height="100%" fill="#0f172a" rx="12"/>
  <rect x="20" y="16" width="380" height="36" fill="#1e293b" rx="8"/>
  <text x="210" y="40" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">{title}</text>
  
  <line x1="60" y1="165" x2="360" y2="165" stroke="#475569" stroke-width="1.5"/>
  <line x1="210" y1="70" x2="210" y2="260" stroke="#475569" stroke-width="1.5"/>
  
  <line x1="110" y1="165" x2="310" y2="165" stroke="#38bdf8" stroke-width="3"/>
  <circle cx="110" cy="165" r="5" fill="#38bdf8"/>
  <circle cx="310" cy="165" r="5" fill="#38bdf8"/>
  
  <text x="110" y="145" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#f8fafc" text-anchor="middle">P({px_v}, {py_v})</text>
  <text x="310" y="145" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#f8fafc" text-anchor="middle">Q({qx_v}, {qy_v})</text>
  
  <text x="210" y="200" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">Distance d = ?</text>
</svg>"""

    elif type_idx == 9:
        hx_v, hy_v = item.get('hx', 3), item.get('hy', 5)
        sx_v, sy_v = item.get('sx', 9), item.get('sy', 13)
        title = "City Grid Map Locations"
        
        svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 320" width="420" height="320">
  <rect width="100%" height="100%" fill="#0f172a" rx="12"/>
  <rect x="20" y="16" width="380" height="36" fill="#1e293b" rx="8"/>
  <text x="210" y="40" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">{title}</text>
  
  <line x1="120" y1="210" x2="300" y2="100" stroke="#38bdf8" stroke-width="2.5" stroke-dasharray="6,4"/>
  <circle cx="120" cy="210" r="6" fill="#38bdf8"/>
  <circle cx="300" cy="100" r="6" fill="#38bdf8"/>
  
  <text x="110" y="230" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#f8fafc" text-anchor="end">House ({hx_v}, {hy_v})</text>
  <text x="310" y="90" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#f8fafc" text-anchor="start">School ({sx_v}, {sy_v})</text>
  
  <rect x="170" y="140" width="80" height="26" fill="#1e293b" rx="4" stroke="#38bdf8" stroke-width="1"/>
  <text x="210" y="158" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">d = ?</text>
</svg>"""

    elif type_idx == 10:
        ax_v, ay_v = item.get('ax', -4), item.get('ay', -2)
        bx_v, by_v = item.get('bx', 6), item.get('by', 6)
        title = "Circle &amp; Diameter Endpoints"
        
        svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 320" width="420" height="320">
  <rect width="100%" height="100%" fill="#0f172a" rx="12"/>
  <rect x="20" y="16" width="380" height="36" fill="#1e293b" rx="8"/>
  <text x="210" y="40" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">Circle &amp; Diameter Endpoints</text>
  
  <circle cx="210" cy="165" r="75" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
  <line x1="145" y1="205" x2="275" y2="125" stroke="#38bdf8" stroke-width="2"/>
  <circle cx="145" cy="205" r="5" fill="#38bdf8"/>
  <circle cx="275" cy="125" r="5" fill="#38bdf8"/>
  <circle cx="210" cy="165" r="6" fill="#0284c7" stroke="#ffffff" stroke-width="1.5"/>
  
  <text x="135" y="225" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#f8fafc" text-anchor="end">A({ax_v}, {ay_v})</text>
  <text x="285" y="120" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#f8fafc" text-anchor="start">B({bx_v}, {by_v})</text>
  <text x="210" y="190" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">Center M = ?</text>
</svg>"""

    # Write SVG files
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

    title_clean = title.replace('&amp;', '&')

    if type_idx == 1:
        px, py = item.get('px', -9), item.get('py', -9)
        ax.plot([0.15, 0.85], [0.5, 0.5], color='#64748b', lw=2)
        ax.plot([0.5, 0.5], [0.15, 0.85], color='#64748b', lw=2)
        ax.text(0.7, 0.7, "QI", color='#475569', weight='bold', fontsize=12)
        ax.text(0.3, 0.7, "QII", color='#475569', weight='bold', fontsize=12)
        ax.text(0.3, 0.3, "QIII", color='#475569', weight='bold', fontsize=12)
        ax.text(0.7, 0.3, "QIV", color='#475569', weight='bold', fontsize=12)
        
        pt_x = 0.3 if px < 0 else 0.7
        pt_y = 0.3 if py < 0 else 0.7
        ax.plot(pt_x, pt_y, 'o', color='#38bdf8', ms=8)
        ax.text(pt_x, pt_y - 0.08 if py < 0 else pt_y + 0.05, f"P({px}, {py})", color='#38bdf8', weight='bold', fontsize=13, ha='center')

    elif type_idx == 2:
        ax_v, ay_v = item.get('ax', -3), item.get('ay', 5)
        bx_v, by_v = item.get('bx', 3), item.get('by', 11)
        ax.plot([0.15, 0.85], [0.45, 0.45], color='#475569', lw=1.5)
        ax.plot([0.5, 0.5], [0.15, 0.85], color='#475569', lw=1.5)
        ax.plot([0.3, 0.7], [0.35, 0.65], color='#38bdf8', lw=2.5)
        ax.plot(0.3, 0.35, 'o', color='#38bdf8', ms=6)
        ax.plot(0.7, 0.65, 'o', color='#38bdf8', ms=6)
        ax.text(0.28, 0.30, f"A({ax_v}, {ay_v})", color='#f8fafc', weight='bold', fontsize=11, ha='right')
        ax.text(0.72, 0.68, f"B({bx_v}, {by_v})", color='#f8fafc', weight='bold', fontsize=11, ha='left')
        ax.text(0.5, 0.53, "d = ?", color='#38bdf8', weight='bold', fontsize=13, ha='center', va='center',
                bbox=dict(boxstyle="round,pad=0.3", facecolor="#1e293b", edgecolor="#38bdf8", lw=1))

    elif type_idx == 3:
        ax_v, ay_v = item.get('ax', -7), item.get('ay', -5)
        bx_v, by_v = item.get('bx', 2), item.get('by', -6)
        ax.plot([0.15, 0.85], [0.6, 0.6], color='#475569', lw=1.5)
        ax.plot([0.5, 0.5], [0.15, 0.85], color='#475569', lw=1.5)
        ax.plot([0.25, 0.75], [0.4, 0.3], color='#38bdf8', lw=2.5)
        ax.plot(0.25, 0.4, 'o', color='#38bdf8', ms=6)
        ax.plot(0.75, 0.3, 'o', color='#38bdf8', ms=6)
        ax.plot(0.5, 0.35, 'o', color='#0284c7', ms=7, mec='#ffffff', mew=1.5)
        ax.text(0.23, 0.45, f"A({ax_v}, {ay_v})", color='#f8fafc', weight='bold', fontsize=11, ha='right')
        ax.text(0.77, 0.25, f"B({bx_v}, {by_v})", color='#f8fafc', weight='bold', fontsize=11, ha='left')
        ax.text(0.5, 0.22, "Midpoint M = ?", color='#38bdf8', weight='bold', fontsize=13, ha='center')

    elif type_idx == 4:
        mx_v, my_v = item.get('mx', 4), item.get('my', -4)
        px_v, py_v = item.get('px', -4), item.get('py', -5)
        ax.plot([0.15, 0.85], [0.6, 0.6], color='#475569', lw=1.5)
        ax.plot([0.5, 0.5], [0.15, 0.85], color='#475569', lw=1.5)
        ax.plot([0.2, 0.8], [0.35, 0.45], color='#38bdf8', lw=2.5)
        ax.plot(0.2, 0.35, 'o', color='#38bdf8', ms=6)
        ax.plot(0.5, 0.4, 'o', color='#0284c7', ms=6)
        ax.plot(0.8, 0.45, 'o', color='#38bdf8', ms=7, mec='#ffffff', mew=1.5)
        ax.text(0.18, 0.28, f"P({px_v}, {py_v})", color='#f8fafc', weight='bold', fontsize=11, ha='right')
        ax.text(0.5, 0.3, f"M({mx_v}, {my_v})", color='#f8fafc', weight='bold', fontsize=11, ha='center')
        ax.text(0.82, 0.52, "Endpoint Q = ?", color='#38bdf8', weight='bold', fontsize=13, ha='left')

    elif type_idx == 5:
        bx_v, cy_v = item.get('bx', 15), item.get('cy', 20)
        ax.plot([0.3, 0.8, 0.3, 0.3], [0.22, 0.22, 0.78, 0.22], color='#38bdf8', lw=2.5)
        ax.plot([0.3, 0.35, 0.35], [0.26, 0.26, 0.22], color='#38bdf8', lw=1.5)
        ax.text(0.25, 0.18, "A(0,0)", color='#f8fafc', weight='bold', fontsize=11, ha='right')
        ax.text(0.82, 0.18, f"B({bx_v}, 0)", color='#f8fafc', weight='bold', fontsize=11, ha='left')
        ax.text(0.25, 0.8, f"C(0, {cy_v})", color='#f8fafc', weight='bold', fontsize=11, ha='right')
        ax.text(0.55, 0.12, "Perimeter = ?", color='#38bdf8', weight='bold', fontsize=13, ha='center', va='top')

    elif type_idx == 6:
        ax_v, ay_v = item.get('ax', 1), item.get('ay', 6)
        bx_v, by_v = item.get('bx', 3), item.get('by', 10)
        cx_v, cy_v = item.get('cx', 6), item.get('cy', 16)
        ax.plot([0.15, 0.85], [0.25, 0.25], color='#475569', lw=1.5)
        ax.plot([0.25, 0.25], [0.15, 0.85], color='#475569', lw=1.5)
        ax.plot([0.3, 0.8], [0.35, 0.75], color='#38bdf8', lw=2)
        ax.plot(0.3, 0.35, 'o', color='#38bdf8', ms=6)
        ax.plot(0.5, 0.51, 'o', color='#38bdf8', ms=6)
        ax.plot(0.8, 0.75, 'o', color='#38bdf8', ms=6)
        ax.text(0.28, 0.30, f"A({ax_v}, {ay_v})", color='#f8fafc', weight='bold', fontsize=10, ha='right')
        ax.text(0.48, 0.58, f"B({bx_v}, {by_v})", color='#f8fafc', weight='bold', fontsize=10, ha='right')
        ax.text(0.82, 0.78, f"C({cx_v}, {cy_v})", color='#f8fafc', weight='bold', fontsize=10, ha='left')

    elif type_idx == 7:
        x1_v, y1_v = item.get('x1', -2), item.get('y1', 4)
        x2_v, y2_v = item.get('x2', 7), item.get('y2', 8)
        rect = patches.Rectangle((0.26, 0.26), 0.48, 0.48, facecolor="#1e293b", edgecolor="#38bdf8", lw=2.5)
        ax.add_patch(rect)
        ax.plot(0.26, 0.26, 'o', color='#38bdf8', ms=6)
        ax.plot(0.74, 0.74, 'o', color='#38bdf8', ms=6)
        ax.text(0.24, 0.20, f"({x1_v}, {y1_v})", color='#f8fafc', weight='bold', fontsize=11, ha='right')
        ax.text(0.76, 0.78, f"({x2_v}, {y2_v})", color='#f8fafc', weight='bold', fontsize=11, ha='left')
        ax.text(0.5, 0.5, "Area = ?", color='#38bdf8', weight='bold', fontsize=13, ha='center', va='center',
                bbox=dict(boxstyle="round,pad=0.3", facecolor="#0f172a", edgecolor="#38bdf8", lw=1))

    elif type_idx == 8:
        px_v, py_v = item.get('px', -5), item.get('py', 0)
        qx_v, qy_v = item.get('qx', 7), item.get('qy', 0)
        ax.plot([0.15, 0.85], [0.5, 0.5], color='#475569', lw=1.5)
        ax.plot([0.5, 0.5], [0.15, 0.85], color='#475569', lw=1.5)
        ax.plot([0.25, 0.75], [0.5, 0.5], color='#38bdf8', lw=3)
        ax.plot(0.25, 0.5, 'o', color='#38bdf8', ms=6)
        ax.plot(0.75, 0.5, 'o', color='#38bdf8', ms=6)
        ax.text(0.25, 0.58, f"P({px_v}, {py_v})", color='#f8fafc', weight='bold', fontsize=11, ha='center')
        ax.text(0.75, 0.58, f"Q({qx_v}, {qy_v})", color='#f8fafc', weight='bold', fontsize=11, ha='center')
        ax.text(0.5, 0.38, "Distance d = ?", color='#38bdf8', weight='bold', fontsize=13, ha='center')

    elif type_idx == 9:
        hx_v, hy_v = item.get('hx', 3), item.get('hy', 5)
        sx_v, sy_v = item.get('sx', 9), item.get('sy', 13)
        ax.plot([0.28, 0.72], [0.3, 0.7], color='#38bdf8', lw=2.5, ls='--')
        ax.plot(0.28, 0.3, 'o', color='#38bdf8', ms=7)
        ax.plot(0.72, 0.7, 'o', color='#38bdf8', ms=7)
        ax.text(0.25, 0.24, f"House ({hx_v}, {hy_v})", color='#f8fafc', weight='bold', fontsize=11, ha='right')
        ax.text(0.75, 0.76, f"School ({sx_v}, {sy_v})", color='#f8fafc', weight='bold', fontsize=11, ha='left')
        ax.text(0.5, 0.5, "d = ?", color='#38bdf8', weight='bold', fontsize=13, ha='center', va='center',
                bbox=dict(boxstyle="round,pad=0.3", facecolor="#1e293b", edgecolor="#38bdf8", lw=1))

    elif type_idx == 10:
        ax_v, ay_v = item.get('ax', -4), item.get('ay', -2)
        bx_v, by_v = item.get('bx', 6), item.get('by', 6)
        circle = patches.Circle((0.5, 0.5), 0.28, facecolor="#1e293b", edgecolor="#38bdf8", lw=2)
        ax.add_patch(circle)
        ax.plot([0.3, 0.7], [0.35, 0.65], color='#38bdf8', lw=2)
        ax.plot(0.3, 0.35, 'o', color='#38bdf8', ms=6)
        ax.plot(0.7, 0.65, 'o', color='#38bdf8', ms=6)
        ax.plot(0.5, 0.5, 'o', color='#0284c7', ms=7, mec='#ffffff', mew=1.5)
        ax.text(0.27, 0.28, f"A({ax_v}, {ay_v})", color='#f8fafc', weight='bold', fontsize=11, ha='right')
        ax.text(0.73, 0.72, f"B({bx_v}, {by_v})", color='#f8fafc', weight='bold', fontsize=11, ha='left')
        ax.text(0.5, 0.42, "Center M = ?", color='#38bdf8', weight='bold', fontsize=13, ha='center')

    ax.text(0.5, 0.93, title_clean, color='#38bdf8', weight='bold', fontsize=12, ha='center', va='center',
            bbox=dict(boxstyle="round,pad=0.4", facecolor="#1e293b", edgecolor="none"))

    plt.subplots_adjust(left=0.02, right=0.98, top=0.98, bottom=0.02)

    for target_dir in TARGET_DIRS:
        png_path = os.path.join(target_dir, f"{filename}.png")
        plt.savefig(png_path, facecolor='#0f172a', edgecolor='none')
        
    plt.close()

for item in parsed_items:
    generate_t129_single(item)

print("Generated clean 1-to-1 matching SVGs and PNGs for all 50 questions in Topic 129!")
