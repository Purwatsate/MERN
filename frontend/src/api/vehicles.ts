import { apiRequest } from './client';
import type { ApiResponse, Vehicle } from '../types';

export async function searchVehicles(plate: string) {
  const res = await apiRequest<ApiResponse<Vehicle[]>>(
    `/api/vehicles/search?plate=${encodeURIComponent(plate)}`
  );
  return res.data ?? [];
}

export async function getVehicle(id: number) {
  const res = await apiRequest<ApiResponse<Vehicle>>(`/api/vehicles/${id}`);
  return res.data!;
}

export async function createVehicle(data: Partial<Vehicle>) {
  const res = await apiRequest<ApiResponse<Vehicle>>('/api/vehicles', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.data!;
}

export async function updateVehicle(id: number, data: Partial<Vehicle>) {
  const res = await apiRequest<ApiResponse<Vehicle>>(`/api/vehicles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return res.data!;
}

export async function deleteVehicle(id: number) {
  await apiRequest(`/api/vehicles/${id}`, { method: 'DELETE' });
}
