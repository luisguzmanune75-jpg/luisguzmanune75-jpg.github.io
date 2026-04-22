export async function handler(event) {
  const API_KEY = process.env.NEWS_API_KEY;
  const category = event.queryStringParameters.category || "general";

  console.log("NEWS_API_KEY present:", Boolean(API_KEY));

  try {
    const url = `https://newsapi.org/v2/top-headlines?country=fr&category=${category}&pageSize=6&apiKey=${API_KEY}`;
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

    if (!data.articles) {
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "GET"
        },
        body: JSON.stringify({ error: "No articles returned", newsApiResponse: data })
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
