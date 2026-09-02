const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Health check — used by the platform to detect when the app is ready.
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Real email-capture backend (persists to lib/data/subscribers.json on EFS).
// The signup form actually saves addresses — no fake "we'll be in touch".
app.use('/api', require('./routes/subscribe'));
app.use('/admin', require('./routes/admin'));

// Serve everything in /public as static files.
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
