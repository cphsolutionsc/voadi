import {
  pgTable,
  pgEnum,
  text,
  timestamp,
  uuid,
  integer,
  boolean,
  unique,
  uniqueIndex,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

export const userRoleEnum = pgEnum('user_role', ['member', 'moderator', 'admin'])
export const eventStatusEnum = pgEnum('event_status', ['draft', 'published', 'cancelled'])
export const petitionStatusEnum = pgEnum('petition_status', ['open', 'closed'])
export const missingPersonStatusEnum = pgEnum('missing_person_status', ['pending', 'published', 'resolved'])
export const helpPostStatusEnum = pgEnum('help_post_status', ['open', 'resolved'])
export const helpCategoryEnum = pgEnum('help_category', ['housing', 'legal', 'medical', 'jobs', 'other'])
export const pushTypeEnum = pgEnum('push_type', ['urgent', 'event', 'missing', 'petition', 'help'])
export const eventTypeEnum = pgEnum('event_type', ['in_person', 'virtual'])
export const townHallStatusEnum = pgEnum('town_hall_status', ['idle', 'live', 'ended'])

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  name: text('name').notNull(),
  image: text('image'),
  county: text('county').notNull().default('Dublin'),
  nationality: text('nationality'),
  countryOfBirth: text('country_of_birth'),
  role: text('role').notNull().default('member'),
  vouchedBy: uuid('vouched_by'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (t) => [
  // Enforce at most one super_admin across the whole platform
  uniqueIndex('users_super_admin_singleton').on(t.role).where(sql`role = 'super_admin'`),
])

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const accounts = pgTable('accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  idToken: text('id_token'),
  password: text('password'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const verifications = pgTable('verifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const pushSubscriptions = pgTable('push_subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  endpoint: text('endpoint').notNull().unique(),
  p256dh: text('p256dh').notNull(),
  auth: text('auth').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  location: text('location').notNull(),
  county: text('county').notNull(),
  startsAt: timestamp('starts_at').notNull(),
  endsAt: timestamp('ends_at'),
  eventType: eventTypeEnum('event_type').default('in_person').notNull(),
  createdBy: uuid('created_by').notNull().references(() => users.id),
  status: eventStatusEnum('status').default('published').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const townHalls = pgTable('town_halls', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id').notNull().unique().references(() => events.id, { onDelete: 'cascade' }),
  livekitRoomName: text('livekit_room_name').notNull().unique(),
  townHallStatus: townHallStatusEnum('town_hall_status').default('idle').notNull(),
  egressId: text('egress_id'),
  recordingR2Key: text('recording_r2_key'),
  transcript: text('transcript'),
  summary: text('summary'),
  summarySentAt: timestamp('summary_sent_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const eventRsvps = pgTable('event_rsvps', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => [unique().on(t.eventId, t.userId)])

export const petitions = pgTable('petitions', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  body: text('body').notNull(),
  target: text('target').notNull(),
  createdBy: uuid('created_by').notNull().references(() => users.id),
  signatureCount: integer('signature_count').default(0).notNull(),
  status: petitionStatusEnum('status').default('open').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const petitionSignatures = pgTable('petition_signatures', {
  id: uuid('id').primaryKey().defaultRandom(),
  petitionId: uuid('petition_id').notNull().references(() => petitions.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => [unique().on(t.petitionId, t.userId)])

export const politicians = pgTable('politicians', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  party: text('party').notNull(),
  role: text('role').notNull(),
  county: text('county').notNull(),
  email: text('email'),
  phone: text('phone'),
  constituency: text('constituency').notNull(),
  photoUrl: text('photo_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const missingPersons = pgTable('missing_persons', {
  id: uuid('id').primaryKey().defaultRandom(),
  fullName: text('full_name').notNull(),
  age: integer('age'),
  lastSeenLocation: text('last_seen_location').notNull(),
  lastSeenAt: timestamp('last_seen_at').notNull(),
  description: text('description').notNull(),
  photoUrl: text('photo_url'),
  contactInfo: text('contact_info').notNull(),
  submittedBy: uuid('submitted_by').notNull().references(() => users.id),
  status: missingPersonStatusEnum('status').default('pending').notNull(),
  approvedBy: uuid('approved_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const helpPosts = pgTable('help_posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  body: text('body').notNull(),
  category: helpCategoryEnum('category').notNull(),
  createdBy: uuid('created_by').notNull().references(() => users.id),
  status: helpPostStatusEnum('status').default('open').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const helpResponses = pgTable('help_responses', {
  id: uuid('id').primaryKey().defaultRandom(),
  helpPostId: uuid('help_post_id').notNull().references(() => helpPosts.id, { onDelete: 'cascade' }),
  body: text('body').notNull(),
  createdBy: uuid('created_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const pushNotifications = pgTable('push_notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  body: text('body').notNull(),
  url: text('url'),
  sentAt: timestamp('sent_at').defaultNow().notNull(),
  sentBy: uuid('sent_by').references(() => users.id),
  type: pushTypeEnum('type').notNull(),
})
