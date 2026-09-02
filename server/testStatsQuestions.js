import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const db = new Database(path.join(__dirname, 'etuition.db'));

console.log('📊 Verifying Statistics and Probability Topic Questions in Recreated Question Bank:\n');

const statsTitles = [
  'Interpreting Line Graphs',
  'Pie Charts & Simple Experimental Probability',
  'Mean, Median, and Mode of Ungrouped Data',
  'Fundamental Counting Principle & Probability',
  'Permutations & Combinations',
  'Normal Distribution & Z-Scores',
  'Hypothesis Testing & Correlation Analysis'
];

for (const title of statsTitles) {
  const topic = db.prepare('SELECT * FROM topics WHERE title = ?').get(title);
  if (topic) {
    const qCount = db.prepare('SELECT COUNT(*) as count FROM questions WHERE topic_id = ?').get(topic.id).count;
    const sampleQ = db.prepare('SELECT * FROM questions WHERE topic_id = ? LIMIT 1').get(topic.id);

    console.log(`📌 [Form ${topic.form_level} | ${topic.strand}] ${topic.title}`);
    console.log(`   Questions in Bank for Topic: ${qCount}`);
    console.log(`   Sample Question Title: ${sampleQ.question_title}`);
    console.log(`   Problem Text: ${sampleQ.question_text}`);
    console.log(`   LaTeX Formula: ${sampleQ.math_formula}`);
    console.log(`   Options: ${JSON.parse(sampleQ.options_json).join(' | ')}`);
    console.log(`   Correct Answer: ${sampleQ.correct_answer}`);
    console.log(`   Step-by-Step Workings:`);
    JSON.parse(sampleQ.working_steps_json).forEach((s) => console.log(`     ${s}`));
    console.log('---------------------------------------------------\n');
  }
}
