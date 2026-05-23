'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'

const AMOUNTS = [5, 10, 25, 50]

export default function DonatePage() {
  const [amount, setAmount] = useState(10)
  const [custom, setCustom] = useState('')
  const [recurring, setRecurring] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const effectiveAmount = custom ? Number(custom) : amount

  async function handleCheckout() {
    if (!effectiveAmount || effectiveAmount < 1) {
      setError('Please enter a valid amount.')
      return
    }
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/donations/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: effectiveAmount, recurring }),
      })
      const data = await res.json() as { url?: string; error?: string }
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error ?? 'Something went wrong.')
        setLoading(false)
      }
    } catch {
      setError('Network error — please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="py-2">
      <div className="mb-6 flex items-center gap-2">
        <Heart size={18} className="text-[#D97706]" aria-hidden="true" />
        <h1 className="text-lg font-bold text-white">Support VOADI</h1>
      </div>

      <p className="mb-6 text-sm leading-relaxed text-[#8B7B6B]">
        VOADI runs entirely on voluntary contributions from the community. Every euro goes directly to platform costs, legal resources, and community programmes. No salaries. No adverts. No outside influence.
      </p>

      {/* One-off / monthly toggle */}
      <div className="mb-5 flex rounded-xl border border-[#2A1515] bg-[#1E0E0E] p-1">
        {([false, true] as const).map(r => (
          <button
            key={String(r)}
            onClick={() => setRecurring(r)}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition-colors ${
              recurring === r ? 'bg-[#D97706] text-[#1C0D0D]' : 'text-[#5C4040]'
            }`}
          >
            {r ? 'Monthly' : 'One-off'}
          </button>
        ))}
      </div>

      {/* Amount pills */}
      <div className="mb-4 grid grid-cols-4 gap-2">
        {AMOUNTS.map(a => (
          <button
            key={a}
            onClick={() => { setAmount(a); setCustom('') }}
            className={`rounded-xl border py-3 text-sm font-bold transition-colors ${
              !custom && amount === a
                ? 'border-[#D97706] bg-[#D97706]/10 text-[#D97706]'
                : 'border-[#2A1515] bg-[#1E0E0E] text-[#8B7B6B] hover:border-[#D97706]/50'
            }`}
          >
            &euro;{a}
          </button>
        ))}
      </div>

      {/* Custom amount */}
      <div className="mb-6">
        <input
          type="number"
          min="1"
          max="10000"
          placeholder="Custom amount (&euro;)"
          value={custom}
          onChange={e => setCustom(e.target.value)}
          className="w-full rounded-xl border border-[#2A1515] bg-[#1E0E0E] px-4 py-3 text-sm text-[#F5EDD0] placeholder-[#3D2828] focus:border-[#D97706] focus:outline-none"
        />
      </div>

      {error && (
        <p className="mb-4 rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">{error}</p>
      )}

      <button
        onClick={handleCheckout}
        disabled={loading || !effectiveAmount || effectiveAmount < 1}
        className="w-full rounded-xl bg-[#D97706] py-4 text-sm font-bold text-[#1C0D0D] transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {loading ? 'Redirecting…' : `Contribute €${effectiveAmount || '—'}${recurring ? '/month' : ''}`}
      </button>

      <p className="mt-4 text-center text-xs text-[#3D2020]">
        Secure payment via Stripe. VOADI is not a registered charity — contributions are not tax-deductible.
      </p>
    </div>
  )
}
