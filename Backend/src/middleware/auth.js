const jwt = require('jsonwebtoken');

// Roles used across the system. Keep these names identical to db/schema.sql.
const ROLES = {
  OWNER: 'Business Owner',
  SALES: 'Sales Staff',
  PROD_HEAD: 'Production Head',
  PROD_STAFF: 'Production Staff',
};

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Usage: router.post('/', requireAuth, requireRole(ROLES.OWNER, ROLES.SALES), handler)
function requireRole(...allowed) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Not signed in' });
    if (!allowed.includes(req.user.role)) {
      return res.status(403).json({ error: 'You do not have permission for this action' });
    }
    next();
  };
}

module.exports = { ROLES, requireAuth, requireRole };
