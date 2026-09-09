import { LAYOUTS } from "./schema.js";

export function scoreLayout(brief, layout, previousLayout = null) {
  let score = 0;
  const n = brief.sections.length;
  const allParallel = brief.sections.every((s) => s.parallelGroup);

  if (allParallel) {
    if (n === 2 && layout === "two_column") score += 15;
    if (n === 3 && layout === "tri_panel_icon_list") score += 20;
    if (n === 4 && layout === "quad_grid") score += 20;
    if (n > 4 && layout === "quad_grid") score += 8; // reflow to 2 rows
  }

  const hasTimeline = brief.sections.some((s) => s.contentType === "timeline");
  if (hasTimeline && layout === "timeline") score += 25;

  const hasStats = brief.sections.some((s) => s.contentType === "stat_block");
  if (hasStats && layout === "stats_block") score += 20;

  const hasComparison = brief.sections.some((s) => s.contentType === "comparison");
  if (hasComparison && layout === "comparison") score += 25;

  const hasProcess = brief.sections.some((s) => s.contentType === "process_steps");
  if (hasProcess && layout === "process_steps") score += 20;

  if (brief.closingLine) score += 2;

  // Visual-rhythm penalty: discourage picking the same layout as the
  // immediately preceding slide, so a deck doesn't turn into 8 identical
  // tri_panel_icon_list slides in a row just because 8 sections happen to
  // score that layout highest individually.
  if (previousLayout && layout === previousLayout) score -= 15;

  return score;
}

export function resolveLayout(brief, aiCandidates = [], previousLayout = null) {
  const scored = LAYOUTS.map((l) => ({ layout: l, score: scoreLayout(brief, l, previousLayout) })).sort(
    (a, b) => b.score - a.score
  );

  const topScored = scored[0].layout;
  const topAI = aiCandidates[0]?.layout || topScored;

  if (topScored === topAI) {
    return { layout: topScored, source: "agreed", confidence: "high" };
  }

  return { layout: topScored, source: "scorer-override", aiSuggested: topAI, confidence: "medium" };
}

const SELECTOR_SYSTEM_PROMPT = `You are a layout selector for a slide. Choose from this fixed list ONLY:
${JSON.stringify(LAYOUTS)}

Never invent a layout outside this list. Return your top 2 candidates, ranked, each with a confidence score (0-1) and one-sentence reasoning.

OUTPUT SCHEMA:
{ "candidates": [ { "layout": string, "confidence": number, "reason": string } ] }`;

export async function runLayoutSelector(groqClient, contentSummary) {
  try {
    const userPrompt = `INPUT DATA: ${JSON.stringify(contentSummary)}`;
    const completion = await groqClient.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        { role: "system", content: SELECTOR_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.2,
      max_completion_tokens: 1000,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices?.[0]?.message?.content || "{}";
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed.candidates) ? parsed.candidates : [];
  } catch (err) {
    console.warn("Layout selector AI failed, fallback to empty candidates:", err.message);
    return [];
  }
}
