import Link from 'next/link'
import { VoadiLogo } from '@/components/voadi-logo'

export function Header({ title }: { title?: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#2A1515] bg-[#140909]/95 px-4 py-3 backdrop-blur-sm">
      <div className="mx-auto flex max-w-lg items-center justify-between">
        <Link href="/feed" aria-label="VOADI home">
          {title
            ? <span className="text-base font-bold tracking-tight text-white">{title}</span>
            : <VoadiLogo size="md" />
          }
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/profile"
            aria-label="Your profile"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#2A1515] bg-[#1E0E0E] text-[#8B7B6B] transition-colors hover:border-[#D97706] hover:text-[#D97706]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  )
}
