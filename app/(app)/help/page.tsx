export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { db } from '@/lib/db'
import { helpPosts } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

export const metadata = { title: 'Help Hub — VOADI' }

const CATEGORIES = [
  { value: 'housing', label: 'Housing' },
  { value: 'legal',   label: 'Legal' },
  { value: 'medical', label: 'Medical' },
  { value: 'jobs',    label: 'Jobs' },
  { value: 'other',   label: 'Other' },
] as const

type Category = typeof CATEGORIES[number]['value']

const CATEGORY_COLOURS: Record<Category, string> = {
  housing: 'text-blue-400 bg-blue-950',
  legal:   'text-purple-400 bg-purple-950',
  medical: 'text-red-400 bg-red-950',
  jobs:    'text-[#D97706] bg-[#E5E7EB]',
  other:   'text-[#4B5563] bg-[#FFFFFF] border border-[#E5E7EB]',
}

export default async function HelpPage() {
  const posts = await db.select().from(helpPosts)
    .where(eq(helpPosts.status, 'open'))
    .orderBy(desc(helpPosts.createdAt))

  return (
    <div className="py-2">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-lg font-bold text-[#111827]">Help Hub</h1>
        <Link
          href="/help/new"
          className="rounded-full bg-[#D97706] px-4 py-2 text-xs font-bold text-[#111827] transition-opacity hover:opacity-90"
        >
          Ask for help
        </Link>
      </div>

      <p className="mb-5 text-xs leading-relaxed text-[#4B5563]">
        Get and give support across housing, legal, medical, and employment. Post a request or offer help to someone who needs it.
      </p>

      {posts.length === 0 ? (
        <div className="rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] p-10 text-center">
          <p className="mb-1 text-sm font-semibold text-[#111827]">No open posts</p>
          <p className="text-xs text-[#4B5563]">Be the first to ask for or offer help.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map(post => {
            const cat = post.category as Category
            const label = CATEGORIES.find(c => c.value === cat)?.label ?? cat
            const colours = CATEGORY_COLOURS[cat] ?? CATEGORY_COLOURS.other
            const date = post.createdAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
            return (
              <div key={post.id} className="rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] p-4 transition-colors hover:border-[#D97706]/50">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <h2 className="font-semibold text-[#111827]">{post.title}</h2>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${colours}`}>{label}</span>
                </div>
                <p className="mb-2 line-clamp-3 text-xs leading-relaxed text-[#6B7280]">{post.body}</p>
                <p className="text-xs text-[#4B5563]">{date}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
