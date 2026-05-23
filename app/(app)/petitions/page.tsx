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
      <h1 className="mb-5 text-lg font-bold text-white">Petitions</h1>

      {allPetitions.length === 0 ? (
        <div className="rounded-2xl border border-[#2A1515] bg-[#1E0E0E] p-10 text-center">
          <p className="mb-1 text-sm font-semibold text-[#F5EDD0]">No open petitions</p>
          <p className="text-xs text-[#8B7B6B]">Petitions will appear here as they are created.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {allPetitions.map(p => {
            const pct = Math.min(100, Math.round((p.signatureCount / 1000) * 100))
            return (
              <Link
                key={p.id}
                href={`/petitions/${p.id}`}
                className="block rounded-xl border border-[#2A1515] bg-[#1E0E0E] p-4 transition-colors hover:border-[#4A2828]"
              >
                <div className="mb-1 flex items-start justify-between gap-3">
                  <h2 className="font-semibold text-white">{p.title}</h2>
                </div>
                <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-[#A89080]">{p.body}</p>
                <div className="mb-1 flex items-center justify-between text-xs text-[#8B7B6B]">
                  <span>Target: {p.target}</span>
                  <span className="font-semibold text-[#F5EDD0]">{p.signatureCount.toLocaleString('en-GB')} signatures</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[#2A1515]">
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
