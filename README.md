# Landing Page

A marketing landing page with hero, features grid, pricing tiers, testimonials, and a sign-up CTA.

## What's inside

- `server.js` — minimal Express server that serves `public/` on port `$PORT` (defaults to `3000`).
- `public/index.html` — the page itself. Edit this to change the design.
- `routes/` + `lib/subscribers.js` — the email-capture backend (see below).
- `package.json` — Express is the only dependency.

## Email capture

The signup form on the page actually stores addresses (persisted to
`lib/data/subscribers.json`, which lives on EFS and is gitignored).

- `POST /api/subscribe` — body `{ "email": "you@example.com" }`. Validates the
  address, stores it (idempotent per email), and returns
  `{ ok, duplicate, count }`.
- `GET /admin/subscribers` — Basic-auth-protected JSON list of captured emails.
  Returns `503` until you set an admin password, `401` without valid credentials.
- `ADMIN_PASSWORD` env var — set this (via VibeKit `/env`) to enable the admin
  viewer. Log in with any username and this value as the password.

## Start it locally

```bash
npm install
npm start
```

Open http://localhost:3000.

## Ask the agent

Open a chat with your VibeKit agent and tell it how you want to customize the design. The agent edits `public/index.html` and `server.js` directly.
