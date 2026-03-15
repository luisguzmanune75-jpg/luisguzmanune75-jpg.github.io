const marketCoins = [
  { id: "bitcoin", label: "Bitcoin", symbol: "BTC" },
  { id: "ethereum", label: "Ethereum", symbol: "ETH" },
  { id: "solana", label: "Solana", symbol: "SOL" },
  { id: "tether", label: "Tether", symbol: "USDT" },
  { id: "binancecoin", label: "BNB", symbol: "BNB" },
];

const preferredCurrencies = [
  "EUR",
  "USD",
  "DOP",
  "CAD",
  "GBP",
  "CHF",
  "HTG",
  "MXN",
  "BRL",
  "JPY",
  "AED",
  "XOF",
  "XAF",
];

const quickTargetCurrencies = ["DOP", "USD", "EUR", "CAD", "GBP", "HTG", "MXN", "BRL"];

const transferPresets = [
  { from: "EUR", to: "DOP", label: "EUR -> DOP" },
  { from: "USD", to: "DOP", label: "USD -> DOP" },
  { from: "CAD", to: "DOP", label: "CAD -> DOP" },
  { from: "EUR", to: "USD", label: "EUR -> USD" },
  { from: "USD", to: "EUR", label: "USD -> EUR" },
  { from: "EUR", to: "HTG", label: "EUR -> HTG" },
];

const rateCache = new Map();

const marketState = {
  prices: null,
  currencies: {},
  sortedCurrencyCodes: [],
  activeRates: {},
  from: "EUR",
  to: "DOP",
  amount: 100,
  feePercent: 2,
  search: "",
  fxDate: "",
  loadedAt: null,
};

function normalizeMarketText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function formatCurrencySafe(value, currency, maximumFractionDigits = 2) {
  if (!Number.isFinite(value)) {
    return "--";
  }

  try {
    return SITE.formatCurrency(value, currency, maximumFractionDigits);
  } catch (error) {
    return `${SITE.formatNumber(value)} ${currency}`;
  }
}

function formatRate(value) {
  if (!Number.isFinite(value)) {
    return "--";
  }

  return new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: value >= 100 ? 2 : value >= 1 ? 4 : 6,
  }).format(value);
}

function formatPercentPlain(value) {
  if (!Number.isFinite(value)) {
    return "--";
  }

  return `${new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 2,
  }).format(value)}%`;
}

function currencyName(code) {
  return marketState.currencies[String(code ?? "").toLowerCase()] ?? code;
}

function currencyLabel(code) {
  return `${code} - ${currencyName(code)}`;
}

function buildSortedCurrencyCodes() {
  const codes = Object.keys(marketState.currencies).map((code) => code.toUpperCase());

  codes.sort((left, right) => {
    const leftIndex = preferredCurrencies.indexOf(left);
    const rightIndex = preferredCurrencies.indexOf(right);

    if (leftIndex !== -1 || rightIndex !== -1) {
      if (leftIndex === -1) {
        return 1;
      }

      if (rightIndex === -1) {
        return -1;
      }

      return leftIndex - rightIndex;
    }

    return currencyLabel(left).localeCompare(currencyLabel(right), "fr", { sensitivity: "base" });
  });

  return codes;
}

function normalizeSelectedCurrencies() {
  if (!marketState.sortedCurrencyCodes.includes(marketState.from)) {
    marketState.from = marketState.sortedCurrencyCodes.includes("EUR")
      ? "EUR"
      : marketState.sortedCurrencyCodes[0] ?? "EUR";
  }

  if (!marketState.sortedCurrencyCodes.includes(marketState.to) || marketState.to === marketState.from) {
    marketState.to = marketState.sortedCurrencyCodes.includes("DOP") && marketState.from !== "DOP"
      ? "DOP"
      : marketState.sortedCurrencyCodes.find((code) => code !== marketState.from) ?? "USD";
  }
}

function buildFxUrls(path) {
  return [
    `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/${path}.min.json`,
    `https://latest.currency-api.pages.dev/v1/${path}.min.json`,
    `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/${path}.json`,
    `https://latest.currency-api.pages.dev/v1/${path}.json`,
  ];
}

async function fetchFxJSON(path) {
  let lastError = null;

  for (const url of buildFxUrls(path)) {
    try {
      return await SITE.fetchJSON(url);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError ?? new Error("fx-unavailable");
}

async function fetchCurrencyDirectory(force = false) {
  if (!force && Object.keys(marketState.currencies).length) {
    return marketState.currencies;
  }

  const currencies = await fetchFxJSON("currencies");
  marketState.currencies = currencies ?? {};
  marketState.sortedCurrencyCodes = buildSortedCurrencyCodes();
  normalizeSelectedCurrencies();
  return marketState.currencies;
}

async function fetchBaseRates(baseCode, force = false) {
  const base = String(baseCode ?? "").toLowerCase();

  if (!force && rateCache.has(base)) {
    return rateCache.get(base);
  }

  const payload = await fetchFxJSON(`currencies/${base}`);
  const entry = {
    date: payload?.date ?? "",
    rates: payload?.[base] ?? {},
  };

  rateCache.set(base, entry);
  return entry;
}

function readNumberInput(selector, fallback) {
  const value = Number(document.querySelector(selector)?.value);
  return Number.isFinite(value) && value >= 0 ? value : fallback;
}

function readTransferInputs() {
  const fromValue = String(document.querySelector("#transfer-from")?.value ?? marketState.from).toUpperCase();
  const toValue = String(document.querySelector("#transfer-to")?.value ?? marketState.to).toUpperCase();

  marketState.amount = readNumberInput("#transfer-amount", marketState.amount);
  marketState.feePercent = Math.min(readNumberInput("#transfer-fee", marketState.feePercent), 25);
  marketState.from = marketState.sortedCurrencyCodes.includes(fromValue) ? fromValue : marketState.from;
  marketState.to = marketState.sortedCurrencyCodes.includes(toValue) ? toValue : marketState.to;

  if (marketState.from === marketState.to) {
    marketState.to = marketState.sortedCurrencyCodes.find((code) => code !== marketState.from) ?? marketState.to;
  }
}

function syncTransferInputs() {
  const amountInput = document.querySelector("#transfer-amount");
  const feeInput = document.querySelector("#transfer-fee");
  const fromSelect = document.querySelector("#transfer-from");
  const toSelect = document.querySelector("#transfer-to");

  if (amountInput) {
    amountInput.value = String(marketState.amount);
  }

  if (feeInput) {
    feeInput.value = String(marketState.feePercent);
  }

  if (fromSelect) {
    fromSelect.value = marketState.from;
  }

  if (toSelect) {
    toSelect.value = marketState.to;
  }
}

function currentRate() {
  return Number(marketState.activeRates?.[marketState.to.toLowerCase()] ?? NaN);
}

function transferMetrics() {
  const rate = currentRate();
  const amount = Number(marketState.amount);
  const feePercent = Number(marketState.feePercent);
  const feeAmount = amount * (feePercent / 100);
  const totalDebited = amount + feeAmount;
  const pureReceived = amount * rate;
  const receivedIfDeducted = Math.max(amount - feeAmount, 0) * rate;

  return {
    rate,
    amount,
    feePercent,
    feeAmount,
    totalDebited,
    pureReceived,
    receivedIfDeducted,
    inverseRate: Number.isFinite(rate) && rate !== 0 ? 1 / rate : NaN,
  };
}

function populateCurrencySelects() {
  const fromSelect = document.querySelector("#transfer-from");
  const toSelect = document.querySelector("#transfer-to");

  if (!fromSelect || !toSelect) {
    return;
  }

  const optionMarkup = marketState.sortedCurrencyCodes
    .map((code) => `<option value="${SITE.escapeHTML(code)}">${SITE.escapeHTML(currencyLabel(code))}</option>`)
    .join("");

  fromSelect.innerHTML = optionMarkup;
  toSelect.innerHTML = optionMarkup;
  syncTransferInputs();
}

function renderPulse() {
  const root = document.querySelector("#market-pulse");
  const metrics = transferMetrics();

  root.innerHTML = `
    <div class="pulse-card">
      <span>Couloir</span>
      <strong>${SITE.escapeHTML(`${marketState.from} -> ${marketState.to}`)}</strong>
      <p>${SITE.escapeHTML(currencyName(marketState.to))}</p>
    </div>
    <div class="pulse-card">
      <span>Taux</span>
      <strong>${Number.isFinite(metrics.rate) ? SITE.escapeHTML(formatRate(metrics.rate)) : "--"}</strong>
      <p>1 ${SITE.escapeHTML(marketState.from)} = ${Number.isFinite(metrics.rate) ? SITE.escapeHTML(formatRate(metrics.rate)) : "--"} ${SITE.escapeHTML(marketState.to)}</p>
    </div>
    <div class="pulse-card">
      <span>Recu</span>
      <strong>${formatCurrencySafe(metrics.pureReceived, marketState.to, metrics.pureReceived > 10 ? 2 : 4)}</strong>
      <p>Sans deduction de frais du principal</p>
    </div>
    <div class="pulse-card">
      <span>Source</span>
      <strong>${SITE.escapeHTML(String(marketState.sortedCurrencyCodes.length || "--"))}</strong>
      <p>${marketState.fxDate ? `Date source ${SITE.escapeHTML(marketState.fxDate)}` : "Date source en attente"}</p>
    </div>
  `;
}

function renderTransferQuickPairs() {
  const root = document.querySelector("#transfer-quick-pairs");

  root.innerHTML = transferPresets
    .map((pair) => {
      const isActive = pair.from === marketState.from && pair.to === marketState.to;

      return `
        <button
          class="pill-button ${isActive ? "is-active" : ""}"
          type="button"
          data-from="${SITE.escapeHTML(pair.from)}"
          data-to="${SITE.escapeHTML(pair.to)}"
        >
          ${SITE.escapeHTML(pair.label)}
        </button>
      `;
    })
    .join("");

  root.querySelectorAll("[data-from][data-to]").forEach((button) => {
    button.addEventListener("click", async () => {
      marketState.from = String(button.dataset.from ?? marketState.from).toUpperCase();
      marketState.to = String(button.dataset.to ?? marketState.to).toUpperCase();
      syncTransferInputs();
      await refreshFxBase();
    });
  });
}

function renderTransferSummary() {
  const root = document.querySelector("#transfer-summary");
  const metrics = transferMetrics();

  if (!Number.isFinite(metrics.rate)) {
    root.innerHTML = '<div class="empty-state">Le taux de change n\'est pas encore charge.</div>';
    return;
  }

  root.innerHTML = `
    <div class="summary-card">
      <span>Montant envoye</span>
      <strong>${formatCurrencySafe(metrics.amount, marketState.from, 2)}</strong>
      <p>Somme de depart saisie dans le formulaire.</p>
    </div>
    <div class="summary-card">
      <span>Taux direct</span>
      <strong>1 ${SITE.escapeHTML(marketState.from)} = ${SITE.escapeHTML(formatRate(metrics.rate))} ${SITE.escapeHTML(marketState.to)}</strong>
      <p>Inverse: 1 ${SITE.escapeHTML(marketState.to)} = ${SITE.escapeHTML(formatRate(metrics.inverseRate))} ${SITE.escapeHTML(marketState.from)}</p>
    </div>
    <div class="summary-card">
      <span>Montant recu</span>
      <strong>${formatCurrencySafe(metrics.pureReceived, marketState.to, metrics.pureReceived > 10 ? 2 : 4)}</strong>
      <p>Estimation au taux indicatif sans deduction sur le principal.</p>
    </div>
    <div class="summary-card">
      <span>Frais estimes</span>
      <strong>${formatCurrencySafe(metrics.feeAmount, marketState.from, 2)}</strong>
      <p>${SITE.escapeHTML(formatPercentPlain(metrics.feePercent))} appliques comme simulation.</p>
    </div>
    <div class="summary-card">
      <span>Total paye</span>
      <strong>${formatCurrencySafe(metrics.totalDebited, marketState.from, 2)}</strong>
      <p>Scenario ou l'operateur ajoute les frais au montant envoye.</p>
    </div>
    <div class="summary-card">
      <span>Recu si frais deduits</span>
      <strong>${formatCurrencySafe(metrics.receivedIfDeducted, marketState.to, metrics.receivedIfDeducted > 10 ? 2 : 4)}</strong>
      <p>Scenario ou les frais sont retires du principal avant conversion.</p>
    </div>
  `;
}

function renderFX() {
  const root = document.querySelector("#fx-board");

  if (!Object.keys(marketState.activeRates).length) {
    root.innerHTML = `<div class="empty-state">Taux indisponibles pour le moment.</div>`;
    return;
  }

  const targets = [...new Set([marketState.to, ...quickTargetCurrencies])]
    .filter((code) => code !== marketState.from)
    .filter((code) => Number.isFinite(Number(marketState.activeRates?.[code.toLowerCase()] ?? NaN)))
    .slice(0, 8);

  root.innerHTML = targets
    .map((code) => {
      const rate = Number(marketState.activeRates?.[code.toLowerCase()] ?? NaN);
      const received = marketState.amount * rate;

      return `
        <div class="fx-card fx-card-rich">
          <span>${SITE.escapeHTML(`${marketState.from} / ${code}`)}</span>
          <strong>${SITE.escapeHTML(formatRate(rate))}</strong>
          <p>${formatCurrencySafe(received, code, received > 10 ? 2 : 4)} pour ${formatCurrencySafe(marketState.amount, marketState.from, 2)}</p>
        </div>
      `;
    })
    .join("");
}

function renderBriefing() {
  const root = document.querySelector("#market-briefing");
  const metrics = transferMetrics();

  root.innerHTML = `
    <h3>Lecture rapide</h3>
    <p>
      Tu envoies <strong>${formatCurrencySafe(metrics.amount, marketState.from, 2)}</strong>
      vers <strong>${SITE.escapeHTML(currencyName(marketState.to))}</strong>.
      Au taux charge dans la page, cela donne environ
      <strong>${formatCurrencySafe(metrics.pureReceived, marketState.to, metrics.pureReceived > 10 ? 2 : 4)}</strong>.
    </p>
    <p>
      La simulation ajoute aussi des frais a
      <strong>${SITE.escapeHTML(formatPercentPlain(metrics.feePercent))}</strong>
      pour montrer ce que le destinataire peut recevoir selon la methode de facturation.
    </p>
    <p>
      Ces taux restent indicatifs: les services d'envoi d'argent appliquent souvent
      leur propre marge et parfois des frais fixes en plus.
    </p>
  `;
}

function renderSourceCard() {
  const root = document.querySelector("#source-card");

  root.innerHTML = `
    <h3>Source et couverture</h3>
    <p>
      Devises chargees dans la page:
      <strong>${SITE.escapeHTML(String(marketState.sortedCurrencyCodes.length || 0))}</strong>.
    </p>
    <p>
      Base active:
      <strong>${SITE.escapeHTML(currencyLabel(marketState.from))}</strong>.
    </p>
    <p>
      Date source:
      <strong>${marketState.fxDate ? SITE.escapeHTML(marketState.fxDate) : "--"}</strong>.
    </p>
    <p>
      Derniere synchro locale:
      <strong>${marketState.loadedAt ? SITE.escapeHTML(SITE.formatRelativeTime(marketState.loadedAt)) : "--"}</strong>.
    </p>
  `;
}

function renderCurrencyDirectory() {
  const status = document.querySelector("#currency-directory-status");
  const root = document.querySelector("#currency-directory");
  const normalizedSearch = normalizeMarketText(marketState.search);

  if (!marketState.sortedCurrencyCodes.length) {
    status.innerHTML = "";
    root.innerHTML = '<div class="empty-state">Aucune devise chargee.</div>';
    return;
  }

  const entries = marketState.sortedCurrencyCodes
    .filter((code) => code !== marketState.from)
    .filter((code) => Number.isFinite(Number(marketState.activeRates?.[code.toLowerCase()] ?? NaN)))
    .filter((code) => {
      if (!normalizedSearch) {
        return true;
      }

      return normalizeMarketText(`${code} ${currencyName(code)}`).includes(normalizedSearch);
    })
    .slice(0, 80);

  status.innerHTML = `
    <span class="tag-chip">${SITE.escapeHTML(String(entries.length))} devises visibles</span>
    <span class="tag-chip">Base ${SITE.escapeHTML(marketState.from)}</span>
  `;

  if (!entries.length) {
    root.innerHTML = '<div class="empty-state">Aucune devise ne correspond a ce filtre.</div>';
    return;
  }

  root.innerHTML = entries
    .map((code) => {
      const rate = Number(marketState.activeRates?.[code.toLowerCase()] ?? NaN);
      const received = marketState.amount * rate;

      return `
        <button
          class="currency-row ${code === marketState.to ? "is-active" : ""}"
          type="button"
          data-currency-code="${SITE.escapeHTML(code)}"
        >
          <div class="currency-row-main">
            <strong>${SITE.escapeHTML(code)}</strong>
            <span>${SITE.escapeHTML(currencyName(code))}</span>
          </div>
          <div class="currency-row-values">
            <strong>1 ${SITE.escapeHTML(marketState.from)} = ${SITE.escapeHTML(formatRate(rate))} ${SITE.escapeHTML(code)}</strong>
            <span>${formatCurrencySafe(received, code, received > 10 ? 2 : 4)}</span>
          </div>
        </button>
      `;
    })
    .join("");

  root.querySelectorAll("[data-currency-code]").forEach((button) => {
    button.addEventListener("click", async () => {
      marketState.to = String(button.dataset.currencyCode ?? marketState.to).toUpperCase();
      syncTransferInputs();
      renderTransferQuickPairs();
      renderTransferSummary();
      renderPulse();
      renderFX();
      renderBriefing();
      renderSourceCard();
      renderCurrencyDirectory();
    });
  });
}

function renderMarketBoard() {
  const root = document.querySelector("#market-board");

  if (!marketState.prices) {
    root.innerHTML = `<div class="empty-state">Aucun prix crypto charge.</div>`;
    return;
  }

  root.innerHTML = marketCoins
    .map((coin) => {
      const data = marketState.prices[coin.id];

      if (!data) {
        return "";
      }

      return `
        <div class="market-row">
          <div>
            <strong>${SITE.escapeHTML(coin.symbol)}</strong>
            <span>${SITE.escapeHTML(coin.label)}</span>
          </div>
          <div class="market-values">
            <strong>${SITE.formatCurrency(data.usd, "USD", data.usd > 10 ? 0 : 4)}</strong>
            <span class="${data.usd_24h_change >= 0 ? "up" : "down"}">
              ${SITE.formatPercent(data.usd_24h_change)}
            </span>
          </div>
        </div>
      `;
    })
    .join("");
}

async function loadCryptoPrices() {
  try {
    marketState.prices = await SITE.fetchJSON(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,tether,binancecoin&vs_currencies=usd,eur&include_24hr_change=true",
    );
  } catch (error) {
    marketState.prices = null;
  }
}

function renderAll() {
  populateCurrencySelects();
  syncTransferInputs();
  renderPulse();
  renderTransferQuickPairs();
  renderTransferSummary();
  renderFX();
  renderBriefing();
  renderSourceCard();
  renderCurrencyDirectory();
  renderMarketBoard();
}

async function refreshFxBase(force = false) {
  readTransferInputs();
  SITE.setStatus(document.querySelector("#market-status"), "Chargement du change", "neutral");

  try {
    const payload = await fetchBaseRates(marketState.from, force);

    marketState.activeRates = payload.rates ?? {};
    marketState.fxDate = payload.date ?? "";
    marketState.loadedAt = new Date().toISOString();
    renderAll();
    SITE.setStatus(
      document.querySelector("#market-status"),
      marketState.fxDate ? `Source ${marketState.fxDate}` : `Maj ${SITE.formatRelativeTime(marketState.loadedAt)}`,
      "live",
    );
  } catch (error) {
    renderAll();
    SITE.setStatus(document.querySelector("#market-status"), "Taux indisponibles", "error");
  }
}

async function loadMarkets(force = false) {
  SITE.setStatus(document.querySelector("#market-status"), "Chargement des devises", "neutral");

  try {
    await fetchCurrencyDirectory(force);
    await Promise.all([refreshFxBase(force), loadCryptoPrices()]);
    renderMarketBoard();
  } catch (error) {
    renderAll();
    SITE.setStatus(document.querySelector("#market-status"), "Donnees indisponibles", "error");
  }
}

function setupTransferForm() {
  const form = document.querySelector("#transfer-form");
  const swapButton = document.querySelector("#swap-transfer");
  const filterInput = document.querySelector("#currency-filter");
  const fromSelect = document.querySelector("#transfer-from");
  const toSelect = document.querySelector("#transfer-to");
  const amountInput = document.querySelector("#transfer-amount");
  const feeInput = document.querySelector("#transfer-fee");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    await refreshFxBase();
  });

  swapButton.addEventListener("click", async () => {
    const previousFrom = marketState.from;
    marketState.from = marketState.to;
    marketState.to = previousFrom;
    syncTransferInputs();
    await refreshFxBase();
  });

  fromSelect.addEventListener("change", async () => {
    await refreshFxBase();
  });

  toSelect.addEventListener("change", async () => {
    readTransferInputs();
    renderAll();
  });

  amountInput.addEventListener("input", () => {
    readTransferInputs();
    renderAll();
  });

  feeInput.addEventListener("input", () => {
    readTransferInputs();
    renderAll();
  });

  filterInput.addEventListener("input", () => {
    marketState.search = filterInput.value.trim();
    renderCurrencyDirectory();
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  SITE.setupMenu();
  SITE.observeReveals();
  renderPulse();
  renderTransferSummary();
  renderFX();
  renderBriefing();
  renderSourceCard();
  renderCurrencyDirectory();
  renderMarketBoard();
  setupTransferForm();
  await loadMarkets();
  window.setInterval(() => {
    refreshFxBase(true);
    loadCryptoPrices().then(renderMarketBoard);
  }, 180000);
});
