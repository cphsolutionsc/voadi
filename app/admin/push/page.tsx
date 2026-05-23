export const dynamic = 'force-dynamic'
import { requireAdmin } from '../admin-guard'
import { db } from '@/lib/db'
import { pushSubscriptions, pushNotifications } from '@/lib/db/schema'
import { count, desc } from 'drizzle-orm'
import { sendPushToAll } from './send-push-action'

const INPUT = 'w-full rounded-lg border border-[#E5E7EB] bg-[#FFFFFF] px-4 py-3 text-sm text-[#111827] placeholder-[#9CA3AF] transition-colors focus:border-[#D97706] focus:outline-none'

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
        <h1 className="mb-1 text-xl font-bold text-[#111827]">Push Notifications</h1>
        <p className="text-sm text-[#6B7280]">{subCount} active subscriber{subCount !== 1 ? 's' : ''}</p>
      </div>

      <form action={sendPushToAll} className="space-y-4 rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] p-5">
        <h2 className="text-sm font-bold text-[#111827]">Send to all subscribers</h2>
        <input name="title" type="text" required placeholder="Notification title" className={INPUT} />
        <textarea name="body" required rows={3} placeholder="Message body" className={`${INPUT} resize-none`} />
        <input name="url" type="text" placeholder="Link (default: /feed)" className={INPUT} />
        <button type="submit"
          className="rounded-lg bg-[#D97706] px-5 py-2.5 text-sm font-bold text-[#111827] hover:opacity-90">
          Send now
        </button>
      </form>

      {recentPushes.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-bold text-[#111827]">Recent pushes</h2>
          <div className="overflow-hidden rounded-xl border border-[#E5E7EB]">
            {recentPushes.map(p => (
              <div key={p.id} className="border-b border-[#E5E7EB] bg-[#FFFFFF] px-4 py-3 last:border-0">
                <p className="text-sm font-semibold text-[#111827]">{p.title}</p>
                <p className="text-xs text-[#6B7280]">{p.body}</p>
                <p className="mt-1 text-[10px] text-[#9CA3AF]">{p.sentAt.toLocaleDateString('en-GB')}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
