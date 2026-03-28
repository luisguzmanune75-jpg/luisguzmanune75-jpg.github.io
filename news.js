const GNEWS_API_KEY = "TA_CLE_API";
const GNEWS_API_BASE = "https://gnews.io/api/v4";

const newsTopics = [
  { id: "monde", label: "Monde", value: "world" },
  { id: "nation", label: "Nation", value: "nation" },
  { id: "business", label: "Business", value: "business" },
  { id: "tech", label: "Tech", value: "technology" },
  { id: "science", label: "Science", value: "science" },
  { id: "sport", label: "Sport", value: "sports" },
  { id: "sante", label: "Sante", value: "health" },
  { id: "divertissement", label: "Culture", value: "entertainment" },
];

const newsTimespans = [
  { id: "1h", label: "1h", value: "1h" },
  { id: "6h", label: "6h", value: "6h" },
  { id: "24h", label: "24h", value: "24h" },
];

const newsState = {
  topicId: "monde",
  timespanId: "6h",
};

function activeTopic() {
  return newsTopics.find((topic) => topic.id === newsState.topicId) ?? newsTopics[0];
}

function activeTimespan() {
  return newsTimespans.find((item) => item.id === newsState.timespanId) ?? newsTimespans[1];
}

function buildGNewsUrl(theme = "world", recherche = "") {
  const endpoint = recherche && recherche.trim() ? "search" : "top-headlines";
  const url = new URL(`${GNEWS_API_BASE}/${endpoint}`);

  if (endpoint === "search") {
    url.searchParams.set("q", recherche.trim());
  } else {
    url.searchParams.set("topic", theme);
  }

  url.searchParams.set("lang", "fr");
  url.searchParams.set("max", "10");
  url.searchParams.set("token", GNEWS_API_KEY);

  return url.toString();
}

function renderTopicButtons() {
  const root = document.querySelector("#news-topics");

  root.innerHTML = newsTopics
    .map(
      (topic) => `
        <button
          class="pill-button ${topic.id === newsState.topicId ? "is-active" : ""}"
          type="button"
          data-topic="${SITE.escapeHTML(topic.id)}"
        >
          ${SITE.escapeHTML(topic.label)}
        </button>
      `,
    )
    .join("");

  root.querySelectorAll("[data-topic]").forEach((button) => {
    button.addEventListener("click", () => {
      newsState.topicId = button.dataset.topic ?? newsState.topicId;
      renderTopicButtons();
      chargerActualites(activeTopic().value, activeTimespan().value, document.getElementById("searchInput")?.value ?? "");
    });
  });
}

function renderTimespans() {
  const root = document.querySelector("#news-timespans");

  root.innerHTML = newsTimespans
    .map(
      (item) => `
        <button
          class="pill-button ${item.id === newsState.timespanId ? "is-active" : ""}"
          type="button"
          data-timespan="${SITE.escapeHTML(item.id)}"
        >
          ${SITE.escapeHTML(item.label)}
        </button>
      `,
    )
    .join("");

  root.querySelectorAll("[data-timespan]").forEach((button) => {
    button.addEventListener("click", () => {
      newsState.timespanId = button.dataset.timespan ?? newsState.timespanId;
      renderTimespans();
      chargerActualites(activeTopic().value, activeTimespan().value, document.getElementById("searchInput")?.value ?? "");
    });
  });
}

async function chargerActualites(theme = "world", duree = "6h", recherche = "") {
  const resultats = document.getElementById("newsResults");
  const resumeTitre = document.getElementById("resumeTitre");
  const resumeTexte = document.getElementById("resumeTexte");
  const status = document.getElementById("news-status");

  resultats.innerHTML = "<div class='loading'>Chargement des actualités...</div>";
  SITE.setStatus(status, `Chargement ${recherche || activeTopic().label}...`, "neutral");

  try {
    const url = buildGNewsUrl(theme, recherche);
    const res = await fetch(url);
    const data = await res.json();

    if (!data.articles || data.articles.length === 0) {
      resultats.innerHTML = '<div class="empty-state">Aucun article chargé.</div>';
      resumeTitre.textContent = "Aucun titre chargé";
      resumeTexte.textContent = "Aucune actualité disponible pour le moment.";
      SITE.setStatus(status, "Aucun resultat", "neutral");
      return;
    }

    resultats.innerHTML = data.articles
      .map(
        (article) => `
        <article class="article-card news-card">
          <a class="news-card-link" href="${SITE.safeUrl(article.url, "#")}" target="_blank" rel="noreferrer">
            ${article.image ? `<img class="news-card-media" src="${SITE.safeUrl(article.image, "")}" alt="${SITE.escapeHTML(article.title || "Actualite")}" loading="lazy" />` : ""}
            <div class="news-card-copy">
              <p class="article-meta">${SITE.escapeHTML(article.source?.name || "Source inconnue")}</p>
              <h3>${SITE.escapeHTML(article.title || "Sans titre")}</h3>
              <p class="news-card-subline">${SITE.escapeHTML(article.description || "Pas de résumé disponible.")}</p>
            </div>
          </a>
        </article>
      `,
      )
      .join("");

    resumeTitre.textContent = data.articles[0].title || "Résumé non disponible";
    resumeTexte.textContent = data.articles[0].description || "Résumé non disponible.";

    SITE.setStatus(status, `Maj ${SITE.formatRelativeTime(new Date().toISOString())}`, "live");
  } catch (error) {
    resultats.innerHTML = '<div class="empty-state">Erreur de chargement des actualités.</div>';
    resumeTitre.textContent = "Erreur";
    resumeTexte.textContent = "Impossible de charger les actualités.";
    SITE.setStatus(status, "Flux indisponible", "error");
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  SITE.setupMenu();
  SITE.observeReveals();

  const form = document.getElementById("news-search-form");
  const inputRecherche = document.getElementById("searchInput");
  const boutonRecherche = document.getElementById("searchBtn");
  const refreshButton = document.getElementById("refresh-news");

  renderTopicButtons();
  renderTimespans();

  boutonRecherche.addEventListener("click", () => {
    chargerActualites(activeTopic().value, activeTimespan().value, inputRecherche.value);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    chargerActualites(activeTopic().value, activeTimespan().value, inputRecherche.value);
  });

  refreshButton.addEventListener("click", () => {
    chargerActualites(activeTopic().value, activeTimespan().value, inputRecherche.value);
  });

  chargerActualites(activeTopic().value, activeTimespan().value);
  window.setInterval(() => {
    chargerActualites(activeTopic().value, activeTimespan().value, inputRecherche.value);
  }, 180000);
});
