const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

const MAX_MESSAGE_LENGTH = 1200;
const MAX_HISTORY_MESSAGES = 10;
const MAX_HISTORY_CONTENT_LENGTH = 1000;
const MAX_IMAGE_DATA_URL_LENGTH = 5_600_000;
const FALLBACK_REPLY = "Je n’ai pas pu répondre pour le moment.";
const CTA_SUFFIX = "\n\n🚀 Explore SNG Portal pour aller plus loin";

function jsonResponse(statusCode, reply) {
  return {
    statusCode,
    headers: CORS_HEADERS,
    body: JSON.stringify({ reply: String(reply || FALLBACK_REPLY) })
  };
}

function detectIntent(message) {
  const text = String(message || "").toLowerCase();
  const intents = [
    { key: "cv", keywords: ["cv", "curriculum", "resume", "lettre", "entretien"] },
    { key: "business", keywords: ["business", "entreprise", "startup", "vente", "marketing", "stratégie", "strategie"] },
    { key: "study", keywords: ["étude", "etude", "cours", "révision", "revision", "quiz", "devoir", "dissertation"] },
    { key: "code", keywords: ["code", "javascript", "python", "bug", "debug", "api", "html", "css"] },
    { key: "portal", keywords: ["actualité", "actualite", "crypto", "loterie", "sport", "météo", "meteo", "cinéma", "cinema", "voyage"] }
  ];

  for (const intent of intents) {
    if (intent.keywords.some((word) => text.includes(word))) {
      return intent.key;
    }
  }
  return "general";
}

function buildIntentInstruction(intent) {
  const intentPrompts = {
    cv: "L'utilisateur travaille sur un CV/lettre/entretien. Donne une réponse structurée et actionnable avec exemples prêts à copier.",
    business: "L'utilisateur veut une aide business. Propose un angle stratégique orienté résultats, avec étapes, KPI et priorités.",
    study: "L'utilisateur demande une aide d'étude. Explique simplement, ajoute une mini fiche et un mini quiz si pertinent.",
    code: "L'utilisateur veut une aide technique. Donne une solution claire, exemples concrets et points de vérification.",
    portal: "L'utilisateur cherche du contenu SNG Portal. Suggère des pages internes pertinentes si utile.",
    general: "Réponds de manière professionnelle, concise et pratique avec un ton assistant business moderne."
  };

  return intentPrompts[intent] || intentPrompts.general;
}

function appendCta(reply) {
  const cleaned = String(reply || "").trim();
  if (!cleaned) {
    return `${FALLBACK_REPLY}${CTA_SUFFIX}`;
  }
  if (cleaned.includes("🚀 Explore SNG Portal pour aller plus loin")) {
    return cleaned;
  }
  return `${cleaned}${CTA_SUFFIX}`;
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
    return jsonResponse(500, appendCta(FALLBACK_REPLY));
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

  const intent = detectIntent(message);
  const intentInstruction = buildIntentInstruction(intent);

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
              "Tu es SNG AI, l’assistant intelligent officiel de SNG Portal.\n\n" +
              "Compétences prioritaires :\n" +
              "- rédaction d’emails, lettres, CV, contenus marketing et textes pro\n" +
              "- aide aux études : explications simples, fiches, quiz, plans, dissertations\n" +
              "- assistance code : debug, exemples et explications claires\n" +
              "- analyse d’images, captures d’écran et visuels\n" +
              "- recommandations de pages utiles SNG Portal quand pertinent\n\n" +
              "Règles de réponse :\n" +
              "- Réponds en français par défaut.\n" +
              "- Réponses structurées, lisibles, utiles et actionnables.\n" +
              "- Utilise des listes/étapes quand nécessaire.\n" +
              "- Si l’utilisateur demande du texte prêt à copier, produis-le directement.\n" +
              "- Si la demande concerne SNG Portal, suggère des liens internes utiles : /actualites.html, /crypto.html, /meteo.html, /loterie.html, /sports.html, /cinema.html, /voyages.html, /etudes.html.\n" +
              "- N’invente pas de faits non vérifiables.\n" +
              "- Ton : moderne, professionnel, clair."
          },
          {
            role: "system",
            content: `Intent détectée: ${intent}. ${intentInstruction}`
          },
          ...history,
          {
            role: "user",
            content: userMessageContent
          }
        ],
        max_tokens: 420,
        temperature: 0.5
      })
    });

    const data = await openaiResponse.json().catch(() => null);

    if (!openaiResponse.ok) {
      console.error("OpenAI error response:", data);
      return jsonResponse(502, appendCta(FALLBACK_REPLY));
    }

    const reply = appendCta(data?.choices?.[0]?.message?.content || "");

    if (!reply) {
      return jsonResponse(502, appendCta(FALLBACK_REPLY));
    }

    return jsonResponse(200, reply);
  } catch (error) {
    console.error("sng-ai function error:", error);
    return jsonResponse(500, appendCta(FALLBACK_REPLY));
  }
}
