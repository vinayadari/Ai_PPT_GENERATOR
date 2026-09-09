import { CONTENT_TYPES } from "./schema.js";

const SYSTEM_PROMPT = `You are a presentation content planner. Convert the user's request into a structured slide outline. Output ONLY valid JSON, no prose, no markdown fences, no explanation.

Rules:
- Break content into sections. A section is a self-contained idea unit.
- For each section, classify contentType from this fixed list ONLY:
  ${JSON.stringify(CONTENT_TYPES)}
- Never invent a contentType outside this list.
- Keep list items concise: max 20 words each.
- If the topic implies a natural 2-4 way parallel breakdown (e.g. definition/concepts/objectives, problem/solution, before/after), mark "parallelGroup": true on those sections.
- Include a "closingLine" (short, quotable, under 15 words) if one naturally fits the topic, otherwise null.
- Infer 2-4 "moodKeywords" describing tone (e.g. technical, playful, corporate, minimal, vibrant).

OUTPUT SCHEMA:
{
  "topic": string,
  "subtitle": string,
  "sections": [
    {
      "heading": string,
      "contentType": enum,
      "parallelGroup": boolean,
      "items": [{ "lead": string, "description": string }],
      "text": string,
      "keyTakeaway": string | null
    }
  ],
  "closingLine": string | null,
  "moodKeywords": [string]
}`;

export async function runContentPlanner(groqClient, promptText, options = {}) {
  const slideCount = options.slideCount || 6;
  const userPrompt = `TOPIC & REQUIREMENTS: ${promptText}
TARGET SLIDE COUNT: ${slideCount}
Audience: ${options.audience || "general professional audience"}

Generate the content plan JSON object now.`;

  let completion;
  try {
    completion = await groqClient.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_completion_tokens: 4000,
      response_format: { type: "json_object" },
    });
  } catch (err) {
    console.warn("Primary model failed in ContentPlanner, using gpt-oss-20b fallback:", err.message);
    completion = await groqClient.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_completion_tokens: 4000,
      response_format: { type: "json_object" },
    });
  }

  const raw = completion.choices?.[0]?.message?.content || "{}";
  const parsed = JSON.parse(raw);

  // Validate & normalize
  const sections = Array.isArray(parsed.sections)
    ? parsed.sections.map((sec, idx) => ({
        id: `sec-${idx + 1}`,
        heading: String(sec.heading || `Section ${idx + 1}`),
        contentType: CONTENT_TYPES.includes(sec.contentType) ? sec.contentType : "bulleted_list",
        parallelGroup: Boolean(sec.parallelGroup),
        items: Array.isArray(sec.items)
          ? sec.items.map((it) => ({
              lead: String(it.lead || ""),
              description: String(it.description || it.text || ""),
            }))
          : [],
        text: String(sec.text || ""),
        keyTakeaway: sec.keyTakeaway ? String(sec.keyTakeaway) : null,
      }))
    : [];

  return {
    topic: String(parsed.topic || promptText),
    subtitle: String(parsed.subtitle || ""),
    sections,
    closingLine: parsed.closingLine ? String(parsed.closingLine) : null,
    moodKeywords: Array.isArray(parsed.moodKeywords) ? parsed.moodKeywords.map(String) : ["modern", "clean"],
  };
}
