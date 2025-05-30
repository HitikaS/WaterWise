import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const sqlite = new Database(process.env.DATABASE_URL.replace('file:', ''));

// Create tables if they don't exist
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    sid TEXT PRIMARY KEY,
    sess TEXT NOT NULL,
    expire INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    profile_image_url TEXT,
    water_saved INTEGER DEFAULT 0,
    actions_count INTEGER DEFAULT 0,
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch())
  );

  CREATE TABLE IF NOT EXISTS water_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    issue_type TEXT NOT NULL,
    severity TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    user_id INTEGER,
    user_name TEXT,
    status TEXT DEFAULT 'open',
    created_at INTEGER DEFAULT (unixepoch())
  );

  CREATE TABLE IF NOT EXISTS weather_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    temperature REAL NOT NULL,
    rainfall REAL NOT NULL,
    humidity REAL NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    created_at INTEGER DEFAULT (unixepoch())
  );

  CREATE TABLE IF NOT EXISTS predictions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    week INTEGER NOT NULL,
    risk_level REAL NOT NULL,
    expected_rainfall REAL NOT NULL,
    temperature REAL NOT NULL,
    user_reports_count INTEGER NOT NULL,
    created_at INTEGER DEFAULT (unixepoch())
  );

  CREATE TABLE IF NOT EXISTS water_tips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    water_saving REAL NOT NULL,
    category TEXT NOT NULL,
    is_active INTEGER DEFAULT 1
  );
`);

export const db = drizzle(sqlite, { schema });