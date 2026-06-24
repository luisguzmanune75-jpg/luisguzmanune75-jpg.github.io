const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';
const DEFAULT_MAX_RESULTS = 12;
const FALLBACK_CHANNEL_ID = 'https://www.youtube.com/@CanalFamilial';

const normalizeChannelInput = (input) => {
  const rawValue = String(input || '').trim();
  if (!rawValue) return { type: 'empty', value: '' };
  if (/^UC[a-zA-Z0-9_-]{20,}$/.test(rawValue)) return { type: 'id', value: rawValue };

  const handleMatch = rawValue.match(/(?:youtube\.com\/(?:@|c\/|channel\/)?|^@)([a-zA-Z0-9._-]+)/);
  if (rawValue.includes('/channel/')) {
    const channelMatch = rawValue.match(/\/channel\/(UC[a-zA-Z0-9_-]+)/);
    if (channelMatch) return { type: 'id', value: channelMatch[1] };
  }
  if (handleMatch) return { type: 'handle', value: handleMatch[1].startsWith('@') ? handleMatch[1] : `@${handleMatch[1]}` };
  return { type: 'handle', value: rawValue.startsWith('@') ? rawValue : `@${rawValue}` };
};

const getBestThumbnail = (thumbnails = {}) =>
  thumbnails.maxres?.url || thumbnails.standard?.url || thumbnails.high?.url || thumbnails.medium?.url || thumbnails.default?.url || '';

const extractVideoId = (item) => item?.snippet?.resourceId?.videoId || item?.id?.videoId || item?.id;

const sendJson = (res, statusCode, payload) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  return res.status(statusCode).json({ videos: [], ...payload });
};

const youtubeFetch = async (path, params, apiKey) => {
  const url = new URL(`${YOUTUBE_API_BASE}/${path}`);
  Object.entries({ ...params, key: apiKey }).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, value);
  });

  const response = await fetch(url.toString(), { headers: { Accept: 'application/json' } });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const detail = data?.error?.message || 'Réponse invalide de YouTube Data API v3.';
    console.error('[SNG TV API] YouTube request failed', {
      path,
      status: response.status,
      message: detail,
    });
    const error = new Error(detail);
    error.statusCode = response.status;
    error.code = data?.error?.status || 'YOUTUBE_API_ERROR';
    throw error;
  }

  return data;
};

const resolveUploadsPlaylist = async (channelInput, apiKey) => {
  const channel = normalizeChannelInput(channelInput);
  if (channel.type === 'empty') throw new Error('La chaîne YouTube n’est pas configurée.');

  const params = channel.type === 'id'
    ? { part: 'contentDetails', id: channel.value, maxResults: '1' }
    : { part: 'contentDetails', forHandle: channel.value, maxResults: '1' };

  let data = await youtubeFetch('channels', params, apiKey);
  if (channel.type === 'handle' && !data.items?.length && channel.value.startsWith('@')) {
    data = await youtubeFetch('channels', { ...params, forHandle: channel.value.slice(1) }, apiKey);
  }

  const playlistId = data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!playlistId) throw new Error('Chaîne YouTube introuvable. Vérifie le Channel ID ou le handle configuré.');
  return playlistId;
};

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return sendJson(res, 200, { message: 'OK' });
  if (req.method !== 'GET') {
    return sendJson(res, 405, {
      error: 'METHOD_NOT_ALLOWED',
      message: 'Method Not Allowed',
    });
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    console.error('[SNG TV API] Missing YOUTUBE_API_KEY environment variable');
    return sendJson(res, 500, {
      error: 'MISSING_YOUTUBE_API_KEY',
      message: 'YOUTUBE_API_KEY is not configured',
    });
  }

  const maxResultsRaw = Number.parseInt(req.query?.maxResults, 10);
  const maxResults = Number.isFinite(maxResultsRaw) && maxResultsRaw > 0
    ? String(Math.min(maxResultsRaw, 50))
    : String(DEFAULT_MAX_RESULTS);
  const channelInput = typeof req.query?.channelId === 'string' && req.query.channelId.trim()
    ? req.query.channelId
    : process.env.YOUTUBE_CHANNEL_ID || FALLBACK_CHANNEL_ID;

  try {
    const playlistId = await resolveUploadsPlaylist(channelInput, apiKey);
    const data = await youtubeFetch('playlistItems', {
      part: 'snippet,contentDetails',
      playlistId,
      maxResults,
    }, apiKey);

    const videos = (data.items || [])
      .map((item) => {
        const snippet = item.snippet || {};
        const videoId = extractVideoId(item);
        const url = videoId ? `https://www.youtube.com/watch?v=${videoId}` : '';
        return {
          id: videoId,
          title: snippet.title || 'Vidéo SNG TV',
          description: snippet.description || '',
          thumbnail: getBestThumbnail(snippet.thumbnails),
          publishedAt: snippet.publishedAt || item.contentDetails?.videoPublishedAt || null,
          url,
          watchUrl: url,
          embedUrl: videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : '',
        };
      })
      .filter((video) => video.id && !/private video|deleted video/i.test(video.title));

    console.log('[SNG TV API] Videos fetched successfully', {
      channelInput,
      playlistId,
      count: videos.length,
    });
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return sendJson(res, 200, { videos });
  } catch (error) {
    const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 502;
    const safeStatusCode = statusCode >= 400 && statusCode < 600 ? statusCode : 502;
    console.error('[SNG TV API] Failed to build JSON response', {
      statusCode: safeStatusCode,
      error: error.code || 'SNG_TV_ENDPOINT_ERROR',
      message: error.message,
    });
    return sendJson(res, safeStatusCode, {
      error: error.code || 'SNG_TV_ENDPOINT_ERROR',
      message: error.message || 'Failed to fetch data from YouTube Data API v3',
    });
  }
};
