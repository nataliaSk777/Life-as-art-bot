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
      morning_time TEXT DEFAULT '09:00',
      day_time TEXT DEFAULT '14:00',
      evening_time TEXT DEFAULT '21:00',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS daily_intentions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      date DATE NOT NULL,
      chosen_quality TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(user_id, date)
    );

    CREATE TABLE IF NOT EXISTS checkins (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      date DATE NOT NULL,
      period TEXT NOT NULL,
      mood TEXT,
      text TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS beautiful_moments (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      date DATE NOT NULL,
      type TEXT DEFAULT 'moment',
      text TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS deliveries (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      date DATE NOT NULL,
      period TEXT NOT NULL,
      sent_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(user_id, date, period)
    );

    CREATE TABLE IF NOT EXISTS insights (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      period_start DATE NOT NULL,
      period_end DATE NOT NULL,
      text TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
}
