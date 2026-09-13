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

export function generateDynamicQuestion(topic, customDifficulty = 3) {
  const { form_level, title, strand } = topic;
  const timestamp = Date.now().toString().slice(-4);

  // Default image generators for geometry / statistics topics
  let imageUrl = '';
  let imageAlt = '';

  if (strand === 'Data and Probability' || title.includes('Graph') || title.includes('Data')) {
    imageUrl = '/images/line_graph_trend.png';
    imageAlt = 'Statistical Data Graph Trend Chart';
  } else if (strand === 'Measurement and Geometry' || title.includes('Triangle') || title.includes('Perimeter') || title.includes('Area')) {
    imageUrl = '/images/geometric_triangle.png';
    imageAlt = 'Geometric Polygon Diagram';
  }

  // 1. Data and Probability Topics
  if (strand === 'Data and Probability' || title.includes('Probability') || title.includes('Statistics') || title.includes('Graphs') || title.includes('Data')) {
    if (title.includes('Line') || title.includes('Data') || title.includes('Graph')) {
      const v1 = randInt(120, 300);
      const v2 = randInt(350, 600);
      const diff = v2 - v1;
      const options = shuffle([`₱${diff}`, `₱${diff + 40}`, `₱${Math.max(20, diff - 50)}`, `₱${diff + 90}`]);

      return {
        question_title: `Dynamic Data Graph Analysis #${timestamp}`,
        question_text: `A monthly revenue line graph indicates ₱${v1} in March and ₱${v2} in April. What is the net increase in revenue?`,
        math_formula: `\\text{Net Increase} = \\text{April} - \\text{March}`,
        question_type: 'MCQ',
        options,
        correct_answer: `₱${diff}`,
        hint: `Subtract March revenue from April revenue.`,
        working_steps: [
          `**Step 1: Extract monthly data points**`,
          `$$\\text{March} = \\text{₱}${v1}, \\quad \\text{April} = \\text{₱}${v2}$$`,
          `**Step 2: Compute net difference**`,
          `$$\\Delta = \\text{₱}${v2} - \\text{₱}${v1} = \\text{₱}${diff}$$`,
          `**Final Verified Answer:** \\(\\text{₱}${diff}\\)`
        ],
        image_url: imageUrl,
        image_alt: imageAlt,
        difficulty: customDifficulty
      };
    }
  }

  // 2. Number and Algebra
  if (strand === 'Number and Algebra' || title.includes('Algebra') || title.includes('Equation') || title.includes('Polynomial')) {
    const a = randInt(3, 9);
    const b = randInt(5, 25);
    const x = randInt(2, 10);
    const c = a * x + b;
    const options = shuffle([x, x + 3, Math.max(1, x - 2), x + 5]);

    return {
      question_title: `Dynamic Linear Solver #${timestamp}`,
      question_text: `Find the value of \\(x\\) satisfying the linear equation:`,
      math_formula: `${a}x + ${b} = ${c}`,
      question_type: 'MCQ',
      options: options.map(String),
      correct_answer: String(x),
      hint: `Isolate \\(x\\) by subtracting ${b} and dividing by ${a}.`,
      working_steps: [
        `**Step 1: Subtract constant term ${b} from both sides**`,
        `$$${a}x = ${c} - ${b} = ${c - b}$$`,
        `**Step 2: Divide by coefficient ${a}**`,
        `$$x = \\frac{${c - b}}{${a}} = ${x}$$`,
        `**Final Verified Answer:** \\(x = ${x}\\)`
      ],
      image_url: '',
      image_alt: '',
      difficulty: customDifficulty
    };
  }

  // 3. Measurement and Geometry
  if (strand === 'Measurement and Geometry' || title.includes('Area') || title.includes('Perimeter') || title.includes('Volume')) {
    const l = randInt(6, 20);
    const w = randInt(4, 15);
    const area = l * w;
    const options = shuffle([`${area} m²`, `${2 * (l + w)} m²`, `${area + 15} m²`, `${area - 10} m²`]);

    return {
      question_title: `Dynamic Rectangular Area #${timestamp}`,
      question_text: `Calculate the surface area of a rectangular field with dimensions \\(L = ${l}\\text{ m}\\) and \\(W = ${w}\\text{ m}\\):`,
      math_formula: `A = L \\times W`,
      question_type: 'MCQ',
      options,
      correct_answer: `${area} m²`,
      hint: `Multiply length by width.`,
      working_steps: [
        `**Step 1: State area formula**`,
        `$$A = L \\times W$$`,
        `**Step 2: Multiply given side lengths**`,
        `$$A = ${l}\\text{ m} \\times ${w}\\text{ m} = ${area}\\text{ m}^2$$`,
        `**Final Verified Answer:** \\(${area}\\text{ m}^2\\)`
      ],
      image_url: imageUrl,
      image_alt: imageAlt,
      difficulty: customDifficulty
    };
  }

  // Fallback Universal Word Problem
  const val1 = randInt(15, 80);
  const val2 = randInt(10, 50);
  const total = val1 + val2;
  const options = shuffle([total, total + 5, Math.max(5, total - 8), total + 12]);

  return {
    question_title: `Dynamic Problem Instance #${timestamp}`,
    question_text: `A regional logistics center processes ${val1} shipments in the morning and ${val2} shipments in the afternoon. What is the total count?`,
    math_formula: `T = a + b`,
    question_type: 'MCQ',
    options: options.map(String),
    correct_answer: String(total),
    hint: `Sum the morning and afternoon shipment totals.`,
    working_steps: [
      `**Step 1: Sum quantities**`,
      `$$T = ${val1} + ${val2} = ${total}$$`,
      `**Final Verified Answer:** \\(${total}\\)`
    ],
    image_url: '',
    image_alt: '',
    difficulty: customDifficulty
  };
}
