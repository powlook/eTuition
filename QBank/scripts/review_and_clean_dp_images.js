import { initDb } from '../server/db.js';
import { exportQuestionsToExcel } from '../server/excelService.js';
import { generateForm10DpSvg } from './generate_form10_dp_svgs.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = initDb();

export function reviewAndCleanDpImages() {
  console.log('🧹 Starting Data & Probability Image Relevancy Audit & Clean-up...');

  const dpTopics = db.prepare(`
    SELECT id, form_level, strand, title 
    FROM topics 
    WHERE strand LIKE '%Data%' OR strand LIKE '%Probability%' 
    ORDER BY form_level, id
  `).all();

  const updateStmt = db.prepare('UPDATE questions SET image_url = ?, image_alt = ? WHERE id = ?');

  let totalCleanedRemoved = 0;
  let totalReplacedWithRelevantSvg = 0;

  dpTopics.forEach(t => {
    const questions = db.prepare('SELECT * FROM questions WHERE topic_id = ?').all(t.id);
    console.log(`Auditing Form ${t.form_level} | Topic ${t.id} ("${t.title.substring(0, 40)}...") => ${questions.length} questions`);

    questions.forEach((q, idx) => {
      const qTextLower = (q.question_text || '').toLowerCase();
      const qTitleLower = (q.question_title || '').toLowerCase();

      // Keywords indicating an explicit graph / visual diagram is required
      const needsDiagram = (
        qTextLower.includes('referring to the graph') ||
        qTextLower.includes('from the box plot') ||
        qTextLower.includes('from the histogram') ||
        qTextLower.includes('ogive curve') ||
        qTextLower.includes('venn diagram') ||
        qTextLower.includes('tree diagram') ||
        qTextLower.includes('pie chart') ||
        qTextLower.includes('bar graph') ||
        qTextLower.includes('line graph') ||
        qTextLower.includes('truncated') ||
        qTextLower.includes('misleading') ||
        qTextLower.includes('spinner') ||
        qTextLower.includes('visual') ||
        qTitleLower.includes('diagram') ||
        qTitleLower.includes('plot') ||
        qTitleLower.includes('ogive') ||
        qTitleLower.includes('tree') ||
        qTitleLower.includes('venn') ||
        qTitleLower.includes('box-and-whisker')
      );

      const hasIrrelevantGenericPng = q.image_url && (
        q.image_url.includes('line_graph_trend.png') ||
        q.image_url.includes('pie_chart_math.png') ||
        q.image_url.includes('grouped_frequency_table.svg') ||
        q.image_url.includes('pie_chart_data_distribution.svg') ||
        q.image_url.includes('line_graph_time_series.svg') ||
        q.image_url.includes('stem_and_leaf_plot.svg') ||
        q.image_url.includes('coin_toss_tree_diagram.svg')
      );

      if (hasIrrelevantGenericPng && !needsDiagram) {
        // Remove irrelevant shared generic image
        updateStmt.run('', '', q.id);
        totalCleanedRemoved++;
      } else if (hasIrrelevantGenericPng && needsDiagram) {
        // Replace generic image with a newly generated topic-matched SVG
        let svgName = '';
        if (t.form_level === 10) {
          svgName = `f10_t${t.id}_q${idx + 1}.svg`;
          const svg = generateForm10DpSvg(t.id, idx, { title: `${t.title} #${idx + 1}` });
          fs.writeFileSync(path.join(__dirname, '..', 'public', 'images', svgName), svg);
          fs.writeFileSync(path.join(__dirname, '..', 'images', svgName), svg);
        } else {
          svgName = `dp_t${t.id}_q${idx + 1}.svg`;
        }
        
        const newUrl = `/images/${svgName}`;
        const newAlt = `Visual Diagram for Form ${t.form_level} ${t.title} #${idx + 1}`;
        updateStmt.run(newUrl, newAlt, q.id);
        totalReplacedWithRelevantSvg++;
      }
    });
  });

  console.log(`\n✅ Clean-up Results:`);
  console.log(`  - Removed irrelevant shared images from ${totalCleanedRemoved} numerical/formula questions.`);
  console.log(`  - Replaced generic images with ${totalReplacedWithRelevantSvg} question-matched SVG plots.`);

  // Export updated questions database to Excel
  exportQuestionsToExcel(db);
  console.log('🎉 Excel Question Bank updated and synchronized successfully!');
}

if (process.argv[1] && process.argv[1].endsWith('review_and_clean_dp_images.js')) {
  reviewAndCleanDpImages();
}
