function setupSearch() {
  const form = document.querySelector("#portal-search-form");
  const input = document.querySelector("#portal-search");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const query = input.value.trim().toLowerCase();
    const normalizedQuery = query.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    if (!query) {
      input.focus();
      return;
    }

    if (query.includes("crypto") || query.includes("bitcoin") || query.includes("ethereum")) {
      window.location.href = "./crypto.html";
      return;
    }

    if (query.includes("contact") || query.includes("email") || query.includes("partenariat")) {
      window.location.href = "./contact.html";
      return;
    }

    if (
      normalizedQuery.includes("scolaire") ||
      normalizedQuery.includes("ecole") ||
      normalizedQuery.includes("college") ||
      normalizedQuery.includes("lycee") ||
      normalizedQuery.includes("universite") ||
      normalizedQuery.includes("etudiant") ||
      normalizedQuery.includes("eleve") ||
      normalizedQuery.includes("devoir") ||
      normalizedQuery.includes("revision") ||
      normalizedQuery.includes("examen") ||
      normalizedQuery.includes("cours") ||
      normalizedQuery.includes("memoire") ||
      normalizedQuery.includes("bac")
    ) {
      window.location.href = "./scolaire.html";
      return;
    }

    if (query.includes("blog") || query.includes("article") || query.includes("seo")) {
      window.location.href = "./blog.html";
      return;
    }

    if (query.includes("blogger") || query.includes("familial canal")) {
      window.location.href = "https://familialcanal.blogspot.com/";
      return;
    }

    if (query.includes("tendance") || query.includes("viral") || query.includes("artiste")) {
      window.location.href = "./blog.html#tendances-zone";
      return;
    }

    if (
      query.includes("actualite") ||
      query.includes("news") ||
      query.includes("breaking") ||
      query.includes("aujourd") ||
      query.includes("monde") ||
      query.includes("guerre") ||
      query.includes("politique")
    ) {
      window.location.href = "./actualites.html";
      return;
    }

    if (query.includes("meteo") || query.includes("temperature") || query.includes("pluie")) {
      window.location.href = "./meteo.html";
      return;
    }

    if (
      query.includes("sport") ||
      query.includes("pari") ||
      query.includes("football") ||
      query.includes("nba") ||
      query.includes("nfl") ||
      query.includes("match")
    ) {
      window.location.href = "./sports.html";
      return;
    }

    if (
      query.includes("loterie") ||
      query.includes("quiniela") ||
      query.includes("tripleta") ||
      query.includes("powerball") ||
      query.includes("mega millions") ||
      query.includes("euromillions") ||
      query.includes("lotto max") ||
      query.includes("superenalotto")
    ) {
      window.location.href = "./loterie.html";
      return;
    }

    if (
      query.includes("jeu") ||
      query.includes("games") ||
      query.includes("steam") ||
      query.includes("counter") ||
      query.includes("dota") ||
      query.includes("mobile") ||
      query.includes("playstation") ||
      query.includes("xbox") ||
      query.includes("switch")
    ) {
      window.location.href = "./jeux.html";
      return;
    }

    if (
      query.includes("satellite") ||
      query.includes("satellites") ||
      query.includes("espace") ||
      query.includes("orbite") ||
      query.includes("nasa")
    ) {
      window.location.href = "./satellites.html";
      return;
    }

    if (
      query.includes("planete") ||
      query.includes("planetes") ||
      query.includes("systeme solaire") ||
      query.includes("asteroide")
    ) {
      window.location.href = "./planetes.html";
      return;
    }

    if (query.includes("pub") || query.includes("adsense") || query.includes("amazon")) {
      window.location.href = "./publicite.html";
      return;
    }

    if (query.includes("youtube") || query.includes("tiktok") || query.includes("instagram")) {
      window.location.href = "./contact.html";
      return;
    }

    if (query.includes("cookie") || query.includes("confidentialite") || query.includes("rgpd")) {
      window.location.href = "./confidentialite.html";
      return;
    }

    if (query.includes("mentions") || query.includes("legal")) {
      window.location.href = "./mentions-legales.html";
      return;
    }

    if (
      query.includes("marche") ||
      query.includes("prix") ||
      query.includes("dollar") ||
      query.includes("euro") ||
      query.includes("dop") ||
      query.includes("peso dominicain") ||
      query.includes("change") ||
      query.includes("monnaie") ||
      query.includes("devise") ||
      query.includes("transfert") ||
      query.includes("envoi d'argent") ||
      query.includes("envoi argent")
    ) {
      window.location.href = "./marches.html";
      return;
    }

    window.location.href = "./actualites.html";
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

document.addEventListener("DOMContentLoaded", () => {
  SITE.setupMenu();
  SITE.observeReveals();
  setupSearch();
  setupHomeNewsletter();
});
