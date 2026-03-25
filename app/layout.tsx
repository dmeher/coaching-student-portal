import type { Metadata, Viewport } from 'next'
import './styles/globals.css'
import Navigation from '@/components/Navigation'

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
      <body className="min-h-screen bg-slate-50">
        <Navigation />
        <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
        <footer className="mt-12 py-6 text-center text-sm text-slate-400 border-t border-slate-100">
          © {new Date().getFullYear()} Amlan Coaching · Student Portal
        </footer>
      </body>
    </html>
  )
}
