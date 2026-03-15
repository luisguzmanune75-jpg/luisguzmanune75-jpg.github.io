const SPORTS_API_BASE = "https://www.thesportsdb.com/api/v1/json/123";

const featuredLeagues = [
  { id: "premier-league", name: "Premier League", country: "England", sport: "Soccer" },
  { id: "la-liga", name: "Spanish La Liga", country: "Spain", sport: "Soccer" },
  { id: "serie-a", name: "Italian Serie A", country: "Italy", sport: "Soccer" },
  { id: "ligue-1", name: "French Ligue 1", country: "France", sport: "Soccer" },
  { id: "nba", name: "NBA", country: "USA", sport: "Basketball" },
  { id: "nfl", name: "NFL", country: "USA", sport: "American Football" },
];

const sportsState = {
  query: "",
  mode: "league",
  activeLeague: null,
  activeTeam: null,
  nextEvents: [],
  pastEvents: [],
  searchResults: [],
  eventInsights: {},
  selectedEventId: "",
};

const leagueCache = new Map();
const teamEventsCache = new Map();
const teamFormCache = new Map();

function normalizeSportText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function scoreLabel(home, away) {
  const homeScore = Number(home);
  const awayScore = Number(away);

  if (!Number.isFinite(homeScore) || !Number.isFinite(awayScore)) {
    return "A venir";
  }

  return `${homeScore} - ${awayScore}`;
}

function formatEventDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value || "--";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function eventId(event) {
  return (
    event?.idEvent ||
    `${event?.strHomeTeam ?? "home"}-${event?.strAwayTeam ?? "away"}-${event?.dateEvent ?? event?.strTimestamp ?? ""}`
  );
}

function supportsDraw(event) {
  const sportName = normalizeSportText(
    event?.strSport ?? sportsState.activeLeague?.strSport ?? sportsState.activeTeam?.strSport,
  );

  return sportName === "soccer";
}

function selectedInsight() {
  return sportsState.eventInsights[sportsState.selectedEventId] ?? null;
}

async function fetchLeague(leagueRef) {
  if (leagueCache.has(leagueRef.id)) {
    return leagueCache.get(leagueRef.id);
  }

  const url = new URL(`${SPORTS_API_BASE}/search_all_leagues.php`);
  url.searchParams.set("c", leagueRef.country);
  url.searchParams.set("s", leagueRef.sport);

  const data = await SITE.fetchJSON(url.toString());
  const leagues = Array.isArray(data?.countries) ? data.countries : [];
  const normalizedName = normalizeSportText(leagueRef.name);
  const match =
    leagues.find((league) => normalizeSportText(league.strLeague) === normalizedName) ??
    leagues.find((league) => normalizeSportText(league.strLeague).includes(normalizedName));

  leagueCache.set(leagueRef.id, match ?? null);
  return match ?? null;
}

async function fetchLeagueEvents(idLeague) {
  const nextUrl = new URL(`${SPORTS_API_BASE}/eventsnextleague.php`);
  nextUrl.searchParams.set("id", idLeague);

  const pastUrl = new URL(`${SPORTS_API_BASE}/eventspastleague.php`);
  pastUrl.searchParams.set("id", idLeague);

  const [nextData, pastData] = await Promise.all([
    SITE.fetchJSON(nextUrl.toString()),
    SITE.fetchJSON(pastUrl.toString()),
  ]);

  return {
    next: Array.isArray(nextData?.events) ? nextData.events : [],
    past: Array.isArray(pastData?.events) ? pastData.events : [],
  };
}

async function fetchTeamSearch(query) {
  const url = new URL(`${SPORTS_API_BASE}/searchteams.php`);
  url.searchParams.set("t", query);
  const data = await SITE.fetchJSON(url.toString());
  return Array.isArray(data?.teams) ? data.teams : [];
}

async function fetchTeamEvents(idTeam) {
  if (teamEventsCache.has(idTeam)) {
    return teamEventsCache.get(idTeam);
  }

  const nextUrl = new URL(`${SPORTS_API_BASE}/eventsnext.php`);
  nextUrl.searchParams.set("id", idTeam);

  const pastUrl = new URL(`${SPORTS_API_BASE}/eventslast.php`);
  pastUrl.searchParams.set("id", idTeam);

  const request = Promise.all([SITE.fetchJSON(nextUrl.toString()), SITE.fetchJSON(pastUrl.toString())]).then(
    ([nextData, pastData]) => ({
      next: Array.isArray(nextData?.events) ? nextData.events : [],
      past: Array.isArray(pastData?.results)
        ? pastData.results
        : Array.isArray(pastData?.events)
          ? pastData.events
          : [],
    }),
  );

  teamEventsCache.set(idTeam, request);
  return request;
}

function buildTeamForm(events, teamId) {
  const relevant = (events ?? [])
    .filter((event) => Number.isFinite(Number(event.intHomeScore)) && Number.isFinite(Number(event.intAwayScore)))
    .slice(0, 5);

  if (!relevant.length) {
    return {
      matches: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      pointsPerMatch: 1,
      goalDiffPerMatch: 0,
      attackIndex: 1,
      defenseIndex: 1,
      momentum: 1,
    };
  }

  let wins = 0;
  let draws = 0;
  let losses = 0;
  let scored = 0;
  let conceded = 0;

  relevant.forEach((event) => {
    const homeScore = Number(event.intHomeScore);
    const awayScore = Number(event.intAwayScore);
    const isHome = String(event.idHomeTeam ?? "") === String(teamId);
    const teamScore = isHome ? homeScore : awayScore;
    const oppScore = isHome ? awayScore : homeScore;

    scored += teamScore;
    conceded += oppScore;

    if (teamScore > oppScore) {
      wins += 1;
    } else if (teamScore < oppScore) {
      losses += 1;
    } else {
      draws += 1;
    }
  });

  const matches = relevant.length;
  const points = wins * 3 + draws;
  const scoredRate = scored / matches;
  const concededRate = conceded / matches;
  const goalDiffPerMatch = (scored - conceded) / matches;
  const pointsPerMatch = points / matches;

  return {
    matches,
    wins,
    draws,
    losses,
    pointsPerMatch,
    goalDiffPerMatch,
    attackIndex: clamp(0.55 + scoredRate / 2.8, 0.35, 1.8),
    defenseIndex: clamp(1.35 - concededRate / 2.6, 0.35, 1.5),
    momentum: clamp(0.55 + pointsPerMatch / 2.5 + goalDiffPerMatch / 4, 0.3, 1.95),
  };
}

async function fetchTeamForm(idTeam) {
  if (!idTeam) {
    return buildTeamForm([], "");
  }

  if (teamFormCache.has(idTeam)) {
    return teamFormCache.get(idTeam);
  }

  const request = fetchTeamEvents(idTeam).then((data) => buildTeamForm(data.past, idTeam));
  teamFormCache.set(idTeam, request);
  return request;
}

async function buildEventInsight(event) {
  if (!event?.idHomeTeam || !event?.idAwayTeam) {
    return null;
  }

  const [homeForm, awayForm] = await Promise.all([fetchTeamForm(event.idHomeTeam), fetchTeamForm(event.idAwayTeam)]);
  const drawSport = supportsDraw(event);
  const homeStrength = clamp(
    homeForm.momentum * 0.58 + homeForm.attackIndex * 0.18 + homeForm.defenseIndex * 0.14 + 0.16,
    0.25,
    2.5,
  );
  const awayStrength = clamp(
    awayForm.momentum * 0.58 + awayForm.attackIndex * 0.18 + awayForm.defenseIndex * 0.14,
    0.25,
    2.5,
  );
  const totalStrength = homeStrength + awayStrength;
  const closeness = 1 - Math.min(Math.abs(homeStrength - awayStrength) / totalStrength, 1);
  const drawProbability = drawSport ? clamp(0.14 + closeness * 0.16, 0.14, 0.3) : 0;
  const homeProbability = (1 - drawProbability) * (homeStrength / totalStrength);
  const awayProbability = 1 - drawProbability - homeProbability;
  const reasons = [];

  if (homeForm.pointsPerMatch > awayForm.pointsPerMatch + 0.35) {
    reasons.push(`${event.strHomeTeam} arrive avec une meilleure forme recente.`);
  } else if (awayForm.pointsPerMatch > homeForm.pointsPerMatch + 0.35) {
    reasons.push(`${event.strAwayTeam} arrive avec une meilleure forme recente.`);
  } else {
    reasons.push("La forme recente est assez proche entre les deux equipes.");
  }

  if (drawSport && closeness > 0.75) {
    reasons.push("Le modele voit un match serre, donc le nul garde du poids.");
  }

  reasons.push("Le domicile ajoute un leger avantage statistique au club qui recoit.");

  return {
    eventId: eventId(event),
    homeProbability,
    drawProbability,
    awayProbability,
    homeForm,
    awayForm,
    reasons,
  };
}

function probabilityPercent(value) {
  if (!Number.isFinite(value)) {
    return "--";
  }

  return `${Math.round(value * 100)}%`;
}

function renderSportsPulse() {
  const root = document.querySelector("#sports-pulse");
  const title =
    sportsState.mode === "team"
      ? sportsState.activeTeam?.strTeam ?? "Equipe"
      : sportsState.activeLeague?.strLeague ?? "Ligue";
  const insightCount = Object.keys(sportsState.eventInsights).length;

  root.innerHTML = `
    <div class="pulse-card">
      <span>Mode</span>
      <strong>${SITE.escapeHTML(sportsState.mode === "team" ? "Equipe" : "Ligue")}</strong>
      <p>Lecture info, pas conseil de pari</p>
    </div>
    <div class="pulse-card">
      <span>Selection</span>
      <strong>${SITE.escapeHTML(title)}</strong>
      <p>${SITE.escapeHTML(
        sportsState.mode === "team"
          ? sportsState.activeTeam?.strLeague ?? "Recherche libre"
          : sportsState.activeLeague?.strSport ?? "Sport",
      )}</p>
    </div>
    <div class="pulse-card">
      <span>A venir</span>
      <strong>${SITE.escapeHTML(String(sportsState.nextEvents.length))}</strong>
      <p>Matchs charges</p>
    </div>
    <div class="pulse-card">
      <span>Probabilites</span>
      <strong>${SITE.escapeHTML(String(insightCount))}</strong>
      <p>Estimations calculees</p>
    </div>
  `;
}

function renderSportsBriefing() {
  const root = document.querySelector("#sports-briefing");

  if (sportsState.mode === "team" && sportsState.activeTeam) {
    const teamName = sportsState.activeTeam.strTeam;
    const recent = sportsState.pastEvents.slice(0, 5);
    let wins = 0;
    let draws = 0;
    let losses = 0;

    recent.forEach((event) => {
      const home = Number(event.intHomeScore);
      const away = Number(event.intAwayScore);

      if (!Number.isFinite(home) || !Number.isFinite(away)) {
        return;
      }

      const isHome = normalizeSportText(event.strHomeTeam) === normalizeSportText(teamName);
      const teamScore = isHome ? home : away;
      const oppScore = isHome ? away : home;

      if (teamScore > oppScore) {
        wins += 1;
      } else if (teamScore < oppScore) {
        losses += 1;
      } else {
        draws += 1;
      }
    });

    root.innerHTML = `
      <h3>${SITE.escapeHTML(teamName)}</h3>
      <p>
        Lecture recente: ${SITE.escapeHTML(String(wins))} victoire(s),
        ${SITE.escapeHTML(String(draws))} nul(s),
        ${SITE.escapeHTML(String(losses))} defaite(s) sur les derniers matchs charges.
      </p>
      <p>
        Utilise cette page pour voir le contexte. Ce n'est pas un conseil de pari
        ni une promesse de resultat.
      </p>
    `;
    return;
  }

  root.innerHTML = `
    <h3>${SITE.escapeHTML(sportsState.activeLeague?.strLeague ?? "Board sport")}</h3>
    <p>
      Ouvre une ligue ou cherche une equipe pour voir les matchs a venir, les
      derniers scores et une estimation de probabilite basee sur la forme.
    </p>
    <p>
      Le board sert de lecture rapide, pas de machine a picks ni de promesse de pari gagnant.
    </p>
  `;
}

function renderProbabilityNote() {
  const root = document.querySelector("#sports-probability-note");
  const sample = selectedInsight();

  root.innerHTML = `
    <h3>Comment lire la probabilite</h3>
    <p>
      Cette estimation vient surtout des derniers matchs, de la difference de
      buts, du rythme de points et du leger avantage a domicile.
    </p>
    <p>
      ${sample ? `Exemple actif: domicile ${probabilityPercent(sample.homeProbability)}, exterieur ${probabilityPercent(sample.awayProbability)}.` : "Choisis un match a venir pour afficher une estimation."}
    </p>
    <p>
      Ce n'est pas une cote bookmaker ni une garantie de victoire.
    </p>
  `;
}

function renderSportsDetail() {
  const root = document.querySelector("#sports-detail");

  if (sportsState.mode === "team" && sportsState.activeTeam) {
    root.innerHTML = `
      <h3>${SITE.escapeHTML(sportsState.activeTeam.strTeam)}</h3>
      <p>
        ${SITE.escapeHTML(sportsState.activeTeam.strLeague ?? "--")} -
        ${SITE.escapeHTML(sportsState.activeTeam.strCountry ?? "--")}
      </p>
      <p>
        Stade: <strong>${SITE.escapeHTML(sportsState.activeTeam.strStadium ?? "--")}</strong>
      </p>
      <p>
        Sport: <strong>${SITE.escapeHTML(sportsState.activeTeam.strSport ?? "--")}</strong>
      </p>
    `;
    return;
  }

  root.innerHTML = `
    <h3>${SITE.escapeHTML(sportsState.activeLeague?.strLeague ?? "Ligue")}</h3>
    <p>
      Sport: <strong>${SITE.escapeHTML(sportsState.activeLeague?.strSport ?? "--")}</strong>
    </p>
    <p>
      Pays: <strong>${SITE.escapeHTML(sportsState.activeLeague?.strCountry ?? "--")}</strong>
    </p>
    <p>
      Recherche ensuite une equipe precise si tu veux un contexte encore plus cible.
    </p>
  `;
}

function renderProbabilityPanel() {
  const root = document.querySelector("#sports-probability");
  const selectedEvent = sportsState.nextEvents.find((event) => eventId(event) === sportsState.selectedEventId);
  const insight = selectedInsight();

  if (!selectedEvent || !insight) {
    root.innerHTML = `
      <h3>Match actif</h3>
      <p>
        Choisis un match a venir pour voir une estimation de probabilite de victoire.
      </p>
    `;
    return;
  }

  root.innerHTML = `
    <h3>${SITE.escapeHTML(selectedEvent.strHomeTeam ?? "--")} vs ${SITE.escapeHTML(selectedEvent.strAwayTeam ?? "--")}</h3>
    <p>
      ${SITE.escapeHTML(formatEventDate(selectedEvent.dateEvent ?? selectedEvent.strTimestamp ?? ""))} -
      ${SITE.escapeHTML(selectedEvent.strLeague ?? "Match")}
    </p>
    <div class="probability-stack">
      <div class="probability-row">
        <span>${SITE.escapeHTML(selectedEvent.strHomeTeam ?? "Domicile")}</span>
        <strong>${SITE.escapeHTML(probabilityPercent(insight.homeProbability))}</strong>
      </div>
      <div class="probability-bar">
        <span class="probability-fill" style="width:${SITE.escapeHTML(String(Math.round(insight.homeProbability * 100)))}%"></span>
      </div>
      ${
        supportsDraw(selectedEvent)
          ? `
            <div class="probability-row">
              <span>Nul</span>
              <strong>${SITE.escapeHTML(probabilityPercent(insight.drawProbability))}</strong>
            </div>
            <div class="probability-bar">
              <span class="probability-fill probability-fill-neutral" style="width:${SITE.escapeHTML(String(Math.round(insight.drawProbability * 100)))}%"></span>
            </div>
          `
          : ""
      }
      <div class="probability-row">
        <span>${SITE.escapeHTML(selectedEvent.strAwayTeam ?? "Exterieur")}</span>
        <strong>${SITE.escapeHTML(probabilityPercent(insight.awayProbability))}</strong>
      </div>
      <div class="probability-bar">
        <span class="probability-fill probability-fill-alt" style="width:${SITE.escapeHTML(String(Math.round(insight.awayProbability * 100)))}%"></span>
      </div>
    </div>
    <p class="detail-subline">Forme domicile: ${SITE.escapeHTML(insight.homeForm.wins)}V ${SITE.escapeHTML(insight.homeForm.draws)}N ${SITE.escapeHTML(insight.homeForm.losses)}D.</p>
    <p class="detail-subline">Forme exterieur: ${SITE.escapeHTML(insight.awayForm.wins)}V ${SITE.escapeHTML(insight.awayForm.draws)}N ${SITE.escapeHTML(insight.awayForm.losses)}D.</p>
    <ul class="feature-list">
      ${insight.reasons.map((reason) => `<li>${SITE.escapeHTML(reason)}</li>`).join("")}
    </ul>
  `;
}

function renderMatchList(rootId, events, upcoming = true) {
  const root = document.querySelector(rootId);

  if (!events.length) {
    root.innerHTML = '<div class="empty-state">Aucune donnee chargee pour le moment.</div>';
    return;
  }

  root.innerHTML = events
    .slice(0, 8)
    .map((event) => {
      const insight = sportsState.eventInsights[eventId(event)];
      const isActive = upcoming && eventId(event) === sportsState.selectedEventId;

      if (upcoming) {
        return `
          <button
            class="match-card match-card-button ${isActive ? "is-active" : ""}"
            type="button"
            data-event-id="${SITE.escapeHTML(eventId(event))}"
          >
            <div class="match-head">
              <div>
                <p class="article-tag">${SITE.escapeHTML(event.strLeague ?? "Match")}</p>
                <h3>${SITE.escapeHTML(event.strHomeTeam ?? "--")} vs ${SITE.escapeHTML(event.strAwayTeam ?? "--")}</h3>
              </div>
              <span class="score-pill">A venir</span>
            </div>
            <p>${SITE.escapeHTML(formatEventDate(event.dateEvent ?? event.strTimestamp ?? ""))}</p>
            <div class="match-meta">
              <span>${SITE.escapeHTML(event.strVenue ?? event.strStadium ?? "Lieu non communique")}</span>
              <span>${SITE.escapeHTML(event.strStatus ?? "Programme")}</span>
            </div>
            <div class="match-probability">
              ${
                insight
                  ? supportsDraw(event)
                    ? `<span>Dom. ${SITE.escapeHTML(probabilityPercent(insight.homeProbability))}</span><span>Nul ${SITE.escapeHTML(probabilityPercent(insight.drawProbability))}</span><span>Ext. ${SITE.escapeHTML(probabilityPercent(insight.awayProbability))}</span>`
                    : `<span>Dom. ${SITE.escapeHTML(probabilityPercent(insight.homeProbability))}</span><span>Ext. ${SITE.escapeHTML(probabilityPercent(insight.awayProbability))}</span>`
                  : "<span>Analyse de forme en cours...</span>"
              }
            </div>
          </button>
        `;
      }

      return `
        <article class="match-card">
          <div class="match-head">
            <div>
              <p class="article-tag">${SITE.escapeHTML(event.strLeague ?? "Match")}</p>
              <h3>${SITE.escapeHTML(event.strHomeTeam ?? "--")} vs ${SITE.escapeHTML(event.strAwayTeam ?? "--")}</h3>
            </div>
            <span class="score-pill">${SITE.escapeHTML(scoreLabel(event.intHomeScore, event.intAwayScore))}</span>
          </div>
          <p>${SITE.escapeHTML(formatEventDate(event.dateEvent ?? event.strTimestamp ?? ""))}</p>
          <div class="match-meta">
            <span>${SITE.escapeHTML(event.strVenue ?? event.strStadium ?? "Lieu non communique")}</span>
            <span>${SITE.escapeHTML(event.strStatus ?? "Termine")}</span>
          </div>
        </article>
      `;
    })
    .join("");

  if (upcoming) {
    root.querySelectorAll("[data-event-id]").forEach((button) => {
      button.addEventListener("click", () => {
        sportsState.selectedEventId = button.dataset.eventId ?? sportsState.selectedEventId;
        renderMatchList("#sports-next-list", sportsState.nextEvents, true);
        renderProbabilityPanel();
        renderProbabilityNote();
      });
    });
  }
}

function renderSportsSearchResults(results) {
  const root = document.querySelector("#sports-search-results");

  if (!results.length) {
    root.innerHTML = "";
    return;
  }

  root.innerHTML = results
    .slice(0, 8)
    .map(
      (team) => `
        <button class="result-card" type="button" data-team-id="${SITE.escapeHTML(team.idTeam)}">
          <div>
            <strong>${SITE.escapeHTML(team.strTeam)}</strong>
            <span>${SITE.escapeHTML(team.strLeague ?? "--")} - ${SITE.escapeHTML(team.strCountry ?? "--")}</span>
          </div>
          <div class="result-card-copy">
            <p>${SITE.escapeHTML(team.strSport ?? "--")}</p>
          </div>
        </button>
      `,
    )
    .join("");

  root.querySelectorAll("[data-team-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const team = results.find((item) => item.idTeam === button.dataset.teamId);

      if (team) {
        loadTeam(team);
        document.querySelector("#sports-board-zone")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

function renderQuickSearches() {
  const root = document.querySelector("#sports-quick-searches");

  root.innerHTML = featuredLeagues
    .map(
      (league) => `
        <button class="pill-button" type="button" data-league-id="${SITE.escapeHTML(league.id)}">
          ${SITE.escapeHTML(league.name)}
        </button>
      `,
    )
    .join("");

  root.querySelectorAll("[data-league-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const league = featuredLeagues.find((item) => item.id === button.dataset.leagueId);

      if (league) {
        loadLeague(league);
      }
    });
  });
}

async function hydrateEventInsights() {
  const events = sportsState.nextEvents.slice(0, 8);

  if (!events.length) {
    sportsState.eventInsights = {};
    sportsState.selectedEventId = "";
    renderMatchList("#sports-next-list", sportsState.nextEvents, true);
    renderProbabilityPanel();
    renderProbabilityNote();
    renderSportsPulse();
    return;
  }

  const insights = await Promise.all(
    events.map(async (event) => {
      try {
        const insight = await buildEventInsight(event);
        return [eventId(event), insight];
      } catch (error) {
        return [eventId(event), null];
      }
    }),
  );

  sportsState.eventInsights = Object.fromEntries(insights.filter(([, insight]) => insight));

  if (!sportsState.selectedEventId || !sportsState.eventInsights[sportsState.selectedEventId]) {
    sportsState.selectedEventId = eventId(events[0]);
  }

  renderMatchList("#sports-next-list", sportsState.nextEvents, true);
  renderProbabilityPanel();
  renderProbabilityNote();
  renderSportsPulse();
}

async function loadLeague(leagueRef) {
  try {
    SITE.setStatus(document.querySelector("#sports-status"), "Chargement de la ligue", "neutral");
    document.querySelector("#sports-query").value = leagueRef.name;
    document.querySelector("#sports-search-results").innerHTML = "";

    const league = await fetchLeague(leagueRef);

    if (!league?.idLeague) {
      throw new Error("league-not-found");
    }

    const events = await fetchLeagueEvents(league.idLeague);
    sportsState.mode = "league";
    sportsState.activeLeague = league;
    sportsState.activeTeam = null;
    sportsState.nextEvents = events.next;
    sportsState.pastEvents = events.past;
    sportsState.eventInsights = {};
    sportsState.selectedEventId = "";
    renderSportsPulse();
    renderSportsBriefing();
    renderSportsDetail();
    renderMatchList("#sports-next-list", sportsState.nextEvents, true);
    renderMatchList("#sports-past-list", sportsState.pastEvents, false);
    renderProbabilityPanel();
    renderProbabilityNote();
    SITE.setStatus(document.querySelector("#sports-status"), `${league.strLeague} charge`, "live");
    hydrateEventInsights();
  } catch (error) {
    renderSportsSearchResults([]);
    renderMatchList("#sports-next-list", [], true);
    renderMatchList("#sports-past-list", [], false);
    renderProbabilityPanel();
    renderProbabilityNote();
    SITE.setStatus(document.querySelector("#sports-status"), "Impossible de charger cette ligue", "error");
  }
}

async function loadTeam(team) {
  try {
    SITE.setStatus(document.querySelector("#sports-status"), "Chargement de l'equipe", "neutral");
    const events = await fetchTeamEvents(team.idTeam);
    sportsState.mode = "team";
    sportsState.activeTeam = team;
    sportsState.activeLeague = null;
    sportsState.nextEvents = events.next;
    sportsState.pastEvents = events.past;
    sportsState.eventInsights = {};
    sportsState.selectedEventId = "";
    renderSportsPulse();
    renderSportsBriefing();
    renderSportsDetail();
    renderMatchList("#sports-next-list", sportsState.nextEvents, true);
    renderMatchList("#sports-past-list", sportsState.pastEvents, false);
    renderProbabilityPanel();
    renderProbabilityNote();
    SITE.setStatus(document.querySelector("#sports-status"), `${team.strTeam} charge`, "live");
    hydrateEventInsights();
  } catch (error) {
    SITE.setStatus(document.querySelector("#sports-status"), "Impossible de charger cette equipe", "error");
  }
}

function setupSearch() {
  const form = document.querySelector("#sports-search-form");
  const input = document.querySelector("#sports-query");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const query = input.value.trim();

    if (!query) {
      loadLeague(featuredLeagues[0]);
      return;
    }

    const normalizedQuery = normalizeSportText(query);
    const featured = featuredLeagues.find((league) => {
      const leagueName = normalizeSportText(league.name);
      return leagueName === normalizedQuery || leagueName.includes(normalizedQuery);
    });

    if (featured) {
      loadLeague(featured);
      return;
    }

    try {
      SITE.setStatus(document.querySelector("#sports-status"), "Recherche d'equipe", "neutral");
      const teams = await fetchTeamSearch(query);
      sportsState.searchResults = teams;
      renderSportsSearchResults(teams);

      if (teams.length === 1) {
        loadTeam(teams[0]);
      } else if (!teams.length) {
        SITE.setStatus(document.querySelector("#sports-status"), "Aucune equipe trouvee", "error");
      }
    } catch (error) {
      SITE.setStatus(document.querySelector("#sports-status"), "Recherche sportive indisponible", "error");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  SITE.setupMenu();
  SITE.observeReveals();
  renderQuickSearches();
  renderSportsPulse();
  renderSportsBriefing();
  renderSportsDetail();
  renderProbabilityPanel();
  renderProbabilityNote();
  renderMatchList("#sports-next-list", [], true);
  renderMatchList("#sports-past-list", [], false);
  setupSearch();
  loadLeague(featuredLeagues[0]);
});
