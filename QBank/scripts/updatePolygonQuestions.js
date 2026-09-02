import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { exportQuestionsToExcel } from '../server/excelService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '..', 'server', 'qbank.db');
const db = new Database(dbPath);

console.log('Updating polygon questions with matched geometric images...');

const questions = db.prepare(`
  SELECT id, topic_id, question_title, question_text, image_url, image_alt
  FROM questions
  WHERE topic_id IN (104, 105)
     OR question_title LIKE '%polygon%'
     OR question_text LIKE '%polygon%'
     OR question_title LIKE '%gon%'
     OR question_text LIKE '%gon%'
`).all();

console.log(`Found ${questions.length} polygon-related questions to inspect.`);

const updateStmt = db.prepare(`
  UPDATE questions
  SET image_url = ?, image_alt = ?
  WHERE id = ?
`);

let updatedCount = 0;

db.transaction(() => {
  for (const q of questions) {
    const text = `${q.question_title} ${q.question_text}`.toLowerCase();
    let newImageUrl = '';
    let newImageAlt = '';

    // Check for irregular polygons first
    if (text.includes('irregular')) {
      if (text.includes('5-gon') || text.includes('pentagon') || text.includes('n = 5') || text.includes('5 sides')) {
        newImageUrl = '/images/polygon_irregular_5_gon.svg';
        newImageAlt = 'Irregular 5-sided polygon (Pentagon)';
      } else if (text.includes('6-gon') || text.includes('hexagon') || text.includes('n = 6') || text.includes('6 sides')) {
        newImageUrl = '/images/polygon_irregular_6_gon.svg';
        newImageAlt = 'Irregular 6-sided polygon (Hexagon)';
      } else if (text.includes('4-gon') || text.includes('quadrilateral') || text.includes('n = 4') || text.includes('4 sides')) {
        newImageUrl = '/images/polygon_irregular_4_gon.svg';
        newImageAlt = 'Irregular 4-sided polygon (Quadrilateral)';
      } else {
        newImageUrl = '/images/polygon_irregular_5_gon.svg';
        newImageAlt = 'Irregular Polygon';
      }
    } else {
      // Regular polygons by side count
      if (text.includes('12-gon') || text.includes('dodecagon') || text.includes('n = 12') || text.includes('12 sides') || text.includes('12-sided')) {
        newImageUrl = '/images/polygon_12_gon.svg';
        newImageAlt = 'Regular 12-sided polygon (Dodecagon)';
      } else if (text.includes('10-gon') || text.includes('decagon') || text.includes('n = 10') || text.includes('10 sides') || text.includes('10-sided')) {
        newImageUrl = '/images/polygon_10_gon.svg';
        newImageAlt = 'Regular 10-sided polygon (Decagon)';
      } else if (text.includes('9-gon') || text.includes('nonagon') || text.includes('n = 9') || text.includes('9 sides') || text.includes('9-sided')) {
        newImageUrl = '/images/polygon_9_gon.svg';
        newImageAlt = 'Regular 9-sided polygon (Nonagon)';
      } else if (text.includes('8-gon') || text.includes('octagon') || text.includes('n = 8') || text.includes('8 sides') || text.includes('8-sided')) {
        newImageUrl = '/images/polygon_8_gon.svg';
        newImageAlt = 'Regular 8-sided polygon (Octagon)';
      } else if (text.includes('7-gon') || text.includes('heptagon') || text.includes('n = 7') || text.includes('7 sides') || text.includes('7-sided')) {
        newImageUrl = '/images/polygon_7_gon.svg';
        newImageAlt = 'Regular 7-sided polygon (Heptagon)';
      } else if (text.includes('6-gon') || text.includes('hexagon') || text.includes('n = 6') || text.includes('6 sides') || text.includes('6-sided')) {
        newImageUrl = '/images/polygon_6_gon.svg';
        newImageAlt = 'Regular 6-sided polygon (Hexagon)';
      } else if (text.includes('5-gon') || text.includes('pentagon') || text.includes('n = 5') || text.includes('5 sides') || text.includes('5-sided')) {
        newImageUrl = '/images/polygon_5_gon.svg';
        newImageAlt = 'Regular 5-sided polygon (Pentagon)';
      } else if (text.includes('4-gon') || text.includes('quadrilateral') || text.includes('square') || text.includes('n = 4') || text.includes('4 sides') || text.includes('4-sided')) {
        newImageUrl = '/images/polygon_4_gon.svg';
        newImageAlt = 'Regular 4-sided polygon (Square)';
      } else if (text.includes('3-gon') || text.includes('triangle') || text.includes('n = 3') || text.includes('3 sides') || text.includes('3-sided')) {
        newImageUrl = '/images/polygon_3_gon.svg';
        newImageAlt = 'Regular 3-sided polygon (Triangle)';
      } else {
        newImageUrl = '/images/polygon_5_gon.svg';
        newImageAlt = 'Polygon Diagram';
      }
    }

    updateStmt.run(newImageUrl, newImageAlt, q.id);
    updatedCount++;
  }
})();

console.log(`Updated ${updatedCount} polygon questions with their correct side-count polygon SVG diagrams.`);

// Sync updated database back to questions_bank.xlsx
const excelPath = path.join(__dirname, '..', 'questions_bank.xlsx');
exportQuestionsToExcel(db, excelPath);
console.log(`Exported updated database to Excel at ${excelPath}`);
