import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { townHalls } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { roomService, egressService } from '@/lib/livekit'
import { EncodedFileOutput, S3Upload } from 'livekit-server-sdk'

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
  if (th.townHallStatus === 'live') {
    return NextResponse.json({ error: 'Already live' }, { status: 409 })
  }

  // Create room (idempotent)
  await roomService().createRoom({ name: th.livekitRoomName, emptyTimeout: 300 })

  // Start composite egress → R2
  const fileOutput = new EncodedFileOutput({
    filepath: `${th.livekitRoomName}.mp4`,
    output: {
      case: 's3',
      value: new S3Upload({
        accessKey: process.env.R2_ACCESS_KEY_ID!,
        secret: process.env.R2_SECRET_ACCESS_KEY!,
        region: 'auto',
        endpoint: process.env.R2_ENDPOINT!,
        bucket: process.env.R2_BUCKET_NAME!,
      }),
    },
  })

  const egress = await egressService().startRoomCompositeEgress(
    th.livekitRoomName,
    fileOutput,
  )

  await db.update(townHalls)
    .set({ townHallStatus: 'live', egressId: egress.egressId })
    .where(eq(townHalls.eventId, id))

  return NextResponse.json({ ok: true, egressId: egress.egressId })
}
