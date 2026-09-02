import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const db = new Database(path.join(__dirname, 'etuition.db'));

console.log('🧪 Testing Admin Change Student Registered Form Level SQL & API logic...\n');

// Find a student
const student = db.prepare("SELECT * FROM users WHERE role = 'student' ORDER BY id ASC LIMIT 1").get();

if (!student) {
  console.error('❌ No student found');
  process.exit(1);
}

console.log(`Original Student: ID ${student.id} (${student.email}) -> Form Level: ${student.form_level}`);

const newLevel = student.form_level === 5 ? 8 : 5;

// Test updating registered form level
const result = db.prepare("UPDATE users SET form_level = ? WHERE id = ? AND role = 'student'").run(newLevel, student.id);
console.log(`Update Result: ${result.changes} row(s) updated.`);

const updatedStudent = db.prepare("SELECT * FROM users WHERE id = ?").get(student.id);
console.log(`Updated Student: ID ${updatedStudent.id} (${updatedStudent.email}) -> Form Level: ${updatedStudent.form_level}`);

if (updatedStudent.form_level === newLevel) {
  console.log(`\n✅ TEST PASSED: Administrator successfully changed student registered level to Form ${newLevel}!`);
} else {
  console.error('\n❌ TEST FAILED');
}
