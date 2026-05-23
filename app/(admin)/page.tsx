export const dynamic = 'force-dynamic'

import { requireAdmin } from './admin-guard'
import { db } from '@/lib/db'
import { users, events, petitions, helpPosts, missingPersons } from '@/lib/db/schema'
import { count, gte } from 'drizzle-orm'

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
  ] = await Promise.all([
    db.select({ total: count() }).from(users),
    db.select({ total: count() }).from(events).where(gte(events.startsAt, now)),
    db.select({ total: count() }).from(petitions),
    db.select({ total: count() }).from(helpPosts),
    db.select({ total: count() }).from(missingPersons),
  ])

  const stats = [
    { label: 'Members',          value: totalMembers,  colour: 'text-[#D97706]'  },
    { label: 'Upcoming events',  value: upcomingEvents, colour: 'text-[#16A34A]'  },
    { label: 'Petitions',        value: openPetitions,  colour: 'text-blue-400'   },
    { label: 'Help posts',       value: openHelp,       colour: 'text-purple-400' },
    { label: 'Missing reports',  value: pendingMissing, colour: 'text-red-400'    },
  ]

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-white">Dashboard</h1>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map(({ label, value, colour }) => (
          <div key={label} className="rounded-xl border border-[#2A1515] bg-[#1E0E0E] p-4">
            <p className={`text-2xl font-bold ${colour}`}>{value}</p>
            <p className="mt-1 text-xs text-[#5C4040]">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
