"use client";

import { TEMPLATE_LIST } from "../../lib/templates";
import Button from "../shared/Button";

export default function StylePicker({ selectedId, onSelect, onNext, onBack }) {
  return (
    <div className="animate-fade-in-up" style={{ maxWidth: 780, margin: "0 auto" }}>
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
          Choose a style
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-base)" }}>
          Pick a theme that fits your presentation's tone.
        </p>
      </div>

      {/* Template grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "var(--space-5)",
          marginBottom: "var(--space-8)",
        }}
      >
        {TEMPLATE_LIST.map((t) => {
          const isSelected = selectedId === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onSelect(t.id)}
              style={{
                position: "relative",
                borderRadius: "var(--radius-lg)",
                border: isSelected
                  ? "2px solid var(--accent)"
                  : "2px solid var(--border-subtle)",
                overflow: "hidden",
                cursor: "pointer",
                padding: 0,
                transition: "all var(--transition-base)",
                boxShadow: isSelected ? "var(--shadow-glow)" : "none",
                transform: isSelected ? "scale(1.02)" : "scale(1)",
              }}
              onMouseEnter={(e) => {
                if (!isSelected)
                  e.currentTarget.style.borderColor = "var(--border-strong)";
                e.currentTarget.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                if (!isSelected)
                  e.currentTarget.style.borderColor = "var(--border-subtle)";
                if (!isSelected) e.currentTarget.style.transform = "scale(1)";
              }}
            >
              {/* Mini slide preview */}
              <div
                style={{
                  width: "100%",
                  aspectRatio: "16/9",
                  background: t.cssBg,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  padding: "16px 20px",
                  position: "relative",
                }}
              >
                {/* Accent bar */}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 4,
                    background: t.cssAccent,
                  }}
                />
                {/* Decorative shape */}
                <div
                  style={{
                    position: "absolute",
                    right: -20,
                    top: -20,
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: t.cssDecorColor,
                  }}
                />
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: t.cssText,
                    fontFamily: "var(--font-heading)",
                    marginBottom: 4,
                  }}
                >
                  Slide Title
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                  }}
                >
                  {[85, 70, 55].map((w, i) => (
                    <div
                      key={i}
                      style={{
                        width: `${w}%`,
                        height: 4,
                        borderRadius: 2,
                        background: t.cssSubText || t.cssText,
                        opacity: 0.4,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Label */}
              <div
                style={{
                  padding: "10px 14px",
                  background: "var(--bg-secondary)",
                  borderTop: "1px solid var(--border-subtle)",
                }}
              >
                <div
                  style={{
                    fontSize: "var(--text-sm)",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    marginBottom: 2,
                  }}
                >
                  {t.name}
                </div>
                <div
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--text-tertiary)",
                  }}
                >
                  {t.description}
                </div>
              </div>

              {/* Selected checkmark */}
              {isSelected && (
                <div
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: "var(--accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 700,
                    boxShadow: "0 2px 8px rgba(124,92,252,0.4)",
                  }}
                >
                  ✓
                </div>
              )}
            </button>
          );
        })}
      </div>

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
          onClick={onNext}
          iconRight={<span>→</span>}
        >
          Generate Outline
        </Button>
      </div>
    </div>
  );
}
