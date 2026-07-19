const CACHE_NAME = 'streamplex-static-v1';
const IMAGE_CACHE_NAME = 'streamplex-thumbnails-v1';
const API_CACHE_NAME = 'streamplex-metadata-v1';

// Initial shell assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html'
];

// 1. Service Worker Install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('SW: Pre-caching site shell');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// 2. Service Worker Activation (Cleanup old caches)
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME, IMAGE_CACHE_NAME, API_CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('SW: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Intercept Network Requests & Apply Offline Strategies
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // A. SPA Router / HTML Page Shell Fallback (Network-First, Cache-Fallback)
  if (event.request.mode === 'navigate' || (event.request.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put('/index.html', responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          console.log('SW: App navigation offline fallback');
          return caches.match('/index.html') || caches.match('/');
        })
    );
    return;
  }

  // B. Video Banners & Thumbnails (Cache-First, Fallback Placeholder)
  const isImage = 
    event.request.destination === 'image' || 
    url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico)/i) ||
    url.hostname.includes('unsplash.com') ||
    url.pathname.includes('/uploads/') ||
    url.pathname.includes('/api/uploads');

  if (isImage) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then((networkResponse) => {
            // Only cache valid standard responses
            if (networkResponse && (networkResponse.status === 200 || networkResponse.status === 0)) {
              const responseClone = networkResponse.clone();
              caches.open(IMAGE_CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone);
              });
            }
            return networkResponse;
          })
          .catch(() => {
            console.log('SW: Image offline fallback');
            // Return an elegant SVG placeholder for video thumbnails when offline
            return new Response(
              `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="225" viewBox="0 0 400 225">
                <rect width="100%" height="100%" fill="#111827"/>
                <path d="M180 90 L240 112.5 L180 135 Z" fill="#4f46e5" opacity="0.8"/>
                <text x="50%" y="65%" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#6b7280" dominant-baseline="middle" text-anchor="middle">অফলাইন মোড</text>
                <text x="50%" y="78%" font-family="system-ui, sans-serif" font-size="10" fill="#4b5563" dominant-baseline="middle" text-anchor="middle">ছবিটি ক্যাশ করা নেই</text>
              </svg>`,
              { headers: { 'Content-Type': 'image/svg+xml' } }
            );
          });
      })
    );
    return;
  }

  // C. Video Metadata & Settings APIs (Stale-While-Revalidate with Safe Offline Fallbacks)
  const isMetadataApi = 
    url.pathname === '/api/videos' ||
    url.pathname === '/api/categories' ||
    url.pathname === '/api/settings' ||
    url.pathname === '/api/ads' ||
    url.pathname.startsWith('/api/videos/');

  if (isMetadataApi) {
    event.respondWith(
      caches.open(API_CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                cache.put(event.request, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch((err) => {
              console.log('SW: Metadata API fetch failed (offline/network issue)', err);
            });

          // Return instant cache data if available, or fall back to fetch promise
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // D. Static Bundled Code Assets (Vite CSS, JS, fonts) (Stale-While-Revalidate)
  const isStaticAsset = 
    url.pathname.includes('/assets/') ||
    url.pathname.match(/\.(js|css|woff2|woff|ttf|eot)/i) ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com');

  if (isStaticAsset) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
            });
          }
          return networkResponse;
        });
        return cachedResponse || fetchPromise;
      })
    );
    return;
  }
});
