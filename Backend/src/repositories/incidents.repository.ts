import { query } from '../config/database';
import type { CreateIncidentInput, Incident, IncidentStatus } from '../types/models';

export async function create(data: CreateIncidentInput): Promise<number> {
  const { rows } = await query<{ incident_id: number }>(
    `SELECT sp_create_incident($1, $2, $3, $4, $5, $6::incident_status) AS incident_id`,
    [
      data.case_number,
      data.title,
      data.description ?? null,
      data.incident_date,
      data.location,
      data.status ?? 'Open',
    ]
  );
  return rows[0].incident_id;
}

export async function findById(incidentId: number): Promise<Incident | null> {
  const { rows } = await query<Incident>(`SELECT * FROM sp_get_incident($1)`, [incidentId]);
  return rows[0] ?? null;
}

export async function list(
  status: IncidentStatus | null,
  limit: number,
  offset: number
): Promise<Incident[]> {
  const { rows } = await query<Incident>(
    `SELECT * FROM sp_list_incidents($1::incident_status, $2, $3)`,
    [status, limit, offset]
  );
  return rows;
}

export async function update(incidentId: number, data: CreateIncidentInput): Promise<boolean> {
  const { rows } = await query<{ updated: boolean }>(
    `SELECT sp_update_incident($1, $2, $3, $4, $5, $6, $7::incident_status) AS updated`,
    [
      incidentId,
      data.case_number,
      data.title,
      data.description ?? null,
      data.incident_date,
      data.location,
      data.status ?? 'Open',
    ]
  );
  return rows[0].updated;
}

export async function remove(incidentId: number): Promise<boolean> {
  const { rows } = await query<{ deleted: boolean }>(
    `SELECT sp_delete_incident($1) AS deleted`,
    [incidentId]
  );
  return rows[0].deleted;
}
