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
