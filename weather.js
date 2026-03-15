const weatherLabels = {
  0: "Ciel clair",
  1: "Plutot degage",
  2: "Partiellement nuageux",
  3: "Nuageux",
  45: "Brouillard",
  48: "Brouillard humide",
  51: "Bruine legere",
  53: "Bruine",
  55: "Bruine dense",
  56: "Bruine verglaçante legere",
  57: "Bruine verglaçante dense",
  61: "Pluie legere",
  63: "Pluie",
  65: "Pluie forte",
  66: "Pluie verglaçante legere",
  67: "Pluie verglaçante forte",
  71: "Neige legere",
  73: "Neige",
  75: "Neige forte",
  77: "Grains de neige",
  80: "Averses legeres",
  81: "Averses",
  82: "Averses fortes",
  85: "Averses de neige legeres",
  86: "Averses de neige fortes",
  95: "Orage",
  96: "Orage avec grele legere",
  99: "Orage avec grele forte",
};

const quickSearches = [
  "France",
  "Republique dominicaine",
  "Paris",
  "Dakar",
  "Santo Domingo",
  "Montreal",
  "Tokyo",
  "Dubai",
];

const weatherState = {
  query: "Paris",
  results: [],
  selectedPlace: null,
  forecast: null,
  loadedAt: null,
};

function weatherLabel(code) {
  return weatherLabels[code] || "Conditions variables";
}

function formatLocation(place) {
  return [place.name, place.admin1, place.country].filter(Boolean).join(", ");
}

function formatHour(value) {
  return new Date(value).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDay(value) {
  return new Date(value).toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

function renderQuickSearches() {
  const root = document.querySelector("#quick-searches");

  root.innerHTML = quickSearches
    .map(
      (item) => `
        <button class="pill-button" type="button" data-quick-search="${SITE.escapeHTML(item)}">
          ${SITE.escapeHTML(item)}
        </button>
      `,
    )
    .join("");

  root.querySelectorAll("[data-quick-search]").forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.dataset.quickSearch;
      document.querySelector("#location-query").value = value;
      weatherState.query = value;
      searchLocation(value);
    });
  });
}

function renderSearchResults() {
  const root = document.querySelector("#search-results");

  if (!weatherState.results.length) {
    root.innerHTML = `<div class="empty-state">Aucun lieu trouve pour cette recherche.</div>`;
    return;
  }

  root.innerHTML = weatherState.results
    .map(
      (place) => `
        <button
          class="result-card ${weatherState.selectedPlace?.id === place.id ? "is-active" : ""}"
          type="button"
          data-place-id="${place.id}"
        >
          <div>
            <strong>${SITE.escapeHTML(formatLocation(place))}</strong>
            <span>${SITE.escapeHTML(place.timezone || "Fuseau indisponible")}</span>
          </div>
          <span class="coin-badge">${SITE.escapeHTML(place.country_code || "--")}</span>
        </button>
      `,
    )
    .join("");

  root.querySelectorAll("[data-place-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const selected = weatherState.results.find((place) => place.id === button.dataset.placeId);
      weatherState.selectedPlace = selected;
      renderSearchResults();
      loadForecast(selected);
    });
  });
}

function renderPulse() {
  const root = document.querySelector("#weather-pulse");
  const place = weatherState.selectedPlace;
  const current = weatherState.forecast?.current;

  root.innerHTML = `
    <div class="pulse-card">
      <span>Lieu actif</span>
      <strong>${place ? SITE.escapeHTML(place.name) : "--"}</strong>
      <p>${place ? SITE.escapeHTML(place.country || "") : "Recherche en attente"}</p>
    </div>
    <div class="pulse-card">
      <span>Temperature</span>
      <strong>${current ? `${Math.round(current.temperature_2m)}°C` : "--"}</strong>
      <p>${current ? SITE.escapeHTML(weatherLabel(current.weather_code)) : "Aucune mesure"}</p>
    </div>
    <div class="pulse-card">
      <span>Vent</span>
      <strong>${current ? `${Math.round(current.wind_speed_10m)} km/h` : "--"}</strong>
      <p>${current ? `Rafales ${Math.round(current.wind_gusts_10m || 0)} km/h` : "En attente"}</p>
    </div>
    <div class="pulse-card">
      <span>Maj</span>
      <strong>${weatherState.loadedAt ? SITE.formatRelativeTime(weatherState.loadedAt) : "--"}</strong>
      <p>${place ? SITE.escapeHTML(place.timezone || "") : "Fuseau en attente"}</p>
    </div>
  `;
}

function renderCurrentWeather() {
  const root = document.querySelector("#weather-card");
  const place = weatherState.selectedPlace;
  const current = weatherState.forecast?.current;

  if (!place || !current) {
    root.innerHTML = `<div class="empty-state">Recherche un lieu pour voir la meteo detaillee.</div>`;
    return;
  }

  root.innerHTML = `
    <div class="weather-main">
      <div>
        <p class="section-tag">${SITE.escapeHTML(formatLocation(place))}</p>
        <h3>${SITE.escapeHTML(weatherLabel(current.weather_code))}</h3>
        <p>${SITE.escapeHTML(place.timezone || "Fuseau indisponible")}</p>
      </div>
      <strong class="weather-temp">${Math.round(current.temperature_2m)}°C</strong>
    </div>
    <div class="weather-grid">
      <div class="weather-stat">
        <span>Ressenti</span>
        <strong>${Math.round(current.apparent_temperature)}°C</strong>
      </div>
      <div class="weather-stat">
        <span>Humidite</span>
        <strong>${Math.round(current.relative_humidity_2m)}%</strong>
      </div>
      <div class="weather-stat">
        <span>Moment</span>
        <strong>${current.is_day ? "Jour" : "Nuit"}</strong>
      </div>
      <div class="weather-stat">
        <span>Nuages</span>
        <strong>${Math.round(current.cloud_cover)}%</strong>
      </div>
    </div>
  `;
}

function renderWeatherDetails() {
  const root = document.querySelector("#weather-details");
  const current = weatherState.forecast?.current;

  if (!current) {
    root.innerHTML = "";
    return;
  }

  root.innerHTML = `
    <div class="detail-box">
      <span>Vent</span>
      <strong>${Math.round(current.wind_speed_10m)} km/h</strong>
    </div>
    <div class="detail-box">
      <span>Rafales</span>
      <strong>${Math.round(current.wind_gusts_10m || 0)} km/h</strong>
    </div>
    <div class="detail-box">
      <span>Direction</span>
      <strong>${Math.round(current.wind_direction_10m)}°</strong>
    </div>
    <div class="detail-box">
      <span>Pression</span>
      <strong>${Math.round(current.pressure_msl)} hPa</strong>
    </div>
    <div class="detail-box">
      <span>Visibilite</span>
      <strong>${Math.round((current.visibility || 0) / 1000)} km</strong>
    </div>
    <div class="detail-box">
      <span>Precipitation</span>
      <strong>${current.precipitation ?? 0} mm</strong>
    </div>
  `;
}

function renderHourlyForecast() {
  const root = document.querySelector("#weather-hourly");
  const hourly = weatherState.forecast?.hourly;
  const currentTime = weatherState.forecast?.current?.time;

  if (!hourly) {
    root.innerHTML = `<div class="empty-state">Aucune prevision horaire disponible.</div>`;
    return;
  }

  const startIndex = Math.max(hourly.time.indexOf(currentTime), 0);

  root.innerHTML = hourly.time.slice(startIndex, startIndex + 8).map((time, offset) => {
    const index = startIndex + offset;
    const temp = hourly.temperature_2m[index];
    const code = hourly.weather_code[index];
    const rain = hourly.precipitation_probability[index];
    const wind = hourly.wind_speed_10m[index];

    return `
      <article class="forecast-card">
        <span>${SITE.escapeHTML(formatHour(time))}</span>
        <strong>${Math.round(temp)}°C</strong>
        <p>${SITE.escapeHTML(weatherLabel(code))}</p>
        <p>Pluie ${Math.round(rain)}%</p>
        <p>Vent ${Math.round(wind)} km/h</p>
      </article>
    `;
  }).join("");
}

function renderDailyForecast() {
  const root = document.querySelector("#weather-daily");
  const daily = weatherState.forecast?.daily;

  if (!daily) {
    root.innerHTML = `<div class="empty-state">Aucune tendance journaliere disponible.</div>`;
    return;
  }

  root.innerHTML = daily.time.map((time, index) => `
    <article class="forecast-row">
      <div>
        <strong>${SITE.escapeHTML(formatDay(time))}</strong>
        <span>${SITE.escapeHTML(weatherLabel(daily.weather_code[index]))}</span>
      </div>
      <div class="forecast-row-values">
        <span>Max ${Math.round(daily.temperature_2m_max[index])}°C</span>
        <span>Min ${Math.round(daily.temperature_2m_min[index])}°C</span>
        <span>Pluie ${Math.round(daily.precipitation_probability_max[index])}%</span>
      </div>
    </article>
  `).join("");
}

async function searchLocation(query) {
  const status = document.querySelector("#weather-status");

  SITE.setStatus(status, `Recherche ${query}...`, "neutral");

  try {
    const data = await SITE.fetchJSON(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        query,
      )}&count=8&language=fr&format=json`,
    );

    weatherState.results = (data.results || []).map((place) => ({
      id: `${place.id || `${place.name}-${place.latitude}-${place.longitude}`}`,
      name: place.name,
      country: place.country,
      country_code: place.country_code,
      admin1: place.admin1,
      latitude: place.latitude,
      longitude: place.longitude,
      timezone: place.timezone,
    }));

    weatherState.selectedPlace = weatherState.results[0] || null;
    renderSearchResults();

    if (weatherState.selectedPlace) {
      await loadForecast(weatherState.selectedPlace);
    } else {
      renderCurrentWeather();
      renderWeatherDetails();
      renderHourlyForecast();
      renderDailyForecast();
      renderPulse();
      SITE.setStatus(status, "Aucun lieu trouve", "error");
    }
  } catch (error) {
    weatherState.results = [];
    weatherState.selectedPlace = null;
    weatherState.forecast = null;
    renderSearchResults();
    renderCurrentWeather();
    renderWeatherDetails();
    renderHourlyForecast();
    renderDailyForecast();
    renderPulse();
    SITE.setStatus(status, "Recherche indisponible", "error");
  }
}

async function loadForecast(place) {
  const status = document.querySelector("#weather-status");

  SITE.setStatus(status, `Chargement meteo ${place.name}...`, "neutral");

  try {
    weatherState.forecast = await SITE.fetchJSON(
      `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m,visibility&hourly=temperature_2m,precipitation_probability,weather_code,wind_speed_10m,relative_humidity_2m&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_probability_max,precipitation_sum,wind_speed_10m_max,sunrise,sunset,uv_index_max&forecast_days=7&timezone=auto`,
    );

    weatherState.loadedAt = new Date().toISOString();
    renderCurrentWeather();
    renderWeatherDetails();
    renderHourlyForecast();
    renderDailyForecast();
    renderPulse();
    SITE.setStatus(status, `Maj ${SITE.formatRelativeTime(weatherState.loadedAt)}`, "live");
  } catch (error) {
    renderCurrentWeather();
    renderWeatherDetails();
    renderHourlyForecast();
    renderDailyForecast();
    renderPulse();
    SITE.setStatus(status, "Meteo indisponible pour ce lieu", "error");
  }
}

function setupSearch() {
  const form = document.querySelector("#location-search-form");
  const input = document.querySelector("#location-query");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = input.value.trim();

    if (!query) {
      input.focus();
      return;
    }

    weatherState.query = query;
    searchLocation(query);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  SITE.setupMenu();
  SITE.observeReveals();
  renderQuickSearches();
  renderSearchResults();
  renderCurrentWeather();
  renderWeatherDetails();
  renderHourlyForecast();
  renderDailyForecast();
  renderPulse();
  setupSearch();
  document.querySelector("#location-query").value = weatherState.query;
  searchLocation(weatherState.query);
});
