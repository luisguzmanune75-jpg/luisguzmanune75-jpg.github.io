(() => {
  const state = {
    grid: document.getElementById("videoGrid"),
    player: document.getElementById("featuredPlayer"),
    status: document.getElementById("videoStatus"),
    reloadButton: document.getElementById("reloadVideos"),
  };

  const escapeHTML = (value = "") =>
    String(value).replace(/[&<>'"]/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    }[char]));

  const formatDate = (dateString) => {
    if (!dateString) return "Date indisponible";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "Date indisponible";
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const setStatus = (message, type = "info") => {
    if (!state.status) return;
    state.status.textContent = message;
    state.status.dataset.type = type;
    state.status.hidden = !message;
  };

  const buildSngTvApiUrl = () => {
    const endpoint = window.SNG_TV_API_ENDPOINT || "/api/sng-tv";
    const url = new URL(endpoint, window.location.origin);
    url.searchParams.set("channelId", window.CHANNEL_ID || "");
    url.searchParams.set("maxResults", String(window.MAX_RESULTS || 12));
    return url;
  };

  const fetchLatestVideos = async () => {
    const response = await fetch(buildSngTvApiUrl().toString(), { cache: "no-store" });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data?.message || data?.error || "Réponse invalide de l’endpoint SNG TV.");
    }

    if (!data || !Array.isArray(data.videos)) {
      throw new Error(data?.message || "Réponse invalide de l’endpoint SNG TV.");
    }

    return data.videos.map((video) => {
      const id = video.id || "";
      const url = video.url || video.watchUrl || (id ? `https://www.youtube.com/watch?v=${id}` : "");
      return {
        ...video,
        url,
        watchUrl: video.watchUrl || url,
        embedUrl: video.embedUrl || (id ? `https://www.youtube-nocookie.com/embed/${id}` : ""),
      };
    });
  };

  const renderPlayer = (video) => {
    state.player.innerHTML = `
      <iframe
        src="${video.embedUrl}"
        title="${escapeHTML(video.title)}"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen></iframe>`;
  };

  const renderVideos = (videos) => {
    state.grid.innerHTML = "";
    if (!videos.length) {
      state.player.innerHTML = `<div class="empty-screen"><strong>Aucune vidéo trouvée</strong>La chaîne est accessible, mais aucune vidéo publique n'a été retournée.</div>`;
      setStatus("Aucune vidéo publique n'a été trouvée pour cette chaîne.", "warning");
      return;
    }

    const fragment = document.createDocumentFragment();
    videos.forEach((video, index) => {
      const card = document.createElement("article");
      card.className = "video-card";
      card.innerHTML = `
        <img class="thumb" src="${escapeHTML(video.thumbnail)}" alt="Miniature de ${escapeHTML(video.title)}" loading="lazy">
        <div class="video-body">
          <p class="video-date">${escapeHTML(formatDate(video.publishedAt))}</p>
          <h3>${escapeHTML(video.title)}</h3>
          <a class="watch-btn" href="${escapeHTML(video.url || video.watchUrl)}" target="_blank" rel="noopener noreferrer">▶ Regarder</a>
        </div>`;
      card.querySelector(".thumb").addEventListener("click", () => renderPlayer(video));
      card.querySelector("h3").addEventListener("click", () => renderPlayer(video));
      fragment.appendChild(card);
      if (index === 0) renderPlayer(video);
    });

    state.grid.appendChild(fragment);
    setStatus(`${videos.length} dernières vidéos chargées automatiquement depuis YouTube.`, "success");
  };

  const loadVideos = async () => {
    try {
      setStatus("Chargement des dernières vidéos YouTube…", "info");
      state.grid.innerHTML = "";
      const videos = await fetchLatestVideos();
      renderVideos(videos);
    } catch (error) {
      console.error("Erreur SNG TV YouTube:", error);
      state.player.innerHTML = `<div class="empty-screen"><strong>Impossible de charger SNG TV</strong>Vérifie la variable Vercel YOUTUBE_API_KEY, le quota YouTube Data API v3 et l'identifiant de chaîne.</div>`;
      state.grid.innerHTML = "";
      setStatus(`Erreur endpoint SNG TV : ${error.message}`, "error");
    }
  };

  state.reloadButton?.addEventListener("click", loadVideos);
  document.addEventListener("DOMContentLoaded", loadVideos, { once: true });
})();
