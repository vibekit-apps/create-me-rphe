const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Persisted on EFS so signups survive container restarts. This directory is
// gitignored — a deploy resets committed files, so never commit captured data.
const DATA_DIR = path.join(__dirname, 'data');
const FILE = path.join(DATA_DIR, 'subscribers.json');

function ensure() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, '[]', 'utf8');
}

function readAll() {
  ensure();
  try {
    return JSON.parse(fs.readFileSync(FILE, 'utf8'));
  } catch (err) {
    // Corrupt/half-written file (e.g. crash mid-write). Preserve it for
    // inspection instead of silently overwriting captured subscribers.
    const corruptPath = `${FILE}.corrupt.${Date.now()}`;
    try {
      fs.renameSync(FILE, corruptPath);
      console.error(`subscribers.json failed to parse; moved to ${corruptPath}:`, err.message);
    } catch (renameErr) {
      console.error('subscribers.json failed to parse and could not be quarantined:', renameErr.message);
    }
    return [];
  }
}

// Atomic write: write to a temp file then rename over the target, so a crash
// mid-write can never truncate the live subscribers file.
function writeAll(rows) {
  ensure();
  const tmp = `${FILE}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(rows, null, 2), 'utf8');
  fs.renameSync(tmp, FILE);
}

// Returns { row, duplicate, count }. Idempotent on email so a double-tap
// doesn't store the same address twice.
function add(email) {
  const rows = readAll();
  const existing = rows.find(r => r.email.toLowerCase() === email.toLowerCase());
  if (existing) return { row: existing, duplicate: true, count: rows.length };
  const row = { id: crypto.randomUUID(), email, subscribedAt: new Date().toISOString() };
  rows.unshift(row);
  writeAll(rows);
  return { row, duplicate: false, count: rows.length };
}

function list() {
  return readAll();
}

module.exports = { add, list };
