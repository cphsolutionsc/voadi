'use client'

import { useState } from 'react'
import type { CATEGORIES } from './page'

type Category = typeof CATEGORIES[number]
type Resource = Category['resources'][number]
type Guide = Category['guides'][number]

const ICONS: Record<string, (colour: string) => React.ReactNode> = {
  scale: (c) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={c} aria-hidden="true">
      <path d="M12 3v18M3 9l9-6 9 6M5 21h14" />
      <path d="M3 9l4 8H3M21 9l-4 8h4" />
    </svg>
  ),
  home: (c) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={c} aria-hidden="true">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  passport: (c) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={c} aria-hidden="true">
      <rect x="3" y="2" width="18" height="20" rx="2" />
      <circle cx="12" cy="10" r="3" />
      <path d="M9 17h6M9 14h6" />
    </svg>
  ),
  shield: (c) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={c} aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  briefcase: (c) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={c} aria-hidden="true">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2M12 12v4M10 14h4" />
    </svg>
  ),
  heart: (c) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={c} aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  ),
}

function PhoneIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.21a2 2 0 012-2.18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 6.97a16 16 0 006.29 6.29l1.13-1.34a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  )
}

function ExternalIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
    </svg>
  )
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <div className="rounded-xl border border-[#2A1515] bg-[#1E0E0E] p-4">
      <div className="mb-2 flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-[#F5EDD0]">{resource.name}</h3>
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-full bg-[#2A1515] p-1.5 text-[#8B7B6B] transition-colors hover:text-[#D97706]"
          aria-label={`Visit ${resource.name}`}
        >
          <ExternalIcon />
        </a>
      </div>
      <p className="mb-3 text-xs leading-relaxed text-[#A89080]">{resource.desc}</p>
      <div className="flex flex-wrap items-center gap-2">
        {resource.phone && (
          <a
            href={`tel:${resource.phone.replace(/\s/g, '')}`}
            className="flex items-center gap-1 rounded-full border border-[#2A1515] bg-[#140909] px-2 py-1 text-[10px] font-medium text-[#8B7B6B] transition-colors hover:text-[#F5EDD0]"
          >
            <PhoneIcon />
            {resource.phone}
          </a>
        )}
        {resource.tags.map(tag => (
          <span key={tag} className="rounded-full bg-[#2A1515] px-2 py-0.5 text-[10px] text-[#8B7B6B]">
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

function GuideCard({ guide }: { guide: Guide }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="overflow-hidden rounded-xl border border-[#2A1515] bg-[#1E0E0E]">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-[#F5EDD0]">{guide.title}</span>
        <ChevronIcon open={open} />
      </button>
      {open && (
        <ol className="border-t border-[#2A1515] px-4 py-3 space-y-2">
          {guide.steps.map((step, i) => (
            <li key={i} className="flex gap-3 text-xs leading-relaxed text-[#A89080]">
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#2A1515] text-[10px] font-bold text-[#D97706]">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

function CategoryPanel({ category }: { category: Category }) {
  const [tab, setTab] = useState<'resources' | 'guides'>('resources')
  return (
    <div>
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setTab('resources')}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
            tab === 'resources' ? 'bg-[#D97706] text-[#1C0D0D]' : 'border border-[#2A1515] text-[#8B7B6B]'
          }`}
        >
          Organisations
        </button>
        <button
          onClick={() => setTab('guides')}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
            tab === 'guides' ? 'bg-[#D97706] text-[#1C0D0D]' : 'border border-[#2A1515] text-[#8B7B6B]'
          }`}
        >
          Step-by-step guides
        </button>
      </div>

      {tab === 'resources' && (
        <div className="space-y-3">
          {category.resources.map(r => (
            <ResourceCard key={r.name} resource={r} />
          ))}
        </div>
      )}

      {tab === 'guides' && (
        <div className="space-y-3">
          {category.guides.map(g => (
            <GuideCard key={g.title} guide={g} />
          ))}
        </div>
      )}
    </div>
  )
}

export function ResourcesClient({ categories }: { categories: typeof CATEGORIES }) {
  const [activeId, setActiveId] = useState<string>(categories[0].id)
  const active = categories.find(c => c.id === activeId) ?? categories[0]

  return (
    <div className="py-2">
      <h1 className="mb-1 text-lg font-bold text-white">Resources</h1>
      <p className="mb-5 text-xs leading-relaxed text-[#8B7B6B]">
        Free services, legal help, and step-by-step guides for navigating life in Ireland.
      </p>

      {/* Category selector */}
      <div className="mb-5 -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none">
        {categories.map(cat => {
          const isActive = cat.id === activeId
          const icon = ICONS[cat.icon]
          return (
            <button
              key={cat.id}
              onClick={() => setActiveId(cat.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                isActive
                  ? `${cat.bg} ${cat.colour} ring-1 ring-current/30`
                  : 'border border-[#2A1515] text-[#8B7B6B]'
              }`}
            >
              {icon && icon(isActive ? cat.colour : 'text-[#8B7B6B]')}
              {cat.label}
            </button>
          )
        })}
      </div>

      {/* Active category header */}
      <div className={`mb-4 rounded-xl ${active.bg} border border-[#2A1515] p-4`}>
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 ${active.colour}`}>
            {ICONS[active.icon]?.(active.colour)}
          </div>
          <div>
            <h2 className={`font-bold ${active.colour}`}>{active.label}</h2>
            <p className="mt-0.5 text-xs leading-relaxed text-[#A89080]">{active.description}</p>
          </div>
        </div>
      </div>

      <CategoryPanel key={activeId} category={active} />
    </div>
  )
}
