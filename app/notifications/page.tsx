'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/authContext'
import { useRouter } from 'next/navigation'
import NotificationSubscription from '@/components/NotificationSubscription'

interface Notification {
  id: string
  title: string
  message: string
  sender_name: string | null
  created_at: string
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function NotificationsPage() {
  const { student } = useAuth()
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!student) {
      router.replace('/')
      return
    }
    if (!student.teacher_id) {
      setLoading(false)
      return
    }
    fetch(`/api/notifications?teacher_id=${student.teacher_id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.notifications) setNotifications(data.notifications)
        else setError('Could not load notifications.')
      })
      .catch(() => setError('Network error. Please try again.'))
      .finally(() => setLoading(false))
  }, [student, router])

  if (!student) return null

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
          <NotificationSubscription />
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-6">
        {/* No teacher_id fallback */}
        {!student.teacher_id && (
          <div className="rounded-2xl bg-amber-50 p-6 text-center">
            <p className="text-sm text-amber-700">
              Your account is not linked to a teacher yet. Please contact your coaching centre.
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-white shadow-sm" />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl bg-red-50 p-6 text-center">
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && student.teacher_id && notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 rounded-full bg-blue-100 p-6">
              <svg className="h-10 w-10 text-blue-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
            </div>
            <p className="text-base font-medium text-gray-900">No notifications yet</p>
            <p className="mt-1 text-sm text-gray-500">Your teacher's messages will appear here.</p>
          </div>
        )}

        {/* Notification list */}
        {!loading && !error && notifications.length > 0 && (
          <ul className="space-y-3">
            {notifications.map((n) => (
              <li key={n.id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 leading-snug">{n.title}</p>
                    <p className="mt-1 text-sm text-gray-600 whitespace-pre-wrap">{n.message}</p>
                    {n.sender_name && (
                      <p className="mt-2 text-xs text-gray-400">From: {n.sender_name}</p>
                    )}
                  </div>
                  <span className="shrink-0 text-xs text-gray-400 tabular-nums">
                    {timeAgo(n.created_at)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
