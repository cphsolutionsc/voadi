export const dynamic = 'force-dynamic'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { petitions, petitionSignatures } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { SignButton } from './sign-button'

export default async function PetitionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth.api.getSession({ headers: await headers() })

  const [petition] = await db.select().from(petitions).where(eq(petitions.id, id))
  if (!petition) notFound()

  const hasSigned = session
    ? (await db.select().from(petitionSignatures).where(
        and(eq(petitionSignatures.petitionId, id), eq(petitionSignatures.userId, session.user.id))
      )).length > 0
    : false

  const pct = Math.min(100, Math.round((petition.signatureCount / 1000) * 100))
  const created = petition.createdAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="py-2">
      <div className="mb-2">
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${
          petition.status === 'open' ? 'bg-[#1a2e1a] text-[#16a34a]' : 'bg-[#2A1515] text-[#8B7B6B]'
        }`}>
          {petition.status === 'open' ? 'Open' : 'Closed'}
        </span>
      </div>

      <h1 className="mb-2 text-xl font-bold leading-snug text-white">{petition.title}</h1>
      <p className="mb-6 text-xs text-[#8B7B6B]">Addressed to: {petition.target} · Created {created}</p>

      <div className="mb-6 rounded-xl border border-[#2A1515] bg-[#1E0E0E] p-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-bold text-white">{petition.signatureCount.toLocaleString('en-GB')}</span>
          <span className="text-[#8B7B6B]">goal: 1,000</span>
        </div>
        <div className="mb-1 h-2 overflow-hidden rounded-full bg-[#2A1515]">
          <div className="h-full rounded-full bg-[#16a34a]" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-xs text-[#8B7B6B]">{pct}% of goal reached</p>
      </div>

      <p className="mb-8 whitespace-pre-wrap text-sm leading-relaxed text-[#A89080]">{petition.body}</p>

      {session && petition.status === 'open' && (
        <SignButton petitionId={id} hasSigned={hasSigned} />
      )}
      {!session && (
        <p className="text-sm text-[#8B7B6B]">
          <a href="/login" className="text-[#D97706] underline underline-offset-2">Sign in</a> to add your signature.
        </p>
      )}
      {session && petition.status === 'closed' && (
        <p className="text-sm text-[#8B7B6B]">This petition is now closed.</p>
      )}
    </div>
  )
}
