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
};

const homeAssistantTopics = [
  {
    href: "./meteo.html",
    label: "Meteo",
    keywords: ["meteo", "temperature", "pluie", "temps", "orage", "soleil", "localisation"],
    answer: "Pour la meteo, tu peux utiliser la page Meteo ou le widget local sur l'accueil pour voir rapidement la temperature autour de toi.",
  },
  {
    href: "./scolaire.html",
    label: "Scolaire",
    keywords: ["scolaire", "revision", "reviser", "controle", "examen", "cours", "college", "lycee", "universite", "devoir"],
    answer: "Pour les questions d'etudes, la page Scolaire est la plus adaptee: tu y trouveras des conseils, des themes et des outils de revision.",
  },
  {
    href: "./actualites.html",
    label: "Actualites",
    keywords: ["actualite", "news", "jour", "monde", "politique", "guerre", "breaking"],
    answer: "Si tu veux suivre ce qui se passe maintenant, va sur Actualites pour voir les news du jour et les sujets chauds.",
  },
  {
    href: "./crypto.html",
    label: "Crypto",
    keywords: ["crypto", "bitcoin", "ethereum", "blockchain", "btc"],
    answer: "Pour les cryptos, la page Crypto donne les infos principales, les marches et les points de suivi utiles.",
  },
  {
    href: "./marches.html",
    label: "Marches",
    keywords: ["marche", "dollar", "euro", "devise", "prix", "change", "transfert"],
    answer: "Pour les devises, prix et transferts, la page Marches est la meilleure porte d'entree.",
  },
  {
    href: "./sports.html",
    label: "Sports",
    keywords: ["sport", "pari", "football", "nba", "match", "nfl"],
    answer: "Pour les matchs et paris sportifs, ouvre la page Sports pour voir rapidement les sections dediees.",
  },
  {
    href: "./jeux.html",
    label: "Jeux",
    keywords: ["jeu", "gaming", "games", "steam", "playstation", "xbox", "switch"],
    answer: "Pour le gaming et les jeux, la page Jeux regroupe les contenus les plus adaptes.",
  },
  {
    href: "./blog.html",
    label: "Blog",
    keywords: ["blog", "article", "seo", "tendance", "viral"],
    answer: "Si tu veux des contenus expliques ou des tendances, le Blog est la page a ouvrir.",
  },
  {
    href: "./satellites.html",
    label: "Satellites",
    keywords: ["satellite", "satellites", "espace", "orbite", "nasa"],
    answer: "Pour l'espace, les orbites et les satellites, utilise la page Satellites.",
  },
  {
    href: "./planetes.html",
    label: "Planetes",
    keywords: ["planete", "planetes", "systeme solaire", "asteroide"],
    answer: "Pour explorer les planetes et le systeme solaire, ouvre la page Planetes.",
  },
  {
    href: "./contact.html",
    label: "Contact",
    keywords: ["contact", "email", "partenariat", "youtube", "instagram", "tiktok"],
    answer: "Si tu veux contacter SNG Portal ou trouver les reseaux du projet, la page Contact est la bonne destination.",
  },
];

function normalizeHomeText(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function findHomeAssistantMatches(query) {
  const normalizedQuery = normalizeHomeText(query);

  return homeAssistantTopics
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

function renderHomeAssistant(query = "", payload = {}) {
  const root = document.querySelector("#home-assistant-response");

  if (!root) {
    return;
  }

  if (!query) {
    root.innerHTML = `
      <p class="article-tag">Assistant accueil</p>
      <h2>Recherche rapide et questions depuis l'accueil</h2>
      <p>
        Ecris un theme ou une question comme “Quelle page pour la meteo ?”,
        “Comment reviser pour un controle ?” ou “Je veux les actualites du jour”.
      </p>
      <p class="home-assistant-note">
        Si tu ajoutes une cle API dans <code>window.SNG_AI_CONFIG</code>, l'assistant peut aussi repondre avec ChatGPT.
      </p>
      <div class="inline-actions">
        <button class="quick-chip" type="button" data-home-question="Quelle page pour la meteo locale ?">Question meteo</button>
        <button class="quick-chip" type="button" data-home-question="Comment reviser pour un controle ?">Question scolaire</button>
        <button class="quick-chip" type="button" data-home-question="Je veux les actualites du jour">Recherche news</button>
      </div>
    `;
    bindHomeQuestionButtons();
    return;
  }

  if (payload.loading) {
    root.innerHTML = `
      <p class="article-tag">Assistant accueil</p>
      <h2>Recherche en cours...</h2>
      <p>Je prepare une reponse pour “${SITE.escapeHTML(query)}”.</p>
    `;
    return;
  }

  if (payload.aiAnswer) {
    root.innerHTML = `
      <p class="article-tag">Assistant IA</p>
      <h2>Reponse intelligente</h2>
      <p>${SITE.escapeHTML(payload.aiAnswer)}</p>
      ${payload.matches?.length ? `
        <div class="button-row">
          <a class="button button-solid" href="${SITE.safeUrl(payload.matches[0].href, './index.html')}">Ouvrir ${SITE.escapeHTML(payload.matches[0].label)}</a>
          ${payload.matches[1] ? `<a class="button button-outline" href="${SITE.safeUrl(payload.matches[1].href, './index.html')}">Voir aussi ${SITE.escapeHTML(payload.matches[1].label)}</a>` : ""}
        </div>
      ` : ""}
    `;
    return;
  }

  if (!payload.matches?.length) {
    root.innerHTML = `
      <p class="article-tag">Resultat</p>
      <h2>Aucune correspondance exacte</h2>
      <p>Je n'ai pas trouve de page parfaite pour “${SITE.escapeHTML(query)}”, mais tu peux essayer Actualites ou Contact pour continuer.</p>
      <div class="button-row">
        <a class="button button-solid" href="./actualites.html">Ouvrir Actualites</a>
        <a class="button button-outline" href="./contact.html">Ouvrir Contact</a>
      </div>
    `;
    return;
  }

  const [bestMatch, ...others] = payload.matches;
  root.innerHTML = `
    <p class="article-tag">Resultat</p>
    <h2>${SITE.escapeHTML(bestMatch.label)} - meilleure reponse</h2>
    <p>${SITE.escapeHTML(bestMatch.answer)}</p>
    <div class="button-row">
      <a class="button button-solid" href="${SITE.safeUrl(bestMatch.href, './index.html')}">Ouvrir ${SITE.escapeHTML(bestMatch.label)}</a>
      ${others[0] ? `<a class="button button-outline" href="${SITE.safeUrl(others[0].href, './index.html')}">Voir aussi ${SITE.escapeHTML(others[0].label)}</a>` : ""}
    </div>
    ${others.length ? `
      <div class="home-assistant-links">
        ${others.map((item) => `<a class="link-card" href="${SITE.safeUrl(item.href, './index.html')}">${SITE.escapeHTML(item.label)}</a>`).join("")}
      </div>
    ` : ""}
  `;
}

function bindHomeQuestionButtons() {
  document.querySelectorAll("[data-home-question]").forEach((button) => {
    button.addEventListener("click", () => {
      const question = button.dataset.homeQuestion ?? "";
      const input = document.querySelector("#portal-search");
      if (input) {
        input.value = question;
      }
      runHomeAssistant(question);
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

async function askHomeAssistantAI(query, matches) {
  const { apiKey, model, endpoint } = getHomeAIConfig();

  if (!apiKey) {
    return "";
  }

  const context = matches
    .map((item) => `${item.label}: ${item.answer} (${item.href})`)
    .join("\n");

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
                "Tu es l'assistant d'accueil de SNG Portal. Reponds en francais, de facon courte, claire et utile. Si possible, guide l'utilisateur vers les pages du site les plus pertinentes sans inventer de fonctionnalites.",
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `Question: ${query}\n\nPages utiles:\n${context || "Aucune page detectee."}`,
            },
          ],
        },
      ],
      max_output_tokens: 180,
    }),
  });

  return extractAIText(response);
}

async function runHomeAssistant(query) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery || homeAssistantState.loading) {
    return;
  }

  const matches = findHomeAssistantMatches(trimmedQuery);
  const { apiKey } = getHomeAIConfig();

  if (!apiKey) {
    renderHomeAssistant(trimmedQuery, { matches });
    return;
  }

  homeAssistantState.loading = true;
  renderHomeAssistant(trimmedQuery, { loading: true });

  try {
    const aiAnswer = await askHomeAssistantAI(trimmedQuery, matches);
    renderHomeAssistant(trimmedQuery, { aiAnswer, matches });
  } catch (error) {
    renderHomeAssistant(trimmedQuery, { matches });
  } finally {
    homeAssistantState.loading = false;
  }
}

function setupSearch() {
  const form = document.querySelector("#portal-search-form");
  const input = document.querySelector("#portal-search");

  if (!form || !input) {
    return;
  }

  renderHomeAssistant();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = input.value.trim();

    if (!query) {
      input.focus();
      renderHomeAssistant();
      return;
    }

    runHomeAssistant(query);
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
  setupHomeNewsletter();
  setupHomeWeather();
});
