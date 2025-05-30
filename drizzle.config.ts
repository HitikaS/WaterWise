import type { Config } from 'drizzle-kit';

export default {
  schema: './shared/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  driver: 'better-sqlite3',
  dbCredentials: {
    url: process.env.DATABASE_URL?.replace('file:', '') || './data.db'
  }
} satisfies Config;
