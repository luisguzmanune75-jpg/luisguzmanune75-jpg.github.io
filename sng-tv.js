(() => {
  const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";
  const FALLBACK_THUMBNAIL = "sng-hero.png";
  const DISPLAY_RESULTS = 12;

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

  const getRequestedVideoId = () => {
    const params = new URLSearchParams(window.location.search);
    const videoId = params.get("v")?.trim() || "";
    return /^[a-zA-Z0-9_-]{6,}$/.test(videoId) ? videoId : "";
  };

  const getPortalShareUrl = (videoId) => {
    const url = new URL("sng-tv.html", window.location.href);
    url.searchParams.set("v", videoId);
    return url.toString();
  };

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
          portalUrl: getPortalShareUrl(videoId),
          embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
        };
      })
      .filter((video) => video.id && !/private video|deleted video/i.test(video.title))
      .slice(0, DISPLAY_RESULTS);
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

  const updateBrowserUrl = (video) => {
    const url = new URL(window.location.href);
    url.searchParams.set("v", video.id);
    window.history.replaceState({}, "", url.toString());
  };

  const selectVideo = (video, { updateUrl = true } = {}) => {
    renderPlayer(video);
    if (updateUrl) updateBrowserUrl(video);
  };

  const shareVideo = async (video, button) => {
    const shareData = {
      title: video.title,
      text: "Regarde cette vidéo sur SNG TV",
      url: video.portalUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(video.portalUrl);
      if (!button) return;
      const originalText = button.textContent;
      button.textContent = "✅ Lien copié";
      window.setTimeout(() => {
        button.textContent = originalText;
      }, 2200);
    } catch (error) {
      if (error?.name === "AbortError") return;
      console.error("Erreur de partage SNG TV:", error);
      setStatus("Impossible de partager automatiquement. Copie le lien depuis la barre d'adresse.", "warning");
    }
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
          <div class="video-actions">
            <a class="watch-btn" href="${escapeHTML(video.portalUrl)}">▶ Regarder</a>
            <button class="share-btn" type="button" data-share-url="${escapeHTML(video.portalUrl)}">↗ Partager</button>
          </div>
        </div>`;
      card.querySelector(".thumb").addEventListener("click", () => selectVideo(video));
      card.querySelector("h3").addEventListener("click", () => selectVideo(video));
      card.querySelector(".watch-btn").addEventListener("click", (event) => {
        event.preventDefault();
        selectVideo(video);
      });
      card.querySelector(".share-btn").addEventListener("click", (event) => shareVideo(video, event.currentTarget));
      fragment.appendChild(card);
    });

    state.grid.appendChild(fragment);

    const requestedVideoId = getRequestedVideoId();
    const requestedVideo = videos.find((video) => video.id === requestedVideoId);
    selectVideo(requestedVideo || videos[0], { updateUrl: Boolean(requestedVideo) });

    const shareLinks = videos.map((video) => video.portalUrl);
    const uniqueShareLinks = new Set(shareLinks);
    const shareStatus = uniqueShareLinks.size === videos.length
      ? " Chaque vidéo génère un lien de portail différent."
      : " Attention : certains liens de partage sont identiques.";
    setStatus(`${videos.length} dernières vidéos chargées automatiquement depuis YouTube.${shareStatus}`, uniqueShareLinks.size === videos.length ? "success" : "warning");
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
