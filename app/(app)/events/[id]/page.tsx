export const dynamic = 'force-dynamic'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { events, eventRsvps } from '@/lib/db/schema'
import { eq, and, count } from 'drizzle-orm'
import { RsvpButton } from './rsvp-button'

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
          <svg width="16" height="16" className="mt-0.5 shrink-0 text-[#D97706]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span className="text-sm text-[#F5EDD0]">{date} at {time}</span>
        </div>
        <div className="flex items-start gap-3">
          <svg width="16" height="16" className="mt-0.5 shrink-0 text-[#D97706]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
          </svg>
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
