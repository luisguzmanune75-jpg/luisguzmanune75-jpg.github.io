const MAX_ARTICLES = 100;

function dedupeArticles(articles = []) {
  const seen = new Set();
  const unique = [];

  for (const article of articles) {
    const key = (article?.url || article?.title || "").trim().toLowerCase();
    if (!key || seen.has(key)) {
      continue;
    }

    seen.add(key);
    unique.push(article);

    if (unique.length >= MAX_ARTICLES) {
      break;
    }
  }

  return unique;
}

async function fetchNewsPages(buildUrl, apiKey, sourceLabel) {
  let mergedArticles = [];

  for (const page of [1, 2]) {
    const url = buildUrl(page);
    const maskedUrl = apiKey ? url.replace(apiKey, `${apiKey.slice(0, 4)}***`) : url;
    console.log(`${sourceLabel} request URL (page ${page}):`, maskedUrl);

    const res = await fetch(url);
    console.log(`${sourceLabel} response status (page ${page}):`, res.status);

    const data = await res.json();

    if (data.status === "error") {
      console.log(`${sourceLabel} error payload (page ${page}):`, data);
      if (page === 1) {
        return { error: data };
      }
      break;
    }

    const pageArticles = data.articles || [];
    console.log(`${sourceLabel} articles fetched (page ${page}):`, pageArticles.length);

    if (pageArticles.length === 0) {
      break;
    }

    mergedArticles = dedupeArticles([...mergedArticles, ...pageArticles]);

    if (mergedArticles.length >= MAX_ARTICLES || pageArticles.length < MAX_ARTICLES) {
      break;
    }
  }

  return { articles: mergedArticles };
}

export async function handler(event) {
  const API_KEY = process.env.NEWS_API_KEY;
  const category = event.queryStringParameters.category || "general";

  console.log("NEWS_API_KEY present:", Boolean(API_KEY));

  try {
    const topHeadlinesResult = await fetchNewsPages(
      (page) => `https://newsapi.org/v2/top-headlines?country=us&category=${category}&pageSize=${MAX_ARTICLES}&page=${page}&apiKey=${API_KEY}`,
      API_KEY,
      "top-headlines"
    );

    if (topHeadlinesResult.error) {
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "GET"
        },
        body: JSON.stringify(topHeadlinesResult.error)
      };
    }

    let finalArticles = topHeadlinesResult.articles || [];

    if (finalArticles.length === 0) {
      console.log("No articles from top-headlines, fallback to everything");

      const fallbackResult = await fetchNewsPages(
        (page) => `https://newsapi.org/v2/everything?q=actualité&language=fr&sortBy=publishedAt&pageSize=${MAX_ARTICLES}&page=${page}&apiKey=${API_KEY}`,
        API_KEY,
        "everything"
      );

      finalArticles = fallbackResult.articles || [];
    }

    finalArticles = dedupeArticles(finalArticles).slice(0, MAX_ARTICLES);
    console.log("Final articles count returned:", finalArticles.length);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET"
      },
      body: JSON.stringify(finalArticles)
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erreur serveur" })
    };
  }
}
