import { NextRequest, NextResponse } from 'next/server'
import { WebhookReceiver } from 'livekit-server-sdk'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import OpenAI, { toFile } from 'openai'
import { Resend } from 'resend'
import { db } from '@/lib/db'
import { townHalls, users, pushSubscriptions } from '@/lib/db/schema'
import { eq, isNotNull } from 'drizzle-orm'
import { r2Client, R2_BUCKET } from '@/lib/r2'
import { sendPush } from '@/lib/push'

const resend = new Resend(process.env.RESEND_API_KEY!)
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const authHeader = req.headers.get('Authorization') ?? ''

  const receiver = new WebhookReceiver(
    process.env.LIVEKIT_API_KEY!,
    process.env.LIVEKIT_WEBHOOK_SECRET!,
  )

  let event: Awaited<ReturnType<typeof receiver.receive>>
  try {
    event = await receiver.receive(rawBody, authHeader)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  if (event.event !== 'egress_ended') {
    return NextResponse.json({ ok: true })
  }

  const egressId = event.egressInfo?.egressId
  if (!egressId) return NextResponse.json({ ok: true })

  const [th] = await db.select().from(townHalls).where(eq(townHalls.egressId, egressId))
  if (!th) return NextResponse.json({ ok: true })

  // The egress file path matches what was set in the start route: `{roomName}.mp4`
  const r2Key = `${th.livekitRoomName}.mp4`
  await db.update(townHalls).set({ recordingR2Key: r2Key }).where(eq(townHalls.id, th.id))

  // Download audio from R2
  let audioBuffer: Buffer
  try {
    const s3 = r2Client()
    const { Body } = await s3.send(new GetObjectCommand({ Bucket: R2_BUCKET, Key: r2Key }))
    if (!Body) throw new Error('Empty body from R2')
    const chunks: Uint8Array[] = []
    for await (const chunk of Body as AsyncIterable<Uint8Array>) chunks.push(chunk)
    audioBuffer = Buffer.concat(chunks)
  } catch (err) {
    console.error('[town-hall webhook] R2 download failed:', err)
    return NextResponse.json({ ok: true })
  }

  // Whisper transcription
  let transcript = ''
  try {
    const audioFile = await toFile(audioBuffer, 'recording.mp4', { type: 'video/mp4' })
    const result = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      response_format: 'text',
    })
    transcript = typeof result === 'string' ? result : (result as { text: string }).text
    await db.update(townHalls).set({ transcript }).where(eq(townHalls.id, th.id))
  } catch (err) {
    console.error('[town-hall webhook] Whisper failed:', err)
  }

  // GPT-4o summary
  let summary = ''
  if (transcript) {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content:
              'You are a community meeting summariser for VOADI (Voices of Africans Diaspora Ireland). ' +
              'Produce a concise summary in plain English with three sections: ' +
              '**Key Topics Discussed**, **Decisions Made**, and **Action Points**. ' +
              'Use bullet points within each section. Be factual. Do not invent content.',
          },
          {
            role: 'user',
            content: `Here is the meeting transcript:\n\n${transcript}`,
          },
        ],
      })
      summary = completion.choices[0]?.message?.content ?? ''
      await db.update(townHalls).set({ summary }).where(eq(townHalls.id, th.id))
    } catch (err) {
      console.error('[town-hall webhook] GPT-4o failed:', err)
    }
  }

  // Get all verified members
  const members = await db
    .select({ email: users.email, name: users.name })
    .from(users)
    .where(isNotNull(users.email))

  const emailBody = summary
    ? `Your VOADI town hall summary is ready.\n\n${summary}`
    : 'Your VOADI town hall recording is ready. The summary will follow shortly.'

  // Resend batch email — max 100 per batch
  const emails = members.filter(m => m.email)
  const BATCH_SIZE = 100
  for (let i = 0; i < emails.length; i += BATCH_SIZE) {
    const batch = emails.slice(i, i + BATCH_SIZE)
    try {
      await resend.batch.send(
        batch.map(m => ({
          from: 'VOADI <noreply@voadi.org>',
          to: m.email!,
          subject: 'Town Hall Summary — VOADI',
          text: emailBody,
        })),
      )
    } catch (err) {
      console.error('[town-hall webhook] Resend batch failed:', err)
    }
  }

  // Push notification to subscribers
  const subs = await db.select().from(pushSubscriptions)
  await Promise.allSettled(
    subs.map(s =>
      sendPush(
        { endpoint: s.endpoint, p256dh: s.p256dh, auth: s.auth },
        {
          title: 'Town Hall Summary Ready',
          body: "The summary from today's community call is now available.",
          url: `/events/${th.eventId}`,
        },
      ),
    ),
  )

  await db.update(townHalls).set({ summarySentAt: new Date() }).where(eq(townHalls.id, th.id))

  return NextResponse.json({ ok: true })
}
