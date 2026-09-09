import { FONT_PAIRINGS, MOTIFS } from "./schema.js";

const DESIGN_SYSTEM_PROMPT = `You generate a design token set for a presentation — never raw CSS, coordinates, or freehand SVG. Choose only from the controlled categories below.

Rules:
- colorPalette: generate exactly panelCount distinct accent hex colors, plus 1 background hex color (bg) and 1 text hex color (text).
- fontPairing: choose exactly ONE from: ${JSON.stringify(FONT_PAIRINGS)}
- motif: choose exactly ONE from: ${JSON.stringify(MOTIFS)}
- decorativeDensity: one of ["minimal", "moderate", "high"]

OUTPUT SCHEMA:
{
  "palette": { "panels": [string], "bg": string, "text": string },
  "fontPairing": string,
  "motif": string,
  "decorativeDensity": string
}`;

export async function runDesignThemeAI(groqClient, moodKeywords = [], panelCount = 3) {
  try {
    const userPrompt = `INPUT DATA: ${JSON.stringify({ moodKeywords, panelCount })}`;
    const completion = await groqClient.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        { role: "system", content: DESIGN_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.5,
      max_completion_tokens: 1000,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices?.[0]?.message?.content || "{}";
    const parsed = JSON.parse(raw);

    const fontPairing = FONT_PAIRINGS.includes(parsed.fontPairing) ? parsed.fontPairing : FONT_PAIRINGS[0];
    const motif = MOTIFS.includes(parsed.motif) ? parsed.motif : "none";
    const decorativeDensity = ["minimal", "moderate", "high"].includes(parsed.decorativeDensity)
      ? parsed.decorativeDensity
      : "moderate";

    const panels = Array.isArray(parsed.palette?.panels) && parsed.palette.panels.length > 0
      ? parsed.palette.panels
      : ["#8B5CF6", "#06B6D4", "#F97316"];
    const bg = parsed.palette?.bg || "#0B0B0F";
    const text = parsed.palette?.text || "#FFFFFF";

    return {
      palette: { panels, bg, text },
      fontPairing,
      motif,
      decorativeDensity,
    };
  } catch (err) {
    console.warn("Design/Theme AI failed, fallback to defaults:", err.message);
    return {
      palette: { panels: ["#8B5CF6", "#06B6D4", "#F97316"], bg: "#0B0B0F", text: "#FFFFFF" },
      fontPairing: "Inter/Inter",
      motif: "none",
      decorativeDensity: "moderate",
    };
  }
}
