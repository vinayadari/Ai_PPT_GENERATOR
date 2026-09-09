# PPT Maker (MVP)

AI presentation generator: describe a topic, Groq (`openai/gpt-oss-120b`) drafts
the slide structure, you get a live preview with 4 templates, inline text
editing, and one-click export to **.pptx** or **.pdf**.

## Stack
- Next.js 14 (App Router)
- `groq-sdk` — server-side call in `app/api/generate/route.js`
- `pptxgenjs` — builds the real .pptx client-side
- `html2canvas` + `jspdf` — snapshots each slide to build the .pdf

## Setup

```bash
npm install
cp .env.local.example .env.local
# then edit .env.local and paste your key:
# GROQ_API_KEY=gsk_...
npm run dev
```

Open http://localhost:3000. Get a free Groq key at https://console.groq.com/keys.

## How it works

1. **Generate** — the sidebar form POSTs `{ topic, audience, slideCount }` to
   `/api/generate`. The API route calls Groq with `response_format: { type:
   "json_object" }` and a system prompt that forces a strict slide schema
   (`{ title, slides: [{ layout, title, bullets, notes }] }`), then returns
   normalized JSON.
2. **Preview** — `SlideCard` renders the current slide at a fixed 960×540
   canvas so what you see matches what gets exported. Click any title or
   bullet to edit it in place (`contentEditable`).
3. **Templates** — `lib/templates.js` is the single source of truth: each
   template has CSS values (for the live preview) and matching hex values
   (for the .pptx export), so switching templates never desyncs preview vs. file.
4. **Export PPTX** — `lib/pptxExport.js` walks the same slide data through
   `pptxgenjs`, dynamically imported so it never ships in the server bundle.
5. **Export PDF** — an offscreen copy of every slide is always rendered
   (`app/page.js`, the `hiddenExportRef` div). `lib/pdfExport.js` captures
   each with `html2canvas` and stitches them into a landscape PDF with `jsPDF`.

## Changelog — practical-fix pass

This pass closed the gap between the AI pipeline (`lib/pipeline/`) and the
actual renderer (`components/editor/SlideCanvas.jsx`) / exporter
(`lib/pptxExport.js`), without a broader rewrite. Specifically:

- **`lib/layoutMap.js` (new)** — bridges the pipeline's content-shape layout
  vocabulary (`tri_panel_icon_list`, `stats_block`, `hero`, ...) to the
  vocabulary `SlideCanvas`/`pptxExport` actually render (`threeColumn`,
  `content`, `section`, ...). Previously the pipeline could select a layout
  name the renderer had never heard of, and it would silently fall through
  to a generic bullet list. See the comments in that file for the reasoning
  behind each mapping, especially `quad_grid → twoColumn` (avoids
  `SlideCanvas`'s `threeColumn` branch silently dropping a 4th item) and
  `stats_block → content` (the content planner doesn't produce numeric
  `value` fields yet, so routing to `bigNumber`/`metricsGrid` would show
  hardcoded placeholder numbers instead of real content).
- **`lib/icons.js` (new)** — resolves the AI icon-mapper's fixed tag
  vocabulary to real `lucide-react` icons. `SlideCanvas`'s `threeColumn`
  card grid now renders the mapped icon instead of a static `01/02/03`
  placeholder when one is available.
- **Layout-repetition penalty** — `lib/pipeline/layoutScorer.js` now takes
  the previous slide's layout and subtracts from any layout that would
  repeat it, so a deck doesn't end up as 6 identical-looking slides in a
  row just because 6 sections individually scored the same layout highest.
- **`pptxExport.js` parity** — added dedicated export branches for
  `threeColumn` (card grid), `timeline` (connected nodes), `comparison`
  (two-column contrast), and `metricsGrid` (KPI cards), plus a graceful
  text fallback for the image-based layouts (no image-generation pipeline
  exists yet). Previously these all fell through to a plain bullet list on
  export, so the downloaded `.pptx` didn't match the on-screen preview.
- **Data-contract fixes** — `metricsGrid` cards read `metric.change`, but
  the monolithic Groq route was producing `metric.delta`; both fields are
  now populated. `bigNumber`'s sub-label was hardcoded to "Key Metric"
  instead of reading the AI-generated `bigNumberLabel`; fixed.
- **Removed `components/SlideCard.jsx`** — confirmed unused (nothing
  imported it); the live renderer is `components/editor/SlideCanvas.jsx`.
  Keeping dead code around next to a real renderer with a similar name was
  actively confusing.

### Known limitations carried forward (not fixed in this pass)

- `SlideCanvas`'s `comparison` branch still ignores the AI-generated
  `comparisonLeft`/`comparisonRight` objects (title/badge per side) and
  just splits the flat `items` array in half with hardcoded "Option A /
  Option B" labels. Fixing this properly means restructuring that branch's
  JSX to read the real per-side data — a bigger, riskier change than fit
  in this pass. `pptxExport`'s new `comparison` branch intentionally
  mirrors this same simplified behavior so exports match the preview.
- `quad_grid` content still renders as a 2-column text split rather than a
  true 2×2 card grid — a dedicated `fourColumn` component would be a small,
  self-contained follow-up.
- `next@14.2.5` has a known security advisory (flagged by `npm install`).
  Not upgraded here since a major-version bump was out of scope for this
  pass and could introduce breaking changes — worth doing as its own PR.

## Next steps (not in this MVP)
- Drag-to-reorder slides, add/delete slide buttons
- Image generation per-slide (e.g. via another Groq/vision call or a stock
  image API) and image layouts
- Persisting presentations (currently everything lives in React state only —
  refreshing the page loses your draft)
- Streaming the Groq response into the preview as it's generated, instead of
  waiting for the full JSON (the request example you started from used
  `stream: true`; this MVP uses non-streaming JSON mode instead because a
  strict JSON schema is much easier to parse when it arrives whole)
- More templates / a theme editor (custom colors, fonts, logo upload)
