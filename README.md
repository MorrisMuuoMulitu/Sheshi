# Enviro-Hension

A bilingual (English / Kiswahili) capacity-building platform for environmental
community leaders in Kenya — learn, build, act.

Built with **Next.js 16** (App Router, Cache Components), **Sanity** as the
headless CMS, and deployed on **Vercel**. All site content — topics, resources,
campaigns, work items, settings — is editable in the hosted Studio; community
submissions (stories, events, messages, newsletters) arrive as documents with
`status: new` and are reviewed/published from the Studio.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16.4 (App Router, `cacheComponents`, `proxy.ts` locale routing) |
| CMS | Sanity (`i9s1a5ax` / dataset `production`), hosted Studio |
| Styling | Hand-written CSS design system (`app/styles/*.css`, layered tokens) |
| Typography | Fraunces (display) + Andika (body), self-hosted via `next/font` |
| Icons | `lucide-react` SVG + a hand-rolled brand set (`components/ui/SocialIcons.tsx`) |
| Theming | Light + dark, token-driven, persisted in `localStorage` |
| i18n | `/en/…` and `/sw/…` route segments, EN→SW fallback for CMS fields |
| Deploy | Vercel |

## Design system

The UI is built on a four-layer token system in `app/styles/`:

| File | Layer | Contains |
|---|---|---|
| `tokens.css` | primitives → semantic | Colour ramps, semantic surface/text tokens, type scale, 4/8pt spacing, radii, elevation scale, motion tokens, z-index scale |
| `base.css` | reset + document | Reset, typography defaults, layout/type utilities, a11y utilities (`.sr-only`, `.skip-link`), motion + reduced-motion, print styles |
| `components.css` | components | Buttons, cards, badges, chips, forms, nav, drawer, footer, modals, skeletons |
| `pages.css` | page layouts | Home hero, page headers, Learn/Build/Act/Work/Contact layouts, responsive rules |

**Rules**

- Never hardcode a hex, radius, shadow or duration in a component — reference a token.
- Inverse surfaces (`--bg-inverse`) stay dark in *both* themes: the footer and page
  headers are a brand surface, not a light/dark mirror.
- All icons are SVG. Emoji are never used as structural icons. CMS `icon`
  fields still hold legacy emoji — `components/ui/Icon.tsx` maps them to SVG.
- Every page has exactly one `h1`, a skip link, and visible form labels.
- Motion respects `prefers-reduced-motion`; scroll reveals are hidden only when
  scripting is enabled, so content is never invisible without JS.

**Dark mode** — `data-theme` on `<html>`, resolved before first paint by an inline
script (`components/ui/ThemeScript.tsx`), toggled by `components/ui/ThemeToggle.tsx`.
With no stored preference the OS `prefers-color-scheme` is followed.

**Type** — Fraunces is a warm editorial serif with optical sizing, used for
display. Andika is a dyslexia-aware sans with wide apertures and a large
x-height, used for body copy — it keeps long-form instructions legible for
the community audience and in Kiswahili, on low-end Android and on paper.


## Getting started

```bash
npm install
cp .env.example .env.local   # or create .env.local with the vars below
npm run dev                  # http://localhost:3000
```

The seed data and CMS reads work read-only without a token. Form submissions
need a write token (see below).

### Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | build | Sanity project id (defaults to `i9s1a5ax`) |
| `NEXT_PUBLIC_SANITY_DATASET` | build | Dataset name (defaults to `production`) |
| `SANITY_API_WRITE_TOKEN` | forms | Editor token for `/api/contact`, `/api/event`, `/api/story`, `/api/upload` |
| `REVALIDATE_SECRET` | webhook | Shared secret for `POST /api/revalidate` |
| `NEXT_PUBLIC_SITE_URL` | SEO | Canonical site URL (e.g. `https://envirohension.vercel.app`) |

Create a write token with:

```bash
npx sanity tokens add "Vercel write token" --role editor
```

In development, if `SANITY_API_WRITE_TOKEN` is unset, the app falls back to
your local `npx sanity login` session — production never does.

### Content & Studio

- Hosted Studio: <https://envirohension.sanity.studio/>
- Local Studio: `npm run studio`
- Seed (idempotent, upserts deterministic ids + placeholder PDFs):
  ```bash
  npm run seed
  ```
- Verify seeded bilingual fields: `npm run verify`
- Regenerate types after schema/query changes:
  ```bash
  npm run schema:extract -- --force
  npm run typegen
  ```

### Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run lint` | ESLint |
| `npm run studio` | Local Sanity Studio |
| `npm run studio:deploy` | Deploy the hosted Studio |
| `npm run seed` | Seed/refresh content (idempotent) |
| `npm run verify` | Check seeded bilingual content |
| `npm run schema:extract` / `npm run typegen` | Schema JSON + TypeScript types |

## Content model

| Document | Surface |
|---|---|
| `topic` | Learn modules (grid + step-by-step detail, topic video, kit download) |
| `resource` | Build library (filters, download button) |
| `campaign` | Act page (guide download / related topic) |
| `workItem` | Our Work (podcast episodes, documentaries, blog cards) |
| `story` | Community submissions → published stories on Our Work |
| `event`, `message` | Submissions inbox (Act page + contact/newsletter forms) |
| `settings` | Footer contact/socials, tagline, hero video, Learn intro video, newsletter blurb |

Bilingual fields use the `internationalized-array` plugin: English is always
present; Kiswahili is optional and readers fall back to English.

## Write paths (forms)

All public write routes validate input, enforce a honeypot and a per-IP
throttle (8 requests / 10 minutes / server instance), and never log the token:

| Route | Outcome |
|---|---|
| `POST /api/contact` | `message` (channel: contact, `status: new`) |
| `POST /api/newsletter` | `message` (channel: newsletter) |
| `POST /api/event` | `event` (`status: new`) |
| `POST /api/story` | uploads attachments → `story` (`status: new`) |
| `POST /api/upload` | file or URL → `story` (`status: new`) |

Publishing a story in the Studio (status → `published`) makes it appear on the
Our Work page after revalidation.

On Vercel, serverless request bodies are capped at ~4.5 MB; larger media should
be linked (upload modal accepts a URL) or uploaded in the Studio.

## Revalidation

Pages use `'use cache'` with the `cms` tag (1-minute lifetime). Call the
webhook to mark cached data stale (also wired as a Sanity document webhook on
this project — all create/update/delete events):

```bash
curl -X POST https://<site>/api/revalidate \
  -H "x-revalidate-secret: $REVALIDATE_SECRET" \
  -H "content-type: application/json" -d '{}'
```

`revalidateTag("cms", { expire: 0 })` plus `revalidatePath("/", "layout")` mark
the data and route caches stale. On Vercel the edge copy of a fully prerendered
page is refreshed on the next visit after the 1-minute `cacheLife` window, so
published edits appear within about a minute without a redeploy.

## Deploy

1. Import the repository in Vercel and set the environment variables above.
2. Deploy:
   ```bash
   vercel --prod
   ```
3. Add the Sanity webhook (project → API → Webhooks):
   `https://<site>/api/revalidate` with header
   `x-revalidate-secret: <REVALIDATE_SECRET>`, triggered on create/update/delete.

## Project structure

```
app/
  [locale]/            # en + sw routes (layout, home, learn, build, act, work, contact)
    loading.tsx       # route-level skeleton
    error.tsx         # route-level error boundary
  api/                 # contact, newsletter, event, story, upload, revalidate
  styles/              # design system: tokens → base → components → pages
  not-found.tsx        # global 404
  sitemap.ts, robots.ts
components/
  Nav, Footer, Modals
  pages/               # client views receiving localized data as props
  ui/                  # Icon, Reveal, Skeleton, ThemeToggle, ThemeScript, SocialIcons
lib/
  cms.ts               # cached data getters (Sanity → view models, fallbacks)
  queries.ts           # GROQ queries (typed by TypeGen)
  sanity.ts            # read client
  sanityWrite.ts       # write client (token resolution)
  api.ts               # validation, rate limit, honeypot, error mapping
  i18n.ts              # EN/SW UI dictionary
schemaTypes/           # Sanity schemas + desk structure
scripts/               # seed.ts, verify.ts
proxy.ts               # locale routing (/ → /en or /sw)
tests/                 # smoke.spec.ts (legacy) + uiux.spec.ts (design-system a11y)
```

## Tests

```bash
npm run test:e2e                       # smoke + UI/UX regression suite
E2E_PORT=3115 npm run test:e2e         # move the test server off a busy port
```

`tests/uiux.spec.ts` covers the design-system contract: skip link, one `h1`
per page, theme toggle + persistence, SVG-only icons, drawer and modal focus
trapping, filter state, visible labels, no horizontal overflow at 375px, and
reduced-motion behaviour.
