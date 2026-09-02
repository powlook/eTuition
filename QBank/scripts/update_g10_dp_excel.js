import { initDb } from '../server/db.js';
import xlsx from 'xlsx';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = initDb();

const rows = db.prepare(`
  SELECT q.id, t.id as topic_id, t.title as topic_title, t.competencies, q.question_title, q.question_text
  FROM questions q
  JOIN topics t ON q.topic_id = t.id
  WHERE t.id BETWEEN 173 AND 176
  ORDER BY t.id ASC, q.id ASC
`).all();

console.log(`Fetched ${rows.length} Form 10 DP questions from DB.`);

const topicCodeMap = {
  173: "T13: Box-and-whisker plots, cumulative frequency histograms and polygons",
  174: "T14: Quartiles, deciles, percentiles, interquartile range, and outliers",
  175: "T15: Evaluation of statistical reports",
  176: "T16: Union and intersection of events, dependent and independent events, and complementary events"
};

const excelPath = path.join(__dirname, '..', 'resources', 'Grade_10_Math_Questions.xlsx');
let wb;
try {
  wb = xlsx.readFile(excelPath);
} catch (e) {
  console.error("Could not read Grade_10_Math_Questions.xlsx:", e.message);
  process.exit(1);
}

const dpSheetName = ('Data and Probability (DP)' in wb.Sheets) ? 'Data and Probability (DP)' : 'Data & Probability (DP)';
const sheet = wb.Sheets[dpSheetName];
const dataRows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

const tCount = {};
for (let i = 173; i <= 176; i++) tCount[i] = 0;

rows.forEach((r, idx) => {
  const rowIdx = idx + 4; // 0-indexed header offset (data starts at row index 4)
  tCount[r.topic_id]++;
  const tCodeShort = `T${(r.topic_id - 160).toString().padStart(2, '0')}`;
  const itemID = `${tCodeShort}-Q${tCount[r.topic_id].toString().padStart(3, '0')}`;
  
  if (!dataRows[rowIdx]) dataRows[rowIdx] = [];
  dataRows[rowIdx][0] = itemID;
  dataRows[rowIdx][1] = topicCodeMap[r.topic_id];
  dataRows[rowIdx][2] = "Data and Probability (DP)";
  dataRows[rowIdx][3] = r.competencies;
  dataRows[rowIdx][4] = r.question_text;
});

const newSheet = xlsx.utils.aoa_to_sheet(dataRows);
wb.Sheets[dpSheetName] = newSheet;

// Also update 'All 800 Questions' sheet if present
if ('All 800 Questions' in wb.Sheets) {
  const allSheet = wb.Sheets['All 800 Questions'];
  const allRows = xlsx.utils.sheet_to_json(allSheet, { header: 1 });
  
  const itemRowMap = {};
  allRows.forEach((r, rIdx) => {
    if (r && r[0]) {
      itemRowMap[String(r[0]).trim()] = rIdx;
    }
  });

  const tCountAll = {};
  for (let i = 173; i <= 176; i++) tCountAll[i] = 0;

  rows.forEach((r) => {
    tCountAll[r.topic_id]++;
    const tCodeShort = `T${(r.topic_id - 160).toString().padStart(2, '0')}`;
    const itemID = `${tCodeShort}-Q${tCountAll[r.topic_id].toString().padStart(3, '0')}`;
    const targetR = itemRowMap[itemID];
    if (targetR !== undefined && allRows[targetR]) {
      allRows[targetR][4] = r.question_text;
    }
  });

  wb.Sheets['All 800 Questions'] = xlsx.utils.aoa_to_sheet(allRows);
}

try {
  xlsx.writeFile(wb, excelPath);
  console.log(`✅ Successfully updated ${excelPath}!`);
} catch (err) {
  console.warn(`⚠️ Could not save directly to ${excelPath} (${err.message}). Saving to Grade_10_Math_Questions_Updated.xlsx instead.`);
  const fallbackPath = path.join(__dirname, '..', 'resources', 'Grade_10_Math_Questions_Updated.xlsx');
  xlsx.writeFile(wb, fallbackPath);
  console.log(`✅ Saved updated file to ${fallbackPath}`);
}
