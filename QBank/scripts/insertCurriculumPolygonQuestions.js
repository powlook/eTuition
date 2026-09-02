import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { exportQuestionsToExcel } from '../server/excelService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '..', 'server', 'qbank.db');
const db = new Database(dbPath);

console.log('Inserting 5 MATATAG Curriculum suggested questions for Form 7 Regular & Irregular Polygons (Topic 104)...');

const curriculumQuestions = [
  {
    topic_id: 104,
    title: 'Regular vs Irregular Polygon Definition & Criteria',
    text: 'How can you tell whether a polygon is regular versus irregular, and how do you test this using side lengths and interior angle measurements?',
    formula: '\\text{Regular Polygon} \\iff \\text{Equilateral (all sides equal)} \\land \\text{Equiangular (all angles equal)}',
    type: 'MCQ',
    options: [
      'A polygon is regular if and only if all its side lengths are equal AND all its interior angles are equal.',
      'A polygon is regular if all its interior angles are equal, regardless of side lengths.',
      'A polygon is regular if all its side lengths are equal, regardless of interior angle measures.',
      'A polygon is regular if it has an even number of sides and at least one right angle.'
    ],
    answer: 'A polygon is regular if and only if all its side lengths are equal AND all its interior angles are equal.',
    hint: 'A polygon must be BOTH equilateral and equiangular to be regular. If either condition fails, it is irregular.',
    steps: [
      '**Step 1: Understand the definition of a regular polygon**',
      'A polygon is regular if it is both **equilateral** (all side lengths are equal) and **equiangular** (all interior angle measures are equal).',
      '**Step 2: Testing criteria**',
      'If a polygon has equal sides but unequal angles (like a rhombus), or equal angles but unequal sides (like a rectangle), it is **irregular**.',
      '**Final Verified Answer:** A polygon is regular if and only if all its side lengths are equal AND all its interior angles are equal.'
    ],
    image_url: '/images/polygon_5_gon.svg',
    image_alt: 'Regular 5-sided polygon (Pentagon)',
    difficulty: 2
  },
  {
    topic_id: 104,
    title: 'Convex vs Concave (Non-Convex) Polygons',
    text: 'How do you distinguish between a convex polygon versus a non-convex (concave) polygon?',
    formula: '\\text{Concave} \\iff \\exists \\text{ interior angle} > 180^\\circ \\quad (\\text{reflex angle})',
    type: 'MCQ',
    options: [
      'A polygon is concave (non-convex) if at least one interior angle is greater than 180° (reflex angle), or if a diagonal passes outside the polygon.',
      'A polygon is concave if all its interior angles are less than 90°.',
      'A polygon is convex if at least one diagonal lies entirely outside the boundary of the polygon.',
      'A polygon is convex if it has an odd number of sides and at least one reflex interior angle.'
    ],
    answer: 'A polygon is concave (non-convex) if at least one interior angle is greater than 180° (reflex angle), or if a diagonal passes outside the polygon.',
    hint: 'Look for reflex interior angles (> 180°) or "caved in" vertices.',
    steps: [
      '**Step 1: Define Convex Polygon**',
      'A polygon is **convex** if all interior angles are strictly less than 180°, and every line segment connecting any two points inside the polygon lies entirely inside it.',
      '**Step 2: Define Concave (Non-Convex) Polygon**',
      'A polygon is **concave** if it has at least one interior angle greater than 180° (a reflex angle) or if a line segment between two interior vertices goes outside.',
      '**Final Verified Answer:** A polygon is concave (non-convex) if at least one interior angle is greater than 180° (reflex angle), or if a diagonal passes outside the polygon.'
    ],
    image_url: '/images/polygon_irregular_5_gon.svg',
    image_alt: 'Irregular 5-sided polygon (Concave/Irregular)',
    difficulty: 2
  },
  {
    topic_id: 104,
    title: 'Interior & Exterior Angle Calculation of Regular Octagon',
    text: 'If you are presented with a regular n-gon (e.g. a regular octagon with \\(n = 8\\) sides), what is the measure of each interior angle and each exterior angle?',
    formula: 'E = \\frac{360^\\circ}{n}, \\quad I = \\frac{(n-2) \\times 180^\\circ}{n}',
    type: 'MCQ',
    options: [
      'Interior angle = 135°, Exterior angle = 45°',
      'Interior angle = 140°, Exterior angle = 40°',
      'Interior angle = 120°, Exterior angle = 60°',
      'Interior angle = 108°, Exterior angle = 72°'
    ],
    answer: 'Interior angle = 135°, Exterior angle = 45°',
    hint: 'Calculate exterior angle E = 360° / 8 = 45°, then interior angle I = 180° - 45° = 135°.',
    steps: [
      '**Step 1: Calculate exterior angle E for n = 8**',
      '$$E = \\frac{360^\\circ}{n} = \\frac{360^\\circ}{8} = 45^\\circ$$',
      '**Step 2: Calculate interior angle I for n = 8**',
      '$$I = 180^\\circ - E = 180^\\circ - 45^\\circ = 135^\\circ$$',
      '$$\\text{Alternatively: } I = \\frac{(8-2) \\times 180^\\circ}{8} = \\frac{6 \\times 180^\\circ}{8} = 135^\\circ$$',
      '**Final Verified Answer:** Interior angle = 135°, Exterior angle = 45°'
    ],
    image_url: '/images/polygon_8_gon.svg',
    image_alt: 'Regular 8-sided polygon (Octagon)',
    difficulty: 3
  },
  {
    topic_id: 104,
    title: 'Interior & Exterior Angle Sum Relationship',
    text: 'What is the relationship between the interior angles sum \\(S_{\\text{int}} = (n-2) \\times 180^\\circ\\) and exterior angles sum \\(S_{\\text{ext}} = 360^\\circ\\) for any convex n-gon?',
    formula: 'S_{\\text{int}} = (n - 2) \\times 180^\\circ, \\quad S_{\\text{ext}} = 360^\\circ, \\quad S_{\\text{int}} + S_{\\text{ext}} = n \\times 180^\\circ',
    type: 'MCQ',
    options: [
      'S_int + S_ext = n * 180°, where S_int = (n - 2) * 180° and S_ext = 360° for all convex polygons.',
      'S_int = S_ext = (n - 2) * 180° for all polygons.',
      'S_int + S_ext = 360° for any polygon regardless of the number of sides.',
      'S_ext increases by 180° for each additional side added to the polygon.'
    ],
    answer: 'S_int + S_ext = n * 180°, where S_int = (n - 2) * 180° and S_ext = 360° for all convex polygons.',
    hint: 'At each vertex, interior angle + exterior angle = 180° (linear pair). Sum for n vertices is n * 180°.',
    steps: [
      '**Step 1: Consider linear pairs at each vertex**',
      'At each of the n vertices, an interior angle and its adjacent exterior angle form a straight line (180°).',
      '$$\\text{Total sum at } n \\text{ vertices} = n \\times 180^\\circ$$',
      '**Step 2: Separate interior and exterior sums**',
      '$$S_{\\text{int}} = (n - 2) \\times 180^\\circ$$',
      '$$S_{\\text{ext}} = 360^\\circ \\quad (\\text{constant for all convex polygons})$$',
      '$$S_{\\text{int}} + S_{\\text{ext}} = (n - 2) \\times 180^\\circ + 360^\\circ = n \\times 180^\\circ$$',
      '**Final Verified Answer:** S_int + S_ext = n * 180°, where S_int = (n - 2) * 180° and S_ext = 360° for all convex polygons.'
    ],
    image_url: '/images/polygon_6_gon.svg',
    image_alt: 'Regular 6-sided polygon (Hexagon)',
    difficulty: 3
  },
  {
    topic_id: 104,
    title: 'Exterior and Adjacent Interior Angle Supplementary Property',
    text: 'What is the relationship between the exterior angle and adjacent interior angle of a polygon? If an interior angle of a regular decagon (\\(n = 10\\)) is \\(144^\\circ\\), calculate its adjacent exterior angle.',
    formula: '\\text{Interior Angle} + \\text{Exterior Angle} = 180^\\circ \\quad (\\text{Supplementary Linear Pair})',
    type: 'MCQ',
    options: [
      'They are supplementary (sum = 180°); Exterior angle = 36°',
      'They are complementary (sum = 90°); Exterior angle = 45°',
      'They are equal (Interior angle = Exterior angle); Exterior angle = 144°',
      'They sum to 360°; Exterior angle = 216°'
    ],
    answer: 'They are supplementary (sum = 180°); Exterior angle = 36°',
    hint: 'An interior angle and its adjacent exterior angle form a linear pair on a straight line.',
    steps: [
      '**Step 1: Recall supplementary linear pair rule**',
      '$$\\text{Interior Angle} + \\text{Exterior Angle} = 180^\\circ$$',
      '**Step 2: Calculate exterior angle for regular decagon**',
      '$$\\text{Exterior Angle} = 180^\\circ - 144^\\circ = 36^\\circ$$',
      '$$\\text{Verification: } \\frac{360^\\circ}{10} = 36^\\circ$$',
      '**Final Verified Answer:** They are supplementary (sum = 180°); Exterior angle = 36°'
    ],
    image_url: '/images/polygon_10_gon.svg',
    image_alt: 'Regular 10-sided polygon (Decagon)',
    difficulty: 2
  }
];

const insertStmt = db.prepare(`
  INSERT INTO questions (
    topic_id, question_title, question_text, math_formula, question_type,
    options_json, correct_answer, hint, working_steps_json, image_url, image_alt, difficulty, created_by
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'matatag_curriculum_suggested')
`);

let insertedCount = 0;

db.transaction(() => {
  for (const q of curriculumQuestions) {
    insertStmt.run(
      q.topic_id,
      q.title,
      q.text,
      q.formula,
      q.type,
      JSON.stringify(q.options),
      q.answer,
      q.hint,
      JSON.stringify(q.steps),
      q.image_url,
      q.image_alt,
      q.difficulty
    );
    insertedCount++;
  }
})();

console.log(`Successfully inserted ${insertedCount} MATATAG curriculum suggested polygon questions into QBank SQLite database.`);

// Export updated questions to questions_bank.xlsx
const excelPath = path.join(__dirname, '..', 'questions_bank.xlsx');
exportQuestionsToExcel(db, excelPath);
console.log(`Updated Excel spreadsheet export saved at ${excelPath}`);
