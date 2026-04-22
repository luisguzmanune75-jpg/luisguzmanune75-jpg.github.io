export async function handler(event) {
  const API_KEY = process.env.NEWS_API_KEY;
  const category = event.queryStringParameters.category || "general";

  try {
    const res = await fetch(`https://newsapi.org/v2/top-headlines?country=fr&category=${category}&pageSize=6&apiKey=${API_KEY}`);
    const data = await res.json();

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
