export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { db } from '@/lib/db'
import { events } from '@/lib/db/schema'
import { gte } from 'drizzle-orm'

export const metadata = { title: 'Events — VOADI' }

const COUNTIES = [
  'All', 'Carlow', 'Cavan', 'Clare', 'Cork', 'Donegal', 'Dublin',
  'Galway', 'Kerry', 'Kildare', 'Kilkenny', 'Laois', 'Leitrim',
  'Limerick', 'Longford', 'Louth', 'Mayo', 'Meath', 'Monaghan',
  'Offaly', 'Roscommon', 'Sligo', 'Tipperary', 'Waterford',
  'Westmeath', 'Wexford', 'Wicklow',
]

export default async function EventsPage() {
  const allEvents = await db.select().from(events)
    .where(gte(events.startsAt, new Date()))
    .orderBy(events.startsAt)

  return (
    <div className="py-2">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-lg font-bold text-white">Events</h1>
      </div>

      {allEvents.length === 0 ? (
        <div className="rounded-2xl border border-[#2A1515] bg-[#1E0E0E] p-10 text-center">
          <p className="mb-1 text-sm font-semibold text-[#F5EDD0]">No upcoming events</p>
          <p className="text-xs text-[#8B7B6B]">Check back soon — events are added regularly.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {allEvents.map(ev => {
            const date = ev.startsAt.toLocaleDateString('en-GB', {
              weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
            })
            const time = ev.startsAt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
            return (
              <Link
                key={ev.id}
                href={`/events/${ev.id}`}
                className="block rounded-xl border border-[#2A1515] bg-[#1E0E0E] p-4 transition-colors hover:border-[#4A2828]"
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <h2 className="font-semibold text-white">{ev.title}</h2>
                  <span className="shrink-0 rounded-full border border-[#2A1515] px-2 py-0.5 text-xs text-[#8B7B6B]">{ev.county}</span>
                </div>
                <p className="mb-2 line-clamp-2 text-xs leading-relaxed text-[#A89080]">{ev.description}</p>
                <div className="flex items-center gap-3 text-xs text-[#8B7B6B]">
                  <span>{date} at {time}</span>
                  <span>·</span>
                  <span className="truncate">{ev.location}</span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
