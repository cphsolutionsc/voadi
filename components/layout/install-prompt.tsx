'use client'

import { useEffect, useState } from 'react'
import { X, Share, Plus, Download } from 'lucide-react'

type Platform = 'android' | 'ios' | 'other'

function detectPlatform(): Platform {
  const ua = navigator.userAgent
  if (/iphone|ipad|ipod/i.test(ua)) return 'ios'
  if (/android/i.test(ua)) return 'android'
  return 'other'
}

function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in navigator && (navigator as Record<string, unknown>).standalone === true)
  )
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISSED_KEY = 'voadi-install-dismissed'

export function InstallPrompt() {
  const [show, setShow] = useState(false)
  const [platform, setPlatform] = useState<Platform>('other')
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showIosSteps, setShowIosSteps] = useState(false)

  useEffect(() => {
    if (isStandalone()) return
    if (sessionStorage.getItem(DISMISSED_KEY)) return

    const p = detectPlatform()
    setPlatform(p)

    if (p === 'android') {
      const handler = (e: Event) => {
        e.preventDefault()
        setDeferredPrompt(e as BeforeInstallPromptEvent)
        setShow(true)
      }
      window.addEventListener('beforeinstallprompt', handler)
      return () => window.removeEventListener('beforeinstallprompt', handler)
    }

    if (p === 'ios') {
      setShow(true)
    }
  }, [])

  function dismiss() {
    sessionStorage.setItem(DISMISSED_KEY, '1')
    setShow(false)
    setShowIosSteps(false)
  }

  async function handleInstall() {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') dismiss()
    else dismiss()
  }

  if (!show) return null

  return (
    <>
      {/* Banner */}
      <div className="fixed left-0 right-0 top-0 z-50 border-b border-[#3D2020] bg-[#0A0404]/98 px-4 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#D97706]">
            <span className="text-xs font-bold text-[#1C0D0D]">V</span>
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-[#F5EDD0]">Add VOADI to your home screen</p>
            <p className="text-[10px] text-[#8B7B6B]">Get quick access — works offline too</p>
          </div>
          <div className="flex items-center gap-2">
            {platform === 'android' && (
              <button
                onClick={handleInstall}
                className="flex items-center gap-1.5 rounded-full bg-[#D97706] px-3 py-1.5 text-xs font-bold text-[#1C0D0D]"
              >
                <Download size={11} />
                Install
              </button>
            )}
            {platform === 'ios' && (
              <button
                onClick={() => setShowIosSteps(v => !v)}
                className="flex items-center gap-1.5 rounded-full bg-[#D97706] px-3 py-1.5 text-xs font-bold text-[#1C0D0D]"
              >
                <Share size={11} />
                How to
              </button>
            )}
            <button
              onClick={dismiss}
              className="rounded-full p-1.5 text-[#5C4040] hover:text-[#8B7B6B]"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* iOS steps — inline expansion */}
        {platform === 'ios' && showIosSteps && (
          <div className="mx-auto mt-3 max-w-lg space-y-2 border-t border-[#2A1515] pt-3">
            <Step n={1} icon={<Share size={13} />} text='Tap the Share button in Safari — the box with an arrow pointing up' />
            <Step n={2} icon={<Plus size={13} />} text='"Add to Home Screen"' />
            <Step n={3} text='Tap "Add" in the top-right corner' />
          </div>
        )}
      </div>

      {/* Spacer so header isn't hidden behind the banner */}
      <div className={`${showIosSteps ? 'h-36' : 'h-16'} shrink-0`} />
    </>
  )
}

function Step({ n, icon, text }: { n: number; icon?: React.ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-2.5 text-xs text-[#A89080]">
      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#2A1515] text-[10px] font-bold text-[#D97706]">
        {n}
      </span>
      {icon && <span className="mt-0.5 text-[#D97706]">{icon}</span>}
      <span>{text}</span>
    </div>
  )
}
