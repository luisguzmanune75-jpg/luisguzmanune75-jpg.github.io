(() => {
  const USGS_FEEDS = {
    hour: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson',
    day: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson',
    week: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson',
    month: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson',
  };

  const ECLIPSES = [
    { id: 'lunar-2026-08-28', family: 'lunar', type: 'éclipse lunaire partielle', dateTime: '2026-08-28T04:13:00Z', visibleFrom: 'Zones de nuit de la Terre au moment de l’événement; consulter la carte NASA officielle pour la visibilité détaillée.', details: 'Plus grande éclipse lunaire partielle à 04:13 UTC selon NASA.', sourceName: 'NASA Eclipse Web Site — Eclipses During 2026', sourceUrl: 'https://eclipse.gsfc.nasa.gov/OH/OH2026.html' },
    { id: 'solar-2027-02-06', family: 'solar', type: 'éclipse solaire annulaire', dateTime: '2027-02-06T16:00:47Z', visibleFrom: 'Amérique du Sud, Antarctique, ouest et sud de l’Afrique; annularité : Chili, Argentine et Atlantique.', details: 'Plus grande éclipse à 16:00:47 UTC selon le catalogue solaire NASA.', sourceName: 'NASA Solar Eclipses: 2021–2030', sourceUrl: 'https://eclipse.gsfc.nasa.gov/SEdecade/SEdecade2021.html' },
    { id: 'lunar-2027-02-20', family: 'lunar', type: 'éclipse lunaire pénombrale', dateTime: '2027-02-20T23:13:00Z', visibleFrom: 'Zones de nuit de la Terre au moment de l’événement; consulter la fiche NASA pour la visibilité détaillée.', details: 'Plus grande éclipse lunaire pénombrale à 23:13 UTC selon NASA.', sourceName: 'NASA Eclipse Web Site', sourceUrl: 'https://eclipse.gsfc.nasa.gov/OH/OH2027.html' },
    { id: 'lunar-2027-07-18', family: 'lunar', type: 'éclipse lunaire pénombrale', dateTime: '2027-07-18T16:03:00Z', visibleFrom: 'Zones de nuit de la Terre au moment de l’événement; consulter la fiche NASA pour la visibilité détaillée.', details: 'Plus grande éclipse lunaire pénombrale à 16:03 UTC selon NASA.', sourceName: 'NASA Eclipse Web Site', sourceUrl: 'https://eclipse.gsfc.nasa.gov/OH/OH2027.html' },
    { id: 'solar-2027-08-02', family: 'solar', type: 'éclipse solaire totale', dateTime: '2027-08-02T10:07:49Z', visibleFrom: 'Afrique, Europe, Moyen-Orient, ouest et sud de l’Asie; totalité : Maroc, Espagne, Algérie, Libye, Égypte, Arabie saoudite, Yémen, Somalie.', details: 'Plus grande éclipse à 10:07:49 UTC selon le catalogue solaire NASA.', sourceName: 'NASA Solar Eclipses: 2021–2030', sourceUrl: 'https://eclipse.gsfc.nasa.gov/SEdecade/SEdecade2021.html' },
  ];

  const state = { map: null, layer: null, all: [], filtered: [], fetchedAt: null, timer: null, resizeObserver: null };
  const $ = (id) => document.getElementById(id);
  const fmtDate = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' });
  const fmtTime = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' });

  function esc(v) { return String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function validNumber(v) { return typeof v === 'number' && Number.isFinite(v); }
  function magClass(m) { return !validNumber(m) ? 'm-unknown' : m >= 6 ? 'm6' : m >= 5 ? 'm5' : m >= 4 ? 'm4' : m >= 3 ? 'm3' : 'm0'; }
  function markerSize(m) { return Math.max(8, Math.min(34, validNumber(m) ? 8 + m * 3.5 : 8)); }
  function setStatus(msg, type='neutral') { const el = $('quake-status'); if (el) { el.textContent = msg; el.className = `status-pill status-${type}`; } }

  function parseQuake(feature) {
    const p = feature.properties || {}; const c = feature.geometry?.coordinates || [];
    return { id: feature.id, mag: p.mag, place: p.place, time: p.time, updated: p.updated, url: p.url, detail: p.detail, significance: p.sig, tsunami: p.tsunami, lon: c[0], lat: c[1], depth: c[2] };
  }

  async function loadQuakes() {
    setStatus('Chargement des données USGS...', 'neutral');
    try {
      const period = $('period-filter').value;
      const res = await fetch(USGS_FEEDS[period], { cache: 'no-store' });
      if (!res.ok) throw new Error(`USGS HTTP ${res.status}`);
      const data = await res.json();
      state.all = Array.isArray(data.features) ? data.features.map(parseQuake).filter(q => validNumber(q.lat) && validNumber(q.lon)) : [];
      state.fetchedAt = new Date();
      $('last-updated').textContent = `Dernière mise à jour : ${fmtTime.format(state.fetchedAt)}`;
      $('retrieved-at').textContent = fmtDate.format(state.fetchedAt);
      applyFilters();
      invalidateMapSize(100);
      setStatus(state.all.length ? `${state.all.length} événement(s) réel(s) récupéré(s) depuis l’USGS.` : 'Aucune donnée disponible actuellement.', state.all.length ? 'live' : 'neutral');
    } catch (e) {
      state.all = []; state.filtered = []; renderAll();
      setStatus('Données temporairement indisponibles.', 'error');
    }
  }

  function applyFilters() {
    const min = Number($('magnitude-filter').value);
    const query = $('region-search').value.trim().toLowerCase();
    state.filtered = state.all.filter(q => (!min || (validNumber(q.mag) && q.mag >= min)) && (!query || String(q.place || '').toLowerCase().includes(query)));
    renderAll();
  }

  function popup(q) {
    return `<strong>Magnitude ${esc(validNumber(q.mag) ? q.mag.toFixed(1) : 'non disponible')}</strong><br>📍 ${esc(q.place || 'Localisation non disponible')}<br>🕐 ${q.time ? esc(fmtDate.format(new Date(q.time))) : 'Date indisponible'}<br>🌐 Profondeur: ${validNumber(q.depth) ? esc(q.depth.toFixed(1)) + ' km' : 'indisponible'}<br>Coordonnées: ${esc(q.lat?.toFixed?.(3) || '--')}, ${esc(q.lon?.toFixed?.(3) || '--')}<br><a href="${esc(q.url)}" target="_blank" rel="noopener noreferrer">Source officielle USGS</a>`;
  }

  function invalidateMapSize(delay = 100) {
    if (!state.map) return;
    window.setTimeout(() => state.map.invalidateSize(), delay);
  }

  function initMap() {
    const container = $('quake-map');
    if (state.map || !window.L || !container) return;
    state.map = L.map(container, { worldCopyJump: true }).setView([20, 0], 2);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 8,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
    }).addTo(state.map);
    state.layer = L.layerGroup().addTo(state.map);
    if ('ResizeObserver' in window) {
      state.resizeObserver = new ResizeObserver(() => invalidateMapSize(50));
      state.resizeObserver.observe(container);
    }
    window.addEventListener('resize', () => invalidateMapSize(100));
    window.addEventListener('orientationchange', () => invalidateMapSize(150));
    invalidateMapSize(100);
  }

  function renderMap() {
    initMap(); if (!state.layer) return; state.layer.clearLayers();
    state.filtered.slice(0, 800).forEach(q => {
      const s = markerSize(q.mag);
      L.circleMarker([q.lat, q.lon], { radius: s / 2, className: `quake-marker ${magClass(q.mag)}`, color: '#fff', weight: 1, fillOpacity: 0.78 }).bindPopup(popup(q)).addTo(state.layer);
    });
    invalidateMapSize(100);
  }

  function renderImportant() {
    const box = $('important-quakes');
    const important = state.filtered.filter(q => validNumber(q.mag) && q.mag >= 5).slice(0, 3);
    box.innerHTML = important.length ? important.map(q => `<article class="quake-alert"><h3>🚨 SÉISME IMPORTANT</h3><p>Magnitude : <strong>${esc(q.mag.toFixed(1))}</strong></p><p>Région : ${esc(q.place || 'Non disponible')}</p><p>Heure : ${q.time ? esc(fmtDate.format(new Date(q.time))) : 'Non disponible'}</p>${q.tsunami === 1 ? '<p>Information tsunami signalée par le champ officiel USGS.</p>' : ''}<a href="${esc(q.url)}" target="_blank" rel="noopener noreferrer">Vérifier sur USGS</a></article>`).join('') : '<p class="empty-state">Aucun événement M5+ dans les résultats actuels.</p>';
  }

  function renderList() {
    const body = $('quake-list');
    body.innerHTML = state.filtered.length ? state.filtered.slice(0, 60).map(q => `<tr><td data-label="Magnitude">${validNumber(q.mag) ? 'M ' + esc(q.mag.toFixed(1)) : 'Non disponible'}</td><td data-label="Localisation"><a href="${esc(q.url)}" target="_blank" rel="noopener noreferrer">${esc(q.place || 'Non disponible')}</a></td><td data-label="Profondeur">${validNumber(q.depth) ? esc(q.depth.toFixed(1)) + ' km' : 'Non disponible'}</td><td data-label="Date/heure">${q.time ? esc(fmtDate.format(new Date(q.time))) : 'Non disponible'}</td></tr>`).join('') : '<tr><td colspan="4">Aucune donnée disponible actuellement.</td></tr>';
  }
  function renderAll() { renderMap(); renderImportant(); renderList(); $('quake-count').textContent = `${state.filtered.length} résultat(s) affiché(s)`; }

  function renderEclipses() {
    const now = Date.now(); const future = ECLIPSES.filter(e => new Date(e.dateTime).getTime() > now).sort((a,b)=>new Date(a.dateTime)-new Date(b.dateTime));
    const next = future[0]; const list = $('eclipse-list');
    if (!next) { $('next-eclipse').innerHTML = '<p>Données temporairement indisponibles.</p>'; return; }
    const renderCard = e => `<article class="eclipse-card"><p class="section-tag">${e.family === 'solar' ? '🔭 prévision astronomique solaire' : '🌑 calendrier astronomique lunaire'}</p><h3>${esc(e.type)}</h3><p><strong>Date réelle :</strong> ${esc(fmtDate.format(new Date(e.dateTime)))} UTC</p><p><strong>Visible depuis :</strong> ${esc(e.visibleFrom)}</p><p>${esc(e.details)}</p><a href="${esc(e.sourceUrl)}" target="_blank" rel="noopener noreferrer">Source : ${esc(e.sourceName)}</a></article>`;
    $('next-eclipse').innerHTML = renderCard(next) + '<div id="countdown" class="countdown" aria-live="polite"></div>';
    list.innerHTML = future.map(renderCard).join('');
    const solar = future.find(e => e.family === 'solar'); const lunar = future.find(e => e.family === 'lunar');
    $('eclipse-summary').innerHTML = `${solar ? `<p>Prochaine éclipse solaire : <strong>${esc(solar.type)}</strong>, ${esc(fmtDate.format(new Date(solar.dateTime)))} UTC.</p>` : '<p>Aucune donnée solaire disponible actuellement.</p>'}${lunar ? `<p>Prochaine éclipse lunaire : <strong>${esc(lunar.type)}</strong>, ${esc(fmtDate.format(new Date(lunar.dateTime)))} UTC.</p>` : '<p>Aucune donnée lunaire disponible actuellement.</p>'}`;
    const updateCountdown = () => { const diff = new Date(next.dateTime).getTime() - Date.now(); if (diff <= 0) return renderEclipses(); const d=Math.floor(diff/86400000), h=Math.floor(diff%86400000/3600000), m=Math.floor(diff%3600000/60000), s=Math.floor(diff%60000/1000); $('countdown').textContent = `Compte à rebours réel : ${d}j ${h}h ${m}m ${s}s`; };
    updateCountdown(); window.setInterval(updateCountdown, 1000);
  }

  document.addEventListener('DOMContentLoaded', () => {
    ['period-filter','magnitude-filter'].forEach(id => $(id).addEventListener('change', id === 'period-filter' ? loadQuakes : applyFilters));
    $('region-search').addEventListener('input', applyFilters);
    $('refresh-quakes').addEventListener('click', loadQuakes);
    renderEclipses(); loadQuakes(); window.setInterval(loadQuakes, 10 * 60 * 1000);
  });
})();
