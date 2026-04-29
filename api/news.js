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

  const params = new URLSearchParams(req.query || {});
  params.set('apiKey', apiKey);

  const url = `https://newsapi.org/v2/top-headlines?${params.toString()}`;

  try {
    const response = await fetch(url);
    const contentType = response.headers.get('content-type') || 'application/json';
    const body = await response.text();

    res.status(response.status);
    res.setHeader('Content-Type', contentType);
    return res.send(body);
  } catch (error) {
    return res.status(502).json({
      status: 'error',
      code: 'proxy_error',
      message: 'Failed to fetch data from NewsAPI'
    });
  }
};
