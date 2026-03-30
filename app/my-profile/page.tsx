'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/authContext'
import type { StudentAttendanceSummary, FeeEntry } from '@/lib/types'

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount)
}

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}


function getCurrentMonthValue() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}


export default function MyProfilePage() {
  const { student, logout } = useAuth()
  const router = useRouter()
  const [month, setMonth] = useState(getCurrentMonthValue)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [attendanceData, setAttendanceData] = useState<StudentAttendanceSummary | null>(null)
  const [selectedDay, setSelectedDay] = useState<{ date: string; sessions: Array<{ status: 'present' | 'absent' | 'unknown'; session: string }> } | null>(null)
  const [activeSection, setActiveSection] = useState<'overview' | 'attendance' | 'fees' | 'details'>('overview')

  // Fees & Payments state
  const [fees, setFees] = useState<FeeEntry[]>([])
  const [feesLoading, setFeesLoading] = useState(false)
  const [feesError, setFeesError] = useState('')
  const [selectedFee, setSelectedFee] = useState<FeeEntry | null>(null)

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

  const fetchFees = useCallback(async () => {
    if (!student) return
    setFeesLoading(true)
    setFeesError('')
    try {
      const res = await fetch(`/api/fees?student_id=${student.id}`)
      const data = await res.json()
      if (!res.ok) {
        setFeesError(data.message || 'Failed to load fees.')
      } else {
        setFees(data.fees || [])
      }
    } catch {
      setFeesError('Network error while loading fees.')
    } finally {
      setFeesLoading(false)
    }
  }, [student])

  useEffect(() => {
    if (student) fetchFees()
  }, [fetchFees])

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

  // Pre-compute fees totals for overview
  const totalBilled = fees.reduce((s, f) => s + f.amount, 0)
  const totalPaid = fees.reduce((s, f) => s + f.payments.reduce((ps, p) => ps + p.amount, 0), 0)
  const outstanding = Math.max(0, totalBilled - totalPaid)
  const pendingFeesCount = fees.filter((f) => f.status !== 'paid').length

  const TAB_ITEMS = [
    {
      id: 'overview' as const,
      label: 'Overview',
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      id: 'attendance' as const,
      label: 'Attendance',
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 'fees' as const,
      label: 'Fees & Dues',
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      id: 'details' as const,
      label: 'Details',
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="space-y-3 sm:space-y-5">

      {/* ── Hero Card ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-700 p-4 sm:p-6 shadow-lg shadow-blue-200/50">
        {/* decorative circles */}
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-white/10" />
        <div className="relative flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="flex h-12 w-12 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm ring-2 ring-white/30 shadow-inner">
              <span className="text-xl sm:text-2xl font-extrabold text-white">
                {student.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-extrabold text-white leading-tight truncate">{student.name}</h1>
              {student.parent_name && (
                <p className="mt-0.5 text-xs text-blue-100/90">{student.parent_name}</p>
              )}
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-semibold text-white">
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {student.class_name}
                </span>
                <span className="inline-flex items-center rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-semibold capitalize text-white">
                  {student.gender}
                </span>
                {student.address && (
                  <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-semibold text-white">
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate max-w-[140px]">{student.address}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="shrink-0 flex items-center gap-1 rounded-xl bg-white/20 backdrop-blur-sm px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-white/30 transition ring-1 ring-white/30"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div className="flex gap-1.5 rounded-2xl bg-slate-100/80 p-1">
        {TAB_ITEMS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-xs sm:text-sm font-semibold transition ${
              activeSection === tab.id
                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/80'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.icon}
            <span className="hidden xs:inline sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {activeSection === 'overview' && (
        <div className="space-y-3 sm:space-y-4">

          {/* Attendance snapshot */}
          <div
            className="rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-50 to-blue-50/60 p-4 cursor-pointer hover:shadow-md transition"
            onClick={() => setActiveSection('attendance')}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-600">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-sm font-bold text-slate-800">Attendance</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-cyan-600 font-semibold">
                View details
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
            {loading ? (
              <div className="h-10 animate-pulse rounded-xl bg-cyan-100/60" />
            ) : agg ? (
              <div className="grid grid-cols-4 gap-2">
                <div className="rounded-xl bg-white/70 p-2.5 text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Present</p>
                  <p className="mt-0.5 text-lg font-extrabold text-emerald-600">{agg.present}</p>
                </div>
                <div className="rounded-xl bg-white/70 p-2.5 text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Absent</p>
                  <p className="mt-0.5 text-lg font-extrabold text-rose-500">{agg.absent}</p>
                </div>
                <div className="rounded-xl bg-white/70 p-2.5 text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Total</p>
                  <p className="mt-0.5 text-lg font-extrabold text-slate-700">{agg.total}</p>
                </div>
                <div className="rounded-xl bg-white/70 p-2.5 text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Rate</p>
                  <p className={`mt-0.5 text-lg font-extrabold ${
                    percentage === null ? 'text-slate-400'
                    : percentage >= 90 ? 'text-emerald-600'
                    : percentage >= 75 ? 'text-amber-500'
                    : 'text-rose-500'
                  }`}>{percentage !== null ? `${percentage}%` : '—'}</p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">No attendance data for this month.</p>
            )}
          </div>

          {/* Details snapshot */}
          <div
            className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50/60 p-4 cursor-pointer hover:shadow-md transition"
            onClick={() => setActiveSection('details')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="text-sm font-bold text-slate-800">My Details</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                View all
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200/60">
                <svg className="h-3 w-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {student.name}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200/60 capitalize">
                {student.gender}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200/60">
                {student.class_name}
              </span>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
                student.status === 'active' ? 'bg-emerald-100 text-emerald-700 ring-emerald-200' : 'bg-rose-100 text-rose-700 ring-rose-200'
              } capitalize`}>
                {student.status}
              </span>
            </div>
          </div>

          {/* Fees snapshot */}
          <div
            className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-indigo-50/60 p-4 cursor-pointer hover:shadow-md transition"
            onClick={() => setActiveSection('fees')}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-500/15 text-violet-600">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span className="text-sm font-bold text-slate-800">Fees & Dues</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-violet-600 font-semibold">
                View details
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
            {feesLoading ? (
              <div className="h-10 animate-pulse rounded-xl bg-violet-100/60" />
            ) : fees.length === 0 ? (
              <p className="text-xs text-slate-400">No fee records found.</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-white/70 p-2.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Outstanding</p>
                  <p className="mt-0.5 text-lg font-extrabold text-rose-600">{formatCurrency(outstanding)}</p>
                </div>
                <div className="rounded-xl bg-white/70 p-2.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Total Paid</p>
                  <p className="mt-0.5 text-lg font-extrabold text-emerald-600">{formatCurrency(totalPaid)}</p>
                </div>
                <div className="rounded-xl bg-white/70 p-2.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Total Billed</p>
                  <p className="mt-0.5 text-lg font-extrabold text-slate-700">{formatCurrency(totalBilled)}</p>
                </div>
                <div className="rounded-xl bg-white/70 p-2.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Pending</p>
                  <p className="mt-0.5 text-lg font-extrabold text-amber-600">{pendingFeesCount}</p>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ── ATTENDANCE TAB ── */}
      {activeSection === 'attendance' && (
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">My Attendance</h2>
              <p className="text-xs text-slate-500">Monthly attendance record</p>
            </div>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="rounded-2xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs sm:text-sm text-slate-700 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
            />
          </div>

          {agg && (
            <div className="grid grid-cols-4 gap-1.5 sm:gap-3">
              <div className="mobile-stat border-2 border-emerald-200 p-2 sm:p-4">
                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Present</p>
                <p className="mt-1 sm:mt-2 text-base sm:text-xl font-bold text-green-600">{agg.present}</p>
              </div>
              <div className="mobile-stat border-2 border-rose-200 p-2 sm:p-4">
                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Absent</p>
                <p className="mt-1 sm:mt-2 text-base sm:text-xl font-bold text-rose-500">{agg.absent}</p>
              </div>
              <div className="mobile-stat border-2 border-slate-200 p-2 sm:p-4">
                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Total</p>
                <p className="mt-1 sm:mt-2 text-base sm:text-xl font-bold text-slate-700">{agg.total}</p>
              </div>
              <div className="mobile-stat border-2 border-slate-200 p-2 sm:p-4">
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

          {!loading && !error && (
            <div className="card border-cyan-100/70 bg-gradient-to-br from-cyan-50/60 to-blue-50/40 p-3 sm:p-5">
              <p className="mb-2 sm:mb-3 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-slate-400">
                {new Date(`${month}-01`).toLocaleString('default', { month: 'long', year: 'numeric' })}
              </p>
              {monthDates.length === 0 ? (
                <p className="text-sm text-slate-400">Select a month to view attendance.</p>
              ) : (
                <>
                  <div className="mb-1 grid grid-cols-7 gap-1 sm:gap-1.5">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                      <div key={d} className="py-1 text-center text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        {d}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
                    {Array.from(
                      { length: new Date(`${monthDates[0]}T00:00:00`).getDay() },
                      (_, i) => <div key={`empty-${i}`} className="min-h-[50px] sm:min-h-[66px]" />
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
                          onClick={() => setSelectedDay({ date, sessions })}
                          className={`min-h-[50px] sm:min-h-[66px] cursor-pointer rounded-xl border p-1.5 sm:p-2 transition active:scale-95 ${
                            allPresent ? 'bg-green-50 border-green-200'
                            : allAbsent ? 'bg-rose-50 border-rose-200'
                            : isMixed ? 'bg-amber-50 border-amber-200'
                            : 'bg-white border-slate-200'
                          } ${isToday ? 'ring-2 ring-cyan-400 ring-offset-1' : ''}`}
                        >
                          <span className={`block text-xs sm:text-sm font-bold leading-none mb-1.5 ${
                            sessions.length > 0 ? 'text-slate-800' : 'text-slate-300'
                          }`}>{day}</span>
                          <div className="flex flex-col gap-0.5">
                            {sessions.length === 0 && <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-slate-200" />}
                            {sessions.map((s) => (
                              <div key={s.session} className={`flex items-center gap-0.5 rounded px-1 py-0.5 text-[10px] sm:text-[11px] font-bold leading-none ${
                                s.status === 'present' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                              }`}>
                                <span className="text-[11px] leading-none">{s.session === 'morning' ? '☀️' : '🌙'}</span>
                                <span>{s.status === 'present' ? 'P' : 'A'}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
              <div className="mt-2 sm:mt-4 flex flex-wrap gap-2 sm:gap-3 text-[10px] sm:text-xs text-slate-500">
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-green-500" /> Present</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-rose-400" /> Absent</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> Mixed</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-slate-200" /> Not marked</span>
                <span className="text-slate-400">☀️=Morning · 🌙=Evening</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── FEES TAB ── */}
      {activeSection === 'fees' && (
        <div className="space-y-3 sm:space-y-4">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">My Fees & Dues</h2>
            <p className="text-xs text-slate-500">Your fee records and payment history</p>
          </div>

          {feesLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="h-7 w-7 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
            </div>
          )}

          {!feesLoading && feesError && (
            <div className="flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {feesError}
            </div>
          )}

          {!feesLoading && !feesError && fees.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-400">
              No fee records found.
            </div>
          )}

          {!feesLoading && fees.length > 0 && (
            <>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <div className="rounded-2xl border border-white/70 bg-gradient-to-br from-rose-500/15 to-red-500/10 p-3 sm:p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Outstanding</p>
                  <p className="mt-1 text-base sm:text-lg font-extrabold text-rose-700">{formatCurrency(outstanding)}</p>
                </div>
                <div className="rounded-2xl border border-white/70 bg-gradient-to-br from-emerald-500/15 to-green-500/10 p-3 sm:p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Total Paid</p>
                  <p className="mt-1 text-base sm:text-lg font-extrabold text-emerald-700">{formatCurrency(totalPaid)}</p>
                </div>
                <div className="rounded-2xl border border-white/70 bg-gradient-to-br from-violet-500/15 to-indigo-500/10 p-3 sm:p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Total Billed</p>
                  <p className="mt-1 text-base sm:text-lg font-extrabold text-slate-900">{formatCurrency(totalBilled)}</p>
                </div>
                <div className="rounded-2xl border border-white/70 bg-gradient-to-br from-amber-500/15 to-orange-500/10 p-3 sm:p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Pending</p>
                  <p className="mt-1 text-base sm:text-lg font-extrabold text-amber-700">{pendingFeesCount}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {fees.map((fee) => {
                  const paid = fee.payments.reduce((s, p) => s + p.amount, 0)
                  const due = Math.max(0, fee.amount - paid)
                  const statusColor =
                    fee.status === 'paid' ? 'border-emerald-200 bg-emerald-50'
                    : fee.status === 'partial' ? 'border-amber-200 bg-amber-50'
                    : 'border-rose-200 bg-white'
                  const badge =
                    fee.status === 'paid' ? 'bg-emerald-100 text-emerald-700'
                    : fee.status === 'partial' ? 'bg-amber-100 text-amber-700'
                    : 'bg-rose-100 text-rose-700'
                  return (
                    <button
                      key={fee.id}
                      type="button"
                      onClick={() => setSelectedFee(fee)}
                      className={`w-full text-left rounded-xl border p-3 sm:p-4 transition hover:opacity-90 active:scale-[0.99] ${statusColor}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-sm font-semibold text-slate-900">
                              {fee.fee_type === 'arrear' ? 'Arrear' : 'Monthly Fee'}
                            </span>
                            {fee.description && (
                              <span className="text-xs text-slate-500 italic truncate">— {fee.description}</span>
                            )}
                          </div>
                          <p className="mt-0.5 text-xs text-slate-500">Due: {formatDate(fee.due_date)}</p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-sm font-bold text-slate-900">{formatCurrency(fee.amount)}</p>
                          <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${badge}`}>
                            {fee.status}
                          </span>
                        </div>
                      </div>
                      {fee.status !== 'paid' && (
                        <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                          <span>Paid: <span className="font-medium text-emerald-700">{formatCurrency(paid)}</span></span>
                          <span>Remaining: <span className="font-medium text-rose-600">{formatCurrency(due)}</span></span>
                        </div>
                      )}
                      {fee.payments.length > 0 && (
                        <p className="mt-1.5 text-[11px] font-semibold text-violet-600">
                          {fee.payments.length} payment{fee.payments.length > 1 ? 's' : ''} recorded · tap to view
                        </p>
                      )}
                    </button>
                  )
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── DETAILS TAB ── */}
      {activeSection === 'details' && (
        <div className="space-y-3 sm:space-y-4">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">My Details</h2>
            <p className="text-xs text-slate-500">Your full profile information</p>
          </div>

          {/* Profile card */}
          <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/60 to-teal-50/40">
            {/* Avatar banner */}
            <div className="flex items-center gap-4 bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/25 ring-2 ring-white/40 shadow-inner">
                <span className="text-2xl font-extrabold text-white">{student.name.charAt(0).toUpperCase()}</span>
              </div>
              <div className="min-w-0">
                <p className="text-lg font-extrabold text-white leading-tight truncate">{student.name}</p>
                <p className="text-xs text-emerald-100 mt-0.5">{student.class_name}</p>
              </div>
              <span className={`ml-auto shrink-0 rounded-full px-3 py-1 text-xs font-bold capitalize ring-1 ${
                student.status === 'active'
                  ? 'bg-white/20 text-white ring-white/30'
                  : 'bg-rose-200/30 text-rose-100 ring-rose-300/30'
              }`}>
                {student.status}
              </span>
            </div>

            {/* Fields */}
            <div className="divide-y divide-emerald-100/60">
              {([
                {
                  label: 'Full Name',
                  value: student.name,
                  icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
                  color: 'text-emerald-600',
                },
                {
                  label: 'Class',
                  value: student.class_name,
                  icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
                  color: 'text-blue-600',
                },
                {
                  label: 'Gender',
                  value: student.gender.charAt(0).toUpperCase() + student.gender.slice(1),
                  icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
                  color: 'text-violet-600',
                },
                student.parent_name ? {
                  label: 'Parent / Guardian',
                  value: student.parent_name,
                  icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
                  color: 'text-amber-600',
                } : null,
                student.address ? {
                  label: 'Address',
                  value: student.address,
                  icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z',
                  color: 'text-rose-500',
                } : null,
                student.mobile_no ? {
                  label: 'Mobile Number',
                  value: student.mobile_no,
                  icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
                  color: 'text-teal-600',
                } : null,
                {
                  label: 'Account Status',
                  value: student.status.charAt(0).toUpperCase() + student.status.slice(1),
                  icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
                  color: student.status === 'active' ? 'text-emerald-600' : 'text-rose-500',
                },
              ].filter(Boolean) as { label: string; value: string; icon: string; color: string }[]).map((field) => (
                <div key={field.label} className="flex items-start gap-3 px-5 py-3.5">
                  <div className={`mt-0.5 shrink-0 ${field.color}`}>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={field.icon} />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">{field.label}</p>
                    <p className="mt-0.5 text-sm font-semibold text-slate-800 break-words">{field.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick stats row */}
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-50 to-blue-50/50 p-3 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Attendance</p>
              <p className={`mt-1 text-lg font-extrabold ${
                percentage === null ? 'text-slate-400' : percentage >= 90 ? 'text-emerald-600' : percentage >= 75 ? 'text-amber-500' : 'text-rose-500'
              }`}>{percentage !== null ? `${percentage}%` : '—'}</p>
            </div>
            <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-indigo-50/50 p-3 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Paid</p>
              <p className="mt-1 text-lg font-extrabold text-emerald-600">{formatCurrency(totalPaid)}</p>
            </div>
            <div className="rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50 to-red-50/50 p-3 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Due</p>
              <p className="mt-1 text-lg font-extrabold text-rose-600">{formatCurrency(outstanding)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Fee detail popup */}
      {selectedFee && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
          onClick={() => setSelectedFee(null)}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-sm rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-2xl max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-200 sm:hidden" />
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-base font-bold text-slate-900">
                  {selectedFee.fee_type === 'arrear' ? 'Arrear' : 'Monthly Fee'}
                  {selectedFee.description ? ` — ${selectedFee.description}` : ''}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">Due: {formatDate(selectedFee.due_date)}</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">{formatCurrency(selectedFee.amount)}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${
                    selectedFee.status === 'paid' ? 'bg-emerald-100 text-emerald-700'
                    : selectedFee.status === 'partial' ? 'bg-amber-100 text-amber-700'
                    : 'bg-rose-100 text-rose-700'
                  }`}>{selectedFee.status}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedFee(null)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {selectedFee.payments.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-400">
                No payments recorded yet for this fee.
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">Payment History</p>
                {selectedFee.payments.map((pay) => (
                  <div key={pay.id} className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-emerald-800">{formatCurrency(pay.amount)}</p>
                      <p className="text-xs text-slate-500">{formatDate(pay.payment_date)}</p>
                    </div>
                    {pay.notes && (
                      <p className="mt-1 text-xs text-slate-500 italic">{pay.notes}</p>
                    )}
                    {pay.collected_by && (
                      <p className="mt-0.5 text-xs text-slate-400">Collected by: {pay.collected_by}</p>
                    )}
                  </div>
                ))}
                {/* Total paid for this fee */}
                <div className="mt-2 flex items-center justify-between rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700">
                  <span>Total Paid</span>
                  <span className="text-emerald-700">
                    {formatCurrency(selectedFee.payments.reduce((s, p) => s + p.amount, 0))}
                  </span>
                </div>
                {selectedFee.status !== 'paid' && (
                  <div className="flex items-center justify-between rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-semibold border border-rose-100">
                    <span className="text-slate-700">Remaining</span>
                    <span className="text-rose-600">
                      {formatCurrency(Math.max(0, selectedFee.amount - selectedFee.payments.reduce((s, p) => s + p.amount, 0)))}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Day detail popup */}
      {selectedDay && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
          onClick={() => setSelectedDay(null)}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-sm rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-200 sm:hidden" />
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-base font-bold text-slate-900">
                  {new Date(selectedDay.date + 'T00:00:00').toLocaleDateString('en-IN', {
                    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {selectedDay.sessions.length > 0
                    ? `${selectedDay.sessions.length} session${selectedDay.sessions.length > 1 ? 's' : ''} recorded`
                    : 'No sessions recorded'}
                </p>
              </div>
              <button
                onClick={() => setSelectedDay(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {selectedDay.sessions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-400">
                No attendance recorded for this day.
              </div>
            ) : (
              <div className="space-y-2">
                {selectedDay.sessions.map((s) => (
                  <div
                    key={s.session}
                    className={`flex items-center justify-between rounded-2xl border px-4 py-3 ${
                      s.status === 'present' ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{s.session === 'morning' ? '☀️' : '🌙'}</span>
                      <div>
                        <p className="text-sm font-semibold capitalize text-slate-800">{s.session} Session</p>
                        <p className="text-xs text-slate-500">{s.session === 'morning' ? 'Before noon' : 'After noon'}</p>
                      </div>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
                      s.status === 'present' ? 'bg-emerald-200 text-emerald-800' : 'bg-rose-200 text-rose-800'
                    }`}>
                      {s.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
