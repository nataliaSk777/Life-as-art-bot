import pg from 'pg';
import { env } from './env.js';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl:
    env.DATABASE_URL.includes('railway') ||
    env.DATABASE_URL.includes('proxy.rlwy.net')
      ? { rejectUnauthorized: false }
      : false,
  max: 8,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000
});
