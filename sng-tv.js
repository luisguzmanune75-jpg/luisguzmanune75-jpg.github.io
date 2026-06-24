(() => {
  const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";
  const YOUTUBE_WATCH_BASE = "https://www.youtube.com/watch?v=";
  const FALLBACK_THUMBNAIL = "sng-hero.png";

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

  const getBestThumbnail = (thumbnails = {}) =>
    thumbnails.maxres?.url || thumbnails.standard?.url || thumbnails.high?.url || thumbnails.medium?.url || thumbnails.default?.url || FALLBACK_THUMBNAIL;

  const extractVideoId = (item) => item?.snippet?.resourceId?.videoId || item?.id?.videoId || item?.id;

  const normalizeChannelInput = (input) => {
    const rawValue = String(input || "").trim();
    if (!rawValue) return { type: "empty", value: "" };
    if (/^UC[a-zA-Z0-9_-]{20,}$/.test(rawValue)) return { type: "id", value: rawValue };

    const handleMatch = rawValue.match(/(?:youtube\.com\/(?:@|c\/|channel\/)?|^@)([a-zA-Z0-9._-]+)/);
    if (rawValue.includes("/channel/")) {
      const channelMatch = rawValue.match(/\/channel\/(UC[a-zA-Z0-9_-]+)/);
      if (channelMatch) return { type: "id", value: channelMatch[1] };
    }
    if (handleMatch) return { type: "handle", value: handleMatch[1].startsWith("@") ? handleMatch[1] : `@${handleMatch[1]}` };
    return { type: "handle", value: rawValue.startsWith("@") ? rawValue : `@${rawValue}` };
  };

  const youtubeFetch = async (path, params) => {
    const url = new URL(`${YOUTUBE_API_BASE}/${path}`);
    Object.entries({ ...params, key: API_KEY }).forEach(([key, value]) => url.searchParams.set(key, value));
    const response = await fetch(url.toString(), { cache: "no-store" });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const detail = data?.error?.message || "Réponse invalide de YouTube Data API v3.";
      throw new Error(detail);
    }
    return data;
  };

  const resolveUploadsPlaylist = async () => {
    const channel = normalizeChannelInput(CHANNEL_ID);
    if (channel.type === "empty") throw new Error("CHANNEL_ID n'est pas configuré.");

    const params = channel.type === "id"
      ? { part: "contentDetails", id: channel.value, maxResults: "1" }
      : { part: "contentDetails", forHandle: channel.value, maxResults: "1" };

    let data = await youtubeFetch("channels", params);
    if (channel.type === "handle" && !data.items?.length && channel.value.startsWith("@")) {
      data = await youtubeFetch("channels", { ...params, forHandle: channel.value.slice(1) });
    }
    const playlistId = data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
    if (!playlistId) throw new Error("Chaîne YouTube introuvable. Vérifie le Channel ID ou le handle configuré.");
    return playlistId;
  };

  const fetchLatestVideos = async () => {
    const playlistId = await resolveUploadsPlaylist();
    const data = await youtubeFetch("playlistItems", {
      part: "snippet,contentDetails",
      playlistId,
      maxResults: String(MAX_RESULTS || 12),
    });

    return (data.items || [])
      .map((item) => {
        const snippet = item.snippet || {};
        const videoId = extractVideoId(item);
        return {
          id: videoId,
          title: snippet.title || "Vidéo SNG TV",
          publishedAt: snippet.publishedAt || item.contentDetails?.videoPublishedAt,
          thumbnail: getBestThumbnail(snippet.thumbnails),
          watchUrl: `${YOUTUBE_WATCH_BASE}${videoId}`,
          embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
        };
      })
      .filter((video) => video.id && !/private video|deleted video/i.test(video.title));
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
          <a class="watch-btn" href="${escapeHTML(video.watchUrl)}" target="_blank" rel="noopener noreferrer">▶ Regarder</a>
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
      state.player.innerHTML = `<div class="empty-screen"><strong>Impossible de charger SNG TV</strong>Vérifie la clé API, le quota YouTube Data API v3 et l'identifiant de chaîne.</div>`;
      state.grid.innerHTML = "";
      setStatus(`Erreur API YouTube : ${error.message}`, "error");
    }
  };

  state.reloadButton?.addEventListener("click", loadVideos);
  document.addEventListener("DOMContentLoaded", loadVideos, { once: true });
})();
