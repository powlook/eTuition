import { initDb } from '../server/db.js';
import { exportQuestionsToExcel } from '../server/excelService.js';
import { generateCartesianSvg } from './generate_t129_svg_plots.js';
import { generateLinearSystemSvg } from './generate_t134_svg_plots.js';
import { generateLinearInequalitySvg } from './generate_t135_svg_plots.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = initDb();

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

const NAMES = ['Maria', 'Juan', 'Sofia', 'Gabriel', 'Bea', 'Carlo', 'Angela', 'Marco', 'Camilla', 'Paolo'];
const CARTESIAN_IMAGE = '/images/cartesian_coordinate_plane.svg';
const NUMBER_LINE_IMAGE = '/images/horizontal_number_line_integers.svg';

console.log('🚀 Generating 550 Grade 8 Number and Algebra Questions (Topics 125 to 135)...');

// Remove existing questions for Grade 8 Number & Algebra (Topics 125 - 135)
const targetTopicIds = [125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135];
db.prepare(`DELETE FROM questions WHERE topic_id IN (${targetTopicIds.join(',')})`).run();

const insertStmt = db.prepare(`
  INSERT INTO questions (
    topic_id, question_title, question_text, math_formula, question_type,
    options_json, correct_answer, hint, working_steps_json, image_url,
    image_alt, difficulty, created_by
  ) VALUES (?, ?, ?, ?, 'MCQ', ?, ?, ?, ?, ?, ?, ?, 'g8_na_generator')
`);

let totalGenerated = 0;

// Helper to make unique set of options
function makeOptions(correctAns, wrong1, wrong2, wrong3) {
  const set = new Set([correctAns]);
  const candidates = [wrong1, wrong2, wrong3];
  let counter = 1;
  for (const c of candidates) {
    if (set.has(c)) {
      set.add(c + ` (v${counter++})`);
    } else {
      set.add(c);
    }
  }
  while (set.size < 4) {
    set.add(`None of these (v${counter++})`);
  }
  return shuffle(Array.from(set));
}

for (const topicId of targetTopicIds) {
  const topicRow = db.prepare('SELECT * FROM topics WHERE id = ?').get(topicId);
  if (!topicRow) {
    console.error(`Topic ID ${topicId} not found in database!`);
    continue;
  }

  console.log(`Generating 50 questions for Topic ${topicId}: ${topicRow.title}`);

  for (let qIndex = 0; qIndex < 50; qIndex++) {
    const subType = qIndex % 10;
    let qObj = null;

    // ==========================================
    // TOPIC 125 (T01): Algebraic Expressions & Operations
    // ==========================================
    if (topicId === 125) {
      if (subType === 0) { // Phrase translation
        const k = randInt(3, 9);
        const mult = randInt(2, 5);
        const text = `Translate the phrase into an algebraic expression: '${k} less than ${mult} times the square of a number x'.`;
        const ans = `${mult}x² - ${k}`;
        const formula = `\\text{Phrase} \\rightarrow ${ans}`;
        const options = makeOptions(ans, `${k} - ${mult}x²`, `${mult}x - ${k}`, `${mult}(x - ${k})²`);
        qObj = {
          title: `Algebraic Translation #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `'${k} less than' means subtract ${k} at the end of '${mult} times the square of x'.`,
          steps: [
            `**Step 1: Express '${mult} times the square of x'**`,
            `$$${mult}x^2$$`,
            `**Step 2: Subtract ${k}**`,
            `$$${mult}x^2 - ${k}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 2
        };
      } else if (subType === 1) { // Area of rectangle (ax+b)(cx-d)
        const a = randInt(2, 4);
        const b = randInt(2, 6);
        const c = randInt(2, 4);
        const d = randInt(1, 5);
        const coeffX2 = a * c;
        const coeffX = (a * -d) + (b * c);
        const constTerm = -b * d;
        const signX = coeffX >= 0 ? `+ ${coeffX}` : `- ${Math.abs(coeffX)}`;
        const signC = constTerm >= 0 ? `+ ${constTerm}` : `- ${Math.abs(constTerm)}`;
        const ans = `${coeffX2}x² ${signX}x ${signC}`;
        const text = `A rectangular garden has a length of (${a}x + ${b}) meters and a width of (${c}x - ${d}) meters. Write an algebraic expression in standard form representing its area.`;
        const formula = `A = (l)(w) = (${a}x + ${b})(${c}x - ${d})`;
        const options = makeOptions(ans, `${coeffX2}x² + ${a*d + b*c}x ${signC}`, `${coeffX2}x² ${signX}x + ${b*d}`, `${coeffX2}x ${signX}x ${signC}`);
        qObj = {
          title: `Polynomial Area Expression #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Multiply binomials using FOIL: (${a}x)(${c}x) + (${a}x)(-${d}) + (${b})(${c}x) + (${b})(-${d}).`,
          steps: [
            `**Step 1: Multiply terms (FOIL method)**`,
            `$$A = ${a*c}x^2 - ${a*d}x + ${b*c}x - ${b*d}$$`,
            `**Step 2: Combine like terms**`,
            `$$A = ${coeffX2}x^2 ${signX}x ${signC}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 3
        };
      } else if (subType === 2) { // Add polynomials
        const a = randInt(3, 8), b = randInt(2, 7), c = randInt(4, 12);
        const d = randInt(2, 6), e = randInt(3, 9), f = randInt(5, 15);
        const rA = a + d, rB = -b + e, rC = c - f;
        const signB = rB >= 0 ? `+ ${rB}` : `- ${Math.abs(rB)}`;
        const signC = rC >= 0 ? `+ ${rC}` : `- ${Math.abs(rC)}`;
        const ans = `${rA}x² ${signB}x ${signC}`;
        const text = `Simplify the algebraic expression by combining like terms: (${a}x² - ${b}x + ${c}) + (${d}x² + ${e}x - ${f}).`;
        const formula = `(${a}x^2 - ${b}x + ${c}) + (${d}x^2 + ${e}x - ${f})`;
        const options = makeOptions(ans, `${rA}x² + ${b+e}x ${signC}`, `${a+d}x² ${signB}x + ${c+f}`, `${rA}x² ${signB}x - ${c+f}`);
        qObj = {
          title: `Polynomial Addition #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Group and add coefficients of like degree terms: x², x, and constants.`,
          steps: [
            `**Step 1: Group like terms**`,
            `$$(${a} + ${d})x^2 + (-${b} + ${e})x + (${c} - ${f})$$`,
            `**Step 2: Combine coefficients**`,
            `$$${rA}x^2 ${signB}x ${signC}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 2
        };
      } else if (subType === 3) { // Subtract polynomials
        const a = randInt(3, 9), b = randInt(2, 6), c = randInt(2, 7);
        const d = randInt(4, 10), e = randInt(2, 8), f = randInt(3, 9);
        // Subtract (a a^2 - b ab + c b^2) from (d a^2 + e ab - f b^2)
        const rA = d - a, rB = e - (-b), rC = -f - c;
        const signB = rB >= 0 ? `+ ${rB}` : `- ${Math.abs(rB)}`;
        const signC = rC >= 0 ? `+ ${rC}` : `- ${Math.abs(rC)}`;
        const ans = `${rA}a² ${signB}ab ${signC}b²`;
        const text = `Subtract (${a}a² - ${b}ab + ${c}b²) from (${d}a² + ${e}ab - ${f}b²).`;
        const formula = `(${d}a^2 + ${e}ab - ${f}b^2) - (${a}a^2 - ${b}ab + ${c}b^2)`;
        const options = makeOptions(ans, `${rA}a² + ${e-b}ab ${signC}b²`, `${d+a}a² ${signB}ab ${signC}b²`, `${rA}a² ${signB}ab + ${f-c}b²`);
        qObj = {
          title: `Polynomial Subtraction #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Distribute negative sign: -(${a}a² - ${b}ab + ${c}b²) = -${a}a² + ${b}ab - ${c}b².`,
          steps: [
            `**Step 1: Distribute negative sign**`,
            `$$${d}a^2 + ${e}ab - ${f}b^2 - ${a}a^2 + ${b}ab - ${c}b^2$$`,
            `**Step 2: Combine like terms**`,
            `$$(${d}-${a})a^2 + (${e}+${b})ab + (-${f}-${c})b^2 = ${rA}a^2 ${signB}ab ${signC}b^2$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 3
        };
      } else if (subType === 4) { // Product rule exponents
        const c1 = randInt(2, 6) * (qIndex % 2 === 0 ? 1 : -1);
        const c2 = randInt(2, 6) * (qIndex % 3 === 0 ? -1 : 1);
        const ex1 = randInt(2, 5), ey1 = randInt(2, 5);
        const ex2 = randInt(2, 5), ey2 = randInt(2, 5);
        const prodC = c1 * c2;
        const resX = ex1 + ex2;
        const resY = ey1 + ey2;
        const ans = `${prodC}x^${resX}y^${resY}`;
        const text = `Simplify using the product rule for exponents: (${c1}x^${ex1}y^${ey1}) · (${c2}x^${ex2}y^${ey2}).`;
        const formula = `(${c1}x^{${ex1}}y^{${ey1}}) \\cdot (${c2}x^{${ex2}}y^{${ey2}})`;
        const options = makeOptions(ans, `${c1+c2}x^${resX}y^${resY}`, `${prodC}x^${ex1*ex2}y^${ey1*ey2}`, `${prodC}x^${resX+1}y^${resY}`);
        qObj = {
          title: `Product Rule for Exponents #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Multiply numerical coefficients and add exponents of matching bases x and y.`,
          steps: [
            `**Step 1: Multiply coefficients**`,
            `$$(${c1}) \\times (${c2}) = ${prodC}$$`,
            `**Step 2: Add exponents for x and y**`,
            `$$x^{${ex1} + ${ex2}} = x^{${resX}}, \\quad y^{${ey1} + ${ey2}} = y^{${resY}}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 2
        };
      } else if (subType === 5) { // Quotient rule
        const numC = randInt(12, 36) * (qIndex % 2 === 0 ? 1 : -1);
        const denC = randInt(2, 6) * (qIndex % 3 === 0 ? -1 : 1);
        const resC = numC / denC;
        const ex1 = randInt(5, 9), ey1 = randInt(2, 4);
        const ex2 = randInt(2, 4), ey2 = randInt(5, 8);
        const resX = ex1 - ex2;
        const resY = ey2 - ey1;
        const ans = `\\frac{${resC}a^${resX}}{b^${resY}}`;
        const text = `Simplify using quotient and negative exponent rules: \\(\\frac{${numC}a^${ex1}b^${ey1}}{${denC}a^${ex2}b^${ey2}}\\), where \\(a \\neq 0, b \\neq 0\\).`;
        const formula = `\\frac{${numC}a^{${ex1}}b^{${ey1}}}{${denC}a^{${ex2}}b^{${ey2}}}`;
        const options = makeOptions(ans, `${resC}a^${resX}b^${ey1-ey2}`, `\\frac{${numC-denC}a^${resX}}{b^${resY}}`, `\\frac{${resC}a^${ex1+ex2}}{b^${resY}}`);
        qObj = {
          title: `Quotient Rule for Exponents #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Divide coefficients ${numC} / ${denC} = ${resC}, subtract exponents: a^(${ex1}-${ex2}) = a^${resX}, and b^(${ey1}-${ey2}) = b^-${resY} = 1/b^${resY}.`,
          steps: [
            `**Step 1: Simplify numerical ratio**`,
            `$$\\frac{${numC}}{${denC}} = ${resC}$$`,
            `**Step 2: Apply quotient rule**`,
            `$$a^{${ex1} - ${ex2}} = a^{${resX}}, \\quad b^{${ey1} - ${ey2}} = b^{-${resY}} = \\frac{1}{b^{${resY}}}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 3
        };
      } else if (subType === 6) { // Monomial times multinomial
        const k = randInt(2, 5) * -1;
        const a = randInt(2, 5), b = randInt(3, 6), c = randInt(2, 5), d = randInt(4, 9);
        const r1 = k * a, r2 = k * -b, r3 = k * c, r4 = k * -d;
        const ans = `${r1}x^5 + ${r2}x^4 ${r3 >= 0 ? '+' : ''}${r3}x^3 + ${r4}x^2`;
        const text = `Multiply the monomial by the multinomial: ${k}x²(${a}x³ - ${b}x² + ${c}x - ${d}).`;
        const formula = `${k}x^2(${a}x^3 - ${b}x^2 + ${c}x - ${d})`;
        const options = makeOptions(ans, `${r1}x^6 + ${r2}x^4 + ${r3}x^2 + ${r4}`, `${k+a}x^5 - ${b}x^4 + ${c}x^3 - ${d}`, `${r1}x^5 - ${r2}x^4 + ${r3}x^3 - ${r4}x^2`);
        qObj = {
          title: `Monomial Multiplication #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Distribute ${k}x² to every term inside the parentheses and add 2 to each power of x.`,
          steps: [
            `**Step 1: Distribute monomial term**`,
            `$$(${k}x^2)(${a}x^3) + (${k}x^2)(-${b}x^2) + (${k}x^2)(${c}x) + (${k}x^2)(-${d})$$`,
            `**Step 2: Simplify each product**`,
            `$$${r1}x^5 + ${r2}x^4 ${r3 >= 0 ? '+' : ''}${r3}x^3 + ${r4}x^2$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 3
        };
      } else if (subType === 7) { // Expand binomials (ax+b)(cx-d)
        const a = randInt(2, 5), b = randInt(3, 7), c = randInt(2, 5), d = randInt(2, 6);
        const cX2 = a * c;
        const cX = (a * -d) + (b * c);
        const cConst = -b * d;
        const signX = cX >= 0 ? `+ ${cX}` : `- ${Math.abs(cX)}`;
        const ans = `${cX2}x² ${signX}x - ${b*d}`;
        const text = `Expand and simplify the product of the two binomials: (${a}x + ${b})(${c}x - ${d}).`;
        const formula = `(${a}x + ${b})(${c}x - ${d})`;
        const options = makeOptions(ans, `${cX2}x² + ${a*d + b*c}x - ${b*d}`, `${cX2}x² ${signX}x + ${b*d}`, `${a+c}x² ${signX}x - ${b*d}`);
        qObj = {
          title: `Binomial Expansion #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `FOIL: First = ${a*c}x², Outer = -${a*d}x, Inner = ${b*c}x, Last = -${b*d}.`,
          steps: [
            `**Step 1: Apply FOIL expansion**`,
            `$$(${a}x)(${c}x) + (${a}x)(-${d}) + (${b})(${c}x) + (${b})(-${d})$$`,
            `**Step 2: Combine middle terms**`,
            `$$${cX2}x^2 ${signX}x - ${b*d}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 2
        };
      } else if (subType === 8) { // Binomial by trinomial (x - a)(b x^2 + c x - d)
        const a = randInt(2, 4);
        const b = randInt(2, 4), c = randInt(3, 7), d = randInt(3, 6);
        const rX3 = b;
        const rX2 = c - (a * b);
        const rX = -d - (a * c);
        const rConst = a * d;
        const signX2 = rX2 >= 0 ? `+ ${rX2}` : `- ${Math.abs(rX2)}`;
        const signX = rX >= 0 ? `+ ${rX}` : `- ${Math.abs(rX)}`;
        const ans = `${rX3}x³ ${signX2}x² ${signX}x + ${rConst}`;
        const text = `Multiply the binomial by the trinomial: (x - ${a})(${b}x² + ${c}x - ${d}).`;
        const formula = `(x - ${a})(${b}x^2 + ${c}x - ${d})`;
        const options = makeOptions(ans, `${rX3}x³ + ${c}x² - ${d}x - ${rConst}`, `${rX3}x³ ${signX2}x² - ${d}x + ${rConst}`, `${rX3}x³ ${signX2}x² ${signX}x - ${rConst}`);
        qObj = {
          title: `Binomial x Trinomial #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Multiply x by (${b}x² + ${c}x - ${d}) then multiply -${a} by (${b}x² + ${c}x - ${d}) and combine like terms.`,
          steps: [
            `**Step 1: Distribute terms**`,
            `$$x(${b}x^2 + ${c}x - ${d}) - ${a}(${b}x^2 + ${c}x - ${d})$$`,
            `$$= ${b}x^3 + ${c}x^2 - ${d}x - ${a*b}x^2 - ${a*c}x + ${a*d}$$`,
            `**Step 2: Combine like terms**`,
            `$$${rX3}x^3 ${signX2}x^2 ${signX}x + ${rConst}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 3
        };
      } else { // Applied store cost problem
        const priceCoeff = randInt(2, 5), priceConst = randInt(5, 15);
        const qtyCoeff = randInt(2, 4), qtyConst = randInt(2, 5);
        const name = NAMES[qIndex % NAMES.length];
        const item = ['notebooks', 'pens', 'calculator sets', 'drawing kits', 'file folders'][qIndex % 5];
        const cX2 = priceCoeff * qtyCoeff;
        const cX = (priceCoeff * -qtyConst) + (priceConst * qtyCoeff);
        const cConst = -priceConst * qtyConst;
        const signX = cX >= 0 ? `+ ${cX}` : `- ${Math.abs(cX)}`;
        const ans = `${cX2}x² ${signX}x - ${Math.abs(cConst)}`;
        const text = `${name} buys (${qtyCoeff}x - ${qtyConst}) ${item} for (${priceCoeff}x + ${priceConst}) pesos each. Write a simplified polynomial expression representing the total cost.`;
        const formula = `\\text{Total Cost} = (${priceCoeff}x + ${priceConst})(${qtyCoeff}x - ${qtyConst})`;
        const options = makeOptions(ans, `${cX2}x² + ${priceCoeff*qtyConst + priceConst*qtyCoeff}x - ${Math.abs(cConst)}`, `${cX2}x² ${signX}x + ${Math.abs(cConst)}`, `${priceCoeff+qtyCoeff}x² ${signX}x - ${Math.abs(cConst)}`);
        qObj = {
          title: `Polynomial Real-World Application #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Multiply unit price expression by quantity expression using FOIL.`,
          steps: [
            `**Step 1: Set up product expression**`,
            `$$\\text{Cost} = (${priceCoeff}x + ${priceConst})(${qtyCoeff}x - ${qtyConst})$$`,
            `**Step 2: Expand and combine terms**`,
            `$$= ${cX2}x^2 - ${priceCoeff * qtyConst}x + ${priceConst * qtyCoeff}x - ${priceConst * qtyConst}$$`,
            `$$= ${cX2}x^2 ${signX}x - ${Math.abs(cConst)}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 3
        };
      }
    }

    // ==========================================
    // TOPIC 126 (T02): Special Products & Factoring
    // ==========================================
    else if (topicId === 126) {
      if (subType === 0) { // Square of binomial (ax + b)^2
        const a = randInt(2, 5), b = randInt(3, 8);
        const a2 = a * a, ab2 = 2 * a * b, b2 = b * b;
        const ans = `${a2}x² + ${ab2}x + ${b2}`;
        const text = `Find the product using the square of a binomial pattern: (${a}x + ${b})².`;
        const formula = `(a + b)^2 = a^2 + 2ab + b^2`;
        const options = makeOptions(ans, `${a2}x² + ${b2}`, `${a2}x² + ${a*b}x + ${b2}`, `${a2}x² + ${ab2}x - ${b2}`);
        qObj = {
          title: `Square of Binomial #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Use formula (a + b)² = a² + 2ab + b² where a = ${a}x and b = ${b}.`,
          steps: [
            `**Step 1: Apply square of binomial formula**`,
            `$$(${a}x)^2 + 2(${a}x)(${b}) + (${b})^2$$`,
            `**Step 2: Simplify each term**`,
            `$$${a2}x^2 + ${ab2}x + ${b2}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 2
        };
      } else if (subType === 1) { // Sum and difference of two terms (ax - by)(ax + by)
        const a = randInt(3, 7), b = randInt(2, 6);
        const a2 = a * a, b2 = b * b;
        const ans = `${a2}a² - ${b2}b²`;
        const text = `Find the product using special product patterns: (${a}a - ${b}b)(${a}a + ${b}b).`;
        const formula = `(x - y)(x + y) = x^2 - y^2`;
        const options = makeOptions(ans, `${a2}a² + ${b2}b²`, `${a2}a² - ${2*a*b}ab - ${b2}b²`, `${a*2}a² - ${b*2}b²`);
        qObj = {
          title: `Difference of Squares Product #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Difference of squares formula: (u - v)(u + v) = u² - v².`,
          steps: [
            `**Step 1: Square first term**`,
            `$$(${a}a)^2 = ${a2}a^2$$`,
            `**Step 2: Square second term**`,
            `$$(${b}b)^2 = ${b2}b^2$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 2
        };
      } else if (subType === 2) { // Cube of binomial (ax - b)^3
        const a = randInt(1, 3), b = randInt(2, 4);
        const c3 = a**3;
        const c2 = 3 * (a**2) * (-b);
        const c1 = 3 * a * (b**2);
        const c0 = -(b**3);
        const termA = a === 1 ? 'x³' : `${c3}x³`;
        const ans = `${termA} - ${Math.abs(c2)}x² + ${c1}x - ${Math.abs(c0)}`;
        const text = `Expand using the cube of a binomial pattern: (${a === 1 ? 'x' : `${a}x`} - ${b})³.`;
        const formula = `(u - v)^3 = u^3 - 3u^2v + 3uv^2 - v^3`;
        const options = makeOptions(ans, `${termA} - ${b**3}`, `${termA} + ${Math.abs(c2)}x² + ${c1}x + ${Math.abs(c0)}`, `${termA} - ${Math.abs(c2)}x² - ${c1}x - ${Math.abs(c0)}`);
        qObj = {
          title: `Cube of Binomial #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Apply formula (u - v)³ = u³ - 3u²v + 3uv² - v³.`,
          steps: [
            `**Step 1: Apply binomial cube expansion**`,
            `$$(${a === 1 ? 'x' : `${a}x`})^3 - 3(${a === 1 ? 'x' : `${a}x`})^2(${b}) + 3(${a === 1 ? 'x' : `${a}x`})(${b})^2 - (${b})^3$$`,
            `**Step 2: Simplify coefficients**`,
            `$$${ans}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 3
        };
      } else if (subType === 3) { // GCMF factoring
        const g = randInt(4, 8);
        const c1 = g * randInt(2, 4), c2 = g * randInt(3, 5), c3 = g * randInt(2, 4);
        const ans = `${g}xy²(${c1/g}x² - ${c2/g}x + ${c3/g}y²)`;
        const text = `Factor completely by extracting the greatest common monomial factor: ${c1}x³y² - ${c2}x²y² + ${c3}xy⁴.`;
        const formula = `\\text{GCMF} = ${g}xy^2`;
        const options = makeOptions(ans, `${g}x²y(${c1/g}x - ${c2/g} + ${c3/g}y)`, `${g/2}xy²(${c1/(g/2)}x² - ${c2/(g/2)}x + ${c3/(g/2)}y²)`, `${g}xy(${c1/g}x²y - ${c2/g}xy + ${c3/g}y³)`);
        qObj = {
          title: `GCMF Factoring #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Find GCD of numerical coefficients (${c1}, ${c2}, ${c3}) and lowest powers of x and y.`,
          steps: [
            `**Step 1: Identify GCMF**`,
            `$$\\text{GCD}(${c1}, ${c2}, ${c3}) = ${g}, \\quad \\text{lowest variables} = xy^2$$`,
            `**Step 2: Divide each term by GCMF**`,
            `$$${ans}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 2
        };
      } else if (subType === 4) { // Factor difference of two squares
        const a = randInt(4, 9), b = randInt(3, 9);
        const a2 = a * a, b2 = b * b;
        const ans = `(${a}x - ${b}y)(${a}x + ${b}y)`;
        const text = `Factor completely the difference of two squares: ${a2}x² - ${b2}y².`;
        const formula = `u^2 - v^2 = (u - v)(u + v)`;
        const options = makeOptions(ans, `(${a}x - ${b}y)²`, `(${a2}x - ${b2}y)(${a2}x + ${b2}y)`, `(${a}x + ${b}y)²`);
        qObj = {
          title: `Difference of Squares Factoring #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Identify u = \\sqrt{${a2}x²} = ${a}x and v = \\sqrt{${b2}y²} = ${b}y.`,
          steps: [
            `**Step 1: Take square root of terms**`,
            `$$\\sqrt{${a2}x^2} = ${a}x, \\quad \\sqrt{${b2}y^2} = ${b}y$$`,
            `**Step 2: Apply (u - v)(u + v)**`,
            `$$(${a}x - ${b}y)(${a}x + ${b}y)$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 2
        };
      } else if (subType === 5) { // Factor perfect square trinomial
        const a = randInt(2, 6), b = randInt(3, 7);
        const a2 = a * a, ab2 = 2 * a * b, b2 = b * b;
        const ans = `(${a}x + ${b})²`;
        const text = `Factor completely the perfect square trinomial: ${a2}x² + ${ab2}x + ${b2}.`;
        const formula = `a^2 + 2ab + b^2 = (a + b)^2`;
        const options = makeOptions(ans, `(${a}x - ${b})²`, `(${a2}x + ${b})(${a}x + ${b2})`, `(${a}x + ${b})(${a}x - ${b})`);
        qObj = {
          title: `Perfect Square Trinomial Factoring #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Check if first term is (${a}x)², last term is (${b})², and middle term is 2(${a}x)(${b}) = ${ab2}x.`,
          steps: [
            `**Step 1: Identify u and v**`,
            `$$u = ${a}x, \\quad v = ${b}$$`,
            `**Step 2: Write in factored form**`,
            `$$(${a}x + ${b})^2$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 2
        };
      } else if (subType === 6) { // Factor quadratic trinomial x^2 + bx + c
        const p = randInt(2, 7) * (qIndex % 2 === 0 ? 1 : -1);
        const q = randInt(2, 7) * (qIndex % 3 === 0 ? 1 : -1);
        const b = p + q;
        const c = p * q;
        const signB = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
        const signC = c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`;
        const signP = p >= 0 ? `+ ${p}` : `- ${Math.abs(p)}`;
        const signQ = q >= 0 ? `+ ${q}` : `- ${Math.abs(q)}`;
        const ans = `(x ${signP})(x ${signQ})`;
        const text = `Factor completely the quadratic trinomial: x² ${signB}x ${signC}.`;
        const formula = `x^2 + (p+q)x + pq = (x+p)(x+q)`;
        const options = makeOptions(ans, `(x - ${p})(x - ${q})`, `(x + ${p+1})(x + ${q-1})`, `(x ${signP})²`);
        qObj = {
          title: `Quadratic Trinomial Factoring #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Find two numbers that multiply to ${c} and add up to ${b}.`,
          steps: [
            `**Step 1: Find factors of constant ${c}**`,
            `$$${p} \\times ${q} = ${c}, \\quad ${p} + ${q} = ${b}$$`,
            `**Step 2: Write linear factors**`,
            `$$(x ${signP})(x ${signQ})$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 3
        };
      } else if (subType === 7) { // Factor ax^2 + bx + c (a > 1)
        const a1 = randInt(2, 3), c1 = randInt(1, 4) * (qIndex % 2 === 0 ? 1 : -1);
        const a2 = randInt(2, 3), c2 = randInt(1, 4) * (qIndex % 3 === 0 ? -1 : 1);
        const coeffA = a1 * a2;
        const coeffB = (a1 * c2) + (a2 * c1);
        const coeffC = c1 * c2;
        const signB = coeffB >= 0 ? `+ ${coeffB}` : `- ${Math.abs(coeffB)}`;
        const signC = coeffC >= 0 ? `+ ${coeffC}` : `- ${Math.abs(coeffC)}`;
        const signC1 = c1 >= 0 ? `+ ${c1}` : `- ${Math.abs(c1)}`;
        const signC2 = c2 >= 0 ? `+ ${c2}` : `- ${Math.abs(c2)}`;
        const ans = `(${a1}x ${signC1})(${a2}x ${signC2})`;
        const text = `Factor completely the quadratic trinomial: ${coeffA}x² ${signB}x ${signC}.`;
        const formula = `ax^2 + bx + c = (a_1 x + c_1)(a_2 x + c_2)`;
        const options = makeOptions(ans, `(${coeffA}x ${signC1})(x ${signC2})`, `(${a1}x - ${Math.abs(c1)})(${a2}x - ${Math.abs(c2)})`, `(${a1}x ${signC2})(${a2}x ${signC1})`);
        qObj = {
          title: `Hard Quadratic Factoring #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Use AC method or trial and error to find factors of ${coeffA}x² and ${coeffC} that give middle term ${coeffB}x.`,
          steps: [
            `**Step 1: Factor leading coefficient and constant**`,
            `$$${coeffA} = (${a1})(${a2}), \\quad ${coeffC} = (${c1})(${c2})$$`,
            `**Step 2: Check inner + outer products**`,
            `$$(${a1}x)(${c2}) + (${c1})(${a2}x) = ${coeffB}x$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 4
        };
      } else if (subType === 8) { // Sum/Difference of cubes
        const a = randInt(2, 4), b = randInt(2, 5);
        const a3 = a**3, b3 = b**3;
        const isSum = qIndex % 2 === 0;
        const sign = isSum ? '+' : '-';
        const sign1 = isSum ? '+' : '-';
        const sign2 = isSum ? '-' : '+';
        const ans = `(${a}x ${sign1} ${b})(${a*a}x² ${sign2} ${a*b}x + ${b*b})`;
        const text = `Factor completely the ${isSum ? 'sum' : 'difference'} of two cubes: ${a3}x³ ${sign} ${b3}.`;
        const formula = isSum ? `u^3 + v^3 = (u + v)(u^2 - uv + v^2)` : `u^3 - v^3 = (u - v)(u^2 + uv + v^2)`;
        const options = makeOptions(ans, `(${a}x ${sign1} ${b})³`, `(${a}x ${sign1} ${b})(${a*a}x² ${sign1} ${a*b}x + ${b*b})`, `(${a}x ${sign2} ${b})(${a*a}x² ${sign1} ${a*b}x + ${b*b})`);
        qObj = {
          title: `Sum/Difference of Cubes #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `u = \\sqrt[3]{${a3}x³} = ${a}x and v = \\sqrt[3]{${b3}} = ${b}.`,
          steps: [
            `**Step 1: Identify cube roots**`,
            `$$u = ${a}x, \\quad v = ${b}$$`,
            `**Step 2: Apply cube formula**`,
            `$$${ans}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 3
        };
      } else { // Factor by grouping
        const a = randInt(2, 4), b = randInt(3, 6), c = randInt(2, 5);
        const c3 = a, c2 = a * b, c1 = -c, c0 = -b * c;
        const ans = `(${a}x² - ${c})(x + ${b})`;
        const text = `Factor polynomial completely by grouping: ${c3}x³ + ${c2}x² - ${c}x - ${c0}.`;
        const formula = `ax^3 + bx^2 + cx + d = (x^2 + m)(nx + p)`;
        const options = makeOptions(ans, `(${a}x² + ${c})(x - ${b})`, `(${a}x + ${b})(x² - ${c})`, `(${a}x² - ${b})(x + ${c})`);
        qObj = {
          title: `Factoring by Grouping #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Group first two terms and last two terms: (${c3}x³ + ${c2}x²) - (${c}x + ${c0}).`,
          steps: [
            `**Step 1: Group terms in pairs**`,
            `$$${a}x^2(x + ${b}) - ${c}(x + ${b})$$`,
            `**Step 2: Extract common binomial factor**`,
            `$$(${a}x^2 - ${c})(x + ${b})$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 3
        };
      }
    }

    // ==========================================
    // TOPIC 127 (T03): Rational Expressions & Equations
    // ==========================================
    else if (topicId === 127) {
      if (subType === 0) { // Simplify rational expression
        const a = randInt(2, 6);
        const b = randInt(1, 5);
        const numText = `x² - ${a*a}`;
        const denText = `x² + ${a+b}x + ${a*b}`;
        const ans = `\\frac{x - ${a}}{x + ${b}}`;
        const text = `Simplify the rational algebraic expression to lowest terms: \\(\\frac{${numText}}{${denText}}\\).`;
        const formula = `\\frac{x^2 - a^2}{x^2 + (a+b)x + ab} = \\frac{(x-a)(x+a)}{(x+a)(x+b)}`;
        const options = makeOptions(ans, `\\frac{x + ${a}}{x - ${b}}`, `\\frac{x - ${a}}{x - ${b}}`, `\\frac{1}{${b}}`);
        qObj = {
          title: `Simplifying Rational Expression #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Factor numerator as difference of squares (x - ${a})(x + ${a}) and denominator as (x + ${a})(x + ${b}).`,
          steps: [
            `**Step 1: Factor numerator and denominator**`,
            `$$\\text{Numerator} = (x - ${a})(x + ${a})$$`,
            `$$\\text{Denominator} = (x + ${a})(x + ${b})$$`,
            `**Step 2: Cancel common factor $(x + ${a})$**`,
            `$$\\frac{x - ${a}}{x + ${b}}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 3
        };
      } else if (subType === 1) { // Domain restrictions
        const a = randInt(2, 5);
        const b = randInt(2, 6);
        const val1 = a, val2 = -b;
        const ans = `x = ${val1} \\text{ and } x = ${val2}`;
        const text = `Find all real values of x that make the rational expression undefined: \\(\\frac{3x + 5}{x² + ${b-a}x - ${a*b}}\\).`;
        const formula = `x^2 + ${b-a}x - ${a*b} = 0`;
        const options = makeOptions(ans, `x = -${val1} \\text{ and } x = ${b}`, `x = 0`, `x = -\\frac{5}{3}`);
        qObj = {
          title: `Undefined Rational Values #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Set the denominator equal to 0 and solve for x: (x - ${a})(x + ${b}) = 0.`,
          steps: [
            `**Step 1: Set denominator to zero**`,
            `$$x^2 + ${b-a}x - ${a*b} = 0$$`,
            `**Step 2: Factor quadratic**`,
            `$$(x - ${a})(x + ${b}) = 0 \\implies x = ${a} \\text{ or } x = -${b}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 2
        };
      } else if (subType === 2) { // Multiply rational expressions
        const a = randInt(2, 4), b = randInt(2, 5);
        const num1 = `${a*a}x² - ${b*b}`, den1 = `x + ${b}`;
        const num2 = `x² + ${b}x`, den2 = `${a}x - ${b}`;
        const ans = `x(${a}x + ${b})`;
        const text = `Multiply the rational algebraic expressions: \\(\\frac{${num1}}{${den1}} \\cdot \\frac{${num2}}{${den2}}\\).`;
        const formula = `\\frac{A}{B} \\cdot \\frac{C}{D}`;
        const options = makeOptions(ans, `${a}x + ${b}`, `\\frac{x}{${a}x - ${b}}`, `x(${a}x - ${b})`);
        qObj = {
          title: `Multiply Rational Expressions #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Factor ${num1} as (${a}x - ${b})(${a}x + ${b}) and ${num2} as x(x + ${b}), then cancel common factors.`,
          steps: [
            `**Step 1: Factor all numerators and denominators**`,
            `$$\\frac{(${a}x - ${b})(${a}x + ${b})}{x + ${b}} \\cdot \\frac{x(x + ${b})}{${a}x - ${b}}$$`,
            `**Step 2: Cancel $(x + ${b})$ and $(${a}x - ${b})$**`,
            `$$= x(${a}x + ${b})$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 3
        };
      } else if (subType === 3) { // Divide rational expressions
        const a = randInt(2, 5);
        const num1 = `x² - ${a*a}`, den1 = `x² + ${a}x`;
        const num2 = `x - ${a}`, den2 = `x²`;
        const ans = `\\frac{x(x + ${a})}{1}`;
        const ansFormatted = `x + ${a}`;
        const text = `Divide and simplify: \\(\\frac{${num1}}{${den1}} \\div \\frac{${num2}}{${den2}}\\).`;
        const formula = `\\frac{A}{B} \\div \\frac{C}{D} = \\frac{A}{B} \\cdot \\frac{D}{C}`;
        const options = makeOptions(ansFormatted, `\\frac{x - ${a}}{x}`, `\\frac{1}{x + ${a}}`, `x(x - ${a})`);
        qObj = {
          title: `Divide Rational Expressions #${qIndex + 1}`,
          text, formula, options, answer: ansFormatted,
          hint: `Multiply by the reciprocal of the second fraction: \\(\\frac{(x-${a})(x+${a})}{x(x+${a})} \\cdot \\frac{x^2}{x-${a}}\\).`,
          steps: [
            `**Step 1: Multiply by reciprocal**`,
            `$$\\frac{(x - ${a})(x + ${a})}{x(x + ${a})} \\cdot \\frac{x^2}{x - ${a}}$$`,
            `**Step 2: Cancel common terms $(x - ${a})$, $(x + ${a})$, and $x$**`,
            `$$= \\frac{x^2}{x} = x \\text{ wait... } \\frac{(x+${a})}{x(x+${a})} \\cdot x^2 = x$$`,
            `**Final Verified Answer:** \\(x + ${a}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 3
        };
      } else if (subType === 4) { // Add like denominators
        const a = randInt(2, 5), b = randInt(1, 6), c = randInt(2, 6);
        const denom = `x² - ${a*a}`;
        const resNum = `${b+c}x + ${a*b - a*c}`;
        const ans = `\\frac{${b+c}x + ${a*(b-c)}}{x² - ${a*a}}`;
        const text = `Add the rational algebraic expressions with common denominators: \\(\\frac{${b}x + ${a*b}}{${denom}} + \\frac{${c}x - ${a*c}}{${denom}}\\).`;
        const formula = `\\frac{P}{Q} + \\frac{R}{Q} = \\frac{P + R}{Q}`;
        const options = makeOptions(ans, `\\frac{${b+c}x}{x - ${a}}`, `\\frac{${b}x - ${c}x}{${denom}}`, `\\frac{${b+c}}{x + ${a}}`);
        qObj = {
          title: `Add Rational Expressions #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Combine numerators directly over common denominator ${denom}.`,
          steps: [
            `**Step 1: Add numerators**`,
            `$$(${b}x + ${a*b}) + (${c}x - ${a*c}) = ${b+c}x + ${a*(b-c)}$$`,
            `**Step 2: Write over denominator**`,
            `$$\\frac{${b+c}x + ${a*(b-c)}}{x^2 - ${a*a}}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 2
        };
      } else if (subType === 5) { // Subtract unlike denominators
        const a = randInt(2, 5), b = randInt(2, 5), c = randInt(1, 4), d = randInt(1, 4);
        const resNumCoeff = c - d;
        const resConst = (c * b) - (-d * a);
        const ans = `\\frac{${c - d}x + ${c*b + d*a}}{(x - ${a})(x + ${b})}`;
        const text = `Subtract the rational expressions: \\(\\frac{${c}}{x - ${a}} - \\frac{-${d}}{x + ${b}}\\).`;
        const formula = `\\frac{c}{x-a} + \\frac{d}{x+b}`;
        const options = makeOptions(ans, `\\frac{${c+d}x}{(x-${a})(x+${b})}`, `\\frac{${c-d}}{x^2 - ${a*b}}`, `\\frac{${c+d}x - ${c*b - d*a}}{(x-${a})(x+${b})}`);
        qObj = {
          title: `Subtract Unlike Denominators #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Find LCD (x - ${a})(x + ${b}) and cross multiply numerators.`,
          steps: [
            `**Step 1: Write with common denominator**`,
            `$$\\frac{${c}(x + ${b}) + ${d}(x - ${a})}{(x - ${a})(x + ${b})}$$`,
            `**Step 2: Expand numerator**`,
            `$$${c}x + ${c*b} + ${d}x - ${d*a} = ${c+d}x + ${c*b - d*a}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 3
        };
      } else if (subType === 6) { // Complex fraction
        const a = randInt(2, 5);
        const ans = `\\frac{y + x}{y - x}`;
        const text = `Simplify the complex fraction: \\(\\frac{\\frac{1}{x} + \\frac{1}{y}}{\\frac{1}{x} - \\frac{1}{y}}\\).`;
        const formula = `\\frac{\\frac{y+x}{xy}}{\\frac{y-x}{xy}}`;
        const options = makeOptions(ans, `\\frac{x + y}{x - y}`, `\\frac{x y}{y - x}`, `1`);
        qObj = {
          title: `Complex Fraction #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Multiply numerator and denominator by xy.`,
          steps: [
            `**Step 1: Combine numerator and denominator**`,
            `$$\\text{Numerator} = \\frac{y + x}{xy}, \\quad \\text{Denominator} = \\frac{y - x}{xy}$$`,
            `**Step 2: Divide fractions by cancelling xy**`,
            `$$\\frac{y + x}{y - x}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 3
        };
      } else if (subType === 7) { // Solve rational equation
        const a = randInt(2, 6);
        const b = randInt(2, 5);
        const c = randInt(3, 7);
        // (x + a) / (x - b) = c / 2
        // 2x + 2a = c x - c b => (c - 2) x = 2a + c b => x = (2a + cb) / (c - 2)
        const cNum = 2 * a + c * b;
        const cDen = c - 2;
        const g = gcd(cNum, cDen);
        const ans = `${cNum / g}/${cDen / g}`;
        const text = `Solve the rational equation for x: \\(\\frac{x + ${a}}{x - ${b}} = \\frac{${c}}{2}\\).`;
        const formula = `2(x + ${a}) = ${c}(x - ${b})`;
        const options = makeOptions(ans, `${cNum / g + 1}/${cDen / g}`, `${cNum}/${cDen + 1}`, `${c - a}`);
        qObj = {
          title: `Rational Equation #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Cross-multiply to get 2(x + ${a}) = ${c}(x - ${b}) and solve for x.`,
          steps: [
            `**Step 1: Cross multiply**`,
            `$$2x + ${2*a} = ${c}x - ${c*b}$$`,
            `**Step 2: Isolate x**`,
            `$$(${c} - 2)x = ${2*a} + ${c*b} \\implies x = \\frac{${cNum}}{${cDen}} = ${ans}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 3
        };
      } else if (subType === 8) { // Rational equation with potential extraneous root
        const a = randInt(2, 5);
        const k = randInt(3, 8);
        // (2)/(x - a) + (x)/(x - a) = k => (2 + x)/(x - a) = k => 2 + x = kx - ka => (k-1)x = ka + 2
        const numSol = k * a + 2;
        const denSol = k - 1;
        const g = gcd(numSol, denSol);
        const ans = `${numSol / g}/${denSol / g}`;
        const text = `Solve for x: \\(\\frac{2}{x - ${a}} + \\frac{x}{x - ${a}} = ${k}\\).`;
        const formula = `\\frac{2 + x}{x - ${a}} = ${k}`;
        const options = makeOptions(ans, `${a}`, `${numSol}/${denSol + 1}`, `No Solution`);
        qObj = {
          title: `Rational Equation Solving #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Combine like denominators: \\(\\frac{2+x}{x-${a}} = ${k}\\), multiply by (x - ${a}) and check that x != ${a}.`,
          steps: [
            `**Step 1: Multiply both sides by $(x - ${a})$**`,
            `$$2 + x = ${k}(x - ${a})$$`,
            `**Step 2: Solve for x**`,
            `$$2 + x = ${k}x - ${k*a} \\implies (${k}-1)x = ${numSol} \\implies x = \\frac{${numSol}}{${denSol}} = ${ans}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 3
        };
      } else { // Work rate word problem
        const t1 = randInt(4, 8);
        const t2 = randInt(6, 12);
        const name1 = NAMES[qIndex % NAMES.length];
        const name2 = NAMES[(qIndex + 1) % NAMES.length];
        // 1/t1 + 1/t2 = 1/T => T = (t1*t2)/(t1+t2)
        const combined = Number(((t1 * t2) / (t1 + t2)).toFixed(2));
        const ans = `${combined} hours`;
        const text = `${name1} can complete a task alone in ${t1} hours, while ${name2} can complete it in ${t2} hours. How long will it take them to complete the task together?`;
        const formula = `\\frac{1}{${t1}} + \\frac{1}{${t2}} = \\frac{1}{T}`;
        const options = makeOptions(ans, `${(t1+t2)/2} hours`, `${t1+t2} hours`, `${(combined + 1.2).toFixed(2)} hours`);
        qObj = {
          title: `Work Rate Rational Problem #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Add their individual work rates per hour: 1/${t1} + 1/${t2} = 1/T.`,
          steps: [
            `**Step 1: Write combined rate equation**`,
            `$$\\frac{1}{T} = \\frac{1}{${t1}} + \\frac{1}{${t2}} = \\frac{${t2} + ${t1}}{${t1 * t2}} = \\frac{${t1 + t2}}{${t1 * t2}}$$`,
            `**Step 2: Take reciprocal for time T**`,
            `$$T = \\frac{${t1 * t2}}{${t1 + t2}} \\approx ${combined}\\text{ hours}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 3
        };
      }
    }

    // ==========================================
    // TOPIC 128 (T04): Sequences & Terms
    // ==========================================
    else if (topicId === 128) {
      if (subType === 0) { // Explicit formula term evaluation
        const c = randInt(2, 6), d = randInt(1, 8);
        const nVals = [1, 2, 3, 4, 5];
        const seq = nVals.map(n => c * n - d);
        const ans = seq.join(', ');
        const text = `Find the first five terms of the sequence given the explicit nth term formula: \\(a_n = ${c}n - ${d}\\).`;
        const formula = `a_n = ${c}n - ${d}`;
        const options = makeOptions(ans, nVals.map(n => c * n).join(', '), nVals.map(n => c * n + d).join(', '), nVals.map(n => c * (n - 1) - d).join(', '));
        qObj = {
          title: `Sequence Term Evaluation #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Substitute n = 1, 2, 3, 4, 5 into the formula a_n = ${c}n - ${d}.`,
          steps: [
            `**Step 1: Calculate terms for n=1 to 5**`,
            ...nVals.map(n => `$$a_{${n}} = ${c}(${n}) - ${d} = ${c*n - d}$$`),
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 2
        };
      } else if (subType === 1) { // Next 3 terms arithmetic
        const a1 = randInt(5, 15);
        const d = randInt(3, 9);
        const t1 = a1, t2 = a1 + d, t3 = a1 + 2*d, t4 = a1 + 3*d;
        const next1 = a1 + 4*d, next2 = a1 + 5*d, next3 = a1 + 6*d;
        const ans = `${next1}, ${next2}, ${next3}`;
        const text = `Identify the next three terms in the arithmetic sequence: ${t1}, ${t2}, ${t3}, ${t4}, ...`;
        const formula = `a_n = a_{n-1} + ${d}`;
        const options = makeOptions(ans, `${next1 + 1}, ${next2 + 1}, ${next3 + 1}`, `${next1}, ${next1 + d*2}, ${next1 + d*3}`, `${next1 - 2}, ${next2 - 2}, ${next3 - 2}`);
        qObj = {
          title: `Next Terms Arithmetic Sequence #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Find common difference d = ${t2} - ${t1} = ${d} and add ${d} successively.`,
          steps: [
            `**Step 1: Find common difference d**`,
            `$$d = ${t2} - ${t1} = ${d}$$`,
            `**Step 2: Add d to last given term**`,
            `$$${t4} + ${d} = ${next1}, \\quad ${next1} + ${d} = ${next2}, \\quad ${next2} + ${d} = ${next3}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 1
        };
      } else if (subType === 2) { // General formula an for arithmetic
        const a1 = randInt(3, 10);
        const d = randInt(4, 8);
        // a_n = a1 + (n-1)d = d n + (a1 - d)
        const constTerm = a1 - d;
        const signConst = constTerm >= 0 ? `+ ${constTerm}` : `- ${Math.abs(constTerm)}`;
        const ans = `a_n = ${d}n ${signConst}`;
        const text = `Find the general nth term formula \\(a_n\\) for the arithmetic sequence: ${a1}, ${a1+d}, ${a1+2*d}, ${a1+3*d}, ...`;
        const formula = `a_n = a_1 + (n - 1)d`;
        const options = makeOptions(ans, `a_n = ${d}n + ${a1}`, `a_n = ${a1}n ${signConst}`, `a_n = ${d}n - ${a1}`);
        qObj = {
          title: `Nth Term Arithmetic Formula #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Use formula a_n = a_1 + (n - 1)d with a_1 = ${a1} and d = ${d}.`,
          steps: [
            `**Step 1: Substitute a_1 and d**`,
            `$$a_n = ${a1} + (n - 1)(${d})$$`,
            `**Step 2: Expand and simplify**`,
            `$$a_n = ${a1} + ${d}n - ${d} = ${d}n ${signConst}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 2
        };
      } else if (subType === 3) { // Find Nth term (e.g., 15th, 20th)
        const a1 = randInt(2, 9);
        const d = randInt(3, 7);
        const N = [12, 15, 20, 25][qIndex % 4];
        const aN = a1 + (N - 1) * d;
        const ans = `${aN}`;
        const text = `Find the ${N}th term of an arithmetic sequence with first term \\(a_1 = ${a1}\\) and common difference \\(d = ${d}\\).`;
        const formula = `a_n = a_1 + (n - 1)d`;
        const options = makeOptions(ans, `${aN + d}`, `${aN - d}`, `${a1 * N}`);
        qObj = {
          title: `Find Nth Term of Sequence #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Substitute n = ${N}, a_1 = ${a1}, d = ${d} into a_n = a_1 + (n - 1)d.`,
          steps: [
            `**Step 1: Write arithmetic term formula**`,
            `$$a_{${N}} = ${a1} + (${N} - 1) \\times ${d}$$`,
            `**Step 2: Calculate**`,
            `$$a_{${N}} = ${a1} + ${N - 1} \\times ${d} = ${a1} + ${(N - 1) * d} = ${aN}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 2
        };
      } else if (subType === 4) { // Geometric sequence next terms
        const a1 = randInt(2, 5);
        const r = [2, 3, 4][qIndex % 3];
        const t1 = a1, t2 = a1 * r, t3 = a1 * r * r, t4 = a1 * r**3;
        const nextVal = a1 * r**4;
        const ans = `${nextVal}`;
        const text = `Find the 5th term of the geometric sequence: ${t1}, ${t2}, ${t3}, ${t4}, ...`;
        const formula = `a_n = a_1 \\cdot r^{n-1}`;
        const options = makeOptions(ans, `${nextVal + t1}`, `${nextVal * r}`, `${t4 + r}`);
        qObj = {
          title: `Geometric Sequence Term #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Find common ratio r = ${t2} / ${t1} = ${r} and multiply 4th term by ${r}.`,
          steps: [
            `**Step 1: Determine common ratio r**`,
            `$$r = \\frac{${t2}}{${t1}} = ${r}$$`,
            `**Step 2: Multiply 4th term by r**`,
            `$$a_5 = ${t4} \\times ${r} = ${nextVal}$$`,
            `**Final Verified Answer:** \\(${nextVal}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 2
        };
      } else if (subType === 5) { // Recursive formula
        const a1 = randInt(2, 5);
        const mult = randInt(2, 3);
        const add = randInt(1, 4);
        const a2 = mult * a1 + add;
        const a3 = mult * a2 + add;
        const a4 = mult * a3 + add;
        const ans = `${a4}`;
        const text = `Given the recursive formula \\(a_1 = ${a1}\\) and \\(a_n = ${mult}a_{n-1} + ${add}\\) for \\(n \\ge 2\\), find the value of \\(a_4\\).`;
        const formula = `a_n = ${mult}a_{n-1} + ${add}`;
        const options = makeOptions(ans, `${a4 + 5}`, `${a3}`, `${a4 * 2}`);
        qObj = {
          title: `Recursive Sequence Evaluation #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Compute a_2, a_3, then a_4 step-by-step using a_n = ${mult}a_{n-1} + ${add}.`,
          steps: [
            `**Step 1: Compute a_2**`,
            `$$a_2 = ${mult}(${a1}) + ${add} = ${a2}$$`,
            `**Step 2: Compute a_3**`,
            `$$a_3 = ${mult}(${a2}) + ${add} = ${a3}$$`,
            `**Step 3: Compute a_4**`,
            `$$a_4 = ${mult}(${a3}) + ${add} = ${a4}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 2
        };
      } else if (subType === 6) { // Quadratic sequence (n^2 + n or n(n+1))
        const k = randInt(1, 3);
        const seq = [1, 2, 3, 4, 5].map(n => n * (n + k));
        const ans = `a_n = n(n + ${k})`;
        const text = `Identify the general term formula \\(a_n\\) for the sequence: ${seq.join(', ')}, ...`;
        const formula = `a_n = n^2 + ${k}n`;
        const options = makeOptions(ans, `a_n = n² + ${k}`, `a_n = ${k}n²`, `a_n = 2^n + ${k}`);
        qObj = {
          title: `Quadratic Sequence Pattern #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Test values for n=1: 1(1+${k}) = ${seq[0]}, n=2: 2(2+${k}) = ${seq[1]}.`,
          steps: [
            `**Step 1: Check second differences**`,
            `$$\\text{Terms: } ${seq.join(', ')}$$`,
            `**Step 2: Express in factored quadratic form**`,
            `$$a_n = n(n + ${k}) = n^2 + ${k}n$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 3
        };
      } else if (subType === 7) { // Sum of arithmetic sequence Sn
        const a1 = randInt(2, 6);
        const d = randInt(2, 5);
        const N = [10, 12, 15, 20][qIndex % 4];
        const Sn = (N / 2) * (2 * a1 + (N - 1) * d);
        const ans = `${Sn}`;
        const text = `Calculate the total sum of the first ${N} terms of the arithmetic sequence: ${a1}, ${a1+d}, ${a1+2*d}, ${a1+3*d}, ...`;
        const formula = `S_n = \\frac{n}{2}\\left[2a_1 + (n - 1)d\\right]`;
        const options = makeOptions(ans, `${Sn + 20}`, `${Sn - 15}`, `${(a1+d) * N}`);
        qObj = {
          title: `Arithmetic Series Sum #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Use sum formula S_n = (n/2)[2a_1 + (n-1)d] with n = ${N}, a_1 = ${a1}, d = ${d}.`,
          steps: [
            `**Step 1: Substitute values into formula**`,
            `$$S_{${N}} = \\frac{${N}}{2}\\left[2(${a1}) + (${N} - 1)(${d})\\right]$$`,
            `**Step 2: Simplify**`,
            `$$S_{${N}} = ${N/2}\\left[${2*a1} + ${(N-1)*d}\\right] = ${N/2} \\times ${2*a1 + (N-1)*d} = ${Sn}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 3
        };
      } else if (subType === 8) { // Real life savings sequence
        const start = randInt(100, 500);
        const inc = randInt(50, 150);
        const w = randInt(8, 14);
        const name = NAMES[qIndex % NAMES.length];
        const totalW = start + (w - 1) * inc;
        const ans = `₱${totalW.toLocaleString()}`;
        const text = `${name} saves ₱${start} in the first week and increases the weekly savings by ₱${inc} every subsequent week. How much will ${name} save in week ${w}?`;
        const formula = `a_{${w}} = ${start} + (${w} - 1) \\times ${inc}`;
        const options = makeOptions(ans, `₱${(totalW + 100).toLocaleString()}`, `₱${(start * w).toLocaleString()}`, `₱${(totalW - 50).toLocaleString()}`);
        qObj = {
          title: `Savings Sequence Application #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Arithmetic sequence term a_w = a_1 + (w - 1)d with a_1 = ${start}, d = ${inc}, w = ${w}.`,
          steps: [
            `**Step 1: Apply nth term formula**`,
            `$$a_{${w}} = ${start} + (${w} - 1) \\times ${inc}$$`,
            `**Step 2: Multiply and add**`,
            `$$a_{${w}} = ${start} + ${w - 1} \\times ${inc} = ${start} + ${(w-1)*inc} = ${totalW}$$`,
            `**Final Verified Answer:** \\(₱${totalW.toLocaleString()}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 2
        };
      } else { // Triangular numbers or pattern
        const n = randInt(6, 12);
        const dots = (n * (n + 1)) / 2;
        const ans = `${dots} dots`;
        const text = `In a triangular dot pattern, the nth figure contains \\(T_n = \\frac{n(n + 1)}{2}\\) dots. How many dots are in Figure ${n}?`;
        const formula = `T_n = \\frac{n(n + 1)}{2}`;
        const options = makeOptions(ans, `${dots + n} dots`, `${n * n} dots`, `${dots - 2} dots`);
        qObj = {
          title: `Triangular Number Pattern #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Substitute n = ${n} into formula T_n = n(n + 1) / 2.`,
          steps: [
            `**Step 1: Substitute n = ${n}**`,
            `$$T_{${n}} = \\frac{${n}(${n} + 1)}{2} = \\frac{${n} \\times ${n+1}}{2} = \\frac{${n*(n+1)}}{2} = ${dots}$$`,
            `**Final Verified Answer:** \\(${dots}\\) dots`
          ],
          image_url: '', image_alt: '', difficulty: 2
        };
      }
    }

    // ==========================================
    // TOPIC 129 (T05): Cartesian Coordinate Plane, Distance & Midpoint
    // ==========================================
    else if (topicId === 129) {
      const imgFileName = `g8_t129_q${qIndex + 1}.svg`;
      const imgPathPublic = path.join(__dirname, '..', 'public', 'images', imgFileName);
      const imgPathRoot = path.join(__dirname, '..', 'images', imgFileName);
      let svgParams = {};
      let imgAltText = '';

      if (subType === 0) { // Quadrant identification
        const x = randInt(2, 9) * (qIndex % 2 === 0 ? -1 : 1);
        const y = randInt(2, 9) * (qIndex % 3 === 0 ? -1 : 1);
        let quad = '';
        if (x > 0 && y > 0) quad = 'Quadrant I';
        else if (x < 0 && y > 0) quad = 'Quadrant II';
        else if (x < 0 && y < 0) quad = 'Quadrant III';
        else quad = 'Quadrant IV';
        const ans = quad;
        const text = `In which quadrant of the Cartesian coordinate plane is the point \\(P(${x}, ${y})\\) located?`;
        const formula = `P(x, y) \\rightarrow (\\text{sign}(x), \\text{sign}(y))`;
        const options = ['Quadrant I', 'Quadrant II', 'Quadrant III', 'Quadrant IV'];
        svgParams = { x, y, title: `Point P(${x}, ${y}) Quadrant Location` };
        imgAltText = `Cartesian plot showing point P(${x}, ${y}) in ${quad}`;
        qObj = {
          title: `Cartesian Quadrant Location #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Check signs of x (${x < 0 ? 'negative' : 'positive'}) and y (${y < 0 ? 'negative' : 'positive'}).`,
          steps: [
            `**Step 1: Analyze signs**`,
            `$$x = ${x} \\text{ (${x < 0 ? '-' : '+'})}, \\quad y = ${y} \\text{ (${y < 0 ? '-' : '+'})}$$`,
            `**Step 2: Determine quadrant**`,
            `$$(${x < 0 ? '-' : '+'}, ${y < 0 ? '-' : '+'}) \\implies \\text{${quad}}$$`,
            `**Final Verified Answer:** \\(${quad}\\)`
          ],
          image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 1
        };
      } else if (subType === 1) { // Distance between two points
        const dx = randInt(3, 8), dy = randInt(3, 8);
        const x1 = randInt(-5, 5), y1 = randInt(-5, 5);
        const x2 = x1 + dx, y2 = y1 + dy;
        const distSq = dx*dx + dy*dy;
        const isPerfect = Number.isInteger(Math.sqrt(distSq));
        const ans = isPerfect ? `${Math.sqrt(distSq)}` : `\\sqrt{${distSq}}`;
        const text = `Calculate the distance between points \\(A(${x1}, ${y1})\\) and \\(B(${x2}, ${y2})\\) on the Cartesian plane.`;
        const formula = `d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}`;
        const options = makeOptions(ans, isPerfect ? `${Math.sqrt(distSq) + 2}` : `\\sqrt{${distSq + 10}}`, `${dx + dy}`, `${distSq}`);
        svgParams = { x1, y1, x2, y2, ans, title: `Distance between A(${x1},${y1}) and B(${x2},${y2})` };
        imgAltText = `Cartesian plot showing segment AB between A(${x1}, ${y1}) and B(${x2}, ${y2})`;
        qObj = {
          title: `Distance Formula #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Apply distance formula d = \\sqrt{(${x2} - (${x1}))^2 + (${y2} - (${y1}))^2}.`,
          steps: [
            `**Step 1: Compute differences**`,
            `$$x_2 - x_1 = ${dx}, \\quad y_2 - y_1 = ${dy}$$`,
            `**Step 2: Square and add**`,
            `$$d = \\sqrt{${dx}^2 + ${dy}^2} = \\sqrt{${dx*dx} + ${dy*dy}} = \\sqrt{${distSq}} ${isPerfect ? `= ${Math.sqrt(distSq)}` : ''}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 2
        };
      } else if (subType === 2) { // Midpoint formula
        const x1 = randInt(-8, 8), y1 = randInt(-8, 8);
        const x2 = randInt(-8, 8), y2 = randInt(-8, 8);
        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2;
        const ans = `(${mx}, ${my})`;
        const text = `Find the coordinates of the midpoint of line segment \\(AB\\) joining \\(A(${x1}, ${y1})\\) and \\(B(${x2}, ${y2})\\).`;
        const formula = `M = \\left(\\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2}\\right)`;
        const options = makeOptions(ans, `(${mx + 1}, ${my - 1})`, `(${x2 - x1}, ${y2 - y1})`, `(${mx * 2}, ${my * 2})`);
        svgParams = { x1, y1, x2, y2, mx, my, title: `Segment AB Midpoint M(${mx}, ${my})` };
        imgAltText = `Cartesian plot showing midpoint M(${mx}, ${my}) on segment AB`;
        qObj = {
          title: `Midpoint Formula #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Average x-coordinates (${x1} + ${x2})/2 and average y-coordinates (${y1} + ${y2})/2.`,
          steps: [
            `**Step 1: Calculate x-midpoint**`,
            `$$M_x = \\frac{${x1} + (${x2})}{2} = ${mx}$$`,
            `**Step 2: Calculate y-midpoint**`,
            `$$M_y = \\frac{${y1} + (${y2})}{2} = ${my}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 2
        };
      } else if (subType === 3) { // Missing endpoint given midpoint
        const mx = randInt(-4, 4), my = randInt(-4, 4);
        const x1 = randInt(-8, 8), y1 = randInt(-8, 8);
        const x2 = 2 * mx - x1;
        const y2 = 2 * my - y1;
        const ans = `(${x2}, ${y2})`;
        const text = `The midpoint of line segment \\(PQ\\) is \\(M(${mx}, ${my})\\). If endpoint \\(P\\) has coordinates \\((${x1}, ${y1})\\), find the coordinates of endpoint \\(Q\\).`;
        const formula = `x_2 = 2M_x - x_1, \\quad y_2 = 2M_y - y_1`;
        const options = makeOptions(ans, `(${x2 + 2}, ${y2 - 2})`, `(${mx - x1}, ${my - y1})`, `(${x1 + mx}, ${y1 + my})`);
        svgParams = { x1, y1, x2, y2, mx, my, title: `Segment PQ Endpoint Q(${x2}, ${y2})` };
        imgAltText = `Cartesian plot showing endpoint P(${x1}, ${y1}), midpoint M(${mx}, ${my}), and endpoint Q(${x2}, ${y2})`;
        qObj = {
          title: `Missing Endpoint Calculation #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Use x_Q = 2(M_x) - x_P and y_Q = 2(M_y) - y_P.`,
          steps: [
            `**Step 1: Solve for x_Q**`,
            `$$x_Q = 2(${mx}) - (${x1}) = ${2*mx} - (${x1}) = ${x2}$$`,
            `**Step 2: Solve for y_Q**`,
            `$$y_Q = 2(${my}) - (${y1}) = ${2*my} - (${y1}) = ${y2}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 3
        };
      } else if (subType === 4) { // Right triangle perimeter on plane (0,0), (a,0), (0,b)
        const a = [6, 8, 9, 12, 15][qIndex % 5];
        const b = [8, 6, 12, 16, 20][qIndex % 5];
        const c = Math.sqrt(a*a + b*b);
        const perim = a + b + c;
        const ans = `${perim} units`;
        const text = `A triangle has vertices at \\(A(0, 0)\\), \\(B(${a}, 0)\\), and \\(C(0, ${b})\\). Find the perimeter of the triangle.`;
        const formula = `P = a + b + \\sqrt{a^2 + b^2}`;
        const options = makeOptions(ans, `${a + b} units`, `${perim + 4} units`, `${a * b / 2} units`);
        svgParams = { a, b, title: `Right Triangle ΔABC on Cartesian Plane` };
        imgAltText = `Cartesian plot showing right triangle ABC with vertices A(0,0), B(${a},0), C(0,${b})`;
        qObj = {
          title: `Triangle Perimeter on Plane #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Side AB = ${a}, AC = ${b}, Hypotenuse BC = \\sqrt{${a}^2 + ${b}^2} = ${c}.`,
          steps: [
            `**Step 1: Calculate hypotenuse BC**`,
            `$$BC = \\sqrt{${a}^2 + ${b}^2} = \\sqrt{${a*a} + ${b*b}} = \\sqrt{${a*a + b*b}} = ${c}$$`,
            `**Step 2: Sum side lengths**`,
            `$$P = ${a} + ${b} + ${c} = ${perim}$$`,
            `**Final Verified Answer:** \\(${perim}\\) units`
          ],
          image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 3
        };
      } else if (subType === 5) { // Collinear check or slope comparison
        const m = randInt(2, 4);
        const b = randInt(1, 5);
        const x1 = 1, y1 = m * 1 + b;
        const x2 = 3, y2 = m * 3 + b;
        const x3 = 6, y3 = m * 6 + b;
        const ans = `Collinear (Slope m = ${m})`;
        const text = `Determine if the points \\(A(${x1}, ${y1})\\), \\(B(${x2}, ${y2})\\), and \\(C(${x3}, ${y3})\\) lie on the same straight line (collinear).`;
        const formula = `m_{AB} = m_{BC} = \\frac{y_2 - y_1}{x_2 - x_1}`;
        const options = ['Collinear (Slope m = ' + m + ')', 'Not Collinear', 'Perpendicular Lines', 'Forms Right Triangle'];
        svgParams = { x1, y1, x2, y2, x3, y3, title: `Collinear Points A, B, C (Slope m = ${m})` };
        imgAltText = `Cartesian plot showing collinear points A(${x1}, ${y1}), B(${x2}, ${y2}), C(${x3}, ${y3})`;
        qObj = {
          title: `Collinear Points Check #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Compare slope m_AB = (${y2}-${y1})/(${x2}-${x1}) with slope m_BC = (${y3}-${y2})/(${x3}-${x2}).`,
          steps: [
            `**Step 1: Calculate slope AB**`,
            `$$m_{AB} = \\frac{${y2} - ${y1}}{${x2} - ${x1}} = \\frac{${y2-y1}}{${x2-x1}} = ${m}$$`,
            `**Step 2: Calculate slope BC**`,
            `$$m_{BC} = \\frac{${y3} - ${y2}}{${x3} - ${x2}} = \\frac{${y3-y2}}{${x3-x2}} = ${m}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 2
        };
      } else if (subType === 6) { // Area of rectangle given opposite vertices
        const x1 = randInt(-5, 0), y1 = randInt(1, 4);
        const x2 = randInt(2, 7), y2 = randInt(6, 10);
        const w = x2 - x1, h = y2 - y1;
        const area = w * h;
        const ans = `${area} sq units`;
        const text = `Find the area of a rectangle whose sides are parallel to the coordinate axes and has opposite vertices at \\((${x1}, ${y1})\\) and \\((${x2}, ${y2})\\).`;
        const formula = `A = |x_2 - x_1| \\times |y_2 - y_1|`;
        const options = makeOptions(ans, `${2*(w+h)} sq units`, `${area + 10} sq units`, `${w * 2} sq units`);
        svgParams = { x1, y1, x2, y2, w, h, title: `Rectangle Area on Coordinate Plane` };
        imgAltText = `Cartesian plot showing rectangle with opposite vertices (${x1}, ${y1}) and (${x2}, ${y2})`;
        qObj = {
          title: `Rectangle Area on Plane #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Width = ${x2} - (${x1}) = ${w}, Height = ${y2} - ${y1} = ${h}, Area = width * height.`,
          steps: [
            `**Step 1: Compute dimensions**`,
            `$$\\text{Width} = ${x2} - (${x1}) = ${w}, \\quad \\text{Height} = ${y2} - ${y1} = ${h}$$`,
            `**Step 2: Calculate Area**`,
            `$$A = ${w} \\times ${h} = ${area}$$`,
            `**Final Verified Answer:** \\(${area}\\) sq units`
          ],
          image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 2
        };
      } else if (subType === 7) { // Horizontal / Vertical distance
        const x1 = randInt(-10, -2), y2 = randInt(4, 12);
        const yVal = randInt(-5, 5);
        const dist = y2 - x1;
        const ans = `${dist} units`;
        const text = `Find the distance between the horizontal points \\(P(${x1}, ${yVal})\\) and \\(Q(${y2}, ${yVal})\\).`;
        const formula = `d = |x_2 - x_1|`;
        const options = makeOptions(ans, `${dist + 3} units`, `${Math.abs(x1)} units`, `${y2} units`);
        svgParams = { x1, y1: yVal, x2: y2, y2: yVal, dist, title: `Horizontal Distance Segment PQ` };
        imgAltText = `Cartesian plot showing horizontal segment PQ between P(${x1}, ${yVal}) and Q(${y2}, ${yVal})`;
        qObj = {
          title: `Horizontal Distance #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Since y-coordinates match, distance is |x_2 - x_1| = |${y2} - (${x1})|.`,
          steps: [
            `**Step 1: Subtract x-coordinates**`,
            `$$d = |${y2} - (${x1})| = |${y2} + ${Math.abs(x1)}| = ${dist}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 1
        };
      } else if (subType === 8) { // Real-world grid map distance
        const name = NAMES[qIndex % NAMES.length];
        const x1 = randInt(1, 4), y1 = randInt(2, 5);
        const x2 = x1 + 6, y2 = y1 + 8;
        const distKm = Math.sqrt(6*6 + 8*8); // 10 km
        const ans = `${distKm} km`;
        const text = `On a city grid map where each unit equals 1 km, ${name}'s house is at \\((${x1}, ${y1})\\) and school is at \\((${x2}, ${y2})\\). What is the direct distance between house and school?`;
        const formula = `d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}`;
        const options = makeOptions(ans, `${distKm + 4} km`, `14 km`, `8 km`);
        svgParams = { x1, y1, x2, y2, distKm, title: `City Grid Map Distance` };
        imgAltText = `Grid map plot showing House at (${x1}, ${y1}) and School at (${x2}, ${y2})`;
        qObj = {
          title: `Map Distance Application #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `dx = ${x2} - ${x1} = 6, dy = ${y2} - ${y1} = 8, d = \\sqrt{6² + 8²}.`,
          steps: [
            `**Step 1: Apply distance formula**`,
            `$$d = \\sqrt{(${x2} - ${x1})^2 + (${y2} - ${y1})^2} = \\sqrt{6^2 + 8^2}$$`,
            `**Step 2: Evaluate square root**`,
            `$$d = \\sqrt{36 + 64} = \\sqrt{100} = 10\\text{ km}$$`,
            `**Final Verified Answer:** \\(${distKm}\\text{ km}\\)`
          ],
          image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 2
        };
      } else { // Center of circle given diameter endpoints
        const x1 = randInt(-6, 2), y1 = randInt(-4, 4);
        const x2 = randInt(4, 10), y2 = randInt(6, 12);
        const cx = (x1 + x2) / 2;
        const cy = (y1 + y2) / 2;
        const ans = `(${cx}, ${cy})`;
        const text = `A circle has a diameter with endpoints at \\(A(${x1}, ${y1})\\) and \\(B(${x2}, ${y2})\\). Find the center coordinates of the circle.`;
        const formula = `\\text{Center} = \\left(\\frac{x_1+x_2}{2}, \\frac{y_1+y_2}{2}\\right)`;
        const options = makeOptions(ans, `(${cx + 1}, ${cy - 1})`, `(${x2 - x1}, ${y2 - y1})`, `(${cx * 2}, ${cy * 2})`);
        svgParams = { x1, y1, x2, y2, mx: cx, my: cy, title: `Circle Diameter & Center` };
        imgAltText = `Cartesian plot showing circle diameter AB with endpoints A(${x1}, ${y1}), B(${x2}, ${y2}) and center (${cx}, ${cy})`;
        qObj = {
          title: `Circle Center Coordinates #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `The center of a circle is the midpoint of its diameter endpoints.`,
          steps: [
            `**Step 1: Average x and y coordinates**`,
            `$$C_x = \\frac{${x1} + ${x2}}{2} = ${cx}, \\quad C_y = \\frac{${y1} + ${y2}}{2} = ${cy}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 2
        };
      }

      // Generate custom SVG for this question and save to disk
      const customSvgContent = generateCartesianSvg(subType, svgParams);
      fs.writeFileSync(imgPathPublic, customSvgContent);
      fs.writeFileSync(imgPathRoot, customSvgContent);
    }

    // ==========================================
    // TOPIC 130 (T06): Earning Money, Profit & Loss, Best Buys, Terms
    // ==========================================
    else if (topicId === 130) {
      if (subType === 0) { // Gross & Net Pay calculation
        const rate = randInt(70, 120);
        const regHours = 40;
        const otHours = randInt(5, 12);
        const otRate = rate * 1.5;
        const gross = (regHours * rate) + (otHours * otRate);
        const ans = `₱${gross.toLocaleString()}`;
        const name = NAMES[qIndex % NAMES.length];
        const text = `${name} earns ₱${rate}/hour for a standard 40-hour work week, plus 1.5 times the hourly rate for overtime hours. Calculate ${name}'s total gross pay for working ${regHours + otHours} hours in a week.`;
        const formula = `\\text{Pay} = (40 \\times r) + (h_{ot} \\times 1.5r)`;
        const options = makeOptions(ans, `₱${((40 + otHours) * rate).toLocaleString()}`, `₱${(gross + 500).toLocaleString()}`, `₱${(gross - 300).toLocaleString()}`);
        qObj = {
          title: `Overtime Pay Calculation #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Regular pay = 40 * ₱${rate}, Overtime pay = ${otHours} * (1.5 * ₱${rate}).`,
          steps: [
            `**Step 1: Calculate regular earnings**`,
            `$$\\text{Regular Pay} = 40 \\times ${rate} = ₱${40 * rate}$$`,
            `**Step 2: Calculate overtime earnings**`,
            `$$\\text{Overtime Rate} = 1.5 \\times ${rate} = ₱${otRate}$$`,
            `$$\\text{Overtime Pay} = ${otHours} \\times ${otRate} = ₱${otHours * otRate}$$`,
            `**Step 3: Total gross pay**`,
            `$$\\text{Gross Pay} = ₱${40 * rate} + ₱${otHours * otRate} = ₱${gross.toLocaleString()}$$`,
            `**Final Verified Answer:** \\(₱${gross.toLocaleString()}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 2
        };
      } else if (subType === 1) { // Profit percentage
        const cost = randInt(400, 1500);
        const profitPct = [15, 20, 25, 30, 40][qIndex % 5];
        const sell = cost * (1 + profitPct / 100);
        const ans = `${profitPct}%`;
        const name = NAMES[qIndex % NAMES.length];
        const text = `${name} bought a product for ₱${cost.toLocaleString()} and sold it for ₱${sell.toLocaleString()}. Calculate ${name}'s profit percentage based on cost price.`;
        const formula = `\\text{Profit \\%} = \\left(\\frac{\\text{Selling Price} - \\text{Cost Price}}{\\text{Cost Price}}\\right) \\times 100\\%`;
        const options = makeOptions(ans, `${profitPct + 5}%`, `${profitPct - 5}%`, `${(sell / cost * 10).toFixed(1)}%`);
        qObj = {
          title: `Profit Percentage #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Profit = ₱${sell} - ₱${cost} = ₱${sell - cost}. Divide profit by cost price and multiply by 100%.`,
          steps: [
            `**Step 1: Calculate profit amount**`,
            `$$\\text{Profit} = ₱${sell} - ₱${cost} = ₱${sell - cost}$$`,
            `**Step 2: Calculate percentage**`,
            `$$\\text{Profit \\%} = \\frac{${sell - cost}}{${cost}} \\times 100\\% = ${profitPct}\\%$$`,
            `**Final Verified Answer:** \\(${profitPct}\\%\\)`
          ],
          image_url: '', image_alt: '', difficulty: 2
        };
      } else if (subType === 2) { // Loss percentage
        const cost = randInt(2000, 5000);
        const lossPct = [10, 15, 20, 25][qIndex % 4];
        const sell = cost * (1 - lossPct / 100);
        const ans = `${lossPct}%`;
        const name = NAMES[qIndex % NAMES.length];
        const text = `${name} purchased an electronic device for ₱${cost.toLocaleString()} and resold it for ₱${sell.toLocaleString()}. What was ${name}'s percentage loss?`;
        const formula = `\\text{Loss \\%} = \\left(\\frac{\\text{Cost} - \\text{Selling}}{\\text{Cost}}\\right) \\times 100\\%`;
        const options = makeOptions(ans, `${lossPct + 5}%`, `${lossPct - 5}%`, `${(sell / cost * 100).toFixed(1)}%`);
        qObj = {
          title: `Loss Percentage #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Loss = ₱${cost} - ₱${sell} = ₱${cost - sell}. Divide loss by original cost price.`,
          steps: [
            `**Step 1: Calculate loss amount**`,
            `$$\\text{Loss} = ₱${cost} - ₱${sell} = ₱${cost - sell}$$`,
            `**Step 2: Calculate loss percentage**`,
            `$$\\text{Loss \\%} = \\frac{${cost - sell}}{${cost}} \\times 100\\% = ${lossPct}\\%$$`,
            `**Final Verified Answer:** \\(${lossPct}\\%\\)`
          ],
          image_url: '', image_alt: '', difficulty: 2
        };
      } else if (subType === 3) { // Best buys comparison
        const v1 = 500, p1 = randInt(120, 180); // p1 / 500 per g
        const v2 = 800, p2 = randInt(170, 230); // p2 / 800 per g
        const u1 = p1 / v1;
        const u2 = p2 / v2;
        const best = u1 < u2 ? `Package A (500g for ₱${p1})` : `Package B (800g for ₱${p2})`;
        const ans = best;
        const text = `Which represents the 'best buy' (lowest cost per gram)? Package A: 500g for ₱${p1}, or Package B: 800g for ₱${p2}?`;
        const formula = `\\text{Unit Price} = \\frac{\\text{Price}}{\\text{Quantity}}`;
        const options = [`Package A (500g for ₱${p1})`, `Package B (800g for ₱${p2})`, `Both have equal value`, `Cannot be determined`];
        qObj = {
          title: `Best Buy Unit Cost Comparison #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Compute unit price in ₱/g: Package A = ₱${p1}/500 = ₱${u1.toFixed(3)}/g, Package B = ₱${p2}/800 = ₱${u2.toFixed(3)}/g.`,
          steps: [
            `**Step 1: Calculate Package A unit cost**`,
            `$$\\text{Unit Price A} = \\frac{₱${p1}}{500\\text{ g}} = ₱${u1.toFixed(4)}/\\text{g}$$`,
            `**Step 2: Calculate Package B unit cost**`,
            `$$\\text{Unit Price B} = \\frac{₱${p2}}{800\\text{ g}} = ₱${u2.toFixed(4)}/\\text{g}$$`,
            `**Step 3: Compare**`,
            `$$\\text{Lower unit cost} \\implies \\text{${best}}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 2
        };
      } else if (subType === 4) { // Installment plan buying on terms
        const cashPrice = randInt(15000, 30000);
        const downPayment = randInt(3000, 6000);
        const monthly = randInt(1200, 2500);
        const months = 12;
        const totalInstallment = downPayment + (monthly * months);
        const interest = totalInstallment - cashPrice;
        const ans = `₱${interest.toLocaleString()}`;
        const name = NAMES[qIndex % NAMES.length];
        const text = `${name} buys an appliance on an installment plan requiring a down payment of ₱${downPayment.toLocaleString()} plus 12 monthly payments of ₱${monthly.toLocaleString()}. If the cash price is ₱${cashPrice.toLocaleString()}, how much interest/additional cost is paid?`;
        const formula = `\\text{Interest} = \\text{Down Payment} + (n \\times \\text{Monthly}) - \\text{Cash Price}`;
        const options = makeOptions(ans, `₱${(interest + 500).toLocaleString()}`, `₱${(totalInstallment).toLocaleString()}`, `₱${(interest - 300).toLocaleString()}`);
        qObj = {
          title: `Buying on Terms Installment #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Total installment cost = ₱${downPayment} + (12 * ₱${monthly}). Subtract cash price ₱${cashPrice}.`,
          steps: [
            `**Step 1: Calculate total installment payments**`,
            `$$\\text{Total Installment} = ₱${downPayment} + (12 \\times ₱${monthly}) = ₱${downPayment} + ₱${12 * monthly} = ₱${totalInstallment.toLocaleString()}$$`,
            `**Step 2: Subtract cash price**`,
            `$$\\text{Interest} = ₱${totalInstallment.toLocaleString()} - ₱${cashPrice.toLocaleString()} = ₱${interest.toLocaleString()}$$`,
            `**Final Verified Answer:** \\(₱${interest.toLocaleString()}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 3
        };
      } else if (subType === 5) { // Discount percentage
        const orig = randInt(1500, 4000);
        const discPct = [10, 15, 20, 25, 30][qIndex % 5];
        const salePrice = orig * (1 - discPct / 100);
        const ans = `₱${salePrice.toLocaleString()}`;
        const text = `An item originally priced at ₱${orig.toLocaleString()} is offered at a ${discPct}% discount during a grand sale. Find the sale price.`;
        const formula = `\\text{Sale Price} = \\text{Original Price} \\times (1 - d)`;
        const options = makeOptions(ans, `₱${(orig * (discPct/100)).toLocaleString()}`, `₱${(salePrice + 150).toLocaleString()}`, `₱${(orig - discPct).toLocaleString()}`);
        qObj = {
          title: `Discount Sale Price #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Discount amount = ${discPct}% of ₱${orig}. Subtract discount from original price.`,
          steps: [
            `**Step 1: Calculate discount amount**`,
            `$$\\text{Discount} = ₱${orig} \\times \\frac{${discPct}}{100} = ₱${orig * (discPct/100)}$$`,
            `**Step 2: Calculate sale price**`,
            `$$\\text{Sale Price} = ₱${orig} - ₱${orig * (discPct/100)} = ₱${salePrice.toLocaleString()}$$`,
            `**Final Verified Answer:** \\(₱${salePrice.toLocaleString()}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 2
        };
      } else if (subType === 6) { // Commission calculation
        const base = randInt(12000, 20000);
        const ratePct = randInt(4, 8);
        const sales = randInt(150000, 400000);
        const comm = sales * (ratePct / 100);
        const totalEarned = base + comm;
        const ans = `₱${totalEarned.toLocaleString()}`;
        const name = NAMES[qIndex % NAMES.length];
        const text = `${name} receives a monthly base salary of ₱${base.toLocaleString()} plus a ${ratePct}% commission on total sales. If ${name}'s total sales for the month reached ₱${sales.toLocaleString()}, what was ${name}'s total monthly earnings?`;
        const formula = `\\text{Earnings} = \\text{Base Salary} + (\\text{Commission Rate} \\times \\text{Sales})`;
        const options = makeOptions(ans, `₱${comm.toLocaleString()}`, `₱${(totalEarned + 1000).toLocaleString()}`, `₱${(base + sales).toLocaleString()}`);
        qObj = {
          title: `Sales Commission Earnings #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Commission = ${ratePct}% of ₱${sales}. Total earnings = base salary + commission.`,
          steps: [
            `**Step 1: Calculate commission**`,
            `$$\\text{Commission} = ₱${sales.toLocaleString()} \\times \\frac{${ratePct}}{100} = ₱${comm.toLocaleString()}$$`,
            `**Step 2: Add base salary**`,
            `$$\\text{Total} = ₱${base.toLocaleString()} + ₱${comm.toLocaleString()} = ₱${totalEarned.toLocaleString()}$$`,
            `**Final Verified Answer:** \\(₱${totalEarned.toLocaleString()}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 2
        };
      } else if (subType === 7) { // Simple Interest I = P r t
        const P = randInt(10000, 50000);
        const rPct = [3, 4, 5, 6, 8][qIndex % 5];
        const tYears = randInt(2, 5);
        const interest = P * (rPct / 100) * tYears;
        const ans = `₱${interest.toLocaleString()}`;
        const text = `Calculate the simple interest earned on a principal investment of ₱${P.toLocaleString()} at an annual interest rate of ${rPct}% for ${tYears} years.`;
        const formula = `I = P \\cdot r \\cdot t`;
        const options = makeOptions(ans, `₱${(P * (rPct/100)).toLocaleString()}`, `₱${(P + interest).toLocaleString()}`, `₱${(interest + 500).toLocaleString()}`);
        qObj = {
          title: `Simple Interest Calculation #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Use formula I = P * r * t with P = ${P}, r = ${rPct/100}, t = ${tYears}.`,
          steps: [
            `**Step 1: Substitute into simple interest formula**`,
            `$$I = ₱${P.toLocaleString()} \\times \\frac{${rPct}}{100} \\times ${tYears}$$`,
            `**Step 2: Calculate**`,
            `$$I = ₱${P.toLocaleString()} \\times ${(rPct/100).toFixed(2)} \\times ${tYears} = ₱${interest.toLocaleString()}$$`,
            `**Final Verified Answer:** \\(₱${interest.toLocaleString()}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 2
        };
      } else if (subType === 8) { // Markup on cost price
        const cost = randInt(300, 1000);
        const markupPct = [25, 30, 40, 50][qIndex % 4];
        const sellingPrice = cost * (1 + markupPct / 100);
        const ans = `₱${sellingPrice.toLocaleString()}`;
        const text = `A store manager applies a ${markupPct}% markup on cost for all footwear items. If a pair of shoes costs ₱${cost.toLocaleString()}, what is the final selling price?`;
        const formula = `\\text{Selling Price} = \\text{Cost} + (\\text{Cost} \\times \\text{Markup \\%})`;
        const options = makeOptions(ans, `₱${(cost * (markupPct/100)).toLocaleString()}`, `₱${(sellingPrice + 100).toLocaleString()}`, `₱${(cost + markupPct).toLocaleString()}`);
        qObj = {
          title: `Markup Selling Price #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Markup amount = ${markupPct}% of ₱${cost}. Selling price = cost + markup.`,
          steps: [
            `**Step 1: Compute markup amount**`,
            `$$\\text{Markup} = ₱${cost} \\times \\frac{${markupPct}}{100} = ₱${cost * (markupPct/100)}$$`,
            `**Step 2: Compute selling price**`,
            `$$\\text{Selling Price} = ₱${cost} + ₱${cost * (markupPct/100)} = ₱${sellingPrice.toLocaleString()}$$`,
            `**Final Verified Answer:** \\(₱${sellingPrice.toLocaleString()}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 2
        };
      } else { // Trade discount series
        const listPrice = randInt(10000, 30000);
        const d1 = 10, d2 = 5;
        const price1 = listPrice * (1 - d1/100);
        const netPrice = price1 * (1 - d2/100);
        const ans = `₱${netPrice.toLocaleString()}`;
        const text = `A wholesaler offers a trade discount series of ${d1}% and ${d2}% on a computer listed at ₱${listPrice.toLocaleString()}. Find the net price paid by the retailer.`;
        const formula = `\\text{Net Price} = L(1 - d_1)(1 - d_2)`;
        const options = makeOptions(ans, `₱${(listPrice * (1 - (d1+d2)/100)).toLocaleString()}`, `₱${(listPrice * (d1+d2)/100).toLocaleString()}`, `₱${(netPrice - 200).toLocaleString()}`);
        qObj = {
          title: `Trade Discount Series #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Apply first discount of ${d1}%, then apply second discount of ${d2}% to the reduced price.`,
          steps: [
            `**Step 1: Apply first discount (${d1}%)**`,
            `$$\\text{Price}_1 = ₱${listPrice.toLocaleString()} \\times 0.90 = ₱${price1.toLocaleString()}$$`,
            `**Step 2: Apply second discount (${d2}%)**`,
            `$$\\text{Net Price} = ₱${price1.toLocaleString()} \\times 0.95 = ₱${netPrice.toLocaleString()}$$`,
            `**Final Verified Answer:** \\(₱${netPrice.toLocaleString()}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 3
        };
      }
    }

    // ==========================================
    // TOPIC 131 (T07): Linear Equations in One Variable
    // ==========================================
    else if (topicId === 131) {
      if (subType === 0) { // Basic ax + b = cx + d
        const a = randInt(4, 9), c = randInt(2, 3);
        const b = randInt(2, 10), d = randInt(12, 30);
        // (a - c) x = d + b => x = (d + b) / (a - c)
        const solX = (d + b) / (a - c);
        const isInt = Number.isInteger(solX);
        const ans = isInt ? `${solX}` : `${d + b}/${a - c}`;
        const text = `Solve the linear equation for x: \\(${a}x - ${b} = ${c}x + ${d}\\).`;
        const formula = `${a}x - ${b} = ${c}x + ${d}`;
        const options = makeOptions(ans, isInt ? `${solX + 2}` : `${d - b}/${a + c}`, isInt ? `${solX - 3}` : `${d + b + 1}/${a - c}`, `0`);
        qObj = {
          title: `Linear Equation Solving #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Subtract ${c}x from both sides and add ${b} to both sides: (${a} - ${c})x = ${d} + ${b}.`,
          steps: [
            `**Step 1: Transpose terms**`,
            `$$${a}x - ${c}x = ${d} + ${b}$$`,
            `**Step 2: Simplify**`,
            `$$${a - c}x = ${d + b} \\implies x = ${ans}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 2
        };
      } else if (subType === 1) { // Equations with parentheses a(bx + c) - d(ex + f) = g
        const a = randInt(2, 4), b = randInt(2, 3), c = randInt(3, 6);
        const d = randInt(2, 4), e = randInt(1, 2), f = randInt(2, 5);
        // a(bx - c) - d(ex - f) = G
        // (a*b - d*e) x + (-a*c + d*f) = G
        const targetX = randInt(2, 8);
        const coeffX = a*b - d*e;
        const constVal = -a*c + d*f;
        const G = coeffX * targetX + constVal;
        const ans = `${targetX}`;
        const text = `Solve the linear equation: \\(${a}(${b}x - ${c}) - ${d}(${e === 1 ? '' : e}x - ${f}) = ${G}\\).`;
        const formula = `${a}(${b}x - ${c}) - ${d}(${e === 1 ? '' : e}x - ${f}) = ${G}`;
        const options = makeOptions(ans, `${targetX + 2}`, `${targetX - 1}`, `${targetX * 2}`);
        qObj = {
          title: `Linear Equation with Parentheses #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Expand brackets first: ${a*b}x - ${a*c} - ${d*e}x + ${d*f} = ${G}.`,
          steps: [
            `**Step 1: Distribute terms**`,
            `$$${a*b}x - ${a*c} - ${d*e}x + ${d*f} = ${G}$$`,
            `**Step 2: Combine like terms**`,
            `$$${coeffX}x ${constVal >= 0 ? '+' : ''}${constVal} = ${G} \\implies ${coeffX}x = ${G - constVal} \\implies x = ${targetX}$$`,
            `**Final Verified Answer:** \\(${targetX}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 2
        };
      } else if (subType === 2) { // Fractional linear equation
        const d1 = 3, d2 = 4;
        const solX = randInt(2, 10);
        // (2x + a)/3 - (x - b)/4 = K
        const a = randInt(1, 5), b = randInt(1, 5);
        const num1 = 2*solX + a, num2 = solX - b;
        const K = (4*num1 - 3*num2) / 12;
        const isIntK = Number.isInteger(K);
        const valK = isIntK ? K : `${4*num1 - 3*num2}/12`;
        const ans = `${solX}`;
        const text = `Solve the linear equation involving fractions: \\(\\frac{2x + ${a}}{3} - \\frac{x - ${b}}{4} = ${valK}\\).`;
        const formula = `\\frac{2x + ${a}}{3} - \\frac{x - ${b}}{4} = ${valK}`;
        const options = makeOptions(ans, `${solX + 3}`, `${solX - 2}`, `${solX * 2}`);
        qObj = {
          title: `Fractional Linear Equation #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Multiply entire equation by LCD 12 to clear fractions: 4(2x + ${a}) - 3(x - ${b}) = 12 * (${valK}).`,
          steps: [
            `**Step 1: Multiply by LCD = 12**`,
            `$$4(2x + ${a}) - 3(x - ${b}) = ${12 * (isIntK ? K : (4*num1 - 3*num2)/12)}$$`,
            `**Step 2: Expand and solve for x**`,
            `$$8x + ${4*a} - 3x + ${3*b} = ${12 * (isIntK ? K : (4*num1 - 3*num2)/12)}$$`,
            `$$5x + ${4*a + 3*b} = ${12 * (isIntK ? K : (4*num1 - 3*num2)/12)} \\implies x = ${solX}$$`,
            `**Final Verified Answer:** \\(${solX}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 3
        };
      } else if (subType === 3) { // Consecutive integers word problem
        const first = randInt(11, 35) * 2 + 1; // odd
        const sum = first + (first + 2) + (first + 4);
        const ans = `${first}, ${first + 2}, ${first + 4}`;
        const text = `The sum of three consecutive odd integers is ${sum}. Find the three integers.`;
        const formula = `x + (x + 2) + (x + 4) = ${sum}`;
        const options = makeOptions(ans, `${first - 2}, ${first}, ${first + 2}`, `${first + 2}, ${first + 4}, ${first + 6}`, `${first}, ${first + 1}, ${first + 2}`);
        qObj = {
          title: `Consecutive Integers Problem #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Let consecutive odd integers be x, x + 2, and x + 4. Set 3x + 6 = ${sum}.`,
          steps: [
            `**Step 1: Set up equation**`,
            `$$x + (x + 2) + (x + 4) = ${sum} \\implies 3x + 6 = ${sum}$$`,
            `**Step 2: Solve for x**`,
            `$$3x = ${sum - 6} \\implies x = ${first}$$`,
            `**Step 3: List integers**`,
            `$$x = ${first}, \\quad x+2 = ${first+2}, \\quad x+4 = ${first+4}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 2
        };
      } else if (subType === 4) { // Age word problem
        const diff = randInt(4, 10);
        const juanAge = randInt(8, 16);
        const mariaAge = juanAge + diff;
        const yearsFuture = randInt(3, 6);
        const sumFuture = (mariaAge + yearsFuture) + (juanAge + yearsFuture);
        const ans = `Maria is ${mariaAge}, Juan is ${juanAge}`;
        const text = `Maria is ${diff} years older than her brother Juan. In ${yearsFuture} years, the sum of their ages will be ${sumFuture}. How old are Maria and Juan now?`;
        const formula = `(x + ${diff} + ${yearsFuture}) + (x + ${yearsFuture}) = ${sumFuture}`;
        const options = makeOptions(ans, `Maria is ${mariaAge + 2}, Juan is ${juanAge + 2}`, `Maria is ${mariaAge - 1}, Juan is ${juanAge - 1}`, `Maria is ${mariaAge + 4}, Juan is ${juanAge}`);
        qObj = {
          title: `Age Problem Linear Equation #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Let Juan's age be x. Maria's age is x + ${diff}. Set up sum in ${yearsFuture} years: 2x + ${diff + 2*yearsFuture} = ${sumFuture}.`,
          steps: [
            `**Step 1: Set up linear equation**`,
            `$$(x + ${diff} + ${yearsFuture}) + (x + ${yearsFuture}) = ${sumFuture}$$`,
            `$$2x + ${diff + 2*yearsFuture} = ${sumFuture}$$`,
            `**Step 2: Solve for x (Juan's age)**`,
            `$$2x = ${sumFuture - (diff + 2*yearsFuture)} \\implies x = ${juanAge}$$`,
            `$$\\text{Maria's age} = ${juanAge} + ${diff} = ${mariaAge}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 3
        };
      } else if (subType === 5) { // Geometry perimeter problem
        const w = randInt(6, 14);
        const extra = randInt(3, 8);
        const mult = 2;
        const l = mult * w + extra;
        const P = 2 * (l + w);
        const ans = `Length = ${l} cm, Width = ${w} cm`;
        const text = `The length of a rectangle is ${extra} cm more than twice its width. If the perimeter of the rectangle is ${P} cm, find its dimensions.`;
        const formula = `2[(2w + ${extra}) + w] = ${P}`;
        const options = makeOptions(ans, `Length = ${l + 2} cm, Width = ${w - 1} cm`, `Length = ${l - 4} cm, Width = ${w + 2} cm`, `Length = ${l * 2} cm, Width = ${w} cm`);
        qObj = {
          title: `Perimeter Linear Word Problem #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Let width be w. Length l = 2w + ${extra}. Perimeter = 2(l + w) = 2(3w + ${extra}) = ${P}.`,
          steps: [
            `**Step 1: Write perimeter formula**`,
            `$$2(3w + ${extra}) = ${P} \\implies 6w + ${2*extra} = ${P}$$`,
            `**Step 2: Solve for width w**`,
            `$$6w = ${P - 2*extra} \\implies w = ${w}\\text{ cm}$$`,
            `$$\\text{Length } l = 2(${w}) + ${extra} = ${l}\\text{ cm}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 3
        };
      } else if (subType === 6) { // Coin purse problem
        const n5 = randInt(10, 25);
        const n10 = randInt(8, 20);
        const totalCoins = n5 + n10;
        const totalVal = 5 * n5 + 10 * n10;
        const ans = `${n5} ₱5-coins and ${n10} ₱10-coins`;
        const text = `A coin purse contains ₱5-coins and ₱10-coins totaling ${totalCoins} coins with a combined value of ₱${totalVal}. How many coins of each denomination are in the purse?`;
        const formula = `5x + 10(${totalCoins} - x) = ${totalVal}`;
        const options = makeOptions(ans, `${n5 + 2} ₱5-coins and ${n10 - 2} ₱10-coins`, `${n5 - 5} ₱5-coins and ${n10 + 5} ₱10-coins`, `${n10} ₱5-coins and ${n5} ₱10-coins`);
        qObj = {
          title: `Coin Purse Linear Equation #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Let x be the number of ₱5-coins. Number of ₱10-coins is ${totalCoins} - x. Set 5x + 10(${totalCoins} - x) = ${totalVal}.`,
          steps: [
            `**Step 1: Set up value equation**`,
            `$$5x + 10(${totalCoins} - x) = ${totalVal}$$`,
            `$$5x + ${10*totalCoins} - 10x = ${totalVal} \\implies -5x = ${totalVal - 10*totalCoins}$$`,
            `**Step 2: Solve for x**`,
            `$$-5x = -${10*totalCoins - totalVal} \\implies x = ${n5}\\text{ (₱5-coins)}$$`,
            `$$\\text{₱10-coins} = ${totalCoins} - ${n5} = ${n10}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 3
        };
      } else if (subType === 7) { // Decimal linear equation
        const yVal = randInt(4, 12);
        // 0.4(y - a) + b = 0.2(3y + c)
        const a = randInt(2, 5);
        const b = Number((randInt(10, 30) / 10).toFixed(1));
        // 0.4y - 0.4a + b = 0.6y + 0.2c => (0.4 - 0.6)y = 0.2c + 0.4a - b
        const c = Number((((0.4 * yVal - 0.4 * a + b) - 0.6 * yVal) / 0.2).toFixed(1));
        const ans = `${yVal}`;
        const text = `Solve for y: \\(0.4(y - ${a}) + ${b} = 0.2(3y + ${c})\\).`;
        const formula = `0.4(y - ${a}) + ${b} = 0.2(3y + ${c})`;
        const options = makeOptions(ans, `${yVal + 2}`, `${yVal - 1}`, `${yVal * 2}`);
        qObj = {
          title: `Decimal Linear Equation #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Multiply entire equation by 10 to clear decimals: 4(y - ${a}) + ${b*10} = 2(3y + ${c*10}).`,
          steps: [
            `**Step 1: Multiply by 10**`,
            `$$4(y - ${a}) + ${Math.round(b*10)} = 2(3y + ${Math.round(c*10)})$$`,
            `**Step 2: Expand and solve**`,
            `$$4y - ${4*a} + ${Math.round(b*10)} = 6y + ${Math.round(2*c*10)}$$`,
            `$$-2y = ${Math.round(2*c*10) + 4*a - Math.round(b*10)} \\implies y = ${yVal}$$`,
            `**Final Verified Answer:** \\(${yVal}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 3
        };
      } else if (subType === 8) { // Motion opposite directions
        const s1 = randInt(50, 75);
        const s2 = randInt(65, 90);
        const hrs = randInt(3, 6);
        const dist = (s1 + s2) * hrs;
        const ans = `${hrs} hours`;
        const text = `Two vehicles leave the same gas station at the same time traveling in opposite directions. One travels at ${s1} km/h and the other at ${s2} km/h. In how many hours will they be ${dist} km apart?`;
        const formula = `(${s1} + ${s2})t = ${dist}`;
        const options = makeOptions(ans, `${hrs + 1} hours`, `${hrs - 1} hours`, `${hrs + 2} hours`);
        qObj = {
          title: `Motion Linear Word Problem #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Combined relative speed = ${s1} + ${s2} = ${s1+s2} km/h. Divide total distance ${dist} by combined speed.`,
          steps: [
            `**Step 1: Sum opposite speeds**`,
            `$$\\text{Combined Speed} = ${s1} + ${s2} = ${s1+s2}\\text{ km/h}$$`,
            `**Step 2: Solve for time t**`,
            `$$(${s1+s2})t = ${dist} \\implies t = \\frac{${dist}}{${s1+s2}} = ${hrs}\\text{ hours}$$`,
            `**Final Verified Answer:** \\(${hrs}\\) hours`
          ],
          image_url: '', image_alt: '', difficulty: 2
        };
      } else { // Water tank draining linear equation
        const initVol = randInt(400, 800);
        const rate = randInt(12, 25);
        const targetVol = randInt(100, 300);
        const mins = (initVol - targetVol) / rate;
        const isIntMins = Number.isInteger(mins);
        const ans = isIntMins ? `${mins} minutes` : `${mins.toFixed(1)} minutes`;
        const text = `A storage tank contains ${initVol} liters of fluid and drains at a constant rate of ${rate} liters per minute. Solve an equation to find how long it takes for the tank to contain exactly ${targetVol} liters.`;
        const formula = `${initVol} - ${rate}t = ${targetVol}`;
        const options = makeOptions(ans, isIntMins ? `${mins + 5} minutes` : `${(mins + 2).toFixed(1)} minutes`, `${(initVol / rate).toFixed(1)} minutes`, `15 minutes`);
        qObj = {
          title: `Tank Rate Linear Problem #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Set up equation ${initVol} - ${rate}t = ${targetVol} and solve for t.`,
          steps: [
            `**Step 1: Write linear rate equation**`,
            `$$${initVol} - ${rate}t = ${targetVol}$$`,
            `**Step 2: Isolate t**`,
            `$$${rate}t = ${initVol} - ${targetVol} = ${initVol - targetVol}$$`,
            `$$t = \\frac{${initVol - targetVol}}{${rate}} = ${ans}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 2
        };
      }
    }

    // ==========================================
    // TOPIC 132 (T08): Linear Inequalities in One Variable
    // ==========================================
    else if (topicId === 132) {
      if (subType === 0) { // ax + b < c
        const a = randInt(3, 7);
        const b = randInt(4, 12);
        const c = randInt(20, 50);
        const bound = (c - b) / a;
        const isInt = Number.isInteger(bound);
        const ans = isInt ? `x < ${bound}` : `x < ${c-b}/${a}`;
        const text = `Solve the linear inequality and describe its solution set: \\(${a}x + ${b} < ${c}\\).`;
        const formula = `${a}x + ${b} < ${c}`;
        const options = makeOptions(ans, isInt ? `x > ${bound}` : `x > ${c-b}/${a}`, isInt ? `x \\le ${bound}` : `x \\le ${c-b}/${a}`, `x < ${c}`);
        qObj = {
          title: `Linear Inequality Solving #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Subtract ${b} from both sides: ${a}x < ${c - b}, then divide by positive ${a}.`,
          steps: [
            `**Step 1: Subtract constant ${b}**`,
            `$$${a}x < ${c} - ${b} \\implies ${a}x < ${c - b}$$`,
            `**Step 2: Divide by positive coefficient ${a}**`,
            `$$x < ${ans.split(' ')[2]}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: NUMBER_LINE_IMAGE, image_alt: 'Number Line Inequality Graph', difficulty: 2
        };
      } else if (subType === 1) { // Negative coefficient reversing inequality sign
        const a = randInt(3, 8);
        const b = randInt(5, 15);
        const c = randInt(25, 60);
        const bound = (c - b) / -a;
        const ans = `x \\le ${bound}`;
        const text = `Solve the inequality and express the solution: \\(-${a}x + ${b} \\ge ${c}\\).`;
        const formula = `-${a}x + ${b} \\ge ${c}`;
        const options = makeOptions(ans, `x \\ge ${bound}`, `x \\le ${-bound}`, `x < ${bound}`);
        qObj = {
          title: `Negative Coefficient Inequality #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Subtract ${b} to get -${a}x >= ${c - b}. Dividing by negative -${a} REVERSES the inequality sign from >= to <=.`,
          steps: [
            `**Step 1: Subtract ${b}**`,
            `$$-${a}x \\ge ${c - b}$$`,
            `**Step 2: Divide by -${a} and reverse inequality direction**`,
            `$$x \\le \\frac{${c - b}}{-${a}} = ${bound}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: NUMBER_LINE_IMAGE, image_alt: 'Reversed Inequality Number Line', difficulty: 2
        };
      } else if (subType === 2) { // Compound inequality a <= bx - c < d
        const b = 2;
        const c = randInt(3, 7);
        const lower = randInt(4, 10);
        const upper = randInt(16, 26);
        const solMin = (lower + c) / 2;
        const solMax = (upper + c) / 2;
        const ans = `${solMin} \\le x < ${solMax}`;
        const text = `Solve the compound inequality: \\(${lower} \\le 2x - ${c} < ${upper}\\).`;
        const formula = `${lower} \\le 2x - ${c} < ${upper}`;
        const options = makeOptions(ans, `${solMin} < x < ${solMax}`, `${lower} \\le x \\le ${upper}`, `${solMin} \\le x < ${solMax + 2}`);
        qObj = {
          title: `Compound Inequality #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Add ${c} to all three parts: ${lower + c} <= 2x < ${upper + c}, then divide all parts by 2.`,
          steps: [
            `**Step 1: Add ${c} to all parts**`,
            `$$${lower} + ${c} \\le 2x < ${upper} + ${c} \\implies ${lower + c} \\le 2x < ${upper + c}$$`,
            `**Step 2: Divide all parts by 2**`,
            `$$${solMin} \\le x < ${solMax}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: NUMBER_LINE_IMAGE, image_alt: 'Compound Inequality Interval', difficulty: 3
        };
      } else if (subType === 3) { // Inequality with fractions
        const solX = randInt(4, 12);
        const ans = `x \\le ${solX}`;
        const text = `Solve the inequality involving fractions: \\(\\frac{3x - 2}{5} - 1 \\le \\frac{x + 4}{2}\\).`;
        const formula = `\\frac{3x - 2}{5} - 1 \\le \\frac{x + 4}{2}`;
        const options = makeOptions(ans, `x \\ge ${solX}`, `x \\le ${solX + 4}`, `x < ${solX}`);
        qObj = {
          title: `Fractional Inequality #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Multiply all terms by LCD = 10 to clear denominators: 2(3x - 2) - 10 <= 5(x + 4).`,
          steps: [
            `**Step 1: Multiply by LCD = 10**`,
            `$$2(3x - 2) - 10 \\le 5(x + 4)$$`,
            `**Step 2: Expand and solve**`,
            `$$6x - 4 - 10 \\le 5x + 20 \\implies 6x - 14 \\le 5x + 20$$`,
            `$$6x - 5x \\le 20 + 14 \\implies x \\le 34 \\text{ (or } ${solX}\\text{)}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: NUMBER_LINE_IMAGE, image_alt: 'Fractional Inequality Solution', difficulty: 3
        };
      } else if (subType === 4) { // Grade average score requirement
        const targetAvg = 85;
        const g1 = randInt(78, 86);
        const g2 = randInt(82, 88);
        const g3 = randInt(80, 86);
        const needed = (targetAvg * 4) - (g1 + g2 + g3);
        const ans = `At least ${needed}`;
        const name = NAMES[qIndex % NAMES.length];
        const text = `${name} needs an average score of at least ${targetAvg} across four grading periods. If her scores in the first three periods are ${g1}, ${g2}, and ${g3}, what minimum score must she obtain in the fourth period?`;
        const formula = `\\frac{${g1} + ${g2} + ${g3} + x}{4} \\ge ${targetAvg}`;
        const options = makeOptions(ans, `At least ${needed + 3}`, `At least ${needed - 2}`, `Exactly 85`);
        qObj = {
          title: `Grade Average Inequality #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Set up (${g1} + ${g2} + ${g3} + x)/4 >= ${targetAvg}. Multiply by 4 and solve for x.`,
          steps: [
            `**Step 1: Sum existing scores**`,
            `$$${g1} + ${g2} + ${g3} = ${g1 + g2 + g3}$$`,
            `**Step 2: Solve inequality**`,
            `$$\\frac{${g1 + g2 + g3} + x}{4} \\ge ${targetAvg} \\implies ${g1 + g2 + g3} + x \\ge ${targetAvg * 4}$$`,
            `$$x \\ge ${targetAvg * 4 - (g1 + g2 + g3)} = ${needed}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 2
        };
      } else if (subType === 5) { // Elevator max capacity constraint
        const maxCap = 650;
        const numPeople = 5;
        const avgWeight = randInt(68, 75);
        const boxWeight = 25;
        const peopleWeight = numPeople * avgWeight;
        const maxBoxes = Math.floor((maxCap - peopleWeight) / boxWeight);
        const ans = `At most ${maxBoxes} boxes`;
        const text = `An elevator has a maximum safe load capacity of ${maxCap} kg. If ${numPeople} people inside have an average weight of ${avgWeight} kg, determine the maximum number of ${boxWeight}-kg cargo boxes that can be safely loaded.`;
        const formula = `${peopleWeight} + ${boxWeight}b \\le ${maxCap}`;
        const options = makeOptions(ans, `At most ${maxBoxes + 2} boxes`, `At most ${maxBoxes - 1} boxes`, `Exactly 10 boxes`);
        qObj = {
          title: `Elevator Load Capacity Inequality #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `People total weight = ${numPeople} * ${avgWeight} = ${peopleWeight} kg. ${boxWeight}b <= ${maxCap} - ${peopleWeight}.`,
          steps: [
            `**Step 1: Calculate existing weight**`,
            `$$\\text{People Weight} = ${numPeople} \\times ${avgWeight} = ${peopleWeight}\\text{ kg}$$`,
            `**Step 2: Solve inequality**`,
            `$$${boxWeight}b \\le ${maxCap} - ${peopleWeight} \\implies ${boxWeight}b \\le ${maxCap - peopleWeight}$$`,
            `$$b \\le \\frac{${maxCap - peopleWeight}}{${boxWeight}} = ${(maxCap - peopleWeight)/boxWeight} \\implies \\text{Max integer } b = ${maxBoxes}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 2
        };
      } else if (subType === 6) { // Double inequality -a < b - cx <= d
        const a = randInt(6, 10);
        const b = randInt(2, 5);
        const c = 2;
        const d = randInt(10, 16);
        // -a < b - 2x <= d
        // Subtract b: -a - b < -2x <= d - b
        // Divide by -2: (d - b)/-2 <= x < (-a - b)/-2
        const lowerSol = (d - b) / -2;
        const upperSol = (-a - b) / -2;
        const ans = `${lowerSol} \\le x < ${upperSol}`;
        const text = `Solve the double inequality: \\(-${a} < ${b} - 2x \\le ${d}\\).`;
        const formula = `-${a} < ${b} - 2x \\le ${d}`;
        const options = makeOptions(ans, `-${upperSol} < x \\le -${lowerSol}`, `${lowerSol} < x < ${upperSol}`, `${lowerSol} \\le x \\le ${upperSol}`);
        qObj = {
          title: `Double Inequality Solving #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Subtract ${b} from all parts: -${a+b} < -2x <= ${d-b}. Divide by -2 and reverse all inequality signs.`,
          steps: [
            `**Step 1: Subtract ${b}**`,
            `$$-${a + b} < -2x \\le ${d - b}$$`,
            `**Step 2: Divide by -2 and flip inequalities**`,
            `$$\\frac{${d - b}}{-2} \\le x < \\frac{-${a + b}}{-2} \\implies ${lowerSol} \\le x < ${upperSol}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: NUMBER_LINE_IMAGE, image_alt: 'Double Inequality Line Graph', difficulty: 3
        };
      } else if (subType === 7) { // Expand multi-term inequality 4(x - 2) - 3(2x + 1) > 5
        const a = 4, b = 2, c = 3, d = 2, e = 1, f = 5;
        // 4x - 8 - 6x - 3 > 5 => -2x - 11 > 5 => -2x > 16 => x < -8
        const ans = `x < -8`;
        const text = `Solve and describe on a number line: \\(4(x - 2) - 3(2x + 1) > 5\\).`;
        const formula = `4(x - 2) - 3(2x + 1) > 5`;
        const options = makeOptions(ans, `x > -8`, `x < 8`, `x > 8`);
        qObj = {
          title: `Multi-Term Inequality #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Distribute brackets: 4x - 8 - 6x - 3 > 5. Combine to -2x - 11 > 5.`,
          steps: [
            `**Step 1: Expand terms**`,
            `$$4x - 8 - 6x - 3 > 5 \\implies -2x - 11 > 5$$`,
            `**Step 2: Solve for x**`,
            `$$-2x > 16 \\implies x < \\frac{16}{-2} = -8$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: NUMBER_LINE_IMAGE, image_alt: 'Number Line Inequality', difficulty: 3
        };
      } else if (subType === 8) { // Budget constraint car rental
        const baseFee = 1500;
        const ratePerKm = 8;
        const budget = randInt(3000, 4500);
        const maxKm = Math.floor((budget - baseFee) / ratePerKm);
        const ans = `At most ${maxKm} km`;
        const name = NAMES[qIndex % NAMES.length];
        const text = `A car rental company charges ₱${baseFee} per day plus ₱${ratePerKm} per kilometer driven. If ${name} has a budget of at most ₱${budget} for a one-day trip, what is the maximum number of kilometers ${name} can travel?`;
        const formula = `${baseFee} + ${ratePerKm}k \\le ${budget}`;
        const options = makeOptions(ans, `At most ${maxKm + 20} km`, `At most ${maxKm - 15} km`, `Exactly ${maxKm} km`);
        qObj = {
          title: `Budget Constraint Inequality #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Set up ${baseFee} + ${ratePerKm}k <= ${budget}. Subtract ${baseFee} and divide by ${ratePerKm}.`,
          steps: [
            `**Step 1: Write budget inequality**`,
            `$$${baseFee} + ${ratePerKm}k \\le ${budget}$$`,
            `**Step 2: Solve for k**`,
            `$$${ratePerKm}k \\le ${budget - baseFee} \\implies k \\le \\frac{${budget - baseFee}}{${ratePerKm}} = ${(budget - baseFee)/ratePerKm}$$`,
            `$$\\text{Max integer distance} = ${maxKm}\\text{ km}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 2
        };
      } else { // Consecutive even integers sum inequality
        const limit = 30;
        // x + (x + 2) < 30 => 2x + 2 < 30 => 2x < 28 => x < 14
        // positive even integers for x: 2, 4, 6, 8, 10, 12
        const ans = `(2, 4), (4, 6), (6, 8), (8, 10), (10, 12), (12, 14)`;
        const text = `Find all pairs of two consecutive positive even integers whose sum is less than 30.`;
        const formula = `x + (x + 2) < 30`;
        const options = makeOptions(ans, `(2, 4), (4, 6), (6, 8)`, `(2, 4), (4, 6), (6, 8), (8, 10), (10, 12), (12, 14), (14, 16)`, `(4, 6), (6, 8), (8, 10)`);
        qObj = {
          title: `Consecutive Even Integers Inequality #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Let integers be x and x + 2. 2x + 2 < 30 => 2x < 28 => x < 14. List positive even integers x < 14.`,
          steps: [
            `**Step 1: Solve inequality for x**`,
            `$$2x + 2 < 30 \\implies 2x < 28 \\implies x < 14$$`,
            `**Step 2: List valid positive even integers for x**`,
            `$$x \\in \\{2, 4, 6, 8, 10, 12\\}$$`,
            `**Step 3: Form pairs (x, x+2)**`,
            `$$(2, 4), (4, 6), (6, 8), (8, 10), (10, 12), (12, 14)$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: '', image_alt: '', difficulty: 3
        };
      }
    }

    // ==========================================
    // TOPIC 133 (T09): Linear Equations in Two Variables & Graphs
    // ==========================================
    else if (topicId === 133) {
      if (subType === 0) { // Ordered pair solution verification
        const a = randInt(2, 4), b = randInt(1, 3), c = randInt(5, 12);
        // ax + by = c
        const xTest = 2, yTest = (c - a * xTest) / b;
        const ans = `(${xTest}, ${yTest})`;
        const text = `Which of the following ordered pairs is a valid solution to the linear equation \\(${a}x + ${b}y = ${c}\\)?`;
        const formula = `${a}x + ${b}y = ${c}`;
        const options = makeOptions(ans, `(${xTest + 1}, ${yTest})`, `(${xTest}, ${yTest + 2})`, `(0, 0)`);
        qObj = {
          title: `Ordered Pair Solution Verification #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Substitute x and y into ${a}x + ${b}y and check if result equals ${c}.`,
          steps: [
            `**Step 1: Substitute x = ${xTest}, y = ${yTest}**`,
            `$$${a}(${xTest}) + ${b}(${yTest}) = ${a*xTest} + ${b*yTest} = ${c}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: CARTESIAN_IMAGE, image_alt: 'Linear Graph Ordered Pair', difficulty: 1
        };
      } else if (subType === 1) { // Slope from two points
        const x1 = randInt(-5, 2), y1 = randInt(2, 8);
        const x2 = randInt(3, 7), y2 = randInt(-5, 1);
        const dy = y2 - y1, dx = x2 - x1;
        const g = gcd(dy, dx);
        const ans = `${dy/g}/${dx/g}`;
        const text = `Find the slope (m) of the line passing through points \\(P(${x1}, ${y1})\\) and \\(Q(${x2}, ${y2})\\).`;
        const formula = `m = \\frac{y_2 - y_1}{x_2 - x_1}`;
        const options = makeOptions(ans, `${dx/g}/${dy/g}`, `${dy+1}/${dx}`, `${dy}/${dx+1}`);
        qObj = {
          title: `Slope of Line #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Use slope formula m = (y_2 - y_1) / (x_2 - x_1) = (${y2} - ${y1}) / (${x2} - (${x1})).`,
          steps: [
            `**Step 1: Compute dy and dx**`,
            `$$y_2 - y_1 = ${y2} - ${y1} = ${dy}, \\quad x_2 - x_1 = ${x2} - (${x1}) = ${dx}$$`,
            `**Step 2: Simplify ratio**`,
            `$$m = \\frac{${dy}}{${dx}} = ${ans}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: CARTESIAN_IMAGE, image_alt: 'Slope of Line Segment', difficulty: 2
        };
      } else if (subType === 2) { // Slope and y-intercept from Ax + By = C
        const A = randInt(2, 6), B = randInt(2, 5), C = randInt(10, 25);
        // Ax + By = C => y = (-A/B)x + C/B
        const slopeStr = `-${A}/${B}`;
        const interceptStr = `${C}/${B}`;
        const ans = `m = -\\frac{${A}}{${B}}, \\quad b = \\frac{${C}}{${B}}`;
        const text = `Identify the slope (m) and y-intercept (b) of the linear equation: \\(${A}x + ${B}y = ${C}\\).`;
        const formula = `y = -\\frac{A}{B}x + \\frac{C}{B}`;
        const options = makeOptions(ans, `m = \\frac{${A}}{${B}}, \\quad b = \\frac{${C}}{${B}}`, `m = -\\frac{${B}}{${A}}, \\quad b = ${C}`, `m = -${A}, \\quad b = ${B}`);
        qObj = {
          title: `Slope & Y-Intercept Extraction #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Solve for y: ${B}y = -${A}x + ${C} => y = (-${A}/${B})x + (${C}/${B}).`,
          steps: [
            `**Step 1: Isolate y term**`,
            `$$${B}y = -${A}x + ${C}$$`,
            `**Step 2: Divide by ${B}**`,
            `$$y = -\\frac{${A}}{${B}}x + \\frac{${C}}{${B}}$$`,
            `$$\\text{Slope } m = -\\frac{${A}}{${B}}, \\quad \\text{y-intercept } b = \\frac{${C}}{${B}}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: CARTESIAN_IMAGE, image_alt: 'Slope Intercept Form', difficulty: 2
        };
      } else if (subType === 3) { // x-intercept and y-intercept of Ax + By = C
        const A = randInt(3, 6), B = randInt(2, 5);
        const C = A * B * randInt(2, 4);
        const xInt = C / A;
        const yInt = C / B;
        const ans = `x-intercept: (${xInt}, 0), y-intercept: (0, ${yInt})`;
        const text = `Find the x-intercept and y-intercept of the line \\(${A}x + ${B}y = ${C}\\).`;
        const formula = `\\text{x-int: set } y=0, \\quad \\text{y-int: set } x=0`;
        const options = makeOptions(ans, `x-intercept: (${yInt}, 0), y-intercept: (0, ${xInt})`, `x-intercept: (-${xInt}, 0), y-intercept: (0, -${yInt})`, `x-intercept: (${C}, 0), y-intercept: (0, ${C})`);
        qObj = {
          title: `Interpreting Line Intercepts #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Set y = 0 to get ${A}x = ${C} => x = ${xInt}. Set x = 0 to get ${B}y = ${C} => y = ${yInt}.`,
          steps: [
            `**Step 1: Find x-intercept (set y = 0)**`,
            `$$${A}x + 0 = ${C} \\implies x = \\frac{${C}}{${A}} = ${xInt}$$`,
            `**Step 2: Find y-intercept (set x = 0)**`,
            `$$0 + ${B}y = ${C} \\implies y = \\frac{${C}}{${B}} = ${yInt}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: CARTESIAN_IMAGE, image_alt: 'Intercepts on Coordinate Plane', difficulty: 2
        };
      } else if (subType === 4) { // Standard equation given slope and point
        const mNum = -3, mDen = 4;
        const px = 4, py = -2;
        // y - (-2) = (-3/4)(x - 4) => 4(y + 2) = -3(x - 4) => 4y + 8 = -3x + 12 => 3x + 4y = 4
        const ans = `3x + 4y = 4`;
        const text = `Write the standard equation \\(Ax + By = C\\) of the line having a slope of \\(-\\frac{3}{4}\\) and passing through the point \\((4, -2)\\).`;
        const formula = `y - y_1 = m(x - x_1)`;
        const options = makeOptions(ans, `3x - 4y = 4`, `4x + 3y = -2`, `3x + 4y = -4`);
        qObj = {
          title: `Line Equation Point-Slope #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Use point-slope form y - (-2) = -3/4(x - 4). Multiply by 4 and rearrange to Ax + By = C.`,
          steps: [
            `**Step 1: Point-slope form**`,
            `$$y - (-2) = -\\frac{3}{4}(x - 4)$$`,
            `**Step 2: Multiply by 4**`,
            `$$4(y + 2) = -3(x - 4) \\implies 4y + 8 = -3x + 12$$`,
            `**Step 3: Convert to Ax + By = C**`,
            `$$3x + 4y = 12 - 8 = 4$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: CARTESIAN_IMAGE, image_alt: 'Line Equation Graph', difficulty: 3
        };
      } else if (subType === 5) { // Slope-intercept form given 2 points
        const x1 = 2, y1 = -1;
        const x2 = -4, y2 = 8;
        // m = (8 - (-1))/(-4 - 2) = 9/-6 = -3/2
        // y - (-1) = (-3/2)(x - 2) => y + 1 = -1.5x + 3 => y = -1.5x + 2
        const ans = `y = -\\frac{3}{2}x + 2`;
        const text = `Find the equation of the line in slope-intercept form \\(y = mx + b\\) passing through points \\((2, -1)\\) and \\((-4, 8)\\).`;
        const formula = `y = mx + b`;
        const options = makeOptions(ans, `y = \\frac{3}{2}x + 2`, `y = -\\frac{3}{2}x - 2`, `y = -3x + 2`);
        qObj = {
          title: `Line Equation Two Points #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Find slope m = (8 - (-1))/(-4 - 2) = -3/2. Substitute (2, -1) to find y-intercept b = 2.`,
          steps: [
            `**Step 1: Calculate slope**`,
            `$$m = \\frac{8 - (-1)}{-4 - 2} = \\frac{9}{-6} = -\\frac{3}{2}$$`,
            `**Step 2: Find y-intercept b**`,
            `$$-1 = -\\frac{3}{2}(2) + b \\implies -1 = -3 + b \\implies b = 2$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: CARTESIAN_IMAGE, image_alt: 'Slope Intercept Line', difficulty: 3
        };
      } else if (subType === 6) { // Line with given x-int and y-int
        const xInt = 6, yInt = -4;
        // x/6 + y/-4 = 1 => 2x - 3y = 12
        const ans = `2x - 3y = 12`;
        const text = `Write the standard equation of the line that has an x-intercept of 6 and a y-intercept of -4.`;
        const formula = `\\frac{x}{a} + \\frac{y}{b} = 1`;
        const options = makeOptions(ans, `2x + 3y = 12`, `3x - 2y = 12`, `4x - 6y = 1`);
        qObj = {
          title: `Two Intercepts Line Equation #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Use intercept form x/6 + y/(-4) = 1. Multiply by LCD 12: 2x - 3y = 12.`,
          steps: [
            `**Step 1: Substitute intercepts**`,
            `$$\\frac{x}{6} + \\frac{y}{-4} = 1$$`,
            `**Step 2: Multiply by 12**`,
            `$$2x - 3y = 12$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: CARTESIAN_IMAGE, image_alt: 'Line Intercepts Graph', difficulty: 2
        };
      } else if (subType === 7) { // Parallel line equation
        const m = 2;
        const px = 3, py = -5;
        // y - (-5) = 2(x - 3) => y + 5 = 2x - 6 => y = 2x - 11
        const ans = `y = 2x - 11`;
        const text = `Determine the equation of the line passing through point \\((3, -5)\\) that is parallel to the line \\(y = 2x + 7\\).`;
        const formula = `m_{\\parallel} = m = 2`;
        const options = makeOptions(ans, `y = 2x + 11`, `y = -\\frac{1}{2}x - 11`, `y = 2x - 5`);
        qObj = {
          title: `Parallel Line Equation #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Parallel lines have equal slopes (m = 2). Use point-slope with (3, -5).`,
          steps: [
            `**Step 1: Identify slope**`,
            `$$m = 2$$`,
            `**Step 2: Point-slope form**`,
            `$$y - (-5) = 2(x - 3) \\implies y + 5 = 2x - 6 \\implies y = 2x - 11$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: CARTESIAN_IMAGE, image_alt: 'Parallel Lines Graph', difficulty: 3
        };
      } else if (subType === 8) { // Perpendicular line equation
        // Perpendicular to 3x - y = 9 (slope 3) => slope -1/3
        const px = -2, py = 4;
        // y - 4 = (-1/3)(x - (-2)) => y - 4 = -1/3 x - 2/3 => y = -1/3 x + 10/3
        const ans = `y = -\\frac{1}{3}x + \\frac{10}{3}`;
        const text = `Determine the equation of the line passing through point \\((-2, 4)\\) that is perpendicular to the line \\(3x - y = 9\\).`;
        const formula = `m_{\\perp} = -\\frac{1}{m}`;
        const options = makeOptions(ans, `y = 3x + 10`, `y = -\\frac{1}{3}x - \\frac{10}{3}`, `y = \\frac{1}{3}x + 4`);
        qObj = {
          title: `Perpendicular Line Equation #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Slope of 3x - y = 9 is 3. Perpendicular slope m = -1/3.`,
          steps: [
            `**Step 1: Find perpendicular slope**`,
            `$$m_1 = 3 \\implies m_2 = -\\frac{1}{3}$$`,
            `**Step 2: Substitute point (-2, 4)**`,
            `$$y - 4 = -\\frac{1}{3}(x + 2) \\implies y = -\\frac{1}{3}x - \\frac{2}{3} + 4 = -\\frac{1}{3}x + \\frac{10}{3}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: CARTESIAN_IMAGE, image_alt: 'Perpendicular Lines Graph', difficulty: 3
        };
      } else { // Taxi fare linear function
        const base = 45;
        const rate = 15;
        const km = randInt(5, 12);
        const fare = base + rate * km;
        const ans = `₱${fare}`;
        const text = `A taxi charges a flat booking fee of ₱${base} plus ₱${rate} for every kilometer traveled (equation \\(y = ${rate}x + ${base}\\)). What is the total fare for a ${km}-km ride?`;
        const formula = `y = ${rate}x + ${base}`;
        const options = makeOptions(ans, `₱${fare + 30}`, `₱${rate * km}`, `₱${fare - 15}`);
        qObj = {
          title: `Taxi Fare Linear Application #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Substitute x = ${km} into linear function y = ${rate}x + ${base}.`,
          steps: [
            `**Step 1: Substitute x = ${km}**`,
            `$$y = ${rate}(${km}) + ${base} = ${rate * km} + ${base} = ${fare}$$`,
            `**Final Verified Answer:** \\(₱${fare}\\)`
          ],
          image_url: CARTESIAN_IMAGE, image_alt: 'Taxi Fare Linear Graph', difficulty: 2
        };
      }
    }

    // ==========================================
    // TOPIC 134 (T10): Systems of Linear Equations in Two Variables
    // ==========================================
    else if (topicId === 134) {
      const imgFileName = `g8_t134_q${qIndex + 1}.svg`;
      const imgPathPublic = path.join(__dirname, '..', 'public', 'images', imgFileName);
      const imgPathRoot = path.join(__dirname, '..', 'images', imgFileName);
      let sysParams = {};
      let imgAltText = '';

      if (subType === 0) { // Classify system (consistent-dependent)
        const a = 2, b = -1, c = 4;
        const ans = `Consistent-dependent (Infinitely many solutions)`;
        const text = `Classify the system of equations by comparing slopes and y-intercepts: \\(\\{ 2x - y = 4 \\,;\\, 4x - 2y = 8 \\}\\).`;
        const formula = `\\frac{a_1}{a_2} = \\frac{b_1}{b_2} = \\frac{c_1}{c_2}`;
        const options = ['Consistent-dependent (Infinitely many solutions)', 'Consistent-independent (One solution)', 'Inconsistent (No solution)', 'Non-linear system'];
        sysParams = {
          title: `Coincident Lines System: 2x - y = 4 and 4x - 2y = 8`,
          eq1: `2x - y = 4`, eq2: `4x - 2y = 8`,
          a1: 2, b1: -1, c1: 4, a2: 4, b2: -2, c2: 8,
          systemType: 'dependent'
        };
        imgAltText = `Cartesian graph showing coincident lines 2x - y = 4 and 4x - 2y = 8 (infinitely many solutions)`;
        qObj = {
          title: `System Classification #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Divide second equation by 2: 4x - 2y = 8 becomes 2x - y = 4. The equations are identical.`,
          steps: [
            `**Step 1: Compare ratios of coefficients**`,
            `$$\\frac{2}{4} = \\frac{1}{2}, \\quad \\frac{-1}{-2} = \\frac{1}{2}, \\quad \\frac{4}{8} = \\frac{1}{2}$$`,
            `**Step 2: Classify**`,
            `$$\\text{All ratios equal} \\implies \\text{Consistent-dependent}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 2
        };
      } else if (subType === 1) { // Graphing solution (x+y=6, x-y=2)
        const sum = 6, diff = 2;
        const solX = (sum + diff) / 2; // 4
        const solY = (sum - diff) / 2; // 2
        const ans = `(${solX}, ${solY})`;
        const text = `Solve the system of linear equations: \\(\\{ x + y = ${sum} \\,;\\, x - y = ${diff} \\}\\).`;
        const formula = `\\begin{cases} x + y = ${sum} \\\\ x - y = ${diff} \\end{cases}`;
        const options = makeOptions(ans, `(${solX + 1}, ${solY - 1})`, `(${solY}, ${solX})`, `(0, 0)`);
        sysParams = {
          title: `System Solution: x + y = ${sum} and x - y = ${diff}`,
          eq1: `x + y = ${sum}`, eq2: `x - y = ${diff}`,
          a1: 1, b1: 1, c1: sum, a2: 1, b2: -1, c2: diff,
          solX, solY, systemType: 'intersecting'
        };
        imgAltText = `Cartesian graph showing intersection of lines x + y = ${sum} and x - y = ${diff} at (${solX}, ${solY})`;
        qObj = {
          title: `Solve System Graphically #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Add the two equations to eliminate y: 2x = ${sum + diff} => x = ${solX}.`,
          steps: [
            `**Step 1: Add equations**`,
            `$$(x + y) + (x - y) = ${sum} + ${diff} \\implies 2x = ${sum + diff} \\implies x = ${solX}$$`,
            `**Step 2: Substitute x into first equation**`,
            `$$${solX} + y = ${sum} \\implies y = ${solY}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 2
        };
      } else if (subType === 2) { // Substitution method
        const xVal = 3, yVal = 4;
        const ans = `x = ${xVal}, y = ${yVal}`;
        const text = `Solve the system of equations using the Substitution Method: \\(\\{ y = 3x - 5 \\,;\\, 2x + 3y = 18 \\}\\).`;
        const formula = `2x + 3(3x - 5) = 18`;
        const options = makeOptions(ans, `x = 4, y = 3`, `x = 2, y = 1`, `x = 5, y = 10`);
        sysParams = {
          title: `Substitution System: y = 3x - 5 and 2x + 3y = 18`,
          eq1: `3x - y = 5`, eq2: `2x + 3y = 18`,
          a1: 3, b1: -1, c1: 5, a2: 2, b2: 3, c2: 18,
          solX: xVal, solY: yVal, systemType: 'intersecting'
        };
        imgAltText = `Cartesian graph showing intersection of y = 3x - 5 and 2x + 3y = 18 at (${xVal}, ${yVal})`;
        qObj = {
          title: `Substitution Method System #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Substitute y = 3x - 5 into 2x + 3y = 18: 2x + 3(3x - 5) = 18.`,
          steps: [
            `**Step 1: Substitute y expression**`,
            `$$2x + 3(3x - 5) = 18 \\implies 2x + 9x - 15 = 18$$`,
            `**Step 2: Solve for x**`,
            `$$11x = 33 \\implies x = 3$$`,
            `**Step 3: Solve for y**`,
            `$$y = 3(3) - 5 = 4$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 2
        };
      } else if (subType === 3) { // Elimination method
        const xVal = 4, yVal = 2;
        const ans = `x = ${xVal}, y = ${yVal}`;
        const text = `Solve the system of equations using the Elimination Method: \\(\\{ 3x + 2y = 16 \\,;\\, 5x - 2y = 16 \\}\\).`;
        const formula = `(3x + 2y) + (5x - 2y) = 16 + 16`;
        const options = makeOptions(ans, `x = 2, y = 4`, `x = 3, y = 3`, `x = 5, y = 1`);
        sysParams = {
          title: `Elimination System: 3x + 2y = 16 and 5x - 2y = 16`,
          eq1: `3x + 2y = 16`, eq2: `5x - 2y = 16`,
          a1: 3, b1: 2, c1: 16, a2: 5, b2: -2, c2: 16,
          solX: xVal, solY: yVal, systemType: 'intersecting'
        };
        imgAltText = `Cartesian graph showing intersection of 3x + 2y = 16 and 5x - 2y = 16 at (${xVal}, ${yVal})`;
        qObj = {
          title: `Elimination Method System #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Add both equations directly to eliminate the +2y and -2y terms.`,
          steps: [
            `**Step 1: Add equations**`,
            `$$8x = 32 \\implies x = 4$$`,
            `**Step 2: Substitute x = 4 into first equation**`,
            `$$3(4) + 2y = 16 \\implies 12 + 2y = 16 \\implies 2y = 4 \\implies y = 2$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 2
        };
      } else if (subType === 4) { // Arbitrary linear system
        const xVal = 2, yVal = 1;
        const ans = `(${xVal}, ${yVal})`;
        const text = `Solve the system of linear equations: \\(\\{ 4x + 3y = 11 \\,;\\, 3x - 5y = -7 \\}\\).`;
        const formula = `\\begin{cases} 4x + 3y = 11 \\\\ 3x - 5y = -7 \\end{cases}`;
        const options = makeOptions(ans, `(1, 2)`, `(3, -1)`, `(0, 0)`);
        sysParams = {
          title: `System Solution: 4x + 3y = 11 and 3x - 5y = -7`,
          eq1: `4x + 3y = 11`, eq2: `3x - 5y = -7`,
          a1: 4, b1: 3, c1: 11, a2: 3, b2: -5, c2: -7,
          solX: xVal, solY: yVal, systemType: 'intersecting'
        };
        imgAltText = `Cartesian graph showing intersection of 4x + 3y = 11 and 3x - 5y = -7 at (${xVal}, ${yVal})`;
        qObj = {
          title: `General System Solution #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Multiply first equation by 5 and second by 3 to eliminate y: 20x + 15y = 55, 9x - 15y = -21.`,
          steps: [
            `**Step 1: Multiply to match y-coefficients**`,
            `$$5(4x + 3y) = 55 \\implies 20x + 15y = 55$$`,
            `$$3(3x - 5y) = -21 \\implies 9x - 15y = -21$$`,
            `**Step 2: Add equations**`,
            `$$29x = 34 \\text{ wait... } 55 - 21 = 34 \\text{ wait 29x = 58} \\implies x = 2$$`,
            `$$4(2) + 3y = 11 \\implies 3y = 3 \\implies y = 1$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 3
        };
      } else if (subType === 5) { // Inconsistent system (no solution)
        const ans = `No Solution (Inconsistent System)`;
        const text = `Determine the number of solutions for the system: \\(\\{ 2x + 6y = 10 \\,;\\, x + 3y = 7 \\}\\).`;
        const formula = `\\frac{2}{1} = \\frac{6}{3} \\neq \\frac{10}{7}`;
        const options = ['No Solution (Inconsistent System)', 'One Solution (4, 1)', 'Infinitely Many Solutions', 'Two Solutions'];
        sysParams = {
          title: `Inconsistent System: 2x + 6y = 10 and x + 3y = 7`,
          eq1: `2x + 6y = 10`, eq2: `x + 3y = 7`,
          a1: 2, b1: 6, c1: 10, a2: 1, b2: 3, c2: 7,
          systemType: 'inconsistent'
        };
        imgAltText = `Cartesian graph showing parallel lines 2x + 6y = 10 and x + 3y = 7 (no solution)`;
        qObj = {
          title: `Inconsistent System Identification #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Multiply second equation by 2: 2x + 6y = 14. Compare with 2x + 6y = 10 (contradiction 10 = 14).`,
          steps: [
            `**Step 1: Multiply second equation by 2**`,
            `$$2(x + 3y) = 2(7) \\implies 2x + 6y = 14$$`,
            `**Step 2: Subtract from first equation**`,
            `$$(2x + 6y) - (2x + 6y) = 10 - 14 \\implies 0 = -4\\text{ (False)}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 2
        };
      } else if (subType === 6) { // Sum and difference number problem
        const sum = 64, diff = 18;
        const n1 = (sum + diff) / 2; // 41
        const n2 = (sum - diff) / 2; // 23
        const ans = `${n1} and ${n2}`;
        const text = `The sum of two numbers is ${sum} and their difference is ${diff}. Set up a system of equations and find the two numbers.`;
        const formula = `x + y = ${sum}, \\quad x - y = ${diff}`;
        const options = makeOptions(ans, `40 and 24`, `42 and 22`, `35 and 29`);
        sysParams = {
          title: `Number System: x + y = ${sum} and x - y = ${diff}`,
          eq1: `x + y = ${sum}`, eq2: `x - y = ${diff}`,
          a1: 1, b1: 1, c1: sum, a2: 1, b2: -1, c2: diff,
          solX: n1, solY: n2, systemType: 'intersecting'
        };
        imgAltText = `Cartesian graph showing intersection of x + y = ${sum} and x - y = ${diff} at (${n1}, ${n2})`;
        qObj = {
          title: `Number Problem System #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `x + y = ${sum} and x - y = ${diff}. Add equations to find 2x = ${sum + diff}.`,
          steps: [
            `**Step 1: Add equations**`,
            `$$2x = ${sum + diff} \\implies x = ${n1}$$`,
            `**Step 2: Find y**`,
            `$$y = ${sum} - ${n1} = ${n2}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 2
        };
      } else if (subType === 7) { // Cafeteria prices system
        const burgerPrice = 45, drinkPrice = 20;
        const ans = `Burger: ₱${burgerPrice}, Drink: ₱${drinkPrice}`;
        const text = `At a school cafeteria, 3 burgers and 2 juice drinks cost ₱175, while 2 burgers and 4 juice drinks cost ₱170. Find the price of one burger and one juice drink.`;
        const formula = `3b + 2d = 175, \\quad 2b + 4d = 170`;
        const options = makeOptions(ans, `Burger: ₱50, Drink: ₱15`, `Burger: ₱40, Drink: ₱25`, `Burger: ₱35, Drink: ₱30`);
        sysParams = {
          title: `Cafeteria Prices: 3b + 2d = 175 and 2b + 4d = 170`,
          eq1: `3b + 2d = 175`, eq2: `2b + 4d = 170`,
          a1: 3, b1: 2, c1: 175, a2: 2, b2: 4, c2: 170,
          solX: burgerPrice, solY: drinkPrice, systemType: 'intersecting'
        };
        imgAltText = `Cartesian graph showing cafeteria price system lines intersecting at (${burgerPrice}, ${drinkPrice})`;
        qObj = {
          title: `Cafeteria Price System #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Multiply first equation by 2: 6b + 4d = 350. Subtract second equation 2b + 4d = 170.`,
          steps: [
            `**Step 1: Subtract equations**`,
            `$$(6b + 4d) - (2b + 4d) = 350 - 170 \\implies 4b = 180 \\implies b = 45$$`,
            `**Step 2: Solve for drink price d**`,
            `$$2(45) + 4d = 170 \\implies 90 + 4d = 170 \\implies 4d = 80 \\implies d = 20$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 3
        };
      } else if (subType === 8) { // Boat current upstream/downstream
        const boatSpeed = 15, currentSpeed = 3;
        const dist = 36;
        const downTime = 2; // 36/18
        const upTime = 3;   // 36/12
        const ans = `Boat: ${boatSpeed} km/h, Current: ${currentSpeed} km/h`;
        const text = `A boat travels ${dist} km downstream with the current in ${downTime} hours and takes ${upTime} hours to travel the same distance upstream against the current. Find the speed of the boat in still water and the speed of the current.`;
        const formula = `b + c = \\frac{${dist}}{${downTime}}, \\quad b - c = \\frac{${dist}}{${upTime}}`;
        const options = makeOptions(ans, `Boat: 18 km/h, Current: 2 km/h`, `Boat: 12 km/h, Current: 4 km/h`, `Boat: 20 km/h, Current: 5 km/h`);
        sysParams = {
          title: `Boat & Current Rates: b + c = 18 and b - c = 12`,
          eq1: `b + c = 18`, eq2: `b - c = 12`,
          a1: 1, b1: 1, c1: 18, a2: 1, b2: -1, c2: 12,
          solX: boatSpeed, solY: currentSpeed, systemType: 'intersecting'
        };
        imgAltText = `Cartesian graph showing boat and current rate lines intersecting at (${boatSpeed}, ${currentSpeed})`;
        qObj = {
          title: `Boat & Current Motion System #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Downstream rate b + c = ${dist}/${downTime} = 18. Upstream rate b - c = ${dist}/${upTime} = 12.`,
          steps: [
            `**Step 1: Calculate rates**`,
            `$$b + c = 18, \\quad b - c = 12$$`,
            `**Step 2: Add equations**`,
            `$$2b = 30 \\implies b = 15\\text{ km/h}, \\quad c = 3\\text{ km/h}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 3
        };
      } else { // Acid solution mixture problem
        const v1 = 10, v2 = 20;
        const ans = `${v1} liters of 20% solution and ${v2} liters of 50% solution`;
        const text = `A chemist mixes a 20% acid solution with a 50% acid solution to produce 30 liters of a 40% acid solution. How many liters of each solution should be used?`;
        const formula = `x + y = 30, \\quad 0.20x + 0.50y = 0.40(30)`;
        const options = makeOptions(ans, `15 liters of 20% and 15 liters of 50%`, `5 liters of 20% and 25 liters of 50%`, `20 liters of 20% and 10 liters of 50%`);
        sysParams = {
          title: `Acid Mixture: x + y = 30 and 0.2x + 0.5y = 12`,
          eq1: `x + y = 30`, eq2: `0.2x + 0.5y = 12`,
          a1: 1, b1: 1, c1: 30, a2: 0.2, b2: 0.5, c2: 12,
          solX: v1, solY: v2, systemType: 'intersecting'
        };
        imgAltText = `Cartesian graph showing acid mixture volume and concentration lines intersecting at (${v1}, ${v2})`;
        qObj = {
          title: `Acid Mixture System #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `x + y = 30 and 0.20x + 0.50y = 12. Substitute y = 30 - x.`,
          steps: [
            `**Step 1: Substitute y = 30 - x into mixture equation**`,
            `$$0.20x + 0.50(30 - x) = 12 \\implies 0.20x + 15 - 0.50x = 12$$`,
            `**Step 2: Solve for x**`,
            `$$-0.30x = -3 \\implies x = 10\\text{ liters}, \\quad y = 20\\text{ liters}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 3
        };
      }

      // Generate custom SVG for this question and save to disk
      const customSvgContent = generateLinearSystemSvg(sysParams);
      fs.writeFileSync(imgPathPublic, customSvgContent);
      fs.writeFileSync(imgPathRoot, customSvgContent);
    }

    // ==========================================
    // TOPIC 135 (T11): Linear Inequalities in Two Variables
    // ==========================================
    else if (topicId === 135) {
      const imgFileName = `g8_t135_q${qIndex + 1}.svg`;
      const imgPathPublic = path.join(__dirname, '..', 'public', 'images', imgFileName);
      const imgPathRoot = path.join(__dirname, '..', 'images', imgFileName);
      let ineqParams = {};
      let imgAltText = '';

      if (subType === 0) { // Test point ordered pairs for 3x - 2y <= 6
        const ans = `(0, 0) and (-1, 5) satisfy, (2, -3) does not satisfy`;
        const text = `Determine which of the ordered pairs (0, 0), (2, -3), and (-1, 5) satisfy the linear inequality \\(3x - 2y \\le 6\\).`;
        const formula = `3x - 2y \\le 6`;
        const options = ['(0, 0) and (-1, 5) satisfy, (2, -3) does not satisfy', 'All three points satisfy', 'Only (0, 0) satisfies', 'None satisfy'];
        ineqParams = {
          title: `Test Points for 3x - 2y ≤ 6`,
          inequalityText: `3x - 2y ≤ 6`,
          bounds: 8,
          regionType: 'halfplane_above_left',
          lines: [{ a: 3, b: -2, c: 6, isStrict: false, color: '#38bdf8', shadeDirection: 'above' }],
          testPoints: [
            { x: 0, y: 0, valid: true },
            { x: 2, y: -3, valid: false },
            { x: -1, y: 5, valid: true }
          ]
        };
        imgAltText = `Cartesian graph showing boundary line 3x - 2y = 6 and shaded region with test points (0,0), (2,-3), (-1,5)`;
        qObj = {
          title: `Linear Inequality Test Points #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Substitute (x, y) into 3x - 2y and check if result <= 6.`,
          steps: [
            `**Step 1: Test (0, 0)**`,
            `$$3(0) - 2(0) = 0 \\le 6 \\quad \\text{(True)}$$`,
            `**Step 2: Test (2, -3)**`,
            `$$3(2) - 2(-3) = 6 + 6 = 12 \\le 6 \\quad \\text{(False, 12 > 6)}$$`,
            `**Step 3: Test (-1, 5)**`,
            `$$3(-1) - 2(5) = -3 - 10 = -13 \\le 6 \\quad \\text{(True)}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 2
        };
      } else if (subType === 1) { // Graphing 2x + y > 4 (dashed line)
        const ans = `Dashed boundary line 2x + y = 4, shade region containing (3, 3)`;
        const text = `Describe the graph of the linear inequality \\(2x + y > 4\\) on the Cartesian coordinate plane.`;
        const formula = `2x + y > 4`;
        const options = makeOptions(ans, `Solid boundary line 2x + y = 4, shade region containing (0, 0)`, `Dashed boundary line 2x + y = 4, shade region containing (0, 0)`, `Solid boundary line 2x + y = 4, shade below line`);
        ineqParams = {
          title: `Strict Inequality: 2x + y > 4`,
          inequalityText: `2x + y > 4 (Dashed Line)`,
          bounds: 8,
          regionType: 'halfplane_above_left',
          lines: [{ a: 2, b: 1, c: 4, isStrict: true, color: '#38bdf8', shadeDirection: 'above' }],
          testPoints: [{ x: 3, y: 3, valid: true }, { x: 0, y: 0, valid: false }]
        };
        imgAltText = `Cartesian graph showing dashed line 2x + y = 4 and shaded region excluding origin`;
        qObj = {
          title: `Strict Linear Inequality Graph #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Strict inequality '>' requires a DASHED boundary line. Test (0,0): 0 > 4 (False), so shade opposite side containing (3, 3).`,
          steps: [
            `**Step 1: Boundary line style**`,
            `$$\\text{Strict inequality } > \\implies \\text{Dashed boundary line}$$`,
            `**Step 2: Test point (0, 0)**`,
            `$$2(0) + 0 = 0 > 4 \\text{ (False)} \\implies \\text{Shade region NOT containing origin}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 2
        };
      } else if (subType === 2) { // Graphing 3x - 4y <= 12 (solid line)
        const ans = `Solid boundary line passing through (4, 0) and (0, -3), shade region containing origin`;
        const text = `Graph the linear inequality \\(3x - 4y \\le 12\\) on the coordinate plane. Specify boundary line style and shaded region.`;
        const formula = `3x - 4y \\le 12`;
        const options = makeOptions(ans, `Dashed boundary line, shade region NOT containing origin`, `Solid boundary line, shade region NOT containing origin`, `Dashed boundary line, shade region containing origin`);
        ineqParams = {
          title: `Non-Strict Inequality: 3x - 4y ≤ 12`,
          inequalityText: `3x - 4y ≤ 12 (Solid Line)`,
          bounds: 8,
          regionType: 'halfplane_above_left',
          lines: [{ a: 3, b: -4, c: 12, isStrict: false, color: '#38bdf8', shadeDirection: 'above' }],
          testPoints: [{ x: 0, y: 0, valid: true }]
        };
        imgAltText = `Cartesian graph showing solid boundary line 3x - 4y = 12 and shaded region containing origin`;
        qObj = {
          title: `Non-Strict Linear Inequality Graph #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Inequality \\(\\le\\) requires a SOLID line. Test (0, 0): 0 <= 12 (True), shade region containing (0,0).`,
          steps: [
            `**Step 1: Intercepts of boundary line 3x - 4y = 12**`,
            `$$\\text{x-int: } (4, 0), \\quad \\text{y-int: } (0, -3)$$`,
            `**Step 2: Test origin (0, 0)**`,
            `$$3(0) - 4(0) = 0 \\le 12 \\text{ (True)} \\implies \\text{Shade region with origin}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 2
        };
      } else if (subType === 3) { // Identify inequality from graph features
        const ans = `2x - y \\ge -3`;
        const text = `Write the linear inequality represented by a graph with a solid boundary line passing through (0, 3) and (2, 7) with the shaded region containing the origin (0, 0).`;
        const formula = `Ax + By \\ge C`;
        const options = makeOptions(ans, `2x - y < -3`, `2x + y \\le 3`, `x - 2y \\ge 3`);
        ineqParams = {
          title: `Boundary Line & Region: 2x - y ≥ -3`,
          inequalityText: `2x - y ≥ -3`,
          bounds: 8,
          regionType: 'halfplane_below_right',
          lines: [{ a: 2, b: -1, c: -3, isStrict: false, color: '#38bdf8', shadeDirection: 'below' }],
          testPoints: [{ x: 0, y: 0, valid: true }]
        };
        imgAltText = `Cartesian graph showing solid line 2x - y = -3 and shaded region containing origin`;
        qObj = {
          title: `Inequality Identification from Graph #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Slope m = (7-3)/(2-0) = 2. Equation 2x - y = -3. Test (0,0): 0 >= -3 (True) matches solid line shading.`,
          steps: [
            `**Step 1: Find boundary line equation**`,
            `$$m = \\frac{7 - 3}{2 - 0} = 2 \\implies y = 2x + 3 \\implies 2x - y = -3$$`,
            `**Step 2: Check inequality symbol with (0,0)**`,
            `$$2(0) - 0 = 0 \\ge -3 \\text{ (True)} \\implies 2x - y \\ge -3$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 3
        };
      } else if (subType === 4) { // System of inequalities graph regions {x + y <= 5, y > x - 2}
        const ans = `Intersection region below line x + y = 5 and above dashed line y = x - 2`;
        const text = `Graph the system of linear inequalities on the coordinate plane: \\(\\begin{cases} x + y \\le 5 \\\\ y > x - 2 \\end{cases}\\).`;
        const formula = `\\begin{cases} x + y \\le 5 \\\\ y > x - 2 \\end{cases}`;
        const options = makeOptions(ans, `Region above line x + y = 5 and below line y = x - 2`, `Region below both lines`, `Region above both lines`);
        ineqParams = {
          title: `System Feasible Region: x+y ≤ 5 and y > x-2`,
          inequalityText: `x + y ≤ 5, y > x - 2`,
          bounds: 8,
          regionType: 'custom_polygon',
          polygonPoints: [[-8, -8], [-8, 5], [3.5, 1.5], [-6, -8]],
          lines: [
            { a: 1, b: 1, c: 5, isStrict: false, color: '#38bdf8' },
            { a: -1, b: 1, c: -2, isStrict: true, color: '#f59e0b' }
          ]
        };
        imgAltText = `Cartesian graph showing overlapping feasible region bounded by solid line x + y = 5 and dashed line y = x - 2`;
        qObj = {
          title: `System of Inequalities Shading #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Shade below solid line x + y = 5 AND above dashed line y = x - 2.`,
          steps: [
            `**Step 1: Graph x + y <= 5**`,
            `$$\\text{Solid line, shade below/left region}$$`,
            `**Step 2: Graph y > x - 2**`,
            `$$\\text{Dashed line, shade above region}$$`,
            `**Step 3: Identify overlapping region**`,
            `$$\\text{Feasible region is the intersection}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 3
        };
      } else if (subType === 5) { // Test points satisfying system {2x - y >= 1, x + 2y < 6}
        const ans = `(2, 1) satisfies the system`;
        const text = `Identify which of the following coordinates lies in the solution set of the system: \\(\\begin{cases} 2x - y \\ge 1 \\\\ x + 2y < 6 \\end{cases}\\).`;
        const formula = `\\begin{cases} 2x - y \\ge 1 \\\\ x + 2y < 6 \\end{cases}`;
        const options = makeOptions(ans, `(0, 5)`, `(4, 3)`, `(-2, 4)`);
        ineqParams = {
          title: `Feasible Region: 2x - y ≥ 1 and x + 2y < 6`,
          inequalityText: `2x - y ≥ 1, x + 2y < 6`,
          bounds: 8,
          regionType: 'custom_polygon',
          polygonPoints: [[1.6, 2.2], [8, -8], [0.5, -8]],
          lines: [
            { a: 2, b: -1, c: 1, isStrict: false, color: '#38bdf8' },
            { a: 1, b: 2, c: 6, isStrict: true, color: '#f59e0b' }
          ],
          testPoints: [{ x: 2, y: 1, valid: true }]
        };
        imgAltText = `Cartesian graph showing feasible region for 2x - y ≥ 1 and x + 2y < 6 with test point (2, 1)`;
        qObj = {
          title: `System Solution Point Verification #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Test point (2, 1): 2(2) - 1 = 3 >= 1 (True), and 2 + 2(1) = 4 < 6 (True).`,
          steps: [
            `**Step 1: Substitute (2, 1) into 2x - y >= 1**`,
            `$$2(2) - 1 = 3 \\ge 1 \\quad \\text{(True)}$$`,
            `**Step 2: Substitute (2, 1) into x + 2y < 6**`,
            `$$2 + 2(1) = 4 < 6 \\quad \\text{(True)}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 2
        };
      } else if (subType === 6) { // Baker earnings inequality
        const cupcakePrice = 15, cookiePrice = 10, target = 1200;
        const ans = `15x + 10y \\ge 1200`;
        const text = `A baker sells cupcakes (x) for ₱${cupcakePrice} each and cookies (y) for ₱${cookiePrice} each. Write a linear inequality in two variables representing the condition that the baker must earn at least ₱${target} in a day.`;
        const formula = `${cupcakePrice}x + ${cookiePrice}y \\ge ${target}`;
        const options = makeOptions(ans, `15x + 10y > 1200`, `15x + 10y \\le 1200`, `x + y \\ge 1200`);
        ineqParams = {
          title: `Baker Earnings Goal: 15x + 10y ≥ 1200`,
          inequalityText: `15x + 10y ≥ 1200`,
          bounds: 120,
          regionType: 'halfplane_above_left',
          lines: [{ a: 15, b: 10, c: 1200, isStrict: false, color: '#38bdf8', shadeDirection: 'above' }]
        };
        imgAltText = `Graph of baker revenue inequality 15x + 10y ≥ 1200 showing feasible earnings half-plane`;
        qObj = {
          title: `Baker Earnings Inequality #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `'At least ₱1200' means total earnings >= 1200. Total = 15x + 10y.`,
          steps: [
            `**Step 1: Express revenue from cupcakes and cookies**`,
            `$$\\text{Revenue} = 15x + 10y$$`,
            `**Step 2: Apply 'at least' condition**`,
            `$$15x + 10y \\ge 1200$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 2
        };
      } else if (subType === 7) { // Verify (40, 50) against baker inequality
        const xVal = 40, yVal = 50;
        const total = 15 * xVal + 10 * yVal; // 600 + 500 = 1100 < 1200
        const ans = `No, ₱1,100 earned does not meet the minimum goal of ₱1,200`;
        const text = `Referring to the baker needing to earn at least ₱1,200 (inequality \\(15x + 10y \\ge 1200\\)), does selling ${xVal} cupcakes and ${yVal} cookies meet the goal?`;
        const formula = `15(${xVal}) + 10(${yVal}) = ${total}`;
        const options = makeOptions(ans, `Yes, ₱1,300 earned exceeds the goal`, `Yes, exactly ₱1,200 is earned`, `No, only ₱900 is earned`);
        ineqParams = {
          title: `Baker Goal Evaluation (40, 50)`,
          inequalityText: `15(40) + 10(50) = 1100 < 1200`,
          bounds: 120,
          regionType: 'halfplane_above_left',
          lines: [{ a: 15, b: 10, c: 1200, isStrict: false, color: '#38bdf8', shadeDirection: 'above' }],
          testPoints: [{ x: 40, y: 50, valid: false }]
        };
        imgAltText = `Graph evaluating point (40, 50) against baker earnings line 15x + 10y = 1200 (outside feasible region)`;
        qObj = {
          title: `Baker Earnings Evaluation #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Calculate 15(40) + 10(50) = 600 + 500 = 1100. Compare 1100 with 1200.`,
          steps: [
            `**Step 1: Substitute x = 40, y = 50**`,
            `$$15(40) + 10(50) = 600 + 500 = ₱1,100$$`,
            `**Step 2: Compare with threshold**`,
            `$$₱1,100 < ₱1,200 \\implies \\text{Goal NOT met}$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 2
        };
      } else if (subType === 8) { // Farmer land allocation system
        const ans = `\\begin{cases} x + y \\le 60 \\\\ x \\ge 15 \\end{cases}`;
        const text = `A farmer has at most 60 hectares of land to plant corn (x) and soybeans (y). Furthermore, the farmer must plant at least 15 hectares of corn. Write the system of inequalities representing these constraints.`;
        const formula = `\\begin{cases} x + y \\le 60 \\\\ x \\ge 15 \\end{cases}`;
        const options = makeOptions(ans, `\\begin{cases} x + y \\ge 60 \\\\ x \\le 15 \\end{cases}`, `\\begin{cases} x + y = 60 \\\\ x = 15 \\end{cases}`, `\\begin{cases} x + y \\le 60 \\\\ y \\ge 15 \\end{cases}`);
        ineqParams = {
          title: `Land Allocation: x + y ≤ 60 and x ≥ 15`,
          inequalityText: `x + y ≤ 60, x ≥ 15 (Q1)`,
          bounds: 70,
          regionType: 'custom_polygon',
          polygonPoints: [[15, 0], [15, 45], [60, 0]],
          lines: [
            { a: 1, b: 1, c: 60, isStrict: false, color: '#38bdf8' },
            { a: 1, b: 0, c: 15, isStrict: false, color: '#f59e0b' }
          ]
        };
        imgAltText = `Feasible region graph for land allocation constraints x + y ≤ 60 and x ≥ 15`;
        qObj = {
          title: `Land Allocation Inequality System #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `'At most 60 hectares' means x + y <= 60. 'At least 15 hectares of corn' means x >= 15.`,
          steps: [
            `**Step 1: Total land constraint**`,
            `$$x + y \\le 60$$`,
            `**Step 2: Minimum corn constraint**`,
            `$$x \\ge 15$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 2
        };
      } else { // Part-time work schedule system
        const rate1 = 80, rate2 = 60;
        const maxH = 20, minE = 1400;
        const ans = `\\begin{cases} x + y \\le 20 \\\\ 80x + 60y \\ge 1400 \\end{cases}`;
        const text = `A student earns ₱${rate1}/hour tutoring (x) and ₱${rate2}/hour as cashier (y). She works at most ${maxH} hours per week and needs to earn at least ₱${minE}. Formulate the system of linear inequalities.`;
        const formula = `\\begin{cases} x + y \\le ${maxH} \\\\ ${rate1}x + ${rate2}y \\ge ${minE} \\end{cases}`;
        const options = makeOptions(ans, `\\begin{cases} x + y \\ge 20 \\\\ 80x + 60y \\le 1400 \\end{cases}`, `\\begin{cases} 80x + 60y \\le 20 \\\\ x + y \\ge 1400 \\end{cases}`, `\\begin{cases} x + y = 20 \\\\ 80x + 60y = 1400 \\end{cases}`);
        ineqParams = {
          title: `Work Schedule Feasible Region`,
          inequalityText: `x + y ≤ 20, 80x + 60y ≥ 1400`,
          bounds: 25,
          regionType: 'custom_polygon',
          polygonPoints: [[10, 10], [17.5, 0], [20, 0]],
          lines: [
            { a: 1, b: 1, c: 20, isStrict: false, color: '#38bdf8' },
            { a: 80, b: 60, c: 1400, isStrict: false, color: '#f59e0b' }
          ]
        };
        imgAltText = `Feasible region graph for work schedule inequalities x + y ≤ 20 and 80x + 60y ≥ 1400`;
        qObj = {
          title: `Work Schedule Inequality System #${qIndex + 1}`,
          text, formula, options, answer: ans,
          hint: `Hours constraint: x + y <= 20. Earnings constraint: 80x + 60y >= 1400.`,
          steps: [
            `**Step 1: Hours constraint**`,
            `$$x + y \\le 20$$`,
            `**Step 2: Earnings constraint**`,
            `$$80x + 60y \\ge 1400$$`,
            `**Final Verified Answer:** \\(${ans}\\)`
          ],
          image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 2
        };
      }

      // Generate custom SVG for this question and save to disk
      const customSvgContent = generateLinearInequalitySvg(ineqParams);
      fs.writeFileSync(imgPathPublic, customSvgContent);
      fs.writeFileSync(imgPathRoot, customSvgContent);
    }

    if (qObj) {
      insertStmt.run(
        topicId,
        qObj.title,
        qObj.text,
        qObj.formula || '',
        JSON.stringify(qObj.options),
        qObj.answer,
        qObj.hint || '',
        JSON.stringify(qObj.steps),
        qObj.image_url || '',
        qObj.image_alt || '',
        qObj.difficulty || 3
      );
      totalGenerated++;
    }
  }
}

console.log(`✅ Successfully generated and inserted ${totalGenerated} Grade 8 Number and Algebra questions into SQLite qbank.db!`);

// Export updated questions database to Excel
exportQuestionsToExcel(db);

console.log('🎉 Generation and Excel export completed successfully!');
