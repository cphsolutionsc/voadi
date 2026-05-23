import Link from 'next/link'
import { VoadiLogo } from '@/components/voadi-logo'

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-[#0A0404]">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-[#2A1515] bg-[#0A0404]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-5 py-4">
          <Link href="/" className="inline-flex items-center">
            <VoadiLogo size="sm" />
          </Link>
          <Link
            href="/feed"
            className="rounded-full border border-[#2A1515] px-4 py-1.5 text-xs font-semibold text-[#8B7B6B] transition-colors hover:border-[#D97706]/50 hover:text-[#F5EDD0]"
          >
            Back to app
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-2xl px-5 py-10 pb-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#2A1515] px-5 py-8">
        <div className="mx-auto max-w-2xl flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-[#3D2828]">© 2026 VOADI — Coalition of Africans Diaspora Ireland</p>
          <nav className="flex gap-4 text-xs text-[#3D2828]">
            <Link href="/terms" className="hover:text-[#8B7B6B]">Terms</Link>
            <Link href="/privacy" className="hover:text-[#8B7B6B]">Privacy</Link>
            <Link href="/transparency" className="hover:text-[#8B7B6B]">Transparency</Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
