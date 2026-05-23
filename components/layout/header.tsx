import Link from 'next/link'

export function Header({ title }: { title?: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#2A1515] bg-[#140909]/95 px-4 py-3 backdrop-blur-sm">
      <div className="mx-auto flex max-w-lg items-center justify-between">
        <Link href="/feed" className="text-lg font-bold tracking-tight text-white" aria-label="VOADI home">
          {title ?? <><span>VOADI</span><span className="text-[#16a34a]">.</span></>}
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-xs text-[#5C4A3A] transition-colors hover:text-[#8B7B6B]"
          >
            Back to site
          </Link>
        </div>
      </div>
    </header>
  )
}
