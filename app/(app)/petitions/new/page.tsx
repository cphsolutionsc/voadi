import { createPetition } from '@/lib/actions'

export const metadata = { title: 'Start a petition — VOADI' }

const INPUT = 'w-full rounded-lg border border-[#E5E7EB] bg-[#FFFFFF] px-4 py-3 text-sm text-[#111827] placeholder-[#9CA3AF] transition-colors focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706]'

export default function NewPetitionPage() {
  return (
    <div className="py-2">
      <h1 className="mb-1 text-lg font-bold text-[#111827]">Start a petition</h1>
      <p className="mb-6 text-xs text-[#4B5563]">Petitions are public and can be signed by all members.</p>

      <form action={createPetition} className="space-y-4">
        <div>
          <label htmlFor="title" className="mb-1.5 block text-xs font-semibold text-[#4B5563]">Title</label>
          <input id="title" name="title" type="text" required maxLength={120}
            placeholder="A clear, concise title for your petition"
            className={INPUT} />
        </div>
        <div>
          <label htmlFor="target" className="mb-1.5 block text-xs font-semibold text-[#4B5563]">Directed at</label>
          <input id="target" name="target" type="text" required maxLength={120}
            placeholder="e.g. Minister for Justice, Dublin City Council"
            className={INPUT} />
        </div>
        <div>
          <label htmlFor="body" className="mb-1.5 block text-xs font-semibold text-[#4B5563]">Why this matters</label>
          <textarea id="body" name="body" required rows={6} maxLength={2000}
            placeholder="Explain the issue, who it affects, and what action you are asking for."
            className={`${INPUT} resize-none`} />
        </div>
        <button type="submit"
          className="w-full rounded-lg bg-[#D97706] py-3 text-sm font-bold text-[#111827] transition-opacity hover:opacity-90">
          Submit petition
        </button>
      </form>
    </div>
  )
}
