import db from './db.js';
import { generateDynamicQuestion } from './fallbackGenerator.js';

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

function formatQuestion(q) {
  const showImgBool = q.show_image !== undefined && q.show_image !== null ? (Number(q.show_image) === 1 || q.show_image === true || q.show_image === '1') : true;
  const showFmlBool = q.show_formula !== undefined && q.show_formula !== null ? (Number(q.show_formula) === 1 || q.show_formula === true || q.show_formula === '1') : true;

  let img = showImgBool ? (q.image_url || '') : '';
  return {
    id: q.id,
    title: q.question_title,
    questionText: q.question_text,
    mathFormula: showFmlBool ? (q.math_formula || '') : '',
    type: (q.question_type || 'MCQ').toLowerCase(),
    options: Array.isArray(q.options) ? q.options : JSON.parse(q.options_json || '[]'),
    correctAnswer: q.correct_answer,
    hint: q.hint || '',
    workingSteps: Array.isArray(q.working_steps) ? q.working_steps : (typeof q.working_steps_json === 'string' ? JSON.parse(q.working_steps_json || '[]') : []),
    imageUrl: img,
    imageAlt: showImgBool ? (q.image_alt || '') : '',
    difficulty: q.difficulty || 3,
    showImage: showImgBool,
    show_image: showImgBool ? 1 : 0,
    showFormula: showFmlBool,
    show_formula: showFmlBool ? 1 : 0
  };
}

/**
 * Retrieves a topic-appropriate question directly from unified database,
 * or delegates to dynamic fallback generator.
 */
export async function getExerciseForTopic(topicId, formLevel, strand) {
  try {
    let sql = `
      SELECT q.*, t.title as topic_title, t.form_level, t.strand
      FROM questions q
      JOIN topics t ON q.topic_id = t.id
      WHERE 1=1
    `;
    const params = [];

    if (topicId) {
      sql += ' AND q.topic_id = ?';
      params.push(Number(topicId));
    } else if (formLevel) {
      sql += ' AND t.form_level = ?';
      params.push(Number(formLevel));
    }

    sql += ' ORDER BY RANDOM() LIMIT 1';

    const questions = db.prepare(sql).all(...params);
    if (questions && questions.length > 0) {
      return formatQuestion(questions[0]);
    }

    // Delegate to dynamic fallback generator if static questions are not found
    if (topicId) {
      const topic = db.prepare('SELECT * FROM topics WHERE id = ?').get(Number(topicId));
      if (topic) {
        const generated = generateDynamicQuestion(topic, 3);
        return formatQuestion({
          id: Date.now(),
          topic_id: topic.id,
          ...generated,
          options_json: JSON.stringify(generated.options),
          working_steps_json: JSON.stringify(generated.working_steps)
        });
      }
    }
  } catch (err) {
    console.error('Unified DB question lookup error, using local fallback:', err.message);
  }

  // Local fallback generator
  const level = Number(formLevel) || 1;

  if (level <= 2) {
    const a = randInt(5, 12);
    const b = randInt(2, 9);
    const ans = a + b;
    return {
      title: `Form ${level} Basic Addition`,
      questionText: `Solve the addition problem: \\(${a} + ${b}\\)`,
      mathFormula: `${a} + ${b} = ?`,
      type: 'mcq',
      options: shuffle([ans, ans + 2, ans - 1, ans + 5]).map(String),
      correctAnswer: String(ans),
      hint: `Count on starting from ${a}.`,
      workingSteps: [
        `**Step 1: Identify addends**`,
        `$$${a} + ${b}$$`,
        `**Step 2: Calculate sum**`,
        `$$${a} + ${b} = ${ans}$$`,
        `**Final Answer:** ${ans}`
      ]
    };
  } else if (level <= 5) {
    const l = randInt(4, 12);
    const w = randInt(3, 10);
    const area = l * w;
    return {
      title: `Form ${level} Perimeter & Area`,
      questionText: `Calculate the area of a rectangle with length \\(${l}\\text{ cm}\\) and width \\(${w}\\text{ cm}\\):`,
      mathFormula: `\\text{Area} = l \\times w`,
      type: 'mcq',
      options: shuffle([`${area} cm²`, `${2*(l+w)} cm²`, `${area+6} cm²`, `${area-4} cm²`]),
      correctAnswer: `${area} cm²`,
      hint: `Multiply length by width.`,
      workingSteps: [
        `**Step 1: Write formula**`,
        `$$\\text{Area} = l \\times w$$`,
        `**Step 2: Multiply**`,
        `$$${l} \\times ${w} = ${area}\\text{ cm}^2$$`,
        `**Final Answer:** ${area} cm²`
      ]
    };
  } else if (level <= 8) {
    const a = randInt(2, 5);
    const b = randInt(3, 15);
    const xVal = randInt(2, 8);
    const c = a * xVal + b;
    return {
      title: `Form ${level} Linear Equations`,
      questionText: `Solve for \\(x\\) in the equation:`,
      mathFormula: `${a}x + ${b} = ${c}`,
      type: 'mcq',
      options: shuffle([xVal, xVal + 2, xVal - 1, xVal + 4]).map(String),
      correctAnswer: String(xVal),
      hint: `Subtract ${b} from both sides then divide by ${a}.`,
      workingSteps: [
        `**Step 1: Subtract constant**`,
        `$$${a}x = ${c} - ${b} = ${c - b}$$`,
        `**Step 2: Divide by coefficient**`,
        `$$x = \\frac{${c - b}}{${a}} = ${xVal}$$`,
        `**Final Answer:** ${xVal}`
      ]
    };
  } else {
    // Form 9 - 12
    const n = randInt(2, 4);
    const k = randInt(2, 6);
    const coeff = k * n;
    const exp = n - 1;
    const ans = `${coeff}x^{${exp}}`;
    return {
      title: `Form ${level} Advanced Math & Derivatives`,
      questionText: `Differentiate the polynomial function:`,
      mathFormula: `f(x) = ${k}x^{${n}}`,
      type: 'mcq',
      options: shuffle([`\\(${ans}\\)`, `\\(${coeff + 2}x^{${exp}}\\)` , `\\(${k}x^{${n}}\\)` , `\\(${coeff}x^{${n}}\\)`]),
      correctAnswer: `\\(${ans}\\)`,
      hint: `Apply power rule: \\(\\frac{d}{dx}[k x^n] = k n x^{n-1}\\).`,
      workingSteps: [
        `**Step 1: Apply Power Rule**`,
        `$$\\frac{d}{dx}[${k}x^{${n}}] = ${k} \\cdot ${n} x^{${n}-1}$$`,
        `**Step 2: Calculate product**`,
        `$$f'(x) = ${ans}$$`,
        `**Final Answer:** \\(${ans}\\)`
      ]
    };
  }
}
