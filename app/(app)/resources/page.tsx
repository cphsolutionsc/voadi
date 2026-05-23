export const dynamic = 'force-dynamic'
import { ResourcesClient } from './resources-client'
import { CATEGORIES } from './data'

export const metadata = { title: 'Resources — VOADI' }

export default function ResourcesPage() {
  return <ResourcesClient categories={CATEGORIES} />
}
