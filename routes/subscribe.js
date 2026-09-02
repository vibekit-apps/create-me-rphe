const express = require('express');
const subscribers = require('../lib/subscribers');

const router = express.Router();

// Basic RFC-ish email check — good enough for a signup capture, no deps.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/subscribe { email } → stores the address. Returns
// { ok, duplicate, count } so the frontend can show honest feedback.
router.post('/subscribe', (req, res) => {
  const email = typeof req.body?.email === 'string' ? req.body.email.trim() : '';
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ ok: false, error: 'invalid_email', message: 'Enter a valid email address.' });
  }
  const { duplicate, count } = subscribers.add(email);
  res.json({ ok: true, duplicate, count });
});

module.exports = router;
