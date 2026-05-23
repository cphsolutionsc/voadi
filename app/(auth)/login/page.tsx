'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { authClient } from '@/lib/auth/client'
import Link from 'next/link'

const INPUT =
  'w-full rounded-lg border border-[#2A1515] bg-[#140909] px-4 py-3 text-sm text-[#F5EDD0] placeholder-[#5C4A3A] transition-colors focus:border-[#16a34a] focus:outline-none focus:ring-1 focus:ring-[#16a34a]'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/feed'
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const result = await authClient.signIn.email({
      email: form.get('email') as string,
      password: form.get('password') as string,
    })

    if (result.error) {
      setError('Invalid email or password.')
      setLoading(false)
      return
    }

    router.push(callbackUrl)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#F5EDD0]">Sign in</h2>
        <p className="mt-1 text-sm text-[#5C4A3A]">Welcome back to the community.</p>
      </div>

      {error && (
        <p role="alert" className="rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}

      <input
        name="email"
        type="email"
        placeholder="Email address"
        required
        autoComplete="email"
        className={INPUT}
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        required
        autoComplete="current-password"
        className={INPUT}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-[#D97706] py-3 text-sm font-bold text-[#1C0D0D] transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {loading ? 'Signing in…' : 'Sign in'}
      </button>

      <p className="pt-1 text-center text-sm text-[#5C4A3A]">
        New to VOADI?{' '}
        <Link href="/signup" className="font-medium text-[#F5EDD0] underline underline-offset-2 hover:text-white">
          Create account
        </Link>
      </p>
    </form>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
