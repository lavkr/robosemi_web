const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  const json = await response.json();
  // Unwrap standard {success, data} response shape
  return (json.data !== undefined ? json.data : json) as T;
}

export async function apiGet<T>(path: string, params?: Record<string, any>): Promise<T> {
  const url = new URL(`${API_BASE}${path.startsWith('/') ? path : '/' + path}`, typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  const response = await fetch(url.toString(), {
    credentials: 'include',
  });
  return handleResponse<T>(response);
}

export async function apiPost<T>(path: string, body?: any): Promise<T> {
  const url = `${API_BASE}${path.startsWith('/') ? path : '/' + path}`;
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  return handleResponse<T>(response);
}

export async function apiPut<T>(path: string, body?: any): Promise<T> {
  const url = `${API_BASE}${path.startsWith('/') ? path : '/' + path}`;
  const response = await fetch(url, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  return handleResponse<T>(response);
}

export async function apiDelete<T>(path: string): Promise<T> {
  const url = `${API_BASE}${path.startsWith('/') ? path : '/' + path}`;
  const response = await fetch(url, {
    method: 'DELETE',
    credentials: 'include',
  });
  return handleResponse<T>(response);
}
