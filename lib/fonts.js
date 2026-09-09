// ═══════════════════════════════════════════════════════════════
// Typography Engine — Curated Font Presets
// ═══════════════════════════════════════════════════════════════

export const FONT_PRESETS = {
  modernTech: {
    id: "modernTech",
    name: "Modern Tech",
    description: "Crisp and contemporary for tech & product presentations",
    headingFont: "Outfit",
    bodyFont: "Inter",
    headingWeight: "700",
    bodyWeight: "400",
  },
  editorialSerif: {
    id: "editorialSerif",
    name: "Editorial Serif",
    description: "Classic high-contrast editorial look for storytelling & thought leadership",
    headingFont: "Playfair Display",
    bodyFont: "Plus Jakarta Sans",
    headingWeight: "700",
    bodyWeight: "400",
  },
  neoGrotesque: {
    id: "neoGrotesque",
    name: "Neo-Grotesque",
    description: "Clean engineered aesthetic for data, systems & architecture",
    headingFont: "Space Grotesk",
    bodyFont: "Inter",
    headingWeight: "700",
    bodyWeight: "400",
  },
  geometricModern: {
    id: "geometricModern",
    name: "Geometric Modern",
    description: "Friendly, balanced and highly legible modern presentation style",
    headingFont: "Poppins",
    bodyFont: "DM Sans",
    headingWeight: "600",
    bodyWeight: "400",
  },
  luxuryEditorial: {
    id: "luxuryEditorial",
    name: "Luxury Editorial",
    description: "Sophisticated fine-art flair for pitch decks & premium brands",
    headingFont: "Cormorant Garamond",
    bodyFont: "Montserrat",
    headingWeight: "700",
    bodyWeight: "400",
  },
  dynamicBold: {
    id: "dynamicBold",
    name: "Dynamic Bold",
    description: "High impact, punchy and expressive for keynote presentations",
    headingFont: "Syne",
    bodyFont: "Inter",
    headingWeight: "800",
    bodyWeight: "400",
  },
};

export const FONT_PRESET_LIST = Object.values(FONT_PRESETS);

export const DEFAULT_FONT_PRESET_ID = "modernTech";

export function getFontPreset(id) {
  return FONT_PRESETS[id] || FONT_PRESETS[DEFAULT_FONT_PRESET_ID];
}
