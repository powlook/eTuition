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

export function generateLinearSystemSvg(params) {
  const width = 480;
  const height = 380;
  const margin = 45;
  const plotWidth = width - 2 * margin;
  const plotHeight = height - 2 * margin - 20;

  const { title, eq1, eq2, a1, b1, c1, a2, b2, c2, solX, solY, systemType } = params;

  // Determine plot coordinate range bounds
  let allX = [0];
  let allY = [0];
  if (solX !== undefined && solY !== undefined && !isNaN(solX) && !isNaN(solY)) {
    allX.push(solX);
    allY.push(solY);
  }

  // Intercepts of Line 1
  if (b1 !== 0) allY.push(c1 / b1);
  if (a1 !== 0) allX.push(c1 / a1);
  // Intercepts of Line 2
  if (b2 !== 0) allY.push(c2 / b2);
  if (a2 !== 0) allX.push(c2 / a2);

  const boundX = Math.max(...allX.map(x => Math.abs(x)), 6);
  const boundY = Math.max(...allY.map(y => Math.abs(y)), 6);
  const bound = Math.min(Math.max(boundX, boundY, 6), 25);

  const cx = margin + plotWidth / 2;
  const cy = margin + 20 + plotHeight / 2;
  const scale = Math.min(plotWidth / (2 * bound), plotHeight / (2 * bound));

  const toSvgX = (x) => cx + x * scale;
  const toSvgY = (y) => cy - y * scale;

  // Grid lines
  let gridLines = '';
  let axisTicks = '';
  const step = bound > 12 ? 4 : (bound > 8 ? 2 : 1);

  for (let i = -bound; i <= bound; i += step) {
    if (i === 0) continue;
    const gx = toSvgX(i);
    const gy = toSvgY(i);

    if (gx >= margin && gx <= width - margin) {
      gridLines += `<line x1="${gx}" y1="${margin + 20}" x2="${gx}" y2="${height - margin}" stroke="rgba(148, 163, 184, 0.15)" stroke-width="1" />`;
      axisTicks += `<text x="${gx}" y="${cy + 15}" text-anchor="middle" font-family="system-ui" font-size="10" fill="#64748b">${i}</text>`;
    }
    if (gy >= margin + 20 && gy <= height - margin) {
      gridLines += `<line x1="${margin}" y1="${gy}" x2="${width - margin}" y2="${gy}" stroke="rgba(148, 163, 184, 0.15)" stroke-width="1" />`;
      axisTicks += `<text x="${cx - 12}" y="${gy + 4}" text-anchor="end" font-family="system-ui" font-size="10" fill="#64748b">${i}</text>`;
    }
  }

  // Calculate endpoints for rendering line 1: a1*x + b1*y = c1
  function getLinePoints(a, b, c) {
    let xMin = -bound * 1.5, xMax = bound * 1.5;
    let yMin = -bound * 1.5, yMax = bound * 1.5;
    if (b !== 0) {
      const yAtMin = (c - a * xMin) / b;
      const yAtMax = (c - a * xMax) / b;
      return { x1: toSvgX(xMin), y1: toSvgY(yAtMin), x2: toSvgX(xMax), y2: toSvgY(yAtMax) };
    } else {
      const xVal = c / a;
      return { x1: toSvgX(xVal), y1: toSvgY(yMin), x2: toSvgX(xVal), y2: toSvgY(yMax) };
    }
  }

  const p1 = getLinePoints(a1, b1, c1);
  const p2 = getLinePoints(a2, b2, c2);

  let overlaySvg = '';

  if (systemType === 'inconsistent') {
    overlaySvg = `
      <!-- Line 1 -->
      <line x1="${p1.x1}" y1="${p1.y1}" x2="${p1.x2}" y2="${p1.y2}" stroke="#38bdf8" stroke-width="2.5" />
      <!-- Line 2 -->
      <line x1="${p2.x1}" y1="${p2.y1}" x2="${p2.x2}" y2="${p2.y2}" stroke="#f59e0b" stroke-width="2.5" />

      <rect x="${width / 2 - 110}" y="${height / 2 - 15}" width="220" height="30" rx="6" fill="rgba(239, 68, 68, 0.9)" stroke="#ef4444" stroke-width="1" />
      <text x="${width / 2}" y="${height / 2 + 5}" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff">Parallel Lines (No Solution)</text>
    `;
  } else if (systemType === 'dependent') {
    overlaySvg = `
      <!-- Single merged line with double glow -->
      <line x1="${p1.x1}" y1="${p1.y1}" x2="${p1.x2}" y2="${p1.y2}" stroke="#38bdf8" stroke-width="5" opacity="0.6" />
      <line x1="${p1.x1}" y1="${p1.y1}" x2="${p1.x2}" y2="${p1.y2}" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="8,6" />

      <rect x="${width / 2 - 130}" y="${height / 2 - 15}" width="260" height="30" rx="6" fill="rgba(16, 185, 129, 0.9)" stroke="#10b981" stroke-width="1" />
      <text x="${width / 2}" y="${height / 2 + 5}" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff">Coincident Lines (Infinitely Many Solutions)</text>
    `;
  } else {
    // Intersecting system
    const ix = toSvgX(solX);
    const iy = toSvgY(solY);

    overlaySvg = `
      <!-- Line 1 -->
      <line x1="${p1.x1}" y1="${p1.y1}" x2="${p1.x2}" y2="${p1.y2}" stroke="#38bdf8" stroke-width="2.5" />
      <!-- Line 2 -->
      <line x1="${p2.x1}" y1="${p2.y1}" x2="${p2.x2}" y2="${p2.y2}" stroke="#f59e0b" stroke-width="2.5" />

      <!-- Projections to axes -->
      <line x1="${ix}" y1="${cy}" x2="${ix}" y2="${iy}" stroke="#10b981" stroke-width="1.5" stroke-dasharray="4,4" />
      <line x1="${cx}" y1="${iy}" x2="${ix}" y2="${iy}" stroke="#10b981" stroke-width="1.5" stroke-dasharray="4,4" />

      <!-- Intersection point -->
      <circle cx="${ix}" cy="${iy}" r="6" fill="#10b981" stroke="#ffffff" stroke-width="2" />
      <rect x="${ix + 10}" y="${iy - 26}" width="80" height="24" rx="4" fill="rgba(15, 23, 42, 0.9)" stroke="#10b981" stroke-width="1" />
      <text x="${ix + 50}" y="${iy - 10}" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#10b981">(${solX}, ${solY})</text>
    `;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <rect width="100%" height="100%" fill="#0f172a" rx="12" />

  <!-- Header Title -->
  <rect x="16" y="12" width="${width - 32}" height="28" rx="6" fill="rgba(56, 189, 248, 0.12)" stroke="rgba(56, 189, 248, 0.3)" />
  <text x="${width / 2}" y="31" text-anchor="middle" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#38bdf8">
    ${title || 'System of Linear Equations Graph'}
  </text>

  <!-- Legend -->
  <g transform="translate(24, 48)">
    <rect width="12" height="12" rx="3" fill="#38bdf8" />
    <text x="18" y="10" font-family="sans-serif" font-size="10" fill="#e2e8f0">${eq1 || 'Line 1'}</text>
    <rect x="140" width="12" height="12" rx="3" fill="#f59e0b" />
    <text x="158" y="10" font-family="sans-serif" font-size="10" fill="#e2e8f0">${eq2 || 'Line 2'}</text>
  </g>

  <!-- Grid Lines -->
  ${gridLines}

  <!-- Axes -->
  <line x1="${margin}" y1="${cy}" x2="${width - margin}" y2="${cy}" stroke="#e2e8f0" stroke-width="2" />
  <polygon points="${width - margin},${cy} ${width - margin - 8},${cy - 4} ${width - margin - 8},${cy + 4}" fill="#e2e8f0" />
  <text x="${width - margin + 12}" y="${cy + 4}" font-family="system-ui" font-size="12" font-weight="bold" fill="#e2e8f0">X</text>

  <line x1="${cx}" y1="${height - margin}" x2="${cx}" y2="${margin + 20}" stroke="#e2e8f0" stroke-width="2" />
  <polygon points="${cx},${margin + 20} ${cx - 4},${margin + 28} ${cx + 4},${margin + 28}" fill="#e2e8f0" />
  <text x="${cx}" y="${margin + 12}" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="bold" fill="#e2e8f0">Y</text>

  <!-- Axis Ticks & Numbers -->
  ${axisTicks}

  <text x="${cx - 8}" y="${cy + 14}" font-family="system-ui" font-size="10" fill="#94a3b8">0</text>

  <!-- System Overlay -->
  ${overlaySvg}
</svg>`;
}

export function saveTopic134SvgPlots() {
  console.log('Generating 50 Linear System SVG plot files for Topic 134...');
  for (let qIndex = 0; qIndex < 50; qIndex++) {
    const subType = qIndex % 10;
    let params = {};

    if (subType === 0) { // Dependent
      params = {
        title: `Coincident System: 2x - y = 4 and 4x - 2y = 8`,
        eq1: `2x - y = 4`, eq2: `4x - 2y = 8`,
        a1: 2, b1: -1, c1: 4, a2: 4, b2: -2, c2: 8,
        systemType: 'dependent'
      };
    } else if (subType === 1) { // x+y=6, x-y=2 -> (4, 2)
      params = {
        title: `System Solution: x + y = 6 and x - y = 2`,
        eq1: `x + y = 6`, eq2: `x - y = 2`,
        a1: 1, b1: 1, c1: 6, a2: 1, b2: -1, c2: 2,
        solX: 4, solY: 2, systemType: 'intersecting'
      };
    } else if (subType === 2) { // y = 3x - 5, 2x + 3y = 18 -> (3, 4)
      params = {
        title: `Substitution System: y = 3x - 5 and 2x + 3y = 18`,
        eq1: `3x - y = 5`, eq2: `2x + 3y = 18`,
        a1: 3, b1: -1, c1: 5, a2: 2, b2: 3, c2: 18,
        solX: 3, solY: 4, systemType: 'intersecting'
      };
    } else if (subType === 3) { // 3x+2y=16, 5x-2y=16 -> (4, 2)
      params = {
        title: `Elimination System: 3x + 2y = 16 and 5x - 2y = 16`,
        eq1: `3x + 2y = 16`, eq2: `5x - 2y = 16`,
        a1: 3, b1: 2, c1: 16, a2: 5, b2: -2, c2: 16,
        solX: 4, solY: 2, systemType: 'intersecting'
      };
    } else if (subType === 4) { // 4x+3y=11, 3x-5y=-7 -> (2, 1)
      params = {
        title: `System Solution: 4x + 3y = 11 and 3x - 5y = -7`,
        eq1: `4x + 3y = 11`, eq2: `3x - 5y = -7`,
        a1: 4, b1: 3, c1: 11, a2: 3, b2: -5, c2: -7,
        solX: 2, solY: 1, systemType: 'intersecting'
      };
    } else if (subType === 5) { // Parallel / Inconsistent: 2x+6y=10, x+3y=7
      params = {
        title: `Inconsistent System: 2x + 6y = 10 and x + 3y = 7`,
        eq1: `2x + 6y = 10`, eq2: `x + 3y = 7`,
        a1: 2, b1: 6, c1: 10, a2: 1, b2: 3, c2: 7,
        systemType: 'inconsistent'
      };
    } else if (subType === 6) { // Sum/Diff numbers: x+y=64, x-y=18 -> (41, 23)
      params = {
        title: `Number System: x + y = 64 and x - y = 18`,
        eq1: `x + y = 64`, eq2: `x - y = 18`,
        a1: 1, b1: 1, c1: 64, a2: 1, b2: -1, c2: 18,
        solX: 41, solY: 23, systemType: 'intersecting'
      };
    } else if (subType === 7) { // Cafeteria: 3b+2d=175, 2b+4d=170 -> (45, 20)
      params = {
        title: `Cafeteria Prices: 3b + 2d = 175 and 2b + 4d = 170`,
        eq1: `3b + 2d = 175`, eq2: `2b + 4d = 170`,
        a1: 3, b1: 2, c1: 175, a2: 2, b2: 4, c2: 170,
        solX: 45, solY: 20, systemType: 'intersecting'
      };
    } else if (subType === 8) { // Boat/Current: b+c=18, b-c=12 -> (15, 3)
      params = {
        title: `Boat & Current Rates: b + c = 18 and b - c = 12`,
        eq1: `b + c = 18`, eq2: `b - c = 12`,
        a1: 1, b1: 1, c1: 18, a2: 1, b2: -1, c2: 12,
        solX: 15, solY: 3, systemType: 'intersecting'
      };
    } else { // Acid mixture: x+y=30, 0.2x+0.5y=12 -> (10, 20)
      params = {
        title: `Acid Mixture: x + y = 30 and 0.2x + 0.5y = 12`,
        eq1: `x + y = 30`, eq2: `0.2x + 0.5y = 12`,
        a1: 1, b1: 1, c1: 30, a2: 0.2, b2: 0.5, c2: 12,
        solX: 10, solY: 20, systemType: 'intersecting'
      };
    }

    const svg = generateLinearSystemSvg(params);
    const fileName = `g8_t134_q${qIndex + 1}.svg`;

    fs.writeFileSync(path.join(publicImagesDir, fileName), svg);
    fs.writeFileSync(path.join(rootImagesDir, fileName), svg);
  }

  console.log('✅ Created 50 Linear System SVG plot files in public/images/ and images/!');
}

if (process.argv[1] && process.argv[1].endsWith('generate_t134_svg_plots.js')) {
  saveTopic134SvgPlots();
}
