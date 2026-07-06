export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { db } from '@/lib/db'
import { helpPosts } from '@/lib/db/schema'
import { eq, desc, and } from 'drizzle-orm'
import { Home, Scale, Heart, Briefcase, MessageCircle } from 'lucide-react'

export const metadata = { title: 'Help Hub — VOADI' }

const CATEGORIES = [
  { value: 'housing', label: 'Housing', Icon: Home,          text: 'text-[#1D4ED8]', bg: 'bg-[#DBEAFE]' },
  { value: 'legal',   label: 'Legal',   Icon: Scale,         text: 'text-[#6D28D9]', bg: 'bg-[#EDE9FE]' },
  { value: 'medical', label: 'Medical', Icon: Heart,         text: 'text-[#B91C1C]', bg: 'bg-[#FEE2E2]' },
  { value: 'jobs',    label: 'Jobs',    Icon: Briefcase,     text: 'text-[#92400E]', bg: 'bg-[#FEF3C7]' },
  { value: 'other',   label: 'Other',   Icon: MessageCircle, text: 'text-[#4B5563]', bg: 'bg-[#F3F4F6]' },
] as const

type Category = typeof CATEGORIES[number]['value']

function getCat(value: string) {
  return CATEGORIES.find(c => c.value === value) ?? CATEGORIES[4]
}

export default async function HelpPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>
}) {
  const { cat } = await searchParams
  const validCat = CATEGORIES.find(c => c.value === cat)?.value as Category | undefined

  const posts = await db.select().from(helpPosts)
    .where(
      validCat
        ? and(eq(helpPosts.status, 'open'), eq(helpPosts.category, validCat))
        : eq(helpPosts.status, 'open')
    )
    .orderBy(desc(helpPosts.createdAt))

  return (
    <div className="py-2">
      <div className="mb-1 flex items-center justify-between">
        <h1 className="text-lg font-bold text-[#111827]">Help Hub</h1>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[#F3F4F6] px-3 py-1 text-xs font-medium text-[#4B5563]">
            {posts.length} open
          </span>
          <Link
            href="/help/new"
            className="shrink-0 rounded-full bg-[#D97706] px-3 py-1.5 text-xs font-bold text-[#111827]"
          >
            Ask for help
          </Link>
        </div>
      </div>
      <p className="mb-4 text-xs leading-relaxed text-[#4B5563]">
        Get and give support across housing, legal, medical, and employment.
      </p>

      {/* Category filter chips */}
      <div className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none">
        <Link
          href="/help"
          className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
            !validCat ? 'bg-[#D97706] text-[#111827]' : 'border border-[#E5E7EB] text-[#4B5563]'
          }`}
        >
          All
        </Link>
        {CATEGORIES.map(c => (
          <Link
            key={c.value}
            href={`/help?cat=${c.value}`}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              validCat === c.value ? 'bg-[#D97706] text-[#111827]' : 'border border-[#E5E7EB] text-[#4B5563]'
            }`}
          >
            {c.label}
          </Link>
        ))}
      </div>

      {posts.length === 0 ? (
        <div className="rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] p-10 text-center">
          <p className="mb-1 text-sm font-semibold text-[#111827]">No open posts</p>
          <p className="text-xs text-[#4B5563]">Be the first to ask for or offer help.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map(post => {
            const c = getCat(post.category)
            const date = post.createdAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
            return (
              <div
                key={post.id}
                className="flex gap-3 rounded-xl border border-[#E5E7EB] bg-white p-3.5 transition-colors hover:border-[#D97706]/50"
              >
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${c.bg} ${c.text}`}>
                  <c.Icon size={14} aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wide ${c.text}`}>{c.label}</span>
                    <span className="ml-auto text-[10px] text-[#9CA3AF]">{date}</span>
                  </div>
                  <p className="text-sm font-semibold leading-snug text-[#111827]">{post.title}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-[#6B7280]">{post.body}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
