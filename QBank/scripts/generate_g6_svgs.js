import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicImagesDir = path.join(__dirname, '..', 'public', 'images');
const rootImagesDir = path.join(__dirname, '..', 'images');
const distImagesDir = path.join(__dirname, '..', 'dist', 'images');

[publicImagesDir, rootImagesDir, distImagesDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

export function generateGrade6Svg(topicId, qIndex, params = {}) {
  const width = 480;
  const height = 320;
  const subType = qIndex % 5;
  const title = params.title || `Grade 6 Topic ${topicId} Diagram #${qIndex + 1}`;

  let bodySvg = '';

  // ==========================================
  // TOPIC 89 (T01): Tessellation of shapes
  // ==========================================
  if (topicId === 89) {
    if (subType === 0 || subType === 1) { // Square Tiling
      bodySvg = `
        <g transform="translate(80, 40)">
          <rect x="0" y="0" width="60" height="60" fill="#38bdf8" stroke="#0f172a" stroke-width="2" />
          <rect x="60" y="0" width="60" height="60" fill="#f59e0b" stroke="#0f172a" stroke-width="2" />
          <rect x="120" y="0" width="60" height="60" fill="#38bdf8" stroke="#0f172a" stroke-width="2" />
          <rect x="180" y="0" width="60" height="60" fill="#f59e0b" stroke="#0f172a" stroke-width="2" />
          <rect x="0" y="60" width="60" height="60" fill="#f59e0b" stroke="#0f172a" stroke-width="2" />
          <rect x="60" y="60" width="60" height="60" fill="#38bdf8" stroke="#0f172a" stroke-width="2" />
          <rect x="120" y="60" width="60" height="60" fill="#f59e0b" stroke="#0f172a" stroke-width="2" />
          <rect x="180" y="60" width="60" height="60" fill="#38bdf8" stroke="#0f172a" stroke-width="2" />
          <rect x="0" y="120" width="60" height="60" fill="#38bdf8" stroke="#0f172a" stroke-width="2" />
          <rect x="60" y="120" width="60" height="60" fill="#f59e0b" stroke="#0f172a" stroke-width="2" />
          <rect x="120" y="120" width="60" height="60" fill="#38bdf8" stroke="#0f172a" stroke-width="2" />
          <rect x="180" y="120" width="60" height="60" fill="#f59e0b" stroke="#0f172a" stroke-width="2" />
          <circle cx="120" cy="60" r="5" fill="#ef4444" />
          <text x="120" y="210" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#38bdf8" font-weight="bold">Regular Square Tessellation (Vertex Angle Sum = 360°)</text>
        </g>
      `;
    } else if (subType === 2 || subType === 3) { // Triangular Tiling
      bodySvg = `
        <g transform="translate(60, 40)">
          <polygon points="60,20 0,120 120,120" fill="#10b981" stroke="#0f172a" stroke-width="2" />
          <polygon points="60,20 180,20 120,120" fill="#ec4899" stroke="#0f172a" stroke-width="2" />
          <polygon points="180,20 120,120 240,120" fill="#10b981" stroke="#0f172a" stroke-width="2" />
          <polygon points="180,20 300,20 240,120" fill="#ec4899" stroke="#0f172a" stroke-width="2" />
          <polygon points="0,120 60,220 120,120" fill="#ec4899" stroke="#0f172a" stroke-width="2" />
          <polygon points="120,120 60,220 180,220" fill="#10b981" stroke="#0f172a" stroke-width="2" />
          <polygon points="120,120 240,120 180,220" fill="#ec4899" stroke="#0f172a" stroke-width="2" />
          <polygon points="240,120 180,220 300,220" fill="#10b981" stroke="#0f172a" stroke-width="2" />
          <circle cx="120" cy="120" r="5" fill="#f59e0b" />
          <text x="150" y="250" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#10b981" font-weight="bold">Equilateral Triangle Tessellation (6 Triangles at Vertex)</text>
        </g>
      `;
    } else { // Hexagonal Tiling
      bodySvg = `
        <g transform="translate(100, 30)">
          <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" fill="#a855f7" stroke="#0f172a" stroke-width="2" />
          <polygon points="130,10 170,30 170,70 130,90 90,70 90,30" fill="#3b82f6" stroke="#0f172a" stroke-width="2" />
          <polygon points="210,10 250,30 250,70 210,90 170,70 170,30" fill="#a855f7" stroke="#0f172a" stroke-width="2" />
          <polygon points="90,70 130,90 130,130 90,150 50,130 50,90" fill="#3b82f6" stroke="#0f172a" stroke-width="2" />
          <polygon points="170,70 210,90 210,130 170,150 130,130 130,90" fill="#a855f7" stroke="#0f172a" stroke-width="2" />
          <polygon points="50,130 90,150 90,190 50,210 10,190 10,150" fill="#a855f7" stroke="#0f172a" stroke-width="2" />
          <polygon points="130,130 170,150 170,190 130,210 90,190 90,150" fill="#3b82f6" stroke="#0f172a" stroke-width="2" />
          <circle cx="90" cy="70" r="5" fill="#f59e0b" />
          <text x="130" y="240" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#a855f7" font-weight="bold">Regular Hexagonal Honeycomb Tessellation</text>
        </g>
      `;
    }
  }

  // ==========================================
  // TOPIC 90 (T02): Translation, Reflection & Rotation
  // ==========================================
  else if (topicId === 90) {
    if (subType === 0 || subType === 1) { // Translation on Grid
      bodySvg = `
        <g transform="translate(60, 30)">
          <!-- Grid background -->
          <path d="M 0,0 L 320,0 M 0,40 L 320,40 M 0,80 L 320,80 M 0,120 L 320,120 M 0,160 L 320,160 M 0,200 L 320,200 M 0,240 L 320,240" stroke="#334155" stroke-width="1" />
          <path d="M 0,0 L 0,240 M 40,0 L 40,240 M 80,0 L 80,240 M 120,0 L 120,240 M 160,0 L 160,240 M 200,0 L 200,240 M 240,0 L 240,240 M 280,0 L 280,240 M 320,0 L 320,240" stroke="#334155" stroke-width="1" />
          <!-- Original Triangle -->
          <polygon points="40,160 120,160 80,80" fill="rgba(56, 189, 248, 0.4)" stroke="#38bdf8" stroke-width="3" />
          <text x="80" y="140" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#38bdf8" font-weight="bold">Original A</text>
          <!-- Translation Vector Arrow -->
          <path d="M 80,120 L 200,40" stroke="#f59e0b" stroke-width="3" stroke-dasharray="6,4" marker-end="url(#arrow)" />
          <!-- Image Triangle A' -->
          <polygon points="160,80 240,80 200,0" fill="rgba(16, 185, 129, 0.4)" stroke="#10b981" stroke-width="3" />
          <text x="200" y="60" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#10b981" font-weight="bold">Image A'</text>
          <text x="160" y="225" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#f59e0b" font-weight="bold">Translation Vector: (x + 3, y - 2)</text>
        </g>
      `;
    } else if (subType === 2 || subType === 3) { // Reflection
      bodySvg = `
        <g transform="translate(60, 30)">
          <!-- Line of Symmetry -->
          <line x1="160" y1="10" x2="160" y2="210" stroke="#ef4444" stroke-width="3" stroke-dasharray="6,4" />
          <text x="160" y="235" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#ef4444" font-weight="bold">Mirror Line of Reflection</text>
          <!-- Pre-image -->
          <polygon points="40,50 120,70 80,150" fill="rgba(168, 85, 247, 0.4)" stroke="#a855f7" stroke-width="3" />
          <text x="80" y="100" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#a855f7" font-weight="bold">Pre-Image</text>
          <!-- Reflected Image -->
          <polygon points="280,50 200,70 240,150" fill="rgba(59, 130, 246, 0.4)" stroke="#3b82f6" stroke-width="3" />
          <text x="240" y="100" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#3b82f6" font-weight="bold">Reflected Image</text>
        </g>
      `;
    } else { // Rotation
      bodySvg = `
        <g transform="translate(60, 30)">
          <circle cx="160" cy="120" r="6" fill="#f59e0b" />
          <text x="160" y="145" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#f59e0b" font-weight="bold">Center of Rotation O</text>
          <!-- Original -->
          <rect x="180" y="40" width="80" height="50" fill="rgba(236, 72, 153, 0.4)" stroke="#ec4899" stroke-width="3" />
          <text x="220" y="70" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#ec4899" font-weight="bold">Original</text>
          <!-- Rotated 90 deg CCW -->
          <rect x="70" y="40" width="50" height="80" fill="rgba(16, 185, 129, 0.4)" stroke="#10b981" stroke-width="3" />
          <text x="95" y="85" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#10b981" font-weight="bold">90° CCW</text>
          <path d="M 220,40 A 100 100 0 0 0 120,40" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="4,4" />
          <text x="160" y="225" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#38bdf8" font-weight="bold">Rotation of 90° Counterclockwise around Center O</text>
        </g>
      `;
    }
  }

  // ==========================================
  // TOPIC 91 (T03): Units of Volume and Capacity
  // ==========================================
  else if (topicId === 91) {
    bodySvg = `
      <g transform="translate(80, 20)">
        <!-- Graduated Cylinder / Container -->
        <rect x="50" y="30" width="80" height="200" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" stroke-width="3" rx="5" />
        <!-- Liquid Level -->
        <rect x="53" y="90" width="74" height="137" fill="rgba(56, 189, 248, 0.6)" rx="2" />
        <!-- Tick marks -->
        <line x1="50" y1="70" x2="70" y2="70" stroke="#94a3b8" stroke-width="2" />
        <text x="40" y="74" text-anchor="end" font-family="sans-serif" font-size="11" fill="#94a3b8">1000 mL (1 L)</text>
        <line x1="50" y1="110" x2="70" y2="110" stroke="#94a3b8" stroke-width="2" />
        <text x="40" y="114" text-anchor="end" font-family="sans-serif" font-size="11" fill="#38bdf8" font-weight="bold">750 mL</text>
        <line x1="50" y1="150" x2="70" y2="150" stroke="#94a3b8" stroke-width="2" />
        <text x="40" y="154" text-anchor="end" font-family="sans-serif" font-size="11" fill="#94a3b8">500 mL</text>
        <line x1="50" y1="190" x2="70" y2="190" stroke="#94a3b8" stroke-width="2" />
        <text x="40" y="194" text-anchor="end" font-family="sans-serif" font-size="11" fill="#94a3b8">250 mL</text>
        
        <!-- Metric Equivalency Box -->
        <rect x="170" y="50" width="160" height="140" fill="#1e293b" stroke="#f59e0b" stroke-width="2" rx="8" />
        <text x="250" y="80" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#f59e0b" font-weight="bold">Volume &amp; Capacity Conversion</text>
        <text x="250" y="110" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#ffffff">1 cm&#179; = 1 mL</text>
        <text x="250" y="135" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#38bdf8" font-weight="bold">1000 cm&#179; = 1 L</text>
        <text x="250" y="160" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#ffffff">1 m&#179; = 1000 L</text>
      </g>
    `;
  }

  // ==========================================
  // TOPIC 92 (T04): Volume of Cubes & Rectangular Prisms
  // ==========================================
  else if (topicId === 92) {
    if (subType % 2 === 0) { // Rectangular Prism Isometric 3D
      bodySvg = `
        <g transform="translate(100, 30)">
          <!-- Front Face -->
          <polygon points="20,120 180,120 180,200 20,200" fill="rgba(56, 189, 248, 0.4)" stroke="#38bdf8" stroke-width="3" />
          <!-- Top Face -->
          <polygon points="20,120 100,50 260,50 180,120" fill="rgba(56, 189, 248, 0.25)" stroke="#38bdf8" stroke-width="3" />
          <!-- Right Face -->
          <polygon points="180,120 260,50 260,130 180,200" fill="rgba(56, 189, 248, 0.55)" stroke="#38bdf8" stroke-width="3" />
          
          <!-- Dimensions -->
          <text x="100" y="220" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#f59e0b" font-weight="bold">Length l = 10 cm</text>
          <text x="230" y="185" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#f59e0b" font-weight="bold">Width w = 5 cm</text>
          <text x="0" y="165" text-anchor="end" font-family="sans-serif" font-size="14" fill="#f59e0b" font-weight="bold">Height h = 6 cm</text>

          <text x="140" y="255" text-anchor="middle" font-family="sans-serif" font-size="15" fill="#38bdf8" font-weight="bold">V = l × w × h = 10 × 5 × 6 = 300 cm³</text>
        </g>
      `;
    } else { // Cube Isometric 3D
      bodySvg = `
        <g transform="translate(120, 30)">
          <polygon points="30,110 150,110 150,210 30,210" fill="rgba(236, 72, 153, 0.4)" stroke="#ec4899" stroke-width="3" />
          <polygon points="30,110 100,40 220,40 150,110" fill="rgba(236, 72, 153, 0.25)" stroke="#ec4899" stroke-width="3" />
          <polygon points="150,110 220,40 220,140 150,210" fill="rgba(236, 72, 153, 0.55)" stroke="#ec4899" stroke-width="3" />
          
          <text x="90" y="230" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#f59e0b" font-weight="bold">Edge s = 8 cm</text>
          <text x="120" y="260" text-anchor="middle" font-family="sans-serif" font-size="15" fill="#ec4899" font-weight="bold">Volume of Cube = s³ = 8³ = 512 cm³</text>
        </g>
      `;
    }
  }

  // ==========================================
  // TOPIC 93 (T05): Perimeter and Area of Triangles, Parallelograms, Trapezoids
  // ==========================================
  else if (topicId === 93) {
    if (subType === 0 || subType === 1) { // Triangle with Base and Height
      bodySvg = `
        <g transform="translate(80, 40)">
          <polygon points="20,180 260,180 160,40" fill="rgba(16, 185, 129, 0.3)" stroke="#10b981" stroke-width="3" />
          <!-- Height Line -->
          <line x1="160" y1="40" x2="160" y2="180" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="5,4" />
          <rect x="160" y="165" width="15" height="15" fill="none" stroke="#ef4444" stroke-width="1.5" />
          
          <text x="140" y="198" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#10b981" font-weight="bold">Base b = 12 cm</text>
          <text x="175" y="110" font-family="sans-serif" font-size="14" fill="#ef4444" font-weight="bold">h = 8 cm</text>
          <text x="140" y="240" text-anchor="middle" font-family="sans-serif" font-size="15" fill="#38bdf8" font-weight="bold">Area = ½ × b × h = ½ × 12 × 8 = 48 cm²</text>
        </g>
      `;
    } else if (subType === 2 || subType === 3) { // Parallelogram
      bodySvg = `
        <g transform="translate(80, 40)">
          <polygon points="60,40 260,40 200,180 0,180" fill="rgba(168, 85, 247, 0.3)" stroke="#a855f7" stroke-width="3" />
          <line x1="60" y1="40" x2="60" y2="180" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="5,4" />
          <rect x="60" y="165" width="15" height="15" fill="none" stroke="#ef4444" stroke-width="1.5" />
          
          <text x="100" y="198" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#a855f7" font-weight="bold">Base b = 15 cm</text>
          <text x="75" y="110" font-family="sans-serif" font-size="14" fill="#ef4444" font-weight="bold">h = 9 cm</text>
          <text x="130" y="240" text-anchor="middle" font-family="sans-serif" font-size="15" fill="#a855f7" font-weight="bold">Area = b × h = 15 × 9 = 135 cm²</text>
        </g>
      `;
    } else { // Trapezoid
      bodySvg = `
        <g transform="translate(80, 30)">
          <polygon points="60,40 220,40 280,180 0,180" fill="rgba(245, 158, 11, 0.3)" stroke="#f59e0b" stroke-width="3" />
          <line x1="60" y1="40" x2="60" y2="180" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="5,4" />
          <rect x="60" y="165" width="15" height="15" fill="none" stroke="#ef4444" stroke-width="1.5" />
          
          <text x="140" y="30" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#f59e0b" font-weight="bold">Base a = 10 cm</text>
          <text x="140" y="200" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#f59e0b" font-weight="bold">Base b = 18 cm</text>
          <text x="75" y="110" font-family="sans-serif" font-size="14" fill="#ef4444" font-weight="bold">h = 7 cm</text>
          <text x="140" y="240" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#38bdf8" font-weight="bold">Area = ½ × (a + b) × h = ½ × (10+18) × 7 = 98 cm²</text>
        </g>
      `;
    }
  }

  // ==========================================
  // TOPIC 94 (T06): Parts of a Circle, including Circumference
  // ==========================================
  else if (topicId === 94) {
    bodySvg = `
      <g transform="translate(120, 20)">
        <circle cx="120" cy="130" r="100" fill="rgba(56, 189, 248, 0.1)" stroke="#38bdf8" stroke-width="3" />
        <circle cx="120" cy="130" r="5" fill="#ef4444" />
        <text x="120" y="120" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#ef4444" font-weight="bold">Center O</text>
        
        <!-- Radius -->
        <line x1="120" y1="130" x2="220" y2="130" stroke="#10b981" stroke-width="3" />
        <text x="170" y="125" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#10b981" font-weight="bold">Radius r</text>
        
        <!-- Diameter -->
        <line x1="20" y1="130" x2="220" y2="130" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4,4" />
        <text x="70" y="148" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#f59e0b" font-weight="bold">Diameter d = 2r</text>

        <!-- Chord -->
        <line x1="50" y1="60" x2="190" y2="40" stroke="#ec4899" stroke-width="2.5" />
        <text x="120" y="42" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#ec4899" font-weight="bold">Chord</text>

        <text x="120" y="260" text-anchor="middle" font-family="sans-serif" font-size="15" fill="#38bdf8" font-weight="bold">Circumference C = 2πr = πd</text>
      </g>
    `;
  }

  // ==========================================
  // TOPIC 95 (T07): Area of a Circle
  // ==========================================
  else if (topicId === 95) {
    bodySvg = `
      <g transform="translate(120, 20)">
        <circle cx="120" cy="120" r="90" fill="rgba(168, 85, 247, 0.2)" stroke="#a855f7" stroke-width="3" />
        <!-- Radius line -->
        <line x1="120" y1="120" x2="210" y2="120" stroke="#f59e0b" stroke-width="3" />
        <circle cx="120" cy="120" r="4" fill="#0f172a" />
        <text x="165" y="112" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#f59e0b" font-weight="bold">r = 7 cm</text>

        <!-- Sector Cutout Derivation -->
        <path d="M 120,120 L 210,120 A 90 90 0 0 0 183.6,56.3 Z" fill="rgba(245, 158, 11, 0.5)" stroke="#f59e0b" stroke-width="2" />
        
        <text x="120" y="240" text-anchor="middle" font-family="sans-serif" font-size="15" fill="#a855f7" font-weight="bold">A = π × r² = (22/7) × 7² = 154 cm²</text>
        <text x="120" y="265" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#94a3b8">Circle Area Sector Derivation</text>
      </g>
    `;
  }

  // ==========================================
  // TOPIC 96 (T08): Composite figures (triangles, rectangles, circles, semicircles)
  // ==========================================
  else if (topicId === 96) {
    const isTriangle = params.shapeType === 'rect_tri' || (subType % 2 === 0);
    const rectW = params.rectW || 11;
    const rectH = params.rectH || 9;

    if (isTriangle) {
      const triH = params.triH || 6;
      const rectArea = rectW * rectH;
      const triArea = 0.5 * rectW * triH;
      const totalArea = rectArea + triArea;

      bodySvg = `
        <g transform="translate(90, 20)">
          <!-- Rectangle Bottom -->
          <rect x="50" y="100" width="160" height="90" fill="rgba(56, 189, 248, 0.3)" stroke="#38bdf8" stroke-width="3" />
          <!-- Triangle Top -->
          <polygon points="50,100 210,100 130,30" fill="rgba(16, 185, 129, 0.3)" stroke="#10b981" stroke-width="3" />
          <!-- Triangle Height line -->
          <line x1="130" y1="30" x2="130" y2="100" stroke="#ef4444" stroke-width="2" stroke-dasharray="4,4" />
          
          <text x="130" y="145" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#38bdf8" font-weight="bold">Rectangle (${rectW} &#215; ${rectH} cm)</text>
          <text x="130" y="70" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#10b981" font-weight="bold">Triangle (b = ${rectW}, h = ${triH} cm)</text>

          <text x="130" y="215" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#f59e0b" font-weight="bold">Total Area = Rect Area + Triangle Area</text>
          <text x="130" y="240" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#10b981" font-weight="bold">= (${rectW} &#215; ${rectH}) + (&#189; &#215; ${rectW} &#215; ${triH}) = ${rectArea} + ${triArea} = ${totalArea} cm&#178;</text>
        </g>
      `;
    } else {
      const r = params.r || (rectW / 2);
      const rectArea = rectW * rectH;
      const semiArea = Number((0.5 * 3.14 * r * r).toFixed(2));
      const totalArea = Number((rectArea + semiArea).toFixed(2));

      bodySvg = `
        <g transform="translate(90, 20)">
          <!-- Rectangle -->
          <rect x="50" y="90" width="160" height="90" fill="rgba(56, 189, 248, 0.3)" stroke="#38bdf8" stroke-width="3" />
          <!-- Semicircle Top -->
          <path d="M 50,90 A 80 80 0 0 1 210,90 Z" fill="rgba(236, 72, 153, 0.3)" stroke="#ec4899" stroke-width="3" />
          
          <text x="130" y="140" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#38bdf8" font-weight="bold">Rectangle (${rectW} &#215; ${rectH} cm)</text>
          <text x="130" y="65" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#ec4899" font-weight="bold">Semicircle (r = ${r} cm)</text>

          <text x="130" y="210" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#f59e0b" font-weight="bold">Total Area = Rect Area + Semicircle Area</text>
          <text x="130" y="235" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#10b981" font-weight="bold">= (${rectW} &#215; ${rectH}) + (&#189; &#215; 3.14 &#215; ${r}&#178;) &#8776; ${totalArea} cm&#178;</text>
        </g>
      `;
    }
  }

  // ==========================================
  // TOPIC 97 (T09): Four Operations with Decimals
  // ==========================================
  else if (topicId === 97) {
    bodySvg = `
      <g transform="translate(100, 30)">
        <rect x="20" y="20" width="240" height="180" fill="#1e293b" stroke="#38bdf8" stroke-width="2" rx="8" />
        <text x="140" y="55" text-anchor="middle" font-family="monospace" font-size="18" fill="#ffffff">  145.8500</text>
        <text x="140" y="85" text-anchor="middle" font-family="monospace" font-size="18" fill="#ffffff">+  23.4072</text>
        <line x1="40" y1="100" x2="240" y2="100" stroke="#f59e0b" stroke-width="3" />
        <text x="140" y="135" text-anchor="middle" font-family="monospace" font-size="20" fill="#f59e0b" font-weight="bold">  169.2572</text>
        <line x1="135" y1="35" x2="135" y2="150" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="3,3" />
        <text x="140" y="180" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#ef4444">Vertical Decimal Alignment Rule</text>
      </g>
    `;
  }

  // ==========================================
  // TOPIC 98 (T10): Four Operations with Fractions
  // ==========================================
  else if (topicId === 98) {
    bodySvg = `
      <g transform="translate(80, 40)">
        <!-- Bar 1: 3/4 -->
        <rect x="20" y="30" width="240" height="40" fill="#1e293b" stroke="#94a3b8" stroke-width="2" rx="4" />
        <rect x="20" y="30" width="180" height="40" fill="#38bdf8" rx="4" />
        <text x="270" y="55" font-family="sans-serif" font-size="16" fill="#38bdf8" font-weight="bold">¾</text>
        
        <!-- Bar 2: 2/3 -->
        <rect x="20" y="100" width="240" height="40" fill="#1e293b" stroke="#94a3b8" stroke-width="2" rx="4" />
        <rect x="20" y="100" width="160" height="40" fill="#ec4899" rx="4" />
        <text x="270" y="125" font-family="sans-serif" font-size="16" fill="#ec4899" font-weight="bold">⅔</text>

        <text x="140" y="185" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#f59e0b" font-weight="bold">Common Denominator LCD = 12</text>
        <text x="140" y="210" text-anchor="middle" font-family="sans-serif" font-size="15" fill="#ffffff">¾ + ⅔ = 9/12 + 8/12 = 17/12 = 1 ⁵/₁₂</text>
      </g>
    `;
  }

  // ==========================================
  // TOPIC 99 (T11): Ratio and Proportion
  // ==========================================
  else if (topicId === 99) {
    bodySvg = `
      <g transform="translate(80, 40)">
        <text x="0" y="40" font-family="sans-serif" font-size="15" fill="#38bdf8" font-weight="bold">Quantity A:</text>
        <rect x="100" y="20" width="40" height="30" fill="#38bdf8" stroke="#0f172a" stroke-width="2" />
        <rect x="140" y="20" width="40" height="30" fill="#38bdf8" stroke="#0f172a" stroke-width="2" />
        <rect x="180" y="20" width="40" height="30" fill="#38bdf8" stroke="#0f172a" stroke-width="2" />

        <text x="0" y="110" font-family="sans-serif" font-size="15" fill="#f59e0b" font-weight="bold">Quantity B:</text>
        <rect x="100" y="90" width="40" height="30" fill="#f59e0b" stroke="#0f172a" stroke-width="2" />
        <rect x="140" y="90" width="40" height="30" fill="#f59e0b" stroke="#0f172a" stroke-width="2" />
        <rect x="180" y="90" width="40" height="30" fill="#f59e0b" stroke="#0f172a" stroke-width="2" />
        <rect x="220" y="90" width="40" height="30" fill="#f59e0b" stroke="#0f172a" stroke-width="2" />
        <rect x="260" y="90" width="40" height="30" fill="#f59e0b" stroke="#0f172a" stroke-width="2" />

        <text x="150" y="170" text-anchor="middle" font-family="sans-serif" font-size="16" fill="#10b981" font-weight="bold">Ratio A : B = 3 : 5</text>
        <text x="150" y="195" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#94a3b8">Equivalent Proportion: 3/5 = 12/20</text>
      </g>
    `;
  }

  // ==========================================
  // TOPIC 100 (T12): Percentages and Relationships
  // ==========================================
  else if (topicId === 100) {
    bodySvg = `
      <g transform="translate(100, 20)">
        <rect x="0" y="0" width="160" height="160" fill="#1e293b" stroke="#94a3b8" stroke-width="2" />
        <!-- 40% Shaded -->
        <rect x="0" y="0" width="160" height="64" fill="#10b981" opacity="0.8" />
        <path d="M 0,32 L 160,32 M 0,64 L 160,64 M 0,96 L 160,96 M 0,128 L 160,128" stroke="#94a3b8" stroke-width="1" />
        <path d="M 32,0 L 32,160 M 64,0 L 64,160 M 96,0 L 96,160 M 128,0 L 128,160" stroke="#94a3b8" stroke-width="1" />

        <text x="80" y="190" text-anchor="middle" font-family="sans-serif" font-size="15" fill="#10b981" font-weight="bold">40 Grid Squares Shaded = 40%</text>
        <text x="80" y="215" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#38bdf8">Percentage: 40% = Decimal: 0.40 = Fraction: 2/5</text>
      </g>
    `;
  }

  // ==========================================
  // TOPIC 101 (T13): Exponential Form & GEMDAS Rules
  // ==========================================
  else if (topicId === 101) {
    bodySvg = `
      <g transform="translate(100, 30)">
        <rect x="40" y="20" width="200" height="80" fill="#1e293b" stroke="#ec4899" stroke-width="3" rx="8" />
        <text x="110" y="75" font-family="sans-serif" font-size="42" fill="#ec4899" font-weight="bold">5</text>
        <text x="140" y="50" font-family="sans-serif" font-size="28" fill="#f59e0b" font-weight="bold">4</text>

        <text x="80" y="130" font-family="sans-serif" font-size="13" fill="#ec4899" font-weight="bold">Base = 5</text>
        <text x="170" y="130" font-family="sans-serif" font-size="13" fill="#f59e0b" font-weight="bold">Exponent = 4</text>

        <text x="140" y="170" text-anchor="middle" font-family="sans-serif" font-size="15" fill="#38bdf8" font-weight="bold">5⁴ = 5 × 5 × 5 × 5 = 625</text>
        <text x="140" y="195" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#94a3b8">GEMDAS Order: Groupings → Exponents → Multiply/Divide</text>
      </g>
    `;
  }

  // ==========================================
  // TOPIC 102 (T14): Common Factors, GCF, and LCM
  // ==========================================
  else if (topicId === 102) {
    bodySvg = `
      <g transform="translate(80, 30)">
        <!-- Circle A -->
        <circle cx="100" cy="90" r="70" fill="rgba(56, 189, 248, 0.25)" stroke="#38bdf8" stroke-width="3" />
        <!-- Circle B -->
        <circle cx="180" cy="90" r="70" fill="rgba(245, 158, 11, 0.25)" stroke="#f59e0b" stroke-width="3" />

        <text x="60" y="95" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#38bdf8" font-weight="bold">2, 4</text>
        <text x="140" y="95" text-anchor="middle" font-family="sans-serif" font-size="15" fill="#10b981" font-weight="bold">1, 3, 6, 12</text>
        <text x="220" y="95" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#f59e0b" font-weight="bold">9, 18, 36</text>

        <text x="60" y="185" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#38bdf8">Factors of 24</text>
        <text x="220" y="185" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#f59e0b">Factors of 36</text>

        <text x="140" y="215" text-anchor="middle" font-family="sans-serif" font-size="15" fill="#10b981" font-weight="bold">GCF(24, 36) = 12</text>
      </g>
    `;
  }

  // ==========================================
  // TOPIC 103 (T15): Pie Graphs
  // ==========================================
  else if (topicId === 103) {
    bodySvg = `
      <g transform="translate(100, 20)">
        <circle cx="120" cy="120" r="90" fill="#0f172a" stroke="#475569" stroke-width="2" />
        <!-- Slice 1: 40% (144 deg) -->
        <path d="M 120,120 L 120,30 A 90 90 0 0 1 205.5,147.8 Z" fill="#38bdf8" stroke="#0f172a" stroke-width="2" />
        <!-- Slice 2: 30% (108 deg) -->
        <path d="M 120,120 L 205.5,147.8 A 90 90 0 0 1 76.5,198.8 Z" fill="#f59e0b" stroke="#0f172a" stroke-width="2" />
        <!-- Slice 3: 20% (72 deg) -->
        <path d="M 120,120 L 76.5,198.8 A 90 90 0 0 1 34.5,92.2 Z" fill="#10b981" stroke="#0f172a" stroke-width="2" />
        <!-- Slice 4: 10% (36 deg) -->
        <path d="M 120,120 L 34.5,92.2 A 90 90 0 0 1 120,30 Z" fill="#ec4899" stroke="#0f172a" stroke-width="2" />

        <!-- Legend -->
        <rect x="230" y="30" width="15" height="15" fill="#38bdf8" />
        <text x="255" y="43" font-family="sans-serif" font-size="12" fill="#ffffff">Banana (40% / 144°)</text>

        <rect x="230" y="60" width="15" height="15" fill="#f59e0b" />
        <text x="255" y="73" font-family="sans-serif" font-size="12" fill="#ffffff">Mango (30% / 108°)</text>

        <rect x="230" y="90" width="15" height="15" fill="#10b981" />
        <text x="255" y="103" font-family="sans-serif" font-size="12" fill="#ffffff">Apple (20% / 72°)</text>

        <rect x="230" y="120" width="15" height="15" fill="#ec4899" />
        <text x="255" y="133" font-family="sans-serif" font-size="12" fill="#ffffff">Orange (10% / 36°)</text>

        <text x="140" y="240" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#38bdf8" font-weight="bold">Total Central Angle = 360° = 100%</text>
      </g>
    `;
  } else {
    bodySvg = `
      <g transform="translate(60, 40)">
        <rect x="20" y="20" width="320" height="180" fill="rgba(56, 189, 248, 0.1)" stroke="#38bdf8" stroke-width="2" rx="8" />
        <text x="180" y="110" text-anchor="middle" font-family="sans-serif" font-size="16" fill="#38bdf8" font-weight="bold">${title}</text>
      </g>
    `;
  }

  const fullSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
    </marker>
  </defs>
  <rect width="100%" height="100%" fill="#0f172a" />
  ${bodySvg}
</svg>`;

  const fileName = `g6_t${topicId}_q${qIndex + 1}.svg`;
  const publicPath = path.join(publicImagesDir, fileName);
  const rootPath = path.join(rootImagesDir, fileName);
  const distPath = path.join(distImagesDir, fileName);

  fs.writeFileSync(publicPath, fullSvg, 'utf8');
  fs.writeFileSync(rootPath, fullSvg, 'utf8');
  fs.writeFileSync(distPath, fullSvg, 'utf8');

  return `/images/${fileName}`;
}
