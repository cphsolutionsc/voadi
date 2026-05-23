export const dynamic = 'force-dynamic'
import { requireAdmin } from '../admin-guard'
import { db } from '@/lib/db'
import { missingPersons, users } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
import { approveMissingPerson, rejectMissingPerson } from '../content-actions'
import { CheckCircle, XCircle } from 'lucide-react'

export const metadata = { title: 'Missing Persons — Admin' }

export default async function AdminMissingPage() {
  const session = await requireAdmin()
  const rows = await db
    .select({ person: missingPersons, submitter: users })
    .from(missingPersons)
    .leftJoin(users, eq(missingPersons.submittedBy, users.id))
    .orderBy(desc(missingPersons.createdAt))
    .limit(100)

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-white">Missing Persons</h1>
      <div className="overflow-hidden rounded-xl border border-[#2A1515]">
        {rows.length === 0 && (
          <p className="px-4 py-6 text-center text-xs text-[#3D2020]">No reports.</p>
        )}
        {rows.map(({ person: p, submitter }) => (
          <div key={p.id} className="flex items-start gap-3 border-b border-[#2A1515] bg-[#1E0E0E] px-4 py-3 last:border-0">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-[#F5EDD0]">{p.fullName}</p>
                <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${
                  p.status === 'pending'
                    ? 'bg-[#D97706]/20 text-[#D97706]'
                    : p.status === 'published'
                      ? 'bg-green-900/30 text-green-400'
                      : 'bg-[#2A1515] text-[#5C4040]'
                }`}>{p.status}</span>
              </div>
              <p className="text-xs text-[#5C4040]">
                Last seen: {p.lastSeenLocation} · by {submitter?.name ?? 'unknown'}
              </p>
            </div>
            {p.status === 'pending' && (
              <div className="flex gap-1.5">
                <form action={approveMissingPerson.bind(null, p.id, session.user.id)}>
                  <button
                    type="submit"
                    className="rounded-lg border border-green-900/50 p-1.5 text-green-700 transition-colours hover:text-green-400"
                  >
                    <CheckCircle size={14} aria-hidden="true" />
                  </button>
                </form>
                <form action={rejectMissingPerson.bind(null, p.id)}>
                  <button
                    type="submit"
                    className="rounded-lg border border-red-900/50 p-1.5 text-red-700 transition-colours hover:text-red-400"
                  >
                    <XCircle size={14} aria-hidden="true" />
                  </button>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
