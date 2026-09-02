import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { exportQuestionsToExcel } from '../server/excelService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '..', 'server', 'qbank.db');
const db = new Database(dbPath);

console.log('Mapping exact SVG diagram URLs for PDF imported questions...');

const imageMappings = [
  { id: 35514, url: '/images/q5_similar_triangles.svg', alt: 'Similar Triangles ABC and AQP with parallel lines BC // PQ' },
  { id: 35515, url: '/images/q6_rectangles_enlargement.svg', alt: 'Enlargement of Rectangle P to Rectangle Q' },
  { id: 35516, url: '/images/q6_rectangles_enlargement.svg', alt: 'Enlargement of Rectangle P to Rectangle Q' },
  { id: 35517, url: '/images/q7_congruent_triangles.svg', alt: 'Congruent Triangles ABC and EDC with shared vertical line' },
  { id: 35520, url: '/images/q14_intersecting_similar_triangles.svg', alt: 'Intersecting Similar Triangles PQT and SRT' },
  { id: 35521, url: '/images/q15_congruent_triangles.svg', alt: 'Congruent Triangles PQR and STR' },
  { id: 35522, url: '/images/q16_vertical_poles.svg', alt: 'Three Vertical Poles Alignment and Incline' },
  { id: 35523, url: '/images/q20_similar_triangles_abc_def.svg', alt: 'Similar Triangles ABC and DEF' },
  { id: 35526, url: '/images/q1a_right_triangle.svg', alt: 'Right Triangle with legs 3 cm and 8 cm' },
  { id: 35530, url: '/images/q2_right_triangle_pqr.svg', alt: 'Right Triangle PQR with point S on leg PR' },
  { id: 35531, url: '', alt: '' }, // Evaluation question, clear dummy image
  { id: 35534, url: '/images/q12_balloon_elevation.svg', alt: 'Hot Air Balloon Angle of Elevation Diagram' }
];

const stmt = db.prepare('UPDATE questions SET image_url = ?, image_alt = ? WHERE id = ?');

db.transaction(() => {
  for (const item of imageMappings) {
    stmt.run(item.url, item.alt, item.id);
  }
})();

console.log(`Updated ${imageMappings.length} PDF questions with exact SVG geometric diagram assets.`);

// Sync with Excel
const excelPath = path.join(__dirname, '..', 'questions_bank.xlsx');
exportQuestionsToExcel(db, excelPath);
console.log(`Exported updated QBank database to Excel at ${excelPath}`);
