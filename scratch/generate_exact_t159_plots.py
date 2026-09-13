import os

# Destination directories
PUBLIC_DIR = "public/images"
QBANK_PUBLIC_DIR = "QBank/public/images"

os.makedirs(PUBLIC_DIR, exist_ok=True)
os.makedirs(QBANK_PUBLIC_DIR, exist_ok=True)

plots_svg = {}

# Helper wrapper for clean SVG
def wrap_svg(content, width=500, height=340):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" width="{width}" height="{height}">
  <rect width="100%" height="100%" fill="#0f172a" rx="12" />
{content}
</svg>'''

# Q2: Truncated vertical axis bar graph
plots_svg["g9_t159_q2.svg"] = wrap_svg('''
  <!-- Grid & Axes -->
  <line x1="70" y1="50" x2="70" y2="260" stroke="#475569" stroke-width="2"/>
  <line x1="70" y1="260" x2="440" y2="260" stroke="#475569" stroke-width="2"/>
  
  <!-- Y-Axis Labels starting at 95 -->
  <text x="60" y="265" text-anchor="end" fill="#ec4899" font-family="sans-serif" font-size="12" font-weight="bold">95</text>
  <text x="60" y="165" text-anchor="end" fill="#94a3b8" font-family="sans-serif" font-size="12">100</text>
  <text x="60" y="65" text-anchor="end" fill="#94a3b8" font-family="sans-serif" font-size="12">105</text>
  
  <!-- Axis break symbol -->
  <path d="M 65 245 L 75 240 M 65 240 L 75 235" stroke="#ec4899" stroke-width="2"/>
  
  <!-- Bars -->
  <!-- Category A (100) -> height 100 on 95..105 scale -->
  <rect x="130" y="160" width="80" height="100" fill="#38bdf8" rx="4"/>
  <text x="170" y="150" text-anchor="middle" fill="#38bdf8" font-family="sans-serif" font-size="13" font-weight="bold">100</text>
  <text x="170" y="285" text-anchor="middle" fill="#e2e8f0" font-family="sans-serif" font-size="13">Category A</text>
  
  <!-- Category B (105) -> height 200 on 95..105 scale -->
  <rect x="290" y="60" width="80" height="200" fill="#ec4899" rx="4"/>
  <text x="330" y="50" text-anchor="middle" fill="#ec4899" font-family="sans-serif" font-size="13" font-weight="bold">105</text>
  <text x="330" y="285" text-anchor="middle" fill="#e2e8f0" font-family="sans-serif" font-size="13">Category B</text>
''')

# Q3: Truncated sales growth (Year 1 vs Year 2 starting at ₱95M)
plots_svg["g9_t159_q3.svg"] = wrap_svg('''
  <line x1="80" y1="50" x2="80" y2="260" stroke="#475569" stroke-width="2"/>
  <line x1="80" y1="260" x2="440" y2="260" stroke="#475569" stroke-width="2"/>
  
  <text x="70" y="265" text-anchor="end" fill="#ec4899" font-family="sans-serif" font-size="12" font-weight="bold">₱95M</text>
  <text x="70" y="165" text-anchor="end" fill="#94a3b8" font-family="sans-serif" font-size="12">₱100M</text>
  <text x="70" y="65" text-anchor="end" fill="#94a3b8" font-family="sans-serif" font-size="12">₱105M</text>
  
  <path d="M 75 245 L 85 240 M 75 240 L 85 235" stroke="#ec4899" stroke-width="2"/>
  
  <!-- Year 1 (100M) -->
  <rect x="140" y="160" width="80" height="100" fill="#38bdf8" rx="4"/>
  <text x="180" y="150" text-anchor="middle" fill="#38bdf8" font-family="sans-serif" font-size="13" font-weight="bold">₱100M</text>
  <text x="180" y="285" text-anchor="middle" fill="#e2e8f0" font-family="sans-serif" font-size="13">Year 1</text>
  
  <!-- Year 2 (105M) -->
  <rect x="300" y="60" width="80" height="200" fill="#f59e0b" rx="4"/>
  <text x="340" y="50" text-anchor="middle" fill="#f59e0b" font-family="sans-serif" font-size="13" font-weight="bold">₱105M</text>
  <text x="340" y="285" text-anchor="middle" fill="#e2e8f0" font-family="sans-serif" font-size="13">Year 2</text>
''')

# Q4: Altering scale intervals (Stretched Y vs Standard)
plots_svg["g9_t159_q4.svg"] = wrap_svg('''
  <!-- Graph 1: Stretched Y scale -->
  <g transform="translate(30, 40)">
    <rect x="0" y="0" width="200" height="230" fill="#1e293b" rx="6"/>
    <line x1="30" y1="20" x2="30" y2="190" stroke="#64748b" stroke-width="1.5"/>
    <line x1="30" y1="190" x2="180" y2="190" stroke="#64748b" stroke-width="1.5"/>
    <!-- Line curve (steep) -->
    <path d="M 40 170 L 80 130 L 120 70 L 160 30" fill="none" stroke="#ef4444" stroke-width="3"/>
    <circle cx="40" cy="170" r="4" fill="#ef4444"/>
    <circle cx="160" cy="30" r="4" fill="#ef4444"/>
    <text x="105" y="215" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="11">Stretched Vertical Scale</text>
  </g>

  <!-- Graph 2: Standard Proportioned scale -->
  <g transform="translate(260, 40)">
    <rect x="0" y="0" width="200" height="230" fill="#1e293b" rx="6"/>
    <line x1="30" y1="20" x2="30" y2="190" stroke="#64748b" stroke-width="1.5"/>
    <line x1="30" y1="190" x2="180" y2="190" stroke="#64748b" stroke-width="1.5"/>
    <!-- Line curve (gentle) -->
    <path d="M 40 150 L 80 145 L 120 140 L 160 130" fill="none" stroke="#10b981" stroke-width="3"/>
    <circle cx="40" cy="150" r="4" fill="#10b981"/>
    <circle cx="160" cy="130" r="4" fill="#10b981"/>
    <text x="105" y="215" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="11">Standard Proportioned Scale</text>
  </g>
''')

# Q5: 3D perspective pie chart distortion
plots_svg["g9_t159_q5.svg"] = wrap_svg('''
  <!-- 3D Pie Chart illustration -->
  <g transform="translate(100, 60)">
    <!-- 3D Base Ellipse -->
    <ellipse cx="150" cy="140" rx="140" ry="70" fill="#3b82f6" opacity="0.4"/>
    <ellipse cx="150" cy="120" rx="140" ry="70" fill="#1d4ed8"/>
    
    <!-- Slices -->
    <!-- Foreground slice (tilted, front) -->
    <path d="M 150 120 L 10 120 A 140 70 0 0 0 290 120 Z" fill="#ec4899"/>
    <text x="150" y="160" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="14" font-weight="bold">Front Slice (Foreground)</text>
    
    <!-- Background slice -->
    <path d="M 150 120 L 290 120 A 140 70 0 0 0 150 50 Z" fill="#10b981"/>
    <text x="210" y="90" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="12">Back Slice</text>
  </g>
''')

# Q6: Pictogram scaled in height & width proportionally
plots_svg["g9_t159_q6.svg"] = wrap_svg('''
  <g transform="translate(60, 60)">
    <!-- Small Icon (1x1) -->
    <rect x="40" y="120" width="60" height="60" fill="#38bdf8" rx="6" stroke="#0284c7" stroke-width="2"/>
    <text x="70" y="210" text-anchor="middle" fill="#e2e8f0" font-family="sans-serif" font-size="13">Original (1x1)</text>
    <text x="70" y="230" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="11">Area = 1 unit²</text>
  </g>
  
  <g transform="translate(260, 60)">
    <!-- Large Icon (2x2) -->
    <rect x="20" y="60" width="120" height="120" fill="#f59e0b" rx="6" stroke="#d97706" stroke-width="2"/>
    <text x="80" y="210" text-anchor="middle" fill="#e2e8f0" font-family="sans-serif" font-size="13">2x Height & 2x Width</text>
    <text x="80" y="230" text-anchor="middle" fill="#f59e0b" font-family="sans-serif" font-size="11" font-weight="bold">Area = 4 units² (4x Increase!)</text>
  </g>
''')

# Q7: Money bag pictogram scaling
plots_svg["g9_t159_q7.svg"] = wrap_svg('''
  <!-- Money Bag Icon 1 (1 unit tall x 1 unit wide) -->
  <g transform="translate(80, 80)">
    <circle cx="50" cy="110" r="35" fill="#10b981"/>
    <path d="M 35 75 L 65 75 L 60 60 L 40 60 Z" fill="#059669"/>
    <text x="50" y="115" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="16" font-weight="bold">₱</text>
    <text x="50" y="170" text-anchor="middle" fill="#e2e8f0" font-family="sans-serif" font-size="13">1x Dimensions</text>
    <text x="50" y="190" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="11">Area = A</text>
  </g>

  <!-- Money Bag Icon 2 (2 units tall x 2 units wide) -->
  <g transform="translate(280, 30)">
    <circle cx="70" cy="130" r="70" fill="#10b981"/>
    <path d="M 40 60 L 100 60 L 90 30 L 50 30 Z" fill="#059669"/>
    <text x="70" y="140" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="32" font-weight="bold">₱</text>
    <text x="70" y="220" text-anchor="middle" fill="#e2e8f0" font-family="sans-serif" font-size="13">2x Height & 2x Width</text>
    <text x="70" y="240" text-anchor="middle" fill="#10b981" font-family="sans-serif" font-size="12" font-weight="bold">Area = 4A</text>
  </g>
''')

# Q14: Omission of Brand C from smartphone chart
plots_svg["g9_t159_q14.svg"] = wrap_svg('''
  <line x1="70" y1="50" x2="70" y2="260" stroke="#475569" stroke-width="2"/>
  <line x1="70" y1="260" x2="440" y2="260" stroke="#475569" stroke-width="2"/>
  
  <text x="60" y="265" text-anchor="end" fill="#94a3b8" font-family="sans-serif" font-size="12">0%</text>
  <text x="60" y="165" text-anchor="end" fill="#94a3b8" font-family="sans-serif" font-size="12">50%</text>
  <text x="60" y="65" text-anchor="end" fill="#94a3b8" font-family="sans-serif" font-size="12">100%</text>
  
  <!-- Brand A -->
  <rect x="110" y="120" width="60" height="140" fill="#38bdf8" rx="4"/>
  <text x="140" y="285" text-anchor="middle" fill="#e2e8f0" font-family="sans-serif" font-size="12">Brand A</text>

  <!-- Brand B -->
  <rect x="210" y="130" width="60" height="130" fill="#818cf8" rx="4"/>
  <text x="240" y="285" text-anchor="middle" fill="#e2e8f0" font-family="sans-serif" font-size="12">Brand B</text>

  <!-- Omitted Brand C Indicator -->
  <rect x="310" y="258" width="60" height="4" fill="#ef4444"/>
  <text x="340" y="285" text-anchor="middle" fill="#ef4444" font-family="sans-serif" font-size="12" font-weight="bold">[Omitted]</text>
''')

# Q17: Missing legend, axis labels, and units
plots_svg["g9_t159_q17.svg"] = wrap_svg('''
  <!-- Line graph with NO axis labels or units -->
  <line x1="60" y1="40" x2="60" y2="260" stroke="#64748b" stroke-width="2"/>
  <line x1="60" y1="260" x2="440" y2="260" stroke="#64748b" stroke-width="2"/>
  
  <!-- Question marks along axes -->
  <text x="40" y="150" text-anchor="middle" fill="#ef4444" font-family="sans-serif" font-size="20" font-weight="bold">?</text>
  <text x="250" y="295" text-anchor="middle" fill="#ef4444" font-family="sans-serif" font-size="20" font-weight="bold">?</text>
  
  <!-- Arbitrary rising curve -->
  <path d="M 80 220 C 180 200, 260 90, 420 60" fill="none" stroke="#f59e0b" stroke-width="3"/>
  <circle cx="80" cy="220" r="4" fill="#f59e0b"/>
  <circle cx="420" cy="60" r="4" fill="#f59e0b"/>
  
  <text x="250" y="320" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="12">Graph missing Y-axis scale, X-axis units, and legend</text>
''')

# Q18: Dual-axis scale manipulation
plots_svg["g9_t159_q18.svg"] = wrap_svg('''
  <!-- Left Axis (0 to 100) -->
  <line x1="60" y1="50" x2="60" y2="250" stroke="#38bdf8" stroke-width="2"/>
  <text x="50" y="55" text-anchor="end" fill="#38bdf8" font-family="sans-serif" font-size="11">100 (A)</text>
  <text x="50" y="255" text-anchor="end" fill="#38bdf8" font-family="sans-serif" font-size="11">0 (A)</text>
  
  <!-- Right Axis (1000 to 1050) -->
  <line x1="440" y1="50" x2="440" y2="250" stroke="#ec4899" stroke-width="2"/>
  <text x="450" y="55" text-anchor="start" fill="#ec4899" font-family="sans-serif" font-size="11">1050 (B)</text>
  <text x="450" y="255" text-anchor="start" fill="#ec4899" font-family="sans-serif" font-size="11">1000 (B)</text>

  <line x1="60" y1="250" x2="440" y2="250" stroke="#64748b" stroke-width="2"/>

  <!-- Variable A curve -->
  <path d="M 80 230 L 180 180 L 280 120 L 380 70" fill="none" stroke="#38bdf8" stroke-width="3"/>

  <!-- Variable B curve (forced to overlap visually) -->
  <path d="M 80 220 L 180 170 L 280 130 L 380 80" fill="none" stroke="#ec4899" stroke-width="3" stroke-dasharray="6 4"/>
''')

# Q20: Pie chart summing to 128%
plots_svg["g9_t159_q20.svg"] = wrap_svg('''
  <g transform="translate(130, 40)">
    <circle cx="120" cy="120" r="110" fill="#1e293b" stroke="#475569" stroke-width="2"/>
    
    <!-- Sector 1: 45% (162 deg) -->
    <path d="M 120 120 L 120 10 A 110 110 0 0 1 224 165 Z" fill="#38bdf8"/>
    <text x="160" y="80" fill="#ffffff" font-family="sans-serif" font-size="13" font-weight="bold">A: 45%</text>

    <!-- Sector 2: 43% (154.8 deg) -->
    <path d="M 120 120 L 224 165 A 110 110 0 0 1 20 170 Z" fill="#ec4899"/>
    <text x="110" y="190" fill="#ffffff" font-family="sans-serif" font-size="13" font-weight="bold">B: 43%</text>

    <!-- Sector 3: 40% (144 deg) overlapping/exceeding circle -->
    <path d="M 120 120 L 20 170 A 110 110 0 0 1 120 10 Z" fill="#f59e0b" opacity="0.8"/>
    <text x="50" y="80" fill="#ffffff" font-family="sans-serif" font-size="13" font-weight="bold">C: 40%</text>
  </g>
  
  <text x="250" y="315" text-anchor="middle" fill="#ef4444" font-family="sans-serif" font-size="13" font-weight="bold">Total Sector Percentages = 128% (Invalid!)</text>
''')

# Q21: Cumulative frequency graph masking declining gains
plots_svg["g9_t159_q21.svg"] = wrap_svg('''
  <line x1="70" y1="50" x2="70" y2="250" stroke="#475569" stroke-width="2"/>
  <line x1="70" y1="250" x2="430" y2="250" stroke="#475569" stroke-width="2"/>

  <!-- Cumulative Curve (Monotonically rising) -->
  <path d="M 90 230 L 170 130 L 250 80 L 330 60 L 410 50" fill="none" stroke="#10b981" stroke-width="3"/>
  <circle cx="90" cy="230" r="4" fill="#10b981"/>
  <circle cx="170" cy="130" r="4" fill="#10b981"/>
  <circle cx="250" cy="80" r="4" fill="#10b981"/>
  <circle cx="330" cy="60" r="4" fill="#10b981"/>
  <circle cx="410" cy="50" r="4" fill="#10b981"/>

  <text x="90" y="275" text-anchor="middle" fill="#e2e8f0" font-family="sans-serif" font-size="11">Q1 (+100)</text>
  <text x="170" y="275" text-anchor="middle" fill="#e2e8f0" font-family="sans-serif" font-size="11">Q2 (+60)</text>
  <text x="250" y="275" text-anchor="middle" fill="#e2e8f0" font-family="sans-serif" font-size="11">Q3 (+30)</text>
  <text x="330" y="275" text-anchor="middle" fill="#e2e8f0" font-family="sans-serif" font-size="11">Q4 (+10)</text>

  <text x="250" y="315" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="12">Cumulative line always rises, hiding declining quarterly additions</text>
''')

# Q24: Non-uniform interval histogram binning
plots_svg["g9_t159_q24.svg"] = wrap_svg('''
  <line x1="60" y1="50" x2="60" y2="250" stroke="#475569" stroke-width="2"/>
  <line x1="60" y1="250" x2="440" y2="250" stroke="#475569" stroke-width="2"/>

  <!-- Bin 0-50 (Width = 150px) -->
  <rect x="60" y="150" width="150" height="100" fill="#38bdf8" opacity="0.8" stroke="#0284c7"/>
  <text x="135" y="270" text-anchor="middle" fill="#e2e8f0" font-family="sans-serif" font-size="11">0 – 50</text>

  <!-- Bin 50-60 (Width = 30px) -->
  <rect x="210" y="100" width="40" height="150" fill="#f59e0b" opacity="0.8" stroke="#d97706"/>
  <text x="230" y="270" text-anchor="middle" fill="#e2e8f0" font-family="sans-serif" font-size="11">50-60</text>

  <!-- Bin 60-70 (Width = 30px) -->
  <rect x="250" y="70" width="40" height="180" fill="#ec4899" opacity="0.8" stroke="#be185d"/>
  <text x="270" y="270" text-anchor="middle" fill="#e2e8f0" font-family="sans-serif" font-size="11">60-70</text>

  <!-- Bin 70-100 (Width = 130px) -->
  <rect x="290" y="180" width="130" height="70" fill="#10b981" opacity="0.8" stroke="#047857"/>
  <text x="355" y="270" text-anchor="middle" fill="#e2e8f0" font-family="sans-serif" font-size="11">70 – 100</text>
''')

# Q26: Confounding variable (Ice Cream vs Drowning)
plots_svg["g9_t159_q26.svg"] = wrap_svg('''
  <line x1="60" y1="50" x2="60" y2="250" stroke="#475569" stroke-width="2"/>
  <line x1="60" y1="250" x2="440" y2="250" stroke="#475569" stroke-width="2"/>

  <!-- Ice Cream Sales Curve -->
  <path d="M 80 230 Q 250 50 420 230" fill="none" stroke="#f59e0b" stroke-width="3"/>

  <!-- Drowning Incidents Curve (tracking together) -->
  <path d="M 80 210 Q 250 70 420 210" fill="none" stroke="#ef4444" stroke-width="3" stroke-dasharray="6 4"/>

  <text x="250" y="275" text-anchor="middle" fill="#e2e8f0" font-family="sans-serif" font-size="12">Jan ... Jun Jul Aug ... Dec</text>
  <text x="250" y="315" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="12">Both variables peak during summer due to warm weather</text>
''')

# Q28: Varying bar widths in bar chart
plots_svg["g9_t159_q28.svg"] = wrap_svg('''
  <line x1="70" y1="50" x2="70" y2="250" stroke="#475569" stroke-width="2"/>
  <line x1="70" y1="250" x2="430" y2="250" stroke="#475569" stroke-width="2"/>

  <!-- Narrow Bar (Width = 40) -->
  <rect x="110" y="110" width="40" height="140" fill="#38bdf8" rx="3"/>
  <text x="130" y="275" text-anchor="middle" fill="#e2e8f0" font-family="sans-serif" font-size="12">Brand X (Narrow)</text>

  <!-- Wide Bar (Width = 140) -->
  <rect x="230" y="100" width="140" height="150" fill="#ec4899" rx="3"/>
  <text x="300" y="275" text-anchor="middle" fill="#e2e8f0" font-family="sans-serif" font-size="12">Brand Y (Wide)</text>
''')

# Q29: Timeframe manipulation on stock chart
plots_svg["g9_t159_q29.svg"] = wrap_svg('''
  <line x1="60" y1="50" x2="60" y2="250" stroke="#475569" stroke-width="2"/>
  <line x1="60" y1="250" x2="440" y2="250" stroke="#475569" stroke-width="2"/>

  <!-- Long-term 6-month downward trend line -->
  <path d="M 80 70 L 320 220 L 410 110" fill="none" stroke="#ef4444" stroke-width="2.5"/>

  <!-- Highlighted 3-day window at end -->
  <rect x="310" y="40" width="110" height="200" fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" stroke-dasharray="4 4" rx="4"/>
  <text x="365" y="30" text-anchor="middle" fill="#10b981" font-family="sans-serif" font-size="11" font-weight="bold">3-Day Window</text>

  <text x="180" y="275" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="11">6-Month Plunge</text>
  <text x="365" y="275" text-anchor="middle" fill="#10b981" font-family="sans-serif" font-size="11">3-Day Spike</text>
''')

# Q30: Cherry-picked start/end dates on economic trend line
plots_svg["g9_t159_q30.svg"] = wrap_svg('''
  <line x1="60" y1="50" x2="60" y2="250" stroke="#475569" stroke-width="2"/>
  <line x1="60" y1="250" x2="440" y2="250" stroke="#475569" stroke-width="2"/>

  <!-- Wavy unemployment line -->
  <path d="M 80 180 L 160 80 L 240 210 L 320 70 L 400 190" fill="none" stroke="#818cf8" stroke-width="3"/>

  <!-- Choice 1: Start valley -> End peak (Upward slope) -->
  <line x1="80" y1="180" x2="320" y2="70" stroke="#10b981" stroke-width="2" stroke-dasharray="5 3"/>
  
  <!-- Choice 2: Start peak -> End valley (Downward slope) -->
  <line x1="160" y1="80" x2="400" y2="190" stroke="#ef4444" stroke-width="2" stroke-dasharray="5 3"/>
''')

# Q34: Color choice emotional manipulation
plots_svg["g9_t159_q34.svg"] = wrap_svg('''
  <line x1="70" y1="50" x2="70" y2="250" stroke="#475569" stroke-width="2"/>
  <line x1="70" y1="250" x2="430" y2="250" stroke="#475569" stroke-width="2"/>

  <!-- +5% Gain (Dull grey) -->
  <rect x="120" y="90" width="70" height="160" fill="#64748b" rx="4"/>
  <text x="155" y="275" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="12">+5% Gain</text>

  <!-- -1% Drop (Glaring Alarming Red) -->
  <rect x="270" y="110" width="70" height="140" fill="#ef4444" rx="4" stroke="#f87171" stroke-width="2"/>
  <text x="305" y="275" text-anchor="middle" fill="#ef4444" font-family="sans-serif" font-size="12" font-weight="bold">-1% Drop</text>
''')

# Q35: Inverted Y-axis
plots_svg["g9_t159_q35.svg"] = wrap_svg('''
  <line x1="70" y1="50" x2="70" y2="250" stroke="#475569" stroke-width="2"/>
  <line x1="70" y1="250" x2="430" y2="250" stroke="#475569" stroke-width="2"/>

  <!-- Inverted Y-Axis Labels (0 at top, 1000 at bottom) -->
  <text x="60" y="60" text-anchor="end" fill="#ef4444" font-family="sans-serif" font-size="12" font-weight="bold">0</text>
  <text x="60" y="155" text-anchor="end" fill="#94a3b8" font-family="sans-serif" font-size="12">500</text>
  <text x="60" y="250" text-anchor="end" fill="#94a3b8" font-family="sans-serif" font-size="12">1000</text>

  <!-- Curve sloping visually downward (actually increasing in count!) -->
  <path d="M 100 80 L 200 120 L 300 180 L 400 230" fill="none" stroke="#f59e0b" stroke-width="3"/>
  <circle cx="100" cy="80" r="4" fill="#f59e0b"/>
  <circle cx="400" cy="230" r="4" fill="#f59e0b"/>

  <text x="250" y="315" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="12">Inverted Axis: Visual drop actually represents increase from 100 to 900</text>
''')

# Q40: Equal spacing of irregular time intervals
plots_svg["g9_t159_q40.svg"] = wrap_svg('''
  <line x1="60" y1="50" x2="60" y2="250" stroke="#475569" stroke-width="2"/>
  <line x1="60" y1="250" x2="440" y2="250" stroke="#475569" stroke-width="2"/>

  <!-- Line connecting equally spaced points -->
  <path d="M 100 200 L 190 180 L 280 160 L 370 60" fill="none" stroke="#38bdf8" stroke-width="3"/>
  <circle cx="100" cy="200" r="4" fill="#38bdf8"/>
  <circle cx="190" cy="180" r="4" fill="#38bdf8"/>
  <circle cx="280" cy="160" r="4" fill="#38bdf8"/>
  <circle cx="370" cy="60" r="4" fill="#38bdf8"/>

  <!-- Equally spaced X labels -->
  <text x="100" y="275" text-anchor="middle" fill="#e2e8f0" font-family="sans-serif" font-size="12">Day 1</text>
  <text x="190" y="275" text-anchor="middle" fill="#e2e8f0" font-family="sans-serif" font-size="12">Day 2</text>
  <text x="280" y="275" text-anchor="middle" fill="#ef4444" font-family="sans-serif" font-size="12" font-weight="bold">Day 10</text>
  <text x="370" y="275" text-anchor="middle" fill="#ef4444" font-family="sans-serif" font-size="12" font-weight="bold">Day 30</text>
''')

# Q43: Vertical axis scaling compressing clustered column differences
plots_svg["g9_t159_q43.svg"] = wrap_svg('''
  <line x1="70" y1="40" x2="70" y2="250" stroke="#475569" stroke-width="2"/>
  <line x1="70" y1="250" x2="430" y2="250" stroke="#475569" stroke-width="2"/>

  <!-- Y-axis scale 0 to 5000 -->
  <text x="60" y="255" text-anchor="end" fill="#94a3b8" font-family="sans-serif" font-size="11">0</text>
  <text x="60" y="150" text-anchor="end" fill="#94a3b8" font-family="sans-serif" font-size="11">2500</text>
  <text x="60" y="50" text-anchor="end" fill="#94a3b8" font-family="sans-serif" font-size="11">5000</text>

  <!-- Company X (500) -> height 20px -->
  <rect x="140" y="230" width="60" height="20" fill="#38bdf8" rx="2"/>
  <text x="170" y="280" text-anchor="middle" fill="#e2e8f0" font-family="sans-serif" font-size="12">Company X (500)</text>

  <!-- Company Y (520) -> height 20.8px -->
  <rect x="270" y="229" width="60" height="21" fill="#ec4899" rx="2"/>
  <text x="300" y="280" text-anchor="middle" fill="#e2e8f0" font-family="sans-serif" font-size="12">Company Y (520)</text>

  <text x="250" y="315" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="11">Excessive Y-scale (5000) makes 500 vs 520 look identical</text>
''')

# Q46: Area-based human silhouette scaling
plots_svg["g9_t159_q46.svg"] = wrap_svg('''
  <!-- Silhouette 1 (Height H) -->
  <g transform="translate(100, 100)">
    <circle cx="30" cy="20" r="12" fill="#38bdf8"/>
    <path d="M 15 40 L 45 40 L 40 100 L 20 100 Z" fill="#38bdf8"/>
    <text x="30" y="130" text-anchor="middle" fill="#e2e8f0" font-family="sans-serif" font-size="12">Height H</text>
    <text x="30" y="150" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="11">Area = A</text>
  </g>

  <!-- Silhouette 2 (Height 2H -> Area 4A) -->
  <g transform="translate(280, 40)">
    <circle cx="60" cy="40" r="24" fill="#f59e0b"/>
    <path d="M 30 80 L 90 80 L 80 200 L 40 200 Z" fill="#f59e0b"/>
    <text x="60" y="230" text-anchor="middle" fill="#e2e8f0" font-family="sans-serif" font-size="12">Height 2H</text>
    <text x="60" y="250" text-anchor="middle" fill="#f59e0b" font-family="sans-serif" font-size="11" font-weight="bold">Visual Area = 4A</text>
  </g>
''')

# Q47: Pass rate trend: 88%-91% axis vs 0%-100% axis
plots_svg["g9_t159_q47.svg"] = wrap_svg('''
  <!-- Graph 1: 88% - 91% Axis -->
  <g transform="translate(30, 40)">
    <rect x="0" y="0" width="200" height="230" fill="#1e293b" rx="6"/>
    <line x1="30" y1="20" x2="30" y2="190" stroke="#64748b" stroke-width="1.5"/>
    <line x1="30" y1="190" x2="180" y2="190" stroke="#64748b" stroke-width="1.5"/>
    <text x="25" y="195" text-anchor="end" fill="#ec4899" font-family="sans-serif" font-size="10">88%</text>
    <text x="25" y="25" text-anchor="end" fill="#ec4899" font-family="sans-serif" font-size="10">91%</text>
    <path d="M 40 170 L 160 30" fill="none" stroke="#ef4444" stroke-width="3"/>
    <text x="105" y="215" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="11">88% to 91% Axis (Steep)</text>
  </g>

  <!-- Graph 2: 0% - 100% Axis -->
  <g transform="translate(260, 40)">
    <rect x="0" y="0" width="200" height="230" fill="#1e293b" rx="6"/>
    <line x1="30" y1="20" x2="30" y2="190" stroke="#64748b" stroke-width="1.5"/>
    <line x1="30" y1="190" x2="180" y2="190" stroke="#64748b" stroke-width="1.5"/>
    <text x="25" y="195" text-anchor="end" fill="#10b981" font-family="sans-serif" font-size="10">0%</text>
    <text x="25" y="25" text-anchor="end" fill="#10b981" font-family="sans-serif" font-size="10">100%</text>
    <path d="M 40 45 L 160 40" fill="none" stroke="#10b981" stroke-width="3"/>
    <text x="105" y="215" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="11">0% to 100% Axis (Flat)</text>
  </g>
''')

# Q49: Canvas aspect ratio distortion
plots_svg["g9_t159_q49.svg"] = wrap_svg('''
  <!-- Canvas 1: Tall Narrow Aspect Ratio -->
  <g transform="translate(40, 40)">
    <rect x="0" y="0" width="140" height="240" fill="#1e293b" rx="6" stroke="#38bdf8" stroke-width="1.5"/>
    <path d="M 20 210 L 120 30" fill="none" stroke="#38bdf8" stroke-width="3"/>
    <text x="70" y="260" text-anchor="middle" fill="#38bdf8" font-family="sans-serif" font-size="11">Tall Narrow Canvas (Steep)</text>
  </g>

  <!-- Canvas 2: Wide Flat Aspect Ratio -->
  <g transform="translate(240, 90)">
    <rect x="0" y="0" width="220" height="140" fill="#1e293b" rx="6" stroke="#10b981" stroke-width="1.5"/>
    <path d="M 20 120 L 200 30" fill="none" stroke="#10b981" stroke-width="3"/>
    <text x="110" y="160" text-anchor="middle" fill="#10b981" font-family="sans-serif" font-size="11">Wide Flat Canvas (Gentle)</text>
  </g>
''')

# Write SVG files to both target directories
saved_count = 0
for filename, svg_content in plots_svg.items():
    path1 = os.path.join(PUBLIC_DIR, filename)
    path2 = os.path.join(QBANK_PUBLIC_DIR, filename)
    
    with open(path1, "w", encoding="utf-8") as f:
        f.write(svg_content)
    with open(path2, "w", encoding="utf-8") as f:
        f.write(svg_content)
    saved_count += 1

print(f"Generated {saved_count} SVG plots for T159 in {PUBLIC_DIR} and {QBANK_PUBLIC_DIR}")
