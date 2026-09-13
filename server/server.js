import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import db, { initDb, updateFallbackQuestionDisplay } from './db.js';
import { getExerciseForTopic } from './mathEngine.js';
import { exportQuestionsToExcel, importQuestionsFromExcel } from './excelService.js';
import { generateDynamicQuestion } from './fallbackGenerator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 6000;
const JWT_SECRET = 'etuition_secret_key_2026';

// Initialize Database & Question Bank
initDb();

const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

// Serve static images across public/images directories
app.use('/images', express.static(path.join(__dirname, '..', 'public', 'images')));
app.use('/images', express.static(path.join(__dirname, '..', 'images')));
app.use('/images', express.static(path.join(__dirname, '..', 'QBank', 'public', 'images')));
app.use('/images', express.static(path.join(__dirname, '..', 'QBank', 'images')));

// --- Authentication Middleware ---
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Authentication token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access privileges required' });
  }
  next();
}

// Router instance for handling both /api/... and /... endpoints on Vercel Serverless
const router = express.Router();

// --- Auth Routes ---

router.post('/auth/register', (req, res) => {
  const { name, email, password, form_level, school } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE LOWER(email) = LOWER(?)').get(email);
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists' });
  }

  const password_hash = bcrypt.hashSync(password, 10);
  const formLvl = Number(form_level) || 1;

  const result = db.prepare(`
    INSERT INTO users (name, email, password_hash, plain_password, role, status, form_level, school)
    VALUES (?, ?, ?, ?, 'student', 'pending', ?, ?)
  `).run(name, email, password_hash, password, formLvl, school || '');

  res.status(201).json({
    message: 'Registration successful! Your account is pending Admin Manager approval.',
    userId: result.lastInsertRowid,
    status: 'pending'
  });
});

router.post('/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = db.prepare('SELECT * FROM users WHERE LOWER(email) = LOWER(?)').get(email);
  if (!user) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  let validPassword = bcrypt.compareSync(password, user.password_hash);
  if (!validPassword && user.plain_password && password === user.plain_password) {
    validPassword = true;
    try {
      const newHash = bcrypt.hashSync(password, 10);
      db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(newHash, user.id);
    } catch (e) {}
  }

  if (!validPassword) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  if (user.role === 'student' && user.status !== 'approved') {
    return res.status(403).json({
      error: 'Account Pending Approval',
      message: 'Your student account is currently pending Admin Manager approval.',
      status: user.status
    });
  }

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role, form_level: user.form_level },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      form_level: user.form_level,
      school: user.school
    }
  });
});

// --- Admin Student Management Routes ---

router.get('/admin/students', authenticateToken, requireAdmin, (req, res) => {
  const students = db.prepare(`
    SELECT id, name, email, plain_password, status, form_level, school, created_at
    FROM users
    WHERE role = 'student'
    ORDER BY created_at DESC
  `).all();

  res.json(students);
});

router.put('/admin/students/:id/status', authenticateToken, requireAdmin, (req, res) => {
  const studentId = Number(req.params.id);
  const { status } = req.body;

  if (!['approved', 'pending', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  const result = db.prepare("UPDATE users SET status = ? WHERE id = ? AND role = 'student'").run(status, studentId);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Student record not found' });
  }

  res.json({ message: `Student status updated to ${status}` });
});

router.delete('/admin/students/:id', authenticateToken, requireAdmin, (req, res) => {
  const studentId = Number(req.params.id);

  db.prepare('DELETE FROM exercise_attempts WHERE user_id = ?').run(studentId);
  const result = db.prepare("DELETE FROM users WHERE id = ? AND role = 'student'").run(studentId);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Student record not found' });
  }

  res.json({ message: 'Student account deleted successfully' });
});

router.put('/admin/students/:id/level', authenticateToken, requireAdmin, (req, res) => {
  const studentId = Number(req.params.id);
  const { form_level } = req.body;

  const levelNum = Number(form_level);
  if (!levelNum || levelNum < 1 || levelNum > 12) {
    return res.status(400).json({ error: 'Invalid form level (must be between 1 and 12)' });
  }

  const result = db.prepare("UPDATE users SET form_level = ? WHERE id = ? AND role = 'student'").run(levelNum, studentId);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Student record not found' });
  }

  res.json({ message: `Student registered level updated to Form ${levelNum}`, form_level: levelNum });
});

// --- Unified Curriculum & QBank Topics Routes ---

router.get('/topics', (req, res) => {
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

router.get('/curriculum', (req, res) => {
  const { form_level, strand } = req.query;

  let query = 'SELECT * FROM topics WHERE 1=1';
  const params = [];

  if (form_level) {
    query += ' AND form_level = ?';
    params.push(Number(form_level));
  }

  if (strand) {
    query += ' AND strand = ?';
    params.push(strand);
  }

  query += ' ORDER BY form_level ASC, id ASC';
  const topics = db.prepare(query).all(...params);

  res.json(topics);
});

// --- QBank REST API Routes ---

// List & Search Questions with Pagination
router.get('/questions', (req, res) => {
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
      options: typeof q.options_json === 'string' ? JSON.parse(q.options_json || '[]') : (q.options || []),
      working_steps: typeof q.working_steps_json === 'string' ? JSON.parse(q.working_steps_json || '[]') : (q.working_steps || [])
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

// Random Sample Question Drill
router.get('/questions/sample', (req, res) => {
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
      options: typeof q.options_json === 'string' ? JSON.parse(q.options_json || '[]') : (q.options || []),
      working_steps: typeof q.working_steps_json === 'string' ? JSON.parse(q.working_steps_json || '[]') : (q.working_steps || [])
    }));

    res.json({ success: true, questions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Validate Question Submission
router.post('/questions/validate', (req, res) => {
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
      working_steps: typeof question.working_steps_json === 'string' ? JSON.parse(question.working_steps_json || '[]') : []
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Generate Fallback Dynamic Question
router.post('/questions/generate-fallback', (req, res) => {
  try {
    const { topic_id, difficulty = 3 } = req.body;
    const topic = db.prepare('SELECT * FROM topics WHERE id = ?').get(topic_id || 1);

    if (!topic) {
      return res.status(404).json({ success: false, message: 'Topic not found' });
    }

    const generated = generateDynamicQuestion(topic, Number(difficulty));

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

// Excel Export
router.get('/admin/questions/export/excel', (req, res) => {
  try {
    const tempPath = path.join(__dirname, '..', 'questions_bank.xlsx');
    exportQuestionsToExcel(db, tempPath);
    res.download(tempPath, 'questions_bank.xlsx');
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Excel Import
router.post('/admin/questions/import/excel', upload.single('excel_file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No Excel file uploaded' });
    }

    const result = importQuestionsFromExcel(db, req.file.buffer);

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

// Admin Create Question
router.post('/admin/questions', (req, res) => {
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

// Admin Get Questions
router.get('/admin/questions', (req, res) => {
  const { topic_id, form_level } = req.query;

  let query = `
    SELECT q.*, t.title as topic_title, t.form_level, t.strand
    FROM questions q
    JOIN topics t ON q.topic_id = t.id
    WHERE 1=1
  `;
  const params = [];

  if (topic_id) {
    query += ' AND q.topic_id = ?';
    params.push(topic_id);
  }

  if (form_level) {
    query += ' AND t.form_level = ?';
    params.push(Number(form_level));
  }

  query += ' ORDER BY q.id DESC';
  const questions = db.prepare(query).all(...params);

  res.json(questions);
});

// Admin Update Question
router.put('/admin/questions/:id', (req, res) => {
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

// Admin Delete Question
router.delete('/admin/questions/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM questions WHERE id = ?').run(id);
    res.json({ success: true, message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin Bulk Delete Questions
router.post('/admin/questions/bulk-delete', (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'ids array is required and must not be empty' });
    }

    const placeholders = ids.map(() => '?').join(',');
    const stmt = db.prepare(`DELETE FROM questions WHERE id IN (${placeholders})`);
    const info = stmt.run(...ids);

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

// Display Settings
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
    path.join(__dirname, 'questions.json'),
    path.join(__dirname, '..', 'questions.json'),
    path.join(__dirname, '..', 'QBank', 'questions.json')
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

router.post('/questions/batch-display-settings', (req, res) => {
  try {
    const { settings } = req.body;
    saveBatchQuestionDisplaySettings(settings);
    res.json({ success: true, message: `Display settings saved for ${settings ? settings.length : 0} questions.` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/admin/questions/batch-display-settings', (req, res) => {
  try {
    const { settings } = req.body;
    saveBatchQuestionDisplaySettings(settings);
    res.json({ success: true, message: `Display settings saved for ${settings ? settings.length : 0} questions.` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/questions/:id/display-settings', (req, res) => {
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

router.put('/admin/questions/:id/display-settings', (req, res) => {
  try {
    const { id } = req.params;
    const { show_image, show_formula } = req.body;
    saveQuestionDisplaySettings(id, show_image !== 0 && show_image !== false, show_formula !== 0 && show_formula !== false);
    res.json({ success: true, message: 'Display settings saved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- Curriculum & Exercise Engine Routes ---

function optionalAuthToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return next();
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (!err) req.user = user;
    next();
  });
}

router.post('/exercises/generate', optionalAuthToken, async (req, res) => {
  const { form_level, strand, topic_id } = req.body;

  let topic = topic_id ? db.prepare('SELECT * FROM topics WHERE id = ?').get(topic_id) : null;
  let targetLevel = topic ? topic.form_level : (form_level || 1);

  if (req.user && req.user.role === 'student' && req.user.form_level) {
    targetLevel = req.user.form_level;
    if (topic && topic.form_level !== req.user.form_level) {
      topic = db.prepare('SELECT * FROM topics WHERE form_level = ? LIMIT 1').get(req.user.form_level);
    }
  }

  const targetStrand = topic ? topic.strand : (strand || 'Numbers and Number Sense');
  const targetTopicId = topic ? topic.id : null;

  const exercise = await getExerciseForTopic(targetTopicId, targetLevel, targetStrand);

  res.json({
    topicId: targetTopicId,
    topicTitle: topic ? topic.title : exercise.title,
    formLevel: targetLevel,
    strand: targetStrand,
    exercise
  });
});

router.post('/exercises/submit', authenticateToken, (req, res) => {
  const { topic_id, question_title, is_correct, time_taken_sec } = req.body;

  const result = db.prepare(`
    INSERT INTO exercise_attempts (user_id, topic_id, question_title, is_correct, time_taken_sec)
    VALUES (?, ?, ?, ?, ?)
  `).run(req.user.id, topic_id || 1, question_title || 'Math Exercise', is_correct ? 1 : 0, time_taken_sec || 0);

  res.json({ message: 'Attempt recorded', attemptId: result.lastInsertRowid });
});

router.get('/students/progress', authenticateToken, (req, res) => {
  const userId = req.user.id;

  const totalAttempts = db.prepare('SELECT COUNT(*) as count FROM exercise_attempts WHERE user_id = ?').get(userId).count;
  const correctCount = db.prepare('SELECT COUNT(*) as count FROM exercise_attempts WHERE user_id = ? AND is_correct = 1').get(userId).count;
  const recentAttempts = db.prepare(`
    SELECT e.*, t.title as topic_title, t.strand
    FROM exercise_attempts e
    LEFT JOIN topics t ON e.topic_id = t.id
    WHERE e.user_id = ?
    ORDER BY e.created_at DESC LIMIT 10
  `).all(userId);

  const accuracyRate = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0;

  res.json({
    totalAttempts,
    correctCount,
    accuracyRate,
    recentAttempts
  });
});

// Mount router on BOTH /api and / so all Vercel Serverless rewrite variations work seamlessly
app.use('/api', router);
app.use('/', router);

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 eTuition & QBank Consolidated Server running on port ${PORT}`);
  });
}

export default app;
