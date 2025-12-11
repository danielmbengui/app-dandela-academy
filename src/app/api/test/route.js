// app/api/hello/route.js
import { defaultLanguage, languages } from "@/contexts/i18n/settings";
import { NextResponse } from "next/server";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
// GET /api/hello
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const lang_source = searchParams.get("lang") || defaultLanguage;
    const translations= searchParams.get("translations") || "";

    //const translations_source = JSON.parse(translations);
    const text = JSON.parse(translations);
    const sourceLang = lang_source;
    const _languages = languages;
    const url = "https://api.openai.com/v1/responses";
    const body = {
        model: "gpt-4.1-mini",
        input: `
Tu es un traducteur professionnel.
Texte source (${sourceLang}) :
${JSON.stringify(text, null, 2)}

Traduis ce texte dans les langues suivantes : ${_languages.join(", ")}.
Et corrige les fautes d'orthographes de la langue entrée : ${sourceLang}

Tu dois renvoyer STRICTEMENT un JSON de la forme :

{
  "translations": {
    "<langue>": {
      "<clé de l'objet d'entrée>": "<traduction dans la langue cible>"
    }
  }
}

Règles :
- Garde EXACTEMENT les mêmes clés que dans l'objet d'entrée.
- Chaque langue doit contenir toutes les clés.
- Ne renvoie AUCUN texte autour, UNIQUEMENT ce JSON.
`,
        text: {
            format: {
                type: "json_object"
            },
        },
    };



    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });

    if (!res.ok) {
        const errorText = await res.text();
        console.error("OpenAI API error:", errorText);
        throw new Error(`OpenAI API error: ${res.status}`);
    }

    const data = await res.json();

    // Avec /v1/responses, le texte est dans data.output[0].content[0].text, etc.,
    // mais comme on a demandé un JSON strict, on parse directement.
    const raw = data.output[0].content[0].text || data.output[0].content[0].json;
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;

    //return parsed; // { sourceLang: "...", translations: { en: "...", pt: "...", ... } }
    return NextResponse.json(parsed);
}

// POST /api/hello
export async function POST(request) {
    try {
        const body = await request.json();
        const { name } = body || {};

        if (!name) {
            return NextResponse.json(
                { error: "Le champ 'name' est obligatoire." },
                { status: 400 }
            );
        }

        return NextResponse.json({
            message: `Hello ${name}, ton POST a bien été reçu ✅`,
            received: body,
        });
    } catch (error) {
        return NextResponse.json(
            { error: "JSON invalide ou autre erreur." },
            { status: 400 }
        );
    }
}
