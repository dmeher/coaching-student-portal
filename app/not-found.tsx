import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="mobile-pane px-6 py-10 text-center sm:px-8 sm:py-14">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-700">404</p>
      <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        Page not found
      </h1>
      <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
        The page you requested does not exist in the student portal.
      </p>
      <div className="mt-6">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cyan-700"
        >
          Return home
        </Link>
      </div>
    </div>
  )
}