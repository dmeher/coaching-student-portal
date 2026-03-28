import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AMLAN COACHING - Student Portal',
    short_name: 'Amlan Portal',
    description: 'Student portal for Amlan Coaching — attendance, fees, and class info.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    orientation: 'portrait',
    categories: ['education'],
    icons: [
      {
        src: '/icons/icon-192x192.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512x512.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icons/apple-touch-icon.svg',
        sizes: '180x180',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
    shortcuts: [
      {
        name: 'My Attendance',
        short_name: 'Attendance',
        description: 'View your attendance calendar',
        url: '/attendance',
        icons: [{ src: '/icons/icon-192x192.svg', sizes: '192x192' }],
      },
      {
        name: 'Notifications',
        short_name: 'Alerts',
        description: 'Read messages from your teacher',
        url: '/notifications',
        icons: [{ src: '/icons/icon-192x192.svg', sizes: '192x192' }],
      },
    ],
  }
}
