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
