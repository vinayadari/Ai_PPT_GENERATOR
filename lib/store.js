"use client";

import { createContext, useContext, useReducer, useCallback } from "react";
import { DEFAULT_TEMPLATE_ID } from "./templates";
import { DEFAULT_FONT_PRESET_ID } from "./fonts";

// ─── Normalization Helper for Slides ─────────────────────
export function normalizeSlide(rawSlide, index = 0) {
  if (!rawSlide) return null;

  const layout = rawSlide.layout || "content";
  const contentMode = rawSlide.contentMode || "cards";

  // Normalize items array
  let items = [];
  if (Array.isArray(rawSlide.items) && rawSlide.items.length > 0) {
    items = rawSlide.items.map((item, i) => {
      if (typeof item === "string") {
        return { id: `item-${index}-${i}-${Date.now()}`, title: "", text: item };
      }
      return {
        id: item.id || `item-${index}-${i}-${Date.now()}`,
        title: item.title || "",
        text: item.text || "",
      };
    });
  } else if (Array.isArray(rawSlide.bullets) && rawSlide.bullets.length > 0) {
    items = rawSlide.bullets.map((b, i) => {
      const bulletStr = String(b || "");
      // If bullet is formatted like "Title: Description", optionally split
      if (bulletStr.includes(":") && bulletStr.indexOf(":") < 30) {
        const parts = bulletStr.split(":");
        return {
          id: `item-${index}-${i}`,
          title: parts[0].trim(),
          text: parts.slice(1).join(":").trim(),
        };
      }
      return {
        id: `item-${index}-${i}`,
        title: "",
        text: bulletStr,
      };
    });
  } else {
    // Default fallback item
    items = [
      { id: `item-${index}-0`, title: "", text: "Key takeaway point" },
    ];
  }

  // Keep bullets in sync for backwards compatibility
  const bullets = items.map((it) => (it.title ? `${it.title}: ${it.text}` : it.text));

  // Normalize images
  let images = Array.isArray(rawSlide.images) ? [...rawSlide.images] : [];
  if (rawSlide.image && images.length === 0) {
    images.push({
      id: `img-${Date.now()}`,
      url: rawSlide.image,
      caption: rawSlide.imageCaption || "",
      fit: rawSlide.imageFit || "cover",
      overlay: rawSlide.imageOverlay || false,
    });
  }

  // Normalize comparison
  const comparisonLeft = rawSlide.comparisonLeft || {
    title: "Before / Option A",
    badge: "Current State",
    items: items.slice(0, Math.ceil(items.length / 2)),
  };
  const comparisonRight = rawSlide.comparisonRight || {
    title: "After / Option B",
    badge: "Desired State",
    items: items.slice(Math.ceil(items.length / 2)),
  };

  // Normalize metrics
  const metrics = Array.isArray(rawSlide.metrics) && rawSlide.metrics.length > 0
    ? rawSlide.metrics
    : [
        { value: rawSlide.bigNumber || "99%", label: "Key Performance", change: "+42% YoY" },
        { value: "3.5x", label: "Productivity Boost", change: "Verified" },
        { value: "24/7", label: "Automated Workflow", change: "Zero Downtime" },
      ];

  // Normalize timeline steps
  const steps = Array.isArray(rawSlide.steps) && rawSlide.steps.length > 0
    ? rawSlide.steps
    : items.map((it, i) => ({
        step: `0${i + 1}`,
        title: it.title || `Phase ${i + 1}`,
        text: it.text || "Execution milestone details",
      }));

  return {
    id: rawSlide.id || `slide-${index + 1}-${Date.now()}`,
    layout,
    title: rawSlide.title || `Slide ${index + 1}`,
    subtitle: rawSlide.subtitle || "",
    contentMode,
    items,
    bullets,
    images,
    image: images[0]?.url || rawSlide.image || "",
    imageFit: rawSlide.imageFit || images[0]?.fit || "cover",
    imageOverlay: rawSlide.imageOverlay || images[0]?.overlay || false,
    bigNumber: rawSlide.bigNumber || "99%",
    quote: rawSlide.quote || "",
    author: rawSlide.author || "",
    comparisonLeft,
    comparisonRight,
    metrics,
    steps,
    notes: rawSlide.notes || "",
  };
}

export function normalizePresentation(raw) {
  if (!raw) return null;

  const slides = Array.isArray(raw.slides)
    ? raw.slides.map((s, idx) => normalizeSlide(s, idx))
    : [];

  return {
    title: raw.title || "Untitled Presentation",
    templateId: raw.templateId || DEFAULT_TEMPLATE_ID,
    fontPresetId: raw.fontPresetId || DEFAULT_FONT_PRESET_ID,
    slides,
  };
}

// ─── Initial state ──────────────────────────────────────
const initialState = {
  presentation: null, // { title, templateId, fontPresetId, slides: [] }
  templateId: DEFAULT_TEMPLATE_ID,
  fontPresetId: DEFAULT_FONT_PRESET_ID,
  activeSlideIndex: 0,
  isGenerating: false,
  isExporting: false,
  error: "",
};

// ─── Action types ───────────────────────────────────────
export const Actions = {
  SET_PRESENTATION: "SET_PRESENTATION",
  UPDATE_SLIDE: "UPDATE_SLIDE",
  UPDATE_SLIDE_FIELD: "UPDATE_SLIDE_FIELD",
  ADD_SLIDE: "ADD_SLIDE",
  DELETE_SLIDE: "DELETE_SLIDE",
  DUPLICATE_SLIDE: "DUPLICATE_SLIDE",
  MOVE_SLIDE: "MOVE_SLIDE",
  SET_TEMPLATE: "SET_TEMPLATE",
  SET_FONT: "SET_FONT",
  SET_ACTIVE_INDEX: "SET_ACTIVE_INDEX",
  SET_GENERATING: "SET_GENERATING",
  SET_EXPORTING: "SET_EXPORTING",
  SET_ERROR: "SET_ERROR",
  UPDATE_TITLE: "UPDATE_TITLE",

  // Content & Item specific actions
  UPDATE_SLIDE_CONTENT: "UPDATE_SLIDE_CONTENT",
  ADD_SLIDE_ITEM: "ADD_SLIDE_ITEM",
  DELETE_SLIDE_ITEM: "DELETE_SLIDE_ITEM",
  MOVE_SLIDE_ITEM: "MOVE_SLIDE_ITEM",
  UPDATE_SLIDE_ITEM: "UPDATE_SLIDE_ITEM",
  SET_CONTENT_MODE: "SET_CONTENT_MODE",

  // Image actions
  ADD_IMAGE: "ADD_IMAGE",
  REMOVE_IMAGE: "REMOVE_IMAGE",
  UPDATE_IMAGE: "UPDATE_IMAGE",
};

// ─── Reducer ────────────────────────────────────────────
function presentationReducer(state, action) {
  switch (action.type) {
    case Actions.SET_PRESENTATION: {
      const normalized = normalizePresentation(action.payload);
      return {
        ...state,
        presentation: normalized,
        templateId: normalized?.templateId || state.templateId,
        fontPresetId: normalized?.fontPresetId || state.fontPresetId,
        activeSlideIndex: 0,
        error: "",
      };
    }

    case Actions.UPDATE_SLIDE: {
      if (!state.presentation) return state;
      const slides = [...state.presentation.slides];
      const target = slides[action.index];
      if (!target) return state;

      const merged = normalizeSlide({ ...target, ...action.payload }, action.index);
      slides[action.index] = merged;

      return { ...state, presentation: { ...state.presentation, slides } };
    }

    case Actions.UPDATE_SLIDE_FIELD: {
      if (!state.presentation) return state;
      const slides = [...state.presentation.slides];
      const target = slides[action.index];
      if (!target) return state;

      const updated = { ...target, [action.field]: action.value };
      slides[action.index] = normalizeSlide(updated, action.index);

      return { ...state, presentation: { ...state.presentation, slides } };
    }

    case Actions.ADD_SLIDE: {
      if (!state.presentation) return state;
      const templateSlide = action.payload || {
        layout: "content",
        title: "New Slide",
        contentMode: "cards",
        items: [{ id: `item-${Date.now()}`, title: "Key Insight", text: "Add your content details here" }],
        notes: "",
      };

      const insertAt =
        action.index !== undefined ? action.index : state.activeSlideIndex + 1;
      const slides = [...state.presentation.slides];
      slides.splice(insertAt, 0, normalizeSlide(templateSlide, insertAt));

      return {
        ...state,
        presentation: { ...state.presentation, slides },
        activeSlideIndex: insertAt,
      };
    }

    case Actions.DELETE_SLIDE: {
      if (!state.presentation || state.presentation.slides.length <= 1) return state;
      const slides = state.presentation.slides.filter((_, i) => i !== action.index);
      const newIndex = Math.min(state.activeSlideIndex, slides.length - 1);
      return {
        ...state,
        presentation: { ...state.presentation, slides },
        activeSlideIndex: Math.max(0, newIndex),
      };
    }

    case Actions.DUPLICATE_SLIDE: {
      if (!state.presentation) return state;
      const srcSlide = state.presentation.slides[action.index];
      if (!srcSlide) return state;

      const dupe = JSON.parse(JSON.stringify(srcSlide));
      dupe.id = `slide-${Date.now()}`;
      dupe.title = `${dupe.title} (Copy)`;

      const slides = [...state.presentation.slides];
      slides.splice(action.index + 1, 0, dupe);

      return {
        ...state,
        presentation: { ...state.presentation, slides },
        activeSlideIndex: action.index + 1,
      };
    }

    case Actions.MOVE_SLIDE: {
      if (!state.presentation) return state;
      const slides = [...state.presentation.slides];
      const [moved] = slides.splice(action.from, 1);
      slides.splice(action.to, 0, moved);
      return {
        ...state,
        presentation: { ...state.presentation, slides },
        activeSlideIndex: action.to,
      };
    }

    case Actions.SET_TEMPLATE: {
      const templateId = action.payload;
      return {
        ...state,
        templateId,
        presentation: state.presentation
          ? { ...state.presentation, templateId }
          : null,
      };
    }

    case Actions.SET_FONT: {
      const fontPresetId = action.payload;
      return {
        ...state,
        fontPresetId,
        presentation: state.presentation
          ? { ...state.presentation, fontPresetId }
          : null,
      };
    }

    case Actions.SET_ACTIVE_INDEX:
      return { ...state, activeSlideIndex: action.payload };

    case Actions.SET_GENERATING:
      return { ...state, isGenerating: action.payload };

    case Actions.SET_EXPORTING:
      return { ...state, isExporting: action.payload };

    case Actions.SET_ERROR:
      return { ...state, error: action.payload };

    case Actions.UPDATE_TITLE:
      if (!state.presentation) return state;
      return {
        ...state,
        presentation: { ...state.presentation, title: action.payload },
      };

    // ─── Content Item Manipulations ───
    case Actions.ADD_SLIDE_ITEM: {
      if (!state.presentation) return state;
      const slides = [...state.presentation.slides];
      const slide = { ...slides[action.slideIndex] };
      const items = [...(slide.items || [])];

      const newItem = action.payload || {
        id: `item-${Date.now()}`,
        title: "",
        text: "New point",
      };

      if (action.insertIndex !== undefined) {
        items.splice(action.insertIndex, 0, newItem);
      } else {
        items.push(newItem);
      }

      slide.items = items;
      slide.bullets = items.map((it) => (it.title ? `${it.title}: ${it.text}` : it.text));
      slides[action.slideIndex] = slide;

      return { ...state, presentation: { ...state.presentation, slides } };
    }

    case Actions.DELETE_SLIDE_ITEM: {
      if (!state.presentation) return state;
      const slides = [...state.presentation.slides];
      const slide = { ...slides[action.slideIndex] };
      const items = (slide.items || []).filter((_, i) => i !== action.itemIndex);

      slide.items = items;
      slide.bullets = items.map((it) => (it.title ? `${it.title}: ${it.text}` : it.text));
      slides[action.slideIndex] = slide;

      return { ...state, presentation: { ...state.presentation, slides } };
    }

    case Actions.MOVE_SLIDE_ITEM: {
      if (!state.presentation) return state;
      const slides = [...state.presentation.slides];
      const slide = { ...slides[action.slideIndex] };
      const items = [...(slide.items || [])];

      if (
        action.from < 0 ||
        action.from >= items.length ||
        action.to < 0 ||
        action.to >= items.length
      ) {
        return state;
      }

      const [moved] = items.splice(action.from, 1);
      items.splice(action.to, 0, moved);

      slide.items = items;
      slide.bullets = items.map((it) => (it.title ? `${it.title}: ${it.text}` : it.text));
      slides[action.slideIndex] = slide;

      return { ...state, presentation: { ...state.presentation, slides } };
    }

    case Actions.UPDATE_SLIDE_ITEM: {
      if (!state.presentation) return state;
      const slides = [...state.presentation.slides];
      const slide = { ...slides[action.slideIndex] };
      const items = [...(slide.items || [])];

      if (items[action.itemIndex]) {
        items[action.itemIndex] = {
          ...items[action.itemIndex],
          ...action.payload,
        };
      }

      slide.items = items;
      slide.bullets = items.map((it) => (it.title ? `${it.title}: ${it.text}` : it.text));
      slides[action.slideIndex] = slide;

      return { ...state, presentation: { ...state.presentation, slides } };
    }

    case Actions.SET_CONTENT_MODE: {
      if (!state.presentation) return state;
      const slides = [...state.presentation.slides];
      const slide = { ...slides[action.slideIndex], contentMode: action.payload };
      slides[action.slideIndex] = slide;

      return { ...state, presentation: { ...state.presentation, slides } };
    }

    // ─── Image Manipulations ───
    case Actions.ADD_IMAGE: {
      if (!state.presentation) return state;
      const slides = [...state.presentation.slides];
      const slide = { ...slides[action.slideIndex] };
      const images = [...(slide.images || [])];

      const newImage = {
        id: `img-${Date.now()}`,
        url: action.payload.url,
        caption: action.payload.caption || "",
        fit: action.payload.fit || "cover",
        overlay: action.payload.overlay || false,
      };

      images.push(newImage);
      slide.images = images;
      slide.image = newImage.url;
      slide.imageFit = newImage.fit;
      slide.imageOverlay = newImage.overlay;
      slides[action.slideIndex] = slide;

      return { ...state, presentation: { ...state.presentation, slides } };
    }

    case Actions.REMOVE_IMAGE: {
      if (!state.presentation) return state;
      const slides = [...state.presentation.slides];
      const slide = { ...slides[action.slideIndex] };
      const imageIndex = action.imageIndex ?? 0;
      const images = (slide.images || []).filter((_, i) => i !== imageIndex);

      slide.images = images;
      slide.image = images[0]?.url || "";
      slides[action.slideIndex] = slide;

      return { ...state, presentation: { ...state.presentation, slides } };
    }

    case Actions.UPDATE_IMAGE: {
      if (!state.presentation) return state;
      const slides = [...state.presentation.slides];
      const slide = { ...slides[action.slideIndex] };
      const images = [...(slide.images || [])];
      const imageIndex = action.imageIndex ?? 0;

      if (images[imageIndex]) {
        images[imageIndex] = { ...images[imageIndex], ...action.payload };
      } else {
        images.push({
          id: `img-${Date.now()}`,
          url: action.payload.url || "",
          fit: action.payload.fit || "cover",
          overlay: action.payload.overlay || false,
        });
      }

      slide.images = images;
      slide.image = images[0]?.url || "";
      slide.imageFit = images[0]?.fit || "cover";
      slide.imageOverlay = images[0]?.overlay || false;
      slides[action.slideIndex] = slide;

      return { ...state, presentation: { ...state.presentation, slides } };
    }

    default:
      return state;
  }
}

// ─── Context ────────────────────────────────────────────
const PresentationContext = createContext(null);

export function PresentationProvider({ children }) {
  const [state, dispatch] = useReducer(presentationReducer, initialState);

  const actions = {
    setPresentation: useCallback(
      (data) => dispatch({ type: Actions.SET_PRESENTATION, payload: data }),
      []
    ),
    updateSlide: useCallback(
      (index, data) => dispatch({ type: Actions.UPDATE_SLIDE, index, payload: data }),
      []
    ),
    updateSlideField: useCallback(
      (index, field, value) =>
        dispatch({ type: Actions.UPDATE_SLIDE_FIELD, index, field, value }),
      []
    ),
    addSlide: useCallback(
      (slide, index) => dispatch({ type: Actions.ADD_SLIDE, payload: slide, index }),
      []
    ),
    deleteSlide: useCallback(
      (index) => dispatch({ type: Actions.DELETE_SLIDE, index }),
      []
    ),
    duplicateSlide: useCallback(
      (index) => dispatch({ type: Actions.DUPLICATE_SLIDE, index }),
      []
    ),
    moveSlide: useCallback(
      (from, to) => dispatch({ type: Actions.MOVE_SLIDE, from, to }),
      []
    ),
    setTemplate: useCallback(
      (id) => dispatch({ type: Actions.SET_TEMPLATE, payload: id }),
      []
    ),
    setFont: useCallback(
      (id) => dispatch({ type: Actions.SET_FONT, payload: id }),
      []
    ),
    setActiveIndex: useCallback(
      (i) => dispatch({ type: Actions.SET_ACTIVE_INDEX, payload: i }),
      []
    ),
    setGenerating: useCallback(
      (v) => dispatch({ type: Actions.SET_GENERATING, payload: v }),
      []
    ),
    setExporting: useCallback(
      (v) => dispatch({ type: Actions.SET_EXPORTING, payload: v }),
      []
    ),
    setError: useCallback(
      (msg) => dispatch({ type: Actions.SET_ERROR, payload: msg }),
      []
    ),
    updateTitle: useCallback(
      (title) => dispatch({ type: Actions.UPDATE_TITLE, payload: title }),
      []
    ),

    // Content Item actions
    addSlideItem: useCallback(
      (slideIndex, item, insertIndex) =>
        dispatch({ type: Actions.ADD_SLIDE_ITEM, slideIndex, payload: item, insertIndex }),
      []
    ),
    deleteSlideItem: useCallback(
      (slideIndex, itemIndex) =>
        dispatch({ type: Actions.DELETE_SLIDE_ITEM, slideIndex, itemIndex }),
      []
    ),
    moveSlideItem: useCallback(
      (slideIndex, from, to) =>
        dispatch({ type: Actions.MOVE_SLIDE_ITEM, slideIndex, from, to }),
      []
    ),
    updateSlideItem: useCallback(
      (slideIndex, itemIndex, itemData) =>
        dispatch({ type: Actions.UPDATE_SLIDE_ITEM, slideIndex, itemIndex, payload: itemData }),
      []
    ),
    setContentMode: useCallback(
      (slideIndex, mode) =>
        dispatch({ type: Actions.SET_CONTENT_MODE, slideIndex, payload: mode }),
      []
    ),

    // Image actions
    addImage: useCallback(
      (slideIndex, imageData) =>
        dispatch({ type: Actions.ADD_IMAGE, slideIndex, payload: imageData }),
      []
    ),
    removeImage: useCallback(
      (slideIndex, imageIndex) =>
        dispatch({ type: Actions.REMOVE_IMAGE, slideIndex, imageIndex }),
      []
    ),
    updateImage: useCallback(
      (slideIndex, imageData, imageIndex) =>
        dispatch({ type: Actions.UPDATE_IMAGE, slideIndex, payload: imageData, imageIndex }),
      []
    ),
  };

  return (
    <PresentationContext.Provider value={{ state, actions, dispatch }}>
      {children}
    </PresentationContext.Provider>
  );
}

export function usePresentation() {
  const ctx = useContext(PresentationContext);
  if (!ctx) {
    throw new Error("usePresentation must be used within PresentationProvider");
  }
  return ctx;
}
