import { request } from './apiClient';
import { saveToken, clearToken } from './sessionStorage';

export function loginApi({ username, password }) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  });
}

export async function loginAndSaveSession({ username, password }) {
  const result = await loginApi({ username, password });
  await saveToken(result.session?.token);
  return result;
}

export function registerApi({ username, email, password }) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password })
  });
}

export function forgotPasswordApi({ email }) {
  return request('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email })
  });
}

export function resetPasswordApi({ code, newPassword }) {
  return request('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ code, newPassword })
  });
}

export function meApi() {
  return request('/auth/me', { auth: true });
}

export async function logoutApi() {
  try {
    await request('/auth/logout', { method: 'POST', auth: true });
  } finally {
    await clearToken();
  }
}

export { clearToken } from './sessionStorage';
