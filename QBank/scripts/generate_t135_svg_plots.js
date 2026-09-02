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

export function generateLinearInequalitySvg(params) {
  const width = 480;
  const height = 380;
  const margin = 45;
  const plotWidth = width - 2 * margin;
  const plotHeight = height - 2 * margin - 20;

  const { title, inequalityText, bounds, lines, regionType, testPoints } = params;

  const bound = bounds || 10;
  const cx = margin + plotWidth / 2;
  const cy = margin + 20 + plotHeight / 2;
  const scale = Math.min(plotWidth / (2 * bound), plotHeight / (2 * bound));

  const toSvgX = (x) => cx + x * scale;
  const toSvgY = (y) => cy - y * scale;

  // Grid lines
  let gridLines = '';
  let axisTicks = '';
  const step = bound > 15 ? 5 : (bound > 8 ? 2 : 1);

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

  // Draw boundary lines & shaded half-plane regions
  let shadedPath = '';
  let boundaryLinesSvg = '';

  if (lines && lines.length > 0) {
    lines.forEach((lineObj, idx) => {
      const { a, b, c, isStrict, color, label } = lineObj;
      const strokeColor = color || (idx === 0 ? '#38bdf8' : '#f59e0b');
      const dashArray = isStrict ? 'stroke-dasharray="6,4"' : '';

      // Find boundary line endpoints
      let xMin = -bound * 1.5, xMax = bound * 1.5;
      let yMin = -bound * 1.5, yMax = bound * 1.5;
      let sx1, sy1, sx2, sy2;

      if (b !== 0) {
        sx1 = toSvgX(xMin);
        sy1 = toSvgY((c - a * xMin) / b);
        sx2 = toSvgX(xMax);
        sy2 = toSvgY((c - a * xMax) / b);
      } else {
        const xVal = c / a;
        sx1 = toSvgX(xVal);
        sy1 = toSvgY(yMin);
        sx2 = toSvgX(xVal);
        sy2 = toSvgY(yMax);
      }

      boundaryLinesSvg += `
        <line x1="${sx1}" y1="${sy1}" x2="${sx2}" y2="${sy2}" stroke="${strokeColor}" stroke-width="2.5" ${dashArray} />
      `;
    });
  }

  // Render shaded half-plane / feasible region polygon
  if (regionType === 'halfplane_above_left' || regionType === 'halfplane_below_right' || regionType === 'custom_polygon') {
    if (params.polygonPoints) {
      const polySvgPoints = params.polygonPoints.map(pt => `${toSvgX(pt[0])},${toSvgY(pt[1])}`).join(' ');
      shadedPath = `<polygon points="${polySvgPoints}" fill="rgba(16, 185, 129, 0.25)" stroke="#10b981" stroke-width="1.5" stroke-dasharray="4,4" />`;
    } else if (lines && lines.length === 1) {
      // General half-plane approximation for single line
      const { a, b, c, shadeDirection } = lines[0];
      const p1 = [ -bound, shadeDirection === 'above' ? bound : -bound ];
      const p2 = [ bound, shadeDirection === 'above' ? bound : -bound ];
      const p3 = [ bound, (c - a * bound) / (b || 1) ];
      const p4 = [ -bound, (c - a * (-bound)) / (b || 1) ];

      const polyPoints = [p1, p4, p3, p2].map(pt => `${toSvgX(pt[0])},${toSvgY(pt[1])}`).join(' ');
      shadedPath = `<polygon points="${polyPoints}" fill="rgba(56, 189, 248, 0.22)" stroke="rgba(56, 189, 248, 0.4)" stroke-width="1" />`;
    }
  }

  // Render test points
  let testPointsSvg = '';
  if (testPoints && testPoints.length > 0) {
    testPointsSvg = testPoints.map(pt => {
      const px = toSvgX(pt.x);
      const py = toSvgY(pt.y);
      const color = pt.valid ? '#10b981' : '#ef4444';
      const symbol = pt.valid ? '✓' : '✕';
      return `
        <circle cx="${px}" cy="${py}" r="5" fill="${color}" stroke="#ffffff" stroke-width="1.5" />
        <rect x="${px + 8}" y="${py - 16}" width="70" height="20" rx="4" fill="rgba(15, 23, 42, 0.9)" stroke="${color}" stroke-width="1" />
        <text x="${px + 43}" y="${py - 2}" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="bold" fill="${color}">(${pt.x}, ${pt.y}) ${symbol}</text>
      `;
    }).join('');
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <rect width="100%" height="100%" fill="#0f172a" rx="12" />

  <!-- Header Title -->
  <rect x="16" y="12" width="${width - 32}" height="28" rx="6" fill="rgba(56, 189, 248, 0.12)" stroke="rgba(56, 189, 248, 0.3)" />
  <text x="${width / 2}" y="31" text-anchor="middle" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#38bdf8">
    ${title || 'Linear Inequality Graph'}
  </text>

  <!-- Subtitle / Inequality Label -->
  <text x="${width - 24}" y="56" text-anchor="end" font-family="sans-serif" font-size="11" font-weight="bold" fill="#f59e0b">
    ${inequalityText || ''}
  </text>

  <!-- Grid Lines -->
  ${gridLines}

  <!-- Shaded Feasible Region -->
  ${shadedPath}

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

  <!-- Boundary Lines -->
  ${boundaryLinesSvg}

  <!-- Test Points -->
  ${testPointsSvg}
</svg>`;
}

export function saveTopic135SvgPlots() {
  console.log('Generating 50 Linear Inequality SVG plot files for Topic 135...');
  for (let qIndex = 0; qIndex < 50; qIndex++) {
    const subType = qIndex % 10;
    let params = {};

    if (subType === 0) { // Test points for 3x - 2y <= 6
      params = {
        title: `Test Points for 3x - 2y ≤ 6`,
        inequalityText: `3x - 2y ≤ 6`,
        bounds: 8,
        regionType: 'halfplane_above_left',
        lines: [{ a: 3, b: -2, c: 6, isStrict: false, color: '#38bdf8', shadeDirection: 'above' }],
        testPoints: [
          { x: 0, y: 0, valid: true },
          { x: 2, y: -3, valid: false },
          { x: -1, y: 5, valid: true }
        ]
      };
    } else if (subType === 1) { // 2x + y > 4 (dashed line)
      params = {
        title: `Strict Inequality: 2x + y > 4`,
        inequalityText: `2x + y > 4 (Dashed Line)`,
        bounds: 8,
        regionType: 'halfplane_above_left',
        lines: [{ a: 2, b: 1, c: 4, isStrict: true, color: '#38bdf8', shadeDirection: 'above' }],
        testPoints: [{ x: 3, y: 3, valid: true }, { x: 0, y: 0, valid: false }]
      };
    } else if (subType === 2) { // 3x - 4y <= 12 (solid line)
      params = {
        title: `Non-Strict Inequality: 3x - 4y ≤ 12`,
        inequalityText: `3x - 4y ≤ 12 (Solid Line)`,
        bounds: 8,
        regionType: 'halfplane_above_left',
        lines: [{ a: 3, b: -4, c: 12, isStrict: false, color: '#38bdf8', shadeDirection: 'above' }],
        testPoints: [{ x: 0, y: 0, valid: true }]
      };
    } else if (subType === 3) { // Graph identification 2x - y >= -3
      params = {
        title: `Boundary Line & Region: 2x - y ≥ -3`,
        inequalityText: `2x - y ≥ -3`,
        bounds: 8,
        regionType: 'halfplane_below_right',
        lines: [{ a: 2, b: -1, c: -3, isStrict: false, color: '#38bdf8', shadeDirection: 'below' }],
        testPoints: [{ x: 0, y: 0, valid: true }]
      };
    } else if (subType === 4) { // System {x + y <= 5, y > x - 2}
      params = {
        title: `System Feasible Region: x+y ≤ 5 and y > x-2`,
        inequalityText: `x + y ≤ 5, y > x - 2`,
        bounds: 8,
        regionType: 'custom_polygon',
        polygonPoints: [[-8, -8], [-8, 5], [3.5, 1.5], [-6, -8]],
        lines: [
          { a: 1, b: 1, c: 5, isStrict: false, color: '#38bdf8' },
          { a: -1, b: 1, c: -2, isStrict: true, color: '#f59e0b' }
        ]
      };
    } else if (subType === 5) { // System {2x - y >= 1, x + 2y < 6} with point (2,1)
      params = {
        title: `Feasible Region: 2x - y ≥ 1 and x + 2y < 6`,
        inequalityText: `2x - y ≥ 1, x + 2y < 6`,
        bounds: 8,
        regionType: 'custom_polygon',
        polygonPoints: [[1.6, 2.2], [8, -8], [0.5, -8]],
        lines: [
          { a: 2, b: -1, c: 1, isStrict: false, color: '#38bdf8' },
          { a: 1, b: 2, c: 6, isStrict: true, color: '#f59e0b' }
        ],
        testPoints: [{ x: 2, y: 1, valid: true }]
      };
    } else if (subType === 6) { // Baker earnings 15x + 10y >= 1200
      params = {
        title: `Baker Earnings Goal: 15x + 10y ≥ 1200`,
        inequalityText: `15x + 10y ≥ 1200`,
        bounds: 120,
        regionType: 'halfplane_above_left',
        lines: [{ a: 15, b: 10, c: 1200, isStrict: false, color: '#38bdf8', shadeDirection: 'above' }]
      };
    } else if (subType === 7) { // Baker evaluation (40, 50)
      params = {
        title: `Baker Goal Evaluation (40, 50)`,
        inequalityText: `15(40) + 10(50) = 1100 < 1200`,
        bounds: 120,
        regionType: 'halfplane_above_left',
        lines: [{ a: 15, b: 10, c: 1200, isStrict: false, color: '#38bdf8', shadeDirection: 'above' }],
        testPoints: [{ x: 40, y: 50, valid: false }]
      };
    } else if (subType === 8) { // Farmer land allocation {x + y <= 60, x >= 15}
      params = {
        title: `Land Allocation: x + y ≤ 60 and x ≥ 15`,
        inequalityText: `x + y ≤ 60, x ≥ 15 (Q1)`,
        bounds: 70,
        regionType: 'custom_polygon',
        polygonPoints: [[15, 0], [15, 45], [60, 0]],
        lines: [
          { a: 1, b: 1, c: 60, isStrict: false, color: '#38bdf8' },
          { a: 1, b: 0, c: 15, isStrict: false, color: '#f59e0b' }
        ]
      };
    } else { // Work schedule {x + y <= 20, 80x + 60y >= 1400}
      params = {
        title: `Work Schedule Feasible Region`,
        inequalityText: `x + y ≤ 20, 80x + 60y ≥ 1400`,
        bounds: 25,
        regionType: 'custom_polygon',
        polygonPoints: [[10, 10], [17.5, 0], [20, 0]],
        lines: [
          { a: 1, b: 1, c: 20, isStrict: false, color: '#38bdf8' },
          { a: 80, b: 60, c: 1400, isStrict: false, color: '#f59e0b' }
        ]
      };
    }

    const svg = generateLinearInequalitySvg(params);
    const fileName = `g8_t135_q${qIndex + 1}.svg`;

    fs.writeFileSync(path.join(publicImagesDir, fileName), svg);
    fs.writeFileSync(path.join(rootImagesDir, fileName), svg);
  }

  console.log('✅ Created 50 Linear Inequality SVG plot files in public/images/ and images/!');
}

if (process.argv[1] && process.argv[1].endsWith('generate_t135_svg_plots.js')) {
  saveTopic135SvgPlots();
}
