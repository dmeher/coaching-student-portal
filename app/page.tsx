import Link from 'next/link'

export default function Home() {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="text-center py-14">
        <div className="w-20 h-20 mx-auto mb-6">
          <img src="/logo/logo.png" alt="Amlan Coaching Logo" className="w-full h-full object-contain rounded-2xl shadow-lg" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-3">AMLAN COACHING</h1>
        <p className="text-lg text-slate-500 max-w-md mx-auto">
          Welcome to the student &amp; parent portal. Browse the student directory and meet our teachers.
        </p>
      </section>

      {/* Quick links */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link
          href="/students"
          className="card hover:shadow-md hover:border-blue-200 transition-all group cursor-pointer block"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                Student Directory
              </h2>
              <p className="text-sm text-slate-500">Browse students by name, class, and gender</p>
            </div>
          </div>
        </Link>

        <Link
          href="/teachers"
          className="card hover:shadow-md hover:border-green-200 transition-all group cursor-pointer block"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center group-hover:bg-green-100 transition-colors">
              <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 group-hover:text-green-600 transition-colors">
                Our Teachers
              </h2>
              <p className="text-sm text-slate-500">Meet our coaching staff and their subjects</p>
            </div>
          </div>
        </Link>
      </section>

      {/* Info panel */}
      <section className="card bg-blue-50 border-blue-100">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-blue-900">Read-only access</p>
            <p className="text-sm text-blue-700 mt-0.5">
              This portal is for students and parents to view class details and teacher information.
              Fee records and contact numbers are not displayed here.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
