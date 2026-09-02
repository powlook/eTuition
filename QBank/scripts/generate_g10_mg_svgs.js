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

export function generateGrade10MgSvg(topicId, qIndex, params = {}) {
  const width = 480;
  const height = 360;
  const subType = qIndex % 10;
  const title = params.title || `Grade 10 Topic ${topicId} Diagram #${qIndex + 1}`;

  let bodySvg = '';

  // ==========================================
  // TOPIC 161: Laws of Sines and Cosines
  // ==========================================
  if (topicId === 161) {
    if (subType === 0 || subType === 1) { // Oblique Triangle ABC
      bodySvg = `
        <g transform="translate(60, 40)">
          <polygon points="40,240 320,240 220,50" fill="rgba(56, 189, 248, 0.12)" stroke="#38bdf8" stroke-width="3" />
          <circle cx="40" cy="240" r="5" fill="#f59e0b" />
          <circle cx="320" cy="240" r="5" fill="#10b981" />
          <circle cx="220" cy="50" r="5" fill="#ec4899" />
          <text x="20" y="260" font-family="sans-serif" font-size="16" fill="#f59e0b" font-weight="bold">A</text>
          <text x="330" y="260" font-family="sans-serif" font-size="16" fill="#10b981" font-weight="bold">B</text>
          <text x="220" y="35" font-family="sans-serif" font-size="16" fill="#ec4899" font-weight="bold">C</text>
          <text x="280" y="145" font-family="sans-serif" font-size="14" fill="#e2e8f0" font-weight="bold">a</text>
          <text x="115" y="145" font-family="sans-serif" font-size="14" fill="#e2e8f0" font-weight="bold">b</text>
          <text x="180" y="265" font-family="sans-serif" font-size="14" fill="#e2e8f0" font-weight="bold">c</text>
        </g>
      `;
    } else if (subType === 2 || subType === 3) { // Ambiguous Case SSA
      bodySvg = `
        <g transform="translate(50, 40)">
          <line x1="30" y1="240" x2="350" y2="240" stroke="#64748b" stroke-width="2" stroke-dasharray="4,4" />
          <line x1="30" y1="240" x2="160" y2="60" stroke="#38bdf8" stroke-width="3" />
          <line x1="160" y1="60" x2="270" y2="240" stroke="#f59e0b" stroke-width="3" />
          <line x1="160" y1="60" x2="190" y2="240" stroke="#ec4899" stroke-width="3" stroke-dasharray="5,5" />
          <line x1="160" y1="60" x2="160" y2="240" stroke="#10b981" stroke-width="2" stroke-dasharray="3,3" />
          <circle cx="30" cy="240" r="5" fill="#38bdf8" />
          <circle cx="160" cy="60" r="5" fill="#ec4899" />
          <text x="15" y="260" font-family="sans-serif" font-size="15" fill="#38bdf8" font-weight="bold">A</text>
          <text x="160" y="40" font-family="sans-serif" font-size="15" fill="#ec4899" font-weight="bold">C</text>
          <text x="275" y="260" font-family="sans-serif" font-size="15" fill="#f59e0b" font-weight="bold">B₁</text>
          <text x="185" y="260" font-family="sans-serif" font-size="15" fill="#ec4899" font-weight="bold">B₂</text>
          <text x="165" y="160" font-family="sans-serif" font-size="13" fill="#10b981" font-weight="bold">h = b sin A</text>
          <text x="80" y="140" font-family="sans-serif" font-size="14" fill="#e2e8f0" font-weight="bold">b</text>
          <text x="230" y="140" font-family="sans-serif" font-size="14" fill="#f59e0b" font-weight="bold">a</text>
        </g>
      `;
    } else if (subType === 4 || subType === 5) { // Bearings / Navigation Diagram
      bodySvg = `
        <g transform="translate(60, 40)">
          <!-- Compass rose lines -->
          <line x1="100" y1="20" x2="100" y2="260" stroke="#475569" stroke-width="1.5" stroke-dasharray="3,3" />
          <line x1="20" y1="180" x2="260" y2="180" stroke="#475569" stroke-width="1.5" stroke-dasharray="3,3" />
          <text x="95" y="15" font-family="sans-serif" font-size="12" fill="#94a3b8">N</text>
          <text x="265" y="185" font-family="sans-serif" font-size="12" fill="#94a3b8">E</text>
          <!-- Ship paths -->
          <line x1="100" y1="180" x2="220" y2="60" stroke="#38bdf8" stroke-width="3" />
          <line x1="100" y1="180" x2="280" y2="230" stroke="#f59e0b" stroke-width="3" />
          <line x1="220" y1="60" x2="280" y2="230" stroke="#ec4899" stroke-width="2.5" stroke-dasharray="4,4" />
          <circle cx="100" cy="180" r="5" fill="#94a3b8" />
          <circle cx="220" cy="60" r="5" fill="#38bdf8" />
          <circle cx="280" cy="230" r="5" fill="#f59e0b" />
          <text x="80" y="195" font-family="sans-serif" font-size="14" fill="#e2e8f0" font-weight="bold">Port</text>
          <text x="230" y="55" font-family="sans-serif" font-size="14" fill="#38bdf8" font-weight="bold">Ship A</text>
          <text x="290" y="245" font-family="sans-serif" font-size="14" fill="#f59e0b" font-weight="bold">Ship B</text>
          <text x="260" y="145" font-family="sans-serif" font-size="13" fill="#ec4899" font-weight="bold">d = ?</text>
        </g>
      `;
    } else { // Height / Guy Wire / Tower Diagram
      bodySvg = `
        <g transform="translate(60, 40)">
          <!-- Ground -->
          <line x1="20" y1="250" x2="340" y2="250" stroke="#64748b" stroke-width="3" />
          <!-- Tower -->
          <line x1="180" y1="250" x2="180" y2="50" stroke="#e2e8f0" stroke-width="4" />
          <!-- Wires -->
          <line x1="40" y1="250" x2="180" y2="50" stroke="#38bdf8" stroke-width="3" />
          <line x1="320" y1="250" x2="180" y2="50" stroke="#f59e0b" stroke-width="3" />
          <circle cx="180" cy="50" r="5" fill="#ec4899" />
          <circle cx="40" cy="250" r="5" fill="#38bdf8" />
          <circle cx="320" cy="250" r="5" fill="#f59e0b" />
          <text x="185" y="150" font-family="sans-serif" font-size="14" fill="#e2e8f0" font-weight="bold">h</text>
          <text x="80" y="140" font-family="sans-serif" font-size="13" fill="#38bdf8" font-weight="bold">Wire 1</text>
          <text x="260" y="140" font-family="sans-serif" font-size="13" fill="#f59e0b" font-weight="bold">Wire 2</text>
          <text x="160" y="275" font-family="sans-serif" font-size="13" fill="#94a3b8" font-weight="bold">Ground Baseline</text>
        </g>
      `;
    }
  }

  // ==========================================
  // TOPIC 162: Cartesian Transformations
  // ==========================================
  else if (topicId === 162) {
    if (subType === 0 || subType === 1 || subType === 2) { // Translation
      bodySvg = `
        <g transform="translate(60, 40)">
          <!-- Grid axes -->
          <line x1="20" y1="140" x2="340" y2="140" stroke="#475569" stroke-width="2" />
          <line x1="180" y1="20" x2="180" y2="260" stroke="#475569" stroke-width="2" />
          <text x="330" y="130" font-family="sans-serif" font-size="13" fill="#94a3b8">x</text>
          <text x="190" y="30" font-family="sans-serif" font-size="13" fill="#94a3b8">y</text>
          <!-- Original Triangle ABC -->
          <polygon points="100,180 160,180 130,110" fill="rgba(56, 189, 248, 0.2)" stroke="#38bdf8" stroke-width="2.5" />
          <text x="90" y="200" font-family="sans-serif" font-size="13" fill="#38bdf8" font-weight="bold">A(-4, -2)</text>
          <text x="160" y="200" font-family="sans-serif" font-size="13" fill="#38bdf8" font-weight="bold">B(-1, -2)</text>
          <text x="120" y="100" font-family="sans-serif" font-size="13" fill="#38bdf8" font-weight="bold">C(-2, 2)</text>
          <!-- Translated Triangle A'B'C' -->
          <polygon points="220,100 280,100 250,30" fill="rgba(245, 158, 11, 0.2)" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="4,4" />
          <text x="210" y="120" font-family="sans-serif" font-size="13" fill="#f59e0b" font-weight="bold">A'</text>
          <text x="285" y="120" font-family="sans-serif" font-size="13" fill="#f59e0b" font-weight="bold">B'</text>
          <text x="250" y="20" font-family="sans-serif" font-size="13" fill="#f59e0b" font-weight="bold">C'</text>
          <!-- Translation Arrow -->
          <line x1="130" y1="110" x2="250" y2="30" stroke="#ec4899" stroke-width="2" marker-end="url(#arrow)" />
          <text x="190" y="60" font-family="sans-serif" font-size="12" fill="#ec4899" font-weight="bold">T(x+h, y+k)</text>
        </g>
      `;
    } else if (subType === 3 || subType === 4 || subType === 5) { // Reflection across line
      bodySvg = `
        <g transform="translate(60, 40)">
          <!-- Line of Reflection y = x -->
          <line x1="40" y1="240" x2="300" y2="20" stroke="#ec4899" stroke-width="2.5" stroke-dasharray="5,5" />
          <text x="270" y="40" font-family="sans-serif" font-size="13" fill="#ec4899" font-weight="bold">y = x</text>
          <!-- Pre-image P -->
          <circle cx="100" cy="180" r="6" fill="#38bdf8" />
          <text x="50" y="185" font-family="sans-serif" font-size="14" fill="#38bdf8" font-weight="bold">P(x, y)</text>
          <!-- Image P' -->
          <circle cx="160" cy="120" r="6" fill="#10b981" />
          <text x="175" y="125" font-family="sans-serif" font-size="14" fill="#10b981" font-weight="bold">P'(y, x)</text>
          <!-- Perpendicular segment -->
          <line x1="100" y1="180" x2="160" y2="120" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3,3" />
        </g>
      `;
    } else { // Rotation about Origin
      bodySvg = `
        <g transform="translate(60, 40)">
          <!-- Coordinate Axes -->
          <line x1="20" y1="140" x2="340" y2="140" stroke="#475569" stroke-width="2" />
          <line x1="180" y1="20" x2="180" y2="260" stroke="#475569" stroke-width="2" />
          <circle cx="180" cy="140" r="4" fill="#e2e8f0" />
          <text x="185" y="155" font-family="sans-serif" font-size="12" fill="#94a3b8">O(0,0)</text>
          <!-- Point P -->
          <line x1="180" y1="140" x2="280" y2="90" stroke="#38bdf8" stroke-width="2.5" />
          <circle cx="280" cy="90" r="5" fill="#38bdf8" />
          <text x="290" y="90" font-family="sans-serif" font-size="13" fill="#38bdf8" font-weight="bold">P(a, b)</text>
          <!-- Rotated Point P' 90 deg counter-clockwise -->
          <line x1="180" y1="140" x2="130" y2="40" stroke="#10b981" stroke-width="2.5" />
          <circle cx="130" cy="40" r="5" fill="#10b981" />
          <text x="80" y="35" font-family="sans-serif" font-size="13" fill="#10b981" font-weight="bold">P'(-b, a)</text>
          <!-- Rotation Arc -->
          <path d="M 230,115 A 60,60 0 0,0 155,90" fill="none" stroke="#f59e0b" stroke-width="2" stroke-dasharray="3,3" />
          <text x="185" y="90" font-family="sans-serif" font-size="12" fill="#f59e0b" font-weight="bold">+90°</text>
        </g>
      `;
    }
  }

  // ==========================================
  // TOPIC 163: Central angles, inscribed angles, chords, secants, tangents
  // ==========================================
  else if (topicId === 163) {
    if (subType === 0 || subType === 1 || subType === 2) { // Central vs Inscribed Angle
      bodySvg = `
        <g transform="translate(70, 30)">
          <!-- Circle -->
          <circle cx="170" cy="150" r="110" fill="rgba(56, 189, 248, 0.08)" stroke="#38bdf8" stroke-width="3" />
          <circle cx="170" cy="150" r="4" fill="#e2e8f0" />
          <text x="175" y="145" font-family="sans-serif" font-size="14" fill="#e2e8f0" font-weight="bold">O</text>
          <!-- Central Angle AOB -->
          <line x1="170" y1="150" x2="80" y2="215" stroke="#f59e0b" stroke-width="2.5" />
          <line x1="170" y1="150" x2="260" y2="215" stroke="#f59e0b" stroke-width="2.5" />
          <text x="70" y="235" font-family="sans-serif" font-size="14" fill="#f59e0b" font-weight="bold">A</text>
          <text x="265" y="235" font-family="sans-serif" font-size="14" fill="#f59e0b" font-weight="bold">B</text>
          <!-- Inscribed Angle APB -->
          <line x1="170" y1="40" x2="80" y2="215" stroke="#10b981" stroke-width="2.5" />
          <line x1="170" y1="40" x2="260" y2="215" stroke="#10b981" stroke-width="2.5" />
          <circle cx="170" cy="40" r="4" fill="#10b981" />
          <text x="165" y="25" font-family="sans-serif" font-size="14" fill="#10b981" font-weight="bold">P</text>
          <text x="170" y="90" font-family="sans-serif" font-size="12" fill="#10b981" font-weight="bold">½θ</text>
          <text x="170" y="180" font-family="sans-serif" font-size="12" fill="#f59e0b" font-weight="bold">θ</text>
        </g>
      `;
    } else if (subType === 3 || subType === 4 || subType === 5) { // Intersecting Chords / Secants / Tangents
      bodySvg = `
        <g transform="translate(70, 30)">
          <circle cx="170" cy="150" r="100" fill="rgba(56, 189, 248, 0.08)" stroke="#38bdf8" stroke-width="3" />
          <!-- Secants from P outside -->
          <circle cx="310" cy="150" r="5" fill="#ec4899" />
          <text x="320" y="155" font-family="sans-serif" font-size="15" fill="#ec4899" font-weight="bold">P</text>
          <!-- Secant 1 -->
          <line x1="310" y1="150" x2="80" y2="90" stroke="#f59e0b" stroke-width="2.5" />
          <circle cx="215" cy="125" r="4" fill="#f59e0b" />
          <circle cx="80" cy="90" r="4" fill="#f59e0b" />
          <text x="215" y="115" font-family="sans-serif" font-size="13" fill="#f59e0b" font-weight="bold">A</text>
          <text x="65" y="90" font-family="sans-serif" font-size="13" fill="#f59e0b" font-weight="bold">B</text>
          <!-- Secant 2 -->
          <line x1="310" y1="150" x2="100" y2="225" stroke="#10b981" stroke-width="2.5" />
          <circle cx="230" cy="178" r="4" fill="#10b981" />
          <circle cx="100" cy="225" r="4" fill="#10b981" />
          <text x="235" y="195" font-family="sans-serif" font-size="13" fill="#10b981" font-weight="bold">C</text>
          <text x="85" y="240" font-family="sans-serif" font-size="13" fill="#10b981" font-weight="bold">D</text>
          <text x="270" y="135" font-family="sans-serif" font-size="12" fill="#ec4899" font-weight="bold">∠P = ½(BD - AC)</text>
        </g>
      `;
    } else { // Tangent Segment and Radius
      bodySvg = `
        <g transform="translate(70, 30)">
          <circle cx="150" cy="150" r="100" fill="rgba(56, 189, 248, 0.08)" stroke="#38bdf8" stroke-width="3" />
          <circle cx="150" cy="150" r="4" fill="#e2e8f0" />
          <text x="135" y="145" font-family="sans-serif" font-size="14" fill="#e2e8f0" font-weight="bold">O</text>
          <!-- Radius OP to point of tangency T -->
          <line x1="150" y1="150" x2="150" y2="250" stroke="#f59e0b" stroke-width="2.5" />
          <circle cx="150" cy="250" r="4" fill="#f59e0b" />
          <text x="145" y="270" font-family="sans-serif" font-size="14" fill="#f59e0b" font-weight="bold">T</text>
          <!-- Tangent Line at T -->
          <line x1="30" y1="250" x2="310" y2="250" stroke="#ec4899" stroke-width="3" />
          <!-- Right angle symbol -->
          <rect x="150" y="235" width="15" height="15" fill="none" stroke="#e2e8f0" stroke-width="1.5" />
          <!-- External Point P -->
          <line x1="150" y1="150" x2="310" y2="250" stroke="#10b981" stroke-width="2" stroke-dasharray="4,4" />
          <circle cx="310" cy="250" r="4" fill="#ec4899" />
          <text x="315" y="265" font-family="sans-serif" font-size="14" fill="#ec4899" font-weight="bold">P</text>
          <text x="220" y="240" font-family="sans-serif" font-size="13" fill="#ec4899" font-weight="bold">PT</text>
          <text x="130" y="200" font-family="sans-serif" font-size="13" fill="#f59e0b" font-weight="bold">r</text>
        </g>
      `;
    }
  }

  // ==========================================
  // TOPIC 164: Sectors and segments of a circle, and their areas
  // ==========================================
  else if (topicId === 164) {
    if (subType === 0 || subType === 1 || subType === 2) { // Sector of Circle
      bodySvg = `
        <g transform="translate(70, 30)">
          <!-- Whole circle light outline -->
          <circle cx="170" cy="150" r="110" fill="none" stroke="#475569" stroke-width="1.5" stroke-dasharray="4,4" />
          <!-- Sector wedge filled -->
          <path d="M 170,150 L 280,150 A 110,110 0 0,0 225,55 Z" fill="rgba(56, 189, 248, 0.35)" stroke="#38bdf8" stroke-width="3" />
          <circle cx="170" cy="150" r="5" fill="#e2e8f0" />
          <text x="150" y="155" font-family="sans-serif" font-size="15" fill="#e2e8f0" font-weight="bold">O</text>
          <text x="215" y="170" font-family="sans-serif" font-size="14" fill="#e2e8f0" font-weight="bold">r</text>
          <text x="195" y="130" font-family="sans-serif" font-size="14" fill="#38bdf8" font-weight="bold">θ</text>
          <text x="260" y="100" font-family="sans-serif" font-size="14" fill="#f59e0b" font-weight="bold">s = (θ/360)·2πr</text>
          <text x="190" y="80" font-family="sans-serif" font-size="13" fill="#38bdf8" font-weight="bold">Sector Area</text>
        </g>
      `;
    } else if (subType === 3 || subType === 4 || subType === 5) { // Segment of Circle
      bodySvg = `
        <g transform="translate(70, 30)">
          <circle cx="170" cy="150" r="110" fill="none" stroke="#475569" stroke-width="1.5" />
          <!-- Sector lines -->
          <line x1="170" y1="150" x2="280" y2="150" stroke="#64748b" stroke-width="2" stroke-dasharray="3,3" />
          <line x1="170" y1="150" x2="170" y2="40" stroke="#64748b" stroke-width="2" stroke-dasharray="3,3" />
          <!-- Chord -->
          <line x1="280" y1="150" x2="170" y2="40" stroke="#ec4899" stroke-width="3" />
          <!-- Segment Shaded Region -->
          <path d="M 280,150 A 110,110 0 0,0 170,40 Z" fill="rgba(236, 72, 153, 0.4)" stroke="#ec4899" stroke-width="2" />
          <circle cx="170" cy="150" r="4" fill="#e2e8f0" />
          <text x="150" y="165" font-family="sans-serif" font-size="14" fill="#e2e8f0" font-weight="bold">O</text>
          <text x="240" y="80" font-family="sans-serif" font-size="13" fill="#ec4899" font-weight="bold">Segment Area</text>
          <text x="190" y="100" font-family="sans-serif" font-size="11" fill="#94a3b8">Sector - Triangle</text>
        </g>
      `;
    } else { // Annulus / Concentric Circles
      bodySvg = `
        <g transform="translate(70, 30)">
          <!-- Outer Circle -->
          <circle cx="170" cy="150" r="110" fill="rgba(16, 185, 129, 0.25)" stroke="#10b981" stroke-width="3" />
          <!-- Inner Circle -->
          <circle cx="170" cy="150" r="60" fill="#0f172a" stroke="#38bdf8" stroke-width="3" />
          <circle cx="170" cy="150" r="4" fill="#e2e8f0" />
          <text x="155" y="155" font-family="sans-serif" font-size="14" fill="#e2e8f0" font-weight="bold">O</text>
          <!-- Radii -->
          <line x1="170" y1="150" x2="230" y2="150" stroke="#38bdf8" stroke-width="2" />
          <line x1="170" y1="150" x2="170" y2="40" stroke="#10b981" stroke-width="2" />
          <text x="195" y="145" font-family="sans-serif" font-size="13" fill="#38bdf8" font-weight="bold">r</text>
          <text x="175" y="95" font-family="sans-serif" font-size="13" fill="#10b981" font-weight="bold">R</text>
          <text x="210" y="70" font-family="sans-serif" font-size="13" fill="#10b981" font-weight="bold">Annulus Area = π(R² - r²)</text>
        </g>
      `;
    }
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

  const fileName = `g10_mg_t${topicId}_q${qIndex + 1}.svg`;
  
  [publicImagesDir, rootImagesDir].forEach(dir => {
    fs.writeFileSync(path.join(dir, fileName), svgContent, 'utf-8');
  });

  return `/images/${fileName}`;
}
