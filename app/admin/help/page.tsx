export const dynamic = 'force-dynamic'
import { requireAdmin } from '../admin-guard'
import { db } from '@/lib/db'
import { helpPosts, users } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
import { closeHelpPost } from '../content-actions'
import { CheckCircle } from 'lucide-react'

export const metadata = { title: 'Help Hub — Admin' }

export default async function AdminHelpPage() {
  await requireAdmin()
  const posts = await db
    .select({
      id: helpPosts.id,
      title: helpPosts.title,
      category: helpPosts.category,
      status: helpPosts.status,
      createdAt: helpPosts.createdAt,
      authorName: users.name,
    })
    .from(helpPosts)
    .leftJoin(users, eq(helpPosts.createdBy, users.id))
    .orderBy(desc(helpPosts.createdAt))
    .limit(100)

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-white">Help Hub ({posts.length})</h1>
      <div className="overflow-hidden rounded-xl border border-[#2A1515]">
        {posts.length === 0 && (
          <p className="px-4 py-6 text-center text-xs text-[#3D2020]">No help posts yet.</p>
        )}
        {posts.map((post) => (
          <div key={post.id} className="flex items-start gap-3 border-b border-[#2A1515] bg-[#1E0E0E] px-4 py-3 last:border-0">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-[#F5EDD0]">{post.title}</p>
                <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${
                  post.status === 'open'
                    ? 'bg-green-900/30 text-green-400'
                    : 'bg-[#2A1515] text-[#5C4040]'
                }`}>{post.status}</span>
              </div>
              <p className="text-xs text-[#5C4040]">
                {post.category} · {post.createdAt.toLocaleDateString('en-GB')} · by {post.authorName ?? 'unknown'}
              </p>
            </div>
            {post.status === 'open' && (
              <form action={closeHelpPost.bind(null, post.id)}>
                <button
                  type="submit"
                  title="Mark as resolved"
                  className="rounded-lg border border-green-900/40 p-1.5 text-green-700 transition-colours hover:text-green-400"
                >
                  <CheckCircle size={13} aria-hidden="true" />
                </button>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
