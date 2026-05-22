import { Pool, QueryResult, QueryResultRow } from 'pg';
import dotenv from 'dotenv';
import { logger } from './logger';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'police_db',
});

pool.on('error', (err: Error) => {
  logger.error('Unexpected PostgreSQL pool error', { message: err.message, stack: err.stack });
});

async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> {
  return pool.query<T>(text, params);
}

export { pool, query };
