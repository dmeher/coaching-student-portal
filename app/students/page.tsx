'use client'

import { useEffect, useState, useCallback } from 'react'
import type { StudentPublic } from '@/lib/types'

function GenderBadge({ gender }: { gender: string }) {
  const map: Record<string, string> = {
    male: 'badge badge-male',
    female: 'badge badge-female',
    other: 'badge badge-other',
  }
  return <span className={map[gender] || 'badge'}>{gender.charAt(0).toUpperCase() + gender.slice(1)}</span>
}

function StudentCard({ student }: { student: StudentPublic }) {
  return (
    <div className="card border-cyan-100/70 bg-gradient-to-br from-white via-white to-cyan-50/60 p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600">
          <span className="text-lg font-semibold text-white">
            {student.name.charAt(0).toUpperCase()}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-semibold text-slate-900 truncate">{student.name}</h3>
            <GenderBadge gender={student.gender} />
          </div>

          {student.parent_name && (
            <p className="text-sm text-slate-500 mt-0.5">
              <span className="font-medium">Parent:</span> {student.parent_name}
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-600">
            <span className="inline-flex items-center gap-1 rounded-full bg-cyan-50 px-3 py-1.5 text-cyan-700">
              <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              {student.class_name}
            </span>

            {student.address && (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="truncate max-w-[200px]">{student.address}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function StudentsPage() {
  const [students, setStudents] = useState<StudentPublic[]>([])
  const [classes, setClasses] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [classFilter, setClassFilter] = useState('')
  const [genderFilter, setGenderFilter] = useState('')

  const fetchStudents = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (classFilter) params.set('class', classFilter)
    if (genderFilter) params.set('gender', genderFilter)

    const res = await fetch(`/api/students?${params.toString()}`)
    const data = await res.json()
    setStudents(data.students || [])
    setLoading(false)
  }, [search, classFilter, genderFilter])

  useEffect(() => {
    fetch('/api/classes')
      .then((r) => r.json())
      .then((d) => setClasses(d.classes || []))
  }, [])

  useEffect(() => {
    const timer = setTimeout(fetchStudents, 300)
    return () => clearTimeout(timer)
  }, [fetchStudents])

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Student Directory</h1>
          <p className="mt-1 text-sm text-slate-500">Active enrolled students at Amlan Coaching</p>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-cyan-50 px-3 py-1.5 text-xs font-medium text-cyan-700">
          <span className="h-2 w-2 rounded-full bg-cyan-500" />
          Live student list
        </div>
      </div>

      <div className="mobile-pane p-4 sm:p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name…"
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

          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="touch-field w-full"
          >
            <option value="">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-slate-200 rounded-full" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : students.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="font-medium">No students found</p>
          <p className="text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          <div className="mobile-stat flex items-center justify-between p-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Results</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{students.length} student{students.length !== 1 ? 's' : ''}</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">Filtered view</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {students.map((s) => (
              <StudentCard key={s.id} student={s} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
