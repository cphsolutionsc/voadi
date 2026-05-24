export const dynamic = 'force-dynamic'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { events, townHalls } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { RoomClient } from './room-client'

export default async function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const [event] = await db.select().from(events).where(eq(events.id, id))
  if (!event || event.eventType !== 'virtual') redirect(`/events/${id}`)

  const [th] = await db.select().from(townHalls).where(eq(townHalls.eventId, id))
  if (!th || th.townHallStatus !== 'live') redirect(`/events/${id}`)

  const role = (session.user as Record<string, unknown>).role as string
  const isHost = role === 'admin' || role === 'moderator' || role === 'super_admin'

  return (
    <div className="flex min-h-screen flex-col bg-[#111827]">
      <RoomClient
        eventId={id}
        eventTitle={event.title}
        isHost={isHost}
      />
    </div>
  )
}
