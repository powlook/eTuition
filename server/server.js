import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db, { initDb, updateFallbackQuestionDisplay } from './db.js';
import { getExerciseForTopic } from './mathEngine.js';

const app = express();
const PORT = process.env.PORT || 6000;
const JWT_SECRET = 'etuition_secret_key_2026';

// Initialize Database & Question Bank
initDb();

app.use(cors());
app.use(express.json());

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
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access privileges required' });
  }
  next();
}

// --- Auth Routes ---

app.post('/api/auth/register', (req, res) => {
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

app.post('/api/auth/login', (req, res) => {
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

app.get('/api/admin/students', authenticateToken, requireAdmin, (req, res) => {
  const students = db.prepare(`
    SELECT id, name, email, plain_password, status, form_level, school, created_at
    FROM users
    WHERE role = 'student'
    ORDER BY created_at DESC
  `).all();

  res.json(students);
});

app.put('/api/admin/students/:id/status', authenticateToken, requireAdmin, (req, res) => {
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

// Admin Endpoint: Delete Student Account
app.delete('/api/admin/students/:id', authenticateToken, requireAdmin, (req, res) => {
  const studentId = Number(req.params.id);

  db.prepare('DELETE FROM exercise_attempts WHERE user_id = ?').run(studentId);
  const result = db.prepare("DELETE FROM users WHERE id = ? AND role = 'student'").run(studentId);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Student record not found' });
  }

  res.json({ message: 'Student account deleted successfully' });
});

// Admin Endpoint: Change Student Registered Form Level (Form 1 to 12)
app.put('/api/admin/students/:id/level', authenticateToken, requireAdmin, (req, res) => {
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

// --- Admin Question Bank Management Routes ---

// Fetch questions from Question Bank (Optionally filter by topic_id or form_level)
app.get('/api/admin/questions', authenticateToken, requireAdmin, (req, res) => {
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

// Admin Add New Question (Disabled in eTuition - Managed via QBank)
app.post('/api/admin/questions', authenticateToken, requireAdmin, (req, res) => {
  return res.status(400).json({
    error: 'Question creation disabled in eTuition. All questions must be created through QBank Application.'
  });
});

// Admin Endpoint: Update Question Display Settings (Show Image / Show Formula)
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
    const imgOn = show_image === 1 || show_image === '1' || show_image === true;
    const fmlOn = show_formula === 1 || show_formula === '1' || show_formula === true;
    saveQuestionDisplaySettings(id, imgOn, fmlOn);
    res.json({ success: true, message: 'Display settings saved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin Delete Question from Question Bank
app.delete('/api/admin/questions/:id', authenticateToken, requireAdmin, (req, res) => {
  const questionId = req.params.id;
  db.prepare('DELETE FROM questions WHERE id = ?').run(questionId);
  res.json({ message: 'Question removed from Question Bank' });
});

// --- Curriculum & Exercise Engine Routes ---

app.get('/api/curriculum', (req, res) => {
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

// Optional Auth Middleware for endpoints accessible by both guests and logged-in users
function optionalAuthToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return next();
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (!err) req.user = user;
    next();
  });
}

// Generate or fetch topic-specific question from QBank Microservice (Enforces Student Form Level Constraint)
app.post('/api/exercises/generate', optionalAuthToken, async (req, res) => {
  const { form_level, strand, topic_id } = req.body;

  let topic = topic_id ? db.prepare('SELECT * FROM topics WHERE id = ?').get(topic_id) : null;
  let targetLevel = topic ? topic.form_level : (form_level || 1);

  // If logged in as student, force targetLevel to student's registered level
  if (req.user && req.user.role === 'student' && req.user.form_level) {
    targetLevel = req.user.form_level;
    // If topic requested belongs to another level, find a valid topic in student's registered level
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

app.post('/api/exercises/submit', authenticateToken, (req, res) => {
  const { topic_id, question_title, is_correct, time_taken_sec } = req.body;

  const result = db.prepare(`
    INSERT INTO exercise_attempts (user_id, topic_id, question_title, is_correct, time_taken_sec)
    VALUES (?, ?, ?, ?, ?)
  `).run(req.user.id, topic_id || 1, question_title || 'Math Exercise', is_correct ? 1 : 0, time_taken_sec || 0);

  res.json({ message: 'Attempt recorded', attemptId: result.lastInsertRowid });
});

app.get('/api/students/progress', authenticateToken, (req, res) => {
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

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 eTuition Server running on port ${PORT}`);
  });
}

export default app;
