# Shrinking the topic videos

## Why

The six topic videos currently in the Studio total **about 1.5 GB**:

| Module | Size |
|---|---|
| Environmental Impact Assessments | 433 MB |
| Effluent Waste Management | 360 MB |
| Solid Waste Management | 344 MB |
| Water Quality Management | 187 MB |
| Air Quality Management | 111 MB |
| The National Environmental Management Authority | 78 MB |

Someone opening one of those on a phone in Kenya will wait a very long time —
or give up. On mobile data a 400 MB file can also cost real money.

**Target: 10–30 MB per video.** That is still good quality for a phone screen
and it makes the site usable on 3G.

You do not need to re-record anything. You are only re-exporting the same video
at a smaller size.

---

## Option A — HandBrake (no command line)

1. Download HandBrake free from <https://handbrake.fr>.
2. Drag the video into HandBrake.
3. Choose the **Fast 720p30** preset.
4. On the **Video** tab, drag **Quality** to about **26**.
5. Press **Start**. A 400 MB video becomes roughly 20–40 MB.
6. In the Studio, open the topic → **Topic video (upload)** → upload the new
   file. It replaces the old one automatically.

Repeat for each module. Ten minutes each.

---

## Option B — one command per file (ffmpeg)

If ffmpeg is installed (`brew install ffmpeg` / `sudo apt install ffmpeg`):

```bash
ffmpeg -i "EFFLUENT WASTE MANAGEMENT.mp4" \
  -vf "scale=-2:720" \
  -c:v libx264 -preset slow -crf 26 \
  -c:a aac -b:a 96k \
  -movflags +faststart \
  effluent-720p.mp4
```

What each part does:

| Flag | Meaning |
|---|---|
| `scale=-2:720` | 720p tall, width calculated to keep the aspect ratio |
| `crf 26` | quality target — lower is better/bigger. 23 = best, 28 = smallest |
| `-movflags +faststart` | lets the browser start playing before the whole file downloads |

To do every video in one go:

```bash
mkdir -p encoded
for f in *.mp4; do
  ffmpeg -i "$f" -vf "scale=-2:720" -c:v libx264 -preset slow \
    -crf 26 -c:a aac -b:a 96k -movflags +faststart "encoded/$f"
done
```

Then upload each `encoded/*.mp4` to its topic in the Studio.

---

## How to check you got it right

```bash
npm run audit:cms
```

Anything still over 25 MB is listed under **“Video files over 25 MB”**. When
that section disappears, the videos are fine.

---

## While you are in there

The site now does **not load a topic video until someone presses play**. So a
visitor arriving on a module page downloads nothing until they ask for the
video. That makes the site usable today — but a 400 MB file still will not play
on a slow connection once pressed, so the re-encode is still worth doing.

---

## Also worth adding

The site uses placeholder photographs from Wikimedia Commons (credited on
`/en/credits`). They are **not** Enviro-Hension's own work.

Once you have real photographs of your own work, you can replace them without a
developer:

- **Home page hero:** Studio → ⚙️ Settings → Brand → **Home page hero
  photograph**. Wide landscape, about 2400 × 1350.
- **A module's card photo:** Studio → 🎓 Topics → open a topic → **Card photo**.
  Landscape, about 1600 × 1000.

Leave either empty and the site falls back to its bundled picture, so nothing
breaks while you are part-way through.
