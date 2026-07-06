'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { VoadiLogo } from './voadi-logo'

// ── Icons ─────────────────────────────────────────────────────────────────

function StarIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0 L14.59 8.41 L23 8.41 L16.45 13.59 L19.05 22 L12 17.27 L4.95 22 L7.55 13.59 L1 8.41 L9.41 8.41 Z" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
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

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
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
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function PenIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  )
}

function BuildingIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21V12h6v9" />
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function QuoteIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function ScaleIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <path d="M12 3v18M3 9l9-6 9 6M5 21h14" />
      <path d="M3 9l3 6H0l3-6zM21 9l3 6h-6l3-6z" />
    </svg>
  )
}

function BriefcaseIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <line x1="12" y1="12" x2="12" y2="12" strokeWidth="2" />
    </svg>
  )
}

function MicIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M19 10a7 7 0 0 1-14 0M12 19v3M8 22h8" />
    </svg>
  )
}

function HeartHandIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <path d="M11 12H3a1 1 0 0 0 0 2h8" />
      <path d="M12 15H3a1 1 0 0 0 0 2h9" />
      <path d="M13 18H3a1 1 0 0 0 0 2h10" />
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

function CodeIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  )
}

// ── Data ─────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Community', href: '#community' },
  { label: 'Events', href: '#events' },
  { label: 'Volunteer', href: '#volunteer' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '#about' },
  { label: 'Login', href: '/login' },
] as const

const SCATTERED_STARS: ReadonlyArray<{ className: string; size: number; opacity: string }> = [
  { className: 'top-[10%] left-[16%]', size: 13, opacity: 'opacity-40' },
  { className: 'top-[6%] right-[22%]', size: 15, opacity: 'opacity-60' },
  { className: 'top-[32%] left-[7%]', size: 11, opacity: 'opacity-30' },
  { className: 'top-[18%] right-[10%]', size: 17, opacity: 'opacity-50' },
  { className: 'top-[52%] left-[22%]', size: 13, opacity: 'opacity-35' },
  { className: 'top-[58%] right-[28%]', size: 11, opacity: 'opacity-25' },
  { className: 'top-[12%] left-[40%]', size: 22, opacity: 'opacity-70' },
  { className: 'top-[68%] right-[14%]', size: 15, opacity: 'opacity-45' },
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

const STEPS = [
  {
    num: '01',
    title: 'Sign up free',
    desc: 'Takes 30 seconds. Your name, county, and email or phone. No card required.',
  },
  {
    num: '02',
    title: 'Find your community',
    desc: 'See events near you, open petitions, and help posts from your county.',
  },
  {
    num: '03',
    title: 'Take action',
    desc: 'RSVP to events, sign petitions, and contact your TD — all in one place.',
  },
] as const

const VOLUNTEER_ROLES = [
  {
    title: 'Legal Professionals',
    desc: 'Solicitors, barristers, and paralegals providing pro bono advice on immigration, housing, employment, and discrimination cases.',
    Icon: ScaleIcon,
    accent: '#D97706',
  },
  {
    title: 'Business Owners',
    desc: 'Entrepreneurs and business leaders sponsoring events, mentoring community members, and creating employment opportunities.',
    Icon: BriefcaseIcon,
    accent: '#16a34a',
  },
  {
    title: 'Healthcare Workers',
    desc: 'Doctors, nurses, and mental health professionals running clinics, health awareness campaigns, and wellbeing support.',
    Icon: HeartHandIcon,
    accent: '#D97706',
  },
  {
    title: 'Tech & Media',
    desc: 'Developers, designers, and journalists building tools, covering community stories, and amplifying our voice online.',
    Icon: CodeIcon,
    accent: '#16a34a',
  },
  {
    title: 'Educators & Academics',
    desc: 'Teachers, lecturers, and researchers delivering workshops, mentoring youth, and producing evidence for policy change.',
    Icon: MicIcon,
    accent: '#D97706',
  },
  {
    title: 'Community Organisers',
    desc: 'Local leaders coordinating events, translating services, and building bridges between African communities and Irish institutions.',
    Icon: UsersIcon,
    accent: '#16a34a',
  },
] as const

const MOCK_EVENTS = [
  {
    id: 1,
    date: '14 Jun',
    title: 'African Diaspora Town Hall',
    location: 'Dublin City Hall',
    county: 'Dublin',
    rsvps: 340,
    featured: true,
  },
  {
    id: 2,
    date: '21 Jun',
    title: 'Leinster Housing Rights March',
    location: 'Custom House Quay',
    county: 'Dublin',
    rsvps: 520,
    featured: false,
  },
  {
    id: 3,
    date: '28 Jun',
    title: 'Cork Community Night',
    location: 'Cork Opera House',
    county: 'Cork',
    rsvps: 183,
    featured: false,
  },
] as const

const PETITION = {
  title: 'Increase African Representation on Dublin City Council',
  target: 'Dublin City Council',
  signatures: 1847,
  goal: 2000,
  category: 'Civic Rights',
  daysLeft: 12,
  pct: 92,
}

const TESTIMONIALS = [
  {
    quote: 'VOADI helped me find the housing rights march in Cork. I met over 200 others that day — I had no idea so many of us were here.',
    name: 'Adaeze O.',
    county: 'Cork',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
  },
  {
    quote: 'I signed three petitions in ten minutes. This is exactly what our community needed.',
    name: 'Kwame B.',
    county: 'Dublin',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80',
  },
  {
    quote: 'Found legal advice for my visa situation through the Help Hub within 24 hours. Remarkable.',
    name: 'Amara S.',
    county: 'Galway',
    photo: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=100&q=80',
  },
] as const

const MARQUEE_ITEMS = [
  'Events', 'Protests', 'Petitions', 'Politicians',
  'Missing Persons', 'Help Hub', 'Civic Action', 'One Voice', 'One Ireland',
]

// ── Donations sub-component ───────────────────────────────────────────────

const PRESET_AMOUNTS = [5, 10, 25, 50] as const

function DonateSection() {
  const [amount, setAmount] = useState<number>(25)
  const [custom, setCustom] = useState('')
  const [recurring, setRecurring] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const finalAmount = custom ? parseFloat(custom) : amount

  async function handleDonate() {
    if (!finalAmount || finalAmount < 1) {
      setError('Please enter a valid amount (min €1).')
      return
    }
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/donations/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalAmount, recurring }),
      })
      const data = await res.json() as { url?: string; error?: string }
      if (!res.ok || !data.url) throw new Error(data.error ?? 'Could not start checkout.')
      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setLoading(false)
    }
  }

  return (
    <section id="donate" className="reveal-up px-8 pb-20 md:px-12">
      <div className="overflow-hidden rounded-3xl border border-[#E5E7EB] bg-[#FFFFFF]">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left — copy */}
          <div className="border-b border-[#E5E7EB] p-8 md:border-b-0 md:border-r md:p-12">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#D97706]">
              Fund the movement
            </p>
            <h2 className="font-display text-[clamp(36px,4.5vw,58px)] uppercase leading-[0.9] tracking-tight text-[#111827]">
              Back real<br />change in Ireland
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-[#6B7280]">
              Every contribution directly funds civic action, legal aid, community events,
              and representation for Africans across Ireland. 100% goes to the cause.
            </p>
            <div className="mt-8 space-y-3">
              {[
                ['€5', 'Covers printing campaign materials for one county'],
                ['€25', 'Helps fund a community event or protest'],
                ['€50', 'Supports legal advice for one member in need'],
              ].map(([label, desc]) => (
                <div key={label} className="flex items-start gap-3">
                  <span className="mt-0.5 shrink-0 font-semibold text-[#D97706]">{label}</span>
                  <span className="text-sm text-[#4B5563]">{desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div className="flex flex-col justify-center p-8 md:p-12">
            {/* One-off / Monthly toggle */}
            <div className="mb-6 flex rounded-xl border border-[#E5E7EB] p-1">
              {(['One-off', 'Monthly'] as const).map(mode => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setRecurring(mode === 'Monthly')}
                  className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-colors ${
                    recurring === (mode === 'Monthly')
                      ? 'bg-[#E5E7EB] text-[#111827]'
                      : 'text-[#4B5563] hover:text-[#111827]'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* Preset amounts */}
            <div className="mb-4 grid grid-cols-4 gap-2">
              {PRESET_AMOUNTS.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => { setAmount(p); setCustom('') }}
                  className={`rounded-xl border py-3 text-sm font-bold transition-colors ${
                    !custom && amount === p
                      ? 'border-[#D97706] bg-[#D97706]/10 text-[#D97706]'
                      : 'border-[#E5E7EB] text-[#6B7280] hover:border-[#D97706] hover:text-[#D97706]'
                  }`}
                >
                  €{p}
                </button>
              ))}
            </div>

            {/* Custom amount */}
            <div className="relative mb-6">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#4B5563]">€</span>
              <input
                type="number"
                min="1"
                placeholder="Custom amount"
                value={custom}
                onChange={e => { setCustom(e.target.value); setAmount(0) }}
                className="w-full rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] py-3 pl-8 pr-4 text-sm text-[#111827] placeholder-[#9CA3AF] transition-colors focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706]"
              />
            </div>

            {error && (
              <p role="alert" className="mb-4 rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]">
                {error}
              </p>
            )}

            <button
              type="button"
              disabled={loading}
              onClick={handleDonate}
              className="inline-flex w-full items-center justify-between gap-3 rounded-full bg-[#D97706] py-4 pl-8 pr-3 text-sm font-bold text-[#111827] transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              <span>
                {loading
                  ? 'Redirecting…'
                  : `Donate €${finalAmount > 0 ? finalAmount : '—'}${recurring ? '/mo' : ''}`
                }
              </span>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#F9FAFB] text-[#D97706]">
                <ArrowUpRightIcon size={14} />
              </span>
            </button>

            <p className="mt-4 text-center text-[10px] uppercase tracking-widest text-[#6B7280]">
              Secure payment via Stripe · Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Component ─────────────────────────────────────────────────────────────

export function HomePage() {
  const mainRef = useRef<HTMLElement>(null)
  const counterRefs = useRef<(HTMLSpanElement | null)[]>([])
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // Nav: fade to solid on scroll
      ScrollTrigger.create({
        start: 'top -70',
        onEnter: () =>
          gsap.to('.site-nav', {
            backgroundColor: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(14px)',
            duration: 0.4,
          }),
        onLeaveBack: () =>
          gsap.to('.site-nav', {
            backgroundColor: 'transparent',
            backdropFilter: 'blur(0px)',
            duration: 0.4,
          }),
      })

      // Hero entrance timeline
      const tl = gsap.timeline({ delay: 0.2 })
      tl.from('.hero-panel', {
          scaleY: 0,
          transformOrigin: 'top center',
          duration: 0.9,
          ease: 'power4.out',
        })
        .from('.hero-figure', { y: 60, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.5')
        .from('.hero-star', { scale: 0, opacity: 0, stagger: 0.04, duration: 0.5, ease: 'back.out(2)' }, '-=0.65')
        .from('.hero-card-left', { x: -90, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4')
        .from('.hero-card-right', { x: 90, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.7')
        .from('.hero-headline span', { y: 80, opacity: 0, stagger: 0.12, duration: 1.1, ease: 'power4.out' }, '-=0.5')
        .from('.hero-badge', { y: 16, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3')
        .from('.hero-cta-btn', { y: 16, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.45')

      // Floating cards
      gsap.to('.hero-card-left', {
        y: -14, rotation: 2, duration: 3.8, ease: 'sine.inOut', yoyo: true, repeat: -1,
      })
      gsap.to('.hero-card-right', {
        y: -11, rotation: -2.5, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.1,
      })

      // Hero panel glow pulse
      gsap.to('.hero-panel', {
        boxShadow: '0 0 180px 90px rgba(22,163,74,0.30)',
        duration: 2.8, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.8,
      })

      // CTA button breathe
      gsap.to('.hero-cta-btn', {
        scale: 1.04, duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 2.5,
      })

      // Hero parallax on scroll — desktop only
      const mm = gsap.matchMedia()
      mm.add('(min-width: 768px)', () => {
        gsap.to('.hero-figure', {
          y: -60, ease: 'none',
          scrollTrigger: { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: 0.6, invalidateOnRefresh: true },
        })
        gsap.to('.hero-panel', {
          y: -30, ease: 'none',
          scrollTrigger: { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: 0.4, invalidateOnRefresh: true },
        })
      })

      // Shared scroll reveal helper
      const scrollReveal = (
        targets: string | Element[],
        vars: gsap.TweenVars,
        triggerEl: string | Element,
        start = 'top 88%',
      ) => {
        gsap.from(targets, {
          ...vars,
          immediateRender: false,
          scrollTrigger: { trigger: triggerEl, start, once: true },
        })
      }

      // Marquee
      scrollReveal('.marquee-strip', { opacity: 0, y: 24, duration: 0.8, ease: 'power2.out' }, '.marquee-strip', 'top 95%')

      // Stats counters
      STATS.forEach((stat, i) => {
        const obj = { value: 0 }
        gsap.to(obj, {
          value: stat.value,
          duration: 2.5,
          ease: 'power2.out',
          onUpdate() {
            const el = counterRefs.current[i]
            if (el) el.textContent = Math.round(obj.value).toLocaleString('en-GB') + stat.suffix
          },
          scrollTrigger: { trigger: '.stats-section', start: 'top 88%', once: true },
        })
      })

      scrollReveal('.stat-item', { y: 30, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out' }, '.stats-section', 'top 88%')

      // Features
      scrollReveal('.features-heading', { y: 30, opacity: 0, duration: 1.0, ease: 'power3.out' }, '.features-section', 'top 88%')
      scrollReveal('.feature-card',     { y: 50, opacity: 0, scale: 0.94, stagger: 0.14, duration: 1.1, ease: 'expo.out' }, '.features-section', 'top 85%')

      // Steps — connector desktop only, items always
      mm.add('(min-width: 768px)', () => {
        scrollReveal('.steps-connector', { scaleX: 0, transformOrigin: 'left center', duration: 1.4, ease: 'power3.out' }, '.steps-section', 'top 85%')
      })
      scrollReveal('.step-item', { y: 40, opacity: 0, scale: 0.95, stagger: 0.18, duration: 1.0, ease: 'expo.out' }, '.steps-section', 'top 88%')

      // Events
      scrollReveal('.event-card', { y: 50, opacity: 0, stagger: 0.13, duration: 0.85, ease: 'power3.out' }, '.events-section', 'top 88%')

      // Petition
      scrollReveal('.petition-bar-fill', { scaleX: 0, transformOrigin: 'left center', duration: 1.6, ease: 'power3.out' }, '.petition-section', 'top 88%')
      scrollReveal('.petition-section',  { y: 30, opacity: 0, duration: 1.1, ease: 'power3.out' }, '.petition-section', 'top 92%')

      // Testimonials
      scrollReveal('.testimonial-card', { y: 50, opacity: 0, scale: 0.95, stagger: 0.14, duration: 1.0, ease: 'expo.out' }, '.testimonials-section', 'top 88%')

      // Volunteers
      scrollReveal('.volunteer-card', { y: 40, opacity: 0, scale: 0.96, stagger: 0.1, duration: 0.9, ease: 'expo.out' }, '.volunteers-section', 'top 88%')

      // Generic section reveals — each element is its own trigger
      gsap.utils.toArray<Element>('.reveal-up').forEach(el => {
        gsap.from(el, {
          y: 50, opacity: 0, duration: 0.95, ease: 'power3.out',
          immediateRender: false,
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        })
      })
    }, mainRef)

    // Refresh after fonts/images settle
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => {
      ctx.revert()
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <main ref={mainRef} className="min-h-screen overflow-x-hidden bg-[#F9FAFB] font-sans text-[#111827]">

      {/* ── Nav ── */}
      <nav className="site-nav fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-8 py-5">
        <Link href="/" aria-label="VOADI home">
          <VoadiLogo size="lg" />
        </Link>
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map(link => (
            <li key={link.href}>
              <Link href={link.href} className="text-sm text-[#6B7280] transition-colors hover:text-[#111827]">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <button
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(o => !o)}
          className="relative z-[60] text-[#111827] transition-opacity hover:opacity-70 md:hidden"
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </nav>

      {/* Mobile menu — slide in from right, always mounted for smooth exit */}
      <div
        className={`fixed inset-0 z-50 flex flex-col bg-[#F9FAFB] transition-transform duration-300 ease-out md:hidden ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        aria-hidden={!menuOpen}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-8 py-5">
          <VoadiLogo size="md" />
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="text-[#111827] transition-opacity hover:opacity-70"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-1 flex-col gap-0 overflow-y-auto px-8 py-2">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="border-b border-[#E5E7EB] py-5 font-display text-[clamp(28px,8vw,48px)] uppercase leading-none tracking-tight text-[#111827] transition-colors hover:text-[#D97706]"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="#donate"
            onClick={() => setMenuOpen(false)}
            className="border-b border-[#E5E7EB] py-5 font-display text-[clamp(28px,8vw,48px)] uppercase leading-none tracking-tight text-[#D97706] transition-colors hover:text-[#111827]"
          >
            Donate
          </Link>
          <div className="mt-10 space-y-3 pb-8">
            <Link
              href="/signup"
              onClick={() => setMenuOpen(false)}
              className="inline-flex w-full items-center justify-between gap-3 rounded-full bg-[#D97706] py-4 pl-8 pr-3 text-sm font-bold text-[#111827]"
            >
              <span>JOIN VOADI — FREE</span>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#F9FAFB] text-[#D97706]">
                <ArrowUpRightIcon size={14} />
              </span>
            </Link>
            <Link
              href="#donate"
              onClick={() => setMenuOpen(false)}
              className="inline-flex w-full items-center justify-between gap-3 rounded-full border border-[#D97706] py-4 pl-8 pr-3 text-sm font-bold text-[#D97706]"
            >
              <span>Support the cause</span>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#E5E7EB] text-[#D97706]">
                <ArrowUpRightIcon size={14} />
              </span>
            </Link>
          </div>
        </nav>
      </div>

      {/* ── Hero ── */}
      <section className="hero-section relative h-screen w-full pt-[72px]">
        {/* Scattered stars */}
        {SCATTERED_STARS.map(star => (
          <span
            key={star.className}
            aria-hidden="true"
            className={`hero-star absolute z-[5] text-[#D1D5DB] ${star.opacity} ${star.className}`}
          >
            <StarIcon size={star.size} />
          </span>
        ))}

        {/* Top scrim — ensures nav text readable over hero photo */}
        <div
          className="pointer-events-none absolute left-0 right-0 top-0 z-[6] h-28"
          style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.6) 0%, transparent 100%)' }}
          aria-hidden="true"
        />

        {/* Green accent panel with glow */}
        <div
          className="hero-panel absolute left-1/2 top-[18%] z-10 h-[65%] w-72 -translate-x-1/2 rounded-b-[2.5rem] bg-[#16a34a] sm:w-80"
          style={{ boxShadow: '0 0 120px 50px rgba(22,163,74,0.18)' }}
        />

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

        {/* Bottom gradient — ensures headline legibility */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 z-[25] h-[48%]"
          style={{ background: 'linear-gradient(to top, #F9FAFB 15%, rgba(249,250,251,0.75) 50%, transparent 100%)' }}
          aria-hidden="true"
        />

        {/* Left card — horizontal */}
        <div className="hero-card-left absolute left-8 top-[44%] z-30 hidden w-48 items-center gap-3 rounded-2xl bg-[#E5E7EB] p-3 md:flex sm:left-12">
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
            <span className="absolute -bottom-1 -right-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#D97706] text-[#111827] ring-2 ring-[#E5E7EB]">
              <PlayIcon />
            </span>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#6B7280]">About</p>
            <p className="text-sm font-semibold leading-tight text-[#111827]">Our Story</p>
          </div>
        </div>

        {/* Right card — portrait */}
        <div className="hero-card-right absolute right-8 top-[28%] z-30 hidden w-36 overflow-hidden rounded-2xl bg-[#E5E7EB] md:block sm:right-12">
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
              <p className="text-[10px] uppercase tracking-widest text-[#6B7280]">Meet our</p>
              <p className="text-xs font-semibold text-[#111827]">community</p>
            </div>
            <Link
              href="#community"
              aria-label="Meet our community"
              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#111827] text-[#111827] transition-transform hover:-translate-y-0.5"
            >
              <ArrowUpRightIcon />
            </Link>
          </div>
        </div>

        {/* Headline + social proof + CTA */}
        <div className="absolute bottom-8 left-0 right-0 z-30 flex flex-col items-center text-center">
          <h1 className="hero-headline overflow-hidden px-4 font-display text-[clamp(58px,11vw,140px)] uppercase leading-[0.88] tracking-tight text-[#111827]">
            <span className="block">ONE VOICE</span>
            <span className="block">ONE IRELAND</span>
          </h1>

          {/* Member count badge */}
          <div className="hero-badge mt-5 flex items-center gap-2.5 rounded-full border border-[#E5E7EB] bg-white/80 px-4 py-2 backdrop-blur-sm">
            <div className="flex -space-x-2">
              {[
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80',
                'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=60&q=80',
                'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=60&q=80',
              ].map((src, i) => (
                <div key={i} className="relative h-7 w-7 overflow-hidden rounded-full border-2 border-[#F9FAFB]">
                  <Image src={src} alt="" fill sizes="28px" className="object-cover" />
                </div>
              ))}
            </div>
            <span className="text-xs text-[#6B7280]">
              <span className="font-semibold text-[#111827]">2,400+</span> members joined
            </span>
          </div>

          <div className="hero-cta-btn mt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center gap-3 rounded-full bg-[#D97706] py-3.5 pl-8 pr-2 text-sm font-bold text-[#111827] transition-transform hover:-translate-y-0.5"
            >
              <span>JOIN VOADI</span>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#F9FAFB] text-[#D97706]">
                <FistIcon />
              </span>
            </Link>
            <Link
              href="#donate"
              className="inline-flex items-center gap-2 rounded-full border border-[#D97706]/60 bg-[#F9FAFB]/70 px-5 py-3.5 text-sm font-semibold text-[#D97706] backdrop-blur-sm transition-all hover:border-[#D97706] hover:bg-[#D97706]/10"
            >
              Support us
            </Link>
          </div>
        </div>
      </section>

      {/* ── Marquee ── */}
      <div className="marquee-strip relative overflow-hidden border-y border-[#E5E7EB] py-4">
        {/* Edge fades */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-[#F9FAFB] to-transparent" aria-hidden="true" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-[#F9FAFB] to-transparent" aria-hidden="true" />
        <div
          className="flex whitespace-nowrap"
          style={{ animation: 'marquee 30s linear infinite' }}
        >
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span
              key={i}
              className={`mx-5 text-xs font-bold uppercase tracking-widest ${i % 4 === 2 ? 'text-[#D97706]' : 'text-[#6B7280]'}`}
            >
              {item}
              <span className="ml-5 text-[#E5E7EB]">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Stats ── */}
      <section className="stats-section bg-[#FFFFFF] px-8 py-16 md:px-12">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 md:divide-x md:divide-[#E5E7EB]">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="stat-item flex flex-col items-center text-center md:px-8">
              <p className="font-display text-[clamp(44px,5.5vw,80px)] uppercase leading-none tracking-tight text-[#111827]">
                <span
                  ref={el => { counterRefs.current[i] = el }}
                  aria-label={`${stat.value}${stat.suffix}`}
                >
                  0
                </span>
              </p>
              <p className="mt-2.5 text-[10px] uppercase tracking-[0.15em] text-[#4B5563]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="features-section px-8 py-20 md:px-12">
        <div className="reveal-up mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs uppercase tracking-widest text-[#D97706]">What we do</p>
            <h2 className="features-heading font-display text-[clamp(38px,6vw,80px)] uppercase leading-[0.9] tracking-tight text-[#111827]">
              Built for<br />your community
            </h2>
          </div>
          <Link
            href="/signup"
            className="self-start inline-flex items-center gap-2 rounded-full border border-[#9CA3AF] px-5 py-2.5 text-sm text-[#6B7280] transition-colors hover:border-[#D97706] hover:text-[#D97706]"
          >
            Get started <ArrowUpRightIcon />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <div
              key={f.num}
              className={`feature-card group relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-gradient-to-br from-[#FFFFFF] to-[#F9FAFB] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#9CA3AF] ${
                i === 0 ? 'sm:col-span-2 lg:col-span-2' :
                i === 3 ? 'sm:col-span-2 lg:col-span-2 lg:col-start-2' :
                ''
              }`}
            >
              {/* Accent top line on hover */}
              <div
                className="absolute left-0 top-0 h-0.5 w-0 rounded-t-2xl transition-all duration-500 group-hover:w-full"
                style={{ backgroundColor: f.accent }}
              />
              <div className="mb-6 flex items-start justify-between">
                <span className="font-display text-6xl leading-none tracking-tight text-[#E5E7EB] transition-colors duration-300 group-hover:text-[#9CA3AF]">
                  {f.num}
                </span>
                <span className="rounded-xl border border-[#E5E7EB] p-2.5 transition-colors duration-300 group-hover:border-[#9CA3AF]" style={{ color: f.accent }}>
                  <f.Icon />
                </span>
              </div>
              <h3 className="mb-3 text-xl font-bold text-[#111827]">{f.title}</h3>
              <p className="text-sm leading-relaxed text-[#6B7280]">{f.desc}</p>
              <div className="mt-6">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 hover:gap-2.5"
                  style={{ color: f.accent }}
                >
                  Explore <ArrowUpRightIcon size={11} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="steps-section px-8 py-20 md:px-12">
        <div className="reveal-up mb-14">
          <p className="mb-2 text-xs uppercase tracking-widest text-[#D97706]">Simple by design</p>
          <h2 className="font-display text-[clamp(38px,6vw,72px)] uppercase leading-[0.9] tracking-tight text-[#111827]">
            How it works
          </h2>
        </div>

        <div className="relative grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
          {/* Connector line (desktop) */}
          <div className="steps-connector absolute left-0 right-0 top-[26px] hidden h-px bg-[#E5E7EB] md:block" />

          {STEPS.map((step, i) => (
            <div key={step.num} className="step-item relative">
              <div className="relative mb-5 inline-flex h-[52px] w-[52px] items-center justify-center rounded-full border border-[#9CA3AF] bg-[#F9FAFB]">
                <span className="font-display text-xl uppercase leading-none tracking-tight text-[#D97706]">
                  {step.num}
                </span>
              </div>
              <h3 className="mb-2 text-lg font-bold text-[#111827]">{step.title}</h3>
              <p className="text-sm leading-relaxed text-[#6B7280]">{step.desc}</p>
              {i < STEPS.length - 1 && (
                <div className="mt-8 h-px w-12 bg-[#E5E7EB] md:hidden" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Events ── */}
      <section id="events" className="events-section px-8 pb-20 md:px-12">
        <div className="reveal-up mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs uppercase tracking-widest text-[#D97706]">On the ground</p>
            <h2 className="font-display text-[clamp(36px,5vw,64px)] uppercase leading-[0.9] tracking-tight text-[#111827]">
              Upcoming events
            </h2>
          </div>
          <Link
            href="/signup"
            className="self-start inline-flex items-center gap-2 rounded-full border border-[#9CA3AF] px-5 py-2.5 text-sm text-[#6B7280] transition-colors hover:border-[#D97706] hover:text-[#D97706]"
          >
            View all <ArrowUpRightIcon />
          </Link>
        </div>

        {/* Featured event card */}
        {MOCK_EVENTS.filter(e => e.featured).map(ev => (
          <div
            key={ev.id}
            className="event-card mb-4 overflow-hidden rounded-2xl border border-[#E5E7EB] bg-[#FFFFFF]"
          >
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto]">
              <div className="p-6 md:p-8">
                <div className="mb-3 flex items-center gap-3">
                  <span className="rounded-full bg-[#D97706]/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#D97706]">
                    Featured
                  </span>
                  <span className="text-xs text-[#4B5563]">{ev.county}</span>
                </div>
                <h3 className="mb-2 text-xl font-bold text-[#111827] md:text-2xl">{ev.title}</h3>
                <p className="mb-4 text-sm text-[#6B7280]">{ev.location}</p>
                <div className="flex items-center gap-4">
                  <span className="font-display text-3xl uppercase leading-none text-[#D97706]">
                    {ev.date.split(' ')[0]}
                    <span className="ml-1 text-base text-[#4B5563]">{ev.date.split(' ')[1]}</span>
                  </span>
                  <span className="text-sm text-[#4B5563]">{ev.rsvps.toLocaleString('en-GB')} RSVPs</span>
                </div>
              </div>
              <div className="flex items-center justify-end p-6">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 rounded-full bg-[#D97706] px-6 py-3 text-sm font-bold text-[#111827] transition-transform hover:-translate-y-0.5"
                >
                  RSVP now <ArrowUpRightIcon />
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Event list */}
        <div className="space-y-2.5">
          {MOCK_EVENTS.filter(e => !e.featured).map(ev => (
            <div
              key={ev.id}
              className="event-card group flex items-center gap-5 rounded-2xl border border-[#E5E7EB] bg-[#FFFFFF] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#9CA3AF]"
            >
              <div className="w-12 shrink-0 text-center">
                <p className="font-display text-2xl uppercase leading-none tracking-tight text-[#D97706]">
                  {ev.date.split(' ')[0]}
                </p>
                <p className="text-[10px] uppercase tracking-widest text-[#4B5563]">
                  {ev.date.split(' ')[1]}
                </p>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-[#111827]">{ev.title}</p>
                <p className="mt-0.5 text-sm text-[#6B7280]">{ev.location}</p>
              </div>
              <div className="hidden shrink-0 items-center gap-3 sm:flex">
                <span className="rounded-full bg-[#E5E7EB] px-3 py-1 text-xs text-[#6B7280]">
                  {ev.county}
                </span>
                <span className="text-sm text-[#4B5563]">{ev.rsvps.toLocaleString('en-GB')} RSVPs</span>
              </div>
              <Link
                href="/signup"
                aria-label={`RSVP to ${ev.title}`}
                className="ml-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E5E7EB] text-[#6B7280] transition-colors group-hover:bg-[#D97706] group-hover:text-[#111827]"
              >
                <ArrowUpRightIcon />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Petition ── */}
      <section className="petition-section mx-8 mb-20 overflow-hidden rounded-3xl border border-[#E5E7EB] bg-[#FFFFFF] md:mx-12">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="border-b border-[#E5E7EB] p-8 md:border-b-0 md:border-r md:p-12">
            <div className="mb-4 flex items-center gap-2">
              <span className="rounded-full bg-[#16a34a]/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#16a34a]">
                {PETITION.category}
              </span>
              <span className="text-xs text-[#4B5563]">{PETITION.daysLeft} days left</span>
            </div>
            <h3 className="mb-4 text-xl font-bold leading-snug text-[#111827] md:text-2xl">
              {PETITION.title}
            </h3>
            <p className="mb-6 text-sm text-[#6B7280]">
              Target: <span className="text-[#111827]">{PETITION.target}</span>
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-3 rounded-full bg-[#16a34a] py-3.5 pl-7 pr-2 text-sm font-bold text-[#111827] transition-transform hover:-translate-y-0.5"
            >
              <span>Sign the petition</span>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#16a34a]">
                <CheckIcon />
              </span>
            </Link>
          </div>
          <div className="flex flex-col justify-center p-8 md:p-12">
            <p className="mb-1 text-xs uppercase tracking-widest text-[#4B5563]">Signatures</p>
            <p className="font-display text-[clamp(48px,6vw,80px)] uppercase leading-none tracking-tight text-[#111827]">
              {PETITION.signatures.toLocaleString('en-GB')}
            </p>
            <p className="mb-6 text-sm text-[#6B7280]">
              of {PETITION.goal.toLocaleString('en-GB')} goal
            </p>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#E5E7EB]">
              <div
                className="petition-bar-fill h-full rounded-full bg-[#16a34a]"
                style={{ width: `${PETITION.pct}%` }}
              />
            </div>
            <p className="mt-2 text-right text-xs font-semibold text-[#16a34a]">
              {PETITION.pct}%
            </p>
          </div>
        </div>
      </section>

      {/* ── Missing Persons ── */}
      <section className="reveal-up mx-8 mb-20 overflow-hidden rounded-3xl bg-[#F3F4F6] text-[#111827] md:mx-12">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-8 md:p-12">
            <div className="mb-5 inline-flex items-center gap-2.5 rounded-full bg-[#F9FAFB] px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-[#D97706]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D97706] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#D97706]" />
              </span>
              Community Safety
            </div>
            <h2 className="font-display text-[clamp(36px,4.5vw,60px)] uppercase leading-[0.9] tracking-tight">
              We look out<br />for each other
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-[#6B7280]">
              Report missing persons directly to the VOADI community. Admin-reviewed submissions
              go to all members instantly via push alerts — because every second matters.
            </p>
            <Link
              href="/signup"
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#F9FAFB] py-3.5 pl-7 pr-2 text-sm font-bold text-[#111827] transition-transform hover:-translate-y-0.5"
            >
              <span>Join &amp; Stay Informed</span>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#D97706] text-[#111827]">
                <ArrowUpRightIcon />
              </span>
            </Link>
          </div>
          <div className="relative min-h-[260px] bg-[#E5E7EB] md:min-h-0">
            <Image
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80"
              alt="Community members supporting each other"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#F3F4F6]/50 to-transparent md:bg-gradient-to-l" />
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="community" className="testimonials-section px-8 pb-20 md:px-12">
        <div className="reveal-up mb-10">
          <p className="mb-2 text-xs uppercase tracking-widest text-[#D97706]">Community voices</p>
          <h2 className="font-display text-[clamp(36px,5vw,64px)] uppercase leading-[0.9] tracking-tight text-[#111827]">
            Heard across Ireland
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="testimonial-card flex flex-col rounded-2xl border border-[#E5E7EB] bg-[#FFFFFF] p-7"
            >
              <div className="mb-4 text-[#E5E7EB]">
                <QuoteIcon />
              </div>
              <p className="flex-1 text-sm leading-relaxed text-[#6B7280]">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3 border-t border-[#E5E7EB] pt-5">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#E5E7EB]">
                  <Image src={t.photo} alt="" fill sizes="40px" className="object-cover" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#111827]">{t.name}</p>
                  <p className="text-xs text-[#4B5563]">{t.county}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Donations ── */}
      <DonateSection />

      {/* ── Volunteers ── */}
      <section id="volunteer" className="volunteers-section px-8 py-20 md:px-12">
        <div className="volunteer-heading reveal-up mb-12">
          <p className="mb-2 text-xs uppercase tracking-widest text-[#D97706]">Lend your skills</p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="font-display text-[clamp(36px,5vw,64px)] uppercase leading-[0.9] tracking-tight text-[#111827]">
              Volunteer<br />with us
            </h2>
            <p className="max-w-xs text-sm leading-relaxed text-[#6B7280] sm:text-right">
              Real impact comes from people across every walk of life working
              together. Wherever your expertise lies, there is a role for you.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {VOLUNTEER_ROLES.map(({ title, desc, Icon, accent }) => (
            <div
              key={title}
              className="volunteer-card group rounded-2xl border border-[#E5E7EB] bg-[#FFFFFF] p-6 transition-colors hover:border-[#4A2828]"
            >
              <div
                className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[#E5E7EB]"
                style={{ color: accent }}
              >
                <Icon />
              </div>
              <h3 className="mb-2 text-base font-bold text-[#111827]">{title}</h3>
              <p className="text-sm leading-relaxed text-[#6B7280]">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Link
            href="/signup"
            className="inline-flex items-center gap-3 rounded-full bg-[#D97706] py-3.5 pl-7 pr-2 text-sm font-bold text-[#111827] transition-transform hover:-translate-y-0.5"
          >
            <span>Register as a Volunteer</span>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#F9FAFB] text-[#D97706]">
              <ArrowUpRightIcon />
            </span>
          </Link>
          <p className="text-sm text-[#4B5563]">
            Takes 2 minutes. No commitment required to sign up.
          </p>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section id="about" className="reveal-up mx-8 mb-20 overflow-hidden rounded-3xl md:mx-12">
        <div className="relative grid grid-cols-1 overflow-hidden rounded-3xl bg-[#FFFFFF] md:grid-cols-2">
          {/* Amber accent line at top */}
          <div className="absolute left-0 right-0 top-0 h-0.5 bg-[#D97706]" />

          <div className="relative z-10 p-8 md:p-12">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-[#D97706]">
              Join the movement
            </p>
            <h2 className="font-display text-[clamp(40px,5.5vw,76px)] uppercase leading-[0.88] tracking-tight text-[#111827]">
              One community.<br />One voice.<br />One Ireland.
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-[#6B7280]">
              VOADI is free, open to all Africans living in Ireland, and built with your
              community&apos;s interests at heart. Sign up in under a minute.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center gap-3 rounded-full bg-[#D97706] py-3.5 pl-7 pr-2 text-sm font-bold text-[#111827] transition-transform hover:-translate-y-0.5"
              >
                <span>Create Free Account</span>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#F9FAFB] text-[#D97706]">
                  <FistIcon />
                </span>
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center rounded-full border border-[#9CA3AF] px-6 py-3.5 text-sm font-semibold text-[#111827] transition-colors hover:border-[#D97706] hover:text-[#111827]"
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
              className="object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#F9FAFB] to-transparent" />
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#E5E7EB] px-8 py-10 md:px-12">
        <div className="mb-8 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <VoadiLogo size="lg" />
            <p className="mt-1.5 text-xs text-[#4B5563]">
              Voices of Africans Diaspora Ireland
            </p>
          </div>
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-6">
              {NAV_LINKS.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-xs text-[#4B5563] transition-colors hover:text-[#6B7280]">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/signup" className="text-xs text-[#4B5563] transition-colors hover:text-[#6B7280]">
                  Sign Up
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex flex-col items-start justify-between gap-3 border-t border-[#E5E7EB] pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-[#4B5563]">
            © 2026 VOADI · Coalition of Africans Diaspora Ireland
          </p>
          <p className="text-xs text-[#4B5563]">voadi.org</p>
        </div>
      </footer>

    </main>
  )
}
