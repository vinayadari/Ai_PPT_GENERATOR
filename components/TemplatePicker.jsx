"use client";

import { TEMPLATE_LIST } from "../lib/templates";

export default function TemplatePicker({ selectedId, onSelect }) {
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      {TEMPLATE_LIST.map((t) => (
        <button
          key={t.id}
          onClick={() => onSelect(t.id)}
          style={{
            width: 96,
            height: 60,
            borderRadius: 8,
            border:
              selectedId === t.id ? "3px solid #38BDF8" : "2px solid #E5E7EB",
            background: t.cssBg,
            cursor: "pointer",
            position: "relative",
            padding: 0,
          }}
          title={t.name}
        >
          <span
            style={{
              position: "absolute",
              bottom: 4,
              left: 6,
              fontSize: 10,
              color: t.cssText,
              fontWeight: 600,
              textShadow: "0 1px 2px rgba(0,0,0,0.4)",
            }}
          >
            {t.name}
          </span>
        </button>
      ))}
    </div>
  );
}
