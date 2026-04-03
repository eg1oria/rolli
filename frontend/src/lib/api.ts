import { getToken, removeToken } from './auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    removeToken();
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
      window.location.href = '/admin/login';
    }
    throw new ApiError(401, 'Не авторизован');
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: 'Ошибка сервера' }));
    throw new ApiError(res.status, body.message || 'Ошибка сервера');
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}

export function apiGet<T>(path: string): Promise<T> {
  return apiFetch<T>(path);
}

export function apiPost<T>(path: string, body: unknown): Promise<T> {
  return apiFetch<T>(path, {
    method: 'POST',
    body: body instanceof FormData ? body : JSON.stringify(body),
  });
}

export function apiPut<T>(path: string, body: unknown): Promise<T> {
  return apiFetch<T>(path, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export function apiPatch<T>(path: string, body: unknown): Promise<T> {
  return apiFetch<T>(path, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export function apiDelete(path: string): Promise<void> {
  return apiFetch<void>(path, { method: 'DELETE' });
}

export async function apiUpload(file: File, type: string = 'products'): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append('file', file);
  return apiFetch<{ url: string }>(`/upload?type=${type}`, {
    method: 'POST',
    body: formData,
  });
}

export { ApiError };
