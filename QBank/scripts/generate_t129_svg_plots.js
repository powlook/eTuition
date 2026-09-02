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

export function generateCartesianSvg(type, params) {
  const width = 480;
  const height = 380;

  // Determine coordinate bounds for auto-scaling
  let allX = [0];
  let allY = [0];

  if (type === 0) { // Quadrant point
    allX.push(params.x);
    allY.push(params.y);
  } else if (type === 1 || type === 2 || type === 3 || type === 7 || type === 8 || type === 9) { // 2 points / segment / midpoint
    allX.push(params.x1, params.x2);
    allY.push(params.y1, params.y2);
    if (params.mx !== undefined) allX.push(params.mx);
    if (params.my !== undefined) allY.push(params.my);
  } else if (type === 4) { // Triangle (0,0), (a,0), (0,b)
    allX.push(0, params.a);
    allY.push(0, params.b);
  } else if (type === 5) { // Collinear points
    allX.push(params.x1, params.x2, params.x3);
    allY.push(params.y1, params.y2, params.y3);
  } else if (type === 6) { // Rectangle opposite corners
    allX.push(params.x1, params.x2);
    allY.push(params.y1, params.y2);
  }

  const minX = Math.min(...allX) - 2;
  const maxX = Math.max(...allX) + 2;
  const minY = Math.min(...allY) - 2;
  const maxY = Math.max(...allY) + 2;

  const boundX = Math.max(Math.abs(minX), Math.abs(maxX), 5);
  const boundY = Math.max(Math.abs(minY), Math.abs(maxY), 5);
  const bound = Math.max(boundX, boundY);

  const margin = 45;
  const plotWidth = width - 2 * margin;
  const plotHeight = height - 2 * margin - 20;

  const cx = margin + plotWidth / 2;
  const cy = margin + 20 + plotHeight / 2;
  const scale = Math.min(plotWidth / (2 * bound), plotHeight / (2 * bound));

  const toSvgX = (x) => cx + x * scale;
  const toSvgY = (y) => cy - y * scale;

  // Grid lines
  let gridLines = '';
  let axisTicks = '';
  for (let i = -bound; i <= bound; i++) {
    if (i === 0) continue;
    const gx = toSvgX(i);
    const gy = toSvgY(i);

    // Vertical grid
    if (gx >= margin && gx <= width - margin) {
      gridLines += `<line x1="${gx}" y1="${margin + 20}" x2="${gx}" y2="${height - margin}" stroke="rgba(148, 163, 184, 0.15)" stroke-width="1" />`;
      if (Math.abs(i) % 2 === 0 || bound <= 8) {
        axisTicks += `<text x="${gx}" y="${cy + 15}" text-anchor="middle" font-family="system-ui" font-size="10" fill="#64748b">${i}</text>`;
      }
    }
    // Horizontal grid
    if (gy >= margin + 20 && gy <= height - margin) {
      gridLines += `<line x1="${margin}" y1="${gy}" x2="${width - margin}" y2="${gy}" stroke="rgba(148, 163, 184, 0.15)" stroke-width="1" />`;
      if (Math.abs(i) % 2 === 0 || bound <= 8) {
        axisTicks += `<text x="${cx - 12}" y="${gy + 4}" text-anchor="end" font-family="system-ui" font-size="10" fill="#64748b">${i}</text>`;
      }
    }
  }

  let shapeSvg = '';

  // Type 0: Quadrant Point
  if (type === 0) {
    const px = toSvgX(params.x);
    const py = toSvgY(params.y);

    shapeSvg = `
      <!-- Projections -->
      <line x1="${px}" y1="${cy}" x2="${px}" y2="${py}" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4,4" />
      <line x1="${cx}" y1="${py}" x2="${px}" y2="${py}" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4,4" />

      <!-- Quadrant Badges -->
      <text x="${cx + plotWidth/4}" y="${cy - plotHeight/4}" text-anchor="middle" font-size="16" font-weight="bold" fill="rgba(56, 189, 248, 0.25)">QI</text>
      <text x="${cx - plotWidth/4}" y="${cy - plotHeight/4}" text-anchor="middle" font-size="16" font-weight="bold" fill="rgba(56, 189, 248, 0.25)">QII</text>
      <text x="${cx - plotWidth/4}" y="${cy + plotHeight/4}" text-anchor="middle" font-size="16" font-weight="bold" fill="rgba(56, 189, 248, 0.25)">QIII</text>
      <text x="${cx + plotWidth/4}" y="${cy + plotHeight/4}" text-anchor="middle" font-size="16" font-weight="bold" fill="rgba(56, 189, 248, 0.25)">QIV</text>

      <!-- Point P -->
      <circle cx="${px}" cy="${py}" r="6" fill="#f59e0b" stroke="#ffffff" stroke-width="2" />
      <rect x="${px + 8}" y="${py - 24}" width="70" height="22" rx="4" fill="rgba(15, 23, 42, 0.85)" stroke="#f59e0b" stroke-width="1" />
      <text x="${px + 43}" y="${py - 9}" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#f59e0b">P(${params.x}, ${params.y})</text>
    `;
  }
  // Type 1: Distance Formula
  else if (type === 1) {
    const ax = toSvgX(params.x1), ay = toSvgY(params.y1);
    const bx = toSvgX(params.x2), by = toSvgY(params.y2);
    const cxCorner = bx, cyCorner = ay;

    shapeSvg = `
      <!-- Right triangle legs for distance -->
      <line x1="${ax}" y1="${ay}" x2="${cxCorner}" y2="${cyCorner}" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4,4" />
      <line x1="${cxCorner}" y1="${cyCorner}" x2="${bx}" y2="${by}" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4,4" />
      
      <!-- Right angle symbol -->
      <rect x="${cxCorner > ax ? cxCorner - 10 : cxCorner}" y="${cyCorner > by ? cyCorner - 10 : cyCorner}" width="10" height="10" fill="none" stroke="#94a3b8" stroke-width="1" />

      <!-- Hypotenuse Segment AB -->
      <line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}" stroke="#38bdf8" stroke-width="3" />

      <!-- Point A -->
      <circle cx="${ax}" cy="${ay}" r="5" fill="#38bdf8" />
      <text x="${ax - 12}" y="${ay - 8}" font-family="sans-serif" font-size="12" font-weight="bold" fill="#38bdf8">A(${params.x1}, ${params.y1})</text>

      <!-- Point B -->
      <circle cx="${bx}" cy="${by}" r="5" fill="#38bdf8" />
      <text x="${bx + 8}" y="${by - 8}" font-family="sans-serif" font-size="12" font-weight="bold" fill="#38bdf8">B(${params.x2}, ${params.y2})</text>

      <!-- Distance Label -->
      <rect x="${(ax+bx)/2 - 35}" y="${(ay+by)/2 - 22}" width="70" height="20" rx="4" fill="rgba(15, 23, 42, 0.9)" stroke="#38bdf8" stroke-width="1" />
      <text x="${(ax+bx)/2}" y="${(ay+by)/2 - 8}" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="bold" fill="#38bdf8">d = ${params.ans}</text>
    `;
  }
  // Type 2: Midpoint Formula
  else if (type === 2) {
    const ax = toSvgX(params.x1), ay = toSvgY(params.y1);
    const bx = toSvgX(params.x2), by = toSvgY(params.y2);
    const mx = toSvgX(params.mx), my = toSvgY(params.my);

    shapeSvg = `
      <!-- Segment AB -->
      <line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}" stroke="#94a3b8" stroke-width="2.5" />

      <!-- Endpoint A -->
      <circle cx="${ax}" cy="${ay}" r="5" fill="#94a3b8" />
      <text x="${ax - 10}" y="${ay - 10}" font-family="sans-serif" font-size="12" fill="#e2e8f0">A(${params.x1}, ${params.y1})</text>

      <!-- Endpoint B -->
      <circle cx="${bx}" cy="${by}" r="5" fill="#94a3b8" />
      <text x="${bx + 8}" y="${by + 15}" font-family="sans-serif" font-size="12" fill="#e2e8f0">B(${params.x2}, ${params.y2})</text>

      <!-- Midpoint M -->
      <circle cx="${mx}" cy="${my}" r="6" fill="#f59e0b" stroke="#ffffff" stroke-width="2" />
      <rect x="${mx - 40}" y="${my - 28}" width="80" height="22" rx="4" fill="rgba(15, 23, 42, 0.9)" stroke="#f59e0b" stroke-width="1" />
      <text x="${mx}" y="${my - 13}" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="bold" fill="#f59e0b">M(${params.mx}, ${params.my})</text>
    `;
  }
  // Type 3: Missing Endpoint Q given M and P
  else if (type === 3) {
    const px = toSvgX(params.x1), py = toSvgY(params.y1);
    const mx = toSvgX(params.mx), my = toSvgY(params.my);
    const qx = toSvgX(params.x2), qy = toSvgY(params.y2);

    shapeSvg = `
      <line x1="${px}" y1="${py}" x2="${qx}" y2="${qy}" stroke="#38bdf8" stroke-width="2.5" stroke-dasharray="6,4" />

      <!-- P -->
      <circle cx="${px}" cy="${py}" r="5" fill="#38bdf8" />
      <text x="${px - 10}" y="${py - 10}" font-family="sans-serif" font-size="12" fill="#38bdf8">P(${params.x1}, ${params.y1})</text>

      <!-- Midpoint M -->
      <circle cx="${mx}" cy="${my}" r="5" fill="#f59e0b" />
      <text x="${mx + 8}" y="${my - 8}" font-family="sans-serif" font-size="12" font-weight="bold" fill="#f59e0b">M(${params.mx}, ${params.my})</text>

      <!-- Missing Endpoint Q -->
      <circle cx="${qx}" cy="${qy}" r="6" fill="#10b981" stroke="#ffffff" stroke-width="2" />
      <rect x="${qx - 40}" y="${qy + 10}" width="80" height="22" rx="4" fill="rgba(15, 23, 42, 0.9)" stroke="#10b981" stroke-width="1" />
      <text x="${qx}" y="${qy + 25}" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="bold" fill="#10b981">Q(${params.x2}, ${params.y2})</text>
    `;
  }
  // Type 4: Right Triangle (0,0), (a,0), (0,b)
  else if (type === 4) {
    const ax = toSvgX(0), ay = toSvgY(0);
    const bx = toSvgX(params.a), by = toSvgY(0);
    const cx = toSvgX(0), cy = toSvgY(params.b);

    shapeSvg = `
      <!-- Filled Polygon -->
      <polygon points="${ax},${ay} ${bx},${by} ${cx},${cy}" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" stroke-width="3" />

      <!-- Vertices -->
      <circle cx="${ax}" cy="${ay}" r="5" fill="#38bdf8" />
      <text x="${ax - 15}" y="${ay + 15}" font-family="sans-serif" font-size="12" font-weight="bold" fill="#38bdf8">A(0,0)</text>

      <circle cx="${bx}" cy="${by}" r="5" fill="#38bdf8" />
      <text x="${bx + 8}" y="${by + 15}" font-family="sans-serif" font-size="12" font-weight="bold" fill="#38bdf8">B(${params.a},0)</text>

      <circle cx="${cx}" cy="${cy}" r="5" fill="#38bdf8" />
      <text x="${cx - 20}" y="${cy - 8}" font-family="sans-serif" font-size="12" font-weight="bold" fill="#38bdf8">C(0,${params.b})</text>

      <!-- Side Labels -->
      <text x="${(ax+bx)/2}" y="${ay + 18}" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#e2e8f0">a = ${params.a}</text>
      <text x="${ax - 18}" y="${(ay+cy)/2}" text-anchor="end" font-family="sans-serif" font-size="11" fill="#e2e8f0">b = ${params.b}</text>
    `;
  }
  // Type 5: Collinear Points
  else if (type === 5) {
    const ax = toSvgX(params.x1), ay = toSvgY(params.y1);
    const bx = toSvgX(params.x2), by = toSvgY(params.y2);
    const cx = toSvgX(params.x3), cy = toSvgY(params.y3);

    shapeSvg = `
      <line x1="${ax - 20}" y1="${ay + (ay-cy)/(ax-cx)*20}" x2="${cx + 20}" y2="${cy - (ay-cy)/(ax-cx)*20}" stroke="#38bdf8" stroke-width="2.5" />

      <circle cx="${ax}" cy="${ay}" r="5" fill="#f59e0b" />
      <text x="${ax - 10}" y="${ay - 10}" font-family="sans-serif" font-size="11" fill="#f59e0b">A(${params.x1},${params.y1})</text>

      <circle cx="${bx}" cy="${by}" r="5" fill="#f59e0b" />
      <text x="${bx - 10}" y="${by - 10}" font-family="sans-serif" font-size="11" fill="#f59e0b">B(${params.x2},${params.y2})</text>

      <circle cx="${cx}" cy="${cy}" r="5" fill="#f59e0b" />
      <text x="${cx + 8}" y="${cy + 12}" font-family="sans-serif" font-size="11" fill="#f59e0b">C(${params.x3},${params.y3})</text>
    `;
  }
  // Type 6: Rectangle Area Opposite Vertices
  else if (type === 6) {
    const xMin = Math.min(params.x1, params.x2);
    const xMax = Math.max(params.x1, params.x2);
    const yMin = Math.min(params.y1, params.y2);
    const yMax = Math.max(params.y1, params.y2);

    const rx = toSvgX(xMin);
    const ry = toSvgY(yMax);
    const rw = (xMax - xMin) * scale;
    const rh = (yMax - yMin) * scale;

    shapeSvg = `
      <rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" stroke-width="2.5" />
      
      <circle cx="${toSvgX(params.x1)}" cy="${toSvgY(params.y1)}" r="5" fill="#f59e0b" />
      <text x="${toSvgX(params.x1) - 15}" y="${toSvgY(params.y1) + 15}" font-family="sans-serif" font-size="11" fill="#f59e0b">(${params.x1}, ${params.y1})</text>

      <circle cx="${toSvgX(params.x2)}" cy="${toSvgY(params.y2)}" r="5" fill="#f59e0b" />
      <text x="${toSvgX(params.x2) + 8}" y="${toSvgY(params.y2) - 8}" font-family="sans-serif" font-size="11" fill="#f59e0b">(${params.x2}, ${params.y2})</text>

      <text x="${rx + rw/2}" y="${ry + rh/2}" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="bold" fill="#38bdf8">Area = ${params.w * params.h} sq units</text>
    `;
  }
  // Type 7: Horizontal Distance
  else if (type === 7) {
    const px = toSvgX(params.x1), py = toSvgY(params.y1);
    const qx = toSvgX(params.x2), qy = toSvgY(params.y2);

    shapeSvg = `
      <line x1="${px}" y1="${py}" x2="${qx}" y2="${qy}" stroke="#38bdf8" stroke-width="3" />

      <circle cx="${px}" cy="${py}" r="5" fill="#38bdf8" />
      <text x="${px - 15}" y="${py - 10}" font-family="sans-serif" font-size="12" fill="#38bdf8">P(${params.x1}, ${params.y1})</text>

      <circle cx="${qx}" cy="${qy}" r="5" fill="#38bdf8" />
      <text x="${qx + 8}" y="${qy - 10}" font-family="sans-serif" font-size="12" fill="#38bdf8">Q(${params.x2}, ${params.y2})</text>

      <text x="${(px+qx)/2}" y="${py + 20}" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#f59e0b">Distance = ${params.dist} units</text>
    `;
  }
  // Type 8: Grid Map Distance
  else if (type === 8) {
    const hx = toSvgX(params.x1), hy = toSvgY(params.y1);
    const sx = toSvgX(params.x2), sy = toSvgY(params.y2);

    shapeSvg = `
      <line x1="${hx}" y1="${hy}" x2="${sx}" y2="${sy}" stroke="#10b981" stroke-width="3" stroke-dasharray="6,4" />

      <!-- House -->
      <circle cx="${hx}" cy="${hy}" r="7" fill="#f59e0b" />
      <text x="${hx - 15}" y="${hy + 20}" font-family="sans-serif" font-size="12" font-weight="bold" fill="#f59e0b">House (${params.x1}, ${params.y1})</text>

      <!-- School -->
      <circle cx="${sx}" cy="${sy}" r="7" fill="#10b981" />
      <text x="${sx + 10}" y="${sy - 10}" font-family="sans-serif" font-size="12" font-weight="bold" fill="#10b981">School (${params.x2}, ${params.y2})</text>

      <rect x="${(hx+sx)/2 - 35}" y="${(hy+sy)/2 - 12}" width="70" height="22" rx="4" fill="rgba(15, 23, 42, 0.9)" stroke="#10b981" stroke-width="1" />
      <text x="${(hx+sx)/2}" y="${(hy+sy)/2 + 3}" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="bold" fill="#10b981">d = ${params.distKm} km</text>
    `;
  }
  // Type 9: Circle Center from Diameter
  else if (type === 9) {
    const ax = toSvgX(params.x1), ay = toSvgY(params.y1);
    const bx = toSvgX(params.x2), by = toSvgY(params.y2);
    const cx = toSvgX(params.mx), cy = toSvgY(params.my);

    const radPx = Math.sqrt((ax - cx)**2 + (ay - cy)**2);

    shapeSvg = `
      <!-- Circle -->
      <circle cx="${cx}" cy="${cy}" r="${radPx}" fill="rgba(56, 189, 248, 0.1)" stroke="#38bdf8" stroke-width="2" />

      <!-- Diameter AB -->
      <line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}" stroke="#94a3b8" stroke-width="2" />

      <!-- A & B -->
      <circle cx="${ax}" cy="${ay}" r="5" fill="#38bdf8" />
      <text x="${ax - 15}" y="${ay + 15}" font-family="sans-serif" font-size="11" fill="#38bdf8">A(${params.x1},${params.y1})</text>

      <circle cx="${bx}" cy="${by}" r="5" fill="#38bdf8" />
      <text x="${bx + 8}" y="${by - 8}" font-family="sans-serif" font-size="11" fill="#38bdf8">B(${params.x2},${params.y2})</text>

      <!-- Center -->
      <circle cx="${cx}" cy="${cy}" r="6" fill="#f59e0b" stroke="#ffffff" stroke-width="2" />
      <text x="${cx + 8}" y="${cy + 15}" font-family="sans-serif" font-size="12" font-weight="bold" fill="#f59e0b">Center(${params.mx}, ${params.my})</text>
    `;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <rect width="100%" height="100%" fill="#0f172a" rx="12" />
  
  <!-- Header Title -->
  <rect x="16" y="12" width="${width - 32}" height="28" rx="6" fill="rgba(56, 189, 248, 0.12)" stroke="rgba(56, 189, 248, 0.3)" />
  <text x="${width / 2}" y="31" text-anchor="middle" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#38bdf8">
    ${params.title || 'Cartesian Coordinate Plane Plot'}
  </text>

  <!-- Grid Lines -->
  ${gridLines}

  <!-- Axes -->
  <!-- X-Axis -->
  <line x1="${margin}" y1="${cy}" x2="${width - margin}" y2="${cy}" stroke="#e2e8f0" stroke-width="2" />
  <polygon points="${width - margin},${cy} ${width - margin - 8},${cy - 4} ${width - margin - 8},${cy + 4}" fill="#e2e8f0" />
  <text x="${width - margin + 12}" y="${cy + 4}" font-family="system-ui" font-size="12" font-weight="bold" fill="#e2e8f0">X</text>

  <!-- Y-Axis -->
  <line x1="${cx}" y1="${height - margin}" x2="${cx}" y2="${margin + 20}" stroke="#e2e8f0" stroke-width="2" />
  <polygon points="${cx},${margin + 20} ${cx - 4},${margin + 28} ${cx + 4},${margin + 28}" fill="#e2e8f0" />
  <text x="${cx}" y="${margin + 12}" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="bold" fill="#e2e8f0">Y</text>

  <!-- Axis Ticks & Numbers -->
  ${axisTicks}

  <!-- Origin (0,0) label -->
  <text x="${cx - 8}" y="${cy + 14}" font-family="system-ui" font-size="10" fill="#94a3b8">0</text>

  <!-- Dynamic Shape Overlay -->
  ${shapeSvg}
</svg>`;
}

export function saveTopic129SvgPlots() {
  console.log('Generating 50 Cartesian SVG plot files for Topic 129...');
  for (let qIndex = 0; qIndex < 50; qIndex++) {
    const subType = qIndex % 10;
    let params = {};
    let title = '';

    if (subType === 0) {
      const x = [4, -5, -3, 6, -7, 5, -4, 3, -6, 2][qIndex % 10];
      const y = [5, 4, -6, -3, 2, -7, -5, 6, 8, -4][qIndex % 10];
      params = { x, y, title: `Point P(${x}, ${y}) Quadrant Location` };
    } else if (subType === 1) {
      const dx = [6, 4, 3, 5, 8][qIndex % 5];
      const dy = [8, 3, 4, 12, 6][qIndex % 5];
      const x1 = -2, y1 = -3;
      const x2 = x1 + dx, y2 = y1 + dy;
      const distSq = dx*dx + dy*dy;
      const isPerfect = Number.isInteger(Math.sqrt(distSq));
      const ans = isPerfect ? `${Math.sqrt(distSq)}` : `\\sqrt{${distSq}}`;
      params = { x1, y1, x2, y2, ans, title: `Distance between A(${x1},${y1}) and B(${x2},${y2})` };
    } else if (subType === 2) {
      const x1 = [-6, -4, -2, -8, 2][qIndex % 5];
      const y1 = [4, 6, -4, 2, -6][qIndex % 5];
      const x2 = [2, 4, 6, 4, 8][qIndex % 5];
      const y2 = [-8, -2, 8, -6, 4][qIndex % 5];
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      params = { x1, y1, x2, y2, mx, my, title: `Segment AB Midpoint M(${mx}, ${my})` };
    } else if (subType === 3) {
      const mx = [3, -2, 1, 4, -1][qIndex % 5];
      const my = [1, 3, -3, 2, -4][qIndex % 5];
      const x1 = [-1, -6, -3, 0, -5][qIndex % 5];
      const y1 = [5, 1, -1, 6, -2][qIndex % 5];
      const x2 = 2 * mx - x1;
      const y2 = 2 * my - y1;
      params = { x1, y1, x2, y2, mx, my, title: `Segment PQ Endpoint Q(${x2}, ${y2})` };
    } else if (subType === 4) {
      const a = [6, 8, 9, 12, 15][qIndex % 5];
      const b = [8, 6, 12, 16, 20][qIndex % 5];
      params = { a, b, title: `Right Triangle ΔABC on Cartesian Plane` };
    } else if (subType === 5) {
      const m = [2, 3, 2, 4, 1][qIndex % 5];
      const b = [1, 2, 3, 1, 2][qIndex % 5];
      const x1 = 1, y1 = m * 1 + b;
      const x2 = 3, y2 = m * 3 + b;
      const x3 = 5, y3 = m * 5 + b;
      params = { x1, y1, x2, y2, x3, y3, title: `Collinear Points A, B, C (Slope m = ${m})` };
    } else if (subType === 6) {
      const x1 = [-2, -4, -3, -5, -1][qIndex % 5];
      const y1 = [1, 2, 1, 2, 1][qIndex % 5];
      const x2 = [5, 4, 6, 3, 7][qIndex % 5];
      const y2 = [6, 7, 5, 8, 6][qIndex % 5];
      params = { x1, y1, x2, y2, w: x2 - x1, h: y2 - y1, title: `Rectangle Area on Coordinate Plane` };
    } else if (subType === 7) {
      const x1 = [-8, -6, -7, -9, -5][qIndex % 5];
      const yVal = [3, -2, 4, -4, 2][qIndex % 5];
      const x2 = [4, 6, 5, 3, 7][qIndex % 5];
      params = { x1, y1: yVal, x2, y2: yVal, dist: x2 - x1, title: `Horizontal Distance Segment PQ` };
    } else if (subType === 8) {
      const x1 = 1, y1 = 2;
      const x2 = 7, y2 = 10;
      params = { x1, y1, x2, y2, distKm: 10, title: `City Grid Map Distance` };
    } else if (subType === 9) {
      const x1 = -6, y1 = -4;
      const x2 = 6, y2 = 4;
      const mx = 0, my = 0;
      params = { x1, y1, x2, y2, mx, my, title: `Circle Diameter & Center` };
    }

    const svg = generateCartesianSvg(subType, params);
    const fileName = `g8_t129_q${qIndex + 1}.svg`;

    fs.writeFileSync(path.join(publicImagesDir, fileName), svg);
    fs.writeFileSync(path.join(rootImagesDir, fileName), svg);
  }

  console.log('✅ Created 50 Cartesian SVG plot files in public/images/ and images/!');
}

if (process.argv[1] && process.argv[1].endsWith('generate_t129_svg_plots.js')) {
  saveTopic129SvgPlots();
}
