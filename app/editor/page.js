"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePresentation } from "../../lib/store";
import EditorLayout from "../../components/editor/EditorLayout";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import { DEFAULT_TEMPLATE_ID } from "../../lib/templates";

// Starter fallback presentation in case user directly visits /editor
const DEMO_PRESENTATION = {
  title: "AI-Powered Presentation Strategy",
  slides: [
    {
      id: "demo-1",
      layout: "title",
      title: "AI-Powered Presentation Strategy",
      bullets: [],
      subtitle: "Transforming Ideas into Visual Impact",
      bigNumber: "",
      quote: "",
      author: "",
      notes: "Welcome the audience and introduce the core vision: moving from manual slide work to rapid AI generation.",
    },
    {
      id: "demo-2",
      layout: "bigNumber",
      title: "Time Saved per Deck",
      bullets: [
        "Traditional slide creation takes an average of 4.5 hours per deck.",
        "DeckAI cuts drafting and layout time down to under 60 seconds.",
      ],
      subtitle: "",
      bigNumber: "85%",
      quote: "",
      author: "",
      notes: "Highlight the massive 85% productivity gain and how teams can reallocate hours to high-value strategic work.",
    },
    {
      id: "demo-3",
      layout: "twoColumn",
      title: "Traditional vs. DeckAI",
      bullets: [
        "Manual formatting & layout tweaking",
        "Stock photo hunting & alignment",
        "Writer's block on bullet points",
        "One-click aesthetic themes",
        "AI outline & content generation",
        "Instant PPTX & PDF export",
      ],
      subtitle: "",
      bigNumber: "",
      quote: "",
      author: "",
      notes: "Contrast the friction of the legacy workflow with the instant speed of modern generative tools.",
    },
    {
      id: "demo-4",
      layout: "quote",
      title: "Design is not just what it looks like and feels like. Design is how it works.",
      bullets: [],
      subtitle: "",
      bigNumber: "",
      quote: "Design is not just what it looks like and feels like. Design is how it works.",
      author: "Steve Jobs",
      notes: "Pause on this quote to emphasize that beautiful design reinforces persuasive messaging.",
    },
  ],
};

export default function EditorPage() {
  const router = useRouter();
  const { state, actions } = usePresentation();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // If state already has a presentation, we're ready
    if (state.presentation && state.presentation.slides?.length > 0) {
      setIsInitializing(false);
      return;
    }

    // Otherwise check sessionStorage from /create wizard
    try {
      const stored = sessionStorage.getItem("deckAI_presentation");
      if (stored) {
        const { presentation, templateId } = JSON.parse(stored);
        if (presentation && presentation.slides?.length > 0) {
          actions.setPresentation(presentation);
          if (templateId) actions.setTemplate(templateId);
          setIsInitializing(false);
          return;
        }
      }
    } catch (e) {
      console.warn("Could not read from sessionStorage:", e);
    }

    // Fallback: load demo presentation
    actions.setPresentation(DEMO_PRESENTATION);
    actions.setTemplate(DEFAULT_TEMPLATE_ID);
    setIsInitializing(false);
  }, []); // Run once on mount

  if (isInitializing || !state.presentation) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--color-bg-primary)",
        }}
      >
        <LoadingSpinner size={48} text="Loading your presentation..." />
      </div>
    );
  }

  return (
    <EditorLayout
      presentation={state.presentation}
      templateId={state.templateId}
      activeSlideIndex={state.activeSlideIndex}
      onSelectSlide={actions.setActiveIndex}
      onUpdateSlide={actions.updateSlide}
      onAddSlide={actions.addSlide}
      onDeleteSlide={actions.deleteSlide}
      onDuplicateSlide={actions.duplicateSlide}
      onMoveSlide={actions.moveSlide}
      onSelectTemplate={actions.setTemplate}
      onUpdateTitle={actions.updateTitle}
    />
  );
}
