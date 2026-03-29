const CACHE_NAME = 'ma-pwa-v2';
const ASSETS_TO_CACHE = [
  'pwa.thierry-morin.com/',
  'pwa.thierry-morin.com/index.html',
  'pwa.thierry-morin.com/manifest.json'
];

// 1. Installation : On met en cache les fichiers essentiels
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache ouvert');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// 2. Activation : On nettoie les anciens caches si nécessaire
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 3. Interception : On sert depuis le cache, sinon depuis le réseau
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Si le fichier est dans le cache, on le renvoie
        if (response) {
          return response;
        }
        // Sinon, on le demande au réseau
        return fetch(event.request);
      })
  );
});