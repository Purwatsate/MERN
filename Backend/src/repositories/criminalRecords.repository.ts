import { query } from '../config/database';
import type { CreateCriminalRecordInput, CriminalRecordDetail } from '../types/models';

export async function create(data: CreateCriminalRecordInput): Promise<number> {
  const { rows } = await query<{ record_id: number }>(
    `SELECT sp_create_criminal_record($1, $2, $3::criminal_role, $4, $5) AS record_id`,
    [
      data.person_id,
      data.incident_id,
      data.role,
      data.arrest_date ?? null,
      data.punishment ?? null,
    ]
  );
  return rows[0].record_id;
}

export async function findById(recordId: number): Promise<CriminalRecordDetail | null> {
  const { rows } = await query<CriminalRecordDetail>(
    `SELECT * FROM sp_get_criminal_record($1)`,
    [recordId]
  );
  return rows[0] ?? null;
}

export async function listByIncident(incidentId: number): Promise<CriminalRecordDetail[]> {
  const { rows } = await query<CriminalRecordDetail>(
    `SELECT * FROM sp_list_criminal_records_by_incident($1)`,
    [incidentId]
  );
  return rows;
}

export async function listByPerson(personId: number): Promise<CriminalRecordDetail[]> {
  const { rows } = await query<CriminalRecordDetail>(
    `SELECT * FROM sp_list_criminal_records_by_person($1)`,
    [personId]
  );
  return rows;
}

export async function remove(recordId: number): Promise<boolean> {
  const { rows } = await query<{ deleted: boolean }>(
    `SELECT sp_delete_criminal_record($1) AS deleted`,
    [recordId]
  );
  return rows[0].deleted;
}
