// Enhanced Service Worker for AlumnLink - SEO & Performance Optimization
const CACHE_NAME = 'alumnlink-v2.1.0';
const STATIC_CACHE = 'alumnlink-static-v2.1.0';
const DYNAMIC_CACHE = 'alumnlink-dynamic-v2.1.0';
const IMAGE_CACHE = 'alumnlink-images-v2.1.0';
const API_CACHE = 'alumnlink-api-v2.1.0';

// Critical resources to cache immediately (affects SEO performance)
const CRITICAL_STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo copy.png',
  '/favicon.png',
  '/banner.png',
  '/sitemap.xml',
  '/robots.txt'
];

// SEO-important pages to cache
const SEO_PAGES = [
  '/',
  '/Landing/about',
  '/Landing/contact',
  '/Landing/for-institutes',
  '/Landing/for-alumni',
  '/Landing/for-corporates',
  '/Landing/for-schools',
  '/Landing/terms',
  '/Landing/privacy',
  '/blog',
  '/pricing',
  '/features',
  '/resources'
];

// Dynamic content that should be cached
const DYNAMIC_PATTERNS = [
  /\/api\/public\//,
  /\/blog\/.*$/,
  /\/resources\/.*$/,
  /\/features\/.*$/
];

// Images and media patterns
const IMAGE_PATTERNS = [
  /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i,
  /\/uploads\//,
  /\/images\//,
  /\/assets\//
];

// Install event - cache critical resources
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache critical static assets
      caches.open(STATIC_CACHE).then(cache => {
        console.log('Service Worker: Caching critical assets');
        return cache.addAll(CRITICAL_STATIC_ASSETS);
      }),
      
      // Pre-cache important SEO pages
      caches.open(DYNAMIC_CACHE).then(cache => {
        console.log('Service Worker: Pre-caching SEO pages');
        return Promise.allSettled(
          SEO_PAGES.map(url => 
            fetch(url)
              .then(response => response.ok ? cache.put(url, response) : null)
              .catch(err => console.log(`Failed to cache ${url}:`, err))
          )
        );
      })
    ]).then(() => {
      console.log('Service Worker: Installation complete');
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      const deletePromises = cacheNames
        .filter(cacheName => 
          cacheName.startsWith('alumnlink-') && 
          ![CACHE_NAME, STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE, API_CACHE].includes(cacheName)
        )
        .map(cacheName => {
          console.log('Service Worker: Deleting old cache:', cacheName);
          return caches.delete(cacheName);
        });
      
      return Promise.all(deletePromises);
    }).then(() => {
      console.log('Service Worker: Activation complete');
      return self.clients.claim();
    })
  );
});

// Fetch event - intelligent caching strategy for SEO
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip Chrome extension requests
  if (url.protocol === 'chrome-extension:') {
    return;
  }
  
  // Handle different types of requests with optimal strategies
  if (isStaticAsset(request)) {
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
  } else if (isImage(request)) {
    event.respondWith(cacheFirstStrategy(request, IMAGE_CACHE));
  } else if (isAPIRequest(request)) {
    event.respondWith(networkFirstStrategy(request, API_CACHE));
  } else if (isSEOPage(request)) {
    event.respondWith(staleWhileRevalidateStrategy(request, DYNAMIC_CACHE));
  } else {
    event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE));
  }
});

// Cache-first strategy (best for static assets)
async function cacheFirstStrategy(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      await cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Cache-first strategy failed:', error);
    return caches.match('/offline.html') || new Response('Offline', { status: 503 });
  }
}

// Network-first strategy (best for dynamic content and APIs)
async function networkFirstStrategy(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      await cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Network request failed, trying cache:', error);
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return new Response('Offline - Content not available', { 
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Stale-while-revalidate strategy (best for SEO pages)
async function staleWhileRevalidateStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  // Start fetching new version in background
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(err => {
    console.log('Background fetch failed:', err);
    return cachedResponse;
  });
  
  // Return cached version immediately if available, otherwise wait for network
  return cachedResponse || fetchPromise;
}

// Helper functions
function isStaticAsset(request) {
  const url = new URL(request.url);
  return url.pathname.endsWith('.js') || 
         url.pathname.endsWith('.css') || 
         url.pathname.endsWith('.woff') || 
         url.pathname.endsWith('.woff2') ||
         url.pathname.includes('/static/');
}

function isImage(request) {
  return IMAGE_PATTERNS.some(pattern => pattern.test(request.url));
}

function isAPIRequest(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/api/') || 
         DYNAMIC_PATTERNS.some(pattern => pattern.test(request.url));
}

function isSEOPage(request) {
  const url = new URL(request.url);
  return SEO_PAGES.includes(url.pathname) ||
         url.pathname.startsWith('/Landing/') ||
         url.pathname.startsWith('/blog/') ||
         url.pathname.startsWith('/resources/') ||
         url.pathname.startsWith('/features/');
}

console.log('AlumnLink Service Worker: Enhanced version loaded with SEO optimizations');
