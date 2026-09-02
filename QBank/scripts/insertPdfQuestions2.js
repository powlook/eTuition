import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { exportQuestionsToExcel } from '../server/excelService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '..', 'server', 'qbank.db');
const db = new Database(dbPath);

console.log('Inserting Special Identities & Proportion PDF questions into QBank...');

const pdfQuestions = [
  // =========================================================================
  // PART A: Special Algebraic Identities - Basic.pdf (Form 8 - Topic ID 126)
  // =========================================================================
  {
    topic_id: 126,
    title: 'Special Algebraic Identities 1(a)',
    text: 'Expand and simplify the algebraic expression: \\(((5p + 3q)^2)\\)',
    formula: '(5p + 3q)^2',
    type: 'MCQ',
    options: ['25p^2 + 30pq + 9q^2', '25p^2 + 15pq + 9q^2', '25p^2 + 9q^2', '25p^2 + 30pq + 6q^2'],
    answer: '25p^2 + 30pq + 9q^2',
    hint: 'Apply perfect square binomial expansion: (a + b)^2 = a^2 + 2ab + b^2.',
    steps: [
      '**Step 1: Write perfect square expansion formula**',
      '$$(a + b)^2 = a^2 + 2ab + b^2$$',
      '**Step 2: Substitute a = 5p and b = 3q**',
      '$$(5p)^2 + 2(5p)(3q) + (3q)^2 = 25p^2 + 30pq + 9q^2$$',
      '**Final Verified Answer:** \\(25p^2 + 30pq + 9q^2\\)'
    ],
    difficulty: 2
  },
  {
    topic_id: 126,
    title: 'Special Algebraic Identities 1(b)',
    text: 'Expand and simplify the algebraic expression: \\(\\left(4a - \\frac{3}{2}b\\right)^2\\)',
    formula: '(4a - \\frac{3}{2}b)^2',
    type: 'MCQ',
    options: [
      '16a^2 - 12ab + \\frac{9}{4}b^2',
      '16a^2 - 6ab + \\frac{9}{4}b^2',
      '16a^2 - 12ab + \\frac{3}{4}b^2',
      '16a^2 + 12ab + \\frac{9}{4}b^2'
    ],
    answer: '16a^2 - 12ab + \\frac{9}{4}b^2',
    hint: 'Apply (a - b)^2 = a^2 - 2ab + b^2.',
    steps: [
      '**Step 1: Expand perfect square**',
      '$$(4a)^2 - 2(4a)\\left(\\frac{3}{2}b\\right) + \\left(\\frac{3}{2}b\\right)^2$$',
      '**Step 2: Simplify products and fractions**',
      '$$16a^2 - 12ab + \\frac{9}{4}b^2$$',
      '**Final Verified Answer:** \\(16a^2 - 12ab + \\frac{9}{4}b^2\\)'
    ],
    difficulty: 3
  },
  {
    topic_id: 126,
    title: 'Special Algebraic Identities 1(c)',
    text: 'Expand and simplify: \\((5m^2 - 2n)(5m^2 + 2n)\\)',
    formula: '(5m^2 - 2n)(5m^2 + 2n)',
    type: 'MCQ',
    options: ['25m^4 - 4n^2', '25m^4 + 4n^2', '25m^2 - 4n^2', '10m^4 - 4n^2'],
    answer: '25m^4 - 4n^2',
    hint: 'Apply difference of squares identity: (A - B)(A + B) = A^2 - B^2.',
    steps: [
      '**Step 1: Apply difference of squares identity**',
      '$$(5m^2)^2 - (2n)^2$$',
      '**Step 2: Simplify powers**',
      '$$25m^4 - 4n^2$$',
      '**Final Verified Answer:** \\(25m^4 - 4n^2\\)'
    ],
    difficulty: 2
  },
  {
    topic_id: 126,
    title: 'Special Algebraic Identities 1(d)',
    text: 'Expand and simplify: \\((x - 4y)^2 + (2x + y)^2\\)',
    formula: '(x - 4y)^2 + (2x + y)^2',
    type: 'MCQ',
    options: ['5x^2 - 4xy + 17y^2', '5x^2 - 12xy + 17y^2', '5x^2 + 4xy + 17y^2', '3x^2 - 4xy + 17y^2'],
    answer: '5x^2 - 4xy + 17y^2',
    hint: 'Expand both perfect squares then sum like terms.',
    steps: [
      '**Step 1: Expand each binomial square**',
      '$$(x^2 - 8xy + 16y^2) + (4x^2 + 4xy + y^2)$$',
      '**Step 2: Combine like terms**',
      '$$(x^2 + 4x^2) + (-8xy + 4xy) + (16y^2 + y^2) = 5x^2 - 4xy + 17y^2$$',
      '**Final Verified Answer:** \\(5x^2 - 4xy + 17y^2\\)'
    ],
    difficulty: 3
  },
  {
    topic_id: 126,
    title: 'Special Algebraic Identities 1(e)',
    text: 'Expand and simplify: \\((6p + q)(6p - q) - 5p(p - q)\\)',
    formula: '(6p + q)(6p - q) - 5p(p - q)',
    type: 'MCQ',
    options: ['31p^2 + 5pq - q^2', '31p^2 - 5pq - q^2', '36p^2 + 5pq - q^2', '31p^2 + 5pq + q^2'],
    answer: '31p^2 + 5pq - q^2',
    hint: 'Apply difference of squares to first term and distribute -5p to second term.',
    steps: [
      '**Step 1: Expand difference of squares and distribute -5p**',
      '$$(36p^2 - q^2) - (5p^2 - 5pq)$$',
      '**Step 2: Combine terms**',
      '$$36p^2 - q^2 - 5p^2 + 5pq = 31p^2 + 5pq - q^2$$',
      '**Final Verified Answer:** \\(31p^2 + 5pq - q^2\\)'
    ],
    difficulty: 3
  },
  {
    topic_id: 126,
    title: 'Special Algebraic Identities 1(f)',
    text: 'Expand and simplify: \\(3f(f + 1) - (2f - 1)^2\\)',
    formula: '3f(f + 1) - (2f - 1)^2',
    type: 'MCQ',
    options: ['-f^2 + 7f - 1', '-f^2 - f - 1', '-f^2 + 7f + 1', 'f^2 + 7f - 1'],
    answer: '-f^2 + 7f - 1',
    hint: 'Remember to subtract all terms of (2f - 1)^2.',
    steps: [
      '**Step 1: Distribute 3f and expand square**',
      '$$(3f^2 + 3f) - (4f^2 - 4f + 1)$$',
      '**Step 2: Distribute negative sign and combine**',
      '$$3f^2 + 3f - 4f^2 + 4f - 1 = -f^2 + 7f - 1$$',
      '**Final Verified Answer:** \\(-f^2 + 7f - 1\\)'
    ],
    difficulty: 3
  },
  {
    topic_id: 126,
    title: 'Special Algebraic Identities 2(a)',
    text: 'Factorise completely: \\(25x^2 - 40x + 16\\)',
    formula: '25x^2 - 40x + 16',
    type: 'MCQ',
    options: ['(5x - 4)^2', '(5x + 4)^2', '(5x - 8)^2', '(25x - 4)^2'],
    answer: '(5x - 4)^2',
    hint: 'Recognize perfect square trinomial pattern: A^2 - 2AB + B^2.',
    steps: [
      '**Step 1: Verify square terms**',
      '$$A^2 = (5x)^2, B^2 = (4)^2, 2AB = 2(5x)(4) = 40x$$',
      '**Step 2: Factorise as binomial square**',
      '$$(5x - 4)^2$$',
      '**Final Verified Answer:** \\((5x - 4)^2\\)'
    ],
    difficulty: 2
  },
  {
    topic_id: 126,
    title: 'Special Algebraic Identities 2(b)',
    text: 'Factorise completely: \\(\\frac{1}{4}a^2 + \\frac{1}{3}ab + \\frac{1}{9}b^2\\)',
    formula: '\\frac{1}{4}a^2 + \\frac{1}{3}ab + \\frac{1}{9}b^2',
    type: 'MCQ',
    options: [
      '(\\frac{1}{2}a + \\frac{1}{3}b)^2',
      '(\\frac{1}{4}a + \\frac{1}{9}b)^2',
      '(\\frac{1}{2}a - \\frac{1}{3}b)^2',
      '(\\frac{1}{2}a + \\frac{1}{9}b)^2'
    ],
    answer: '(\\frac{1}{2}a + \\frac{1}{3}b)^2',
    hint: 'Check terms: (1/2 a)^2 = 1/4 a^2 and (1/3 b)^2 = 1/9 b^2.',
    steps: [
      '**Step 1: Identify A and B**',
      '$$A = \\frac{1}{2}a, B = \\frac{1}{3}b$$',
      '**Step 2: Verify middle term**',
      '$$2AB = 2\\left(\\frac{1}{2}a\\right)\\left(\\frac{1}{3}b\\right) = \\frac{1}{3}ab$$',
      '**Step 3: Write perfect square binomial**',
      '$$\\left(\\frac{1}{2}a + \\frac{1}{3}b\\right)^2$$',
      '**Final Verified Answer:** \\(\\left(\\frac{1}{2}a + \\frac{1}{3}b\\right)^2\\)'
    ],
    difficulty: 3
  },
  {
    topic_id: 126,
    title: 'Special Algebraic Identities 2(c)',
    text: 'Factorise completely: \\(\\frac{m^2}{49} - \\frac{4n^2}{9}\\)',
    formula: '\\frac{m^2}{49} - \\frac{4n^2}{9}',
    type: 'MCQ',
    options: [
      '(\\frac{m}{7} - \\frac{2n}{3})(\\frac{m}{7} + \\frac{2n}{3})',
      '(\\frac{m}{49} - \\frac{2n}{9})(\\frac{m}{49} + \\frac{2n}{9})',
      '(\\frac{m}{7} - \\frac{4n}{3})(\\frac{m}{7} + \\frac{4n}{3})',
      '(\\frac{m}{7} - \\frac{2n}{3})^2'
    ],
    answer: '(\\frac{m}{7} - \\frac{2n}{3})(\\frac{m}{7} + \\frac{2n}{3})',
    hint: 'Apply difference of two squares identity A^2 - B^2 = (A - B)(A + B).',
    steps: [
      '**Step 1: Write as difference of squares**',
      '$$\\left(\\frac{m}{7}\\right)^2 - \\left(\\frac{2n}{3}\\right)^2$$',
      '**Step 2: Factorise**',
      '$$\\left(\\frac{m}{7} - \\frac{2n}{3}\\right)\\left(\\frac{m}{7} + \\frac{2n}{3}\\right)$$',
      '**Final Verified Answer:** \\(\\left(\\frac{m}{7} - \\frac{2n}{3}\\right)\\left(\\frac{m}{7} + \\frac{2n}{3}\\right)\\)'
    ],
    difficulty: 3
  },
  {
    topic_id: 126,
    title: 'Special Algebraic Identities 2(d)',
    text: 'Factorise completely: \\(9y^2 - 4(y - 1)^2\\)',
    formula: '9y^2 - 4(y - 1)^2',
    type: 'MCQ',
    options: ['(y + 2)(5y - 2)', '(y - 2)(5y + 2)', '(5y + 2)(y - 2)', '(y + 1)(5y - 4)'],
    answer: '(y + 2)(5y - 2)',
    hint: 'Write as [3y]^2 - [2(y - 1)]^2 and use difference of squares.',
    steps: [
      '**Step 1: Write as A^2 - B^2**',
      '$$A = 3y, B = 2(y - 1) = 2y - 2$$',
      '**Step 2: Apply (A - B)(A + B)**',
      '$$[3y - (2y - 2)][3y + (2y - 2)]$$',
      '**Step 3: Simplify brackets**',
      '$$(3y - 2y + 2)(3y + 2y - 2) = (y + 2)(5y - 2)$$',
      '**Final Verified Answer:** \\((y + 2)(5y - 2)\\)'
    ],
    difficulty: 3
  },

  // --- Intermediate 3 ---
  {
    topic_id: 126,
    title: 'Special Algebraic Identities 3(a)',
    text: 'Expand and simplify: \\((2x + 5y)(3x - 2y) + (x - 2y)^2\\)',
    formula: '(2x + 5y)(3x - 2y) + (x - 2y)^2',
    type: 'MCQ',
    options: ['7x^2 + 7xy - 6y^2', '7x^2 + 15xy - 6y^2', '7x^2 + 7xy - 14y^2', '5x^2 + 7xy - 6y^2'],
    answer: '7x^2 + 7xy - 6y^2',
    hint: 'Expand FOIL product and square binomial, then sum.',
    steps: [
      '**Step 1: Expand FOIL product and square**',
      '$$(6x^2 + 11xy - 10y^2) + (x^2 - 4xy + 4y^2)$$',
      '**Step 2: Sum like terms**',
      '$$(6x^2 + x^2) + (11xy - 4xy) + (-10y^2 + 4y^2) = 7x^2 + 7xy - 6y^2$$',
      '**Final Verified Answer:** \\(7x^2 + 7xy - 6y^2\\)'
    ],
    difficulty: 3
  },
  {
    topic_id: 126,
    title: 'Special Algebraic Identities 3(b)',
    text: 'Expand and simplify: \\((2x + 3y)^2 - 2x(4x - 3y)\\)',
    formula: '(2x + 3y)^2 - 2x(4x - 3y)',
    type: 'MCQ',
    options: ['-4x^2 + 18xy + 9y^2', '-4x^2 + 6xy + 9y^2', '12x^2 + 18xy + 9y^2', '-4x^2 + 18xy - 9y^2'],
    answer: '-4x^2 + 18xy + 9y^2',
    hint: 'Square 2x+3y and subtract 8x^2 - 6xy.',
    steps: [
      '**Step 1: Expand square and product**',
      '$$(4x^2 + 12xy + 9y^2) - (8x^2 - 6xy)$$',
      '**Step 2: Combine terms**',
      '$$4x^2 + 12xy + 9y^2 - 8x^2 + 6xy = -4x^2 + 18xy + 9y^2$$',
      '**Final Verified Answer:** \\(-4x^2 + 18xy + 9y^2\\)'
    ],
    difficulty: 3
  },
  {
    topic_id: 126,
    title: 'Special Algebraic Identities 3(c)',
    text: 'Expand and simplify: \\(3(x + 4)^2 - (2 - x)(2 + x)\\)',
    formula: '3(x + 4)^2 - (2 - x)(2 + x)',
    type: 'MCQ',
    options: ['4x^2 + 24x + 44', '2x^2 + 24x + 44', '4x^2 + 24x + 52', '4x^2 + 8x + 44'],
    answer: '4x^2 + 24x + 44',
    hint: 'Notice (2 - x)(2 + x) = 4 - x^2.',
    steps: [
      '**Step 1: Expand square and difference of squares**',
      '$$3(x^2 + 8x + 16) - (4 - x^2)$$',
      '**Step 2: Distribute 3 and subtract**',
      '$$3x^2 + 24x + 48 - 4 + x^2 = 4x^2 + 24x + 44$$',
      '**Final Verified Answer:** \\(4x^2 + 24x + 44\\)'
    ],
    difficulty: 3
  },
  {
    topic_id: 126,
    title: 'Special Algebraic Identities 3(d)',
    text: 'Expand and simplify: \\(3(2p - 3)^2 - 2(3p - 1)(3p + 1)\\)',
    formula: '3(2p - 3)^2 - 2(3p - 1)(3p + 1)',
    type: 'MCQ',
    options: ['-6p^2 - 36p + 29', '-6p^2 - 36p + 25', '6p^2 - 36p + 29', '-6p^2 - 12p + 29'],
    answer: '-6p^2 - 36p + 29',
    hint: '(3p - 1)(3p + 1) = 9p^2 - 1.',
    steps: [
      '**Step 1: Expand square and product**',
      '$$3(4p^2 - 12p + 9) - 2(9p^2 - 1)$$',
      '**Step 2: Distribute constants**',
      '$$12p^2 - 36p + 27 - 18p^2 + 2 = -6p^2 - 36p + 29$$',
      '**Final Verified Answer:** \\(-6p^2 - 36p + 29\\)'
    ],
    difficulty: 3
  },

  // --- Intermediate 4 ---
  {
    topic_id: 126,
    title: 'Special Algebraic Identities 4(a)',
    text: 'Factorise completely: \\(36a^2 + 84ab + 49b^2\\)',
    formula: '36a^2 + 84ab + 49b^2',
    type: 'MCQ',
    options: ['(6a + 7b)^2', '(6a - 7b)^2', '(36a + 7b)^2', '(6a + 49b)^2'],
    answer: '(6a + 7b)^2',
    hint: '36a^2 = (6a)^2, 49b^2 = (7b)^2, 2(6a)(7b) = 84ab.',
    steps: [
      '**Step 1: Recognize perfect square trinomial**',
      '$$(6a)^2 + 2(6a)(7b) + (7b)^2$$',
      '**Step 2: Factorise as binomial square**',
      '$$(6a + 7b)^2$$',
      '**Final Verified Answer:** \\((6a + 7b)^2\\)'
    ],
    difficulty: 2
  },
  {
    topic_id: 126,
    title: 'Special Algebraic Identities 4(c)',
    text: 'Factorise completely: \\(3a^4b + 12a^3b^2 + 9a^2b^3\\)',
    formula: '3a^4b + 12a^3b^2 + 9a^2b^3',
    type: 'MCQ',
    options: ['3a^2b(a + b)(a + 3b)', '3a^2b(a + 2b)^2', '3ab(a + b)(a + 3b)', '3a^2b(a - b)(a - 3b)'],
    answer: '3a^2b(a + b)(a + 3b)',
    hint: 'First factor out the greatest common factor 3a^2b.',
    steps: [
      '**Step 1: Factor out GCF 3a^2b**',
      '$$3a^2b(a^2 + 4ab + 3b^2)$$',
      '**Step 2: Factor quadratic trinomial**',
      '$$3a^2b(a + b)(a + 3b)$$',
      '**Final Verified Answer:** \\(3a^2b(a + b)(a + 3b)\\)'
    ],
    difficulty: 3
  },
  {
    topic_id: 126,
    title: 'Special Algebraic Identities 4(e)',
    text: 'Factorise completely: \\(\\left(a - \\frac{b}{2}\\right)^2 - \\frac{9}{4}b^2\\)',
    formula: '(a - \\frac{b}{2})^2 - \\frac{9}{4}b^2',
    type: 'MCQ',
    options: ['(a - 2b)(a + b)', '(a + 2b)(a - b)', '(a - 3b)(a + b)', '(a - b)(a + 2b)'],
    answer: '(a - 2b)(a + b)',
    hint: 'Apply difference of two squares with A = a - b/2 and B = 3/2 b.',
    steps: [
      '**Step 1: Write as A^2 - B^2**',
      '$$\\left(a - \\frac{b}{2}\\right)^2 - \\left(\\frac{3}{2}b\\right)^2$$',
      '**Step 2: Apply (A - B)(A + B)**',
      '$$\\left[\\left(a - \\frac{b}{2}\\right) - \\frac{3}{2}b\\right]\\left[\\left(a - \\frac{b}{2}\\right) + \\frac{3}{2}b\\right]$$',
      '**Step 3: Simplify terms**',
      '$$(a - 2b)(a + b)$$',
      '**Final Verified Answer:** \\((a - 2b)(a + b)\\)'
    ],
    difficulty: 3
  },
  {
    topic_id: 126,
    title: 'Special Algebraic Identities 4(g)',
    text: 'Factorise completely: \\(4p^2 - 36q^4\\)',
    formula: '4p^2 - 36q^4',
    type: 'MCQ',
    options: ['4(p - 3q^2)(p + 3q^2)', '(2p - 6q^2)^2', '4(p^2 - 9q^2)', '2(p - 3q^2)(p + 3q^2)'],
    answer: '4(p - 3q^2)(p + 3q^2)',
    hint: 'Factor out GCF 4 first.',
    steps: [
      '**Step 1: Factor out 4**',
      '$$4(p^2 - 9q^4)$$',
      '**Step 2: Apply difference of squares**',
      '$$4(p - 3q^2)(p + 3q^2)$$',
      '**Final Verified Answer:** \\(4(p - 3q^2)(p + 3q^2)\\)'
    ],
    difficulty: 2
  },
  {
    topic_id: 126,
    title: 'Special Algebraic Identities 4(i)',
    text: 'Factorise completely: \\(\\frac{m^2}{9} - \\frac{mn}{6} + \\frac{n^2}{16}\\)',
    formula: '\\frac{m^2}{9} - \\frac{mn}{6} + \\frac{n^2}{16}',
    type: 'MCQ',
    options: [
      '(\\frac{m}{3} - \\frac{n}{4})^2',
      '(\\frac{m}{3} + \\frac{n}{4})^2',
      '(\\frac{m}{9} - \\frac{n}{16})^2',
      '(\\frac{m}{3} - \\frac{n}{16})^2'
    ],
    answer: '(\\frac{m}{3} - \\frac{n}{4})^2',
    hint: 'Recognize square terms (m/3)^2 and (n/4)^2 with middle term -2(m/3)(n/4) = -mn/6.',
    steps: [
      '**Step 1: Verify A and B**',
      '$$A = \\frac{m}{3}, B = \\frac{n}{4}, 2AB = \\frac{mn}{6}$$',
      '**Step 2: Write as perfect square**',
      '$$\\left(\\frac{m}{3} - \\frac{n}{4}\\right)^2$$',
      '**Final Verified Answer:** \\(\\left(\\frac{m}{3} - \\frac{n}{4}\\right)^2\\)'
    ],
    difficulty: 3
  },
  {
    topic_id: 126,
    title: 'Special Algebraic Identities 4(b)',
    text: 'Factorise completely: \\(16x^2 - 4xy + \\frac{1}{4}y^2\\)',
    formula: '16x^2 - 4xy + \\frac{1}{4}y^2',
    type: 'MCQ',
    options: [
      '(4x - \\frac{1}{2}y)^2',
      '(4x + \\frac{1}{2}y)^2',
      '(16x - \\frac{1}{2}y)^2',
      '(4x - \\frac{1}{4}y)^2'
    ],
    answer: '(4x - \\frac{1}{2}y)^2',
    hint: 'Check (4x)^2 = 16x^2 and (1/2 y)^2 = 1/4 y^2.',
    steps: [
      '**Step 1: Identify terms**',
      '$$A = 4x, B = \\frac{1}{2}y, 2AB = 4xy$$',
      '**Step 2: Factorise**',
      '$$\\left(4x - \\frac{1}{2}y\\right)^2$$',
      '**Final Verified Answer:** \\(\\left(4x - \\frac{1}{2}y\\right)^2\\)'
    ],
    difficulty: 3
  },
  {
    topic_id: 126,
    title: 'Special Algebraic Identities 4(d)',
    text: 'Factorise completely: \\(\\frac{1}{2}px^2 - \\frac{1}{8}py^2\\)',
    formula: '\\frac{1}{2}px^2 - \\frac{1}{8}py^2',
    type: 'MCQ',
    options: [
      '\\frac{1}{2}p(x - \\frac{1}{2}y)(x + \\frac{1}{2}y)',
      '\\frac{1}{2}p(x - \\frac{1}{4}y)^2',
      '\\frac{1}{8}p(2x - y)(2x + y)',
      '\\frac{1}{2}p(x^2 - \\frac{1}{8}y^2)'
    ],
    answer: '\\frac{1}{2}p(x - \\frac{1}{2}y)(x + \\frac{1}{2}y)',
    hint: 'Factor out 1/2 p first.',
    steps: [
      '**Step 1: Factor GCF 1/2 p**',
      '$$\\frac{1}{2}p\\left(x^2 - \\frac{1}{4}y^2\\right)$$',
      '**Step 2: Apply difference of squares**',
      '$$\\frac{1}{2}p\\left(x - \\frac{1}{2}y\\right)\\left(x + \\frac{1}{2}y\\right)$$',
      '**Final Verified Answer:** \\(\\frac{1}{2}p\\left(x - \\frac{1}{2}y\\right)\\left(x + \\frac{1}{2}y\\right)\\)'
    ],
    difficulty: 3
  },
  {
    topic_id: 126,
    title: 'Special Algebraic Identities 4(f)',
    text: 'Factorise completely: \\(12p^2 - 75q^2\\)',
    formula: '12p^2 - 75q^2',
    type: 'MCQ',
    options: ['3(2p - 5q)(2p + 5q)', '(6p - 15q)(2p + 5q)', '3(4p^2 - 25q^2)', '3(2p - 5q)^2'],
    answer: '3(2p - 5q)(2p + 5q)',
    hint: 'Factor out GCF 3.',
    steps: [
      '**Step 1: Factor out 3**',
      '$$3(4p^2 - 25q^2)$$',
      '**Step 2: Factor difference of squares**',
      '$$3(2p - 5q)(2p + 5q)$$',
      '**Final Verified Answer:** \\(3(2p - 5q)(2p + 5q)\\)'
    ],
    difficulty: 2
  },
  {
    topic_id: 126,
    title: 'Special Algebraic Identities 4(h)',
    text: 'Factorise completely: \\(48a^2b^2 - 243\\)',
    formula: '48a^2b^2 - 243',
    type: 'MCQ',
    options: ['3(4ab - 9)(4ab + 9)', '3(16ab - 81)', '3(4ab - 9)^2', '(12ab - 27)(4ab + 9)'],
    answer: '3(4ab - 9)(4ab + 9)',
    hint: 'Factor out 3 to get 3(16a^2b^2 - 81).',
    steps: [
      '**Step 1: Factor out 3**',
      '$$3(16a^2b^2 - 81)$$',
      '**Step 2: Factor difference of squares**',
      '$$3(4ab - 9)(4ab + 9)$$',
      '**Final Verified Answer:** \\(3(4ab - 9)(4ab + 9)\\)'
    ],
    difficulty: 3
  },
  {
    topic_id: 126,
    title: 'Special Algebraic Identities 4(j)',
    text: 'Factorise and simplify completely: \\(\\left(\\frac{3}{5}x - \\frac{2}{5}y\\right)^2 - \\left(\\frac{3}{5}x + \\frac{2}{5}y\\right)^2\\)',
    formula: '(\\frac{3}{5}x - \\frac{2}{5}y)^2 - (\\frac{3}{5}x + \\frac{2}{5}y)^2',
    type: 'MCQ',
    options: ['-\\frac{24}{25}xy', '\\frac{24}{25}xy', '-\\frac{12}{25}xy', '0'],
    answer: '-\\frac{24}{25}xy',
    hint: 'Apply difference of squares A^2 - B^2 = (A - B)(A + B).',
    steps: [
      '**Step 1: Apply (A - B)(A + B)**',
      '$$A - B = -\\frac{4}{5}y, A + B = \\frac{6}{5}x$$',
      '**Step 2: Calculate product**',
      '$$\\left(-\\frac{4}{5}y\\right)\\left(\\frac{6}{5}x\\right) = -\\frac{24}{25}xy$$',
      '**Final Verified Answer:** \\(-\\frac{24}{25}xy\\)'
    ],
    difficulty: 3
  },

  // =========================================================================
  // PART B: Direct and Inverse Proportions - Basic_Questions.pdf
  // =========================================================================
  // --- Form 7 Topic 109: Use of rates ---
  {
    topic_id: 109,
    title: 'Direct and Inverse Proportion - Work Rate 4(i)',
    text: 'A building project takes 12 men 54 days to complete. How long will it take 9 men to finish the same project?',
    formula: '\\text{Days} = \\frac{\\text{Total Man-Days}}{\\text{Men}}',
    type: 'MCQ',
    options: ['72 days', '40.5 days', '64 days', '81 days'],
    answer: '72 days',
    hint: 'Calculate total man-days = 12 * 54, then divide by 9 men.',
    steps: [
      '**Step 1: Calculate total work in man-days**',
      '$$\\text{Total Work} = 12 \\times 54 = 648\\text{ man-days}$$',
      '**Step 2: Divide by 9 men**',
      '$$\\text{Days} = \\frac{648}{9} = 72\\text{ days}$$',
      '**Final Verified Answer:** 72 days'
    ],
    difficulty: 2
  },
  {
    topic_id: 109,
    title: 'Direct and Inverse Proportion - Work Rate 4(ii)',
    text: 'A building project takes 12 men 54 days to complete. How many men are needed to complete this project in 36 days?',
    formula: '\\text{Men} = \\frac{\\text{Total Man-Days}}{\\text{Days}}',
    type: 'MCQ',
    options: ['18 men', '15 men', '24 men', '20 men'],
    answer: '18 men',
    hint: 'Divide total work (648 man-days) by 36 days.',
    steps: [
      '**Step 1: Calculate total man-days**',
      '$$\\text{Total Work} = 12 \\times 54 = 648\\text{ man-days}$$',
      '**Step 2: Calculate required workforce**',
      '$$\\text{Men} = \\frac{648}{36} = 18\\text{ men}$$',
      '**Final Verified Answer:** 18 men'
    ],
    difficulty: 2
  },
  {
    topic_id: 109,
    title: 'Direct and Inverse Proportion - Work Rate 5',
    text: 'It takes 9 men to build a house in 40 days. How many extra men are needed if the same house is to be built in 15 days, assuming they work at the same rate?',
    formula: '\\text{Extra Men} = \\frac{\\text{Total Work}}{15} - 9',
    type: 'MCQ',
    options: ['15 extra men', '24 extra men', '12 extra men', '9 extra men'],
    answer: '15 extra men',
    hint: 'Find total workforce needed (360/15 = 24), then subtract initial 9 men.',
    steps: [
      '**Step 1: Calculate total work required**',
      '$$\\text{Total Work} = 9 \\times 40 = 360\\text{ man-days}$$',
      '**Step 2: Calculate required workforce for 15 days**',
      '$$\\text{Total Men} = \\frac{360}{15} = 24\\text{ men}$$',
      '**Step 3: Subtract initial 9 men**',
      '$$\\text{Extra Men} = 24 - 9 = 15\\text{ extra men}$$',
      '**Final Verified Answer:** 15 extra men'
    ],
    difficulty: 3
  },
  {
    topic_id: 109,
    title: 'Direct and Inverse Proportion - Daily Expenditure 6',
    text: 'A housewife has enough money to run a household for 3 weeks (21 days) if she spends $24 a day. How many more days can the same amount of money last if she spends $3 less a day?',
    formula: '\\text{More Days} = \\frac{\\text{Total Budget}}{\\text{New Rate}} - 21',
    type: 'MCQ',
    options: ['3 more days', '24 more days', '7 more days', '4 more days'],
    answer: '3 more days',
    hint: 'New rate = 24 - 3 = 21 per day. Budget = 21 * 24 = $504.',
    steps: [
      '**Step 1: Calculate total budget**',
      '$$\\text{Total Budget} = 21 \\text{ days} \\times 24 = \\$504$$',
      '**Step 2: Calculate new daily expenditure rate**',
      '$$\\text{New Rate} = 24 - 3 = \\$21\\text{ per day}$$',
      '**Step 3: Calculate new duration and extra days**',
      '$$\\text{New Duration} = \\frac{504}{21} = 24\\text{ days} \\implies 24 - 21 = 3\\text{ more days}$$',
      '**Final Verified Answer:** 3 more days'
    ],
    difficulty: 3
  },

  // --- Form 9 Topic 158: Direct & Inverse Variation ---
  {
    topic_id: 158,
    title: 'Inverse Variation with Square Root 1(a)',
    text: 'Given that \\(y\\) is inversely proportional to the square root of \\((x + 2)\\) and \\(y = 3\\) when \\(x = -1\\). Express \\(y\\) in terms of \\(x\\).',
    formula: 'y = \\frac{k}{\\sqrt{x+2}}',
    type: 'MCQ',
    options: ['y = \\frac{3}{\\sqrt{x+2}}', 'y = \\frac{9}{\\sqrt{x+2}}', 'y = 3\\sqrt{x+2}', 'y = \\frac{1}{3\\sqrt{x+2}}'],
    answer: 'y = \\frac{3}{\\sqrt{x+2}}',
    hint: 'Substitute x = -1 and y = 3 to solve for constant k.',
    steps: [
      '**Step 1: Write variation equation**',
      '$$y = \\frac{k}{\\sqrt{x+2}}$$',
      '**Step 2: Solve for constant k**',
      '$$3 = \\frac{k}{\\sqrt{-1+2}} = \\frac{k}{\\sqrt{1}} \\implies k = 3$$',
      '**Final Verified Answer:** \\(y = \\frac{3}{\\sqrt{x+2}}\\)'
    ],
    difficulty: 3
  },
  {
    topic_id: 158,
    title: 'Inverse Variation with Square Root 1(b)',
    text: 'Given \\(y = \\frac{3}{\\sqrt{x+2}}\\), find the value of \\(y\\) when \\(x = 7\\).',
    formula: 'y = \\frac{3}{\\sqrt{7+2}}',
    type: 'MCQ',
    options: ['1', '3', '1/3', '9'],
    answer: '1',
    hint: 'Substitute x = 7 into equation.',
    steps: [
      '**Step 1: Substitute x = 7**',
      '$$y = \\frac{3}{\\sqrt{7+2}} = \\frac{3}{\\sqrt{9}}$$',
      '**Step 2: Simplify**',
      '$$y = \\frac{3}{3} = 1$$',
      '**Final Verified Answer:** 1'
    ],
    difficulty: 2
  },
  {
    topic_id: 158,
    title: 'Direct Variation with Cube Root 2(a)',
    text: 'Given that \\(y\\) is directly proportional to the cube root of \\(x\\) and \\(y = 1\\frac{1}{2}\\) when \\(x = 8\\). Express \\(y\\) in terms of \\(x\\).',
    formula: 'y = k \\sqrt[3]{x}',
    type: 'MCQ',
    options: ['y = \\frac{3}{4}\\sqrt[3]{x}', 'y = \\frac{3}{2}\\sqrt[3]{x}', 'y = \\frac{4}{3}\\sqrt[3]{x}', 'y = 3\\sqrt[3]{x}'],
    answer: 'y = \\frac{3}{4}\\sqrt[3]{x}',
    hint: 'Cube root of 8 is 2.',
    steps: [
      '**Step 1: Write direct variation equation**',
      '$$y = k \\sqrt[3]{x}$$',
      '**Step 2: Substitute x = 8 and y = 3/2**',
      '$$\\frac{3}{2} = k \\sqrt[3]{8} = 2k \\implies k = \\frac{3}{4}$$',
      '**Final Verified Answer:** \\(y = \\frac{3}{4}\\sqrt[3]{x}\\)'
    ],
    difficulty: 3
  },
  {
    topic_id: 158,
    title: 'Direct Variation with Cube Root 2(b)(i)',
    text: 'Given \\(y = \\frac{3}{4}\\sqrt[3]{x}\\), find the value of \\(y\\) when \\(x = -64\\).',
    formula: 'y = \\frac{3}{4}\\sqrt[3]{-64}',
    type: 'MCQ',
    options: ['-3', '3', '-12', '-4'],
    answer: '-3',
    hint: 'Cube root of -64 is -4.',
    steps: [
      '**Step 1: Calculate cube root**',
      '$$\\sqrt[3]{-64} = -4$$',
      '**Step 2: Multiply by 3/4**',
      '$$y = \\frac{3}{4}(-4) = -3$$',
      '**Final Verified Answer:** -3'
    ],
    difficulty: 2
  },
  {
    topic_id: 158,
    title: 'Direct Variation with Cube Root 2(b)(ii)',
    text: 'Given \\(y = \\frac{3}{4}\\sqrt[3]{x}\\), find the value of \\(x\\) when \\(y = 6\\).',
    formula: '6 = \\frac{3}{4}\\sqrt[3]{x}',
    type: 'MCQ',
    options: ['512', '64', '216', '128'],
    answer: '512',
    hint: 'Solve for cube root of x = 8, then cube 8.',
    steps: [
      '**Step 1: Isolate cube root**',
      '$$\\sqrt[3]{x} = 6 \\cdot \\frac{4}{3} = 8$$',
      '**Step 2: Cube both sides**',
      '$$x = 8^3 = 512$$',
      '**Final Verified Answer:** 512'
    ],
    difficulty: 3
  },
  {
    topic_id: 158,
    title: 'Direct Polynomial Variation 3(i)',
    text: 'Given that \\(y\\) is directly proportional to \\((x^3 + 1)\\) and \\(y = 18\\) when \\(x = 2\\). Express \\(y\\) in terms of \\(x\\).',
    formula: 'y = k(x^3 + 1)',
    type: 'MCQ',
    options: ['y = 2(x^3 + 1)', 'y = 9(x^3 + 1)', 'y = 3(x^3 + 1)', 'y = \\frac{1}{2}(x^3 + 1)'],
    answer: '2(x^3 + 1)',
    hint: 'Substitute x = 2: 2^3 + 1 = 9.',
    steps: [
      '**Step 1: Write variation formula**',
      '$$y = k(x^3 + 1)$$',
      '**Step 2: Solve for constant k**',
      '$$18 = k(2^3 + 1) = 9k \\implies k = 2$$',
      '**Final Verified Answer:** \\(y = 2(x^3 + 1)\\)'
    ],
    difficulty: 3
  },
  {
    topic_id: 158,
    title: 'Direct Polynomial Variation 3(ii)',
    text: 'Given \\(y = 2(x^3 + 1)\\), find the value of \\(y\\) when \\(x = 3\\).',
    formula: 'y = 2(3^3 + 1)',
    type: 'MCQ',
    options: ['56', '54', '28', '81'],
    answer: '56',
    hint: '3^3 = 27, 27 + 1 = 28.',
    steps: [
      '**Step 1: Calculate inner expression**',
      '$$x^3 + 1 = 27 + 1 = 28$$',
      '**Step 2: Multiply by 2**',
      '$$y = 2(28) = 56$$',
      '**Final Verified Answer:** 56'
    ],
    difficulty: 2
  },
  {
    topic_id: 158,
    title: 'Direct Polynomial Variation 3(iii)',
    text: 'Given \\(y = 2(x^3 + 1)\\), find the value of \\(x\\) when \\(y = 2\\frac{1}{4}\\).',
    formula: '\\frac{9}{4} = 2(x^3 + 1)',
    type: 'MCQ',
    options: ['1/2', '1/4', '1/8', '2'],
    answer: '1/2',
    hint: 'x^3 + 1 = 9/8, so x^3 = 1/8.',
    steps: [
      '**Step 1: Convert fraction and divide by 2**',
      '$$x^3 + 1 = \\frac{9}{4} \\div 2 = \\frac{9}{8}$$',
      '**Step 2: Subtract 1**',
      '$$x^3 = \\frac{9}{8} - 1 = \\frac{1}{8}$$',
      '**Step 3: Take cube root**',
      '$$x = \\sqrt[3]{\\frac{1}{8}} = \\frac{1}{2}$$',
      '**Final Verified Answer:** 1/2'
    ],
    difficulty: 3
  },
  {
    topic_id: 158,
    title: 'Inverse Square Root Variation 7(i)',
    text: 'Given that \\(y\\) is inversely proportional to \\(\\sqrt{x - 3}\\) and \\(y = \\frac{1}{4}\\) when \\(x = 12\\). Find \\(x\\) when \\(y = 3\\).',
    formula: 'y = \\frac{3}{4\\sqrt{x - 3}}',
    type: 'MCQ',
    options: ['3.0625', '4.25', '5.125', '3.25'],
    answer: '3.0625',
    hint: 'Equation is y = 3 / (4 sqrt(x - 3)). Solve 3 = 3 / (4 sqrt(x - 3)).',
    steps: [
      '**Step 1: Determine variation equation**',
      '$$\\frac{1}{4} = \\frac{k}{\\sqrt{12-3}} = \\frac{k}{3} \\implies k = \\frac{3}{4}$$',
      '**Step 2: Substitute y = 3**',
      '$$3 = \\frac{3}{4\\sqrt{x-3}} \\implies 4\\sqrt{x-3} = 1 \\implies \\sqrt{x-3} = \\frac{1}{4}$$',
      '**Step 3: Square both sides and solve for x**',
      '$$x - 3 = \\frac{1}{16} = 0.0625 \\implies x = 3.0625$$',
      '**Final Verified Answer:** 3.0625'
    ],
    difficulty: 4
  },
  {
    topic_id: 158,
    title: 'Inverse Square Root Variation 7(ii)',
    text: 'Given \\(y = \\frac{3}{4\\sqrt{x - 3}}\\), find the percentage decrease in \\(y\\) when \\(x\\) increases from 12 to 28.',
    formula: '\\text{Decrease\\%} = \\frac{y_1 - y_2}{y_1} \\times 100\\%',
    type: 'MCQ',
    options: ['40%', '30%', '25%', '50%'],
    answer: '40%',
    hint: 'Calculate y at x=12 (0.25) and y at x=28 (0.15).',
    steps: [
      '**Step 1: Calculate initial value y1 at x = 12**',
      '$$y_1 = \\frac{3}{4\\sqrt{9}} = \\frac{1}{4} = 0.25$$',
      '**Step 2: Calculate new value y2 at x = 28**',
      '$$y_2 = \\frac{3}{4\\sqrt{28-3}} = \\frac{3}{4(5)} = \\frac{3}{20} = 0.15$$',
      '**Step 3: Calculate percentage decrease**',
      '$$\\text{Decrease} = \\frac{0.25 - 0.15}{0.25} \\times 100\\% = \\frac{0.10}{0.25} \\times 100\\% = 40\\%$$',
      '**Final Verified Answer:** 40%'
    ],
    difficulty: 4
  },
  {
    topic_id: 158,
    title: 'Joint Variation Table Completion 8',
    text: 'Given that \\(a\\) is directly proportional to \\(b\\) and inversely proportional to \\(c^2\\) such that \\(a = \\frac{kb}{c^2}\\). Given \\(a = 3, b = 1, c = 2\\), find \\(b\\) when \\(a = 4, c = -2\\), and find \\(c\\) when \\(a = -1, b = -3\\).',
    formula: 'a = \\frac{12b}{c^2}',
    type: 'MCQ',
    options: [
      'b = 4/3 and c = ±6',
      'b = 2/3 and c = ±3',
      'b = 3/4 and c = ±12',
      'b = 3 and c = ±4'
    ],
    answer: 'b = 4/3 and c = ±6',
    hint: 'First find k = 12, then solve for missing table values.',
    steps: [
      '**Step 1: Find constant k**',
      '$$3 = \\frac{k(1)}{2^2} \\implies k = 12 \\implies a = \\frac{12b}{c^2}$$',
      '**Step 2: Find b when a = 4, c = -2**',
      '$$4 = \\frac{12b}{(-2)^2} = \\frac{12b}{4} = 3b \\implies b = \\frac{4}{3}$$',
      '**Step 3: Find c when a = -1, b = -3**',
      '$$-1 = \\frac{12(-3)}{c^2} = \\frac{-36}{c^2} \\implies c^2 = 36 \\implies c = \\pm 6$$',
      '**Final Verified Answer:** b = 4/3 and c = ±6'
    ],
    difficulty: 4
  },
  {
    topic_id: 158,
    title: 'Inverse Square Binomial Variation 9(a)',
    text: 'Given that \\(y\\) varies inversely as the square of \\((2x + 1)\\) and \\(y = 3\\) when \\(x = 2\\). Form an equation connecting \\(x\\) and \\(y\\).',
    formula: 'y = \\frac{k}{(2x+1)^2}',
    type: 'MCQ',
    options: ['y = \\frac{75}{(2x+1)^2}', 'y = \\frac{25}{(2x+1)^2}', 'y = 75(2x+1)^2', 'y = \\frac{15}{(2x+1)^2}'],
    answer: 'y = \\frac{75}{(2x+1)^2}',
    hint: 'Substitute x = 2 to get (2*2+1)^2 = 25.',
    steps: [
      '**Step 1: Write variation equation**',
      '$$y = \\frac{k}{(2x+1)^2}$$',
      '**Step 2: Solve for k**',
      '$$3 = \\frac{k}{(2(2)+1)^2} = \\frac{k}{25} \\implies k = 75$$',
      '**Final Verified Answer:** \\(y = \\frac{75}{(2x+1)^2}\\)'
    ],
    difficulty: 3
  },
  {
    topic_id: 158,
    title: 'Inverse Square Binomial Variation 9(b)',
    text: 'Given \\(y = \\frac{75}{(2x+1)^2}\\), find the values of \\(x\\) when \\(y = 48\\).',
    formula: '48 = \\frac{75}{(2x+1)^2}',
    type: 'MCQ',
    options: ['x = 1/8 or x = -9/8', 'x = 1/4 or x = -5/4', 'x = 1/2 or x = -3/2', 'x = 5/8 or x = -7/8'],
    answer: 'x = 1/8 or x = -9/8',
    hint: '(2x+1)^2 = 75/48 = 25/16. Take square roots ±5/4.',
    steps: [
      '**Step 1: Isolate squared term**',
      '$$(2x+1)^2 = \\frac{75}{48} = \\frac{25}{16}$$',
      '**Step 2: Take square root**',
      '$$2x + 1 = \\pm \\frac{5}{4}$$',
      '**Step 3: Solve linear equations**',
      '$$2x = \\frac{5}{4} - 1 = \\frac{1}{4} \\implies x = \\frac{1}{8}$$, or $$2x = -\\frac{5}{4} - 1 = -\\frac{9}{4} \\implies x = -\\frac{9}{8}$$',
      '**Final Verified Answer:** x = 1/8 or x = -9/8'
    ],
    difficulty: 4
  }
];

const insertStmt = db.prepare(`
  INSERT INTO questions (
    topic_id, question_title, question_text, math_formula, question_type,
    options_json, correct_answer, hint, working_steps_json, image_url, image_alt, difficulty, created_by
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, '', '', ?, 'pdf_import_identities_proportion')
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
