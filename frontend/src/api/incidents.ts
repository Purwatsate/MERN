import { apiRequest } from './client';
import type { ApiResponse, Incident, IncidentStatus } from '../types';

export async function getIncidents(status?: IncidentStatus) {
  const query = status ? `?status=${encodeURIComponent(status)}` : '';
  const res = await apiRequest<ApiResponse<Incident[]>>(`/api/incidents${query}`);
  return res.data ?? [];
}

export async function getIncident(id: number) {
  const res = await apiRequest<ApiResponse<Incident>>(`/api/incidents/${id}`);
  return res.data!;
}

export async function createIncident(data: Partial<Incident>) {
  const res = await apiRequest<ApiResponse<Incident>>('/api/incidents', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.data!;
}

export async function updateIncident(id: number, data: Partial<Incident>) {
  const res = await apiRequest<ApiResponse<Incident>>(`/api/incidents/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return res.data!;
}

export async function deleteIncident(id: number) {
  await apiRequest(`/api/incidents/${id}`, { method: 'DELETE' });
}
