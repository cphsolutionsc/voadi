export const dynamic = 'force-dynamic'
import { requireAdmin } from '../admin-guard'
import { db } from '@/lib/db'
import { pushSubscriptions, pushNotifications } from '@/lib/db/schema'
import { count, desc } from 'drizzle-orm'
import { sendPushToAll } from './send-push-action'

const INPUT = 'w-full rounded-lg border border-[#2A1515] bg-[#140909] px-4 py-3 text-sm text-[#F5EDD0] placeholder-[#5C4A3A] transition-colors focus:border-[#D97706] focus:outline-none'

export const metadata = { title: 'Push — Admin' }

export default async function AdminPushPage() {
  await requireAdmin()
  const [[{ total: subCount }], recentPushes] = await Promise.all([
    db.select({ total: count() }).from(pushSubscriptions),
    db.select().from(pushNotifications).orderBy(desc(pushNotifications.sentAt)).limit(10),
  ])

  return (
    <div className="max-w-lg space-y-8">
      <div>
        <h1 className="mb-1 text-xl font-bold text-white">Push Notifications</h1>
        <p className="text-sm text-[#5C4040]">{subCount} active subscriber{subCount !== 1 ? 's' : ''}</p>
      </div>

      <form action={sendPushToAll} className="space-y-4 rounded-xl border border-[#2A1515] bg-[#1E0E0E] p-5">
        <h2 className="text-sm font-bold text-[#F5EDD0]">Send to all subscribers</h2>
        <input name="title" type="text" required placeholder="Notification title" className={INPUT} />
        <textarea name="body" required rows={3} placeholder="Message body" className={`${INPUT} resize-none`} />
        <input name="url" type="text" placeholder="Link (default: /feed)" className={INPUT} />
        <button type="submit"
          className="rounded-lg bg-[#D97706] px-5 py-2.5 text-sm font-bold text-[#1C0D0D] hover:opacity-90">
          Send now
        </button>
      </form>

      {recentPushes.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-bold text-[#F5EDD0]">Recent pushes</h2>
          <div className="overflow-hidden rounded-xl border border-[#2A1515]">
            {recentPushes.map(p => (
              <div key={p.id} className="border-b border-[#2A1515] bg-[#1E0E0E] px-4 py-3 last:border-0">
                <p className="text-sm font-semibold text-[#F5EDD0]">{p.title}</p>
                <p className="text-xs text-[#5C4040]">{p.body}</p>
                <p className="mt-1 text-[10px] text-[#3D2020]">{p.sentAt.toLocaleDateString('en-GB')}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
