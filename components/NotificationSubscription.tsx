'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/authContext'

const SUB_KEY = 'portal_push_subscribed'

function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const output = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; i++) {
    output[i] = rawData.charCodeAt(i)
  }
  return output.buffer
}

export default function NotificationSubscription() {
  const { student } = useAuth()
  const [supported, setSupported] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [permissionDenied, setPermissionDenied] = useState(false)

  useEffect(() => {
    if (!('Notification' in window) || !('PushManager' in window) || !('serviceWorker' in navigator)) {
      return
    }
    if (Notification.permission === 'denied') {
      setPermissionDenied(true)
      return
    }
    setSupported(true)
    setSubscribed(localStorage.getItem(SUB_KEY) === '1')
  }, [])

  async function subscribe() {
    if (!student?.teacher_id) return
    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    if (!vapidKey) return

    setLoading(true)
    try {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        setPermissionDenied(true)
        setLoading(false)
        return
      }

      const reg = await navigator.serviceWorker.ready
      const existing = await reg.pushManager.getSubscription()
      if (existing) await existing.unsubscribe()

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      })

      const json = sub.toJSON()
      const keys = json.keys as { p256dh: string; auth: string }

      await fetch('/api/push-subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: sub.endpoint,
          p256dh: keys.p256dh,
          auth: keys.auth,
          teacher_id: student.teacher_id,
          user_agent: navigator.userAgent,
        }),
      })

      localStorage.setItem(SUB_KEY, '1')
      setSubscribed(true)
    } catch {
      // Subscribe failed — silently ignore for now
    } finally {
      setLoading(false)
    }
  }

  async function unsubscribe() {
    setLoading(true)
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.getSubscription()
      if (sub) {
        await fetch('/api/push-subscriptions', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        })
        await sub.unsubscribe()
      }
      localStorage.removeItem(SUB_KEY)
      setSubscribed(false)
    } catch {
      // Unsubscribe failed — silently ignore
    } finally {
      setLoading(false)
    }
  }

  if (!supported || !student?.teacher_id) return null

  if (permissionDenied) {
    return (
      <span className="text-xs text-gray-400" title="Notifications blocked in browser settings">
        🔕 Blocked
      </span>
    )
  }

  return (
    <button
      onClick={subscribed ? unsubscribe : subscribe}
      disabled={loading}
      title={subscribed ? 'Turn off notifications' : 'Turn on notifications'}
      className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-gray-100 disabled:opacity-60"
      aria-label={subscribed ? 'Unsubscribe from push notifications' : 'Subscribe to push notifications'}
    >
      {loading ? (
        <svg className="h-5 w-5 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      ) : subscribed ? (
        <>
          <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6V11c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
          </svg>
          <span className="text-blue-600">On</span>
        </>
      ) : (
        <>
          <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="text-gray-500">Notify me</span>
        </>
      )}
    </button>
  )
}
