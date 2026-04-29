const MAX_ARTICLES = 100;
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, OPTIONS"
};
const TOP_HEADLINES_STRATEGIES = [
  { pageSize: 100, pages: [1] },
  { pageSize: 50, pages: [1, 2] }
];
const EVERYTHING_STRATEGIES = [
  { pageSize: 100, pages: [1] },
  { pageSize: 50, pages: [1, 2] }
];
const FALLBACK_QUERY_BY_CATEGORY = {
  general: "actualité OR world OR breaking",
  business: "business OR economy OR market",
  sports: "sports OR football OR basketball"
};

function dedupeArticles(articles = [], limit = MAX_ARTICLES) {
  const seen = new Set();
  const unique = [];

  for (const article of articles) {
    const key = (article?.url || article?.title || "").trim().toLowerCase();
    if (!key || seen.has(key)) {
      continue;
    }

    seen.add(key);
    unique.push(article);

    if (unique.length >= limit) {
      break;
    }
  }

  return unique;
}

async function fetchNewsPages(buildUrl, apiKey, sourceLabel, limit = MAX_ARTICLES) {
  let mergedArticles = [];
  let lastError = null;

  for (const strategy of buildUrl.strategies) {
    for (const page of strategy.pages) {
      const url = buildUrl.fn(page, strategy.pageSize);
      const maskedUrl = apiKey ? url.replace(apiKey, `${apiKey.slice(0, 4)}***`) : url;
      console.log(
        `${sourceLabel} request URL (page ${page}, pageSize ${strategy.pageSize}):`,
        maskedUrl
      );

      const res = await fetch(url);
      console.log(
        `${sourceLabel} response status (page ${page}, pageSize ${strategy.pageSize}):`,
        res.status
      );

      const data = await res.json();

      if (data.status === "error") {
        console.log(
          `${sourceLabel} error payload (page ${page}, pageSize ${strategy.pageSize}):`,
          data
        );
        lastError = data;
        break;
      }

      const pageArticles = data.articles || [];
      console.log(
        `${sourceLabel} articles fetched (page ${page}, pageSize ${strategy.pageSize}):`,
        pageArticles.length
      );

      if (pageArticles.length === 0) {
        break;
      }

      mergedArticles = dedupeArticles([...mergedArticles, ...pageArticles], limit);

      if (mergedArticles.length >= limit) {
        return { articles: mergedArticles };
      }

      if (pageArticles.length < strategy.pageSize) {
        break;
      }
    }

    if (mergedArticles.length > 0 || lastError === null) {
      break;
    }
  }

  if (mergedArticles.length === 0 && lastError) {
    return { error: lastError };
  }

  return { articles: mergedArticles.slice(0, limit) };
}

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: CORS_HEADERS,
      body: ""
    };
  }

  const API_KEY = process.env.NEWS_API_KEY;
  const category = event.queryStringParameters?.category || "general";
  const page = Math.max(Number.parseInt(event.queryStringParameters?.page || "1", 10) || 1, 1);
  const pageSize = Math.min(Math.max(Number.parseInt(event.queryStringParameters?.pageSize || "100", 10) || 100, 1), 100);
  const perRequestLimit = pageSize;
  const fallbackQuery = FALLBACK_QUERY_BY_CATEGORY[category] || FALLBACK_QUERY_BY_CATEGORY.general;

  console.log("NEWS_API_KEY present:", Boolean(API_KEY));

  try {
    const topHeadlinesResult = await fetchNewsPages(
      {
        strategies: TOP_HEADLINES_STRATEGIES,
        fn: (page, pageSize) =>
          `https://newsapi.org/v2/top-headlines?country=us&category=${category}&pageSize=${pageSize}&page=${page}&apiKey=${API_KEY}`
      },
      API_KEY,
      "top-headlines",
      perRequestLimit
    );
    let finalArticles = topHeadlinesResult.articles || [];

    if (finalArticles.length < perRequestLimit) {
      console.log(
        `Top-headlines insuffisant (${finalArticles.length}/${perRequestLimit}), complément everything`
      );

      const everythingResult = await fetchNewsPages(
        {
          strategies: EVERYTHING_STRATEGIES,
          fn: (page, pageSize) =>
            `https://newsapi.org/v2/everything?q=${encodeURIComponent(
              fallbackQuery
            )}&language=fr&sortBy=publishedAt&pageSize=${pageSize}&page=${page}&apiKey=${API_KEY}`
        },
        API_KEY,
        "everything",
        perRequestLimit - finalArticles.length
      );

      const everythingArticles = everythingResult.articles || [];
      finalArticles = dedupeArticles([...finalArticles, ...everythingArticles], perRequestLimit).slice(0, perRequestLimit);
    } else {
      finalArticles = dedupeArticles(finalArticles, perRequestLimit).slice(0, perRequestLimit);
    }

    console.log("Final articles count returned:", finalArticles.length);

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(finalArticles)
    };

  } catch (error) {
    console.error("News function error:", error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Erreur serveur" })
    };
  }
}
