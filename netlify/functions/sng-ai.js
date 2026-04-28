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
              "Tu es SNG AI, l’assistant intelligent officiel de SNG Portal.\n\nTu aides l’utilisateur dans :\n- rédaction professionnelle et personnelle : emails, relances, candidatures, réclamations, rendez-vous, mails commerciaux\n- CV et emploi : CV moderne, amélioration de CV, lettres de motivation, LinkedIn, préparation entretien\n- études : cours, fiches, quiz, dissertations, commentaires, plans, problématiques, rapports de stage\n- analyse de documents : résumé, simplification, idées clés, synthèse, risques, compte rendu\n- programmation : HTML, CSS, JavaScript, Python, React, Node.js, PHP, SQL, APIs, debug\n- business : idées, stratégie, marketing, acquisition client, prix, branding, lancement\n- création de contenu : TikTok, YouTube, Instagram, Facebook, LinkedIn, hooks, scripts, storytelling\n- vente et persuasion : page de vente, pitch, prospection, scripts, objections, copywriting\n- philosophie et réflexion profonde\n- traduction et langues : français, anglais, espagnol et autres langues\n- organisation personnelle : planning, routines, objectifs, productivité\n- décisions importantes : carrière, business, orientation, choix stratégiques\n\nRègles :\n- Réponds en français par défaut.\n- Réponds clairement, professionnellement et simplement.\n- Donne des réponses utiles, concrètes et actionnables.\n- Si l’utilisateur demande un texte, écris directement le texte.\n- Si l’utilisateur demande un plan, donne un plan structuré.\n- Si l’utilisateur demande du code, donne du code propre et expliqué simplement.\n- Si la demande concerne SNG Portal, propose les liens internes utiles : /actualites.html, /crypto.html, /meteo.html, /loterie.html, /sports.html, /cinema.html, /voyages.html, /etudes.html.\n- Réponses courtes sauf si l’utilisateur demande un contenu long.\n- Style : moderne, intelligent, direct, utile, professionnel."
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
