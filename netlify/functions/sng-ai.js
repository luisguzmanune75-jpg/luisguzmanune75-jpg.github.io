const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

const MAX_MESSAGE_LENGTH = 1200;
const MAX_HISTORY_MESSAGES = 8;
const MAX_HISTORY_CONTENT_LENGTH = 1000;
const MAX_IMAGE_DATA_URL_LENGTH = 5_600_000;
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
  const rawHistory = Array.isArray(body?.history) ? body.history : [];
  const image = typeof body?.image === "string" ? body.image.trim() : "";

  if (!message && !image) {
    return jsonResponse(400, "Le message ne peut pas être vide.");
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return jsonResponse(400, `Message trop long. Maximum ${MAX_MESSAGE_LENGTH} caractères.`);
  }

  if (image && image.length > MAX_IMAGE_DATA_URL_LENGTH) {
    return jsonResponse(400, "Image trop volumineuse.");
  }

  if (image && !/^data:image\/[a-zA-Z0-9.+-]+;base64,[A-Za-z0-9+/=]+$/.test(image)) {
    return jsonResponse(400, "Format image invalide.");
  }

  const history = rawHistory
    .slice(-MAX_HISTORY_MESSAGES)
    .filter((item) => item && typeof item === "object")
    .map((item) => {
      const role = item.role === "assistant" ? "assistant" : item.role === "user" ? "user" : null;
      const content = typeof item.content === "string" ? item.content.trim().slice(0, MAX_HISTORY_CONTENT_LENGTH) : "";
      return role && content ? { role, content } : null;
    })
    .filter(Boolean);

  const userMessageContent = image
    ? [
        { type: "text", text: message || "Analyse cette image." },
        { type: "image_url", image_url: { url: image } }
      ]
    : message;

  try {
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Tu es SNG AI, l’assistant intelligent officiel de SNG Portal.\n\nCompétences prioritaires :\n- rédaction d’emails, lettres, CV, contenus marketing et textes pro\n- aide aux études : explications simples, fiches, quiz, plans, dissertations\n- assistance code : debug, exemples et explications claires\n- analyse d’images, captures d’écran et visuels\n- recommandations de pages utiles SNG Portal quand pertinent\n\nRègles de réponse :\n- Réponds en français par défaut.\n- Réponses structurées, lisibles, utiles et actionnables.\n- Utilise des listes/étapes quand nécessaire.\n- Si l’utilisateur demande du texte prêt à copier, produis-le directement.\n- Si la demande concerne SNG Portal, suggère des liens internes utiles : /actualites.html, /crypto.html, /meteo.html, /loterie.html, /sports.html, /cinema.html, /voyages.html, /etudes.html.\n- N’invente pas de faits non vérifiables.\n- Ton : moderne, professionnel, clair."
          },
          ...history,
          {
            role: "user",
            content: userMessageContent
          }
        ],
        max_tokens: 380,
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
