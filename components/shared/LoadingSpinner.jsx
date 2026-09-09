"use client";

export default function LoadingSpinner({ size = 40, text = "", style = {} }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "var(--space-4)",
        ...style,
      }}
    >
      <div style={{ position: "relative", width: size, height: size }}>
        {/* Outer ring */}
        <svg
          width={size}
          height={size}
          viewBox="0 0 40 40"
          style={{
            animation: "spin 1.2s linear infinite",
            position: "absolute",
            inset: 0,
          }}
        >
          <circle
            cx="20"
            cy="20"
            r="17"
            fill="none"
            stroke="var(--border-default)"
            strokeWidth="3"
          />
          <circle
            cx="20"
            cy="20"
            r="17"
            fill="none"
            stroke="url(#spinnerGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="80 107"
          />
          <defs>
            <linearGradient id="spinnerGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--accent)" />
              <stop offset="100%" stopColor="var(--cyan)" />
            </linearGradient>
          </defs>
        </svg>
        {/* Inner glow dot */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: size * 0.2,
            height: size * 0.2,
            borderRadius: "50%",
            background: "var(--accent)",
            boxShadow: "0 0 12px var(--accent-glow)",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
      </div>
      {text && (
        <span
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--text-secondary)",
            fontWeight: 500,
            letterSpacing: "0.02em",
          }}
        >
          {text}
        </span>
      )}
    </div>
  );
}

/* Skeleton loading bar for content generation */
export function SkeletonLine({ width = "100%", height = 16, delay = 0 }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: "var(--radius-sm)",
        background:
          "linear-gradient(90deg, var(--bg-elevated) 25%, var(--bg-card-hover) 50%, var(--bg-elevated) 75%)",
        backgroundSize: "200% 100%",
        animation: `shimmer 2s infinite ${delay}s`,
      }}
    />
  );
}

export function SkeletonSlide() {
  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "16/9",
        borderRadius: "var(--radius-md)",
        background: "var(--bg-tertiary)",
        padding: "var(--space-8)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-4)",
        animation: "fadeIn 0.3s ease-out",
      }}
    >
      <SkeletonLine width="60%" height={24} />
      <div style={{ marginTop: "var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        <SkeletonLine width="90%" delay={0.1} />
        <SkeletonLine width="75%" delay={0.2} />
        <SkeletonLine width="85%" delay={0.3} />
        <SkeletonLine width="60%" delay={0.4} />
      </div>
    </div>
  );
}
