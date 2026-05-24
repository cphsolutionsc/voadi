# Town Hall — Virtual Events Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the events feature so admins can create virtual events backed by a LiveKit call, record them to Cloudflare R2, transcribe with OpenAI Whisper, summarise with GPT-4o, and deliver summaries to all members via Resend email and push notification.

**Architecture:** Virtual events extend the existing `events` table with two new columns (`event_type`, `ends_at`) and a new `town_halls` table that holds LiveKit/recording/pipeline state one-to-one with a virtual event. The post-call pipeline is purely webhook-driven — LiveKit fires `egress_ended`, the Next.js webhook route runs Whisper → GPT-4o → Resend batch → push, with no background scheduler.

**Tech Stack:** Next.js 15 App Router, Drizzle ORM + postgres-js, better-auth, livekit-server-sdk, @livekit/components-react, openai, @aws-sdk/client-s3, Resend, web-push (already installed), Tailwind v4, lucide-react.

---

## File Map

| File | Action | Purpose |
|---|---|---|
| `lib/db/schema.ts` | Modify | Add enums + columns + `townHalls` table |
| `drizzle/migrations/` | Generate | New migration via `drizzle-kit generate` |
| `lib/livekit.ts` | Create | `roomService()` and `egressService()` helpers |
| `lib/r2.ts` | Create | S3Client configured for Cloudflare R2 |
| `app/api/events/[id]/token/route.ts` | Create | Issue LiveKit JWT |
| `app/api/events/[id]/start/route.ts` | Create | Start call + Egress |
| `app/api/events/[id]/end/route.ts` | Create | Stop Egress |
| `app/api/events/webhook/livekit/route.ts` | Create | Pipeline: Whisper → GPT-4o → Resend → push |
| `app/(app)/events/page.tsx` | Modify | Virtual badge + live pill on cards |
| `app/(app)/events/[id]/page.tsx` | Modify | Lobby UI for virtual events |
| `app/(app)/events/[id]/room/page.tsx` | Create | Server gate + auth check |
| `app/(app)/events/[id]/room/room-client.tsx` | Create | `<VideoConference>` client component |
| `app/(app)/events/new/page.tsx` | Modify | `eventType` toggle + `endsAt` field |
| `lib/actions.ts` | Modify | `createEvent` handles virtual type + inserts `townHalls` |
| `app/admin/events/[id]/page.tsx` | Create | Admin event detail: start/end, transcript, summary |
| `app/admin/events/page.tsx` | Modify | Tag virtual events in list |

---

## Task 1: Install Packages

**Files:**
- Modify: `package.json` (via npm install)

- [ ] **Step 1: Install new dependencies**

```bash
cd /Volumes/CPH\ SSD/Projects/voadi
npm install livekit-server-sdk @livekit/components-react @livekit/client openai @aws-sdk/client-s3
```

Expected: all packages install without peer-dep errors. `@livekit/client` is a peer dep of `@livekit/components-react`.

- [ ] **Step 2: Verify TypeScript resolves packages**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: no new errors about missing modules (there may be pre-existing errors; those are OK).

- [ ] **Step 3: Document required environment variables**

Add the following block to `.env.example` (create it if absent):

```
# LiveKit
LIVEKIT_URL=wss://72.62.132.248
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
LIVEKIT_WEBHOOK_SECRET=

# Cloudflare R2 (voadi-recordings bucket)
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=voadi-recordings
R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com

# OpenAI
OPENAI_API_KEY=
```

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json .env.example
git commit -m "feat: install livekit, openai, aws-sdk/client-s3 packages"
```

---

## Task 2: Schema Extension + Migration

**Files:**
- Modify: `lib/db/schema.ts`
- Generate: new file in `drizzle/migrations/`

- [ ] **Step 1: Add enums and extend `events` table in `lib/db/schema.ts`**

Add these two enum declarations after the existing `pushTypeEnum` line (around line 18):

```typescript
export const eventTypeEnum = pgEnum('event_type', ['in_person', 'virtual'])
export const townHallStatusEnum = pgEnum('town_hall_status', ['idle', 'live', 'ended'])
```

Then add two columns to the `events` table definition. The full `events` table should become:

```typescript
export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  location: text('location').notNull(),
  county: text('county').notNull(),
  startsAt: timestamp('starts_at').notNull(),
  endsAt: timestamp('ends_at'),
  eventType: eventTypeEnum('event_type').default('in_person').notNull(),
  createdBy: uuid('created_by').notNull().references(() => users.id),
  status: eventStatusEnum('status').default('published').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
```

- [ ] **Step 2: Add `townHalls` table to `lib/db/schema.ts`**

Add this after the `eventRsvps` table definition:

```typescript
export const townHalls = pgTable('town_halls', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id').notNull().unique().references(() => events.id, { onDelete: 'cascade' }),
  livekitRoomName: text('livekit_room_name').notNull().unique(),
  townHallStatus: townHallStatusEnum('town_hall_status').default('idle').notNull(),
  egressId: text('egress_id'),
  recordingR2Key: text('recording_r2_key'),
  transcript: text('transcript'),
  summary: text('summary'),
  summarySentAt: timestamp('summary_sent_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
```

- [ ] **Step 3: Generate migration**

```bash
cd /Volumes/CPH\ SSD/Projects/voadi
npx drizzle-kit generate
```

Expected: a new file created at `drizzle/migrations/0001_<something>.sql` containing `ALTER TABLE "events" ADD COLUMN`, `CREATE TYPE "event_type"`, `CREATE TYPE "town_hall_status"`, and `CREATE TABLE "town_halls"`.

- [ ] **Step 4: Apply migration**

```bash
npx drizzle-kit migrate
```

Expected: "1 migration applied" (or similar). No errors.

- [ ] **Step 5: Verify TypeScript is happy**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors referencing `townHalls`, `eventTypeEnum`, or `townHallStatusEnum`.

- [ ] **Step 6: Commit**

```bash
git add lib/db/schema.ts drizzle/
git commit -m "feat(db): add event_type, ends_at columns and town_halls table"
```

---

## Task 3: LiveKit and R2 Helper Modules

**Files:**
- Create: `lib/livekit.ts`
- Create: `lib/r2.ts`

- [ ] **Step 1: Create `lib/livekit.ts`**

```typescript
import { RoomServiceClient, EgressClient } from 'livekit-server-sdk'

function livekitConfig() {
  const host = process.env.LIVEKIT_URL!
    .replace('wss://', 'https://')
    .replace('ws://', 'http://')
  const apiKey = process.env.LIVEKIT_API_KEY!
  const apiSecret = process.env.LIVEKIT_API_SECRET!
  return { host, apiKey, apiSecret }
}

export function roomService() {
  const { host, apiKey, apiSecret } = livekitConfig()
  return new RoomServiceClient(host, apiKey, apiSecret)
}

export function egressService() {
  const { host, apiKey, apiSecret } = livekitConfig()
  return new EgressClient(host, apiKey, apiSecret)
}
```

- [ ] **Step 2: Create `lib/r2.ts`**

```typescript
import { S3Client } from '@aws-sdk/client-s3'

export function r2Client() {
  return new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT!,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  })
}

export const R2_BUCKET = process.env.R2_BUCKET_NAME ?? 'voadi-recordings'
```

- [ ] **Step 3: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors in `lib/livekit.ts` or `lib/r2.ts`.

- [ ] **Step 4: Commit**

```bash
git add lib/livekit.ts lib/r2.ts
git commit -m "feat: add LiveKit and R2 helper modules"
```

---

## Task 4: Token API Route

**Files:**
- Create: `app/api/events/[id]/token/route.ts`

The token route issues a LiveKit JWT. Admins and moderators get `canPublish: true`. Regular members get `canSubscribe: true` only. Token is only issued if `town_hall_status = 'live'`.

- [ ] **Step 1: Create `app/api/events/[id]/token/route.ts`**

```typescript
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
  const isHost = role === 'admin' || role === 'moderator'

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
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors in the new file.

- [ ] **Step 3: Commit**

```bash
git add app/api/events/[id]/token/route.ts
git commit -m "feat(api): LiveKit token route for virtual events"
```

---

## Task 5: Start Call API Route

**Files:**
- Create: `app/api/events/[id]/start/route.ts`

Admin/moderator only. Creates LiveKit room (idempotent), starts composite Egress to R2, sets `town_hall_status = 'live'`.

- [ ] **Step 1: Create `app/api/events/[id]/start/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { townHalls } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { roomService, egressService } from '@/lib/livekit'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const role = (session.user as Record<string, unknown>).role as string
  if (role !== 'admin' && role !== 'moderator') {
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
  const egress = await egressService().startRoomCompositeEgress(th.livekitRoomName, {
    file: {
      filepath: `${th.livekitRoomName}.mp4`,
      output: {
        case: 's3',
        value: {
          accessKey: process.env.R2_ACCESS_KEY_ID!,
          secret: process.env.R2_SECRET_ACCESS_KEY!,
          region: 'auto',
          endpoint: process.env.R2_ENDPOINT!,
          bucket: process.env.R2_BUCKET_NAME!,
        },
      },
    },
  })

  await db.update(townHalls)
    .set({ townHallStatus: 'live', egressId: egress.egressId })
    .where(eq(townHalls.eventId, id))

  return NextResponse.json({ ok: true, egressId: egress.egressId })
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/api/events/[id]/start/route.ts
git commit -m "feat(api): start virtual event call with LiveKit Egress"
```

---

## Task 6: End Call API Route

**Files:**
- Create: `app/api/events/[id]/end/route.ts`

Admin/moderator only. Stops egress; sets `town_hall_status = 'ended'`. Recording pipeline fires when LiveKit webhook arrives.

- [ ] **Step 1: Create `app/api/events/[id]/end/route.ts`**

```typescript
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
  if (role !== 'admin' && role !== 'moderator') {
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
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 3: Commit**

```bash
git add app/api/events/[id]/end/route.ts
git commit -m "feat(api): end virtual event call and stop Egress"
```

---

## Task 7: Webhook Pipeline Route

**Files:**
- Create: `app/api/events/webhook/livekit/route.ts`

This is the most complex route. On `egress_ended`: download recording from R2 → Whisper transcription → GPT-4o summary → Resend batch email to all members → push to subscribers. Each step after the R2 download is independent; failures are logged but don't abort the rest.

Note: Next.js API routes in App Router do not pre-parse the body, so `req.text()` returns the raw body needed for HMAC verification.

- [ ] **Step 1: Create `app/api/events/webhook/livekit/route.ts`**

```typescript
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
          body: 'The summary from today\'s community call is now available.',
          url: `/events/${th.eventId}`,
        },
      ),
    ),
  )

  await db.update(townHalls).set({ summarySentAt: new Date() }).where(eq(townHalls.id, th.id))

  return NextResponse.json({ ok: true })
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors. If you see `toFile` import errors, check you have `openai` >= 4.x installed (`npm list openai`).

- [ ] **Step 3: Commit**

```bash
git add app/api/events/webhook/livekit/route.ts
git commit -m "feat(api): LiveKit webhook pipeline — Whisper, GPT-4o, Resend, push"
```

---

## Task 8: Events List Page — Virtual Badge

**Files:**
- Modify: `app/(app)/events/page.tsx`

Add a "Virtual" badge on cards where `event.eventType === 'virtual'`, and a live pill where `town_hall_status === 'live'`. The page needs to left-join `town_halls`.

- [ ] **Step 1: Read `app/(app)/events/page.tsx` in full before editing**

Read the file to confirm the current query and card JSX structure. The current query is:

```typescript
const allEvents = await db.select().from(events)
  .where(...)
  .orderBy(events.startsAt)
  .limit(50)
```

- [ ] **Step 2: Update the query to left-join `townHalls`**

Replace the query block with:

```typescript
import { townHalls } from '@/lib/db/schema'
import { Video, MapPin } from 'lucide-react'

// In the component:
const allEvents = await db
  .select({ event: events, th: townHalls })
  .from(events)
  .leftJoin(townHalls, eq(townHalls.eventId, events.id))
  .where(
    county
      ? and(gte(events.startsAt, new Date()), eq(events.county, county))
      : gte(events.startsAt, new Date()),
  )
  .orderBy(events.startsAt)
  .limit(50)
```

Note: you must add `eq` to the existing `{ and, eq, gte }` import from `drizzle-orm`. Also add `townHalls` to the schema import.

- [ ] **Step 3: Update featured card footer to show Virtual badge**

The featured card footer row currently shows `<MapPin>` + location. Update the footer `<div>` in the featured card to:

```tsx
<div className="flex items-center gap-2 px-4 py-3 text-xs text-[#6B7280]">
  {featured.event.eventType === 'virtual' ? (
    <Video size={11} aria-hidden="true" className="text-[#D97706]" />
  ) : (
    <MapPin size={11} aria-hidden="true" />
  )}
  <span className="truncate">
    {featured.event.eventType === 'virtual' ? 'Virtual' : featured.event.location}
  </span>
  {featured.th?.townHallStatus === 'live' && (
    <span className="ml-1 rounded-full bg-[#D97706] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#111827]">
      Live now
    </span>
  )}
  <span className="ml-auto font-bold text-[#D97706]">
    {featured.event.eventType === 'virtual' ? 'Join →' : 'RSVP →'}
  </span>
</div>
```

Note: because the query now returns `{ event, th }` objects, you must update all field references in the JSX. Change `featured.startsAt` → `featured.event.startsAt`, `featured.id` → `featured.event.id`, `featured.title` → `featured.event.title`, etc. Do the same for `rest.map(({ event: ev, th })`.

- [ ] **Step 4: Update the list card row**

In `rest.map`, change the location text and add a Virtual badge:

```tsx
<p className="mt-0.5 flex items-center gap-1 text-xs text-[#6B7280]">
  {ev.eventType === 'virtual' ? (
    <Video size={10} aria-hidden="true" className="text-[#D97706]" />
  ) : (
    <MapPin size={10} aria-hidden="true" />
  )}
  {ev.eventType === 'virtual' ? 'Virtual' : ev.location}
  {' · '}
  {ev.startsAt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
  {th?.townHallStatus === 'live' && (
    <span className="ml-1 rounded-full bg-[#D97706] px-1.5 py-0.5 text-[9px] font-bold uppercase text-[#111827]">
      Live
    </span>
  )}
</p>
```

- [ ] **Step 5: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 6: Commit**

```bash
git add app/\(app\)/events/page.tsx
git commit -m "feat(events): virtual badge and live pill on events list"
```

---

## Task 9: Event Detail Page — Virtual Lobby

**Files:**
- Modify: `app/(app)/events/[id]/page.tsx`

For virtual events, show: countdown to call (when `idle`), "Join call" button (when `live`), summary card (when `ended` and summary populated), recording availability note. In-person events keep existing UI unchanged.

- [ ] **Step 1: Read `app/(app)/events/[id]/page.tsx` in full**

Current file is at `app/(app)/events/[id]/page.tsx`. Read it before editing.

- [ ] **Step 2: Update the query to fetch `townHalls` row**

Add to imports:
```typescript
import { townHalls } from '@/lib/db/schema'
import { Video, Clock } from 'lucide-react'
```

Add after the existing event fetch:
```typescript
const [th] = event.eventType === 'virtual'
  ? await db.select().from(townHalls).where(eq(townHalls.eventId, id))
  : [undefined]
```

Note: `event.eventType` requires that `events` schema now has this column — confirmed in Task 2.

- [ ] **Step 3: Add virtual event UI block above the description**

After the date/location card and before `<p ... description>`, add:

```tsx
{event.eventType === 'virtual' && th && (
  <div className="mb-6">
    {th.townHallStatus === 'idle' && (
      <div className="flex items-center gap-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3">
        <Clock size={14} className="shrink-0 text-[#D97706]" aria-hidden="true" />
        <p className="text-sm text-[#4B5563]">
          This is a virtual town hall.{' '}
          {event.startsAt > new Date()
            ? `Starts ${event.startsAt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} on ${event.startsAt.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}.`
            : 'Starting soon — check back shortly.'}
        </p>
      </div>
    )}

    {th.townHallStatus === 'live' && session && (
      <a
        href={`/events/${id}/room`}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#D97706] py-3.5 text-sm font-bold text-[#111827] transition-opacity hover:opacity-90"
      >
        <Video size={16} aria-hidden="true" />
        Join call
      </a>
    )}

    {th.townHallStatus === 'live' && !session && (
      <a
        href="/login"
        className="flex w-full items-center justify-center rounded-xl bg-[#D97706] py-3.5 text-sm font-bold text-[#111827] transition-opacity hover:opacity-90"
      >
        Sign in to join the call
      </a>
    )}

    {th.townHallStatus === 'ended' && th.summary && (
      <div className="rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] p-4">
        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-[#D97706]">Meeting Summary</p>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#4B5563]">{th.summary}</p>
      </div>
    )}

    {th.townHallStatus === 'ended' && !th.summary && (
      <div className="flex items-center gap-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3">
        <Clock size={14} className="shrink-0 text-[#9CA3AF]" aria-hidden="true" />
        <p className="text-sm text-[#6B7280]">This call has ended. The summary will be sent to members shortly.</p>
      </div>
    )}
  </div>
)}
```

- [ ] **Step 4: Update the location row to show "Virtual" for virtual events**

In the location `<div>` within the date/location card:
```tsx
<div className="flex items-start gap-3">
  {event.eventType === 'virtual' ? (
    <Video size={16} className="mt-0.5 shrink-0 text-[#D97706]" aria-hidden="true" />
  ) : (
    <MapPin size={16} className="mt-0.5 shrink-0 text-[#D97706]" aria-hidden="true" />
  )}
  <span className="text-sm text-[#111827]">
    {event.eventType === 'virtual' ? 'Virtual (online)' : event.location}
  </span>
</div>
```

- [ ] **Step 5: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 6: Commit**

```bash
git add app/\(app\)/events/\[id\]/page.tsx
git commit -m "feat(events): virtual lobby UI on event detail page"
```

---

## Task 10: Room Page

**Files:**
- Create: `app/(app)/events/[id]/room/page.tsx`
- Create: `app/(app)/events/[id]/room/room-client.tsx`

Server component verifies the call is live and the user is authenticated, then renders the client component which handles the LiveKit connection.

- [ ] **Step 1: Create `app/(app)/events/[id]/room/page.tsx`**

```typescript
export const dynamic = 'force-dynamic'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { events, townHalls } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
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
  const isHost = role === 'admin' || role === 'moderator'

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
```

- [ ] **Step 2: Create `app/(app)/events/[id]/room/room-client.tsx`**

```typescript
'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
} from '@livekit/components-react'
import '@livekit/components-styles'

interface RoomClientProps {
  eventId: string
  eventTitle: string
  isHost: boolean
}

export function RoomClient({ eventId, eventTitle, isHost }: RoomClientProps) {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [wsUrl, setWsUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchToken = useCallback(async () => {
    const res = await fetch(`/api/events/${eventId}/token`, { method: 'POST' })
    if (!res.ok) {
      const data = await res.json() as { error?: string }
      setError(data.error ?? 'Failed to join call')
      return
    }
    const data = await res.json() as { token: string; wsUrl: string }
    setToken(data.token)
    setWsUrl(data.wsUrl)
  }, [eventId])

  useEffect(() => {
    fetchToken()
  }, [fetchToken])

  // Poll status every 15s — redirect when ended
  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/events/${eventId}/token`, { method: 'POST' })
      if (!res.ok) {
        // 409 = not live anymore
        const data = await res.json() as { error?: string }
        if (data.error === 'Call is not live') {
          router.push(`/events/${eventId}`)
        }
      }
    }, 15_000)
    return () => clearInterval(interval)
  }, [eventId, router])

  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
        <p className="text-center text-sm text-[#9CA3AF]">{error}</p>
        <button
          onClick={() => router.push(`/events/${eventId}`)}
          className="rounded-lg bg-[#D97706] px-4 py-2 text-sm font-bold text-[#111827]"
        >
          Back to event
        </button>
      </div>
    )
  }

  if (!token || !wsUrl) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-[#9CA3AF]">Connecting…</p>
      </div>
    )
  }

  return (
    <LiveKitRoom
      video={isHost}
      audio={isHost}
      token={token}
      serverUrl={wsUrl}
      data-lk-theme="default"
      style={{ height: '100dvh' }}
    >
      <VideoConference />
      <RoomAudioRenderer />
    </LiveKitRoom>
  )
}
```

- [ ] **Step 3: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -20
```

If `@livekit/components-styles` is not found, check that `@livekit/components-react` was installed successfully. The styles import is a side-effect import that must be present for the VideoConference component to render correctly.

- [ ] **Step 4: Commit**

```bash
git add "app/(app)/events/[id]/room/"
git commit -m "feat(events): room page with LiveKit VideoConference"
```

---

## Task 11: New Event Form + createEvent Action

**Files:**
- Modify: `app/(app)/events/new/page.tsx`
- Modify: `lib/actions.ts`

Add `eventType` radio toggle and `endsAt` datetime input (shown only for virtual). Update `createEvent` server action to insert a `townHalls` row when creating a virtual event.

- [ ] **Step 1: Convert `app/(app)/events/new/page.tsx` to a client component**

The form needs conditional display of `endsAt`, which requires client-side state. Replace the current static page with a `'use client'` component:

```typescript
'use client'

import { useState } from 'react'
import { createEvent } from '@/lib/actions'

const COUNTIES = [
  'Carlow','Cavan','Clare','Cork','Donegal','Dublin','Galway','Kerry','Kildare',
  'Kilkenny','Laois','Leitrim','Limerick','Longford','Louth','Mayo','Meath',
  'Monaghan','Offaly','Roscommon','Sligo','Tipperary','Waterford','Westmeath',
  'Wexford','Wicklow',
]

const INPUT = 'w-full rounded-lg border border-[#E5E7EB] bg-[#FFFFFF] px-4 py-3 text-sm text-[#111827] placeholder-[#9CA3AF] transition-colors focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706]'
const LABEL = 'mb-1.5 block text-xs font-semibold text-[#4B5563]'

export default function NewEventPage() {
  const [eventType, setEventType] = useState<'in_person' | 'virtual'>('in_person')

  return (
    <div className="py-2">
      <h1 className="mb-1 text-lg font-bold text-[#111827]">Create an event</h1>
      <p className="mb-6 text-xs text-[#4B5563]">Events are visible to all members.</p>

      <form action={createEvent} className="space-y-4">
        {/* Event type toggle */}
        <div>
          <label className={LABEL}>Event type</label>
          <div className="flex gap-2">
            {(['in_person', 'virtual'] as const).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setEventType(t)}
                className={`flex-1 rounded-lg border py-2.5 text-xs font-semibold transition-colors ${
                  eventType === t
                    ? 'border-[#D97706] bg-[#FEF3C7] text-[#92400E]'
                    : 'border-[#E5E7EB] text-[#6B7280]'
                }`}
              >
                {t === 'in_person' ? 'In person' : 'Virtual'}
              </button>
            ))}
          </div>
          <input type="hidden" name="eventType" value={eventType} />
        </div>

        <div>
          <label htmlFor="title" className={LABEL}>Event name</label>
          <input id="title" name="title" type="text" required maxLength={120}
            placeholder="What is the event called?" className={INPUT} />
        </div>
        <div>
          <label htmlFor="description" className={LABEL}>Description</label>
          <textarea id="description" name="description" required rows={4} maxLength={1000}
            placeholder="What will happen? Who should come?"
            className={`${INPUT} resize-none`} />
        </div>

        {eventType === 'in_person' && (
          <div>
            <label htmlFor="location" className={LABEL}>Location</label>
            <input id="location" name="location" type="text" maxLength={200}
              placeholder="Address or venue name" className={INPUT} />
          </div>
        )}

        <div>
          <label htmlFor="county" className={LABEL}>County</label>
          <select id="county" name="county" required className={`${INPUT} appearance-none`}>
            <option value="" className="bg-[#FFFFFF]">Select county</option>
            {COUNTIES.map(c => <option key={c} value={c} className="bg-[#FFFFFF]">{c}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="startsAt" className={LABEL}>Start date &amp; time</label>
          <input id="startsAt" name="startsAt" type="datetime-local" required className={INPUT} />
        </div>

        {eventType === 'virtual' && (
          <div>
            <label htmlFor="endsAt" className={LABEL}>
              End date &amp; time <span className="font-normal text-[#9CA3AF]">(for scheduling)</span>
            </label>
            <input id="endsAt" name="endsAt" type="datetime-local" className={INPUT} />
          </div>
        )}

        <button type="submit"
          className="w-full rounded-lg bg-[#D97706] py-3 text-sm font-bold text-[#111827] transition-opacity hover:opacity-90">
          Create event
        </button>
      </form>
    </div>
  )
}
```

- [ ] **Step 2: Update `createEvent` in `lib/actions.ts`**

Read `lib/actions.ts` first. Find the `createEvent` function (at line 87). Replace it with:

```typescript
export async function createEvent(formData: FormData) {
  const session = await requireSession()
  const title       = formData.get('title') as string
  const description = formData.get('description') as string
  const location    = (formData.get('location') as string | null) ?? 'Online'
  const county      = formData.get('county') as string
  const startsAt    = new Date(formData.get('startsAt') as string)
  const endsAtRaw   = formData.get('endsAt') as string | null
  const endsAt      = endsAtRaw ? new Date(endsAtRaw) : null
  const eventType   = (formData.get('eventType') as 'in_person' | 'virtual') ?? 'in_person'

  if (!title?.trim() || !description?.trim() || !county || isNaN(startsAt.getTime())) return

  const [inserted] = await db.insert(events).values({
    title: title.trim(),
    description: description.trim(),
    location: location.trim() || 'Online',
    county,
    startsAt,
    endsAt,
    eventType,
    createdBy: session.user.id,
    status: 'published',
  }).returning({ id: events.id })

  if (eventType === 'virtual' && inserted) {
    await db.insert(townHalls).values({
      eventId: inserted.id,
      livekitRoomName: `town-hall-${inserted.id}`,
    })
  }

  redirect('/events')
}
```

You must add `townHalls` to the imports at the top of `lib/actions.ts`:
```typescript
import {
  events, eventRsvps, petitions, petitionSignatures,
  missingPersons, helpPosts, townHalls,
} from '@/lib/db/schema'
```

- [ ] **Step 3: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 4: Commit**

```bash
git add app/\(app\)/events/new/page.tsx lib/actions.ts
git commit -m "feat(events): virtual event type toggle and createEvent creates town_halls row"
```

---

## Task 12: Admin Event Detail + Admin Events List Update

**Files:**
- Create: `app/admin/events/[id]/page.tsx`
- Modify: `app/admin/events/page.tsx`

Admin event detail shows start/end call buttons (for virtual events), town hall status, transcript, and summary. The admin list gets a "Virtual" tag.

- [ ] **Step 1: Create `app/admin/events/[id]/page.tsx`**

```typescript
export const dynamic = 'force-dynamic'
import { notFound } from 'next/navigation'
import { requireAdmin } from '@/app/admin/admin-guard'
import { db } from '@/lib/db'
import { events, townHalls, eventRsvps } from '@/lib/db/schema'
import { eq, count } from 'drizzle-orm'
import { TownHallControls } from './town-hall-controls'
import { Video, MapPin, CalendarDays, Users } from 'lucide-react'

export default async function AdminEventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const { id } = await params

  const [event] = await db.select().from(events).where(eq(events.id, id))
  if (!event) notFound()

  const [th] = event.eventType === 'virtual'
    ? await db.select().from(townHalls).where(eq(townHalls.eventId, id))
    : [undefined]

  const [{ value: rsvpCount }] = await db
    .select({ value: count() })
    .from(eventRsvps)
    .where(eq(eventRsvps.eventId, id))

  const date = event.startsAt.toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
  const time = event.startsAt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <div className="mb-2 flex flex-wrap gap-2">
          <span className="rounded-full bg-[#E5E7EB] px-3 py-1 text-xs text-[#D97706]">{event.county}</span>
          {event.eventType === 'virtual' && (
            <span className="rounded-full bg-[#DBEAFE] px-3 py-1 text-xs font-semibold text-[#1D4ED8]">Virtual</span>
          )}
          <span className="rounded-full border border-[#E5E7EB] px-3 py-1 text-xs text-[#4B5563]">
            {rsvpCount} RSVP{rsvpCount !== 1 ? 's' : ''}
          </span>
        </div>
        <h1 className="text-xl font-bold text-[#111827]">{event.title}</h1>
      </div>

      <div className="space-y-2 rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] p-4">
        <div className="flex items-start gap-3">
          <CalendarDays size={15} className="mt-0.5 shrink-0 text-[#D97706]" aria-hidden="true" />
          <span className="text-sm text-[#4B5563]">{date} at {time}</span>
        </div>
        <div className="flex items-start gap-3">
          {event.eventType === 'virtual' ? (
            <Video size={15} className="mt-0.5 shrink-0 text-[#D97706]" aria-hidden="true" />
          ) : (
            <MapPin size={15} className="mt-0.5 shrink-0 text-[#D97706]" aria-hidden="true" />
          )}
          <span className="text-sm text-[#4B5563]">
            {event.eventType === 'virtual' ? 'Virtual (online)' : event.location}
          </span>
        </div>
      </div>

      {event.eventType === 'virtual' && th && (
        <TownHallControls eventId={id} townHall={th} />
      )}

      <div className="rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] p-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">Description</p>
        <p className="text-sm leading-relaxed text-[#4B5563]">{event.description}</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create `app/admin/events/[id]/town-hall-controls.tsx`**

This client component handles start/end buttons and shows transcript/summary.

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Video, Square, FileText, Mail } from 'lucide-react'

interface TownHall {
  id: string
  townHallStatus: 'idle' | 'live' | 'ended'
  egressId: string | null
  recordingR2Key: string | null
  transcript: string | null
  summary: string | null
  summarySentAt: Date | null
}

export function TownHallControls({ eventId, townHall }: { eventId: string; townHall: TownHall }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function startCall() {
    setLoading(true); setError(null)
    const res = await fetch(`/api/events/${eventId}/start`, { method: 'POST' })
    if (!res.ok) {
      const d = await res.json() as { error?: string }
      setError(d.error ?? 'Failed to start')
    }
    setLoading(false)
    router.refresh()
  }

  async function endCall() {
    setLoading(true); setError(null)
    const res = await fetch(`/api/events/${eventId}/end`, { method: 'POST' })
    if (!res.ok) {
      const d = await res.json() as { error?: string }
      setError(d.error ?? 'Failed to end')
    }
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="space-y-4 rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">Town Hall</p>
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
          townHall.townHallStatus === 'live'
            ? 'bg-[#D97706] text-[#111827]'
            : townHall.townHallStatus === 'ended'
              ? 'bg-[#E5E7EB] text-[#4B5563]'
              : 'bg-[#F3F4F6] text-[#9CA3AF]'
        }`}>
          {townHall.townHallStatus}
        </span>
      </div>

      {error && (
        <p className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-xs text-[#B91C1C]">{error}</p>
      )}

      <div className="flex gap-2">
        {townHall.townHallStatus === 'idle' && (
          <button
            onClick={startCall}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-[#D97706] px-4 py-2 text-xs font-bold text-[#111827] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <Video size={12} aria-hidden="true" />
            Start call
          </button>
        )}
        {townHall.townHallStatus === 'live' && (
          <>
            <a
              href={`/events/${eventId}/room`}
              className="flex items-center gap-2 rounded-lg border border-[#E5E7EB] px-4 py-2 text-xs font-semibold text-[#111827] transition-colors hover:border-[#D97706]"
            >
              <Video size={12} aria-hidden="true" />
              Enter room
            </a>
            <button
              onClick={endCall}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 py-2 text-xs font-bold text-[#B91C1C] transition-colors hover:bg-[#FEE2E2] disabled:opacity-50"
            >
              <Square size={12} aria-hidden="true" />
              End call
            </button>
          </>
        )}
      </div>

      {townHall.townHallStatus === 'ended' && (
        <div className="space-y-3 border-t border-[#E5E7EB] pt-3">
          {townHall.recordingR2Key && (
            <p className="flex items-center gap-2 text-xs text-[#4B5563]">
              <Video size={12} className="text-[#D97706]" aria-hidden="true" />
              Recording: <code className="rounded bg-[#F3F4F6] px-1 py-0.5 text-[10px]">{townHall.recordingR2Key}</code>
            </p>
          )}
          {townHall.summarySentAt && (
            <p className="flex items-center gap-2 text-xs text-[#4B5563]">
              <Mail size={12} className="text-[#D97706]" aria-hidden="true" />
              Summary sent {new Date(townHall.summarySentAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          )}
          {townHall.summary && (
            <details className="rounded-lg border border-[#E5E7EB]">
              <summary className="flex cursor-pointer items-center gap-2 px-3 py-2 text-xs font-semibold text-[#111827]">
                <FileText size={12} aria-hidden="true" />
                View summary
              </summary>
              <p className="whitespace-pre-wrap px-3 pb-3 pt-1 text-xs leading-relaxed text-[#4B5563]">{townHall.summary}</p>
            </details>
          )}
          {townHall.transcript && (
            <details className="rounded-lg border border-[#E5E7EB]">
              <summary className="flex cursor-pointer items-center gap-2 px-3 py-2 text-xs font-semibold text-[#111827]">
                <FileText size={12} aria-hidden="true" />
                View transcript
              </summary>
              <p className="whitespace-pre-wrap px-3 pb-3 pt-1 text-xs leading-relaxed text-[#4B5563]">{townHall.transcript}</p>
            </details>
          )}
          {!townHall.summary && !townHall.recordingR2Key && (
            <p className="text-xs text-[#9CA3AF]">Processing recording — summary will appear here once ready.</p>
          )}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Update admin events list to show "Virtual" tag**

In `app/admin/events/page.tsx`, read the file. Find the status badge span inside the `rows.map`. Add a Virtual tag after the existing status badge:

```tsx
{e.eventType === 'virtual' && (
  <span className="rounded-full bg-[#DBEAFE] px-2 py-0.5 text-[9px] font-bold uppercase text-[#1D4ED8]">
    Virtual
  </span>
)}
```

Also add a link to the admin event detail page. In each row, wrap `e.title` in a link:
```tsx
<a href={`/admin/events/${e.id}`} className="font-semibold text-[#111827] hover:text-[#D97706]">
  {e.title}
</a>
```

And add `eventType` to the select query — the join currently selects `{ event: events, creator: users }` which already includes `eventType` since the column was added to the `events` table in Task 2.

- [ ] **Step 4: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 5: Commit**

```bash
git add "app/admin/events/[id]/" app/admin/events/page.tsx
git commit -m "feat(admin): event detail page with town hall start/end controls"
```

---

## Post-Implementation Checklist

Before marking the feature complete, verify manually:

1. Create a virtual event as admin — confirm `town_halls` row exists in DB with `town_hall_status = 'idle'`.
2. Events list shows "Virtual" badge on the new event.
3. Event detail shows countdown / idle state.
4. Admin event detail shows "Start call" button.
5. Click "Start call" — confirm `town_hall_status` → `'live'`, `egress_id` populated.
6. Events list now shows "Live" pill.
7. Authenticated member visits event detail — "Join call" button appears.
8. Enter room — LiveKit VideoConference renders.
9. End call from admin panel — `town_hall_status` → `'ended'`.
10. Simulate webhook (or wait for real one) — confirm pipeline runs (check logs), transcript + summary stored, email sent.

LiveKit webhook must be reachable from the VPS. Ensure `LIVEKIT_WEBHOOK_SECRET` is configured in both the LiveKit server config and the Next.js env. The webhook URL to configure in LiveKit is `https://<your-domain>/api/events/webhook/livekit`.
