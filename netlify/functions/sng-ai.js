const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

const MAX_MESSAGE_LENGTH = 500;

function jsonResponse(statusCode, payload) {
  return {
    statusCode,
    headers: CORS_HEADERS,
    body: JSON.stringify(payload)
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
    return jsonResponse(405, { error: "Méthode non autorisée" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return jsonResponse(500, { error: "Configuration IA manquante" });
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return jsonResponse(400, { error: "Format de requête invalide" });
  }

  const message = (body?.message || "").trim();

  if (!message) {
    return jsonResponse(400, { error: "Le message ne peut pas être vide." });
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return jsonResponse(400, {
      error: `Message trop long. Maximum ${MAX_MESSAGE_LENGTH} caractères.`
    });
  }

  try {
    const openaiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
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
        max_output_tokens: 180,
        temperature: 0.5
      })
    });

    if (!openaiResponse.ok) {
      const err = await openaiResponse.text();
      console.error("OpenAI error:", err);
      return jsonResponse(502, { error: "Le service IA est momentanément indisponible." });
    }

    const data = await openaiResponse.json();
    const reply = (data?.output_text || "").trim();

    if (!reply) {
      return jsonResponse(502, { error: "Réponse IA vide." });
    }

    return jsonResponse(200, { reply });
  } catch (error) {
    console.error("sng-ai function error:", error);
    return jsonResponse(500, { error: "Erreur serveur IA." });
  }
}
