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

export function generateGrade10DpSvg(topicId, qIndex, params = {}) {
  const width = 480;
  const height = 360;
  const subType = qIndex % 10;
  const title = params.title || `Grade 10 Topic ${topicId} Diagram #${qIndex + 1}`;

  let bodySvg = '';

  // ==========================================
  // TOPIC 173: Box-and-Whisker & Cumulative Frequency
  // ==========================================
  if (topicId === 173) {
    if (subType === 0 || subType === 1 || subType === 2) { // Box Plot Diagram
      bodySvg = `
        <g transform="translate(60, 40)">
          <!-- Axis Line -->
          <line x1="20" y1="220" x2="340" y2="220" stroke="#475569" stroke-width="2" />
          <line x1="60" y1="210" x2="60" y2="230" stroke="#94a3b8" stroke-width="2" />
          <line x1="120" y1="210" x2="120" y2="230" stroke="#94a3b8" stroke-width="2" />
          <line x1="180" y1="210" x2="180" y2="230" stroke="#94a3b8" stroke-width="2" />
          <line x1="240" y1="210" x2="240" y2="230" stroke="#94a3b8" stroke-width="2" />
          <line x1="300" y1="210" x2="300" y2="230" stroke="#94a3b8" stroke-width="2" />
          <text x="60" y="250" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#94a3b8">Min (12)</text>
          <text x="120" y="250" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#38bdf8">Q₁ (18)</text>
          <text x="180" y="250" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#f59e0b">Med (22)</text>
          <text x="240" y="250" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#38bdf8">Q₃ (26)</text>
          <text x="300" y="250" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#94a3b8">Max (30)</text>

          <!-- Whiskers -->
          <line x1="60" y1="120" x2="120" y2="120" stroke="#38bdf8" stroke-width="3" />
          <line x1="240" y1="120" x2="300" y2="120" stroke="#38bdf8" stroke-width="3" />
          <line x1="60" y1="90" x2="60" y2="150" stroke="#38bdf8" stroke-width="3" />
          <line x1="300" y1="90" x2="300" y2="150" stroke="#38bdf8" stroke-width="3" />

          <!-- Box -->
          <rect x="120" y="70" width="120" height="100" fill="rgba(56, 189, 248, 0.2)" stroke="#38bdf8" stroke-width="3" rx="4" />
          <!-- Median Line -->
          <line x1="180" y1="70" x2="180" y2="170" stroke="#f59e0b" stroke-width="4" />
        </g>
      `;
    } else { // Cumulative Frequency Ogive
      bodySvg = `
        <g transform="translate(60, 40)">
          <!-- Axes -->
          <line x1="40" y1="240" x2="340" y2="240" stroke="#475569" stroke-width="2" />
          <line x1="40" y1="20" x2="40" y2="240" stroke="#475569" stroke-width="2" />
          <!-- Ogive Curve -->
          <path d="M 40,240 Q 120,220 180,140 T 320,40" fill="none" stroke="#10b981" stroke-width="3.5" />
          <circle cx="180" cy="140" r="5" fill="#f59e0b" />
          <line x1="40" y1="140" x2="180" y2="140" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4,4" />
          <line x1="180" y1="140" x2="180" y2="240" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4,4" />
          <text x="30" y="145" text-anchor="end" font-family="sans-serif" font-size="12" fill="#f59e0b" font-weight="bold">N/2 (50%)</text>
          <text x="180" y="260" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#f59e0b" font-weight="bold">Median</text>
          <text x="220" y="80" font-family="sans-serif" font-size="13" fill="#10b981" font-weight="bold">Ogive Curve (&lt;cf)</text>
        </g>
      `;
    }
  }

  // ==========================================
  // TOPIC 174: Position Measures & Outliers
  // ==========================================
  else if (topicId === 174) {
    if (subType === 0 || subType === 1 || subType === 2) { // Outlier Fences
      bodySvg = `
        <g transform="translate(60, 40)">
          <line x1="20" y1="160" x2="340" y2="160" stroke="#475569" stroke-width="2.5" />
          <!-- Lower Fence -->
          <line x1="70" y1="120" x2="70" y2="200" stroke="#ec4899" stroke-width="2" stroke-dasharray="4,4" />
          <text x="70" y="105" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#ec4899" font-weight="bold">Q₁ - 1.5·IQR</text>
          <!-- Upper Fence -->
          <line x1="270" y1="120" x2="270" y2="200" stroke="#ec4899" stroke-width="2" stroke-dasharray="4,4" />
          <text x="270" y="105" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#ec4899" font-weight="bold">Q₃ + 1.5·IQR</text>
          <!-- Box IQR -->
          <rect x="120" y="130" width="100" height="60" fill="rgba(56, 189, 248, 0.2)" stroke="#38bdf8" stroke-width="2.5" />
          <text x="170" y="165" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#38bdf8" font-weight="bold">IQR</text>
          <!-- Outlier Star -->
          <circle cx="320" cy="160" r="6" fill="#ef4444" />
          <text x="320" y="140" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#ef4444" font-weight="bold">Outlier *</text>
        </g>
      `;
    } else { // Percentile / Decile Position Bar
      bodySvg = `
        <g transform="translate(60, 40)">
          <!-- Percentile Spectrum Bar -->
          <rect x="20" y="120" width="300" height="40" fill="none" stroke="#64748b" stroke-width="2" rx="4" />
          <rect x="20" y="120" width="225" height="40" fill="rgba(16, 185, 129, 0.3)" rx="4" />
          <line x1="95" y1="120" x2="95" y2="160" stroke="#38bdf8" stroke-width="2" />
          <line x1="170" y1="120" x2="170" y2="160" stroke="#f59e0b" stroke-width="3" />
          <line x1="245" y1="120" x2="245" y2="160" stroke="#10b981" stroke-width="2" />
          <text x="95" y="185" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#38bdf8">Q₁ (P₂₅)</text>
          <text x="170" y="185" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#f59e0b">D₅ (P₅₀)</text>
          <text x="245" y="185" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#10b981">Q₃ (P₇₅)</text>
          <text x="170" y="85" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#10b981" font-weight="bold">75th Percentile Rank (P₇₅)</text>
        </g>
      `;
    }
  }

  // ==========================================
  // TOPIC 175: Statistical Report Evaluation (Misleading Graphs)
  // ==========================================
  else if (topicId === 175) {
    if (subType === 0 || subType === 1 || subType === 2) { // Truncated Axis Distortion
      bodySvg = `
        <g transform="translate(60, 40)">
          <line x1="40" y1="240" x2="320" y2="240" stroke="#475569" stroke-width="2" />
          <line x1="40" y1="40" x2="40" y2="240" stroke="#475569" stroke-width="2" />
          <!-- Zig-zag truncated mark -->
          <path d="M 35,210 L 45,215 L 35,220 L 45,225" fill="none" stroke="#ef4444" stroke-width="2" />
          <text x="30" y="200" text-anchor="end" font-family="sans-serif" font-size="11" fill="#ef4444" font-weight="bold">₱90M</text>
          <text x="30" y="60" text-anchor="end" font-family="sans-serif" font-size="11" fill="#94a3b8">₱100M</text>

          <!-- Misleading Bars -->
          <rect x="80" y="160" width="50" height="80" fill="#38bdf8" />
          <rect x="190" y="60" width="50" height="180" fill="#ef4444" />
          <text x="105" y="150" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#38bdf8">2023</text>
          <text x="215" y="50" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#ef4444">2024</text>
          <text x="180" y="270" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#ef4444" font-weight="bold">Misleading Truncated y-Axis (Starts at ₱90M)</text>
        </g>
      `;
    } else { // Correlation vs Causation Diagram
      bodySvg = `
        <g transform="translate(60, 40)">
          <rect x="30" y="100" width="90" height="50" fill="rgba(56, 189, 248, 0.2)" stroke="#38bdf8" stroke-width="2" rx="6" />
          <rect x="240" y="100" width="90" height="50" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" stroke-width="2" rx="6" />
          <rect x="135" y="20" width="90" height="50" fill="rgba(245, 158, 11, 0.2)" stroke="#f59e0b" stroke-width="2" rx="6" />
          <text x="75" y="130" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#38bdf8" font-weight="bold">Variable A</text>
          <text x="285" y="130" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#10b981" font-weight="bold">Variable B</text>
          <text x="180" y="50" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#f59e0b" font-weight="bold">Confounding C</text>

          <line x1="120" y1="125" x2="240" y2="125" stroke="#ec4899" stroke-width="2.5" stroke-dasharray="4,4" />
          <line x1="160" y1="70" x2="90" y2="100" stroke="#f59e0b" stroke-width="2" />
          <line x1="200" y1="70" x2="270" y2="100" stroke="#f59e0b" stroke-width="2" />
          <text x="180" y="115" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#ec4899" font-weight="bold">Correlation ≠ Causation</text>
        </g>
      `;
    }
  }

  // ==========================================
  // TOPIC 176: Probability & Compound Events
  // ==========================================
  else if (topicId === 176) {
    if (subType === 0 || subType === 1 || subType === 2) { // Venn Diagram Union & Intersection
      bodySvg = `
        <g transform="translate(60, 40)">
          <!-- Universal set frame -->
          <rect x="20" y="20" width="320" height="220" fill="none" stroke="#475569" stroke-width="2" rx="8" />
          <text x="325" y="40" text-anchor="end" font-family="sans-serif" font-size="14" fill="#94a3b8" font-weight="bold">S</text>

          <!-- Circle A -->
          <circle cx="140" cy="130" r="70" fill="rgba(56, 189, 248, 0.3)" stroke="#38bdf8" stroke-width="2.5" />
          <!-- Circle B -->
          <circle cx="220" cy="130" r="70" fill="rgba(245, 158, 11, 0.3)" stroke="#f59e0b" stroke-width="2.5" />
          <text x="100" y="135" font-family="sans-serif" font-size="16" fill="#38bdf8" font-weight="bold">A</text>
          <text x="250" y="135" font-family="sans-serif" font-size="16" fill="#f59e0b" font-weight="bold">B</text>
          <text x="180" y="135" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#e2e8f0" font-weight="bold">A ∩ B</text>
          <text x="180" y="265" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#38bdf8" font-weight="bold">General Addition Rule: P(A ∪ B) = P(A) + P(B) - P(A ∩ B)</text>
        </g>
      `;
    } else { // Probability Tree Diagram
      bodySvg = `
        <g transform="translate(60, 40)">
          <circle cx="30" cy="130" r="5" fill="#94a3b8" />
          <!-- Stage 1 branches -->
          <line x1="30" y1="130" x2="150" y2="60" stroke="#38bdf8" stroke-width="2.5" />
          <line x1="30" y1="130" x2="150" y2="200" stroke="#f59e0b" stroke-width="2.5" />
          <text x="80" y="85" font-family="sans-serif" font-size="12" fill="#38bdf8" font-weight="bold">P(A)</text>
          <text x="80" y="180" font-family="sans-serif" font-size="12" fill="#f59e0b" font-weight="bold">P(A')</text>

          <!-- Stage 2 branches -->
          <line x1="150" y1="60" x2="280" y2="30" stroke="#10b981" stroke-width="2" />
          <line x1="150" y1="60" x2="280" y2="90" stroke="#ec4899" stroke-width="2" />
          <text x="210" y="35" font-family="sans-serif" font-size="11" fill="#10b981">P(B|A)</text>
          <text x="210" y="90" font-family="sans-serif" font-size="11" fill="#ec4899">P(B'|A)</text>
          <text x="300" y="35" font-family="sans-serif" font-size="13" fill="#10b981" font-weight="bold">A ∩ B</text>
        </g>
      `;
    }
  }

  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
  </style>
  <!-- Background -->
  <rect width="${width}" height="${height}" rx="12" fill="#0f172a" stroke="#334155" stroke-width="2"/>
  <!-- Title Header -->
  <rect x="0" y="0" width="${width}" height="40" rx="12" fill="#1e293b"/>
  <text x="20" y="25" font-size="14" fill="#38bdf8" font-weight="600">${title}</text>
  ${bodySvg}
</svg>`;

  const fileName = `g10_dp_t${topicId}_q${qIndex + 1}.svg`;
  
  [publicImagesDir, rootImagesDir].forEach(dir => {
    fs.writeFileSync(path.join(dir, fileName), svgContent, 'utf-8');
  });

  return `/images/${fileName}`;
}
