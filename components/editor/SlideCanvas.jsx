"use client";

import { useState } from "react";
import { LAYOUT_LIST, getLayout } from "../../lib/layouts";
import { getFontPreset } from "../../lib/fonts";
import { getIconComponent } from "../../lib/icons";

export default function SlideCanvas({
  slide,
  template,
  fontPreset,
  onUpdateSlide,
  onAddItem,
  onDeleteItem,
  onMoveItem,
  onUpdateItem,
  onSetContentMode,
  onOpenImagePicker,
  editable = true,
}) {
  const [showNotes, setShowNotes] = useState(false);

  if (!slide) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          color: "var(--color-text-muted, #94a3b8)",
        }}
      >
        No slide selected.
      </div>
    );
  }

  const resolvedFont = fontPreset || {
    headingFont: template?.headingFont || "Outfit",
    bodyFont: template?.font || "Inter",
  };

  const layout = slide.layout || "content";
  const layoutDef = getLayout(layout);
  const contentMode = slide.contentMode || "cards";
  const items = Array.isArray(slide.items) && slide.items.length > 0
    ? slide.items
    : (slide.bullets || []).map((b, i) => ({ id: `it-${i}`, title: "", text: b }));

  // ─── Inline edit handlers ───
  function handleTitleChange(newTitle) {
    if (onUpdateSlide) onUpdateSlide({ title: newTitle });
  }

  function handleSubtitleChange(newSubtitle) {
    if (onUpdateSlide) onUpdateSlide({ subtitle: newSubtitle });
  }

  function handleQuoteChange(quote) {
    if (onUpdateSlide) onUpdateSlide({ quote });
  }

  function handleAuthorChange(author) {
    if (onUpdateSlide) onUpdateSlide({ author });
  }

  function handleBigNumberChange(bigNumber) {
    if (onUpdateSlide) onUpdateSlide({ bigNumber });
  }

  function handleNotesChange(notes) {
    if (onUpdateSlide) onUpdateSlide({ notes });
  }

  function handleSwitchLayout(newLayout) {
    if (onUpdateSlide) onUpdateSlide({ layout: newLayout });
  }

  function handleItemTextChange(idx, text) {
    if (onUpdateItem) {
      onUpdateItem(idx, { text });
    } else if (onUpdateSlide) {
      const updated = [...items];
      updated[idx] = { ...updated[idx], text };
      onUpdateSlide({
        items: updated,
        bullets: updated.map((it) => (it.title ? `${it.title}: ${it.text}` : it.text)),
      });
    }
  }

  function handleItemTitleChange(idx, title) {
    if (onUpdateItem) {
      onUpdateItem(idx, { title });
    } else if (onUpdateSlide) {
      const updated = [...items];
      updated[idx] = { ...updated[idx], title };
      onUpdateSlide({
        items: updated,
        bullets: updated.map((it) => (it.title ? `${it.title}: ${it.text}` : it.text)),
      });
    }
  }

  function handleAddNewItem() {
    if (onAddItem) {
      onAddItem({ id: `item-${Date.now()}`, title: "", text: "New takeaway point" });
    } else if (onUpdateSlide) {
      const updated = [...items, { id: `item-${Date.now()}`, title: "", text: "New takeaway point" }];
      onUpdateSlide({
        items: updated,
        bullets: updated.map((it) => (it.title ? `${it.title}: ${it.text}` : it.text)),
      });
    }
  }

  function handleRemoveItem(idx) {
    if (onDeleteItem) {
      onDeleteItem(idx);
    } else if (onUpdateSlide) {
      const updated = items.filter((_, i) => i !== idx);
      onUpdateSlide({
        items: updated,
        bullets: updated.map((it) => (it.title ? `${it.title}: ${it.text}` : it.text)),
      });
    }
  }

  function handleMove(idx, dir) {
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= items.length) return;
    if (onMoveItem) {
      onMoveItem(idx, targetIdx);
    } else if (onUpdateSlide) {
      const updated = [...items];
      const [moved] = updated.splice(idx, 1);
      updated.splice(targetIdx, 0, moved);
      onUpdateSlide({
        items: updated,
        bullets: updated.map((it) => (it.title ? `${it.title}: ${it.text}` : it.text)),
      });
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "var(--space-4, 16px)",
        width: "100%",
        padding: "var(--space-6, 24px)",
        overflowY: "auto",
      }}
    >
      {/* Top Controls Bar: Layout selector + Content Mode switcher (when supported) */}
      {editable && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            width: "100%",
            maxWidth: 960,
          }}
        >
          {/* Layout switcher pills */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              background: "var(--color-bg-secondary, #111118)",
              padding: "4px 8px",
              borderRadius: "var(--radius-full, 9999px)",
              border: "1px solid var(--color-border, rgba(255,255,255,0.1))",
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
              overflowX: "auto",
              maxWidth: "100%",
            }}
          >
            <span
              style={{
                fontSize: 10,
                color: "var(--color-text-muted, #94a3b8)",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginRight: 4,
              }}
            >
              Layout:
            </span>
            {LAYOUT_LIST.map((l) => (
              <button
                key={l.id}
                onClick={() => handleSwitchLayout(l.id)}
                title={l.description}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "4px 8px",
                  borderRadius: "var(--radius-full, 9999px)",
                  fontSize: 11,
                  fontWeight: 500,
                  border: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  background: layout === l.id ? "var(--color-accent, #7c5cfc)" : "transparent",
                  color: layout === l.id ? "#ffffff" : "var(--color-text-secondary, #9d9db5)",
                  transition: "all 0.15s ease",
                }}
              >
                <span>{l.icon}</span>
                <span>{l.name}</span>
              </button>
            ))}
          </div>

          {/* Content Mode switcher (Bullets / Cards / Steps / Checklist) */}
          {layoutDef.supportsContentMode && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                background: "var(--color-bg-secondary, #111118)",
                padding: "4px 8px",
                borderRadius: "var(--radius-full, 9999px)",
                border: "1px solid var(--color-border, rgba(255,255,255,0.1))",
                boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  color: "var(--color-text-muted, #94a3b8)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginRight: 4,
                }}
              >
                Format:
              </span>
              {[
                { id: "bullets", label: "Bullets", icon: "☰" },
                { id: "cards", label: "Cards", icon: "▦" },
                { id: "steps", label: "Steps", icon: "🔢" },
                { id: "checklist", label: "Checklist", icon: "☑" },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    if (onSetContentMode) onSetContentMode(m.id);
                    else if (onUpdateSlide) onUpdateSlide({ contentMode: m.id });
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "4px 8px",
                    borderRadius: "var(--radius-full, 9999px)",
                    fontSize: 11,
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                    background: contentMode === m.id ? "rgba(255,255,255,0.15)" : "transparent",
                    color: contentMode === m.id ? template.cssAccent : "var(--color-text-secondary, #9d9db5)",
                    transition: "all 0.15s ease",
                  }}
                >
                  <span>{m.icon}</span>
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── MAIN SLIDE CANVAS CONTAINER (16:9 ratio, 960x540) ─── */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 960,
          aspectRatio: "16 / 9",
          background: template.cssBg,
          color: template.cssText,
          fontFamily: `${resolvedFont.bodyFont}, sans-serif`,
          borderRadius: "var(--radius-xl, 20px)",
          boxShadow: "0 25px 50px -15px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          padding: layout === "title" || layout === "section" ? "0 80px" : "44px 56px",
          justifyContent:
            layout === "title" || layout === "section" || layout === "quote"
              ? "center"
              : "flex-start",
          boxSizing: "border-box",
        }}
      >
        {/* Accent Edge Bar */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 8,
            background: template.cssAccent,
            zIndex: 10,
          }}
        />

        {/* Decorative corner glows */}
        <div
          style={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 220,
            height: 220,
            borderRadius: "50%",
            background: template.cssAccent,
            opacity: 0.08,
            filter: "blur(45px)",
            pointerEvents: "none",
          }}
        />

        {/* ─── 1. TITLE LAYOUT ─── */}
        {layout === "title" && (
          <div style={{ position: "relative", zIndex: 1 }}>

            <div
              contentEditable={editable}
              suppressContentEditableWarning
              onBlur={(e) => handleTitleChange(e.currentTarget.innerText)}
              style={{
                fontFamily: `${resolvedFont.headingFont}, sans-serif`,
                fontSize: 48,
                fontWeight: 800,
                lineHeight: 1.15,
                marginBottom: 16,
                outline: "none",
                cursor: editable ? "text" : "default",
              }}
            >
              {slide.title}
            </div>

            <div
              contentEditable={editable}
              suppressContentEditableWarning
              onBlur={(e) => handleSubtitleChange(e.currentTarget.innerText)}
              style={{
                fontSize: 20,
                color: template.cssSubText,
                fontWeight: 400,
                lineHeight: 1.45,
                outline: "none",
                maxWidth: 720,
                cursor: editable ? "text" : "default",
              }}
            >
              {slide.subtitle || (items[0]?.text) || "Click to add a compelling subtitle or presentation hook"}
            </div>
          </div>
        )}

        {/* ─── 2. SECTION BREAK LAYOUT ─── */}
        {layout === "section" && (
          <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: template.cssAccent,
                marginBottom: 16,
              }}
            >
              ◆ PART BREAK ◆
            </div>

            <div
              contentEditable={editable}
              suppressContentEditableWarning
              onBlur={(e) => handleTitleChange(e.currentTarget.innerText)}
              style={{
                fontFamily: `${resolvedFont.headingFont}, sans-serif`,
                fontSize: 50,
                fontWeight: 800,
                lineHeight: 1.15,
                outline: "none",
                cursor: editable ? "text" : "default",
                marginBottom: 16,
              }}
            >
              {slide.title}
            </div>

            <div
              contentEditable={editable}
              suppressContentEditableWarning
              onBlur={(e) => handleSubtitleChange(e.currentTarget.innerText)}
              style={{
                fontSize: 18,
                color: template.cssSubText,
                outline: "none",
                maxWidth: 620,
                margin: "0 auto",
                cursor: editable ? "text" : "default",
              }}
            >
              {slide.subtitle || "Section overview, transition, and key strategic takeaways"}
            </div>
          </div>
        )}

        {/* ─── 3. QUOTE LAYOUT ─── */}
        {layout === "quote" && (
          <div style={{ textAlign: "center", position: "relative", zIndex: 1, padding: "0 30px" }}>
            <div
              style={{
                fontSize: 72,
                lineHeight: 1,
                color: template.cssAccent,
                fontFamily: "Georgia, serif",
                marginBottom: -12,
                opacity: 0.8,
              }}
            >
              “
            </div>

            <div
              contentEditable={editable}
              suppressContentEditableWarning
              onBlur={(e) => handleQuoteChange(e.currentTarget.innerText)}
              style={{
                fontFamily: `${resolvedFont.headingFont}, sans-serif`,
                fontSize: 30,
                fontStyle: "italic",
                fontWeight: 500,
                lineHeight: 1.35,
                marginBottom: 20,
                outline: "none",
                cursor: editable ? "text" : "default",
              }}
            >
              {slide.quote || slide.title}
            </div>

            <div
              contentEditable={editable}
              suppressContentEditableWarning
              onBlur={(e) => handleAuthorChange(e.currentTarget.innerText)}
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: template.cssAccent,
                letterSpacing: "0.06em",
                outline: "none",
                cursor: editable ? "text" : "default",
              }}
            >
              — {slide.author || "Author / Key Contributor"}
            </div>
          </div>
        )}

        {/* ─── 4. BIG NUMBER LAYOUT ─── */}
        {layout === "bigNumber" && (
          <div style={{ display: "flex", flexDirection: "column", height: "100%", zIndex: 1 }}>
            <SlideHeading
              title={slide.title}
              headingFont={resolvedFont.headingFont}
              editable={editable}
              onTitleChange={handleTitleChange}
            />

            <div style={{ display: "flex", alignItems: "center", gap: 36, flex: 1 }}>
              <div
                style={{
                  background: template.cssCardBg,
                  border: `1px solid ${template.cssAccent}33`,
                  borderRadius: "var(--radius-lg, 16px)",
                  padding: "28px 36px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: 240,
                }}
              >
                <div
                  contentEditable={editable}
                  suppressContentEditableWarning
                  onBlur={(e) => handleBigNumberChange(e.currentTarget.innerText)}
                  style={{
                    fontFamily: `${resolvedFont.headingFont}, sans-serif`,
                    fontSize: 72,
                    fontWeight: 900,
                    color: template.cssAccent,
                    lineHeight: 1,
                    outline: "none",
                    cursor: editable ? "text" : "default",
                  }}
                >
                  {slide.bigNumber || "99%"}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: template.cssSubText,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginTop: 8,
                    fontWeight: 700,
                  }}
                >
                  {slide.bigNumberLabel || "Key Metric"}
                </div>
              </div>

              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                {renderItemsList({
                  items,
                  contentMode,
                  template,
                  editable,
                  onItemTextChange: handleItemTextChange,
                  onItemTitleChange: handleItemTitleChange,
                  onRemoveItem: handleRemoveItem,
                  onMove: handleMove,
                })}

                {editable && (
                  <AddPointButton
                    onClick={handleAddNewItem}
                    subText={template.cssSubText}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* ─── 5. CONTENT (1 COLUMN) ─── */}
        {layout === "content" && (
          <div style={{ display: "flex", flexDirection: "column", height: "100%", zIndex: 1 }}>
            <SlideHeading
              title={slide.title}
              headingFont={resolvedFont.headingFont}
              editable={editable}
              onTitleChange={handleTitleChange}
            />

            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
              {renderItemsList({
                items,
                contentMode,
                template,
                editable,
                onItemTextChange: handleItemTextChange,
                onItemTitleChange: handleItemTitleChange,
                onRemoveItem: handleRemoveItem,
                onMove: handleMove,
              })}

              {editable && (
                <AddPointButton
                  onClick={handleAddNewItem}
                  subText={template.cssSubText}
                />
              )}
            </div>
          </div>
        )}

        {/* ─── 6. TWO COLUMN LAYOUT ─── */}
        {layout === "twoColumn" && (
          <div style={{ display: "flex", flexDirection: "column", height: "100%", zIndex: 1 }}>
            <SlideHeading
              title={slide.title}
              headingFont={resolvedFont.headingFont}
              editable={editable}
              onTitleChange={handleTitleChange}
            />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, flex: 1 }}>
              {/* Left Column */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {renderItemsList({
                  items: items.slice(0, Math.ceil(items.length / 2)),
                  contentMode,
                  template,
                  editable,
                  offset: 0,
                  onItemTextChange: handleItemTextChange,
                  onItemTitleChange: handleItemTitleChange,
                  onRemoveItem: handleRemoveItem,
                  onMove: handleMove,
                })}
              </div>

              {/* Right Column */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {renderItemsList({
                  items: items.slice(Math.ceil(items.length / 2)),
                  contentMode,
                  template,
                  editable,
                  offset: Math.ceil(items.length / 2),
                  onItemTextChange: handleItemTextChange,
                  onItemTitleChange: handleItemTitleChange,
                  onRemoveItem: handleRemoveItem,
                  onMove: handleMove,
                })}
              </div>
            </div>

            {editable && (
              <div style={{ marginTop: 8 }}>
                <AddPointButton
                  onClick={handleAddNewItem}
                  subText={template.cssSubText}
                />
              </div>
            )}
          </div>
        )}

        {/* ─── 7. THREE COLUMN LAYOUT ─── */}
        {layout === "threeColumn" && (
          <div style={{ display: "flex", flexDirection: "column", height: "100%", zIndex: 1 }}>
            <SlideHeading
              title={slide.title}
              headingFont={resolvedFont.headingFont}
              editable={editable}
              onTitleChange={handleTitleChange}
            />

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, flex: 1 }}>
              {items.slice(0, 3).map((item, idx) => {
                const ItemIcon = item.icon ? getIconComponent(item.icon) : null;
                return (
                <div
                  key={item.id || idx}
                  style={{
                    background: template.cssCardBg,
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "var(--radius-lg, 16px)",
                    padding: "20px 18px",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "8px",
                      background: `rgba(255,255,255,0.06)`,
                      border: `1px solid ${template.cssAccent}44`,
                      color: template.cssAccent,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 800,
                      marginBottom: 12,
                    }}
                  >
                    {ItemIcon ? <ItemIcon size={15} strokeWidth={2.25} /> : `0${idx + 1}`}
                  </div>

                  <div
                    contentEditable={editable}
                    suppressContentEditableWarning
                    onBlur={(e) => handleItemTitleChange(idx, e.currentTarget.innerText)}
                    placeholder="Card Title..."
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: template.cssText,
                      marginBottom: 6,
                      outline: "none",
                    }}
                  >
                    {item.title || `Feature ${idx + 1}`}
                  </div>

                  <div
                    contentEditable={editable}
                    suppressContentEditableWarning
                    onBlur={(e) => handleItemTextChange(idx, e.currentTarget.innerText)}
                    style={{
                      fontSize: 13,
                      lineHeight: 1.45,
                      color: template.cssSubText,
                      outline: "none",
                      flex: 1,
                    }}
                  >
                    {item.text || "Key descriptive details highlighting value"}
                  </div>

                  {editable && (
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                      <button
                        onClick={() => handleRemoveItem(idx)}
                        style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: 11 }}
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
                );
              })}
            </div>

            {editable && items.length < 3 && (
              <div style={{ marginTop: 10 }}>
                <AddPointButton
                  onClick={handleAddNewItem}
                  subText={template.cssSubText}
                />
              </div>
            )}
          </div>
        )}

        {/* ─── 8. TIMELINE LAYOUT ─── */}
        {layout === "timeline" && (
          <div style={{ display: "flex", flexDirection: "column", height: "100%", zIndex: 1 }}>
            <SlideHeading
              title={slide.title}
              headingFont={resolvedFont.headingFont}
              editable={editable}
              onTitleChange={handleTitleChange}
            />

            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                position: "relative",
                padding: "20px 0",
              }}
            >
              {/* Connecting line */}
              <div
                style={{
                  position: "absolute",
                  left: 30,
                  right: 30,
                  top: "34%",
                  height: 3,
                  background: `linear-gradient(90deg, ${template.cssAccent} 0%, rgba(255,255,255,0.1) 100%)`,
                  zIndex: 0,
                }}
              />

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${Math.min(items.length, 4)}, 1fr)`,
                  gap: 16,
                  width: "100%",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {items.slice(0, 4).map((item, idx) => (
                  <div
                    key={item.id || idx}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    {/* Node Circle */}
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: "50%",
                        background: template.cssBg,
                        border: `3px solid ${template.cssAccent}`,
                        color: template.cssAccent,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 13,
                        fontWeight: 800,
                        marginBottom: 14,
                        boxShadow: `0 0 14px ${template.cssAccent}44`,
                      }}
                    >
                      {idx + 1}
                    </div>

                    <div
                      contentEditable={editable}
                      suppressContentEditableWarning
                      onBlur={(e) => handleItemTitleChange(idx, e.currentTarget.innerText)}
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: template.cssText,
                        marginBottom: 4,
                        outline: "none",
                      }}
                    >
                      {item.title || `Phase 0${idx + 1}`}
                    </div>

                    <div
                      contentEditable={editable}
                      suppressContentEditableWarning
                      onBlur={(e) => handleItemTextChange(idx, e.currentTarget.innerText)}
                      style={{
                        fontSize: 12,
                        lineHeight: 1.4,
                        color: template.cssSubText,
                        outline: "none",
                        maxWidth: 180,
                      }}
                    >
                      {item.text || "Milestone deliverable goal"}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {editable && items.length < 4 && (
              <AddPointButton
                onClick={handleAddNewItem}
                subText={template.cssSubText}
              />
            )}
          </div>
        )}

        {/* ─── 9. COMPARISON LAYOUT ─── */}
        {layout === "comparison" && (
          <div style={{ display: "flex", flexDirection: "column", height: "100%", zIndex: 1 }}>
            <SlideHeading
              title={slide.title}
              headingFont={resolvedFont.headingFont}
              editable={editable}
              onTitleChange={handleTitleChange}
            />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, flex: 1 }}>
              {/* Option A / Before Card */}
              <div
                style={{
                  background: template.cssCardBg,
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "var(--radius-lg, 16px)",
                  padding: "20px 24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    alignSelf: "flex-start",
                    padding: "3px 10px",
                    borderRadius: "6px",
                    background: "rgba(239, 68, 68, 0.15)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    color: "#f87171",
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  Option A • Traditional / Before
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                  {items.slice(0, Math.ceil(items.length / 2)).map((it, idx) => (
                    <div key={idx} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <span style={{ color: "#f87171", fontSize: 13, marginTop: 1 }}>✕</span>
                      <span
                        contentEditable={editable}
                        suppressContentEditableWarning
                        onBlur={(e) => handleItemTextChange(idx, e.currentTarget.innerText)}
                        style={{ fontSize: 14, color: template.cssSubText, outline: "none", flex: 1 }}
                      >
                        {it.text || "Drawback or limitation of existing system"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Option B / After Card */}
              <div
                style={{
                  background: template.cssCardBg,
                  border: `1px solid ${template.cssAccent}44`,
                  borderRadius: "var(--radius-lg, 16px)",
                  padding: "20px 24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  boxShadow: `0 8px 24px ${template.cssAccent}11`,
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    alignSelf: "flex-start",
                    padding: "3px 10px",
                    borderRadius: "6px",
                    background: "rgba(34, 197, 94, 0.15)",
                    border: "1px solid rgba(34, 197, 94, 0.3)",
                    color: "#4ade80",
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  Option B • DeckAI / After
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                  {items.slice(Math.ceil(items.length / 2)).map((it, idx) => {
                    const actualIdx = idx + Math.ceil(items.length / 2);
                    return (
                      <div key={actualIdx} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <span style={{ color: "#4ade80", fontSize: 13, marginTop: 1 }}>✓</span>
                        <span
                          contentEditable={editable}
                          suppressContentEditableWarning
                          onBlur={(e) => handleItemTextChange(actualIdx, e.currentTarget.innerText)}
                          style={{ fontSize: 14, color: template.cssText, outline: "none", flex: 1 }}
                        >
                          {it.text || "Advantage and competitive edge delivered"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── 10. METRICS GRID LAYOUT ─── */}
        {layout === "metricsGrid" && (
          <div style={{ display: "flex", flexDirection: "column", height: "100%", zIndex: 1 }}>
            <SlideHeading
              title={slide.title}
              headingFont={resolvedFont.headingFont}
              editable={editable}
              onTitleChange={handleTitleChange}
            />

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, flex: 1, alignItems: "center" }}>
              {(slide.metrics || [
                { value: "99.4%", label: "System Accuracy", change: "+14% MoM" },
                { value: "4.8x", label: "Delivery Speed", change: "Verified" },
                { value: "$1.2M", label: "Cost Savings", change: "Annualized" },
              ]).map((metric, i) => (
                <div
                  key={i}
                  style={{
                    background: template.cssCardBg,
                    border: `1px solid rgba(255,255,255,0.08)`,
                    borderRadius: "var(--radius-lg, 16px)",
                    padding: "24px 20px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <div
                    contentEditable={editable}
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      const updated = [...(slide.metrics || [])];
                      updated[i] = { ...updated[i], value: e.currentTarget.innerText };
                      onUpdateSlide({ metrics: updated });
                    }}
                    style={{
                      fontFamily: `${resolvedFont.headingFont}, sans-serif`,
                      fontSize: 44,
                      fontWeight: 800,
                      color: template.cssAccent,
                      lineHeight: 1,
                      marginBottom: 8,
                      outline: "none",
                    }}
                  >
                    {metric.value}
                  </div>

                  <div
                    contentEditable={editable}
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      const updated = [...(slide.metrics || [])];
                      updated[i] = { ...updated[i], label: e.currentTarget.innerText };
                      onUpdateSlide({ metrics: updated });
                    }}
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: template.cssText,
                      marginBottom: 4,
                      outline: "none",
                    }}
                  >
                    {metric.label}
                  </div>

                  <div
                    style={{
                      fontSize: 11,
                      color: template.cssSubText,
                      background: "rgba(255,255,255,0.06)",
                      padding: "2px 8px",
                      borderRadius: "var(--radius-full, 9999px)",
                      marginTop: 4,
                    }}
                  >
                    {metric.change || "Performance Delta"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── 11. SPLIT IMAGE LEFT ─── */}
        {layout === "splitImageLeft" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 32, height: "100%", zIndex: 1 }}>
            {/* Image on the left */}
            <div style={{ position: "relative", height: "100%", minHeight: 280 }}>
              <SlideImageSlot
                imageUrl={slide.image || slide.images?.[0]?.url}
                fit={slide.imageFit || "cover"}
                overlay={slide.imageOverlay || false}
                template={template}
                editable={editable}
                onOpenImagePicker={onOpenImagePicker}
              />
            </div>

            {/* Content on the right */}
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <SlideHeading
                title={slide.title}
                headingFont={resolvedFont.headingFont}
                editable={editable}
                onTitleChange={handleTitleChange}
              />

              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                {renderItemsList({
                  items,
                  contentMode,
                  template,
                  editable,
                  onItemTextChange: handleItemTextChange,
                  onItemTitleChange: handleItemTitleChange,
                  onRemoveItem: handleRemoveItem,
                  onMove: handleMove,
                })}

                {editable && (
                  <AddPointButton
                    onClick={handleAddNewItem}
                    subText={template.cssSubText}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* ─── 12. SPLIT IMAGE RIGHT ─── */}
        {layout === "splitImageRight" && (
          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 32, height: "100%", zIndex: 1 }}>
            {/* Content on the left */}
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <SlideHeading
                title={slide.title}
                headingFont={resolvedFont.headingFont}
                editable={editable}
                onTitleChange={handleTitleChange}
              />

              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                {renderItemsList({
                  items,
                  contentMode,
                  template,
                  editable,
                  onItemTextChange: handleItemTextChange,
                  onItemTitleChange: handleItemTitleChange,
                  onRemoveItem: handleRemoveItem,
                  onMove: handleMove,
                })}

                {editable && (
                  <AddPointButton
                    onClick={handleAddNewItem}
                    subText={template.cssSubText}
                  />
                )}
              </div>
            </div>

            {/* Image on the right */}
            <div style={{ position: "relative", height: "100%", minHeight: 280 }}>
              <SlideImageSlot
                imageUrl={slide.image || slide.images?.[0]?.url}
                fit={slide.imageFit || "cover"}
                overlay={slide.imageOverlay || false}
                template={template}
                editable={editable}
                onOpenImagePicker={onOpenImagePicker}
              />
            </div>
          </div>
        )}

        {/* ─── 13. IMAGE GALLERY LAYOUT ─── */}
        {layout === "imageGallery" && (
          <div style={{ display: "flex", flexDirection: "column", height: "100%", zIndex: 1 }}>
            <SlideHeading
              title={slide.title}
              headingFont={resolvedFont.headingFont}
              editable={editable}
              onTitleChange={handleTitleChange}
            />

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, flex: 1 }}>
              {[0, 1, 2].map((slotIdx) => {
                const img = slide.images?.[slotIdx] || (slotIdx === 0 && slide.image ? { url: slide.image } : null);
                return (
                  <div
                    key={slotIdx}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      background: template.cssCardBg,
                      borderRadius: "var(--radius-lg, 16px)",
                      overflow: "hidden",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <div style={{ position: "relative", height: 160 }}>
                      <SlideImageSlot
                        imageUrl={img?.url}
                        fit="cover"
                        overlay={false}
                        template={template}
                        editable={editable}
                        onOpenImagePicker={onOpenImagePicker}
                      />
                    </div>
                    <div style={{ padding: "12px 14px" }}>
                      <div
                        contentEditable={editable}
                        suppressContentEditableWarning
                        onBlur={(e) => {
                          const updated = [...(slide.images || [])];
                          if (!updated[slotIdx]) updated[slotIdx] = {};
                          updated[slotIdx].caption = e.currentTarget.innerText;
                          onUpdateSlide({ images: updated });
                        }}
                        style={{
                          fontSize: 12,
                          color: template.cssSubText,
                          outline: "none",
                        }}
                      >
                        {img?.caption || `Showcase Item ${slotIdx + 1}`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ─── SPEAKER NOTES ACCORDION ─── */}
      <div
        style={{
          width: "100%",
          maxWidth: 960,
          background: "var(--color-bg-secondary, #111118)",
          border: "1px solid var(--color-border, rgba(255,255,255,0.1))",
          borderRadius: "var(--radius-lg, 16px)",
          overflow: "hidden",
        }}
      >
        <button
          onClick={() => setShowNotes(!showNotes)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 16px",
            background: "transparent",
            border: "none",
            color: "var(--color-text-secondary, #9d9db5)",
            fontSize: "var(--text-xs, 12px)",
            fontWeight: 600,
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span>🎙️</span>
            <span>Speaker Notes {slide.notes ? "• Included" : ""}</span>
          </div>
          <span>{showNotes ? "▲ Hide" : "▼ Show"}</span>
        </button>

        {showNotes && (
          <div style={{ padding: "0 16px 16px" }}>
            <textarea
              value={slide.notes || ""}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="Enter what you plan to say during this slide..."
              rows={3}
              style={{
                width: "100%",
                background: "rgba(0,0,0,0.25)",
                border: "1px solid var(--color-border, rgba(255,255,255,0.1))",
                borderRadius: "var(--radius-md, 10px)",
                color: "var(--color-text-primary, #ffffff)",
                padding: "10px 12px",
                fontSize: "var(--text-xs, 12px)",
                lineHeight: 1.5,
                resize: "vertical",
                outline: "none",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── REUSABLE HELPERS ───

function SlideHeading({ title, headingFont, editable, onTitleChange }) {
  return (
    <div
      contentEditable={editable}
      suppressContentEditableWarning
      onBlur={(e) => onTitleChange && onTitleChange(e.currentTarget.innerText)}
      style={{
        fontFamily: `${headingFont}, sans-serif`,
        fontSize: 32,
        fontWeight: 700,
        marginBottom: 20,
        outline: "none",
        cursor: editable ? "text" : "default",
        lineHeight: 1.2,
      }}
    >
      {title}
    </div>
  );
}

function AddPointButton({ onClick, subText }) {
  return (
    <button
      onClick={onClick}
      style={{
        alignSelf: "flex-start",
        background: "rgba(255,255,255,0.04)",
        border: "1px dashed rgba(255,255,255,0.2)",
        borderRadius: "var(--radius-md, 10px)",
        padding: "6px 14px",
        color: subText,
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
        marginTop: 4,
      }}
    >
      + Add Point
    </button>
  );
}

function SlideImageSlot({ imageUrl, fit, overlay, template, editable, onOpenImagePicker }) {
  const [hover, setHover] = useState(false);

  if (!imageUrl) {
    return (
      <div
        onClick={() => editable && onOpenImagePicker && onOpenImagePicker()}
        style={{
          width: "100%",
          height: "100%",
          minHeight: 220,
          borderRadius: "var(--radius-lg, 16px)",
          border: `2px dashed ${template.cssAccent}55`,
          background: "rgba(255,255,255,0.02)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          cursor: editable ? "pointer" : "default",
        }}
      >
        <div style={{ fontSize: 32 }}>📷</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: template.cssAccent }}>
          {editable ? "+ Click to Add Image" : "No Media"}
        </div>
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: "var(--radius-lg, 16px)",
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.1)",
        background: "#000000",
      }}
    >
      <img
        src={imageUrl}
        alt="Slide Visual"
        style={{
          width: "100%",
          height: "100%",
          objectFit: fit || "cover",
          display: "block",
        }}
      />

      {overlay && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
          }}
        />
      )}

      {editable && hover && onOpenImagePicker && (
        <button
          onClick={onOpenImagePicker}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(6px)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#ffffff",
            padding: "6px 12px",
            borderRadius: "var(--radius-full, 9999px)",
            fontSize: 11,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Change Image ✎
        </button>
      )}
    </div>
  );
}

function renderItemsList({
  items,
  contentMode,
  template,
  editable,
  offset = 0,
  onItemTextChange,
  onItemTitleChange,
  onRemoveItem,
  onMove,
}) {
  return items.map((item, localIdx) => {
    const actualIdx = localIdx + offset;

    // ─── 1. STANDARD BULLETS ───
    if (contentMode === "bullets") {
      return (
        <div
          key={item.id || actualIdx}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            padding: "8px 12px",
            borderRadius: "var(--radius-md, 10px)",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <span style={{ color: template.cssAccent, fontSize: 18, marginTop: 1 }}>●</span>
          <span
            contentEditable={editable}
            suppressContentEditableWarning
            onBlur={(e) => onItemTextChange(actualIdx, e.currentTarget.innerText)}
            style={{ fontSize: 16, lineHeight: 1.45, outline: "none", flex: 1 }}
          >
            {item.text || item.title || "Key point"}
          </span>
          {editable && items.length > 1 && (
            <ItemActionControls
              idx={actualIdx}
              total={items.length + offset}
              onMove={onMove}
              onRemove={onRemoveItem}
            />
          )}
        </div>
      );
    }

    // ─── 2. STEPS (NUMBERED FLOW) ───
    if (contentMode === "steps") {
      return (
        <div
          key={item.id || actualIdx}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 14,
            padding: "12px 16px",
            background: template.cssCardBg,
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "var(--radius-md, 10px)",
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: template.cssAccent,
              color: "#ffffff",
              fontSize: 12,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginTop: 1,
            }}
          >
            {actualIdx + 1}
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {item.title && (
              <span
                contentEditable={editable}
                suppressContentEditableWarning
                onBlur={(e) => onItemTitleChange(actualIdx, e.currentTarget.innerText)}
                style={{ fontSize: 15, fontWeight: 700, color: template.cssText, outline: "none" }}
              >
                {item.title}
              </span>
            )}
            <span
              contentEditable={editable}
              suppressContentEditableWarning
              onBlur={(e) => onItemTextChange(actualIdx, e.currentTarget.innerText)}
              style={{ fontSize: 15, lineHeight: 1.4, outline: "none", color: template.cssSubText }}
            >
              {item.text}
            </span>
          </div>
          {editable && items.length > 1 && (
            <ItemActionControls
              idx={actualIdx}
              total={items.length + offset}
              onMove={onMove}
              onRemove={onRemoveItem}
            />
          )}
        </div>
      );
    }

    // ─── 3. CHECKLIST ───
    if (contentMode === "checklist") {
      return (
        <div
          key={item.id || actualIdx}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            padding: "10px 14px",
            background: template.cssCardBg,
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "var(--radius-md, 10px)",
          }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: "6px",
              background: "rgba(34, 197, 94, 0.15)",
              border: "1px solid rgba(34, 197, 94, 0.35)",
              color: "#4ade80",
              fontSize: 12,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginTop: 1,
            }}
          >
            ✓
          </div>
          <span
            contentEditable={editable}
            suppressContentEditableWarning
            onBlur={(e) => onItemTextChange(actualIdx, e.currentTarget.innerText)}
            style={{ fontSize: 15, lineHeight: 1.45, outline: "none", flex: 1 }}
          >
            {item.text || item.title || "Checklist criteria point"}
          </span>
          {editable && items.length > 1 && (
            <ItemActionControls
              idx={actualIdx}
              total={items.length + offset}
              onMove={onMove}
              onRemove={onRemoveItem}
            />
          )}
        </div>
      );
    }

    // ─── 4. CARDS (DEFAULT) ───
    return (
      <div
        key={item.id || actualIdx}
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
          padding: "12px 16px",
          background: template.cssCardBg,
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "var(--radius-md, 10px)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        <span style={{ color: template.cssAccent, fontSize: 16, marginTop: 1 }}>◆</span>
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {item.title && (
            <span
              contentEditable={editable}
              suppressContentEditableWarning
              onBlur={(e) => onItemTitleChange(actualIdx, e.currentTarget.innerText)}
              style={{ fontSize: 15, fontWeight: 700, color: template.cssText, outline: "none" }}
            >
              {item.title}
            </span>
          )}
          <span
            contentEditable={editable}
            suppressContentEditableWarning
            onBlur={(e) => onItemTextChange(actualIdx, e.currentTarget.innerText)}
            style={{ fontSize: 15, lineHeight: 1.45, outline: "none", flex: 1 }}
          >
            {item.text}
          </span>
        </div>
        {editable && items.length > 1 && (
          <ItemActionControls
            idx={actualIdx}
            total={items.length + offset}
            onMove={onMove}
            onRemove={onRemoveItem}
          />
        )}
      </div>
    );
  });
}

function ItemActionControls({ idx, total, onMove, onRemove }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, opacity: 0.6 }}>
      {idx > 0 && (
        <button
          onClick={() => onMove(idx, -1)}
          title="Move up"
          style={{ background: "none", border: "none", color: "#ffffff", cursor: "pointer", fontSize: 10 }}
        >
          ▲
        </button>
      )}
      {idx < total - 1 && (
        <button
          onClick={() => onMove(idx, 1)}
          title="Move down"
          style={{ background: "none", border: "none", color: "#ffffff", cursor: "pointer", fontSize: 10 }}
        >
          ▼
        </button>
      )}
      <button
        onClick={() => onRemove(idx)}
        title="Remove point"
        style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 12, marginLeft: 2 }}
      >
        ✕
      </button>
    </div>
  );
}
