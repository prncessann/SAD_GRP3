// Seeds master data from Frontend/dist/data.js (seed.accounts, products, materials).
// Demo password for every account: demo123 (change before real use). Safe to re-run.
const bcrypt = require('bcryptjs');
const db = require('../src/db');

const branches = [
  ['Main hub', 'hub'],
  ['Main Street', 'branch'],
  ['Market Road', 'branch'],
  ['Town Center', 'branch'],
];

// [code, username, full name, role, branch (null = all branches)]
const accounts = [
  ['ACC-001', 'juan.delacruz', 'Juan Dela Cruz', 'Business Owner', null],
  ['ACC-002', 'ana.reyes', 'Ana Reyes', 'Sales Staff', 'Main Street'],
  ['ACC-003', 'marvin.santos', 'Marvin Santos', 'Production Head', 'Main hub'],
  ['ACC-004', 'mia.choi', 'Mia Choi', 'Production Staff', 'Main hub'],
];

// [code, name, description, price, cost, threshold]
const products = [
  ['PRD-001', 'Chicken empanada', 'Hand-folded chicken empanada.', 65, 38, 40],
  ['PRD-002', 'Cheese roll', 'Freshly baked cheese roll.', 45, 24, 30],
  ['PRD-003', 'Banana loaf', 'Fresh banana loaf.', 120, 72, 30],
];

// [code, name, category, unit, cost, threshold, supplier]
const materials = [
  ['MAT-001', 'All-purpose flour', 'Baking flour', 'kg', 55, 10, 'Local Milling Co.'],
  ['MAT-002', 'Butter', 'Dairy', 'kg', 220, 5, 'Dairy Supply Co.'],
  ['MAT-003', 'Chicken filling', 'Filling', 'kg', 180, 8, 'Fresh Market'],
  ['MAT-004', 'White sugar', 'Baking ingredient', 'kg', 65, 2, 'Local Milling Co.'],
];

(async () => {
  for (const [name, kind] of branches) {
    await db.query('INSERT IGNORE INTO branches (name, kind) VALUES (?, ?)', [name, kind]);
  }

  const hash = await bcrypt.hash('demo123', 10);
  for (const [code, username, name, role, branch] of accounts) {
    await db.query(
      `INSERT IGNORE INTO users (code, username, full_name, password_hash, role_id, branch_id)
       VALUES (?, ?, ?, ?, (SELECT id FROM roles WHERE name = ?),
               (SELECT id FROM branches WHERE name = ?))`,
      [code, username, name, hash, role, branch]
    );
  }

  for (const p of products) {
    await db.query(
      `INSERT IGNORE INTO products (code, name, description, price, cost, threshold)
       VALUES (?, ?, ?, ?, ?, ?)`, p);
  }
  for (const m of materials) {
    await db.query(
      `INSERT IGNORE INTO materials (code, name, category, unit, cost, threshold, supplier)
       VALUES (?, ?, ?, ?, ?, ?, ?)`, m);
  }

  console.log('Seeded branches, users, products, materials');
  await db.end();
})().catch((e) => { console.error(e); process.exit(1); });
