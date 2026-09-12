// Intentionally empty by default.
// Add Drizzle tables here when the site actually needs a database.
// See examples/d1/db/schema.ts for an opt-in example.
import {sqliteTable,text,integer,index} from 'drizzle-orm/sqlite-core';
export const classes=sqliteTable('classes',{code:text('code').primaryKey(),name:text('name').notNull(),teacher:text('teacher').notNull(),challenge:text('challenge').notNull(),strength:text('strength').notNull()});
export const participants=sqliteTable('participants',{id:text('id').primaryKey(),name:text('name').notNull(),code:text('code'),token:text('token').notNull(),role:text('role').notNull()},t=>[index('participants_token').on(t.token),index('participants_code').on(t.code)]);
export const attempts=sqliteTable('attempts',{id:text('id').primaryKey(),participant:text('participant').notNull(),payload:text('payload').notNull(),created:text('created').notNull()},t=>[index('attempts_participant').on(t.participant)]);
