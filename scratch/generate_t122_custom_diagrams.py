import os
import glob
import math
import matplotlib.pyplot as plt
import matplotlib.patches as patches

# Directories to save images
TARGET_DIRS = [
    'public/images',
    'QBank/public/images',
    'dist/images',
    'QBank/dist/images'
]

for d in TARGET_DIRS:
    os.makedirs(d, exist_ok=True)

def create_stem_leaf_svg(filename, diagram_title, stems_data, key_text):
    """
    stems_data = [
       ('4', ['2', '5']),
       ('5', ['1', '3', '8']),
       ('6', ['0', '4', '7'])
    ]
    """
    rows_xml = ""
    y_start = 120
    row_height = 45
    
    for idx, (stem, leaves) in enumerate(stems_data):
        y = y_start + idx * row_height
        leaves_str = " &nbsp;&nbsp; ".join(leaves)
        rows_xml += f"""
        <text x="120" y="{y}" font-family="Inter, sans-serif" font-size="18" font-weight="700" fill="#38bdf8" text-anchor="middle">{stem}</text>
        <text x="240" y="{y}" font-family="Inter, sans-serif" font-size="18" font-weight="600" fill="#f8fafc" text-anchor="middle">{leaves_str}</text>
        """
        if idx < len(stems_data) - 1:
            y_line = y + 15
            rows_xml += f'<line x1="80" y1="{y_line}" x2="340" y2="{y_line}" stroke="#334155" stroke-width="1"/>'

    svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 320" width="420" height="320">
  <rect width="100%" height="100%" fill="#0f172a" rx="12"/>
  <!-- Header Banner -->
  <rect x="20" y="16" width="380" height="36" fill="#1e293b" rx="8"/>
  <text x="210" y="40" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">{diagram_title}</text>
  
  <!-- Table Container -->
  <rect x="40" y="68" width="340" height="185" fill="#1e293b" rx="10" stroke="#334155" stroke-width="1.5"/>
  
  <!-- Headers -->
  <text x="120" y="94" font-family="Inter, sans-serif" font-size="15" font-weight="700" fill="#38bdf8" text-anchor="middle">Stem</text>
  <line x1="170" y1="75" x2="170" y2="245" stroke="#38bdf8" stroke-width="2"/>
  <text x="250" y="94" font-family="Inter, sans-serif" font-size="15" font-weight="700" fill="#38bdf8" text-anchor="middle">Leaf</text>
  <line x1="40" y1="102" x2="380" y2="102" stroke="#334155" stroke-width="1.5"/>
  
  <!-- Rows -->
  {rows_xml}
  
  <!-- Key Footer -->
  <rect x="70" y="268" width="280" height="32" fill="#0284c7" rx="6"/>
  <text x="210" y="289" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="#ffffff" text-anchor="middle">{key_text}</text>
</svg>"""

    for target_dir in TARGET_DIRS:
        svg_path = os.path.join(target_dir, f"{filename}.svg")
        with open(svg_path, 'w', encoding='utf-8') as f:
            f.write(svg_content)
        
        # Also render PNG using matplotlib
        plt.figure(figsize=(4.2, 3.2), dpi=100, facecolor='#0f172a')
        ax = plt.subplot(111)
        ax.set_facecolor('#0f172a')
        ax.axis('off')
        
        # Title
        ax.text(0.5, 0.92, diagram_title, color='#38bdf8', weight='bold', fontsize=12, ha='center', va='center',
                bbox=dict(boxstyle="round,pad=0.4", facecolor="#1e293b", edgecolor="none"))
        
        # Outer box
        rect = patches.FancyBboxPatch((0.1, 0.22), 0.8, 0.60, boxstyle="round,pad=0.02",
                                      facecolor="#1e293b", edgecolor="#334155", linewidth=1.5)
        ax.add_patch(rect)
        
        # Headers
        ax.text(0.3, 0.76, "Stem", color='#38bdf8', weight='bold', fontsize=12, ha='center')
        ax.text(0.65, 0.76, "Leaf", color='#38bdf8', weight='bold', fontsize=12, ha='center')
        ax.plot([0.45, 0.45], [0.24, 0.80], color='#38bdf8', linewidth=2)
        ax.plot([0.12, 0.88], [0.72, 0.72], color='#334155', linewidth=1.5)
        
        # Rows
        n_rows = len(stems_data)
        for r_i, (stem, leaves) in enumerate(stems_data):
            r_y = 0.60 - r_i * (0.35 / max(1, n_rows - 1)) if n_rows > 1 else 0.55
            ax.text(0.3, r_y, stem, color='#38bdf8', weight='bold', fontsize=13, ha='center', va='center')
            leaves_str = "   ".join(leaves)
            ax.text(0.65, r_y, leaves_str, color='#f8fafc', weight='bold', fontsize=13, ha='center', va='center')
        
        # Key
        ax.text(0.5, 0.08, key_text, color='#ffffff', weight='bold', fontsize=10, ha='center', va='center',
                bbox=dict(boxstyle="round,pad=0.4", facecolor="#0284c7", edgecolor="none"))
        
        png_path = os.path.join(target_dir, f"{filename}.png")
        plt.tight_layout()
        plt.savefig(png_path, facecolor='#0f172a', edgecolor='none')
        plt.close()

def create_pie_chart_svg(filename, diagram_title, category, part, total):
    pct = (part / total) * 100.0
    angle = (part / total) * 360.0
    other_pct = 100.0 - pct
    
    # Calculate SVG arc coordinates
    # Center (210, 165), Radius 90
    cx, cy, r = 210, 165, 90
    # Start angle -90 deg (top)
    rad_start = -math.pi / 2
    rad_target = rad_start + (angle * math.pi / 180.0)
    
    x1 = cx + r * math.cos(rad_start)
    y1 = cy + r * math.sin(rad_start)
    x2 = cx + r * math.cos(rad_target)
    y2 = cy + r * math.sin(rad_target)
    
    large_arc = 1 if angle > 180 else 0
    
    path_d = f"M {cx} {cy} L {x1:.2f} {y1:.2f} A {r} {r} 0 {large_arc} 1 {x2:.2f} {y2:.2f} Z"
    
    svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 320" width="420" height="320">
  <rect width="100%" height="100%" fill="#0f172a" rx="12"/>
  <!-- Header Banner -->
  <rect x="20" y="16" width="380" height="36" fill="#1e293b" rx="8"/>
  <text x="210" y="40" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">{diagram_title}</text>
  
  <!-- Circle Base (Others) -->
  <circle cx="{cx}" cy="{cy}" r="{r}" fill="#334155" stroke="#1e293b" stroke-width="2"/>
  
  <!-- Category Sector -->
  <path d="{path_d}" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>
  
  <!-- Center Dot -->
  <circle cx="{cx}" cy="{cy}" r="4" fill="#ffffff"/>
  
  <!-- Legend Box -->
  <rect x="40" y="270" width="340" height="36" fill="#1e293b" rx="6" stroke="#334155" stroke-width="1"/>
  <rect x="55" y="282" width="12" height="12" fill="#0284c7" rx="2"/>
  <text x="75" y="292" font-family="Inter, sans-serif" font-size="12" font-weight="600" fill="#f8fafc">{category}: {part} ({pct:.1f}%)</text>
  
  <rect x="220" y="282" width="12" height="12" fill="#334155" rx="2"/>
  <text x="240" y="292" font-family="Inter, sans-serif" font-size="12" font-weight="600" fill="#94a3b8">Others: {total - part} ({other_pct:.1f}%)</text>
</svg>"""

    for target_dir in TARGET_DIRS:
        svg_path = os.path.join(target_dir, f"{filename}.svg")
        with open(svg_path, 'w', encoding='utf-8') as f:
            f.write(svg_content)
            
        # Matplotlib PNG
        plt.figure(figsize=(4.2, 3.2), dpi=100, facecolor='#0f172a')
        ax = plt.subplot(111)
        ax.set_facecolor('#0f172a')
        
        sizes = [part, total - part]
        labels = [f"{category}\n{part} ({pct:.1f}%)", f"Others\n{total - part} ({other_pct:.1f}%)"]
        colors = ['#0284c7', '#334155']
        
        wedges, texts = ax.pie(sizes, labels=labels, colors=colors, startangle=90,
                               textprops=dict(color='#f8fafc', weight='bold', fontsize=10))
        for w in wedges:
            w.set_edgecolor('#38bdf8')
            w.set_linewidth(1.5)
            
        plt.title(diagram_title, color='#38bdf8', weight='bold', fontsize=12, pad=15)
        png_path = os.path.join(target_dir, f"{filename}.png")
        plt.tight_layout()
        plt.savefig(png_path, facecolor='#0f172a', edgecolor='none')
        plt.close()

# Generate Stem-and-Leaf diagrams
# Q128679 (q6)
create_stem_leaf_svg('dp_t122_q6', 'Quiz Scores (Stem-and-Leaf Plot)',
                    [('4', ['2', '5']), ('5', ['1', '3', '8']), ('6', ['0', '4', '7'])],
                    'Key: 5 | 2 = 52')

# Q128689 (q16)
create_stem_leaf_svg('dp_t122_q16', 'Quiz Scores (Stem-and-Leaf Plot)',
                    [('6', ['1', '4', '8']), ('7', ['2', '5']), ('8', ['0', '3', '9'])],
                    'Key: 5 | 2 = 52')

# Q128699 (q26)
create_stem_leaf_svg('dp_t122_q26', 'Quiz Scores (Stem-and-Leaf Plot)',
                    [('5', ['0', '2', '6']), ('6', ['3', '7', '9']), ('7', ['1', '5'])],
                    'Key: 5 | 2 = 52')

# Q128709 (q36)
create_stem_leaf_svg('dp_t122_q36', 'Quiz Scores (Stem-and-Leaf Plot)',
                    [('7', ['3', '5', '8']), ('8', ['1', '4']), ('9', ['0', '2', '6'])],
                    'Key: 5 | 2 = 52')

# Q128719 (q46)
create_stem_leaf_svg('dp_t122_q46', 'Quiz Scores (Stem-and-Leaf Plot)',
                    [('3', ['4', '9']), ('4', ['2', '6', '8']), ('5', ['1', '5', '7'])],
                    'Key: 5 | 2 = 52')

# Generate Pie Chart diagrams
# Q128680 (q7): Mathematics 60 / 200
create_pie_chart_svg('dp_t122_q7', 'Favorite Subject Survey (N = 200)', 'Mathematics', 60, 200)

# Q128690 (q17): Science 45 / 180
create_pie_chart_svg('dp_t122_q17', 'Favorite Subject Survey (N = 180)', 'Science', 45, 180)

# Q128700 (q27): English 80 / 300
create_pie_chart_svg('dp_t122_q27', 'Favorite Subject Survey (N = 300)', 'English', 80, 300)

# Q128710 (q37): History 35 / 140
create_pie_chart_svg('dp_t122_q37', 'Favorite Subject Survey (N = 140)', 'History', 35, 140)

# Q128720 (q47): Art 50 / 250
create_pie_chart_svg('dp_t122_q47', 'Favorite Subject Survey (N = 250)', 'Art', 50, 250)

print("Generated custom 1-to-1 matching SVG & PNG diagrams for Topic 122!")
