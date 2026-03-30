'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/authContext'

export default function Home() {
  const { student } = useAuth()

  return (
    <div className="space-y-4 sm:space-y-8">
      <section className="mobile-pane overflow-hidden px-4 py-4 sm:px-8 sm:py-10">
        <div className="absolute" />
        <div className="flex items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.28em] text-cyan-700">Student Portal</p>
            <h1 className="mt-1 sm:mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl">AMLAN COACHING</h1>
            <p className="mt-1 sm:mt-3 text-xs leading-5 text-slate-600 sm:text-base sm:leading-6 hidden sm:block">
              A simpler student portal designed to feel like an app on mobile. Check students, browse teachers, and review attendance without fighting the layout.
            </p>
          </div>

          <div className="flex h-16 w-16 sm:h-28 sm:w-28 shrink-0 items-center justify-center rounded-[22px] sm:rounded-[28px] bg-gradient-to-br from-cyan-500 to-blue-600 p-3 sm:p-4 shadow-[0_24px_50px_-24px_rgba(14,116,144,0.8)] sm:mx-0">
            <img src="/logo/logo.png" alt="Amlan Coaching Logo" className="h-full w-full rounded-[18px] object-contain bg-white/90 p-1.5" />
          </div>
        </div>

        <div className="mt-3 sm:mt-8 grid grid-cols-3 gap-2 sm:gap-3">
          <div className="mobile-stat p-2.5 sm:p-4">
            <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Access</p>
            <p className="mt-1 sm:mt-2 text-base sm:text-lg font-semibold text-slate-900">24/7</p>
          </div>
          <div className="mobile-stat p-2.5 sm:p-4">
            <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Views</p>
            <p className="mt-1 sm:mt-2 text-base sm:text-lg font-semibold text-slate-900">3</p>
          </div>
          <div className="mobile-stat p-2.5 sm:p-4">
            <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Mode</p>
            <p className="mt-1 sm:mt-2 text-base sm:text-lg font-semibold text-slate-900">Read only</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/students"
          className="card group block overflow-hidden border-cyan-100/70 bg-gradient-to-br from-cyan-50 via-white to-blue-50 p-4 sm:p-5 transition-all hover:-translate-y-0.5 hover:border-cyan-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-cyan-600 text-white shadow-lg shadow-cyan-200/70">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-cyan-700">Browse</span>
          </div>
          <h2 className="mt-3 sm:mt-4 text-sm sm:text-lg font-semibold text-slate-900">Students</h2>
          <p className="mt-1 sm:mt-2 text-xs sm:text-sm leading-5 sm:leading-6 text-slate-600">Search enrolled students by name, class, and gender.</p>
        </Link>

        <Link
          href="/teachers"
          className="card group block overflow-hidden border-emerald-100/70 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4 sm:p-5 transition-all hover:-translate-y-0.5 hover:border-emerald-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-200/70">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-emerald-700">Meet</span>
          </div>
          <h2 className="mt-3 sm:mt-4 text-sm sm:text-lg font-semibold text-slate-900">Teachers</h2>
          <p className="mt-1 sm:mt-2 text-xs sm:text-sm leading-5 sm:leading-6 text-slate-600">See subjects and profile details for the coaching staff.</p>
        </Link>

        <Link
          href="/attendance"
          className="card group block overflow-hidden border-violet-100/70 bg-gradient-to-br from-violet-50 via-white to-purple-50 p-4 sm:p-5 transition-all hover:-translate-y-0.5 hover:border-violet-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-200/70">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10m-11 9h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v11a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-violet-700">Track</span>
          </div>
          <h2 className="mt-3 sm:mt-4 text-sm sm:text-lg font-semibold text-slate-900">Attendance</h2>
          <p className="mt-1 sm:mt-2 text-xs sm:text-sm leading-5 sm:leading-6 text-slate-600">View your monthly attendance calendar and records.</p>
        </Link>

        <Link
          href="/holidays"
          className="card group block overflow-hidden border-rose-100/70 bg-gradient-to-br from-rose-50 via-white to-pink-50 p-4 sm:p-5 transition-all hover:-translate-y-0.5 hover:border-rose-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-rose-500 text-white shadow-lg shadow-rose-200/70">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-rose-600">Calendar</span>
          </div>
          <h2 className="mt-3 sm:mt-4 text-sm sm:text-lg font-semibold text-slate-900">Holidays</h2>
          <p className="mt-1 sm:mt-2 text-xs sm:text-sm leading-5 sm:leading-6 text-slate-600">Browse scheduled holidays and breaks for the coaching.</p>
        </Link>

        {student ? (
          <Link
            href="/my-profile"
            className="card group block overflow-hidden border-amber-100/70 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-4 sm:p-5 transition-all hover:-translate-y-0.5 hover:border-amber-200 sm:col-span-2 lg:col-span-1"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-200/70">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-amber-700">My Profile</span>
            </div>
            <h2 className="mt-3 sm:mt-4 text-sm sm:text-lg font-semibold text-slate-900">My Profile</h2>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm leading-5 sm:leading-6 text-slate-600">View your profile details and personal information.</p>
          </Link>
        ) : (
          <Link
            href="/login"
            className="card group block overflow-hidden border-amber-100/70 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-4 sm:p-5 transition-all hover:-translate-y-0.5 hover:border-amber-200 sm:col-span-2 lg:col-span-1"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-200/70">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </div>
              <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-amber-700">Login</span>
            </div>
            <h2 className="mt-3 sm:mt-4 text-sm sm:text-lg font-semibold text-slate-900">Login</h2>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm leading-5 sm:leading-6 text-slate-600">Login with your mobile number to access your profile and attendance.</p>
          </Link>
        )}
      </section>

    </div>
  )
}
