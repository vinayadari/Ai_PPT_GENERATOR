import { Groq } from "groq-sdk";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { action, text, slideContext, customInstruction } = await req.json();

    if (!text && !slideContext) {
      return NextResponse.json({ error: "Text or slide content is required." }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not set. Add it to .env and restart." },
        { status: 500 }
      );
    }

    const groq = new Groq({ apiKey });

    let systemPrompt = "You are an expert presentation copywriter and editor.";
    let userPrompt = "";

    switch (action) {
      case "shorten":
        systemPrompt += " Rewrite the text to be punchier, more concise, and under fewer words while keeping core impact. Return ONLY the rewritten text without commentary.";
        userPrompt = `Shorten this presentation text:\n${text}`;
        break;

      case "expand":
        systemPrompt += " Expand this bullet or idea into a rich, detailed, compelling point suitable for a presentation. Return ONLY the expanded text.";
        userPrompt = `Expand this point:\n${text}`;
        break;

      case "professional":
        systemPrompt += " Rewrite the text in an executive, polished, professional business tone. Return ONLY the rewritten text.";
        userPrompt = `Make this text more executive and professional:\n${text}`;
        break;

      case "generateNotes":
        systemPrompt += " Generate natural, persuasive speaker notes explaining what the speaker should say for this slide. Return ONLY the speaker notes.";
        userPrompt = `Generate speaker notes for this slide:\nTitle: ${slideContext?.title || ""}\nBullets:\n${(slideContext?.bullets || []).join("\n")}`;
        break;

      case "custom":
      default:
        systemPrompt += " Follow the user's specific editing instructions. Return ONLY the result.";
        userPrompt = `Instruction: ${customInstruction || "Improve this text"}\n\nOriginal text:\n${text}`;
        break;
    }

    let completion;
    try {
      completion = await groq.chat.completions.create({
        model: "openai/gpt-oss-120b",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_completion_tokens: 1024,
      });
    } catch {
      completion = await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_completion_tokens: 1024,
      });
    }

    const result = completion.choices?.[0]?.message?.content?.trim() || text;

    return NextResponse.json({ result });
  } catch (err) {
    console.error("rewrite route error:", err);
    return NextResponse.json(
      { error: err?.message || "Rewrite failed." },
      { status: 500 }
    );
  }
}
