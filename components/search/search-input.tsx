'use client'

import { useRouter } from 'next/navigation'
import { useRef, useState, useTransition } from 'react'
import { Search, X } from 'lucide-react'

export function SearchInput({ initialQuery }: { initialQuery: string }) {
  const router = useRouter()
  const [value, setValue] = useState(initialQuery)
  const [isPending, startTransition] = useTransition()
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value
    setValue(q)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      startTransition(() => {
        router.push(
          q.trim() ? `/search?q=${encodeURIComponent(q.trim())}` : '/search',
          { scroll: false },
        )
      })
    }, 280)
  }

  function clear() {
    setValue('')
    clearTimeout(timerRef.current)
    startTransition(() => { router.push('/search', { scroll: false }) })
  }

  return (
    <div className="relative">
      <Search
        size={15}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]"
        aria-hidden="true"
      />
      <input
        type="search"
        inputMode="search"
        enterKeyHint="search"
        autoFocus
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        value={value}
        onChange={handleChange}
        placeholder="Search events, petitions, help..."
        className={`w-full rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] py-3 pl-10 pr-10 text-sm text-[#111827] placeholder-[#9CA3AF] transition-opacity focus:border-[#D97706] focus:outline-none ${isPending ? 'opacity-60' : ''}`}
      />
      {value && (
        <button
          type="button"
          onClick={clear}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-[#9CA3AF] transition-colors hover:text-[#4B5563]"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}
