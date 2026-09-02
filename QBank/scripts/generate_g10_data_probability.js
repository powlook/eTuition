import { initDb } from '../server/db.js';
import { exportQuestionsToExcel } from '../server/excelService.js';
import { generateGrade10DpSvg } from './generate_g10_dp_svgs.js';
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

// Topic Mapping: Excel T13..T16 -> SQLite Topic ID 173..176
const topicMapping = {
  'T13': 173, // Box-and-whisker plots, cumulative frequency histograms & polygons
  'T14': 174, // Quartiles, deciles, percentiles, interquartile range, and outliers
  'T15': 175, // Evaluation of statistical reports
  'T16': 176  // Union and intersection of events, dependent and independent events
};

export function generateGrade10DataProbabilityQuestions() {
  console.log('🚀 Generating 200 Grade 10 Data & Probability Questions (Topics 173 to 176)...');

  // Read Excel Seed File
  const excelPath = path.join(__dirname, '..', 'resources', 'Grade_10_Math_Questions.xlsx');
  const wb = xlsx.readFile(excelPath);
  const sheet = wb.Sheets['Data and Probability (DP)'] || wb.Sheets['Data & Probability (DP)'];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  // Group questions by Excel topic code
  const excelQuestions = {};
  rows.slice(4).forEach(r => {
    if (r && r.length >= 5 && typeof r[0] === 'string' && r[0].startsWith('T')) {
      const itemID = r[0].trim();
      const tCode = itemID.split('-')[0]; // T13, T14, T15, T16
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
      const imageUrl = generateGrade10DpSvg(dbTopicId, idx, { title: `${dbTopicTitle} #${qNum}` });
      const imageAlt = `Diagram for Grade 10 ${dbTopicTitle} question #${qNum}`;

      // ==========================================
      // TOPIC 173: Box Plots & Cumulative Frequency
      // ==========================================
      if (dbTopicId === 173) {
        if (qNum === 1) {
          title = "Five-Number Summary Definition";
          text = "Define a box-and-whisker plot (box plot) and list the components of the five-number summary.";
          formula = "\\text{Five-Number Summary} = \\{ \\text{Minimum}, Q_1, \\text{Median } (Q_2), Q_3, \\text{Maximum} \\}";
          correctAnswer = "Minimum, Q₁, Median (Q₂), Q₃, and Maximum";
          options = makeOptions("Minimum, Q₁, Median (Q₂), Q₃, and Maximum", "Mean, Median, Mode, Range, and Standard Deviation", "Q₁, Q₂, Q₃, Q₄, and Q₅", "Lower Fence, Q₁, Mean, Q₃, Upper Fence");
          hint = "The box plot visually renders the five positional summary landmarks of a dataset.";
          steps = ["**Step 1:** Define five-number summary.", "$$\\text{Summary} = \\{ \\text{Min}, Q_1, \\text{Median}, Q_3, \\text{Max} \\}$$", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else if (qNum === 2) {
          title = "Five-Number Summary Calculation";
          text = "Given the dataset of 11 student quiz scores: \\([12, 14, 15, 18, 19, 20, 22, 23, 25, 27, 30]\\), determine the five-number summary.";
          formula = "\\text{Min} = 12, Q_1 = 15, \\text{Med} = 20, Q_3 = 25, \\text{Max} = 30";
          correctAnswer = "Min = 12, Q₁ = 15, Median = 20, Q₃ = 25, Max = 30";
          options = makeOptions("Min = 12, Q₁ = 15, Median = 20, Q₃ = 25, Max = 30", "Min = 12, Q₁ = 14, Median = 19, Q₃ = 27, Max = 30", "Min = 12, Q₁ = 18, Median = 20, Q₃ = 23, Max = 30", "Min = 10, Q₁ = 15, Median = 20, Q₃ = 25, Max = 35");
          hint = "The median is the 6th score (20). Q₁ is the median of lower half (15), Q₃ is median of upper half (25).";
          steps = [
            "**Step 1: Identify Min and Max** - Min = 12, Max = 30.",
            "**Step 2: Find Median (Q₂)** - 6th term = 20.",
            "**Step 3: Find Q₁ & Q₃** - Lower half [12, 14, 15, 18, 19] → Q₁ = 15. Upper half [22, 23, 25, 27, 30] → Q₃ = 25.",
            `**Final Answer:** \\(${correctAnswer}\\)`
          ];
        } else if (qNum === 6) {
          title = "1.5 × IQR Outlier Rule";
          text = "State the 1.5 × IQR Rule for calculating the lower fence and upper fence to identify statistical outliers.";
          formula = "\\text{Lower Fence} = Q_1 - 1.5(\\text{IQR}), \\quad \\text{Upper Fence} = Q_3 + 1.5(\\text{IQR})";
          correctAnswer = "Lower Fence = Q₁ - 1.5(IQR), Upper Fence = Q₃ + 1.5(IQR)";
          options = makeOptions("Lower Fence = Q₁ - 1.5(IQR), Upper Fence = Q₃ + 1.5(IQR)", "Lower Fence = Q₁ - 3(IQR), Upper Fence = Q₃ + 3(IQR)", "Lower Fence = Mean - 2(SD), Upper Fence = Mean + 2(SD)", "Lower Fence = Min - IQR, Upper Fence = Max + IQR");
          hint = "Outliers fall below Q₁ - 1.5(IQR) or above Q₃ + 1.5(IQR).";
          steps = ["**Step 1:** State outlier fence equations.", "$$\\text{LF} = Q_1 - 1.5(\\text{IQR}), \\quad \\text{UF} = Q_3 + 1.5(\\text{IQR})$$", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else if (qNum === 7) {
          title = "Outlier Boundaries Evaluation";
          text = "Given \\(Q_1 = 24\\) and \\(Q_3 = 40\\), calculate the \\(\\text{IQR}\\) and determine the lower and upper outlier boundaries.";
          formula = "\\text{IQR} = 40 - 24 = 16, \\quad \\text{LF} = 24 - 1.5(16) = 0, \\quad \\text{UF} = 40 + 1.5(16) = 64";
          correctAnswer = "IQR = 16, Lower Fence = 0, Upper Fence = 64";
          options = makeOptions("IQR = 16, Lower Fence = 0, Upper Fence = 64", "IQR = 16, Lower Fence = 8, Upper Fence = 56", "IQR = 64, Lower Fence = 12, Upper Fence = 48", "IQR = 16, Lower Fence = -8, Upper Fence = 72");
          hint = "IQR = 40 - 24 = 16. Lower fence = 24 - 1.5(16) = 0; Upper fence = 40 + 1.5(16) = 64.";
          steps = [
            "**Step 1: Compute IQR** - $$\\text{IQR} = 40 - 24 = 16$$",
            "**Step 2: Compute Fences** - $$\\text{LF} = 24 - 24 = 0, \\quad \\text{UF} = 40 + 24 = 64$$",
            `**Final Answer:** \\(${correctAnswer}\\)`
          ];
        } else {
          const q1 = 20 + (qNum % 15);
          const q3 = q1 + 10 + (qNum % 12);
          const iqr = q3 - q1;
          const med = Math.round((q1 + q3) / 2);

          title = `Box Plot IQR & Median #${qNum}`;
          text = `A box-and-whisker plot displays \\(Q_1 = ${q1}\\), \\(\\text{Median} = ${med}\\), and \\(Q_3 = ${q3}\\). Calculate the Interquartile Range (IQR).`;
          formula = `\\text{IQR} = Q_3 - Q_1 = ${q3} - ${q1} = ${iqr}`;
          correctAnswer = `IQR = ${iqr}`;
          options = makeOptions(`IQR = ${iqr}`, `IQR = ${q3 + q1}`, `IQR = ${med - q1}`, `IQR = ${q3 - med}`);
          hint = "IQR = Q₃ - Q₁.";
          steps = [
            `**Step 1:** Subtract Q₁ from Q₃: $$\\text{IQR} = ${q3} - ${q1} = ${iqr}$$`,
            `**Final Answer:** \\(${correctAnswer}\\)`
          ];
        }
      }

      // ==========================================
      // TOPIC 174: Position Measures & Outliers
      // ==========================================
      else if (dbTopicId === 174) {
        if (qNum === 1) {
          title = "Measures of Position Definition";
          text = "Define measures of position (fractiles/quantiles) in statistics and list the three primary types.";
          formula = "\\text{Quantiles: Quartiles (4), Deciles (10), Percentiles (100)}";
          correctAnswer = "Quartiles, Deciles, and Percentiles";
          options = makeOptions("Quartiles, Deciles, and Percentiles", "Mean, Median, and Mode", "Range, Variance, and Standard Deviation", "Min, Max, and Midrange");
          hint = "Quartiles divide data into 4 parts, deciles into 10 parts, percentiles into 100 parts.";
          steps = ["**Step 1:** State the three main position partition measures.", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else if (qNum === 3) {
          title = "Quartile Position Formula";
          text = "State the formula for finding the position of the \\(k\\)-th quartile \\(Q_k\\) in an ordered dataset of \\(n\\) values.";
          formula = "\\text{Position of } Q_k = \\frac{k(n + 1)}{4}";
          correctAnswer = "Position = k(n + 1) / 4";
          options = makeOptions("Position = k(n + 1) / 4", "Position = k · n / 10", "Position = (n + k) / 4", "Position = k(n - 1) / 4");
          hint = "Substitute k = 1, 2, 3 into \\(k(n+1)/4\\).";
          steps = ["**Step 1:** State quartile position formula.", "$$\\text{Position}(Q_k) = \\frac{k(n + 1)}{4}$$", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else if (qNum === 7) {
          title = "Calculating Quartiles Q₁, Q₂, Q₃";
          text = "Given the dataset of 12 ordered scores: \\([15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48]\\), calculate \\(Q_1, Q_2,\\) and \\(Q_3\\).";
          formula = "Q_1 = 22.5, \\quad Q_2 = 31.5, \\quad Q_3 = 40.5";
          correctAnswer = "Q₁ = 22.5, Q₂ = 31.5, Q₃ = 40.5";
          options = makeOptions("Q₁ = 22.5, Q₂ = 31.5, Q₃ = 40.5", "Q₁ = 21, Q₂ = 30, Q₃ = 42", "Q₁ = 24, Q₂ = 33, Q₃ = 45", "Q₁ = 20, Q₂ = 30, Q₃ = 40");
          hint = "Use linear interpolation for positions 3.25, 6.5, 9.75.";
          steps = [
            "**Step 1: Q₁ position** = 1(13)/4 = 3.25 → 3rd score + 0.25(4th - 3rd) = 21 + 0.25(3) = 22.5",
            "**Step 2: Q₂ position** = 2(13)/4 = 6.5 → (30 + 33)/2 = 31.5",
            "**Step 3: Q₃ position** = 3(13)/4 = 9.75 → 39 + 0.75(3) = 40.5",
            `**Final Answer:** \\(${correctAnswer}\\)`
          ];
        } else if (qNum === 12) {
          title = "Percentile Rank Formula";
          text = "State the standard formula for finding the percentile rank of a score \\(x\\) in a dataset of \\(n\\) values.";
          formula = "\\text{Percentile Rank} = \\left( \\frac{\\text{Count below } x + 0.5}{n} \\right) \\times 100\\%";
          correctAnswer = "Percentile Rank = [ (Count below x + 0.5) / n ] · 100%";
          options = makeOptions("Percentile Rank = [ (Count below x + 0.5) / n ] · 100%", "Percentile Rank = (x / n) · 100%", "Percentile Rank = (Count above x / n) · 100%", "Percentile Rank = (n - x) / 100");
          hint = "Includes half-count weight (0.5) for the score itself.";
          steps = ["**Step 1:** State percentile rank formula.", "$$\\text{PR} = \\left(\\frac{c + 0.5}{n}\\right) \\times 100\\%$$", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else {
          const nVal = 19;
          const posQ1 = (1 * (nVal + 1)) / 4;
          const posQ3 = (3 * (nVal + 1)) / 4;

          title = `Quartile Rank Position #${qNum}`;
          text = `In an ordered dataset of \\(n = ${nVal}\\) observations, determine the rank position of the first quartile \\(Q_1\\) and third quartile \\(Q_3\\).`;
          formula = `\\text{Position}(Q_1) = ${posQ1}, \\quad \\text{Position}(Q_3) = ${posQ3}`;
          correctAnswer = `Q₁ Position = ${posQ1}th, Q₃ Position = ${posQ3}rd`;
          options = makeOptions(`Q₁ Position = ${posQ1}th, Q₃ Position = ${posQ3}rd`, `Q₁ Position = ${posQ1 + 1}th, Q₃ Position = ${posQ3 + 1}rd`, `Q₁ Position = 4th, Q₃ Position = 12th`, `Q₁ Position = 5th, Q₃ Position = 15th`);
          hint = "Substitute n = 19 into k(n+1)/4.";
          steps = [
            `**Step 1:** \\(Q_1\\) Position = \\(1(20)/4 = 5\\)th observation.`,
            `**Step 2:** \\(Q_3\\) Position = \\(3(20)/4 = 15\\)th observation.`,
            `**Final Answer:** \\(${correctAnswer}\\)`
          ];
        }
      }

      // ==========================================
      // TOPIC 175: Evaluation of Statistical Reports
      // ==========================================
      else if (dbTopicId === 175) {
        if (qNum === 4) {
          title = "Voluntary Response Bias & Sample Size";
          text = "A social media poll with \\(10,000\\) respondents claims: '85% of citizens oppose policy X.' Explain why a large sample size does NOT compensate for voluntary response bias.";
          formula = "\\text{Bias} \\neq f(\\text{Sample Size})";
          correctAnswer = "Voluntary response samples suffer from self-selection bias (only motivated individuals respond), making them non-representative regardless of size.";
          options = makeOptions("Voluntary response samples suffer from self-selection bias (only motivated individuals respond), making them non-representative regardless of size.", "10,000 is too small a sample for any survey.", "Online polls automatically guarantee zero margin of error.", "Social media polls only sample elderly citizens.");
          hint = "Large biased samples yield highly precise but incorrect conclusions about the population.";
          steps = ["**Step 1:** Analyze sampling methodology (voluntary response).", "**Step 2:** Recognize self-selection bias distorts sample representativeness.", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else if (qNum === 6) {
          title = "Margin of Error & Statistical Dead Heat";
          text = "A political poll reports Candidate A at \\(48\\%\\) and Candidate B at \\(45\\%\\) with a margin of error of \\(\\pm 4\\%\\). Evaluate the news headline 'Candidate A leads the race'.";
          formula = "\\text{Candidate A: } [44\\%, 52\\%], \\quad \\text{Candidate B: } [41\\%, 49\\%]";
          correctAnswer = "Statistically unjustified headline because their confidence intervals overlap (statistical dead heat).";
          options = makeOptions("Statistically unjustified headline because their confidence intervals overlap (statistical dead heat).", "Headline is 100% confirmed true because 48% > 45%.", "Candidate B is guaranteed to win.", "The poll is invalid because percentages do not sum to 100%.");
          hint = "Account for margin of error: A is 44-52%, B is 41-49%. Intervals overlap.";
          steps = [
            "**Step 1: Compute interval for A** - $$48\\% \\pm 4\\% = [44\\%, 52\\%]$$",
            "**Step 2: Compute interval for B** - $$45\\% \\pm 4\\% = [41\\%, 49\\%]$$",
            "**Step 3: Analyze overlap** - Overlapping intervals mean no statistically significant lead exists.",
            `**Final Answer:** \\(${correctAnswer}\\)`
          ];
        } else if (qNum === 8) {
          title = "Correlation vs Causation Fallacy";
          text = "A report claims: 'Coffee consumption causes higher test scores' based on a strong positive correlation. Evaluate this claim.";
          formula = "\\text{Correlation } r > 0 \\not\\implies \\text{Causation}";
          correctAnswer = "Correlation does not imply causation; confounding variables (e.g., study hours) may explain the link.";
          options = makeOptions("Correlation does not imply causation; confounding variables (e.g., study hours) may explain the link.", "The claim is proven true whenever correlation r > 0.5.", "Coffee reduces memory capacity in all students.", "Correlation always proves direct cause and effect.");
          hint = "Observational correlation does not establish a cause-and-effect relationship.";
          steps = ["**Step 1:** Recall statistical principle: Correlation \\(\\neq\\) Causation.", "**Step 2:** Identify lurking/confounding variables.", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else if (qNum === 15) {
          title = "Pictogram Volume Distortion";
          text = "A pictogram graph compares annual sales by doubling both the height and width of a money bag graphic. By what factor did the visual surface area increase?";
          formula = "\\text{Area Factor} = 2 \\times 2 = 4";
          correctAnswer = "Visual area increased by a factor of 4 (400%), creating a 2x visual exaggeration.";
          options = makeOptions("Visual area increased by a factor of 4 (400%), creating a 2x visual exaggeration.", "Visual area increased by a factor of 2.", "Visual area stayed the same.", "Visual area increased by a factor of 8.");
          hint = "Scaling 1D dimensions by factor k increases 2D area by k² = 2² = 4.";
          steps = ["**Step 1: Apply scaling rule for 2D area** - $$\\text{Area Scale} = k^2 = 2^2 = 4$$", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else {
          title = "Evaluating Statistical Reports #" + qNum;
          text = `In a published survey of \\(n = 50\\) participants, an advertiser claims a product is effective based on a \\(p\\)-value of \\(0.04\\). What critical factor must be evaluated?`;
          formula = "p < 0.05 \\text{ vs Effect Size}";
          correctAnswer = "Whether the result has practical significance (effect size) in addition to statistical significance.";
          options = makeOptions("Whether the result has practical significance (effect size) in addition to statistical significance.", "That a p-value of 0.04 proves 100% certainty.", "That sample size 50 is infinitely large.", "That no control group was required.");
          hint = "Statistical significance (p < 0.05) does not guarantee meaningful real-world impact.";
          steps = [
            "**Step 1:** Distinguish statistical significance from practical effect size.",
            `**Final Answer:** \\(${correctAnswer}\\)`
          ];
        }
      }

      // ==========================================
      // TOPIC 176: Probability of Compound Events
      // ==========================================
      else if (dbTopicId === 176) {
        if (qNum === 3) {
          title = "Complement Rule of Probability";
          text = "Define complementary events and state the Complement Rule for probability \\(P(A')\\).";
          formula = "P(A') = 1 - P(A)";
          correctAnswer = "P(A') = 1 - P(A)";
          options = makeOptions("P(A') = 1 - P(A)", "P(A') = 1 / P(A)", "P(A') = P(A) - 1", "P(A') = P(A)^2");
          hint = "The sum of the probability of an event and its complement is 1.";
          steps = ["**Step 1:** State Complement Rule equation.", "$$P(A') = 1 - P(A)$$", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else if (qNum === 7) {
          title = "General Addition Rule of Probability";
          text = "State the General Addition Rule for finding the probability of the union of any two events \\(P(A \\cup B)\\).";
          formula = "P(A \\cup B) = P(A) + P(B) - P(A \\cap B)";
          correctAnswer = "P(A ∪ B) = P(A) + P(B) - P(A ∩ B)";
          options = makeOptions("P(A ∪ B) = P(A) + P(B) - P(A ∩ B)", "P(A ∪ B) = P(A) + P(B)", "P(A ∪ B) = P(A) · P(B)", "P(A ∪ B) = P(A ∩ B) / P(B)");
          hint = "Subtract the intersection \\(P(A \\cap B)\\) to prevent double counting.";
          steps = ["**Step 1:** Write General Addition Rule formula.", "$$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$$", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else if (qNum === 10) {
          title = "Union Probability Evaluation";
          text = "In a class of \\(45\\) students, \\(25\\) join Math Club, \\(18\\) join Science Club, and \\(8\\) join both. Find the probability that a student chosen at random belongs to Math or Science Club.";
          formula = "P(M \\cup S) = \\frac{25 + 18 - 8}{45} = \\frac{35}{45} = \\frac{7}{9}";
          correctAnswer = "35/45 = 7/9 (approx 0.778)";
          options = makeOptions("35/45 = 7/9 (approx 0.778)", "43/45", "8/45", "25/45");
          hint = "Use General Addition Rule: \\(n(M \\cup S) = 25 + 18 - 8 = 35\\).";
          steps = [
            "**Step 1: Compute number of students in union** - $$n(M \\cup S) = 25 + 18 - 8 = 35$$",
            "**Step 2: Compute probability** - $$P(M \\cup S) = \\frac{35}{45} = \\frac{7}{9}$$",
            `**Final Answer:** \\(${correctAnswer}\\)`
          ];
        } else if (qNum === 12) {
          title = "Independent Events Multiplication Rule";
          text = "Define independent events and state the Multiplication Rule for two independent events \\(A\\) and \\(B\\).";
          formula = "P(A \\cap B) = P(A) \\cdot P(B)";
          correctAnswer = "P(A ∩ B) = P(A) · P(B)";
          options = makeOptions("P(A ∩ B) = P(A) · P(B)", "P(A ∩ B) = P(A) + P(B)", "P(A ∩ B) = P(A) / P(B)", "P(A ∩ B) = 1 - P(A)");
          hint = "Events are independent if occurrence of one does not alter probability of the other.";
          steps = ["**Step 1:** State Multiplication Rule for independent events.", "$$P(A \\cap B) = P(A) \\cdot P(B)$$", `**Final Answer:** \\(${correctAnswer}\\)`];
        } else if (qNum === 16) {
          title = "Sampling With Replacement Probability";
          text = "A bag contains \\(6\\) red marbles, \\(4\\) blue marbles, and \\(5\\) green marbles (total 15). Two marbles are drawn with replacement. Find the probability that both are red.";
          formula = "P(R_1 \\cap R_2) = \\frac{6}{15} \\cdot \\frac{6}{15} = \\frac{36}{225} = \\frac{4}{25}";
          correctAnswer = "4/25 = 0.16";
          options = makeOptions("4/25 = 0.16", "1/7 = 0.143", "6/15 = 0.40", "12/225 = 0.053");
          hint = "With replacement, trials are independent: \\((6/15) \\times (6/15)\\).";
          steps = [
            "**Step 1: Probability of 1st red** - $$P(R_1) = \\frac{6}{15} = \\frac{2}{5}$$",
            "**Step 2: Probability of 2nd red** - $$P(R_2) = \\frac{6}{15} = \\frac{2}{5}$$",
            "**Step 3: Multiply** - $$P = \\frac{2}{5} \\times \\frac{2}{5} = \\frac{4}{25} = 0.16$$",
            `**Final Answer:** \\(${correctAnswer}\\)`
          ];
        } else if (qNum === 17) {
          title = "Sampling Without Replacement Probability";
          text = "A bag contains \\(6\\) red marbles, \\(4\\) blue marbles, and \\(5\\) green marbles (total 15). Two marbles are drawn without replacement. Find the probability that both are red.";
          formula = "P(R_1 \\cap R_2) = \\frac{6}{15} \\cdot \\frac{5}{14} = \\frac{30}{210} = \\frac{1}{7}";
          correctAnswer = "1/7 (approx 0.143)";
          options = makeOptions("1/7 (approx 0.143)", "4/25 = 0.160", "6/15 = 0.400", "2/15 = 0.133");
          hint = "Without replacement, trials are dependent: \\((6/15) \\times (5/14)\\).";
          steps = [
            "**Step 1: Probability of 1st red** - $$P(R_1) = \\frac{6}{15}$$",
            "**Step 2: Probability of 2nd red** - $$P(R_2 | R_1) = \\frac{5}{14}$$",
            "**Step 3: Multiply** - $$P = \\frac{6}{15} \\cdot \\frac{5}{14} = \\frac{30}{210} = \\frac{1}{7}$$",
            `**Final Answer:** \\(${correctAnswer}\\)`
          ];
        } else {
          const pA = 0.4 + (qNum % 4) * 0.1;
          const pB = 0.3 + (qNum % 3) * 0.1;
          const pIntersection = (pA * pB).toFixed(2);

          title = `Independent Events Probability #${qNum}`;
          text = `Events \\(A\\) and \\(B\\) are independent with \\(P(A) = ${pA.toFixed(1)}\\) and \\(P(B) = ${pB.toFixed(1)}\\). Calculate \\(P(A \\cap B)\\).`;
          formula = `P(A \\cap B) = ${pA.toFixed(1)} \\cdot ${pB.toFixed(1)} = ${pIntersection}`;
          correctAnswer = `${pIntersection}`;
          options = makeOptions(`${pIntersection}`, `${(pA + pB).toFixed(2)}`, `${(pA - pB).toFixed(2)}`, `${(1 - pA).toFixed(2)}`);
          hint = "For independent events, P(A ∩ B) = P(A) * P(B).";
          steps = [
            `**Step 1:** Multiply probabilities: $$P(A \\cap B) = ${pA.toFixed(1)} \\times ${pB.toFixed(1)} = ${pIntersection}$$`,
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

  console.log(`✅ Successfully inserted ${totalGenerated} Grade 10 DP questions into SQLite DB!`);

  // Sync to Excel Question Bank
  const excelOut = path.join(__dirname, '..', 'questions_bank.xlsx');
  exportQuestionsToExcel(db, excelOut);

  console.log('🎉 Grade 10 Data & Probability processing complete!');
}

generateGrade10DataProbabilityQuestions();
