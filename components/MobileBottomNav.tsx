'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/authContext'

export default function MobileBottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { student, logout } = useAuth()

  function handleLogout() {
    logout()
    router.push('/')
  }

  const homeActive = pathname === '/'
  const alertsActive = pathname.startsWith('/notifications')
  const meActive = pathname.startsWith('/my-profile')
  const loginActive = pathname.startsWith('/login')

  return (
    <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around border-t border-slate-800/60 bg-slate-950 px-1 pb-[env(safe-area-inset-bottom)] pt-1 sm:hidden">
      {/* Home — always visible */}
      <Link
        href="/"
        className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition ${
          homeActive ? 'text-cyan-400' : 'text-slate-400'
        }`}
      >
        <span className={`flex h-6 w-6 items-center justify-center rounded-xl transition ${homeActive ? 'bg-slate-800' : ''}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </span>
        <span>Home</span>
      </Link>

      {student ? (
        <>
          {/* Alerts */}
          <Link
            href="/notifications"
            className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition ${
              alertsActive ? 'text-cyan-400' : 'text-slate-400'
            }`}
          >
            <span className={`flex h-6 w-6 items-center justify-center rounded-xl transition ${alertsActive ? 'bg-slate-800' : ''}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </span>
            <span>Alerts</span>
          </Link>

          {/* Me */}
          <Link
            href="/my-profile"
            className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition ${
              meActive ? 'text-cyan-400' : 'text-slate-400'
            }`}
          >
            <span className={`flex h-6 w-6 items-center justify-center rounded-xl transition ${meActive ? 'bg-slate-800' : ''}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <span>Me</span>
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium text-rose-400 transition"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-xl">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </span>
            <span>Logout</span>
          </button>
        </>
      ) : (
        /* Login when not authenticated */
        <Link
          href="/login"
          className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition ${
            loginActive ? 'text-cyan-400' : 'text-slate-400'
          }`}
        >
          <span className={`flex h-6 w-6 items-center justify-center rounded-xl transition ${loginActive ? 'bg-slate-800' : ''}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </span>
          <span>Login</span>
        </Link>
      )}
    </nav>
  )
}


