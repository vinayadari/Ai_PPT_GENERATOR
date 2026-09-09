"use client";

import { useState, useRef } from "react";
import Button from "../shared/Button";

// Curated high quality Unsplash photos by category
const CURATED_CATEGORIES = {
  Technology: [
    {
      title: "Data & Code",
      url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Artificial Intelligence",
      url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Clean Workspace",
      url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Futuristic Grid",
      url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    },
  ],
  "Business & Office": [
    {
      title: "Modern Boardroom",
      url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Strategic Planning",
      url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Financial Analytics",
      url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Executive Presentation",
      url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80",
    },
  ],
  "People & Team": [
    {
      title: "Collaborative Workshop",
      url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Creative Brainstorm",
      url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Global Teamwork",
      url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Speaker at Conference",
      url: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80",
    },
  ],
  "Modern Architecture": [
    {
      title: "Minimalist Geometry",
      url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Skyscraper Glass",
      url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Urban Skyline",
      url: "https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Interior Light",
      url: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=80",
    },
  ],
  "Nature & Landscapes": [
    {
      title: "Mountain Peaks",
      url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Calm Ocean Waters",
      url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Deep Evergreen Mist",
      url: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Desert Sunset Dunes",
      url: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80",
    },
  ],
  "Abstract Gradients": [
    {
      title: "Fluid Purple Waves",
      url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Cosmic Dark Glow",
      url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Prismatic Light Refraction",
      url: "https://images.unsplash.com/photo-1550684847-75bdda21cc95?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Vibrant Cyan Mesh",
      url: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80",
    },
  ],
};

export default function ImagePickerModal({
  isOpen,
  onClose,
  onSelectImage,
  currentImage = "",
  currentFit = "cover",
  currentOverlay = false,
  onRemoveImage,
}) {
  const [activeTab, setActiveTab] = useState("presets"); // "presets" | "upload" | "url"
  const [selectedCategory, setSelectedCategory] = useState("Technology");
  const [customUrl, setCustomUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState(currentImage || "");
  const [fit, setFit] = useState(currentFit || "cover");
  const [overlay, setOverlay] = useState(currentOverlay || false);
  const [caption, setCaption] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please choose a valid image file (PNG, JPG, WebP, SVG).");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (typeof dataUrl === "string") {
        setPreviewUrl(dataUrl);
      }
      setIsUploading(false);
    };
    reader.onerror = () => {
      alert("Failed to read the local image file.");
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  }

  function handleApply() {
    if (!previewUrl) {
      alert("Please select, upload, or enter an image URL.");
      return;
    }

    onSelectImage({
      url: previewUrl,
      fit,
      overlay,
      caption,
    });
    onClose();
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 780,
          maxHeight: "88vh",
          background: "var(--color-bg-secondary, #111118)",
          border: "1px solid var(--color-border, rgba(255,255,255,0.1))",
          borderRadius: "var(--radius-xl, 20px)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 24px",
            borderBottom: "1px solid var(--color-border, rgba(255,255,255,0.08))",
          }}
        >
          <div>
            <h3
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "var(--color-text-primary, #ffffff)",
                margin: 0,
              }}
            >
              Slide Image & Media
            </h3>
            <p
              style={{
                fontSize: 13,
                color: "var(--color-text-muted, #94a3b8)",
                margin: "4px 0 0",
              }}
            >
              Add visual impact with curated photography, local files, or custom links.
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "none",
              borderRadius: "50%",
              width: 32,
              height: 32,
              color: "#94a3b8",
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            ✕
          </button>
        </div>

        {/* Tab switcher */}
        <div
          style={{
            display: "flex",
            gap: 8,
            padding: "12px 24px",
            borderBottom: "1px solid var(--color-border, rgba(255,255,255,0.06))",
            background: "rgba(0,0,0,0.2)",
          }}
        >
          <button
            onClick={() => setActiveTab("presets")}
            style={{
              padding: "6px 14px",
              borderRadius: "var(--radius-full, 9999px)",
              fontSize: 13,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              background: activeTab === "presets" ? "var(--color-accent, #7c5cfc)" : "transparent",
              color: activeTab === "presets" ? "#ffffff" : "var(--color-text-secondary, #9d9db5)",
              transition: "all 0.15s ease",
            }}
          >
            Curated Presets
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            style={{
              padding: "6px 14px",
              borderRadius: "var(--radius-full, 9999px)",
              fontSize: 13,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              background: activeTab === "upload" ? "var(--color-accent, #7c5cfc)" : "transparent",
              color: activeTab === "upload" ? "#ffffff" : "var(--color-text-secondary, #9d9db5)",
              transition: "all 0.15s ease",
            }}
          >
            Local Upload (Instant Base64)
          </button>
          <button
            onClick={() => setActiveTab("url")}
            style={{
              padding: "6px 14px",
              borderRadius: "var(--radius-full, 9999px)",
              fontSize: 13,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              background: activeTab === "url" ? "var(--color-accent, #7c5cfc)" : "transparent",
              color: activeTab === "url" ? "#ffffff" : "var(--color-text-secondary, #9d9db5)",
              transition: "all 0.15s ease",
            }}
          >
            Image URL
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
          {/* TAB 1: CURATED PRESETS */}
          {activeTab === "presets" && (
            <div>
              {/* Category pills */}
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  overflowX: "auto",
                  paddingBottom: 12,
                  marginBottom: 16,
                }}
              >
                {Object.keys(CURATED_CATEGORIES).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: "4px 12px",
                      borderRadius: "6px",
                      fontSize: 12,
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                      border: selectedCategory === cat ? "1px solid var(--color-accent, #7c5cfc)" : "1px solid rgba(255,255,255,0.1)",
                      background: selectedCategory === cat ? "rgba(124,92,252,0.15)" : "rgba(255,255,255,0.03)",
                      color: selectedCategory === cat ? "#ffffff" : "var(--color-text-secondary, #9d9db5)",
                      cursor: "pointer",
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Photo grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 14,
                }}
              >
                {CURATED_CATEGORIES[selectedCategory]?.map((photo, i) => {
                  const isChosen = previewUrl === photo.url;
                  return (
                    <div
                      key={i}
                      onClick={() => setPreviewUrl(photo.url)}
                      style={{
                        position: "relative",
                        aspectRatio: "16 / 9",
                        borderRadius: "10px",
                        overflow: "hidden",
                        cursor: "pointer",
                        border: isChosen ? "2px solid var(--color-accent, #7c5cfc)" : "1px solid rgba(255,255,255,0.1)",
                        boxShadow: isChosen ? "0 0 16px rgba(124,92,252,0.4)" : "none",
                        transform: isChosen ? "scale(1.02)" : "scale(1)",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <img
                        src={photo.url}
                        alt={photo.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)",
                          display: "flex",
                          alignItems: "flex-end",
                          padding: "10px 12px",
                        }}
                      >
                        <span
                          style={{
                            color: "#ffffff",
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          {photo.title}
                        </span>
                      </div>
                      {isChosen && (
                        <div
                          style={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            background: "var(--color-accent, #7c5cfc)",
                            color: "#ffffff",
                            borderRadius: "50%",
                            width: 22,
                            height: 22,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          ✓
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: LOCAL FILE UPLOAD */}
          {activeTab === "upload" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: "2px dashed rgba(255,255,255,0.2)",
                  borderRadius: "14px",
                  padding: "40px 20px",
                  textAlign: "center",
                  cursor: "pointer",
                  background: "rgba(255,255,255,0.02)",
                  transition: "all 0.2s ease",
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => setPreviewUrl(ev.target?.result);
                    reader.readAsDataURL(file);
                  }
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <div style={{ fontSize: 36, marginBottom: 12 }}>🖼️</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#ffffff", marginBottom: 6 }}>
                  {isUploading ? "Processing Image..." : "Drop an image here or click to browse"}
                </div>
                <div style={{ fontSize: 12, color: "var(--color-text-muted, #94a3b8)" }}>
                  Converts locally to Base64 data URL. Never leaves your browser and exports reliably to PDF & PowerPoint.
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOM URL */}
          {activeTab === "url" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--color-text-secondary, #9d9db5)",
                    marginBottom: 6,
                  }}
                >
                  Direct Image URL (HTTPS)
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="url"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    style={{
                      flex: 1,
                      padding: "10px 14px",
                      background: "rgba(0,0,0,0.3)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: "8px",
                      color: "#ffffff",
                      fontSize: 13,
                      outline: "none",
                    }}
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      if (customUrl.trim()) setPreviewUrl(customUrl.trim());
                    }}
                  >
                    Load Preview
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* ACTIVE PREVIEW & ADJUSTMENTS */}
          {previewUrl && (
            <div
              style={{
                marginTop: 20,
                padding: "16px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "12px",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--color-text-muted, #94a3b8)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: 10,
                }}
              >
                Selected Image Preview & Settings
              </div>

              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: 180,
                  borderRadius: "8px",
                  overflow: "hidden",
                  background: "#000000",
                  marginBottom: 14,
                }}
              >
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: fit,
                    display: "block",
                  }}
                />
                {overlay && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(0,0,0,0.45)",
                    }}
                  />
                )}
              </div>

              {/* Controls row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                {/* Fit Mode */}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>Fit Mode:</span>
                  <button
                    onClick={() => setFit("cover")}
                    style={{
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontSize: 11,
                      fontWeight: 600,
                      border: "none",
                      cursor: "pointer",
                      background: fit === "cover" ? "var(--color-accent, #7c5cfc)" : "rgba(255,255,255,0.05)",
                      color: fit === "cover" ? "#fff" : "#aaa",
                    }}
                  >
                    Cover
                  </button>
                  <button
                    onClick={() => setFit("contain")}
                    style={{
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontSize: 11,
                      fontWeight: 600,
                      border: "none",
                      cursor: "pointer",
                      background: fit === "contain" ? "var(--color-accent, #7c5cfc)" : "rgba(255,255,255,0.05)",
                      color: fit === "contain" ? "#fff" : "#aaa",
                    }}
                  >
                    Contain
                  </button>
                </div>

                {/* Overlay toggle */}
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 12,
                    color: "var(--color-text-secondary)",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={overlay}
                    onChange={(e) => setOverlay(e.target.checked)}
                  />
                  Dark readability overlay
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 24px",
            borderTop: "1px solid var(--color-border, rgba(255,255,255,0.08))",
            background: "rgba(0,0,0,0.2)",
          }}
        >
          <div>
            {currentImage && onRemoveImage && (
              <button
                onClick={() => {
                  onRemoveImage();
                  onClose();
                }}
                style={{
                  background: "rgba(239, 68, 68, 0.15)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  color: "#f87171",
                  borderRadius: "6px",
                  padding: "6px 12px",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Remove Image
              </button>
            )}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <Button variant="secondary" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleApply}>
              Apply Image to Slide
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
