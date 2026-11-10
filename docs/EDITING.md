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

## 5. Submissions

**Studio → Submissions**

Stories, events and messages arrive here when someone uses a form on the site.
They are **not public** until you open a story and change **Status** to
**Published** — then it appears under “Community Stories” on the Our Work page.

---

## 6. For the developer: one-time setup

Live preview needs two settings that must match on both sides.

**On the website (Vercel → Project → Settings → Environment Variables):**

| Variable | Purpose |
|---|---|
| `SANITY_PREVIEW_SECRET` | Shared password for the preview handshake. Any long random string. |
| `SANITY_API_READ_TOKEN` | Lets the site read unpublished drafts. Create with `npx sanity tokens add "Preview" --role viewer`. |

**On the Studio (Vercel → the Studio project → Environment Variables,
or `.env` locally):**

| Variable | Value |
|---|---|
| `SANITY_STUDIO_PREVIEW_URL` | The site origin, e.g. `https://envirohension.vercel.app` (no trailing slash). |
| `SANITY_STUDIO_PREVIEW_SECRET` | **The same value** as `SANITY_PREVIEW_SECRET` above. |

Then redeploy both. Open the Studio → “Live preview”.

Locally, `SANITY_STUDIO_PREVIEW_URL=http://localhost:3002` and run
`npm run dev` and `npm run studio` at the same time.

### Content health check

```bash
npm run audit:cms
```

Reports duplicate keys, broken relations, missing files, oversized videos, and
items with no Kiswahili title. Run it before a big content push.
