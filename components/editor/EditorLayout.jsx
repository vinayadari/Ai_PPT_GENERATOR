"use client";

import { useState, useRef, useEffect } from "react";
import EditorToolbar from "./EditorToolbar";
import SlideThumbnails from "./SlideThumbnails";
import SlideCanvas from "./SlideCanvas";
import AIPanel from "./AIPanel";
import PresentationMode from "./PresentationMode";
import { TEMPLATES } from "../../lib/templates";
import { exportPptx } from "../../lib/pptxExport";
import { exportPdf } from "../../lib/pdfExport";

export default function EditorLayout({
  presentation,
  templateId,
  activeSlideIndex,
  onSelectSlide,
  onUpdateSlide,
  onAddSlide,
  onDeleteSlide,
  onDuplicateSlide,
  onMoveSlide,
  onSelectTemplate,
  onUpdateTitle,
}) {
  const [aiPanelOpen, setAiPanelOpen] = useState(true);
  const [isPresenting, setIsPresenting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState("");

  const hiddenPdfRef = useRef(null);
  const activeTemplate = TEMPLATES[templateId] || TEMPLATES.midnight;
  const slides = presentation?.slides || [];
  const currentSlide = slides[activeSlideIndex] || slides[0];

  // Arrow-key slide navigation (skip when user is typing in an input/editable)
  useEffect(() => {
    function handleKeyDown(e) {
      const tag = document.activeElement?.tagName;
      const isEditable =
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        document.activeElement?.isContentEditable;
      if (isEditable) return;

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        onSelectSlide(Math.min(activeSlideIndex + 1, slides.length - 1));
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        onSelectSlide(Math.max(activeSlideIndex - 1, 0));
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeSlideIndex, slides.length, onSelectSlide]);

  async function handleExportPptx() {
    if (!presentation) return;
    setIsExporting(true);
    setExportError("");
    try {
      await exportPptx(presentation, activeTemplate);
    } catch (err) {
      console.error("PPTX export failed:", err);
      setExportError(err.message || "Failed to export PowerPoint.");
    } finally {
      setIsExporting(false);
    }
  }

  async function handleExportPdf() {
    if (!presentation || !hiddenPdfRef.current) return;
    setIsExporting(true);
    setExportError("");
    try {
      await exportPdf(hiddenPdfRef.current, presentation.title);
    } catch (err) {
      console.error("PDF export failed:", err);
      setExportError(err.message || "Failed to export PDF.");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--color-bg-primary)" }}>
      {/* Top Toolbar */}
      <EditorToolbar
        presentation={presentation}
        templateId={templateId}
        onUpdateTitle={onUpdateTitle}
        onSelectTemplate={onSelectTemplate}
        onExportPptx={handleExportPptx}
        onExportPdf={handleExportPdf}
        isExporting={isExporting}
        onStartPresenting={() => setIsPresenting(true)}
        aiPanelOpen={aiPanelOpen}
        onToggleAIPanel={() => setAiPanelOpen(!aiPanelOpen)}
        activeSlideIndex={activeSlideIndex}
        totalSlides={slides.length}
      />

      {exportError && (
        <div
          style={{
            background: "rgba(239,68,68,0.15)",
            borderBottom: "1px solid rgba(239,68,68,0.3)",
            color: "#f87171",
            padding: "8px var(--space-6)",
            fontSize: "var(--text-xs)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>{exportError}</span>
          <button
            onClick={() => setExportError("")}
            style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer" }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Workspace Area (Left sidebar, Canvas, Right AIPanel) */}
      <div style={{ display: "flex", flex: 1, height: "calc(100vh - 64px)", overflow: "hidden" }}>
        {/* Left Thumbnails Strip */}
        <SlideThumbnails
          slides={slides}
          activeIndex={activeSlideIndex}
          onSelectSlide={onSelectSlide}
          onAddSlide={onAddSlide}
          onDeleteSlide={onDeleteSlide}
          onDuplicateSlide={onDuplicateSlide}
          onMoveSlide={onMoveSlide}
          template={activeTemplate}
        />

        {/* Center Canvas */}
        <main
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            overflowY: "auto",
            background: "var(--color-bg-primary)",
          }}
        >
          <SlideCanvas
            slide={currentSlide}
            template={activeTemplate}
            onUpdateSlide={(updates) => onUpdateSlide(activeSlideIndex, updates)}
            editable={true}
          />
        </main>

        {/* Right AI Assistant Panel */}
        <AIPanel
          slide={currentSlide}
          onUpdateSlide={(updates) => onUpdateSlide(activeSlideIndex, updates)}
          isOpen={aiPanelOpen}
          onClose={() => setAiPanelOpen(false)}
        />
      </div>

      {/* Fullscreen Presentation Mode */}
      {isPresenting && (
        <PresentationMode
          slides={slides}
          currentIndex={activeSlideIndex}
          template={activeTemplate}
          onClose={() => setIsPresenting(false)}
          onChangeIndex={onSelectSlide}
        />
      )}

      {/* Offscreen container for PDF Export (html2canvas captures at exact 960x540) */}
      <div
        ref={hiddenPdfRef}
        style={{
          position: "fixed",
          left: -9999,
          top: -9999,
          width: 960,
          pointerEvents: "none",
          opacity: 0,
        }}
      >
        {slides.map((slide, idx) => (
          <div
            key={slide.id || idx}
            data-export-slide
            style={{
              width: 960,
              height: 540,
              background: activeTemplate.cssBg,
              color: activeTemplate.cssText,
              fontFamily: `${activeTemplate.font}, sans-serif`,
              padding: slide.layout === "title" || slide.layout === "section" ? "0 80px" : "48px 64px",
              display: "flex",
              flexDirection: "column",
              justifyContent: slide.layout === "title" || slide.layout === "section" || slide.layout === "quote" ? "center" : "flex-start",
              boxSizing: "border-box",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Accent bar */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: 8,
                background: activeTemplate.cssAccent,
              }}
            />

            {slide.layout === "title" && (
              <div>
                <div
                  style={{
                    fontFamily: `${activeTemplate.headingFont}, sans-serif`,
                    fontSize: 46,
                    fontWeight: 800,
                    lineHeight: 1.15,
                    marginBottom: 18,
                  }}
                >
                  {slide.title}
                </div>
                {(slide.subtitle || (slide.bullets && slide.bullets[0])) && (
                  <div style={{ fontSize: 20, color: activeTemplate.cssSubText }}>
                    {slide.subtitle || slide.bullets[0]}
                  </div>
                )}
              </div>
            )}

            {slide.layout === "section" && (
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: `${activeTemplate.headingFont}, sans-serif`,
                    fontSize: 48,
                    fontWeight: 800,
                    lineHeight: 1.15,
                    marginBottom: 16,
                  }}
                >
                  {slide.title}
                </div>
                {slide.subtitle && (
                  <div style={{ fontSize: 18, color: activeTemplate.cssSubText }}>
                    {slide.subtitle}
                  </div>
                )}
              </div>
            )}

            {slide.layout === "quote" && (
              <div style={{ textAlign: "center", padding: "0 40px" }}>
                <div
                  style={{
                    fontSize: 64,
                    lineHeight: 1,
                    color: activeTemplate.cssAccent,
                    fontFamily: "Georgia, serif",
                  }}
                >
                  “
                </div>
                <div
                  style={{
                    fontFamily: `${activeTemplate.headingFont}, sans-serif`,
                    fontSize: 28,
                    fontStyle: "italic",
                    marginBottom: 20,
                  }}
                >
                  {slide.quote || slide.title}
                </div>
                {slide.author && (
                  <div style={{ fontSize: 16, fontWeight: 700, color: activeTemplate.cssAccent }}>
                    — {slide.author}
                  </div>
                )}
              </div>
            )}

            {slide.layout === "bigNumber" && (
              <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <div
                  style={{
                    fontFamily: `${activeTemplate.headingFont}, sans-serif`,
                    fontSize: 30,
                    fontWeight: 700,
                    marginBottom: 20,
                  }}
                >
                  {slide.title}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 40, flex: 1 }}>
                  <div
                    style={{
                      fontSize: 68,
                      fontWeight: 900,
                      color: activeTemplate.cssAccent,
                      minWidth: 220,
                    }}
                  >
                    {slide.bigNumber || "99%"}
                  </div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                    {(slide.bullets || []).map((b, i) => (
                      <div key={i} style={{ fontSize: 18 }}>
                        ● {b}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {slide.layout !== "title" && slide.layout !== "section" && slide.layout !== "quote" && slide.layout !== "bigNumber" && (
              <div>
                <div
                  style={{
                    fontFamily: `${activeTemplate.headingFont}, sans-serif`,
                    fontSize: 32,
                    fontWeight: 700,
                    marginBottom: 24,
                  }}
                >
                  {slide.title}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {(slide.bullets || []).map((b, i) => (
                    <div key={i} style={{ fontSize: 18, lineHeight: 1.4 }}>
                      <span style={{ color: activeTemplate.cssAccent, marginRight: 10 }}>●</span>
                      {b}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
