export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { events, petitions, helpPosts } from '@/lib/db/schema'
import { desc, gte } from 'drizzle-orm'
import { CalendarDays, FileText, Users, MapPin } from 'lucide-react'

export const metadata = { title: 'Feed — VOADI' }

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}

const catLabel: Record<string, string> = {
  housing: 'Housing',
  legal: 'Legal',
  medical: 'Medical',
  jobs: 'Jobs',
  other: 'Other',
}

export default async function FeedPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  const [recentEvents, recentPetitions, recentHelp] = await Promise.all([
    db.select().from(events)
      .where(gte(events.startsAt, new Date()))
      .orderBy(events.startsAt)
      .limit(5),
    db.select().from(petitions)
      .orderBy(desc(petitions.createdAt))
      .limit(5),
    db.select().from(helpPosts)
      .orderBy(desc(helpPosts.createdAt))
      .limit(5),
  ])

  const greeting = getGreeting()
  const firstName = session?.user.name?.split(' ')[0] ?? 'there'

  return (
    <div className="py-2">
      {/* Greeting banner */}
      <div className="relative mb-5 overflow-hidden rounded-2xl bg-[#111827] px-5 py-5">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-[#D97706]/10" />
        <p className="font-serif text-lg font-bold leading-snug text-white">
          Good {greeting},<br />
          <span className="text-[#D97706]">{firstName}.</span>
        </p>
        <p className="mt-1.5 text-xs text-white/50">
          {recentEvents.length} upcoming event{recentEvents.length !== 1 ? 's' : ''} this week
        </p>
        <Link
          href="/events"
          className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#D97706] px-3 py-1.5 text-xs font-bold text-white"
        >
          <CalendarDays size={11} aria-hidden="true" />
          View events
        </Link>
      </div>

      {/* Events section */}
      {recentEvents.length > 0 && (
        <div className="mb-5">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF]">Upcoming events</h2>
            <Link href="/events" className="text-xs font-semibold text-[#D97706]">See all →</Link>
          </div>
          <div className="space-y-2">
            {recentEvents.map(ev => {
              const eventDateShort = ev.startsAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
              return (
                <Link
                  key={ev.id}
                  href={`/events/${ev.id}`}
                  className="flex gap-3 rounded-xl border border-[#E5E7EB] bg-white p-3.5 transition-colors hover:border-[#D97706]/50"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FEF3C7] text-[#92400E]">
                    <CalendarDays size={14} aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-[#92400E]">Event</span>
                      <span className="ml-auto text-[10px] text-[#9CA3AF]">{eventDateShort}</span>
                    </div>
                    <p className="text-sm font-semibold leading-snug text-[#111827]">{ev.title}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-[#6B7280]">
                      <MapPin size={10} aria-hidden="true" /> {ev.county}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Petitions section */}
      {recentPetitions.length > 0 && (
        <div className="mb-5">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF]">Active petitions</h2>
            <Link href="/petitions" className="text-xs font-semibold text-[#D97706]">See all →</Link>
          </div>
          <div className="space-y-2">
            {recentPetitions.map(p => (
              <Link
                key={p.id}
                href={`/petitions/${p.id}`}
                className="flex gap-3 rounded-xl border border-[#E5E7EB] bg-white p-3.5 transition-colors hover:border-[#D97706]/50"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#DBEAFE] text-[#1E40AF]">
                  <FileText size={14} aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-[#1E40AF]">Petition</span>
                    <span className="ml-auto text-[10px] font-semibold text-[#D97706]">{p.signatureCount.toLocaleString('en-GB')} signed</span>
                  </div>
                  <p className="text-sm font-semibold leading-snug text-[#111827]">{p.title}</p>
                  <p className="mt-0.5 text-xs text-[#6B7280]">Target: {p.target}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Help section */}
      {recentHelp.length > 0 && (
        <div className="mb-5">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF]">Community help</h2>
            <Link href="/help" className="text-xs font-semibold text-[#D97706]">See all →</Link>
          </div>
          <div className="space-y-2">
            {recentHelp.map(h => (
              <Link
                key={h.id}
                href="/help"
                className="flex gap-3 rounded-xl border border-[#E5E7EB] bg-white p-3.5 transition-colors hover:border-[#D97706]/50"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#D1FAE5] text-[#065F46]">
                  <Users size={14} aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-[#065F46]">Help</span>
                    <span className="ml-auto rounded-full bg-[#F3F4F6] px-2 py-0.5 text-[10px] font-medium text-[#4B5563]">{catLabel[h.category] ?? h.category}</span>
                  </div>
                  <p className="text-sm font-semibold leading-snug text-[#111827]">{h.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {recentEvents.length === 0 && recentPetitions.length === 0 && recentHelp.length === 0 && (
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-8 text-center">
          <p className="text-sm text-[#4B5563]">Nothing yet — be the first to post an event or petition.</p>
        </div>
      )}
    </div>
  )
}
