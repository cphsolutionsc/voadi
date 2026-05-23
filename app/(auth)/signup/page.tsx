'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth/client'
import Link from 'next/link'
import { CountrySelect } from '@/components/ui/country-select'

const COUNTIES = [
  'Carlow', 'Cavan', 'Clare', 'Cork', 'Donegal', 'Dublin',
  'Galway', 'Kerry', 'Kildare', 'Kilkenny', 'Laois', 'Leitrim',
  'Limerick', 'Longford', 'Louth', 'Mayo', 'Meath', 'Monaghan',
  'Offaly', 'Roscommon', 'Sligo', 'Tipperary', 'Waterford',
  'Westmeath', 'Wexford', 'Wicklow',
]

const INPUT =
  'w-full rounded-lg border border-[#2A1515] bg-[#140909] px-4 py-3 text-sm text-[#F5EDD0] placeholder-[#5C4A3A] transition-colors focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706]'

export default function SignupPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [verifyEmail, setVerifyEmail] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const email = form.get('email') as string
    const result = await authClient.signUp.email({
      email,
      password: form.get('password') as string,
      name: form.get('name') as string,
      // @ts-expect-error additional fields
      county: form.get('county') as string,
      nationality: form.get('nationality') as string || undefined,
      countryOfBirth: form.get('countryOfBirth') as string || undefined,
      callbackURL: '/feed',
    })

    if (result.error) {
      setError(result.error.message ?? 'Sign up failed. Please try again.')
      setLoading(false)
      return
    }

    setVerifyEmail(email)
    setLoading(false)
  }

  if (verifyEmail) {
    return (
      <div className="space-y-4">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#F5EDD0]">Check your inbox</h2>
          <p className="mt-1 text-sm text-[#8B7B6B]">We sent a verification link to <strong className="text-[#F5EDD0]">{verifyEmail}</strong></p>
        </div>
        <div className="rounded-xl border border-[#2A1515] bg-[#1E0E0E] px-4 py-5 text-sm leading-relaxed text-[#8B7B6B]">
          Click the link in the email to activate your account. Check your spam folder if you do not see it within a few minutes.
        </div>
        <p className="pt-1 text-center text-sm text-[#8B7B6B]">
          Already verified?{' '}
          <Link href="/login" className="font-medium text-[#F5EDD0] underline underline-offset-2 hover:text-white">
            Sign in
          </Link>
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#F5EDD0]">Create your account</h2>
        <p className="mt-1 text-sm text-[#8B7B6B]">Free to join. Takes under a minute.</p>
      </div>

      {error && (
        <p role="alert" className="rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}

      <input
        name="name"
        type="text"
        placeholder="Full name"
        required
        autoComplete="name"
        className={INPUT}
      />
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
        placeholder="Password (min 8 characters)"
        minLength={8}
        required
        autoComplete="new-password"
        className={INPUT}
      />

      <div>
        <label htmlFor="county" className="sr-only">County of residence</label>
        <select
          id="county"
          name="county"
          required
          className={`${INPUT} appearance-none`}
        >
          <option value="" className="bg-[#1E0E0E]">County of residence</option>
          {COUNTIES.map(c => (
            <option key={c} value={c} className="bg-[#1E0E0E]">{c}</option>
          ))}
        </select>
      </div>

      <CountrySelect
        name="nationality"
        placeholder="Nationality (optional)"
        valueType="nationality"
      />

      <CountrySelect
        name="countryOfBirth"
        placeholder="Country of birth (optional)"
        valueType="country"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-[#D97706] py-3 text-sm font-bold text-[#1C0D0D] transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {loading ? 'Creating account…' : 'Create account'}
      </button>

      <p className="pt-1 text-center text-sm text-[#8B7B6B]">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-[#F5EDD0] underline underline-offset-2 hover:text-white">
          Sign in
        </Link>
      </p>
    </form>
  )
}
