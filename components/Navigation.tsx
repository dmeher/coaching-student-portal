'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const links = [
  {
    href: '/',
    label: 'Home',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: '/students',
    label: 'Students',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    href: '/teachers',
    label: 'Teachers',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    ),
  },
  {
    href: '/attendance',
    label: 'Attendance',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10m-11 9h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v11a2 2 0 002 2z" />
      </svg>
    ),
  },
]

export default function Navigation() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const currentPath = mounted ? pathname : ''
  const currentSection = links.find((link) => (link.href === '/' ? currentPath === '/' : currentPath.startsWith(link.href)))

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/70 bg-white/80 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <Image src="/logo/logo.png" alt="Amlan Coaching" width={38} height={38} className="rounded-2xl ring-1 ring-slate-200/70" priority />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-[0.18em] text-cyan-700">AMLAN COACHING</p>
              <p className="truncate text-xs text-slate-500">{currentSection?.label || 'Student Portal'}</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 sm:flex">
            {links.map((link) => {
              const active = link.href === '/' ? currentPath === '/' : currentPath.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 rounded-2xl px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-cyan-50 text-cyan-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </header>

      <nav className="fixed bottom-3 left-1/2 z-50 flex w-[calc(100%-24px)] max-w-sm -translate-x-1/2 items-center justify-between rounded-[28px] border border-white/70 bg-slate-950/90 px-2 py-2 shadow-[0_24px_60px_-22px_rgba(2,6,23,0.8)] backdrop-blur-xl sm:hidden">
        {links.map((link) => {
          const active = link.href === '/' ? currentPath === '/' : currentPath.startsWith(link.href)
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex min-w-[68px] flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2 text-[11px] font-medium transition ${
                active
                  ? 'bg-white text-slate-950 shadow-sm'
                  : 'text-slate-300'
              }`}
            >
              <span className="flex h-5 items-center">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
