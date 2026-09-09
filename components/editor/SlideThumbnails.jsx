"use client";

import { useState } from "react";
import { LAYOUT_LIST } from "../../lib/layouts";

export default function SlideThumbnails({
  slides,
  activeIndex,
  onSelectSlide,
  onAddSlide,
  onDeleteSlide,
  onDuplicateSlide,
  onMoveSlide,
  template,
}) {
  const [showAddMenu, setShowAddMenu] = useState(false);

  return (
    <aside
      style={{
        width: 260,
        background: "var(--color-bg-secondary)",
        borderRight: "1px solid var(--color-border)",
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 64px)",
        overflowY: "auto",
        padding: "var(--space-4) var(--space-3)",
        userSelect: "none",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "var(--space-3)",
          padding: "0 var(--space-2)",
        }}
      >
        <span
          style={{
            fontSize: "var(--text-xs)",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "var(--color-text-muted)",
          }}
        >
          Slides ({slides.length})
        </span>

        <button
          onClick={() => setShowAddMenu(!showAddMenu)}
          title="Add new slide"
          style={{
            background: "var(--color-accent-subtle)",
            border: "1px solid rgba(99, 102, 241, 0.3)",
            color: "var(--color-accent-light)",
            borderRadius: "var(--radius-sm)",
            width: 24,
            height: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          +
        </button>
      </div>

      {/* Add Slide Menu */}
      {showAddMenu && (
        <div
          style={{
            background: "var(--color-bg-primary)",
            border: "1px solid var(--color-border-hover)",
            borderRadius: "var(--radius-md)",
            padding: "var(--space-2)",
            marginBottom: "var(--space-3)",
            boxShadow: "var(--shadow-lg)",
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 6,
          }}
        >
          {LAYOUT_LIST.map((layout) => (
            <button
              key={layout.id}
              onClick={() => {
                onAddSlide({
                  layout: layout.id,
                  title: layout.name,
                  bullets: layout.id === "bigNumber" ? ["Stat description"] : ["Key takeaway point"],
                  subtitle: layout.id === "title" || layout.id === "section" ? "Subtitle or summary" : "",
                  bigNumber: layout.id === "bigNumber" ? "99%" : "",
                  quote: layout.id === "quote" ? "An inspirational quote" : "",
                  author: layout.id === "quote" ? "Author" : "",
                  notes: "",
                });
                setShowAddMenu(false);
              }}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-sm)",
                padding: "6px 8px",
                color: "var(--color-text-secondary)",
                fontSize: 11,
                display: "flex",
                alignItems: "center",
                gap: 6,
                cursor: "pointer",
                textAlign: "left",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--color-accent-subtle)";
                e.currentTarget.style.color = "var(--color-text-primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                e.currentTarget.style.color = "var(--color-text-secondary)";
              }}
            >
              <span>{layout.icon}</span>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {layout.name}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Slide Thumbnails List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", flex: 1 }}>
        {slides.map((slide, idx) => {
          const isActive = idx === activeIndex;

          return (
            <div
              key={slide.id || idx}
              onClick={() => onSelectSlide(idx)}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
                padding: 6,
                borderRadius: "var(--radius-md)",
                background: isActive ? "rgba(99, 102, 241, 0.12)" : "rgba(255,255,255,0.02)",
                border: isActive
                  ? "2px solid var(--color-accent)"
                  : "1px solid var(--color-border)",
                cursor: "pointer",
                transition: "all var(--transition-fast)",
              }}
            >
              {/* Slide Number */}
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: isActive ? "var(--color-accent)" : "var(--color-text-muted)",
                  width: 18,
                  textAlign: "center",
                  flexShrink: 0,
                }}
              >
                {idx + 1}
              </span>

              {/* Mini Slide Preview Canvas */}
              <div
                style={{
                  flex: 1,
                  aspectRatio: "16 / 9",
                  background: template.cssBg,
                  borderRadius: 4,
                  padding: 8,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: slide.layout === "title" || slide.layout === "section" ? "center" : "flex-start",
                  border: "1px solid rgba(255,255,255,0.06)",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                }}
              >
                {/* Accent line on left */}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 3,
                    background: template.cssAccent,
                  }}
                />

                {/* Mini Title */}
                <div
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    color: template.cssText,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    lineHeight: 1.2,
                  }}
                >
                  {slide.title || "Untitled"}
                </div>

                {/* Mini Layout Indicator Badge */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 4,
                    right: 4,
                    fontSize: 8,
                    padding: "1px 4px",
                    borderRadius: 3,
                    background: "rgba(0,0,0,0.5)",
                    color: template.cssAccent,
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  {slide.layout}
                </div>
              </div>

              {/* Action controls (Up, Down, Duplicate, Delete) */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  opacity: isActive ? 1 : 0.4,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {idx > 0 && (
                  <button
                    onClick={() => onMoveSlide(idx, idx - 1)}
                    title="Move up"
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--color-text-secondary)",
                      cursor: "pointer",
                      fontSize: 10,
                      padding: 1,
                    }}
                  >
                    ▲
                  </button>
                )}
                {idx < slides.length - 1 && (
                  <button
                    onClick={() => onMoveSlide(idx, idx + 1)}
                    title="Move down"
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--color-text-secondary)",
                      cursor: "pointer",
                      fontSize: 10,
                      padding: 1,
                    }}
                  >
                    ▼
                  </button>
                )}
                <button
                  onClick={() => onDuplicateSlide(idx)}
                  title="Duplicate slide"
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--color-text-secondary)",
                    cursor: "pointer",
                    fontSize: 10,
                    padding: 1,
                  }}
                >
                  ❐
                </button>
                {slides.length > 1 && (
                  <button
                    onClick={() => onDeleteSlide(idx)}
                    title="Delete slide"
                    style={{
                      background: "none",
                      border: "none",
                      color: "#ef4444",
                      cursor: "pointer",
                      fontSize: 10,
                      padding: 1,
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
