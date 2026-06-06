import { request } from './apiClient';

export function listGroupsApi() {
  return request('/groups', { auth: true });
}

export function getGroupApi(id) {
  return request(`/groups/${id}`, { auth: true });
}

export function createGroupApi(payload) {
  return request('/groups', {
    method: 'POST',
    auth: true,
    body: JSON.stringify(payload)
  });
}

export function updateGroupApi(id, payload) {
  return request(`/groups/${id}`, {
    method: 'PUT',
    auth: true,
    body: JSON.stringify(payload)
  });
}

export function deleteGroupApi(id) {
  return request(`/groups/${id}`, {
    method: 'DELETE',
    auth: true
  });
}
