'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// ── Icons ──────────────────────────────────────────────────────────────────

function StarIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0 L14.59 8.41 L23 8.41 L16.45 13.59 L19.05 22 L12 17.27 L4.95 22 L7.55 13.59 L1 8.41 L9.41 8.41 Z" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  )
}

function ArrowUpRightIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="16" y2="18" />
    </svg>
  )
}

function FistIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 14V9a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v5" />
      <path d="M10 13V7a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v6" />
      <path d="M14 13V8a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v6a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6v-2" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function PenIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  )
}

function BuildingIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21V12h6v9" />
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function AlertIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

function IrelandMap() {
  return (
    <svg width="72" height="80" viewBox="0 0 80 90" fill="none" aria-hidden="true">
      <path
        d="M38 5 C30 5 22 8 18 14 C12 20 10 28 8 35 C6 42 5 50 8 57 C11 64 16 70 22 75 C28 80 36 83 44 82 C52 81 60 76 65 69 C70 62 72 53 70 44 C68 35 63 27 57 21 C51 15 46 5 38 5Z"
        fill="currentColor"
        className="text-[#2A1515]"
      />
    </svg>
  )
}

// ── Data ───────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Community', href: '#community' },
  { label: 'Events', href: '#events' },
  { label: 'About', href: '#about' },
  { label: 'Login', href: '/login' },
] as const

const SCATTERED_STARS: ReadonlyArray<{ className: string; size: number }> = [
  { className: 'top-[10%] left-[16%]', size: 13 },
  { className: 'top-[6%] right-[22%]', size: 15 },
  { className: 'top-[32%] left-[7%]', size: 11 },
  { className: 'top-[18%] right-[10%]', size: 17 },
  { className: 'top-[52%] left-[22%]', size: 13 },
  { className: 'top-[58%] right-[28%]', size: 11 },
  { className: 'top-[12%] left-[40%]', size: 22 },
  { className: 'top-[68%] right-[14%]', size: 15 },
]

const FEATURES = [
  {
    num: '01',
    title: 'Events & Protests',
    desc: 'Organise rallies, protests, and community gatherings anywhere across Ireland. RSVP, share, and mobilise in minutes.',
    Icon: CalendarIcon,
    accent: '#D97706',
  },
  {
    num: '02',
    title: 'Petitions',
    desc: 'Create or sign petitions and send them directly to politicians and public bodies. One tap — every signature counts.',
    Icon: PenIcon,
    accent: '#16a34a',
  },
  {
    num: '03',
    title: 'Politicians Directory',
    desc: 'Find your local TD, councillor, or MEP. Filter by county, see contact details, and reach them directly from the app.',
    Icon: BuildingIcon,
    accent: '#D97706',
  },
  {
    num: '04',
    title: 'Help Hub',
    desc: 'Get and give support across housing, legal, medical, and employment. Collective knowledge, always available.',
    Icon: UsersIcon,
    accent: '#16a34a',
  },
] as const

const STATS = [
  { value: 2400, suffix: '+', label: 'Members' },
  { value: 180, suffix: '', label: 'Events Hosted' },
  { value: 34, suffix: '', label: 'Active Petitions' },
  { value: 26, suffix: '', label: 'Counties' },
] as const

const MOCK_EVENTS = [
  {
    id: 1,
    date: '14 Jun',
    title: 'African Diaspora Town Hall',
    location: 'Dublin City Hall',
    county: 'Dublin',
    rsvps: 340,
  },
  {
    id: 2,
    date: '21 Jun',
    title: 'Leinster Housing Rights March',
    location: 'Custom House Quay',
    county: 'Dublin',
    rsvps: 520,
  },
  {
    id: 3,
    date: '28 Jun',
    title: 'Cork Community Night',
    location: 'Cork Opera House',
    county: 'Cork',
    rsvps: 183,
  },
] as const

const MARQUEE_ITEMS = [
  'Events', 'Protests', 'Petitions', 'Politicians', 'Missing Persons',
  'Help Hub', 'Community', 'Civic Action', 'One Voice', 'One Ireland',
]

// ── Component ──────────────────────────────────────────────────────────────

export function HomePage() {
  const mainRef = useRef<HTMLElement>(null)
  const counterRefs = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // Nav: fade to solid on scroll
      ScrollTrigger.create({
        start: 'top -70',
        onEnter: () =>
          gsap.to('.site-nav', {
            backgroundColor: 'rgba(28,13,13,0.95)',
            backdropFilter: 'blur(14px)',
            duration: 0.35,
          }),
        onLeaveBack: () =>
          gsap.to('.site-nav', {
            backgroundColor: 'transparent',
            backdropFilter: 'blur(0px)',
            duration: 0.35,
          }),
      })

      // Hero entrance
      const tl = gsap.timeline({ delay: 0.25 })
      tl.from('.hero-panel', {
        scaleY: 0,
        transformOrigin: 'top center',
        duration: 0.85,
        ease: 'power4.out',
      })
        .from('.hero-figure', { y: 55, opacity: 0, duration: 0.9, ease: 'power3.out' }, '-=0.45')
        .from('.hero-star', { scale: 0, opacity: 0, stagger: 0.045, duration: 0.45, ease: 'back.out(2)' }, '-=0.6')
        .from('.hero-card-left', { x: -80, opacity: 0, duration: 0.75, ease: 'power3.out' }, '-=0.35')
        .from('.hero-card-right', { x: 80, opacity: 0, duration: 0.75, ease: 'power3.out' }, '-=0.65')
        .from('.hero-headline', { y: 75, opacity: 0, duration: 1.1, ease: 'power4.out' }, '-=0.45')
        .from('.hero-cta', { y: 22, opacity: 0, duration: 0.65, ease: 'power3.out' }, '-=0.65')

      // Floating cards loop
      gsap.to('.hero-card-left', {
        y: -12, duration: 3.4, ease: 'sine.inOut', yoyo: true, repeat: -1,
      })
      gsap.to('.hero-card-right', {
        y: -12, duration: 2.9, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.4,
      })

      // Marquee strip reveal
      gsap.from('.marquee-strip', {
        opacity: 0, y: 20, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: '.marquee-strip', start: 'top 90%' },
      })

      // Features stagger
      gsap.from('.feature-card', {
        y: 65, opacity: 0, stagger: 0.13, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: '.features-section', start: 'top 78%' },
      })

      // Stat counters
      STATS.forEach((stat, i) => {
        const obj = { value: 0 }
        gsap.to(obj, {
          value: stat.value,
          duration: 2.4,
          ease: 'power2.out',
          onUpdate() {
            const el = counterRefs.current[i]
            if (el) el.textContent = Math.round(obj.value).toLocaleString('en-GB') + stat.suffix
          },
          scrollTrigger: { trigger: '.stats-section', start: 'top 82%', once: true },
        })
      })

      // Events stagger
      gsap.from('.event-card', {
        y: 50, opacity: 0, stagger: 0.14, duration: 0.85, ease: 'power3.out',
        scrollTrigger: { trigger: '.events-section', start: 'top 80%' },
      })

      // Generic section reveals
      gsap.utils.toArray<Element>('.reveal-up').forEach(el => {
        gsap.from(el, {
          y: 55, opacity: 0, duration: 0.95, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 83%' },
        })
      })
    }, mainRef)

    return () => ctx.revert()
  }, [])

  return (
    <main ref={mainRef} className="min-h-screen overflow-x-hidden bg-[#1C0D0D] font-sans text-[#F5EDD0]">

      {/* ── Nav ── */}
      <nav className="site-nav fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-8 py-5">
        <Link href="/" className="text-lg font-bold tracking-tight text-white" aria-label="VOADI home">
          VOADI<span className="text-[#16a34a]">.</span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map(link => (
            <li key={link.href}>
              <Link href={link.href} className="text-sm text-[#8B7B6B] transition-colors hover:text-[#F5EDD0]">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <button type="button" aria-label="Open menu" className="text-[#F5EDD0] transition-opacity hover:opacity-70">
          <MenuIcon />
        </button>
      </nav>

      {/* ── Hero ── */}
      <section className="relative h-screen w-full pt-[72px]">
        {SCATTERED_STARS.map(star => (
          <span
            key={star.className}
            aria-hidden="true"
            className={`hero-star absolute z-[5] text-[#7C3D3D] opacity-50 ${star.className}`}
          >
            <StarIcon size={star.size} />
          </span>
        ))}

        {/* Accent panel — sits behind the figure */}
        <div className="hero-panel absolute left-1/2 top-[18%] z-10 h-[65%] w-72 -translate-x-1/2 rounded-b-[2.5rem] bg-[#16a34a] sm:w-80" />

        {/* Figure — breaks out above the panel */}
        <div className="hero-figure absolute left-1/2 top-[2%] z-20 h-[76%] w-64 -translate-x-1/2 sm:w-72">
          <Image
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80"
            alt="A diverse community group standing together"
            fill
            sizes="(min-width: 640px) 288px, 256px"
            className="object-cover object-top"
            priority
          />
        </div>

        {/* Left card — horizontal: thumbnail + play + text */}
        <div className="hero-card-left absolute left-8 top-[44%] z-30 flex w-48 items-center gap-3 rounded-2xl bg-[#2A1515] p-3 sm:left-12">
          <div className="relative shrink-0">
            <div className="relative h-14 w-14 overflow-hidden rounded-xl">
              <Image
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80"
                alt=""
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#D97706] text-[#1C0D0D] ring-2 ring-[#2A1515]">
              <PlayIcon />
            </span>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#8B7B6B]">About</p>
            <p className="text-sm font-semibold leading-tight text-white">Our Story</p>
          </div>
        </div>

        {/* Right card — portrait */}
        <div className="hero-card-right absolute right-8 top-[28%] z-30 w-36 overflow-hidden rounded-2xl bg-[#2A1515] sm:right-12">
          <div className="relative h-44 w-full">
            <Image
              src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80"
              alt=""
              fill
              sizes="144px"
              className="object-cover"
            />
          </div>
          <div className="flex items-end justify-between gap-1 px-3 pb-3 pt-2">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#8B7B6B]">Meet our</p>
              <p className="text-xs font-semibold text-white">community</p>
            </div>
            <Link
              href="#community"
              aria-label="Meet our community"
              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#F5EDD0] text-[#1C0D0D] transition-transform hover:-translate-y-0.5"
            >
              <ArrowUpRightIcon />
            </Link>
          </div>
        </div>

        {/* Headline + CTA — bottom of hero */}
        <div className="absolute bottom-10 left-0 right-0 z-30 flex flex-col items-center text-center">
          <h1 className="hero-headline px-4 font-display text-[clamp(60px,11.5vw,144px)] uppercase leading-[0.88] tracking-tight text-[#F5EDD0]">
            <span className="block">ONE VOICE</span>
            <span className="block">ONE IRELAND</span>
          </h1>
          <Link
            href="/signup"
            className="hero-cta mt-7 inline-flex items-center gap-3 rounded-full bg-[#D97706] py-3.5 pl-8 pr-2 text-sm font-bold text-[#1C0D0D] transition-transform hover:-translate-y-0.5"
          >
            <span>JOIN VOADI</span>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#1C0D0D] text-[#D97706]">
              <FistIcon />
            </span>
          </Link>
        </div>
      </section>

      {/* ── Marquee ── */}
      <div className="marquee-strip overflow-hidden border-y border-[#2A1515] py-4">
        <div
          className="flex whitespace-nowrap"
          style={{ animation: 'marquee 28s linear infinite' }}
        >
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="mx-6 text-sm font-bold uppercase tracking-widest text-[#5C4A3A]">
              {item}
              <span className="mx-6 text-[#D97706]">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Features ── */}
      <section id="features" className="features-section px-8 py-20 md:px-12">
        <div className="reveal-up mb-12 flex items-end justify-between">
          <div>
            <p className="mb-2 text-xs uppercase tracking-widest text-[#D97706]">What we do</p>
            <h2 className="font-display text-[clamp(40px,6vw,80px)] uppercase leading-[0.9] tracking-tight text-[#F5EDD0]">
              Built for<br />your community
            </h2>
          </div>
          <Link
            href="/signup"
            className="hidden items-center gap-2 rounded-full border border-[#3D2020] px-5 py-2.5 text-sm text-[#8B7B6B] transition-colors hover:border-[#D97706] hover:text-[#D97706] md:inline-flex"
          >
            Get started <ArrowUpRightIcon />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {FEATURES.map(f => (
            <div
              key={f.num}
              className="feature-card group rounded-2xl border border-[#2A1515] bg-[#1E0E0E] p-7 transition-colors hover:border-[#3D2020]"
            >
              <div className="mb-6 flex items-start justify-between">
                <span className="font-display text-5xl leading-none tracking-tight text-[#2A1515]">
                  {f.num}
                </span>
                <span style={{ color: f.accent }}>
                  <f.Icon />
                </span>
              </div>
              <h3 className="mb-3 text-xl font-bold text-[#F5EDD0]">{f.title}</h3>
              <p className="text-sm leading-relaxed text-[#8B7B6B]">{f.desc}</p>
              <div className="mt-6">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider transition-colors hover:gap-2.5"
                  style={{ color: f.accent }}
                >
                  Explore <ArrowUpRightIcon size={11} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="stats-section border-y border-[#2A1515] px-8 py-16 md:px-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-[clamp(40px,5vw,72px)] uppercase leading-none tracking-tight text-[#F5EDD0]">
                <span
                  ref={el => { counterRefs.current[i] = el }}
                  aria-label={`${stat.value}${stat.suffix}`}
                >
                  0
                </span>
              </p>
              <p className="mt-2 text-xs uppercase tracking-widest text-[#5C4A3A]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Events ── */}
      <section id="events" className="events-section px-8 py-20 md:px-12">
        <div className="reveal-up mb-10 flex items-end justify-between">
          <div>
            <p className="mb-2 text-xs uppercase tracking-widest text-[#D97706]">On the ground</p>
            <h2 className="font-display text-[clamp(36px,5vw,64px)] uppercase leading-[0.9] tracking-tight text-[#F5EDD0]">
              Upcoming events
            </h2>
          </div>
          <Link
            href="/signup"
            className="hidden items-center gap-2 rounded-full border border-[#3D2020] px-5 py-2.5 text-sm text-[#8B7B6B] transition-colors hover:border-[#D97706] hover:text-[#D97706] md:inline-flex"
          >
            View all <ArrowUpRightIcon />
          </Link>
        </div>

        <div className="space-y-3">
          {MOCK_EVENTS.map((ev, i) => (
            <div
              key={ev.id}
              className="event-card group flex items-center gap-6 rounded-2xl border border-[#2A1515] bg-[#1E0E0E] p-5 transition-colors hover:border-[#3D2020]"
            >
              <div className="w-14 shrink-0 text-center">
                <p className="font-display text-2xl uppercase leading-none tracking-tight text-[#D97706]">
                  {ev.date.split(' ')[0]}
                </p>
                <p className="text-[10px] uppercase tracking-widest text-[#5C4A3A]">
                  {ev.date.split(' ')[1]}
                </p>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-[#F5EDD0]">{ev.title}</p>
                <p className="mt-0.5 text-sm text-[#8B7B6B]">{ev.location}</p>
              </div>
              <div className="hidden shrink-0 items-center gap-3 sm:flex">
                <span className="rounded-full bg-[#2A1515] px-3 py-1 text-xs text-[#8B7B6B]">
                  {ev.county}
                </span>
                <span className="text-sm text-[#5C4A3A]">{ev.rsvps.toLocaleString('en-GB')} RSVPs</span>
              </div>
              <Link
                href="/signup"
                aria-label={`RSVP to ${ev.title}`}
                className="ml-2 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#2A1515] text-[#8B7B6B] transition-colors group-hover:bg-[#D97706] group-hover:text-[#1C0D0D]"
              >
                <ArrowUpRightIcon />
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-4 text-center text-xs text-[#3D2020]">
          Sign in to RSVP, create events, and see all upcoming community gatherings.
        </p>
      </section>

      {/* ── Missing Persons ── */}
      <section className="reveal-up mx-8 mb-20 overflow-hidden rounded-3xl bg-[#F5EDD0] text-[#1C0D0D] md:mx-12">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-8 md:p-12">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#1C0D0D] px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-[#D97706]">
              <AlertIcon />
              Community Safety
            </div>
            <h2 className="font-display text-[clamp(36px,4.5vw,60px)] uppercase leading-[0.9] tracking-tight">
              We look out<br />for each other
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-[#6B5B4E]">
              Report missing persons directly to the VOADI community. Admin-reviewed submissions go
              to all members instantly with urgent push alerts — because every second matters.
            </p>
            <Link
              href="/signup"
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#1C0D0D] py-3.5 pl-7 pr-2 text-sm font-bold text-[#F5EDD0] transition-transform hover:-translate-y-0.5"
            >
              <span>Join &amp; Stay Informed</span>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#D97706] text-[#1C0D0D]">
                <ArrowUpRightIcon />
              </span>
            </Link>
          </div>
          <div className="relative min-h-[260px] bg-[#2A1515] md:min-h-0">
            <Image
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80"
              alt="Community members supporting each other"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C0D0D]/60 to-transparent md:bg-gradient-to-l" />
          </div>
        </div>
      </section>

      {/* ── Community info row ── */}
      <section id="community" className="grid grid-cols-1 gap-6 px-8 pb-20 md:grid-cols-3 md:px-12">
        <div className="reveal-up">
          <p className="mb-3 text-xs uppercase tracking-widest text-[#D97706]">Our Mission</p>
          <p className="text-lg font-medium leading-snug text-[#F5EDD0]">
            Mobilising Africans across Ireland for real political and social change.
          </p>
        </div>

        <div className="reveal-up relative flex flex-col items-center rounded-2xl bg-[#F5EDD0] p-5 text-[#1C0D0D]">
          <span className="absolute left-5 top-5 inline-flex rounded-full bg-[#1C0D0D] px-2 py-0.5 text-xs text-[#F5EDD0]">
            New
          </span>
          <p className="mt-3 text-2xl font-bold">
            voadi<span className="text-[#16a34a]">.org</span>
          </p>
          <div className="my-2">
            <IrelandMap />
          </div>
          <Link href="#about" className="mt-1 text-xs text-[#6B5B4E] transition-colors hover:text-[#1C0D0D]">
            Learn More →
          </Link>
        </div>

        <div className="reveal-up flex items-start gap-4">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#2A1515]">
            <Image
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80"
              alt=""
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
          <p className="text-lg leading-snug">
            <span className="text-[#8B7B6B]">United with </span>
            <span className="font-bold text-white">passion,</span>
            <span className="text-[#8B7B6B]"> rise with the </span>
            <span className="font-bold text-white">community</span>
            <span className="text-[#8B7B6B]"> of Ireland.</span>
          </p>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section id="about" className="reveal-up mx-8 mb-20 overflow-hidden rounded-3xl bg-[#16a34a] md:mx-12">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-8 md:p-12">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-[#0d6b2e]">
              Join the movement
            </p>
            <h2 className="font-display text-[clamp(40px,5vw,72px)] uppercase leading-[0.88] tracking-tight text-white">
              One community.<br />One voice.<br />One Ireland.
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-[#bbf7d0]">
              VOADI is free, open to all Africans living in Ireland, and built with your community&apos;s
              interests at heart. Sign up in under a minute.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center gap-3 rounded-full bg-white py-3.5 pl-7 pr-2 text-sm font-bold text-[#16a34a] transition-transform hover:-translate-y-0.5"
              >
                <span>Create Free Account</span>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#16a34a] text-white">
                  <FistIcon />
                </span>
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center rounded-full border border-[#4ade80] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white"
              >
                Sign In
              </Link>
            </div>
          </div>
          <div className="relative min-h-[240px] md:min-h-0">
            <Image
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"
              alt="Community member"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="flex flex-col items-center justify-between gap-3 border-t border-[#2A1515] px-8 py-6 sm:flex-row">
        <p className="text-xs text-[#5C4A3A]">© 2026 VOADI · Coalition of Africans Diaspora Ireland</p>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-xs text-[#5C4A3A] transition-colors hover:text-[#8B7B6B]">Login</Link>
          <Link href="/signup" className="text-xs text-[#5C4A3A] transition-colors hover:text-[#8B7B6B]">Sign Up</Link>
          <p className="text-xs text-[#3D2020]">voadi.org</p>
        </div>
      </footer>

    </main>
  )
}
