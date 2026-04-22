export async function handler(event) {
  const API_KEY = process.env.NEWS_API_KEY;
  const category = event.queryStringParameters.category || "general";

  console.log("NEWS_API_KEY present:", Boolean(API_KEY));

  try {
    const url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`;
    const maskedUrl = API_KEY ? url.replace(API_KEY, `${API_KEY.slice(0, 4)}***`) : url;
    console.log("NewsAPI request URL:", maskedUrl);

    const res = await fetch(url);
    console.log("NewsAPI response status:", res.status);

    const data = await res.json();
    console.log("NewsAPI raw payload:", data);

    if (data.status === "error") {
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "GET"
        },
        body: JSON.stringify(data)
      };
    }

    if (!data.articles || data.articles.length === 0) {
      console.log("No articles from top-headlines, fallback to everything");

      const fallbackUrl = `https://newsapi.org/v2/everything?q=actualité&language=fr&sortBy=publishedAt&pageSize=20&apiKey=${API_KEY}`;

      const fallbackRes = await fetch(fallbackUrl);
      const fallbackData = await fallbackRes.json();

      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Methods": "GET"
        },
        body: JSON.stringify(fallbackData.articles || [])
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET"
      },
      body: JSON.stringify(data.articles)
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erreur serveur" })
    };
  }
}
