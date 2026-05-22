import { apiRequest } from './client';
import type { ApiResponse, Person } from '../types';

export async function getPeople() {
  const res = await apiRequest<ApiResponse<Person[]>>('/api/people');
  return res.data ?? [];
}

export async function searchPeople(q: string) {
  const res = await apiRequest<ApiResponse<Person[]>>(
    `/api/people/search?q=${encodeURIComponent(q)}`
  );
  return res.data ?? [];
}

export async function getPerson(id: number) {
  const res = await apiRequest<ApiResponse<Person>>(`/api/people/${id}`);
  return res.data!;
}

export async function createPerson(data: Partial<Person>) {
  const res = await apiRequest<ApiResponse<Person>>('/api/people', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.data!;
}

export async function updatePerson(id: number, data: Partial<Person>) {
  const res = await apiRequest<ApiResponse<Person>>(`/api/people/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return res.data!;
}

export async function deletePerson(id: number) {
  await apiRequest(`/api/people/${id}`, { method: 'DELETE' });
}
