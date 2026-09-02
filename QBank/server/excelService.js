import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function exportQuestionsToExcel(db, outputPath) {
  const filePath = outputPath || path.join(__dirname, '..', 'questions_bank.xlsx');

  const rows = db.prepare(`
    SELECT 
      q.id as question_id,
      t.form_level,
      t.strand as curriculum_strand,
      t.unit as unit_title,
      t.id as topic_id,
      t.title as topic_name,
      t.competencies as deped_competency_code,
      q.question_title,
      q.question_text,
      q.math_formula as latex_formula_expression,
      q.question_type,
      q.options_json,
      q.correct_answer,
      q.hint,
      q.working_steps_json,
      q.image_url,
      q.image_alt,
      q.difficulty as difficulty_rating,
      q.created_at
    FROM questions q
    JOIN topics t ON q.topic_id = t.id
    ORDER BY t.form_level ASC, t.id ASC, q.id ASC
  `).all();

  const excelData = rows.map((r) => {
    let options = [];
    try {
      options = JSON.parse(r.options_json || '[]');
    } catch (e) {
      options = [];
    }

    let steps = [];
    try {
      steps = JSON.parse(r.working_steps_json || '[]');
    } catch (e) {
      steps = [];
    }

    return {
      'Question ID': r.question_id,
      'Form Level': `Form ${r.form_level}`,
      'Curriculum Strand': r.curriculum_strand,
      'Unit Title': r.unit_title,
      'Topic ID': r.topic_id,
      'Topic Name': r.topic_name,
      'DepEd Competency Code': r.deped_competency_code,
      'Question Title': r.question_title,
      'Question Text': r.question_text,
      'LaTeX Formula Expression': r.latex_formula_expression || '',
      'Question Type': r.question_type || 'MCQ',
      'Option A': options[0] !== undefined ? String(options[0]) : '',
      'Option B': options[1] !== undefined ? String(options[1]) : '',
      'Option C': options[2] !== undefined ? String(options[2]) : '',
      'Option D': options[3] !== undefined ? String(options[3]) : '',
      'Correct Answer': r.correct_answer,
      'Hint': r.hint || '',
      'Step-by-Step Working': steps.join(' \n'),
      'Graph / Image URL': r.image_url || '',
      'Image Alt Text': r.image_alt || '',
      'Difficulty Rating': r.difficulty_rating || 3,
      'Created Date': r.created_at
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(excelData);
  
  // Set column widths for readability
  worksheet['!cols'] = [
    { wch: 12 }, // Question ID
    { wch: 12 }, // Form Level
    { wch: 25 }, // Strand
    { wch: 25 }, // Unit
    { wch: 10 }, // Topic ID
    { wch: 30 }, // Topic Name
    { wch: 35 }, // Competency
    { wch: 30 }, // Question Title
    { wch: 45 }, // Question Text
    { wch: 25 }, // LaTeX
    { wch: 15 }, // Type
    { wch: 18 }, // Opt A
    { wch: 18 }, // Opt B
    { wch: 18 }, // Opt C
    { wch: 18 }, // Opt D
    { wch: 18 }, // Correct Answer
    { wch: 25 }, // Hint
    { wch: 50 }, // Step-by-Step
    { wch: 30 }, // Image URL
    { wch: 25 }, // Image Alt
    { wch: 15 }, // Difficulty
    { wch: 20 }  // Created Date
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'DepEd Question Bank');

  XLSX.writeFile(workbook, filePath);
  console.log(`✅ Excel Question Bank exported successfully to ${filePath} (${excelData.length} records).`);
  return filePath;
}

export function importQuestionsFromExcel(db, bufferOrFilePath) {
  let workbook;
  if (typeof bufferOrFilePath === 'string') {
    workbook = XLSX.readFile(bufferOrFilePath);
  } else {
    workbook = XLSX.read(bufferOrFilePath, { type: 'buffer' });
  }

  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet);

  let inserted = 0;
  let updated = 0;

  const getTopic = db.prepare('SELECT id FROM topics WHERE title = ? OR id = ? LIMIT 1');
  const insertStmt = db.prepare(`
    INSERT INTO questions (topic_id, question_title, question_text, math_formula, question_type, options_json, correct_answer, hint, working_steps_json, image_url, image_alt, difficulty, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'excel_import')
  `);
  const updateStmt = db.prepare(`
    UPDATE questions
    SET topic_id = ?, question_title = ?, question_text = ?, math_formula = ?, question_type = ?, options_json = ?, correct_answer = ?, hint = ?, working_steps_json = ?, image_url = ?, image_alt = ?, difficulty = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);

  db.transaction(() => {
    for (const row of rows) {
      const topicName = row['Topic Name'] || row['topic_name'];
      const topicIdReq = row['Topic ID'] || row['topic_id'];
      
      const foundTopic = getTopic.get(topicName || '', topicIdReq || 0);
      const topicId = foundTopic ? foundTopic.id : 1;

      const qTitle = row['Question Title'] || row['question_title'] || 'Imported Question';
      const qText = row['Question Text'] || row['question_text'] || '';
      const formula = row['LaTeX Formula Expression'] || row['math_formula'] || '';
      const qType = row['Question Type'] || row['question_type'] || 'MCQ';
      
      const optA = row['Option A'] !== undefined ? String(row['Option A']) : '';
      const optB = row['Option B'] !== undefined ? String(row['Option B']) : '';
      const optC = row['Option C'] !== undefined ? String(row['Option C']) : '';
      const optD = row['Option D'] !== undefined ? String(row['Option D']) : '';
      const options = [optA, optB, optC, optD].filter(o => o !== '');

      const correctAns = String(row['Correct Answer'] || row['correct_answer'] || optA);
      const hint = row['Hint'] || row['hint'] || '';
      
      const stepsRaw = row['Step-by-Step Working'] || row['working_steps'] || '';
      const steps = typeof stepsRaw === 'string' ? stepsRaw.split('\n').map(s => s.trim()).filter(Boolean) : [];

      const imageUrl = row['Graph / Image URL'] || row['image_url'] || '';
      const imageAlt = row['Image Alt Text'] || row['image_alt'] || '';
      const difficulty = Number(row['Difficulty Rating'] || row['difficulty'] || 3);
      const qId = row['Question ID'] || row['question_id'];

      if (qId && Number.isInteger(Number(qId))) {
        const existing = db.prepare('SELECT id FROM questions WHERE id = ?').get(qId);
        if (existing) {
          updateStmt.run(topicId, qTitle, qText, formula, qType, JSON.stringify(options), correctAns, hint, JSON.stringify(steps), imageUrl, imageAlt, difficulty, qId);
          updated++;
          continue;
        }
      }

      insertStmt.run(topicId, qTitle, qText, formula, qType, JSON.stringify(options), correctAns, hint, JSON.stringify(steps), imageUrl, imageAlt, difficulty);
      inserted++;
    }
  })();

  return { inserted, updated, total: inserted + updated };
}
