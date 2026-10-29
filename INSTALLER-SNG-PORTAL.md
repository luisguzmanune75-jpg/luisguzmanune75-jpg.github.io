# SNG Portal — application web installable (PWA)

Les fichiers `manifest.webmanifest` et `service-worker.js` fournissent la base technique d'une PWA sur GitHub Pages.

## Installation sur iPhone
1. Ouvrir https://luisguzmanune75-jpg.github.io/index.html dans Safari.
2. Appuyer sur **Partager**.
3. Choisir **Sur l'écran d'accueil**.
4. Activer **Ouvrir comme app web** si l'option apparaît, puis appuyer sur **Ajouter**.

## Remarques
- GitHub Pages sert le site en HTTPS, requis pour les service workers.
- Le service worker met en cache l'enveloppe du site et certains fichiers statiques. Les fonctions dépendant de services externes/API nécessitent toujours une connexion.
- Cette PWA n'est pas une publication dans l'Apple App Store ou Google Play.
- Les règles et les capacités d'installation varient selon le navigateur et la version du système.
