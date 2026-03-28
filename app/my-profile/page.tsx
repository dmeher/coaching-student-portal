'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/authContext'
import type { StudentAttendanceSummary } from '@/lib/types'

function attendanceBadgeClass(percentage: number | null) {
  if (percentage === null) return 'badge bg-slate-100 text-slate-600'
  if (percentage >= 90) return 'badge bg-green-100 text-green-800'
  if (percentage >= 75) return 'badge bg-amber-100 text-amber-800'
  return 'badge bg-rose-100 text-rose-800'
}


function getCurrentMonthValue() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function GenderBadge({ gender }: { gender: string }) {
  const map: Record<string, string> = {
    male: 'badge badge-male',
    female: 'badge badge-female',
    other: 'badge badge-other',
  }
  return (
    <span className={map[gender] || 'badge'}>
      {gender.charAt(0).toUpperCase() + gender.slice(1)}
    </span>
  )
}

export default function MyProfilePage() {
  const { student, logout } = useAuth()
  const router = useRouter()
  const [month, setMonth] = useState(getCurrentMonthValue)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [attendanceData, setAttendanceData] = useState<StudentAttendanceSummary | null>(null)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (student === null) {
      // Wait a tick so AuthProvider can hydrate from localStorage first
      const timer = setTimeout(() => {
        if (!localStorage.getItem('student_portal_session')) {
          router.push('/login')
        }
      }, 150)
      return () => clearTimeout(timer)
    }
  }, [student, router])

  const fetchAttendance = useCallback(async () => {
    if (!student) return
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams({ student_id: student.id, month })
      const res = await fetch(`/api/attendance?${params.toString()}`)
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || 'Failed to load attendance.')
        setAttendanceData(null)
      } else {
        const found = (data.students || []).find((s: StudentAttendanceSummary) => s.id === student.id)
        setAttendanceData(found || null)
      }
    } catch {
      setError('Network error while loading attendance.')
    } finally {
      setLoading(false)
    }
  }, [student, month])

  useEffect(() => {
    if (student) fetchAttendance()
  }, [fetchAttendance])

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

  const dailyMap = useMemo(() => {
    const map = new Map<string, Array<{ status: 'present' | 'absent' | 'unknown'; session: string }>>()
    for (const d of attendanceData?.daily || []) {
      const arr = map.get(d.date) || []
      arr.push({ status: d.status, session: d.session || 'morning' })
      map.set(d.date, arr)
    }
    return map
  }, [attendanceData])

  function handleLogout() {
    logout()
    router.push('/')
  }

  if (!student) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-200 border-t-cyan-600" />
      </div>
    )
  }

  const agg = attendanceData?.attendance
  const percentage = agg?.percentage ?? null

  return (
    <div className="space-y-3 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">My Profile</h1>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-500">Your details and attendance</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-2xl border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs sm:text-sm font-medium text-rose-600 transition hover:bg-rose-100"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>

      {/* Student Info Card */}
      <div className="card border-cyan-100/70 bg-gradient-to-br from-white via-white to-cyan-50/60 p-3 sm:p-6">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="flex h-11 w-11 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-[18px] sm:rounded-[22px] bg-gradient-to-br from-cyan-500 to-blue-600 shadow-md shadow-cyan-200/50">
            <span className="text-lg sm:text-2xl font-bold text-white">
              {student.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm sm:text-lg font-bold text-slate-900">{student.name}</h2>
              <GenderBadge gender={student.gender} />
            </div>
            {student.parent_name && (
              <p className="mt-0.5 text-xs sm:text-sm text-slate-500">
                <span className="font-medium">Parent:</span> {student.parent_name}
              </p>
            )}
            <div className="mt-2 sm:mt-3 flex flex-wrap gap-1.5 sm:gap-2">
              <span className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full bg-cyan-50 px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm text-cyan-700">
                <svg className="h-3 w-3 sm:h-4 sm:w-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {student.class_name}
              </span>
              {student.address && (
                <span className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full bg-slate-100 px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm text-slate-600">
                  <svg className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="truncate max-w-[160px] sm:max-w-[180px]">{student.address}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Section */}
      <div className="space-y-2 sm:space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm sm:text-lg font-bold text-slate-900">My Attendance</h2>
            <p className="text-xs sm:text-sm text-slate-500">Monthly attendance record</p>
          </div>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs sm:text-sm text-slate-700 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
          />
        </div>

        {/* Summary Stats */}
        {agg && (
          <div className="grid grid-cols-4 gap-1.5 sm:gap-3">
            <div className="mobile-stat p-2 sm:p-4">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Present</p>
              <p className="mt-1 sm:mt-2 text-base sm:text-xl font-bold text-green-600">{agg.present}</p>
            </div>
            <div className="mobile-stat p-2 sm:p-4">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Absent</p>
              <p className="mt-1 sm:mt-2 text-base sm:text-xl font-bold text-rose-500">{agg.absent}</p>
            </div>
            <div className="mobile-stat p-2 sm:p-4">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Total</p>
              <p className="mt-1 sm:mt-2 text-base sm:text-xl font-bold text-slate-700">{agg.total}</p>
            </div>
            <div className="mobile-stat p-2 sm:p-4">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Rate</p>
              <p className={`mt-1 sm:mt-2 text-base sm:text-xl font-bold ${
                percentage === null ? 'text-slate-400' :
                percentage >= 90 ? 'text-green-600' :
                percentage >= 75 ? 'text-amber-600' :
                'text-rose-500'
              }`}>
                {percentage !== null ? `${percentage}%` : '—'}
              </p>
            </div>
          </div>
        )}

        {/* Loading / Error */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="h-7 w-7 animate-spin rounded-full border-4 border-cyan-200 border-t-cyan-600" />
          </div>
        )}

        {!loading && error && (
          <div className="flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Daily Calendar Grid */}
        {!loading && !error && (
          <div className="card border-slate-100 p-3 sm:p-5">
            <p className="mb-2 sm:mb-3 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-slate-400">
              {new Date(`${month}-01`).toLocaleString('default', { month: 'long', year: 'numeric' })}
            </p>
            {monthDates.length === 0 ? (
              <p className="text-sm text-slate-400">Select a month to view attendance.</p>
            ) : (
              <div className="grid grid-cols-7 gap-1">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                  <div key={d} className="text-center text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-slate-400 pb-0.5">
                    {d}
                  </div>
                ))}
                {/* Empty cells to align first day */}
                {Array.from(
                  { length: new Date(`${monthDates[0]}T00:00:00`).getDay() },
                  (_, i) => <div key={`empty-${i}`} />
                )}
                {monthDates.map((date) => {
                  const sessions = dailyMap.get(date) || []
                  const day = Number(date.slice(-2))
                  const isToday = date === new Date().toISOString().slice(0, 10)
                  const allPresent = sessions.length > 0 && sessions.every((s) => s.status === 'present')
                  const allAbsent = sessions.length > 0 && sessions.every((s) => s.status === 'absent')
                  const isMixed = sessions.length > 1 && !allPresent && !allAbsent
                  return (
                    <div
                      key={date}
                      title={sessions.length > 0 ? sessions.map((s) => `${s.session}: ${s.status}`).join(', ') : date}
                      className={`flex flex-col items-center justify-center rounded-lg py-1.5 sm:py-2 text-[10px] sm:text-xs font-medium border transition ${
                        allPresent
                          ? 'bg-green-50 border-green-200 text-green-800'
                          : allAbsent
                          ? 'bg-rose-50 border-rose-200 text-rose-700'
                          : isMixed
                          ? 'bg-amber-50 border-amber-200 text-amber-800'
                          : 'bg-slate-50 border-slate-100 text-slate-400'
                      } ${isToday ? 'ring-2 ring-cyan-400 ring-offset-1' : ''}`}
                    >
                      <span>{day}</span>
                      {sessions.length === 0 && <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-slate-200" />}
                      {sessions.length === 1 && (
                        <span className={`mt-0.5 text-[8px] font-bold leading-none ${sessions[0].status === 'present' ? 'text-green-600' : 'text-rose-500'}`}>
                          {sessions[0].session === 'morning' ? 'M' : 'E'}{sessions[0].status === 'present' ? 'P' : 'A'}
                        </span>
                      )}
                      {sessions.length >= 2 && (
                        <div className="mt-0.5 flex gap-0.5">
                          {sessions.slice(0, 2).map((s) => (
                            <span key={s.session} className={`text-[7px] font-bold leading-none ${s.status === 'present' ? 'text-green-600' : 'text-rose-500'}`}>
                              {s.session === 'morning' ? 'M' : 'E'}{s.status === 'present' ? 'P' : 'A'}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
            {/* Legend */}
            <div className="mt-2 sm:mt-4 flex flex-wrap gap-2 sm:gap-3 text-[10px] sm:text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" /> Present
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400" /> Absent
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> Mixed
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-200" /> Not marked
              </span>
              <span className="text-slate-400">M=Morning · E=Evening</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
