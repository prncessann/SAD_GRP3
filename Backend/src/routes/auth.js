const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/login  { username, password }
router.post('/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  try {
    const [rows] = await db.query(
      `SELECT u.id, u.code, u.username, u.full_name, u.password_hash, u.is_active,
              r.name AS role, b.id AS branch_id, b.name AS branch
         FROM users u
         JOIN roles r ON r.id = u.role_id
         LEFT JOIN branches b ON b.id = u.branch_id
        WHERE u.username = ? LIMIT 1`,
      [username]
    );
    const user = rows[0];
    const ok = user && user.is_active && (await bcrypt.compare(password, user.password_hash));
    if (!ok) return res.status(401).json({ error: 'Invalid username or password' });

    const payload = {
      id: user.id,
      code: user.code,
      username: user.username,
      name: user.full_name,
      role: user.role,
      branchId: user.branch_id,          // null = all branches
      branch: user.branch || 'All branches',
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '8h',
    });
    res.json({ token, user: payload });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/auth/me  (Authorization: Bearer <token>)
router.get('/me', requireAuth, (req, res) => res.json({ user: req.user }));

module.exports = router;
