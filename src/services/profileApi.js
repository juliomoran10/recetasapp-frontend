import { request } from './apiClient';

export function getProfileApi() {
  return request('/profile', { auth: true });
}

export function updateProfileApi(payload) {
  return request('/profile', {
    method: 'PATCH',
    auth: true,
    body: JSON.stringify(payload)
  });
}

export function deleteAccountApi() {
  return request('/profile', {
    method: 'DELETE',
    auth: true
  });
}
