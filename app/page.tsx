'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/authContext'

export default function Home() {
  const { student } = useAuth()

  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="mobile-pane overflow-hidden px-5 py-6 sm:px-8 sm:py-10">
        <div className="absolute" />
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-lg">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-700">Mobile-ready portal</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">AMLAN COACHING</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
              A simpler student portal designed to feel like an app on mobile. Check students, browse teachers, and review attendance without fighting the layout.
            </p>
          </div>

          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[28px] bg-gradient-to-br from-cyan-500 to-blue-600 p-4 shadow-[0_24px_50px_-24px_rgba(14,116,144,0.8)] sm:mx-0 sm:h-28 sm:w-28">
            <img src="/logo/logo.png" alt="Amlan Coaching Logo" className="h-full w-full rounded-[22px] object-contain bg-white/90 p-2" />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3 sm:mt-8">
          <div className="mobile-stat p-3 sm:p-4">
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Access</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">24/7</p>
          </div>
          <div className="mobile-stat p-3 sm:p-4">
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Views</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">3</p>
          </div>
          <div className="mobile-stat p-3 sm:p-4">
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Mode</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">Read only</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/students"
          className="card group block overflow-hidden border-cyan-100/70 bg-gradient-to-br from-cyan-50 via-white to-blue-50 p-5 transition-all hover:-translate-y-0.5 hover:border-cyan-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-600 text-white shadow-lg shadow-cyan-200/70">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-cyan-700">Browse</span>
          </div>
          <h2 className="mt-4 text-lg font-semibold text-slate-900">Students</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Search enrolled students by name, class, and gender with mobile-first cards.</p>
        </Link>

        <Link
          href="/teachers"
          className="card group block overflow-hidden border-emerald-100/70 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-5 transition-all hover:-translate-y-0.5 hover:border-emerald-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-200/70">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-emerald-700">Meet</span>
          </div>
          <h2 className="mt-4 text-lg font-semibold text-slate-900">Teachers</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">See subjects, profile details, and a cleaner card layout that scales well on phones.</p>
        </Link>

        {student ? (
          <Link
            href="/my-profile"
            className="card group block overflow-hidden border-amber-100/70 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-5 transition-all hover:-translate-y-0.5 hover:border-amber-200 sm:col-span-2 lg:col-span-1"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-200/70">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10m-11 9h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v11a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-amber-700">My Record</span>
            </div>
            <h2 className="mt-4 text-lg font-semibold text-slate-900">My Attendance</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">View your personal attendance record and monthly summary.</p>
          </Link>
        ) : (
          <Link
            href="/login"
            className="card group block overflow-hidden border-amber-100/70 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-5 transition-all hover:-translate-y-0.5 hover:border-amber-200 sm:col-span-2 lg:col-span-1"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-200/70">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </div>
              <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-amber-700">Login</span>
            </div>
            <h2 className="mt-4 text-lg font-semibold text-slate-900">My Attendance</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Login with your mobile number to view your personal attendance record.</p>
          </Link>
        )}
      </section>

    </div>
  )
}
