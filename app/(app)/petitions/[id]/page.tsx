export const dynamic = 'force-dynamic'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import Link from 'next/link'
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
      <div className="mb-3">
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
          petition.status === 'open'
            ? 'bg-[#D1FAE5] text-[#065F46]'
            : 'bg-[#E5E7EB] text-[#4B5563]'
        }`}>
          {petition.status === 'open' ? 'Open' : 'Closed'}
        </span>
      </div>

      <h1 className="mb-2 text-xl font-bold leading-snug text-[#111827]">{petition.title}</h1>
      <p className="mb-6 text-xs text-[#4B5563]">Addressed to: {petition.target} · Created {created}</p>

      {/* Signatures progress */}
      <div className="mb-6 rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] p-4">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <span className="text-2xl font-bold text-[#D97706]">
              {petition.signatureCount.toLocaleString('en-GB')}
            </span>
            <span className="ml-1.5 text-xs text-[#4B5563]">signatures</span>
          </div>
          <span className="text-xs text-[#9CA3AF]">Goal: 1,000</span>
        </div>
        <div className="mb-1.5 h-2 overflow-hidden rounded-full bg-[#F3F4F6]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#D97706] to-[#F59E0B]"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-right text-xs font-semibold text-[#D97706]">{pct}%</p>
      </div>

      <p className="mb-8 whitespace-pre-wrap text-sm leading-relaxed text-[#6B7280]">{petition.body}</p>

      {session && petition.status === 'open' && (
        <SignButton petitionId={id} hasSigned={hasSigned} />
      )}
      {!session && (
        <Link
          href="/login"
          className="flex w-full items-center justify-center rounded-xl bg-[#D97706] py-3.5 text-sm font-bold text-[#111827] transition-opacity hover:opacity-90"
        >
          Sign in to add your signature
        </Link>
      )}
      {session && petition.status === 'closed' && (
        <p className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 text-sm text-[#4B5563]">
          This petition is now closed.
        </p>
      )}
    </div>
  )
}
