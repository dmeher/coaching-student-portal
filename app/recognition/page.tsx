'use client'

import { useEffect, useMemo, useState } from 'react'
import type { StudentAwardPublic } from '@/lib/types'

function getCurrentMonthValue() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function formatMonthLabel(monthKey: string) {
  const [year, month] = monthKey.split('-').map(Number)
  return new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(new Date(year, month - 1, 1))
}

export default function RecognitionPage() {
  const [month, setMonth] = useState(getCurrentMonthValue)
  const [awards, setAwards] = useState<StudentAwardPublic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function fetchAwards() {
      setLoading(true)
      setError('')

      try {
        const params = new URLSearchParams({ month })
        const res = await fetch(`/api/student-awards?${params.toString()}`)
        const data = await res.json()

        if (cancelled) {
          return
        }

        if (!res.ok) {
          setError(data.message || 'Failed to load awards.')
          setAwards([])
          return
        }

        setAwards(data.awards || [])
      } catch {
        if (!cancelled) {
          setError('Network error while loading awards.')
          setAwards([])
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchAwards()
    return () => {
      cancelled = true
    }
  }, [month])

  const groupedAwards = useMemo(() => {
    const groups = new Map<string, StudentAwardPublic[]>()

    for (const award of awards) {
      const current = groups.get(award.class_name) || []
      current.push(award)
      groups.set(award.class_name, current)
    }

    return Array.from(groups.entries()).sort((a, b) => a[0].localeCompare(b[0]))
  }, [awards])

  return (
    <div className="space-y-4 sm:space-y-6">
      <section className="mobile-pane overflow-hidden px-4 py-4 sm:px-8 sm:py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.28em] text-amber-700">Recognition Board</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl">Student Awards</h1>
            <p className="mt-2 max-w-2xl text-xs leading-5 text-slate-600 sm:text-base sm:leading-7">
              Browse monthly awards and recognitions shared across the coaching. This board is visible to everyone in the portal.
            </p>
          </div>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
          />
        </div>
      </section>

      {loading && (
        <div className="flex items-center justify-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-200 border-t-amber-500" />
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {!loading && !error && awards.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
          No awards were recorded for {formatMonthLabel(month)}.
        </div>
      )}

      {!loading && !error && groupedAwards.length > 0 && (
        <div className="space-y-4">
          {groupedAwards.map(([className, classAwards]) => (
            <section key={className} className="card border-amber-100/70 bg-gradient-to-br from-white via-white to-amber-50/50 p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-amber-700">{formatMonthLabel(month)}</p>
                  <h2 className="mt-1 text-base font-bold text-slate-900 sm:text-lg">{className}</h2>
                </div>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                  {classAwards.length} award{classAwards.length === 1 ? '' : 's'}
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {classAwards.map((award) => (
                  <article key={award.id} className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 px-4 py-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-200/70">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.959a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.367 2.447a1 1 0 00-.364 1.118l1.287 3.959c.3.921-.755 1.688-1.538 1.118l-3.367-2.447a1 1 0 00-1.176 0l-3.367 2.447c-.783.57-1.838-.197-1.539-1.118l1.287-3.959a1 1 0 00-.363-1.118L2.98 9.386c-.783-.57-.38-1.81.588-1.81H7.73a1 1 0 00.951-.69l1.368-3.959z" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-900">{award.award_title}</p>
                        <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-amber-700">{award.skill_category}</p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-1.5">
                      <p className="text-sm font-semibold text-slate-800">{award.student_name}</p>
                      <p className="text-xs text-slate-500">{award.class_name}</p>
                      {award.remarks && <p className="pt-1 text-xs leading-5 text-slate-600">{award.remarks}</p>}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}