'use client'

import { useState } from 'react'
import { Bell, BellOff } from 'lucide-react'

export function PushSubscribe({ vapidPublicKey }: { vapidPublicKey: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'subscribed' | 'denied'>('idle')

  async function subscribe() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setStatus('denied')
      return
    }
    setStatus('loading')
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey,
      })
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub),
      })
      setStatus('subscribed')
    } catch {
      setStatus('denied')
    }
  }

  if (status === 'subscribed') {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-[#2A1515] bg-[#1E0E0E] px-4 py-3">
        <Bell size={14} className="text-[#D97706]" aria-hidden="true" />
        <span className="text-xs text-[#8B7B6B]">Push notifications enabled</span>
      </div>
    )
  }

  return (
    <button
      onClick={subscribe}
      disabled={status === 'loading' || status === 'denied'}
      className="flex w-full items-center gap-2 rounded-xl border border-[#2A1515] bg-[#1E0E0E] px-4 py-3 text-left transition-colors hover:border-[#D97706]/50 disabled:opacity-50"
    >
      {status === 'denied'
        ? <BellOff size={14} className="text-[#5C4040]" aria-hidden="true" />
        : <Bell size={14} className="text-[#D97706]" aria-hidden="true" />
      }
      <span className="text-xs text-[#8B7B6B]">
        {status === 'loading'
          ? 'Enabling…'
          : status === 'denied'
            ? 'Notifications blocked in browser settings'
            : 'Enable push notifications'}
      </span>
    </button>
  )
}
