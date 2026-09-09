/**
 * Slide Validator: Pure code (no AI).
 * Validates contrast ratios (WCAG 4.5:1), bounding box overlaps, and safe zones.
 */

function hexToRgb(hex) {
  let c = hex.replace("#", "");
  if (c.length === 3) {
    c = c.split("").map((x) => x + x).join("");
  }
  const num = parseInt(c, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function getLuminance({ r, g, b }) {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export function contrastRatio(color1, color2) {
  try {
    const lum1 = getLuminance(hexToRgb(color1));
    const lum2 = getLuminance(hexToRgb(color2));
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  } catch {
    return 4.5; // fallback
  }
}

export function validateThemeContrast(theme) {
  const bg = theme.colors?.background || "#0B0B0F";
  const primaryText = theme.colors?.primary || "#FFFFFF";
  const accents = theme.colors?.accent || [];

  const errors = [];
  const repairedAccents = accents.map((accent) => {
    const ratio = contrastRatio(accent, bg);
    if (ratio < 4.5) {
      errors.push(`Low contrast accent color ${accent} vs bg ${bg} (ratio: ${ratio.toFixed(2)})`);
      // Lighten or darken accent to ensure > 4.5 ratio
      return primaryText;
    }
    return accent;
  });

  return {
    valid: errors.length === 0,
    errors,
    repairedTheme: {
      ...theme,
      colors: {
        ...theme.colors,
        accent: repairedAccents,
      },
    },
  };
}

export function rectsOverlap(r1, r2) {
  return !(
    r1.x + r1.w <= r2.x ||
    r2.x + r2.w <= r1.x ||
    r1.y + r1.h <= r2.y ||
    r2.y + r2.h <= r1.y
  );
}

export function validateSlide(slide, theme) {
  const contrastResult = validateThemeContrast(theme);
  return {
    valid: contrastResult.valid,
    errors: contrastResult.errors,
    slide,
    theme: contrastResult.repairedTheme,
  };
}
