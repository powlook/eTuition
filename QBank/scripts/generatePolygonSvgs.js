import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesDir = path.join(__dirname, '..', 'public', 'images');

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

function generateRegularPolygonSvg(n, name, title) {
  const width = 360;
  const height = 320;
  const cx = width / 2;
  const cy = height / 2 + 10;
  const r = 110;

  const points = [];
  for (let i = 0; i < n; i++) {
    // Start top angle: -pi/2
    const angle = -Math.PI / 2 + (2 * Math.PI * i) / n;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    points.push({ x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) });
  }

  const pointsString = points.map(p => `${p.x},${p.y}`).join(' ');

  // Vertex labels (A, B, C...)
  const labels = points.map((p, idx) => {
    const labelAngle = -Math.PI / 2 + (2 * Math.PI * idx) / n;
    const lx = cx + (r + 22) * Math.cos(labelAngle);
    const ly = cy + (r + 22) * Math.sin(labelAngle) + 4;
    const letter = String.fromCharCode(65 + (idx % 26));
    return `<text x="${lx.toFixed(2)}" y="${ly.toFixed(2)}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" fill="#38bdf8">${letter}</text>`;
  }).join('\n    ');

  // Vertices dots
  const dots = points.map(p => `<circle cx="${p.x}" cy="${p.y}" r="4" fill="#38bdf8" />`).join('\n    ');

  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <rect width="100%" height="100%" fill="#0f172a" rx="12" />
  <!-- Title Badge -->
  <rect x="16" y="16" width="${width - 32}" height="32" rx="6" fill="rgba(56, 189, 248, 0.12)" stroke="rgba(56, 189, 248, 0.3)" />
  <text x="${width / 2}" y="37" text-anchor="middle" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#38bdf8">
    ${title} (n = ${n} Sides)
  </text>
  
  <!-- Polygon Outline -->
  <polygon points="${pointsString}" fill="rgba(56, 189, 248, 0.08)" stroke="#38bdf8" stroke-width="3" stroke-linejoin="round" />
  
  <!-- Vertices and Labels -->
  ${dots}
  ${labels}
</svg>`;

  const filepath = path.join(imagesDir, `${name}.svg`);
  fs.writeFileSync(filepath, svgContent);
  console.log(`Generated: ${name}.svg`);
}

function generateIrregularPolygonSvg(name, title, points, n) {
  const width = 360;
  const height = 320;

  const pointsString = points.map(p => `${p.x},${p.y}`).join(' ');

  const labels = points.map((p, idx) => {
    const letter = String.fromCharCode(65 + (idx % 26));
    const offsetX = p.x > 180 ? 16 : -16;
    const offsetY = p.y > 160 ? 16 : -16;
    return `<text x="${p.x + offsetX}" y="${p.y + offsetY}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" fill="#f59e0b">${letter}</text>`;
  }).join('\n    ');

  const dots = points.map(p => `<circle cx="${p.x}" cy="${p.y}" r="4" fill="#f59e0b" />`).join('\n    ');

  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <rect width="100%" height="100%" fill="#0f172a" rx="12" />
  <!-- Title Badge -->
  <rect x="16" y="16" width="${width - 32}" height="32" rx="6" fill="rgba(245, 158, 11, 0.12)" stroke="rgba(245, 158, 11, 0.3)" />
  <text x="${width / 2}" y="37" text-anchor="middle" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#f59e0b">
    ${title} (${n} Unequal Sides)
  </text>
  
  <!-- Polygon Outline -->
  <polygon points="${pointsString}" fill="rgba(245, 158, 11, 0.08)" stroke="#f59e0b" stroke-width="3" stroke-linejoin="round" />
  
  <!-- Vertices and Labels -->
  ${dots}
  ${labels}
</svg>`;

  const filepath = path.join(imagesDir, `${name}.svg`);
  fs.writeFileSync(filepath, svgContent);
  console.log(`Generated: ${name}.svg`);
}

// Generate Regular Polygons
generateRegularPolygonSvg(3, 'polygon_3_gon', 'Regular Triangle');
generateRegularPolygonSvg(4, 'polygon_4_gon', 'Regular Quadrilateral (Square)');
generateRegularPolygonSvg(5, 'polygon_5_gon', 'Regular Pentagon');
generateRegularPolygonSvg(6, 'polygon_6_gon', 'Regular Hexagon');
generateRegularPolygonSvg(7, 'polygon_7_gon', 'Regular Heptagon');
generateRegularPolygonSvg(8, 'polygon_8_gon', 'Regular Octagon');
generateRegularPolygonSvg(9, 'polygon_9_gon', 'Regular Nonagon');
generateRegularPolygonSvg(10, 'polygon_10_gon', 'Regular Decagon');
generateRegularPolygonSvg(12, 'polygon_12_gon', 'Regular Dodecagon');

// Generate Irregular Polygons
generateIrregularPolygonSvg('polygon_irregular_4_gon', 'Irregular Quadrilateral', [
  { x: 70, y: 90 },
  { x: 300, y: 70 },
  { x: 260, y: 270 },
  { x: 50, y: 220 }
], 4);

generateIrregularPolygonSvg('polygon_irregular_5_gon', 'Irregular Pentagon', [
  { x: 180, y: 65 },
  { x: 320, y: 110 },
  { x: 270, y: 270 },
  { x: 80, y: 250 },
  { x: 50, y: 140 }
], 5);

generateIrregularPolygonSvg('polygon_irregular_6_gon', 'Irregular Hexagon', [
  { x: 140, y: 60 },
  { x: 280, y: 75 },
  { x: 330, y: 180 },
  { x: 250, y: 280 },
  { x: 100, y: 260 },
  { x: 45, y: 160 }
], 6);

console.log('All polygon SVG diagrams created successfully!');
