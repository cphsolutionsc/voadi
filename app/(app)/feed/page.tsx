import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Feed — VOADI',
}

export default function FeedPage() {
  return (
    <div className="space-y-4 py-2">
      <h1 className="text-lg font-bold text-[#F5EDD0]">Community Feed</h1>
      <div className="rounded-2xl border border-[#2A1515] bg-[#1E0E0E] p-6 text-center">
        <p className="text-sm text-[#5C4A3A]">Posts from your community will appear here.</p>
      </div>
    </div>
  )
}
