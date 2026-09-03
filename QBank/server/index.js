import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { initDb, updateFallbackQuestionDisplay } from './db.js';
import { exportQuestionsToExcel, importQuestionsFromExcel } from './excelService.js';
import { generateDynamicQuestion } from './fallbackGenerator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, '..', 'public', 'images')));
app.use('/images', express.static(path.join(__dirname, '..', 'images')));

const db = initDb();
const upload = multer({ storage: multer.memoryStorage() });

// 1. GET /api/topics
app.get('/api/topics', (req, res) => {
  try {
    const { form_level, strand } = req.query;
    let sql = 'SELECT * FROM topics WHERE 1=1';
    const params = [];

    if (form_level) {
      sql += ' AND form_level = ?';
      params.push(Number(form_level));
    }
    if (strand) {
      sql += ' AND strand = ?';
      params.push(strand);
    }

    sql += ' ORDER BY form_level ASC, id ASC';
    const topics = db.prepare(sql).all(...params);
    res.json({ success: true, topics });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. GET /api/questions (List & Search)
app.get('/api/questions', (req, res) => {
  try {
    const { topic_id, form_level, strand, search, page = 1, limit = 20 } = req.query;
    let sql = `
      SELECT q.*, t.title as topic_title, t.form_level, t.strand
      FROM questions q
      JOIN topics t ON q.topic_id = t.id
      WHERE 1=1
    `;
    const params = [];

    if (topic_id) {
      sql += ' AND q.topic_id = ?';
      params.push(Number(topic_id));
    }
    if (form_level) {
      sql += ' AND t.form_level = ?';
      params.push(Number(form_level));
    }
    if (strand) {
      sql += ' AND t.strand = ?';
      params.push(strand);
    }
    if (search) {
      sql += ' AND (q.question_title LIKE ? OR q.question_text LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    const countSql = `SELECT COUNT(*) as total FROM (${sql})`;
    const total = db.prepare(countSql).get(...params).total;

    const offset = (Number(page) - 1) * Number(limit);
    sql += ' ORDER BY q.id ASC LIMIT ? OFFSET ?';
    params.push(Number(limit), offset);

    const questions = db.prepare(sql).all(...params).map(q => ({
      ...q,
      options: JSON.parse(q.options_json || '[]'),
      working_steps: JSON.parse(q.working_steps_json || '[]')
    }));

    res.json({
      success: true,
      questions,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 3. GET /api/questions/sample (Random Drill)
app.get('/api/questions/sample', (req, res) => {
  try {
    const { topic_id, form_level, count = 5 } = req.query;
    let sql = `
      SELECT q.*, t.title as topic_title, t.form_level, t.strand
      FROM questions q
      JOIN topics t ON q.topic_id = t.id
      WHERE 1=1
    `;
    const params = [];

    if (topic_id) {
      sql += ' AND q.topic_id = ?';
      params.push(Number(topic_id));
    } else if (form_level) {
      sql += ' AND t.form_level = ?';
      params.push(Number(form_level));
    }

    sql += ' ORDER BY RANDOM() LIMIT ?';
    params.push(Number(count));

    const questions = db.prepare(sql).all(...params).map(q => ({
      ...q,
      options: JSON.parse(q.options_json || '[]'),
      working_steps: JSON.parse(q.working_steps_json || '[]')
    }));

    res.json({ success: true, questions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 4. POST /api/questions/validate
app.post('/api/questions/validate', (req, res) => {
  try {
    const { question_id, submitted_answer } = req.body;
    const question = db.prepare('SELECT * FROM questions WHERE id = ?').get(question_id);

    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    const isCorrect = String(submitted_answer).trim().toLowerCase() === String(question.correct_answer).trim().toLowerCase();

    res.json({
      success: true,
      is_correct: isCorrect,
      correct_answer: question.correct_answer,
      hint: question.hint,
      working_steps: JSON.parse(question.working_steps_json || '[]')
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 5. POST /api/questions/generate-fallback
app.post('/api/questions/generate-fallback', (req, res) => {
  try {
    const { topic_id, difficulty = 3 } = req.body;
    const topic = db.prepare('SELECT * FROM topics WHERE id = ?').get(topic_id || 1);

    if (!topic) {
      return res.status(404).json({ success: false, message: 'Topic not found' });
    }

    const generated = generateDynamicQuestion(topic, Number(difficulty));

    // Save generated question to DB
    const insertStmt = db.prepare(`
      INSERT INTO questions (topic_id, question_title, question_text, math_formula, question_type, options_json, correct_answer, hint, working_steps_json, image_url, image_alt, difficulty, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'fallback_generator')
    `);

    const result = insertStmt.run(
      topic.id,
      generated.question_title,
      generated.question_text,
      generated.math_formula,
      generated.question_type,
      JSON.stringify(generated.options),
      generated.correct_answer,
      generated.hint,
      JSON.stringify(generated.working_steps),
      generated.image_url,
      generated.image_alt,
      generated.difficulty
    );

    res.json({
      success: true,
      question: {
        id: result.lastInsertRowid,
        topic_id: topic.id,
        topic_title: topic.title,
        form_level: topic.form_level,
        strand: topic.strand,
        ...generated
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 6. GET /api/admin/questions/export/excel
app.get('/api/admin/questions/export/excel', (req, res) => {
  try {
    const tempPath = path.join(__dirname, '..', 'questions_bank.xlsx');
    exportQuestionsToExcel(db, tempPath);
    res.download(tempPath, 'questions_bank.xlsx');
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 7. POST /api/admin/questions/import/excel
app.post('/api/admin/questions/import/excel', upload.single('excel_file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No Excel file uploaded' });
    }

    const result = importQuestionsFromExcel(db, req.file.buffer);

    // Sync updated question bank back to questions_bank.xlsx
    const tempPath = path.join(__dirname, '..', 'questions_bank.xlsx');
    exportQuestionsToExcel(db, tempPath);

    res.json({
      success: true,
      message: `Successfully processed Excel import (${result.inserted} inserted, ${result.updated} updated).`,
      result
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 8. Admin CRUD Endpoints
app.post('/api/admin/questions', (req, res) => {
  try {
    const {
      topic_id,
      question_title,
      question_text,
      math_formula = '',
      question_type = 'MCQ',
      options = [],
      correct_answer,
      hint = '',
      working_steps = [],
      image_url = '',
      image_alt = '',
      difficulty = 3
    } = req.body;

    const stmt = db.prepare(`
      INSERT INTO questions (topic_id, question_title, question_text, math_formula, question_type, options_json, correct_answer, hint, working_steps_json, image_url, image_alt, difficulty, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'admin')
    `);

    const result = stmt.run(
      topic_id,
      question_title,
      question_text,
      math_formula,
      question_type,
      JSON.stringify(options),
      correct_answer,
      hint,
      JSON.stringify(working_steps),
      image_url,
      image_alt,
      difficulty
    );

    res.json({ success: true, question_id: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

function saveQuestionDisplaySettings(questionId, showImage, showFormula) {
  saveBatchQuestionDisplaySettings([{ id: questionId, show_image: showImage, show_formula: showFormula }]);
}

function saveBatchQuestionDisplaySettings(settings) {
  if (!Array.isArray(settings) || settings.length === 0) return;

  const updatesMap = new Map();
  settings.forEach(item => {
    const qid = Number(item.id);
    const imgVal = (item.show_image === 1 || item.show_image === '1' || item.show_image === true) ? 1 : 0;
    const fmlVal = (item.show_formula === 1 || item.show_formula === '1' || item.show_formula === true) ? 1 : 0;
    updatesMap.set(qid, { imgVal, fmlVal });

    updateFallbackQuestionDisplay(qid, imgVal === 1, fmlVal === 1);

    try {
      db.prepare('UPDATE questions SET show_image = ?, show_formula = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(imgVal, fmlVal, qid);
    } catch (e) {}
  });

  const jsonPaths = [
    path.join(__dirname, '..', 'questions.json'),
    path.join(__dirname, '..', '..', 'questions.json'),
    path.join(__dirname, '..', 'QBank', 'questions.json'),
    path.join(__dirname, 'questions.json')
  ];

  jsonPaths.forEach(p => {
    if (fs.existsSync(p)) {
      try {
        const qList = JSON.parse(fs.readFileSync(p, 'utf8'));
        let modified = false;
        qList.forEach(item => {
          const setting = updatesMap.get(Number(item.id));
          if (setting) {
            item.show_image = setting.imgVal;
            item.show_formula = setting.fmlVal;
            modified = true;
          }
        });
        if (modified) {
          fs.writeFileSync(p, JSON.stringify(qList, null, 2), 'utf8');
        }
      } catch (err) {}
    }
  });
}

app.post('/api/questions/batch-display-settings', (req, res) => {
  try {
    const { settings } = req.body;
    saveBatchQuestionDisplaySettings(settings);
    res.json({ success: true, message: `Display settings saved for ${settings ? settings.length : 0} questions.` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/admin/questions/batch-display-settings', (req, res) => {
  try {
    const { settings } = req.body;
    saveBatchQuestionDisplaySettings(settings);
    res.json({ success: true, message: `Display settings saved for ${settings ? settings.length : 0} questions.` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/questions/:id/display-settings', (req, res) => {
  try {
    const { id } = req.params;
    const { show_image, show_formula } = req.body;
    const imgOn = show_image === 1 || show_image === '1' || show_image === true;
    const fmlOn = show_formula === 1 || show_formula === '1' || show_formula === true;
    saveQuestionDisplaySettings(id, imgOn, fmlOn);
    res.json({ success: true, message: 'Display settings saved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/admin/questions/:id/display-settings', (req, res) => {
  try {
    const { id } = req.params;
    const { show_image, show_formula } = req.body;
    saveQuestionDisplaySettings(id, show_image !== 0 && show_image !== false, show_formula !== 0 && show_formula !== false);
    res.json({ success: true, message: 'Display settings saved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/admin/questions/:id', (req, res) => {
  try {
    const { id } = req.params;
    const {
      topic_id,
      question_title,
      question_text,
      math_formula = '',
      question_type = 'MCQ',
      options = [],
      correct_answer,
      hint = '',
      working_steps = [],
      image_url = '',
      image_alt = '',
      difficulty = 3,
      show_image = 1,
      show_formula = 1
    } = req.body;

    const stmt = db.prepare(`
      UPDATE questions
      SET topic_id = ?, question_title = ?, question_text = ?, math_formula = ?, question_type = ?, options_json = ?, correct_answer = ?, hint = ?, working_steps_json = ?, image_url = ?, image_alt = ?, difficulty = ?, show_image = ?, show_formula = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(
      topic_id,
      question_title,
      question_text,
      math_formula,
      question_type,
      JSON.stringify(options),
      correct_answer,
      hint,
      JSON.stringify(working_steps),
      image_url,
      image_alt,
      difficulty,
      show_image ? 1 : 0,
      show_formula ? 1 : 0,
      id
    );

    saveQuestionDisplaySettings(id, show_image, show_formula);

    res.json({ success: true, message: 'Question updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/admin/questions/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM questions WHERE id = ?').run(id);
    res.json({ success: true, message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/admin/questions/bulk-delete', (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'ids array is required and must not be empty' });
    }

    const placeholders = ids.map(() => '?').join(',');
    const stmt = db.prepare(`DELETE FROM questions WHERE id IN (${placeholders})`);
    const info = stmt.run(...ids);

    // Export updated database to Excel
    const tempPath = path.join(__dirname, '..', 'questions_bank.xlsx');
    exportQuestionsToExcel(db, tempPath);

    res.json({
      success: true,
      message: `Successfully deleted ${info.changes} question(s).`,
      deletedCount: info.changes
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 QBank REST API Server running on port ${PORT}`);
  });
}

export default app;
