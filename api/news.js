module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method Not Allowed' });

  const category = typeof req.query?.category === 'string' ? req.query.category : 'general';
  const feeds = {
    general: 'https://news.google.com/rss?hl=fr&gl=FR&ceid=FR:fr',
    business: 'https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=fr&gl=FR&ceid=FR:fr',
    sports: 'https://news.google.com/rss/headlines/section/topic/SPORTS?hl=fr&gl=FR&ceid=FR:fr'
  };

  const feedUrl = feeds[category] || feeds.general;

  try {
    const response = await fetch(feedUrl, {
      headers: { 'User-Agent': 'SNG-Portal/1.0' }
    });

    if (!response.ok) {
      return res.status(502).json({ status: 'error', message: 'Flux actualités indisponible' });
    }

    const xml = await response.text();
    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(match => match[1]);

    const decode = (value = '') => value
      .replace(/<!\[CDATA\[/g, '')
      .replace(/\]\]>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim();

    const getTag = (item, tag) => {
      const m = item.match(new RegExp('<' + tag + '[^>]*>([\\s\\S]*?)<\\/' + tag + '>'));
      return m ? decode(m[1]) : '';
    };

    const articles = items.map(item => {
      const title = getTag(item, 'title');
      const description = getTag(item, 'description').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      const url = getTag(item, 'link');
      const publishedAt = getTag(item, 'pubDate');
      const source = getTag(item, 'source');

      return {
        source: { name: source || 'Google Actualités' },
        title,
        description,
        content: description,
        url,
        urlToImage: ''
      };
    }).filter(article => article.title && article.url);

    return res.status(200).json({ status: 'ok', totalResults: articles.length, articles });
  } catch (error) {
    return res.status(502).json({
      status: 'error',
      code: 'proxy_error',
      message: 'Impossible de charger les actualités'
    });
  }
};
