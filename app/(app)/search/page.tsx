export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { db } from '@/lib/db'
import { petitions, events, helpPosts } from '@/lib/db/schema'
import { ilike } from 'drizzle-orm'
import { Search } from 'lucide-react'

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

      <form method="GET" className="mb-6">
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]" aria-hidden="true" />
          <input
            name="q"
            type="search"
            defaultValue={query}
            placeholder="Search events, petitions, help posts..."
            autoFocus
            className="w-full rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] py-3 pl-10 pr-4 text-sm text-[#111827] placeholder-[#9CA3AF] focus:border-[#D97706] focus:outline-none"
          />
        </div>
      </form>

      {query.length >= 2 && (
        <p className="mb-4 text-xs text-[#6B7280]">
          {total} result{total !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
        </p>
      )}

      {matchingPetitions.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-[#6B7280]">Petitions</h2>
          <div className="space-y-2">
            {matchingPetitions.map(p => (
              <Link key={p.id} href={`/petitions/${p.id}`}
                className="block rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] px-4 py-3 hover:border-[#D97706]/50">
                <p className="text-sm font-semibold text-[#111827]">{p.title}</p>
                <p className="text-xs text-[#6B7280]">{p.signatureCount} signatures</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {matchingEvents.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-[#6B7280]">Events</h2>
          <div className="space-y-2">
            {matchingEvents.map(e => (
              <Link key={e.id} href={`/events/${e.id}`}
                className="block rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] px-4 py-3 hover:border-[#D97706]/50">
                <p className="text-sm font-semibold text-[#111827]">{e.title}</p>
                <p className="text-xs text-[#6B7280]">{e.county} · {e.startsAt.toLocaleDateString('en-GB')}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {matchingHelp.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-[#6B7280]">Help Hub</h2>
          <div className="space-y-2">
            {matchingHelp.map(h => (
              <Link key={h.id} href="/help"
                className="block rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] px-4 py-3 hover:border-[#D97706]/50">
                <p className="text-sm font-semibold text-[#111827]">{h.title}</p>
                <p className="text-xs text-[#6B7280]">{h.category}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {query.length >= 2 && total === 0 && (
        <div className="rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] p-8 text-center">
          <p className="text-sm text-[#6B7280]">No results for &ldquo;{query}&rdquo;</p>
        </div>
      )}
    </div>
  )
}
