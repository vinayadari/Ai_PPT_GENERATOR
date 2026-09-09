"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: "var(--z-sticky)",
        padding: "0 var(--space-8)",
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "all var(--transition-base)",
        background: scrolled ? "var(--bg-glass)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled
          ? "1px solid var(--border-subtle)"
          : "1px solid transparent",
      }}
    >
      {/* Logo */}
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "var(--radius-sm)",
            background: "linear-gradient(135deg, var(--accent) 0%, var(--cyan) 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: 16,
            color: "#fff",
          }}
        >
          D
        </div>
        <span
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 700,
            fontSize: "var(--text-xl)",
            letterSpacing: "-0.02em",
          }}
        >
          Deck<span style={{ color: "var(--accent-light)" }}>AI</span>
        </span>
      </Link>

      {/* CTA */}
      <Link
        href="/create"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "9px 22px",
          borderRadius: "var(--radius-full)",
          background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)",
          color: "#fff",
          fontWeight: 600,
          fontSize: "var(--text-sm)",
          boxShadow: "0 2px 12px rgba(124,92,252,0.3)",
          transition: "all var(--transition-fast)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow =
            "0 4px 20px rgba(124,92,252,0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow =
            "0 2px 12px rgba(124,92,252,0.3)";
        }}
      >
        Create Presentation
        <span style={{ fontSize: 16 }}>→</span>
      </Link>
    </nav>
  );
}
