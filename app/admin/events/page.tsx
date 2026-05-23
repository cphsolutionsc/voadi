export const dynamic = 'force-dynamic'
import { requireAdmin } from '../admin-guard'
import { db } from '@/lib/db'
import { events, users } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
import { deleteEvent, setEventStatus } from '../content-actions'
import { Trash2, XCircle, CheckCircle } from 'lucide-react'

export const metadata = { title: 'Events — Admin' }

export default async function AdminEventsPage() {
  await requireAdmin()
  const rows = await db
    .select({ event: events, creator: users })
    .from(events)
    .leftJoin(users, eq(events.createdBy, users.id))
    .orderBy(desc(events.createdAt))
    .limit(100)

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-white">Events ({rows.length})</h1>
      <div className="overflow-hidden rounded-xl border border-[#2A1515]">
        {rows.length === 0 && (
          <p className="px-4 py-6 text-center text-xs text-[#3D2020]">No events yet.</p>
        )}
        {rows.map(({ event: e, creator }) => (
          <div key={e.id} className="flex items-start gap-3 border-b border-[#2A1515] bg-[#1E0E0E] px-4 py-3 last:border-0">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-[#F5EDD0]">{e.title}</p>
                <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${
                  e.status === 'published'
                    ? 'bg-green-900/30 text-green-400'
                    : e.status === 'cancelled'
                      ? 'bg-[#2A1515] text-[#5C4040]'
                      : 'bg-[#D97706]/20 text-[#D97706]'
                }`}>{e.status}</span>
              </div>
              <p className="text-xs text-[#5C4040]">
                {e.county} · {e.startsAt.toLocaleDateString('en-GB')} · by {creator?.name ?? 'unknown'}
              </p>
            </div>
            <div className="flex gap-1.5">
              {e.status === 'published' && (
                <form action={setEventStatus.bind(null, e.id, 'cancelled')}>
                  <button
                    type="submit"
                    title="Cancel event"
                    className="rounded-lg border border-[#3D2020] px-2 py-1 text-[10px] font-semibold text-[#5C4040] transition-colours hover:border-red-900/60 hover:text-red-500"
                  >
                    <XCircle size={13} aria-hidden="true" />
                  </button>
                </form>
              )}
              {e.status === 'cancelled' && (
                <form action={setEventStatus.bind(null, e.id, 'published')}>
                  <button
                    type="submit"
                    title="Publish event"
                    className="rounded-lg border border-green-900/40 px-2 py-1 text-[10px] font-semibold text-green-700 transition-colours hover:text-green-400"
                  >
                    <CheckCircle size={13} aria-hidden="true" />
                  </button>
                </form>
              )}
              <form action={deleteEvent.bind(null, e.id)}>
                <button
                  type="submit"
                  title="Delete event"
                  className="rounded-lg border border-red-900/50 p-1.5 text-red-700 transition-colours hover:text-red-400"
                >
                  <Trash2 size={13} aria-hidden="true" />
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
