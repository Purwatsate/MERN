import fs from 'fs';
import path from 'path';
import { Client } from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const DB_NAME = process.env.DB_NAME || 'police_db';

function readSql(filename: string): string {
  const filePath = path.join(__dirname, '..', 'database', filename);
  return fs.readFileSync(filePath, 'utf8');
}

function schemaWithoutCreateDb(sql: string): string {
  return sql
    .split('\n')
    .filter((line) => !line.trim().startsWith('\\c') && !/^CREATE DATABASE/i.test(line.trim()))
    .join('\n');
}

async function main(): Promise<void> {
  const adminClient = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: 'postgres',
  });

  console.log('Connecting to PostgreSQL...');
  await adminClient.connect();

  const dbCheck = await adminClient.query(
    'SELECT 1 FROM pg_database WHERE datname = $1',
    [DB_NAME]
  );

  if (dbCheck.rows.length === 0) {
    console.log(`Creating database "${DB_NAME}"...`);
    await adminClient.query(`CREATE DATABASE ${DB_NAME}`);
  } else {
    console.log(`Database "${DB_NAME}" already exists.`);
  }
  await adminClient.end();

  const dbClient = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: DB_NAME,
  });

  await dbClient.connect();
  console.log('Applying schema...');
  await dbClient.query(schemaWithoutCreateDb(readSql('schema.sql')));

  console.log('Applying stored procedures...');
  await dbClient.query(readSql('stored_procedures.sql'));

  console.log('Seeding default admin user...');
  const passwordHash = await bcrypt.hash('Admin@123', 10);
  await dbClient.query(
    `INSERT INTO users (badge_number, username, password_hash, rank, role)
     VALUES ($1, $2, $3, $4, $5::user_role)
     ON CONFLICT (username) DO NOTHING`,
    ['ADMIN-001', 'admin', passwordHash, 'ရဲအုပ်', 'Admin']
  );

  await dbClient.end();
  console.log('Database initialized successfully.');
  console.log('Default login: username=admin  password=Admin@123');
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : 'Unknown error';
  console.error('Database init failed:', message);
  process.exit(1);
});
