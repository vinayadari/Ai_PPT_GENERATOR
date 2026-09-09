"use client";

import { useState } from "react";
import Button from "../shared/Button";
import LoadingSpinner from "../shared/LoadingSpinner";

export default function AIPanel({
  slide,
  onUpdateSlide,
  isOpen,
  onClose,
}) {
  const [loadingAction, setLoadingAction] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [suggestion, setSuggestion] = useState(null);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  async function handleAIAction(action, text) {
    setLoadingAction(action);
    setError("");
    setSuggestion(null);

    try {
      const res = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          text,
          slideContext: {
            title: slide.title,
            bullets: slide.bullets,
            layout: slide.layout,
          },
          customInstruction: action === "custom" ? customPrompt : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "AI action failed");

      if (action === "generateNotes") {
        onUpdateSlide({ notes: data.result });
      } else {
        setSuggestion({ action, result: data.result });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingAction("");
    }
  }

  function applySuggestion() {
    if (!suggestion) return;

    if (suggestion.action === "shorten" || suggestion.action === "professional" || suggestion.action === "expand") {
      // Split suggestion into bullet points or lines
      const lines = suggestion.result
        .split("\n")
        .map((l) => l.replace(/^[-*•\d.]+\s*/, "").trim())
        .filter(Boolean);

      if (lines.length > 0) {
        onUpdateSlide({ bullets: lines });
      }
    } else if (suggestion.action === "custom") {
      const lines = suggestion.result
        .split("\n")
        .map((l) => l.replace(/^[-*•\d.]+\s*/, "").trim())
        .filter(Boolean);
      if (lines.length > 1) {
        onUpdateSlide({ bullets: lines });
      } else {
        onUpdateSlide({ subtitle: suggestion.result });
      }
    }

    setSuggestion(null);
  }

  return (
    <aside
      style={{
        width: 320,
        background: "var(--color-bg-secondary)",
        borderLeft: "1px solid var(--color-border)",
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 64px)",
        padding: "var(--space-4)",
        overflowY: "auto",
        boxShadow: "var(--shadow-lg)",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "var(--space-4)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>✨</span>
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: "var(--text-sm)",
              color: "var(--color-text-primary)",
            }}
          >
            AI Slide Assistant
          </span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "var(--color-text-muted)",
            cursor: "pointer",
            fontSize: 16,
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: 16 }}>
        Enhance the current slide with one click or provide your own custom instructions.
      </div>

      {error && (
        <div
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.2)",
            color: "#f87171",
            borderRadius: "var(--radius-md)",
            padding: "8px 12px",
            fontSize: "var(--text-xs)",
            marginBottom: 12,
          }}
        >
          {error}
        </div>
      )}

      {/* Quick Action Buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
        <button
          onClick={() => handleAIAction("professional", (slide.bullets || []).join("\n"))}
          disabled={!!loadingAction}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 14px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            color: "var(--color-text-primary)",
            fontSize: "var(--text-xs)",
            fontWeight: 500,
            cursor: "pointer",
            textAlign: "left",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-accent-subtle)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
        >
          <span>💼</span>
          <span>Make More Professional</span>
        </button>

        <button
          onClick={() => handleAIAction("shorten", (slide.bullets || []).join("\n"))}
          disabled={!!loadingAction}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 14px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            color: "var(--color-text-primary)",
            fontSize: "var(--text-xs)",
            fontWeight: 500,
            cursor: "pointer",
            textAlign: "left",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-accent-subtle)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
        >
          <span>✂️</span>
          <span>Make More Concise</span>
        </button>

        <button
          onClick={() => handleAIAction("expand", (slide.bullets || []).join("\n"))}
          disabled={!!loadingAction}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 14px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            color: "var(--color-text-primary)",
            fontSize: "var(--text-xs)",
            fontWeight: 500,
            cursor: "pointer",
            textAlign: "left",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-accent-subtle)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
        >
          <span>📝</span>
          <span>Expand Points</span>
        </button>

        <button
          onClick={() => handleAIAction("generateNotes", "")}
          disabled={!!loadingAction}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 14px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            color: "var(--color-text-primary)",
            fontSize: "var(--text-xs)",
            fontWeight: 500,
            cursor: "pointer",
            textAlign: "left",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-accent-subtle)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
        >
          <span>🎙️</span>
          <span>Generate Speaker Notes</span>
        </button>
      </div>

      {loadingAction && (
        <div style={{ display: "flex", justifyContent: "center", padding: "16px 0" }}>
          <LoadingSpinner size={24} text={`AI is thinking...`} />
        </div>
      )}

      {/* Suggestion Preview Box */}
      {suggestion && (
        <div
          style={{
            background: "rgba(99, 102, 241, 0.08)",
            border: "1px solid rgba(99, 102, 241, 0.25)",
            borderRadius: "var(--radius-md)",
            padding: "12px",
            marginBottom: 16,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              color: "var(--color-accent-light)",
              marginBottom: 6,
            }}
          >
            AI Suggestion
          </div>
          <div
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--color-text-primary)",
              lineHeight: 1.4,
              whiteSpace: "pre-wrap",
              maxHeight: 180,
              overflowY: "auto",
              marginBottom: 10,
            }}
          >
            {suggestion.result}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="primary" size="sm" onClick={applySuggestion} style={{ flex: 1 }}>
              Apply to Slide
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setSuggestion(null)}>
              Dismiss
            </Button>
          </div>
        </div>
      )}

      {/* Custom AI Instruction */}
      <div style={{ marginTop: "auto", paddingTop: 16, borderTop: "1px solid var(--color-border)" }}>
        <div
          style={{
            fontSize: "var(--text-xs)",
            fontWeight: 600,
            color: "var(--color-text-secondary)",
            marginBottom: 6,
          }}
        >
          Custom AI Prompt
        </div>
        <textarea
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="e.g. Add 2 real-world enterprise metrics..."
          rows={3}
          style={{
            width: "100%",
            background: "rgba(0,0,0,0.2)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            color: "var(--color-text-primary)",
            padding: "8px 10px",
            fontSize: "var(--text-xs)",
            marginBottom: 8,
            resize: "none",
            outline: "none",
          }}
        />
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handleAIAction("custom", (slide.bullets || []).join("\n"))}
          disabled={!customPrompt.trim() || !!loadingAction}
          style={{ width: "100%" }}
        >
          Run Prompt
        </Button>
      </div>
    </aside>
  );
}
