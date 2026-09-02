import { initDb } from '../server/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = initDb();

export function verifyDpImages() {
  console.log('--- VERIFICATION REPORT: DATA & PROBABILITY IMAGE RELEVANCY ---');

  const dpTopics = db.prepare(`
    SELECT id, form_level, strand, title 
    FROM topics 
    WHERE strand LIKE '%Data%' OR strand LIKE '%Probability%' 
    ORDER BY form_level, id
  `).all();

  let totalDpQuestions = 0;
  let totalWithImages = 0;
  let invalidImagePaths = 0;
  let genericSharedPNGsFound = 0;

  dpTopics.forEach(t => {
    const questions = db.prepare('SELECT id, question_title, question_text, image_url FROM questions WHERE topic_id = ?').all(t.id);
    totalDpQuestions += questions.length;

    questions.forEach(q => {
      if (q.image_url && q.image_url.trim() !== '') {
        totalWithImages++;

        // Check if image is an old irrelevant generic shared PNG
        if (q.image_url.includes('line_graph_trend.png') || q.image_url.includes('pie_chart_math.png')) {
          console.error(`❌ ERROR in Q ID ${q.id} (Topic ${t.id}): Contains generic irrelevant PNG ${q.image_url}`);
          genericSharedPNGsFound++;
        }

        // Verify disk file existence
        const diskPath = path.join(__dirname, '..', 'public', q.image_url);
        if (!fs.existsSync(diskPath)) {
          console.error(`❌ ERROR in Q ID ${q.id} (Topic ${t.id}): Image file missing on disk: ${diskPath}`);
          invalidImagePaths++;
        }
      }
    });
  });

  console.log('----------------------------------------------------');
  console.log(`Total Data & Probability Questions Audited: ${totalDpQuestions}`);
  console.log(`Questions with Relevant Images/Diagrams: ${totalWithImages}`);
  console.log(`Generic Shared PNGs Remaining: ${genericSharedPNGsFound}`);
  console.log(`Missing Image Disk Paths: ${invalidImagePaths}`);

  if (genericSharedPNGsFound === 0 && invalidImagePaths === 0) {
    console.log('🎉 DATA & PROBABILITY IMAGE AUDIT VERIFIED 100% CLEAN!');
  } else {
    console.error('❌ VALIDATION ERRORS DETECTED!');
    process.exit(1);
  }
}

if (process.argv[1] && process.argv[1].endsWith('verify_dp_images.js')) {
  verifyDpImages();
}
