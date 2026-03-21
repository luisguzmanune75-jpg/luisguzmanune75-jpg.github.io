const homeWeatherLabels = {
  0: "Ciel clair",
  1: "Plutot degage",
  2: "Partiellement nuageux",
  3: "Nuageux",
  45: "Brouillard",
  48: "Brouillard humide",
  51: "Bruine legere",
  53: "Bruine",
  55: "Bruine dense",
  61: "Pluie legere",
  63: "Pluie",
  65: "Pluie forte",
  71: "Neige legere",
  73: "Neige",
  75: "Neige forte",
  80: "Averses legeres",
  81: "Averses",
  82: "Averses fortes",
  95: "Orage",
};

const homeWeatherState = {
  placeLabel: "Votre position",
  current: null,
  loadedAt: null,
};

const homeAssistantState = {
  loading: false,
  open: false,
};

const homeSearchTopics = [
  {
    href: "./scolaire.html",
    label: "Scolaire",
    keywords: ["scolaire", "revision", "reviser", "controle", "examen", "cours", "college", "lycee", "universite", "devoir", "math", "francais", "science"],
    answer: "La page Scolaire est la plus adaptee pour reviser, chercher un theme et organiser tes cours.",
  },
  {
    href: "./actualites.html",
    label: "Actualites",
    keywords: ["actualite", "news", "jour", "monde", "politique", "guerre", "breaking"],
    answer: "La page Actualites est la plus adaptee pour suivre les infos du moment.",
  },
  {
    href: "./meteo.html",
    label: "Meteo",
    keywords: ["meteo", "temperature", "pluie", "temps", "orage", "soleil", "climat", "prevision"],
    answer: "La page Meteo est la meilleure destination pour consulter le temps et les previsions.",
  },
  {
    href: "./crypto.html",
    label: "Crypto",
    keywords: ["crypto", "bitcoin", "ethereum", "blockchain", "btc"],
    answer: "La page Crypto regroupe les infos et reperes utiles sur le marche crypto.",
  },
  {
    href: "./marches.html",
    label: "Marches",
    keywords: ["marche", "dollar", "euro", "devise", "prix", "change", "transfert", "bourse"],
    answer: "La page Marches centralise les devises, prix et tendances a suivre.",
  },
  {
    href: "./sports.html",
    label: "Sports",
    keywords: ["sport", "pari", "football", "nba", "match", "nfl", "score"],
    answer: "La page Sports est la meilleure entree pour les matchs et paris sportifs.",
  },
  {
    href: "./jeux.html",
    label: "Jeux",
    keywords: ["jeu", "gaming", "games", "steam", "playstation", "xbox", "switch"],
    answer: "La page Jeux regroupe le contenu gaming du portail.",
  },
  {
    href: "./blog.html",
    label: "Blog",
    keywords: ["blog", "article", "seo", "tendance", "viral"],
    answer: "La page Blog est adaptee pour lire des contenus expliques et des tendances.",
  },
  {
    href: "./satellites.html",
    label: "Satellites",
    keywords: ["satellite", "satellites", "espace", "orbite", "nasa"],
    answer: "La page Satellites est faite pour l'espace, les orbites et les satellites.",
  },
  {
    href: "./planetes.html",
    label: "Planetes",
    keywords: ["planete", "planetes", "systeme solaire", "asteroide"],
    answer: "La page Planetes est la bonne destination pour le systeme solaire.",
  },
  {
    href: "./contact.html",
    label: "Contact",
    keywords: ["contact", "email", "partenariat", "youtube", "instagram", "tiktok"],
    answer: "La page Contact permet de joindre facilement SNG Portal.",
  },
];

function normalizeHomeText(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function findHomeMatches(query, topics = homeSearchTopics) {
  const normalizedQuery = normalizeHomeText(query);

  return topics
    .map((topic) => ({
      ...topic,
      score: topic.keywords.reduce((count, keyword) => count + Number(normalizedQuery.includes(normalizeHomeText(keyword))), 0),
    }))
    .filter((topic) => topic.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

function getHomeAIConfig() {
  const config = window.SNG_AI_CONFIG ?? {};
  return {
    apiKey: config.apiKey || localStorage.getItem("sng_openai_api_key") || "",
    model: config.model || "gpt-4.1-mini",
    endpoint: config.endpoint || "https://api.openai.com/v1/responses",
  };
}

function isComplexQuestion(query) {
  const normalized = normalizeHomeText(query);
  const complexityMarkers = [
    "pourquoi",
    "comment",
    "explique",
    "difference",
    "analyse",
    "resume",
    "strategie",
    "aide moi",
    "peux tu",
    "peut tu",
    "donne moi",
    "quelles sont",
    "quel est",
    "quelle est",
  ];

  return normalized.length >= 25 || complexityMarkers.some((marker) => normalized.includes(marker));
}

function renderSearchGuidance(query = "", matches = []) {
  const root = document.querySelector("#home-search-guidance");

  if (!root) {
    return;
  }

  if (!query) {
    root.innerHTML = `
      <p class="article-tag">Recherche accueil</p>
      <h2>Trouve vite la bonne page</h2>
      <p>Recherche un theme simple comme scolaire, actualites, meteo, crypto ou contact pour ouvrir directement la bonne rubrique.</p>
    `;
    return;
  }

  if (!matches.length) {
    root.innerHTML = `
      <p class="article-tag">Recherche accueil</p>
      <h2>Aucune page detectee</h2>
      <p>Je n'ai pas trouve de rubrique exacte pour “${SITE.escapeHTML(query)}”. Essaie un mot-cle plus simple ou utilise l'assistant IA pour une question complexe.</p>
      <div class="button-row">
        <button class="button button-outline" type="button" data-open-ai-assistant="true">Ouvrir l'assistant IA</button>
      </div>
    `;
    bindAssistantOpeners();
    return;
  }

  const [bestMatch, ...others] = matches;
  root.innerHTML = `
    <p class="article-tag">Recherche accueil</p>
    <h2>${SITE.escapeHTML(bestMatch.label)} - page conseillee</h2>
    <p>${SITE.escapeHTML(bestMatch.answer)}</p>
    <div class="button-row">
      <a class="button button-solid" href="${bestMatch.href}">Ouvrir ${SITE.escapeHTML(bestMatch.label)}</a>
      ${others[0] ? `<a class="button button-outline" href="${others[0].href}">Voir aussi ${SITE.escapeHTML(others[0].label)}</a>` : `<button class="button button-outline" type="button" data-open-ai-assistant="true">Question complexe ? Assistant IA</button>`}
    </div>
  `;
  bindAssistantOpeners();
}

function renderAssistantBubble(payload = {}) {
  const panel = document.querySelector("#home-ai-panel");

  if (!panel) {
    return;
  }

  const { query = "", loading = false, aiAnswer = "", fallback = "", error = false } = payload;

  if (!query) {
    panel.innerHTML = `
      <p class="article-tag">Assistant IA</p>
      <h2>Questions complexes uniquement</h2>
      <p>Utilise cette bulle a part pour demander une explication, un resume ou une aide detaillee. La recherche normale de l'accueil reste dediee aux pages du site.</p>
      <div class="inline-actions">
        <button class="quick-chip" type="button" data-ai-prompt="Explique-moi comment bien reviser un controle important">Revision complexe</button>
        <button class="quick-chip" type="button" data-ai-prompt="Explique-moi simplement la difference entre une idee principale et un argument">Question de culture</button>
      </div>
    `;
    bindAIPromptButtons();
    return;
  }

  if (loading) {
    panel.innerHTML = `
      <p class="article-tag">Assistant IA</p>
      <h2>Analyse en cours...</h2>
      <p>Je prepare une reponse pour “${SITE.escapeHTML(query)}”.</p>
    `;
    return;
  }

  panel.innerHTML = `
    <p class="article-tag">Assistant IA</p>
    <h2>${error ? "Reponse locale" : "Reponse intelligente"}</h2>
    <p>${SITE.escapeHTML(aiAnswer || fallback || "Je n'ai pas encore de reponse pour cette question.")}</p>
    <div class="button-row button-row-compact">
      <button class="button button-outline" type="button" data-close-ai-assistant="true">Fermer</button>
    </div>
  `;
  bindAssistantClosers();
}

function bindAIPromptButtons() {
  document.querySelectorAll("[data-ai-prompt]").forEach((button) => {
    button.addEventListener("click", () => {
      const input = document.querySelector("#home-ai-input");
      const prompt = button.dataset.aiPrompt ?? "";
      if (input) {
        input.value = prompt;
      }
      openAssistantBubble();
      runAIAssistant(prompt);
    });
  });
}

function bindAssistantOpeners() {
  document.querySelectorAll("[data-open-ai-assistant='true']").forEach((button) => {
    button.addEventListener("click", () => {
      openAssistantBubble();
      document.querySelector("#home-ai-input")?.focus();
    });
  });
}

function bindAssistantClosers() {
  document.querySelectorAll("[data-close-ai-assistant='true']").forEach((button) => {
    button.addEventListener("click", () => {
      closeAssistantBubble();
    });
  });
}

function extractAIText(data) {
  if (typeof data.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }

  const texts = [];
  (data.output || []).forEach((item) => {
    (item.content || []).forEach((content) => {
      if (typeof content.text === "string") {
        texts.push(content.text.trim());
      }
    });
  });

  return texts.filter(Boolean).join("\n\n");
}

async function askHomeAssistantAI(query) {
  const { apiKey, model, endpoint } = getHomeAIConfig();

  if (!apiKey) {
    return "";
  }

  const response = await SITE.fetchJSON(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text:
                "Tu es un assistant IA separe de la recherche d'accueil de SNG Portal. Reponds uniquement aux questions complexes avec une explication claire, courte, en francais, sans parler de navigation ou de meteo locale sauf si la question l'exige vraiment.",
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: query,
            },
          ],
        },
      ],
      max_output_tokens: 220,
    }),
  });

  return extractAIText(response);
}

function buildLocalAssistantFallback(query) {
  const matches = findHomeMatches(query);
  if (matches[0]?.label === "Scolaire") {
    return "Pour une question scolaire complexe, commence par definir le theme, le niveau, les notions a comprendre, puis fais un plan de revision avec exemples, exercices et resume final.";
  }
  return "Je peux surtout aider sur des questions complexes si une cle API est configuree. Sans cle, formule une demande detaillee ou utilise la recherche normale pour ouvrir la bonne page du site.";
}

async function runAIAssistant(query) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery || homeAssistantState.loading) {
    return;
  }

  openAssistantBubble();
  homeAssistantState.loading = true;
  renderAssistantBubble({ query: trimmedQuery, loading: true });

  try {
    const aiAnswer = await askHomeAssistantAI(trimmedQuery);
    const fallback = buildLocalAssistantFallback(trimmedQuery);
    renderAssistantBubble({ query: trimmedQuery, aiAnswer: aiAnswer || fallback, fallback, error: !aiAnswer });
  } catch (error) {
    renderAssistantBubble({ query: trimmedQuery, fallback: buildLocalAssistantFallback(trimmedQuery), error: true });
  } finally {
    homeAssistantState.loading = false;
  }
}

function openAssistantBubble() {
  const bubble = document.querySelector("#home-ai-bubble");
  const trigger = document.querySelector("#home-ai-trigger");
  if (!bubble) {
    return;
  }
  bubble.hidden = false;
  bubble.classList.add("is-open");
  if (trigger) {
    trigger.setAttribute("aria-expanded", "true");
  }
  homeAssistantState.open = true;
}

function closeAssistantBubble() {
  const bubble = document.querySelector("#home-ai-bubble");
  const trigger = document.querySelector("#home-ai-trigger");
  if (!bubble) {
    return;
  }
  bubble.classList.remove("is-open");
  bubble.hidden = true;
  if (trigger) {
    trigger.setAttribute("aria-expanded", "false");
  }
  homeAssistantState.open = false;
}

function setupSearch() {
  const form = document.querySelector("#portal-search-form");
  const input = document.querySelector("#portal-search");

  if (!form || !input) {
    return;
  }

  renderSearchGuidance();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = input.value.trim();

    if (!query) {
      input.focus();
      renderSearchGuidance();
      return;
    }

    const matches = findHomeMatches(query);
    renderSearchGuidance(query, matches);

    if (matches[0]) {
      window.setTimeout(() => {
        window.location.href = matches[0].href;
      }, 500);
      return;
    }

    if (isComplexQuestion(query)) {
      openAssistantBubble();
      const aiInput = document.querySelector("#home-ai-input");
      if (aiInput) {
        aiInput.value = query;
      }
    }
  });
}

function setupAIAssistantBubble() {
  const trigger = document.querySelector("#home-ai-trigger");
  const close = document.querySelector("#home-ai-close");
  const form = document.querySelector("#home-ai-form");
  const input = document.querySelector("#home-ai-input");
  const bubble = document.querySelector("#home-ai-bubble");

  if (!trigger || !close || !form || !input || !bubble) {
    return;
  }

  renderAssistantBubble();
  bindAssistantOpeners();

  trigger.addEventListener("click", () => {
    openAssistantBubble();
    input.focus();
  });

  close.addEventListener("click", () => {
    closeAssistantBubble();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && homeAssistantState.open) {
      closeAssistantBubble();
    }
  });

  bubble.addEventListener("click", (event) => {
    if (event.target === bubble) {
      closeAssistantBubble();
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = input.value.trim();

    if (!query) {
      input.focus();
      return;
    }

    runAIAssistant(query);
  });
}

function setupHomeNewsletter() {
  const form = document.querySelector("#home-newsletter-form");
  const response = document.querySelector("#home-newsletter-response");

  if (!form || !response) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const email = data.get("email");

    response.innerHTML = `
      <span class="tag-chip">
        ${SITE.escapeHTML(email)} ajoute a la newsletter locale.
      </span>
    `;
    form.reset();
  });
}

function formatHomeWeatherLabel(code) {
  return homeWeatherLabels[code] || "Conditions variables";
}

function renderHomeWeather() {
  const widget = document.querySelector("#home-weather-widget");

  if (!widget) {
    return;
  }

  if (!homeWeatherState.current) {
    widget.innerHTML = '<div class="empty-state">La meteo locale apparaitra ici.</div>';
    return;
  }

  const current = homeWeatherState.current;

  widget.innerHTML = `
    <div class="home-weather-main">
      <div>
        <p class="article-tag">${SITE.escapeHTML(homeWeatherState.placeLabel)}</p>
        <h3>${SITE.escapeHTML(formatHomeWeatherLabel(current.weather_code))}</h3>
        <p class="home-weather-note">Maj ${SITE.escapeHTML(SITE.formatRelativeTime(homeWeatherState.loadedAt))}</p>
      </div>
      <strong class="home-weather-temp">${Math.round(current.temperature_2m)}°C</strong>
    </div>
    <div class="home-weather-stats">
      <div class="summary-card">
        <span>Ressenti</span>
        <strong>${Math.round(current.apparent_temperature)}°C</strong>
      </div>
      <div class="summary-card">
        <span>Vent</span>
        <strong>${Math.round(current.wind_speed_10m)} km/h</strong>
      </div>
      <div class="summary-card">
        <span>Humidite</span>
        <strong>${Math.round(current.relative_humidity_2m)}%</strong>
      </div>
    </div>
  `;
}

async function reverseGeocode(latitude, longitude) {
  try {
    const data = await SITE.fetchJSON(
      `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&language=fr&format=json`,
    );
    const place = data.results?.[0];

    if (!place) {
      return null;
    }

    return [place.name, place.admin1, place.country].filter(Boolean).join(", ");
  } catch (error) {
    return null;
  }
}

async function loadLocalWeather() {
  const status = document.querySelector("#home-weather-status");
  const button = document.querySelector("#home-weather-locate");

  if (!status || !button) {
    return;
  }

  if (!("geolocation" in navigator)) {
    status.textContent = "La geolocalisation n'est pas disponible sur cet appareil.";
    return;
  }

  button.disabled = true;
  status.textContent = "Localisation en cours...";

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const weather = await SITE.fetchJSON(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`,
        );

        homeWeatherState.current = weather.current;
        homeWeatherState.loadedAt = new Date().toISOString();
        homeWeatherState.placeLabel =
          (await reverseGeocode(latitude, longitude)) || `Lat ${latitude.toFixed(2)}, Lon ${longitude.toFixed(2)}`;

        status.textContent = "Meteo locale chargee.";
        renderHomeWeather();
      } catch (error) {
        status.textContent = "Impossible de charger la meteo locale pour le moment.";
      } finally {
        button.disabled = false;
      }
    },
    () => {
      status.textContent = "Autorise la localisation pour afficher la temperature autour de toi.";
      button.disabled = false;
    },
    {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 600000,
    },
  );
}

function setupHomeWeather() {
  const button = document.querySelector("#home-weather-locate");

  if (!button) {
    return;
  }

  renderHomeWeather();
  button.addEventListener("click", () => {
    loadLocalWeather();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  SITE.setupMenu();
  SITE.observeReveals();
  setupSearch();
  setupAIAssistantBubble();
  setupHomeNewsletter();
  setupHomeWeather();
});
