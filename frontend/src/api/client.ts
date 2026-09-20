const API_BASE = '/api/v1';

export const apiClient = {
  async get(url: string) {
    const token = localStorage.getItem('auth_token');
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}${url}`, { headers });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'API request failed' }));
      throw new Error(err.detail || 'API request failed');
    }
    return res.json();
  },

  async post(url: string, data: any) {
    const token = localStorage.getItem('auth_token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}${url}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'API request failed' }));
      throw new Error(err.detail || 'API request failed');
    }
    return res.json();
  },

  async uploadFile(url: string, formData: FormData) {
    const token = localStorage.getItem('auth_token');
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}${url}`, {
      method: 'POST',
      headers,
      body: formData
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'File upload failed' }));
      throw new Error(err.detail || 'File upload failed');
    }
    return res.json();
  }
};
