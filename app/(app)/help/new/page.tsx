import { createHelpPost } from '@/lib/actions'

export const metadata = { title: 'Ask for Help — VOADI' }

const INPUT = 'w-full rounded-lg border border-[#2A1515] bg-[#140909] px-4 py-3 text-sm text-[#F5EDD0] placeholder-[#5C4A3A] focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706]'

export default function NewHelpPostPage() {
  return (
    <div className="py-2">
      <h1 className="mb-1 text-lg font-bold text-white">Ask for Help</h1>
      <p className="mb-6 text-xs text-[#8B7B6B]">Describe what you need and the community will respond.</p>

      <form action={createHelpPost} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-[#A89080]">Category</label>
          <select name="category" required className={`${INPUT} appearance-none`}>
            <option value="" className="bg-[#1E0E0E]">Select a category</option>
            <option value="housing" className="bg-[#1E0E0E]">Housing</option>
            <option value="legal"   className="bg-[#1E0E0E]">Legal</option>
            <option value="medical" className="bg-[#1E0E0E]">Medical</option>
            <option value="jobs"    className="bg-[#1E0E0E]">Jobs</option>
            <option value="other"   className="bg-[#1E0E0E]">Other</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-[#A89080]">Title</label>
          <input name="title" required placeholder="Brief summary of what you need" className={INPUT} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-[#A89080]">Details</label>
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
          className="w-full rounded-xl bg-[#D97706] py-3.5 text-sm font-bold text-[#1C0D0D] transition-opacity hover:opacity-90"
        >
          Post request
        </button>
      </form>
    </div>
  )
}
