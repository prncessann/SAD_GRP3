require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : true }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));

// Auto-mount every file in src/routes at /api/<filename>.
// products.js -> /api/products, dispatch.js -> /api/dispatch, etc.
// Nobody needs to edit this file when adding a module, so no merge conflicts.
const routesDir = path.join(__dirname, 'routes');
for (const file of fs.readdirSync(routesDir)) {
  if (!file.endsWith('.js')) continue;
  const name = file.replace(/\.js$/, '');
  app.use(`/api/${name}`, require(path.join(routesDir, file)));
  console.log(`Mounted /api/${name}`);
}

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API running on http://localhost:${port}`));
