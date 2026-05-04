export const httpClient = {
  get: async <T>(url: string): Promise<T> => request<T>(url, { method: 'GET' }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  post: async <T>(url: string, body: any): Promise<T> => request<T>(url, { method: 'POST', body: JSON.stringify(body) }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  patch: async <T>(url: string, body: any): Promise<T> => request<T>(url, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: async <T>(url: string): Promise<T> => request<T>(url, { method: 'DELETE' }),
};

async function request<T>(path: string, options: RequestInit): Promise<T> {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const url = `${baseUrl}${path}`;
  
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  const token = localStorage.getItem('accessToken');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    localStorage.removeItem('accessToken');
    window.location.href = '/login';
    throw new Error('Sesión expirada o inválida');
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.message || response.statusText;
    throw new Error(message);
  }

  // NestJS backend usually wraps responses in { success, data, timestamp }
  // but let's safely return the generic data directly if wrapped, or fallback to raw
  if (data && typeof data === 'object' && 'success' in data && 'data' in data) {
    return data.data as T;
  }

  return data as T;
}
