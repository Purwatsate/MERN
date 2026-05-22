import dotenv from 'dotenv';
import app from './app';
import { pool } from './config/database';
import { logger } from './config/logger';

dotenv.config();

const PORT = process.env.PORT || 3000;

async function start(): Promise<void> {
  try {
    await pool.query('SELECT 1');
    logger.info('PostgreSQL connected');
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    logger.error('Failed to connect to PostgreSQL', { message });
    logger.error('Run: npm run db:init');
    process.exit(1);
  }

  app.listen(PORT, () => {
    logger.info(`Police Database API listening on http://localhost:${PORT}`);
  });
}

start();
