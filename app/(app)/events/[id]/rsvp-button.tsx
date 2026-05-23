'use client'

import { useTransition } from 'react'
import { rsvpEvent, cancelRsvp } from '@/lib/actions'

export function RsvpButton({ eventId, hasRsvpd }: { eventId: string; hasRsvpd: boolean }) {
  const [pending, startTransition] = useTransition()

  function toggle() {
    startTransition(() => {
      if (hasRsvpd) cancelRsvp(eventId)
      else rsvpEvent(eventId)
    })
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      className={`w-full rounded-xl py-3.5 text-sm font-bold transition-colors disabled:opacity-60 ${
        hasRsvpd
          ? 'border border-[#9CA3AF] text-[#111827] hover:border-red-900 hover:text-red-400'
          : 'bg-[#D97706] text-[#111827] hover:opacity-90'
      }`}
    >
      {pending ? 'Updating…' : hasRsvpd ? 'Cancel RSVP' : 'RSVP — I\'ll be there'}
    </button>
  )
}
