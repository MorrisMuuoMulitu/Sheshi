# Editing guide — Enviro-Hension

A short guide for editing the site in Sanity Studio, written for the content
team. No developer needed for anything in the first two sections.

---

## 1. Live preview (see what you're editing)

**Studio → “Live preview” (left-hand menu).**

This is the Sanity Presentation tool. It puts the real page next to the
document you are editing:

- Change a field on the left → the preview on the right updates.
- **Click any piece of text in the preview** → it jumps to that field in the
  editor.
- Nothing you see here is public until you press **Publish**.

If the preview pane is blank or shows the published site instead of your draft,
the two settings below are missing — see §6.

---

## 2. The two intro videos

She asked: *“for the intro videos on the homepage and on the Learn page — where
and how do I add those?”*

**Studio → ⚙️ Settings → Intro videos tab.**

There are two slots:

| Slot | Where it appears |
|---|---|
| **Home page video** | Beside the headline on the home page (the “Watch: Our Story” player) |
| **Learn page intro video** | The wide player at the top of the Learn page (“Introduction to Environmental Action”) |

Each slot gives you **two options**:

1. **Upload (preferred)** — drag an MP4 or WebM file straight into the field.
2. **…or link to a video file** — only used if nothing is uploaded. This must be
   a **direct link to a `.mp4`/`.webm` file**. A YouTube or Vimeo page link will
   **not** play — those are web pages, not video files.

If you leave a slot empty, the page simply hides the video and shows the logo
instead. Nothing breaks.

### ⚠️ Keep video files small

The topic videos currently uploaded are **78 MB to 433 MB each** (about 1.5 GB
in total). A 400 MB file will not play on a phone on Kenyan mobile data — the
viewer gives up before it starts.

Please re-export videos before uploading:

- **720p** (1280×720) is plenty for a phone screen.
- **H.264 / MP4**, around **2–4 Mbps**.
- Target **10–30 MB per module** (under 5 minutes).

On a Mac you can use HandBrake or QuickTime (File → Export → 720p). On Windows,
HandBrake or the built-in Photos app. Anyone on the team can do this — it is
just “export smaller”.

---

## 3. Topics (the Learn page)

**Studio → Content → 🎓 Topics**

Each topic becomes one card on the Learn page, and its own detail page with the
video and the step-by-step guide.

- **Title / card description / step pill** — shown on the card. There is an
  English and a Kiswahili tab; if Kiswahili is empty the site falls back to
  English.
- **Icon** — the small symbol on the card. The colour of the card is chosen
  automatically from the icon, so you do not need to pick one.
- **Steps** — add as many as you need, in order. Each has a heading and a body.
- **Topic video (upload)** — the video shown on that topic's page.
- **Related resource** — which library resource powers the “Download Kit”
  button.

---

## 4. Resources (the Build page)

**Studio → Content → 📦 Resources**

- **Category** — Template, Toolkit, or Zine. This drives the filter buttons.
- **File** — the PDF that the Download button serves.
- **Languages** — tick the languages the file is available in.
- **Order** — the position in the grid.

The four most recently edited resources also appear on the home page under
“Latest resources”.

---

## 4b. Viewing files without downloading

Resource cards now have **View** (opens the PDF inside the site) next to a
small download button. The same applies to a module's resource kit and a
campaign guide. The viewer also shows the file type, and offers Download and
"New tab" in its header.

On a phone the viewer fills the screen; the close button is top-right.

---

## 5. Submissions

**Studio → Submissions**

Stories, events and messages arrive here when someone uses a form on the site.
They are **not public** until you open a story and change **Status** to
**Published** — then it appears under “Community Stories” on the Our Work page.

---

## 6. For the developer: one-time setup

Live preview needs four values. **The site and the Studio are two different
deployments**, and they are configured in two different places:

| Deployment | Where it lives |
|---|---|
| **The site** | Vercel project `envirohension` → <https://envirohension.vercel.app> |
| **The Studio** | Sanity-hosted (app id `yc5wxc49hjvlhigq7vilwll3`) → deployed with `npm run studio:deploy` |

### Step 1 — the site (Vercel)

Vercel → project **envirohension** → **Settings → Environment Variables**.

| Variable | Value |
|---|---|
| `SANITY_API_READ_TOKEN` | A **viewer**-role token from the Sanity project. Create it with `npx sanity tokens create "Preview (drafts read)" --role viewer`. |
| `SANITY_PREVIEW_SECRET` | A long random string you generate. Treat it as a password. |

Set both for **Production** (and Preview if you deploy previews), then
**redeploy** — Vercel only applies env changes to new builds.

### Step 2 — the Studio (Sanity-hosted)

A Sanity-hosted Studio is a static bundle: its variables are baked in **at
deploy time**, not set on a dashboard. So:

1. Put them in `.env.local` (or `.env.production`) in this repo:

   ```bash
   SANITY_STUDIO_PREVIEW_URL=https://envirohension.vercel.app
   SANITY_STUDIO_PREVIEW_SECRET=<the same value as SANITY_PREVIEW_SECRET>
   ```

2. Redeploy the Studio:

   ```bash
   npm run studio:deploy
   ```

> The `SANITY_STUDIO_` prefix is required, not cosmetic: Sanity only inlines
> variables with that prefix into the Studio bundle. A bare
> `SANITY_PREVIEW_SECRET` is invisible to `presentationTool`, and preview then
> fails with a 401.

### Step 3 — check it

Open the Studio → **Live preview**. Edit a field; the pane should update.

If it shows the *published* page instead of your edit, `SANITY_API_READ_TOKEN`
is missing or is not a viewer token.

### A trade-off you should know about

Because the Studio is a public static bundle, `SANITY_STUDIO_PREVIEW_SECRET` is
readable by anyone who inspects it. That means a determined person could enable
draft mode on the site and read **unpublished drafts**. For this project that is
a low risk (it exposes drafts, not credentials, and drafts are content you
intend to publish). If that is not acceptable, the alternative is to gate
`/api/draft-mode/enable` behind your own auth instead of a shared secret.

### What the preview does and does not do

- **Works:** the pane shows the real page and refreshes as you edit, including
  unpublished changes (it reads drafts through `SANITY_API_READ_TOKEN`).
- **Does not work yet:** clicking an element in the preview to jump to the
  matching field. That needs the page's text to be stega-encoded and an
  overlay script mounted; it is a separate piece of work.

### Videos and photographs

See **[VIDEO-AND-PHOTOS.md](VIDEO-AND-PHOTOS.md)** for how to shrink the topic
videos (they are currently ~1.5 GB in total) and how to swap the placeholder
photography for Enviro-Hension's own, from the Studio.

### Content health check

```bash
npm run audit:cms
```

Reports duplicate keys, broken relations, missing files, oversized videos, and
items with no Kiswahili title. Run it before a big content push.
