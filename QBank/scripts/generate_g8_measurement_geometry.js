import { initDb } from '../server/db.js';
import { exportQuestionsToExcel } from '../server/excelService.js';
import { generateTopic136Svg } from './generate_t136_svg_plots.js';
import { generateTopic137Svg } from './generate_t137_svg_plots.js';
import { generateTopic138Svg } from './generate_t138_svg_plots.js';
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

function makeOptions(correct, wrong1, wrong2, wrong3) {
  const set = new Set([correct]);
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

export function generateGrade8MeasurementGeometryQuestions() {
  console.log('🚀 Generating 150 Grade 8 Measurement & Geometry Questions (Topics 136 to 138)...');

  const topicIds = [136, 137, 138];

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
      const qNum = qIndex + 1;

      // ==========================================
      // TOPIC 136 (T12): Volume of Pyramids, Cones, and Spheres
      // ==========================================
      if (topicId === 136) {
        const imgFileName = `g8_t136_q${qNum}.svg`;
        const imgPathPublic = path.join(__dirname, '..', 'public', 'images', imgFileName);
        const imgPathRoot = path.join(__dirname, '..', 'images', imgFileName);
        let svgParams = {};
        let imgAltText = '';

        if (subType === 0) { // Triangular Pyramid
          const a = 6 + (qIndex % 4), b = 8 + (qIndex % 3), h = 15;
          const baseArea = 0.5 * a * b;
          const vol = (1/3) * baseArea * h;
          const ans = `${vol} cm³`;
          const text = `Calculate the volume of a triangular pyramid whose base is a right triangle with legs measuring ${a} cm and ${b} cm, and whose pyramid height is ${h} cm.`;
          const formula = `V = \\frac{1}{3} B h = \\frac{1}{3} \\left(\\frac{1}{2} a b\\right) h`;
          const options = makeOptions(ans, `${vol * 3} cm³`, `${vol / 2} cm³`, `${vol + 24} cm³`);
          svgParams = { title: `Triangular Pyramid Volume #${qNum}`, a, b, h };
          imgAltText = `3D diagram of a triangular pyramid with right-triangle base legs ${a} cm, ${b} cm and height ${h} cm`;
          qObj = {
            title: `Triangular Pyramid Volume #${qNum}`,
            text, formula, options, answer: ans,
            hint: `Base area B = 1/2 * ${a} * ${b} = ${baseArea} cm². Volume V = 1/3 * B * h = 1/3 * ${baseArea} * ${h}.`,
            steps: [
              `**Step 1: Compute base area B**`,
              `$$B = \\frac{1}{2} \\times ${a} \\times ${b} = ${baseArea}\\text{ cm}^2$$`,
              `**Step 2: Compute pyramid volume V**`,
              `$$V = \\frac{1}{3} \\times ${baseArea} \\times ${h} = ${vol}\\text{ cm}^3$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 2
          };
        } else if (subType === 1) { // Hexagonal Pyramid
          const area = 42 + (qIndex % 5) * 6, h = 10;
          const vol = (1/3) * area * h;
          const ans = `${vol} cm³`;
          const text = `A pyramid has a regular hexagonal base with an area of ${area} cm² and a vertical height of ${h} cm. Find its volume.`;
          const formula = `V = \\frac{1}{3} B h`;
          const options = makeOptions(ans, `${area * h} cm³`, `${(vol / 2).toFixed(1)} cm³`, `${vol + 30} cm³`);
          svgParams = { title: `Hexagonal Pyramid Volume #${qNum}`, area, h };
          imgAltText = `3D wireframe diagram of a regular hexagonal pyramid with base area ${area} cm² and height ${h} cm`;
          qObj = {
            title: `Hexagonal Pyramid Volume #${qNum}`,
            text, formula, options, answer: ans,
            hint: `Volume V = 1/3 * Base Area * height = 1/3 * ${area} * ${h}.`,
            steps: [
              `**Step 1: Apply pyramid volume formula**`,
              `$$V = \\frac{1}{3} \\times ${area} \\times ${h} = \\frac{${area * h}}{3} = ${vol}\\text{ cm}^3$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 2
          };
        } else if (subType === 2) { // Solid Cone Volume
          const r = 5, h = 12;
          const volExact = 100; // (1/3)*pi*25*12 = 100pi
          const volApprox = (100 * Math.PI).toFixed(2); // 314.16
          const ans = `100π cm³ (approx. 314.16 cm³)`;
          const text = `A solid cone has a base radius of 5 cm and a vertical height of 12 cm. Find its exact volume in terms of π and its approximate volume rounded to two decimal places.`;
          const formula = `V = \\frac{1}{3} \\pi r^2 h`;
          const options = makeOptions(ans, `300π cm³ (approx. 942.48 cm³)`, `60π cm³ (approx. 188.50 cm³)`, `150π cm³ (approx. 471.24 cm³)`);
          svgParams = { title: `Solid Cone Volume #${qNum}`, r, h };
          imgAltText = `3D diagram of a solid cone with base radius ${r} cm and height ${h} cm`;
          qObj = {
            title: `Solid Cone Volume #${qNum}`,
            text, formula, options, answer: ans,
            hint: `V = 1/3 * π * 5² * 12 = 1/3 * 300π = 100π cm³ ≈ 314.16 cm³.`,
            steps: [
              `**Step 1: Substitute r = 5 and h = 12**`,
              `$$V = \\frac{1}{3} \\pi (5)^2 (12) = \\frac{1}{3} \\pi (25) (12) = 100\\pi\\text{ cm}^3$$`,
              `**Step 2: Evaluate decimal approximation**`,
              `$$100 \\times 3.14159... \\approx 314.16\\text{ cm}^3$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 2
          };
        } else if (subType === 3) { // Cone from Diameter & Slant Height
          const d = 14, l = 25;
          const r = 7, h = 24; // sqrt(25^2 - 7^2) = 24
          const volExact = 392; // (1/3)*pi*49*24 = 392pi
          const ans = `392π cm³`;
          const text = `Find the volume of a cone with a diameter of 14 cm and a slant height of 25 cm in terms of π. (Hint: Determine the vertical height first).`;
          const formula = `h = \\sqrt{l^2 - r^2}, \\quad V = \\frac{1}{3} \\pi r^2 h`;
          const options = makeOptions(ans, `1176π cm³`, `196π cm³`, `400π cm³`);
          svgParams = { title: `Cone from Slant Height #${qNum}`, d, l, h };
          imgAltText = `3D diagram of a cone with diameter ${d} cm, slant height ${l} cm, and vertical height ${h} cm`;
          qObj = {
            title: `Cone from Slant Height #${qNum}`,
            text, formula, options, answer: ans,
            hint: `Radius r = 7 cm. Height h = \\sqrt{25² - 7²} = \\sqrt{625 - 49} = \\sqrt{576} = 24 cm. V = 1/3 * π * 49 * 24 = 392π cm³.`,
            steps: [
              `**Step 1: Find vertical height h using Pythagorean theorem**`,
              `$$h = \\sqrt{25^2 - 7^2} = \\sqrt{576} = 24\\text{ cm}$$`,
              `**Step 2: Compute volume**`,
              `$$V = \\frac{1}{3} \\pi (7)^2 (24) = 49 \\times 8 \\times \\pi = 392\\pi\\text{ cm}^3$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 3
          };
        } else if (subType === 4) { // Sphere Exact Volume
          const r = 9;
          const volExact = 972; // (4/3)*pi*729 = 972pi
          const ans = `972π cm³`;
          const text = `Calculate the exact volume of a sphere having a radius of 9 cm in terms of π.`;
          const formula = `V = \\frac{4}{3} \\pi r^3`;
          const options = makeOptions(ans, `2916π cm³`, `324π cm³`, `729π cm³`);
          svgParams = { title: `Exact Sphere Volume #${qNum}`, r };
          imgAltText = `3D diagram of a sphere with radius r = ${r} cm`;
          qObj = {
            title: `Exact Sphere Volume #${qNum}`,
            text, formula, options, answer: ans,
            hint: `V = 4/3 * π * 9³ = 4/3 * 729 * π = 972π cm³.`,
            steps: [
              `**Step 1: Substitute r = 9 into sphere volume formula**`,
              `$$V = \\frac{4}{3} \\pi (9)^3 = \\frac{4}{3} \\pi (729)$$`,
              `**Step 2: Multiply 4/3 * 729**`,
              `$$V = 4 \\times 243 \\times \\pi = 972\\pi\\text{ cm}^3$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 2
          };
        } else if (subType === 5) { // Spherical Basketball
          const d = 24, r = 12;
          const vol = ((4/3) * Math.PI * Math.pow(r, 3)).toFixed(2); // 7238.23
          const ans = `${vol} cm³`;
          const text = `A spherical basketball has a diameter of 24 cm. Calculate its volume to the nearest hundredth of a cubic centimeter.`;
          const formula = `V = \\frac{4}{3} \\pi r^3 = \\frac{4}{3} \\pi (12)^3`;
          const options = makeOptions(ans, `57905.84 cm³`, `1809.56 cm³`, `904.78 cm³`);
          svgParams = { title: `Basketball Sphere Volume #${qNum}`, d };
          imgAltText = `3D diagram of a spherical basketball with diameter d = ${d} cm (r = ${r} cm)`;
          qObj = {
            title: `Basketball Sphere Volume #${qNum}`,
            text, formula, options, answer: ans,
            hint: `Radius r = 24 / 2 = 12 cm. V = 4/3 * π * 12³ = 2304π ≈ 7238.23 cm³.`,
            steps: [
              `**Step 1: Find radius r**`,
              `$$r = \\frac{24}{2} = 12\\text{ cm}$$`,
              `**Step 2: Compute volume**`,
              `$$V = \\frac{4}{3} \\pi (12)^3 = \\frac{4}{3} \\pi (1728) = 2304\\pi \\approx 7238.23\\text{ cm}^3$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 2
          };
        } else if (subType === 6) { // Hemispherical Bowl
          const r = 12;
          const volExact = 1152; // (2/3)*pi*1728 = 1152pi
          const ans = `1152π cm³`;
          const text = `A hemispherical bowl has an inner radius of 12 cm. Calculate the maximum volume of liquid the bowl can hold in terms of π.`;
          const formula = `V = \\frac{2}{3} \\pi r^3`;
          const options = makeOptions(ans, `2304π cm³`, `576π cm³`, `1728π cm³`);
          svgParams = { title: `Hemispherical Bowl Capacity #${qNum}`, r };
          imgAltText = `3D diagram of a hemispherical bowl with inner radius r = ${r} cm`;
          qObj = {
            title: `Hemispherical Bowl Capacity #${qNum}`,
            text, formula, options, answer: ans,
            hint: `Hemisphere volume = 2/3 * π * r³ = 2/3 * π * 12³ = 1152π cm³.`,
            steps: [
              `**Step 1: Apply hemisphere volume formula**`,
              `$$V = \\frac{2}{3} \\pi (12)^3 = \\frac{2}{3} \\pi (1728)$$`,
              `**Step 2: Simplify**`,
              `$$V = 2 \\times 576 \\times \\pi = 1152\\pi\\text{ cm}^3$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 2
          };
        } else if (subType === 7) { // Cylinder to Cone Pouring Water
          const ans = `3 cones`;
          const text = `A cylindrical container with a radius of 4 cm and height of 9 cm is filled with water. If all water is poured into an empty cone of the same radius and height, how many such cones can be completely filled?`;
          const formula = `V_{cylinder} = \\pi r^2 h = 3 V_{cone}`;
          const options = makeOptions(ans, `1 cone`, `2 cones`, `4 cones`);
          svgParams = { title: `Cylinder vs Cone Pouring Water #${qNum}`, r: 4, h: 9 };
          imgAltText = `3D diagram comparing a cylinder and cone of identical radius and height showing cylinder volume equals 3 cones`;
          qObj = {
            title: `Cylinder to Cone Capacity #${qNum}`,
            text, formula, options, answer: ans,
            hint: `V_cylinder = πr²h, while V_cone = 1/3 πr²h. Ratio V_cyl / V_cone = 3.`,
            steps: [
              `**Step 1: Compare volume formulas**`,
              `$$V_{\\text{cyl}} = \\pi r^2 h, \\quad V_{\\text{cone}} = \\frac{1}{3} \\pi r^2 h$$`,
              `**Step 2: Divide volumes**`,
              `$$\\text{Ratio} = \\frac{\\pi r^2 h}{\\frac{1}{3} \\pi r^2 h} = 3\\text{ cones}$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 1
          };
        } else if (subType === 8) { // Recast Melted Sphere to Cone
          const r = 6;
          const hCone = 24; // V_sphere = (4/3)pi r^3 = (1/3)pi r^2 h => h = 4r = 24
          const ans = `24 cm`;
          const text = `A solid metal sphere of radius 6 cm is melted down and recast into a solid cone with a base radius of 6 cm. Find the height of the cone.`;
          const formula = `V_{sphere} = V_{cone} \\implies \\frac{4}{3} \\pi r^3 = \\frac{1}{3} \\pi r^2 h \\implies h = 4r`;
          const options = makeOptions(ans, `12 cm`, `18 cm`, `36 cm`);
          svgParams = { title: `Recast Sphere to Cone #${qNum}`, r, h: hCone };
          imgAltText = `3D diagram showing a melted sphere of radius 6 cm recast into a cone of equal radius and height 24 cm`;
          qObj = {
            title: `Recast Sphere to Cone #${qNum}`,
            text, formula, options, answer: ans,
            hint: `Volume is conserved: 4/3 π r³ = 1/3 π r² h => h = 4r = 4 * 6 = 24 cm.`,
            steps: [
              `**Step 1: Set volumes equal**`,
              `$$\\frac{4}{3} \\pi (6)^3 = \\frac{1}{3} \\pi (6)^2 h$$`,
              `**Step 2: Simplify equation for h**`,
              `$$4(6) = h \\implies h = 24\\text{ cm}$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 3
          };
        } else { // Ice Cream Cone + Hemispherical Scoop
          const r = 3, h = 10;
          const vConeExact = 30; // (1/3)*pi*9*10 = 30pi
          const vHemiExact = 18; // (2/3)*pi*27 = 18pi
          const totalVolExact = 48; // 30pi + 18pi = 48pi
          const ans = `48π cm³`;
          const text = `An ice cream cone has a radius of 3 cm and a height of 10 cm. It is filled level with ice cream, and a hemispherical scoop of ice cream with a radius of 3 cm is placed on top. Find the total volume of ice cream in terms of π.`;
          const formula = `V_{total} = V_{cone} + V_{hemisphere} = \\frac{1}{3} \\pi r^2 h + \\frac{2}{3} \\pi r^3`;
          const options = makeOptions(ans, `30π cm³`, `36π cm³`, `66π cm³`);
          svgParams = { title: `Composite Ice Cream Cone Volume #${qNum}`, r, h };
          imgAltText = `3D diagram of an ice cream cone filled to top with a hemispherical scoop on top`;
          qObj = {
            title: `Composite Ice Cream Cone Volume #${qNum}`,
            text, formula, options, answer: ans,
            hint: `V_cone = 1/3 * π * 9 * 10 = 30π. V_hemi = 2/3 * π * 27 = 18π. V_total = 30π + 18π = 48π cm³.`,
            steps: [
              `**Step 1: Compute cone volume**`,
              `$$V_{\\text{cone}} = \\frac{1}{3} \\pi (3)^2 (10) = 30\\pi\\text{ cm}^3$$`,
              `**Step 2: Compute hemispherical scoop volume**`,
              `$$V_{\\text{hemi}} = \\frac{2}{3} \\pi (3)^3 = 18\\pi\\text{ cm}^3$$`,
              `**Step 3: Sum volumes**`,
              `$$V_{\\text{total}} = 30\\pi + 18\\pi = 48\\pi\\text{ cm}^3$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 3
          };
        }

        const customSvg = generateTopic136Svg(subType, svgParams);
        fs.writeFileSync(imgPathPublic, customSvg);
        fs.writeFileSync(imgPathRoot, customSvg);
      }

      // ==========================================
      // TOPIC 137 (T13): The Pythagorean Theorem
      // ==========================================
      else if (topicId === 137) {
        const imgFileName = `g8_t137_q${qNum}.svg`;
        const imgPathPublic = path.join(__dirname, '..', 'public', 'images', imgFileName);
        const imgPathRoot = path.join(__dirname, '..', 'images', imgFileName);
        let svgParams = {};
        let imgAltText = '';

        if (subType === 0) { // Find Hypotenuse c
          const a = 9, b = 12, c = 15;
          const ans = `15 cm`;
          const text = `In a right triangle ABC with right angle at C, side a = 9 cm and side b = 12 cm. Find the length of hypotenuse c.`;
          const formula = `c = \\sqrt{a^2 + b^2}`;
          const options = makeOptions(ans, `21 cm`, `14 cm`, `16 cm`);
          svgParams = { title: `Right Triangle Hypotenuse #${qNum}`, a, b, c };
          imgAltText = `Diagram of right triangle ABC with legs 9 cm and 12 cm and hypotenuse c = 15 cm`;
          qObj = {
            title: `Right Triangle Hypotenuse #${qNum}`,
            text, formula, options, answer: ans,
            hint: `c = \\sqrt{9² + 12²} = \\sqrt{81 + 144} = \\sqrt{225} = 15 cm.`,
            steps: [
              `**Step 1: Apply Pythagorean theorem**`,
              `$$c = \\sqrt{9^2 + 12^2} = \\sqrt{81 + 144}$$`,
              `**Step 2: Evaluate square root**`,
              `$$c = \\sqrt{225} = 15\\text{ cm}$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 1
          };
        } else if (subType === 1) { // Find Missing Leg a
          const c = 25, b = 7, a = 24;
          const ans = `24 cm`;
          const text = `Find the missing leg length of a right triangle whose hypotenuse measures 25 cm and one leg measures 7 cm.`;
          const formula = `a = \\sqrt{c^2 - b^2}`;
          const options = makeOptions(ans, `18 cm`, `20 cm`, `26 cm`);
          svgParams = { title: `Missing Leg Calculation #${qNum}`, c, b, a };
          imgAltText = `Diagram of right triangle with hypotenuse 25 cm, leg 7 cm, and missing leg a = 24 cm`;
          qObj = {
            title: `Missing Leg Calculation #${qNum}`,
            text, formula, options, answer: ans,
            hint: `a = \\sqrt{25² - 7²} = \\sqrt{625 - 49} = \\sqrt{576} = 24 cm.`,
            steps: [
              `**Step 1: Solve for missing leg**`,
              `$$a = \\sqrt{25^2 - 7^2} = \\sqrt{625 - 49}$$`,
              `**Step 2: Evaluate square root**`,
              `$$a = \\sqrt{576} = 24\\text{ cm}$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 2
          };
        } else if (subType === 2) { // Classify (8, 15, 17) -> Right Triangle
          const ans = `Right Triangle (17² = 8² + 15²)`;
          const text = `Classify a triangle with side lengths 8 cm, 15 cm, and 17 cm as acute, right, or obtuse using the converse of the Pythagorean Theorem.`;
          const formula = `c^2 = a^2 + b^2 \\implies \\text{Right Triangle}`;
          const options = makeOptions(ans, `Acute Triangle`, `Obtuse Triangle`, `Equilateral Triangle`);
          svgParams = { title: `Converse Pythagorean Check #${qNum}`, a: 8, b: 15, c: 17, typeStr: 'Right Triangle' };
          imgAltText = `Diagram of a right triangle with side lengths 8 cm, 15 cm, and 17 cm`;
          qObj = {
            title: `Triangle Classification (8,15,17) #${qNum}`,
            text, formula, options, answer: ans,
            hint: `Compute 17² = 289. Compute 8² + 15² = 64 + 225 = 289. Since 289 = 289, it is a right triangle.`,
            steps: [
              `**Step 1: Square the longest side**`,
              `$$c^2 = 17^2 = 289$$`,
              `**Step 2: Sum the squares of shorter sides**`,
              `$$a^2 + b^2 = 8^2 + 15^2 = 64 + 225 = 289$$`,
              `**Step 3: Compare values**`,
              `$$289 = 289 \\implies \\text{Right Triangle}$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 2
          };
        } else if (subType === 3) { // Classify (7, 10, 12) -> Acute Triangle
          const ans = `Acute Triangle (12² < 7² + 10²)`;
          const text = `Determine whether a triangle with side lengths 7 cm, 10 cm, and 12 cm is a right triangle, acute triangle, or obtuse triangle.`;
          const formula = `c^2 < a^2 + b^2 \\implies \\text{Acute Triangle}`;
          const options = makeOptions(ans, `Right Triangle`, `Obtuse Triangle`, `Scalene Right Triangle`);
          svgParams = { title: `Triangle Classification (7,10,12) #${qNum}`, a: 7, b: 10, c: 12, typeStr: 'Acute Triangle' };
          imgAltText = `Diagram of an acute triangle with side lengths 7 cm, 10 cm, and 12 cm`;
          qObj = {
            title: `Triangle Classification (7,10,12) #${qNum}`,
            text, formula, options, answer: ans,
            hint: `12² = 144. 7² + 10² = 49 + 100 = 149. Since 144 < 149, the triangle is acute.`,
            steps: [
              `**Step 1: Square longest side**`,
              `$$c^2 = 12^2 = 144$$`,
              `**Step 2: Sum squares of shorter sides**`,
              `$$a^2 + b^2 = 7^2 + 10^2 = 49 + 100 = 149$$`,
              `**Step 3: Compare values**`,
              `$$144 < 149 \\implies \\text{Acute Triangle}$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 2
          };
        } else if (subType === 4) { // Rescue Ladder
          const ladder = 15, wall = 12, ground = 9;
          const ans = `9 meters`;
          const text = `A 15-meter rescue ladder reaches a window 12 meters above the ground. How far is the foot of the ladder from the base of the building?`;
          const formula = `\\text{Distance} = \\sqrt{15^2 - 12^2}`;
          const options = makeOptions(ans, `8 meters`, `10 meters`, `3 meters`);
          svgParams = { title: `Rescue Ladder Distance #${qNum}`, a: 12, b: 9, c: 15 };
          imgAltText = `Diagram of a 15-meter ladder leaning against a 12-meter wall with base distance 9 meters`;
          qObj = {
            title: `Rescue Ladder Distance #${qNum}`,
            text, formula, options, answer: ans,
            hint: `Distance = \\sqrt{15² - 12²} = \\sqrt{225 - 144} = \\sqrt{81} = 9 m.`,
            steps: [
              `**Step 1: Set up right triangle**`,
              `$$\\text{Ground} = \\sqrt{15^2 - 12^2} = \\sqrt{225 - 144}$$`,
              `**Step 2: Evaluate**`,
              `$$\\text{Ground} = \\sqrt{81} = 9\\text{ meters}$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 2
          };
        } else if (subType === 5) { // TV Screen Diagonal
          const w = 40, h = 30, diag = 50;
          const ans = `50 inches`;
          const text = `A television screen is advertised by the length of its diagonal. If a TV screen has a width of 40 inches and a height of 30 inches, what is the screen's advertised diagonal size?`;
          const formula = `d = \\sqrt{40^2 + 30^2}`;
          const options = makeOptions(ans, `70 inches`, `45 inches`, `55 inches`);
          svgParams = { title: `TV Screen Diagonal #${qNum}`, w, h, diag };
          imgAltText = `Diagram of a TV screen with width 40 inches, height 30 inches, and diagonal 50 inches`;
          qObj = {
            title: `TV Screen Diagonal #${qNum}`,
            text, formula, options, answer: ans,
            hint: `d = \\sqrt{40² + 30²} = \\sqrt{1600 + 900} = \\sqrt{2500} = 50 inches.`,
            steps: [
              `**Step 1: Compute sum of squares**`,
              `$$d = \\sqrt{40^2 + 30^2} = \\sqrt{1600 + 900} = \\sqrt{2500}$$`,
              `**Step 2: Take square root**`,
              `$$d = 50\\text{ inches}$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 1
          };
        } else if (subType === 6) { // Rectangle Diagonal
          const w = 16, h = 12, diag = 20;
          const ans = `20 cm`;
          const text = `Find the length of the diagonal of a rectangle whose dimensions are 16 cm by 12 cm.`;
          const formula = `d = \\sqrt{16^2 + 12^2}`;
          const options = makeOptions(ans, `28 cm`, `24 cm`, `18 cm`);
          svgParams = { title: `Rectangle Diagonal #${qNum}`, w, h, diag };
          imgAltText = `Diagram of a rectangle with dimensions 16 cm by 12 cm and diagonal 20 cm`;
          qObj = {
            title: `Rectangle Diagonal #${qNum}`,
            text, formula, options, answer: ans,
            hint: `d = \\sqrt{16² + 12²} = \\sqrt{256 + 144} = \\sqrt{400} = 20 cm.`,
            steps: [
              `**Step 1: Apply Pythagorean theorem**`,
              `$$d = \\sqrt{16^2 + 12^2} = \\sqrt{256 + 144} = \\sqrt{400}$$`,
              `**Step 2: Evaluate**`,
              `$$d = 20\\text{ cm}$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 1
          };
        } else if (subType === 7) { // Runner Compass Navigation
          const north = 6, east = 8, dist = 10;
          const ans = `10 km`;
          const text = `A runner starts at Point A, runs 6 km due North, and then turns and runs 8 km due East to Point B. What is the direct straight-line distance from Point A to Point B?`;
          const formula = `d = \\sqrt{6^2 + 8^2}`;
          const options = makeOptions(ans, `14 km`, `12 km`, `7 km`);
          svgParams = { title: `Runner Compass Distance #${qNum}`, north, east, dist };
          imgAltText = `Diagram showing runner path 6 km North, 8 km East, and direct distance 10 km`;
          qObj = {
            title: `Runner Compass Distance #${qNum}`,
            text, formula, options, answer: ans,
            hint: `North and East paths form a 90° right angle. Direct distance = \\sqrt{6² + 8²} = \\sqrt{100} = 10 km.`,
            steps: [
              `**Step 1: Identify right triangle legs**`,
              `$$\\text{Leg 1} = 6\\text{ km}, \\quad \\text{Leg 2} = 8\\text{ km}$$`,
              `**Step 2: Compute hypotenuse**`,
              `$$d = \\sqrt{6^2 + 8^2} = \\sqrt{36 + 64} = \\sqrt{100} = 10\\text{ km}$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 2
          };
        } else if (subType === 8) { // Equilateral Triangle Altitude & Area
          const s = 10;
          const hStr = `5\\sqrt{3}\\text{ cm}`;
          const areaStr = `25\\sqrt{3}\\text{ cm}^2`;
          const ans = `Altitude = 5√3 cm, Area = 25√3 cm²`;
          const text = `An equilateral triangle has side lengths of 10 cm. Find the exact length of its altitude (height) and its area.`;
          const formula = `h = \\frac{\\sqrt{3}}{2} s, \\quad A = \\frac{\\sqrt{3}}{4} s^2`;
          const options = makeOptions(ans, `Altitude = 5 cm, Area = 25 cm²`, `Altitude = 10√3 cm, Area = 50√3 cm²`, `Altitude = 5√2 cm, Area = 25√2 cm²`);
          svgParams = { title: `Equilateral Altitude & Area #${qNum}`, s, alt: '5√3 ≈ 8.66' };
          imgAltText = `Diagram of an equilateral triangle with side lengths 10 cm, altitude 5√3 cm, and area 25√3 cm²`;
          qObj = {
            title: `Equilateral Altitude & Area #${qNum}`,
            text, formula, options, answer: ans,
            hint: `h = (\\sqrt{3}/2) * 10 = 5\\sqrt{3}. Area = (\\sqrt{3}/4) * 100 = 25\\sqrt{3}.`,
            steps: [
              `**Step 1: Compute altitude h**`,
              `$$h = \\frac{\\sqrt{3}}{2} (10) = 5\\sqrt{3}\\text{ cm}$$`,
              `**Step 2: Compute Area**`,
              `$$A = \\frac{1}{2} \\times 10 \\times 5\\sqrt{3} = 25\\sqrt{3}\\text{ cm}^2$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 3
          };
        } else { // Transmission Tower Guy Wire
          const tower = 24, base = 10, wire = 26;
          const ans = `26 meters`;
          const text = `A guy wire is attached to the top of a 24-meter transmission tower. The wire is anchored to the ground 10 meters from the tower base. Find the required length of the guy wire.`;
          const formula = `L = \\sqrt{24^2 + 10^2}`;
          const options = makeOptions(ans, `34 meters`, `28 meters`, `22 meters`);
          svgParams = { title: `Tower Guy Wire Length #${qNum}`, a: tower, b: base, c: wire };
          imgAltText = `Diagram of a 24-meter transmission tower with a 26-meter guy wire anchored 10 meters from the base`;
          qObj = {
            title: `Tower Guy Wire Length #${qNum}`,
            text, formula, options, answer: ans,
            hint: `L = \\sqrt{24² + 10²} = \\sqrt{576 + 100} = \\sqrt{676} = 26 m.`,
            steps: [
              `**Step 1: Compute sum of squares**`,
              `$$L = \\sqrt{24^2 + 10^2} = \\sqrt{576 + 100} = \\sqrt{676}$$`,
              `**Step 2: Evaluate square root**`,
              `$$L = 26\\text{ meters}$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 2
          };
        }

        const customSvg = generateTopic137Svg(subType, svgParams);
        fs.writeFileSync(imgPathPublic, customSvg);
        fs.writeFileSync(imgPathRoot, customSvg);
      }

      // ==========================================
      // TOPIC 138 (T14): Triangle Inequality Theorems
      // ==========================================
      else if (topicId === 138) {
        const imgFileName = `g8_t138_q${qNum}.svg`;
        const imgPathPublic = path.join(__dirname, '..', 'public', 'images', imgFileName);
        const imgPathRoot = path.join(__dirname, '..', 'images', imgFileName);
        let svgParams = {};
        let imgAltText = '';

        if (subType === 0) { // Side Length Check (6, 9, 17)
          const ans = `No, because 6 + 9 = 15 < 17 (violates Triangle Inequality Theorem)`;
          const text = `Determine whether it is possible to form a triangle with side lengths: 6 cm, 9 cm, and 17 cm. Justify your answer.`;
          const formula = `a + b > c`;
          const options = makeOptions(
            `No, because 6 + 9 = 15 < 17 (violates Triangle Inequality Theorem)`,
            `Yes, because 6 + 9 + 17 = 32 > 0`,
            `Yes, any three numbers can form a triangle`,
            `No, because 17 - 9 = 8 > 6`
          );
          svgParams = { title: `Triangle Side Length Check #${qNum}` };
          imgAltText = `Diagram showing segments of length 6 cm, 9 cm, and 17 cm failing to meet to form a triangle`;
          qObj = {
            title: `Triangle Side Check (6,9,17) #${qNum}`,
            text, formula, options, answer: ans,
            hint: `The sum of the two shorter sides (6 + 9 = 15) must be strictly greater than the longest side (17). 15 < 17, so NO triangle can be formed.`,
            steps: [
              `**Step 1: Sum the two shorter sides**`,
              `$$6 + 9 = 15$$`,
              `**Step 2: Compare with third side**`,
              `$$15 < 17 \\implies \\text{Triangle Inequality violated. Cannot form triangle.}$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 1
          };
        } else if (subType === 1) { // Third side range (8 and 13)
          const a = 8, b = 13;
          const min = b - a; // 5
          const max = a + b; // 21
          const ans = `5 cm < x < 21 cm`;
          const text = `Two sides of a triangle measure 8 cm and 13 cm. What is the range of possible lengths for the third side x?`;
          const formula = `|a - b| < x < a + b`;
          const options = makeOptions(ans, `8 cm < x < 13 cm`, `5 cm ≤ x ≤ 21 cm`, `0 cm < x < 21 cm`);
          svgParams = { title: `Third Side Range Bounds #${qNum}`, minVal: min, maxVal: max, a, b };
          imgAltText = `Diagram showing third side x bounded between 5 cm and 21 cm`;
          qObj = {
            title: `Third Side Range (8,13) #${qNum}`,
            text, formula, options, answer: ans,
            hint: `Lower bound = 13 - 8 = 5 cm. Upper bound = 13 + 8 = 21 cm. Range: 5 < x < 21.`,
            steps: [
              `**Step 1: Compute lower bound |a - b|**`,
              `$$13 - 8 = 5\\text{ cm}$$`,
              `**Step 2: Compute upper bound a + b**`,
              `$$8 + 13 = 21\\text{ cm}$$`,
              `**Step 3: Combine bounds**`,
              `$$5\\text{ cm} < x < 21\\text{ cm}$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 2
          };
        } else if (subType === 2) { // Angle-Side Relationship (A=45, B=75, C=60)
          const ans = `BC, AB, AC`;
          const text = `In triangle ABC, m∠A = 45°, m∠B = 75°, and m∠C = 60°. List the lengths of the three sides (AB, BC, AC) in order from shortest to longest.`;
          const formula = `\\text{Smallest Angle } \\leftrightarrow \\text{ Shortest Opposite Side}`;
          const options = makeOptions(ans, `AC, AB, BC`, `AB, BC, AC`, `BC, AC, AB`);
          svgParams = { title: `Angle-Side Order Relationship #${qNum}` };
          imgAltText = `Diagram of triangle ABC with angles A=45°, B=75°, C=60° and side ranking BC < AB < AC`;
          qObj = {
            title: `Angle-Side Order Relationship #${qNum}`,
            text, formula, options, answer: ans,
            hint: `Rank angles: ∠A (45°) < ∠C (60°) < ∠B (75°). Opposite sides rank in same order: BC < AB < AC.`,
            steps: [
              `**Step 1: Rank interior angles**`,
              `$$m\\angle A (45^\\circ) < m\\angle C (60^\\circ) < m\\angle B (75^\\circ)$$`,
              `**Step 2: Match opposite sides**`,
              `$$\\text{Opposite } \\angle A \\to BC, \\quad \\text{Opposite } \\angle C \\to AB, \\quad \\text{Opposite } \\angle B \\to AC$$`,
              `$$\\text{Order: } BC, AB, AC$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 2
          };
        } else if (subType === 3) { // Side-Angle Relationship (XY=12, YZ=9, XZ=15)
          const ans = `∠X, ∠Z, ∠Y`;
          const text = `In triangle XYZ, side XY = 12 cm, YZ = 9 cm, and XZ = 15 cm. List the interior angles (∠X, ∠Y, ∠Z) in order from smallest to largest.`;
          const formula = `\\text{Shortest Side } \\leftrightarrow \\text{ Smallest Opposite Angle}`;
          const options = makeOptions(ans, `∠Y, ∠Z, ∠X`, `∠Z, ∠X, ∠Y`, `∠X, ∠Y, ∠Z`);
          svgParams = { title: `Side-Angle Order Relationship #${qNum}` };
          imgAltText = `Diagram of triangle XYZ with sides YZ=9 cm, XY=12 cm, XZ=15 cm and angle ranking ∠X < ∠Z < ∠Y`;
          qObj = {
            title: `Side-Angle Order Relationship #${qNum}`,
            text, formula, options, answer: ans,
            hint: `Rank sides: YZ (9) < XY (12) < XZ (15). Opposite angles rank in same order: ∠X < ∠Z < ∠Y.`,
            steps: [
              `**Step 1: Rank side lengths**`,
              `$$YZ (9) < XY (12) < XZ (15)$$`,
              `**Step 2: Match opposite angles**`,
              `$$\\text{Opposite } YZ \\to \\angle X, \\quad \\text{Opposite } XY \\to \\angle Z, \\quad \\text{Opposite } XZ \\to \\angle Y$$`,
              `$$\\text{Order: } \\angle X, \\angle Z, \\angle Y$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 2
          };
        } else if (subType === 4) { // Can third side be 7 cm? (15 and 22)
          const ans = `No, because 15 + 7 = 22, which is not strictly greater than 22`;
          const text = `If the lengths of two sides of a triangle are 15 cm and 22 cm, can the third side be 7 cm? Explain why or why not.`;
          const formula = `a + b > c`;
          const options = makeOptions(
            `No, because 15 + 7 = 22, which is not strictly greater than 22`,
            `Yes, because 15 + 22 = 37 > 7`,
            `Yes, 7 cm is a valid positive length`,
            `No, because 22 - 15 = 7, which is too large`
          );
          svgParams = { title: `Third Side Non-Zero Bounds #${qNum}`, minVal: 7, maxVal: 37, a: 15, b: 22 };
          imgAltText = `Diagram showing third side 7 cm failing to exceed strict lower bound for sides 15 cm and 22 cm`;
          qObj = {
            title: `Third Side Validity Check #${qNum}`,
            text, formula, options, answer: ans,
            hint: `Lower bound must be strictly greater than 22 - 15 = 7 cm. Since 7 is not > 7, a side of 7 cm forms a degenerate line segment, not a triangle.`,
            steps: [
              `**Step 1: Compute strict inequality lower bound**`,
              `$$x > 22 - 15 \\implies x > 7$$`,
              `**Step 2: Evaluate 7 cm**`,
              `$$7 \\text{ is not } > 7 \\implies \\text{Invalid third side.}$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 2
          };
        } else if (subType === 5) { // Min & Max Integer Length (8 and 14)
          const a = 8, b = 14;
          const minInt = b - a + 1; // 7
          const maxInt = a + b - 1; // 21
          const ans = `Minimum = 7 cm, Maximum = 21 cm`;
          const text = `In triangle PQR, PQ = 8 cm and QR = 14 cm. If the third side PR has an integer length, what is the minimum possible integer length and maximum possible integer length of PR?`;
          const formula = `6 < PR < 22 \\implies \\text{Min integer = 7, Max integer = 21}`;
          const options = makeOptions(ans, `Minimum = 6 cm, Maximum = 22 cm`, `Minimum = 8 cm, Maximum = 14 cm`, `Minimum = 5 cm, Maximum = 21 cm`);
          svgParams = { title: `Third Side Integer Bounds #${qNum}`, minVal: 6, maxVal: 22, a, b };
          imgAltText = `Diagram showing third side PR integer bounds between min 7 cm and max 21 cm`;
          qObj = {
            title: `Third Side Integer Bounds #${qNum}`,
            text, formula, options, answer: ans,
            hint: `Range: 14 - 8 < PR < 14 + 8 => 6 < PR < 22. Smallest integer = 7, largest integer = 21.`,
            steps: [
              `**Step 1: Compute strict bounds**`,
              `$$14 - 8 < PR < 14 + 8 \\implies 6 < PR < 22$$`,
              `**Step 2: Identify integer limits**`,
              `$$\\text{Min integer} = 7\\text{ cm}, \\quad \\text{Max integer} = 21\\text{ cm}$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 2
          };
        } else if (subType === 6) { // Exterior Angle Inequality Theorem
          const ans = `An exterior angle of a triangle is strictly greater in measure than either of its remote interior angles`;
          const text = `Which statement correctly expresses the Exterior Angle Inequality Theorem?`;
          const formula = `m\\angle_{ext} > m\\angle_{remote\\,int}`;
          const options = makeOptions(
            `An exterior angle of a triangle is strictly greater in measure than either of its remote interior angles`,
            `An exterior angle is equal to the adjacent interior angle`,
            `An exterior angle is strictly smaller than any interior angle`,
            `The sum of an exterior angle and remote interior angles is always 90°`
          );
          svgParams = { title: `Exterior Angle Inequality Theorem #${qNum}` };
          imgAltText = `Diagram of a triangle with an extended base showing exterior angle strictly greater than remote interior angles`;
          qObj = {
            title: `Exterior Angle Inequality Theorem #${qNum}`,
            text, formula, options, answer: ans,
            hint: `By the Exterior Angle Inequality Theorem, an exterior angle of a triangle is strictly greater than either non-adjacent (remote) interior angle.`,
            steps: [
              `**Step 1: Recall Exterior Angle Theorem**`,
              `$$m\\angle_{ext} = m\\angle_{int1} + m\\angle_{int2}$$`,
              `**Step 2: Deduce inequality**`,
              `$$\\text{Since angles are positive, } m\\angle_{ext} > m\\angle_{int1} \\text{ and } m\\angle_{ext} > m\\angle_{int2}$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 2
          };
        } else if (subType === 7) { // Hinge Theorem (SAS Inequality)
          const ans = `BC > EF (because included angle m∠A = 65° > m∠D = 48°)`;
          const text = `In triangles ABC and DEF, AB = DE, AC = DF, and m∠A = 65° while m∠D = 48°. Apply the Hinge Theorem (SAS Inequality) to compare the lengths of BC and EF.`;
          const formula = `m\\angle A > m\\angle D \\implies BC > EF`;
          const options = makeOptions(ans, `BC < EF`, `BC = EF`, `Cannot be compared without side lengths`);
          svgParams = { title: `Hinge Theorem Comparison #${qNum}` };
          imgAltText = `Diagram comparing triangles ABC and DEF with equal side pairs showing BC > EF because ∠A (65°) > ∠D (48°)`;
          qObj = {
            title: `Hinge Theorem Comparison #${qNum}`,
            text, formula, options, answer: ans,
            hint: `By the Hinge Theorem, if two sides of one triangle are congruent to two sides of another, the triangle with the larger included angle has the longer third side.`,
            steps: [
              `**Step 1: Verify side pair congruences**`,
              `$$AB = DE, \\quad AC = DF$$`,
              `**Step 2: Compare included angles**`,
              `$$m\\angle A (65^\\circ) > m\\angle D (48^\\circ) \\implies BC > EF$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 2
          };
        } else if (subType === 8) { // Isosceles smallest angle identification
          const ans = `∠K and ∠M are the equal smallest angles`;
          const text = `In triangle KLM, KL = 7 cm, LM = 7 cm, and KM = 11 cm. Identify the smallest angle(s) in the triangle.`;
          const formula = `\\text{Shortest sides } (7\\text{ cm}) \\leftrightarrow \\text{ Smallest opposite angles}`;
          const options = makeOptions(ans, `∠L is the smallest angle`, `∠K is the unique smallest angle`, `All three angles are equal`);
          svgParams = { title: `Isosceles Angle Ranking #${qNum}` };
          imgAltText = `Diagram of isosceles triangle KLM with sides 7 cm, 7 cm, 11 cm showing ∠K and ∠M as equal smallest angles`;
          qObj = {
            title: `Isosceles Angle Ranking #${qNum}`,
            text, formula, options, answer: ans,
            hint: `KL = LM = 7 cm (shorter than KM = 11 cm). Opposite angles ∠M and ∠K are equal and smaller than ∠L.`,
            steps: [
              `**Step 1: Identify shortest sides**`,
              `$$KL (7\\text{ cm}) = LM (7\\text{ cm}) < KM (11\\text{ cm})$$`,
              `**Step 2: Match opposite angles**`,
              `$$\\text{Opposite } KL \\to \\angle M, \\quad \\text{Opposite } LM \\to \\angle K$$`,
              `$$\\text{Thus, } \\angle K = \\angle M < \\angle L$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 2
          };
        } else { // Surveyor Return Path Max Integer Length
          const p1 = 3, p2 = 5;
          const maxInt = p1 + p2 - 1; // 7
          const ans = `7 km`;
          const text = `A surveyor measures two paths extending from a basecamp: Path 1 is 3 km and Path 2 is 5 km. If the paths form a triangular circuit with a third return path, what is the maximum possible integer length (in whole kilometers) of the return path?`;
          const formula = `\\text{Return Path} < 3 + 5 \\implies \\text{Max integer} = 7`;
          const options = makeOptions(ans, `8 km`, `6 km`, `4 km`);
          svgParams = { title: `Surveyor Return Path Max Bounds #${qNum}` };
          imgAltText = `Diagram showing triangular circuit with paths 3 km, 5 km, and return path bounded by max 7 km`;
          qObj = {
            title: `Surveyor Return Path Max Bounds #${qNum}`,
            text, formula, options, answer: ans,
            hint: `Return path < 3 + 5 = 8 km. The largest integer strictly less than 8 is 7 km.`,
            steps: [
              `**Step 1: Compute upper bound using Triangle Inequality**`,
              `$$\\text{Path}_3 < 3 + 5 = 8\\text{ km}$$`,
              `**Step 2: Identify maximum integer**`,
              `$$\\text{Largest integer } < 8 = 7\\text{ km}$$`,
              `**Final Verified Answer:** \\(${ans}\\)`
            ],
            image_url: `/images/${imgFileName}`, image_alt: imgAltText, difficulty: 2
          };
        }

        const customSvg = generateTopic138Svg(subType, svgParams);
        fs.writeFileSync(imgPathPublic, customSvg);
        fs.writeFileSync(imgPathRoot, customSvg);
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

  console.log(`✅ Successfully generated and inserted ${totalGenerated} Grade 8 Measurement and Geometry questions into SQLite qbank.db!`);

  // Export updated questions database to Excel
  exportQuestionsToExcel(db);

  console.log('🎉 Generation and Excel export completed successfully!');
}

if (process.argv[1] && process.argv[1].endsWith('generate_g8_measurement_geometry.js')) {
  generateGrade8MeasurementGeometryQuestions();
}
