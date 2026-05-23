import { Header } from '@/components/layout/header'
import { Nav } from '@/components/layout/nav'
import { InstallPrompt } from '@/components/layout/install-prompt'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-[#F9FAFB]">
      <InstallPrompt />
      <Header />
      <main className="mx-auto w-full max-w-lg flex-1 px-4 pb-32 pt-4">
        {children}
      </main>
      <Nav />
    </div>
  )
}
