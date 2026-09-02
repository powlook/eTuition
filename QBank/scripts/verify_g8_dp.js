import { initDb } from '../server/db.js';

const db = initDb();

export function verifyGrade8DataProbability() {
  console.log('--- VERIFICATION REPORT: GRADE 8 DATA & PROBABILITY ---');

  const topicIds = [139, 140, 141, 142, 143];
  let totalVerified = 0;
  let totalErrors = 0;

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

      totalVerified++;
    });
  }

  console.log('----------------------------------------------------');
  console.log(`Total Grade 8 Data & Probability Questions verified: ${totalVerified}`);
  console.log(`Total Validation Errors: ${totalErrors}`);

  if (totalErrors === 0) {
    console.log('🎉 ALL 250 QUESTIONS VERIFIED 100% CLEAN!');
  } else {
    console.error(`❌ FOUND ${totalErrors} VALIDATION ERRORS!`);
    process.exit(1);
  }
}

if (process.argv[1] && process.argv[1].endsWith('verify_g8_dp.js')) {
  verifyGrade8DataProbability();
}
