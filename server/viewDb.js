import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'etuition.db');
const db = new Database(dbPath);

console.log('====================================================');
console.log('📊 eTuition SQLite Database Inspector');
console.log(`📁 File: ${dbPath}`);
console.log('====================================================\n');

// 1. List Tables
const tables = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'`).all();

console.log('📋 Database Tables Summary:');
tables.forEach((t) => {
  const count = db.prepare(`SELECT COUNT(*) as count FROM ${t.name}`).get().count;
  console.log(`  • ${t.name.padEnd(20)} -> ${count} rows`);
});
console.log('\n----------------------------------------------------\n');

// 2. View Sample Data per Table
tables.forEach((t) => {
  console.log(`🔍 Table: [ ${t.name} ]`);
  const rows = db.prepare(`SELECT * FROM ${t.name} LIMIT 3`).all();
  if (rows.length === 0) {
    console.log('  (No records found)\n');
  } else {
    console.table(rows);
  }
});

console.log('====================================================');
