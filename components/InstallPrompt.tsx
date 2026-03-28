'use client'

import { useState } from 'react'
import { usePWAInstall } from '@/lib/pwaInstallContext'

const DISMISS_KEY = 'portal_install_dismissed'

export default function InstallPrompt() {
  const { canInstall, isIOS, install } = usePWAInstall()
  const [dismissed, setDismissed] = useState(
    () => typeof window !== 'undefined' && !!sessionStorage.getItem(DISMISS_KEY)
  )

  if (!canInstall || dismissed) return null

  async function handleInstall() {
    await install()
    setDismissed(true)
  }

  function handleDismiss() {
    sessionStorage.setItem(DISMISS_KEY, '1')
    setDismissed(true)
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 flex justify-center sm:bottom-6">
      <div className="flex items-center gap-3 bg-blue-600 text-white rounded-xl shadow-lg px-4 py-3 max-w-md w-full">
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold">Install Amlan Portal</p>
          {isIOS ? (
            <p className="text-xs text-blue-100">
              Tap <span className="font-semibold">Share</span> → <span className="font-semibold">Add to Home Screen</span>
            </p>
          ) : (
            <p className="text-xs text-blue-100">Add to home screen for quick access</p>
          )}
        </div>
        {!isIOS && (
          <button
            onClick={handleInstall}
            className="bg-white text-blue-600 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors shrink-0"
          >
            Install
          </button>
        )}
        <button
          onClick={handleDismiss}
          className="text-white hover:text-blue-200 transition-colors shrink-0 p-0.5"
          aria-label="Dismiss"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

