'use server'

import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import {
  events, eventRsvps, petitions, petitionSignatures,
  missingPersons, helpPosts, townHalls,
} from '@/lib/db/schema'
import { eq, and, sql } from 'drizzle-orm'

async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  return session
}

export async function rsvpEvent(eventId: string) {
  const session = await requireSession()
  await db
    .insert(eventRsvps)
    .values({ eventId, userId: session.user.id })
    .onConflictDoNothing()
  revalidatePath(`/events/${eventId}`)
}

export async function cancelRsvp(eventId: string) {
  const session = await requireSession()
  await db
    .delete(eventRsvps)
    .where(and(
      eq(eventRsvps.eventId, eventId),
      eq(eventRsvps.userId, session.user.id),
    ))
  revalidatePath(`/events/${eventId}`)
}

export async function signPetition(petitionId: string) {
  const session = await requireSession()
  await db.transaction(async tx => {
    await tx
      .insert(petitionSignatures)
      .values({ petitionId, userId: session.user.id })
      .onConflictDoNothing()
    await tx
      .update(petitions)
      .set({ signatureCount: sql`${petitions.signatureCount} + 1` })
      .where(eq(petitions.id, petitionId))
  })
  revalidatePath(`/petitions/${petitionId}`)
}

export async function reportMissingPerson(formData: FormData) {
  const session = await requireSession()
  const fullName    = formData.get('fullName') as string
  const age         = formData.get('age') ? Number(formData.get('age')) : null
  const lastSeen    = formData.get('lastSeenLocation') as string
  const lastSeenAt  = new Date(formData.get('lastSeenAt') as string)
  const description = formData.get('description') as string
  const contactInfo = formData.get('contactInfo') as string

  if (!fullName || !lastSeen || !description || !contactInfo) return

  await db.insert(missingPersons).values({
    fullName, age, lastSeenLocation: lastSeen, lastSeenAt,
    description, contactInfo, submittedBy: session.user.id,
  })
  redirect('/missing')
}

export async function createHelpPost(formData: FormData) {
  const session = await requireSession()
  const title    = formData.get('title') as string
  const body     = formData.get('body') as string
  const category = formData.get('category') as 'housing' | 'legal' | 'medical' | 'jobs' | 'other'

  if (!title || !body || !category) return

  await db.insert(helpPosts).values({
    title, body, category, createdBy: session.user.id,
  })
  redirect('/help')
}

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
