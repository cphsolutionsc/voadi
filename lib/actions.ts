'use server'

import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import {
  eventRsvps, petitions, petitionSignatures,
  missingPersons, helpPosts,
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
