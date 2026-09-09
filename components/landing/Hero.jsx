"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const EXAMPLE_PROMPTS = [
  "AI trends in 2025 for tech investors",
  "Introduction to Machine Learning",
  "Quarterly sales review for the board",
  "Why remote work is the future",
  "Startup pitch deck for a fintech app",
];

export default function Hero() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);

  // Typewriter effect for placeholder
  useEffect(() => {
    const target = EXAMPLE_PROMPTS[placeholderIdx];
    let charIndex = 0;
    let timeout;

    if (typing) {
      const typeChar = () => {
        if (charIndex <= target.length) {
          setDisplayed(target.slice(0, charIndex));
          charIndex++;
          timeout = setTimeout(typeChar, 50 + Math.random() * 30);
        } else {
          timeout = setTimeout(() => setTyping(false), 2000);
        }
      };
      typeChar();
    } else {
      // Erase
      let eraseIndex = target.length;
      const eraseChar = () => {
        if (eraseIndex >= 0) {
          setDisplayed(target.slice(0, eraseIndex));
          eraseIndex--;
          timeout = setTimeout(eraseChar, 25);
        } else {
          setPlaceholderIdx((prev) => (prev + 1) % EXAMPLE_PROMPTS.length);
          setTyping(true);
        }
      };
      eraseChar();
    }

    return () => clearTimeout(timeout);
  }, [placeholderIdx, typing]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!prompt.trim()) return;
    router.push(`/create?topic=${encodeURIComponent(prompt.trim())}`);
  }

  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "120px var(--space-8) var(--space-16)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow effects */}
      <div
        style={{
          position: "absolute",
          top: "-20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(124,92,252,0.12) 0%, rgba(34,211,238,0.05) 40%, transparent 70%)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-10%",
          right: "-10%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 60%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      {/* Badge */}
      <div
        className="animate-fade-in-down"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 16px",
          borderRadius: "var(--radius-full)",
          background: "var(--accent-subtle)",
          border: "1px solid var(--border-accent)",
          fontSize: "var(--text-sm)",
          color: "var(--accent-light)",
          fontWeight: 500,
          marginBottom: "var(--space-8)",
        }}
      >
        <span style={{ fontSize: 14 }}>✦</span>
        Powered by AI
      </div>

      {/* Heading */}
      <h1
        className="animate-fade-in-up"
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "clamp(36px, 6vw, 72px)",
          fontWeight: 800,
          lineHeight: 1.08,
          textAlign: "center",
          maxWidth: 800,
          letterSpacing: "-0.03em",
          marginBottom: "var(--space-6)",
        }}
      >
        Beautiful presentations,{" "}
        <span
          style={{
            background:
              "linear-gradient(135deg, var(--accent-light) 0%, var(--cyan) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          made by AI
        </span>
      </h1>

      {/* Subtitle */}
      <p
        className="animate-fade-in-up stagger-2"
        style={{
          fontSize: "clamp(16px, 2vw, 20px)",
          color: "var(--text-secondary)",
          textAlign: "center",
          maxWidth: 560,
          lineHeight: 1.6,
          marginBottom: "var(--space-10)",
        }}
      >
        Just describe your topic. DeckAI generates a professionally designed,
        fully editable presentation in seconds.
      </p>

      {/* Prompt input */}
      <form
        onSubmit={handleSubmit}
        className="animate-fade-in-up stagger-4"
        style={{
          width: "100%",
          maxWidth: 620,
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-default)",
            borderRadius: "var(--radius-lg)",
            padding: "6px 6px 6px 20px",
            boxShadow: "var(--shadow-lg), var(--shadow-glow)",
            transition: "all var(--transition-base)",
          }}
        >
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={displayed || "Enter your topic..."}
            style={{
              flex: 1,
              padding: "14px 0",
              fontSize: "var(--text-lg)",
              color: "var(--text-primary)",
              background: "transparent",
              border: "none",
              outline: "none",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "12px 24px",
              borderRadius: "var(--radius-md)",
              background:
                "linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "var(--text-base)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "all var(--transition-fast)",
              boxShadow: "0 2px 8px rgba(124,92,252,0.3)",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow =
                "0 4px 16px rgba(124,92,252,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 2px 8px rgba(124,92,252,0.3)";
            }}
          >
            Generate
            <span style={{ fontSize: 18 }}>→</span>
          </button>
        </div>
      </form>

      {/* Quick prompts */}
      <div
        className="animate-fade-in-up stagger-6"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--space-2)",
          justifyContent: "center",
          marginTop: "var(--space-6)",
          maxWidth: 620,
        }}
      >
        {["Machine Learning 101", "Startup Pitch Deck", "Quarterly Review"].map(
          (q) => (
            <button
              key={q}
              onClick={() => {
                setPrompt(q);
                router.push(`/create?topic=${encodeURIComponent(q)}`);
              }}
              style={{
                padding: "6px 14px",
                borderRadius: "var(--radius-full)",
                fontSize: "var(--text-sm)",
                color: "var(--text-tertiary)",
                border: "1px solid var(--border-subtle)",
                background: "var(--bg-card)",
                cursor: "pointer",
                transition: "all var(--transition-fast)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--border-accent)";
                e.currentTarget.style.color = "var(--accent-light)";
                e.currentTarget.style.background = "var(--accent-subtle)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-subtle)";
                e.currentTarget.style.color = "var(--text-tertiary)";
                e.currentTarget.style.background = "var(--bg-card)";
              }}
            >
              {q}
            </button>
          )
        )}
      </div>
    </section>
  );
}
