import { initDb } from '../server/db.js';
import { exportQuestionsToExcel } from '../server/excelService.js';
import { generateGrade10MgSvg } from './generate_g10_mg_svgs.js';
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

// Topic Mapping: Excel T01..T04 -> SQLite Topic ID 161..164
const topicMapping = {
  'T01': 161, // The laws of sines and the laws of cosines
  'T02': 162, // Translations, reflections, and rotations in the Cartesian plane
  'T03': 163, // Central angles, inscribed angles, chords, secants, and tangents
  'T04': 164  // Sectors and segments of a circle, and their areas
};

export function generateGrade10MeasurementGeometryQuestions() {
  console.log('🚀 Generating 200 Grade 10 Measurement & Geometry Questions (Topics 161 to 164)...');

  // Read Excel Seed File
  const excelPath = path.join(__dirname, '..', 'resources', 'Grade_10_Math_Questions.xlsx');
  const wb = xlsx.readFile(excelPath);
  const sheet = wb.Sheets['Measurement & Geometry (MG)'] || wb.Sheets['Measurement and Geometry (MG)'];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  // Group questions by Excel topic code
  const excelQuestions = {};
  rows.slice(4).forEach(r => {
    if (r && r.length >= 5 && typeof r[0] === 'string' && r[0].startsWith('T')) {
      const itemID = r[0].trim();
      const tCode = itemID.split('-')[0]; // T01, T02, T03, T04
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

      let title = `[${qItem.itemID}] ${qItem.qText.substring(0, 45)}...`;
      let text = qItem.qText;
      let formula = '';
      let options = [];
      let correctAnswer = '';
      let hint = '';
      let steps = [];
      let difficulty = (qNum % 3) + 1;

      // Ensure custom SVG plot exists
      const imageUrl = generateGrade10MgSvg(dbTopicId, idx, { title: `${dbTopicTitle} #${qNum}` });
      const imageAlt = `Diagram for Grade 10 ${dbTopicTitle} question #${qNum}`;

      // Build specific math logic based on Topic ID and Question Index
      if (dbTopicId === 161) { // Topic 161: Law of Sines & Cosines
        if (qNum === 1) {
          title = "Law of Sines Standard Formula";
          text = "State the Law of Sines formula relating side lengths \\(a, b, c\\) and opposite angles \\(A, B, C\\) of an oblique triangle.";
          formula = "\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C} = 2R";
          correctAnswer = "\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}";
          options = makeOptions(correctAnswer, "\\frac{a}{\\cos A} = \\frac{b}{\\cos B} = \\frac{c}{\\cos C}", "a \\sin A = b \\sin B = c \\sin C", "a^2 + b^2 = c^2 - 2ab \\sin C");
          hint = "The ratio of each side to the sine of its opposite angle is constant.";
          steps = ["**Step 1:** State the Law of Sines theorem for oblique triangles.", "$$\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}$$", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else if (qNum === 2) {
          title = "Law of Cosines Side Forms";
          text = "State the three standard forms of the Law of Cosines for finding side lengths \\(a, b, c\\).";
          formula = "c^2 = a^2 + b^2 - 2ab \\cos C";
          correctAnswer = "c^2 = a^2 + b^2 - 2ab \\cos C, \\; a^2 = b^2 + c^2 - 2bc \\cos A, \\; b^2 = a^2 + c^2 - 2ac \\cos B";
          options = makeOptions(correctAnswer, "c^2 = a^2 + b^2 + 2ab \\cos C, \\; a^2 = b^2 + c^2 + 2bc \\cos A, \\; b^2 = a^2 + c^2 + 2ac \\cos B", "c^2 = a^2 - b^2 - 2ab \\sin C, \\; a^2 = b^2 - c^2 - 2bc \\sin A, \\; b^2 = a^2 - c^2 - 2ac \\sin B", "c = a + b - 2ab \\cos C");
          hint = "The Law of Cosines generalizes the Pythagorean theorem by subtracting \\(2ab \\cos C\\).";
          steps = ["**Step 1:** Write the standard Law of Cosines equation for side \\(c\\): $$c^2 = a^2 + b^2 - 2ab \\cos C$$", "**Step 2:** Permute cyclically for sides \\(a\\) and \\(b\\).", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else if (qNum === 3) {
          title = "Law of Cosines Angle Forms (SSS)";
          text = "State the rearranged form of the Law of Cosines used to solve for angle \\(C\\) given all three sides \\(a, b, c\\).";
          formula = "\\cos C = \\frac{a^2 + b^2 - c^2}{2ab}";
          correctAnswer = "\\cos C = \\frac{a^2 + b^2 - c^2}{2ab}";
          options = makeOptions(correctAnswer, "\\cos C = \\frac{a^2 + b^2 + c^2}{2ab}", "\\cos C = \\frac{c^2 - a^2 - b^2}{2ab}", "\\cos C = \\frac{a + b - c}{2ab}");
          hint = "Isolate \\(\\cos C\\) from \\(c^2 = a^2 + b^2 - 2ab \\cos C\\).";
          steps = ["**Step 1:** Start with $$c^2 = a^2 + b^2 - 2ab \\cos C$$", "**Step 2:** Rearrange to isolate \\(\\cos C\\): $$2ab \\cos C = a^2 + b^2 - c^2 \\implies \\cos C = \\frac{a^2 + b^2 - c^2}{2ab}$$", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else if (qNum === 5) {
          title = "Law of Sines AAS/ASA Calculation";
          text = "In \\(\\triangle ABC\\), given \\(A = 40^\\circ\\), \\(B = 60^\\circ\\), and \\(a = 12\\text{ cm}\\), use the Law of Sines to calculate side \\(b\\) to two decimal places.";
          formula = "b = \\frac{a \\sin B}{\\sin A}";
          correctAnswer = "16.17 cm";
          options = makeOptions("16.17 cm", "14.28 cm", "18.35 cm", "12.00 cm");
          hint = "Apply \\(\\frac{b}{\\sin 60^\\circ} = \\frac{12}{\\sin 40^\\circ}\\).";
          steps = ["**Step 1: Set up Law of Sines**", "$$b = \\frac{12 \\cdot \\sin(60^\\circ)}{\\sin(40^\\circ)}$$", "**Step 2: Evaluate values**", "$$b = \\frac{12 \\cdot 0.8660}{0.6428} \\approx 16.17\\text{ cm}$$", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else if (qNum === 13) {
          title = "Law of Cosines SAS Side Calculation";
          text = "In \\(\\triangle ABC\\), given \\(a = 7\\text{ cm}\\), \\(b = 9\\text{ cm}\\), and included angle \\(C = 48^\\circ\\), find side \\(c\\) to two decimal places.";
          formula = "c = \\sqrt{a^2 + b^2 - 2ab \\cos C}";
          correctAnswer = "6.77 cm";
          options = makeOptions("6.77 cm", "7.85 cm", "8.12 cm", "5.94 cm");
          hint = "Substitute \\(a=7, b=9, C=48^\\circ\\) into \\(c^2 = a^2 + b^2 - 2ab \\cos C\\).";
          steps = ["**Step 1: Apply Law of Cosines**", "$$c^2 = 7^2 + 9^2 - 2(7)(9)\\cos(48^\\circ) = 49 + 81 - 126(0.6691) = 130 - 84.31 = 45.69$$", "**Step 2: Take square root**", "$$c = \\sqrt{45.69} \\approx 6.77\\text{ cm}$$", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else if (qNum === 15) {
          title = "Law of Cosines SSS Angle Calculation";
          text = "In \\(\\triangle ABC\\), given side lengths \\(a = 5\\text{ cm}\\), \\(b = 7\\text{ cm}\\), and \\(c = 8\\text{ cm}\\), find the measure of angle \\(C\\).";
          formula = "\\cos C = \\frac{5^2 + 7^2 - 8^2}{2(5)(7)}";
          correctAnswer = "81.79°";
          options = makeOptions("81.79°", "78.46°", "85.20°", "60.00°");
          hint = "Use \\(\\cos C = \\frac{a^2 + b^2 - c^2}{2ab}\\).";
          steps = ["**Step 1: Substitute values into Law of Cosines**", "$$\\cos C = \\frac{25 + 49 - 64}{70} = \\frac{10}{70} = 0.14286$$", "**Step 2: Calculate inverse cosine**", "$$C = \\arccos(0.14286) \\approx 81.79^\\circ$$", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else if (qNum === 20) {
          title = "Largest Angle in Triangle SSS";
          text = "In \\(\\triangle PQR\\), given \\(p = 12\\text{ cm}\\), \\(q = 15\\text{ cm}\\), and \\(r = 20\\text{ cm}\\), find the measure of the largest interior angle (opposite side \\(r\\)).";
          formula = "\\cos R = \\frac{12^2 + 15^2 - 20^2}{2(12)(15)}";
          correctAnswer = "95.15°";
          options = makeOptions("95.15°", "88.42°", "102.30°", "90.00°");
          hint = "The largest angle is always opposite the longest side (side \\(r = 20\\text{ cm}\\)).";
          steps = ["**Step 1: Apply Law of Cosines for angle R**", "$$\\cos R = \\frac{144 + 225 - 400}{360} = \\frac{-31}{360} \\approx -0.08611$$", "**Step 2: Compute angle**", "$$R = \\arccos(-0.08611) \\approx 95.15^\\circ$$", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else if (qNum === 22) {
          title = "Navigation Bearing Application";
          text = "Two ships leave port at the same time. Ship A sails on a bearing of N 40° E at 18 knots, while Ship B sails on a bearing of S 70° E at 22 knots. Find the distance between the ships after 2 hours.";
          formula = "d = \\sqrt{d_1^2 + d_2^2 - 2d_1d_2 \\cos \\theta}";
          correctAnswer = "33.97 nautical miles";
          options = makeOptions("33.97 nautical miles", "40.25 nautical miles", "28.50 nautical miles", "50.00 nautical miles");
          hint = "Calculate distances after 2 hours: \\(d_1 = 36\\), \\(d_2 = 44\\). Included angle is \\(180^\\circ - 40^\\circ - 70^\\circ = 70^\\circ\\).";
          steps = ["**Step 1: Calculate distances traveled**", "$$d_A = 18 \\times 2 = 36\\text{ nm}, \\quad d_B = 22 \\times 2 = 44\\text{ nm}$$", "**Step 2: Determine included angle**", "$$\\theta = 180^\\circ - (40^\\circ + 70^\\circ) = 70^\\circ$$", "**Step 3: Apply Law of Cosines**", "$$d^2 = 36^2 + 44^2 - 2(36)(44)\\cos(70^\\circ) = 1296 + 1936 - 3168(0.3420) = 2152.47$$", "$$d = \\sqrt{2152.47} \\approx 33.97\\text{ nm}$$", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else {
          const valA = 10 + (qNum % 8);
          const valB = 14 + (qNum % 6);
          const angC = 30 + (qNum % 50);
          const sideC = Math.sqrt(valA * valA + valB * valB - 2 * valA * valB * Math.cos((angC * Math.PI) / 180)).toFixed(2);
          
          title = `Oblique Triangle Problem #${qNum}`;
          text = `In \\(\\triangle ABC\\), given \\(a = ${valA}\\text{ cm}\\), \\(b = ${valB}\\text{ cm}\\), and included angle \\(C = ${angC}^\\circ\\), calculate the length of side \\(c\\).`;
          formula = `c^2 = ${valA}^2 + ${valB}^2 - 2(${valA})(${valB}) \\cos(${angC}^\\circ)`;
          correctAnswer = `${sideC} cm`;
          options = makeOptions(`${sideC} cm`, `${(parseFloat(sideC) + 2.5).toFixed(2)} cm`, `${(parseFloat(sideC) - 1.8).toFixed(2)} cm`, `${(valA + valB).toFixed(2)} cm`);
          hint = "Substitute the given side lengths and included angle into the Law of Cosines formula.";
          steps = [
            `**Step 1:** Identify knowns: \\(a = ${valA}\\), \\(b = ${valB}\\), \\(C = ${angC}^\\circ\\).`,
            `**Step 2:** Apply Law of Cosines: $$c = \\sqrt{${valA}^2 + ${valB}^2 - 2(${valA})(${valB})\\cos(${angC}^\\circ)}$$`,
            `**Step 3:** Calculate result: $$c \\approx ${sideC}\\text{ cm}$$`,
            `**Final Answer:** \\(${correctAnswer}\\)`
          ];
        }
      } else if (dbTopicId === 162) { // Topic 162: Cartesian Transformations
        if (qNum === 1) {
          title = "Definition of Rigid Transformation (Isometry)";
          text = "Define a geometric transformation in the Cartesian plane and distinguish an isometric (rigid) transformation from a non-rigid transformation.";
          formula = "d(P', Q') = d(P, Q)";
          correctAnswer = "An isometry preserves distance and angle measures; non-rigid transformations change size or shape.";
          options = makeOptions("An isometry preserves distance and angle measures; non-rigid transformations change size or shape.", "An isometry changes shape; non-rigid transformations preserve distance.", "All transformations change object size.", "An isometry only applies to circles.");
          hint = "Translations, reflections, and rotations are rigid transformations because distance between points remains invariant.";
          steps = ["**Step 1:** Recall definition of isometry (rigid motion).", "**Step 2:** Confirm distance preservation: \\(d(P', Q') = d(P, Q)\\).", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else if (qNum === 2) {
          title = "Translation Coordinate Mapping Notation";
          text = "Define a translation in the Cartesian plane and state its coordinate mapping notation for shift by \\(h\\) units horizontally and \\(k\\) units vertically.";
          formula = "(x, y) \\to (x + h, y + k)";
          correctAnswer = "(x, y) → (x + h, y + k)";
          options = makeOptions("(x, y) → (x + h, y + k)", "(x, y) → (hx, ky)", "(x, y) → (-y, x)", "(x, y) → (x - h, y - k)");
          hint = "Adding \\(h\\) shifts horizontally (right if positive), adding \\(k\\) shifts vertically (up if positive).";
          steps = ["**Step 1:** State translation mapping formula.", "$$(x, y) \\to (x + h, y + k)$$", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else if (qNum === 3) {
          title = "Point Translation Evaluation";
          text = "Find the image of point \\(P(-4, 7)\\) under the translation \\(T(x, y) = (x + 6, y - 9)\\).";
          formula = "(-4 + 6, 7 - 9)";
          correctAnswer = "(2, -2)";
          options = makeOptions("(2, -2)", "(-10, 16)", "(2, 2)", "(-2, -2)");
          hint = "Add 6 to the x-coordinate and subtract 9 from the y-coordinate.";
          steps = ["**Step 1: Apply translation rule**", "$$x' = -4 + 6 = 2, \\quad y' = 7 - 9 = -2$$", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else if (qNum === 6) {
          title = "Standard Reflection Coordinate Rules";
          text = "State the coordinate mapping rule for reflecting a point \\((x, y)\\) across the line \\(y = x\\).";
          formula = "(x, y) \\to (y, x)";
          correctAnswer = "(x, y) → (y, x)";
          options = makeOptions("(x, y) → (y, x)", "(x, y) → (x, -y)", "(x, y) → (-x, y)", "(x, y) → (-y, -x)");
          hint = "Reflecting across the line \\(y = x\\) swaps the x and y coordinates.";
          steps = ["**Step 1:** Recall reflection mapping across \\(y = x\\).", "$$(x, y) \\to (y, x)$$", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else if (qNum === 15) {
          title = "Rotation Mapping Rules about Origin";
          text = "State the coordinate mapping rule for a \\(90^\\circ\\) counterclockwise rotation about the origin \\((0, 0)\\).";
          formula = "(x, y) \\to (-y, x)";
          correctAnswer = "(x, y) → (-y, x)";
          options = makeOptions("(x, y) → (-y, x)", "(x, y) → (y, -x)", "(x, y) → (-x, -y)", "(x, y) → (y, x)");
          hint = "A \\(90^\\circ\\) counterclockwise rotation swaps coordinates and negates the new x-value.";
          steps = ["**Step 1:** State rotation rule for \\(+90^\\circ\\):", "$$(x, y) \\to (-y, x)$$", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else if (qNum === 16) {
          title = "90° Counterclockwise Rotation Evaluation";
          text = "Find the image of point \\(P(4, -6)\\) after a \\(90^\\circ\\) counterclockwise rotation about the origin.";
          formula = "(4, -6) \\to (-(-6), 4) = (6, 4)";
          correctAnswer = "(6, 4)";
          options = makeOptions("(6, 4)", "(-6, -4)", "(-4, 6)", "(4, 6)");
          hint = "Apply rule \\((x, y) \\to (-y, x)\\) for \\(x=4, y=-6\\).";
          steps = ["**Step 1: Substitute x=4, y=-6 into rule**", "$$x' = -(-6) = 6, \\quad y' = 4$$", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else if (qNum === 35) {
          title = "General 2D Rotation Formula";
          text = "State the general 2D rotation formula for rotating point \\((x, y)\\) counterclockwise by angle \\(\\theta\\) about the origin.";
          formula = "x' = x \\cos \\theta - y \\sin \\theta, \\quad y' = x \\sin \\theta + y \\cos \\theta";
          correctAnswer = "x' = x cos θ - y sin θ, y' = x sin θ + y cos θ";
          options = makeOptions("x' = x cos θ - y sin θ, y' = x sin θ + y cos θ", "x' = x cos θ + y sin θ, y' = y cos θ - x sin θ", "x' = x sin θ - y cos θ, y' = x cos θ + y sin θ", "x' = x + cos θ, y' = y + sin θ");
          hint = "Use basic trigonometric addition formulas on polar coordinates.";
          steps = ["**Step 1:** Express \\(x = r \\cos \\phi\\), \\(y = r \\sin \\phi\\).", "**Step 2:** Rotate by \\(\\theta\\): \\(x' = r \\cos(\\phi + \\theta) = x \\cos \\theta - y \\sin \\theta\\).", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else {
          const px = -5 + (qNum % 12);
          const py = -4 + (qNum % 10);
          const dx = 2 + (qNum % 5);
          const dy = -3 + (qNum % 6);
          const resX = px + dx;
          const resY = py + dy;

          title = `Translation Evaluation #${qNum}`;
          text = `Find the image of point \\(P(${px}, ${py})\\) after translation by vector \\(\\langle ${dx}, ${dy} \\rangle\\).`;
          formula = `(${px} + ${dx}, ${py} + ${dy})`;
          correctAnswer = `(${resX}, ${resY})`;
          options = makeOptions(`(${resX}, ${resY})`, `(${resX + 2}, ${resY - 1})`, `(${px - dx}, ${py - dy})`, `(${resY}, ${resX})`);
          hint = "Add the vector components directly to the point's coordinates.";
          steps = [
            `**Step 1:** Perform coordinate addition:`,
            `$$x' = ${px} + (${dx}) = ${resX}$$`,
            `$$y' = ${py} + (${dy}) = ${resY}$$`,
            `**Final Answer:** \\(${correctAnswer}\\)`
          ];
        }
      } else if (dbTopicId === 163) { // Topic 163: Circle Theorems (Angles, Chords, Secants, Tangents)
        if (qNum === 1) {
          title = "Central Angle and Intercepted Arc";
          text = "Define a central angle of a circle and state the relationship between the measure of a central angle and its intercepted arc.";
          formula = "m\\angle AOB = m(\\widehat{AB})";
          correctAnswer = "The degree measure of a central angle is equal to the degree measure of its intercepted arc.";
          options = makeOptions("The degree measure of a central angle is equal to the degree measure of its intercepted arc.", "The measure of a central angle is half its intercepted arc.", "The measure of a central angle is twice its intercepted arc.", "Central angles always measure 90 degrees.");
          hint = "By definition, central angle measure directly equals intercepted arc measure.";
          steps = ["**Step 1:** Define central angle (vertex at center of circle).", "**Step 2:** State relationship: \\(m\\angle AOB = m(\\widehat{AB})\\).", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else if (qNum === 2) {
          title = "Inscribed Angle Theorem";
          text = "State the Inscribed Angle Theorem regarding an angle whose vertex lies on the circle.";
          formula = "m\\angle PQR = \\frac{1}{2} m(\\widehat{PR})";
          correctAnswer = "The measure of an inscribed angle is equal to half the measure of its intercepted arc.";
          options = makeOptions("The measure of an inscribed angle is equal to half the measure of its intercepted arc.", "The measure of an inscribed angle is equal to its intercepted arc.", "The measure of an inscribed angle is twice its intercepted arc.", "Inscribed angles sum to 360 degrees.");
          hint = "An angle subtended at the circumference is half the angle subtended at the center.";
          steps = ["**Step 1:** State Inscribed Angle Theorem formula.", "$$m\\angle PQR = \\frac{1}{2}m(\\widehat{PR})$$", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else if (qNum === 3) {
          title = "Central Angle Arc Measure Evaluation";
          text = "In circle \\(O\\), if central angle \\(\\angle AOB = 76^\\circ\\), find the degree measure of minor arc \\(\\widehat{AB}\\) and major arc \\(\\widehat{ACB}\\).";
          formula = "m(\\widehat{AB}) = 76^\\circ, \\quad m(\\widehat{ACB}) = 360^\\circ - 76^\\circ";
          correctAnswer = "Minor arc = 76°, Major arc = 284°";
          options = makeOptions("Minor arc = 76°, Major arc = 284°", "Minor arc = 38°, Major arc = 322°", "Minor arc = 152°, Major arc = 208°", "Minor arc = 76°, Major arc = 180°");
          hint = "Minor arc equals central angle; major arc equals 360° minus minor arc.";
          steps = ["**Step 1: Minor arc measure** - $$m(\\widehat{AB}) = 76^\\circ$$", "**Step 2: Major arc measure** - $$m(\\widehat{ACB}) = 360^\\circ - 76^\\circ = 284^\\circ$$", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else if (qNum === 14) {
          title = "Radius-Tangent Theorem";
          text = "State the Radius-Tangent Theorem regarding the angle formed between a tangent line and a radius at the point of tangency.";
          formula = "\\text{Radius } OP \\perp \\text{ Tangent Line at } P \\implies \\angle OPA = 90^\\circ";
          correctAnswer = "A tangent to a circle is perpendicular to the radius drawn to the point of tangency (forms a 90° angle).";
          options = makeOptions("A tangent to a circle is perpendicular to the radius drawn to the point of tangency (forms a 90° angle).", "A tangent line is parallel to the radius.", "A tangent line intersects the radius at 45°.", "A tangent line bisects the circle diameter.");
          hint = "The radius at point of tangency meets the tangent line at a right angle.";
          steps = ["**Step 1:** State theorem property: Radius \\(\\perp\\) Tangent.", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else if (qNum === 27) {
          title = "Intersecting Chords Length Theorem";
          text = "State the Intersecting Chords Length Theorem for two chords \\(AB\\) and \\(CD\\) intersecting at point \\(E\\) inside a circle.";
          formula = "AE \\cdot EB = CE \\cdot ED";
          correctAnswer = "AE · EB = CE · ED";
          options = makeOptions("AE · EB = CE · ED", "AE + EB = CE + ED", "AE / EB = CE / ED", "AE · CE = EB · ED");
          hint = "The product of the segments of one chord equals the product of the segments of the other chord.";
          steps = ["**Step 1:** State Intersecting Chords Theorem: $$AE \\cdot EB = CE \\cdot ED$$", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else if (qNum === 28) {
          title = "Intersecting Chords Segment Calculation";
          text = "Chords \\(AB\\) and \\(CD\\) intersect at point \\(E\\) inside a circle. If \\(AE = 4\\text{ cm}\\), \\(EB = 9\\text{ cm}\\), and \\(CE = 6\\text{ cm}\\), find the length of \\(ED\\).";
          formula = "ED = \\frac{AE \\cdot EB}{CE} = \\frac{4 \\cdot 9}{6}";
          correctAnswer = "6 cm";
          options = makeOptions("6 cm", "8 cm", "5 cm", "7.5 cm");
          hint = "Use \\(AE \\cdot EB = CE \\cdot ED\\).";
          steps = ["**Step 1: Apply Intersecting Chords Theorem**", "$$4 \\cdot 9 = 6 \\cdot ED \\implies 36 = 6 \\cdot ED$$", "**Step 2: Solve for ED**", "$$ED = \\frac{36}{6} = 6\\text{ cm}$$", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else if (qNum === 32) {
          title = "Tangent-Secant Length Theorem";
          text = "State the Tangent-Secant Length Theorem for tangent segment \\(PT\\) and secant segment \\(PAB\\) drawn from external point \\(P\\).";
          formula = "PT^2 = PA \\cdot PB";
          correctAnswer = "PT² = PA · PB";
          options = makeOptions("PT² = PA · PB", "PT = PA + PB", "PT = PA · PB", "PT² = PA² + PB²");
          hint = "The square of the tangent segment equals the product of the external secant segment and the entire secant segment.";
          steps = ["**Step 1:** State Tangent-Secant Theorem formula: $$PT^2 = PA \\cdot PB$$", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else {
          const arc1 = 60 + (qNum % 40);
          const arc2 = 100 + (qNum % 50);
          const angleVal = ((arc1 + arc2) / 2).toFixed(1);

          title = `Intersecting Chords Angle #${qNum}`;
          text = `Two chords intersect inside a circle intercepting opposite arcs measuring \\(${arc1}^\\circ\\) and \\(${arc2}^\\circ\\). Calculate the measure of the acute vertical angle formed at their intersection.`;
          formula = `\\text{Angle} = \\frac{${arc1}^\\circ + ${arc2}^\\circ}{2}`;
          correctAnswer = `${angleVal}°`;
          options = makeOptions(`${angleVal}°`, `${(arc2 - arc1).toFixed(1)}°`, `${(parseFloat(angleVal) + 15).toFixed(1)}°`, `${(arc1).toFixed(1)}°`);
          hint = "The measure of an angle formed by two intersecting chords is half the sum of intercepted arcs.";
          steps = [
            `**Step 1:** Apply theorem formula:`,
            `$$\\text{Angle} = \\frac{m(\\widehat{\\text{Arc}_1}) + m(\\widehat{\\text{Arc}_2})}{2}$$`,
            `**Step 2:** Substitute values: $$\\frac{${arc1} + ${arc2}}{2} = \\frac{${arc1 + arc2}}{2} = ${angleVal}^\\circ$$`,
            `**Final Answer:** \\(${correctAnswer}\\)`
          ];
        }
      } else if (dbTopicId === 164) { // Topic 164: Sectors and Segments of a Circle
        if (qNum === 1) {
          title = "Sector Area Formula";
          text = "Define a sector of a circle and state the formula for its area when central angle \\(\\theta\\) is in degrees.";
          formula = "\\text{Area} = \\frac{\\theta}{360^\\circ} \\cdot \\pi r^2";
          correctAnswer = "Area = (θ / 360°) · πr²";
          options = makeOptions("Area = (θ / 360°) · πr²", "Area = (θ / 180°) · πr²", "Area = θ · πr", "Area = (θ / 360°) · 2πr");
          hint = "The sector area is the fraction \\(\\frac{\\theta}{360^\\circ}\\) of the total circle area \\(\\pi r^2\\).";
          steps = ["**Step 1:** State sector area formula.", "$$\\text{Area} = \\left(\\frac{\\theta}{360^\\circ}\\right) \\pi r^2$$", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else if (qNum === 2) {
          title = "Arc Length Formula";
          text = "Define arc length \\(s\\) of a circle sector and state its formula when central angle \\(\\theta\\) is in degrees.";
          formula = "s = \\frac{\\theta}{360^\\circ} \\cdot 2\\pi r";
          correctAnswer = "s = (θ / 360°) · 2πr";
          options = makeOptions("s = (θ / 360°) · 2πr", "s = (θ / 360°) · πr²", "s = (θ / 180°) · πr", "s = θ · r");
          hint = "Arc length is the fraction \\(\\frac{\\theta}{360^\\circ}\\) of the total circumference \\(2\\pi r\\).";
          steps = ["**Step 1:** State arc length formula.", "$$s = \\left(\\frac{\\theta}{360^\\circ}\\right) 2\\pi r$$", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else if (qNum === 3) {
          title = "Sector Arc Length & Area Evaluation";
          text = "A circle has a radius of \\(12\\text{ cm}\\). Find the exact arc length and area of a sector with a central angle of \\(60^\\circ\\) in terms of \\(\\pi\\).";
          formula = "s = \\frac{60}{360} \\cdot 24\\pi = 4\\pi \\text{ cm}, \\quad A = \\frac{60}{360} \\cdot 144\\pi = 24\\pi \\text{ cm}^2";
          correctAnswer = "Arc length = 4π cm, Area = 24π cm²";
          options = makeOptions("Arc length = 4π cm, Area = 24π cm²", "Arc length = 2π cm, Area = 12π cm²", "Arc length = 6π cm, Area = 36π cm²", "Arc length = 4π cm, Area = 48π cm²");
          hint = "Substitute \\(r = 12\\) and \\(\\theta = 60^\\circ\\) into the sector formulas.";
          steps = [
            "**Step 1: Calculate Arc Length**", "$$s = \\frac{60}{360} \\cdot 2\\pi(12) = \\frac{1}{6} \\cdot 24\\pi = 4\\pi\\text{ cm}$$",
            "**Step 2: Calculate Sector Area**", "$$A = \\frac{60}{360} \\cdot \\pi(12^2) = \\frac{1}{6} \\cdot 144\\pi = 24\\pi\\text{ cm}^2$$",
            `**Final Answer:** \\(${correctAnswer}\\)`
          ];
        } else if (qNum === 7) {
          title = "Segment Area Definition & Formula";
          text = "Define a segment of a circle and explain how its area is calculated from the sector and triangular regions.";
          formula = "\\text{Area of Segment} = \\text{Area of Sector} - \\text{Area of Triangle}";
          correctAnswer = "Area of Segment = Area of Sector - Area of Triangle";
          options = makeOptions("Area of Segment = Area of Sector - Area of Triangle", "Area of Segment = Area of Sector + Area of Triangle", "Area of Segment = Area of Circle - Area of Sector", "Area of Segment = (1/2) r² θ");
          hint = "Subtract the triangle formed by the radius bounds and chord from the overall sector area.";
          steps = ["**Step 1:** State segment area formula.", "$$\\text{Area}_{\\text{segment}} = \\text{Area}_{\\text{sector}} - \\text{Area}_{\\text{triangle}} = \\frac{1}{2}r^2(\\theta - \\sin\\theta)$$", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else if (qNum === 17) {
          title = "Annulus Area Formula";
          text = "State the formula for the area of an annulus (ring region between concentric circles of radii \\(R\\) and \\(r\\), where \\(R > r\\)).";
          formula = "\\text{Area} = \\pi (R^2 - r^2)";
          correctAnswer = "Area = π(R² - r²)";
          options = makeOptions("Area = π(R² - r²)", "Area = π(R - r)²", "Area = 2π(R - r)", "Area = π(R² + r²)");
          hint = "Subtract the inner circle area \\(\\pi r^2\\) from the outer circle area \\(\\pi R^2\\).";
          steps = ["**Step 1:** Subtract inner area from outer area: $$\\text{Area} = \\pi R^2 - \\pi r^2 = \\pi (R^2 - r^2)$$", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else {
          const rad = 6 + (qNum % 10);
          const ang = 30 + (qNum % 6) * 15;
          const secArea = (((ang / 360) * Math.PI * rad * rad)).toFixed(2);

          title = `Sector Area Calculation #${qNum}`;
          text = `A circular sector has radius \\(r = ${rad}\\text{ cm}\\) and central angle \\(\\theta = ${ang}^\\circ\\). Calculate the area of the sector to two decimal places.`;
          formula = `\\text{Area} = \\frac{${ang}}{360} \\cdot \\pi (${rad}^2)`;
          correctAnswer = `${secArea} cm²`;
          options = makeOptions(`${secArea} cm²`, `${(parseFloat(secArea) * 1.5).toFixed(2)} cm²`, `${(parseFloat(secArea) * 0.7).toFixed(2)} cm²`, `${(rad * ang).toFixed(2)} cm²`);
          hint = "Use formula \\(A = \\frac{\\theta}{360^\\circ} \\pi r^2\\).";
          steps = [
            `**Step 1: Substitute \\(r = ${rad}\\) and \\(\\theta = ${ang}^\\circ\\)**`,
            `$$A = \\frac{${ang}}{360} \\cdot \\pi \\cdot (${rad}^2) = \\frac{${ang}}{360} \\cdot 3.14159 \\cdot ${rad * rad} \\approx ${secArea}\\text{ cm}^2$$`,
            `**Final Answer:** \\(${correctAnswer}\\)`
          ];
        }
      }

      const optionsJson = JSON.stringify(options);
      const workingStepsJson = JSON.stringify(steps);

      insertStmt.run(
        dbTopicId, title, text, formula, optionsJson,
        correctAnswer, hint, workingStepsJson, imageUrl, imageAlt, difficulty
      );

      totalGenerated++;
    });
  }

  console.log(`✅ Successfully inserted ${totalGenerated} Grade 10 MG questions into SQLite DB!`);

  // Sync to Excel Question Bank
  const excelOut = path.join(__dirname, '..', 'questions_bank.xlsx');
  exportQuestionsToExcel(db, excelOut);

  console.log('🎉 Grade 10 Measurement & Geometry processing complete!');
}

generateGrade10MeasurementGeometryQuestions();
