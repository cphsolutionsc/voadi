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
        <h1 className="text-lg font-bold text-[#111827]">Petitions</h1>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[#D1FAE5] px-3 py-1 text-xs font-medium text-[#065F46]">
            {allPetitions.length} open
          </span>
          <Link href="/petitions/new"
            className="shrink-0 rounded-full bg-[#D97706] px-3 py-1.5 text-xs font-bold text-[#111827]">
            + New
          </Link>
        </div>
      </div>
      <p className="mb-5 text-xs leading-relaxed text-[#4B5563]">
        Sign petitions and make your voice heard. Each signature drives real change.
      </p>

      {allPetitions.length === 0 ? (
        <div className="rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] p-10 text-center">
          <p className="mb-1 text-sm font-semibold text-[#111827]">No open petitions</p>
          <p className="text-xs text-[#4B5563]">Petitions will appear here as they are created.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {allPetitions.map(p => (
            <Link
              key={p.id}
              href={`/petitions/${p.id}`}
              className="block rounded-xl border border-[#E5E7EB] bg-white p-4 transition-colors hover:border-[#D97706]/50"
            >
              {/* Status row */}
              <div className="mb-2 flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-[#D1FAE5] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#065F46]">
                  Open
                </span>
                <span className="ml-auto text-[10px] text-[#9CA3AF]">{p.target}</span>
              </div>

              {/* Title */}
              <h2 className="mb-3 font-semibold leading-snug text-[#111827]">{p.title}</h2>

              {/* Progress bar — amber, goal 2000 */}
              {(() => {
                const GOAL = 2000
                const pct = Math.min(100, Math.round((p.signatureCount / GOAL) * 100))
                return (
                  <>
                    <div className="mb-1.5 h-1.5 overflow-hidden rounded-full bg-[#F3F4F6]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#D97706] to-[#F59E0B] transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#D97706]">
                        {p.signatureCount.toLocaleString('en-GB')} signatures
                      </span>
                      <span className="text-[10px] text-[#9CA3AF]">Goal: {GOAL.toLocaleString('en-GB')}</span>
                    </div>
                  </>
                )
              })()}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
