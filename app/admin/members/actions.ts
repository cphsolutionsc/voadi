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

export async function verifyMemberEmail(userId: string) {
  await requireAdmin()
  await db.update(users).set({ emailVerified: true }).where(eq(users.id, userId))
  revalidatePath('/admin/members')
}
