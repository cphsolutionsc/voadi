export const dynamic = 'force-dynamic'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { events, eventRsvps } from '@/lib/db/schema'
import { eq, and, count } from 'drizzle-orm'
import { RsvpButton } from './rsvp-button'
import { CalendarDays, MapPin } from 'lucide-react'

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth.api.getSession({ headers: await headers() })

  const [event] = await db.select().from(events).where(eq(events.id, id))
  if (!event) notFound()

  const [{ value: rsvpCount }] = await db
    .select({ value: count() })
    .from(eventRsvps)
    .where(eq(eventRsvps.eventId, id))

  const hasRsvpd = session
    ? (await db.select().from(eventRsvps).where(
        and(eq(eventRsvps.eventId, id), eq(eventRsvps.userId, session.user.id))
      )).length > 0
    : false

  const date = event.startsAt.toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
  const time = event.startsAt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="py-2">
      <div className="mb-2 flex flex-wrap gap-2">
        <span className="rounded-full bg-[#2A1515] px-3 py-1 text-xs text-[#D97706]">{event.county}</span>
        <span className="rounded-full border border-[#2A1515] px-3 py-1 text-xs text-[#8B7B6B]">{rsvpCount} attending</span>
      </div>

      <h1 className="mb-4 text-xl font-bold leading-snug text-white">{event.title}</h1>

      <div className="mb-6 space-y-2 rounded-xl border border-[#2A1515] bg-[#1E0E0E] p-4">
        <div className="flex items-start gap-3">
          <CalendarDays size={16} className="mt-0.5 shrink-0 text-[#D97706]" aria-hidden="true" />
          <span className="text-sm text-[#F5EDD0]">{date} at {time}</span>
        </div>
        <div className="flex items-start gap-3">
          <MapPin size={16} className="mt-0.5 shrink-0 text-[#D97706]" aria-hidden="true" />
          <span className="text-sm text-[#F5EDD0]">{event.location}</span>
        </div>
      </div>

      <p className="mb-8 text-sm leading-relaxed text-[#A89080]">{event.description}</p>

      {session && (
        <RsvpButton eventId={id} hasRsvpd={hasRsvpd} />
      )}
      {!session && (
        <p className="text-sm text-[#8B7B6B]">
          <a href="/login" className="text-[#D97706] underline underline-offset-2">Sign in</a> to RSVP for this event.
        </p>
      )}
    </div>
  )
}
