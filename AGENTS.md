<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Design language

Before any UI, CSS, or component work, read [`DESIGN.md`](DESIGN.md). It is the
contract, not a moodboard: tokens, type roles, component rules, and the
do's/don'ts that keep pages from drifting.

Non-negotiables:

- Never hardcode a hex, radius, shadow, or duration outside `app/styles/tokens.css`.
- Plus Jakarta Sans (`--font-display`) is the UI voice — headings, buttons, nav,
  labels. Andika (`--font-body`) is the reading voice — paragraphs and long-form.
- Uppercase is reserved for eyebrows, metadata, and filter chips. Buttons, nav
  links, and card titles are sentence case.
- Topic terrain colors (`--topic-*`) are a content system: only inside topic
  media. Never style a control with clay or water.
- Every card is a flex column with a pinned footer and fixed-ratio media, so a
  grid row shares one height.
- No orphans in multi-column grids; check 4-item and 10-item rows.
- Dark theme is a paired palette. Topic media uses the dark terrain tokens.
