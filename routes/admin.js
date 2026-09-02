const express = require('express');
const crypto = require('crypto');
const subscribers = require('../lib/subscribers');

const router = express.Router();

// Constant-time password check. Hashing both sides to a fixed length first
// lets timingSafeEqual run over equal-length buffers and hides length too.
function passwordMatches(candidate, expected) {
  const a = crypto.createHash('sha256').update(String(candidate)).digest();
  const b = crypto.createHash('sha256').update(String(expected)).digest();
  return crypto.timingSafeEqual(a, b);
}

// GET /admin/subscribers — Basic-auth-protected list of captured emails.
// Set ADMIN_PASSWORD in env vars (VibeKit /env) to enable; 503 until then.
function requirePassword(req, res, next) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return res.status(503).json({ error: 'admin_disabled', message: 'Set ADMIN_PASSWORD env var to enable the admin viewer.' });
  }
  const auth = req.headers.authorization || '';
  const match = auth.match(/^Basic\s+(.+)$/i);
  if (!match) {
    res.set('WWW-Authenticate', 'Basic realm="admin"');
    return res.status(401).end();
  }
  const decoded = Buffer.from(match[1], 'base64').toString('utf8');
  const [, password] = decoded.split(':');
  if (!passwordMatches(password, expected)) {
    res.set('WWW-Authenticate', 'Basic realm="admin"');
    return res.status(401).end();
  }
  next();
}

router.get('/subscribers', requirePassword, (req, res) => {
  res.json({ subscribers: subscribers.list() });
});

module.exports = router;
