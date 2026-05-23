export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs' && process.env.DATABASE_URL) {
    const { drizzle } = await import('drizzle-orm/postgres-js')
    const { migrate } = await import('drizzle-orm/postgres-js/migrator')
    const postgres = (await import('postgres')).default

    const client = postgres(process.env.DATABASE_URL, { max: 1 })
    const db = drizzle(client)
    await migrate(db, { migrationsFolder: './drizzle/migrations' })
    await client.end()
    console.log('[voadi] DB migrations applied')
  }
}
