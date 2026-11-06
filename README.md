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
| Styling | Hand-written CSS (`app/globals.css`) — legacy visual design preserved |
| i18n | `/en/…` and `/sw/…` route segments, EN→SW fallback for CMS fields |
| Deploy | Vercel |

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
  api/                 # contact, newsletter, event, story, upload, revalidate
  sitemap.ts, robots.ts
components/
  Nav, Footer, Modals
  pages/               # client views receiving localized data as props
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
```
