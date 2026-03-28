const GNEWS_API_KEY = "TA_CLE_API";
const GNEWS_API_BASE = "https://gnews.io/api/v4";

const newsTopics = [
  { id: "monde", label: "Monde", value: "world" },
  { id: "business", label: "Business", value: "business" },
  { id: "tech", label: "Tech", value: "technology" },
  { id: "science", label: "Science", value: "science" },
  { id: "sport", label: "Sport", value: "sports" },
  { id: "sante", label: "Sante", value: "health" },
];

const newsState = {
  topicId: "monde",
};

function activeTopic() {
  return newsTopics.find((topic) => topic.id === newsState.topicId) ?? newsTopics[0];
}

function setStatus(message, tone = "neutral") {
  const status = document.getElementById("news-status");
  status.textContent = message;

  status.classList.remove("status-neutral", "status-live", "status-error");

  if (tone === "error") {
    status.classList.add("status-error");
    return;
  }

  if (tone === "live") {
    status.classList.add("status-live");
    return;
  }

  status.classList.add("status-neutral");
}

function buildGNewsUrl(theme = "world", recherche = "") {
  const endpoint = recherche.trim() ? "search" : "top-headlines";
  const url = new URL(`${GNEWS_API_BASE}/${endpoint}`);

  if (endpoint === "search") {
    url.searchParams.set("q", recherche.trim());
  } else {
    url.searchParams.set("topic", theme);
  }

  url.searchParams.set("lang", "fr");
  url.searchParams.set("max", "25");
  url.searchParams.set("token", GNEWS_API_KEY);

  return url.toString();
}

function sourceLabel(article) {
  const source = String(article?.source?.name || "Source inconnue").trim();
  const date = article?.publishedAt ? SITE.formatRelativeTime(article.publishedAt) : "recent";
  return `${source} - ${date}`;
}

function renderTopicButtons() {
  const root = document.getElementById("news-topics");

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
      chargerActualites(activeTopic().value, document.getElementById("searchInput")?.value || "");
    });
  });
}

function renderArticles(articles) {
  const root = document.getElementById("newsResults");

  if (!articles.length) {
    root.innerHTML = '<div class="empty-state">Aucun article chargé.</div>';
    return;
  }

  root.innerHTML = articles
    .map(
      (article) => `
      <article class="article-card news-card">
        <a class="news-card-link" href="${SITE.safeUrl(article.url, "#")}" target="_blank" rel="noreferrer">
          ${article.image ? `<img class="news-card-media" src="${SITE.safeUrl(article.image, "")}" alt="${SITE.escapeHTML(article.title || "Actualite")}" loading="lazy" />` : ""}
          <div class="news-card-copy">
            <p class="article-meta">${SITE.escapeHTML(sourceLabel(article))}</p>
            <h3>${SITE.escapeHTML(article.title || "Sans titre")}</h3>
            <p class="news-card-subline">${SITE.escapeHTML(article.description || "Pas de résumé disponible.")}</p>
          </div>
        </a>
      </article>
    `,
    )
    .join("");
}

async function chargerActualites(theme = "world", recherche = "") {
  const resultats = document.getElementById("newsResults");
  resultats.innerHTML = "<div class='loading'>Chargement des actualités...</div>";
  setStatus(`Chargement ${recherche || activeTopic().label}...`, "neutral");

  try {
    const res = await fetch(buildGNewsUrl(theme, recherche));
    const data = await res.json();

    const articles = Array.isArray(data?.articles)
      ? data.articles.filter((article) => article?.title && article?.url)
      : [];

    renderArticles(articles);
    setStatus(`Maj ${SITE.formatRelativeTime(new Date().toISOString())}`, "live");
  } catch (error) {
    renderArticles([]);
    setStatus("Erreur de chargement", "error");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  SITE.setupMenu();
  SITE.observeReveals();

  const form = document.getElementById("news-search-form");
  const inputRecherche = document.getElementById("searchInput");
  const refreshButton = document.getElementById("refresh-news");

  renderTopicButtons();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    chargerActualites(activeTopic().value, inputRecherche.value);
  });

  refreshButton.addEventListener("click", () => {
    chargerActualites(activeTopic().value, inputRecherche.value);
  });

  chargerActualites(activeTopic().value);
  window.setInterval(() => {
    chargerActualites(activeTopic().value, inputRecherche.value);
  }, 180000);
});
