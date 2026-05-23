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
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-xs text-[#8B7B6B] transition-colors hover:text-[#8B7B6B]"
          >
            Back to site
          </Link>
        </div>
      </div>
    </header>
  )
}
