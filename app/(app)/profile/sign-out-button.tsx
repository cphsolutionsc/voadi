'use client'

import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth/client'

export function SignOutButton() {
  const router = useRouter()

  async function handleSignOut() {
    await authClient.signOut()
    router.push('/')
  }

  return (
    <button
      onClick={handleSignOut}
      className="w-full rounded-xl border border-[#9CA3AF] py-3.5 text-sm font-semibold text-[#6B7280] transition-colors hover:border-red-900 hover:text-red-400"
    >
      Sign out
    </button>
  )
}
