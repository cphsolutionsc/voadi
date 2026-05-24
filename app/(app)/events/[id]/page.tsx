export const dynamic = 'force-dynamic'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { events, eventRsvps, townHalls } from '@/lib/db/schema'
import { eq, and, count } from 'drizzle-orm'
import { RsvpButton } from './rsvp-button'
import { CalendarDays, MapPin, Video, Clock } from 'lucide-react'

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth.api.getSession({ headers: await headers() })

  const [event] = await db.select().from(events).where(eq(events.id, id))
  if (!event) notFound()

  const [th] = event.eventType === 'virtual'
    ? await db.select().from(townHalls).where(eq(townHalls.eventId, id))
    : [undefined]

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
        <span className="rounded-full bg-[#E5E7EB] px-3 py-1 text-xs text-[#D97706]">{event.county}</span>
        <span className="rounded-full border border-[#E5E7EB] px-3 py-1 text-xs text-[#4B5563]">{rsvpCount} attending</span>
      </div>

      <h1 className="mb-4 text-xl font-bold leading-snug text-[#111827]">{event.title}</h1>

      <div className="mb-6 space-y-2 rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] p-4">
        <div className="flex items-start gap-3">
          <CalendarDays size={16} className="mt-0.5 shrink-0 text-[#D97706]" aria-hidden="true" />
          <span className="text-sm text-[#111827]">{date} at {time}</span>
        </div>
        <div className="flex items-start gap-3">
          {event.eventType === 'virtual' ? (
            <Video size={16} className="mt-0.5 shrink-0 text-[#D97706]" aria-hidden="true" />
          ) : (
            <MapPin size={16} className="mt-0.5 shrink-0 text-[#D97706]" aria-hidden="true" />
          )}
          <span className="text-sm text-[#111827]">
            {event.eventType === 'virtual' ? 'Virtual (online)' : event.location}
          </span>
        </div>
      </div>

      {event.eventType === 'virtual' && th && (
        <div className="mb-6">
          {th.townHallStatus === 'idle' && (
            <div className="flex items-center gap-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3">
              <Clock size={14} className="shrink-0 text-[#D97706]" aria-hidden="true" />
              <p className="text-sm text-[#4B5563]">
                This is a virtual town hall.{' '}
                {event.startsAt > new Date()
                  ? `Starts ${event.startsAt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} on ${event.startsAt.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}.`
                  : 'Starting soon — check back shortly.'}
              </p>
            </div>
          )}

          {th.townHallStatus === 'live' && session && (
            <a
              href={`/events/${id}/room`}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#D97706] py-3.5 text-sm font-bold text-[#111827] transition-opacity hover:opacity-90"
            >
              <Video size={16} aria-hidden="true" />
              Join call
            </a>
          )}

          {th.townHallStatus === 'live' && !session && (
            <a
              href="/login"
              className="flex w-full items-center justify-center rounded-xl bg-[#D97706] py-3.5 text-sm font-bold text-[#111827] transition-opacity hover:opacity-90"
            >
              Sign in to join the call
            </a>
          )}

          {th.townHallStatus === 'ended' && th.summary && (
            <div className="rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] p-4">
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-[#D97706]">Meeting Summary</p>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#4B5563]">{th.summary}</p>
            </div>
          )}

          {th.townHallStatus === 'ended' && !th.summary && (
            <div className="flex items-center gap-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3">
              <Clock size={14} className="shrink-0 text-[#9CA3AF]" aria-hidden="true" />
              <p className="text-sm text-[#6B7280]">This call has ended. The summary will be sent to members shortly.</p>
            </div>
          )}
        </div>
      )}

      <p className="mb-8 text-sm leading-relaxed text-[#6B7280]">{event.description}</p>

      {session && (
        <RsvpButton eventId={id} hasRsvpd={hasRsvpd} />
      )}
      {!session && (
        <p className="text-sm text-[#4B5563]">
          <a href="/login" className="text-[#D97706] underline underline-offset-2">Sign in</a> to RSVP for this event.
        </p>
      )}
    </div>
  )
}
