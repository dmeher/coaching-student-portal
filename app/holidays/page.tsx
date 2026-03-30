'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/lib/authContext'

interface Holiday {
  id: string
  date: string
  title: string
  description?: string | null
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function getTodayStr() {
  return new Date().toISOString().split('T')[0]
}

function buildCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month - 1, 1).getDay()
  const daysInMonth = new Date(year, month, 0).getDate()
  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

function padDate(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export default function HolidaysPage() {
  const { student } = useAuth()
  const today = getTodayStr()
  const todayDate = new Date()
  const [year, setYear] = useState(todayDate.getFullYear())
  const [month, setMonth] = useState(todayDate.getMonth() + 1)
  const [holidays, setHolidays] = useState<Holiday[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const teacherId = student?.teacher_id ?? null

  const fetchHolidays = useCallback(async (teachId: string, y: number, m: number) => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams({
        teacher_id: teachId,
        year: String(y),
        month: String(m),
      })
      const res = await fetch(`/api/holidays?${params}`)
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || 'Failed to load holidays.')
        setHolidays([])
      } else {
        setHolidays(data.holidays || [])
      }
    } catch {
      setError('Failed to load holidays.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (teacherId) fetchHolidays(teacherId, year, month)
  }, [teacherId, year, month, fetchHolidays])

  function prevMonth() {
    if (month === 1) { setYear(y => y - 1); setMonth(12) }
    else setMonth(m => m - 1)
  }

  function nextMonth() {
    if (month === 12) { setYear(y => y + 1); setMonth(1) }
    else setMonth(m => m + 1)
  }

  const cells = buildCalendarDays(year, month)
  const holidaySet = new Set(holidays.map(h => h.date))
  const holidayByDate = holidays.reduce<Record<string, Holiday[]>>((acc, h) => {
    if (!acc[h.date]) acc[h.date] = []
    acc[h.date].push(h)
    return acc
  }, {})
  const selectedHolidays = selectedDate ? (holidayByDate[selectedDate] || []) : []

  return (
    <div className="mx-auto max-w-xl">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-xl font-bold text-slate-900">Holiday Calendar</h1>
        <p className="mt-0.5 text-sm text-slate-500">Scheduled holidays and breaks for this coaching.</p>
      </div>

      {!teacherId && (
        <div className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50 p-5 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-[18px] bg-gradient-to-br from-amber-400 to-orange-500 shadow-md shadow-amber-200/50">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-slate-800">Login to view holidays</p>
          <p className="mt-1 text-xs text-slate-500">Login with your registered mobile number to see the holiday calendar for your coaching.</p>
        </div>
      )}

      {teacherId && (
        <>
          {/* Calendar */}
          <div className="overflow-hidden rounded-2xl bg-gradient-to-b from-violet-50/70 to-blue-50/30 shadow-sm ring-1 ring-violet-100/80">
            {/* Month nav */}
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <button
                onClick={prevMonth}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 transition"
                aria-label="Previous month"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="text-sm font-semibold text-slate-900">
                {MONTHS[month - 1]} {year}
              </h2>
              <button
                onClick={nextMonth}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 transition"
                aria-label="Next month"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 border-b border-violet-100 bg-violet-100/60">
              {WEEKDAYS.map(w => (
                <div key={w} className="py-1.5 text-center text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  {w}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7">
              {cells.map((day, idx) => {
                if (!day) return <div key={`empty-${idx}`} className="h-12 border-b border-r border-violet-100/50 last:border-r-0" />
                const dateStr = padDate(year, month, day)
                const isToday = dateStr === today
                const isHoliday = holidaySet.has(dateStr)
                const isSunday = new Date(year, month - 1, day).getDay() === 0
                const isSelected = selectedDate === dateStr

                return (
                  <div
                    key={dateStr}
                    onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                    className={`relative flex h-12 flex-col items-center justify-start border-b border-r border-violet-100/50 pt-1.5 last:border-r-0 cursor-pointer transition
                      ${isHoliday ? 'bg-rose-100/70 hover:bg-rose-100' : 'hover:bg-violet-100/50'}
                      ${isSelected ? 'ring-2 ring-inset ring-blue-400' : ''}
                    `}
                  >
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium
                        ${isToday ? 'bg-blue-600 text-white' : isSunday ? 'text-rose-500' : 'text-slate-700'}
                        ${isHoliday && !isToday ? 'font-bold text-rose-600' : ''}
                      `}
                    >
                      {day}
                    </span>
                    {isHoliday && (
                      <span className="mt-0.5 block h-1 w-1 rounded-full bg-rose-500" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-rose-500" /> Holiday
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-600" /> Today
            </span>
          </div>

          {/* Selected day detail */}
          {selectedDate && selectedHolidays.length > 0 && (
            <div className="mt-4 space-y-2">
              {selectedHolidays.map(h => (
                <div key={h.id} className="flex items-start gap-3 rounded-xl bg-rose-50 px-4 py-3 ring-1 ring-rose-100">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-100">
                    <svg className="h-5 w-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{h.title}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(h.date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    {h.description && <p className="mt-0.5 text-xs text-slate-400">{h.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Holidays list */}
          <div className="mt-5">
            <h3 className="mb-2 text-sm font-semibold text-slate-700">
              {MONTHS[month - 1]} {year} — Holidays
            </h3>

            {loading ? (
              <div className="flex items-center justify-center gap-2 py-8 text-sm text-slate-400">
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Loading…
              </div>
            ) : error ? (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
            ) : holidays.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-400">
                No holidays scheduled this month.
              </div>
            ) : (
              <ul className="space-y-2">
                {holidays.map(h => {
                  const d = new Date(h.date + 'T00:00:00')
                  const dayLabel = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
                  return (
                    <li
                      key={h.id}
                      onClick={() => setSelectedDate(selectedDate === h.date ? null : h.date)}
                      className="flex cursor-pointer items-start gap-3 rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-100 hover:bg-slate-50 transition"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-50">
                        <svg className="h-4 w-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{h.title}</p>
                        <p className="text-xs text-slate-500">{dayLabel}</p>
                        {h.description && <p className="mt-0.5 text-xs text-slate-400">{h.description}</p>}
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  )
}
