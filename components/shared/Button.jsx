"use client";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  iconRight,
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  type = "button",
  className = "",
  style = {},
  ...props
}) {
  const baseStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontWeight: 600,
    borderRadius: "var(--radius-md)",
    transition: "all var(--transition-fast)",
    cursor: disabled || loading ? "default" : "pointer",
    opacity: disabled ? 0.5 : 1,
    pointerEvents: disabled || loading ? "none" : "auto",
    width: fullWidth ? "100%" : "auto",
    position: "relative",
    overflow: "hidden",
    fontFamily: "var(--font-body)",
    letterSpacing: "-0.01em",
    whiteSpace: "nowrap",
    ...sizeStyles[size],
    ...variantStyles[variant],
    ...style,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={baseStyle}
      className={className}
      {...props}
    >
      {loading && <SpinnerIcon />}
      {!loading && icon && <span style={{ display: "flex", fontSize: "1.1em" }}>{icon}</span>}
      {children}
      {!loading && iconRight && <span style={{ display: "flex", fontSize: "1.1em" }}>{iconRight}</span>}
    </button>
  );
}

function SpinnerIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      style={{ animation: "spin 0.8s linear infinite" }}
    >
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="2" opacity="0.25" />
      <path
        d="M14.5 8a6.5 6.5 0 0 0-6.5-6.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

const sizeStyles = {
  sm: { padding: "6px 14px", fontSize: "var(--text-sm)" },
  md: { padding: "10px 20px", fontSize: "var(--text-base)" },
  lg: { padding: "14px 28px", fontSize: "var(--text-lg)" },
  xl: { padding: "16px 32px", fontSize: "var(--text-xl)" },
};

const variantStyles = {
  primary: {
    background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)",
    color: "#fff",
    boxShadow: "0 2px 12px rgba(124,92,252,0.3), inset 0 1px 0 rgba(255,255,255,0.15)",
  },
  secondary: {
    background: "var(--bg-elevated)",
    color: "var(--text-primary)",
    border: "1px solid var(--border-default)",
  },
  ghost: {
    background: "transparent",
    color: "var(--text-secondary)",
  },
  outline: {
    background: "transparent",
    color: "var(--accent-light)",
    border: "1px solid var(--border-accent)",
  },
  danger: {
    background: "rgba(239, 68, 68, 0.15)",
    color: "#f87171",
    border: "1px solid rgba(239, 68, 68, 0.3)",
  },
  white: {
    background: "#fff",
    color: "#0a0a0f",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
};
