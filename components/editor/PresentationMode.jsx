"use client";

import { useEffect, useState, useCallback } from "react";
import SlideCanvas from "./SlideCanvas";

export default function PresentationMode({
  slides,
  currentIndex,
  template,
  onClose,
  onChangeIndex,
}) {
  const [index, setIndex] = useState(currentIndex || 0);

  const goNext = useCallback(() => {
    if (index < slides.length - 1) {
      const next = index + 1;
      setIndex(next);
      if (onChangeIndex) onChangeIndex(next);
    }
  }, [index, slides.length, onChangeIndex]);

  const goPrev = useCallback(() => {
    if (index > 0) {
      const prev = index - 1;
      setIndex(prev);
      if (onChangeIndex) onChangeIndex(prev);
    }
  }, [index, onChangeIndex]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev, onClose]);

  const currentSlide = slides[index];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#000000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Slide Display Area */}
      <div
        style={{
          width: "100%",
          maxWidth: 1200,
          padding: "20px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <SlideCanvas
          slide={currentSlide}
          template={template}
          onUpdateSlide={() => {}}
          editable={false}
        />
      </div>

      {/* Floating control bar */}
      <div
        style={{
          position: "fixed",
          bottom: 24,
          display: "flex",
          alignItems: "center",
          gap: 16,
          background: "rgba(20,20,25,0.85)",
          backdropFilter: "blur(12px)",
          padding: "8px 18px",
          borderRadius: "var(--radius-full)",
          border: "1px solid rgba(255,255,255,0.15)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
        }}
      >
        <button
          onClick={goPrev}
          disabled={index === 0}
          style={{
            background: "none",
            border: "none",
            color: index === 0 ? "rgba(255,255,255,0.2)" : "#ffffff",
            cursor: index === 0 ? "default" : "pointer",
            fontSize: 16,
            padding: "4px 8px",
          }}
        >
          ◀ Prev
        </button>

        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "rgba(255,255,255,0.8)",
            minWidth: 80,
            textAlign: "center",
          }}
        >
          {index + 1} / {slides.length}
        </span>

        <button
          onClick={goNext}
          disabled={index === slides.length - 1}
          style={{
            background: "none",
            border: "none",
            color: index === slides.length - 1 ? "rgba(255,255,255,0.2)" : "#ffffff",
            cursor: index === slides.length - 1 ? "default" : "pointer",
            fontSize: 16,
            padding: "4px 8px",
          }}
        >
          Next ▶
        </button>

        <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.2)" }} />

        <button
          onClick={onClose}
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "none",
            borderRadius: "var(--radius-full)",
            color: "#ffffff",
            cursor: "pointer",
            fontSize: 12,
            padding: "4px 12px",
            fontWeight: 500,
          }}
        >
          Exit (Esc)
        </button>
      </div>
    </div>
  );
}
