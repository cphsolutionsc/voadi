import Link from 'next/link'
import type { PostMeta } from '@/lib/blog'

interface PostCardProps {
  post: PostMeta
  featured?: boolean
}

export function PostCard({ post, featured = false }: PostCardProps) {
  const dateStr = new Date(post.date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  if (featured) {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group block overflow-hidden rounded-2xl border border-[#2A1515] bg-[#1E0E0E] transition-colors hover:border-[#4A2828]"
      >
        <div className="aspect-[16/7] w-full bg-[#2A1515]">
          {post.coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.coverImage}
              alt={post.title}
              className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-90"
            />
          )}
        </div>
        <div className="p-6">
          <div className="mb-3 flex items-center gap-3">
            <span className="rounded-full bg-[#2A1515] px-3 py-1 text-xs font-medium text-[#D97706]">
              {post.category}
            </span>
            <span className="text-xs text-[#8B7B6B]">{post.readingTime}</span>
          </div>
          <h2 className="mb-2 text-xl font-bold leading-snug text-white transition-colors group-hover:text-[#D97706]">
            {post.title}
          </h2>
          <p className="mb-4 line-clamp-2 text-sm text-[#A89080]">{post.excerpt}</p>
          <div className="flex items-center justify-between text-xs text-[#8B7B6B]">
            <span>{post.author}</span>
            <time dateTime={post.date}>{dateStr}</time>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex gap-4 rounded-xl border border-[#2A1515] bg-[#1E0E0E] p-4 transition-colors hover:border-[#4A2828]"
    >
      {post.coverImage && (
        <div className="h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-[#2A1515]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImage}
            alt={post.title}
            className="h-full w-full object-cover opacity-80"
          />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-xs font-medium text-[#D97706]">{post.category}</span>
          <span className="text-xs text-[#8B7B6B]">{post.readingTime}</span>
        </div>
        <h3 className="mb-1 line-clamp-2 text-sm font-bold leading-snug text-white transition-colors group-hover:text-[#D97706]">
          {post.title}
        </h3>
        <time className="text-xs text-[#8B7B6B]" dateTime={post.date}>{dateStr}</time>
      </div>
    </Link>
  )
}
