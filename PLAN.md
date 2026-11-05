# Enviro-Hension — Completion Plan

**Goal:** replace the static front-end mockup with a **Next.js application backed by Sanity CMS**, per the decisions recorded on 2026-01-05 (stack confirmed: Next.js).

**Current state:** single-file `index.html` (1,391 lines, inline CSS/JS), 6 client-side pages, EN/SW switcher, deployed to GitHub Pages via `.github/workflows/static.yml`. All forms are inert, all content is hardcoded, `saveCMS()` is a stub that `alert()`s "pushes to Sanity CMS" — this plan makes that true, in a real application.

---

## 1. Non-goals

- No redesign. Keep the existing visual system (sage `#DBEBBB` / black / Andika) — the CSS tokens port over unchanged.
- No user accounts / auth / comments in this pass.
- No offline/PWA requirements.

## 2. Target architecture

```
┌──────────────────────────────────────────────────────────────┐
│  Vercel (replaces GitHub Pages)                              │
│                                                              │
│  Next.js App Router                                          │
│  ├── app/[locale]/…        SSR/ISR pages (en | sw)           │
│  ├── app/api/…             API routes = the write path       │
│  │     contact / newsletter / event / story / upload         │
│  │     (Sanity write token lives ONLY in Vercel env vars)    │
│  └── lib/sanity.ts         next-sanity client (read: CDN)    │
│                                                              │
│  app/studio/… (or hosted)  Sanity Studio for editors         │
└──────────────────────────────────────────────────────────────┘
                     │ reads (ISR + on-demand revalidation)
                     ▼
        ┌─────────────────────────┐
        │  Sanity Content Lake    │  ← all content, media,
        │  + schemas + seed       │    bilingual fields, submissions
        └─────────────────────────┘
```

**Why this shape:** Next.js API routes are the server-side place the static site never had. The write token never touches the browser, forms write directly into Sanity (no Formspree), and pages render server-side for SEO in both languages. One framework, one host, one content store.

## 3. Decisions (resolved)

| # | Decision | Resolution | Why |
|---|---|---|---|
| **D1** | Studio hosting | **Hosted Studio** (`.sanity.io`); optionally embed under `app/studio` later | Editors don't need the repo or a deploy. |
| **D2** | Write path for uploads/submissions | **Next.js API routes** with token in Vercel env vars | Solves the token-leak problem natively; no deferred proxy phase. |
| **D3** | Contact / newsletter / event forms | **API routes → Sanity** (drop the Formspree plan) | One system instead of two; submissions become queryable documents with a `status` field. |
| **D4** | Bilingual content model | **`internationalized-array`** (fields `title.en` / `title.sw`) | Single document per item; matches how `setLang()` worked. |
| **D5** | Existing hardcoded content | **Seed script** pushing topics, resources, campaigns, work items into the dataset | Working site immediately; re-seedable anywhere. |
| **D6** | Hosting | **Vercel** replaces GitHub Pages | Pages can't run server code; Vercel gives previews per PR and env-var secrets. |
| **D7** | i18n routing | **Locale segment**: `/en/learn`, `/sw/learn`, middleware redirect by `Accept-Language` | Real per-language URLs and meta tags; SSR-able. |

## 4. Content model (Sanity schemas)

Registered in `sanity.config.ts`. Bilingual fields use the `{en, sw}` shape throughout.

### `resource` — Build page
```
title.i18n (string)          description.i18n (text)
category (select: template | toolkit | zine)
file (file)  |  externalUrl (url)     ← one required
langs (array: en, sw)                  ← drives the EN/SW dots
publishedAt (date)
```

### `topic` — Learn page (replaces `topicData`)
```
key (slug, e.g. "river")     title.i18n     intro.i18n
level (beginner|intermediate|advanced)
introVideo (file or url)                     ← replaces stock Google video
steps (array of { heading.i18n, body.i18n })
resource (reference → resource)              ← "related resource" card
```

### `campaign` — Act page cards
```
title.i18n   description.i18n   icon (string emoji)
tags (array<string>)    guideFile (file)
```

### `event` — Act page submissions (via API route)
```
name   location   date   organizerOrg
status (draft | approved)   submittedAt
```

### `workItem` — Our Work page
```
kind (podcast | documentary | blog)
title.i18n   publishedAt   lang (en|sw|both)
durationMinutes (number, podcasts only)
media (file or externalUrl)   thumbnail (image, docs/blogs)
body (portableText, blogs only)
```

### `story` — Share Your Story submissions
```
type (photo | template | blueprint | story | podcast | video)
name   email   title   description
attachments (array<file>)    status (draft|published)   submittedAt
```

### `message` — contact form / newsletter
```
kind (contact | newsletter)
name?   email   subject?   body?
status (new | handled)   submittedAt
```

### `settings` (singleton)
```
tagline.i18n   contactEmail   contactPhone   socialLinks (array of {network, url})
heroVideo (file)   bannerImage (image)
```
> One editable home for the placeholder phone, social links, and hero video.

## 5. Repo structure (after Phase 1)

```
Sheshi/
  app/
    [locale]/              # en | sw
      page.tsx             # Home
      learn/  build/  act/  work/  contact/
    api/
      contact/  newsletter/  event/  story/  upload/   # route handlers
    layout.tsx             # fonts, metadata, nav, footer
    globals.css            # ported design tokens from index.html
  components/              # TopicCard, ResourceGrid, Modal, Tabs, LangSwitch…
  lib/
    sanity.ts              # next-sanity client (read: public token/CDN)
    queries.ts             # GROQ
    i18n.ts                # en/sw dictionaries + locale helpers
  studio/                  # Sanity config, schemas/, seed.ts
  public/                  # logo.png, favicon, placeholder PDFs
  index.html               # legacy — kept until cutover, then deleted
  PLAN.md  PLAN.pdf
  .github/workflows/       # retired at cutover (Phase 6)
```

## 6. Phases

### Phase 1 — Scaffold the app
1. `create-next-app` (App Router, TypeScript, Tailwind *or* plain CSS — plain CSS recommended: port the existing stylesheet into `globals.css`).
2. Add `next-sanity` + `sanity` + `@sanity/locale`-style i18n plugin; create the Sanity project.
3. Locale routing: `app/[locale]` + middleware redirect; move nav/footer into layout components.
4. Port the 6 pages as static-rendered routes first (existing markup → JSX, CSS unchanged).
5. Retire nothing yet: `index.html` stays as the fallback until Phase 6 cutover.

**✅ Done when:** all 6 pages render in `next dev` in both locales, visually identical to today.

### Phase 2 — Schemas + seed (content model from §4)
1. Implement the 8 schemas + desk structure (Content / Submissions / Settings).
2. `seed.ts` porting `topicData` (6 topics × steps), 6 resources, 4 campaigns, 7 work items, `settings`.
3. Sanity TypeGen for typed queries.

**✅ Done when:** editors can create/edit all content in hosted Studio.

### Phase 3 — Data layer (reads)
1. `lib/sanity.ts` with pinned `apiVersion`, `useCdn: true`, token from `NEXT_PUBLIC_SANITY_*` env.
2. One query per page in `lib/queries.ts`; pages fetch server-side; ISR (e.g. 60s) + on-demand revalidation webhook from Sanity.
3. `setLang` locale switch becomes a route switch (`/en/…` ↔ `/sw/…`), preserving scroll/page state where trivial.
4. Graceful fallback: if Sanity is unreachable, render seeded static data — the site must never blank out.

**✅ Done when:** editing a document in Studio changes the live site; both locales read from CMS content.

### Phase 4 — Write paths (API routes)
1. `POST /api/contact`, `/api/newsletter`, `/api/event` → validate → create Sanity doc (`status: new`).
2. `POST /api/story` and `/api/upload` → multipart parse → Sanity asset upload → `story` doc.
3. Rate limiting (basic: IP throttle) + honeypot field; never log the token.
4. Forms get real success/error states (replace every `alert()`).
5. Studio desk gets a **Submissions** section with approve/publish workflow.

**✅ Done when:** a visitor submits a story; an editor sees it in Studio and publishes it; it appears on the site.

### Phase 5 — Content wiring
1. Downloads → Sanity files; "Get the Guide" → related topic; podcast play → real media or disabled state.
2. `settings` singleton drives footer contact, social links, hero video; delete placeholder phone/links.
3. Replace stock Google hero video with real media (or drop the player until it exists).

**✅ Done when:** every interactive element does something real or is visibly disabled — no dead buttons.

### Phase 6 — Ship hygiene + cutover
1. SEO: per-locale `generateMetadata` (title, description, OG/Twitter), favicon, sitemap, `robots.txt`.
2. Accessibility pass: nav/cards/filters → `<button>`/`<a>`, input labels, focus states, aria on icon-only controls.
3. `README.md` (run, env vars, deploy); extract remaining base64 assets to `public/`.
4. Deploy to Vercel with env vars; verify live URL in both locales.
5. **Delete `index.html` and the GitHub Pages workflow**; update any links/badges.

**✅ Done when:** live Next.js site replaces the Pages site; Lighthouse a11y ≥ 90; no `href="#"` anywhere.

### Phase 7 — Verification
1. Manual pass: 6 pages × 2 locales × desktop/mobile.
2. Failure cases: empty/huge submissions, invalid email, Sanity outage (fallback holds), API abuse (throttle kicks in).
3. Playwright smoke test in CI: nav + one CMS render + one form submit (mocked).

## 7. Risks / unknowns

| Risk | Mitigation |
|---|---|
| Write token leaked (env var mis-exposed) | Token only in server env (`SANITY_API_TOKEN`, no `NEXT_PUBLIC_` prefix); review gate in Phase 6 |
| Sanity free-tier API/CDN limits | ISR + `useCdn`, one query per page, no polling, revalidation webhook not polling |
| Migration breaks visual parity | Phase 1 criterion is "visually identical"; port CSS wholesale before touching content |
| i18n complexity creep | Two locales only, one `locale` segment, no region variants |
| Vercel free-tier limits (function duration, bandwidth) | Submissions are tiny; media served from Sanity's CDN, not Vercel |
| Sanity SDK/API drift | Pin `apiVersion`, follow current docs at execution time |
| Big-bang cutover risk | `index.html` remains deployable until Phase 6; rollback = revert the Pages workflow |

## 8. Suggested execution order

```
Phase 1 (scaffold + visual parity)
  ──► Phase 2 (schemas + seed)
  ──► Phase 3 (reads)
  ──► Phase 4 (writes)        ← forms become real here
  ──► Phase 5 (content wiring)
  ──► Phase 6 (SEO + a11y + cutover to Vercel, retire Pages)
  ──► Phase 7 (verification)
```

Estimated effort: Phase 1–2 ≈ 1–2 days, Phase 3–5 ≈ 2–3 days, Phase 6–7 ≈ 1 day. Each phase ends green and deployable; the legacy site stays up until cutover.
