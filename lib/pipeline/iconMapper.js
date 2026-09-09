import { ICON_TAXONOMY } from "./schema.js";

const ICON_MAPPER_SYSTEM_PROMPT = `For each item below, return exactly one icon tag from this fixed taxonomy ONLY:
${JSON.stringify(ICON_TAXONOMY)}

Never invent a tag outside this list. If nothing fits well, return "generic-dot".

OUTPUT SCHEMA:
{ "mappings": [ { "id": string, "icon": string } ] }`;

export async function runIconMapper(groqClient, itemsToMap = []) {
  if (!itemsToMap.length) return [];

  try {
    const userPrompt = `INPUT DATA: ${JSON.stringify(itemsToMap)}`;
    const completion = await groqClient.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        { role: "system", content: ICON_MAPPER_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.2,
      max_completion_tokens: 1500,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices?.[0]?.message?.content || "{}";
    const parsed = JSON.parse(raw);
    const mappings = Array.isArray(parsed.mappings) ? parsed.mappings : [];

    const map = new Map(mappings.map((m) => [m.id, m.icon]));

    return itemsToMap.map((item) => {
      const tag = map.get(item.id);
      return {
        id: item.id,
        icon: ICON_TAXONOMY.includes(tag) ? tag : "generic-dot",
      };
    });
  } catch (err) {
    console.warn("Icon mapper AI failed, falling back to generic-dot:", err.message);
    return itemsToMap.map((item) => ({ id: item.id, icon: "generic-dot" }));
  }
}
