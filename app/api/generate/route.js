import { Groq } from "groq-sdk";
import { NextResponse } from "next/server";
import { executePipeline } from "../../../lib/pipeline/index.js";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `You are a world-class presentation designer and copywriter, like Gamma AI.
Given a topic, audience, desired slide count, and optionally a pre-defined outline, generate a structured, compelling presentation.

You must output ONLY valid JSON (no markdown fences, no conversational prose) matching this exact schema:

{
  "title": "Presentation title",
  "slides": [
    {
      "layout": "title" | "content" | "twoColumn" | "threeColumn" | "section" | "quote" | "bigNumber" | "splitImageLeft" | "splitImageRight" | "comparison" | "metricsGrid" | "timeline",
      "contentMode": "bullets" | "cards" | "steps" | "checklist",
      "title": "Slide heading",
      "subtitle": "Subtitle or description (for title, section layouts)",
      "items": [
        { "title": "Item title (optional, for cards/steps)", "text": "Item body or bullet text" }
      ],
      "bigNumber": "Stat or metric like '85%' or '$14B' (for bigNumber layout only)",
      "bigNumberLabel": "Label beneath the number (for bigNumber layout only)",
      "quote": "Inspirational or authoritative quote (for quote layout only)",
      "author": "Quote author (for quote layout only)",
      "authorRole": "Author role or company (for quote layout only)",
      "badge": "Optional label badge like 'KEY INSIGHT' (for section and title layouts)",
      "comparisonLeft": {
        "title": "Option A title",
        "badge": "e.g. Before / Current",
        "items": [{ "text": "Point" }]
      },
      "comparisonRight": {
        "title": "Option B title",
        "badge": "e.g. After / Better",
        "items": [{ "text": "Point" }]
      },
      "metrics": [
        { "value": "99%", "label": "Metric name", "delta": "+12%", "positive": true }
      ],
      "notes": "Actionable speaker notes explaining what to say during this slide"
    }
  ]
}

Layout guidelines:
- "title": Presentation opener. Punchy title with concise subtitle. badge is optional e.g. "CONFERENCE 2025".
- "content" (contentMode: "bullets"|"cards"|"steps"|"checklist"): Standard slide. 3-5 crisp items under 15 words each. Use "cards" for concepts, "steps" for how-to, "checklist" for requirements.
- "twoColumn" (contentMode: "cards"): Two parallel groups of info. Supply 4-6 items (split evenly).
- "threeColumn" (contentMode: "cards"): Three feature pillars. Supply exactly 3 items, each with a title and short text.
- "section": Topic transition divider. Large centered title + short subtitle tagline. badge optional.
- "quote": Thought-provoking insight or testimonial. Fill quote, author, authorRole fields. items can be empty.
- "bigNumber": Astonishing metric. Fill bigNumber (e.g. "85%"), bigNumberLabel (e.g. "Faster delivery"). 1-2 supporting items.
- "splitImageLeft" / "splitImageRight": Visual storytelling. Title + 3 items.
- "comparison": Structured contrast. Fill comparisonLeft and comparisonRight each with title, badge, 2-3 items.
- "metricsGrid": KPI dashboard. Supply 3-4 metrics with value, label, delta, and positive(bool).
- "timeline": Sequential milestones. Each item has title (milestone name) + text (brief description).

Keep tone professional, persuasive, and engaging. Every slide must include helpful speaker notes.
Never output placeholder text like 'placeholder' or 'example'. Use real, compelling content.`;

export async function POST(req) {
  try {
    const { topic, audience, slideCount, outline, usePipeline = true } = await req.json();

    if (!topic || typeof topic !== "string" || !topic.trim()) {
      return NextResponse.json({ error: "A topic is required." }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not set on the server. Add it to .env and restart." },
        { status: 500 }
      );
    }

    const groq = new Groq({ apiKey });
    const count = Math.min(Math.max(Number(slideCount) || 6, 3), 15);

    if (usePipeline && (!outline || !outline.length)) {
      try {
        const pipelineResult = await executePipeline(groq, {
          topic,
          audience,
          slideCount: count,
          customStyle: true,
        });
        return NextResponse.json(pipelineResult);
      } catch (pipelineErr) {
        console.warn("Multi-stage pipeline execution failed, falling back to monolithic prompt generator:", pipelineErr);
      }
    }

    let userPrompt;
    if (outline && Array.isArray(outline) && outline.length > 0) {
      userPrompt = `Topic: ${topic}
Audience: ${audience || "general audience"}
Follow this exact slide outline and layouts:
${JSON.stringify(outline, null, 2)}

Flesh out full high-quality content, items array, speaker notes, and all layout-specific fields for each slide.
Output JSON only.`;
    } else {
      userPrompt = `Topic: ${topic}
Audience: ${audience || "general audience"}
Slide count: ${count}

Use a rich variety of layouts: start with "title", mix in "content" (with different contentModes), use "section" for transitions, include at least one "bigNumber" or "metricsGrid", one "quote", and optionally "comparison" or "timeline".
Generate full presentation JSON now. Output JSON only.`;
    }

    let completion;
    try {
      completion = await groq.chat.completions.create({
        model: "openai/gpt-oss-120b",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_completion_tokens: 6000,
        top_p: 1,
        stream: false,
        response_format: { type: "json_object" },
      });
    } catch (primaryErr) {
      console.warn("gpt-oss-120b failed in generate, trying gpt-oss-20b fallback:", primaryErr.message);
      completion = await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_completion_tokens: 6000,
        top_p: 1,
        stream: false,
        response_format: { type: "json_object" },
      });
    }

    const raw = completion.choices?.[0]?.message?.content || "{}";

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        { error: "Model returned invalid JSON. Try again.", raw },
        { status: 502 }
      );
    }

    if (!parsed.slides || !Array.isArray(parsed.slides) || parsed.slides.length === 0) {
      return NextResponse.json({ error: "Model returned no slides.", raw }, { status: 502 });
    }

    const validLayouts = [
      "title", "content", "twoColumn", "threeColumn", "section", "quote",
      "bigNumber", "splitImageLeft", "splitImageRight", "imageGallery",
      "comparison", "metricsGrid", "timeline",
    ];
    const validContentModes = ["bullets", "cards", "steps", "checklist"];

    const normalizeItems = (rawItems, rawBullets) => {
      if (Array.isArray(rawItems) && rawItems.length > 0) {
        return rawItems.map((item, i) => ({
          id: `item-${i}-${Date.now()}`,
          title: String(item.title || ""),
          text: String(item.text || item.body || item.description || ""),
        }));
      }
      if (Array.isArray(rawBullets) && rawBullets.length > 0) {
        return rawBullets.map((b, i) => {
          const str = String(b || "");
          if (str.includes(":") && str.indexOf(":") < 30) {
            const parts = str.split(":");
            return { id: `item-${i}`, title: parts[0].trim(), text: parts.slice(1).join(":").trim() };
          }
          return { id: `item-${i}`, title: "", text: str };
        });
      }
      return [{ id: "item-0", title: "", text: "Key takeaway point" }];
    };

    // Normalize each slide
    const slides = parsed.slides.map((s, i) => {
      const layout = validLayouts.includes(s.layout)
        ? s.layout
        : i === 0
        ? "title"
        : "content";

      const contentMode = validContentModes.includes(s.contentMode)
        ? s.contentMode
        : layout === "timeline" || layout === "threeColumn" || layout === "twoColumn"
        ? "cards"
        : "bullets";

      const items = normalizeItems(s.items, s.bullets);
      const bullets = items.map((it) => (it.title ? `${it.title}: ${it.text}` : it.text));

      const metrics = Array.isArray(s.metrics) && s.metrics.length > 0
        ? s.metrics.map((m) => ({
            value: String(m.value || "—"),
            label: String(m.label || "Metric"),
            // SlideCanvas's metricsGrid branch reads `change`, not `delta` —
            // keep both so any existing consumer of `delta` still works.
            delta: String(m.delta || ""),
            change: String(m.delta || m.change || ""),
            positive: m.positive !== false,
          }))
        : [];

      const normalizeCompSide = (side, defaultTitle, defaultBadge) => ({
        title: String(side?.title || defaultTitle),
        badge: String(side?.badge || defaultBadge),
        items: normalizeItems(side?.items, null),
      });

      const comparisonLeft = normalizeCompSide(s.comparisonLeft, "Option A", "Before");
      const comparisonRight = normalizeCompSide(s.comparisonRight, "Option B", "After");

      return {
        id: `slide-${i + 1}-${Date.now()}`,
        layout,
        contentMode,
        title: String(s.title || (outline && outline[i]?.title) || `Slide ${i + 1}`),
        subtitle: String(s.subtitle || ""),
        badge: String(s.badge || ""),
        items,
        bullets,
        bigNumber: String(s.bigNumber || (layout === "bigNumber" ? "—" : "")),
        bigNumberLabel: String(s.bigNumberLabel || ""),
        quote: String(s.quote || (layout === "quote" ? s.title : "")),
        author: String(s.author || ""),
        authorRole: String(s.authorRole || ""),
        comparisonLeft,
        comparisonRight,
        metrics,
        images: [],
        notes: String(s.notes || ""),
      };
    });

    return NextResponse.json({
      title: String(parsed.title || topic),
      slides,
    });
  } catch (err) {
    console.error("generate route error:", err);
    return NextResponse.json(
      { error: err?.message || "Unexpected server error." },
      { status: 500 }
    );
  }
}
