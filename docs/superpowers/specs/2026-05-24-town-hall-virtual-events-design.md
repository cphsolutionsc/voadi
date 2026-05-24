# Town Hall — Virtual Events Design Spec

## Goal

Extend the existing Events feature so that events can be marked as virtual. Virtual events host a LiveKit audio/video call, record the session via LiveKit Egress to Cloudflare R2, transcribe the recording with OpenAI Whisper, generate a structured summary with GPT-4o, and deliver the summary to all members via Resend email and push notification.

---

## Architecture

The feature is built as an extension to the existing `events` / `eventRsvps` tables rather than a standalone module. This keeps event listings, RSVPs, admin tooling, and county filtering unified. Virtual-specific state (room name, egress ID, recording key, transcript, summary) lives in a separate `town_halls` table linked one-to-one to `events`.

The post-call pipeline is webhook-driven: LiveKit fires `egress_ended` → Next.js webhook route → download audio → Whisper → GPT-4o → Resend batch email + push notification. No background job scheduler required.

---

## Tech Stack

- **LiveKit** — self-hosted on VPS (72.62.132.248); `livekit-server-sdk` for token/room/egress management
- **`@livekit/components-react`** — prebuilt `<VideoConference>` UI component
- **Cloudflare R2** — recording storage (new bucket: `voadi-recordings`); LiveKit Egress writes directly to R2
- **OpenAI** — Whisper API for transcription; GPT-4o for summary generation
- **Resend** — batch email delivery of post-call summary to all members
- **Push notifications** — existing `PushSubscribe` infrastructure for urgent delivery
- **Drizzle ORM** — schema extensions and queries
- **Next.js 15 App Router** — server components, API routes

---

## Data Model

### Extend `events` table

Two new columns:

| column | type | default | notes |
|---|---|---|---|
| `event_type` | `pgEnum('event_type', ['in_person', 'virtual'])` | `'in_person'` | |
| `ends_at` | `timestamp nullable` | null | required for virtual events |

Existing `eventRsvps` table is reused unchanged for both event types.

### New `town_halls` table

One-to-one with `events`. Created by admin when publishing a virtual event.

| column | type | notes |
|---|---|---|
| `id` | uuid PK | |
| `event_id` | uuid FK → events.id (cascade delete) | unique |
| `livekit_room_name` | text unique | `town-hall-<event-id>` |
| `town_hall_status` | `pgEnum('town_hall_status', ['idle', 'live', 'ended'])` | default `'idle'` |
| `egress_id` | text nullable | set when recording starts |
| `recording_r2_key` | text nullable | set after egress ends |
| `transcript` | text nullable | Whisper output |
| `summary` | text nullable | GPT-4o output |
| `summary_sent_at` | timestamp nullable | set after Resend batch sent |
| `created_at` | timestamp | defaultNow |

---

## API Routes

| route | method | auth | purpose |
|---|---|---|---|
| `/api/events/[id]/token` | POST | authenticated user | issue LiveKit JWT for the room |
| `/api/events/[id]/start` | POST | admin/moderator | set `town_hall_status = 'live'`, start Egress to R2 |
| `/api/events/[id]/end` | POST | admin/moderator | set `town_hall_status = 'ended'`, stop Egress |
| `/api/events/webhook/livekit` | POST | LiveKit server (HMAC verified) | receive `egress_ended`, trigger pipeline |
| `/api/events/[id]/rsvp` | POST/DELETE | authenticated | toggle RSVP (reuses existing pattern) |

### Token route

- Verifies session exists.
- Fetches `town_halls` row for the event, confirms `town_hall_status = 'live'`.
- Issues token with `roomJoin`, `canPublish` (admin only), `canSubscribe` grants.
- Returns `{ token: string, wsUrl: string }`.

### Start route

- Admin only (role check).
- Creates LiveKit room if not already present.
- Calls Egress API: `startRoomCompositeEgress` with R2 output (`s3` destination type, R2-compatible endpoint).
- Stores `egress_id` on `town_halls` row.
- Sets `town_hall_status = 'live'`.

### End route

- Admin only.
- Calls `stopEgress(egressId)`.
- Sets `town_hall_status = 'ended'` (recording still processing — webhook fires when done).

### Webhook route

Verified with `WebhookReceiver` from `livekit-server-sdk` using `LIVEKIT_WEBHOOK_SECRET`.

On `egress_ended` event:

1. Look up `town_halls` row by `egress_id`.
2. Set `recording_r2_key` from egress output file path.
3. Download audio from R2 using `@aws-sdk/client-s3` (R2 is S3-compatible).
4. Send audio to OpenAI Whisper → store `transcript`.
5. Send transcript to GPT-4o with structured prompt → store `summary`.
6. Fetch all verified member emails from `users` table.
7. Send Resend batch email (summary + recording link if public, or admin-only link).
8. Send push notification to subscribed members (`push_type = 'event'`).
9. Set `summary_sent_at = now()`.

If any step after step 2 fails, log error and continue — later steps are independent. Email falls back to "Recording available, summary coming soon" if GPT-4o fails.

---

## App Routes

### Public / member routes

| route | notes |
|---|---|
| `/events` | Existing list page — virtual events show "Virtual" badge; live ones show "Joining now" pill |
| `/events/[id]` | Event detail / lobby — shows countdown, description, RSVP; "Join call" button when `town_hall_status = 'live'` and user is authenticated |
| `/events/[id]/room` | Live room — renders `<VideoConference>` from `@livekit/components-react`; polls status every 15 s; admin sees start/end controls |

### Admin routes

| route | notes |
|---|---|
| `/admin/events` | Existing list — virtual events tagged |
| `/admin/events/new` | Existing form — `eventType` toggle; when `virtual`, reveals `ends_at` field |
| `/admin/events/[id]` | Detail — shows town hall status, start/end call buttons, transcript + summary once available |

---

## Room Page Behaviour

- Server component fetches event + town hall row.
- If `town_hall_status !== 'live'`, redirect to `/events/[id]` (lobby).
- Client component calls `/api/events/[id]/token` on mount, connects to LiveKit room.
- Polls `town_hall_status` every 15 s via `router.refresh()`.
- When `town_hall_status` flips to `'ended'`, shows "Call has ended" overlay, redirects to lobby after 5 s.
- Admin controls: "End call" button (calls `/api/events/[id]/end`); no start button here (start from admin panel).

---

## UI Integration Points

- Events list card: virtual events show a `Video` icon (lucide) instead of `MapPin`; location displays as "Virtual".
- Event detail lobby: when virtual + `idle` status — countdown timer to `starts_at`; when `live` — amber "Join call" CTA button.
- After call ends, event detail shows summary card (if `summary` populated) and recording link (if `recording_r2_key` set and user is authenticated).
- Admin event form: `eventType` radio (`In person` / `Virtual`); virtual reveals `ends_at` datetime input.

---

## Environment Variables

```
LIVEKIT_URL=wss://72.62.132.248
LIVEKIT_API_KEY=...
LIVEKIT_API_SECRET=...
LIVEKIT_WEBHOOK_SECRET=...
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=voadi-recordings
R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
OPENAI_API_KEY=...
```

`NEXT_PUBLIC_LIVEKIT_URL` is not needed — the token route returns `wsUrl` directly.

---

## New Packages

```
livekit-server-sdk
@livekit/components-react
@livekit/client
openai
@aws-sdk/client-s3
```

---

## Out of Scope

- Chat replay / message history within the room.
- Breakout rooms.
- Participant raise-hand or emoji reactions.
- Public recording embeds (recordings are member-only via authenticated R2 presigned URLs).
- Recurring / series town halls.
