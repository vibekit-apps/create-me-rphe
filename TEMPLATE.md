# Template: Landing Page

Marketing page with hero, features, and email capture

## What's already built and wired (do NOT rebuild it)

This is a working landing-page scaffold with a REAL email-capture backend — don't rewrite it as a static-only page.

What's wired:
- server.js — Express + static /public + /api and /admin mounts.
- lib/subscribers.js — JSON-file store at lib/data/subscribers.json on EFS (survives restarts, dedupes by email).
- routes/subscribe.js — POST /api/subscribe validates the email, returns { ok, duplicate, count }.
- routes/admin.js — GET /admin/subscribers, Basic-auth via ADMIN_PASSWORD env var.
- public/index.html — hero, features, and a signup CTA, with a form that ACTUALLY POSTs to /api/subscribe.

The form really saves addresses — never call it a demo; signups land in lib/data/subscribers.json, viewable at /admin/subscribers. Keep the form wired; to send real emails add a hook in routes/subscribe.js after subscribers.add().

The starter is deliberately LEAN: it ships no pricing table and no testimonials, because most requests (waitlist, coming-soon, brand launch, portfolio) do not want them, and deleting a section costs far more than adding one. If the user asks for pricing tiers, testimonials, an FAQ or any other section, ADD it in their brand's style. Do not add one they did not ask for.

This starter already boots, is pre-installed, and looks polished. Make the SMALLEST brand/copy edit the user asked for (usually just public/index.html — product name, headline, hero, colors). Do NOT rewrite sections they didn't mention, do NOT read files you aren't editing, and do NOT npm install or smoke-test a copy/brand edit — it already runs.

## Suggested features

- Hero with CTA
- Social proof
- Features grid
- How it works
- Testimonials
- Pricing tiers
- Footer

---

This starter already boots and is pre-installed — it is NOT a placeholder to replace. Follow the "what's already built" guidance above.

Do NOT deploy on your own initiative. Your FIRST real build publishes automatically once you commit it (the platform posts the live link) — end that turn with: "Changes saved — publishing your first version now." After that first publish, the user ships: they tap the Deploy button (play icon in the chat header), or they ask you outright to deploy — then do it per TOOLS.md §Deploy. End later build turns with: "Changes saved. Tap the play button to review and deploy — or just tell me to deploy."
