const SITE = (() => {
  const compactFormatter = new Intl.NumberFormat("fr-FR", {
    notation: "compact",
    maximumFractionDigits: 1,
  });
  const numberFormatter = new Intl.NumberFormat("fr-FR");
  const currencyCache = new Map();
  let revealObserver = null;

  function escapeHTML(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function safeUrl(url, fallback = "#") {
    try {
      const parsed = new URL(url);
      if (parsed.protocol === "http:" || parsed.protocol === "https:") {
        return parsed.toString();
      }
    } catch (error) {
      return fallback;
    }

    return fallback;
  }

  function formatNumber(value) {
    if (!Number.isFinite(value)) {
      return "--";
    }

    return numberFormatter.format(value);
  }

  function formatCompact(value) {
    if (!Number.isFinite(value)) {
      return "--";
    }

    return compactFormatter.format(value);
  }

  function formatCurrency(value, currency = "USD", maximumFractionDigits = 2) {
    if (!Number.isFinite(value)) {
      return "--";
    }

    const key = `${currency}-${maximumFractionDigits}`;

    if (!currencyCache.has(key)) {
      currencyCache.set(
        key,
        new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency,
          maximumFractionDigits,
        }),
      );
    }

    return currencyCache.get(key).format(value);
  }

  function formatPercent(value) {
    if (!Number.isFinite(value)) {
      return "--";
    }

    const sign = value > 0 ? "+" : "";
    return `${sign}${new Intl.NumberFormat("fr-FR", {
      maximumFractionDigits: 2,
    }).format(value)}%`;
  }

  function formatRelativeTime(dateInput) {
    const date = new Date(dateInput);

    if (Number.isNaN(date.getTime())) {
      return "--";
    }

    const diff = Math.round((date.getTime() - Date.now()) / 60000);
    const formatter = new Intl.RelativeTimeFormat("fr", { numeric: "auto" });

    if (Math.abs(diff) < 60) {
      return formatter.format(diff, "minute");
    }

    const hours = Math.round(diff / 60);

    if (Math.abs(hours) < 24) {
      return formatter.format(hours, "hour");
    }

    return formatter.format(Math.round(hours / 24), "day");
  }

  function setStatus(element, message, type = "neutral") {
    if (!element) {
      return;
    }

    element.textContent = message;
    element.className = `status-pill status-${type}`;
  }

  async function fetchJSON(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), options.timeout ?? 12000);

    try {
      const response = await fetch(url, {
        method: options.method,
        body: options.body,
        signal: controller.signal,
        headers: options.headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  function enhanceFooter() {
    const footerInner = document.querySelector(".site-footer .footer-inner");

    if (!footerInner || footerInner.dataset.enhanced === "true") {
      return;
    }

    const utility = document.createElement("div");
    utility.className = "footer-utility";
    utility.innerHTML = `
      <div class="footer-links">
        <a href="./blog.html">Blog</a>
        <a href="./scolaire.html">Scolaire</a>
        <a href="./sports.html">Paris sportifs</a>
        <a href="./jeux.html">Jeux</a>
        <a href="./satellites.html">Satellites</a>
        <a href="./planetes.html">Planetes</a>
        <a href="./publicite.html">Publicite</a>
        <a href="./contact.html">Contact</a>
        <a href="./mentions-legales.html">Mentions legales</a>
        <a href="./confidentialite.html">Confidentialite</a>
      </div>
      <div class="social-mini">
        <a href="https://www.youtube.com/" target="_blank" rel="noreferrer">YouTube</a>
        <a href="https://www.tiktok.com/" target="_blank" rel="noreferrer">TikTok</a>
        <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">Instagram</a>
        <a href="https://www.facebook.com/" target="_blank" rel="noreferrer">Facebook</a>
        <a href="https://familialcanal.blogspot.com/" target="_blank" rel="noreferrer">Blogger</a>
      </div>
    `;

    footerInner.appendChild(utility);
    footerInner.dataset.enhanced = "true";
  }

  function setupCookieBanner() {
    const storageKey = "sng_cookie_choice";

    if (localStorage.getItem(storageKey) || document.querySelector(".cookie-banner")) {
      return;
    }

    const banner = document.createElement("aside");
    banner.className = "cookie-banner";
    banner.innerHTML = `
      <div class="cookie-copy">
        <strong>Cookies et confidentialite</strong>
        <p>
          SNG Portal peut utiliser des cookies pour le fonctionnement du site, la
          mesure d'audience, la newsletter et, si active plus tard, la publicite.
          Tu peux accepter ou refuser.
        </p>
      </div>
      <div class="cookie-actions">
        <button type="button" class="button button-solid" data-cookie-choice="accept">
          Accepter
        </button>
        <button type="button" class="ghost-button" data-cookie-choice="reject">
          Refuser
        </button>
        <a class="quick-chip" href="./confidentialite.html">Voir la politique</a>
      </div>
    `;

    banner.querySelectorAll("[data-cookie-choice]").forEach((button) => {
      button.addEventListener("click", () => {
        localStorage.setItem(storageKey, button.dataset.cookieChoice);
        banner.remove();
      });
    });

    document.body.appendChild(banner);
  }

  function setupMenu() {
    const toggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector("#main-nav");

    enhanceFooter();
    setupCookieBanner();

    if (!toggle || !nav || nav.dataset.bound === "true") {
      return;
    }

    nav.dataset.bound = "true";

    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.addEventListener("click", (event) => {
      if (event.target.matches("a")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  function buildRevealObserver() {
    if (!("IntersectionObserver" in window)) {
      return null;
    }

    return new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 },
    );
  }

  function observeReveals() {
    if (!revealObserver) {
      revealObserver = buildRevealObserver();
    }

    document.querySelectorAll(".reveal:not([data-reveal-bound])").forEach((item) => {
      item.setAttribute("data-reveal-bound", "true");

      if (!revealObserver) {
        item.classList.add("is-visible");
        return;
      }

      revealObserver.observe(item);
    });
  }

  return {
    escapeHTML,
    fetchJSON,
    formatCompact,
    formatCurrency,
    formatNumber,
    formatPercent,
    formatRelativeTime,
    observeReveals,
    safeUrl,
    setStatus,
    setupMenu,
    setupCookieBanner,
  };
})();

document.addEventListener("DOMContentLoaded", () => {
  SITE.setupMenu();
  SITE.observeReveals();
});
