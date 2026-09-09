import { Groq } from "groq-sdk";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `You are a presentation outline generator.
Given a topic, audience, and desired slide count, output ONLY valid JSON (no markdown fences, no commentary) matching this exact shape:

{
  "outline": [
    { "title": "Slide title text", "layout": "title" | "content" | "twoColumn" | "section" | "quote" | "bigNumber" }
  ]
}

Rules:
- The first slide MUST use layout "title".
- Use "section" for major topic transitions (every 3-4 slides).
- Use "quote" for impactful quotes or key takeaways.
- Use "bigNumber" when highlighting a key statistic.
- Use "twoColumn" when comparing concepts or showing pros/cons.
- Use "content" for standard informational slides.
- Keep titles under 8 words, clear and specific.
- Return exactly the requested number of slides.
- Output raw JSON only.`;

export async function POST(req) {
  try {
    const { topic, audience, slideCount } = await req.json();

    if (!topic || typeof topic !== "string" || !topic.trim()) {
      return NextResponse.json({ error: "A topic is required." }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not set. Add it to .env and restart." },
        { status: 500 }
      );
    }

    const groq = new Groq({ apiKey });
    const count = Math.min(Math.max(Number(slideCount) || 8, 3), 15);

    const userPrompt = `Topic: ${topic}
Audience: ${audience || "general audience"}
Number of slides: ${count}

Generate the outline JSON now.`;

    let completion;
    try {
      completion = await groq.chat.completions.create({
        model: "openai/gpt-oss-120b",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_completion_tokens: 2048,
        top_p: 1,
        stream: false,
        response_format: { type: "json_object" },
      });
    } catch (primaryErr) {
      console.warn("gpt-oss-120b failed, trying gpt-oss-20b fallback:", primaryErr.message);
      completion = await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_completion_tokens: 2048,
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

    if (!parsed.outline || !Array.isArray(parsed.outline)) {
      return NextResponse.json({ error: "Model returned no outline.", raw }, { status: 502 });
    }

    const validLayouts = ["title", "content", "twoColumn", "section", "quote", "bigNumber"];
    const outline = parsed.outline.map((item, i) => ({
      title: String(item.title || `Slide ${i + 1}`),
      layout: validLayouts.includes(item.layout)
        ? item.layout
        : i === 0
        ? "title"
        : "content",
    }));

    return NextResponse.json({ outline });
  } catch (err) {
    console.error("generate-outline route error:", err);
    return NextResponse.json(
      { error: err?.message || "Unexpected server error." },
      { status: 500 }
    );
  }
}
