## Goal

Turn Rumi's Muse into a calm, immersive midnight poetry sanctuary: deep indigo/navy sky with stars, drifting stardust, and a moonlit aura framing a warm parchment poem card that stays the clear focal point.

## Changes

### 1. `src/styles.css` — new midnight theme + celestial layers

- Replace the peach body background with a layered midnight palette:
  - Base gradient: deep navy `oklch(0.16 0.05 265)` → indigo `oklch(0.22 0.08 275)` → near-black at edges.
  - Two soft radial moonglow highlights (top-right large, top-left subtle) using a warm ivory tint at very low alpha for atmospheric depth.
  - `background-attachment: fixed` preserved so scrolling feels like a still sky.
- Update foreground/header tokens so headline + tagline read on dark sky:
  - Add `--sky-foreground` (warm ivory) and `--sky-muted` (dim periwinkle).
  - Keep `--ink`, `--parchment`, `--gold` unchanged — the poem card still uses warm parchment + dark ink for maximum readability.
- New decorative layers (purely CSS, fixed to viewport, `pointer-events: none`, `aria-hidden`):
  - `.sky-stars` — two stacked `radial-gradient` star fields (small + tiny dots) tiled via `background-size`, very slow `twinkle` opacity animation (12s).
  - `.sky-constellations` — a faint SVG-as-data-URI background of sparse dotted lines, opacity ~0.08.
  - `.sky-moonglow` — large soft radial halo positioned behind the poem area (~30% from top), warm ivory at 10–14% opacity, slow `auraBreathe` 18s.
  - `.sky-vignette` — radial dark vignette at edges for depth.
- New `.stardust` particle layer rendered by 12–16 absolutely-positioned `<span>` dots (created in JSX) using `driftUp` keyframes (translateY -120vh + slight horizontal sway + opacity fade) over 22–40s with staggered delays. Pure CSS animation, no JS loop.
- New keyframes: `twinkle`, `auraBreathe`, `driftUp`.
- Strengthen `.canvas-card`:
  - Warmer parchment background (slightly brighter than page).
  - Larger soft outer shadow with warm gold tint (`0 30px 80px -30px gold/35%`) so card feels lit from above.
  - Subtle outer ring `0 0 0 1px gold/25%` for manuscript edge.
  - Add a faint outer "moonlight halo" via `::before` (radial gold/ivory gradient, blurred, behind card) so the card visibly catches moonlight.
- Update `.history-card`: switch from peach card surface to a translucent ivory-on-midnight (`bg-parchment/85`) so it still reads as parchment over the night sky.
- Update the sticky composer band: replace peach gradient with a midnight-to-transparent gradient and tweak input surface to translucent parchment for contrast.
- All decorative motion respects `prefers-reduced-motion` (twinkle, auraBreathe, driftUp disabled; static positions retained).

### 2. `src/routes/index.tsx` — mount celestial layers + restyle chrome

- At the top of the returned tree, render fixed background layers in order: `.sky-stars`, `.sky-constellations`, `.sky-moonglow`, `.sky-vignette`, and a `.stardust` container with ~14 `<span>` particles (varied `--x`, `--delay`, `--duration`, `--size` via inline style custom properties consumed by the keyframes).
- Wrap page content in `relative z-10` so it sits above the sky.
- Header: change headline color to warm ivory, keep gold accents; tagline uses dim periwinkle. Add small `✦` flourishes flanking the title for a constellation feel.
- Empty-state quote: ivory/gold on midnight.
- User-topic bubble: keep primary color but soften with `shadow-lg shadow-indigo-950/40` so it sits naturally on the dark sky.
- Poem canvas (`.canvas-card`): unchanged structurally — still warm parchment, dark ink, gold borders, moon image, feather, typewriter. The new outer halo + page darkness will make it visibly glow.
- History cards: parchment-tinted translucent surface with gold border so they read as small folded letters on the night sky.
- Sticky composer: midnight-tinted gradient backdrop; input surface stays parchment-light for typing comfort; helper text in dim ivory.

### 3. No changes to

- Webhook URL, fetch logic, typewriter timing, entry state, asset files, routing, or backend.
- Existing fonts (Cormorant Garamond / EB Garamond) — already perfectly literary.
- The poem text styling itself (ink on parchment) — readability is preserved exactly.

## Notes on craft

- Particles and twinkle are intentionally slow (>10s loops) and low-opacity so the eye drifts to the poem.
- Moonglow halo is centered behind the canvas card so the parchment looks lit from above, reinforcing the "manuscript by moonlight" metaphor.
- No JS animation loops, no extra libraries — pure CSS keyframes for performance.
