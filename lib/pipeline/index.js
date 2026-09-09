import { runContentPlanner } from "./contentPlanner.js";
import { runLayoutSelector, resolveLayout } from "./layoutScorer.js";
import { runDesignThemeAI } from "./designThemeAI.js";
import { runIconMapper } from "./iconMapper.js";
import { syncPanelHeights } from "./fittingEngine.js";
import { validateSlide } from "./validator.js";
import { DEFAULT_THEME } from "./schema.js";
import { toEditorLayout, toContentMode } from "../layoutMap.js";

export async function executePipeline(groqClient, { topic, audience, slideCount, customStyle = true }) {
  // Stage 1: Content Planner AI
  const plan = await runContentPlanner(groqClient, topic, { audience, slideCount });

  // Stage 3: Design/Theme AI
  let theme = DEFAULT_THEME;
  if (customStyle) {
    const designTokens = await runDesignThemeAI(groqClient, plan.moodKeywords, plan.sections.length || 3);
    theme = {
      id: `custom_${Date.now()}`,
      name: `${plan.topic} Theme`,
      colors: {
        background: designTokens.palette.bg,
        surface: "#15151C",
        primary: designTokens.palette.text,
        secondary: "#A1A1AA",
        accent: designTokens.palette.panels,
        border: "#27272A",
      },
      typography: {
        heading: designTokens.fontPairing.split("/")[0] || "Inter",
        body: designTokens.fontPairing.split("/")[1] || "Inter",
        headingWeight: 700,
        bodyWeight: 400,
      },
      motif: designTokens.motif,
      decorativeDensity: designTokens.decorativeDensity,
      spacing: { xs: 8, sm: 16, md: 24, lg: 40, xl: 64 },
      radius: { card: 20, button: 12 },
      style: { shadows: true, gradients: true, borders: true },
    };
  }

  // Collect all items across sections to map icons in one batch
  const allItemsToMap = [];
  plan.sections.forEach((sec) => {
    sec.items.forEach((it, i) => {
      allItemsToMap.push({
        id: `${sec.id}-item-${i}`,
        text: `${it.lead} ${it.description}`.trim(),
      });
    });
  });

  // Stage 4: Icon/Asset Mapper AI
  const iconMappings = await runIconMapper(groqClient, allItemsToMap);
  const iconMap = new Map(iconMappings.map((m) => [m.id, m.icon]));

  // Build slides with Stage 2 (Layout Selector & Scorer) + Stage 5 (Fitting Engine)
  const slides = [];

  // Title Slide
  slides.push({
    id: `slide-1-${Date.now()}`,
    layout: "title",
    contentMode: "bullets",
    title: plan.topic,
    subtitle: plan.subtitle,
    badge: plan.moodKeywords[0]?.toUpperCase() || "PRESENTATION",
    items: [],
    bullets: [],
    closingLine: plan.closingLine,
  });

  // Section Slides
  let previousPipelineLayout = "title"; // slide 1 above; used only for the repetition penalty
  for (let i = 0; i < plan.sections.length; i++) {
    const sec = plan.sections[i];

    // Stage 2: Layout Selector & Scorer
    const aiCandidates = await runLayoutSelector(groqClient, {
      sectionCount: 1,
      allParallelGroup: sec.parallelGroup,
      contentTypes: [sec.contentType],
      avgItemsPerSection: sec.items.length,
      hasClosingLine: Boolean(plan.closingLine),
    });

    const layoutChoice = resolveLayout(
      { sections: [sec], closingLine: plan.closingLine },
      aiCandidates,
      previousPipelineLayout
    );
    previousPipelineLayout = layoutChoice.layout;

    // Map items with icons
    const mappedItems = sec.items.map((it, idx) => ({
      id: `item-${i}-${idx}`,
      title: it.lead,
      text: it.description,
      icon: iconMap.get(`${sec.id}-item-${idx}`) || "generic-dot",
    }));

    // Stage 5: Fitting Engine
    const fittedPanels = syncPanelHeights([{ items: mappedItems }]);
    const fitted = fittedPanels[0] || { fittedItems: mappedItems, fontSize: 16, gap: 16 };

    const rawSlide = {
      id: `slide-${i + 2}-${Date.now()}`,
      // Convert the pipeline's content-shape layout id (e.g. "tri_panel_icon_list")
      // into the id SlideCanvas/pptxExport actually render (e.g. "threeColumn").
      // See lib/layoutMap.js for the full mapping and the reasoning behind each case.
      layout: toEditorLayout(layoutChoice.layout),
      contentMode: toContentMode(sec.contentType),
      title: sec.heading,
      subtitle: sec.text,
      badge: sec.keyTakeaway || "",
      items: fitted.fittedItems,
      bullets: fitted.fittedItems.map((it) => (it.title ? `${it.title}: ${it.text}` : it.text)),
      fontSize: fitted.fontSize,
      gap: fitted.gap,
      closingLine: i === plan.sections.length - 1 ? plan.closingLine : null,
      notes: `Key takeaway: ${sec.keyTakeaway || sec.heading}`,
      // Only populated when the resolved layout is "quote" — SlideCanvas's
      // quote branch reads these two fields specifically.
      ...(toEditorLayout(layoutChoice.layout) === "quote"
        ? { quote: sec.text || mappedItems[0]?.text || sec.heading, author: sec.heading }
        : {}),
    };

    // Stage 6: Validator Engine
    const validated = validateSlide(rawSlide, theme);
    slides.push(validated.slide);
  }

  return {
    title: plan.topic,
    subtitle: plan.subtitle,
    theme,
    slides,
  };
}
