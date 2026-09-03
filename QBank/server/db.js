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

function getFilteredQuestions(sql, params = []) {
  let list = [...fallbackQuestions];

  // Map topics metadata onto question items
  const topicMap = new Map(fallbackTopics.map(t => [t.id, t]));
  list = list.map(q => {
    const t = topicMap.get(q.topic_id);
    return {
      ...q,
      topic_title: t ? t.title : `Topic ${q.topic_id}`,
      form_level: t ? t.form_level : 6,
      strand: t ? t.strand : 'Measurement and Geometry'
    };
  });

  let limit = null;
  let offset = 0;
  let filterParams = [...params];

  if (sql.includes('LIMIT ? OFFSET ?') && filterParams.length >= 2) {
    offset = Number(filterParams.pop()) || 0;
    const lVal = Number(filterParams.pop());
    limit = !isNaN(lVal) && lVal > 0 ? lVal : null;
  } else if (sql.includes('LIMIT ?') && filterParams.length >= 1) {
    const lVal = Number(filterParams.pop());
    limit = !isNaN(lVal) && lVal > 0 ? lVal : null;
  }

  let paramIdx = 0;

  if ((sql.includes('q.topic_id = ?') || sql.includes('topic_id = ?')) && paramIdx < filterParams.length) {
    const tid = Number(filterParams[paramIdx++]);
    if (!isNaN(tid)) {
      list = list.filter(q => q.topic_id === tid);
    }
  }

  if ((sql.includes('t.form_level = ?') || sql.includes('form_level = ?')) && paramIdx < filterParams.length) {
    const lvl = Number(filterParams[paramIdx++]);
    if (!isNaN(lvl)) {
      list = list.filter(q => q.form_level === lvl);
    }
  }

  if ((sql.includes('t.strand = ?') || sql.includes('strand = ?')) && paramIdx < filterParams.length) {
    const st = String(filterParams[paramIdx++]);
    if (st && st !== 'All Strands') {
      list = list.filter(q => q.strand === st);
    }
  }

  if (sql.includes('LIKE ?') && paramIdx < filterParams.length) {
    const searchVal = String(filterParams[paramIdx++] || '').replace(/%/g, '').toLowerCase();
    if ((sql.includes('OR q.question_text LIKE ?') || sql.includes('OR question_text LIKE ?')) && paramIdx < filterParams.length) {
      paramIdx++;
    }
    if (searchVal) {
      list = list.filter(q =>
        (q.question_title && q.question_title.toLowerCase().includes(searchVal)) ||
        (q.question_text && q.question_text.toLowerCase().includes(searchVal))
      );
    }
  }

  return { list, limit, offset };
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
        if (sql.toLowerCase().includes('count(')) {
          const { list } = getFilteredQuestions(sql, params);
          return { count: list.length, total: list.length };
        }
        if (sql.includes('FROM topics WHERE id = ?')) {
          const id = Number(params[0]);
          return fallbackTopics.find(t => t.id === id) || fallbackTopics[0] || null;
        }
        if (sql.includes('FROM topics WHERE form_level = ?')) {
          const lvl = Number(params[0]);
          return fallbackTopics.find(t => t.form_level === lvl) || fallbackTopics[0] || null;
        }
        if (sql.includes('COUNT(*) as count FROM topics')) {
          return { count: fallbackTopics.length, total: fallbackTopics.length };
        }
        if (sql.includes('FROM questions WHERE id = ?')) {
          const id = Number(params[0]);
          return fallbackQuestions.find(q => q.id === id) || fallbackQuestions[0] || null;
        }
        if (sql.includes('FROM questions')) {
          const { list } = getFilteredQuestions(sql, params);
          return list[0] || null;
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
          let { list, limit, offset } = getFilteredQuestions(sql, params);

          if (sql.includes('RANDOM()') || sql.includes('random()')) {
            for (let i = list.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [list[i], list[j]] = [list[j], list[i]];
            }
          }

          if (limit !== null && !isNaN(limit)) {
            return list.slice(offset, offset + limit);
          } else if (offset > 0) {
            return list.slice(offset);
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
