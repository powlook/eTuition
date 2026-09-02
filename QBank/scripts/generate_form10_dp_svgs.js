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

export function generateForm10DpSvg(topicId, qIndex, params = {}) {
  const width = 480;
  const height = 380;
  const subType = qIndex % 10;
  const title = params.title || `Form 10 Topic ${topicId} Diagram #${qIndex + 1}`;

  let bodySvg = '';

  // ==========================================
  // TOPIC 173 & 174: Box Plots & Cumulative Frequency Histograms
  // ==========================================
  if (topicId === 173 || topicId === 174) {
    if (subType < 5) { // Box-and-Whisker Plot
      bodySvg = `
        <g transform="translate(80, 80)">
          <!-- Number Line Axis -->
          <line x1="20" y1="180" x2="300" y2="180" stroke="#94a3b8" stroke-width="2" />
          
          <!-- Ticks & Labels -->
          <line x1="40" y1="175" x2="40" y2="185" stroke="#94a3b8" stroke-width="2" />
          <text x="40" y="205" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#94a3b8">10</text>

          <line x1="100" y1="175" x2="100" y2="185" stroke="#94a3b8" stroke-width="2" />
          <text x="100" y="205" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#38bdf8" font-weight="bold">Q1=20</text>

          <line x1="170" y1="175" x2="170" y2="185" stroke="#94a3b8" stroke-width="2" />
          <text x="170" y="205" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#f59e0b" font-weight="bold">Median=35</text>

          <line x1="230" y1="175" x2="230" y2="185" stroke="#94a3b8" stroke-width="2" />
          <text x="230" y="205" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#ec4899" font-weight="bold">Q3=45</text>

          <line x1="280" y1="175" x2="280" y2="185" stroke="#94a3b8" stroke-width="2" />
          <text x="280" y="205" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#94a3b8">55</text>

          <!-- Left Whisker -->
          <line x1="40" y1="110" x2="100" y2="110" stroke="#38bdf8" stroke-width="2.5" />
          <line x1="40" y1="90" x2="40" y2="130" stroke="#38bdf8" stroke-width="2.5" />

          <!-- Interquartile Box Q1 to Q3 -->
          <rect x="100" y="70" width="130" height="80" fill="rgba(56, 189, 248, 0.2)" stroke="#38bdf8" stroke-width="3" rx="4" />
          
          <!-- Median Line inside Box -->
          <line x1="170" y1="70" x2="170" y2="150" stroke="#f59e0b" stroke-width="3.5" />

          <!-- Right Whisker -->
          <line x1="230" y1="110" x2="280" y2="110" stroke="#ec4899" stroke-width="2.5" />
          <line x1="280" y1="90" x2="280" y2="130" stroke="#ec4899" stroke-width="2.5" />

          <rect x="20" y="235" width="280" height="28" rx="6" fill="rgba(16, 185, 129, 0.9)" />
          <text x="160" y="254" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff">Box Plot: IQR = Q3 - Q1 = 45 - 20 = 25</text>
        </g>
      `;
    } else { // Cumulative Frequency Histogram & Polygon
      bodySvg = `
        <g transform="translate(80, 70)">
          <!-- Axes -->
          <line x1="40" y1="20" x2="40" y2="200" stroke="#94a3b8" stroke-width="2" />
          <line x1="40" y1="200" x2="300" y2="200" stroke="#94a3b8" stroke-width="2" />

          <!-- Histogram Bars -->
          <rect x="50" y="160" width="40" height="40" fill="rgba(56, 189, 248, 0.6)" stroke="#38bdf8" />
          <rect x="90" y="110" width="40" height="90" fill="rgba(56, 189, 248, 0.6)" stroke="#38bdf8" />
          <rect x="130" y="60" width="40" height="140" fill="rgba(56, 189, 248, 0.6)" stroke="#38bdf8" />
          <rect x="170" y="30" width="40" height="170" fill="rgba(56, 189, 248, 0.6)" stroke="#38bdf8" />
          <rect x="210" y="20" width="40" height="180" fill="rgba(56, 189, 248, 0.6)" stroke="#38bdf8" />

          <!-- Cumulative Ogive Curve -->
          <path d="M 50 190 L 90 160 L 130 110 L 170 60 L 210 30 L 250 20" fill="none" stroke="#f59e0b" stroke-width="3" />
          <circle cx="210" cy="30" r="5" fill="#f59e0b" />

          <rect x="30" y="235" width="260" height="28" rx="6" fill="rgba(245, 158, 11, 0.9)" />
          <text x="160" y="254" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff">Cumulative Frequency Ogive Curve</text>
        </g>
      `;
    }
  }

  // ==========================================
  // TOPIC 176: Union & Intersection of Events / Venn Diagrams
  // ==========================================
  else if (topicId === 176) {
    if (subType < 5) { // 2-Set Venn Diagram
      bodySvg = `
        <g transform="translate(100, 70)">
          <rect x="0" y="0" width="280" height="220" fill="none" stroke="#94a3b8" stroke-width="2" rx="8" />
          <text x="20" y="25" font-family="sans-serif" font-size="14" fill="#94a3b8" font-weight="bold">Sample Space S</text>

          <!-- Circle A -->
          <circle cx="95" cy="115" r="65" fill="rgba(56, 189, 248, 0.25)" stroke="#38bdf8" stroke-width="2.5" />
          <text x="60" y="120" font-family="sans-serif" font-size="14" fill="#38bdf8" font-weight="bold">Event A</text>

          <!-- Circle B -->
          <circle cx="175" cy="115" r="65" fill="rgba(236, 72, 153, 0.25)" stroke="#ec4899" stroke-width="2.5" />
          <text x="185" y="120" font-family="sans-serif" font-size="14" fill="#ec4899" font-weight="bold">Event B</text>

          <!-- Intersection -->
          <text x="135" y="120" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#f59e0b" font-weight="bold">A ∩ B</text>

          <rect x="20" y="240" width="240" height="28" rx="6" fill="rgba(56, 189, 248, 0.9)" />
          <text x="140" y="259" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff">P(A ∪ B) = P(A) + P(B) - P(A ∩ B)</text>
        </g>
      `;
    } else { // 3-Set Venn Diagram
      bodySvg = `
        <g transform="translate(100, 60)">
          <rect x="0" y="0" width="280" height="230" fill="none" stroke="#94a3b8" stroke-width="2" rx="8" />
          <!-- Circle A -->
          <circle cx="100" cy="90" r="55" fill="rgba(56, 189, 248, 0.2)" stroke="#38bdf8" stroke-width="2" />
          <!-- Circle B -->
          <circle cx="170" cy="90" r="55" fill="rgba(236, 72, 153, 0.2)" stroke="#ec4899" stroke-width="2" />
          <!-- Circle C -->
          <circle cx="135" cy="145" r="55" fill="rgba(245, 158, 11, 0.2)" stroke="#f59e0b" stroke-width="2" />

          <text x="80" y="70" font-family="sans-serif" font-size="12" fill="#38bdf8" font-weight="bold">A</text>
          <text x="180" y="70" font-family="sans-serif" font-size="12" fill="#ec4899" font-weight="bold">B</text>
          <text x="135" y="180" font-family="sans-serif" font-size="12" fill="#f59e0b" font-weight="bold">C</text>

          <rect x="20" y="250" width="240" height="28" rx="6" fill="rgba(236, 72, 153, 0.9)" />
          <text x="140" y="269" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff">3-Set Venn Diagram: Union & Intersection</text>
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

export function saveForm10DpSvgPlots() {
  console.log('Generating Form 10 Data & Probability SVG plot files (Topics 173, 174, 176)...');
  const topicIds = [173, 174, 176];
  let totalSaved = 0;

  for (const topicId of topicIds) {
    for (let qIndex = 0; qIndex < 50; qIndex++) {
      const title = `Form 10 Topic ${topicId} Diagram #${qIndex + 1}`;
      const svg = generateForm10DpSvg(topicId, qIndex, { title });
      const fileName = `f10_t${topicId}_q${qIndex + 1}.svg`;

      fs.writeFileSync(path.join(publicImagesDir, fileName), svg);
      fs.writeFileSync(path.join(rootImagesDir, fileName), svg);
      totalSaved++;
    }
  }
  console.log(`✅ Created ${totalSaved} Form 10 Data & Probability SVG plot files!`);
}

if (process.argv[1] && process.argv[1].endsWith('generate_form10_dp_svgs.js')) {
  saveForm10DpSvgPlots();
}
