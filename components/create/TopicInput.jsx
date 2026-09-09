"use client";

import Button from "../shared/Button";

export default function TopicInput({
  topic,
  setTopic,
  audience,
  setAudience,
  slideCount,
  setSlideCount,
  onNext,
}) {
  return (
    <div
      className="animate-fade-in-up"
      style={{
        maxWidth: 600,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "var(--space-4)" }}>
        <h2
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "var(--text-3xl)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            marginBottom: "var(--space-2)",
          }}
        >
          What's your presentation about?
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-base)" }}>
          Describe your topic and we'll create a structured presentation for you.
        </p>
      </div>

      {/* Topic textarea */}
      <FieldGroup label="Topic *">
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. The future of artificial intelligence in healthcare, covering diagnosis, drug discovery, and ethical considerations"
          rows={4}
          required
          style={inputStyle}
        />
      </FieldGroup>

      {/* Audience */}
      <FieldGroup label="Target audience">
        <input
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          placeholder="e.g. medical professionals, investors, students"
          style={inputStyle}
        />
      </FieldGroup>

      {/* Slide count */}
      <FieldGroup label={`Number of slides: ${slideCount}`}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
          <span style={{ color: "var(--text-tertiary)", fontSize: "var(--text-sm)" }}>3</span>
          <input
            type="range"
            min={3}
            max={15}
            value={slideCount}
            onChange={(e) => setSlideCount(Number(e.target.value))}
            style={{
              flex: 1,
              height: 6,
              borderRadius: 3,
              appearance: "none",
              background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${((slideCount - 3) / 12) * 100}%, var(--bg-elevated) ${((slideCount - 3) / 12) * 100}%, var(--bg-elevated) 100%)`,
              cursor: "pointer",
              outline: "none",
            }}
          />
          <span style={{ color: "var(--text-tertiary)", fontSize: "var(--text-sm)" }}>15</span>
        </div>
      </FieldGroup>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        onClick={onNext}
        disabled={!topic.trim()}
        iconRight={<span>→</span>}
        style={{ marginTop: "var(--space-4)" }}
      >
        Choose Style
      </Button>
    </div>
  );
}

function FieldGroup({ label, children }) {
  return (
    <label
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-2)",
      }}
    >
      <span
        style={{
          fontSize: "var(--text-sm)",
          fontWeight: 600,
          color: "var(--text-secondary)",
        }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "var(--radius-md)",
  border: "1px solid var(--border-default)",
  background: "var(--bg-secondary)",
  color: "var(--text-primary)",
  fontSize: "var(--text-base)",
  resize: "vertical",
  transition: "all var(--transition-fast)",
  outline: "none",
};
