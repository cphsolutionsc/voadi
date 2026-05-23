import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'VOADI — One Voice, One Ireland',
  description:
    'Mobilising the African diaspora across Ireland — civic action, community, events, and support.',
}

function StarIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 0 L14.59 8.41 L23 8.41 L16.45 13.59 L19.05 22 L12 17.27 L4.95 22 L7.55 13.59 L1 8.41 L9.41 8.41 Z" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  )
}

function ArrowUpRightIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="16" y2="18" />
    </svg>
  )
}

function FistIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 14V9a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v5" />
      <path d="M10 13V7a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v6" />
      <path d="M14 13V8a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v6a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6v-2" />
    </svg>
  )
}

function SpinnerIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}

function IrelandMap() {
  return (
    <svg
      width="80"
      height="90"
      viewBox="0 0 80 90"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M38 5 C30 5 22 8 18 14 C12 20 10 28 8 35 C6 42 5 50 8 57 C11 64 16 70 22 75 C28 80 36 83 44 82 C52 81 60 76 65 69 C70 62 72 53 70 44 C68 35 63 27 57 21 C51 15 46 5 38 5Z"
        fill="currentColor"
        className="text-[#2A1515]"
      />
    </svg>
  )
}

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Community', href: '#community' },
  { label: 'Events', href: '#events' },
  { label: 'About', href: '#about' },
  { label: 'Login', href: '/login' },
] as const

const SCATTERED_STARS: ReadonlyArray<{
  className: string
  size: number
}> = [
  { className: 'top-[12%] left-[18%]', size: 14 },
  { className: 'top-[8%] right-[25%]', size: 16 },
  { className: 'top-[35%] left-[8%]', size: 12 },
  { className: 'top-[20%] right-[12%]', size: 18 },
  { className: 'top-[55%] left-[25%]', size: 14 },
  { className: 'top-[60%] right-[30%]', size: 12 },
  { className: 'top-[15%] left-[42%]', size: 24 },
  { className: 'top-[70%] right-[15%]', size: 16 },
]

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#1C0D0D] font-sans text-[#F5EDD0]">
      <nav className="flex items-center justify-between px-8 py-5">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-white"
          aria-label="VOADI home"
        >
          VOADI<span className="text-[#16a34a]">.</span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm text-[#8B7B6B] transition-colors hover:text-[#F5EDD0]"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          aria-label="Open menu"
          className="text-[#F5EDD0] transition-opacity hover:opacity-70"
        >
          <MenuIcon />
        </button>
      </nav>

      <section className="relative min-h-[88vh] w-full">
        {SCATTERED_STARS.map(star => (
          <span
            key={star.className}
            aria-hidden="true"
            className={`absolute z-[5] text-[#7C3D3D] opacity-60 ${star.className}`}
          >
            <StarIcon size={star.size} />
          </span>
        ))}

        <div className="absolute left-1/2 top-0 z-10 h-[58%] w-72 -translate-x-1/2 overflow-hidden rounded-b-[2rem] bg-[#16a34a] sm:w-80">
          <Image
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80"
            alt="A diverse community group standing together"
            fill
            sizes="(min-width: 640px) 320px, 288px"
            className="object-cover object-top"
            priority
          />
        </div>

        <div className="absolute left-0 right-0 top-[42%] z-20 flex flex-col items-center text-center">
          <h1 className="px-4 font-display text-[clamp(72px,13vw,160px)] uppercase leading-[0.88] tracking-tight text-[#F5EDD0]">
            <span className="block">ONE VOICE</span>
            <span className="block">ONE IRELAND</span>
          </h1>

          <Link
            href="/signup"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#D97706] py-3.5 pl-8 pr-2 text-sm font-bold text-[#1C0D0D] transition-transform hover:-translate-y-0.5"
          >
            <span>JOIN VOADI</span>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1C0D0D] text-[#D97706]">
              <FistIcon />
            </span>
          </Link>
        </div>

        <div className="absolute left-8 top-[42%] z-30 w-44 overflow-hidden rounded-2xl bg-[#2A1515] p-3 sm:left-12">
          <div className="relative">
            <div className="relative h-16 w-16 overflow-hidden rounded-xl">
              <Image
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80"
                alt=""
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <span className="absolute left-10 top-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#D97706] text-[#1C0D0D] ring-4 ring-[#2A1515]">
              <PlayIcon />
            </span>
          </div>
          <p className="mt-4 text-[10px] uppercase tracking-widest text-[#8B7B6B]">
            About
          </p>
          <p className="text-sm font-semibold text-white">Our Story</p>
        </div>

        <div className="absolute right-8 top-[52%] z-30 w-36 rounded-2xl bg-[#2A1515] p-1 sm:right-12">
          <div className="relative h-36 w-full overflow-hidden rounded-xl">
            <Image
              src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80"
              alt=""
              fill
              sizes="144px"
              className="object-cover"
            />
          </div>
          <div className="flex items-end justify-between gap-2 px-2 pb-2 pt-3">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#8B7B6B]">
                Meet our
              </p>
              <p className="text-xs font-semibold text-white">community</p>
            </div>
            <Link
              href="#community"
              aria-label="Meet our community"
              className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5EDD0] text-[#1C0D0D] transition-transform hover:-translate-y-0.5"
            >
              <ArrowUpRightIcon />
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 px-8 py-10 md:grid-cols-3 md:px-12">
        <div>
          <p className="mb-3 text-xs uppercase tracking-widest text-[#D97706]">
            Our Mission
          </p>
          <p className="text-lg font-medium leading-snug text-[#F5EDD0]">
            Mobilising Africans across Ireland for real political and social
            change.
          </p>
        </div>

        <div className="relative flex flex-col items-center rounded-2xl bg-[#F5EDD0] p-5 text-[#1C0D0D]">
          <span className="absolute left-5 top-5 inline-flex rounded-full bg-[#1C0D0D] px-2 py-0.5 text-xs text-[#F5EDD0]">
            New
          </span>
          <p className="mt-3 text-2xl font-bold">
            voadi<span className="text-[#16a34a]">.org</span>
          </p>
          <div className="my-2">
            <IrelandMap />
          </div>
          <Link
            href="#about"
            className="mt-1 text-xs text-[#6B5B4E] transition-colors hover:text-[#1C0D0D]"
          >
            Learn More →
          </Link>
        </div>

        <div className="flex items-start gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#2A1515]">
            <Image
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80"
              alt=""
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
          <span className="mt-1 text-[#D97706]" aria-hidden="true">
            <SpinnerIcon />
          </span>
          <p className="text-lg leading-snug">
            <span className="text-[#8B7B6B]">United with </span>
            <span className="font-bold text-white">passion,</span>
            <span className="text-[#8B7B6B]"> rise with the </span>
            <span className="font-bold text-white">community</span>
            <span className="text-[#8B7B6B]"> of Ireland.</span>
          </p>
        </div>
      </section>

      <footer className="flex items-center justify-between border-t border-[#2A1515] px-8 py-4">
        <p className="text-xs text-[#5C4A3A]">
          © 2026 VOADI · Coalition of Africans Diaspora Ireland
        </p>
        <p className="text-xs text-[#5C4A3A]">voadi.org</p>
      </footer>
    </main>
  )
}
