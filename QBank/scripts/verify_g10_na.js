import { initDb } from '../server/db.js';
import xlsx from 'xlsx';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = initDb();

console.log('====================================================');
console.log('🔍 VERIFYING GRADE 10 NUMBER & ALGEBRA QUESTIONS');
console.log('====================================================\n');

// 1. Verify SQLite Database
const topicIds = [165, 166, 167, 168, 169, 170, 171, 172];
let totalDbQuestions = 0;
let dbErrorCount = 0;

for (const tid of topicIds) {
  const topicRow = db.prepare('SELECT title FROM topics WHERE id = ?').get(tid);
  const qRows = db.prepare('SELECT * FROM questions WHERE topic_id = ? ORDER BY id ASC').all(tid);

  console.log(`📌 Topic ID ${tid}: "${topicRow ? topicRow.title : 'Unknown'}" -> ${qRows.length} questions in DB`);

  if (qRows.length !== 50) {
    console.error(`❌ ERROR: Expected 50 questions for Topic ${tid}, found ${qRows.length}`);
    dbErrorCount++;
  }

  qRows.forEach((q) => {
    totalDbQuestions++;
    // Check Options
    let opts = [];
    try {
      opts = JSON.parse(q.options_json);
    } catch (e) {
      console.error(`❌ ERROR: Invalid JSON in options_json for QID ${q.id}`);
      dbErrorCount++;
    }

    if (!Array.isArray(opts) || opts.length !== 4) {
      console.error(`❌ ERROR: Question QID ${q.id} does not have exactly 4 options (found ${opts.length})`);
      dbErrorCount++;
    }

    if (!opts.includes(q.correct_answer)) {
      console.error(`❌ ERROR: Question QID ${q.id} correct answer "${q.correct_answer}" not found in options array`);
      dbErrorCount++;
    }

    // Check SVG Image file
    if (q.image_url) {
      const relativeImgPath = q.image_url.startsWith('/') ? q.image_url.substring(1) : q.image_url;
      const fullImgPath = path.join(__dirname, '..', 'public', relativeImgPath);
      if (!fs.existsSync(fullImgPath)) {
        console.error(`❌ ERROR: SVG image missing for QID ${q.id}: ${fullImgPath}`);
        dbErrorCount++;
      }
    }
  });
}

console.log(`\n✅ DB Total Questions Verified: ${totalDbQuestions}`);

// 2. Verify questions_bank.xlsx
const qbPath = path.join(__dirname, '..', 'questions_bank.xlsx');
let qbForm10NaCount = 0;

if (fs.existsSync(qbPath)) {
  const wb = xlsx.readFile(qbPath);
  const sheet = wb.Sheets['DepEd Question Bank'];
  const rows = xlsx.utils.sheet_to_json(sheet);

  rows.forEach(r => {
    const formLvl = String(r['Form Level'] || r['form_level'] || '');
    const strand = String(r['Curriculum Strand'] || r['curriculum_strand'] || '');
    if ((formLvl === '10' || formLvl === 'Form 10') && (strand.includes('Algebra') || strand.includes('Number'))) {
      qbForm10NaCount++;
    }
  });

  console.log(`📊 questions_bank.xlsx Form 10 NA records: ${qbForm10NaCount}`);
  if (qbForm10NaCount !== 400) {
    console.error(`❌ ERROR: questions_bank.xlsx should contain 400 Form 10 NA questions, found ${qbForm10NaCount}`);
    dbErrorCount++;
  }
} else {
  console.error(`❌ ERROR: questions_bank.xlsx file not found at ${qbPath}`);
  dbErrorCount++;
}

// 3. Verify Grade_10_Math_Questions.xlsx
const g10Path = path.join(__dirname, '..', 'resources', 'Grade_10_Math_Questions.xlsx');
let g10NaSheetCount = 0;

if (fs.existsSync(g10Path)) {
  const wb = xlsx.readFile(g10Path);
  const sheetName = 'Number and Algebra (NA)' in wb.Sheets ? 'Number and Algebra (NA)' : 'Number & Algebra (NA)';
  const sheet = wb.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  rows.slice(4).forEach(r => {
    if (r && r[0] && String(r[0]).startsWith('T')) {
      g10NaSheetCount++;
    }
  });

  console.log(`📄 Grade_10_Math_Questions.xlsx sheet "${sheetName}" records: ${g10NaSheetCount}`);
  if (g10NaSheetCount !== 400) {
    console.error(`❌ ERROR: Grade_10_Math_Questions.xlsx should contain 400 items in NA sheet, found ${g10NaSheetCount}`);
    dbErrorCount++;
  }
} else {
  console.error(`❌ ERROR: Grade_10_Math_Questions.xlsx not found at ${g10Path}`);
  dbErrorCount++;
}

console.log('\n====================================================');
if (dbErrorCount === 0) {
  console.log('🎉 ALL VERIFICATION CHECKS PASSED PERFECTLY (0 ERRORS)!');
} else {
  console.error(`⚠️ VERIFICATION FINISHED WITH ${dbErrorCount} ERROR(S).`);
  process.exit(1);
}
console.log('====================================================\n');
