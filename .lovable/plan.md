## Plan — Poetry Canvas with celestial & feather artwork

Use the two uploaded images as decorative elements inside each poem card. No backend or poem-generation logic changes.

---

### 1. Upload images as CDN assets

- Upload both files via `lovable-assets create` from `/mnt/user-uploads/`:
  - `moon.jpg` → `src/assets/moon.jpg.asset.json` (celestial moon-and-stars artwork)
  - `feather.jpg` → `src/assets/feather.jpg.asset.json` (hand with quill)
- These replace the 6 generated `src/assets/backdrops/*.jpg` images, which will be deleted (no longer used).

### 2. Replace the backdrop system with a single "Poetry Canvas"

In `src/routes/index.tsx`:

- Remove the 6 backdrop imports and the `BACKDROPS` array + `hashIndex` selection. Every poem now uses the same two artworks (consistent identity).
- Remove `entry.backdrop` field from the `Entry` type.

### 3. Poetry Canvas layout (latest entry only)

Restructure the latest-entry card as an "illuminated manuscript":

```text
┌──────────────────────────────── card ──────────────────────────────┐
│  [moon artwork — absolutely positioned, centered behind text,      │
│   ~70% of card width, opacity 0.12, blur(2px), fades in over 1.6s, │
│   slow 12s breathing scale 1 → 1.03 → 1]                           │
│                                                                    │
│      ❦                                                             │
│  ─────────────── gold rule ───────────────                         │
│                                                                    │
│   [feather image — ~120px, top-left of poem area, gentle           │
│    floating animation: translateY ±6px + rotate ±2deg over 6s]     │
│                                                                    │
│           (poem lines, typewriter reveal, centered)                │
│                                                                    │
│  ─────────────── gold rule ───────────────                         │
│           — Rumi, for you                                          │
└────────────────────────────────────────────────────────────────────┘
```

- Card gets a parchment background, thicker gold/50 border with rounded corners, soft inner shadow to feel page-like.
- Moon artwork: rendered as an `<img>` (not background-image) so its proportions are preserved — `object-contain`, centered, `max-width: 70%`, `max-height: 90%`. Behind a parchment-tinted veil so text stays readable.
- Feather: small decorative `<img>` (~110–140px), positioned top-left of the poem block with `mix-blend-mode: multiply` so the dark painting tones blend into parchment. Floating animation runs continuously while latest card is mounted.

### 4. Loading state

- Replace current two-line breathing message with:
  - The feather image (animated: gentle float + faint shadow pulse)
  - Below it: `✦ Rumi is writing...` (single line, italic Cormorant, gold ✦, breathing opacity)
- Moon artwork is hidden / opacity 0 during loading; fades in only when the poem starts revealing.

### 5. Poem arrival sequence

- Moon: opacity 0 → 0.13 over 1.6s, scale 1.04 → 1 (one-shot), then settles into slow infinite breathing.
- Feather: transitions from "writing" pose (slight bob, faster) to "settled" pose (smaller idle float, slower).
- Typewriter: existing line-by-line reveal preserved (CHAR_MS, LINE_GAP_MS unchanged).
- Final poem-glow halo on completion preserved.

### 6. History cards

- Past entries keep the existing `<details>`/`<summary>` collapsible parchment cards. They do NOT show the moon or feather (artwork is reserved for the active canvas to keep it special and avoid heavy decoration in history).

### 7. Aesthetic preservation

- Parchment, gold, Cormorant/EB Garamond typography all unchanged.
- Composer, header, Rumi quote empty-state unchanged.
- `prefers-reduced-motion`: disables floating/breathing animations, keeps a static fade-in.

---

### Technical details

**Files touched**

- `src/routes/index.tsx` — swap backdrop system for moon+feather, restructure latest-entry card, update loading state.
- `src/styles.css` — new utilities: `.canvas-moon` (positioning + `moonIn` keyframe + `moonBreathe`), `.feather-float`, `.feather-write` (faster bob for loading state), `.canvas-card` (manuscript framing). Remove now-unused `.poem-backdrop` / `.poem-veil` / `kenBurns` / `backdropIn`.
- Assets: add `src/assets/moon.jpg.asset.json`, `src/assets/feather.jpg.asset.json`; delete `src/assets/backdrops/` directory.

**Image handling**

- Both images used as `<img>` tags with `alt=""` (decorative) and `aria-hidden="true"`. Sized with constrained `max-width`/`max-height` so they never stretch to fill the card.

**Animations** (all use shared `--ease-rumi`)

- `moonIn`: 1.6s opacity 0→0.13, scale 1.04→1, one-shot on poem arrival.
- `moonBreathe`: 12s infinite, scale 1 → 1.03 → 1, opacity 0.11 → 0.14 → 0.11.
- `featherFloat`: 6s infinite, translateY ±6px + rotate ±2deg (idle/settled state).
- `featherWrite`: 2.2s infinite, translateY ±3px + rotate -3deg → +1deg (loading state, slightly more active).

**No backend, dependency, or routing changes.** Pure frontend presentation.

&nbsp;

In addition to the current plan:

1. When a poem is generated, automatically smooth-scroll the viewport to the newly created poem canvas.

2. Fade in the poem line-by-line with a typewriter effect (150–250ms delay per line).

3. Display a subtle "Rumi is writing..." animation using the quill image while waiting for the webhook response.

4. Highlight the newest poem with a gentle glow for 3 seconds so the user immediately notices where it appeared.

5. On mobile devices, automatically bring the generated poem into view without requiring manual scrolling.

6. Keep background artwork at 5–12% opacity to prioritize readability.

7. Add a slow floating/parallax motion to the moon-and-stars background.

8. Preserve previous poems as collapsible history cards.