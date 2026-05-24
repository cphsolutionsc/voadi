'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
} from '@livekit/components-react'
// @livekit/components-styles is not installed — import styles via your global CSS
// if needed: @import '@livekit/components-styles'; or install the package separately

interface RoomClientProps {
  eventId: string
  eventTitle: string
  isHost: boolean
}

export function RoomClient({ eventId, eventTitle: _eventTitle, isHost }: RoomClientProps) {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [wsUrl, setWsUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchToken = useCallback(async () => {
    const res = await fetch(`/api/events/${eventId}/token`, { method: 'POST' })
    if (!res.ok) {
      const data = await res.json() as { error?: string }
      setError(data.error ?? 'Failed to join call')
      return
    }
    const data = await res.json() as { token: string; wsUrl: string }
    setToken(data.token)
    setWsUrl(data.wsUrl)
  }, [eventId])

  useEffect(() => {
    fetchToken()
  }, [fetchToken])

  // Poll status every 15s — redirect when ended
  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/events/${eventId}/token`, { method: 'POST' })
      if (!res.ok) {
        const data = await res.json() as { error?: string }
        if (data.error === 'Call is not live') {
          router.push(`/events/${eventId}`)
        }
      }
    }, 15_000)
    return () => clearInterval(interval)
  }, [eventId, router])

  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
        <p className="text-center text-sm text-[#9CA3AF]">{error}</p>
        <button
          onClick={() => router.push(`/events/${eventId}`)}
          className="rounded-lg bg-[#D97706] px-4 py-2 text-sm font-bold text-[#111827]"
        >
          Back to event
        </button>
      </div>
    )
  }

  if (!token || !wsUrl) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-[#9CA3AF]">Connecting…</p>
      </div>
    )
  }

  return (
    <LiveKitRoom
      video={isHost}
      audio={isHost}
      token={token}
      serverUrl={wsUrl}
      data-lk-theme="default"
      style={{ height: '100dvh' }}
    >
      <VideoConference />
      <RoomAudioRenderer />
    </LiveKitRoom>
  )
}
