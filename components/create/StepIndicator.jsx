"use client";

const STEPS = [
  { label: "Topic", icon: "💡" },
  { label: "Style", icon: "🎨" },
  { label: "Outline", icon: "📋" },
];

export default function StepIndicator({ currentStep = 0 }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
        marginBottom: "var(--space-10)",
      }}
    >
      {STEPS.map((step, i) => {
        const isActive = i === currentStep;
        const isCompleted = i < currentStep;
        const isLast = i === STEPS.length - 1;

        return (
          <div key={step.label} style={{ display: "flex", alignItems: "center" }}>
            {/* Step circle */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-3)",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  fontWeight: 700,
                  transition: "all var(--transition-base)",
                  background: isActive
                    ? "linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)"
                    : isCompleted
                    ? "var(--accent)"
                    : "var(--bg-elevated)",
                  color: isActive || isCompleted ? "#fff" : "var(--text-tertiary)",
                  border: isActive
                    ? "2px solid var(--accent-light)"
                    : isCompleted
                    ? "2px solid var(--accent)"
                    : "2px solid var(--border-default)",
                  boxShadow: isActive ? "var(--shadow-glow)" : "none",
                }}
              >
                {isCompleted ? "✓" : step.icon}
              </div>
              <span
                style={{
                  fontSize: "var(--text-sm)",
                  fontWeight: isActive ? 700 : 500,
                  color: isActive
                    ? "var(--text-primary)"
                    : isCompleted
                    ? "var(--accent-light)"
                    : "var(--text-tertiary)",
                  transition: "all var(--transition-base)",
                }}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {!isLast && (
              <div
                style={{
                  width: 60,
                  height: 2,
                  margin: "0 var(--space-3)",
                  borderRadius: 1,
                  background: isCompleted
                    ? "var(--accent)"
                    : "var(--border-default)",
                  transition: "all var(--transition-base)",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
