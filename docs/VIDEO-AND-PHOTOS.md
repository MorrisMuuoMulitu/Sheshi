# Video and photography guide

## Videos — already fixed

The six topic videos were uploaded as **masters totalling about 1.5 GB**
(78–433 MB each), which is far too heavy to stream. They have been re-encoded
to 720p and the topic documents now point at the smaller files:

| Module | Before | After |
|---|---|---|
| Environmental Impact Assessments | 432 MB | 24 MB |
| Effluent Waste Management | 360 MB | 20 MB |
| Solid Waste Management | 343 MB | 17 MB |
| Water Quality Management | 186 MB | 10 MB |
| Air Quality Management | 111 MB | 5 MB |
| National Environmental Management Authority | 78 MB | 6 MB |
| **Total** | **1.5 GB** | **82 MB** |

The originals are still in the dataset — nothing was deleted, so this is
reversible.

**When you add a new video, export it small first:** 720p, H.264, MP4, around
10–30 MB. In HandBrake use the *Fast 720p30* preset with quality around 26.

If one slips through oversized, a developer can shrink it in place:

```bash
SANITY_API_WRITE_TOKEN=... ./scripts/reencode-videos.sh
```

It downloads each oversized topic video, re-encodes it to 720p, uploads the
result and repoints the topic — then `npm run audit:cms` confirms nothing is
over 25 MB.

---

## Photography

The site's photographs are freely licensed placeholders from Wikimedia Commons
(credited at `/[locale]/credits`). They are **not** Enviro-Hension's own work.

You can replace them yourself, without a developer:

- **Home page hero:** Studio → ⚙️ Settings → Brand → **Home page hero
  photograph**. Wide landscape, about 2400 × 1350.
- **A module's card photo:** Studio → 🎓 Topics → open a topic → **Card photo**.
  Landscape, about 1600 × 1000.

Leave either empty and the site falls back to what it has now, so nothing
breaks while you are part-way through.
