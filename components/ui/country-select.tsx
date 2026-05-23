'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { ChevronDown, Search, X, Check } from 'lucide-react'
import { ALL_COUNTRIES, type Country } from '@/lib/countries'
import * as Flags from 'country-flag-icons/react/3x2'

interface CountrySelectProps {
  name: string
  placeholder: string
  /** 'nationality' — stores the nationality string; 'country' — stores the country name */
  valueType?: 'nationality' | 'country'
  defaultValue?: string
  required?: boolean
}

type FlagMap = Record<string, React.ComponentType<{ className?: string; title?: string }>>

const FlagComponents = Flags as unknown as FlagMap

function Flag({ code, className }: { code: string; className?: string }) {
  const FlagComponent = FlagComponents[code]
  if (!FlagComponent) return <span className="inline-block h-3 w-4 rounded-sm bg-[#9CA3AF]" />
  return <FlagComponent className={className} title={code} />
}

export function CountrySelect({
  name,
  placeholder,
  valueType = 'country',
  defaultValue,
  required,
}: CountrySelectProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Country | null>(() => {
    if (!defaultValue) return null
    return ALL_COUNTRIES.find(c =>
      valueType === 'nationality' ? c.nationality === defaultValue : c.name === defaultValue
    ) ?? null
  })

  const containerRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const filtered = query.trim()
    ? ALL_COUNTRIES.filter(c =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.nationality.toLowerCase().includes(query.toLowerCase())
      )
    : ALL_COUNTRIES

  const hiddenValue = selected
    ? (valueType === 'nationality' ? selected.nationality : selected.name)
    : ''

  // Close on outside click
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  // Focus search on open
  useEffect(() => {
    if (open) {
      setTimeout(() => searchRef.current?.focus(), 50)
    } else {
      setQuery('')
    }
  }, [open])

  const select = useCallback((country: Country) => {
    setSelected(country)
    setOpen(false)
  }, [])

  const clear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setSelected(null)
  }, [])

  return (
    <div ref={containerRef} className="relative">
      {/* Hidden input carries the value for the form */}
      <input type="hidden" name={name} value={hiddenValue} />

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={`flex w-full items-center gap-2.5 rounded-lg border px-4 py-3 text-sm transition-colors ${
          open
            ? 'border-[#D97706] ring-1 ring-[#D97706]'
            : 'border-[#E5E7EB] hover:border-[#9CA3AF]'
        } bg-[#FFFFFF] text-left`}
      >
        {selected ? (
          <>
            <Flag code={selected.code} className="h-3 w-[18px] shrink-0 rounded-[2px]" />
            <span className="flex-1 text-[#111827]">
              {valueType === 'nationality' ? selected.nationality : selected.name}
            </span>
            <button
              type="button"
              onClick={clear}
              className="ml-auto shrink-0 text-[#6B7280] hover:text-[#4B5563]"
              aria-label="Clear selection"
            >
              <X size={13} />
            </button>
          </>
        ) : (
          <>
            <span className="inline-block h-3 w-[18px] shrink-0 rounded-[2px] bg-[#E5E7EB]" />
            <span className="flex-1 text-[#9CA3AF]">{placeholder}</span>
            <ChevronDown size={14} className="shrink-0 text-[#6B7280]" />
          </>
        )}
      </button>

      {/* Required validation shim */}
      {required && (
        <input
          tabIndex={-1}
          required
          value={hiddenValue}
          onChange={() => {}}
          className="pointer-events-none absolute bottom-0 left-4 h-0 w-0 opacity-0"
          aria-hidden="true"
        />
      )}

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] shadow-[0_4px_24px_rgba(0,0,0,0.12)]">
          {/* Search */}
          <div className="flex items-center gap-2 border-b border-[#E5E7EB] px-3 py-2.5">
            <Search size={13} className="shrink-0 text-[#6B7280]" aria-hidden="true" />
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search countries…"
              className="flex-1 bg-transparent text-sm text-[#111827] placeholder-[#9CA3AF] outline-none"
            />
            {query && (
              <button type="button" onClick={() => setQuery('')} className="text-[#6B7280] hover:text-[#4B5563]">
                <X size={12} />
              </button>
            )}
          </div>

          {/* List */}
          <ul className="max-h-56 overflow-y-auto overscroll-contain">
            {filtered.length === 0 && (
              <li className="px-4 py-3 text-xs text-[#9CA3AF]">No countries found.</li>
            )}
            {filtered.map(country => (
              <li key={country.code}>
                <button
                  type="button"
                  onClick={() => select(country)}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-[#FFFFFF] ${
                    selected?.code === country.code ? 'bg-[#FFFFFF] text-[#D97706]' : 'text-[#6B7280]'
                  }`}
                >
                  <Flag code={country.code} className="h-3 w-[18px] shrink-0 rounded-[2px]" />
                  <span className="flex-1 text-left">
                    {valueType === 'nationality' ? country.nationality : country.name}
                  </span>
                  {selected?.code === country.code && (
                    <Check size={11} className="text-[#D97706]" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
