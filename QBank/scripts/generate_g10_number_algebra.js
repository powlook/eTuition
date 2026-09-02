import { initDb } from '../server/db.js';
import { exportQuestionsToExcel } from '../server/excelService.js';
import { generateGrade10NaSvg } from './generate_g10_na_svgs.js';
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

// Topic Mapping: Excel T05..T12 -> SQLite Topic ID 165..172
const topicMapping = {
  'T05': 165, // Quadratic inequalities in one variable and in two variables
  'T06': 166, // Absolute value equations and inequalities in one variable and their graphs
  'T07': 167, // Radical expressions
  'T08': 168, // The roots of a quadratic equation
  'T09': 169, // Quadratic functions
  'T10': 170, // Equations reducible to quadratic equations
  'T11': 171, // Equation of a circle and the graph of a circle
  'T12': 172  // Simple interest, compound interest, and depreciation
};

export function generateGrade10NumberAlgebraQuestions() {
  console.log('🚀 Generating 400 Grade 10 Number & Algebra Questions (Topics 165 to 172)...');

  // Read Excel Seed File
  const excelPath = path.join(__dirname, '..', 'resources', 'Grade_10_Math_Questions.xlsx');
  const wb = xlsx.readFile(excelPath);
  const sheet = wb.Sheets['Number and Algebra (NA)'] || wb.Sheets['Number & Algebra (NA)'];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  // Group questions by Excel topic code
  const excelQuestions = {};
  rows.slice(4).forEach(r => {
    if (r && r.length >= 5 && typeof r[0] === 'string' && r[0].startsWith('T')) {
      const itemID = r[0].trim();
      const tCode = itemID.split('-')[0]; // T05, T06, ... T12
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

      let title = `[${qItem.itemID}] ${qItem.qText.substring(0, 45)}...`;
      let text = qItem.qText;
      let formula = '';
      let options = [];
      let correctAnswer = '';
      let hint = '';
      let steps = [];
      let difficulty = (qNum % 3) + 1;

      // Ensure custom SVG plot exists
      const imageUrl = generateGrade10NaSvg(dbTopicId, idx, { title: `${dbTopicTitle} #${qNum}` });
      const imageAlt = `Diagram for Grade 10 ${dbTopicTitle} question #${qNum}`;

      // ==========================================
      // TOPIC 165: Quadratic Inequalities
      // ==========================================
      if (dbTopicId === 165) {
        if (qNum === 1) {
          title = "Quadratic Inequality Standard Forms";
          text = "Define a quadratic inequality in one variable and write its standard forms using inequality symbols \\(>, <, \\ge, \\le\\).";
          formula = "ax^2 + bx + c > 0 \\quad (a \\neq 0)";
          correctAnswer = "ax² + bx + c > 0, ax² + bx + c < 0, ax² + bx + c ≥ 0, ax² + bx + c ≤ 0 (where a ≠ 0)";
          options = makeOptions(correctAnswer, "ax + b > 0, ax + b < 0", "ax² + bx + c = 0", "x² + y² > r²");
          hint = "A quadratic inequality has highest exponent 2 and a non-zero leading coefficient.";
          steps = ["**Step 1:** Define quadratic inequality standard form.", "$$ax^2 + bx + c > 0, \\; ax^2 + bx + c < 0, \\; ax^2 + bx + c \\ge 0, \\; ax^2 + bx + c \\le 0$$", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else if (qNum === 3) {
          title = "Solving Quadratic Inequality x² - 5x - 6 > 0";
          text = "Solve the quadratic inequality: \\(x^2 - 5x - 6 > 0\\). Express the solution set in interval notation.";
          formula = "(x - 6)(x + 1) > 0";
          correctAnswer = "(-∞, -1) ∪ (6, ∞)";
          options = makeOptions("(-∞, -1) ∪ (6, ∞)", "(-1, 6)", "[-1, 6]", "(-∞, 6)");
          hint = "Factor into \\((x - 6)(x + 1) > 0\\). Critical numbers are \\(x = -1\\) and \\(x = 6\\).";
          steps = ["**Step 1: Factor equation** - $$(x - 6)(x + 1) > 0$$", "**Step 2: Find critical points** - \\(x = -1, 6\\).", "**Step 3: Test intervals** - Expression is positive for \\(x < -1\\) or \\(x > 6\\).", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else if (qNum === 4) {
          title = "Solving Quadratic Inequality x² - 7x + 12 ≤ 0";
          text = "Solve the quadratic inequality: \\(x^2 - 7x + 12 \\le 0\\). Express the solution in interval notation.";
          formula = "(x - 3)(x - 4) \\le 0";
          correctAnswer = "[3, 4]";
          options = makeOptions("[3, 4]", "(3, 4)", "(-∞, 3] ∪ [4, ∞)", "[-4, -3]");
          hint = "Factor into \\((x - 3)(x - 4) \\le 0\\). Product is negative/zero between roots.";
          steps = ["**Step 1: Factor** - $$(x - 3)(x - 4) \\le 0$$", "**Step 2: Test sign chart** - Negative between \\(x = 3\\) and \\(x = 4\\).", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else if (qNum === 7) {
          title = "Solving Quadratic Inequality x² - 16 ≥ 0";
          text = "Solve the quadratic inequality: \\(x^2 - 16 \\ge 0\\).";
          formula = "(x - 4)(x + 4) \\ge 0";
          correctAnswer = "(-∞, -4] ∪ [4, ∞)";
          options = makeOptions("(-∞, -4] ∪ [4, ∞)", "[-4, 4]", "(-4, 4)", "[4, ∞)");
          hint = "Factor as difference of squares \\((x - 4)(x + 4) \\ge 0\\).";
          steps = ["**Step 1: Factor difference of squares**", "$$(x - 4)(x + 4) \\ge 0$$", "**Step 2: Determine outer intervals**", "$$x \\le -4 \\quad \\text{or} \\quad x \\ge 4$$", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else {
          const k1 = 1 + (qNum % 5);
          const k2 = 6 + (qNum % 6);
          const prod = k1 * k2;
          const sum = k1 + k2;

          title = `Quadratic Inequality #${qNum}`;
          text = `Solve the quadratic inequality: \\(x^2 - ${sum}x + ${prod} < 0\\).`;
          formula = `(x - ${k1})(x - ${k2}) < 0`;
          correctAnswer = `(${k1}, ${k2})`;
          options = makeOptions(`(${k1}, ${k2})`, `[${k1}, ${k2}]`, `(-∞, ${k1}) ∪ (${k2}, ∞)`, `(-${k2}, -${k1})`);
          hint = `Factor into (x - ${k1})(x - ${k2}) < 0. The solution is the interior interval between roots.`;
          steps = [
            `**Step 1: Factor polynomial** - $$(x - ${k1})(x - ${k2}) < 0$$`,
            `**Step 2: Identify critical roots** - \\(x = ${k1}\\) and \\(x = ${k2}\\).`,
            `**Step 3: Solution set** - $$${k1} < x < ${k2}$$`,
            `**Final Answer:** \\(${correctAnswer}\\)`
          ];
        }
      }

      // ==========================================
      // TOPIC 166: Absolute Value Equations & Inequalities
      // ==========================================
      else if (dbTopicId === 166) {
        if (qNum === 1) {
          title = "Absolute Value Definition & Distance";
          text = "Define the absolute value of a real number \\(|x|\\) algebraically and geometrically as a distance on the number line.";
          formula = "|x| = \\begin{cases} x & \\text{if } x \\ge 0 \\\\ -x & \\text{if } x < 0 \\end{cases}";
          correctAnswer = "|x| is the non-negative distance of x from 0 on the real number line.";
          options = makeOptions("|x| is the non-negative distance of x from 0 on the real number line.", "|x| is always negative.", "|x| represents the square root of x.", "|x| is undefined for negative numbers.");
          hint = "Geometrically, distance can never be negative.";
          steps = ["**Step 1:** State algebraic piecewise definition of \\(|x|\\).", "**Step 2:** Interpret geometrically as distance from 0.", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else if (qNum === 3) {
          title = "Solving |2x - 5| = 9";
          text = "Solve the absolute value equation: \\(|2x - 5| = 9\\).";
          formula = "2x - 5 = 9 \\quad \\text{or} \\quad 2x - 5 = -9";
          correctAnswer = "x = 7 or x = -2";
          options = makeOptions("x = 7 or x = -2", "x = 7 or x = 2", "x = -7 or x = -2", "x = 14 or x = -4");
          hint = "Split into two cases: \\(2x - 5 = 9\\) and \\(2x - 5 = -9\\).";
          steps = [
            "**Case 1:** $$2x - 5 = 9 \\implies 2x = 14 \\implies x = 7$$",
            "**Case 2:** $$2x - 5 = -9 \\implies 2x = -4 \\implies x = -2$$",
            `**Final Answer:** \\(${correctAnswer}\\)`
          ];
        } else if (qNum === 7) {
          title = "Absolute Value Equal to Negative Constant";
          text = "Explain why the absolute value equation \\(|3x - 8| = -5\\) has no real solution.";
          formula = "|3x - 8| \\ge 0 \\neq -5";
          correctAnswer = "No solution (absolute value output cannot be negative).";
          options = makeOptions("No solution (absolute value output cannot be negative).", "x = 1", "x = 13/3 or x = 1", "x = -1");
          hint = "Absolute value represents a non-negative distance.";
          steps = ["**Step 1:** Analyze left-hand side: \\(|3x - 8| \\ge 0\\) for all real \\(x\\).", "**Step 2:** Right-hand side is \\(-5 < 0\\), creating a contradiction.", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else if (qNum === 16) {
          title = "Solving Absolute Value Inequality |x - 4| < 7";
          text = "Solve the absolute value inequality: \\(|x - 4| < 7\\). Express the solution in interval notation.";
          formula = "-7 < x - 4 < 7";
          correctAnswer = "(-3, 11)";
          options = makeOptions("(-3, 11)", "[-3, 11]", "(-∞, -3) ∪ (11, ∞)", "(3, 11)");
          hint = "Use rule \\(|u| < a \\iff -a < u < a\\).";
          steps = ["**Step 1:** Rewrite compound inequality: $$-7 < x - 4 < 7$$", "**Step 2:** Add 4 to all parts: $$-3 < x < 11$$", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else {
          const aVal = 2 + (qNum % 4);
          const bVal = 3 + (qNum % 5);
          const cVal = 10 + (qNum % 10);
          const sol1 = ((cVal - bVal) / aVal).toFixed(2);
          const sol2 = ((-cVal - bVal) / aVal).toFixed(2);

          title = `Absolute Value Equation #${qNum}`;
          text = `Solve the absolute value equation: \\(|${aVal}x + ${bVal}| = ${cVal}\\).`;
          formula = `${aVal}x + ${bVal} = \\pm ${cVal}`;
          correctAnswer = `x = ${sol1} or x = ${sol2}`;
          options = makeOptions(`x = ${sol1} or x = ${sol2}`, `x = ${sol1}`, `x = ${sol2}`, `x = ${(parseFloat(sol1)+1).toFixed(2)}`);
          hint = "Split into two linear equations corresponding to positive and negative cases.";
          steps = [
            `**Case 1:** $$${aVal}x + ${bVal} = ${cVal} \\implies ${aVal}x = ${cVal - bVal} \\implies x = ${sol1}$$`,
            `**Case 2:** $$${aVal}x + ${bVal} = -${cVal} \\implies ${aVal}x = -${cVal + bVal} \\implies x = ${sol2}$$`,
            `**Final Answer:** \\(${correctAnswer}\\)`
          ];
        }
      }

      // ==========================================
      // TOPIC 167: Radical Expressions
      // ==========================================
      else if (dbTopicId === 167) {
        if (qNum === 1) {
          title = "Definition of Rational Exponents";
          text = "State the definition relating rational exponent \\(x^{m/n}\\) to radical form.";
          formula = "x^{m/n} = \\sqrt[n]{x^m} = (\\sqrt[n]{x})^m";
          correctAnswer = "x^(m/n) = ⁿ√(xᵐ) = (ⁿ√x)ᵐ";
          options = makeOptions("x^(m/n) = ⁿ√(xᵐ) = (ⁿ√x)ᵐ", "x^(m/n) = m √(xⁿ)", "x^(m/n) = xᵐ · xⁿ", "x^(m/n) = n / (m x)");
          hint = "The denominator \\(n\\) is the root index, and numerator \\(m\\) is the exponent power.";
          steps = ["**Step 1:** State relationship between exponential and radical forms.", "$$x^{m/n} = \\sqrt[n]{x^m} = (\\sqrt[n]{x})^m$$", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else if (qNum === 6) {
          title = "Simplifying Radical Expression √(72x⁵y⁶)";
          text = "Simplify the radical expression completely: \\(\\sqrt{72x^5y^6}\\) (assume all variables are positive).";
          formula = "\\sqrt{36 \\cdot 2 \\cdot x^4 \\cdot x \\cdot y^6} = 6x^2y^3\\sqrt{2x}";
          correctAnswer = "6x²y³√(2x)";
          options = makeOptions("6x²y³√(2x)", "36x²y³√(2x)", "6x⁴y⁶√(2x)", "12x²y³√(x)");
          hint = "Factor 72 into \\(36 \\times 2\\) and take out perfect square terms.";
          steps = ["**Step 1: Factor perfect square terms**", "$$\\sqrt{72x^5y^6} = \\sqrt{36x^4y^6 \\cdot 2x} = 6x^2y^3\\sqrt{2x}$$", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else if (qNum === 19) {
          title = "Rationalizing Denominator 6 / √3";
          text = "Rationalize the denominator of the expression: \\(\\frac{6}{\\sqrt{3}}\\).";
          formula = "\\frac{6}{\\sqrt{3}} \\cdot \\frac{\\sqrt{3}}{\\sqrt{3}} = \\frac{6\\sqrt{3}}{3} = 2\\sqrt{3}";
          correctAnswer = "2√3";
          options = makeOptions("2√3", "6√3", "3√3", "2");
          hint = "Multiply numerator and denominator by \\(\\sqrt{3}\\).";
          steps = ["**Step 1: Multiply numerator and denominator by √3**", "$$\\frac{6 \\cdot \\sqrt{3}}{\\sqrt{3} \\cdot \\sqrt{3}} = \\frac{6\\sqrt{3}}{3} = 2\\sqrt{3}$$", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else if (qNum === 28) {
          title = "Solving Radical Equation √(2x + 7) = 5";
          text = "Solve the radical equation: \\(\\sqrt{2x + 7} = 5\\).";
          formula = "2x + 7 = 25 \\implies 2x = 18 \\implies x = 9";
          correctAnswer = "x = 9";
          options = makeOptions("x = 9", "x = 16", "x = 5", "x = 12");
          hint = "Square both sides to eliminate the radical.";
          steps = ["**Step 1: Square both sides**", "$$2x + 7 = 5^2 = 25$$", "**Step 2: Solve linear equation**", "$$2x = 18 \\implies x = 9$$", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else {
          const valN = 4 + (qNum % 8);
          const sqVal = valN * valN;
          const coeff = 2 + (qNum % 4);
          const res = (coeff * valN);

          title = `Radical Expression Simplification #${qNum}`;
          text = `Simplify the expression: \\(${coeff}\\sqrt{${sqVal}}\\).`;
          formula = `${coeff} \\cdot ${valN} = ${res}`;
          correctAnswer = `${res}`;
          options = makeOptions(`${res}`, `${res + 4}`, `${coeff * sqVal}`, `${valN}`);
          hint = "Evaluate the principal square root first.";
          steps = [
            `**Step 1: Evaluate square root** - $$\\sqrt{${sqVal}} = ${valN}$$`,
            `**Step 2: Multiply by coefficient** - $$${coeff} \\times ${valN} = ${res}$$`,
            `**Final Answer:** \\(${correctAnswer}\\)`
          ];
        }
      }

      // ==========================================
      // TOPIC 168: Roots of Quadratic Equations
      // ==========================================
      else if (dbTopicId === 168) {
        if (qNum === 1) {
          title = "Discriminant Definition";
          text = "State the general quadratic equation \\(ax^2 + bx + c = 0\\) and define the discriminant formula \\(D\\).";
          formula = "D = b^2 - 4ac";
          correctAnswer = "D = b² - 4ac";
          options = makeOptions("D = b² - 4ac", "D = b² + 4ac", "D = √(b² - 4ac)", "D = -b / (2a)");
          hint = "The discriminant is the expression inside the radical of the quadratic formula.";
          steps = ["**Step 1:** State discriminant equation.", "$$D = b^2 - 4ac$$", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else if (qNum === 3) {
          title = "Discriminant Evaluation x² - 6x + 9 = 0";
          text = "Determine the discriminant and describe the nature of the roots for \\(x^2 - 6x + 9 = 0\\).";
          formula = "D = (-6)^2 - 4(1)(9) = 36 - 36 = 0";
          correctAnswer = "D = 0 (One real repeated root)";
          options = makeOptions("D = 0 (One real repeated root)", "D = 72 (Two distinct real roots)", "D = -36 (Two complex roots)", "D = 12 (Two irrational roots)");
          hint = "Substitute \\(a=1, b=-6, c=9\\) into \\(b^2 - 4ac\\).";
          steps = ["**Step 1: Compute D** - $$D = (-6)^2 - 4(1)(9) = 36 - 36 = 0$$", "**Step 2: Interpret D=0** - Exactly one real (repeated) root.", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else if (qNum === 11) {
          title = "Vieta's Formulas for Quadratic Equation";
          text = "State Vieta's formulas for the sum \\(r_1 + r_2\\) and product \\(r_1 r_2\\) of the roots of \\(ax^2 + bx + c = 0\\).";
          formula = "r_1 + r_2 = -\\frac{b}{a}, \\quad r_1 r_2 = \\frac{c}{a}";
          correctAnswer = "Sum = -b/a, Product = c/a";
          options = makeOptions("Sum = -b/a, Product = c/a", "Sum = b/a, Product = -c/a", "Sum = -c/a, Product = b/a", "Sum = b² - 4ac, Product = 2a");
          hint = "Sum of roots is \\(-b/a\\), product of roots is \\(c/a\\).";
          steps = ["**Step 1:** Write Vieta's formulas.", "$$r_1 + r_2 = -\\frac{b}{a}, \\quad r_1 r_2 = \\frac{c}{a}$$", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else if (qNum === 14) {
          title = "Forming Quadratic Equation from Integer Roots";
          text = "Form a quadratic equation in standard form with integer coefficients whose roots are \\(5\\) and \\(-8\\).";
          formula = "(x - 5)(x + 8) = x^2 + 3x - 40 = 0";
          correctAnswer = "x² + 3x - 40 = 0";
          options = makeOptions("x² + 3x - 40 = 0", "x² - 3x - 40 = 0", "x² + 13x - 40 = 0", "x² - 13x + 40 = 0");
          hint = "Use \\(x^2 - (r_1 + r_2)x + r_1 r_2 = 0\\). Sum is \\(-3\\), product is \\(-40\\).";
          steps = ["**Step 1: Calculate Sum & Product** - $$Sum = 5 + (-8) = -3, \\quad Product = 5(-8) = -40$$", "**Step 2: Form equation** - $$x^2 - (-3)x + (-40) = x^2 + 3x - 40 = 0$$", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else {
          const r1 = 1 + (qNum % 6);
          const r2 = 2 + (qNum % 5);
          const sVal = r1 + r2;
          const pVal = r1 * r2;

          title = `Vieta Sum and Product #${qNum}`;
          text = `For the quadratic equation \\(x^2 - ${sVal}x + ${pVal} = 0\\), determine the sum and product of its roots.`;
          formula = `r_1 + r_2 = ${sVal}, \\quad r_1 r_2 = ${pVal}`;
          correctAnswer = `Sum = ${sVal}, Product = ${pVal}`;
          options = makeOptions(`Sum = ${sVal}, Product = ${pVal}`, `Sum = -${sVal}, Product = ${pVal}`, `Sum = ${pVal}, Product = ${sVal}`, `Sum = 0, Product = ${pVal}`);
          hint = "Sum = -b/a, Product = c/a.";
          steps = [
            `**Step 1:** Identify \\(a=1, b=-${sVal}, c=${pVal}\\).`,
            `**Step 2:** Calculate sum = \\(-(-${sVal})/1 = ${sVal}\\), product = \\(${pVal}/1 = ${pVal}\\).`,
            `**Final Answer:** \\(${correctAnswer}\\)`
          ];
        }
      }

      // ==========================================
      // TOPIC 169: Quadratic Functions
      // ==========================================
      else if (dbTopicId === 169) {
        if (qNum === 8) {
          title = "Converting Standard Form to Vertex Form";
          text = "Convert the standard form quadratic function \\(f(x) = 2x^2 - 12x + 11\\) into vertex form \\(f(x) = a(x - h)^2 + k\\).";
          formula = "f(x) = 2(x - 3)^2 - 7";
          correctAnswer = "f(x) = 2(x - 3)² - 7";
          options = makeOptions("f(x) = 2(x - 3)² - 7", "f(x) = 2(x - 6)² + 11", "f(x) = (x - 3)² - 7", "f(x) = 2(x + 3)² - 7");
          hint = "Complete the square: \\(h = -b/(2a) = 12/4 = 3\\).";
          steps = ["**Step 1: Compute h and k** - $$h = \\frac{12}{4} = 3, \\quad k = f(3) = 2(9) - 36 + 11 = -7$$", "**Step 2: Write vertex form** - $$f(x) = 2(x - 3)^2 - 7$$", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else if (qNum === 10) {
          title = "Vertex & Axis of Symmetry f(x) = -4x² + 16x - 7";
          text = "Find the axis of symmetry, vertex coordinates, and opening direction of \\(f(x) = -4x^2 + 16x - 7\\).";
          formula = "h = \\frac{-16}{2(-4)} = 2, \\quad k = -4(4) + 32 - 7 = 9";
          correctAnswer = "Axis: x = 2, Vertex: (2, 9), Opens Downward";
          options = makeOptions("Axis: x = 2, Vertex: (2, 9), Opens Downward", "Axis: x = -2, Vertex: (-2, 9), Opens Upward", "Axis: x = 4, Vertex: (4, -7), Opens Downward", "Axis: x = 2, Vertex: (2, -7), Opens Upward");
          hint = "Since \\(a = -4 < 0\\), parabola opens downward. Axis is \\(x = h = 2\\).";
          steps = ["**Step 1: Find vertex x-coord** - $$h = \\frac{-16}{-8} = 2$$", "**Step 2: Find vertex y-coord** - $$k = f(2) = -16 + 32 - 7 = 9$$", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else if (qNum === 15) {
          title = "Maximizing Revenue Quadratic Function";
          text = "A revenue function from selling \\(x\\) items is \\(R(x) = -2x^2 + 120x\\). Find the number of items \\(x\\) that maximizes revenue and calculate the maximum revenue.";
          formula = "x = \\frac{-120}{2(-2)} = 30, \\quad R(30) = -2(900) + 3600 = 1800";
          correctAnswer = "x = 30 items, Maximum Revenue = ₱1,800";
          options = makeOptions("x = 30 items, Maximum Revenue = ₱1,800", "x = 60 items, Maximum Revenue = ₱3,600", "x = 30 items, Maximum Revenue = ₱3,600", "x = 15 items, Maximum Revenue = ₱1,800");
          hint = "The maximum occurs at the vertex x-coordinate \\(x = -b/(2a)\\).";
          steps = ["**Step 1: Find vertex x-value** - $$x = \\frac{-120}{-4} = 30$$", "**Step 2: Calculate max revenue** - $$R(30) = -2(30^2) + 120(30) = -1800 + 3600 = 1800$$", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else {
          const h = 1 + (qNum % 5);
          const k = 2 + (qNum % 6);

          title = `Parabola Vertex Form #${qNum}`;
          text = `Determine the vertex coordinates of the quadratic function \\(f(x) = (x - ${h})^2 + ${k}\\).`;
          formula = "Vertex = (h, k)";
          correctAnswer = `(${h}, ${k})`;
          options = makeOptions(`(${h}, ${k})`, `(-${h}, ${k})`, `(${h}, -${k})`, `(${k}, ${h})`);
          hint = "In vertex form f(x) = a(x - h)² + k, the vertex is at (h, k).";
          steps = [
            `**Step 1:** Read values directly from vertex form: \\(h = ${h}\\), \\(k = ${k}\\).`,
            `**Final Answer:** \\(${correctAnswer}\\)`
          ];
        }
      }

      // ==========================================
      // TOPIC 170: Equations Reducible to Quadratic Equations
      // ==========================================
      else if (dbTopicId === 170) {
        if (qNum === 2) {
          title = "Solving Biquadratic Equation x⁴ - 13x² + 36 = 0";
          text = "Solve the biquadratic equation: \\(x^4 - 13x^2 + 36 = 0\\).";
          formula = "(x^2 - 4)(x^2 - 9) = 0";
          correctAnswer = "x = ±2, ±3";
          options = makeOptions("x = ±2, ±3", "x = 2, 3", "x = ±4, ±9", "x = ±1, ±6");
          hint = "Substitute \\(u = x^2\\) to form quadratic equation \\(u^2 - 13u + 36 = 0\\).";
          steps = ["**Step 1: Substitute u = x²** - $$u^2 - 13u + 36 = 0 \\implies (u - 4)(u - 9) = 0$$", "**Step 2: Solve for x** - $$x^2 = 4 \\implies x = \\pm 2, \\quad x^2 = 9 \\implies x = \\pm 3$$", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else if (qNum === 10) {
          title = "Solving Rational Equation x + (12 / x) = 7";
          text = "Solve the rational equation reducible to quadratic form: \\(x + \\frac{12}{x} = 7\\).";
          formula = "x^2 - 7x + 12 = 0 \\implies (x - 3)(x - 4) = 0";
          correctAnswer = "x = 3 or x = 4";
          options = makeOptions("x = 3 or x = 4", "x = -3 or x = -4", "x = 2 or x = 6", "x = 1 or x = 12");
          hint = "Multiply through by \\(x\\) to clear the fraction.";
          steps = ["**Step 1: Multiply by x** - $$x^2 + 12 = 7x \\implies x^2 - 7x + 12 = 0$$", "**Step 2: Factor** - $$(x - 3)(x - 4) = 0 \\implies x = 3 \\text{ or } x = 4$$", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else if (qNum === 21) {
          title = "Radical Reducible Equation x - 5√x + 6 = 0";
          text = "Solve the radical equation reducible to quadratic form: \\(x - 5\\sqrt{x} + 6 = 0\\).";
          formula = "u = \\sqrt{x} \\implies u^2 - 5u + 6 = 0";
          correctAnswer = "x = 4 or x = 9";
          options = makeOptions("x = 4 or x = 9", "x = 2 or x = 3", "x = 16 or x = 81", "x = -2 or x = -3");
          hint = "Let \\(u = \\sqrt{x}\\), so \\(u^2 = x\\).";
          steps = ["**Step 1: Substitute u = √x** - $$u^2 - 5u + 6 = 0 \\implies (u - 2)(u - 3) = 0$$", "**Step 2: Solve for x** - $$\\sqrt{x} = 2 \\implies x = 4, \\quad \\sqrt{x} = 3 \\implies x = 9$$", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else {
          const u1 = 1 + (qNum % 4);
          const u2 = 4 + (qNum % 5);
          const sq1 = u1 * u1;
          const sq2 = u2 * u2;
          const sumU = sq1 + sq2;
          const prodU = sq1 * sq2;

          title = `Biquadratic Equation #${qNum}`;
          text = `Solve the biquadratic equation: \\(x^4 - ${sumU}x^2 + ${prodU} = 0\\).`;
          formula = `(x^2 - ${sq1})(x^2 - ${sq2}) = 0`;
          correctAnswer = `x = ±${u1}, ±${u2}`;
          options = makeOptions(`x = ±${u1}, ±${u2}`, `x = ${u1}, ${u2}`, `x = ±${sq1}, ±${sq2}`, `x = 0`);
          hint = "Let u = x^2, solve the quadratic for u, then take square roots.";
          steps = [
            `**Step 1: Substitute u = x²** - $$u^2 - ${sumU}u + ${prodU} = 0$$`,
            `**Step 2: Factor** - $$(u - ${sq1})(u - ${sq2}) = 0 \\implies u = ${sq1}, ${sq2}$$`,
            `**Step 3: Solve for x** - $$x = \\pm ${u1}, \\quad x = \\pm ${u2}$$`,
            `**Final Answer:** \\(${correctAnswer}\\)`
          ];
        }
      }

      // ==========================================
      // TOPIC 171: Equation of a Circle & Graph
      // ==========================================
      else if (dbTopicId === 171) {
        if (qNum === 2) {
          title = "Standard Center-Radius Form of Circle";
          text = "State the standard center-radius form of the equation of a circle with center \\(C(h, k)\\) and radius \\(r\\).";
          formula = "(x - h)^2 + (y - k)^2 = r^2";
          correctAnswer = "(x - h)² + (y - k)² = r²";
          options = makeOptions("(x - h)² + (y - k)² = r²", "(x + h)² + (y + k)² = r²", "(x - h)² - (y - k)² = r²", "x² + y² = r");
          hint = "Based on Pythagorean theorem distance formula between \\((x, y)\\) and \\((h, k)\\).";
          steps = ["**Step 1:** Write standard circle equation.", "$$(x - h)^2 + (y - k)^2 = r^2$$", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else if (qNum === 5) {
          title = "Circle Equation C(3, -5) and r = 4";
          text = "Write the standard equation of a circle with center \\(C(3, -5)\\) and radius \\(r = 4\\).";
          formula = "(x - 3)^2 + (y + 5)^2 = 16";
          correctAnswer = "(x - 3)² + (y + 5)² = 16";
          options = makeOptions("(x - 3)² + (y + 5)² = 16", "(x + 3)² + (y - 5)² = 16", "(x - 3)² + (y + 5)² = 4", "(x - 3)² - (y + 5)² = 16");
          hint = "Substitute \\(h=3, k=-5, r=4\\) into \\((x - h)^2 + (y - k)^2 = r^2\\).";
          steps = ["**Step 1: Substitute parameters**", "$$(x - 3)^2 + (y - (-5))^2 = 4^2 \\implies (x - 3)^2 + (y + 5)^2 = 16$$", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else if (qNum === 7) {
          title = "Extracting Center and Radius from (x-6)² + (y+1)² = 49";
          text = "Determine the center \\((h, k)\\) and radius \\(r\\) of the circle: \\((x - 6)^2 + (y + 1)^2 = 49\\).";
          formula = "h = 6, \\quad k = -1, \\quad r = \\sqrt{49} = 7";
          correctAnswer = "Center = (6, -1), Radius = 7";
          options = makeOptions("Center = (6, -1), Radius = 7", "Center = (-6, 1), Radius = 49", "Center = (6, -1), Radius = 49", "Center = (-6, -1), Radius = 7");
          hint = "Compare with \\((x - h)^2 + (y - k)^2 = r^2\\).";
          steps = ["**Step 1: Identify h, k, r** - $$h = 6, \\quad k = -1, \\quad r = \\sqrt{49} = 7$$", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else {
          const hVal = -4 + (qNum % 9);
          const kVal = -3 + (qNum % 8);
          const rVal = 2 + (qNum % 6);
          const rSq = rVal * rVal;

          title = `Circle Equation Identification #${qNum}`;
          text = `Find the center and radius of the circle given by: \\((x ${hVal >= 0 ? '- ' + hVal : '+ ' + Math.abs(hVal)})^2 + (y ${kVal >= 0 ? '- ' + kVal : '+ ' + Math.abs(kVal)})^2 = ${rSq}\\).`;
          formula = `Center = (${hVal}, ${kVal}), \\quad Radius = ${rVal}`;
          correctAnswer = `Center = (${hVal}, ${kVal}), Radius = ${rVal}`;
          options = makeOptions(`Center = (${hVal}, ${kVal}), Radius = ${rVal}`, `Center = (${-hVal}, ${-kVal}), Radius = ${rSq}`, `Center = (${hVal}, ${kVal}), Radius = ${rSq}`, `Center = (0, 0), Radius = ${rVal}`);
          hint = "Match signs with (x - h)² + (y - k)² = r².";
          steps = [
            `**Step 1:** Extract \\(h = ${hVal}\\), \\(k = ${kVal}\\).`,
            `**Step 2:** Compute \\(r = \\sqrt{${rSq}} = ${rVal}\\).`,
            `**Final Answer:** \\(${correctAnswer}\\)`
          ];
        }
      }

      // ==========================================
      // TOPIC 172: Simple & Compound Interest & Depreciation
      // ==========================================
      else if (dbTopicId === 172) {
        if (qNum === 1) {
          title = "Simple Interest Formula";
          text = "Define simple interest and state its formula \\(I = P \\cdot r \\cdot t\\), explaining each variable.";
          formula = "I = P \\cdot r \\cdot t";
          correctAnswer = "I = Prt (I = Interest, P = Principal, r = annual rate, t = time in years)";
          options = makeOptions("I = Prt (I = Interest, P = Principal, r = annual rate, t = time in years)", "I = P(1+r)^t", "I = P / (rt)", "I = P + r + t");
          hint = "Simple interest is calculated solely on the initial principal balance.";
          steps = ["**Step 1:** State simple interest formula.", "$$I = P \\cdot r \\cdot t$$", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else if (qNum === 2) {
          title = "Simple Interest & Maturity Value Calculation";
          text = "Calculate the simple interest and maturity value on a principal of \\(\\text{P}45,000\\) invested at an annual interest rate of \\(6\\%\\) for \\(3\\) years.";
          formula = "I = 45000 \\cdot 0.06 \\cdot 3 = 8100, \\quad A = 45000 + 8100 = 53100";
          correctAnswer = "Interest = ₱8,100, Maturity Value = ₱53,100";
          options = makeOptions("Interest = ₱8,100, Maturity Value = ₱53,100", "Interest = ₱2,700, Maturity Value = ₱47,700", "Interest = ₱8,100, Maturity Value = ₱45,000", "Interest = ₱9,500, Maturity Value = ₱54,500");
          hint = "Calculate \\(I = 45000 \\times 0.06 \\times 3\\) and add to principal.";
          steps = [
            "**Step 1: Calculate Interest** - $$I = 45000 \\cdot 0.06 \\cdot 3 = 8100$$",
            "**Step 2: Calculate Maturity Value** - $$A = 45000 + 8100 = 53100$$",
            `**Final Answer:** \\(${correctAnswer}\\)`
          ];
        } else if (qNum === 6) {
          title = "Compound Interest Formula";
          text = "State the compound interest formula for compounding \\(m\\) times per year.";
          formula = "A = P\\left(1 + \\frac{r}{m}\\right)^{m t}";
          correctAnswer = "A = P(1 + r/m)^(mt)";
          options = makeOptions("A = P(1 + r/m)^(mt)", "A = P(1 + rt)", "A = P(1 + r)^m", "A = P(r/m)^t");
          hint = "Interest rate per period is \\(r/m\\) and total periods is \\(m \\cdot t\\).";
          steps = ["**Step 1:** Write compound interest formula.", "$$A = P\\left(1 + \\frac{r}{m}\\right)^{mt}$$", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else if (qNum === 21) {
          title = "Reducing-Balance Depreciation Formula";
          text = "State the reducing-balance (declining balance) depreciation formula for book value \\(V(t)\\) after \\(t\\) years at rate \\(r\\).";
          formula = "V(t) = P(1 - r)^t";
          correctAnswer = "V(t) = P(1 - r)^t";
          options = makeOptions("V(t) = P(1 - r)^t", "V(t) = P(1 + r)^t", "V(t) = P - rt", "V(t) = P / (1 - r)^t");
          hint = "Decay/depreciation subtracts the rate \\(r\\) from 1.";
          steps = ["**Step 1:** State declining balance depreciation formula.", "$$V(t) = P(1 - r)^t$$", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else {
          const pVal = 10000 * (1 + (qNum % 10));
          const rPct = 4 + (qNum % 6);
          const tYears = 2 + (qNum % 5);
          const simpleI = (pVal * (rPct / 100) * tYears).toFixed(2);
          const totalVal = (pVal + parseFloat(simpleI)).toFixed(2);

          title = `Simple Interest Calculation #${qNum}`;
          text = `Calculate the simple interest earned on a principal of \\(\\text{P}${pVal.toLocaleString()}\\) invested at \\(${rPct}\\%\\) per year for \\(${tYears}\\) years.`;
          formula = `I = ${pVal} \\cdot ${(rPct/100)} \\cdot ${tYears}`;
          correctAnswer = `₱${parseFloat(simpleI).toLocaleString()}`;
          options = makeOptions(`₱${parseFloat(simpleI).toLocaleString()}`, `₱${(parseFloat(simpleI)*1.2).toLocaleString()}`, `₱${(pVal/10).toLocaleString()}`, `₱${(parseFloat(simpleI)*0.8).toLocaleString()}`);
          hint = "Use I = P * r * t.";
          steps = [
            `**Step 1: Apply formula I = Prt**`,
            `$$I = ${pVal} \\times ${(rPct/100)} \\times ${tYears} = ${simpleI}$$`,
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

  console.log(`✅ Successfully inserted ${totalGenerated} Grade 10 NA questions into SQLite DB!`);

  // Sync to Excel Question Bank
  const excelOut = path.join(__dirname, '..', 'questions_bank.xlsx');
  exportQuestionsToExcel(db, excelOut);

  console.log('🎉 Grade 10 Number & Algebra processing complete!');
}

generateGrade10NumberAlgebraQuestions();
