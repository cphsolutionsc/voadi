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
    <div className="min-h-screen bg-[#140909]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#2A1515] bg-[#140909]/95 px-4 py-3 backdrop-blur-sm">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Link href="/" aria-label="VOADI home">
            <VoadiLogo size="md" />
          </Link>
          <Link href="/" className="text-xs text-[#8B7B6B] transition-colors hover:text-[#A89080]">
            Back to site
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 pb-20 pt-10">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Blog</h1>
          <p className="mt-1 text-[#A89080]">
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
                  ? 'bg-[#D97706] text-white'
                  : 'border border-[#2A1515] text-[#8B7B6B] hover:border-[#4A2828] hover:text-[#A89080]'
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
                    ? 'bg-[#D97706] text-white'
                    : 'border border-[#2A1515] text-[#8B7B6B] hover:border-[#4A2828] hover:text-[#A89080]'
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        )}

        {posts.length === 0 && (
          <p className="text-[#8B7B6B]">No posts in this category yet.</p>
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

      <footer className="border-t border-[#2A1515] px-4 py-8 text-center text-xs text-[#8B7B6B]">
        © 2026 VOADI · Coalition of Africans Diaspora Ireland
      </footer>
    </div>
  )
}
