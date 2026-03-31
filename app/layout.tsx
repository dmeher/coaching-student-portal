import type { Metadata, Viewport } from 'next'
import './styles/globals.css'
import Navigation from '@/components/Navigation'
import MobileBottomNav from '@/components/MobileBottomNav'
import { AuthProvider } from '@/lib/authContext'
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration'
import InstallPrompt from '@/components/InstallPrompt'
import { PWAInstallProvider } from '@/lib/pwaInstallContext'

export const metadata: Metadata = {
  title: 'AMLAN COACHING - Student Portal',
  description: 'Student and parent portal for Amlan Coaching — view student info and teacher profiles.',
  applicationName: 'Amlan Student Portal',
  icons: {
    icon: '/favicon.svg',
    apple: '/icons/apple-touch-icon.svg',
  },
  openGraph: {
    type: 'website',
    title: 'AMLAN COACHING - Student Portal',
    description: 'Student and parent portal for Amlan Coaching',
  },
}

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen">
        <AuthProvider>
          <PWAInstallProvider>
            <ServiceWorkerRegistration />
            <div className="app-shell">
              <div className="app-frame">
                <Navigation />
                <div className="app-content">
                  <main className="app-main">{children}</main>
                  <footer className="pb-24 pt-5 text-center text-xs text-slate-500 sm:px-2 sm:pb-2 sm:pt-3 sm:text-sm">
                    Amlan Coaching · Student Portal
                  </footer>
                </div>
              </div>
            </div>
            <MobileBottomNav />
            <InstallPrompt />
          </PWAInstallProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
