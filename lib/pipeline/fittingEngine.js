/**
 * Fitting Engine: Pure code (no AI). Handles text overflow, font scaling, item bounds,
 * vertical flex spacing, and panel height synchronization.
 */

export function fitPanelContent(panel, regionConfig = {}) {
  let items = Array.isArray(panel.items) ? [...panel.items] : [];
  const baseFontSize = regionConfig.baseFontSize || 16;
  const minFontSize = regionConfig.minFontSize || 11;
  const minItems = regionConfig.minItems || 1;
  const maxItems = regionConfig.maxItems || 6;

  let fontSize = baseFontSize;

  if (items.length > maxItems) {
    const overflowCount = items.length - maxItems;
    fontSize = Math.max(minFontSize, baseFontSize - overflowCount * 1.5);
    if (items.length > maxItems + 2) {
      items = items.slice(0, maxItems + 1);
    }
  }

  const gap = Math.max(8, 28 - items.length * 3);

  return {
    items,
    fontSize,
    gap,
    isTruncated: items.length < (panel.items || []).length,
  };
}

export function syncPanelHeights(panels = []) {
  if (!panels.length) return [];
  const maxItemsCount = Math.max(...panels.map((p) => (p.items || []).length), 1);
  return panels.map((p) => {
    const fitted = fitPanelContent(p, { maxItems: 6 });
    return {
      ...p,
      fittedItems: fitted.items,
      fontSize: fitted.fontSize,
      gap: fitted.gap,
      syncedHeightRem: Math.max(12, maxItemsCount * 3.5 + 5),
    };
  });
}
