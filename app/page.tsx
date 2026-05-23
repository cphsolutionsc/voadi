import type { Metadata } from 'next'
import { HomePage } from '../components/home-page'

export const metadata: Metadata = {
  title: 'VOADI — One Voice, One Ireland',
  description:
    'Mobilising the African diaspora across Ireland — civic action, community, events, and support.',
}

export default function Page() {
  return <HomePage />
}
