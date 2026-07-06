# VOADI — Voices of Africans Diaspora Ireland

Civic/community platform for the African diaspora in Ireland (**voadi.org** — "One Voice, One Ireland"): member feed, events with RSVP and LiveKit town halls, petitions, missing-persons reports, community help board, resources, MDX blog, voluntary donations (Stripe), push notifications, admin moderation. The README is one line — this file is the orientation doc.

## Stack

- Next.js 15 (App Router, `output: 'standalone'`), React 19, TypeScript, Tailwind **v4**, PWA via next-pwa (disabled in dev)
- Auth: **better-auth** (`/api/auth/[...all]`) with Drizzle adapter; roles `member` / `moderator` / `admin` plus a singleton `super_admin` (unique index enforces one)
- DB: **Drizzle ORM + Postgres 16** (self-hosted in the prod compose stack — not Supabase); schema in `lib/db/schema.ts`, migrations in `drizzle/migrations/`
- Stripe donations (VOADI is not a registered charity — the donate page disclaimer matters), Resend email, web-push (VAPID), LiveKit town halls with R2 recordings + OpenAI summaries
- Package manager: **npm** (`package-lock.json`; Docker uses `npm ci`)

## Commands

```bash
npm run dev / npm run build / npm run start
npm run typecheck            # tsc --noEmit — the main quality gate (Vitest configured, no tests written yet)
npm run db:generate / db:migrate / db:push / db:studio   # drizzle-kit
docker compose -f docker/docker-compose.dev.yml up -d    # local Postgres on :5433
```

## Deploy

```bash
npx tsx deploy.ts
```

This SSHes to `cph-vps`, `git pull origin main` at `/opt/voadi`, then rebuilds `docker/docker-compose.prod.yml` (`voadi-web` + `voadi-db` on the shared `cph_app_net` network). **Commit and push to `main` first** — the server only pulls. **`deploy.ts` does not run migrations**: if your change includes one, run `npm run db:migrate` against the prod DB (via SSH) as part of the rollout, deliberately.

## Structure

```
app/(app)/       # authenticated member area: feed, events, petitions, missing, help, resources, search, profile, donate
app/(auth)/      # login, signup
app/(legal)/     # blog, privacy, terms, transparency
app/admin/       # members, events/town-hall controls, petitions, missing, help, push
app/api/         # auth, donations checkout, push subscribe, LiveKit webhook, event start/end/token
lib/actions.ts   # server actions — the mutation layer; admin mutations in *-actions.ts files
lib/db/          # Drizzle schema + client
lib/{auth,email,push}/ , lib/livekit.ts , lib/r2.ts , lib/blog.ts
content/blog/    # MDX posts
deploy.ts        # deploy orchestrator
```

## Conventions

- Mutations go through Server Actions (`'use server'` in `lib/actions.ts` / admin `*-actions.ts`) — not ad-hoc API routes.
- Session check pattern: `auth.api.getSession({ headers })` server-side; gate admin routes on role.
- Town-hall lifecycle: event → LiveKit room → recording to R2 → OpenAI summary → Resend batch email (`app/api/livekit/webhook`).
- Typography: Playfair Display + Inter + Anton (loaded in root layout). `lang="en-GB"`; en-GB copy; no emojis, SVG icons only.
- TypeScript strict; Tailwind v4 CSS-first.

## Gotchas

- **`.env.example` is incomplete** — the code also needs `RESEND_API_KEY` and `STRIPE_SECRET_KEY`/`STRIPE_*` (and the LiveKit URL in the example points at a raw IP). Check `process.env` usage before assuming the example is the full contract.
- No tests exist yet (only `__tests__/setup.ts`) — add Vitest coverage with meaningful changes.
- Push notifications require VAPID keys; the service worker only registers in production builds.
