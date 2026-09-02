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

export function generateTopic138Svg(subType, params) {
  const width = 480;
  const height = 380;
  const title = params.title || 'Triangle Inequality Diagram';

  let bodySvg = '';

  if (subType === 0) { // Side Length Check (6, 9, 17 - Invalid)
    bodySvg = `
      <g transform="translate(100, 100)">
        <!-- Broken triangle representation -->
        <line x1="0" y1="160" x2="260" y2="160" stroke="#f59e0b" stroke-width="3" />
        <line x1="0" y1="160" x2="80" y2="90" stroke="#38bdf8" stroke-width="3" />
        <line x1="260" y1="160" x2="160" y2="105" stroke="#ec4899" stroke-width="3" />
        <!-- Gap indicator -->
        <circle cx="120" cy="97.5" r="16" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="4,4" />
        <text x="120" y="70" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#ef4444" font-weight="bold">Gap: 6 + 9 = 15 < 17 (Cannot Form Triangle)</text>

        <text x="130" y="185" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#f59e0b" font-weight="bold">c = 17 cm</text>
        <text x="30" y="115" font-family="sans-serif" font-size="13" fill="#38bdf8" font-weight="bold">a = 6 cm</text>
        <text x="215" y="125" font-family="sans-serif" font-size="13" fill="#ec4899" font-weight="bold">b = 9 cm</text>
      </g>
    `;
  } else if (subType === 1 || subType === 4 || subType === 5) { // Third Side Range Bounds (5 < x < 21)
    const minVal = params.minVal || 5, maxVal = params.maxVal || 21, a = params.a || 8, b = params.b || 13;
    bodySvg = `
      <g transform="translate(90, 80)">
        <polygon points="0,170 240,170 140,40" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" stroke-width="2.5" />
        <text x="120" y="195" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#10b981" font-weight="bold">Third side x</text>
        <text x="60" y="95" font-family="sans-serif" font-size="13" fill="#38bdf8" font-weight="bold">a = ${a} cm</text>
        <text x="200" y="100" font-family="sans-serif" font-size="13" fill="#38bdf8" font-weight="bold">b = ${b} cm</text>

        <rect x="40" y="220" width="220" height="30" rx="6" fill="rgba(16, 185, 129, 0.9)" />
        <text x="150" y="240" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="bold" fill="#ffffff">Range: ${minVal} < x < ${maxVal}</text>
      </g>
    `;
  } else if (subType === 2) { // Angle-Side Relationship (A=45°, B=75°, C=60°)
    bodySvg = `
      <g transform="translate(100, 80)">
        <polygon points="0,180 260,180 90,30" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" stroke-width="2.5" />
        <!-- Angle arcs -->
        <path d="M 30 180 A 30 30 0 0 0 18 160" fill="none" stroke="#f59e0b" stroke-width="2" />
        <text x="40" y="170" font-family="sans-serif" font-size="12" fill="#f59e0b" font-weight="bold">A=45°</text>

        <path d="M 230 180 A 30 30 0 0 1 238 152" fill="none" stroke="#ec4899" stroke-width="2" />
        <text x="210" y="165" font-family="sans-serif" font-size="12" fill="#ec4899" font-weight="bold">B=75°</text>

        <path d="M 80 47 A 25 25 0 0 0 106 50" fill="none" stroke="#10b981" stroke-width="2" />
        <text x="90" y="70" font-family="sans-serif" font-size="12" fill="#10b981" font-weight="bold">C=60°</text>

        <rect x="30" y="220" width="240" height="30" rx="6" fill="rgba(15, 23, 42, 0.9)" stroke="#38bdf8" stroke-width="1" />
        <text x="150" y="240" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#38bdf8">Side Order: BC < AB < AC</text>
      </g>
    `;
  } else if (subType === 3) { // Side-Angle Relationship (XY=12, YZ=9, XZ=15)
    bodySvg = `
      <g transform="translate(100, 80)">
        <polygon points="0,180 240,180 0,30" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" stroke-width="2.5" />
        <text x="120" y="202" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#e2e8f0" font-weight="bold">YZ = 9 cm (shortest)</text>
        <text x="-40" y="110" font-family="sans-serif" font-size="13" fill="#e2e8f0" font-weight="bold">XY = 12 cm</text>
        <text x="135" y="95" font-family="sans-serif" font-size="13" fill="#e2e8f0" font-weight="bold">XZ = 15 cm (longest)</text>

        <rect x="20" y="220" width="240" height="30" rx="6" fill="rgba(15, 23, 42, 0.9)" stroke="#10b981" stroke-width="1" />
        <text x="140" y="240" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#10b981">Angle Order: ∠X < ∠Z < ∠Y</text>
      </g>
    `;
  } else if (subType === 6) { // Exterior Angle Inequality Theorem
    bodySvg = `
      <g transform="translate(80, 90)">
        <!-- Triangle ABC with extended base -->
        <line x1="0" y1="160" x2="300" y2="160" stroke="#94a3b8" stroke-width="2" />
        <polygon points="40,160 220,160 140,40" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" stroke-width="2.5" />
        <!-- Exterior angle arc -->
        <path d="M 220 160 L 250 160 A 30 30 0 0 0 236 139 Z" fill="rgba(239, 68, 68, 0.3)" stroke="#ef4444" stroke-width="2" />
        <text x="255" y="145" font-family="sans-serif" font-size="12" fill="#ef4444" font-weight="bold">Ext ∠4</text>
        <!-- Remote interior angles -->
        <text x="55" y="150" font-family="sans-serif" font-size="12" fill="#10b981" font-weight="bold">Int ∠1</text>
        <text x="140" y="70" font-family="sans-serif" font-size="12" fill="#10b981" font-weight="bold">Int ∠2</text>

        <rect x="20" y="210" width="260" height="30" rx="6" fill="rgba(239, 68, 68, 0.9)" />
        <text x="150" y="230" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff">Theorem: Ext ∠4 > Int ∠1 and Ext ∠4 > Int ∠2</text>
      </g>
    `;
  } else if (subType === 7) { // Hinge Theorem (SAS Inequality)
    bodySvg = `
      <!-- Triangle 1 (A = 65°) -->
      <g transform="translate(60, 90)">
        <polygon points="0,150 120,150 60,30" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" stroke-width="2" />
        <text x="60" y="172" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#38bdf8" font-weight="bold">BC (larger)</text>
        <text x="60" y="75" font-family="sans-serif" font-size="11" fill="#f59e0b" font-weight="bold">∠A = 65°</text>
      </g>

      <text x="240" y="160" font-family="sans-serif" font-size="20" fill="#f59e0b" font-weight="bold">></text>

      <!-- Triangle 2 (D = 48°) -->
      <g transform="translate(280, 90)">
        <polygon points="0,150 100,150 60,45" fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" stroke-width="2" />
        <text x="50" y="172" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#10b981" font-weight="bold">EF (smaller)</text>
        <text x="50" y="85" font-family="sans-serif" font-size="11" fill="#f59e0b" font-weight="bold">∠D = 48°</text>
      </g>
      <text x="240" y="250" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#38bdf8" font-weight="bold">Hinge Theorem: m∠A > m∠D ⟹ BC > EF</text>
    `;
  } else { // Scalene / Isosceles Angle Ranking
    bodySvg = `
      <g transform="translate(110, 80)">
        <polygon points="0,180 240,180 100,30" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" stroke-width="2.5" />
        <text x="120" y="202" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#e2e8f0" font-weight="bold">KM = 11 cm (longest side)</text>
        <text x="35" y="100" font-family="sans-serif" font-size="13" fill="#e2e8f0" font-weight="bold">KL = 7</text>
        <text x="180" y="100" font-family="sans-serif" font-size="13" fill="#e2e8f0" font-weight="bold">LM = 7</text>
        <rect x="20" y="220" width="240" height="30" rx="6" fill="rgba(16, 185, 129, 0.9)" />
        <text x="140" y="240" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff">Smallest Angles: ∠K and ∠M (equal)</text>
      </g>
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

export function saveTopic138SvgPlots() {
  console.log('Generating 50 Triangle Inequality SVG plot files for Topic 138...');
  for (let qIndex = 0; qIndex < 50; qIndex++) {
    const subType = qIndex % 10;
    let params = {};

    if (subType === 0) params = { title: `Triangle Side Length Check (6, 9, 17)` };
    else if (subType === 1) params = { title: `Third Side Range Bounds (5 < x < 21)`, minVal: 5, maxVal: 21, a: 8, b: 13 };
    else if (subType === 2) params = { title: `Angle-Side Order Relationship` };
    else if (subType === 3) params = { title: `Side-Angle Order Relationship` };
    else if (subType === 4) params = { title: `Third Side Non-Zero Bounds`, minVal: 7, maxVal: 37, a: 15, b: 22 };
    else if (subType === 5) params = { title: `Third Side Integer Bounds (6 < PR < 22)`, minVal: 6, maxVal: 22, a: 8, b: 14 };
    else if (subType === 6) params = { title: `Exterior Angle Inequality Theorem` };
    else if (subType === 7) params = { title: `Hinge Theorem (SAS Inequality)` };
    else if (subType === 8) params = { title: `Isosceles Angle Ranking (KL=7, LM=7, KM=11)` };
    else params = { title: `Triangular Route Return Path Max Bounds` };

    const svg = generateTopic138Svg(subType, params);
    const fileName = `g8_t138_q${qIndex + 1}.svg`;

    fs.writeFileSync(path.join(publicImagesDir, fileName), svg);
    fs.writeFileSync(path.join(rootImagesDir, fileName), svg);
  }
  console.log('✅ Created 50 Triangle Inequality SVG plot files in public/images/ and images/!');
}

if (process.argv[1] && process.argv[1].endsWith('generate_t138_svg_plots.js')) {
  saveTopic138SvgPlots();
}
