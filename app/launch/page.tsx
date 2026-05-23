'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/lib/auth/client'
import { VoadiLogo } from '@/components/voadi-logo'

export default function LaunchPage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()

  useEffect(() => {
    if (isPending) return
    if (session) {
      router.replace('/feed')
    } else {
      router.replace('/login')
    }
  }, [session, isPending, router])

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-8 bg-[#FFFFFF]">
      <VoadiLogo size="lg" />
      <Spinner />
    </div>
  )
}

function Spinner() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className="animate-spin text-[#D97706]"
      aria-label="Loading"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="31.416"
        strokeDashoffset="23.562"
        opacity="0.25"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
