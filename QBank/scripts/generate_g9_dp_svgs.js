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

export function generateGrade9DpSvg(topicId, qIndex, params = {}) {
  const width = 480;
  const height = 380;
  const subType = qIndex % 10;
  const title = params.title || `Grade 9 Topic ${topicId} Diagram #${qIndex + 1}`;

  let bodySvg = '';

  // ==========================================
  // TOPIC 159: Misleading Data & Graphs
  // ==========================================
  if (topicId === 159) {
    if (subType < 5) { // Misleading Truncated Bar Chart
      bodySvg = `
        <g transform="translate(90, 70)">
          <!-- Y-Axis starting at 90 instead of 0 -->
          <line x1="40" y1="20" x2="40" y2="200" stroke="#94a3b8" stroke-width="2" />
          <line x1="40" y1="200" x2="260" y2="200" stroke="#94a3b8" stroke-width="2" />

          <!-- Y-axis labels -->
          <text x="30" y="195" text-anchor="end" font-family="sans-serif" font-size="11" fill="#ec4899" font-weight="bold">90</text>
          <text x="30" y="115" text-anchor="end" font-family="sans-serif" font-size="11" fill="#94a3b8">95</text>
          <text x="30" y="35" text-anchor="end" font-family="sans-serif" font-size="11" fill="#94a3b8">100</text>

          <!-- Break indicator on Y axis -->
          <path d="M 35 185 L 45 180 M 35 180 L 45 175" stroke="#ec4899" stroke-width="2" />

          <!-- Bar 1 (Year 1: 92) -->
          <rect x="70" y="160" width="50" height="40" fill="rgba(56, 189, 248, 0.8)" rx="4" />
          <text x="95" y="150" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#38bdf8" font-weight="bold">92</text>
          <text x="95" y="220" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#e2e8f0">Year 1</text>

          <!-- Bar 2 (Year 2: 98) -->
          <rect x="170" y="60" width="50" height="140" fill="rgba(236, 72, 153, 0.8)" rx="4" />
          <text x="195" y="50" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#ec4899" font-weight="bold">98</text>
          <text x="195" y="220" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#e2e8f0">Year 2</text>

          <rect x="20" y="245" width="240" height="28" rx="6" fill="rgba(236, 72, 153, 0.9)" />
          <text x="140" y="264" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff">Truncated Y-Axis Exaggerates Growth!</text>
        </g>
      `;
    } else { // Misleading uneven scale / 3D chart
      bodySvg = `
        <g transform="translate(100, 70)">
          <!-- Pie / 3D Slice Distortion visual -->
          <ellipse cx="140" cy="120" rx="90" ry="50" fill="rgba(56, 189, 248, 0.3)" stroke="#38bdf8" stroke-width="2" />
          <path d="M 140 120 L 225 100 A 90 50 0 0 1 170 165 Z" fill="rgba(245, 158, 11, 0.8)" stroke="#f59e0b" stroke-width="2.5" />
          <text x="210" y="145" font-family="sans-serif" font-size="12" fill="#f59e0b" font-weight="bold">Front Slice 30%</text>
          <text x="80" y="110" font-family="sans-serif" font-size="12" fill="#38bdf8" font-weight="bold">Back Slice 70%</text>

          <rect x="20" y="240" width="240" height="28" rx="6" fill="rgba(245, 158, 11, 0.9)" />
          <text x="140" y="259" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff">3D Perspective Distorts Slice Sizes</text>
        </g>
      `;
    }
  }

  // ==========================================
  // TOPIC 160: Probabilities of Simple & Compound Events
  // ==========================================
  else if (topicId === 160) {
    if (subType < 4) { // Venn Diagram (Union & Intersection)
      bodySvg = `
        <g transform="translate(100, 70)">
          <!-- Circle A -->
          <circle cx="95" cy="110" r="65" fill="rgba(56, 189, 248, 0.3)" stroke="#38bdf8" stroke-width="2.5" />
          <text x="60" y="115" font-family="sans-serif" font-size="14" fill="#38bdf8" font-weight="bold">Event A</text>

          <!-- Circle B -->
          <circle cx="175" cy="110" r="65" fill="rgba(236, 72, 153, 0.3)" stroke="#ec4899" stroke-width="2.5" />
          <text x="185" y="115" font-family="sans-serif" font-size="14" fill="#ec4899" font-weight="bold">Event B</text>

          <!-- Intersection Text -->
          <text x="135" y="115" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#f59e0b" font-weight="bold">A ∩ B</text>

          <rect x="20" y="240" width="230" height="28" rx="6" fill="rgba(16, 185, 129, 0.9)" />
          <text x="135" y="259" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff">Compound Event: P(A ∪ B) = P(A)+P(B)-P(A∩B)</text>
        </g>
      `;
    } else if (subType < 7) { // Probability Tree Diagram
      bodySvg = `
        <g transform="translate(90, 60)">
          <!-- Root -->
          <circle cx="20" cy="120" r="5" fill="#f59e0b" />
          <!-- Branch 1 -->
          <line x1="20" y1="120" x2="100" y2="60" stroke="#38bdf8" stroke-width="2.5" />
          <text x="50" y="80" font-family="sans-serif" font-size="11" fill="#38bdf8" font-weight="bold">P(H) = 0.5</text>
          <!-- Branch 2 -->
          <line x1="20" y1="120" x2="100" y2="180" stroke="#ec4899" stroke-width="2.5" />
          <text x="50" y="165" font-family="sans-serif" font-size="11" fill="#ec4899" font-weight="bold">P(T) = 0.5</text>

          <!-- Sub Branches -->
          <line x1="100" y1="60" x2="180" y2="30" stroke="#10b981" stroke-width="2" />
          <text x="200" y="35" font-family="sans-serif" font-size="11" fill="#e2e8f0">HH (0.25)</text>

          <line x1="100" y1="60" x2="180" y2="90" stroke="#10b981" stroke-width="2" />
          <text x="200" y="95" font-family="sans-serif" font-size="11" fill="#e2e8f0">HT (0.25)</text>

          <line x1="100" y1="180" x2="180" y2="150" stroke="#10b981" stroke-width="2" />
          <text x="200" y="155" font-family="sans-serif" font-size="11" fill="#e2e8f0">TH (0.25)</text>

          <line x1="100" y1="180" x2="180" y2="210" stroke="#10b981" stroke-width="2" />
          <text x="200" y="215" font-family="sans-serif" font-size="11" fill="#e2e8f0">TT (0.25)</text>

          <rect x="20" y="250" width="240" height="28" rx="6" fill="rgba(56, 189, 248, 0.9)" />
          <text x="140" y="269" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff">Tree Diagram: Multiply Branch Probabilities</text>
        </g>
      `;
    } else { // Probability Spinner Wheel
      bodySvg = `
        <g transform="translate(120, 70)">
          <circle cx="120" cy="110" r="80" fill="#0f172a" stroke="#38bdf8" stroke-width="3" />
          <!-- 4 Slices -->
          <path d="M 120 110 L 120 30 A 80 80 0 0 1 200 110 Z" fill="rgba(56, 189, 248, 0.6)" />
          <path d="M 120 110 L 200 110 A 80 80 0 0 1 120 190 Z" fill="rgba(236, 72, 153, 0.6)" />
          <path d="M 120 110 L 120 190 A 80 80 0 0 1 40 110 Z" fill="rgba(245, 158, 11, 0.6)" />
          <path d="M 120 110 L 40 110 A 80 80 0 0 1 120 30 Z" fill="rgba(16, 185, 129, 0.6)" />

          <!-- Pointer -->
          <polygon points="120,110 135,70 120,50 105,70" fill="#ffffff" stroke="#000000" stroke-width="1.5" />
          <circle cx="120" cy="110" r="6" fill="#ffffff" />

          <rect x="0" y="220" width="240" height="28" rx="6" fill="rgba(16, 185, 129, 0.9)" />
          <text x="120" y="239" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff">Equally Likely Outcomes: P = 1 / 4</text>
        </g>
      `;
    }
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

  // XML Sanitization for text elements
  return rawSvg.replace(/(<text[^>]*>)([\s\S]*?)(<\/text>)/gi, (match, openTag, textContent, closeTag) => {
    let sanitizedText = textContent
      .replace(/&(?!(amp|lt|gt|quot|apos);)/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return openTag + sanitizedText + closeTag;
  });
}

export function saveGrade9DpSvgPlots() {
  console.log('Generating 100 Grade 9 Data & Probability SVG plot files (Topics 159 & 160)...');
  const topicIds = [159, 160];
  let totalSaved = 0;

  for (const topicId of topicIds) {
    for (let qIndex = 0; qIndex < 50; qIndex++) {
      const title = `Grade 9 Topic ${topicId} Diagram #${qIndex + 1}`;
      const svg = generateGrade9DpSvg(topicId, qIndex, { title });
      const fileName = `g9_t${topicId}_q${qIndex + 1}.svg`;

      fs.writeFileSync(path.join(publicImagesDir, fileName), svg);
      fs.writeFileSync(path.join(rootImagesDir, fileName), svg);
      totalSaved++;
    }
  }
  console.log(`✅ Created ${totalSaved} Grade 9 Data & Probability SVG plot files in public/images/ and images/!`);
}

if (process.argv[1] && process.argv[1].endsWith('generate_g9_dp_svgs.js')) {
  saveGrade9DpSvgPlots();
}
