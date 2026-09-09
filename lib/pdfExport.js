"use client";

// Renders each slide from an offscreen container (populated by the caller,
// see app/page.js `hiddenExportRef`) to a canvas, then stitches the images
// into a landscape PDF, one page per slide.
export async function exportPdf(containerEl, fileTitle) {
  const html2canvas = (await import("html2canvas")).default;
  const { jsPDF } = await import("jspdf");

  const slideNodes = containerEl.querySelectorAll("[data-export-slide]");
  if (slideNodes.length === 0) {
    throw new Error("No slides found to export.");
  }

  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [960, 540],
  });

  for (let i = 0; i < slideNodes.length; i++) {
    const node = slideNodes[i];
    const canvas = await html2canvas(node, {
      width: 960,
      height: 540,
      scale: 2,
      useCORS: true,
    });
    const imgData = canvas.toDataURL("image/jpeg", 0.95);

    if (i > 0) pdf.addPage([960, 540], "landscape");
    pdf.addImage(imgData, "JPEG", 0, 0, 960, 540);
  }

  pdf.save(`${sanitizeFileName(fileTitle)}.pdf`);
}

function sanitizeFileName(name) {
  return (name || "presentation").replace(/[^a-z0-9\-_ ]/gi, "").trim() || "presentation";
}
