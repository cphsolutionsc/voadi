import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { townHalls } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { AccessToken } from 'livekit-server-sdk'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const [th] = await db.select().from(townHalls).where(eq(townHalls.eventId, id))
  if (!th) return NextResponse.json({ error: 'Not a virtual event' }, { status: 404 })
  if (th.townHallStatus !== 'live') {
    return NextResponse.json({ error: 'Call is not live' }, { status: 409 })
  }

  const role = (session.user as Record<string, unknown>).role as string
  const isHost = role === 'admin' || role === 'moderator' || role === 'super_admin'

  const token = new AccessToken(
    process.env.LIVEKIT_API_KEY!,
    process.env.LIVEKIT_API_SECRET!,
    { identity: session.user.id, name: session.user.name },
  )
  token.addGrant({
    roomJoin: true,
    room: th.livekitRoomName,
    canPublish: isHost,
    canSubscribe: true,
    canPublishData: isHost,
  })

  return NextResponse.json({
    token: await token.toJwt(),
    wsUrl: process.env.LIVEKIT_URL!,
  })
}
