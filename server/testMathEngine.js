import { initDb } from './db.js';
import { getExerciseForTopic } from './mathEngine.js';

// Initialize DB schema
initDb();

console.log('🧪 Testing Topic-Specific Question Bank & Math Engine Integration with QBank...\n');

const testCases = [
  { topicId: 1, form_level: 1, strand: 'Numbers and Number Sense' },
  { topicId: 3, form_level: 1, strand: 'Measurement' },
  { topicId: 18, form_level: 5, strand: 'Numbers and Number Sense' },
  { topicId: 27, form_level: 7, strand: 'Numbers and Number Sense' },
  { topicId: 31, form_level: 8, strand: 'Patterns and Algebra' },
  { topicId: 37, form_level: 9, strand: 'Geometry' },
  { topicId: 41, form_level: 11, strand: 'Patterns and Algebra' },
  { topicId: 43, form_level: 12, strand: 'Patterns and Algebra' }
];

async function runTests() {
  let passed = 0;

  for (const tc of testCases) {
    try {
      const exercise = await getExerciseForTopic(tc.topicId, tc.form_level, tc.strand);
      console.log(`[Form ${tc.form_level} | ${tc.strand}] ${exercise.title}`);
      console.log(`  Question: ${exercise.questionText}`);
      console.log(`  Options: ${exercise.options.join(', ')}`);
      console.log(`  Correct Answer: ${exercise.correctAnswer}`);
      console.log(`  Step-by-Step Workings (${exercise.workingSteps.length} steps):`);
      exercise.workingSteps.forEach((s) => console.log(`    - ${s.replace(/\n/g, ' ')}`));
      console.log('---------------------------------------------------\n');
      passed++;
    } catch (err) {
      console.error(`❌ Failed test case Form ${tc.form_level}:`, err);
    }
  }

  console.log(`✅ Question Bank & Engine Verification: ${passed}/${testCases.length} Passed Cleanly.`);
}

runTests();

