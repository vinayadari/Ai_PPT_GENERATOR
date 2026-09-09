"use client";

// Builds and downloads a .pptx file client-side using pptxgenjs.
export async function exportPptx(presentation, template = {}) {
  const PptxGenJS = (await import("pptxgenjs")).default;
  const pptx = new PptxGenJS();

  pptx.defineLayout({ name: "WIDE", width: 10, height: 5.625 });
  pptx.layout = "WIDE";

  const themeColors = presentation?.theme?.colors || {};
  const bgColor = themeColors.background ? themeColors.background.replace("#", "") : (template.pptxBg || "FFFFFF");
  const textColor = themeColors.primary ? themeColors.primary.replace("#", "") : (template.pptxText || "000000");
  const accentColor = (themeColors.accent && themeColors.accent[0])
    ? themeColors.accent[0].replace("#", "")
    : (template.pptxAccent || "8B5CF6");

  const fontFace = presentation?.theme?.typography?.body || template.font || "Arial";
  const headingFontFace = presentation?.theme?.typography?.heading || template.headingFont || fontFace;

  presentation.slides.forEach((slide) => {
    const s = pptx.addSlide();
    s.background = { color: bgColor };

    // Accent bar on the left edge
    s.addShape("rect", {
      x: 0,
      y: 0,
      w: 0.12,
      h: 5.625,
      fill: { color: accentColor },
      line: { color: accentColor },
    });

    const layout = slide.layout || "content";

    if (layout === "title") {
      // Main title slide
      s.addText(slide.title, {
        x: 0.8,
        y: 1.8,
        w: 8.4,
        h: 1.4,
        fontSize: 40,
        bold: true,
        color: template.pptxText,
        fontFace: headingFontFace,
        align: "left",
      });

      const subtitle = slide.subtitle || (slide.bullets && slide.bullets[0]) || "";
      if (subtitle) {
        s.addText(subtitle, {
          x: 0.8,
          y: 3.2,
          w: 8.4,
          h: 0.8,
          fontSize: 20,
          color: template.pptxAccent,
          fontFace,
          align: "left",
        });
      }
    } else if (layout === "section") {
      // Section break slide
      s.addText("SECTION", {
        x: 1.0,
        y: 1.5,
        w: 8.0,
        h: 0.4,
        fontSize: 14,
        bold: true,
        color: template.pptxAccent,
        fontFace,
        align: "center",
      });

      s.addText(slide.title, {
        x: 1.0,
        y: 2.0,
        w: 8.0,
        h: 1.5,
        fontSize: 38,
        bold: true,
        color: template.pptxText,
        fontFace: headingFontFace,
        align: "center",
      });

      if (slide.subtitle) {
        s.addText(slide.subtitle, {
          x: 1.0,
          y: 3.5,
          w: 8.0,
          h: 0.8,
          fontSize: 18,
          color: template.pptxAccent,
          fontFace,
          align: "center",
        });
      }
    } else if (layout === "quote") {
      // Quote layout
      s.addText(`“${slide.quote || slide.title}”`, {
        x: 1.0,
        y: 1.6,
        w: 8.0,
        h: 2.0,
        fontSize: 28,
        italic: true,
        color: template.pptxText,
        fontFace: headingFontFace,
        align: "center",
      });

      if (slide.author) {
        s.addText(`— ${slide.author}`, {
          x: 1.0,
          y: 3.8,
          w: 8.0,
          h: 0.6,
          fontSize: 16,
          bold: true,
          color: template.pptxAccent,
          fontFace,
          align: "center",
        });
      }
    } else if (layout === "bigNumber") {
      // Big number layout
      s.addText(slide.title, {
        x: 0.8,
        y: 0.5,
        w: 8.4,
        h: 0.8,
        fontSize: 26,
        bold: true,
        color: template.pptxText,
        fontFace: headingFontFace,
      });

      s.addText(slide.bigNumber || "99%", {
        x: 0.8,
        y: 1.4,
        w: 8.4,
        h: 1.5,
        fontSize: 64,
        bold: true,
        color: template.pptxAccent,
        fontFace: headingFontFace,
        align: "left",
      });

      if (slide.bullets && slide.bullets.length > 0) {
        const bulletsToLines = slide.bullets.map((b) => ({
          text: b,
          options: {
            bullet: { code: "25CF", color: template.pptxAccent },
            color: template.pptxText,
            fontSize: 16,
            fontFace,
            breakLine: true,
            paraSpaceAfter: 10,
          },
        }));

        s.addText(bulletsToLines, {
          x: 0.8,
          y: 3.1,
          w: 8.4,
          h: 2.0,
        });
      }
    } else if (layout === "threeColumn") {
      // Card grid — mirrors SlideCanvas's threeColumn branch (items.slice(0, 3))
      s.addText(slide.title, {
        x: 0.8, y: 0.4, w: 8.4, h: 0.7,
        fontSize: 28, bold: true, color: template.pptxText, fontFace: headingFontFace,
      });

      const cardItems = (slide.items && slide.items.length > 0 ? slide.items : []).slice(0, 3);
      const cardW = 2.65, gap = 0.15, startX = 0.8, startY = 1.4, cardH = 3.6;

      cardItems.forEach((item, i) => {
        const x = startX + i * (cardW + gap);
        s.addShape("roundRect", {
          x, y: startY, w: cardW, h: cardH,
          rectRadius: 0.08,
          fill: { color: template.pptxBg, transparency: 90 },
          line: { color: accentColor, width: 0.75 },
        });
        s.addText(String(i + 1).padStart(2, "0"), {
          x: x + 0.15, y: startY + 0.15, w: 0.5, h: 0.35,
          fontSize: 12, bold: true, color: template.pptxAccent, fontFace,
        });
        s.addText(item.title || `Feature ${i + 1}`, {
          x: x + 0.15, y: startY + 0.55, w: cardW - 0.3, h: 0.6,
          fontSize: 14, bold: true, color: template.pptxText, fontFace: headingFontFace,
        });
        s.addText(item.text || "", {
          x: x + 0.15, y: startY + 1.15, w: cardW - 0.3, h: cardH - 1.3,
          fontSize: 11, color: template.pptxText, fontFace,
        });
      });
    } else if (layout === "timeline") {
      // Sequential milestone nodes — mirrors SlideCanvas's timeline branch
      s.addText(slide.title, {
        x: 0.8, y: 0.4, w: 8.4, h: 0.7,
        fontSize: 28, bold: true, color: template.pptxText, fontFace: headingFontFace,
      });

      const nodes = (slide.items && slide.items.length > 0 ? slide.items : []).slice(0, 4);
      const n = Math.max(nodes.length, 1);
      const colW = 8.4 / n;

      s.addShape("line", {
        x: 1.0, y: 2.5, w: 8.0, h: 0,
        line: { color: accentColor, width: 1.5 },
      });

      nodes.forEach((item, i) => {
        const cx = 0.8 + colW * i + colW / 2;
        s.addShape("ellipse", {
          x: cx - 0.2, y: 2.3, w: 0.4, h: 0.4,
          fill: { color: template.pptxBg }, line: { color: accentColor, width: 2 },
        });
        s.addText(String(i + 1), {
          x: cx - 0.2, y: 2.3, w: 0.4, h: 0.4,
          fontSize: 12, bold: true, color: template.pptxAccent, fontFace, align: "center", valign: "middle",
        });
        s.addText(item.title || `Phase ${i + 1}`, {
          x: cx - colW / 2 + 0.05, y: 2.85, w: colW - 0.1, h: 0.4,
          fontSize: 12, bold: true, color: template.pptxText, fontFace, align: "center",
        });
        s.addText(item.text || "", {
          x: cx - colW / 2 + 0.05, y: 3.25, w: colW - 0.1, h: 1.0,
          fontSize: 10, color: template.pptxText, fontFace, align: "center",
        });
      });
    } else if (layout === "comparison") {
      // Two-column contrast — mirrors SlideCanvas's comparison branch, which
      // splits `items` in half rather than reading comparisonLeft/Right.
      s.addText(slide.title, {
        x: 0.8, y: 0.4, w: 8.4, h: 0.7,
        fontSize: 28, bold: true, color: template.pptxText, fontFace: headingFontFace,
      });

      const items = slide.items || [];
      const half = Math.ceil(items.length / 2);
      const left = items.slice(0, half);
      const right = items.slice(half);

      const col = (arr, x, label, labelColor, mark) => {
        s.addShape("roundRect", {
          x, y: 1.4, w: 4.0, h: 3.6, rectRadius: 0.08,
          fill: { color: template.pptxBg, transparency: 90 },
          line: { color: accentColor, width: 0.5 },
        });
        s.addText(label, {
          x: x + 0.2, y: 1.55, w: 3.6, h: 0.3,
          fontSize: 10, bold: true, color: labelColor, fontFace,
        });
        s.addText(arr.map((it) => ({
          text: `${mark}  ${it.text || ""}`,
          options: { color: template.pptxText, fontSize: 12, fontFace, breakLine: true, paraSpaceAfter: 8 },
        })), { x: x + 0.2, y: 2.0, w: 3.6, h: 2.8 });
      };

      col(left, 0.8, "OPTION A · BEFORE", "F87171", "✕");
      col(right, 5.2, "OPTION B · AFTER", "4ADE80", "✓");
    } else if (layout === "metricsGrid") {
      // KPI cards — mirrors SlideCanvas's metricsGrid branch
      s.addText(slide.title, {
        x: 0.8, y: 0.4, w: 8.4, h: 0.7,
        fontSize: 28, bold: true, color: template.pptxText, fontFace: headingFontFace,
      });

      const metrics = (slide.metrics && slide.metrics.length > 0
        ? slide.metrics
        : [{ value: "—", label: "Metric", change: "" }]
      ).slice(0, 3);
      const cardW = 2.65, gap = 0.15, startX = 0.8, startY = 1.6, cardH = 2.6;

      metrics.forEach((m, i) => {
        const x = startX + i * (cardW + gap);
        s.addShape("roundRect", {
          x, y: startY, w: cardW, h: cardH, rectRadius: 0.08,
          fill: { color: template.pptxBg, transparency: 90 },
          line: { color: accentColor, width: 0.5 },
        });
        s.addText(m.value || "—", {
          x, y: startY + 0.35, w: cardW, h: 0.9,
          fontSize: 34, bold: true, color: template.pptxAccent, fontFace: headingFontFace, align: "center",
        });
        s.addText(m.label || "", {
          x, y: startY + 1.3, w: cardW, h: 0.4,
          fontSize: 12, bold: true, color: template.pptxText, fontFace, align: "center",
        });
        if (m.change) {
          s.addText(m.change, {
            x, y: startY + 1.7, w: cardW, h: 0.4,
            fontSize: 10, color: template.pptxText, fontFace, align: "center",
          });
        }
      });
    } else if (layout === "splitImageLeft" || layout === "splitImageRight" || layout === "imageGallery") {
      // No image-generation pipeline yet — degrade to a clean text layout
      // rather than leaving a blank slide, so exports never look broken.
      s.addText(slide.title, {
        x: 0.8, y: 0.5, w: 8.4, h: 0.8,
        fontSize: 28, bold: true, color: template.pptxText, fontFace: headingFontFace,
      });
      const bulletsToLines = (arr) =>
        (arr || []).map((b) => ({
          text: b,
          options: { bullet: { code: "25CF", color: template.pptxAccent }, color: template.pptxText, fontSize: 16, fontFace, breakLine: true, paraSpaceAfter: 12 },
        }));
      s.addText(bulletsToLines(slide.bullets || []), { x: 0.8, y: 1.5, w: 8.4, h: 3.7 });
    } else {
      // Standard content or twoColumn layout
      s.addText(slide.title, {
        x: 0.8,
        y: 0.5,
        w: 8.4,
        h: 0.8,
        fontSize: 28,
        bold: true,
        color: template.pptxText,
        fontFace: headingFontFace,
      });

      const bulletsToLines = (arr) =>
        (arr || []).map((b) => ({
          text: b,
          options: {
            bullet: { code: "25CF", color: template.pptxAccent },
            color: template.pptxText,
            fontSize: 16,
            fontFace,
            breakLine: true,
            paraSpaceAfter: 12,
          },
        }));

      if (layout === "twoColumn" && slide.bullets && slide.bullets.length > 1) {
        const half = Math.ceil(slide.bullets.length / 2);
        const left = slide.bullets.slice(0, half);
        const right = slide.bullets.slice(half);

        s.addText(bulletsToLines(left), { x: 0.8, y: 1.5, w: 4.0, h: 3.7 });
        s.addText(bulletsToLines(right), { x: 5.2, y: 1.5, w: 4.0, h: 3.7 });
      } else {
        s.addText(bulletsToLines(slide.bullets || []), {
          x: 0.8,
          y: 1.5,
          w: 8.4,
          h: 3.7,
        });
      }
    }

    if (slide.notes) {
      s.addNotes(slide.notes);
    }
  });

  const fileName = `${sanitizeFileName(presentation.title)}.pptx`;
  await pptx.writeFile({ fileName });
}

function sanitizeFileName(name) {
  return (name || "presentation").replace(/[^a-z0-9\-_ ]/gi, "").trim() || "presentation";
}
