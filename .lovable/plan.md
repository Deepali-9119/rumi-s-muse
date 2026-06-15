## Goal

Refine the existing midnight-blue theme into a quieter, more intimate "Rumi beneath a star-filled sky" atmosphere — sparse elegant stars, breathing moonlit aura, and a poem canvas that reads as an illuminated manuscript with the quill woven into the page.

## Changes — all in `src/styles.css` and `src/routes/index.tsx`

### 1. Sky atmosphere — quieter, more elegant (`styles.css`)

- **Stars**: thin the `.sky-stars` radial-gradient field — fewer dots, smaller (0.5–1.2px), lower alpha (max 0.55 instead of 0.9), larger tile sizes so they feel sparse and distant. Slow the `twinkle` keyframe to ~22s and narrow the opacity range (0.45 ↔ 0.6) so the shimmer is barely perceptible.
- **New `.sky-constellations` layer**: very faint SVG data-URI of 3–4 sparse dotted "constellation" lines at ~0.06 opacity, fixed position, no animation. Adds depth without busyness.
- **Moonglow halo**: tighten `.sky-moonglow` so the warm radial is positioned directly behind the poem canvas (~45% from top, 35% radius) instead of high on the page. Strengthen `auraBreathe` slightly — opacity 0.7 ↔ 1.0, scale 1 ↔ 1.05, 16s — so the page literally breathes around the poem.
- **Stardust particles**: reduce JSX count from 14 → 9, smaller sizes (1–2px), longer durations (32–50s), lower opacity peak (0.55) — drifting embers rather than snow.

### 2. Illuminated manuscript canvas (`styles.css`)

Rework `.canvas-card`:
- **Warmer parchment**: shift card surface to a layered background — base `color-mix(var(--parchment) 98%, oklch(0.92 0.07 70))` plus two soft radial highlights (top-left cream, bottom-right warm amber) for candlelit warmth.
- **Paper grain**: add a subtle SVG fractal-noise data-URI as a `::after` overlay at 6–8% opacity, `mix-blend-mode: multiply`, masked so edges fade — gives tactile paper texture without noise artifacts.
- **Softer edges**: increase border-radius to `1.5rem`, swap the hard gold border for a faded inner gold ring (`inset 0 0 0 1px gold/22%`) and a softer outer ring (`0 0 0 1px gold/14%`). Drop the visible `border` property.
- **Refined shadow**: layered shadow stack — close warm ambient (`0 2px 8px ink/15%`), medium drop (`0 20px 50px -20px ink/45%`), and a wide candlelit halo (`0 40px 120px -40px oklch(0.85 0.1 65)/35%`).
- **Moonlight halo**: keep `::before` halo but warm it slightly toward amber and enlarge so it bleeds beyond the card edges, harmonizing with `.sky-moonglow`.
- **Edge vignette**: add a faint inner radial vignette inside the card (via an extra inset shadow or `::after` mask) so the parchment center is brightest — classic manuscript lighting.

### 3. Quill integrated into the manuscript (`styles.css` + `index.tsx`)

Currently the feather sits in a left-aligned block above the divider. Make it feel like an object resting on the page:
- **Position**: in `index.tsx`, move the feather `<img>` into the canvas as an absolutely-positioned element — top-right of the manuscript, rotated ~−18°, partially overlapping the top border so it looks laid across the page corner.
- **Blending**: in `.feather-img` raise blend strength — `mix-blend-mode: multiply`, opacity 0.55, add a soft drop-shadow (`drop-shadow(0 6px 10px oklch(0.3 0.05 40 / 0.35))`) so it casts a believable shadow on the parchment.
- **Size**: 130–150px, scales down on mobile.
- **Motion**: keep the existing `feather-float` (idle) and `feather-write` (loading) animations but reduce amplitude so it sways gently instead of bobbing.
- Remove the empty left-aligned feather slot above the divider.

### 4. Readability preserved

- Poem text styling untouched: same `font-display`, ink color, `text-xl md:text-2xl`, `leading-[1.95]`.
- The parchment warming stays within a narrow luminance band so contrast with `--ink` remains strong.
- All decorative additions are `pointer-events: none`, `aria-hidden`, and respect `prefers-reduced-motion` (twinkle, auraBreathe, driftUp, feather animations disabled).

## Out of scope

Webhook, fetch logic, typewriter timing, entry state, routing, fonts, and asset files are unchanged.
