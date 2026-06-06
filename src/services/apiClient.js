import { API_BASE_URL } from '../config/api';
import { getToken } from './sessionStorage';

export async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (options.auth) {
    const token = await getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers
    });
  } catch {
    const error = new Error('network_error');
    error.payload = { error: 'network_error' };
    throw error;
  }

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(payload?.error || 'request_failed');
    error.payload = payload;
    error.status = response.status;
    throw error;
  }

  return payload;
}
