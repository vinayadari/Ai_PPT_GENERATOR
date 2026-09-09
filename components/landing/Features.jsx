"use client";

const FEATURES = [
  {
    icon: "⚡",
    title: "Instant Generation",
    description:
      "Describe your topic and get a complete presentation with titles, bullets, and speaker notes in seconds.",
    gradient: "linear-gradient(135deg, #7c5cfc 0%, #22d3ee 100%)",
  },
  {
    icon: "🎨",
    title: "Premium Templates",
    description:
      "Choose from 6 professionally designed themes with refined typography, colors, and decorative elements.",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
  },
  {
    icon: "✏️",
    title: "Inline Editing",
    description:
      "Click any text to edit directly on the slide. Add, remove, or reorder slides with ease.",
    gradient: "linear-gradient(135deg, #34d399 0%, #06b6d4 100%)",
  },
  {
    icon: "🤖",
    title: "AI Assistant",
    description:
      "Rewrite content, generate speaker notes, or expand ideas with the built-in AI panel.",
    gradient: "linear-gradient(135deg, #a78bfa 0%, #f472b6 100%)",
  },
  {
    icon: "📐",
    title: "Smart Layouts",
    description:
      "Six distinct slide layouts — title, content, two-column, section break, quote, and big number.",
    gradient: "linear-gradient(135deg, #22d3ee 0%, #34d399 100%)",
  },
  {
    icon: "📥",
    title: "Export Anywhere",
    description:
      "Download as PPTX for PowerPoint or PDF for sharing. One click, high-quality output.",
    gradient: "linear-gradient(135deg, #fb7185 0%, #f59e0b 100%)",
  },
];

export default function Features() {
  return (
    <section
      style={{
        padding: "var(--space-20) var(--space-8)",
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "var(--space-16)" }}>
        <h2
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(28px, 4vw, 44px)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            marginBottom: "var(--space-4)",
          }}
        >
          Everything you need
        </h2>
        <p
          style={{
            fontSize: "var(--text-lg)",
            color: "var(--text-secondary)",
            maxWidth: 480,
            margin: "0 auto",
          }}
        >
          From idea to polished presentation in a single workflow.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "var(--space-6)",
        }}
      >
        {FEATURES.map((f, i) => (
          <FeatureCard key={f.title} feature={f} index={i} />
        ))}
      </div>
    </section>
  );
}

function FeatureCard({ feature, index }) {
  return (
    <div
      className="animate-fade-in-up"
      style={{
        animationDelay: `${index * 0.08}s`,
        padding: "var(--space-8)",
        borderRadius: "var(--radius-lg)",
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-subtle)",
        transition: "all var(--transition-base)",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--border-default)";
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "var(--shadow-lg)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border-subtle)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "var(--radius-md)",
          background: feature.gradient,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          marginBottom: "var(--space-5)",
          boxShadow: `0 4px 16px ${feature.gradient.includes("#7c5cfc") ? "rgba(124,92,252,0.2)" : "rgba(0,0,0,0.15)"}`,
        }}
      >
        {feature.icon}
      </div>

      <h3
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "var(--text-xl)",
          fontWeight: 700,
          marginBottom: "var(--space-3)",
          letterSpacing: "-0.01em",
        }}
      >
        {feature.title}
      </h3>

      <p
        style={{
          fontSize: "var(--text-base)",
          color: "var(--text-secondary)",
          lineHeight: 1.6,
        }}
      >
        {feature.description}
      </p>
    </div>
  );
}
