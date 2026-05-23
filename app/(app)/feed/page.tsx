export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { events, petitions, helpPosts } from '@/lib/db/schema'
import { desc, gte } from 'drizzle-orm'
import { CalendarDays, FileText, Users, PenLine, MapPin } from 'lucide-react'

export const metadata = { title: 'Feed — VOADI' }

function timeAgo(date: Date) {
  const secs = Math.floor((Date.now() - date.getTime()) / 1000)
  if (secs < 60) return 'just now'
  const mins = Math.floor(secs / 60)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
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

  type FeedItem =
    | { type: 'event';    date: Date; id: string; title: string; county: string; startsAt: Date }
    | { type: 'petition'; date: Date; id: string; title: string; signatureCount: number }
    | { type: 'help';     date: Date; id: string; title: string; category: string }

  const feed: FeedItem[] = [
    ...recentEvents.map(e => ({
      type: 'event' as const, date: e.createdAt,
      id: e.id, title: e.title, county: e.county, startsAt: e.startsAt,
    })),
    ...recentPetitions.map(p => ({
      type: 'petition' as const, date: p.createdAt,
      id: p.id, title: p.title, signatureCount: p.signatureCount,
    })),
    ...recentHelp.map(h => ({
      type: 'help' as const, date: h.createdAt,
      id: h.id, title: h.title, category: h.category,
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime())

  return (
    <div className="py-2">
      <div className="mb-5">
        <h1 className="text-lg font-bold text-white">
          Welcome back{session?.user.name ? `, ${session.user.name.split(' ')[0]}` : ''}
        </h1>
        <p className="text-sm text-[#8B7B6B]">Here&apos;s what&apos;s happening in your community.</p>
      </div>

      {/* Quick actions */}
      <div className="mb-6 grid grid-cols-2 gap-3">
        <Link href="/events" className="rounded-xl border border-[#2A1515] bg-[#1E0E0E] p-4 transition-colors hover:border-[#D97706]">
          <div className="mb-2 text-[#D97706]">
            <CalendarDays size={20} aria-hidden="true" />
          </div>
          <p className="text-sm font-semibold text-white">Upcoming events</p>
          <p className="text-xs text-[#8B7B6B]">{recentEvents.length} near you</p>
        </Link>
        <Link href="/petitions" className="rounded-xl border border-[#2A1515] bg-[#1E0E0E] p-4 transition-colors hover:border-[#D97706]">
          <div className="mb-2 text-[#D97706]">
            <FileText size={20} aria-hidden="true" />
          </div>
          <p className="text-sm font-semibold text-white">Open petitions</p>
          <p className="text-xs text-[#8B7B6B]">{recentPetitions.length} active</p>
        </Link>
      </div>

      {/* Feed */}
      {feed.length === 0 ? (
        <div className="rounded-2xl border border-[#2A1515] bg-[#1E0E0E] p-8 text-center">
          <p className="text-sm text-[#8B7B6B]">Nothing yet — be the first to post an event or petition.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {feed.map(item => (
            <FeedCard key={`${item.type}-${item.id}`} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}

function FeedCard({ item }: { item: ReturnType<typeof buildFeedItem> }) {
  if (item.type === 'event') {
    const date = item.startsAt.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
    return (
      <Link href={`/events/${item.id}`} className="flex gap-4 rounded-xl border border-[#2A1515] bg-[#1E0E0E] p-4 transition-colors hover:border-[#4A2828]">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#2A1515] text-[#D97706]">
          <CalendarDays size={16} aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">{item.title}</p>
          <p className="text-xs text-[#8B7B6B]">{date} · {item.county}</p>
        </div>
        <span className="shrink-0 rounded-full bg-[#2A1515] px-2 py-0.5 text-xs text-[#D97706]">Event</span>
      </Link>
    )
  }
  if (item.type === 'petition') {
    return (
      <Link href={`/petitions/${item.id}`} className="flex gap-4 rounded-xl border border-[#2A1515] bg-[#1E0E0E] p-4 transition-colors hover:border-[#4A2828]">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#2A1515] text-[#16a34a]">
          <PenLine size={16} aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">{item.title}</p>
          <p className="text-xs text-[#8B7B6B]">{item.signatureCount.toLocaleString('en-GB')} signatures</p>
        </div>
        <span className="shrink-0 rounded-full bg-[#1a2e1a] px-2 py-0.5 text-xs text-[#16a34a]">Petition</span>
      </Link>
    )
  }
  const catLabel: Record<string, string> = { housing: 'Housing', legal: 'Legal', medical: 'Medical', jobs: 'Jobs', other: 'Other' }
  return (
    <Link href={`/help`} className="flex gap-4 rounded-xl border border-[#2A1515] bg-[#1E0E0E] p-4 transition-colors hover:border-[#4A2828]">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#2A1515] text-[#A89080]">
        <Users size={16} aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">{item.title}</p>
        <p className="text-xs text-[#8B7B6B]">{catLabel[item.category] ?? item.category} · Help Hub</p>
      </div>
      <span className="shrink-0 rounded-full border border-[#2A1515] px-2 py-0.5 text-xs text-[#8B7B6B]">Help</span>
    </Link>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildFeedItem(item: any) { return item }
