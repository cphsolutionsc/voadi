import { createHelpPost } from '@/lib/actions'

export const metadata = { title: 'Ask for Help — VOADI' }

const INPUT = 'w-full rounded-lg border border-[#E5E7EB] bg-[#FFFFFF] px-4 py-3 text-sm text-[#111827] placeholder-[#9CA3AF] focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706]'

export default function NewHelpPostPage() {
  return (
    <div className="py-2">
      <h1 className="mb-1 text-lg font-bold text-[#111827]">Ask for Help</h1>
      <p className="mb-6 text-xs text-[#4B5563]">Describe what you need and the community will respond.</p>

      <form action={createHelpPost} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-[#6B7280]">Category</label>
          <select name="category" required className={`${INPUT} appearance-none`}>
            <option value="" className="bg-[#FFFFFF]">Select a category</option>
            <option value="housing" className="bg-[#FFFFFF]">Housing</option>
            <option value="legal"   className="bg-[#FFFFFF]">Legal</option>
            <option value="medical" className="bg-[#FFFFFF]">Medical</option>
            <option value="jobs"    className="bg-[#FFFFFF]">Jobs</option>
            <option value="other"   className="bg-[#FFFFFF]">Other</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-[#6B7280]">Title</label>
          <input name="title" required placeholder="Brief summary of what you need" className={INPUT} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-[#6B7280]">Details</label>
          <textarea
            name="body"
            required
            rows={5}
            placeholder="Explain your situation in as much detail as you are comfortable sharing…"
            className={`${INPUT} resize-none`}
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-xl bg-[#D97706] py-3.5 text-sm font-bold text-[#111827] transition-opacity hover:opacity-90"
        >
          Post request
        </button>
      </form>
    </div>
  )
}
