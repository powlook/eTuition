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

export function generateTopic137Svg(subType, params) {
  const width = 480;
  const height = 380;
  const title = params.title || 'Pythagorean Theorem Diagram';

  let bodySvg = '';

  if (subType === 0) { // Right Triangle Hypotenuse c
    const a = params.a || 9, b = params.b || 12, c = params.c || 15;
    bodySvg = `
      <g transform="translate(110, 80)">
        <polygon points="0,200 240,200 0,20" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" stroke-width="2.5" />
        <!-- Right angle marker -->
        <rect x="0" y="180" width="20" height="20" fill="none" stroke="#f59e0b" stroke-width="2" />
        <!-- Labels -->
        <text x="120" y="222" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#e2e8f0" font-weight="bold">b = ${b} cm</text>
        <text x="-35" y="110" font-family="sans-serif" font-size="13" fill="#e2e8f0" font-weight="bold">a = ${a} cm</text>
        <text x="135" y="100" font-family="sans-serif" font-size="14" fill="#10b981" font-weight="bold">c = ? (${c} cm)</text>
        <text x="-15" y="215" font-family="sans-serif" font-size="14" fill="#f59e0b" font-weight="bold">C</text>
        <text x="-15" y="15" font-family="sans-serif" font-size="14" fill="#38bdf8" font-weight="bold">A</text>
        <text x="250" y="215" font-family="sans-serif" font-size="14" fill="#38bdf8" font-weight="bold">B</text>
      </g>
    `;
  } else if (subType === 1) { // Missing Leg a
    const c = params.c || 25, b = params.b || 7, a = params.a || 24;
    bodySvg = `
      <g transform="translate(120, 80)">
        <polygon points="0,200 220,200 0,20" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" stroke-width="2.5" />
        <rect x="0" y="180" width="20" height="20" fill="none" stroke="#f59e0b" stroke-width="2" />
        <text x="110" y="222" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#e2e8f0" font-weight="bold">b = ${b} cm</text>
        <text x="-40" y="110" font-family="sans-serif" font-size="14" fill="#10b981" font-weight="bold">a = ? (${a} cm)</text>
        <text x="125" y="100" font-family="sans-serif" font-size="13" fill="#f59e0b" font-weight="bold">c = ${c} cm</text>
      </g>
    `;
  } else if (subType === 2 || subType === 3) { // Converse Classification (Right / Acute / Obtuse)
    const a = params.a || 8, b = params.b || 15, c = params.c || 17, typeStr = params.typeStr || 'Right Triangle';
    bodySvg = `
      <g transform="translate(110, 80)">
        <polygon points="0,200 240,200 20,20" fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" stroke-width="2.5" />
        <text x="120" y="222" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#e2e8f0" font-weight="bold">b = ${b} cm</text>
        <text x="-25" y="110" font-family="sans-serif" font-size="13" fill="#e2e8f0" font-weight="bold">a = ${a} cm</text>
        <text x="140" y="100" font-family="sans-serif" font-size="13" fill="#e2e8f0" font-weight="bold">c = ${c} cm</text>

        <rect x="30" y="240" width="180" height="28" rx="6" fill="rgba(16, 185, 129, 0.9)" />
        <text x="120" y="259" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff">${typeStr} (c² = a² + b²)</text>
      </g>
    `;
  } else if (subType === 4) { // Leaning Ladder
    const ladder = params.c || 15, wall = params.a || 12, ground = params.b || 9;
    bodySvg = `
      <!-- Wall & Ground -->
      <line x1="140" y1="60" x2="140" y2="280" stroke="#94a3b8" stroke-width="4" />
      <line x1="140" y1="280" x2="340" y2="280" stroke="#94a3b8" stroke-width="4" />
      <!-- Ladder -->
      <line x1="140" y1="100" x2="280" y2="280" stroke="#f59e0b" stroke-width="5" />
      <line x1="140" y1="100" x2="280" y2="280" stroke="#38bdf8" stroke-width="2" stroke-dasharray="8,6" />
      <!-- Right angle -->
      <rect x="140" y="260" width="20" height="20" fill="none" stroke="#10b981" stroke-width="2" />
      <!-- Labels -->
      <text x="90" y="190" font-family="sans-serif" font-size="13" fill="#38bdf8" font-weight="bold">Wall = ${wall} m</text>
      <text x="210" y="302" font-family="sans-serif" font-size="13" fill="#10b981" font-weight="bold">Ground = ? (${ground} m)</text>
      <text x="225" y="175" font-family="sans-serif" font-size="13" fill="#f59e0b" font-weight="bold">Ladder = ${ladder} m</text>
    `;
  } else if (subType === 5) { // TV Screen Diagonal
    const w = params.w || 40, h = params.h || 30, diag = params.diag || 50;
    bodySvg = `
      <g transform="translate(100, 90)">
        <!-- TV Screen Outer -->
        <rect x="0" y="0" width="280" height="190" rx="8" fill="rgba(15, 23, 42, 0.9)" stroke="#38bdf8" stroke-width="3" />
        <!-- Diagonal -->
        <line x1="0" y1="190" x2="280" y2="0" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="6,4" />
        <!-- Labels -->
        <text x="140" y="212" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#e2e8f0" font-weight="bold">Width = ${w}"</text>
        <text x="-40" y="100" font-family="sans-serif" font-size="13" fill="#e2e8f0" font-weight="bold">Height = ${h}"</text>
        <text x="140" y="85" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#f59e0b" font-weight="bold">Diagonal = ? (${diag}")</text>
      </g>
    `;
  } else if (subType === 6) { // Rectangle Diagonal
    const w = params.w || 16, h = params.h || 12, diag = params.diag || 20;
    bodySvg = `
      <g transform="translate(110, 90)">
        <rect x="0" y="0" width="260" height="180" fill="rgba(56, 189, 248, 0.12)" stroke="#38bdf8" stroke-width="2" />
        <line x1="0" y1="180" x2="260" y2="0" stroke="#10b981" stroke-width="2.5" stroke-dasharray="6,4" />
        <text x="130" y="202" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#e2e8f0" font-weight="bold">Width = ${w} cm</text>
        <text x="-40" y="95" font-family="sans-serif" font-size="13" fill="#e2e8f0" font-weight="bold">Height = ${h} cm</text>
        <text x="130" y="80" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#10b981" font-weight="bold">Diagonal = ${diag} cm</text>
      </g>
    `;
  } else if (subType === 7) { // Runner Compass Navigation
    const north = params.north || 6, east = params.east || 8, dist = params.dist || 10;
    bodySvg = `
      <g transform="translate(140, 70)">
        <!-- Path North -->
        <line x1="0" y1="200" x2="0" y2="60" stroke="#38bdf8" stroke-width="3" />
        <!-- Path East -->
        <line x1="0" y1="60" x2="180" y2="60" stroke="#38bdf8" stroke-width="3" />
        <!-- Direct Hypotenuse -->
        <line x1="0" y1="200" x2="180" y2="60" stroke="#10b981" stroke-width="2.5" stroke-dasharray="6,4" />
        <!-- Right angle -->
        <rect x="0" y="60" width="18" height="18" fill="none" stroke="#f59e0b" stroke-width="2" />
        <!-- Points & Labels -->
        <circle cx="0" cy="200" r="5" fill="#f59e0b" />
        <text x="-15" y="220" font-family="sans-serif" font-size="13" fill="#f59e0b" font-weight="bold">Point A</text>
        <circle cx="180" cy="60" r="5" fill="#10b981" />
        <text x="190" y="65" font-family="sans-serif" font-size="13" fill="#10b981" font-weight="bold">Point B</text>

        <text x="-50" y="130" font-family="sans-serif" font-size="12" fill="#38bdf8" font-weight="bold">North ${north} km</text>
        <text x="90" y="45" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#38bdf8" font-weight="bold">East ${east} km</text>
        <text x="100" y="145" font-family="sans-serif" font-size="13" fill="#10b981" font-weight="bold">Direct Distance = ? (${dist} km)</text>
      </g>
    `;
  } else if (subType === 8) { // Equilateral Triangle Altitude
    const s = params.s || 10, alt = params.alt || '5√3 ≈ 8.66';
    bodySvg = `
      <g transform="translate(140, 80)">
        <polygon points="0,200 200,200 100,27" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" stroke-width="2.5" />
        <line x1="100" y1="27" x2="100" y2="200" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="4,4" />
        <rect x="100" y="182" width="18" height="18" fill="none" stroke="#10b981" stroke-width="2" />
        <!-- Labels -->
        <text x="40" y="100" font-family="sans-serif" font-size="12" fill="#38bdf8" font-weight="bold">s = ${s} cm</text>
        <text x="160" y="100" font-family="sans-serif" font-size="12" fill="#38bdf8" font-weight="bold">s = ${s} cm</text>
        <text x="100" y="222" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#38bdf8" font-weight="bold">Base s = ${s} cm</text>
        <text x="110" y="120" font-family="sans-serif" font-size="13" fill="#f59e0b" font-weight="bold">Altitude h = ${alt} cm</text>
      </g>
    `;
  } else { // Guy Wire Transmission Tower
    const tower = params.a || 24, base = params.b || 10, wire = params.c || 26;
    bodySvg = `
      <!-- Ground & Tower -->
      <line x1="100" y1="280" x2="360" y2="280" stroke="#94a3b8" stroke-width="4" />
      <line x1="160" y1="60" x2="160" y2="280" stroke="#e2e8f0" stroke-width="6" />
      <!-- Wire -->
      <line x1="160" y1="60" x2="320" y2="280" stroke="#f59e0b" stroke-width="3" />
      <rect x="160" y="260" width="20" height="20" fill="none" stroke="#10b981" stroke-width="2" />
      <!-- Labels -->
      <text x="90" y="170" font-family="sans-serif" font-size="13" fill="#e2e8f0" font-weight="bold">Tower = ${tower} m</text>
      <text x="240" y="302" font-family="sans-serif" font-size="13" fill="#10b981" font-weight="bold">Anchor = ${base} m</text>
      <text x="250" y="160" font-family="sans-serif" font-size="13" fill="#f59e0b" font-weight="bold">Guy Wire = ? (${wire} m)</text>
    `;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <rect width="100%" height="100%" fill="#0f172a" rx="12" />

  <!-- Header Title -->
  <rect x="16" y="12" width="${width - 32}" height="28" rx="6" fill="rgba(56, 189, 248, 0.12)" stroke="rgba(56, 189, 248, 0.3)" />
  <text x="${width / 2}" y="31" text-anchor="middle" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#38bdf8">
    ${title}
  </text>

  <!-- Body Content -->
  ${bodySvg}
</svg>`;
}

export function saveTopic137SvgPlots() {
  console.log('Generating 50 Pythagorean SVG plot files for Topic 137...');
  for (let qIndex = 0; qIndex < 50; qIndex++) {
    const subType = qIndex % 10;
    let params = {};

    if (subType === 0) params = { title: `Right Triangle Hypotenuse c`, a: 9, b: 12, c: 15 };
    else if (subType === 1) params = { title: `Missing Leg Calculation`, a: 24, b: 7, c: 25 };
    else if (subType === 2) params = { title: `Converse Pythagorean Check (8, 15, 17)`, a: 8, b: 15, c: 17, typeStr: 'Right Triangle' };
    else if (subType === 3) params = { title: `Triangle Classification (7, 10, 12)`, a: 7, b: 10, c: 12, typeStr: 'Acute Triangle' };
    else if (subType === 4) params = { title: `Rescue Ladder Leaning Against Wall`, a: 12, b: 9, c: 15 };
    else if (subType === 5) params = { title: `TV Screen Diagonal Size`, w: 40, h: 30, diag: 50 };
    else if (subType === 6) params = { title: `Rectangle Diagonal Length`, w: 16, h: 12, diag: 20 };
    else if (subType === 7) params = { title: `Runner Compass Navigation Distance`, north: 6, east: 8, dist: 10 };
    else if (subType === 8) params = { title: `Equilateral Triangle Altitude`, s: 10, alt: '5√3 ≈ 8.66' };
    else params = { title: `Transmission Tower Guy Wire`, a: 24, b: 10, c: 26 };

    const svg = generateTopic137Svg(subType, params);
    const fileName = `g8_t137_q${qIndex + 1}.svg`;

    fs.writeFileSync(path.join(publicImagesDir, fileName), svg);
    fs.writeFileSync(path.join(rootImagesDir, fileName), svg);
  }
  console.log('✅ Created 50 Pythagorean SVG plot files in public/images/ and images/!');
}

if (process.argv[1] && process.argv[1].endsWith('generate_t137_svg_plots.js')) {
  saveTopic137SvgPlots();
}
