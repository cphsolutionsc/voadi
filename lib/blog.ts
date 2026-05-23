import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const BLOG_DIR = path.join(process.cwd(), 'content/blog')

export interface Post {
  slug: string
  title: string
  excerpt: string
  date: string
  category: string
  tags: string[]
  author: string
  coverImage: string
  readingTime: string
  content: string
}

export type PostMeta = Omit<Post, 'content'>

function estimateReadingTime(content: string): string {
  const words = content.trim().split(/\s+/).length
  const minutes = Math.max(1, Math.round(words / 200))
  return `${minutes} min read`
}

function slugify(filename: string): string {
  return filename.replace(/\.mdx?$/, '')
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return []

  const files = fs.readdirSync(BLOG_DIR).filter(f => /\.mdx?$/.test(f))

  const posts: PostMeta[] = files.map(file => {
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8')
    const { data, content } = matter(raw)
    return {
      slug: slugify(file),
      title: data.title ?? '',
      excerpt: data.excerpt ?? '',
      date: data.date ?? '',
      category: data.category ?? 'General',
      tags: data.tags ?? [],
      author: data.author ?? 'VOADI',
      coverImage: data.coverImage ?? '',
      readingTime: estimateReadingTime(content),
    }
  })

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string): Post | null {
  const extensions = ['mdx', 'md']
  for (const ext of extensions) {
    const filepath = path.join(BLOG_DIR, `${slug}.${ext}`)
    if (!fs.existsSync(filepath)) continue
    const raw = fs.readFileSync(filepath, 'utf-8')
    const { data, content } = matter(raw)
    return {
      slug,
      title: data.title ?? '',
      excerpt: data.excerpt ?? '',
      date: data.date ?? '',
      category: data.category ?? 'General',
      tags: data.tags ?? [],
      author: data.author ?? 'VOADI',
      coverImage: data.coverImage ?? '',
      readingTime: estimateReadingTime(content),
      content,
    }
  }
  return null
}

export function getRelatedPosts(currentSlug: string, category: string, tags: string[]): PostMeta[] {
  const all = getAllPosts()
  const others = all.filter(p => p.slug !== currentSlug)

  const scored = others.map(post => {
    let score = 0
    if (post.category === category) score += 3
    tags.forEach(tag => { if (post.tags.includes(tag)) score += 1 })
    return { post, score }
  })

  return scored
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ post }) => post)
}

export function getAllCategories(): string[] {
  const posts = getAllPosts()
  const cats = new Set(posts.map(p => p.category))
  return Array.from(cats).sort()
}
