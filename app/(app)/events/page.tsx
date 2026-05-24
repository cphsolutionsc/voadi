export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { db } from '@/lib/db'
import { events, townHalls } from '@/lib/db/schema'
import { and, eq, gte } from 'drizzle-orm'
import { MapPin, Video } from 'lucide-react'

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

  const allEvents = await db
    .select({ event: events, th: townHalls })
    .from(events)
    .leftJoin(townHalls, eq(townHalls.eventId, events.id))
    .where(
      county
        ? and(gte(events.startsAt, new Date()), eq(events.county, county))
        : gte(events.startsAt, new Date()),
    )
    .orderBy(events.startsAt)
    .limit(50)

  const [featured, ...rest] = allEvents

  return (
    <div className="py-2">
      <div className="mb-1 flex items-center justify-between">
        <h1 className="text-lg font-bold text-[#111827]">Events</h1>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[#E5E7EB] px-3 py-1 text-xs font-medium text-[#D97706]">
            {allEvents.length} upcoming
          </span>
          <Link href="/events/new"
            className="shrink-0 rounded-full bg-[#D97706] px-3 py-1.5 text-xs font-bold text-white">
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
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-10 text-center">
          <p className="mb-1 text-sm font-semibold text-[#111827]">No upcoming events</p>
          <p className="text-xs text-[#4B5563]">Check back soon — events are added regularly.</p>
        </div>
      ) : (
        <>
          {/* Featured card */}
          <Link
            href={`/events/${featured.event.id}`}
            className="mb-3 block overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white transition-colors hover:border-[#D97706]/50"
          >
            {/* Dark header area */}
            <div className="relative flex h-28 items-end bg-gradient-to-br from-[#111827] to-[#1f2937] p-4">
              <span className="absolute left-3 top-3 rounded-full bg-[#FEF3C7] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#92400E]">
                Featured
              </span>
              {/* Date badge top-right */}
              <div className="absolute right-3 top-3 rounded-xl bg-white/90 px-2.5 py-1.5 text-center">
                <p className="text-[9px] font-bold uppercase tracking-wide text-[#D97706]">
                  {featured.event.startsAt.toLocaleDateString('en-GB', { month: 'short' })}
                </p>
                <p className="text-xl font-black leading-none text-[#111827]">
                  {featured.event.startsAt.toLocaleDateString('en-GB', { day: 'numeric' })}
                </p>
              </div>
              <h2 className="pr-16 font-serif text-base font-bold leading-snug text-white">
                {featured.event.title}
              </h2>
            </div>
            {/* Footer row */}
            <div className="flex items-center gap-2 px-4 py-3 text-xs text-[#6B7280]">
              {featured.event.eventType === 'virtual' ? (
                <Video size={11} aria-hidden="true" className="text-[#D97706]" />
              ) : (
                <MapPin size={11} aria-hidden="true" />
              )}
              <span className="truncate">
                {featured.event.eventType === 'virtual' ? 'Virtual' : featured.event.location}
              </span>
              {featured.th?.townHallStatus === 'live' && (
                <span className="ml-1 rounded-full bg-[#D97706] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#111827]">
                  Live now
                </span>
              )}
              <span className="ml-auto font-bold text-[#D97706]">
                {featured.event.eventType === 'virtual' ? 'Join →' : 'RSVP →'}
              </span>
            </div>
          </Link>

          {/* Rest as date-block list */}
          {rest.length > 0 && (
            <div className="space-y-2">
              {rest.map(({ event: ev, th }) => (
                <Link
                  key={ev.id}
                  href={`/events/${ev.id}`}
                  className="flex gap-3 rounded-xl border border-[#E5E7EB] bg-white p-3.5 transition-colors hover:border-[#D97706]/50"
                >
                  {/* Amber date block */}
                  <div className="flex w-11 shrink-0 flex-col items-center justify-center rounded-xl bg-[#FEF3C7] py-2">
                    <span className="text-[9px] font-bold uppercase tracking-wide text-[#92400E]">
                      {ev.startsAt.toLocaleDateString('en-GB', { month: 'short' })}
                    </span>
                    <span className="text-xl font-black leading-none text-[#92400E]">
                      {ev.startsAt.toLocaleDateString('en-GB', { day: 'numeric' })}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold leading-snug text-[#111827]">{ev.title}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-[#6B7280]">
                      {ev.eventType === 'virtual' ? (
                        <Video size={10} aria-hidden="true" className="text-[#D97706]" />
                      ) : (
                        <MapPin size={10} aria-hidden="true" />
                      )}
                      {ev.eventType === 'virtual' ? 'Virtual' : ev.location}
                      {' · '}
                      {ev.startsAt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                      {th?.townHallStatus === 'live' && (
                        <span className="ml-1 rounded-full bg-[#D97706] px-1.5 py-0.5 text-[9px] font-bold uppercase text-[#111827]">
                          Live
                        </span>
                      )}
                    </p>
                  </div>
                  <span className="shrink-0 self-start rounded-full bg-[#E5E7EB] px-2 py-0.5 text-[10px] font-medium text-[#4B5563]">
                    {ev.county}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
