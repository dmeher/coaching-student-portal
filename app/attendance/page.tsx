'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { StudentAttendanceSummary } from '@/lib/types'

function attendanceBadgeClass(percentage: number | null) {
  if (percentage === null) return 'badge bg-slate-100 text-slate-600'
  if (percentage >= 90) return 'badge bg-green-100 text-green-800'
  if (percentage >= 75) return 'badge bg-amber-100 text-amber-800'
  return 'badge bg-rose-100 text-rose-800'
}

function statusBadge(status: 'present' | 'absent' | 'unknown') {
  if (status === 'present') return 'bg-green-100 text-green-800 border-green-200'
  if (status === 'absent') return 'bg-rose-100 text-rose-800 border-rose-200'
  return 'bg-slate-100 text-slate-600 border-slate-200'
}

function getCurrentMonthValue() {
  const currentDate = new Date()
  return `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`
}

export default function AttendancePage() {
  const [students, setStudents] = useState<StudentAttendanceSummary[]>([])
  const [classes, setClasses] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [classFilter, setClassFilter] = useState('')
  const [month, setMonth] = useState('')

  useEffect(() => {
    setMonth((currentMonth) => currentMonth || getCurrentMonthValue())
  }, [])

  const fetchAttendance = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (classFilter) params.set('class', classFilter)
      if (month) params.set('month', month)

      const res = await fetch(`/api/attendance?${params.toString()}`)
      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Failed to load attendance data.')
        setStudents([])
      } else {
        setStudents(data.students || [])
      }
    } catch {
      setError('Network error while loading attendance.')
      setStudents([])
    } finally {
      setLoading(false)
    }
  }, [search, classFilter, month])

  useEffect(() => {
    fetch('/api/classes')
      .then((r) => r.json())
      .then((d) => setClasses(d.classes || []))
      .catch(() => setClasses([]))
  }, [])

  useEffect(() => {
    if (!month) return

    const timer = setTimeout(fetchAttendance, 250)
    return () => clearTimeout(timer)
  }, [fetchAttendance])

  const overall = useMemo(() => {
    const totalPresent = students.reduce((sum, s) => sum + s.attendance.present, 0)
    const totalMarked = students.reduce((sum, s) => sum + s.attendance.total, 0)
    const percent = totalMarked > 0 ? Math.round((totalPresent / totalMarked) * 100) : null
    return { totalPresent, totalMarked, percent }
  }, [students])

  const monthDates = useMemo(() => {
    if (!month) return [] as string[]
    const [y, m] = month.split('-').map(Number)
    if (!y || !m) return [] as string[]

    const daysInMonth = new Date(y, m, 0).getDate()
    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = String(i + 1).padStart(2, '0')
      return `${month}-${day}`
    })
  }, [month])

  const dailyMapByStudent = useMemo(() => {
    const map = new Map<string, Map<string, 'present' | 'absent' | 'unknown'>>()
    for (const s of students) {
      const perDay = new Map<string, 'present' | 'absent' | 'unknown'>()
      for (const d of s.daily || []) {
        perDay.set(d.date, d.status)
      }
      map.set(s.id, perDay)
    }
    return map
  }, [students])

  const dateLabel = (date: string) => {
    const d = new Date(`${date}T00:00:00`)
    return d.getDate()
  }

  const shortDateLabel = (date: string) => {
    const d = new Date(`${date}T00:00:00`)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Student Attendance</h1>
          <p className="mt-1 text-sm text-slate-500">Daily attendance view with mobile cards and desktop month grid</p>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          Daily records
        </div>
      </div>

      <div className="mobile-pane p-4 sm:p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          <div className="relative sm:col-span-2">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search student by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="touch-field w-full pl-9 pr-3"
            />
          </div>

          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="touch-field w-full"
          >
            <option value="">All Classes</option>
            {classes.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="touch-field w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="mobile-stat">
          <p className="text-xs uppercase tracking-wide text-slate-400">Students</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{students.length}</p>
        </div>
        <div className="mobile-stat">
          <p className="text-xs uppercase tracking-wide text-slate-400">Marked Entries</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{overall.totalMarked}</p>
        </div>
        <div className="mobile-stat">
          <p className="text-xs uppercase tracking-wide text-slate-400">Overall Presence</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{overall.percent === null ? 'N/A' : `${overall.percent}%`}</p>
        </div>
      </div>

      {error && (
        <div className="card border-rose-200 bg-rose-50 text-rose-800">
          <p className="font-medium">Could not load attendance</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card animate-pulse h-24" />
          ))}
        </div>
      ) : students.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <p className="font-medium">No attendance records found</p>
          <p className="text-sm mt-1">Try changing month or filters</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-4 sm:hidden">
            {students.map((student) => {
              const perDay = dailyMapByStudent.get(student.id) || new Map<string, 'present' | 'absent' | 'unknown'>()
              return (
                <div key={student.id} className="card border-amber-100/70 bg-gradient-to-br from-white via-white to-amber-50/60 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">{student.name}</h3>
                      <p className="mt-1 text-sm text-slate-500">{student.class_name}</p>
                    </div>
                    <span className={attendanceBadgeClass(student.attendance.percentage)}>
                      {student.attendance.percentage === null ? 'N/A' : `${student.attendance.percentage}%`}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-2xl bg-green-50 p-3">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-green-700">Present</p>
                      <p className="mt-1 text-lg font-semibold text-green-800">{student.attendance.present}</p>
                    </div>
                    <div className="rounded-2xl bg-rose-50 p-3">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-rose-700">Absent</p>
                      <p className="mt-1 text-lg font-semibold text-rose-800">{student.attendance.absent}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-100 p-3">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-600">Total</p>
                      <p className="mt-1 text-lg font-semibold text-slate-800">{student.attendance.total}</p>
                    </div>
                  </div>

                  <div className="mt-4 overflow-x-auto pb-1">
                    <div className="flex min-w-max gap-2">
                      {monthDates.map((d) => {
                        const status = perDay.get(d) || 'unknown'
                        return (
                          <div key={`${student.id}-${d}`} className={`flex w-16 shrink-0 flex-col items-center rounded-2xl border px-2 py-2 ${statusBadge(status)}`}>
                            <span className="text-[11px] font-medium">{shortDateLabel(d)}</span>
                            <span className="mt-1 text-sm font-semibold">{status === 'present' ? 'P' : status === 'absent' ? 'A' : '-'}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="hidden sm:block">
            <div className="card overflow-x-auto">
            <table className="min-w-full text-sm border-separate border-spacing-0">
              <thead>
                <tr>
                  <th className="sticky left-0 bg-white text-left px-3 py-2 border-b border-slate-200 font-semibold">Student</th>
                  <th className="sticky left-[160px] bg-white text-left px-3 py-2 border-b border-slate-200 font-semibold">Class</th>
                  {monthDates.map((d) => (
                    <th key={d} className="px-2 py-2 border-b border-slate-200 text-center font-semibold text-slate-600 min-w-[42px]">
                      {dateLabel(d)}
                    </th>
                  ))}
                  <th className="px-3 py-2 border-b border-slate-200 text-center font-semibold">%</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const perDay = dailyMapByStudent.get(student.id) || new Map<string, 'present' | 'absent' | 'unknown'>()
                  return (
                    <tr key={student.id}>
                      <td className="sticky left-0 bg-white px-3 py-2 border-b border-slate-100 font-medium text-slate-800 whitespace-nowrap">{student.name}</td>
                      <td className="sticky left-[160px] bg-white px-3 py-2 border-b border-slate-100 text-slate-500 whitespace-nowrap">{student.class_name}</td>
                      {monthDates.map((d) => {
                        const status = perDay.get(d) || 'unknown'
                        return (
                          <td key={`${student.id}-${d}`} className="px-1 py-2 border-b border-slate-100 text-center">
                            <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full border text-xs font-semibold ${statusBadge(status)}`}>
                              {status === 'present' ? 'P' : status === 'absent' ? 'A' : '-'}
                            </span>
                          </td>
                        )
                      })}
                      <td className="px-3 py-2 border-b border-slate-100 text-center">
                        <span className={attendanceBadgeClass(student.attendance.percentage)}>
                          {student.attendance.percentage === null ? 'N/A' : `${student.attendance.percentage}%`}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full bg-green-100 border border-green-200" /> Present</span>
            <span className="inline-flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full bg-rose-100 border border-rose-200" /> Absent</span>
            <span className="inline-flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full bg-slate-100 border border-slate-200" /> Not marked</span>
          </div>
        </div>
      )}
    </div>
  )
}
