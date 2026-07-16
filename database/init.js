import { pool } from '../config/database.js';

export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      telegram_id BIGINT UNIQUE NOT NULL,
      first_name TEXT,
      username TEXT,
      timezone TEXT DEFAULT 'Europe/Moscow',
      subscription_status TEXT DEFAULT 'free',
      current_save_mode TEXT,
      awaiting_evening_answer BOOLEAN DEFAULT false,
      awaiting_feedback BOOLEAN DEFAULT false,
      feedback_context TEXT,
      last_feedback_prompt_at TIMESTAMP,
      morning_time TEXT DEFAULT '09:00',
      day_time TEXT DEFAULT '14:00',
      evening_time TEXT DEFAULT '21:00',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    ALTER TABLE users
      ADD COLUMN IF NOT EXISTS awaiting_feedback
      BOOLEAN DEFAULT false;

    ALTER TABLE users
      ADD COLUMN IF NOT EXISTS feedback_context
      TEXT;

    ALTER TABLE users
      ADD COLUMN IF NOT EXISTS last_feedback_prompt_at
      TIMESTAMP;

    CREATE TABLE IF NOT EXISTS daily_intentions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER
        REFERENCES users(id)
        ON DELETE CASCADE,
      date DATE NOT NULL,
      chosen_quality TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(user_id, date)
    );

    CREATE TABLE IF NOT EXISTS checkins (
      id SERIAL PRIMARY KEY,
      user_id INTEGER
        REFERENCES users(id)
        ON DELETE CASCADE,
      date DATE NOT NULL,
      period TEXT NOT NULL,
      mood TEXT,
      text TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS beautiful_moments (
      id SERIAL PRIMARY KEY,
      user_id INTEGER
        REFERENCES users(id)
        ON DELETE CASCADE,
      date DATE NOT NULL,
      type TEXT DEFAULT 'moment',
      text TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS deliveries (
      id SERIAL PRIMARY KEY,
      user_id INTEGER
        REFERENCES users(id)
        ON DELETE CASCADE,
      date DATE NOT NULL,
      period TEXT NOT NULL,
      sent_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(user_id, date, period)
    );

    CREATE TABLE IF NOT EXISTS insights (
      id SERIAL PRIMARY KEY,
      user_id INTEGER
        REFERENCES users(id)
        ON DELETE CASCADE,
      period_start DATE NOT NULL,
      period_end DATE NOT NULL,
      text TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS feedback (
      id SERIAL PRIMARY KEY,
      user_id INTEGER
        REFERENCES users(id)
        ON DELETE CASCADE,
      feedback_type TEXT NOT NULL,
      context TEXT,
      value TEXT,
      message_text TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_feedback_user_id
      ON feedback(user_id);

    CREATE INDEX IF NOT EXISTS idx_feedback_type
      ON feedback(feedback_type);

    CREATE INDEX IF NOT EXISTS idx_feedback_created_at
      ON feedback(created_at DESC);
  `);
}
