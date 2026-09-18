const SW_VERSION = '2026.09.18-4'
const CACHE_NAME = 'suivi-managers-' + SW_VERSION

self.addEventListener('install', (e) => {
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  )
  self.clients.claim()
})

// Pas de cache offline agressif ici (comme Kaizen) : l'appli dépend de données
// live (référentiel magasins, stats collaborateur, effectif RH) à chaque écran.
// Le SW sert surtout à forcer le renouvellement de version sur iOS (bug connu
// du bandeau de mise à jour, cf. correctif déjà appliqué sur les autres apps).
self.addEventListener('fetch', (e) => {
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)))
})
