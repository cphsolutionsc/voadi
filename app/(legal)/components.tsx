export function Section({ children }: { children: React.ReactNode }) {
  return <section className="space-y-4">{children}</section>
}

export function H2({ n, children }: { n: string | number; children: React.ReactNode }) {
  return (
    <h2 className="flex items-baseline gap-3 text-lg font-bold text-[#111827]">
      <span className="shrink-0 text-[11px] font-bold text-[#D97706]">{n}.</span>
      {children}
    </h2>
  )
}

export function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-bold text-[#111827]">{children}</h3>
}

export function P({ children }: { children: React.ReactNode }) {
  return <p className="text-sm leading-relaxed">{children}</p>
}

export function UL({ children }: { children: React.ReactNode }) {
  return <ul className="space-y-2 pl-1">{children}</ul>
}

export function LI({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3 text-sm leading-relaxed">
      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D97706]/60" />
      <span>{children}</span>
    </li>
  )
}

export function Updated({ date }: { date: string }) {
  return (
    <p className="mt-3 text-xs text-[#9CA3AF]">Last updated: {date}</p>
  )
}
