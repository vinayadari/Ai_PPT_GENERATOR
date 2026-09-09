"use client";

import { useEffect, useRef } from "react";

export default function Modal({ open, onClose, title, children, width = 520 }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!dialogRef.current) return;
    if (open) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }
  }, [open]);

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose?.();
      }}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        maxWidth: "100vw",
        maxHeight: "100vh",
        background: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        border: "none",
        padding: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: "var(--z-modal-backdrop)",
        animation: "fadeIn 0.2s ease-out",
      }}
    >
      <div
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-default)",
          borderRadius: "var(--radius-lg)",
          width: `min(${width}px, calc(100vw - 48px))`,
          maxHeight: "calc(100vh - 96px)",
          overflow: "auto",
          boxShadow: "var(--shadow-xl)",
          animation: "scaleIn 0.25s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "var(--space-5) var(--space-6)",
              borderBottom: "1px solid var(--border-subtle)",
            }}
          >
            <h3
              style={{
                fontSize: "var(--text-lg)",
                fontWeight: 700,
                fontFamily: "var(--font-heading)",
              }}
            >
              {title}
            </h3>
            <button
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "var(--radius-sm)",
                color: "var(--text-tertiary)",
                transition: "all var(--transition-fast)",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "var(--bg-elevated)";
                e.target.style.color = "var(--text-primary)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
                e.target.style.color = "var(--text-tertiary)";
              }}
            >
              ✕
            </button>
          </div>
        )}
        <div style={{ padding: "var(--space-6)" }}>{children}</div>
      </div>
    </dialog>
  );
}
