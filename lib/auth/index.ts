import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import * as React from 'react'
import { db } from '@/lib/db'
import * as schema from '@/lib/db/schema'
import { sendEmail } from '@/lib/email'
import { WelcomeEmail } from '@/lib/email/templates/welcome'
import { VerificationEmail } from '@/lib/email/templates/verify'

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  advanced: {
    database: {
      generateId: 'uuid',
    },
  },
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: 'Verify your VOADI email address',
        react: React.createElement(VerificationEmail, { name: user.name, url }),
      }).catch(console.error)
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  user: {
    additionalFields: {
      county: {
        type: 'string',
        required: true,
        defaultValue: 'Dublin',
      },
      nationality: {
        type: 'string',
        required: false,
      },
      countryOfBirth: {
        type: 'string',
        required: false,
      },
      role: {
        type: 'string',
        required: false,
        defaultValue: 'member',
      },
    },
  },
  trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'],
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          if (user.email && user.name) {
            await sendEmail({
              to: user.email,
              subject: 'Welcome to VOADI',
              react: React.createElement(WelcomeEmail, { name: user.name }),
            }).catch(console.error)
          }
        },
      },
    },
  },
})
