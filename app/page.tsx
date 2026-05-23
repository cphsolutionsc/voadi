import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'VOADI — Voices of Africans Diaspora Ireland',
  description:
    'Mobilising the African community across Ireland — protests, petitions, missing persons, community support.',
}

function LogoIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Community', href: '#community' },
  { label: 'Events', href: '#events' },
  { label: 'About Us', href: '#about' },
  { label: 'Login', href: '/login' },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-white font-sans">
      <nav className="flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <LogoIcon />
          <span>VOADI</span>
        </Link>

        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm text-neutral-500 hover:text-black transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/signup"
          className="hidden md:inline-flex bg-black text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-neutral-800 transition-colors"
        >
          Join Now
        </Link>
      </nav>

      <section className="text-center px-6 pt-12 pb-0 overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-6xl sm:text-7xl lg:text-8xl font-bold leading-tight tracking-tight text-black mb-6">
            Make Our Voices<br />Matter in Ireland
          </h1>
          <p className="text-neutral-400 text-base sm:text-lg max-w-md mx-auto mb-10 leading-relaxed">
            Organise, mobilise, and support one another — protests, petitions,
            missing persons alerts, and community help.
          </p>
          <div className="flex items-center justify-center gap-3 mb-14">
            <Link
              href="/signup"
              className="bg-black text-white text-sm font-medium px-6 py-3 rounded-full hover:bg-neutral-800 transition-colors"
            >
              Join Now
            </Link>
            <Link
              href="#features"
              className="flex items-center gap-2 border border-neutral-200 text-sm font-medium px-6 py-3 rounded-full hover:bg-neutral-50 transition-colors text-black"
            >
              <GlobeIcon />
              Explore Features
            </Link>
          </div>
        </div>

        <div className="relative max-w-5xl mx-auto rounded-t-3xl overflow-hidden h-80 sm:h-96 bg-neutral-100">
          <Image
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80"
            alt="African community members in Ireland"
            fill
            className="object-cover object-top"
            priority
          />
        </div>
      </section>

      <section id="features" className="bg-white px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-4xl font-bold text-center mb-4">
            Built for our community
          </h2>
          <p className="text-neutral-400 text-center text-sm mb-16 max-w-md mx-auto">
            Everything you need to organise, mobilise, and support one another across Ireland.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Organise Events',
                desc: 'Create and share protests, marches, and civic actions across Ireland.',
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                ),
              },
              {
                title: 'Sign Petitions',
                desc: 'Launch petitions and make your collective voice heard by decision-makers.',
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                ),
              },
              {
                title: 'Missing Persons',
                desc: 'Rapid community-wide alerts to help locate missing members of our diaspora.',
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                ),
              },
              {
                title: 'Help Hub',
                desc: 'Connect with support services and look out for one another.',
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                ),
              },
            ].map(f => (
              <div key={f.title} className="border border-neutral-100 rounded-2xl p-6 hover:border-neutral-200 transition-colors">
                <div className="text-neutral-700 mb-4">{f.icon}</div>
                <h3 className="font-semibold text-sm text-black mb-2">{f.title}</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black text-white px-6 py-24 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="font-serif text-4xl sm:text-5xl font-bold mb-4">
            Be the first to know
          </h2>
          <p className="text-neutral-400 text-sm mb-8">
            Leave your email and we will notify you when VOADI launches.
          </p>
          <Link
            href="mailto:hello@voadi.org?subject=Keep%20me%20updated%20on%20VOADI"
            className="inline-flex items-center gap-2 bg-white text-black text-sm font-semibold px-8 py-3.5 rounded-full hover:bg-neutral-100 transition-colors"
          >
            Register your interest
          </Link>
        </div>
      </section>

      <footer className="bg-black border-t border-neutral-800 px-6 py-6 text-center">
        <p className="text-neutral-500 text-xs">
          A Coalition of Africans Diaspora Ireland initiative · voadi.org
        </p>
      </footer>
    </main>
  )
}
