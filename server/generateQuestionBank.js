import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { initDb } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize DB schema & topics first
initDb();

const dbPath = path.join(__dirname, 'etuition.db');
const db = new Database(dbPath);

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

console.log('🚀 Regenerating Question Bank with QBank topic-matched questions...');

const topics = db.prepare('SELECT * FROM topics ORDER BY form_level ASC, id ASC').all();

db.exec('DELETE FROM questions;');

const insertQuestion = db.prepare(`
  INSERT INTO questions (topic_id, question_title, question_text, math_formula, question_type, options_json, correct_answer, hint, working_steps_json, image_url, image_alt, difficulty, created_by)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'qbank_generator')
`);

let totalQuestions = 0;

for (const topic of topics) {
  for (let i = 0; i < 30; i++) {
    const q = generateQuestionForTopic(topic, i);
    insertQuestion.run(
      topic.id,
      q.title,
      q.text,
      q.formula || '',
      q.type || 'MCQ',
      JSON.stringify(q.options),
      q.answer,
      q.hint || '',
      JSON.stringify(q.steps),
      q.image_url || '',
      q.image_alt || '',
      q.difficulty || 3
    );
    totalQuestions++;
  }
}

console.log(`\n🎉 SUCCESS! Generated and inserted ${totalQuestions} highly varied QBank questions across ${topics.length} MATATAG topics (30 per topic).`);
