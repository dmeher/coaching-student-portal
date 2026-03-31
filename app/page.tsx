'use client'

import Link from 'next/link'

export default function Home() {

  return (
    <div className="space-y-3 sm:space-y-5">
      <section className="mobile-pane overflow-hidden px-4 py-4 sm:px-6 sm:py-6">
        <div className="absolute" />
        <div className="flex items-center gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.28em] text-cyan-700">Student Portal</p>
            <h1 className="mt-1 sm:mt-2 text-xl font-bold tracking-tight text-slate-900 sm:text-3xl">AMLAN COACHING</h1>
            <p className="mt-1.5 sm:mt-2 max-w-2xl text-[11px] leading-5 text-slate-600 sm:text-sm sm:leading-6">
              Quick access to students, teachers, holidays, timetable, and awards in a compact dashboard.
            </p>
            <div className="mt-2.5 flex flex-wrap gap-1.5 sm:mt-3">
              <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-[10px] font-medium text-cyan-700 sm:text-[11px]">Students</span>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-medium text-emerald-700 sm:text-[11px]">Teachers</span>
              <span className="rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-medium text-rose-600 sm:text-[11px]">Holidays</span>
              <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-medium text-violet-700 sm:text-[11px]">Timetable</span>
              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-medium text-amber-700 sm:text-[11px]">Awards</span>
            </div>
          </div>

          <div className="flex h-14 w-14 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-[20px] sm:rounded-[24px] bg-gradient-to-br from-cyan-500 to-blue-600 p-2.5 sm:p-3 shadow-[0_18px_40px_-26px_rgba(14,116,144,0.8)] sm:mx-0">
            <img src="/logo/logo.png" alt="Amlan Coaching Logo" className="h-full w-full rounded-[14px] object-contain bg-white/90 p-1.5" />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5">
        <Link
          href="/students"
          className="group block overflow-hidden rounded-2xl border border-cyan-100/80 bg-white/95 p-3 shadow-[0_10px_24px_-18px_rgba(14,116,144,0.45)] transition-all hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-[0_18px_34px_-22px_rgba(14,116,144,0.35)]"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700 ring-1 ring-cyan-100">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">Open</span>
          </div>
          <h2 className="mt-3 text-sm sm:text-[15px] font-semibold text-slate-900">Students</h2>
          <p className="mt-1 text-[11px] leading-5 text-slate-500">Directory and filters</p>
        </Link>

        <Link
          href="/teachers"
          className="group block overflow-hidden rounded-2xl border border-emerald-100/80 bg-white/95 p-3 shadow-[0_10px_24px_-18px_rgba(5,150,105,0.35)] transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_18px_34px_-22px_rgba(5,150,105,0.3)]"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">Open</span>
          </div>
          <h2 className="mt-3 text-sm sm:text-[15px] font-semibold text-slate-900">Teachers</h2>
          <p className="mt-1 text-[11px] leading-5 text-slate-500">Profiles and subjects</p>
        </Link>

        <Link
          href="/holidays"
          className="group block overflow-hidden rounded-2xl border border-rose-100/80 bg-white/95 p-3 shadow-[0_10px_24px_-18px_rgba(244,63,94,0.3)] transition-all hover:-translate-y-0.5 hover:border-rose-200 hover:shadow-[0_18px_34px_-22px_rgba(244,63,94,0.28)]"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 ring-1 ring-rose-100">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">Open</span>
          </div>
          <h2 className="mt-3 text-sm sm:text-[15px] font-semibold text-slate-900">Holidays</h2>
          <p className="mt-1 text-[11px] leading-5 text-slate-500">Dates and notices</p>
        </Link>

        <Link
          href="/timetable"
          className="group block overflow-hidden rounded-2xl border border-violet-100/80 bg-white/95 p-3 shadow-[0_10px_24px_-18px_rgba(124,58,237,0.28)] transition-all hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-[0_18px_34px_-22px_rgba(124,58,237,0.24)]"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700 ring-1 ring-violet-100">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">Open</span>
          </div>
          <h2 className="mt-3 text-sm sm:text-[15px] font-semibold text-slate-900">Timetable</h2>
          <p className="mt-1 text-[11px] leading-5 text-slate-500">Weekly schedule</p>
        </Link>

        <Link
          href="/recognition"
          className="group block overflow-hidden rounded-2xl border border-amber-100/80 bg-white/95 p-3 shadow-[0_10px_24px_-18px_rgba(245,158,11,0.32)] transition-all hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-[0_18px_34px_-22px_rgba(245,158,11,0.26)]"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700 ring-1 ring-amber-100">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.959a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.367 2.447a1 1 0 00-.364 1.118l1.287 3.959c.3.921-.755 1.688-1.538 1.118l-3.367-2.447a1 1 0 00-1.176 0l-3.367 2.447c-.783.57-1.838-.197-1.539-1.118l1.287-3.959a1 1 0 00-.363-1.118L2.98 9.386c-.783-.57-.38-1.81.588-1.81H7.73a1 1 0 00.951-.69l1.368-3.959z" />
              </svg>
            </div>
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">Open</span>
          </div>
          <h2 className="mt-3 text-sm sm:text-[15px] font-semibold text-slate-900">Recognition</h2>
          <p className="mt-1 text-[11px] leading-5 text-slate-500">Awards board</p>
        </Link>
      </section>

    </div>
  )
}
