-- Cloudflare D1 Database Schema for Windows XP Portfolio

CREATE TABLE IF NOT EXISTS profile (
  id TEXT PRIMARY KEY DEFAULT 'main',
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  headline TEXT NOT NULL,
  bio TEXT NOT NULL,
  location TEXT NOT NULL,
  email TEXT NOT NULL,
  github TEXT NOT NULL,
  linkedin TEXT NOT NULL,
  quote TEXT,
  core_focus TEXT, -- JSON array of strings
  philosophy TEXT,
  resume_content TEXT,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  impact TEXT,
  tech TEXT NOT NULL, -- JSON array of strings
  details TEXT,       -- JSON array of strings
  status TEXT NOT NULL,
  github TEXT,
  link TEXT,
  sort_order INTEGER DEFAULT 0,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS skills (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  items TEXT NOT NULL, -- JSON array of strings
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS experiments (
  id TEXT PRIMARY KEY,
  tag TEXT NOT NULL,
  title TEXT NOT NULL,
  problem TEXT NOT NULL,
  approach TEXT NOT NULL,
  result TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  sender_ip TEXT,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS admin_auth (
  id TEXT PRIMARY KEY DEFAULT 'admin',
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  token TEXT,
  token_expiry INTEGER,
  updated_at INTEGER NOT NULL
);
