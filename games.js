const STEAM_CURRENT_PLAYERS_API = "https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/";

const gameCatalog = [
  {
    id: "counter-strike-2",
    steamAppId: 730,
    name: "Counter-Strike 2",
    genre: "FPS",
    platforms: ["pc"],
    tags: ["steam-live", "competitive", "esport"],
    summary: "Reference competitive majeure sur PC avec compteur Steam public.",
    officialUrl: "https://www.counter-strike.net/",
    popularity: 98,
  },
  {
    id: "dota-2",
    steamAppId: 570,
    name: "Dota 2",
    genre: "MOBA",
    platforms: ["pc"],
    tags: ["steam-live", "moba", "esport"],
    summary: "Un des piliers des jeux competitifs PC avec live Steam.",
    officialUrl: "https://www.dota2.com/",
    popularity: 94,
  },
  {
    id: "fortnite",
    name: "Fortnite",
    genre: "Battle Royale",
    platforms: ["pc", "playstation", "xbox", "switch", "mobile"],
    tags: ["cross-platform", "battle royale", "epic"],
    summary: "Geant mondial multi-plateforme, souvent au centre des tendances gaming.",
    officialUrl: "https://www.fortnite.com/",
    popularity: 99,
  },
  {
    id: "roblox",
    name: "Roblox",
    genre: "Sandbox",
    platforms: ["pc", "mobile", "playstation", "xbox"],
    tags: ["cross-platform", "ugc", "social"],
    summary: "Immense ecosysteme de jeux et experiences joues partout dans le monde.",
    officialUrl: "https://www.roblox.com/",
    popularity: 98,
  },
  {
    id: "minecraft",
    name: "Minecraft",
    nameSearch: "Minecraft Bedrock Java",
    genre: "Sandbox",
    platforms: ["pc", "mobile", "playstation", "xbox", "switch"],
    tags: ["cross-platform", "sandbox", "building"],
    summary: "Toujours au sommet des jeux mondiaux grace a son presence sur presque toutes les plateformes.",
    officialUrl: "https://www.minecraft.net/",
    popularity: 99,
  },
  {
    id: "pubg-battlegrounds",
    steamAppId: 578080,
    name: "PUBG: BATTLEGROUNDS",
    genre: "Battle Royale",
    platforms: ["pc", "playstation", "xbox"],
    tags: ["steam-live", "battle royale", "shooter"],
    summary: "Toujours solide sur PC et consoles pour les amateurs de battle royale tactique.",
    officialUrl: "https://pubg.com/",
    popularity: 88,
  },
  {
    id: "pubg-mobile",
    name: "PUBG Mobile",
    genre: "Battle Royale",
    platforms: ["mobile"],
    tags: ["mobile", "battle royale", "shooter"],
    summary: "Version mobile tres jouee dans de nombreuses regions du monde.",
    officialUrl: "https://www.pubgmobile.com/",
    popularity: 95,
  },
  {
    id: "free-fire",
    name: "Free Fire",
    genre: "Battle Royale",
    platforms: ["mobile"],
    tags: ["mobile", "battle royale", "global"],
    summary: "Tres puissant sur mobile dans plusieurs marches internationaux.",
    officialUrl: "https://ff.garena.com/",
    popularity: 94,
  },
  {
    id: "apex-legends",
    steamAppId: 1172470,
    name: "Apex Legends",
    genre: "Hero Shooter",
    platforms: ["pc", "playstation", "xbox", "switch"],
    tags: ["steam-live", "battle royale", "cross-platform"],
    summary: "FPS hero shooter multi-plateforme avec audience soutenue.",
    officialUrl: "https://www.ea.com/games/apex-legends",
    popularity: 90,
  },
  {
    id: "valorant",
    name: "VALORANT",
    genre: "Tactical Shooter",
    platforms: ["pc", "console"],
    tags: ["competitive", "fps", "riot"],
    summary: "Jeu competitif majeur sur PC et progressivement sur consoles.",
    officialUrl: "https://playvalorant.com/",
    popularity: 95,
  },
  {
    id: "league-of-legends",
    name: "League of Legends",
    genre: "MOBA",
    platforms: ["pc"],
    tags: ["moba", "esport", "riot"],
    summary: "Reference mondiale pour les MOBA competitifs.",
    officialUrl: "https://www.leagueoflegends.com/",
    popularity: 97,
  },
  {
    id: "genshin-impact",
    name: "Genshin Impact",
    genre: "Action RPG",
    platforms: ["pc", "mobile", "playstation"],
    tags: ["cross-platform", "rpg", "gacha"],
    summary: "Tres visible sur mobile, PC et PlayStation.",
    officialUrl: "https://genshin.hoyoverse.com/",
    popularity: 92,
  },
  {
    id: "call-of-duty-warzone",
    name: "Call of Duty: Warzone",
    genre: "Shooter",
    platforms: ["pc", "playstation", "xbox"],
    tags: ["cross-platform", "fps", "battle royale"],
    summary: "Gros bloc shooter multi-plateforme dans l'univers Call of Duty.",
    officialUrl: "https://www.callofduty.com/warzone",
    popularity: 93,
  },
  {
    id: "ea-sports-fc-25",
    name: "EA Sports FC 25",
    genre: "Sport",
    platforms: ["pc", "playstation", "xbox", "switch"],
    tags: ["football", "sport", "annual"],
    summary: "La licence foot grand public la plus forte sur consoles et PC.",
    officialUrl: "https://www.ea.com/games/ea-sports-fc/fc-25",
    popularity: 90,
  },
  {
    id: "mario-kart-8-deluxe",
    name: "Mario Kart 8 Deluxe",
    genre: "Arcade Racing",
    platforms: ["switch"],
    tags: ["switch", "party", "nintendo"],
    summary: "Indispensable sur Nintendo Switch, toujours tres joue.",
    officialUrl: "https://mariokart8.nintendo.com/",
    popularity: 91,
  },
  {
    id: "animal-crossing",
    name: "Animal Crossing: New Horizons",
    genre: "Life Sim",
    platforms: ["switch"],
    tags: ["switch", "casual", "nintendo"],
    summary: "Titre Switch majeur sur la duree avec grande base de fans.",
    officialUrl: "https://www.animal-crossing.com/new-horizons/",
    popularity: 84,
  },
  {
    id: "zelda-totk",
    name: "The Legend of Zelda: Tears of the Kingdom",
    genre: "Action Adventure",
    platforms: ["switch"],
    tags: ["switch", "adventure", "nintendo"],
    summary: "Un des poids lourds premium de la Switch.",
    officialUrl: "https://www.zelda.com/tears-of-the-kingdom/",
    popularity: 86,
  },
  {
    id: "forza-horizon-5",
    name: "Forza Horizon 5",
    genre: "Racing",
    platforms: ["pc", "xbox"],
    tags: ["xbox", "racing", "open world"],
    summary: "Pilier du jeu de course sur Xbox et PC.",
    officialUrl: "https://forza.net/",
    popularity: 85,
  },
  {
    id: "brawl-stars",
    name: "Brawl Stars",
    genre: "Action",
    platforms: ["mobile"],
    tags: ["mobile", "arena", "supercell"],
    summary: "Mobile nerveux tres populaire en sessions courtes.",
    officialUrl: "https://supercell.com/en/games/brawlstars/",
    popularity: 89,
  },
  {
    id: "clash-royale",
    name: "Clash Royale",
    genre: "Strategy",
    platforms: ["mobile"],
    tags: ["mobile", "strategy", "supercell"],
    summary: "Jeu mobile competitif toujours fort sur la duree.",
    officialUrl: "https://supercell.com/en/games/clashroyale/",
    popularity: 87,
  },
  {
    id: "warframe",
    steamAppId: 230410,
    name: "Warframe",
    genre: "Action",
    platforms: ["pc", "playstation", "xbox", "switch"],
    tags: ["steam-live", "co-op", "cross-platform"],
    summary: "Action co-op installee sur plusieurs plateformes avec lecture Steam publique.",
    officialUrl: "https://www.warframe.com/",
    popularity: 82,
  },
  {
    id: "grand-theft-auto-v",
    steamAppId: 271590,
    name: "Grand Theft Auto V / Online",
    genre: "Open World",
    platforms: ["pc", "playstation", "xbox"],
    tags: ["steam-live", "open world", "online"],
    summary: "Toujours enorme quand on parle de jeux monde et de temps de jeu.",
    officialUrl: "https://www.rockstargames.com/gta-v",
    popularity: 93,
  },
];

const quickGameFilters = [
  { id: "all", label: "Tout" },
  { id: "pc", label: "PC" },
  { id: "mobile", label: "Mobile" },
  { id: "playstation", label: "PlayStation" },
  { id: "xbox", label: "Xbox" },
  { id: "switch", label: "Switch" },
  { id: "steam-live", label: "Steam live" },
  { id: "cross-platform", label: "Cross-platform" },
];

const platformLabels = {
  pc: "PC",
  mobile: "Mobile",
  playstation: "PlayStation",
  xbox: "Xbox",
  switch: "Switch",
  console: "Console",
};

const gamesState = {
  query: "",
  filterId: "all",
  items: gameCatalog.map((game) => ({
    ...game,
    players: null,
  })),
  selectedId: "counter-strike-2",
};

function normalizeGameText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function selectedGame() {
  return gamesState.items.find((game) => game.id === gamesState.selectedId) ?? gamesState.items[0];
}

function platformLabel(platform) {
  return platformLabels[platform] ?? platform;
}

function rankingValue(game) {
  if (Number.isFinite(game.players)) {
    return game.players;
  }

  return game.popularity * 1000;
}

async function fetchCurrentPlayers(appid) {
  const url = new URL(STEAM_CURRENT_PLAYERS_API);
  url.searchParams.set("appid", String(appid));
  const data = await SITE.fetchJSON(url.toString());
  return Number(data?.response?.player_count ?? NaN);
}

function gameMatchesFilter(game) {
  if (gamesState.filterId === "all") {
    return true;
  }

  if (gamesState.filterId === "steam-live") {
    return Boolean(game.steamAppId);
  }

  if (gamesState.filterId === "cross-platform") {
    return game.platforms.length >= 3;
  }

  return game.platforms.includes(gamesState.filterId);
}

function filterGames(query) {
  const normalizedQuery = normalizeGameText(query);

  return gamesState.items.filter((game) => {
    if (!gameMatchesFilter(game)) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    return normalizeGameText(
      [game.name, game.nameSearch ?? "", game.genre, ...game.tags, ...game.platforms.map(platformLabel)].join(" "),
    ).includes(normalizedQuery);
  });
}

function renderGamePulse() {
  const root = document.querySelector("#games-pulse");
  const visible = filterGames(gamesState.query).sort((left, right) => rankingValue(right) - rankingValue(left));
  const leader = visible[0];
  const liveSteamCount = gamesState.items.filter((item) => item.steamAppId).length;
  const platformSet = new Set(visible.flatMap((item) => item.platforms));

  root.innerHTML = `
    <div class="pulse-card">
      <span>Catalogue</span>
      <strong>${SITE.escapeHTML(String(gamesState.items.length))}</strong>
      <p>Jeux suivis dans le board</p>
    </div>
    <div class="pulse-card">
      <span>Leader</span>
      <strong>${SITE.escapeHTML(leader?.name ?? "--")}</strong>
      <p>${leader && Number.isFinite(leader.players) ? `${SITE.escapeHTML(SITE.formatNumber(leader.players))} joueurs Steam` : "Classement multi-plateforme"}</p>
    </div>
    <div class="pulse-card">
      <span>Plateformes</span>
      <strong>${SITE.escapeHTML(String(platformSet.size || 0))}</strong>
      <p>PC, mobile, consoles</p>
    </div>
    <div class="pulse-card">
      <span>Steam live</span>
      <strong>${SITE.escapeHTML(String(liveSteamCount))}</strong>
      <p>Titres avec compteur public</p>
    </div>
  `;
}

function renderPlatformSummary(items) {
  const root = document.querySelector("#games-platform-summary");
  const visiblePlatforms = [...new Set(items.flatMap((item) => item.platforms))];

  root.innerHTML = `
    <span class="tag-chip">${SITE.escapeHTML(String(items.length))} jeux visibles</span>
    <span class="tag-chip">Filtre ${SITE.escapeHTML(quickGameFilters.find((item) => item.id === gamesState.filterId)?.label ?? "Tout")}</span>
    <span class="tag-chip">${SITE.escapeHTML(visiblePlatforms.map(platformLabel).join(", ") || "Aucune plateforme")}</span>
  `;
}

function renderSourceNote() {
  const root = document.querySelector("#games-source-note");
  const steamVisible = gamesState.items.filter((item) => item.steamAppId).length;

  root.innerHTML = `
    <h3>Source du classement</h3>
    <p>
      Quand un jeu a un compteur public Steam, la page montre les joueurs
      actuels. Pour les autres plateformes, le board reste editorial et
      multi-plateforme.
    </p>
    <p>
      Jeux avec live Steam:
      <strong>${SITE.escapeHTML(String(steamVisible))}</strong>.
    </p>
    <p>
      Les consoles et mobiles n'exposent pas toujours des chiffres live publics,
      donc la page les garde dans un catalogue mondial plus large.
    </p>
  `;
}

function renderGameDetail() {
  const root = document.querySelector("#games-detail");
  const game = selectedGame();

  root.innerHTML = `
    <h3>${SITE.escapeHTML(game.name)}</h3>
    <p>
      Genre: <strong>${SITE.escapeHTML(game.genre)}</strong>
    </p>
    <p>
      Plateformes:
      <strong>${SITE.escapeHTML(game.platforms.map(platformLabel).join(", "))}</strong>
    </p>
    <p>
      ${
        Number.isFinite(game.players)
          ? `Joueurs Steam actuels: <strong>${SITE.escapeHTML(SITE.formatNumber(game.players))}</strong>`
          : `Indice de popularite editorial: <strong>${SITE.escapeHTML(String(game.popularity))}/100</strong>`
      }
    </p>
    <p>${SITE.escapeHTML(game.summary)}</p>
    <div class="tag-row">
      ${game.tags.map((tag) => `<span class="tag-chip">${SITE.escapeHTML(tag)}</span>`).join("")}
      ${game.platforms.map((platform) => `<span class="tag-chip">${SITE.escapeHTML(platformLabel(platform))}</span>`).join("")}
    </div>
    <div class="button-row">
      <a class="button button-solid" href="${SITE.safeUrl(game.officialUrl, "#")}" target="_blank" rel="noreferrer">Site officiel</a>
    </div>
  `;
}

function renderGameList(items) {
  const root = document.querySelector("#games-list");

  if (!items.length) {
    root.innerHTML = '<div class="empty-state">Aucun jeu ne correspond a ce filtre.</div>';
    return;
  }

  const sortedItems = [...items].sort((left, right) => rankingValue(right) - rankingValue(left));

  root.innerHTML = sortedItems
    .map(
      (game, index) => `
        <button class="game-card ${game.id === gamesState.selectedId ? "is-active" : ""}" type="button" data-game-id="${SITE.escapeHTML(game.id)}">
          <div class="game-card-head">
            <div>
              <p class="article-tag">#${SITE.escapeHTML(String(index + 1))}</p>
              <h3>${SITE.escapeHTML(game.name)}</h3>
            </div>
            <span class="coin-badge">${SITE.escapeHTML(game.genre)}</span>
          </div>
          <p>${SITE.escapeHTML(game.summary)}</p>
          <div class="game-stat-row">
            <strong>${Number.isFinite(game.players) ? SITE.escapeHTML(SITE.formatNumber(game.players)) : SITE.escapeHTML(String(game.popularity)) + "/100"}</strong>
            <span>${Number.isFinite(game.players) ? "joueurs Steam" : "indice global"}</span>
          </div>
          <div class="tag-row">
            ${game.platforms.map((platform) => `<span class="tag-chip">${SITE.escapeHTML(platformLabel(platform))}</span>`).join("")}
          </div>
        </button>
      `,
    )
    .join("");

  root.querySelectorAll("[data-game-id]").forEach((button) => {
    button.addEventListener("click", () => {
      gamesState.selectedId = button.dataset.gameId ?? gamesState.selectedId;
      const filtered = filterGames(gamesState.query);
      renderGameList(filtered);
      renderGameDetail();
    });
  });
}

function renderQuickFilters() {
  const root = document.querySelector("#games-quick-filters");

  root.innerHTML = quickGameFilters
    .map(
      (filter) => `
        <button class="pill-button ${filter.id === gamesState.filterId ? "is-active" : ""}" type="button" data-filter="${SITE.escapeHTML(filter.id)}">
          ${SITE.escapeHTML(filter.label)}
        </button>
      `,
    )
    .join("");

  root.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      gamesState.filterId = button.dataset.filter ?? gamesState.filterId;
      renderQuickFilters();
      const filtered = filterGames(gamesState.query);

      if (!filtered.some((game) => game.id === gamesState.selectedId)) {
        gamesState.selectedId = filtered[0]?.id ?? gamesState.items[0]?.id;
      }

      renderPlatformSummary(filtered);
      renderGamePulse();
      renderGameList(filtered);
      renderGameDetail();
      renderSourceNote();
    });
  });
}

async function refreshGamePlayers() {
  try {
    SITE.setStatus(document.querySelector("#games-status"), "Chargement du board jeux", "neutral");
    const items = await Promise.all(
      gamesState.items.map(async (game) => ({
        ...game,
        players: game.steamAppId ? await fetchCurrentPlayers(game.steamAppId) : null,
      })),
    );

    gamesState.items = items;

    const filtered = filterGames(gamesState.query);

    if (!filtered.some((game) => game.id === gamesState.selectedId)) {
      gamesState.selectedId = filtered[0]?.id ?? gamesState.items[0]?.id;
    }

    renderGamePulse();
    renderPlatformSummary(filtered);
    renderGameList(filtered);
    renderGameDetail();
    renderSourceNote();
    SITE.setStatus(document.querySelector("#games-status"), "Catalogue multi-plateforme charge", "live");
  } catch (error) {
    const filtered = filterGames(gamesState.query);
    renderGamePulse();
    renderPlatformSummary(filtered);
    renderGameList(filtered);
    renderGameDetail();
    renderSourceNote();
    SITE.setStatus(document.querySelector("#games-status"), "Impossible de charger les compteurs Steam", "error");
  }
}

function setupSearch() {
  const form = document.querySelector("#games-search-form");
  const input = document.querySelector("#games-query");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    gamesState.query = input.value.trim();
    const filtered = filterGames(gamesState.query);

    if (!filtered.some((game) => game.id === gamesState.selectedId)) {
      gamesState.selectedId = filtered[0]?.id ?? gamesState.items[0]?.id;
    }

    renderPlatformSummary(filtered);
    renderGamePulse();
    renderGameList(filtered);
    renderGameDetail();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  SITE.setupMenu();
  SITE.observeReveals();
  renderQuickFilters();
  renderGamePulse();
  renderPlatformSummary(filterGames(""));
  renderGameList(filterGames(""));
  renderGameDetail();
  renderSourceNote();
  setupSearch();
  document.querySelector("#refresh-games").addEventListener("click", refreshGamePlayers);
  refreshGamePlayers();
});
