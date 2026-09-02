import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'qbank.db');
const isVercel = Boolean(process.env.VERCEL);

let rawDb = null;
if (!isVercel) {
  try {
    const Database = (await import('better-sqlite3')).default;
    rawDb = new Database(dbPath);
    try { rawDb.pragma('journal_mode = WAL'); } catch (e) {}
  } catch (e) {
    console.log('Using JSON memory fallback engine for QBank serverless environment');
  }
}

const topicsJsonPath = path.join(__dirname, '..', 'matatag_topics.json');
let fallbackTopics = [];
if (fs.existsSync(topicsJsonPath)) {
  try {
    fallbackTopics = JSON.parse(fs.readFileSync(topicsJsonPath, 'utf8'));
  } catch (err) {}
}

const questionsJsonPath = path.join(__dirname, '..', 'questions.json');
let fallbackQuestions = [];
if (fs.existsSync(questionsJsonPath)) {
  try {
    fallbackQuestions = JSON.parse(fs.readFileSync(questionsJsonPath, 'utf8'));
  } catch (err) {}
}

const db = {
  prepare: (sql) => {
    if (rawDb) {
      try {
        return rawDb.prepare(sql);
      } catch (e) {}
    }
    return {
      get: (...params) => {
        if (sql.includes('FROM topics WHERE id = ?')) {
          const id = Number(params[0]);
          return fallbackTopics.find(t => t.id === id) || fallbackTopics[0] || null;
        }
        if (sql.includes('FROM topics WHERE form_level = ?')) {
          const lvl = Number(params[0]);
          return fallbackTopics.find(t => t.form_level === lvl) || fallbackTopics[0] || null;
        }
        if (sql.includes('COUNT(*) as count FROM questions WHERE topic_id = ?')) {
          const tid = Number(params[0]);
          return { count: fallbackQuestions.filter(q => q.topic_id === tid).length };
        }
        if (sql.includes('COUNT(*) as count FROM questions')) {
          return { count: fallbackQuestions.length };
        }
        if (sql.includes('COUNT(*) as count FROM topics')) {
          return { count: fallbackTopics.length };
        }
        if (sql.includes('FROM questions WHERE id = ?')) {
          const id = Number(params[0]);
          return fallbackQuestions.find(q => q.id === id) || fallbackQuestions[0] || null;
        }
        if (sql.includes('FROM questions')) {
          return fallbackQuestions[0] || null;
        }
        if (sql.includes('FROM topics')) {
          return fallbackTopics[0] || null;
        }
        return null;
      },
      all: (...params) => {
        if (sql.includes('FROM topics')) {
          let list = [...fallbackTopics];
          if (sql.includes('form_level = ?') && params.length > 0) {
            list = list.filter(t => t.form_level === Number(params[0]));
          }
          if (sql.includes('strand = ?')) {
            const strandParam = params[params.length - 1];
            if (strandParam && strandParam !== 'All Strands') {
              list = list.filter(t => t.strand === strandParam);
            }
          }
          return list;
        }
        if (sql.includes('FROM questions')) {
          let list = [...fallbackQuestions];
          if (sql.includes('topic_id = ?') && params.length > 0) {
            const tid = Number(params[0]);
            list = list.filter(q => q.topic_id === tid);
          } else if (sql.includes('form_level = ?') && params.length > 0) {
            const lvl = Number(params[0]);
            const validTopicIds = fallbackTopics.filter(t => t.form_level === lvl).map(t => t.id);
            list = list.filter(q => validTopicIds.includes(q.topic_id));
          }
          if (sql.includes('RANDOM()') || sql.includes('random()')) {
            for (let i = list.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [list[i], list[j]] = [list[j], list[i]];
            }
          }
          if (sql.includes('LIMIT')) {
            const limitParam = Number(params[params.length - 1]);
            const limit = !isNaN(limitParam) && limitParam > 0 ? limitParam : 10;
            list = list.slice(0, limit);
          }
          return list;
        }
        return [];
      },
      run: (...params) => {
        if (sql.includes('UPDATE questions SET')) {
          const [imgVal, fmlVal, qId] = params;
          const q = fallbackQuestions.find(x => Number(x.id) === Number(qId));
          if (q) {
            q.show_image = Number(imgVal);
            q.show_formula = Number(fmlVal);
            return { changes: 1 };
          }
        }
        return { lastInsertRowid: 1, changes: 1 };
      }
    };
  },
  exec: (sql) => {
    if (rawDb) {
      try { rawDb.exec(sql); } catch (e) {}
    }
  },
  transaction: (fn) => {
    return (...args) => {
      if (rawDb) {
        try { return rawDb.transaction(fn)(...args); } catch (e) {}
      }
      return fn(...args);
    };
  }
};

export function updateFallbackQuestionDisplay(questionId, showImage, showFormula) {
  const qid = Number(questionId);
  const imgVal = showImage ? 1 : 0;
  const fmlVal = showFormula ? 1 : 0;

  const item = fallbackQuestions.find(x => Number(x.id) === qid);
  if (item) {
    item.show_image = imgVal;
    item.show_formula = fmlVal;
  }
}

export function initDb() {
  if (rawDb) {
    try {
      rawDb.exec(`
        CREATE TABLE IF NOT EXISTS topics (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          form_level INTEGER NOT NULL,
          strand TEXT NOT NULL,
          unit TEXT NOT NULL,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          competencies TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS questions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          topic_id INTEGER NOT NULL,
          question_title TEXT NOT NULL,
          question_text TEXT NOT NULL,
          math_formula TEXT DEFAULT '',
          question_type TEXT DEFAULT 'MCQ',
          options_json TEXT NOT NULL,
          correct_answer TEXT NOT NULL,
          hint TEXT DEFAULT '',
          working_steps_json TEXT NOT NULL,
          image_url TEXT DEFAULT '',
          image_alt TEXT DEFAULT '',
          difficulty INTEGER DEFAULT 3,
          show_image INTEGER DEFAULT 1,
          show_formula INTEGER DEFAULT 1,
          created_by TEXT DEFAULT 'system',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(topic_id) REFERENCES topics(id) ON DELETE CASCADE
        );
      `);

      const columns = rawDb.prepare("PRAGMA table_info(questions)").all().map(c => c.name);
      if (!columns.includes('show_image')) {
        rawDb.exec("ALTER TABLE questions ADD COLUMN show_image INTEGER DEFAULT 1");
      }
      if (!columns.includes('show_formula')) {
        rawDb.exec("ALTER TABLE questions ADD COLUMN show_formula INTEGER DEFAULT 1");
      }
    } catch (e) {}
  }
  return db;
}

export default db;
