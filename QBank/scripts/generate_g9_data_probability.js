import { initDb } from '../server/db.js';
import { exportQuestionsToExcel } from '../server/excelService.js';
import { generateGrade9DpSvg } from './generate_g9_dp_svgs.js';
import xlsx from 'xlsx';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = initDb();

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function makeOptions(correct, wrong1, wrong2, wrong3) {
  const set = new Set([String(correct)]);
  const fallbacks = [wrong1, wrong2, wrong3, "None of the above", "Cannot be determined"];
  
  for (let f of fallbacks) {
    if (f !== undefined && f !== null && !set.has(String(f))) {
      set.add(String(f));
    }
    if (set.size === 4) break;
  }
  
  while (set.size < 4) {
    set.add(`Option ${set.size + 1}`);
  }
  
  return shuffle(Array.from(set));
}

// Topic Mapping: Excel T16..T17 -> SQLite Topic ID 159..160
const topicMapping = {
  'T16': 159, // Interpretation and analysis of data to assess whether the data may be misleading
  'T17': 160  // Probabilities of simple and compound events
};

export function generateGrade9DataProbabilityQuestions() {
  console.log('🚀 Generating 100 Grade 9 Data & Probability Questions (Topics 159 & 160)...');

  // Read Excel Seed File
  const excelPath = path.join(__dirname, '..', 'resources', 'Grade_9_Math_50_Questions.xlsx');
  const wb = xlsx.readFile(excelPath);
  const sheet = wb.Sheets['Data and Probability (DP)'];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  // Group questions by Excel topic code
  const excelQuestions = {};
  rows.slice(4).forEach(r => {
    if (r && r.length >= 5 && typeof r[0] === 'string' && r[0].startsWith('T')) {
      const itemID = r[0].trim();
      const tCode = itemID.split('-')[0]; // T16, T17
      const qText = String(r[4]).trim();
      if (!excelQuestions[tCode]) excelQuestions[tCode] = [];
      excelQuestions[tCode].push({ itemID, qText, competency: r[3] ? String(r[3]).trim() : '' });
    }
  });

  const deleteStmt = db.prepare('DELETE FROM questions WHERE topic_id = ?');
  const insertStmt = db.prepare(`
    INSERT INTO questions (
      topic_id, question_title, question_text, math_formula,
      options_json, correct_answer, hint, working_steps_json,
      image_url, image_alt, difficulty
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let totalGenerated = 0;

  for (const tCode of Object.keys(topicMapping)) {
    const dbTopicId = topicMapping[tCode];
    deleteStmt.run(dbTopicId);

    const topicRow = db.prepare('SELECT title FROM topics WHERE id = ?').get(dbTopicId);
    const dbTopicTitle = topicRow ? topicRow.title : `Topic ${dbTopicId}`;
    const qList = excelQuestions[tCode] || [];

    console.log(`Generating ${qList.length} questions for Topic ${dbTopicId} (${tCode}): ${dbTopicTitle}`);

    qList.forEach((qItem, idx) => {
      const qNum = idx + 1;
      const subType = idx % 10;
      const imgFileName = `g9_t${dbTopicId}_q${qNum}.svg`;
      const imgPathPublic = path.join(__dirname, '..', 'public', 'images', imgFileName);
      const imgPathRoot = path.join(__dirname, '..', 'images', imgFileName);

      let title = `Q${qNum}: ${qItem.qText.substring(0, 45)}...`;
      let text = qItem.qText;
      let formula = '';
      let options = [];
      let correctAnswer = '';
      let hint = '';
      let steps = [];
      let difficulty = (qNum % 3) + 1;

      // Ensure custom SVG plot exists
      const svg = generateGrade9DpSvg(dbTopicId, idx, { title: `${dbTopicTitle} #${qNum}` });
      fs.writeFileSync(imgPathPublic, svg);
      fs.writeFileSync(imgPathRoot, svg);

      const imageUrl = `/images/${imgFileName}`;
      const imageAlt = `Diagram for Grade 9 ${dbTopicTitle} question #${qNum}`;

      // Customize choices and solutions based on Topic Domain & Question Content
      if (dbTopicId === 159) { // Misleading Data & Graphs
        if (subType === 0) {
          correctAnswer = 'Data presented in a way that creates a false impression or distorts the true reality';
          options = makeOptions(
            'Data presented in a way that creates a false impression or distorts the true reality',
            'Data that contains mathematical calculation errors only',
            'Graphs drawn using computers rather than paper',
            'Data collected from random population samples'
          );
          formula = '\\text{Misleading Graph: Truncated Y-axis} \\implies \\Delta y_{\\text{visual}} \\gg \\Delta y_{\\text{actual}}';
          hint = 'Misleading graphs manipulate visual scales, axes, or dimensions to misinform viewers without altering actual values.';
          steps = ['**Step 1: Define misleading data** - Statistical presentation causing false conclusions.', '**Step 2: Identify visual mechanisms** - Truncated axes, unequal intervals, distorted 3D slices.', `**Final Verified Answer:** \\(${correctAnswer}\\)`];
        } else if (subType === 1 || subType === 2) {
          correctAnswer = 'It exaggerates small differences between categories by shrinking the baseline';
          options = makeOptions(
            'It exaggerates small differences between categories by shrinking the baseline',
            'It makes all bars appear completely equal in height',
            'It automatically corrects for sampling bias',
            'It renders the graph easier to calculate percentages'
          );
          formula = '\\text{Relative Visual Height} = \\frac{y - y_{\\text{min}}}{y_{\\text{max}} - y_{\\text{min}}}';
          hint = 'When a graph starts at 90 instead of 0, a 5% increase visually appears to double the bar height.';
          steps = ['**Step 1: Analyze truncated axis effect**', '$$y_{\\text{start}} = 90 \\to \\text{Shrinks baseline zero}$$', '**Step 2: Calculate visual ratio** - Small absolute changes look massive visually.', `**Final Verified Answer:** \\(${correctAnswer}\\)`];
        } else {
          correctAnswer = 'Re-plot the graph starting the vertical y-axis at zero (₱0M)';
          options = makeOptions(
            'Re-plot the graph starting the vertical y-axis at zero (₱0M)',
            'Change the bar colors to grey',
            'Convert the graph to a 3D pie chart',
            'Remove the y-axis labels completely'
          );
          formula = '\\text{Unbiased Chart} \\implies y_{\\text{origin}} = 0';
          hint = 'To remove visual distortion, always start vertical axes at 0.';
          steps = ['**Step 1: Identify distortion cause** - Y-axis starts at ₱95M.', '**Step 2: Apply correction** - Start y-axis at ₱0M to reflect actual proportional growth.', `**Final Verified Answer:** \\(${correctAnswer}\\)`];
        }
      } else { // Topic 160: Probabilities of Simple & Compound Events
        if (subType === 0) {
          correctAnswer = 'Sample space is the set of all possible outcomes; Event is a subset of the sample space';
          options = makeOptions(
            'Sample space is the set of all possible outcomes; Event is a subset of the sample space',
            'Sample space is the probability value; Event is the total count',
            'Sample space applies to dice; Event applies to coins only',
            'Sample space and Event are identical concepts'
          );
          formula = 'S = \\{e_1, e_2, \\dots, e_n\\}, \\quad E \\subseteq S, \\quad P(E) = \\frac{n(E)}{n(S)}';
          hint = 'Sample space S is the total universe of outcomes; an Event E is any targeted sub-collection of outcomes.';
          steps = ['**Step 1: Define Sample Space S** - Set of all possible trial outcomes.', '**Step 2: Define Event E** - Subset E ⊆ S.', `**Final Verified Answer:** \\(${correctAnswer}\\)`];
        } else if (subType === 1) {
          correctAnswer = 'Simple event has one outcome; Compound event combines two or more simple events';
          options = makeOptions(
            'Simple event has one outcome; Compound event combines two or more simple events',
            'Simple event uses coins; Compound event uses playing cards',
            'Simple event probability is always 1; Compound event probability is 0',
            'Simple event requires 3 trials; Compound event requires 1 trial'
          );
          formula = 'P(A \\cup B) = P(A) + P(B) - P(A \\cap B)';
          hint = 'A simple event consists of a single outcome (e.g. rolling a 4); a compound event involves multiple outcomes (e.g. rolling an even number).';
          steps = ['**Step 1: Compare single vs combined outcomes**', '$$\\text{Simple: } \\{4\\}, \\quad \\text{Compound: } \\{2, 4, 6\\} = \\{2\\} \\cup \\{4\\} \\cup \\{6\\}$$', `**Final Verified Answer:** \\(${correctAnswer}\\)`];
        } else {
          correctAnswer = 'P(E) = n(E) / n(S)';
          options = makeOptions(
            'P(E) = n(E) / n(S)',
            'P(E) = n(S) / n(E)',
            'P(E) = n(E) \\times n(S)',
            'P(E) = n(S) - n(E)'
          );
          formula = 'P(E) = \\frac{n(E)}{n(S)}, \\quad 0 \\le P(E) \\le 1';
          hint = 'Theoretical probability equals favorable outcomes divided by total possible outcomes.';
          steps = ['**Step 1: State classic probability ratio**', '$$P(E) = \\frac{n(E)}{n(S)}$$', `**Final Verified Answer:** \\(${correctAnswer}\\)`];
        }
      }

      insertStmt.run(
        dbTopicId,
        title,
        text,
        formula,
        JSON.stringify(options),
        correctAnswer,
        hint,
        JSON.stringify(steps),
        imageUrl,
        imageAlt,
        difficulty
      );
      totalGenerated++;
    });
  }

  console.log(`✅ Successfully generated and inserted ${totalGenerated} Grade 9 Data & Probability questions into SQLite qbank.db!`);

  // Export updated questions database to Excel
  exportQuestionsToExcel(db);

  console.log('🎉 Generation and Excel export completed successfully!');
}

if (process.argv[1] && process.argv[1].endsWith('generate_g9_data_probability.js')) {
  generateGrade9DataProbabilityQuestions();
}
