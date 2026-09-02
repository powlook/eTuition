import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const topicsJsonPath = path.join(__dirname, '..', 'matatag_topics.json');
const allTopics = JSON.parse(fs.readFileSync(topicsJsonPath, 'utf8'));

const f710Topics = allTopics.filter(t => t.form_level >= 7);

console.log(`=== Form 7 - 10 Topics (${f710Topics.length} total) ===\n`);

f710Topics.forEach(t => {
  console.log(`[Form ${t.form_level}] (${t.strand}) ID ${t.id}: ${t.title}`);
});
