import { apiRequest } from './client';
import type { ApiResponse, AuthUser } from '../types';

interface LoginResponse {
  success: boolean;
  data: { token: string; user: AuthUser };
}

export async function login(username: string, password: string) {
  const res = await apiRequest<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  return res.data;
}

export async function getMe() {
  const res = await apiRequest<ApiResponse<AuthUser>>('/api/auth/me');
  return res.data!;
}
