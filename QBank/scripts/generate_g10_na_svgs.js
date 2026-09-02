import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicImagesDir = path.join(__dirname, '..', 'public', 'images');
const rootImagesDir = path.join(__dirname, '..', 'images');

[publicImagesDir, rootImagesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

export function generateGrade10NaSvg(topicId, qIndex, params = {}) {
  const width = 480;
  const height = 360;
  const subType = qIndex % 10;
  const title = params.title || `Grade 10 Topic ${topicId} Diagram #${qIndex + 1}`;

  let bodySvg = '';

  // ==========================================
  // TOPIC 165: Quadratic Inequalities
  // ==========================================
  if (topicId === 165) {
    if (subType === 0 || subType === 1 || subType === 2) { // Number Line Interval
      bodySvg = `
        <g transform="translate(60, 60)">
          <line x1="20" y1="120" x2="340" y2="120" stroke="#475569" stroke-width="3" />
          <!-- Ticks -->
          <line x1="100" y1="110" x2="100" y2="130" stroke="#94a3b8" stroke-width="2" />
          <line x1="260" y1="110" x2="260" y2="130" stroke="#94a3b8" stroke-width="2" />
          <text x="95" y="155" font-family="sans-serif" font-size="14" fill="#38bdf8" font-weight="bold">-1</text>
          <text x="255" y="155" font-family="sans-serif" font-size="14" fill="#38bdf8" font-weight="bold">6</text>
          <!-- Shaded Solution Ray / Interval -->
          <line x1="20" y1="120" x2="100" y2="120" stroke="#38bdf8" stroke-width="6" />
          <line x1="260" y1="120" x2="340" y2="120" stroke="#38bdf8" stroke-width="6" />
          <circle cx="100" cy="120" r="7" fill="#0f172a" stroke="#38bdf8" stroke-width="3" />
          <circle cx="260" cy="120" r="7" fill="#0f172a" stroke="#38bdf8" stroke-width="3" />
          <text x="180" y="80" text-anchor="middle" font-family="sans-serif" font-size="15" fill="#f59e0b" font-weight="bold">x &lt; -1  or  x &gt; 6</text>
          <text x="180" y="190" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#94a3b8">Test Interval Solution Set</text>
        </g>
      `;
    } else { // 2D Parabola Shaded Inequality Region
      bodySvg = `
        <g transform="translate(60, 40)">
          <line x1="20" y1="140" x2="340" y2="140" stroke="#475569" stroke-width="2" />
          <line x1="180" y1="20" x2="180" y2="260" stroke="#475569" stroke-width="2" />
          <!-- Parabola Curve -->
          <path d="M 60,30 Q 180,240 300,30" fill="none" stroke="#ec4899" stroke-width="3" />
          <!-- Shaded Region Inside Parabola -->
          <path d="M 60,30 Q 180,240 300,30 Z" fill="rgba(236, 72, 153, 0.2)" />
          <circle cx="180" cy="135" r="5" fill="#f59e0b" />
          <text x="190" y="130" font-family="sans-serif" font-size="12" fill="#f59e0b" font-weight="bold">Test Point (0,0)</text>
          <text x="180" y="70" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#ec4899" font-weight="bold">y &gt; ax² + bx + c</text>
        </g>
      `;
    }
  }

  // ==========================================
  // TOPIC 166: Absolute Value Equations & Inequalities
  // ==========================================
  else if (topicId === 166) {
    if (subType === 0 || subType === 1 || subType === 2) { // V-Graph y = |x - h| + k
      bodySvg = `
        <g transform="translate(60, 40)">
          <line x1="20" y1="180" x2="340" y2="180" stroke="#475569" stroke-width="2" />
          <line x1="180" y1="20" x2="180" y2="260" stroke="#475569" stroke-width="2" />
          <!-- V-Shape -->
          <path d="M 40,40 L 180,180 L 320,40" fill="none" stroke="#38bdf8" stroke-width="3.5" />
          <circle cx="180" cy="180" r="5" fill="#f59e0b" />
          <text x="180" y="205" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#f59e0b" font-weight="bold">Vertex (h, k)</text>
          <text x="260" y="80" font-family="sans-serif" font-size="14" fill="#38bdf8" font-weight="bold">y = |x - h| + k</text>
        </g>
      `;
    } else { // Distance on Number Line |x - c| <= r
      bodySvg = `
        <g transform="translate(60, 60)">
          <line x1="20" y1="120" x2="340" y2="120" stroke="#475569" stroke-width="3" />
          <line x1="180" y1="120" x2="180" y2="120" stroke="#38bdf8" stroke-width="6" />
          <line x1="80" y1="120" x2="280" y2="120" stroke="#10b981" stroke-width="6" />
          <circle cx="180" cy="120" r="6" fill="#f59e0b" />
          <circle cx="80" cy="120" r="6" fill="#10b981" />
          <circle cx="280" cy="120" r="6" fill="#10b981" />
          <text x="180" y="95" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#f59e0b" font-weight="bold">Center c</text>
          <text x="80" y="155" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#10b981" font-weight="bold">c - r</text>
          <text x="280" y="155" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#10b981" font-weight="bold">c + r</text>
          <text x="180" y="185" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#38bdf8" font-weight="bold">Tolerance Interval: |x - c| ≤ r</text>
        </g>
      `;
    }
  }

  // ==========================================
  // TOPIC 167: Radical Expressions
  // ==========================================
  else if (topicId === 167) {
    bodySvg = `
      <g transform="translate(60, 40)">
        <line x1="40" y1="220" x2="340" y2="220" stroke="#475569" stroke-width="2" />
        <line x1="60" y1="20" x2="60" y2="250" stroke="#475569" stroke-width="2" />
        <!-- Radical Curve y = sqrt(x) -->
        <path d="M 60,220 Q 140,110 320,60" fill="none" stroke="#10b981" stroke-width="3.5" />
        <circle cx="60" cy="220" r="5" fill="#f59e0b" />
        <text x="75" y="235" font-family="sans-serif" font-size="13" fill="#f59e0b" font-weight="bold">Endpoint (0,0)</text>
        <text x="220" y="75" font-family="sans-serif" font-size="15" fill="#10b981" font-weight="bold">y = √(x)</text>
        <text x="200" y="170" font-family="sans-serif" font-size="13" fill="#94a3b8">Domain: x ≥ 0</text>
      </g>
    `;
  }

  // ==========================================
  // TOPIC 168: Roots of Quadratic Equations (Discriminant D)
  // ==========================================
  else if (topicId === 168) {
    bodySvg = `
      <g transform="translate(60, 40)">
        <line x1="20" y1="140" x2="340" y2="140" stroke="#475569" stroke-width="2.5" />
        <!-- D > 0 (2 roots) -->
        <path d="M 30,50 Q 80,210 130,50" fill="none" stroke="#38bdf8" stroke-width="2.5" />
        <circle cx="53" cy="140" r="4" fill="#38bdf8" />
        <circle cx="107" cy="140" r="4" fill="#38bdf8" />
        <text x="80" y="35" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#38bdf8" font-weight="bold">D &gt; 0 (2 Roots)</text>

        <!-- D = 0 (1 root) -->
        <path d="M 140,50 Q 180,140 220,50" fill="none" stroke="#10b981" stroke-width="2.5" />
        <circle cx="180" cy="140" r="4" fill="#10b981" />
        <text x="180" y="35" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#10b981" font-weight="bold">D = 0 (1 Root)</text>

        <!-- D < 0 (No real roots) -->
        <path d="M 230,50 Q 280,100 330,50" fill="none" stroke="#ec4899" stroke-width="2.5" />
        <text x="280" y="35" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#ec4899" font-weight="bold">D &lt; 0 (No Real Roots)</text>
      </g>
    `;
  }

  // ==========================================
  // TOPIC 169: Quadratic Functions
  // ==========================================
  else if (topicId === 169) {
    bodySvg = `
      <g transform="translate(60, 40)">
        <line x1="20" y1="180" x2="340" y2="180" stroke="#475569" stroke-width="2" />
        <line x1="180" y1="20" x2="180" y2="260" stroke="#475569" stroke-width="2" />
        <!-- Parabola Curve -->
        <path d="M 50,240 Q 180,20 310,240" fill="none" stroke="#f59e0b" stroke-width="3.5" />
        <!-- Axis of symmetry -->
        <line x1="180" y1="20" x2="180" y2="260" stroke="#ec4899" stroke-width="1.5" stroke-dasharray="4,4" />
        <circle cx="180" cy="20" r="5" fill="#ec4899" />
        <text x="185" y="35" font-family="sans-serif" font-size="13" fill="#ec4899" font-weight="bold">Vertex (h, k)</text>
        <text x="240" y="100" font-family="sans-serif" font-size="14" fill="#f59e0b" font-weight="bold">f(x) = a(x - h)² + k</text>
      </g>
    `;
  }

  // ==========================================
  // TOPIC 170: Equations Reducible to Quadratic Equations
  // ==========================================
  else if (topicId === 170) {
    bodySvg = `
      <g transform="translate(60, 40)">
        <line x1="20" y1="140" x2="340" y2="140" stroke="#475569" stroke-width="2" />
        <line x1="180" y1="20" x2="180" y2="260" stroke="#475569" stroke-width="2" />
        <!-- Biquadratic / W-shaped Curve -->
        <path d="M 40,30 Q 90,230 140,120 Q 180,40 220,120 Q 270,230 320,30" fill="none" stroke="#38bdf8" stroke-width="3" />
        <text x="180" y="240" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#38bdf8" font-weight="bold">Substitution u = x² → au² + bu + c = 0</text>
      </g>
    `;
  }

  // ==========================================
  // TOPIC 171: Equation of a Circle & Graph
  // ==========================================
  else if (topicId === 171) {
    bodySvg = `
      <g transform="translate(60, 30)">
        <!-- Grid axes -->
        <line x1="20" y1="150" x2="340" y2="150" stroke="#475569" stroke-width="2" />
        <line x1="180" y1="20" x2="180" y2="280" stroke="#475569" stroke-width="2" />
        <!-- Circle -->
        <circle cx="210" cy="120" r="90" fill="rgba(56, 189, 248, 0.12)" stroke="#38bdf8" stroke-width="3" />
        <circle cx="210" cy="120" r="5" fill="#f59e0b" />
        <line x1="210" y1="120" x2="300" y2="120" stroke="#f59e0b" stroke-width="2.5" />
        <text x="215" y="110" font-family="sans-serif" font-size="14" fill="#f59e0b" font-weight="bold">C(h, k)</text>
        <text x="250" y="140" font-family="sans-serif" font-size="13" fill="#f59e0b" font-weight="bold">r</text>
        <text x="180" y="260" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#38bdf8" font-weight="bold">(x - h)² + (y - k)² = r²</text>
      </g>
    `;
  }

  // ==========================================
  // TOPIC 172: Simple & Compound Interest & Depreciation
  // ==========================================
  else if (topicId === 172) {
    bodySvg = `
      <g transform="translate(60, 40)">
        <line x1="40" y1="230" x2="340" y2="230" stroke="#475569" stroke-width="2" />
        <line x1="40" y1="20" x2="40" y2="230" stroke="#475569" stroke-width="2" />
        <!-- Simple Interest Linear -->
        <line x1="40" y1="180" x2="320" y2="100" stroke="#38bdf8" stroke-width="2.5" stroke-dasharray="4,4" />
        <!-- Compound Interest Exponential -->
        <path d="M 40,180 Q 200,160 320,30" fill="none" stroke="#10b981" stroke-width="3.5" />
        <!-- Depreciation Curve -->
        <path d="M 40,40 Q 160,180 320,210" fill="none" stroke="#ec4899" stroke-width="3" />
        <text x="230" y="45" font-family="sans-serif" font-size="12" fill="#10b981" font-weight="bold">Compound: A = P(1+r)^t</text>
        <text x="220" y="115" font-family="sans-serif" font-size="12" fill="#38bdf8" font-weight="bold">Simple: I = Prt</text>
        <text x="220" y="195" font-family="sans-serif" font-size="12" fill="#ec4899" font-weight="bold">Depreciation: V = P(1-r)^t</text>
      </g>
    `;
  }

  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
  </style>
  <!-- Background -->
  <rect width="${width}" height="${height}" rx="12" fill="#0f172a" stroke="#334155" stroke-width="2"/>
  <!-- Title Header -->
  <rect x="0" y="0" width="${width}" height="40" rx="12" fill="#1e293b"/>
  <text x="20" y="25" font-size="14" fill="#38bdf8" font-weight="600">${title}</text>
  ${bodySvg}
</svg>`;

  const fileName = `g10_na_t${topicId}_q${qIndex + 1}.svg`;
  
  [publicImagesDir, rootImagesDir].forEach(dir => {
    fs.writeFileSync(path.join(dir, fileName), svgContent, 'utf-8');
  });

  return `/images/${fileName}`;
}
