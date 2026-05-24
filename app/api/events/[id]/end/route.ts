import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { townHalls } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { egressService } from '@/lib/livekit'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const role = (session.user as Record<string, unknown>).role as string
  if (role !== 'admin' && role !== 'moderator' && role !== 'super_admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const [th] = await db.select().from(townHalls).where(eq(townHalls.eventId, id))
  if (!th) return NextResponse.json({ error: 'Not a virtual event' }, { status: 404 })
  if (th.townHallStatus !== 'live') {
    return NextResponse.json({ error: 'Not currently live' }, { status: 409 })
  }

  if (th.egressId) {
    await egressService().stopEgress(th.egressId)
  }

  await db.update(townHalls)
    .set({ townHallStatus: 'ended' })
    .where(eq(townHalls.eventId, id))

  return NextResponse.json({ ok: true })
}
