export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { db } from '@/lib/db'
import { events } from '@/lib/db/schema'
import { and, eq, gte } from 'drizzle-orm'
import { CalendarDays, MapPin } from 'lucide-react'

export const metadata = { title: 'Events — VOADI' }

const COUNTIES = [
  'Carlow', 'Cavan', 'Clare', 'Cork', 'Donegal', 'Dublin', 'Galway', 'Kerry',
  'Kildare', 'Kilkenny', 'Laois', 'Leitrim', 'Limerick', 'Longford', 'Louth', 'Mayo', 'Meath',
  'Monaghan', 'Offaly', 'Roscommon', 'Sligo', 'Tipperary', 'Waterford', 'Westmeath', 'Wexford', 'Wicklow',
]

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ county?: string }>
}) {
  const { county } = await searchParams

  const allEvents = await db.select().from(events)
    .where(
      county
        ? and(gte(events.startsAt, new Date()), eq(events.county, county))
        : gte(events.startsAt, new Date())
    )
    .orderBy(events.startsAt)
    .limit(50)

  return (
    <div className="py-2">
      <div className="mb-1 flex items-center justify-between">
        <h1 className="text-lg font-bold text-[#111827]">Events</h1>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[#E5E7EB] px-3 py-1 text-xs font-medium text-[#D97706]">
            {allEvents.length} upcoming
          </span>
          <Link href="/events/new"
            className="shrink-0 rounded-full bg-[#D97706] px-3 py-1.5 text-xs font-bold text-[#111827]">
            + New
          </Link>
        </div>
      </div>
      <p className="mb-4 text-xs leading-relaxed text-[#4B5563]">
        Community gatherings, town halls, and mobilisation events across Ireland.
      </p>

      <div className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none">
        <Link
          href="/events"
          className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
            !county ? 'bg-[#D97706] text-[#111827]' : 'border border-[#E5E7EB] text-[#4B5563]'
          }`}
        >
          All
        </Link>
        {COUNTIES.map(c => (
          <Link
            key={c}
            href={`/events?county=${c}`}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              county === c ? 'bg-[#D97706] text-[#111827]' : 'border border-[#E5E7EB] text-[#4B5563]'
            }`}
          >
            {c}
          </Link>
        ))}
      </div>

      {allEvents.length === 0 ? (
        <div className="rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] p-10 text-center">
          <p className="mb-1 text-sm font-semibold text-[#111827]">No upcoming events</p>
          <p className="text-xs text-[#4B5563]">Check back soon — events are added regularly.</p>
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
                className="block rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] p-4 transition-colors hover:border-[#D97706]/50"
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <h2 className="font-semibold text-[#111827]">{ev.title}</h2>
                  <span className="shrink-0 rounded-full bg-[#E5E7EB] px-2 py-0.5 text-[10px] font-medium text-[#D97706]">{ev.county}</span>
                </div>
                <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-[#6B7280]">{ev.description}</p>
                <div className="flex items-center gap-4 text-xs text-[#4B5563]">
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
