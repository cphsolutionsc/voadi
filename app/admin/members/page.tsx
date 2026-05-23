export const dynamic = 'force-dynamic'
import { requireAdmin } from '../admin-guard'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'
import { setMemberRole, verifyMemberEmail } from './actions'
import { ShieldCheck, ShieldOff } from 'lucide-react'

export const metadata = { title: 'Members — Admin' }

export default async function AdminMembersPage() {
  await requireAdmin()
  const members = await db.select().from(users).orderBy(desc(users.createdAt)).limit(200)

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-white">Members ({members.length})</h1>
      <div className="overflow-hidden rounded-xl border border-[#2A1515]">
        {members.length === 0 && (
          <p className="px-4 py-6 text-center text-xs text-[#3D2020]">No members yet.</p>
        )}
        {members.map(m => (
          <div
            key={m.id}
            className="flex items-center gap-3 border-b border-[#2A1515] bg-[#1E0E0E] px-4 py-3 last:border-0"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-semibold text-[#F5EDD0]">{m.name}</p>
                {m.emailVerified
                  ? <ShieldCheck size={11} className="shrink-0 text-[#16A34A]" aria-label="Verified" />
                  : <ShieldOff size={11} className="shrink-0 text-[#D97706]" aria-label="Unverified" />
                }
              </div>
              <p className="text-xs text-[#5C4040]">{m.email} · {m.county}</p>
            </div>

            <div className="flex items-center gap-1">
              {!m.emailVerified && (
                <form action={verifyMemberEmail.bind(null, m.id)}>
                  <button type="submit"
                    className="rounded-full border border-[#D97706]/40 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#D97706] hover:bg-[#D97706]/10">
                    verify
                  </button>
                </form>
              )}
              {(['member', 'moderator', 'admin'] as const).map(r => (
                <form key={r} action={setMemberRole.bind(null, m.id, r)}>
                  <button
                    type="submit"
                    className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide transition-colors ${
                      (m.role as string) === r
                        ? r === 'admin'
                          ? 'bg-[#D97706] text-[#1C0D0D]'
                          : r === 'moderator'
                            ? 'bg-blue-600 text-white'
                            : 'bg-[#2A1515] text-[#8B7B6B]'
                        : 'border border-[#2A1515] text-[#3D2020] hover:text-[#8B7B6B]'
                    }`}
                  >
                    {r}
                  </button>
                </form>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
