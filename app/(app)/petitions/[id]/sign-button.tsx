'use client'

import { useTransition } from 'react'
import { signPetition } from '@/lib/actions'

export function SignButton({ petitionId, hasSigned }: { petitionId: string; hasSigned: boolean }) {
  const [pending, startTransition] = useTransition()

  return (
    <button
      onClick={() => startTransition(() => signPetition(petitionId))}
      disabled={pending || hasSigned}
      className={`w-full rounded-xl py-3.5 text-sm font-bold transition-colors disabled:opacity-60 ${
        hasSigned
          ? 'border border-[#16a34a] text-[#16a34a]'
          : 'bg-[#16a34a] text-white hover:opacity-90'
      }`}
    >
      {pending ? 'Signing…' : hasSigned ? 'Signed — thank you' : 'Sign this petition'}
    </button>
  )
}
