// Runs db/schema.sql first, then every other .sql file in db/ alphabetically.
const fs = require('fs');
const path = require('path');
const db = require('../src/db');

(async () => {
  const files = fs.readdirSync(__dirname).filter((f) => f.endsWith('.sql'));
  files.sort((a, b) => (a === 'schema.sql' ? -1 : b === 'schema.sql' ? 1 : a.localeCompare(b)));
  for (const f of files) {
    await db.query(fs.readFileSync(path.join(__dirname, f), 'utf8'));
    console.log(`Ran ${f}`);
  }
  await db.end();
})().catch((e) => { console.error(e); process.exit(1); });
