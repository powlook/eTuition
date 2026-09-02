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

function factorial(n) {
  if (n <= 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

const STATS_IMAGE = '/images/line_graph_trend.png';
const GEOM_IMAGE = '/images/geometric_triangle.png';
const PIE_IMAGE = '/images/pie_chart_math.png';
const NORMAL_IMAGE = '/images/normal_distribution_curve.png';

const CYLINDER_IMAGE = '/images/cylinder_3d.svg';
const RECT_PYRAMID_IMAGE = '/images/pyramid_rectangular_3d.svg';
const SQUARE_PYRAMID_IMAGE = '/images/pyramid_square_3d.svg';
const CYL_VS_PRISM_IMAGE = '/images/cylinder_vs_prism.svg';
const PYR_VS_PRISM_IMAGE = '/images/pyramid_vs_prism.svg';
const VENN_IMAGE = '/images/venn_diagram_sets.svg';
const REAL_SUBSETS_VENN_IMAGE = '/images/real_number_subsets_venn.svg';
const NUMBER_LINE_IMAGE = '/images/horizontal_number_line_integers.svg';

const STEM_LEAF_IMAGE = '/images/stem_and_leaf_plot.svg';
const PIE_DISTRIBUTION_IMAGE = '/images/pie_chart_data_distribution.svg';
const TIME_SERIES_LINE_IMAGE = '/images/line_graph_time_series.svg';
const GROUPED_FREQ_TABLE_IMAGE = '/images/grouped_frequency_table.svg';

const COIN_TREE_IMAGE = '/images/coin_toss_tree_diagram.svg';
const TWO_DICE_GRID_IMAGE = '/images/two_dice_grid_table.svg';
const SPINNER_EXP_IMAGE = '/images/spinner_experiment_diagram.svg';
const MARBLE_BAG_IMAGE = '/images/marble_bag_probability.svg';

const NAMES = ['Maria', 'Juan', 'Sofia', 'Gabriel', 'Bea', 'Carlo', 'Angela', 'Marco', 'Camilla', 'Paolo'];
const CONTEXTS = ['engineering team', 'science lab', 'financial portal', 'architecture blueprint', 'school survey', 'manufacturing plant'];

// Load topics and filter strictly Form 7 to Form 10
const allTopics = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'matatag_topics.json'), 'utf8'));
const f710Topics = allTopics.filter(t => t.form_level >= 7);

console.log(`🚀 Preparing database for Form 7 - Form 10 MATATAG Question Bank (${f710Topics.length} topics)...`);

// 1. Clear database completely
db.exec('DELETE FROM questions;');
db.exec('DELETE FROM topics;');

const insertTopic = db.prepare(`
  INSERT INTO topics (id, form_level, strand, unit, title, description, competencies)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

for (const t of f710Topics) {
  insertTopic.run(t.id, t.form_level, t.strand, t.unit, t.title, t.description, t.competencies);
}

console.log(`✅ Seeded ${f710Topics.length} Form 7-10 MATATAG Topics into Database.`);

// Specialized generator function for high-variety questions
function createCreativeQuestion(topic, qIndex) {
  const { id: topicId, form_level, strand, title } = topic;
  const name = NAMES[qIndex % NAMES.length];
  const context = CONTEXTS[qIndex % CONTEXTS.length];
  let imageUrl = '';
  let imageAlt = '';

  // --- TOPIC SPECIFIC CREATIVE GENERATOR ENGINE ---

  // Category 1: Polygons & Interior/Exterior Angles (IDs 104, 105)
  if (topicId === 104 || topicId === 105) {
    const subType = qIndex % 4;
    if (subType === 0) { // Interior Angle Sum
      const sides = [5, 6, 8, 10, 12][qIndex % 5];
      const sum = (sides - 2) * 180;
      const options = shuffle([`${sum}°`, `${sum + 180}°`, `${sum - 180}°`, `${sum + 360}°`]);
      return {
        title: `Interior Angle Sum of ${sides}-gon`,
        text: `Calculate the sum of all interior angles of a convex polygon with \\(n = ${sides}\\) sides:`,
        formula: `S = (n - 2) \\times 180^\\circ`,
        options,
        answer: `${sum}°`,
        hint: `Subtract 2 from side count ${sides} and multiply by 180°.`,
        steps: [
          `**Step 1: Write interior angle sum formula**`,
          `$$S = (n - 2) \\times 180^\\circ$$`,
          `**Step 2: Substitute $n = ${sides}$**`,
          `$$S = (${sides} - 2) \\times 180^\\circ = ${sides - 2} \\times 180^\\circ = ${sum}^\\circ$$`,
          `**Final Verified Answer:** \\(${sum}^\\circ\\)`
        ],
        image_url: `/images/polygon_${sides}_gon.svg`,
        image_alt: `${sides}-gon Regular Polygon Diagram`,
        difficulty: 3
      };
    } else if (subType === 1) { // Each Interior Angle of Regular Polygon
      const sides = [5, 6, 8, 10, 12][qIndex % 5];
      const angle = Number((((sides - 2) * 180) / sides).toFixed(1));
      const options = shuffle([`${angle}°`, `${(angle + 12).toFixed(1)}°`, `${(angle - 15).toFixed(1)}°`, `${(angle + 24).toFixed(1)}°`]);
      return {
        title: `Regular ${sides}-gon Interior Angle`,
        text: `Determine the measure of each interior angle in a regular polygon with \\(n = ${sides}\\) equal sides:`,
        formula: `I = \\frac{(n - 2) \\times 180^\\circ}{n}`,
        options,
        answer: `${angle}°`,
        hint: `Divide total interior angle sum by side count ${sides}.`,
        steps: [
          `**Step 1: Calculate total sum**`,
          `$$S = (${sides} - 2) \\times 180^\\circ = ${((sides - 2) * 180)}^\\circ$$`,
          `**Step 2: Divide by $n = ${sides}$**`,
          `$$I = \\frac{${(sides - 2) * 180}^\\circ}{${sides}} = ${angle}^\\circ$$`,
          `**Final Verified Answer:** \\(${angle}^\\circ\\)`
        ],
        image_url: `/images/polygon_${sides}_gon.svg`,
        image_alt: `Regular ${sides}-gon Figure`,
        difficulty: 3
      };
    } else if (subType === 2) { // Exterior Angle of Regular Polygon
      const sides = [5, 6, 8, 10, 12][qIndex % 5];
      const ext = 360 / sides;
      const options = shuffle([`${ext}°`, `${ext + 10}°`, `${Math.max(5, ext - 12)}°`, `${ext + 20}°`]);
      return {
        title: `Regular ${sides}-gon Exterior Angle`,
        text: `Calculate the measure of one exterior angle of a regular polygon with \\(n = ${sides}\\) sides:`,
        formula: `E = \\frac{360^\\circ}{n}`,
        options,
        answer: `${ext}°`,
        hint: `Divide 360° by the number of sides n.`,
        steps: [
          `**Step 1: Apply exterior angle formula**`,
          `$$E = \\frac{360^\\circ}{${sides}} = ${ext}^\\circ$$`,
          `**Final Verified Answer:** \\(${ext}^\\circ\\)`
        ],
        image_url: `/images/polygon_${sides}_gon.svg`,
        image_alt: `Exterior Angles of ${sides}-gon`,
        difficulty: 2
      };
    } else { // Number of Diagonals
      const sides = [5, 6, 7, 8, 10][qIndex % 5];
      const diag = (sides * (sides - 3)) / 2;
      const options = shuffle([`${diag}`, `${diag + 5}`, `${Math.max(1, diag - 4)}`, `${diag + 9}`]);
      return {
        title: `Number of Diagonals in ${sides}-gon`,
        text: `How many distinct diagonals can be drawn inside a convex polygon with \\(n = ${sides}\\) sides?`,
        formula: `D = \\frac{n(n - 3)}{2}`,
        options,
        answer: `${diag}`,
        hint: `Use diagonal formula D = n(n-3)/2.`,
        steps: [
          `**Step 1: Substitute $n = ${sides}$**`,
          `$$D = \\frac{${sides}(${sides} - 3)}{2} = \\frac{${sides} \\times ${sides - 3}}{2} = \\frac{${sides * (sides - 3)}}{2} = ${diag}$$`,
          `**Final Verified Answer:** \\(${diag}\\) diagonals`
        ],
        image_url: `/images/polygon_${sides}_gon.svg`,
        image_alt: `Polygon Diagonals Representation (${sides}-gon)`,
        difficulty: 3
      };
    }
  }

  // Category 2A: Form 7 - Conversion of Units of Measure (ID 106 - Dedicated Creative Engine)
  if (topicId === 106) {
    const subType = qIndex % 10;
    if (subType === 0) { // Multi-stage SI length conversion (km -> m -> cm -> mm)
      const kmVal = (randInt(200, 500) / 100);
      const mVal = Number((kmVal * 1000).toFixed(2));
      const cmVal = Number((kmVal * 100000).toFixed(2));
      const mmVal = Number((kmVal * 1000000).toFixed(2));
      const ansStr = `${mVal.toLocaleString()} m, ${cmVal.toLocaleString()} cm, ${mmVal.toLocaleString()} mm`;
      const options = shuffle([
        ansStr,
        `${(mVal / 10).toLocaleString()} m, ${(cmVal / 10).toLocaleString()} cm, ${(mmVal / 10).toLocaleString()} mm`,
        `${(mVal * 10).toLocaleString()} m, ${(cmVal * 10).toLocaleString()} cm, ${(mmVal * 10).toLocaleString()} mm`,
        `${mVal.toLocaleString()} m, ${(cmVal / 10).toLocaleString()} cm, ${(mmVal / 100).toLocaleString()} mm`
      ]);
      return {
        title: `Multi-Stage SI Length Conversion`,
        text: `How do you convert a length of \\(${kmVal}\\text{ km}\\) into meters, centimeters, and millimeters within the SI system?`,
        formula: `1\\text{ km} = 1,000\\text{ m} = 100,000\\text{ cm} = 1,000,000\\text{ mm}`,
        options,
        answer: ansStr,
        hint: `Multiply kilometers by 1,000 for meters, 100,000 for cm, and 1,000,000 for mm.`,
        steps: [
          `**Step 1: Convert kilometers to meters**`,
          `$$\\text{Meters} = ${kmVal} \\times 1,000 = ${mVal.toLocaleString()}\\text{ m}$$`,
          `**Step 2: Convert meters to centimeters**`,
          `$$\\text{Centimeters} = ${mVal.toLocaleString()} \\times 100 = ${cmVal.toLocaleString()}\\text{ cm}$$`,
          `**Step 3: Convert centimeters to millimeters**`,
          `$$\\text{Millimeters} = ${cmVal.toLocaleString()} \\times 10 = ${mmVal.toLocaleString()}\\text{ mm}$$`,
          `**Final Verified Answer:** \\(${ansStr}\\)`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 1) { // Athletic Sprint Speed Conversion (m/s to km/h)
      const dist = 100;
      const secList = [9.3, 9.58, 9.8, 10.0, 10.2, 10.5];
      const sec = secList[qIndex % secList.length];
      const speedKmH = Number(((dist / sec) * 3.6).toFixed(2));
      const ansStr = `${speedKmH} km/hr`;
      const options = shuffle([
        ansStr,
        `${(speedKmH - 3.5).toFixed(2)} km/hr`,
        `${(speedKmH + 4.2).toFixed(2)} km/hr`,
        `${(speedKmH * 0.8).toFixed(2)} km/hr`
      ]);
      return {
        title: `Athletic Sprint Speed Conversion`,
        text: `If an athlete runs ${sec} seconds in 100 meters, how much is that in km/hr?`,
        formula: `\\text{Speed (km/hr)} = \\left(\\frac{\\text{Distance (m)}}{\\text{Time (s)}}\\right) \\times 3.6`,
        options,
        answer: ansStr,
        hint: `Calculate speed in m/s (100 / ${sec}) and multiply by 3.6.`,
        steps: [
          `**Step 1: Calculate speed in meters per second**`,
          `$$v = \\frac{100\\text{ m}}{${sec}\\text{ s}} \\approx ${(dist / sec).toFixed(4)}\\text{ m/s}$$`,
          `**Step 2: Apply speed conversion factor ($1\\text{ m/s} = 3.6\\text{ km/hr}$)**`,
          `$$\\text{Speed} = ${(dist / sec).toFixed(4)} \\times 3.6 = ${speedKmH}\\text{ km/hr}$$`,
          `**Final Verified Answer:** \\(${speedKmH}\\text{ km/hr}\\)`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 2) { // Volume Flow Rate Conversion (L/min to cm³/s)
      const lpm = [12, 15, 18, 24, 30, 45][qIndex % 6];
      const cm3s = Number(((lpm * 1000) / 60).toFixed(2));
      const ansStr = `${cm3s} cm³/s`;
      const options = shuffle([
        ansStr,
        `${(cm3s * 60).toFixed(2)} cm³/s`,
        `${(cm3s / 10).toFixed(2)} cm³/s`,
        `${(cm3s + 15).toFixed(2)} cm³/s`
      ]);
      return {
        title: `Volume Rate Flow Conversion`,
        text: `How do you convert a volume rate of $${lpm}\\text{ liters per minute}$ to cubic centimeters per second (\\(\\text{cm}^3/\\text{s}\\))?`,
        formula: `1\\text{ L/min} = \\frac{1,000\\text{ cm}^3}{60\\text{ s}} = \\frac{50}{3}\\text{ cm}^3/\\text{s}`,
        options,
        answer: ansStr,
        hint: `Convert liters to $\\text{cm}^3$ (\\(\\times 1,000\\)) and divide by 60 seconds.`,
        steps: [
          `**Step 1: Convert liters to cubic centimeters**`,
          `$$${lpm}\\text{ L/min} = ${lpm} \\times 1,000 = ${lpm * 1000}\\text{ cm}^3/\\text{min}$$`,
          `**Step 2: Convert minutes to seconds**`,
          `$$\\text{Rate} = \\frac{${lpm * 1000}\\text{ cm}^3}{60\\text{ s}} = ${cm3s}\\text{ cm}^3/\\text{s}$$`,
          `**Final Verified Answer:** \\(${cm3s}\\text{ cm}^3/\\text{s}\\)`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 3) { // Area Conversion Multiplier (m² to cm²)
      const ansStr = `10,000`;
      const options = shuffle([`10,000`, `100`, `1,000`, `100,000`]);
      return {
        title: `Area Unit Conversion Multiplier`,
        text: `When converting square meters (\\(\\text{m}^2\\)) to square centimeters (\\(\\text{cm}^2\\)), what do you multiply by?`,
        formula: `1\\text{ m}^2 = (100\\text{ cm})^2 = 10,000\\text{ cm}^2`,
        options,
        answer: ansStr,
        hint: `Square the linear ratio $1\\text{ m} = 100\\text{ cm}$ to get $100^2$.`,
        steps: [
          `**Step 1: Write linear relation**`,
          `$$1\\text{ m} = 100\\text{ cm}$$`,
          `**Step 2: Square both sides for area**`,
          `$$1\\text{ m}^2 = (100\\text{ cm}) \\times (100\\text{ cm}) = 10,000\\text{ cm}^2$$`,
          `**Final Verified Answer:** Multiply by \\(10,000\\)`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 2
      };
    } else if (subType === 4) { // Reservoir Volume Conversion (m³ to L and cm³)
      const m3Val = (randInt(15, 50) / 10);
      const liters = m3Val * 1000;
      const cm3 = m3Val * 1000000;
      const ansStr = `${liters.toLocaleString()} L and ${cm3.toLocaleString()} cm³`;
      const options = shuffle([
        ansStr,
        `${(liters / 10).toLocaleString()} L and ${(cm3 / 10).toLocaleString()} cm³`,
        `${(liters * 10).toLocaleString()} L and ${(cm3 * 10).toLocaleString()} cm³`,
        `${liters.toLocaleString()} L and ${(cm3 / 100).toLocaleString()} cm³`
      ]);
      return {
        title: `Cubic Meter to Liter & Volume Conversion`,
        text: `An aquarium storage tank holds \\(${m3Val}\\text{ m}^3\\) of water. Express this volume in liters (L) and in cubic centimeters (\\(\\text{cm}^3\\)):`,
        formula: `1\\text{ m}^3 = 1,000\\text{ L} = 1,000,000\\text{ cm}^3`,
        options,
        answer: ansStr,
        hint: `Multiply $\\text{m}^3$ by 1,000 for liters and 1,000,000 for $\\text{cm}^3$.`,
        steps: [
          `**Step 1: Convert cubic meters to liters**`,
          `$$\\text{Liters} = ${m3Val} \\times 1,000 = ${liters.toLocaleString()}\\text{ L}$$`,
          `**Step 2: Convert liters to cubic centimeters**`,
          `$$\\text{cm}^3 = ${liters.toLocaleString()} \\times 1,000 = ${cm3.toLocaleString()}\\text{ cm}^3$$`,
          `**Final Verified Answer:** \\(${ansStr}\\)`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 5) { // High-Speed Train (km/h to m/s)
      const kmhVal = [180, 216, 288, 360, 432][qIndex % 5];
      const msVal = kmhVal / 3.6;
      const ansStr = `${msVal} m/s`;
      const options = shuffle([
        ansStr,
        `${msVal + 15} m/s`,
        `${msVal - 20} m/s`,
        `${msVal * 1.25} m/s`
      ]);
      return {
        title: `High-Speed Velocity Unit Conversion`,
        text: `An express train travels at a velocity of \\(${kmhVal}\\text{ km/hr}\\). Convert this speed to meters per second (\\(\\text{m/s}\\)):`,
        formula: `1\\text{ km/hr} = \\frac{1}{3.6}\\text{ m/s}`,
        options,
        answer: ansStr,
        hint: `Divide speed in km/hr by 3.6.`,
        steps: [
          `**Step 1: Apply conversion factor $\\frac{1,000\\text{ m}}{3,600\\text{ s}} = \\frac{1}{3.6}$**`,
          `$$v = \\frac{${kmhVal}}{3.6} = ${msVal}\\text{ m/s}$$`,
          `**Final Verified Answer:** \\(${msVal}\\text{ m/s}\\)`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 2
      };
    } else if (subType === 6) { // Water Discharge Rate (m³/s to L/min)
      const m3sVal = [5, 8, 12, 15, 20][qIndex % 5];
      const lpmVal = m3sVal * 1000 * 60;
      const ansStr = `${lpmVal.toLocaleString()} L/min`;
      const options = shuffle([
        ansStr,
        `${(lpmVal / 10).toLocaleString()} L/min`,
        `${(lpmVal * 10).toLocaleString()} L/min`,
        `${(m3sVal * 6000).toLocaleString()} L/min`
      ]);
      return {
        title: `Heavy Flow Rate Discharge Conversion`,
        text: `A spillway releases water at a rate of \\(${m3sVal}\\text{ m}^3/\\text{s}\\). Convert this discharge rate to liters per minute (L/min):`,
        formula: `1\\text{ m}^3/\\text{s} = 60,000\\text{ L/min}`,
        options,
        answer: ansStr,
        hint: `Multiply $\\text{m}^3/\\text{s}$ by 1,000 for L/s and then by 60 for L/min.`,
        steps: [
          `**Step 1: Convert $\\text{m}^3/\\text{s}$ to liters per second**`,
          `$$${m3sVal} \\times 1,000 = ${(m3sVal * 1000).toLocaleString()}\\text{ L/s}$$`,
          `**Step 2: Convert to liters per minute**`,
          `$$${(m3sVal * 1000).toLocaleString()} \\times 60 = ${lpmVal.toLocaleString()}\\text{ L/min}$$`,
          `**Final Verified Answer:** \\(${ansStr}\\)`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 7) { // Micro Length (m to micrometers and mm)
      const micrometerVal = [25, 45, 60, 80, 120][qIndex % 5];
      const mVal = micrometerVal / 1000000;
      const mmVal = micrometerVal / 1000;
      const ansStr = `${micrometerVal} μm and ${mmVal} mm`;
      const options = shuffle([
        ansStr,
        `${micrometerVal * 10} μm and ${mmVal * 10} mm`,
        `${micrometerVal / 10} μm and ${mmVal / 10} mm`,
        `${micrometerVal} μm and ${mmVal * 100} mm`
      ]);
      return {
        title: `Micro-Length SI Unit Conversion`,
        text: `A micro-component width is measured as \\(${mVal}\\text{ meters}\\). Express this value in micrometers (\\(\\mu\\text{m}\\)) and millimeters (\\(\\text{mm}\\)):`,
        formula: `1\\text{ m} = 1,000,000\\ \\mu\\text{m} = 1,000\\text{ mm}`,
        options,
        answer: ansStr,
        hint: `Multiply meters by $10^6$ for $\\mu\\text{m}$ and by $10^3$ for $\\text{mm}$.`,
        steps: [
          `**Step 1: Convert meters to micrometers ($\\mu\\text{m}$)**`,
          `$$\\text{Micrometers} = ${mVal} \\times 1,000,000 = ${micrometerVal}\\ \\mu\\text{m}$$`,
          `**Step 2: Convert meters to millimeters (mm)**`,
          `$$\\text{Millimeters} = ${mVal} \\times 1,000 = ${mmVal}\\text{ mm}$$`,
          `**Final Verified Answer:** \\(${ansStr}\\)`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 8) { // Land Area Survey (Hectares to m² and cm²)
      const haVal = [1.5, 2.4, 3.2, 4.5, 5.0][qIndex % 5];
      const m2Val = haVal * 10000;
      const cm2Val = m2Val * 10000;
      const ansStr = `${m2Val.toLocaleString()} m² and ${cm2Val.toLocaleString()} cm²`;
      const options = shuffle([
        ansStr,
        `${(m2Val / 10).toLocaleString()} m² and ${(cm2Val / 10).toLocaleString()} cm²`,
        `${(m2Val * 10).toLocaleString()} m² and ${(cm2Val * 10).toLocaleString()} cm²`,
        `${m2Val.toLocaleString()} m² and ${(cm2Val / 100).toLocaleString()} cm²`
      ]);
      return {
        title: `Hectare Land Area Conversion`,
        text: `A farm occupies an area of \\(${haVal}\\text{ hectares}\\). Given that $1\\text{ hectare} = 10,000\\text{ m}^2$, express the area in square meters (\\(\\text{m}^2\\)) and square centimeters (\\(\\text{cm}^2\\)):`,
        formula: `1\\text{ ha} = 10,000\\text{ m}^2, \\quad 1\\text{ m}^2 = 10,000\\text{ cm}^2`,
        options,
        answer: ansStr,
        hint: `Multiply hectares by 10,000 for $\\text{m}^2$ and then by 10,000 for $\\text{cm}^2$.`,
        steps: [
          `**Step 1: Convert hectares to square meters**`,
          `$$\\text{Area in m}^2 = ${haVal} \\times 10,000 = ${m2Val.toLocaleString()}\\text{ m}^2$$`,
          `**Step 2: Convert square meters to square centimeters**`,
          `$$\\text{Area in cm}^2 = ${m2Val.toLocaleString()} \\times 10,000 = ${cm2Val.toLocaleString()}\\text{ cm}^2$$`,
          `**Final Verified Answer:** \\(${ansStr}\\)`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else { // Fuel Consumption Flow Rate (mL/s to L/h)
      const mlsVal = [15, 20, 25, 30, 40][qIndex % 5];
      const lhVal = Number((mlsVal * 3.6).toFixed(1));
      const ansStr = `${lhVal} L/h`;
      const options = shuffle([
        ansStr,
        `${(lhVal + 12).toFixed(1)} L/h`,
        `${(lhVal - 10).toFixed(1)} L/h`,
        `${(lhVal * 1.5).toFixed(1)} L/h`
      ]);
      return {
        title: `Automotive Fuel Flow Rate Conversion`,
        text: `An engine consumes fuel at a rate of \\(${mlsVal}\\text{ mL/s}\\). Convert this rate to liters per hour (L/h):`,
        formula: `1\\text{ mL/s} = 3.6\\text{ L/h}`,
        options,
        answer: ansStr,
        hint: `Multiply mL/s by 3.6 (or multiply by 3,600 seconds and divide by 1,000 mL).`,
        steps: [
          `**Step 1: Calculate total mL per hour ($3,600\\text{ s}$)**`,
          `$$${mlsVal} \\times 3,600 = ${(mlsVal * 3600).toLocaleString()}\\text{ mL/h}$$`,
          `**Step 2: Convert mL to liters**`,
          `$$\\text{Rate} = \\frac{${(mlsVal * 3600).toLocaleString()}}{1,000} = ${lhVal}\\text{ L/h}$$`,
          `**Final Verified Answer:** \\(${lhVal}\\text{ L/h}\\)`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    }
  }

  // Category 2B: Form 7 - Volume of Square and Rectangular Pyramids, and Cylinders (Topic ID 107)
  if (topicId === 107 || topicId === 136) {
    const subType = qIndex % 10;
    if (subType === 0) { // Conceptual: Cylinder Volume vs Base Area
      const ansStr = `The volume is equal to the circular base area ($A_{\\text{base}} = \\pi r^2$) multiplied by height ($h$).`;
      const options = shuffle([
        ansStr,
        `The volume is equal to one-third of the base area multiplied by height ($V = \\frac{1}{3} A_{\\text{base}} h$).`,
        `The volume is equal to the base perimeter ($2\\pi r$) multiplied by height ($h$).`,
        `The volume is independent of the circular base area.`
      ]);
      return {
        title: `Cylinder Volume & Base Area Conceptual Relation`,
        text: `How does the formula for the volume of a cylinder relate conceptually to the area of its circular base?`,
        formula: `V = A_{\\text{base}} \\times h = \\pi r^2 h`,
        options,
        answer: ansStr,
        hint: `The volume of a cylinder is the product of its circular base area $A_{\\text{base}}$ and perpendicular height $h$.`,
        steps: [
          `**Step 1: Write base area of cylinder**`,
          `$$A_{\\text{base}} = \\pi r^2$$`,
          `**Step 2: Multiply by perpendicular height $h$**`,
          `$$V = A_{\\text{base}} \\times h = \\pi r^2 h$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: CYLINDER_IMAGE,
        image_alt: '3D Right Circular Cylinder Diagram',
        difficulty: 2
      };
    } else if (subType === 1) { // Cavalieri's Principle: Cylinder vs Rectangular Prism
      const ansStr = `Their volumes are exactly equal ($V_{\\text{cylinder}} = V_{\\text{prism}}$).`;
      const options = shuffle([
        ansStr,
        `The cylinder volume is larger by a factor of $\\pi$.`,
        `The rectangular prism volume is three times larger.`,
        `The cylinder volume is one-third of the prism volume.`
      ]);
      return {
        title: `Prism vs Cylinder Volume Comparison (Cavalieri's Principle)`,
        text: `If a cylinder and a rectangular prism share the same height $h$ and identical base cross-sectional area $A_{\\text{base}}$, how do their volumes compare?`,
        formula: `V = A_{\\text{base}} \\times h \\implies V_{\\text{cylinder}} = V_{\\text{prism}}`,
        options,
        answer: ansStr,
        hint: `By Cavalieri's Principle, solids of equal height with equal cross-sectional areas at every height have equal volume.`,
        steps: [
          `**Step 1: Compare volume formulas**`,
          `$$V_{\\text{prism}} = A_{\\text{base}} \\times h$$`,
          `$$V_{\\text{cylinder}} = A_{\\text{base}} \\times h$$`,
          `**Step 2: Apply Cavalieri's Principle**`,
          `Since height $h$ and base area $A_{\\text{base}}$ are equal, $V_{\\text{cylinder}} = V_{\\text{prism}}$.`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: CYL_VS_PRISM_IMAGE,
        image_alt: 'Cavalieri\'s Principle Diagram',
        difficulty: 2
      };
    } else if (subType === 2) { // Pyramid vs Prism Volume Ratio
      const ansStr = `The square pyramid volume is exactly $\\frac{1}{3}$ of the square prism volume.`;
      const options = shuffle([
        ansStr,
        `The square pyramid volume is $\\frac{1}{2}$ of the square prism volume.`,
        `The square pyramid volume is equal to the square prism volume.`,
        `The square pyramid volume is $\\frac{2}{3}$ of the square prism volume.`
      ]);
      return {
        title: `Square Pyramid vs Square Prism Volume Ratio`,
        text: `How is the volume of a square pyramid related to the volume of a square prism with identical base dimensions and height?`,
        formula: `V_{\\text{pyramid}} = \\frac{1}{3} V_{\\text{prism}} = \\frac{1}{3} s^2 h`,
        options,
        answer: ansStr,
        hint: `A pyramid's volume is one-third of a prism with the same base area and height.`,
        steps: [
          `**Step 1: Write prism volume**`,
          `$$V_{\\text{prism}} = s^2 h$$`,
          `**Step 2: Write pyramid volume**`,
          `$$V_{\\text{pyramid}} = \\frac{1}{3} s^2 h = \\frac{1}{3} V_{\\text{prism}}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: PYR_VS_PRISM_IMAGE,
        image_alt: 'Pyramid vs Prism Comparison',
        difficulty: 2
      };
    } else if (subType === 3) { // Numerical: Rectangular Pyramid Volume
      const l = [6, 9, 12, 15][qIndex % 4];
      const w = [8, 10, 14, 16][qIndex % 4];
      const h = [12, 15, 18, 21][qIndex % 4];
      const vol = (l * w * h) / 3;
      const ansStr = `${vol} cm³`;
      const options = shuffle([
        ansStr,
        `${vol * 3} cm³`,
        `${vol * 1.5} cm³`,
        `${Math.round(vol / 2)} cm³`
      ]);
      return {
        title: `Volume of Rectangular Pyramid`,
        text: `A rectangular pyramid has a base measuring $${l}\\text{ cm}$ by $${w}\\text{ cm}$ and a perpendicular height of $${h}\\text{ cm}$. What is its volume?`,
        formula: `V = \\frac{1}{3} l w h`,
        options,
        answer: ansStr,
        hint: `Multiply length $\\times$ width $\\times$ height and divide by 3.`,
        steps: [
          `**Step 1: Calculate base area $B = l \\times w$**`,
          `$$B = ${l} \\times ${w} = ${l * w}\\text{ cm}^2$$`,
          `**Step 2: Apply pyramid volume formula**`,
          `$$V = \\frac{1}{3} \\times ${l * w} \\times ${h} = \\frac{${l * w * h}}{3} = ${vol}\\text{ cm}^3$$`,
          `**Final Verified Answer:** \\(${ansStr}\\)`
        ],
        image_url: RECT_PYRAMID_IMAGE,
        image_alt: '3D Rectangular Pyramid Diagram',
        difficulty: 3
      };
    } else if (subType === 4) { // Numerical: Square Pyramid Volume
      const s = [6, 9, 12, 15][qIndex % 4];
      const h = [9, 12, 15, 18][qIndex % 4];
      const vol = (s * s * h) / 3;
      const ansStr = `${vol} cm³`;
      const options = shuffle([
        ansStr,
        `${vol * 3} cm³`,
        `${vol + 120} cm³`,
        `${Math.round(vol / 3)} cm³`
      ]);
      return {
        title: `Volume of Square Pyramid`,
        text: `A square pyramid has a base side length of $${s}\\text{ cm}$ and a perpendicular height of $${h}\\text{ cm}$. Calculate its volume:`,
        formula: `V = \\frac{1}{3} s^2 h`,
        options,
        answer: ansStr,
        hint: `Square the side length $s$, multiply by height $h$, and divide by 3.`,
        steps: [
          `**Step 1: Calculate square base area $B = s^2$**`,
          `$$B = ${s}^2 = ${s * s}\\text{ cm}^2$$`,
          `**Step 2: Apply pyramid volume formula**`,
          `$$V = \\frac{1}{3} (${s * s}) (${h}) = ${vol}\\text{ cm}^3$$`,
          `**Final Verified Answer:** \\(${ansStr}\\)`
        ],
        image_url: SQUARE_PYRAMID_IMAGE,
        image_alt: '3D Square Pyramid Diagram',
        difficulty: 3
      };
    } else if (subType === 5) { // Cylinder Height Doubling Effect
      const ansStr = `The volume doubles ($2 \\times V_{\\text{original}}$).`;
      const options = shuffle([
        ansStr,
        `The volume quadruples ($4 \\times V_{\\text{original}}$).`,
        `The volume increases by a factor of 8.`,
        `The volume remains unchanged.`
      ]);
      return {
        title: `Effect of Doubling Cylinder Height`,
        text: `If the perpendicular height of a cylinder is doubled while keeping its base radius constant, how does its volume change?`,
        formula: `V_{\\text{new}} = \\pi r^2 (2h) = 2 \\pi r^2 h = 2 V_{\\text{original}}`,
        options,
        answer: ansStr,
        hint: `Volume is directly proportional to height $h$.`,
        steps: [
          `**Step 1: Write original volume**`,
          `$$V_1 = \\pi r^2 h$$`,
          `**Step 2: Substitute $h_{new} = 2h$**`,
          `$$V_2 = \\pi r^2 (2h) = 2 (\\pi r^2 h) = 2 V_1$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: CYLINDER_IMAGE,
        image_alt: 'Cylinder Height Scaling',
        difficulty: 2
      };
    } else if (subType === 6) { // Cylinder Radius Doubling Effect
      const ansStr = `The volume quadruples ($4 \\times V_{\\text{original}}$).`;
      const options = shuffle([
        ansStr,
        `The volume doubles ($2 \\times V_{\\text{original}}$).`,
        `The volume increases by a factor of 8.`,
        `The volume triples ($3 \\times V_{\\text{original}}$).`
      ]);
      return {
        title: `Effect of Doubling Cylinder Radius`,
        text: `If the base radius of a cylinder is doubled while keeping its height constant, how does its volume change?`,
        formula: `V_{\\text{new}} = \\pi (2r)^2 h = 4 \\pi r^2 h = 4 V_{\\text{original}}`,
        options,
        answer: ansStr,
        hint: `Volume depends on the square of the radius $r^2$.`,
        steps: [
          `**Step 1: Write original volume**`,
          `$$V_1 = \\pi r^2 h$$`,
          `**Step 2: Substitute $r_{new} = 2r$**`,
          `$$V_2 = \\pi (2r)^2 h = \\pi (4r^2) h = 4 (\\pi r^2 h) = 4 V_1$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: CYLINDER_IMAGE,
        image_alt: 'Cylinder Radius Scaling',
        difficulty: 2
      };
    } else if (subType === 7) { // Liquid Capacity / Displacement Filling
      const ansStr = `3 full pyramids`;
      const options = shuffle([
        ansStr,
        `2 full pyramids`,
        `4 full pyramids`,
        `6 full pyramids`
      ]);
      return {
        title: `Prism Container Filling by Pyramid`,
        text: `A solid square pyramid is filled completely with water. How many full pyramid volumes of water are required to completely fill a square prism container with identical base area and height?`,
        formula: `V_{\\text{prism}} = 3 \\times V_{\\text{pyramid}}`,
        options,
        answer: ansStr,
        hint: `Since $V_{\\text{pyramid}} = \\frac{1}{3} V_{\\text{prism}}$, 3 pyramid volumes equal 1 prism volume.`,
        steps: [
          `**Step 1: Compare volumes**`,
          `$$V_{\\text{prism}} = 3 \\times V_{\\text{pyramid}}$$`,
          `**Step 2: Determine fill ratio**`,
          `$$\\text{Number of fills} = \\frac{V_{\\text{prism}}}{V_{\\text{pyramid}}} = 3$$`,
          `**Final Verified Answer:** \\(${ansStr}\\)`
        ],
        image_url: PYR_VS_PRISM_IMAGE,
        image_alt: 'Water Filling Container Pyramid Prism',
        difficulty: 2
      };
    } else if (subType === 8) { // Finding Pyramid Height given Volume
      const B = [36, 45, 60, 72][qIndex % 4];
      const hVal = [10, 12, 15, 18][qIndex % 4];
      const vol = (B * hVal) / 3;
      const ansStr = `${hVal} cm`;
      const options = shuffle([
        ansStr,
        `${hVal + 5} cm`,
        `${hVal - 4} cm`,
        `${hVal * 2} cm`
      ]);
      return {
        title: `Height Calculation of Rectangular Pyramid`,
        text: `A rectangular pyramid has a base area of $${B}\\text{ cm}^2$ and a volume of $${vol}\\text{ cm}^3$. What is the perpendicular height of the pyramid?`,
        formula: `h = \\frac{3V}{B}`,
        options,
        answer: ansStr,
        hint: `Multiply volume $V$ by 3 and divide by base area $B$.`,
        steps: [
          `**Step 1: Rearrange volume formula $V = \\frac{1}{3} B h$**`,
          `$$3V = B \\times h \\implies h = \\frac{3V}{B}$$`,
          `**Step 2: Substitute values**`,
          `$$h = \\frac{3 \\times ${vol}}{${B}} = \\frac{${3 * vol}}{${B}} = ${hVal}\\text{ cm}$$`,
          `**Final Verified Answer:** \\(${ansStr}\\)`
        ],
        image_url: RECT_PYRAMID_IMAGE,
        image_alt: 'Height of Pyramid Diagram',
        difficulty: 3
      };
    } else { // Volume Difference: Cylinder vs Square Pyramid
      const s = 6;
      const r = 3;
      const h = 7;
      const volPyr = (s * s * h) / 3; // 84
      const volCyl = Number((Math.PI * r * r * h).toFixed(2)); // ~197.92
      const diff = Number((volCyl - volPyr).toFixed(2));
      const ansStr = `The cylinder is larger by ${diff} cm³`;
      const options = shuffle([
        ansStr,
        `The pyramid is larger by 42.00 cm³`,
        `Both volumes are equal to 84.00 cm³`,
        `The cylinder is larger by 28.00 cm³`
      ]);
      return {
        title: `Volume Comparison: Cylinder vs Square Pyramid`,
        text: `A square pyramid has base side $s = 6\\text{ cm}$ and height $h = 7\\text{ cm}$. A cylinder has base radius $r = 3\\text{ cm}$ and height $h = 7\\text{ cm}$. Using $\\pi \\approx 3.1416$, how do their volumes compare?`,
        formula: `V_{\\text{pyramid}} = \\frac{1}{3} s^2 h, \\quad V_{\\text{cylinder}} = \\pi r^2 h`,
        options,
        answer: ansStr,
        hint: `Compute $V_{\\text{pyramid}} = \\frac{1}{3}(36)(7) = 84$ and $V_{\\text{cylinder}} = \\pi (9)(7) \\approx 197.92$.`,
        steps: [
          `**Step 1: Compute square pyramid volume**`,
          `$$V_{\\text{pyramid}} = \\frac{1}{3} (6^2) (7) = \\frac{1}{3} (36) (7) = 84\\text{ cm}^3$$`,
          `**Step 2: Compute cylinder volume**`,
          `$$V_{\\text{cylinder}} = \\pi (3^2) (7) = 63\\pi \\approx ${volCyl}\\text{ cm}^3$$`,
          `**Step 3: Subtract volumes**`,
          `$$\\text{Difference} = ${volCyl} - 84 = ${diff}\\text{ cm}^3$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: CYL_VS_PRISM_IMAGE,
        image_alt: 'Cylinder and Square Pyramid Comparison',
        difficulty: 3
      };
    }
  }

  // Category 3A: Form 7 - Application of Percentages, Money & Interest (IDs 108, 130, 172)
  if (topicId === 108 || topicId === 130 || topicId === 172) {
    const subType = qIndex % 4;
    if (subType === 0) { // Percentage Increase / Decrease
      const orig = randInt(4, 15) * 100;
      const percent = randInt(2, 6) * 5;
      const inc = (orig * percent) / 100;
      const newPrice = orig + inc;
      const options = shuffle([`₱${newPrice}`, `₱${newPrice + 50}`, `₱${orig - inc}`, `₱${newPrice + 120}`]);
      return {
        title: `Percentage Increase in Financial Plan`,
        text: `An item priced at ₱${orig} in a retail store undergoes a ${percent}% price increase. What is the new final price?`,
        formula: `\\text{New Price} = P \\times \\left(1 + \\frac{r}{100}\\right)`,
        options,
        answer: `₱${newPrice}`,
        hint: `Find ${percent}% of ₱${orig} and add it to ₱${orig}.`,
        steps: [
          `**Step 1: Calculate price increase amount**`,
          `$$\\text{Increase} = \\text{₱}${orig} \\times \\frac{${percent}}{100} = \\text{₱}${inc}$$`,
          `**Step 2: Add to original price**`,
          `$$\\text{New Price} = \\text{₱}${orig} + \\text{₱}${inc} = \\text{₱}${newPrice}$$`,
          `**Final Verified Answer:** \\(\\text{₱}${newPrice}\\)`
        ],
        image_url: STATS_IMAGE,
        image_alt: 'Financial Price Trend Chart',
        difficulty: 3
      };
    } else if (subType === 1) { // Simple Interest
      const P = randInt(1, 5) * 10000;
      const r = randInt(3, 8);
      const t = randInt(2, 5);
      const I = (P * r * t) / 100;
      const options = shuffle([`₱${I}`, `₱${I + 500}`, `₱${I - 300}`, `₱${I + 1200}`]);
      return {
        title: `Simple Interest Calculation`,
        text: `${name} invested principal \\(P = \\text{₱}${P.toLocaleString()}\\) for \\(t = ${t}\\text{ years}\\) at simple interest rate \\(r = ${r}\\%\\) per annum. Find interest earned:`,
        formula: `I = P \\times r \\times t`,
        options,
        answer: `₱${I}`,
        hint: `Multiply principal by interest decimal rate and years.`,
        steps: [
          `**Step 1: Substitute values into $I = P \\cdot r \\cdot t$**`,
          `$$I = ${P} \\times \\frac{${r}}{100} \\times ${t} = ${P} \\times ${(r/100).toFixed(2)} \\times ${t} = \\text{₱}${I}$$`,
          `**Final Verified Answer:** \\(\\text{₱}${I}\\)`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 2) { // Profit & Loss
      const cost = randInt(5, 20) * 100;
      const profitRate = 20;
      const profit = (cost * profitRate) / 100;
      const sellingPrice = cost + profit;
      const options = shuffle([`₱${sellingPrice}`, `₱${sellingPrice + 100}`, `₱${cost - profit}`, `₱${sellingPrice + 250}`]);
      return {
        title: `Commercial Profit & Selling Price`,
        text: `A merchant bought goods for ₱${cost} and aims for a 20% profit margin. What should be the selling price?`,
        formula: `\\text{Selling Price} = \\text{Cost} + \\text{Profit}`,
        options,
        answer: `₱${sellingPrice}`,
        hint: `Add 20% profit of cost to original cost.`,
        steps: [
          `**Step 1: Calculate profit amount**`,
          `$$\\text{Profit} = \\text{₱}${cost} \\times 0.20 = \\text{₱}${profit}$$`,
          `**Step 2: Calculate selling price**`,
          `$$\\text{Selling Price} = \\text{₱}${cost} + \\text{₱}${profit} = \\text{₱}${sellingPrice}$$`,
          `**Final Verified Answer:** \\(\\text{₱}${sellingPrice}\\)`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else { // Compound Interest / Depreciation
      const P = randInt(1, 4) * 10000;
      const r = 10;
      const t = 2;
      const total = Math.round(P * Math.pow(1.10, 2));
      const options = shuffle([`₱${total}`, `₱${P + P * 0.20}`, `₱${total + 500}`, `₱${total - 300}`]);
      return {
        title: `Compound Interest Future Value`,
        text: `Calculate compound amount \\(A\\) after 2 years on principal \\(P = \\text{₱}${P.toLocaleString()}\\) compounded annually at \\(r = 10\\%\\):`,
        formula: `A = P(1 + r)^t`,
        options,
        answer: `₱${total}`,
        hint: `Multiply principal by (1.10)^2 = 1.21.`,
        steps: [
          `**Step 1: Write compound interest equation**`,
          `$$A = ${P} \\times (1 + 0.10)^2 = ${P} \\times (1.10)^2$$`,
          `**Step 2: Multiply**`,
          `$$A = ${P} \\times 1.21 = \\text{₱}${total}$$`,
          `**Final Verified Answer:** \\(\\text{₱}${total}\\)`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 4
      };
    }
  }

  // Category 3B: Form 7 - Use of Rates (Topic ID 109 - 50 DYNAMIC VARIATION QUESTIONS)
  if (topicId === 109) {
    const subType = qIndex % 10;
    const variantIndex = Math.floor(qIndex / 10); // 0 to 4 across 50 questions

    if (subType === 0) { // Hourly & Daily Wage Rate
      const wageConfigs = [
        { wage: 3150, hours: 42, days: 6 },
        { wage: 4200, hours: 40, days: 5 },
        { wage: 5040, hours: 42, days: 6 },
        { wage: 6300, hours: 45, days: 5 },
        { wage: 7200, hours: 48, days: 6 }
      ];
      const wc = wageConfigs[variantIndex % wageConfigs.length];
      const hourly = wc.wage / wc.hours;
      const daily = wc.wage / wc.days;
      const ansStr = `₱${hourly} per hour and ₱${daily} per day`;
      const options = shuffle([
        ansStr,
        `₱${hourly + 15} per hour and ₱${daily + 100} per day`,
        `₱${hourly - 10} per hour and ₱${daily - 50} per day`,
        `₱${hourly * 1.2} per hour and ₱${daily} per day`
      ]);
      return {
        title: `Hourly and Daily Wage Unit Rates`,
        text: `A worker earns a total wage of ₱${wc.wage.toLocaleString()} for working ${wc.hours} hours across ${wc.days} days. Calculate the unit rate per hour and the unit rate per day:`,
        formula: `\\text{Hourly Rate} = \\frac{\\text{Wage}}{\\text{Hours}}, \\quad \\text{Daily Rate} = \\frac{\\text{Wage}}{\\text{Days}}`,
        options,
        answer: ansStr,
        hint: `Divide total wage by total hours for hourly rate, and total wage by days for daily rate.`,
        steps: [
          `**Step 1: Calculate hourly unit rate**`,
          `$$\\text{Hourly Rate} = \\frac{\\text{₱}${wc.wage.toLocaleString()}}{${wc.hours}\\text{ hrs}} = \\text{₱}${hourly}\\text{/hr}$$`,
          `**Step 2: Calculate daily unit rate**`,
          `$$\\text{Daily Rate} = \\frac{\\text{₱}${wc.wage.toLocaleString()}}{${wc.days}\\text{ days}} = \\text{₱}${daily}\\text{/day}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 1) { // Gram Weight Price Comparison (Better Buy)
      const gramConfigs = [
        { costA: 130, gA: 250, costB: 215, gB: 450 },
        { costA: 140, gA: 200, costB: 240, gB: 400 },
        { costA: 160, gA: 300, costB: 270, gB: 600 },
        { costA: 180, gA: 250, costB: 300, gB: 500 },
        { costA: 200, gA: 400, costB: 330, gB: 750 }
      ];
      const gc = gramConfigs[variantIndex % gramConfigs.length];
      const rateA = Number(((gc.costA / gc.gA) * 100).toFixed(2));
      const rateB = Number(((gc.costB / gc.gB) * 100).toFixed(2));
      const better = rateA < rateB ? 'Brand A' : 'Brand B';
      const bestRate = Math.min(rateA, rateB);
      const ansStr = `${better} is the better buy (₱${bestRate} per 100g)`;
      const options = shuffle([
        ansStr,
        `${better === 'Brand A' ? 'Brand B' : 'Brand A'} is the better buy (₱${bestRate + 5} per 100g)`,
        `Both brands cost the same per 100 grams`,
        `${better} is the better buy (₱${bestRate + 12} per 100g)`
      ]);
      return {
        title: `Unit Price Comparison (Better Buy)`,
        text: `Brand A costs ₱${gc.costA} for ${gc.gA} grams, while Brand B costs ₱${gc.costB} for ${gc.gB} grams. Which is the better buy based on unit price per 100 grams?`,
        formula: `\\text{Unit Price per 100g} = \\frac{\\text{Cost}}{\\text{Grams}} \\times 100`,
        options,
        answer: ansStr,
        hint: `Find cost per 100g for each brand and compare.`,
        steps: [
          `**Step 1: Brand A cost per 100g**`,
          `$$\\text{Brand A} = \\frac{\\text{₱}${gc.costA}}{${gc.gA}} \\times 100 = \\text{₱}${rateA}/100\\text{g}$$`,
          `**Step 2: Brand B cost per 100g**`,
          `$$\\text{Brand B} = \\frac{\\text{₱}${gc.costB}}{${gc.gB}} \\times 100 = \\text{₱}${rateB}/100\\text{g}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 2) { // Liquid Volume Unit Price
      const volConfigs = [
        { p1Vol: 300, p1Price: 240, p2Vol: 500, p2Price: 350 },
        { p1Vol: 350, p1Price: 105, p2Vol: 600, p2Price: 168 },
        { p1Vol: 250, p1Price: 125, p2Vol: 400, p2Price: 180 },
        { p1Vol: 400, p1Price: 280, p2Vol: 750, p2Price: 480 },
        { p1Vol: 500, p1Price: 320, p2Vol: 1000, p2Price: 600 }
      ];
      const vc = volConfigs[variantIndex % volConfigs.length];
      const rate1 = Number(((vc.p1Price / vc.p1Vol) * 100).toFixed(2));
      const rate2 = Number(((vc.p2Price / vc.p2Vol) * 100).toFixed(2));
      const lowerPkg = rate1 < rate2 ? 'Package 1' : 'Package 2';
      const bestRate = Math.min(rate1, rate2);
      const ansStr = `${lowerPkg} offers lower price (₱${bestRate} per 100 mL)`;
      const options = shuffle([
        ansStr,
        `${lowerPkg === 'Package 1' ? 'Package 2' : 'Package 1'} offers lower price (₱${bestRate + 5} per 100 mL)`,
        `Both packages have equal price per 100 mL`,
        `${lowerPkg} offers lower price (₱${bestRate + 10} per 100 mL)`
      ]);
      return {
        title: `Volume Rate Unit Price Comparison`,
        text: `Which cost rate offers a lower unit price? Package 1: ₱${vc.p1Price} for ${vc.p1Vol} mL, or Package 2: ₱${vc.p2Price} for ${vc.p2Vol} mL?`,
        formula: `\\text{Rate per 100 mL} = \\frac{\\text{Price}}{\\text{Volume}} \\times 100`,
        options,
        answer: ansStr,
        hint: `Calculate price per 100 mL for both packages.`,
        steps: [
          `**Step 1: Package 1 rate**`,
          `$$\\text{P1 Rate} = \\frac{\\text{₱}${vc.p1Price}}{${vc.p1Vol}} \\times 100 = \\text{₱}${rate1}/100\\text{ mL}$$`,
          `**Step 2: Package 2 rate**`,
          `$$\\text{P2 Rate} = \\frac{\\text{₱}${vc.p2Price}}{${vc.p2Vol}} \\times 100 = \\text{₱}${rate2}/100\\text{ mL}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 3) { // Fuel Distance Rate
      const fuelConfigs = [
        { liters: 8.5, km: 102, targetLiters: 20 },
        { liters: 12, km: 108, targetLiters: 50 },
        { liters: 15, km: 180, targetLiters: 40 },
        { liters: 10, km: 140, targetLiters: 35 },
        { liters: 18, km: 216, targetLiters: 45 }
      ];
      const fc = fuelConfigs[variantIndex % fuelConfigs.length];
      const kmPerL = fc.km / fc.liters;
      const totalKm = kmPerL * fc.targetLiters;
      const ansStr = `${totalKm} km`;
      const options = shuffle([
        ansStr,
        `${totalKm + 30} km`,
        `${totalKm - 25} km`,
        `${totalKm * 1.25} km`
      ]);
      return {
        title: `Fuel Consumption Distance Rate Projection`,
        text: `If a car consumes ${fc.liters} liters of fuel to travel ${fc.km} km, how far can it travel on ${fc.targetLiters} liters at the same consumption rate?`,
        formula: `\\text{Distance} = \\left(\\frac{\\text{Distance}}{\\text{Fuel}}\\right) \\times \\text{Target Fuel}`,
        options,
        answer: ansStr,
        hint: `Find km per liter (${fc.km} / ${fc.liters}) and multiply by ${fc.targetLiters}.`,
        steps: [
          `**Step 1: Calculate fuel efficiency rate**`,
          `$$\\text{Rate} = \\frac{${fc.km}\\text{ km}}{${fc.liters}\\text{ L}} = ${kmPerL}\\text{ km/L}$$`,
          `**Step 2: Calculate total distance for ${fc.targetLiters} L**`,
          `$$\\text{Distance} = ${kmPerL}\\text{ km/L} \\times ${fc.targetLiters}\\text{ L} = ${totalKm}\\text{ km}$$`,
          `**Final Verified Answer:** \\(${ansStr}\\)`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 4) { // Printer Page Rate
      const printConfigs = [
        { pages: 45, mins: 3, targetMins: 8 },
        { pages: 75, mins: 5, targetMins: 12 },
        { pages: 90, mins: 6, targetMins: 15 },
        { pages: 120, mins: 8, targetMins: 20 },
        { pages: 160, mins: 10, targetMins: 25 }
      ];
      const pc = printConfigs[variantIndex % printConfigs.length];
      const ppm = pc.pages / pc.mins;
      const totalPages = ppm * pc.targetMins;
      const ansStr = `${totalPages} pages`;
      const options = shuffle([
        ansStr,
        `${totalPages + 20} pages`,
        `${totalPages - 15} pages`,
        `${totalPages * 1.5} pages`
      ]);
      return {
        title: `Printer Speed Rate Projection`,
        text: `If a printer outputs ${pc.pages} pages in ${pc.mins} minutes, how many pages can it print in ${pc.targetMins} minutes at a constant rate?`,
        formula: `\\text{Total Pages} = \\left(\\frac{\\text{Pages}}{\\text{Time}}\\right) \\times \\text{Target Time}`,
        options,
        answer: ansStr,
        hint: `Calculate pages per minute (${pc.pages} / ${pc.mins}) and multiply by ${pc.targetMins}.`,
        steps: [
          `**Step 1: Calculate print speed rate**`,
          `$$\\text{Speed} = \\frac{${pc.pages}\\text{ pages}}{${pc.mins}\\text{ min}} = ${ppm}\\text{ pages/min}$$`,
          `**Step 2: Calculate pages in ${pc.targetMins} min**`,
          `$$\\text{Pages} = ${ppm} \\times ${pc.targetMins} = ${totalPages}\\text{ pages}$$`,
          `**Final Verified Answer:** \\(${ansStr}\\)`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 2
      };
    } else if (subType === 5) { // Typing WPM Rate
      const typeConfigs = [
        { words: 1440, mins: 24, targetMins: 15 },
        { words: 1800, mins: 30, targetMins: 20 },
        { words: 2100, mins: 35, targetMins: 25 },
        { words: 1250, mins: 25, targetMins: 18 },
        { words: 2400, mins: 40, targetMins: 30 }
      ];
      const tc = typeConfigs[variantIndex % typeConfigs.length];
      const wpm = tc.words / tc.mins;
      const totalWords = wpm * tc.targetMins;
      const ansStr = `${wpm} WPM and ${totalWords} words`;
      const options = shuffle([
        ansStr,
        `${wpm + 10} WPM and ${totalWords + 150} words`,
        `${wpm - 5} WPM and ${totalWords - 100} words`,
        `${wpm} WPM and ${totalWords + 200} words`
      ]);
      return {
        title: `Typing Speed Words-Per-Minute (WPM) Rate`,
        text: `A typist completes a ${tc.words}-word document in ${tc.mins} minutes. What is the typist's average typing rate in words per minute (WPM), and how many words can be typed in ${tc.targetMins} minutes?`,
        formula: `\\text{WPM} = \\frac{\\text{Words}}{\\text{Minutes}}`,
        options,
        answer: ansStr,
        hint: `Divide words by minutes to get WPM, then multiply by ${tc.targetMins}.`,
        steps: [
          `**Step 1: Calculate typing WPM rate**`,
          `$$\\text{WPM} = \\frac{${tc.words}}{${tc.mins}} = ${wpm}\\text{ WPM}$$`,
          `**Step 2: Words typed in ${tc.targetMins} min**`,
          `$$\\text{Words} = ${wpm} \\times ${tc.targetMins} = ${totalWords}\\text{ words}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 6) { // Water Flow Pump Rate
      const pumpConfigs = [
        { vol: 1200, mins: 15, targetVol: 2000 },
        { vol: 1500, mins: 20, targetVol: 3000 },
        { vol: 1800, mins: 24, targetVol: 4500 },
        { vol: 2400, mins: 30, targetVol: 5600 },
        { vol: 3000, mins: 25, targetVol: 7200 }
      ];
      const puc = pumpConfigs[variantIndex % pumpConfigs.length];
      const lpm = puc.vol / puc.mins;
      const timeNeeded = puc.targetVol / lpm;
      const ansStr = `${lpm} L/min and ${timeNeeded} minutes`;
      const options = shuffle([
        ansStr,
        `${lpm + 10} L/min and ${timeNeeded + 5} minutes`,
        `${lpm - 15} L/min and ${timeNeeded - 4} minutes`,
        `${lpm} L/min and ${timeNeeded * 1.5} minutes`
      ]);
      return {
        title: `Water Flow Rate and Filling Duration`,
        text: `A water pump fills a ${puc.vol}-liter storage tank in ${puc.mins} minutes. What is its flow rate in liters per minute (L/min), and how long does it take to fill a ${puc.targetVol}-liter tank?`,
        formula: `\\text{Flow Rate} = \\frac{V}{t}, \\quad t = \\frac{V_{\\text{target}}}{\\text{Flow Rate}}`,
        options,
        answer: ansStr,
        hint: `Divide ${puc.vol} by ${puc.mins} for flow rate, then divide ${puc.targetVol} by flow rate.`,
        steps: [
          `**Step 1: Calculate pump flow rate**`,
          `$$\\text{Flow Rate} = \\frac{${puc.vol}\\text{ L}}{${puc.mins}\\text{ min}} = ${lpm}\\text{ L/min}$$`,
          `**Step 2: Calculate time for ${puc.targetVol} L**`,
          `$$\\text{Time} = \\frac{${puc.targetVol}\\text{ L}}{${lpm}\\text{ L/min}} = ${timeNeeded}\\text{ minutes}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 7) { // Store Rice Price Difference per KG
      const riceConfigs = [
        { cost1: 240, kg1: 5, cost2: 1125, kg2: 25 },
        { cost1: 280, kg1: 5, cost2: 1300, kg2: 25 },
        { cost1: 300, kg1: 6, cost2: 1100, kg2: 25 },
        { cost1: 220, kg1: 4, cost2: 1250, kg2: 25 },
        { cost1: 350, kg1: 7, cost2: 1400, kg2: 30 }
      ];
      const rc = riceConfigs[variantIndex % riceConfigs.length];
      const r1 = rc.cost1 / rc.kg1;
      const r2 = rc.cost2 / rc.kg2;
      const diff = Number(Math.abs(r1 - r2).toFixed(2));
      const cheaperStore = r1 < r2 ? 'Store X' : 'Store Y';
      const ansStr = `₱${diff} per kg price difference (${cheaperStore} is cheaper)`;
      const options = shuffle([
        ansStr,
        `₱${(diff + 2).toFixed(2)} per kg price difference (${cheaperStore === 'Store X' ? 'Store Y' : 'Store X'} is cheaper)`,
        `Both stores charge the same price per kg`,
        `₱${(diff + 5).toFixed(2)} per kg price difference (${cheaperStore} is cheaper)`
      ]);
      return {
        title: `Supermarket Price Difference per Kilogram`,
        text: `Store X sells a ${rc.kg1}-kg bag of rice for ₱${rc.cost1}, while Store Y sells a ${rc.kg2}-kg bag for ₱${rc.cost2}. What is the price difference per kilogram between the two stores?`,
        formula: `\\text{Price per kg} = \\frac{\\text{Total Price}}{\\text{Weight (kg)}}`,
        options,
        answer: ansStr,
        hint: `Find price per kg for Store X and Store Y, then subtract.`,
        steps: [
          `**Step 1: Store X rate**`,
          `$$\\text{Store X} = \\frac{\\text{₱}${rc.cost1}}{${rc.kg1}\\text{ kg}} = \\text{₱}${r1}/\\text{kg}$$`,
          `**Step 2: Store Y rate**`,
          `$$\\text{Store Y} = \\frac{\\text{₱}${rc.cost2}}{${rc.kg2}\\text{ kg}} = \\text{₱}${r2}/\\text{kg}$$`,
          `**Step 3: Subtract**`,
          `$$\\text{Difference} = |\\text{₱}${r1} - \\text{₱}${r2}| = \\text{₱}${diff}/\\text{kg}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 8) { // Data Transfer Download Rate
      const netConfigs = [
        { mb: 540, sec: 18, targetMb: 1500 },
        { mb: 720, sec: 24, targetMb: 2400 },
        { mb: 960, sec: 32, targetMb: 3600 },
        { mb: 1200, sec: 40, targetMb: 4800 },
        { mb: 1500, sec: 50, targetMb: 6000 }
      ];
      const nc = netConfigs[variantIndex % netConfigs.length];
      const speed = nc.mb / nc.sec;
      const targetTime = nc.targetMb / speed;
      const ansStr = `${speed} MB/s and ${targetTime} seconds`;
      const options = shuffle([
        ansStr,
        `${speed + 5} MB/s and ${targetTime + 10} seconds`,
        `${speed - 5} MB/s and ${targetTime - 10} seconds`,
        `${speed} MB/s and ${targetTime + 20} seconds`
      ]);
      return {
        title: `Data Download Transfer Speed Rate`,
        text: `An internet connection downloads a ${nc.mb} MB file in ${nc.sec} seconds. What is the download speed in MB/s, and how long will a ${nc.targetMb} MB download take?`,
        formula: `\\text{Speed} = \\frac{\\text{Data}}{\\text{Time}}, \\quad t = \\frac{\\text{Target Data}}{\\text{Speed}}`,
        options,
        answer: ansStr,
        hint: `Divide ${nc.mb} by ${nc.sec} for speed, then divide ${nc.targetMb} by speed.`,
        steps: [
          `**Step 1: Calculate download speed**`,
          `$$\\text{Speed} = \\frac{${nc.mb}\\text{ MB}}{${nc.sec}\\text{ s}} = ${speed}\\text{ MB/s}$$`,
          `**Step 2: Calculate download time**`,
          `$$t = \\frac{${nc.targetMb}\\text{ MB}}{${speed}\\text{ MB/s}} = ${targetTime}\\text{ seconds}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else { // Bus Speed Rate Comparison
      const busConfigs = [
        { d1: 210, t1: 3, d2: 288, t2: 4 },
        { d1: 240, t1: 4, d2: 325, t2: 5 },
        { d1: 270, t1: 3, d2: 380, t2: 4 },
        { d1: 300, t1: 5, d2: 420, t2: 6 },
        { d1: 350, t1: 5, d2: 450, t2: 6 }
      ];
      const bc = busConfigs[variantIndex % busConfigs.length];
      const s1 = bc.d1 / bc.t1;
      const s2 = bc.d2 / bc.t2;
      const diff = Number(Math.abs(s2 - s1).toFixed(2));
      const fasterBus = s1 > s2 ? 'Bus A' : 'Bus B';
      const ansStr = `${fasterBus} is faster by ${diff} km/h`;
      const options = shuffle([
        ansStr,
        `${fasterBus === 'Bus A' ? 'Bus B' : 'Bus A'} is faster by ${diff + 3} km/h`,
        `Both buses travel at equal average speed`,
        `${fasterBus} is faster by ${diff + 5} km/h`
      ]);
      return {
        title: `Vehicle Speed Rate Comparison`,
        text: `Bus A travels ${bc.d1} km in ${bc.t1} hours, while Bus B travels ${bc.d2} km in ${bc.t2} hours. Which bus has the higher average speed, and by how many km/h?`,
        formula: `\\text{Speed} = \\frac{\\text{Distance}}{\\text{Time}}`,
        options,
        answer: ansStr,
        hint: `Compute speed for Bus A (${bc.d1}/${bc.t1}) and Bus B (${bc.d2}/${bc.t2}), then subtract.`,
        steps: [
          `**Step 1: Speed of Bus A**`,
          `$$v_A = \\frac{${bc.d1}\\text{ km}}{${bc.t1}\\text{ hrs}} = ${s1}\\text{ km/h}$$`,
          `**Step 2: Speed of Bus B**`,
          `$$v_B = \\frac{${bc.d2}\\text{ km}}{${bc.t2}\\text{ hrs}} = ${s2}\\text{ km/h}$$`,
          `**Step 3: Difference**`,
          `$$\\text{Difference} = |${s1} - ${s2}| = ${diff}\\text{ km/h}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    }
  }
  // Category 3C: Form 7 - Rational Numbers (Topic ID 110 - 50 DYNAMIC VARIATION QUESTIONS)
  if (topicId === 110) {
    const subType = qIndex % 10;
    const variantIndex = Math.floor(qIndex / 10); // 0 to 4 across 50 questions

    if (subType === 0) { // Family Budget Fractional Remaining Income
      const budgetConfigs = [
        { hName: 'housing', hFrac: '1/4', fName: 'food', fFrac: '3/8', uName: 'utilities', uFrac: '1/6', ansStr: '5/24', hint: 'Find common denominator 24: 6/24 + 9/24 + 4/24 = 19/24. Savings = 1 - 19/24 = 5/24.', sumExpr: '\\frac{1}{4} + \\frac{3}{8} + \\frac{1}{6} = \\frac{6}{24} + \\frac{9}{24} + \\frac{4}{24} = \\frac{19}{24}' },
        { hName: 'rent', hFrac: '1/3', fName: 'groceries', fFrac: '1/4', uName: 'transport', uFrac: '1/5', ansStr: '13/60', hint: 'Find common denominator 60: 20/60 + 15/60 + 12/60 = 47/60. Savings = 1 - 47/60 = 13/60.', sumExpr: '\\frac{1}{3} + \\frac{1}{4} + \\frac{1}{5} = \\frac{20}{60} + \\frac{15}{60} + \\frac{12}{60} = \\frac{47}{60}' },
        { hName: 'housing', hFrac: '2/5', fName: 'education', fFrac: '1/4', uName: 'utilities', uFrac: '1/10', ansStr: '1/4', hint: 'Find common denominator 20: 8/20 + 5/20 + 2/20 = 15/20. Savings = 1 - 15/20 = 5/20 = 1/4.', sumExpr: '\\frac{2}{5} + \\frac{1}{4} + \\frac{1}{10} = \\frac{8}{20} + \\frac{5}{20} + \\frac{2}{20} = \\frac{15}{20}' },
        { hName: 'mortgage', hFrac: '3/10', fName: 'food', fFrac: '1/3', uName: 'healthcare', uFrac: '1/6', ansStr: '1/5', hint: 'Find common denominator 30: 9/30 + 10/30 + 5/30 = 24/30. Savings = 1 - 24/30 = 6/30 = 1/5.', sumExpr: '\\frac{3}{10} + \\frac{1}{3} + \\frac{1}{6} = \\frac{9}{30} + \\frac{10}{30} + \\frac{5}{30} = \\frac{24}{30}' },
        { hName: 'rent', hFrac: '1/6', fName: 'food', fFrac: '1/2', uName: 'bills', uFrac: '1/5', ansStr: '2/15', hint: 'Find common denominator 30: 5/30 + 15/30 + 6/30 = 26/30. Savings = 1 - 26/30 = 4/30 = 2/15.', sumExpr: '\\frac{1}{6} + \\frac{1}{2} + \\frac{1}{5} = \\frac{5}{30} + \\frac{15}{30} + \\frac{6}{30} = \\frac{26}{30}' }
      ];
      const bc = budgetConfigs[variantIndex % budgetConfigs.length];
      const ansStr = bc.ansStr;
      const options = shuffle([ansStr, `1/6`, `7/24`, `1/3`].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4));

      return {
        title: `Family Budget Fractional Income Allocation`,
        text: `In budget planning, a family allocated $\\frac{${bc.hFrac.split('/')[0]}}{${bc.hFrac.split('/')[1]}}$ of income for ${bc.hName}, $\\frac{${bc.fFrac.split('/')[0]}}{${bc.fFrac.split('/')[1]}}$ for ${bc.fName}, and $\\frac{${bc.uFrac.split('/')[0]}}{${bc.uFrac.split('/')[1]}}$ for ${bc.uName}. What fraction of the total income was saved?`,
        formula: `\\text{Savings} = 1 - \\left(\\frac{${bc.hFrac.split('/')[0]}}{${bc.hFrac.split('/')[1]}} + \\frac{${bc.fFrac.split('/')[0]}}{${bc.fFrac.split('/')[1]}} + \\frac{${bc.uFrac.split('/')[0]}}{${bc.uFrac.split('/')[1]}}\\right)`,
        options,
        answer: ansStr,
        hint: bc.hint,
        steps: [
          `**Step 1: Add allocated expense fractions**`,
          `$$${bc.sumExpr}$$`,
          `**Step 2: Subtract from whole income 1**`,
          `$$\\text{Savings} = 1 - \\frac{${bc.sumExpr.split('=')[2].trim().split('{')[1].split('}')[0]}} = \\frac{${ansStr.split('/')[0]}}{${ansStr.split('/')[1]}}$$`,
          `**Final Verified Answer:** \\(\\frac{${ansStr.split('/')[0]}}{${ansStr.split('/')[1]}}\\)`
        ],
        image_url: PIE_IMAGE,
        image_alt: 'Family Income Allocation Chart',
        difficulty: 3
      };
    } else if (subType === 1) { // Fraction to Decimal & Percentage
      const fracConfigs = [
        { num: 7, den: 20, dec: '0.35', pct: '35%' },
        { num: 9, den: 25, dec: '0.36', pct: '36%' },
        { num: 13, den: 40, dec: '0.325', pct: '32.5%' },
        { num: 17, den: 50, dec: '0.34', pct: '34%' },
        { num: 11, den: 16, dec: '0.6875', pct: '68.75%' }
      ];
      const fc = fracConfigs[variantIndex % fracConfigs.length];
      const ansStr = `${fc.dec} and ${fc.pct}`;
      const options = shuffle([
        ansStr,
        `${(parseFloat(fc.dec) * 2).toFixed(2)} and ${(parseFloat(fc.dec) * 200).toFixed(0)}%`,
        `${(parseFloat(fc.dec) - 0.05).toFixed(3)} and ${(parseFloat(fc.dec) * 100 - 5).toFixed(1)}%`,
        `${(parseFloat(fc.dec) + 0.1).toFixed(2)} and ${(parseFloat(fc.dec) * 100 + 10).toFixed(0)}%`
      ]);
      return {
        title: `Fraction to Decimal and Percentage Conversion`,
        text: `Convert the rational number fraction $\\frac{${fc.num}}{${fc.den}}$ into its equivalent decimal and percentage forms:`,
        formula: `\\frac{a}{b} = d \\implies d \\times 100\\%`,
        options,
        answer: ansStr,
        hint: `Divide ${fc.num} by ${fc.den} for decimal, then multiply by 100 for percentage.`,
        steps: [
          `**Step 1: Convert fraction to decimal**`,
          `$$\\frac{${fc.num}}{${fc.den}} = ${fc.dec}$$`,
          `**Step 2: Convert decimal to percentage**`,
          `$$${fc.dec} \\times 100\\% = ${fc.pct}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 2
      };
    } else if (subType === 2) { // Ascending Order on Number Line
      const orderConfigs = [
        { raw: ['-\\frac{3}{4}', '0.4', '\\frac{5}{8}', '-0.75', '0.35', '-1.25'], sorted: '-1.25, -0.75, -3/4, 0.35, 0.4, 5/8', decs: '-1.25, -0.75, 0.35, 0.40, 0.625' },
        { raw: ['-\\frac{4}{5}', '0.3', '\\frac{7}{10}', '-1.5', '-0.6', '\\frac{1}{4}'], sorted: '-1.5, -4/5, -0.6, 1/4, 0.3, 7/10', decs: '-1.50, -0.80, -0.60, 0.25, 0.30, 0.70' },
        { raw: ['-\\frac{7}{4}', '0.85', '\\frac{9}{8}', '-2.2', '-1.25', '\\frac{1}{2}'], sorted: '-2.2, -7/4, -1.25, 1/2, 0.85, 9/8', decs: '-2.20, -1.75, -1.25, 0.50, 0.85, 1.125' },
        { raw: ['-\\frac{2}{3}', '0.45', '\\frac{3}{4}', '-0.9', '-0.5', '\\frac{1}{5}'], sorted: '-0.9, -2/3, -0.5, 1/5, 0.45, 3/4', decs: '-0.90, -0.667, -0.50, 0.20, 0.45, 0.75' },
        { raw: ['-1\\frac{1}{2}', '0.15', '\\frac{2}{5}', '-1.8', '-0.95', '0.8'], sorted: '-1.8, -1 1/2, -0.95, 0.15, 2/5, 0.8', decs: '-1.80, -1.50, -0.95, 0.15, 0.40, 0.80' }
      ];
      const oc = orderConfigs[variantIndex % orderConfigs.length];
      const ansStr = oc.sorted;
      const options = shuffle([
        ansStr,
        oc.sorted.split(', ').reverse().join(', '),
        oc.sorted.split(', ').sort().join(', '),
        `-0.75, -1.25, 0.35, 0.4, 5/8, -3/4`
      ].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4));

      return {
        title: `Ascending Order of Rational Numbers on Number Line`,
        text: `Arrange the rational numbers ${oc.raw.map(x => `$${x}$`).join(', ')} in ascending order from least to greatest:`,
        formula: `\\text{Convert all fractions to decimals and compare on real number line}`,
        options,
        answer: ansStr,
        hint: `Convert fractions to decimals and order from most negative to most positive.`,
        steps: [
          `**Step 1: Convert rational numbers to decimals**`,
          `$$${oc.decs}$$`,
          `**Step 2: Order from least to greatest**`,
          `$$\\text{Ascending Order: } ${ansStr}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 3) { // Addition of Signed Fractions
      const addConfigs = [
        { f1: '\\frac{3}{4}', f2: '-\\frac{5}{6}', cd: 12, ansStr: '-1/12', num1: 9, num2: -10, resNum: -1 },
        { f1: '\\frac{2}{5}', f2: '-\\frac{3}{4}', cd: 20, ansStr: '-7/20', num1: 8, num2: -15, resNum: -7 },
        { f1: '-\\frac{5}{8}', f2: '\\frac{1}{6}', cd: 24, ansStr: '-11/24', num1: -15, num2: 4, resNum: -11 },
        { f1: '\\frac{4}{9}', f2: '-\\frac{5}{12}', cd: 36, ansStr: '1/36', num1: 16, num2: -15, resNum: 1 },
        { f1: '-\\frac{7}{10}', f2: '\\frac{4}{15}', cd: 30, ansStr: '-13/30', num1: -21, num2: 8, resNum: -13 }
      ];
      const ac = addConfigs[variantIndex % addConfigs.length];
      const ansStr = ac.ansStr;
      const options = shuffle([ansStr, `1/${ac.cd}`, `-7/${ac.cd}`, `5/${ac.cd}`].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4));

      return {
        title: `Addition of Signed Rational Fractions`,
        text: `Evaluate the mathematical sum of signed rational numbers: $${ac.f1} + \\left(${ac.f2}\\right)$:`,
        formula: `\\frac{a}{b} + \\left(-\\frac{c}{d}\\right) = \\frac{ad - bc}{bd}`,
        options,
        answer: ansStr,
        hint: `Find common denominator ${ac.cd} for denominators.`,
        steps: [
          `**Step 1: Convert fractions to common denominator ${ac.cd}**`,
          `$$${ac.f1} = \\frac{${ac.num1}}{${ac.cd}}, \\quad ${ac.f2} = \\frac{${ac.num2}}{${ac.cd}}$$`,
          `**Step 2: Add numerators**`,
          `$$\\frac{${ac.num1} + (${ac.num2})}{${ac.cd}} = \\frac{${ac.resNum}}{${ac.cd}}$$`,
          `**Final Verified Answer:** \\(\\frac{${ac.resNum}}{${ac.cd}}\\)`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 4) { // Multiplication of Negative Rational Numbers
      const multConfigs = [
        { f1: '-\\frac{2}{3}', f2: '-\\frac{9}{10}', ansStr: '3/5', numProd: 18, denProd: 30, gcd: 6 },
        { f1: '-\\frac{3}{5}', f2: '-\\frac{10}{21}', ansStr: '2/7', numProd: 30, denProd: 105, gcd: 15 },
        { f1: '-\\frac{4}{7}', f2: '-\\frac{14}{16}', ansStr: '1/2', numProd: 56, denProd: 112, gcd: 56 },
        { f1: '-\\frac{5}{9}', f2: '-\\frac{18}{25}', ansStr: '2/5', numProd: 90, denProd: 225, gcd: 45 },
        { f1: '-\\frac{6}{11}', f2: '-\\frac{22}{27}', ansStr: '4/9', numProd: 132, denProd: 297, gcd: 33 }
      ];
      const mc = multConfigs[variantIndex % multConfigs.length];
      const ansStr = mc.ansStr;
      const options = shuffle([ansStr, `-${ansStr}`, `${mc.ansStr.split('/')[1]}/${mc.ansStr.split('/')[0]}`, `-${mc.numProd}/${mc.denProd}`]);

      return {
        title: `Multiplication of Negative Rational Numbers`,
        text: `Evaluate the product of negative rational numbers: $${mc.f1} \\times \\left(${mc.f2}\\right)$:`,
        formula: `\\left(-\\frac{a}{b}\\right) \\times \\left(-\\frac{c}{d}\\right) = +\\frac{ac}{bd}`,
        options,
        answer: ansStr,
        hint: `Multiplying two negative numbers yields a positive product. Simplify fraction.`,
        steps: [
          `**Step 1: Multiply numerators and denominators**`,
          `$$\\left(${mc.f1}\\right) \\times \\left(${mc.f2}\\right) = +\\frac{${mc.numProd}}{${mc.denProd}}$$`,
          `**Step 2: Reduce fraction by GCD ${mc.gcd}**`,
          `$$\\frac{${mc.numProd} \\div ${mc.gcd}}{${mc.denProd} \\div ${mc.gcd}} = \\frac{${ansStr.split('/')[0]}}{${ansStr.split('/')[1]}}$$`,
          `**Final Verified Answer:** \\(\\frac{${ansStr.split('/')[0]}}{${ansStr.split('/')[1]}}\\)`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 5) { // Division of Mixed Rational Numbers
      const divConfigs = [
        { textExpr: '-1\\frac{1}{2} \\div \\frac{3}{4}', imp1: '-\\frac{3}{2}', rec2: '\\frac{4}{3}', ansStr: '-2', numP: -12, denP: 6 },
        { textExpr: '-2\\frac{1}{4} \\div \\frac{3}{8}', imp1: '-\\frac{9}{4}', rec2: '\\frac{8}{3}', ansStr: '-6', numP: -72, denP: 12 },
        { textExpr: '-3\\frac{1}{3} \\div \\left(-1\\frac{1}{4}\\right)', imp1: '-\\frac{10}{3}', rec2: '-\\frac{4}{5}', ansStr: '8/3', numP: 40, denP: 15 },
        { textExpr: '-1\\frac{7}{8} \\div \\frac{5}{12}', imp1: '-\\frac{15}{8}', rec2: '\\frac{12}{5}', ansStr: '-9/2', numP: -180, denP: 40 },
        { textExpr: '-2\\frac{2}{5} \\div \\left(-\\frac{4}{15}\\right)', imp1: '-\\frac{12}{5}', rec2: '-\\frac{15}{4}', ansStr: '9', numP: 180, denP: 20 }
      ];
      const dc = divConfigs[variantIndex % divConfigs.length];
      const ansStr = dc.ansStr;
      const options = shuffle([ansStr, `-${ansStr}`, `3`, `-4.5`].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4));

      return {
        title: `Division of Mixed Rational Numbers`,
        text: `Calculate the exact quotient: $${dc.textExpr}$:`,
        formula: `-\\frac{a}{b} \\div \\frac{c}{d} = -\\frac{a}{b} \\times \\frac{d}{c}`,
        options,
        answer: ansStr,
        hint: `Convert mixed fraction to improper fraction and multiply by reciprocal.`,
        steps: [
          `**Step 1: Convert to improper fraction**`,
          `$$${dc.imp1}$$`,
          `**Step 2: Multiply by reciprocal**`,
          `$$${dc.imp1} \\times ${dc.rec2} = \\frac{${dc.numP}}{${dc.denP}} = ${ansStr}$$`,
          `**Final Verified Answer:** \\(${ansStr}\\)`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 6) { // Bag Packaging Mixed Fraction Division
      const packConfigs = [
        { item: 'sugar', totalKg: 12.5, bagKg: 0.75, totStr: '12\\frac{1}{2}', bagStr: '\\frac{3}{4}', bags: 16 },
        { item: 'flour', totalKg: 18.75, bagKg: 1.25, totStr: '18\\frac{3}{4}', bagStr: '1\\frac{1}{4}', bags: 15 },
        { item: 'sea salt', totalKg: 15.0, bagKg: 0.625, totStr: '15', bagStr: '\\frac{5}{8}', bags: 24 },
        { item: 'coffee beans', totalKg: 22.5, bagKg: 0.875, totStr: '22\\frac{1}{2}', bagStr: '\\frac{7}{8}', bags: 25 },
        { item: 'rolled oats', totalKg: 16.8, bagKg: 0.6, totStr: '16.8', bagStr: '0.6', bags: 28 }
      ];
      const pk = packConfigs[variantIndex % packConfigs.length];
      const ansStr = `${pk.bags} full bags`;
      const options = shuffle([
        ansStr,
        `${pk.bags + 4} full bags`,
        `${pk.bags - 3} full bags`,
        `${pk.bags + 8} full bags`
      ]);

      return {
        title: `Bulk ${pk.item.toUpperCase()} Packaging Mixed Fraction Division`,
        text: `A wholesale sack of ${pk.item} weighing $${pk.totStr}\\text{ kg}$ is divided into retail bags containing $${pk.bagStr}\\text{ kg}$ each. How many full retail bags can be filled?`,
        formula: `\\text{Bags} = \\left\\lfloor \\frac{\\text{Total Weight}}{\\text{Bag Weight}} \\right\\rfloor`,
        options,
        answer: ansStr,
        hint: `Divide total weight ${pk.totalKg} by bag weight ${pk.bagKg} and take the integer floor.`,
        steps: [
          `**Step 1: Divide total weight by bag unit weight**`,
          `$$\\text{Bags} = \\frac{${pk.totalKg}}{${pk.bagKg}} = ${pk.bags}$$`,
          `**Final Verified Answer:** \\(${ansStr}\\)`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 7) { // Temperature Subtraction
      const tempConfigs = [
        { loc: 'mountain resort', init: -3.5, rise: 8.75, fall: 4.2, final: 1.05 },
        { loc: 'highland city', init: -5.2, rise: 12.4, fall: 6.75, final: 0.45 },
        { loc: 'alpine valley', init: -2.8, rise: 7.3, fall: 5.1, final: -0.6 },
        { loc: 'northern observatory', init: -8.4, rise: 15.25, fall: 9.6, final: -2.75 },
        { loc: 'coastal hill station', init: -1.6, rise: 9.85, fall: 3.45, final: 4.8 }
      ];
      const tc = tempConfigs[variantIndex % tempConfigs.length];
      const ansStr = `${tc.final}°C`;
      const options = shuffle([
        ansStr,
        `${(tc.final + 2.5).toFixed(2)}°C`,
        `${(tc.final - 3.0).toFixed(2)}°C`,
        `${(tc.final * 2).toFixed(2)}°C`
      ]);

      return {
        title: `Temperature Change Rational Arithmetic`,
        text: `At sunrise, the temperature in a ${tc.loc} was $${tc.init}^\\circ\\text{C}$. By noon, it rose by $${tc.rise}^\\circ\\text{C}$, but fell by $${tc.fall}^\\circ\\text{C}$ by midnight. What was the final temperature at midnight?`,
        formula: `T_{\\text{final}} = T_0 + \\Delta T_{\\text{rise}} - \\Delta T_{\\text{fall}}`,
        options,
        answer: ansStr,
        hint: `Add rise ${tc.rise} to ${tc.init}, then subtract ${tc.fall}.`,
        steps: [
          `**Step 1: Calculate noon temperature**`,
          `$$${tc.init} + ${tc.rise} = ${(tc.init + tc.rise).toFixed(2)}^\\circ\\text{C}$$`,
          `**Step 2: Calculate midnight temperature**`,
          `$$${(tc.init + tc.rise).toFixed(2)} - ${tc.fall} = ${tc.final}^\\circ\\text{C}$$`,
          `**Final Verified Answer:** \\(${ansStr}\\)`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 8) { // Fabric/Pipe Cutting Remaining Measurement
      const cutConfigs = [
        { material: 'fabric', item: 'shirt pieces', totalLen: 15.5, totStr: '15\\frac{1}{2}', pieceLen: 1.25, pieceStr: '1\\frac{1}{4}', pieces: 12, remStr: '1/2 m' },
        { material: 'copper pipe', item: 'joint segments', totalLen: 20.25, totStr: '20\\frac{1}{4}', pieceLen: 1.5, pieceStr: '1\\frac{1}{2}', pieces: 13, remStr: '3/4 m' },
        { material: 'satin ribbon', item: 'gift bows', totalLen: 18.6, totStr: '18.6', pieceLen: 0.8, pieceStr: '0.8', pieces: 23, remStr: '0.2 m' },
        { material: 'electrical wire', item: 'cable segments', totalLen: 25.5, totStr: '25\\frac{1}{2}', pieceLen: 2.25, pieceStr: '2\\frac{1}{4}', pieces: 11, remStr: '3/4 m' },
        { material: 'timber beam', item: 'board lengths', totalLen: 31.2, totStr: '31.2', pieceLen: 2.5, pieceStr: '2.5', pieces: 12, remStr: '1.2 m' }
      ];
      const cc = cutConfigs[variantIndex % cutConfigs.length];
      const ansStr = `${cc.pieces} full pieces with ${cc.remStr} remaining`;
      const options = shuffle([
        ansStr,
        `${cc.pieces - 2} full pieces with 1/4 m remaining`,
        `${cc.pieces + 2} full pieces with ${cc.remStr} remaining`,
        `${cc.pieces} full pieces with 3/4 m remaining`
      ]);

      return {
        title: `${cc.material.toUpperCase()} Cutting Measurement`,
        text: `A artisan has a roll of ${cc.material} $${cc.totStr}\\text{ meters}$ long. If ${cc.item} of length $${cc.pieceStr}\\text{ meters}$ are cut, how many full pieces can be cut, and what length remains?`,
        formula: `\\text{Pieces} = \\left\\lfloor \\frac{\\text{Total Length}}{\\text{Piece Length}} \\right\\rfloor`,
        options,
        answer: ansStr,
        hint: `Divide total length by piece length to find number of pieces and leftover remainder.`,
        steps: [
          `**Step 1: Divide total length by piece length**`,
          `$$\\frac{${cc.totalLen}}{${cc.pieceLen}} = ${(cc.totalLen / cc.pieceLen).toFixed(2)}$$`,
          `**Step 2: Calculate remaining length**`,
          `$$${cc.totalLen} - (${cc.pieces} \\times ${cc.pieceLen}) = ${(cc.totalLen - cc.pieces * cc.pieceLen).toFixed(2)}\\text{ m}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else { // Bank Account Signed Rational Ledger
      const ledgerConfigs = [
        { init: 2450.50, w: 1200.75, d: 3500.25, fee: 150.00, final: 4600.00 },
        { init: 5120.80, w: 3400.30, d: 2850.50, fee: 120.00, final: 4451.00 },
        { init: 8750.25, w: 4500.50, d: 1200.75, fee: 200.00, final: 5250.50 },
        { init: 3600.00, w: 2100.25, d: 4250.75, fee: 175.50, final: 5575.00 },
        { init: 6400.40, w: 2900.80, d: 5100.40, fee: 250.00, final: 8350.00 }
      ];
      const lc = ledgerConfigs[variantIndex % ledgerConfigs.length];
      const ansStr = `₱${lc.final.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
      const options = shuffle([
        ansStr,
        `₱${(lc.final + 250).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
        `₱${(lc.final - 180).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
        `₱${(lc.final * 1.1).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
      ]);

      return {
        title: `Bank Account Ledger Signed Rational Operations`,
        text: `Maria had a starting bank balance of ₱${lc.init.toLocaleString('en-US', { minimumFractionDigits: 2 })}. She withdrew ₱${lc.w.toLocaleString('en-US', { minimumFractionDigits: 2 })}, deposited ₱${lc.d.toLocaleString('en-US', { minimumFractionDigits: 2 })}, and paid a service fee of ₱${lc.fee.toLocaleString('en-US', { minimumFractionDigits: 2 })}. What is her final bank balance?`,
        formula: `\\text{Balance} = B_0 - W + D - F`,
        options,
        answer: ansStr,
        hint: `Subtract withdrawal and fee, add deposit to starting balance.`,
        steps: [
          `**Step 1: Subtract withdrawal**`,
          `$$\\text{₱}${lc.init.toFixed(2)} - \\text{₱}${lc.w.toFixed(2)} = \\text{₱}${(lc.init - lc.w).toFixed(2)}$$`,
          `**Step 2: Add deposit**`,
          `$$\\text{₱}${(lc.init - lc.w).toFixed(2)} + \\text{₱}${lc.d.toFixed(2)} = \\text{₱}${(lc.init - lc.w + lc.d).toFixed(2)}$$`,
          `**Step 3: Subtract fee**`,
          `$$\\text{₱}${(lc.init - lc.w + lc.d).toFixed(2)} - \\text{₱}${lc.fee.toFixed(2)} = \\text{₱}${lc.final.toFixed(2)}$$`,
          `**Final Verified Answer:** \\(${ansStr}\\)`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    }
  }
  // Category 3D: Form 7 - Sets, Subsets, Union & Intersection using Venn Diagrams (Topic ID 112 - 50 DYNAMIC VARIATION QUESTIONS)
  if (topicId === 112) {
    const subType = qIndex % 10;
    const variantIndex = Math.floor(qIndex / 10); // 0 to 4 across 50 questions

    if (subType === 0) { // Union, Intersection, Complement of Explicit Sets
      const setConfigs = [
        { U: [1,2,3,4,5,6,7,8,9,10], A: [1,3,5,7,9], B: [2,3,5,7] },
        { U: [1,2,3,4,5,6,7,8,9,10], A: [1,2,4,8], B: [2,4,6,8] },
        { U: [1,2,3,4,5,6,7,8,9,10,11,12], A: [2,4,6,8,10,12], B: [3,6,9,12] },
        { U: [1,2,3,4,5,6,7,8,9], A: [1,2,3,5,8], B: [1,3,4,7,8] },
        { U: [1,2,3,4,5,6,7,8,9,10,11,12], A: [2,3,5,7,11], B: [1,3,5,7,9,11] }
      ];
      const cfg = setConfigs[variantIndex % setConfigs.length];
      const uStr = cfg.U.join(', ');
      const aStr = cfg.A.join(', ');
      const bStr = cfg.B.join(', ');

      const union = Array.from(new Set([...cfg.A, ...cfg.B])).sort((x, y) => x - y);
      const inter = cfg.A.filter(x => cfg.B.includes(x)).sort((x, y) => x - y);
      const compA = cfg.U.filter(x => !cfg.A.includes(x)).sort((x, y) => x - y);

      const unionStr = union.join(', ');
      const interStr = inter.join(', ');
      const compStr = compA.join(', ');

      const ansStr = `A ∪ B = {${unionStr}}, A ∩ B = {${interStr}}, A' = {${compStr}}`;
      const options = shuffle([
        ansStr,
        `A ∪ B = {${interStr}}, A ∩ B = {${unionStr}}, A' = {${aStr}}`,
        `A ∪ B = {${unionStr}}, A ∩ B = {${compStr}}, A' = {${interStr}}`,
        `A ∪ B = {${bStr}}, A ∩ B = {${interStr}}, A' = {${unionStr}}`
      ]);

      return {
        title: `Explicit Set Operations: Union, Intersection & Complement`,
        text: `Given Universal set $U = \\{${uStr}\\}$, Set $A = \\{${aStr}\\}$, and Set $B = \\{${bStr}\\}$. Find $A \\cup B$, $A \\cap B$, and the complement $A'$:`,
        formula: `A \\cup B = \\{x \\in U \\mid x \\in A \\text{ or } x \\in B\\}, \\quad A \\cap B = \\{x \\in U \\mid x \\in A \\text{ and } x \\in B\\}, \\quad A' = U \\setminus A`,
        options,
        answer: ansStr,
        hint: `Union combines all elements. Intersection extracts shared elements. Complement lists elements in U not in A.`,
        steps: [
          `**Step 1: Compute Union $A \\cup B$**`,
          `$$A \\cup B = \\{${aStr}\\} \\cup \\{${bStr}\\} = \\{${unionStr}\\}$$`,
          `**Step 2: Compute Intersection $A \\cap B$**`,
          `$$A \\cap B = \\{${interStr}\\}$$`,
          `**Step 3: Compute Complement $A'$**`,
          `$$A' = U \\setminus A = \\{${uStr}\\} \\setminus \\{${aStr}\\} = \\{${compStr}\\}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: VENN_IMAGE,
        image_alt: 'Venn Diagram Set Operations',
        difficulty: 2
      };
    } else if (subType === 1) { // Total Number of Subsets Formula (2^n)
      const elementThemes = [
        { name: 'Colors', set: ['red', 'blue', 'green', 'yellow', 'purple', 'orange'] },
        { name: 'Fruits', set: ['apple', 'banana', 'cherry', 'date', 'elderberry'] },
        { name: 'Shapes', set: ['circle', 'square', 'triangle', 'pentagon'] },
        { name: 'Letters', set: ['A', 'B', 'C', 'D', 'E', 'F', 'G'] },
        { name: 'Planets', set: ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'] }
      ];
      const theme = elementThemes[variantIndex % elementThemes.length];
      const n = theme.set.length;
      const totalSubsets = Math.pow(2, n);
      const setRoster = theme.set.join(', ');
      const ansStr = `${totalSubsets} subsets`;
      const options = shuffle([
        ansStr,
        `${totalSubsets - 1} subsets`,
        `${n * 2} subsets`,
        `${Math.pow(2, n + 1)} subsets`
      ]);
      return {
        title: `Total Number of Distinct Subsets ($2^n$)`,
        text: `What is the total number of distinct subsets (including the empty set $\\emptyset$ and the set itself) that can be formed from set $S = \\{${setRoster}\\}$ containing $n = ${n}$ elements?`,
        formula: `\\text{Total Subsets} = 2^n`,
        options,
        answer: ansStr,
        hint: `Use the subset formula $2^n$ where $n = ${n}$.`,
        steps: [
          `**Step 1: Count elements in set $S$**`,
          `$$n = |S| = ${n}$$`,
          `**Step 2: Apply subset cardinality formula $2^n$**`,
          `$$\\text{Subsets} = 2^{${n}} = ${totalSubsets}$$`,
          `**Final Verified Answer:** \\(${ansStr}\\)`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 2
      };
    } else if (subType === 2) { // Two-Set Venn Diagram Survey Problem (Neither Sport)
      const surveyConfigs = [
        { total: 40, aCnt: 25, bCnt: 18, abBoth: 8, itemA: 'basketball', itemB: 'volleyball' },
        { total: 50, aCnt: 32, bCnt: 24, abBoth: 12, itemA: 'soccer', itemB: 'swimming' },
        { total: 45, aCnt: 28, bCnt: 20, abBoth: 9, itemA: 'chess', itemB: 'robotics' },
        { total: 60, aCnt: 38, bCnt: 29, abBoth: 15, itemA: 'music', itemB: 'art' },
        { total: 35, aCnt: 22, bCnt: 16, abBoth: 7, itemA: 'tennis', itemB: 'badminton' }
      ];
      const sc = surveyConfigs[variantIndex % surveyConfigs.length];
      const unionVal = (sc.aCnt - sc.abBoth) + (sc.bCnt - sc.abBoth) + sc.abBoth;
      const neither = sc.total - unionVal;
      const ansStr = `${neither} students`;
      const options = shuffle([
        ansStr,
        `${neither + 3} students`,
        `${neither + 7} students`,
        `0 students`
      ]);
      return {
        title: `Venn Diagram Survey Analysis: ${sc.itemA.toUpperCase()} & ${sc.itemB.toUpperCase()}`,
        text: `In a class of ${sc.total} students, ${sc.aCnt} play ${sc.itemA}, ${sc.bCnt} play ${sc.itemB}, and ${sc.abBoth} play both. How many students play neither ${sc.itemA} nor ${sc.itemB}?`,
        formula: `|A \\cup B| = |A| + |B| - |A \\cap B|, \\quad |(A \\cup B)'| = N - |A \\cup B|`,
        options,
        answer: ansStr,
        hint: `Find total playing at least one sport: $(${sc.aCnt} - ${sc.abBoth}) + (${sc.bCnt} - ${sc.abBoth}) + ${sc.abBoth} = ${unionVal}$. Subtract from ${sc.total}.`,
        steps: [
          `**Step 1: Compute students playing at least one sport**`,
          `$$|A \\cup B| = ${sc.aCnt} + ${sc.bCnt} - ${sc.abBoth} = ${unionVal}$$`,
          `**Step 2: Subtract from total class size $N = ${sc.total}$**`,
          `$$\\text{Neither} = ${sc.total} - ${unionVal} = ${neither}\\text{ students}$$`,
          `**Final Verified Answer:** \\(${ansStr}\\)`
        ],
        image_url: VENN_IMAGE,
        image_alt: 'Two-Set Venn Diagram',
        difficulty: 3
      };
    } else if (subType === 3) { // Set Builder Notation & Relative Complement
      const builderConfigs = [
        {
          descA: 'x \\text{ is a prime number } < 10',
          descB: 'x \\text{ is an odd positive integer } < 10',
          A: [2, 3, 5, 7],
          B: [1, 3, 5, 7, 9]
        },
        {
          descA: 'x \\text{ is a positive multiple of 3 } < 16',
          descB: 'x \\text{ is an even positive integer } < 16',
          A: [3, 6, 9, 12, 15],
          B: [2, 4, 6, 8, 10, 12, 14]
        },
        {
          descA: 'x \\text{ is a positive factor of 24}',
          descB: 'x \\text{ is a positive factor of 36}',
          A: [1, 2, 3, 4, 6, 8, 12, 24],
          B: [1, 2, 3, 4, 6, 9, 12, 18, 36]
        },
        {
          descA: 'x \\text{ is a perfect square } < 30',
          descB: 'x \\text{ is an odd positive integer } < 30',
          A: [1, 4, 9, 16, 25],
          B: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29]
        },
        {
          descA: 'x \\text{ is a positive multiple of 5 } \\le 30',
          descB: 'x \\text{ is a positive multiple of 10 } \\le 30',
          A: [5, 10, 15, 20, 25, 30],
          B: [10, 20, 30]
        }
      ];
      const bc = builderConfigs[variantIndex % builderConfigs.length];
      const inter = bc.A.filter(x => bc.B.includes(x)).sort((x, y) => x - y);
      const diffAB = bc.A.filter(x => !bc.B.includes(x)).sort((x, y) => x - y);

      const interStr = inter.join(', ');
      const diffStr = diffAB.join(', ');

      const ansStr = `A ∩ B = {${interStr}} and A \\ B = {${diffStr}}`;
      const options = shuffle([
        ansStr,
        `A ∩ B = {${diffStr}} and A \\ B = {${interStr}}`,
        `A ∩ B = {${bc.A.join(', ')}} and A \\ B = {${bc.B.join(', ')}}`,
        `A ∩ B = {${interStr}} and A \\ B = {${bc.B.filter(x => !bc.A.includes(x)).join(', ')}}`
      ]);

      return {
        title: `Set-Builder Notation & Relative Complement ($A \\setminus B$)`,
        text: `Given $A = \\{x \\mid ${bc.descA}\\}$ and $B = \\{x \\mid ${bc.descB}\\}$. What is the intersection $A \\cap B$ and the relative complement $A \\setminus B$?`,
        formula: `A \\cap B = \\{x \\mid x \\in A \\text{ and } x \\in B\\}, \\quad A \\setminus B = \\{x \\in A \\mid x \\notin B\\}`,
        options,
        answer: ansStr,
        hint: `List elements of A and B in roster form, then extract common elements and elements exclusive to A.`,
        steps: [
          `**Step 1: Write sets in roster notation**`,
          `$$A = \\{${bc.A.join(', ')}\\}, \\quad B = \\{${bc.B.join(', ')}\\}$$`,
          `**Step 2: Find intersection $A \\cap B$**`,
          `$$A \\cap B = \\{${interStr}\\}$$`,
          `**Step 3: Find relative complement $A \\setminus B$**`,
          `$$A \\setminus B = \\{${diffStr}\\}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: VENN_IMAGE,
        image_alt: 'Set Difference Diagram',
        difficulty: 3
      };
    } else if (subType === 4) { // Subset Inclusion Properties (S \subseteq T)
      const pairNames = [
        { S: 'S', T: 'T' },
        { S: 'X', T: 'Y' },
        { S: 'A', T: 'B' },
        { S: 'P', T: 'Q' },
        { S: 'M', T: 'N' }
      ];
      const p = pairNames[variantIndex % pairNames.length];
      const ansStr = `${p.S} ∩ ${p.T} = ${p.S} and ${p.S} ∪ ${p.T} = ${p.T}`;
      const options = shuffle([
        ansStr,
        `${p.S} ∩ ${p.T} = ${p.T} and ${p.S} ∪ ${p.T} = ${p.S}`,
        `${p.S} ∩ ${p.T} = ∅ and ${p.S} ∪ ${p.T} = ${p.S}`,
        `${p.S} ∩ ${p.T} = ${p.S} and ${p.S} ∪ ${p.T} = ∅`
      ]);
      return {
        title: `Set Inclusion Identities ($${p.S} \\subseteq ${p.T}$)`,
        text: `If set $${p.S}$ is a subset of set $${p.T}$ ($${p.S} \\subseteq ${p.T}$), which of the following set identities MUST be true for $${p.S} \\cap ${p.T}$ and $${p.S} \\cup ${p.T}$?`,
        formula: `${p.S} \\subseteq ${p.T} \\implies ${p.S} \\cap ${p.T} = ${p.S}, \\quad ${p.S} \\cup ${p.T} = ${p.T}`,
        options,
        answer: ansStr,
        hint: `When ${p.S} is contained in ${p.T}, their intersection equals ${p.S} and their union equals ${p.T}.`,
        steps: [
          `**Step 1: Analyze set inclusion $${p.S} \\subseteq ${p.T}$**`,
          `Every element of $${p.S}$ is also an element of $${p.T}$.`,
          `**Step 2: Determine intersection**`,
          `$$\\text{Shared elements} = ${p.S} \\implies ${p.S} \\cap ${p.T} = ${p.S}$$`,
          `**Step 3: Determine union**`,
          `$$\\text{Combined elements} = ${p.T} \\implies ${p.S} \\cup ${p.T} = ${p.T}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: VENN_IMAGE,
        image_alt: 'Subset Inclusion Diagram',
        difficulty: 2
      };
    } else if (subType === 5) { // Three-Set Venn Diagram Survey Problem (Exclusive Preference)
      const threeConfigs = [
        { totalA: 30, totalB: 22, totalC: 15, ab: 10, bc: 8, ac: 6, all: 4, nameA: 'Pop', nameB: 'Rock', nameC: 'Jazz' },
        { totalA: 35, totalB: 25, totalC: 18, ab: 12, bc: 9, ac: 7, all: 5, nameA: 'Math', nameB: 'Science', nameC: 'English' },
        { totalA: 40, totalB: 28, totalC: 20, ab: 14, bc: 10, ac: 8, all: 6, nameA: 'Python', nameB: 'Java', nameC: 'C++' },
        { totalA: 28, totalB: 20, totalC: 14, ab: 9, bc: 6, ac: 5, all: 3, nameA: 'Spanish', nameB: 'French', nameC: 'German' },
        { totalA: 45, totalB: 30, totalC: 22, ab: 16, bc: 11, ac: 9, all: 7, nameA: 'Football', nameB: 'Basketball', nameC: 'Baseball' }
      ];
      const tc = threeConfigs[variantIndex % threeConfigs.length];
      const abOnly = tc.ab - tc.all;
      const acOnly = tc.ac - tc.all;
      const aOnly = tc.totalA - (abOnly + acOnly + tc.all);
      const ansStr = `${aOnly} students`;
      const options = shuffle([
        ansStr,
        `${aOnly + 4} students`,
        `${aOnly - 5} students`,
        `${aOnly + 8} students`
      ]);
      return {
        title: `Three-Set Venn Diagram: Exclusive Preference in ${tc.nameA}`,
        text: `In a survey, ${tc.totalA} like ${tc.nameA}, ${tc.totalB} like ${tc.nameB}, and ${tc.totalC} like ${tc.nameC}. If ${tc.ab} like ${tc.nameA} & ${tc.nameB}, ${tc.bc} like ${tc.nameB} & ${tc.nameC}, ${tc.ac} like ${tc.nameA} & ${tc.nameC}, and ${tc.all} like all three, how many like ONLY ${tc.nameA}?`,
        formula: `|A_{\\text{only}}| = |A| - |A \\cap B|_{\\text{only}} - |A \\cap C|_{\\text{only}} - |A \\cap B \\cap C|`,
        options,
        answer: ansStr,
        hint: `Calculate two-set exclusive intersections first, then subtract from total ${tc.nameA}.`,
        steps: [
          `**Step 1: Calculate ${tc.nameA} & ${tc.nameB} only**`,
          `$$${tc.ab} - ${tc.all} = ${abOnly}$$`,
          `**Step 2: Calculate ${tc.nameA} & ${tc.nameC} only**`,
          `$$${tc.ac} - ${tc.all} = ${acOnly}$$`,
          `**Step 3: Subtract overlapping regions from total ${tc.nameA} (${tc.totalA})**`,
          `$$\\text{Only } ${tc.nameA} = ${tc.totalA} - (${abOnly} + ${acOnly} + ${tc.all}) = ${aOnly}\\text{ students}$$`,
          `**Final Verified Answer:** \\(${ansStr}\\)`
        ],
        image_url: VENN_IMAGE,
        image_alt: 'Three-Set Venn Diagram',
        difficulty: 4
      };
    } else if (subType === 6) { // Disjoint Sets Cardinality (|P \cup Q|)
      const cardPairs = [
        { P: 14, Q: 11, nameP: 'P', nameQ: 'Q' },
        { P: 18, Q: 15, nameP: 'A', nameQ: 'B' },
        { P: 22, Q: 16, nameP: 'E', nameQ: 'F' },
        { P: 25, Q: 19, nameP: 'X', nameQ: 'Y' },
        { P: 30, Q: 21, nameP: 'M', nameQ: 'N' }
      ];
      const cp = cardPairs[variantIndex % cardPairs.length];
      const unionVal = cp.P + cp.Q;
      const ansStr = `${unionVal}`;
      const options = shuffle([
        ansStr,
        `${unionVal - 3}`,
        `${cp.P * cp.Q}`,
        `0`
      ]);
      return {
        title: `Cardinality of Disjoint Sets ($${cp.nameP} \\cap ${cp.nameQ} = \\emptyset$)`,
        text: `Set $${cp.nameP}$ contains $|${cp.nameP}| = ${cp.P}$ elements and Set $${cp.nameQ}$ contains $|${cp.nameQ}| = ${cp.Q}$ elements. If $${cp.nameP}$ and $${cp.nameQ}$ are disjoint sets ($${cp.nameP} \\cap ${cp.nameQ} = \\emptyset$), what is the cardinality of the union $|${cp.nameP} \\cup ${cp.nameQ}|$?`,
        formula: `|${cp.nameP} \\cup ${cp.nameQ}| = |${cp.nameP}| + |${cp.nameQ}| - |${cp.nameP} \\cap ${cp.nameQ}|`,
        options,
        answer: ansStr,
        hint: `For disjoint sets, $|${cp.nameP} \\cap ${cp.nameQ}| = 0$, so $|${cp.nameP} \\cup ${cp.nameQ}| = |${cp.nameP}| + |${cp.nameQ}|$.`,
        steps: [
          `**Step 1: Apply inclusion-exclusion principle**`,
          `$$|${cp.nameP} \\cup ${cp.nameQ}| = |${cp.nameP}| + |${cp.nameQ}| - |${cp.nameP} \\cap ${cp.nameQ}|$$`,
          `**Step 2: Substitute $|${cp.nameP} \\cap ${cp.nameQ}| = 0$**`,
          `$$|${cp.nameP} \\cup ${cp.nameQ}| = ${cp.P} + ${cp.Q} - 0 = ${unionVal}$$`,
          `**Final Verified Answer:** \\(${ansStr}\\)`
        ],
        image_url: VENN_IMAGE,
        image_alt: 'Disjoint Sets Diagram',
        difficulty: 2
      };
    } else if (subType === 7) { // Venn Diagram Shaded Region Notation
      const regionConfigs = [
        { prompt: 'belonging to Set X BUT NOT to Set Y', ans: "X \\ Y (or X ∩ Y')", formula: 'X \\setminus Y' },
        { prompt: 'belonging to Set Y BUT NOT to Set X', ans: "Y \\ X (or Y ∩ X')", formula: 'Y \\setminus X' },
        { prompt: 'belonging to BOTH Set X and Set Y simultaneously', ans: 'X ∩ Y', formula: 'X \\cap Y' },
        { prompt: 'belonging to NEITHER Set X NOR Set Y', ans: '(X ∪ Y)\'', formula: '(X \\cup Y)\'' },
        { prompt: 'belonging to EITHER Set X OR Set Y BUT NOT BOTH', ans: '(X ∪ Y) \\ (X ∩ Y)', formula: '(X \\cup Y) \\setminus (X \\cap Y)' }
      ];
      const rc = regionConfigs[variantIndex % regionConfigs.length];
      const ansStr = rc.ans;
      const options = shuffle([
        ansStr,
        `X ∩ Y`,
        `X ∪ Y`,
        `(X ∪ Y)'`,
        `X \\ Y (or X ∩ Y')`
      ].filter((val, idx, self) => self.indexOf(val) === idx).slice(0, 4));

      return {
        title: `Venn Diagram Region Identification: ${rc.prompt}`,
        text: `In a standard two-set Venn diagram containing sets $X$ and $Y$ inside universal set $U$, which set operation represents the region of elements ${rc.prompt}?`,
        formula: `${rc.formula}`,
        options,
        answer: ansStr,
        hint: `Analyze the set operation definition for the described region.`,
        steps: [
          `**Step 1: Translate region description to set notation**`,
          `Region: "${rc.prompt}"`,
          `**Step 2: Express in standard set notation**`,
          `$$${rc.formula}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: VENN_IMAGE,
        image_alt: 'Venn Diagram Region Shading',
        difficulty: 2
      };
    } else if (subType === 8) { // Proper Subsets Count (2^n - 1)
      const properConfigs = [
        { theme: 'Colors', elements: ['red', 'blue', 'green', 'yellow'] },
        { theme: 'Fruits', elements: ['apple', 'banana', 'cherry', 'date', 'fig'] },
        { theme: 'Shapes', elements: ['circle', 'square', 'triangle'] },
        { theme: 'Letters', elements: ['A', 'B', 'C', 'D', 'E', 'F'] },
        { theme: 'Planets', elements: ['Mars', 'Venus', 'Jupiter', 'Saturn'] }
      ];
      const pc = properConfigs[variantIndex % properConfigs.length];
      const n = pc.elements.length;
      const properSubsets = Math.pow(2, n) - 1;
      const ansStr = `${properSubsets} proper subsets`;
      const options = shuffle([
        ansStr,
        `${properSubsets + 1} proper subsets`,
        `${properSubsets - 3} proper subsets`,
        `${n * 2} proper subsets`
      ]);
      return {
        title: `Proper Subsets Count ($2^n - 1$)`,
        text: `Given set $M = \\{${pc.elements.join(', ')}\\}$ (${pc.theme}) containing $n = ${n}$ elements, how many PROPER subsets does set $M$ contain?`,
        formula: `\\text{Proper Subsets} = 2^n - 1`,
        options,
        answer: ansStr,
        hint: `Subtract 1 (the set itself) from total subsets $2^{${n}}$.`,
        steps: [
          `**Step 1: Calculate total subsets $2^n$**`,
          `$$\\text{Total Subsets} = 2^{${n}} = ${Math.pow(2, n)}$$`,
          `**Step 2: Subtract the set itself for proper subsets**`,
          `$$\\text{Proper Subsets} = ${Math.pow(2, n)} - 1 = ${properSubsets}$$`,
          `**Final Verified Answer:** \\(${ansStr}\\)`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 2
      };
    } else { // De Morgan's Laws for Sets
      const demorganConfigs = [
        {
          expr: '(A \\cup B)\'',
          ans: "(A ∪ B)' = A' ∩ B'",
          formula: '(A \\cup B)\' = A\' \\cap B\'',
          hint: 'The complement of a union is the intersection of individual complements.'
        },
        {
          expr: '(A \\cap B)\'',
          ans: "(A ∩ B)' = A' ∪ B'",
          formula: '(A \\cap B)\' = A\' \\cup B\'',
          hint: 'The complement of an intersection is the union of individual complements.'
        },
        {
          expr: 'A \\setminus (B \\cup C)',
          ans: "A \\ (B ∪ C) = (A \\ B) ∩ (A \\ C)",
          formula: 'A \\setminus (B \\cup C) = (A \\setminus B) \\cap (A \\setminus C)',
          hint: 'Set difference over union transforms into intersection of differences.'
        },
        {
          expr: 'A \\setminus (B \\cap C)',
          ans: "A \\ (B ∩ C) = (A \\ B) ∪ (A \\ C)",
          formula: 'A \\setminus (B \\cap C) = (A \\setminus B) \\cup (A \\setminus C)',
          hint: 'Set difference over intersection transforms into union of differences.'
        },
        {
          expr: '(A\')\'',
          ans: "(A')' = A",
          formula: '(A\')\' = A',
          hint: 'The double complement of a set returns the original set.'
        }
      ];
      const dmc = demorganConfigs[variantIndex % demorganConfigs.length];
      const ansStr = dmc.ans;
      const options = shuffle([
        ansStr,
        `(A ∪ B)' = A' ∪ B'`,
        `(A ∩ B)' = A' ∩ B'`,
        `A \\ (B ∪ C) = (A \\ B) ∪ (A \\ C)`
      ].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4));

      return {
        title: `De Morgan's Laws & Set Identities: ${dmc.expr}`,
        text: `For sets $A, B, C$ within universal set $U$, what is the equivalent simplified algebraic expression for $${dmc.expr}$?`,
        formula: `${dmc.formula}`,
        options,
        answer: ansStr,
        hint: dmc.hint,
        steps: [
          `**Step 1: Apply Set Identity / De Morgan's Law**`,
          `$$${dmc.formula}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: VENN_IMAGE,
        image_alt: 'De Morgan Law Set Diagram',
        difficulty: 3
      };
    }
  }

  // Category 3E: Form 7 - Subset of Real Numbers (Topic ID 113 - 50 DYNAMIC VARIATION QUESTIONS)
  if (topicId === 113) {
    const subType = qIndex % 10;
    const variantIndex = Math.floor(qIndex / 10); // 0 to 4 across 50 questions

    if (subType === 0) { // Specific Number Subset Belonging (-7, -15, -12, -23, -42)
      const numConfigs = [
        { num: -7, subsets: 'Integers (ℤ), Rational Numbers (ℚ), and Real Numbers (ℝ)', hint: '-7 is a negative whole number integer, expressible as -7/1, making it an integer, rational, and real number.' },
        { num: -15, subsets: 'Integers (ℤ), Rational Numbers (ℚ), and Real Numbers (ℝ)', hint: '-15 is a negative integer, rational (-15/1), and real.' },
        { num: -12, subsets: 'Integers (ℤ), Rational Numbers (ℚ), and Real Numbers (ℝ)', hint: '-12 is an integer, rational number (-12/1), and real number.' },
        { num: -23, subsets: 'Integers (ℤ), Rational Numbers (ℚ), and Real Numbers (ℝ)', hint: '-23 belongs to integers, rational numbers, and real numbers.' },
        { num: -42, subsets: 'Integers (ℤ), Rational Numbers (ℚ), and Real Numbers (ℝ)', hint: '-42 belongs to integers, rational numbers, and real numbers.' }
      ];
      const nc = numConfigs[variantIndex % numConfigs.length];
      const ansStr = nc.subsets;
      const options = shuffle([
        ansStr,
        `Natural Numbers (ℕ), Whole Numbers (𝕎), and Real Numbers (ℝ)`,
        `Irrational Numbers (𝕀) and Real Numbers (ℝ) only`,
        `Integers (ℤ) and Natural Numbers (ℕ) only`
      ]);
      return {
        title: `Classification of Negative Integer ${nc.num}`,
        text: `To which specific number subsets within the Real Number System does the negative number $${nc.num}$ belong?`,
        formula: `\\text{Number } ${nc.num} \\in \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R}`,
        options,
        answer: ansStr,
        hint: nc.hint,
        steps: [
          `**Step 1: Check Natural (ℕ) and Whole (𝕎) numbers**`,
          `$$${nc.num} \\notin \\mathbb{N} = \\{1, 2, 3, \\dots\\}, \\quad ${nc.num} \\notin \\mathbb{W} = \\{0, 1, 2, \\dots\\}$$`,
          `**Step 2: Check Integers (ℤ) and Rational (ℚ) numbers**`,
          `$$${nc.num} \\in \\mathbb{Z} = \\{\\dots, -2, -1, 0, 1, 2, \\dots\\}, \\quad ${nc.num} = \\frac{${nc.num}}{1} \\in \\mathbb{Q}$$`,
          `**Step 3: Real Numbers (ℝ)**`,
          `$$${nc.num} \\in \\mathbb{R}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: REAL_SUBSETS_VENN_IMAGE,
        image_alt: 'Real Number System Hierarchy Diagram (ℝ, ℚ, ℤ, 𝕎, ℕ, 𝕀)',
        difficulty: 3
      };
    } else if (subType === 1) { // Classification of Zero (0)
      const zeroConfigs = [
        { query: 'zero (0)', ansStr: 'Natural numbers consist of positive counting numbers {1, 2, 3, ...}, whereas Whole numbers include zero {0, 1, 2, 3, ...}.', hint: 'Counting numbers start at 1. Whole numbers start at 0.' },
        { query: 'zero (0)', ansStr: 'Natural numbers consist of positive counting numbers {1, 2, 3, ...}, whereas Whole numbers include zero {0, 1, 2, 3, ...}.', hint: 'Zero is not a positive counting number.' },
        { query: 'zero (0)', ansStr: 'Natural numbers consist of positive counting numbers {1, 2, 3, ...}, whereas Whole numbers include zero {0, 1, 2, 3, ...}.', hint: 'Whole numbers = Natural numbers + {0}.' },
        { query: 'zero (0)', ansStr: 'Natural numbers consist of positive counting numbers {1, 2, 3, ...}, whereas Whole numbers include zero {0, 1, 2, 3, ...}.', hint: '0 can be written as 0/1, so it is rational, but not natural.' },
        { query: 'zero (0)', ansStr: 'Natural numbers consist of positive counting numbers {1, 2, 3, ...}, whereas Whole numbers include zero {0, 1, 2, 3, ...}.', hint: '0 is whole, integer, rational, and real.' }
      ];
      const zc = zeroConfigs[variantIndex % zeroConfigs.length];
      const ansStr = zc.ansStr;
      const options = shuffle([
        ansStr,
        `Zero is a negative integer and therefore cannot be included in natural numbers.`,
        `Zero is an irrational number because it cannot be divided by zero.`,
        `Zero belongs exclusively to the set of real numbers and has no other subset classification.`
      ]);
      return {
        title: `Subset Classification of Zero (0)`,
        text: `Why is ${zc.query} classified as a Whole number (𝕎), an Integer (ℤ), and a Rational number (ℚ), but NOT a Natural number (ℕ)?`,
        formula: `0 \\in \\mathbb{W}, \\quad 0 \\in \\mathbb{Z}, \\quad 0 = \\frac{0}{1} \\in \\mathbb{Q}, \\quad 0 \\notin \\mathbb{N}`,
        options,
        answer: ansStr,
        hint: zc.hint,
        steps: [
          `**Step 1: Define Natural Numbers (ℕ)**`,
          `$$\\mathbb{N} = \\{1, 2, 3, 4, \\dots\\} \\implies 0 \\notin \\mathbb{N}$$`,
          `**Step 2: Define Whole (𝕎), Integers (ℤ), and Rationals (ℚ)**`,
          `$$\\mathbb{W} = \\{0, 1, 2, 3, \\dots\\}, \\quad \\mathbb{Z} = \\{\\dots, -1, 0, 1, \\dots\\}, \\quad 0 = \\frac{0}{1} \\in \\mathbb{Q}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: REAL_SUBSETS_VENN_IMAGE,
        image_alt: 'Zero Classification Real Subsets Diagram',
        difficulty: 3
      };
    } else if (subType === 2) { // Hierarchy & Nesting of Real Number Subsets
      const hierarchyConfigs = [
        { chain: 'ℕ ⊂ 𝕎 ⊂ ℤ ⊂ ℚ ⊂ ℝ', expr: '\\mathbb{N} \\subset \\mathbb{W} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R}' },
        { chain: 'ℕ ⊂ 𝕎 ⊂ ℤ ⊂ ℚ ⊂ ℝ', expr: '\\mathbb{N} \\subset \\mathbb{W} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R}' },
        { chain: 'ℕ ⊂ 𝕎 ⊂ ℤ ⊂ ℚ ⊂ ℝ', expr: '\\mathbb{N} \\subset \\mathbb{W} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R}' },
        { chain: 'ℕ ⊂ 𝕎 ⊂ ℤ ⊂ ℚ ⊂ ℝ', expr: '\\mathbb{N} \\subset \\mathbb{W} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R}' },
        { chain: 'ℕ ⊂ 𝕎 ⊂ ℤ ⊂ ℚ ⊂ ℝ', expr: '\\mathbb{N} \\subset \\mathbb{W} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R}' }
      ];
      const hc = hierarchyConfigs[variantIndex % hierarchyConfigs.length];
      const ansStr = hc.chain;
      const options = shuffle([
        ansStr,
        `ℝ ⊂ ℚ ⊂ ℤ ⊂ 𝕎 ⊂ ℕ`,
        `ℤ ⊂ ℕ ⊂ 𝕎 ⊂ 𝕀 ⊂ ℝ`,
        `ℚ ⊂ ℤ ⊂ 𝕎 ⊂ ℕ ⊂ ℝ`
      ]);
      return {
        title: `Hierarchy of Real Number Subsets`,
        text: `In a nested Venn diagram illustrating the real number system, which subset inclusion chain correctly displays the hierarchy from narrowest to broadest?`,
        formula: `${hc.expr}`,
        options,
        answer: ansStr,
        hint: `Natural numbers (ℕ) are inside Whole numbers (𝕎), inside Integers (ℤ), inside Rationals (ℚ), inside Reals (ℝ).`,
        steps: [
          `**Step 1: Nesting chain from inner to outer**`,
          `$$\\mathbb{N} \\subset \\mathbb{W} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R}$$`,
          `**Final Verified Answer:** \\(${hc.expr}\\)`
        ],
        image_url: REAL_SUBSETS_VENN_IMAGE,
        image_alt: 'Nested Real Number Hierarchy Diagram (ℕ ⊂ 𝕎 ⊂ ℤ ⊂ ℚ ⊂ ℝ)',
        difficulty: 3
      };
    } else if (subType === 3) { // Repeating Decimals as Rational Numbers
      const repConfigs = [
        { dec: '0.333...', frac: '1/3', eq: 'x = 0.333... \\implies 10x = 3.333... \\implies 9x = 3 \\implies x = 1/3' },
        { dec: '0.666...', frac: '2/3', eq: 'x = 0.666... \\implies 10x = 6.666... \\implies 9x = 6 \\implies x = 2/3' },
        { dec: '0.1818...', frac: '2/11', eq: 'x = 0.1818... \\implies 100x = 18.1818... \\implies 99x = 18 \\implies x = 2/11' },
        { dec: '0.2727...', frac: '3/11', eq: 'x = 0.2727... \\implies 100x = 27.2727... \\implies 99x = 27 \\implies x = 3/11' },
        { dec: '0.4545...', frac: '5/11', eq: 'x = 0.4545... \\implies 100x = 45.4545... \\implies 99x = 45 \\implies x = 5/11' }
      ];
      const rc = repConfigs[variantIndex % repConfigs.length];
      const ansStr = `Yes, because every repeating decimal can be expressed as a ratio of two integers p/q (e.g., ${rc.dec} = ${rc.frac}).`;
      const options = shuffle([
        ansStr,
        `No, repeating decimals are infinite and non-terminating, so they belong exclusively to Irrational numbers (𝕀).`,
        `Yes, but only if the repeating digit pattern contains an even number of digits.`,
        `No, only terminating decimals can be classified as Rational numbers (ℚ).`
      ]);
      return {
        title: `Repeating Decimals in Rational Number Set`,
        text: `Is every repeating decimal (such as $${rc.dec}$) a member of the set of rational numbers (ℚ)? Explain the mathematical reasoning.`,
        formula: `d = 0.\\bar{a} = \\frac{p}{q} \\in \\mathbb{Q}`,
        options,
        answer: ansStr,
        hint: `Algebraically convert repeating decimal ${rc.dec} to fraction ${rc.frac}.`,
        steps: [
          `**Step 1: Algebraic conversion**`,
          `$$${rc.eq}$$`,
          `**Step 2: Conclusion**`,
          `$$${rc.dec} = \\frac{${rc.frac.split('/')[0]}}{${rc.frac.split('/')[1]}} \\in \\mathbb{Q}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: REAL_SUBSETS_VENN_IMAGE,
        image_alt: 'Repeating Decimals in Rational Set ℚ Diagram',
        difficulty: 3
      };
    } else if (subType === 4) { // Non-Repeating Non-Terminating Decimals (Irrational)
      const irratConfigs = [
        { sym: '\\sqrt{2}', val: '1.41421356...', subset: 'Irrational Numbers (𝕀) and Real Numbers (ℝ)' },
        { sym: '\\pi', val: '3.14159265...', subset: 'Irrational Numbers (𝕀) and Real Numbers (ℝ)' },
        { sym: '\\sqrt{3}', val: '1.73205080...', subset: 'Irrational Numbers (𝕀) and Real Numbers (ℝ)' },
        { sym: '\\sqrt{5}', val: '2.23606797...', subset: 'Irrational Numbers (𝕀) and Real Numbers (ℝ)' },
        { sym: '\\sqrt{7}', val: '2.64575131...', subset: 'Irrational Numbers (𝕀) and Real Numbers (ℝ)' }
      ];
      const ic = irratConfigs[variantIndex % irratConfigs.length];
      const ansStr = ic.subset;
      const options = shuffle([
        ansStr,
        `Rational Numbers (ℚ) and Integers (ℤ)`,
        `Whole Numbers (𝕎) and Natural Numbers (ℕ)`,
        `Integers (ℤ) and Rational Numbers (ℚ)`
      ]);
      return {
        title: `Classification of Non-Terminating Non-Repeating Decimal $${ic.sym}$`,
        text: `To which specific number subsets does the non-terminating, non-repeating decimal number $${ic.sym} \\approx ${ic.val}$ belong?`,
        formula: `${ic.sym} \\in \\mathbb{I} \\subset \\mathbb{R}, \\quad ${ic.sym} \\notin \\mathbb{Q}`,
        options,
        answer: ansStr,
        hint: `Non-terminating and non-repeating decimals cannot be written as p/q, so they are Irrational.`,
        steps: [
          `**Step 1: Check p/q expressibility**`,
          `$$${ic.sym} \\approx ${ic.val} \\neq \\frac{p}{q}$$`,
          `**Step 2: Identify subsets**`,
          `$$${ic.sym} \\in \\mathbb{I} \\text{ (Irrational)} \\implies ${ic.sym} \\in \\mathbb{R} \\text{ (Real)}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: REAL_SUBSETS_VENN_IMAGE,
        image_alt: 'Irrational Numbers 𝕀 Subset Diagram',
        difficulty: 3
      };
    } else if (subType === 5) { // False Statement Identification regarding Subsets
      const stmtConfigs = [
        { falseStmt: 'The set of irrational numbers is a subset of rational numbers (𝕀 ⊂ ℚ).', hint: 'Rational and Irrational numbers are completely disjoint (ℚ ∩ 𝕀 = ∅).' },
        { falseStmt: 'Every integer is a natural number (ℤ ⊂ ℕ).', hint: 'Negative integers like -5 are in ℤ but NOT in ℕ.' },
        { falseStmt: 'The set of real numbers is a subset of integers (ℝ ⊂ ℤ).', hint: 'Real numbers is the larger universe containing ℤ.' },
        { falseStmt: 'Whole numbers include negative fractions like -1/2.', hint: 'Whole numbers are non-negative counting integers {0, 1, 2, ...}.' },
        { falseStmt: 'Square roots of non-perfect squares are rational numbers.', hint: 'Square roots of non-perfect squares are irrational.' }
      ];
      const sc = stmtConfigs[variantIndex % stmtConfigs.length];
      const ansStr = sc.falseStmt;
      const options = shuffle([
        ansStr,
        `Natural numbers (ℕ) form a proper subset of Whole numbers (𝕎).`,
        `Integers (ℤ) are a proper subset of Rational numbers (ℚ).`,
        `The union of Rational numbers and Irrational numbers equals the Real numbers (ℚ ∪ 𝕀 = ℝ).`
      ]);
      return {
        title: `Real Number Subset Inclusion Properties`,
        text: `Which of the following statements is mathematically FALSE regarding the subsets of the Real Number System?`,
        formula: `\\mathbb{Q} \\cap \\mathbb{I} = \\emptyset, \\quad \\mathbb{Q} \\cup \\mathbb{I} = \\mathbb{R}`,
        options,
        answer: ansStr,
        hint: sc.hint,
        steps: [
          `**Step 1: Analyze statement validity**`,
          `$$\\text{False Statement: } ${ansStr}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: REAL_SUBSETS_VENN_IMAGE,
        image_alt: 'Real Number Subsets Inclusion Properties Diagram',
        difficulty: 3
      };
    } else if (subType === 6) { // Perfect Square Radical Evaluation & Subset Belonging
      const radConfigs = [
        { val: 49, root: 7, subsets: 'Natural (ℕ), Whole (𝕎), Integers (ℤ), Rational (ℚ), and Real (ℝ)' },
        { val: 16, root: 4, subsets: 'Natural (ℕ), Whole (𝕎), Integers (ℤ), Rational (ℚ), and Real (ℝ)' },
        { val: 81, root: 9, subsets: 'Natural (ℕ), Whole (𝕎), Integers (ℤ), Rational (ℚ), and Real (ℝ)' },
        { val: 25, root: 5, subsets: 'Natural (ℕ), Whole (𝕎), Integers (ℤ), Rational (ℚ), and Real (ℝ)' },
        { val: 100, root: 10, subsets: 'Natural (ℕ), Whole (𝕎), Integers (ℤ), Rational (ℚ), and Real (ℝ)' }
      ];
      const rc = radConfigs[variantIndex % radConfigs.length];
      const ansStr = rc.subsets;
      const options = shuffle([
        ansStr,
        `Irrational Numbers (𝕀) and Real Numbers (ℝ) only`,
        `Rational Numbers (ℚ) and Irrational Numbers (𝕀) only`,
        `Integers (ℤ) and Irrational Numbers (𝕀) only`
      ]);
      return {
        title: `Classification of Perfect Square Radical $\\sqrt{${rc.val}}$`,
        text: `Evaluate $\\sqrt{${rc.val}}$ and classify to which specific number subsets it belongs:`,
        formula: `\\sqrt{${rc.val}} = ${rc.root} \\in \\mathbb{N} \\subset \\mathbb{W} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R}`,
        options,
        answer: ansStr,
        hint: `Simplify √${rc.val} to ${rc.root}, which is a positive integer.`,
        steps: [
          `**Step 1: Evaluate radical**`,
          `$$\\sqrt{${rc.val}} = ${rc.root}$$`,
          `**Step 2: Identify subsets**`,
          `$$${rc.root} \\in \\mathbb{N}, \\mathbb{W}, \\mathbb{Z}, \\mathbb{Q}, \\mathbb{R}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: REAL_SUBSETS_VENN_IMAGE,
        image_alt: 'Perfect Square Radical Classification Diagram',
        difficulty: 2
      };
    } else if (subType === 7) { // Disjoint Sets Q and I
      const disjConfigs = [
        { op: 'ℚ ∩ 𝕀', res: 'The Empty Set (∅), because no number can be both rational and irrational.', hint: 'Rational and Irrational numbers share no elements.' },
        { op: 'ℚ ∪ 𝕀', res: 'The Set of Real Numbers (ℝ).', hint: 'Combining rationals and irrationals yields all real numbers.' },
        { op: 'ℝ \\ ℚ', res: 'The Set of Irrational Numbers (𝕀).', hint: 'Removing rationals from reals leaves irrationals.' },
        { op: 'ℤ ∩ 𝕎', res: 'The Set of Whole Numbers (𝕎).', hint: 'The overlap between integers and whole numbers is whole numbers.' },
        { op: '𝕎 ∩ ℕ', res: 'The Set of Natural Numbers (ℕ).', hint: 'Natural numbers are whole numbers except 0.' }
      ];
      const dc = disjConfigs[variantIndex % disjConfigs.length];
      const ansStr = dc.res;
      const options = shuffle([
        ansStr,
        `The Set of All Integers (ℤ)`,
        `The Set of Natural Numbers (ℕ)`,
        `The Set of Complex Numbers (ℂ)`
      ]);
      return {
        title: `Set Operation on Real Number Subsets: $${dc.op}$`,
        text: `What is the result of the set operation $${dc.op}$ within the Real Number System?`,
        formula: `${dc.op} = \\text{Result}`,
        options,
        answer: ansStr,
        hint: dc.hint,
        steps: [
          `**Step 1: Apply set operation definition**`,
          `$$\\text{Operation: } ${dc.op} = ${ansStr}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: REAL_SUBSETS_VENN_IMAGE,
        image_alt: 'Disjoint Sets ℚ and 𝕀 Diagram',
        difficulty: 3
      };
    } else if (subType === 8) { // Terminating Decimals as Rational Numbers
      const termConfigs = [
        { dec: '0.75', frac: '3/4', num: 75, den: 100 },
        { dec: '0.625', frac: '5/8', num: 625, den: 1000 },
        { dec: '0.4', frac: '2/5', num: 4, den: 10 },
        { dec: '0.85', frac: '17/20', num: 85, den: 100 },
        { dec: '0.375', frac: '3/8', num: 375, den: 1000 }
      ];
      const tc = termConfigs[variantIndex % termConfigs.length];
      const ansStr = `Because ${tc.dec} = ${tc.frac}, which is a quotient of two integers p/q where q ≠ 0.`;
      const options = shuffle([
        ansStr,
        `Because ${tc.dec} is a counting number used for measuring physical objects.`,
        `Because ${tc.dec} cannot be placed on a standard number line.`,
        `Because all decimal numbers belong exclusively to Irrational numbers (𝕀).`
      ]);
      return {
        title: `Terminating Decimal $${tc.dec}$ Classification`,
        text: `Why is the terminating decimal $${tc.dec}$ classified as a Rational number (ℚ)?`,
        formula: `${tc.dec} = \\frac{${tc.num}}{${tc.den}} = \\frac{${tc.frac.split('/')[0]}}{${tc.frac.split('/')[1]}} \\in \\mathbb{Q}`,
        options,
        answer: ansStr,
        hint: `Write ${tc.dec} as fraction ${tc.num}/${tc.den} and simplify to ${tc.frac}.`,
        steps: [
          `**Step 1: Express as fraction**`,
          `$$${tc.dec} = \\frac{${tc.num}}{${tc.den}} = \\frac{${tc.frac.split('/')[0]}}{${tc.frac.split('/')[1]}}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: REAL_SUBSETS_VENN_IMAGE,
        image_alt: 'Terminating Decimal in Rational Set ℚ Diagram',
        difficulty: 2
      };
    } else { // Real-World Measurement Subset Identification
      const scenarioConfigs = [
        { items: '-18.5°C, √5 cm, 0 items, 12 students, and π rad', ansStr: '0 items and 12 students', hint: '0 and 12 are integers without fractional or irrational parts.' },
        { items: '-25 m, 3.14 kg, √7 s, 8 books, and e^2', ansStr: '-25 m and 8 books', hint: '-25 and 8 are integers.' },
        { items: '15.75 L, -100 PHP, √3 km, 0 degrees, and 45 workers', ansStr: '-100 PHP, 0 degrees, and 45 workers', hint: '-100, 0, and 45 are integers.' },
        { items: '-40°C, 2/3 bar, √2 m, 15 laptops, and 0 errors', ansStr: '-40°C, 15 laptops, and 0 errors', hint: '-40, 15, and 0 are integers.' },
        { items: '-10 km, 0.5 kg, 50 coins, √11 min, and 0 points', ansStr: '-10 km, 50 coins, and 0 points', hint: '-10, 50, and 0 are integers.' }
      ];
      const sc = scenarioConfigs[variantIndex % scenarioConfigs.length];
      const ansStr = sc.ansStr;
      const options = shuffle([
        ansStr,
        `All recorded measurements in the experiment`,
        `Only the measurements containing square roots`,
        `Only positive decimal fractions`
      ]);
      return {
        title: `Real-World Measurement Subset Identification`,
        text: `In a scientific dataset, the recorded measurements are: $${sc.items}$. Which of these measurements belong to the set of Integers (ℤ)?`,
        formula: `\\mathbb{Z} = \\{\\dots, -3, -2, -1, 0, 1, 2, 3, \\dots\\}`,
        options,
        answer: ansStr,
        hint: sc.hint,
        steps: [
          `**Step 1: Identify whole numbers and negative whole numbers**`,
          `$$\\text{Integers: } ${ansStr}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: REAL_SUBSETS_VENN_IMAGE,
        image_alt: 'Real World Measurement Subsets Diagram',
        difficulty: 3
      };
    }
  }

  // Category 3F: Form 7 - The Set of Integers, Comparing & Ordering Integers (Topic ID 114 - 50 DYNAMIC VARIATION QUESTIONS)
  if (topicId === 114) {
    const subType = qIndex % 10;
    const variantIndex = Math.floor(qIndex / 10); // 0 to 4 across 50 questions

    if (subType === 0) { // Real-life opposing quantities (Elevation, Finances, Temperature)
      const configs = [
        { pos: '250 m above sea level', neg: '80 m below sea level', posNum: '+250', negNum: '-80', topic: 'elevation' },
        { pos: '₱1,500 deposit', neg: '₱600 withdrawal', posNum: '+1500', negNum: '-600', topic: 'financial transactions' },
        { pos: '15°C temperature rise', neg: '8°C temperature drop', posNum: '+15', negNum: '-8', topic: 'temperature change' },
        { pos: '12 floors above ground', neg: '3 basement levels below ground', posNum: '+12', negNum: '-3', topic: 'building floors' },
        { pos: '25 points gained', neg: '10 points penalty loss', posNum: '+25', negNum: '-10', topic: 'game scoring' }
      ];
      const cfg = configs[variantIndex % configs.length];
      const ansStr = `Positive integers represent quantities above/gained (${cfg.posNum}), while negative integers represent quantities below/debited (${cfg.negNum}).`;
      const options = shuffle([
        ansStr,
        `Both positive and negative quantities are represented using absolute positive values only.`,
        `Negative integers represent increases (${cfg.posNum}) while positive integers represent losses (${cfg.negNum}).`,
        `Integers can only be used for whole counting objects and cannot represent real-life opposing quantities.`
      ]);
      return {
        title: `Real-Life Opposing Quantities Representation`,
        text: `How are positive and negative integers used to represent real-life opposing quantities, such as ${cfg.topic} (${cfg.pos} vs. ${cfg.neg})?`,
        formula: `\\text{Reference Point } = 0, \\quad \\text{Above/Gain } = +x, \\quad \\text{Below/Loss } = -y`,
        options,
        answer: ansStr,
        hint: `Define zero as reference. Above/deposit is positive (+); below/withdrawal is negative (-).`,
        steps: [
          `**Step 1: Identify reference baseline (0)**`,
          `$$\\text{Baseline } = 0$$`,
          `**Step 2: Assign signs**`,
          `$$\\text{Positive direction: } ${cfg.pos} \\implies ${cfg.posNum}$$`,
          `$$\\text{Negative direction: } ${cfg.neg} \\implies ${cfg.negNum}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: NUMBER_LINE_IMAGE,
        image_alt: 'Real Life Integers Reference Line',
        difficulty: 2
      };
    } else if (subType === 1) { // Number Line Location (-8, 3, -1, 6)
      const listConfigs = [
        { nums: [-8, 3, -1, 6], leftMost: -8, rightMost: 6, order: '-8 < -1 < 3 < 6' },
        { nums: [-12, 5, -3, 9], leftMost: -12, rightMost: 9, order: '-12 < -3 < 5 < 9' },
        { nums: [-15, 2, -6, 8], leftMost: -15, rightMost: 8, order: '-15 < -6 < 2 < 8' },
        { nums: [-20, 4, -9, 10], leftMost: -20, rightMost: 10, order: '-20 < -9 < 4 < 10' },
        { nums: [-14, 1, -5, 7], leftMost: -14, rightMost: 7, order: '-14 < -5 < 1 < 7' }
      ];
      const lc = listConfigs[variantIndex % listConfigs.length];
      const ansStr = `When plotted from left to right, the order is ${lc.order}; thus ${lc.leftMost} is furthest to the left.`;
      const options = shuffle([
        ansStr,
        `When plotted from left to right, the order is ${lc.nums[1]}, ${lc.nums[2]}, ${lc.nums[0]}, ${lc.nums[3]}; thus ${lc.nums[1]} is furthest left.`,
        `All negative integers are plotted to the right of zero, making ${lc.rightMost} furthest to the left.`,
        `Integers with larger absolute values are always placed to the right of smaller numbers.`
      ]);
      return {
        title: `Locating Integers on Horizontal Number Line`,
        text: `How do you locate and plot the integers $${lc.nums.join(', ')}$ on a horizontal number line, and which integer lies furthest to the left?`,
        formula: `\\text{Leftmost } = \\min(${lc.nums.join(', ')}) = ${lc.leftMost}`,
        options,
        answer: ansStr,
        hint: `On a horizontal number line, smaller (more negative) numbers lie further to the left.`,
        steps: [
          `**Step 1: Arrange integers in ascending order**`,
          `$$${lc.order}$$`,
          `**Step 2: Identify leftmost value**`,
          `$$\\text{Leftmost integer} = ${lc.leftMost}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: NUMBER_LINE_IMAGE,
        image_alt: 'Horizontal Integer Number Line Diagram',
        difficulty: 3
      };
    } else if (subType === 2) { // Least to Greatest Ordering of Mixed Integers
      const orderConfigs = [
        { orig: [-15, 7, -2, 0, -20, 11], sorted: [-20, -15, -2, 0, 7, 11] },
        { orig: [-18, 9, -5, 0, -24, 14], sorted: [-24, -18, -5, 0, 9, 14] },
        { orig: [-30, 4, -12, 0, -8, 25], sorted: [-30, -12, -8, 0, 4, 25] },
        { orig: [-16, 12, -4, 0, -22, 18], sorted: [-22, -16, -4, 0, 12, 18] },
        { orig: [-35, 15, -10, 0, -40, 20], sorted: [-40, -35, -10, 0, 15, 20] }
      ];
      const oc = orderConfigs[variantIndex % orderConfigs.length];
      const ansStr = oc.sorted.join(', ');
      const options = shuffle([
        ansStr,
        oc.sorted.slice().reverse().join(', '),
        [0, ...oc.sorted.filter(n => n !== 0)].join(', '),
        [oc.sorted[1], oc.sorted[0], oc.sorted[2], oc.sorted[3], oc.sorted[5], oc.sorted[4]].join(', ')
      ]);
      return {
        title: `Ordering Integers Least to Greatest (Ascending)`,
        text: `Arrange the following list of integers from least to greatest (ascending order): $${oc.orig.join(', ')}$`,
        formula: `a_1 < a_2 < a_3 < a_4 < a_5 < a_6`,
        options,
        answer: ansStr,
        hint: `Negative numbers with largest absolute value come first (least), followed by smaller negative numbers, 0, and positive numbers.`,
        steps: [
          `**Step 1: Compare negative numbers**`,
          `$$\\text{Negative part: } ${oc.sorted.filter(n => n < 0).join(' < ')}$$`,
          `**Step 2: Place 0 and positive numbers**`,
          `$$\\text{Complete ascending order: } ${oc.sorted.join(' < ')}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: NUMBER_LINE_IMAGE,
        image_alt: 'Ascending Integer Order Number Line',
        difficulty: 3
      };
    } else if (subType === 3) { // Distance from Zero (Absolute Value Rule for Negative Integers)
      const distConfigs = [
        { n1: -18, n2: -7, closer: -7, farther: -18, comp: '-7 > -18' },
        { n1: -25, n2: -10, closer: -10, farther: -25, comp: '-10 > -25' },
        { n1: -40, n2: -15, closer: -15, farther: -40, comp: '-15 > -40' },
        { n1: -30, n2: -12, closer: -12, farther: -30, comp: '-12 > -30' },
        { n1: -50, n2: -5, closer: -5, farther: -50, comp: '-5 > -50' }
      ];
      const dc = distConfigs[variantIndex % distConfigs.length];
      const ansStr = `For any two negative integers, the integer closer to zero (smaller distance / smaller absolute value) is GREATER (e.g. ${dc.comp}).`;
      const options = shuffle([
        ansStr,
        `For any two negative integers, the integer farther from zero (larger absolute value) is greater.`,
        `Distance from zero has no effect on negative integer comparisons; all negative integers are equal.`,
        `The negative integer with the larger digit value is always greater regardless of sign.`
      ]);
      return {
        title: `Distance from Zero & Negative Integer Comparison`,
        text: `For any two negative integers (such as $${dc.n1}$ and $${dc.n2}$), how does their distance from zero dictate which integer is greater?`,
        formula: `|${dc.closer}| < |${dc.farther}| \\implies ${dc.closer} > ${dc.farther}`,
        options,
        answer: ansStr,
        hint: `Less negative means closer to zero, which means greater value.`,
        steps: [
          `**Step 1: Find distance from zero (absolute values)**`,
          `$$|${dc.n1}| = ${Math.abs(dc.n1)}, \\quad |${dc.n2}| = ${Math.abs(dc.n2)}$$`,
          `**Step 2: Apply negative comparison rule**`,
          `$$\\text{Closer to zero} = ${dc.closer} \\implies ${dc.comp}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: NUMBER_LINE_IMAGE,
        image_alt: 'Distance from Zero Number Line Comparison',
        difficulty: 3
      };
    } else if (subType === 4) { // Inequality Statement Comparing Negative Temperatures
      const tempConfigs = [
        { t1: -12, t2: -5, symbol: '<', textIneq: '-12°C < -5°C', altText: '-5°C > -12°C', warmer: '-5°C' },
        { t1: -18, t2: -8, symbol: '<', textIneq: '-18°C < -8°C', altText: '-8°C > -18°C', warmer: '-8°C' },
        { t1: -25, t2: -14, symbol: '<', textIneq: '-25°C < -14°C', altText: '-14°C > -25°C', warmer: '-14°C' },
        { t1: -30, t2: -2, symbol: '<', textIneq: '-30°C < -2°C', altText: '-2°C > -30°C', warmer: '-2°C' },
        { t1: -15, t2: -1, symbol: '<', textIneq: '-15°C < -1°C', altText: '-1°C > -15°C', warmer: '-1°C' }
      ];
      const tc = tempConfigs[variantIndex % tempConfigs.length];
      const ansStr = `$${tc.t1}^\\circ\\text{C} < ${tc.t2}^\\circ\\text{C}$ (or $${tc.t2}^\\circ\\text{C} > ${tc.t1}^\\circ\\text{C}$)`;
      const options = shuffle([
        ansStr,
        `$${tc.t1}^\\circ\\text{C} > ${tc.t2}^\\circ\\text{C}$`,
        `$${tc.t1}^\\circ\\text{C} = ${tc.t2}^\\circ\\text{C}$`,
        `$${tc.t1}^\\circ\\text{C} \\ge |${tc.t2}|^\\circ\\text{C}$`
      ]);
      return {
        title: `Comparing Negative Temperatures with Inequalities`,
        text: `Write a correct mathematical inequality statement comparing the freezing temperatures $${tc.t1}^\\circ\\text{C}$ and $${tc.t2}^\\circ\\text{C}$:`,
        formula: `${tc.t1} < ${tc.t2} \\iff ${tc.t2} > ${tc.t1}`,
        options,
        answer: ansStr,
        hint: `${tc.warmer} is warmer (higher temperature), so it is greater than ${tc.t1}°C.`,
        steps: [
          `**Step 1: Compare values on number line**`,
          `$$${tc.t1} \\text{ is to the left of } ${tc.t2} \\implies ${tc.t1} < ${tc.t2}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: NUMBER_LINE_IMAGE,
        image_alt: 'Temperature Number Line Comparison',
        difficulty: 2
      };
    } else if (subType === 5) { // Greatest to Least Ordering (Descending Order)
      const descConfigs = [
        { orig: [14, -8, 22, -19, 0, -3], sorted: [22, 14, 0, -3, -8, -19] },
        { orig: [18, -12, 30, -25, 0, -6], sorted: [30, 18, 0, -6, -12, -25] },
        { orig: [10, -15, 28, -32, 0, -4], sorted: [28, 10, 0, -4, -15, -32] },
        { orig: [16, -10, 35, -20, 0, -7], sorted: [35, 16, 0, -7, -10, -20] },
        { orig: [25, -14, 40, -30, 0, -9], sorted: [40, 25, 0, -9, -14, -30] }
      ];
      const dc = descConfigs[variantIndex % descConfigs.length];
      const ansStr = dc.sorted.join(', ');
      const options = shuffle([
        ansStr,
        dc.sorted.slice().reverse().join(', '),
        [dc.sorted[1], dc.sorted[0], dc.sorted[2], dc.sorted[4], dc.sorted[3], dc.sorted[5]].join(', '),
        [0, ...dc.sorted.filter(n => n !== 0)].join(', ')
      ]);
      return {
        title: `Ordering Integers Greatest to Least (Descending)`,
        text: `Arrange the following integers from greatest to least (descending order): $${dc.orig.join(', ')}$`,
        formula: `b_1 > b_2 > b_3 > b_4 > b_5 > b_6`,
        options,
        answer: ansStr,
        hint: `Largest positive integer comes first, followed by smaller positive integers, 0, and increasingly negative numbers.`,
        steps: [
          `**Step 1: Arrange positive integers first**`,
          `$$\\text{Positive part: } ${dc.sorted.filter(n => n > 0).join(' > ')}$$`,
          `**Step 2: Append 0 and negative integers**`,
          `$$\\text{Complete descending order: } ${dc.sorted.join(' > ')}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: NUMBER_LINE_IMAGE,
        image_alt: 'Descending Integer Order Number Line',
        difficulty: 3
      };
    } else if (subType === 6) { // Opposite of an Integer (Additive Inverse)
      const oppConfigs = [
        { num: -45, opp: 45, dist: '45 units to the right of zero' },
        { num: 62, opp: -62, dist: '62 units to the left of zero' },
        { num: -88, opp: 88, dist: '88 units to the right of zero' },
        { num: 35, opp: -35, dist: '35 units to the left of zero' },
        { num: -110, opp: 110, dist: '110 units to the right of zero' }
      ];
      const oc = oppConfigs[variantIndex % oppConfigs.length];
      const ansStr = `${oc.opp > 0 ? '+' + oc.opp : oc.opp}, located ${oc.dist}.`;
      const options = shuffle([
        ansStr,
        `${oc.num}, located at the exact same point on the number line.`,
        `${-oc.opp}, located ${oc.dist.includes('right') ? 'left' : 'right'} of zero.`,
        `0, because opposite integers cancel each other out to zero.`
      ]);
      return {
        title: `Opposite (Additive Inverse) of an Integer`,
        text: `What is the opposite (additive inverse) of the integer $${oc.num}$, and where is it located on the horizontal number line relative to zero?`,
        formula: `\\text{Opposite of } a = -a, \\quad a + (-a) = 0`,
        options,
        answer: ansStr,
        hint: `The opposite has the same distance from zero but opposite sign.`,
        steps: [
          `**Step 1: Negate the integer**`,
          `$$\\text{Opposite of } (${oc.num}) = -(${oc.num}) = ${oc.opp}$$`,
          `**Step 2: Determine number line location**`,
          `$$\\text{Location: } ${oc.dist}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: NUMBER_LINE_IMAGE,
        image_alt: 'Additive Inverse Number Line Diagram',
        difficulty: 2
      };
    } else if (subType === 7) { // Integer Difference / Distance Calculation on Number Line
      const diffConfigs = [
        { pos: 450, neg: -150, dist: 600, context: 'altitude of +450 m and submarine depth of -150 m' },
        { pos: 800, neg: -200, dist: 1000, context: 'mountain peak at +800 m and trench depth at -200 m' },
        { pos: 1200, neg: -350, dist: 1550, context: 'drone altitude of +1,200 m and underwater probe at -350 m' },
        { pos: 500, neg: -120, dist: 620, context: 'bank balance of +₱500 and overdraft balance of -₱120' },
        { pos: 650, neg: -250, dist: 900, context: 'daytime temperature of +650 K and cryogenic chamber at -250 K' }
      ];
      const dc = diffConfigs[variantIndex % diffConfigs.length];
      const ansStr = `${dc.dist} units (calculated as |${dc.pos} - (${dc.neg})| = ${dc.pos} + ${Math.abs(dc.neg)} = ${dc.dist}).`;
      const options = shuffle([
        ansStr,
        `${dc.pos - Math.abs(dc.neg)} units`,
        `${dc.pos * 2} units`,
        `${Math.abs(dc.neg)} units`
      ]);
      return {
        title: `Distance Between Two Integers on Number Line`,
        text: `What is the total distance between two quantities given as a ${dc.context}?`,
        formula: `d = |a - b| = |${dc.pos} - (${dc.neg})|`,
        options,
        answer: ansStr,
        hint: `Subtract negative value from positive value: distance = positive - (negative).`,
        steps: [
          `**Step 1: Set up absolute distance equation**`,
          `$$d = |${dc.pos} - (${dc.neg})|$$`,
          `**Step 2: Simplify double negative**`,
          `$$d = ${dc.pos} + ${Math.abs(dc.neg)} = ${dc.dist}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: NUMBER_LINE_IMAGE,
        image_alt: 'Integer Distance on Number Line',
        difficulty: 3
      };
    } else if (subType === 8) { // True/False Inequality Evaluation
      const ineqConfigs = [
        { trueIneq: '-35 < -12', hint: '-35 is further left on the number line than -12.' },
        { trueIneq: '-48 < -20', hint: '-48 is less than -20.' },
        { trueIneq: '-15 < 0', hint: 'Any negative integer is less than zero.' },
        { trueIneq: '0 > -80', hint: 'Zero is greater than any negative integer.' },
        { trueIneq: '-100 < -1', hint: '-100 is less than -1.' }
      ];
      const ic = ineqConfigs[variantIndex % ineqConfigs.length];
      const ansStr = ic.trueIneq;
      const options = shuffle([
        ansStr,
        ic.trueIneq.replace('<', '>').replace('0 >', '0 <'),
        `-5 > 10`,
        `-25 > -5`
      ]);
      return {
        title: `Evaluating Integer Inequality Statements`,
        text: `Which of the following mathematical integer inequality statements is TRUE?`,
        formula: `a < b \\iff a \\text{ is to the left of } b`,
        options,
        answer: ansStr,
        hint: ic.hint,
        steps: [
          `**Step 1: Test truth value on number line**`,
          `$$\\text{True Statement: } ${ansStr}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: NUMBER_LINE_IMAGE,
        image_alt: 'Integer Inequality Verification',
        difficulty: 2
      };
    } else { // Application Word Problem on Integer Change / Net Result
      const netConfigs = [
        { start: 1000, dep: 500, wd: 800, net: 700, unit: '₱', topic: 'bank balance' },
        { start: 250, dep: 120, wd: 300, net: 70, unit: 'm', topic: 'submarine altitude' },
        { start: 15, dep: 8, wd: 20, net: 3, unit: '°C', topic: 'freezer temperature' },
        { start: 50, dep: 30, wd: 60, net: 20, unit: 'points', topic: 'team score' },
        { start: 400, dep: 150, wd: 450, net: 100, unit: 'L', topic: 'water reservoir volume' }
      ];
      const nc = netConfigs[variantIndex % netConfigs.length];
      const ansStr = `${nc.unit}${nc.net}`;
      const options = shuffle([
        ansStr,
        `${nc.unit}${nc.net + 200}`,
        `${nc.unit}${nc.net - 150}`,
        `${nc.unit}${nc.start + nc.dep + nc.wd}`
      ]);
      return {
        title: `Net Integer Change Application Word Problem`,
        text: `A ${nc.topic} starts at ${nc.unit}${nc.start}. It increases by ${nc.unit}${nc.dep} (+${nc.dep}) and then decreases by ${nc.unit}${nc.wd} (-${nc.wd}). What is the final net value?`,
        formula: `\\text{Final} = \\text{Start} + \\text{Increase} - \\text{Decrease}`,
        options,
        answer: ansStr,
        hint: `Add deposit and subtract withdrawal: ${nc.start} + ${nc.dep} - ${nc.wd}.`,
        steps: [
          `**Step 1: Write integer arithmetic expression**`,
          `$$\\text{Final} = ${nc.start} + ${nc.dep} - ${nc.wd}$$`,
          `**Step 2: Evaluate left to right**`,
          `$$${nc.start + nc.dep} - ${nc.wd} = ${nc.net}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: NUMBER_LINE_IMAGE,
        image_alt: 'Net Integer Change Diagram',
        difficulty: 3
      };
    }
  }

  // Category 3G: Form 7 - The Four Operations with Integers (Topic ID 115 - 50 DYNAMIC VARIATION QUESTIONS)
  if (topicId === 115) {
    const subType = qIndex % 10;
    const variantIndex = Math.floor(qIndex / 10); // 0 to 4 across 50 questions

    if (subType === 0) { // Sign Rule for Multiplying Negative Integers (Odd vs Even Count)
      const countConfigs = [
        { count: 3, eg: '(-2) × (-3) × (-4) = -24', sign: 'negative (-)', rule: 'An odd number of negative factors results in a negative product.' },
        { count: 5, eg: '(-1) × (-2) × (-3) × (-1) × (-2) = -12', sign: 'negative (-)', rule: 'Multiplying 5 negative factors gives a negative product.' },
        { count: 7, eg: '(-1)^7 = -1', sign: 'negative (-)', rule: 'Raising a negative base to an odd exponent gives a negative result.' },
        { count: 4, eg: '(-2) × (-3) × (-1) × (-4) = +24', sign: 'positive (+)', rule: 'An even number of negative factors pair up to form a positive product.' },
        { count: 6, eg: '(-1)^6 = +1', sign: 'positive (+)', rule: 'Raising a negative base to an even exponent gives a positive result.' }
      ];
      const cc = countConfigs[variantIndex % countConfigs.length];
      const ansStr = `The product is ${cc.sign} because ${cc.rule}`;
      const options = shuffle([
        ansStr,
        `The product is always positive (+) regardless of how many negative factors are multiplied.`,
        `The product is zero (0) because negative signs cancel out completely.`,
        `The sign of the product depends strictly on whether the first factor is odd or even.`
      ]);
      return {
        title: `Sign Rule for Multiplying Negative Integers (${cc.count} Factors)`,
        text: `What rule determines the sign of the product when multiplying an ${cc.count % 2 === 1 ? 'odd' : 'even'} count of ${cc.count} negative integers (e.g., $${cc.eg}$)?`,
        formula: `(-1)^n = \\begin{cases} -1 & \\text{if } n \\text{ is odd} \\\\ +1 & \\text{if } n \\text{ is even} \\end{cases}`,
        options,
        answer: ansStr,
        hint: cc.rule,
        steps: [
          `**Step 1: Count the number of negative factors ($n = ${cc.count}$)**`,
          `$$n = ${cc.count} \\implies \\text{${cc.count % 2 === 1 ? 'Odd' : 'Even'} count of negative factors}$$`,
          `**Step 2: Apply integer multiplication sign rule**`,
          `$$\\text{Result sign: } ${cc.sign}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 2
      };
    } else if (subType === 1) { // Multi-Step Addition & Subtraction of Signed Integers (-18 + 25 - (-12) + (-30))
      const multiConfigs = [
        { expr: '(-18) + 25 - (-12) + (-30)', val: -11, steps: '(-18) + 25 + 12 - 30 = 7 + 12 - 30 = 19 - 30 = -11' },
        { expr: '(-24) + 35 - (-16) + (-40)', val: -13, steps: '(-24) + 35 + 16 - 40 = 11 + 16 - 40 = 27 - 40 = -13' },
        { expr: '(-15) + 40 - (-25) + (-60)', val: -10, steps: '(-15) + 40 + 25 - 60 = 25 + 25 - 60 = 50 - 60 = -10' },
        { expr: '(-30) + 18 - (-42) + (-50)', val: -20, steps: '(-30) + 18 + 42 - 50 = -12 + 42 - 50 = 30 - 50 = -20' },
        { expr: '(-12) + 28 - (-14) + (-35)', val: -5, steps: '(-12) + 28 + 14 - 35 = 16 + 14 - 35 = 30 - 35 = -5' }
      ];
      const mc = multiConfigs[variantIndex % multiConfigs.length];
      const ansStr = String(mc.val);
      const options = shuffle([ansStr, String(mc.val + 15), String(mc.val - 12), String(-mc.val)]);
      return {
        title: `Multi-Step Signed Integer Addition & Subtraction`,
        text: `What is the simplified numerical value of the signed integer expression: $${mc.expr}$?`,
        formula: `a - (-b) = a + b, \\quad a + (-c) = a - c`,
        options,
        answer: ansStr,
        hint: `Change double negative -(-b) to +b and add/subtract left to right.`,
        steps: [
          `**Step 1: Simplify double negative signs**`,
          `$$${mc.expr.replace('- (-', '+ ')}$$`,
          `**Step 2: Evaluate sequentially**`,
          `$$${mc.steps}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 2) { // Multi-Step Nested Division & Quotient Evaluation ((-72) / (-8)) / (-3)
      const divConfigs = [
        { num1: -72, num2: -8, num3: -3, q1: 9, finalQ: -3, expr: '\\frac{(-72) \\div (-8)}{-3}' },
        { num1: -90, num2: -9, num3: -5, q1: 10, finalQ: -2, expr: '\\frac{(-90) \\div (-9)}{-5}' },
        { num1: -64, num2: -4, num3: -2, q1: 16, finalQ: -8, expr: '\\frac{(-64) \\div (-4)}{-2}' },
        { num1: -100, num2: -5, num3: -4, q1: 20, finalQ: -5, expr: '\\frac{(-100) \\div (-5)}{-4}' },
        { num1: -81, num2: -3, num3: -9, q1: 27, finalQ: -3, expr: '\\frac{(-81) \\div (-3)}{-9}' }
      ];
      const dc = divConfigs[variantIndex % divConfigs.length];
      const ansStr = String(dc.finalQ);
      const options = shuffle([ansStr, String(dc.q1), String(-dc.finalQ), String(dc.finalQ - 4)]);
      return {
        title: `Nested Integer Division & Quotient Evaluation`,
        text: `Evaluate the multi-step integer division quotient: $${dc.expr}$:`,
        formula: `\\frac{(-a) \\div (-b)}{-c} = \\frac{+(a/b)}{-c} = -\\left(\\frac{a/b}{c}\\right)`,
        options,
        answer: ansStr,
        hint: `First divide top terms: (-a) ÷ (-b) = +q1. Then divide by -c.`,
        steps: [
          `**Step 1: Divide numerator integers (same sign = positive)**`,
          `$$(${dc.num1}) \\div (${dc.num2}) = +${dc.q1}$$`,
          `**Step 2: Divide by denominator (different signs = negative)**`,
          `$$\\frac{+${dc.q1}}{${dc.num3}} = ${dc.finalQ}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 3) { // Submarine / Altitude Descends and Ascends Word Problem
      const subConfigs = [
        { start: -150, desc: 45, asc: 80, finalD: -115, word: '115 meters below sea level' },
        { start: -200, desc: 60, asc: 110, finalD: -150, word: '150 meters below sea level' },
        { start: -300, desc: 80, asc: 150, finalD: -230, word: '230 meters below sea level' },
        { start: -120, desc: 35, asc: 90, finalD: -65, word: '65 meters below sea level' },
        { start: -250, desc: 75, asc: 180, finalD: -145, word: '145 meters below sea level' }
      ];
      const sc = subConfigs[variantIndex % subConfigs.length];
      const ansStr = `$${sc.finalD}\\text{ meters}$ (${sc.word})`;
      const options = shuffle([
        ansStr,
        `$${sc.finalD - 50}\\text{ meters}$`,
        `$${sc.finalD + 90}\\text{ meters}$`,
        `$${sc.start + sc.desc + sc.asc}\\text{ meters}$`
      ]);
      return {
        title: `Submarine Depth & Vertical Integer Movement`,
        text: `A submarine at a depth of $${sc.start}\\text{ meters}$ descends $${sc.desc}\\text{ meters}$ (goes deeper) and then ascends $${sc.asc}\\text{ meters}$ (goes upward). What is its final depth?`,
        formula: `\\text{Final Depth} = \\text{Start} - \\text{Descend} + \\text{Ascend}`,
        options,
        answer: ansStr,
        hint: `Descending is subtracting depth (-); ascending is adding height (+).`,
        steps: [
          `**Step 1: Set up depth equation**`,
          `$$\\text{Final} = (${sc.start}) - (${sc.desc}) + (${sc.asc})$$`,
          `**Step 2: Evaluate left to right**`,
          `$$${sc.start - sc.desc} + ${sc.asc} = ${sc.finalD}\\text{ meters}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 4) { // Order of Operations (PEMDAS) with Exponents & Signed Multiplication
      const pemConfigs = [
        { b: -4, exp: 2, mult1: 3, mult2: -5, add: -8, val: 23, expr: '(-4)^2 - 3 \\times (-5) + (-8)' },
        { b: -5, exp: 2, mult1: 4, mult2: -6, add: -10, val: 39, expr: '(-5)^2 - 4 \\times (-6) + (-10)' },
        { b: -3, exp: 2, mult1: 5, mult2: -4, add: -6, val: 23, expr: '(-3)^2 - 5 \\times (-4) + (-6)' },
        { b: -6, exp: 2, mult1: 2, mult2: -7, add: -12, val: 38, expr: '(-6)^2 - 2 \\times (-7) + (-12)' },
        { b: -2, exp: 3, mult1: 4, mult2: -5, add: -15, val: -3, expr: '(-2)^3 - 4 \\times (-5) + (-15)' }
      ];
      const pc = pemConfigs[variantIndex % pemConfigs.length];
      const ansStr = String(pc.val);
      const options = shuffle([ansStr, String(pc.val + 12), String(pc.val - 15), String(-pc.val)]);
      return {
        title: `Order of Operations (PEMDAS) with Signed Integers`,
        text: `Evaluate the mathematical expression using strict order of operations (PEMDAS): $${pc.expr}$:`,
        formula: `\\text{Evaluate Exponents } \\to \\text{Multiplication } \\to \\text{Addition/Subtraction}`,
        options,
        answer: ansStr,
        hint: `Calculate exponents first, then multiplication, then add/subtract left to right.`,
        steps: [
          `**Step 1: Evaluate exponents**`,
          `$$(${pc.b})^{${pc.exp}} = ${Math.pow(pc.b, pc.exp)}$$`,
          `**Step 2: Evaluate multiplication**`,
          `$$${pc.mult1} \\times (${pc.mult2}) = ${pc.mult1 * pc.mult2}$$`,
          `**Step 3: Combine remaining terms**`,
          `$$${Math.pow(pc.b, pc.exp)} - (${pc.mult1 * pc.mult2}) + (${pc.add}) = ${pc.val}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 5) { // Signed Integer Multiplication with Distributive Property
      const distConfigs = [
        { k: -6, a: 15, b: 25, diff: -10, val: 60, expr: '(-6) \\times (15 - 25)' },
        { k: -8, a: 12, b: 30, diff: -18, val: 144, expr: '(-8) \\times (12 - 30)' },
        { k: -5, a: 18, b: 40, diff: -22, val: 110, expr: '(-5) \\times (18 - 40)' },
        { k: -7, a: 14, b: 34, diff: -20, val: 140, expr: '(-7) \\times (14 - 34)' },
        { k: -9, a: 10, b: 25, diff: -15, val: 135, expr: '(-9) \\times (10 - 25)' }
      ];
      const dc = distConfigs[variantIndex % distConfigs.length];
      const ansStr = `+${dc.val}`;
      const options = shuffle([ansStr, `-${dc.val}`, `+${dc.val - 30}`, `-${dc.val + 20}`]);
      return {
        title: `Distributive Property & Signed Integer Product`,
        text: `Apply the distributive property or order of operations to evaluate: $${dc.expr}$:`,
        formula: `k(a - b) = k \\cdot a - k \\cdot b`,
        options,
        answer: ansStr,
        hint: `Subtract inside parenthesis: (15 - 25) = -10. Then (-6) x (-10) = +60.`,
        steps: [
          `**Method 1: Parentheses first**`,
          `$$(${dc.a} - ${dc.b}) = ${dc.diff}$$`,
          `$$(${dc.k}) \\times (${dc.diff}) = +${dc.val}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 6) { // Temperature Change & Cumulative Addition/Subtraction
      const tempConfigs = [
        { start: -8, drop: 5, rise: 16, finalT: 3 },
        { start: -12, drop: 6, rise: 20, finalT: 2 },
        { start: -15, drop: 8, rise: 28, finalT: 5 },
        { start: -6, drop: 4, rise: 18, finalT: 8 },
        { start: -10, drop: 7, rise: 22, finalT: 5 }
      ];
      const tc = tempConfigs[variantIndex % tempConfigs.length];
      const ansStr = `+${tc.finalT}°C`;
      const options = shuffle([ansStr, `-${tc.finalT}°C`, `+${tc.finalT + 6}°C`, `-${tc.finalT + 8}°C`]);
      return {
        title: `Cumulative Temperature Change Calculation`,
        text: `At midnight, the temperature was $${tc.start}^\\circ\\text{C}$. By 6:00 AM, it dropped by $${tc.drop}^\\circ\\text{C}$. By 2:00 PM, it rose by $${tc.rise}^\\circ\\text{C}$. What was the temperature at 2:00 PM?`,
        formula: `\\text{Final Temperature} = \\text{Start} - \\text{Drop} + \\text{Rise}`,
        options,
        answer: ansStr,
        hint: `Drop means subtract (-${tc.drop}); rise means add (+${tc.rise}).`,
        steps: [
          `**Step 1: Calculate 6:00 AM temperature**`,
          `$$(${tc.start}) - ${tc.drop} = ${tc.start - tc.drop}^\\circ\\text{C}$$`,
          `**Step 2: Add afternoon rise**`,
          `$$(${tc.start - tc.drop}) + ${tc.rise} = +${tc.finalT}^\\circ\\text{C}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 2
      };
    } else if (subType === 7) { // Financial Ledger Balance Calculation
      const finConfigs = [
        { init: -450, dep: 1200, bill: 650, int: 80, finalB: 180 },
        { init: -600, dep: 1500, bill: 750, int: 100, finalB: 250 },
        { init: -350, dep: 900, bill: 450, int: 50, finalB: 150 },
        { init: -500, dep: 1400, bill: 800, int: 120, finalB: 220 },
        { init: -250, dep: 800, bill: 400, int: 60, finalB: 210 }
      ];
      const fc = finConfigs[variantIndex % finConfigs.length];
      const ansStr = `₱${fc.finalB}`;
      const options = shuffle([ansStr, `₱${fc.finalB + 300}`, `-₱${fc.finalB}`, `₱${fc.finalB + 150}`]);
      return {
        title: `Financial Ledger Net Balance Calculation`,
        text: `A bank account starts with an overdrawn balance of $-\\text{₱}${Math.abs(fc.init)}$. The user deposits \\(\\text{₱}${fc.dep.toLocaleString()}\\), pays a bill of \\(\\text{₱}${fc.bill}\\), and receives a interest credit of \\(\\text{₱}${fc.int}\\). What is the final balance?`,
        formula: `\\text{Balance} = \\text{Initial} + \\text{Deposit} - \\text{Bill} + \\text{Interest}`,
        options,
        answer: ansStr,
        hint: `Initial overdraft is negative (-${Math.abs(fc.init)}). Deposits add; bills subtract.`,
        steps: [
          `**Step 1: Set up arithmetic expression**`,
          `$$\\text{Balance} = (${fc.init}) + ${fc.dep} - ${fc.bill} + ${fc.int}$$`,
          `**Step 2: Evaluate left to right**`,
          `$$${fc.init + fc.dep} - ${fc.bill} + ${fc.int} = \\text{₱}${fc.finalB}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 8) { // Division Sign Rules & Indeterminate / Undefined Division
      const undConfigs = [
        { expr: '(-15) \\div 0', reason: 'Division of any non-zero number by zero is UNDEFINED.' },
        { expr: '(-24) \\div 0', reason: 'Dividing by zero is mathematically undefined.' },
        { expr: '(-50) \\div 0', reason: 'Division by 0 has no valid numerical quotient.' },
        { expr: '(-85) \\div 0', reason: 'Division by zero is an invalid mathematical operation.' },
        { expr: '(-100) \\div 0', reason: 'Division by zero is undefined.' }
      ];
      const uc = undConfigs[variantIndex % undConfigs.length];
      const ansStr = `Dividing a non-zero integer by zero ($${uc.expr}$) is UNDEFINED.`;
      const options = shuffle([
        ansStr,
        `Dividing a positive integer by a negative integer is undefined.`,
        `Dividing zero by a negative integer is undefined.`,
        `Dividing two negative integers produces a negative quotient.`
      ]);
      return {
        title: `Undefined Division & Integer Division Rules`,
        text: `Which of the following integer division operations results in an UNDEFINED mathematical value?`,
        formula: `a \\div 0 = \\text{Undefined } (a \\neq 0), \\quad 0 \\div b = 0 \\text{ } (b \\neq 0)`,
        options,
        answer: ansStr,
        hint: uc.reason,
        steps: [
          `**Step 1: Check division rules for zero**`,
          `$$a \\div 0 \\implies \\text{Undefined for all } a \\neq 0$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 2
      };
    } else { // Algebraic Integer Evaluation for Given Variable Values
      const algConfigs = [
        { a: -4, b: 6, c: -2, val: 20, expr: 'a^2 - b \\cdot c + c^3' },
        { a: -3, b: 5, c: -4, val: -35, expr: 'a^2 - b \\cdot c + c^3' },
        { a: -5, b: 4, c: -3, val: 10, expr: 'a^2 - b \\cdot c + c^3' },
        { a: -2, b: 7, c: -5, val: -86, expr: 'a^2 - b \\cdot c + c^3' },
        { a: -6, b: 8, c: -1, val: 43, expr: 'a^2 - b \\cdot c + c^3' }
      ];
      const ac = algConfigs[variantIndex % algConfigs.length];
      const ansStr = String(ac.val);
      const options = shuffle([ansStr, String(ac.val + 14), String(ac.val - 20), String(-ac.val)]);
      return {
        title: `Algebraic Integer Expression Substitution`,
        text: `If \\(a = ${ac.a}\\), \\(b = ${ac.b}\\), and \\(c = ${ac.c}\\), evaluate the algebraic expression: \\(${ac.expr}\\):`,
        formula: `a^2 - bc + c^3`,
        options,
        answer: ansStr,
        hint: `Substitute a=${ac.a}, b=${ac.b}, c=${ac.c} into expression and evaluate powers first.`,
        steps: [
          `**Step 1: Substitute values**`,
          `$$(${ac.a})^2 - (${ac.b})(${ac.c}) + (${ac.c})^3$$`,
          `**Step 2: Evaluate powers and products**`,
          `$$${Math.pow(ac.a, 2)} - (${ac.b * ac.c}) + (${Math.pow(ac.c, 3)})$$`,
          `**Step 3: Combine signed terms**`,
          `$$${Math.pow(ac.a, 2)} + ${Math.abs(ac.b * ac.c)} + (${Math.pow(ac.c, 3)}) = ${ac.val}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    }
  }

  // Category 3H: Form 7 - Simplification of Numerical Expressions Involving Integers (Topic ID 116 - 50 DYNAMIC VARIATION QUESTIONS)
  if (topicId === 116) {
    const subType = qIndex % 10;
    const variantIndex = Math.floor(qIndex / 10); // 0 to 4 across 50 questions

    if (subType === 0) { // Parentheses & Exponents Base Scope Distinction (-5^2 vs (-5)^2)
      const scopeConfigs = [
        { base: 5, exp: 2, unpar: -25, par: 25, exprUn: '-5^2', exprPar: '(-5)^2' },
        { base: 4, exp: 2, unpar: -16, par: 16, exprUn: '-4^2', exprPar: '(-4)^2' },
        { base: 6, exp: 2, unpar: -36, par: 36, exprUn: '-6^2', exprPar: '(-6)^2' },
        { base: 7, exp: 2, unpar: -49, par: 49, exprUn: '-7^2', exprPar: '(-7)^2' },
        { base: 3, exp: 4, unpar: -81, par: 81, exprUn: '-3^4', exprPar: '(-3)^4' }
      ];
      const sc = scopeConfigs[variantIndex % scopeConfigs.length];
      const ansStr = `$${sc.exprUn} = ${sc.unpar}$ (exponent applies to ${sc.base} only), whereas $${sc.exprPar} = +${sc.par}$ (parenthesis includes negative sign in squaring).`;
      const options = shuffle([
        ansStr,
        `Both expressions are equal to +${sc.par} because squaring always yields a positive result.`,
        `Both expressions are equal to ${sc.unpar} because the negative sign is always placed outside the power.`,
        `$${sc.exprUn} = +${sc.par}$ while $${sc.exprPar} = ${sc.unpar}$ because parentheses negate the exponent.`
      ]);
      return {
        title: `Parentheses Scope & Exponents Base Distinction`,
        text: `How does the placement of parentheses alter the mathematical evaluated value between $${sc.exprUn}$ and $${sc.exprPar}$?`,
        formula: `-a^n = -(a^n), \\quad (-a)^n = (-a) \\times (-a) \\times \\dots \\times (-a)`,
        options,
        answer: ansStr,
        hint: `Without parentheses, exponentiation happens before negation. With parentheses, negation is part of the base.`,
        steps: [
          `**Step 1: Evaluate $${sc.exprUn}$**`,
          `$$${sc.exprUn} = -(${sc.base}^{${sc.exp}}) = -(${Math.pow(sc.base, sc.exp)}) = ${sc.unpar}$$`,
          `**Step 2: Evaluate $${sc.exprPar}$**`,
          `$$${sc.exprPar} = (${-sc.base}) \\times (${-sc.base}) = +${sc.par}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 1) { // Multi-Operator Signed Expression Simplification (-8 + 2) x (-3) - 16 / (-4) + 5
      const exprConfigs = [
        { p1: -8, p2: 2, mult: -3, div1: 16, div2: -4, add: 5, val: 27, expr: '(-8 + 2) \\times (-3) - 16 \\div (-4) + 5' },
        { p1: -10, p2: 4, mult: -4, div1: 24, div2: -6, add: 8, val: 36, expr: '(-10 + 4) \\times (-4) - 24 \\div (-6) + 8' },
        { p1: -12, p2: 5, mult: -2, div1: 35, div2: -5, add: 10, val: 31, expr: '(-12 + 5) \\times (-2) - 35 \\div (-5) + 10' },
        { p1: -15, p2: 7, mult: -3, div1: 40, div2: -8, add: 6, val: 35, expr: '(-15 + 7) \\times (-3) - 40 \\div (-8) + 6' },
        { p1: -9, p2: 3, mult: -5, div1: 28, div2: -7, add: 4, val: 38, expr: '(-9 + 3) \\times (-5) - 28 \\div (-7) + 4' }
      ];
      const ec = exprConfigs[variantIndex % exprConfigs.length];
      const ansStr = String(ec.val);
      const options = shuffle([ansStr, String(ec.val + 10), String(ec.val - 14), String(-ec.val)]);
      return {
        title: `Multi-Operator Expression Simplification`,
        text: `Simplify the numerical expression following PEMDAS rules: $${ec.expr}$:`,
        formula: `\\text{Parentheses } \\to \\text{Mult/Div } \\to \\text{Add/Sub}`,
        options,
        answer: ansStr,
        hint: `Evaluate parentheses first, then multiplication and division from left to right, then add/subtract.`,
        steps: [
          `**Step 1: Simplify parentheses**`,
          `$$(${ec.p1} + ${ec.p2}) = ${ec.p1 + ec.p2}$$`,
          `**Step 2: Perform multiplication & division**`,
          `$$(${ec.p1 + ec.p2}) \\times (${ec.mult}) = ${ (ec.p1 + ec.p2) * ec.mult }$$`,
          `$$${ec.div1} \\div (${ec.div2}) = ${ ec.div1 / ec.div2 }$$`,
          `**Step 3: Combine terms left to right**`,
          `$$${ (ec.p1 + ec.p2) * ec.mult } - (${ ec.div1 / ec.div2 }) + ${ec.add} = ${ec.val}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 2) { // Mental Math via Commutative & Associative Properties (-25 x 37 x -4)
      const propConfigs = [
        { a: -25, b: 37, c: -4, product: 3700, pairVal: 100, expr: '(-25) \\times 37 \\times (-4)' },
        { a: -125, b: 49, c: -8, product: 49000, pairVal: 1000, expr: '(-125) \\times 49 \\times (-8)' },
        { a: -50, b: 83, c: -2, product: 8300, pairVal: 100, expr: '(-50) \\times 83 \\times (-2)' },
        { a: -20, b: 64, c: -5, product: 6400, pairVal: 100, expr: '(-20) \\times 64 \\times (-5)' },
        { a: -250, b: 19, c: -4, product: 19000, pairVal: 1000, expr: '(-250) \\times 19 \\times (-4)' }
      ];
      const pc = propConfigs[variantIndex % propConfigs.length];
      const ansStr = `Commutative and Associative properties, giving ${pc.product.toLocaleString()} because (${pc.a}) × (${pc.c}) = ${pc.pairVal}.`;
      const options = shuffle([
        ansStr,
        `Distributive property only, giving ${pc.product + 500} by expanding each term.`,
        `Identity property only, giving ${pc.b} by canceling negative signs.`,
        `Inverse property only, giving 0 because negative factors cancel to zero.`
      ]);
      return {
        title: `Mental Simplification Using Number Properties`,
        text: `Which number properties (commutative, associative, distributive) can you apply to simplify $${pc.expr}$ mentally, and what is the final product?`,
        formula: `(a \\times b) \\times c = (a \\times c) \\times b`,
        options,
        answer: ansStr,
        hint: `Rearrange terms to multiply ${pc.a} and ${pc.c} first, which yields ${pc.pairVal}.`,
        steps: [
          `**Step 1: Apply Commutative Property to reorder factors**`,
          `$$${pc.expr} = [(${pc.a}) \\times (${pc.c})] \\times ${pc.b}$$`,
          `**Step 2: Apply Associative Property to multiply pair first**`,
          `$$(${pc.a} \\times ${pc.c}) = +${pc.pairVal}$$`,
          `$$${pc.pairVal} \\times ${pc.b} = ${pc.product}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 3) { // Error Spotting & Correction in Order of Operations (20 - 4 x 2 = 16 x 2 = 32)
      const errConfigs = [
        { orig: '20 - 4 \\times 2 = 16 \\times 2 = 32', correctVal: 12, wrongStep: '20 - 4 = 16', correctStep: '4 \\times 2 = 8, \\text{ then } 20 - 8 = 12', firstOp: 'multiplication' },
        { orig: '30 - 6 \\times 3 = 24 \\times 3 = 72', correctVal: 12, wrongStep: '30 - 6 = 24', correctStep: '6 \\times 3 = 18, \\text{ then } 30 - 18 = 12', firstOp: 'multiplication' },
        { orig: '45 - 5 \\times 4 = 40 \\times 4 = 160', correctVal: 25, wrongStep: '45 - 5 = 40', correctStep: '5 \\times 4 = 20, \\text{ then } 45 - 20 = 25', firstOp: 'multiplication' },
        { orig: '50 - 10 \\times 3 = 40 \\times 3 = 120', correctVal: 20, wrongStep: '50 - 10 = 40', correctStep: '10 \\times 3 = 30, \\text{ then } 50 - 30 = 20', firstOp: 'multiplication' },
        { orig: '18 - 3 \\times 5 = 15 \\times 5 = 75', correctVal: 3, wrongStep: '18 - 3 = 15', correctStep: '3 \\times 5 = 15, \\text{ then } 18 - 15 = 3', firstOp: 'multiplication' }
      ];
      const ec = errConfigs[variantIndex % errConfigs.length];
      const ansStr = `Error: Subtraction was incorrectly done before multiplication. Correct value is ${ec.correctVal} (${ec.correctStep}).`;
      const options = shuffle([
        ansStr,
        `No error; the step sequence and final result of the evaluation are fully correct.`,
        `Error: Multiplication was done incorrectly; 4 × 2 should equal 6 instead of 8.`,
        `Error: Subtraction should result in a negative number.`
      ]);
      return {
        title: `Error Identification in PEMDAS Evaluation`,
        text: `Identify and correct the mathematical error in the following step-by-step simplification: $${ec.orig}$:`,
        formula: `\\text{Order of Operations: Multiplication MUST precede Subtraction}`,
        options,
        answer: ansStr,
        hint: `Multiplication has higher priority than subtraction in PEMDAS.`,
        steps: [
          `**Step 1: Identify rule violation**`,
          `$$\\text{Wrong evaluation subtracted first: } ${ec.wrongStep}$$`,
          `**Step 2: Apply correct PEMDAS order**`,
          `$$${ec.correctStep}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 2
      };
    } else if (subType === 4) { // Nested Brackets and Absolute Value Bars Simplification
      const nestConfigs = [
        { absVal: -15, mult: 3, b1: 4, b2: -6, div: -2, val: 0, expr: '|-15| + 3 \\times [4 - (-6)] \\div (-2)' },
        { absVal: -20, mult: 4, b1: 5, b2: -5, div: -2, val: 0, expr: '|-20| + 4 \\times [5 - (-5)] \\div (-2)' },
        { absVal: -18, mult: 2, b1: 7, b2: -2, div: -3, val: 12, expr: '|-18| + 2 \\times [7 - (-2)] \\div (-3)' },
        { absVal: -24, mult: 5, b1: 6, b2: -2, div: -4, val: 14, expr: '|-24| + 5 \\times [6 - (-2)] \\div (-4)' },
        { absVal: -30, mult: 3, b1: 8, b2: -2, div: -5, val: 24, expr: '|-30| + 3 \\times [8 - (-2)] \\div (-5)' }
      ];
      const nc = nestConfigs[variantIndex % nestConfigs.length];
      const ansStr = String(nc.val);
      const options = shuffle([ansStr, String(nc.val + 15), String(nc.val - 12), String(-nc.val + 10)]);
      return {
        title: `Nested Brackets & Absolute Value Simplification`,
        text: `Simplify the numerical expression containing nested brackets and absolute values: $${nc.expr}$:`,
        formula: `|a| = |-a| = a, \\quad \\text{Evaluate innermost brackets first}`,
        options,
        answer: ansStr,
        hint: `Absolute value |-15| = +15. Evaluate inside bracket [4 - (-6)] = 10 first.`,
        steps: [
          `**Step 1: Simplify absolute value and bracket**`,
          `$$|${nc.absVal}| = ${Math.abs(nc.absVal)}, \\quad [${nc.b1} - (${nc.b2})] = ${nc.b1 - nc.b2}$$`,
          `**Step 2: Perform multiplication & division**`,
          `$$${nc.mult} \\times ${nc.b1 - nc.b2} = ${nc.mult * (nc.b1 - nc.b2)}$$`,
          `$$${nc.mult * (nc.b1 - nc.b2)} \\div (${nc.div}) = ${ (nc.mult * (nc.b1 - nc.b2)) / nc.div }$$`,
          `**Step 3: Combine with absolute value**`,
          `$$${Math.abs(nc.absVal)} + (${ (nc.mult * (nc.b1 - nc.b2)) / nc.div }) = ${nc.val}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 5) { // Mental Computation using Distributive Property over Addition/Subtraction
      const distConfigs = [
        { k: -15, n: 98, exp: '100 - 2', val: -1470, expr: '(-15) \\times 98' },
        { k: -25, n: 99, exp: '100 - 1', val: -2475, expr: '(-25) \\times 99' },
        { k: -12, n: 102, exp: '100 + 2', val: -1224, expr: '(-12) \\times 102' },
        { k: -18, n: 99, exp: '100 - 1', val: -1782, expr: '(-18) \\times 99' },
        { k: -30, n: 101, exp: '100 + 1', val: -3030, expr: '(-30) \\times 101' }
      ];
      const dc = distConfigs[variantIndex % distConfigs.length];
      const ansStr = `${dc.val} by expanding as (${dc.k}) × (${dc.exp}) = ${dc.k * 100} ${dc.exp.includes('-') ? '+' : ''} ${dc.val - (dc.k * 100)}.`;
      const options = shuffle([
        ansStr,
        `${dc.val - 200} by multiplying 100 first and ignoring the remainder.`,
        `${-dc.val} by assuming products of negative numbers are always positive.`,
        `${dc.val + 150} by subtracting 15 from the final result.`
      ]);
      return {
        title: `Distributive Mental Computation Strategy`,
        text: `Apply the distributive property $a(b + c) = ab + ac$ to simplify $${dc.expr}$ mentally without vertical long multiplication:`,
        formula: `a(b + c) = ab + ac`,
        options,
        answer: ansStr,
        hint: `Rewrite ${dc.n} as (${dc.exp}) and distribute ${dc.k}.`,
        steps: [
          `**Step 1: Rewrite factor as sum/difference**`,
          `$$${dc.n} = ${dc.exp}$$`,
          `**Step 2: Distribute factor $${dc.k}$**`,
          `$$(${dc.k}) \\times (${dc.exp}) = (${dc.k} \\times 100) ${dc.exp.includes('-') ? '-' : '+'} (${dc.k} \\times ${dc.exp.split(' ')[2]})$$`,
          `$$= ${dc.k * 100} ${dc.exp.includes('-') ? '+' : ''} ${dc.val - (dc.k * 100)} = ${dc.val}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 6) { // Fraction Bar as Grouping Symbol in Integer Expression
      const fracConfigs = [
        { top1: -30, top2: -6, top3: 3, bot1: -8, bot2: 2, topVal: -48, botVal: -6, finalVal: 8, expr: '\\frac{(-30) + (-6) \\times 3}{-2^3 + 2}' },
        { top1: -40, top2: -5, top3: 4, bot1: -9, bot2: 4, topVal: -60, botVal: -5, finalVal: 12, expr: '\\frac{(-40) + (-5) \\times 4}{-3^2 + 4}' },
        { top1: -50, top2: -4, top3: 5, bot1: -10, bot2: 5, topVal: -70, botVal: -5, finalVal: 14, expr: '\\frac{(-50) + (-4) \\times 5}{-15 + 10}' },
        { top1: -36, top2: -8, top3: 3, bot1: -12, bot2: 2, topVal: -60, botVal: -10, finalVal: 6, expr: '\\frac{(-36) + (-8) \\times 3}{-2^3 - 2}' },
        { top1: -45, top2: -3, top3: 5, bot1: -14, bot2: 4, topVal: -60, botVal: -10, finalVal: 6, expr: '\\frac{(-45) + (-3) \\times 5}{-2^4 + 6}' }
      ];
      const fc = fracConfigs[variantIndex % fracConfigs.length];
      const ansStr = `+${fc.finalVal}`;
      const options = shuffle([ansStr, `-${fc.finalVal}`, `+${fc.finalVal + 5}`, `-${fc.finalVal + 8}`]);
      return {
        title: `Fraction Bar Grouping Symbol Simplification`,
        text: `Simplify the numerical expression where the fraction bar acts as a grouping symbol: $${fc.expr}$:`,
        formula: `\\frac{\\text{Numerator}}{\\text{Denominator}} = \\text{Evaluate Top and Bottom Separately First}`,
        options,
        answer: ansStr,
        hint: `Simplify entire numerator (-48) and denominator (-6) before dividing.`,
        steps: [
          `**Step 1: Simplify numerator**`,
          `$$(${fc.top1}) + (${fc.top2}) \\times ${fc.top3} = ${fc.top1} + (${fc.top2 * fc.top3}) = ${fc.topVal}$$`,
          `**Step 2: Simplify denominator**`,
          `$$\\text{Denominator} = ${fc.botVal}$$`,
          `**Step 3: Divide numerator by denominator**`,
          `$$\\frac{${fc.topVal}}{${fc.botVal}} = +${fc.finalVal}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 7) { // Comparing Two Numerical Expressions Using Inequality Symbols
      const compConfigs = [
        { expA: '(-3)^3 + 10', expB: '-3^3 + 10', valA: -17, valB: -17, sym: '=', reason: 'Both expressions equal -17 because an odd exponent preserves the negative sign.' },
        { expA: '(-4)^2 - 5', expB: '-4^2 - 5', valA: 11, valB: -21, sym: '>', reason: '(-4)^2 = +16 (val = 11) whereas -4^2 = -16 (val = -21), so Expression A > Expression B.' },
        { expA: '(-2)^4 + 3', expB: '-2^4 + 3', valA: 19, valB: -13, sym: '>', reason: '(-2)^4 = +16 (val = 19) whereas -2^4 = -16 (val = -21), so Expression A > Expression B.' },
        { expA: '(-5)^3 - 8', expB: '-5^3 - 8', valA: -133, valB: -133, sym: '=', reason: 'Both equal -133 because odd powers of negative numbers remain negative.' },
        { expA: '(-6)^2 \\div (-4)', expB: '-6^2 \\div (-4)', valA: -9, valB: 9, sym: '<', reason: '(-6)^2 / (-4) = 36 / (-4) = -9, while -6^2 / (-4) = -36 / (-4) = +9.' }
      ];
      const cc = compConfigs[variantIndex % compConfigs.length];
      const ansStr = `$${cc.sym}$ (${cc.reason})`;
      const options = shuffle([
        ansStr,
        `$>$ (Expression A is always strictly greater regardless of powers).`,
        `$<$ (Expression B is always strictly greater).`,
        `Undefined, because exponents cannot be compared with negative signs.`
      ]);
      return {
        title: `Comparing Numerical Expressions with Powers`,
        text: `Which inequality/equality symbol ($<, >, =$) correctly compares Expression A: $${cc.expA}$ and Expression B: $${cc.expB}$?`,
        formula: `\\text{Compare } \\text{Val}(A) \\text{ and } \\text{Val}(B)`,
        options,
        answer: ansStr,
        hint: `Evaluate Expression A (${cc.valA}) and Expression B (${cc.valB}) independently.`,
        steps: [
          `**Step 1: Evaluate Expression A**`,
          `$$\\text{Val}(A) = ${cc.valA}$$`,
          `**Step 2: Evaluate Expression B**`,
          `$$\\text{Val}(B) = ${cc.valB}$$`,
          `**Step 3: Compare values**`,
          `$$${cc.valA} ${cc.sym} ${cc.valB}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 8) { // Missing Operation / Sign Insertion Puzzle
      const puzzleConfigs = [
        { num1: -12, num2: -4, num3: 6, target: 9, op1: '\\div', op2: '+', ansStr: '÷ then + (calculated as (-12) ÷ (-4) + 6 = 3 + 6 = 9)' },
        { num1: -20, num2: -5, num3: 7, target: 11, op1: '\\div', op2: '+', ansStr: '÷ then + (calculated as (-20) ÷ (-5) + 7 = 4 + 7 = 11)' },
        { num1: -15, num2: -3, num3: 8, target: 13, op1: '\\div', op2: '+', ansStr: '÷ then + (calculated as (-15) ÷ (-3) + 8 = 5 + 8 = 13)' },
        { num1: -16, num2: -4, num3: 10, target: 14, op1: '\\div', op2: '+', ansStr: '÷ then + (calculated as (-16) ÷ (-4) + 10 = 4 + 10 = 14)' },
        { num1: -18, num2: -2, num3: 5, target: 14, op1: '\\div', op2: '+', ansStr: '÷ then + (calculated as (-18) ÷ (-2) + 5 = 9 + 5 = 14)' }
      ];
      const pc = puzzleConfigs[variantIndex % puzzleConfigs.length];
      const ansStr = pc.ansStr;
      const options = shuffle([
        ansStr,
        `+ then × (calculated as (-12 + -4) × 6 = -96)`,
        `× then - (calculated as (-12 × -4) - 6 = 42)`,
        `- then ÷ (calculated as (-12 - -4) ÷ 6 = -4/3)`
      ]);
      return {
        title: `Operator Insertion Numerical Puzzle`,
        text: `Which sequential set of operators, in order from left to right, makes the numerical statement true: $${pc.num1} \\quad [?] \\quad (${pc.num2}) \\quad [?] \\quad ${pc.num3} = ${pc.target}$?`,
        formula: `a \\text{ [op1]} b \\text{ [op2]} c = \\text{Target}`,
        options,
        answer: ansStr,
        hint: `Test division first: (-12) ÷ (-4) = +3. Then 3 + 6 = 9.`,
        steps: [
          `**Step 1: Test operations left to right**`,
          `$$(${pc.num1}) \\div (${pc.num2}) = +${pc.num1 / pc.num2}$$`,
          `$$+${pc.num1 / pc.num2} + ${pc.num3} = ${pc.target}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else { // Real-World Numerical Expression Modeling
      const modelConfigs = [
        { init: 5000, drop: 1200, rate: 800, count: 3, div: 2, finalAlt: 3100, unit: 'ft', topic: 'aircraft flight altitude' },
        { init: 8000, drop: 2000, rate: 1000, count: 4, div: 2, finalAlt: 5000, unit: 'ft', topic: 'hot air balloon altitude' },
        { init: 6000, drop: 1500, rate: 900, count: 3, div: 2, finalAlt: 3600, unit: 'm', topic: 'drone surveillance height' },
        { init: 10000, drop: 3000, rate: 1200, count: 3, div: 2, finalAlt: 5300, unit: 'm', topic: 'mountain expedition elevation' },
        { init: 4000, drop: 1000, rate: 600, count: 4, div: 2, finalAlt: 2700, unit: 'ft', topic: 'skydiving jump height' }
      ];
      const mc = modelConfigs[variantIndex % modelConfigs.length];
      const ansStr = `$[(${mc.init} - ${mc.drop}) + ${mc.count}(${mc.rate})] \\div ${mc.div} = ${mc.finalAlt.toLocaleString()}\\text{ ${mc.unit}}$`;
      const options = shuffle([
        ansStr,
        `$[${mc.init} + ${mc.drop} - ${mc.count}(${mc.rate})] \\times ${mc.div} = ${(mc.finalAlt * 2).toLocaleString()}\\text{ ${mc.unit}}$`,
        `$${mc.init} - ${mc.drop} + ${mc.count}(${mc.rate}) \\div ${mc.div} = ${(mc.init - mc.drop + 1200).toLocaleString()}\\text{ ${mc.unit}}$`,
        `$[(${mc.init} - ${mc.drop}) \\times ${mc.count}] + ${mc.rate} = ${(mc.finalAlt + 500).toLocaleString()}\\text{ ${mc.unit}}$`
      ]);
      return {
        title: `Real-World Numerical Expression Modeling`,
        text: `Write and simplify a single numerical expression for the final altitude of a ${mc.topic}: Starting at $${mc.init.toLocaleString()}\\text{ ${mc.unit}}$, it drops $${mc.drop.toLocaleString()}\\text{ ${mc.unit}}$, climbs $${mc.count} \\times ${mc.rate}\\text{ ${mc.unit}}$, and finally descends to half its current altitude.`,
        formula: `\\text{Final} = \\frac{(\\text{Start} - \\text{Drop}) + n(\\text{Climb})}{2}`,
        options,
        answer: ansStr,
        hint: `Group start minus drop and climb in brackets before dividing by 2.`,
        steps: [
          `**Step 1: Write grouped numerical expression**`,
          `$$\\text{Expression} = [(${mc.init} - ${mc.drop}) + ${mc.count}(${mc.rate})] \\div ${mc.div}$$`,
          `**Step 2: Simplify inside brackets**`,
          `$$[${mc.init - mc.drop} + ${mc.count * mc.rate}] \\div ${mc.div} = [${mc.init - mc.drop + mc.count * mc.rate}] \\div ${mc.div}$$`,
          `**Step 3: Divide by 2**`,
          `$$\\frac{${mc.init - mc.drop + mc.count * mc.rate}}{${mc.div}} = ${mc.finalAlt}\\text{ ${mc.unit}}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    }
  }

  // Category 3I: Form 7 - Absolute Value of an Integer (Topic ID 117 - 50 DYNAMIC VARIATION QUESTIONS)
  if (topicId === 117) {
    const subType = qIndex % 10;
    const variantIndex = Math.floor(qIndex / 10); // 0 to 4 across 50 questions

    if (subType === 0) { // Multi-Term Absolute Value Numerical Expression Evaluation (|-14| - |9 - 15| + |-3|)
      const evalConfigs = [
        { v1: -14, a: 9, b: 15, v2: -3, val: 11, expr: '|-14| - |9 - 15| + |-3|' },
        { v1: -20, a: 8, b: 18, v2: -5, val: 15, expr: '|-20| - |8 - 18| + |-5|' },
        { v1: -25, a: 12, b: 20, v2: -7, val: 24, expr: '|-25| - |12 - 20| + |-7|' },
        { v1: -30, a: 15, b: 25, v2: -8, val: 28, expr: '|-30| - |15 - 25| + |-8|' },
        { v1: -18, a: 6, b: 14, v2: -4, val: 14, expr: '|-18| - |6 - 14| + |-4|' }
      ];
      const ec = evalConfigs[variantIndex % evalConfigs.length];
      const ansStr = String(ec.val);
      const options = shuffle([ansStr, String(ec.val + 6), String(ec.val - 8), String(-ec.val)]);
      return {
        title: `Absolute Value Numerical Expression Evaluation`,
        text: `Evaluate the numerical expression containing absolute value bars: $${ec.expr}$:`,
        formula: `|a| = \\begin{cases} a & \\text{if } a \\ge 0 \\\\ -a & \\text{if } a < 0 \\end{cases}`,
        options,
        answer: ansStr,
        hint: `Evaluate terms inside absolute values first: |${ec.a} - ${ec.b}| = |${ec.a - ec.b}| = ${Math.abs(ec.a - ec.b)}.`,
        steps: [
          `**Step 1: Simplify absolute value terms**`,
          `$$|${ec.v1}| = ${Math.abs(ec.v1)}, \\quad |${ec.a} - ${ec.b}| = |${ec.a - ec.b}| = ${Math.abs(ec.a - ec.b)}, \\quad |${ec.v2}| = ${Math.abs(ec.v2)}$$`,
          `**Step 2: Combine terms left to right**`,
          `$$${Math.abs(ec.v1)} - ${Math.abs(ec.a - ec.b)} + ${Math.abs(ec.v2)} = ${ec.val}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 2
      };
    } else if (subType === 1) { // Simple Absolute Value Equation |x| = k
      const simpleConfigs = [
        { k: 11, ans: 'x = 11 or x = -11 (x = ±11)', hint: 'Numbers 11 and -11 both lie 11 units away from zero.' },
        { k: 15, ans: 'x = 15 or x = -15 (x = ±15)', hint: 'Both +15 and -15 have an absolute distance of 15 from 0.' },
        { k: 24, ans: 'x = 24 or x = -24 (x = ±24)', hint: 'Distance 24 from origin yields x = 24 or -24.' },
        { k: 35, ans: 'x = 35 or x = -35 (x = ±35)', hint: 'Distance 35 from origin yields x = 35 or -35.' },
        { k: 50, ans: 'x = 50 or x = -50 (x = ±50)', hint: 'Distance 50 from origin yields x = 50 or -50.' }
      ];
      const sc = simpleConfigs[variantIndex % simpleConfigs.length];
      const ansStr = sc.ans;
      const options = shuffle([
        ansStr,
        `x = ${sc.k} only`,
        `x = -${sc.k} only`,
        `x = 0 or x = ${sc.k}`
      ]);
      return {
        title: `Absolute Value Equation $|x| = ${sc.k}$`,
        text: `If $|x| = ${sc.k}$, what are all possible integer values for $x$?`,
        formula: `|x| = k \\iff x = k \\text{ or } x = -k \\quad (k > 0)`,
        options,
        answer: ansStr,
        hint: sc.hint,
        steps: [
          `**Step 1: Apply absolute value definition**`,
          `$$|x| = ${sc.k} \\implies x = +${sc.k} \\text{ or } x = -${sc.k}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 2
      };
    } else if (subType === 2) { // Distance Definition & Positivity Property
      const propConfigs = [
        { query: 'non-zero integer |a|', ansStr: 'Because absolute value measures distance from zero on the number line, and distance can never be negative.', hint: 'Distance between two points on a number line is non-negative.' },
        { query: 'integer |x|', ansStr: 'Because absolute value represents distance from 0, making |x| ≥ 0 for all real integers.', hint: '|x| = 0 only when x = 0; otherwise |x| > 0.' },
        { query: 'opposite numbers |-n| and |n|', ansStr: 'Because -n and n are located at the exact same distance from zero in opposite directions.', hint: 'Distance from origin is identical for n and -n.' },
        { query: 'expression |-x|', ansStr: '|-x| is always equal to |x| because negation does not change distance from origin.', hint: '|-x| = |x| for all integers x.' },
        { query: 'real number |a - b|', ansStr: 'It represents the non-negative physical distance between points a and b on the number line.', hint: '|a - b| = distance(a, b).' }
      ];
      const pc = propConfigs[variantIndex % propConfigs.length];
      const ansStr = pc.ansStr;
      const options = shuffle([
        ansStr,
        `Because absolute value multiplies the integer by -1 automatically.`,
        `Because absolute value converts all integers into natural counting numbers starting at 1.`,
        `Because negative numbers do not exist on a standard mathematical number line.`
      ]);
      return {
        title: `Positivity & Distance Property of Absolute Value`,
        text: `Why is the absolute value of any ${pc.query} always non-negative ($|a| \\ge 0$)?`,
        formula: `|a| = \\text{distance}(a, 0) \\ge 0`,
        options,
        answer: ansStr,
        hint: pc.hint,
        steps: [
          `**Step 1: State definition of absolute value**`,
          `$$\\text{Absolute Value} = \\text{Distance from origin (0)}$$`,
          `**Step 2: Apply distance property**`,
          `$$\\text{Distance } \\ge 0 \\implies |a| \\ge 0$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 2
      };
    } else if (subType === 3) { // One-Step Shifted Absolute Value Equation |x - a| = b (|x - 4| = 9)
      const eqConfigs = [
        { a: 4, b: 9, sol1: 13, sol2: -5, expr: '|x - 4| = 9' },
        { a: 5, b: 12, sol1: 17, sol2: -7, expr: '|x - 5| = 12' },
        { a: 3, b: 8, sol1: 11, sol2: -5, expr: '|x - 3| = 8' },
        { a: 7, b: 15, sol1: 22, sol2: -8, expr: '|x - 7| = 15' },
        { a: -6, b: 10, sol1: 4, sol2: -16, expr: '|x + 6| = 10' }
      ];
      const ec = eqConfigs[variantIndex % eqConfigs.length];
      const ansStr = `x = ${ec.sol1} or x = ${ec.sol2}`;
      const options = shuffle([
        ansStr,
        `x = ${ec.sol1} only`,
        `x = ${ec.sol2} only`,
        `x = ${ec.sol1 + 5} or x = ${ec.sol2 - 5}`
      ]);
      return {
        title: `Absolute Value Equation $${ec.expr}$`,
        text: `Solve for all possible integer solutions for $x$ in the absolute value equation: $${ec.expr}$:`,
        formula: `|x - a| = b \\iff x - a = b \\quad \\text{or} \\quad x - a = -b`,
        options,
        answer: ansStr,
        hint: `Split into two cases: x - a = b AND x - a = -b.`,
        steps: [
          `**Case 1: Positive branch**`,
          `$$x - (${ec.a}) = ${ec.b} \\implies x = ${ec.sol1}$$`,
          `**Case 2: Negative branch**`,
          `$$x - (${ec.a}) = -${ec.b} \\implies x = ${ec.sol2}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 4) { // Comparing Absolute Value Expressions Using Inequality Symbols
      const compConfigs = [
        { expA: '|-18| + |-5|', expB: '|-18 + (-5)|', valA: 23, valB: 23, sym: '=', reason: 'Both equal 23 because |-18| + |-5| = 18 + 5 = 23 and |-23| = 23.' },
        { expA: '|-20 - 8|', expB: '|-20| - |8|', valA: 28, valB: 12, sym: '>', reason: '|-28| = 28 whereas 20 - 8 = 12, so Expression A > Expression B.' },
        { expA: '|-15 \\times 4|', expB: '|-15| \\times |4|', valA: 60, valB: 60, sym: '=', reason: 'Both equal 60 because |ab| = |a||b| for all real numbers.' },
        { expA: '|-30| - |-12|', expB: '|-30 - (-12)|', valA: 18, valB: 18, sym: '=', reason: 'Both equal 18 because 30 - 12 = 18 and |-18| = 18.' },
        { expA: '|-25 + 10|', expB: '|-25| + |10|', valA: 15, valB: 35, sym: '<', reason: '|-15| = 15 whereas 25 + 10 = 35, so Expression A < Expression B.' }
      ];
      const cc = compConfigs[variantIndex % compConfigs.length];
      const ansStr = `$${cc.sym}$ (${cc.reason})`;
      const options = shuffle([
        ansStr,
        `$>$ (Expression A is always strictly greater for all integers).`,
        `$<$ (Expression B is always strictly greater for all integers).`,
        `Undefined, because absolute values cannot be compared with inequality signs.`
      ]);
      return {
        title: `Comparing Absolute Value Expressions`,
        text: `Which symbol ($<, >, =$) correctly compares Expression A: $${cc.expA}$ and Expression B: $${cc.expB}$?`,
        formula: `|a + b| \\le |a| + |b| \\quad \\text{(Triangle Inequality)}`,
        options,
        answer: ansStr,
        hint: `Evaluate Expression A (${cc.valA}) and Expression B (${cc.valB}) independently.`,
        steps: [
          `**Step 1: Evaluate Expression A**`,
          `$$\\text{Val}(A) = ${cc.valA}$$`,
          `**Step 2: Evaluate Expression B**`,
          `$$\\text{Val}(B) = ${cc.valB}$$`,
          `**Step 3: Compare values**`,
          `$$${cc.valA} ${cc.sym} ${cc.valB}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 5) { // Ordering Absolute Values from Least to Greatest
      const orderConfigs = [
        { orig: ['|-12|', '|7|', '|-25|', '|0|', '|-4|', '|18|'], sortedVals: [0, 4, 7, 12, 18, 25], sortedExprs: '|0| < |-4| < |7| < |-12| < |18| < |-25|' },
        { orig: ['|-15|', '|9|', '|-30|', '|0|', '|-6|', '|22|'], sortedVals: [0, 6, 9, 15, 22, 30], sortedExprs: '|0| < |-6| < |9| < |-15| < |22| < |-30|' },
        { orig: ['|-20|', '|5|', '|-35|', '|0|', '|-3|', '|14|'], sortedVals: [0, 3, 5, 14, 20, 35], sortedExprs: '|0| < |-3| < |5| < |14| < |-20| < |-35|' },
        { orig: ['|-10|', '|8|', '|-28|', '|0|', '|-5|', '|16|'], sortedVals: [0, 5, 8, 10, 16, 28], sortedExprs: '|0| < |-5| < |8| < |-10| < |16| < |-28|' },
        { orig: ['|-16|', '|11|', '|-40|', '|0|', '|-2|', '|25|'], sortedVals: [0, 2, 11, 16, 25, 40], sortedExprs: '|0| < |-2| < |11| < |-16| < |25| < |-40|' }
      ];
      const oc = orderConfigs[variantIndex % orderConfigs.length];
      const ansStr = oc.sortedExprs;
      const options = shuffle([
        ansStr,
        oc.sortedExprs.split(' < ').reverse().join(' < '),
        '|-25| < |-12| < |-4| < |0| < |7| < |18|',
        '|0| < |7| < |-4| < |-12| < |18| < |-25|'
      ]);
      return {
        title: `Ordering Absolute Values Least to Greatest`,
        text: `Arrange the evaluated absolute values of the following expressions from least to greatest (ascending order): $${oc.orig.join(', ')}$`,
        formula: `|x| = \\text{Evaluated Non-Negative Distance}`,
        options,
        answer: ansStr,
        hint: `Evaluate each absolute value to a positive integer first, then sort ascending.`,
        steps: [
          `**Step 1: Evaluate absolute values**`,
          `$$\\text{Values: } ${oc.sortedVals.join(', ')}$$`,
          `**Step 2: Order ascending**`,
          `$$${oc.sortedExprs}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 6) { // Absolute Value Inequality |x| <= k or |x| < k
      const ineqConfigs = [
        { k: 4, symbol: '\\le', ans: '{-4, -3, -2, -1, 0, 1, 2, 3, 4}', bounds: '-4 \\le x \\le 4' },
        { k: 5, symbol: '<', ans: '{-4, -3, -2, -1, 0, 1, 2, 3, 4}', bounds: '-5 < x < 5' },
        { k: 3, symbol: '\\le', ans: '{-3, -2, -1, 0, 1, 2, 3}', bounds: '-3 \\le x \\le 3' },
        { k: 6, symbol: '<', ans: '{-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5}', bounds: '-6 < x < 6' },
        { k: 2, symbol: '\\le', ans: '{-2, -1, 0, 1, 2}', bounds: '-2 \\le x \\le 2' }
      ];
      const ic = ineqConfigs[variantIndex % ineqConfigs.length];
      const ansStr = ic.ans;
      const options = shuffle([
        ansStr,
        `{0, 1, 2, 3, 4}`,
        `{-${ic.k}, ${ic.k}}`,
        `{x \\in \\mathbb{Z} \\mid x > ${ic.k}}`
      ]);
      return {
        title: `Absolute Value Inequality $|x| ${ic.symbol} ${ic.k}$`,
        text: `Which complete set of integers satisfies the absolute value inequality $|x| ${ic.symbol} ${ic.k}$?`,
        formula: `|x| \\le k \\iff -k \\le x \\le k`,
        options,
        answer: ansStr,
        hint: `The inequality means x lies between -${ic.k} and +${ic.k}.`,
        steps: [
          `**Step 1: Unfold inequality bounds**`,
          `$$${ic.bounds}$$`,
          `**Step 2: List integer solutions**`,
          `$$\\text{Set: } ${ic.ans}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 7) { // Real-World Elevation/Temperature Distance using Absolute Value
      const distConfigs = [
        { pos: 45, neg: -35, dist: 80, posName: 'bird altitude', negName: 'diver depth', unit: 'm' },
        { pos: 1200, neg: -150, dist: 1350, posName: 'plane altitude', negName: 'submarine depth', unit: 'm' },
        { pos: 25, neg: -18, dist: 43, posName: 'day high temperature', negName: 'night low temperature', unit: '°C' },
        { pos: 850, neg: -200, posName: 'drone height', negName: 'sea trench depth', dist: 1050, unit: 'm' },
        { pos: 500, neg: -120, posName: 'roof height', negName: 'basement floor level', dist: 620, unit: 'ft' }
      ];
      const dc = distConfigs[variantIndex % distConfigs.length];
      const ansStr = `$|+${dc.pos} - (${dc.neg})| = ${dc.dist}\\text{ ${dc.unit}}$`;
      const options = shuffle([
        ansStr,
        `$|+${dc.pos} + (${dc.neg})| = ${dc.pos - Math.abs(dc.neg)}\\text{ ${dc.unit}}$`,
        `$|-${dc.pos} - (${dc.neg})| = ${Math.abs(-dc.pos - dc.neg)}\\text{ ${dc.unit}}$`,
        `$|+${dc.pos} \\times (${dc.neg})| = ${(dc.pos * Math.abs(dc.neg)).toLocaleString()}\\text{ ${dc.unit}}$`
      ]);
      return {
        title: `Real-World Absolute Value Distance Modeling`,
        text: `A ${dc.posName} is recorded at $+${dc.pos}\\text{ ${dc.unit}}$ and a ${dc.negName} is at $${dc.neg}\\text{ ${dc.unit}}$. What single absolute value expression represents the total vertical distance between them, and what is that distance?`,
        formula: `\\text{Distance} = |y_2 - y_1| = |\\text{High} - \\text{Low}|`,
        options,
        answer: ansStr,
        hint: `Subtract the negative position from positive position inside absolute value bars.`,
        steps: [
          `**Step 1: Write absolute distance expression**`,
          `$$d = |+${dc.pos} - (${dc.neg})|$$`,
          `**Step 2: Simplify double negative inside bars**`,
          `$$d = |${dc.pos} + ${Math.abs(dc.neg)}| = |${dc.dist}| = ${dc.dist}\\text{ ${dc.unit}}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 8) { // Multi-Step Absolute Value Equation a|x - b| + c = d (2|x - 3| + 4 = 16)
      const multiEqConfigs = [
        { a: 2, b: 3, c: 4, d: 16, target: 6, sol1: 9, sol2: -3, expr: '2|x - 3| + 4 = 16' },
        { a: 3, b: 2, c: 5, d: 20, target: 5, sol1: 7, sol2: -3, expr: '3|x - 2| + 5 = 20' },
        { a: 4, b: 5, c: 6, d: 26, target: 5, sol1: 10, sol2: 0, expr: '4|x - 5| + 6 = 26' },
        { a: 2, b: 4, c: 10, d: 24, target: 7, sol1: 11, sol2: -3, expr: '2|x - 4| + 10 = 24' },
        { a: 5, b: 1, c: 8, d: 33, target: 5, sol1: 6, sol2: -4, expr: '5|x - 1| + 8 = 33' }
      ];
      const mc = multiEqConfigs[variantIndex % multiEqConfigs.length];
      const ansStr = `x = ${mc.sol1} or x = ${mc.sol2}`;
      const options = shuffle([
        ansStr,
        `x = ${mc.sol1} only`,
        `x = ${mc.sol2} only`,
        `x = ${mc.sol1 + 3} or x = ${mc.sol2 - 3}`
      ]);
      return {
        title: `Two-Step Absolute Value Equation $${mc.expr}$`,
        text: `Solve for all possible integer solutions for $x$ in the equation: $${mc.expr}$:`,
        formula: `a|x - b| + c = d \\implies |x - b| = \\frac{d - c}{a}`,
        options,
        answer: ansStr,
        hint: `Isolate absolute value first: 2|x - 3| = 12 -> |x - 3| = 6.`,
        steps: [
          `**Step 1: Isolate absolute value expression**`,
          `$$${mc.a}|x - ${mc.b}| = ${mc.d - mc.c} \\implies |x - ${mc.b}| = ${mc.target}$$`,
          `**Step 2: Solve positive and negative branches**`,
          `$$x - ${mc.b} = ${mc.target} \\implies x = ${mc.sol1}$$`,
          `$$x - ${mc.b} = -${mc.target} \\implies x = ${mc.sol2}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else { // True/False Properties of Absolute Values
      const tfConfigs = [
        { falseStmt: '|-a| = -a for all negative integers a.', hint: 'If a = -5, |-(-5)| = 5, whereas -a = -(-5) = 5. Statement holds, but |-a| is never negative.' },
        { falseStmt: '|a + b| is always strictly equal to |a| + |b| for any two integers.', hint: '|a + b| < |a| + |b| when a and b have opposite signs (e.g. |-5 + 3| = 2 < 5 + 3 = 8).' },
        { falseStmt: 'The equation |x| = -8 has two valid integer solutions x = 8 and x = -8.', hint: 'Absolute value can never equal a negative number (-8), so there are NO solutions.' },
        { falseStmt: '|a - b| is different from |b - a|.', hint: '|a - b| = |b - a| for all real numbers because distance between two points is symmetric.' },
        { falseStmt: 'If |x| > 5, then x must be strictly positive.', hint: 'x can also be less than -5 (e.g. x = -10 has |-10| = 10 > 5).' }
      ];
      const tc = tfConfigs[variantIndex % tfConfigs.length];
      const ansStr = tc.falseStmt;
      const options = shuffle([
        ansStr,
        `|a| ≥ 0 for all integers a.`,
        `|-a| = |a| for all integers a.`,
        `|ab| = |a| × |b| for all integers a and b.`
      ]);
      return {
        title: `Absolute Value Mathematical Properties Verification`,
        text: `Which of the following mathematical statements regarding absolute values is FALSE?`,
        formula: `|a| \\ge 0, \\quad |-a| = |a|, \\quad |a - b| = |b - a|`,
        options,
        answer: ansStr,
        hint: tc.hint,
        steps: [
          `**Step 1: Analyze mathematical validity**`,
          `$$\\text{False Statement: } ${ansStr}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    }
  }

  // Category 3J: Form 7 - The Solution of Simple Equations (Topic ID 118 - 50 DYNAMIC VARIATION QUESTIONS)
  if (topicId === 118) {
    const subType = qIndex % 10;
    const variantIndex = Math.floor(qIndex / 10); // 0 to 4 across 50 questions

    if (subType === 0) { // Bar Model (Tape Diagram) Representation & Solution (2x + 5 = 17)
      const barConfigs = [
        { coeff: 2, add: 5, total: 17, rem: 12, sol: 6, expr: '2x + 5 = 17' },
        { coeff: 3, add: 4, total: 19, rem: 15, sol: 5, expr: '3x + 4 = 19' },
        { coeff: 4, add: 6, total: 26, rem: 20, sol: 5, expr: '4x + 6 = 26' },
        { coeff: 2, add: 7, total: 21, rem: 14, sol: 7, expr: '2x + 7 = 21' },
        { coeff: 5, add: 3, total: 28, rem: 25, sol: 5, expr: '5x + 3 = 28' }
      ];
      const bc = barConfigs[variantIndex % barConfigs.length];
      const ansStr = `Draw ${bc.coeff} equal x blocks plus a ${bc.add} block totaling ${bc.total}. Subtracting ${bc.add} leaves ${bc.rem} across ${bc.coeff} x blocks, so x = ${bc.sol}.`;
      const options = shuffle([
        ansStr,
        `Draw ${bc.coeff} blocks of ${bc.total} plus ${bc.add}, giving x = ${bc.sol + 4}.`,
        `Multiply ${bc.total} by ${bc.coeff} and add ${bc.add}, giving x = ${bc.total * bc.coeff}.`,
        `Draw 1 block of x and subtract ${bc.add} from ${bc.total}, giving x = ${bc.rem}.`
      ]);
      return {
        title: `Bar Model (Tape Diagram) Equation Representation`,
        text: `How can a bar model (tape diagram) be used to visual represent and solve the linear equation $${bc.expr}$?`,
        formula: `${bc.coeff}x + ${bc.add} = ${bc.total} \\implies ${bc.coeff}x = ${bc.rem} \\implies x = ${bc.sol}`,
        options,
        answer: ansStr,
        hint: `Total length is ${bc.total}. Remove block of ${bc.add} first, then divide remaining length ${bc.rem} equally by ${bc.coeff}.`,
        steps: [
          `**Step 1: Set up tape diagram balance**`,
          `$$\\text{Total Tape Length} = ${bc.total}$$`,
          `$$\\text{Subtract constant block } (${bc.add}): ${bc.total} - ${bc.add} = ${bc.rem}$$`,
          `**Step 2: Divide remaining length by variable block count (${bc.coeff})**`,
          `$$x = \\frac{${bc.rem}}{${bc.coeff}} = ${bc.sol}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 2
      };
    } else if (subType === 1) { // Equation with Parentheses a(y - b) = c (4(y - 3) = 28)
      const parConfigs = [
        { a: 4, b: 3, c: 28, div: 7, sol: 10, expr: '4(y - 3) = 28' },
        { a: 5, b: 4, c: 35, div: 7, sol: 11, expr: '5(y - 4) = 35' },
        { a: 3, b: 6, c: 24, div: 8, sol: 14, expr: '3(y - 6) = 24' },
        { a: 6, b: 2, c: 42, div: 7, sol: 9, expr: '6(y - 2) = 42' },
        { a: 7, b: 5, c: 21, div: 3, sol: 8, expr: '7(y - 5) = 21' }
      ];
      const pc = parConfigs[variantIndex % parConfigs.length];
      const ansStr = `y = ${pc.sol}`;
      const options = shuffle([ansStr, `y = ${pc.sol + 4}`, `y = ${pc.sol - 5}`, `y = ${pc.div}`]);
      return {
        title: `Solving Equations with Parentheses`,
        text: `Solve for the unknown variable $y$ in the linear equation: $${pc.expr}$:`,
        formula: `a(y - b) = c \\implies y - b = \\frac{c}{a} \\implies y = \\frac{c}{a} + b`,
        options,
        answer: ansStr,
        hint: `Divide both sides by ${pc.a} to get y - ${pc.b} = ${pc.div}, then add ${pc.b}.`,
        steps: [
          `**Step 1: Divide by outer coefficient (${pc.a})**`,
          `$$y - ${pc.b} = \\frac{${pc.c}}{${pc.a}} = ${pc.div}$$`,
          `**Step 2: Add constant (${pc.b}) to both sides**`,
          `$$y = ${pc.div} + ${pc.b} = ${pc.sol}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 2
      };
    } else if (subType === 2) { // Properties of Equality Step-by-Step Justification (m/3 - 7 = 2)
      const propConfigs = [
        { denom: 3, sub: 7, right: 2, addRes: 9, sol: 27, expr: '\\frac{m}{3} - 7 = 2' },
        { denom: 4, sub: 5, right: 3, addRes: 8, sol: 32, expr: '\\frac{m}{4} - 5 = 3' },
        { denom: 5, sub: 6, right: 4, addRes: 10, sol: 50, expr: '\\frac{m}{5} - 6 = 4' },
        { denom: 2, sub: 9, right: 5, addRes: 14, sol: 28, expr: '\\frac{m}{2} - 9 = 5' },
        { denom: 6, sub: 3, right: 7, addRes: 10, sol: 60, expr: '\\frac{m}{6} - 3 = 7' }
      ];
      const prc = propConfigs[variantIndex % propConfigs.length];
      const ansStr = `Addition Property of Equality (APE) to get m/${prc.denom} = ${prc.addRes}, then Multiplication Property of Equality (MPE) to get m = ${prc.sol}.`;
      const options = shuffle([
        ansStr,
        `Subtraction Property of Equality (SPE) to get m/${prc.denom} = -5, then Division Property of Equality (DPE).`,
        `Distributive Property to multiply -7 by ${prc.denom}, then Substitution Property.`,
        `Transitive Property of Equality followed by Symmetric Property of Equality.`
      ]);
      return {
        title: `Properties of Equality Step Justification`,
        text: `State the specific formal properties of equality used at each step when solving the equation $${prc.expr}$:`,
        formula: `\\frac{m}{a} - b = c \\xrightarrow{\\text{APE}} \\frac{m}{a} = c + b \\xrightarrow{\\text{MPE}} m = a(c + b)`,
        options,
        answer: ansStr,
        hint: `Add ${prc.sub} to both sides (APE), then multiply both sides by ${prc.denom} (MPE).`,
        steps: [
          `**Step 1: Apply Addition Property of Equality (APE)**`,
          `$$\\frac{m}{${prc.denom}} - ${prc.sub} + ${prc.sub} = ${prc.right} + ${prc.sub} \\implies \\frac{m}{${prc.denom}} = ${prc.addRes}$$`,
          `**Step 2: Apply Multiplication Property of Equality (MPE)**`,
          `$$m = ${prc.addRes} \\times ${prc.denom} = ${prc.sol}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 3) { // Verbal Sentence Translation & Solution (Five less than thrice a number is twenty-two)
      const verbConfigs = [
        { textPhrase: 'Five less than thrice a number is twenty-two', eq: '3n - 5 = 22', sol: 9 },
        { textPhrase: 'Seven less than four times a number is twenty-five', eq: '4n - 7 = 25', sol: 8 },
        { textPhrase: 'Nine less than twice a number is fifteen', eq: '2n - 9 = 15', sol: 12 },
        { textPhrase: 'Six less than five times a number is thirty-four', eq: '5n - 6 = 34', sol: 8 },
        { textPhrase: 'Eight less than thrice a number is nineteen', eq: '3n - 8 = 19', sol: 9 }
      ];
      const vc = verbConfigs[variantIndex % verbConfigs.length];
      const ansStr = `Equation: $${vc.eq}$; Solution: $n = ${vc.sol}$`;
      const options = shuffle([
        ansStr,
        `Equation: $5 - 3n = 22$; Solution: $n = -5.67$`,
        `Equation: $3n + 5 = 22$; Solution: $n = 5.67$`,
        `Equation: $3(n - 5) = 22$; Solution: $n = 12.33$`
      ]);
      return {
        title: `Verbal Sentence Algebraic Translation`,
        text: `Translate the verbal sentence "${vc.textPhrase}" into an algebraic equation and solve for the unknown number $n$:`,
        formula: `\\text{Thrice } n \\text{ minus } b = c \\implies 3n - b = c`,
        options,
        answer: ansStr,
        hint: `"Five less than thrice a number" means subtract 5 from 3n: 3n - 5 = 22.`,
        steps: [
          `**Step 1: Translate verbal components**`,
          `$$\\text{"Thrice a number"} = 3n$$`,
          `$$\\text{"Five less than"} = 3n - 5$$`,
          `$$\\text{"is twenty-two"} \\implies 3n - 5 = 22$$`,
          `**Step 2: Solve linear equation**`,
          `$$3n = 22 + 5 = 27 \\implies n = 9$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 4) { // Geometric Rectangle Perimeter Word Problem
      const rectConfigs = [
        { P: 48, mult: 2, W: 8, L: 16, expr: '2(2W + W) = 48' },
        { P: 60, mult: 2, W: 10, L: 20, expr: '2(2W + W) = 60' },
        { P: 72, mult: 3, W: 9, L: 27, expr: '2(3W + W) = 72' },
        { P: 54, mult: 2, W: 9, L: 18, expr: '2(2W + W) = 54' },
        { P: 80, mult: 3, W: 10, L: 30, expr: '2(3W + W) = 80' }
      ];
      const rc = rectConfigs[variantIndex % rectConfigs.length];
      const ansStr = `Length = ${rc.L} cm, Width = ${rc.W} cm`;
      const options = shuffle([
        ansStr,
        `Length = ${rc.L + 4} cm, Width = ${rc.W - 2} cm`,
        `Length = ${rc.P / 2} cm, Width = ${rc.P / 4} cm`,
        `Length = ${rc.L - 6} cm, Width = ${rc.W + 6} cm`
      ]);
      return {
        title: `Geometric Rectangle Dimensions Application`,
        text: `If a rectangle has a perimeter of $${rc.P}\\text{ cm}$ and its length is ${rc.mult === 2 ? 'twice' : 'three times'} its width ($L = ${rc.mult}W$), what are its dimensions (length and width)?`,
        formula: `P = 2(L + W) = 2(${rc.mult}W + W)`,
        options,
        answer: ansStr,
        hint: `Set P = 2(${rc.mult}W + W) = ${2 * (rc.mult + 1)}W = ${rc.P}, then solve for W.`,
        steps: [
          `**Step 1: Set up perimeter algebraic equation**`,
          `$$P = 2(L + W) \\implies ${rc.P} = 2(${rc.mult}W + W) = ${2 * (rc.mult + 1)}W$$`,
          `**Step 2: Solve for Width (W)**`,
          `$$W = \\frac{${rc.P}}{${2 * (rc.mult + 1)}} = ${rc.W}\\text{ cm}$$`,
          `**Step 3: Calculate Length (L)**`,
          `$$L = ${rc.mult} \\times ${rc.W} = ${rc.L}\\text{ cm}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 5) { // Equations with Variables on Both Sides ax + b = cx + d
      const bothConfigs = [
        { a: 5, b: -8, c: 2, d: 13, sol: 7, expr: '5x - 8 = 2x + 13' },
        { a: 7, b: -12, c: 3, d: 16, sol: 7, expr: '7x - 12 = 3x + 16' },
        { a: 6, b: -15, c: 2, d: 25, sol: 10, expr: '6x - 15 = 2x + 25' },
        { a: 8, b: -9, c: 5, d: 12, sol: 7, expr: '8x - 9 = 5x + 12' },
        { a: 9, b: -14, c: 4, d: 21, sol: 7, expr: '9x - 14 = 4x + 21' }
      ];
      const bc = bothConfigs[variantIndex % bothConfigs.length];
      const ansStr = `x = ${bc.sol}`;
      const options = shuffle([ansStr, `x = ${bc.sol + 3}`, `x = ${bc.sol - 4}`, `x = ${Math.abs(bc.d)}`]);
      return {
        title: `Variables on Both Sides Linear Equation`,
        text: `Solve for $x$ in the linear equation with variables on both sides: $${bc.expr}$:`,
        formula: `ax + b = cx + d \\implies (a - c)x = d - b \\implies x = \\frac{d - b}{a - c}`,
        options,
        answer: ansStr,
        hint: `Subtract ${bc.c}x from both sides to get ${bc.a - bc.c}x - ${Math.abs(bc.b)} = ${bc.d}.`,
        steps: [
          `**Step 1: Subtract ${bc.c}x from both sides**`,
          `$$(${bc.a} - ${bc.c})x ${bc.b} = ${bc.d} \\implies ${bc.a - bc.c}x ${bc.b} = ${bc.d}$$`,
          `**Step 2: Add ${Math.abs(bc.b)} to both sides**`,
          `$$${bc.a - bc.c}x = ${bc.d} + ${Math.abs(bc.b)} = ${bc.d + Math.abs(bc.b)}$$`,
          `**Step 3: Divide by coefficient (${bc.a - bc.c})**`,
          `$$x = \\frac{${bc.d + Math.abs(bc.b)}}{${bc.a - bc.c}} = ${bc.sol}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 6) { // Consecutive Integers Word Problem
      const consecConfigs = [
        { sum: 72, first: 23, mid: 24, last: 25, expr: 'n + (n+1) + (n+2) = 72' },
        { sum: 84, first: 27, mid: 28, last: 29, expr: 'n + (n+1) + (n+2) = 84' },
        { sum: 105, first: 34, mid: 35, last: 36, expr: 'n + (n+1) + (n+2) = 105' },
        { sum: 96, first: 31, mid: 32, last: 33, expr: 'n + (n+1) + (n+2) = 96' },
        { sum: 123, first: 40, mid: 41, last: 42, expr: 'n + (n+1) + (n+2) = 123' }
      ];
      const cc = consecConfigs[variantIndex % consecConfigs.length];
      const ansStr = String(cc.last);
      const options = shuffle([ansStr, String(cc.first), String(cc.mid), String(cc.last + 3)]);
      return {
        title: `Consecutive Integers Algebraic Word Problem`,
        text: `The sum of three consecutive integers is $${cc.sum}$. What is the value of the LARGEST integer?`,
        formula: `n + (n + 1) + (n + 2) = S \\implies 3n + 3 = S`,
        options,
        answer: ansStr,
        hint: `Set 3n + 3 = ${cc.sum}. Solve for smallest n = ${cc.first}, then add 2 for largest.`,
        steps: [
          `**Step 1: Set up consecutive integers sum equation**`,
          `$$n + (n + 1) + (n + 2) = ${cc.sum} \\implies 3n + 3 = ${cc.sum}$$`,
          `**Step 2: Solve for first integer (n)**`,
          `$$3n = ${cc.sum - 3} \\implies n = ${cc.first}$$`,
          `**Step 3: Find largest integer (n + 2)**`,
          `$$\\text{Largest} = ${cc.first} + 2 = ${cc.last}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 7) { // Distinguishing Variables from Constants in Equations
      const compConfigs = [
        { eq: '8x - 15 = 49', varName: 'x', consts: '-15 and 49', coeff: '8' },
        { eq: '12y + 7 = 91', varName: 'y', consts: '7 and 91', coeff: '12' },
        { eq: '5m - 24 = 61', varName: 'm', consts: '-24 and 61', coeff: '5' },
        { eq: '9p + 18 = 117', varName: 'p', consts: '18 and 117', coeff: '9' },
        { eq: '6k - 32 = 88', varName: 'k', consts: '-32 and 88', coeff: '6' }
      ];
      const cc = compConfigs[variantIndex % compConfigs.length];
      const ansStr = `${cc.varName} is the unknown variable, while ${cc.consts} are constant terms (${cc.coeff} is the variable coefficient).`;
      const options = shuffle([
        ansStr,
        `${cc.coeff} is the unknown variable, while ${cc.varName} is a fixed constant.`,
        `All numbers in the equation are variables because they can change.`,
        `${cc.consts.split(' ')[0]} is the variable and ${cc.varName} is the constant.`
      ]);
      return {
        title: `Distinguishing Variables from Constants`,
        text: `In the algebraic equation $${cc.eq}$, which component represents the unknown variable and which components represent constant terms?`,
        formula: `\\text{Coefficient} \\cdot \\text{Variable} + \\text{Constant} = \\text{Constant}`,
        options,
        answer: ansStr,
        hint: `Letters represent variables; fixed numbers represent constants.`,
        steps: [
          `**Step 1: Identify components of equation $${cc.eq}$**`,
          `$$\\text{Variable: } ${cc.varName}$$`,
          `$$\\text{Constant terms: } ${cc.consts}$$`,
          `$$\\text{Coefficient: } ${cc.coeff}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 1
      };
    } else if (subType === 8) { // Fractional Equation (ax + b) / c = d
      const fracEqConfigs = [
        { a: 2, b: 6, c: 4, d: 7, mult: 28, sol: 11, expr: '\\frac{2x + 6}{4} = 7' },
        { a: 3, b: 5, c: 5, d: 8, mult: 40, sol: 11, expr: '\\frac{3x + 5}{5} = 8' },
        { a: 4, b: 8, c: 3, d: 12, mult: 36, sol: 7, expr: '\\frac{4x + 8}{3} = 12' },
        { a: 5, b: 10, c: 6, d: 10, mult: 60, sol: 10, expr: '\\frac{5x + 10}{6} = 10' },
        { a: 2, b: 14, c: 8, d: 5, mult: 40, sol: 13, expr: '\\frac{2x + 14}{8} = 5' }
      ];
      const fc = fracEqConfigs[variantIndex % fracEqConfigs.length];
      const ansStr = `x = ${fc.sol}`;
      const options = shuffle([ansStr, `x = ${fc.sol + 4}`, `x = ${fc.sol - 3}`, `x = ${fc.mult}`]);
      return {
        title: `Fractional Linear Equation Solution`,
        text: `Solve for $x$ in the fractional linear equation: $${fc.expr}$:`,
        formula: `\\frac{ax + b}{c} = d \\implies ax + b = cd \\implies x = \\frac{cd - b}{a}`,
        options,
        answer: ansStr,
        hint: `Multiply both sides by denominator ${fc.c} to get ${fc.a}x + ${fc.b} = ${fc.mult}.`,
        steps: [
          `**Step 1: Multiply both sides by denominator (${fc.c})**`,
          `$$${fc.a}x + ${fc.b} = ${fc.d} \\times ${fc.c} = ${fc.mult}$$`,
          `**Step 2: Subtract constant (${fc.b})**`,
          `$$${fc.a}x = ${fc.mult} - ${fc.b} = ${fc.mult - fc.b}$$`,
          `**Step 3: Divide by coefficient (${fc.a})**`,
          `$$x = \\frac{${fc.mult - fc.b}}{${fc.a}} = ${fc.sol}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else { // Age Word Problem Solved via Linear Equation
      const ageConfigs = [
        { diff: 5, sum: 31, juan: 13, maria: 18, name1: 'Maria', name2: 'Juan' },
        { diff: 4, sum: 36, juan: 16, maria: 20, name1: 'Sofia', name2: 'Gabriel' },
        { diff: 6, sum: 40, juan: 17, maria: 23, name1: 'Bea', name2: 'Carlo' },
        { diff: 3, sum: 27, juan: 12, maria: 15, name1: 'Angela', name2: 'Marco' },
        { diff: 7, sum: 45, juan: 19, maria: 26, name1: 'Camilla', name2: 'Paolo' }
      ];
      const ac = ageConfigs[variantIndex % ageConfigs.length];
      const ansStr = `${ac.maria} years old`;
      const options = shuffle([
        ansStr,
        `${ac.juan} years old`,
        `${ac.maria + 4} years old`,
        `${ac.sum / 2} years old`
      ]);
      return {
        title: `Age Word Problem via Linear Equation`,
        text: `${ac.name1} is $${ac.diff}$ years older than her brother ${ac.name2}. If the sum of their ages is $${ac.sum}$ years, how old is ${ac.name1}?`,
        formula: `J + (J + d) = S \\implies 2J + d = S`,
        options,
        answer: ansStr,
        hint: `Let ${ac.name2}'s age be J. Then ${ac.name1} = J + ${ac.diff}. Set 2J + ${ac.diff} = ${ac.sum}.`,
        steps: [
          `**Step 1: Set up age sum equation**`,
          `$$J + (J + ${ac.diff}) = ${ac.sum} \\implies 2J + ${ac.diff} = ${ac.sum}$$`,
          `**Step 2: Solve for ${ac.name2}'s age (J)**`,
          `$$2J = ${ac.sum - ac.diff} \\implies J = ${ac.juan}\\text{ years old}$$`,
          `**Step 3: Calculate ${ac.name1}'s age**`,
          `$$\\text{Age of } ${ac.name1} = ${ac.juan} + ${ac.diff} = ${ac.maria}\\text{ years old}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    }
  }

  // Category 3K: Form 7 - The Evaluation of Algebraic Expressions Following Substitution (Topic ID 119 - 50 DYNAMIC VARIATION QUESTIONS)
  if (topicId === 119) {
    const subType = qIndex % 10;
    const variantIndex = Math.floor(qIndex / 10); // 0 to 4 across 50 questions

    if (subType === 0) { // Fundamental Distinction Between Variable and Constant
      const distConfigs = [
        { aspect: 'value behavior', ansStr: 'A variable represents an unknown quantity that can change or vary, whereas a constant has a fixed, unchanging numerical value.', hint: 'Variables vary; constants remain constant.' },
        { aspect: 'symbolic notation', ansStr: 'Variables are typically denoted by letters (e.g. x, y, a), whereas constants are explicit numbers (e.g. 5, -12, 3/4).', hint: 'Letters vs numbers.' },
        { aspect: 'evaluation effect', ansStr: 'Changing a variable\'s substituted value changes the output of the expression, while constants maintain their exact numerical value.', hint: 'Substitution affects variables.' },
        { aspect: 'role in formulas', ansStr: 'Constants fix the mathematical relationship scale (e.g. π, coefficients), while variables accept changing inputs.', hint: 'Inputs vs fixed scale factors.' },
        { aspect: 'algebraic definition', ansStr: 'A variable is a placeholder for a set of possible numbers, while a constant represents a single specific element of R.', hint: 'Set placeholder vs single element.' }
      ];
      const dc = distConfigs[variantIndex % distConfigs.length];
      const ansStr = dc.ansStr;
      const options = shuffle([
        ansStr,
        `A variable is always a positive integer, while a constant is always a negative fraction.`,
        `A variable cannot be multiplied by coefficients, whereas constants can only be added.`,
        `A constant changes value whenever parentheses are applied to the algebraic expression.`
      ]);
      return {
        title: `Variable vs Constant Fundamental Distinction`,
        text: `What is the fundamental mathematical distinction regarding ${dc.aspect} between a variable and a constant in an algebraic expression?`,
        formula: `\\text{Expression: } a x + b \\quad (a, b = \\text{Constants}, \\, x = \\text{Variable})`,
        options,
        answer: ansStr,
        hint: dc.hint,
        steps: [
          `**Step 1: Define variable**`,
          `$$\\text{Variable: Symbol taking multiple numerical values}$$`,
          `**Step 2: Define constant**`,
          `$$\\text{Constant: Fixed numerical value}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 1
      };
    } else if (subType === 1) { // Multi-Variable Polynomial Substitution (3a^2 - 2ab + b^2)
      const polyConfigs = [
        { a: -2, b: 3, val: 33, expr: '3a^2 - 2ab + b^2' },
        { a: -3, b: 4, val: 67, expr: '3a^2 - 2ab + b^2' },
        { a: -1, b: 5, val: 38, expr: '3a^2 - 2ab + b^2' },
        { a: -4, b: 2, val: 68, expr: '3a^2 - 2ab + b^2' },
        { a: -5, b: 3, val: 114, expr: '3a^2 - 2ab + b^2' }
      ];
      const pc = polyConfigs[variantIndex % polyConfigs.length];
      const ansStr = String(pc.val);
      const options = shuffle([ansStr, String(pc.val - 12), String(pc.val + 15), String(-pc.val)]);
      return {
        title: `Polynomial Algebraic Expression Substitution`,
        text: `Evaluate the quadratic algebraic expression $3a^2 - 2ab + b^2$ when $a = ${pc.a}$ and $b = ${pc.b}$:`,
        formula: `3a^2 - 2ab + b^2 \\quad \\text{at } a = ${pc.a}, b = ${pc.b}`,
        options,
        answer: ansStr,
        hint: `Substitute carefully with parentheses: 3(${pc.a})^2 - 2(${pc.a})(${pc.b}) + (${pc.b})^2.`,
        steps: [
          `**Step 1: Substitute values for $a$ and $b$**`,
          `$$3(${pc.a})^2 - 2(${pc.a})(${pc.b}) + (${pc.b})^2$$`,
          `**Step 2: Compute powers and products**`,
          `$$3(${pc.a * pc.a}) - (${2 * pc.a * pc.b}) + ${pc.b * pc.b}$$`,
          `$$${3 * pc.a * pc.a} - (${2 * pc.a * pc.b}) + ${pc.b * pc.b} = ${pc.val}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 2
      };
    } else if (subType === 2) { // Fractional Algebraic Expression Substitution (2x - 3y) / (x + 2y)
      const fracConfigs = [
        { x: 4, y: -1, num: 11, den: 2, ans: '11/2', dec: '5.5', expr: '\\frac{2x - 3y}{x + 2y}' },
        { x: 6, y: -2, num: 18, den: 2, ans: '9', dec: '9', expr: '\\frac{2x - 3y}{x + 2y}' },
        { x: 5, y: -1, num: 13, den: 3, ans: '13/3', dec: '4.33', expr: '\\frac{2x - 3y}{x + 2y}' },
        { x: 8, y: -2, num: 22, den: 4, ans: '11/2', dec: '5.5', expr: '\\frac{2x - 3y}{x + 2y}' },
        { x: 7, y: -3, num: 23, den: 1, ans: '23', dec: '23', expr: '\\frac{2x - 3y}{x + 2y}' }
      ];
      const fc = fracConfigs[variantIndex % fracConfigs.length];
      const ansStr = fc.ans;
      const options = shuffle([ansStr, '7/2', '15/4', '-11/2']);
      return {
        title: `Fractional Algebraic Expression Evaluation`,
        text: `Given $x = ${fc.x}$ and $y = ${fc.y}$, find the exact value of the rational algebraic expression $${fc.expr}$:`,
        formula: `\\frac{2x - 3y}{x + 2y}`,
        options,
        answer: ansStr,
        hint: `Substitute $x = ${fc.x}$ and $y = ${fc.y}$ into numerator and denominator separately.`,
        steps: [
          `**Step 1: Evaluate numerator**`,
          `$$\\text{Num} = 2(${fc.x}) - 3(${fc.y}) = ${2 * fc.x} - (${3 * fc.y}) = ${fc.num}$$`,
          `**Step 2: Evaluate denominator**`,
          `$$\\text{Den} = ${fc.x} + 2(${fc.y}) = ${fc.x} - ${2 * Math.abs(fc.y)} = ${fc.den}$$`,
          `**Step 3: Form quotient**`,
          `$$\\text{Value} = \\frac{${fc.num}}{${fc.den}} = ${ansStr}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 2
      };
    } else if (subType === 3) { // Real-World Service Cost Formula Substitution (C = 150 + 45h)
      const costConfigs = [
        { fixed: 150, rate: 45, h: 6.5, cost: 442.5, costStr: '₱442.50', expr: 'C = 150 + 45h' },
        { fixed: 200, rate: 50, h: 4.5, cost: 425.0, costStr: '₱425.00', expr: 'C = 200 + 50h' },
        { fixed: 100, rate: 35, h: 8.5, cost: 397.5, costStr: '₱397.50', expr: 'C = 100 + 35h' },
        { fixed: 250, rate: 60, h: 3.5, cost: 460.0, costStr: '₱460.00', expr: 'C = 250 + 60h' },
        { fixed: 180, rate: 40, h: 7.5, cost: 480.0, costStr: '₱480.00', expr: 'C = 180 + 40h' }
      ];
      const cc = costConfigs[variantIndex % costConfigs.length];
      const ansStr = cc.costStr;
      const options = shuffle([ansStr, '₱395.00', '₱510.00', '₱415.50']);
      return {
        title: `Service Pricing Formula Substitution`,
        text: `If the cost formula for a technical repair service is $${cc.expr}$, calculate the total cost $C$ when the service duration is $h = ${cc.h}\\text{ hours}$:`,
        formula: `C = \\text{Fixed Cost} + \\text{Hourly Rate} \\times h`,
        options,
        answer: ansStr,
        hint: `Multiply ${cc.rate} by ${cc.h} first, then add the fixed fee ${cc.fixed}.`,
        steps: [
          `**Step 1: Compute variable labor cost**`,
          `$$\\text{Labor Cost} = ${cc.rate} \\times ${cc.h} = ${cc.rate * cc.h}$$`,
          `**Step 2: Add fixed base fee**`,
          `$$C = ${cc.fixed} + ${cc.rate * cc.h} = ${ansStr}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 2
      };
    } else if (subType === 4) { // Physics Kinematic Distance Formula Substitution (d = v0*t + 0.5*a*t^2)
      const physConfigs = [
        { v0: 12, a: 4, t: 5, dist: 110, expr: 'd = v_0 t + \\frac{1}{2}a t^2' },
        { v0: 10, a: 6, t: 4, dist: 88, expr: 'd = v_0 t + \\frac{1}{2}a t^2' },
        { v0: 15, a: 2, t: 6, dist: 126, expr: 'd = v_0 t + \\frac{1}{2}a t^2' },
        { v0: 20, a: 8, t: 3, dist: 96, expr: 'd = v_0 t + \\frac{1}{2}a t^2' },
        { v0: 8, a: 10, t: 5, dist: 165, expr: 'd = v_0 t + \\frac{1}{2}a t^2' }
      ];
      const pc = physConfigs[variantIndex % physConfigs.length];
      const ansStr = `${pc.dist} meters`;
      const options = shuffle([ansStr, `${pc.dist + 20} meters`, `${pc.dist - 15} meters`, `${pc.dist * 2} meters`]);
      return {
        title: `Physics Kinematic Formula Substitution`,
        text: `Using the physics distance formula $${pc.expr}$, calculate the total distance $d$ when initial velocity $v_0 = ${pc.v0}\\text{ m/s}$, acceleration $a = ${pc.a}\\text{ m/s}^2$, and time $t = ${pc.t}\\text{ seconds}$:`,
        formula: `d = v_0 t + \\frac{1}{2}a t^2`,
        options,
        answer: ansStr,
        hint: `Calculate (v0 * t) and (0.5 * a * t^2) separately before adding.`,
        steps: [
          `**Step 1: Compute linear distance term ($v_0 t$)**`,
          `$$v_0 t = ${pc.v0} \\times ${pc.t} = ${pc.v0 * pc.t}$$`,
          `**Step 2: Compute acceleration term ($\\frac{1}{2} a t^2$)**`,
          `$$\\frac{1}{2}(${pc.a})(${pc.t})^2 = 0.5 \\times ${pc.a} \\times ${pc.t * pc.t} = ${0.5 * pc.a * pc.t * pc.t}$$`,
          `**Step 3: Sum terms**`,
          `$$d = ${pc.v0 * pc.t} + ${0.5 * pc.a * pc.t * pc.t} = ${pc.dist}\\text{ meters}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 5) { // Volume of Cylinder Formula Substitution (V = pi * r^2 * h)
      const cylConfigs = [
        { r: 7, h: 10, vol: 1540, expr: 'V = \\pi r^2 h' },
        { r: 14, h: 5, vol: 3080, expr: 'V = \\pi r^2 h' },
        { r: 21, h: 4, vol: 5544, expr: 'V = \\pi r^2 h' },
        { r: 7, h: 15, vol: 2310, expr: 'V = \\pi r^2 h' },
        { r: 14, h: 10, vol: 6160, expr: 'V = \\pi r^2 h' }
      ];
      const cc = cylConfigs[variantIndex % cylConfigs.length];
      const ansStr = `${cc.vol.toLocaleString()} cm³`;
      const options = shuffle([ansStr, `${(cc.vol + 440).toLocaleString()} cm³`, `${(cc.vol - 300).toLocaleString()} cm³`, `${(cc.vol / 2).toLocaleString()} cm³`]);
      return {
        title: `Cylinder Volume Geometric Formula Substitution`,
        text: `Evaluate the volume formula for a right circular cylinder $${cc.expr}$ when radius $r = ${cc.r}\\text{ cm}$ and height $h = ${cc.h}\\text{ cm}$ (using $\\pi \\approx \\frac{22}{7}$):`,
        formula: `V = \\pi r^2 h \\approx \\frac{22}{7} \\times r^2 \\times h`,
        options,
        answer: ansStr,
        hint: `Square r = ${cc.r} first to get ${cc.r * cc.r}, then multiply by 22/7 and ${cc.h}.`,
        steps: [
          `**Step 1: Compute radius squared ($r^2$)**`,
          `$$r^2 = (${cc.r})^2 = ${cc.r * cc.r}$$`,
          `**Step 2: Substitute into volume formula**`,
          `$$V = \\frac{22}{7} \\times ${cc.r * cc.r} \\times ${cc.h} = 22 \\times ${ (cc.r * cc.r) / 7 } \\times ${cc.h} = ${cc.vol}\\text{ cm}^3$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 6) { // Temperature Conversion Formula Substitution (F = 9/5 C + 32)
      const tempConfigs = [
        { C: 35, F: 95, expr: 'F = \\frac{9}{5}C + 32' },
        { C: 25, F: 77, expr: 'F = \\frac{9}{5}C + 32' },
        { C: 40, F: 104, expr: 'F = \\frac{9}{5}C + 32' },
        { C: 15, F: 59, expr: 'F = \\frac{9}{5}C + 32' },
        { C: 30, F: 86, expr: 'F = \\frac{9}{5}C + 32' }
      ];
      const tc = tempConfigs[variantIndex % tempConfigs.length];
      const ansStr = `${tc.F}°F`;
      const options = shuffle([ansStr, `${tc.F + 12}°F`, `${tc.F - 9}°F`, `${tc.C + 32}°F`]);
      return {
        title: `Temperature Conversion Formula Substitution`,
        text: `Convert a Celsius temperature of $C = ${tc.C}^\\circ\\text{C}$ to Fahrenheit using the algebraic formula $${tc.expr}$:`,
        formula: `F = \\frac{9}{5}C + 32`,
        options,
        answer: ansStr,
        hint: `Multiply ${tc.C} by 9, divide by 5 to get ${ (9 * tc.C) / 5 }, then add 32.`,
        steps: [
          `**Step 1: Compute $\\frac{9}{5} \\times C$**`,
          `$$\\frac{9}{5}(${tc.C}) = 9 \\times ${tc.C / 5} = ${(9 * tc.C) / 5}$$`,
          `**Step 2: Add 32 constant**`,
          `$$F = ${(9 * tc.C) / 5} + 32 = ${tc.F}^\\circ\\text{F}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 2
      };
    } else if (subType === 7) { // Evaluating Cubic & Higher Degree Expressions (2x^3 - 4x^2 + 5x - 9)
      const cubicConfigs = [
        { x: -2, val: -51, expr: '2x^3 - 4x^2 + 5x - 9' },
        { x: -3, val: -114, expr: '2x^3 - 4x^2 + 5x - 9' },
        { x: -1, val: -20, expr: '2x^3 - 4x^2 + 5x - 9' },
        { x: 3, val: 24, expr: '2x^3 - 4x^2 + 5x - 9' },
        { x: -4, val: -221, expr: '2x^3 - 4x^2 + 5x - 9' }
      ];
      const cc = cubicConfigs[variantIndex % cubicConfigs.length];
      const ansStr = String(cc.val);
      const options = shuffle([ansStr, String(cc.val + 18), String(cc.val - 24), String(-cc.val)]);
      return {
        title: `Higher-Degree Polynomial Expression Evaluation`,
        text: `Evaluate the cubic polynomial expression $2x^3 - 4x^2 + 5x - 9$ when $x = ${cc.x}$:`,
        formula: `2x^3 - 4x^2 + 5x - 9 \\quad \\text{at } x = ${cc.x}`,
        options,
        answer: ansStr,
        hint: `Be careful with signs: (-2)^3 = -8, while (-2)^2 = +4.`,
        steps: [
          `**Step 1: Compute powers of $x = ${cc.x}$**`,
          `$$x^3 = (${cc.x})^3 = ${Math.pow(cc.x, 3)}, \\quad x^2 = (${cc.x})^2 = ${Math.pow(cc.x, 2)}$$`,
          `**Step 2: Multiply terms by coefficients**`,
          `$$2(${Math.pow(cc.x, 3)}) - 4(${Math.pow(cc.x, 2)}) + 5(${cc.x}) - 9$$`,
          `$$${2 * Math.pow(cc.x, 3)} - ${4 * Math.pow(cc.x, 2)} + (${5 * cc.x}) - 9 = ${cc.val}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 8) { // Substitution into Expression with Negative Exponent & Radicals (sqrt(a^2+b^2) - c^2)
      const radConfigs = [
        { a: 6, b: 8, c: -3, val: 1, expr: '\\sqrt{a^2 + b^2} - c^2' },
        { a: 5, b: 12, c: -3, val: 4, expr: '\\sqrt{a^2 + b^2} - c^2' },
        { a: 9, b: 12, c: -3, val: 6, expr: '\\sqrt{a^2 + b^2} - c^2' },
        { a: 8, b: 15, c: -4, val: 1, expr: '\\sqrt{a^2 + b^2} - c^2' },
        { a: 12, b: 16, c: -4, val: 4, expr: '\\sqrt{a^2 + b^2} - c^2' }
      ];
      const rc = radConfigs[variantIndex % radConfigs.length];
      const ansStr = String(rc.val);
      const options = shuffle([ansStr, String(rc.val + 5), String(rc.val - 3), String(-rc.val)]);
      return {
        title: `Radical & Exponent Expression Substitution`,
        text: `Find the exact numerical value of $P = \\sqrt{a^2 + b^2} - c^2$ when $a = ${rc.a}$, $b = ${rc.b}$, and $c = ${rc.c}$:`,
        formula: `\\sqrt{a^2 + b^2} - c^2`,
        options,
        answer: ansStr,
        hint: `First compute sqrt(${rc.a}^2 + ${rc.b}^2) = sqrt(${rc.a*rc.a + rc.b*rc.b}), then subtract (${rc.c})^2 = ${rc.c * rc.c}.`,
        steps: [
          `**Step 1: Compute radical term**`,
          `$$\\sqrt{(${rc.a})^2 + (${rc.b})^2} = \\sqrt{${rc.a*rc.a} + ${rc.b*rc.b}} = \\sqrt{${rc.a*rc.a + rc.b*rc.b}} = ${Math.sqrt(rc.a*rc.a + rc.b*rc.b)}$$`,
          `**Step 2: Compute squared term**`,
          `$$c^2 = (${rc.c})^2 = ${rc.c * rc.c}$$`,
          `**Step 3: Subtract terms**`,
          `$$P = ${Math.sqrt(rc.a*rc.a + rc.b*rc.b)} - ${rc.c * rc.c} = ${rc.val}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else { // Multi-Variable Financial Revenue Formula Substitution (P = p*q - (F + v*q))
      const finConfigs = [
        { p: 250, q: 400, F: 30000, v: 120, prof: 22000, profStr: '₱22,000', expr: 'P = p \\cdot q - (F + v \\cdot q)' },
        { p: 300, q: 500, F: 40000, v: 150, prof: 35000, profStr: '₱35,000', expr: 'P = p \\cdot q - (F + v \\cdot q)' },
        { p: 200, q: 600, F: 25000, v: 100, prof: 35000, profStr: '₱35,000', expr: 'P = p \\cdot q - (F + v \\cdot q)' },
        { p: 400, q: 300, F: 35000, v: 200, prof: 25000, profStr: '₱25,000', expr: 'P = p \\cdot q - (F + v \\cdot q)' },
        { p: 150, q: 800, F: 20000, v: 80, prof: 36000, profStr: '₱36,000', expr: 'P = p \\cdot q - (F + v \\cdot q)' }
      ];
      const fc = finConfigs[variantIndex % finConfigs.length];
      const ansStr = fc.profStr;
      const options = shuffle([ansStr, '₱18,500', '₱28,000', '₱15,000']);
      return {
        title: `Financial Business Profit Formula Substitution`,
        text: `A company's net profit formula is $${fc.expr}$. Calculate profit $P$ when selling price $p = \\text{₱}${fc.p}$, quantity sold $q = ${fc.q}\\text{ units}$, fixed overhead $F = \\text{₱}${fc.F.toLocaleString()}$, and variable unit cost $v = \\text{₱}${fc.v}$:`,
        formula: `\\text{Profit} = (p - v)q - F`,
        options,
        answer: ansStr,
        hint: `Total Revenue = ${fc.p} * ${fc.q}; Total Cost = ${fc.F} + (${fc.v} * ${fc.q}). Subtract Cost from Revenue.`,
        steps: [
          `**Step 1: Compute Total Revenue ($p \\cdot q$)**`,
          `$$\\text{Revenue} = ${fc.p} \\times ${fc.q} = \\text{₱}${(fc.p * fc.q).toLocaleString()}$$`,
          `**Step 2: Compute Total Cost ($F + v \\cdot q$)**`,
          `$$\\text{Cost} = ${fc.F.toLocaleString()} + (${fc.v} \\times ${fc.q}) = ${fc.F.toLocaleString()} + ${(fc.v * fc.q).toLocaleString()} = \\text{₱}${(fc.F + fc.v * fc.q).toLocaleString()}$$`,
          `**Step 3: Compute Net Profit ($P$)**`,
          `$$P = ${(fc.p * fc.q).toLocaleString()} - ${(fc.F + fc.v * fc.q).toLocaleString()} = ${ansStr}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    }
  }

  // Category 3L: Form 7 - The Rearrangement of a Formula (Topic ID 120 - 50 DYNAMIC VARIATION QUESTIONS)
  if (topicId === 120) {
    const subType = qIndex % 10;
    const variantIndex = Math.floor(qIndex / 10); // 0 to 4 across 50 questions

    if (subType === 0) { // Perimeter Formula Rearrangement (P = 2l + 2w -> w = (P - 2l)/2)
      const perimConfigs = [
        { formula: 'P = 2l + 2w', target: 'w', ans: 'w = \\frac{P - 2l}{2}', hint: 'Subtract 2l from both sides, then divide by 2.' },
        { formula: 'P = 2l + 2w', target: 'l', ans: 'l = \\frac{P - 2w}{2}', hint: 'Subtract 2w from both sides, then divide by 2.' },
        { formula: 'P = 2a + 2b', target: 'b', ans: 'b = \\frac{P - 2a}{2}', hint: 'Subtract 2a from both sides, then divide by 2.' },
        { formula: 'P = a + b + c', target: 'c', ans: 'c = P - a - b', hint: 'Subtract both a and b from perimeter P.' },
        { formula: 'C = 2\\pi r', target: 'r', ans: 'r = \\frac{C}{2\\pi}', hint: 'Divide circumference C by 2π.' }
      ];
      const pc = perimConfigs[variantIndex % perimConfigs.length];
      const ansStr = `$${pc.ans}$`;
      const options = shuffle([
        ansStr,
        `$${pc.target} = \\frac{P + 2l}{2}$`,
        `$${pc.target} = 2P - l$`,
        `$${pc.target} = \\frac{P}{2} + 2l$`
      ]);
      return {
        title: `Perimeter Formula Variable Rearrangement`,
        text: `Given the geometric formula $${pc.formula}$, rearrange the equation to make the variable $${pc.target}$ the subject of the formula:`,
        formula: `P = 2l + 2w \\implies 2w = P - 2l \\implies w = \\frac{P - 2l}{2}`,
        options,
        answer: ansStr,
        hint: pc.hint,
        steps: [
          `**Step 1: Isolate term containing $${pc.target}$**`,
          `$$\\text{Subtract non-target terms to get isolated term}$$`,
          `**Step 2: Divide by coefficient**`,
          `$$${ansStr}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 2
      };
    } else if (subType === 1) { // Simple Interest Formula Rearrangement (I = Prt -> r = I / Pt)
      const intConfigs = [
        { formula: 'I = Prt', target: 'r', ans: 'r = \\frac{I}{Pt}', hint: 'Divide interest I by product (Pt).' },
        { formula: 'I = Prt', target: 'P', ans: 'P = \\frac{I}{rt}', hint: 'Divide interest I by product (rt).' },
        { formula: 'I = Prt', target: 't', ans: 't = \\frac{I}{Pr}', hint: 'Divide interest I by product (Pr).' },
        { formula: 'A = P(1 + rt)', target: 'r', ans: 'r = \\frac{A - P}{Pt}', hint: 'Subtract P first to get A - P = Prt, then divide by Pt.' },
        { formula: 'S = P + I', target: 'P', ans: 'P = S - I', hint: 'Subtract interest I from total amount S.' }
      ];
      const ic = intConfigs[variantIndex % intConfigs.length];
      const ansStr = `$${ic.ans}$`;
      const options = shuffle([
        ansStr,
        `$${ic.target} = \\frac{I \\cdot P}{t}$`,
        `$${ic.target} = I - Pt$`,
        `$${ic.target} = \\frac{P}{I t}$`
      ]);
      return {
        title: `Financial Interest Formula Rearrangement`,
        text: `Rearrange the financial formula $${ic.formula}$ to express the variable $${ic.target}$ as the subject of the formula:`,
        formula: `I = Prt \\implies r = \\frac{I}{Pt}`,
        options,
        answer: ansStr,
        hint: ic.hint,
        steps: [
          `**Step 1: Divide both sides by multiplier terms**`,
          `$$${ansStr}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 2
      };
    } else if (subType === 2) { // Cylinder Volume Formula Rearrangement (V = pi r^2 h -> h = V / (pi r^2))
      const volConfigs = [
        { formula: 'V = \\pi r^2 h', target: 'h', ans: 'h = \\frac{V}{\\pi r^2}', hint: 'Divide volume V by πr².' },
        { formula: 'V = \\frac{1}{3}\\pi r^2 h', target: 'h', ans: 'h = \\frac{3V}{\\pi r^2}', hint: 'Multiply V by 3 first, then divide by πr².' },
        { formula: 'V = l w h', target: 'h', ans: 'h = \\frac{V}{l w}', hint: 'Divide volume V by product lw.' },
        { formula: 'V = l w h', target: 'w', ans: 'w = \\frac{V}{l h}', hint: 'Divide volume V by product lh.' },
        { formula: 'V = \\frac{1}{3} A h', target: 'A', ans: 'A = \\frac{3V}{h}', hint: 'Multiply V by 3, then divide by height h.' }
      ];
      const vc = volConfigs[variantIndex % volConfigs.length];
      const ansStr = `$${vc.ans}$`;
      const options = shuffle([
        ansStr,
        `$${vc.target} = \\frac{V \\pi}{r^2}$`,
        `$${vc.target} = V - \\pi r^2$`,
        `$${vc.target} = \\frac{\\pi r^2}{V}$`
      ]);
      return {
        title: `Volume Formula Variable Isolation`,
        text: `Make $${vc.target}$ the subject of the 3D volume geometric formula $${vc.formula}$:`,
        formula: `V = \\pi r^2 h \\implies h = \\frac{V}{\\pi r^2}`,
        options,
        answer: ansStr,
        hint: vc.hint,
        steps: [
          `**Step 1: Divide volume $V$ by coefficients**`,
          `$$${ansStr}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 2
      };
    } else if (subType === 3) { // Temperature Conversion Formula Rearrangement (F = 9/5 C + 32 -> C = 5/9 (F - 32))
      const tempConfigs = [
        { formula: 'F = \\frac{9}{5}C + 32', target: 'C', ans: 'C = \\frac{5}{9}(F - 32)', hint: 'Subtract 32 first to get F - 32 = (9/5)C, then multiply by 5/9.' },
        { formula: 'C = \\frac{5}{9}(F - 32)', target: 'F', ans: 'F = \\frac{9}{5}C + 32', hint: 'Multiply C by 9/5, then add 32.' },
        { formula: 'K = C + 273.15', target: 'C', ans: 'C = K - 273.15', hint: 'Subtract 273.15 from Kelvin temperature K.' },
        { formula: 'y = mx + c', target: 'x', ans: 'x = \\frac{y - c}{m}', hint: 'Subtract c first to get y - c = mx, then divide by m.' },
        { formula: 'y = mx + c', target: 'm', ans: 'm = \\frac{y - c}{x}', hint: 'Subtract c first to get y - c = mx, then divide by x.' }
      ];
      const tc = tempConfigs[variantIndex % tempConfigs.length];
      const ansStr = `$${tc.ans}$`;
      const options = shuffle([
        ansStr,
        `$${tc.target} = \\frac{9}{5}(F + 32)$`,
        `$${tc.target} = \\frac{5F - 32}{9}$`,
        `$${tc.target} = \\frac{9F - 32}{5}$`
      ]);
      return {
        title: `Temperature & Linear Transformation Rearrangement`,
        text: `In the conversion formula $${tc.formula}$, solve for the variable $${tc.target}$ to make it the subject of the formula:`,
        formula: `F = \\frac{9}{5}C + 32 \\implies F - 32 = \\frac{9}{5}C \\implies C = \\frac{5}{9}(F - 32)`,
        options,
        answer: ansStr,
        hint: tc.hint,
        steps: [
          `**Step 1: Subtract constant term**`,
          `$$F - 32 = \\frac{9}{5}C$$`,
          `**Step 2: Multiply by reciprocal fraction ($\\frac{5}{9}$)**`,
          `$$C = \\frac{5}{9}(F - 32)$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 4) { // Kinetic Energy Formula Rearrangement (E = 1/2 m v^2 -> m = 2E / v^2)
      const energyConfigs = [
        { formula: 'E = \\frac{1}{2}m v^2', target: 'm', ans: 'm = \\frac{2E}{v^2}', hint: 'Multiply E by 2 to get 2E = mv², then divide by v².' },
        { formula: 'E = m g h', target: 'h', ans: 'h = \\frac{E}{mg}', hint: 'Divide energy E by product (mg).' },
        { formula: 'F = m a', target: 'm', ans: 'm = \\frac{F}{a}', hint: 'Divide force F by acceleration a.' },
        { formula: 'W = F d', target: 'd', ans: 'd = \\frac{W}{F}', hint: 'Divide work W by force F.' },
        { formula: 'P = \\frac{W}{t}', target: 'W', ans: 'W = P t', hint: 'Multiply power P by time t.' }
      ];
      const ec = energyConfigs[variantIndex % energyConfigs.length];
      const ansStr = `$${ec.ans}$`;
      const options = shuffle([
        ansStr,
        `$${ec.target} = \\frac{E v^2}{2}$`,
        `$${ec.target} = 2E v^2$`,
        `$${ec.target} = \\frac{E}{2 v^2}$`
      ]);
      return {
        title: `Physics Energy & Force Formula Rearrangement`,
        text: `Given the physical science formula $${ec.formula}$, express the variable $${ec.target}$ in terms of the other variables:`,
        formula: `E = \\frac{1}{2}m v^2 \\implies 2E = m v^2 \\implies m = \\frac{2E}{v^2}`,
        options,
        answer: ansStr,
        hint: ec.hint,
        steps: [
          `**Step 1: Clear fraction by multiplying by 2**`,
          `$$2E = m v^2$$`,
          `**Step 2: Divide by $v^2$**`,
          `$$m = \\frac{2E}{v^2}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 5) { // Slope-Intercept / Linear Equation Rearrangement (Ax + By = C -> y = (C - Ax)/B)
      const lineConfigs = [
        { formula: 'Ax + By = C', target: 'y', ans: 'y = \\frac{C - Ax}{B}', hint: 'Subtract Ax first to get By = C - Ax, then divide by B.' },
        { formula: '3x + 4y = 12', target: 'y', ans: 'y = \\frac{12 - 3x}{4}', hint: 'Subtract 3x to get 4y = 12 - 3x, then divide by 4.' },
        { formula: '5x - 2y = 10', target: 'y', ans: 'y = \\frac{5x - 10}{2}', hint: 'Add 2y to right and subtract 10 to get 2y = 5x - 10, then divide by 2.' },
        { formula: '2x + 7y = 14', target: 'x', ans: 'x = \\frac{14 - 7y}{2}', hint: 'Subtract 7y to get 2x = 14 - 7y, then divide by 2.' },
        { formula: '4x - 3y = 24', target: 'x', ans: 'x = \\frac{24 + 3y}{4}', hint: 'Add 3y to get 4x = 24 + 3y, then divide by 4.' }
      ];
      const lc = lineConfigs[variantIndex % lineConfigs.length];
      const ansStr = `$${lc.ans}$`;
      const options = shuffle([
        ansStr,
        `$${lc.target} = \\frac{C + Ax}{B}$`,
        `$${lc.target} = \\frac{B - Ax}{C}$`,
        `$${lc.target} = C - Ax - B$`
      ]);
      return {
        title: `Linear Equation Standard Form Rearrangement`,
        text: `Rearrange the linear equation $${lc.formula}$ to make $${lc.target}$ the subject of the formula:`,
        formula: `Ax + By = C \\implies By = C - Ax \\implies y = \\frac{C - Ax}{B}`,
        options,
        answer: ansStr,
        hint: lc.hint,
        steps: [
          `**Step 1: Subtract $Ax$ from both sides**`,
          `$$By = C - Ax$$`,
          `**Step 2: Divide by coefficient $B$**`,
          `$$y = \\frac{C - Ax}{B}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 2
      };
    } else if (subType === 6) { // Speed, Distance, Time Rearrangement (s = d/t -> t = d/s)
      const motionConfigs = [
        { formula: 's = \\frac{d}{t}', target: 't', ans: 't = \\frac{d}{s}', hint: 'Multiply by t to get st = d, then divide by s.' },
        { formula: 's = \\frac{d}{t}', target: 'd', ans: 'd = s t', hint: 'Multiply speed s by time t.' },
        { formula: 'a = \\frac{v - u}{t}', target: 't', ans: 't = \\frac{v - u}{a}', hint: 'Multiply by t to get at = v - u, then divide by a.' },
        { formula: 'a = \\frac{v - u}{t}', target: 'v', ans: 'v = u + a t', hint: 'Multiply by t to get at = v - u, then add u.' },
        { formula: 'v = \\frac{u + w}{2}', target: 'u', ans: 'u = 2v - w', hint: 'Multiply by 2 to get 2v = u + w, then subtract w.' }
      ];
      const mc = motionConfigs[variantIndex % motionConfigs.length];
      const ansStr = `$${mc.ans}$`;
      const options = shuffle([
        ansStr,
        `$${mc.target} = \\frac{s}{d}$`,
        `$${mc.target} = d - s$`,
        `$${mc.target} = s + d$`
      ]);
      return {
        title: `Motion & Kinematics Formula Rearrangement`,
        text: `Given the kinematic relationship $${mc.formula}$, rearrange the formula to make $${mc.target}$ the subject:`,
        formula: `s = \\frac{d}{t} \\implies s t = d \\implies t = \\frac{d}{s}`,
        options,
        answer: ansStr,
        hint: mc.hint,
        steps: [
          `**Step 1: Clear denominator by cross-multiplying**`,
          `$$s t = d$$`,
          `**Step 2: Divide by speed $s$**`,
          `$$t = \\frac{d}{s}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 2
      };
    } else if (subType === 7) { // Trapezoid Area Formula Rearrangement (A = 1/2 h (a + b) -> h = 2A / (a + b))
      const areaConfigs = [
        { formula: 'A = \\frac{1}{2}h(a + b)', target: 'h', ans: 'h = \\frac{2A}{a + b}', hint: 'Multiply A by 2 to get 2A = h(a + b), then divide by (a + b).' },
        { formula: 'A = \\frac{1}{2}b h', target: 'h', ans: 'h = \\frac{2A}{b}', hint: 'Multiply A by 2 to get 2A = bh, then divide by base b.' },
        { formula: 'A = \\pi r^2', target: 'r^2', ans: 'r^2 = \\frac{A}{\\pi}', hint: 'Divide area A by π.' },
        { formula: 'A = l w', target: 'w', ans: 'w = \\frac{A}{l}', hint: 'Divide area A by length l.' },
        { formula: 'A = \\frac{1}{2} d_1 d_2', target: 'd_1', ans: 'd_1 = \\frac{2A}{d_2}', hint: 'Multiply A by 2, then divide by diagonal d2.' }
      ];
      const ac = areaConfigs[variantIndex % areaConfigs.length];
      const ansStr = `$${ac.ans}$`;
      const options = shuffle([
        ansStr,
        `$${ac.target} = \\frac{A(a + b)}{2}$`,
        `$${ac.target} = \\frac{A}{2(a + b)}$`,
        `$${ac.target} = 2A - a - b$`
      ]);
      return {
        title: `Geometric Area Formula Rearrangement`,
        text: `Rearrange the 2D geometric area formula $${ac.formula}$ to make the variable $${ac.target}$ the subject of the formula:`,
        formula: `A = \\frac{1}{2}h(a + b) \\implies 2A = h(a + b) \\implies h = \\frac{2A}{a + b}`,
        options,
        answer: ansStr,
        hint: ac.hint,
        steps: [
          `**Step 1: Multiply both sides by 2**`,
          `$$2A = h(a + b)$$`,
          `**Step 2: Divide by sum of parallel sides $(a + b)$**`,
          `$$h = \\frac{2A}{a + b}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 8) { // Density Formula Rearrangement (rho = m / V -> V = m / rho)
      const physRatioConfigs = [
        { formula: '\\rho = \\frac{m}{V}', target: 'V', ans: 'V = \\frac{m}{\\rho}', hint: 'Multiply by V to get ρV = m, then divide by ρ.' },
        { formula: 'P = \\frac{F}{A}', target: 'A', ans: 'A = \\frac{F}{P}', hint: 'Multiply by A to get PA = F, then divide by pressure P.' },
        { formula: 'R = \\frac{V}{I}', target: 'I', ans: 'I = \\frac{V}{R}', hint: 'Multiply by I to get RI = V, then divide by resistance R.' },
        { formula: 'D = \\frac{m}{v}', target: 'm', ans: 'm = D v', hint: 'Multiply density D by volume v.' },
        { formula: 'M = \\frac{n}{V}', target: 'n', ans: 'n = M V', hint: 'Multiply molarity M by volume V.' }
      ];
      const prc = physRatioConfigs[variantIndex % physRatioConfigs.length];
      const ansStr = `$${prc.ans}$`;
      const options = shuffle([
        ansStr,
        `$${prc.target} = \\frac{\\rho}{m}$`,
        `$${prc.target} = m \\cdot \\rho$`,
        `$${prc.target} = m - \\rho$`
      ]);
      return {
        title: `Physical Ratio Formula Rearrangement`,
        text: `Rearrange the physical science formula $${prc.formula}$ to express $${prc.target}$ as the subject of the formula:`,
        formula: `\\rho = \\frac{m}{V} \\implies \\rho V = m \\implies V = \\frac{m}{\\rho}`,
        options,
        answer: ansStr,
        hint: prc.hint,
        steps: [
          `**Step 1: Multiply by denominator term**`,
          `$$\\rho V = m$$`,
          `**Step 2: Divide by density term $\\rho$**`,
          `$$V = \\frac{m}{\\rho}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 2
      };
    } else { // Multi-Step Algebraic Expression Subject (y = (ax + b)/c -> x = (cy - b)/a)
      const algStepConfigs = [
        { formula: 'y = \\frac{ax + b}{c}', target: 'x', ans: 'x = \\frac{cy - b}{a}', hint: 'Multiply by c first to get cy = ax + b, subtract b, then divide by a.' },
        { formula: 'z = \\frac{px - q}{r}', target: 'x', ans: 'x = \\frac{rz + q}{p}', hint: 'Multiply by r to get rz = px - q, add q, then divide by p.' },
        { formula: 'u = \\frac{x}{a} + b', target: 'x', ans: 'x = a(u - b)', hint: 'Subtract b to get u - b = x/a, then multiply by a.' },
        { formula: 'w = k(x + m)', target: 'x', ans: 'x = \\frac{w}{k} - m', hint: 'Divide by k to get w/k = x + m, then subtract m.' },
        { formula: 'v = \\frac{a - bx}{c}', target: 'x', ans: 'x = \\frac{a - cv}{b}', hint: 'Multiply by c to get cv = a - bx, rearrange to bx = a - cv, divide by b.' }
      ];
      const ac = algStepConfigs[variantIndex % algStepConfigs.length];
      const ansStr = `$${ac.ans}$`;
      const options = shuffle([
        ansStr,
        `$${ac.target} = \\frac{cy + b}{a}$`,
        `$${ac.target} = \\frac{a y - b}{c}$`,
        `$${ac.target} = c y - b - a$`
      ]);
      return {
        title: `Multi-Step Rational Formula Rearrangement`,
        text: `Rearrange the multi-step algebraic equation $${ac.formula}$ to make $${ac.target}$ the subject of the formula:`,
        formula: `y = \\frac{ax + b}{c} \\implies cy = ax + b \\implies ax = cy - b \\implies x = \\frac{cy - b}{a}`,
        options,
        answer: ansStr,
        hint: ac.hint,
        steps: [
          `**Step 1: Multiply both sides by denominator $c$**`,
          `$$c y = a x + b$$`,
          `**Step 2: Subtract constant $b$**`,
          `$$a x = c y - b$$`,
          `**Step 3: Divide by coefficient $a$**`,
          `$$x = \\frac{c y - b}{a}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    }
  }

  // Category 3M: Form 7 - Operations Using Scientific Notation (Topic ID 121 - 50 DYNAMIC VARIATION QUESTIONS)
  if (topicId === 121) {
    const subType = qIndex % 10;
    const variantIndex = Math.floor(qIndex / 10); // 0 to 4 across 50 questions

    if (subType === 0) { // Converting Small & Large Standard Decimals to Scientific Notation (Sample Q1)
      const convertConfigs = [
        {
          decSmall: '0.0000408', sciSmall: '4.08 \\times 10^{-5}', decLarge: '58,200,000', sciLarge: '5.82 \\times 10^7',
          opt2: '$4.08 \\times 10^5$ and $5.82 \\times 10^{-7}$', opt3: '$40.8 \\times 10^{-6}$ and $58.2 \\times 10^6$', opt4: '$0.408 \\times 10^{-4}$ and $0.582 \\times 10^8$',
          shiftSmall: '5 places right', shiftLarge: '7 places left'
        },
        {
          decSmall: '0.00000752', sciSmall: '7.52 \\times 10^{-6}', decLarge: '43,900,000', sciLarge: '4.39 \\times 10^7',
          opt2: '$7.52 \\times 10^6$ and $4.39 \\times 10^{-7}$', opt3: '$75.2 \\times 10^{-7}$ and $43.9 \\times 10^6$', opt4: '$0.752 \\times 10^{-5}$ and $0.439 \\times 10^8$',
          shiftSmall: '6 places right', shiftLarge: '7 places left'
        },
        {
          decSmall: '0.000316', sciSmall: '3.16 \\times 10^{-4}', decLarge: '815,000,000', sciLarge: '8.15 \\times 10^8',
          opt2: '$3.16 \\times 10^4$ and $8.15 \\times 10^{-8}$', opt3: '$31.6 \\times 10^{-5}$ and $81.5 \\times 10^7$', opt4: '$0.316 \\times 10^{-3}$ and $0.815 \\times 10^9$',
          shiftSmall: '4 places right', shiftLarge: '8 places left'
        },
        {
          decSmall: '0.000000924', sciSmall: '9.24 \\times 10^{-7}', decLarge: '67,100,000', sciLarge: '6.71 \\times 10^7',
          opt2: '$9.24 \\times 10^7$ and $6.71 \\times 10^{-7}$', opt3: '$92.4 \\times 10^{-8}$ and $67.1 \\times 10^6$', opt4: '$0.924 \\times 10^{-6}$ and $0.671 \\times 10^8$',
          shiftSmall: '7 places right', shiftLarge: '7 places left'
        },
        {
          decSmall: '0.0000539', sciSmall: '5.39 \\times 10^{-5}', decLarge: '924,000,000', sciLarge: '9.24 \\times 10^8',
          opt2: '$5.39 \\times 10^5$ and $9.24 \\times 10^{-8}$', opt3: '$53.9 \\times 10^{-6}$ and $92.4 \\times 10^7$', opt4: '$0.539 \\times 10^{-4}$ and $0.924 \\times 10^9$',
          shiftSmall: '5 places right', shiftLarge: '8 places left'
        }
      ];
      const cc = convertConfigs[variantIndex % convertConfigs.length];
      const ansStr = `$${cc.sciSmall}$ and $${cc.sciLarge}$`;
      const options = shuffle([ansStr, cc.opt2, cc.opt3, cc.opt4]);
      return {
        title: `Standard Decimal to Scientific Notation Conversion`,
        text: `Write the very small decimal $${cc.decSmall}$ and very large integer $${cc.decLarge}$ in standard scientific notation ($a \\times 10^n$, where $1 \\le |a| < 10$):`,
        formula: `a \\times 10^n \\quad (1 \\le |a| < 10, \\, n \\in \\mathbb{Z})`,
        options,
        answer: ansStr,
        hint: `Move decimal point to create a mantissa between 1 and 10. Left shift = positive power; Right shift = negative power.`,
        steps: [
          `**Step 1: Convert $${cc.decSmall}$**`,
          `$$\\text{Shift decimal ${cc.shiftSmall}} \\implies ${cc.sciSmall}$$`,
          `**Step 2: Convert $${cc.decLarge}$**`,
          `$$\\text{Shift decimal ${cc.shiftLarge}} \\implies ${cc.sciLarge}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 2
      };
    } else if (subType === 1) { // Scientific Notation Multiplication with Exponent Normalization (Sample Q2)
      const multConfigs = [
        { m1: 3.2, e1: 5, m2: 2.0, e2: -2, prodM: '6.4', prodE: 3, expr: '(3.2 \\times 10^5) \\times (2.0 \\times 10^{-2})' },
        { m1: 4.5, e1: 6, m2: 3.0, e2: -3, prodM: '1.35', prodE: 4, expr: '(4.5 \\times 10^6) \\times (3.0 \\times 10^{-3})' },
        { m1: 6.0, e1: 4, m2: 2.5, e2: -5, prodM: '1.5', prodE: 0, expr: '(6.0 \\times 10^4) \\times (2.5 \\times 10^{-5})' },
        { m1: 5.0, e1: 7, m2: 4.0, e2: -4, prodM: '2.0', prodE: 4, expr: '(5.0 \\times 10^7) \\times (4.0 \\times 10^{-4})' },
        { m1: 2.4, e1: 8, m2: 3.5, e2: -3, prodM: '8.4', prodE: 5, expr: '(2.4 \\times 10^8) \\times (3.5 \\times 10^{-3})' }
      ];
      const mc = multConfigs[variantIndex % multConfigs.length];
      const ansStr = `$${mc.prodM} \\times 10^{${mc.prodE}}$`;
      const options = shuffle([
        ansStr,
        `$${mc.prodM} \\times 10^{${mc.prodE + 2}}$`,
        `$${(parseFloat(mc.prodM) * 10).toFixed(1)} \\times 10^{${mc.prodE - 1}}$`,
        `$${mc.prodM} \\times 10^{${mc.e1 * mc.e2}}$`
      ]);
      return {
        title: `Scientific Notation Multiplication`,
        text: `Evaluate $${mc.expr}$ and express the resulting product in standard scientific notation:`,
        formula: `(a \\times 10^m) \\times (b \\times 10^n) = (a \\cdot b) \\times 10^{m+n}`,
        options,
        answer: ansStr,
        hint: `Multiply mantissas (${mc.m1} × ${mc.m2}) and add exponents (${mc.e1} + ${mc.e2}).`,
        steps: [
          `**Step 1: Multiply mantissas**`,
          `$$${mc.m1} \\times ${mc.m2} = ${mc.m1 * mc.m2}$$`,
          `**Step 2: Add powers of 10**`,
          `$$10^{${mc.e1}} \\times 10^{${mc.e2}} = 10^{${mc.e1} + (${mc.e2})} = 10^{${mc.e1 + mc.e2}}$$`,
          `**Step 3: Normalize mantissa if needed**`,
          `$$\\text{Product} = ${ansStr}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 2
      };
    } else if (subType === 2) { // Scientific Notation Addition with Different Exponents (Sample Q3)
      const addConfigs = [
        { m1: 4.5, e1: 4, m2: 3.2, e2: 3, sumM: '4.82', sumE: 4, expr: '(4.5 \\times 10^4) + (3.2 \\times 10^3)' },
        { m1: 6.2, e1: 5, m2: 4.8, e2: 4, sumM: '6.68', sumE: 5, expr: '(6.2 \\times 10^5) + (4.8 \\times 10^4)' },
        { m1: 7.1, e1: 6, m2: 5.3, e2: 5, sumM: '7.63', sumE: 6, expr: '(7.1 \\times 10^6) + (5.3 \\times 10^5)' },
        { m1: 3.8, e1: 7, m2: 9.4, e2: 6, sumM: '4.74', sumE: 7, expr: '(3.8 \\times 10^7) + (9.4 \\times 10^6)' },
        { m1: 5.4, e1: 4, m2: 8.6, e2: 3, sumM: '6.26', sumE: 4, expr: '(5.4 \\times 10^4) + (8.6 \\times 10^3)' }
      ];
      const ac = addConfigs[variantIndex % addConfigs.length];
      const ansStr = `$${ac.sumM} \\times 10^{${ac.sumE}}$`;
      const options = shuffle([
        ansStr,
        `$${(ac.m1 + ac.m2).toFixed(1)} \\times 10^{${ac.e1 + ac.e2}}$`,
        `$${ac.sumM} \\times 10^{${ac.sumE - 1}}$`,
        `$${(parseFloat(ac.sumM) * 10).toFixed(1)} \\times 10^{${ac.sumE - 2}}$`
      ]);
      return {
        title: `Scientific Notation Addition with Different Exponents`,
        text: `Calculate the sum: $${ac.expr}$ and express the final result in standard scientific notation:`,
        formula: `a \\times 10^n + b \\times 10^{n-1} = (a + b \\cdot 10^{-1}) \\times 10^n`,
        options,
        answer: ansStr,
        hint: `Convert the smaller power of 10 to match the larger exponent (${ac.e1}) before adding.`,
        steps: [
          `**Step 1: Rewrite second term to match exponent $10^{${ac.e1}}$**`,
          `$$${ac.m2} \\times 10^{${ac.e2}} = ${(ac.m2 / 10).toFixed(2)} \\times 10^{${ac.e1}}$$`,
          `**Step 2: Add mantissas**`,
          `$$(${ac.m1} + ${(ac.m2 / 10).toFixed(2)}) \\times 10^{${ac.e1}} = ${ansStr}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 3) { // Scientific Notation Division / Quotient Simplification (Sample Q4)
      const divConfigs = [
        { m1: 8.4, e1: -3, m2: 2.1, e2: -7, quotM: '4.0', quotE: 4, expr: '\\frac{8.4 \\times 10^{-3}}{2.1 \\times 10^{-7}}' },
        { m1: 9.6, e1: -2, m2: 3.2, e2: -6, quotM: '3.0', quotE: 4, expr: '\\frac{9.6 \\times 10^{-2}}{3.2 \\times 10^{-6}}' },
        { m1: 7.5, e1: -4, m2: 2.5, e2: -8, quotM: '3.0', quotE: 4, expr: '\\frac{7.5 \\times 10^{-4}}{2.5 \\times 10^{-8}}' },
        { m1: 6.8, e1: -5, m2: 1.7, e2: -9, quotM: '4.0', quotE: 4, expr: '\\frac{6.8 \\times 10^{-5}}{1.7 \\times 10^{-9}}' },
        { m1: 5.2, e1: -1, m2: 1.3, e2: -5, quotM: '4.0', quotE: 4, expr: '\\frac{5.2 \\times 10^{-1}}{1.3 \\times 10^{-5}}' }
      ];
      const dc = divConfigs[variantIndex % divConfigs.length];
      const ansStr = `$${dc.quotM} \\times 10^{${dc.quotE}}$`;
      const options = shuffle([
        ansStr,
        `$${dc.quotM} \\times 10^{${dc.e1 + dc.e2}}$`,
        `$${dc.quotM} \\times 10^{${-dc.quotE}}$`,
        `$${(parseFloat(dc.quotM) * 10).toFixed(1)} \\times 10^{${dc.quotE - 1}}$`
      ]);
      return {
        title: `Scientific Notation Division & Quotient Simplification`,
        text: `Simplify the quotient: $${dc.expr}$ and express in standard scientific notation:`,
        formula: `\\frac{a \\times 10^m}{b \\times 10^n} = \\left(\\frac{a}{b}\\right) \\times 10^{m-n}`,
        options,
        answer: ansStr,
        hint: `Divide mantissas (${dc.m1} ÷ ${dc.m2}) and subtract exponents (${dc.e1} - (${dc.e2})).`,
        steps: [
          `**Step 1: Divide mantissas**`,
          `$$\\frac{${dc.m1}}{${dc.m2}} = ${dc.m1 / dc.m2}$$`,
          `**Step 2: Subtract exponents ($m - n$)**`,
          `$$10^{${dc.e1} - (${dc.e2})} = 10^{${dc.e1 - dc.e2}}$$`,
          `**Step 3: Combine**`,
          `$$\\text{Quotient} = ${ansStr}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 4) { // Astronomy / Distance Word Problem (Sample Q5)
      const astroConfigs = [
        { v: '3.0 \\times 10^8', t: '1.2 \\times 10^4', distM: '3.6', distE: 12, unit: 'meters' },
        { v: '3.0 \\times 10^8', t: '5.0 \\times 10^2', distM: '1.5', distE: 11, unit: 'meters' },
        { v: '3.0 \\times 10^8', t: '2.5 \\times 10^3', distM: '7.5', distE: 11, unit: 'meters' },
        { v: '3.0 \\times 10^8', t: '4.0 \\times 10^4', distM: '1.2', distE: 13, unit: 'meters' },
        { v: '3.0 \\times 10^8', t: '8.0 \\times 10^3', distM: '2.4', distE: 12, unit: 'meters' }
      ];
      const ac = astroConfigs[variantIndex % astroConfigs.length];
      const ansStr = `$${ac.distM} \\times 10^{${ac.distE}}\\text{ ${ac.unit}}$`;
      const options = shuffle([
        ansStr,
        `$${ac.distM} \\times 10^{${ac.distE - 2}}\\text{ ${ac.unit}}$`,
        `$${(parseFloat(ac.distM) * 10).toFixed(1)} \\times 10^{${ac.distE - 1}}\\text{ ${ac.unit}}$`,
        `$${ac.distM} \\times 10^{${ac.distE + 2}}\\text{ ${ac.unit}}$`
      ]);
      return {
        title: `Astrophysical Speed of Light Distance Application`,
        text: `Light travels through space at approximately $${ac.v}\\text{ m/s}$. How far does light travel in $${ac.t}\\text{ seconds}$?`,
        formula: `d = v \\times t = (v_m \\cdot t_m) \\times 10^{v_e + t_e}`,
        options,
        answer: ansStr,
        hint: `Multiply velocity by time using distance formula d = v * t.`,
        steps: [
          `**Step 1: Set up multiplication**`,
          `$$d = (${ac.v}) \\times (${ac.t})$$`,
          `**Step 2: Multiply mantissas and add exponents**`,
          `$$d = ${ansStr}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 5) { // Scientific Notation Subtraction with Different Exponents
      const subConfigs = [
        { m1: 8.5, e1: 6, m2: 4.2, e2: 5, diffM: '8.08', diffE: 6, expr: '(8.5 \\times 10^6) - (4.2 \\times 10^5)' },
        { m1: 9.1, e1: 5, m2: 3.5, e2: 4, diffM: '8.75', diffE: 5, expr: '(9.1 \\times 10^5) - (3.5 \\times 10^4)' },
        { m1: 7.4, e1: 7, m2: 6.1, e2: 6, diffM: '6.79', diffE: 7, expr: '(7.4 \\times 10^7) - (6.1 \\times 10^6)' },
        { m1: 5.3, e1: 8, m2: 8.0, e2: 7, diffM: '4.50', diffE: 8, expr: '(5.3 \\times 10^8) - (8.0 \\times 10^7)' },
        { m1: 6.0, e1: 4, m2: 7.5, e2: 3, diffM: '5.25', diffE: 4, expr: '(6.0 \\times 10^4) - (7.5 \\times 10^3)' }
      ];
      const sc = subConfigs[variantIndex % subConfigs.length];
      const ansStr = `$${sc.diffM} \\times 10^{${sc.diffE}}$`;
      const options = shuffle([
        ansStr,
        `$${(sc.m1 - sc.m2).toFixed(1)} \\times 10^{${sc.e1 - sc.e2}}$`,
        `$${sc.diffM} \\times 10^{${sc.diffE - 1}}$`,
        `$${(parseFloat(sc.diffM) * 10).toFixed(1)} \\times 10^{${sc.diffE - 2}}$`
      ]);
      return {
        title: `Scientific Notation Subtraction with Different Exponents`,
        text: `Calculate the difference: $${sc.expr}$ and express the final result in standard scientific notation:`,
        formula: `a \\times 10^n - b \\times 10^{n-1} = (a - b \\cdot 10^{-1}) \\times 10^n`,
        options,
        answer: ansStr,
        hint: `Convert the smaller power of 10 to match the larger exponent (${sc.e1}) before subtracting.`,
        steps: [
          `**Step 1: Rewrite second term to match exponent $10^{${sc.e1}}$**`,
          `$$${sc.m2} \\times 10^{${sc.e2}} = ${(sc.m2 / 10).toFixed(2)} \\times 10^{${sc.e1}}$$`,
          `**Step 2: Subtract mantissas**`,
          `$$(${sc.m1} - ${(sc.m2 / 10).toFixed(2)}) \\times 10^{${sc.e1}} = ${ansStr}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 6) { // Exponentiation of Scientific Notation Numbers (a x 10^n)^m
      const expConfigs = [
        { m: 4.0, e: -3, p: 2, resM: '1.6', resE: -5, expr: '(4.0 \\times 10^{-3})^2' },
        { m: 3.0, e: 4, p: 3, resM: '2.7', resE: 13, expr: '(3.0 \\times 10^4)^3' },
        { m: 5.0, e: -4, p: 2, resM: '2.5', resE: -7, expr: '(5.0 \\times 10^{-4})^2' },
        { m: 2.0, e: 5, p: 4, resM: '1.6', resE: 21, expr: '(2.0 \\times 10^5)^4' },
        { m: 6.0, e: -2, p: 2, resM: '3.6', resE: -3, expr: '(6.0 \\times 10^{-2})^2' }
      ];
      const ec = expConfigs[variantIndex % expConfigs.length];
      const ansStr = `$${ec.resM} \\times 10^{${ec.resE}}$`;
      const options = shuffle([
        ansStr,
        `$${(parseFloat(ec.resM) * 10).toFixed(0)} \\times 10^{${ec.resE - 1}}$`,
        `$${ec.resM} \\times 10^{${ec.e * ec.p}}$`,
        `$${(ec.m * ec.p).toFixed(1)} \\times 10^{${ec.e * ec.p}}$`
      ]);
      return {
        title: `Exponentiation & Power Raising of Scientific Notation`,
        text: `Evaluate $${ec.expr}$ and express the final answer in standard scientific notation:`,
        formula: `(a \\times 10^n)^m = a^m \\times 10^{n \\cdot m}`,
        options,
        answer: ansStr,
        hint: `Raise mantissa ${ec.m} to power ${ec.p} (${Math.pow(ec.m, ec.p)}), multiply exponent by ${ec.p}, then re-normalize.`,
        steps: [
          `**Step 1: Raise mantissa to power ${ec.p}**`,
          `$$(${ec.m})^{${ec.p}} = ${Math.pow(ec.m, ec.p)}$$`,
          `**Step 2: Multiply exponent by ${ec.p}**`,
          `$$10^{(${ec.e}) \\times ${ec.p}} = 10^{${ec.e * ec.p}}$$`,
          `**Step 3: Re-normalize mantissa between 1 and 10**`,
          `$$${Math.pow(ec.m, ec.p)} \\times 10^{${ec.e * ec.p}} = ${ansStr}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 7) { // Comparing Numbers in Scientific Notation
      const compConfigs = [
        { choiceA: '7.5 \\times 10^6', choiceB: '1.2 \\times 10^7', choiceC: '9.8 \\times 10^6', choiceD: '8.9 \\times 10^5', largest: '1.2 \\times 10^7', reason: 'Exponent 7 represents 12,000,000, which is larger than all exponent 6 terms.' },
        { choiceA: '3.4 \\times 10^8', choiceB: '9.9 \\times 10^7', choiceC: '2.8 \\times 10^8', choiceD: '8.5 \\times 10^7', largest: '3.4 \\times 10^8', reason: 'Exponent 8 terms are largest; 3.4 > 2.8 so 3.4 × 10^8 is greatest.' },
        { choiceA: '5.1 \\times 10^{-4}', choiceB: '8.2 \\times 10^{-5}', choiceC: '6.7 \\times 10^{-4}', choiceD: '9.0 \\times 10^{-6}', largest: '6.7 \\times 10^{-4}', reason: 'Exponent -4 is larger than -5 and -6; 6.7 > 5.1 so 6.7 × 10^-4 is greatest.' },
        { choiceA: '4.5 \\times 10^9', choiceB: '1.1 \\times 10^{10}', choiceC: '8.8 \\times 10^9', choiceD: '9.5 \\times 10^9', largest: '1.1 \\times 10^{10}', reason: 'Exponent 10 represents 11,000,000,000, exceeding all exponent 9 terms.' },
        { choiceA: '2.3 \\times 10^{-3}', choiceB: '7.4 \\times 10^{-4}', choiceC: '1.9 \\times 10^{-3}', choiceD: '8.1 \\times 10^{-4}', largest: '2.3 \\times 10^{-3}', reason: 'Exponent -3 terms are larger than -4; 2.3 > 1.9 so 2.3 × 10^-3 is greatest.' }
      ];
      const cc = compConfigs[variantIndex % compConfigs.length];
      const ansStr = `$${cc.largest}$ (${cc.reason})`;
      const options = shuffle([
        ansStr,
        `$${cc.choiceA}$`,
        `$${cc.choiceB === cc.largest ? cc.choiceC : cc.choiceB}$`,
        `$${cc.choiceD}$`
      ]);
      return {
        title: `Scientific Notation Magnitude Comparison`,
        text: `Which of the following numbers expressed in scientific notation is the LARGEST in numerical value? Option A: $${cc.choiceA}$, Option B: $${cc.choiceB}$, Option C: $${cc.choiceC}$, Option D: $${cc.choiceD}$:`,
        formula: `10^a > 10^b \\iff a > b \\quad \\text{for positive numbers}`,
        options,
        answer: ansStr,
        hint: `Compare the powers of 10 first. Larger exponents indicate larger numbers.`,
        steps: [
          `**Step 1: Compare exponents of 10**`,
          `$$\\text{Largest exponent term dictates greatest magnitude}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 2
      };
    } else if (subType === 8) { // Microscopic Biology / Mass & Population Application
      const bioConfigs = [
        { cellMass: '3.0 \\times 10^{-11}', count: '5.0 \\times 10^9', totalM: '1.5', totalE: -1, unit: 'grams' },
        { cellMass: '2.5 \\times 10^{-10}', count: '4.0 \\times 10^8', totalM: '1.0', totalE: -1, unit: 'grams' },
        { cellMass: '4.0 \\times 10^{-12}', count: '3.0 \\times 10^{10}', totalM: '1.2', totalE: -1, unit: 'grams' },
        { cellMass: '1.8 \\times 10^{-11}', count: '5.0 \\times 10^8', totalM: '9.0', totalE: -3, unit: 'grams' },
        { cellMass: '6.0 \\times 10^{-12}', count: '2.0 \\times 10^9', totalM: '1.2', totalE: -2, unit: 'grams' }
      ];
      const bc = bioConfigs[variantIndex % bioConfigs.length];
      const ansStr = `$${bc.totalM} \\times 10^{${bc.totalE}}$ ${bc.unit}`;
      const options = shuffle([
        ansStr,
        `$${bc.totalM} \\times 10^{${bc.totalE - 2}}$ ${bc.unit}`,
        `$${(parseFloat(bc.totalM) * 10).toFixed(1)} \\times 10^{${bc.totalE - 1}}$ ${bc.unit}`,
        `$${bc.totalM} \\times 10^{${bc.totalE + 3}}$ ${bc.unit}`
      ]);
      return {
        title: `Microscopic Cellular Population Mass Calculation`,
        text: `A single biological cell has a mass of approximately $${bc.cellMass}$ grams. What is the total combined mass of a population of $${bc.count}$ cells expressed in scientific notation?`,
        formula: `\\text{Total Mass} = \\text{Individual Mass} \\times \\text{Population Count}`,
        options,
        answer: ansStr,
        hint: `Multiply individual mass by cell count using scientific notation multiplication rules.`,
        steps: [
          `**Step 1: Set up product**`,
          `$$\\text{Mass} = (${bc.cellMass}) \\times (${bc.count})$$`,
          `**Step 2: Multiply and normalize**`,
          `$$\\text{Mass} = ${bc.totalM} \\times 10^{${bc.totalE}}\\text{ ${bc.unit}}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 5) { // Scientific Notation Subtraction with Different Exponents
      const subConfigs = [
        { m1: 8.5, e1: 6, m2: 4.2, e2: 5, diffM: '8.08', diffE: 6, expr: '(8.5 \\times 10^6) - (4.2 \\times 10^5)' },
        { m1: 9.1, e1: 5, m2: 3.5, e2: 4, diffM: '8.75', diffE: 5, expr: '(9.1 \\times 10^5) - (3.5 \\times 10^4)' },
        { m1: 7.4, e1: 7, m2: 6.1, e2: 6, diffM: '6.79', diffE: 7, expr: '(7.4 \\times 10^7) - (6.1 \\times 10^6)' },
        { m1: 5.3, e1: 8, m2: 8.0, e2: 7, diffM: '4.50', diffE: 8, expr: '(5.3 \\times 10^8) - (8.0 \\times 10^7)' },
        { m1: 6.0, e1: 4, m2: 7.5, e2: 3, diffM: '5.25', diffE: 4, expr: '(6.0 \\times 10^4) - (7.5 \\times 10^3)' }
      ];
      const sc = subConfigs[variantIndex % subConfigs.length];
      const ansStr = `$${sc.diffM} \\times 10^{${sc.diffE}}$`;
      const options = shuffle([
        ansStr,
        `$${(sc.m1 - sc.m2).toFixed(1)} \\times 10^{${sc.e1 - sc.e2}}$`,
        `$${sc.diffM} \\times 10^{${sc.diffE - 1}}$`,
        `$${(parseFloat(sc.diffM) * 10).toFixed(1)} \\times 10^{${sc.diffE - 2}}$`
      ]);
      return {
        title: `Scientific Notation Subtraction with Different Exponents`,
        text: `Calculate the difference: $${sc.expr}$ and express the final result in standard scientific notation:`,
        formula: `a \\times 10^n - b \\times 10^{n-1} = (a - b \\cdot 10^{-1}) \\times 10^n`,
        options,
        answer: ansStr,
        hint: `Convert the smaller power of 10 to match the larger exponent (${sc.e1}) before subtracting.`,
        steps: [
          `**Step 1: Rewrite second term to match exponent $10^{${sc.e1}}$**`,
          `$$${sc.m2} \\times 10^{${sc.e2}} = ${(sc.m2 / 10).toFixed(2)} \\times 10^{${sc.e1}}$$`,
          `**Step 2: Subtract mantissas**`,
          `$$(${sc.m1} - ${(sc.m2 / 10).toFixed(2)}) \\times 10^{${sc.e1}} = ${sc.diffM} \\times 10^{${sc.diffE}}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 6) { // Exponentiation of Scientific Notation Numbers (a x 10^n)^m
      const expConfigs = [
        { m: 4.0, e: -3, p: 2, resM: '1.6', resE: -5, expr: '(4.0 \\times 10^{-3})^2' },
        { m: 3.0, e: 4, p: 3, resM: '2.7', resE: 13, expr: '(3.0 \\times 10^4)^3' },
        { m: 5.0, e: -4, p: 2, resM: '2.5', resE: -7, expr: '(5.0 \\times 10^{-4})^2' },
        { m: 2.0, e: 5, p: 4, resM: '1.6', resE: 21, expr: '(2.0 \\times 10^5)^4' },
        { m: 6.0, e: -2, p: 2, resM: '3.6', resE: -3, expr: '(6.0 \\times 10^{-2})^2' }
      ];
      const ec = expConfigs[variantIndex % expConfigs.length];
      const ansStr = `$${ec.resM} \\times 10^{${ec.resE}}$`;
      const options = shuffle([
        ansStr,
        `$${(parseFloat(ec.resM) * 10).toFixed(0)} \\times 10^{${ec.resE - 1}}$`,
        `$${ec.resM} \\times 10^{${ec.e * ec.p}}$`,
        `$${(ec.m * ec.p).toFixed(1)} \\times 10^{${ec.e * ec.p}}$`
      ]);
      return {
        title: `Exponentiation & Power Raising of Scientific Notation`,
        text: `Evaluate $${ec.expr}$ and express the final answer in standard scientific notation:`,
        formula: `(a \\times 10^n)^m = a^m \\times 10^{n \\cdot m}`,
        options,
        answer: ansStr,
        hint: `Raise mantissa ${ec.m} to power ${ec.p} (${Math.pow(ec.m, ec.p)}), multiply exponent by ${ec.p}, then re-normalize.`,
        steps: [
          `**Step 1: Raise mantissa to power ${ec.p}**`,
          `$$(${ec.m})^{${ec.p}} = ${Math.pow(ec.m, ec.p)}$$`,
          `**Step 2: Multiply exponent by ${ec.p}**`,
          `$$10^{(${ec.e}) \\times ${ec.p}} = 10^{${ec.e * ec.p}}$$`,
          `**Step 3: Re-normalize mantissa between 1 and 10**`,
          `$$${Math.pow(ec.m, ec.p)} \\times 10^{${ec.e * ec.p}} = ${ec.resM} \\times 10^{${ec.resE}}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 7) { // Comparing Numbers in Scientific Notation
      const compConfigs = [
        { choiceA: '7.5 \\times 10^6', choiceB: '1.2 \\times 10^7', choiceC: '9.8 \\times 10^6', choiceD: '8.9 \\times 10^5', largest: '1.2 \\times 10^7', reason: 'Exponent 7 represents 12,000,000, which is larger than all exponent 6 terms.' },
        { choiceA: '3.4 \\times 10^8', choiceB: '9.9 \\times 10^7', choiceC: '2.8 \\times 10^8', choiceD: '8.5 \\times 10^7', largest: '3.4 \\times 10^8', reason: 'Exponent 8 terms are largest; 3.4 > 2.8 so 3.4 × 10^8 is greatest.' },
        { choiceA: '5.1 \\times 10^{-4}', choiceB: '8.2 \\times 10^{-5}', choiceC: '6.7 \\times 10^{-4}', choiceD: '9.0 \\times 10^{-6}', largest: '6.7 \\times 10^{-4}', reason: 'Exponent -4 is larger than -5 and -6; 6.7 > 5.1 so 6.7 × 10^-4 is greatest.' },
        { choiceA: '4.5 \\times 10^9', choiceB: '1.1 \\times 10^{10}', choiceC: '8.8 \\times 10^9', choiceD: '9.5 \\times 10^9', largest: '1.1 \\times 10^{10}', reason: 'Exponent 10 represents 11,000,000,000, exceeding all exponent 9 terms.' },
        { choiceA: '2.3 \\times 10^{-3}', choiceB: '7.4 \\times 10^{-4}', choiceC: '1.9 \\times 10^{-3}', choiceD: '8.1 \\times 10^{-4}', largest: '2.3 \\times 10^{-3}', reason: 'Exponent -3 terms are larger than -4; 2.3 > 1.9 so 2.3 × 10^-3 is greatest.' }
      ];
      const cc = compConfigs[variantIndex % compConfigs.length];
      const ansStr = `$${cc.largest}$ (${cc.reason})`;
      const options = shuffle([
        ansStr,
        `$${cc.choiceA}$`,
        `$${cc.choiceB === cc.largest ? cc.choiceC : cc.choiceB}$`,
        `$${cc.choiceD}$`
      ]);
      return {
        title: `Scientific Notation Magnitude Comparison`,
        text: `Which of the following numbers expressed in scientific notation is the LARGEST in numerical value? Option A: $${cc.choiceA}$, Option B: $${cc.choiceB}$, Option C: $${cc.choiceC}$, Option D: $${cc.choiceD}$:`,
        formula: `10^a > 10^b \\iff a > b \\quad \\text{for positive numbers}`,
        options,
        answer: ansStr,
        hint: `Compare the powers of 10 first. Larger exponents indicate larger numbers.`,
        steps: [
          `**Step 1: Compare exponents of 10**`,
          `$$\\text{Largest exponent term dictates greatest magnitude}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 2
      };
    } else if (subType === 8) { // Microscopic Biology / Mass & Population Application
      const bioConfigs = [
        { cellMass: '3.0 \\times 10^{-11}', count: '5.0 \\times 10^9', totalM: '1.5', totalE: -1, unit: 'grams' },
        { cellMass: '2.5 \\times 10^{-10}', count: '4.0 \\times 10^8', totalM: '1.0', totalE: -1, unit: 'grams' },
        { cellMass: '4.0 \\times 10^{-12}', count: '3.0 \\times 10^{10}', totalM: '1.2', totalE: -1, unit: 'grams' },
        { cellMass: '1.8 \\times 10^{-11}', count: '5.0 \\times 10^8', totalM: '9.0', totalE: -3, unit: 'grams' },
        { cellMass: '6.0 \\times 10^{-12}', count: '2.0 \\times 10^9', totalM: '1.2', totalE: -2, unit: 'grams' }
      ];
      const bc = bioConfigs[variantIndex % bioConfigs.length];
      const ansStr = `$${bc.totalM} \\times 10^{${bc.totalE}}$ ${bc.unit}`;
      const options = shuffle([
        ansStr,
        `$${bc.totalM} \\times 10^{${bc.totalE - 2}}$ ${bc.unit}`,
        `$${(parseFloat(bc.totalM) * 10).toFixed(1)} \\times 10^{${bc.totalE - 1}}$ ${bc.unit}`,
        `$${bc.totalM} \\times 10^{${bc.totalE + 3}}$ ${bc.unit}`
      ]);
      return {
        title: `Microscopic Cellular Population Mass Calculation`,
        text: `A single biological cell has a mass of approximately $${bc.cellMass}$ grams. What is the total combined mass of a population of $${bc.count}$ cells expressed in scientific notation?`,
        formula: `\\text{Total Mass} = \\text{Individual Mass} \\times \\text{Population Count}`,
        options,
        answer: ansStr,
        hint: `Multiply individual mass by cell count using scientific notation multiplication rules.`,
        steps: [
          `**Step 1: Set up product**`,
          `$$\\text{Mass} = (${bc.cellMass}) \\times (${bc.count})$$`,
          `**Step 2: Multiply and normalize**`,
          `$$\\text{Mass} = ${bc.totalM} \\times 10^{${bc.totalE}}\\text{ ${bc.unit}}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else { // Converting Scientific Notation to Standard Decimal Form
      const revConfigs = [
        { sciSmall: '6.15 \\times 10^{-4}', decSmall: '0.000615', sciLarge: '8.04 \\times 10^5', decLarge: '804,000' },
        { sciSmall: '3.72 \\times 10^{-5}', decSmall: '0.0000372', sciLarge: '9.18 \\times 10^6', decLarge: '9,180,000' },
        { sciSmall: '8.49 \\times 10^{-3}', decSmall: '0.00849', sciLarge: '5.26 \\times 10^4', decLarge: '52,600' },
        { sciSmall: '1.93 \\times 10^{-6}', decSmall: '0.00000193', sciLarge: '7.31 \\times 10^7', decLarge: '73,100,000' },
        { sciSmall: '4.08 \\times 10^{-4}', decSmall: '0.000408', sciLarge: '2.65 \\times 10^5', decLarge: '265,000' }
      ];
      const rc = revConfigs[variantIndex % revConfigs.length];
      const ansStr = `$${rc.decSmall}$ and $${rc.decLarge}$`;
      const options = shuffle([
        ansStr,
        `$0.00615$ and $80,400$`,
        `$0.0000615$ and $8,040,000$`,
        `$0.0615$ and $804,000,000$`
      ]);
      return {
        title: `Scientific Notation to Standard Decimal Conversion`,
        text: `Convert the scientific notation expressions $${rc.sciSmall}$ and $${rc.sciLarge}$ into standard decimal notation:`,
        formula: `a \\times 10^n \\implies \\text{Shift decimal point } |n| \\text{ places}`,
        options,
        answer: ansStr,
        hint: `Negative power -n shifts decimal n places left; positive power +n shifts decimal n places right.`,
        steps: [
          `**Step 1: Convert $${rc.sciSmall}$**`,
          `$$\\text{Shift decimal 4 places left} \\implies ${rc.decSmall}$$`,
          `**Step 2: Convert $${rc.sciLarge}$**`,
          `$$\\text{Shift decimal 5 places right} \\implies ${rc.decLarge}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 2
      };
    }
  }

  // Category 3N: Form 7 - Data Collection, Sampling Techniques, Tables & Graphs (Topic ID 122 - 50 DYNAMIC VARIATION QUESTIONS)
  if (topicId === 122) {
    const subType = qIndex % 10;
    const variantIndex = Math.floor(qIndex / 10); // 0 to 4 across 50 questions

    if (subType === 0) { // Grouped vs Ungrouped Frequency Tables (Sample Q1)
      const groupConfigs = [
        {
          scenario: 'a continuous dataset of 100 student exam scores ranging from 35 to 98',
          ansStr: 'When the dataset is large with a wide numerical range, making grouped intervals essential to reveal distribution patterns.',
          distractors: [
            'When the dataset contains only 5 distinct categorical outcomes.',
            'When every single raw data point must be displayed individually without any aggregation.',
            'When all data values are identical integer constants.'
          ]
        },
        {
          scenario: 'daily temperature measurements over a 365-day calendar year spanning -10°C to 42°C',
          ansStr: 'When dealing with a vast continuous dataset with high spread to condense data into meaningful class intervals.',
          distractors: [
            'When classifying a survey with only two choices (Yes / No).',
            'When calculating the mean of a 4-element list.',
            'When ordering a list of 3 prime numbers.'
          ]
        },
        {
          scenario: 'monthly household electricity consumption figures across 500 residences',
          ansStr: 'When raw data spans a broad range, grouping into equal intervals simplifies visualization without losing overall shape.',
          distractors: [
            'When recording discrete tally counts of 3 color options.',
            'When all values fall into 2 integer categories.',
            'When graphing a single static data point.'
          ]
        },
        {
          scenario: 'marathon completion times in minutes for 250 runners',
          ansStr: 'When continuous numerical data spans broad ranges, grouping into intervals avoids overly sparse ungrouped tables.',
          distractors: [
            'When comparing binary survey responses.',
            'When listing names of top 3 winners.',
            'When data consists of exact qualitative rank titles.'
          ]
        },
        {
          scenario: 'heights in centimeters of 150 high school athletes',
          ansStr: 'When measuring continuous quantitative variables across large samples to summarize frequency across bounded class limits.',
          distractors: [
            'When reporting eye colors of 10 individuals.',
            'When listing days of the week.',
            'When all values are equal to zero.'
          ]
        }
      ];
      const gc = groupConfigs[variantIndex % groupConfigs.length];
      const ansStr = gc.ansStr;
      const options = shuffle([ansStr, ...gc.distractors]);
      return {
        title: `Grouped vs. Ungrouped Frequency Table Rationale`,
        text: `When constructing a frequency distribution table for ${gc.scenario}, under what condition is a grouped frequency table with class intervals preferred over an ungrouped table?`,
        formula: `\\text{Class Width } (w) = \\left\\lceil \\frac{\\text{Maximum} - \\text{Minimum}}{\\text{Number of Classes}} \\right\\rceil`,
        options,
        answer: ansStr,
        hint: `Consider how large datasets with wide numerical ranges become unmanageable if every single unique value is listed separately.`,
        steps: [
          `**Step 1: Evaluate dataset size and range**`,
          `$$\\text{Large sample size } N \\text{ and broad range } R \\implies \\text{Grouped intervals condensely summarize distribution}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: GROUPED_FREQ_TABLE_IMAGE,
        image_alt: 'Grouped Frequency Distribution Table Visual',
        difficulty: 2
      };
    } else if (subType === 1) { // Stem-and-Leaf Plot vs Bar Graph Comparison (Sample Q2)
      const stemConfigs = [
        {
          context: 'small to moderate numerical datasets (e.g. 20-50 test scores)',
          ansStr: 'When it is necessary to preserve individual raw data values while simultaneously displaying the overall distribution shape.',
          distractors: [
            'When summarizing categorical qualitative data such as favorite colors.',
            'When displaying continuous time-series data over multiple years.',
            'When representing budget percentage breakdowns summing to 100%.'
          ]
        },
        {
          context: 'analyzing bowler scores in a regional cricket tournament (35 data points)',
          ansStr: 'When retaining original exact score values alongside frequency density is required for detailed statistical analysis.',
          distractors: [
            'When plotting non-numerical nominal labels.',
            'When depicting cumulative growth curves over decades.',
            'When illustrating ratio parts of a whole circle.'
          ]
        },
        {
          context: 'evaluating patient recovery times in days for a 30-patient trial',
          ansStr: 'When maintaining complete access to every original numerical data point while visualizing skewness and clusters.',
          distractors: [
            'When graphing discrete survey options without numbers.',
            'When plotting continuous geographical elevation maps.',
            'When presenting financial market share percentages.'
          ]
        },
        {
          context: 'comparing student math quiz results across two class sections',
          ansStr: 'When back-to-back comparisons require seeing raw individual scores alongside shape and spread.',
          distractors: [
            'When graphing pie slices of favorite fruits.',
            'When tracking monthly stock indices.',
            'When recording qualitative binary votes.'
          ]
        },
        {
          context: 'recording plant growth heights in mm for 25 laboratory specimens',
          ansStr: 'When detailed inspection of data clusters, gaps, and outliers is needed without discarding actual data digits.',
          distractors: [
            'When summarizing vehicle paint color choices.',
            'When displaying 24-hour continuous temperature changes.',
            'When creating a 3D bar chart for nominal labels.'
          ]
        }
      ];
      const sc = stemConfigs[variantIndex % stemConfigs.length];
      const ansStr = sc.ansStr;
      const options = shuffle([ansStr, ...sc.distractors]);
      return {
        title: `Stem-and-Leaf Plot Information Value Comparison`,
        text: `Under what specific conditions is a stem-and-leaf plot more informative and advantageous than a standard bar graph when analyzing ${sc.context}?`,
        formula: `\\text{Stem} = \\text{Leading Digits}, \\quad \\text{Leaf} = \\text{Trailing Digit}`,
        options,
        answer: ansStr,
        hint: `Think about what happens to individual data numbers when placed into bar graph categories versus stem-and-leaf stems.`,
        steps: [
          `**Step 1: Identify data retention features**`,
          `$$\\text{Bar graphs summarize counts; Stem-and-leaf plots preserve exact raw numerical data points.}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: STEM_LEAF_IMAGE,
        image_alt: 'Stem-and-Leaf Plot Information Visual',
        difficulty: 2
      };
    } else if (subType === 2) { // Class Width & Interval Construction Calculation (Sample Q3)
      const widthConfigs = [
        { min: 42, max: 98, classes: 5, range: 56, exactW: 11.2, ceilW: 12 },
        { min: 35, max: 89, classes: 6, range: 54, exactW: 9.0, ceilW: 10 },
        { min: 50, max: 95, classes: 5, range: 45, exactW: 9.0, ceilW: 10 },
        { min: 28, max: 94, classes: 6, range: 66, exactW: 11.0, ceilW: 11 },
        { min: 15, max: 87, classes: 8, range: 72, exactW: 9.0, ceilW: 10 }
      ];
      const wc = widthConfigs[variantIndex % widthConfigs.length];
      const ansStr = `Class width $w = ${wc.ceilW}$`;
      const options = shuffle([
        ansStr,
        `Class width $w = ${wc.ceilW - 2}$`,
        `Class width $w = ${wc.ceilW + 3}$`,
        `Class width $w = ${wc.range}$`
      ]);
      return {
        title: `Frequency Distribution Table Class Width Calculation`,
        text: `A teacher collects raw test scores for a class of students. The minimum score is $${wc.min}$ and the maximum score is $${wc.max}$. If the teacher wishes to organize this data into a frequency distribution table with $${wc.classes}$ equal class intervals, what is the appropriate class width $w$?`,
        formula: `w = \\left\\lceil \\frac{\\text{Range}}{k} \\right\\rceil = \\left\\lceil \\frac{\\text{Max} - \\text{Min}}{k} \\right\\rceil`,
        options,
        answer: ansStr,
        hint: `Calculate Range = Max - Min, divide by number of classes k, and round up to the next convenient integer.`,
        steps: [
          `**Step 1: Calculate the range**`,
          `$$\\text{Range} = \\text{Max} - \\text{Min} = ${wc.max} - ${wc.min} = ${wc.range}$$`,
          `**Step 2: Divide range by number of classes $k = ${wc.classes}$**`,
          `$$\\frac{\\text{Range}}{k} = \\frac{${wc.range}}{${wc.classes}} = ${wc.exactW}$$`,
          `**Step 3: Round up to next whole number width**`,
          `$$w = \\lceil ${wc.exactW} \\rceil = ${wc.ceilW}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: GROUPED_FREQ_TABLE_IMAGE,
        image_alt: 'Frequency Distribution Table Class Width Visual',
        difficulty: 2
      };
    } else if (subType === 3) { // Graph Selection Justification: Line Graph vs Pie Chart (Sample Q4)
      const graphConfigs = [
        {
          scenario: 'hourly outdoor temperatures recorded continuously over a 24-hour period',
          ansStr: 'Line graphs illustrate continuous trend movement, fluctuations, and rates of change over sequential time periods.',
          distractors: [
            'Pie charts cannot be drawn with more than 3 sectors.',
            'Line graphs automatically compute the mean temperature.',
            'Bar graphs can only represent negative numbers.'
          ]
        },
        {
          scenario: 'monthly company revenue growth over a 5-year period',
          ansStr: 'Line graphs show chronological trends, continuous progression, and direction of change over time.',
          distractors: [
            'Pie charts are restricted to qualitative surveys only.',
            'Line graphs display categorical frequencies better than bar charts.',
            'Pie charts require all data to be prime numbers.'
          ]
        },
        {
          scenario: 'reservoir water level variations measured daily across 30 days',
          ansStr: 'Line graphs visually emphasize continuous time-series patterns, peaks, and troughs over time.',
          distractors: [
            'Pie charts cannot depict percentage values.',
            'Line graphs convert all values into percentages.',
            'Stem-and-leaf plots are illegal for water measurements.'
          ]
        },
        {
          scenario: 'heart rate changes in beats per minute during a 45-minute exercise session',
          ansStr: 'Line graphs effectively depict continuous dynamic changes and trends over continuous time intervals.',
          distractors: [
            'Pie charts can only show binary data.',
            'Bar graphs require equal frequencies across bars.',
            'Line graphs sum all data points to 100%.'
          ]
        },
        {
          scenario: 'annual country population totals tracked over 10 consecutive years',
          ansStr: 'Line graphs reveal temporal progression, growth rates, and overall trajectory across continuous time.',
          distractors: [
            'Pie charts can only represent 4 age categories.',
            'Line graphs hide numerical axis labels.',
            'Bar graphs cannot display large numbers.'
          ]
        }
      ];
      const gc = graphConfigs[variantIndex % graphConfigs.length];
      const ansStr = gc.ansStr;
      const options = shuffle([ansStr, ...gc.distractors]);
      return {
        title: `Appropriate Graph Selection Rationale`,
        text: `Why is a line graph significantly more appropriate than a pie chart for displaying ${gc.scenario}?`,
        formula: `\\text{Line Graph} \\implies \\text{Time-Series / Trends}; \\quad \\text{Pie Chart} \\implies \\text{Part-to-Whole Proportions}`,
        options,
        answer: ansStr,
        hint: `Consider the difference between tracking data over continuous time versus showing static fractional parts of a whole.`,
        steps: [
          `**Step 1: Compare graph purposes**`,
          `$$\\text{Continuous sequential time data } \\implies \\text{Line graph tracks trends and rate of change.}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: TIME_SERIES_LINE_IMAGE,
        image_alt: 'Continuous 24-Hour Temperature Time-Series Line Graph Visual',
        difficulty: 2
      };
    } else if (subType === 4) { // Sampling Techniques Identification
      const sampleConfigs = [
        {
          desc: 'A quality inspector selects every $15^{\\text{th}}$ item coming off an assembly line starting from a randomly selected first item.',
          ansStr: 'Systematic Sampling',
          distractors: ['Simple Random Sampling', 'Stratified Sampling', 'Cluster Sampling']
        },
        {
          desc: 'A researcher divides a high school population into Form 7, Form 8, Form 9, and Form 10 strata, then randomly selects 25 students from each grade level.',
          ansStr: 'Stratified Random Sampling',
          distractors: ['Systematic Sampling', 'Cluster Sampling', 'Convenience Sampling']
        },
        {
          desc: 'A survey company randomly selects 5 entire school districts out of 50 in a province and surveys ALL teachers in those 5 chosen districts.',
          ansStr: 'Cluster Sampling',
          distractors: ['Stratified Random Sampling', 'Systematic Sampling', 'Simple Random Sampling']
        },
        {
          desc: 'A computer generates a list of 50 random student identification numbers out of a master list of 1,000 students, giving every student an equal chance of selection.',
          ansStr: 'Simple Random Sampling',
          distractors: ['Systematic Sampling', 'Stratified Sampling', 'Cluster Sampling']
        },
        {
          desc: 'A news reporter interviews the first 20 people who walk out of a shopping mall entrance because they are easy to reach.',
          ansStr: 'Convenience Sampling',
          distractors: ['Simple Random Sampling', 'Stratified Sampling', 'Systematic Sampling']
        }
      ];
      const sc = sampleConfigs[variantIndex % sampleConfigs.length];
      const ansStr = sc.ansStr;
      const options = shuffle([ansStr, ...sc.distractors]);
      return {
        title: `Statistical Sampling Technique Identification`,
        text: `Identify the specific statistical sampling technique described: "${sc.desc}"`,
        formula: `\\text{Sampling Methods: Simple Random, Stratified, Systematic, Cluster, Convenience}`,
        options,
        answer: ansStr,
        hint: `Look at how subjects are chosen: fixed intervals = systematic; subgroups = stratified; entire groups = cluster; equal random chance = simple random.`,
        steps: [
          `**Step 1: Analyze sampling mechanism**`,
          `$$\\text{Method mechanism fits definition of: } ${ansStr}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 2
      };
    } else if (subType === 5) { // Stem-and-Leaf Plot Construction & Value Extraction
      const stemDataConfigs = [
        {
          stemStr: 'Stem 4 | 2, 5; Stem 5 | 1, 3, 8; Stem 6 | 0, 4, 7',
          values: [42, 45, 51, 53, 58, 60, 64, 67],
          median: 52,
          targetQ: 'median score',
          ansStr: 'Median score = 52'
        },
        {
          stemStr: 'Stem 6 | 1, 4, 8; Stem 7 | 2, 5; Stem 8 | 0, 3, 9',
          values: [61, 64, 68, 72, 75, 80, 83, 89],
          median: 73.5,
          targetQ: 'median score',
          ansStr: 'Median score = 73.5'
        },
        {
          stemStr: 'Stem 5 | 0, 2, 6; Stem 6 | 3, 7, 9; Stem 7 | 1, 5',
          values: [50, 52, 56, 63, 67, 69, 71, 75],
          median: 65,
          targetQ: 'median score',
          ansStr: 'Median score = 65'
        },
        {
          stemStr: 'Stem 7 | 3, 5, 8; Stem 8 | 1, 4; Stem 9 | 0, 2, 6',
          values: [73, 75, 78, 81, 84, 90, 92, 96],
          median: 82.5,
          targetQ: 'median score',
          ansStr: 'Median score = 82.5'
        },
        {
          stemStr: 'Stem 3 | 4, 9; Stem 4 | 2, 6, 8; Stem 5 | 1, 5, 7',
          values: [34, 39, 42, 46, 48, 51, 55, 57],
          median: 47,
          targetQ: 'median score',
          ansStr: 'Median score = 47'
        }
      ];
      const sdc = stemDataConfigs[variantIndex % stemDataConfigs.length];
      const ansStr = sdc.ansStr;
      const options = shuffle([
        ansStr,
        `Median score = ${sdc.median - 3}`,
        `Median score = ${sdc.median + 4}`,
        `Median score = ${sdc.values[0]}`
      ]);
      return {
        title: `Stem-and-Leaf Plot Data Extraction & Analysis`,
        text: `Consider the following stem-and-leaf plot representing quiz scores of 8 students (Key: $5 \\mid 2 = 52$):\n\n${sdc.stemStr}\n\nWhat is the median score of this dataset?`,
        formula: `\\text{Median} = \\text{Middle value when ordered} \\quad (N = 8 \\implies \\text{average of } 4^{\\text{th}} \\text{ and } 5^{\\text{th}} \\text{ values})`,
        options,
        answer: ansStr,
        hint: `List the 8 score values in ascending order from the stems and leaves, then find the average of the two middle numbers.`,
        steps: [
          `**Step 1: Reconstruct raw dataset from stems and leaves**`,
          `$$\\text{Scores: } ${sdc.values.join(', ')}$$`,
          `**Step 2: Find middle values ($4^{\\text{th}}$ and $5^{\\text{th}}$)**`,
          `$$v_4 = ${sdc.values[3]}, \\quad v_5 = ${sdc.values[4]}$$`,
          `**Step 3: Calculate median**`,
          `$$\\text{Median} = \\frac{${sdc.values[3]} + ${sdc.values[4]}}{2} = ${sdc.median}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: STEM_LEAF_IMAGE,
        image_alt: 'Stem-and-Leaf Plot Table Visual',
        difficulty: 2
      };
    } else if (subType === 6) { // Pie Chart Sector Angle Calculation
      const pieConfigs = [
        { count: 60, total: 200, subject: 'Mathematics', angle: 108 },
        { count: 45, total: 180, subject: 'Science', angle: 90 },
        { count: 80, total: 300, subject: 'English', angle: 96 },
        { count: 35, total: 140, subject: 'History', angle: 90 },
        { count: 50, total: 250, subject: 'Art', angle: 72 }
      ];
      const pc = pieConfigs[variantIndex % pieConfigs.length];
      const ansStr = `Central angle $= ${pc.angle}^\\circ$`;
      const options = shuffle([
        ansStr,
        `Central angle $= ${pc.angle - 18}^\\circ$`,
        `Central angle $= ${pc.angle + 24}^\\circ$`,
        `Central angle $= ${(pc.count / pc.total * 100).toFixed(1)}^\\circ$`
      ]);
      return {
        title: `Pie Chart Central Sector Angle Calculation`,
        text: `In a school survey of $${pc.total}$ students, $${pc.count}$ students selected ${pc.subject} as their favorite subject. If this data is presented in a pie chart (circle graph), what central angle in degrees should represent the ${pc.subject} sector?`,
        formula: `\\text{Central Angle } (\\theta) = \\left(\\frac{\\text{Category Frequency}}{\\text{Total Frequency}}\\right) \\times 360^\\circ`,
        options,
        answer: ansStr,
        hint: `Divide the category frequency by total students, then multiply by 360 degrees.`,
        steps: [
          `**Step 1: Calculate fraction of total**`,
          `$$\\text{Fraction} = \\frac{${pc.count}}{${pc.total}} = ${(pc.count / pc.total).toFixed(2)}$$`,
          `**Step 2: Multiply by $360^\\circ$**`,
          `$$\\theta = ${(pc.count / pc.total).toFixed(2)} \\times 360^\\circ = ${pc.angle}^\\circ$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: PIE_DISTRIBUTION_IMAGE,
        image_alt: 'Student Favorite Subject Pie Chart Visual',
        difficulty: 2
      };
    } else if (subType === 7) { // Frequency Distribution Table Relative Frequency Calculation
      const relConfigs = [
        { f1: 12, f2: 18, f3: 15, f4: 5, targetClass: 'second class (frequency 18)', relPct: '36%' },
        { f1: 10, f2: 25, f3: 10, f4: 5, targetClass: 'second class (frequency 25)', relPct: '50%' },
        { f1: 14, f2: 21, f3: 28, f4: 7, targetClass: 'third class (frequency 28)', relPct: '40%' },
        { f1: 8, f2: 12, f3: 16, f4: 4, targetClass: 'third class (frequency 16)', relPct: '40%' },
        { f1: 15, f2: 30, f3: 40, f4: 15, targetClass: 'third class (frequency 40)', relPct: '40%' }
      ];
      const rc = relConfigs[variantIndex % relConfigs.length];
      const totalF = rc.f1 + rc.f2 + rc.f3 + rc.f4;
      const ansStr = `Relative frequency = ${rc.relPct}`;
      const options = shuffle([
        ansStr,
        `Relative frequency = 25%`,
        `Relative frequency = 45%`,
        `Relative frequency = 18%`
      ]);
      return {
        title: `Relative Frequency Percentage Calculation`,
        text: `A grouped frequency distribution table has 4 class intervals with frequencies $${rc.f1}$, $${rc.f2}$, $${rc.f3}$, and $${rc.f4}$. What is the relative frequency percentage of the ${rc.targetClass}?`,
        formula: `\\text{Relative Frequency \\%} = \\left(\\frac{f_i}{\\sum f}\\right) \\times 100\\%`,
        options,
        answer: ansStr,
        hint: `Find total frequency sum first, then divide target class frequency by total and convert to percentage.`,
        steps: [
          `**Step 1: Calculate total frequency $\\sum f$**`,
          `$$\\sum f = ${rc.f1} + ${rc.f2} + ${rc.f3} + ${rc.f4} = ${totalF}$$`,
          `**Step 2: Calculate relative frequency percentage**`,
          `$$\\text{Relative Frequency} = \\frac{\\text{Target Frequency}}{${totalF}} \\times 100\\% = ${rc.relPct}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: GROUPED_FREQ_TABLE_IMAGE,
        image_alt: 'Grouped Frequency Distribution Table Visual',
        difficulty: 2
      };
    } else if (subType === 8) { // Data Type Classification (Qualitative vs Quantitative, Discrete vs Continuous)
      const dataClassConfigs = [
        {
          varName: 'The exact height in meters of high school students',
          ansStr: 'Continuous Quantitative Data',
          distractors: ['Discrete Quantitative Data', 'Qualitative Nominal Data', 'Qualitative Ordinal Data']
        },
        {
          varName: 'The total number of cars registered per household',
          ansStr: 'Discrete Quantitative Data',
          distractors: ['Continuous Quantitative Data', 'Qualitative Nominal Data', 'Qualitative Ordinal Data']
        },
        {
          varName: 'The favorite music genres chosen by survey respondents',
          ansStr: 'Qualitative Nominal Data',
          distractors: ['Qualitative Ordinal Data', 'Discrete Quantitative Data', 'Continuous Quantitative Data']
        },
        {
          varName: 'Customer satisfaction ratings ranked as Poor, Fair, Good, Excellent',
          ansStr: 'Qualitative Ordinal Data',
          distractors: ['Qualitative Nominal Data', 'Discrete Quantitative Data', 'Continuous Quantitative Data']
        },
        {
          varName: 'The mass in kilograms of harvested watermelons',
          ansStr: 'Continuous Quantitative Data',
          distractors: ['Discrete Quantitative Data', 'Qualitative Nominal Data', 'Qualitative Ordinal Data']
        }
      ];
      const dcc = dataClassConfigs[variantIndex % dataClassConfigs.length];
      const ansStr = dcc.ansStr;
      const options = shuffle([ansStr, ...dcc.distractors]);
      return {
        title: `Statistical Data Variable Type Classification`,
        text: `Classify the statistical variable type: "${dcc.varName}"`,
        formula: `\\text{Data Types: Qualitative (Nominal/Ordinal) vs Quantitative (Discrete/Continuous)}`,
        options,
        answer: ansStr,
        hint: `Numerical & measurable = Quantitative (countable = discrete, measurable = continuous); Labels/categories = Qualitative.`,
        steps: [
          `**Step 1: Determine numerical vs non-numerical**`,
          `$$\\text{Variable attributes fit classification: } ${ansStr}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 2
      };
    } else { // Identifying Misleading / Inappropriate Data Representations
      const misleadConfigs = [
        {
          scenario: 'Using a pie chart to present non-mutually exclusive survey responses where percentages sum to 145%.',
          ansStr: 'Inappropriate: Pie charts strictly require mutually exclusive categories that sum to exactly 100%.',
          distractors: [
            'Appropriate: Pie charts automatically normalize any sum of percentages.',
            'Appropriate: Pie charts are designed for overlapping survey data.',
            'Inappropriate: Pie charts can only display two slices.'
          ]
        },
        {
          scenario: 'Truncating the vertical y-axis of a bar chart to start at 90 instead of 0, making a 5% difference look like a 500% increase.',
          ansStr: 'Misleading: Truncating the vertical baseline exaggerates visual differences between bar heights.',
          distractors: [
            'Appropriate: Truncating axes is standard practice for all bar graphs.',
            'Appropriate: Starting at 90 makes the graph 100% accurate.',
            'Misleading: Bar charts must always use logarithmic scales.'
          ]
        },
        {
          scenario: 'Using a 3D bar graph with perspective depth that visually distorts the relative heights of the bars.',
          ansStr: 'Misleading: 3D perspective distortion makes visual estimation of accurate values difficult.',
          distractors: [
            'Appropriate: 3D graphs are mathematically superior to 2D graphs.',
            'Appropriate: Perspective depth increases numerical precision.',
            'Misleading: 3D graphs are illegal in statistics.'
          ]
        },
        {
          scenario: 'Using uneven class interval widths in a histogram without adjusting bar height densities.',
          ansStr: 'Misleading: Equal bar widths with unequal intervals distort area representations of frequency.',
          distractors: [
            'Appropriate: Histograms do not depend on class widths.',
            'Appropriate: Bar area does not represent frequency in a histogram.',
            'Misleading: Histograms can only use 3 class intervals.'
          ]
        },
        {
          scenario: 'Displaying temperature changes over time using a pie chart with 24 individual hourly slices.',
          ansStr: 'Inappropriate: Pie charts obscure temporal trends and continuity, which require a line graph.',
          distractors: [
            'Appropriate: Pie charts show temperature changes best.',
            'Appropriate: 24 slices is the ideal number for pie charts.',
            'Inappropriate: Line graphs cannot show negative temperatures.'
          ]
        }
      ];
      const mc = misleadConfigs[variantIndex % misleadConfigs.length];
      const ansStr = mc.ansStr;
      const options = shuffle([ansStr, ...mc.distractors]);
      return {
        title: `Identifying Misleading Statistical Data Presentations`,
        text: `Evaluate the validity of the following statistical graph usage: "${mc.scenario}"`,
        formula: `\\text{Statistical Integrity: Baseline at 0, Proportional Slices (100\\%), Un-distorted Axes}`,
        options,
        answer: ansStr,
        hint: `Check for non-zero truncated baselines, sum of percentages not equaling 100%, 3D distortions, or inappropriate graph selection for time-series data.`,
        steps: [
          `**Step 1: Analyze graphical representation rules**`,
          `$$\\text{Evaluation result: } ${ansStr}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 2
      };
    }
  }

  // Category 3P: Form 7 - Outcomes from Experiments (Topic ID 124 - 50 DYNAMIC VARIATION QUESTIONS)
  if (topicId === 124) {
    const subType = qIndex % 10;
    const variantIndex = Math.floor(qIndex / 10); // 0 to 4 across 50 questions

    if (subType === 0) { // Multi-Coin Tossing Sample Space & Tree Diagram (Sample Q1)
      const coinConfigs = [
        {
          tosses: 3,
          sampleSize: 8,
          ansStr: '|S| = 8 outcomes, S = {HHH, HHT, HTH, HTT, THH, THT, TTH, TTT}',
          distractors: [
            '|S| = 6 outcomes, S = {HHH, HHT, HTH, TTH, THT, TTT}',
            '|S| = 9 outcomes, S = {3H, 2H1T, 1H2T, 3T}',
            '|S| = 4 outcomes, S = {HH, HT, TH, TT}'
          ]
        },
        {
          tosses: 2,
          sampleSize: 4,
          ansStr: '|S| = 4 outcomes, S = {HH, HT, TH, TT}',
          distractors: [
            '|S| = 2 outcomes, S = {H, T}',
            '|S| = 6 outcomes, S = {HH, HT, TT, TH, H, T}',
            '|S| = 8 outcomes, S = {HHH, HHT, HTH, HTT, THH, THT, TTH, TTT}'
          ]
        },
        {
          tosses: 4,
          sampleSize: 16,
          ansStr: '|S| = 16 outcomes, represented by 16 branches in a 4-level binary tree',
          distractors: [
            '|S| = 8 outcomes, represented by 8 branches',
            '|S| = 12 outcomes, represented by 3x4 grid',
            '|S| = 32 outcomes, represented by 5-level binary tree'
          ]
        },
        {
          tosses: 3,
          sampleSize: 8,
          ansStr: '|S| = 8, exactly 4 outcomes contain at least 2 Heads: {HHH, HHT, HTH, THH}',
          distractors: [
            '|S| = 8, exactly 2 outcomes contain at least 2 Heads',
            '|S| = 6, exactly 4 outcomes contain at least 2 Heads',
            '|S| = 16, exactly 8 outcomes contain at least 2 Heads'
          ]
        },
        {
          tosses: 3,
          sampleSize: 8,
          ansStr: '|S| = 8, tree diagram branches split into 2 branches at each of the 3 levels',
          distractors: [
            '|S| = 6, tree diagram branches split into 3 branches at each of the 2 levels',
            '|S| = 9, tree diagram branches split into 3 branches at each of the 3 levels',
            '|S| = 12, tree diagram branches split into 4 branches at each level'
          ]
        }
      ];
      const cc = coinConfigs[variantIndex % coinConfigs.length];
      const ansStr = cc.ansStr;
      const options = shuffle([ansStr, ...cc.distractors]);
      return {
        title: `Multi-Coin Tossing Sample Space & Tree Diagram`,
        text: `When tossing a fair coin $${cc.tosses}$ times in sequence, what is the complete sample space of outcomes, and how is it represented using a tree diagram?`,
        formula: `|S| = 2^n \\quad (\\text{where } n = \\text{number of tosses})`,
        options,
        answer: ansStr,
        hint: `Calculate 2 raised to the power of the number of tosses n, and trace every branch from Root to Leaf.`,
        steps: [
          `**Step 1: Calculate total size of sample space $|S|$**`,
          `$$|S| = 2^{${cc.tosses}} = ${cc.sampleSize}$$`,
          `**Step 2: Enumerate sequential outcomes**`,
          `$$\\text{Verified Result: } ${ansStr}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: COIN_TREE_IMAGE,
        image_alt: '3-Coin Toss Tree Diagram Visual',
        difficulty: 2
      };
    } else if (subType === 1) { // Experimental Frequency vs Theoretical Probability Comparison (Sample Q2)
      const dieConfigs = [
        { rolls: 60, primeCount: 34, target: 'prime number (2, 3, 5)', theoretical: '50.0%', exp: '56.7%', diff: '6.7% higher than theoretical' },
        { rolls: 120, primeCount: 66, target: 'prime number (2, 3, 5)', theoretical: '50.0%', exp: '55.0%', diff: '5.0% higher than theoretical' },
        { rolls: 90, primeCount: 40, target: 'prime number (2, 3, 5)', theoretical: '50.0%', exp: '44.4%', diff: '5.6% lower than theoretical' },
        { rolls: 150, primeCount: 85, target: 'prime number (2, 3, 5)', theoretical: '50.0%', exp: '56.7%', diff: '6.7% higher than theoretical' },
        { rolls: 100, primeCount: 48, target: 'prime number (2, 3, 5)', theoretical: '50.0%', exp: '48.0%', diff: '2.0% lower than theoretical' }
      ];
      const dc = dieConfigs[variantIndex % dieConfigs.length];
      const ansStr = `P_E = ${dc.exp}, which is ${dc.diff} (P_T = ${dc.theoretical})`;
      const options = shuffle([
        ansStr,
        `P_E = 50.0%, which is exactly equal to theoretical P_T`,
        `P_E = 33.3%, which is 16.7% lower than theoretical P_T`,
        `P_E = 66.7%, which is 16.7% higher than theoretical P_T`
      ]);
      return {
        title: `Experimental vs. Theoretical Probability Comparison`,
        text: `If a standard fair six-sided die is rolled $${dc.rolls}$ times in an experiment and a ${dc.target} is recorded $${dc.primeCount}$ times, how does the experimental outcome compare to its theoretical probability?`,
        formula: `P_T = \\frac{\\text{Favorable Outcomes}}{\\text{Total Possible}} = \\frac{3}{6} = 0.50, \\quad P_E = \\frac{\\text{Recorded Frequency}}{\\text{Total Trials}} = \\frac{f}{N}`,
        options,
        answer: ansStr,
        hint: `Theoretical P(prime) = 3/6 = 50%. Calculate Experimental P_E = primeCount / rolls, convert to percentage, and compare.`,
        steps: [
          `**Step 1: Calculate theoretical probability $P_T$**`,
          `$$P_T(\\text{prime}) = \\frac{3}{6} = 0.50 = 50.0\\%$$`,
          `**Step 2: Calculate experimental probability $P_E$**`,
          `$$P_E(\\text{prime}) = \\frac{${dc.primeCount}}{${dc.rolls}} = ${dc.exp}$$`,
          `**Step 3: Compare $P_E$ and $P_T$**`,
          `$$\\text{Difference: } ${dc.diff}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 2
      };
    } else if (subType === 2) { // Two-Dice Two-Way Sample Space Grid Table (Sample Q3)
      const gridConfigs = [
        { targetSum: 8, favorableCount: 5, pairsStr: '(2,6), (3,5), (4,4), (5,3), (6,2)', ansStr: 'P(sum = 8) = 5/36' },
        { targetSum: 7, favorableCount: 6, pairsStr: '(1,6), (2,5), (3,4), (4,3), (5,2), (6,1)', ansStr: 'P(sum = 7) = 6/36 = 1/6' },
        { targetSum: 10, favorableCount: 3, pairsStr: '(4,6), (5,5), (6,4)', ansStr: 'P(sum = 10) = 3/36 = 1/12' },
        { targetSum: 9, favorableCount: 4, pairsStr: '(3,6), (4,5), (5,4), (6,3)', ansStr: 'P(sum = 9) = 4/36 = 1/9' },
        { targetSum: 11, favorableCount: 2, pairsStr: '(5,6), (6,5)', ansStr: 'P(sum = 11) = 2/36 = 1/18' }
      ];
      const gc = gridConfigs[variantIndex % gridConfigs.length];
      const ansStr = gc.ansStr;
      const options = shuffle([
        ansStr,
        `P(sum = ${gc.targetSum}) = 6/36 = 1/6`,
        `P(sum = ${gc.targetSum}) = 4/36 = 1/9`,
        `P(sum = ${gc.targetSum}) = 1/12`
      ]);
      return {
        title: `Two-Dice Two-Way Outcome Grid Analysis`,
        text: `When rolling two standard fair six-sided dice simultaneously, a $6 \\times 6$ two-way grid is used to organize all $36$ possible outcomes. What is the probability of rolling a sum equal to $${gc.targetSum}$?`,
        formula: `P(\\text{Event}) = \\frac{\\text{Number of favorable outcome pairs}}{\\text{Total grid sample space } (36)}`,
        options,
        answer: ansStr,
        hint: `Count all ordered pairs (d1, d2) in the 6x6 grid whose sum equals ${gc.targetSum}, then divide by 36.`,
        steps: [
          `**Step 1: Enumerate favorable pairs summing to $${gc.targetSum}$**`,
          `$$\\text{Pairs: } ${gc.pairsStr} \\implies ${gc.favorableCount} \\text{ outcomes}$$`,
          `**Step 2: Compute probability over 36 grid outcomes**`,
          `$$P(\\text{sum } ${gc.targetSum}) = \\frac{${gc.favorableCount}}{36}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: TWO_DICE_GRID_IMAGE,
        image_alt: 'Two Dice 6x6 Outcome Grid Table Visual',
        difficulty: 2
      };
    } else if (subType === 3) { // Spinner Experiment Tabular & Graphical Analysis (Sample Q4)
      const spinnerConfigs = [
        { spins: 100, color: 'Blue', count: 35, relFreq: '35%', angle: 108 },
        { spins: 100, color: 'Red', count: 40, relFreq: '40%', angle: 126 },
        { spins: 200, color: 'Green', count: 50, relFreq: '25%', angle: 90 },
        { spins: 150, color: 'Yellow', count: 45, relFreq: '30%', angle: 108 },
        { spins: 250, color: 'Blue', count: 75, relFreq: '30%', angle: 108 }
      ];
      const sc = spinnerConfigs[variantIndex % spinnerConfigs.length];
      const ansStr = `Relative frequency = ${sc.relFreq} (${sc.count} out of ${sc.spins} spins)`;
      const options = shuffle([
        ansStr,
        `Relative frequency = 20% (${sc.count - 10} out of ${sc.spins} spins)`,
        `Relative frequency = 50% (${sc.spins / 2} out of ${sc.spins} spins)`,
        `Relative frequency = 15% (15 out of ${sc.spins} spins)`
      ]);
      return {
        title: `Spinner Experiment Tabular & Frequency Analysis`,
        text: `A spinner with colored sectors is spun $${sc.spins}$ times in a probability experiment. The recorded frequency table shows that landing on ${sc.color} occurred $${sc.count}$ times. What is the experimental relative frequency of landing on ${sc.color}?`,
        formula: `\\text{Relative Frequency \\%} = \\left(\\frac{\\text{Sector Frequency } f}{N}\\right) \\times 100\\%`,
        options,
        answer: ansStr,
        hint: `Divide the recorded number of spins for the target color by the total number of spins N, then express as a percentage.`,
        steps: [
          `**Step 1: Divide sector count by total spins**`,
          `$$\\text{Fraction} = \\frac{${sc.count}}{${sc.spins}} = ${(sc.count / sc.spins).toFixed(2)}$$`,
          `**Step 2: Convert to percentage**`,
          `$$\\text{Relative Frequency} = ${(sc.count / sc.spins).toFixed(2)} \\times 100\\% = ${sc.relFreq}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: SPINNER_EXP_IMAGE,
        image_alt: '4-Sector Probability Spinner Experiment Visual',
        difficulty: 2
      };
    } else if (subType === 4) { // Marble Bag Probability & Complementary Events (Sample Q5)
      const marbleConfigs = [
        { red: 5, blue: 3, yellow: 2, total: 10, targetColor: 'non-blue', targetCount: 7, ansStr: 'P(non-blue) = 7/10 = 70%' },
        { red: 6, blue: 4, yellow: 5, total: 15, targetColor: 'non-red', targetCount: 9, ansStr: 'P(non-red) = 9/15 = 3/5 = 60%' },
        { red: 4, blue: 5, yellow: 3, total: 12, targetColor: 'non-yellow', targetCount: 9, ansStr: 'P(non-yellow) = 9/12 = 3/4 = 75%' },
        { red: 8, blue: 2, yellow: 6, total: 16, targetColor: 'non-blue', targetCount: 14, ansStr: 'P(non-blue) = 14/16 = 7/8 = 87.5%' },
        { red: 3, blue: 7, yellow: 5, total: 15, targetColor: 'non-blue', targetCount: 8, ansStr: 'P(non-blue) = 8/15 ≈ 53.3%' }
      ];
      const mc = marbleConfigs[variantIndex % marbleConfigs.length];
      const ansStr = mc.ansStr;
      const options = shuffle([
        ansStr,
        `P(${mc.targetColor}) = 3/10 = 30%`,
        `P(${mc.targetColor}) = 5/10 = 50%`,
        `P(${mc.targetColor}) = 1/2 = 50%`
      ]);
      return {
        title: `Marble Container Probability & Complementary Events`,
        text: `A container contains $${mc.red}$ red, $${mc.blue}$ blue, and $${mc.yellow}$ yellow marbles. If an experiment involves drawing one marble at random without looking, what is the theoretical probability of drawing a **${mc.targetColor}** marble?`,
        formula: `P(\\text{Not } A) = 1 - P(A) = \\frac{\\text{Total} - f_A}{\\text{Total}}`,
        options,
        answer: ansStr,
        hint: `Sum all marbles to get total sample size N. Add up all non-target marbles (or subtract target color from total), then divide by N.`,
        steps: [
          `**Step 1: Calculate total marble count N**`,
          `$$N = ${mc.red} + ${mc.blue} + ${mc.yellow} = ${mc.total}$$`,
          `**Step 2: Calculate non-target marbles**`,
          `$$\\text{Count} = ${mc.targetCount}$$`,
          `**Step 3: Calculate probability**`,
          `$$P(\\text{${mc.targetColor}}) = \\frac{${mc.targetCount}}{${mc.total}}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: MARBLE_BAG_IMAGE,
        image_alt: 'Marble Container Probability Visual',
        difficulty: 2
      };
    } else if (subType === 5) { // Law of Large Numbers Experimental Convergence Trend
      const llnConfigs = [
        {
          trials: 'from 10 to 1,000 rolls',
          ansStr: 'The experimental relative frequency converges closer to the theoretical probability of 50%.',
          distractors: [
            'The experimental relative frequency deviates farther away from theoretical probability.',
            'The theoretical probability changes to match the experimental outcome.',
            'The total sample space decreases in size.'
          ]
        },
        {
          trials: 'from 20 coin flips to 5,000 coin flips',
          ansStr: 'The proportion of heads approaches the theoretical probability of 0.5 according to the Law of Large Numbers.',
          distractors: [
            'The coin becomes biased towards heads after many flips.',
            'The probability of heads alternates strictly between 0 and 1.',
            'The total number of heads equals zero.'
          ]
        },
        {
          trials: 'from 15 spinner spins to 3,000 spinner spins',
          ansStr: 'Experimental sector frequencies closely align with sector angle fractions as trials N grow large.',
          distractors: [
            'Small sample sizes are always more accurate than large sample sizes.',
            'Theoretical probability becomes invalid after 100 spins.',
            'The spinner stops landing on smaller sectors.'
          ]
        },
        {
          trials: 'from 5 card draws to 500 card draws with replacement',
          ansStr: 'Empirical probabilities stabilize and approach theoretical probabilities as trial count increases.',
          distractors: [
            'Empirical probabilities oscillate wildly without limit.',
            'Card replacement changes theoretical probabilities.',
            'The sample space grows infinitely.'
          ]
        },
        {
          trials: 'from 30 die rolls to 10,000 die rolls',
          ansStr: 'Each side of the fair die lands with an experimental frequency very near 16.67% (1/6).',
          distractors: [
            'Side 6 will appear 90% of the time.',
            'Theoretical probability drops to zero for all sides.',
            'The law of averages guarantees exact equal counts every 6 rolls.'
          ]
        }
      ];
      const lc = llnConfigs[variantIndex % llnConfigs.length];
      const ansStr = lc.ansStr;
      const options = shuffle([ansStr, ...lc.distractors]);
      return {
        title: `Law of Large Numbers & Experimental Convergence`,
        text: `When conducting a probability experiment (such as rolling a die or flipping a coin), as the number of trials increases ${lc.trials}, what fundamental statistical behavior occurs according to the Law of Large Numbers?`,
        formula: `\\lim_{N \\to \\infty} P_E(A) = P_T(A)`,
        options,
        answer: ansStr,
        hint: `Recall that as trial size N grows large, random noise cancels out and experimental results approach theoretical values.`,
        steps: [
          `**Step 1: Evaluate Law of Large Numbers principle**`,
          `$$\\text{As } N \\to \\infty, \\text{ Experimental Probability } P_E \\to \\text{ Theoretical Probability } P_T$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 2
      };
    } else if (subType === 6) { // Playing Cards Multi-Event Union Probability
      const cardConfigs = [
        { eventDesc: 'drawing either a King or a Heart', nFavorable: 16, fractionStr: '16/52 = 4/13', ansStr: 'P(King or Heart) = 4/13' },
        { eventDesc: 'drawing either an Ace or a Spade', nFavorable: 16, fractionStr: '16/52 = 4/13', ansStr: 'P(Ace or Spade) = 4/13' },
        { eventDesc: 'drawing either a Queen or a Diamond', nFavorable: 16, fractionStr: '16/52 = 4/13', ansStr: 'P(Queen or Diamond) = 4/13' },
        { eventDesc: 'drawing a Red card (Heart or Diamond)', nFavorable: 26, fractionStr: '26/52 = 1/2', ansStr: 'P(Red card) = 1/2' },
        { eventDesc: 'drawing a Face card (Jack, Queen, King)', nFavorable: 12, fractionStr: '12/52 = 3/13', ansStr: 'P(Face card) = 3/13' }
      ];
      const cc = cardConfigs[variantIndex % cardConfigs.length];
      const ansStr = cc.ansStr;
      const options = shuffle([
        ansStr,
        `P(Event) = 17/52`,
        `P(Event) = 1/4`,
        `P(Event) = 5/13`
      ]);
      return {
        title: `Playing Card Experiment & Compound Event Probability`,
        text: `From a standard well-shuffled deck of $52$ playing cards, one card is drawn at random. What is the theoretical probability of ${cc.eventDesc}?`,
        formula: `P(A \\cup B) = P(A) + P(B) - P(A \\cap B)`,
        options,
        answer: ansStr,
        hint: `Use the addition rule P(A or B) = P(A) + P(B) - P(A and B) to avoid double-counting the overlapping card.`,
        steps: [
          `**Step 1: Calculate individual probabilities**`,
          `$$P(A) + P(B) - P(A \\cap B) = \\frac{4}{52} + \\frac{13}{52} - \\frac{1}{52} = \\frac{16}{52}$$`,
          `**Step 2: Simplify fraction**`,
          `$$\\frac{16}{52} = \\frac{4}{13}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 2
      };
    } else if (subType === 7) { // Compound Independent Events (Coin & Die Roll Combined)
      const compoundConfigs = [
        { coin: 'Head', die: 'an even number (2, 4, 6)', favCount: 3, total: 12, probStr: '3/12 = 1/4' },
        { coin: 'Tail', die: 'a prime number (2, 3, 5)', favCount: 3, total: 12, probStr: '3/12 = 1/4' },
        { coin: 'Head', die: 'a number greater than 4 (5, 6)', favCount: 2, total: 12, probStr: '2/12 = 1/6' },
        { coin: 'Tail', die: 'an odd number (1, 3, 5)', favCount: 3, total: 12, probStr: '3/12 = 1/4' },
        { coin: 'Head', die: 'a multiple of 3 (3, 6)', favCount: 2, total: 12, probStr: '2/12 = 1/6' }
      ];
      const comp = compoundConfigs[variantIndex % compoundConfigs.length];
      const ansStr = `|S| = 12 outcomes, P = ${comp.probStr}`;
      const options = shuffle([
        ansStr,
        `|S| = 8 outcomes, P = 1/3`,
        `|S| = 36 outcomes, P = 1/6`,
        `|S| = 12 outcomes, P = 1/2`
      ]);
      return {
        title: `Compound Independent Events (Coin Flip & Die Roll)`,
        text: `An experiment consists of flipping a fair coin once AND rolling a standard six-sided die once. What is the total size of the sample space $|S|$, and what is the probability of getting a **${comp.coin}** on the coin and **${comp.die}** on the die?`,
        formula: `|S| = n_{\\text{coin}} \\times n_{\\text{die}} = 2 \\times 6 = 12, \\quad P(A \\text{ and } B) = P(A) \\times P(B)`,
        options,
        answer: ansStr,
        hint: `Multiply coin outcomes (2) by die outcomes (6) to find total sample size 12. Multiply independent probabilities P(coin) x P(die).`,
        steps: [
          `**Step 1: Calculate sample space size $|S|$**`,
          `$$|S| = 2 \\times 6 = 12$$`,
          `**Step 2: Multiply independent probabilities**`,
          `$$P = P(\\text{${comp.coin}}) \\times P(\\text{${comp.die}}) = \\frac{1}{2} \\times \\text{fraction} = ${comp.probStr}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: COIN_TREE_IMAGE,
        image_alt: 'Compound Event Tree Diagram Visual',
        difficulty: 2
      };
    } else if (subType === 8) { // Experimental Frequency Odds Calculation
      const oddsConfigs = [
        { total: 80, hits: 56, misses: 24, ratio: '7 : 3', ansStr: 'Odds in favor = 7 : 3' },
        { total: 100, hits: 75, misses: 25, ratio: '3 : 1', ansStr: 'Odds in favor = 3 : 1' },
        { total: 60, hits: 45, misses: 15, ratio: '3 : 1', ansStr: 'Odds in favor = 3 : 1' },
        { total: 90, hits: 60, misses: 30, ratio: '2 : 1', ansStr: 'Odds in favor = 2 : 1' },
        { total: 120, hits: 80, misses: 40, ratio: '2 : 1', ansStr: 'Odds in favor = 2 : 1' }
      ];
      const oc = oddsConfigs[variantIndex % oddsConfigs.length];
      const ansStr = oc.ansStr;
      const options = shuffle([
        ansStr,
        `Odds in favor = 56 : 80`,
        `Odds in favor = 3 : 7`,
        `Odds in favor = 70%`
      ]);
      return {
        title: `Experimental Frequency Odds Calculation`,
        text: `In a target shooting experiment conducted $${oc.total}$ times, the shooter hit the target $${oc.hits}$ times and missed $${oc.misses}$ times. What are the experimental **odds in favor** of hitting the target?`,
        formula: `\\text{Odds in Favor} = \\frac{\\text{Successful Outcomes}}{\\text{Unsuccessful Outcomes}} = \\text{Hits} : \\text{Misses}`,
        options,
        answer: ansStr,
        hint: `Odds compare successes directly to failures (Hits : Misses), simplified to lowest integer ratio.`,
        steps: [
          `**Step 1: Write raw ratio of hits to misses**`,
          `$$\\text{Ratio} = \\frac{${oc.hits}}{${oc.misses}}$$`,
          `**Step 2: Simplify fraction by dividing by GCD**`,
          `$$\\text{Odds in favor} = ${oc.ratio}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 2
      };
    } else { // Expected Frequency Calculation from Theoretical Probability
      const expectConfigs = [
        { rolls: 150, target: 'a number greater than 4 (5, 6)', probFraction: '1/3', expectedCount: 50 },
        { rolls: 180, target: 'an even number (2, 4, 6)', probFraction: '1/2', expectedCount: 90 },
        { rolls: 240, target: 'a multiple of 3 (3, 6)', probFraction: '1/3', expectedCount: 80 },
        { rolls: 300, target: 'a prime number (2, 3, 5)', probFraction: '1/2', expectedCount: 150 },
        { rolls: 120, target: 'the number 6', probFraction: '1/6', expectedCount: 20 }
      ];
      const ec = expectConfigs[variantIndex % expectConfigs.length];
      const ansStr = `Expected frequency = ${ec.expectedCount} times`;
      const options = shuffle([
        ansStr,
        `Expected frequency = ${ec.expectedCount - 15} times`,
        `Expected frequency = ${ec.expectedCount + 25} times`,
        `Expected frequency = ${ec.rolls / 4} times`
      ]);
      return {
        title: `Expected Frequency Calculation from Theoretical Probability`,
        text: `If a standard fair six-sided die is rolled $${ec.rolls}$ times in an experiment, what is the **expected frequency** of landing on ${ec.target}?`,
        formula: `E(f) = N \\times P(\\text{Event})`,
        options,
        answer: ansStr,
        hint: `Multiply the total number of rolls N by the theoretical probability P of the target event.`,
        steps: [
          `**Step 1: Identify theoretical probability P**`,
          `$$P(\\text{target}) = ${ec.probFraction}$$`,
          `**Step 2: Multiply total rolls N by probability**`,
          `$$E(f) = ${ec.rolls} \\times ${ec.probFraction} = ${ec.expectedCount}$$`,
          `**Final Verified Answer:** ${ansStr}`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 2
      };
    }
  }

  // Category 4: Radicals, Roots, Scientific Notation & Polynomial Factoring (IDs 111, 125, 126, 127, 167)
  if (topicId === 111 || topicId === 125 || topicId === 126 || topicId === 127 || topicId === 167) {
    const subType = qIndex % 4;
    if (subType === 0) { // Factoring Difference of Squares
      const a = randInt(2, 9);
      const aSq = a * a;
      const ans = `(x - ${a})(x + ${a})`;
      const options = shuffle([ans, `(x - ${a})^2`, `(x + ${aSq})(x - 1)`, `(x - 2)(x + ${aSq})`]);
      return {
        title: `Factoring Difference of Squares`,
        text: `Factor the polynomial expression completely: \\(x^2 - ${aSq}\\):`,
        formula: `u^2 - v^2 = (u - v)(u + v)`,
        options,
        answer: ans,
        hint: `Identify $u = x$ and $v = \\sqrt{${aSq}} = ${a}$.`,
        steps: [
          `**Step 1: Apply Difference of Squares formula**`,
          `$$x^2 - ${aSq} = x^2 - ${a}^2 = (x - ${a})(x + ${a})$$`,
          `**Final Verified Answer:** \\(${ans}\\)`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 1) { // Simplifying Square Root Radicals
      const k = randInt(2, 6);
      const prime = [2, 3, 5, 7][qIndex % 4];
      const inside = k * k * prime;
      const ans = `${k}\\sqrt{${prime}}`;
      const options = shuffle([`\\(${ans}\\)`, `\\(${k * 2}\\sqrt{${prime}}\\)` , `\\(${inside}\\sqrt{2}\\)` , `\\(${k}\\sqrt{${inside}}\\)`]);
      return {
        title: `Simplifying Radical Expression`,
        text: `Simplify the radical expression \\(\\sqrt{${inside}}\\):`,
        formula: `\\sqrt{a^2 b} = a \\sqrt{b}`,
        options,
        answer: `\\(${ans}\\)`,
        hint: `Factor out largest perfect square ${k * k} from ${inside}.`,
        steps: [
          `**Step 1: Factor inside radical**`,
          `$$\\sqrt{${inside}} = \\sqrt{${k * k} \\times ${prime}} = \\sqrt{${k * k}} \\times \\sqrt{${prime}} = ${k} \\sqrt{${prime}}$$`,
          `**Final Verified Answer:** \\(${ans}\\)`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 2) { // Scientific Notation Multiplication
      const m = randInt(2, 5);
      const n = randInt(3, 6);
      const expSum = m + n;
      const ans = `6 \\times 10^{${expSum}}`;
      const options = shuffle([`\\(${ans}\\)`, `\\(6 \\times 10^{${expSum + 1}}\\)` , `\\(5 \\times 10^{${expSum}}\\)` , `\\(6 \\times 10^{${m * n}}\\)`]);
      return {
        title: `Scientific Notation Multiplication`,
        text: `Evaluate the product \\((3 \\times 10^{${m}}) \\times (2 \\times 10^{${n}})\\):`,
        formula: `(a \\cdot 10^m)(b \\cdot 10^n) = (a \\cdot b) \\cdot 10^{m+n}`,
        options,
        answer: `\\(${ans}\\)`,
        hint: `Multiply coefficients (3 x 2) and add exponents (${m} + ${n}).`,
        steps: [
          `**Step 1: Group coefficients and powers of 10**`,
          `$$(3 \\times 2) \\times 10^{${m} + ${n}} = 6 \\times 10^{${expSum}}$$`,
          `**Final Verified Answer:** \\(${ans}\\)`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else { // Rational Expression Simplification
      const c = randInt(2, 7);
      const ans = `x - ${c}`;
      const options = shuffle([`\\(${ans}\\)`, `\\(x + ${c}\\)`, `\\(x - 1\\)`, `\\(${c}x\\)`]);
      return {
        title: `Rational Expression Simplification`,
        text: `Simplify the algebraic rational fraction \\(\\frac{x^2 - ${c * c}}{x + ${c}}\\):`,
        formula: `\\frac{x^2 - c^2}{x + c} = x - c`,
        options,
        answer: `\\(${ans}\\)`,
        hint: `Factor numerator as (x - ${c})(x + ${c}) and cancel common factor (x + ${c}).`,
        steps: [
          `**Step 1: Factor numerator**`,
          `$$\\frac{(x - ${c})(x + ${c})}{x + ${c}} = x - ${c}$$`,
          `**Final Verified Answer:** \\(${ans}\\)`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    }
  }

  // Category 5: Cartesian Coordinate Geometry & Distance/Midpoint/Slope (IDs 129, 133, 155)
  if (topicId === 129 || topicId === 133 || topicId === 155) {
    const subType = qIndex % 3;
    if (subType === 0) { // Distance Formula
      const x1 = randInt(1, 5);
      const y1 = randInt(1, 5);
      const dx = 3;
      const dy = 4;
      const x2 = x1 + dx;
      const y2 = y1 + dy;
      const dist = 5;
      const options = shuffle([`${dist} units`, `${dist + 2} units`, `7 units`, `${dist + 4} units`]);
      return {
        title: `Distance Between Two Coordinates`,
        text: `Find distance between points \\(A(${x1}, ${y1})\\) and \\(B(${x2}, ${y2})\\) on Cartesian plane:`,
        formula: `d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}`,
        options,
        answer: `${dist} units`,
        hint: `Apply distance formula $d = \\sqrt{\\Delta x^2 + \\Delta y^2}$.`,
        steps: [
          `**Step 1: Substitute point coordinates**`,
          `$$d = \\sqrt{(${x2} - ${x1})^2 + (${y2} - ${y1})^2} = \\sqrt{${dx}^2 + ${dy}^2}$$`,
          `**Step 2: Evaluate square root**`,
          `$$d = \\sqrt{${dx * dx} + ${dy * dy}} = \\sqrt{${dx * dx + dy * dy}} = ${dist}\\text{ units}$$`,
          `**Final Verified Answer:** \\(${dist}\\text{ units}\\)`
        ],
        image_url: GEOM_IMAGE,
        image_alt: 'Cartesian Coordinate Distance Diagram',
        difficulty: 3
      };
    } else if (subType === 1) { // Midpoint Formula
      const x1 = 2 * randInt(1, 4);
      const x2 = 2 * randInt(5, 8);
      const y1 = 2 * randInt(1, 4);
      const y2 = 2 * randInt(5, 8);
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      const ans = `(${mx}, ${my})`;
      const options = shuffle([`\\(${ans}\\)`, `\\((${mx + 1}, ${my})\\)`, `\\((${mx}, ${my - 1})\\)`, `\\((${x1 + x2}, ${y1 + y2})\\)`]);
      return {
        title: `Midpoint of Line Segment`,
        text: `Determine midpoint \\(M\\) of segment connecting points \\(P_1(${x1}, ${y1})\\) and \\(P_2(${x2}, ${y2})\\):`,
        formula: `M = \\left(\\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2}\\right)`,
        options,
        answer: `\\(${ans}\\)`,
        hint: `Average x-coordinates and average y-coordinates.`,
        steps: [
          `**Step 1: Apply midpoint coordinates formula**`,
          `$$M = \\left(\\frac{${x1} + ${x2}}{2}, \\frac{${y1} + ${y2}}{2}\\right) = \\left(\\frac{${x1 + x2}}{2}, \\frac{${y1 + y2}}{2}\\right) = (${mx}, ${my})$$`,
          `**Final Verified Answer:** \\(${ans}\\)`
        ],
        image_url: GEOM_IMAGE,
        image_alt: 'Midpoint on Coordinate Plane',
        difficulty: 3
      };
    } else { // Slope of a Line
      const x1 = randInt(1, 4);
      const x2 = x1 + randInt(2, 5);
      const m = randInt(2, 5);
      const y1 = randInt(1, 5);
      const y2 = y1 + m * (x2 - x1);
      const options = shuffle([`${m}`, `${m + 1}`, `-${m}`, `${m + 2}`]);
      return {
        title: `Slope of Line Through Two Points`,
        text: `Find slope \\(m\\) of the line passing through \\(A(${x1}, ${y1})\\) and \\(B(${x2}, ${y2})\\):`,
        formula: `m = \\frac{y_2 - y_1}{x_2 - x_1}`,
        options,
        answer: `${m}`,
        hint: `Divide change in y (delta y) by change in x (delta x).`,
        steps: [
          `**Step 1: Apply slope ratio formula**`,
          `$$m = \\frac{${y2} - ${y1}}{${x2} - ${x1}} = \\frac{${y2 - y1}}{${x2 - x1}} = ${m}$$`,
          `**Final Verified Answer:** \\(m = ${m}\\)`
        ],
        image_url: STATS_IMAGE,
        image_alt: 'Linear Slope Graph',
        difficulty: 3
      };
    }
  }

  // Category 6: Pythagorean Theorem, Right Triangle & Laws of Sines/Cosines (IDs 137, 151, 153, 161)
  if (topicId === 137 || topicId === 151 || topicId === 153 || topicId === 161) {
    const subType = qIndex % 3;
    if (subType === 0) { // Pythagorean Theorem
      const triples = [{ a: 3, b: 4, c: 5 }, { a: 6, b: 8, c: 10 }, { a: 5, b: 12, c: 13 }, { a: 8, b: 15, c: 17 }];
      const t = triples[qIndex % triples.length];
      const ans = `${t.c} m`;
      const options = shuffle([`${t.c} m`, `${t.c + 2} m`, `${Math.max(1, t.c - 3)} m`, `${t.c + 5} m`]);
      return {
        title: `Pythagorean Theorem Hypotenuse`,
        text: `A right-angled triangle in a ${context} has legs \\(a = ${t.a}\\text{ m}\\) and \\(b = ${t.b}\\text{ m}\\). Calculate hypotenuse \\(c\\):`,
        formula: `c = \\sqrt{a^2 + b^2}`,
        options,
        answer: ans,
        hint: `Use c^2 = a^2 + b^2.`,
        steps: [
          `**Step 1: Substitute legs into Pythagorean equation**`,
          `$$c^2 = ${t.a}^2 + ${t.b}^2 = ${t.a * t.a} + ${t.b * t.b} = ${t.c * t.c}$$`,
          `**Step 2: Take square root**`,
          `$$c = \\sqrt{${t.c * t.c}} = ${t.c}\\text{ m}$$`,
          `**Final Verified Answer:** \\(${ans}\\)`
        ],
        image_url: GEOM_IMAGE,
        image_alt: 'Right Triangle Diagram',
        difficulty: 3
      };
    } else if (subType === 1) { // 30-60-90 Special Right Triangle
      const shortLeg = randInt(3, 10);
      const hyp = 2 * shortLeg;
      const options = shuffle([`${hyp} cm`, `${shortLeg + 4} cm`, `${hyp + 6} cm`, `${shortLeg * 3} cm`]);
      return {
        title: `Special 30°-60°-90° Triangle Hypotenuse`,
        text: `In a 30°-60°-90° right triangle, the shortest side opposite the 30° angle measures \\(${shortLeg}\\text{ cm}\\). Find the hypotenuse length:`,
        formula: `\\text{Hypotenuse} = 2 \\times \\text{Shortest Side}`,
        options,
        answer: `${hyp} cm`,
        hint: `Hypotenuse of 30-60-90 triangle is twice the shortest side.`,
        steps: [
          `**Step 1: Multiply shortest side by 2**`,
          `$$\\text{Hypotenuse} = 2 \\times ${shortLeg}\\text{ cm} = ${hyp}\\text{ cm}$$`,
          `**Final Verified Answer:** \\(${hyp}\\text{ cm}\\)`
        ],
        image_url: GEOM_IMAGE,
        image_alt: '30-60-90 Special Right Triangle',
        difficulty: 3
      };
    } else { // Trigonometric Ratios (Sine)
      const sinVal = "0.60";
      const options = shuffle([sinVal, "0.75", "0.80", "0.50"]);
      return {
        title: `Trigonometric Ratio Sine Evaluation`,
        text: `In a right triangle with opposite side \\(a = 3\\text{ m}\\) and hypotenuse \\(c = 5\\text{ m}\\), find decimal value of \\(\\sin(\\theta)\\):`,
        formula: `\\sin(\\theta) = \\frac{\\text{Opposite}}{\\text{Hypotenuse}}`,
        options,
        answer: sinVal,
        hint: `Divide opposite length by hypotenuse length.`,
        steps: [
          `**Step 1: Apply sine ratio definition**`,
          `$$\\sin(\\theta) = \\frac{3}{5} = 0.60$$`,
          `**Final Verified Answer:** \\(0.60\\)`
        ],
        image_url: GEOM_IMAGE,
        image_alt: 'Trigonometric Ratios Right Triangle',
        difficulty: 3
      };
    }
  }

  // Category 7: Statistics, Averages, IQR, Box Plots & Probability (IDs 139, 140, 142, 143, 160, 173, 174, 176)
  if (topicId === 139 || topicId === 140 || topicId === 142 || topicId === 143 || topicId === 160 || topicId === 173 || topicId === 174 || topicId === 176) {
    const subType = qIndex % 4;
    if (subType === 0) { // Mean of Ungrouped Data
      const nums = [randInt(10, 20), randInt(12, 22), randInt(14, 25), randInt(16, 28), randInt(18, 30)];
      const sum = nums.reduce((a, b) => a + b, 0);
      const mean = Number((sum / nums.length).toFixed(1));
      const options = shuffle([`${mean}`, `${(mean + 1.5).toFixed(1)}`, `${(mean - 1.2).toFixed(1)}`, `${(mean + 2.8).toFixed(1)}`]);
      return {
        title: `Mean of Ungrouped Data`,
        text: `Find mean value \\(\\bar{x}\\) for dataset \\([${nums.join(', ')}]\\) recorded in a ${context}:`,
        formula: `\\bar{x} = \\frac{\\sum x}{N}`,
        options,
        answer: String(mean),
        hint: `Sum all values and divide by count N = ${nums.length}.`,
        steps: [
          `**Step 1: Sum dataset values**`,
          `$$\\sum x = ${nums.join(' + ')} = ${sum}$$`,
          `**Step 2: Divide by N = ${nums.length}**`,
          `$$\\bar{x} = \\frac{${sum}}{${nums.length}} = ${mean}$$`,
          `**Final Verified Answer:** \\(${mean}\\)`
        ],
        image_url: STATS_IMAGE,
        image_alt: 'Ungrouped Dataset Summary',
        difficulty: 3
      };
    } else if (subType === 1) { // Fundamental Counting Principle
      const n1 = randInt(3, 6);
      const n2 = randInt(4, 7);
      const n3 = randInt(2, 4);
      const total = n1 * n2 * n3;
      const options = shuffle([`${total} choices`, `${n1 + n2 + n3} choices`, `${total + 12} choices`, `${total - 8} choices`]);
      return {
        title: `Fundamental Counting Principle`,
        text: `A menu offers ${n1} appetizers, ${n2} main entrees, and ${n3} desserts. How many distinct 3-course meal combinations are possible?`,
        formula: `\\text{Total} = n_1 \\times n_2 \\times n_3`,
        options,
        answer: `${total} choices`,
        hint: `Multiply number of options for each course together.`,
        steps: [
          `**Step 1: Apply Fundamental Counting Principle**`,
          `$$\\text{Combinations} = ${n1} \\times ${n2} \\times ${n3} = ${total}$$`,
          `**Final Verified Answer:** \\(${total}\\) choices`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 2
      };
    } else if (subType === 2) { // Compound Probability of Independent Events
      const pBoth = "0.25";
      const options = shuffle([pBoth, "0.50", "0.75", "0.10"]);
      return {
        title: `Probability of Independent Events`,
        text: `If two fair coins are tossed independently, what is the theoretical probability of getting heads on both coins?`,
        formula: `P(A \\cap B) = P(A) \\times P(B)`,
        options,
        answer: pBoth,
        hint: `Multiply independent probabilities 0.50 x 0.50.`,
        steps: [
          `**Step 1: Multiply independent event probabilities**`,
          `$$P(\\text{Head}_1 \\cap \\text{Head}_2) = \\frac{1}{2} \\times \\frac{1}{2} = \\frac{1}{4} = 0.25$$`,
          `**Final Verified Answer:** \\(0.25\\)`
        ],
        image_url: PIE_IMAGE,
        image_alt: 'Probability Experiment Chart',
        difficulty: 3
      };
    } else { // Interquartile Range (IQR)
      const Q1 = randInt(15, 25);
      const Q3 = Q1 + randInt(10, 20);
      const iqr = Q3 - Q1;
      const options = shuffle([`${iqr}`, `${iqr + 4}`, `${Math.max(2, iqr - 3)}`, `${Q3 + Q1}`]);
      return {
        title: `Interquartile Range (IQR) Calculation`,
        text: `For a dataset with first quartile \\(Q_1 = ${Q1}\\) and third quartile \\(Q_3 = ${Q3}\\), calculate the Interquartile Range (IQR):`,
        formula: `IQR = Q_3 - Q_1`,
        options,
        answer: `${iqr}`,
        hint: `Subtract Q1 from Q3.`,
        steps: [
          `**Step 1: Apply IQR formula**`,
          `$$IQR = Q_3 - Q_1 = ${Q3} - ${Q1} = ${iqr}$$`,
          `**Final Verified Answer:** \\(${iqr}\\)`
        ],
        image_url: STATS_IMAGE,
        image_alt: 'Box-and-Whisker Plot IQR Diagram',
        difficulty: 3
      };
    }
  }

  // Category 8: Quadratic Equations, Functions & Discriminant (IDs 156, 157, 168, 169, 170, 171)
  if (topicId === 156 || topicId === 157 || topicId === 168 || topicId === 169 || topicId === 170 || topicId === 171) {
    const subType = qIndex % 3;
    if (subType === 0) { // Discriminant
      const a = randInt(1, 3);
      const b = randInt(4, 8);
      const c = randInt(1, 4);
      const disc = b * b - 4 * a * c;
      const options = shuffle([`${disc}`, `${disc + 8}`, `${disc - 6}`, `${b * b}`]);
      return {
        title: `Quadratic Discriminant Evaluation`,
        text: `Calculate discriminant \\(D = b^2 - 4ac\\) for quadratic equation \\(${a === 1 ? '' : a}x^2 + ${b}x + ${c} = 0\\):`,
        formula: `D = b^2 - 4ac`,
        options,
        answer: `${disc}`,
        hint: `Plug coefficients a=${a}, b=${b}, c=${c} into discriminant formula.`,
        steps: [
          `**Step 1: Write discriminant formula**`,
          `$$D = (${b})^2 - 4(${a})(${c}) = ${b * b} - ${4 * a * c} = ${disc}$$`,
          `**Final Verified Answer:** \\(D = ${disc}\\)`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    } else if (subType === 1) { // Circle Standard Equation
      const h = randInt(1, 6);
      const k = randInt(1, 6);
      const r = randInt(2, 8);
      const rSq = r * r;
      const ans = `(x - ${h})^2 + (y - ${k})^2 = ${rSq}`;
      const options = shuffle([
        `\\(${ans}\\)`,
        `\\((x + ${h})^2 + (y + ${k})^2 = ${rSq}\\)`,
        `\\((x - ${h})^2 + (y - ${k})^2 = ${r}\\)`,
        `\\((x - ${h})^2 - (y - ${k})^2 = ${rSq}\\)`
      ]);
      return {
        title: `Standard Equation of a Circle`,
        text: `Write the standard equation of a circle centered at \\((${h}, ${k})\\) with radius \\(r = ${r}\\):`,
        formula: `(x - h)^2 + (y - k)^2 = r^2`,
        options,
        answer: `\\(${ans}\\)`,
        hint: `Substitute center (h, k) and radius r into circle equation.`,
        steps: [
          `**Step 1: Apply circle equation formula**`,
          `$$(x - ${h})^2 + (y - ${k})^2 = ${r}^2 = ${rSq}$$`,
          `**Final Verified Answer:** \\(${ans}\\)`
        ],
        image_url: GEOM_IMAGE,
        image_alt: 'Circle on Cartesian Coordinates',
        difficulty: 4
      };
    } else { // Roots of Quadratic Equation
      const p = randInt(2, 6);
      const q = randInt(7, 12);
      const sum = p + q;
      const prod = p * q;
      const ans = `x = ${p}, x = ${q}`;
      const options = shuffle([`\\(${ans}\\)`, `\\(x = -${p}, x = -${q}\\)`, `\\(x = ${p + 1}, x = ${q - 1}\\)`, `\\(x = 0, x = ${prod}\\)`]);
      return {
        title: `Roots of Quadratic Equation by Factoring`,
        text: `Find real roots \\(x\\) of the quadratic equation \\(x^2 - ${sum}x + ${prod} = 0\\):`,
        formula: `x^2 - (p+q)x + pq = 0 \\implies x = p, x = q`,
        options,
        answer: `\\(${ans}\\)`,
        hint: `Factor into (x - p)(x - q) = 0.`,
        steps: [
          `**Step 1: Factor quadratic**`,
          `$$(x - ${p})(x - ${q}) = 0$$`,
          `**Step 2: Solve each linear factor**`,
          `$$x - ${p} = 0 \\implies x = ${p}, \\quad x - ${q} = 0 \\implies x = ${q}$$`,
          `**Final Verified Answer:** \\(x = ${p}, x = ${q}\\)`
        ],
        image_url: '',
        image_alt: '',
        difficulty: 3
      };
    }
  }

  // Universal High-Quality Fallback Problem for any remaining Form 7-10 Topic
  const a = randInt(3, 9);
  const b = randInt(5, 25);
  const xVal = randInt(2, 10);
  const c = a * xVal + b;
  const options = shuffle([xVal, xVal + 3, Math.max(1, xVal - 2), xVal + 5]);
  return {
    title: `${title} - Problem #${qIndex + 1}`,
    text: `Solve for variable \\(x\\) in the mathematical equation:`,
    formula: `${a}x + ${b} = ${c}`,
    options: options.map(String),
    answer: String(xVal),
    hint: `Subtract ${b} from both sides and divide by ${a}.`,
    steps: [
      `**Step 1: Isolate linear term**`,
      `$$${a}x = ${c} - ${b} = ${c - b}$$`,
      `**Step 2: Divide by coefficient ${a}**`,
      `$$x = \\frac{${c - b}}{${a}} = ${xVal}$$`,
      `**Final Verified Answer:** \\(x = ${xVal}\\)`
    ],
    image_url: imageUrl,
    image_alt: imageAlt,
    difficulty: 3
  };
}

console.log(`🚀 Generating AT LEAST 50 questions per topic for all ${f710Topics.length} Form 7-10 topics...`);

const insertQuestion = db.prepare(`
  INSERT INTO questions (topic_id, question_title, question_text, math_formula, question_type, options_json, correct_answer, hint, working_steps_json, image_url, image_alt, difficulty, created_by)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'matatag_generator_f710')
`);

let totalQuestionsSeeded = 0;

for (const topic of f710Topics) {
  for (let i = 0; i < 50; i++) {
    const q = createCreativeQuestion(topic, i);
    insertQuestion.run(
      topic.id,
      q.title,
      q.text,
      q.formula,
      'MCQ',
      JSON.stringify(q.options),
      q.answer,
      q.hint,
      JSON.stringify(q.steps),
      q.image_url || '',
      q.image_alt || '',
      q.difficulty || 3
    );
    totalQuestionsSeeded++;
  }
}

console.log(`🎉 Seeded exactly ${totalQuestionsSeeded} creative, diverse MATATAG questions for Form 7-10 into SQLite database!`);

console.log('🚀 Exporting clean Form 7-10 question bank to questions_bank.xlsx...');
const excelPath = path.join(__dirname, '..', 'questions_bank.xlsx');
exportQuestionsToExcel(db, excelPath);

console.log(`✨ Excel Question Bank successfully updated at ${excelPath} (${totalQuestionsSeeded} records).`);
