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
      <div className="mb-4 flex items-center gap-4 text-xs text-[#4B5563]">
        <span>Total: <span className="font-semibold text-[#111827]">{totalCount}</span></span>
        <span className="text-[#E5E7EB]">·</span>
        <span>Verified: <span className="font-semibold text-[#16A34A]">{verifiedCount}</span></span>
        <span className="text-[#E5E7EB]">·</span>
        <span>Unverified: <span className="font-semibold text-[#D97706]">{unverifiedCount}</span></span>
      </div>

      <h1 className="mb-4 text-xl font-bold text-[#111827]">
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
          className="w-full rounded-lg border border-[#E5E7EB] bg-[#FFFFFF] px-3 py-2 text-sm text-[#111827] placeholder-[#9CA3AF] outline-none focus:border-[#6B7280]"
        />
      </form>

      {/* Filter pills */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {/* Role pills */}
        <a
          href={pillHref({ role: undefined })}
          className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide transition-colors ${
            !role
              ? 'bg-[#6B7280] text-[#111827]'
              : 'border border-[#E5E7EB] text-[#6B7280] hover:text-[#4B5563]'
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
                  ? 'bg-[#D97706] text-[#111827]'
                  : r === 'moderator'
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#E5E7EB] text-[#111827]'
                : 'border border-[#E5E7EB] text-[#6B7280] hover:text-[#4B5563]'
            }`}
          >
            {r}
          </a>
        ))}

        <span className="mx-1 text-[#E5E7EB]">|</span>

        {/* Verified toggle */}
        <a
          href={pillHref({ verified: verified === 'false' ? undefined : 'false' })}
          className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide transition-colors ${
            verified === 'false'
              ? 'bg-[#D97706]/20 text-[#D97706] border border-[#D97706]/40'
              : 'border border-[#E5E7EB] text-[#6B7280] hover:text-[#4B5563]'
          }`}
        >
          Unverified only
        </a>
      </div>

      {/* Member list */}
      <div className="overflow-hidden rounded-xl border border-[#E5E7EB]">
        {members.length === 0 && (
          <p className="px-4 py-6 text-center text-xs text-[#9CA3AF]">No members found.</p>
        )}
        {members.map(m => (
          <div
            key={m.id}
            className="flex items-center gap-3 border-b border-[#E5E7EB] bg-[#FFFFFF] px-4 py-3 last:border-0"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-semibold text-[#111827]">{m.name}</p>
                {m.emailVerified
                  ? <ShieldCheck size={11} className="shrink-0 text-[#16A34A]" aria-label="Verified" />
                  : <ShieldOff size={11} className="shrink-0 text-[#D97706]" aria-label="Unverified" />
                }
              </div>
              <p className="text-xs text-[#6B7280]">{m.email} · {m.county}</p>
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
                          ? 'bg-[#D97706] text-[#111827]'
                          : r === 'moderator'
                            ? 'bg-blue-600 text-white'
                            : 'bg-[#E5E7EB] text-[#4B5563]'
                        : 'border border-[#E5E7EB] text-[#9CA3AF] hover:text-[#4B5563]'
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
