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

export function generateTopic136Svg(subType, params) {
  const width = 480;
  const height = 380;
  const title = params.title || 'Volume & 3D Geometry Diagram';

  let bodySvg = '';

  if (subType === 0) { // Triangular Pyramid
    const a = params.a || 6, b = params.b || 8, h = params.h || 15;
    bodySvg = `
      <!-- Base right triangle -->
      <polygon points="140,270 240,290 200,220" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" stroke-width="2" />
      <line x1="140" y1="270" x2="200" y2="220" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4,4" />
      <!-- Right angle marker -->
      <path d="M 150 265 L 158 272 L 148 277" fill="none" stroke="#f59e0b" stroke-width="1.5" />
      <!-- Apex -->
      <circle cx="210" cy="90" r="4" fill="#f59e0b" />
      <!-- Edges to Apex -->
      <line x1="210" y1="90" x2="140" y2="270" stroke="#38bdf8" stroke-width="2.5" />
      <line x1="210" y1="90" x2="240" y2="290" stroke="#38bdf8" stroke-width="2.5" />
      <line x1="210" y1="90" x2="200" y2="220" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4,4" />
      <!-- Altitude -->
      <line x1="210" y1="90" x2="210" y2="260" stroke="#10b981" stroke-width="2" stroke-dasharray="4,4" />
      <!-- Labels -->
      <text x="180" y="295" font-family="sans-serif" font-size="12" fill="#e2e8f0" font-weight="bold">a = ${a} cm</text>
      <text x="155" y="240" font-family="sans-serif" font-size="12" fill="#e2e8f0" font-weight="bold">b = ${b} cm</text>
      <text x="218" y="175" font-family="sans-serif" font-size="12" fill="#10b981" font-weight="bold">h = ${h} cm</text>
      <text x="210" y="78" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#f59e0b" font-weight="bold">Apex</text>
    `;
  } else if (subType === 1) { // Hexagonal Pyramid
    const area = params.area || 42, h = params.h || 10;
    bodySvg = `
      <!-- Regular Hexagon Base Wireframe -->
      <polygon points="170,240 220,230 270,250 260,280 210,290 160,270" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" stroke-width="2" />
      <!-- Apex -->
      <circle cx="215" cy="95" r="4" fill="#f59e0b" />
      <!-- Edges -->
      <line x1="215" y1="95" x2="170" y2="240" stroke="#38bdf8" stroke-width="2" />
      <line x1="215" y1="95" x2="220" y2="230" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4,4" />
      <line x1="215" y1="95" x2="270" y2="250" stroke="#38bdf8" stroke-width="2" />
      <line x1="215" y1="95" x2="260" y2="280" stroke="#38bdf8" stroke-width="2" />
      <line x1="215" y1="95" x2="210" y2="290" stroke="#38bdf8" stroke-width="2" />
      <line x1="215" y1="95" x2="160" y2="270" stroke="#38bdf8" stroke-width="2" />
      <!-- Height -->
      <line x1="215" y1="95" x2="215" y2="260" stroke="#10b981" stroke-width="2" stroke-dasharray="4,4" />
      <!-- Labels -->
      <text x="223" y="180" font-family="sans-serif" font-size="12" fill="#10b981" font-weight="bold">h = ${h} cm</text>
      <text x="215" y="312" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#38bdf8" font-weight="bold">Hexagonal Base Area = ${area} cm²</text>
    `;
  } else if (subType === 2) { // Solid Cone (radius & height)
    const r = params.r || 5, h = params.h || 12;
    bodySvg = `
      <!-- Base Ellipse -->
      <ellipse cx="240" cy="270" rx="100" ry="30" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" stroke-width="2" />
      <!-- Sides -->
      <line x1="140" y1="270" x2="240" y2="90" stroke="#38bdf8" stroke-width="2.5" />
      <line x1="340" y1="270" x2="240" y2="90" stroke="#38bdf8" stroke-width="2.5" />
      <!-- Radius & Height -->
      <line x1="240" y1="270" x2="340" y2="270" stroke="#f59e0b" stroke-width="2" />
      <line x1="240" y1="90" x2="240" y2="270" stroke="#10b981" stroke-width="2" stroke-dasharray="4,4" />
      <!-- Labels -->
      <text x="290" y="262" font-family="sans-serif" font-size="12" fill="#f59e0b" font-weight="bold">r = ${r} cm</text>
      <text x="248" y="180" font-family="sans-serif" font-size="12" fill="#10b981" font-weight="bold">h = ${h} cm</text>
    `;
  } else if (subType === 3) { // Cone with slant height
    const d = params.d || 14, l = params.l || 25, r = d / 2, h = params.h || 24;
    bodySvg = `
      <!-- Base Ellipse -->
      <ellipse cx="240" cy="270" rx="110" ry="32" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" stroke-width="2" />
      <!-- Slant side -->
      <line x1="130" y1="270" x2="240" y2="80" stroke="#38bdf8" stroke-width="2.5" />
      <line x1="350" y1="270" x2="240" y2="80" stroke="#f59e0b" stroke-width="2.5" />
      <!-- Radius & Height -->
      <line x1="240" y1="270" x2="350" y2="270" stroke="#38bdf8" stroke-width="2" />
      <line x1="240" y1="80" x2="240" y2="270" stroke="#10b981" stroke-width="2" stroke-dasharray="4,4" />
      <!-- Labels -->
      <text x="302" y="170" font-family="sans-serif" font-size="12" fill="#f59e0b" font-weight="bold">Slant l = ${l} cm</text>
      <text x="285" y="292" font-family="sans-serif" font-size="12" fill="#38bdf8" font-weight="bold">r = ${r} cm (d = ${d} cm)</text>
      <text x="246" y="175" font-family="sans-serif" font-size="12" fill="#10b981" font-weight="bold">h = ${h} cm</text>
    `;
  } else if (subType === 4) { // Sphere (radius)
    const r = params.r || 9;
    bodySvg = `
      <!-- 3D Shaded Sphere Circle -->
      <circle cx="240" cy="200" r="100" fill="url(#sphereGradient)" stroke="#38bdf8" stroke-width="2.5" />
      <!-- Equator Ellipse -->
      <ellipse cx="240" cy="200" rx="100" ry="28" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4,4" />
      <!-- Radius vector -->
      <line x1="240" y1="200" x2="340" y2="200" stroke="#f59e0b" stroke-width="2.5" />
      <circle cx="240" cy="200" r="4" fill="#10b981" />
      <circle cx="340" cy="200" r="4" fill="#f59e0b" />
      <!-- Label -->
      <text x="280" y="190" font-family="sans-serif" font-size="13" fill="#f59e0b" font-weight="bold">r = ${r} cm</text>
    `;
  } else if (subType === 5) { // Basketball Sphere (diameter)
    const d = params.d || 24, r = d / 2;
    bodySvg = `
      <!-- Basketball Sphere -->
      <circle cx="240" cy="200" r="105" fill="url(#basketballGrad)" stroke="#f97316" stroke-width="3" />
      <path d="M 135 200 Q 240 240 345 200" fill="none" stroke="#0f172a" stroke-width="2.5" />
      <path d="M 240 95 Q 280 200 240 305" fill="none" stroke="#0f172a" stroke-width="2.5" />
      <!-- Diameter line -->
      <line x1="135" y1="200" x2="345" y2="200" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4,4" />
      <!-- Label -->
      <text x="240" y="185" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#38bdf8" font-weight="bold">Diameter d = ${d} cm (r = ${r} cm)</text>
    `;
  } else if (subType === 6) { // Hemispherical Bowl
    const r = params.r || 12;
    bodySvg = `
      <!-- Bowl Rim -->
      <ellipse cx="240" cy="150" rx="110" ry="32" fill="rgba(56, 189, 248, 0.2)" stroke="#38bdf8" stroke-width="2.5" />
      <!-- Bowl Bottom Hemisphere -->
      <path d="M 130 150 A 110 110 0 0 0 350 150" fill="rgba(16, 185, 129, 0.25)" stroke="#38bdf8" stroke-width="2.5" />
      <!-- Radius -->
      <line x1="240" y1="150" x2="350" y2="150" stroke="#f59e0b" stroke-width="2.5" />
      <circle cx="240" cy="150" r="4" fill="#10b981" />
      <!-- Label -->
      <text x="285" y="140" font-family="sans-serif" font-size="13" fill="#f59e0b" font-weight="bold">r = ${r} cm</text>
      <text x="240" y="220" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#10b981" font-weight="bold">Hemispherical Bowl</text>
    `;
  } else if (subType === 7) { // Cylinder vs Cone Pouring Water
    const r = params.r || 4, h = params.h || 9;
    bodySvg = `
      <!-- Cylinder -->
      <g transform="translate(110, 110)">
        <ellipse cx="60" cy="30" rx="50" ry="16" fill="rgba(56, 189, 248, 0.3)" stroke="#38bdf8" stroke-width="2" />
        <rect x="10" y="30" width="100" height="120" fill="rgba(56, 189, 248, 0.25)" stroke="none" />
        <line x1="10" y1="30" x2="10" y2="150" stroke="#38bdf8" stroke-width="2" />
        <line x1="110" y1="30" x2="110" y2="150" stroke="#38bdf8" stroke-width="2" />
        <ellipse cx="60" cy="150" rx="50" ry="16" fill="none" stroke="#38bdf8" stroke-width="2" />
        <text x="60" y="178" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#38bdf8" font-weight="bold">Cylinder (V = 3V_cone)</text>
      </g>

      <text x="240" y="200" font-family="sans-serif" font-size="20" fill="#f59e0b" font-weight="bold">=</text>

      <!-- Cone -->
      <g transform="translate(290, 110)">
        <ellipse cx="60" cy="150" rx="50" ry="16" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" stroke-width="2" />
        <line x1="10" y1="150" x2="60" y2="30" stroke="#10b981" stroke-width="2" />
        <line x1="110" y1="150" x2="60" y2="30" stroke="#10b981" stroke-width="2" />
        <text x="60" y="178" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#10b981" font-weight="bold">3 Cones Filled!</text>
      </g>
    `;
  } else if (subType === 8) { // Melted Sphere recast to Cone
    const r = params.r || 6, h = params.h || 24;
    bodySvg = `
      <!-- Sphere -->
      <g transform="translate(130, 180)">
        <circle cx="0" cy="0" r="50" fill="url(#sphereGradient)" stroke="#38bdf8" stroke-width="2" />
        <text x="0" y="70" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#38bdf8" font-weight="bold">Sphere r = ${r} cm</text>
      </g>

      <text x="240" y="180" font-family="sans-serif" font-size="24" fill="#f59e0b" font-weight="bold">➔</text>

      <!-- Recast Cone -->
      <g transform="translate(340, 180)">
        <ellipse cx="0" cy="60" rx="50" ry="16" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" stroke-width="2" />
        <line x1="-50" y1="60" x2="0" y2="-60" stroke="#10b981" stroke-width="2" />
        <line x1="50" y1="60" x2="0" y2="-60" stroke="#10b981" stroke-width="2" />
        <line x1="0" y1="-60" x2="0" y2="60" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4,4" />
        <text x="0" y="90" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#10b981" font-weight="bold">Cone h = 4r = ${h} cm</text>
      </g>
    `;
  } else { // Ice Cream Cone with Scoop
    const r = params.r || 3, h = params.h || 10;
    bodySvg = `
      <g transform="translate(240, 190)">
        <!-- Cone Base Body -->
        <polygon points="-50,-20 50,-20 0,110" fill="rgba(245, 158, 11, 0.3)" stroke="#f59e0b" stroke-width="2" />
        <line x1="0" y1="-20" x2="0" y2="110" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4,4" />
        <!-- Hemispherical Scoop -->
        <path d="M -50 -20 A 50 50 0 0 1 50 -20" fill="rgba(236, 72, 153, 0.4)" stroke="#ec4899" stroke-width="2.5" />
        <!-- Labels -->
        <text x="60" y="-30" font-family="sans-serif" font-size="12" fill="#ec4899" font-weight="bold">Hemisphere r = ${r} cm</text>
        <text x="60" y="45" font-family="sans-serif" font-size="12" fill="#f59e0b" font-weight="bold">Cone h = ${h} cm</text>
      </g>
    `;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <radialGradient id="sphereGradient" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.8" />
      <stop offset="70%" stop-color="#0284c7" stop-opacity="0.5" />
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0.9" />
    </radialGradient>
    <radialGradient id="basketballGrad" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#fb923c" />
      <stop offset="70%" stop-color="#ea580c" />
      <stop offset="100%" stop-color="#7c2d12" />
    </radialGradient>
  </defs>

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

export function saveTopic136SvgPlots() {
  console.log('Generating 50 Volume 3D SVG plot files for Topic 136...');
  for (let qIndex = 0; qIndex < 50; qIndex++) {
    const subType = qIndex % 10;
    let params = {};

    if (subType === 0) params = { title: `Triangular Pyramid Volume`, a: 6, b: 8, h: 15 };
    else if (subType === 1) params = { title: `Hexagonal Pyramid Volume`, area: 42, h: 10 };
    else if (subType === 2) params = { title: `Solid Cone Volume (r=5, h=12)`, r: 5, h: 12 };
    else if (subType === 3) params = { title: `Cone with Slant Height (d=14, l=25)`, d: 14, l: 25, h: 24 };
    else if (subType === 4) params = { title: `Exact Sphere Volume (r=9)`, r: 9 };
    else if (subType === 5) params = { title: `Spherical Basketball (d=24)`, d: 24 };
    else if (subType === 6) params = { title: `Hemispherical Bowl Capacity (r=12)`, r: 12 };
    else if (subType === 7) params = { title: `Cylinder vs Cone Pouring Water`, r: 4, h: 9 };
    else if (subType === 8) params = { title: `Melted Sphere Recast to Cone (r=6)`, r: 6, h: 24 };
    else params = { title: `Ice Cream Cone + Hemispherical Scoop`, r: 3, h: 10 };

    const svg = generateTopic136Svg(subType, params);
    const fileName = `g8_t136_q${qIndex + 1}.svg`;

    fs.writeFileSync(path.join(publicImagesDir, fileName), svg);
    fs.writeFileSync(path.join(rootImagesDir, fileName), svg);
  }
  console.log('✅ Created 50 Volume 3D SVG plot files in public/images/ and images/!');
}

if (process.argv[1] && process.argv[1].endsWith('generate_t136_svg_plots.js')) {
  saveTopic136SvgPlots();
}
