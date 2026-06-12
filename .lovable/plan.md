# Plan — Magical Poem Reading Experience

Transform the chat-like flow into a contemplative, letter-from-Rumi experience. All work stays in the frontend (`src/routes/index.tsx` and `src/styles.css`) and preserves the current parchment palette, gold accents, and Garamond typography.

---

## 1. Submission & focus flow

- On submit: disable the textarea + send button while any entry is `loading` (already partially in place — extend to cover the active typewriter phase too).
- Add a `ref` to each entry's article. After submit, smooth-scroll the new entry's top into view (`scrollIntoView({ behavior: 'smooth', block: 'start' })`) so the loading state is immediately visible without manual scrolling.
- After the poem finishes typing, re-scroll once more to re-center if needed and apply a brief "soft glow" highlight class that fades out over ~2.5s.

## 2. Loading state

Replace the current dots with a two-line, breathing message:

```
✦ Rumi is listening...
The reed flute gathers breath...
```

- Use a new `breathe` keyframe (opacity 0.55 → 1, scale 1 → 1.015, ~3.5s ease-in-out infinite) on the wrapper.
- Stagger the two lines with a small delay so they pulse out of phase. Gold ✦ glyph, italic Cormorant.

## 3. Typewriter reveal (line by line)

Replace the existing single-shot `poem-line` fade with a true sequenced reveal:

- When `poem` arrives, split into lines and feed them through a small state machine: reveal one line at a time, typing characters across ~30–55ms per character (configurable; tuned for "atmosphere over speed").
- Each completed line stays; the next line starts after a ~450ms pause (longer for blank/stanza-break lines).
- Each line wrapper: starts at `opacity:0; translateY(8px)`, transitions to `opacity:1; translateY(0)` over 700ms ease-out as typing begins.
- A subtle blinking caret (`▍` in gold, 1.1s blink) follows the currently-typing line; it disappears once the whole poem is done.
- While typing is in progress, treat the entry as still "busy" so the composer remains disabled (prevents stacking another request mid-reveal).

## 4. Motion language

A single shared easing token (`cubic-bezier(0.22, 0.61, 0.36, 1)`) and durations in the 500–900ms range across:
- entry mount (opacity 0→1, translateY 12→0)
- loading → poem swap (cross-fade ~600ms)
- collapse/expand of past poems
- glow highlight fade-out

No bouncy or fast motion — everything slow, warm, and calm.

## 5. Newest poem highlight

- Add a `.poem-glow` class that paints a soft radial gold halo (`box-shadow: 0 0 60px -10px color-mix(in oklab, var(--gold) 45%, transparent)`) and a faint inner warmth.
- Applied automatically when the entry becomes the newest finished poem; removed after ~3s via timeout.

## 6. Collapsible history

When a new entry begins generating, all prior entries collapse into compact expandable cards:

```
✦ Rainfall                              ▼
✦ Loneliness                            ▼
✦ Hope                                  ▼
```

- Card: parchment background, thin gold/40 border, rounded, single-line topic in display italic with a leading ✦.
- Chevron rotates 180° on expand; content (the poem, rendered statically — no re-typewriter) slides/fades open using a height transition + opacity.
- Built with native `<details>`/`<summary>` styled to match (keyboard accessible, no extra deps). The currently-generating / most-recent entry stays fully expanded and is NOT a collapsible card.
- User can manually re-expand any past poem at any time.

## 7. Decorative background imagery

Each poem gets an ambient backdrop chosen from a small curated set of mystical/Sufi-flavored motifs (whirling dervish silhouette, reed flute, desert dunes at dusk, tea steam, moonlit arches, calligraphy strokes).

- Images generated with `imagegen` (fast tier, warm/parchment palette) and stored in `src/assets/` as `.asset.json` pointers via `lovable-assets`.
- Picked deterministically per entry (hash of topic → index) so the same topic always gets the same backdrop and re-renders are stable.
- Rendered as an absolutely-positioned layer behind the poem container: `opacity: 0.12`, `filter: blur(14px) saturate(0.85)`, masked with a radial fade so edges blend into parchment.
- Cinematic entrance: opacity 0 → 0.12 over 1.6s with a slow `scale(1.04) → scale(1)` Ken-Burns-style drift.
- Readability guard: a parchment-tinted overlay (`background: color-mix(in oklab, var(--parchment) 70%, transparent)`) sits between the image and text; text contrast verified against the blurred backdrop.

## 8. Pacing

Tune defaults so the full reveal of a ~12-line poem takes roughly 18–25s — slow enough to feel handwritten, fast enough not to frustrate. Constants centralized at the top of the route file.

## 9. Aesthetic preservation

- No palette changes. Keep parchment background, gold accents, Cormorant/EB Garamond.
- Keep the existing header, Rumi quote empty-state, ❦ ornament, and composer styling. Only the per-entry rendering and history layout change.

---

## Technical details

**Files touched**
- `src/routes/index.tsx` — entry rendering, typewriter state machine, refs/scroll/focus, collapsible past entries, per-entry backdrop selection, composer disabled state.
- `src/styles.css` — new keyframes (`breathe`, `glow-fade`, `ken-burns`), `.poem-glow`, `.poem-backdrop`, `.history-card` styles, shared easing variable.
- `src/assets/backdrops/*.{jpg,asset.json}` — ~6 generated ambient images.

**State shape additions to `Entry`**
- `revealedLines: string[]` and `revealing: boolean` to drive the typewriter without re-running on re-render.
- `backdropUrl: string` chosen at creation time.
- `glow: boolean` toggled briefly after completion.

**Typewriter implementation**
- Single `useEffect` watching the latest `poem`-but-not-yet-fully-revealed entry; uses `setTimeout` chains (cleared on unmount) rather than per-char intervals to avoid drift.
- Respects `prefers-reduced-motion`: collapses typewriter + ken-burns to a simple fade.

**Accessibility**
- Loading region: `aria-live="polite"`, `role="status"`.
- Typewriter region: `aria-live="polite"` announces each completed line; full poem text mirrored in a visually-hidden node once done for screen readers.
- `<details>` provides native keyboard expand/collapse for history.

**No backend / no dependency changes.** Pure presentation work.
