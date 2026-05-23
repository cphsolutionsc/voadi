export const dynamic = 'force-dynamic'
import { requireAdmin } from '../admin-guard'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { ilike, or, and, eq, desc, count } from 'drizzle-orm'
import { setMemberRole, verifyMemberEmail } from './actions'
import { ShieldCheck, ShieldOff } from 'lucide-react'
import type { SQL } from 'drizzle-orm'

export const metadata = { title: 'Members — Admin' }

type Role = 'member' | 'moderator' | 'admin'
const ROLES: Role[] = ['member', 'moderator', 'admin']

export default async function AdminMembersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; role?: string; verified?: string }>
}) {
  await requireAdmin()
  const { q, role, verified } = await searchParams

  // Build where conditions for filtered query
  const conditions: SQL[] = []

  if (q) {
    conditions.push(
      or(
        ilike(users.name, `%${q}%`),
        ilike(users.email, `%${q}%`),
      ) as SQL,
    )
  }

  if (role && ROLES.includes(role as Role)) {
    conditions.push(eq(users.role, role))
  }

  if (verified === 'false') {
    conditions.push(eq(users.emailVerified, false))
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined

  // Filtered member list
  const members = await db
    .select()
    .from(users)
    .where(whereClause)
    .orderBy(desc(users.createdAt))
    .limit(200)

  // Stats — always from the whole table
  const [{ count: totalCount }] = await db.select({ count: count() }).from(users)
  const [{ count: verifiedCount }] = await db
    .select({ count: count() })
    .from(users)
    .where(eq(users.emailVerified, true))
  const unverifiedCount = totalCount - verifiedCount

  // Helpers for building filter URLs that preserve existing params
  function pillHref(patch: Record<string, string | undefined>): string {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (role) params.set('role', role)
    if (verified) params.set('verified', verified)
    for (const [k, v] of Object.entries(patch)) {
      if (v === undefined) {
        params.delete(k)
      } else {
        params.set(k, v)
      }
    }
    const str = params.toString()
    return str ? `?${str}` : '?'
  }

  return (
    <div>
      {/* Stats header */}
      <div className="mb-4 flex items-center gap-4 text-xs text-[#8B7B6B]">
        <span>Total: <span className="font-semibold text-[#F5EDD0]">{totalCount}</span></span>
        <span className="text-[#2A1515]">·</span>
        <span>Verified: <span className="font-semibold text-[#16A34A]">{verifiedCount}</span></span>
        <span className="text-[#2A1515]">·</span>
        <span>Unverified: <span className="font-semibold text-[#D97706]">{unverifiedCount}</span></span>
      </div>

      <h1 className="mb-4 text-xl font-bold text-white">
        Members ({members.length}{members.length === 200 ? '+' : ''})
      </h1>

      {/* Search */}
      <form method="GET" className="mb-4">
        {role && <input type="hidden" name="role" value={role} />}
        {verified && <input type="hidden" name="verified" value={verified} />}
        <input
          type="search"
          name="q"
          defaultValue={q ?? ''}
          placeholder="Search by name or email…"
          className="w-full rounded-lg border border-[#2A1515] bg-[#1E0E0E] px-3 py-2 text-sm text-[#F5EDD0] placeholder-[#3D2020] outline-none focus:border-[#5C4040]"
        />
      </form>

      {/* Filter pills */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {/* Role pills */}
        <a
          href={pillHref({ role: undefined })}
          className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide transition-colors ${
            !role
              ? 'bg-[#5C4040] text-[#F5EDD0]'
              : 'border border-[#2A1515] text-[#5C4040] hover:text-[#8B7B6B]'
          }`}
        >
          All roles
        </a>
        {ROLES.map(r => (
          <a
            key={r}
            href={pillHref({ role: r })}
            className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide transition-colors ${
              role === r
                ? r === 'admin'
                  ? 'bg-[#D97706] text-[#1C0D0D]'
                  : r === 'moderator'
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#2A1515] text-[#F5EDD0]'
                : 'border border-[#2A1515] text-[#5C4040] hover:text-[#8B7B6B]'
            }`}
          >
            {r}
          </a>
        ))}

        <span className="mx-1 text-[#2A1515]">|</span>

        {/* Verified toggle */}
        <a
          href={pillHref({ verified: verified === 'false' ? undefined : 'false' })}
          className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide transition-colors ${
            verified === 'false'
              ? 'bg-[#D97706]/20 text-[#D97706] border border-[#D97706]/40'
              : 'border border-[#2A1515] text-[#5C4040] hover:text-[#8B7B6B]'
          }`}
        >
          Unverified only
        </a>
      </div>

      {/* Member list */}
      <div className="overflow-hidden rounded-xl border border-[#2A1515]">
        {members.length === 0 && (
          <p className="px-4 py-6 text-center text-xs text-[#3D2020]">No members found.</p>
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
              {ROLES.map(r => (
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
