const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

const MAX_MESSAGE_LENGTH = 500;
const FALLBACK_REPLY = "Je n’ai pas pu répondre pour le moment.";

function jsonResponse(statusCode, reply) {
  return {
    statusCode,
    headers: CORS_HEADERS,
    body: JSON.stringify({ reply })
  };
}

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: CORS_HEADERS,
      body: ""
    };
  }

  if (event.httpMethod !== "POST") {
    return jsonResponse(405, "Méthode non autorisée.");
  }

  if (!process.env.OPENAI_API_KEY) {
    return jsonResponse(500, FALLBACK_REPLY);
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return jsonResponse(400, "JSON invalide.");
  }

  const message = typeof body?.message === "string" ? body.message.trim() : "";

  if (!message) {
    return jsonResponse(400, "Le message ne peut pas être vide.");
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return jsonResponse(400, `Message trop long. Maximum ${MAX_MESSAGE_LENGTH} caractères.`);
  }

  try {
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content:
              "Tu es l'assistant officiel de SNG Portal. Réponds en français, de façon courte, claire et utile. Aide l'utilisateur sur les actualités, crypto, météo, loterie, sports, cinéma, voyages, études et liens du site. Quand pertinent, propose des liens du site avec des chemins relatifs comme ./crypto.html, ./meteo.html, ./loterie.html, ./sports.html, ./cinema.html, ./voyage.html, ./etude.html et ./index.html. N'invente pas de faits non vérifiés."
          },
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: 180,
        temperature: 0.5
      })
    });

    const data = await openaiResponse.json().catch(() => null);
    console.log("OpenAI raw response:", data);

    if (!openaiResponse.ok) {
      console.error("OpenAI error response:", data);
      return jsonResponse(502, FALLBACK_REPLY);
    }

    const reply = (data?.choices?.[0]?.message?.content || "").trim();

    if (!reply) {
      return jsonResponse(502, FALLBACK_REPLY);
    }

    return jsonResponse(200, reply);
  } catch (error) {
    console.error("sng-ai function error:", error);
    return jsonResponse(500, FALLBACK_REPLY);
  }
}
