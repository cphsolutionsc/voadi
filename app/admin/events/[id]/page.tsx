export const dynamic = 'force-dynamic'
import { notFound } from 'next/navigation'
import { requireAdmin } from '@/app/admin/admin-guard'
import { db } from '@/lib/db'
import { events, townHalls, eventRsvps } from '@/lib/db/schema'
import { eq, count } from 'drizzle-orm'
import { TownHallControls } from './town-hall-controls'
import { Video, MapPin, CalendarDays } from 'lucide-react'

export default async function AdminEventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const { id } = await params

  const [event] = await db.select().from(events).where(eq(events.id, id))
  if (!event) notFound()

  const [th] = event.eventType === 'virtual'
    ? await db.select().from(townHalls).where(eq(townHalls.eventId, id))
    : [undefined]

  const [{ value: rsvpCount }] = await db
    .select({ value: count() })
    .from(eventRsvps)
    .where(eq(eventRsvps.eventId, id))

  const date = event.startsAt.toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
  const time = event.startsAt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <div className="mb-2 flex flex-wrap gap-2">
          <span className="rounded-full bg-[#E5E7EB] px-3 py-1 text-xs text-[#D97706]">{event.county}</span>
          {event.eventType === 'virtual' && (
            <span className="rounded-full bg-[#DBEAFE] px-3 py-1 text-xs font-semibold text-[#1D4ED8]">Virtual</span>
          )}
          <span className="rounded-full border border-[#E5E7EB] px-3 py-1 text-xs text-[#4B5563]">
            {rsvpCount} RSVP{rsvpCount !== 1 ? 's' : ''}
          </span>
        </div>
        <h1 className="text-xl font-bold text-[#111827]">{event.title}</h1>
      </div>

      <div className="space-y-2 rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] p-4">
        <div className="flex items-start gap-3">
          <CalendarDays size={15} className="mt-0.5 shrink-0 text-[#D97706]" aria-hidden="true" />
          <span className="text-sm text-[#4B5563]">{date} at {time}</span>
        </div>
        <div className="flex items-start gap-3">
          {event.eventType === 'virtual' ? (
            <Video size={15} className="mt-0.5 shrink-0 text-[#D97706]" aria-hidden="true" />
          ) : (
            <MapPin size={15} className="mt-0.5 shrink-0 text-[#D97706]" aria-hidden="true" />
          )}
          <span className="text-sm text-[#4B5563]">
            {event.eventType === 'virtual' ? 'Virtual (online)' : event.location}
          </span>
        </div>
      </div>

      {event.eventType === 'virtual' && th && (
        <TownHallControls eventId={id} townHall={th} />
      )}

      <div className="rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] p-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">Description</p>
        <p className="text-sm leading-relaxed text-[#4B5563]">{event.description}</p>
      </div>
    </div>
  )
}
