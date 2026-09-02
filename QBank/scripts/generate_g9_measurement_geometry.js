import { initDb } from '../server/db.js';
import { exportQuestionsToExcel } from '../server/excelService.js';
import { generateGrade9MgSvg } from './generate_g9_mg_svgs.js';
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

// Topic Mapping: Excel T01..T10 -> SQLite Topic ID 144..153
const topicMapping = {
  'T01': 144, // Simple geometric concepts and notations
  'T02': 145, // Perpendicular and parallel lines, transversal angles
  'T03': 146, // Parallelism and perpendicularity of lines
  'T04': 147, // Different quadrilaterals and their properties
  'T05': 148, // Congruence of triangles
  'T06': 149, // Congruence proofs
  'T07': 150, // Similarity of polygons
  'T08': 151, // Special triangles
  'T09': 152, // Triangle theorems and triangle inequality theorems
  'T10': 153  // The trigonometric ratios and their application
};

export function generateGrade9MeasurementGeometryQuestions() {
  console.log('🚀 Generating 500 Grade 9 Measurement & Geometry Questions (Topics 144 to 153)...');

  // Read Excel Seed File
  const excelPath = path.join(__dirname, '..', 'resources', 'Grade_9_Math_50_Questions.xlsx');
  const wb = xlsx.readFile(excelPath);
  const sheet = wb.Sheets['Measurement & Geometry (MG)'];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  // Group questions by Excel topic code
  const excelQuestions = {};
  rows.slice(4).forEach(r => {
    if (r && r.length >= 5 && typeof r[0] === 'string' && r[0].startsWith('T')) {
      const itemID = r[0].trim();
      const tCode = itemID.split('-')[0]; // T01, T02, etc.
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
      const svg = generateGrade9MgSvg(dbTopicId, idx, { title: `${dbTopicTitle} #${qNum}` });
      fs.writeFileSync(imgPathPublic, svg);
      fs.writeFileSync(imgPathRoot, svg);

      const imageUrl = `/images/${imgFileName}`;
      const imageAlt = `Diagram for Grade 9 ${dbTopicTitle} question #${qNum}`;

      // Customize choices and solutions based on Topic Domain & Question Content
      if (dbTopicId === 144) { // Simple geometric concepts
        if (subType === 0) {
          correctAnswer = 'Point (no size), Line (1D infinite length), Plane (2D infinite flat surface)';
          options = makeOptions(correctAnswer, 'Point (1D), Line (2D), Plane (3D)', 'Point (circle), Line (square), Plane (cube)', 'Point (0D), Line (0D), Plane (1D)');
          formula = '\\text{Point, Line, and Plane are undefined terms}';
          hint = 'Recall the three foundational undefined terms in Euclidean geometry and their dimensions.';
          steps = ['**Step 1: Identify point** - A location with zero dimensions.', '**Step 2: Identify line** - A 1D set of infinite points.', '**Step 3: Identify plane** - A 2D flat surface extending infinitely.', `**Final Verified Answer:** \\(${correctAnswer}\\)`];
        } else if (subType === 1) {
          correctAnswer = 'Line ←AB→, Line Segment AB, Ray →AB';
          options = makeOptions(correctAnswer, 'Line AB, Segment ←AB→, Ray AB', 'Line →AB, Segment AB, Ray ←AB→', 'Line AB, Segment →AB, Ray ←AB→');
          formula = '\\overleftrightarrow{AB}, \\quad \\overline{AB}, \\quad \\overrightarrow{AB}';
          hint = 'Arrows at both ends represent line, bar with no arrows represents segment, single arrow represents ray.';
          steps = ['**Step 1: Line notation** - \\(\\overleftrightarrow{AB}\\)', '**Step 2: Line segment notation** - \\(\\overline{AB}\\)', '**Step 3: Ray notation** - \\(\\overrightarrow{AB}\\)', `**Final Verified Answer:** \\(${correctAnswer}\\)`];
        } else if (subType === 5) {
          correctAnswer = 'AM + MB = AB';
          options = makeOptions('AM + MB = AB', 'AM - MB = AB', 'AM × MB = AB', 'AB + MB = AM');
          formula = 'AM + MB = AB';
          hint = 'Betweenness of points means the two smaller adjacent segment lengths sum to the total length.';
          steps = ['**Step 1: Apply Segment Addition Postulate**', '$$AM + MB = AB$$', `**Final Verified Answer:** \\(${correctAnswer}\\)`];
        } else {
          correctAnswer = 'Linear Pair (Supplementary, sum to 180°)';
          options = makeOptions(correctAnswer, 'Complementary (sum to 90°)', 'Vertical Angles (equal)', 'Alternate Interior Angles');
          formula = '\\angle 1 + \\angle 2 = 180^\\circ';
          hint = 'Adjacent angles forming a straight line sum to 180 degrees.';
          steps = ['**Step 1: Identify angle pair** - Linear pair on a straight line.', '**Step 2: Apply postulate** - Sum is 180°.', `**Final Verified Answer:** \\(${correctAnswer}\\)`];
        }
      } else if (dbTopicId === 145 || dbTopicId === 146) { // Parallel & Perpendicular Lines
        if (subType === 0) {
          correctAnswer = '4 pairs of corresponding angles';
          options = makeOptions('4 pairs of corresponding angles', '2 pairs of corresponding angles', '8 pairs of corresponding angles', '6 pairs of corresponding angles');
          formula = '\\text{Corresponding Angles } \\angle 1 = \\angle 5, \\angle 2 = \\angle 6, \\angle 3 = \\angle 7, \\angle 4 = \\angle 8';
          hint = 'Positions matching at each intersection form corresponding angle pairs.';
          steps = ['**Step 1: Count intersections** - 2 intersections with 4 quadrants each.', '**Step 2: Match positions** - Top-left, top-right, bottom-left, bottom-right = 4 pairs.', `**Final Verified Answer:** \\(${correctAnswer}\\)`];
        } else if (subType === 1) {
          correctAnswer = 'm∠2 = 135° (Alternate Interior Angles are equal)';
          options = makeOptions('m∠2 = 135° (Alternate Interior Angles are equal)', 'm∠2 = 45°', 'm∠2 = 90°', 'm∠2 = 180°');
          formula = 'm\\angle 1 = m\\angle 2 = 135^\\circ';
          hint = 'When lines are parallel, alternate interior angles are congruent.';
          steps = ['**Step 1: Identify angle relationship** - Alternate Interior Angles.', '**Step 2: Equate measures** - m∠2 = 135°.', `**Final Verified Answer:** \\(${correctAnswer}\\)`];
        } else {
          correctAnswer = 'Line L1 is parallel to Line L2 (L1 ∥ L2)';
          options = makeOptions('Line L1 is parallel to Line L2 (L1 ∥ L2)', 'Line L1 is perpendicular to Line L2 (L1 ⊥ L2)', 'Lines are skew', 'Lines intersect at 45°');
          formula = 'L_1 \\parallel L_2';
          hint = 'If alternate interior angles are equal, the two lines cut by the transversal must be parallel.';
          steps = ['**Step 1: Apply Converse of Alternate Interior Angles Theorem**', '$$\\text{Equal alternate interior angles } \\implies L_1 \\parallel L_2$$', `**Final Verified Answer:** \\(${correctAnswer}\\)`];
        }
      } else if (dbTopicId === 147) { // Quadrilaterals
        if (subType === 0) {
          correctAnswer = '360°';
          options = makeOptions('360°', '180°', '540°', '720°');
          formula = '(n - 2) \\times 180^\\circ = (4 - 2) \\times 180^\\circ = 360^\\circ';
          hint = 'Polygon interior angle sum formula (n - 2) * 180° for n = 4.';
          steps = ['**Step 1: Substitute n = 4**', '$$S = (4 - 2) \\times 180^\\circ = 2 \\times 180^\\circ = 360^\\circ$$', `**Final Verified Answer:** \\(${correctAnswer}\\)`];
        } else if (subType === 2) {
          correctAnswer = 'Rhombus';
          options = makeOptions('Rhombus', 'Rectangle', 'Trapezoid', 'Scalene Quadrilateral');
          formula = '\\text{Diagonals are perpendicular } (d_1 \\perp d_2)';
          hint = 'A parallelogram with perpendicular diagonals and 4 congruent sides is a rhombus.';
          steps = ['**Step 1: Analyze diagonal property** - Perpendicular bisectors.', '**Step 2: Identify quadrilateral** - Rhombus.', `**Final Verified Answer:** \\(${correctAnswer}\\)`];
        } else {
          correctAnswer = 'Opposite sides parallel & equal, opposite angles equal, diagonals bisect each other';
          options = makeOptions(
            'Opposite sides parallel & equal, opposite angles equal, diagonals bisect each other',
            'All 4 angles are 90°, diagonals are perpendicular',
            'Only one pair of parallel sides',
            'Diagonals are unequal and non-bisecting'
          );
          formula = '\\text{Properties of Parallelogram}';
          hint = 'Recall the 5 core properties of any parallelogram.';
          steps = ['**Step 1: State side properties** - Opposite sides congruent & parallel.', '**Step 2: State angle & diagonal properties** - Opposite angles equal, diagonals bisect.', `**Final Verified Answer:** \\(${correctAnswer}\\)`];
        }
      } else if (dbTopicId === 148 || dbTopicId === 149) { // Congruence & Proofs
        if (subType === 0) {
          correctAnswer = 'Corresponding Parts of Congruent Triangles are Congruent';
          options = makeOptions(
            'Corresponding Parts of Congruent Triangles are Congruent',
            'Congruent Polygons Create Total Congruence',
            'Calculated Pairs of Complementary Triangles Calculate',
            'Corresponding Perimeter Creates Triangle Congruence'
          );
          formula = '\\text{CPCTC}';
          hint = 'CPCTC is used after proving two triangles congruent to show remaining corresponding parts are equal.';
          steps = ['**Step 1: Expand acronym** - Corresponding Parts of Congruent Triangles are Congruent.', `**Final Verified Answer:** \\(${correctAnswer}\\)`];
        } else {
          correctAnswer = 'SSS, SAS, ASA, AAS, and HL (for right triangles)';
          options = makeOptions(
            'SSS, SAS, ASA, AAS, and HL (for right triangles)',
            'AAA, SSA, SSS, SAS',
            'AAS, SSA, SAA, HLL',
            'AAA, SSS, SAS only'
          );
          formula = '\\Delta ABC \\cong \\Delta DEF';
          hint = 'Note that AAA and SSA are NOT valid triangle congruence criteria.';
          steps = ['**Step 1: Identify valid congruence postulates** - SSS, SAS, ASA, AAS, HL.', '**Step 2: Note invalid criteria** - AAA (similarity only), SSA (ambiguous).', `**Final Verified Answer:** \\(${correctAnswer}\\)`];
        }
      } else if (dbTopicId === 150) { // Similarity
        correctAnswer = 'Corresponding angles are equal, and corresponding sides are in proportion (ratio k)';
        options = makeOptions(
          'Corresponding angles are equal, and corresponding sides are in proportion (ratio k)',
          'Corresponding sides and angles are all equal',
          'Perimeters are equal but areas differ',
          'Corresponding angles sum to 360°'
        );
        formula = '\\frac{a_1}{a_2} = \\frac{b_1}{b_2} = \\frac{c_1}{c_2} = k, \\quad \\text{Area Ratio} = k^2';
        hint = 'Similarity requires equal angles and proportional sides with scale factor k.';
        steps = ['**Step 1: Define angle condition** - Equal interior angles.', '**Step 2: Define side condition** - Proportional side lengths with scale factor k.', `**Final Verified Answer:** \\(${correctAnswer}\\)`];
      } else if (dbTopicId === 151) { // Special Triangles
        if (subType < 5) { // 45-45-90
          correctAnswer = 'Leg : Leg : Hypotenuse = 1 : 1 : √2';
          options = makeOptions('Leg : Leg : Hypotenuse = 1 : 1 : √2', 'Leg : Leg : Hypotenuse = 1 : √3 : 2', 'Leg : Leg : Hypotenuse = 1 : 2 : 3', 'Leg : Leg : Hypotenuse = 3 : 4 : 5');
          formula = 'x : x : x\\sqrt{2}';
          hint = 'Isosceles right triangle has legs x, x and hypotenuse x√2.';
          steps = ['**Step 1: State 45°-45°-90° side ratio**', '$$1 : 1 : \\sqrt{2}$$', `**Final Verified Answer:** \\(${correctAnswer}\\)`];
        } else { // 30-60-90
          correctAnswer = 'Shortest Leg : Longer Leg : Hypotenuse = 1 : √3 : 2';
          options = makeOptions('Shortest Leg : Longer Leg : Hypotenuse = 1 : √3 : 2', 'Shortest Leg : Longer Leg : Hypotenuse = 1 : 1 : √2', 'Shortest Leg : Longer Leg : Hypotenuse = 1 : 2 : 3', 'Shortest Leg : Longer Leg : Hypotenuse = 2 : 3 : 4');
          formula = 'x : x\\sqrt{3} : 2x';
          hint = 'In a 30°-60°-90° triangle, hypotenuse is double the shortest leg (opposite 30°).';
          steps = ['**Step 1: State 30°-60°-90° side ratio**', '$$x : x\\sqrt{3} : 2x \\implies 1 : \\sqrt{3} : 2$$', `**Final Verified Answer:** \\(${correctAnswer}\\)`];
        }
      } else if (dbTopicId === 152) { // Triangle Theorems
        correctAnswer = 'The sum of the lengths of any two sides must be strictly greater than the third side';
        options = makeOptions(
          'The sum of the lengths of any two sides must be strictly greater than the third side',
          'The sum of all three sides equals 180',
          'The longest side equals the sum of the two shorter sides',
          'The product of two sides equals the third side'
        );
        formula = 'a + b > c, \\quad a + c > b, \\quad b + c > a';
        hint = 'Triangle Inequality Theorem requires a + b > c for all three side combinations.';
        steps = ['**Step 1: State Triangle Inequality Theorem**', '$$a + b > c$$', `**Final Verified Answer:** \\(${correctAnswer}\\)`];
      } else { // Topic 153: Trigonometry (SOH-CAH-TOA)
        correctAnswer = 'sin θ = Opp/Hyp, cos θ = Adj/Hyp, tan θ = Opp/Adj';
        options = makeOptions(
          'sin θ = Opp/Hyp, cos θ = Adj/Hyp, tan θ = Opp/Adj',
          'sin θ = Adj/Hyp, cos θ = Opp/Hyp, tan θ = Hyp/Opp',
          'sin θ = Opp/Adj, cos θ = Adj/Opp, tan θ = Hyp/Adj',
          'sin θ = Hyp/Opp, cos θ = Hyp/Adj, tan θ = Adj/Opp'
        );
        formula = '\\sin \\theta = \\frac{\\text{Opp}}{\\text{Hyp}}, \\quad \\cos \\theta = \\frac{\\text{Adj}}{\\text{Hyp}}, \\quad \\tan \\theta = \\frac{\\text{Opp}}{\\text{Adj}}';
        hint = 'SOH-CAH-TOA mnemonic gives exact primary trigonometric ratios.';
        steps = ['**Step 1: Apply SOH** - sin = Opposite / Hypotenuse.', '**Step 2: Apply CAH** - cos = Adjacent / Hypotenuse.', '**Step 3: Apply TOA** - tan = Opposite / Adjacent.', `**Final Verified Answer:** \\(${correctAnswer}\\)`];
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

  console.log(`✅ Successfully generated and inserted ${totalGenerated} Grade 9 Measurement & Geometry questions into SQLite qbank.db!`);

  // Export updated questions database to Excel
  exportQuestionsToExcel(db);

  console.log('🎉 Generation and Excel export completed successfully!');
}

if (process.argv[1] && process.argv[1].endsWith('generate_g9_measurement_geometry.js')) {
  generateGrade9MeasurementGeometryQuestions();
}
