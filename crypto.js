const cryptoFilters = [
  { id: "all", label: "Tout" },
  { id: "reserve", label: "Reserve" },
  { id: "smart", label: "Smart contracts" },
  { id: "payments", label: "Paiements" },
  { id: "stablecoin", label: "Stablecoins" },
];

const cryptoProfiles = [
  {
    id: "bitcoin",
    category: "reserve",
    title: "Bitcoin",
    symbol: "BTC",
    focus: "Reserve numerique",
    summary: "Repere principal du marche et reserve numerique la plus connue.",
    description:
      "Bitcoin sert souvent de point d'entree et de repere macro. Son poids narratif et institutionnel reste central.",
    useCases: [
      "Reserve de valeur long terme",
      "Actif de reference du marche",
      "Transferts internationaux",
    ],
    strengths: [
      "Narration simple",
      "Marque la plus forte",
      "Liquidite mondiale elevee",
    ],
    risks: [
      "Volatilite forte",
      "Reaction aux cycles macro",
      "Moins flexible pour les apps",
    ],
    metrics: { adoption: 96, utilite: 78, robustesse: 95, risque: 64 },
  },
  {
    id: "ethereum",
    category: "smart",
    title: "Ethereum",
    symbol: "ETH",
    focus: "Infrastructure web3",
    summary: "Base majeure pour la DeFi, les tokens et les applications on-chain.",
    description:
      "Ethereum structure un grand nombre de services web3. Son ecosysteme reste tres dense.",
    useCases: [
      "Applications decentralisees",
      "Protocoles DeFi",
      "Tokenisation d'actifs",
    ],
    strengths: [
      "Ecosysteme large",
      "Standards reconnus",
      "Legitimite forte",
    ],
    risks: [
      "Frais variables",
      "Concurrence des autres layers",
      "Complexite pour debutants",
    ],
    metrics: { adoption: 92, utilite: 95, robustesse: 88, risque: 58 },
  },
  {
    id: "solana",
    category: "smart",
    title: "Solana",
    symbol: "SOL",
    focus: "Performance et apps rapides",
    summary: "Forte vitesse, couts faibles et usage retail dynamique.",
    description:
      "Solana attire les experiences rapides, les interfaces grand public et les cycles de forte activite.",
    useCases: [
      "Apps a haute frequence",
      "Trading actif",
      "Micro-paiements",
    ],
    strengths: [
      "Transactions rapides",
      "Couts faibles",
      "Narratif retail fort",
    ],
    risks: [
      "Cycle tres sensible",
      "Concurrence agressive",
      "Profil plus speculatif",
    ],
    metrics: { adoption: 82, utilite: 87, robustesse: 72, risque: 74 },
  },
  {
    id: "ripple",
    category: "payments",
    title: "XRP",
    symbol: "XRP",
    focus: "Paiements rapides",
    summary: "Actif souvent lie aux paiements et aux transferts transfrontaliers.",
    description:
      "XRP garde une place visible sur les sujets de paiement, remittance et infrastructure de transfert.",
    useCases: [
      "Paiements quasi instantanes",
      "Flux transfrontaliers",
      "Passerelle entre devises",
    ],
    strengths: [
      "Narration claire",
      "Transactions rapides",
      "Bonne notoriete",
    ],
    risks: [
      "Sensibilite reglementaire",
      "Ecosysteme plus etroit",
      "Moins d'usages grand public",
    ],
    metrics: { adoption: 74, utilite: 84, robustesse: 70, risque: 62 },
  },
  {
    id: "tether",
    category: "stablecoin",
    title: "Tether",
    symbol: "USDT",
    focus: "Stablecoin de liquidite",
    summary: "Outil central pour trader, transferer et garder une valeur stable.",
    description:
      "Tether sert de base de liquidite et de monnaie de passage sur une grande partie du marche crypto.",
    useCases: [
      "Protection temporaire contre la volatilite",
      "Transfers rapides entre plateformes",
      "Base de liquidite pour trader",
    ],
    strengths: [
      "Usage mondial fort",
      "Utilite tres concrete",
      "Presence multi-chain",
    ],
    risks: [
      "Questions reglementaires",
      "Confiance sur les reserves",
      "Moins de potentiel speculatif",
    ],
    metrics: { adoption: 90, utilite: 95, robustesse: 79, risque: 44 },
  },
  {
    id: "binancecoin",
    category: "smart",
    title: "BNB",
    symbol: "BNB",
    focus: "Utility et ecosysteme exchange",
    summary: "Actif relie a un ecosysteme produit et a des usages frequents.",
    description:
      "BNB s'appuie sur un environnement tres integre qui melange usage, produit et accessibilite retail.",
    useCases: [
      "Reduction de frais",
      "Interaction avec des apps",
      "Usage retail recurrent",
    ],
    strengths: [
      "Utilite recurrente",
      "Ecosysteme visible",
      "Adoption retail solide",
    ],
    risks: [
      "Dependance a son environnement",
      "Risque reglementaire",
      "Narratif moins universel que BTC",
    ],
    metrics: { adoption: 81, utilite: 86, robustesse: 77, risque: 57 },
  },
];

const countryMetrics = [
  { id: "adoption", label: "Adoption" },
  { id: "trading", label: "Trading" },
  { id: "innovation", label: "Innovation" },
];

const countryProfiles = [
  {
    id: "singapore",
    name: "Singapour",
    region: "Asie",
    adoption: 88,
    trading: 92,
    innovation: 95,
    summary: "Hub crypto fort pour fintech, licences et innovation.",
    bestFor: "Exchanges, fintech et institutionalisation",
    regulation: "Cadre plutot clair pour les acteurs serieux.",
    usage: "Trading, innovation fintech et implantation regionale.",
    tags: ["Fintech", "Institutionnels", "Licences", "Infrastructure"],
  },
  {
    id: "switzerland",
    name: "Suisse",
    region: "Europe",
    adoption: 82,
    trading: 84,
    innovation: 91,
    summary: "Zone forte sur tokenisation, finance et infrastructure.",
    bestFor: "Tokenisation et finance serieuse",
    regulation: "Environnement lisible pour les structures solides.",
    usage: "Gestion d'actifs, tokenisation et blockchain premium.",
    tags: ["Crypto Valley", "Finance", "Tokenisation", "Banques"],
  },
  {
    id: "uae",
    name: "Emirats arabes unis",
    region: "Moyen-Orient",
    adoption: 86,
    trading: 89,
    innovation: 87,
    summary: "Hub pro-business avec forte ambition regionale.",
    bestFor: "Implantation business et trading",
    regulation: "Approche proactive avec zones dediees.",
    usage: "Trading, paiements et implantation de marques.",
    tags: ["Dubai", "Business", "Trading", "Licences"],
  },
  {
    id: "usa",
    name: "Etats-Unis",
    region: "Amerique du Nord",
    adoption: 84,
    trading: 94,
    innovation: 93,
    summary: "Marche decisif pour liquidite, venture et produits institutionnels.",
    bestFor: "ETF, venture et marche profond",
    regulation: "Cadre complexe mais poids immense.",
    usage: "Liquidite, produits institutionnels et services grand public.",
    tags: ["ETF", "Venture", "Liquidite", "Startups"],
  },
  {
    id: "south-korea",
    name: "Coree du Sud",
    region: "Asie",
    adoption: 83,
    trading: 90,
    innovation: 82,
    summary: "Marche retail tres actif et rapide sur les tendances.",
    bestFor: "Retail trading et communautes fortes",
    regulation: "Marche surveille mais engage.",
    usage: "Trading actif et narratifs rapides.",
    tags: ["Retail", "Communautes", "Trading", "Tendances"],
  },
  {
    id: "nigeria",
    name: "Nigeria",
    region: "Afrique",
    adoption: 90,
    trading: 76,
    innovation: 74,
    summary: "Exemple fort d'usage quotidien et de transfert de valeur.",
    bestFor: "P2P, remittance et usage reel",
    regulation: "Cadre mouvant mais adoption terrain forte.",
    usage: "Paiements, mobile et peer-to-peer.",
    tags: ["P2P", "Remittance", "Usage reel", "Mobile"],
  },
];

const cryptoState = {
  filter: "all",
  selectedAssetId: "bitcoin",
  countryMetric: "adoption",
  selectedCountryId: "singapore",
  global: null,
  markets: [],
  trending: [],
  lastLoadedAt: null,
};

function getFilteredProfiles() {
  if (cryptoState.filter === "all") {
    return cryptoProfiles;
  }

  return cryptoProfiles.filter((profile) => profile.category === cryptoState.filter);
}

function getMarket(assetId) {
  return cryptoState.markets.find((entry) => entry.id === assetId);
}

function metricRow(label, value) {
  return `
    <div class="meter-row">
      <div class="meter-head">
        <span>${SITE.escapeHTML(label)}</span>
        <strong>${value}/100</strong>
      </div>
      <div class="meter-track">
        <span class="meter-fill" style="width: ${value}%"></span>
      </div>
    </div>
  `;
}

function renderFilterButtons() {
  const root = document.querySelector("#crypto-filters");

  root.innerHTML = cryptoFilters
    .map(
      (filter) => `
        <button
          class="pill-button ${filter.id === cryptoState.filter ? "is-active" : ""}"
          type="button"
          data-crypto-filter="${filter.id}"
        >
          ${SITE.escapeHTML(filter.label)}
        </button>
      `,
    )
    .join("");

  root.querySelectorAll("[data-crypto-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      cryptoState.filter = button.dataset.cryptoFilter;

      if (!getFilteredProfiles().some((profile) => profile.id === cryptoState.selectedAssetId)) {
        cryptoState.selectedAssetId = getFilteredProfiles()[0].id;
      }

      renderFilterButtons();
      renderAssetList();
      renderAssetDetail();
      renderBriefing();
    });
  });
}

function renderGlobalOverview() {
  const root = document.querySelector("#global-overview");
  const data = cryptoState.global?.data;

  if (!data) {
    root.innerHTML = `
      <div class="pulse-card"><span>Cryptoactifs</span><strong>--</strong><p>En attente</p></div>
      <div class="pulse-card"><span>Market cap</span><strong>--</strong><p>En attente</p></div>
      <div class="pulse-card"><span>Volume 24h</span><strong>--</strong><p>En attente</p></div>
      <div class="pulse-card"><span>BTC dominance</span><strong>--</strong><p>En attente</p></div>
    `;
    return;
  }

  root.innerHTML = `
    <div class="pulse-card">
      <span>Cryptoactifs</span>
      <strong>${SITE.formatCompact(data.active_cryptocurrencies)}</strong>
      <p>Nombre estime d'actifs suivis</p>
    </div>
    <div class="pulse-card">
      <span>Market cap</span>
      <strong>${SITE.formatCurrency(data.total_market_cap.usd, "USD", 0)}</strong>
      <p>Capitalisation globale</p>
    </div>
    <div class="pulse-card">
      <span>Volume 24h</span>
      <strong>${SITE.formatCurrency(data.total_volume.usd, "USD", 0)}</strong>
      <p>Volume mondial observe</p>
    </div>
    <div class="pulse-card">
      <span>BTC dominance</span>
      <strong>${SITE.formatPercent(data.market_cap_percentage.btc)}</strong>
      <p>Poids de Bitcoin dans le marche</p>
    </div>
  `;
}

function renderAssetList() {
  const root = document.querySelector("#asset-list");

  root.innerHTML = getFilteredProfiles()
    .map((profile) => {
      const market = getMarket(profile.id);

      return `
        <button
          class="asset-card ${profile.id === cryptoState.selectedAssetId ? "is-active" : ""}"
          type="button"
          data-asset-id="${profile.id}"
        >
          <div class="asset-card-top">
            <div>
              <strong>${SITE.escapeHTML(profile.title)}</strong>
              <span>${SITE.escapeHTML(profile.focus)}</span>
            </div>
            <span class="coin-badge">${SITE.escapeHTML(profile.symbol)}</span>
          </div>
          <p>${SITE.escapeHTML(profile.summary)}</p>
          <div class="asset-price-line">
            <strong>${market ? SITE.formatCurrency(market.current_price, "USD", market.current_price > 10 ? 0 : 4) : "--"}</strong>
            <span class="${market?.price_change_percentage_24h >= 0 ? "up" : "down"}">
              ${market ? SITE.formatPercent(market.price_change_percentage_24h) : "--"}
            </span>
          </div>
        </button>
      `;
    })
    .join("");

  root.querySelectorAll("[data-asset-id]").forEach((button) => {
    button.addEventListener("click", () => {
      cryptoState.selectedAssetId = button.dataset.assetId;
      renderAssetList();
      renderAssetDetail();
      renderBriefing();
    });
  });
}

function renderAssetDetail() {
  const root = document.querySelector("#asset-detail");
  const profile = cryptoProfiles.find((entry) => entry.id === cryptoState.selectedAssetId);
  const market = getMarket(profile.id);
  const totalMarketCap = cryptoState.global?.data?.total_market_cap?.usd || 0;
  const dominance =
    market && totalMarketCap ? (market.market_cap / totalMarketCap) * 100 : null;

  root.innerHTML = `
    <div class="detail-head">
      <div>
        <p class="section-tag">Actif</p>
        <h3>${SITE.escapeHTML(profile.title)}</h3>
        <p class="detail-subline">${SITE.escapeHTML(profile.focus)}</p>
      </div>
      <span class="coin-badge">${SITE.escapeHTML(profile.symbol)}</span>
    </div>

    <p class="detail-text">${SITE.escapeHTML(profile.description)}</p>

    <div class="detail-grid">
      <div class="detail-box">
        <span>Prix</span>
        <strong>${market ? SITE.formatCurrency(market.current_price, "USD", market.current_price > 10 ? 0 : 4) : "--"}</strong>
      </div>
      <div class="detail-box">
        <span>24h</span>
        <strong class="${market?.price_change_percentage_24h >= 0 ? "up" : "down"}">
          ${market ? SITE.formatPercent(market.price_change_percentage_24h) : "--"}
        </strong>
      </div>
      <div class="detail-box">
        <span>7 jours</span>
        <strong class="${market?.price_change_percentage_7d_in_currency >= 0 ? "up" : "down"}">
          ${market ? SITE.formatPercent(market.price_change_percentage_7d_in_currency) : "--"}
        </strong>
      </div>
      <div class="detail-box">
        <span>Dominance</span>
        <strong>${Number.isFinite(dominance) ? SITE.formatPercent(dominance) : "--"}</strong>
      </div>
      <div class="detail-box">
        <span>Market cap</span>
        <strong>${market ? SITE.formatCurrency(market.market_cap, "USD", 0) : "--"}</strong>
      </div>
      <div class="detail-box">
        <span>Volume 24h</span>
        <strong>${market ? SITE.formatCurrency(market.total_volume, "USD", 0) : "--"}</strong>
      </div>
    </div>

    <div class="metric-list">
      ${metricRow("Adoption", profile.metrics.adoption)}
      ${metricRow("Utilite", profile.metrics.utilite)}
      ${metricRow("Robustesse", profile.metrics.robustesse)}
      ${metricRow("Risque", profile.metrics.risque)}
    </div>

    <div class="detail-columns">
      <div>
        <h4>Usages cles</h4>
        <ul>${profile.useCases.map((item) => `<li>${SITE.escapeHTML(item)}</li>`).join("")}</ul>
      </div>
      <div>
        <h4>Points forts</h4>
        <ul>${profile.strengths.map((item) => `<li>${SITE.escapeHTML(item)}</li>`).join("")}</ul>
      </div>
    </div>

    <div class="detail-note-box">
      <h4>Ce qu'il faut surveiller</h4>
      <ul>${profile.risks.map((item) => `<li>${SITE.escapeHTML(item)}</li>`).join("")}</ul>
    </div>
  `;
}

function renderTrending() {
  const root = document.querySelector("#trending-list");

  if (!cryptoState.trending.length) {
    root.innerHTML = `<div class="empty-state">Aucune tendance chargee.</div>`;
    return;
  }

  root.innerHTML = cryptoState.trending
    .slice(0, 5)
    .map((coin, index) => {
      const item = coin.item;

      return `
        <div class="trend-row">
          <div>
            <span>Top ${index + 1}</span>
            <strong>${SITE.escapeHTML(item.name)} (${SITE.escapeHTML(item.symbol)})</strong>
          </div>
          <div class="trend-meta">
            <span>Rang ${SITE.escapeHTML(item.market_cap_rank ?? "--")}</span>
            <span>${SITE.escapeHTML(
              typeof item.price_btc === "number" ? item.price_btc.toFixed(8) : "--",
            )} BTC</span>
          </div>
        </div>
      `;
    })
    .join("");
}

function renderBriefing() {
  const root = document.querySelector("#market-briefing");
  const profile = cryptoProfiles.find((entry) => entry.id === cryptoState.selectedAssetId);
  const market = getMarket(profile.id);
  const bestMover = [...cryptoState.markets].sort(
    (left, right) =>
      (right.price_change_percentage_24h ?? -999) - (left.price_change_percentage_24h ?? -999),
  )[0];
  const btcDominance = cryptoState.global?.data?.market_cap_percentage?.btc;

  root.innerHTML = `
    <h3>Resume dynamique</h3>
    <p>
      L'actif observe est <strong>${SITE.escapeHTML(profile.title)}</strong>, surtout
      lu ici comme <strong>${SITE.escapeHTML(profile.focus)}</strong>.
    </p>
    <p>
      Sur 24h, il bouge de
      <strong>${market ? SITE.formatPercent(market.price_change_percentage_24h) : "--"}</strong>.
      ${
        bestMover
          ? `Le meilleur mouvement de la selection vient de <strong>${SITE.escapeHTML(
              bestMover.name,
            )}</strong>.`
          : "Le marche n'a pas encore charge de mouvement notable."
      }
    </p>
    <p>
      La dominance Bitcoin tourne autour de
      <strong>${Number.isFinite(btcDominance) ? SITE.formatPercent(btcDominance) : "--"}</strong>.
    </p>
  `;
}

function renderCountryMetricButtons() {
  const root = document.querySelector("#country-metrics");

  root.innerHTML = countryMetrics
    .map(
      (metric) => `
        <button
          class="pill-button ${metric.id === cryptoState.countryMetric ? "is-active" : ""}"
          type="button"
          data-country-metric="${metric.id}"
        >
          ${SITE.escapeHTML(metric.label)}
        </button>
      `,
    )
    .join("");

  root.querySelectorAll("[data-country-metric]").forEach((button) => {
    button.addEventListener("click", () => {
      cryptoState.countryMetric = button.dataset.countryMetric;
      renderCountryMetricButtons();
      renderCountryList();
      renderCountryDetail();
    });
  });
}

function getSortedCountries() {
  return [...countryProfiles].sort(
    (left, right) => right[cryptoState.countryMetric] - left[cryptoState.countryMetric],
  );
}

function renderCountryList() {
  const root = document.querySelector("#country-list");

  root.innerHTML = getSortedCountries()
    .map((country, index) => {
      const score = country[cryptoState.countryMetric];

      return `
        <button
          class="country-card ${country.id === cryptoState.selectedCountryId ? "is-active" : ""}"
          type="button"
          data-country-id="${country.id}"
        >
          <div class="asset-card-top">
            <div>
              <span>Top ${index + 1}</span>
              <strong>${SITE.escapeHTML(country.name)}</strong>
            </div>
            <span class="coin-badge">${score}/100</span>
          </div>
          <p>${SITE.escapeHTML(country.summary)}</p>
        </button>
      `;
    })
    .join("");

  root.querySelectorAll("[data-country-id]").forEach((button) => {
    button.addEventListener("click", () => {
      cryptoState.selectedCountryId = button.dataset.countryId;
      renderCountryList();
      renderCountryDetail();
    });
  });
}

function renderCountryDetail() {
  const root = document.querySelector("#country-detail");
  const country = countryProfiles.find((entry) => entry.id === cryptoState.selectedCountryId);

  root.innerHTML = `
    <div class="detail-head">
      <div>
        <p class="section-tag">Pays</p>
        <h3>${SITE.escapeHTML(country.name)}</h3>
        <p class="detail-subline">${SITE.escapeHTML(country.region)}</p>
      </div>
      <span class="coin-badge">${country[cryptoState.countryMetric]}/100</span>
    </div>

    <p class="detail-text">${SITE.escapeHTML(country.summary)}</p>

    <div class="metric-list">
      ${metricRow("Adoption", country.adoption)}
      ${metricRow("Trading", country.trading)}
      ${metricRow("Innovation", country.innovation)}
    </div>

    <div class="detail-grid">
      <div class="detail-box">
        <span>Marche fort pour</span>
        <strong>${SITE.escapeHTML(country.bestFor)}</strong>
      </div>
      <div class="detail-box">
        <span>Cadre</span>
        <strong>${SITE.escapeHTML(country.regulation)}</strong>
      </div>
      <div class="detail-box detail-box-wide">
        <span>Usages dominants</span>
        <strong>${SITE.escapeHTML(country.usage)}</strong>
      </div>
    </div>

    <div class="tag-row">
      ${country.tags.map((tag) => `<span class="tag-chip">${SITE.escapeHTML(tag)}</span>`).join("")}
    </div>
  `;
}

async function loadCryptoData() {
  const cryptoStatus = document.querySelector("#crypto-status");
  const marketStatus = document.querySelector("#market-status");

  SITE.setStatus(cryptoStatus, "Chargement global...", "neutral");
  SITE.setStatus(marketStatus, "Chargement des actifs...", "neutral");

  try {
    const [globalData, marketsData, trendingData] = await Promise.all([
      SITE.fetchJSON("https://api.coingecko.com/api/v3/global"),
      SITE.fetchJSON(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,ripple,tether,binancecoin&order=market_cap_desc&per_page=6&page=1&sparkline=false&price_change_percentage=7d",
      ),
      SITE.fetchJSON("https://api.coingecko.com/api/v3/search/trending"),
    ]);

    cryptoState.global = globalData;
    cryptoState.markets = marketsData;
    cryptoState.trending = trendingData.coins || [];
    cryptoState.lastLoadedAt = new Date().toISOString();
    renderGlobalOverview();
    renderAssetList();
    renderAssetDetail();
    renderTrending();
    renderBriefing();
    SITE.setStatus(
      cryptoStatus,
      `Maj ${SITE.formatRelativeTime(cryptoState.lastLoadedAt)}`,
      "live",
    );
    SITE.setStatus(marketStatus, "Marche synchronise", "live");
  } catch (error) {
    renderGlobalOverview();
    renderAssetList();
    renderAssetDetail();
    renderTrending();
    renderBriefing();
    SITE.setStatus(cryptoStatus, "Vue globale indisponible", "error");
    SITE.setStatus(marketStatus, "Donnees live indisponibles", "error");
  }
}

function scheduleRefresh() {
  window.setInterval(loadCryptoData, 90000);
}

function setupPremiumChart() {
  const chartData = {
    "1h": [180, 176, 178, 170, 166, 160, 155, 158, 162, 168, 172, 178, 184, 190, 198, 210, 205, 214],
    "24h": [190, 196, 193, 204, 210, 216, 214, 198, 205, 212, 226, 238, 222, 236, 248, 262, 256, 268],
    "7j": [220, 214, 208, 202, 198, 190, 183, 176, 170, 165, 160, 155, 150, 142, 136, 128, 120, 114],
    "1m": [240, 235, 228, 220, 210, 198, 186, 176, 168, 160, 154, 148, 138, 130, 120, 110, 96, 88],
  };
  const linePath = document.getElementById("sngLinePath");
  const areaPath = document.getElementById("sngAreaPath");
  const buttons = document.querySelectorAll(".sng-chart-tabs button");

  if (!linePath || !areaPath || !buttons.length) {
    return;
  }

  function makePath(points, width, height) {
    const max = Math.max(...points);
    const min = Math.min(...points);
    const stepX = width / (points.length - 1);

    const coords = points.map((value, index) => {
      const x = index * stepX;
      const yRatio = (value - min) / (max - min || 1);
      const y = height - yRatio * (height - 30) - 15;
      return [x, y];
    });

    let path = `M${coords[0][0]},${coords[0][1]}`;
    coords.slice(1).forEach(([x, y]) => {
      path += ` L${x},${y}`;
    });

    return { path, coords };
  }

  function renderChart(key) {
    const width = 900;
    const height = 280;
    const points = chartData[key] || chartData["24h"];
    const { path, coords } = makePath(points, width, height);
    linePath.setAttribute("d", path);
    areaPath.setAttribute(
      "d",
      `${path} L${coords[coords.length - 1][0]},${height} L0,${height} Z`,
    );
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      renderChart(button.dataset.chart);
    });
  });

  renderChart("24h");
}

document.addEventListener("DOMContentLoaded", () => {
  SITE.setupMenu();
  SITE.observeReveals();
  setupPremiumChart();
  renderFilterButtons();
  renderGlobalOverview();
  renderAssetList();
  renderAssetDetail();
  renderTrending();
  renderBriefing();
  renderCountryMetricButtons();
  renderCountryList();
  renderCountryDetail();
  document.querySelector("#refresh-crypto").addEventListener("click", loadCryptoData);
  loadCryptoData();
  scheduleRefresh();
});
