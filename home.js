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
  messages: [],
};

const homeNewsState = {
  open: false,
  loading: false,
  loadedAt: null,
  items: [],
  error: "",
};

const googleNewsFeedURL = "https://news.google.com/rss?hl=fr&gl=FR&ceid=FR:fr";

const homeSearchTopics = [
  {
    href: "./scolaire.html",
    label: "Scolaire",
    keywords: ["scolaire", "revision", "reviser", "controle", "examen", "cours", "college", "lycee", "universite", "devoir", "math", "francais", "science"],
    answer: "La page Scolaire est la plus adaptee pour reviser, chercher un theme et organiser tes cours.",
  },
  {
    href: "./meteo.html",
    label: "Meteo",
    keywords: ["meteo", "temperature", "pluie", "temps", "orage", "soleil", "climat", "prevision", "localisation"],
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
      <p>Recherche un theme simple comme scolaire, meteo, crypto ou contact pour ouvrir directement la bonne rubrique.</p>
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

function getAssistantLinks(query) {
  return findHomeMatches(query).map((item) => ({
    label: item.label,
    href: item.href,
    answer: item.answer,
  }));
}

function renderAssistantMessages() {
  return homeAssistantState.messages
    .map((message) => {
      const links = message.links?.length
        ? `
          <div class="home-ai-links">
            ${message.links.map((link) => `<a class="link-card" href="${SITE.safeUrl(link.href, './index.html')}">${SITE.escapeHTML(link.label)}</a>`).join("")}
          </div>
        `
        : "";

      return `
        <article class="home-ai-message home-ai-message-${SITE.escapeHTML(message.role)}">
          <span class="home-ai-message-role">${message.role === "user" ? "Toi" : "Assistant IA"}</span>
          <p>${SITE.escapeHTML(message.content)}</p>
          ${links}
        </article>
      `;
    })
    .join("");
}

function renderAssistantBubble(payload = {}) {
  const panel = document.querySelector("#home-ai-panel");

  if (!panel) {
    return;
  }

  const { query = "", loading = false, aiAnswer = "", fallback = "", error = false, links = [] } = payload;

  if (!query && !homeAssistantState.messages.length) {
    panel.innerHTML = `
      <p class="article-tag">Assistant IA</p>
      <h2>Assistant de la page</h2>
      <p>Pose une vraie question comme sur un mini ChatGPT de la page: explication, resume, methode, aide detaillee et liens utiles du site.</p>
      <div class="inline-actions">
        <button class="quick-chip" type="button" data-ai-prompt="Explique-moi comment bien reviser un controle important">Revision complexe</button>
        <button class="quick-chip" type="button" data-ai-prompt="Donne-moi une methode simple pour preparer un expose scolaire">Expose scolaire</button>
      </div>
    `;
    bindAIPromptButtons();
    return;
  }

  if (loading) {
    panel.innerHTML = `
      <p class="article-tag">Assistant IA</p>
      <h2>Analyse en cours...</h2>
      <div class="home-ai-chat-log">${renderAssistantMessages()}</div>
      <p class="home-ai-status">Je prepare une reponse pour “${SITE.escapeHTML(query)}”.</p>
    `;
    return;
  }

  if (query) {
    homeAssistantState.messages.push({
      role: "assistant",
      content: aiAnswer || fallback || "Je n'ai pas encore de reponse pour cette question.",
      links,
      error,
    });
  }

  panel.innerHTML = `
    <p class="article-tag">Assistant IA</p>
    <h2>Discussion</h2>
    <div class="home-ai-chat-log">${renderAssistantMessages()}</div>
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
                "Tu es l'assistant IA de la page d'accueil SNG Portal. Reponds en francais, de facon claire, utile et naturelle comme un mini ChatGPT de la page. Quand c'est pertinent, donne aussi de courtes pistes d'action et oriente vers les pages du site sans inventer de fonctionnalites.",
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

  const links = getAssistantLinks(trimmedQuery);

  homeAssistantState.messages.push({
    role: "user",
    content: trimmedQuery,
  });

  openAssistantBubble();
  homeAssistantState.loading = true;
  renderAssistantBubble({ query: trimmedQuery, loading: true });

  try {
    const aiAnswer = await askHomeAssistantAI(trimmedQuery);
    const fallback = buildLocalAssistantFallback(trimmedQuery);
    renderAssistantBubble({ query: trimmedQuery, aiAnswer: aiAnswer || fallback, fallback, error: !aiAnswer, links });
  } catch (error) {
    renderAssistantBubble({ query: trimmedQuery, fallback: buildLocalAssistantFallback(trimmedQuery), error: true, links });
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

function dedupeHomeNodes(selector, keep = 1) {
  const nodes = document.querySelectorAll(selector);
  nodes.forEach((node, index) => {
    if (index >= keep) {
      node.remove();
    }
  });
}

function dedupeHomeLayout() {
  dedupeHomeNodes("#home-search-guidance");
  dedupeHomeNodes(".quick-actions");
  dedupeHomeNodes("#home-news-bubble");
  dedupeHomeNodes(".home-weather-card");
  dedupeHomeNodes("#home-ai-trigger");
  dedupeHomeNodes("#home-ai-bubble");
  dedupeHomeNodes(".shortcut-grid");
  dedupeHomeNodes(".home-bottom-card");
  dedupeHomeNodes(".home-discovery");
  dedupeHomeNodes(".home-info-card", 4);
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
    runAIAssistant(input.value);
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

function safeNewsDate(value) {
  if (!value) {
    return "Date inconnue";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "Date inconnue";
  }

  return parsed.toLocaleString("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function parseGoogleNewsXML(payload) {
  const doc = new DOMParser().parseFromString(payload, "application/xml");
  const parseError = doc.querySelector("parsererror");
  if (parseError) {
    throw new Error("Flux RSS invalide");
  }

  return Array.from(doc.querySelectorAll("item"))
    .slice(0, 14)
    .map((item) => {
      const title = item.querySelector("title")?.textContent?.trim() || "Sans titre";
      const link = item.querySelector("link")?.textContent?.trim() || "https://news.google.com/home?hl=fr&gl=FR&ceid=FR%3Afr";
      const source = item.querySelector("source")?.textContent?.trim() || "Google News";
      const pubDate = item.querySelector("pubDate")?.textContent?.trim() || "";

      return {
        title,
        link,
        source,
        pubDate,
      };
    });
}

async function fetchGoogleNewsItems() {
  const encodedFeed = encodeURIComponent(googleNewsFeedURL);
  const attempts = [
    `https://api.allorigins.win/raw?url=${encodedFeed}`,
    `https://api.allorigins.win/get?url=${encodedFeed}`,
  ];

  let lastError = null;

  for (const url of attempts) {
    try {
      const response = await fetch(url, {
        headers: {
          Accept: "application/rss+xml, application/xml, text/xml, text/plain",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      if (url.includes("/get?")) {
        const payload = await response.json();
        return parseGoogleNewsXML(payload.contents || "");
      }

      const payload = await response.text();
      return parseGoogleNewsXML(payload);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Impossible de recuperer le flux Google News");
}

function renderHomeNews() {
  const panel = document.querySelector("#news-container");
  const status = document.querySelector("#news-status");

  if (!panel || !status) {
    return;
  }

  if (homeNewsState.loading) {
    status.textContent = "Chargement des actualites Google News...";
    return;
  }

  if (homeNewsState.error) {
    status.textContent = homeNewsState.error;
    panel.innerHTML = "";
    return;
  }

  if (!homeNewsState.items.length) {
    status.textContent = "Aucune actualite disponible pour le moment.";
    panel.innerHTML = "";
    return;
  }

  status.textContent = `Derniere mise a jour ${SITE.formatRelativeTime(homeNewsState.loadedAt)}. Source: Google News FR.`;
  panel.innerHTML = homeNewsState.items
    .map(
      (item) => `
      <article class="home-news-item">
        <a href="${SITE.safeUrl(item.link, "https://news.google.com/home?hl=fr&gl=FR&ceid=FR%3Afr")}" target="_blank" rel="noreferrer">${SITE.escapeHTML(item.title)}</a>
        <p class="home-news-meta">${SITE.escapeHTML(item.source)} · ${SITE.escapeHTML(safeNewsDate(item.pubDate))}</p>
      </article>
    `,
    )
    .join("");
}

async function refreshHomeNews() {
  if (homeNewsState.loading) {
    return;
  }

  homeNewsState.loading = true;
  homeNewsState.error = "";
  renderHomeNews();

  try {
    const items = await fetchGoogleNewsItems();
    homeNewsState.items = items;
    homeNewsState.loadedAt = new Date().toISOString();
  } catch (error) {
    homeNewsState.error = "Impossible de charger Google News en direct pour le moment. Clique sur le bouton ci-dessous pour ouvrir Google News.";
  } finally {
    homeNewsState.loading = false;
    renderHomeNews();
  }
}

function openNewsBubble() {
  const bubble = document.querySelector("#home-news-bubble");
  const trigger = document.querySelector("#home-news-trigger");

  if (!bubble || !trigger) {
    return;
  }

  bubble.hidden = false;
  bubble.classList.add("is-open");
  trigger.setAttribute("aria-expanded", "true");
  homeNewsState.open = true;

  if (!homeNewsState.items.length && !homeNewsState.loading) {
    refreshHomeNews();
  }
}

function closeNewsBubble() {
  const bubble = document.querySelector("#home-news-bubble");
  const trigger = document.querySelector("#home-news-trigger");

  if (!bubble || !trigger) {
    return;
  }

  bubble.classList.remove("is-open");
  bubble.hidden = true;
  trigger.setAttribute("aria-expanded", "false");
  homeNewsState.open = false;
}

function setupHomeNewsBubble() {
  const trigger = document.querySelector("#home-news-trigger");
  const close = document.querySelector("#home-news-close");
  const refresh = document.querySelector("#home-news-refresh");
  const bubble = document.querySelector("#home-news-bubble");

  if (!trigger || !close || !refresh || !bubble) {
    return;
  }

  renderHomeNews();

  trigger.addEventListener("click", () => {
    openNewsBubble();
  });

  close.addEventListener("click", () => {
    closeNewsBubble();
  });

  refresh.addEventListener("click", () => {
    refreshHomeNews();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  dedupeHomeLayout();
  SITE.setupMenu();
  SITE.observeReveals();
  setupSearch();
  setupHomeNewsBubble();
  setupAIAssistantBubble();
  setupHomeNewsletter();
  setupHomeWeather();
});
