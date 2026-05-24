'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Video, Square, FileText, Mail } from 'lucide-react'

interface TownHall {
  id: string
  townHallStatus: 'idle' | 'live' | 'ended'
  egressId: string | null
  recordingR2Key: string | null
  transcript: string | null
  summary: string | null
  summarySentAt: Date | null
}

export function TownHallControls({ eventId, townHall }: { eventId: string; townHall: TownHall }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function startCall() {
    setLoading(true); setError(null)
    const res = await fetch(`/api/events/${eventId}/start`, { method: 'POST' })
    if (!res.ok) {
      const d = await res.json() as { error?: string }
      setError(d.error ?? 'Failed to start')
    }
    setLoading(false)
    router.refresh()
  }

  async function endCall() {
    setLoading(true); setError(null)
    const res = await fetch(`/api/events/${eventId}/end`, { method: 'POST' })
    if (!res.ok) {
      const d = await res.json() as { error?: string }
      setError(d.error ?? 'Failed to end')
    }
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="space-y-4 rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">Town Hall</p>
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
          townHall.townHallStatus === 'live'
            ? 'bg-[#D97706] text-[#111827]'
            : townHall.townHallStatus === 'ended'
              ? 'bg-[#E5E7EB] text-[#4B5563]'
              : 'bg-[#F3F4F6] text-[#9CA3AF]'
        }`}>
          {townHall.townHallStatus}
        </span>
      </div>

      {error && (
        <p className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-xs text-[#B91C1C]">{error}</p>
      )}

      <div className="flex gap-2">
        {townHall.townHallStatus === 'idle' && (
          <button
            onClick={startCall}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-[#D97706] px-4 py-2 text-xs font-bold text-[#111827] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <Video size={12} aria-hidden="true" />
            Start call
          </button>
        )}
        {townHall.townHallStatus === 'live' && (
          <>
            <a
              href={`/events/${eventId}/room`}
              className="flex items-center gap-2 rounded-lg border border-[#E5E7EB] px-4 py-2 text-xs font-semibold text-[#111827] transition-colors hover:border-[#D97706]"
            >
              <Video size={12} aria-hidden="true" />
              Enter room
            </a>
            <button
              onClick={endCall}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 py-2 text-xs font-bold text-[#B91C1C] transition-colors hover:bg-[#FEE2E2] disabled:opacity-50"
            >
              <Square size={12} aria-hidden="true" />
              End call
            </button>
          </>
        )}
      </div>

      {townHall.townHallStatus === 'ended' && (
        <div className="space-y-3 border-t border-[#E5E7EB] pt-3">
          {townHall.recordingR2Key && (
            <p className="flex items-center gap-2 text-xs text-[#4B5563]">
              <Video size={12} className="text-[#D97706]" aria-hidden="true" />
              Recording: <code className="rounded bg-[#F3F4F6] px-1 py-0.5 text-[10px]">{townHall.recordingR2Key}</code>
            </p>
          )}
          {townHall.summarySentAt && (
            <p className="flex items-center gap-2 text-xs text-[#4B5563]">
              <Mail size={12} className="text-[#D97706]" aria-hidden="true" />
              Summary sent {new Date(townHall.summarySentAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          )}
          {townHall.summary && (
            <details className="rounded-lg border border-[#E5E7EB]">
              <summary className="flex cursor-pointer items-center gap-2 px-3 py-2 text-xs font-semibold text-[#111827]">
                <FileText size={12} aria-hidden="true" />
                View summary
              </summary>
              <p className="whitespace-pre-wrap px-3 pb-3 pt-1 text-xs leading-relaxed text-[#4B5563]">{townHall.summary}</p>
            </details>
          )}
          {townHall.transcript && (
            <details className="rounded-lg border border-[#E5E7EB]">
              <summary className="flex cursor-pointer items-center gap-2 px-3 py-2 text-xs font-semibold text-[#111827]">
                <FileText size={12} aria-hidden="true" />
                View transcript
              </summary>
              <p className="whitespace-pre-wrap px-3 pb-3 pt-1 text-xs leading-relaxed text-[#4B5563]">{townHall.transcript}</p>
            </details>
          )}
          {!townHall.summary && !townHall.recordingR2Key && (
            <p className="text-xs text-[#9CA3AF]">Processing recording — summary will appear here once ready.</p>
          )}
        </div>
      )}
    </div>
  )
}
