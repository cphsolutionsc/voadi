'use server'
import { requireAdmin } from '../admin-guard'
import { db } from '@/lib/db'
import { pushSubscriptions, pushNotifications } from '@/lib/db/schema'
import { sendPush } from '@/lib/push'
import { revalidatePath } from 'next/cache'

export async function sendPushToAll(formData: FormData) {
  const session = await requireAdmin()
  const title = formData.get('title') as string
  const body  = formData.get('body') as string
  const url   = (formData.get('url') as string) || '/feed'

  if (!title?.trim() || !body?.trim()) return

  const subs = await db.select().from(pushSubscriptions)

  await db.insert(pushNotifications).values({
    title,
    body,
    url,
    sentBy: session.user.id,
    type: 'urgent',
  })

  const results = await Promise.allSettled(
    subs.map(s => sendPush(
      { endpoint: s.endpoint, p256dh: s.p256dh, auth: s.auth },
      { title, body, url }
    ))
  )

  const failed = results.filter(r => r.status === 'rejected').length
  console.log(`[push] sent ${subs.length - failed} ok, ${failed} failed`)
  revalidatePath('/admin/push')
}
