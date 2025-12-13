// Service Worker for MSA Community PWA
const CACHE_NAME = 'msa-community-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/community/index.html',
  '/community/dashboard.html',
  '/community/feed.html',
  '/community/events.html',
  '/community/messages.html',
  '/community/friends.html',
  '/community/groups.html',
  '/community/directory.html',
  '/community/resources.html',
  '/community/study-groups.html',
  '/css/styles.css',
  '/community/css/community.css',
  '/js/script.js',
  '/js/modern-script.js',
  '/community/js/community.js',
  '/images/logos/MSA.png',
  '/images/logos/rumsa-favicon.png',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        // Filter out invalid URLs before caching
        const validUrls = urlsToCache.filter(url => {
          // Only cache same-origin URLs
          try {
            const urlObj = new URL(url, self.location.origin);
            return urlObj.origin === self.location.origin || url.startsWith('http');
          } catch {
            return false;
          }
        });
        
        return Promise.allSettled(
          validUrls.map(url => 
            cache.add(url).catch(err => {
              console.log(`Failed to cache ${url}:`, err);
              return null;
            })
          )
        );
      })
      .catch((error) => {
        console.error('Cache install failed:', error);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Skip caching for:
  // - API calls
  // - POST/PUT/DELETE requests (only cache GET)
  // - Chrome extension URLs
  // - External domains (only cache same-origin)
  // - Non-GET requests
  if (request.url.includes('/api/') ||
      request.method !== 'GET' ||
      request.url.startsWith('chrome-extension://') ||
      request.url.startsWith('moz-extension://') ||
      url.origin !== self.location.origin) {
    return; // Let browser handle normally
  }

  event.respondWith(
    caches.match(request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(request).then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Only cache same-origin GET requests
          if (response.type === 'basic' && request.method === 'GET') {
            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                try {
                  cache.put(request, responseToCache);
                } catch (error) {
                  console.log('Cache put failed (non-critical):', error);
                }
              })
              .catch((error) => {
                console.log('Cache error (non-critical):', error);
              });
          }

          return response;
        });
      })
      .catch(() => {
        // If both cache and network fail, return offline page
        if (request.destination === 'document') {
          return caches.match('/index.html');
        }
        return fetch(request); // Fallback to network
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-posts') {
    event.waitUntil(syncPosts());
  }
});

async function syncPosts() {
  // Sync any pending posts when back online
  console.log('Syncing posts...');
}

// Push notifications (for future use)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New update from MSA Community',
    icon: '/images/logos/rumsa-favicon.png',
    badge: '/images/logos/rumsa-favicon.png',
    vibrate: [200, 100, 200],
    tag: 'msa-notification',
    requireInteraction: false
  };

  event.waitUntil(
    self.registration.showNotification('MSA Community', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/community/')
  );
});

