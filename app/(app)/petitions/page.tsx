export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { db } from '@/lib/db'
import { petitions } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

export const metadata = { title: 'Petitions — VOADI' }

export default async function PetitionsPage() {
  const allPetitions = await db.select().from(petitions)
    .where(eq(petitions.status, 'open'))
    .orderBy(desc(petitions.signatureCount))

  return (
    <div className="py-2">
      <div className="mb-1 flex items-center justify-between">
        <h1 className="text-lg font-bold text-white">Petitions</h1>
        <span className="rounded-full bg-[#1a2e1a] px-3 py-1 text-xs font-medium text-[#16a34a]">
          {allPetitions.length} open
        </span>
      </div>
      <p className="mb-5 text-xs leading-relaxed text-[#8B7B6B]">
        Sign petitions and make your voice heard. Each signature drives real change.
      </p>

      {allPetitions.length === 0 ? (
        <div className="rounded-xl border border-[#2A1515] bg-[#1E0E0E] p-10 text-center">
          <p className="mb-1 text-sm font-semibold text-[#F5EDD0]">No open petitions</p>
          <p className="text-xs text-[#8B7B6B]">Petitions will appear here as they are created.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {allPetitions.map(p => {
            const pct = Math.min(100, Math.round((p.signatureCount / 1000) * 100))
            return (
              <Link
                key={p.id}
                href={`/petitions/${p.id}`}
                className="block rounded-xl border border-[#2A1515] bg-[#1E0E0E] p-4 transition-colors hover:border-[#D97706]/50"
              >
                <h2 className="mb-1 font-semibold text-white">{p.title}</h2>
                <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-[#A89080]">{p.body}</p>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="text-[#8B7B6B]">{p.target}</span>
                  <span className="font-semibold text-[#16a34a]">{p.signatureCount.toLocaleString('en-GB')} signed</span>
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-[#2A1515]">
                  <div className="h-full rounded-full bg-[#16a34a] transition-all" style={{ width: `${pct}%` }} />
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
