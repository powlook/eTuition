import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'etuition.db');
const isVercel = Boolean(process.env.VERCEL);

let rawDb = null;
if (!isVercel) {
  try {
    const Database = (await import('better-sqlite3')).default;
    rawDb = new Database(dbPath);
    try { rawDb.pragma('journal_mode = WAL'); } catch (e) {}
  } catch (e) {
    console.log('Using JSON memory fallback engine for serverless environment');
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

const initialUsers = [
  {
    id: 1,
    name: 'Portal Administrator',
    email: 'admin@etuition.ph',
    password_hash: '$2a$10$K3HrX/Y0JHrEFwnhi87UqOrXHPVnNkgm4oftMLrithUAL4xC6HcR.', // admin123
    plain_password: 'admin123',
    role: 'admin',
    status: 'approved',
    form_level: 12,
    school: 'DepEd Central Office',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Demo Student',
    email: 'student@etuition.ph',
    password_hash: '$2a$10$5vM9aPUL8PY2IT5f60xMeOIBGtuhQ9d1zbOZhb5Eab2RtKMJjkHlm', // student123
    plain_password: 'student123',
    role: 'student',
    status: 'approved',
    form_level: 6,
    school: 'Quezon City Elementary School',
    created_at: new Date().toISOString()
  }
];

let usersList = [...initialUsers];
let attemptsList = [];

function getFilteredQuestions(sql, params = []) {
  let list = [...fallbackQuestions];

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
        if (sql.includes('FROM users') && (sql.includes('email') || sql.includes('LOWER(email)'))) {
          const email = params[0];
          return usersList.find(u => u.email && u.email.toLowerCase() === String(email).toLowerCase()) || null;
        }
        if (sql.includes('FROM users') && sql.includes('id')) {
          const id = Number(params[0]);
          return usersList.find(u => u.id === id) || null;
        }
        if (sql.includes('FROM topics WHERE id = ?')) {
          const id = Number(params[0]);
          return fallbackTopics.find(t => t.id === id) || fallbackTopics[0] || null;
        }
        if (sql.includes('FROM topics WHERE form_level = ?')) {
          const lvl = Number(params[0]);
          return fallbackTopics.find(t => t.form_level === lvl) || fallbackTopics[0] || null;
        }
        if (sql.includes('COUNT(*) as count FROM exercise_attempts WHERE user_id = ? AND is_correct = 1')) {
          const uid = Number(params[0]);
          return { count: attemptsList.filter(a => a.user_id === uid && a.is_correct === 1).length };
        }
        if (sql.includes('COUNT(*) as count FROM exercise_attempts WHERE user_id = ?')) {
          const uid = Number(params[0]);
          return { count: attemptsList.filter(a => a.user_id === uid).length };
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
        if (sql.includes('FROM users WHERE role = \'student\'') || sql.includes("FROM users WHERE role = 'student'")) {
          return usersList.filter(u => u.role === 'student');
        }
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
        if (sql.includes('FROM exercise_attempts')) {
          const uid = Number(params[0]);
          return attemptsList.filter(a => a.user_id === uid);
        }
        return [];
      },
      run: (...params) => {
        if (sql.includes('INSERT INTO users')) {
          let name, email, password_hash, plain_password, role, status, form_level, school;
          if (params.length >= 8) {
            [name, email, password_hash, plain_password, role, status, form_level, school] = params;
          } else {
            [name, email, password_hash, role, status, form_level, school] = params;
            plain_password = '';
          }
          const newUser = {
            id: usersList.length + 1,
            name,
            email,
            password_hash,
            plain_password: plain_password || '',
            role: role || 'student',
            status: status || 'pending',
            form_level: Number(form_level) || 5,
            school: school || '',
            created_at: new Date().toISOString()
          };
          usersList.push(newUser);
          return { lastInsertRowid: newUser.id, changes: 1 };
        }
        if (sql.includes('DELETE FROM users')) {
          const id = Number(params[0]);
          const initialLength = usersList.length;
          usersList = usersList.filter(u => u.id !== id);
          return { changes: initialLength - usersList.length };
        }
        if (sql.includes('DELETE FROM exercise_attempts')) {
          const uid = Number(params[0]);
          const initialLength = attemptsList.length;
          attemptsList = attemptsList.filter(a => a.user_id !== uid);
          return { changes: initialLength - attemptsList.length };
        }
        if (sql.includes('UPDATE users SET status = ?')) {
          const [status, id] = params;
          const u = usersList.find(x => x.id === Number(id));
          if (u) { u.status = status; return { changes: 1 }; }
          return { changes: 0 };
        }
        if (sql.includes('UPDATE users SET form_level = ?')) {
          const [form_level, id] = params;
          const u = usersList.find(x => x.id === Number(id));
          if (u) { u.form_level = Number(form_level); return { changes: 1 }; }
          return { changes: 0 };
        }
        if (sql.includes('UPDATE questions SET')) {
          const [imgVal, fmlVal, qId] = params;
          const q = fallbackQuestions.find(x => Number(x.id) === Number(qId));
          if (q) {
            q.show_image = Number(imgVal);
            q.show_formula = Number(fmlVal);
            return { changes: 1 };
          }
        }
        if (sql.includes('INSERT INTO exercise_attempts')) {
          const [user_id, topic_id, question_title, is_correct, time_taken_sec] = params;
          const newAtt = {
            id: attemptsList.length + 1,
            user_id: Number(user_id),
            topic_id: Number(topic_id),
            question_title,
            is_correct: Number(is_correct),
            time_taken_sec: Number(time_taken_sec),
            created_at: new Date().toISOString()
          };
          attemptsList.push(newAtt);
          return { lastInsertRowid: newAtt.id, changes: 1 };
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

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const STATS_IMAGE = '/images/line_graph_trend.png';
const GEOM_IMAGE = '/images/geometric_triangle.png';
const PIE_IMAGE = '/images/pie_chart_math.png';

const NAMES = ['Sarah', 'Juan', 'Maria', 'Pedro', 'Ana', 'Jose', 'Liza', 'Gabriel', 'Bea', 'Carlo'];

function generateQuestionForTopic(topic, index) {
  const { form_level, title, strand } = topic;
  const lowerTitle = title.toLowerCase();
  let imageUrl = '';
  let imageAlt = '';

  if (strand === 'Data and Probability' || lowerTitle.includes('graph') || lowerTitle.includes('data') || lowerTitle.includes('pie') || lowerTitle.includes('pictograph')) {
    if (lowerTitle.includes('pie')) {
      imageUrl = PIE_IMAGE;
      imageAlt = 'Distribution Pie Chart Diagram';
    } else {
      imageUrl = STATS_IMAGE;
      imageAlt = 'Statistical Data Graph Trend Chart';
    }
  } else if (strand === 'Measurement and Geometry' || lowerTitle.includes('shape') || lowerTitle.includes('triangle') || lowerTitle.includes('polygon') || lowerTitle.includes('perimeter') || lowerTitle.includes('area') || lowerTitle.includes('circle') || lowerTitle.includes('volume')) {
    imageUrl = GEOM_IMAGE;
    imageAlt = 'Geometric Diagram Figure';
  }

  // 1. Data and Probability
  if (strand === 'Data and Probability' || lowerTitle.includes('probability') || lowerTitle.includes('data') || lowerTitle.includes('graph') || lowerTitle.includes('mean')) {
    if (lowerTitle.includes('pictograph') || lowerTitle.includes('pie') || form_level <= 3) {
      const red = randInt(2, 8);
      const blue = randInt(3, 9);
      const green = randInt(2, 7);
      const total = red + blue + green;
      const probStr = `${red}/${total}`;
      const options = shuffle([probStr, `${blue}/${total}`, `${green}/${total}`, `${red + 1}/${total}`]);
      return {
        title: `${title} - Problem #${index + 1}`,
        text: `In a survey experiment, a group collected ${red} red, ${blue} blue, and ${green} green responses (Total ${total}). What is the probability of selecting a red response?`,
        formula: `P(\\text{Red}) = \\frac{\\text{Red}}{\\text{Total}}`,
        type: 'MCQ',
        options,
        answer: probStr,
        hint: `Divide red count by total count.`,
        steps: [
          `**Step 1: Calculate total frequency**`,
          `$$\\text{Total} = ${red} + ${blue} + ${green} = ${total}$$`,
          `**Step 2: Calculate probability ratio**`,
          `$$P(\\text{Red}) = \\frac{${red}}{${total}}$$`,
          `**Final Verified Answer:** \\(\\frac{${red}}{${total}}\\)`
        ],
        image_url: imageUrl,
        image_alt: imageAlt,
        difficulty: 2
      };
    }

    if (lowerTitle.includes('mean') || lowerTitle.includes('variability') || lowerTitle.includes('central') || form_level >= 7) {
      const nums = [randInt(6, 12), randInt(8, 14), randInt(10, 18), randInt(12, 20), randInt(14, 22)];
      const sum = nums.reduce((a, b) => a + b, 0);
      const mean = Number((sum / nums.length).toFixed(1));
      const options = shuffle([`${mean}`, `${(mean + 1.2).toFixed(1)}`, `${Math.max(1, mean - 1.5).toFixed(1)}`, `${(mean + 2.4).toFixed(1)}`]);
      return {
        title: `${title} - Task #${index + 1}`,
        text: `Find the mean (average) of the statistical dataset \\([${nums.join(', ')}]\\):`,
        formula: `\\bar{x} = \\frac{\\sum x}{N}`,
        type: 'MCQ',
        options,
        answer: String(mean),
        hint: `Sum all values and divide by ${nums.length}.`,
        steps: [
          `**Step 1: Sum dataset values**`,
          `$$\\sum x = ${nums.join(' + ')} = ${sum}$$`,
          `**Step 2: Divide by count N = ${nums.length}**`,
          `$$\\bar{x} = \\frac{${sum}}{${nums.length}} = ${mean}$$`,
          `**Final Verified Answer:** \\(${mean}\\)`
        ],
        image_url: STATS_IMAGE,
        image_alt: 'Dataset Statistical Summary',
        difficulty: 3
      };
    }

    const v1 = randInt(100, 250);
    const v2 = randInt(260, 480);
    const diff = v2 - v1;
    const options = shuffle([`₱${diff}`, `₱${diff + 40}`, `₱${Math.max(10, diff - 30)}`, `₱${diff + 80}`]);
    return {
      title: `${title} - Trend Analysis #${index + 1}`,
      text: `A statistical line chart indicates ₱${v1} in March and ₱${v2} in April. What is the net increase?`,
      formula: `\\text{Increase} = \\text{April} - \\text{March}`,
      type: 'MCQ',
      options,
      answer: `₱${diff}`,
      hint: `Subtract March value from April value.`,
      steps: [
        `**Step 1: Subtract values**`,
        `$$\\text{Increase} = \\text{₱}${v2} - \\text{₱}${v1} = \\text{₱}${diff}$$`,
        `**Final Verified Answer:** \\(\\text{₱}${diff}\\)`
      ],
      image_url: STATS_IMAGE,
      image_alt: 'Line Graph Data Trend',
      difficulty: 2
    };
  }

  // 2. Measurement and Geometry
  if (strand === 'Measurement and Geometry' || lowerTitle.includes('area') || lowerTitle.includes('perimeter') || lowerTitle.includes('volume') || lowerTitle.includes('angle') || lowerTitle.includes('triangle') || lowerTitle.includes('polygon') || lowerTitle.includes('circle')) {
    if (lowerTitle.includes('pythagorean') || lowerTitle.includes('triangle') || form_level >= 8) {
      const triples = [{ a: 3, b: 4, c: 5 }, { a: 6, b: 8, c: 10 }, { a: 5, b: 12, c: 13 }, { a: 8, b: 15, c: 17 }];
      const t = triples[index % triples.length];
      const ans = `${t.c} cm`;
      const options = shuffle([`${t.c} cm`, `${t.c + 2} cm`, `${Math.max(1, t.c - 3)} cm`, `${t.c + 5} cm`]);
      return {
        title: `${title} - Calculation #${index + 1}`,
        text: `In a right triangle with legs \\(a = ${t.a}\\text{ cm}\\) and \\(b = ${t.b}\\text{ cm}\\), calculate the hypotenuse length \\(c\\):`,
        formula: `c = \\sqrt{a^2 + b^2}`,
        type: 'MCQ',
        options,
        answer: ans,
        hint: `Use the Pythagorean Theorem $c^2 = a^2 + b^2$.`,
        steps: [
          `**Step 1: Apply Pythagorean Theorem**`,
          `$$c^2 = ${t.a}^2 + ${t.b}^2 = ${t.a * t.a} + ${t.b * t.b} = ${t.c * t.c}$$`,
          `**Step 2: Take square root**`,
          `$$c = \\sqrt{${t.c * t.c}} = ${t.c}\\text{ cm}$$`,
          `**Final Verified Answer:** \\(${ans}\\)`
        ],
        image_url: GEOM_IMAGE,
        image_alt: 'Right Triangle Diagram',
        difficulty: 3
      };
    }

    if (lowerTitle.includes('circle') || lowerTitle.includes('circumference')) {
      const r = randInt(4, 12);
      const ansStr = `${r * r}\\pi`;
      const options = shuffle([`\\(${ansStr}\\)`, `\\(${r * 2}\\pi\\)`, `\\(${(r + 2) ** 2}\\pi\\)`, `\\(${r * 3}\\pi\\)`]);
      return {
        title: `${title} - Geometry Problem #${index + 1}`,
        text: `Find the exact area of a circle with radius \\(r = ${r}\\text{ cm}\\):`,
        formula: `A = \\pi r^2`,
        type: 'MCQ',
        options,
        answer: `\\(${ansStr}\\)`,
        hint: `Square the radius and multiply by $\\pi$.`,
        steps: [
          `**Step 1: State circle area formula**`,
          `$$A = \\pi r^2 = \\pi (${r})^2 = ${r * r}\\pi\\text{ cm}^2$$`,
          `**Final Verified Answer:** \\(${ansStr}\\text{ cm}^2\\)`
        ],
        image_url: GEOM_IMAGE,
        image_alt: 'Circle Figure',
        difficulty: 3
      };
    }

    const l = randInt(4, 25);
    const w = randInt(3, 15);
    const ans = l * w;
    const options = shuffle([`${ans} m²`, `${2 * (l + w)} m²`, `${ans + 12} m²`, `${ans - 8} m²`]);
    return {
      title: `${title} - Area Metric #${index + 1}`,
      text: `Calculate the surface area of a rectangular region with length \\(${l}\\text{ m}\\) and width \\(${w}\\text{ m}\\):`,
      formula: `A = l \\times w`,
      type: 'MCQ',
      options,
      answer: `${ans} m²`,
      hint: `Multiply length times width.`,
      steps: [
        `**Step 1: Multiply length by width**`,
        `$$A = ${l} \\times ${w} = ${ans}\\text{ m}^2$$`,
        `**Final Verified Answer:** \\(${ans}\\text{ m}^2\\)`
      ],
      image_url: GEOM_IMAGE,
      image_alt: 'Geometric Figure',
      difficulty: 3
    };
  }

  // 3. Number and Algebra
  if (strand === 'Number and Algebra' || lowerTitle.includes('whole') || lowerTitle.includes('addition') || lowerTitle.includes('subtraction') || lowerTitle.includes('multiplication') || lowerTitle.includes('division') || lowerTitle.includes('equation') || lowerTitle.includes('fraction') || lowerTitle.includes('decimal') || lowerTitle.includes('integer') || lowerTitle.includes('polynomial') || lowerTitle.includes('rational')) {
    if (lowerTitle.includes('equation') || lowerTitle.includes('linear') || lowerTitle.includes('integer') || form_level >= 6) {
      const a = randInt(2, 8);
      const b = randInt(3, 20);
      const xVal = randInt(2, 12);
      const c = a * xVal + b;
      const options = shuffle([xVal, xVal + 2, Math.max(1, xVal - 1), xVal + 4]);
      return {
        title: `${title} - Linear Algebra #${index + 1}`,
        text: `Solve for \\(x\\) in the algebraic equation:`,
        formula: `${a}x + ${b} = ${c}`,
        type: 'MCQ',
        options: options.map(String),
        answer: String(xVal),
        hint: `Subtract ${b} from both sides and divide by ${a}.`,
        steps: [
          `**Step 1: Isolate term**`,
          `$$${a}x = ${c} - ${b} = ${c - b}$$`,
          `**Step 2: Divide by ${a}**`,
          `$$x = \\frac{${c - b}}{${a}} = ${xVal}$$`,
          `**Final Verified Answer:** \\(x = ${xVal}\\)`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    }

    const a = randInt(5, 50);
    const b = randInt(5, 30);
    const sum = a + b;
    const options = shuffle([sum, sum + 3, Math.max(1, sum - 4), sum + 7]);
    return {
      title: `${title} - Exercise #${index + 1}`,
      text: `Calculate the exact value of \\(${a} + ${b}\\):`,
      formula: `${a} + ${b} = ?`,
      type: 'MCQ',
      options: options.map(String),
      answer: String(sum),
      hint: `Add ${a} and ${b}.`,
      steps: [
        `**Step 1: Perform addition**`,
        `$$${a} + ${b} = ${sum}$$`,
        `**Final Verified Answer:** ${sum}`
      ],
      image_url: '',
      image_alt: '',
      difficulty: 2
    };
  }

  // Universal Fallback
  const a = randInt(5, 50);
  const b = randInt(5, 30);
  const sum = a + b;
  const options = shuffle([sum, sum + 3, Math.max(1, sum - 4), sum + 7]);
  return {
    title: `${title} - Question #${index + 1}`,
    text: `Evaluate the arithmetic expression \\(${a} + ${b}\\):`,
    formula: `${a} + ${b} = ?`,
    type: 'MCQ',
    options: options.map(String),
    answer: String(sum),
    hint: `Add ${a} and ${b}.`,
    steps: [
      `**Step 1: Perform addition**`,
      `$$${a} + ${b} = ${sum}$$`,
      `**Final Verified Answer:** ${sum}`
    ],
    image_url: imageUrl,
    image_alt: imageAlt,
    difficulty: 2
  };
}

export function initDb() {
  if (isVercel) {
    return db;
  }

  // 1. Create Users Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      plain_password TEXT DEFAULT '',
      role TEXT NOT NULL CHECK(role IN ('student', 'admin')),
      status TEXT NOT NULL CHECK(status IN ('pending', 'approved', 'rejected')),
      form_level INTEGER DEFAULT 1,
      school TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const userColumns = db.prepare("PRAGMA table_info(users)").all().map(c => c.name);
  if (!userColumns.includes('plain_password')) {
    db.exec("ALTER TABLE users ADD COLUMN plain_password TEXT DEFAULT ''");
    db.exec("UPDATE users SET plain_password = 'student123' WHERE role = 'student' AND (plain_password IS NULL OR plain_password = '')");
    db.exec("UPDATE users SET plain_password = 'admin123' WHERE role = 'admin' AND (plain_password IS NULL OR plain_password = '')");
  }

  // Ensure password_hash and plain_password are in sync for all existing users
  try {
    const existingUsers = db.prepare("SELECT id, email, password_hash, plain_password FROM users").all();
    for (const u of existingUsers) {
      if (u.plain_password && !bcrypt.compareSync(u.plain_password, u.password_hash)) {
        const newHash = bcrypt.hashSync(u.plain_password, 10);
        db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(newHash, u.id);
        const memUser = usersList.find(x => x.id === u.id);
        if (memUser) { memUser.password_hash = newHash; }
      }
    }
  } catch (e) {}

  // 2. Create Topics Table (DepEd MATATAG Philippines Curriculum Structure)
  db.exec(`
    CREATE TABLE IF NOT EXISTS topics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      form_level INTEGER NOT NULL,
      strand TEXT NOT NULL,
      unit TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      competencies TEXT NOT NULL
    );
  `);

  // 3. Create Questions Table (Topic Question Bank with QBank Schema)
  db.exec(`
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
      created_by TEXT DEFAULT 'system',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(topic_id) REFERENCES topics(id) ON DELETE CASCADE
    );
  `);

  // Column migration checks for questions table
  const columns = db.prepare("PRAGMA table_info(questions)").all().map(c => c.name);
  if (!columns.includes('question_type')) {
    db.exec("ALTER TABLE questions ADD COLUMN question_type TEXT DEFAULT 'MCQ'");
  }
  if (!columns.includes('image_url')) {
    db.exec("ALTER TABLE questions ADD COLUMN image_url TEXT DEFAULT ''");
  }
  if (!columns.includes('image_alt')) {
    db.exec("ALTER TABLE questions ADD COLUMN image_alt TEXT DEFAULT ''");
  }
  if (!columns.includes('difficulty')) {
    db.exec("ALTER TABLE questions ADD COLUMN difficulty INTEGER DEFAULT 3");
  }
  if (!columns.includes('updated_at')) {
    db.exec("ALTER TABLE questions ADD COLUMN updated_at DATETIME");
  }
  if (!columns.includes('show_image')) {
    db.exec("ALTER TABLE questions ADD COLUMN show_image INTEGER DEFAULT 1");
  }
  if (!columns.includes('show_formula')) {
    db.exec("ALTER TABLE questions ADD COLUMN show_formula INTEGER DEFAULT 1");
  }

  // 4. Create Exercise Attempts Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS exercise_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      topic_id INTEGER NOT NULL,
      question_title TEXT NOT NULL,
      is_correct INTEGER NOT NULL,
      time_taken_sec INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(topic_id) REFERENCES topics(id)
    );
  `);

  // Seed default admin and sample student accounts if empty
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount === 0) {
    const adminHash = bcrypt.hashSync('admin123', 10);
    const studentHash = bcrypt.hashSync('student123', 10);

    const insertUser = db.prepare(`
      INSERT INTO users (name, email, password_hash, plain_password, role, status, form_level, school)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertUser.run('Admin Manager', 'admin@etuition.ph', adminHash, 'admin123', 'admin', 'approved', 10, 'DepEd Central Office');
    insertUser.run('Juan Dela Cruz', 'student@etuition.ph', studentHash, 'student123', 'student', 'approved', 5, 'Manila High School');
    insertUser.run('Maria Santos', 'newstudent@etuition.ph', studentHash, 'student123', 'student', 'pending', 8, 'Quezon City Science High');

    console.log('✅ Seeded default accounts.');
  }

  // Load DepEd MATATAG Curriculum Topics from QBank
  const matatagJsonPath = path.join(__dirname, '..', 'QBank', 'matatag_topics.json');
  let depEdMatatagCurriculum = [];
  if (fs.existsSync(matatagJsonPath)) {
    depEdMatatagCurriculum = JSON.parse(fs.readFileSync(matatagJsonPath, 'utf8'));
  }

  const topicCount = db.prepare('SELECT COUNT(*) as count FROM topics').get().count;
  
  // If topic count is not equal to MATATAG topic count (176), wipe & re-seed topics & questions
  if (topicCount !== depEdMatatagCurriculum.length && depEdMatatagCurriculum.length > 0) {
    console.log(`🔄 Updating Curriculum and Topics to MATATAG Question Bank (${depEdMatatagCurriculum.length} topics)...`);
    
    db.exec('DELETE FROM exercise_attempts;');
     // Sync topics and questions directly from QBank database if available
  const qbankDbPath = path.join(__dirname, '..', 'QBank', 'server', 'qbank.db');
  if (fs.existsSync(qbankDbPath)) {
    try {
      const qbankDb = new Database(qbankDbPath, { readonly: true });
      const qTopics = qbankDb.prepare('SELECT id, form_level, strand, unit, title, description, competencies FROM topics').all();
      const qQuestions = qbankDb.prepare(`
        SELECT id, topic_id, question_title, question_text, math_formula,
               question_type, options_json, correct_answer, hint,
               working_steps_json, image_url, image_alt, difficulty,
               created_by, created_at, updated_at
        FROM questions
      `).all();

      if (qTopics.length > 0 && qQuestions.length > 0) {
        db.transaction(() => {
          db.exec('DELETE FROM topics;');
          const insertTopic = db.prepare(`
            INSERT INTO topics (id, form_level, strand, unit, title, description, competencies)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `);
          for (const t of qTopics) {
            insertTopic.run(t.id, t.form_level, t.strand, t.unit, t.title, t.description, t.competencies);
          }

          db.exec('DELETE FROM questions;');
          const insertQ = db.prepare(`
            INSERT INTO questions (
              id, topic_id, question_title, question_text, math_formula,
              question_type, options_json, correct_answer, hint,
              working_steps_json, image_url, image_alt, difficulty,
              created_by, created_at, updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `);
          for (const q of qQuestions) {
            insertQ.run(
              q.id, q.topic_id, q.question_title, q.question_text, q.math_formula,
              q.question_type, q.options_json, q.correct_answer, q.hint,
              q.working_steps_json, q.image_url, q.image_alt, q.difficulty,
              q.created_by, q.created_at, q.updated_at
            );
          }
        })();
        console.log(`✅ Automatically synced ${qTopics.length} topics and ${qQuestions.length} questions from QBank database.`);
      }
      qbankDb.close();
    } catch (e) {
      console.error('Error syncing QBank database:', e.message);
    }
  } else {
    // Seed DepEd MATATAG Curriculum Topics if empty
    const topicCount = db.prepare('SELECT COUNT(*) as count FROM topics').get().count;
    if (topicCount === 0) {
      console.log('Seeding DepEd MATATAG Philippines Math Curriculum topics...');
      db.exec('DELETE FROM topics;');

      const insertTopic = db.prepare(`
        INSERT INTO topics (id, form_level, strand, unit, title, description, competencies)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      for (const t of depEdMatatagCurriculum) {
        insertTopic.run(t.id, t.form_level, t.strand, t.unit, t.title, t.description, t.competencies);
      }
      console.log(`Seeded ${depEdMatatagCurriculum.length} DepEd MATATAG Philippines Math topics.`);
    }
    }
  }

  return db;
}

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

export default db;
