import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'VOADI — Voices of Africans Diaspora Ireland',
  description:
    'Mobilising the African community across Ireland — protests, petitions, missing persons, community support.',
}

interface FeatureCard {
  title: string
  description: string
  icon: React.ReactNode
}

function MegaphoneIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 11l19-9-9 19-2-8-8-2z" />
    </svg>
  )
}

function PetitionIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  )
}

function AlertIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}

function CommunityIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

const features: FeatureCard[] = [
  {
    title: 'Organise Events & Protests',
    description:
      'Create, share, and mobilise around community events, marches, and civic actions across Ireland.',
    icon: <MegaphoneIcon />,
  },
  {
    title: 'Sign & Share Petitions',
    description:
      'Launch petitions, gather signatures, and make your collective voice heard by decision-makers.',
    icon: <PetitionIcon />,
  },
  {
    title: 'Missing Persons Alerts',
    description:
      'Rapid community-wide alerts to help locate missing members of our diaspora.',
    icon: <AlertIcon />,
  },
  {
    title: 'Community Help Hub',
    description:
      'Connect with support services, share resources, and look out for one another.',
    icon: <CommunityIcon />,
  },
]

function FeatureCard({ title, description, icon }: FeatureCard) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 flex flex-col gap-4">
      <div className="text-neutral-800">{icon}</div>
      <div>
        <h3 className="text-base font-semibold text-neutral-900 mb-1">{title}</h3>
        <p className="text-sm text-neutral-600 leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-black text-white min-h-[60dvh] flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="max-w-2xl mx-auto flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold tracking-[0.25em] text-neutral-400 uppercase">
              voadi.org
            </span>
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-none">
              VOADI
            </h1>
            <p className="text-lg sm:text-xl font-light text-neutral-300 mt-1">
              Voices of Africans Diaspora Ireland
            </p>
          </div>
          <p className="text-neutral-400 text-base sm:text-lg leading-relaxed max-w-lg mx-auto">
            Mobilising the African community across Ireland — protests, petitions,
            missing persons, community support.
          </p>
          <div className="w-12 h-px bg-neutral-600 mx-auto" />
          <p className="text-sm text-neutral-500 font-medium uppercase tracking-widest">
            Launching soon
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="bg-neutral-50 px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-neutral-900 text-center mb-2">
            Built for our community
          </h2>
          <p className="text-neutral-500 text-center text-sm mb-12">
            Everything you need to organise, mobilise, and support one another.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Email signup */}
      <section className="bg-white px-6 py-20">
        <div className="max-w-md mx-auto text-center flex flex-col gap-6">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">
              Be the first to know
            </h2>
            <p className="text-neutral-500 text-sm">
              Leave your email and we will notify you when VOADI launches.
            </p>
          </div>
          <a
            href="mailto:hello@voadi.org?subject=Keep%20me%20updated%20on%20VOADI"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-black text-white px-6 py-4 text-sm font-semibold hover:bg-neutral-800 transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            Register your interest
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-neutral-500 px-6 py-8 text-center text-xs">
        <p>A Coalition of Africans Diaspora Ireland initiative · voadi.org</p>
      </footer>
    </main>
  )
}
