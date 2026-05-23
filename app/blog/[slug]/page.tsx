import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getAllPosts, getPostBySlug, getRelatedPosts } from '@/lib/blog'
import { PostCard } from '@/components/blog/post-card'
import { VoadiLogo } from '@/components/voadi-logo'

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return {
    title: `${post.title} — VOADI Blog`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const related = getRelatedPosts(post.slug, post.category, post.tags)

  const dateStr = new Date(post.date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#E5E7EB] bg-[#FFFFFF]/95 px-4 py-3 backdrop-blur-sm">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Link href="/" aria-label="VOADI home">
            <VoadiLogo size="md" />
          </Link>
          <Link href="/blog" className="text-xs text-[#4B5563] transition-colors hover:text-[#6B7280]">
            ← All posts
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 pb-20 pt-10">
        {/* Cover image */}
        {post.coverImage && (
          <div className="mb-8 aspect-[16/7] w-full overflow-hidden rounded-2xl bg-[#E5E7EB]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImage}
              alt={post.title}
              className="h-full w-full object-cover opacity-80"
            />
          </div>
        )}

        {/* Meta */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Link
            href={`/blog?category=${encodeURIComponent(post.category)}`}
            className="rounded-full bg-[#E5E7EB] px-3 py-1 text-xs font-medium text-[#D97706] transition-colors hover:bg-[#3A2020]"
          >
            {post.category}
          </Link>
          <span className="text-xs text-[#4B5563]">{post.readingTime}</span>
          <time className="text-xs text-[#4B5563]" dateTime={post.date}>{dateStr}</time>
        </div>

        {/* Title */}
        <h1 className="mb-4 text-2xl font-bold leading-snug text-[#111827] sm:text-3xl">{post.title}</h1>

        {/* Author */}
        <p className="mb-8 text-sm text-[#4B5563]">By {post.author}</p>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span
                key={tag}
                className="rounded-full border border-[#E5E7EB] px-3 py-1 text-xs text-[#4B5563]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* MDX content */}
        <div className="prose prose-sm max-w-none
          prose-headings:text-[#111827] prose-headings:font-bold
          prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3
          prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2
          prose-p:text-[#374151] prose-p:leading-relaxed prose-p:mb-4
          prose-a:text-[#D97706] prose-a:no-underline hover:prose-a:underline
          prose-strong:text-[#111827]
          prose-ul:text-[#374151] prose-ol:text-[#374151]
          prose-li:mb-1
          prose-hr:border-[#E5E7EB]
          prose-blockquote:border-l-[#D97706] prose-blockquote:text-[#6B7280]">
          <MDXRemote source={post.content} />
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <section className="mt-12 border-t border-[#E5E7EB] pt-10">
            <h2 className="mb-6 text-lg font-bold text-[#111827]">Related posts</h2>
            <div className="flex flex-col gap-3">
              {related.map(p => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-[#E5E7EB] px-4 py-8 text-center text-xs text-[#4B5563]">
        © 2026 VOADI · Coalition of Africans Diaspora Ireland
      </footer>
    </div>
  )
}
