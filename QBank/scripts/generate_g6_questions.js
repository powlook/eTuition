import { initDb } from '../server/db.js';
import { exportQuestionsToExcel } from '../server/excelService.js';
import { generateGrade6Svg } from './generate_g6_svgs.js';
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
    if (f !== undefined && f !== null && String(f).trim() !== '' && !set.has(String(f))) {
      set.add(String(f));
    }
    if (set.size === 4) break;
  }
  
  let counter = 1;
  while (set.size < 4) {
    const candidate = `Option ${counter++}`;
    if (!set.has(candidate)) {
      set.add(candidate);
    }
  }
  
  return shuffle(Array.from(set));
}

// Topic Mapping: Excel T01..T15 -> SQLite Topic ID 89..103
const topicMapping = {
  'T01': 89,  // Tessellation of shapes
  'T02': 90,  // Translation, reflection and rotation with shapes
  'T03': 91,  // Units of volume and capacity
  'T04': 92,  // Volume of cubes and rectangular prisms
  'T05': 93,  // Perimeter and area of triangles, parallelograms, trapezoids, and composite figures
  'T06': 94,  // Parts of a circle, including circumference
  'T07': 95,  // Area of a circle
  'T08': 96,  // Composite figures (triangles, squares, rectangles, circles, semicircles)
  'T09': 97,  // The four operations with decimals
  'T10': 98,  // The four operations with fractions, whole numbers, and mixed numbers
  'T11': 99,  // Ratio and proportion
  'T12': 100, // Percentages and their relationships with fractions and decimals
  'T13': 101, // Exponential form and calculations using GEMDAS rules
  'T14': 102, // Common factors, GCF, common multiples, and LCM
  'T15': 103  // Pie graphs
};

export function generateGrade6Questions() {
  console.log('🚀 Generating 750 Grade 6 Questions (Topics 89 to 103)...');

  // 1. Ensure Grade 6 topics (89 to 103) exist in SQLite DB topics table
  const topicsJsonPath = path.join(__dirname, '..', 'matatag_topics.json');
  if (fs.existsSync(topicsJsonPath)) {
    const matatagTopics = JSON.parse(fs.readFileSync(topicsJsonPath, 'utf8'));
    const insertTopicStmt = db.prepare(`
      INSERT OR REPLACE INTO topics (id, form_level, strand, unit, title, description, competencies)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    matatagTopics.forEach(t => {
      if (t.id >= 89 && t.id <= 103) {
        insertTopicStmt.run(
          t.id,
          t.form_level || 6,
          t.strand || 'Measurement and Geometry',
          t.unit || t.title,
          t.title,
          t.description || '',
          t.competencies || `MATATAG-M6-${t.id}`
        );
      }
    });
  }

  // 2. Read Excel Seed Resource File
  const excelPath = path.join(__dirname, '..', 'resources', 'Grade_6_Math_50_Unique_Questions.xlsx');
  if (!fs.existsSync(excelPath)) {
    throw new Error(`Grade 6 seed resource file not found at ${excelPath}`);
  }

  const wb = xlsx.readFile(excelPath);
  const sheetsToRead = [
    'Measurement & Geometry (MG)',
    'Number and Algebra (NA)',
    'Data and Probability (DP)'
  ];

  const excelQuestions = {};

  sheetsToRead.forEach(sheetName => {
    const sheet = wb.Sheets[sheetName];
    if (!sheet) return;
    const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    rows.slice(4).forEach(r => {
      if (r && r.length >= 5 && typeof r[0] === 'string' && r[0].startsWith('T')) {
        const itemID = r[0].trim();
        const tCode = itemID.split('-')[0]; // T01, T02, ... T15
        const qText = String(r[4]).trim();
        const competency = r[3] ? String(r[3]).trim() : '';

        if (!excelQuestions[tCode]) excelQuestions[tCode] = [];
        excelQuestions[tCode].push({ itemID, qText, competency });
      }
    });
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

    console.log(`Processing ${qList.length} questions for Topic ${dbTopicId} (${tCode}): ${dbTopicTitle}`);

    qList.forEach((qItem, idx) => {
      const qNum = idx + 1;
      let title = `[${qItem.itemID}] ${qItem.qText.substring(0, 45)}...`;
      let text = qItem.qText;
      let formula = '';
      let options = [];
      let correctAnswer = '';
      let hint = '';
      let steps = [];
      let difficulty = (qNum % 3) + 2; // 2, 3, or 4
      let svgParams = {};

      // Helper function to synthesize specific MCQs for Grade 6 math concepts
      if (dbTopicId === 89) { // T01: Tessellation
        formula = '\\sum \\theta_{\\text{vertex}} = 360^\\circ';
        hint = 'Recall that polygons meeting at a single vertex in a tessellation must have interior angles summing to 360 degrees without gaps or overlaps.';

        if (qNum % 5 === 1) {
          correctAnswer = 'No gaps and no overlaps between tiles';
          options = makeOptions(correctAnswer, 'Overlapping tiles with small gaps', 'Tiles overlapping by exactly 1 cm', 'Gaps filled with circles only');
          steps = [
            '**Step 1: Identify geometric conditions of tessellation**',
            'A tessellation (tiling) is a pattern of shapes covering a plane.',
            '**Step 2: Apply tile boundary rules**',
            'The two essential conditions are: (1) no gaps (empty spaces) and (2) no overlaps between tiles.',
            `**Final Verified Answer:** ${correctAnswer}`
          ];
        } else if (qNum % 5 === 2) {
          correctAnswer = 'Equilateral triangles, Squares, and Regular Hexagons';
          options = makeOptions(correctAnswer, 'Regular Pentagons, Regular Octagons, and Circles', 'Regular Heptagons, Squares, and Triangles', 'Scalene Triangles and Circles only');
          steps = [
            '**Step 1: Apply vertex angle sum rule**',
            '$$\\text{Vertex Angle Sum} = 360^\\circ$$',
            '**Step 2: Test regular polygons**',
            'Equilateral triangle: \\(60^\\circ \\times 6 = 360^\\circ\\). Square: \\(90^\\circ \\times 4 = 360^\\circ\\). Regular hexagon: \\(120^\\circ \\times 3 = 360^\\circ\\).',
            `**Final Verified Answer:** ${correctAnswer}`
          ];
        } else if (qNum % 5 === 3) {
          correctAnswer = '6 equilateral triangles';
          options = makeOptions(correctAnswer, '4 equilateral triangles', '5 equilateral triangles', '8 equilateral triangles');
          steps = [
            '**Step 1: Determine interior angle of an equilateral triangle**',
            '$$\\text{Interior Angle} = 60^\\circ$$',
            '**Step 2: Calculate number of triangles meeting at a vertex**',
            '$$N = \\frac{360^\\circ}{60^\\circ} = 6$$',
            `**Final Verified Answer:** ${correctAnswer}`
          ];
        } else if (qNum % 5 === 4) {
          correctAnswer = 'Regular Pentagon (108°) because 360° is not divisible by 108°';
          options = makeOptions(correctAnswer, 'Square (90°)', 'Equilateral Triangle (60°)', 'Regular Hexagon (120°)');
          steps = [
            '**Step 1: Check interior angle of regular pentagon**',
            '$$\\text{Interior Angle} = \\frac{(5-2) \\times 180^\\circ}{5} = 108^\\circ$$',
            '**Step 2: Check divisibility of 360°**',
            '\\(360^\\circ \\div 108^\\circ = 3.33\\) (not an integer), so regular pentagons cannot tessellate alone.',
            `**Final Verified Answer:** ${correctAnswer}`
          ];
        } else {
          correctAnswer = 'Monohedral regular tessellation';
          options = makeOptions(correctAnswer, 'Irregular non-periodic tiling', 'Semi-regular dual tessellation', 'Asymmetric radial projection');
          steps = [
            '**Step 1: Define regular monohedral tessellation**',
            'A monohedral tiling uses only one type of regular polygon.',
            '**Step 2: Verify angle sum**',
            'Since all vertices are identical and surround 360°, it is a regular monohedral tessellation.',
            `**Final Verified Answer:** ${correctAnswer}`
          ];
        }
      } else if (dbTopicId === 90) { // T02: Transformations
        formula = '(x, y) \\longrightarrow (x + a, y + b)';
        hint = 'Translation shifts positions, Reflection flips across a mirror line, and Rotation turns a figure around a fixed point.';

        if (qNum % 3 === 1) {
          const dx = (qNum % 5) + 2;
          const dy = (qNum % 4) + 1;
          correctAnswer = `(${7 + dx}, ${10 + dy})`;
          options = makeOptions(correctAnswer, `(${7 - dx}, ${10 + dy})`, `(${7 + dx}, ${10 - dy})`, `(${7 * dx}, ${10 * dy})`);
          text = `A point $P(7, 10)$ undergoes a translation by vector $\\langle +${dx}, +${dy} \\rangle$. What are the coordinates of the image $P'$?`;
          steps = [
            '**Step 1: Write translation mapping rule**',
            `$$(x, y) \\longrightarrow (x + ${dx}, y + ${dy})$$`,
            '**Step 2: Calculate new coordinates**',
            `$$P' = (7 + ${dx}, 10 + ${dy}) = (${7 + dx}, ${10 + dy})$$`,
            `**Final Verified Answer:** ${correctAnswer}`
          ];
        } else if (qNum % 3 === 2) {
          correctAnswer = 'Point P\'(-4, 5)';
          options = makeOptions(correctAnswer, 'Point P\'(4, -5)', 'Point P\'(-4, -5)', 'Point P\'(5, 4)');
          text = 'Point $P(4, 5)$ is reflected across the y-axis. What are the coordinates of its reflected image $P\'$?';
          steps = [
            '**Step 1: Apply reflection rule across y-axis**',
            '$$(x, y) \\longrightarrow (-x, y)$$',
            '**Step 2: Substitute P(4, 5)**',
            '$$P\' = (-4, 5)$$',
            `**Final Verified Answer:** ${correctAnswer}`
          ];
        } else {
          correctAnswer = 'Point P\'(-3, 8)';
          options = makeOptions(correctAnswer, 'Point P\'(3, -8)', 'Point P\'(8, -3)', 'Point P\'(-8, 3)');
          text = 'Point $P(8, 3)$ is rotated $90^\\circ$ counterclockwise around the origin $(0,0)$. What is the rotated image $P\'$?';
          steps = [
            '**Step 1: Apply 90° CCW rotation rule**',
            '$$(x, y) \\longrightarrow (-y, x)$$',
            '**Step 2: Substitute P(8, 3)**',
            '$$P\' = (-3, 8)$$',
            `**Final Verified Answer:** ${correctAnswer}`
          ];
        }
      } else if (dbTopicId === 91) { // T03: Volume and Capacity
        formula = '1 \\text{ L} = 1000 \\text{ cm}^3 = 1000 \\text{ mL}';
        hint = 'Remember that 1 cubic centimeter (cm³) equals 1 milliliter (mL), and 1000 mL equals 1 Liter (L).';

        const lVal = (qNum % 8) + 2.5;
        const mlVal = lVal * 1000;
        correctAnswer = `${mlVal} mL`;
        options = makeOptions(correctAnswer, `${mlVal / 10} mL`, `${mlVal * 10} mL`, `${mlVal / 100} mL`);
        text = `Convert a liquid capacity of $${lVal}$ Liters (L) into cubic centimeters / milliliters (mL):`;
        steps = [
          '**Step 1: Recall conversion factor between L and mL**',
          '$$1 \\text{ L} = 1000 \\text{ mL}$$',
          '**Step 2: Multiply Liters by 1000**',
          `$$\\text{Capacity} = ${lVal} \\times 1000 = ${mlVal} \\text{ mL}$$`,
          `**Final Verified Answer:** ${correctAnswer}`
        ];
      } else if (dbTopicId === 92) { // T04: Volume of Cubes & Rectangular Prisms
        formula = 'V_{\\text{prism}} = l \\times w \\times h, \\quad V_{\\text{cube}} = s^3';
        hint = 'For a rectangular prism, multiply length × width × height. For a cube, raise the edge length to the 3rd power.';

        if (qNum % 2 === 1) {
          const l = (qNum % 6) + 5;
          const w = (qNum % 4) + 3;
          const h = (qNum % 5) + 4;
          const vol = l * w * h;
          correctAnswer = `${vol} cubic cm`;
          options = makeOptions(correctAnswer, `${vol + 20} cubic cm`, `${vol - 15} cubic cm`, `${vol * 2} cubic cm`);
          text = `Calculate the volume of a rectangular prism with length $l = ${l}\\text{ cm}$, width $w = ${w}\\text{ cm}$, and height $h = ${h}\\text{ cm}$:`;
          steps = [
            '**Step 1: State rectangular prism volume formula**',
            '$$V = l \\times w \\times h$$',
            '**Step 2: Substitute given dimensions**',
            `$$V = ${l} \\times ${w} \\times ${h} = ${vol} \\text{ cm}^3$$`,
            `**Final Verified Answer:** ${correctAnswer}`
          ];
        } else {
          const s = (qNum % 7) + 3;
          const vol = Math.pow(s, 3);
          correctAnswer = `${vol} cm³`;
          options = makeOptions(correctAnswer, `${vol + 36} cm³`, `${s * 3} cm³`, `${vol - 24} cm³`);
          text = `Calculate the volume of a cube with an edge length of $s = ${s}\\text{ cm}$:`;
          steps = [
            '**Step 1: State cube volume formula**',
            '$$V = s^3 = s \\times s \\times s$$',
            '**Step 2: Substitute edge s**',
            `$$V = ${s}^3 = ${s} \\times ${s} \\times ${s} = ${vol} \\text{ cm}^3$$`,
            `**Final Verified Answer:** ${correctAnswer}`
          ];
        }
      } else if (dbTopicId === 93) { // T05: Perimeter & Area of Triangles, Parallelograms, Trapezoids
        formula = 'A_{\\text{triangle}} = \\frac{1}{2}bh, \\quad A_{\\text{trap}} = \\frac{1}{2}(a+b)h';
        hint = 'Triangle area is ½ × base × height. Trapezoid area is ½ × (base₁ + base₂) × height.';

        if (qNum % 3 === 1) { // Triangle
          const b = (qNum % 8) + 6;
          const h = (qNum % 6) + 4;
          const area = 0.5 * b * h;
          correctAnswer = `${area} sq cm`;
          options = makeOptions(correctAnswer, `${b * h} sq cm`, `${area + 6} sq cm`, `${area - 4} sq cm`);
          text = `Find the area of a triangle with base $b = ${b}\\text{ cm}$ and perpendicular height $h = ${h}\\text{ cm}$:`;
          steps = [
            '**Step 1: State triangle area formula**',
            '$$A = \\frac{1}{2} \\times b \\times h$$',
            '**Step 2: Substitute base and height**',
            `$$A = \\frac{1}{2} \\times ${b} \\times ${h} = ${area} \\text{ cm}^2$$`,
            `**Final Verified Answer:** ${correctAnswer}`
          ];
        } else if (qNum % 3 === 2) { // Parallelogram
          const b = (qNum % 7) + 8;
          const h = (qNum % 5) + 5;
          const area = b * h;
          correctAnswer = `${area} sq cm`;
          options = makeOptions(correctAnswer, `${area / 2} sq cm`, `${area + 12} sq cm`, `${area - 10} sq cm`);
          text = `Calculate the area of a parallelogram with base $b = ${b}\\text{ cm}$ and height $h = ${h}\\text{ cm}$:`;
          steps = [
            '**Step 1: State parallelogram area formula**',
            '$$A = b \\times h$$',
            '**Step 2: Multiply base by height**',
            `$$A = ${b} \\times ${h} = ${area} \\text{ cm}^2$$`,
            `**Final Verified Answer:** ${correctAnswer}`
          ];
        } else { // Trapezoid
          const a = (qNum % 5) + 4;
          const b = (qNum % 6) + 10;
          const h = (qNum % 4) + 6;
          const area = 0.5 * (a + b) * h;
          correctAnswer = `${area} sq cm`;
          options = makeOptions(correctAnswer, `${(a + b) * h} sq cm`, `${area + 8} sq cm`, `${area - 6} sq cm`);
          text = `Calculate the area of a trapezoid with parallel bases $a = ${a}\\text{ cm}$, $b = ${b}\\text{ cm}$, and height $h = ${h}\\text{ cm}$:`;
          steps = [
            '**Step 1: State trapezoid area formula**',
            '$$A = \\frac{1}{2} \\times (a + b) \\times h$$',
            '**Step 2: Calculate sum of parallel bases**',
            `$$a + b = ${a} + ${b} = ${a + b}$$`,
            '**Step 3: Calculate area**',
            `$$A = \\frac{1}{2} \\times ${a + b} \\times ${h} = ${area} \\text{ cm}^2$$`,
            `**Final Verified Answer:** ${correctAnswer}`
          ];
        }
      } else if (dbTopicId === 94) { // T06: Parts of Circle & Circumference
        formula = 'C = 2\\pi r = \\pi d, \\quad (\\pi \\approx 3.1416 \\text{ or } \\frac{22}{7})';
        hint = 'Circumference is the distance around a circle, calculated using C = πd or C = 2πr.';

        const r = (qNum % 7) * 7 + 7; // multiples of 7: 7, 14, 21, 28...
        const c = 2 * (22 / 7) * r;
        correctAnswer = `${c} cm`;
        options = makeOptions(correctAnswer, `${c / 2} cm`, `${c + 14} cm`, `${c * 2} cm`);
        text = `Find the circumference of a circle with radius $r = ${r}\\text{ cm}$ (using $\\pi = \\frac{22}{7}$):`;
        steps = [
          '**Step 1: State circle circumference formula**',
          '$$C = 2\\pi r$$',
          '**Step 2: Substitute radius and pi**',
          `$$C = 2 \\times \\frac{22}{7} \\times ${r} = ${c} \\text{ cm}$$`,
          `**Final Verified Answer:** ${correctAnswer}`
        ];
      } else if (dbTopicId === 95) { // T07: Area of a Circle
        formula = 'A = \\pi r^2';
        hint = 'Circle area formula is A = π × r². Square the radius first, then multiply by pi.';

        const r = (qNum % 6) + 3;
        const area = Number((3.14 * r * r).toFixed(2));
        correctAnswer = `${area} sq cm`;
        options = makeOptions(correctAnswer, `${(3.14 * 2 * r).toFixed(2)} sq cm`, `${(area + 12.5).toFixed(2)} sq cm`, `${(area - 10.2).toFixed(2)} sq cm`);
        text = `Calculate the area of a circle with radius $r = ${r}\\text{ cm}$ (using $\\pi = 3.14$):`;
        steps = [
          '**Step 1: State circle area formula**',
          '$$A = \\pi r^2$$',
          '**Step 2: Calculate r squared**',
          `$$r^2 = ${r}^2 = ${r * r}$$`,
          '**Step 3: Multiply by pi**',
          `$$A = 3.14 \\times ${r * r} = ${area} \\text{ cm}^2$$`,
          `**Final Verified Answer:** ${correctAnswer}`
        ];
      } else if (dbTopicId === 96) { // T08: Composite Figures
        formula = 'A_{\\text{composite}} = A_1 + A_2';
        hint = 'Decompose the complex figure into simple basic shapes (rectangles, triangles, semicircles), find each area, and add them together.';

        if (qNum % 2 === 1) { // Rectangle + Triangle
          const rectW = 10 + (qNum % 5);
          const rectH = 6 + (qNum % 4);
          const triH = 4 + (qNum % 3);
          const rectArea = rectW * rectH;
          const triArea = 0.5 * rectW * triH;
          const totalArea = rectArea + triArea;

          svgParams = { shapeType: 'rect_tri', rectW, rectH, triH };
          correctAnswer = `${totalArea} sq cm`;
          options = makeOptions(correctAnswer, `${rectArea} sq cm`, `${totalArea + 15} sq cm`, `${totalArea - 10} sq cm`);
          text = `A composite figure is made of a rectangle ($${rectW}\\text{ cm} \\times ${rectH}\\text{ cm}$) attached to a triangle with base $b = ${rectW}\\text{ cm}$ and height $h = ${triH}\\text{ cm}$. Find the total area:`;
          steps = [
            '**Step 1: Calculate rectangle area**',
            `$$A_{\\text{rect}} = ${rectW} \\times ${rectH} = ${rectArea} \\text{ cm}^2$$`,
            '**Step 2: Calculate triangle area**',
            `$$A_{\\text{tri}} = \\frac{1}{2} \\times ${rectW} \\times ${triH} = ${triArea} \\text{ cm}^2$$`,
            '**Step 3: Add areas together**',
            `$$A_{\\text{total}} = ${rectArea} + ${triArea} = ${totalArea} \\text{ cm}^2$$`,
            `**Final Verified Answer:** ${correctAnswer}`
          ];
        } else { // Rectangle + Semicircle
          const rectW = 10 + (qNum % 4) * 2;
          const rectH = 8 + (qNum % 3);
          const r = rectW / 2;
          const rectArea = rectW * rectH;
          const semiArea = Number((0.5 * 3.14 * r * r).toFixed(2));
          const totalArea = Number((rectArea + semiArea).toFixed(2));

          svgParams = { shapeType: 'rect_semi', rectW, rectH, r };
          correctAnswer = `${totalArea} sq cm`;
          options = makeOptions(correctAnswer, `${rectArea} sq cm`, `${(totalArea + 12.5).toFixed(2)} sq cm`, `${(totalArea - 10.2).toFixed(2)} sq cm`);
          text = `A composite figure is made of a rectangle ($${rectW}\\text{ cm} \\times ${rectH}\\text{ cm}$) attached to a semicircle with radius $r = ${r}\\text{ cm}$. Find the total area (using $\\pi \\approx 3.14$):`;
          steps = [
            '**Step 1: Calculate rectangle area**',
            `$$A_{\\text{rect}} = ${rectW} \\times ${rectH} = ${rectArea} \\text{ cm}^2$$`,
            '**Step 2: Calculate semicircle area**',
            `$$A_{\\text{semi}} = \\frac{1}{2} \\times 3.14 \\times ${r}^2 = ${semiArea} \\text{ cm}^2$$`,
            '**Step 3: Add areas together**',
            `$$A_{\\text{total}} = ${rectArea} + ${semiArea} = ${totalArea} \\text{ cm}^2$$`,
            `**Final Verified Answer:** ${correctAnswer}`
          ];
        }
      } else if (dbTopicId === 97) { // T09: Decimal Operations
        formula = 'a.bcd + e.fgh = \\text{Align Decimal Points}';
        hint = 'Always align decimal points vertically before adding or subtracting decimals.';

        const d1 = Number((12.34 + (qNum * 1.15)).toFixed(4));
        const d2 = Number((5.678 + (qNum * 0.42)).toFixed(4));
        const ans = Number((d1 + d2).toFixed(4));
        correctAnswer = `${ans}`;
        options = makeOptions(correctAnswer, `${(ans + 1.01).toFixed(4)}`, `${(ans - 0.11).toFixed(4)}`, `${(ans + 0.05).toFixed(4)}`);
        text = `Perform the decimal addition: $${d1} + ${d2}$:`;
        steps = [
          '**Step 1: Align decimal points vertically**',
          `$$${d1.toFixed(4)}$$`,
          `$$+ ${d2.toFixed(4)}$$`,
          '**Step 2: Add digits column by column**',
          `$$${d1} + ${d2} = ${ans}$$`,
          `**Final Verified Answer:** ${correctAnswer}`
        ];
      } else if (dbTopicId === 98) { // T10: Fraction Operations
        formula = '\\frac{a}{b} + \\frac{c}{d} = \\frac{ad + bc}{bd}';
        hint = 'Find a common denominator (LCD) before adding or subtracting fractions with different denominators.';

        const num1 = (qNum % 3) + 1;
        const den1 = 4;
        const num2 = (qNum % 2) + 1;
        const den2 = 3;
        // num1/4 + num2/3 = (3*num1 + 4*num2)/12
        const resNum = (3 * num1) + (4 * num2);
        const resDen = 12;
        correctAnswer = `${resNum}/${resDen}`;
        options = makeOptions(correctAnswer, `${resNum + 1}/${resDen}`, `${num1 + num2}/${den1 + den2}`, `${resNum}/${resDen + 2}`);
        text = `Add the fractions: $\\frac{${num1}}{${den1}} + \\frac{${num2}}{${den2}}$:`;
        steps = [
          '**Step 1: Find least common denominator (LCD)**',
          '$$\\text{LCD}(4, 3) = 12$$',
          '**Step 2: Convert fractions to equivalent fractions**',
          `$$\\frac{${num1}}{4} = \\frac{${num1 * 3}}{12}, \\quad \\frac{${num2}}{3} = \\frac{${num2 * 4}}{12}$$`,
          '**Step 3: Add numerators**',
          `$$\\frac{${num1 * 3} + ${num2 * 4}}{12} = \\frac{${resNum}}{12}$$`,
          `**Final Verified Answer:** ${correctAnswer}`
        ];
      } else if (dbTopicId === 99) { // T11: Ratio and Proportion
        formula = '\\frac{a}{b} = \\frac{c}{d} \\implies a \\cdot d = b \\cdot c';
        hint = 'In a proportion, cross products are equal: a/b = c/d means a × d = b × c.';

        const ratioA = 3 + (qNum % 3);
        const ratioB = 5 + (qNum % 4);
        const valA = ratioA * (qNum % 5 + 2);
        const valB = (valA * ratioB) / ratioA;
        correctAnswer = `${valB}`;
        options = makeOptions(correctAnswer, `${valB + 4}`, `${valB - 2}`, `${valB * 2}`);
        text = `The ratio of apples to oranges is $${ratioA} : ${ratioB}$. If there are $${valA}$ apples, how many oranges are there?`;
        steps = [
          '**Step 1: Set up proportion equation**',
          `$$\\frac{${ratioA}}{${ratioB}} = \\frac{${valA}}{x}$$`,
          '**Step 2: Solve for x using cross-multiplication**',
          `$$${ratioA} \\cdot x = ${ratioB} \\cdot ${valA}$$`,
          `$$x = \\frac{${ratioB * valA}}{${ratioA}} = ${valB}$$`,
          `**Final Verified Answer:** ${correctAnswer}`
        ];
      } else if (dbTopicId === 100) { // T12: Percentages & Relationships
        formula = '\\text{Percentage} = \\frac{\\text{Part}}{\\text{Whole}} \\times 100\\%';
        hint = 'To convert a fraction to a percentage, divide numerator by denominator and multiply by 100%.';

        const pVal = (qNum % 9 + 1) * 10; // 10%, 20%... 90%
        const decVal = pVal / 100;
        const fracVal = `${pVal / 10}/10`;
        correctAnswer = `${decVal}`;
        options = makeOptions(correctAnswer, `${(decVal * 10).toFixed(1)}`, `${(decVal / 10).toFixed(2)}`, `${decVal + 0.15}`);
        text = `Convert $${pVal}\\%$ into a decimal number:`;
        steps = [
          '**Step 1: Divide percentage by 100**',
          `$$${pVal}\\% = \\frac{${pVal}}{100}$$`,
          '**Step 2: Express as decimal**',
          `$$\\frac{${pVal}}{100} = ${decVal}$$`,
          `**Final Verified Answer:** ${correctAnswer}`
        ];
      } else if (dbTopicId === 101) { // T13: Exponents & GEMDAS
        formula = 'b^n = \\underbrace{b \\times b \\times \\dots \\times b}_{n \\text{ times}}';
        hint = 'Follow GEMDAS order: Groupings (Parentheses) first, then Exponents, Multiplication & Division from left to right, Addition & Subtraction.';

        const base = (qNum % 4) + 2; // 2, 3, 4, 5
        const exp = (qNum % 3) + 2;  // 2, 3, 4
        const result = Math.pow(base, exp);
        correctAnswer = `${result}`;
        options = makeOptions(correctAnswer, `${base * exp}`, `${result + base}`, `${result - 2}`);
        text = `Evaluate the exponential expression $${base}^${exp}$:`;
        steps = [
          '**Step 1: Expand base raised to exponent**',
          `$$${base}^${exp} = ${Array(exp).fill(base).join(' \\times ')}$$`,
          '**Step 2: Multiply values**',
          `$$${base}^${exp} = ${result}$$`,
          `**Final Verified Answer:** ${correctAnswer}`
        ];
      } else if (dbTopicId === 102) { // T14: Factors, GCF & LCM
        formula = '\\text{GCF}(a, b) = \\text{Greatest Common Factor}';
        hint = 'The GCF is the largest integer that divides both numbers without leaving a remainder.';

        const gcfVal = (qNum % 6) + 2; // 2..7
        const numA = gcfVal * 3;
        const numB = gcfVal * 5;
        correctAnswer = `${gcfVal}`;
        options = makeOptions(correctAnswer, `${gcfVal * 2}`, `${gcfVal + 1}`, `1`);
        text = `Find the Greatest Common Factor (GCF) of $${numA}$ and $${numB}$:`;
        steps = [
          '**Step 1: List prime factorizations**',
          `$$${numA} = ${gcfVal} \\times 3, \\quad ${numB} = ${gcfVal} \\times 5$$`,
          '**Step 2: Identify common prime factors**',
          `$$\\text{GCF}(${numA}, ${numB}) = ${gcfVal}$$`,
          `**Final Verified Answer:** ${correctAnswer}`
        ];
      } else if (dbTopicId === 103) { // T15: Pie Graphs
        formula = '\\text{Central Angle} = \\frac{\\text{Category Value}}{\\text{Total Value}} \\times 360^\\circ';
        hint = 'A complete circle pie graph represents 100% or 360 degrees of central angle.';

        const pct = (qNum % 5 + 1) * 10; // 10%, 20%, 30%, 40%, 50%
        const deg = (pct / 100) * 360;
        correctAnswer = `${deg}°`;
        options = makeOptions(correctAnswer, `${deg + 18}°`, `${deg - 12}°`, `${pct}°`);
        text = `In a pie chart, a category represents $${pct}\\%$ of the total data. What is its central angle degree measure?`;
        steps = [
          '**Step 1: State central angle formula**',
          '$$\\text{Central Angle} = \\text{Percentage} \\times 360^\\circ$$',
          '**Step 2: Convert percentage to decimal and multiply by 360°**',
          `$$\\text{Central Angle} = \\frac{${pct}}{100} \\times 360^\\circ = ${deg}^\\circ$$`,
          `**Final Verified Answer:** ${correctAnswer}`
        ];
      }

      // Generate SVG for visual diagram with topic-specific svgParams
      const imageUrl = generateGrade6Svg(dbTopicId, idx, { title: `${tCode} Q${qNum}: ${dbTopicTitle}`, ...svgParams });
      const imageAlt = `Grade 6 ${dbTopicTitle} Math Diagram`;

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

  console.log(`✅ Successfully generated ${totalGenerated} Grade 6 questions across 15 topics!`);

  // 3. Export full updated database to questions_bank.xlsx
  const excelOutputPath = path.join(__dirname, '..', 'questions_bank.xlsx');
  exportQuestionsToExcel(db, excelOutputPath);
  console.log(`📊 Exported database to ${excelOutputPath}`);
}

// Execute if run directly
if (process.argv[1] && process.argv[1].endsWith('generate_g6_questions.js')) {
  generateGrade6Questions();
}
