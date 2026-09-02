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

export function generateGrade9NaSvg(topicId, qIndex, params = {}) {
  const width = 480;
  const height = 380;
  const subType = qIndex % 10;
  const title = params.title || `Grade 9 Topic ${topicId} Diagram #${qIndex + 1}`;

  let bodySvg = '';

  // ==========================================
  // TOPIC 154: Relations and Functions
  // ==========================================
  if (topicId === 154) {
    if (subType === 0 || subType === 1) { // Mapping Diagram
      bodySvg = `
        <g transform="translate(90, 80)">
          <!-- Domain Set X -->
          <ellipse cx="60" cy="110" rx="45" ry="80" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" stroke-width="2.5" />
          <text x="60" y="15" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#38bdf8" font-weight="bold">Domain X</text>
          <text x="60" y="60" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#e2e8f0">1</text>
          <text x="60" y="100" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#e2e8f0">2</text>
          <text x="60" y="140" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#e2e8f0">3</text>
          <text x="60" y="180" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#e2e8f0">4</text>

          <!-- Range Set Y -->
          <ellipse cx="240" cy="110" rx="45" ry="80" fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" stroke-width="2.5" />
          <text x="240" y="15" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#10b981" font-weight="bold">Range Y</text>
          <text x="240" y="60" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#e2e8f0">3</text>
          <text x="240" y="100" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#e2e8f0">5</text>
          <text x="240" y="140" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#e2e8f0">7</text>
          <text x="240" y="180" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#e2e8f0">9</text>

          <!-- Mapping Arrows -->
          <line x1="80" y1="58" x2="220" y2="58" stroke="#f59e0b" stroke-width="2" marker-end="url(#arrow)" />
          <line x1="80" y1="98" x2="220" y2="98" stroke="#f59e0b" stroke-width="2" marker-end="url(#arrow)" />
          <line x1="80" y1="138" x2="220" y2="138" stroke="#f59e0b" stroke-width="2" marker-end="url(#arrow)" />
          <line x1="80" y1="178" x2="220" y2="178" stroke="#f59e0b" stroke-width="2" marker-end="url(#arrow)" />

          <rect x="50" y="215" width="200" height="28" rx="6" fill="rgba(16, 185, 129, 0.9)" />
          <text x="150" y="234" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff">One-to-One Function f(x)</text>
        </g>
      `;
    } else { // Vertical Line Test Graph
      bodySvg = `
        <g transform="translate(100, 80)">
          <!-- Axes -->
          <line x1="20" y1="130" x2="260" y2="130" stroke="#94a3b8" stroke-width="2" />
          <line x1="140" y1="10" x2="140" y2="230" stroke="#94a3b8" stroke-width="2" />
          <!-- Function Curve -->
          <path d="M 40 190 Q 140 20 240 190" fill="none" stroke="#38bdf8" stroke-width="3" />
          <!-- Vertical Test Line -->
          <line x1="180" y1="10" x2="180" y2="230" stroke="#ec4899" stroke-width="2.5" stroke-dasharray="6,4" />
          <circle cx="180" cy="95" r="5" fill="#10b981" />
          <text x="190" y="90" font-family="sans-serif" font-size="12" fill="#10b981" font-weight="bold">Single Intersection Point</text>
          <text x="140" y="250" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#38bdf8" font-weight="bold">Passes Vertical Line Test ⟹ Function</text>
        </g>
      `;
    }
  }

  // ==========================================
  // TOPIC 155: Graphs of Linear Functions
  // ==========================================
  else if (topicId === 155) {
    bodySvg = `
      <g transform="translate(100, 70)">
        <!-- Axes -->
        <line x1="20" y1="140" x2="260" y2="140" stroke="#94a3b8" stroke-width="2" />
        <line x1="140" y1="20" x2="140" y2="260" stroke="#94a3b8" stroke-width="2" />
        <!-- Linear Line y = mx + b -->
        <line x1="40" y1="210" x2="240" y2="70" stroke="#38bdf8" stroke-width="3.5" />

        <!-- Slope triangle -->
        <line x1="140" y1="140" x2="190" y2="140" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4,4" />
        <line x1="190" y1="140" x2="190" y2="105" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4,4" />
        <text x="165" y="158" font-family="sans-serif" font-size="11" fill="#f59e0b" font-weight="bold">Run Δx</text>
        <text x="198" y="125" font-family="sans-serif" font-size="11" fill="#f59e0b" font-weight="bold">Rise Δy</text>

        <!-- Intercepts -->
        <circle cx="140" cy="140" r="5" fill="#10b981" />
        <text x="110" y="130" font-family="sans-serif" font-size="12" fill="#10b981" font-weight="bold">y-intercept (0, b)</text>

        <rect x="30" y="270" width="220" height="28" rx="6" fill="rgba(56, 189, 248, 0.9)" />
        <text x="140" y="289" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff">Slope m = Δy / Δx (Rise / Run)</text>
      </g>
    `;
  }

  // ==========================================
  // TOPIC 156: Quadratic Functions & Parabolas
  // ==========================================
  else if (topicId === 156) {
    const isUpwards = subType % 2 === 0;
    bodySvg = `
      <g transform="translate(100, 70)">
        <!-- Axes -->
        <line x1="20" y1="160" x2="260" y2="160" stroke="#94a3b8" stroke-width="2" />
        <line x1="140" y1="20" x2="140" y2="260" stroke="#94a3b8" stroke-width="2" />

        ${isUpwards ? `
          <!-- Upward Parabola -->
          <path d="M 40 40 Q 140 230 240 40" fill="none" stroke="#38bdf8" stroke-width="3.5" />
          <circle cx="140" cy="180" r="6" fill="#f59e0b" />
          <!-- Axis of Symmetry -->
          <line x1="140" y1="20" x2="140" y2="260" stroke="#ec4899" stroke-width="2" stroke-dasharray="6,4" />
          <text x="140" y="205" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#f59e0b" font-weight="bold">Vertex (h, k) [Minimum]</text>
          <text x="140" y="275" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#ec4899" font-weight="bold">Axis of Symmetry x = h (a > 0)</text>
        ` : `
          <!-- Downward Parabola -->
          <path d="M 40 240 Q 140 30 240 240" fill="none" stroke="#ec4899" stroke-width="3.5" />
          <circle cx="140" cy="80" r="6" fill="#f59e0b" />
          <line x1="140" y1="20" x2="140" y2="260" stroke="#38bdf8" stroke-width="2" stroke-dasharray="6,4" />
          <text x="140" y="65" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#f59e0b" font-weight="bold">Vertex (h, k) [Maximum]</text>
          <text x="140" y="275" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#38bdf8" font-weight="bold">Axis of Symmetry x = h (a &lt; 0)</text>
        `}
      </g>
    `;
  }

  // ==========================================
  // TOPIC 157: Solution of Quadratic Equations
  // ==========================================
  else if (topicId === 157) {
    bodySvg = `
      <g transform="translate(100, 70)">
        <!-- Axes -->
        <line x1="20" y1="160" x2="260" y2="160" stroke="#94a3b8" stroke-width="2" />
        <line x1="140" y1="20" x2="140" y2="260" stroke="#94a3b8" stroke-width="2" />
        <!-- Parabola crossing x-axis twice -->
        <path d="M 50 60 Q 140 240 230 60" fill="none" stroke="#38bdf8" stroke-width="3.5" />
        <!-- Roots / Intercepts -->
        <circle cx="85" cy="160" r="6" fill="#10b981" />
        <circle cx="195" cy="160" r="6" fill="#10b981" />
        <text x="75" y="145" font-family="sans-serif" font-size="12" fill="#10b981" font-weight="bold">Root x₁</text>
        <text x="185" y="145" font-family="sans-serif" font-size="12" fill="#10b981" font-weight="bold">Root x₂</text>

        <rect x="30" y="270" width="220" height="28" rx="6" fill="rgba(16, 185, 129, 0.9)" />
        <text x="140" y="289" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff">Discriminant Δ = b² - 4ac > 0 (2 Real Roots)</text>
      </g>
    `;
  }

  // ==========================================
  // TOPIC 158: Direct and Inverse Variation
  // ==========================================
  else if (topicId === 158) {
    if (subType < 5) { // Direct Variation y = kx
      bodySvg = `
        <g transform="translate(100, 70)">
          <!-- Axes -->
          <line x1="20" y1="220" x2="260" y2="220" stroke="#94a3b8" stroke-width="2" />
          <line x1="40" y1="20" x2="40" y2="240" stroke="#94a3b8" stroke-width="2" />
          <!-- Direct Variation Line passing through Origin -->
          <line x1="40" y1="220" x2="240" y2="40" stroke="#38bdf8" stroke-width="3.5" />
          <circle cx="40" cy="220" r="6" fill="#f59e0b" />
          <text x="65" y="210" font-family="sans-serif" font-size="12" fill="#f59e0b" font-weight="bold">Origin (0,0)</text>

          <rect x="40" y="250" width="200" height="28" rx="6" fill="rgba(56, 189, 248, 0.9)" />
          <text x="140" y="269" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff">Direct Variation: y = kx</text>
        </g>
      `;
    } else { // Inverse Variation y = k/x
      bodySvg = `
        <g transform="translate(100, 70)">
          <!-- Axes -->
          <line x1="20" y1="220" x2="260" y2="220" stroke="#94a3b8" stroke-width="2" />
          <line x1="40" y1="20" x2="40" y2="240" stroke="#94a3b8" stroke-width="2" />
          <!-- Hyperbola Curve -->
          <path d="M 50 40 Q 65 190 250 210" fill="none" stroke="#ec4899" stroke-width="3.5" />

          <rect x="40" y="250" width="200" height="28" rx="6" fill="rgba(236, 72, 153, 0.9)" />
          <text x="140" y="269" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff">Inverse Variation: y = k / x (xy = k)</text>
        </g>
      `;
    }
  }

  const rawSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
    </marker>
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

  return rawSvg.replace(/(<text[^>]*>)([\s\S]*?)(<\/text>)/gi, (match, openTag, textContent, closeTag) => {
    let sanitizedText = textContent
      .replace(/&(?!(amp|lt|gt|quot|apos);)/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return openTag + sanitizedText + closeTag;
  });
}

export function saveGrade9NaSvgPlots() {
  console.log('Generating 250 Grade 9 Number & Algebra SVG plot files (Topics 154 to 158)...');
  const topicIds = [154, 155, 156, 157, 158];
  let totalSaved = 0;

  for (const topicId of topicIds) {
    for (let qIndex = 0; qIndex < 50; qIndex++) {
      const title = `Grade 9 Topic ${topicId} Diagram #${qIndex + 1}`;
      const svg = generateGrade9NaSvg(topicId, qIndex, { title });
      const fileName = `g9_t${topicId}_q${qIndex + 1}.svg`;

      fs.writeFileSync(path.join(publicImagesDir, fileName), svg);
      fs.writeFileSync(path.join(rootImagesDir, fileName), svg);
      totalSaved++;
    }
  }
  console.log(`✅ Created ${totalSaved} Grade 9 Number & Algebra SVG plot files in public/images/ and images/!`);
}

if (process.argv[1] && process.argv[1].endsWith('generate_g9_na_svgs.js')) {
  saveGrade9NaSvgPlots();
}
