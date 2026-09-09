"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../../components/landing/Navbar";
import StepIndicator from "../../components/create/StepIndicator";
import TopicInput from "../../components/create/TopicInput";
import StylePicker from "../../components/create/StylePicker";
import OutlineEditor from "../../components/create/OutlineEditor";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import { DEFAULT_TEMPLATE_ID } from "../../lib/templates";
import { usePresentation } from "../../lib/store";

function CreateWizardInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { actions } = usePresentation();

  const [step, setStep] = useState(0);
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("");
  const [slideCount, setSlideCount] = useState(8);
  const [templateId, setTemplateId] = useState(DEFAULT_TEMPLATE_ID);
  const [outline, setOutline] = useState([]);
  const [isLoadingOutline, setIsLoadingOutline] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  // Pre-fill topic from URL params (from landing page)
  useEffect(() => {
    const t = searchParams.get("topic");
    if (t) setTopic(t);
  }, [searchParams]);

  // Step 1 → 2: move to style picker
  function handleTopicNext() {
    if (!topic.trim()) return;
    setStep(1);
  }

  // Step 2 → 3: generate outline
  async function handleStyleNext() {
    setStep(2);
    setIsLoadingOutline(true);
    setError("");
    try {
      const res = await fetch("/api/generate-outline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, audience, slideCount }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate outline.");
      setOutline(data.outline || []);
    } catch (err) {
      setError(err.message);
      // Fallback outline
      setOutline([
        { title: topic, layout: "title" },
        ...Array.from({ length: slideCount - 1 }, (_, i) => ({
          title: `Section ${i + 1}`,
          layout: "content",
        })),
      ]);
    } finally {
      setIsLoadingOutline(false);
    }
  }

  // Step 3: generate full presentation and go to editor
  async function handleGenerate() {
    setIsGenerating(true);
    setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, audience, slideCount, outline }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed.");

      // Store presentation in sessionStorage and context, then navigate to editor
      sessionStorage.setItem(
        "deckAI_presentation",
        JSON.stringify({
          presentation: data,
          templateId,
        })
      );
      if (actions?.setPresentation) {
        actions.setPresentation(data);
        actions.setTemplate(templateId);
      }
      router.push("/editor");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <>
      <Navbar />
      <main
        style={{
          minHeight: "100vh",
          padding: "100px var(--space-8) var(--space-16)",
        }}
      >
        <StepIndicator currentStep={step} />

        {error && (
          <div
            style={{
              maxWidth: 600,
              margin: "0 auto var(--space-6)",
              padding: "var(--space-4) var(--space-5)",
              borderRadius: "var(--radius-md)",
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
              color: "#f87171",
              fontSize: "var(--text-sm)",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        {step === 0 && (
          <TopicInput
            topic={topic}
            setTopic={setTopic}
            audience={audience}
            setAudience={setAudience}
            slideCount={slideCount}
            setSlideCount={setSlideCount}
            onNext={handleTopicNext}
          />
        )}

        {step === 1 && (
          <StylePicker
            selectedId={templateId}
            onSelect={setTemplateId}
            onNext={handleStyleNext}
            onBack={() => setStep(0)}
          />
        )}

        {step === 2 && (
          <>
            {isLoadingOutline ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "var(--space-16) 0",
                }}
              >
                <LoadingSpinner size={48} text="AI is crafting your outline..." />
              </div>
            ) : (
              <OutlineEditor
                outline={outline}
                onUpdateOutline={setOutline}
                onBack={() => setStep(1)}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
              />
            )}
          </>
        )}
      </main>
    </>
  );
}

export default function CreatePage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LoadingSpinner size={48} text="Loading..." />
        </div>
      }
    >
      <CreateWizardInner />
    </Suspense>
  );
}
