import os

PUBLIC_DIR = "public/images"
QBANK_PUBLIC_DIR = "QBank/public/images"

os.makedirs(PUBLIC_DIR, exist_ok=True)
os.makedirs(QBANK_PUBLIC_DIR, exist_ok=True)

plots_svg = {}

def wrap_svg(content, width=500, height=340):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" width="{width}" height="{height}">
  <rect width="100%" height="100%" fill="#0f172a" rx="12" />
{content}
</svg>'''

# Q6: 6-sided die faces 1 to 6
plots_svg["g9_t160_q6.svg"] = wrap_svg('''
  <g transform="translate(40, 50)">
    <!-- Die Face 1 -->
    <rect x="20" y="20" width="60" height="60" fill="#1e293b" stroke="#38bdf8" stroke-width="2" rx="8"/>
    <circle cx="50" cy="50" r="5" fill="#38bdf8"/>
    <text x="50" y="100" text-anchor="middle" fill="#e2e8f0" font-family="sans-serif" font-size="12">1</text>

    <!-- Die Face 2 -->
    <rect x="100" y="20" width="60" height="60" fill="#1e293b" stroke="#38bdf8" stroke-width="2" rx="8"/>
    <circle cx="115" cy="35" r="5" fill="#38bdf8"/>
    <circle cx="145" cy="65" r="5" fill="#38bdf8"/>
    <text x="130" y="100" text-anchor="middle" fill="#e2e8f0" font-family="sans-serif" font-size="12">2 (Even)</text>

    <!-- Die Face 3 -->
    <rect x="180" y="20" width="60" height="60" fill="#1e293b" stroke="#38bdf8" stroke-width="2" rx="8"/>
    <circle cx="195" cy="35" r="5" fill="#38bdf8"/>
    <circle cx="210" cy="50" r="5" fill="#38bdf8"/>
    <circle cx="225" cy="65" r="5" fill="#38bdf8"/>
    <text x="210" y="100" text-anchor="middle" fill="#e2e8f0" font-family="sans-serif" font-size="12">3</text>

    <!-- Die Face 4 -->
    <rect x="260" y="20" width="60" height="60" fill="#1e293b" stroke="#38bdf8" stroke-width="2" rx="8"/>
    <circle cx="275" cy="35" r="5" fill="#38bdf8"/><circle cx="305" cy="35" r="5" fill="#38bdf8"/>
    <circle cx="275" cy="65" r="5" fill="#38bdf8"/><circle cx="305" cy="65" r="5" fill="#38bdf8"/>
    <text x="290" y="100" text-anchor="middle" fill="#e2e8f0" font-family="sans-serif" font-size="12">4 (Even)</text>

    <!-- Die Face 5 -->
    <rect x="340" y="20" width="60" height="60" fill="#1e293b" stroke="#38bdf8" stroke-width="2" rx="8"/>
    <circle cx="355" cy="35" r="5" fill="#38bdf8"/><circle cx="385" cy="35" r="5" fill="#38bdf8"/>
    <circle cx="370" cy="50" r="5" fill="#38bdf8"/>
    <circle cx="355" cy="65" r="5" fill="#38bdf8"/><circle cx="385" cy="65" r="5" fill="#38bdf8"/>
    <text x="370" y="100" text-anchor="middle" fill="#e2e8f0" font-family="sans-serif" font-size="12">5</text>

    <!-- Die Face 6 -->
    <g transform="translate(180, 120)">
      <rect x="0" y="0" width="60" height="60" fill="#1e293b" stroke="#38bdf8" stroke-width="2" rx="8"/>
      <circle cx="15" cy="15" r="5" fill="#38bdf8"/><circle cx="45" cy="15" r="5" fill="#38bdf8"/>
      <circle cx="15" cy="30" r="5" fill="#38bdf8"/><circle cx="45" cy="30" r="5" fill="#38bdf8"/>
      <circle cx="15" cy="45" r="5" fill="#38bdf8"/><circle cx="45" cy="45" r="5" fill="#38bdf8"/>
      <text x="30" y="80" text-anchor="middle" fill="#e2e8f0" font-family="sans-serif" font-size="12">6 (Even)</text>
    </g>
  </g>
  <text x="250" y="315" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="12">Standard Fair Six-Sided Die (Sample Space = {1, 2, 3, 4, 5, 6})</text>
''')

# Q9: Bag with 5 Red, 7 Blue, 8 Green balls
plots_svg["g9_t160_q9.svg"] = wrap_svg('''
  <!-- Bag Container -->
  <g transform="translate(160, 40)">
    <path d="M 30 50 C 30 10, 150 10, 150 50 L 170 200 C 170 240, 10 240, 10 200 Z" fill="#1e293b" stroke="#64748b" stroke-width="3"/>
    
    <!-- Red Balls (5) -->
    <circle cx="50" cy="160" r="14" fill="#ef4444"/><circle cx="80" cy="180" r="14" fill="#ef4444"/>
    <circle cx="110" cy="160" r="14" fill="#ef4444"/><circle cx="140" cy="170" r="14" fill="#ef4444"/>
    <circle cx="65" cy="130" r="14" fill="#ef4444"/>

    <!-- Blue Balls (7) -->
    <circle cx="95" cy="130" r="14" fill="#38bdf8"/><circle cx="125" cy="130" r="14" fill="#38bdf8"/>
    <circle cx="45" cy="100" r="14" fill="#38bdf8"/><circle cx="75" cy="100" r="14" fill="#38bdf8"/>
    <circle cx="105" cy="100" r="14" fill="#38bdf8"/><circle cx="135" cy="100" r="14" fill="#38bdf8"/>
    <circle cx="60" cy="70" r="14" fill="#38bdf8"/>

    <!-- Green Balls (8) -->
    <circle cx="90" cy="70" r="14" fill="#10b981"/><circle cx="120" cy="70" r="14" fill="#10b981"/>
    <circle cx="150" cy="70" r="14" fill="#10b981"/><circle cx="45" cy="190" r="14" fill="#10b981"/>
    <circle cx="130" cy="190" r="14" fill="#10b981"/><circle cx="75" cy="155" r="14" fill="#10b981"/>
    <circle cx="105" cy="155" r="14" fill="#10b981"/><circle cx="150" cy="130" r="14" fill="#10b981"/>
  </g>
  <text x="250" y="315" text-anchor="middle" fill="#e2e8f0" font-family="sans-serif" font-size="13">Bag Contents: 5 Red, 7 Blue, 8 Green (Total = 20)</text>
''')

# Q11: Tree Diagram for 3 Coin Tosses
plots_svg["g9_t160_q11.svg"] = wrap_svg('''
  <g transform="translate(40, 30)">
    <text x="20" y="140" fill="#38bdf8" font-family="sans-serif" font-size="12" font-weight="bold">Start</text>
    
    <!-- Coin 1 -->
    <line x1="60" y1="135" x2="120" y2="70" stroke="#64748b" stroke-width="2"/>
    <line x1="60" y1="135" x2="120" y2="200" stroke="#64748b" stroke-width="2"/>
    <text x="125" y="75" fill="#e2e8f0" font-family="sans-serif" font-size="12" font-weight="bold">H</text>
    <text x="125" y="205" fill="#e2e8f0" font-family="sans-serif" font-size="12" font-weight="bold">T</text>

    <!-- Coin 2 -->
    <line x1="140" y1="70" x2="200" y2="40" stroke="#64748b" stroke-width="1.5"/>
    <line x1="140" y1="70" x2="200" y2="100" stroke="#64748b" stroke-width="1.5"/>
    <line x1="140" y1="200" x2="200" y2="170" stroke="#64748b" stroke-width="1.5"/>
    <line x1="140" y1="200" x2="200" y2="230" stroke="#64748b" stroke-width="1.5"/>

    <!-- Coin 3 -->
    <g transform="translate(220, 0)">
      <text x="0" y="30" fill="#e2e8f0" font-size="11">HHH</text>
      <text x="0" y="55" fill="#e2e8f0" font-size="11">HHT</text>
      <text x="0" y="90" fill="#e2e8f0" font-size="11">HTH</text>
      <text x="0" y="115" fill="#e2e8f0" font-size="11">HTT</text>
      <text x="0" y="160" fill="#e2e8f0" font-size="11">THH</text>
      <text x="0" y="185" fill="#e2e8f0" font-size="11">THT</text>
      <text x="0" y="220" fill="#e2e8f0" font-size="11">TTH</text>
      <text x="0" y="245" fill="#e2e8f0" font-size="11">TTT</text>
    </g>
  </g>
  <text x="250" y="315" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="12">Sample Space Tree Diagram: 3 Coin Tosses (n = 8 outcomes)</text>
''')

# Q12: Two-Dice Sum Outcome Grid
plots_svg["g9_t160_q12.svg"] = wrap_svg('''
  <g transform="translate(80, 40)">
    <!-- Header -->
    <text x="20" y="20" fill="#38bdf8" font-size="12" font-weight="bold">+ | 1  2  3  4  5  6</text>
    <line x1="10" y1="30" x2="300" y2="30" stroke="#475569" stroke-width="1.5"/>
    
    <!-- Grid Rows -->
    <text x="10" y="55" fill="#38bdf8" font-size="12" font-weight="bold">1 |</text>
    <text x="40" y="55" fill="#e2e8f0" font-size="12">2  3  4  5  6 </text><text x="195" y="55" fill="#ec4899" font-size="12" font-weight="bold"> 7</text>

    <text x="10" y="85" fill="#38bdf8" font-size="12" font-weight="bold">2 |</text>
    <text x="40" y="85" fill="#e2e8f0" font-size="12">3  4  5  6 </text><text x="160" y="85" fill="#ec4899" font-size="12" font-weight="bold"> 7</text><text x="195" y="85" fill="#e2e8f0" font-size="12">  8</text>

    <text x="10" y="115" fill="#38bdf8" font-size="12" font-weight="bold">3 |</text>
    <text x="40" y="115" fill="#e2e8f0" font-size="12">4  5  6 </text><text x="125" y="115" fill="#ec4899" font-size="12" font-weight="bold"> 7</text><text x="160" y="115" fill="#e2e8f0" font-size="12">  8  9</text>

    <text x="10" y="145" fill="#38bdf8" font-size="12" font-weight="bold">4 |</text>
    <text x="40" y="145" fill="#e2e8f0" font-size="12">5  6 </text><text x="90" y="145" fill="#ec4899" font-size="12" font-weight="bold"> 7</text><text x="125" y="145" fill="#e2e8f0" font-size="12">  8  9 10</text>

    <text x="10" y="175" fill="#38bdf8" font-size="12" font-weight="bold">5 |</text>
    <text x="40" y="175" fill="#e2e8f0" font-size="12">6 </text><text x="55" y="175" fill="#ec4899" font-size="12" font-weight="bold"> 7</text><text x="90" y="175" fill="#e2e8f0" font-size="12">  8  9 10 11</text>

    <text x="10" y="205" fill="#38bdf8" font-size="12" font-weight="bold">6 |</text>
    <text x="30" y="205" fill="#ec4899" font-size="12" font-weight="bold"> 7</text><text x="55" y="205" fill="#e2e8f0" font-size="12">  8  9 10 11 12</text>
  </g>
  <text x="250" y="315" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="12">Two-Dice Outcome Sum Grid (Total 36 Outcomes)</text>
''')

# Q19: Venn Diagram for Sports Class
plots_svg["g9_t160_q19.svg"] = wrap_svg('''
  <!-- Venn Diagram Circles -->
  <g transform="translate(70, 30)">
    <circle cx="130" cy="130" r="90" fill="rgba(56, 189, 248, 0.35)" stroke="#38bdf8" stroke-width="2.5"/>
    <circle cx="230" cy="130" r="90" fill="rgba(236, 72, 153, 0.35)" stroke="#ec4899" stroke-width="2.5"/>
    
    <text x="90" y="135" text-anchor="middle" fill="#ffffff" font-size="16" font-weight="bold">14</text>
    <text x="90" y="155" text-anchor="middle" fill="#38bdf8" font-size="11">Basketball Only</text>

    <text x="180" y="135" text-anchor="middle" fill="#ffffff" font-size="16" font-weight="bold">10</text>
    <text x="180" y="155" text-anchor="middle" fill="#f59e0b" font-size="11">Both</text>

    <text x="270" y="135" text-anchor="middle" fill="#ffffff" font-size="16" font-weight="bold">8</text>
    <text x="270" y="155" text-anchor="middle" fill="#ec4899" font-size="11">Volleyball Only</text>

    <rect x="0" y="0" width="360" height="250" fill="none" stroke="#64748b" stroke-width="2" rx="8"/>
    <text x="330" y="235" text-anchor="middle" fill="#94a3b8" font-size="12">8 Neither</text>
  </g>
  <text x="250" y="315" text-anchor="middle" fill="#e2e8f0" font-family="sans-serif" font-size="12">Class Sports Venn Diagram (Total Students = 40)</text>
''')

# Q24: Bag with 4 Red and 6 Blue Marbles
plots_svg["g9_t160_q24.svg"] = wrap_svg('''
  <g transform="translate(170, 40)">
    <path d="M 30 50 C 30 10, 130 10, 130 50 L 150 200 C 150 240, 10 240, 10 200 Z" fill="#1e293b" stroke="#64748b" stroke-width="3"/>
    
    <!-- Red Marbles (4) -->
    <circle cx="45" cy="180" r="16" fill="#ef4444"/>
    <circle cx="80" cy="180" r="16" fill="#ef4444"/>
    <circle cx="115" cy="180" r="16" fill="#ef4444"/>
    <circle cx="65" cy="140" r="16" fill="#ef4444"/>

    <!-- Blue Marbles (6) -->
    <circle cx="100" cy="140" r="16" fill="#38bdf8"/>
    <circle cx="45" cy="100" r="16" fill="#38bdf8"/>
    <circle cx="80" cy="100" r="16" fill="#38bdf8"/>
    <circle cx="115" cy="100" r="16" fill="#38bdf8"/>
    <circle cx="65" cy="65" r="16" fill="#38bdf8"/>
    <circle cx="100" cy="65" r="16" fill="#38bdf8"/>
  </g>
  <text x="250" y="315" text-anchor="middle" fill="#e2e8f0" font-family="sans-serif" font-size="13">Bag of Marbles: 4 Red, 6 Blue (Total = 10)</text>
''')

# Q28: 8-Sector Spinner
plots_svg["g9_t160_q28.svg"] = wrap_svg('''
  <g transform="translate(140, 30)">
    <circle cx="110" cy="110" r="105" fill="#1e293b" stroke="#475569" stroke-width="3"/>
    
    <!-- 8 Equal Sectors -->
    <path d="M 110 110 L 110 5 A 105 105 0 0 1 184 36 Z" fill="#38bdf8"/>
    <path d="M 110 110 L 184 36 A 105 105 0 0 1 215 110 Z" fill="#818cf8"/>
    <path d="M 110 110 L 215 110 A 105 105 0 0 1 184 184 Z" fill="#ec4899"/>
    <path d="M 110 110 L 184 184 A 105 105 0 0 1 110 215 Z" fill="#f59e0b"/>
    <path d="M 110 110 L 110 215 A 105 105 0 0 1 36 184 Z" fill="#10b981"/>
    <path d="M 110 110 L 36 184 A 105 105 0 0 1 5 110 Z" fill="#06b6d4"/>
    <path d="M 110 110 L 5 110 A 105 105 0 0 1 36 36 Z" fill="#a855f7"/>
    <path d="M 110 110 L 36 36 A 105 105 0 0 1 110 5 Z" fill="#f43f5e"/>

    <!-- Numbers 1 to 8 -->
    <text x="140" y="55" fill="#ffffff" font-size="16" font-weight="bold">1</text>
    <text x="175" y="90" fill="#ffffff" font-size="16" font-weight="bold">2</text>
    <text x="175" y="145" fill="#ffffff" font-size="16" font-weight="bold">3</text>
    <text x="140" y="180" fill="#ffffff" font-size="16" font-weight="bold">4</text>
    <text x="80" y="180" fill="#ffffff" font-size="16" font-weight="bold">5</text>
    <text x="45" y="145" fill="#ffffff" font-size="16" font-weight="bold">6</text>
    <text x="45" y="90" fill="#ffffff" font-size="16" font-weight="bold">7</text>
    <text x="80" y="55" fill="#ffffff" font-size="16" font-weight="bold">8</text>

    <!-- Pointer -->
    <polygon points="110,110 100,25 120,25" fill="#ffffff" stroke="#000000" stroke-width="1.5"/>
    <circle cx="110" cy="110" r="8" fill="#ffffff"/>
  </g>
  <text x="250" y="315" text-anchor="middle" fill="#e2e8f0" font-family="sans-serif" font-size="12">8-Sector Spinner Labeled 1 to 8</text>
''')

# Q32: Medical Conditions Venn Diagram
plots_svg["g9_t160_q32.svg"] = wrap_svg('''
  <g transform="translate(70, 30)">
    <circle cx="130" cy="130" r="90" fill="rgba(56, 189, 248, 0.35)" stroke="#38bdf8" stroke-width="2.5"/>
    <circle cx="230" cy="130" r="90" fill="rgba(236, 72, 153, 0.35)" stroke="#ec4899" stroke-width="2.5"/>
    
    <text x="90" y="135" text-anchor="middle" fill="#ffffff" font-size="16" font-weight="bold">35%</text>
    <text x="90" y="155" text-anchor="middle" fill="#38bdf8" font-size="11">Condition A Only</text>

    <text x="180" y="135" text-anchor="middle" fill="#ffffff" font-size="16" font-weight="bold">25%</text>
    <text x="180" y="155" text-anchor="middle" fill="#f59e0b" font-size="11">Both</text>

    <text x="270" y="135" text-anchor="middle" fill="#ffffff" font-size="16" font-weight="bold">15%</text>
    <text x="270" y="155" text-anchor="middle" fill="#ec4899" font-size="11">Condition B Only</text>

    <rect x="0" y="0" width="360" height="250" fill="none" stroke="#64748b" stroke-width="2" rx="8"/>
    <text x="310" y="235" text-anchor="middle" fill="#94a3b8" font-size="12">25% Neither</text>
  </g>
  <text x="250" y="315" text-anchor="middle" fill="#e2e8f0" font-family="sans-serif" font-size="12">Medical Clinic Venn Diagram (A = 60%, B = 40%, Both = 25%)</text>
''')

# Q33: Tree Diagram for 3 Children Gender Outcomes
plots_svg["g9_t160_q33.svg"] = wrap_svg('''
  <g transform="translate(40, 30)">
    <text x="20" y="140" fill="#38bdf8" font-family="sans-serif" font-size="12" font-weight="bold">Parents</text>
    
    <!-- Child 1 -->
    <line x1="70" y1="135" x2="130" y2="70" stroke="#64748b" stroke-width="2"/>
    <line x1="70" y1="135" x2="130" y2="200" stroke="#64748b" stroke-width="2"/>
    <text x="135" y="75" fill="#ec4899" font-family="sans-serif" font-size="12" font-weight="bold">G</text>
    <text x="135" y="205" fill="#38bdf8" font-family="sans-serif" font-size="12" font-weight="bold">B</text>

    <!-- Child 2 & 3 Outcomes -->
    <g transform="translate(210, 0)">
      <text x="0" y="30" fill="#e2e8f0" font-size="11">GGG</text>
      <text x="0" y="55" fill="#f59e0b" font-size="11" font-weight="bold">GGB (2G, 1B)</text>
      <text x="0" y="90" fill="#f59e0b" font-size="11" font-weight="bold">GBG (2G, 1B)</text>
      <text x="0" y="115" fill="#e2e8f0" font-size="11">GBB</text>
      <text x="0" y="160" fill="#f59e0b" font-size="11" font-weight="bold">BGG (2G, 1B)</text>
      <text x="0" y="185" fill="#e2e8f0" font-size="11">BGB</text>
      <text x="0" y="220" fill="#e2e8f0" font-size="11">BBG</text>
      <text x="0" y="245" fill="#e2e8f0" font-size="11">BBB</text>
    </g>
  </g>
  <text x="250" y="315" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="12">Tree Diagram for 3 Children Gender Outcomes (8 Outcomes)</text>
''')

# Q40: Two-Way Contingency Table Chart
plots_svg["g9_t160_q40.svg"] = wrap_svg('''
  <g transform="translate(80, 50)">
    <!-- Header -->
    <rect x="0" y="0" width="340" height="180" fill="#1e293b" stroke="#475569" stroke-width="2" rx="6"/>
    
    <line x1="0" y1="45" x2="340" y2="45" stroke="#475569" stroke-width="1.5"/>
    <line x1="0" y1="90" x2="340" y2="90" stroke="#475569" stroke-width="1.5"/>
    <line x1="0" y1="135" x2="340" y2="135" stroke="#475569" stroke-width="1.5"/>

    <line x1="100" y1="0" x2="100" y2="180" stroke="#475569" stroke-width="1.5"/>
    <line x1="180" y1="0" x2="180" y2="180" stroke="#475569" stroke-width="1.5"/>
    <line x1="260" y1="0" x2="260" y2="180" stroke="#475569" stroke-width="1.5"/>

    <text x="50" y="28" text-anchor="middle" fill="#38bdf8" font-size="12" font-weight="bold">Group</text>
    <text x="140" y="28" text-anchor="middle" fill="#38bdf8" font-size="12" font-weight="bold">Product A</text>
    <text x="220" y="28" text-anchor="middle" fill="#38bdf8" font-size="12" font-weight="bold">Product B</text>
    <text x="300" y="28" text-anchor="middle" fill="#38bdf8" font-size="12" font-weight="bold">Total</text>

    <text x="50" y="72" text-anchor="middle" fill="#e2e8f0" font-size="12">Men</text>
    <text x="140" y="72" text-anchor="middle" fill="#e2e8f0" font-size="12">20</text>
    <text x="220" y="72" text-anchor="middle" fill="#e2e8f0" font-size="12">30</text>
    <text x="300" y="72" text-anchor="middle" fill="#e2e8f0" font-size="12" font-weight="bold">50</text>

    <text x="50" y="117" text-anchor="middle" fill="#e2e8f0" font-size="12">Women</text>
    <text x="140" y="117" text-anchor="middle" fill="#ec4899" font-size="12" font-weight="bold">25</text>
    <text x="220" y="117" text-anchor="middle" fill="#e2e8f0" font-size="12">25</text>
    <text x="300" y="117" text-anchor="middle" fill="#ec4899" font-size="12" font-weight="bold">50</text>

    <text x="50" y="162" text-anchor="middle" fill="#38bdf8" font-size="12" font-weight="bold">Total</text>
    <text x="140" y="162" text-anchor="middle" fill="#38bdf8" font-size="12" font-weight="bold">45</text>
    <text x="220" y="162" text-anchor="middle" fill="#38bdf8" font-size="12" font-weight="bold">55</text>
    <text x="300" y="162" text-anchor="middle" fill="#38bdf8" font-size="12" font-weight="bold">100</text>
  </g>
  <text x="250" y="315" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="12">Two-Way Consumer Survey Contingency Table (Total = 100)</text>
''')

# Q45: Geometric Probability Target (Square with Inscribed Circle)
plots_svg["g9_t160_q45.svg"] = wrap_svg('''
  <g transform="translate(140, 30)">
    <!-- 20cm x 20cm Square -->
    <rect x="10" y="10" width="200" height="200" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5" rx="4"/>
    <text x="110" y="0" text-anchor="middle" fill="#38bdf8" font-size="12">Side = 20 cm</text>

    <!-- Inscribed Circle of radius 10cm -->
    <circle cx="110" cy="110" r="100" fill="rgba(16, 185, 129, 0.3)" stroke="#10b981" stroke-width="2.5"/>
    <line x1="110" y1="110" x2="210" y2="110" stroke="#10b981" stroke-width="1.5" stroke-dasharray="4 4"/>
    <text x="160" y="100" text-anchor="middle" fill="#10b981" font-size="11" font-weight="bold">r = 10 cm</text>
  </g>
  <text x="250" y="315" text-anchor="middle" fill="#e2e8f0" font-family="sans-serif" font-size="12">Geometric Target: 20cm Square Target with Inscribed 10cm Circle</text>
''')

# Write SVG files
saved_count = 0
for filename, svg_content in plots_svg.items():
    path1 = os.path.join(PUBLIC_DIR, filename)
    path2 = os.path.join(QBANK_PUBLIC_DIR, filename)
    with open(path1, "w", encoding="utf-8") as f:
        f.write(svg_content)
    with open(path2, "w", encoding="utf-8") as f:
        f.write(svg_content)
    saved_count += 1

print(f"Generated {saved_count} clean SVG plots for T160 in {PUBLIC_DIR} and {QBANK_PUBLIC_DIR}")
