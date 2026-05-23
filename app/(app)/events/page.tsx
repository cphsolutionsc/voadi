export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { db } from '@/lib/db'
import { events } from '@/lib/db/schema'
import { gte } from 'drizzle-orm'
import { CalendarDays, MapPin } from 'lucide-react'

export const metadata = { title: 'Events — VOADI' }

export default async function EventsPage() {
  const allEvents = await db.select().from(events)
    .where(gte(events.startsAt, new Date()))
    .orderBy(events.startsAt)

  return (
    <div className="py-2">
      <div className="mb-1 flex items-center justify-between">
        <h1 className="text-lg font-bold text-white">Events</h1>
        <span className="rounded-full bg-[#2A1515] px-3 py-1 text-xs font-medium text-[#D97706]">
          {allEvents.length} upcoming
        </span>
      </div>
      <p className="mb-5 text-xs leading-relaxed text-[#8B7B6B]">
        Community gatherings, town halls, and mobilisation events across Ireland.
      </p>

      {allEvents.length === 0 ? (
        <div className="rounded-xl border border-[#2A1515] bg-[#1E0E0E] p-10 text-center">
          <p className="mb-1 text-sm font-semibold text-[#F5EDD0]">No upcoming events</p>
          <p className="text-xs text-[#8B7B6B]">Check back soon — events are added regularly.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {allEvents.map(ev => {
            const date = ev.startsAt.toLocaleDateString('en-GB', {
              weekday: 'short', day: 'numeric', month: 'short',
            })
            const time = ev.startsAt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
            return (
              <Link
                key={ev.id}
                href={`/events/${ev.id}`}
                className="block rounded-xl border border-[#2A1515] bg-[#1E0E0E] p-4 transition-colors hover:border-[#D97706]/50"
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <h2 className="font-semibold text-white">{ev.title}</h2>
                  <span className="shrink-0 rounded-full bg-[#2A1515] px-2 py-0.5 text-[10px] font-medium text-[#D97706]">{ev.county}</span>
                </div>
                <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-[#A89080]">{ev.description}</p>
                <div className="flex items-center gap-4 text-xs text-[#8B7B6B]">
                  <span className="flex items-center gap-1">
                    <CalendarDays size={11} aria-hidden="true" />
                    {date} at {time}
                  </span>
                  <span className="flex items-center gap-1 truncate">
                    <MapPin size={11} aria-hidden="true" />
                    {ev.location}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
