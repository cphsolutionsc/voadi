export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { requireAdmin } from './admin-guard'
import { db } from '@/lib/db'
import { users, events, petitions, helpPosts, missingPersons } from '@/lib/db/schema'
import { count, gte, eq, desc } from 'drizzle-orm'
import { ShieldOff, AlertCircle, MessageCircle } from 'lucide-react'

export const metadata = { title: 'Admin — VOADI' }

export default async function AdminPage() {
  await requireAdmin()

  const now = new Date()
  const [
    [{ total: totalMembers }],
    [{ total: upcomingEvents }],
    [{ total: openPetitions }],
    [{ total: openHelp }],
    [{ total: pendingMissing }],
    [{ total: unverifiedMembers }],
    [{ total: pendingMissingAction }],
    [{ total: openHelpAction }],
    recentSignups,
  ] = await Promise.all([
    db.select({ total: count() }).from(users),
    db.select({ total: count() }).from(events).where(gte(events.startsAt, now)),
    db.select({ total: count() }).from(petitions),
    db.select({ total: count() }).from(helpPosts),
    db.select({ total: count() }).from(missingPersons),
    db.select({ total: count() }).from(users).where(eq(users.emailVerified, false)),
    db.select({ total: count() }).from(missingPersons).where(eq(missingPersons.status, 'pending')),
    db.select({ total: count() }).from(helpPosts).where(eq(helpPosts.status, 'open')),
    db
      .select({ id: users.id, name: users.name, email: users.email, createdAt: users.createdAt })
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(5),
  ])

  const stats: { label: string; value: number; colour: string; href: string }[] = [
    { label: 'Members',         value: totalMembers,   colour: 'text-[#D97706]',  href: '/admin/members'  },
    { label: 'Upcoming events', value: upcomingEvents, colour: 'text-[#16A34A]',  href: '/admin/events'   },
    { label: 'Petitions',       value: openPetitions,  colour: 'text-blue-400',   href: '/admin/petitions' },
    { label: 'Help posts',      value: openHelp,       colour: 'text-purple-400', href: '/admin'           },
    { label: 'Missing reports', value: pendingMissing, colour: 'text-red-400',    href: '/admin/missing'  },
  ]

  const attentionItems: { label: string; count: number; href: string; icon: React.ReactNode }[] = [
    {
      label: 'Unverified members',
      count: unverifiedMembers,
      href: '/admin/members',
      icon: <ShieldOff size={16} className="shrink-0" />,
    },
    {
      label: 'Pending missing reports',
      count: pendingMissingAction,
      href: '/admin/missing',
      icon: <AlertCircle size={16} className="shrink-0" />,
    },
    {
      label: 'Open help posts',
      count: openHelpAction,
      href: '/admin',
      icon: <MessageCircle size={16} className="shrink-0" />,
    },
  ].filter((item) => item.count > 0)

  const allClear = attentionItems.length === 0

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-white">Dashboard</h1>

      {/* Needs attention */}
      <section className="mb-6">
        <h2 className="mb-3 text-sm font-semibold text-[#F5EDD0]">Needs attention</h2>
        {allClear ? (
          <div className="rounded-xl border border-[#16A34A]/20 bg-[#16A34A]/5 px-4 py-3 text-xs text-[#16A34A]">
            All clear — nothing requires action right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {attentionItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 rounded-xl border border-[#2A1515] bg-[#1E0E0E] px-4 py-3 text-[#F5EDD0] transition-colors hover:border-[#D97706]/40 hover:bg-[#251010]"
              >
                <span className="text-[#D97706]">{item.icon}</span>
                <div>
                  <p className="text-lg font-bold text-[#D97706]">{item.count}</p>
                  <p className="text-xs text-[#5C4040]">{item.label}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Stat cards */}
      <section className="mb-6">
        <h2 className="mb-3 text-sm font-semibold text-[#F5EDD0]">Overview</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map(({ label, value, colour, href }) => (
            <Link
              key={label}
              href={href}
              className="rounded-xl border border-[#2A1515] bg-[#1E0E0E] p-4 transition-colors hover:border-[#D97706]/40 hover:bg-[#251010]"
            >
              <p className={`text-2xl font-bold ${colour}`}>{value}</p>
              <p className="mt-1 text-xs text-[#5C4040]">{label}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent signups */}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-[#F5EDD0]">Recent members</h2>
        <div className="overflow-hidden rounded-xl border border-[#2A1515] bg-[#1E0E0E]">
          {recentSignups.length === 0 ? (
            <p className="px-4 py-3 text-xs text-[#5C4040]">No members yet.</p>
          ) : (
            <ul className="divide-y divide-[#2A1515]">
              {recentSignups.map((user) => (
                <li key={user.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-[#F5EDD0]">{user.name}</p>
                    <p className="text-xs text-[#5C4040]">{user.email}</p>
                  </div>
                  <time className="text-xs text-[#5C4040]">
                    {user.createdAt.toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  )
}
