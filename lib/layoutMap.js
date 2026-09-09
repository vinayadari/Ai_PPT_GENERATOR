// ═══════════════════════════════════════════════════════════════
// Layout Vocabulary Bridge
// ═══════════════════════════════════════════════════════════════
//
// The AI pipeline (lib/pipeline/schema.js LAYOUTS) reasons about content
// SHAPE using its own vocabulary: hero, title_text, two_column,
// tri_panel_icon_list, quad_grid, stats_block, timeline, process_steps,
// comparison, quote, image_text, chart, table.
//
// The actual renderer — components/editor/SlideCanvas.jsx — and the
// exporter — lib/pptxExport.js — only understand the layout ids defined
// in lib/layouts.js: title, content, twoColumn, threeColumn, section,
// quote, bigNumber, splitImageLeft, splitImageRight, imageGallery,
// comparison, metricsGrid, timeline.
//
// These two vocabularies are intentionally different (one is about
// content classification, the other is about visual composition) but
// they must be reconciled somewhere. This module is that bridge —
// call toEditorLayout() once, right when the pipeline finishes building
// a slide, before it's handed to the renderer or exporter.
//
// Notes on specific mappings:
// - quad_grid -> twoColumn (not threeColumn): SlideCanvas's threeColumn
//   branch hard-truncates to items.slice(0, 3), which would silently
//   drop a 4th item. twoColumn shows all 4 items split across two
//   columns instead. A dedicated 2x2 "fourColumn" component would be
//   the correct long-term fix — not in scope for this pass.
// - stats_block -> content (cards): the pipeline's content planner only
//   produces { lead, description } items, never a numeric `value` field.
//   Routing stats_block to bigNumber/metricsGrid would render SlideCanvas's
//   hardcoded placeholder numbers instead of real content, which is worse
//   than a plain card layout. Revisit once contentPlanner emits real stats.
// - image_text / chart / table -> content: no image generation, chart
//   engine, or table renderer exists in the pipeline yet, so these safely
//   degrade to a clean bullet/card slide rather than an empty layout.

export function toEditorLayout(pipelineLayout) {
  switch (pipelineLayout) {
    case "hero":
      return "section";
    case "title_text":
      return "content";
    case "two_column":
      return "twoColumn";
    case "tri_panel_icon_list":
      return "threeColumn";
    case "quad_grid":
      return "twoColumn";
    case "stats_block":
      return "content";
    case "timeline":
    case "process_steps":
      return "timeline";
    case "comparison":
      return "comparison";
    case "quote":
      return "quote";
    case "image_text":
    case "chart":
    case "table":
      return "content";
    default:
      return "content";
  }
}

// contentMode is a separate axis SlideCanvas also reads (bullets | cards |
// steps | checklist). Pick one that matches how the content was classified
// so the "content" fallback above still looks intentional rather than flat.
export function toContentMode(contentType) {
  switch (contentType) {
    case "check_list":
      return "checklist";
    case "numbered_list":
    case "process_steps":
      return "steps";
    case "bulleted_list":
    case "paragraph":
      return "bullets";
    default:
      return "cards";
  }
}
