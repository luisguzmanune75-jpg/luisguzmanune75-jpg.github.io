const GNEWS_API_KEY = "852b17e691e70d2688d4fc92361e95c5";
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
  lastArticles: [],
};

function activeTopic() {
  return newsTopics.find((topic) => topic.id === newsState.topicId) ?? newsTopics[0];
}

function activeTimespan() {
  return newsTimespans.find((item) => item.id === newsState.timespanId) ?? newsTimespans[1];
}

function setStatus(message, tone = "neutral") {
  const status = document.getElementById("news-status");
  if (!status) return;

  status.textContent = message;
  status.classList.remove("status-neutral", "status-success", "status-warning", "status-danger");

  const toneClass =
    {
      neutral: "status-neutral",
      success: "status-success",
      warning: "status-warning",
      danger: "status-danger",
    }[tone] || "status-neutral";

  status.classList.add(toneClass);
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

function toSource(article) {
  return String(article?.source?.name || "Source inconnue").trim();
}

function formatAge(value) {
  if (!value) {
    return "maintenant";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "recent";
  }

  return SITE.formatRelativeTime(date.toISOString());
}

function countTopValues(items, getter, limit = 4) {
  const counts = new Map();

  items.forEach((item) => {
    const key = String(getter(item) || "").trim();
    if (!key) return;
    counts.set(key, (counts.get(key) || 0) + 1);
  });

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

function renderTopicButtons() {
  const root = document.getElementById("news-topics");
  if (!root) return;

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
      newsState.topicId = button.dataset.topic || newsState.topicId;
      renderTopicButtons();
      chargerActualites(
        activeTopic().value,
        activeTimespan().value,
        document.getElementById("searchInput")?.value || "",
      );
    });
  });
}

function renderTimespans() {
  const root = document.getElementById("news-timespans");
  if (!root) return;

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
      newsState.timespanId = button.dataset.timespan || newsState.timespanId;
      renderTimespans();
      chargerActualites(
        activeTopic().value,
        activeTimespan().value,
        document.getElementById("searchInput")?.value || "",
      );
    });
  });
}

function renderPulse(items, recherche = "") {
  const root = document.getElementById("news-pulse");
  if (!root) return;

  const uniqueSources = new Set(items.map(toSource)).size;

  root.innerHTML = `
    <div class="pulse-card">
      <small>Mode</small>
      <strong>${SITE.escapeHTML(recherche.trim() ? "Recherche" : activeTopic().label)}</strong>
    </div>
    <div class="pulse-card">
      <small>Fenetre</small>
      <strong>${SITE.escapeHTML(activeTimespan().label)}</strong>
    </div>
    <div class="pulse-card">
      <small>Articles</small>
      <strong>${SITE.escapeHTML(String(items.length))}</strong>
    </div>
    <div class="pulse-card">
      <small>Sources</small>
      <strong>${SITE.escapeHTML(String(uniqueSources))}</strong>
    </div>
  `;
}

function renderLead(items) {
  const root = document.getElementById("news-lead");
  if (!root) return;

  const lead = items[0];

  if (!lead) {
    root.innerHTML = "";
    return;
  }

  root.innerHTML = `
    <article class="lead-story">
      <a class="lead-story-link" href="${SITE.safeUrl(lead.url, "#")}" target="_blank" rel="noreferrer">
        <div class="lead-story-media">
          ${
            lead.image
              ? `<img src="${SITE.safeUrl(lead.image, "")}" alt="${SITE.escapeHTML(lead.title || "Actualite")}" loading="lazy" />`
              : ""
          }
        </div>
        <div class="lead-story-body">
          <span class="lead-story-source">${SITE.escapeHTML(toSource(lead))} - ${SITE.escapeHTML(formatAge(lead.publishedAt))}</span>
          <h3>${SITE.escapeHTML(lead.title || "Sans titre")}</h3>
          <p>${SITE.escapeHTML(lead.description || "Pas de resume disponible.")}</p>
        </div>
      </a>
    </article>
  `;
}

function renderCards(items) {
  const root = document.getElementById("newsResults");
  if (!root) return;

  if (!items.length) {
    root.innerHTML = '<div class="news-empty">Aucun article charge.</div>';
    return;
  }

  const rest = items.slice(1);

  if (!rest.length) {
    root.innerHTML = "";
    return;
  }

  root.innerHTML = rest
    .map(
      (article) => `
        <article class="news-card">
          <a href="${SITE.safeUrl(article.url, "#")}" target="_blank" rel="noreferrer">
            ${
              article.image
                ? `<img src="${SITE.safeUrl(article.image, "")}" alt="${SITE.escapeHTML(article.title || "Actualite")}" loading="lazy" />`
                : ""
            }
            <div class="news-card-body">
              <span class="news-source">${SITE.escapeHTML(toSource(article))} - ${SITE.escapeHTML(formatAge(article.publishedAt))}</span>
              <h3>${SITE.escapeHTML(article.title || "Sans titre")}</h3>
              <p>${SITE.escapeHTML(article.description || "Pas de resume disponible.")}</p>
            </div>
          </a>
        </article>
      `,
    )
    .join("");
}

function renderBriefing(items) {
  const resumeTitre = document.getElementById("resumeTitre");
  const resumeTexte = document.getElementById("resumeTexte");
  if (!resumeTitre || !resumeTexte) return;

  const top = items[0];

  resumeTitre.textContent = top?.title || "Aucun titre charge";
  resumeTexte.textContent = top?.description || "Aucune actualite disponible pour le moment.";
}

function renderTrends(items) {
  const trendsList = document.getElementById("trendsList");
  if (!trendsList) return;

  const words = new Map();

  items.forEach((article) => {
    String(article.title || "")
      .toLowerCase()
      .replace(/[^a-z0-9àâäéèêëîïôöùûüç\s-]/gi, " ")
      .split(/\s+/)
      .filter((word) => word.length > 3)
      .forEach((word) => {
        words.set(word, (words.get(word) || 0) + 1);
      });
  });

  const topWords = [...words.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  trendsList.innerHTML = topWords.length
    ? topWords
        .map(
          ([word, count]) => `
            <div class="trend-item">
              <small>Tendance</small>
              <span>${SITE.escapeHTML(word)} (${SITE.escapeHTML(String(count))})</span>
            </div>
          `,
        )
        .join("")
    : '<div class="briefing-line">Pas assez de donnees pour afficher les tendances.</div>';
}

function renderSources(items) {
  const sourcesList = document.getElementById("sourcesList");
  if (!sourcesList) return;

  const topSources = countTopValues(items, (item) => toSource(item), 8);

  sourcesList.innerHTML = topSources.length
    ? topSources
        .map(
          ([source, count]) =>
            `<span class="source-pill">${SITE.escapeHTML(source)} (${SITE.escapeHTML(String(count))})</span>`,
        )
        .join("")
    : '<span class="source-pill">Aucune source</span>';
}

async function chargerActualites(theme = "world", duree = "6h", recherche = "") {
  const resultats = document.getElementById("newsResults");
  if (resultats) {
    resultats.innerHTML = "<div class='news-empty'>Chargement des actualites...</div>";
  }

  setStatus(`Chargement ${recherche || activeTopic().label}...`, "neutral");

  try {
    const url = buildGNewsUrl(theme, recherche);
    const res = await fetch(url);
    const data = await res.json();

    const articles = Array.isArray(data?.articles) ? data.articles : [];
    newsState.lastArticles = articles.filter((article) => article?.title && article?.url);

    if (!newsState.lastArticles.length) {
      renderLead([]);
      renderCards([]);
      renderBriefing([]);
      renderTrends([]);
      renderSources([]);
      renderPulse([], recherche);
      setStatus("Aucun resultat", "warning");
      return;
    }

    renderLead(newsState.lastArticles);
    renderCards(newsState.lastArticles);
    renderBriefing(newsState.lastArticles);
    renderTrends(newsState.lastArticles);
    renderSources(newsState.lastArticles);
    renderPulse(newsState.lastArticles, recherche);
    setStatus(`Mis a jour ${SITE.formatRelativeTime(new Date().toISOString())}`, "success");
  } catch (error) {
    console.error(error);
    renderLead([]);
    renderCards([]);
    renderBriefing([]);
    renderTrends([]);
    renderSources([]);
    renderPulse([], recherche);
    setStatus("Erreur de chargement", "danger");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (typeof SITE?.setupMenu === "function") {
    SITE.setupMenu();
  }

  if (typeof SITE?.observeReveals === "function") {
    SITE.observeReveals();
  }

  const form = document.getElementById("news-search-form");
  const inputRecherche = document.getElementById("searchInput");
  const boutonRecherche = document.getElementById("searchBtn");
  const refreshButton = document.getElementById("refresh-news");

  renderTopicButtons();
  renderTimespans();

  boutonRecherche?.addEventListener("click", () => {
    chargerActualites(activeTopic().value, activeTimespan().value, inputRecherche?.value || "");
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    chargerActualites(activeTopic().value, activeTimespan().value, inputRecherche?.value || "");
  });

  refreshButton?.addEventListener("click", () => {
    chargerActualites(activeTopic().value, activeTimespan().value, inputRecherche?.value || "");
  });

  chargerActualites(activeTopic().value, activeTimespan().value);

  window.setInterval(() => {
    chargerActualites(activeTopic().value, activeTimespan().value, inputRecherche?.value || "");
  }, 180000);
});