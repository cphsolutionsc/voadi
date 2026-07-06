export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { db } from '@/lib/db'
import { petitions, events, helpPosts } from '@/lib/db/schema'
import { ilike } from 'drizzle-orm'
import { SearchInput } from '@/components/search/search-input'
import { FileText, CalendarDays, Users } from 'lucide-react'

export const metadata = { title: 'Search — VOADI' }

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const query = q?.trim() ?? ''

  const [matchingPetitions, matchingEvents, matchingHelp] = query.length >= 2
    ? await Promise.all([
        db.select().from(petitions).where(ilike(petitions.title, `%${query}%`)).limit(10),
        db.select().from(events).where(ilike(events.title, `%${query}%`)).limit(10),
        db.select().from(helpPosts).where(ilike(helpPosts.title, `%${query}%`)).limit(10),
      ])
    : [[], [], []] as [typeof petitions.$inferSelect[], typeof events.$inferSelect[], typeof helpPosts.$inferSelect[]]

  const total = matchingPetitions.length + matchingEvents.length + matchingHelp.length

  return (
    <div className="py-2">
      <h1 className="mb-4 text-lg font-bold text-[#111827]">Search</h1>

      <div className="mb-5">
        <SearchInput initialQuery={query} />
      </div>

      {query.length >= 2 && (
        <p className="mb-4 text-xs text-[#6B7280]">
          {total} result{total !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
        </p>
      )}

      {query.length < 2 && (
        <div className="space-y-1 pt-2">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#9CA3AF]">Browse</p>
          {[
            { href: '/events',    label: 'Upcoming Events',    Icon: CalendarDays, bg: 'bg-[#FEF3C7]', text: 'text-[#92400E]' },
            { href: '/petitions', label: 'Active Petitions',   Icon: FileText,     bg: 'bg-[#DBEAFE]', text: 'text-[#1E40AF]' },
            { href: '/help',      label: 'Community Help Hub', Icon: Users,        bg: 'bg-[#D1FAE5]', text: 'text-[#065F46]' },
          ].map(({ href, label, Icon, bg, text }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-xl border border-[#E5E7EB] bg-white p-3.5 transition-colors hover:border-[#D97706]/50"
            >
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${bg} ${text}`}>
                <Icon size={14} aria-hidden="true" />
              </div>
              <span className="text-sm font-semibold text-[#111827]">{label}</span>
            </Link>
          ))}
        </div>
      )}

      {matchingPetitions.length > 0 && (
        <section className="mb-5">
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-[#9CA3AF]">
            Petitions · {matchingPetitions.length}
          </h2>
          <div className="space-y-2">
            {matchingPetitions.map(p => (
              <Link key={p.id} href={`/petitions/${p.id}`}
                className="flex gap-3 rounded-xl border border-[#E5E7EB] bg-white p-3.5 transition-colors hover:border-[#D97706]/50">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#DBEAFE] text-[#1E40AF]">
                  <FileText size={14} aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-snug text-[#111827]">{p.title}</p>
                  <p className="mt-0.5 text-xs text-[#6B7280]">{p.signatureCount.toLocaleString('en-GB')} signatures</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {matchingEvents.length > 0 && (
        <section className="mb-5">
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-[#9CA3AF]">
            Events · {matchingEvents.length}
          </h2>
          <div className="space-y-2">
            {matchingEvents.map(e => (
              <Link key={e.id} href={`/events/${e.id}`}
                className="flex gap-3 rounded-xl border border-[#E5E7EB] bg-white p-3.5 transition-colors hover:border-[#D97706]/50">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FEF3C7] text-[#92400E]">
                  <CalendarDays size={14} aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-snug text-[#111827]">{e.title}</p>
                  <p className="mt-0.5 text-xs text-[#6B7280]">
                    {e.county} · {e.startsAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {matchingHelp.length > 0 && (
        <section className="mb-5">
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-[#9CA3AF]">
            Help Hub · {matchingHelp.length}
          </h2>
          <div className="space-y-2">
            {matchingHelp.map(h => (
              <Link key={h.id} href="/help"
                className="flex gap-3 rounded-xl border border-[#E5E7EB] bg-white p-3.5 transition-colors hover:border-[#D97706]/50">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#D1FAE5] text-[#065F46]">
                  <Users size={14} aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-snug text-[#111827]">{h.title}</p>
                  <p className="mt-0.5 text-xs capitalize text-[#6B7280]">{h.category}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {query.length >= 2 && total === 0 && (
        <div className="rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] p-8 text-center">
          <p className="mb-1 text-sm font-semibold text-[#111827]">No results</p>
          <p className="text-xs text-[#6B7280]">Try a different word or browse below.</p>
        </div>
      )}
    </div>
  )
}
