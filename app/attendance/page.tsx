'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/lib/authContext'
import type { StudentAttendanceSummary } from '@/lib/types'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getCurrentMonthKey() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function shiftMonth(monthKey: string, offset: number) {
  const [y, m] = monthKey.split('-').map(Number)
  const d = new Date(y, m - 1 + offset, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function getMonthLabel(monthKey: string) {
  const [y, m] = monthKey.split('-').map(Number)
  return new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(new Date(y, m - 1, 1))
}

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

export default function AttendancePage() {
  const { student } = useAuth()

  if (!student) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-2">
        <div className="card w-full max-w-sm border-amber-100/70 bg-gradient-to-br from-white via-white to-amber-50/60 p-6 text-center sm:p-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[22px] bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-200/60">
            <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10m-11 9h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v11a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-slate-900">View Your Attendance</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Login with your registered mobile number to view your personal attendance calendar and records.
          </p>
          <Link
            href="/login"
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-200/60 transition hover:opacity-90"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Login to Continue
          </Link>
        </div>
      </div>
    )
  }

  return <StudentAttendanceCalendar studentId={student.id} studentName={student.name} />
}

function StudentAttendanceCalendar({ studentId, studentName }: { studentId: string; studentName: string }) {
  const [visibleMonth, setVisibleMonth] = useState(getCurrentMonthKey)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [attendanceData, setAttendanceData] = useState<StudentAttendanceSummary | null>(null)
  const [allTimeStats, setAllTimeStats] = useState({ present: 0, absent: 0, total: 0 })
  const [loaded, setLoaded] = useState(false)

  const fetchMonth = useCallback(async (month: string) => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams({ student_id: studentId, month })
      const res = await fetch(`/api/attendance?${params.toString()}`)
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || 'Failed to load attendance.')
        setAttendanceData(null)
      } else {
        const found: StudentAttendanceSummary | undefined = (data.students || []).find(
          (s: StudentAttendanceSummary) => s.id === studentId
        )
        setAttendanceData(found || null)
        // build overall stats on first load by summing future months not needed â€”
        // use the fetched month stats to accumulate, but since we only have one month per call,
        // store cumulative across calls
        if (found) {
          setAllTimeStats((prev) => ({
            present: prev.present + found.attendance.present,
            absent: prev.absent + found.attendance.absent,
            total: prev.total + found.attendance.total,
          }))
        }
      }
    } catch {
      setError('Network error while loading attendance.')
    } finally {
      setLoading(false)
    }
  }, [studentId])

  // On first load: fetch current month for overall stats
  const fetchOverallStats = useCallback(async () => {
    if (loaded) return
    setLoaded(true)
    // Fetch last 3 months to get overall stats
    const months = [0, -1, -2, -3, -4, -5].map((offset) => shiftMonth(getCurrentMonthKey(), offset))
    let present = 0, absent = 0, total = 0
    await Promise.all(months.map(async (m) => {
      try {
        const params = new URLSearchParams({ student_id: studentId, month: m })
        const res = await fetch(`/api/attendance?${params.toString()}`)
        const data = await res.json()
        const found: StudentAttendanceSummary | undefined = (data.students || []).find(
          (s: StudentAttendanceSummary) => s.id === studentId
        )
        if (found) {
          present += found.attendance.present
          absent += found.attendance.absent
          total += found.attendance.total
        }
      } catch { }
    }))
    setAllTimeStats({ present, absent, total })
  }, [studentId, loaded])

  useEffect(() => {
    fetchOverallStats()
  }, [fetchOverallStats])

  useEffect(() => {
    fetchMonth(visibleMonth)
  }, [fetchMonth, visibleMonth])

  const todayDate = new Date().toISOString().slice(0, 10)
  const todayMonthKey = getCurrentMonthKey()

  const dailyMap = useMemo(() => {
    const map = new Map<string, 'present' | 'absent' | 'unknown'>()
    for (const d of attendanceData?.daily || []) {
      map.set(d.date, d.status)
    }
    return map
  }, [attendanceData])

  // Build calendar cells
  const calendarCells = useMemo(() => {
    const [y, m] = visibleMonth.split('-').map(Number)
    const daysInMonth = new Date(y, m, 0).getDate()
    const firstDow = new Date(y, m - 1, 1).getDay()
    const cells: { key: string; date?: string; day?: number }[] = []
    for (let i = 0; i < firstDow; i++) cells.push({ key: `e-s-${i}` })
    for (let d = 1; d <= daysInMonth; d++) {
      const date = `${visibleMonth}-${String(d).padStart(2, '0')}`
      cells.push({ key: date, date, day: d })
    }
    const trailing = (7 - (cells.length % 7)) % 7
    for (let i = 0; i < trailing; i++) cells.push({ key: `e-t-${i}` })
    return cells
  }, [visibleMonth])

  const monthAgg = attendanceData?.attendance
  const visibleMonthPresent = monthAgg?.present ?? 0
  const visibleMonthAbsent = monthAgg?.absent ?? 0
  const visibleMonthTotal = monthAgg?.total ?? 0
  const visibleMonthPct = monthAgg?.percentage ?? null

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">My Attendance</h1>
        <p className="mt-0.5 text-xs sm:text-sm text-slate-500">Personal attendance calendar for {studentName}</p>
      </div>

      {/* Overall stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-[22px] border bg-emerald-50 p-4 shadow-sm" style={{ borderColor: 'rgba(167,243,208,0.7)' }}>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-emerald-700">Present</p>
          <p className="mt-2 text-2xl font-bold text-emerald-900">{allTimeStats.present}</p>
          <p className="text-xs text-emerald-600">all time</p>
        </div>
        <div className="rounded-[22px] border bg-rose-50 p-4 shadow-sm" style={{ borderColor: 'rgba(254,202,202,0.7)' }}>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-rose-700">Absent</p>
          <p className="mt-2 text-2xl font-bold text-rose-900">{allTimeStats.absent}</p>
          <p className="text-xs text-rose-600">all time</p>
        </div>
        <div className="rounded-[22px] border bg-slate-50 p-4 shadow-sm" style={{ borderColor: 'rgba(226,232,240,0.7)' }}>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-600">Total</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{allTimeStats.total}</p>
          <p className="text-xs text-slate-500">all time</p>
        </div>
      </div>

      {/* Calendar card */}
      <div className="card border-slate-100 p-4 sm:p-5">
        {/* Month navigation */}
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 mb-4">
          <button
            onClick={() => setVisibleMonth((m) => shiftMonth(m, -1))}
            className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 active:scale-95 transition"
            aria-label="Previous month"
          >
            â† Prev
          </button>
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-900">{getMonthLabel(visibleMonth)}</p>
            <p className="mt-0.5 text-xs text-slate-500">
              {visibleMonthTotal > 0
                ? `${visibleMonthPresent} present Â· ${visibleMonthAbsent} absent`
                : loading ? 'Loadingâ€¦' : 'No records this month'}
            </p>
          </div>
          <button
            onClick={() => setVisibleMonth((m) => shiftMonth(m, 1))}
            disabled={visibleMonth >= todayMonthKey}
            className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Next month"
          >
            Next â†’
          </button>
        </div>

        {error && (
          <div className="mb-4 flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-7 w-7 animate-spin rounded-full border-4 border-cyan-200 border-t-cyan-600" />
          </div>
        ) : (
          <>
            {/* Weekday headers */}
            <div className="mb-1 grid grid-cols-7 gap-1">
              {WEEKDAYS.map((d) => (
                <div key={d} className="py-1.5 text-center text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarCells.map((cell) => {
                if (!cell.date || !cell.day) {
                  return <div key={cell.key} className="aspect-square rounded-xl bg-slate-50/50" />
                }
                const status = dailyMap.get(cell.date)
                const isToday = cell.date === todayDate
                return (
                  <div
                    key={cell.key}
                    title={status ? `${cell.date}: ${status}` : cell.date}
                    className={`aspect-square rounded-xl border p-1 transition ${
                      status === 'present'
                        ? 'border-emerald-200 bg-emerald-50'
                        : status === 'absent'
                        ? 'border-rose-200 bg-rose-50'
                        : 'border-slate-200 bg-slate-50/70'
                    } ${isToday ? 'ring-2 ring-cyan-400 ring-offset-1' : ''}`}
                  >
                    <div className="flex h-full flex-col justify-between">
                      <span className={`text-[11px] font-semibold ${status ? 'text-slate-900' : 'text-slate-400'}`}>
                        {cell.day}
                      </span>
                      {status && (
                        <span className={`self-end rounded-md border px-1 py-0.5 text-[10px] font-bold ${
                          status === 'present'
                            ? 'border-emerald-200 bg-emerald-100 text-emerald-700'
                            : 'border-rose-200 bg-rose-100 text-rose-700'
                        }`}>
                          {status === 'present' ? 'P' : 'A'}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Monthly percentage */}
            {visibleMonthTotal > 0 && (
              <div className="mt-4 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="text-sm font-medium text-slate-700">This month's attendance rate</span>
                <span className={`text-lg font-bold ${
                  visibleMonthPct === null ? 'text-slate-400'
                  : visibleMonthPct >= 90 ? 'text-green-600'
                  : visibleMonthPct >= 75 ? 'text-amber-600'
                  : 'text-rose-600'
                }`}>
                  {visibleMonthPct !== null ? `${visibleMonthPct}%` : 'â€”'}
                </span>
              </div>
            )}

            {/* Legend */}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-600">
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700">P = Present</span>
              <span className="rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 font-semibold text-rose-700">A = Absent</span>
              {visibleMonth === todayMonthKey && (
                <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 font-semibold text-cyan-700">Current month</span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

