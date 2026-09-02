import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { exportQuestionsToExcel } from '../server/excelService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '..', 'server', 'qbank.db');
const db = new Database(dbPath);

console.log('Inserting Congruence, Similarity & Trigonometric Ratios PDF questions into QBank...');

const pdfQuestions = [
  // =========================================================================
  // PART 1: Congruence and Similarity.pdf (Form 9 - Topics 148 & 150)
  // =========================================================================
  {
    topic_id: 150,
    title: 'Similar Triangles & Parallel Lines Q5',
    text: 'In the diagram, \\(\\triangle ABC\\) is similar to \\(\\triangle AQP\\). Given that \\(BC \\parallel PQ\\), \\(BC = 4\\text{ cm}\\), \\(AC = 2\\text{ cm}\\), \\(AP = 5\\text{ cm}\\) and \\(AQ = 7.5\\text{ cm}\\), find the length of \\(AB\\).',
    formula: '\\frac{AB}{AQ} = \\frac{AC}{AP}',
    type: 'MCQ',
    options: ['3 cm', '4.5 cm', '2.5 cm', '3.6 cm'],
    answer: '3 cm',
    hint: 'Set up side ratio equation using triangle similarity: AB / AQ = AC / AP.',
    steps: [
      '**Step 1: Write similarity proportion**',
      '$$\\frac{AB}{AQ} = \\frac{AC}{AP}$$',
      '**Step 2: Substitute given lengths**',
      '$$\\frac{AB}{7.5} = \\frac{2}{5} = 0.4$$',
      '**Step 3: Solve for AB**',
      '$$AB = 7.5 \\times 0.4 = 3\\text{ cm}$$',
      '**Final Verified Answer:** 3 cm'
    ],
    difficulty: 3
  },
  {
    topic_id: 150,
    title: 'Enlargement Scale Factor Q6(a)',
    text: 'Rectangle \\(P\\) (width \\(12.6\\text{ cm}\\), height \\(h\\text{ cm}\\)) is mapped onto rectangle \\(Q\\) (width \\(4.2\\text{ cm}\\)) by an enlargement. Find the scale factor of the enlargement.',
    formula: 'k = \\frac{\\text{Width of } Q}{\\text{Width of } P}',
    type: 'MCQ',
    options: ['1/3', '3', '1/2', '2.5'],
    answer: '1/3',
    hint: 'Scale factor k = width_Q / width_P.',
    steps: [
      '**Step 1: Calculate linear scale factor k**',
      '$$k = \\frac{4.2}{12.6} = \\frac{1}{3}$$',
      '**Final Verified Answer:** 1/3'
    ],
    difficulty: 2
  },
  {
    topic_id: 150,
    title: 'Rectangle Enlargement & Perimeter Q6(b)',
    text: 'Rectangle \\(P\\) is mapped onto rectangle \\(Q\\) by an enlargement with scale factor \\(1/3\\). Given that the perimeter of rectangle \\(Q\\) is \\(11.2\\text{ cm}\\) and its width is \\(4.2\\text{ cm}\\), calculate the value of \\(h\\) (height of rectangle \\(P\\)).',
    formula: 'h = 3 \\times \\text{height}_Q',
    type: 'MCQ',
    options: ['4.2 cm', '3.8 cm', '5.6 cm', '2.8 cm'],
    answer: '4.2 cm',
    hint: 'First find height of Q from perimeter formula 2(4.2 + height_Q) = 11.2, then multiply by 3.',
    steps: [
      '**Step 1: Find height of rectangle Q**',
      '$$\\text{Perimeter}_Q = 2(4.2 + \\text{height}_Q) = 11.2 \\implies 4.2 + \\text{height}_Q = 5.6 \\implies \\text{height}_Q = 1.4\\text{ cm}$$',
      '**Step 2: Scale up to find height h of rectangle P**',
      '$$h = 3 \\times 1.4 = 4.2\\text{ cm}$$',
      '**Final Verified Answer:** 4.2 cm'
    ],
    difficulty: 3
  },
  {
    topic_id: 148,
    title: 'Congruent Triangles Angle & Side Q7',
    text: 'In the diagram, triangle \\(ABC\\) and triangle \\(EDC\\) are congruent (\\(\\triangle ABC \\cong \\triangle EDC\\)). Given hypotenuse \\(AB = ED = 10\\text{ cm}\\), base leg \\(AC = 8\\text{ cm}\\), and angle \\(\\angle BAC = 37^\\circ\\), find the value of \\(x\\) (angle \\(\\angle EDC\\)) and of \\(y\\) (side \\(CD\\)).',
    formula: 'y = \\sqrt{10^2 - 8^2}, \\quad x = 90^\\circ - 37^\\circ',
    type: 'MCQ',
    options: [
      'x = 53°, y = 6 cm',
      'x = 37°, y = 8 cm',
      'x = 53°, y = 8 cm',
      'x = 37°, y = 6 cm'
    ],
    answer: 'x = 53°, y = 6 cm',
    hint: 'Use Pythagorean theorem to find side BC = y = 6 cm, and angle sum in right triangle for x.',
    steps: [
      '**Step 1: Calculate leg length BC in right triangle ABC**',
      '$$BC = \\sqrt{10^2 - 8^2} = \\sqrt{36} = 6\\text{ cm}$$',
      '**Step 2: By triangle congruence \\(\\triangle ABC \\cong \\triangle EDC\\)**',
      '$$y = CD = BC = 6\\text{ cm}$$',
      '**Step 3: Calculate angle \\(x = \\angle EDC\\)**',
      '$$x = \\angle ABC = 90^\\circ - 37^\\circ = 53^\\circ$$',
      '**Final Verified Answer:** x = 53°, y = 6 cm'
    ],
    difficulty: 3
  },
  {
    topic_id: 150,
    title: 'Map Scale Representation Q8(a)',
    text: 'The scale of a map is \\(2\\text{ cm} : 1\\text{ km}\\). Write this scale in the form \\(1 : n\\).',
    formula: '1\\text{ km} = 100,000\\text{ cm}',
    type: 'MCQ',
    options: ['1 : 50,000', '1 : 500', '1 : 5,000', '1 : 20,000'],
    answer: '1 : 50,000',
    hint: 'Convert 1 km to 100,000 cm first.',
    steps: [
      '**Step 1: Convert units to cm**',
      '$$2\\text{ cm} : 1\\text{ km} = 2\\text{ cm} : 100,000\\text{ cm}$$',
      '**Step 2: Divide both sides by 2**',
      '$$1 : 50,000$$',
      '**Final Verified Answer:** 1 : 50,000'
    ],
    difficulty: 2
  },
  {
    topic_id: 150,
    title: 'Map Area Scale Calculation Q8(b)',
    text: 'Given a map scale of \\(2\\text{ cm} : 1\\text{ km}\\), find the actual area in \\(\\text{km}^2\\) represented by an area of \\(10\\text{ cm}^2\\) on the map.',
    formula: '1\\text{ cm}^2 = 0.25\\text{ km}^2',
    type: 'MCQ',
    options: ['2.5 km²', '5 km²', '20 km²', '1.25 km²'],
    answer: '2.5 km²',
    hint: 'Linear scale 1 cm = 0.5 km implies area scale 1 cm^2 = 0.25 km^2.',
    steps: [
      '**Step 1: Square the linear scale**',
      '$$1\\text{ cm} = 0.5\\text{ km} \\implies 1\\text{ cm}^2 = (0.5)^2 = 0.25\\text{ km}^2$$',
      '**Step 2: Multiply map area by area factor**',
      '$$\\text{Actual Area} = 10 \\times 0.25 = 2.5\\text{ km}^2$$',
      '**Final Verified Answer:** 2.5 km²'
    ],
    difficulty: 3
  },
  {
    topic_id: 150,
    title: 'Intersecting Similar Triangles Q14',
    text: 'In the diagram, \\(\\triangle PQT\\) is similar to \\(\\triangle SRT\\). Given that \\(\\frac{PT}{ST} = \\frac{2}{3}\\) and total length \\(RQ = 15\\text{ cm}\\), calculate the length of \\(QT\\).',
    formula: '\\frac{QT}{RT} = \\frac{2}{3}',
    type: 'MCQ',
    options: ['6 cm', '9 cm', '5 cm', '7.5 cm'],
    answer: '6 cm',
    hint: 'Ratio QT : RT = 2 : 3 on line segment RQ = 15 cm.',
    steps: [
      '**Step 1: Express QT and RT in terms of ratio x**',
      '$$QT = 2x, \\quad RT = 3x$$',
      '**Step 2: Equate sum to total length RQ**',
      '$$2x + 3x = 15 \\implies 5x = 15 \\implies x = 3\\text{ cm}$$',
      '**Step 3: Calculate QT**',
      '$$QT = 2(3) = 6\\text{ cm}$$',
      '**Final Verified Answer:** 6 cm'
    ],
    difficulty: 3
  },
  {
    topic_id: 148,
    title: 'Congruent Triangles Angle & Segment Sum Q15',
    text: 'In the diagram, \\(\\triangle PQR \\equiv \\triangle STR\\) (congruent triangles). Given \\(\\angle PRQ = 68^\\circ\\), \\(\\angle RST = 76^\\circ\\), \\(PR = 2.4\\text{ cm}\\) and \\(RT = 4.5\\text{ cm}\\). Find \\(\\angle PQR\\) and the length of segment \\(QS\\).',
    formula: '\\angle PQR = \\angle STR, \\quad QS = QR + RS',
    type: 'MCQ',
    options: [
      '∠PQR = 36°, QS = 6.9 cm',
      '∠PQR = 68°, QS = 6.9 cm',
      '∠PQR = 36°, QS = 4.5 cm',
      '∠PQR = 42°, QS = 6.9 cm'
    ],
    answer: '∠PQR = 36°, QS = 6.9 cm',
    hint: 'Vertically opposite angle angle_SRT = 68°. Find angle_STR = 180 - 76 - 68 = 36°. By congruence, QR = RT = 4.5 cm and RS = RP = 2.4 cm.',
    steps: [
      '**Step 1: Calculate angle STR in triangle STR**',
      '$$\\angle SRT = 68^\\circ \\implies \\angle STR = 180^\\circ - 76^\\circ - 68^\\circ = 36^\\circ$$',
      '**Step 2: By congruence \\(\\triangle PQR \\equiv \\triangle STR\\)**',
      '$$\\angle PQR = \\angle STR = 36^\\circ$$',
      '**Step 3: Calculate length of QS = QR + RS**',
      '$$QR = RT = 4.5\\text{ cm}, \\quad RS = RP = 2.4\\text{ cm} \\implies QS = 4.5 + 2.4 = 6.9\\text{ cm}$$',
      '**Final Verified Answer:** ∠PQR = 36°, QS = 6.9 cm'
    ],
    difficulty: 3
  },
  {
    topic_id: 150,
    title: 'Vertical Poles & Similar Triangles Incline Q16',
    text: 'Three vertical poles of different lengths are arranged as shown in the diagram. Height of middle pole is \\(8\\text{ m}\\), height of smallest pole is \\(3\\text{ m}\\), and horizontal gap distances are \\(9\\text{ m}\\) and \\(5\\text{ m}\\). Find the height of the tallest pole.',
    formula: 'H = 8 + 9 \\times \\left(\\frac{8 - 3}{5}\\right)',
    type: 'MCQ',
    options: ['17 m', '15 m', '18 m', '14 m'],
    answer: '17 m',
    hint: 'Calculate slope = (8 - 3)/5 = 1, then height difference H - 8 = 9 * 1 = 9 m.',
    steps: [
      '**Step 1: Calculate slope of the alignment line**',
      '$$\\text{Slope} = \\frac{8 - 3}{5} = 1$$',
      '**Step 2: Calculate height difference for 9 m gap**',
      '$$\\Delta H = 9 \\times 1 = 9\\text{ m}$$',
      '**Step 3: Calculate total height of tallest pole**',
      '$$H = 8 + 9 = 17\\text{ m}$$',
      '**Final Verified Answer:** 17 m'
    ],
    difficulty: 3
  },
  {
    topic_id: 150,
    title: 'Similar Triangles Side Calculation Q20',
    text: 'In the diagram, \\(\\triangle ABC\\) and \\(\\triangle DEF\\) are similar (\\(\\triangle ABC \\sim \\triangle DEF\\)). Dimensions of \\(\\triangle ABC\\): \\(AB = 3.8\\text{ m}\\), \\(BC = 4.8\\text{ m}\\), \\(AC = 6\\text{ m}\\). Dimensions of \\(\\triangle DEF\\): \\(DF = 9\\text{ m}\\), \\(EF = x\\text{ m}\\). Calculate the value of \\(x\\).',
    formula: '\\frac{x}{4.8} = \\frac{9}{6}',
    type: 'MCQ',
    options: ['7.2 m', '5.7 m', '6.4 m', '8.1 m'],
    answer: '7.2 m',
    hint: 'Set up side ratio x / 4.8 = 9 / 6.',
    steps: [
      '**Step 1: Write side ratio from triangle similarity**',
      '$$\\frac{EF}{BC} = \\frac{DF}{AC} \\implies \\frac{x}{4.8} = \\frac{9}{6} = 1.5$$',
      '**Step 2: Solve for x**',
      '$$x = 4.8 \\times 1.5 = 7.2\\text{ m}$$',
      '**Final Verified Answer:** 7.2 m'
    ],
    difficulty: 2
  },
  {
    topic_id: 150,
    title: 'Triangle Similarity Test - Angle Angle Q21(a)',
    text: 'Are triangles \\(PQR\\) (angles \\(34^\\circ\\), \\(85^\\circ\\)) and \\(YXZ\\) (angles \\(61^\\circ\\), \\(85^\\circ\\)) similar? Explain your answer.',
    formula: '\\text{Sum of angles in } \\triangle = 180^\\circ',
    type: 'MCQ',
    options: [
      'Yes, similar by AA criterion (angles 34°, 61°, 85°)',
      'No, angles do not match',
      'Yes, similar by SSS criterion',
      'No, sides are not proportional'
    ],
    answer: 'Yes, similar by AA criterion (angles 34°, 61°, 85°)',
    hint: 'Find third angle of each triangle: 180 - 34 - 85 = 61°.',
    steps: [
      '**Step 1: Calculate third angle for \\(\\triangle PQR\\)**',
      '$$\\angle Q = 180^\\circ - 34^\\circ - 85^\\circ = 61^\\circ$$',
      '**Step 2: Calculate third angle for \\(\\triangle YXZ\\)**',
      '$$\\angle Y = 180^\\circ - 61^\\circ - 85^\\circ = 34^\\circ$$',
      '**Step 3: Compare interior angles**',
      'Both triangles have angles \\(34^\\circ, 61^\\circ, 85^\\circ\\), so they are similar by AA criterion.',
      '**Final Verified Answer:** Yes, similar by AA criterion (angles 34°, 61°, 85°)'
    ],
    difficulty: 2
  },
  {
    topic_id: 150,
    title: 'Triangle Similarity Test - Side Ratios Q21(b)',
    text: 'Are triangles \\(ABC\\) (sides \\(2, 4.5, 5\\text{ cm}\\)) and \\(DEF\\) (sides \\(4, 9, 12.5\\text{ cm}\\)) similar? Explain your answer.',
    formula: '\\frac{4}{2} = 2, \\quad \\frac{9}{4.5} = 2, \\quad \\frac{12.5}{5} = 2.5',
    type: 'MCQ',
    options: [
      'No, side ratios are not all equal (2 = 2 ≠ 2.5)',
      'Yes, similar by SSS criterion',
      'Yes, side ratio is 2 for all sides',
      'No, angles are unknown'
    ],
    answer: 'No, side ratios are not all equal (2 = 2 ≠ 2.5)',
    hint: 'Calculate side ratios: 4/2 = 2, 9/4.5 = 2, 12.5/5 = 2.5.',
    steps: [
      '**Step 1: Calculate side ratios**',
      '$$\\frac{DE}{AB} = \\frac{4}{2} = 2, \\quad \\frac{DF}{AC} = \\frac{9}{4.5} = 2, \\quad \\frac{EF}{BC} = \\frac{12.5}{5} = 2.5$$',
      '**Step 2: Conclusion**',
      'Since \\(2 = 2 \\neq 2.5\\), side ratios are not all equal, so the triangles are not similar.',
      '**Final Verified Answer:** No, side ratios are not all equal (2 = 2 ≠ 2.5)'
    ],
    difficulty: 2
  },

  // =========================================================================
  // PART 2: Trigonometric Ratios.pdf (Form 9 - Topic 153)
  // =========================================================================
  {
    topic_id: 153,
    title: 'Right Triangle Tangent Ratio Q1(a)',
    text: 'Find the value of angle \\(x^\\circ\\) in a right-angled triangle with adjacent side \\(3\\text{ cm}\\) and opposite side \\(8\\text{ cm}\\).',
    formula: '\\tan x^\\circ = \\frac{8}{3}',
    type: 'MCQ',
    options: ['69.4°', '20.6°', '62.5°', '58.1°'],
    answer: '69.4°',
    hint: 'Use tan(x) = opposite / adjacent = 8/3.',
    steps: [
      '**Step 1: Apply tangent ratio formula**',
      '$$\\tan x^\\circ = \\frac{8}{3} \\approx 2.6667$$',
      '**Step 2: Calculate inverse tangent**',
      '$$x = \\tan^{-1}(2.6667) \\approx 69.44^\\circ$$',
      '**Final Verified Answer:** 69.4°'
    ],
    difficulty: 2
  },
  {
    topic_id: 153,
    title: 'Right Triangle Sine & Cosine Ratios Q1(b)',
    text: 'In right triangle \\(\\triangle XYZ\\) with hypotenuse \\(YZ = 20\\text{ cm}\\) and angle \\(\\angle Y = 60^\\circ\\), find perpendicular side \\(XZ = m\\) and adjacent side \\(YX = n\\).',
    formula: 'm = 20 \\sin 60^\\circ, \\quad n = 20 \\cos 60^\\circ',
    type: 'MCQ',
    options: [
      'm = 17.32 cm, n = 10 cm',
      'm = 10 cm, n = 17.32 cm',
      'm = 15 cm, n = 10 cm',
      'm = 17.32 cm, n = 12 cm'
    ],
    answer: 'm = 17.32 cm, n = 10 cm',
    hint: 'sin(60°) = sqrt(3)/2 ≈ 0.866, cos(60°) = 0.5.',
    steps: [
      '**Step 1: Calculate perpendicular side m**',
      '$$m = 20 \\times \\sin 60^\\circ = 20 \\times 0.8660 = 17.32\\text{ cm}$$',
      '**Step 2: Calculate adjacent side n**',
      '$$n = 20 \\times \\cos 60^\\circ = 20 \\times 0.5 = 10\\text{ cm}$$',
      '**Final Verified Answer:** m = 17.32 cm, n = 10 cm'
    ],
    difficulty: 2
  },
  {
    topic_id: 153,
    title: 'Split Right Triangle Height & Angle Q1(c)',
    text: 'A right-angled triangle is split by height \\(h\\). The right segment has base \\(12\\text{ cm}\\) and base angle \\(25^\\circ\\); the left segment has base \\(10\\text{ cm}\\) and angle \\(a^\\circ\\). Find height \\(h\\) and angle \\(a^\\circ\\).',
    formula: 'h = 12 \\tan 25^\\circ, \\quad \\tan a^\\circ = \\frac{h}{10}',
    type: 'MCQ',
    options: [
      'h = 5.60 cm, a = 29.2°',
      'h = 5.10 cm, a = 32.5°',
      'h = 6.20 cm, a = 25.0°',
      'h = 5.60 cm, a = 34.1°'
    ],
    answer: 'h = 5.60 cm, a = 29.2°',
    hint: 'tan(25°) ≈ 0.4663, so h = 12 * 0.4663 = 5.60 cm.',
    steps: [
      '**Step 1: Calculate height h from right triangle**',
      '$$h = 12 \\times \\tan 25^\\circ = 12 \\times 0.4663 = 5.596 \\approx 5.60\\text{ cm}$$',
      '**Step 2: Calculate angle a from left triangle**',
      '$$\\tan a^\\circ = \\frac{5.596}{10} = 0.5596 \\implies a = \\tan^{-1}(0.5596) \\approx 29.23^\\circ$$',
      '**Final Verified Answer:** h = 5.60 cm, a = 29.2°'
    ],
    difficulty: 3
  },
  {
    topic_id: 153,
    title: 'Double Right Triangle Height & Base Q1(d)',
    text: 'In a double right triangle with total base \\(55\\text{ cm}\\), inner base angle \\(50^\\circ\\), and outer base angle \\(30^\\circ\\), find vertical height \\(q\\) and base segment \\(p\\).',
    formula: 'q = 55 \\tan 30^\\circ, \\quad 55 - p = \\frac{q}{\\tan 50^\\circ}',
    type: 'MCQ',
    options: [
      'q = 31.75 cm, p = 28.36 cm',
      'q = 35.00 cm, p = 25.00 cm',
      'q = 28.50 cm, p = 30.20 cm',
      'q = 31.75 cm, p = 20.15 cm'
    ],
    answer: 'q = 31.75 cm, p = 28.36 cm',
    hint: 'q = 55 * tan(30°) = 31.75 cm, inner base = 31.75 / tan(50°) = 26.64 cm, p = 55 - 26.64 = 28.36 cm.',
    steps: [
      '**Step 1: Calculate height q using outer triangle**',
      '$$q = 55 \\times \\tan 30^\\circ = 55 \\times 0.5774 = 31.75\\text{ cm}$$',
      '**Step 2: Calculate inner base segment**',
      '$$\\text{Inner Base} = \\frac{31.75}{\\tan 50^\\circ} = \\frac{31.75}{1.1918} = 26.64\\text{ cm}$$',
      '**Step 3: Calculate base segment p**',
      '$$p = 55 - 26.64 = 28.36\\text{ cm}$$',
      '**Final Verified Answer:** q = 31.75 cm, p = 28.36 cm'
    ],
    difficulty: 4
  },
  {
    topic_id: 153,
    title: 'Right Triangle Leg & Angle Difference Q2',
    text: 'Right-angled triangle \\(\\triangle PQR\\) has \\(\\angle PRQ = 90^\\circ\\), \\(QR = 12\\text{ cm}\\), \\(PQ = 15\\text{ cm}\\), and point \\(S\\) on leg \\(PR\\) with \\(RS = 5\\text{ cm}\\). Find length \\(PS\\) and angle \\(\\angle PQS\\).',
    formula: 'PS = \\sqrt{15^2 - 12^2} - 5, \\quad \\angle PQS = \\tan^{-1}\\left(\\frac{9}{12}\\right) - \\tan^{-1}\\left(\\frac{5}{12}\\right)',
    type: 'MCQ',
    options: [
      'PS = 4 cm, ∠PQS = 14.3°',
      'PS = 5 cm, ∠PQS = 18.5°',
      'PS = 4 cm, ∠PQS = 22.6°',
      'PS = 3 cm, ∠PQS = 12.1°'
    ],
    answer: 'PS = 4 cm, ∠PQS = 14.3°',
    hint: 'PR = sqrt(225 - 144) = 9 cm, PS = 9 - 5 = 4 cm. angle_PQR = 36.87°, angle_SQR = 22.62°, difference = 14.25°.',
    steps: [
      '**Step 1: Calculate leg PR using Pythagorean theorem**',
      '$$PR = \\sqrt{15^2 - 12^2} = \\sqrt{81} = 9\\text{ cm} \\implies PS = 9 - 5 = 4\\text{ cm}$$',
      '**Step 2: Calculate angle PQR and angle SQR**',
      '$$\\angle PQR = \\tan^{-1}\\left(\\frac{9}{12}\\right) = 36.87^\\circ$$',
      '$$\\angle SQR = \\tan^{-1}\\left(\\frac{5}{12}\\right) = 22.62^\\circ$$',
      '**Step 3: Subtract angles to find angle PQS**',
      '$$\\angle PQS = 36.87^\\circ - 22.62^\\circ = 14.25^\\circ \\approx 14.3^\\circ$$',
      '**Final Verified Answer:** PS = 4 cm, ∠PQS = 14.3°'
    ],
    difficulty: 3
  },
  {
    topic_id: 153,
    title: 'Trigonometric Calculator Evaluations Q3',
    text: 'Evaluate: (a) \\(\\tan 63.4^\\circ + \\cos 60^\\circ\\), (b) \\(\\frac{\\sin 52^\\circ}{\\cos 45^\\circ - \\tan 60^\\circ}\\), (c) \\(\\frac{\\cos 56^\\circ - 2\\sin 5^\\circ}{\\sin 45^\\circ \\times \\tan 35.6^\\circ}\\), (d) \\(\\frac{8\\sin 54.2^\\circ}{3} + (\\tan 60^\\circ)^2\\).',
    formula: '\\text{Trigonometric Calculator Ratios}',
    type: 'MCQ',
    options: [
      '(a) 2.50, (b) -0.769, (c) 0.760, (d) 5.16',
      '(a) 2.10, (b) -0.500, (c) 0.820, (d) 4.50',
      '(a) 2.50, (b) 0.769, (c) -0.760, (d) 5.16',
      '(a) 3.00, (b) -1.250, (c) 0.650, (d) 6.00'
    ],
    answer: '(a) 2.50, (b) -0.769, (c) 0.760, (d) 5.16',
    hint: 'Use standard trigonometric ratio values: tan(60°)^2 = 3.',
    steps: [
      '**Step 1: (a) tan 63.4° + cos 60°**',
      '$$1.997 + 0.5 = 2.497 \\approx 2.50$$',
      '**Step 2: (b) sin 52° / (cos 45° - tan 60°)**',
      '$$\\frac{0.7880}{0.7071 - 1.7321} = \\frac{0.7880}{-1.0250} \\approx -0.769$$',
      '**Step 3: (c) (cos 56° - 2 sin 5°) / (sin 45° * tan 35.6°)**',
      '$$\\frac{0.5592 - 0.1744}{0.7071 \\times 0.7159} = \\frac{0.3848}{0.5062} \\approx 0.760$$',
      '**Step 4: (d) (8 sin 54.2°) / 3 + (tan 60°)^2**',
      '$$\\frac{8(0.8111)}{3} + 3 = 2.163 + 3 = 5.163 \\approx 5.16$$',
      '**Final Verified Answer:** (a) 2.50, (b) -0.769, (c) 0.760, (d) 5.16'
    ],
    difficulty: 3
  },
  {
    topic_id: 153,
    title: 'Multi-Triangle Area & Angles Q4',
    text: 'In the diagram, line \\(APB\\) has \\(\\angle ABC = 90^\\circ\\), \\(AC = 17\\text{ cm}\\), \\(AP = 9\\text{ cm}\\), and area of \\(\\triangle APC = 36\\text{ cm}^2\\). Calculate length of \\(BC\\), length of \\(CP\\), and angle \\(\\angle CPA\\).',
    formula: 'BC = \\frac{2 \\times 36}{9} = 8, \\quad CP = \\sqrt{6^2 + 8^2} = 10, \\quad \\angle CPA = 180^\\circ - \\tan^{-1}\\left(\\frac{8}{6}\\right)',
    type: 'MCQ',
    options: [
      'BC = 8 cm, CP = 10 cm, ∠CPA = 126.9°',
      'BC = 9 cm, CP = 12 cm, ∠CPA = 115.0°',
      'BC = 8 cm, CP = 12 cm, ∠CPA = 135.0°',
      'BC = 6 cm, CP = 10 cm, ∠CPA = 120.0°'
    ],
    answer: 'BC = 8 cm, CP = 10 cm, ∠CPA = 126.9°',
    hint: 'Area = 1/2 * AP * BC = 36 => BC = 8 cm. AB = sqrt(289 - 64) = 15 cm => PB = 6 cm. CP = sqrt(36 + 64) = 10 cm.',
    steps: [
      '**Step 1: Calculate perpendicular height BC from area of APC**',
      '$$\\text{Area} = \\frac{1}{2} \\times AP \\times BC = 36 \\implies \\frac{1}{2} \\times 9 \\times BC = 36 \\implies BC = 8\\text{ cm}$$',
      '**Step 2: Calculate AB, PB, and segment CP**',
      '$$AB = \\sqrt{17^2 - 8^2} = 15\\text{ cm} \\implies PB = 15 - 9 = 6\\text{ cm}$$',
      '$$CP = \\sqrt{6^2 + 8^2} = \\sqrt{100} = 10\\text{ cm}$$',
      '**Step 3: Calculate angle CPA**',
      '$$\\angle CPB = \\tan^{-1}\\left(\\frac{8}{6}\\right) = 53.13^\\circ \\implies \\angle CPA = 180^\\circ - 53.13^\\circ = 126.87^\\circ \\approx 126.9^\\circ$$',
      '**Final Verified Answer:** BC = 8 cm, CP = 10 cm, ∠CPA = 126.9°'
    ],
    difficulty: 4
  },
  {
    topic_id: 153,
    title: 'Right & Isosceles Composite Triangle Q11',
    text: 'In the figure, \\(\\triangle ABD\\) is a right-angled triangle at \\(B\\) while \\(\\triangle BCD\\) is an isosceles triangle (\\(BC = CD = 8\\text{ cm}\\)). Given \\(AB = 12\\text{ cm}\\) and \\(AD = 13\\text{ cm}\\), find length of \\(BD\\), \\(\\sin \\angle ADB\\), and the area of \\(\\triangle BCD\\).',
    formula: 'BD = \\sqrt{13^2 - 12^2} = 5, \\quad \\sin \\angle ADB = \\frac{12}{13}, \\quad \\text{Area}_{BCD} = \\sqrt{s(s-a)(s-b)(s-c)}',
    type: 'MCQ',
    options: [
      'BD = 5 cm, sin ∠ADB = 12/13, Area ΔBCD = 19.0 cm²',
      'BD = 6 cm, sin ∠ADB = 5/13, Area ΔBCD = 24.0 cm²',
      'BD = 5 cm, sin ∠ADB = 5/12, Area ΔBCD = 16.5 cm²',
      'BD = 7 cm, sin ∠ADB = 12/13, Area ΔBCD = 20.0 cm²'
    ],
    answer: 'BD = 5 cm, sin ∠ADB = 12/13, Area ΔBCD = 19.0 cm²',
    hint: 'BD = sqrt(169 - 144) = 5 cm. sin(ADB) = opposite/hypotenuse = 12/13. Area of isosceles triangle with sides 8, 8, 5 is 19.0 cm^2.',
    steps: [
      '**Step 1: Calculate BD in right triangle ABD**',
      '$$BD = \\sqrt{13^2 - 12^2} = \\sqrt{25} = 5\\text{ cm}$$',
      '**Step 2: Calculate sin ADB**',
      '$$\\sin \\angle ADB = \\frac{AB}{AD} = \\frac{12}{13}$$',
      '**Step 3: Calculate area of isosceles triangle BCD (sides 8, 8, 5)**',
      '$$s = \\frac{8 + 8 + 5}{2} = 10.5\\text{ cm}$$',
      '$$\\text{Area} = \\sqrt{10.5(2.5)(2.5)(5.5)} = \\sqrt{360.9375} \\approx 19.0\\text{ cm}^2$$',
      '**Final Verified Answer:** BD = 5 cm, sin ∠ADB = 12/13, Area ΔBCD = 19.0 cm²'
    ],
    difficulty: 4
  },
  {
    topic_id: 153,
    title: 'Hot Air Balloon Height & Observer Elevation Q12',
    text: 'A man standing on horizontal ground observes a hot air balloon. Given that the man is \\(1.67\\text{ m}\\) tall, the horizontal distance of the balloon from the man is \\(500\\text{ m}\\), and the angle of elevation from the horizontal line of sight is \\(68^\\circ\\), find the total height of the hot air balloon from the ground (correct to 2 decimal places).',
    formula: 'H = 500 \\tan 68^\\circ + 1.67',
    type: 'MCQ',
    options: ['1239.21 m', '203.68 m', '465.18 m', '537.67 m'],
    answer: '1239.21 m',
    hint: 'Height above observer = 500 * tan(68°) = 1237.54 m. Add man height 1.67 m.',
    steps: [
      '**Step 1: Calculate vertical height above observer eye level**',
      '$$\\text{Height}_{above} = 500 \\times \\tan 68^\\circ = 500 \\times 2.4751 = 1237.54\\text{ m}$$',
      '**Step 2: Add observer height to find total ground height**',
      '$$\\text{Total Height} = 1237.54 + 1.67 = 1239.21\\text{ m}$$',
      '**Final Verified Answer:** 1239.21 m'
    ],
    difficulty: 3
  }
];

const insertStmt = db.prepare(`
  INSERT INTO questions (
    topic_id, question_title, question_text, math_formula, question_type,
    options_json, correct_answer, hint, working_steps_json, image_url, image_alt, difficulty, created_by
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, '', '', ?, 'pdf_import_congruence_trig')
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
