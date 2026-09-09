"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "../shared/Button";
import { TEMPLATES, TEMPLATE_LIST } from "../../lib/templates";

export default function EditorToolbar({
  presentation,
  templateId,
  onUpdateTitle,
  onSelectTemplate,
  onExportPptx,
  onExportPdf,
  isExporting,
  onStartPresenting,
  aiPanelOpen,
  onToggleAIPanel,
  activeSlideIndex,
  totalSlides,
}) {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(presentation?.title || "");

  const activeTemplate = TEMPLATES[templateId] || TEMPLATES.midnight;

  function handleTitleBlur() {
    setIsEditingTitle(false);
    if (titleValue.trim() && onUpdateTitle) {
      onUpdateTitle(titleValue.trim());
    }
  }

  return (
    <header
      style={{
        height: 64,
        background: "var(--color-bg-secondary)",
        borderBottom: "1px solid var(--color-border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 var(--space-6)",
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Left side: Back to dashboard + Title */}
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", minWidth: 0 }}>
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
            textDecoration: "none",
            color: "var(--color-text-secondary)",
            fontSize: "var(--text-sm)",
            fontWeight: 500,
            padding: "var(--space-2) var(--space-3)",
            borderRadius: "var(--radius-md)",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid var(--color-border)",
            transition: "all var(--transition-fast)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--color-text-primary)";
            e.currentTarget.style.borderColor = "var(--color-border-hover)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--color-text-secondary)";
            e.currentTarget.style.borderColor = "var(--color-border)";
          }}
        >
          <span>←</span>
          <span>Home</span>
        </Link>

        <div style={{ width: 1, height: 24, background: "var(--color-border)" }} />

        {/* Editable Title */}
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", minWidth: 0 }}>
          {isEditingTitle ? (
            <input
              type="text"
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleTitleBlur();
                if (e.key === "Escape") {
                  setTitleValue(presentation?.title || "");
                  setIsEditingTitle(false);
                }
              }}
              autoFocus
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid var(--color-accent)",
                borderRadius: "var(--radius-sm)",
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-heading)",
                fontSize: "var(--text-base)",
                fontWeight: 600,
                padding: "2px 8px",
                outline: "none",
                width: 320,
              }}
            />
          ) : (
            <button
              onClick={() => {
                setTitleValue(presentation?.title || "");
                setIsEditingTitle(true);
              }}
              title="Click to rename presentation"
              style={{
                background: "transparent",
                border: "none",
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-heading)",
                fontSize: "var(--text-base)",
                fontWeight: 600,
                cursor: "pointer",
                padding: "4px 8px",
                borderRadius: "var(--radius-sm)",
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
                maxWidth: 340,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                textAlign: "left",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                {presentation?.title || "Untitled Presentation"}
              </span>
              <span style={{ opacity: 0.4, fontSize: "var(--text-xs)" }}>✎</span>
            </button>
          )}

          <span
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--color-text-muted)",
              background: "rgba(255,255,255,0.05)",
              padding: "2px 8px",
              borderRadius: "var(--radius-full)",
              fontWeight: 500,
              flexShrink: 0,
            }}
          >
            Slide {activeSlideIndex + 1} of {totalSlides}
          </span>
        </div>
      </div>

      {/* Right side: Template, Present, AI, Export */}
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", position: "relative" }}>
        {/* Template Selector dropdown */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowTemplateMenu(!showTemplateMenu)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-2)",
              padding: "var(--space-2) var(--space-3)",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
              color: "var(--color-text-primary)",
              fontSize: "var(--text-xs)",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: activeTemplate.cssAccent,
              }}
            />
            <span>{activeTemplate.name}</span>
            <span style={{ fontSize: 10, opacity: 0.7 }}>▾</span>
          </button>

          {showTemplateMenu && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: 6,
                background: "var(--color-bg-secondary)",
                border: "1px solid var(--color-border-hover)",
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--shadow-xl)",
                padding: "var(--space-2)",
                zIndex: 60,
                width: 220,
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <div
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--color-text-muted)",
                  padding: "4px 8px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Choose Theme
              </div>
              {TEMPLATE_LIST.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => {
                    onSelectTemplate(tpl.id);
                    setShowTemplateMenu(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-3)",
                    padding: "8px 10px",
                    background: tpl.id === templateId ? "rgba(255,255,255,0.08)" : "transparent",
                    border: "none",
                    borderRadius: "var(--radius-md)",
                    color: "var(--color-text-primary)",
                    fontSize: "var(--text-xs)",
                    textAlign: "left",
                    cursor: "pointer",
                    width: "100%",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background =
                      tpl.id === templateId ? "rgba(255,255,255,0.08)" : "transparent")
                  }
                >
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: tpl.cssBg,
                      border: `2px solid ${tpl.cssAccent}`,
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <div style={{ fontWeight: 600 }}>{tpl.name}</div>
                    <div style={{ fontSize: 10, color: "var(--color-text-muted)" }}>
                      {tpl.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Present mode button */}
        <Button
          variant="secondary"
          size="sm"
          onClick={onStartPresenting}
          style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}
        >
          <span>▶</span>
          <span>Present</span>
        </Button>

        {/* AI Assistant drawer toggle */}
        <Button
          variant={aiPanelOpen ? "primary" : "secondary"}
          size="sm"
          onClick={onToggleAIPanel}
          style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}
        >
          <span>✨</span>
          <span>AI Assistant</span>
        </Button>

        {/* Export dropdown */}
        <div style={{ position: "relative" }}>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowExportMenu(!showExportMenu)}
            disabled={isExporting}
            style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}
          >
            <span>{isExporting ? "Exporting..." : "Export"}</span>
            <span style={{ fontSize: 10 }}>▾</span>
          </Button>

          {showExportMenu && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: 6,
                background: "var(--color-bg-secondary)",
                border: "1px solid var(--color-border-hover)",
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--shadow-xl)",
                padding: "var(--space-2)",
                zIndex: 60,
                width: 200,
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <button
                onClick={() => {
                  setShowExportMenu(false);
                  onExportPptx();
                }}
                disabled={isExporting}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-3)",
                  padding: "10px 12px",
                  background: "transparent",
                  border: "none",
                  borderRadius: "var(--radius-md)",
                  color: "var(--color-text-primary)",
                  fontSize: "var(--text-xs)",
                  textAlign: "left",
                  cursor: "pointer",
                  width: "100%",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <span style={{ fontSize: 16 }}>📊</span>
                <div>
                  <div style={{ fontWeight: 600 }}>PowerPoint (.pptx)</div>
                  <div style={{ fontSize: 10, color: "var(--color-text-muted)" }}>
                    Editable slides & notes
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setShowExportMenu(false);
                  onExportPdf();
                }}
                disabled={isExporting}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-3)",
                  padding: "10px 12px",
                  background: "transparent",
                  border: "none",
                  borderRadius: "var(--radius-md)",
                  color: "var(--color-text-primary)",
                  fontSize: "var(--text-xs)",
                  textAlign: "left",
                  cursor: "pointer",
                  width: "100%",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <span style={{ fontSize: 16 }}>📄</span>
                <div>
                  <div style={{ fontWeight: 600 }}>PDF Document (.pdf)</div>
                  <div style={{ fontSize: 10, color: "var(--color-text-muted)" }}>
                    Print & presentation ready
                  </div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
