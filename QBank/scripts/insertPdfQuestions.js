import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { exportQuestionsToExcel } from '../server/excelService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '..', 'server', 'qbank.db');
const db = new Database(dbPath);

console.log('Inserting PDF questions into QBank database...');

const pdfQuestions = [
  // --- Section 1 ---
  {
    topic_id: 125,
    title: 'Basic Algebraic Expressions - Expansion & Simplification 1(a)',
    text: 'Expand and/or simplify the algebraic expression: \\(6y^2 - 7y + 8 - (5y^2 - 3y + 8)\\)',
    formula: '6y^2 - 7y + 8 - (5y^2 - 3y + 8)',
    type: 'MCQ',
    options: ['y^2 - 4y', 'y^2 - 10y + 16', '11y^2 - 4y', 'y^2 - 4y + 16'],
    answer: 'y^2 - 4y',
    hint: 'Distribute the negative sign across the second group of terms.',
    steps: [
      '**Step 1: Expand parentheses with negative sign**',
      '$$6y^2 - 7y + 8 - 5y^2 + 3y - 8$$',
      '**Step 2: Group like terms**',
      '$$(6y^2 - 5y^2) + (-7y + 3y) + (8 - 8)$$',
      '**Step 3: Simplify coefficients**',
      '$$y^2 - 4y$$',
      '**Final Verified Answer:** \\(y^2 - 4y\\)'
    ],
    difficulty: 2
  },
  {
    topic_id: 125,
    title: 'Basic Algebraic Expressions - Expansion & Simplification 1(b)',
    text: 'Expand and/or simplify the algebraic expression: \\(5h(-2h) + 4h - 3 - (2h^2 + 1)\\)',
    formula: '5h(-2h) + 4h - 3 - (2h^2 + 1)',
    type: 'MCQ',
    options: ['-12h^2 + 4h - 4', '-8h^2 + 4h - 4', '-12h^2 + 4h - 2', '-10h^2 + 4h - 4'],
    answer: '-12h^2 + 4h - 4',
    hint: 'Multiply 5h by -2h first, then distribute the negative sign.',
    steps: [
      '**Step 1: Multiply terms and expand parentheses**',
      '$$-10h^2 + 4h - 3 - 2h^2 - 1$$',
      '**Step 2: Combine like terms**',
      '$$-10h^2 - 2h^2 + 4h - 3 - 1 = -12h^2 + 4h - 4$$',
      '**Final Verified Answer:** \\(-12h^2 + 4h - 4\\)'
    ],
    difficulty: 2
  },
  {
    topic_id: 125,
    title: 'Basic Algebraic Expressions - Expansion & Simplification 1(c)',
    text: 'Expand and/or simplify the algebraic expression: \\(-(3 + 2g - 4g^2) - (g^2 - 4g + 7)\\)',
    formula: '-(3 + 2g - 4g^2) - (g^2 - 4g + 7)',
    type: 'MCQ',
    options: ['3g^2 + 2g - 10', '3g^2 - 6g - 10', '5g^2 + 2g - 10', '3g^2 + 2g + 4'],
    answer: '3g^2 + 2g - 10',
    hint: 'Carefully expand negative signs across both parentheses.',
    steps: [
      '**Step 1: Expand negative signs**',
      '$$-3 - 2g + 4g^2 - g^2 + 4g - 7$$',
      '**Step 2: Re-order by degree and combine like terms**',
      '$$(4g^2 - g^2) + (-2g + 4g) + (-3 - 7) = 3g^2 + 2g - 10$$',
      '**Final Verified Answer:** \\(3g^2 + 2g - 10\\)'
    ],
    difficulty: 2
  },

  // --- Section 2 ---
  {
    topic_id: 125,
    title: 'Basic Algebraic Expressions - Expansion 2(a)',
    text: 'Expand and simplify: \\(3(2x^2 - 3x - 5)\\)',
    formula: '3(2x^2 - 3x - 5)',
    type: 'MCQ',
    options: ['6x^2 - 9x - 15', '6x^2 - 3x - 15', '6x^2 - 9x - 5', '5x^2 - 6x - 8'],
    answer: '6x^2 - 9x - 15',
    hint: 'Distribute 3 to every term inside the polynomial.',
    steps: [
      '**Step 1: Distribute constant multiplier**',
      '$$3 \\cdot 2x^2 + 3 \\cdot (-3x) + 3 \\cdot (-5)$$',
      '**Step 2: Calculate products**',
      '$$6x^2 - 9x - 15$$',
      '**Final Verified Answer:** \\(6x^2 - 9x - 15\\)'
    ],
    difficulty: 2
  },
  {
    topic_id: 125,
    title: 'Basic Algebraic Expressions - Expansion 2(b)',
    text: 'Expand and simplify: \\(2x(5 - 3x)\\)',
    formula: '2x(5 - 3x)',
    type: 'MCQ',
    options: ['10x - 6x^2', '10x - 3x^2', '7x - 5x^2', '10x - 6x'],
    answer: '10x - 6x^2',
    hint: 'Multiply 2x by both 5 and -3x.',
    steps: [
      '**Step 1: Distribute 2x**',
      '$$2x(5) + 2x(-3x) = 10x - 6x^2$$',
      '**Final Verified Answer:** \\(10x - 6x^2\\)'
    ],
    difficulty: 2
  },
  {
    topic_id: 125,
    title: 'Basic Algebraic Expressions - Expansion 2(c)',
    text: 'Expand and simplify: \\(3x(5x - 7) + 2x(3 - 8x)\\)',
    formula: '3x(5x - 7) + 2x(3 - 8x)',
    type: 'MCQ',
    options: ['-x^2 - 15x', '-x^2 - 27x', '31x^2 - 15x', '-x^2 + 15x'],
    answer: '-x^2 - 15x',
    hint: 'Expand both sets of parentheses then combine like terms.',
    steps: [
      '**Step 1: Distribute variables**',
      '$$15x^2 - 21x + 6x - 16x^2$$',
      '**Step 2: Combine like terms**',
      '$$(15x^2 - 16x^2) + (-21x + 6x) = -x^2 - 15x$$',
      '**Final Verified Answer:** \\(-x^2 - 15x\\)'
    ],
    difficulty: 2
  },
  {
    topic_id: 125,
    title: 'Basic Algebraic Expressions - Expansion 2(d)',
    text: 'Expand and simplify: \\(4x(2x - 3) - x(3x - 4)\\)',
    formula: '4x(2x - 3) - x(3x - 4)',
    type: 'MCQ',
    options: ['5x^2 - 8x', '5x^2 - 16x', '11x^2 - 8x', '5x^2 + 8x'],
    answer: '5x^2 - 8x',
    hint: 'Remember -x multiplied by -4 equals +4x.',
    steps: [
      '**Step 1: Expand expressions**',
      '$$8x^2 - 12x - 3x^2 + 4x$$',
      '**Step 2: Combine terms**',
      '$$(8x^2 - 3x^2) + (-12x + 4x) = 5x^2 - 8x$$',
      '**Final Verified Answer:** \\(5x^2 - 8x\\)'
    ],
    difficulty: 2
  },
  {
    topic_id: 125,
    title: 'Basic Algebraic Expressions - Expansion 2(e)',
    text: 'Expand and simplify: \\(y(3y + 2) - (2y + 3)\\)',
    formula: 'y(3y + 2) - (2y + 3)',
    type: 'MCQ',
    options: ['3y^2 - 3', '3y^2 + 4y - 3', '3y^2 - 4y - 3', '3y^2 + 3'],
    answer: '3y^2 - 3',
    hint: 'Distribute y, then subtract 2y and 3.',
    steps: [
      '**Step 1: Distribute y and subtract terms**',
      '$$3y^2 + 2y - 2y - 3$$',
      '**Step 2: Cancel linear terms (+2y - 2y)**',
      '$$3y^2 - 3$$',
      '**Final Verified Answer:** \\(3y^2 - 3\\)'
    ],
    difficulty: 2
  },
  {
    topic_id: 125,
    title: 'Basic Algebraic Expressions - Expansion 2(f)',
    text: 'Expand and simplify: \\(2f(5f - 4) - 3(f^2 - 5)\\)',
    formula: '2f(5f - 4) - 3(f^2 - 5)',
    type: 'MCQ',
    options: ['7f^2 - 8f + 15', '7f^2 - 8f - 15', '10f^2 - 8f + 15', '7f^2 + 8f + 15'],
    answer: '7f^2 - 8f + 15',
    hint: 'Multiply -3 by -5 to get positive 15.',
    steps: [
      '**Step 1: Expand product**',
      '$$10f^2 - 8f - 3f^2 + 15$$',
      '**Step 2: Combine quadratic terms**',
      '$$7f^2 - 8f + 15$$',
      '**Final Verified Answer:** \\(7f^2 - 8f + 15\\)'
    ],
    difficulty: 2
  },

  // --- Section 3 ---
  {
    topic_id: 125,
    title: 'Basic Algebraic Expressions - Expansion 3(a)',
    text: 'Expand and simplify: \\(5(3x^2 + 6x - 7) - 2(5x^2 - x - 12)\\)',
    formula: '5(3x^2 + 6x - 7) - 2(5x^2 - x - 12)',
    type: 'MCQ',
    options: ['5x^2 + 32x - 11', '5x^2 + 28x - 59', '25x^2 + 32x - 11', '5x^2 + 32x + 11'],
    answer: '5x^2 + 32x - 11',
    hint: 'Distribute 5 and -2 across all terms in each set.',
    steps: [
      '**Step 1: Distribute multipliers**',
      '$$15x^2 + 30x - 35 - 10x^2 + 2x + 24$$',
      '**Step 2: Combine like terms**',
      '$$(15x^2 - 10x^2) + (30x + 2x) + (-35 + 24) = 5x^2 + 32x - 11$$',
      '**Final Verified Answer:** \\(5x^2 + 32x - 11\\)'
    ],
    difficulty: 3
  },
  {
    topic_id: 125,
    title: 'Basic Algebraic Expressions - Expansion 3(b)',
    text: 'Expand and simplify: \\(-5x(3 - x) + 2x(5x - 1)\\)',
    formula: '-5x(3 - x) + 2x(5x - 1)',
    type: 'MCQ',
    options: ['15x^2 - 17x', '15x^2 - 13x', '5x^2 - 17x', '15x^2 + 17x'],
    answer: '15x^2 - 17x',
    hint: '-5x times -x equals +5x^2.',
    steps: [
      '**Step 1: Expand expressions**',
      '$$-15x + 5x^2 + 10x^2 - 2x$$',
      '**Step 2: Combine terms**',
      '$$15x^2 - 17x$$',
      '**Final Verified Answer:** \\(15x^2 - 17x\\)'
    ],
    difficulty: 3
  },
  {
    topic_id: 125,
    title: 'Basic Algebraic Expressions - Expansion 3(c)',
    text: 'Expand and simplify: \\(-6g(1 - 3g) + 2(g^2 - 4g + 3)\\)',
    formula: '-6g(1 - 3g) + 2(g^2 - 4g + 3)',
    type: 'MCQ',
    options: ['20g^2 - 14g + 6', '18g^2 - 14g + 6', '20g^2 - 2g + 6', '20g^2 - 14g - 6'],
    answer: '20g^2 - 14g + 6',
    hint: 'Distribute -6g and +2 then sum terms.',
    steps: [
      '**Step 1: Expand parentheses**',
      '$$-6g + 18g^2 + 2g^2 - 8g + 6$$',
      '**Step 2: Combine like terms**',
      '$$(18g^2 + 2g^2) + (-6g - 8g) + 6 = 20g^2 - 14g + 6$$',
      '**Final Verified Answer:** \\(20g^2 - 14g + 6\\)'
    ],
    difficulty: 3
  },
  {
    topic_id: 125,
    title: 'Basic Algebraic Expressions - Expansion 3(d)',
    text: 'Expand and simplify: \\(3h(h - 4) - 2h(5 - 2h) - 4(-3h)\\)',
    formula: '3h(h - 4) - 2h(5 - 2h) - 4(-3h)',
    type: 'MCQ',
    options: ['7h^2 - 10h', '7h^2 - 34h', 'h^2 - 10h', '7h^2 + 10h'],
    answer: '7h^2 - 10h',
    hint: 'Notice -4(-3h) becomes +12h.',
    steps: [
      '**Step 1: Expand terms**',
      '$$3h^2 - 12h - 10h + 4h^2 + 12h$$',
      '**Step 2: Combine like terms**',
      '$$(3h^2 + 4h^2) + (-12h - 10h + 12h) = 7h^2 - 10h$$',
      '**Final Verified Answer:** \\(7h^2 - 10h\\)'
    ],
    difficulty: 3
  },

  // --- Section 4 (Binomial Expansion & Special Products) ---
  {
    topic_id: 126,
    title: 'Binomial Multiplication 4(a)',
    text: 'Expand the expression: \\((a - 7)(a + 9)\\)',
    formula: '(a - 7)(a + 9)',
    type: 'MCQ',
    options: ['a^2 + 2a - 63', 'a^2 - 16a - 63', 'a^2 + 2a + 63', 'a^2 - 2a - 63'],
    answer: 'a^2 + 2a - 63',
    hint: 'Apply FOIL method: First, Outer, Inner, Last.',
    steps: [
      '**Step 1: FOIL expansion**',
      '$$a^2 + 9a - 7a - 63$$',
      '**Step 2: Combine middle terms**',
      '$$a^2 + 2a - 63$$',
      '**Final Verified Answer:** \\(a^2 + 2a - 63\\)'
    ],
    difficulty: 2
  },
  {
    topic_id: 126,
    title: 'Binomial Multiplication 4(b)',
    text: 'Expand the expression: \\((2b + 5)(b - 11)\\)',
    formula: '(2b + 5)(b - 11)',
    type: 'MCQ',
    options: ['2b^2 - 17b - 55', '2b^2 + 17b - 55', '2b^2 - 27b - 55', '2b^2 - 17b + 55'],
    answer: '2b^2 - 17b - 55',
    hint: 'Multiply terms: (2b)(b) + (2b)(-11) + (5)(b) + (5)(-11).',
    steps: [
      '**Step 1: Expand product**',
      '$$2b^2 - 22b + 5b - 55$$',
      '**Step 2: Combine linear terms**',
      '$$2b^2 - 17b - 55$$',
      '**Final Verified Answer:** \\(2b^2 - 17b - 55\\)'
    ],
    difficulty: 2
  },
  {
    topic_id: 126,
    title: 'Binomial Multiplication 4(c)',
    text: 'Expand the expression: \\((3c + 4)(2c - 5)\\)',
    formula: '(3c + 4)(2c - 5)',
    type: 'MCQ',
    options: ['6c^2 - 7c - 20', '6c^2 + 7c - 20', '6c^2 - 23c - 20', '5c^2 - 7c - 20'],
    answer: '6c^2 - 7c - 20',
    hint: 'Combine -15c + 8c = -7c.',
    steps: [
      '**Step 1: FOIL expansion**',
      '$$6c^2 - 15c + 8c - 20$$',
      '**Step 2: Simplify**',
      '$$6c^2 - 7c - 20$$',
      '**Final Verified Answer:** \\(6c^2 - 7c - 20\\)'
    ],
    difficulty: 2
  },
  {
    topic_id: 126,
    title: 'Binomial Multiplication 4(d)',
    text: 'Expand the expression: \\((6d - 5)(3 - 2d)\\)',
    formula: '(6d - 5)(3 - 2d)',
    type: 'MCQ',
    options: ['-12d^2 + 28d - 15', '-12d^2 + 8d - 15', '12d^2 + 28d - 15', '-12d^2 + 28d + 15'],
    answer: '-12d^2 + 28d - 15',
    hint: 'Multiply terms carefully and arrange in descending order.',
    steps: [
      '**Step 1: Expand product**',
      '$$18d - 12d^2 - 15 + 10d$$',
      '**Step 2: Combine like terms**',
      '$$-12d^2 + 28d - 15$$',
      '**Final Verified Answer:** \\(-12d^2 + 28d - 15\\)'
    ],
    difficulty: 2
  },
  {
    topic_id: 126,
    title: 'Binomial Multiplication 4(e)',
    text: 'Expand the expression: \\((4 - 2e)(3 - 5e)\\)',
    formula: '(4 - 2e)(3 - 5e)',
    type: 'MCQ',
    options: ['10e^2 - 26e + 12', '10e^2 + 26e + 12', '10e^2 - 14e + 12', '6e^2 - 26e + 12'],
    answer: '10e^2 - 26e + 12',
    hint: '-2e times -5e gives +10e^2.',
    steps: [
      '**Step 1: Expand terms**',
      '$$12 - 20e - 6e + 10e^2$$',
      '**Step 2: Simplify and reorder**',
      '$$10e^2 - 26e + 12$$',
      '**Final Verified Answer:** \\(10e^2 - 26e + 12\\)'
    ],
    difficulty: 2
  },
  {
    topic_id: 126,
    title: 'Binomial Multiplication 4(f)',
    text: 'Expand the expression: \\((4f - 5)(-3f - 1)\\)',
    formula: '(4f - 5)(-3f - 1)',
    type: 'MCQ',
    options: ['-12f^2 + 11f + 5', '-12f^2 - 19f + 5', '12f^2 + 11f + 5', '-12f^2 + 11f - 5'],
    answer: '-12f^2 + 11f + 5',
    hint: '-5 times -1 gives +5.',
    steps: [
      '**Step 1: Multiply terms**',
      '$$-12f^2 - 4f + 15f + 5$$',
      '**Step 2: Combine terms**',
      '$$-12f^2 + 11f + 5$$',
      '**Final Verified Answer:** \\(-12f^2 + 11f + 5\\)'
    ],
    difficulty: 2
  },

  // --- Section 5 ---
  {
    topic_id: 125,
    title: 'Multi-Variable Polynomial Expansion 5(a)',
    text: 'Expand the expression: \\((5x - 3y)(4x - y)\\)',
    formula: '(5x - 3y)(4x - y)',
    type: 'MCQ',
    options: ['20x^2 - 17xy + 3y^2', '20x^2 - 7xy + 3y^2', '20x^2 - 17xy - 3y^2', '9x^2 - 17xy + 3y^2'],
    answer: '20x^2 - 17xy + 3y^2',
    hint: 'Combine -5xy and -12xy to get -17xy.',
    steps: [
      '**Step 1: FOIL expansion**',
      '$$20x^2 - 5xy - 12xy + 3y^2$$',
      '**Step 2: Combine xy terms**',
      '$$20x^2 - 17xy + 3y^2$$',
      '**Final Verified Answer:** \\(20x^2 - 17xy + 3y^2\\)'
    ],
    difficulty: 3
  },
  {
    topic_id: 125,
    title: 'Multi-Variable Polynomial Expansion 5(b)',
    text: 'Expand the expression: \\((4 - p)(2p + 7)\\)',
    formula: '(4 - p)(2p + 7)',
    type: 'MCQ',
    options: ['-2p^2 + p + 28', '-2p^2 + 15p + 28', '2p^2 + p + 28', '-2p^2 - p + 28'],
    answer: '-2p^2 + p + 28',
    hint: '8p - 7p = p.',
    steps: [
      '**Step 1: Expand terms**',
      '$$8p + 28 - 2p^2 - 7p$$',
      '**Step 2: Reorder terms**',
      '$$-2p^2 + p + 28$$',
      '**Final Verified Answer:** \\(-2p^2 + p + 28\\)'
    ],
    difficulty: 2
  },
  {
    topic_id: 125,
    title: 'Multi-Variable Polynomial Expansion 5(c)',
    text: 'Expand the expression: \\(5(2a + 3)(3a - 2)\\)',
    formula: '5(2a + 3)(3a - 2)',
    type: 'MCQ',
    options: ['30a^2 + 25a - 30', '30a^2 + 13a - 30', '30a^2 + 25a - 6', '10a^2 + 25a - 30'],
    answer: '30a^2 + 25a - 30',
    hint: 'Expand binomials first then multiply the entire quadratic by 5.',
    steps: [
      '**Step 1: Expand binomials**',
      '$$5(6a^2 - 4a + 9a - 6) = 5(6a^2 + 5a - 6)$$',
      '**Step 2: Distribute 5**',
      '$$30a^2 + 25a - 30$$',
      '**Final Verified Answer:** \\(30a^2 + 25a - 30\\)'
    ],
    difficulty: 3
  },
  {
    topic_id: 125,
    title: 'Multi-Variable Polynomial Expansion 5(d)',
    text: 'Expand the expression: \\((3m^2 - n)(m + 3n^2)\\)',
    formula: '(3m^2 - n)(m + 3n^2)',
    type: 'MCQ',
    options: ['3m^3 + 9m^2n^2 - mn - 3n^3', '3m^3 + 9m^2n^2 + mn - 3n^3', '3m^3 + 6m^2n^2 - mn - 3n^3', '3m^3 - 3n^3'],
    answer: '3m^3 + 9m^2n^2 - mn - 3n^3',
    hint: 'Multiply each term in first parentheses by each term in second.',
    steps: [
      '**Step 1: FOIL expansion**',
      '$$3m^2(m) + 3m^2(3n^2) - n(m) - n(3n^2)$$',
      '**Step 2: Compute powers**',
      '$$3m^3 + 9m^2n^2 - mn - 3n^3$$',
      '**Final Verified Answer:** \\(3m^3 + 9m^2n^2 - mn - 3n^3\\)'
    ],
    difficulty: 3
  },
  {
    topic_id: 125,
    title: 'Multi-Variable Polynomial Expansion 5(e)',
    text: 'Expand the expression: \\((p - 2q)(6p + 3q - 2)\\)',
    formula: '(p - 2q)(6p + 3q - 2)',
    type: 'MCQ',
    options: ['6p^2 - 9pq - 2p - 6q^2 + 4q', '6p^2 + 15pq - 2p - 6q^2 + 4q', '6p^2 - 9pq - 6q^2', '6p^2 - 9pq - 2p - 6q^2 - 4q'],
    answer: '6p^2 - 9pq - 2p - 6q^2 + 4q',
    hint: 'Multiply p across trinomial, then -2q across trinomial.',
    steps: [
      '**Step 1: Distribute binomial terms**',
      '$$p(6p + 3q - 2) - 2q(6p + 3q - 2)$$',
      '**Step 2: Expand and combine pq terms**',
      '$$6p^2 + 3pq - 2p - 12pq - 6q^2 + 4q = 6p^2 - 9pq - 2p - 6q^2 + 4q$$',
      '**Final Verified Answer:** \\(6p^2 - 9pq - 2p - 6q^2 + 4q\\)'
    ],
    difficulty: 3
  },
  {
    topic_id: 125,
    title: 'Multi-Variable Polynomial Expansion 5(f)',
    text: 'Expand the expression: \\(-4x^2y(x^3 - 2y)\\)',
    formula: '-4x^2y(x^3 - 2y)',
    type: 'MCQ',
    options: ['-4x^5y + 8x^2y^2', '-4x^6y + 8x^2y^2', '-4x^5y - 8x^2y^2', '-4x^5y + 6x^2y^2'],
    answer: '-4x^5y + 8x^2y^2',
    hint: 'Add exponents: x^2 * x^3 = x^5.',
    steps: [
      '**Step 1: Distribute monomial**',
      '$$-4x^2y(x^3) - 4x^2y(-2y)$$',
      '**Step 2: Multiply coefficients and add exponents**',
      '$$-4x^5y + 8x^2y^2$$',
      '**Final Verified Answer:** \\(-4x^5y + 8x^2y^2\\)'
    ],
    difficulty: 2
  },

  // --- Section 6 ---
  {
    topic_id: 125,
    title: 'Advanced Expression Simplification 6(a)',
    text: 'Expand and simplify: \\((x - 3y)(3x + 2y) - 2(3xy)\\)',
    formula: '(x - 3y)(3x + 2y) - 2(3xy)',
    type: 'MCQ',
    options: ['3x^2 - 13xy - 6y^2', '3x^2 - 7xy - 6y^2', '3x^2 - 13xy + 6y^2', '3x^2 - 19xy - 6y^2'],
    answer: '3x^2 - 13xy - 6y^2',
    hint: 'Expand binomial first, then subtract 6xy.',
    steps: [
      '**Step 1: FOIL binomials**',
      '$$3x^2 + 2xy - 9xy - 6y^2 = 3x^2 - 7xy - 6y^2$$',
      '**Step 2: Subtract 6xy**',
      '$$3x^2 - 7xy - 6y^2 - 6xy = 3x^2 - 13xy - 6y^2$$',
      '**Final Verified Answer:** \\(3x^2 - 13xy - 6y^2\\)'
    ],
    difficulty: 3
  },
  {
    topic_id: 125,
    title: 'Advanced Expression Simplification 6(b)',
    text: 'Expand and simplify: \\(2x(x - 2y)(3 - xy)\\)',
    formula: '2x(x - 2y)(3 - xy)',
    type: 'MCQ',
    options: ['6x^2 - 2x^3y - 12xy + 4x^2y^2', '6x^2 - 2x^3y - 12xy - 4x^2y^2', '6x^2 - 2x^2y - 12xy + 4xy^2', '3x^2 - x^3y - 6xy + 2x^2y^2'],
    answer: '6x^2 - 2x^3y - 12xy + 4x^2y^2',
    hint: 'Expand inner binomial product, then multiply by 2x.',
    steps: [
      '**Step 1: Multiply binomials**',
      '$$(x - 2y)(3 - xy) = 3x - x^2y - 6y + 2xy^2$$',
      '**Step 2: Multiply by 2x**',
      '$$2x(3x - x^2y - 6y + 2xy^2) = 6x^2 - 2x^3y - 12xy + 4x^2y^2$$',
      '**Final Verified Answer:** \\(6x^2 - 2x^3y - 12xy + 4x^2y^2\\)'
    ],
    difficulty: 4
  },
  {
    topic_id: 125,
    title: 'Advanced Expression Simplification 6(c)',
    text: 'Expand and simplify: \\(2x(3x - y) - 3(x^2 + 3xy - y^2)\\)',
    formula: '2x(3x - y) - 3(x^2 + 3xy - y^2)',
    type: 'MCQ',
    options: ['3x^2 - 11xy + 3y^2', '3x^2 - 7xy + 3y^2', '3x^2 - 11xy - 3y^2', '9x^2 - 11xy + 3y^2'],
    answer: '3x^2 - 11xy + 3y^2',
    hint: '-2xy and -9xy combine to -11xy.',
    steps: [
      '**Step 1: Expand both terms**',
      '$$6x^2 - 2xy - 3x^2 - 9xy + 3y^2$$',
      '**Step 2: Combine like terms**',
      '$$(6x^2 - 3x^2) + (-2xy - 9xy) + 3y^2 = 3x^2 - 11xy + 3y^2$$',
      '**Final Verified Answer:** \\(3x^2 - 11xy + 3y^2\\)'
    ],
    difficulty: 3
  },
  {
    topic_id: 125,
    title: 'Advanced Expression Simplification 6(d)',
    text: 'Expand and simplify: \\((2a + 3b)(3a - 5b) + 3a(b - a)\\)',
    formula: '(2a + 3b)(3a - 5b) + 3a(b - a)',
    type: 'MCQ',
    options: ['3a^2 + 2ab - 15b^2', '3a^2 - 4ab - 15b^2', '9a^2 + 2ab - 15b^2', '3a^2 + 2ab + 15b^2'],
    answer: '3a^2 + 2ab - 15b^2',
    hint: 'Expand (2a+3b)(3a-5b) and 3a(b-a) then collect terms.',
    steps: [
      '**Step 1: FOIL binomial and expand monomial**',
      '$$6a^2 - 10ab + 9ab - 15b^2 + 3ab - 3a^2$$',
      '**Step 2: Combine like terms**',
      '$$(6a^2 - 3a^2) + (-10ab + 9ab + 3ab) - 15b^2 = 3a^2 + 2ab - 15b^2$$',
      '**Final Verified Answer:** \\(3a^2 + 2ab - 15b^2\\)'
    ],
    difficulty: 3
  },

  // --- Section 7 (Word / Multi-Step Problems) ---
  {
    topic_id: 125,
    title: 'Algebraic Operation Word Problem 7(a)',
    text: 'Subtract the product of \\((2y - 3x)\\) and \\((5x - 3y)\\) from \\(2xy(7x - 3y)\\).',
    formula: '2xy(7x - 3y) - (2y - 3x)(5x - 3y)',
    type: 'MCQ',
    options: [
      '14x^2y - 6xy^2 + 15x^2 - 19xy + 6y^2',
      '14x^2y - 6xy^2 - 15x^2 + 19xy - 6y^2',
      '14x^2y - 6xy^2 + 15x^2 - 19xy - 6y^2',
      '14x^2y + 6xy^2 + 15x^2 + 19xy + 6y^2'
    ],
    answer: '14x^2y - 6xy^2 + 15x^2 - 19xy + 6y^2',
    hint: 'Find product P = (2y-3x)(5x-3y), expand target T = 2xy(7x-3y), then compute T - P.',
    steps: [
      '**Step 1: Calculate binomial product P**',
      '$$P = (2y - 3x)(5x - 3y) = 10xy - 6y^2 - 15x^2 + 9xy = -15x^2 + 19xy - 6y^2$$',
      '**Step 2: Expand target expression T**',
      '$$T = 2xy(7x - 3y) = 14x^2y - 6xy^2$$',
      '**Step 3: Subtract P from T**',
      '$$14x^2y - 6xy^2 - (-15x^2 + 19xy - 6y^2) = 14x^2y - 6xy^2 + 15x^2 - 19xy + 6y^2$$',
      '**Final Verified Answer:** \\(14x^2y - 6xy^2 + 15x^2 - 19xy + 6y^2\\)'
    ],
    difficulty: 4
  },
  {
    topic_id: 125,
    title: 'Algebraic Operation Word Problem 7(b)',
    text: 'Find the expression that will give a result of \\((27a^2 + 6a + 4b^2)\\) when the product of \\((8a - 4b + 3)\\) and \\((b - 2a)\\) is subtracted from it.',
    formula: 'E - (8a - 4b + 3)(b - 2a) = 27a^2 + 6a + 4b^2',
    type: 'MCQ',
    options: [
      '11a^2 + 16ab + 3b',
      '43a^2 - 16ab + 12a + 8b^2 - 3b',
      '11a^2 - 16ab + 3b',
      '11a^2 + 16ab - 3b'
    ],
    answer: '11a^2 + 16ab + 3b',
    hint: 'Set up equation E - P = R, so E = R + P.',
    steps: [
      '**Step 1: Calculate product P**',
      '$$P = (8a - 4b + 3)(b - 2a) = 8ab - 16a^2 - 4b^2 + 8ab + 3b - 6a = -16a^2 + 16ab - 4b^2 - 6a + 3b$$',
      '**Step 2: Solve E = R + P**',
      '$$E = (27a^2 + 6a + 4b^2) + (-16a^2 + 16ab - 4b^2 - 6a + 3b)$$',
      '**Step 3: Combine like terms**',
      '$$E = (27a^2 - 16a^2) + 16ab + (4b^2 - 4b^2) + (6a - 6a) + 3b = 11a^2 + 16ab + 3b$$',
      '**Final Verified Answer:** \\(11a^2 + 16ab + 3b\\)'
    ],
    difficulty: 4
  },

  // --- Section 8 (Factorisation by Grouping) ---
  {
    topic_id: 126,
    title: 'Factorisation by Grouping 8(a)',
    text: 'Factorise the expression completely: \\(2m^2 - 3mn - 2mp + 3np\\)',
    formula: '2m^2 - 3mn - 2mp + 3np',
    type: 'MCQ',
    options: ['(m - p)(2m - 3n)', '(m + p)(2m - 3n)', '(m - p)(2m + 3n)', '(2m - p)(m - 3n)'],
    answer: '(m - p)(2m - 3n)',
    hint: 'Group first two terms and last two terms.',
    steps: [
      '**Step 1: Group terms**',
      '$$(2m^2 - 3mn) - (2mp - 3np)$$',
      '**Step 2: Factor out common terms**',
      '$$m(2m - 3n) - p(2m - 3n)$$',
      '**Step 3: Extract binomial factor**',
      '$$(m - p)(2m - 3n)$$',
      '**Final Verified Answer:** \\((m - p)(2m - 3n)\\)'
    ],
    difficulty: 3
  },
  {
    topic_id: 126,
    title: 'Factorisation by Grouping 8(b)',
    text: 'Factorise the expression completely: \\(x^3 - 2x - 2x^2 + 4\\)',
    formula: 'x^3 - 2x - 2x^2 + 4',
    type: 'MCQ',
    options: ['(x^2 - 2)(x - 2)', '(x^2 + 2)(x - 2)', '(x^2 - 2)(x + 2)', '(x - 2)^3'],
    answer: '(x^2 - 2)(x - 2)',
    hint: 'Re-order terms as x^3 - 2x^2 - 2x + 4 before grouping.',
    steps: [
      '**Step 1: Re-order polynomial**',
      '$$x^3 - 2x^2 - 2x + 4$$',
      '**Step 2: Group and factor out common terms**',
      '$$x^2(x - 2) - 2(x - 2)$$',
      '**Step 3: Extract common factor (x - 2)**',
      '$$(x^2 - 2)(x - 2)$$',
      '**Final Verified Answer:** \\((x^2 - 2)(x - 2)\\)'
    ],
    difficulty: 3
  },
  {
    topic_id: 126,
    title: 'Factorisation by Grouping 8(c)',
    text: 'Factorise the expression completely: \\(9 - 3a + ab - 3b\\)',
    formula: '9 - 3a + ab - 3b',
    type: 'MCQ',
    options: ['(3 - b)(3 - a)', '(3 + b)(3 - a)', '(3 - b)(3 + a)', '(9 - b)(1 - a)'],
    answer: '(3 - b)(3 - a)',
    hint: 'Factor 3 from (9 - 3a) and -b from (3b - ab).',
    steps: [
      '**Step 1: Group terms in pairs**',
      '$$(9 - 3a) + (ab - 3b)$$',
      '**Step 2: Factor out GCF**',
      '$$3(3 - a) - b(3 - a)$$',
      '**Step 3: Extract binomial factor**',
      '$$(3 - b)(3 - a)$$',
      '**Final Verified Answer:** \\((3 - b)(3 - a)\\)'
    ],
    difficulty: 3
  },
  {
    topic_id: 126,
    title: 'Factorisation by Grouping 8(d)',
    text: 'Factorise the expression completely: \\(4x^2 - 28xy - x + 7y\\)',
    formula: '4x^2 - 28xy - x + 7y',
    type: 'MCQ',
    options: ['(4x - 1)(x - 7y)', '(4x + 1)(x - 7y)', '(4x - 1)(x + 7y)', '(x - 1)(4x - 7y)'],
    answer: '(4x - 1)(x - 7y)',
    hint: 'Factor 4x from first two terms and -1 from last two.',
    steps: [
      '**Step 1: Factor GCF from pairs**',
      '$$4x(x - 7y) - 1(x - 7y)$$',
      '**Step 2: Extract binomial (x - 7y)**',
      '$$(4x - 1)(x - 7y)$$',
      '**Final Verified Answer:** \\((4x - 1)(x - 7y)\\)'
    ],
    difficulty: 3
  },

  // --- Section 9 (Quadratic Trinomial Factorisation) ---
  {
    topic_id: 126,
    title: 'Quadratic Trinomial Factorisation 9(a)',
    text: 'Factorise completely: \\(x^2 + 3xy - 4y^2\\)',
    formula: 'x^2 + 3xy - 4y^2',
    type: 'MCQ',
    options: ['(x + 4y)(x - y)', '(x - 4y)(x + y)', '(x + 2y)(x - 2y)', '(x + 3y)(x - y)'],
    answer: '(x + 4y)(x - y)',
    hint: 'Find factors of -4 that add up to +3.',
    steps: [
      '**Step 1: Identify coefficients**',
      'Product = -4, Sum = +3 => Numbers are +4 and -1',
      '**Step 2: Factorize trinomial**',
      '$$(x + 4y)(x - y)$$',
      '**Final Verified Answer:** \\((x + 4y)(x - y)\\)'
    ],
    difficulty: 3
  },
  {
    topic_id: 126,
    title: 'Quadratic Trinomial Factorisation 9(b)',
    text: 'Factorise completely: \\(3a^2 - 10ab - 8b^2\\)',
    formula: '3a^2 - 10ab - 8b^2',
    type: 'MCQ',
    options: ['(3a + 2b)(a - 4b)', '(3a - 2b)(a + 4b)', '(3a - 4b)(a + 2b)', '(3a + 8b)(a - b)'],
    answer: '(3a + 2b)(a - 4b)',
    hint: 'Product 3 * (-8) = -24. Factors of -24 summing to -10 are -12 and +2.',
    steps: [
      '**Step 1: Split middle term**',
      '$$3a^2 - 12ab + 2ab - 8b^2$$',
      '**Step 2: Factor by grouping**',
      '$$3a(a - 4b) + 2b(a - 4b) = (3a + 2b)(a - 4b)$$',
      '**Final Verified Answer:** \\((3a + 2b)(a - 4b)\\)'
    ],
    difficulty: 3
  },
  {
    topic_id: 126,
    title: 'Quadratic Trinomial Factorisation 9(c)',
    text: 'Factorise completely: \\(3x^2 + 11xy - 20y^2\\)',
    formula: '3x^2 + 11xy - 20y^2',
    type: 'MCQ',
    options: ['(3x - 4y)(x + 5y)', '(3x + 4y)(x - 5y)', '(3x - 5y)(x + 4y)', '(3x - 20y)(x + y)'],
    answer: '(3x - 4y)(x + 5y)',
    hint: 'Product 3 * (-20) = -60. Factors of -60 summing to +11 are +15 and -4.',
    steps: [
      '**Step 1: Split middle term**',
      '$$3x^2 + 15xy - 4xy - 20y^2$$',
      '**Step 2: Factor by grouping**',
      '$$3x(x + 5y) - 4y(x + 5y) = (3x - 4y)(x + 5y)$$',
      '**Final Verified Answer:** \\((3x - 4y)(x + 5y)\\)'
    ],
    difficulty: 3
  },
  {
    topic_id: 126,
    title: 'Quadratic Trinomial Factorisation 9(d)',
    text: 'Factorise completely: \\(4a^2b^2 + 3ab - 1\\)',
    formula: '4a^2b^2 + 3ab - 1',
    type: 'MCQ',
    options: ['(4ab - 1)(ab + 1)', '(4ab + 1)(ab - 1)', '(2ab - 1)(2ab + 1)', '(4ab - 3)(ab + 1)'],
    answer: '(4ab - 1)(ab + 1)',
    hint: 'Treat ab as a single term u: 4u^2 + 3u - 1.',
    steps: [
      '**Step 1: Substitute u = ab**',
      '$$4u^2 + 3u - 1$$',
      '**Step 2: Split middle term**',
      '$$4u^2 + 4u - u - 1 = 4u(u + 1) - 1(u + 1) = (4u - 1)(u + 1)$$',
      '**Step 3: Substitute u = ab back**',
      '$$(4ab - 1)(ab + 1)$$',
      '**Final Verified Answer:** \\((4ab - 1)(ab + 1)\\)'
    ],
    difficulty: 3
  },
  {
    topic_id: 126,
    title: 'Quadratic Trinomial Factorisation 9(e)',
    text: 'Factorise completely: \\(6p^2 - 7pq - 20q^2\\)',
    formula: '6p^2 - 7pq - 20q^2',
    type: 'MCQ',
    options: ['(3p + 4q)(2p - 5q)', '(3p - 4q)(2p + 5q)', '(6p + 5q)(p - 4q)', '(3p + 2q)(2p - 10q)'],
    answer: '(3p + 4q)(2p - 5q)',
    hint: 'Product 6 * (-20) = -120. Factors summing to -7 are -15 and +8.',
    steps: [
      '**Step 1: Split middle term**',
      '$$6p^2 - 15pq + 8pq - 20q^2$$',
      '**Step 2: Factor by grouping**',
      '$$3p(2p - 5q) + 4q(2p - 5q) = (3p + 4q)(2p - 5q)$$',
      '**Final Verified Answer:** \\((3p + 4q)(2p - 5q)\\)'
    ],
    difficulty: 4
  },
  {
    topic_id: 126,
    title: 'Quadratic Trinomial Factorisation 9(f)',
    text: 'Factorise completely: \\(20e^2 + ef - 12f^2\\)',
    formula: '20e^2 + ef - 12f^2',
    type: 'MCQ',
    options: ['(4e - 3f)(5e + 4f)', '(4e + 3f)(5e - 4f)', '(20e - 3f)(e + 4f)', '(4e - 12f)(5e + f)'],
    answer: '(4e - 3f)(5e + 4f)',
    hint: 'Product 20 * (-12) = -240. Factors summing to +1 are +16 and -15.',
    steps: [
      '**Step 1: Split middle term**',
      '$$20e^2 + 16ef - 15ef - 12f^2$$',
      '**Step 2: Factor by grouping**',
      '$$4e(5e + 4f) - 3f(5e + 4f) = (4e - 3f)(5e + 4f)$$',
      '**Final Verified Answer:** \\((4e - 3f)(5e + 4f)\\)'
    ],
    difficulty: 4
  }
];

const insertStmt = db.prepare(`
  INSERT INTO questions (
    topic_id, question_title, question_text, math_formula, question_type,
    options_json, correct_answer, hint, working_steps_json, image_url, image_alt, difficulty, created_by
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, '', '', ?, 'pdf_import_algebra_basic')
`);

let insertedCount = 0;

db.transaction(() => {
  for (const q of pdfQuestions) {
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
      q.difficulty
    );
    insertedCount++;
  }
})();

console.log(`Successfully inserted ${insertedCount} questions into QBank SQLite database.`);

// Export updated questions to questions_bank.xlsx
const excelPath = path.join(__dirname, '..', 'questions_bank.xlsx');
exportQuestionsToExcel(db, excelPath);
console.log(`Updated Excel spreadsheet export saved at ${excelPath}`);
