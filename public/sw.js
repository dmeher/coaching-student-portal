const CACHE_VERSION = 'v1'
const STATIC_CACHE = `portal-static-${CACHE_VERSION}`
const DYNAMIC_CACHE = `portal-dynamic-${CACHE_VERSION}`
const ALL_CACHES = [STATIC_CACHE, DYNAMIC_CACHE]

// Core app shell assets to pre-cache on install
const PRECACHE_URLS = [
  '/',
  '/students',
  '/teachers',
  '/attendance',
  '/my-profile',
  '/notifications',
  '/favicon.svg',
  '/icons/icon-192x192.svg',
  '/icons/icon-512x512.svg',
]

// ─── Install ─────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) =>
        cache.addAll(
          PRECACHE_URLS.map(
            (url) => new Request(url, { cache: 'reload', credentials: 'same-origin' })
          )
        )
      )
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  )
})

// ─── Activate ────────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => !ALL_CACHES.includes(key))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  )
})

// ─── Fetch ───────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Ignore non-GET, chrome-extension, or cross-origin requests
  if (
    request.method !== 'GET' ||
    !url.protocol.startsWith('http') ||
    url.origin !== self.location.origin
  ) {
    return
  }

  // ── API routes: Network-first, offline JSON fallback ──────────────────────
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => response)
        .catch(() =>
          new Response(
            JSON.stringify({ message: 'You are offline. Please check your internet connection.' }),
            {
              status: 503,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        )
    )
    return
  }

  // ── Next.js HMR / _next/webpack: always skip ──────────────────────────────
  if (url.pathname.includes('_next/webpack-hmr') || url.pathname.includes('__nextjs')) {
    return
  }

  // ── Next.js static build assets: network-only to avoid stale chunk issues ─
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(fetch(request))
    return
  }

  // ── Images & fonts: Cache-first with dynamic cache ─────────────────────────
  if (
    request.destination === 'image' ||
    request.destination === 'font' ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.startsWith('/fonts/')
  ) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            if (response.ok) {
              const clone = response.clone()
              caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, clone))
            }
            return response
          }).catch(() => cached || Response.error())
      )
    )
    return
  }

  // ── Navigation / HTML: Network-first, fallback to cached ──────────────────
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone()
            caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, clone))
          }
          return response
        })
        .catch(() =>
          caches.match(request).then(
            (cached) => cached || caches.match('/')
          )
        )
    )
    return
  }

  // ── Default: Stale-while-revalidate ──────────────────────────────────────
  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request).then((response) => {
        if (response.ok) {
          const clone = response.clone()
          caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, clone))
        }
        return response
      }).catch(() => cached || Response.error())
      return cached || networkFetch
    })
  )
})

// ─── Message handler (SKIP_WAITING / in-SW notifications) ────────────────────
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }

  if (event.data?.type === 'SHOW_NOTIFICATION' && event.data?.payload) {
    const payload = event.data.payload
    event.waitUntil(
      self.registration.showNotification(payload.title || 'Amlan Coaching', {
        body: payload.body || 'You have a new notification.',
        icon: '/icons/icon-192x192.svg',
        badge: '/icons/icon-192x192.svg',
        tag: payload.tag,
        data: payload.url ? { url: payload.url } : undefined,
      })
    )
  }
})

// ─── Push Notifications ───────────────────────────────────────────────────────
self.addEventListener('push', (event) => {
  if (!event.data) return
  const data = event.data.json()
  event.waitUntil(
    self.registration.showNotification(data.title || 'Amlan Coaching', {
      body: data.body || 'You have a new notification.',
      icon: '/icons/icon-192x192.svg',
      badge: '/icons/icon-192x192.svg',
      data: data.url ? { url: data.url } : undefined,
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification.data?.url || '/notifications'
  event.waitUntil(self.clients.openWindow(new URL(url, self.location.origin).toString()))
})
