# VOADI Platform Completion — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete all outstanding platform features — content creation, admin panel, email, push notifications, search, county filtering, and donations UI.

**Architecture:** Next.js 15 App Router with server actions for mutations, server components for data fetching, and a `(admin)` route group protected by role check. Email via Resend React, push via `web-push` VAPID, search via Drizzle `ilike`, donations via existing Stripe checkout route.

**Tech Stack:** Next.js 15, better-auth, Drizzle ORM + postgres-js, Tailwind v4, lucide-react, Resend, web-push, Stripe (already wired)

**Deploy command (run after every task group):**
```bash
cd /opt/voadi && git pull && docker compose -f docker/docker-compose.prod.yml --env-file .env build web && docker compose -f docker/docker-compose.prod.yml --env-file .env up -d web
```

---

## Codebase context (read before starting any task)

- Schema: `lib/db/schema.ts` — tables: `users`, `events`, `eventRsvps`, `petitions`, `petitionSignatures`, `helpPosts`, `helpResponses`, `missingPersons`, `pushSubscriptions`, `pushNotifications`, `politicians`
- Server actions pattern: `lib/actions.ts` — uses `requireSession()`, `db`, Drizzle, `revalidatePath`, `redirect`
- Auth: `lib/auth/index.ts` — better-auth, `user.role` is an `additionalField` (string, default `'member'`)
- Middleware: `middleware.ts` — already protects `/admin` prefix by checking session cookie
- Role values: `'member'` | `'moderator'` | `'admin'` (defined in `userRoleEnum` in schema but stored as text in `users.role`)
- UI colours: bg `#140909`, card `#1E0E0E`, border `#2A1515`, amber `#D97706`, text `#F5EDD0`, muted `#8B7B6B`
- INPUT class reuse: `'w-full rounded-lg border border-[#2A1515] bg-[#140909] px-4 py-3 text-sm text-[#F5EDD0] placeholder-[#5C4A3A] transition-colors focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706]'`

---

## Phase 1 — Content Creation

### Task 1: Petition creation form

**Files:**
- Create: `app/(app)/petitions/new/page.tsx`
- Modify: `lib/actions.ts` — add `createPetition`
- Modify: `app/(app)/petitions/page.tsx` — add "Start a petition" button

**Context:** Members can sign petitions but not create them. The `petitions` table has `title`, `body`, `target`, `createdBy`. Pattern matches `createHelpPost` in `lib/actions.ts`.

- [ ] **Step 1: Add `createPetition` server action to `lib/actions.ts`**

Append to `lib/actions.ts`:
```ts
export async function createPetition(formData: FormData) {
  const session = await requireSession()
  const title  = formData.get('title') as string
  const body   = formData.get('body') as string
  const target = formData.get('target') as string

  if (!title?.trim() || !body?.trim() || !target?.trim()) return

  await db.insert(petitions).values({
    title: title.trim(),
    body: body.trim(),
    target: target.trim(),
    createdBy: session.user.id,
  })
  redirect('/petitions')
}
```

Also add `petitions` to the import at the top of `lib/actions.ts` (it is already imported — verify).

- [ ] **Step 2: Create `app/(app)/petitions/new/page.tsx`**

```tsx
'use client'

import { useRef } from 'react'
import { createPetition } from '@/lib/actions'

const INPUT = 'w-full rounded-lg border border-[#2A1515] bg-[#140909] px-4 py-3 text-sm text-[#F5EDD0] placeholder-[#5C4A3A] transition-colors focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706]'

export default function NewPetitionPage() {
  const formRef = useRef<HTMLFormElement>(null)
  return (
    <div className="py-2">
      <h1 className="mb-1 text-lg font-bold text-white">Start a petition</h1>
      <p className="mb-6 text-xs text-[#8B7B6B]">Petitions are public and can be signed by all members.</p>

      <form ref={formRef} action={createPetition} className="space-y-4">
        <div>
          <label htmlFor="title" className="mb-1.5 block text-xs font-semibold text-[#8B7B6B]">Title</label>
          <input id="title" name="title" type="text" required maxLength={120}
            placeholder="A clear, concise title for your petition"
            className={INPUT} />
        </div>
        <div>
          <label htmlFor="target" className="mb-1.5 block text-xs font-semibold text-[#8B7B6B]">Directed at</label>
          <input id="target" name="target" type="text" required maxLength={120}
            placeholder="e.g. Minister for Justice, Dublin City Council"
            className={INPUT} />
        </div>
        <div>
          <label htmlFor="body" className="mb-1.5 block text-xs font-semibold text-[#8B7B6B]">Why this matters</label>
          <textarea id="body" name="body" required rows={6} maxLength={2000}
            placeholder="Explain the issue, who it affects, and what action you are asking for."
            className={`${INPUT} resize-none`} />
        </div>
        <button type="submit"
          className="w-full rounded-lg bg-[#D97706] py-3 text-sm font-bold text-[#1C0D0D] transition-opacity hover:opacity-90">
          Submit petition
        </button>
      </form>
    </div>
  )
}
```

- [ ] **Step 3: Add "Start a petition" link to `app/(app)/petitions/page.tsx`**

Find the `<h1>` / header area in `app/(app)/petitions/page.tsx` and add a link alongside it:
```tsx
import Link from 'next/link'
// ... existing imports

// In the JSX, after the <h1>Petitions</h1> line, add:
<Link href="/petitions/new"
  className="shrink-0 rounded-full bg-[#D97706] px-3 py-1.5 text-xs font-bold text-[#1C0D0D]">
  + New
</Link>
```
Wrap the heading row in `<div className="mb-1 flex items-center justify-between">` if not already.

- [ ] **Step 4: Commit**
```bash
git add lib/actions.ts app/\(app\)/petitions/
git commit -m "feat(petitions): member petition creation form"
```

---

### Task 2: Event creation form

**Files:**
- Create: `app/(app)/events/new/page.tsx`
- Modify: `lib/actions.ts` — add `createEvent`
- Modify: `app/(app)/events/page.tsx` — add "Create event" button

**Context:** The `events` table has `title`, `description`, `location`, `county`, `startsAt`, `createdBy`. County must be one of the 26 Irish counties.

- [ ] **Step 1: Add `createEvent` server action to `lib/actions.ts`**

Add to imports at top: `events` from schema (verify it is already imported or add it).

Append:
```ts
export async function createEvent(formData: FormData) {
  const session = await requireSession()
  const title       = formData.get('title') as string
  const description = formData.get('description') as string
  const location    = formData.get('location') as string
  const county      = formData.get('county') as string
  const startsAt    = new Date(formData.get('startsAt') as string)

  if (!title?.trim() || !description?.trim() || !location?.trim() || !county || isNaN(startsAt.getTime())) return

  await db.insert(events).values({
    title: title.trim(),
    description: description.trim(),
    location: location.trim(),
    county,
    startsAt,
    createdBy: session.user.id,
    status: 'published',
  })
  redirect('/events')
}
```

- [ ] **Step 2: Create `app/(app)/events/new/page.tsx`**

```tsx
'use client'

import { createEvent } from '@/lib/actions'

const COUNTIES = [
  'Carlow','Cavan','Clare','Cork','Donegal','Dublin','Galway','Kerry','Kildare',
  'Kilkenny','Laois','Leitrim','Limerick','Longford','Louth','Mayo','Meath',
  'Monaghan','Offaly','Roscommon','Sligo','Tipperary','Waterford','Westmeath',
  'Wexford','Wicklow',
]

const INPUT = 'w-full rounded-lg border border-[#2A1515] bg-[#140909] px-4 py-3 text-sm text-[#F5EDD0] placeholder-[#5C4A3A] transition-colors focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706]'

export default function NewEventPage() {
  return (
    <div className="py-2">
      <h1 className="mb-1 text-lg font-bold text-white">Create an event</h1>
      <p className="mb-6 text-xs text-[#8B7B6B]">Events are visible to all members.</p>

      <form action={createEvent} className="space-y-4">
        <div>
          <label htmlFor="title" className="mb-1.5 block text-xs font-semibold text-[#8B7B6B]">Event name</label>
          <input id="title" name="title" type="text" required maxLength={120}
            placeholder="What is the event called?"
            className={INPUT} />
        </div>
        <div>
          <label htmlFor="description" className="mb-1.5 block text-xs font-semibold text-[#8B7B6B]">Description</label>
          <textarea id="description" name="description" required rows={4} maxLength={1000}
            placeholder="What will happen? Who should come?"
            className={`${INPUT} resize-none`} />
        </div>
        <div>
          <label htmlFor="location" className="mb-1.5 block text-xs font-semibold text-[#8B7B6B]">Location</label>
          <input id="location" name="location" type="text" required maxLength={200}
            placeholder="Address or venue name"
            className={INPUT} />
        </div>
        <div>
          <label htmlFor="county" className="mb-1.5 block text-xs font-semibold text-[#8B7B6B]">County</label>
          <select id="county" name="county" required className={`${INPUT} appearance-none`}>
            <option value="" className="bg-[#1E0E0E]">Select county</option>
            {COUNTIES.map(c => <option key={c} value={c} className="bg-[#1E0E0E]">{c}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="startsAt" className="mb-1.5 block text-xs font-semibold text-[#8B7B6B]">Date &amp; time</label>
          <input id="startsAt" name="startsAt" type="datetime-local" required
            className={INPUT} />
        </div>
        <button type="submit"
          className="w-full rounded-lg bg-[#D97706] py-3 text-sm font-bold text-[#1C0D0D] transition-opacity hover:opacity-90">
          Create event
        </button>
      </form>
    </div>
  )
}
```

- [ ] **Step 3: Add "Create event" link to `app/(app)/events/page.tsx`**

Same pattern as petitions: wrap heading in flex row, add `<Link href="/events/new" ...>+ New</Link>`.

- [ ] **Step 4: Commit**
```bash
git add lib/actions.ts app/\(app\)/events/
git commit -m "feat(events): member event creation form"
```

---

### Task 3: County filtering on events and petitions

**Files:**
- Modify: `app/(app)/events/page.tsx`
- Modify: `app/(app)/petitions/page.tsx`

**Context:** Users have a county in their profile. Events already have a `county` field. Petitions do not have a county field — filter only on events. Use URL search params (`?county=Cork`) so filters are shareable and server-rendered.

- [ ] **Step 1: Update `app/(app)/events/page.tsx` to accept and apply county filter**

Make the page accept `searchParams`:
```tsx
export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ county?: string }>
}) {
  const { county } = await searchParams

  const rows = await db.select().from(events)
    .where(
      county
        ? and(gte(events.startsAt, new Date()), eq(events.county, county))
        : gte(events.startsAt, new Date())
    )
    .orderBy(events.startsAt)
    .limit(50)
  // ... rest of render
```

Add `eq` and `and` to the drizzle import if not already present.

- [ ] **Step 2: Add county filter pill strip to `app/(app)/events/page.tsx`**

Below the heading, above the event list:
```tsx
const COUNTIES = ['Carlow','Cavan','Clare','Cork','Donegal','Dublin','Galway','Kerry',
  'Kildare','Kilkenny','Laois','Leitrim','Limerick','Longford','Louth','Mayo','Meath',
  'Monaghan','Offaly','Roscommon','Sligo','Tipperary','Waterford','Westmeath','Wexford','Wicklow']

// In JSX:
<div className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none">
  <Link
    href="/events"
    className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
      !county ? 'bg-[#D97706] text-[#1C0D0D]' : 'border border-[#2A1515] text-[#8B7B6B]'
    }`}
  >
    All
  </Link>
  {COUNTIES.map(c => (
    <Link
      key={c}
      href={`/events?county=${c}`}
      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
        county === c ? 'bg-[#D97706] text-[#1C0D0D]' : 'border border-[#2A1515] text-[#8B7B6B]'
      }`}
    >
      {c}
    </Link>
  ))}
</div>
```

- [ ] **Step 3: Commit**
```bash
git add app/\(app\)/events/page.tsx app/\(app\)/petitions/page.tsx
git commit -m "feat(filter): county filter pill strip on events page"
```

---

## Phase 2 — Admin Panel

### Task 4: Admin layout + role guard

**Files:**
- Create: `app/(admin)/layout.tsx`
- Create: `app/(admin)/admin-guard.ts` — server-side role check helper

**Context:** Middleware already redirects unauthenticated users away from `/admin`. We also need to block members who are authenticated but not admin/moderator. The `user.role` field is a string (`'member'` | `'moderator'` | `'admin'`).

- [ ] **Step 1: Create `app/(admin)/admin-guard.ts`**

```ts
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

export async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  const role = (session.user as Record<string, unknown>).role as string
  if (role !== 'admin' && role !== 'moderator') redirect('/feed')
  return session
}

export async function requireSuperAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  const role = (session.user as Record<string, unknown>).role as string
  if (role !== 'admin') redirect('/feed')
  return session
}
```

- [ ] **Step 2: Create `app/(admin)/layout.tsx`**

```tsx
import Link from 'next/link'
import { VoadiLogo } from '@/components/voadi-logo'
import { LayoutDashboard, CalendarDays, FileText, Users, Bell, Heart } from 'lucide-react'

const NAV = [
  { href: '/admin',          label: 'Dashboard',    Icon: LayoutDashboard },
  { href: '/admin/members',  label: 'Members',      Icon: Users },
  { href: '/admin/events',   label: 'Events',       Icon: CalendarDays },
  { href: '/admin/petitions',label: 'Petitions',    Icon: FileText },
  { href: '/admin/missing',  label: 'Missing',      Icon: Bell },
  { href: '/admin/push',     label: 'Push',         Icon: Bell },
  { href: '/admin/donate',   label: 'Donations',    Icon: Heart },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh bg-[#0A0404]">
      {/* Sidebar */}
      <aside className="hidden w-52 shrink-0 flex-col border-r border-[#2A1515] bg-[#0D0505] lg:flex">
        <div className="border-b border-[#2A1515] px-5 py-5">
          <VoadiLogo size="sm" />
          <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[#D97706]">Admin</p>
        </div>
        <nav className="flex-1 space-y-0.5 px-2 py-4">
          {NAV.map(({ href, label, Icon }) => (
            <Link key={href} href={href}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-[#5C4040] transition-colors hover:bg-[#2A1515] hover:text-[#F5EDD0]">
              <Icon size={14} aria-hidden="true" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-[#2A1515] px-4 py-4">
          <Link href="/feed" className="text-xs text-[#3D2020] hover:text-[#8B7B6B]">← Back to app</Link>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="fixed left-0 right-0 top-0 z-10 flex items-center justify-between border-b border-[#2A1515] bg-[#0D0505] px-4 py-3 lg:hidden">
        <VoadiLogo size="sm" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#D97706]">Admin</span>
        <Link href="/feed" className="text-xs text-[#5C4040]">Exit</Link>
      </div>

      <main className="flex-1 overflow-auto px-4 pb-10 pt-16 lg:px-8 lg:pt-8">
        {children}
      </main>
    </div>
  )
}
```

- [ ] **Step 3: Commit**
```bash
git add app/\(admin\)/
git commit -m "feat(admin): layout and role guard"
```

---

### Task 5: Admin dashboard

**Files:**
- Create: `app/(admin)/page.tsx`

- [ ] **Step 1: Create `app/(admin)/page.tsx`**

```tsx
export const dynamic = 'force-dynamic'
import { requireAdmin } from './admin-guard'
import { db } from '@/lib/db'
import { users, events, petitions, helpPosts, missingPersons } from '@/lib/db/schema'
import { count, gte } from 'drizzle-orm'

export const metadata = { title: 'Admin — VOADI' }

export default async function AdminPage() {
  await requireAdmin()

  const now = new Date()
  const [
    [{ total: totalMembers }],
    [{ total: upcomingEvents }],
    [{ total: openPetitions }],
    [{ total: openHelp }],
    [{ total: pendingMissing }],
  ] = await Promise.all([
    db.select({ total: count() }).from(users),
    db.select({ total: count() }).from(events).where(gte(events.startsAt, now)),
    db.select({ total: count() }).from(petitions),
    db.select({ total: count() }).from(helpPosts),
    db.select({ total: count() }).from(missingPersons),
  ])

  const stats = [
    { label: 'Members',          value: totalMembers,    colour: 'text-[#D97706]' },
    { label: 'Upcoming events',  value: upcomingEvents,  colour: 'text-[#16A34A]' },
    { label: 'Petitions',        value: openPetitions,   colour: 'text-blue-400'  },
    { label: 'Help posts',       value: openHelp,        colour: 'text-purple-400'},
    { label: 'Pending missing',  value: pendingMissing,  colour: 'text-red-400'   },
  ]

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-white">Dashboard</h1>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map(({ label, value, colour }) => (
          <div key={label} className="rounded-xl border border-[#2A1515] bg-[#1E0E0E] p-4">
            <p className={`text-2xl font-bold ${colour}`}>{value}</p>
            <p className="mt-1 text-xs text-[#5C4040]">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**
```bash
git add app/\(admin\)/page.tsx
git commit -m "feat(admin): dashboard with platform stats"
```

---

### Task 6: Admin members page

**Files:**
- Create: `app/(admin)/members/page.tsx`
- Create: `app/(admin)/members/actions.ts`

- [ ] **Step 1: Create `app/(admin)/members/actions.ts`**

```ts
'use server'
import { requireAdmin } from '../admin-guard'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function setMemberRole(userId: string, role: 'member' | 'moderator' | 'admin') {
  await requireAdmin()
  await db.update(users).set({ role }).where(eq(users.id, userId))
  revalidatePath('/admin/members')
}
```

- [ ] **Step 2: Create `app/(admin)/members/page.tsx`**

```tsx
export const dynamic = 'force-dynamic'
import { requireAdmin } from '../admin-guard'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'
import { setMemberRole } from './actions'

export const metadata = { title: 'Members — Admin' }

export default async function AdminMembersPage() {
  await requireAdmin()
  const members = await db.select().from(users).orderBy(desc(users.createdAt)).limit(200)

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-white">Members</h1>
      <div className="overflow-hidden rounded-xl border border-[#2A1515]">
        {members.map(m => (
          <div key={m.id}
            className="flex items-center gap-3 border-b border-[#2A1515] bg-[#1E0E0E] px-4 py-3 last:border-0">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#F5EDD0]">{m.name}</p>
              <p className="text-xs text-[#5C4040]">{m.email} · {m.county}</p>
            </div>
            <form action={setMemberRole.bind(null, m.id, 'member')}>
              <RolePill current={m.role} />
            </form>
          </div>
        ))}
      </div>
    </div>
  )
}

function RolePill({ current }: { current: string }) {
  const colours: Record<string, string> = {
    admin:     'bg-[#D97706]/20 text-[#D97706]',
    moderator: 'bg-blue-900/30 text-blue-400',
    member:    'bg-[#2A1515] text-[#5C4040]',
  }
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${colours[current] ?? colours.member}`}>
      {current}
    </span>
  )
}
```

- [ ] **Step 3: Add inline role change form**

Replace the `<RolePill>` section with a proper `<select>` + submit:
```tsx
<form className="flex items-center gap-2">
  <input type="hidden" name="userId" value={m.id} />
  <select name="role" defaultValue={m.role}
    className="rounded-lg border border-[#2A1515] bg-[#140909] px-2 py-1 text-xs text-[#F5EDD0] focus:border-[#D97706] focus:outline-none">
    <option value="member">member</option>
    <option value="moderator">moderator</option>
    <option value="admin">admin</option>
  </select>
  <button formAction={async (fd: FormData) => {
    'use server'
    // inline — but better to use a dedicated server action
  }}>Save</button>
</form>
```

Actually use a simpler approach — link-based role change buttons. Replace the form section with three small buttons:

```tsx
<div className="flex gap-1">
  {(['member', 'moderator', 'admin'] as const).map(r => (
    <form key={r} action={setMemberRole.bind(null, m.id, r)}>
      <button type="submit"
        className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide transition-colors ${
          m.role === r
            ? r === 'admin' ? 'bg-[#D97706] text-[#1C0D0D]'
            : r === 'moderator' ? 'bg-blue-600 text-white'
            : 'bg-[#2A1515] text-[#8B7B6B]'
            : 'border border-[#2A1515] text-[#3D2020] hover:text-[#8B7B6B]'
        }`}>
        {r}
      </button>
    </form>
  ))}
</div>
```

- [ ] **Step 4: Commit**
```bash
git add app/\(admin\)/members/
git commit -m "feat(admin): members page with role management"
```

---

### Task 7: Admin content moderation (events, petitions, missing persons)

**Files:**
- Create: `app/(admin)/events/page.tsx`
- Create: `app/(admin)/petitions/page.tsx`
- Create: `app/(admin)/missing/page.tsx`
- Create: `app/(admin)/content-actions.ts`

- [ ] **Step 1: Create `app/(admin)/content-actions.ts`**

```ts
'use server'
import { requireAdmin } from './admin-guard'
import { db } from '@/lib/db'
import { events, petitions, missingPersons } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function deleteEvent(id: string) {
  await requireAdmin()
  await db.delete(events).where(eq(events.id, id))
  revalidatePath('/admin/events')
  revalidatePath('/events')
}

export async function deletePetition(id: string) {
  await requireAdmin()
  await db.delete(petitions).where(eq(petitions.id, id))
  revalidatePath('/admin/petitions')
  revalidatePath('/petitions')
}

export async function approveMissingPerson(id: string, adminUserId: string) {
  await requireAdmin()
  await db.update(missingPersons)
    .set({ status: 'published', approvedBy: adminUserId })
    .where(eq(missingPersons.id, id))
  revalidatePath('/admin/missing')
  revalidatePath('/missing')
}

export async function rejectMissingPerson(id: string) {
  await requireAdmin()
  await db.delete(missingPersons).where(eq(missingPersons.id, id))
  revalidatePath('/admin/missing')
}
```

- [ ] **Step 2: Create `app/(admin)/events/page.tsx`**

```tsx
export const dynamic = 'force-dynamic'
import { requireAdmin } from '../admin-guard'
import { db } from '@/lib/db'
import { events, users } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
import { deleteEvent } from '../content-actions'
import { Trash2 } from 'lucide-react'

export const metadata = { title: 'Events — Admin' }

export default async function AdminEventsPage() {
  await requireAdmin()
  const rows = await db
    .select({ event: events, creator: users })
    .from(events)
    .leftJoin(users, eq(events.createdBy, users.id))
    .orderBy(desc(events.createdAt))
    .limit(100)

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-white">Events ({rows.length})</h1>
      <div className="overflow-hidden rounded-xl border border-[#2A1515]">
        {rows.length === 0 && (
          <p className="px-4 py-6 text-center text-xs text-[#3D2020]">No events yet.</p>
        )}
        {rows.map(({ event: e, creator }) => (
          <div key={e.id} className="flex items-start gap-3 border-b border-[#2A1515] bg-[#1E0E0E] px-4 py-3 last:border-0">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#F5EDD0]">{e.title}</p>
              <p className="text-xs text-[#5C4040]">
                {e.county} · {e.startsAt.toLocaleDateString('en-GB')} · by {creator?.name ?? 'unknown'}
              </p>
            </div>
            <form action={deleteEvent.bind(null, e.id)}>
              <button type="submit"
                className="rounded-lg border border-red-900/50 p-1.5 text-red-700 transition-colors hover:text-red-400">
                <Trash2 size={13} />
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create `app/(admin)/petitions/page.tsx`** (same pattern as events, swap `events` for `petitions`, show `signatureCount`):

```tsx
export const dynamic = 'force-dynamic'
import { requireAdmin } from '../admin-guard'
import { db } from '@/lib/db'
import { petitions, users } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
import { deletePetition } from '../content-actions'
import { Trash2 } from 'lucide-react'

export const metadata = { title: 'Petitions — Admin' }

export default async function AdminPetitionsPage() {
  await requireAdmin()
  const rows = await db
    .select({ petition: petitions, creator: users })
    .from(petitions)
    .leftJoin(users, eq(petitions.createdBy, users.id))
    .orderBy(desc(petitions.createdAt))
    .limit(100)

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-white">Petitions ({rows.length})</h1>
      <div className="overflow-hidden rounded-xl border border-[#2A1515]">
        {rows.length === 0 && (
          <p className="px-4 py-6 text-center text-xs text-[#3D2020]">No petitions yet.</p>
        )}
        {rows.map(({ petition: p, creator }) => (
          <div key={p.id} className="flex items-start gap-3 border-b border-[#2A1515] bg-[#1E0E0E] px-4 py-3 last:border-0">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#F5EDD0]">{p.title}</p>
              <p className="text-xs text-[#5C4040]">
                {p.signatureCount} signatures · {p.status} · by {creator?.name ?? 'unknown'}
              </p>
            </div>
            <form action={deletePetition.bind(null, p.id)}>
              <button type="submit"
                className="rounded-lg border border-red-900/50 p-1.5 text-red-700 transition-colors hover:text-red-400">
                <Trash2 size={13} />
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create `app/(admin)/missing/page.tsx`**

```tsx
export const dynamic = 'force-dynamic'
import { requireAdmin } from '../admin-guard'
import { db } from '@/lib/db'
import { missingPersons, users } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
import { approveMissingPerson, rejectMissingPerson } from '../content-actions'
import { CheckCircle, XCircle } from 'lucide-react'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'

export const metadata = { title: 'Missing Persons — Admin' }

export default async function AdminMissingPage() {
  const session = await requireAdmin()
  const rows = await db
    .select({ person: missingPersons, submitter: users })
    .from(missingPersons)
    .leftJoin(users, eq(missingPersons.submittedBy, users.id))
    .orderBy(desc(missingPersons.createdAt))
    .limit(100)

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-white">Missing Persons</h1>
      <div className="overflow-hidden rounded-xl border border-[#2A1515]">
        {rows.length === 0 && (
          <p className="px-4 py-6 text-center text-xs text-[#3D2020]">No reports.</p>
        )}
        {rows.map(({ person: p, submitter }) => (
          <div key={p.id} className="flex items-start gap-3 border-b border-[#2A1515] bg-[#1E0E0E] px-4 py-3 last:border-0">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-[#F5EDD0]">{p.fullName}</p>
                <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${
                  p.status === 'pending' ? 'bg-[#D97706]/20 text-[#D97706]'
                  : p.status === 'published' ? 'bg-green-900/30 text-green-400'
                  : 'bg-[#2A1515] text-[#5C4040]'
                }`}>{p.status}</span>
              </div>
              <p className="text-xs text-[#5C4040]">
                Last seen: {p.lastSeenLocation} · by {submitter?.name ?? 'unknown'}
              </p>
            </div>
            {p.status === 'pending' && (
              <div className="flex gap-1.5">
                <form action={approveMissingPerson.bind(null, p.id, session.user.id)}>
                  <button type="submit" className="rounded-lg border border-green-900/50 p-1.5 text-green-700 hover:text-green-400">
                    <CheckCircle size={14} />
                  </button>
                </form>
                <form action={rejectMissingPerson.bind(null, p.id)}>
                  <button type="submit" className="rounded-lg border border-red-900/50 p-1.5 text-red-700 hover:text-red-400">
                    <XCircle size={14} />
                  </button>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Commit**
```bash
git add app/\(admin\)/
git commit -m "feat(admin): content moderation for events, petitions, missing persons"
```

---

## Phase 3 — Transactional Email (Resend)

### Task 8: Resend setup + welcome email

**Files:**
- Install: `resend` npm package
- Create: `lib/email/index.ts`
- Create: `lib/email/templates/welcome.tsx`
- Modify: `lib/actions.ts` — send welcome email after first sign-in (via better-auth hook is complex; instead trigger from a post-signup redirect server action)

**Context:** better-auth does not expose an `onAfterSignUp` server hook cleanly. Simplest approach: create a `/api/welcome` route that the signup page calls after successful auth, or use a separate `sendWelcomeEmail` server action that the signup page calls post-redirect. Cleanest: add a `/api/auth/on-signup` route-level hook using better-auth's `on` hooks if available; otherwise call from the redirect in the signup client.

Actually, better-auth supports `hooks.after` in auth config. Use that.

- [ ] **Step 1: Install Resend**
```bash
npm install resend
```

- [ ] **Step 2: Create `lib/email/index.ts`**

```ts
import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string
  subject: string
  react: React.ReactElement
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[email] RESEND_API_KEY not set — skipping send')
    return
  }
  await resend.emails.send({
    from: 'VOADI <hello@voadi.org>',
    to,
    subject,
    react,
  })
}
```

- [ ] **Step 3: Create `lib/email/templates/welcome.tsx`**

```tsx
import * as React from 'react'

export function WelcomeEmail({ name }: { name: string }) {
  return (
    <div style={{ fontFamily: 'Georgia, serif', background: '#140909', color: '#F5EDD0', padding: '40px 24px', maxWidth: '520px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#F5EDD0', letterSpacing: '-0.02em' }}>
          <span style={{ color: '#D97706' }}>V</span>OADI
        </span>
      </div>
      <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#F5EDD0', marginBottom: '12px' }}>
        Welcome, {name}.
      </h1>
      <p style={{ fontSize: '15px', lineHeight: '1.7', color: '#A89080', marginBottom: '24px' }}>
        You have joined VOADI — the civic platform for the African diaspora in Ireland.
        Your voice matters here.
      </p>
      <p style={{ fontSize: '15px', lineHeight: '1.7', color: '#A89080', marginBottom: '32px' }}>
        Here is what you can do right now:
      </p>
      <ul style={{ color: '#A89080', fontSize: '14px', lineHeight: '2', paddingLeft: '20px', marginBottom: '32px' }}>
        <li>Browse the <strong style={{ color: '#F5EDD0' }}>Resources</strong> directory — 60+ free services most people never hear about</li>
        <li>Sign or start a <strong style={{ color: '#F5EDD0' }}>Petition</strong> on something that matters to you</li>
        <li>Find <strong style={{ color: '#F5EDD0' }}>Events</strong> in your county</li>
        <li>Ask for or offer help in the <strong style={{ color: '#F5EDD0' }}>Help Hub</strong></li>
      </ul>
      <a href="https://voadi.org/feed"
        style={{ display: 'inline-block', background: '#D97706', color: '#1C0D0D', fontWeight: 'bold', fontSize: '14px', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none' }}>
        Go to the app →
      </a>
      <p style={{ marginTop: '40px', fontSize: '12px', color: '#3D2020' }}>
        VOADI — Coalition of Africans Diaspora Ireland · voadi.org
      </p>
    </div>
  )
}
```

- [ ] **Step 4: Add `RESEND_API_KEY` to `.env` and VPS environment**

In `.env` (local):
```
RESEND_API_KEY=re_your_key_here
```

On VPS, add to `/opt/voadi/.env`:
```bash
ssh cph-vps "echo 'RESEND_API_KEY=re_your_key_here' >> /opt/voadi/.env"
```

- [ ] **Step 5: Wire welcome email into better-auth via `lib/auth/index.ts`**

Add `hooks` to the betterAuth config:
```ts
import { sendEmail } from '@/lib/email'
import { WelcomeEmail } from '@/lib/email/templates/welcome'
import * as React from 'react'

// Inside betterAuth({ ... }):
hooks: {
  after: [
    {
      matcher: (ctx) => ctx.path === '/sign-up/email' && ctx.response?.status === 200,
      handler: async (ctx) => {
        const body = ctx.body as { name?: string; email?: string } | undefined
        if (body?.email && body?.name) {
          await sendEmail({
            to: body.email,
            subject: 'Welcome to VOADI',
            react: React.createElement(WelcomeEmail, { name: body.name }),
          }).catch(console.error)
        }
      },
    },
  ],
},
```

- [ ] **Step 6: Commit**
```bash
git add lib/email/ lib/auth/index.ts
git commit -m "feat(email): Resend setup + welcome email on signup"
```

---

## Phase 4 — Push Notifications

### Task 9: Web Push setup + subscription

**Files:**
- Install: `web-push` npm package + `@types/web-push`
- Create: `lib/push/index.ts`
- Create: `components/push/push-subscribe.tsx` — client component
- Modify: `app/(app)/profile/page.tsx` — add subscribe button
- Create: `app/api/push/subscribe/route.ts`
- Modify: `app/(admin)/push/page.tsx` — admin send push UI
- Create: `app/(admin)/push/send-push-action.ts`

- [ ] **Step 1: Install web-push**
```bash
npm install web-push
npm install --save-dev @types/web-push
```

- [ ] **Step 2: Generate VAPID keys (run once, save to .env)**
```bash
node -e "const wp = require('web-push'); const keys = wp.generateVAPIDKeys(); console.log('VAPID_PUBLIC_KEY=' + keys.publicKey); console.log('VAPID_PRIVATE_KEY=' + keys.privateKey);"
```
Copy output to `.env` and VPS `.env`.

- [ ] **Step 3: Create `lib/push/index.ts`**

```ts
import webpush from 'web-push'

webpush.setVapidDetails(
  'mailto:hello@voadi.org',
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
)

export async function sendPush(
  subscription: { endpoint: string; p256dh: string; auth: string },
  payload: { title: string; body: string; url?: string },
) {
  await webpush.sendNotification(
    {
      endpoint: subscription.endpoint,
      keys: { p256dh: subscription.p256dh, auth: subscription.auth },
    },
    JSON.stringify(payload),
  )
}

export { webpush }
```

- [ ] **Step 4: Create `app/api/push/subscribe/route.ts`**

```ts
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { pushSubscriptions } from '@/lib/db/schema'

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { endpoint, keys } = await req.json() as {
    endpoint: string
    keys: { p256dh: string; auth: string }
  }

  await db.insert(pushSubscriptions)
    .values({
      userId: session.user.id,
      endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
    })
    .onConflictDoNothing()

  return NextResponse.json({ ok: true })
}
```

- [ ] **Step 5: Create `components/push/push-subscribe.tsx`**

```tsx
'use client'

import { useState } from 'react'
import { Bell, BellOff } from 'lucide-react'

export function PushSubscribe({ vapidPublicKey }: { vapidPublicKey: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'subscribed' | 'denied'>('idle')

  async function subscribe() {
    setStatus('loading')
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey,
      })
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub),
      })
      setStatus('subscribed')
    } catch {
      setStatus('denied')
    }
  }

  if (status === 'subscribed') {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-[#2A1515] bg-[#1E0E0E] px-4 py-3">
        <Bell size={14} className="text-[#D97706]" />
        <span className="text-xs text-[#8B7B6B]">Push notifications enabled</span>
      </div>
    )
  }

  return (
    <button
      onClick={subscribe}
      disabled={status === 'loading' || status === 'denied'}
      className="flex w-full items-center gap-2 rounded-xl border border-[#2A1515] bg-[#1E0E0E] px-4 py-3 text-left transition-colors hover:border-[#D97706]/50 disabled:opacity-50"
    >
      {status === 'denied' ? <BellOff size={14} className="text-[#5C4040]" /> : <Bell size={14} className="text-[#D97706]" />}
      <span className="text-xs text-[#8B7B6B]">
        {status === 'loading' ? 'Enabling…' : status === 'denied' ? 'Notifications blocked in browser settings' : 'Enable push notifications'}
      </span>
    </button>
  )
}
```

- [ ] **Step 6: Add `PushSubscribe` to `app/(app)/profile/page.tsx`**

```tsx
import { PushSubscribe } from '@/components/push/push-subscribe'

// In the JSX, below the details block and above legal links:
<div className="mb-6">
  <PushSubscribe vapidPublicKey={process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? ''} />
</div>
```

Add `NEXT_PUBLIC_VAPID_PUBLIC_KEY=<same value as VAPID_PUBLIC_KEY>` to `.env`.

- [ ] **Step 7: Create `app/(admin)/push/send-push-action.ts`**

```ts
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
    title, body, url,
    sentBy: session.user.id,
    type: 'urgent',
  })

  const results = await Promise.allSettled(
    subs.map(s => sendPush({ endpoint: s.endpoint, p256dh: s.p256dh, auth: s.auth }, { title, body, url }))
  )

  const failed = results.filter(r => r.status === 'rejected').length
  console.log(`Push sent: ${subs.length - failed} ok, ${failed} failed`)
  revalidatePath('/admin/push')
}
```

- [ ] **Step 8: Create `app/(admin)/push/page.tsx`**

```tsx
export const dynamic = 'force-dynamic'
import { requireAdmin } from '../admin-guard'
import { db } from '@/lib/db'
import { pushSubscriptions, pushNotifications } from '@/lib/db/schema'
import { count, desc } from 'drizzle-orm'
import { sendPushToAll } from './send-push-action'

const INPUT = 'w-full rounded-lg border border-[#2A1515] bg-[#140909] px-4 py-3 text-sm text-[#F5EDD0] placeholder-[#5C4A3A] transition-colors focus:border-[#D97706] focus:outline-none'

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
        <h1 className="mb-1 text-xl font-bold text-white">Push Notifications</h1>
        <p className="text-sm text-[#5C4040]">{subCount} active subscribers</p>
      </div>

      <form action={sendPushToAll} className="space-y-4 rounded-xl border border-[#2A1515] bg-[#1E0E0E] p-5">
        <h2 className="text-sm font-bold text-[#F5EDD0]">Send to all subscribers</h2>
        <input name="title" type="text" required placeholder="Notification title" className={INPUT} />
        <textarea name="body" required rows={3} placeholder="Message body" className={`${INPUT} resize-none`} />
        <input name="url" type="text" placeholder="Link (default: /feed)" className={INPUT} />
        <button type="submit" className="rounded-lg bg-[#D97706] px-5 py-2.5 text-sm font-bold text-[#1C0D0D] hover:opacity-90">
          Send now
        </button>
      </form>

      {recentPushes.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-bold text-[#F5EDD0]">Recent pushes</h2>
          <div className="overflow-hidden rounded-xl border border-[#2A1515]">
            {recentPushes.map(p => (
              <div key={p.id} className="border-b border-[#2A1515] bg-[#1E0E0E] px-4 py-3 last:border-0">
                <p className="text-sm font-semibold text-[#F5EDD0]">{p.title}</p>
                <p className="text-xs text-[#5C4040]">{p.body}</p>
                <p className="mt-1 text-[10px] text-[#3D2020]">{p.sentAt.toLocaleDateString('en-GB')}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 9: Update service worker to handle push events**

Add to `public/sw.js` (append — do not delete existing content):
```js
self.addEventListener('push', (event) => {
  if (!event.data) return
  const { title, body, url } = event.data.json()
  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-48.png',
      data: { url },
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification.data?.url ?? '/'
  event.waitUntil(clients.openWindow(url))
})
```

- [ ] **Step 10: Commit**
```bash
git add lib/push/ components/push/ app/api/push/ app/\(admin\)/push/ app/\(app\)/profile/page.tsx public/sw.js
git commit -m "feat(push): Web Push VAPID subscriptions + admin broadcast"
```

---

## Phase 5 — Search

### Task 10: Global search page

**Files:**
- Create: `app/(app)/search/page.tsx`
- Modify: `components/layout/header.tsx` — add search icon/link

**Context:** Search across `petitions.title`, `events.title`, `helpPosts.title` using Drizzle `ilike`. Use URL query param `?q=` for server-side rendering.

- [ ] **Step 1: Create `app/(app)/search/page.tsx`**

```tsx
export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { db } from '@/lib/db'
import { petitions, events, helpPosts } from '@/lib/db/schema'
import { ilike, or, gte } from 'drizzle-orm'
import { Search } from 'lucide-react'

export const metadata = { title: 'Search — VOADI' }

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const query = q?.trim() ?? ''

  const [matchingPetitions, matchingEvents, matchingHelp] = query.length >= 2
    ? await Promise.all([
        db.select().from(petitions).where(ilike(petitions.title, `%${query}%`)).limit(10),
        db.select().from(events).where(
          ilike(events.title, `%${query}%`)
        ).limit(10),
        db.select().from(helpPosts).where(ilike(helpPosts.title, `%${query}%`)).limit(10),
      ])
    : [[], [], []]

  const total = matchingPetitions.length + matchingEvents.length + matchingHelp.length

  return (
    <div className="py-2">
      <h1 className="mb-4 text-lg font-bold text-white">Search</h1>

      <form method="GET" className="mb-6">
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5C4040]" aria-hidden="true" />
          <input
            name="q"
            type="search"
            defaultValue={query}
            placeholder="Search events, petitions, help posts…"
            autoFocus
            className="w-full rounded-xl border border-[#2A1515] bg-[#1E0E0E] py-3 pl-10 pr-4 text-sm text-[#F5EDD0] placeholder-[#3D2828] focus:border-[#D97706] focus:outline-none"
          />
        </div>
      </form>

      {query.length >= 2 && (
        <p className="mb-4 text-xs text-[#5C4040]">{total} result{total !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;</p>
      )}

      {matchingPetitions.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-[#5C4040]">Petitions</h2>
          <div className="space-y-2">
            {matchingPetitions.map(p => (
              <Link key={p.id} href={`/petitions/${p.id}`}
                className="block rounded-xl border border-[#2A1515] bg-[#1E0E0E] px-4 py-3 hover:border-[#D97706]/50">
                <p className="text-sm font-semibold text-[#F5EDD0]">{p.title}</p>
                <p className="text-xs text-[#5C4040]">{p.signatureCount} signatures</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {matchingEvents.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-[#5C4040]">Events</h2>
          <div className="space-y-2">
            {matchingEvents.map(e => (
              <Link key={e.id} href={`/events/${e.id}`}
                className="block rounded-xl border border-[#2A1515] bg-[#1E0E0E] px-4 py-3 hover:border-[#D97706]/50">
                <p className="text-sm font-semibold text-[#F5EDD0]">{e.title}</p>
                <p className="text-xs text-[#5C4040]">{e.county} · {e.startsAt.toLocaleDateString('en-GB')}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {matchingHelp.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-[#5C4040]">Help Hub</h2>
          <div className="space-y-2">
            {matchingHelp.map(h => (
              <Link key={h.id} href="/help"
                className="block rounded-xl border border-[#2A1515] bg-[#1E0E0E] px-4 py-3 hover:border-[#D97706]/50">
                <p className="text-sm font-semibold text-[#F5EDD0]">{h.title}</p>
                <p className="text-xs text-[#5C4040]">{h.category}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {query.length >= 2 && total === 0 && (
        <div className="rounded-xl border border-[#2A1515] bg-[#1E0E0E] p-8 text-center">
          <p className="text-sm text-[#5C4040]">No results for &ldquo;{query}&rdquo;</p>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Add search icon to `components/layout/header.tsx`**

Read the current header, then add a `<Link href="/search">` with a `<Search>` lucide icon next to the profile icon.

- [ ] **Step 3: Add `/search` to protected prefixes in `middleware.ts`**

```ts
const PROTECTED_PREFIXES = [
  '/feed', '/events', '/petitions', '/politicians', '/missing', '/help', '/admin', '/search',
]
```

- [ ] **Step 4: Commit**
```bash
git add app/\(app\)/search/ components/layout/header.tsx middleware.ts
git commit -m "feat(search): global search across petitions, events, help posts"
```

---

## Phase 6 — Donations UI

### Task 11: Donations page

**Files:**
- Create: `app/(app)/donate/page.tsx` — client component with amount selector + Stripe redirect
- Modify: `app/(app)/profile/page.tsx` — add "Support VOADI" link

**Context:** The Stripe backend is fully wired at `POST /api/donations/checkout`. It accepts `{ amount: number, recurring: boolean }` and returns `{ url: string }`. This task is purely frontend.

- [ ] **Step 1: Create `app/(app)/donate/page.tsx`**

```tsx
'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'

const AMOUNTS = [5, 10, 25, 50]

export default function DonatePage() {
  const [amount, setAmount] = useState(10)
  const [custom, setCustom] = useState('')
  const [recurring, setRecurring] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const effectiveAmount = custom ? Number(custom) : amount

  async function handleCheckout() {
    if (!effectiveAmount || effectiveAmount < 1) {
      setError('Please enter a valid amount.')
      return
    }
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/donations/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: effectiveAmount, recurring }),
      })
      const data = await res.json() as { url?: string; error?: string }
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error ?? 'Something went wrong.')
        setLoading(false)
      }
    } catch {
      setError('Network error — please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="py-2">
      <div className="mb-6 flex items-center gap-2">
        <Heart size={18} className="text-[#D97706]" aria-hidden="true" />
        <h1 className="text-lg font-bold text-white">Support VOADI</h1>
      </div>

      <p className="mb-6 text-sm leading-relaxed text-[#8B7B6B]">
        VOADI runs entirely on voluntary contributions from the community. Every euro goes directly to platform costs, legal resources, and community programmes. No salaries. No ads. No outside influence.
      </p>

      {/* One-off / monthly toggle */}
      <div className="mb-5 flex rounded-xl border border-[#2A1515] bg-[#1E0E0E] p-1">
        {[false, true].map(r => (
          <button key={String(r)}
            onClick={() => setRecurring(r)}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition-colors ${
              recurring === r ? 'bg-[#D97706] text-[#1C0D0D]' : 'text-[#5C4040]'
            }`}>
            {r ? 'Monthly' : 'One-off'}
          </button>
        ))}
      </div>

      {/* Amount pills */}
      <div className="mb-4 grid grid-cols-4 gap-2">
        {AMOUNTS.map(a => (
          <button key={a}
            onClick={() => { setAmount(a); setCustom('') }}
            className={`rounded-xl border py-3 text-sm font-bold transition-colors ${
              !custom && amount === a
                ? 'border-[#D97706] bg-[#D97706]/10 text-[#D97706]'
                : 'border-[#2A1515] bg-[#1E0E0E] text-[#8B7B6B] hover:border-[#D97706]/50'
            }`}>
            €{a}
          </button>
        ))}
      </div>

      {/* Custom amount */}
      <div className="mb-6">
        <input
          type="number"
          min="1"
          max="10000"
          placeholder="Custom amount (€)"
          value={custom}
          onChange={e => setCustom(e.target.value)}
          className="w-full rounded-xl border border-[#2A1515] bg-[#1E0E0E] px-4 py-3 text-sm text-[#F5EDD0] placeholder-[#3D2828] focus:border-[#D97706] focus:outline-none"
        />
      </div>

      {error && (
        <p className="mb-4 rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">{error}</p>
      )}

      <button
        onClick={handleCheckout}
        disabled={loading || !effectiveAmount || effectiveAmount < 1}
        className="w-full rounded-xl bg-[#D97706] py-4 text-sm font-bold text-[#1C0D0D] transition-opacity hover:opacity-90 disabled:opacity-50">
        {loading ? 'Redirecting…' : `Contribute €${effectiveAmount || '—'}${recurring ? '/month' : ''}`}
      </button>

      <p className="mt-4 text-center text-xs text-[#3D2020]">
        Secure payment via Stripe. VOADI is not a registered charity — contributions are not tax-deductible.
      </p>
    </div>
  )
}
```

- [ ] **Step 2: Add `/donate` to `middleware.ts` protected prefixes**

```ts
const PROTECTED_PREFIXES = [
  '/feed', '/events', '/petitions', '/politicians', '/missing', '/help', '/admin', '/search', '/donate',
]
```

- [ ] **Step 3: Add "Support VOADI" link in `app/(app)/profile/page.tsx`**

In the legal links section (or above it), add:
```tsx
<Link href="/donate"
  className="mb-4 flex items-center justify-between rounded-xl border border-[#D97706]/30 bg-[#D97706]/5 px-4 py-3 hover:bg-[#D97706]/10">
  <span className="text-xs font-semibold text-[#D97706]">Support VOADI</span>
  <span className="text-xs text-[#D97706]">›</span>
</Link>
```

- [ ] **Step 4: Commit**
```bash
git add app/\(app\)/donate/ app/\(app\)/profile/page.tsx middleware.ts
git commit -m "feat(donations): Stripe checkout UI with amount selector and monthly toggle"
```

---

## Phase 7 — Deploy

### Task 12: Final deploy

- [ ] **Step 1: Verify `.env` on VPS has all new variables**
```bash
ssh cph-vps "grep -E 'RESEND|VAPID|STRIPE' /opt/voadi/.env"
```
Required:
- `RESEND_API_KEY`
- `VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY` (same value as `VAPID_PUBLIC_KEY`)
- `STRIPE_SECRET_KEY` (should already be present)

- [ ] **Step 2: Push all commits**
```bash
git push
```

- [ ] **Step 3: Deploy**
```bash
ssh cph-vps "cd /opt/voadi && git pull && docker compose -f docker/docker-compose.prod.yml --env-file .env build web && docker compose -f docker/docker-compose.prod.yml --env-file .env up -d web"
```

- [ ] **Step 4: Smoke test**
- Sign up as a new user → check welcome email arrives
- Create a petition → verify it appears in `/petitions`
- Create an event → verify it appears in `/events`
- Apply county filter on events → verify filter works
- Visit `/admin` as a member → should redirect to `/feed`
- Promote self to admin via DB → visit `/admin` → see dashboard
- Subscribe to push via profile → send test push from `/admin/push`
- Search "test" → results page renders
- Visit `/donate` → Stripe checkout loads

---

## Environment variables summary

| Variable | Where set | Description |
|---|---|---|
| `RESEND_API_KEY` | `.env` + VPS | Resend API key from resend.com |
| `VAPID_PUBLIC_KEY` | `.env` + VPS | Generated via `node -e "require('web-push').generateVAPIDKeys()"` |
| `VAPID_PRIVATE_KEY` | `.env` + VPS | Same generation command |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | `.env` + VPS | Same value as `VAPID_PUBLIC_KEY` (needs NEXT_PUBLIC_ prefix for client) |
| `STRIPE_SECRET_KEY` | Already in VPS `.env` | Stripe dashboard |
