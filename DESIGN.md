---
version: alpha
name: Enviro-Hension-design-analysis
description: "A field-guide design language for a bilingual Kenyan environmental capacity platform. Warm paper and sage fields hold documentary photography and numbered sections; deep forest carries every commitment action. Plus Jakarta Sans speaks for the system, Andika speaks for the reader. No decorative color: ochre and clay appear only where a topic owns them."

colors:
  # brand surfaces
  sage-field: "#dfecbe"      # the logo field — brand signature
  sage-soft: "#f6faea"
  sage-light: "#eaf4d4"
  sage-line: "#c9dfa0"
  forest-deep: "#14210c"     # inverse surfaces (footer, page heads)
  forest-ink: "#0c1407"
  forest: "#325220"          # primary action
  forest-hover: "#274018"
  # canvas + neutrals (warm paper, never cool grey)
  canvas: "#fbfaf6"
  canvas-raised: "#ffffff"
  canvas-sunken: "#f4f2ea"
  ink: "#11110d"
  ink-muted: "#4f4c41"
  ink-subtle: "#6b6759"
  hairline: "#e2dfd2"
  hairline-strong: "#cbc7b6"
  # topic identities — only place these are allowed
  topic-sage: "#aecb7c"
  topic-water: "#84c4cc"
  topic-waste: "#e5a885"
  topic-energy: "#eec76b"
  topic-air: "#f6dd9c"
  # semantic
  danger: "#a3271b"
  success: "#236341"

typography:
  display: "Plus Jakarta Sans, system-ui, sans-serif"
  body: "Andika, system-ui, sans-serif"
  mono: "ui-monospace, SFMono-Regular, Menlo, monospace"
  scale:
    xs: "0.75rem"
    sm: "0.875rem"
    base: "1rem"
    md: "1.0625rem"
    lg: "1.25rem"
    xl: "1.5rem"
    2xl: "clamp(1.5rem, 1.15rem + 1.5vw, 2rem)"
    3xl: "clamp(1.875rem, 1.35rem + 2.2vw, 2.75rem)"
    4xl: "clamp(2.25rem, 1.5rem + 3.2vw, 3.75rem)"
    5xl: "clamp(2.5rem, 1.6rem + 4vw, 4.25rem)"

shape:
  radius-xs: "8px"
  radius-sm: "12px"
  radius-md: "16px"
  radius-lg: "22px"
  radius-xl: "30px"
  radius-full: "999px"

motion:
  fast: "120ms"
  base: "200ms"
  slow: "320ms"
  ease: "cubic-bezier(0.22, 0.61, 0.36, 1)"
---

# Design System — Enviro-Hension

## 1. Visual Theme & Atmosphere

This is a **field guide, not a brochure**. The people who use it are community
leaders standing in a catchment area, on a low-end Android, in English or
Kiswahili. The interface should feel like a well-made handbook that someone
printed, folded, and carried into the field: warm paper, clear numbering,
hairline rules, documentary photographs with honest captions.

The canvas is **warm off-white paper** (`#fbfaf6`), never cool grey. Sage
(`#dfecbe`) — the exact field of the brand mark — is the brand surface: it
belongs to the navigation, the brand bands, and active states, nothing else.
**Deep forest** (`#14210c`) is the commitment surface: page headers, the footer,
the hero scrim, and any band that asks the reader to act. Those inverse
surfaces stay dark in both themes because they are brand surfaces, not a
light/dark mirror.

Photography carries the emotional weight. The system deliberately has no
illustration style, no gradients-as-decoration, no glassmorphism. The only
"graphic" gestures are **numbered sections**, **hairline rules**, and **topic
terrain colors** — the last of which are a content system (each topic's icon
maps to a terrain), not a palette to decorate with.

**Key characteristics**

- Warm paper canvas with a sage brand bar and a forest action band
- Plus Jakarta Sans for the system voice (headings, UI, labels); Andika for the
  reader's voice (long-form body). One family never does the other's job.
- Uppercase + `0.14em` tracking is reserved for **eyebrows and metadata only**.
  Buttons, links and navigation are sentence case.
- Documentary photography at full-bleed or 16:9 card media; text sits on a
  forest scrim, never directly on a busy photo.
- Numbered modules (`01`, `02`, `03`) and section eyebrows with a 24px rule —
  the field-guide signature.
- 4/8pt spacing, generous but rhythmic: `--section-y` between sections,
  no extra hero gap on inner pages.
- Two accents only: forest for action, ochre for attention. Clay and water are
  topic identities.

## 2. Color Palette & Roles

### Brand surfaces

| Token | Value | Role |
|---|---|---|
| `--sage-200` | `#dfecbe` | The logo field. Nav background, brand bands, primary-on-dark CTA in dark theme. |
| `--sage-50` / `--sage-100` | `#f6faea` / `#eaf4d4` | Soft brand tint for selected rows, icon tiles, quiet emphasis. |
| `--forest-900` | `#14210c` | Inverse band: footer, page headers, impact/share bands. |
| `--forest-950` | `#0c1407` | Scrim base; the darkest ink. |

### Canvas & ink

| Token | Value | Role |
|---|---|---|
| `--bg` | `#fbfaf6` | Page canvas. Warm, never `#fff`. |
| `--bg-elevated` | `#ffffff` | Cards, inputs, sheets. |
| `--bg-sunken` | `#f4f2ea` | Wells, thumbnails, quiet chips. |
| `--text` | `#11110d` | Primary text. |
| `--text-muted` | `#4f4c41` | Body secondary, card descriptions. |
| `--text-subtle` | `#6b6759` | Metadata, timestamps. |

### Action

| Token | Value | Role |
|---|---|---|
| `--btn-primary-bg` | `#274018` | Primary button (light theme). |
| `--accent` | `#325220` | Links, focus, active icon. |
| `--accent-warm` | `#a06f18` | "Attention" moments only: event CTA, new-content banner. Never both accents in one component. |

### Topic identities (content system, not decoration)

A topic's terrain is derived from its icon, not from the page:

| Terrain | Light stops | Dark stops |
|---|---|---|
| field / sage | `#dfecbe → #aecb7c` | `#25321a → #3c5027` |
| water | `#b6dde1 → #55a3af` | `#14302f → #1f4a4f` |
| waste / clay | `#f2cbb4 → #d4855a` | `#3a2419 → #5b3a26` |
| energy / ochre | `#f6dd9c → #e0ac3c` | `#3a3017 → #5a4a1f` |
| green / forest | `#c9dfa0 → #3f6628` | `#233317 → #33501f` |
| air | `#fbeecd → #eec76b` | `#37301b → #574923` |

**Rule:** these six pairs are the *only* place ramps are allowed to meet. Never
use `--clay-*` or `--water-*` for buttons, borders, or section backgrounds.

### Dark theme

Dark is a **paired palette**, not an inversion: `#131710` canvas, `#1c2118`
cards, sage text accents, shadows deepened rather than removed. Inverse bands
go one step darker (`#0b0f07`). Topic media uses the dark stops above — never
the light gradients.

## 3. Typography Rules

### Families

- **Display / UI — Plus Jakarta Sans** (`var(--font-display)`): every heading,
  every button, nav link, badge, chip, form label, eyebrow, and numeric stat.
- **Body — Andika** (`var(--font-body)`): paragraphs, list copy, CMS long-form,
  quotations, form inputs. Andika is chosen for wide apertures and a large
  x-height; it is a reading face and must not be used as UI chrome.
- **Mono**: only for literal code or file sizes. Not a decorative label face.

### Hierarchy

| Role | Family | Size | Weight | Line height | Tracking |
|---|---|---|---|---|---|
| Hero h1 | Display | `clamp(2.35rem … 4.15rem)` | 700 | 1.03 | -0.03em |
| Page h1 | Display | `--fs-4xl` | 700 | 1.08 | -0.03em |
| Section h2 | Display | `--fs-3xl` | 700 | 1.1 | -0.02em |
| Card h3 | Display | `--fs-lg` | 600 | 1.25 | -0.02em |
| Lede | Body | `--fs-md`–`--fs-lg` | 400 | 1.7 | normal |
| Body | Body | `--fs-base` | 400 | 1.7 | normal |
| UI label (button/nav/chip) | Display | `--fs-sm` | 600 | 1.2 | 0 |
| Eyebrow / meta | Display | `--fs-xs` | 700 | 1.2 | 0.14em, uppercase |
| Stat numeral | Display | `clamp(1.4rem … 1.9rem)` | 700 | 1 | -0.03em, tabular |

### Principles

- **One uppercase voice.** Uppercase is a signalling device: it marks an
  eyebrow or metadata. If seven elements on a screen are uppercase, none of them
  signal anything.
- **Body measure is 62ch** (`--measure`), narrow 46ch for ledes. Never let body
  copy run the full container width.
- **Display tracking tightens with size**; body tracking stays `normal` in both
  languages. Kiswahili words are longer — never add display tracking to body.
- **Numbers align.** Counters and step pills use `font-variant-numeric:
  tabular-nums`.
- **Bilingual by design.** EN and SW are peers: never shrink the inactive
  language below 12px or grey it past 4.5:1.

## 4. Component Stylings

### Buttons

One hierarchy. Primary is forest on paper, sage on forest; secondary is an
outline of the same weight; tertiary is a sentence-case link with a sliding
arrow. Nothing else.

| Variant | Background | Text | Border | Use |
|---|---|---|---|---|
| Primary | `--btn-primary-bg` | `--btn-primary-fg` | none | The one commitment on a surface |
| Secondary | transparent | `--text` / `--text-on-dark` | `--border-strong` / `--border-inverse` | Alternate path ("Get the tools") |
| Ghost | transparent | `--text-muted` | none | Inline, low-stakes |
| Link | none | `--text` | bottom `--border-strong` | "See all modules →" |

- Radius: `--radius-full`. Min height `--tap-min` (44px), `52px` for `btn-lg`.
- Label: **sentence case**, display face, 600, `--fs-sm`, no letter-spacing.
- Padding: `12px 24px`; `16px 32px` for large.
- Hover: one step darker (primary) or `--accent` outline (secondary); never a
  color family jump.
- Disabled: `opacity: 0.45`, no transform. A disabled control never looks like
  a secondary control.

### Cards

Every card is a **flex column with a pinned footer**, so a grid row aligns even
when descriptions and tag rows differ.

- Surface `--bg-elevated`, 1px `--border`, `--radius-lg`, `--shadow-sm`.
- Media: fixed `aspect-ratio` (16/9 or 16/10), `object-fit: cover`. Never a
  variable-height media band.
- Body padding `--space-5`, gap `--space-2`.
- Title display 600 `--fs-lg`; description `--fs-sm` `--text-muted`, clamped to
  3–4 lines.
- Footer (tags + CTA) sits on `margin-top: auto`; tag rows reserve two rows of
  height so CTAs never stagger.
- Hover: `translateY(-4px)`, `--shadow-lg`, border strengthens. No color flood.

### Badges & chips

- Badges are metadata: uppercase, 12px, `--tracking-wide`, pill.
- Chips are filters: uppercase 12px, 40px tall, active state is solid ink with
  sage text. Chips are the only uppercase interactive control.
- Never use a badge as a CTA.

### Forms

- Visible labels above every field (uppercase 12px display), hints below.
- Inputs: `--bg-elevated`, `--border-strong`, `--radius-sm`, 44px min height,
  body face at 16px (prevents iOS zoom).
- On inverse surfaces: background `color-mix(sage 10%)`, border
  `rgba(240,243,231,0.28)`, placeholder `rgba(240,243,231,0.55)`, focus sage.
- Focus is a 3px `--focus-ring` ring at 25% opacity; never remove focus outline.

### Hero

- Full-bleed documentary photograph, `object-position` chosen per image.
- Forest scrim: strong at the copy corner, clearing to the opposite corner.
- Content in the lower half; eyebrow → h1 → lede → two actions, max 44rem.
- One stats row maximum per page. Never repeat the same numbers in a second band.

### Navigation

- 64px bar, sage, blurred; transparent over the home hero and flipping to
  light-on-dark.
- Sentence-case links in the display face; active page is a solid pill.
- Six items maximum; mobile collapses to a drawer, not a scrollable row.
- The language switcher is a segmented control and is always reachable.

### Page header (inner pages)

- A deep photographic band (roughly 240–320px) with a forest scrim, or solid
  forest when no image.
- Eyebrow with 24px rule, h1, lede. The band's bottom edge is the next section's
  top edge — no empty spacer under it.

## 5. Layout Principles

- Container `76rem`, wide `92rem`, prose `44rem`, gutter `clamp(1.25rem … 3.5rem)`.
- Spacing is 4/8pt. Section rhythm is `--section-y`; card gaps are `--space-5`.
- **Fill the grid.** If a category has four items, design for 2×2 or feature one
  card across two columns. An orphan tile in a three-column grid is a bug.
- Two-column splits are 1.15 / 0.85 (hero) or 1 / 1.05 (contact); never 50/50
  for text + form.
- Section heads are a two-column row: eyebrow + h2 + lede on the left, the
  section-level link aligned to the baseline on the right.
- Text blocks never exceed `--measure`; media may bleed.
- Vertical rhythm beats decoration: when a section feels empty, increase the
  scale of one element, not the number of elements.

## 6. Depth & Elevation

| Token | Use |
|---|---|
| `--shadow-xs` | Inputs, small tiles |
| `--shadow-sm` | Cards at rest |
| `--shadow-md` | Sticky bars, hover on rows |
| `--shadow-lg` | Card hover, inverse bands |
| `--shadow-xl` | Modals, viewer |

Shadows are warm and green-tinted (`rgba(28,30,20,…)`), never pure black. On
dark surfaces shadows are near-black and deeper. Elevation communicates
interactivity; it is never used to separate page sections (use tone instead).

Z-index follows the token scale only: nav 100, dropdown 200, drawer 300,
modal 400, toast 500.

## 7. Do's and Don'ts

**Do**

- Use real photography with a forest scrim and an honest alt text.
- Number modules and sections; the field-guide index is the signature.
- Keep one primary CTA per surface; make the second path secondary.
- Use topic terrains only inside topic media.
- Reserve uppercase for eyebrows, metadata and filter chips.
- Let Andika do the reading and Plus Jakarta do the pointing.
- Test every surface in both themes and both locales before shipping.

**Don't**

- Don't hardcode a hex, radius, shadow, or duration outside `tokens.css`.
- Don't use `--clay-*` or `--water-*` for buttons, borders, or backgrounds.
- Don't put uppercase on buttons, nav links, or card titles.
- Don't use Andika for UI chrome or Plus Jakarta for paragraphs.
- Don't add gradients as decoration or glass panels as a style.
- Don't leave an orphan card in a multi-column grid.
- Don't repeat the same stat block twice on one page.
- Don't stack two accent colors in one component.
- Don't let any interactive target fall below 44×44px.
- Don't ship a light-gradient card in dark mode.

## 8. Responsive Behavior

| Breakpoint | Behavior |
|---|---|
| ≥1200px | Full nav, 3–4 column grids, hero content lower-third |
| 900–1199px | 2-column grids, hero stacks media under copy |
| 700–899px | Nav collapses to drawer, two-up card grids become one-up |
| <700px | Single column, 20px gutters, mobile action bar appears after 75vh |

**Collapsing strategy**

- Navigation: links + CTA collapse into the drawer; the language switch and
  theme toggle stay in the bar. Below 430px the wordmark shortens rather than
  colliding with the language switch.
- Grids: `auto-fill` with `minmax(min(290px, 100%), 1fr)`; card media keeps its
  aspect ratio. Never horizontal-scroll cards.
- Hero: heading drops to `clamp(2.35rem …)`, actions stack full width. The hero
  is allowed to be taller than the viewport only by the photo, not by dead space.
- Mobile action bar: two controls, equal width, `min-width: 0`, no clipped
  labels. It must never cover the footer's last row.
- Section spacing reduces ~40%; eyebrow tracking stays fixed.

**Touch and language**

- All controls ≥44px; chips may be 40px only when they are not the primary path.
- Kiswahili strings are longer: test the nav, buttons and card titles in SW at
  360px before shipping.
- Long CMS titles wrap, never truncate with ellipsis in headings.

## 9. Agent Prompt Guide

### Quick reference

```
Canvas        #fbfaf6   (dark #131710)
Card          #ffffff   (dark #1c2118)
Brand bar     #dfecbe
Inverse band  #14210c
Primary CTA   #274018 on #eaf4d4
Text          #11110d / #4f4c41 / #6b6759
Border        #e2dfd2 / #cbc7b6
Radius        card 22px · control 12px · pill 999px
Section gap   clamp(3.5rem, 2rem + 6vw, 7rem)
```

### Example prompts

**Module card (Learn):**
"Build a card on `--bg-elevated` with a 22px radius, 1px `#e2dfd2` border, and a
16:9 media band using the topic terrain gradient with a 44px line icon centred.
Below: an 18px Plus Jakarta 600 title, a 14px Andika description clamped to
three lines, then a footer pinned to the bottom with a topic pill and a 32px
arrow circle. Hover lifts 5px with `--shadow-lg`."

**Page header:**
"Full-bleed 360px header with a documentary photograph, a forest scrim
`linear-gradient(to top, #0c1407 96%, transparent 62%)`, a 12px uppercase
eyebrow with a 24px rule, a 56px Plus Jakarta 700 h1 with -0.03em tracking, and
a 17px Andika lede at 46ch. No gap below the band."

**Contact form:**
"Inverse form card on `#14210c`: card background `rgba(234,244,212,0.06)`,
1px `rgba(240,243,231,0.28)` border, 30px radius. Fields are 44px tall,
`rgba(240,243,231,0.10)` background, sage focus ring. Submit is a full-width
sage pill in sentence case."

**Mobile action bar:**
"Fixed bottom bar, blurred `--bg-elevated`, 1px top border, 16px gutter. Two
44px controls, `flex: 1 1 0; min-width: 0`; primary forest pill and secondary
outline. Hide until 75vh, slide in 320ms, respect `prefers-reduced-motion`."

### Iteration order

1. Set canvas, ink and borders; build the page without any accent.
2. Add photography and the forest scrim.
3. Apply the type split: Plus Jakarta headings/UI, Andika body.
4. Add one primary action per section; everything else becomes secondary.
5. Add topic terrains only inside topic media.
6. Number the modules; add hairline rules and eyebrows.
7. Check dark theme, Kiswahili, 360px, and keyboard focus.
8. Remove one element from every section that survived step 7.

## 10. Known Gaps

- The display face is Plus Jakarta Sans, a stand-in for a future custom
  wordmark-derived typeface; letter-spacing values assume its metrics.
- Andika has no true italic; quotations use weight and rules instead.
- Photography is CC0/CC BY licensed stock until the organisation's own field
  photography replaces it (see `lib/credits.ts`).
- Topic terrains are generated from icon names; a new icon must be mapped in
  `components/ui/Icon.tsx` or it falls back to the sage terrain.
