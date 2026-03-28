'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

interface PWAInstallContextType {
  canInstall: boolean
  isIOS: boolean
  install: () => Promise<void>
}

const PWAInstallContext = createContext<PWAInstallContextType>({
  canInstall: false,
  isIOS: false,
  install: async () => {},
})

export function PWAInstallProvider({ children }: { children: ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [ios, setIos] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Already installed — nothing to show
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setReady(true)
      return
    }

    // iOS Safari: no beforeinstallprompt event exists
    if (
      /iPhone|iPad|iPod/.test(navigator.userAgent) &&
      !(window.navigator as { standalone?: boolean }).standalone
    ) {
      setIos(true)
      setReady(true)
      return
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }
    const installedHandler = () => {
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', installedHandler)
    setReady(true)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      window.removeEventListener('appinstalled', installedHandler)
    }
  }, [])

  async function install() {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setDeferredPrompt(null)
  }

  const canInstall = ready && (!!deferredPrompt || ios)

  return (
    <PWAInstallContext.Provider value={{ canInstall, isIOS: ios, install }}>
      {children}
    </PWAInstallContext.Provider>
  )
}

export function usePWAInstall() {
  return useContext(PWAInstallContext)
}
