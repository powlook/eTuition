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

export function generateGrade9MgSvg(topicId, qIndex, params = {}) {
  const width = 480;
  const height = 380;
  const subType = qIndex % 10;
  const title = params.title || `Grade 9 Topic ${topicId} Diagram #${qIndex + 1}`;

  let bodySvg = '';

  // ==========================================
  // TOPIC 144: Simple Geometric Concepts & Notations
  // ==========================================
  if (topicId === 144) {
    if (subType === 0) { // Point, Line, Plane
      bodySvg = `
        <g transform="translate(80, 80)">
          <!-- Plane -->
          <polygon points="0,60 220,60 300,190 80,190" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" stroke-width="2" />
          <text x="240" y="85" font-family="sans-serif" font-size="14" fill="#38bdf8" font-weight="bold">Plane P</text>
          <!-- Line AB -->
          <line x1="40" y1="150" x2="260" y2="90" stroke="#f59e0b" stroke-width="3" />
          <circle cx="90" cy="137" r="5" fill="#10b981" />
          <circle cx="210" cy="103" r="5" fill="#10b981" />
          <text x="85" y="160" font-family="sans-serif" font-size="13" fill="#10b981" font-weight="bold">Point A</text>
          <text x="210" y="90" font-family="sans-serif" font-size="13" fill="#10b981" font-weight="bold">Point B</text>
          <text x="150" y="110" font-family="sans-serif" font-size="13" fill="#f59e0b" font-weight="bold">Line AB (←AB→)</text>
        </g>
      `;
    } else if (subType === 1 || subType === 2) { // Ray AB vs Ray BA
      bodySvg = `
        <g transform="translate(90, 100)">
          <!-- Ray AB -->
          <line x1="30" y1="60" x2="270" y2="60" stroke="#38bdf8" stroke-width="3" />
          <polygon points="270,54 285,60 270,66" fill="#38bdf8" />
          <circle cx="40" cy="60" r="5" fill="#f59e0b" />
          <circle cx="180" cy="60" r="5" fill="#10b981" />
          <text x="35" y="45" font-family="sans-serif" font-size="13" fill="#f59e0b" font-weight="bold">Endpoint A</text>
          <text x="175" y="45" font-family="sans-serif" font-size="13" fill="#10b981" font-weight="bold">Point B</text>
          <text x="140" y="90" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#38bdf8" font-weight="bold">Ray AB (→AB)</text>

          <!-- Ray BA -->
          <line x1="30" y1="160" x2="270" y2="160" stroke="#ec4899" stroke-width="3" />
          <polygon points="30,154 15,160 30,166" fill="#ec4899" />
          <circle cx="40" cy="160" r="5" fill="#10b981" />
          <circle cx="180" cy="160" r="5" fill="#f59e0b" />
          <text x="35" y="185" font-family="sans-serif" font-size="13" fill="#10b981" font-weight="bold">Point A</text>
          <text x="175" y="185" font-family="sans-serif" font-size="13" fill="#f59e0b" font-weight="bold">Endpoint B</text>
          <text x="140" y="210" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#ec4899" font-weight="bold">Ray BA (←BA)</text>
        </g>
      `;
    } else if (subType === 3 || subType === 4) { // Collinear & Coplanar Points
      bodySvg = `
        <g transform="translate(80, 90)">
          <line x1="20" y1="120" x2="300" y2="120" stroke="#38bdf8" stroke-width="3" />
          <circle cx="50" cy="120" r="5" fill="#10b981" />
          <circle cx="160" cy="120" r="5" fill="#f59e0b" />
          <circle cx="270" cy="120" r="5" fill="#ec4899" />
          <text x="45" y="100" font-family="sans-serif" font-size="13" fill="#10b981" font-weight="bold">Point P</text>
          <text x="155" y="100" font-family="sans-serif" font-size="13" fill="#f59e0b" font-weight="bold">Point Q</text>
          <text x="265" y="100" font-family="sans-serif" font-size="13" fill="#ec4899" font-weight="bold">Point R</text>
          <text x="160" y="160" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#38bdf8" font-weight="bold">Collinear Points (P, Q, R on line l)</text>
        </g>
      `;
    } else if (subType === 5) { // Segment Addition Postulate
      bodySvg = `
        <g transform="translate(80, 100)">
          <line x1="30" y1="120" x2="270" y2="120" stroke="#38bdf8" stroke-width="4" />
          <circle cx="30" cy="120" r="6" fill="#f59e0b" />
          <circle cx="150" cy="120" r="6" fill="#10b981" />
          <circle cx="270" cy="120" r="6" fill="#ec4899" />
          <text x="25" y="95" font-family="sans-serif" font-size="14" fill="#f59e0b" font-weight="bold">A</text>
          <text x="145" y="95" font-family="sans-serif" font-size="14" fill="#10b981" font-weight="bold">M</text>
          <text x="265" y="95" font-family="sans-serif" font-size="14" fill="#ec4899" font-weight="bold">B</text>
          <text x="150" y="170" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#38bdf8" font-weight="bold">AM + MB = AB</text>
        </g>
      `;
    } else { // Angle Pairs (Supplementary / Complementary / Vertical)
      bodySvg = `
        <g transform="translate(100, 80)">
          <line x1="20" y1="180" x2="260" y2="180" stroke="#94a3b8" stroke-width="3" />
          <line x1="140" y1="180" x2="230" y2="40" stroke="#38bdf8" stroke-width="3" />
          <line x1="140" y1="180" x2="140" y2="40" stroke="#10b981" stroke-width="3" stroke-dasharray="4,4" />
          <text x="175" y="150" font-family="sans-serif" font-size="13" fill="#38bdf8" font-weight="bold">∠1</text>
          <text x="100" y="150" font-family="sans-serif" font-size="13" fill="#10b981" font-weight="bold">∠2</text>
          <text x="140" y="215" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#e2e8f0" font-weight="bold">Linear Pair: ∠1 + ∠2 = 180°</text>
        </g>
      `;
    }
  }

  // ==========================================
  // TOPIC 145 & 146: Transversal & Parallel / Perpendicular Lines
  // ==========================================
  else if (topicId === 145 || topicId === 146) {
    bodySvg = `
      <g transform="translate(80, 70)">
        <!-- Parallel Line 1 -->
        <line x1="20" y1="80" x2="300" y2="80" stroke="#38bdf8" stroke-width="3" />
        <text x="310" y="85" font-family="sans-serif" font-size="13" fill="#38bdf8" font-weight="bold">Line L1</text>
        <!-- Parallel Line 2 -->
        <line x1="20" y1="180" x2="300" y2="180" stroke="#38bdf8" stroke-width="3" />
        <text x="310" y="185" font-family="sans-serif" font-size="13" fill="#38bdf8" font-weight="bold">Line L2</text>
        <!-- Transversal Line T -->
        <line x1="70" y1="20" x2="250" y2="240" stroke="#f59e0b" stroke-width="3" />
        <text x="260" y="245" font-family="sans-serif" font-size="13" fill="#f59e0b" font-weight="bold">Transversal T</text>

        <!-- Angle markers -->
        <text x="135" y="70" font-family="sans-serif" font-size="12" fill="#10b981" font-weight="bold">∠1</text>
        <text x="105" y="105" font-family="sans-serif" font-size="12" fill="#10b981" font-weight="bold">∠4</text>
        <text x="200" y="170" font-family="sans-serif" font-size="12" fill="#10b981" font-weight="bold">∠5</text>
        <text x="175" y="205" font-family="sans-serif" font-size="12" fill="#10b981" font-weight="bold">∠8</text>

        <rect x="40" y="240" width="240" height="28" rx="6" fill="rgba(16, 185, 129, 0.9)" />
        <text x="160" y="259" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff">Corresponding Angles: ∠1 = ∠5</text>
      </g>
    `;
  }

  // ==========================================
  // TOPIC 147: Quadrilaterals and Properties
  // ==========================================
  else if (topicId === 147) {
    if (subType === 0 || subType === 1) { // Parallelogram
      bodySvg = `
        <g transform="translate(100, 80)">
          <polygon points="60,30 250,30 190,180 0,180" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" stroke-width="3" />
          <line x1="60" y1="30" x2="190" y2="180" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4,4" />
          <line x1="250" y1="30" x2="0" y2="180" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4,4" />
          <text x="-15" y="195" font-family="sans-serif" font-size="13" fill="#38bdf8" font-weight="bold">A</text>
          <text x="50" y="20" font-family="sans-serif" font-size="13" fill="#38bdf8" font-weight="bold">B</text>
          <text x="260" y="20" font-family="sans-serif" font-size="13" fill="#38bdf8" font-weight="bold">C</text>
          <text x="200" y="195" font-family="sans-serif" font-size="13" fill="#38bdf8" font-weight="bold">D</text>
          <text x="125" y="225" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#10b981" font-weight="bold">Parallelogram (Diagonals Bisect)</text>
        </g>
      `;
    } else if (subType === 2 || subType === 3) { // Rhombus / Square
      bodySvg = `
        <g transform="translate(140, 70)">
          <polygon points="100,20 190,110 100,200 10,110" fill="rgba(236, 72, 153, 0.15)" stroke="#ec4899" stroke-width="3" />
          <line x1="100" y1="20" x2="100" y2="200" stroke="#f59e0b" stroke-width="2" />
          <line x1="10" y1="110" x2="190" y2="110" stroke="#f59e0b" stroke-width="2" />
          <rect x="90" y="100" width="10" height="10" fill="none" stroke="#10b981" stroke-width="1.5" />
          <text x="100" y="225" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#ec4899" font-weight="bold">Rhombus (Perpendicular Diagonals ⊥)</text>
        </g>
      `;
    } else { // Trapezoid / Kite
      bodySvg = `
        <g transform="translate(100, 80)">
          <polygon points="50,30 190,30 250,180 0,180" fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" stroke-width="3" />
          <line x1="50" y1="30" x2="0" y2="180" stroke="#f59e0b" stroke-width="2.5" />
          <line x1="190" y1="30" x2="250" y2="180" stroke="#f59e0b" stroke-width="2.5" />
          <text x="125" y="215" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#10b981" font-weight="bold">Isosceles Trapezoid (Legs Congruent)</text>
        </g>
      `;
    }
  }

  // ==========================================
  // TOPIC 148 & 149: Triangle Congruence & Proofs
  // ==========================================
  else if (topicId === 148 || topicId === 149) {
    bodySvg = `
      <!-- Triangle ABC -->
      <g transform="translate(50, 90)">
        <polygon points="0,140 120,140 70,20" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" stroke-width="3" />
        <text x="60" y="165" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#38bdf8" font-weight="bold">ΔABC</text>
      </g>
      <!-- Congruence Symbol -->
      <text x="240" y="170" font-family="sans-serif" font-size="28" fill="#f59e0b" font-weight="bold">≅</text>
      <!-- Triangle DEF -->
      <g transform="translate(290, 90)">
        <polygon points="0,140 120,140 70,20" fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" stroke-width="3" />
        <text x="60" y="165" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#10b981" font-weight="bold">ΔDEF</text>
      </g>
      <text x="240" y="260" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#f59e0b" font-weight="bold">SSS / SAS / ASA / AAS Congruence</text>
    `;
  }

  // ==========================================
  // TOPIC 150: Similarity of Polygons
  // ==========================================
  else if (topicId === 150) {
    bodySvg = `
      <!-- Small Triangle -->
      <g transform="translate(70, 110)">
        <polygon points="0,100 80,100 50,20" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" stroke-width="2.5" />
        <text x="40" y="125" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#38bdf8" font-weight="bold">Scale 1</text>
      </g>
      <!-- Similarity Symbol -->
      <text x="210" y="170" font-family="sans-serif" font-size="28" fill="#f59e0b" font-weight="bold">~</text>
      <!-- Large Triangle -->
      <g transform="translate(270, 70)">
        <polygon points="0,150 140,150 90,30" fill="rgba(236, 72, 153, 0.15)" stroke="#ec4899" stroke-width="3" />
        <text x="70" y="178" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#ec4899" font-weight="bold">Scale k</text>
      </g>
      <text x="240" y="260" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#10b981" font-weight="bold">Similar Polygons: Sides in ratio k, Area ratio k²</text>
    `;
  }

  // ==========================================
  // TOPIC 151: Special Triangles (45-45-90 & 30-60-90)
  // ==========================================
  else if (topicId === 151) {
    if (subType < 5) { // 45-45-90 Triangle
      bodySvg = `
        <g transform="translate(130, 80)">
          <polygon points="0,180 180,180 0,0" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" stroke-width="3" />
          <rect x="0" y="160" width="20" height="20" fill="none" stroke="#f59e0b" stroke-width="2" />
          <text x="90" y="205" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#e2e8f0" font-weight="bold">Leg x</text>
          <text x="-40" y="100" font-family="sans-serif" font-size="13" fill="#e2e8f0" font-weight="bold">Leg x</text>
          <text x="100" y="85" font-family="sans-serif" font-size="14" fill="#10b981" font-weight="bold">Hypotenuse x√2</text>
          <text x="140" y="165" font-family="sans-serif" font-size="12" fill="#f59e0b" font-weight="bold">45°</text>
          <text x="25" y="45" font-family="sans-serif" font-size="12" fill="#f59e0b" font-weight="bold">45°</text>
        </g>
      `;
    } else { // 30-60-90 Triangle
      bodySvg = `
        <g transform="translate(120, 80)">
          <polygon points="0,180 200,180 0,65" fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" stroke-width="3" />
          <rect x="0" y="160" width="20" height="20" fill="none" stroke="#f59e0b" stroke-width="2" />
          <text x="100" y="205" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#e2e8f0" font-weight="bold">Longer Leg x√3</text>
          <text x="-45" y="130" font-family="sans-serif" font-size="13" fill="#e2e8f0" font-weight="bold">Shorter x</text>
          <text x="110" y="110" font-family="sans-serif" font-size="14" fill="#38bdf8" font-weight="bold">Hypotenuse 2x</text>
          <text x="160" y="165" font-family="sans-serif" font-size="12" fill="#f59e0b" font-weight="bold">30°</text>
          <text x="25" y="95" font-family="sans-serif" font-size="12" fill="#f59e0b" font-weight="bold">60°</text>
        </g>
      `;
    }
  }

  // ==========================================
  // TOPIC 152: Triangle Theorems & Inequality
  // ==========================================
  else if (topicId === 152) {
    bodySvg = `
      <g transform="translate(110, 80)">
        <polygon points="0,180 240,180 100,30" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" stroke-width="3" />
        <line x1="50" y1="105" x2="170" y2="105" stroke="#f59e0b" stroke-width="3" />
        <circle cx="50" cy="105" r="4" fill="#f59e0b" />
        <circle cx="170" cy="105" r="4" fill="#f59e0b" />
        <text x="110" y="95" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#f59e0b" font-weight="bold">Midsegment DE = ½ BC</text>
        <text x="120" y="205" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#38bdf8" font-weight="bold">Base BC</text>
      </g>
    `;
  }

  // ==========================================
  // TOPIC 153: Trigonometric Ratios (SOH-CAH-TOA)
  // ==========================================
  else if (topicId === 153) {
    bodySvg = `
      <g transform="translate(110, 80)">
        <polygon points="0,180 220,180 0,20" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" stroke-width="3" />
        <rect x="0" y="160" width="20" height="20" fill="none" stroke="#f59e0b" stroke-width="2" />
        <path d="M 180 180 A 40 40 0 0 0 160 150" fill="none" stroke="#ec4899" stroke-width="2.5" />
        <text x="140" y="165" font-family="sans-serif" font-size="14" fill="#ec4899" font-weight="bold">θ</text>
        <text x="110" y="205" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#e2e8f0" font-weight="bold">Adjacent</text>
        <text x="-40" y="100" font-family="sans-serif" font-size="13" fill="#e2e8f0" font-weight="bold">Opposite</text>
        <text x="125" y="90" font-family="sans-serif" font-size="14" fill="#10b981" font-weight="bold">Hypotenuse</text>

        <rect x="10" y="220" width="240" height="30" rx="6" fill="rgba(16, 185, 129, 0.9)" />
        <text x="130" y="240" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff">SOH-CAH-TOA: sin θ = Opp/Hyp</text>
      </g>
    `;
  }

  const rawSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <rect width="100%" height="100%" fill="#0f172a" rx="12" />

  <!-- Header Title -->
  <rect x="16" y="12" width="${width - 32}" height="28" rx="6" fill="rgba(56, 189, 248, 0.12)" stroke="rgba(56, 189, 248, 0.3)" />
  <text x="${width / 2}" y="31" text-anchor="middle" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#38bdf8">
    ${title}
  </text>

  <!-- Body Content -->
  ${bodySvg}
</svg>`;

  return rawSvg.replace(/(<text[^>]*>)([\s\S]*?)(<\/text>)/gi, (match, openTag, textContent, closeTag) => {
    let sanitizedText = textContent
      .replace(/&(?!(amp|lt|gt|quot|apos);)/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return openTag + sanitizedText + closeTag;
  });
}

export function saveGrade9MgSvgPlots() {
  console.log('Generating 500 Grade 9 Measurement & Geometry SVG plot files (Topics 144 to 153)...');
  const topicIds = [144, 145, 146, 147, 148, 149, 150, 151, 152, 153];
  let totalSaved = 0;

  for (const topicId of topicIds) {
    for (let qIndex = 0; qIndex < 50; qIndex++) {
      const title = `Grade 9 Topic ${topicId} Diagram #${qIndex + 1}`;
      const svg = generateGrade9MgSvg(topicId, qIndex, { title });
      const fileName = `g9_t${topicId}_q${qIndex + 1}.svg`;

      fs.writeFileSync(path.join(publicImagesDir, fileName), svg);
      fs.writeFileSync(path.join(rootImagesDir, fileName), svg);
      totalSaved++;
    }
  }
  console.log(`✅ Created ${totalSaved} Grade 9 Measurement & Geometry SVG plot files in public/images/ and images/!`);
}

if (process.argv[1] && process.argv[1].endsWith('generate_g9_mg_svgs.js')) {
  saveGrade9MgSvgPlots();
}
