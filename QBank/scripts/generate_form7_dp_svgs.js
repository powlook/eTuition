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

export function generateForm7DpSvg(topicId, qIndex, params = {}) {
  const width = 480;
  const height = 380;
  const subType = qIndex % 5;
  const title = params.title || `Form 7 Topic ${topicId} Diagram #${qIndex + 1}`;

  let bodySvg = '';

  if (topicId === 122) { // Presentation of data in tables & graphs
    if (subType === 0) { // Stem and Leaf plot SVG
      bodySvg = `
        <g transform="translate(100, 70)">
          <rect x="0" y="0" width="280" height="210" fill="none" stroke="#94a3b8" stroke-width="2" rx="6" />
          <line x1="80" y1="0" x2="80" y2="210" stroke="#38bdf8" stroke-width="2" />
          <text x="40" y="25" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#38bdf8" font-weight="bold">Stem</text>
          <text x="180" y="25" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#10b981" font-weight="bold">Leaf</text>

          <text x="40" y="65" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#e2e8f0">1</text>
          <text x="180" y="65" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#e2e8f0">2  5  8</text>

          <text x="40" y="105" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#e2e8f0">2</text>
          <text x="180" y="105" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#e2e8f0">0  3  4  7  9</text>

          <text x="40" y="145" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#e2e8f0">3</text>
          <text x="180" y="145" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#e2e8f0">1  1  6  8</text>

          <rect x="20" y="235" width="240" height="28" rx="6" fill="rgba(56, 189, 248, 0.9)" />
          <text x="140" y="254" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff">Stem-and-Leaf Plot: Key 1|2 = 12</text>
        </g>
      `;
    } else { // Pie Chart Sector Angle SVG
      bodySvg = `
        <g transform="translate(120, 70)">
          <circle cx="120" cy="110" r="80" fill="#0f172a" stroke="#38bdf8" stroke-width="3" />
          <path d="M 120 110 L 120 30 A 80 80 0 0 1 200 110 Z" fill="rgba(56, 189, 248, 0.6)" />
          <path d="M 120 110 L 200 110 A 80 80 0 1 1 120 30 Z" fill="rgba(236, 72, 153, 0.4)" />

          <text x="150" y="75" font-family="sans-serif" font-size="12" fill="#38bdf8" font-weight="bold">Math (30%)</text>
          <text x="80" y="130" font-family="sans-serif" font-size="12" fill="#ec4899" font-weight="bold">Others (70%)</text>

          <rect x="0" y="220" width="240" height="28" rx="6" fill="rgba(56, 189, 248, 0.9)" />
          <text x="120" y="239" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff">Sector Angle = 30% × 360° = 108°</text>
        </g>
      `;
    }
  } else if (topicId === 124) { // Coin toss tree diagram
    bodySvg = `
      <g transform="translate(90, 60)">
        <circle cx="20" cy="120" r="5" fill="#f59e0b" />
        <line x1="20" y1="120" x2="100" y2="60" stroke="#38bdf8" stroke-width="2.5" />
        <text x="50" y="80" font-family="sans-serif" font-size="11" fill="#38bdf8" font-weight="bold">P(H) = 0.5</text>

        <line x1="20" y1="120" x2="100" y2="180" stroke="#ec4899" stroke-width="2.5" />
        <text x="50" y="165" font-family="sans-serif" font-size="11" fill="#ec4899" font-weight="bold">P(T) = 0.5</text>

        <line x1="100" y1="60" x2="180" y2="30" stroke="#10b981" stroke-width="2" />
        <text x="200" y="35" font-family="sans-serif" font-size="11" fill="#e2e8f0">HH (1/4)</text>

        <line x1="100" y1="60" x2="180" y2="90" stroke="#10b981" stroke-width="2" />
        <text x="200" y="95" font-family="sans-serif" font-size="11" fill="#e2e8f0">HT (1/4)</text>

        <line x1="100" y1="180" x2="180" y2="150" stroke="#10b981" stroke-width="2" />
        <text x="200" y="155" font-family="sans-serif" font-size="11" fill="#e2e8f0">TH (1/4)</text>

        <line x1="100" y1="180" x2="180" y2="210" stroke="#10b981" stroke-width="2" />
        <text x="200" y="215" font-family="sans-serif" font-size="11" fill="#e2e8f0">TT (1/4)</text>

        <rect x="20" y="250" width="240" height="28" rx="6" fill="rgba(56, 189, 248, 0.9)" />
        <text x="140" y="269" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff">Multi-Coin Tree Diagram</text>
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

export function saveForm7DpSvgPlots() {
  console.log('Generating Form 7 Data & Probability SVG plot files (Topics 122, 124)...');
  const topicIds = [122, 124];
  let totalSaved = 0;

  for (const topicId of topicIds) {
    for (let qIndex = 0; qIndex < 50; qIndex++) {
      const title = `Form 7 Topic ${topicId} Diagram #${qIndex + 1}`;
      const svg = generateForm7DpSvg(topicId, qIndex, { title });
      const fileName = `dp_t${topicId}_q${qIndex + 1}.svg`;

      fs.writeFileSync(path.join(publicImagesDir, fileName), svg);
      fs.writeFileSync(path.join(rootImagesDir, fileName), svg);
      totalSaved++;
    }
  }
  console.log(`✅ Created ${totalSaved} Form 7 Data & Probability SVG plot files!`);
}

if (process.argv[1] && process.argv[1].endsWith('generate_form7_dp_svgs.js')) {
  saveForm7DpSvgPlots();
}
