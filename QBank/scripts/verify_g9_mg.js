import { initDb } from '../server/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = initDb();

export function verifyGrade9MeasurementGeometry() {
  console.log('--- VERIFICATION REPORT: GRADE 9 MEASUREMENT & GEOMETRY ---');

  const topicIds = [144, 145, 146, 147, 148, 149, 150, 151, 152, 153];
  let totalVerified = 0;
  let totalErrors = 0;
  let missingImages = 0;

  for (const topicId of topicIds) {
    const topicRow = db.prepare('SELECT title FROM topics WHERE id = ?').get(topicId);
    const title = topicRow ? topicRow.title : `Topic ${topicId}`;

    const questions = db.prepare('SELECT * FROM questions WHERE topic_id = ?').all(topicId);
    console.log(`Topic ${topicId}: "${title}" => ${questions.length} questions`);

    if (questions.length !== 50) {
      console.error(`❌ ERROR: Expected 50 questions for Topic ${topicId}, found ${questions.length}`);
      totalErrors++;
    }

    questions.forEach((q, idx) => {
      // Validate options JSON
      let options = [];
      try {
        options = JSON.parse(q.options_json);
      } catch (err) {
        console.error(`❌ ERROR in Q ID ${q.id} (Topic ${topicId} #${idx + 1}): Invalid JSON options`);
        totalErrors++;
      }

      if (!Array.isArray(options) || options.length !== 4) {
        console.error(`❌ ERROR in Q ID ${q.id} (Topic ${topicId} #${idx + 1}): Must have exactly 4 options`);
        totalErrors++;
      }

      // Validate correct answer in options
      if (!options.includes(q.correct_answer)) {
        console.error(`❌ ERROR in Q ID ${q.id} (Topic ${topicId} #${idx + 1}): Correct answer "${q.correct_answer}" not found in options [${options.join(', ')}]`);
        totalErrors++;
      }

      // Validate working steps JSON
      let steps = [];
      try {
        steps = JSON.parse(q.working_steps_json);
      } catch (err) {
        console.error(`❌ ERROR in Q ID ${q.id} (Topic ${topicId} #${idx + 1}): Invalid JSON working steps`);
        totalErrors++;
      }

      if (!Array.isArray(steps) || steps.length === 0) {
        console.error(`❌ ERROR in Q ID ${q.id} (Topic ${topicId} #${idx + 1}): Working steps missing`);
        totalErrors++;
      }

      // Validate SVG Image file existence on disk
      if (!q.image_url) {
        console.error(`❌ ERROR in Q ID ${q.id} (Topic ${topicId} #${idx + 1}): Image URL is missing`);
        totalErrors++;
      } else {
        const diskPath = path.join(__dirname, '..', 'public', q.image_url);
        if (!fs.existsSync(diskPath)) {
          console.error(`❌ ERROR in Q ID ${q.id} (Topic ${topicId} #${idx + 1}): SVG plot file not found at ${diskPath}`);
          missingImages++;
          totalErrors++;
        }
      }

      totalVerified++;
    });
  }

  console.log('----------------------------------------------------');
  console.log(`Total Grade 9 Measurement & Geometry Questions verified: ${totalVerified}`);
  console.log(`Missing SVG Plot Files: ${missingImages}`);
  console.log(`Total Validation Errors: ${totalErrors}`);

  if (totalErrors === 0) {
    console.log('🎉 ALL 500 QUESTIONS & SVG PLOTS VERIFIED 100% CLEAN!');
  } else {
    console.error(`❌ FOUND ${totalErrors} VALIDATION ERRORS!`);
    process.exit(1);
  }
}

if (process.argv[1] && process.argv[1].endsWith('verify_g9_mg.js')) {
  verifyGrade9MeasurementGeometry();
}
