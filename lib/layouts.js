// ═══════════════════════════════════════════════════════════════
// Slide Layout Architecture
// Independent from templates — Defines structure & region arrangement
// ═══════════════════════════════════════════════════════════════

export const LAYOUT_CATEGORIES = {
  standard: "Standard",
  visual: "Visual / Media",
  data: "Data & Comparison",
  structural: "Structural",
};

export const LAYOUT_TYPES = {
  // ─── STANDARD ───
  title: {
    id: "title",
    name: "Title Slide",
    category: "Standard",
    icon: "◻",
    description: "Full-screen title with optional subtitle and badge",
    supportsContentMode: false,
    supportsImage: false,
  },
  content: {
    id: "content",
    name: "Content",
    category: "Standard",
    icon: "☰",
    description: "Header with versatile items (bullets, cards, steps, checklist)",
    supportsContentMode: true,
    supportsImage: false,
  },
  twoColumn: {
    id: "twoColumn",
    name: "Two Column",
    category: "Standard",
    icon: "⊞",
    description: "Split content into two parallel columns or card groups",
    supportsContentMode: true,
    supportsImage: false,
  },
  threeColumn: {
    id: "threeColumn",
    name: "Three Column",
    category: "Standard",
    icon: "⫴",
    description: "Three distinct feature cards, pillars, or team blocks",
    supportsContentMode: true,
    supportsImage: false,
  },
  section: {
    id: "section",
    name: "Section Break",
    category: "Standard",
    icon: "◆",
    description: "Large centered section divider or topic transition",
    supportsContentMode: false,
    supportsImage: false,
  },
  quote: {
    id: "quote",
    name: "Quote",
    category: "Standard",
    icon: "❝",
    description: "Blockquote-style testimonial or core insight with author",
    supportsContentMode: false,
    supportsImage: false,
  },

  // ─── VISUAL / MEDIA ───
  splitImageLeft: {
    id: "splitImageLeft",
    name: "Split Image Left",
    category: "Visual / Media",
    icon: "◧",
    description: "Half-screen media on the left, slide title and points on the right",
    supportsContentMode: true,
    supportsImage: true,
  },
  splitImageRight: {
    id: "splitImageRight",
    name: "Split Image Right",
    category: "Visual / Media",
    icon: "◨",
    description: "Slide title and points on the left, half-screen media on the right",
    supportsContentMode: true,
    supportsImage: true,
  },
  imageGallery: {
    id: "imageGallery",
    name: "Image Gallery",
    category: "Visual / Media",
    icon: "▣",
    description: "Showcase of 2–3 media cards with headline and captions",
    supportsContentMode: false,
    supportsImage: true,
  },

  // ─── DATA & COMPARISON ───
  comparison: {
    id: "comparison",
    name: "Comparison",
    category: "Data & Comparison",
    icon: "⚖",
    description: "Side-by-side Before/After or Option A vs B with comparison badges",
    supportsContentMode: false,
    supportsImage: false,
  },
  metricsGrid: {
    id: "metricsGrid",
    name: "Metrics Grid",
    category: "Data & Comparison",
    icon: "⊞",
    description: "Grid of 3–4 key metrics, indicators, and delta descriptions",
    supportsContentMode: false,
    supportsImage: false,
  },
  bigNumber: {
    id: "bigNumber",
    name: "Big Number",
    category: "Data & Comparison",
    icon: "#",
    description: "Highlight a single massive statistic with supporting narrative",
    supportsContentMode: false,
    supportsImage: false,
  },

  // ─── STRUCTURAL ───
  timeline: {
    id: "timeline",
    name: "Timeline / Steps",
    category: "Structural",
    icon: "⤍",
    description: "Sequential milestone progression flow with connected nodes",
    supportsContentMode: false,
    supportsImage: false,
  },
};

export const LAYOUT_LIST = Object.values(LAYOUT_TYPES);

export const ALL_LAYOUT_IDS = Object.keys(LAYOUT_TYPES);

export function getLayout(id) {
  return LAYOUT_TYPES[id] || LAYOUT_TYPES.content;
}

export function getLayoutsByCategory() {
  const grouped = {
    [LAYOUT_CATEGORIES.standard]: [],
    [LAYOUT_CATEGORIES.visual]: [],
    [LAYOUT_CATEGORIES.data]: [],
    [LAYOUT_CATEGORIES.structural]: [],
  };

  LAYOUT_LIST.forEach((l) => {
    if (grouped[l.category]) {
      grouped[l.category].push(l);
    } else {
      grouped[LAYOUT_CATEGORIES.standard].push(l);
    }
  });

  return grouped;
}
