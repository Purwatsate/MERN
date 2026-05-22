import { query } from '../config/database';
import type { CreateUserInput, User } from '../types/models';

export async function create(data: CreateUserInput): Promise<number> {
  const { rows } = await query<{ user_id: number }>(
    `SELECT sp_create_user($1, $2, $3, $4, $5::user_role) AS user_id`,
    [
      data.badge_number,
      data.username,
      data.password_hash,
      data.rank ?? null,
      data.role ?? 'Officer',
    ]
  );
  return rows[0].user_id;
}

export async function findByUsername(username: string): Promise<User | null> {
  const { rows } = await query<User>(`SELECT * FROM sp_get_user_by_username($1)`, [username]);
  return rows[0] ?? null;
}

export async function findById(userId: number): Promise<Omit<User, 'password_hash'> | null> {
  const { rows } = await query<User>(`SELECT * FROM sp_get_user_by_id($1)`, [userId]);
  const user = rows[0];
  if (!user) return null;
  const { password_hash: _, ...safeUser } = user;
  return safeUser;
}
