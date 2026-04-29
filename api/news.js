module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ message: 'NEWS_API_KEY is not configured' });
  }

  const category = typeof req.query?.category === 'string' ? req.query.category : '';
  const requestedPageRaw = Number.parseInt(req.query?.page, 10);
  const page = Number.isFinite(requestedPageRaw) && requestedPageRaw > 0 ? String(requestedPageRaw) : '1';
  const pageSizeRaw = Number.parseInt(req.query?.pageSize, 10);
  const pageSize = Number.isFinite(pageSizeRaw) && pageSizeRaw > 0 ? String(Math.min(pageSizeRaw, 100)) : '100';

  const topHeadlinesParams = new URLSearchParams({ country: 'fr', category, page, pageSize, apiKey });
  const topHeadlinesUrl = `https://newsapi.org/v2/top-headlines?${topHeadlinesParams.toString()}`;

  const fallbackParams = new URLSearchParams({
    q: 'actualité OR news',
    language: 'fr',
    sortBy: 'publishedAt',
    page,
    pageSize,
    apiKey
  });
  const fallbackUrl = `https://newsapi.org/v2/everything?${fallbackParams.toString()}`;

  try {
    const topHeadlinesResponse = await fetch(topHeadlinesUrl);
    const topHeadlinesContentType = topHeadlinesResponse.headers.get('content-type') || 'application/json';
    const topHeadlinesBody = await topHeadlinesResponse.text();

    let topHeadlinesData;
    if (topHeadlinesContentType.includes('application/json')) {
      try {
        topHeadlinesData = JSON.parse(topHeadlinesBody);
      } catch {
        topHeadlinesData = undefined;
      }
    }

    const shouldFallback = !Array.isArray(topHeadlinesData?.articles) || topHeadlinesData.articles.length === 0;

    if (!shouldFallback) {
      res.status(topHeadlinesResponse.status);
      res.setHeader('Content-Type', topHeadlinesContentType);
      return res.send(topHeadlinesBody);
    }

    const fallbackResponse = await fetch(fallbackUrl);
    const fallbackContentType = fallbackResponse.headers.get('content-type') || 'application/json';
    const fallbackBody = await fallbackResponse.text();

    res.status(fallbackResponse.status);
    res.setHeader('Content-Type', fallbackContentType);
    return res.send(fallbackBody);
  } catch (error) {
    return res.status(502).json({
      status: 'error',
      code: 'proxy_error',
      message: 'Failed to fetch data from NewsAPI'
    });
  }
};
