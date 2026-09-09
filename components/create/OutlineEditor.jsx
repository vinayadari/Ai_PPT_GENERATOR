"use client";

import { useState } from "react";
import Button from "../shared/Button";

export default function OutlineEditor({
  outline,
  onUpdateOutline,
  onBack,
  onGenerate,
  isGenerating,
}) {
  const [editingIndex, setEditingIndex] = useState(null);

  function updateItem(index, field, value) {
    const updated = [...outline];
    updated[index] = { ...updated[index], [field]: value };
    onUpdateOutline(updated);
  }

  function removeItem(index) {
    onUpdateOutline(outline.filter((_, i) => i !== index));
  }

  function addItem() {
    onUpdateOutline([
      ...outline,
      { title: "New Section", layout: "content" },
    ]);
  }

  function moveItem(from, to) {
    if (to < 0 || to >= outline.length) return;
    const updated = [...outline];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    onUpdateOutline(updated);
  }

  return (
    <div className="animate-fade-in-up" style={{ maxWidth: 640, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "var(--space-8)" }}>
        <h2
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "var(--text-3xl)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            marginBottom: "var(--space-2)",
          }}
        >
          Review your outline
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-base)" }}>
          Rearrange, edit, or add sections before generating the full deck.
        </p>
      </div>

      {/* Outline items */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-3)",
          marginBottom: "var(--space-6)",
        }}
      >
        {outline.map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-3)",
              padding: "var(--space-4) var(--space-5)",
              borderRadius: "var(--radius-md)",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-subtle)",
              transition: "all var(--transition-fast)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--border-default)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border-subtle)";
            }}
          >
            {/* Slide number */}
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: i === 0 ? "var(--accent)" : "var(--bg-elevated)",
                color: i === 0 ? "#fff" : "var(--text-tertiary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "var(--text-xs)",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {i + 1}
            </span>

            {/* Title (editable) */}
            {editingIndex === i ? (
              <input
                autoFocus
                value={item.title}
                onChange={(e) => updateItem(i, "title", e.target.value)}
                onBlur={() => setEditingIndex(null)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setEditingIndex(null);
                }}
                style={{
                  flex: 1,
                  padding: "4px 8px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--accent)",
                  background: "var(--bg-tertiary)",
                  color: "var(--text-primary)",
                  fontSize: "var(--text-base)",
                  outline: "none",
                }}
              />
            ) : (
              <span
                style={{
                  flex: 1,
                  fontSize: "var(--text-base)",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
                onClick={() => setEditingIndex(i)}
                title="Click to edit"
              >
                {item.title}
              </span>
            )}

            {/* Layout badge */}
            <span
              style={{
                fontSize: "var(--text-xs)",
                padding: "2px 8px",
                borderRadius: "var(--radius-full)",
                background: "var(--bg-card)",
                color: "var(--text-tertiary)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              {item.layout}
            </span>

            {/* Actions */}
            <div style={{ display: "flex", gap: 2 }}>
              <IconBtn
                title="Move up"
                onClick={() => moveItem(i, i - 1)}
                disabled={i === 0}
              >
                ↑
              </IconBtn>
              <IconBtn
                title="Move down"
                onClick={() => moveItem(i, i + 1)}
                disabled={i === outline.length - 1}
              >
                ↓
              </IconBtn>
              <IconBtn
                title="Remove"
                onClick={() => removeItem(i)}
                disabled={outline.length <= 1}
                danger
              >
                ✕
              </IconBtn>
            </div>
          </div>
        ))}
      </div>

      {/* Add section */}
      <button
        onClick={addItem}
        style={{
          width: "100%",
          padding: "var(--space-3)",
          borderRadius: "var(--radius-md)",
          border: "1px dashed var(--border-default)",
          background: "transparent",
          color: "var(--text-tertiary)",
          fontSize: "var(--text-sm)",
          fontWeight: 500,
          cursor: "pointer",
          transition: "all var(--transition-fast)",
          marginBottom: "var(--space-8)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--accent)";
          e.currentTarget.style.color = "var(--accent-light)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--border-default)";
          e.currentTarget.style.color = "var(--text-tertiary)";
        }}
      >
        + Add section
      </button>

      {/* Navigation */}
      <div
        style={{
          display: "flex",
          gap: "var(--space-4)",
          justifyContent: "center",
        }}
      >
        <Button variant="secondary" size="lg" onClick={onBack}>
          ← Back
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={onGenerate}
          loading={isGenerating}
          iconRight={!isGenerating && <span>✦</span>}
        >
          {isGenerating ? "Generating..." : "Generate Presentation"}
        </Button>
      </div>
    </div>
  );
}

function IconBtn({ children, onClick, disabled, title, danger = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        width: 28,
        height: 28,
        borderRadius: "var(--radius-sm)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 13,
        color: danger ? "var(--rose)" : "var(--text-tertiary)",
        opacity: disabled ? 0.3 : 1,
        cursor: disabled ? "default" : "pointer",
        transition: "all var(--transition-fast)",
        background: "transparent",
        border: "none",
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.background = "var(--bg-elevated)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
      }}
    >
      {children}
    </button>
  );
}
