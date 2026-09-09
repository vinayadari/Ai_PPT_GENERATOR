// ═══════════════════════════════════════════════════════════════
// AI PPT Template System — Fixed Vocabularies & Data Models
// ═══════════════════════════════════════════════════════════════

export const LAYOUTS = [
  "hero",
  "title_text",
  "two_column",
  "tri_panel_icon_list",
  "quad_grid",
  "stats_block",
  "timeline",
  "process_steps",
  "comparison",
  "quote",
  "image_text",
  "chart",
  "table"
];

export const CONTENT_TYPES = [
  "paragraph",
  "numbered_list",
  "bulleted_list",
  "check_list",
  "stat_block",
  "comparison",
  "timeline",
  "quote",
  "process_steps"
];

export const FONT_PAIRINGS = [
  "Inter/Inter",
  "Poppins/Inter",
  "Playfair Display/Source Sans",
  "Space Grotesk/Inter",
  "DM Serif Display/DM Sans"
];

export const MOTIFS = [
  "none",
  "geometric-shapes",
  "organic-blobs",
  "line-art-frame",
  "hand-drawn-accents",
  "photo-collage"
];

export const ICON_TAXONOMY = [
  "book", "lightbulb", "target", "checkmark", "magnifying-glass", "gear",
  "bar-chart", "arrow", "flag", "star", "shield", "rocket", "clock",
  "database", "cpu", "globe", "user", "users", "zap", "lock",
  "code", "terminal", "dollar", "trending-up", "layers", "file-text",
  "award", "heart", "briefcase", "compass", "grid", "box", "key",
  "alert-triangle", "check-circle", "info", "help-circle", "generic-dot"
];

export const DEFAULT_THEME = {
  id: "midnight_ai",
  name: "Midnight AI",
  colors: {
    background: "#0B0B0F",
    surface: "#15151C",
    primary: "#FFFFFF",
    secondary: "#A1A1AA",
    accent: ["#8B5CF6", "#06B6D4", "#F97316"],
    border: "#27272A"
  },
  typography: {
    heading: "Inter",
    body: "Inter",
    headingWeight: 700,
    bodyWeight: 400
  },
  spacing: { xs: 8, sm: 16, md: 24, lg: 40, xl: 64 },
  radius: { card: 20, button: 12 },
  style: { shadows: true, gradients: true, borders: true }
};
