import type { Metadata, Viewport } from 'next'
import './styles/globals.css'
import Navigation from '@/components/Navigation'
import MobileBottomNav from '@/components/MobileBottomNav'
import { AuthProvider } from '@/lib/authContext'

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
          <div className="app-shell">
            <div className="app-surface">
              <Navigation />
              <main className="px-3 pb-6 pt-3 sm:px-6 sm:pb-8 sm:pt-6">{children}</main>
            </div>
            <footer className="pb-24 pt-5 text-center text-xs text-slate-500 sm:pb-2 sm:text-sm">
              Amlan Coaching · Student Portal
            </footer>
          </div>
          <MobileBottomNav />
        </AuthProvider>
      </body>
    </html>
  )
}
