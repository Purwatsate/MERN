import { query } from '../config/database';
import type { CreatePersonInput, Person } from '../types/models';

export async function create(data: CreatePersonInput): Promise<number> {
  const { rows } = await query<{ person_id: number }>(
    `SELECT sp_create_person($1, $2, $3, $4, $5::gender_type, $6, $7, $8, $9) AS person_id`,
    [
      data.nrc_number ?? null,
      data.full_name,
      data.alias_name ?? null,
      data.date_of_birth ?? null,
      data.gender,
      data.father_name ?? null,
      data.phone_number ?? null,
      data.current_address ?? null,
      data.photo_url ?? null,
    ]
  );
  return rows[0].person_id;
}

export async function findById(personId: number): Promise<Person | null> {
  const { rows } = await query<Person>(`SELECT * FROM sp_get_person($1)`, [personId]);
  return rows[0] ?? null;
}

export async function search(keyword: string): Promise<Person[]> {
  const { rows } = await query<Person>(`SELECT * FROM sp_search_people($1)`, [keyword]);
  return rows;
}

export async function update(personId: number, data: CreatePersonInput): Promise<boolean> {
  const { rows } = await query<{ updated: boolean }>(
    `SELECT sp_update_person($1, $2, $3, $4, $5, $6::gender_type, $7, $8, $9, $10) AS updated`,
    [
      personId,
      data.nrc_number ?? null,
      data.full_name,
      data.alias_name ?? null,
      data.date_of_birth ?? null,
      data.gender,
      data.father_name ?? null,
      data.phone_number ?? null,
      data.current_address ?? null,
      data.photo_url ?? null,
    ]
  );
  return rows[0].updated;
}

export async function remove(personId: number): Promise<boolean> {
  const { rows } = await query<{ deleted: boolean }>(
    `SELECT sp_delete_person($1) AS deleted`,
    [personId]
  );
  return rows[0].deleted;
}

export async function listAll(limit = 100, offset = 0): Promise<Person[]> {
  const { rows } = await query<Person>(
    `SELECT * FROM people ORDER BY full_name LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return rows;
}
