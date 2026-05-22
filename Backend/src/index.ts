import dotenv from 'dotenv';
import app from './app';
import { pool } from './config/database';

dotenv.config();

const PORT = process.env.PORT || 3000;

async function start(): Promise<void> {
  try {
    await pool.query('SELECT 1');
    console.log('PostgreSQL connected');
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Failed to connect to PostgreSQL:', message);
    console.error('Run: npm run db:init');
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Police Database API listening on http://localhost:${PORT}`);
  });
}

start();
