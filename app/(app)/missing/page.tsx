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
        <h1 className="text-lg font-bold text-white">Missing Persons</h1>
        <Link
          href="/missing/new"
          className="rounded-full bg-[#D97706] px-4 py-2 text-xs font-bold text-[#1C0D0D] transition-opacity hover:opacity-90"
        >
          Report
        </Link>
      </div>

      <div className="mb-4 rounded-xl border border-[#3D2020] bg-[#1E0E0E] p-3 text-xs leading-relaxed text-[#A89080]">
        If someone is in immediate danger, call <strong className="text-white">999</strong>. This board is for community awareness only.
      </div>

      {persons.length === 0 ? (
        <div className="rounded-2xl border border-[#2A1515] bg-[#1E0E0E] p-10 text-center">
          <p className="mb-1 text-sm font-semibold text-[#F5EDD0]">No active reports</p>
          <p className="text-xs text-[#8B7B6B]">Use the Report button if you need community help locating someone.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {persons.map(p => {
            const lastSeen = p.lastSeenAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
            return (
              <div key={p.id} className="rounded-xl border border-[#2A1515] bg-[#1E0E0E] p-4">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <h2 className="font-bold text-white">{p.fullName}{p.age ? `, ${p.age}` : ''}</h2>
                  <span className="shrink-0 rounded-full bg-red-950 px-2 py-0.5 text-xs font-medium text-red-400">Missing</span>
                </div>
                <p className="mb-1 text-xs text-[#A89080]">Last seen: {p.lastSeenLocation} on {lastSeen}</p>
                <p className="mb-3 text-xs leading-relaxed text-[#8B7B6B]">{p.description}</p>
                <p className="text-xs text-[#F5EDD0]">Contact: {p.contactInfo}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
