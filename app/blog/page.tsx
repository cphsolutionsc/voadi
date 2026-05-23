import Link from 'next/link'
import { getAllPosts, getAllCategories } from '@/lib/blog'
import { PostCard } from '@/components/blog/post-card'
import { VoadiLogo } from '@/components/voadi-logo'

export const metadata = {
  title: 'Blog — VOADI',
  description: 'News, insights, and stories from the African Diaspora community in Ireland.',
}

interface BlogPageProps {
  searchParams: Promise<{ category?: string }>
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { category } = await searchParams
  const allPosts = getAllPosts()
  const categories = getAllCategories()

  const posts = category
    ? allPosts.filter(p => p.category === category)
    : allPosts

  const [featured, ...rest] = posts

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#E5E7EB] bg-[#FFFFFF]/95 px-4 py-3 backdrop-blur-sm">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Link href="/" aria-label="VOADI home">
            <VoadiLogo size="md" />
          </Link>
          <Link href="/" className="text-xs text-[#4B5563] transition-colors hover:text-[#6B7280]">
            Back to site
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 pb-20 pt-10">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#111827]">Blog</h1>
          <p className="mt-1 text-[#6B7280]">
            News, insights, and stories from the African Diaspora community in Ireland.
          </p>
        </div>

        {/* Category filter */}
        {categories.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <Link
              href="/blog"
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                !category
                  ? 'bg-[#D97706] text-[#111827]'
                  : 'border border-[#E5E7EB] text-[#4B5563] hover:border-[#4A2828] hover:text-[#6B7280]'
              }`}
            >
              All
            </Link>
            {categories.map(cat => (
              <Link
                key={cat}
                href={`/blog?category=${encodeURIComponent(cat)}`}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  category === cat
                    ? 'bg-[#D97706] text-[#111827]'
                    : 'border border-[#E5E7EB] text-[#4B5563] hover:border-[#4A2828] hover:text-[#6B7280]'
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        )}

        {posts.length === 0 && (
          <p className="text-[#4B5563]">No posts in this category yet.</p>
        )}

        {/* Featured post */}
        {featured && (
          <div className="mb-6">
            <PostCard post={featured} featured />
          </div>
        )}

        {/* Post list */}
        {rest.length > 0 && (
          <div className="flex flex-col gap-3">
            {rest.map(post => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-[#E5E7EB] px-4 py-8 text-center text-xs text-[#4B5563]">
        © 2026 VOADI · Coalition of Africans Diaspora Ireland
      </footer>
    </div>
  )
}
