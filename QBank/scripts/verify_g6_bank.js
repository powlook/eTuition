import { initDb } from '../server/db.js';
import path from 'path';
import fs from 'fs';
import xlsx from 'xlsx';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = initDb();

export function verifyGrade6Bank() {
  console.log('🔍 Verifying Grade 6 Math Question Bank...');

  // 1. Verify Topics
  const topicRows = db.prepare('SELECT id, title, strand FROM topics WHERE id >= 89 AND id <= 103 ORDER BY id ASC').all();
  console.log(`Found ${topicRows.length}/15 Grade 6 topics in SQLite database:`);
  if (topicRows.length !== 15) {
    throw new Error(`Expected 15 Grade 6 topics, found ${topicRows.length}`);
  }

  // 2. Verify Question Counts & Data Quality
  let totalG6Questions = 0;
  const publicDir = path.join(__dirname, '..', 'public');
  let missingImages = 0;

  topicRows.forEach(t => {
    const qRows = db.prepare('SELECT * FROM questions WHERE topic_id = ?').all(t.id);
    console.log(`  - Topic ${t.id} (${t.title}): ${qRows.length} questions`);

    if (qRows.length !== 50) {
      throw new Error(`Topic ${t.id} has ${qRows.length} questions; expected 50!`);
    }

    qRows.forEach(q => {
      totalG6Questions++;

      // Check Options
      let opts = [];
      try {
        opts = JSON.parse(q.options_json);
      } catch (e) {
        throw new Error(`Question ${q.id} has invalid options_json: ${q.options_json}`);
      }

      if (!Array.isArray(opts) || opts.length !== 4) {
        throw new Error(`Question ${q.id} does not have exactly 4 options!`);
      }

      if (!opts.includes(q.correct_answer)) {
        throw new Error(`Question ${q.id} correct answer '${q.correct_answer}' not found in options: ${opts.join(', ')}`);
      }

      // Check Working Steps
      let steps = [];
      try {
        steps = JSON.parse(q.working_steps_json);
      } catch (e) {
        throw new Error(`Question ${q.id} has invalid working_steps_json: ${q.working_steps_json}`);
      }

      if (!Array.isArray(steps) || steps.length === 0) {
        throw new Error(`Question ${q.id} has empty working steps!`);
      }

      // Check Image Asset
      if (q.image_url) {
        const fullImgPath = path.join(publicDir, q.image_url);
        if (!fs.existsSync(fullImgPath)) {
          console.error(`Missing image asset: ${fullImgPath}`);
          missingImages++;
        }
      }
    });
  });

  console.log(`✅ Verified ${totalG6Questions} Grade 6 questions across 15 topics.`);
  if (missingImages > 0) {
    throw new Error(`Found ${missingImages} missing image files!`);
  }

  // 3. Verify Excel File Sync
  const excelPath = path.join(__dirname, '..', 'questions_bank.xlsx');
  if (!fs.existsSync(excelPath)) {
    throw new Error(`questions_bank.xlsx not found at ${excelPath}`);
  }

  const wb = xlsx.readFile(excelPath);
  const sheet = wb.Sheets['DepEd Question Bank'];
  const excelRows = xlsx.utils.sheet_to_json(sheet);
  const g6ExcelRows = excelRows.filter(r => String(r['Form Level']).includes('6'));

  console.log(`📊 Found ${g6ExcelRows.length} Form 6 questions in questions_bank.xlsx spreadsheet.`);
  if (g6ExcelRows.length !== 750) {
    throw new Error(`Expected 750 Form 6 questions in questions_bank.xlsx, found ${g6ExcelRows.length}`);
  }

  console.log('🎉 Grade 6 Math Question Bank Verification Complete: ALL TESTS PASSED!');
}

if (process.argv[1] && process.argv[1].endsWith('verify_g6_bank.js')) {
  verifyGrade6Bank();
}
