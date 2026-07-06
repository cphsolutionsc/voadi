'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { authClient } from '@/lib/auth/client'
import Link from 'next/link'

const INPUT =
  'w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#111827] placeholder-[#9CA3AF] transition-colors focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706]'

const LABEL = 'mb-1.5 block text-xs font-medium text-[#6B7280]'

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
        <h2 className="text-xl font-bold text-[#111827]">Sign in</h2>
        <p className="mt-1 text-sm text-[#4B5563]">Welcome back to the community.</p>
      </div>

      {error && (
        <p role="alert" className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]">
          {error}
        </p>
      )}

      <div>
        <label htmlFor="login-email" className={LABEL}>Email address</label>
        <input
          id="login-email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          autoComplete="email"
          className={INPUT}
        />
      </div>
      <div>
        <label htmlFor="login-password" className={LABEL}>Password</label>
        <input
          id="login-password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          autoComplete="current-password"
          className={INPUT}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-[#D97706] py-3 text-sm font-bold text-[#111827] transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {loading ? 'Signing in…' : 'Sign in'}
      </button>

      <p className="pt-1 text-center text-sm text-[#4B5563]">
        New to VOADI?{' '}
        <Link href="/signup" className="font-semibold text-[#D97706] hover:underline">
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
