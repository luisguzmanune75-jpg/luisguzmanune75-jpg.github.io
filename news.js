const NEWS_API_BASE = "https://api.gdeltproject.org/api/v2/doc/doc";

const newsTopics = [
  {
    id: "monde",
    label: "Monde",
    query:
      "(election OR government OR economy OR inflation OR market OR war OR protest OR technology OR climate OR earthquake OR flood OR health)",
  },
  {
    id: "geopolitique",
    label: "Geopolitique",
    query: "(war OR diplomacy OR sanctions OR election OR president OR protest OR conflict OR military)",
  },
  {
    id: "economie",
    label: "Economie",
    query: "(economy OR inflation OR jobs OR central bank OR market OR oil OR tariff OR recession)",
  },
  {
    id: "tech",
    label: "Tech",
    query: '("artificial intelligence" OR ai OR chip OR technology OR startup OR cybersecurity OR smartphone)',
  },
  {
    id: "climat",
    label: "Climat",
    query: '("climate change" OR climate OR wildfire OR hurricane OR drought OR flood OR weather)',
  },
  {
    id: "culture",
    label: "Culture",
    query: "(music OR cinema OR artist OR celebrity OR books OR festival OR streaming)",
  },
];

const newsTimespans = [
  { id: "1h", label: "1h", value: "1h" },
  { id: "6h", label: "6h", value: "6h" },
  { id: "24h", label: "24h", value: "24h" },
];

const newsState = {
  topicId: "monde",
  timespanId: "6h",
  queryText: "",
  items: [],
  loadedAt: null,
  lastQuery: "",
};

function activeTopic() {
  return newsTopics.find((topic) => topic.id === newsState.topicId) ?? newsTopics[0];
}

function activeTimespan() {
  return newsTimespans.find((item) => item.id === newsState.timespanId) ?? newsTimespans[1];
}

function normalizeNewsText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function escapeQueryLabel(value) {
  return SITE.escapeHTML(String(value ?? "").trim() || "--");
}

function parseSeenDate(value) {
  if (!value) {
    return null;
  }

  const match = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/.exec(String(value));

  if (match) {
    const [, year, month, day, hour, minute, second] = match;

    return new Date(
      Date.UTC(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hour),
        Number(minute),
        Number(second),
      ),
    );
  }

  const fallback = new Date(value);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
}

function formatSeenDate(value) {
  const date = parseSeenDate(value);

  if (!date) {
    return "--";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function relativeSeenDate(value) {
  const date = parseSeenDate(value);
  return date ? SITE.formatRelativeTime(date.toISOString()) : "--";
}

function safeDomain(item) {
  if (item.domain) {
    return item.domain.replace(/^www\./, "");
  }

  try {
    return new URL(item.url).hostname.replace(/^www\./, "");
  } catch (error) {
    return "source";
  }
}

function buildNewsQuery() {
  const custom = newsState.queryText.trim();

  if (custom) {
    return custom;
  }

  return activeTopic().query;
}

function buildNewsUrl() {
  const url = new URL(NEWS_API_BASE);
  const query = buildNewsQuery();

  url.searchParams.set("query", query);
  url.searchParams.set("mode", "artlist");
  url.searchParams.set("format", "json");
  url.searchParams.set("sort", "datedesc");
  url.searchParams.set("timespan", activeTimespan().value);
  url.searchParams.set("maxrecords", "18");

  newsState.lastQuery = query;
  return url.toString();
}

function countTopValues(items, getter, limit = 3) {
  const counts = new Map();

  items.forEach((item) => {
    const value = String(getter(item) ?? "").trim();

    if (!value) {
      return;
    }

    counts.set(value, (counts.get(value) ?? 0) + 1);
  });

  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, limit);
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
      newsState.queryText = "";
      document.querySelector("#news-query").value = "";
      renderTopicButtons();
      loadNews();
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
      loadNews();
    });
  });
}

function renderFeed() {
  const root = document.querySelector("#news-feed");

  if (!newsState.items.length) {
    root.innerHTML = `<div class="empty-state">Aucun article charge pour cette recherche.</div>`;
    return;
  }

  root.innerHTML = newsState.items
    .map((item) => {
      const imageUrl = SITE.safeUrl(item.socialimage ?? "", "");
      const country = String(item.sourcecountry ?? "").toUpperCase() || "--";
      const language = String(item.language ?? "").toUpperCase() || "--";

      return `
        <article class="article-card news-card">
          <a class="news-card-link" href="${SITE.safeUrl(item.url, "#")}" target="_blank" rel="noreferrer">
            ${
              imageUrl
                ? `<img class="news-card-media" src="${imageUrl}" alt="${SITE.escapeHTML(item.title ?? "Actualite")}" loading="lazy" />`
                : ""
            }
            <div class="news-card-copy">
              <p class="article-meta">
                ${SITE.escapeHTML(safeDomain(item))} - ${SITE.escapeHTML(country)} - ${SITE.escapeHTML(relativeSeenDate(item.seendate))}
              </p>
              <h3>${SITE.escapeHTML(item.title ?? "Sans titre")}</h3>
              <p class="news-card-subline">
                Vu ${SITE.escapeHTML(formatSeenDate(item.seendate))} - langue ${SITE.escapeHTML(language)}
              </p>
            </div>
          </a>
        </article>
      `;
    })
    .join("");
}

function renderPulse() {
  const root = document.querySelector("#news-pulse");
  const topSource = countTopValues(newsState.items, (item) => safeDomain(item), 1)[0]?.[0] ?? "--";
  const topCountry = countTopValues(newsState.items, (item) => item.sourcecountry, 1)[0]?.[0] ?? "--";
  const searchMode = newsState.queryText.trim() ? "Recherche libre" : activeTopic().label;

  root.innerHTML = `
    <div class="pulse-card">
      <span>Mode</span>
      <strong>${SITE.escapeHTML(searchMode)}</strong>
      <p>${newsState.queryText.trim() ? escapeQueryLabel(newsState.queryText) : "Theme actif"}</p>
    </div>
    <div class="pulse-card">
      <span>Fenetre</span>
      <strong>${SITE.escapeHTML(activeTimespan().label)}</strong>
      <p>Intervalle actuellement charge</p>
    </div>
    <div class="pulse-card">
      <span>Articles</span>
      <strong>${SITE.formatNumber(newsState.items.length)}</strong>
      <p>Elements retournes par le flux</p>
    </div>
    <div class="pulse-card">
      <span>Source forte</span>
      <strong>${SITE.escapeHTML(topSource)}</strong>
      <p>Pays dominant ${SITE.escapeHTML(String(topCountry).toUpperCase())}</p>
    </div>
  `;
}

function renderBriefing() {
  const root = document.querySelector("#news-briefing");
  const top = newsState.items[0];
  const modeLabel = newsState.queryText.trim()
    ? `la recherche "${newsState.queryText.trim()}"`
    : `le theme ${activeTopic().label}`;

  root.innerHTML = `
    <h3>Lecture utile</h3>
    <p>
      Le flux affiche les actualites des
      <strong>${SITE.escapeHTML(activeTimespan().label)}</strong>
      dernieres heures sur ${SITE.escapeHTML(modeLabel)}.
    </p>
    <p>
      Le premier signal visible est
      <strong>${SITE.escapeHTML(top?.title ?? "aucun titre charge")}</strong>.
    </p>
    <p>
      Ecris un pays, une personne, une entreprise ou un sujet dans la barre de
      recherche si tu veux sortir du theme de base.
    </p>
  `;
}

function renderSources() {
  const root = document.querySelector("#news-sources");
  const topDomains = countTopValues(newsState.items, (item) => safeDomain(item), 4);
  const topCountries = countTopValues(newsState.items, (item) => item.sourcecountry, 4);

  root.innerHTML = `
    <h3>Sources visibles</h3>
    <p>
      Requete active:
      <strong>${SITE.escapeHTML(newsState.lastQuery || "--")}</strong>
    </p>
    <div class="source-stack">
      <div class="tag-row">
        ${topDomains.length
          ? topDomains
              .map(([domain, count]) => `<span class="tag-chip">${SITE.escapeHTML(domain)} (${SITE.escapeHTML(String(count))})</span>`)
              .join("")
          : '<span class="tag-chip">Aucune source</span>'}
      </div>
      <div class="tag-row">
        ${topCountries.length
          ? topCountries
              .map(([country, count]) => `<span class="tag-chip">${SITE.escapeHTML(String(country).toUpperCase())} (${SITE.escapeHTML(String(count))})</span>`)
              .join("")
          : '<span class="tag-chip">Aucun pays</span>'}
      </div>
    </div>
    <p>
      Ce board se rafraichit automatiquement et reste plus fiable si tu
      recherches un sujet clair comme un pays, un artiste ou une entreprise.
    </p>
  `;
}

async function loadNews() {
  const status = document.querySelector("#news-status");
  const modeLabel = newsState.queryText.trim() ? newsState.queryText.trim() : activeTopic().label;

  SITE.setStatus(status, `Chargement ${modeLabel}...`, "neutral");

  try {
    const data = await SITE.fetchJSON(buildNewsUrl());
    const articles = Array.isArray(data?.articles) ? data.articles : [];

    newsState.items = articles.filter((item) => item.title && item.url);
    newsState.loadedAt = new Date().toISOString();
    renderFeed();
    renderPulse();
    renderBriefing();
    renderSources();
    SITE.setStatus(
      status,
      newsState.loadedAt ? `Maj ${SITE.formatRelativeTime(newsState.loadedAt)}` : "Flux charge",
      "live",
    );
  } catch (error) {
    renderFeed();
    renderPulse();
    renderBriefing();
    renderSources();
    SITE.setStatus(status, "Flux monde indisponible", "error");
  }
}

function setupSearch() {
  const form = document.querySelector("#news-search-form");
  const input = document.querySelector("#news-query");
  const refreshButton = document.querySelector("#refresh-news");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    newsState.queryText = input.value.trim();
    await loadNews();
  });

  refreshButton.addEventListener("click", () => {
    loadNews();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  SITE.setupMenu();
  SITE.observeReveals();
  renderTopicButtons();
  renderTimespans();
  renderFeed();
  renderPulse();
  renderBriefing();
  renderSources();
  setupSearch();
  loadNews();
  window.setInterval(loadNews, 180000);
});
