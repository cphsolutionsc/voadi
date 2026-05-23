'use client'

import { useState } from 'react'
import {
  Scale, Home, Plane, ShieldCheck, Briefcase, Heart,
  Phone, ExternalLink, ChevronDown,
} from 'lucide-react'
import type { CATEGORIES } from './data'

type Category = typeof CATEGORIES[number]
type Resource = Category['resources'][number]
type Guide = Category['guides'][number]

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  scale:     Scale,
  home:      Home,
  passport:  Plane,
  shield:    ShieldCheck,
  briefcase: Briefcase,
  heart:     Heart,
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
          <ExternalLink size={12} />
        </a>
      </div>
      <p className="mb-3 text-xs leading-relaxed text-[#A89080]">{resource.desc}</p>
      <div className="flex flex-wrap items-center gap-2">
        {resource.phone && (
          <a
            href={`tel:${resource.phone.replace(/\s/g, '')}`}
            className="flex items-center gap-1 rounded-full border border-[#2A1515] bg-[#140909] px-2 py-1 text-[10px] font-medium text-[#8B7B6B] transition-colors hover:text-[#F5EDD0]"
          >
            <Phone size={10} />
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
        <ChevronDown
          size={16}
          className={`shrink-0 text-[#8B7B6B] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
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
  const ActiveIcon = CATEGORY_ICONS[active.icon]

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
          const CatIcon = CATEGORY_ICONS[cat.icon]
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
              {CatIcon && <CatIcon size={14} aria-hidden="true" />}
              {cat.label}
            </button>
          )
        })}
      </div>

      {/* Active category header */}
      <div className={`mb-4 rounded-xl ${active.bg} border border-[#2A1515] p-4`}>
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 ${active.colour}`}>
            {ActiveIcon && <ActiveIcon size={20} aria-hidden="true" />}
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
