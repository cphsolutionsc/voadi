'use client'

import { useEffect, useState } from 'react'
import { X, Share, Plus } from 'lucide-react'

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

function HarpV({ size = 28 }: { size?: number }) {
  const w = Math.round(size * 0.68)
  return (
    <svg width={w} height={size} viewBox="0 0 17 25" fill="none" aria-hidden="true">
      <path d="M1.5 1.5 L8.5 23.5" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M15.5 1.5 C17.5 7 16 16 8.5 23.5" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M1.5 1.5 C3.5 -1.5 13.5 -1.5 15.5 1.5" stroke="#D97706" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <line x1="3.5" y1="7.5"  x2="14.5" y2="7"   stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" opacity="0.95" />
      <line x1="5.5" y1="13"   x2="13"   y2="13"   stroke="#D97706" strokeWidth="1.4" strokeLinecap="round" opacity="0.95" />
      <line x1="7.5" y1="18.5" x2="11"   y2="18.5" stroke="#D97706" strokeWidth="1.3" strokeLinecap="round" opacity="0.95" />
    </svg>
  )
}

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
    if (outcome === 'accepted' || outcome === 'dismissed') dismiss()
  }

  if (!show) return null

  return (
    <>
      <div className="fixed left-0 right-0 top-0 z-50 border-b border-[#2A1515] bg-[#0A0404]/95 backdrop-blur-2xl" style={{ WebkitBackdropFilter: 'blur(24px)' }}>
        <div className="mx-auto max-w-lg px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Logo mark */}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#3D2020] bg-[#140909]">
              <HarpV size={26} />
            </div>

            {/* Text */}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-[#F5EDD0]">
                <span className="text-[#D97706]">V</span>OADI
              </p>
              <p className="text-[10px] leading-tight text-[#5C4040]">
                Add to your home screen for quick access
              </p>
            </div>

            {/* CTA + dismiss */}
            <div className="flex shrink-0 items-center gap-2">
              {platform === 'android' && (
                <button
                  onClick={handleInstall}
                  className="rounded-full bg-[#D97706] px-4 py-1.5 text-xs font-bold text-[#1C0D0D] transition-opacity hover:opacity-90"
                >
                  Install
                </button>
              )}
              {platform === 'ios' && (
                <button
                  onClick={() => setShowIosSteps(v => !v)}
                  className="rounded-full bg-[#D97706] px-4 py-1.5 text-xs font-bold text-[#1C0D0D] transition-opacity hover:opacity-90"
                >
                  How to
                </button>
              )}
              <button
                onClick={dismiss}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-[#2A1515] text-[#3D2020] transition-colors hover:text-[#8B7B6B]"
                aria-label="Dismiss"
              >
                <X size={13} />
              </button>
            </div>
          </div>

          {/* iOS steps */}
          {platform === 'ios' && showIosSteps && (
            <div className="mt-3 space-y-2 border-t border-[#2A1515] pt-3">
              <Step n={1} icon={<Share size={11} />} text="Tap the Share button in Safari" />
              <Step n={2} icon={<Plus size={11} />} text='"Add to Home Screen"' />
              <Step n={3} text='Tap "Add" in the top-right corner' />
            </div>
          )}
        </div>
      </div>
      <div className={showIosSteps ? 'h-28' : 'h-[58px]'} />
    </>
  )
}

function Step({ n, icon, text }: { n: number; icon?: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2.5 text-[11px] text-[#A89080]">
      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#2A1515] text-[9px] font-bold text-[#D97706]">
        {n}
      </span>
      {icon && <span className="text-[#D97706]">{icon}</span>}
      <span>{text}</span>
    </div>
  )
}
