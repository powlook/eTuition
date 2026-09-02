import fs from 'fs';
import XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const excelPath = path.join(__dirname, '..', 'MATATAG-Curriculum-Grade-1-10-Maths.xlsx');
const wb = XLSX.readFile(excelPath);

const topicsList = [];
let topicIdCounter = 1;

wb.SheetNames.forEach(sheetName => {
  const sheet = wb.Sheets[sheetName];
  const rawRows = XLSX.utils.sheet_to_json(sheet);

  let currentGradeStr = 'Grade 1';
  let currentDomain = 'Number and Algebra';

  rawRows.forEach((row) => {
    const keys = Object.keys(row);
    const gradeKey = keys.find(k => k.toLowerCase().includes('grade'));
    const domainKey = keys.find(k => k.toLowerCase().includes('domain'));
    const standardKey = keys.find(k => k.toLowerCase().includes('standard'));
    const compKey = keys.find(k => k.toLowerCase().includes('competenc'));

    if (row[gradeKey]) {
      currentGradeStr = String(row[gradeKey]).trim();
    }
    if (row[domainKey]) {
      currentDomain = String(row[domainKey]).trim();
    }

    // Normalize Domain names
    if (currentDomain.toLowerCase().includes('algrebra') || currentDomain.toLowerCase().includes('number')) {
      currentDomain = 'Number and Algebra';
    } else if (currentDomain.toLowerCase().includes('measurement') || currentDomain.toLowerCase().includes('geometry')) {
      currentDomain = 'Measurement and Geometry';
    } else if (currentDomain.toLowerCase().includes('data') || currentDomain.toLowerCase().includes('probability')) {
      currentDomain = 'Data and Probability';
    }

    const gradeMatch = currentGradeStr.match(/\d+/);
    const formLevel = gradeMatch ? parseInt(gradeMatch[0], 10) : 1;

    const rawStandard = row[standardKey] ? String(row[standardKey]).trim() : '';
    const rawComp = row[compKey] ? String(row[compKey]).trim() : '';

    if (rawStandard) {
      // Split standard string by item numbers e.g. 1., 2., 3., etc.
      const cleanStandard = rawStandard.replace(/\r\n/g, '\n');
      const items = cleanStandard
        .split(/\n(?=\d+\.)|\n(?=[A-Z])/)
        .map(s => s.trim())
        .filter(Boolean);

      items.forEach((itemText) => {
        let title = itemText.replace(/^\d+\.\s*/, '').replace(/;\s*$/, '').trim();
        if (!title) return;
        
        title = title.charAt(0).toUpperCase() + title.slice(1);
        const unit = title.length > 35 ? title.slice(0, 32) + '...' : title;
        const codePrefix = currentDomain === 'Number and Algebra' ? 'NA' : currentDomain === 'Measurement and Geometry' ? 'MG' : 'DP';

        topicsList.push({
          id: topicIdCounter,
          form_level: formLevel,
          strand: currentDomain,
          unit: unit,
          title: title,
          description: rawComp.slice(0, 300).replace(/\r\n|\n/g, ' ') || title,
          competencies: `MATATAG-M${formLevel}${codePrefix}-${topicIdCounter}`
        });

        topicIdCounter++;
      });
    }
  });
});

console.log(`Extracted ${topicsList.length} total topics from all sheets in MATATAG Excel file across Form 1 to Form 10.`);

// Count topics per form level
const levelCounts = {};
topicsList.forEach(t => {
  levelCounts[t.form_level] = (levelCounts[t.form_level] || 0) + 1;
});
console.log('Topics per Form Level:', levelCounts);

fs.writeFileSync(path.join(__dirname, '..', 'matatag_topics.json'), JSON.stringify(topicsList, null, 2));
