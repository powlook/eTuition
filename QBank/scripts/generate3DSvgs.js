import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicImagesDir = path.join(__dirname, '..', 'public', 'images');
const imagesDir = path.join(__dirname, '..', 'images');

[publicImagesDir, imagesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// 1. cylinder_3d.svg
const cylinderSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 280" width="400" height="280">
  <rect width="100%" height="100%" fill="#0f172a" rx="12" />
  <rect x="16" y="12" width="368" height="28" rx="6" fill="rgba(56, 189, 248, 0.12)" stroke="rgba(56, 189, 248, 0.3)" />
  <text x="200" y="31" text-anchor="middle" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#38bdf8">
    3D Right Circular Cylinder: V = π r² h
  </text>

  <!-- Top Ellipse -->
  <ellipse cx="200" cy="85" rx="80" ry="24" fill="rgba(56, 189, 248, 0.18)" stroke="#38bdf8" stroke-width="2.5" />
  
  <!-- Cylinder Walls -->
  <line x1="120" y1="85" x2="120" y2="215" stroke="#38bdf8" stroke-width="2.5" />
  <line x1="280" y1="85" x2="280" y2="215" stroke="#38bdf8" stroke-width="2.5" />

  <!-- Bottom Ellipse Back (Dashed) & Front (Solid) -->
  <path d="M 120 215 A 80 24 0 0 1 280 215" fill="none" stroke="#64748b" stroke-width="2" stroke-dasharray="5 5" />
  <path d="M 120 215 A 80 24 0 0 0 280 215" fill="rgba(56, 189, 248, 0.1)" stroke="#38bdf8" stroke-width="2.5" />

  <!-- Center Axis & Height -->
  <line x1="200" y1="85" x2="200" y2="215" stroke="#f59e0b" stroke-width="2" stroke-dasharray="5 5" />
  <circle cx="200" cy="85" r="4" fill="#f59e0b" />
  <circle cx="200" cy="215" r="4" fill="#f59e0b" />
  <text x="210" y="155" font-family="sans-serif" font-size="14" font-weight="bold" fill="#f59e0b">h (Height)</text>

  <!-- Radius Line -->
  <line x1="200" y1="85" x2="280" y2="85" stroke="#38bdf8" stroke-width="2.5" />
  <circle cx="280" cy="85" r="3.5" fill="#38bdf8" />
  <text x="235" y="78" font-family="sans-serif" font-size="13" font-weight="bold" fill="#38bdf8">r (Radius)</text>
</svg>`;

// 2. pyramid_rectangular_3d.svg
const rectPyramidSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 280" width="400" height="280">
  <rect width="100%" height="100%" fill="#0f172a" rx="12" />
  <rect x="16" y="12" width="368" height="28" rx="6" fill="rgba(56, 189, 248, 0.12)" stroke="rgba(56, 189, 248, 0.3)" />
  <text x="200" y="31" text-anchor="middle" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#38bdf8">
    3D Rectangular Pyramid: V = ⅓ l w h
  </text>

  <!-- Base Fill -->
  <polygon points="100,215 280,215 340,165 160,165" fill="rgba(56, 189, 248, 0.12)" />

  <!-- Hidden Base Edges -->
  <line x1="160" y1="165" x2="340" y2="165" stroke="#64748b" stroke-width="2" stroke-dasharray="5 5" />
  <line x1="160" y1="165" x2="100" y2="215" stroke="#64748b" stroke-width="2" stroke-dasharray="5 5" />

  <!-- Visible Base Edges -->
  <line x1="100" y1="215" x2="280" y2="215" stroke="#38bdf8" stroke-width="2.5" />
  <line x1="280" y1="215" x2="340" y2="165" stroke="#38bdf8" stroke-width="2.5" />

  <!-- Apex and Height Axis -->
  <line x1="200" y1="55" x2="220" y2="190" stroke="#f59e0b" stroke-width="2" stroke-dasharray="5 5" />
  <circle cx="200" cy="55" r="5" fill="#f59e0b" />
  <text x="200" y="45" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="bold" fill="#f59e0b">Apex (P)</text>
  <text x="228" y="130" font-family="sans-serif" font-size="14" font-weight="bold" fill="#f59e0b">h</text>

  <!-- Hidden Lateral Edge -->
  <line x1="200" y1="55" x2="160" y2="165" stroke="#64748b" stroke-width="2" stroke-dasharray="5 5" />

  <!-- Visible Lateral Edges -->
  <line x1="200" y1="55" x2="100" y2="215" stroke="#38bdf8" stroke-width="2.5" />
  <line x1="200" y1="55" x2="280" y2="215" stroke="#38bdf8" stroke-width="2.5" />
  <line x1="200" y1="55" x2="340" y2="165" stroke="#38bdf8" stroke-width="2.5" />

  <!-- Dimensions -->
  <text x="185" y="235" font-family="sans-serif" font-size="13" font-weight="bold" fill="#38bdf8">l (Length)</text>
  <text x="315" y="198" font-family="sans-serif" font-size="13" font-weight="bold" fill="#38bdf8">w (Width)</text>
</svg>`;

// 3. pyramid_square_3d.svg
const squarePyramidSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 280" width="400" height="280">
  <rect width="100%" height="100%" fill="#0f172a" rx="12" />
  <rect x="16" y="12" width="368" height="28" rx="6" fill="rgba(56, 189, 248, 0.12)" stroke="rgba(56, 189, 248, 0.3)" />
  <text x="200" y="31" text-anchor="middle" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#38bdf8">
    3D Square Pyramid: V = ⅓ s² h
  </text>

  <!-- Base Polygon -->
  <polygon points="110,215 290,215 335,165 155,165" fill="rgba(56, 189, 248, 0.14)" />

  <!-- Hidden Base Lines -->
  <line x1="155" y1="165" x2="335" y2="165" stroke="#64748b" stroke-width="2" stroke-dasharray="5 5" />
  <line x1="155" y1="165" x2="110" y2="215" stroke="#64748b" stroke-width="2" stroke-dasharray="5 5" />

  <!-- Visible Base Lines -->
  <line x1="110" y1="215" x2="290" y2="215" stroke="#38bdf8" stroke-width="2.5" />
  <line x1="290" y1="215" x2="335" y2="165" stroke="#38bdf8" stroke-width="2.5" />

  <!-- Apex and Height Axis -->
  <line x1="200" y1="55" x2="222" y2="190" stroke="#f59e0b" stroke-width="2" stroke-dasharray="5 5" />
  <circle cx="200" cy="55" r="5" fill="#f59e0b" />
  <text x="228" y="130" font-family="sans-serif" font-size="14" font-weight="bold" fill="#f59e0b">h (Height)</text>

  <!-- Hidden Lateral Edge -->
  <line x1="200" y1="55" x2="155" y2="165" stroke="#64748b" stroke-width="2" stroke-dasharray="5 5" />

  <!-- Visible Lateral Edges -->
  <line x1="200" y1="55" x2="110" y2="215" stroke="#38bdf8" stroke-width="2.5" />
  <line x1="200" y1="55" x2="290" y2="215" stroke="#38bdf8" stroke-width="2.5" />
  <line x1="200" y1="55" x2="335" y2="165" stroke="#38bdf8" stroke-width="2.5" />

  <!-- Side Length -->
  <text x="195" y="235" font-family="sans-serif" font-size="13" font-weight="bold" fill="#38bdf8">s (Square Base)</text>
</svg>`;

// 4. cylinder_vs_prism.svg
const cylVsPrismSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 280" width="450" height="280">
  <rect width="100%" height="100%" fill="#0f172a" rx="12" />
  <rect x="16" y="12" width="418" height="28" rx="6" fill="rgba(56, 189, 248, 0.12)" stroke="rgba(56, 189, 248, 0.3)" />
  <text x="225" y="31" text-anchor="middle" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#38bdf8">
    Cavalieri's Principle: V_cylinder = V_prism (Equal Base Area &amp; Height)
  </text>

  <!-- Left: Cylinder -->
  <g transform="translate(-10, 10)">
    <ellipse cx="120" cy="85" rx="55" ry="18" fill="rgba(56, 189, 248, 0.18)" stroke="#38bdf8" stroke-width="2" />
    <line x1="65" y1="85" x2="65" y2="195" stroke="#38bdf8" stroke-width="2" />
    <line x1="175" y1="85" x2="175" y2="195" stroke="#38bdf8" stroke-width="2" />
    <path d="M 65 195 A 55 18 0 0 0 175 195" fill="rgba(56, 189, 248, 0.1)" stroke="#38bdf8" stroke-width="2" />
    <path d="M 65 195 A 55 18 0 0 1 175 195" fill="none" stroke="#64748b" stroke-width="1.5" stroke-dasharray="4 4" />
    <text x="120" y="225" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#38bdf8">Cylinder (Base Area = B)</text>
  </g>

  <!-- Right: Rectangular Prism -->
  <g transform="translate(60, 10)">
    <!-- Top Face -->
    <polygon points="230,67 310,67 345,85 265,85" fill="rgba(245, 158, 11, 0.18)" stroke="#f59e0b" stroke-width="2" />
    <!-- Vertical Edges -->
    <line x1="265" y1="85" x2="265" y2="195" stroke="#f59e0b" stroke-width="2" />
    <line x1="345" y1="85" x2="345" y2="195" stroke="#f59e0b" stroke-width="2" />
    <line x1="310" y1="67" x2="310" y2="177" stroke="#f59e0b" stroke-width="2" />
    <!-- Front/Side Bottom Edges -->
    <line x1="265" y1="195" x2="345" y2="195" stroke="#f59e0b" stroke-width="2" />
    <line x1="310" y1="177" x2="345" y2="195" stroke="#f59e0b" stroke-width="2" />
    <text x="290" y="225" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#f59e0b">Prism (Base Area = B)</text>
  </g>

  <!-- Equal Height Guide Line -->
  <line x1="40" y1="95" x2="410" y2="95" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4 4" />
  <line x1="40" y1="205" x2="410" y2="205" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4 4" />
  <text x="225" y="255" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="bold" fill="#4ade80">Height (h) &amp; Base Area (B) are Identical ⟹ V1 = V2</text>
</svg>`;

// 5. pyramid_vs_prism.svg
const pyramidVsPrismSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 280" width="450" height="280">
  <rect width="100%" height="100%" fill="#0f172a" rx="12" />
  <rect x="16" y="12" width="418" height="28" rx="6" fill="rgba(56, 189, 248, 0.12)" stroke="rgba(56, 189, 248, 0.3)" />
  <text x="225" y="31" text-anchor="middle" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#38bdf8">
    Volume Comparison: V_pyramid = ⅓ V_prism
  </text>

  <!-- Left: Pyramid -->
  <g transform="translate(-10, 10)">
    <polygon points="60,200 160,200 190,160 90,160" fill="rgba(56, 189, 248, 0.12)" stroke="#38bdf8" stroke-width="2" />
    <circle cx="125" cy="70" r="4" fill="#38bdf8" />
    <line x1="125" y1="70" x2="60" y2="200" stroke="#38bdf8" stroke-width="2" />
    <line x1="125" y1="70" x2="160" y2="200" stroke="#38bdf8" stroke-width="2" />
    <line x1="125" y1="70" x2="190" y2="160" stroke="#38bdf8" stroke-width="2" />
    <text x="125" y="225" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#38bdf8">Pyramid: V = ⅓ B h</text>
  </g>

  <!-- Right: Prism -->
  <g transform="translate(60, 10)">
    <polygon points="250,70 330,70 360,90 280,90" fill="rgba(245, 158, 11, 0.18)" stroke="#f59e0b" stroke-width="2" />
    <line x1="280" y1="90" x2="280" y2="200" stroke="#f59e0b" stroke-width="2" />
    <line x1="360" y1="90" x2="360" y2="200" stroke="#f59e0b" stroke-width="2" />
    <line x1="330" y1="70" x2="330" y2="180" stroke="#f59e0b" stroke-width="2" />
    <line x1="280" y1="200" x2="360" y2="200" stroke="#f59e0b" stroke-width="2" />
    <line x1="330" y1="180" x2="360" y2="200" stroke="#f59e0b" stroke-width="2" />
    <text x="315" y="225" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#f59e0b">Prism: V = B h</text>
  </g>

  <text x="225" y="255" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="bold" fill="#4ade80">3 Full Pyramids fill exactly 1 Prism of equal B &amp; h</text>
</svg>`;

// 6. venn_diagram_sets.svg
const vennSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 280" width="420" height="280">
  <rect width="100%" height="100%" fill="#0f172a" rx="12" />
  <rect x="16" y="12" width="388" height="28" rx="6" fill="rgba(56, 189, 248, 0.12)" stroke="rgba(56, 189, 248, 0.3)" />
  <text x="210" y="31" text-anchor="middle" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#38bdf8">
    Venn Diagram: Sets, Union &amp; Intersection (U)
  </text>

  <!-- Universal Set Outer Boundary Box U -->
  <rect x="30" y="55" width="360" height="200" rx="10" fill="none" stroke="#64748b" stroke-width="2" />
  <text x="45" y="78" font-family="sans-serif" font-size="14" font-weight="bold" fill="#94a3b8">U</text>

  <!-- Circle Set A -->
  <circle cx="170" cy="155" r="70" fill="rgba(56, 189, 248, 0.22)" stroke="#38bdf8" stroke-width="2.5" />
  <text x="130" y="140" font-family="sans-serif" font-size="16" font-weight="bold" fill="#38bdf8">Set A</text>

  <!-- Circle Set B -->
  <circle cx="250" cy="155" r="70" fill="rgba(245, 158, 11, 0.22)" stroke="#f59e0b" stroke-width="2.5" />
  <text x="290" y="140" font-family="sans-serif" font-size="16" font-weight="bold" fill="#f59e0b">Set B</text>

  <!-- Intersection Label -->
  <text x="210" y="160" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="bold" fill="#4ade80">A ∩ B</text>

  <!-- Outer Complement Label -->
  <text x="320" y="235" font-family="sans-serif" font-size="12" font-style="italic" fill="#94a3b8">(A ∪ B)'</text>
</svg>`;

const files = [
  { name: 'cylinder_3d.svg', content: cylinderSvg },
  { name: 'pyramid_rectangular_3d.svg', content: rectPyramidSvg },
  { name: 'pyramid_square_3d.svg', content: squarePyramidSvg },
  { name: 'cylinder_vs_prism.svg', content: cylVsPrismSvg },
  { name: 'pyramid_vs_prism.svg', content: pyramidVsPrismSvg },
  { name: 'venn_diagram_sets.svg', content: vennSvg }
];

files.forEach(f => {
  fs.writeFileSync(path.join(publicImagesDir, f.name), f.content, 'utf8');
  fs.writeFileSync(path.join(imagesDir, f.name), f.content, 'utf8');
  console.log(`✅ Generated ${f.name}`);
});

console.log('✨ All 3D vector SVG diagrams successfully created!');
