import { initDb } from '../server/db.js';
import { exportQuestionsToExcel } from '../server/excelService.js';
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
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

function makeOptions(correct, wrong1, wrong2, wrong3) {
  const set = new Set([correct]);
  let count = 1;
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

const NAMES = ['Juan', 'Maria', 'Pedro', 'Ana', 'Luis', 'Sofia', 'Gabriel', 'Elena', 'Marco', 'Clara'];

export function generateGrade8DataProbabilityQuestions() {
  console.log('🚀 Generating 250 Grade 8 Data and Probability Questions (Topics 139 to 143)...');

  // Topic IDs 139 to 143 correspond to Form 8 Data and Probability Strand
  const topicIds = [139, 140, 141, 142, 143];

  const deleteStmt = db.prepare('DELETE FROM questions WHERE topic_id = ?');
  const insertStmt = db.prepare(`
    INSERT INTO questions (
      topic_id, question_title, question_text, math_formula,
      options_json, correct_answer, hint, working_steps_json,
      image_url, image_alt, difficulty
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let totalGenerated = 0;

  for (const topicId of topicIds) {
    deleteStmt.run(topicId);
    
    const topicRow = db.prepare('SELECT title FROM topics WHERE id = ?').get(topicId);
    const topicTitle = topicRow ? topicRow.title : `Topic ${topicId}`;
    console.log(`Generating 50 questions for Topic ${topicId}: ${topicTitle}`);

    for (let qIndex = 0; qIndex < 50; qIndex++) {
      let qObj = null;
      const subType = qIndex % 10;

      // ==========================================
      // TOPIC 139 (T15): Measures of Central Tendency of Ungrouped Data
      // ==========================================
      if (topicId === 139) {
        if (subType === 0) { // Mean of quiz scores
          const scores = [14, 18, 15, 12, 18, 16, 20].map(v => v + (qIndex % 3) - 1);
          const sum = scores.reduce((a, b) => a + b, 0);
          const mean = (sum / scores.length).toFixed(2);
          const ans = `${mean}`;
          const text = `A student recorded the following scores on seven 20-point quizzes: ${scores.join(', ')}. Find the mean score.`;
          const formula = `\\bar{x} = \\frac{\\sum x_i}{n}`;
          const options = makeOptions(ans, (parseFloat(mean) + 1.2).toFixed(2), (parseFloat(mean) - 1.5).toFixed(2), (parseFloat(mean) + 2.0).toFixed(2));
          qObj = {
            title: `Mean Quiz Score #${qIndex + 1}`,
            text, formula, options, answer: ans,
            hint: `Sum all scores (${sum}) and divide by total number of quizzes (${scores.length}).`,
            steps: [
              `**Step 1: Sum the scores**`,
              `$$\\sum x = ${scores.join(' + ')} = ${sum}$$`,
              `**Step 2: Divide by n = ${scores.length}**`,
              `$$\\bar{x} = \\frac{${sum}}{${scores.length}} = ${mean}$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: '', image_alt: '', difficulty: 1
          };
        } else if (subType === 1) { // Median of daily temperatures
          const temps = [28, 31, 29, 34, 30, 27, 32, 35].map(v => v + (qIndex % 4));
          const sorted = [...temps].sort((a, b) => a - b);
          const mid1 = sorted[3], mid2 = sorted[4];
          const median = (mid1 + mid2) / 2;
          const ans = `${median}°C`;
          const text = `Find the median of the following ungrouped dataset representing daily temperatures in degrees Celsius: ${temps.join('°C, ')}°C.`;
          const formula = `\\text{Median} = \\frac{x_{(n/2)} + x_{(n/2+1)}}{2}`;
          const options = makeOptions(ans, `${median + 1.5}°C`, `${median - 2}°C`, `${sorted[3]}°C`);
          qObj = {
            title: `Median Temperature #${qIndex + 1}`,
            text, formula, options, answer: ans,
            hint: `Arrange scores in ascending order: ${sorted.join(', ')}. Average the two middle numbers (${mid1} and ${mid2}).`,
            steps: [
              `**Step 1: Sort in ascending order**`,
              `$$[${sorted.join(', ')}]$$`,
              `**Step 2: Average middle 4th and 5th terms**`,
              `$$\\text{Median} = \\frac{${mid1} + ${mid2}}{2} = ${median}$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: '', image_alt: '', difficulty: 2
          };
        } else if (subType === 2) { // Mode of dataset
          const data = [8, 12, 15, 12, 9, 14, 15, 11, 12, 10];
          const ans = `12`;
          const text = `Determine the mode(s) of the ungrouped dataset: ${data.join(', ')}.`;
          const formula = `\\text{Mode} = \\text{most frequent value}`;
          const options = makeOptions(ans, `15`, `12 and 15 (Bimodal)`, `11`);
          qObj = {
            title: `Dataset Mode #${qIndex + 1}`,
            text, formula, options, answer: ans,
            hint: `Count frequencies: 12 appears 3 times, which is more frequent than any other number.`,
            steps: [
              `**Step 1: Count frequency of each value**`,
              `$$\\text{Value 12 appears 3 times, value 15 appears 2 times, others appear 1 time.}$$`,
              `**Step 2: Identify highest frequency**`,
              `$$\\text{Mode} = 12$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: '', image_alt: '', difficulty: 1
          };
        } else if (subType === 3) { // Missing test score given target mean
          const meanTarget = 84 + (qIndex % 5);
          const scores = [80, 88, 79, 91];
          const sum4 = scores.reduce((a,b)=>a+b, 0);
          const reqSum = meanTarget * 5;
          const missing = reqSum - sum4;
          const ans = `${missing}`;
          const text = `The mean of five test scores is ${meanTarget}. If four of the scores are ${scores.join(', ')}, find the value of the fifth test score.`;
          const formula = `x_5 = 5(\\bar{x}) - \\sum_{i=1}^4 x_i`;
          const options = makeOptions(ans, `${missing + 4}`, `${missing - 5}`, `${meanTarget}`);
          qObj = {
            title: `Missing Score Calculation #${qIndex + 1}`,
            text, formula, options, answer: ans,
            hint: `Total sum needed for 5 scores is 5 * ${meanTarget} = ${reqSum}. Subtract known sum (${sum4}).`,
            steps: [
              `**Step 1: Calculate total required sum**`,
              `$$\\text{Total required} = 5 \\times ${meanTarget} = ${reqSum}$$`,
              `**Step 2: Subtract sum of 4 known scores**`,
              `$$x_5 = ${reqSum} - (${scores.join(' + ')}) = ${reqSum} - ${sum4} = ${missing}$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: '', image_alt: '', difficulty: 2
          };
        } else if (subType === 4) { // Impact of adding new values on median
          const orig = [10, 15, 20, 24, 30, 35, 40, 45, 50]; // 9 values, median = 24
          const ans = `24 (Median remains 24)`;
          const text = `A dataset of 9 values has a median of 24. If two new values, 10 and 38, are added to the dataset (one below 24 and one above 24), what is the median of the new 11-value dataset?`;
          const formula = `\\text{Median position} = \\frac{11 + 1}{2} = 6\\text{th value}`;
          const options = makeOptions(ans, `28`, `20`, `24.5`);
          qObj = {
            title: `Median Shift Property #${qIndex + 1}`,
            text, formula, options, answer: ans,
            hint: `Adding one score below 24 and one score above 24 keeps 24 exactly in the middle position (6th term of 11).`,
            steps: [
              `**Step 1: Analyze new data distribution**`,
              `$$\\text{One new value < 24 and one new value > 24 are added.}$$`,
              `**Step 2: Determine middle element position**`,
              `$$\\text{New count } n = 11 \\implies \\text{Median is 6th element, which remains 24.}$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: '', image_alt: '', difficulty: 2
          };
        } else if (subType === 5) { // Mean and median of shoe sizes
          const sizes = [9, 10, 10.5, 11, 11, 11.5, 12, 14];
          const sum = sizes.reduce((a,b)=>a+b, 0); // 89
          const mean = (sum / 8).toFixed(2); // 11.13
          const median = 11;
          const ans = `Mean = ${mean}, Median = ${median}`;
          const text = `The shoe sizes of 8 basketball players are: ${sizes.join(', ')}. Calculate both the mean and median shoe size.`;
          const formula = `\\bar{x} = \\frac{\\sum x}{n}, \\quad \\text{Median} = \\frac{x_4 + x_5}{2}`;
          const options = makeOptions(ans, `Mean = 11.50, Median = 11`, `Mean = ${mean}, Median = 10.75`, `Mean = 10.88, Median = 11.5`);
          qObj = {
            title: `Mean vs Median Shoe Sizes #${qIndex + 1}`,
            text, formula, options, answer: ans,
            hint: `Mean = ${sum} / 8 = ${mean}. Median = average of 4th (11) and 5th (11) terms = 11.`,
            steps: [
              `**Step 1: Calculate Mean**`,
              `$$\\bar{x} = \\frac{${sum}}{8} = ${mean}$$`,
              `**Step 2: Calculate Median**`,
              `$$\\text{Median} = \\frac{11 + 11}{2} = 11$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: '', image_alt: '', difficulty: 2
          };
        } else if (subType === 6) { // CEO salary outlier effect
          const ans = `Median (₱19,000), because the manager's ₱150,000 salary is an outlier that distorts the mean`;
          const text = `In a small company, five workers earn monthly salaries of ₱18,000, ₱19,000, ₱18,500, ₱20,000, and ₱21,000, while the manager earns ₱150,000. Determine which measure of central tendency best represents the typical employee salary and why.`;
          const formula = `\\text{Median is resistant to extreme outliers}`;
          const options = makeOptions(
            `Median (₱19,000), because the manager's ₱150,000 salary is an outlier that distorts the mean`,
            `Mean (₱41,083), because it includes all employees' income`,
            `Mode (₱18,000), because most employees earn that amount`,
            `Range (₱132,000), because it shows the full spread`
          );
          qObj = {
            title: `Outlier Analysis Salary #${qIndex + 1}`,
            text, formula, options, answer: ans,
            hint: `Extreme outliers skew the mean significantly higher than what typical workers earn, making the median a better representative value.`,
            steps: [
              `**Step 1: Compare Mean vs Median**`,
              `$$\\bar{x} = \\frac{246500}{6} = ₱41,083 \\quad \\text{vs} \\quad \\text{Median} = ₱19,000$$`,
              `**Step 2: Conclusion**`,
              `$$\\text{5 of 6 workers earn under ₱21,000, so median ₱19,000 is much more typical.}$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: '', image_alt: '', difficulty: 2
          };
        } else if (subType === 7) { // Triple calculation: Mean, Median, Mode
          const data = [4, 7, 7, 8, 10, 12, 15];
          const mean = (63 / 7).toFixed(1); // 9.0
          const median = 8;
          const mode = 7;
          const ans = `Mean = 9, Median = 8, Mode = 7`;
          const text = `Calculate the mean, median, and mode for the dataset: ${data.join(', ')}.`;
          const formula = `\\bar{x} = 9, \\quad \\text{Median} = 8, \\quad \\text{Mode} = 7`;
          const options = makeOptions(ans, `Mean = 8, Median = 7, Mode = 9`, `Mean = 9, Median = 7, Mode = 8`, `Mean = 9.5, Median = 8, Mode = 7`);
          qObj = {
            title: `Central Tendency Summary #${qIndex + 1}`,
            text, formula, options, answer: ans,
            hint: `Sum = 63 / 7 = 9. Middle element (4th) = 8. Most frequent number = 7.`,
            steps: [
              `**Step 1: Calculate Mean**`,
              `$$\\bar{x} = \\frac{63}{7} = 9$$`,
              `**Step 2: Find Median and Mode**`,
              `$$\\text{4th value} = 8, \\quad \\text{Most frequent value} = 7$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: '', image_alt: '', difficulty: 2
          };
        } else if (subType === 8) { // Fourth exam score for target mean grade
          const scores = [88, 92, 85];
          const sum3 = 265;
          const targetMean = 90;
          const reqScore = 90 * 4 - sum3; // 360 - 265 = 95
          const ans = `${reqScore}`;
          const text = `A student scored 88, 92, and 85 on three quarterly exams. What score must the student achieve on the fourth exam to attain an overall mean of 90?`;
          const formula = `x_4 = 4(90) - (88 + 92 + 85)`;
          const options = makeOptions(ans, `92`, `98`, `90`);
          qObj = {
            title: `Required Exam Grade #${qIndex + 1}`,
            text, formula, options, answer: ans,
            hint: `Total points needed for 4 exams = 4 * 90 = 360. Points earned = 265. Score needed = 360 - 265 = 95.`,
            steps: [
              `**Step 1: Calculate total points required**`,
              `$$4 \\times 90 = 360$$`,
              `**Step 2: Subtract current total points**`,
              `$$x_4 = 360 - (88 + 92 + 85) = 360 - 265 = 95$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: '', image_alt: '', difficulty: 2
          };
        } else { // Solve for x given algebraic mean
          // {2x - 1, 3x + 2, x + 5}, mean = 16 => (6x + 6)/3 = 16 => 2x + 2 = 16 => x = 7
          const ans = `x = 7`;
          const text = `Given the set of algebraic expressions \\(\\{2x - 1, 3x + 2, x + 5\\}\\), find the value of \\(x\\) if the mean of the three expressions is 16.`;
          const formula = `\\frac{(2x - 1) + (3x + 2) + (x + 5)}{3} = 16`;
          const options = makeOptions(ans, `x = 6`, `x = 8`, `x = 5`);
          qObj = {
            title: `Algebraic Dataset Mean #${qIndex + 1}`,
            text, formula, options, answer: ans,
            hint: `Sum expressions: 2x - 1 + 3x + 2 + x + 5 = 6x + 6. Divide by 3 to get 2x + 2 = 16.`,
            steps: [
              `**Step 1: Set up mean equation**`,
              `$$\\frac{6x + 6}{3} = 16 \\implies 2x + 2 = 16$$`,
              `**Step 2: Solve for x**`,
              `$$2x = 14 \\implies x = 7$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: '', image_alt: '', difficulty: 3
          };
        }
      }

      // ==========================================
      // TOPIC 140 (T16): Measures of Variability for Ungrouped Data
      // ==========================================
      else if (topicId === 140) {
        if (subType === 0) { // Range of test scores
          const scores = [45, 62, 78, 55, 91, 84, 70, 68].map(v => v + (qIndex % 3));
          const max = Math.max(...scores);
          const min = Math.min(...scores);
          const range = max - min;
          const ans = `${range}`;
          const text = `Find the range of the test scores: ${scores.join(', ')}.`;
          const formula = `\\text{Range} = \\text{Maximum} - \\text{Minimum}`;
          const options = makeOptions(ans, `${range + 5}`, `${range - 4}`, `${max}`);
          qObj = {
            title: `Dataset Range #${qIndex + 1}`,
            text, formula, options, answer: ans,
            hint: `Identify maximum score (${max}) and minimum score (${min}), then compute Range = ${max} - ${min}.`,
            steps: [
              `**Step 1: Identify maximum and minimum**`,
              `$$\\text{Max} = ${max}, \\quad \\text{Min} = ${min}$$`,
              `**Step 2: Subtract Min from Max**`,
              `$$\\text{Range} = ${max} - ${min} = ${range}$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: '', image_alt: '', difficulty: 1
          };
        } else if (subType === 1) { // Mean Absolute Deviation (MAD)
          const data = [6, 8, 10, 12, 14];
          const mean = 10;
          const mad = ( (4 + 2 + 0 + 2 + 4) / 5 ).toFixed(1); // 2.4
          const ans = `${mad}`;
          const text = `Given the dataset: ${data.join(', ')}, calculate the Mean Absolute Deviation (MAD).`;
          const formula = `\\text{MAD} = \\frac{\\sum |x_i - \\bar{x}|}{n}`;
          const options = makeOptions(ans, `3.2`, `1.8`, `4.0`);
          qObj = {
            title: `Mean Absolute Deviation #${qIndex + 1}`,
            text, formula, options, answer: ans,
            hint: `Mean = 10. Compute absolute deviations: |6-10|=4, |8-10|=2, |10-10|=0, |12-10|=2, |14-10|=4. Average = 12/5 = 2.4.`,
            steps: [
              `**Step 1: Calculate Mean**`,
              `$$\\bar{x} = \\frac{6 + 8 + 10 + 12 + 14}{5} = 10$$`,
              `**Step 2: Average absolute deviations**`,
              `$$\\text{MAD} = \\frac{4 + 2 + 0 + 2 + 4}{5} = \\frac{12}{5} = 2.4$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: '', image_alt: '', difficulty: 2
          };
        } else if (subType === 2) { // Sample variance and sample standard deviation
          const data = [5, 7, 9, 11, 13];
          const mean = 9;
          // deviations: -4, -2, 0, 2, 4 => squared: 16, 4, 0, 4, 16 => sum = 40
          // sample variance = 40 / 4 = 10 => sample std dev = sqrt(10) ≈ 3.16
          const ans = `s^2 = 10, \\quad s = 3.16`;
          const text = `Calculate the sample variance (s²) and sample standard deviation (s) for the dataset: ${data.join(', ')}.`;
          const formula = `s^2 = \\frac{\\sum (x_i - \\bar{x})^2}{n - 1}`;
          const options = makeOptions(ans, `s^2 = 8, \\quad s = 2.83`, `s^2 = 10, \\quad s = 3.50`, `s^2 = 12, \\quad s = 3.46`);
          qObj = {
            title: `Sample Standard Deviation #${qIndex + 1}`,
            text, formula, options, answer: ans,
            hint: `Mean = 9. Sum of squared deviations = 16 + 4 + 0 + 4 + 16 = 40. Sample variance = 40 / (5-1) = 10. s = \\sqrt{10} = 3.16.`,
            steps: [
              `**Step 1: Calculate sum of squared deviations**`,
              `$$\\sum (x - 9)^2 = 16 + 4 + 0 + 4 + 16 = 40$$`,
              `**Step 2: Divide by n - 1 = 4**`,
              `$$s^2 = \\frac{40}{4} = 10, \\quad s = \\sqrt{10} \\approx 3.16$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: '', image_alt: '', difficulty: 3
          };
        } else if (subType === 3) { // Comparing consistency of two students
          const ans = `Ana is more consistent (s = 0 compared to Ben's s = 15.81)`;
          const text = `Two students, Ana and Ben, scored in 5 math quizzes: Ana: 80, 80, 80, 80, 80; Ben: 60, 70, 80, 90, 100. Both have an identical mean of 80. Determine whose performance is more consistent and explain why using standard deviation.`;
          const formula = `\\text{Lower standard deviation } \\implies \\text{greater consistency}`;
          const options = makeOptions(
            `Ana is more consistent (s = 0 compared to Ben's s = 15.81)`,
            `Ben is more consistent because he reached a high score of 100`,
            `Both have equal consistency because their mean scores are equal`,
            `Ben is more consistent because his scores form a symmetrical pattern`
          );
          qObj = {
            title: `Performance Consistency Comparison #${qIndex + 1}`,
            text, formula, options, answer: ans,
            hint: `A lower standard deviation indicates scores are clustered closely around the mean, demonstrating higher consistency.`,
            steps: [
              `**Step 1: Compute standard deviations**`,
              `$$s_{\\text{Ana}} = 0, \\quad s_{\\text{Ben}} = \\sqrt{\\frac{1000}{4}} = 15.81$$`,
              `**Step 2: Conclusion**`,
              `$$s_{\\text{Ana}} < s_{\\text{Ben}} \\implies \\text{Ana is more consistent.}$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: '', image_alt: '', difficulty: 2
          };
        } else if (subType === 4) { // Mean deviation of volunteer ages
          const ages = [18, 20, 22, 24, 26, 28];
          const mean = 23;
          // deviations: 5, 3, 1, 1, 3, 5 => sum = 18 => MAD = 18 / 6 = 3
          const ans = `3 years`;
          const text = `Find the mean deviation for the following ages of 6 volunteers: ${ages.join(', ')} years.`;
          const formula = `\\text{MD} = \\frac{\\sum |x_i - \\bar{x}|}{n}`;
          const options = makeOptions(ans, `4 years`, `2.5 years`, `3.5 years`);
          qObj = {
            title: `Mean Deviation of Ages #${qIndex + 1}`,
            text, formula, options, answer: ans,
            hint: `Mean age = 23. Deviations = 5, 3, 1, 1, 3, 5. Average = 18 / 6 = 3.`,
            steps: [
              `**Step 1: Compute mean**`,
              `$$\\bar{x} = \\frac{138}{6} = 23$$`,
              `**Step 2: Compute mean deviation**`,
              `$$\\text{MD} = \\frac{5 + 3 + 1 + 1 + 3 + 5}{6} = \\frac{18}{6} = 3\\text{ years}$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: '', image_alt: '', difficulty: 2
          };
        } else if (subType === 5) { // Population standard deviation of weights
          const weights = [3, 5, 8, 10, 14];
          const mean = 8;
          // deviations: -5, -3, 0, 2, 6 => squared: 25, 9, 0, 4, 36 => sum = 74
          // pop variance = 74 / 5 = 14.8 => pop std dev = sqrt(14.8) ≈ 3.85
          const ans = `3.85 kg`;
          const text = `The weights (in kg) of 5 parcels are: ${weights.join(', ')} kg. Compute the population standard deviation (σ) to two decimal places.`;
          const formula = `\\sigma = \\sqrt{\\frac{\\sum (x_i - \\mu)^2}{N}}`;
          const options = makeOptions(ans, `4.30 kg`, `3.45 kg`, `14.80 kg`);
          qObj = {
            title: `Population Standard Deviation #${qIndex + 1}`,
            text, formula, options, answer: ans,
            hint: `Mean = 8. Sum of squared deviations = 74. Population variance = 74 / 5 = 14.8. \\sigma = \\sqrt{14.8} = 3.85.`,
            steps: [
              `**Step 1: Compute population variance**`,
              `$$\\sigma^2 = \\frac{25 + 9 + 0 + 4 + 36}{5} = \\frac{74}{5} = 14.8$$`,
              `**Step 2: Take square root**`,
              `$$\\sigma = \\sqrt{14.8} \\approx 3.85\\text{ kg}$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: '', image_alt: '', difficulty: 3
          };
        } else if (subType === 6) { // Effect of adding a constant to scores
          const k = 5;
          const ans = `Mean increases by 5, but Standard Deviation remains unchanged`;
          const text = `If every score in a dataset is increased by 5 points, explain how this shift affects the mean and the standard deviation of the dataset.`;
          const formula = `\\bar{x}_{new} = \\bar{x} + k, \\quad s_{new} = s`;
          const options = makeOptions(
            `Mean increases by 5, but Standard Deviation remains unchanged`,
            `Both Mean and Standard Deviation increase by 5`,
            `Mean remains unchanged, but Standard Deviation increases by 5`,
            `Both Mean and Standard Deviation are multiplied by 5`
          );
          qObj = {
            title: `Additive Shift Effect on Spread #${qIndex + 1}`,
            text, formula, options, answer: ans,
            hint: `Adding a constant shifts all data points equally without changing the distance between values, leaving spread/standard deviation unchanged.`,
            steps: [
              `**Step 1: Analyze additive shift**`,
              `$$x_{new} = x + 5 \\implies \\bar{x}_{new} = \\bar{x} + 5$$`,
              `**Step 2: Analyze deviation differences**`,
              `$$x_{new} - \\bar{x}_{new} = (x + 5) - (\\bar{x} + 5) = x - \\bar{x} \\implies s \\text{ is unchanged.}$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: '', image_alt: '', difficulty: 2
          };
        } else if (subType === 7) { // Effect of multiplying scores by a constant
          const ans = `The original standard deviation is multiplied by 3`;
          const text = `If every value in a dataset is multiplied by 3, what is the effect on the original standard deviation?`;
          const formula = `s_{new} = c \\cdot s`;
          const options = makeOptions(
            `The original standard deviation is multiplied by 3`,
            `The original standard deviation is multiplied by 9`,
            `The original standard deviation increases by 3`,
            `The original standard deviation remains unchanged`
          );
          qObj = {
            title: `Multiplicative Shift Effect on Standard Deviation #${qIndex + 1}`,
            text, formula, options, answer: ans,
            hint: `Multiplying every dataset value by a scalar c multiplies the standard deviation by |c|.`,
            steps: [
              `**Step 1: Analyze scaling factor**`,
              `$$x_{new} = 3x \\implies \\bar{x}_{new} = 3\\bar{x}$$`,
              `**Step 2: Evaluate standard deviation scaling**`,
              `$$s_{new} = \\sqrt{\\frac{\\sum (3x - 3\\bar{x})^2}{n-1}} = 3s$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: '', image_alt: '', difficulty: 2
          };
        } else if (subType === 8) { // Light bulb quality assurance reliability
          const ans = `Brand X exhibits greater reliability because its lower standard deviation (1.2 vs 4.8) indicates more consistent lifespan`;
          const text = `A quality assurance inspector tests two light bulb brands for lifespan (in hundreds of hours). Brand X has standard deviation s = 1.2, while Brand Y has s = 4.8. Interpret which brand exhibits greater reliability and consistency.`;
          const formula = `\\text{Smaller } s \\implies \\text{greater consistency}`;
          const options = makeOptions(
            `Brand X exhibits greater reliability because its lower standard deviation (1.2 vs 4.8) indicates more consistent lifespan`,
            `Brand Y exhibits greater reliability because a higher standard deviation means longer potential lifespan`,
            `Both brands are equally reliable because standard deviation does not measure quality`,
            `Brand Y is four times more consistent than Brand X`
          );
          qObj = {
            title: `Product Reliability Interpretation #${qIndex + 1}`,
            text, formula, options, answer: ans,
            hint: `Lower standard deviation represents lower variability and higher predictability/consistency.`,
            steps: [
              `**Step 1: Compare standard deviations**`,
              `$$s_X = 1.2 < s_Y = 4.8$$`,
              `**Step 2: Draw statistical conclusion**`,
              `$$\\text{Brand X has far less variance in bulb lifespan, making it more consistent.}$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: '', image_alt: '', difficulty: 2
          };
        } else { // Complete variability summary (Range, MAD, Std Dev)
          const data = [12, 15, 18, 20, 25];
          const range = 25 - 12; // 13
          const mean = 18;
          // MAD: (|12-18| + |15-18| + |18-18| + |20-18| + |25-18|) / 5 = (6 + 3 + 0 + 2 + 7)/5 = 18/5 = 3.6
          const mad = 3.6;
          // sample variance: (36 + 9 + 0 + 4 + 49) / 4 = 98 / 4 = 24.5 => s ≈ 4.95
          const ans = `Range = 13, MAD = 3.6, s = 4.95`;
          const text = `Calculate the range, Mean Absolute Deviation (MAD), and sample standard deviation (s) for the dataset: ${data.join(', ')}.`;
          const formula = `\\text{Range}=13, \\quad \\text{MAD}=3.6, \\quad s=\\sqrt{24.5}`;
          const options = makeOptions(ans, `Range = 13, MAD = 4.0, s = 5.20`, `Range = 15, MAD = 3.6, s = 4.50`, `Range = 12, MAD = 3.2, s = 4.95`);
          qObj = {
            title: `Variability Measures Summary #${qIndex + 1}`,
            text, formula, options, answer: ans,
            hint: `Range = 25 - 12 = 13. Mean = 18. MAD = 18/5 = 3.6. Sample std dev s = \\sqrt{24.5} = 4.95.`,
            steps: [
              `**Step 1: Range**`,
              `$$\\text{Range} = 25 - 12 = 13$$`,
              `**Step 2: MAD**`,
              `$$\\text{MAD} = \\frac{6 + 3 + 0 + 2 + 7}{5} = 3.6$$`,
              `**Step 3: Sample Std Dev**`,
              `$$s = \\sqrt{\\frac{98}{4}} = \\sqrt{24.5} \\approx 4.95$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: '', image_alt: '', difficulty: 3
          };
        }
      }

      // ==========================================
      // TOPIC 141 (T17): Interpretation & Analysis of Graphs
      // ==========================================
      else if (topicId === 141) {
        if (subType === 0) { // Percentage increase in pass rates from quarterly bar graph
          const q1 = 72, q4 = 92;
          const inc = q4 - q1; // 20
          const pct = ((inc / q1) * 100).toFixed(2); // 27.78%
          const ans = `${pct}%`;
          const text = `A bar graph shows the Grade 8 quarterly mathematics pass rates: Q1: ${q1}%, Q2: 80%, Q3: 85%, Q4: ${q4}%. Calculate the percentage increase in pass rate from Q1 to Q4.`;
          const formula = `\\text{Percentage Increase} = \\frac{\\text{Q4} - \\text{Q1}}{\\text{Q1}} \\times 100\\%`;
          const options = makeOptions(ans, `20.00%`, `25.00%`, `30.50%`);
          qObj = {
            title: `Bar Graph Pass Rate Increase #${qIndex + 1}`,
            text, formula, options, answer: ans,
            hint: `Increase = 92 - 72 = 20. Percentage increase = (20 / 72) * 100 = 27.78%.`,
            steps: [
              `**Step 1: Compute absolute change**`,
              `$$\\text{Increase} = 92 - 72 = 20\\%$$`,
              `**Step 2: Compute percentage relative to Q1 base**`,
              `$$\\text{Pct Increase} = \\frac{20}{72} \\times 100\\% = 27.78\\%$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: '', image_alt: '', difficulty: 2
          };
        } else if (subType === 1) { // Pie chart monthly budget allocation
          const budget = 30000;
          const angle = 120;
          const foodAmount = (angle / 360) * budget; // 10,000
          const ans = `₱10,000`;
          const text = `In a pie chart illustrating a family's monthly budget of ₱30,000, the sector for Food represents 120°. How much money is allocated for Food?`;
          const formula = `\\text{Amount} = \\frac{\\theta}{360^\\circ} \\times \\text{Total Budget}`;
          const options = makeOptions(ans, `₱12,000`, `₱8,000`, `₱15,000`);
          qObj = {
            title: `Pie Chart Budget Sector #${qIndex + 1}`,
            text, formula, options, answer: ans,
            hint: `Food proportion = 120° / 360° = 1/3. Amount = 1/3 of ₱30,000 = ₱10,000.`,
            steps: [
              `**Step 1: Find sector fraction**`,
              `$$\\text{Fraction} = \\frac{120^\\circ}{360^\\circ} = \\frac{1}{3}$$`,
              `**Step 2: Multiply by total budget**`,
              `$$\\text{Food Allocation} = \\frac{1}{3} \\times ₱30,000 = ₱10,000$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: '', image_alt: '', difficulty: 2
          };
        } else if (subType === 2) { // Line graph rate of temperature change
          const t1 = 22, t2 = 34; // 6 AM to 2 PM = 8 hours
          const rate = ((t2 - t1) / 8).toFixed(1); // 1.5 °C/hr
          const ans = `${rate}°C per hour`;
          const text = `A line graph records the hourly temperature of a city from 6:00 AM to 6:00 PM. If the temperature rose from 22°C at 6:00 AM to a peak of 34°C at 2:00 PM, what was the average rate of temperature increase per hour during this 8-hour interval?`;
          const formula = `\\text{Rate} = \\frac{T_{final} - T_{initial}}{\\Delta t}`;
          const options = makeOptions(ans, `2.0°C per hour`, `1.2°C per hour`, `1.8°C per hour`);
          qObj = {
            title: `Line Graph Rate of Change #${qIndex + 1}`,
            text, formula, options, answer: ans,
            hint: `Total temperature increase = 34 - 22 = 12°C over 8 hours. Rate = 12 / 8 = 1.5°C per hour.`,
            steps: [
              `**Step 1: Calculate total change**`,
              `$$\\Delta T = 34 - 22 = 12^\\circ\\text{C}$$`,
              `**Step 2: Divide by 8 hours**`,
              `$$\\text{Rate} = \\frac{12}{8} = 1.5^\\circ\\text{C per hour}$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: '', image_alt: '', difficulty: 2
          };
        } else if (subType === 3) { // Double-bar graph comparative analysis
          const ans = `Sum the height of the 5 weekday bars for Grade 7 and Grade 8 separately, then compare total books borrowed`;
          const text = `A double-bar graph compares the book borrowing statistics of Grade 7 and Grade 8 students across 5 weekdays. How would you determine which grade level had higher total library engagement for the week?`;
          const formula = `\\text{Total engagement} = \\sum_{i=1}^5 \\text{bar height}_i`;
          const options = makeOptions(
            `Sum the height of the 5 weekday bars for Grade 7 and Grade 8 separately, then compare total books borrowed`,
            `Compare only the Friday bar heights for both grades`,
            `Calculate the difference between maximum and minimum bar heights for each grade`,
            `Find the average height of the highest bar of each grade`
          );
          qObj = {
            title: `Double Bar Graph Engagement #${qIndex + 1}`,
            text, formula, options, answer: ans,
            hint: `Total engagement over the 5-day week requires summing all daily bar frequencies for each grade level.`,
            steps: [
              `**Step 1: Sum daily bar values**`,
              `$$\\text{Total Grade 7} = \\sum G7_i, \\quad \\text{Total Grade 8} = \\sum G8_i$$`,
              `**Step 2: Compare weekly totals**`,
              `$$\\text{Compare overall sums to determine higher engagement.}$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: '', image_alt: '', difficulty: 2
          };
        } else if (subType === 4) { // Histogram frequency percentage
          const freq = 14, total = 50;
          const pct = ((freq / total) * 100).toFixed(0); // 28%
          const ans = `${pct}%`;
          const text = `A histogram displays examination scores grouped in intervals of 10. If the 70-79 score bar has a frequency of 14 students out of a total class of 50 students, what percentage of students scored in this range?`;
          const formula = `\\text{Percentage} = \\frac{\\text{Frequency}}{\\text{Total}} \\times 100\\%`;
          const options = makeOptions(ans, `24%`, `32%`, `14%`);
          qObj = {
            title: `Histogram Interval Percentage #${qIndex + 1}`,
            text, formula, options, answer: ans,
            hint: `Percentage = (14 / 50) * 100 = 28%.`,
            steps: [
              `**Step 1: Calculate fraction**`,
              `$$\\frac{14}{50} = 0.28$$`,
              `**Step 2: Convert to percentage**`,
              `$$0.28 \\times 100\\% = 28\\%$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: '', image_alt: '', difficulty: 1
          };
        } else if (subType === 5) { // Primary vs secondary data definition
          const ans = `Primary data is collected directly first-hand by the researcher (e.g., student survey); Secondary data is gathered from pre-existing published sources (e.g., government census records)`;
          const text = `Explain the difference between primary data and secondary data in statistical research.`;
          const formula = `\\text{Primary = first-hand, Secondary = pre-existing}`;
          const options = makeOptions(
            `Primary data is collected directly first-hand by the researcher (e.g., student survey); Secondary data is gathered from pre-existing published sources (e.g., government census records)`,
            `Primary data consists only of numbers; Secondary data consists only of words`,
            `Primary data is always accurate; Secondary data is always invalid`,
            `Primary data refers to Grade 1 data; Secondary data refers to High School data`
          );
          qObj = {
            title: `Primary vs Secondary Data #${qIndex + 1}`,
            text, formula, options, answer: ans,
            hint: `Primary data is original first-hand data collected by the researcher; secondary data comes from existing reports/records.`,
            steps: [
              `**Step 1: Define Primary Data**`,
              `$$\\text{Direct first-hand collection (e.g. classroom survey)}$$`,
              `**Step 2: Define Secondary Data**`,
              `$$\\text{Pre-existing published records (e.g. census statistics)}$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: '', image_alt: '', difficulty: 1
          };
        } else if (subType === 6) { // Inflation line graph trend interpretation
          const ans = `A downward slope indicates a slowing rate of price increases (disinflation), not negative prices`;
          const text = `A government agency releases a line graph showing the national inflation rate over 12 months. Describe what a downward slope on the inflation rate graph indicates regarding the general price level.`;
          const formula = `\\text{Downward slope} \\implies \\text{rate of price increase is decelerating}`;
          const options = makeOptions(
            `A downward slope indicates a slowing rate of price increases (disinflation), not negative prices`,
            `A downward slope indicates prices are dropping to zero`,
            `A downward slope means consumer purchasing power is completely eliminated`,
            `A downward slope indicates the total population is decreasing`
          );
          qObj = {
            title: `Inflation Graph Trend Analysis #${qIndex + 1}`,
            text, formula, options, answer: ans,
            hint: `A falling positive inflation rate means prices are still rising, but at a slower rate than before.`,
            steps: [
              `**Step 1: Analyze slope**`,
              `$$\\text{Downward slope in inflation rate graph } \\implies \\text{Disinflation.}$$`,
              `**Step 2: Interpret price level**`,
              `$$\\text{Prices continue to rise, but at a reduced pace.}$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: '', image_alt: '', difficulty: 2
          };
        } else if (subType === 7) { // Scatter plot correlation analysis
          const ans = `Positive correlation`;
          const text = `In a scatter plot comparing weekly study hours against math exam scores, data points generally rise from lower-left to upper-right. What type of correlation does this indicate?`;
          const formula = `\\text{Rising pattern } \\implies \\text{Positive correlation}`;
          const options = makeOptions(`Positive correlation`, `Negative correlation`, `Zero correlation`, `Non-linear quadratic correlation`);
          qObj = {
            title: `Scatter Plot Correlation #${qIndex + 1}`,
            text, formula, options, answer: ans,
            hint: `As study hours increase, exam scores tend to increase, showing a positive linear trend.`,
            steps: [
              `**Step 1: Observe trend direction**`,
              `$$\\text{Data points rise from lower-left to upper-right.}$$`,
              `**Step 2: Identify correlation type**`,
              `$$\\text{Both variables increase together } \\implies \\text{Positive correlation}$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: '', image_alt: '', difficulty: 1
          };
        } else if (subType === 8) { // Truncated vertical axis visual distortion
          const ans = `Truncating the vertical axis exaggerates small numerical differences visually, creating a misleading perception of large changes`;
          const text = `A bar graph begins its vertical axis at 80 instead of 0, making a score of 85 appear twice as tall as 82. Explain why truncated vertical axes create false visual impressions.`;
          const formula = `\\text{Truncated axis } \\implies \\text{distorted relative proportions}`;
          const options = makeOptions(
            `Truncating the vertical axis exaggerates small numerical differences visually, creating a misleading perception of large changes`,
            `Truncating the vertical axis makes the graph mathematically invalid for computing averages`,
            `Truncating the vertical axis causes data values to multiply by 2`,
            `Truncating the vertical axis hides negative data values`
          );
          qObj = {
            title: `Misleading Graph Axis Truncation #${qIndex + 1}`,
            text, formula, options, answer: ans,
            hint: `Starting the Y-axis above zero removes baseline scale proportionality, visually exaggerating minor difference bars.`,
            steps: [
              `**Step 1: Analyze visual scale**`,
              `$$\\text{Bar height ratio with truncation (85-80):(82-80) = 5:2 = 2.5x}$$`,
              `**Step 2: Contrast with true baseline ratio**`,
              `$$\\text{Actual ratio = 85:82 = 1.036x. Visual difference is exaggerated.}$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: '', image_alt: '', difficulty: 2
          };
        } else { // Frequency polygon travel time peak analysis
          const ans = `The most common (modal) commuter travel time is centered around 35 minutes`;
          const text = `A frequency polygon displays the distribution of travel times (in minutes) for 100 commuters. If the peak frequency occurs at the midpoint of 35 minutes, state what statistical conclusion can be drawn regarding commuter travel times.`;
          const formula = `\\text{Peak frequency} \\implies \\text{Mode / most frequent interval}`;
          const options = makeOptions(
            `The most common (modal) commuter travel time is centered around 35 minutes`,
            `All 100 commuters take exactly 35 minutes to travel`,
            `The maximum travel time for any commuter is 35 minutes`,
            `50% of commuters take more than 70 minutes`
          );
          qObj = {
            title: `Frequency Polygon Peak Analysis #${qIndex + 1}`,
            text, formula, options, answer: ans,
            hint: `The highest point on a frequency polygon corresponds to the modal interval with the greatest number of observations.`,
            steps: [
              `**Step 1: Identify peak definition**`,
              `$$\\text{Peak point on frequency polygon } = \\text{highest frequency.}$$`,
              `**Step 2: Interpret 35-minute midpoint**`,
              `$$\\text{35 minutes is the modal travel time interval.}$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: '', image_alt: '', difficulty: 2
          };
        }
      }

      // ==========================================
      // TOPIC 142 (T18): Experimental and Theoretical Probability
      // ==========================================
      else if (topicId === 142) {
        if (subType === 0) { // Theoretical vs experimental probability definition
          const ans = `Theoretical probability is based on ideal mathematical reasoning (1/6 ≈ 16.67%), while experimental probability is based on actual observed trial results`;
          const text = `Explain the difference between theoretical probability and experimental probability using a standard six-sided die example.`;
          const formula = `P_{th} = \\frac{\\text{favorable}}{\\text{total}}, \\quad P_{exp} = \\frac{\\text{observed count}}{\\text{total trials}}`;
          const options = makeOptions(
            `Theoretical probability is based on ideal mathematical reasoning (1/6 ≈ 16.67%), while experimental probability is based on actual observed trial results`,
            `Theoretical probability requires rolling a die 1,000 times; experimental probability requires 10 rolls`,
            `Theoretical probability applies only to coins; experimental probability applies only to dice`,
            `Theoretical probability changes after every roll; experimental probability remains constant`
          );
          qObj = {
            title: `Theoretical vs Experimental Probability #${qIndex + 1}`,
            text, formula, options, answer: ans,
            hint: `Theoretical probability calculates what should happen mathematically; experimental probability records what actually happened in an experiment.`,
            steps: [
              `**Step 1: Theoretical Probability**`,
              `$$P_{th}(\\text{rolling a 4}) = \\frac{1}{6} \\approx 16.67\\%$$`,
              `**Step 2: Experimental Probability**`,
              `$$P_{exp} = \\frac{\\text{number of times 4 appeared}}{\\text{total trials conducted}}$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: '', image_alt: '', difficulty: 1
          };
        } else if (subType === 1) { // Single die roll compound event
          // P(odd or > 4) on 6-sided die: odd={1,3,5}, >4={5,6} => union = {1, 3, 5, 6} => 4/6 = 2/3
          const ans = `2/3`;
          const text = `A fair six-sided die is rolled once. Find the theoretical probability of rolling an odd number or a number greater than 4.`;
          const formula = `P(A \\cup B) = P(A) + P(B) - P(A \\cap B)`;
          const options = makeOptions(ans, `1/2`, `5/6`, `1/3`);
          qObj = {
            title: `Die Roll Probability #${qIndex + 1}`,
            text, formula, options, answer: ans,
            hint: `Favorable outcomes: Odd numbers {1, 3, 5} and numbers > 4 {5, 6}. Combined favorable set = {1, 3, 5, 6} (4 outcomes out of 6). P = 4/6 = 2/3.`,
            steps: [
              `**Step 1: List favorable outcomes**`,
              `$$\\text{Favorable set } = \\{1, 3, 5, 6\\} \\implies 4\\text{ outcomes}$$`,
              `**Step 2: Divide by total outcomes (6)**`,
              `$$P = \\frac{4}{6} = \\frac{2}{3}$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: '', image_alt: '', difficulty: 2
          };
        } else if (subType === 2) { // Experimental probability coin flips
          const heads = 118, total = 200;
          const expP = (heads / total).toFixed(2); // 0.59
          const ans = `Experimental P(Heads) = 0.59 (or 59%), which is 0.09 higher than Theoretical P(Heads) = 0.50`;
          const text = `A coin is flipped 200 times in an experiment, landing on Heads 118 times. What is the experimental probability of getting Heads? Compare this with the theoretical probability.`;
          const formula = `P_{exp} = \\frac{118}{200} = 0.59`;
          const options = makeOptions(
            `Experimental P(Heads) = 0.59 (or 59%), which is 0.09 higher than Theoretical P(Heads) = 0.50`,
            `Experimental P(Heads) = 0.50, exactly equal to Theoretical P(Heads)`,
            `Experimental P(Heads) = 0.41, lower than Theoretical P(Heads)`,
            `Experimental P(Heads) = 1.18, higher than Theoretical P(Heads)`
          );
          qObj = {
            title: `Coin Flip Experimental Probability #${qIndex + 1}`,
            text, formula, options, answer: ans,
            hint: `Experimental = 118 / 200 = 0.59. Theoretical for fair coin = 1/2 = 0.50. Difference = 0.59 - 0.50 = 0.09.`,
            steps: [
              `**Step 1: Compute Experimental Probability**`,
              `$$P_{exp} = \\frac{118}{200} = 0.59 = 59\\%$$`,
              `**Step 2: Compare with Theoretical**`,
              `$$P_{th} = 0.50 \\implies 0.59 - 0.50 = +0.09$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: '', image_alt: '', difficulty: 2
          };
        } else if (subType === 3) { // Playing cards red face card
          // Red face cards: 2 suits (Hearts, Diamonds) * 3 face cards (J, Q, K) = 6 cards out of 52. 6/52 = 3/26
          const ans = `3/26`;
          const text = `A standard deck of 52 playing cards is well-shuffled. Find the theoretical probability of randomly drawing a red face card (Jack, Queen, or King of Hearts or Diamonds).`;
          const formula = `P = \\frac{\\text{Red Face Cards}}{52}`;
          const options = makeOptions(ans, `6/26`, `3/13`, `1/13`);
          qObj = {
            title: `Card Deck Probability #${qIndex + 1}`,
            text, formula, options, answer: ans,
            hint: `Red face cards = 3 Hearts + 3 Diamonds = 6 cards. P = 6 / 52 = 3 / 26.`,
            steps: [
              `**Step 1: Count favorable cards**`,
              `$$\\text{Red face cards} = 2 \\times 3 = 6$$`,
              `**Step 2: Simplify ratio**`,
              `$$P = \\frac{6}{52} = \\frac{3}{26}$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: '', image_alt: '', difficulty: 2
          };
        } else if (subType === 4) { // Complementary probability colored marbles
          // 6 red, 8 blue, 4 green => total = 18. P(NOT blue) = (6 + 4)/18 = 10/18 = 5/9
          const ans = `5/9`;
          const text = `A bag contains 6 red marbles, 8 blue marbles, and 4 green marbles. If one marble is drawn at random, what is the probability that it is NOT blue?`;
          const formula = `P(\\text{NOT Blue}) = 1 - P(\\text{Blue}) = \\frac{\\text{Red + Green}}{\\text{Total}}`;
          const options = makeOptions(ans, `4/9`, `1/3`, `2/3`);
          qObj = {
            title: `Complementary Probability Marbles #${qIndex + 1}`,
            text, formula, options, answer: ans,
            hint: `Total marbles = 6 + 8 + 4 = 18. Non-blue marbles = 6 + 4 = 10. P(NOT blue) = 10 / 18 = 5 / 9.`,
            steps: [
              `**Step 1: Sum total marbles**`,
              `$$\\text{Total} = 6 + 8 + 4 = 18$$`,
              `**Step 2: Compute non-blue probability**`,
              `$$P = \\frac{10}{18} = \\frac{5}{9}$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: '', image_alt: '', difficulty: 2
          };
        } else if (subType === 5) { // Two coins toss sample space & at least 1 head
          const ans = `S = {HH, HT, TH, TT}, P(at least 1 Head) = 3/4`;
          const text = `List all outcomes in the sample space S when two fair coins are tossed simultaneously, and find the probability of obtaining at least one Head.`;
          const formula = `S = \\{HH, HT, TH, TT\\}, \\quad P(\\ge 1H) = \\frac{3}{4}`;
          const options = makeOptions(ans, `S = {HH, TT}, P = 1/2`, `S = {HH, HT, TH, TT}, P = 1/2`, `S = {H, T}, P = 3/4`);
          qObj = {
            title: `Two Coin Toss Sample Space #${qIndex + 1}`,
            text, formula, options, answer: ans,
            hint: `Sample space S has 4 outcomes: {HH, HT, TH, TT}. Outcomes with at least 1 Head = {HH, HT, TH} (3 of 4). P = 3/4.`,
            steps: [
              `**Step 1: Write sample space**`,
              `$$S = \\{HH, HT, TH, TT\\}$$`,
              `**Step 2: Identify favorable outcomes**`,
              `$$\\text{Favorable} = \\{HH, HT, TH\\} \\implies P = \\frac{3}{4}$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: '', image_alt: '', difficulty: 1
          };
        } else if (subType === 6) { // 8-sector spinner prime number
          // Sectors 1 to 8. Primes = {2, 3, 5, 7} => 4 out of 8 => 1/2
          const ans = `1/2`;
          const text = `A spinner is divided into 8 equal sectors numbered 1 to 8. Find the probability that the spinner lands on a prime number.`;
          const formula = `P = \\frac{\\text{Primes}}{8}`;
          const options = makeOptions(ans, `3/8`, `5/8`, `1/4`);
          qObj = {
            title: `Spinner Prime Probability #${qIndex + 1}`,
            text, formula, options, answer: ans,
            hint: `Prime numbers from 1 to 8 are 2, 3, 5, and 7 (4 numbers). P = 4 / 8 = 1 / 2.`,
            steps: [
              `**Step 1: Identify prime numbers**`,
              `$$\\text{Primes} = \\{2, 3, 5, 7\\} \\implies 4\\text{ numbers}$$`,
              `**Step 2: Divide by total sectors (8)**`,
              `$$P = \\frac{4}{8} = \\frac{1}{2}$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: '', image_alt: '', difficulty: 1
          };
        } else if (subType === 7) { // Survey sample volleyball probability
          // 150 students: 90 basketball, 40 volleyball, 20 neither => P(volleyball) = 40 / 150 = 4/15
          const ans = `4/15`;
          const text = `In a survey of 150 students, 90 play basketball, 40 play volleyball, and 20 play neither. What is the experimental probability that a randomly chosen student plays volleyball?`;
          const formula = `P = \\frac{40}{150}`;
          const options = makeOptions(ans, `3/5`, `2/15`, `1/3`);
          qObj = {
            title: `Student Survey Probability #${qIndex + 1}`,
            text, formula, options, answer: ans,
            hint: `Number of volleyball players = 40. Total students = 150. P = 40 / 150 = 4 / 15.`,
            steps: [
              `**Step 1: Express ratio**`,
              `$$P = \\frac{40}{150}$$`,
              `**Step 2: Simplify by dividing by 10**`,
              `$$P = \\frac{4}{15}$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: '', image_alt: '', difficulty: 2
          };
        } else if (subType === 8) { // Two dice sum of 8
          // Combinations for sum=8: (2,6), (3,5), (4,4), (5,3), (6,2) => 5 combinations out of 36
          const ans = `5/36`;
          const text = `Two fair six-sided dice are rolled simultaneously. Determine the theoretical probability that the sum of the numbers rolled is equal to 8.`;
          const formula = `P = \\frac{\\text{Pairs summing to 8}}{36}`;
          const options = makeOptions(ans, `4/36`, `6/36`, `1/6`);
          qObj = {
            title: `Two Dice Sum Probability #${qIndex + 1}`,
            text, formula, options, answer: ans,
            hint: `Pairs adding to 8: (2,6), (3,5), (4,4), (5,3), (6,2) -> 5 outcomes out of 36 possible. P = 5 / 36.`,
            steps: [
              `**Step 1: List favorable ordered pairs**`,
              `$$\\{(2,6), (3,5), (4,4), (5,3), (6,2)\\} \\implies 5\\text{ pairs}$$`,
              `**Step 2: Divide by total sample space (36)**`,
              `$$P = \\frac{5}{36}$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: '', image_alt: '', difficulty: 2
          };
        } else { // Probability without replacement (5 red, 3 white)
          // P(both red) = (5/8) * (4/7) = 20/56 = 5/14
          const ans = `5/14`;
          const text = `A box contains 5 red balls and 3 white balls. If two balls are drawn one after another without replacement, find the probability that both balls drawn are red.`;
          const formula = `P(R_1 \\cap R_2) = P(R_1) \\times P(R_2 | R_1)`;
          const options = makeOptions(ans, `25/64`, `15/56`, `5/28`);
          qObj = {
            title: `Without Replacement Probability #${qIndex + 1}`,
            text, formula, options, answer: ans,
            hint: `P(1st Red) = 5/8. After removing 1 red, 4 red remain out of 7 total. P(2nd Red) = 4/7. P = (5/8) * (4/7) = 20 / 56 = 5 / 14.`,
            steps: [
              `**Step 1: Compute P(1st Red)**`,
              `$$P(R_1) = \\frac{5}{8}$$`,
              `**Step 2: Compute P(2nd Red | 1st Red)**`,
              `$$P(R_2 | R_1) = \\frac{4}{7}$$`,
              `**Step 3: Multiply probabilities**`,
              `$$P = \\frac{5}{8} \\times \\frac{4}{7} = \\frac{20}{56} = \\frac{5}{14}$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: '', image_alt: '', difficulty: 3
          };
        }
      }

      // ==========================================
      // TOPIC 143 (T19): The Fundamental Counting Principle
      // ==========================================
      else if (topicId === 143) {
        if (subType === 0) { // Outfit choice FCP
          const shirts = 5, pants = 3, shoes = 2;
          const total = shirts * pants * shoes; // 30
          const ans = `${total} outfits`;
          const text = `A student can choose 1 shirt from ${shirts} colors, 1 pair of pants from ${pants} colors, and 1 pair of shoes from ${shoes} styles. Use the Fundamental Counting Principle to determine the total number of possible outfits.`;
          const formula = `N = n_1 \\times n_2 \\times n_3`;
          const options = makeOptions(ans, `${shirts + pants + shoes} outfits`, `10 outfits`, `60 outfits`);
          qObj = {
            title: `Outfit Combinations FCP #${qIndex + 1}`,
            text, formula, options, answer: ans,
            hint: `Multiply the number of choices for each item: ${shirts} * ${pants} * ${shoes} = ${total}.`,
            steps: [
              `**Step 1: Apply Fundamental Counting Principle**`,
              `$$N = ${shirts} \\times ${pants} \\times ${shoes}$$`,
              `**Step 2: Evaluate product**`,
              `$$N = 30\\text{ possible outfits}$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: '', image_alt: '', difficulty: 1
          };
        } else if (subType === 1) { // Lunch combo FCP
          const app = 4, main = 6, drink = 3;
          const total = app * main * drink; // 72
          const ans = `${total} combinations`;
          const text = `A restaurant offers a lunch combo consisting of 1 appetizer (out of ${app} choices), 1 main dish (out of ${main} choices), and 1 beverage (out of ${drink} choices). How many different meal combinations can a customer order?`;
          const formula = `N = n_{\\text{app}} \\times n_{\\text{main}} \\times n_{\\text{drink}}`;
          const options = makeOptions(ans, `13 combinations`, `48 combinations`, `144 combinations`);
          qObj = {
            title: `Restaurant Menu Combo #${qIndex + 1}`,
            text, formula, options, answer: ans,
            hint: `Multiply choices: ${app} * ${main} * ${drink} = ${total}.`,
            steps: [
              `**Step 1: Multiply choice counts**`,
              `$$N = 4 \\times 6 \\times 3 = 72$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: '', image_alt: '', difficulty: 1
          };
        } else if (subType === 2) { // 4-digit PIN with repetition
          const digits = 10, len = 4;
          const total = Math.pow(10, 4); // 10,000
          const ans = `${total.toLocaleString()} PINs`;
          const text = `A 4-digit security PIN is to be created using digits 0 through 9. How many possible PINs can be formed if repetition of digits is allowed?`;
          const formula = `N = 10^4`;
          const options = makeOptions(ans, `5,040 PINs`, `40 PINs`, `9,000 PINs`);
          qObj = {
            title: `PIN Code with Repetition #${qIndex + 1}`,
            text, formula, options, answer: ans,
            hint: `Since repetition is allowed, there are 10 choices for each of the 4 digit positions: 10^4 = 10,000.`,
            steps: [
              `**Step 1: Apply FCP for 4 positions with replacement**`,
              `$$N = 10 \\times 10 \\times 10 \\times 10 = 10^4$$`,
              `**Step 2: Evaluate**`,
              `$$N = 10,000\\text{ PINs}$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: '', image_alt: '', difficulty: 2
          };
        } else if (subType === 3) { // 4-digit PIN without repetition
          const total = 10 * 9 * 8 * 7; // 5,040
          const ans = `${total.toLocaleString()} PINs`;
          const text = `How many possible 4-digit security PINs can be formed using digits 0 through 9 if repetition of digits is NOT allowed?`;
          const formula = `P(10, 4) = 10 \\times 9 \\times 8 \\times 7`;
          const options = makeOptions(ans, `10,000 PINs`, `3,024 PINs`, `6,561 PINs`);
          qObj = {
            title: `PIN Code without Repetition #${qIndex + 1}`,
            text, formula, options, answer: ans,
            hint: `Position 1 has 10 options, position 2 has 9, position 3 has 8, position 4 has 7. N = 10 * 9 * 8 * 7 = 5,040.`,
            steps: [
              `**Step 1: Multiply choices for each position without replacement**`,
              `$$N = 10 \\times 9 \\times 8 \\times 7$$`,
              `**Step 2: Calculate product**`,
              `$$N = 5,040\\text{ PINs}$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: '', image_alt: '', difficulty: 2
          };
        } else if (subType === 4) { // 3-letter license code without repetition
          const letters = 6; // A, B, C, D, E, F
          const total = 6 * 5 * 4; // 120
          const ans = `${total} codes`;
          const text = `How many different 3-letter license codes can be formed using the letters A, B, C, D, E, F if each letter can only be used once in a code?`;
          const formula = `P(6, 3) = 6 \\times 5 \\times 4`;
          const options = makeOptions(ans, `216 codes`, `18 codes`, `360 codes`);
          qObj = {
            title: `Letter Code Permutations #${qIndex + 1}`,
            text, formula, options, answer: ans,
            hint: `1st letter: 6 choices, 2nd letter: 5 choices, 3rd letter: 4 choices. N = 6 * 5 * 4 = 120.`,
            steps: [
              `**Step 1: Compute permutation P(6, 3)**`,
              `$$N = 6 \\times 5 \\times 4 = 120$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: '', image_alt: '', difficulty: 2
          };
        } else if (subType === 5) { // Coin toss + 4-sided die tree diagram
          const total = 2 * 4; // 8
          const ans = `${total} combined outcomes`;
          const text = `Construct a tree diagram or use the FCP to determine all possible outcomes when a fair coin is tossed and a standard 4-sided die (numbered 1 to 4) is rolled. State the total number of combined outcomes.`;
          const formula = `N = 2 \\times 4`;
          const options = makeOptions(ans, `6 combined outcomes`, `16 combined outcomes`, `12 combined outcomes`);
          qObj = {
            title: `Combined Experiment Outcomes #${qIndex + 1}`,
            text, formula, options, answer: ans,
            hint: `Coin outcomes = 2 (H, T). Die outcomes = 4 (1, 2, 3, 4). Total combined outcomes = 2 * 4 = 8.`,
            steps: [
              `**Step 1: List coin and die outcomes**`,
              `$$\\text{Coin } \\in \\{H, T\\}, \\quad \\text{Die } \\in \\{1, 2, 3, 4\\}$$`,
              `**Step 2: Multiply outcomes**`,
              `$$N = 2 \\times 4 = 8$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: '', image_alt: '', difficulty: 1
          };
        } else if (subType === 6) { // Multiple-choice quiz answer ways
          const qCount = 5, choices = 4;
          const total = Math.pow(4, 5); // 1024
          const ans = `${total} ways`;
          const text = `A multiple-choice quiz contains 5 questions, each with 4 possible answer choices (A, B, C, D). In how many different ways can a student answer all 5 questions on the quiz?`;
          const formula = `N = 4^5`;
          const options = makeOptions(ans, `20 ways`, `625 ways`, `2,048 ways`);
          qObj = {
            title: `Quiz Answer Combinations #${qIndex + 1}`,
            text, formula, options, answer: ans,
            hint: `Each of the 5 questions has 4 choices: 4^5 = 1,024.`,
            steps: [
              `**Step 1: Apply FCP for 5 independent questions**`,
              `$$N = 4 \\times 4 \\times 4 \\times 4 \\times 4 = 4^5$$`,
              `**Step 2: Evaluate 4^5**`,
              `$$N = 1,024\\text{ ways}$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: '', image_alt: '', difficulty: 2
          };
        } else if (subType === 7) { // Club officer election permutations
          const n = 12, r = 4;
          const total = 12 * 11 * 10 * 9; // 11,880
          const ans = `${total.toLocaleString()} ways`;
          const text = `In a club of 12 members, in how many ways can a President, a Vice-President, a Secretary, and a Treasurer be elected if no member can hold more than one office?`;
          const formula = `P(12, 4) = 12 \\times 11 \\times 10 \\times 9`;
          const options = makeOptions(ans, `495 ways`, `20,736 ways`, `1,188 ways`);
          qObj = {
            title: `Officer Election Permutations #${qIndex + 1}`,
            text, formula, options, answer: ans,
            hint: `President: 12 choices, Vice-President: 11 choices, Secretary: 10 choices, Treasurer: 9 choices. N = 12 * 11 * 10 * 9 = 11,880.`,
            steps: [
              `**Step 1: Compute permutation P(12, 4)**`,
              `$$N = 12 \\times 11 \\times 10 \\times 9$$`,
              `**Step 2: Multiply values**`,
              `$$N = 11,880\\text{ ways}$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: '', image_alt: '', difficulty: 2
          };
        } else if (subType === 8) { // 4-digit even numbers from {1,2,3,4,5,6} without repetition
          // Last digit must be even: {2, 4, 6} (3 choices).
          // Remaining 3 positions chosen from remaining 5 digits: 5 * 4 * 3 = 60 choices.
          // Total = 3 * 60 = 180.
          const ans = `180 even numbers`;
          const text = `How many distinct 4-digit even numbers can be formed using the digits 1, 2, 3, 4, 5, 6 without repeating any digit in a number?`;
          const formula = `N = 3 \\times (5 \\times 4 \\times 3)`;
          const options = makeOptions(ans, `360 even numbers`, `120 even numbers`, `240 even numbers`);
          qObj = {
            title: `Constrained Even Number Permutations #${qIndex + 1}`,
            text, formula, options, answer: ans,
            hint: `First pick last digit (must be even: 2, 4, or 6 -> 3 choices). Then pick remaining 3 digits from 5 choices: 5 * 4 * 3 = 60. Total = 3 * 60 = 180.`,
            steps: [
              `**Step 1: Pick last digit (even)**`,
              `$$\\text{Choices for units digit } \\in \\{2, 4, 6\\} \\implies 3\\text{ choices}$$`,
              `**Step 2: Pick first 3 digits from 5 remaining**`,
              `$$5 \\times 4 \\times 3 = 60\\text{ ways}$$`,
              `**Step 3: Multiply**`,
              `$$N = 3 \\times 60 = 180$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: '', image_alt: '', difficulty: 3
          };
        } else { // Round-trip routes between cities without repeated paths
          // City A -> B (3 choices), B -> C (4 choices).
          // Return C -> B (3 choices left), B -> A (2 choices left).
          // Total = 3 * 4 * 3 * 2 = 72.
          const total = 3 * 4 * 3 * 2; // 72
          const ans = `${total} round-trip routes`;
          const text = `A traveler has 3 route choices from City A to City B, and 4 route choices from City B to City C. How many different round-trip routes from City A to City C and back to City A are possible if the traveler does not use the same route between cities on the return trip?`;
          const formula = `N = (3 \\times 4) \\times (3 \\times 2)`;
          const options = makeOptions(ans, `144 round-trip routes`, `14 round-trip routes`, `48 round-trip routes`);
          qObj = {
            title: `Round-Trip Route Permutations #${qIndex + 1}`,
            text, formula, options, answer: ans,
            hint: `A->B: 3 ways, B->C: 4 ways. C->B return: 3 ways left. B->A return: 2 ways left. Total = 3 * 4 * 3 * 2 = 72.`,
            steps: [
              `**Step 1: Outbound choices**`,
              `$$N_{\\text{out}} = 3 \\times 4 = 12$$`,
              `**Step 2: Return choices (without repeating)**`,
              `$$N_{\\text{return}} = 3 \\times 2 = 6$$`,
              `**Step 3: Multiply outbound and return**`,
              `$$N = 12 \\times 6 = 72\\text{ routes}$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: '', image_alt: '', difficulty: 3
          };
        }
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
          qObj.difficulty || 2
        );
        totalGenerated++;
      }
    }
  }

  console.log(`✅ Successfully generated and inserted ${totalGenerated} Grade 8 Data and Probability questions into SQLite qbank.db!`);

  // Export updated questions database to Excel
  exportQuestionsToExcel(db);

  console.log('🎉 Generation and Excel export completed successfully!');
}

if (process.argv[1] && process.argv[1].endsWith('generate_g8_data_probability.js')) {
  generateGrade8DataProbabilityQuestions();
}
