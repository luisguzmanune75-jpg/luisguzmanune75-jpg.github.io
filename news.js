const RSS_URL = "https://news.google.com/rss?hl=fr&gl=FR&ceid=FR:fr";
const PROXY = "https://api.allorigins.win/get?url=";

function setStatus(text) {
  const el = document.getElementById("news-status");
  if (el) {
    el.textContent = text;
  }
}

function parseRSS(xml) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "text/xml");

  return [...doc.querySelectorAll("item")].map((item) => ({
    title: item.querySelector("title")?.textContent || "",
    link: item.querySelector("link")?.textContent || "",
    source: item.querySelector("source")?.textContent || "Google News",
  }));
}

function renderLead(a) {
  const root = document.getElementById("news-lead");
  if (!root || !a) {
    return;
  }

  root.innerHTML = `
    <article class="lead-story">
      <a href="${a.link}" target="_blank" rel="noreferrer">
        <div class="lead-story-body">
          <span class="lead-story-source">${a.source}</span>
          <h3>${a.title}</h3>
        </div>
      </a>
    </article>
  `;
}

function renderCards(list) {
  const root = document.getElementById("newsResults");
  if (!root) {
    return;
  }

  root.innerHTML = list
    .slice(1)
    .map(
      (a) => `
    <article class="news-card">
      <a href="${a.link}" target="_blank" rel="noreferrer">
        <div class="news-card-body">
          <span class="news-source">${a.source}</span>
          <h3>${a.title}</h3>
        </div>
      </a>
    </article>
  `,
    )
    .join("");
}

function renderBrief(a) {
  const titre = document.getElementById("resumeTitre");
  const texte = document.getElementById("resumeTexte");

  if (titre) {
    titre.textContent = a.title;
  }

  if (texte) {
    texte.textContent = "Clique pour lire l’actualité complète.";
  }
}

function renderSources(list) {
  const root = document.getElementById("sourcesList");
  if (!root) {
    return;
  }

  const unique = [...new Set(list.map((a) => a.source))];
  root.innerHTML = unique.map((s) => `<span class="source-pill">${s}</span>`).join("");
}

function renderPulse(list) {
  const root = document.getElementById("news-pulse");
  if (!root) {
    return;
  }

  root.innerHTML = `
    <div class="pulse-card"><small>Articles</small><strong>${list.length}</strong></div>
    <div class="pulse-card"><small>Sources</small><strong>${new Set(list.map((a) => a.source)).size}</strong></div>
  `;
}

async function chargerActualites() {
  setStatus("Chargement...");

  try {
    const res = await fetch(PROXY + encodeURIComponent(RSS_URL));
    const data = await res.json();

    const articles = parseRSS(data.contents);

    if (!articles.length) {
      setStatus("Aucun resultat");
      return;
    }

    renderLead(articles[0]);
    renderCards(articles);
    renderBrief(articles[0]);
    renderSources(articles);
    renderPulse(articles);

    setStatus("EN DIRECT");
  } catch (e) {
    console.error(e);
    setStatus("Erreur");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  SITE.setupMenu();
  SITE.observeReveals();

  chargerActualites();

  setInterval(() => {
    chargerActualites();
  }, 120000);
});
