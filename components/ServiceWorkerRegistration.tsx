'use client'

import { useEffect } from 'react'

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // In dev mode, unregister old SWs and clear caches so stale assets don't interfere
      navigator.serviceWorker?.getRegistrations().then((registrations) => {
        registrations.forEach((r) => r.unregister())
      })
      caches.keys().then((keys) => keys.forEach((key) => caches.delete(key)))
      return
    }

    if (!('serviceWorker' in navigator)) return

    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((registration) => {
        // When a new SW version is found, activate it immediately
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (!newWorker) return
          newWorker.addEventListener('statechange', () => {
            if (
              newWorker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              newWorker.postMessage({ type: 'SKIP_WAITING' })
            }
          })
        })
      })
      .catch(() => {
        // SW registration failed — non-critical, app still works
      })
  }, [])

  return null
}
