// Configuration publique SNG TV — aucune clé API ne doit être placée ici.
// La clé YouTube Data API v3 doit être configurée uniquement dans Vercel
// avec la variable d'environnement YOUTUBE_API_KEY.
// Domaine Vercel de production qui héberge la Function Serverless `/api/sng-tv`.
// Le site peut être servi depuis GitHub Pages, donc l’API doit viser Vercel explicitement.
const SNG_TV_PRODUCTION_ORIGIN = "https://luisguzmanune75-jpg-github-io.vercel.app";
const SNG_TV_API_ENDPOINT = `${SNG_TV_PRODUCTION_ORIGIN}/api/sng-tv`;

// Tu peux mettre ici un vrai Channel ID YouTube de type "UC...".
// La valeur actuelle est une URL de handle ; la fonction Vercel la résout automatiquement.
const CHANNEL_ID = "https://www.youtube.com/@CanalFamilial";

const MAX_RESULTS = 12;
