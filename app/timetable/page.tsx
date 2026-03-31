'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/authContext'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const SESSIONS: { key: string; label: string }[] = [
  { key: 'morning', label: 'Morning' },
  { key: 'evening', label: 'Evening' },
]

const SUBJECT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Math:             { bg: 'bg-blue-100',    text: 'text-blue-800',    border: 'border-blue-200'    },
  English:          { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-200' },
  Hindi:            { bg: 'bg-orange-100',  text: 'text-orange-800',  border: 'border-orange-200'  },
  Odia:             { bg: 'bg-yellow-100',  text: 'text-yellow-800',  border: 'border-yellow-200'  },
  Science:          { bg: 'bg-purple-100',  text: 'text-purple-800',  border: 'border-purple-200'  },
  'S.Sc':           { bg: 'bg-rose-100',    text: 'text-rose-800',    border: 'border-rose-200'    },
  Holiday:          { bg: 'bg-slate-100',   text: 'text-slate-500',   border: 'border-slate-200'   },
  'Doubt Clearing': { bg: 'bg-cyan-100',    text: 'text-cyan-800',    border: 'border-cyan-200'    },
  Free:             { bg: 'bg-green-100',   text: 'text-green-800',   border: 'border-green-200'   },
}

function SubjectBadge({ subject }: { subject: string }) {
  const colors = SUBJECT_COLORS[subject] ?? { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' }
  return (
    <span className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-semibold ${colors.bg} ${colors.text} ${colors.border}`}>
      {subject}
    </span>
  )
}

type DaySchedule = Record<string, Record<string, string>>

export default function TimetablePage() {
  const router = useRouter()
  const { student, isInitialized } = useAuth()
  const [timetable, setTimetable] = useState<DaySchedule | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isInitialized) return // wait for localStorage to load

    if (!student) {
      router.replace('/login')
      return
    }

    const params = new URLSearchParams({
      teacher_id: student.teacher_id ?? '',
      class_name: student.class_name,
    })

    fetch(`/api/timetable?${params}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.timetable) {
          setTimetable(data.timetable)
        } else {
          setError('Could not load timetable.')
        }
      })
      .catch(() => setError('Could not load timetable.'))
      .finally(() => setLoading(false))
  }, [student, isInitialized, router])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-300 border-t-cyan-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-slate-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <section className="mobile-pane overflow-hidden px-4 py-4 sm:px-6 sm:py-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-700">
              Your Schedule
            </p>
            <h1 className="mt-2 text-xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Class {student?.class_name} Timetable
            </h1>
            <p className="mt-2 max-w-xl text-xs leading-6 text-slate-500 sm:text-sm">
              Weekly schedule — morning &amp; evening sessions
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:w-[320px]">
            <div className="rounded-2xl border border-cyan-100 bg-cyan-50/80 px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-700">Sessions</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">2</p>
              <p className="text-xs text-slate-500">Morning and evening</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">Coverage</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">7</p>
              <p className="text-xs text-slate-500">Days in view</p>
            </div>
          </div>
        </div>
      </section>

      {/* Timetable grid */}
      <section className="card overflow-hidden p-0">
        {/* Desktop: full table */}
        <div className="hidden sm:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 w-32">
                  Day
                </th>
                {SESSIONS.map((s) => (
                  <th key={s.key} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {s.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DAYS.map((day, idx) => (
                <tr key={day} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                  <td className="px-4 py-3 font-medium text-slate-700 w-32">{day}</td>
                  {SESSIONS.map((s) => (
                    <td key={s.key} className="px-4 py-3">
                      <SubjectBadge subject={(timetable?.[day] as Record<string, string> | undefined)?.[s.key] ?? '—'} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile: card per day */}
        <div className="sm:hidden divide-y divide-slate-100">
          {DAYS.map((day) => (
            <div key={day} className="px-4 py-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">{day}</p>
              <div className="flex flex-wrap gap-2">
                {SESSIONS.map((s) => (
                  <div key={s.key} className="flex items-center gap-1.5">
                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider w-14">{s.label}</span>
                    <SubjectBadge subject={(timetable?.[day] as Record<string, string> | undefined)?.[s.key] ?? '—'} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Legend */}
      <section className="card px-4 py-4 sm:px-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Subject Legend</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(SUBJECT_COLORS).map(([subject, colors]) => (
            <span
              key={subject}
              className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-semibold ${colors.bg} ${colors.text} ${colors.border}`}
            >
              {subject}
            </span>
          ))}
        </div>
      </section>
    </div>
  )
}
