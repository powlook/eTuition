import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesDir = path.join(__dirname, '..', 'public', 'images');

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// 1. Q5: Similar Triangles & Parallel Lines Q5
// Triangle ABC similar to AQP, BC // PQ. BC=4, AC=2, AP=5, AQ=7.5
const q5Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 280" width="400" height="280">
  <rect width="100%" height="100%" fill="#0f172a" rx="12" />
  <!-- Title Badge -->
  <rect x="16" y="12" width="368" height="28" rx="6" fill="rgba(56, 189, 248, 0.12)" stroke="rgba(56, 189, 248, 0.3)" />
  <text x="200" y="31" text-anchor="middle" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#38bdf8">
    Q5: Similar Triangles &amp; Parallel Lines (BC // PQ)
  </text>

  <!-- Triangle AQP (outer) and ABC (inner/inverted at vertex A) -->
  <!-- Vertex P: (180, 50), Vertex Q: (350, 240), Vertex A: (150, 140) -->
  <!-- Vertex B: (80, 120), Vertex C: (120, 180) -->
  
  <!-- Lines -->
  <!-- P -> A -> C line -->
  <line x1="180" y1="50" x2="110" y2="200" stroke="#94a3b8" stroke-width="2" />
  <!-- Q -> A -> B line -->
  <line x1="350" y1="240" x2="70" y2="100" stroke="#94a3b8" stroke-width="2" />
  
  <!-- Parallel Lines BC and PQ -->
  <line x1="70" y1="100" x2="110" y2="200" stroke="#38bdf8" stroke-width="3" />
  <line x1="180" y1="50" x2="350" y2="240" stroke="#38bdf8" stroke-width="3" />
  
  <!-- Parallel arrows -->
  <path d="M 85 140 L 92 147 M 87 145 L 94 152" stroke="#38bdf8" stroke-width="2" fill="none" />
  <path d="M 260 140 L 267 147 M 262 145 L 269 152" stroke="#38bdf8" stroke-width="2" fill="none" />

  <!-- Vertices Dots and Labels -->
  <circle cx="150" cy="140" r="4" fill="#f59e0b" />
  <text x="160" y="145" font-family="sans-serif" font-size="14" font-weight="bold" fill="#f59e0b">A</text>

  <circle cx="70" cy="100" r="4" fill="#38bdf8" />
  <text x="50" y="100" font-family="sans-serif" font-size="14" font-weight="bold" fill="#38bdf8">B</text>

  <circle cx="110" cy="200" r="4" fill="#38bdf8" />
  <text x="100" y="220" font-family="sans-serif" font-size="14" font-weight="bold" fill="#38bdf8">C</text>

  <circle cx="180" cy="50" r="4" fill="#38bdf8" />
  <text x="180" y="40" font-family="sans-serif" font-size="14" font-weight="bold" fill="#38bdf8">P</text>

  <circle cx="350" cy="240" r="4" fill="#38bdf8" />
  <text x="360" y="250" font-family="sans-serif" font-size="14" font-weight="bold" fill="#38bdf8">Q</text>

  <!-- Dimension Labels -->
  <text x="65" y="155" font-family="sans-serif" font-size="12" fill="#e2e8f0">4 cm</text>
  <text x="140" y="180" font-family="sans-serif" font-size="12" fill="#e2e8f0">2 cm</text>
  <text x="145" y="90" font-family="sans-serif" font-size="12" fill="#e2e8f0">5 cm</text>
  <text x="240" y="200" font-family="sans-serif" font-size="12" fill="#e2e8f0">7.5 cm</text>
</svg>`;
fs.writeFileSync(path.join(imagesDir, 'q5_similar_triangles.svg'), q5Svg);

// 2. Q6: Enlargement Rectangles P and Q
const q6Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 220" width="420" height="220">
  <rect width="100%" height="100%" fill="#0f172a" rx="12" />
  <rect x="16" y="12" width="388" height="28" rx="6" fill="rgba(56, 189, 248, 0.12)" stroke="rgba(56, 189, 248, 0.3)" />
  <text x="210" y="31" text-anchor="middle" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#38bdf8">
    Q6: Rectangle Enlargement (P mapped to Q)
  </text>

  <!-- Rectangle P (Large) -->
  <rect x="30" y="70" width="200" height="100" fill="rgba(56, 189, 248, 0.08)" stroke="#38bdf8" stroke-width="2.5" />
  <text x="130" y="125" text-anchor="middle" font-family="sans-serif" font-size="18" font-weight="bold" fill="#38bdf8">P</text>
  <text x="130" y="190" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#e2e8f0">12.6 cm</text>
  <text x="15" y="125" font-family="sans-serif" font-size="13" fill="#e2e8f0">h cm</text>

  <!-- Rectangle Q (Small) -->
  <rect x="280" y="90" width="100" height="60" fill="rgba(245, 158, 11, 0.08)" stroke="#f59e0b" stroke-width="2.5" />
  <text x="330" y="125" text-anchor="middle" font-family="sans-serif" font-size="18" font-weight="bold" fill="#f59e0b">Q</text>
  <text x="330" y="170" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#e2e8f0">4.2 cm</text>
</svg>`;
fs.writeFileSync(path.join(imagesDir, 'q6_rectangles_enlargement.svg'), q6Svg);

// 3. Q7: Congruent Triangles ABC and EDC
const q7Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 280" width="420" height="280">
  <rect width="100%" height="100%" fill="#0f172a" rx="12" />
  <rect x="16" y="12" width="388" height="28" rx="6" fill="rgba(56, 189, 248, 0.12)" stroke="rgba(56, 189, 248, 0.3)" />
  <text x="210" y="31" text-anchor="middle" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#38bdf8">
    Q7: Congruent Triangles (ΔABC ≅ ΔEDC)
  </text>

  <!-- Triangle ABC (left right-triangle) & Triangle EDC (right right-triangle) sharing baseline AC-CD -->
  <!-- A: (40, 220), C: (210, 220), B: (210, 90) -->
  <!-- E: (210, 50), B is on EC: (210, 90), D: (380, 220) -->

  <!-- Baseline A -> C -> D -->
  <line x1="40" y1="220" x2="380" y2="220" stroke="#94a3b8" stroke-width="2" />
  <!-- Vertical line E -> B -> C -->
  <line x1="210" y1="50" x2="210" y2="220" stroke="#94a3b8" stroke-width="2" />

  <!-- Triangle ABC sides -->
  <line x1="40" y1="220" x2="210" y2="90" stroke="#38bdf8" stroke-width="3" />
  <!-- Triangle EDC sides -->
  <line x1="210" y1="50" x2="380" y2="220" stroke="#f59e0b" stroke-width="3" />

  <!-- Right angle mark at C -->
  <rect x="198" y="208" width="12" height="12" fill="none" stroke="#94a3b8" stroke-width="1.5" />
  <rect x="210" y="208" width="12" height="12" fill="none" stroke="#94a3b8" stroke-width="1.5" />

  <!-- Vertices -->
  <circle cx="40" cy="220" r="4" fill="#38bdf8" />
  <text x="25" y="235" font-family="sans-serif" font-size="14" font-weight="bold" fill="#38bdf8">A</text>

  <circle cx="210" cy="90" r="4" fill="#38bdf8" />
  <text x="220" y="95" font-family="sans-serif" font-size="14" font-weight="bold" fill="#38bdf8">B</text>

  <circle cx="210" cy="220" r="4" fill="#94a3b8" />
  <text x="210" y="245" font-family="sans-serif" font-size="14" font-weight="bold" fill="#94a3b8">C</text>

  <circle cx="210" cy="50" r="4" fill="#f59e0b" />
  <text x="210" y="40" font-family="sans-serif" font-size="14" font-weight="bold" fill="#f59e0b">E</text>

  <circle cx="380" cy="220" r="4" fill="#f59e0b" />
  <text x="390" y="235" font-family="sans-serif" font-size="14" font-weight="bold" fill="#f59e0b">D</text>

  <!-- Arc for 37 deg at A -->
  <path d="M 70 220 A 30 30 0 0 0 62 203" fill="none" stroke="#38bdf8" stroke-width="2" />
  <text x="75" y="210" font-family="sans-serif" font-size="12" fill="#38bdf8">37°</text>

  <!-- Arc for x deg at D -->
  <path d="M 350 220 A 30 30 0 0 1 358 203" fill="none" stroke="#f59e0b" stroke-width="2" />
  <text x="340" y="210" font-family="sans-serif" font-size="12" fill="#f59e0b">x°</text>

  <!-- Dimensions -->
  <text x="115" y="145" font-family="sans-serif" font-size="13" font-weight="bold" fill="#e2e8f0">10 cm</text>
  <text x="305" y="130" font-family="sans-serif" font-size="13" font-weight="bold" fill="#e2e8f0">10 cm</text>
  <text x="115" y="240" font-family="sans-serif" font-size="13" fill="#e2e8f0">8 cm</text>
  <text x="285" y="240" font-family="sans-serif" font-size="13" fill="#e2e8f0">y cm</text>
  <text x="190" y="70" font-family="sans-serif" font-size="12" fill="#e2e8f0">2 cm</text>
</svg>`;
fs.writeFileSync(path.join(imagesDir, 'q7_congruent_triangles.svg'), q7Svg);

// 4. Q14: Intersecting Similar Triangles PQT and SRT
const q14Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260" width="400" height="260">
  <rect width="100%" height="100%" fill="#0f172a" rx="12" />
  <rect x="16" y="12" width="368" height="28" rx="6" fill="rgba(56, 189, 248, 0.12)" stroke="rgba(56, 189, 248, 0.3)" />
  <text x="200" y="31" text-anchor="middle" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#38bdf8">
    Q14: Intersecting Similar Triangles (ΔPQT ~ ΔSRT)
  </text>

  <!-- Top bar PQ: (150, 60) to (250, 60) -->
  <!-- Bottom bar RS: (80, 210) to (320, 210) -->
  <!-- Intersection T: (200, 120) -->
  <line x1="150" y1="60" x2="250" y2="60" stroke="#38bdf8" stroke-width="3" />
  <line x1="80" y1="210" x2="320" y2="210" stroke="#f59e0b" stroke-width="3" />
  <line x1="150" y1="60" x2="320" y2="210" stroke="#94a3b8" stroke-width="2" />
  <line x1="250" y1="60" x2="80" y2="210" stroke="#94a3b8" stroke-width="2" />

  <circle cx="150" cy="60" r="4" fill="#38bdf8" />
  <text x="135" y="65" font-family="sans-serif" font-size="14" font-weight="bold" fill="#38bdf8">P</text>

  <circle cx="250" cy="60" r="4" fill="#38bdf8" />
  <text x="260" y="65" font-family="sans-serif" font-size="14" font-weight="bold" fill="#38bdf8">Q</text>

  <circle cx="200" cy="120" r="4" fill="#e2e8f0" />
  <text x="210" y="125" font-family="sans-serif" font-size="14" font-weight="bold" fill="#e2e8f0">T</text>

  <circle cx="80" cy="210" r="4" fill="#f59e0b" />
  <text x="65" y="215" font-family="sans-serif" font-size="14" font-weight="bold" fill="#f59e0b">R</text>

  <circle cx="320" cy="210" r="4" fill="#f59e0b" />
  <text x="330" y="215" font-family="sans-serif" font-size="14" font-weight="bold" fill="#f59e0b">S</text>

  <text x="170" y="180" font-family="sans-serif" font-size="13" fill="#e2e8f0">RQ = 15 cm</text>
  <text x="240" y="140" font-family="sans-serif" font-size="12" fill="#38bdf8">PT / ST = 2/3</text>
</svg>`;
fs.writeFileSync(path.join(imagesDir, 'q14_intersecting_similar_triangles.svg'), q14Svg);

// 5. Q15: Congruent Triangles PQR and STR
const q15Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 280" width="420" height="280">
  <rect width="100%" height="100%" fill="#0f172a" rx="12" />
  <rect x="16" y="12" width="388" height="28" rx="6" fill="rgba(56, 189, 248, 0.12)" stroke="rgba(56, 189, 248, 0.3)" />
  <text x="210" y="31" text-anchor="middle" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#38bdf8">
    Q15: Congruent Triangles (ΔPQR ≡ ΔSTR)
  </text>

  <!-- P: (100, 70), R: (180, 140), Q: (40, 230) -->
  <!-- S: (260, 90), T: (360, 210) -->
  <polygon points="100,70 180,140 40,230" fill="rgba(56, 189, 248, 0.08)" stroke="#38bdf8" stroke-width="2.5" />
  <polygon points="260,90 180,140 360,210" fill="rgba(245, 158, 11, 0.08)" stroke="#f59e0b" stroke-width="2.5" />

  <circle cx="100" cy="70" r="4" fill="#38bdf8" />
  <text x="95" y="55" font-family="sans-serif" font-size="14" font-weight="bold" fill="#38bdf8">P</text>

  <circle cx="180" cy="140" r="4" fill="#e2e8f0" />
  <text x="180" y="160" font-family="sans-serif" font-size="14" font-weight="bold" fill="#e2e8f0">R</text>

  <circle cx="40" cy="230" r="4" fill="#38bdf8" />
  <text x="25" y="240" font-family="sans-serif" font-size="14" font-weight="bold" fill="#38bdf8">Q</text>

  <circle cx="260" cy="90" r="4" fill="#f59e0b" />
  <text x="260" y="75" font-family="sans-serif" font-size="14" font-weight="bold" fill="#f59e0b">S</text>

  <circle cx="360" cy="210" r="4" fill="#f59e0b" />
  <text x="370" y="220" font-family="sans-serif" font-size="14" font-weight="bold" fill="#f59e0b">T</text>

  <text x="120" y="100" font-family="sans-serif" font-size="12" fill="#e2e8f0">2.4 cm</text>
  <text x="270" y="160" font-family="sans-serif" font-size="12" fill="#e2e8f0">4.5 cm</text>
  <text x="140" y="130" font-family="sans-serif" font-size="12" fill="#e2e8f0">68°</text>
  <text x="250" y="115" font-family="sans-serif" font-size="12" fill="#e2e8f0">76°</text>
</svg>`;
fs.writeFileSync(path.join(imagesDir, 'q15_congruent_triangles.svg'), q15Svg);

// 6. Q16: Three Vertical Poles
const q16Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 280" width="400" height="280">
  <rect width="100%" height="100%" fill="#0f172a" rx="12" />
  <rect x="16" y="12" width="368" height="28" rx="6" fill="rgba(56, 189, 248, 0.12)" stroke="rgba(56, 189, 248, 0.3)" />
  <text x="200" y="31" text-anchor="middle" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#38bdf8">
    Q16: Three Vertical Poles Alignment
  </text>

  <!-- Ground -->
  <line x1="40" y1="230" x2="360" y2="230" stroke="#94a3b8" stroke-width="2" />

  <!-- Tallest pole: x=100, y=60 to 230 (H=17) -->
  <line x1="100" y1="60" x2="100" y2="230" stroke="#38bdf8" stroke-width="4" />

  <!-- Middle pole: x=220, y=150 to 230 (H=8) -->
  <line x1="220" y1="150" x2="220" y2="230" stroke="#38bdf8" stroke-width="4" />

  <!-- Shortest pole: x=300, y=200 to 230 (H=3) -->
  <line x1="300" y1="200" x2="300" y2="230" stroke="#38bdf8" stroke-width="4" />

  <!-- Incline sight line -->
  <line x1="100" y1="60" x2="300" y2="200" stroke="#f59e0b" stroke-dasharray="5,5" stroke-width="2" />

  <!-- Distance labels -->
  <text x="155" y="250" font-family="sans-serif" font-size="13" fill="#e2e8f0">9 m</text>
  <text x="255" y="250" font-family="sans-serif" font-size="13" fill="#e2e8f0">5 m</text>
  <text x="230" y="190" font-family="sans-serif" font-size="12" fill="#38bdf8">8 m</text>
  <text x="310" y="220" font-family="sans-serif" font-size="12" fill="#38bdf8">3 m</text>
</svg>`;
fs.writeFileSync(path.join(imagesDir, 'q16_vertical_poles.svg'), q16Svg);

// 7. Q20: Similar Triangles ABC and DEF
const q20Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 240" width="420" height="240">
  <rect width="100%" height="100%" fill="#0f172a" rx="12" />
  <rect x="16" y="12" width="388" height="28" rx="6" fill="rgba(56, 189, 248, 0.12)" stroke="rgba(56, 189, 248, 0.3)" />
  <text x="210" y="31" text-anchor="middle" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#38bdf8">
    Q20: Similar Triangles (ΔABC ~ ΔDEF)
  </text>

  <!-- Triangle ABC (small): A(40,180), B(90,80), C(160,180) -->
  <polygon points="40,180 90,80 160,180" fill="rgba(56, 189, 248, 0.08)" stroke="#38bdf8" stroke-width="2.5" />
  <text x="30" y="195" font-family="sans-serif" font-size="14" font-weight="bold" fill="#38bdf8">A</text>
  <text x="90" y="65" font-family="sans-serif" font-size="14" font-weight="bold" fill="#38bdf8">B</text>
  <text x="170" y="195" font-family="sans-serif" font-size="14" font-weight="bold" fill="#38bdf8">C</text>
  <text x="50" y="125" font-family="sans-serif" font-size="12" fill="#e2e8f0">3.8</text>
  <text x="135" y="125" font-family="sans-serif" font-size="12" fill="#e2e8f0">4.8</text>
  <text x="100" y="200" font-family="sans-serif" font-size="12" fill="#e2e8f0">6</text>

  <!-- Triangle DEF (large): D(240,50), E(380,180), F(240,180) -->
  <polygon points="240,50 380,180 240,180" fill="rgba(245, 158, 11, 0.08)" stroke="#f59e0b" stroke-width="2.5" />
  <text x="230" y="45" font-family="sans-serif" font-size="14" font-weight="bold" fill="#f59e0b">D</text>
  <text x="390" y="195" font-family="sans-serif" font-size="14" font-weight="bold" fill="#f59e0b">E</text>
  <text x="230" y="195" font-family="sans-serif" font-size="14" font-weight="bold" fill="#f59e0b">F</text>
  <text x="220" y="115" font-family="sans-serif" font-size="12" fill="#e2e8f0">9</text>
  <text x="320" y="115" font-family="sans-serif" font-size="12" fill="#f59e0b">x</text>
</svg>`;
fs.writeFileSync(path.join(imagesDir, 'q20_similar_triangles_abc_def.svg'), q20Svg);

// 8. Q1 Trigonometry (a): Right Triangle 3, 8
const q1aTrigSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 220" width="360" height="220">
  <rect width="100%" height="100%" fill="#0f172a" rx="12" />
  <rect x="16" y="12" width="328" height="28" rx="6" fill="rgba(56, 189, 248, 0.12)" stroke="rgba(56, 189, 248, 0.3)" />
  <text x="180" y="31" text-anchor="middle" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#38bdf8">
    Trig Q1(a): Right Triangle (3 cm, 8 cm)
  </text>

  <!-- Right triangle: (50, 170) to (290, 170) to (290, 80) -->
  <polygon points="50,170 290,170 290,80" fill="rgba(56, 189, 248, 0.08)" stroke="#38bdf8" stroke-width="2.5" />
  <rect x="278" y="158" width="12" height="12" fill="none" stroke="#94a3b8" stroke-width="1.5" />

  <text x="170" y="190" font-family="sans-serif" font-size="13" fill="#e2e8f0">8 cm</text>
  <text x="300" y="130" font-family="sans-serif" font-size="13" fill="#e2e8f0">3 cm</text>

  <!-- Arc x deg at top vertex -->
  <path d="M 290 105 A 25 25 0 0 0 270 93" fill="none" stroke="#f59e0b" stroke-width="2" />
  <text x="260" y="115" font-family="sans-serif" font-size="13" font-weight="bold" fill="#f59e0b">x°</text>
</svg>`;
fs.writeFileSync(path.join(imagesDir, 'q1a_right_triangle.svg'), q1aTrigSvg);

// 9. Q2 Trigonometry: Right Triangle Leg Difference
const q2TrigSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 240" width="380" height="240">
  <rect width="100%" height="100%" fill="#0f172a" rx="12" />
  <rect x="16" y="12" width="348" height="28" rx="6" fill="rgba(56, 189, 248, 0.12)" stroke="rgba(56, 189, 248, 0.3)" />
  <text x="190" y="31" text-anchor="middle" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#38bdf8">
    Trig Q2: Right Triangle PQR &amp; Point S
  </text>

  <!-- Triangle PQR: Q(50, 190), R(280, 190), P(280, 50), S(280, 120) -->
  <polygon points="50,190 280,190 280,50" fill="rgba(56, 189, 248, 0.08)" stroke="#38bdf8" stroke-width="2.5" />
  <line x1="50" y1="190" x2="280" y2="120" stroke="#f59e0b" stroke-dasharray="4,4" stroke-width="2" />
  <rect x="268" y="178" width="12" height="12" fill="none" stroke="#94a3b8" stroke-width="1.5" />

  <circle cx="50" cy="190" r="4" fill="#38bdf8" />
  <text x="35" y="200" font-family="sans-serif" font-size="14" font-weight="bold" fill="#38bdf8">Q</text>

  <circle cx="280" cy="190" r="4" fill="#38bdf8" />
  <text x="290" y="200" font-family="sans-serif" font-size="14" font-weight="bold" fill="#38bdf8">R</text>

  <circle cx="280" cy="50" r="4" fill="#38bdf8" />
  <text x="290" y="55" font-family="sans-serif" font-size="14" font-weight="bold" fill="#38bdf8">P</text>

  <circle cx="280" cy="120" r="4" fill="#f59e0b" />
  <text x="290" y="125" font-family="sans-serif" font-size="14" font-weight="bold" fill="#f59e0b">S</text>

  <text x="160" y="210" font-family="sans-serif" font-size="12" fill="#e2e8f0">12 cm</text>
  <text x="150" y="110" font-family="sans-serif" font-size="12" fill="#e2e8f0">15 cm</text>
  <text x="295" y="160" font-family="sans-serif" font-size="12" fill="#e2e8f0">5 cm</text>
</svg>`;
fs.writeFileSync(path.join(imagesDir, 'q2_right_triangle_pqr.svg'), q2TrigSvg);

// 10. Q12 Trigonometry: Hot Air Balloon Elevation
const q12BalloonSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 260" width="420" height="260">
  <rect width="100%" height="100%" fill="#0f172a" rx="12" />
  <rect x="16" y="12" width="388" height="28" rx="6" fill="rgba(56, 189, 248, 0.12)" stroke="rgba(56, 189, 248, 0.3)" />
  <text x="210" y="31" text-anchor="middle" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#38bdf8">
    Trig Q12: Hot Air Balloon Angle of Elevation
  </text>

  <!-- Ground -->
  <line x1="40" y1="220" x2="380" y2="220" stroke="#94a3b8" stroke-width="2" />

  <!-- Person at x=70 (Height 1.67m) -->
  <line x1="70" y1="220" x2="70" y2="190" stroke="#f59e0b" stroke-width="3" />
  <circle cx="70" cy="184" r="6" fill="#f59e0b" />
  <text x="40" y="205" font-family="sans-serif" font-size="11" fill="#f59e0b">1.67 m</text>

  <!-- Horizontal sight line from eye (70, 184) to (340, 184) -->
  <line x1="70" y1="184" x2="340" y2="184" stroke="#94a3b8" stroke-dasharray="4,4" stroke-width="1.5" />

  <!-- Balloon at (340, 50) -->
  <line x1="70" y1="184" x2="340" y2="50" stroke="#38bdf8" stroke-width="2.5" />
  <ellipse cx="340" cy="50" rx="18" ry="24" fill="#ef4444" />
  <polygon points="334,74 346,74 340,80" fill="#f59e0b" />

  <!-- Arc 68 deg elevation -->
  <path d="M 100 184 A 30 30 0 0 0 92 170" fill="none" stroke="#38bdf8" stroke-width="2" />
  <text x="105" y="175" font-family="sans-serif" font-size="12" font-weight="bold" fill="#38bdf8">68°</text>

  <text x="200" y="240" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#e2e8f0">500 m</text>
</svg>`;
fs.writeFileSync(path.join(imagesDir, 'q12_balloon_elevation.svg'), q12BalloonSvg);

console.log('All custom geometry and trigonometry SVG diagrams created!');
