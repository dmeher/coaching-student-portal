'use client'

import { useEffect, useState } from 'react'
import type { TeacherProfile } from '@/lib/types'

function AvatarPlaceholder({ name, url }: { name: string; url: string | null }) {
  if (url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt={name}
        className="w-11 h-11 sm:w-16 sm:h-16 rounded-full object-cover"
        onError={(e) => {
          ;(e.target as HTMLImageElement).style.display = 'none'
        }}
      />
    )
  }
  return (
    <div className="w-11 h-11 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
      <span className="text-white font-bold text-lg sm:text-2xl">{name.charAt(0).toUpperCase()}</span>
    </div>
  )
}

function TeacherCard({ teacher }: { teacher: TeacherProfile }) {
  return (
    <div className="card border-emerald-100/70 bg-gradient-to-br from-white via-white to-emerald-50/60 p-3 sm:p-5 transition-shadow hover:shadow-md">
      <div className="flex items-center gap-3 sm:gap-4">
        <AvatarPlaceholder name={teacher.display_name || 'T'} url={teacher.avatar_url} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm sm:text-base font-semibold text-slate-900">{teacher.display_name}</h3>
            {teacher.is_primary && (
              <span className="badge bg-amber-100 text-amber-800">Head Teacher</span>
            )}
          </div>

          {teacher.subject && (
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5 flex items-center gap-1">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              {teacher.subject}
            </p>
          )}

          {teacher.phone && (
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 flex items-center gap-1">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {teacher.phone}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<TeacherProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/teachers')
      .then((r) => r.json())
      .then((d) => {
        if (d.teachers) setTeachers(d.teachers)
        else setError('Failed to load teachers.')
      })
      .catch(() => setError('Network error.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-3 sm:space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Our Teachers</h1>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-500">Meet the coaching staff at Amlan Coaching</p>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Faculty profiles
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-slate-200 rounded-full" />
                <div className="flex-1 space-y-2 pt-2">
                  <div className="h-4 bg-slate-200 rounded w-2/3" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                  <div className="h-3 bg-slate-100 rounded w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="card py-10 text-center text-red-600">{error}</div>
      ) : teachers.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
          <p className="font-medium">No teacher profiles yet</p>
          <p className="text-sm mt-1">Profiles will appear once teachers set up their accounts</p>
        </div>
      ) : (
        <>
          <div className="mobile-stat flex items-center justify-between p-3 sm:p-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Available</p>
              <p className="mt-0.5 text-base sm:text-lg font-semibold text-slate-900">{teachers.length} teacher{teachers.length !== 1 ? 's' : ''}</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">Public profiles</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
            {teachers.map((t) => (
              <TeacherCard key={t.id} teacher={t} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
