export const resolveApiUrl = (endpoint: string): string => {
  let base = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api').trim();
  base = base.replace(/\/+$/, '');
  let cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  if (base.endsWith('/api') && cleanEndpoint.startsWith('/api/')) {
    cleanEndpoint = cleanEndpoint.substring(4);
  } else if (!base.endsWith('/api') && !cleanEndpoint.startsWith('/api/')) {
    base = `${base}/api`;
  }
  return `${base}${cleanEndpoint}`;
};

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('edux_token');
};

const authHeaders = (): Record<string, string> => {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  async get<T>(endpoint: string, customHeaders: Record<string, string> = {}): Promise<T> {
    const url = resolveApiUrl(endpoint);
    const res = await fetch(url, {
      method: 'GET',
      headers: { ...authHeaders(), ...customHeaders },
      cache: 'no-store',
    });

    const data = await res.json();
    if (!res.ok) {
      throw new ApiError(data.message || 'Request failed', res.status);
    }
    return data;
  },

  async post<T>(endpoint: string, body: any): Promise<T> {
    const url = resolveApiUrl(endpoint);
    const res = await fetch(url, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new ApiError(data.message || 'Request failed', res.status);
    }
    return data;
  },

  async put<T>(endpoint: string, body: any): Promise<T> {
    const url = resolveApiUrl(endpoint);
    const res = await fetch(url, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new ApiError(data.message || 'Request failed', res.status);
    }
    return data;
  },

  async patch<T>(endpoint: string, body?: any): Promise<T> {
    const url = resolveApiUrl(endpoint);
    const res = await fetch(url, {
      method: 'PATCH',
      headers: authHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new ApiError(data.message || 'Request failed', res.status);
    }
    return data;
  },

  async delete<T>(endpoint: string): Promise<T> {
    const url = resolveApiUrl(endpoint);
    const res = await fetch(url, {
      method: 'DELETE',
      headers: authHeaders(),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new ApiError(data.message || 'Request failed', res.status);
    }
    return data;
  },

  async uploadFile(file: File): Promise<any> {
    const token = getToken();
    const formData = new FormData();
    formData.append('file', file);

    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = resolveApiUrl('/media/upload');
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new ApiError(data.message || 'Upload failed', res.status);
    }
    return data;
  },
};
