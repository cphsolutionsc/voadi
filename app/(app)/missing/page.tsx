export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { db } from '@/lib/db'
import { missingPersons } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

export const metadata = { title: 'Missing Persons — VOADI' }

export default async function MissingPage() {
  const persons = await db.select().from(missingPersons)
    .where(eq(missingPersons.status, 'published'))
    .orderBy(desc(missingPersons.createdAt))

  return (
    <div className="py-2">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-lg font-bold text-[#111827]">Missing Persons</h1>
        <Link
          href="/missing/new"
          className="rounded-full bg-[#D97706] px-4 py-2 text-xs font-bold text-[#111827] transition-opacity hover:opacity-90"
        >
          Report
        </Link>
      </div>

      <div className="mb-4 rounded-xl border border-[#9CA3AF] bg-[#FFFFFF] p-3 text-xs leading-relaxed text-[#6B7280]">
        If someone is in immediate danger, call <strong className="text-[#111827]">999</strong>. This board is for community awareness only.
      </div>

      {persons.length === 0 ? (
        <div className="rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] p-10 text-center">
          <p className="mb-1 text-sm font-semibold text-[#111827]">No active reports</p>
          <p className="text-xs text-[#4B5563]">Use the Report button if you need community help locating someone.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {persons.map(p => {
            const lastSeen = p.lastSeenAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
            return (
              <div key={p.id} className="rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] p-4">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <h2 className="font-bold text-[#111827]">{p.fullName}{p.age ? `, ${p.age}` : ''}</h2>
                  <span className="shrink-0 rounded-full bg-red-950 px-2 py-0.5 text-xs font-medium text-red-400">Missing</span>
                </div>
                <p className="mb-1 text-xs text-[#6B7280]">Last seen: {p.lastSeenLocation} on {lastSeen}</p>
                <p className="mb-3 text-xs leading-relaxed text-[#4B5563]">{p.description}</p>
                <p className="text-xs text-[#111827]">Contact: {p.contactInfo}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
