const LOTTERY_API_BASE = "https://www.lotteryresultsfeed.com/api";
const LOTTERY_TOKEN_KEY = "sng_lottery_token";

const lotteryDirectory = [
  {
    id: "do-nacional",
    name: "Loteria Nacional Dominicana",
    countryCode: "do",
    countryName: "Republique dominicaine",
    region: "Caraibes",
    officialUrl: "https://www.loterianacional.gob.do/",
    aliases: [
      "nacional",
      "loteria nacional",
      "dominicana",
      "dominican republic",
      "republique dominicaine",
    ],
    matchNames: ["Loteria Nacional Dominicana", "Loteria Nacional"],
    summary:
      "Reference historique de la Republique dominicaine pour suivre les jeux nationaux et les tirages publics.",
    formatLabel: "3 numeros sur base 00-99 selon le jeu",
    generator: { mainCount: 3, mainMin: 0, mainMax: 99, pad: 2 },
    currency: "DOP",
    featured: true,
  },
  {
    id: "do-leidsa",
    name: "Leidsa",
    countryCode: "do",
    countryName: "Republique dominicaine",
    region: "Caraibes",
    officialUrl: "https://www.leidsa.com/",
    aliases: ["leidsa", "dominicana", "republique dominicaine"],
    matchNames: ["Leidsa"],
    summary:
      "Marque tres visible en RD, souvent associee aux jeux numeriques modernes et a une forte notoriete locale.",
    formatLabel: "Formats variables selon loto, quiniela et jeux associes",
    generator: { mainCount: 3, mainMin: 0, mainMax: 99, pad: 2 },
    currency: "DOP",
    featured: true,
  },
  {
    id: "do-loteka",
    name: "Loteka",
    countryCode: "do",
    countryName: "Republique dominicaine",
    region: "Caraibes",
    officialUrl: "https://loteka.com.do/",
    aliases: ["loteka", "dominicana", "republique dominicaine"],
    matchNames: ["Loteka"],
    summary:
      "Jeux quotidiens connus en RD, utiles si tu veux partir d'un nom de marque plutot que d'un pays.",
    formatLabel: "Jeux de type quiniela, tripleta et formats derives",
    generator: { mainCount: 3, mainMin: 0, mainMax: 99, pad: 2 },
    currency: "DOP",
    featured: true,
  },
  {
    id: "us-powerball",
    name: "Powerball",
    countryCode: "us",
    countryName: "Etats-Unis",
    stateCode: "ca",
    region: "Amerique du Nord",
    officialUrl: "https://www.powerball.com/",
    aliases: ["powerball", "usa", "us", "etats unis", "united states"],
    matchNames: ["Powerball"],
    summary:
      "La loterie multi-etats la plus recherchee pour les gros jackpots americains.",
    formatLabel: "5 numeros de 1 a 69 + 1 Powerball de 1 a 26",
    generator: {
      mainCount: 5,
      mainMin: 1,
      mainMax: 69,
      bonusCount: 1,
      bonusMin: 1,
      bonusMax: 26,
      bonusLabel: "Powerball",
    },
    currency: "USD",
    featured: true,
  },
  {
    id: "us-mega-millions",
    name: "Mega Millions",
    countryCode: "us",
    countryName: "Etats-Unis",
    stateCode: "ca",
    region: "Amerique du Nord",
    officialUrl: "https://www.megamillions.com/",
    aliases: ["mega millions", "mega", "usa", "us", "etats unis"],
    matchNames: ["Mega Millions"],
    summary:
      "Autre geant des jackpots americains, souvent cherche par nom plutot que par pays.",
    formatLabel: "5 numeros de 1 a 70 + 1 Mega Ball de 1 a 25",
    generator: {
      mainCount: 5,
      mainMin: 1,
      mainMax: 70,
      bonusCount: 1,
      bonusMin: 1,
      bonusMax: 25,
      bonusLabel: "Mega Ball",
    },
    currency: "USD",
    featured: true,
  },
  {
    id: "ca-lotto-max",
    name: "Lotto Max",
    countryCode: "ca",
    countryName: "Canada",
    stateCode: "on",
    region: "Amerique du Nord",
    officialUrl: "https://www.olg.ca/en/lottery/play-lotto-max.html",
    aliases: ["lotto max", "canada", "ontario"],
    matchNames: ["Lotto Max"],
    summary:
      "Une des grandes references canadiennes, souvent recherchee par pays ou directement par son nom.",
    formatLabel: "7 numeros de 1 a 50",
    generator: { mainCount: 7, mainMin: 1, mainMax: 50 },
    currency: "CAD",
    featured: true,
  },
  {
    id: "ca-lotto-649",
    name: "Lotto 6/49",
    countryCode: "ca",
    countryName: "Canada",
    stateCode: "on",
    region: "Amerique du Nord",
    officialUrl: "https://www.olg.ca/en/lottery/play-lotto-649.html",
    aliases: ["649", "lotto 649", "lotto 6/49", "canada"],
    matchNames: ["Lotto 6/49", "Lotto 649"],
    summary:
      "Jeu historique canadien avec une recherche frequente par numerotation 6/49.",
    formatLabel: "6 numeros de 1 a 49 + bonus selon le tirage",
    generator: {
      mainCount: 6,
      mainMin: 1,
      mainMax: 49,
      bonusCount: 1,
      bonusMin: 1,
      bonusMax: 49,
      bonusLabel: "Bonus",
    },
    currency: "CAD",
    featured: true,
  },
  {
    id: "uk-euromillions",
    name: "EuroMillions UK",
    countryCode: "uk",
    countryName: "Royaume-Uni",
    region: "Europe",
    officialUrl: "https://www.national-lottery.co.uk/games/euromillions",
    aliases: ["euromillions", "uk", "royaume uni", "united kingdom"],
    matchNames: ["EuroMillions"],
    summary:
      "Tres recherchee en Europe, avec des jackpots transfrontaliers et un fort volume de requetes.",
    formatLabel: "5 numeros de 1 a 50 + 2 etoiles de 1 a 12",
    generator: {
      mainCount: 5,
      mainMin: 1,
      mainMax: 50,
      bonusCount: 2,
      bonusMin: 1,
      bonusMax: 12,
      bonusLabel: "Etoiles",
    },
    currency: "GBP",
    featured: true,
  },
  {
    id: "uk-lotto",
    name: "UK Lotto",
    countryCode: "uk",
    countryName: "Royaume-Uni",
    region: "Europe",
    officialUrl: "https://www.national-lottery.co.uk/games/lotto",
    aliases: ["uk lotto", "lotto uk", "royaume uni", "uk"],
    matchNames: ["Lotto", "UK Lotto"],
    summary:
      "Le jeu central de la National Lottery britannique, utile si l'utilisateur tape juste UK ou Lotto.",
    formatLabel: "6 numeros de 1 a 59",
    generator: { mainCount: 6, mainMin: 1, mainMax: 59 },
    currency: "GBP",
  },
  {
    id: "uk-thunderball",
    name: "Thunderball",
    countryCode: "uk",
    countryName: "Royaume-Uni",
    region: "Europe",
    officialUrl: "https://www.national-lottery.co.uk/games/thunderball",
    aliases: ["thunderball", "uk", "royaume uni"],
    matchNames: ["Thunderball"],
    summary:
      "Jeu britannique populaire, interessant pour les recherches precises par nom de loterie.",
    formatLabel: "5 numeros de 1 a 39 + 1 Thunderball de 1 a 14",
    generator: {
      mainCount: 5,
      mainMin: 1,
      mainMax: 39,
      bonusCount: 1,
      bonusMin: 1,
      bonusMax: 14,
      bonusLabel: "Thunderball",
    },
    currency: "GBP",
  },
  {
    id: "ie-daily-million",
    name: "Daily Million",
    countryCode: "ie",
    countryName: "Irlande",
    region: "Europe",
    officialUrl: "https://www.lottery.ie/games/daily-million",
    aliases: ["daily million", "ireland", "irlande"],
    matchNames: ["Daily Million"],
    summary:
      "Jeu irlandais facile a retrouver par pays ou par nom exact.",
    formatLabel: "6 numeros de 1 a 39 + bonus selon le jeu",
    generator: {
      mainCount: 6,
      mainMin: 1,
      mainMax: 39,
      bonusCount: 1,
      bonusMin: 1,
      bonusMax: 39,
      bonusLabel: "Bonus",
    },
    currency: "EUR",
  },
  {
    id: "de-lotto-6aus49",
    name: "Lotto 6aus49",
    countryCode: "de",
    countryName: "Allemagne",
    region: "Europe",
    officialUrl: "https://www.lotto.de/",
    aliases: ["6aus49", "lotto 6aus49", "germany", "allemagne"],
    matchNames: ["Lotto 6aus49", "6aus49"],
    summary:
      "Grande loterie allemande, souvent recherchee par son format numerique.",
    formatLabel: "6 numeros de 1 a 49 + Superzahl",
    generator: {
      mainCount: 6,
      mainMin: 1,
      mainMax: 49,
      bonusCount: 1,
      bonusMin: 0,
      bonusMax: 9,
      bonusLabel: "Superzahl",
    },
    currency: "EUR",
    featured: true,
  },
  {
    id: "de-eurojackpot",
    name: "EuroJackpot",
    countryCode: "de",
    countryName: "Allemagne",
    region: "Europe",
    officialUrl: "https://www.eurojackpot.de/",
    aliases: ["eurojackpot", "germany", "allemagne"],
    matchNames: ["EuroJackpot"],
    summary:
      "Jeu europeen tres connu, utile a retrouver depuis Allemagne ou directement par son nom.",
    formatLabel: "5 numeros de 1 a 50 + 2 eurozahlen de 1 a 12",
    generator: {
      mainCount: 5,
      mainMin: 1,
      mainMax: 50,
      bonusCount: 2,
      bonusMin: 1,
      bonusMax: 12,
      bonusLabel: "Eurozahlen",
    },
    currency: "EUR",
    featured: true,
  },
  {
    id: "it-superenalotto",
    name: "SuperEnalotto",
    countryCode: "it",
    countryName: "Italie",
    region: "Europe",
    officialUrl: "https://www.superenalotto.it/",
    aliases: ["superenalotto", "italie", "italy"],
    matchNames: ["SuperEnalotto"],
    summary:
      "Reference italienne a gros jackpots, souvent recherchee directement par nom.",
    formatLabel: "6 numeros de 1 a 90",
    generator: { mainCount: 6, mainMin: 1, mainMax: 90 },
    currency: "EUR",
    featured: true,
  },
  {
    id: "it-lotto",
    name: "Lotto Italia",
    countryCode: "it",
    countryName: "Italie",
    region: "Europe",
    officialUrl: "https://www.lotto-italia.it/",
    aliases: ["lotto italia", "italie lotto", "italie", "italy"],
    matchNames: ["Lotto", "Lotto Italia"],
    summary:
      "Jeu italien classique, pratique si l'utilisateur tape juste Italie ou Lotto Italia.",
    formatLabel: "Numeros et roues selon le jeu italien",
    generator: { mainCount: 5, mainMin: 1, mainMax: 90 },
    currency: "EUR",
  },
  {
    id: "es-primitiva",
    name: "La Primitiva",
    countryCode: "es",
    countryName: "Espagne",
    region: "Europe",
    officialUrl: "https://www.loteriasyapuestas.es/",
    aliases: ["la primitiva", "primitiva", "espagne", "spain"],
    matchNames: ["La Primitiva", "Primitiva"],
    summary:
      "Loterie espagnole tres connue, souvent recherchee via le pays ou le nom historique.",
    formatLabel: "6 numeros de 1 a 49 + complementaires selon le tirage",
    generator: { mainCount: 6, mainMin: 1, mainMax: 49 },
    currency: "EUR",
    featured: true,
  },
  {
    id: "br-mega-sena",
    name: "Mega-Sena",
    countryCode: "br",
    countryName: "Bresil",
    region: "Amerique du Sud",
    officialUrl: "https://loterias.caixa.gov.br/",
    aliases: ["mega sena", "mega-sena", "bresil", "brazil"],
    matchNames: ["Mega Sena", "Mega-Sena"],
    summary:
      "La loterie bresilienne la plus connue, utile si l'utilisateur tape juste Bresil.",
    formatLabel: "6 numeros de 1 a 60",
    generator: { mainCount: 6, mainMin: 1, mainMax: 60 },
    currency: "BRL",
    featured: true,
  },
  {
    id: "mx-melate",
    name: "Melate",
    countryCode: "mx",
    countryName: "Mexique",
    region: "Amerique du Nord",
    officialUrl: "https://www.pronosticos.gob.mx/",
    aliases: ["melate", "mexique", "mexico"],
    matchNames: ["Melate"],
    summary:
      "Jeu phare au Mexique, a retrouver rapidement par nom ou par pays.",
    formatLabel: "6 numeros de 1 a 56",
    generator: { mainCount: 6, mainMin: 1, mainMax: 56 },
    currency: "MXN",
  },
  {
    id: "au-oz-lotto",
    name: "Oz Lotto",
    countryCode: "au",
    countryName: "Australie",
    region: "Oceanie",
    officialUrl: "https://www.thelott.com/",
    aliases: ["oz lotto", "australie", "australia"],
    matchNames: ["Oz Lotto"],
    summary:
      "Loterie australienne tres connue, utile pour les recherches par pays dans la zone Oceanie.",
    formatLabel: "7 numeros de 1 a 47",
    generator: { mainCount: 7, mainMin: 1, mainMax: 47 },
    currency: "AUD",
  },
  {
    id: "au-powerball",
    name: "Powerball Australia",
    countryCode: "au",
    countryName: "Australie",
    region: "Oceanie",
    officialUrl: "https://www.thelott.com/",
    aliases: ["powerball australia", "australia powerball", "australie powerball"],
    matchNames: ["Powerball"],
    summary:
      "Version australienne de Powerball, differente de la version americaine mais souvent recherchee par mot cle identique.",
    formatLabel: "7 numeros de 1 a 35 + 1 Powerball de 1 a 20",
    generator: {
      mainCount: 7,
      mainMin: 1,
      mainMax: 35,
      bonusCount: 1,
      bonusMin: 1,
      bonusMax: 20,
      bonusLabel: "Powerball",
    },
    currency: "AUD",
  },
  {
    id: "ph-ultra-lotto",
    name: "Ultra Lotto 6/58",
    countryCode: "ph",
    countryName: "Philippines",
    region: "Asie",
    officialUrl: "https://www.pcso.gov.ph/",
    aliases: ["ultra lotto 6/58", "ultra lotto", "philippines"],
    matchNames: ["Ultra Lotto 6/58", "Ultra Lotto"],
    summary:
      "Reference utile si la recherche part d'un pays asiatique ou d'un nom de jeu complet.",
    formatLabel: "6 numeros de 1 a 58",
    generator: { mainCount: 6, mainMin: 1, mainMax: 58 },
    currency: "PHP",
  },
];

const featuredQueries = [
  "Republique dominicaine",
  "Powerball",
  "EuroMillions",
  "Allemagne",
  "Italie",
  "Bresil",
];

const lotteryState = {
  query: "",
  selectedId: "do-nacional",
  apiToken: localStorage.getItem(LOTTERY_TOKEN_KEY) ?? "",
  liveEntryId: "",
  liveLottery: null,
  liveResults: [],
  liveFrequency: null,
  availableYears: [],
  selectedYear: "",
  generated: null,
};

const lotteryCache = new Map();
const drawYearCache = new Map();
const resultsCache = new Map();
const frequencyCache = new Map();

function normalizeValue(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function selectedEntry() {
  return lotteryDirectory.find((entry) => entry.id === lotteryState.selectedId) ?? lotteryDirectory[0];
}

function entrySearchHaystack(entry) {
  return normalizeValue(
    [
      entry.name,
      entry.countryName,
      entry.region,
      entry.formatLabel,
      ...(entry.aliases ?? []),
      ...(entry.matchNames ?? []),
    ].join(" "),
  );
}

function formatDateLabel(value) {
  if (!value) {
    return "--";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value ?? "--");
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatShortNumber(value, pad = 0) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return String(value ?? "--");
  }

  return pad > 0 ? String(number).padStart(pad, "0") : String(number);
}

function combinationCount(total, picks) {
  if (!Number.isFinite(total) || !Number.isFinite(picks) || picks < 0 || total < picks) {
    return null;
  }

  const limitedPicks = Math.min(picks, total - picks);
  let result = 1n;

  for (let step = 1; step <= limitedPicks; step += 1) {
    result = (result * BigInt(total - limitedPicks + step)) / BigInt(step);
  }

  return result;
}

function formatBigIntCount(value) {
  if (typeof value !== "bigint") {
    return "--";
  }

  return value
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function estimateJackpotOdds(entry) {
  const generator = entry.generator;

  if (!generator?.mainCount || !generator?.mainMin || !generator?.mainMax) {
    return null;
  }

  const mainPool = generator.mainMax - generator.mainMin + 1;
  const mainCombos = combinationCount(mainPool, generator.mainCount);

  if (!mainCombos) {
    return null;
  }

  if (!generator.bonusCount || generator.bonusMin === undefined || generator.bonusMax === undefined) {
    return mainCombos;
  }

  const bonusPool = generator.bonusMax - generator.bonusMin + 1;
  const bonusCombos = combinationCount(bonusPool, generator.bonusCount);

  if (!bonusCombos) {
    return mainCombos;
  }

  return mainCombos * bonusCombos;
}

function uniqueRandomNumbers(count, min, max, pad = 0) {
  const set = new Set();

  while (set.size < count) {
    set.add(Math.floor(Math.random() * (max - min + 1)) + min);
  }

  return [...set]
    .sort((left, right) => left - right)
    .map((value) => formatShortNumber(value, pad));
}

function generateDemoGrid(entry) {
  const generator = entry.generator;
  const mainNumbers = uniqueRandomNumbers(
    generator.mainCount,
    generator.mainMin,
    generator.mainMax,
    generator.pad ?? 0,
  );

  const bonusNumbers =
    generator.bonusCount && generator.bonusMin !== undefined && generator.bonusMax !== undefined
      ? uniqueRandomNumbers(
          generator.bonusCount,
          generator.bonusMin,
          generator.bonusMax,
          generator.bonusPad ?? generator.pad ?? 0,
        )
      : [];

  return { mainNumbers, bonusNumbers };
}

function readTokenHeaders() {
  if (!lotteryState.apiToken) {
    return {};
  }

  return {
    Authorization: `Bearer ${lotteryState.apiToken}`,
    Accept: "application/json",
  };
}

function resultCardLink(entry) {
  return `
    <div class="tag-row">
      <span class="tag-chip">${SITE.escapeHTML(entry.countryName)}</span>
      <span class="tag-chip">${SITE.escapeHTML(entry.region)}</span>
      <span class="tag-chip">${SITE.escapeHTML(entry.formatLabel)}</span>
    </div>
  `;
}

function renderPulse() {
  const root = document.querySelector("#lottery-pulse");
  const entry = selectedEntry();
  const countryCount = new Set(lotteryDirectory.map((item) => item.countryName)).size;

  root.innerHTML = `
    <div class="pulse-card">
      <span>Annuaire</span>
      <strong>${SITE.escapeHTML(String(lotteryDirectory.length))}</strong>
      <p>Loteries indexees dans la recherche</p>
    </div>
    <div class="pulse-card">
      <span>Pays</span>
      <strong>${SITE.escapeHTML(String(countryCount))}</strong>
      <p>Zones rapidement consultables</p>
    </div>
    <div class="pulse-card">
      <span>Selection</span>
      <strong>${SITE.escapeHTML(entry.countryName)}</strong>
      <p>${SITE.escapeHTML(entry.name)}</p>
    </div>
    <div class="pulse-card">
      <span>Mode live</span>
      <strong>${lotteryState.apiToken ? "Actif" : "Optionnel"}</strong>
      <p>${lotteryState.apiToken ? "Token local enregistre" : "Ajoute un token pour les tirages live"}</p>
    </div>
  `;
}

function renderQuickSearches() {
  const root = document.querySelector("#lottery-quick-searches");

  root.innerHTML = featuredQueries
    .map(
      (query) => `
        <button class="pill-button" type="button" data-query="${SITE.escapeHTML(query)}">
          ${SITE.escapeHTML(query)}
        </button>
      `,
    )
    .join("");

  root.querySelectorAll("[data-query]").forEach((button) => {
    button.addEventListener("click", () => {
      const query = button.dataset.query ?? "";
      const input = document.querySelector("#lottery-query");

      input.value = query;
      performSearch(query, true);
    });
  });
}

function getSearchResults(query) {
  const normalizedQuery = normalizeValue(query);

  if (!normalizedQuery) {
    const featuredEntries = lotteryDirectory.filter((entry) => entry.featured);
    const dominicanRepublicEntries = featuredEntries.filter(
      (entry) => normalizeValue(entry.countryName) === "republique dominicaine",
    );
    const otherEntries = featuredEntries.filter(
      (entry) => normalizeValue(entry.countryName) !== "republique dominicaine",
    );

    return [...dominicanRepublicEntries, ...otherEntries].slice(0, 10);
  }

  const queryTokens = normalizedQuery.split(" ").filter(Boolean);

  return lotteryDirectory
    .map((entry) => ({ entry, haystack: entrySearchHaystack(entry) }))
    .filter(({ haystack }) => queryTokens.every((token) => haystack.includes(token)))
    .map(({ entry }) => entry)
    .slice(0, 18);
}

function renderSearchResults(results, query) {
  const root = document.querySelector("#lottery-search-results");

  if (!results.length) {
    root.innerHTML = `
      <div class="empty-state">
        Aucun resultat pour <strong>${SITE.escapeHTML(query || "cette recherche")}</strong>.
        Essaie un pays, une marque ou un jeu comme Powerball, EuroMillions ou Italie.
      </div>
    `;
    return;
  }

  root.innerHTML = results
    .map(
      (entry) => `
        <button
          class="result-card ${entry.id === lotteryState.selectedId ? "is-active" : ""}"
          type="button"
          data-entry-id="${SITE.escapeHTML(entry.id)}"
        >
          <div>
            <strong>${SITE.escapeHTML(entry.name)}</strong>
            <span>${SITE.escapeHTML(entry.countryName)} - ${SITE.escapeHTML(entry.region)}</span>
          </div>
          <div class="result-card-copy">
            <p>${SITE.escapeHTML(entry.summary)}</p>
            ${resultCardLink(entry)}
          </div>
        </button>
      `,
    )
    .join("");

  root.querySelectorAll("[data-entry-id]").forEach((button) => {
    button.addEventListener("click", () => {
      selectEntry(button.dataset.entryId);
    });
  });
}

function renderTokenStatus(message, tone = "neutral") {
  const root = document.querySelector("#lottery-token-status");

  root.innerHTML = `
    <span class="tag-chip ${tone === "error" ? "tag-chip-error" : ""}">
      ${SITE.escapeHTML(message)}
    </span>
  `;
}

function renderOfficialLinks() {
  const root = document.querySelector("#official-links");
  const entry = selectedEntry();
  const links = new Map();

  links.set("Site officiel", entry.officialUrl);

  if (lotteryState.liveLottery?.url) {
    links.set("Fiche live", lotteryState.liveLottery.url);
  }

  root.innerHTML = [...links.entries()]
    .map(
      ([label, url]) => `
        <a class="link-card" href="${SITE.safeUrl(url, "#")}" target="_blank" rel="noreferrer">
          ${SITE.escapeHTML(label)}
        </a>
      `,
    )
    .join("");
}

function listEnabledDrawDays(drawDays) {
  if (!drawDays || typeof drawDays !== "object") {
    return [];
  }

  return Object.entries(drawDays)
    .filter(([, value]) => value === 1 || value === "1" || value === true)
    .map(([day]) => day);
}

function renderLotteryDetail() {
  const root = document.querySelector("#lottery-detail");
  const entry = selectedEntry();
  const liveLottery = lotteryState.liveEntryId === entry.id ? lotteryState.liveLottery : null;
  const drawDays = listEnabledDrawDays(liveLottery?.draw_days);

  root.innerHTML = `
    <div class="detail-head">
      <div>
        <p class="section-tag">Fiche active</p>
        <h3>${SITE.escapeHTML(entry.name)}</h3>
        <p class="detail-subline">${SITE.escapeHTML(entry.countryName)} - ${SITE.escapeHTML(entry.region)}</p>
      </div>
      <span class="coin-badge">${liveLottery ? "Live" : "Annuaire"}</span>
    </div>

    <p class="detail-text">${SITE.escapeHTML(entry.summary)}</p>

    <div class="detail-grid">
      <div class="detail-box">
        <span>Recherche</span>
        <strong>${SITE.escapeHTML(entry.countryName)}</strong>
      </div>
      <div class="detail-box">
        <span>Format</span>
        <strong>${SITE.escapeHTML(entry.formatLabel)}</strong>
      </div>
      <div class="detail-box">
        <span>Region</span>
        <strong>${SITE.escapeHTML(entry.region)}</strong>
      </div>
      <div class="detail-box">
        <span>Mode</span>
        <strong>${liveLottery ? "Resultats live" : "Lien officiel"}</strong>
      </div>
    </div>
  `;

  root.innerHTML +=
    liveLottery
      ? `
        <div class="detail-note-box">
          <h4>Infos live</h4>
          <ul>
            <li>Nom API: ${SITE.escapeHTML(liveLottery.name ?? entry.name)}</li>
            <li>Tirages: ${drawDays.length ? SITE.escapeHTML(drawDays.join(", ")) : "non communiques"}</li>
            <li>Choix principaux: ${SITE.escapeHTML(String(liveLottery.main_balls_to_pick ?? "--"))}</li>
            <li>Bonus: ${SITE.escapeHTML(String(liveLottery.bonus_balls_to_pick ?? 0))}</li>
          </ul>
        </div>
      `
      : `
        <div class="detail-note-box">
          <h4>Mode annuaire</h4>
          <ul>
            <li>La recherche par pays ou nom marche sans token.</li>
            <li>Les liens officiels restent toujours disponibles.</li>
            <li>Ajoute un token local si tu veux les tirages directement dans cette page.</li>
          </ul>
        </div>
      `;
}

function renderFormatNote() {
  const root = document.querySelector("#lottery-format-note");
  const entry = selectedEntry();
  const generator = entry.generator;
  const liveLottery = lotteryState.liveEntryId === entry.id ? lotteryState.liveLottery : null;

  root.innerHTML = `
    <h3>Lecture rapide</h3>
    <p>
      ${SITE.escapeHTML(entry.name)} se cherche par
      <strong>${SITE.escapeHTML(entry.countryName)}</strong> ou directement par son nom.
    </p>
    <p>
      Format local reference:
      <strong>${SITE.escapeHTML(entry.formatLabel)}</strong>.
    </p>
    <p>
      Generation demo:
      <strong>${SITE.escapeHTML(String(generator.mainCount))}</strong> numeros
      entre <strong>${SITE.escapeHTML(String(generator.mainMin))}</strong> et
      <strong>${SITE.escapeHTML(String(generator.mainMax))}</strong>
      ${
        generator.bonusCount
          ? `, plus ${SITE.escapeHTML(String(generator.bonusCount))} ${SITE.escapeHTML(generator.bonusLabel ?? "bonus")}.`
          : "."
      }
    </p>
    ${
      liveLottery
        ? `<p>Le mode live est charge pour cette fiche. Tu peux changer l'annee et rafraichir les tirages.</p>`
        : `<p>Sans token live, la page reste un moteur de recherche mondial avec liens officiels.</p>`
    }
  `;
}

function renderGenerated() {
  const root = document.querySelector("#generated-balls");
  const entry = selectedEntry();

  if (!lotteryState.generated) {
    lotteryState.generated = generateDemoGrid(entry);
  }

  const { mainNumbers, bonusNumbers } = lotteryState.generated;

  root.innerHTML = `
    <div class="generated-section">
      <span class="article-tag">Principaux</span>
      <div class="ball-row">
        ${mainNumbers
          .map((number) => `<span class="number-ball number-ball-accent">${SITE.escapeHTML(number)}</span>`)
          .join("")}
      </div>
    </div>
    ${
      bonusNumbers.length
        ? `
          <div class="generated-section">
            <span class="article-tag">${SITE.escapeHTML(entry.generator.bonusLabel ?? "Bonus")}</span>
            <div class="ball-row">
              ${bonusNumbers
                .map((number) => `<span class="number-ball">${SITE.escapeHTML(number)}</span>`)
                .join("")}
            </div>
          </div>
        `
        : ""
    }
  `;
}

function serializeGeneratedGrid() {
  if (!lotteryState.generated) {
    return "";
  }

  const entry = selectedEntry();
  const parts = [lotteryState.generated.mainNumbers.join(" - ")];

  if (lotteryState.generated.bonusNumbers.length) {
    parts.push(`${entry.generator.bonusLabel ?? "Bonus"}: ${lotteryState.generated.bonusNumbers.join(" - ")}`);
  }

  return `${entry.name} | ${parts.join(" | ")}`;
}

function renderResultsPlaceholder(message, tone = "neutral") {
  const root = document.querySelector("#lottery-results-list");

  SITE.setStatus(document.querySelector("#lottery-results-status"), message, tone);
  root.innerHTML = `
    <div class="empty-state">
      ${SITE.escapeHTML(message)}.
    </div>
  `;
}

function collectBallValues(draw) {
  const mainValues = [];
  const bonusValues = [];

  ["ball_1", "ball_2", "ball_3", "ball_4", "ball_5", "ball_6", "ball_7", "ball_8", "ball_9"].forEach((key) => {
    if (draw[key] !== undefined && draw[key] !== null && draw[key] !== "") {
      mainValues.push(formatShortNumber(draw[key]));
    }
  });

  ["ball_bonus", "ball_bonus_1", "ball_bonus_2", "ball_bonus_3"].forEach((key) => {
    if (draw[key] !== undefined && draw[key] !== null && draw[key] !== "") {
      bonusValues.push(formatShortNumber(draw[key]));
    }
  });

  if (!mainValues.length && Array.isArray(draw.balls)) {
    mainValues.push(...draw.balls.map((value) => formatShortNumber(value)));
  }

  return { mainValues, bonusValues };
}

function ballRankLabel(index) {
  const labels = ["1er", "2do", "3er"];
  return labels[index] ?? `${index + 1}e`;
}

function latestDrawCandidate(entry) {
  if (lotteryState.liveEntryId !== entry.id) {
    return null;
  }

  if (lotteryState.liveResults.length) {
    return lotteryState.liveResults[0];
  }

  return lotteryState.liveLottery;
}

function latestDrawMarkup(draw, entry) {
  if (!draw) {
    return `
      <p>
        Aucun resultat recent visible directement dans la page pour le moment.
      </p>
    `;
  }

  const { mainValues, bonusValues } = collectBallValues(draw);

  if (!mainValues.length && !bonusValues.length) {
    return `
      <p>
        Un tirage existe mais les numeros ne sont pas remontes dans cette reponse.
      </p>
    `;
  }

  return `
    <p>
      Dernier tirage visible:
      <strong>${SITE.escapeHTML(formatDateLabel(draw.draw_date ?? draw.drawTime ?? draw.last_draw_date))}</strong>
    </p>
    <div class="draw-number-row draw-number-row-highlight">
      ${mainValues
        .map(
          (value, index) => `
            <div class="ranked-ball">
              <span class="number-ball number-ball-small">${SITE.escapeHTML(value)}</span>
              <small>${SITE.escapeHTML(ballRankLabel(index))}</small>
            </div>
          `,
        )
        .join("")}
      ${bonusValues
        .map(
          (value) =>
            `<div class="ranked-ball ranked-ball-bonus"><span class="number-ball number-ball-small number-ball-bonus">${SITE.escapeHTML(value)}</span><small>Bonus</small></div>`,
        )
        .join("")}
    </div>
    <p class="detail-subline">${SITE.escapeHTML(entry.name)} - dernier resultat disponible dans la page.</p>
  `;
}

function renderDrawResults() {
  const root = document.querySelector("#lottery-results-list");
  const entry = selectedEntry();
  const results = lotteryState.liveEntryId === entry.id ? lotteryState.liveResults : [];

  if (!results.length) {
    root.innerHTML = `
      <div class="empty-state">
        Aucun tirage charge pour cette loterie. Tu peux utiliser le lien officiel
        ou enregistrer un token live pour tenter un chargement direct.
      </div>
    `;
    return;
  }

  root.innerHTML = results
    .map((draw, index) => {
      const { mainValues, bonusValues } = collectBallValues(draw);
      const jackpot = Number(draw.jackpot);

      return `
        <article class="draw-card">
          <div class="draw-card-head">
            <div>
              <p class="article-tag">Tirage ${SITE.escapeHTML(String(index + 1))}</p>
              <h3>${SITE.escapeHTML(formatDateLabel(draw.draw_date))}</h3>
            </div>
            <div class="draw-card-meta">
              ${
                Number.isFinite(jackpot) && jackpot > 0
                  ? `<strong>${SITE.escapeHTML(SITE.formatCurrency(jackpot, entry.currency, 0))}</strong>`
                  : `<strong>${SITE.escapeHTML(entry.countryName)}</strong>`
              }
              <span>${SITE.escapeHTML(draw.name ?? entry.name)}</span>
            </div>
          </div>
          <div class="draw-number-row draw-number-row-highlight">
            ${mainValues
              .map(
                (value, position) => `
                  <div class="ranked-ball">
                    <span class="number-ball number-ball-small">${SITE.escapeHTML(value)}</span>
                    <small>${SITE.escapeHTML(ballRankLabel(position))}</small>
                  </div>
                `,
              )
              .join("")}
            ${
              bonusValues.length
                ? bonusValues
                    .map(
                      (value) =>
                        `<div class="ranked-ball ranked-ball-bonus"><span class="number-ball number-ball-small number-ball-bonus">${SITE.escapeHTML(value)}</span><small>Bonus</small></div>`,
                    )
                    .join("")
                : ""
            }
          </div>
          <div class="draw-card-foot">
            <span>${SITE.escapeHTML(entry.formatLabel)}</span>
            <span>${draw.bonus_balls_to_pick ? `${SITE.escapeHTML(String(draw.bonus_balls_to_pick))} bonus` : "Resultat direct"}</span>
          </div>
        </article>
      `;
    })
    .join("");
}

function buildFrequencyMaps(results) {
  const mainMap = new Map();
  const bonusMap = new Map();

  results.forEach((draw) => {
    const { mainValues, bonusValues } = collectBallValues(draw);

    mainValues.forEach((value) => {
      mainMap.set(value, (mainMap.get(value) ?? 0) + 1);
    });

    bonusValues.forEach((value) => {
      bonusMap.set(value, (bonusMap.get(value) ?? 0) + 1);
    });
  });

  const sortEntries = (map) =>
    [...map.entries()].sort((left, right) => {
      if (right[1] !== left[1]) {
        return right[1] - left[1];
      }

      return Number(left[0]) - Number(right[0]);
    });

  return {
    main: sortEntries(mainMap),
    bonus: sortEntries(bonusMap),
  };
}

function renderHotNumbers() {
  const root = document.querySelector("#lottery-hot-numbers");
  const entry = selectedEntry();
  const results = lotteryState.liveEntryId === entry.id ? lotteryState.liveResults : [];

  if (!results.length) {
    root.innerHTML = `
      <h3>Tendance probabiliste</h3>
      <p>
        On ne peut pas connaitre les futurs numeros gagnants. Cette zone montre
        seulement des tendances quand un historique reel est charge.
      </p>
      <p>
        Pour l'instant, utilise la recherche mondiale, le lien officiel et la
        grille demo de <strong>${SITE.escapeHTML(entry.name)}</strong>.
      </p>
    `;
    return;
  }

  const frequencies = buildFrequencyMaps(results);
  const hotMain = frequencies.main.slice(0, 8);
  const hotBonus = frequencies.bonus.slice(0, 4);

  root.innerHTML = `
    <h3>Numeros frequents sur l'historique charge</h3>
    <p>
      Ce ne sont pas des predictions certaines. Ce sont les numeros les plus
      vus sur les tirages actuellement affiches pour
      <strong>${SITE.escapeHTML(entry.name)}</strong>.
    </p>
    <div class="stat-ball-grid">
      ${hotMain
        .map(
          ([value, count]) => `
            <div class="number-stat">
              <span class="number-ball number-ball-small">${SITE.escapeHTML(value)}</span>
              <strong>${SITE.escapeHTML(String(count))}x</strong>
            </div>
          `,
        )
        .join("")}
    </div>
    ${
      hotBonus.length
        ? `
          <p class="detail-subline">Bonus les plus vus</p>
          <div class="stat-ball-grid">
            ${hotBonus
              .map(
                ([value, count]) => `
                  <div class="number-stat">
                    <span class="number-ball number-ball-small number-ball-bonus">${SITE.escapeHTML(value)}</span>
                    <strong>${SITE.escapeHTML(String(count))}x</strong>
                  </div>
                `,
              )
              .join("")}
          </div>
        `
        : ""
    }
  `;
}

function renderOddsPanel() {
  const root = document.querySelector("#lottery-odds-panel");
  const entry = selectedEntry();
  const liveLottery = lotteryState.liveEntryId === entry.id ? lotteryState.liveLottery : null;
  const latestDraw = latestDrawCandidate(entry);
  const rawOdds = liveLottery?.jackpot_odds ?? liveLottery?.odds;
  const parsedOdds = Number(rawOdds);
  const estimatedOdds = estimateJackpotOdds(entry);
  const hotNumbers = Array.isArray(lotteryState.liveFrequency?.hot_numbers)
    ? lotteryState.liveFrequency.hot_numbers.slice(0, 5)
    : [];
  const coldNumbers = Array.isArray(lotteryState.liveFrequency?.cold_numbers)
    ? lotteryState.liveFrequency.cold_numbers.slice(0, 5)
    : [];

  root.innerHTML = `
    <h3>Dernier resultat et probabilites</h3>
    ${latestDrawMarkup(latestDraw, entry)}
    <p>
      Jackpot:
      <strong>${
        Number.isFinite(parsedOdds) && parsedOdds > 0
          ? `1 chance sur ${SITE.escapeHTML(SITE.formatNumber(parsedOdds))}`
          : estimatedOdds
            ? `environ 1 chance sur ${SITE.escapeHTML(formatBigIntCount(estimatedOdds))}`
            : "non communique"
      }</strong>
    </p>
    <p>
      Les tendances ci-dessous ne garantissent jamais le futur tirage. Elles
      servent seulement de lecture statistique.
    </p>
    ${
      hotNumbers.length || coldNumbers.length
        ? `
          <div class="tag-row">
            ${hotNumbers.map((value) => `<span class="tag-chip">Hot ${SITE.escapeHTML(formatShortNumber(value))}</span>`).join("")}
            ${coldNumbers.map((value) => `<span class="tag-chip">Cold ${SITE.escapeHTML(formatShortNumber(value))}</span>`).join("")}
          </div>
        `
        : ""
    }
  `;
}

function scrollToResults() {
  document.querySelector("#lottery-results-zone")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

function populateYearSelect(years) {
  const select = document.querySelector("#lottery-year-select");

  if (!years.length) {
    select.innerHTML = `<option value="">Annee</option>`;
    select.disabled = true;
    return;
  }

  select.innerHTML = years
    .map(
      (year) => `
        <option value="${SITE.escapeHTML(String(year))}" ${String(year) === String(lotteryState.selectedYear) ? "selected" : ""}>
          ${SITE.escapeHTML(String(year))}
        </option>
      `,
    )
    .join("");
  select.disabled = false;
}

async function fetchCatalog(entry) {
  const cacheKey = `${entry.countryCode}-${entry.stateCode ?? ""}`;

  if (lotteryCache.has(cacheKey)) {
    return lotteryCache.get(cacheKey);
  }

  const url = new URL(`${LOTTERY_API_BASE}/lottery/lotteries`);
  url.searchParams.set("country", entry.countryCode);

  if (entry.stateCode) {
    url.searchParams.set("state", entry.stateCode);
  }

  const data = await SITE.fetchJSON(url.toString(), { headers: readTokenHeaders() });
  const lotteries = Array.isArray(data?.lotteries) ? data.lotteries : [];

  lotteryCache.set(cacheKey, lotteries);
  return lotteries;
}

function matchCatalogEntry(entry, lotteries) {
  const expectedNames = [entry.name, ...(entry.matchNames ?? []), ...(entry.aliases ?? [])].map(normalizeValue);

  return lotteries.find((item) => {
    const name = normalizeValue(item.name);
    const slug = normalizeValue(item.slug);

    return expectedNames.some(
      (expected) => name === expected || slug === expected || name.includes(expected) || expected.includes(name),
    );
  });
}

async function fetchLotteryDetail(id) {
  const url = new URL(`${LOTTERY_API_BASE}/lottery/lottery`);
  url.searchParams.set("id", String(id));
  const data = await SITE.fetchJSON(url.toString(), { headers: readTokenHeaders() });
  return data?.lottery ?? null;
}

async function fetchDrawYears(id) {
  if (drawYearCache.has(id)) {
    return drawYearCache.get(id);
  }

  const url = new URL(`${LOTTERY_API_BASE}/lottery/draw-years`);
  url.searchParams.set("id", String(id));
  const data = await SITE.fetchJSON(url.toString(), { headers: readTokenHeaders() });
  const years = Array.isArray(data?.draw_years) ? data.draw_years : [];

  drawYearCache.set(id, years);
  return years;
}

async function fetchResults(id, year) {
  const cacheKey = `${id}-${year || "latest"}`;

  if (resultsCache.has(cacheKey)) {
    return resultsCache.get(cacheKey);
  }

  const url = new URL(`${LOTTERY_API_BASE}/lottery/results`);
  url.searchParams.set("id", String(id));

  if (year) {
    url.searchParams.set("year", String(year));
  }

  const data = await SITE.fetchJSON(url.toString(), { headers: readTokenHeaders() });
  const results = Array.isArray(data?.results) ? data.results : [];

  resultsCache.set(cacheKey, results);
  return results;
}

async function fetchFrequency(id, year) {
  const cacheKey = `${id}-${year || "latest"}-frequency`;

  if (frequencyCache.has(cacheKey)) {
    return frequencyCache.get(cacheKey);
  }

  const url = new URL(`${LOTTERY_API_BASE}/lottery/frequency`);
  url.searchParams.set("id", String(id));

  if (year) {
    url.searchParams.set("year", String(year));
  }

  const data = await SITE.fetchJSON(url.toString(), { headers: readTokenHeaders() });
  const frequency = data?.frequency ?? null;

  frequencyCache.set(cacheKey, frequency);
  return frequency;
}

async function loadLiveData(force = false) {
  const entry = selectedEntry();

  if (!lotteryState.apiToken) {
    lotteryState.liveEntryId = "";
    lotteryState.liveLottery = null;
    lotteryState.liveResults = [];
    lotteryState.liveFrequency = null;
    lotteryState.availableYears = [];
    lotteryState.selectedYear = "";
    populateYearSelect([]);
    renderLotteryDetail();
    renderOfficialLinks();
    renderFormatNote();
    renderHotNumbers();
    renderOddsPanel();
    renderResultsPlaceholder("Ajoute un token live pour charger les tirages reels");
    SITE.setStatus(document.querySelector("#lottery-status"), "Annuaire mondial charge", "neutral");
    return;
  }

  try {
    SITE.setStatus(document.querySelector("#lottery-status"), "Recherche live en cours", "neutral");
    SITE.setStatus(document.querySelector("#lottery-results-status"), "Chargement des tirages", "neutral");

    if (force) {
      const cacheKey = `${entry.countryCode}-${entry.stateCode ?? ""}`;
      lotteryCache.delete(cacheKey);
      drawYearCache.clear();
      resultsCache.clear();
      frequencyCache.clear();
    }

    const catalog = await fetchCatalog(entry);
    const match = matchCatalogEntry(entry, catalog);

    if (!match?.id) {
      lotteryState.liveEntryId = "";
      lotteryState.liveLottery = null;
      lotteryState.liveResults = [];
      lotteryState.liveFrequency = null;
      lotteryState.availableYears = [];
      lotteryState.selectedYear = "";
      populateYearSelect([]);
      renderLotteryDetail();
      renderOfficialLinks();
      renderFormatNote();
      renderHotNumbers();
      renderOddsPanel();
      renderResultsPlaceholder("Aucune correspondance live trouvee pour cette recherche", "error");
      SITE.setStatus(document.querySelector("#lottery-status"), "Correspondance live absente", "error");
      return;
    }

    const [liveLottery, years] = await Promise.all([fetchLotteryDetail(match.id), fetchDrawYears(match.id)]);

    lotteryState.liveEntryId = entry.id;
    lotteryState.liveLottery = liveLottery ?? match;
    lotteryState.availableYears = years;
    lotteryState.selectedYear =
      years.map(String).includes(String(lotteryState.selectedYear)) ? String(lotteryState.selectedYear) : String(years[0] ?? "");

    populateYearSelect(years);

    const [results, frequency] = await Promise.all([
      fetchResults(match.id, lotteryState.selectedYear),
      fetchFrequency(match.id, lotteryState.selectedYear).catch(() => null),
    ]);
    lotteryState.liveResults = results.slice(0, 12);
    lotteryState.liveFrequency = frequency;

    renderLotteryDetail();
    renderOfficialLinks();
    renderFormatNote();
    renderDrawResults();
    renderHotNumbers();
    renderOddsPanel();
    SITE.setStatus(document.querySelector("#lottery-status"), `${entry.name} charge`, "live");
    SITE.setStatus(
      document.querySelector("#lottery-results-status"),
      lotteryState.selectedYear ? `Tirages ${lotteryState.selectedYear}` : "Tirages charges",
      "live",
    );
  } catch (error) {
    lotteryState.liveEntryId = "";
    lotteryState.liveLottery = null;
    lotteryState.liveResults = [];
    lotteryState.liveFrequency = null;
    lotteryState.availableYears = [];
    lotteryState.selectedYear = "";
    populateYearSelect([]);
    renderLotteryDetail();
    renderOfficialLinks();
    renderFormatNote();
    renderHotNumbers();
    renderOddsPanel();
    renderResultsPlaceholder("Impossible de charger les tirages live pour le moment", "error");
    SITE.setStatus(document.querySelector("#lottery-status"), "Erreur live", "error");
  }
}

function selectEntry(entryId) {
  lotteryState.selectedId = entryId;
  lotteryState.generated = generateDemoGrid(selectedEntry());
  renderPulse();
  renderSearchResults(getSearchResults(lotteryState.query), lotteryState.query);
  renderLotteryDetail();
  renderOfficialLinks();
  renderFormatNote();
  renderHotNumbers();
  renderOddsPanel();
  renderGenerated();
  document.querySelector("#generator-status").innerHTML = "";
  loadLiveData();
}

function performSearch(query, autoSelect = false) {
  lotteryState.query = query.trim();
  const results = getSearchResults(lotteryState.query);
  const normalizedQuery = normalizeValue(lotteryState.query);

  renderSearchResults(results, lotteryState.query);

  if (autoSelect && results.length) {
    const exactMatch = results.find(
      (entry) =>
        normalizeValue(entry.name) === normalizedQuery ||
        (entry.aliases ?? []).some((alias) => normalizeValue(alias) === normalizedQuery),
    );

    if (exactMatch) {
      selectEntry(exactMatch.id);
      scrollToResults();
      return;
    }

    if (results.length === 1) {
      selectEntry(results[0].id);
      scrollToResults();
    }
  }
}

function setupSearch() {
  const form = document.querySelector("#lottery-search-form");
  const input = document.querySelector("#lottery-query");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    performSearch(input.value, true);
  });

  input.addEventListener("input", () => {
    performSearch(input.value, false);
  });
}

function setupTokenForm() {
  const form = document.querySelector("#lottery-token-form");
  const input = document.querySelector("#lottery-token-input");
  const clearButton = document.querySelector("#clear-lottery-token");

  input.value = lotteryState.apiToken;
  renderTokenStatus(
    lotteryState.apiToken
      ? "Token live enregistre localement dans ce navigateur."
      : "Aucun token live enregistre. Le mode annuaire reste disponible.",
  );

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    lotteryState.apiToken = input.value.trim();

    if (!lotteryState.apiToken) {
      localStorage.removeItem(LOTTERY_TOKEN_KEY);
      renderTokenStatus("Token vide. Le mode live a ete retire.");
      loadLiveData(true);
      renderPulse();
      return;
    }

    localStorage.setItem(LOTTERY_TOKEN_KEY, lotteryState.apiToken);
    renderTokenStatus("Token enregistre. Tu peux maintenant tenter le chargement live.");
    renderPulse();
    loadLiveData(true);
  });

  clearButton.addEventListener("click", () => {
    lotteryState.apiToken = "";
    input.value = "";
    localStorage.removeItem(LOTTERY_TOKEN_KEY);
    renderTokenStatus("Token efface. Retour au mode annuaire.");
    renderPulse();
    loadLiveData(true);
  });
}

function setupGenerator() {
  document.querySelector("#generate-lottery").addEventListener("click", () => {
    lotteryState.generated = generateDemoGrid(selectedEntry());
    renderGenerated();
    document.querySelector("#generator-status").innerHTML =
      '<span class="tag-chip">Nouvelle combinaison demo generee.</span>';
  });

  document.querySelector("#copy-lottery").addEventListener("click", async () => {
    const target = serializeGeneratedGrid();

    try {
      await navigator.clipboard.writeText(target);
      document.querySelector("#generator-status").innerHTML =
        '<span class="tag-chip">Combinaison copiee dans le presse-papiers.</span>';
    } catch (error) {
      document.querySelector("#generator-status").innerHTML =
        `<span class="tag-chip tag-chip-error">${SITE.escapeHTML(target)}</span>`;
    }
  });
}

function setupResultControls() {
  const select = document.querySelector("#lottery-year-select");
  const refreshButton = document.querySelector("#refresh-lottery-results");

  select.addEventListener("change", () => {
    lotteryState.selectedYear = select.value;
    loadLiveData();
  });

  refreshButton.addEventListener("click", () => {
    loadLiveData(true);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  SITE.setupMenu();
  SITE.observeReveals();
  renderQuickSearches();
  renderPulse();
  renderLotteryDetail();
  renderOfficialLinks();
  renderFormatNote();
  renderHotNumbers();
  renderOddsPanel();
  lotteryState.generated = generateDemoGrid(selectedEntry());
  renderGenerated();
  renderSearchResults(getSearchResults(""), "");
  setupSearch();
  setupTokenForm();
  setupGenerator();
  setupResultControls();
  loadLiveData();
});
