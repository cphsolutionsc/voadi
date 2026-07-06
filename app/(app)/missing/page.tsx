export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { db } from '@/lib/db'
import { missingPersons } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { Phone } from 'lucide-react'

export const metadata = { title: 'Missing Persons — VOADI' }

export default async function MissingPage() {
  const persons = await db.select().from(missingPersons)
    .where(eq(missingPersons.status, 'published'))
    .orderBy(desc(missingPersons.createdAt))

  return (
    <div className="py-2">
      <div className="mb-1 flex items-center justify-between">
        <h1 className="text-lg font-bold text-[#111827]">Missing Persons</h1>
        <Link
          href="/missing/new"
          className="shrink-0 rounded-full bg-[#D97706] px-3 py-1.5 text-xs font-bold text-[#111827]"
        >
          + Report
        </Link>
      </div>
      <p className="mb-4 text-xs leading-relaxed text-[#4B5563]">
        Community awareness board, reviewed by admins before publishing.
      </p>

      {/* Emergency callout */}
      <div className="mb-5 flex items-start gap-3 rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#FEE2E2] text-[#B91C1C]">
          <Phone size={13} aria-hidden="true" />
        </div>
        <p className="text-xs leading-relaxed text-[#B91C1C]">
          Immediate danger? Call <strong>999</strong>. This board is for community awareness only.
        </p>
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
            const daysAgo = Math.floor((Date.now() - p.lastSeenAt.getTime()) / (1000 * 60 * 60 * 24))
            const isRecent = daysAgo <= 7

            return (
              <div
                key={p.id}
                className={`overflow-hidden rounded-xl border bg-[#FFFFFF] ${isRecent ? 'border-[#FECACA]' : 'border-[#E5E7EB]'}`}
              >
                {/* Header bar */}
                <div className={`flex items-center justify-between px-4 py-2.5 ${isRecent ? 'bg-[#FEF2F2]' : 'bg-[#F9FAFB]'}`}>
                  <div className="flex items-center gap-2">
                    {/* Initials avatar */}
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${isRecent ? 'bg-[#FECACA] text-[#B91C1C]' : 'bg-[#E5E7EB] text-[#4B5563]'}`}>
                      {p.fullName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                    </div>
                    <h2 className="text-sm font-bold text-[#111827]">
                      {p.fullName}{p.age ? <span className="font-normal text-[#6B7280]">, {p.age}</span> : null}
                    </h2>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${isRecent ? 'bg-[#FEE2E2] text-[#B91C1C]' : 'bg-[#E5E7EB] text-[#6B7280]'}`}>
                    Missing
                  </span>
                </div>

                {/* Body */}
                <div className="px-4 py-3">
                  <p className="mb-1 text-xs font-medium text-[#6B7280]">
                    Last seen: <span className="text-[#111827]">{p.lastSeenLocation}</span> on <span className="text-[#111827]">{lastSeen}</span>
                    {isRecent && <span className="ml-2 font-bold text-[#B91C1C]">({daysAgo === 0 ? 'today' : `${daysAgo}d ago`})</span>}
                  </p>
                  <p className="mb-3 text-xs leading-relaxed text-[#4B5563]">{p.description}</p>
                  <a
                    href={`tel:${p.contactInfo.replace(/\D/g, '')}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-1.5 text-xs font-semibold text-[#111827] transition-colors hover:border-[#D97706] hover:text-[#D97706]"
                  >
                    <Phone size={11} aria-hidden="true" />
                    {p.contactInfo}
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
