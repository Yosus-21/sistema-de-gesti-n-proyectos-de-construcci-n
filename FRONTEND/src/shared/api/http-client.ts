import type { ApiResponse } from './api-response.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class ApiError extends Error {
  public status: number;
  public errors?: Record<string, string[]>;

  constructor(status: number, message: string, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('accessToken');
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem('accessToken');
    window.dispatchEvent(new Event('auth:unauthorized'));
  }

  if (response.status === 403) {
    throw new ApiError(403, 'No tienes permisos para realizar esta acción.');
  }

  let data: ApiResponse<T>;
  try {
    data = await response.json();
  } catch {
    throw new ApiError(response.status, 'Invalid response from server');
  }

  if (!response.ok || !data.success) {
    throw new ApiError(response.status, data.message || 'An error occurred', data.errors);
  }

  return data.data;
}

export const httpClient = {
  get: <T>(endpoint: string, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'GET' }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  post: <T>(endpoint: string, body: any, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  put: <T>(endpoint: string, body: any, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  patch: <T>(endpoint: string, body: any, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(endpoint: string, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'DELETE' }),
};
