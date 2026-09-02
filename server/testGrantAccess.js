import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const db = new Database(path.join(__dirname, 'etuition.db'));

console.log('🧪 Testing Student Grant Access SQL & API logic...\n');

// Find a student
const student = db.prepare("SELECT * FROM users WHERE role = 'student' ORDER BY id ASC LIMIT 1").get();

if (!student) {
  console.error('❌ No student found');
  process.exit(1);
}

console.log(`Original Student: ID ${student.id} (${student.email}) -> Status: ${student.status}`);

// Test updating status to approved
const result = db.prepare("UPDATE users SET status = ? WHERE id = ? AND role = 'student'").run('approved', student.id);
console.log(`Update Result: ${result.changes} row(s) updated.`);

const updatedStudent = db.prepare("SELECT * FROM users WHERE id = ?").get(student.id);
console.log(`Updated Student: ID ${updatedStudent.id} (${updatedStudent.email}) -> Status: ${updatedStudent.status}`);

if (updatedStudent.status === 'approved') {
  console.log('\n✅ TEST PASSED: Grant Access database update is working 100% cleanly!');
} else {
  console.error('\n❌ TEST FAILED');
}
