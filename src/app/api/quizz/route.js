import OpenAI from "openai";

export const runtime = "nodejs";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const QUIZ_SCHEMA = {
  name: "quiz_payload",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      theme: { type: "string" },
      level: { type: "string", enum: ["easy", "medium", "hard"] },
      questions: {
        type: "array",
        minItems: 1,
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            id: { type: "string" },
            question: { type: "string" },
            choices: {
              type: "array",
              minItems: 3,
              maxItems: 6,
              items: { type: "string" }
            },
            answerIndex: { type: "integer", minimum: 0 },
            explanation: { type: "string" }
          },
          required: ["id", "question", "choices", "answerIndex", "explanation"]
        }
      }
    },
    required: ["theme", "level", "questions"]
  }
};

export async function POST(req) {
  try {
    const body = await req.json();
    const theme = body?.theme ?? "Angola - Culture générale";
    const level = body?.level ?? "easy";
    const count = Math.min(Math.max(Number(body?.count ?? 10), 1), 30);

    const prompt = `
Tu es un générateur de quizz.
Tu a la bibliothèque du monde en ta possession.
Tu as des connaissances pointu dans chaque thème et tu es capable de diversifier unmaximum tes questions.
Tu as a ta disposition plus d'un millier de questions.
Contexte: Angola.
Thème: ${theme}
Niveau: ${level}
Nombre de questions: ${count}

Règles:
- Questions à choix multiples.
- choices: 4 propositions (A,B,C,D) sous forme de strings.
- answerIndex: index 0..3 correspondant à la bonne réponse.
- Explication courte et claire (1-2 phrases).
- Pas de texte hors JSON.
`.trim();

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
      text: {
        format: {
          type: "json_schema",
          ...QUIZ_SCHEMA
        }
      }
    });

    // ✅ Le SDK Responses expose souvent un helper output_text
    // (sinon fallback: extraire depuis response.output)
    const rawText =
      response.output_text ??
      (response.output?.[0]?.content?.find((c) => c.type === "output_text")?.text ?? "");

    let quiz;
    try {
      quiz = JSON.parse(rawText);
    } catch {
      // Si jamais le texte contient des espaces/retours ou autre, on renvoie brut pour debug
      return Response.json(
        { ok: false, error: "JSON_PARSE_FAILED", rawText },
        { status: 500 }
      );
    }

    // ✅ sécurité anti "undefined questions"
    const questions = Array.isArray(quiz?.questions) ? quiz.questions : [];
    console.log("raw text", rawText)
    console.log("___ questions ", questions)

    return Response.json({ ok: true, quiz: { ...quiz, questions } });
  } catch (e) {
    return Response.json(
      { ok: false, error: e?.message ?? String(e) },
      { status: 500 }
    );
  }
}
