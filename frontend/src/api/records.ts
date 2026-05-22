import { apiRequest } from './client';
import type { ApiResponse, CriminalRecord, CriminalRole } from '../types';

export async function getRecordsByIncident(incidentId: number) {
  const res = await apiRequest<ApiResponse<CriminalRecord[]>>(
    `/api/criminal-records/incident/${incidentId}`
  );
  return res.data ?? [];
}

export async function getRecordsByPerson(personId: number) {
  const res = await apiRequest<ApiResponse<CriminalRecord[]>>(
    `/api/criminal-records/person/${personId}`
  );
  return res.data ?? [];
}

export async function createRecord(data: {
  person_id: number;
  incident_id: number;
  role: CriminalRole;
  arrest_date?: string | null;
  punishment?: string | null;
}) {
  const res = await apiRequest<ApiResponse<CriminalRecord>>('/api/criminal-records', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.data!;
}

export async function deleteRecord(id: number) {
  await apiRequest(`/api/criminal-records/${id}`, { method: 'DELETE' });
}
