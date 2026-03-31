'use client'

import Link from 'next/link'

export default function Home() {

  return (
    <div className="space-y-4 sm:space-y-8">
      <section className="mobile-pane overflow-hidden px-4 py-4 sm:px-8 sm:py-10">
        <div className="absolute" />
        <div className="flex items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.28em] text-cyan-700">Student Portal</p>
            <h1 className="mt-1 sm:mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl">AMLAN COACHING</h1>
            <p className="mt-2 sm:mt-3 max-w-2xl text-xs leading-5 text-slate-600 sm:text-base sm:leading-7">
              One place for students and parents to check class essentials quickly. Browse student and teacher details, view holiday updates, and open the weekly timetable with a layout that stays clear on both desktop and mobile.
            </p>
            <div className="mt-3 flex flex-wrap gap-2 sm:mt-4">
              <span className="rounded-full bg-cyan-50 px-3 py-1 text-[11px] font-medium text-cyan-700 sm:text-xs">Student directory</span>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700 sm:text-xs">Teacher profiles</span>
              <span className="rounded-full bg-rose-50 px-3 py-1 text-[11px] font-medium text-rose-600 sm:text-xs">Holiday updates</span>
              <span className="rounded-full bg-violet-50 px-3 py-1 text-[11px] font-medium text-violet-700 sm:text-xs">Weekly timetable</span>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-medium text-amber-700 sm:text-xs">Student awards</span>
            </div>
          </div>

          <div className="flex h-16 w-16 sm:h-28 sm:w-28 shrink-0 items-center justify-center rounded-[22px] sm:rounded-[28px] bg-gradient-to-br from-cyan-500 to-blue-600 p-3 sm:p-4 shadow-[0_24px_50px_-24px_rgba(14,116,144,0.8)] sm:mx-0">
            <img src="/logo/logo.png" alt="Amlan Coaching Logo" className="h-full w-full rounded-[18px] object-contain bg-white/90 p-1.5" />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        <Link
          href="/students"
          className="card group block overflow-hidden border-cyan-100/70 bg-gradient-to-br from-cyan-50 via-white to-blue-50 p-3 sm:p-5 transition-all hover:-translate-y-0.5 hover:border-cyan-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-cyan-600 text-white shadow-lg shadow-cyan-200/70">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-medium text-cyan-700 sm:px-3 sm:text-xs">Browse</span>
          </div>
          <h2 className="mt-3 sm:mt-4 text-sm sm:text-lg font-semibold text-slate-900">Students</h2>
          <p className="mt-1 sm:mt-2 text-[11px] sm:text-sm leading-5 sm:leading-6 text-slate-600">Search enrolled students by name, class, and gender.</p>
        </Link>

        <Link
          href="/teachers"
          className="card group block overflow-hidden border-emerald-100/70 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-3 sm:p-5 transition-all hover:-translate-y-0.5 hover:border-emerald-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-200/70">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <span className="rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-medium text-emerald-700 sm:px-3 sm:text-xs">Meet</span>
          </div>
          <h2 className="mt-3 sm:mt-4 text-sm sm:text-lg font-semibold text-slate-900">Teachers</h2>
          <p className="mt-1 sm:mt-2 text-[11px] sm:text-sm leading-5 sm:leading-6 text-slate-600">See subjects and profile details for the coaching staff.</p>
        </Link>

        <Link
          href="/holidays"
          className="card group block overflow-hidden border-rose-100/70 bg-gradient-to-br from-rose-50 via-white to-pink-50 p-3 sm:p-5 transition-all hover:-translate-y-0.5 hover:border-rose-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-rose-500 text-white shadow-lg shadow-rose-200/70">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <span className="rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-medium text-rose-600 sm:px-3 sm:text-xs">Calendar</span>
          </div>
          <h2 className="mt-3 sm:mt-4 text-sm sm:text-lg font-semibold text-slate-900">Holidays</h2>
          <p className="mt-1 sm:mt-2 text-[11px] sm:text-sm leading-5 sm:leading-6 text-slate-600">Browse scheduled holidays and breaks for the coaching.</p>
        </Link>

        <Link
          href="/timetable"
          className="card group block overflow-hidden border-violet-100/70 bg-gradient-to-br from-violet-50 via-white to-indigo-50 p-3 sm:p-5 transition-all hover:-translate-y-0.5 hover:border-violet-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-200/70">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-medium text-violet-700 sm:px-3 sm:text-xs">Schedule</span>
          </div>
          <h2 className="mt-3 sm:mt-4 text-sm sm:text-lg font-semibold text-slate-900">Timetable</h2>
          <p className="mt-1 sm:mt-2 text-[11px] sm:text-sm leading-5 sm:leading-6 text-slate-600">View your class weekly schedule for morning and evening sessions.</p>
        </Link>

        <Link
          href="/recognition"
          className="card group block overflow-hidden border-amber-100/70 bg-gradient-to-br from-amber-50 via-white to-yellow-50 p-3 sm:p-5 transition-all hover:-translate-y-0.5 hover:border-amber-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-200/70">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.959a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.367 2.447a1 1 0 00-.364 1.118l1.287 3.959c.3.921-.755 1.688-1.538 1.118l-3.367-2.447a1 1 0 00-1.176 0l-3.367 2.447c-.783.57-1.838-.197-1.539-1.118l1.287-3.959a1 1 0 00-.363-1.118L2.98 9.386c-.783-.57-.38-1.81.588-1.81H7.73a1 1 0 00.951-.69l1.368-3.959z" />
              </svg>
            </div>
            <span className="rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-medium text-amber-700 sm:px-3 sm:text-xs">Awards</span>
          </div>
          <h2 className="mt-3 sm:mt-4 text-sm sm:text-lg font-semibold text-slate-900">Recognition</h2>
          <p className="mt-1 sm:mt-2 text-[11px] sm:text-sm leading-5 sm:leading-6 text-slate-600">See monthly student awards and recognitions across the coaching.</p>
        </Link>
      </section>

    </div>
  )
}
